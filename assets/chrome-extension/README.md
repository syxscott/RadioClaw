# RadioClaw Chrome Extension (Browser Relay)

Purpose: attach RadioClaw to an existing Chrome tab so the Gateway can automate it (via the local CDP relay server).

## Dev / load unpacked

1. Build/run RadioClaw Gateway with browser control enabled.
2. Ensure the relay server is reachable at `http://127.0.0.1:18792/` (default).
3. Install the extension to a stable path:

   ```bash
   RadioClaw browser extension install
   RadioClaw browser extension path
   ```

4. Chrome â†?`chrome://extensions` â†?enable â€œDeveloper modeâ€?
5. â€œLoad unpackedâ€?â†?select the path printed above.
6. Pin the extension. Click the icon on a tab to attach/detach.

## Options

- `Relay port`: defaults to `18792`.
- `Gateway token`: required. Set this to `gateway.auth.token` (or `RadioClaw_GATEWAY_TOKEN`).
