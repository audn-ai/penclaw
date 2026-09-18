import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/llm/providers/stream-wrappers/moonshot-thinking.ts
const MOONSHOT_THINKING_KEEP_MODEL_ID = "kimi-k2.6";
const MOONSHOT_ALWAYS_THINKING_MODEL_ID = "kimi-k2.7-code";
const MOONSHOT_FIXED_SAMPLING_FIELDS = [
  "temperature",
  "top_p",
  "n",
  "presence_penalty",
  "frequency_penalty",
];
const llmRuntimeLoader = createLazyImportLoader(() => import("./plugin-sdk/llm.js"));
async function loadDefaultStreamFn() {
  return (await llmRuntimeLoader.load()).streamSimple;
}
function normalizeMoonshotThinkingType(value) {
  if (typeof value === "boolean") return value ? "enabled" : "disabled";
  if (typeof value === "string") {
    const normalized = normalizeOptionalLowercaseString(value);
    if (!normalized) return;
    if (["enabled", "enable", "on", "true"].includes(normalized)) return "enabled";
    if (["disabled", "disable", "off", "false"].includes(normalized)) return "disabled";
    return;
  }
  if (value && typeof value === "object" && !Array.isArray(value))
    return normalizeMoonshotThinkingType(value.type);
}
function normalizeMoonshotThinkingKeep(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const keepValue = value.keep;
  if (typeof keepValue !== "string") return;
  return normalizeOptionalLowercaseString(keepValue) === "all" ? "all" : void 0;
}
function isMoonshotToolChoiceCompatible(toolChoice) {
  if (toolChoice == null || toolChoice === "auto" || toolChoice === "none") return true;
  if (typeof toolChoice === "object" && !Array.isArray(toolChoice)) {
    const typeValue = toolChoice.type;
    return typeValue === "auto" || typeValue === "none";
  }
  return false;
}
function isPinnedToolChoice(toolChoice) {
  if (!toolChoice || typeof toolChoice !== "object" || Array.isArray(toolChoice)) return false;
  const typeValue = toolChoice.type;
  return typeValue === "tool" || typeValue === "function";
}
function asPayloadRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function ensureMoonshotToolCallReasoningContent(payloadObj) {
  if (!Array.isArray(payloadObj.messages)) return;
  for (const message of payloadObj.messages) {
    const record = asPayloadRecord(message);
    if (
      record?.role === "assistant" &&
      Array.isArray(record.tool_calls) &&
      record.tool_calls.length > 0 &&
      !("reasoning_content" in record)
    )
      record.reasoning_content = "";
  }
}
function sanitizeKimiK27Payload(payloadObj) {
  delete payloadObj.thinking;
  delete payloadObj.reasoning_effort;
  delete payloadObj.reasoningEffort;
  for (const field of MOONSHOT_FIXED_SAMPLING_FIELDS) delete payloadObj[field];
  if (!isMoonshotToolChoiceCompatible(payloadObj.tool_choice)) payloadObj.tool_choice = "auto";
}
function sanitizeKimiK27AfterCaller(value, fallbackPayload) {
  const finalPayload = asPayloadRecord(value) ?? fallbackPayload;
  sanitizeKimiK27Payload(finalPayload);
  ensureMoonshotToolCallReasoningContent(finalPayload);
  return value;
}
function finalizeMoonshotPayloadAfterCaller(value, fallbackPayload, thinkingEnabled) {
  if (thinkingEnabled)
    ensureMoonshotToolCallReasoningContent(asPayloadRecord(value) ?? fallbackPayload);
  return value;
}
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
function resolveMoonshotThinkingType(params) {
  const configured = normalizeMoonshotThinkingType(params.configuredThinking);
  if (configured) return configured;
  if (!params.thinkingLevel) return;
  return params.thinkingLevel === "off" ? "disabled" : "enabled";
}
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
function resolveMoonshotThinkingKeep(params) {
  return normalizeMoonshotThinkingKeep(params.configuredThinking);
}
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
function createMoonshotThinkingWrapper(baseStreamFn, thinkingType, thinkingKeep) {
  const wrap = (underlying) => (model, context, options) => {
    const modelId = model.id.trim().toLowerCase();
    const isKimiK27 = modelId === MOONSHOT_ALWAYS_THINKING_MODEL_ID;
    const streamModel = isKimiK27
      ? {
          ...model,
          reasoning: true,
        }
      : model;
    const streamOptions = isKimiK27
      ? {
          ...options,
          reasoning: "low",
        }
      : options;
    const originalOnPayload = streamOptions?.onPayload;
    return underlying(streamModel, context, {
      ...streamOptions,
      onPayload(payload, payloadModel) {
        const payloadObj = asPayloadRecord(payload);
        if (!payloadObj) return originalOnPayload?.(payload, payloadModel);
        const payloadModelId =
          typeof payloadObj.model === "string" ? payloadObj.model.trim().toLowerCase() : modelId;
        let effectiveThinkingType = normalizeMoonshotThinkingType(payloadObj.thinking);
        if (thinkingType) {
          payloadObj.thinking = { type: thinkingType };
          effectiveThinkingType = thinkingType;
        }
        if (payloadModelId === MOONSHOT_ALWAYS_THINKING_MODEL_ID) {
          sanitizeKimiK27Payload(payloadObj);
          const result = originalOnPayload?.(payload, payloadModel);
          if (result && typeof result.then === "function")
            return Promise.resolve(result).then((resolved) =>
              sanitizeKimiK27AfterCaller(resolved, payloadObj),
            );
          return sanitizeKimiK27AfterCaller(result, payloadObj);
        }
        if (
          effectiveThinkingType === "enabled" &&
          !isMoonshotToolChoiceCompatible(payloadObj.tool_choice)
        ) {
          if (payloadObj.tool_choice === "required") payloadObj.tool_choice = "auto";
          else if (isPinnedToolChoice(payloadObj.tool_choice)) {
            payloadObj.thinking = { type: "disabled" };
            effectiveThinkingType = "disabled";
          }
        }
        const isKeepCapableModel = payloadModelId === MOONSHOT_THINKING_KEEP_MODEL_ID;
        if (payloadObj.thinking && typeof payloadObj.thinking === "object") {
          const thinkingObj = payloadObj.thinking;
          if (isKeepCapableModel && effectiveThinkingType === "enabled" && thinkingKeep === "all")
            thinkingObj.keep = "all";
          else if ("keep" in thinkingObj) delete thinkingObj.keep;
        }
        const result = originalOnPayload?.(payload, payloadModel);
        const thinkingEnabled = effectiveThinkingType === "enabled";
        if (result && typeof result.then === "function")
          return Promise.resolve(result).then((resolved) =>
            finalizeMoonshotPayloadAfterCaller(resolved, payloadObj, thinkingEnabled),
          );
        return finalizeMoonshotPayloadAfterCaller(result, payloadObj, thinkingEnabled);
      },
    });
  };
  if (baseStreamFn) return wrap(baseStreamFn);
  return async (model, context, options) => {
    const underlying = await loadDefaultStreamFn();
    return wrap(underlying)(model, context, options);
  };
}
//#endregion
export {
  resolveMoonshotThinkingKeep as n,
  resolveMoonshotThinkingType as r,
  createMoonshotThinkingWrapper as t,
};
