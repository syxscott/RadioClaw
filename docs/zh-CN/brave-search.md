---
read_when:
  - 你想使用 Brave Search 进行 web_search
  - 你需�?BRAVE_API_KEY 或套餐详�?summary: 用于 web_search �?Brave Search API 设置
title: Brave Search
x-i18n:
  generated_at: "2026-02-03T07:43:09Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: cdcb037b092b8a10609f02acf062b4164cb826ac22bdb3fb2909c842a1405341
  source_path: brave-search.md
  workflow: 15
---

# Brave Search API

RadioClaw 使用 Brave Search 作为 `web_search` 的默认提供商�?
## 获取 API 密钥

1. �?https://brave.com/search/api/ 创建 Brave Search API 账户
2. 在控制面板中，选择 **Data for Search** 套餐并生�?API 密钥�?3. 将密钥存储在配置中（推荐），或在 Gateway 网关环境中设�?`BRAVE_API_KEY`�?
## 配置示例

```json5
{
  tools: {
    web: {
      search: {
        provider: "brave",
        apiKey: "BRAVE_API_KEY_HERE",
        maxResults: 5,
        timeoutSeconds: 30,
      },
    },
  },
}
```

## 注意事项

- Data for AI 套餐�?`web_search` **�?*兼容�?- Brave 提供免费层级和付费套餐；请查�?Brave API 门户了解当前限制�?
请参�?[Web 工具](/tools/web) 了解完整�?web_search 配置�?