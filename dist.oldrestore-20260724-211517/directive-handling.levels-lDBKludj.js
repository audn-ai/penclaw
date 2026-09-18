import { i as normalizeFastMode } from "./string-coerce-DW4mBlAt.js";
import "./thinking-CVcRbjTC.js";
//#region src/auto-reply/reply/directive-handling.levels.ts
/** Resolves current directive levels from session, agent, and config defaults. */
async function resolveCurrentDirectiveLevels(params) {
  return {
    currentThinkLevel:
      params.sessionEntry?.thinkingLevel ??
      (await params.resolveDefaultThinkingLevel()) ??
      params.agentCfg?.thinkingDefault,
    currentFastMode:
      normalizeFastMode(params.sessionEntry?.fastMode) ??
      normalizeFastMode(params.agentEntry?.fastModeDefault),
    currentVerboseLevel: params.sessionEntry?.verboseLevel ?? params.agentCfg?.verboseDefault,
    currentReasoningLevel:
      params.sessionEntry?.reasoningLevel ??
      params.agentEntry?.reasoningDefault ??
      params.agentCfg?.reasoningDefault ??
      "off",
    currentElevatedLevel: params.sessionEntry?.elevatedLevel ?? params.agentCfg?.elevatedDefault,
  };
}
//#endregion
export { resolveCurrentDirectiveLevels as t };
