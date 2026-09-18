import { t as isOpenRouterDeepSeekV4ModelId } from "./models-Dg_TTdZB.js";
import {
  i as normalizeOpenRouterBaseUrl,
  r as isOpenRouterProxyReasoningUnsupportedModel,
  t as OPENROUTER_BASE_URL,
} from "./provider-catalog-Dv1kASR6.js";
import "./runtime-env-D0V-7Gqz.js";
import { o as OPENROUTER_THINKING_STREAM_HOOKS } from "./provider-stream-bgGhD_p0.js";
import "./provider-stream-family-BwwxQAAq.js";
import { l as createPayloadPatchStreamWrapper } from "./provider-stream-shared-CMy-5I0G.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region extensions/openrouter/stream.ts
const log = createSubsystemLogger("openrouter-stream");
function readString(value) {
  return typeof value === "string" ? value.trim() : void 0;
}
function isOpenRouterAnthropicModelId(modelId) {
  const normalized = readString(modelId)?.toLowerCase();
  return (
    normalized?.startsWith("anthropic/") === true ||
    normalized?.startsWith("openrouter/anthropic/") === true
  );
}
function isVerifiedOpenRouterRoute(model) {
  const provider = readString(model.provider)?.toLowerCase();
  const baseUrl = readString(model.baseUrl);
  if (baseUrl) return normalizeOpenRouterBaseUrl(baseUrl) === OPENROUTER_BASE_URL;
  return provider === "openrouter";
}
function shouldPatchAnthropicOpenRouterPayload(model) {
  const api = readString(model.api);
  return (
    (api === void 0 || api === "openai-completions") &&
    isOpenRouterAnthropicModelId(model.id) &&
    isVerifiedOpenRouterRoute(model)
  );
}
function shouldPatchDeepSeekV4OpenRouterPayload(model) {
  const api = readString(model.api);
  return (
    (api === void 0 || api === "openai-completions") &&
    isOpenRouterDeepSeekV4ModelId(model.id) &&
    isVerifiedOpenRouterRoute(model)
  );
}
function shouldPatchOpenRouterRoutingPayload(model) {
  const api = readString(model.api);
  return (api === void 0 || api === "openai-completions") && isVerifiedOpenRouterRoute(model);
}
function mergeOpenRouterAuthHeaders(options) {
  const apiKey = readString(options?.apiKey);
  if (!apiKey) return options;
  const headers = new Headers(options?.headers);
  if (!headers.has("authorization")) headers.set("Authorization", `Bearer ${apiKey}`);
  if (!headers.has("http-referer")) headers.set("HTTP-Referer", "https://openclaw.ai");
  if (!headers.has("x-openrouter-title")) headers.set("X-OpenRouter-Title", "OpenClaw");
  return {
    ...options,
    headers: Object.fromEntries(headers.entries()),
  };
}
function createOpenRouterAuthHeaderWrapper(baseStreamFn) {
  if (!baseStreamFn) return baseStreamFn;
  return (model, context, options) =>
    baseStreamFn(
      model,
      context,
      isVerifiedOpenRouterRoute(model) ? mergeOpenRouterAuthHeaders(options) : options,
    );
}
function assistantMessageHasOpenAIToolCalls(message) {
  return Array.isArray(message.tool_calls) && message.tool_calls.length > 0;
}
function isAnthropicToolCallContentBlock(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    (value.type === "tool_use" || value.type === "toolCall")
  );
}
function assistantMessageHasAnthropicToolUse(message) {
  const content = message.content;
  return Array.isArray(content) && content.some(isAnthropicToolCallContentBlock);
}
function shouldStripOpenRouterTrailingMessage(value) {
  if (!value || typeof value !== "object") return false;
  const message = value;
  return (
    message.role === "assistant" &&
    !assistantMessageHasOpenAIToolCalls(message) &&
    !assistantMessageHasAnthropicToolUse(message)
  );
}
function stripTrailingOpenRouterAssistantPrefillMessages(payload) {
  const messages = payload.messages;
  if (!Array.isArray(messages)) return 0;
  let keep = messages.length;
  while (keep > 0 && shouldStripOpenRouterTrailingMessage(messages[keep - 1])) keep -= 1;
  if (keep === messages.length) return 0;
  const stripped = messages.length - keep;
  messages.splice(keep);
  return stripped;
}
function isEnabledReasoningValue(value) {
  if (value === void 0 || value === null || value === false) return false;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized !== "" && normalized !== "off" && normalized !== "none";
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    const effort = value.effort;
    if (typeof effort === "string") {
      const normalized = effort.trim().toLowerCase();
      return normalized !== "" && normalized !== "off" && normalized !== "none";
    }
  }
  return true;
}
function isOpenRouterReasoningPayloadEnabled(payload) {
  return (
    isEnabledReasoningValue(payload.reasoning) || isEnabledReasoningValue(payload.reasoning_effort)
  );
}
function stripOpenRouterDeepSeekV4ReasoningContent(payload) {
  if (!Array.isArray(payload.messages)) return;
  for (const message of payload.messages) {
    if (!message || typeof message !== "object") continue;
    delete message.reasoning_content;
  }
}
function backfillOpenRouterDeepSeekV4ReasoningContent(payload) {
  if (!Array.isArray(payload.messages)) return;
  for (const message of payload.messages) {
    if (!message || typeof message !== "object") continue;
    const record = message;
    if (
      record.role === "assistant" &&
      !assistantMessageHasOpenAIToolCalls(record) &&
      !("reasoning_content" in record)
    )
      record.reasoning_content = "";
  }
}
function injectOpenRouterRouting(baseStreamFn, providerRouting) {
  if (!providerRouting) return baseStreamFn;
  const routedStreamFn = (model, context, options) =>
    (
      baseStreamFn ??
      ((nextModel) => {
        throw new Error(
          `OpenRouter routing wrapper requires an underlying streamFn for ${nextModel.id}.`,
        );
      })
    )(
      {
        ...model,
        compat: {
          ...model.compat,
          openRouterRouting: providerRouting,
        },
      },
      context,
      options,
    );
  return createPayloadPatchStreamWrapper(
    routedStreamFn,
    ({ payload }) => {
      if (payload.provider === void 0) payload.provider = providerRouting;
    },
    { shouldPatch: ({ model }) => shouldPatchOpenRouterRoutingPayload(model) },
  );
}
function createOpenRouterAnthropicPrefillWrapper(baseStreamFn) {
  return createPayloadPatchStreamWrapper(
    baseStreamFn,
    ({ payload }) => {
      if (!isOpenRouterReasoningPayloadEnabled(payload)) return;
      const stripped = stripTrailingOpenRouterAssistantPrefillMessages(payload);
      if (stripped > 0)
        log.warn(
          `removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because OpenRouter-routed Anthropic reasoning requires conversations to end with a user turn`,
        );
    },
    { shouldPatch: ({ model }) => shouldPatchAnthropicOpenRouterPayload(model) },
  );
}
function resolveOpenRouterDeepSeekV4ReasoningEffort(thinkingLevel) {
  if (thinkingLevel === "off") return;
  if (thinkingLevel === "xhigh" || thinkingLevel === "max") return "xhigh";
  return "high";
}
function applyOpenRouterDeepSeekV4ReasoningEffort(payload, thinkingLevel) {
  const effort = resolveOpenRouterDeepSeekV4ReasoningEffort(thinkingLevel);
  if (!effort) {
    delete payload.reasoning;
    return false;
  }
  const reasoning =
    payload.reasoning && typeof payload.reasoning === "object" && !Array.isArray(payload.reasoning)
      ? payload.reasoning
      : {};
  reasoning.effort = effort;
  payload.reasoning = reasoning;
  return true;
}
function createOpenRouterDeepSeekV4ReplayWrapper(baseStreamFn, thinkingLevel) {
  return createPayloadPatchStreamWrapper(
    baseStreamFn,
    ({ payload }) => {
      delete payload.thinking;
      delete payload.reasoning_effort;
      if (!applyOpenRouterDeepSeekV4ReasoningEffort(payload, thinkingLevel)) {
        stripOpenRouterDeepSeekV4ReasoningContent(payload);
        return;
      }
      backfillOpenRouterDeepSeekV4ReasoningContent(payload);
    },
    { shouldPatch: ({ model }) => shouldPatchDeepSeekV4OpenRouterPayload(model) },
  );
}
function wrapOpenRouterProviderStream(ctx) {
  const providerRouting =
    ctx.extraParams?.provider != null && typeof ctx.extraParams.provider === "object"
      ? ctx.extraParams.provider
      : void 0;
  const routedStreamFn = providerRouting
    ? injectOpenRouterRouting(ctx.streamFn, providerRouting)
    : ctx.streamFn;
  const wrapStreamFn = OPENROUTER_THINKING_STREAM_HOOKS.wrapStreamFn ?? void 0;
  if (!wrapStreamFn)
    return createOpenRouterAnthropicPrefillWrapper(
      createOpenRouterAuthHeaderWrapper(
        createOpenRouterDeepSeekV4ReplayWrapper(routedStreamFn, ctx.thinkingLevel),
      ),
    );
  return createOpenRouterAnthropicPrefillWrapper(
    createOpenRouterAuthHeaderWrapper(
      createOpenRouterDeepSeekV4ReplayWrapper(
        wrapStreamFn({
          ...ctx,
          streamFn: routedStreamFn,
          thinkingLevel: isOpenRouterProxyReasoningUnsupportedModel(ctx.modelId)
            ? void 0
            : ctx.thinkingLevel,
        }) ?? void 0,
        ctx.thinkingLevel,
      ),
    ),
  );
}
//#endregion
export { wrapOpenRouterProviderStream as t };
