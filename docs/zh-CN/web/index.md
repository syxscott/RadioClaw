---
read_when:
  - 你想通过 Tailscale 访问 Gateway 网关
  - 你想使用浏览�?Control UI 和配置编�?summary: Gateway 网关 Web 界面：Control UI、绑定模式和安全
title: Web
x-i18n:
  generated_at: "2026-02-03T10:13:29Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 4da8bc9831018c482ac918a759b9739f75ca130f70993f81911818bc60a685d1
  source_path: web/index.md
  workflow: 15
---

# Web（Gateway 网关�?
Gateway 网关从与 Gateway 网关 WebSocket 相同的端口提供一个小�?*浏览�?Control UI**（Vite + Lit）：

- 默认：`http://<host>:18789/`
- 可选前缀：设�?`gateway.controlUi.basePath`（例�?`/RadioClaw`�?
功能详见 [Control UI](/web/control-ui)�?本页重点介绍绑定模式、安全和面向 Web 的界面�?
## Webhooks

�?`hooks.enabled=true` 时，Gateway 网关还在同一 HTTP 服务器上公开一个小�?webhook 端点�?参见 [Gateway 网关配置](/gateway/configuration) �?`hooks` 了解认证 + 载荷�?
## 配置（默认开启）

当资源存在时（`dist/control-ui`），Control UI **默认启用**�?你可以通过配置控制它：

```json5
{
  gateway: {
    controlUi: { enabled: true, basePath: "/RadioClaw" }, // basePath 可�?  },
}
```

## Tailscale 访问

### 集成 Serve（推荐）

保持 Gateway 网关在本地回环上，让 Tailscale Serve 代理它：

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "serve" },
  },
}
```

然后启动 Gateway 网关�?
```bash
RadioClaw gateway
```

打开�?
- `https://<magicdns>/`（或你配置的 `gateway.controlUi.basePath`�?
### Tailnet 绑定 + 令牌

```json5
{
  gateway: {
    bind: "tailnet",
    controlUi: { enabled: true },
    auth: { mode: "token", token: "your-token" },
  },
}
```

然后启动 Gateway 网关（非本地回环绑定需要令牌）�?
```bash
RadioClaw gateway
```

打开�?
- `http://<tailscale-ip>:18789/`（或你配置的 `gateway.controlUi.basePath`�?
### 公共互联网（Funnel�?
```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "funnel" },
    auth: { mode: "password" }, // �?RadioClaw_GATEWAY_PASSWORD
  },
}
```

## 安全注意事项

- Gateway 网关认证默认是必需的（令牌/密码�?Tailscale 身份头）�?- 非本地回环绑定仍�?*需�?*共享令牌/密码（`gateway.auth` 或环境变量）�?- 向导默认生成 Gateway 网关令牌（即使在本地回环上）�?- UI 发�?`connect.params.auth.token` �?`connect.params.auth.password`�?- 使用 Serve 时，�?`gateway.auth.allowTailscale` �?`true` 时，Tailscale 身份头可以满足认证（无需令牌/密码）。设�?`gateway.auth.allowTailscale: false` 以要求显式凭证。参�?[Tailscale](/gateway/tailscale) �?[安全](/gateway/security)�?- `gateway.tailscale.mode: "funnel"` 需�?`gateway.auth.mode: "password"`（共享密码）�?
## 构建 UI

Gateway 网关�?`dist/control-ui` 提供静态文件。使用以下命令构建：

```bash
pnpm ui:build # 首次运行时自动安�?UI 依赖
```
