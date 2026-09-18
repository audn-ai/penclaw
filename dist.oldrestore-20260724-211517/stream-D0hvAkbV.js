import { randomUUID } from "node:crypto";
import { i as OLLAMA_DEFAULT_BASE_URL } from "./defaults-W8ZJNfBr.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  n as parseJsonPreservingUnsafeIntegers,
  t as parseJsonObjectPreservingUnsafeIntegers,
} from "./json-unsafe-integers-DpTiDHBw.js";
import { d as isNonSecretApiKeyMarker } from "./model-auth-markers-CA2Xy59Z.js";
import {
  r as resolveMoonshotThinkingType,
  t as createMoonshotThinkingWrapper,
} from "./moonshot-thinking-B6iq8Wyv.js";
import { n as buildOllamaBaseUrlSsrFPolicy } from "./provider-base-url-BOHQJG0k.js";
import "./defaults-CdX9UGcX.js";
import { g as readResponseTextLimited } from "./provider-http-errors-DLMRBkZU.js";
import { u as normalizeProviderId } from "./provider-model-shared-CYlCpWlu.js";
import {
  k as streamWithPayloadPatch,
  u as createPlainTextToolCallCompatWrapper,
} from "./provider-stream-shared-CMy-5I0G.js";
import "./llm-CMBgEkcN.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  p as readStringValue,
} from "./string-coerce-DW4mBlAt.js";
import "./error-runtime-BIAwr399.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./provider-auth-mypr64nh.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./json-unsafe-integers-Qcd4tiKU.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { i as createAssistantMessageEventStream } from "./validation-BwJmh4hU.js";
//#region extensions/ollama/src/sanitizers/kimi-inline-reasoning.ts
const INLINE_REASONING_MIN_PREFIX_CHARS = 80;
const INLINE_REASONING_MAX_PENDING_CHARS = 512;
const INLINE_REASONING_BOUNDARY_RE = /(^|\s)\uFE0F\s*/u;
function isOllamaCloudKimiModelRef(modelId) {
  const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
  const slashIndex = normalizedModelId.indexOf("/");
  const normalizedWireModelId =
    slashIndex === -1 ? normalizedModelId : normalizedModelId.slice(slashIndex + 1);
  return normalizedWireModelId.startsWith("kimi-k") && normalizedWireModelId.includes(":cloud");
}
function resolveInlineReasoningVisibleText(params) {
  const match = INLINE_REASONING_BOUNDARY_RE.exec(params.text);
  if (!match || match[1] === void 0) {
    if (!params.final && params.text.length <= INLINE_REASONING_MAX_PENDING_CHARS)
      return { kind: "pending" };
    return {
      kind: "visible",
      text: params.text,
      bypassInlineReasoning:
        !params.final && params.text.length > INLINE_REASONING_MAX_PENDING_CHARS,
    };
  }
  const boundaryStartIndex = match.index + match[1].length;
  const boundaryEndIndex = match.index + match[0].length;
  const prefix = params.text.slice(0, boundaryStartIndex).trim();
  const answer = params.text.slice(boundaryEndIndex).trim();
  if (prefix.length >= INLINE_REASONING_MIN_PREFIX_CHARS)
    return {
      kind: "visible",
      text: answer,
    };
  return params.final
    ? {
        kind: "visible",
        text: params.text,
      }
    : { kind: "pending" };
}
function createKimiInlineReasoningSanitizer() {
  let bypassInlineReasoning = false;
  return {
    resolveStreamText(params) {
      if (bypassInlineReasoning)
        return {
          kind: "visible",
          text: params.text,
        };
      const resolution = resolveInlineReasoningVisibleText(params);
      if (resolution.kind === "pending") return resolution;
      if (resolution.bypassInlineReasoning) bypassInlineReasoning = true;
      return {
        kind: "visible",
        text: resolution.text,
      };
    },
    sanitizeFinalText(text) {
      const resolution = resolveInlineReasoningVisibleText({
        text,
        final: true,
      });
      return resolution.kind === "visible" ? resolution.text : text;
    },
  };
}
//#endregion
//#region extensions/ollama/src/model-behavior.ts
function shouldWrapOllamaCompatMoonshotThinking(modelId) {
  return isOllamaCloudKimiModelRef(modelId);
}
//#endregion
//#region extensions/ollama/src/model-id.ts
const OLLAMA_PROVIDER_ID = "ollama";
function uniqueModelPrefixCandidates(providerId) {
  return uniqueStrings(
    [providerId, normalizeProviderId(providerId ?? ""), OLLAMA_PROVIDER_ID]
      .map((candidate) => candidate?.trim())
      .filter((candidate) => Boolean(candidate)),
  );
}
function normalizeOllamaWireModelId(modelId, providerId) {
  const trimmed = modelId.trim();
  if (!trimmed) return trimmed;
  for (const candidate of uniqueModelPrefixCandidates(providerId)) {
    const prefix = `${candidate}/`;
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return trimmed;
}
//#endregion
//#region extensions/ollama/src/sanitizers/visible-content.ts
const noopVisibleContentSanitizer = {
  resolveStreamText(params) {
    return {
      kind: "visible",
      text: params.text,
    };
  },
  sanitizeFinalText(text) {
    return text;
  },
};
function createOllamaVisibleContentSanitizer(modelId) {
  if (isOllamaCloudKimiModelRef(modelId)) return createKimiInlineReasoningSanitizer();
  return noopVisibleContentSanitizer;
}
function sanitizeOllamaFinalVisibleContent(params) {
  return createOllamaVisibleContentSanitizer(params.modelId).sanitizeFinalText(params.text);
}
//#endregion
//#region extensions/ollama/src/stream.ts
const log = createSubsystemLogger("ollama-stream");
const OLLAMA_NATIVE_BASE_URL = OLLAMA_DEFAULT_BASE_URL;
const OLLAMA_INCOMPLETE_STREAM_ERROR = "Ollama API stream ended without a final response";
const OLLAMA_STREAM_COOPERATIVE_YIELD_INTERVAL_MS = 12;
const OLLAMA_STREAM_COOPERATIVE_YIELD_MAX_EVENTS = 64;
const OLLAMA_STREAM_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const GARBLED_VISIBLE_TEXT_MODEL_RE = /\b(?:glm|kimi)\b/i;
const GARBLED_VISIBLE_TEXT_MIN_CHARS = 80;
const GARBLED_VISIBLE_TEXT_SYMBOL_RE = /[$#%&="'_~`^|\\/*+\-[\]{}()<>:;,.!?]/gu;
const LETTER_OR_DIGIT_RE = /[\p{L}\p{N}]/gu;
function throwIfOllamaStreamAborted(signal) {
  if (signal?.aborted) throw new Error("Request was aborted");
}
function createOllamaStreamCooperativeScheduler(signal) {
  let lastYieldedAt = Date.now();
  let eventsSinceYield = 0;
  return {
    async afterEvent() {
      throwIfOllamaStreamAborted(signal);
      eventsSinceYield += 1;
      const now = Date.now();
      if (
        eventsSinceYield < OLLAMA_STREAM_COOPERATIVE_YIELD_MAX_EVENTS &&
        now - lastYieldedAt < OLLAMA_STREAM_COOPERATIVE_YIELD_INTERVAL_MS
      )
        return;
      eventsSinceYield = 0;
      lastYieldedAt = now;
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      throwIfOllamaStreamAborted(signal);
    },
  };
}
function countMatches(text, re) {
  re.lastIndex = 0;
  return Array.from(text.matchAll(re)).length;
}
function maxCharacterFrequency(text) {
  const counts = /* @__PURE__ */ new Map();
  let max = 0;
  for (const char of text) {
    const count = (counts.get(char) ?? 0) + 1;
    counts.set(char, count);
    max = Math.max(max, count);
  }
  return max;
}
function isKnownOllamaGarbledVisibleTextModel(modelId) {
  return GARBLED_VISIBLE_TEXT_MODEL_RE.test(modelId);
}
function isLikelyGarbledVisibleText(params) {
  if (!isKnownOllamaGarbledVisibleTextModel(params.modelId)) return false;
  const compact = params.text.replace(/\s+/g, "");
  if (compact.length < GARBLED_VISIBLE_TEXT_MIN_CHARS) return false;
  const letterOrDigitCount = countMatches(compact, LETTER_OR_DIGIT_RE);
  const symbolCount = countMatches(compact, GARBLED_VISIBLE_TEXT_SYMBOL_RE);
  const maxFrequency = maxCharacterFrequency(compact);
  const letterOrDigitRatio = letterOrDigitCount / compact.length;
  const symbolRatio = symbolCount / compact.length;
  const dominantCharacterRatio = maxFrequency / compact.length;
  return (
    letterOrDigitRatio < 0.08 &&
    symbolRatio > 0.6 &&
    (dominantCharacterRatio > 0.22 || /[$#%&="'_~`^|\\/*+\-[\]{}()<>:;,.!?]{12,}/u.test(compact))
  );
}
function resolveOllamaBaseUrlForRun(params) {
  const providerBaseUrl = params.providerBaseUrl?.trim();
  if (providerBaseUrl) return providerBaseUrl;
  const modelBaseUrl = params.modelBaseUrl?.trim();
  if (modelBaseUrl) return modelBaseUrl;
  return OLLAMA_NATIVE_BASE_URL;
}
function resolveConfiguredOllamaProviderConfig(params) {
  const providerId = params.providerId?.trim();
  if (!providerId) return;
  const providers = params.config?.models?.providers;
  if (!providers) return;
  const direct = providers[providerId];
  if (direct) return direct;
  const normalized = normalizeProviderId(providerId);
  for (const [candidateId, candidate] of Object.entries(providers))
    if (normalizeProviderId(candidateId) === normalized) return candidate;
}
function isOllamaCompatProvider(model) {
  const providerId = normalizeProviderId(model.provider ?? "");
  if (providerId === "ollama") return true;
  if (!model.baseUrl) return false;
  try {
    const parsed = new URL(model.baseUrl);
    const hostname = normalizeLowercaseStringOrEmpty(parsed.hostname);
    if (
      (hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname === "[::1]") &&
      parsed.port === "11434"
    )
      return true;
    const providerHintsOllama = providerId.includes("ollama");
    const isOllamaPort = parsed.port === "11434";
    const isOllamaCompatPath = parsed.pathname === "/" || /^\/v1\/?$/i.test(parsed.pathname);
    return providerHintsOllama && isOllamaPort && isOllamaCompatPath;
  } catch {
    return false;
  }
}
function resolveOllamaCompatNumCtxEnabled(params) {
  return resolveConfiguredOllamaProviderConfig(params)?.injectNumCtxForOpenAICompat ?? true;
}
function shouldInjectOllamaCompatNumCtx(params) {
  if (params.model.api !== "openai-completions") return false;
  if (!isOllamaCompatProvider(params.model)) return false;
  return resolveOllamaCompatNumCtxEnabled({
    config: params.config,
    providerId: params.providerId,
  });
}
function wrapOllamaCompatNumCtx(baseFn, numCtx) {
  const streamFn = baseFn ?? streamSimple;
  return (model, context, options) =>
    streamWithPayloadPatch(streamFn, model, context, options, (payloadRecord) => {
      if (!payloadRecord.options || typeof payloadRecord.options !== "object")
        payloadRecord.options = {};
      payloadRecord.options.num_ctx = numCtx;
    });
}
const OLLAMA_OPTION_PARAM_KEYS = /* @__PURE__ */ new Set([
  "num_keep",
  "seed",
  "num_predict",
  "top_k",
  "top_p",
  "min_p",
  "typical_p",
  "repeat_last_n",
  "temperature",
  "repeat_penalty",
  "presence_penalty",
  "frequency_penalty",
  "stop",
  "num_ctx",
  "num_batch",
  "num_gpu",
  "main_gpu",
  "use_mmap",
  "num_thread",
]);
const OLLAMA_TOP_LEVEL_PARAM_KEYS = /* @__PURE__ */ new Set([
  "format",
  "keep_alive",
  "truncate",
  "shift",
]);
function createOllamaThinkingWrapper(baseFn, think) {
  const streamFn = baseFn ?? streamSimple;
  return (model, context, options) =>
    streamWithPayloadPatch(streamFn, model, context, options, (payloadRecord) => {
      payloadRecord.think = think;
    });
}
function resolveOllamaThinkValue(thinkingLevel) {
  if (thinkingLevel === "off") return false;
  if (thinkingLevel === "low" || thinkingLevel === "medium" || thinkingLevel === "high")
    return thinkingLevel;
  if (thinkingLevel === "minimal") return "low";
  if (thinkingLevel === "xhigh" || thinkingLevel === "adaptive" || thinkingLevel === "max")
    return "high";
}
function resolveOllamaThinkParamValue(params) {
  const raw = params?.think ?? params?.thinking;
  if (typeof raw === "boolean") return raw;
  if (raw === "off") return false;
  if (raw === "low" || raw === "medium" || raw === "high") return raw;
  if (raw === "minimal") return "low";
  if (raw === "xhigh" || raw === "adaptive" || raw === "max") return "high";
}
function shouldForwardNativeOllamaThink(model, think) {
  return think === false || model?.reasoning !== false;
}
function resolveOllamaConfiguredNumCtx(model) {
  const raw = model.params?.num_ctx;
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) return;
  return Math.floor(raw);
}
function resolveOllamaNumCtx(model) {
  return (
    resolveOllamaConfiguredNumCtx(model) ??
    Math.max(1, Math.floor(model.contextWindow ?? model.maxTokens ?? 2e5))
  );
}
/**
 * Resolves num_ctx for native /api/chat requests:
 *  1. explicit `params.num_ctx` set on the model wins,
 *  2. otherwise return undefined so Ollama's model, OLLAMA_CONTEXT_LENGTH,
 *     VRAM, or Modelfile policy decides.
 *
 * This intentionally differs from `resolveOllamaNumCtx` by not falling back
 * to `DEFAULT_CONTEXT_TOKENS`: that constant is a sane wrapper-side guess for
 * the OpenAI-compat path, but native `/api/chat` should not force the full
 * advertised catalog context for local models unless the operator opted in.
 */
function resolveOllamaNativeNumCtx(model) {
  return resolveOllamaConfiguredNumCtx(model);
}
function resolveOllamaModelOptions(model) {
  const options = {};
  const params = model.params;
  if (params && typeof params === "object" && !Array.isArray(params))
    for (const [key, value] of Object.entries(params)) {
      if (key === "num_ctx") continue;
      if (value !== void 0 && OLLAMA_OPTION_PARAM_KEYS.has(key)) options[key] = value;
    }
  const numCtx = resolveOllamaNativeNumCtx(model);
  if (numCtx !== void 0) options.num_ctx = numCtx;
  return options;
}
function normalizeOllamaGreedySamplingOptions(options) {
  if (options.temperature !== 0) return;
  if (
    options.top_p === void 0 ||
    (typeof options.top_p === "number" && Number.isFinite(options.top_p) && options.top_p !== 1)
  )
    options.top_p = 1;
}
function resolveOllamaTopLevelParams(model) {
  const requestParams = {};
  const params = model.params;
  if (params && typeof params === "object" && !Array.isArray(params)) {
    for (const [key, value] of Object.entries(params))
      if (value !== void 0 && OLLAMA_TOP_LEVEL_PARAM_KEYS.has(key)) requestParams[key] = value;
  }
  const think = resolveOllamaThinkParamValue(params);
  if (think !== void 0 && shouldForwardNativeOllamaThink(model, think)) requestParams.think = think;
  return Object.keys(requestParams).length > 0 ? requestParams : void 0;
}
function resolveStreamingTextDelta(previousText, nextText) {
  if (!nextText) return "";
  if (!previousText) return nextText;
  if (nextText.startsWith(previousText)) return nextText.slice(previousText.length);
  return nextText;
}
function createConfiguredOllamaCompatStreamWrapper(ctx) {
  let streamFn = ctx.streamFn;
  const model = ctx.model;
  let injectNumCtx = false;
  const isNativeOllamaTransport = model?.api === "ollama";
  if (model) {
    const providerId =
      typeof model.provider === "string" && model.provider.trim().length > 0
        ? model.provider
        : ctx.provider;
    if (
      shouldInjectOllamaCompatNumCtx({
        model,
        config: ctx.config,
        providerId,
      })
    )
      injectNumCtx = true;
  }
  if (injectNumCtx && model)
    streamFn = wrapOllamaCompatNumCtx(streamFn, resolveOllamaNumCtx(model));
  const configuredThinkValue = model ? resolveOllamaThinkParamValue(model.params) : void 0;
  const runtimeThinkValue = isNativeOllamaTransport
    ? resolveOllamaThinkValue(ctx.thinkingLevel)
    : void 0;
  const ollamaThinkValue =
    runtimeThinkValue === false && configuredThinkValue !== void 0 ? void 0 : runtimeThinkValue;
  if (ollamaThinkValue !== void 0 && shouldForwardNativeOllamaThink(model, ollamaThinkValue))
    streamFn = createOllamaThinkingWrapper(streamFn, ollamaThinkValue);
  if (
    normalizeProviderId(ctx.provider) === "ollama" &&
    shouldWrapOllamaCompatMoonshotThinking(ctx.modelId)
  ) {
    const thinkingType = resolveMoonshotThinkingType({
      configuredThinking: ctx.extraParams?.thinking,
      thinkingLevel: ctx.thinkingLevel,
    });
    streamFn = createMoonshotThinkingWrapper(streamFn, thinkingType);
  }
  return streamFn;
}
function buildOllamaChatRequest(params) {
  return {
    model: normalizeOllamaWireModelId(params.modelId, params.providerId),
    messages: params.messages,
    stream: params.stream ?? true,
    ...(params.tools && params.tools.length > 0 ? { tools: params.tools } : {}),
    ...(params.options ? { options: params.options } : {}),
    ...params.requestParams,
  };
}
const CHARS_PER_TOKEN_ESTIMATE = 4;
function buildUsageWithNoCost(params) {
  const input = params.input ?? 0;
  const output = params.output ?? 0;
  return {
    input,
    output,
    cacheRead: params.cacheRead ?? 0,
    cacheWrite: params.cacheWrite ?? 0,
    totalTokens: params.totalTokens ?? input + output,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      total: 0,
    },
  };
}
function buildStreamAssistantMessage(params) {
  return {
    role: "assistant",
    content: params.content,
    stopReason: params.stopReason,
    api: params.model.api,
    provider: params.model.provider,
    model: params.model.id,
    usage: params.usage,
    timestamp: params.timestamp ?? Date.now(),
  };
}
function buildStreamErrorAssistantMessage(params) {
  return {
    ...buildStreamAssistantMessage({
      model: params.model,
      content: [],
      stopReason: params.stopReason,
      usage: buildUsageWithNoCost({}),
      timestamp: params.timestamp,
    }),
    stopReason: params.stopReason,
    errorMessage: params.errorMessage,
  };
}
function safeJsonLength(value) {
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string" ? serialized.length : 0;
  } catch {
    return 0;
  }
}
function estimateTokensFromChars(chars) {
  if (!Number.isFinite(chars) || chars <= 0) return 0;
  return Math.max(1, Math.round(chars / CHARS_PER_TOKEN_ESTIMATE));
}
function resolveOllamaStopReason(response) {
  if (response.done_reason === "length") return "length";
  if (response.message.tool_calls?.length) return "toolUse";
  return "stop";
}
function estimateOllamaPromptTokens(params) {
  let chars = 0;
  for (const message of params.messages) {
    chars += message.content.length;
    chars += safeJsonLength(message.images);
    chars += safeJsonLength(message.tool_calls);
    chars += message.tool_name?.length ?? 0;
  }
  chars += safeJsonLength(params.tools);
  return estimateTokensFromChars(chars);
}
function estimateOllamaCompletionTokens(response, extraOutputChars = 0) {
  return estimateTokensFromChars(
    extraOutputChars +
      response.message.content.length +
      (response.message.thinking?.length ?? 0) +
      (response.message.reasoning?.length ?? 0) +
      safeJsonLength(response.message.tool_calls),
  );
}
function resolveUsageCount(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof fallback === "number" && Number.isFinite(fallback) && fallback > 0) return fallback;
  return 0;
}
function extractTextContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}
function extractOllamaImages(content) {
  if (!Array.isArray(content)) return [];
  return content.filter((part) => part.type === "image").map((part) => part.data);
}
function ensureArgsObject(value) {
  return parseJsonObjectPreservingUnsafeIntegers(value) ?? {};
}
function normalizeOllamaToolCallArguments(value) {
  return ensureArgsObject(value);
}
function inferOllamaSchemaType(schema) {
  if (schema.properties && isRecord(schema.properties)) return "object";
  if (schema.items) return "array";
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    const values = schema.enum.filter((value) => value !== null);
    if (values.length > 0 && values.every((value) => typeof value === "string")) return "string";
    if (values.length > 0 && values.every((value) => typeof value === "number")) return "number";
    if (values.length > 0 && values.every((value) => typeof value === "boolean")) return "boolean";
  }
  for (const unionKey of ["anyOf", "oneOf"]) {
    const variants = schema[unionKey];
    if (!Array.isArray(variants)) continue;
    for (const variant of variants) {
      if (!isRecord(variant)) continue;
      const variantType = variant.type;
      if (typeof variantType === "string" && variantType !== "null") return variantType;
      if (Array.isArray(variantType)) {
        const firstType = variantType.find(
          (entry) => typeof entry === "string" && entry !== "null",
        );
        if (firstType) return firstType;
      }
      const inferred = inferOllamaSchemaType(variant);
      if (inferred) return inferred;
    }
  }
}
function normalizeOllamaToolSchema(schema, isRoot = false) {
  if (!isRecord(schema))
    return {
      type: "object",
      properties: {},
    };
  const normalized = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "properties" && isRecord(value)) {
      normalized.properties = Object.fromEntries(
        Object.entries(value).map(([propertyName, propertySchema]) => [
          propertyName,
          normalizeOllamaToolSchema(propertySchema),
        ]),
      );
      continue;
    }
    if (key === "items") {
      normalized.items = Array.isArray(value)
        ? value.map((entry) => normalizeOllamaToolSchema(entry))
        : normalizeOllamaToolSchema(value);
      continue;
    }
    if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
      normalized[key] = value.map((entry) => normalizeOllamaToolSchema(entry));
      continue;
    }
    normalized[key] = value;
  }
  const schemaType = normalized.type;
  if (
    typeof schemaType !== "string" &&
    (!Array.isArray(schemaType) ||
      !schemaType.some((entry) => typeof entry === "string" && entry !== "null"))
  )
    normalized.type = inferOllamaSchemaType(normalized) ?? (isRoot ? "object" : "string");
  if (normalized.type === "object" && !isRecord(normalized.properties)) normalized.properties = {};
  return normalized;
}
function readOllamaToolCallId(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function extractToolCalls(content, options = {}) {
  if (!Array.isArray(content)) return [];
  const parts = content;
  const result = [];
  for (const part of parts)
    if (part.type === "toolCall") {
      const id = readOllamaToolCallId(part.id);
      result.push({
        ...(id ? { id } : {}),
        function: {
          name: normalizeOllamaToolCallName(part.name, options),
          arguments: ensureArgsObject(part.arguments),
        },
      });
    } else if (part.type === "tool_use") {
      const id = readOllamaToolCallId(part.id);
      result.push({
        ...(id ? { id } : {}),
        function: {
          name: normalizeOllamaToolCallName(part.name, options),
          arguments: ensureArgsObject(part.input),
        },
      });
    }
  return result;
}
function buildOllamaToolNameSet(tools) {
  if (!tools || !Array.isArray(tools)) return;
  const names = /* @__PURE__ */ new Set();
  for (const tool of tools)
    if (typeof tool.name === "string" && tool.name.trim()) names.add(tool.name.trim());
  return names.size > 0 ? names : void 0;
}
function normalizeOllamaToolCallName(rawName, options = {}) {
  const trimmed = rawName.trim();
  if (!trimmed) return trimmed;
  const availableToolNames = options.availableToolNames;
  if (availableToolNames?.has(trimmed)) return trimmed;
  const strippedAnySeparator = trimmed.replace(/^(?:functions?|tools?)[./_-]+/iu, "").trim();
  if (
    availableToolNames &&
    strippedAnySeparator !== trimmed &&
    availableToolNames.has(strippedAnySeparator)
  )
    return strippedAnySeparator;
  if (availableToolNames) return trimmed;
  return trimmed.replace(/^(?:functions?|tools?)[./]+/iu, "").trim();
}
function convertToOllamaMessages(messages, system, options = {}) {
  const result = [];
  if (system)
    result.push({
      role: "system",
      content: system,
    });
  for (const msg of messages) {
    if (msg.role === "user") {
      const text = extractTextContent(msg.content);
      const images = extractOllamaImages(msg.content);
      result.push({
        role: "user",
        content: text,
        ...(images.length > 0 ? { images } : {}),
      });
      continue;
    }
    if (msg.role === "assistant") {
      const text = extractTextContent(msg.content);
      const toolCalls = extractToolCalls(msg.content, options);
      result.push({
        role: "assistant",
        content: text,
        ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}),
      });
      continue;
    }
    if (msg.role === "tool" || msg.role === "toolResult") {
      const text = extractTextContent(msg.content);
      const toolName = typeof msg.toolName === "string" ? msg.toolName : void 0;
      result.push({
        role: "tool",
        content: text,
        ...(toolName ? { tool_name: toolName } : {}),
      });
    }
  }
  return result;
}
function extractOllamaTools(tools) {
  if (!tools || !Array.isArray(tools)) return [];
  const result = [];
  for (const tool of tools) {
    if (typeof tool.name !== "string" || !tool.name) continue;
    result.push({
      type: "function",
      function: {
        name: tool.name,
        description: typeof tool.description === "string" ? tool.description : "",
        parameters: normalizeOllamaToolSchema(tool.parameters, true),
      },
    });
  }
  return result;
}
function buildAssistantMessage(response, modelInfo, usageFallback, options = {}) {
  const content = [];
  const thinking =
    modelInfo.reasoning === false
      ? ""
      : (response.message.thinking ?? response.message.reasoning ?? "");
  if (thinking)
    content.push({
      type: "thinking",
      thinking,
    });
  const rawText = response.message.content || "";
  const text =
    options.sanitizeVisibleContent === false
      ? rawText
      : sanitizeOllamaFinalVisibleContent({
          modelId: modelInfo.id,
          text: rawText,
        });
  if (text)
    content.push({
      type: "text",
      text,
    });
  const toolCalls = response.message.tool_calls;
  if (toolCalls && toolCalls.length > 0)
    for (const toolCall of toolCalls)
      content.push({
        type: "toolCall",
        id: readOllamaToolCallId(toolCall.id) ?? `ollama_call_${randomUUID()}`,
        name: normalizeOllamaToolCallName(toolCall.function.name, options),
        arguments: normalizeOllamaToolCallArguments(toolCall.function.arguments),
      });
  return buildStreamAssistantMessage({
    model: modelInfo,
    content,
    stopReason: resolveOllamaStopReason(response),
    usage: buildUsageWithNoCost({
      input: resolveUsageCount(response.prompt_eval_count, usageFallback?.input),
      output: resolveUsageCount(response.eval_count, usageFallback?.output),
    }),
  });
}
async function* parseNdjsonStream(reader) {
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        yield parseJsonPreservingUnsafeIntegers(trimmed);
      } catch {
        log.warn(`Skipping malformed NDJSON line: ${truncateUtf16Safe(trimmed, 120)}`);
      }
    }
  }
  if (buffer.trim())
    try {
      yield parseJsonPreservingUnsafeIntegers(buffer.trim());
    } catch {
      log.warn(`Skipping malformed trailing data: ${truncateUtf16Safe(buffer.trim(), 120)}`);
    }
}
function resolveOllamaChatUrl(baseUrl) {
  return `${baseUrl.trim().replace(/\/+$/, "").replace(/\/v1$/i, "") || OLLAMA_NATIVE_BASE_URL}/api/chat`;
}
function resolveOllamaModelHeaders(model) {
  if (!model.headers || typeof model.headers !== "object" || Array.isArray(model.headers)) return;
  return model.headers;
}
function resolveOllamaRequestTimeoutMs(model, options) {
  const raw = options?.requestTimeoutMs ?? options?.timeoutMs ?? model.requestTimeoutMs;
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : void 0;
}
function createRawOllamaStreamFn(baseUrl, defaultHeaders) {
  const chatUrl = resolveOllamaChatUrl(baseUrl);
  const ssrfPolicy = buildOllamaBaseUrlSsrFPolicy(chatUrl);
  return (model, context, options) => {
    const stream = createAssistantMessageEventStream();
    const run = async () => {
      try {
        const availableToolNames = buildOllamaToolNameSet(context.tools);
        const toolCallNameOptions = availableToolNames ? { availableToolNames } : {};
        const ollamaMessages = convertToOllamaMessages(
          context.messages ?? [],
          context.systemPrompt,
          toolCallNameOptions,
        );
        const ollamaTools = extractOllamaTools(context.tools);
        const ollamaOptions = resolveOllamaModelOptions(model);
        if (typeof options?.temperature === "number")
          ollamaOptions.temperature = options.temperature;
        if (typeof options?.maxTokens === "number") ollamaOptions.num_predict = options.maxTokens;
        normalizeOllamaGreedySamplingOptions(ollamaOptions);
        const body = buildOllamaChatRequest({
          modelId: model.id,
          providerId: model.provider,
          messages: ollamaMessages,
          stream: true,
          tools: ollamaTools,
          options: ollamaOptions,
          requestParams: resolveOllamaTopLevelParams(model),
        });
        options?.onPayload?.(body, model);
        const headers = {
          "Content-Type": "application/json",
          ...defaultHeaders,
          ...options?.headers,
        };
        if (options?.apiKey && (!headers.Authorization || !isNonSecretApiKeyMarker(options.apiKey)))
          headers.Authorization = `Bearer ${options.apiKey}`;
        const { response, release } = await fetchWithSsrFGuard({
          url: chatUrl,
          init: {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          },
          policy: ssrfPolicy,
          ...(options?.signal ? { signal: options.signal } : {}),
          timeoutMs: resolveOllamaRequestTimeoutMs(model, options),
          auditContext: "ollama-stream.chat",
        });
        try {
          if (!response.ok) {
            const errorText = await readResponseTextLimited(
              response,
              OLLAMA_STREAM_ERROR_BODY_LIMIT_BYTES,
            ).catch(() => "unknown error");
            throw new Error(`${response.status} ${errorText}`);
          }
          if (!response.body) throw new Error("Ollama API returned empty response body");
          const reader = response.body.getReader();
          let accumulatedRawContent = "";
          let accumulatedVisibleContent = "";
          let accumulatedThinking = "";
          let suppressedThinking = "";
          const accumulatedToolCalls = [];
          let finalResponse;
          let pendingFinalVisibleContent;
          const modelInfo = {
            api: model.api,
            provider: model.provider,
            id: model.id,
            reasoning: model.reasoning,
          };
          const shouldEmitThinking = model.reasoning ?? true;
          const visibleContentSanitizer = createOllamaVisibleContentSanitizer(model.id);
          const cooperativeScheduler = createOllamaStreamCooperativeScheduler(options?.signal);
          let streamStarted = false;
          let thinkingStarted = false;
          let thinkingEnded = false;
          let textBlockStarted = false;
          let textBlockClosed = false;
          const textContentIndex = () => (thinkingStarted ? 1 : 0);
          const buildCurrentContent = () => {
            const parts = [];
            if (accumulatedThinking)
              parts.push({
                type: "thinking",
                thinking: accumulatedThinking,
              });
            if (accumulatedVisibleContent)
              parts.push({
                type: "text",
                text: accumulatedVisibleContent,
              });
            return parts;
          };
          const closeThinkingBlock = () => {
            if (!thinkingStarted || thinkingEnded) return;
            thinkingEnded = true;
            const partial = buildStreamAssistantMessage({
              model: modelInfo,
              content: buildCurrentContent(),
              stopReason: "stop",
              usage: buildUsageWithNoCost({}),
            });
            stream.push({
              type: "thinking_end",
              contentIndex: 0,
              content: accumulatedThinking,
              partial,
            });
          };
          const closeTextBlock = () => {
            if (!textBlockStarted || textBlockClosed) return;
            textBlockClosed = true;
            const partial = buildStreamAssistantMessage({
              model: modelInfo,
              content: buildCurrentContent(),
              stopReason: "stop",
              usage: buildUsageWithNoCost({}),
            });
            stream.push({
              type: "text_end",
              contentIndex: textContentIndex(),
              content: accumulatedVisibleContent,
              partial,
            });
          };
          const flushVisibleText = (nextVisibleContent) => {
            if (nextVisibleContent === void 0) return;
            const delta = resolveStreamingTextDelta(accumulatedVisibleContent, nextVisibleContent);
            if (!delta) return;
            if (thinkingStarted && !thinkingEnded) closeThinkingBlock();
            if (!streamStarted) {
              streamStarted = true;
              const emptyPartial = buildStreamAssistantMessage({
                model: modelInfo,
                content: [],
                stopReason: "stop",
                usage: buildUsageWithNoCost({}),
              });
              stream.push({
                type: "start",
                partial: emptyPartial,
              });
            }
            if (!textBlockStarted) {
              textBlockStarted = true;
              const partial = buildStreamAssistantMessage({
                model: modelInfo,
                content: buildCurrentContent(),
                stopReason: "stop",
                usage: buildUsageWithNoCost({}),
              });
              stream.push({
                type: "text_start",
                contentIndex: textContentIndex(),
                partial,
              });
            }
            accumulatedVisibleContent = nextVisibleContent;
            stream.push({
              type: "text_delta",
              contentIndex: textContentIndex(),
              delta,
            });
          };
          const resolveVisibleContent = (final) => {
            const resolution = visibleContentSanitizer.resolveStreamText({
              text: accumulatedRawContent,
              final,
            });
            if (resolution.kind === "pending") return;
            return resolution.text;
          };
          for await (const chunk of parseNdjsonStream(reader)) {
            throwIfOllamaStreamAborted(options?.signal);
            const thinkingDelta = chunk.message?.thinking ?? chunk.message?.reasoning;
            if (thinkingDelta && shouldEmitThinking) {
              if (!streamStarted) {
                streamStarted = true;
                const emptyPartial = buildStreamAssistantMessage({
                  model: modelInfo,
                  content: [],
                  stopReason: "stop",
                  usage: buildUsageWithNoCost({}),
                });
                stream.push({
                  type: "start",
                  partial: emptyPartial,
                });
              }
              if (!thinkingStarted) {
                thinkingStarted = true;
                const partial = buildStreamAssistantMessage({
                  model: modelInfo,
                  content: buildCurrentContent(),
                  stopReason: "stop",
                  usage: buildUsageWithNoCost({}),
                });
                stream.push({
                  type: "thinking_start",
                  contentIndex: 0,
                  partial,
                });
              }
              accumulatedThinking += thinkingDelta;
              const partial = buildStreamAssistantMessage({
                model: modelInfo,
                content: buildCurrentContent(),
                stopReason: "stop",
                usage: buildUsageWithNoCost({}),
              });
              stream.push({
                type: "thinking_delta",
                contentIndex: 0,
                delta: thinkingDelta,
                partial,
              });
            }
            if (thinkingDelta && !shouldEmitThinking) suppressedThinking += thinkingDelta;
            if (chunk.message?.content) {
              const rawDelta = chunk.message.content;
              accumulatedRawContent += rawDelta;
              flushVisibleText(resolveVisibleContent(false));
            }
            if (chunk.message?.tool_calls) {
              closeThinkingBlock();
              closeTextBlock();
              accumulatedToolCalls.push(...chunk.message.tool_calls);
            }
            if (chunk.done) {
              pendingFinalVisibleContent = resolveVisibleContent(true);
              finalResponse = chunk;
              break;
            }
            await cooperativeScheduler.afterEvent();
          }
          if (!finalResponse) throw new Error(OLLAMA_INCOMPLETE_STREAM_ERROR);
          if (
            pendingFinalVisibleContent !== void 0 &&
            isLikelyGarbledVisibleText({
              text: pendingFinalVisibleContent,
              modelId: model.id,
            })
          )
            throw new Error(
              `Ollama returned non-linguistic garbled visible text for ${model.id}; retry or switch models`,
            );
          flushVisibleText(pendingFinalVisibleContent);
          if (
            isLikelyGarbledVisibleText({
              text: accumulatedVisibleContent,
              modelId: model.id,
            })
          )
            throw new Error(
              `Ollama returned non-linguistic garbled visible text for ${model.id}; retry or switch models`,
            );
          finalResponse.message.content = accumulatedVisibleContent;
          if (accumulatedThinking) finalResponse.message.thinking = accumulatedThinking;
          if (accumulatedToolCalls.length > 0)
            finalResponse.message.tool_calls = accumulatedToolCalls;
          const usageFallback = {
            input: estimateOllamaPromptTokens({
              messages: ollamaMessages,
              tools: ollamaTools,
            }),
            output: estimateOllamaCompletionTokens(finalResponse, suppressedThinking.length),
          };
          const assistantMessage = buildAssistantMessage(finalResponse, modelInfo, usageFallback, {
            ...toolCallNameOptions,
            sanitizeVisibleContent: false,
          });
          closeThinkingBlock();
          closeTextBlock();
          stream.push({
            type: "done",
            reason: resolveOllamaStopReason(finalResponse),
            message: assistantMessage,
          });
        } finally {
          await release();
        }
      } catch (err) {
        const stopReason = options?.signal?.aborted ? "aborted" : "error";
        stream.push({
          type: "error",
          reason: stopReason,
          error: buildStreamErrorAssistantMessage({
            model,
            stopReason,
            errorMessage: formatErrorMessage(err),
          }),
        });
      } finally {
        stream.end();
      }
    };
    queueMicrotask(() => void run());
    return stream;
  };
}
function createOllamaStreamFn(baseUrl, defaultHeaders) {
  return createPlainTextToolCallCompatWrapper(createRawOllamaStreamFn(baseUrl, defaultHeaders));
}
function createConfiguredOllamaStreamFn(params) {
  return createOllamaStreamFn(
    resolveOllamaBaseUrlForRun({
      modelBaseUrl: readStringValue(params.model.baseUrl),
      providerBaseUrl: params.providerBaseUrl,
    }),
    resolveOllamaModelHeaders(params.model),
  );
}
//#endregion
export {
  convertToOllamaMessages as a,
  createOllamaStreamFn as c,
  resolveConfiguredOllamaProviderConfig as d,
  resolveOllamaBaseUrlForRun as f,
  normalizeOllamaWireModelId as g,
  wrapOllamaCompatNumCtx as h,
  buildOllamaChatRequest as i,
  isOllamaCompatProvider as l,
  shouldInjectOllamaCompatNumCtx as m,
  OLLAMA_NATIVE_BASE_URL as n,
  createConfiguredOllamaCompatStreamWrapper as o,
  resolveOllamaCompatNumCtxEnabled as p,
  buildAssistantMessage as r,
  createConfiguredOllamaStreamFn as s,
  OLLAMA_INCOMPLETE_STREAM_ERROR as t,
  parseNdjsonStream as u,
};
