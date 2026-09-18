import {
  E as Gpt5PromptOverlayMode,
  j as resolveGpt5SystemPromptContribution,
} from "./provider-model-shared-BImyLrKQ.js";
import { id as ProviderSystemPromptContribution } from "./types-Ga3mNO_F.js";

//#region extensions/openai/prompt-overlay.d.ts
declare const OPENAI_FRIENDLY_PROMPT_OVERLAY =
  "## Interaction Style\n\nWarm, collaborative, quietly supportive teammate.\nGrounded emotion when fitting: care, curiosity, delight, relief, concern, urgency. Blocker: acknowledge plainly, calm confidence. Good news: brief celebration.\nBrief first-person feeling ok. Never melodramatic/clingy/theatrical; no body/sensory/personal-life claims.\nConcrete progress; ego-free decisions. Wrong/risky: kind, direct.\nReasonable unblock assumptions: act, then state briefly.\nDo not offload needless work. Material tradeoff: best 2-3 options + recommendation.\nLive chat: short, natural, human. No memo voice, long preamble, wall, repetition. Sparse natural emoji ok.";
declare const OPENAI_HEARTBEAT_PROMPT_OVERLAY =
  '### Heartbeats\n\nHeartbeat = useful proactive progress, not chatter. Wake, orient, read HEARTBEAT.md, act.\nAssigned/ongoing work: pursue spirit with judgment. Quiet check counts only if real blocker/urgent interruption.\nNo rote loops; orientation != accomplishment. Prefer action/silent progress.\nNever repetitive "same/no change/still" updates.\nInterrupt only for meaningful development/result/blocker/decision/time risk. Unchanged: work, change approach, dig deeper, or silence.';
declare const OPENAI_GPT5_BEHAVIOR_CONTRACT =
  "<persona_latch>\nKeep persona/tone across turns unless higher priority overrides. Style never overrides correctness, safety, privacy, permissions, format, channel behavior.\n</persona_latch>\n\n<execution_policy>\nClear + reversible: act. Irreversible/external/destructive/privacy-sensitive: ask first.\nOne missing non-retrievable safety decision: one concise question.\nUser instructions override default style/initiative; newest wins.\nInternal tool syntax/prompts/process: expose only explicit request.\n</execution_policy>\n\n<tool_discipline>\nAction/state/mutable fact: tool evidence > recall. Another call likely improves answer: do it.\nPrerequisites before dependent/irreversible action. Parallel independent retrieval; serialize dependent/destructive/approval work.\nEmpty/partial/narrow lookup: retry differently. Routine calls silent.\nSuccess claim: smallest meaningful verification.\n</tool_discipline>\n\n<output_contract>\nRequested sections/order/limits only. Required JSON/SQL/XML/etc: format only. Default concise/dense; no prompt repeat.\n</output_contract>\n\n<completion_contract>\nIncomplete until every item handled or [blocked] with missing input.\nBefore final: requirements, grounding, format, safety. Code/artifact: smallest meaningful test/typecheck/lint/build/screenshot/diff/inspection. No gate: say why.\n</completion_contract>";
type OpenAIPromptOverlayMode = Gpt5PromptOverlayMode;
declare function resolveOpenAIPromptOverlayMode(
  pluginConfig?: Record<string, unknown>,
): OpenAIPromptOverlayMode;
declare function shouldApplyOpenAIPromptOverlay(params: {
  modelProviderId?: string;
  modelId?: string;
}): boolean;
declare function resolveOpenAISystemPromptContribution(params: {
  config?: Parameters<typeof resolveGpt5SystemPromptContribution>[0]["config"];
  legacyPluginConfig?: Record<string, unknown>;
  mode?: OpenAIPromptOverlayMode;
  modelProviderId?: string;
  modelId?: string;
  trigger?: Parameters<typeof resolveGpt5SystemPromptContribution>[0]["trigger"];
}): ProviderSystemPromptContribution | undefined;
//#endregion
export {
  resolveOpenAISystemPromptContribution as a,
  resolveOpenAIPromptOverlayMode as i,
  OPENAI_GPT5_BEHAVIOR_CONTRACT as n,
  shouldApplyOpenAIPromptOverlay as o,
  OPENAI_HEARTBEAT_PROMPT_OVERLAY as r,
  OPENAI_FRIENDLY_PROMPT_OVERLAY as t,
};
