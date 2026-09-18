import { applyAnthropicRefusal as applyAnthropicRefusal$1 } from "@openclaw/ai/internal/anthropic";
import { resolveOpenAIReasoningEffortForModel } from "@openclaw/ai/internal/openai";
import {
  createDeferredEventBuffer as createDeferredEventBuffer$1,
  notifyLlmRequestActivity as notifyLlmRequestActivity$1,
  onLlmRequestActivity as onLlmRequestActivity$1,
} from "@openclaw/ai/internal/runtime";
import {
  splitSystemPromptCacheBoundary,
  stripSystemPromptCacheBoundary,
} from "@openclaw/ai/internal/shared";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import "./moonshot-thinking-B6iq8Wyv.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-CdW1rMjo.js";
import {
  a as projectScrubbedPlainTextToolCallMessage,
  i as normalizePlainTextToolCallStreamEvents,
  n as createPromotedPlainTextToolCallEvents,
  r as projectStandalonePlainTextToolCallMessage,
  t as createPromotedPlainTextToolCallBlock,
} from "./src-CeNsIwRl.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/anthropic-payload-policy.ts
/**
 * Anthropic-family request payload policy helpers.
 * Applies service-tier and cache-control markers only when provider endpoint
 * capabilities allow them.
 */
const ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
function resolveBaseUrlHostname(baseUrl) {
  try {
    return new URL(baseUrl).hostname;
  } catch {
    return;
  }
}
function isLongTtlEligibleEndpoint(baseUrl) {
  if (typeof baseUrl !== "string") return false;
  const hostname = resolveBaseUrlHostname(baseUrl);
  if (!hostname) return false;
  return (
    hostname === "api.anthropic.com" ||
    hostname === "aiplatform.googleapis.com" ||
    hostname.endsWith("-aiplatform.googleapis.com")
  );
}
/** Resolve Anthropic cache-control marker retention for a request endpoint. */
function resolveAnthropicEphemeralCacheControl(baseUrl, cacheRetention) {
  const retention =
    cacheRetention ?? (process.env.OPENCLAW_CACHE_RETENTION === "long" ? "long" : "short");
  if (retention === "none") return;
  const ttl =
    retention === "long" && (cacheRetention === "long" || isLongTtlEligibleEndpoint(baseUrl))
      ? "1h"
      : void 0;
  return {
    type: "ephemeral",
    ...(ttl ? { ttl } : {}),
  };
}
function applyAnthropicCacheControlToSystem(system, cacheControl) {
  if (!Array.isArray(system)) return;
  const normalizedBlocks = [];
  for (const block of system) {
    if (!block || typeof block !== "object") {
      normalizedBlocks.push(block);
      continue;
    }
    const record = block;
    if (record.type !== "text" || typeof record.text !== "string") {
      normalizedBlocks.push(block);
      continue;
    }
    const split = splitSystemPromptCacheBoundary(record.text);
    if (!split) {
      if (record.cache_control === void 0) record.cache_control = cacheControl;
      normalizedBlocks.push(record);
      continue;
    }
    const { cache_control: existingCacheControl, ...rest } = record;
    if (split.stablePrefix)
      normalizedBlocks.push({
        ...rest,
        text: split.stablePrefix,
        cache_control: existingCacheControl ?? cacheControl,
      });
    if (split.dynamicSuffix)
      normalizedBlocks.push({
        ...rest,
        text: split.dynamicSuffix,
      });
  }
  system.splice(0, system.length, ...normalizedBlocks);
}
function stripAnthropicSystemPromptBoundary(system) {
  if (!Array.isArray(system)) return;
  for (const block of system) {
    if (!block || typeof block !== "object") continue;
    const record = block;
    if (record.type === "text" && typeof record.text === "string")
      record.text = stripSystemPromptCacheBoundary(record.text);
  }
}
function applyAnthropicCacheControlToMessages(
  messages,
  cacheControl,
  markerLimit,
  cacheBreakpointOptOutMessageIndexes,
) {
  if (!Array.isArray(messages) || messages.length === 0 || markerLimit <= 0) return;
  let fallbackToolResult;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (!message || typeof message !== "object") continue;
    const record = message;
    if (record.role !== "user" || cacheBreakpointOptOutMessageIndexes.has(i)) continue;
    const content = record.content;
    if (typeof content === "string") {
      if (fallbackToolResult && markerLimit === 1) {
        fallbackToolResult.cache_control = cacheControl;
        return;
      }
      record.content = [
        {
          type: "text",
          text: content,
          cache_control: cacheControl,
        },
      ];
      if (fallbackToolResult && markerLimit > 1) fallbackToolResult.cache_control = cacheControl;
      return;
    }
    if (!Array.isArray(content)) continue;
    for (let j = content.length - 1; j >= 0; j--) {
      const block = content[j];
      if (!block || typeof block !== "object") continue;
      const blockRecord = block;
      if (blockRecord.type === "text" || blockRecord.type === "image") {
        if (fallbackToolResult && markerLimit === 1) {
          fallbackToolResult.cache_control = cacheControl;
          return;
        }
        blockRecord.cache_control = cacheControl;
        if (fallbackToolResult && markerLimit > 1) fallbackToolResult.cache_control = cacheControl;
        return;
      }
      if (blockRecord.type === "tool_result" && fallbackToolResult === void 0)
        fallbackToolResult = blockRecord;
    }
  }
  if (fallbackToolResult) fallbackToolResult.cache_control = cacheControl;
}
function countAnthropicCacheControlMarkers(blocks) {
  if (!Array.isArray(blocks)) return 0;
  let count = 0;
  for (const block of blocks)
    if (block && typeof block === "object" && "cache_control" in block) count += 1;
  return count;
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function resolveAnthropicPayloadPolicy(input) {
  return {
    allowsServiceTier: resolveProviderRequestCapabilities({
      provider: input.provider,
      api: input.api,
      baseUrl: input.baseUrl,
      capability: "llm",
      transport: "stream",
    }).allowsAnthropicServiceTier,
    cacheControl:
      input.enableCacheControl === true
        ? resolveAnthropicEphemeralCacheControl(input.baseUrl, input.cacheRetention)
        : void 0,
    serviceTier: input.serviceTier,
  };
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function applyAnthropicPayloadPolicyToParams(
  payloadObj,
  policy,
  cacheBreakpointOptOutMessageIndexes,
) {
  if (
    policy.allowsServiceTier &&
    policy.serviceTier !== void 0 &&
    payloadObj.service_tier === void 0
  )
    payloadObj.service_tier = policy.serviceTier;
  if (policy.cacheControl)
    applyAnthropicCacheControlToSystem(payloadObj.system, policy.cacheControl);
  else stripAnthropicSystemPromptBoundary(payloadObj.system);
  if (!policy.cacheControl) return;
  const usedMarkers =
    countAnthropicCacheControlMarkers(payloadObj.system) +
    countAnthropicCacheControlMarkers(payloadObj.tools);
  applyAnthropicCacheControlToMessages(
    payloadObj.messages,
    policy.cacheControl,
    ANTHROPIC_CACHE_CONTROL_LIMIT - usedMarkers,
    cacheBreakpointOptOutMessageIndexes,
  );
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function applyAnthropicEphemeralCacheControlMarkers(
  payloadObj,
  cacheControl = { type: "ephemeral" },
) {
  const messages = payloadObj.messages;
  if (!Array.isArray(messages)) return;
  for (const message of messages) {
    if (message.role === "system" || message.role === "developer") {
      if (!cacheControl) continue;
      if (typeof message.content === "string") {
        message.content = [
          {
            type: "text",
            text: message.content,
            cache_control: cacheControl,
          },
        ];
        continue;
      }
      if (Array.isArray(message.content) && message.content.length > 0) {
        const last = message.content[message.content.length - 1];
        if (last && typeof last === "object") {
          const record = last;
          if (record.type !== "thinking" && record.type !== "redacted_thinking")
            record.cache_control = cacheControl;
        }
      }
      continue;
    }
    if (message.role === "assistant" && Array.isArray(message.content))
      for (const block of message.content) {
        if (!block || typeof block !== "object") continue;
        const record = block;
        if (record.type === "thinking" || record.type === "redacted_thinking")
          delete record.cache_control;
      }
  }
}
//#endregion
//#region src/agents/openai-reasoning-compat.ts
/**
 * OpenAI reasoning-effort compatibility helpers.
 *
 * Keeps provider metadata and built-in model exceptions on one path before request payloads are built.
 */
const OPENAI_MEDIUM_ONLY_REASONING_MODEL_IDS = /* @__PURE__ */ new Set(["gpt-5.1-codex-mini"]);
function readCompatReasoningEffortMap(compat) {
  if (!compat || typeof compat !== "object") return {};
  const rawMap = compat.reasoningEffortMap;
  if (!rawMap || typeof rawMap !== "object") return {};
  return Object.fromEntries(
    Object.entries(rawMap).filter(
      (entry) => typeof entry[0] === "string" && typeof entry[1] === "string",
    ),
  );
}
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
function resolveOpenAIReasoningEffortMap(model, fallbackMap = {}) {
  const provider = normalizeLowercaseStringOrEmpty(model.provider ?? "");
  const id = normalizeLowercaseStringOrEmpty(model.id ?? "");
  const builtinMap =
    provider === "openai" && OPENAI_MEDIUM_ONLY_REASONING_MODEL_IDS.has(id)
      ? {
          minimal: "medium",
          low: "medium",
        }
      : {};
  return {
    ...fallbackMap,
    ...builtinMap,
    ...readCompatReasoningEffortMap(model.compat),
  };
}
//#endregion
//#region src/llm/providers/stream-wrappers/reasoning-effort-utils.ts
/** Maps OpenClaw thinking levels onto provider reasoning-effort labels. */
function mapThinkingLevelToReasoningEffort(thinkingLevel) {
  if (thinkingLevel === "off") return "none";
  if (thinkingLevel === "adaptive") return "medium";
  if (thinkingLevel === "max" || thinkingLevel === "ultra") return "xhigh";
  return thinkingLevel;
}
//#endregion
//#region src/llm/providers/stream-wrappers/stream-payload-utils.ts
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
function streamWithPayloadPatch(underlying, model, context, options, patchPayload) {
  const originalOnPayload = options?.onPayload;
  return underlying(model, context, {
    ...options,
    onPayload: (payload) => {
      if (payload && typeof payload === "object") patchPayload(payload);
      return originalOnPayload?.(payload, model);
    },
  });
}
//#endregion
//#region src/llm/providers/stream-wrappers/zai.ts
/**
 * Inject `tool_stream=true` so tool-call deltas stream in real time.
 * Providers can disable this by setting `params.tool_stream=false`.
 *
 * @deprecated Provider-owned stream helper; do not use from third-party plugins.
 */
function createToolStreamWrapper(baseStreamFn, enabled) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!enabled) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      payloadObj.tool_stream = true;
    });
  };
}
/** @deprecated Z.ai provider-owned stream helper; do not use from third-party plugins. */
const createZaiToolStreamWrapper = createToolStreamWrapper;
//#endregion
//#region src/plugin-sdk/provider-stream-shared.ts
/** Compose stream wrapper factories from left to right around a base stream function. */
function composeProviderStreamWrappers(baseStreamFn, ...wrappers) {
  return wrappers.reduce(
    (streamFn, wrapper) => (wrapper ? wrapper(streamFn) : streamFn),
    baseStreamFn,
  );
}
function toRecord(value) {
  return value && typeof value === "object" ? value : void 0;
}
function resolveContextToolNames(context) {
  const tools = context.tools;
  if (!Array.isArray(tools)) return /* @__PURE__ */ new Set();
  const names = tools
    .map((tool) => {
      const record = toRecord(tool);
      return typeof record?.name === "string" && record.name.trim() ? record.name : void 0;
    })
    .filter((name) => Boolean(name));
  return new Set(names);
}
function promotePlainTextToolCalls(message, toolNames) {
  const messageRecord = toRecord(message);
  if (
    Array.isArray(messageRecord?.content) &&
    messageRecord.content.some((block) => toRecord(block)?.type === "toolCall")
  )
    return;
  return projectStandalonePlainTextToolCallMessage({
    allowedToolNames: toolNames,
    createToolCallBlock: createPromotedPlainTextToolCallBlock,
    isRetainableNonTextBlock: () => true,
    message,
  });
}
function createProviderToolNameMatcher(toolNames) {
  return {
    hasExactName: (name) => toolNames.has(name),
    hasNamePrefix: (prefix) => {
      for (const toolName of toolNames) if (toolName.startsWith(prefix)) return true;
      return false;
    },
  };
}
function normalizeProviderDoneMessage(
  message,
  allowPromotion,
  toolNames,
  matcher,
  preserveEmptyTextBlocks = false,
) {
  const scrubbedMessage = scrubProviderTerminalMessage(message, matcher, preserveEmptyTextBlocks);
  if (scrubbedMessage)
    return {
      kind: "scrubbed",
      ...scrubbedMessage,
    };
  if (!allowPromotion) return;
  const promotedMessage = promotePlainTextToolCalls(message, toolNames);
  return promotedMessage
    ? {
        kind: "promoted",
        ...promotedMessage,
      }
    : void 0;
}
function scrubProviderTerminalMessage(
  message,
  matcher,
  preserveEmptyTextBlocks = false,
  forceKnownCandidates = false,
) {
  return projectScrubbedPlainTextToolCallMessage({
    forceKnownCandidates,
    matcher,
    message,
    preserveEmptyTextBlocks,
  });
}
function wrapPlainTextToolCallStream(source, context) {
  const toolNames = resolveContextToolNames(context);
  if (toolNames.size === 0) return source;
  const matcher = createProviderToolNameMatcher(toolNames);
  const output = (0, event_stream_exports.createAssistantMessageEventStream)();
  const stream = output;
  (async () => {
    let ended = false;
    const endStream = () => {
      if (!ended) {
        ended = true;
        stream.end();
      }
    };
    try {
      const normalizedEvents = normalizePlainTextToolCallStreamEvents(source, {
        createPromotedToolCallEvents: createPromotedPlainTextToolCallEvents,
        matcher,
        normalizeTerminalMessage: ({ allowPromotion, message, preserveEmptyTextBlocks }) =>
          normalizeProviderDoneMessage(
            message,
            allowPromotion,
            toolNames,
            matcher,
            preserveEmptyTextBlocks,
          ),
        stopAfterDone: true,
      });
      for await (const event of normalizedEvents) stream.push(event);
    } catch (error) {
      stream.push({
        type: "error",
        reason: "error",
        error: {
          role: "assistant",
          content: [],
          stopReason: "error",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });
    } finally {
      endStream();
    }
  })();
  return output;
}
/**
 * Provider stream wrapper for local/proxy providers that sometimes emit a
 * standalone textual tool-call block even when native tool calling is enabled.
 */
function createPlainTextToolCallCompatWrapper(baseStreamFn) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const maybeStream = underlying(model, context, options);
    if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream)
      return Promise.resolve(maybeStream).then((stream) =>
        wrapPlainTextToolCallStream(stream, context),
      );
    return wrapPlainTextToolCallStream(maybeStream, context);
  };
}
/** @deprecated Bundled provider stream helper; do not use from third-party plugins. */
function defaultToolStreamExtraParams(extraParams) {
  if (extraParams?.tool_stream !== void 0) return extraParams;
  return {
    ...extraParams,
    tool_stream: true,
  };
}
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
function createPayloadPatchStreamWrapper(baseStreamFn, patchPayload, wrapperOptions) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (
      wrapperOptions?.shouldPatch &&
      !wrapperOptions.shouldPatch({
        model,
        context,
        options,
      })
    )
      return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payload) =>
      patchPayload({
        payload,
        model,
        context,
        options,
      }),
    );
  };
}
/**
 * Applies explicit disabled-thinking intent to OpenAI-compatible Chat
 * Completions payloads without changing enabled reasoning levels.
 */
