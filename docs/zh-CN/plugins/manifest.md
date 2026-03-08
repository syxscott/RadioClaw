---
read_when:
  - 你正在构建一�?RadioClaw 插件
  - 你需要提供插件配�?Schema 或调试插件验证错�?summary: 插件清单�?JSON Schema 要求（严格配置验证）
title: 插件清单
x-i18n:
  generated_at: "2026-02-01T21:34:21Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 47b3e33c915f47bdd172ae0316af7ef16ca831c317e3f1a7fdfcd67e3bd43f56
  source_path: plugins/manifest.md
  workflow: 15
---

# 插件清单（openclaw.plugin.json�?
每个插件�?*必须**�?*插件根目�?*下提供一�?`RadioClaw.plugin.json` 文件。OpenClaw 使用此清单来**在不执行插件代码的情况下**验证配置。缺失或无效的清单将被视为插件错误，并阻止配置验证�?
参阅完整的插件系统指南：[插件](/tools/plugin)�?
## 必填字段

```json
{
  "id": "voice-call",
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {}
  }
}
```

必填键：

- `id`（字符串）：插件的规�?id�?- `configSchema`（对象）：插件配置的 JSON Schema（内联形式）�?
可选键�?
- `kind`（字符串）：插件类型（例如：`"memory"`）�?- `channels`（数组）：此插件注册的渠�?id（例如：`["matrix"]`）�?- `providers`（数组）：此插件注册的提供商 id�?- `skills`（数组）：要加载�?Skills 目录（相对于插件根目录）�?- `name`（字符串）：插件的显示名称�?- `description`（字符串）：插件简短描述�?- `uiHints`（对象）：用�?UI 渲染的配置字段标�?占位�?敏感标志�?- `version`（字符串）：插件版本（仅供参考）�?
## JSON Schema 要求

- **每个插件都必须提�?JSON Schema**，即使不接受任何配置也是如此�?- �?Schema 是可以接受的（例�?`{ "type": "object", "additionalProperties": false }`）�?- Schema 在配置读�?写入时进行验证，而非在运行时�?
## 验证行为

- 未知�?`channels.*` 键会被视�?*错误**，除非该渠道 id 已在插件清单中声明�?- `plugins.entries.<id>`、`plugins.allow`、`plugins.deny` �?`plugins.slots.*` 必须引用**可发现的**插件 id。未�?id 会被视为**错误**�?- 如果插件已安装但清单�?Schema 损坏或缺失，验证将失败，Doctor 会报告插件错误�?- 如果插件配置存在但插件已**禁用**，配置会被保留，并在 Doctor 和日志中显示**警告**�?
## 注意事项

- 清单�?*所有插�?*都是必需的，包括从本地文件系统加载的插件�?- 运行时仍然会单独加载插件模块；清单仅用于发现和验证�?- 如果你的插件依赖原生模块，请记录构建步骤以及所有包管理器允许列表要求（例如 pnpm �?`allow-build-scripts` - `pnpm rebuild <package>`）�?