---
read_when:
  - 设置 Signal 支持
  - 调试 Signal 发�?接收
summary: 通过 signal-cli（JSON-RPC + SSE）支�?Signal，设置和号码模型
title: Signal
x-i18n:
  generated_at: "2026-02-03T07:44:15Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: ca4de8b3685017f54a959e3e2699357ab40b3e4e68574bd7fb5739e4679e7d8a
  source_path: channels/signal.md
  workflow: 15
---

# Signal (signal-cli)

状态：外部 CLI 集成。Gateway 网关通过 HTTP JSON-RPC + SSE �?`signal-cli` 通信�?
## 快速设置（初学者）

1. �?bot 使用**单独�?Signal 号码**（推荐）�?2. 安装 `signal-cli`（需�?Java）�?3. 链接 bot 设备并启动守护进程：
   - `signal-cli link -n "RadioClaw"`
4. 配置 RadioClaw 并启�?Gateway 网关�?
最小配置：

```json5
{
  channels: {
    signal: {
      enabled: true,
      account: "+15551234567",
      cliPath: "signal-cli",
      dmPolicy: "pairing",
      allowFrom: ["+15557654321"],
    },
  },
}
```

## 它是什�?
- 通过 `signal-cli` �?Signal 渠道（非嵌入�?libsignal）�?- 确定性路由：回复始终返回�?Signal�?- 私信共享智能体的主会话；群组是隔离的（`agent:<agentId>:signal:group:<groupId>`）�?
## 配置写入

默认情况下，Signal 允许写入�?`/config set|unset` 触发的配置更新（需�?`commands.config: true`）�?
禁用方式�?
```json5
{
  channels: { signal: { configWrites: false } },
}
```

## 号码模型（重要）

- Gateway 网关连接到一�?**Signal 设备**（`signal-cli` 账户）�?- 如果你在**个人 Signal 账户**上运�?bot，它会忽略你自己的消息（循环保护）�?- 要实�?我发消息�?bot 然后它回�?，请使用**单独�?bot 号码**�?
## 设置（快速路径）

1. 安装 `signal-cli`（需�?Java）�?2. 链接 bot 账户�?   - `signal-cli link -n "RadioClaw"` 然后�?Signal 中扫描二维码�?3. 配置 Signal 并启�?Gateway 网关�?
示例�?
```json5
{
  channels: {
    signal: {
      enabled: true,
      account: "+15551234567",
      cliPath: "signal-cli",
      dmPolicy: "pairing",
      allowFrom: ["+15557654321"],
    },
  },
}
```

