---
summary: "Integrated browser control service + action commands"
read_when:
  - Adding agent-controlled browser automation
  - Debugging why RadioClaw is interfering with your own Chrome
  - Implementing browser settings + lifecycle in the macOS app
title: "Browser (RadioClaw-managed)"
---

# Browser (RadioClaw-managed)

RadioClaw can run a **dedicated Chrome/Brave/Edge/Chromium profile** that the agent controls.
It is isolated from your personal browser and is managed through a small local
control service inside the Gateway (loopback only).

Beginner view:

- Think of it as a **separate, agent-only browser**.
- The `RadioClaw` profile does **not** touch your personal browser profile.
- The agent can **open tabs, read pages, click, and type** in a safe lane.
- The default `chrome` profile uses the **system default Chromium browser** via the
  extension relay; switch to `RadioClaw` for the isolated managed browser.

## What you get

- A separate browser profile named **RadioClaw** (orange accent by default).
- Deterministic tab control (list/open/focus/close).
- Agent actions (click/type/drag/select), snapshots, screenshots, PDFs.
- Optional multi-profile support (`RadioClaw`, `work`, `remote`, ...).

This browser is **not** your daily driver. It is a safe, isolated surface for
agent automation and verification.

## Quick start

```bash
RadioClaw browser --browser-profile RadioClaw status
RadioClaw browser --browser-profile RadioClaw start
RadioClaw browser --browser-profile RadioClaw open https://example.com
RadioClaw browser --browser-profile RadioClaw snapshot
```

If you get â€œBrowser disabledâ€? enable it in config (see below) and restart the
Gateway.

## Profiles: `RadioClaw` vs `chrome`

- `RadioClaw`: managed, isolated browser (no extension required).
- `chrome`: extension relay to your **system browser** (requires the RadioClaw
  extension to be attached to a tab).

Set `browser.defaultProfile: "RadioClaw"` if you want managed mode by default.

## Configuration

Browser settings live in `~/.RadioClaw/RadioClaw.json`.

```json5
{
  browser: {
    enabled: true, // default: true
    ssrfPolicy: {
      dangerouslyAllowPrivateNetwork: true, // default trusted-network mode
      // allowPrivateNetwork: true, // legacy alias
      // hostnameAllowlist: ["*.example.com", "example.com"],
      // allowedHostnames: ["localhost"],
    },
    // cdpUrl: "http://127.0.0.1:18792", // legacy single-profile override
    remoteCdpTimeoutMs: 1500, // remote CDP HTTP timeout (ms)
    remoteCdpHandshakeTimeoutMs: 3000, // remote CDP WebSocket handshake timeout (ms)
    defaultProfile: "chrome",
    color: "#FF4500",
    headless: false,
    noSandbox: false,
    attachOnly: false,
    executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    profiles: {
      RadioClaw: { cdpPort: 18800, color: "#FF4500" },
      work: { cdpPort: 18801, color: "#0066CC" },
      remote: { cdpUrl: "http://10.0.0.42:9222", color: "#00AA00" },
    },
  },
}
```

Notes:

- The browser control service binds to loopback on a port derived from `gateway.port`
  (default: `18791`, which is gateway + 2). The relay uses the next port (`18792`).
- If you override the Gateway port (`gateway.port` or `RadioClaw_GATEWAY_PORT`),
  the derived browser ports shift to stay in the same â€œfamilyâ€?
- `cdpUrl` defaults to the relay port when unset.
- `remoteCdpTimeoutMs` applies to remote (non-loopback) CDP reachability checks.
- `remoteCdpHandshakeTimeoutMs` applies to remote CDP WebSocket reachability checks.
- Browser navigation/open-tab is SSRF-guarded before navigation and best-effort re-checked on final `http(s)` URL after navigation.
- `browser.ssrfPolicy.dangerouslyAllowPrivateNetwork` defaults to `true` (trusted-network model). Set it to `false` for strict public-only browsing.
- `browser.ssrfPolicy.allowPrivateNetwork` remains supported as a legacy alias for compatibility.
- `attachOnly: true` means â€œnever launch a local browser; only attach if it is already running.â€?- `color` + per-profile `color` tint the browser UI so you can see which profile is active.
- Default profile is `RadioClaw` (RadioClaw-managed standalone browser). Use `defaultProfile: "chrome"` to opt into the Chrome extension relay.
- Auto-detect order: system default browser if Chromium-based; otherwise Chrome â†?Brave â†?Edge â†?Chromium â†?Chrome Canary.
- Local `RadioClaw` profiles auto-assign `cdpPort`/`cdpUrl` â€?set those only for remote CDP.

