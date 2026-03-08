---
read_when:
  - 你需要一个适合初学者的日志概述
  - 你想配置日志级别或格�?  - 你正在故障排除并需要快速找到日�?summary: 日志概述：文件日志、控制台输出、CLI 跟踪和控�?UI
title: 日志
x-i18n:
  generated_at: "2026-02-03T07:50:52Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 884fcf4a906adff34d546908e22abd283cb89fe0845076cf925c72384ec3556b
  source_path: logging.md
  workflow: 15
---

# 日志

RadioClaw 在两个地方记录日志：

- **文件日志**（JSON 行）�?Gateway 网关写入�?- **控制台输�?*显示在终端和控制 UI 中�?
本页说明日志存放位置、如何读取日志以及如何配置日志级别和格式�?
## 日志存放位置

默认情况下，Gateway 网关在以下位置写入滚动日志文件：

`/tmp/RadioClaw/RadioClaw-YYYY-MM-DD.log`

日期使用 Gateway 网关主机的本地时区�?
你可以在 `~/.RadioClaw/RadioClaw.json` 中覆盖此设置�?
```json
{
  "logging": {
    "file": "/path/to/RadioClaw.log"
  }
}
```

## 如何读取日志

### CLI：实时跟踪（推荐�?
使用 CLI 通过 RPC 跟踪 Gateway 网关日志文件�?
```bash
RadioClaw logs --follow
```

输出模式�?
- **TTY 会话**：美观、彩色、结构化的日志行�?- **�?TTY 会话**：纯文本�?- `--json`：行分隔�?JSON（每行一个日志事件）�?- `--plain`：在 TTY 会话中强制纯文本�?- `--no-color`：禁�?ANSI 颜色�?
�?JSON 模式下，CLI 输出�?`type` 标签的对象：

- `meta`：流元数据（文件、游标、大小）
- `log`：解析的日志条目
- `notice`：截�?轮转提示
- `raw`：未解析的日志行

如果 Gateway 网关无法访问，CLI 会打印一个简短提示运行：

```bash
RadioClaw doctor
```

### 控制 UI（Web�?
控制 UI �?*日志**标签页使�?`logs.tail` 跟踪相同的文件�?参见 [/web/control-ui](/web/control-ui) 了解如何打开它�?
### 仅渠道日�?
要过滤渠道活动（WhatsApp/Telegram 等），使用：

```bash
RadioClaw channels logs --channel whatsapp
```

## 日志格式

### 文件日志（JSONL�?
日志文件中的每一行都是一�?JSON 对象。CLI 和控�?UI 解析这些条目以渲染结构化输出（时间、级别、子系统、消息）�?
### 控制台输�?
控制台日�?*感知 TTY**并格式化以提高可读性：

- 子系统前缀（例�?`gateway/channels/whatsapp`�?- 级别着色（info/warn/error�?- 可选的紧凑�?JSON 模式

控制台格式由 `logging.consoleStyle` 控制�?
## 配置日志

所有日志配置都�?`~/.RadioClaw/RadioClaw.json` �?`logging` 下�?
```json
{
  "logging": {
    "level": "info",
    "file": "/tmp/RadioClaw/RadioClaw-YYYY-MM-DD.log",
    "consoleLevel": "info",
    "consoleStyle": "pretty",
    "redactSensitive": "tools",
    "redactPatterns": ["sk-.*"]
  }
}
```

### 日志级别

- `logging.level`�?*文件日志**（JSONL）级别�?- `logging.consoleLevel`�?*控制�?*详细程度级别�?
`--verbose` 仅影响控制台输出；它不改变文件日志级别�?
### 控制台样�?
`logging.consoleStyle`�?
- `pretty`：人类友好、彩色、带时间戳�?- `compact`：更紧凑的输出（最适合长会话）�?- `json`：每�?JSON（用于日志处理器）�?
### 脱敏

工具摘要可以在敏感令牌输出到控制台之前对其进行脱敏：

- `logging.redactSensitive`：`off` | `tools`（默认：`tools`�?- `logging.redactPatterns`：用于覆盖默认集的正则表达式字符串列�?
脱敏仅影�?*控制台输�?*，不会改变文件日志�?
## 诊断 + OpenTelemetry

诊断是用于模型运�?*�?*消息流遥测（webhooks、队列、会话状态）的结构化、机器可读事件。它�?*�?*替代日志；它们存在是为了向指标、追踪和其他导出器提供数据�?
诊断事件在进程内发出，但导出器仅在启用诊�?+ 导出器插件时才附加�?
### OpenTelemetry �?OTLP

