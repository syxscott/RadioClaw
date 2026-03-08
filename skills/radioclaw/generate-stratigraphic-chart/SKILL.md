---
name: generate-stratigraphic-chart
description: 生成放射虫地层柱状图和对比图 (Generate radiolarian stratigraphic columns and correlation charts)
homepage: https://github.com/RadioClaw/RadioClaw
metadata:
  {
    "RadioClaw":
      {
        "emoji": "📈",
        "requires": { "bins": ["pdflatex", "python3"], "env": [] },
        "primaryEnv": "",
        "install":
          [
            {
              "id": "mactex-brew",
              "kind": "brew",
              "formula": "mactex-no-gui",
              "bins": ["pdflatex"],
              "label": "Install LaTeX (macOS)",
              "os": ["darwin"],
            },
            {
              "id": "texlive-apt",
              "kind": "apt",
              "package": "texlive-latex-base",
              "bins": ["pdflatex"],
              "label": "Install LaTeX (Linux)",
              "os": ["linux"],
            },
          ],
      },
  }
---

# 📈 放射虫地层柱状图生成技能 (Radiolarian Stratigraphic Chart Generator)

根据样本数据自动生成 LaTeX 或图像格式的地层对比图和放射虫分布柱状图。

## 使用方法 / Usage

### 基础用法 / Basic Usage

```bash
/radiolarian strat-chart --samples ./data/samples.csv --output ./output/strat_column.pdf
```

### 指定格式 / Specify Format

```bash
# LaTeX/PDF 格式
/radiolarian strat-chart --samples ./data/samples.csv --format pdf --output result.pdf

# PNG 图像格式
/radiolarian strat-chart --samples ./data/samples.csv --format png --output result.png

# SVG 矢量图格式
/radiolarian strat-chart --samples ./data/samples.csv --format svg --output result.svg
```

### 多井对比 / Multi-well Correlation

```bash
/radiolarian correlate \
  --well-1 ./data/well_A.csv \
  --well-2 ./data/well_B.csv \
  --well-3 ./data/well_C.csv \
  --output ./output/correlation_chart.pdf
```

### 自定义样式 / Custom Style

```bash
/radiolarian strat-chart \
  --samples ./data/samples.csv \
  --style ./styles/custom_style.json \
  --title "Study Area Stratigraphic Column" \
  --output result.pdf
```

## 输入数据格式 / Input Data Format

### CSV 样本文件格式

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

### 可选字段 / Optional Fields

| 字段 / Field | 说明 / Description | 类型 / Type |
|-------------|-------------------|------------|
| `epoch` | 地质时代 | String |
| `family` | 科名 | String |
| `count` | 个体数量 | Integer |
| `abundance` | 丰度 (rare/common/abundant) | String |
| `formation` | 地层组名 | String |
| `location` | 采样位置 | String |

## 输出内容 / Output

### PDF 地层柱状图

生成的 PDF 文件包含：

1. **深度标尺 / Depth Scale** (左侧)
2. **地质年代标尺 / Geologic Time Scale** (右侧)
3. **放射虫分布范围 / Radiolarian Range** (中间)
4. **样本位置标记 / Sample Position Markers**
5. **图例 / Legend**

### PNG/SVG 图像

- 高分辨率图像（默认 300 DPI）
- 可自定义尺寸和配色
- 适合插入论文和报告

## 脚本用法 / Script Usage

### Python 脚本生成

```bash
python scripts/generate_strat_chart.py \
  --input ./data/samples.csv \
  --output ./output/strat_column.pdf \
  --format pdf \
  --title "Radiolarian Stratigraphic Column" \
  --width 11.7 \
  --height 16.5 \
  --dpi 300
```

### 参数说明 / Parameters

| 参数 / Parameter | 说明 / Description | 默认值 / Default |
|-----------------|-------------------|-----------------|
| `--input` | 输入 CSV 文件路径 | 必需 |
| `--output` | 输出文件路径 | 必需 |
| `--format` | 输出格式 (pdf/png/svg) | `pdf` |
| `--title` | 图表标题 | 自动生成 |
| `--width` | 图表宽度（英寸） | `11.7` (A4) |
| `--height` | 图表高度（英寸） | `16.5` (A4) |
| `--dpi` | 图像分辨率 | `300` |
| `--style` | 样式配置文件 | 默认样式 |
| `--show-legend` | 显示图例 | `true` |
| `--color-scheme` | 配色方案 (default/vibrant/grayscale) | `default` |

## LaTeX 模板 / LaTeX Template

### 生成的 LaTeX 代码结构

