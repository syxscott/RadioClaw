---
read_when:
  - 集成需�?OpenAI Chat Completions 的工�?summary: �?Gateway 网关暴露 OpenAI 兼容�?/v1/chat/completions HTTP 端点
title: OpenAI Chat Completions
x-i18n:
  generated_at: "2026-02-03T07:48:15Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 6f935777f489bff925a3bf18b1e4b7493f83ae7b1e581890092e5779af59b732
  source_path: gateway/openai-http-api.md
  workflow: 15
---

# OpenAI Chat Completions（HTTP�?
RadioClaw �?Gateway 网关可以提供一个小型的 OpenAI 兼容 Chat Completions 端点�?
此端�?*默认禁用**。请先在配置中启用它�?
- `POST /v1/chat/completions`
- �?Gateway 网关相同的端口（WS + HTTP 多路复用）：`http://<gateway-host>:<port>/v1/chat/completions`

底层实现中，请求作为普通的 Gateway 网关智能体运行执行（�?`RadioClaw agent` 相同的代码路径），因此路�?权限/配置与你�?Gateway 网关一致�?
## 认证

使用 Gateway 网关认证配置。发�?bearer 令牌�?
- `Authorization: Bearer <token>`

注意事项�?
- �?`gateway.auth.mode="token"` 时，使用 `gateway.auth.token`（或 `RadioClaw_GATEWAY_TOKEN`）�?- �?`gateway.auth.mode="password"` 时，使用 `gateway.auth.password`（或 `RadioClaw_GATEWAY_PASSWORD`）�?
## 选择智能�?
无需自定义头：在 OpenAI `model` 字段中编码智能体 ID�?
- `model: "RadioClaw:<agentId>"`（例如：`"RadioClaw:main"`、`"RadioClaw:beta"`�?- `model: "agent:<agentId>"`（别名）

或通过头指定特定的 RadioClaw 智能体：

- `x-RadioClaw-agent-id: <agentId>`（默认：`main`�?
高级选项�?
- `x-RadioClaw-session-key: <sessionKey>` 完全控制会话路由�?
## 启用端点

�?`gateway.http.endpoints.chatCompletions.enabled` 设置�?`true`�?
```json5
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: true },
      },
    },
  },
}
```

## 禁用端点

�?`gateway.http.endpoints.chatCompletions.enabled` 设置�?`false`�?
```json5
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: false },
      },
    },
  },
}
```

## 会话行为

默认情况下，端点�?*每请求无状�?*的（每次调用生成新的会话键）�?
如果请求包含 OpenAI `user` 字符串，Gateway 网关会从中派生一个稳定的会话键，因此重复调用可以共享智能体会话�?
## 流式传输（SSE�?
设置 `stream: true` 以接�?Server-Sent Events（SSE）：

- `Content-Type: text/event-stream`
- 每个事件行是 `data: <json>`
- 流以 `data: [DONE]` 结束

## 示例

非流式：

```bash
curl -sS http://127.0.0.1:18789/v1/chat/completions \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-RadioClaw-agent-id: main' \
  -d '{
    "model": "RadioClaw",
    "messages": [{"role":"user","content":"hi"}]
  }'
```

流式�?
```bash
curl -N http://127.0.0.1:18789/v1/chat/completions \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-RadioClaw-agent-id: main' \
  -d '{
    "model": "RadioClaw",
    "stream": true,
    "messages": [{"role":"user","content":"hi"}]
  }'
```
