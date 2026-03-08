---
read_when:
  - 设置 BlueBubbles 渠道
  - 排查 webhook 配对问题
  - �?macOS 上配�?iMessage
summary: 通过 BlueBubbles macOS 服务器使�?iMessage（REST 发�?接收、输入状态、回应、配对、高级操作）�?title: BlueBubbles
x-i18n:
  generated_at: "2026-02-03T10:04:52Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 3aae277a8bec479800a7f6268bfbca912c65a4aadc6e513694057fb873597b69
  source_path: channels/bluebubbles.md
  workflow: 15
---

# BlueBubbles（macOS REST�?
状态：内置插件，通过 HTTP �?BlueBubbles macOS 服务器通信。由于其更丰富的 API 和更简便的设置�?*推荐用于 iMessage 集成**，优于旧�?imsg 渠道�?
## 概述

- 通过 BlueBubbles 辅助应用�?macOS 上运行（[bluebubbles.app](https://bluebubbles.app)）�?- 推荐/已测试版本：macOS Sequoia (15)。macOS Tahoe (26) 可用；但�?Tahoe 上编辑功能目前不可用，群组图标更新可能显示成功但实际未同步�?- RadioClaw 通过�?REST API 与之通信（`GET /api/v1/ping`、`POST /message/text`、`POST /chat/:id/*`）�?- 传入消息通过 webhook 到达；发出的回复、输入指示器、已读回执和 tapback 均为 REST 调用�?- 附件和贴纸作为入站媒体被接收（并在可能时呈现给智能体）�?- 配对/白名单的工作方式与其他渠道相同（`/channels/pairing` 等），使�?`channels.bluebubbles.allowFrom` + 配对码�?- 回应作为系统事件呈现，与 Slack/Telegram 类似，智能体可以在回复前"提及"它们�?- 高级功能：编辑、撤回、回复线程、消息效果、群组管理�?
## 快速开�?
1. 在你�?Mac 上安�?BlueBubbles 服务器（按照 [bluebubbles.app/install](https://bluebubbles.app/install) 的说明操作）�?2. �?BlueBubbles 配置中，启用 web API 并设置密码�?3. 运行 `RadioClaw onboard` 并选择 BlueBubbles，或手动配置�?   ```json5
   {
     channels: {
       bluebubbles: {
         enabled: true,
         serverUrl: "http://192.168.1.100:1234",
         password: "example-password",
         webhookPath: "/bluebubbles-webhook",
       },
     },
   }
   ```
4. �?BlueBubbles webhook 指向你的 Gateway 网关（示例：`https://your-gateway-host:3000/bluebubbles-webhook?password=<password>`）�?5. 启动 Gateway 网关；它将注�?webhook 处理程序并开始配对�?
## 新手引导

BlueBubbles 可在交互式设置向导中使用�?
```
RadioClaw onboard
```

向导会提示输入：

- **服务�?URL**（必填）：BlueBubbles 服务器地址（例�?`http://192.168.1.100:1234`�?- **密码**（必填）：来�?BlueBubbles 服务器设置的 API 密码
- **Webhook 路径**（可选）：默认为 `/bluebubbles-webhook`
- **私信策略**：配对、白名单、开放或禁用
- **白名�?*：电话号码、电子邮件或聊天目标

你也可以通过 CLI 添加 BlueBubbles�?
```
RadioClaw channels add bluebubbles --http-url http://192.168.1.100:1234 --password <password>
```

## 访问控制（私�?+ 群组�?
私信�?
- 默认：`channels.bluebubbles.dmPolicy = "pairing"`�?- 未知发送者会收到配对码；在批准之前消息会被忽略（配对�?1 小时后过期）�?- 批准方式�?  - `RadioClaw pairing list bluebubbles`
  - `RadioClaw pairing approve bluebubbles <CODE>`
- 配对是默认的令牌交换方式。详情：[配对](/channels/pairing)

群组�?
- `channels.bluebubbles.groupPolicy = open | allowlist | disabled`（默认：`allowlist`）�?- 当设置为 `allowlist` 时，`channels.bluebubbles.groupAllowFrom` 控制谁可以在群组中触发�?
### 提及门控（群组）

BlueBubbles 支持群聊的提及门控，�?iMessage/WhatsApp 行为一致：

- 使用 `agents.list[].groupChat.mentionPatterns`（或 `messages.groupChat.mentionPatterns`）检测提及�?- 当群组启�?`requireMention` 时，智能体仅在被提及时响应�?- 来自授权发送者的控制命令会绕过提及门控�?
单群组配置：

```json5
{
  channels: {
    bluebubbles: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15555550123"],
      groups: {
        "*": { requireMention: true }, // 所有群组的默认设置
        "iMessage;-;chat123": { requireMention: false }, // 特定群组的覆盖设�?      },
    },
  },
}
```

### 命令门控

- 控制命令（例�?`/config`、`/model`）需要授权�?- 使用 `allowFrom` �?`groupAllowFrom` 确定命令授权�?- 授权发送者即使在群组中未被提及也可以运行控制命令�?
## 输入状�?+ 已读回执

- **输入指示�?*：在响应生成前和生成期间自动发送�?- **已读回执**：由 `channels.bluebubbles.sendReadReceipts` 控制（默认：`true`）�?- **输入指示�?*：OpenClaw 发送输入开始事件；BlueBubbles 在发送或超时时自动清除输入状态（通过 DELETE 手动停止不可靠）�?
```json5
{
  channels: {
    bluebubbles: {
      sendReadReceipts: false, // 禁用已读回执
    },
  },
}
```

## 高级操作

BlueBubbles 在配置中启用时支持高级消息操作：

```json5
{
  channels: {
    bluebubbles: {
      actions: {
        reactions: true, // tapback（默认：true�?        edit: true, // 编辑已发送消息（macOS 13+，在 macOS 26 Tahoe 上不可用�?        unsend: true, // 撤回消息（macOS 13+�?        reply: true, // 通过消息 GUID 进行回复线程
        sendWithEffect: true, // 消息效果（slam、loud 等）
        renameGroup: true, // 重命名群�?        setGroupIcon: true, // 设置群聊图标/照片（在 macOS 26 Tahoe 上不稳定�?        addParticipant: true, // 将参与者添加到群组
        removeParticipant: true, // 从群组移除参与�?        leaveGroup: true, // 离开群聊
        sendAttachment: true, // 发送附�?媒体
      },
    },
  },
}
```

可用操作�?
- **react**：添�?移除 tapback 回应（`messageId`、`emoji`、`remove`�?- **edit**：编辑已发送的消息（`messageId`、`text`�?- **unsend**：撤回消息（`messageId`�?- **reply**：回复特定消息（`messageId`、`text`、`to`�?- **sendWithEffect**：带 iMessage 效果发送（`text`、`to`、`effectId`�?- **renameGroup**：重命名群聊（`chatGuid`、`displayName`�?- **setGroupIcon**：设置群聊图�?照片（`chatGuid`、`media`）�?�?macOS 26 Tahoe 上不稳定（API 可能返回成功但图标未同步）�?- **addParticipant**：将某人添加到群组（`chatGuid`、`address`�?- **removeParticipant**：将某人从群组移除（`chatGuid`、`address`�?- **leaveGroup**：离开群聊（`chatGuid`�?- **sendAttachment**：发送媒�?文件（`to`、`buffer`、`filename`、`asVoice`�?  - 语音备忘录：�?`asVoice: true` �?**MP3** �?**CAF** 音频一起设置，�?iMessage 语音消息形式发送。BlueBubbles 在发送语音备忘录时会�?MP3 转换�?CAF�?
### 消息 ID（短格式 vs 完整格式�?
RadioClaw 可能会显�?�?消息 ID（例�?`1`、`2`）以节省 token�?
- `MessageSid` / `ReplyToId` 可以是短 ID�?- `MessageSidFull` / `ReplyToIdFull` 包含提供商的完整 ID�?- �?ID 存储在内存中；它们可能在重启或缓存清除后过期�?- 操作接受短或完整�?`messageId`，但如果�?ID 不再可用将会报错�?
对于持久化自动化和存储，请使用完�?ID�?
- 模板：`{{MessageSidFull}}`、`{{ReplyToIdFull}}`
- 上下文：入站负载中的 `MessageSidFull` / `ReplyToIdFull`

参见[配置](/gateway/configuration)了解模板变量�?
## 分块流式传输

控制响应是作为单条消息发送还是分块流式传输：

```json5
{
  channels: {
    bluebubbles: {
      blockStreaming: true, // 启用分块流式传输（默认关闭）
    },
  },
}
```

## 媒体 + 限制

- 入站附件会被下载并存储在媒体缓存中�?- 媒体上限通过 `channels.bluebubbles.mediaMaxMb` 设置（默认：8 MB）�?- 出站文本�?`channels.bluebubbles.textChunkLimit` 分块（默认：4000 字符）�?
## 配置参�?
完整配置：[配置](/gateway/configuration)

提供商选项�?
- `channels.bluebubbles.enabled`：启�?禁用渠道�?- `channels.bluebubbles.serverUrl`：BlueBubbles REST API 基础 URL�?- `channels.bluebubbles.password`：API 密码�?- `channels.bluebubbles.webhookPath`：Webhook 端点路径（默认：`/bluebubbles-webhook`）�?- `channels.bluebubbles.dmPolicy`：`pairing | allowlist | open | disabled`（默认：`pairing`）�?- `channels.bluebubbles.allowFrom`：私信白名单（句柄、电子邮件、E.164 号码、`chat_id:*`、`chat_guid:*`）�?- `channels.bluebubbles.groupPolicy`：`open | allowlist | disabled`（默认：`allowlist`）�?- `channels.bluebubbles.groupAllowFrom`：群组发送者白名单�?- `channels.bluebubbles.groups`：单群组配置（`requireMention` 等）�?- `channels.bluebubbles.sendReadReceipts`：发送已读回执（默认：`true`）�?- `channels.bluebubbles.blockStreaming`：启用分块流式传输（默认：`false`；流式回复必需）�?- `channels.bluebubbles.textChunkLimit`：出站分块大小（字符）（默认�?000）�?- `channels.bluebubbles.chunkMode`：`length`（默认）仅在超过 `textChunkLimit` 时分割；`newline` 在长度分块前先按空行（段落边界）分割�?- `channels.bluebubbles.mediaMaxMb`：入站媒体上限（MB）（默认�?）�?- `channels.bluebubbles.historyLimit`：上下文的最大群组消息数�? 表示禁用）�?- `channels.bluebubbles.dmHistoryLimit`：私信历史限制�?- `channels.bluebubbles.actions`：启�?禁用特定操作�?- `channels.bluebubbles.accounts`：多账户配置�?
相关全局选项�?
- `agents.list[].groupChat.mentionPatterns`（或 `messages.groupChat.mentionPatterns`）�?- `messages.responsePrefix`�?
## 地址 / 投递目�?
优先使用 `chat_guid` 以获得稳定的路由�?
- `chat_guid:iMessage;-;+15555550123`（群组推荐）
- `chat_id:123`
- `chat_identifier:...`
- 直接句柄：`+15555550123`、`user@example.com`
  - 如果直接句柄没有现有的私信聊天，RadioClaw 将通过 `POST /api/v1/chat/new` 创建一个。这需要启�?BlueBubbles Private API�?
## 安全�?
- Webhook 请求通过比较 `guid`/`password` 查询参数或头部与 `channels.bluebubbles.password` 进行身份验证。来�?`localhost` 的请求也会被接受�?- 保持 API 密码�?webhook 端点的机密性（将它们视为凭证）�?- localhost 信任意味着同主机的反向代理可能无意中绕过密码验证。如果你使用代理 Gateway 网关，请在代理处要求身份验证并配�?`gateway.trustedProxies`。参�?[Gateway 网关安全性](/gateway/security#reverse-proxy-configuration)�?- 如果�?BlueBubbles 服务器暴露在局域网之外，请启用 HTTPS + 防火墙规则�?
## 故障排除

- 如果输入/已读事件停止工作，请检�?BlueBubbles webhook 日志并验�?Gateway 网关路径是否�?`channels.bluebubbles.webhookPath` 匹配�?- 配对码在一小时后过期；使用 `RadioClaw pairing list bluebubbles` �?`RadioClaw pairing approve bluebubbles <code>`�?- 回应需�?BlueBubbles private API（`POST /api/v1/message/react`）；确保服务器版本支持它�?- 编辑/撤回需�?macOS 13+ 和兼容的 BlueBubbles 服务器版本。在 macOS 26（Tahoe）上，由�?private API 变更，编辑功能目前不可用�?- �?macOS 26（Tahoe）上群组图标更新可能不稳定：API 可能返回成功但新图标未同步�?- RadioClaw 会根�?BlueBubbles 服务器的 macOS 版本自动隐藏已知不可用的操作。如果在 macOS 26（Tahoe）上编辑仍然显示，请使用 `channels.bluebubbles.actions.edit=false` 手动禁用�?- 查看状�?健康信息：`RadioClaw status --all` �?`RadioClaw status --deep`�?
有关通用渠道工作流参考，请参阅[渠道](/channels)和[插件](/tools/plugin)指南�?