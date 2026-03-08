---
title: "Default AGENTS.md"
summary: "Default RadioClaw agent instructions and skills roster for the personal assistant setup"
read_when:
  - Starting a new RadioClaw agent session
  - Enabling or auditing default skills
---

# AGENTS.md â€?RadioClaw Personal Assistant (default)

## First run (recommended)

RadioClaw uses a dedicated workspace directory for the agent. Default: `~/.RadioClaw/workspace` (configurable via `agents.defaults.workspace`).

1. Create the workspace (if it doesnâ€™t already exist):

```bash
mkdir -p ~/.RadioClaw/workspace
```

2. Copy the default workspace templates into the workspace:

```bash
cp docs/reference/templates/AGENTS.md ~/.RadioClaw/workspace/AGENTS.md
cp docs/reference/templates/SOUL.md ~/.RadioClaw/workspace/SOUL.md
cp docs/reference/templates/TOOLS.md ~/.RadioClaw/workspace/TOOLS.md
```

3. Optional: if you want the personal assistant skill roster, replace AGENTS.md with this file:

```bash
cp docs/reference/AGENTS.default.md ~/.RadioClaw/workspace/AGENTS.md
```

4. Optional: choose a different workspace by setting `agents.defaults.workspace` (supports `~`):

```json5
{
  agents: { defaults: { workspace: "~/.RadioClaw/workspace" } },
}
```

## Safety defaults

- Donâ€™t dump directories or secrets into chat.
- Donâ€™t run destructive commands unless explicitly asked.
- Donâ€™t send partial/streaming replies to external messaging surfaces (only final replies).

## Session start (required)

- Read `SOUL.md`, `USER.md`, `memory.md`, and today+yesterday in `memory/`.
- Do it before responding.

## Soul (required)

- `SOUL.md` defines identity, tone, and boundaries. Keep it current.
- If you change `SOUL.md`, tell the user.
- You are a fresh instance each session; continuity lives in these files.

## Shared spaces (recommended)

- Youâ€™re not the userâ€™s voice; be careful in group chats or public channels.
- Donâ€™t share private data, contact info, or internal notes.

## Memory system (recommended)

- Daily log: `memory/YYYY-MM-DD.md` (create `memory/` if needed).
- Long-term memory: `memory.md` for durable facts, preferences, and decisions.
- On session start, read today + yesterday + `memory.md` if present.
- Capture: decisions, preferences, constraints, open loops.
- Avoid secrets unless explicitly requested.

## Tools & skills

- Tools live in skills; follow each skillâ€™s `SKILL.md` when you need it.
- Keep environment-specific notes in `TOOLS.md` (Notes for Skills).

## Backup tip (recommended)

If you treat this workspace as Clawdâ€™s â€œmemoryâ€? make it a git repo (ideally private) so `AGENTS.md` and your memory files are backed up.

```bash
cd ~/.RadioClaw/workspace
git init
git add AGENTS.md
git commit -m "Add Clawd workspace"
# Optional: add a private remote + push
```

## What RadioClaw Does

- Runs WhatsApp gateway + Pi coding agent so the assistant can read/write chats, fetch context, and run skills via the host Mac.
- macOS app manages permissions (screen recording, notifications, microphone) and exposes the `RadioClaw` CLI via its bundled binary.
- Direct chats collapse into the agent's `main` session by default; groups stay isolated as `agent:<agentId>:<channel>:group:<id>` (rooms/channels: `agent:<agentId>:<channel>:channel:<id>`); heartbeats keep background tasks alive.

## Core Skills (enable in Settings â†?Skills)

- **mcporter** â€?Tool server runtime/CLI for managing external skill backends.
- **Peekaboo** â€?Fast macOS screenshots with optional AI vision analysis.
- **camsnap** â€?Capture frames, clips, or motion alerts from RTSP/ONVIF security cams.
- **oracle** â€?OpenAI-ready agent CLI with session replay and browser control.
- **eightctl** â€?Control your sleep, from the terminal.
- **imsg** â€?Send, read, stream iMessage & SMS.
- **wacli** â€?WhatsApp CLI: sync, search, send.
- **discord** â€?Discord actions: react, stickers, polls. Use `user:<id>` or `channel:<id>` targets (bare numeric ids are ambiguous).
- **gog** â€?Google Suite CLI: Gmail, Calendar, Drive, Contacts.
- **spotify-player** â€?Terminal Spotify client to search/queue/control playback.
- **sag** â€?ElevenLabs speech with mac-style say UX; streams to speakers by default.
- **Sonos CLI** â€?Control Sonos speakers (discover/status/playback/volume/grouping) from scripts.
- **blucli** â€?Play, group, and automate BluOS players from scripts.
- **OpenHue CLI** â€?Philips Hue lighting control for scenes and automations.
- **OpenAI Whisper** â€?Local speech-to-text for quick dictation and voicemail transcripts.
- **Gemini CLI** â€?Google Gemini models from the terminal for fast Q&A.
- **agent-tools** â€?Utility toolkit for automations and helper scripts.

## Usage Notes

- Prefer the `RadioClaw` CLI for scripting; mac app handles permissions.
- Run installs from the Skills tab; it hides the button if a binary is already present.
- Keep heartbeats enabled so the assistant can schedule reminders, monitor inboxes, and trigger camera captures.
- Canvas UI runs full-screen with native overlays. Avoid placing critical controls in the top-left/top-right/bottom edges; add explicit gutters in the layout and donâ€™t rely on safe-area insets.
- For browser-driven verification, use `RadioClaw browser` (tabs/status/screenshot) with the RadioClaw-managed Chrome profile.
- For DOM inspection, use `RadioClaw browser eval|query|dom|snapshot` (and `--json`/`--out` when you need machine output).
- For interactions, use `RadioClaw browser click|type|hover|drag|select|upload|press|wait|navigate|back|evaluate|run` (click/type require snapshot refs; use `evaluate` for CSS selectors).
