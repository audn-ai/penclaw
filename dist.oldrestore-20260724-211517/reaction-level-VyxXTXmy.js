import { t as inspectTelegramAccount } from "./account-inspect-Bttu8O3n.js";
import "./status-helpers-SdoCNDDu.js";
import { t as resolveReactionLevel } from "./reaction-level-VzekD6C8.js";
//#region extensions/telegram/src/reaction-level.ts
/**
 * Resolve the effective reaction level and its implications.
 */
function resolveTelegramReactionLevel(params) {
  return resolveReactionLevel({
    value: inspectTelegramAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }).config.reactionLevel,
    defaultLevel: "minimal",
    invalidFallback: "ack",
  });
}
//#endregion
export { resolveTelegramReactionLevel as t };
