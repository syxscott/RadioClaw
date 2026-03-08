---
read_when:
  - 配对或重新连�?Android 节点
  - 调试 Android Gateway 网关发现或认�?  - 验证跨客户端的聊天历史一致�?summary: Android 应用（节点）：连接操作手�?+ Canvas/Chat/Camera
title: Android 应用
x-i18n:
  generated_at: "2026-02-03T07:51:34Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 9cd02f12065ce2bc483379c9afd7537489d9076094f4a412cf9f21ccc47f0e38
  source_path: platforms/android.md
  workflow: 15
---

# Android 应用（节点）

## 支持概览

- 角色：配套节点应用（Android 不托�?Gateway 网关）�?- 需�?Gateway 网关：是（在 macOS、Linux 或通过 WSL2 �?Windows 上运行）�?- 安装：[入门指南](/start/getting-started) + [配对](/gateway/pairing)�?- Gateway 网关：[操作手册](/gateway) + [配置](/gateway/configuration)�?  - 协议：[Gateway 网关协议](/gateway/protocol)（节�?+ 控制平面）�?
## 系统控制

系统控制（launchd/systemd）位�?Gateway 网关主机上。参�?[Gateway 网关](/gateway)�?
## 连接操作手册

Android 节点应用 ⇄（mDNS/NSD + WebSocket）⇄ **Gateway 网关**

Android 直接连接�?Gateway 网关 WebSocket（默�?`ws://<host>:18789`）并使用 Gateway 网关拥有的配对�?
### 前置条件

- 你可以在"�?机器上运�?Gateway 网关�?- Android 设备/模拟器可以访�?Gateway 网关 WebSocket�?  - 使用 mDNS/NSD 的同一局域网�?*�?*
  - 使用 Wide-Area Bonjour / unicast DNS-SD 的同一 Tailscale tailnet（见下文），**�?*
  - 手动 Gateway 网关主机/端口（回退方案�?- 你可以在 Gateway 网关机器上运�?CLI（`RadioClaw`）（或通过 SSH）�?
### 1）启�?Gateway 网关

```bash
RadioClaw gateway --port 18789 --verbose
```

在日志中确认你看到类似内容：

- `listening on ws://0.0.0.0:18789`

对于�?tailnet 设置（推荐用于维也纳 �?伦敦），�?Gateway 网关绑定�?tailnet IP�?
- �?Gateway 网关主机�?`~/.RadioClaw/RadioClaw.json` 中设�?`gateway.bind: "tailnet"`�?- 重启 Gateway 网关 / macOS 菜单栏应用�?
### 2）验证发现（可选）

�?Gateway 网关机器�?
```bash
dns-sd -B _RadioClaw-gw._tcp local.
```

更多调试说明：[Bonjour](/gateway/bonjour)�?
#### 通过 unicast DNS-SD �?Tailnet（维也纳 �?伦敦）发�?
Android NSD/mDNS 发现无法跨网络。如果你�?Android 节点�?Gateway 网关在不同网络但通过 Tailscale 连接，请改用 Wide-Area Bonjour / unicast DNS-SD�?
1. �?Gateway 网关主机上设�?DNS-SD 区域（示�?`RadioClaw.internal.`）并发布 `_RadioClaw-gw._tcp` 记录�?2. 配置 Tailscale split DNS，将你选择的域指向�?DNS 服务器�?
详情和示�?CoreDNS 配置：[Bonjour](/gateway/bonjour)�?
### 3）从 Android 连接

�?Android 应用中：

- 应用通过**前台服务**（持久通知）保�?Gateway 网关连接活动�?- 打开**设置**�?- �?*发现�?Gateway 网关**下，选择你的 Gateway 网关并点�?*连接**�?- 如果 mDNS 被阻止，使用**高级 �?手动 Gateway 网关**（主�?+ 端口）并**连接（手动）**�?
首次成功配对后，Android 在启动时自动重连�?
- 手动端点（如果启用），否�?- 上次发现�?Gateway 网关（尽力而为）�?
### 4）批准配对（CLI�?
�?Gateway 网关机器上：

```bash
RadioClaw nodes pending
RadioClaw nodes approve <requestId>
```

配对详情：[Gateway 网关配对](/gateway/pairing)�?
### 5）验证节点已连接

- 通过节点状态：
  ```bash
  RadioClaw nodes status
  ```
- 通过 Gateway 网关�?  ```bash
  RadioClaw gateway call node.list --params "{}"
  ```

### 6）聊�?+ 历史

Android 节点�?Chat 面板使用 Gateway 网关�?*主会话键**（`main`），因此历史和回复与 WebChat 和其他客户端共享�?
- 历史：`chat.history`
- 发送：`chat.send`
- 推送更新（尽力而为）：`chat.subscribe` �?`event:"chat"`

### 7）Canvas + 摄像�?
#### Gateway 网关 Canvas 主机（推荐用�?web 内容�?
如果你想让节点显示智能体可以在磁盘上编辑的真�?HTML/CSS/JS，请将节点指�?Gateway 网关 canvas 主机�?
注意：节点使�?`canvasHost.port`（默�?`18793`）上的独�?canvas 主机�?
1. �?Gateway 网关主机上创�?`~/.RadioClaw/workspace/canvas/index.html`�?
2. 将节点导航到它（局域网）：

```bash
RadioClaw nodes invoke --node "<Android Node>" --command canvas.navigate --params '{"url":"http://<gateway-hostname>.local:18793/__RadioClaw__/canvas/"}'
```

Tailnet（可选）：如果两个设备都�?Tailscale 上，使用 MagicDNS 名称�?tailnet IP 而不�?`.local`，例�?`http://<gateway-magicdns>:18793/__RadioClaw__/canvas/`�?
此服务器将实时重载客户端注入 HTML 并在文件更改时重新加载�?A2UI 主机位于 `http://<gateway-host>:18793/__RadioClaw__/a2ui/`�?
Canvas 命令（仅前台）：

- `canvas.eval`、`canvas.snapshot`、`canvas.navigate`（使�?`{"url":""}` �?`{"url":"/"}` 返回默认脚手架）。`canvas.snapshot` 返回 `{ format, base64 }`（默�?`format="jpeg"`）�?- A2UI：`canvas.a2ui.push`、`canvas.a2ui.reset`（`canvas.a2ui.pushJSONL` 遗留别名�?
摄像头命令（仅前台；权限限制）：

- `camera.snap`（jpg�?- `camera.clip`（mp4�?
参见 [Camera 节点](/nodes/camera) 了解参数�?CLI 助手�?