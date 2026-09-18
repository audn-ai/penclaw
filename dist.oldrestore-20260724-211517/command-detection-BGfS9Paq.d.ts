import { s as CommandNormalizeOptions } from "./commands-registry.types-Cxf8RKoB.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/command-detection.d.ts
/** Returns true when text starts with a configured control command alias. */
declare function hasControlCommand(
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
): boolean;
/** Returns true for exact control commands or abort triggers after metadata stripping. */
declare function isControlCommandMessage(
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
): boolean;
/**
 * Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
 * can decide whether to compute CommandAuthorized for a message.
 *
 * This intentionally errs on the side of false positives; CommandAuthorized only gates
 * command/directive execution, not normal chat replies.
 */
declare function hasInlineCommandTokens(text?: string): boolean;
/** Returns true when a message may need command authorization metadata. */
declare function shouldComputeCommandAuthorized(
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
): boolean;
//#endregion
export {
  shouldComputeCommandAuthorized as i,
  hasInlineCommandTokens as n,
  isControlCommandMessage as r,
  hasControlCommand as t,
};
