#!/usr/bin/env python3
"""
Radiolarian Database Query Script
放射虫数据库查询脚本

Usage:
    python query_radiolarian_db.py --species "Pterocorys zancleum"
    python query_radiolarian_db.py --genus "Stylochlamydium" --format markdown
    python query_radiolarian_db.py --species "Pterocorys zancleum" --output result.json
"""

import argparse
import json
import sqlite3
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Any

try:
    import requests
except ImportError:
    requests = None
    print("Warning: requests package not installed. PBDB API queries disabled.")


class RadiolariaDatabase:
    """Radiolarian database query interface"""
    
    def __init__(self, db_path: str = None):
        """
        Initialize database connection
        
        Args:
            db_path: Path to SQLite database file
        """
        if db_path:
            db_path = os.path.expanduser(db_path)
        else:
            # Default path
            db_path = os.path.expanduser("~/.RadioClaw/data/radiolaria.db")
        
        self.db_path = db_path
        self.conn = None
        self.cursor = None
    
    def connect(self):
        """Connect to database"""
        if not os.path.exists(self.db_path):
            raise FileNotFoundError(f"Database not found: {self.db_path}")
        
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
    
    def query_species(self, species_name: str, include_references: bool = False) -> Optional[Dict]:
        """
        Query species information
        
        Args:
            species_name: Species name (e.g., "Pterocorys zancleum")
            include_references: Whether to include literature references
        
        Returns:
            Dictionary with species information or None if not found
        """
        if not self.cursor:
            self.connect()
        
        # Parse species name
        parts = species_name.split()
        if len(parts) >= 2:
            genus = parts[0]
            species = parts[1]
        else:
            genus = species_name
            species = None
        
        # Build query
        query = """
            SELECT t.*, 
                   s.fad_age, s.lad_age, s.fad_epoch, s.lad_epoch, s.biozone,
                   d.ocean_basin, d.latitude_min, d.latitude_max, 
                   d.longitude_min, d.longitude_max, d.type_locality
            FROM taxonomy t
            LEFT JOIN stratigraphic_range s ON t.id = s.taxonomy_id
            LEFT JOIN distribution d ON t.id = d.taxonomy_id
            WHERE t.genus = ?
        """
        
        params = [genus]
        
        if species:
            # Remove author year from species name for matching
            species_clean = species.split('(')[0].split(',')[0].strip()
            query += " AND t.species LIKE ?"
            params.append(f"%{species_clean}%")
        
        self.cursor.execute(query, params)
        row = self.cursor.fetchone()
        
        if not row:
            return None
        
        result = {
            "taxonomy": {
                "kingdom": row["kingdom"],
                "phylum": row["phylum"],
                "class": row["class"],
                "order": row["order_name"],
                "family": row["family"],
                "genus": row["genus"],
                "species": row["species"],
                "author_year": row["author_year"]
            },
            "stratigraphy": {
                "fad_age": row["fad_age"],
                "lad_age": row["lad_age"],
                "fad_epoch": row["fad_epoch"],
                "lad_epoch": row["lad_epoch"],
                "biozone": row["biozone"]
            },
            "distribution": {
                "ocean_basins": [row["ocean_basin"]] if row["ocean_basin"] else [],
                "latitude_range": f"{row['latitude_min']} - {row['latitude_max']}" if row['latitude_min'] else None,
                "type_locality": row["type_locality"]
            }
        }
        
        if include_references:
            result["references"] = self._get_references(row["id"])
        
        return result
    
    def _get_references(self, taxonomy_id: int) -> List[Dict]:
        """Get literature references for a taxon"""
        # Note: "references" is a SQL reserved word, use quotes
        self.cursor.execute(
            'SELECT * FROM "references" WHERE taxonomy_id = ?',
            [taxonomy_id]
        )
        
        refs = []
        for row in self.cursor.fetchall():
            refs.append({
                "author": row["author"],
                "year": row["year"],
                "title": row["title"],
                "journal": row["journal"],
                "volume": row["volume"],
                "pages": row["pages"],
                "doi": row["doi"]
            })
        
        return refs
    
    def query_genus(self, genus_name: str) -> List[Dict]:
        """
        Query all species in a genus
        
        Args:
            genus_name: Genus name
        
        Returns:
            List of species dictionaries
        """
        if not self.cursor:
            self.connect()
        
        self.cursor.execute(
            "SELECT * FROM taxonomy WHERE genus = ?",
            [genus_name]
        )
        
        species_list = []
        for row in self.cursor.fetchall():
            species_list.append({
                "species": row["species"],
                "author_year": row["author_year"],
                "genus": row["genus"],
                "family": row["family"]
            })
        
        return species_list


class PBDIClient:
    """Paleobiology Database API client"""
    
    BASE_URL = "https://paleobiodb.org/data1.2"
    
    def __init__(self):
        if not requests:
            raise ImportError("requests package required for PBDB API")
    
    def query_taxon(self, name: str) -> Optional[Dict]:
        """Query taxon information from PBDB"""
        url = f"{self.BASE_URL}/taxa/list.json"
        params = {"name": name}
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("records") and len(data["records"]) > 0:
                return data["records"][0]
            return None
        except Exception as e:
            print(f"PBDB API error: {e}")
            return None
    
    def query_strat_range(self, taxon_no: int) -> Optional[Dict]:
        """Query stratigraphic range from PBDB"""
        url = f"{self.BASE_URL}/stratRanges/list.json"
        params = {"taxon_no": taxon_no}
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("records"):
                return data["records"][0]
            return None
        except Exception as e:
            print(f"PBDB API error: {e}")
            return None


