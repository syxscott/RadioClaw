---
read_when:
  - 渠道已连接但消息无法流�?  - 排查渠道配置错误（意图、权限、隐私模式）
summary: 渠道专属故障排除快捷指南（Discord/Telegram/WhatsApp�?title: 渠道故障排除
x-i18n:
  generated_at: "2026-02-01T19:58:09Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 6542ee86b3e50929caeaab127642d135dfbc0d8a44876ec2df0fff15bf57cd63
  source_path: channels/troubleshooting.md
  workflow: 14
---

# 渠道故障排除

首先运行�?
```bash
RadioClaw doctor
RadioClaw channels status --probe
```

`channels status --probe` 会在检测到常见渠道配置错误时输出警告，并包含小型实时检查（凭据、部分权�?成员资格）�?
## 渠道

- Discord：[/channels/discord#troubleshooting](/channels/discord#troubleshooting)
- Telegram：[/channels/telegram#troubleshooting](/channels/telegram#troubleshooting)
- WhatsApp：[/channels/whatsapp#troubleshooting-quick](/channels/whatsapp#troubleshooting-quick)

## Telegram 快速修�?
- 日志显示 `HttpError: Network request for 'sendMessage' failed` �?`sendChatAction` �?检�?IPv6 DNS。如�?`api.telegram.org` 优先解析�?IPv6 而主机缺�?IPv6 出站连接，请强制使用 IPv4 或启�?IPv6。参�?[/channels/telegram#troubleshooting](/channels/telegram#troubleshooting)�?- 日志显示 `setMyCommands failed` �?检查到 `api.telegram.org` 的出�?HTTPS �?DNS 可达性（常见于限制严格的 VPS 或代理环境）�?