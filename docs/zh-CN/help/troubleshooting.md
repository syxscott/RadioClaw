---
read_when:
  - 你看到错误并想要修复路径
  - 安装程序显示“成功”但 CLI 不工�?summary: 故障排除中心：症�?�?检�?�?修复
title: 故障排除
x-i18n:
  generated_at: "2026-02-03T07:49:14Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 00ba2a20732fa22ccf9bcba264ab06ea940e9d6e96b31290811ff21a670eaad2
  source_path: help/troubleshooting.md
  workflow: 15
---

# 故障排除

## 最初的六十�?
按顺序运行这些命令：

```bash
RadioClaw status
RadioClaw status --all
RadioClaw gateway probe
RadioClaw logs --follow
RadioClaw doctor
```

如果 Gateway 网关可达，进行深度探测：

```bash
RadioClaw status --deep
```

## 常见的“它坏了”情�?
### `RadioClaw: command not found`

几乎总是 Node/npm PATH 问题。从这里开始：

- [安装（Node/npm PATH 安装完整性检查）](/install#nodejs--npm-path-sanity)

### 安装程序失败（或你需要完整日志）

以详细模式重新运行安装程序以查看完整跟踪�?npm 输出�?
```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --verbose
```

对于 beta 安装�?
```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --beta --verbose
```

你也可以设置 `RadioClaw_VERBOSE=1` 代替标志�?
### Gateway 网关“unauthorized”、无法连接或持续重连

- [Gateway 网关故障排除](/gateway/troubleshooting)
- [Gateway 网关认证](/gateway/authentication)

### 控制 UI �?HTTP 上失败（需要设备身份）

- [Gateway 网关故障排除](/gateway/troubleshooting)
- [控制 UI](/web/control-ui#insecure-http)

### `docs.RadioClaw.ai` 显示 SSL 错误（Comcast/Xfinity�?
一�?Comcast/Xfinity 连接通过 Xfinity Advanced Security 阻止 `docs.RadioClaw.ai`�?禁用 Advanced Security 或将 `docs.RadioClaw.ai` 添加到允许列表，然后重试�?
- Xfinity Advanced Security 帮助：https://www.xfinity.com/support/articles/using-xfinity-xfi-advanced-security
- 快速检查：尝试移动热点�?VPN 以确认这�?ISP 级别的过�?
### 服务显示运行中，�?RPC 探测失败

- [Gateway 网关故障排除](/gateway/troubleshooting)
- [后台进程/服务](/gateway/background-process)

### 模型/认证失败（速率限制、账单、“all models failed”）

- [模型](/cli/models)
- [OAuth / 认证概念](/concepts/oauth)

### `/model` 显示 `model not allowed`

这通常意味着 `agents.defaults.models` 配置为允许列表。当它非空时，只能选择那些提供�?模型键�?
- 检查允许列表：`RadioClaw config get agents.defaults.models`
- 添加你想要的模型（或清除允许列表）然后重�?`/model`
- 使用 `/models` 浏览允许的提供商/模型

### 提交问题�?
粘贴一份安全报告：

```bash
RadioClaw status --all
```

如果可以的话，包含来�?`RadioClaw logs --follow` 的相关日志尾部�?