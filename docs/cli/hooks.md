---
summary: "CLI reference for `RadioClaw hooks` (agent hooks)"
read_when:
  - You want to manage agent hooks
  - You want to install or update hooks
title: "hooks"
---

# `RadioClaw hooks`

Manage agent hooks (event-driven automations for commands like `/new`, `/reset`, and gateway startup).

Related:

- Hooks: [Hooks](/automation/hooks)
- Plugin hooks: [Plugins](/tools/plugin#plugin-hooks)

## List All Hooks

```bash
RadioClaw hooks list
```

List all discovered hooks from workspace, managed, and bundled directories.

**Options:**

- `--eligible`: Show only eligible hooks (requirements met)
- `--json`: Output as JSON
- `-v, --verbose`: Show detailed information including missing requirements

**Example output:**

```
Hooks (4/4 ready)

Ready:
  üöÄ boot-md ‚ú?- Run BOOT.md on gateway startup
  üìé bootstrap-extra-files ‚ú?- Inject extra workspace bootstrap files during agent bootstrap
  üìù command-logger ‚ú?- Log all command events to a centralized audit file
  üíæ session-memory ‚ú?- Save session context to memory when /new command is issued
```

**Example (verbose):**

```bash
RadioClaw hooks list --verbose
```

Shows missing requirements for ineligible hooks.

**Example (JSON):**

```bash
RadioClaw hooks list --json
```

Returns structured JSON for programmatic use.

## Get Hook Information

```bash
RadioClaw hooks info <name>
```

Show detailed information about a specific hook.

**Arguments:**

- `<name>`: Hook name (e.g., `session-memory`)

**Options:**

- `--json`: Output as JSON

**Example:**

```bash
RadioClaw hooks info session-memory
```

**Output:**

```
üíæ session-memory ‚ú?Ready

Save session context to memory when /new command is issued

Details:
  Source: RadioClaw-bundled
  Path: /path/to/RadioClaw/hooks/bundled/session-memory/HOOK.md
  Handler: /path/to/RadioClaw/hooks/bundled/session-memory/handler.ts
  Homepage: https://docs.RadioClaw.ai/automation/hooks#session-memory
  Events: command:new

Requirements:
  Config: ‚ú?workspace.dir
```

## Check Hooks Eligibility

```bash
RadioClaw hooks check
```

Show summary of hook eligibility status (how many are ready vs. not ready).

**Options:**

- `--json`: Output as JSON

**Example output:**

```
Hooks Status

Total hooks: 4
Ready: 4
Not ready: 0
```

## Enable a Hook

```bash
RadioClaw hooks enable <name>
```

Enable a specific hook by adding it to your config (`~/.RadioClaw/config.json`).

**Note:** Hooks managed by plugins show `plugin:<id>` in `RadioClaw hooks list` and
can‚Äôt be enabled/disabled here. Enable/disable the plugin instead.

**Arguments:**

- `<name>`: Hook name (e.g., `session-memory`)

**Example:**

```bash
RadioClaw hooks enable session-memory
```

**Output:**

```
‚ú?Enabled hook: üíæ session-memory
```

**What it does:**

- Checks if hook exists and is eligible
- Updates `hooks.internal.entries.<name>.enabled = true` in your config
- Saves config to disk

**After enabling:**

- Restart the gateway so hooks reload (menu bar app restart on macOS, or restart your gateway process in dev).

## Disable a Hook

```bash
RadioClaw hooks disable <name>
```

Disable a specific hook by updating your config.

**Arguments:**

- `<name>`: Hook name (e.g., `command-logger`)

**Example:**

```bash
RadioClaw hooks disable command-logger
```

**Output:**

```
‚è?Disabled hook: üìù command-logger
```

**After disabling:**

- Restart the gateway so hooks reload

## Install Hooks

```bash
RadioClaw hooks install <path-or-spec>
RadioClaw hooks install <npm-spec> --pin
```

Install a hook pack from a local folder/archive or npm.

Npm specs are **registry-only** (package name + optional **exact version** or
**dist-tag**). Git/URL/file specs and semver ranges are rejected. Dependency
installs run with `--ignore-scripts` for safety.

Bare specs and `@latest` stay on the stable track. If npm resolves either of
those to a prerelease, RadioClaw stops and asks you to opt in explicitly with a
prerelease tag such as `@beta`/`@rc` or an exact prerelease version.

**What it does:**

- Copies the hook pack into `~/.RadioClaw/hooks/<id>`
- Enables the installed hooks in `hooks.internal.entries.*`
- Records the install under `hooks.internal.installs`

**Options:**

- `-l, --link`: Link a local directory instead of copying (adds it to `hooks.internal.load.extraDirs`)
- `--pin`: Record npm installs as exact resolved `name@version` in `hooks.internal.installs`

**Supported archives:** `.zip`, `.tgz`, `.tar.gz`, `.tar`

**Examples:**

```bash
# Local directory
RadioClaw hooks install ./my-hook-pack

# Local archive
RadioClaw hooks install ./my-hook-pack.zip

# NPM package
RadioClaw hooks install @RadioClaw/my-hook-pack

# Link a local directory without copying
RadioClaw hooks install -l ./my-hook-pack
```

## Update Hooks

```bash
RadioClaw hooks update <id>
RadioClaw hooks update --all
```

Update installed hook packs (npm installs only).

**Options:**

- `--all`: Update all tracked hook packs
- `--dry-run`: Show what would change without writing

When a stored integrity hash exists and the fetched artifact hash changes,
RadioClaw prints a warning and asks for confirmation before proceeding. Use
global `--yes` to bypass prompts in CI/non-interactive runs.

## Bundled Hooks

### session-memory

Saves session context to memory when you issue `/new`.

**Enable:**

```bash
RadioClaw hooks enable session-memory
```

**Output:** `~/.RadioClaw/workspace/memory/YYYY-MM-DD-slug.md`

**See:** [session-memory documentation](/automation/hooks#session-memory)

### bootstrap-extra-files

Injects additional bootstrap files (for example monorepo-local `AGENTS.md` / `TOOLS.md`) during `agent:bootstrap`.

**Enable:**

```bash
RadioClaw hooks enable bootstrap-extra-files
```

**See:** [bootstrap-extra-files documentation](/automation/hooks#bootstrap-extra-files)

### command-logger

Logs all command events to a centralized audit file.

**Enable:**

```bash
RadioClaw hooks enable command-logger
```

**Output:** `~/.RadioClaw/logs/commands.log`

**View logs:**

```bash
# Recent commands
tail -n 20 ~/.RadioClaw/logs/commands.log

# Pretty-print
cat ~/.RadioClaw/logs/commands.log | jq .

# Filter by action
grep '"action":"new"' ~/.RadioClaw/logs/commands.log | jq .
```

**See:** [command-logger documentation](/automation/hooks#command-logger)

### boot-md

Runs `BOOT.md` when the gateway starts (after channels start).

**Events**: `gateway:startup`

**Enable**:

```bash
RadioClaw hooks enable boot-md
```

**See:** [boot-md documentation](/automation/hooks#boot-md)