def format_markdown_result(result: Dict) -> str:
    """Format query result as markdown"""
    lines = []
    
    # Taxonomy
    if "taxonomy" in result:
        lines.append("### 分类信息 / Taxonomic Information")
        tax = result["taxonomy"]
        lines.append(f"- **界 / Kingdom**: {tax.get('kingdom', 'N/A')}")
        lines.append(f"- **门 / Phylum**: {tax.get('phylum', 'N/A')}")
        lines.append(f"- **纲 / Class**: {tax.get('class', 'N/A')}")
        lines.append(f"- **目 / Order**: {tax.get('order', 'N/A')}")
        lines.append(f"- **科 / Family**: {tax.get('family', 'N/A')}")
        lines.append(f"- **属 / Genus**: {tax.get('genus', 'N/A')}")
        lines.append(f"- **种 / Species**: {tax.get('species', 'N/A')} {tax.get('author_year', '')}")
        lines.append("")
    
    # Stratigraphy
    if "stratigraphy" in result:
        lines.append("### 地层范围 / Stratigraphic Range")
        strat = result["stratigraphy"]
        lines.append(f"- **首次出现 / FAD**: {strat.get('fad_age', 'N/A')} Ma ({strat.get('fad_epoch', '')})")
        lines.append(f"- **末次出现 / LAD**: {strat.get('lad_age', 'N/A')} Ma ({strat.get('lad_epoch', '')})")
        lines.append(f"- **生物带 / Biozones**: {strat.get('biozone', 'N/A')}")
        lines.append("")
    
    # Distribution
    if "distribution" in result:
        lines.append("### 地理分布 / Geographic Distribution")
        dist = result["distribution"]
        lines.append(f"- **典型产地 / Type Locality**: {dist.get('type_locality', 'N/A')}")
        if dist.get('ocean_basins'):
            lines.append(f"- **分布区域 / Distribution**: {', '.join(dist['ocean_basins'])}")
        lines.append("")
    
    # References
    if "references" in result and result["references"]:
        lines.append("### 文献引用 / Key References")
        for i, ref in enumerate(result["references"], 1):
            lines.append(f"{i}. {ref.get('author', '')} ({ref.get('year', '')}). {ref.get('title', '')}")
        lines.append("")
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="📊 Radiolarian Database Query / 放射虫数据库查询",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python query_radiolarian_db.py --species "Pterocorys zancleum"
  python query_radiolarian_db.py --genus "Stylochlamydium" --format markdown
  python query_radiolarian_db.py --species "Pterocorys zancleum" --output result.json --include-references
        """
    )
    
    parser.add_argument(
        "--species", "-s",
        help="Species name to query (e.g., 'Pterocorys zancleum')"
    )
    
    parser.add_argument(
        "--genus", "-g",
        help="Genus name to query"
    )
    
    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: stdout)"
    )
    
    parser.add_argument(
        "--format", "-f",
        choices=["json", "csv", "markdown"],
        default="json",
        help="Output format (default: json)"
    )
    
    parser.add_argument(
        "--include-references",
        action="store_true",
        help="Include literature references"
    )
    
    parser.add_argument(
        "--database",
        choices=["sqlite", "pbdb"],
        default="sqlite",
        help="Database type (default: sqlite)"
    )
    
    parser.add_argument(
        "--db-path",
        help="Path to SQLite database (default: ~/.RadioClaw/data/radiolaria.db)"
    )
    
    args = parser.parse_args()
    
    if not args.species and not args.genus:
        print("Error: Either --species or --genus is required")
        sys.exit(1)
    
    try:
        if args.database == "sqlite":
            # Query local SQLite database
            db = RadiolariaDatabase(args.db_path)
            db.connect()
            
            if args.species:
                result = db.query_species(args.species, args.include_references)
            else:
                species_list = db.query_genus(args.genus)
                result = {"genus": args.genus, "species_count": len(species_list), "species": species_list}
            
            db.close()
            
            if not result:
                print(f"❌ Species/genus not found in database")
                sys.exit(1)
        
        else:
            # Query PBDB API
            if not requests:
                print("Error: requests package required for PBDB API")
                sys.exit(1)
            
            pbdb = PBDIClient()
            
            if args.species:
                taxon = pbdb.query_taxon(args.species)
                result = {"taxonomy": taxon} if taxon else None
            else:
                taxon = pbdb.query_taxon(args.genus)
                result = {"taxonomy": taxon} if taxon else None
            
            if not result:
                print(f"❌ Species/genus not found in PBDB")
                sys.exit(1)
        
        # Format output
        if args.format == "json":
            output = json.dumps(result, ensure_ascii=False, indent=2)
        elif args.format == "markdown":
            output = format_markdown_result(result) if isinstance(result, dict) else str(result)
        elif args.format == "csv":
            # Simple CSV output for species list
            if isinstance(result, dict) and "species" in result:
                lines = ["species,genus,family"]
                for sp in result["species"]:
                    lines.append(f"{sp['species']},{sp['genus']},{sp['family']}")
                output = "\n".join(lines)
            else:
                output = str(result)
        
        # Write output
        if args.output:
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(output)
            print(f"✅ Results saved to: {args.output}")
        else:
            print(output)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
