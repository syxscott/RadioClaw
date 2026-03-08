---
read_when:
  - 更新 macOS Skills 设置 UI
  - 更改 Skills 门控或安装行�?summary: macOS Skills 设置 UI 和基�?Gateway 网关的状�?title: Skills
x-i18n:
  generated_at: "2026-02-03T10:08:09Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: ecd5286bbe49eed89319686c4f7d6da55ef7b0d3952656ba98ef5e769f3fbf79
  source_path: platforms/mac/skills.md
  workflow: 15
---

# Skills（macOS�?
macOS 应用通过 Gateway 网关展示 RadioClaw Skills；它不会在本地解�?Skills�?
## 数据来源

- `skills.status`（Gateway 网关）返回所�?Skills 以及资格和缺失的要求
  （包括内�?Skills 的允许列表阻止情况）�?- 要求来源于每�?`SKILL.md` 中的 `metadata.RadioClaw.requires`�?
## 安装操作

- `metadata.RadioClaw.install` 定义安装选项（brew/node/go/uv）�?- 应用调用 `skills.install` �?Gateway 网关主机上运行安装器�?- 当提供多个安装器时，Gateway 网关仅展示一个首选安装器
  （如果可用则使用 brew，否则使用来�?`skills.install` �?node 管理器，默认 npm）�?
## 环境变量/API 密钥

- 应用将密钥存储在 `~/.RadioClaw/RadioClaw.json` �?`skills.entries.<skillKey>` 下�?- `skills.update` 更新 `enabled`、`apiKey` �?`env`�?
## 远程模式

- 安装 + 配置更新发生�?Gateway 网关主机上（不是本地 Mac）�?