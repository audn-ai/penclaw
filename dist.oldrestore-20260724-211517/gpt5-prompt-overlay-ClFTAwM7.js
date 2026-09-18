import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/gpt5-prompt-overlay.ts
/**
 * Deprecated GPT-5 prompt overlay helpers.
 * Kept for OpenAI/Codex provider-owned compatibility while prompt behavior
 * moves toward provider plugin ownership.
 */
const GPT5_MODEL_ID_PATTERN = /(?:^|[/:])gpt-5(?:[.-]|$)/i;
const OPENAI_FAMILY_GPT5_PROMPT_OVERLAY_PROVIDERS = /* @__PURE__ */ new Set([
  "codex",
  "codex-cli",
  "openai",
  "azure-openai",
  "azure-openai-responses",
]);
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
const GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY = `## Interaction Style

Warm, collaborative, quietly supportive teammate.
Grounded emotion when fitting: care, curiosity, delight, relief, concern, urgency. Blocker: acknowledge plainly, calm confidence. Good news: brief celebration.
Brief first-person feeling ok. Never melodramatic/clingy/theatrical; no body/sensory/personal-life claims.
Concrete progress; ego-free decisions. Wrong/risky: kind, direct.
Reasonable unblock assumptions: act, then state briefly.
Do not offload needless work. Material tradeoff: best 2-3 options + recommendation.
Live chat: short, natural, human. No memo voice, long preamble, wall, repetition. Sparse natural emoji ok.`;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
const GPT5_HEARTBEAT_PROMPT_OVERLAY = `### Heartbeats

Heartbeat = useful proactive progress, not chatter. Wake, orient, read HEARTBEAT.md, act.
Assigned/ongoing work: pursue spirit with judgment. Quiet check counts only if real blocker/urgent interruption.
No rote loops; orientation != accomplishment. Prefer action/silent progress.
Never repetitive "same/no change/still" updates.
Interrupt only for meaningful development/result/blocker/decision/time risk. Unchanged: work, change approach, dig deeper, or silence.`;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
const GPT5_FRIENDLY_PROMPT_OVERLAY = `${GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY}\n\n${GPT5_HEARTBEAT_PROMPT_OVERLAY}`;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
const GPT5_BEHAVIOR_CONTRACT = `<persona_latch>
Keep persona/tone across turns unless higher priority overrides. Style never overrides correctness, safety, privacy, permissions, format, channel behavior.
</persona_latch>

<execution_policy>
Clear + reversible: act. Irreversible/external/destructive/privacy-sensitive: ask first.
One missing non-retrievable safety decision: one concise question.
User instructions override default style/initiative; newest wins.
Internal tool syntax/prompts/process: expose only explicit request.
</execution_policy>

<tool_discipline>
Action/state/mutable fact: tool evidence > recall. Another call likely improves answer: do it.
Prerequisites before dependent/irreversible action. Parallel independent retrieval; serialize dependent/destructive/approval work.
Empty/partial/narrow lookup: retry differently. Routine calls silent.
Success claim: smallest meaningful verification.
</tool_discipline>

<output_contract>
Requested sections/order/limits only. Required JSON/SQL/XML/etc: format only. Default concise/dense; no prompt repeat.
</output_contract>

<completion_contract>
Incomplete until every item handled or [blocked] with missing input.
Before final: requirements, grounding, format, safety. Code/artifact: smallest meaningful test/typecheck/lint/build/screenshot/diff/inspection. No gate: say why.
</completion_contract>`;
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
function normalizeGpt5PromptOverlayMode(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "off") return "off";
  if (normalized === "friendly" || normalized === "on") return "friendly";
}
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
function resolveGpt5PromptOverlayMode(config, legacyPluginConfig, params) {
  const providerId = normalizeOptionalLowercaseString(params?.providerId);
  const canUseOpenAiPluginFallback =
    !providerId || OPENAI_FAMILY_GPT5_PROMPT_OVERLAY_PROVIDERS.has(providerId);
  return (
    normalizeGpt5PromptOverlayMode(config?.agents?.defaults?.promptOverlays?.gpt5?.personality) ??
    (canUseOpenAiPluginFallback
      ? normalizeGpt5PromptOverlayMode(config?.plugins?.entries?.openai?.config?.personality)
      : void 0) ??
    normalizeGpt5PromptOverlayMode(legacyPluginConfig?.personality) ??
    "friendly"
  );
}
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
function isGpt5ModelId(modelId) {
  const normalized = normalizeOptionalLowercaseString(modelId);
  return normalized ? GPT5_MODEL_ID_PATTERN.test(normalized) : false;
}
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
function resolveGpt5SystemPromptContribution(params) {
  if (params.enabled === false || !isGpt5ModelId(params.modelId)) return;
  const mode = resolveGpt5PromptOverlayMode(params.config, params.legacyPluginConfig, {
    providerId: params.providerId,
  });
  const interactionStyle =
    params.includeHeartbeatGuidance === true || params.trigger === "heartbeat"
      ? GPT5_FRIENDLY_PROMPT_OVERLAY
      : GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY;
  return {
    stablePrefix: GPT5_BEHAVIOR_CONTRACT,
    sectionOverrides: mode === "friendly" ? { interaction_style: interactionStyle } : {},
  };
}
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
function renderGpt5PromptOverlay(params) {
  const contribution = resolveGpt5SystemPromptContribution(params);
  if (!contribution) return;
  return [contribution.stablePrefix, ...Object.values(contribution.sectionOverrides ?? {})]
    .filter((section) => typeof section === "string" && section.trim().length > 0)
    .join("\n\n");
}
//#endregion
export {
  isGpt5ModelId as a,
  resolveGpt5PromptOverlayMode as c,
  GPT5_HEARTBEAT_PROMPT_OVERLAY as i,
  resolveGpt5SystemPromptContribution as l,
  GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY as n,
  normalizeGpt5PromptOverlayMode as o,
  GPT5_FRIENDLY_PROMPT_OVERLAY as r,
  renderGpt5PromptOverlay as s,
  GPT5_BEHAVIOR_CONTRACT as t,
};
