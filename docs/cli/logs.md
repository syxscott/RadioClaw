---
summary: "CLI reference for `RadioClaw logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `RadioClaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
RadioClaw logs
RadioClaw logs --follow
RadioClaw logs --json
RadioClaw logs --limit 500
RadioClaw logs --local-time
RadioClaw logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
