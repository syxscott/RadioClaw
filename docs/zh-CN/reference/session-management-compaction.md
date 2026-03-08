---
read_when:
  - 你需要调试会�?ID、记�?JSONL �?sessions.json 字段
  - 你正在更改自动压缩行为或添加"压缩�?内务处理
  - 你想实现记忆刷新或静默系统回�?summary: 深入了解：会话存�?+ 记录、生命周期和（自动）压缩内部机制
title: 会话管理深入了解
x-i18n:
  generated_at: "2026-02-03T07:54:38Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: bf3715770ba634363933f6038117b6a91af11c62f5191aaaf97e6bce099bc120
  source_path: reference/session-management-compaction.md
  workflow: 15
---

# 会话管理与压缩（深入了解�?
本文档解�?RadioClaw 如何端到端管理会话：

- **会话路由**（入站消息如何映射到 `sessionKey`�?- **会话存储**（`sessions.json`）及其跟踪的内容
- **记录持久�?*（`*.jsonl`）及其结�?- **记录清理**（运行前的提供商特定修复�?- **上下文限�?*（上下文窗口 vs 跟踪�?token 数）
- **压缩**（手�?+ 自动压缩）以及在何处挂接压缩前工�?- **静默内务处理**（例如不应产生用户可见输出的记忆写入�?
如果你想先了解更高层次的概述，请从以下内容开始：

- [/concepts/session](/concepts/session)
- [/concepts/compaction](/concepts/compaction)
- [/concepts/session-pruning](/concepts/session-pruning)
- [/reference/transcript-hygiene](/reference/transcript-hygiene)

---

## 事实来源：Gateway 网关

RadioClaw 围绕一个拥有会话状态的单一 **Gateway 网关进程**设计�?
- UI（macOS 应用、web 控制 UI、TUI）应该向 Gateway 网关查询会话列表�?token 计数�?- 在远程模式下，会话文件在远程主机上；"检查你的本�?Mac 文件"不会反映 Gateway 网关正在使用的内容�?
---

## 两个持久化层

RadioClaw 在两个层中持久化会话�?
1. **会话存储（`sessions.json`�?*
   - �?值映射：`sessionKey -> SessionEntry`
   - 小型、可变、可安全编辑（或删除条目�?   - 跟踪会话元数据（当前会话 ID、最后活动时间、开关、token 计数器等�?
2. **记录（`<sessionId>.jsonl`�?*
   - 具有树形结构的仅追加记录（条目有 `id` + `parentId`�?   - 存储实际对话 + 工具调用 + 压缩摘要
   - 用于为后续回合重建模型上下文

---

## 磁盘上的位置

�?Gateway 网关主机上，每个智能体：

- 存储：`~/.RadioClaw/agents/<agentId>/sessions/sessions.json`
- 记录：`~/.RadioClaw/agents/<agentId>/sessions/<sessionId>.jsonl`
  - Telegram 话题会话：`.../<sessionId>-topic-<threadId>.jsonl`

RadioClaw 通过 `src/config/sessions.ts` 解析这些位置�?
---

## 会话键（`sessionKey`�?
`sessionKey` 标识你所在的*哪个对话�?（路�?+ 隔离）�?
常见模式�?
- 主要/直接聊天（每个智能体）：`agent:<agentId>:<mainKey>`（默�?`main`�?- 群组：`agent:<agentId>:<channel>:group:<id>`
- 房间/频道（Discord/Slack）：`agent:<agentId>:<channel>:channel:<id>` �?`...:room:<id>`
- 定时任务：`cron:<job.id>`
- Webhook：`hook:<uuid>`（除非被覆盖�?
规范规则记录�?[/concepts/session](/concepts/session)�?
---

