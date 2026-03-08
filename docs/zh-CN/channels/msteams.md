---
read_when:
  - 开�?MS Teams 渠道功能
summary: Microsoft Teams 机器人支持状态、功能和配置
title: Microsoft Teams
x-i18n:
  generated_at: "2026-02-03T07:46:52Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 2046cb8fa3dd349f4b25a40c013a87188af8f75c1886a782698bff2bb9f70971
  source_path: channels/msteams.md
  workflow: 15
---

# Microsoft Teams（插件）

> "进入此地者，放弃一切希望�?

更新时间�?026-01-21

状态：支持文本 + 私信附件；频�?群组文件发送需�?`sharePointSiteId` + Graph 权限（参见[在群聊中发送文件](#sending-files-in-group-chats)）。投票通过 Adaptive Cards 发送�?
## 需要插�?
Microsoft Teams 作为插件提供，不包含在核心安装中�?
**破坏性变更（2026.1.15）：** MS Teams 已从核心移出。如果你使用它，必须安装插件�?
原因说明：保持核心安装更轻量，并�?MS Teams 依赖项可以独立更新�?
通过 CLI 安装（npm 注册表）�?
```bash
RadioClaw plugins install @RadioClaw/msteams
```

本地检出（�?git 仓库运行时）�?
```bash
RadioClaw plugins install ./extensions/msteams
```

如果你在配置/新手引导过程中选择 Teams 并检测到 git 检出，
RadioClaw 将自动提供本地安装路径�?
详情：[插件](/tools/plugin)

## 快速设置（初学者）

1. 安装 Microsoft Teams 插件�?2. 创建一�?**Azure Bot**（App ID + 客户端密�?+ 租户 ID）�?3. 使用这些凭证配置 RadioClaw�?4. 通过公共 URL 或隧道暴�?`/api/messages`（默认端�?3978）�?5. 安装 Teams 应用包并启动 Gateway 网关�?
最小配置：

```json5
{
  channels: {
    msteams: {
      enabled: true,
      appId: "<APP_ID>",
      appPassword: "<APP_PASSWORD>",
      tenantId: "<TENANT_ID>",
      webhook: { port: 3978, path: "/api/messages" },
    },
  },
}
```

注意：群聊默认被阻止（`channels.msteams.groupPolicy: "allowlist"`）。要允许群组回复，请设置 `channels.msteams.groupAllowFrom`（或使用 `groupPolicy: "open"` 允许任何成员，需要提及才能触发）�?
## 目标

- 通过 Teams 私信、群聊或频道�?RadioClaw 交流�?- 保持路由确定性：回复始终返回到消息到达的渠道�?- 默认使用安全的渠道行为（除非另有配置，否则需要提及）�?
## 配置写入

默认情况下，Microsoft Teams 允许通过 `/config set|unset` 触发的配置更新写入（需�?`commands.config: true`）�?
禁用方式�?
```json5
{
  channels: { msteams: { configWrites: false } },
}
```

## 访问控制（私�?+ 群组�?
**私信访问**

- 默认：`channels.msteams.dmPolicy = "pairing"`。未知发送者在获得批准之前将被忽略�?- `channels.msteams.allowFrom` 接受 AAD 对象 ID、UPN 或显示名称。当凭证允许时，向导会通过 Microsoft Graph 将名称解析为 ID�?
**群组访问**

- 默认：`channels.msteams.groupPolicy = "allowlist"`（除非添�?`groupAllowFrom`，否则被阻止）。使�?`channels.defaults.groupPolicy` 在未设置时覆盖默认值�?- `channels.msteams.groupAllowFrom` 控制哪些发送者可以在群聊/频道中触发（回退�?`channels.msteams.allowFrom`）�?- 设置 `groupPolicy: "open"` 允许任何成员（默认仍需提及才能触发）�?- �?*不允许任何频�?*，设�?`channels.msteams.groupPolicy: "disabled"`�?
示例�?
```json5
{
  channels: {
    msteams: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["user@org.com"],
    },
  },
}
```

**团队 + 频道允许列表**

- 通过�?`channels.msteams.teams` 下列出团队和频道来限定群�?频道回复的范围�?- 键可以是团队 ID 或名称；频道键可以是会话 ID 或名称�?- �?`groupPolicy="allowlist"` 且存在团队允许列表时，仅接受列出的团�?频道（需要提及才能触发）�?- 配置向导接受 `Team/Channel` 条目并为你存储�?- 启动时，RadioClaw 将团�?频道和用户允许列表名称解析为 ID（当 Graph 权限允许时）
  并记录映射；未解析的条目保持原样�?
示例�?
```json5
{
  channels: {
    msteams: {
      groupPolicy: "allowlist",
      teams: {
        "My Team": {
          channels: {
            General: { requireMention: true },
          },
        },
      },
    },
  },
}
```

## 工作原理

1. 安装 Microsoft Teams 插件�?2. 创建一�?**Azure Bot**（App ID + 密钥 + 租户 ID）�?3. 构建一个引用机器人并包含以�?RSC 权限�?**Teams 应用�?*�?4. �?Teams 应用上传/安装到团队中（或用于私信的个人范围）�?5. �?`~/.RadioClaw/RadioClaw.json`（或环境变量）中配置 `msteams` 并启�?Gateway 网关�?6. Gateway 网关默认�?`/api/messages` 上监�?Bot Framework webhook 流量�?
## Azure Bot 设置（前提条件）

在配�?RadioClaw 之前，你需要创建一�?Azure Bot 资源�?
### 步骤 1：创�?Azure Bot

1. 前往[创建 Azure Bot](https://portal.azure.com/#create/Microsoft.AzureBot)
2. 填写**基本信息**选项卡：

   | 字段               | �?                                                 |
   | ------------------ | --------------------------------------------------- |
   | **Bot handle**     | 你的机器人名称，例如 `RadioClaw-msteams`（必须唯一�?|
   | **Subscription**   | 选择你的 Azure 订阅                                 |
   | **Resource group** | 新建或使用现�?                                     |
   | **Pricing tier**   | **Free** 用于开�?测试                              |
   | **Type of App**    | **Single Tenant**（推�?- 见下方说明）              |
   | **Creation type**  | **Create new Microsoft App ID**                     |

> **弃用通知�?* 2025-07-31 之后已弃用创建新的多租户机器人。新机器人请使用 **Single Tenant**�?
3. 点击 **Review + create** �?**Create**（等待约 1-2 分钟�?
### 步骤 2：获取凭�?
1. 前往你的 Azure Bot 资源 �?**Configuration**
2. 复制 **Microsoft App ID** �?这是你的 `appId`
3. 点击 **Manage Password** �?前往应用注册
4. �?**Certificates & secrets** �?**New client secret** �?复制 **Value** �?这是你的 `appPassword`
5. 前往 **Overview** �?复制 **Directory (tenant) ID** �?这是你的 `tenantId`

### 步骤 3：配置消息端�?
1. �?Azure Bot �?**Configuration**
2. �?**Messaging endpoint** 设置为你�?webhook URL�?   - 生产环境：`https://your-domain.com/api/messages`
   - 本地开发：使用隧道（见下方[本地开发](#local-development-tunneling)�?
### 步骤 4：启�?Teams 渠道

1. �?Azure Bot �?**Channels**
2. 点击 **Microsoft Teams** �?Configure �?Save
3. 接受服务条款

## 本地开发（隧道�?
Teams 无法访问 `localhost`。本地开发请使用隧道�?
**选项 A：ngrok**

```bash
ngrok http 3978
# 复制 https URL，例�?https://abc123.ngrok.io
# 将消息端点设置为：https://abc123.ngrok.io/api/messages
```

**选项 B：Tailscale Funnel**

```bash
tailscale funnel 3978
# 使用你的 Tailscale funnel URL 作为消息端点
```

## Teams 开发者门户（替代方案�?
除了手动创建清单 ZIP，你可以使用 [Teams 开发者门户](https://dev.teams.microsoft.com/apps)�?
1. 点击 **+ New app**
2. 填写基本信息（名称、描述、开发者信息）
3. 前往 **App features** �?**Bot**
4. 选择 **Enter a bot ID manually** 并粘贴你�?Azure Bot App ID
5. 勾选范围：**Personal**�?*Team**�?*Group Chat**
6. 点击 **Distribute** �?**Download app package**
7. �?Teams 中：**Apps** �?**Manage your apps** �?**Upload a custom app** �?选择 ZIP

这通常比手动编�?JSON 清单更容易�?
## 测试机器�?
**选项 A：Azure Web Chat（先验证 webhook�?*

1. �?Azure 门户 �?你的 Azure Bot 资源 �?**Test in Web Chat**
2. 发送一条消�?- 你应该看到响�?3. 这确认你�?webhook 端点�?Teams 设置之前正常工作

**选项 B：Teams（应用安装后�?*

1. 安装 Teams 应用（侧载或组织目录�?2. �?Teams 中找到机器人并发送私�?3. 检�?Gateway 网关日志中的传入活动

## 设置（最小纯文本�?
1. **安装 Microsoft Teams 插件**
   - �?npm：`RadioClaw plugins install @RadioClaw/msteams`
   - 从本地检出：`RadioClaw plugins install ./extensions/msteams`

2. **机器人注�?*
   - 创建一�?Azure Bot（见上文）并记录�?     - App ID
     - 客户端密钥（App password�?     - 租户 ID（单租户�?
3. **Teams 应用清单**
   - 包含一�?`bot` 条目，其�?`botId = <App ID>`�?   - 范围：`personal`、`team`、`groupChat`�?   - `supportsFiles: true`（个人范围文件处理所需）�?   - 添加 RSC 权限（见下文）�?   - 创建图标：`outline.png`�?2x32）和 `color.png`�?92x192）�?   - 将三个文件一起打包：`manifest.json`、`outline.png`、`color.png`�?
4. **配置 RadioClaw**

   ```json
   {
     "msteams": {
       "enabled": true,
       "appId": "<APP_ID>",
       "appPassword": "<APP_PASSWORD>",
       "tenantId": "<TENANT_ID>",
       "webhook": { "port": 3978, "path": "/api/messages" }
     }
   }
   ```

   你也可以使用环境变量代替配置键：
   - `MSTEAMS_APP_ID`
   - `MSTEAMS_APP_PASSWORD`
   - `MSTEAMS_TENANT_ID`

5. **机器人端�?*
   - �?Azure Bot Messaging Endpoint 设置为：
     - `https://<host>:3978/api/messages`（或你选择的路�?端口）�?
6. **运行 Gateway 网关**
   - 当插件已安装�?`msteams` 配置存在并有凭证时，Teams 渠道会自动启动�?
## 历史上下�?
- `channels.msteams.historyLimit` 控制将多少条最近的频道/群组消息包含到提示中�?- 回退�?`messages.groupChat.historyLimit`。设�?`0` 禁用（默�?50）�?- 私信历史可以通过 `channels.msteams.dmHistoryLimit`（用户轮次）限制。每用户覆盖：`channels.msteams.dms["<user_id>"].historyLimit`�?
## 当前 Teams RSC 权限（清单）

这些是我�?Teams 应用清单�?*现有�?resourceSpecific 权限**。它们仅适用于安装了应用的团�?聊天内部�?
**对于频道（团队范围）�?*

- `ChannelMessage.Read.Group`（Application�? 无需 @提及即可接收所有频道消�?- `ChannelMessage.Send.Group`（Application�?- `Member.Read.Group`（Application�?- `Owner.Read.Group`（Application�?- `ChannelSettings.Read.Group`（Application�?- `TeamMember.Read.Group`（Application�?- `TeamSettings.Read.Group`（Application�?
**对于群聊�?*

- `ChatMessage.Read.Chat`（Application�? 无需 @提及即可接收所有群聊消�?
## Teams 清单示例（已脱敏�?
包含必需字段的最小有效示例。请替换 ID �?URL�?
```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
  "manifestVersion": "1.23",
  "version": "1.0.0",
  "id": "00000000-0000-0000-0000-000000000000",
  "name": { "short": "RadioClaw" },
  "developer": {
    "name": "Your Org",
    "websiteUrl": "https://example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsOfUseUrl": "https://example.com/terms"
  },
  "description": { "short": "RadioClaw in Teams", "full": "RadioClaw in Teams" },
  "icons": { "outline": "outline.png", "color": "color.png" },
  "accentColor": "#5B6DEF",
  "bots": [
    {
      "botId": "11111111-1111-1111-1111-111111111111",
      "scopes": ["personal", "team", "groupChat"],
      "isNotificationOnly": false,
      "supportsCalling": false,
      "supportsVideo": false,
      "supportsFiles": true
    }
  ],
  "webApplicationInfo": {
    "id": "11111111-1111-1111-1111-111111111111"
  },
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        { "name": "ChannelMessage.Read.Group", "type": "Application" },
        { "name": "ChannelMessage.Send.Group", "type": "Application" },
        { "name": "Member.Read.Group", "type": "Application" },
        { "name": "Owner.Read.Group", "type": "Application" },
        { "name": "ChannelSettings.Read.Group", "type": "Application" },
        { "name": "TeamMember.Read.Group", "type": "Application" },
        { "name": "TeamSettings.Read.Group", "type": "Application" },
        { "name": "ChatMessage.Read.Chat", "type": "Application" }
      ]
    }
  }
}
```

### 清单注意事项（必填字段）

- `bots[].botId` **必须**�?Azure Bot App ID 匹配�?- `webApplicationInfo.id` **必须**�?Azure Bot App ID 匹配�?- `bots[].scopes` 必须包含你计划使用的界面（`personal`、`team`、`groupChat`）�?- `bots[].supportsFiles: true` 是个人范围文件处理所需的�?- `authorization.permissions.resourceSpecific` 如果你需要频道流量，必须包含频道读取/发送权限�?
### 更新现有应用

要更新已安装�?Teams 应用（例如，添加 RSC 权限）：

1. 使用新设置更新你�?`manifest.json`
2. **增加 `version` 字段**（例如，`1.0.0` �?`1.1.0`�?3. **重新打包**清单和图标（`manifest.json`、`outline.png`、`color.png`�?4. 上传新的 zip�?   - **选项 A（Teams 管理中心）：** Teams 管理中心 �?Teams apps �?Manage apps �?找到你的应用 �?Upload new version
   - **选项 B（侧载）�?* �?Teams �?�?Apps �?Manage your apps �?Upload a custom app
5. **对于团队频道�?* 在每个团队中重新安装应用以使新权限生�?6. **完全退出并重新启动 Teams**（不仅仅是关闭窗口）以清除缓存的应用元数�?
## 功能：仅 RSC �?Graph

### 仅使�?**Teams RSC**（应用已安装，无 Graph API 权限�?
可用�?
- 读取频道消息**文本**内容�?- 发送频道消�?*文本**内容�?- 接收**个人（私信）**文件附件�?
不可用：

- 频道/群组**图片或文件内�?*（负载仅包含 HTML 存根）�?- 下载存储�?SharePoint/OneDrive 中的附件�?- 读取消息历史（超出实�?webhook 事件）�?
### 使用 **Teams RSC + Microsoft Graph Application 权限**

增加�?
- 下载托管内容（粘贴到消息中的图片）�?- 下载存储�?SharePoint/OneDrive 中的文件附件�?- 通过 Graph 读取频道/聊天消息历史�?
### RSC �?Graph API 对比

| 功能           | RSC 权限           | Graph API                 |
| -------------- | ------------------ | ------------------------- |
| **实时消息**   | 是（通过 webhook�?| 否（仅轮询）              |
| **历史消息**   | �?                | 是（可查询历史）          |
| **设置复杂�?* | 仅应用清�?        | 需要管理员同意 + 令牌流程 |
| **离线工作**   | 否（必须运行�?    | 是（随时查询�?           |

**结论�?* RSC 用于实时监听；Graph API 用于历史访问。要在离线时补上错过的消息，你需要带�?`ChannelMessage.Read.All` �?Graph API（需要管理员同意）�?
## 启用 Graph 的媒�?+ 历史（频道所需�?
如果你需�?*频道**中的图片/文件或想要获�?*消息历史**，你必须启用 Microsoft Graph 权限并授予管理员同意�?
1. �?Entra ID（Azure AD�?*App Registration** 中，添加 Microsoft Graph **Application 权限**�?   - `ChannelMessage.Read.All`（频道附�?+ 历史�?   - `Chat.Read.All` �?`ChatMessage.Read.All`（群聊）
2. 为租�?*授予管理员同�?*�?3. 提升 Teams 应用**清单版本**，重新上传，�?*�?Teams 中重新安装应�?*�?4. **完全退出并重新启动 Teams** 以清除缓存的应用元数据�?
## 已知限制

### Webhook 超时

Teams 通过 HTTP webhook 传递消息。如果处理时间过长（例如，LLM 响应缓慢），你可能会看到�?
- Gateway 网关超时
- Teams 重试消息（导致重复）
- 丢失的回�?
RadioClaw 通过快速返回并主动发送回复来处理这个问题，但非常慢的响应仍可能导致问题�?
### 格式�?
Teams markdown �?Slack �?Discord 更有限：

- 基本格式化有效：**粗体**、_斜体_、`代码`、链�?- 复杂�?markdown（表格、嵌套列表）可能无法正确渲染
- 支持 Adaptive Cards 用于投票和任意卡片发送（见下文）

## 配置

关键设置（共享渠道模式见 `/gateway/configuration`）：

- `channels.msteams.enabled`：启�?禁用渠道�?- `channels.msteams.appId`、`channels.msteams.appPassword`、`channels.msteams.tenantId`：机器人凭证�?- `channels.msteams.webhook.port`（默�?`3978`�?- `channels.msteams.webhook.path`（默�?`/api/messages`�?- `channels.msteams.dmPolicy`：`pairing | allowlist | open | disabled`（默认：pairing�?- `channels.msteams.allowFrom`：私信允许列表（AAD 对象 ID、UPN 或显示名称）。当 Graph 访问可用时，向导在设置期间将名称解析�?ID�?- `channels.msteams.textChunkLimit`：出站文本分块大小�?- `channels.msteams.chunkMode`：`length`（默认）�?`newline` 在长度分块之前按空行（段落边界）分割�?- `channels.msteams.mediaAllowHosts`：入站附件主机允许列表（默认�?Microsoft/Teams 域名）�?- `channels.msteams.mediaAuthAllowHosts`：在媒体重试时附�?Authorization 头的允许列表（默认为 Graph + Bot Framework 主机）�?- `channels.msteams.requireMention`：在频道/群组中需�?@提及（默�?true）�?- `channels.msteams.replyStyle`：`thread | top-level`（见[回复样式](#reply-style-threads-vs-posts)）�?- `channels.msteams.teams.<teamId>.replyStyle`：每团队覆盖�?- `channels.msteams.teams.<teamId>.requireMention`：每团队覆盖�?- `channels.msteams.teams.<teamId>.tools`：当缺少频道覆盖时使用的默认每团队工具策略覆盖（`allow`/`deny`/`alsoAllow`）�?- `channels.msteams.teams.<teamId>.toolsBySender`：默认每团队每发送者工具策略覆盖（支持 `"*"` 通配符）�?- `channels.msteams.teams.<teamId>.channels.<conversationId>.replyStyle`：每频道覆盖�?- `channels.msteams.teams.<teamId>.channels.<conversationId>.requireMention`：每频道覆盖�?- `channels.msteams.teams.<teamId>.channels.<conversationId>.tools`：每频道工具策略覆盖（`allow`/`deny`/`alsoAllow`）�?- `channels.msteams.teams.<teamId>.channels.<conversationId>.toolsBySender`：每频道每发送者工具策略覆盖（支持 `"*"` 通配符）�?- `channels.msteams.sharePointSiteId`：用于群�?频道文件上传�?SharePoint 站点 ID（见[在群聊中发送文件](#sending-files-in-group-chats)）�?
## 路由和会�?
- 会话键遵循标准智能体格式（见 [/concepts/session](/concepts/session)）：
  - 私信共享主会话（`agent:<agentId>:<mainKey>`）�?  - 频道/群组消息使用会话 ID�?    - `agent:<agentId>:msteams:channel:<conversationId>`
    - `agent:<agentId>:msteams:group:<conversationId>`

## 回复样式：话�?vs 帖子

Teams 最近在相同的底层数据模型上引入了两种频�?UI 样式�?
| 样式                    | 描述                           | 推荐�?`replyStyle` |
| ----------------------- | ------------------------------ | ------------------- |
| **Posts**（经典）       | 消息显示为卡片，下方有话题回�?| `thread`（默认）    |
| **Threads**（类 Slack�?| 消息线性流动，更像 Slack       | `top-level`         |

**问题�?* Teams API 不暴露频道使用的 UI 样式。如果你使用错误�?`replyStyle`�?
- �?Threads 样式频道中使�?`thread` �?回复嵌套显示很别�?- �?Posts 样式频道中使�?`top-level` �?回复显示为单独的顶级帖子而不是在话题�?
**解决方案�?* 根据频道的设置方式为每个频道配置 `replyStyle`�?
```json
{
  "msteams": {
    "replyStyle": "thread",
    "teams": {
      "19:abc...@thread.tacv2": {
        "channels": {
          "19:xyz...@thread.tacv2": {
            "replyStyle": "top-level"
          }
        }
      }
    }
  }
}
```

## 附件和图�?
**当前限制�?*

- **私信�?* 图片和文件附件通过 Teams bot file API 工作�?- **频道/群组�?* 附件存储�?M365 存储（SharePoint/OneDrive）中。webhook 负载仅包�?HTML 存根，而非实际文件字节�?*需�?Graph API 权限**才能下载频道附件�?
没有 Graph 权限，带图片的频道消息将作为纯文本接收（机器人无法访问图片内容）�?默认情况下，RadioClaw 仅从 Microsoft/Teams 主机名下载媒体。使�?`channels.msteams.mediaAllowHosts` 覆盖（使�?`["*"]` 允许任何主机）�?Authorization 头仅附加�?`channels.msteams.mediaAuthAllowHosts` 中的主机（默认为 Graph + Bot Framework 主机）。保持此列表严格（避免多租户后缀）�?
## 在群聊中发送文�?
机器人可以使�?FileConsentCard 流程在私信中发送文件（内置）。但是，**在群�?频道中发送文�?*需要额外设置：

| 上下�?                | 文件发送方�?                           | 所需设置                             |
| ---------------------- | --------------------------------------- | ------------------------------------ |
| **私信**               | FileConsentCard �?用户接受 �?机器人上�?| 开箱即�?                            |
| **群聊/频道**          | 上传�?SharePoint �?共享链接            | 需�?`sharePointSiteId` + Graph 权限 |
| **图片（任何上下文�?* | Base64 编码内联                         | 开箱即�?                            |

### 为什么群聊需�?SharePoint

机器人没有个�?OneDrive 驱动器（`/me/drive` Graph API 端点对应用程序身份不起作用）。要在群�?频道中发送文件，机器人上传到 **SharePoint 站点**并创建共享链接�?
### 设置

1. **�?Entra ID（Azure AD）→ App Registration 中添�?Graph API 权限**�?   - `Sites.ReadWrite.All`（Application�? 上传文件�?SharePoint
   - `Chat.Read.All`（Application�? 可选，启用每用户共享链�?
2. 为租�?*授予管理员同�?*�?
3. **获取你的 SharePoint 站点 ID�?*

   ```bash
   # 通过 Graph Explorer 或带有效令牌�?curl�?   curl -H "Authorization: Bearer $TOKEN" \
     "https://graph.microsoft.com/v1.0/sites/{hostname}:/{site-path}"

   # 示例：对�?"contoso.sharepoint.com/sites/BotFiles" 的站�?   curl -H "Authorization: Bearer $TOKEN" \
     "https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/BotFiles"

   # 响应包含�?id": "contoso.sharepoint.com,guid1,guid2"
   ```

4. **配置 RadioClaw�?*
   ```json5
   {
     channels: {
       msteams: {
         // ... 其他配置 ...
         sharePointSiteId: "contoso.sharepoint.com,guid1,guid2",
       },
     },
   }
   ```

### 共享行为

| 权限                                    | 共享行为                                   |
| --------------------------------------- | ------------------------------------------ |
| �?`Sites.ReadWrite.All`                | 组织范围共享链接（组织中任何人都可以访问�?|
| `Sites.ReadWrite.All` + `Chat.Read.All` | 每用户共享链接（仅聊天成员可以访问）       |

每用户共享更安全，因为只有聊天参与者才能访问文件。如果缺�?`Chat.Read.All` 权限，机器人回退到组织范围共享�?
### 回退行为

| 场景                                    | 结果                                             |
| --------------------------------------- | ------------------------------------------------ |
| 群聊 + 文件 + 已配�?`sharePointSiteId` | 上传�?SharePoint，发送共享链�?                 |
| 群聊 + 文件 + �?`sharePointSiteId`     | 尝试 OneDrive 上传（可能失败），仅发送文�?      |
| 个人聊天 + 文件                         | FileConsentCard 流程（无需 SharePoint 即可工作�?|
| 任何上下�?+ 图片                       | Base64 编码内联（无需 SharePoint 即可工作�?     |

### 文件存储位置

上传的文件存储在配置�?SharePoint 站点默认文档库中�?`/RadioClawShared/` 文件夹中�?
## 投票（Adaptive Cards�?
RadioClaw �?Teams 投票作为 Adaptive Cards 发送（没有原生 Teams 投票 API）�?
- CLI：`RadioClaw message poll --channel msteams --target conversation:<id> ...`
- 投票�?Gateway 网关记录�?`~/.RadioClaw/msteams-polls.json` 中�?- Gateway 网关必须保持在线才能记录投票�?- 投票尚不自动发布结果摘要（如需要请检查存储文件）�?
## Adaptive Cards（任意）

使用 `message` 工具�?CLI �?Teams 用户或会话发送任�?Adaptive Card JSON�?
`card` 参数接受 Adaptive Card JSON 对象。当提供 `card` 时，消息文本是可选的�?
**智能体工具：**

```json
{
  "action": "send",
  "channel": "msteams",
  "target": "user:<id>",
  "card": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [{ "type": "TextBlock", "text": "Hello!" }]
  }
}
```

**CLI�?*

```bash
RadioClaw message send --channel msteams \
  --target "conversation:19:abc...@thread.tacv2" \
  --card '{"type":"AdaptiveCard","version":"1.5","body":[{"type":"TextBlock","text":"Hello!"}]}'
```

参见 [Adaptive Cards 文档](https://adaptivecards.io/)了解卡片模式和示例。目标格式详情见下方[目标格式](#target-formats)�?
## 目标格式

MSTeams 目标使用前缀来区分用户和会话�?
| 目标类型          | 格式                             | 示例                                              |
| ----------------- | -------------------------------- | ------------------------------------------------- |
| 用户（按 ID�?    | `user:<aad-object-id>`           | `user:40a1a0ed-4ff2-4164-a219-55518990c197`       |
| 用户（按名称�?   | `user:<display-name>`            | `user:John Smith`（需�?Graph API�?              |
| 群组/频道         | `conversation:<conversation-id>` | `conversation:19:abc123...@thread.tacv2`          |
| 群组/频道（原始） | `<conversation-id>`              | `19:abc123...@thread.tacv2`（如果包�?`@thread`�?|

**CLI 示例�?*

```bash
# �?ID 发送给用户
RadioClaw message send --channel msteams --target "user:40a1a0ed-..." --message "Hello"

# 按显示名称发送给用户（触�?Graph API 查找�?RadioClaw message send --channel msteams --target "user:John Smith" --message "Hello"

# 发送到群聊或频�?RadioClaw message send --channel msteams --target "conversation:19:abc...@thread.tacv2" --message "Hello"

# 向会话发�?Adaptive Card
RadioClaw message send --channel msteams --target "conversation:19:abc...@thread.tacv2" \
  --card '{"type":"AdaptiveCard","version":"1.5","body":[{"type":"TextBlock","text":"Hello"}]}'
```

**智能体工具示例：**

```json
{
  "action": "send",
  "channel": "msteams",
  "target": "user:John Smith",
  "message": "Hello!"
}
```

```json
{
  "action": "send",
  "channel": "msteams",
  "target": "conversation:19:abc...@thread.tacv2",
  "card": {
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [{ "type": "TextBlock", "text": "Hello" }]
  }
}
```

注意：没�?`user:` 前缀时，名称默认解析为群�?团队。按显示名称定位人员时始终使�?`user:`�?
## 主动消息

- 主动消息仅在用户交互**之后**才可能，因为我们在那时存储会话引用�?- 有关 `dmPolicy` 和允许列表控制，请参�?`/gateway/configuration`�?
## 团队和频�?ID（常见陷阱）

Teams URL 中的 `groupId` 查询参数**不是**用于配置的团�?ID。请�?URL 路径中提�?ID�?
**团队 URL�?*

```
https://teams.microsoft.com/l/team/19%3ABk4j...%40thread.tacv2/conversations?groupId=...
                                    └────────────────────────────�?                                    团队 ID（URL 解码此部分）
```

**频道 URL�?*

```
https://teams.microsoft.com/l/channel/19%3A15bc...%40thread.tacv2/ChannelName?groupId=...
                                      └─────────────────────────�?                                      频道 ID（URL 解码此部分）
```

**用于配置�?*

- 团队 ID = `/team/` 后的路径段（URL 解码，例�?`19:Bk4j...@thread.tacv2`�?- 频道 ID = `/channel/` 后的路径段（URL 解码�?- **忽略** `groupId` 查询参数

## 私有频道

机器人在私有频道中的支持有限�?
| 功能                | 标准频道 | 私有频道         |
| ------------------- | -------- | ---------------- |
| 机器人安�?         | �?      | 有限             |
| 实时消息（webhook�?| �?      | 可能不工�?      |
| RSC 权限            | �?      | 行为可能不同     |
| @提及               | �?      | 如果机器人可访问 |
| Graph API 历史      | �?      | 是（有权限）     |

**如果私有频道不工作的变通方法：**

1. 使用标准频道进行机器人交�?2. 使用私信 - 用户始终可以直接给机器人发消�?3. 使用 Graph API 进行历史访问（需�?`ChannelMessage.Read.All`�?
## 故障排除

### 常见问题

- **频道中图片不显示�?* 缺少 Graph 权限或管理员同意。重新安�?Teams 应用并完全退�?重新打开 Teams�?- **频道中无响应�?* 默认需要提及；设置 `channels.msteams.requireMention=false` 或按团队/频道配置�?- **版本不匹配（Teams 仍显示旧清单）：** 移除 + 重新添加应用并完全退�?Teams 以刷新�?- **来自 webhook �?401 Unauthorized�?* 在没�?Azure JWT 的情况下手动测试时属于预期情�?- 意味着端点可达但认证失败。使�?Azure Web Chat 正确测试�?
### 清单上传错误

- **"Icon file cannot be empty"�?* 清单引用的图标文件为 0 字节。创建有效的 PNG 图标（`outline.png` �?32x32，`color.png` �?192x192）�?- **"webApplicationInfo.Id already in use"�?* 应用仍安装在另一个团�?聊天中。先找到并卸载它，或等待 5-10 分钟让其传播�?- **上传�?Something went wrong"�?* 改为通过 https://admin.teams.microsoft.com 上传，打开浏览�?DevTools（F12）→ Network 选项卡，检查响应正文中的实际错误�?- **侧载失败�?* 尝试"Upload an app to your org's app catalog"而不�?Upload a custom app" - 这通常可以绕过侧载限制�?
### RSC 权限不工�?
1. 验证 `webApplicationInfo.id` 与你的机器人 App ID 完全匹配
2. 重新上传应用并在团队/聊天中重新安�?3. 检查你的组织管理员是否阻止�?RSC 权限
4. 确认你使用的是正确的范围：团队使�?`ChannelMessage.Read.Group`，群聊使�?`ChatMessage.Read.Chat`

## 参考资�?
- [创建 Azure Bot](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration) - Azure Bot 设置指南
- [Teams 开发者门户](https://dev.teams.microsoft.com/apps) - 创建/管理 Teams 应用
- [Teams 应用清单模式](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)
- [使用 RSC 接收频道消息](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/channel-messages-with-rsc)
- [RSC 权限参考](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent)
- [Teams 机器人文件处理](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/bots-filesv4)（频�?群组需�?Graph�?- [主动消息](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/send-proactive-messages)
