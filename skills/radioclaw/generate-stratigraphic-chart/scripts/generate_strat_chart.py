#!/usr/bin/env python3
"""
Radiolarian Stratigraphic Chart Generator
放射虫地层柱状图生成器

Usage:
    python generate_strat_chart.py --input samples.csv --output strat_column.pdf
    python generate_strat_chart.py --input samples.csv --format png --dpi 300
"""

import argparse
import csv
import json
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

try:
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    from matplotlib.collections import PatchCollection
except ImportError:
    print("Error: matplotlib not installed. Run: pip install matplotlib")
    sys.exit(1)

try:
    import pandas as pd
except ImportError:
    print("Error: pandas not installed. Run: pip install pandas")
    sys.exit(1)


# Geological time scale (Ma)
GEOLOGIC_TIME_SCALE = {
    "Holocene": (0, 0.0117),
    "Pleistocene": (0.0117, 2.58),
    "Pliocene": (2.58, 5.333),
    "Late Miocene": (5.333, 11.63),
    "Middle Miocene": (11.63, 15.97),
    "Early Miocene": (15.97, 23.03),
    "Late Oligocene": (23.03, 27.82),
    "Early Oligocene": (27.82, 33.9),
    "Late Eocene": (33.9, 37.8),
    "Middle Eocene": (37.8, 47.8),
    "Early Eocene": (47.8, 56.0),
}


def load_samples(input_file: str) -> pd.DataFrame:
    """Load sample data from CSV file"""
    df = pd.read_csv(input_file)
    
    # Validate required columns
    required_cols = ['sample_id', 'depth_m', 'age_ma', 'species', 'genus']
    missing_cols = [col for col in required_cols if col not in df.columns]
    
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    return df


def get_epoch_name(age_ma: float) -> str:
    """Get geologic epoch name from age in Ma"""
    for epoch, (start, end) in GEOLOGIC_TIME_SCALE.items():
        if start <= age_ma < end:
            return epoch
    return "Unknown"


def generate_stratigraphic_chart(
    df: pd.DataFrame,
    output_file: str,
    title: str = "Radiolarian Stratigraphic Column",
    width: float = 11.7,
    height: float = 16.5,
    dpi: int = 300,
    color_scheme: str = "default",
    show_legend: bool = True,
    style_file: str = None,
) -> str:
    """
    Generate stratigraphic chart
    
    Args:
        df: DataFrame with sample data
        output_file: Output file path
        title: Chart title
        width: Figure width in inches
        height: Figure height in inches
        dpi: Resolution for raster output
        color_scheme: Color scheme name
        show_legend: Whether to show legend
        style_file: Path to style JSON file
    
    Returns:
        Output file path
    """
    # Load custom style if provided
    style = {}
    if style_file and os.path.exists(style_file):
        with open(style_file, 'r') as f:
            style = json.load(f)
    
    # Create figure
    fig, ax = plt.subplots(figsize=(width, height), dpi=100)
    
    # Get unique species
    species_list = df['species'].unique()
    genus_list = df['genus'].unique()
    
    # Generate colors for species
    if color_scheme == "vibrant":
        cmap = plt.get_cmap('tab20')
    elif color_scheme == "grayscale":
        cmap = plt.get_cmap('gray_r')
    else:
        cmap = plt.get_cmap('Set1')
    
    species_colors = {sp: cmap(i % cmap.N) for i, sp in enumerate(species_list)}
    
    # Plot species ranges
    patches = []
    for i, species in enumerate(species_list):
        sp_data = df[df['species'] == species]
        min_age = sp_data['age_ma'].min()
        max_age = sp_data['age_ma'].max()
        min_depth = sp_data['depth_m'].min()
        max_depth = sp_data['depth_m'].max()
        
        # Create range bar
        x_pos = i + 1
        rect = mpatches.Rectangle(
            (x_pos - 0.4, min_depth),
            0.8,
            max_depth - min_depth,
            linewidth=0,
            facecolor=species_colors[species],
            alpha=0.7,
            label=species
        )
        patches.append(rect)
        
        # Add species label
        ax.text(
            x_pos,
            (min_depth + max_depth) / 2,
            species,
            ha='center',
            va='center',
            fontsize=9,
            rotation=90,
            color='white',
            fontweight='bold'
        )
    
    # Add patches to plot
    for patch in patches:
        ax.add_patch(patch)
    
    # Set axis limits
    ax.set_xlim(0, len(species_list) + 1)
    ax.set_ylim(df['depth_m'].max() + 10, 0)
    
    # Add depth scale
    ax.set_ylabel('Depth (m)', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.3, linestyle='--')
    
    # Add sample markers
    for _, row in df.iterrows():
        ax.plot(
            len(species_list) / 2,
            row['depth_m'],
            'o',
            color='black',
            markersize=6,
            markeredgecolor='white',
            markeredgewidth=1
        )
    
    # Add title
    ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
    
    # Add legend if requested
    if show_legend:
        legend_patches = [
            mpatches.Patch(color=species_colors[sp], label=sp)
            for sp in species_list
        ]
        ax.legend(
            handles=legend_patches,
            loc='upper right',
            bbox_to_anchor=(1.1, 1),
            fontsize=8
        )
    
    # Adjust layout
    plt.tight_layout()
    
    # Save figure
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    if output_file.lower().endswith('.pdf'):
        plt.savefig(output_file, dpi=dpi, bbox_inches='tight')
    elif output_file.lower().endswith('.png'):
        plt.savefig(output_file, dpi=dpi, bbox_inches='tight')
    elif output_file.lower().endswith('.svg'):
        plt.savefig(output_file, bbox_inches='tight')
    else:
        # Default to PDF
        plt.savefig(output_file, dpi=dpi, bbox_inches='tight')
    
    plt.close()
    
    return output_file