```latex
\documentclass[a4paper,12pt]{article}
\usepackage{tikz}
\usepackage{pgfgantt}
\usepackage{geometry}
\usepackage{fontspec}
\usepackage{xeCJK}

\geometry{left=1cm,right=1cm,top=2cm,bottom=2cm}

\begin{document}
\begin{center}
\begin{tikzpicture}[scale=1.0]
  % Title
  \node[anchor=center] at (0,1) {\Large\textbf{Radiolarian Stratigraphic Column}};
  
  % Depth scale
  \draw[->] (-0.5,0) -- (-0.5,-15) node[below] {Depth (m)};
  
  % Age scale
  \draw[->] (15,0) -- (15,-15) node[below] {Age (Ma)};
  
  % Species ranges
  \draw[blue,thick] (2,-2) -- (12,-5);  % Pterocorys zancleum
  \draw[red,thick] (3,-6) -- (10,-10);  % Stylochlamydium venustum
  
  % Sample markers
  \node[circle,fill,inner sep=2pt] at (0,-3) {};
  \node[circle,fill,inner sep=2pt] at (0,-7) {};
\end{tikzpicture}
\end{center}
\end{document}
```

## 样式配置 / Style Configuration

### 自定义样式文件 (JSON)

```json
{
  "title": {
    "font": "Arial",
    "size": 18,
    "color": "#000000"
  },
  "depth_scale": {
    "color": "#333333",
    "width": 2,
    "label_font": "Arial",
    "label_size": 10
  },
  "age_scale": {
    "color": "#666666",
    "width": 2,
    "epochs": ["Pliocene", "Late Miocene", "Middle Miocene"]
  },
  "species_ranges": {
    "line_width": 3,
    "colors": {
      "Pterocorys": "#1f77b4",
      "Stylochlamydium": "#ff7f0e",
      "default": "#2ca02c"
    }
  },
  "sample_markers": {
    "shape": "circle",
    "size": 5,
    "color": "#000000",
    "filled": true
  },
  "legend": {
    "position": "bottom_right",
    "font": "Arial",
    "size": 9
  }
}
```

## 输出示例 / Output Example

### 地层柱状图示例

```
┌────────────────────────────────────────────────────────────────┐
│          Radiolarian Stratigraphic Column - Study Area         │
├──────────┬───────────────────────────────┬────────────────────┤
│ Depth(m) │    Species Distribution       │    Age (Ma)        │
├──────────┼───────────────────────────────┼────────────────────┤
│    0     │                               │         0          │
│          │                               │                    │
│   10     │  ● P. zancleum ────────       │         5          │
│          │                               │    Pliocene        │
│   20     │  ● S. venustum ────────       │        10          │
│          │                               │  Late Miocene      │
│   30     │  ● P. zancleum ────────       │        15          │
│          │                               │ Middle Miocene     │
│   40     │                               │        20          │
└──────────┴───────────────────────────────┴────────────────────┘
```

## 多井对比功能 / Multi-well Correlation

### 输入格式

```csv
# well_A.csv
sample_id,depth_m,age_ma,species,genus
A001,10.5,5.2,Pterocorys zancleum,Pterocorys
A002,20.3,8.5,Stylochlamydium venustum,Stylochlamydium

# well_B.csv
sample_id,depth_m,age_ma,species,genus
B001,15.2,5.5,Pterocorys zancleum,Pterocorys
B002,25.8,9.2,Stylochlamydium venustum,Stylochlamydium
```

### 生成对比图

```bash
/radiolarian correlate \
  --wells ./data/well_A.csv ./data/well_B.csv \
  --output ./output/well_correlation.pdf \
  --title "Multi-well Stratigraphic Correlation"
```

## 依赖安装 / Dependencies Installation

### macOS

```bash
# 安装 LaTeX
brew install mactex-no-gui

# 添加 pdflatex 到 PATH
export PATH="/Library/TeX/Default/bin/x86_64-darwin:$PATH"

# 安装 Python 依赖
pip install pandas matplotlib reportlab
```

### Linux

```bash
# 安装 LaTeX
sudo apt-get install texlive-latex-base texlive-pictures

# 安装 Python 依赖
pip install pandas matplotlib reportlab
```

### Windows (WSL2)

```bash
# 在 WSL2 中安装
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-pictures python3-pip
pip install pandas matplotlib reportlab
```

## 注意事项 / Notes

1. **数据质量 / Data Quality**
   - 确保年龄数据（age_ma）准确
   - 深度数据应连续且合理
   - 物种命名应使用标准分类学名

2. **性能优化 / Performance Optimization**
   - 大数据集建议使用 PNG 输出（更快）
   - LaTeX/PDF 适合出版质量输出
   - 可使用 `--simplify` 选项简化复杂图表

3. **自定义扩展 / Customization**
   - 支持自定义 LaTeX 模板
   - 可添加区域性地层柱
   - 支持自定义地质年代标尺

## 参考文献 / References

### 地层柱状图绘制标准

1. **North American Stratigraphic Code (1983)**
   - Stratigraphic classification and terminology standards

2. **International Stratigraphic Guide (2nd Edition, 1994)**
   - International Commission on Stratigraphy

### 可视化工具

1. **StratPlot** - 地层数据可视化 Python 库
2. **TikZ/PGF** - LaTeX 绘图宏包
3. **matplotlib** - Python 科学绘图库

---

**🦞 EXFOLIATE! 让地层柱状图揭示放射虫的演化历史！**
