---
summary: "CLI reference for `RadioClaw devices` (device pairing + token rotation/revocation)"
read_when:
  - You are approving device pairing requests
  - You need to rotate or revoke device tokens
title: "devices"
---

# `RadioClaw devices`

Manage device pairing requests and device-scoped tokens.

## Commands

### `RadioClaw devices list`

List pending pairing requests and paired devices.

```
RadioClaw devices list
RadioClaw devices list --json
```

### `RadioClaw devices remove <deviceId>`

Remove one paired device entry.

```
RadioClaw devices remove <deviceId>
RadioClaw devices remove <deviceId> --json
```

### `RadioClaw devices clear --yes [--pending]`

Clear paired devices in bulk.

```
RadioClaw devices clear --yes
RadioClaw devices clear --yes --pending
RadioClaw devices clear --yes --pending --json
```

### `RadioClaw devices approve [requestId] [--latest]`

Approve a pending device pairing request. If `requestId` is omitted, RadioClaw
automatically approves the most recent pending request.

```
RadioClaw devices approve
RadioClaw devices approve <requestId>
RadioClaw devices approve --latest
```

### `RadioClaw devices reject <requestId>`

Reject a pending device pairing request.

```
RadioClaw devices reject <requestId>
```

### `RadioClaw devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

```
RadioClaw devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### `RadioClaw devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

```
RadioClaw devices revoke --device <deviceId> --role node
```

## Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

Note: when you set `--url`, the CLI does not fall back to config or environment credentials.
Pass `--token` or `--password` explicitly. Missing explicit credentials is an error.

## Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.
- `devices clear` is intentionally gated by `--yes`.
- If pairing scope is unavailable on local loopback (and no explicit `--url` is passed), list/approve can use a local pairing fallback.
