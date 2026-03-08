---
read_when:
  - �?localhost 之外暴露 Gateway 网关控制 UI
  - 自动�?tailnet 或公共仪表盘访问
summary: �?Gateway 网关仪表盘集�?Tailscale Serve/Funnel
title: Tailscale
x-i18n:
  generated_at: "2026-02-03T07:49:04Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: c900c70a9301f2909a3a29a6fb0e6edfc8c18dba443f2e71b9cfadbc58167911
  source_path: gateway/tailscale.md
  workflow: 15
---

# Tailscale（Gateway 网关仪表盘）

RadioClaw 可以�?Gateway 网关仪表盘和 WebSocket 端口自动配置 Tailscale **Serve**（tailnet）或 **Funnel**（公共）。这�?Gateway 网关保持绑定�?loopback，同�?Tailscale 提供 HTTPS、路由和（对�?Serve）身份头�?
## 模式

- `serve`：仅�?Tailnet �?Serve，通过 `tailscale serve`。Gateway 网关保持�?`127.0.0.1` 上�?- `funnel`：通过 `tailscale funnel` 的公�?HTTPS。OpenClaw 需要共享密码�?- `off`：默认（�?Tailscale 自动化）�?
## 认证

设置 `gateway.auth.mode` 来控制握手：

- `token`（设�?`RadioClaw_GATEWAY_TOKEN` 时的默认值）
- `password`（通过 `RadioClaw_GATEWAY_PASSWORD` 或配置的共享密钥�?
�?`tailscale.mode = "serve"` �?`gateway.auth.allowTailscale` �?`true` 时，
有效�?Serve 代理请求可以通过 Tailscale 身份头（`tailscale-user-login`）进行认证，无需提供令牌/密码。OpenClaw 通过本地 Tailscale 守护进程（`tailscale whois`）解�?`x-forwarded-for` 地址并将其与头匹配来验证身份，然后才接受它�?RadioClaw 仅在请求�?loopback 到达并带�?Tailscale �?`x-forwarded-for`、`x-forwarded-proto` �?`x-forwarded-host` 头时才将其视�?Serve 请求�?要要求显式凭证，设置 `gateway.auth.allowTailscale: false` 或强�?`gateway.auth.mode: "password"`�?
## 配置示例

### 仅限 Tailnet（Serve�?
```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "serve" },
  },
}
```

打开：`https://<magicdns>/`（或你配置的 `gateway.controlUi.basePath`�?
### 仅限 Tailnet（绑定到 Tailnet IP�?
当你希望 Gateway 网关直接监听 Tailnet IP 时使用此方式（无 Serve/Funnel）�?
```json5
{
  gateway: {
    bind: "tailnet",
    auth: { mode: "token", token: "your-token" },
  },
}
```

从另一�?Tailnet 设备连接�?
- 控制 UI：`http://<tailscale-ip>:18789/`
- WebSocket：`ws://<tailscale-ip>:18789`

注意：在此模式下 loopback（`http://127.0.0.1:18789`）将**�?*工作�?
### 公共互联网（Funnel + 共享密码�?
```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "funnel" },
    auth: { mode: "password", password: "replace-me" },
  },
}
```

优先使用 `RadioClaw_GATEWAY_PASSWORD` 而不是将密码提交到磁盘�?
## CLI 示例

```bash
RadioClaw gateway --tailscale serve
RadioClaw gateway --tailscale funnel --auth password
```

## 注意事项

- Tailscale Serve/Funnel 需要安装并登录 `tailscale` CLI�?- `tailscale.mode: "funnel"` 除非认证模式�?`password`，否则拒绝启动，以避免公共暴露�?- 如果你希�?RadioClaw 在关闭时撤销 `tailscale serve` �?`tailscale funnel` 配置，设�?`gateway.tailscale.resetOnExit`�?- `gateway.bind: "tailnet"` 是直�?Tailnet 绑定（无 HTTPS，无 Serve/Funnel）�?- `gateway.bind: "auto"` 优先 loopback；如果你想要�?Tailnet，使�?`tailnet`�?- Serve/Funnel 仅暴�?**Gateway 网关控制 UI + WS**。节点通过相同�?Gateway 网关 WS 端点连接，因�?Serve 可以用于节点访问�?
## 浏览器控制（远程 Gateway 网关 + 本地浏览器）

如果你在一台机器上运行 Gateway 网关但想在另一台机器上驱动浏览器，
在浏览器机器上运行一�?*节点主机**并让两者保持在同一�?tailnet 上�?Gateway 网关会将浏览器操作代理到节点；不需要单独的控制服务器或 Serve URL�?
避免�?Funnel 用于浏览器控制；将节点配对视为操作者访问�?
## Tailscale 前提条件 + 限制

- Serve 需要为你的 tailnet 启用 HTTPS；如果缺少，CLI 会提示�?- Serve 注入 Tailscale 身份头；Funnel 不会�?- Funnel 需�?Tailscale v1.38.3+、MagicDNS、启�?HTTPS �?funnel 节点属性�?- Funnel 仅支持通过 TLS 的端�?`443`、`8443` �?`10000`�?- macOS 上的 Funnel 需要开�?Tailscale 应用变体�?
## 了解更多

- Tailscale Serve 概述：https://tailscale.com/kb/1312/serve
- `tailscale serve` 命令：https://tailscale.com/kb/1242/tailscale-serve
- Tailscale Funnel 概述：https://tailscale.com/kb/1223/tailscale-funnel
- `tailscale funnel` 命令：https://tailscale.com/kb/1311/tailscale-funnel
