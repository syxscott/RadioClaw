---
read_when:
  - 你想查找某个渠道的联系人/群组/自身 ID
  - 你正在开发渠道目录适配�?summary: "`RadioClaw directory` �?CLI 参考（self、peers、groups�?
title: directory
x-i18n:
  generated_at: "2026-02-01T19:58:58Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 7c878d9013aeaa22c8a21563fac30b465a86be85d8c917c5d4591b5c3d4b2025
  source_path: cli/directory.md
  workflow: 14
---

# `RadioClaw directory`

对支持目录功能的渠道进行查找（联系人/对等方、群组和"�?）�?
## 通用参数

- `--channel <name>`：渠�?ID/别名（配置了多个渠道时为必填；仅配置一个渠道时自动选择�?- `--account <id>`：账�?ID（默认：渠道默认账号�?- `--json`：输�?JSON 格式

## 说明

- `directory` 用于帮助你查找可粘贴到其他命令中�?ID（特别是 `RadioClaw message send --target ...`）�?- 对于许多渠道，结果来源于配置（允许列�?已配置的群组），而非实时的提供商目录�?- 默认输出为以制表符分隔的 `id`（有时包�?`name`）；脚本中请使用 `--json`�?
## 将结果用�?`message send`

```bash
RadioClaw directory peers list --channel slack --query "U0"
RadioClaw message send --channel slack --target user:U012ABCDEF --message "hello"
```

## ID 格式（按渠道�?
- WhatsApp：`+15551234567`（私聊），`1234567890-1234567890@g.us`（群组）
- Telegram：`@username` 或数字聊�?ID；群组为数字 ID
- Slack：`user:U…` �?`channel:C…`
- Discord：`user:<id>` �?`channel:<id>`
- Matrix（插件）：`user:@user:server`、`room:!roomId:server` �?`#alias:server`
- Microsoft Teams（插件）：`user:<id>` �?`conversation:<id>`
- Zalo（插件）：用�?ID（Bot API�?- Zalo Personal / `zalouser`（插件）：来�?`zca` 的会�?ID（私�?群组）（`me`、`friend list`、`group list`�?
## Self�?�?�?
```bash
RadioClaw directory self --channel zalouser
```

## Peers（联系人/用户�?
```bash
RadioClaw directory peers list --channel zalouser
RadioClaw directory peers list --channel zalouser --query "name"
RadioClaw directory peers list --channel zalouser --limit 50
```

## 群组

```bash
RadioClaw directory groups list --channel zalouser
RadioClaw directory groups list --channel zalouser --query "work"
RadioClaw directory groups members --channel zalouser --group-id <id>
```
