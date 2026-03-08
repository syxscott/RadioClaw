---
read_when:
  - 添加或修�?doctor 迁移
  - 引入破坏性配置更�?summary: Doctor 命令：健康检查、配置迁移和修复步骤
title: Doctor
x-i18n:
  generated_at: "2026-02-03T07:49:03Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: df7b25f60fd08d508f4c6abfc8e7e06f29bd4bbb34c3320397f47eb72c8de83f
  source_path: gateway/doctor.md
  workflow: 15
---

# Doctor

`RadioClaw doctor` �?RadioClaw 的修�?+ 迁移工具。它修复过时的配�?状态，检查健康状况，并提供可操作的修复步骤�?
## 快速开�?
```bash
RadioClaw doctor
```

### 无头/自动�?
```bash
RadioClaw doctor --yes
```

无需提示接受默认值（包括适用时的重启/服务/沙箱修复步骤）�?
```bash
RadioClaw doctor --repair
```

无需提示应用推荐的修复（安全时进行修�?+ 重启）�?
```bash
RadioClaw doctor --repair --force
```

也应用激进的修复（覆盖自定义 supervisor 配置）�?
```bash
RadioClaw doctor --non-interactive
```

无需提示运行，仅应用安全迁移（配置规范化 + 磁盘状态移动）。跳过需要人工确认的重启/服务/沙箱操作�?检测到时自动运行遗留状态迁移�?
```bash
RadioClaw doctor --deep
```

扫描系统服务以查找额外的 Gateway 网关安装（launchd/systemd/schtasks）�?
如果你想在写入前查看更改，请先打开配置文件�?
```bash
cat ~/.RadioClaw/RadioClaw.json
```

## 功能概述

- git 安装的可选预检更新（仅交互模式）�?- UI 协议新鲜度检查（当协�?schema 较新时重�?Control UI）�?- 健康检�?+ 重启提示�?- Skills 状态摘要（符合条件/缺失/被阻止）�?- 遗留值的配置规范化�?- OpenCode Zen 提供商覆盖警告（`models.providers.opencode`）�?- 遗留磁盘状态迁移（会话/智能体目�?WhatsApp 认证）�?- 状态完整性和权限检查（会话、记录、状态目录）�?- 本地运行时的配置文件权限检查（chmod 600）�?- 模型认证健康：检�?OAuth 过期，可刷新即将过期�?token，并报告认证配置文件冷却/禁用状态�?- 额外工作区目录检测（`~/RadioClaw`）�?- 启用沙箱隔离时的沙箱镜像修复�?- 遗留服务迁移和额�?Gateway 网关检测�?- Gateway 网关运行时检查（服务已安装但未运行；缓存�?launchd 标签）�?- 渠道状态警告（从运行中�?Gateway 网关探测）�?- Supervisor 配置审计（launchd/systemd/schtasks）及可选修复�?- Gateway 网关运行时最佳实践检查（Node vs Bun，版本管理器路径）�?- Gateway 网关端口冲突诊断（默�?`18789`）�?- 开放私信策略的安全警告�?- 未设�?`gateway.auth.token` 时的 Gateway 网关认证警告（本地模式；提供 token 生成）�?- Linux 上的 systemd linger 检查�?- 源码安装检查（pnpm workspace 不匹配、缺�?UI 资产、缺�?tsx 二进制文件）�?- 写入更新后的配置 + 向导元数据�?
## 详细行为和原�?
### 0）可选更新（git 安装�?
如果这是 git 检出且 doctor 以交互模式运行，它会在运�?doctor 之前提供更新（fetch/rebase/build）�?
### 1）配置规范化

如果配置包含遗留值形式（例如没有渠道特定覆盖�?`messages.ackReaction`），doctor 会将它们规范化为当前 schema�?
### 2）遗留配置键迁移

当配置包含已弃用的键时，其他命令会拒绝运行并要求你运�?`RadioClaw doctor`�?
Doctor 将：

