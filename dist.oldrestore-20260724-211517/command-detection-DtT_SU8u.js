import { r as isAbortTrigger } from "./abort-primitives-CsS4KkjK.js";
import { r as matchPluginCommand } from "./commands-E5FKOfF0.js";
import {
  n as listChatCommands,
  r as listChatCommandsForConfig,
} from "./commands-registry-list-dryYO7Ry.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-C6c5CQe0.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
//#region src/auto-reply/command-detection.ts
/** Command detectors used by inbound authorization and control-command routing. */
/** Returns true when text starts with a configured control command alias. */
function hasControlCommand(text, cfg, options) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  const stripped = stripInboundMetadata(trimmed);
  if (!stripped) return false;
  const normalizedBody = normalizeCommandBody(stripped, options);
  if (!normalizedBody) return false;
  const lowered = normalizeLowercaseStringOrEmpty(normalizedBody);
  const commands = cfg ? listChatCommandsForConfig(cfg) : listChatCommands();
  for (const command of commands)
    for (const alias of command.textAliases) {
      const normalized = normalizeOptionalLowercaseString(alias);
      if (!normalized) continue;
      if (lowered === normalized) return true;
      if (command.acceptsArgs && lowered.startsWith(normalized)) {
        const nextChar = normalizedBody.charAt(normalized.length);
        if (nextChar && /\s/.test(nextChar)) return true;
      }
    }
  return false;
}
/** Returns true for exact control commands or abort triggers after metadata stripping. */
function isControlCommandMessage(text, cfg, options) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (hasControlCommand(trimmed, cfg, options)) return true;
  return isAbortTrigger(
    normalizeOptionalLowercaseString(
      normalizeCommandBody(stripInboundMetadata(trimmed), options),
    ) ?? "",
  );
}
/**
 * Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
 * can decide whether to compute CommandAuthorized for a message.
 *
 * This intentionally errs on the side of false positives; CommandAuthorized only gates
 * command/directive execution, not normal chat replies.
 */
function hasInlineCommandTokens(text) {
  const body = text ?? "";
  if (!body.trim()) return false;
  return /(?:^|\s)[/!][a-z]/i.test(body);
}
function hasSpacedPluginCommand(text) {
  const commandBody = text?.match(/(?:^|\s)(\/\s+[a-z][\s\S]*)/i)?.[1];
  return commandBody ? matchPluginCommand(commandBody) !== null : false;
}
/** Returns true when a message may need command authorization metadata. */
function shouldComputeCommandAuthorized(text, cfg, options) {
  return (
    isControlCommandMessage(text, cfg, options) ||
    hasInlineCommandTokens(text) ||
    hasSpacedPluginCommand(text)
  );
}
//#endregion
export {
  shouldComputeCommandAuthorized as i,
  hasInlineCommandTokens as n,
  isControlCommandMessage as r,
  hasControlCommand as t,
};
