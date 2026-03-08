---
read_when:
  - 你遇到连�?认证问题，需要引导式修复
  - 你更新后想进行完整性检�?summary: "`RadioClaw doctor` �?CLI 参考（健康检�?+ 引导式修复）"
title: doctor
x-i18n:
  generated_at: "2026-02-03T10:04:15Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 92310aa3f3d111e91a74ce1150359d5d8a8d70a856666d9419e16c60d78209f2
  source_path: cli/doctor.md
  workflow: 15
---

# `RadioClaw doctor`

Gateway 网关和渠道的健康检�?+ 快速修复�?
相关内容�?
- 故障排除：[故障排除](/gateway/troubleshooting)
- 安全审计：[安全](/gateway/security)

## 示例

```bash
RadioClaw doctor
RadioClaw doctor --repair
RadioClaw doctor --deep
```

注意事项�?
- 交互式提示（如钥匙串/OAuth 修复）仅�?stdin �?TTY �?*�?*设置 `--non-interactive` 时运行。无头运行（cron、Telegram、无终端）将跳过提示�?- `--fix`（`--repair` 的别名）会将备份写入 `~/.RadioClaw/RadioClaw.json.bak`，并删除未知的配置键，同时列出每个删除项�?
## macOS：`launchctl` 环境变量覆盖

如果你之前运行过 `launchctl setenv RadioClaw_GATEWAY_TOKEN ...`（或 `...PASSWORD`），该值会覆盖你的配置文件，并可能导致持续�?未授�?错误�?
```bash
launchctl getenv RadioClaw_GATEWAY_TOKEN
launchctl getenv RadioClaw_GATEWAY_PASSWORD

launchctl unsetenv RadioClaw_GATEWAY_TOKEN
launchctl unsetenv RadioClaw_GATEWAY_PASSWORD
```
