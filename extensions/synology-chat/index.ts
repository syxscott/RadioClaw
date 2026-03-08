import type { RadioClawPluginApi } from "RadioClaw/plugin-sdk/synology-chat";
import { emptyPluginConfigSchema } from "RadioClaw/plugin-sdk/synology-chat";
import { createSynologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for RadioClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: RadioClawPluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: createSynologyChatPlugin() });
  },
};

export default plugin;
