import { u as normalizeProviderId } from "./provider-model-shared-CYlCpWlu.js";
import {
  l as createPayloadPatchStreamWrapper,
  v as isOpenAICompatibleThinkingEnabled,
  w as setQwenChatTemplateThinking,
} from "./provider-stream-shared-CMy-5I0G.js";
import { n as resolveVllmQwenThinkingFormatFromCompat } from "./thinking-policy-C33dKs2V.js";
//#region extensions/vllm/stream.ts
function isVllmProviderId(providerId) {
  return normalizeProviderId(providerId) === "vllm";
}
function resolveVllmQwenThinkingFormat(ctx) {
  return resolveVllmQwenThinkingFormatFromCompat(ctx.model?.compat);
}
function isVllmNemotronModel(model) {
  return (
    model.api === "openai-completions" &&
    typeof model.provider === "string" &&
    normalizeProviderId(model.provider) === "vllm" &&
    typeof model.id === "string" &&
    /\bnemotron-3(?:[-_](?:nano|super|ultra))?\b/i.test(model.id)
  );
}
function setNemotronThinkingOffChatTemplateKwargs(payload) {
  const defaults = {
    enable_thinking: false,
    force_nonempty_content: true,
  };
  const existing = payload.chat_template_kwargs;
  payload.chat_template_kwargs =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? {
          ...defaults,
          ...existing,
        }
      : defaults;
}
function createVllmQwenThinkingWrapper(params) {
  return createPayloadPatchStreamWrapper(
    params.baseStreamFn,
    ({ payload: payloadObj, options }) => {
      const enableThinking = isOpenAICompatibleThinkingEnabled({
        thinkingLevel: params.thinkingLevel,
        options,
      });
      if (params.format === "chat-template")
        setQwenChatTemplateThinking(payloadObj, enableThinking);
      else payloadObj.enable_thinking = enableThinking;
      delete payloadObj.reasoning_effort;
      delete payloadObj.reasoningEffort;
      delete payloadObj.reasoning;
    },
    { shouldPatch: ({ model }) => model.api === "openai-completions" && (model.reasoning ?? true) },
  );
}
function createVllmProviderThinkingWrapper(params) {
  return createPayloadPatchStreamWrapper(
    params.qwenFormat
      ? createVllmQwenThinkingWrapper({
          baseStreamFn: params.baseStreamFn,
          format: params.qwenFormat,
          thinkingLevel: params.thinkingLevel,
        })
      : params.baseStreamFn,
    ({ payload: payloadObj }) => {
      setNemotronThinkingOffChatTemplateKwargs(payloadObj);
    },
    {
      shouldPatch: ({ model }) =>
        model.api === "openai-completions" &&
        params.thinkingLevel === "off" &&
        isVllmNemotronModel(model),
    },
  );
}
function wrapVllmProviderStream(ctx) {
  if (!isVllmProviderId(ctx.provider) || (ctx.model && ctx.model.api !== "openai-completions"))
    return;
  const qwenFormat = resolveVllmQwenThinkingFormat(ctx);
  const shouldHandleNemotron =
    ctx.thinkingLevel === "off" &&
    isVllmNemotronModel({
      api: "openai-completions",
      provider: ctx.provider,
      id: ctx.modelId,
    });
  if (!qwenFormat && !shouldHandleNemotron) return;
  return createVllmProviderThinkingWrapper({
    baseStreamFn: ctx.streamFn,
    qwenFormat,
    thinkingLevel: ctx.thinkingLevel,
  });
}
//#endregion
export {
  createVllmQwenThinkingWrapper as n,
  wrapVllmProviderStream as r,
  createVllmProviderThinkingWrapper as t,
};