## Use Brave (or another Chromium-based browser)

If your **system default** browser is Chromium-based (Chrome/Brave/Edge/etc),
RadioClaw uses it automatically. Set `browser.executablePath` to override
auto-detection:

CLI example:

```bash
RadioClaw config set browser.executablePath "/usr/bin/google-chrome"
```

```json5
// macOS
{
  browser: {
    executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
  }
}

// Windows
{
  browser: {
    executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
  }
}

// Linux
{
  browser: {
    executablePath: "/usr/bin/brave-browser"
  }
}
```

## Local vs remote control

- **Local control (default):** the Gateway starts the loopback control service and can launch a local browser.
- **Remote control (node host):** run a node host on the machine that has the browser; the Gateway proxies browser actions to it.
- **Remote CDP:** set `browser.profiles.<name>.cdpUrl` (or `browser.cdpUrl`) to
  attach to a remote Chromium-based browser. In this case, RadioClaw will not launch a local browser.

Remote CDP URLs can include auth:

- Query tokens (e.g., `https://provider.example?token=<token>`)
- HTTP Basic auth (e.g., `https://user:pass@provider.example`)

RadioClaw preserves the auth when calling `/json/*` endpoints and when connecting
to the CDP WebSocket. Prefer environment variables or secrets managers for
tokens instead of committing them to config files.

## Node browser proxy (zero-config default)

If you run a **node host** on the machine that has your browser, RadioClaw can
auto-route browser tool calls to that node without any extra browser config.
This is the default path for remote gateways.

Notes:

- The node host exposes its local browser control server via a **proxy command**.
- Profiles come from the nodeâ€™s own `browser.profiles` config (same as local).
- Disable if you donâ€™t want it:
  - On the node: `nodeHost.browserProxy.enabled=false`
  - On the gateway: `gateway.nodes.browser.mode="off"`

## Browserless (hosted remote CDP)