## 会话 ID（`sessionId`�?
每个 `sessionKey` 指向一个当前的 `sessionId`（继续对话的记录文件）�?
经验法则�?
- **重置**（`/new`、`/reset`）为�?`sessionKey` 创建一个新�?`sessionId`�?- **每日重置**（默�?Gateway 网关主机本地时间凌晨 4:00）在重置边界后的下一条消息时创建一个新�?`sessionId`�?- **空闲过期**（`session.reset.idleMinutes` 或旧�?`session.idleMinutes`）当消息在空闲窗口后到达时创建一个新�?`sessionId`。当同时配置了每日和空闲时，以先过期者为准�?
实现细节：决策发生在 `src/auto-reply/reply/session.ts` �?`initSessionState()` 中�?
---

## 会话存储模式（`sessions.json`�?
存储的值类型是 `src/config/sessions.ts` 中的 `SessionEntry`�?
关键字段（不完整）：

- `sessionId`：当前记�?ID（文件名从此派生，除非设置了 `sessionFile`�?- `updatedAt`：最后活动时间戳
- `sessionFile`：可选的显式记录路径覆盖
- `chatType`：`direct | group | room`（帮�?UI 和发送策略）
- `provider`、`subject`、`room`、`space`、`displayName`：群�?频道标签的元数据
- 开关：
  - `thinkingLevel`、`verboseLevel`、`reasoningLevel`、`elevatedLevel`
  - `sendPolicy`（每会话覆盖�?- 模型选择�?  - `providerOverride`、`modelOverride`、`authProfileOverride`
- Token 计数器（尽力而为/依赖提供商）�?  - `inputTokens`、`outputTokens`、`totalTokens`、`contextTokens`
- `compactionCount`：此会话键完成自动压缩的次数
- `memoryFlushAt`：最后一次压缩前记忆刷新的时间戳
- `memoryFlushCompactionCount`：最后一次刷新运行时的压缩计�?
存储可以安全编辑，但 Gateway 网关是权威：它可能会在会话运行时重写或重新水合条目�?
---

## 记录结构（`*.jsonl`�?
记录�?`@mariozechner/pi-coding-agent` �?`SessionManager` 管理�?
文件�?JSONL 格式�?
- 第一行：会话头（`type: "session"`，包�?`id`、`cwd`、`timestamp`、可选的 `parentSession`�?- 然后：带�?`id` + `parentId` 的会话条目（树形结构�?
值得注意的条目类型：

- `message`：用�?助手/工具结果消息
- `custom_message`：扩展注入的消息�?确实*进入模型上下文（可以�?UI 隐藏�?- `custom`�?�?进入模型上下文的扩展状�?- `compaction`：持久化的压缩摘要，带有 `firstKeptEntryId` �?`tokensBefore`
- `branch_summary`：导航树分支时的持久化摘�?
RadioClaw 有意**�?*"修复"记录；Gateway 网关使用 `SessionManager` 来读/写它们�?
---

## 上下文窗�?vs 跟踪�?token

两个不同的概念很重要�?
1. **模型上下文窗�?*：每个模型的硬上限（模型可见�?token�?2. **会话存储计数�?*：写�?`sessions.json` 的滚动统计（用于 /status 和仪表板�?
如果你在调整限制�?
- 上下文窗口来自模型目录（可以通过配置覆盖）�?- 存储中的 `contextTokens` 是运行时估计/报告值；不要将其视为严格保证�?
更多信息，参�?[/token-use](/reference/token-use)�?
---

## 压缩：它是什�?
压缩将较旧的对话总结为记录中的持久化 `compaction` 条目，并保持最近的消息不变�?
压缩后，未来的回合会看到�?
- 压缩摘要
- `firstKeptEntryId` 之后的消�?
压缩�?*持久化的**（与会话修剪不同）。参�?[/concepts/session-pruning](/concepts/session-pruning)�?
---

## 自动压缩何时发生（Pi 运行时）

在嵌入式 Pi 智能体中，自动压缩在两种情况下触发：

1. **溢出恢复**：模型返回上下文溢出错误 �?压缩 �?重试�?2. **阈值维�?*：在成功的回合后，当�?
`contextTokens > contextWindow - reserveTokens`

其中�?
- `contextWindow` 是模型的上下文窗�?- `reserveTokens` 是为提示 + 下一个模型输出保留的空间

