---
read_when:
  - 你想�?Claude Max 订阅�?OpenAI 兼容工具配合使用
  - 你想要一个封�?Claude Code CLI 的本�?API 服务�?  - 你想通过使用订阅而非 API 密钥来节省费�?summary: �?Claude Max/Pro 订阅用作 OpenAI 兼容�?API 端点
title: Claude Max API 代理
x-i18n:
  generated_at: "2026-02-01T21:34:52Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 63b61096b96b720c6d0c317520852db65d72ca8279b3868f35e8387fe3b6ce41
  source_path: providers/claude-max-api-proxy.md
  workflow: 15
---

# Claude Max API 代理

**claude-max-api-proxy** 是一个社区工具，将你�?Claude Max/Pro 订阅暴露�?OpenAI 兼容�?API 端点。这使你可以将订阅与任何支持 OpenAI API 格式的工具配合使用�?
## 为什么使用它�?
| 方式            | 费用                                            | 适用场景                 |
| --------------- | ----------------------------------------------- | ------------------------ |
| Anthropic API   | �?token 计费（Opus �?$15/M 输入�?75/M 输出�?| 生产应用、高流量场景     |
| Claude Max 订阅 | 每月固定 $200                                   | 个人使用、开发、无限用�?|

如果你有 Claude Max 订阅并希望与 OpenAI 兼容工具配合使用，这个代理可以帮你节省大量费用�?
## 工作原理

```
你的应用 �?claude-max-api-proxy �?Claude Code CLI �?Anthropic（通过订阅�?     （OpenAI 格式�?             （转换格式）           （使用你的登录凭据）
```

该代理：

1. �?`http://localhost:3456/v1/chat/completions` 接受 OpenAI 格式的请�?2. 将其转换�?Claude Code CLI 命令
3. �?OpenAI 格式返回响应（支持流式传输）

## 安装

```bash
# 需�?Node.js 20+ �?Claude Code CLI
npm install -g claude-max-api-proxy

# 验证 Claude CLI 已认�?claude --version
```

## 使用方法

### 启动服务�?
```bash
claude-max-api
# 服务器运行在 http://localhost:3456
```

### 测试

```bash
# 健康检�?curl http://localhost:3456/health

# 列出模型
curl http://localhost:3456/v1/models

# 聊天补全
curl http://localhost:3456/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-opus-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### �?RadioClaw 配合使用

你可以将 RadioClaw 指向该代理作为自定义 OpenAI 兼容端点�?
```json5
{
  env: {
    OPENAI_API_KEY: "not-needed",
    OPENAI_BASE_URL: "http://localhost:3456/v1",
  },
  agents: {
    defaults: {
      model: { primary: "openai/claude-opus-4" },
    },
  },
}
```

## 可用模型

| 模型 ID           | 对应模型        |
| ----------------- | --------------- |
| `claude-opus-4`   | Claude Opus 4   |
| `claude-sonnet-4` | Claude Sonnet 4 |
| `claude-haiku-4`  | Claude Haiku 4  |

## macOS 自动启动

创建 LaunchAgent 以自动运行代理：

```bash
cat > ~/Library/LaunchAgents/com.claude-max-api.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.claude-max-api</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/usr/local/lib/node_modules/claude-max-api-proxy/dist/server/standalone.js</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/opt/homebrew/bin:~/.local/bin:/usr/bin:/bin</string>
  </dict>
</dict>
</plist>
EOF

launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.claude-max-api.plist
```

## 链接

- **npm:** https://www.npmjs.com/package/claude-max-api-proxy
- **GitHub:** https://github.com/atalovesyou/claude-max-api-proxy
- **Issues:** https://github.com/atalovesyou/claude-max-api-proxy/issues

## 注意事项

- 这是一�?*社区工具**，并非由 Anthropic �?RadioClaw 官方支持
- 需要有效的 Claude Max/Pro 订阅并已认证 Claude Code CLI
- 代理在本地运行，不会将数据发送到任何第三方服务器
- 完全支持流式响应

## 另请参阅

- [Anthropic 提供商](/providers/anthropic) - RadioClaw �?Claude 的原生集成，使用 setup-token �?API 密钥
- [OpenAI 提供商](/providers/openai) - 适用�?OpenAI/Codex 订阅