多账户支持：使用 `channels.signal.accounts` 配置每个账户及可选的 `name`。共享模式请参见 [`gateway/configuration`](/gateway/configuration#telegramaccounts--discordaccounts--slackaccounts--signalaccounts--imessageaccounts)�?
## 外部守护进程模式（httpUrl�?
如果你想自己管理 `signal-cli`（JVM 冷启动慢、容器初始化或共�?CPU），请单独运行守护进程并�?RadioClaw 指向它：

```json5
{
  channels: {
    signal: {
      httpUrl: "http://127.0.0.1:8080",
      autoStart: false,
    },
  },
}
```

这会跳过自动启动�?RadioClaw 内部的启动等待。对于自动启动时的慢启动，请设置 `channels.signal.startupTimeoutMs`�?
## 访问控制（私�?+ 群组�?
私信�?
- 默认：`channels.signal.dmPolicy = "pairing"`�?- 未知发送者会收到配对码；消息在批准前会被忽略（配对码 1 小时后过期）�?- 通过以下方式批准�?  - `RadioClaw pairing list signal`
  - `RadioClaw pairing approve signal <CODE>`
- 配对�?Signal 私信的默认令牌交换方式。详情：[配对](/channels/pairing)
- 仅有 UUID 的发送者（来自 `sourceUuid`）在 `channels.signal.allowFrom` 中存储为 `uuid:<id>`�?
群组�?
- `channels.signal.groupPolicy = open | allowlist | disabled`�?- 当设置为 `allowlist` 时，`channels.signal.groupAllowFrom` 控制谁可以在群组中触发�?
## 工作原理（行为）

- `signal-cli` 作为守护进程运行；Gateway 网关通过 SSE 读取事件�?- 入站消息被规范化为共享渠道信封�?- 回复始终路由回同一号码或群组�?
## 媒体 + 限制

- 出站文本�?`channels.signal.textChunkLimit` 分块（默�?4000）�?- 可选换行分块：设置 `channels.signal.chunkMode="newline"` 在长度分块前按空行（段落边界）分割�?- 支持附件（从 `signal-cli` 获取 base64）�?- 默认媒体上限：`channels.signal.mediaMaxMb`（默�?8）�?- 使用 `channels.signal.ignoreAttachments` 跳过下载媒体�?- 群组历史上下文使�?`channels.signal.historyLimit`（或 `channels.signal.accounts.*.historyLimit`），回退�?`messages.groupChat.historyLimit`。设�?`0` 禁用（默�?50）�?
## 输入指示�?+ 已读回执

- **输入指示�?*：OpenClaw 通过 `signal-cli sendTyping` 发送输入信号，并在回复运行时刷新它们�?- **已读回执**：当 `channels.signal.sendReadReceipts` �?true 时，RadioClaw 为允许的私信转发已读回执�?- Signal-cli 不暴露群组的已读回执�?
## 表情回应（message 工具�?
- 使用 `message action=react` 配合 `channel=signal`�?- 目标：发送�?E.164 �?UUID（使用配对输出中�?`uuid:<id>`；裸 UUID 也可以）�?- `messageId` 是你要回应的消息�?Signal 时间戳�?- 群组表情回应需�?`targetAuthor` �?`targetAuthorUuid`�?
示例�?
```
message action=react channel=signal target=uuid:123e4567-e89b-12d3-a456-426614174000 messageId=1737630212345 emoji=🔥
message action=react channel=signal target=+15551234567 messageId=1737630212345 emoji=🔥 remove=true
message action=react channel=signal target=signal:group:<groupId> targetAuthor=uuid:<sender-uuid> messageId=1737630212345 emoji=�?```

配置�?
- `channels.signal.actions.reactions`：启�?禁用表情回应操作（默�?true）�?- `channels.signal.reactionLevel`：`off | ack | minimal | extensive`�?  - `off`/`ack` 禁用智能体表情回应（message 工具 `react` 会报错）�?  - `minimal`/`extensive` 启用智能体表情回应并设置指导级别�?- 每账户覆盖：`channels.signal.accounts.<id>.actions.reactions`、`channels.signal.accounts.<id>.reactionLevel`�?
## 投递目标（CLI/cron�?
- 私信：`signal:+15551234567`（或�?E.164）�?- UUID 私信：`uuid:<id>`（或�?UUID）�?- 群组：`signal:group:<groupId>`�?- 用户名：`username:<name>`（如果你�?Signal 账户支持）�?
## 配置参考（Signal�?
完整配置：[配置](/gateway/configuration)

提供商选项�?
- `channels.signal.enabled`：启�?禁用渠道启动�?- `channels.signal.account`：bot 账户�?E.164�?- `channels.signal.cliPath`：`signal-cli` 的路径�?- `channels.signal.httpUrl`：完整守护进�?URL（覆�?host/port）�?- `channels.signal.httpHost`、`channels.signal.httpPort`：守护进程绑定（默认 127.0.0.1:8080）�?- `channels.signal.autoStart`：自动启动守护进程（如果未设�?`httpUrl` 则默�?true）�?- `channels.signal.startupTimeoutMs`：启动等待超时（毫秒）（上限 120000）�?- `channels.signal.receiveMode`：`on-start | manual`�?- `channels.signal.ignoreAttachments`：跳过附件下载�?- `channels.signal.ignoreStories`：忽略来自守护进程的动态�?- `channels.signal.sendReadReceipts`：转发已读回执�?- `channels.signal.dmPolicy`：`pairing | allowlist | open | disabled`（默认：pairing）�?- `channels.signal.allowFrom`：私信允许列表（E.164 �?`uuid:<id>`）。`open` 需�?`"*"`。Signal 没有用户名；使用电话/UUID id�?- `channels.signal.groupPolicy`：`open | allowlist | disabled`（默认：allowlist）�?- `channels.signal.groupAllowFrom`：群组发送者允许列表�?- `channels.signal.historyLimit`：作为上下文包含的最大群组消息数�? 禁用）�?- `channels.signal.dmHistoryLimit`：私信历史限制（用户轮次）。每用户覆盖：`channels.signal.dms["<phone_or_uuid>"].historyLimit`�?- `channels.signal.textChunkLimit`：出站分块大小（字符）�?- `channels.signal.chunkMode`：`length`（默认）�?`newline` 在长度分块前按空行（段落边界）分割�?- `channels.signal.mediaMaxMb`：入�?出站媒体上限（MB）�?
相关全局选项�?
- `agents.list[].groupChat.mentionPatterns`（Signal 不支持原生提及）�?- `messages.groupChat.mentionPatterns`（全局回退）�?- `messages.responsePrefix`�?