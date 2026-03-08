import type {
  AnyAgentTool,
  RadioClawPluginApi,
  RadioClawPluginToolFactory,
} from "RadioClaw/plugin-sdk/lobster";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: RadioClawPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as RadioClawPluginToolFactory,
    { optional: true },
  );
}
