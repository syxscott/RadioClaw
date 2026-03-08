---
read_when:
  - 为回复启用文本转语音
  - 配置 TTS 提供商或限制
  - 使用 /tts 命令
summary: 出站回复的文本转语音（TTS�?title: 文本转语�?x-i18n:
  generated_at: "2026-02-03T10:13:55Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 070ff0cc8592f64c6c9e4ddaddc7e8fba82f0692ceded6fe833ec9ba5b61e6fb
  source_path: tts.md
  workflow: 15
---

# 文本转语音（TTS�?
RadioClaw 可以使用 ElevenLabs、OpenAI �?Edge TTS 将出站回复转换为音频。它可以在任�?RadioClaw 能发送音频的地方工作；Telegram 会显示圆形语音消息气泡�?
## 支持的服�?
- **ElevenLabs**（主要或备用提供商）
- **OpenAI**（主要或备用提供商；也用于摘要）
- **Edge TTS**（主要或备用提供商；使用 `node-edge-tts`，无 API 密钥时为默认�?
### Edge TTS 注意事项

Edge TTS 通过 `node-edge-tts` 库使�?Microsoft Edge 的在线神经网�?TTS 服务。它是托管服务（非本地），使�?Microsoft 的端点，不需�?API 密钥。`node-edge-tts` 公开了语音配置选项和输出格式，但并非所有选项都被 Edge 服务支持。citeturn2search0

由于 Edge TTS 是一个没有公�?SLA 或配额的公共 Web 服务，请将其视为尽力而为。如果你需要有保证的限制和支持，请使用 OpenAI �?ElevenLabs。Microsoft 的语�?REST API 记录了每个请�?10 分钟的音频限制；Edge TTS 没有公布限制，所以假设类似或更低的限制。citeturn0search3

## 可选密�?
如果你想使用 OpenAI �?ElevenLabs�?
- `ELEVENLABS_API_KEY`（或 `XI_API_KEY`�?- `OPENAI_API_KEY`

Edge TTS **�?*需�?API 密钥。如果没有找�?API 密钥，OpenClaw 默认使用 Edge TTS（除非通过 `messages.tts.edge.enabled=false` 禁用）�?
如果配置了多个提供商，首先使用选定的提供商，其他作为备用选项。自动摘要使用配置的 `summaryModel`（或 `agents.defaults.model.primary`），所以如果你启用摘要，该提供商也必须经过认证�?
## 服务链接

- [OpenAI 文本转语音指南](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI 音频 API 参考](https://platform.openai.com/docs/api-reference/audio)
- [ElevenLabs 文本转语音](https://elevenlabs.io/docs/api-reference/text-to-speech)
- [ElevenLabs 认证](https://elevenlabs.io/docs/api-reference/authentication)
- [node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)
- [Microsoft 语音输出格式](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)

## 默认启用吗？

不是。自�?TTS 默认**关闭**。在配置中使�?`messages.tts.auto` 或在每个会话中使�?`/tts always`（别名：`/tts on`）启用它�?
一�?TTS 开启，Edge TTS **�?*默认启用的，并在没有 OpenAI �?ElevenLabs API 密钥时自动使用�?
## 配置

TTS 配置位于 `RadioClaw.json` 中的 `messages.tts` 下。完�?schema �?[Gateway 网关配置](/gateway/configuration)中�?
### 最小配置（启用 + 提供商）

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "elevenlabs",
    },
  },
}
```

### OpenAI 主要，ElevenLabs 备用

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "openai",
      summaryModel: "openai/gpt-4.1-mini",
      modelOverrides: {
        enabled: true,
      },
      openai: {
        apiKey: "openai_api_key",
        model: "gpt-4o-mini-tts",
        voice: "alloy",
      },
      elevenlabs: {
        apiKey: "elevenlabs_api_key",
        baseUrl: "https://api.elevenlabs.io",
        voiceId: "voice_id",
        modelId: "eleven_multilingual_v2",
        seed: 42,
        applyTextNormalization: "auto",
        languageCode: "en",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.0,
          useSpeakerBoost: true,
          speed: 1.0,
        },
      },
    },
  },
}
```

