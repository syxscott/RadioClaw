---
read_when: You want per-agent sandboxing or per-agent tool allow/deny policies in a multi-agent gateway.
status: active
summary: 按智能体的沙�?+ 工具限制、优先级和示�?title: 多智能体沙箱与工�?x-i18n:
  generated_at: "2026-02-03T07:50:39Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: f602cb6192b84b404cd7b6336562888a239d0fe79514edd51bd73c5b090131ef
  source_path: tools/multi-agent-sandbox-tools.md
  workflow: 15
---

# 多智能体沙箱与工具配�?
## 概述

多智能体设置中的每个智能体现在可以拥有自己的�?
- **沙箱配置**（`agents.list[].sandbox` 覆盖 `agents.defaults.sandbox`�?- **工具限制**（`tools.allow` / `tools.deny`，以�?`agents.list[].tools`�?
这允许你运行具有不同安全配置文件的多个智能体�?
- 具有完全访问权限的个人助�?- 具有受限工具的家�?工作智能�?- 在沙箱中运行的面向公众的智能�?
`setupCommand` 属于 `sandbox.docker` 下（全局或按智能体），在容器创建时运行一次�?
认证是按智能体的：每个智能体从其自己�?`agentDir` 认证存储读取�?
```
~/.RadioClaw/agents/<agentId>/agent/auth-profiles.json
```

凭证**不会**在智能体之间共享。切勿在智能体之间重�?`agentDir`�?如果你想共享凭证，请�?`auth-profiles.json` 复制到其他智能体�?`agentDir` 中�?
有关沙箱隔离在运行时的行为，请参见[沙箱隔离](/gateway/sandboxing)�?有关调试"为什么这被阻止了�?，请参见[沙箱 vs 工具策略 vs 提权](/gateway/sandbox-vs-tool-policy-vs-elevated) �?`RadioClaw sandbox explain`�?
---

## 配置示例

### 示例 1：个�?+ 受限家庭智能�?
```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "Personal Assistant",
        "workspace": "~/.RadioClaw/workspace",
        "sandbox": { "mode": "off" }
      },
      {
        "id": "family",
        "name": "Family Bot",
        "workspace": "~/.RadioClaw/workspace-family",
        "sandbox": {
          "mode": "all",
          "scope": "agent"
        },
        "tools": {
          "allow": ["read"],
          "deny": ["exec", "write", "edit", "apply_patch", "process", "browser"]
        }
      }
    ]
  },
  "bindings": [
    {
      "agentId": "family",
      "match": {
        "provider": "whatsapp",
        "accountId": "*",
        "peer": {
          "kind": "group",
          "id": "120363424282127706@g.us"
        }
      }
    }
  ]
}
```

**结果�?*

- `main` 智能体：在主机上运行，完全工具访�?- `family` 智能体：�?Docker 中运行（每个智能体一个容器），仅�?`read` 工具

---

### 示例 2：具有共享沙箱的工作智能�?
```json
{
  "agents": {
    "list": [
      {
        "id": "personal",
        "workspace": "~/.RadioClaw/workspace-personal",
        "sandbox": { "mode": "off" }
      },
      {
        "id": "work",
        "workspace": "~/.RadioClaw/workspace-work",
        "sandbox": {
          "mode": "all",
          "scope": "shared",
          "workspaceRoot": "/tmp/work-sandboxes"
        },
        "tools": {
          "allow": ["read", "write", "apply_patch", "exec"],
          "deny": ["browser", "gateway", "discord"]
        }
      }
    ]
  }
}
```

---

### 示例 2b：全局编码配置文件 + 仅消息智能体

```json
{
  "tools": { "profile": "coding" },
  "agents": {
    "list": [
      {
        "id": "support",
        "tools": { "profile": "messaging", "allow": ["slack"] }
      }
    ]
  }
}
```

**结果�?*

- 默认智能体获得编码工�?- `support` 智能体仅用于消息�? Slack 工具�?
---

### 示例 3：每个智能体不同的沙箱模�?
```json
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "non-main", // 全局默认
        "scope": "session"
      }
    },
    "list": [
      {
        "id": "main",
        "workspace": "~/.RadioClaw/workspace",
        "sandbox": {
          "mode": "off" // 覆盖：main 永不沙箱隔离
        }
      },
      {
        "id": "public",
        "workspace": "~/.RadioClaw/workspace-public",
        "sandbox": {
          "mode": "all", // 覆盖：public 始终沙箱隔离
          "scope": "agent"
        },
        "tools": {
          "allow": ["read"],
          "deny": ["exec", "write", "edit", "apply_patch"]
        }
      }
    ]
  }
}
```

---

## 配置优先�?
当全局（`agents.defaults.*`）和智能体特定（`agents.list[].*`）配置同时存在时�?
### 沙箱配置

智能体特定设置覆盖全局�?
```
agents.list[].sandbox.mode > agents.defaults.sandbox.mode
agents.list[].sandbox.scope > agents.defaults.sandbox.scope
agents.list[].sandbox.workspaceRoot > agents.defaults.sandbox.workspaceRoot
agents.list[].sandbox.workspaceAccess > agents.defaults.sandbox.workspaceAccess
agents.list[].sandbox.docker.* > agents.defaults.sandbox.docker.*
agents.list[].sandbox.browser.* > agents.defaults.sandbox.browser.*
agents.list[].sandbox.prune.* > agents.defaults.sandbox.prune.*
```

**注意事项�?*

- `agents.list[].sandbox.{docker,browser,prune}.*` 为该智能体覆�?`agents.defaults.sandbox.{docker,browser,prune}.*`（当沙箱 scope 解析�?`"shared"` 时忽略）�?
### 工具限制

过滤顺序是：

