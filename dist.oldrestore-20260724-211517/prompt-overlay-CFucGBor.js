import {
  i as GPT5_HEARTBEAT_PROMPT_OVERLAY,
  l as resolveGpt5SystemPromptContribution,
  t as GPT5_BEHAVIOR_CONTRACT,
} from "./gpt5-prompt-overlay-ClFTAwM7.js";
import "./provider-model-shared-CYlCpWlu.js";
//#region extensions/codex/prompt-overlay.ts
/**
 * Codex prompt-overlay facade for GPT-5 behavior and heartbeat guidance.
 */
/** GPT-5 behavior contract re-exported under the Codex provider namespace. */
const CODEX_GPT5_BEHAVIOR_CONTRACT = GPT5_BEHAVIOR_CONTRACT;
/** Heartbeat prompt overlay re-exported under the Codex provider namespace. */
const CODEX_GPT5_HEARTBEAT_PROMPT_OVERLAY = GPT5_HEARTBEAT_PROMPT_OVERLAY;
/** Resolves the Codex system-prompt contribution for GPT-5-family models. */
function resolveCodexSystemPromptContribution(params) {
  return resolveGpt5SystemPromptContribution(params);
}
//#endregion
export {
  CODEX_GPT5_HEARTBEAT_PROMPT_OVERLAY as n,
  resolveCodexSystemPromptContribution as r,
  CODEX_GPT5_BEHAVIOR_CONTRACT as t,
};
