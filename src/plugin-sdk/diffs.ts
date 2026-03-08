// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export type { RadioClawConfig } from "../config/config.js";
export { resolvePreferredRadioClawTmpDir } from "../infra/tmp-RadioClaw-dir.js";
export type {
  AnyAgentTool,
  RadioClawPluginApi,
  RadioClawPluginConfigSchema,
  PluginLogger,
} from "../plugins/types.js";
