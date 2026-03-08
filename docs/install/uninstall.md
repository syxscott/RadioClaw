---
summary: "Uninstall RadioClaw completely (CLI, service, state, workspace)"
read_when:
  - You want to remove RadioClaw from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `RadioClaw` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
RadioClaw uninstall
```

Non-interactive (automation / npx):

```bash
RadioClaw uninstall --all --yes --non-interactive
npx -y RadioClaw uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
RadioClaw gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
RadioClaw gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${RadioClaw_STATE_DIR:-$HOME/.RadioClaw}"
```

If you set `RadioClaw_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.RadioClaw/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g RadioClaw
pnpm remove -g RadioClaw
bun remove -g RadioClaw
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/RadioClaw.app
```

Notes:

- If you used profiles (`--profile` / `RadioClaw_PROFILE`), repeat step 3 for each state dir (defaults are `~/.RadioClaw-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `RadioClaw` is missing.

### macOS (launchd)

Default label is `ai.RadioClaw.gateway` (or `ai.RadioClaw.<profile>`; legacy `com.RadioClaw.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.RadioClaw.gateway
rm -f ~/Library/LaunchAgents/ai.RadioClaw.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.RadioClaw.<profile>`. Remove any legacy `com.RadioClaw.*` plists if present.

### Linux (systemd user unit)

Default unit name is `RadioClaw-gateway.service` (or `RadioClaw-gateway-<profile>.service`):

```bash
systemctl --user disable --now RadioClaw-gateway.service
rm -f ~/.config/systemd/user/RadioClaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `RadioClaw Gateway` (or `RadioClaw Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "RadioClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.RadioClaw\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.RadioClaw-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://RadioClaw.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g RadioClaw@latest`.
Remove it with `npm rm -g RadioClaw` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `RadioClaw ...` / `bun run RadioClaw ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