- **OpenTelemetry（OTel�?*：追踪、指标和日志的数据模�?+ SDK�?- **OTLP**：用于将 OTel 数据导出到收集器/后端的线路协议�?- RadioClaw 目前通过 **OTLP/HTTP（protobuf�?* 导出�?
### 导出的信�?
- **指标**：计数器 + 直方图（令牌使用、消息流、队列）�?- **追踪**：模型使�?+ webhook/消息处理�?span�?- **日志**：启�?`diagnostics.otel.logs` 时通过 OTLP 导出。日志量可能很大；请注意 `logging.level` 和导出器过滤器�?
### 诊断事件目录

模型使用�?
- `model.usage`：令牌、成本、持续时间、上下文、提供商/模型/渠道、会�?ID�?
消息流：

- `webhook.received`：每渠道�?webhook 入口�?- `webhook.processed`：webhook 已处�?+ 持续时间�?- `webhook.error`：webhook 处理程序错误�?- `message.queued`：消息入队等待处理�?- `message.processed`：结�?+ 持续时间 + 可选错误�?
队列 + 会话�?
- `queue.lane.enqueue`：命令队列通道入队 + 深度�?- `queue.lane.dequeue`：命令队列通道出队 + 等待时间�?- `session.state`：会话状态转�?+ 原因�?- `session.stuck`：会话卡住警�?+ 持续时间�?- `run.attempt`：运行重�?尝试元数据�?- `diagnostic.heartbeat`：聚合计数器（webhooks/队列/会话）�?
### 启用诊断（无导出器）

如果你希望诊断事件可用于插件或自定义接收器，使用此配置：

```json
{
  "diagnostics": {
    "enabled": true
  }
}
```

### 诊断标志（定向日志）

使用标志在不提高 `logging.level` 的情况下开启额外的定向调试日志�?标志不区分大小写，支持通配符（例如 `telegram.*` �?`*`）�?
```json
{
  "diagnostics": {
    "flags": ["telegram.http"]
  }
}
```

环境变量覆盖（一次性）�?
```
RadioClaw_DIAGNOSTICS=telegram.http,telegram.payload
```

注意�?
- 标志日志进入标准日志文件（与 `logging.file` 相同）�?- 输出仍根�?`logging.redactSensitive` 进行脱敏�?- 完整指南：[/diagnostics/flags](/diagnostics/flags)�?
### 导出�?OpenTelemetry

诊断可以通过 `diagnostics-otel` 插件（OTLP/HTTP）导出。这适用于任何接�?OTLP/HTTP �?OpenTelemetry 收集�?后端�?
```json
{
  "plugins": {
    "allow": ["diagnostics-otel"],
    "entries": {
      "diagnostics-otel": {
        "enabled": true
      }
    }
  },
  "diagnostics": {
    "enabled": true,
    "otel": {
      "enabled": true,
      "endpoint": "http://otel-collector:4318",
      "protocol": "http/protobuf",
      "serviceName": "RadioClaw-gateway",
      "traces": true,
      "metrics": true,
      "logs": true,
      "sampleRate": 0.2,
      "flushIntervalMs": 60000
    }
  }
}
```

注意�?
- 你也可以使用 `RadioClaw plugins enable diagnostics-otel` 启用插件�?- `protocol` 目前仅支�?`http/protobuf`。`grpc` 被忽略�?- 指标包括令牌使用、成本、上下文大小、运行持续时间和消息流计数器/直方图（webhooks、队列、会话状态、队列深�?等待）�?- 追踪/指标可以通过 `traces` / `metrics` 切换（默认：开启）。启用时，追踪包括模型使�?span 加上 webhook/消息处理 span�?- 当你的收集器需要认证时设置 `headers`�?- 支持的环境变量：`OTEL_EXPORTER_OTLP_ENDPOINT`、`OTEL_SERVICE_NAME`、`OTEL_EXPORTER_OTLP_PROTOCOL`�?
### 导出的指标（名称 + 类型�?
模型使用�?
- `RadioClaw.tokens`（计数器，属性：`RadioClaw.token`、`RadioClaw.channel`、`RadioClaw.provider`、`RadioClaw.model`�?- `RadioClaw.cost.usd`（计数器，属性：`RadioClaw.channel`、`RadioClaw.provider`、`RadioClaw.model`�?- `RadioClaw.run.duration_ms`（直方图，属性：`RadioClaw.channel`、`RadioClaw.provider`、`RadioClaw.model`�?- `RadioClaw.context.tokens`（直方图，属性：`RadioClaw.context`、`RadioClaw.channel`、`RadioClaw.provider`、`RadioClaw.model`�?
消息流：

