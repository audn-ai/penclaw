import { t as hasControlCommand } from "./command-detection-DtT_SU8u.js";
import { t as isCommandEnabled } from "./commands-registry-list-dryYO7Ry.js";
import { n as maybeResolveTextAlias } from "./commands-registry-normalize-C6c5CQe0.js";
import { n as shouldHandleTextCommands } from "./commands-text-routing-iDHdTNyq.js";
import { n as resolveCommandContextText } from "./context-text-DMuk8Wh5.js";
//#region src/auto-reply/reply/dispatch-acp-command-bypass.ts
function isResetCommandCandidate(text) {
  return /^\/(?:new|reset)(?:\s|$)/i.test(text);
}
function isAcpCommandCandidate(text) {
  return /^\/acp(?:\s|$)/i.test(text);
}
function isLocalCommandCandidate(text, cfg) {
  return hasControlCommand(text, cfg);
}
function shouldBypassAcpDispatchForCommand(ctx, cfg) {
  const candidate = resolveCommandContextText(ctx);
  if (!candidate) return false;
  const normalized = candidate.trim();
  const allowTextCommands = shouldHandleTextCommands({
    cfg,
    surface: ctx.Surface ?? ctx.Provider ?? "",
    commandSource: ctx.CommandSource,
  });
  if (!normalized.startsWith("/") && maybeResolveTextAlias(candidate, cfg) != null)
    return allowTextCommands;
  if (isResetCommandCandidate(normalized)) return true;
  if (isAcpCommandCandidate(normalized)) return true;
  if (isLocalCommandCandidate(normalized, cfg)) return allowTextCommands;
  if (!normalized.startsWith("!")) return false;
  if (!ctx.CommandAuthorized) return false;
  if (!isCommandEnabled(cfg, "bash")) return false;
  return allowTextCommands;
}
//#endregion
export { shouldBypassAcpDispatchForCommand };
