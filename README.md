# 🦞 RadioClaw —— 全球首个放射虫（Radiolaria）专用 AI 助手

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/RadioClaw/RadioClaw/main/docs/assets/RadioClaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/RadioClaw/RadioClaw/main/docs/assets/RadioClaw-logo-text.png" alt="RadioClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE! 探索硅质骨架的奥秘！</strong>
</p>

<p align="center">
  <a href="https://github.com/RadioClaw/RadioClaw/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/RadioClaw/RadioClaw/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/RadioClaw/RadioClaw/releases"><img src="https://img.shields.io/github/v/release/RadioClaw/RadioClaw?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://discord.gg/clawd"><img src="https://img.shields.io/discord/1456350064065904867?label=Discord&logo=discord&logoColor=white&color=5865F2&style=for-the-badge" alt="Discord"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

## 📖 简介 / Introduction

**RadioClaw** 是基于 OpenClaw 打造的开源本地 AI 代理，**专为放射虫（Radiolaria）研究而设计**。

它能够：
- 🦠 识别 SEM/显微照片中的放射虫种属特征（格子状外壳、锥形、刺状、髓壳等）
- 📊 查询放射虫生物年代学（biochronology）和地层范围
- 📚 总结最新 Radiolaria 研究文献
- 📈 生成地层柱状图和 stratigraphic range 图表
- 🌊 提供古海洋学与硅质沉积相关知识

**RadioClaw** is an open-source local AI agent built on OpenClaw, **specifically designed for Radiolaria research**.

It can:
- 🦠 Identify radiolarian species features from SEM/microscope images (latticed shell, conical, spiny, medullary shell, etc.)
- 📊 Query radiolarian biochronology and stratigraphic ranges
- 📚 Summarize latest Radiolaria research papers
- 📈 Generate stratigraphic columns and stratigraphic range charts
- 🌊 Provide knowledge on paleoceanography and siliceous deposition

---

## ✨ 特色功能 / Features

### 🦠 放射虫专用功能 / Radiolaria-Specific Features

1. **SEM 图像智能识别** - 上传扫描电镜照片，AI 自动描述骨骼特征并建议种属分类
2. **地层范围查询** - 快速查询放射虫种属的地质年代分布（古生代 - 新生代）
3. **文献智能总结** - 自动提取和总结 Radiolaria 相关论文的关键发现
4. **地层柱状图生成** - 根据样本数据自动生成 LaTeX/图像格式的地层对比图
5. **古海洋学知识库** - 内置硅质岩、放射虫岩、生物地层学专业知识
6. **多语言支持** - 中英文双语交互，支持专业术语的准确翻译

### 🛠️ 核心能力 / Core Capabilities

7. **多渠道接入** - WhatsApp、Telegram、Discord、Slack、微信等即时通讯工具
8. **本地隐私保护** - 所有数据在本地处理，支持离线运行
9. **可扩展技能系统** - 支持自定义 Skills 和插件扩展
10. **多模型支持** - 兼容 OpenAI、Anthropic、Gemini、Ollama 等主流模型

---

## 🚀 快速开始 / Quick Start

### 前置要求 / Prerequisites

- **Node.js** v22.12+ (推荐使用 nvm 管理)
- **pnpm** v9+ 或 **npm** v10+
- **Git**

### 安装步骤 / Installation

```bash
# 1. 克隆仓库 / Clone repository
git clone https://github.com/RadioClaw/RadioClaw.git
cd RadioClaw

# 2. 安装依赖 / Install dependencies
pnpm install

# 3. 启动配置向导 / Start configuration wizard
pnpm run onboard
```

### 配置模型 / Configure Models

```bash
# 配置 OpenAI
pnpm run models auth login --provider openai

# 配置 Anthropic
pnpm run models auth login --provider anthropic

# 配置本地 Ollama
pnpm run models auth login --provider ollama
```

### 启动服务 / Start Service

```bash
# 启动 Gateway 网关
pnpm run gateway

# 或使用守护进程模式
pnpm run daemon start
```

