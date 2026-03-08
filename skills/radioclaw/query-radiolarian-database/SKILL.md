---
name: query-radiolarian-database
description: 查询放射虫生物年代学和地层范围数据库 (Query radiolarian biochronology and stratigraphic range database)
homepage: https://github.com/RadioClaw/RadioClaw
metadata:
  {
    "RadioClaw":
      {
        "emoji": "📊",
        "requires": { "bins": ["sqlite3"], "env": [] },
        "primaryEnv": "",
        "install":
          [
            {
              "id": "sqlite3-brew",
              "kind": "brew",
              "formula": "sqlite3",
              "bins": ["sqlite3"],
              "label": "Install SQLite (brew)",
            },
          ],
      },
  }
---

# 📊 放射虫数据库查询技能 (Radiolarian Database Query)

查询放射虫种属的生物年代学信息、地层范围、分布记录和文献引用。支持 Paleobiology Database (PBDB) API 和本地 SQLite 数据库。

## 使用方法 / Usage

### 查询特定种属 / Query Specific Species

```bash
/radiolarian query --species "Stylochlamydium venustum"
```

### 查询特定属 / Query Specific Genus

```bash
/radiolarian query --genus "Pterocorys"
```

### 查询特定地层 / Query Specific Stratigraphic Layer

```bash
/radiolarian query --formation " Monterey Formation" --age "Miocene"
```

### 导出查询结果 / Export Results

```bash
/radiolarian query --species "Pterocorys zancleum" --output ./results/query_result.json
```

## 输出内容 / Output

### 地层范围信息 / Stratigraphic Range

```markdown
## 查询结果 / Query Results

### 分类信息 / Taxonomic Information
- **界 / Kingdom**: Protista
- **门 / Phylum**: Radiozoa
- **纲 / Class**: Polycystinea
- **目 / Order**: Nassellaria
- **科 / Family**: Pterocoryidae
- **属 / Genus**: Pterocorys
- **种 / Species**: Pterocorys zancleum (Haeckel, 1887)

### 地层范围 / Stratigraphic Range
- **首次出现 / First Appearance Datum (FAD)**: 11.6 Ma (晚中新世 / Late Miocene)
- **末次出现 / Last Appearance Datum (LAD)**: 3.6 Ma (早上新世 / Early Pliocene)
- **地质年代 / Geologic Period**: 中新世 - 上新世 (Miocene - Pliocene)
- **生物带 / Biozones**: CN10 - CN14 (Nigrini zones)

### 地理分布 / Geographic Distribution
- **典型产地 / Type Locality**: 热带太平洋 (Tropical Pacific)
- **分布区域 / Distribution**: 
  - 赤道太平洋 (Equatorial Pacific)
  - 印度洋 (Indian Ocean)
  - 大西洋热带海域 (Tropical Atlantic)
- **古纬度 / Paleolatitude**: 30°S - 30°N

### 古环境意义 / Paleoecological Significance
- **水团指示 / Water Mass Indicator**: 热带表层水 (Tropical Surface Water)
- **生产力指标 / Productivity Proxy**: 高生产力区域 (High Productivity)
- **温度偏好 / Temperature Preference**: 温暖水域 (>20°C)

### 文献引用 / Key References
1. Haeckel, E. (1887). Report on the Radiolaria collected by H.M.S. Challenger.
2. Nigrini, C. (1967). Radiolaria in pelagic sediments from the Indian and Atlantic Oceans.
3. Caulet, J.P. (1991). Radiolaires polycystines néogènes de l'océan Indien.
```

## 数据库配置 / Database Configuration

### 使用本地 SQLite 数据库 / Using Local SQLite Database

在 `~/.RadioClaw/RadioClaw.json` 中配置：

```json5
{
  "skills": {
    "query-radiolarian-database": {
      "database": {
        "type": "sqlite",
        "path": "~/.RadioClaw/data/radiolaria.db"
      }
    }
  }
}
```

### 使用 PBDB API / Using PBDB API

```json5
{
  "skills": {
    "query-radiolarian-database": {
      "database": {
        "type": "pbdb",
        "baseUrl": "https://paleobiodb.org/data1.2"
      }
    }
  }
}
```

## 脚本用法 / Script Usage

### Python 脚本查询

```bash
python scripts/query_radiolarian_db.py \
  --species "Pterocorys zancleum" \
  --output ./results/query.json \
  --format json \
  --include-references
```

### 参数说明 / Parameters

| 参数 / Parameter | 说明 / Description | 默认值 / Default |
|-----------------|-------------------|-----------------|
| `--species` | 种名 | 可选 |
| `--genus` | 属名 | 可选 |
| `--family` | 科名 | 可选 |
| `--formation` | 地层组名 | 可选 |
| `--age` | 地质年代 | 可选 |
| `--output` | 输出文件路径 | `stdout` |
| `--format` | 输出格式 (json/csv/markdown) | `json` |
| `--include-references` | 包含文献引用 | `false` |
| `--database` | 数据库类型 (sqlite/pbdb) | `sqlite` |

## 数据库结构 / Database Schema

### 放射虫数据表 / Radiolaria Tables

