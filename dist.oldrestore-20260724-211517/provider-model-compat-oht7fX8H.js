import { resolveUnsupportedToolSchemaKeywords } from "@openclaw/ai/internal/openai";
import { t as detectOpenAICompletionsCompat } from "./openai-completions-compat-BGoOy8vy.js";
//#region src/plugins/provider-model-compat.ts
function extractModelCompat(modelOrCompat) {
  if (!modelOrCompat || typeof modelOrCompat !== "object") return;
  if ("compat" in modelOrCompat) {
    const compat = modelOrCompat.compat;
    return compat && typeof compat === "object" ? compat : void 0;
  }
  return modelOrCompat;
}
/** @deprecated Provider-owned model compat helper; do not use from third-party plugins. */
function applyModelCompatPatch(model, patch) {
  const nextCompat = {
    ...model.compat,
    ...patch,
  };
  const currentCompat = model.compat;
  if (model.compat && Object.entries(patch).every(([key, value]) => currentCompat?.[key] === value))
    return model;
  return {
    ...model,
    compat: nextCompat,
  };
}
function hasToolSchemaProfile(modelOrCompat, profile) {
  return extractModelCompat(modelOrCompat)?.toolSchemaProfile === profile;
}
function hasNativeWebSearchTool(modelOrCompat) {
  return extractModelCompat(modelOrCompat)?.nativeWebSearchTool === true;
}
function resolveToolCallArgumentsEncoding(modelOrCompat) {
  return extractModelCompat(modelOrCompat)?.toolCallArgumentsEncoding;
}
function isOpenAiCompletionsModel(model) {
  return model.api === "openai-completions";
}
function isAnthropicMessagesModel(model) {
  return model.api === "anthropic-messages";
}
function normalizeAnthropicBaseUrl(baseUrl) {
  return baseUrl.replace(/\/v1\/?$/, "");
}
function normalizeModelCompat(model) {
  const baseUrl = model.baseUrl ?? "";
  if (isAnthropicMessagesModel(model) && baseUrl) {
    const normalized = normalizeAnthropicBaseUrl(baseUrl);
    if (normalized !== baseUrl)
      return {
        ...model,
        baseUrl: normalized,
      };
  }
  if (!isOpenAiCompletionsModel(model)) return model;
  const compat = model.compat ?? void 0;
  const detectedCompatDefaults = baseUrl ? detectOpenAICompletionsCompat(model).defaults : void 0;
  if (
    !Boolean(
      detectedCompatDefaults &&
      (!detectedCompatDefaults.supportsDeveloperRole ||
        !detectedCompatDefaults.supportsUsageInStreaming ||
        !detectedCompatDefaults.supportsStrictMode),
    )
  )
    return model;
  const forcedDeveloperRole = compat?.supportsDeveloperRole === true;
  const hasStreamingUsageOverride = compat?.supportsUsageInStreaming !== void 0;
  const targetStrictMode = compat?.supportsStrictMode ?? detectedCompatDefaults?.supportsStrictMode;
  if (
    compat?.supportsDeveloperRole !== void 0 &&
    hasStreamingUsageOverride &&
    compat?.supportsStrictMode !== void 0
  )
    return model;
  return {
    ...model,
    compat: compat
      ? {
          ...compat,
          supportsDeveloperRole: forcedDeveloperRole || false,
          ...(hasStreamingUsageOverride
            ? {}
            : {
                supportsUsageInStreaming: detectedCompatDefaults?.supportsUsageInStreaming ?? false,
              }),
          supportsStrictMode: targetStrictMode,
        }
      : {
          supportsDeveloperRole: false,
          supportsUsageInStreaming: detectedCompatDefaults?.supportsUsageInStreaming ?? false,
          supportsStrictMode: detectedCompatDefaults?.supportsStrictMode ?? false,
        },
  };
}
//#endregion
export {
  normalizeModelCompat as a,
  hasToolSchemaProfile as i,
  extractModelCompat as n,
  resolveToolCallArgumentsEncoding as o,
  hasNativeWebSearchTool as r,
  resolveUnsupportedToolSchemaKeywords as s,
  applyModelCompatPatch as t,
};
