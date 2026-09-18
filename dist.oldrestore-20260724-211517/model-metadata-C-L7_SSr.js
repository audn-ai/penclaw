import { u as supportsClaudeAdaptiveThinking } from "./src-Dcc_hMY6.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-model-shared-CYlCpWlu.js";
//#region extensions/github-copilot/model-metadata.ts
const COPILOT_CHAT_COMPLETIONS_COMPAT = {
  supportsStore: false,
  supportsDeveloperRole: false,
  supportsUsageInStreaming: false,
  maxTokensField: "max_tokens",
};
const COPILOT_XHIGH_MODEL_IDS = /* @__PURE__ */ new Set(["gpt-5.4", "gpt-5.3-codex"]);
const STATIC_MODEL_OVERRIDES = /* @__PURE__ */ new Map([
  [
    "claude-opus-4.6-1m",
    {
      name: "Claude Opus 4.6 (1M context)",
      api: "anthropic-messages",
      reasoning: true,
      contextWindow: 1e6,
      maxTokens: 64e3,
      thinkingLevelMap: {
        xhigh: null,
        max: null,
      },
      compat: { supportedReasoningEfforts: ["low", "medium", "high"] },
    },
  ],
  [
    "claude-opus-4.7-1m-internal",
    {
      name: "Claude Opus 4.7 (1M context)",
      api: "anthropic-messages",
      reasoning: true,
      contextWindow: 1e6,
      maxTokens: 64e3,
      thinkingLevelMap: {
        xhigh: "xhigh",
        max: null,
      },
      compat: { supportedReasoningEfforts: ["low", "medium", "high", "xhigh"] },
    },
  ],
  [
    "gpt-5.5",
    {
      name: "GPT-5.5",
      reasoning: true,
      contextWindow: 4e5,
      contextTokens: 272e3,
      maxTokens: 128e3,
    },
  ],
]);
function isCopilotGeminiModelId(modelId) {
  return /(?:^|[-_.])gemini(?:$|[-_.])/.test(modelId);
}
function isCopilotClaude45ModelId(modelId) {
  return /^claude-(?:haiku|opus|sonnet)-4[.-]5(?:$|[-.])/.test(modelId);
}
function resolveCopilotTransportApi(modelId) {
  const normalized = normalizeOptionalLowercaseString(modelId) ?? "";
  if (normalized.includes("claude")) return "anthropic-messages";
  if (isCopilotGeminiModelId(normalized)) return "openai-completions";
  return "openai-responses";
}
function resolveCopilotModelCompat(modelId) {
  const normalized = normalizeOptionalLowercaseString(modelId) ?? "";
  if (isCopilotGeminiModelId(normalized)) return { ...COPILOT_CHAT_COMPLETIONS_COMPAT };
  if (isCopilotClaude45ModelId(normalized)) return { supportsEagerToolInputStreaming: false };
}
function compatSupportsEffort(compat, effort) {
  return (
    Array.isArray(compat?.supportedReasoningEfforts) &&
    compat.supportedReasoningEfforts.some(
      (candidate) => normalizeOptionalLowercaseString(candidate) === effort,
    )
  );
}
function resolveCopilotExtendedThinkingLevels(modelId, compat) {
  const normalizedModelId = normalizeOptionalLowercaseString(modelId) ?? "";
  const staticCompat = resolveStaticCopilotModelOverride(normalizedModelId)?.compat;
  const isClaudeModel = normalizedModelId.includes("claude");
  const supportsAdaptiveClaudeEffort =
    !isClaudeModel || supportsClaudeAdaptiveThinking({ id: normalizedModelId });
  const levels = [];
  if (
    supportsAdaptiveClaudeEffort &&
    (COPILOT_XHIGH_MODEL_IDS.has(normalizedModelId) ||
      compatSupportsEffort(compat, "xhigh") ||
      compatSupportsEffort(staticCompat, "xhigh"))
  )
    levels.push("xhigh");
  if (
    isClaudeModel &&
    supportsAdaptiveClaudeEffort &&
    (compatSupportsEffort(compat, "max") || compatSupportsEffort(staticCompat, "max"))
  )
    levels.push("max");
  return levels;
}
function resolveStaticCopilotModelOverride(modelId) {
  return STATIC_MODEL_OVERRIDES.get(normalizeOptionalLowercaseString(modelId) ?? "");
}
//#endregion
export {
  resolveStaticCopilotModelOverride as i,
  resolveCopilotModelCompat as n,
  resolveCopilotTransportApi as r,
  resolveCopilotExtendedThinkingLevels as t,
};