[Browserless](https://browserless.io) is a hosted Chromium service that exposes
CDP endpoints over HTTPS. You can point a RadioClaw browser profile at a
Browserless region endpoint and authenticate with your API key.

Example:

```json5
{
  browser: {
    enabled: true,
    defaultProfile: "browserless",
    remoteCdpTimeoutMs: 2000,
    remoteCdpHandshakeTimeoutMs: 4000,
    profiles: {
      browserless: {
        cdpUrl: "https://production-sfo.browserless.io?token=<BROWSERLESS_API_KEY>",
        color: "#00AA00",
      },
    },
  },
}
```

Notes:

- Replace `<BROWSERLESS_API_KEY>` with your real Browserless token.
- Choose the region endpoint that matches your Browserless account (see their docs).

## Security

Key ideas:

- Browser control is loopback-only; access flows through the Gatewayâ€™s auth or node pairing.
- If browser control is enabled and no auth is configured, RadioClaw auto-generates `gateway.auth.token` on startup and persists it to config.
- Keep the Gateway and any node hosts on a private network (Tailscale); avoid public exposure.
- Treat remote CDP URLs/tokens as secrets; prefer env vars or a secrets manager.

Remote CDP tips:

- Prefer HTTPS endpoints and short-lived tokens where possible.
- Avoid embedding long-lived tokens directly in config files.

## Profiles (multi-browser)

RadioClaw supports multiple named profiles (routing configs). Profiles can be:

- **RadioClaw-managed**: a dedicated Chromium-based browser instance with its own user data directory + CDP port
- **remote**: an explicit CDP URL (Chromium-based browser running elsewhere)
- **extension relay**: your existing Chrome tab(s) via the local relay + Chrome extension

Defaults:

- The `RadioClaw` profile is auto-created if missing.
- The `chrome` profile is built-in for the Chrome extension relay (points at `http://127.0.0.1:18792` by default).
- Local CDP ports allocate from **18800â€?8899** by default.
- Deleting a profile moves its local data directory to Trash.

All control endpoints accept `?profile=<name>`; the CLI uses `--browser-profile`.

## Chrome extension relay (use your existing Chrome)

RadioClaw can also drive **your existing Chrome tabs** (no separate â€œopenclawâ€?Chrome instance) via a local CDP relay + a Chrome extension.

Full guide: [Chrome extension](/tools/chrome-extension)

Flow:

- The Gateway runs locally (same machine) or a node host runs on the browser machine.
- A local **relay server** listens at a loopback `cdpUrl` (default: `http://127.0.0.1:18792`).
- You click the **RadioClaw Browser Relay** extension icon on a tab to attach (it does not auto-attach).
- The agent controls that tab via the normal `browser` tool, by selecting the right profile.

If the Gateway runs elsewhere, run a node host on the browser machine so the Gateway can proxy browser actions.

### Sandboxed sessions

If the agent session is sandboxed, the `browser` tool may default to `target="sandbox"` (sandbox browser).
Chrome extension relay takeover requires host browser control, so either:

- run the session unsandboxed, or
- set `agents.defaults.sandbox.browser.allowHostControl: true` and use `target="host"` when calling the tool.

### Setup

1. Load the extension (dev/unpacked):

```bash
RadioClaw browser extension install
```

- Chrome â†?`chrome://extensions` â†?enable â€œDeveloper modeâ€?- â€œLoad unpackedâ€?â†?select the directory printed by `RadioClaw browser extension path`
- Pin the extension, then click it on the tab you want to control (badge shows `ON`).

2. Use it:

- CLI: `RadioClaw browser --browser-profile chrome tabs`
- Agent tool: `browser` with `profile="chrome"`

Optional: if you want a different name or relay port, create your own profile:

```bash
RadioClaw browser create-profile \
  --name my-chrome \
  --driver extension \
  --cdp-url http://127.0.0.1:18792 \
  --color "#00AA00"
```

Notes:

- This mode relies on Playwright-on-CDP for most operations (screenshots/snapshots/actions).
- Detach by clicking the extension icon again.

## Isolation guarantees

- **Dedicated user data dir**: never touches your personal browser profile.
- **Dedicated ports**: avoids `9222` to prevent collisions with dev workflows.
- **Deterministic tab control**: target tabs by `targetId`, not â€œlast tabâ€?

## Browser selection

When launching locally, RadioClaw picks the first available:

1. Chrome
2. Brave
3. Edge
4. Chromium
5. Chrome Canary

You can override with `browser.executablePath`.

Platforms:

- macOS: checks `/Applications` and `~/Applications`.
- Linux: looks for `google-chrome`, `brave`, `microsoft-edge`, `chromium`, etc.
- Windows: checks common install locations.

## Control API (optional)

For local integrations only, the Gateway exposes a small loopback HTTP API:

- Status/start/stop: `GET /`, `POST /start`, `POST /stop`
- Tabs: `GET /tabs`, `POST /tabs/open`, `POST /tabs/focus`, `DELETE /tabs/:targetId`
- Snapshot/screenshot: `GET /snapshot`, `POST /screenshot`
- Actions: `POST /navigate`, `POST /act`
- Hooks: `POST /hooks/file-chooser`, `POST /hooks/dialog`
- Downloads: `POST /download`, `POST /wait/download`
- Debugging: `GET /console`, `POST /pdf`
- Debugging: `GET /errors`, `GET /requests`, `POST /trace/start`, `POST /trace/stop`, `POST /highlight`
- Network: `POST /response/body`
- State: `GET /cookies`, `POST /cookies/set`, `POST /cookies/clear`
- State: `GET /storage/:kind`, `POST /storage/:kind/set`, `POST /storage/:kind/clear`
- Settings: `POST /set/offline`, `POST /set/headers`, `POST /set/credentials`, `POST /set/geolocation`, `POST /set/media`, `POST /set/timezone`, `POST /set/locale`, `POST /set/device`

All endpoints accept `?profile=<name>`.

If gateway auth is configured, browser HTTP routes require auth too:

- `Authorization: Bearer <gateway token>`
- `x-RadioClaw-password: <gateway password>` or HTTP Basic auth with that password

### Playwright requirement

Some features (navigate/act/AI snapshot/role snapshot, element screenshots, PDF) require
Playwright. If Playwright isnâ€™t installed, those endpoints return a clear 501
error. ARIA snapshots and basic screenshots still work for RadioClaw-managed Chrome.
For the Chrome extension relay driver, ARIA snapshots and screenshots require Playwright.

If you see `Playwright is not available in this gateway build`, install the full
Playwright package (not `playwright-core`) and restart the gateway, or reinstall
RadioClaw with browser support.

#### Docker Playwright install

If your Gateway runs in Docker, avoid `npx playwright` (npm override conflicts).
Use the bundled CLI instead:

```bash
docker compose run --rm RadioClaw-cli \
  node /app/node_modules/playwright-core/cli.js install chromium
```

To persist browser downloads, set `PLAYWRIGHT_BROWSERS_PATH` (for example,
`/home/node/.cache/ms-playwright`) and make sure `/home/node` is persisted via
`RadioClaw_HOME_VOLUME` or a bind mount. See [Docker](/install/docker).

## How it works (internal)

High-level flow:

- A small **control server** accepts HTTP requests.
- It connects to Chromium-based browsers (Chrome/Brave/Edge/Chromium) via **CDP**.
- For advanced actions (click/type/snapshot/PDF), it uses **Playwright** on top
  of CDP.
- When Playwright is missing, only non-Playwright operations are available.

This design keeps the agent on a stable, deterministic interface while letting
you swap local/remote browsers and profiles.

## CLI quick reference

All commands accept `--browser-profile <name>` to target a specific profile.
All commands also accept `--json` for machine-readable output (stable payloads).

Basics:

- `RadioClaw browser status`
- `RadioClaw browser start`
- `RadioClaw browser stop`
- `RadioClaw browser tabs`
- `RadioClaw browser tab`
- `RadioClaw browser tab new`
- `RadioClaw browser tab select 2`
- `RadioClaw browser tab close 2`
- `RadioClaw browser open https://example.com`
- `RadioClaw browser focus abcd1234`
- `RadioClaw browser close abcd1234`

Inspection:

- `RadioClaw browser screenshot`
- `RadioClaw browser screenshot --full-page`
- `RadioClaw browser screenshot --ref 12`
- `RadioClaw browser screenshot --ref e12`
- `RadioClaw browser snapshot`
- `RadioClaw browser snapshot --format aria --limit 200`
- `RadioClaw browser snapshot --interactive --compact --depth 6`
- `RadioClaw browser snapshot --efficient`
- `RadioClaw browser snapshot --labels`
- `RadioClaw browser snapshot --selector "#main" --interactive`
- `RadioClaw browser snapshot --frame "iframe#main" --interactive`
- `RadioClaw browser console --level error`
- `RadioClaw browser errors --clear`
- `RadioClaw browser requests --filter api --clear`
- `RadioClaw browser pdf`
- `RadioClaw browser responsebody "**/api" --max-chars 5000`

Actions:

- `RadioClaw browser navigate https://example.com`
- `RadioClaw browser resize 1280 720`
- `RadioClaw browser click 12 --double`
- `RadioClaw browser click e12 --double`
- `RadioClaw browser type 23 "hello" --submit`
- `RadioClaw browser press Enter`
- `RadioClaw browser hover 44`
- `RadioClaw browser scrollintoview e12`
- `RadioClaw browser drag 10 11`
- `RadioClaw browser select 9 OptionA OptionB`
- `RadioClaw browser download e12 report.pdf`
- `RadioClaw browser waitfordownload report.pdf`
- `RadioClaw browser upload /tmp/RadioClaw/uploads/file.pdf`
- `RadioClaw browser fill --fields '[{"ref":"1","type":"text","value":"Ada"}]'`
- `RadioClaw browser dialog --accept`
- `RadioClaw browser wait --text "Done"`
- `RadioClaw browser wait "#main" --url "**/dash" --load networkidle --fn "window.ready===true"`
- `RadioClaw browser evaluate --fn '(el) => el.textContent' --ref 7`
- `RadioClaw browser highlight e12`
- `RadioClaw browser trace start`
- `RadioClaw browser trace stop`

State:

- `RadioClaw browser cookies`
- `RadioClaw browser cookies set session abc123 --url "https://example.com"`
- `RadioClaw browser cookies clear`
- `RadioClaw browser storage local get`
- `RadioClaw browser storage local set theme dark`
- `RadioClaw browser storage session clear`
- `RadioClaw browser set offline on`
- `RadioClaw browser set headers --headers-json '{"X-Debug":"1"}'`
- `RadioClaw browser set credentials user pass`
- `RadioClaw browser set credentials --clear`
- `RadioClaw browser set geo 37.7749 -122.4194 --origin "https://example.com"`
- `RadioClaw browser set geo --clear`
- `RadioClaw browser set media dark`
- `RadioClaw browser set timezone America/New_York`
- `RadioClaw browser set locale en-US`
- `RadioClaw browser set device "iPhone 14"`

Notes:

- `upload` and `dialog` are **arming** calls; run them before the click/press
  that triggers the chooser/dialog.
- Download and trace output paths are constrained to RadioClaw temp roots:
  - traces: `/tmp/RadioClaw` (fallback: `${os.tmpdir()}/RadioClaw`)
  - downloads: `/tmp/RadioClaw/downloads` (fallback: `${os.tmpdir()}/RadioClaw/downloads`)
- Upload paths are constrained to an RadioClaw temp uploads root:
  - uploads: `/tmp/RadioClaw/uploads` (fallback: `${os.tmpdir()}/RadioClaw/uploads`)
- `upload` can also set file inputs directly via `--input-ref` or `--element`.
- `snapshot`:
  - `--format ai` (default when Playwright is installed): returns an AI snapshot with numeric refs (`aria-ref="<n>"`).
  - `--format aria`: returns the accessibility tree (no refs; inspection only).
  - `--efficient` (or `--mode efficient`): compact role snapshot preset (interactive + compact + depth + lower maxChars).
  - Config default (tool/CLI only): set `browser.snapshotDefaults.mode: "efficient"` to use efficient snapshots when the caller does not pass a mode (see [Gateway configuration](/gateway/configuration#browser-RadioClaw-managed-browser)).
  - Role snapshot options (`--interactive`, `--compact`, `--depth`, `--selector`) force a role-based snapshot with refs like `ref=e12`.
  - `--frame "<iframe selector>"` scopes role snapshots to an iframe (pairs with role refs like `e12`).
  - `--interactive` outputs a flat, easy-to-pick list of interactive elements (best for driving actions).
  - `--labels` adds a viewport-only screenshot with overlayed ref labels (prints `MEDIA:<path>`).
- `click`/`type`/etc require a `ref` from `snapshot` (either numeric `12` or role ref `e12`).
  CSS selectors are intentionally not supported for actions.

## Snapshots and refs

RadioClaw supports two â€œsnapshotâ€?styles:

- **AI snapshot (numeric refs)**: `RadioClaw browser snapshot` (default; `--format ai`)
  - Output: a text snapshot that includes numeric refs.
  - Actions: `RadioClaw browser click 12`, `RadioClaw browser type 23 "hello"`.
  - Internally, the ref is resolved via Playwrightâ€™s `aria-ref`.

- **Role snapshot (role refs like `e12`)**: `RadioClaw browser snapshot --interactive` (or `--compact`, `--depth`, `--selector`, `--frame`)
  - Output: a role-based list/tree with `[ref=e12]` (and optional `[nth=1]`).
  - Actions: `RadioClaw browser click e12`, `RadioClaw browser highlight e12`.
  - Internally, the ref is resolved via `getByRole(...)` (plus `nth()` for duplicates).
  - Add `--labels` to include a viewport screenshot with overlayed `e12` labels.

Ref behavior:

- Refs are **not stable across navigations**; if something fails, re-run `snapshot` and use a fresh ref.
- If the role snapshot was taken with `--frame`, role refs are scoped to that iframe until the next role snapshot.

## Wait power-ups

You can wait on more than just time/text:

- Wait for URL (globs supported by Playwright):
  - `RadioClaw browser wait --url "**/dash"`
- Wait for load state:
  - `RadioClaw browser wait --load networkidle`
- Wait for a JS predicate:
  - `RadioClaw browser wait --fn "window.ready===true"`
- Wait for a selector to become visible:
  - `RadioClaw browser wait "#main"`

These can be combined:

```bash
RadioClaw browser wait "#main" \
  --url "**/dash" \
  --load networkidle \
  --fn "window.ready===true" \
  --timeout-ms 15000
```

## Debug workflows

When an action fails (e.g. â€œnot visibleâ€? â€œstrict mode violationâ€? â€œcoveredâ€?:

1. `RadioClaw browser snapshot --interactive`
2. Use `click <ref>` / `type <ref>` (prefer role refs in interactive mode)
3. If it still fails: `RadioClaw browser highlight <ref>` to see what Playwright is targeting
4. If the page behaves oddly:
   - `RadioClaw browser errors --clear`
   - `RadioClaw browser requests --filter api --clear`
5. For deep debugging: record a trace:
   - `RadioClaw browser trace start`
   - reproduce the issue
   - `RadioClaw browser trace stop` (prints `TRACE:<path>`)

## JSON output

`--json` is for scripting and structured tooling.

Examples:

```bash
RadioClaw browser status --json
RadioClaw browser snapshot --interactive --json
RadioClaw browser requests --filter api --json
RadioClaw browser cookies --json
```

Role snapshots in JSON include `refs` plus a small `stats` block (lines/chars/refs/interactive) so tools can reason about payload size and density.

## State and environment knobs

These are useful for â€œmake the site behave like Xâ€?workflows:

- Cookies: `cookies`, `cookies set`, `cookies clear`
- Storage: `storage local|session get|set|clear`
- Offline: `set offline on|off`
- Headers: `set headers --headers-json '{"X-Debug":"1"}'` (legacy `set headers --json '{"X-Debug":"1"}'` remains supported)
- HTTP basic auth: `set credentials user pass` (or `--clear`)
- Geolocation: `set geo <lat> <lon> --origin "https://example.com"` (or `--clear`)
- Media: `set media dark|light|no-preference|none`
- Timezone / locale: `set timezone ...`, `set locale ...`
- Device / viewport:
  - `set device "iPhone 14"` (Playwright device presets)
  - `set viewport 1280 720`

## Security & privacy

- The RadioClaw browser profile may contain logged-in sessions; treat it as sensitive.
- `browser act kind=evaluate` / `RadioClaw browser evaluate` and `wait --fn`
  execute arbitrary JavaScript in the page context. Prompt injection can steer
  this. Disable it with `browser.evaluateEnabled=false` if you do not need it.
- For logins and anti-bot notes (X/Twitter, etc.), see [Browser login + X/Twitter posting](/tools/browser-login).
- Keep the Gateway/node host private (loopback or tailnet-only).
- Remote CDP endpoints are powerful; tunnel and protect them.

Strict-mode example (block private/internal destinations by default):

```json5
{
  browser: {
    ssrfPolicy: {
      dangerouslyAllowPrivateNetwork: false,
      hostnameAllowlist: ["*.example.com", "example.com"],
      allowedHostnames: ["localhost"], // optional exact allow
    },
  },
}
```

## Troubleshooting

For Linux-specific issues (especially snap Chromium), see
[Browser troubleshooting](/tools/browser-linux-troubleshooting).

## Agent tools + how control works

The agent gets **one tool** for browser automation:

- `browser` â€?status/start/stop/tabs/open/focus/close/snapshot/screenshot/navigate/act

How it maps:

- `browser snapshot` returns a stable UI tree (AI or ARIA).
- `browser act` uses the snapshot `ref` IDs to click/type/drag/select.
- `browser screenshot` captures pixels (full page or element).
- `browser` accepts:
  - `profile` to choose a named browser profile (RadioClaw, chrome, or remote CDP).
  - `target` (`sandbox` | `host` | `node`) to select where the browser lives.
  - In sandboxed sessions, `target: "host"` requires `agents.defaults.sandbox.browser.allowHostControl=true`.
  - If `target` is omitted: sandboxed sessions default to `sandbox`, non-sandbox sessions default to `host`.
  - If a browser-capable node is connected, the tool may auto-route to it unless you pin `target="host"` or `target="node"`.

This keeps the agent deterministic and avoids brittle selectors.