def generate_latex_code(
    df: pd.DataFrame,
    title: str = "Radiolarian Stratigraphic Column",
    output_file: str = None,
) -> str:
    """
    Generate LaTeX code for stratigraphic chart
    
    Args:
        df: DataFrame with sample data
        title: Chart title
        output_file: Output .tex file path
    
    Returns:
        LaTeX code string
    """
    species_list = df['species'].unique()
    
    latex_code = f"""\\documentclass[a4paper,12pt]{{article}}
\\usepackage{{tikz}}
\\usepackage{{pgfgantt}}
\\usepackage{{geometry}}
\\usepackage{{fontspec}}

\\geometry{{left=1cm,right=1cm,top=2cm,bottom=2cm}}

\\begin{{document}}
\\begin{{center}}
\\begin{{tikzpicture}}[scale=1.0]
  % Title
  \\node[anchor=center] at (0,1) {{\\Large\\textbf{{{title}}}}};
  
  % Depth scale
  \\draw[->,thick] (-0.5,0) -- (-0.5,-{df['depth_m'].max()}) node[below] {{Depth (m)}};
  
  % Age scale
  \\draw[->,thick] ({len(species_list) + 1},0) -- ({len(species_list) + 1},-{df['depth_m'].max()}) node[below] {{Age (Ma)}};
  
  % Species ranges
"""
    
    # Add species ranges
    for i, species in enumerate(species_list):
        sp_data = df[df['species'] == species]
        min_depth = sp_data['depth_m'].min()
        max_depth = sp_data['depth_m'].max()
        latex_code += f"  \\draw[blue,thick] ({i + 1},{-min_depth}) -- ({i + 1},{-max_depth});  % {species}\n"
    
    # Add sample markers
    latex_code += """
  % Sample markers
"""
    for _, row in df.iterrows():
        latex_code += f"  \\node[circle,fill,inner sep=2pt] at ({len(species_list)/2},{-row['depth_m']}) {{}};  % {row['sample_id']}\n"
    
    latex_code += """
\\end{tikzpicture}
\end{center}
\end{document}
"""
    
    # Save to file if requested
    if output_file:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(latex_code)
    
    return latex_code


def main():
    parser = argparse.ArgumentParser(
        description="📈 Radiolarian Stratigraphic Chart Generator / 放射虫地层柱状图生成器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_strat_chart.py --input samples.csv --output strat_column.pdf
  python generate_strat_chart.py --input samples.csv --format png --dpi 300
  python generate_strat_chart.py --input samples.csv --title "My Study Area" --style custom.json
        """
    )
    
    parser.add_argument(
        "--input", "-i",
        required=True,
        help="Input CSV file with sample data"
    )
    
    parser.add_argument(
        "--output", "-o",
        required=True,
        help="Output file path (PDF/PNG/SVG)"
    )
    
    parser.add_argument(
        "--format", "-f",
        choices=["pdf", "png", "svg", "latex"],
        default="pdf",
        help="Output format (default: pdf)"
    )
    
    parser.add_argument(
        "--title", "-t",
        default="Radiolarian Stratigraphic Column",
        help="Chart title"
    )
    
    parser.add_argument(
        "--width",
        type=float,
        default=11.7,
        help="Figure width in inches (default: 11.7)"
    )
    
    parser.add_argument(
        "--height",
        type=float,
        default=16.5,
        help="Figure height in inches (default: 16.5)"
    )
    
    parser.add_argument(
        "--dpi",
        type=int,
        default=300,
        help="Image resolution (default: 300)"
    )
    
    parser.add_argument(
        "--color-scheme",
        choices=["default", "vibrant", "grayscale"],
        default="default",
        help="Color scheme (default: default)"
    )
    
    parser.add_argument(
        "--style",
        help="Path to custom style JSON file"
    )
    
    parser.add_argument(
        "--no-legend",
        action="store_true",
        help="Disable legend"
    )
    
    args = parser.parse_args()
    
    try:
        # Load data
        print(f"📊 Loading sample data from: {args.input}")
        df = load_samples(args.input)
        print(f"   Found {len(df)} samples, {df['species'].nunique()} species")
        
        # Generate chart
        print(f"📈 Generating stratigraphic chart...")
        
        if args.format == "latex":
            # Generate LaTeX code
            output_file = args.output if args.output.endswith('.tex') else args.output + '.tex'
            latex_code = generate_latex_code(
                df=df,
                title=args.title,
                output_file=output_file
            )
            print(f"✅ LaTeX code saved to: {output_file}")
        else:
            # Generate image/PDF
            output_file = generate_stratigraphic_chart(
                df=df,
                output_file=args.output,
                title=args.title,
                width=args.width,
                height=args.height,
                dpi=args.dpi,
                color_scheme=args.color_scheme,
                show_legend=not args.no_legend,
                style_file=args.style,
            )
            print(f"✅ Chart saved to: {output_file}")
        
        # Print MEDIA line for RadioClaw integration
        print(f"\nMEDIA: {output_file}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
