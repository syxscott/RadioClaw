# 🦠 RadioClaw Radiolaria Skills

放射虫（Radiolaria）研究专用技能包，包含 SEM 图像识别、数据库查询和地层柱状图生成三大核心功能。

## 📦 技能列表 / Skills List

### 1. 🦠 image-identify-radiolarian - SEM 图像识别

**功能 / Features:**
- 识别 SEM/显微照片中的放射虫骨骼特征
- 提供种属分类建议（目/科/属/种级别）
- 输出形态特征描述和置信度评估
- 支持双语输出（中文/英文）

**使用方法 / Usage:**
```bash
# 上传 SEM 照片进行智能分析
/radiolarian identify --image ./samples/SEM_001.jpg --detailed

# 指定分类级别
/radiolarian identify --image ./samples/SEM_001.jpg --level genus
```

**脚本 / Script:**
```bash
python scripts/identify_radiolarian.py \
  --image ./samples/SEM_001.jpg \
  --output ./results/analysis.json \
  --detailed
```

---

### 2. 📊 query-radiolarian-database - 数据库查询

**功能 / Features:**
- 查询放射虫种属的地层范围
- 支持 Paleobiology Database (PBDB) API
- 支持本地 SQLite 数据库
- 输出地理分布和古环境信息

**使用方法 / Usage:**
```bash
# 查询特定种属
/radiolarian query --species "Stylochlamydium venustum"

# 查询特定属
/radiolarian query --genus "Pterocorys"

# 导出查询结果
/radiolarian query --species "Pterocorys zancleum" --output result.json
```

**脚本 / Script:**
```bash
python scripts/query_radiolarian_db.py \
  --species "Pterocorys zancleum" \
  --output ./results/query.json \
  --format json \
  --include-references
```

---

### 3. 📈 generate-stratigraphic-chart - 地层柱状图生成

**功能 / Features:**
- 根据样本数据自动生成地层对比图
- 支持 PDF/PNG/SVG 多种格式
- 支持 LaTeX 代码生成
- 支持多井对比图生成

**使用方法 / Usage:**
```bash
# 生成地层柱状图
/radiolarian strat-chart --samples ./data/samples.csv --output ./output/strat_column.pdf

# 指定输出格式
/radiolarian strat-chart --samples ./data/samples.csv --format png --dpi 300

# 多井对比
/radiolarian correlate \
  --well-1 ./data/well_A.csv \
  --well-2 ./data/well_B.csv \
  --output ./output/correlation.pdf
```

**脚本 / Script:**
```bash
python scripts/generate_strat_chart.py \
  --input ./data/samples.csv \
  --output ./output/strat_column.pdf \
  --title "Study Area Stratigraphic Column"
```

---

## 🚀 安装 / Installation

### 系统依赖 / System Dependencies

#### macOS
```bash
# 安装 SQLite
brew install sqlite3

# 安装 LaTeX (用于生成 PDF)
brew install mactex-no-gui

# 添加 pdflatex 到 PATH
export PATH="/Library/TeX/Default/bin/x86_64-darwin:$PATH"
```

#### Linux
```bash
# 安装 SQLite 和 LaTeX
sudo apt-get install sqlite3 texlive-latex-base texlive-pictures
```

#### Windows (WSL2)
```bash
# 在 WSL2 中安装
sudo apt-get update
sudo apt-get install sqlite3 texlive-latex-base texlive-pictures python3-pip
```

### Python 依赖 / Python Dependencies

```bash
# 进入技能目录
cd skills/radioclaw

# 安装 Python 依赖
pip install openai pandas matplotlib requests
```

### 数据库初始化 / Database Initialization

```bash
# 创建数据库目录
mkdir -p ~/.RadioClaw/data

# 初始化放射虫数据库（可选）
python scripts/init_radiolaria_db.py \
  --source pbdb \
  --output ~/.RadioClaw/data/radiolaria.db \
  --groups Nassellaria,Spumellaria
```

---

## 📁 目录结构 / Directory Structure