### Edge TTS 主要（无 API 密钥�?
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "edge",
      edge: {
        enabled: true,
        voice: "en-US-MichelleNeural",
        lang: "en-US",
        outputFormat: "audio-24khz-48kbitrate-mono-mp3",
        rate: "+10%",
        pitch: "-5%",
      },
    },
  },
}
```

### 禁用 Edge TTS

```json5
{
  messages: {
    tts: {
      edge: {
        enabled: false,
      },
    },
  },
}
```

### 自定义限�?+ 偏好路径

```json5
{
  messages: {
    tts: {
      auto: "always",
      maxTextLength: 4000,
      timeoutMs: 30000,
      prefsPath: "~/.RadioClaw/settings/tts.json",
    },
  },
}
```

### 仅在收到语音消息后用音频回复

```json5
{
  messages: {
    tts: {
      auto: "inbound",
    },
  },
}
```

### 禁用长回复的自动摘要

```json5
{
  messages: {
    tts: {
      auto: "always",
    },
  },
}
```

然后运行�?
```
/tts summary off
```

### 字段说明

- `auto`：自�?TTS 模式（`off`、`always`、`inbound`、`tagged`）�?  - `inbound` 仅在收到语音消息后发送音频�?  - `tagged` 仅在回复包含 `[[tts]]` 标签时发送音频�?- `enabled`：旧版开关（doctor 将其迁移�?`auto`）�?- `mode`：`"final"`（默认）�?`"all"`（包括工�?分块回复）�?- `provider`：`"elevenlabs"`、`"openai"` �?`"edge"`（自动备用）�?- 如果 `provider` **未设�?*，OpenClaw 优先选择 `openai`（如果有密钥），然后�?`elevenlabs`（如果有密钥），否则�?`edge`�?- `summaryModel`：用于自动摘要的可选廉价模型；默认�?`agents.defaults.model.primary`�?  - 接受 `provider/model` 或配置的模型别名�?- `modelOverrides`：允许模型发�?TTS 指令（默认开启）�?- `maxTextLength`：TTS 输入的硬性上限（字符）。超出时 `/tts audio` 会失败�?- `timeoutMs`：请求超时（毫秒）�?- `prefsPath`：覆盖本地偏�?JSON 路径（提供商/限制/摘要）�?- `apiKey` 值回退到环境变量（`ELEVENLABS_API_KEY`/`XI_API_KEY`、`OPENAI_API_KEY`）�?- `elevenlabs.baseUrl`：覆�?ElevenLabs API 基础 URL�?- `elevenlabs.voiceSettings`�?  - `stability`、`similarityBoost`、`style`：`0..1`
  - `useSpeakerBoost`：`true|false`
  - `speed`：`0.5..2.0`�?.0 = 正常�?- `elevenlabs.applyTextNormalization`：`auto|on|off`
- `elevenlabs.languageCode`�? 字母 ISO 639-1（例�?`en`、`de`�?- `elevenlabs.seed`：整�?`0..4294967295`（尽力确定性）
- `edge.enabled`：允�?Edge TTS 使用（默�?`true`；无 API 密钥）�?- `edge.voice`：Edge 神经网络语音名称（例�?`en-US-MichelleNeural`）�?- `edge.lang`：语言代码（例�?`en-US`）�?- `edge.outputFormat`：Edge 输出格式（例�?`audio-24khz-48kbitrate-mono-mp3`）�?  - 有效值参�?Microsoft 语音输出格式；并非所有格式都�?Edge 支持�?- `edge.rate` / `edge.pitch` / `edge.volume`：百分比字符串（例如 `+10%`、`-5%`）�?- `edge.saveSubtitles`：在音频文件旁边写入 JSON 字幕�?- `edge.proxy`：Edge TTS 请求的代�?URL�?- `edge.timeoutMs`：请求超时覆盖（毫秒）�?
## 模型驱动覆盖（默认开启）

默认情况下，模型**可以**为单个回复发�?TTS 指令。当 `messages.tts.auto` �?`tagged` 时，需要这些指令来触发音频�?
启用后，模型可以发出 `[[tts:...]]` 指令来覆盖单个回复的语音，加上可选的 `[[tts:text]]...[[/tts:text]]` 块来提供表达性标签（笑声、唱歌提示等），这些仅应出现在音频中�?
示例回复负载�?
```
Here you go.