```sql
-- 分类表 / Taxonomy Table
CREATE TABLE taxonomy (
    id INTEGER PRIMARY KEY,
    kingdom TEXT,
    phylum TEXT,
    class TEXT,
    order_name TEXT,
    family TEXT,
    genus TEXT,
    species TEXT,
    author_year TEXT,
    original_combination TEXT
);

-- 地层范围表 / Stratigraphic Range Table
CREATE TABLE stratigraphic_range (
    taxonomy_id INTEGER,
    fad_age REAL,  -- First Appearance Datum (Ma)
    lad_age REAL,  -- Last Appearance Datum (Ma)
    fad_epoch TEXT,
    lad_epoch TEXT,
    biozone TEXT,
    PRIMARY KEY (taxonomy_id)
);

-- 地理分布表 / Geographic Distribution Table
CREATE TABLE distribution (
    taxonomy_id INTEGER,
    ocean_basin TEXT,
    latitude_min REAL,
    latitude_max REAL,
    longitude_min REAL,
    longitude_max REAL,
    type_locality TEXT
);

-- 文献引用表 / References Table
CREATE TABLE references (
    id INTEGER PRIMARY KEY,
    taxonomy_id INTEGER,
    author TEXT,
    year INTEGER,
    title TEXT,
    journal TEXT,
    volume TEXT,
    pages TEXT,
    doi TEXT
);
```

## API 配置 / API Configuration

### PBDB API 端点 / PBDB API Endpoints

```bash
# 查询分类信息
GET https://paleobiodb.org/data1.2/taxa/list.json?name=Pterocorys

# 查询地层范围
GET https://paleobiodb.org/data1.2/stratRanges/list.json?taxon_no=12345

# 查询地理分布
GET https://paleobiodb.org/data1.2/occurrences/list.json?taxon_no=12345
```

### 率限制 / Rate Limits

- PBDB API: 100 请求/分钟
- 建议本地缓存查询结果

## 输出示例 / Output Example

### JSON 格式输出

```json
{
  "query": {
    "species": "Pterocorys zancleum",
    "timestamp": "2026-03-08T10:30:00Z",
    "database": "sqlite"
  },
  "taxonomy": {
    "kingdom": "Protista",
    "phylum": "Radiozoa",
    "class": "Polycystinea",
    "order": "Nassellaria",
    "family": "Pterocoryidae",
    "genus": "Pterocorys",
    "species": "Pterocorys zancleum",
    "author_year": "(Haeckel, 1887)"
  },
  "stratigraphy": {
    "fad_age": 11.6,
    "lad_age": 3.6,
    "fad_epoch": "Late Miocene",
    "lad_epoch": "Early Pliocene",
    "biozone": "CN10 - CN14",
    "period": "Miocene - Pliocene"
  },
  "distribution": {
    "type_locality": "Tropical Pacific",
    "ocean_basins": ["Equatorial Pacific", "Indian Ocean", "Tropical Atlantic"],
    "paleolatitude": "30°S - 30°N"
  },
  "paleoecology": {
    "water_mass": "Tropical Surface Water",
    "productivity": "High Productivity",
    "temperature_preference": ">20°C"
  },
  "references": [
    {
      "author": "Haeckel, E.",
      "year": 1887,
      "title": "Report on the Radiolaria collected by H.M.S. Challenger",
      "journal": "Challenger Expedition Reports"
    },
    {
      "author": "Nigrini, C.",
      "year": 1967,
      "title": "Radiolaria in pelagic sediments from the Indian and Atlantic Oceans",
      "journal": "Bulletin of the Scripps Institution of Oceanography"
    }
  ]
}
```

### CSV 格式输出

```csv
species,genus,family,order,fad_age,lad_age,biozone,type_locality
Pterocorys zancleum,Pterocorys,Pterocoryidae,Nassellaria,11.6,3.6,CN10-CN14,Tropical Pacific
```

## 数据库初始化 / Database Initialization

### 导入 PBDB 数据

```bash
python scripts/init_radiolaria_db.py \
  --source pbdb \
  --output ~/.RadioClaw/data/radiolaria.db \
  --groups Nassellaria,Spumellaria
```

### 导入自定义数据

```bash
python scripts/init_radiolaria_db.py \
  --source csv \
  --input ./data/custom_radiolaria.csv \
  --output ~/.RadioClaw/data/radiolaria.db
```

## 注意事项 / Notes

1. **数据准确性 / Data Accuracy**
   - 本地数据库需要定期更新
   - 建议与 PBDB API 交叉验证
   - 分类学命名可能随研究进展而变化

2. **查询性能 / Query Performance**
   - 大型数据库建议使用索引
   - 常用查询结果可缓存
   - 批量查询使用 CSV 输出

3. **数据完整性 / Data Completeness**
   - 某些稀有种属可能缺少地层数据
   - 地理分布信息可能不完整
   - 建议补充区域性地层资料

## 参考文献 / References

### 数据库资源

1. **Paleobiology Database (PBDB)**
   - https://paleobiodb.org
   - 综合性古生物数据库

2. **Radiolaria.org**
   - https://radiolaria.org
   - 放射虫分类学专门数据库

3. **Geobiodiversity Database (GBDB)**
   - https://gbdb-pub.org
   - 地层和古生物数据

### 地层年代表

- **国际地层委员会 (ICS)** 地质年代表
- **Gradstein et al. (2012)** - The Geologic Time Scale 2012

---

**🦞 EXFOLIATE! 让数据库揭示放射虫的时空分布奥秘！**