```
skills/radioclaw/
├── README.md                           # 本文件
├── image-identify-radiolarian/
│   ├── SKILL.md                        # 技能说明文档
│   └── scripts/
│       └── identify_radiolarian.py     # SEM 图像识别脚本
├── query-radiolarian-database/
│   ├── SKILL.md                        # 技能说明文档
│   └── scripts/
│       └── query_radiolarian_db.py     # 数据库查询脚本
└── generate-stratigraphic-chart/
    ├── SKILL.md                        # 技能说明文档
    └── scripts/
        └── generate_strat_chart.py     # 地层柱状图生成脚本
```

---

## 🔧 配置 / Configuration

### RadioClaw 配置文件

在 `~/.RadioClaw/RadioClaw.json` 中添加：

```json5
{
  "skills": {
    "image-identify-radiolarian": {
      "apiKey": "sk-...",  // OpenAI API 密钥
      "model": "gpt-4o",
      "maxTokens": 2000
    },
    "query-radiolarian-database": {
      "database": {
        "type": "sqlite",
        "path": "~/.RadioClaw/data/radiolaria.db"
      }
    },
    "generate-stratigraphic-chart": {
      "defaultFormat": "pdf",
      "defaultDpi": 300,
      "style": "~/.RadioClaw/styles/strat_chart_style.json"
    }
  }
}
```

---

## 📊 输入数据格式 / Input Data Format

### 样本数据 CSV 格式

```csv
sample_id,depth_m,age_ma,epoch,species,genus,family,count,abundance
SAM001,10.5,5.2,Pliocene,Pterocorys zancleum,Pterocorys,Pterocoryidae,15,common
SAM002,15.3,7.8,Late Miocene,Stylochlamydium venustum,Stylochlamydium,Pterocoryidae,8,rare
SAM003,22.1,10.5,Late Miocene,Pterocorys zancleum,Pterocorys,Pterocoryidae,23,abundant
SAM004,30.7,12.3,Middle Miocene,Stylochlamydium venustum,Stylochlamydium,Pterocoryidae,5,rare
```

### 必需字段 / Required Fields

| 字段 / Field | 说明 / Description | 类型 / Type |
|-------------|-------------------|------------|
| `sample_id` | 样本编号 | String |
| `depth_m` | 采样深度（米） | Float |
| `age_ma` | 地质年龄（百万年） | Float |
| `species` | 种名 | String |
| `genus` | 属名 | String |

---

## 📚 参考文献 / References

### 分类学权威资源

1. **Haeckel, E. (1887)**
   - *Report on the Radiolaria collected by H.M.S. Challenger*

2. **Nigrini, C. & Caulet, J.P. (1992)**
   - *Late Cenozoic Radiolarian Biostratigraphy of the Equatorial Pacific*

3. **Radiolaria.org**
   - 在线放射虫分类数据库
   - https://radiolaria.org

4. **Paleobiology Database (PBDB)**
   - 古生物数据库
   - https://paleobiodb.org

### 地层年代表

- **国际地层委员会 (ICS)** 地质年代表
- **Gradstein et al. (2012)** - The Geologic Time Scale

---

## 🤝 贡献 / Contributing

欢迎贡献新的放射虫研究技能！

### 添加新技能

1. 在 `skills/radioclaw/` 下创建新文件夹
2. 添加 `SKILL.md` 说明文档
3. 在 `scripts/` 下添加实现脚本
4. 更新本 README 文件

### 改进现有技能

- 提交 Issue 报告问题
- 提交 Pull Request 改进代码
- 分享你的使用案例和最佳实践

---

## 📄 许可证 / License

MIT License - 详见 [RadioClaw 主项目许可证](../../LICENSE)

---

## 🦞 联系方式 / Contact

- 🌐 官网：[https://RadioClaw.ai](https://RadioClaw.ai)
- 📧 Email: contact@RadioClaw.ai
- 💬 Discord: [加入社区](https://discord.gg/clawd)

---

**🦞 EXFOLIATE! 让放射虫的硅质骨架揭示古海洋的秘密！**
