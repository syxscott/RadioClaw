---
read_when:
  - 你想�?RadioClaw 中支�?Zalo Personal（非官方�?  - 你正在配置或开�?zalouser 插件
summary: Zalo Personal 插件：通过 zca-cli 进行 QR 登录 + 消息（插件安�?+ 渠道配置 + CLI + 工具�?title: Zalo Personal 插件
x-i18n:
  generated_at: "2026-02-03T07:53:33Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: b29b788b023cd50720e24fe6719f02e9f86c8bca9c73b3638fb53c2316718672
  source_path: plugins/zalouser.md
  workflow: 15
---

# Zalo Personal（插件）

通过插件�?RadioClaw 提供 Zalo Personal 支持，使�?`zca-cli` 自动化普�?Zalo 用户账户�?
> **警告�?* 非官方自动化可能导致账户被暂�?封禁。使用风险自负�?
## 命名

渠道 id �?`zalouser`，以明确表示这是自动�?*个人 Zalo 用户账户**（非官方）。我们保�?`zalo` 用于潜在的未来官�?Zalo API 集成�?
## 运行位置

此插�?*�?Gateway 网关进程�?*运行�?
如果你使用远�?Gateway 网关，请�?*运行 Gateway 网关的机�?*上安�?配置它，然后重启 Gateway 网关�?
## 安装

### 选项 A：从 npm 安装

```bash
RadioClaw plugins install @RadioClaw/zalouser
```

之后重启 Gateway 网关�?
### 选项 B：从本地文件夹安装（开发）

```bash
RadioClaw plugins install ./extensions/zalouser
cd ./extensions/zalouser && pnpm install
```

之后重启 Gateway 网关�?
## 前置条件：zca-cli

Gateway 网关机器必须�?`PATH` 中有 `zca`�?
```bash
zca --version
```

## 配置

渠道配置位于 `channels.zalouser` 下（不是 `plugins.entries.*`）：

```json5
{
  channels: {
    zalouser: {
      enabled: true,
      dmPolicy: "pairing",
    },
  },
}
```

## CLI

```bash
RadioClaw channels login --channel zalouser
RadioClaw channels logout --channel zalouser
RadioClaw channels status --probe
RadioClaw message send --channel zalouser --target <threadId> --message "Hello from RadioClaw"
RadioClaw directory peers list --channel zalouser --query "name"
```

## 智能体工�?
工具名称：`zalouser`

操作：`send`、`image`、`link`、`friends`、`groups`、`me`、`status`
