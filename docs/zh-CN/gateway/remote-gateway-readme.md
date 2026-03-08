---
read_when: Connecting the macOS app to a remote gateway over SSH
summary: RadioClaw.app 连接远程 Gateway 网关�?SSH 隧道设置
title: 远程 Gateway 网关设置
x-i18n:
  generated_at: "2026-02-03T07:48:37Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: b1ae266a7cb4911b82ae3ec6cb98b1b57aca592aeb1dc8b74bbce9b0ea9dd1d1
  source_path: gateway/remote-gateway-readme.md
  workflow: 15
---

# 使用远程 Gateway 网关运行 RadioClaw.app

RadioClaw.app 使用 SSH 隧道连接到远�?Gateway 网关。本指南向你展示如何设置�?
## 概述

```
┌─────────────────────────────────────────────────────────────�?�?                       Client Machine                          �?�?                                                             �?�? RadioClaw.app ──�?ws://127.0.0.1:18789 (local port)           �?�?                    �?                                       �?�?                    �?                                       �?�? SSH Tunnel ────────────────────────────────────────────────�?�?                    �?                                       �?└─────────────────────┼──────────────────────────────────────�?                      �?                      �?┌─────────────────────────────────────────────────────────────�?�?                        Remote Machine                        �?�?                                                             �?�? Gateway WebSocket ──�?ws://127.0.0.1:18789 ──�?             �?�?                                                             �?└─────────────────────────────────────────────────────────────�?```

## 快速设�?
### 步骤 1：添�?SSH 配置

编辑 `~/.ssh/config` 并添加：

```ssh
Host remote-gateway
    HostName <REMOTE_IP>          # e.g., 172.27.187.184
    User <REMOTE_USER>            # e.g., jefferson
    LocalForward 18789 127.0.0.1:18789
    IdentityFile ~/.ssh/id_rsa
```

�?`<REMOTE_IP>` �?`<REMOTE_USER>` 替换为你的值�?
### 步骤 2：复�?SSH 密钥

将你的公钥复制到远程机器（输入一次密码）�?
```bash
ssh-copy-id -i ~/.ssh/id_rsa <REMOTE_USER>@<REMOTE_IP>
```

### 步骤 3：设�?Gateway 网关令牌

```bash
launchctl setenv RadioClaw_GATEWAY_TOKEN "<your-token>"
```

### 步骤 4：启�?SSH 隧道

```bash
ssh -N remote-gateway &
```

### 步骤 5：重�?RadioClaw.app

```bash
# Quit RadioClaw.app (⌘Q), then reopen:
open /path/to/RadioClaw.app
```

应用现在将通过 SSH 隧道连接到远�?Gateway 网关�?
---

## 登录时自动启动隧�?
要在登录时自动启�?SSH 隧道，请创建一�?Launch Agent�?
### 创建 PLIST 文件

将此保存�?`~/Library/LaunchAgents/bot.molt.ssh-tunnel.plist`�?
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>bot.molt.ssh-tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/ssh</string>
        <string>-N</string>
        <string>remote-gateway</string>
    </array>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

### 加载 Launch Agent

```bash
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/bot.molt.ssh-tunnel.plist
```

隧道现在将：

- 登录时自动启�?- 崩溃时重新启�?- 在后台持续运�?
旧版注意事项：如果存在任何遗留的 `com.RadioClaw.ssh-tunnel` LaunchAgent，请将其删除�?
---

## 故障排除

**检查隧道是否正在运行：**

```bash
ps aux | grep "ssh -N remote-gateway" | grep -v grep
lsof -i :18789
```

**重启隧道�?*

```bash
launchctl kickstart -k gui/$UID/bot.molt.ssh-tunnel
```

**停止隧道�?*

```bash
launchctl bootout gui/$UID/bot.molt.ssh-tunnel
```

---

## 工作原理

| 组件                                 | 功能                                  |
| ------------------------------------ | ------------------------------------- |
| `LocalForward 18789 127.0.0.1:18789` | 将本地端�?18789 转发到远程端�?18789 |
| `ssh -N`                             | SSH 不执行远程命令（仅端口转发）      |
| `KeepAlive`                          | 隧道崩溃时自动重�?                   |
| `RunAtLoad`                          | 代理加载时启动隧�?                   |

RadioClaw.app 连接到你的客户端机器上的 `ws://127.0.0.1:18789`。SSH 隧道将该连接转发到运�?Gateway 网关的远程机器的端口 18789�?