- 解释找到了哪些遗留键�?- 显示它应用的迁移�?- 使用更新后的 schema 重写 `~/.RadioClaw/RadioClaw.json`�?
Gateway 网关在检测到遗留配置格式时也会在启动时自动运�?doctor 迁移，因此过时的配置无需手动干预即可修复�?
当前迁移�?
- `routing.allowFrom` �?`channels.whatsapp.allowFrom`
- `routing.groupChat.requireMention` �?`channels.whatsapp/telegram/imessage.groups."*".requireMention`
- `routing.groupChat.historyLimit` �?`messages.groupChat.historyLimit`
- `routing.groupChat.mentionPatterns` �?`messages.groupChat.mentionPatterns`
- `routing.queue` �?`messages.queue`
- `routing.bindings` �?顶级 `bindings`
- `routing.agents`/`routing.defaultAgentId` �?`agents.list` + `agents.list[].default`
- `routing.agentToAgent` �?`tools.agentToAgent`
- `routing.transcribeAudio` �?`tools.media.audio.models`
- `bindings[].match.accountID` �?`bindings[].match.accountId`
- `identity` �?`agents.list[].identity`
- `agent.*` �?`agents.defaults` + `tools.*`（tools/elevated/exec/sandbox/subagents�?- `agent.model`/`allowedModels`/`modelAliases`/`modelFallbacks`/`imageModelFallbacks`
  �?`agents.defaults.models` + `agents.defaults.model.primary/fallbacks` + `agents.defaults.imageModel.primary/fallbacks`

### 2b）OpenCode Zen 提供商覆�?
如果你手动添加了 `models.providers.opencode`（或 `opencode-zen`），它会覆盖 `@mariozechner/pi-ai` 中内置的 OpenCode Zen 目录。这可能会强制将每个模型放到单个 API 上或将成本归零。Doctor 会发出警告，以便你可以移除覆盖并恢复每模�?API 路由 + 成本�?
### 3）遗留状态迁移（磁盘布局�?
Doctor 可以将旧的磁盘布局迁移到当前结构：

- 会话存储 + 记录�?  - �?`~/.RadioClaw/sessions/` �?`~/.RadioClaw/agents/<agentId>/sessions/`
- 智能体目录：
  - �?`~/.RadioClaw/agent/` �?`~/.RadioClaw/agents/<agentId>/agent/`
- WhatsApp 认证状态（Baileys）：
  - 从遗留的 `~/.RadioClaw/credentials/*.json`（除 `oauth.json` 外）
  - �?`~/.RadioClaw/credentials/whatsapp/<accountId>/...`（默认账�?id：`default`�?
这些迁移是尽力而为且幂等的；当 doctor 将任何遗留文件夹作为备份保留时会发出警告。Gateway 网关/CLI 也会在启动时自动迁移遗留会话 + 智能体目录，因此历史/认证/模型会落在每智能体路径中，无需手动运行 doctor。WhatsApp 认证有意仅通过 `RadioClaw doctor` 迁移�?
### 4）状态完整性检查（会话持久化、路由和安全�?
状态目录是操作的核心。如果它消失，你会丢失会话、凭证、日志和配置（除非你在别处有备份）�?
Doctor 检查：

- **状态目录缺�?*：警告灾难性状态丢失，提示重新创建目录，并提醒你它无法恢复丢失的数据�?- **状态目录权�?*：验证可写性；提供修复权限（并在检测到所有�?组不匹配时发�?`chown` 提示）�?- **会话目录缺失**：`sessions/` 和会话存储目录是持久化历史和避免 `ENOENT` 崩溃所必需的�?- **记录不匹�?*：当最近的会话条目缺少记录文件时发出警告�?- **主会�?1 �?JSONL"**：当主记录只有一行时标记（历史未累积）�?- **多个状态目�?*：当多个 `~/.RadioClaw` 文件夹存在于不同 home 目录或当 `RadioClaw_STATE_DIR` 指向别处时发出警告（历史可能在安装之间分裂）�?- **远程模式提醒**：如�?`gateway.mode=remote`，doctor 会提醒你在远程主机上运行它（状态在那里）�?- **配置文件权限**：当 `~/.RadioClaw/RadioClaw.json` 对组/其他用户可读时发出警告，并提供收紧到 `600` 的选项�?
### 5）模型认证健康（OAuth 过期�?
Doctor 检查认证存储中�?OAuth 配置文件，在 token 即将过期/已过期时发出警告，并在安全时刷新它们。如�?Anthropic Claude Code 配置文件过时，它会建议运�?`claude setup-token`（或粘贴 setup-token）�?刷新提示仅在交互运行（TTY）时出现；`--non-interactive` 跳过刷新尝试�?
Doctor 还会报告由于以下原因暂时不可用的认证配置文件�?
- 短冷却（速率限制/超时/认证失败�?- 长禁用（账单/信用失败�?
### 6）Hooks 模型验证