- `RadioClaw.webhook.received`（计数器，属性：`RadioClaw.channel`、`RadioClaw.webhook`�?- `RadioClaw.webhook.error`（计数器，属性：`RadioClaw.channel`、`RadioClaw.webhook`�?- `RadioClaw.webhook.duration_ms`（直方图，属性：`RadioClaw.channel`、`RadioClaw.webhook`�?- `RadioClaw.message.queued`（计数器，属性：`RadioClaw.channel`、`RadioClaw.source`�?- `RadioClaw.message.processed`（计数器，属性：`RadioClaw.channel`、`RadioClaw.outcome`�?- `RadioClaw.message.duration_ms`（直方图，属性：`RadioClaw.channel`、`RadioClaw.outcome`�?
队列 + 会话�?
- `RadioClaw.queue.lane.enqueue`（计数器，属性：`RadioClaw.lane`�?- `RadioClaw.queue.lane.dequeue`（计数器，属性：`RadioClaw.lane`�?- `RadioClaw.queue.depth`（直方图，属性：`RadioClaw.lane` �?`RadioClaw.channel=heartbeat`�?- `RadioClaw.queue.wait_ms`（直方图，属性：`RadioClaw.lane`�?- `RadioClaw.session.state`（计数器，属性：`RadioClaw.state`、`RadioClaw.reason`�?- `RadioClaw.session.stuck`（计数器，属性：`RadioClaw.state`�?- `RadioClaw.session.stuck_age_ms`（直方图，属性：`RadioClaw.state`�?- `RadioClaw.run.attempt`（计数器，属性：`RadioClaw.attempt`�?
### 导出�?span（名�?+ 关键属性）

- `RadioClaw.model.usage`
  - `RadioClaw.channel`、`RadioClaw.provider`、`RadioClaw.model`
  - `RadioClaw.sessionKey`、`RadioClaw.sessionId`
  - `RadioClaw.tokens.*`（input/output/cache_read/cache_write/total�?- `RadioClaw.webhook.processed`
  - `RadioClaw.channel`、`RadioClaw.webhook`、`RadioClaw.chatId`
- `RadioClaw.webhook.error`
  - `RadioClaw.channel`、`RadioClaw.webhook`、`RadioClaw.chatId`、`RadioClaw.error`
- `RadioClaw.message.processed`
  - `RadioClaw.channel`、`RadioClaw.outcome`、`RadioClaw.chatId`、`RadioClaw.messageId`、`RadioClaw.sessionKey`、`RadioClaw.sessionId`、`RadioClaw.reason`
- `RadioClaw.session.stuck`
  - `RadioClaw.state`、`RadioClaw.ageMs`、`RadioClaw.queueDepth`、`RadioClaw.sessionKey`、`RadioClaw.sessionId`

### 采样 + 刷新

- 追踪采样：`diagnostics.otel.sampleRate`�?.0�?.0，仅�?span）�?- 指标导出间隔：`diagnostics.otel.flushIntervalMs`（最�?1000ms）�?
### 协议说明

- OTLP/HTTP 端点可以通过 `diagnostics.otel.endpoint` �?`OTEL_EXPORTER_OTLP_ENDPOINT` 设置�?- 如果端点已包�?`/v1/traces` �?`/v1/metrics`，则按原样使用�?- 如果端点已包�?`/v1/logs`，则按原样用于日志�?- `diagnostics.otel.logs` 为主日志器输出启�?OTLP 日志导出�?
### 日志导出行为

- OTLP 日志使用与写�?`logging.file` 相同的结构化记录�?- 遵守 `logging.level`（文件日志级别）。控制台脱敏**�?*适用�?OTLP 日志�?- 高流量安装应优先使用 OTLP 收集器采�?过滤�?
## 故障排除提示

- **Gateway 网关无法访问�?* 先运�?`RadioClaw doctor`�?- **日志为空�?* 检�?Gateway 网关是否正在运行并写�?`logging.file` 中的文件路径�?- **需要更多细节？** �?`logging.level` 设置�?`debug` �?`trace` 并重试�?