function createOpenAICompatibleCompletionsThinkingOffWrapper(baseStreamFn, thinkingLevel) {
  const underlying = baseStreamFn ?? streamSimple;
  if (thinkingLevel !== "off") return underlying;
  return (model, context, options) => {
    if (model.api !== "openai-completions") return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
      if (!("reasoning_effort" in payload)) return;
      const disabled = resolveOpenAIReasoningEffortForModel({
        model,
        effort: "none",
        fallbackMap: resolveOpenAIReasoningEffortMap({
          provider: typeof model.provider === "string" ? model.provider : null,
          id: typeof model.id === "string" ? model.id : null,
          compat: model.compat,
        }),
      });
      if (disabled) payload.reasoning_effort = disabled;
      else delete payload.reasoning_effort;
    });
  };
}
function isAnthropicThinkingEnabled(payload) {
  const thinking = payload.thinking;
  if (!thinking || typeof thinking !== "object") return false;
  return thinking.type !== "disabled";
}
function assistantMessageHasAnthropicToolUse(message) {
  if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) return true;
  const content = message.content;
  if (!Array.isArray(content)) return false;
  return content.some(
    (block) =>
      block &&
      typeof block === "object" &&
      (block.type === "tool_use" || block.type === "toolCall"),
  );
}
function stripTrailingAssistantPrefillMessages(payload) {
  if (!Array.isArray(payload.messages)) return 0;
  let stripped = 0;
  while (payload.messages.length > 0) {
    const finalMessage = payload.messages[payload.messages.length - 1];
    if (!finalMessage || typeof finalMessage !== "object") break;
    const message = finalMessage;
    if (message.role !== "assistant" || assistantMessageHasAnthropicToolUse(message)) break;
    payload.messages.pop();
    stripped += 1;
  }
  return stripped;
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function stripTrailingAnthropicAssistantPrefillWhenThinking(payload) {
  if (!isAnthropicThinkingEnabled(payload)) return 0;
  return stripTrailingAssistantPrefillMessages(payload);
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, onStripped, wrapperOptions) {
  return createPayloadPatchStreamWrapper(
    baseStreamFn,
    ({ payload }) => {
      const stripped = stripTrailingAnthropicAssistantPrefillWhenThinking(payload);
      if (stripped > 0) onStripped?.(stripped);
    },
    wrapperOptions,
  );
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function isOpenAICompatibleThinkingEnabled(params) {
  const options = params.options ?? {};
  const raw = options.reasoningEffort ?? options.reasoning ?? params.thinkingLevel ?? "high";
  if (typeof raw !== "string") return true;
  const normalized = raw.trim().toLowerCase();
  return normalized !== "off" && normalized !== "none";
}
/** Applies the shared reasoning payload policy used by OpenAI-compatible proxy providers. */
function normalizeOpenAICompatibleReasoningPayload(payload, thinkingLevel) {
  delete payload.reasoning_effort;
  if (!thinkingLevel || thinkingLevel === "off") return;
  const existingReasoning = payload.reasoning;
  if (
    existingReasoning &&
    typeof existingReasoning === "object" &&
    !Array.isArray(existingReasoning)
  ) {
    const reasoning = existingReasoning;
    if (!("max_tokens" in reasoning) && !("effort" in reasoning))
      reasoning.effort = mapThinkingLevelToReasoningEffort(thinkingLevel);
  } else if (!existingReasoning)
    payload.reasoning = { effort: mapThinkingLevelToReasoningEffort(thinkingLevel) };
}
/** Applies Qwen chat-template thinking flags without discarding provider-specific kwargs. */
function setQwenChatTemplateThinking(payload, enabled) {
  const existing = payload.chat_template_kwargs;
  if (existing && typeof existing === "object" && !Array.isArray(existing)) {
    const next = {
      ...existing,
      enable_thinking: enabled,
    };
    if (!Object.hasOwn(next, "preserve_thinking")) next.preserve_thinking = true;
    payload.chat_template_kwargs = next;
    return;
  }
  payload.chat_template_kwargs = {
    enable_thinking: enabled,
    preserve_thinking: true,
  };
}
function isDisabledDeepSeekV4ThinkingLevel(thinkingLevel) {
  const normalized = typeof thinkingLevel === "string" ? thinkingLevel.toLowerCase() : "";
  return normalized === "off" || normalized === "none";
}
function resolveDeepSeekV4ReasoningEffort(thinkingLevel) {
  return thinkingLevel === "xhigh" || thinkingLevel === "max" ? "max" : "high";
}
function stripDeepSeekV4ReasoningContent(payload) {
  if (!Array.isArray(payload.messages)) return;
  for (const message of payload.messages) {
    if (!message || typeof message !== "object") continue;
    delete message.reasoning_content;
  }
}
function ensureDeepSeekV4AssistantReasoningContent(payload, params) {
  if (!Array.isArray(payload.messages)) return;
  for (const message of payload.messages) {
    if (!message || typeof message !== "object") continue;
    const record = message;
    if (record.role !== "assistant") continue;
    if (params?.shouldBackfillAssistantMessage && !params.shouldBackfillAssistantMessage(record))
      continue;
    if (!("reasoning_content" in record)) record.reasoning_content = "";
  }
}
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
function createDeepSeekV4OpenAICompatibleThinkingWrapper(params) {
  if (!params.baseStreamFn) return;
  const underlying = params.baseStreamFn;
  const resolveReasoningEffort = params.resolveReasoningEffort ?? resolveDeepSeekV4ReasoningEffort;
  return (model, context, options) => {
    if (!params.shouldPatchModel(model)) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
      if (isDisabledDeepSeekV4ThinkingLevel(params.thinkingLevel)) {
        payload.thinking = { type: "disabled" };
        delete payload.reasoning_effort;
        delete payload.reasoning;
        stripDeepSeekV4ReasoningContent(payload);
        return;
      }
      payload.thinking = { type: "enabled" };
      payload.reasoning_effort = resolveReasoningEffort(params.thinkingLevel);
      ensureDeepSeekV4AssistantReasoningContent(payload, {
        shouldBackfillAssistantMessage: params.shouldBackfillAssistantReasoningContent,
      });
    });
  };
}
function promoteThinkingOnlyFinalOutputToText(message) {
  if (!message || typeof message !== "object") return;
  const record = message;
  if (record.stopReason !== "stop" && record.stopReason !== "length") return;
  if (!Array.isArray(record.content) || record.content.length === 0) return;
  let hasVisibleText = false;
  let hasToolCall = false;
  let hasVisibleThinking = false;
  for (const block of record.content) {
    if (!block || typeof block !== "object") continue;
    const typedBlock = block;
    if (typedBlock.type === "text" && typeof typedBlock.text === "string" && typedBlock.text.trim())
      hasVisibleText = true;
    if (typedBlock.type === "toolCall" || typedBlock.type === "tool_use") hasToolCall = true;
    if (
      typedBlock.type === "thinking" &&
      typeof typedBlock.thinking === "string" &&
      typedBlock.thinking.trim()
    )
      hasVisibleThinking = true;
  }
  if (hasVisibleText || hasToolCall || !hasVisibleThinking) return;
  record.content = record.content.map((block) => {
    if (!block || typeof block !== "object") return block;
    const typedBlock = block;
    if (
      typedBlock.type !== "thinking" ||
      typeof typedBlock.thinking !== "string" ||
      !typedBlock.thinking.trim()
    )
      return block;
    return {
      type: "text",
      text: typedBlock.thinking,
    };
  });
}
function wrapThinkingOnlyFinalTextStream(stream) {
  const originalResult = stream.result.bind(stream);
  stream.result = async () => {
    const message = await originalResult();
    promoteThinkingOnlyFinalOutputToText(message);
    return message;
  };
  const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
  stream[Symbol.asyncIterator] = function () {
    const iterator = originalAsyncIterator();
    return {
      async next() {
        const result = await iterator.next();
        if (!result.done && result.value && typeof result.value === "object") {
          const event = result.value;
          promoteThinkingOnlyFinalOutputToText(event.partial);
          promoteThinkingOnlyFinalOutputToText(event.message);
        }
        return result;
      },
      async return(value) {
        return (
          iterator.return?.(value) ?? {
            done: true,
            value: void 0,
          }
        );
      },
      async throw(error) {
        return (
          iterator.throw?.(error) ?? {
            done: true,
            value: void 0,
          }
        );
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  };
  return stream;
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function createThinkingOnlyFinalTextWrapper(params) {
  if (!params.baseStreamFn) return;
  const underlying = params.baseStreamFn;
  return (model, context, options) => {
    const maybeStream = underlying(model, context, options);
    if (!params.shouldPatchModel(model)) return maybeStream;
    if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream)
      return Promise.resolve(maybeStream).then((stream) => wrapThinkingOnlyFinalTextStream(stream));
    return wrapThinkingOnlyFinalTextStream(maybeStream);
  };
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleThinkingRequiredModel(modelId) {
  return normalizeLowercaseStringOrEmpty(modelId).includes("gemini-2.5-pro");
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini25ThinkingBudgetModel(modelId) {
  return /(?:^|\/)gemini-2\.5-/.test(normalizeLowercaseStringOrEmpty(modelId));
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini3ProModel(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return /(?:^|\/)gemini-(?:3(?:\.\d+)?-pro|pro-latest)(?:-|$)/.test(normalized);
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini3FlashModel(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return /(?:^|\/)gemini-(?:3(?:\.\d+)?-flash|flash(?:-lite)?-latest)(?:-|$)/.test(normalized);
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini3ThinkingLevelModel(modelId) {
  return isGoogleGemini3ProModel(modelId) || isGoogleGemini3FlashModel(modelId);
}
/**
 * Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
function resolveGoogleGemini3ThinkingLevel(params) {
  if (typeof params.modelId !== "string") return;
  if (isGoogleGemini3ProModel(params.modelId)) {
    switch (params.thinkingLevel) {
      case "off":
      case "minimal":
      case "low":
        return "LOW";
      case "medium":
      case "high":
      case "max":
      case "xhigh":
        return "HIGH";
      case "adaptive":
        return;
      case void 0:
        break;
    }
    if (typeof params.thinkingBudget === "number") {
      if (params.thinkingBudget < 0) return;
      return params.thinkingBudget <= 2048 ? "LOW" : "HIGH";
    }
    return;
  }
  if (!isGoogleGemini3FlashModel(params.modelId)) return;
  switch (params.thinkingLevel) {
    case "off":
    case "minimal":
      return "MINIMAL";
    case "low":
      return "LOW";
    case "medium":
      return "MEDIUM";
    case "high":
    case "max":
    case "xhigh":
      return "HIGH";
    case "adaptive":
      return;
    case void 0:
      break;
  }
  if (typeof params.thinkingBudget !== "number") return;
  if (params.thinkingBudget < 0) return;
  if (params.thinkingBudget <= 0) return "MINIMAL";
  if (params.thinkingBudget <= 2048) return "LOW";
  if (params.thinkingBudget <= 8192) return "MEDIUM";
  return "HIGH";
}
/**
 * Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
function stripInvalidGoogleThinkingBudget(params) {
  if (
    params.thinkingConfig.thinkingBudget !== 0 ||
    typeof params.modelId !== "string" ||
    !isGoogleThinkingRequiredModel(params.modelId)
  )
    return false;
  delete params.thinkingConfig.thinkingBudget;
  return true;
}
function isGemma4Model(modelId) {
  return normalizeLowercaseStringOrEmpty(modelId).startsWith("gemma-4");
}
function mapThinkLevelToGemma4ThinkingLevel(thinkingLevel) {
  switch (thinkingLevel) {
    case "off":
      return;
    case "minimal":
    case "low":
      return "MINIMAL";
    case "medium":
    case "adaptive":
    case "high":
    case "max":
    case "xhigh":
      return "HIGH";
    default:
      return;
  }
}
function normalizeGemma4ThinkingLevel(value) {
  if (typeof value !== "string") return;
  switch (value.trim().toUpperCase()) {
    case "MINIMAL":
    case "LOW":
      return "MINIMAL";
    case "MEDIUM":
    case "HIGH":
      return "HIGH";
    default:
      return;
  }
}
/**
 * Normalizes Google thinking config across SDK payload shapes before provider transport.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
function sanitizeGoogleThinkingPayload(params) {
  if (!params.payload || typeof params.payload !== "object") return;
  const payloadObj = params.payload;
  sanitizeGoogleThinkingConfigContainer({
    container: payloadObj.config,
    modelId: params.modelId,
    thinkingLevel: params.thinkingLevel,
  });
  sanitizeGoogleThinkingConfigContainer({
    container: payloadObj.generationConfig,
    modelId: params.modelId,
    thinkingLevel: params.thinkingLevel,
  });
}
function sanitizeGoogleThinkingConfigContainer(params) {
  if (!params.container || typeof params.container !== "object") return;
  const configObj = params.container;
  const thinkingConfig = configObj.thinkingConfig;
  if (!thinkingConfig || typeof thinkingConfig !== "object") return;
  const thinkingConfigObj = thinkingConfig;
  if (typeof params.modelId === "string" && isGemma4Model(params.modelId)) {
    const normalizedThinkingLevel = normalizeGemma4ThinkingLevel(thinkingConfigObj.thinkingLevel);
    const explicitMappedLevel = mapThinkLevelToGemma4ThinkingLevel(params.thinkingLevel);
    const disabledViaBudget =
      typeof thinkingConfigObj.thinkingBudget === "number" && thinkingConfigObj.thinkingBudget <= 0;
    const hadThinkingBudget = thinkingConfigObj.thinkingBudget !== void 0;
    delete thinkingConfigObj.thinkingBudget;
    if (
      params.thinkingLevel === "off" ||
      (disabledViaBudget && explicitMappedLevel === void 0 && !normalizedThinkingLevel)
    ) {
      delete thinkingConfigObj.thinkingLevel;
      if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
      return;
    }
    const mappedLevel =
      explicitMappedLevel ?? normalizedThinkingLevel ?? (hadThinkingBudget ? "MINIMAL" : void 0);
    if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
    return;
  }
  const thinkingBudget = thinkingConfigObj.thinkingBudget;
  if (
    params.thinkingLevel === "adaptive" &&
    typeof params.modelId === "string" &&
    isGoogleGemini25ThinkingBudgetModel(params.modelId)
  ) {
    delete thinkingConfigObj.thinkingLevel;
    thinkingConfigObj.thinkingBudget = -1;
    return;
  }
  if (
    params.thinkingLevel === "adaptive" &&
    typeof params.modelId === "string" &&
    isGoogleGemini3ThinkingLevelModel(params.modelId)
  ) {
    delete thinkingConfigObj.thinkingBudget;
    delete thinkingConfigObj.thinkingLevel;
    if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
    return;
  }
  if (typeof params.modelId === "string" && isGoogleGemini3ThinkingLevelModel(params.modelId)) {
    const mappedLevel = resolveGoogleGemini3ThinkingLevel({
      modelId: params.modelId,
      thinkingLevel: params.thinkingLevel,
      thinkingBudget: typeof thinkingBudget === "number" ? thinkingBudget : void 0,
    });
    delete thinkingConfigObj.thinkingBudget;
    if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
    if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
    return;
  }
  if (
    stripInvalidGoogleThinkingBudget({
      thinkingConfig: thinkingConfigObj,
      modelId: params.modelId,
    })
  ) {
    if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
    return;
  }
  if (typeof thinkingBudget !== "number" || thinkingBudget >= 0) return;
  delete thinkingConfigObj.thinkingBudget;
  if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingPayloadWrapper(baseStreamFn, thinkingLevel) {
  return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
    if (model.api === "google-generative-ai")
      sanitizeGoogleThinkingPayload({
        payload,
        modelId: model.id,
        thinkingLevel,
      });
  });
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingStreamWrapper(ctx) {
  return createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel);
}
//#endregion
export {
  mapThinkingLevelToReasoningEffort as A,
  sanitizeGoogleThinkingPayload as C,
  createToolStreamWrapper as D,
  stripTrailingAnthropicAssistantPrefillWhenThinking as E,
  resolveAnthropicPayloadPolicy as F,
  applyAnthropicEphemeralCacheControlMarkers as M,
  applyAnthropicPayloadPolicyToParams as N,
  createZaiToolStreamWrapper as O,
  resolveAnthropicEphemeralCacheControl as P,
  resolveGoogleGemini3ThinkingLevel as S,
  stripInvalidGoogleThinkingBudget as T,
  isGoogleThinkingRequiredModel as _,
  createDeferredEventBuffer$1 as a,
  notifyLlmRequestActivity$1 as b,
  createOpenAICompatibleCompletionsThinkingOffWrapper as c,
  createThinkingOnlyFinalTextWrapper as d,
  defaultToolStreamExtraParams as f,
  isGoogleGemini3ThinkingLevelModel as g,
  isGoogleGemini3ProModel as h,
  createDeepSeekV4OpenAICompatibleThinkingWrapper as i,
  resolveOpenAIReasoningEffortMap as j,
  streamWithPayloadPatch as k,
  createPayloadPatchStreamWrapper as l,
  isGoogleGemini3FlashModel as m,
  composeProviderStreamWrappers as n,
  createGoogleThinkingPayloadWrapper as o,
  isGoogleGemini25ThinkingBudgetModel as p,
  createAnthropicThinkingPrefillPayloadWrapper as r,
  createGoogleThinkingStreamWrapper as s,
  applyAnthropicRefusal$1 as t,
  createPlainTextToolCallCompatWrapper as u,
  isOpenAICompatibleThinkingEnabled as v,
  setQwenChatTemplateThinking as w,
  onLlmRequestActivity$1 as x,
  normalizeOpenAICompatibleReasoningPayload as y,
};