---

## 📱 渠道接入 / Channel Integration

RadioClaw 支持以下通讯渠道：

| 渠道 / Channel | 状态 / Status | 文档 / Docs |
|---------------|--------------|-------------|
| WhatsApp | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/whatsapp) |
| Telegram | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/telegram) |
| Discord | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/discord) |
| Slack | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/slack) |
| Signal | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/signal) |
| iMessage | ✅ 支持 (macOS) | [配置指南](https://docs.RadioClaw.ai/channels/imessage) |
| 微信/WeChat | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/wechat) |
| Feishu/飞书 | ✅ 支持 | [配置指南](https://docs.RadioClaw.ai/channels/feishu) |

---

## 🧪 放射虫研究示例 / Radiolaria Research Examples

### 示例 1: SEM 图像分析

```bash
# 上传 SEM 照片进行种属识别
/radiolarian identify --image ./samples/SEM_001.jpg

# 输出示例：
# 检测到格子状外壳结构，直径约 150μm
# 建议分类：Nassellaria 目
# 可能种属：Pterocorys zancleum (Haeckel, 1887)
# 地层范围：中新世 - 上新世
```

### 示例 2: 地层范围查询

```bash
# 查询特定种属的地层分布
/radiolarian query --species "Stylochlamydium venustum"

# 输出示例：
# Stylochlamydium venustum (Haeckel, 1887)
# 地质年代：晚渐新世 - 早中新世
# 生物带：CN1 - CN4
# 典型产地：热带太平洋
```

### 示例 3: 生成地层柱状图

```bash
# 根据样本数据生成对比图
/radiolarian strat-chart --samples ./data/samples.csv --output ./output/strat_column.pdf
```

---

## 📚 文档 / Documentation

完整文档请访问：[https://docs.RadioClaw.ai](https://docs.RadioClaw.ai)

- [快速入门](https://docs.RadioClaw.ai/start/getting-started)
- [配置指南](https://docs.RadioClaw.ai/gateway/configuration)
- [技能系统](https://docs.RadioClaw.ai/tools/skills)
- [模型配置](https://docs.RadioClaw.ai/concepts/models)
- [常见问题](https://docs.RadioClaw.ai/help/faq)

---

## 🤝 贡献 / Contributing

我们欢迎所有放射虫研究者和 AI 开发者的贡献！

### 贡献方式

1. 🦠 分享放射虫 SEM 图像数据集
2. 📊 贡献地层范围数据库条目
3. 💻 开发新的分析技能（Skills）
4. 📝 改进文档和翻译
5. 🐛 报告 Bug 或提出功能建议

### 开发环境设置

```bash
# Fork 仓库后
git clone https://github.com/YOUR_USERNAME/RadioClaw.git
cd RadioClaw
pnpm install
pnpm run dev
```

详细贡献指南请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📊 项目统计 / Project Stats

- 🌟 基于 [OpenClaw](https://github.com/openclaw/openclaw) 框架
- 🦠 专注于放射虫（Radiolaria）古生物学领域
- 🌍 支持全球放射虫生物地层学研究
- 🔬 集成 SEM 图像分析能力
- 📈 支持地层对比图自动生成

---

## 📄 许可证 / License

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢 / Acknowledgments

- 感谢 [OpenClaw](https://github.com/openclaw/openclaw) 团队提供的优秀基础框架
- 感谢全球放射虫研究社区的数据支持和知识贡献
- 感谢所有贡献者和用户的支持

---

## 📬 联系方式 / Contact

- 🌐 官网：[https://RadioClaw.ai](https://RadioClaw.ai)
- 📧 Email: contact@RadioClaw.ai
- 💬 Discord: [加入社区](https://discord.gg/clawd)
- 🐦 Twitter: [@RadioClawAI](https://twitter.com/RadioClawAI)

---

<p align="center">
  <strong>🦞 RadioClaw - 探索放射虫的微观世界 🦠</strong>
</p>
