---
read_when:
  - 正在开�?Gateway 网关协议、客户端或传输层
summary: WebSocket Gateway 网关架构、组件和客户端流�?title: Gateway 网关架构
x-i18n:
  generated_at: "2026-02-03T07:45:55Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: c636d5d8a5e628067432b30671466309e3d630b106d413f1708765bf2a9399a1
  source_path: concepts/architecture.md
  workflow: 15
---

# Gateway 网关架构

最后更新：2026-01-22

## 概述

- 单个长期运行�?**Gateway 网关**拥有所有消息平台（通过 Baileys �?WhatsApp、通过 grammY �?Telegram、Slack、Discord、Signal、iMessage、WebChat）�?- 控制平面客户端（macOS 应用、CLI、Web 界面、自动化）通过配置的绑定主机（默认 `127.0.0.1:18789`）上�?**WebSocket** 连接�?Gateway 网关�?- **节点**（macOS/iOS/Android/无头设备）也通过 **WebSocket** 连接，但声明 `role: node` 并带有明确的能力/命令�?- 每台主机一�?Gateway 网关；它是唯一打开 WhatsApp 会话的位置�?- **canvas 主机**（默�?`18793`）提供智能体可编辑的 HTML �?A2UI�?
## 组件和流�?
### Gateway 网关（守护进程）

- 维护提供商连接�?- 暴露类型化的 WS API（请求、响应、服务器推送事件）�?- 根据 JSON Schema 验证入站帧�?- 发出事件�?`agent`、`chat`、`presence`、`health`、`heartbeat`、`cron`�?
### 客户端（mac 应用 / CLI / web 管理�?
- 每个客户端一�?WS 连接�?- 发送请求（`health`、`status`、`send`、`agent`、`system-presence`）�?- 订阅事件（`tick`、`agent`、`presence`、`shutdown`）�?
### 节点（macOS / iOS / Android / 无头设备�?
- �?`role: node` 连接�?*同一�?WS 服务�?*�?- �?`connect` 中提供设备身份；配对�?*基于设备**的（角色�?`node`），批准存储在设备配对存储中�?- 暴露命令�?`canvas.*`、`camera.*`、`screen.record`、`location.get`�?
协议详情�?
- [Gateway 网关协议](/gateway/protocol)

### WebChat

- 静态界面，使用 Gateway 网关 WS API 获取聊天历史和发送消息�?- 在远程设置中，通过与其他客户端相同�?SSH/Tailscale 隧道连接�?
## 连接生命周期（单个客户端�?
```
Client                    Gateway
  |                          |
  |---- req:connect -------->|
  |<------ res (ok) ---------|   (or res error + close)
  |   (payload=hello-ok carries snapshot: presence + health)
  |                          |
  |<------ event:presence ---|
  |<------ event:tick -------|
  |                          |
  |------- req:agent ------->|
  |<------ res:agent --------|   (ack: {runId,status:"accepted"})
  |<------ event:agent ------|   (streaming)
  |<------ res:agent --------|   (final: {runId,status,summary})
  |                          |
```

## 线路协议（摘要）

- 传输：WebSocket，带 JSON 载荷的文本帧�?- 第一�?*必须**�?`connect`�?- 握手后：
  - 请求：`{type:"req", id, method, params}` �?`{type:"res", id, ok, payload|error}`
  - 事件：`{type:"event", event, payload, seq?, stateVersion?}`
- 如果设置�?`RadioClaw_GATEWAY_TOKEN`（或 `--token`），`connect.params.auth.token` 必须匹配，否则套接字关闭�?- 有副作用的方法（`send`、`agent`）需要幂等键以安全重试；服务器保持短期去重缓存�?- 节点必须�?`connect` 中包�?`role: "node"` 以及能力/命令/权限�?
## 配对 + 本地信任

- 所�?WS 客户端（操作�?+ 节点）在 `connect` 时包�?*设备身份**�?- 新设�?ID 需要配对批准；Gateway 网关为后续连接颁�?*设备令牌**�?- **本地**连接（loopback �?Gateway 网关主机自身�?tailnet 地址）可以自动批准以保持同主机用户体验流畅�?- **非本�?*连接必须签名 `connect.challenge` nonce 并需要明确批准�?- Gateway 网关认证（`gateway.auth.*`）仍适用�?*所�?*连接，无论本地还是远程�?
详情：[Gateway 网关协议](/gateway/protocol)、[配对](/channels/pairing)、[安全](/gateway/security)�?
## 协议类型和代码生�?
- TypeBox 模式定义协议�?- 从这些模式生�?JSON Schema�?- �?JSON Schema 生成 Swift 模型�?
## 远程访问

- 推荐：Tailscale �?VPN�?- 替代方案：SSH 隧道
  ```bash
  ssh -N -L 18789:127.0.0.1:18789 user@host
  ```
- 相同的握�?+ 认证令牌适用于隧道连接�?- 远程设置中可以为 WS 启用 TLS + 可选的证书固定�?
## 操作快照

- 启动：`RadioClaw gateway`（前台，日志输出�?stdout）�?- 健康检查：通过 WS �?`health`（也包含�?`hello-ok` 中）�?- 监控：使�?launchd/systemd 自动重启�?
## 不变�?
- 每台主机恰好一�?Gateway 网关控制单个 Baileys 会话�?- 握手是强制的；任何非 JSON 或非 connect 的第一帧都会导致硬关闭�?- 事件不会重放；客户端必须在出现间隙时刷新�?