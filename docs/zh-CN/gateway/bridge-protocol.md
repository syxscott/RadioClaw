---
read_when:
  - 构建或调试节点客户端（iOS/Android/macOS 节点模式�?  - 调查配对�?bridge 认证失败
  - 审计 Gateway 网关暴露的节点接�?summary: Bridge 协议（旧版节点）：TCP JSONL、配对、作用域 RPC
title: Bridge 协议
x-i18n:
  generated_at: "2026-02-03T07:47:42Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 789bcf3cbc6841fc293e054b919e63d661b3cc4cd205b2094289f00800127fe2
  source_path: gateway/bridge-protocol.md
  workflow: 15
---

# Bridge 协议（旧版节点传输）

Bridge 协议是一�?*旧版**节点传输（TCP JSONL）。新的节点客户端应该使用统一�?Gateway 网关 WebSocket 协议�?
如果你正在构建操作者或节点客户端，请使�?[Gateway 网关协议](/gateway/protocol)�?
**注意�?* 当前�?RadioClaw 构建不再包含 TCP bridge 监听器；本文档仅作历史参考保留�?旧版 `bridge.*` 配置键不再是配置模式的一部分�?
## 为什么我们有两种协议

- **安全边界**：bridge 暴露一个小的允许列表，而不是完整的 Gateway 网关 API 接口�?- **配对 + 节点身份**：节点准入由 Gateway 网关管理，并与每节点令牌绑定�?- **设备发现用户体验**：节点可以通过局域网上的 Bonjour 发现 Gateway 网关，或通过 tailnet 直接连接�?- **Loopback WS**：完整的 WS 控制平面保持本地，除非通过 SSH 隧道�?
## 传输

- TCP，每行一�?JSON 对象（JSONL）�?- 可�?TLS（当 `bridge.tls.enabled` �?true 时）�?- 旧版默认监听端口�?`18790`（当前构建不启动 TCP bridge）�?
�?TLS 启用时，设备发现 TXT 记录包含 `bridgeTls=1` 加上 `bridgeTlsSha256`，以便节点可以固定证书�?
## 握手 + 配对

1. 客户端发送带有节点元数据 + 令牌（如果已配对）的 `hello`�?2. 如果未配对，Gateway 网关回复 `error`（`NOT_PAIRED`/`UNAUTHORIZED`）�?3. 客户端发�?`pair-request`�?4. Gateway 网关等待批准，然后发�?`pair-ok` �?`hello-ok`�?
`hello-ok` 返回 `serverName`，可能包�?`canvasHostUrl`�?
## �?
客户�?�?Gateway 网关�?
- `req` / `res`：作用域 Gateway 网关 RPC（chat、sessions、config、health、voicewake、skills.bins�?- `event`：节点信号（语音转录、智能体请求、聊天订阅、exec 生命周期�?
Gateway 网关 �?客户端：

- `invoke` / `invoke-res`：节点命令（`canvas.*`、`camera.*`、`screen.record`、`location.get`、`sms.send`�?- `event`：已订阅会话的聊天更�?- `ping` / `pong`：保�?
旧版允许列表强制执行位于 `src/gateway/server-bridge.ts`（已移除）�?
## Exec 生命周期事件

节点可以发出 `exec.finished` �?`exec.denied` 事件来表面化 system.run 活动�?这些被映射到 Gateway 网关中的系统事件。（旧版节点可能仍会发出 `exec.started`。）

Payload 字段（除非注明，否则都是可选的）：

- `sessionKey`（必需）：接收系统事件的智能体会话�?- `runId`：用于分组的唯一 exec id�?- `command`：原始或格式化的命令字符串�?- `exitCode`、`timedOut`、`success`、`output`：完成详情（仅限 finished）�?- `reason`：拒绝原因（仅限 denied）�?
## Tailnet 使用

- �?bridge 绑定�?tailnet IP：在 `~/.RadioClaw/RadioClaw.json` 中设�?`bridge.bind: "tailnet"`�?- 客户端通过 MagicDNS 名称�?tailnet IP 连接�?- Bonjour **�?*跨网络；需要时使用手动主机/端口或广�?DNS‑SD�?
## 版本控制

Bridge 目前�?*隐式 v1**（无最�?最大协商）。预期向后兼容；在任何破坏性变更之前添�?bridge 协议版本字段�?