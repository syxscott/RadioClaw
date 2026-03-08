---
summary: "CLI reference for `RadioClaw reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `RadioClaw reset`

Reset local config/state (keeps the CLI installed).

```bash
RadioClaw reset
RadioClaw reset --dry-run
RadioClaw reset --scope config+creds+sessions --yes --non-interactive
```