[[tts:provider=elevenlabs voiceId=pMsXgVXv3BLzUgSXRplE model=eleven_v3 speed=1.1]]
[[tts:text]](laughs) Read the song once more.[[/tts:text]]
```

可用指令键（启用时）�?
- `provider`（`openai` | `elevenlabs` | `edge`�?- `voice`（OpenAI 语音）或 `voiceId`（ElevenLabs�?- `model`（OpenAI TTS 模型�?ElevenLabs 模型 ID�?- `stability`、`similarityBoost`、`style`、`speed`、`useSpeakerBoost`
- `applyTextNormalization`（`auto|on|off`�?- `languageCode`（ISO 639-1�?- `seed`

禁用所有模型覆盖：

```json5
{
  messages: {
    tts: {
      modelOverrides: {
        enabled: false,
      },
    },
  },
}
```

可选白名单（禁用特定覆盖同时保持标签启用）�?
```json5
{
  messages: {
    tts: {
      modelOverrides: {
        enabled: true,
        allowProvider: false,
        allowSeed: false,
      },
    },
  },
}
```

## 单用户偏�?
斜杠命令将本地覆盖写�?`prefsPath`（默认：`~/.RadioClaw/settings/tts.json`，可通过 `RadioClaw_TTS_PREFS` �?`messages.tts.prefsPath` 覆盖）�?
存储的字段：

- `enabled`
- `provider`
- `maxLength`（摘要阈值；默认 1500 字符�?- `summarize`（默�?`true`�?
这些为该主机覆盖 `messages.tts.*`�?
## 输出格式（固定）

- **Telegram**：Opus 语音消息（ElevenLabs �?`opus_48000_64`，OpenAI �?`opus`）�?  - 48kHz / 64kbps 是语音消息的良好权衡，圆形气泡所必需�?- **其他渠道**：MP3（ElevenLabs �?`mp3_44100_128`，OpenAI �?`mp3`）�?  - 44.1kHz / 128kbps 是语音清晰度的默认平衡�?- **Edge TTS**：使�?`edge.outputFormat`（默�?`audio-24khz-48kbitrate-mono-mp3`）�?  - `node-edge-tts` 接受 `outputFormat`，但并非所有格式都可从 Edge 服务获得。citeturn2search0
  - 输出格式值遵�?Microsoft 语音输出格式（包�?Ogg/WebM Opus）。citeturn1search0
  - Telegram `sendVoice` 接受 OGG/MP3/M4A；如果你需要有保证�?Opus 语音消息，请使用 OpenAI/ElevenLabs。citeturn1search1
  - 如果配置�?Edge 输出格式失败，OpenClaw 会使�?MP3 重试�?
OpenAI/ElevenLabs 格式是固定的；Telegram 期望 Opus 以获得语音消息用户体验�?
## 自动 TTS 行为

启用后，RadioClaw�?
- 如果回复已包含媒体或 `MEDIA:` 指令，则跳过 TTS�?- 跳过非常短的回复�? 10 字符）�?- 启用时使�?`agents.defaults.model.primary`（或 `summaryModel`）对长回复进行摘要�?- 将生成的音频附加到回复中�?
如果回复超过 `maxLength` 且摘要关闭（或没有摘要模型的 API 密钥），则跳过音频并发送正常的文本回复�?
## 流程�?
```
回复 -> TTS 启用�?  �? -> 发送文�?  �? -> 有媒�?/ MEDIA: / 太短�?          �?-> 发送文�?          �?-> 长度 > 限制�?                   �? -> TTS -> 附加音频
                   �? -> 摘要启用�?                            �? -> 发送文�?                            �? -> 摘要（summaryModel �?agents.defaults.model.primary�?                                      -> TTS -> 附加音频
```

## 斜杠命令用法

只有一个命令：`/tts`。参见[斜杠命令](/tools/slash-commands)了解启用详情�?
Discord 注意：`/tts` �?Discord 的内置命令，所�?RadioClaw 在那里注�?`/voice` 作为原生命令。文�?`/tts ...` 仍然有效�?
```
/tts off
/tts always
/tts inbound
/tts tagged
/tts status
/tts provider openai
/tts limit 2000
/tts summary off
/tts audio Hello from RadioClaw
```

注意事项�?
- 命令需要授权发送者（白名�?所有者规则仍然适用）�?- 必须启用 `commands.text` 或原生命令注册�?- `off|always|inbound|tagged` 是单会话开关（`/tts on` �?`/tts always` 的别名）�?- `limit` �?`summary` 存储在本地偏好中，不在主配置中�?- `/tts audio` 生成一次性音频回复（不会开�?TTS）�?
## 智能体工�?
`tts` 工具将文本转换为语音并返�?`MEDIA:` 路径。当结果�?Telegram 兼容时，工具包含 `[[audio_as_voice]]`，以�?Telegram 发送语音气泡�?
## Gateway 网关 RPC

Gateway 网关方法�?
- `tts.status`
- `tts.enable`
- `tts.disable`
- `tts.convert`
- `tts.setProvider`
- `tts.providers`
