---
summary: "Messaging platforms RadioClaw can connect to"
read_when:
  - You want to choose a chat channel for RadioClaw
  - You need a quick overview of supported messaging platforms
title: "Chat Channels"
---

# Chat Channels

RadioClaw can talk to you on any chat app you already use. Each channel connects via the Gateway.
Text is supported everywhere; media and reactions vary by channel.

## Supported channels

- [BlueBubbles](/channels/bluebubbles) â€?**Recommended for iMessage**; uses the BlueBubbles macOS server REST API with full feature support (edit, unsend, effects, reactions, group management â€?edit currently broken on macOS 26 Tahoe).
- [Discord](/channels/discord) â€?Discord Bot API + Gateway; supports servers, channels, and DMs.
- [Feishu](/channels/feishu) â€?Feishu/Lark bot via WebSocket (plugin, installed separately).
- [Google Chat](/channels/googlechat) â€?Google Chat API app via HTTP webhook.
- [iMessage (legacy)](/channels/imessage) â€?Legacy macOS integration via imsg CLI (deprecated, use BlueBubbles for new setups).
- [IRC](/channels/irc) â€?Classic IRC servers; channels + DMs with pairing/allowlist controls.
- [LINE](/channels/line) â€?LINE Messaging API bot (plugin, installed separately).
- [Matrix](/channels/matrix) â€?Matrix protocol (plugin, installed separately).
- [Mattermost](/channels/mattermost) â€?Bot API + WebSocket; channels, groups, DMs (plugin, installed separately).
- [Microsoft Teams](/channels/msteams) â€?Bot Framework; enterprise support (plugin, installed separately).
- [Nextcloud Talk](/channels/nextcloud-talk) â€?Self-hosted chat via Nextcloud Talk (plugin, installed separately).
- [Nostr](/channels/nostr) â€?Decentralized DMs via NIP-04 (plugin, installed separately).
- [Signal](/channels/signal) â€?signal-cli; privacy-focused.
- [Synology Chat](/channels/synology-chat) â€?Synology NAS Chat via outgoing+incoming webhooks (plugin, installed separately).
- [Slack](/channels/slack) â€?Bolt SDK; workspace apps.
- [Telegram](/channels/telegram) â€?Bot API via grammY; supports groups.
- [Tlon](/channels/tlon) â€?Urbit-based messenger (plugin, installed separately).
- [Twitch](/channels/twitch) â€?Twitch chat via IRC connection (plugin, installed separately).
- [WebChat](/web/webchat) â€?Gateway WebChat UI over WebSocket.
- [WhatsApp](/channels/whatsapp) â€?Most popular; uses Baileys and requires QR pairing.
- [Zalo](/channels/zalo) â€?Zalo Bot API; Vietnam's popular messenger (plugin, installed separately).
- [Zalo Personal](/channels/zalouser) â€?Zalo personal account via QR login (plugin, installed separately).

## Notes

- Channels can run simultaneously; configure multiple and RadioClaw will route per chat.
- Fastest setup is usually **Telegram** (simple bot token). WhatsApp requires QR pairing and
  stores more state on disk.
- Group behavior varies by channel; see [Groups](/channels/groups).
- DM pairing and allowlists are enforced for safety; see [Security](/gateway/security).
- Troubleshooting: [Channel troubleshooting](/channels/troubleshooting).
- Model providers are documented separately; see [Model Providers](/providers/models).