1. **工具配置文件**（`tools.profile` �?`agents.list[].tools.profile`�?2. **提供商工具配置文�?*（`tools.byProvider[provider].profile` �?`agents.list[].tools.byProvider[provider].profile`�?3. **全局工具策略**（`tools.allow` / `tools.deny`�?4. **提供商工具策�?*（`tools.byProvider[provider].allow/deny`�?5. **智能体特定工具策�?*（`agents.list[].tools.allow/deny`�?6. **智能体提供商策略**（`agents.list[].tools.byProvider[provider].allow/deny`�?7. **沙箱工具策略**（`tools.sandbox.tools` �?`agents.list[].tools.sandbox.tools`�?8. **子智能体工具策略**（`tools.subagents.tools`，如适用�?
每个级别可以进一步限制工具，但不能恢复之前级别拒绝的工具�?如果设置�?`agents.list[].tools.sandbox.tools`，它将替换该智能体的 `tools.sandbox.tools`�?如果设置�?`agents.list[].tools.profile`，它将覆盖该智能体的 `tools.profile`�?提供商工具键接受 `provider`（例�?`google-antigravity`）或 `provider/model`（例�?`openai/gpt-5.2`）�?
### 工具组（简写）

工具策略（全局、智能体、沙箱）支持 `group:*` 条目，可扩展为多个具体工具：

- `group:runtime`：`exec`、`bash`、`process`
- `group:fs`：`read`、`write`、`edit`、`apply_patch`
- `group:sessions`：`sessions_list`、`sessions_history`、`sessions_send`、`sessions_spawn`、`session_status`
- `group:memory`：`memory_search`、`memory_get`
- `group:ui`：`browser`、`canvas`
- `group:automation`：`cron`、`gateway`
- `group:messaging`：`message`
- `group:nodes`：`nodes`
- `group:RadioClaw`：所有内�?RadioClaw 工具（不包括提供商插件）

### 提权模式

`tools.elevated` 是全局基线（基于发送者的允许列表）。`agents.list[].tools.elevated` 可以为特定智能体进一步限制提权（两者都必须允许）�?
缓解模式�?
- 为不受信任的智能体拒�?`exec`（`agents.list[].tools.deny: ["exec"]`�?- 避免将发送者加入允许列表后路由到受限智能体
- 如果你只想要沙箱隔离执行，全局禁用提权（`tools.elevated.enabled: false`�?- 为敏感配置文件按智能体禁用提权（`agents.list[].tools.elevated.enabled: false`�?
---

## 从单智能体迁�?
**之前（单智能体）�?*

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.RadioClaw/workspace",
      "sandbox": {
        "mode": "non-main"
      }
    }
  },
  "tools": {
    "sandbox": {
      "tools": {
        "allow": ["read", "write", "apply_patch", "exec"],
        "deny": []
      }
    }
  }
}
```

**之后（具有不同配置文件的多智能体）：**

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "~/.RadioClaw/workspace",
        "sandbox": { "mode": "off" }
      }
    ]
  }
}
```

旧版 `agent.*` 配置�?`RadioClaw doctor` 迁移；今后请优先使用 `agents.defaults` + `agents.list`�?
---

## 工具限制示例

### 只读智能�?
```json
{
  "tools": {
    "allow": ["read"],
    "deny": ["exec", "write", "edit", "apply_patch", "process"]
  }
}
```

### 安全执行智能体（无文件修改）

```json
{
  "tools": {
    "allow": ["read", "exec", "process"],
    "deny": ["write", "edit", "apply_patch", "browser", "gateway"]
  }
}
```

### 仅通信智能�?
```json
{
  "tools": {
    "allow": ["sessions_list", "sessions_send", "sessions_history", "session_status"],
    "deny": ["exec", "write", "edit", "apply_patch", "read", "browser"]
  }
}
```

---

## 常见陷阱�?non-main"

`agents.defaults.sandbox.mode: "non-main"` 基于 `session.mainKey`（默�?`"main"`），
而不是智能体 id。群�?渠道会话始终获得自己的键，因此它�?被视为非 main 并将被沙箱隔离。如果你希望智能体永�?沙箱隔离，请设置 `agents.list[].sandbox.mode: "off"`�?
---

## 测试

配置多智能体沙箱和工具后�?
1. **检查智能体解析�?*

   ```exec
   RadioClaw agents list --bindings
   ```

2. **验证沙箱容器�?*

   ```exec
   docker ps --filter "name=RadioClaw-sbx-"
   ```

3. **测试工具限制�?*
   - 发送需要受限工具的消息
   - 验证智能体无法使用被拒绝的工�?
4. **监控日志�?*
   ```exec
   tail -f "${RadioClaw_STATE_DIR:-$HOME/.RadioClaw}/logs/gateway.log" | grep -E "routing|sandbox|tools"
   ```

---

## 故障排除

### 尽管设置�?`mode: "all"` 但智能体未被沙箱隔离

- 检查是否有全局 `agents.defaults.sandbox.mode` 覆盖�?- 智能体特定配置优先，因此设置 `agents.list[].sandbox.mode: "all"`

### 尽管有拒绝列表但工具仍然可用

- 检查工具过滤顺序：全局 �?智能�?�?沙箱 �?子智能体
- 每个级别只能进一步限制，不能恢复
- 通过日志验证：`[tools] filtering tools for agent:${agentId}`

### 容器未按智能体隔�?
- 在智能体特定沙箱配置中设�?`scope: "agent"`
- 默认�?`"session"`，每个会话创建一个容�?
---

## 另请参阅

- [多智能体路由](/concepts/multi-agent)
- [沙箱配置](/gateway/configuration#agentsdefaults-sandbox)
- [会话管理](/concepts/session)
