import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/config/logging.d.ts
type LogConfigUpdatedOptions = {
  path?: string;
  backupPath?: string | false;
  suffix?: string;
};
/** Formats a config path for operator-facing log output. */
/** Emits the standard config-updated message through the active runtime logger. */
declare function logConfigUpdated(runtime: RuntimeEnv, opts?: LogConfigUpdatedOptions): void;
//#endregion
//#region src/commands/models/shared.d.ts
/** Runtime config snapshot supplied to model config mutators. */
type UpdateConfigContext = {
  runtimeConfig: OpenClawConfig;
};
/** Reads source config, applies a mutator, and writes only the source-form config. */
declare function updateConfig(
  mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig,
): Promise<OpenClawConfig>;
//#endregion
export { logConfigUpdated as n, updateConfig as t };
