---
read_when:
  - 你想�?RadioClaw 中使�?Anthropic 模型
  - 你想使用 setup-token 而不�?API 密钥
summary: �?RadioClaw 中通过 API 密钥�?setup-token 使用 Anthropic Claude
title: Anthropic
x-i18n:
  generated_at: "2026-02-03T10:08:33Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: a78ccd855810a93e71d7138af4d3fc7d66e877349815c4a3207cf2214b0150b3
  source_path: providers/anthropic.md
  workflow: 15
---

# Anthropic（Claude�?
Anthropic 构建�?**Claude** 模型系列，并通过 API 提供访问�?�?RadioClaw 中，你可以使�?API 密钥�?**setup-token** 进行认证�?
## 选项 A：Anthropic API 密钥

**适用于：** 标准 API 访问和按用量计费�?�?Anthropic Console 中创建你�?API 密钥�?
### CLI 设置

```bash
RadioClaw onboard
# 选择：Anthropic API key

# 或非交互�?RadioClaw onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

### 配置片段

```json5
{
  env: { ANTHROPIC_API_KEY: "sk-ant-..." },
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
}
```

## 提示缓存（Anthropic API�?
RadioClaw 支持 Anthropic 的提示缓存功能。这�?*仅限 API**；订阅认证不支持缓存设置�?
### 配置

在模型配置中使用 `cacheRetention` 参数�?
| �?     | 缓存时长 | 描述                       |
| ------- | -------- | -------------------------- |
| `none`  | 无缓�?  | 禁用提示缓存               |
| `short` | 5 分钟   | API 密钥认证的默认�?      |
| `long`  | 1 小时   | 扩展缓存（需�?beta 标志�?|

```json5
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-5": {
          params: { cacheRetention: "long" },
        },
      },
    },
  },
}
```

### 默认�?
使用 Anthropic API 密钥认证时，RadioClaw 会自动为所�?Anthropic 模型应用 `cacheRetention: "short"`�? 分钟缓存）。你可以通过在配置中显式设置 `cacheRetention` 来覆盖此设置�?
### 旧版参数

为了向后兼容，仍支持旧版 `cacheControlTtl` 参数�?
- `"5m"` 映射�?`short`
- `"1h"` 映射�?`long`

我们建议迁移到新�?`cacheRetention` 参数�?
RadioClaw �?Anthropic API 请求中包�?`extended-cache-ttl-2025-04-11` beta 标志�?如果你覆盖提供商头信息，请保留它（参�?[/gateway/configuration](/gateway/configuration)）�?
## 选项 B：Claude setup-token

**适用于：** 使用你的 Claude 订阅�?
### 在哪里获�?setup-token

setup-token �?**Claude Code CLI** 创建，而不�?Anthropic Console。你可以�?*任何机器**上运行：

```bash
claude setup-token
```

将令牌粘贴到 RadioClaw（向导：**Anthropic token (paste setup-token)**），或在 Gateway 网关主机上运行：

```bash
RadioClaw models auth setup-token --provider anthropic
```

如果你在不同的机器上生成了令牌，请粘贴它�?
```bash
RadioClaw models auth paste-token --provider anthropic
```

### CLI 设置

```bash
# 在新手引导期间粘�?setup-token
RadioClaw onboard --auth-choice setup-token
```

### 配置片段

```json5
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
}
```

## 注意事项

- 使用 `claude setup-token` 生成 setup-token 并粘贴，或在 Gateway 网关主机上运�?`RadioClaw models auth setup-token`�?- 如果你在 Claude 订阅上看�?OAuth token refresh failed �?，请使用 setup-token 重新认证。参�?[/gateway/troubleshooting#oauth-token-refresh-failed-anthropic-claude-subscription](/gateway/troubleshooting#oauth-token-refresh-failed-anthropic-claude-subscription)�?- 认证详情 + 重用规则�?[/concepts/oauth](/concepts/oauth)�?
## 故障排除

**401 错误/令牌突然失效**

- Claude 订阅认证可能过期或被撤销。重新运�?`claude setup-token`
  并将其粘贴到 **Gateway 网关主机**�?- 如果 Claude CLI 登录在不同的机器上，�?Gateway 网关主机上使�?  `RadioClaw models auth paste-token --provider anthropic`�?
**No API key found for provider "anthropic"**

- 认证�?*按智能体**的。新智能体不会继承主智能体的密钥�?- 为该智能体重新运行新手引导，或在 Gateway 网关主机上粘�?setup-token / API 密钥�?  然后使用 `RadioClaw models status` 验证�?
**No credentials found for profile `anthropic:default`**

- 运行 `RadioClaw models status` 查看哪个认证配置文件处于活动状态�?- 重新运行新手引导，或为该配置文件粘贴 setup-token / API 密钥�?
**No available auth profile (all in cooldown/unavailable)**

- 检�?`RadioClaw models status --json` 中的 `auth.unusableProfiles`�?- 添加另一�?Anthropic 配置文件或等待冷却期结束�?
更多信息：[/gateway/troubleshooting](/gateway/troubleshooting) �?[/help/faq](/help/faq)�?