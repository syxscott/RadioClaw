---
read_when:
  - 你想在云端运�?Gateway 网关
  - 你需�?VPS/托管指南的快速索�?summary: RadioClaw �?VPS 托管中心（Oracle/Fly/Hetzner/GCP/exe.dev�?title: VPS 托管
x-i18n:
  generated_at: "2026-02-03T10:12:57Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 7749b479b333aa5541e7ad8b0ff84e9f8f6bd10d7188285121975cb893acc037
  source_path: vps.md
  workflow: 15
---

# VPS 托管

本中心链接到支持�?VPS/托管指南，并在高层次上解释云部署的工作原理�?
## 选择提供�?
- **Railway**（一�?+ 浏览器设置）：[Railway](/install/railway)
- **Northflank**（一�?+ 浏览器设置）：[Northflank](/install/northflank)
- **Oracle Cloud（永久免费）**：[Oracle](/platforms/oracle) �?$0/月（永久免费，ARM；容�?注册可能不太稳定�?- **Fly.io**：[Fly.io](/install/fly)
- **Hetzner（Docker�?*：[Hetzner](/install/hetzner)
- **GCP（Compute Engine�?*：[GCP](/install/gcp)
- **exe.dev**（VM + HTTPS 代理）：[exe.dev](/install/exe-dev)
- **AWS（EC2/Lightsail/免费套餐�?*：也运行良好。视频指南：
  https://x.com/techfrenAJ/status/2014934471095812547

## 云设置的工作原理

- **Gateway 网关运行�?VPS �?*并拥有状�?+ 工作区�?- 你通过**控制 UI** �?**Tailscale/SSH** 从笔记本电脑/手机连接�?- �?VPS 视为数据源并**备份**状�?+ 工作区�?- 安全默认：将 Gateway 网关保持�?loopback 上，通过 SSH 隧道�?Tailscale Serve 访问�?  如果你绑定到 `lan`/`tailnet`，需�?`gateway.auth.token` �?`gateway.auth.password`�?
远程访问：[Gateway 网关远程访问](/gateway/remote)
平台中心：[平台](/platforms)

## �?VPS 上使用节�?
你可以将 Gateway 网关保持在云端，并在本地设备（Mac/iOS/Android/无头）上配对**节点**。节点提供本地屏�?摄像�?canvas �?`system.run` 功能，�?Gateway 网关保持在云端�?
文档：[节点](/nodes)，[节点 CLI](/cli/nodes)
