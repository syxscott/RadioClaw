---
name: image-identify-radiolarian
description: 识别 SEM/显微照片中的放射虫种属特征并提供分类建议 (Identify radiolarian species from SEM/microscope images)
homepage: https://github.com/RadioClaw/RadioClaw
metadata:
  {
    "RadioClaw":
      {
        "emoji": "🦠",
        "requires": { "bins": [], "env": ["OPENAI_API_KEY"] },
        "primaryEnv": "OPENAI_API_KEY",
        "install": [],
      },
  }
---

# 🦠 放射虫 SEM 图像识别技能 (Radiolarian SEM Image Identification)

使用 AI 视觉模型分析扫描电镜（SEM）或光学显微镜照片，识别放射虫的骨骼结构特征并提供种属分类建议。

## 使用方法 / Usage

### 基础用法 / Basic Usage

上传 SEM 照片后，智能体将自动分析：

```
请分析这张放射虫 SEM 照片
```

### 详细分析 / Detailed Analysis

```
/radiolarian identify --image ./samples/SEM_001.jpg --detailed
```

### 指定分类级别 / Specify Taxonomic Level

```
/radiolarian identify --image ./samples/SEM_001.jpg --level genus
```

支持的分类级别：
- `order` - 目级分类
- `family` - 科级分类
- `genus` - 属级鉴定
- `species` - 种级鉴定

## 输出内容 / Output

### 形态特征描述 / Morphological Features

智能体将识别并描述以下特征：

- **外壳类型 / Shell Type**
  - 格子状外壳（latticed shell）
  - 多孔状外壳（porous shell）
  - 网状结构（reticulated structure）

- **整体形状 / Overall Shape**
  - 锥形（conical）
  - 球形（spherical）
  - 椭球形（ellipsoidal）
  - 圆柱形（cylindrical）

- **表面装饰 / Surface Ornamentation**
  - 刺状突起（spiny processes）
  - 翼状扩展（wing-like expansions）
  - 光滑表面（smooth surface）

- **内部结构 / Internal Structure**
  - 髓壳（medullary shell）
  - 皮壳（cortical shell）
  - 辐射对称（radial symmetry）

### 分类建议 / Taxonomic Suggestions

```markdown
## 分析结果 / Analysis Results

### 形态特征 / Morphological Features
- 外壳类型：格子状外壳，直径约 150μm
- 整体形状：锥形，顶部尖锐
- 表面装饰：3-4 根主要刺状突起
- 内部结构：双层髓壳清晰可见

### 分类建议 / Taxonomic Suggestions
- **目 / Order**: Nassellaria (双壳纲)
- **科 / Family**: Pterocoryidae
- **属 / Genus**: Pterocorys
- **可能种 / Possible Species**: Pterocorys zancleum (Haeckel, 1887)

### 地层范围 / Stratigraphic Range
- **地质年代**: 中新世 - 上新世 (Miocene - Pliocene)
- **生物带**: CN10 - CN14
- **典型产地**: 热带太平洋

### 置信度 / Confidence
- 目级分类：高 (High, >90%)
- 科级分类：高 (High, >85%)
- 属级分类：中 (Medium, ~70%)
- 种级分类：低 (Low, ~50%) - 需要更多特征

### 建议 / Recommendations
1. 建议测量髓壳与皮壳的比例
2. 检查是否有腹侧附属结构
3. 对比 Haeckel (1887) 原始描述
4. 参考 Nigrini & Caulet (1992) 的放射虫图谱
```

## API 配置 / API Configuration

### OpenAI API Key

在 `~/.RadioClaw/RadioClaw.json` 中配置：

```json5
{
  "skills": {
    "image-identify-radiolarian": {
      "apiKey": "sk-...",
      "model": "gpt-4o",  // 或 gpt-4-vision-preview
      "maxTokens": 2000
    }
  }
}
```

### 环境变量 / Environment Variables

```bash
export OPENAI_API_KEY=sk-...
```

## 脚本用法 / Script Usage

### Python 脚本分析

```bash
python scripts/identify_radiolarian.py \
  --image ./samples/SEM_001.jpg \
  --output ./results/analysis_001.json \
  --language zh-CN \
  --detailed
```

### 参数说明 / Parameters

| 参数 / Parameter | 说明 / Description | 默认值 / Default |
|-----------------|-------------------|-----------------|
| `--image` | 输入图像路径 | 必需 |
| `--output` | 输出结果路径 | `stdout` |
| `--language` | 输出语言 (zh-CN/en) | `zh-CN` |
| `--detailed` | 详细分析模式 | `false` |
| `--level` | 分类级别 (order/family/genus/species) | `genus` |
| `--model` | AI 模型选择 | `gpt-4o` |

## 参考文献 / References

### 分类学权威资源

1. **Haeckel, E. (1887)**
   - *Report on the Radiolaria collected by H.M.S. Challenger*
   - Challenger Expedition Reports

2. **Nigrini, C. & Caulet, J.P. (1992)**
   - *Late Cenozoic Radiolarian Biostratigraphy of the Equatorial Pacific*
   - Proceedings of the Ocean Drilling Program

3. **Radiolaria.org**
   - 在线放射虫分类数据库
   - https://radiolaria.org

4. **Paleobiology Database (PBDB)**
   - 古生物数据库
   - https://paleobiodb.org

### 地层年代表

- **国际地层委员会 (ICS)** 地质年代表
- **Gradstein et al. (2012)** - The Geologic Time Scale

## 注意事项 / Notes

1. **图像质量要求 / Image Quality Requirements**
   - 分辨率建议：≥ 1024×1024 像素
   - 清晰的骨骼结构
   - 适当的对比度

2. **分类准确性 / Taxonomic Accuracy**
   - 目级分类通常准确率 >90%
   - 属级分类准确率约 70-80%
   - 种级分类需要专家确认

3. **局限性 / Limitations**
   - 无法替代专业古生物学家鉴定
   - 某些近缘种需要更详细的形态测量
   - 化石保存状态影响识别准确性

4. **最佳实践 / Best Practices**
   - 提供多个角度的照片
   - 包含比例尺
   - 记录样本采集信息（地层、地点、深度）

## 输出示例 / Output Example

### JSON 格式输出

```json
{
  "image": "SEM_001.jpg",
  "timestamp": "2026-03-08T10:30:00Z",
  "morphology": {
    "shellType": "latticed",
    "shape": "conical",
    "ornamentation": ["spiny processes", "wing-like expansions"],
    "internalStructure": {
      "medullaryShell": true,
      "corticalShell": true,
      "symmetry": "radial"
    },
    "measurements": {
      "diameter": "150μm",
      "height": "220μm"
    }
  },
  "taxonomy": {
    "order": { "name": "Nassellaria", "confidence": 0.92 },
    "family": { "name": "Pterocoryidae", "confidence": 0.87 },
    "genus": { "name": "Pterocorys", "confidence": 0.72 },
    "species": { "name": "Pterocorys zancleum", "confidence": 0.48 }
  },
  "stratigraphy": {
    "period": "Miocene - Pliocene",
    "biozone": "CN10 - CN14",
    "typicalLocation": "Tropical Pacific"
  },
  "recommendations": [
    "Measure medullary to cortical shell ratio",
    "Check for ventral appendages",
    "Compare with Haeckel (1887) original description"
  ]
}
```

---

**🦞 EXFOLIATE! 让放射虫的硅质骨架揭示古海洋的秘密！**
