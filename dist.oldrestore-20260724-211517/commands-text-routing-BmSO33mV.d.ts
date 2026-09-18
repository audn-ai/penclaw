import {
  o as CommandDetection,
  s as CommandNormalizeOptions,
  t as ChatCommandDefinition,
  u as ShouldHandleTextCommandsParams,
} from "./commands-registry.types-Cxf8RKoB.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/commands-registry-normalize.d.ts
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
/** Returns cached exact and regex detectors for the current command registry instance. */
declare function getCommandDetection(_cfg?: OpenClawConfig): CommandDetection;
/** Resolves a raw text command to the matching normalized alias when known. */
declare function maybeResolveTextAlias(raw: string, cfg?: OpenClawConfig): string | null;
/** Resolves a raw text command into its command definition and raw argument tail. */
declare function resolveTextCommand(
  raw: string,
  cfg?: OpenClawConfig,
): {
  command: ChatCommandDefinition;
  args?: string;
} | null;
//#endregion
//#region src/auto-reply/commands-text-routing.d.ts
/** Returns whether a surface can receive provider-native slash commands. */
declare function isNativeCommandSurface(surface?: string): boolean;
/** Decides whether text slash commands remain active for the current surface/config pair. */
declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
//#endregion
export {
  normalizeCommandBody as a,
  maybeResolveTextAlias as i,
  shouldHandleTextCommands as n,
  resolveTextCommand as o,
  getCommandDetection as r,
  isNativeCommandSurface as t,
};
