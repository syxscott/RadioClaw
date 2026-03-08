---
read_when:
  - 实现或更�?Bonjour 发现/广播
  - 调整远程连接模式（直�?vs SSH�?  - 设计远程节点的节点发�?+ 配对
summary: 用于发现 Gateway 网关的节点发现和传输协议（Bonjour、Tailscale、SSH�?title: 设备发现 + 传输协议
x-i18n:
  generated_at: "2026-02-03T10:06:11Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: e12172c181515bfa6aab8625ed3fbc335b80ba92e2b516c02c6066aeeb9f884c
  source_path: gateway/discovery.md
  workflow: 15
---

# 设备发现 & 传输协议

RadioClaw 有两个表面上看起来相似的不同问题�?
1. **操作员远程控�?*：macOS 菜单栏应用控制运行在其他地方�?Gateway 网关�?2. **节点配对**：iOS/Android（以及未来的节点）发�?Gateway 网关并安全配对�?
设计目标是将所有网络发�?广播保留�?**Node Gateway 网关**（`RadioClaw gateway`）中，并让客户端（mac 应用、iOS）作为消费者�?
## 术语

- **Gateway 网关**：一个长期运行的 Gateway 网关进程，拥有状态（会话、配对、节点注册表）并运行渠道。大多数设置每台主机使用一个；也可以进行隔离的�?Gateway 网关设置�?- **Gateway 网关 WS（控制平面）**：默认在 `127.0.0.1:18789` 上的 WebSocket 端点；可通过 `gateway.bind` 绑定�?LAN/tailnet�?- **直连 WS 传输**：面�?LAN/tailnet �?Gateway 网关 WS 端点（无 SSH）�?- **SSH 传输（回退�?*：通过 SSH 转发 `127.0.0.1:18789` 进行远程控制�?- **旧版 TCP 桥接（已弃用/移除�?*：旧的节点传输（参见 [桥接协议](/gateway/bridge-protocol)）；不再用于发现广播�?
协议详情�?
- [Gateway 网关协议](/gateway/protocol)
- [桥接协议（旧版）](/gateway/bridge-protocol)

## 为什么我们同时保�?直连"�?SSH

- **直连 WS** 在同一网络�?tailnet 内提供最佳用户体验：
  - 通过 Bonjour �?LAN 上自动发�?  - 配对令牌 + ACL �?Gateway 网关管理
  - 无需 shell 访问；协议表面可保持紧凑和可审计
- **SSH** 仍然是通用回退方案�?  - 只要你有 SSH 访问权限就能工作（即使跨越不相关的网络）
  - 能应对多�?mDNS 问题
  - �?SSH 外无需新的入站端口

## 发现输入（客户端如何了解 Gateway 网关位置�?
### 1）Bonjour / mDNS（仅�?LAN�?
Bonjour 是尽力而为的，不会跨网络。它仅用�?同一 LAN"的便利性�?
目标方向�?
- **Gateway 网关**通过 Bonjour 广播�?WS 端点�?- 客户端浏览并显示"选择一�?Gateway 网关"列表，然后存储选定的端点�?
故障排除和信标详情：[Bonjour](/gateway/bonjour)�?
#### 服务信标详情

- 服务类型�?  - `_RadioClaw-gw._tcp`（Gateway 网关传输信标�?- TXT 键（非机密）�?  - `role=gateway`
  - `lanHost=<hostname>.local`
  - `sshPort=22`（或广播的端口）
  - `gatewayPort=18789`（Gateway 网关 WS + HTTP�?  - `gatewayTls=1`（仅当启�?TLS 时）
  - `gatewayTlsSha256=<sha256>`（仅当启�?TLS 且指纹可用时�?  - `canvasPort=18793`（默认画布主机端口；服务�?`/__RadioClaw__/canvas/`�?  - `cliPath=<path>`（可选；可运行的 `RadioClaw` 入口点或二进制文件的绝对路径�?  - `tailnetDns=<magicdns>`（可选提示；�?Tailscale 可用时自动检测）

禁用/覆盖�?
- `RadioClaw_DISABLE_BONJOUR=1` 禁用广播�?- `~/.RadioClaw/RadioClaw.json` 中的 `gateway.bind` 控制 Gateway 网关绑定模式�?- `RadioClaw_SSH_PORT` 覆盖 TXT 中广播的 SSH 端口（默认为 22）�?- `RadioClaw_TAILNET_DNS` 发布 `tailnetDns` 提示（MagicDNS）�?- `RadioClaw_CLI_PATH` 覆盖广播�?CLI 路径�?
### 2）Tailnet（跨网络�?
对于伦敦/维也纳风格的设置，Bonjour 无法帮助。推荐的"直连"目标是：

- Tailscale MagicDNS 名称（首选）或稳定的 tailnet IP�?
如果 Gateway 网关能检测到它正�?Tailscale 下运行，它会发布 `tailnetDns` 作为客户端的可选提示（包括广域信标）�?
### 3）手�?/ SSH 目标

当没有直连路由（或直连被禁用）时，客户端始终可以通过 SSH 转发本地回环 Gateway 网关端口来连接�?
参见 [远程访问](/gateway/remote)�?
## 传输选择（客户端策略�?
推荐的客户端行为�?
1. 如果已配置且可达已配对的直连端点，使用它�?2. 否则，如�?Bonjour �?LAN 上找�?Gateway 网关，提供一�?使用�?Gateway 网关"选择并将其保存为直连端点�?3. 否则，如果配置了 tailnet DNS/IP，尝试直连�?4. 否则，回退�?SSH�?
## 配对 + 认证（直连传输）

Gateway 网关是节�?客户端准入的唯一权威来源�?
- 配对请求�?Gateway 网关中创�?批准/拒绝（参�?[Gateway 网关配对](/gateway/pairing)）�?- Gateway 网关强制执行�?  - 认证（令�?/ 密钥对）
  - 作用�?ACL（Gateway 网关不是每个方法的原始代理）
  - 速率限制

## 各组件职�?
- **Gateway 网关**：广播发现信标，拥有配对决策权，并托�?WS 端点�?- **macOS 应用**：帮助你选择 Gateway 网关，显示配对提示，仅将 SSH 作为回退方案�?- **iOS/Android 节点**：将 Bonjour 浏览作为便利功能，连接到已配对的 Gateway 网关 WS�?