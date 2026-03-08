---
summary: "CLI reference for `RadioClaw config` (get/set/unset/file/validate)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `RadioClaw config`

Config helpers: get/set/unset/validate values by path and print the active
config file. Run without a subcommand to open
the configure wizard (same as `RadioClaw configure`).

## Examples

```bash
RadioClaw config file
RadioClaw config get browser.executablePath
RadioClaw config set browser.executablePath "/usr/bin/google-chrome"
RadioClaw config set agents.defaults.heartbeat.every "2h"
RadioClaw config set agents.list[0].tools.exec.node "node-id-or-name"
RadioClaw config unset tools.web.search.apiKey
RadioClaw config validate
RadioClaw config validate --json
```

## Paths

Paths use dot or bracket notation:

```bash
RadioClaw config get agents.defaults.workspace
RadioClaw config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
RadioClaw config get agents.list
RadioClaw config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
RadioClaw config set agents.defaults.heartbeat.every "0m"
RadioClaw config set gateway.port 19001 --strict-json
RadioClaw config set channels.whatsapp.groups '["*"]' --strict-json
```

## Subcommands

- `config file`: Print the active config file path (resolved from `RadioClaw_CONFIG_PATH` or default location).

Restart the gateway after edits.

## Validate

Validate the current config against the active schema without starting the
gateway.

```bash
RadioClaw config validate
RadioClaw config validate --json
```
