---
summary: "Updating RadioClaw safely (global install or source), plus rollback strategy"
read_when:
  - Updating RadioClaw
  - Something breaks after an update
title: "Updating"
---

# Updating

RadioClaw is moving fast (pre â€?.0â€?. Treat updates like shipping infra: update â†?run checks â†?restart (or use `RadioClaw update`, which restarts) â†?verify.

## Recommended: re-run the website installer (upgrade in place)

The **preferred** update path is to re-run the installer from the website. It
detects existing installs, upgrades in place, and runs `RadioClaw doctor` when
needed.

```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash
```

Notes:

- Add `--no-onboard` if you donâ€™t want the onboarding wizard to run again.
- For **source installs**, use:

  ```bash
  curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --install-method git --no-onboard
  ```

  The installer will `git pull --rebase` **only** if the repo is clean.

- For **global installs**, the script uses `npm install -g RadioClaw@latest` under the hood.
- Legacy note: `clawdbot` remains available as a compatibility shim.

## Before you update

- Know how you installed: **global** (npm/pnpm) vs **from source** (git clone).
- Know how your Gateway is running: **foreground terminal** vs **supervised service** (launchd/systemd).
- Snapshot your tailoring:
  - Config: `~/.RadioClaw/RadioClaw.json`
  - Credentials: `~/.RadioClaw/credentials/`
  - Workspace: `~/.RadioClaw/workspace`

## Update (global install)

Global install (pick one):

```bash
npm i -g RadioClaw@latest
```

```bash
pnpm add -g RadioClaw@latest
```

We do **not** recommend Bun for the Gateway runtime (WhatsApp/Telegram bugs).

To switch update channels (git + npm installs):

```bash
RadioClaw update --channel beta
RadioClaw update --channel dev
RadioClaw update --channel stable
```

Use `--tag <dist-tag|version>` for a one-off install tag/version.

See [Development channels](/install/development-channels) for channel semantics and release notes.

Note: on npm installs, the gateway logs an update hint on startup (checks the current channel tag). Disable via `update.checkOnStart: false`.

### Core auto-updater (optional)

Auto-updater is **off by default** and is a core Gateway feature (not a plugin).

```json
{
  "update": {
    "channel": "stable",
    "auto": {
      "enabled": true,
      "stableDelayHours": 6,
      "stableJitterHours": 12,
      "betaCheckIntervalHours": 1
    }
  }
}
```

Behavior:

- `stable`: when a new version is seen, RadioClaw waits `stableDelayHours` and then applies a deterministic per-install jitter in `stableJitterHours` (spread rollout).
- `beta`: checks on `betaCheckIntervalHours` cadence (default: hourly) and applies when an update is available.
- `dev`: no automatic apply; use manual `RadioClaw update`.

Use `RadioClaw update --dry-run` to preview update actions before enabling automation.

Then:

```bash
RadioClaw doctor
RadioClaw gateway restart
RadioClaw health
```

Notes:

- If your Gateway runs as a service, `RadioClaw gateway restart` is preferred over killing PIDs.
- If youâ€™re pinned to a specific version, see â€œRollback / pinningâ€?below.

## Update (`RadioClaw update`)

For **source installs** (git checkout), prefer:

```bash
RadioClaw update
```

It runs a safe-ish update flow:

- Requires a clean worktree.
- Switches to the selected channel (tag or branch).
- Fetches + rebases against the configured upstream (dev channel).
- Installs deps, builds, builds the Control UI, and runs `RadioClaw doctor`.
- Restarts the gateway by default (use `--no-restart` to skip).

If you installed via **npm/pnpm** (no git metadata), `RadioClaw update` will try to update via your package manager. If it canâ€™t detect the install, use â€œUpdate (global install)â€?instead.

## Update (Control UI / RPC)

The Control UI has **Update & Restart** (RPC: `update.run`). It:

1. Runs the same source-update flow as `RadioClaw update` (git checkout only).
2. Writes a restart sentinel with a structured report (stdout/stderr tail).
3. Restarts the gateway and pings the last active session with the report.

If the rebase fails, the gateway aborts and restarts without applying the update.

## Update (from source)

From the repo checkout:

Preferred:

```bash
RadioClaw update
```

Manual (equivalent-ish):

```bash
git pull
pnpm install
pnpm build
pnpm ui:build # auto-installs UI deps on first run
RadioClaw doctor
RadioClaw health
```

Notes:

- `pnpm build` matters when you run the packaged `RadioClaw` binary ([`RadioClaw.mjs`](https://github.com/RadioClaw/RadioClaw/blob/main/RadioClaw.mjs)) or use Node to run `dist/`.
- If you run from a repo checkout without a global install, use `pnpm RadioClaw ...` for CLI commands.
- If you run directly from TypeScript (`pnpm RadioClaw ...`), a rebuild is usually unnecessary, but **config migrations still apply** â†?run doctor.
- Switching between global and git installs is easy: install the other flavor, then run `RadioClaw doctor` so the gateway service entrypoint is rewritten to the current install.

## Always Run: `RadioClaw doctor`

Doctor is the â€œsafe updateâ€?command. Itâ€™s intentionally boring: repair + migrate + warn.

Note: if youâ€™re on a **source install** (git checkout), `RadioClaw doctor` will offer to run `RadioClaw update` first.

Typical things it does:

- Migrate deprecated config keys / legacy config file locations.
- Audit DM policies and warn on risky â€œopenâ€?settings.
- Check Gateway health and can offer to restart.
- Detect and migrate older gateway services (launchd/systemd; legacy schtasks) to current RadioClaw services.
- On Linux, ensure systemd user lingering (so the Gateway survives logout).

Details: [Doctor](/gateway/doctor)

## Start / stop / restart the Gateway

CLI (works regardless of OS):

```bash
RadioClaw gateway status
RadioClaw gateway stop
RadioClaw gateway restart
RadioClaw gateway --port 18789
RadioClaw logs --follow
```

If youâ€™re supervised:

- macOS launchd (app-bundled LaunchAgent): `launchctl kickstart -k gui/$UID/ai.RadioClaw.gateway` (use `ai.RadioClaw.<profile>`; legacy `com.RadioClaw.*` still works)
- Linux systemd user service: `systemctl --user restart RadioClaw-gateway[-<profile>].service`
- Windows (WSL2): `systemctl --user restart RadioClaw-gateway[-<profile>].service`
  - `launchctl`/`systemctl` only work if the service is installed; otherwise run `RadioClaw gateway install`.

Runbook + exact service labels: [Gateway runbook](/gateway)

## Rollback / pinning (when something breaks)

### Pin (global install)

Install a known-good version (replace `<version>` with the last working one):

```bash
npm i -g RadioClaw@<version>
```

```bash
pnpm add -g RadioClaw@<version>
```

Tip: to see the current published version, run `npm view RadioClaw version`.

Then restart + re-run doctor:

```bash
RadioClaw doctor
RadioClaw gateway restart
```

### Pin (source) by date

Pick a commit from a date (example: â€œstate of main as of 2026-01-01â€?:

```bash
git fetch origin
git checkout "$(git rev-list -n 1 --before=\"2026-01-01\" origin/main)"
```

Then reinstall deps + restart:

```bash
pnpm install
pnpm build
RadioClaw gateway restart
```

If you want to go back to latest later:

```bash
git checkout main
git pull
```

## If youâ€™re stuck

- Run `RadioClaw doctor` again and read the output carefully (it often tells you the fix).
- Check: [Troubleshooting](/gateway/troubleshooting)
- Ask in Discord: [https://discord.gg/clawd](https://discord.gg/clawd)