这些�?Pi 运行时语义（RadioClaw 消费事件，但 Pi 决定何时压缩）�?
---

## 压缩设置（`reserveTokens`、`keepRecentTokens`�?
Pi 的压缩设置位�?Pi 设置中：

```json5
{
  compaction: {
    enabled: true,
    reserveTokens: 16384,
    keepRecentTokens: 20000,
  },
}
```

RadioClaw 还为嵌入式运行强制执行安全下限：

- 如果 `compaction.reserveTokens < reserveTokensFloor`，OpenClaw 会提升它�?- 默认下限�?`20000` �?token�?- 设置 `agents.defaults.compaction.reserveTokensFloor: 0` 以禁用下限�?- 如果它已经更高，RadioClaw 不会改变它�?
原因：为压缩变得不可避免之前的多回合"内务处理"（如记忆写入）留出足够的空间�?
实现：`src/agents/pi-settings.ts` 中的 `ensurePiCompactionReserveTokens()`（从 `src/agents/pi-embedded-runner.ts` 调用）�?
---

## 用户可见的界�?
你可以通过以下方式观察压缩和会话状态：

- `/status`（在任何聊天会话中）
- `RadioClaw status`（CLI�?- `RadioClaw sessions` / `sessions --json`
- 详细模式：`🧹 Auto-compaction complete` + 压缩计数

---

## 静默内务处理（`NO_REPLY`�?
RadioClaw 支持用于后台任务�?静默"回合，用户不应该看到中间输出�?
约定�?
- 助手�?`NO_REPLY` 开始其输出，表�?不要向用户发送回�?�?- RadioClaw 在投递层剥离/抑制此内容�?
�?`2026.1.10` 开始，当部分块�?`NO_REPLY` 开头时，OpenClaw 还会抑制**草稿/打字流式输出**，因此静默操作不会在回合中途泄漏部分输出�?
---

## 压缩�?记忆刷新"（已实现�?
目标：在自动压缩发生之前，运行一个静默的智能体回合，将持久状态写入磁盘（例如智能体工作空间中�?`memory/YYYY-MM-DD.md`），这样压缩就不会擦除关键上下文�?
RadioClaw 使用**预阈值刷�?*方法�?
1. 监控会话上下文使用情况�?2. 当它越过"软阈�?（低�?Pi 的压缩阈值）时，向智能体运行一个静默的"现在写入记忆"指令�?3. 使用 `NO_REPLY` 以便用户看不到任何内容�?
配置（`agents.defaults.compaction.memoryFlush`）：

- `enabled`（默认：`true`�?- `softThresholdTokens`（默认：`4000`�?- `prompt`（刷新回合的用户消息�?- `systemPrompt`（为刷新回合附加的额外系统提示）

说明�?
- 默认的提�?系统提示包含 `NO_REPLY` 提示以抑制投递�?- 刷新每个压缩周期运行一次（�?`sessions.json` 中跟踪）�?- 刷新仅对嵌入�?Pi 会话运行（CLI 后端跳过它）�?- 当会话工作空间是只读时（`workspaceAccess: "ro"` �?`"none"`），刷新会被跳过�?- 参见[记忆](/concepts/memory)了解工作空间文件布局和写入模式�?
Pi 还在扩展 API 中公开�?`session_before_compact` 钩子，但 RadioClaw 的刷新逻辑目前位于 Gateway 网关端�?
---

## 故障排除检查清�?
- 会话键错误？�?[/concepts/session](/concepts/session) 开始，并在 `/status` 中确�?`sessionKey`�?- 存储 vs 记录不匹配？�?`RadioClaw status` 确认 Gateway 网关主机和存储路径�?- 压缩过于频繁？检查：
  - 模型上下文窗口（太小�?  - 压缩设置（`reserveTokens` 对于模型窗口来说太高会导致更早的压缩�?  - 工具结果膨胀：启�?调整会话修剪
- 静默回合泄漏？确认回复以 `NO_REPLY`（精�?token）开头，并且你使用的构建版本包含流式输出抑制修复�?