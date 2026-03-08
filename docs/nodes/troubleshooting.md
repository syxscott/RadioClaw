---
summary: "Troubleshoot node pairing, foreground requirements, permissions, and tool failures"
read_when:
  - Node is connected but camera/canvas/screen/exec tools fail
  - You need the node pairing versus approvals mental model
title: "Node Troubleshooting"
---

# Node troubleshooting

Use this page when a node is visible in status but node tools fail.

## Command ladder

```bash
RadioClaw status
RadioClaw gateway status
RadioClaw logs --follow
RadioClaw doctor
RadioClaw channels status --probe
```

Then run node specific checks:

```bash
RadioClaw nodes status
RadioClaw nodes describe --node <idOrNameOrIp>
RadioClaw approvals get --node <idOrNameOrIp>
```

Healthy signals:

- Node is connected and paired for role `node`.
- `nodes describe` includes the capability you are calling.
- Exec approvals show expected mode/allowlist.

## Foreground requirements

`canvas.*`, `camera.*`, and `screen.*` are foreground only on iOS/Android nodes.

Quick check and fix:

```bash
RadioClaw nodes describe --node <idOrNameOrIp>
RadioClaw nodes canvas snapshot --node <idOrNameOrIp>
RadioClaw logs --follow
```

If you see `NODE_BACKGROUND_UNAVAILABLE`, bring the node app to the foreground and retry.

## Permissions matrix

| Capability                   | iOS                                     | Android                                      | macOS node app                | Typical failure code           |
| ---------------------------- | --------------------------------------- | -------------------------------------------- | ----------------------------- | ------------------------------ |
| `camera.snap`, `camera.clip` | Camera (+ mic for clip audio)           | Camera (+ mic for clip audio)                | Camera (+ mic for clip audio) | `*_PERMISSION_REQUIRED`        |
| `screen.record`              | Screen Recording (+ mic optional)       | Screen capture prompt (+ mic optional)       | Screen Recording              | `*_PERMISSION_REQUIRED`        |
| `location.get`               | While Using or Always (depends on mode) | Foreground/Background location based on mode | Location permission           | `LOCATION_PERMISSION_REQUIRED` |
| `system.run`                 | n/a (node host path)                    | n/a (node host path)                         | Exec approvals required       | `SYSTEM_RUN_DENIED`            |

## Pairing versus approvals

These are different gates:

1. **Device pairing**: can this node connect to the gateway?
2. **Exec approvals**: can this node run a specific shell command?

Quick checks:

```bash
RadioClaw devices list
RadioClaw nodes status
RadioClaw approvals get --node <idOrNameOrIp>
RadioClaw approvals allowlist add --node <idOrNameOrIp> "/usr/bin/uname"
```

If pairing is missing, approve the node device first.
If pairing is fine but `system.run` fails, fix exec approvals/allowlist.

## Common node error codes

- `NODE_BACKGROUND_UNAVAILABLE` â†?app is backgrounded; bring it foreground.
- `CAMERA_DISABLED` â†?camera toggle disabled in node settings.
- `*_PERMISSION_REQUIRED` â†?OS permission missing/denied.
- `LOCATION_DISABLED` â†?location mode is off.
- `LOCATION_PERMISSION_REQUIRED` â†?requested location mode not granted.
- `LOCATION_BACKGROUND_UNAVAILABLE` â†?app is backgrounded but only While Using permission exists.
- `SYSTEM_RUN_DENIED: approval required` â†?exec request needs explicit approval.
- `SYSTEM_RUN_DENIED: allowlist miss` â†?command blocked by allowlist mode.
  On Windows node hosts, shell-wrapper forms like `cmd.exe /c ...` are treated as allowlist misses in
  allowlist mode unless approved via ask flow.

## Fast recovery loop

```bash
RadioClaw nodes status
RadioClaw nodes describe --node <idOrNameOrIp>
RadioClaw approvals get --node <idOrNameOrIp>
RadioClaw logs --follow
```

If still stuck:

- Re-approve device pairing.
- Re-open node app (foreground).
- Re-grant OS permissions.
- Recreate/adjust exec approval policy.

Related:

- [/nodes/index](/nodes/index)
- [/nodes/camera](/nodes/camera)
- [/nodes/location-command](/nodes/location-command)
- [/tools/exec-approvals](/tools/exec-approvals)
- [/gateway/pairing](/gateway/pairing)