如果设置�?`hooks.gmail.model`，doctor 会根据目录和允许列表验证模型引用，并在无法解析或不允许时发出警告�?
### 7）沙箱镜像修�?
当启用沙箱隔离时，doctor 检�?Docker 镜像，并在当前镜像缺失时提供构建或切换到遗留名称的选项�?
### 8）Gateway 网关服务迁移和清理提�?
Doctor 检测遗留的 Gateway 网关服务（launchd/systemd/schtasks），并提供删除它们并使用当前 Gateway 网关端口安装 RadioClaw 服务的选项。它还可以扫描额外的�?Gateway 网关服务并打印清理提示�?配置文件命名�?RadioClaw Gateway 网关服务被视为一等公民，不会被标记为"额外�?�?
### 9）安全警�?
当提供商对私信开放而没有允许列表，或当策略以危险方式配置时，Doctor 会发出警告�?
### 10）systemd linger（Linux�?
如果作为 systemd 用户服务运行，doctor 确保启用 lingering，以�?Gateway 网关在注销后保持活动�?
### 11）Skills 状�?
Doctor 打印当前工作区符合条�?缺失/被阻止的 Skills 的快速摘要�?
### 12）Gateway 网关认证检查（本地 token�?
当本�?Gateway 网关缺少 `gateway.auth` 时，Doctor 会发出警告并提供生成 token 的选项。使�?`RadioClaw doctor --generate-gateway-token` 在自动化中强制创�?token�?
### 13）Gateway 网关健康检�?+ 重启

Doctor 运行健康检查，并在 Gateway 网关看起来不健康时提供重启选项�?
### 14）渠道状态警�?
如果 Gateway 网关健康，doctor 运行渠道状态探测并报告警告及建议的修复�?
### 15）Supervisor 配置审计 + 修复

Doctor 检查已安装�?supervisor 配置（launchd/systemd/schtasks）是否有缺失或过时的默认值（例如 systemd network-online 依赖和重启延迟）。当发现不匹配时，它会推荐更新，并可以将服务文件/任务重写为当前默认值�?
注意事项�?
- `RadioClaw doctor` 在重�?supervisor 配置前提示�?- `RadioClaw doctor --yes` 接受默认修复提示�?- `RadioClaw doctor --repair` 无需提示应用推荐的修复�?- `RadioClaw doctor --repair --force` 覆盖自定�?supervisor 配置�?- 你始终可以通过 `RadioClaw gateway install --force` 强制完全重写�?
### 16）Gateway 网关运行�?+ 端口诊断

Doctor 检查服务运行时（PID、上次退出状态），并在服务已安装但实际未运行时发出警告。它还检�?Gateway 网关端口（默�?`18789`）上的端口冲突，并报告可能的原因（Gateway 网关已在运行、SSH 隧道）�?
### 17）Gateway 网关运行时最佳实�?
�?Gateway 网关服务�?Bun 或版本管理器管理�?Node 路径（`nvm`、`fnm`、`volta`、`asdf` 等）上运行时，Doctor 会发出警告。WhatsApp + Telegram 渠道需�?Node，版本管理器路径在升级后可能会中断，因为服务不会加载你的 shell init。Doctor 会在可用时提供迁移到系统 Node 安装的选项（Homebrew/apt/choco）�?
### 18）配置写�?+ 向导元数�?
Doctor 持久化任何配置更改，并标记向导元数据以记�?doctor 运行�?
### 19）工作区提示（备�?+ 记忆系统�?
当缺失时，Doctor 建议使用工作区记忆系统，并在工作区尚未在 git 下时打印备份提示�?
参见 [/concepts/agent-workspace](/concepts/agent-workspace) 了解工作区结构和 git 备份的完整指南（推荐私有 GitHub �?GitLab）�?