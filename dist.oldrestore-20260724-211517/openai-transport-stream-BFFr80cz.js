import { randomUUID } from "node:crypto";
import { resolveModelBoundThinkingReplayMode } from "@openclaw/ai/internal/anthropic";
import {
  clampOpenAIPromptCacheKey,
  convertMessages,
  findOpenAIStrictToolProjectionDiagnostics,
  isOpenAICompatibleAzureResponsesBaseUrl,
  isOpenAIGpt54MiniModel,
  isOpenAIGpt55Model,
  isOpenAIGpt56Model,
  isResponsesTextContentPartType,
  isResponsesTextDeltaEventType,
  mapOpenAIStopReason,
  normalizeOpenAIReasoningEffort,
  normalizeOpenAIStrictToolParameters,
  projectOpenAITools,
  reconcileOpenAICompletionsToolChoice,
  reconcileOpenAIResponsesToolChoice,
  resolveAzureDeploymentNameFromMap,
  resolveOpenAIProjectedToolsStrictToolFlag,
  resolveOpenAIReasoningEffortForModel,
  resolveResponsesMessageSnapshotCollapse,
  supportsOpenAIReasoningEffort,
} from "@openclaw/ai/internal/openai";
import {
  applyProviderReportedUsageCost,
  calculateCost,
  createFirstStreamEventAbortController,
  createReasoningTagTextPartitioner,
  getEnvApiKey,
  getFirstStreamEventTimeoutHandler,
  getFirstStreamEventTimeoutMs,
  parseStreamingJson,
  withFirstStreamEventTimeout,
} from "@openclaw/ai/internal/runtime";
import {
  describeToolResultMediaPlaceholder,
  extractToolResultText,
  sanitizeSurrogates,
  stripSystemPromptCacheBoundary,
} from "@openclaw/ai/internal/shared";
import OpenAI, { AzureOpenAI } from "openai";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import { t as estimateStringChars } from "./cjk-chars-0PtNN_-l.js";
import { s as isCodeModeModelVisibleToolName } from "./code-mode-control-tools-B27uc_a6.js";
import {
  c as hasCopilotVisionInput,
  o as buildCopilotDynamicHeaders,
} from "./copilot-dynamic-headers-CF9zPORX.js";
import { a as sha256Hex, o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { r as sanitizeInlineImageDataUrl } from "./inline-image-data-url-oC-MoRLP.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { t as detectOpenAICompletionsCompat } from "./openai-completions-compat-BGoOy8vy.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-CdW1rMjo.js";
import { _ as truncateErrorDetail } from "./provider-http-errors-DLMRBkZU.js";
import { l as resolveProviderRequestPolicyConfig } from "./provider-request-config-DpW-uV6A.js";
import { F as resolveProviderTransportTurnStateWithPlugin } from "./provider-runtime-DyIHJ2cX.js";
import {
  h as isGoogleGemini3ProModel,
  j as resolveOpenAIReasoningEffortMap,
  m as isGoogleGemini3FlashModel,
} from "./provider-stream-shared-CMy-5I0G.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { t as redactIdentifier } from "./redact-identifier-CRU-WC7p.js";
import { n as repairToolUseResultPairing } from "./session-transcript-repair-BI2d8Y2b.js";
import {
  a as buildGuardedModelFetch,
  c as formatModelTransportDebugBaseUrl,
  d as resolveModelSseDebugMode,
  f as resolveOpenAIStrictToolSetting,
  l as emitModelTransportDebug,
  o as resolveModelRequestTimeoutMs,
  u as resolveModelPayloadDebugMode,
} from "./stream-DzNMuPw6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  p as readStringValue,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/replay-turn-classification.ts
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
function hasOnlyAssistantReasoningContent(message) {
  if (message.role !== "assistant") return false;
  const content = Array.isArray(message.content)
    ? message.content
    : message.content != null && typeof message.content === "object"
      ? [message.content]
      : [];
  let hasThinking = false;
  for (const block of content) {
    if (!block || typeof block !== "object") return false;
    const record = block;
    if (record.type === "thinking" || record.type === "redacted_thinking") {
      hasThinking = true;
      continue;
    }
    if (record.type === "text" && typeof record.text === "string" && !record.text.trim()) continue;
    return false;
  }
  return hasThinking;
}
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
function isReasoningOnlyLengthAssistantTurn(message) {
  return message.stopReason === "length" && hasOnlyAssistantReasoningContent(message);
}
//#endregion
//#region src/agents/transport-message-transform.ts
const SYNTHETIC_TOOL_RESULT_APIS = /* @__PURE__ */ new Set([
  "anthropic-messages",
  "openclaw-anthropic-messages-transport",
  "bedrock-converse-stream",
  "google-generative-ai",
  "openclaw-google-generative-ai-transport",
  "openai-responses",
  "openai-chatgpt-responses",
  "azure-openai-responses",
  "openclaw-openai-responses-transport",
  "openclaw-azure-openai-responses-transport",
]);
const CODEX_STYLE_ABORTED_OUTPUT_APIS = /* @__PURE__ */ new Set([
  "openai-responses",
  "openai-chatgpt-responses",
  "azure-openai-responses",
  "openclaw-openai-responses-transport",
  "openclaw-azure-openai-responses-transport",
]);
function defaultAllowSyntheticToolResults(modelApi) {
  return SYNTHETIC_TOOL_RESULT_APIS.has(modelApi);
}
function isFailedAssistantTurn(message) {
  if (message.role !== "assistant") return false;
  return (
    message.stopReason === "error" ||
    message.stopReason === "aborted" ||
    isReasoningOnlyLengthAssistantTurn(message)
  );
}
/** Transforms transcript messages into a provider-safe replay context. */
function transformTransportMessages(messages, model, normalizeToolCallId, options) {
  const allowSyntheticToolResults = defaultAllowSyntheticToolResults(model.api);
  const syntheticToolResultText = CODEX_STYLE_ABORTED_OUTPUT_APIS.has(model.api)
    ? "aborted"
    : "No result provided";
  const toolCallIdMap = /* @__PURE__ */ new Map();
  const replayable = messages
    .map((msg) => {
      if (msg.role === "user") return msg;
      if (msg.role === "toolResult") {
        const normalizedId = toolCallIdMap.get(msg.toolCallId);
        return normalizedId && normalizedId !== msg.toolCallId
          ? {
              ...msg,
              toolCallId: normalizedId,
            }
          : msg;
      }
      if (msg.role !== "assistant") return msg;
      const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
        source: {
          provider: msg.provider,
          api: msg.api,
          modelId: msg.model,
          responseModelId: msg.responseModel,
        },
        target: {
          provider: model.provider,
          api: model.api,
          modelId: model.id,
          modelParams: model.params,
        },
      });
      const isSameModel =
        modelBoundThinkingReplayMode === "preserve" ||
        (msg.provider === model.provider && msg.api === model.api && msg.model === model.id);
      const sourceContent = Array.isArray(msg.content)
        ? msg.content
        : msg.content != null && typeof msg.content === "object"
          ? [msg.content]
          : [];
      const content = [];
      for (const block of sourceContent) {
        if (block.type === "thinking") {
          if (modelBoundThinkingReplayMode === "drop") continue;
          if (block.redacted) {
            if (isSameModel) content.push(block);
            continue;
          }
          if (isSameModel && block.thinkingSignature) {
            content.push(block);
            continue;
          }
          if (!block.thinking.trim()) continue;
          content.push(
            isSameModel
              ? block
              : {
                  type: "text",
                  text: block.thinking,
                },
          );
          continue;
        }
        if (block.type === "text") {
          content.push(
            isSameModel
              ? block
              : {
                  type: "text",
                  text: block.text,
                },
          );
          continue;
        }
        if (block.type !== "toolCall") {
          content.push(block);
          continue;
        }
        let normalizedToolCall = block;
        if (
          !isSameModel &&
          block.thoughtSignature &&
          options?.preserveCrossModelToolCallThoughtSignature !== true
        ) {
          normalizedToolCall = { ...normalizedToolCall };
          delete normalizedToolCall.thoughtSignature;
        }
        if (
          (!isSameModel || options?.normalizeSameModelToolCallIds === true) &&
          normalizeToolCallId
        ) {
          const normalizedId = normalizeToolCallId(block.id, model, msg);
          if (normalizedId !== block.id) {
            toolCallIdMap.set(block.id, normalizedId);
            normalizedToolCall = {
              ...normalizedToolCall,
              id: normalizedId,
            };
          }
        }
        content.push(normalizedToolCall);
      }
      return {
        ...msg,
        content,
      };
    })
    .filter((_, index) => {
      const original = messages[index];
      return original ? !isFailedAssistantTurn(original) : true;
    });
  if (!allowSyntheticToolResults) return replayable;
  return repairToolUseResultPairing(replayable, {
    erroredAssistantResultPolicy: "drop",
    missingToolResultText: syntheticToolResultText,
  }).messages;
}
//#endregion
//#region src/agents/transport-stream-shared.ts
/**
 * Shared transport-stream normalization helpers.
 *
 * Sanitizes provider payloads, merges metadata, and formats streamed assistant events.
 */
const EMPTY_TOOL_RESULT_TEXT = "(no output)";
/**
 * Encodes an assistant text-block phase signature (v1). Channels and the
 * embedded handler read this to route commentary/narration out of the final
 * reply. Shared so every provider transport tags phases identically.
 */
function encodeAssistantTextSignatureV1(id, phase) {
  return JSON.stringify({
    v: 1,
    id,
    ...(phase ? { phase } : {}),
  });
}
function sanitizeTransportPayloadText(text) {
  if (typeof text !== "string") return "";
  return sanitizeSurrogates(text);
}
function sanitizeNonEmptyTransportPayloadText(text, fallback = EMPTY_TOOL_RESULT_TEXT) {
  const sanitized = sanitizeTransportPayloadText(text);
  return sanitized.trim().length > 0 ? sanitized : fallback;
}
function coerceTransportToolCallArguments(argumentsValue) {
  if (argumentsValue && typeof argumentsValue === "object" && !Array.isArray(argumentsValue))
    return argumentsValue;
  if (typeof argumentsValue === "string")
    try {
      const parsed = JSON.parse(argumentsValue);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {}
  return {};
}
function mergeTransportHeaders(...headerSources) {
  const merged = {};
  for (const headers of headerSources) if (headers) Object.assign(merged, headers);
  return Object.keys(merged).length > 0 ? merged : void 0;
}
function mergeTransportMetadata(payload, metadata) {
  if (!metadata || Object.keys(metadata).length === 0) return payload;
  const existingMetadata =
    payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata)
      ? payload.metadata
      : void 0;
  return {
    ...payload,
    metadata: {
      ...existingMetadata,
      ...metadata,
    },
  };
}
function createEmptyTransportUsage() {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      total: 0,
    },
  };
}
function createWritableTransportEventStream() {
  const eventStream = (0, event_stream_exports.createAssistantMessageEventStream)();
  return {
    eventStream,
    stream: eventStream,
  };
}
function finalizeTransportStream(params) {
  const { stream, output, signal } = params;
  if (signal?.aborted) throw new Error("Request was aborted");
  if (output.stopReason === "aborted" || output.stopReason === "error")
    throw new Error(output.errorMessage ?? "An unknown error occurred");
  stream.push({
    type: "done",
    reason: output.stopReason,
    message: output,
  });
  stream.end();
}
function readStringLikeProperty(value, key) {
  if (!value || typeof value !== "object") return;
  const raw = value[key];
  if (typeof raw === "string") return raw.trim() || void 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
}
function readObjectProperty(value, key) {
  if (!value || typeof value !== "object") return;
  const raw = value[key];
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : void 0;
}
function stringifyErrorBody(value) {
  if (typeof value === "string") return value;
  if (value === void 0 || value === null) return;
  try {
    return JSON.stringify(value);
  } catch {
    return;
  }
}
function stringifyTransportErrorMessage(value) {
  if (value instanceof Error) return value.message;
  const encoded = stringifyErrorBody(value);
  if (encoded !== void 0) return encoded;
  try {
    return String(value);
  } catch {
    return;
  }
}
function normalizeTransportErrorBody(value) {
  const text = stringifyErrorBody(value);
  if (!text?.trim()) return;
  return truncateErrorDetail(redactSensitiveText(text), 500);
}
function extractTransportErrorDetails(error) {
  const errorObject = error && typeof error === "object" ? error : void 0;
  const nestedError = readObjectProperty(errorObject, "error");
  const errorCode =
    readStringLikeProperty(errorObject, "errorCode") ??
    readStringLikeProperty(errorObject, "code") ??
    readStringLikeProperty(nestedError, "code");
  const errorType =
    readStringLikeProperty(errorObject, "errorType") ??
    readStringLikeProperty(errorObject, "type") ??
    readStringLikeProperty(nestedError, "type");
  const errorBody =
    normalizeTransportErrorBody(readStringLikeProperty(errorObject, "errorBody")) ??
    normalizeTransportErrorBody(readStringLikeProperty(errorObject, "body")) ??
    normalizeTransportErrorBody(readObjectProperty(errorObject, "body")) ??
    normalizeTransportErrorBody(nestedError);
  return {
    ...(errorCode ? { errorCode } : {}),
    ...(errorType ? { errorType } : {}),
    ...(errorBody ? { errorBody } : {}),
  };
}
function assignTransportErrorDetails(output, error, signal) {
  output.stopReason = signal?.aborted ? "aborted" : "error";
  output.errorMessage = stringifyTransportErrorMessage(error);
  Object.assign(output, extractTransportErrorDetails(error));
}
function failTransportStream(params) {
  const { stream, output, signal, error, cleanup } = params;
  cleanup?.();
  assignTransportErrorDetails(output, error, signal);
  stream.push({
    type: "error",
    reason: output.stopReason,
    error: output,
  });
  stream.end();
}
//#endregion
//#region src/agents/deepseek-text-filter.ts
/**
 * DeepSeek DSML streaming text filter.
 * Removes provider-emitted DSML tool markup while buffering split tag prefixes
 * across streamed chunks.
 */
const DSML_KINDS = ["tool_use_error", "tool_calls", "tool_call", "function_calls"];
const DSML_BARS = ["|", "｜"];
const DSML_OPEN_TOKENS = DSML_BARS.flatMap((bar) =>
  DSML_KINDS.map((kind) => `<${bar}DSML${bar}${kind}>`),
);
const DSML_CLOSE_TOKENS = DSML_BARS.flatMap((bar) =>
  DSML_KINDS.map((kind) => `</${bar}DSML${bar}${kind}>`),
);
const MAX_OPEN_TOKEN_LEN = Math.max(...DSML_OPEN_TOKENS.map((token) => token.length));
const MAX_CLOSE_TOKEN_LEN = Math.max(...DSML_CLOSE_TOKENS.map((token) => token.length));
/** Create an incremental text filter that strips DeepSeek DSML tool blocks. */
function createDeepSeekTextFilter() {
  let buffer = "";
  let insideDsml = false;
  const consume = (final) => {
    const output = [];
    const emit = (text) => {
      if (text) output.push(text);
    };
    while (buffer) {
      if (insideDsml) {
        const close = findEarliestToken(buffer, DSML_CLOSE_TOKENS);
        if (close) {
          buffer = buffer.slice(close.index + close.token.length);
          insideDsml = false;
          continue;
        }
        const keep = final ? 0 : Math.min(buffer.length, MAX_CLOSE_TOKEN_LEN - 1);
        buffer = buffer.slice(buffer.length - keep);
        if (final) insideDsml = false;
        return output;
      }
      const open = findEarliestToken(buffer, DSML_OPEN_TOKENS);
      if (open) {
        emit(buffer.slice(0, open.index));
        buffer = buffer.slice(open.index + open.token.length);
        insideDsml = true;
        continue;
      }
      if (final) {
        emit(buffer);
        buffer = "";
        return output;
      }
      const keep = longestDsmlOpenPrefixSuffixLength(buffer);
      const emitLength = buffer.length - keep;
      if (emitLength <= 0) return output;
      emit(buffer.slice(0, emitLength));
      buffer = buffer.slice(emitLength);
      return output;
    }
    return output;
  };
  return {
    push(chunk) {
      buffer += chunk;
      return consume(false);
    },
    flush() {
      return consume(true);
    },
  };
}
function findEarliestToken(text, tokens) {
  let best = null;
  for (const token of tokens) {
    const index = text.indexOf(token);
    if (index !== -1 && (!best || index < best.index))
      best = {
        index,
        token,
      };
  }
  return best;
}
function longestDsmlOpenPrefixSuffixLength(text) {
  const maxLength = Math.min(text.length, MAX_OPEN_TOKEN_LEN - 1);
  for (let length = maxLength; length > 0; length--) {
    const suffix = text.slice(text.length - length);
    if (DSML_OPEN_TOKENS.some((token) => token.startsWith(suffix))) return length;
  }
  return 0;
}
//#endregion
//#region src/agents/model-max-tokens-params.ts
/**
 * Max-token parameter normalization across provider/native naming variants.
 * Callers canonicalize aliases before dispatch so payloads cannot carry
 * conflicting limits.
 */
const MAX_TOKENS_PARAM_KEYS = ["maxTokens", "max_completion_tokens", "max_tokens"];
/** Return a finite non-negative max-token value, or undefined for invalid input. */
function resolveNonNegativeMaxTokensParam(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
/** Resolve the first supported max-token parameter present in a params object. */
function resolveMaxTokensParam(params) {
  if (!params) return;
  for (const key of MAX_TOKENS_PARAM_KEYS) {
    const resolved = resolveNonNegativeMaxTokensParam(params[key]);
    if (resolved !== void 0) return resolved;
  }
}
/**
 * Canonicalize merged params to `maxTokens`, preserving source precedence from
 * left to right across the provided source objects.
 */
function canonicalizeMaxTokensParam(params) {
  let resolved;
  for (const source of params.sources) {
    const sourceValue = resolveMaxTokensParam(source);
    if (sourceValue !== void 0) resolved = sourceValue;
  }
  if (resolved === void 0) return;
  for (const key of MAX_TOKENS_PARAM_KEYS) delete params.merged[key];
  params.merged.maxTokens = resolved;
}
//#endregion
//#region src/agents/model-tool-support.ts
/**
 * Model capability helper for tool-use support.
 *
 * Provider catalogs can opt a model out via `compat.supportsTools === false`;
 * absent metadata remains permissive for older catalog entries.
 */
/** Returns whether a catalog model should be offered tool calls. */
function supportsModelTools(model) {
  return (
    (model.compat && typeof model.compat === "object" ? model.compat : void 0)?.supportsTools !==
    false
  );
}
//#endregion
//#region src/agents/openai-compatible-conversation-turn.ts
/**
 * OpenAI-compatible conversation turn detector.
 *
 * Some providers reject requests without a non-empty user/assistant turn; this
 * helper checks the loose message payload shape before transport submission.
 */
function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function hasNonEmptyContentPart(part) {
  if (!part || typeof part !== "object") return false;
  const record = part;
  if (record.type === "text") return hasNonEmptyString(record.text);
  return true;
}
function hasNonEmptyMessageContent(content) {
  if (hasNonEmptyString(content)) return true;
  if (!Array.isArray(content)) return false;
  return content.some(hasNonEmptyContentPart);
}
function hasAssistantToolCall(message) {
  const toolCalls = message.tool_calls;
  return (
    Array.isArray(toolCalls) &&
    toolCalls.some((toolCall) => {
      return Boolean(toolCall && typeof toolCall === "object");
    })
  );
}
/** Returns whether an OpenAI-compatible messages payload contains a usable turn. */
function hasOpenAICompatibleConversationTurn(messages) {
  if (!Array.isArray(messages)) return false;
  return messages.some((message) => {
    if (!message || typeof message !== "object") return false;
    const record = message;
    if (record.role === "user") return hasNonEmptyMessageContent(record.content);
    if (record.role === "assistant")
      return hasNonEmptyMessageContent(record.content) || hasAssistantToolCall(record);
    return false;
  });
}
//#endregion
//#region src/agents/openai-completions-string-content.ts
/**
 * OpenAI Chat Completions compatibility helpers. Some providers only accept
 * role/content messages with plain string content instead of text block arrays.
 */
function flattenStringOnlyCompletionContent(content) {
  if (!Array.isArray(content)) return content;
  const textParts = [];
  for (const item of content) {
    if (!item || typeof item !== "object" || item.type !== "text" || typeof item.text !== "string")
      return content;
    textParts.push(item.text);
  }
  return textParts.join("\n");
}
/** Flatten string-only text block content arrays into newline-joined strings. */
function flattenCompletionMessagesToStringContent(messages) {
  return messages.map((message) => {
    if (!message || typeof message !== "object") return message;
    const content = message.content;
    const flattenedContent = flattenStringOnlyCompletionContent(content);
    if (flattenedContent === content) return message;
    return {
      ...message,
      content: flattenedContent,
    };
  });
}
/** Strip completion messages to role/content fields for strict providers. */
function stripCompletionMessagesToRoleContent(messages) {
  return messages.map((message) => {
    if (!message || typeof message !== "object" || Array.isArray(message)) return message;
    const record = message;
    const stripped = {};
    if (Object.hasOwn(record, "role")) stripped.role = record.role;
    if (Object.hasOwn(record, "content")) stripped.content = record.content;
    return stripped;
  });
}
//#endregion
//#region src/agents/openai-transport-shared.ts
/** Shared options, usage shape, cache identity, ordering, and stream scheduling for OpenAI APIs. */
const MODEL_STREAM_COOPERATIVE_YIELD_INTERVAL_MS = 12;
const MODEL_STREAM_COOPERATIVE_YIELD_MAX_EVENTS = 64;
const GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP = "skip_thought_signature_validator";
const log = createSubsystemLogger("openai-transport");
function throwIfModelStreamAborted(signal) {
  if (signal?.aborted) throw new Error("Request was aborted");
}
function createModelStreamCooperativeScheduler(signal) {
  let lastYieldedAt = Date.now();
  let eventsSinceYield = 0;
  return {
    async afterEvent() {
      throwIfModelStreamAborted(signal);
      eventsSinceYield += 1;
      const now = Date.now();
      if (
        eventsSinceYield < MODEL_STREAM_COOPERATIVE_YIELD_MAX_EVENTS &&
        now - lastYieldedAt < MODEL_STREAM_COOPERATIVE_YIELD_INTERVAL_MS
      )
        return;
      eventsSinceYield = 0;
      lastYieldedAt = now;
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      throwIfModelStreamAborted(signal);
    },
  };
}
function resolveCacheRetention(cacheRetention) {
  if (cacheRetention === "short" || cacheRetention === "long" || cacheRetention === "none")
    return cacheRetention;
  if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long")
    return "long";
  return "short";
}
function resolvePromptCacheKey(options, cacheRetention) {
  if (cacheRetention === "none") return;
  return clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId);
}
function compareTransportToolText(left, right) {
  const leftText = left ?? "";
  const rightText = right ?? "";
  if (leftText < rightText) return -1;
  if (leftText > rightText) return 1;
  return 0;
}
function sortTransportToolsByName(tools) {
  return tools.toSorted(
    (left, right) =>
      compareTransportToolText(left.name, right.name) ||
      compareTransportToolText(left.description, right.description),
  );
}
//#endregion
//#region src/agents/openai-transport-params.ts
const MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 256;
const OPENAI_CODEX_RESPONSES_PROVIDERS = /* @__PURE__ */ new Set(["openai"]);
const loggedOpenAIStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
function readToolPayloadField$1(record, field) {
  try {
    return record[field];
  } catch {
    return;
  }
}
function transportPayloadToolName(tool) {
  if (!isRecord(tool)) return;
  const name = readToolPayloadField$1(tool, "name");
  if (typeof name === "string") return name;
  const fn = readToolPayloadField$1(tool, "function");
  if (!isRecord(fn)) return;
  const fnName = readToolPayloadField$1(fn, "name");
  return typeof fnName === "string" ? fnName : void 0;
}
function enforceCodeModeResponsesToolSurface(payload) {
  if (!isRecord(payload) || !Array.isArray(payload.tools)) return;
  payload.tools = payload.tools.filter((tool) => {
    const name = transportPayloadToolName(tool);
    return typeof name === "string" && isCodeModeModelVisibleToolName(name);
  });
}
function assertCodeModeResponsesToolSurface(payload) {
  if (!isRecord(payload) || !Array.isArray(payload.tools))
    throw new Error("Code mode payload tool surface violation: expected exec,wait; got no tools");
  const names = payload.tools
    .map(transportPayloadToolName)
    .filter((name) => typeof name === "string" && name.length > 0)
    .toSorted((left, right) => left.localeCompare(right));
  if (
    names.length >= 2 &&
    new Set(names).size === names.length &&
    names.filter((name) => name === "exec").length === 1 &&
    names.filter((name) => name === "wait").length === 1 &&
    names.every(isCodeModeModelVisibleToolName)
  )
    return;
  throw new Error(
    `Code mode payload tool surface violation: expected exec,wait plus direct-only tools; got ${names.length > 0 ? names.join(",") : "none"}`,
  );
}
function buildOpenAIStrictToolDowngradeDiagnosticKey(diagnostics, context) {
  return sha256Hex(
    JSON.stringify({
      transport: context.transport,
      provider: context.model.provider ?? null,
      model: context.model.id ?? null,
      diagnostics: diagnostics.map((entry) => ({
        toolIndex: entry.toolIndex,
        toolName: entry.toolName ?? null,
        violations: entry.violations,
      })),
    }),
  );
}
function shouldLogOpenAIStrictToolDowngradeDiagnostic(diagnostics, context) {
  const key = buildOpenAIStrictToolDowngradeDiagnosticKey(diagnostics, context);
  if (loggedOpenAIStrictToolDowngradeDiagnosticKeys.has(key)) return false;
  if (
    loggedOpenAIStrictToolDowngradeDiagnosticKeys.size >=
    MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS
  )
    loggedOpenAIStrictToolDowngradeDiagnosticKeys.clear();
  loggedOpenAIStrictToolDowngradeDiagnosticKeys.add(key);
  return true;
}
function resolveOpenAIStrictToolFlagWithDiagnostics(projection, strictSetting, context) {
  const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
  if (strictSetting === true && strict === false && log.isEnabled("debug", "any")) {
    const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
    if (!shouldLogOpenAIStrictToolDowngradeDiagnostic(diagnostics, context)) return strict;
    const sample = diagnostics.slice(0, 5).map((entry) => ({
      tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
      violations: entry.violations.slice(0, 8),
    }));
    log.debug(
      `OpenAI ${context.transport} tool schema strict mode downgraded to strict=false for ${context.model.provider ?? "unknown"}/${context.model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`,
      {
        transport: context.transport,
        provider: context.model.provider,
        model: context.model.id,
        incompatibleToolCount: diagnostics.length,
        sample,
      },
    );
  }
  return strict;
}
function isOpenAICodexResponsesModel(model) {
  return (
    OPENAI_CODEX_RESPONSES_PROVIDERS.has(model.provider) &&
    (model.api === "openai-chatgpt-responses" ||
      model.api === "openclaw-openai-responses-transport")
  );
}
function isNativeOpenAICodexResponsesBaseUrl(baseUrl) {
  const trimmed = typeof baseUrl === "string" ? baseUrl.trim() : "";
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.hostname.toLowerCase() !== "chatgpt.com") return false;
    const pathname = url.pathname.replace(/\/+$/u, "").toLowerCase();
    return [
      "/backend-api",
      "/backend-api/v1",
      "/backend-api/codex",
      "/backend-api/codex/v1",
    ].includes(pathname);
  } catch {
    return false;
  }
}
function usesNativeOpenAICodexResponsesBackend(model) {
  return isOpenAICodexResponsesModel(model) && isNativeOpenAICodexResponsesBaseUrl(model.baseUrl);
}
function buildOpenAIClientHeaders(model, context, optionHeaders, turnHeaders, sessionId) {
  const providerHeaders = { ...model.headers };
  if (model.provider === "github-copilot")
    Object.assign(
      providerHeaders,
      buildCopilotDynamicHeaders({
        messages: context.messages,
        hasImages: hasCopilotVisionInput(context.messages),
      }),
    );
  const callerHeaders = {
    ...optionHeaders,
    ...turnHeaders,
  };
  const resolvedHeaders =
    resolveProviderRequestPolicyConfig({
      provider: model.provider,
      api: model.api,
      baseUrl: model.baseUrl,
      capability: "llm",
      transport: "stream",
      providerHeaders,
      callerHeaders: Object.keys(callerHeaders).length > 0 ? callerHeaders : void 0,
      precedence: "caller-wins",
    }).headers ?? {};
  if (
    sessionId &&
    !Object.keys(resolvedHeaders).some(
      (key) => normalizeLowercaseStringOrEmpty(key) === "session_id",
    ) &&
    usesNativeOpenAICodexResponsesBackend(model)
  )
    resolvedHeaders.session_id = sessionId;
  return resolvedHeaders;
}
function resolveOpenAISdkTimeoutMs(model) {
  return resolveModelRequestTimeoutMs(model, void 0);
}
function buildOpenAISdkClientOptions(model) {
  const timeout = resolveOpenAISdkTimeoutMs(model);
  return timeout === void 0 ? {} : { timeout };
}
function buildOpenAISdkRequestOptions(model, signal, options) {
  const timeout = resolveOpenAISdkTimeoutMs(model);
  const headers =
    options?.stream === true && usesNativeOpenAICodexResponsesBackend(model)
      ? { Accept: "text/event-stream" }
      : void 0;
  if (timeout === void 0 && !signal && !headers) return;
  return {
    ...(headers ? { headers } : {}),
    ...(signal ? { signal } : {}),
    ...(timeout !== void 0 ? { timeout } : {}),
  };
}
function detectCompat(model) {
  const { defaults } = detectOpenAICompletionsCompat(model);
  return {
    supportsStore: defaults.supportsStore,
    supportsDeveloperRole: defaults.supportsDeveloperRole,
    supportsReasoningEffort: defaults.supportsReasoningEffort,
    reasoningEffortMap: {},
    supportsUsageInStreaming: defaults.supportsUsageInStreaming,
    maxTokensField: defaults.maxTokensField,
    requiresToolResultName: false,
    requiresAssistantAfterToolResult: false,
    requiresThinkingAsText: false,
    thinkingFormat: defaults.thinkingFormat,
    visibleReasoningDetailTypes: defaults.visibleReasoningDetailTypes,
    openRouterRouting: {},
    vercelGatewayRouting: {},
    supportsStrictMode: defaults.supportsStrictMode,
    requiresReasoningContentOnAssistantMessages:
      defaults.requiresReasoningContentOnAssistantMessages,
    requiresNonEmptyUserOrAssistantMessage: defaults.requiresNonEmptyUserOrAssistantMessage,
  };
}
function getCompat(model) {
  const detected = detectCompat(model);
  const compat = model.compat ?? {};
  const supportsStore =
    typeof compat.supportsStore === "boolean" ? compat.supportsStore : detected.supportsStore;
  const supportsReasoningEffort =
    typeof compat.supportsReasoningEffort === "boolean"
      ? compat.supportsReasoningEffort
      : detected.supportsReasoningEffort;
  return {
    supportsStore,
    supportsDeveloperRole: compat.supportsDeveloperRole ?? detected.supportsDeveloperRole,
    supportsReasoningEffort,
    reasoningEffortMap: resolveOpenAIReasoningEffortMap(model, detected.reasoningEffortMap),
    supportsUsageInStreaming: compat.supportsUsageInStreaming ?? detected.supportsUsageInStreaming,
    maxTokensField: compat.maxTokensField ?? detected.maxTokensField,
    requiresToolResultName: compat.requiresToolResultName ?? detected.requiresToolResultName,
    requiresAssistantAfterToolResult:
      compat.requiresAssistantAfterToolResult ?? detected.requiresAssistantAfterToolResult,
    requiresThinkingAsText: compat.requiresThinkingAsText ?? detected.requiresThinkingAsText,
    thinkingFormat: compat.thinkingFormat ?? detected.thinkingFormat,
    openRouterRouting: compat.openRouterRouting ?? {},
    vercelGatewayRouting: compat.vercelGatewayRouting ?? detected.vercelGatewayRouting,
    supportsStrictMode: compat.supportsStrictMode ?? detected.supportsStrictMode,
    supportsPromptCacheKey: compat.supportsPromptCacheKey === true,
    supportsLongCacheRetention: compat.supportsLongCacheRetention !== false,
    requiresStringContent: compat.requiresStringContent ?? false,
    strictMessageKeys: compat.strictMessageKeys === true,
    visibleReasoningDetailTypes:
      compat.visibleReasoningDetailTypes ?? detected.visibleReasoningDetailTypes,
    requiresReasoningContentOnAssistantMessages:
      compat.requiresReasoningContentOnAssistantMessages ??
      detected.requiresReasoningContentOnAssistantMessages,
    requiresNonEmptyUserOrAssistantMessage: detected.requiresNonEmptyUserOrAssistantMessage,
  };
}
//#endregion
//#region src/agents/openai-completions-transport.ts
function hasToolHistory(messages) {
  return messages.some(
    (message) =>
      message.role === "toolResult" ||
      (message.role === "assistant" &&
        Array.isArray(message.content) &&
        message.content.some((block) => block.type === "toolCall")),
  );
}
function assertOpenAICompletionsPayloadHasConversationTurn(params, model) {
  const messages = params.messages;
  if (!Array.isArray(messages) || hasOpenAICompatibleConversationTurn(messages)) return;
  throw new Error(
    `OpenAI-compatible chat payload for ${model.provider}/${model.id} contains no non-empty user or assistant messages after compaction and transport transforms; refusing to send a system/tool-only request. Start a new user turn or repair the compacted session history.`,
  );
}
const SSE_DONE_LINE_RE = /^data:[ \t]*\[DONE\][ \t]*$/i;
const SSE_DONE_MAX_LINE_CHARS = 1024;
function createSseDoneDetector() {
  const decoder = new TextDecoder();
  let line = "";
  let lineOverflowed = false;
  let sawDone = false;
  const finishLine = () => {
    if (!lineOverflowed && SSE_DONE_LINE_RE.test(line)) sawDone = true;
    line = "";
    lineOverflowed = false;
  };
  const observeText = (text) => {
    for (const char of text) {
      if (char === "\n" || char === "\r") {
        finishLine();
        continue;
      }
      if (!lineOverflowed && line.length < SSE_DONE_MAX_LINE_CHARS) line += char;
      else lineOverflowed = true;
    }
  };
  return {
    observe(chunk) {
      if (!sawDone) observeText(decoder.decode(chunk, { stream: true }));
    },
    finish() {
      if (sawDone) return;
      observeText(decoder.decode());
      if (line || lineOverflowed) finishLine();
    },
    sawDone: () => sawDone,
  };
}
function createOpenAICompletionsClient(model, context, apiKey, optionHeaders, opts) {
  const clientConfig = buildOpenAICompletionsClientConfig(model, context, optionHeaders);
  return new OpenAI({
    apiKey,
    baseURL: clientConfig.baseURL,
    dangerouslyAllowBrowser: true,
    defaultHeaders: clientConfig.defaultHeaders,
    defaultQuery: clientConfig.defaultQuery,
    fetch: opts?.fetch ?? buildGuardedModelFetch(model),
    ...buildOpenAISdkClientOptions(model),
  });
}
function isAzureOpenAICompatibleHost(hostname) {
  return (
    hostname.endsWith(".openai.azure.com") ||
    hostname.endsWith(".services.ai.azure.com") ||
    hostname.endsWith(".cognitiveservices.azure.com")
  );
}
function isKnownOpenAICompletionsEndpoint(model) {
  if (!model.baseUrl.trim()) return true;
  const endpointClass = resolveProviderEndpoint(model.baseUrl).endpointClass;
  if (endpointClass === "openai-public" || endpointClass === "azure-openai") return true;
  try {
    return isAzureOpenAICompatibleHost(new URL(model.baseUrl).hostname.toLowerCase());
  } catch {
    return false;
  }
}
function buildOpenAICompletionsClientConfig(model, context, optionHeaders) {
  const headers = buildOpenAIClientHeaders(model, context, optionHeaders);
  const defaultQuery = {};
  let baseURL = model.baseUrl;
  let isAzureHost = false;
  try {
    const parsed = new URL(model.baseUrl);
    isAzureHost = isAzureOpenAICompatibleHost(parsed.hostname.toLowerCase());
    parsed.searchParams.forEach((value, key) => {
      if (value) defaultQuery[key] = value;
    });
    parsed.search = "";
    baseURL = parsed.toString().replace(/\/$/, "");
  } catch {}
  if (isAzureHost) {
    const apiVersionHeader = Object.keys(headers).find(
      (key) => key.toLowerCase() === "api-version",
    );
    if (apiVersionHeader) {
      const apiVersion = headers[apiVersionHeader]?.trim();
      delete headers[apiVersionHeader];
      if (apiVersion && !defaultQuery["api-version"]) defaultQuery["api-version"] = apiVersion;
    }
  }
  return {
    baseURL,
    defaultHeaders: headers,
    defaultQuery: Object.keys(defaultQuery).length > 0 ? defaultQuery : void 0,
  };
}
function createOpenAICompletionsTransportStreamFn() {
  return (model, context, options) => {
    const eventStream = (0, event_stream_exports.createAssistantMessageEventStream)();
    const stream = eventStream;
    (async () => {
      const output = {
        role: "assistant",
        content: [],
        api: model.api,
        provider: model.provider,
        model: model.id,
        usage: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
          totalTokens: 0,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
            total: 0,
          },
        },
        stopReason: "stop",
        timestamp: Date.now(),
      };
      let firstEventAbort;
      try {
        const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
        const doneDetector = createSseDoneDetector();
        const baseFetch = buildGuardedModelFetch(model);
        const doneDetectingFetch = async (url, init) => {
          const response = await baseFetch(url, init);
          if (!response.body || !response.ok) return response;
          if (typeof TransformStream === "undefined" || !response.body.pipeThrough) return response;
          const transformed = response.body.pipeThrough(
            new TransformStream({
              transform(chunk, controller) {
                doneDetector.observe(chunk);
                controller.enqueue(chunk);
              },
              flush() {
                doneDetector.finish();
              },
            }),
          );
          return new Response(transformed, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
          });
        };
        const client = createOpenAICompletionsClient(model, context, apiKey, options?.headers, {
          fetch: doneDetectingFetch,
        });
        let params = buildOpenAICompletionsParams$1(model, context, options);
        const nextParams = await options?.onPayload?.(params, model);
        if (nextParams !== void 0) params = nextParams;
        if (options?.openclawCodeModeToolSurface === true) {
          enforceCodeModeResponsesToolSurface(params);
          assertCodeModeResponsesToolSurface(params);
        }
        if (getCompat(model).requiresNonEmptyUserOrAssistantMessage)
          assertOpenAICompletionsPayloadHasConversationTurn(params, model);
        const emitReasoning = shouldEmitOpenAICompletionsReasoning(model, options);
        firstEventAbort = createFirstStreamEventAbortController(options?.signal);
        const responseStream = await client.chat.completions.create(
          params,
          buildOpenAISdkRequestOptions(model, firstEventAbort.signal),
        );
        stream.push({
          type: "start",
          partial: output,
        });
        await processOpenAICompletionsStream(responseStream, output, model, stream, {
          signal: options?.signal,
          emitReasoning,
          firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
          abortFirstEventStream: firstEventAbort.abort,
          onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
          sawStreamDONE: doneDetector.sawDone,
        });
        finalizeTransportStream({
          stream,
          output,
          signal: options?.signal,
        });
      } catch (error) {
        failTransportStream({
          stream,
          output,
          signal: options?.signal,
          error,
        });
      } finally {
        firstEventAbort?.dispose();
      }
    })();
    return eventStream;
  };
}
async function processOpenAICompletionsStream(responseStream, output, model, stream, options) {
  const MAX_POST_TOOL_CALL_BUFFER_BYTES = 256e3;
  const MAX_TOOL_CALL_ARGUMENT_BUFFER_BYTES = 256e3;
  const emitReasoning = options?.emitReasoning ?? true;
  const compat = getCompat(model);
  const deepSeekTextFilter = shouldFilterDeepSeekDsmlText(compat)
    ? createDeepSeekTextFilter()
    : null;
  const deepSeekToolCallRecoverer = shouldFilterDeepSeekDsmlText(compat)
    ? createDeepSeekDsmlToolCallRecoverer()
    : null;
  const reasoningTagTextPartitioner = createReasoningTagTextPartitioner();
  let currentBlock = null;
  let pendingPostToolCallDeltas = [];
  let pendingPostToolCallBytes = 0;
  let isFlushingPendingPostToolCallDeltas = false;
  const toolCallBlocksByIndex = /* @__PURE__ */ new Map();
  const toolCallBlocksById = /* @__PURE__ */ new Map();
  const toolCallBlockBytes = /* @__PURE__ */ new WeakMap();
  const toolCallBlockIndices = /* @__PURE__ */ new WeakMap();
  let sawStopFinishReason = false;
  let sawNativeToolCallDelta = false;
  const blockIndex = () => output.content.length - 1;
  const measureUtf8Bytes = (text) => Buffer.byteLength(text, "utf8");
  let chunkPushedEvent = false;
  const pushStreamEvent = (event) => {
    chunkPushedEvent = true;
    stream.push(event);
  };
  const queuePostToolCallDelta = (next) => {
    const nextBytes = measureUtf8Bytes(next.text);
    if (pendingPostToolCallBytes + nextBytes > MAX_POST_TOOL_CALL_BUFFER_BYTES)
      throw new Error("Exceeded post-tool-call delta buffer limit");
    pendingPostToolCallBytes += nextBytes;
    const previous = pendingPostToolCallDeltas[pendingPostToolCallDeltas.length - 1];
    if (!previous || previous.kind !== next.kind) {
      pendingPostToolCallDeltas.push(next);
      return;
    }
    if (next.kind === "thinking" && previous.kind === "thinking") {
      if (previous.signature !== next.signature) {
        pendingPostToolCallDeltas.push(next);
        return;
      }
      previous.text += next.text;
      return;
    }
    previous.text += next.text;
  };
  const appendThinkingDeltaInternal = (reasoningDelta) => {
    if (!currentBlock || currentBlock.type !== "thinking") {
      currentBlock = {
        type: "thinking",
        thinking: "",
        ...(reasoningDelta.signature ? { thinkingSignature: reasoningDelta.signature } : {}),
      };
      output.content.push(currentBlock);
      pushStreamEvent({
        type: "thinking_start",
        contentIndex: blockIndex(),
        partial: output,
      });
    }
    currentBlock.thinking += reasoningDelta.text;
    pushStreamEvent({
      type: "thinking_delta",
      contentIndex: blockIndex(),
      delta: reasoningDelta.text,
      partial: output,
    });
  };
  const appendTextDeltaInternal = (text) => {
    if (!currentBlock || currentBlock.type !== "text") {
      currentBlock = {
        type: "text",
        text: "",
      };
      output.content.push(currentBlock);
      pushStreamEvent({
        type: "text_start",
        contentIndex: blockIndex(),
        partial: output,
      });
    }
    currentBlock.text += text;
    pushStreamEvent({
      type: "text_delta",
      contentIndex: blockIndex(),
      delta: text,
    });
  };
  const flushPendingPostToolCallDeltas = () => {
    if (
      isFlushingPendingPostToolCallDeltas ||
      currentBlock?.type === "toolCall" ||
      pendingPostToolCallDeltas.length === 0
    )
      return;
    isFlushingPendingPostToolCallDeltas = true;
    const bufferedDeltas = pendingPostToolCallDeltas;
    pendingPostToolCallDeltas = [];
    pendingPostToolCallBytes = 0;
    for (const delta of bufferedDeltas)
      if (delta.kind === "text") appendTextDeltaInternal(delta.text);
      else if (emitReasoning) appendThinkingDeltaInternal(delta);
    isFlushingPendingPostToolCallDeltas = false;
  };
  const appendThinkingDelta = (reasoningDelta) => {
    flushPendingPostToolCallDeltas();
    appendThinkingDeltaInternal(reasoningDelta);
  };
  const appendTextDelta = (text) => {
    flushPendingPostToolCallDeltas();
    appendTextDeltaInternal(text);
  };
  const appendVisibleTextDelta = (text) => {
    if (!text) return;
    if (currentBlock?.type === "toolCall")
      queuePostToolCallDelta({
        kind: "text",
        text,
      });
    else appendTextDelta(text);
  };
  const appendRecoveredToolCall = (toolCall) => {
    if (currentBlock?.type === "toolCall") {
      currentBlock = null;
      flushPendingPostToolCallDeltas();
    }
    const block = {
      type: "toolCall",
      id: `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`,
      name: toolCall.name,
      arguments: toolCall.arguments,
      partialArgs: toolCall.partialArgs,
    };
    currentBlock = block;
    output.content.push(block);
    toolCallBlockIndices.set(block, output.content.length - 1);
    pushStreamEvent({
      type: "toolcall_start",
      contentIndex: toolCallBlockIndices.get(block) ?? -1,
      partial: output,
    });
    pushStreamEvent({
      type: "toolcall_delta",
      contentIndex: toolCallBlockIndices.get(block) ?? -1,
      delta: toolCall.partialArgs,
      partial: output,
    });
  };
  const appendFilteredVisibleTextDelta = (text) => {
    const recoveredParts = deepSeekToolCallRecoverer?.push(text) ?? [
      {
        kind: "text",
        text,
      },
    ];
    for (const recoveredPart of recoveredParts) {
      if (recoveredPart.kind === "toolCall") {
        appendRecoveredToolCall(recoveredPart);
        continue;
      }
      const parts = deepSeekTextFilter?.push(recoveredPart.text) ?? [recoveredPart.text];
      for (const part of parts) appendVisibleTextDelta(part);
    }
  };
  const flushDeepSeekToolCallRecovererAtEnd = () => {
    const recoveredParts = deepSeekToolCallRecoverer?.flush();
    if (!recoveredParts) return;
    for (const recoveredPart of recoveredParts) {
      if (recoveredPart.kind === "toolCall") {
        appendRecoveredToolCall(recoveredPart);
        continue;
      }
      const parts = deepSeekTextFilter?.push(recoveredPart.text) ?? [recoveredPart.text];
      for (const part of parts) appendVisibleTextDelta(part);
    }
  };
  const flushDeepSeekTextFilterAtEnd = () => {
    const parts = deepSeekTextFilter?.flush();
    if (!parts) return;
    for (const part of parts) appendVisibleTextDelta(part);
  };
  const appendRoutedContentDelta = (delta) => {
    if (delta.kind === "text") {
      appendFilteredVisibleTextDelta(delta.text);
      return;
    }
    if (!emitReasoning) return;
    if (currentBlock?.type === "toolCall") queuePostToolCallDelta(delta);
    else appendThinkingDelta(delta);
  };
  const appendPartitionedVisibleDelta = (delta) => {
    if (delta.kind === "text") appendFilteredVisibleTextDelta(delta.text);
  };
  const emitReasoningUsageActivity = (hasReasoningUsageActivity) => {
    if (!hasReasoningUsageActivity || chunkPushedEvent || !emitReasoning) return;
    const latestBlock = output.content[output.content.length - 1];
    if (currentBlock?.type === "text" || currentBlock?.type === "toolCall") return;
    if (latestBlock?.type === "text" || latestBlock?.type === "toolCall") return;
    appendThinkingDelta({
      signature: "",
      text: "",
    });
  };
  const flushReasoningTagTextPartitionerAtEnd = () => {
    for (const delta of reasoningTagTextPartitioner.flush()) appendPartitionedVisibleDelta(delta);
  };
  const cooperativeScheduler = createModelStreamCooperativeScheduler(options?.signal);
  const guardedStream = withFirstStreamEventTimeout(responseStream, {
    provider: model.provider,
    api: model.api,
    model: model.id,
    timeoutMs: options?.firstEventTimeoutMs ?? 0,
    stage: "completions",
    abort: options?.abortFirstEventStream,
    onTimeout: options?.onFirstEventTimeout,
    hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools.",
  });
  for await (const rawChunk of guardedStream) {
    throwIfModelStreamAborted(options?.signal);
    chunkPushedEvent = false;
    if (!rawChunk || typeof rawChunk !== "object") {
      await cooperativeScheduler.afterEvent();
      continue;
    }
    const chunk = rawChunk;
    output.responseId ||= chunk.id;
    let hasReasoningUsageActivity = false;
    if (chunk.usage) {
      output.usage = parseTransportChunkUsage(chunk.usage, model);
      hasReasoningUsageActivity = hasOpenAICompletionsReasoningUsageActivity(chunk.usage);
    }
    const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : void 0;
    if (!choice) {
      emitReasoningUsageActivity(hasReasoningUsageActivity);
      await cooperativeScheduler.afterEvent();
      continue;
    }
    const choiceUsage = choice.usage;
    if (!chunk.usage && choiceUsage) {
      output.usage = parseTransportChunkUsage(choiceUsage, model);
      hasReasoningUsageActivity = hasOpenAICompletionsReasoningUsageActivity(choiceUsage);
    }
    if (choice.finish_reason) {
      const finishReasonResult = mapOpenAIStopReason(choice.finish_reason, {
        allowSingularToolCall: true,
      });
      output.stopReason = finishReasonResult.stopReason;
      if (finishReasonResult.stopReason === "stop") sawStopFinishReason = true;
      if (finishReasonResult.errorMessage) output.errorMessage = finishReasonResult.errorMessage;
    }
    const choiceDelta = choice.delta ?? choice.message;
    if (!choiceDelta) {
      emitReasoningUsageActivity(hasReasoningUsageActivity);
      await cooperativeScheduler.afterEvent();
      continue;
    }
    const reasoningDeltas = getCompletionsReasoningDeltas(
      choiceDelta,
      compat.visibleReasoningDetailTypes,
    );
    const hasMirroredReasoning = reasoningDeltas.some((delta) => delta.kind === "thinking");
    if (hasMirroredReasoning) reasoningTagTextPartitioner.markStrict();
    if (choiceDelta.content) {
      const contentDeltas = getCompletionsContentDeltas(choiceDelta.content);
      for (const contentDelta of contentDeltas)
        if (contentDelta.kind === "text") {
          const routedDeltas = hasMirroredReasoning
            ? reasoningTagTextPartitioner.push(contentDelta.text)
            : reasoningTagTextPartitioner.pushVisible(contentDelta.text);
          for (const routedDelta of routedDeltas) appendPartitionedVisibleDelta(routedDelta);
        } else {
          reasoningTagTextPartitioner.markStrict();
          appendRoutedContentDelta(contentDelta);
        }
    }
    const refusalText = typeof choiceDelta.refusal === "string" ? choiceDelta.refusal : "";
    if (refusalText) {
      const routedDeltas = hasMirroredReasoning
        ? reasoningTagTextPartitioner.push(refusalText)
        : reasoningTagTextPartitioner.pushVisible(refusalText);
      for (const routedDelta of routedDeltas) appendPartitionedVisibleDelta(routedDelta);
    }
    for (const reasoningDelta of reasoningDeltas) {
      if (reasoningDelta.kind === "thinking" && !emitReasoning) continue;
      if (currentBlock?.type === "toolCall") {
        queuePostToolCallDelta({ ...reasoningDelta });
        continue;
      }
      if (reasoningDelta.kind === "text") appendTextDelta(reasoningDelta.text);
      else if (emitReasoning) appendThinkingDelta(reasoningDelta);
    }
    if (choiceDelta.tool_calls && choiceDelta.tool_calls.length > 0) {
      sawNativeToolCallDelta = true;
      flushReasoningTagTextPartitionerAtEnd();
      for (const toolCall of choiceDelta.tool_calls) {
        const streamIndex = typeof toolCall.index === "number" ? toolCall.index : void 0;
        let block = streamIndex !== void 0 ? toolCallBlocksByIndex.get(streamIndex) : void 0;
        if (!block && toolCall.id) block = toolCallBlocksById.get(toolCall.id);
        if (!block) {
          if (currentBlock?.type === "toolCall") {
            currentBlock = null;
            flushPendingPostToolCallDeltas();
          }
          const initialSig = extractGoogleThoughtSignature(toolCall);
          block = {
            type: "toolCall",
            id: toolCall.id || "",
            name: toolCall.function?.name || "",
            arguments: {},
            partialArgs: "",
            ...(initialSig ? { thoughtSignature: initialSig } : {}),
          };
          output.content.push(block);
          toolCallBlockIndices.set(block, output.content.length - 1);
          pushStreamEvent({
            type: "toolcall_start",
            contentIndex: toolCallBlockIndices.get(block) ?? -1,
            partial: output,
          });
        }
        if (streamIndex !== void 0 && !toolCallBlocksByIndex.has(streamIndex))
          toolCallBlocksByIndex.set(streamIndex, block);
        if (toolCall.id) {
          block.id = toolCall.id;
          toolCallBlocksById.set(toolCall.id, block);
        }
        currentBlock = block;
        if (toolCall.function?.name) block.name = toolCall.function.name;
        const deltaSig = extractGoogleThoughtSignature(toolCall);
        if (deltaSig) block.thoughtSignature = deltaSig;
        if (toolCall.function?.arguments) {
          const nextArgumentBytes = measureUtf8Bytes(toolCall.function.arguments);
          const currentBlockArgBytes = toolCallBlockBytes.get(block) ?? 0;
          if (currentBlockArgBytes + nextArgumentBytes > MAX_TOOL_CALL_ARGUMENT_BUFFER_BYTES)
            throw new Error("Exceeded tool-call argument buffer limit");
          toolCallBlockBytes.set(block, currentBlockArgBytes + nextArgumentBytes);
          block.partialArgs += toolCall.function.arguments;
          block.arguments = parseStreamingJson(block.partialArgs);
          pushStreamEvent({
            type: "toolcall_delta",
            contentIndex: toolCallBlockIndices.get(block) ?? -1,
            delta: toolCall.function.arguments,
            partial: output,
          });
        }
      }
    }
    flushPendingPostToolCallDeltas();
    emitReasoningUsageActivity(hasReasoningUsageActivity);
    await cooperativeScheduler.afterEvent();
  }
  flushReasoningTagTextPartitionerAtEnd();
  flushDeepSeekToolCallRecovererAtEnd();
  flushDeepSeekTextFilterAtEnd();
  currentBlock = null;
  flushPendingPostToolCallDeltas();
  const hasToolCalls = output.content.some((block) => block.type === "toolCall");
  const hasVisibleText = output.content.some(
    (block) =>
      block.type === "text" && typeof block.text === "string" && block.text.trim().length > 0,
  );
  if (output.stopReason === "toolUse" && !hasToolCalls) output.stopReason = "stop";
  if (
    output.stopReason === "stop" &&
    hasToolCalls &&
    !hasVisibleText &&
    (sawStopFinishReason || (sawNativeToolCallDelta && (options?.sawStreamDONE?.() ?? false)))
  )
    output.stopReason = "toolUse";
  if (hasToolCalls && output.stopReason !== "toolUse")
    output.content = output.content.filter((block) => block.type !== "toolCall");
}
function shouldFilterDeepSeekDsmlText(compat) {
  return compat.thinkingFormat === "deepseek";
}
const DEEPSEEK_DSML_BARS = ["|", "｜"];
const DEEPSEEK_DSML_TOOL_KINDS = ["tool_calls", "tool_call", "function_calls"];
const DEEPSEEK_DSML_TOOL_OPEN_TOKENS = DEEPSEEK_DSML_BARS.flatMap((bar) =>
  DEEPSEEK_DSML_TOOL_KINDS.map((kind) => `<${bar}DSML${bar}${kind}>`),
);
const DEEPSEEK_DSML_TOOL_CLOSE_TOKENS = DEEPSEEK_DSML_BARS.flatMap((bar) =>
  DEEPSEEK_DSML_TOOL_KINDS.map((kind) => `</${bar}DSML${bar}${kind}>`),
);
const DEEPSEEK_DSML_TOOL_MAX_OPEN_TOKEN_LEN = Math.max(
  ...DEEPSEEK_DSML_TOOL_OPEN_TOKENS.map((token) => token.length),
);
function createDeepSeekDsmlToolCallRecoverer() {
  let buffer = "";
  const consume = (final) => {
    const output = [];
    while (buffer) {
      const open = findEarliestStringToken(buffer, DEEPSEEK_DSML_TOOL_OPEN_TOKENS);
      if (!open) {
        if (final) {
          output.push({
            kind: "text",
            text: buffer,
          });
          buffer = "";
          return output;
        }
        const keep = longestDeepSeekDsmlToolOpenPrefixSuffixLength(buffer);
        const emitLength = buffer.length - keep;
        if (emitLength > 0) {
          output.push({
            kind: "text",
            text: buffer.slice(0, emitLength),
          });
          buffer = buffer.slice(emitLength);
        }
        return output;
      }
      if (open.index > 0) {
        output.push({
          kind: "text",
          text: buffer.slice(0, open.index),
        });
        buffer = buffer.slice(open.index);
      }
      const afterOpen = buffer.slice(open.token.length);
      const close = findEarliestStringToken(afterOpen, DEEPSEEK_DSML_TOOL_CLOSE_TOKENS);
      if (!close) {
        if (final) {
          output.push({
            kind: "text",
            text: buffer,
          });
          buffer = "";
        }
        return output;
      }
      const body = afterOpen.slice(0, close.index);
      const blockLength = open.token.length + close.index + close.token.length;
      const recoveredToolCalls = parseDeepSeekDsmlToolCallBlock(body);
      if (recoveredToolCalls.length > 0) output.push(...recoveredToolCalls);
      else
        output.push({
          kind: "text",
          text: buffer.slice(0, blockLength),
        });
      buffer = buffer.slice(blockLength);
    }
    return output;
  };
  return {
    push(chunk) {
      buffer += chunk;
      return consume(false);
    },
    flush() {
      return consume(true);
    },
  };
}
function parseDeepSeekDsmlToolCallBlock(body) {
  const toolCalls = [];
  const invokeOpenRegex = /<[|｜]DSML[|｜]invoke\b([^>]*)>/g;
  let openMatch;
  while ((openMatch = invokeOpenRegex.exec(body)) !== null) {
    const invokeName = parseXmlAttribute(openMatch[1] ?? "", "name");
    if (!invokeName) continue;
    const invokeBodyStart = openMatch.index + openMatch[0].length;
    const invokeClose = findEarliestStringToken(body.slice(invokeBodyStart), [
      "</|DSML|invoke>",
      "</｜DSML｜invoke>",
    ]);
    if (!invokeClose) continue;
    const invokeBody = body.slice(invokeBodyStart, invokeBodyStart + invokeClose.index);
    invokeOpenRegex.lastIndex = invokeBodyStart + invokeClose.index + invokeClose.token.length;
    const parsedArguments = parseDeepSeekDsmlInvokeArguments(invokeBody);
    if (!parsedArguments) continue;
    toolCalls.push({
      kind: "toolCall",
      name: invokeName,
      arguments: parsedArguments,
      partialArgs: JSON.stringify(parsedArguments),
    });
  }
  return toolCalls;
}
function parseDeepSeekDsmlInvokeArguments(body) {
  const args = {};
  const parameterRegex = /<[|｜]DSML[|｜]parameter\b([^>]*)>([\s\S]*?)<\/[|｜]DSML[|｜]parameter>/g;
  let parameterMatch;
  while ((parameterMatch = parameterRegex.exec(body)) !== null) {
    const name = parseXmlAttribute(parameterMatch[1] ?? "", "name");
    if (!name) continue;
    const rawValue = parameterMatch[2] ?? "";
    if (rawValue.length === 0) continue;
    args[name] = decodeDeepSeekDsmlText(rawValue);
  }
  if (Object.keys(args).length > 0) return args;
  const trimmed = body.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (isRecord(parsed) && Object.keys(parsed).length > 0) return parsed;
  } catch {
    return null;
  }
  return null;
}
const xmlAttributeRegexCache = /* @__PURE__ */ new Map();
function xmlAttributeRegex(name) {
  const cached = xmlAttributeRegexCache.get(name);
  if (cached) return cached;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}=("([^"]*)"|'([^']*)'|([^\\s>]+))`);
  xmlAttributeRegexCache.set(name, pattern);
  return pattern;
}
function parseXmlAttribute(attributes, name) {
  const match = xmlAttributeRegex(name).exec(attributes);
  const value = match?.[2] ?? match?.[3] ?? match?.[4];
  return value ? decodeDeepSeekDsmlText(value) : null;
}
function decodeDeepSeekDsmlText(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
function findEarliestStringToken(text, tokens) {
  let best = null;
  for (const token of tokens) {
    const index = text.indexOf(token);
    if (index !== -1 && (!best || index < best.index))
      best = {
        index,
        token,
      };
  }
  return best;
}
function longestDeepSeekDsmlToolOpenPrefixSuffixLength(text) {
  const maxLength = Math.min(text.length, DEEPSEEK_DSML_TOOL_MAX_OPEN_TOKEN_LEN - 1);
  for (let length = maxLength; length > 0; length -= 1) {
    const suffix = text.slice(text.length - length);
    if (DEEPSEEK_DSML_TOOL_OPEN_TOKENS.some((token) => token.startsWith(suffix))) return length;
  }
  return 0;
}
function getCompletionsContentDeltas(content) {
  if (typeof content === "string")
    return content
      ? [
          {
            kind: "text",
            text: content,
          },
        ]
      : [];
  if (Array.isArray(content)) return content.flatMap((item) => getCompletionsContentDeltas(item));
  if (!content || typeof content !== "object") return [];
  const record = content;
  const type = typeof record.type === "string" ? record.type.toLowerCase() : "";
  const extractText = (value) => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.map((item) => extractText(item)).join("");
    if (value && typeof value === "object") {
      const nested = value;
      return extractText(nested.text ?? nested.content ?? nested.thinking);
    }
    return "";
  };
  const text = extractText(record.text ?? record.content ?? record.thinking);
  if (!text) return [];
  if (type.includes("thinking") || type.includes("reasoning"))
    return [
      {
        kind: "thinking",
        signature: "content",
        text,
      },
    ];
  if (type === "text" || type === "output_text" || type.endsWith(".output_text"))
    return [
      {
        kind: "text",
        text,
      },
    ];
  return [];
}
function getCompletionsReasoningDeltas(delta, visibleReasoningDetailTypes) {
  const output = [];
  const pushDelta = (next) => {
    const previous = output[output.length - 1];
    if (!previous || previous.kind !== next.kind) {
      output.push(next);
      return;
    }
    if (next.kind === "thinking" && previous.kind === "thinking") {
      if (previous.signature !== next.signature) {
        output.push(next);
        return;
      }
      previous.text += next.text;
      return;
    }
    previous.text += next.text;
  };
  const reasoningDetails = delta.reasoning_details;
  let usedReasoningThinkingDetails = false;
  if (Array.isArray(reasoningDetails)) {
    const visibleTypes = new Set(visibleReasoningDetailTypes);
    for (const item of reasoningDetails) {
      const detail = item;
      if (typeof detail.text !== "string" || !detail.text) continue;
      if (detail.type === "reasoning.text") {
        usedReasoningThinkingDetails = true;
        pushDelta({
          kind: "thinking",
          signature: "reasoning_details",
          text: detail.text,
        });
        continue;
      }
      if (typeof detail.type === "string" && visibleTypes.has(detail.type))
        pushDelta({
          kind: "text",
          text: detail.text,
        });
    }
  }
  if (!usedReasoningThinkingDetails)
    for (const field of ["reasoning_content", "reasoning", "reasoning_text"]) {
      const value = delta[field];
      if (typeof value === "string" && value.length > 0) {
        pushDelta({
          kind: "thinking",
          signature: field,
          text: value,
        });
        break;
      }
    }
  return output;
}
function resolveOpenAICompletionsReasoningEffort(options) {
  return options?.reasoningEffort ?? options?.reasoning ?? "high";
}
function shouldEmitOpenAICompletionsReasoning(model, options) {
  if (!model.reasoning) return false;
  const effort = resolveOpenAICompletionsReasoningEffort(options);
  if (!effort || !isOpenAICompletionsThinkingEnabled(effort)) return false;
  return true;
}
function shouldEmitOpenAICompletionsReasoningForModel(model, options) {
  return shouldEmitOpenAICompletionsReasoning(model, options);
}
function resolveOpenAICompletionsMaxTokens(model, options) {
  if (options?.maxTokens)
    return {
      maxTokens: options.maxTokens,
      clampToModelMaxTokens: true,
    };
  const paramsMaxTokens = resolveMaxTokensParam(model.params);
  if (paramsMaxTokens)
    return {
      maxTokens: paramsMaxTokens,
      clampToModelMaxTokens: false,
    };
  return {
    maxTokens: model.maxTokens,
    clampToModelMaxTokens: false,
  };
}
function resolveOpenAICompletionsModelMaxTokens(model) {
  return typeof model.maxTokens === "number" &&
    Number.isFinite(model.maxTokens) &&
    model.maxTokens > 0
    ? Math.floor(model.maxTokens)
    : void 0;
}
const OPENAI_COMPLETIONS_INPUT_TOKEN_SAFETY_MARGIN = 1.25;
const OPENAI_COMPLETIONS_IMAGE_CHAR_ESTIMATE = 8e3;
function estimateOpenAICompletionsInputTokens(payload) {
  let adjustedChars = 0;
  adjustedChars += estimateOpenAICompletionsMessagesChars(payload.messages);
  if (Array.isArray(payload.tools) && payload.tools.length > 0)
    try {
      adjustedChars += estimateStringChars(JSON.stringify(payload.tools));
    } catch {
      adjustedChars += 1024;
    }
  if (payload.response_format !== void 0)
    try {
      adjustedChars += estimateStringChars(JSON.stringify(payload.response_format));
    } catch {
      adjustedChars += 256;
    }
  return Math.ceil((adjustedChars / 4) * OPENAI_COMPLETIONS_INPUT_TOKEN_SAFETY_MARGIN);
}
function estimateOpenAICompletionsMessagesChars(messages) {
  if (!Array.isArray(messages)) return 0;
  let adjustedChars = 0;
  for (const message of messages) {
    if (!message || typeof message !== "object") continue;
    const record = message;
    adjustedChars += estimateOpenAICompletionsContentChars(record.content);
    for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS)
      adjustedChars += estimateOpenAICompletionsContentChars(record[field]);
    if (record.tool_calls !== void 0)
      try {
        adjustedChars += estimateStringChars(JSON.stringify(record.tool_calls));
      } catch {
        adjustedChars += 256;
      }
  }
  return adjustedChars;
}
function estimateOpenAICompletionsContentChars(value) {
  if (typeof value === "string") return estimateStringChars(value);
  if (!Array.isArray(value)) return 0;
  let adjustedChars = 0;
  for (const block of value) {
    if (!block || typeof block !== "object") continue;
    const record = block;
    if (record.type === "image_url" || record.type === "input_image") {
      adjustedChars += OPENAI_COMPLETIONS_IMAGE_CHAR_ESTIMATE;
      continue;
    }
    const text = record.text;
    if (typeof text === "string") {
      adjustedChars += estimateStringChars(text);
      continue;
    }
    try {
      adjustedChars += estimateStringChars(JSON.stringify(block));
    } catch {
      adjustedChars += 256;
    }
  }
  return adjustedChars;
}
function resolveOpenAICompletionsEffectiveContextTokens(model) {
  const contextTokens = model.contextTokens;
  if (typeof contextTokens === "number" && Number.isFinite(contextTokens) && contextTokens > 0)
    return contextTokens;
  return typeof model.contextWindow === "number" &&
    Number.isFinite(model.contextWindow) &&
    model.contextWindow > 0
    ? model.contextWindow
    : void 0;
}
function isQwenOpenAICompletionsThinkingFormat(format) {
  return format === "qwen" || format === "qwen-chat-template";
}
function isOpenAICompletionsThinkingEnabled(effort) {
  const normalized = effort.trim().toLowerCase();
  return normalized !== "off" && normalized !== "none";
}
function setQwenChatTemplateThinking(params, enabled) {
  const existing = params.chat_template_kwargs;
  params.chat_template_kwargs =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? {
          ...existing,
          enable_thinking: enabled,
        }
      : { enable_thinking: enabled };
}
function applyQwenOpenAICompletionsThinkingParams(params) {
  if (!params.modelReasoning || !isQwenOpenAICompletionsThinkingFormat(params.compatThinkingFormat))
    return false;
  const enabled = isOpenAICompletionsThinkingEnabled(params.requestedEffort);
  if (params.compatThinkingFormat === "qwen-chat-template")
    setQwenChatTemplateThinking(params.payload, enabled);
  else params.payload.enable_thinking = enabled;
  return true;
}
function applyTogetherOpenAICompletionsThinkingParams(params) {
  if (!params.modelReasoning || params.compatThinkingFormat !== "together") return false;
  params.payload.reasoning = {
    enabled: isOpenAICompletionsThinkingEnabled(params.requestedEffort),
  };
  return true;
}
function convertTools(tools, compat, model) {
  const projection = projectOpenAITools(tools);
  const strict = resolveOpenAIStrictToolFlagWithDiagnostics(
    projection,
    resolveOpenAIStrictToolSetting(model, {
      transport: "stream",
      supportsStrictMode: compat?.supportsStrictMode,
    }),
    {
      transport: "completions",
      model,
    },
  );
  return {
    projection,
    tools: sortTransportToolsByName(projection.tools).map((tool) => {
      const functionTool = {
        name: tool.name,
        description: tool.description,
        parameters: normalizeOpenAIStrictToolParameters(
          tool.parameters,
          strict === true,
          model.compat,
        ),
      };
      if (strict !== void 0) functionTool.strict = strict;
      return {
        type: "function",
        function: functionTool,
      };
    }),
  };
}
function extractGoogleThoughtSignature(toolCall) {
  const tc = toolCall;
  if (!tc) return;
  const fromExtra = tc.extra_content?.google?.thought_signature;
  if (typeof fromExtra === "string" && fromExtra.length > 0) return fromExtra;
  const fromFunction = tc.function?.thought_signature;
  return typeof fromFunction === "string" && fromFunction.length > 0 ? fromFunction : void 0;
}
function isGoogleOpenAICompatModel(model) {
  const endpointClass = detectOpenAICompletionsCompat(model).capabilities.endpointClass;
  return (
    model.provider === "google" ||
    endpointClass === "google-generative-ai" ||
    endpointClass === "google-vertex"
  );
}
function requiresGoogleCompatToolCallThoughtSignature(model) {
  return isGoogleGemini3ProModel(model.id) || isGoogleGemini3FlashModel(model.id);
}
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE = /[\u2026]|\.\.\./;
const GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE = /^[A-Za-z0-9+/=]+$/;
function hasGoogleCompatThoughtSignatureTruncationFootprint(value) {
  return (
    GOOGLE_COMPAT_THOUGHT_SIGNATURE_ELLIPSIS_RE.test(value) ||
    (GOOGLE_COMPAT_THOUGHT_SIGNATURE_BASE64_RE.test(value) && value.length % 4 !== 0)
  );
}
function injectToolCallThoughtSignatures(outgoingMessages, context, model) {
  if (!isGoogleOpenAICompatModel(model)) return;
  const sigById = /* @__PURE__ */ new Map();
  const fallbackSig = requiresGoogleCompatToolCallThoughtSignature(model)
    ? GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP
    : void 0;
  for (const msg of context.messages ?? []) {
    if (msg.role !== "assistant") continue;
    const source = msg;
    if (!Array.isArray(source.content)) continue;
    for (const block of source.content) {
      if (block.type !== "toolCall") continue;
      const id = block.id;
      const sig = block.thoughtSignature;
      if (typeof id === "string" && typeof sig === "string" && sig.length > 0) {
        const isSameRoute =
          source.api === model.api &&
          source.provider === model.provider &&
          source.model === model.id;
        if (!isSameRoute && !fallbackSig) continue;
        sigById.set(id, isSameRoute ? sig : (fallbackSig ?? sig));
      }
    }
  }
  if (sigById.size === 0 && !fallbackSig) return;
  for (const message of outgoingMessages) {
    const toolCalls = message.tool_calls;
    if (!Array.isArray(toolCalls)) continue;
    for (const toolCall of toolCalls) {
      const id = toolCall.id;
      if (typeof id !== "string") continue;
      let sig = sigById.get(id) ?? fallbackSig;
      if (typeof sig === "string" && sig.length > 0) {
        if (hasGoogleCompatThoughtSignatureTruncationFootprint(sig.trim())) sig = fallbackSig;
      }
      if (typeof sig !== "string" || sig.length === 0) continue;
      const extra =
        toolCall.extra_content && typeof toolCall.extra_content === "object"
          ? toolCall.extra_content
          : {};
      toolCall.extra_content = extra;
      const google = extra.google && typeof extra.google === "object" ? extra.google : {};
      extra.google = google;
      google.thought_signature = sig;
    }
  }
}
const COMPLETIONS_REASONING_REPLAY_FIELDS = [
  "reasoning_details",
  "reasoning_content",
  "reasoning",
  "reasoning_text",
];
function stripCompletionsReasoningReplayFields(record) {
  for (const field of COMPLETIONS_REASONING_REPLAY_FIELDS)
    if (field in record) delete record[field];
}
function sanitizeOpenRouterReasoningReplayFields(record) {
  const reasoningDetails = record.reasoning_details;
  if (typeof reasoningDetails === "string") {
    if (reasoningDetails.length > 0 && typeof record.reasoning !== "string")
      record.reasoning = reasoningDetails;
    delete record.reasoning_details;
  } else if (reasoningDetails !== void 0 && !Array.isArray(reasoningDetails))
    delete record.reasoning_details;
  if ("reasoning" in record && (typeof record.reasoning !== "string" || record.reasoning === ""))
    delete record.reasoning;
  if (
    "reasoning_content" in record &&
    (typeof record.reasoning_content !== "string" || record.reasoning_content === "")
  )
    delete record.reasoning_content;
  const reasoningText = record.reasoning_text;
  if (
    typeof reasoningText === "string" &&
    reasoningText.length > 0 &&
    typeof record.reasoning !== "string" &&
    typeof record.reasoning_content !== "string"
  )
    record.reasoning = reasoningText;
  if ("reasoning_text" in record) delete record.reasoning_text;
}
function sanitizeReasoningContentReplayFields(record) {
  if ("reasoning_content" in record && typeof record.reasoning_content !== "string")
    delete record.reasoning_content;
  delete record.reasoning_details;
  delete record.reasoning;
  delete record.reasoning_text;
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = /* @__PURE__ */ new Set([
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "kimi-for-coding",
  "kimi-k2.5",
  "kimi-k2.6",
  "kimi-k2.7-code",
  "kimi-k2-thinking",
  "kimi-k2-thinking-turbo",
  "mimo-v2-pro",
  "mimo-v2-omni",
  "mimo-v2.5",
  "mimo-v2.5-pro",
  "mimo-v2.6-pro",
]);
const REASONING_CONTENT_REPLAY_TIER_SUFFIXES = ["-free", "-paid", "-trial"];
function stripReasoningContentReplayTierSuffix(modelId) {
  for (const suffix of REASONING_CONTENT_REPLAY_TIER_SUFFIXES)
    if (modelId.length > suffix.length && modelId.endsWith(suffix))
      return modelId.slice(0, -suffix.length);
  return modelId;
}
function getReasoningContentReplayModelIdCandidates(modelId) {
  if (typeof modelId !== "string") return [];
  const normalized = modelId.trim().toLowerCase();
  if (!normalized) return [];
  const parts = normalized.split("/").filter(Boolean);
  const finalPart = parts[parts.length - 1] ?? normalized;
  const candidates = [finalPart];
  const colonParts = finalPart.split(":").filter(Boolean);
  if (colonParts.length > 1)
    candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
  const baseCount = candidates.length;
  for (let index = 0; index < baseCount; index += 1) {
    const candidate = candidates[index];
    if (typeof candidate !== "string") continue;
    const stripped = stripReasoningContentReplayTierSuffix(candidate);
    if (stripped !== candidate) candidates.push(stripped);
  }
  return uniqueStrings(candidates.filter(Boolean));
}
function shouldPreserveReasoningContentReplay(model, compat) {
  if (
    compat.requiresReasoningContentOnAssistantMessages ||
    compat.thinkingFormat === "deepseek" ||
    compat.thinkingFormat === "zai" ||
    shouldTrustReasoningContentReplayMetadata(model)
  )
    return true;
  return getReasoningContentReplayModelIdCandidates(model.id).some((modelId) =>
    REASONING_CONTENT_REPLAY_MODEL_IDS.has(modelId),
  );
}
function shouldPreserveOpenRouterReasoningReplay(model) {
  if (model.provider !== "openrouter") return true;
  const normalizedModelId = model.id.trim().toLowerCase();
  return !(normalizedModelId.startsWith("anthropic/") || normalizedModelId.startsWith("x-ai/"));
}
function shouldTrustReasoningContentReplayMetadata(model) {
  if (!model.reasoning) return false;
  if (model.provider.trim().toLowerCase() === "openai") return false;
  return shouldPreserveOpenRouterReasoningReplay(model);
}
function sanitizeCompletionsReasoningReplayFields(messages, options) {
  if (!Array.isArray(messages)) return;
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") continue;
    const record = msg;
    if (record.role !== "assistant") continue;
    if (options.preserveOpenRouterReasoning) sanitizeOpenRouterReasoningReplayFields(record);
    else if (options.preserveReasoningContent) sanitizeReasoningContentReplayFields(record);
    else stripCompletionsReasoningReplayFields(record);
  }
}
function buildOpenAICompletionsParams$1(model, context, options) {
  const compat = getCompat(model);
  const compatDetection = detectOpenAICompletionsCompat(model);
  let messages = convertMessages(
    model,
    context.systemPrompt
      ? {
          ...context,
          systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt),
        }
      : context,
    compat,
  );
  injectToolCallThoughtSignatures(messages, context, model);
  sanitizeCompletionsReasoningReplayFields(messages, {
    preserveOpenRouterReasoning:
      compat.thinkingFormat === "openrouter" && shouldPreserveOpenRouterReasoningReplay(model),
    preserveReasoningContent: shouldPreserveReasoningContentReplay(model, compat),
  });
  if (compat.strictMessageKeys) messages = stripCompletionMessagesToRoleContent(messages);
  const cacheRetention = resolveCacheRetention(options?.cacheRetention);
  const promptCacheKey = resolvePromptCacheKey(options, cacheRetention);
  const params = {
    model: model.id,
    messages: compat.requiresStringContent
      ? flattenCompletionMessagesToStringContent(messages)
      : messages,
    stream: true,
  };
  if (compat.supportsUsageInStreaming) params.stream_options = { include_usage: true };
  if (compat.supportsStore) params.store = false;
  if (compat.supportsPromptCacheKey && promptCacheKey) {
    params.prompt_cache_key = promptCacheKey;
    if (cacheRetention === "long" && compat.supportsLongCacheRetention)
      params.prompt_cache_retention = "24h";
  }
  if (options?.temperature !== void 0) params.temperature = options.temperature;
  if (options?.topP !== void 0) params.top_p = options.topP;
  if (options?.responseFormat !== void 0) params.response_format = options.responseFormat;
  if (options?.frequencyPenalty !== void 0) params.frequency_penalty = options.frequencyPenalty;
  if (options?.presencePenalty !== void 0) params.presence_penalty = options.presencePenalty;
  if (options?.seed !== void 0) params.seed = options.seed;
  if (options?.stop !== void 0 && options.stop.length > 0) params.stop = options.stop;
  if (supportsModelTools(model)) {
    if (context.tools) {
      const converted = convertTools(context.tools, compat, model);
      if (
        converted.tools.length > 0 ||
        (converted.projection.inputToolCount === 0 && converted.projection.diagnostics.length === 0)
      )
        params.tools = converted.tools;
      else if (hasToolHistory(context.messages)) params.tools = [];
      if (options?.toolChoice) {
        const toolChoice = reconcileOpenAICompletionsToolChoice(
          options.toolChoice,
          converted.projection,
        );
        if (toolChoice !== void 0) params.tool_choice = toolChoice;
      } else if (
        compatDetection.capabilities.usesExplicitProxyLikeEndpoint &&
        Array.isArray(params.tools) &&
        params.tools.length > 0
      )
        params.tool_choice = "auto";
    } else if (hasToolHistory(context.messages)) params.tools = [];
    if (
      compatDetection.capabilities.usesExplicitProxyLikeEndpoint &&
      Array.isArray(params.tools) &&
      params.tools.length === 0
    ) {
      delete params.tools;
      delete params.tool_choice;
    }
  }
  {
    const maxTokenBudget = resolveOpenAICompletionsMaxTokens(model, options);
    const effectiveMaxTokens = maxTokenBudget.maxTokens;
    const effectiveContextTokens = resolveOpenAICompletionsEffectiveContextTokens(model);
    let clampedMaxTokens = effectiveMaxTokens;
    const modelMaxTokens = resolveOpenAICompletionsModelMaxTokens(model);
    if (
      maxTokenBudget.clampToModelMaxTokens &&
      clampedMaxTokens !== void 0 &&
      modelMaxTokens !== void 0 &&
      clampedMaxTokens > modelMaxTokens
    ) {
      clampedMaxTokens = modelMaxTokens;
      emitModelTransportDebug(
        log,
        `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} modelMaxTokens=${modelMaxTokens}`,
      );
    }
    if (
      compatDetection.capabilities.usesExplicitProxyLikeEndpoint &&
      clampedMaxTokens !== void 0 &&
      effectiveContextTokens !== void 0
    ) {
      const estimatedInputTokens = estimateOpenAICompletionsInputTokens(params);
      const remainingBudget = Math.max(1, effectiveContextTokens - estimatedInputTokens - 1);
      if (clampedMaxTokens > remainingBudget) {
        clampedMaxTokens = remainingBudget;
        emitModelTransportDebug(
          log,
          `[completions] clamp_max_tokens provider=${model.provider} api=${model.api} model=${model.id} requested=${effectiveMaxTokens} output=${clampedMaxTokens} effectiveContext=${effectiveContextTokens} estimatedInput=${estimatedInputTokens}`,
        );
      }
    }
    if (clampedMaxTokens)
      if (compat.maxTokensField === "max_tokens") params.max_tokens = clampedMaxTokens;
      else params.max_completion_tokens = clampedMaxTokens;
  }
  const completionsReasoningEffort = resolveOpenAICompletionsReasoningEffort(options);
  const resolvedCompletionsReasoningEffort = completionsReasoningEffort
    ? resolveOpenAIReasoningEffortForModel({
        model,
        effort: completionsReasoningEffort,
        fallbackMap: compat.reasoningEffortMap,
      })
    : void 0;
  const omitChatCompletionsToolReasoningEffort =
    Array.isArray(params.tools) &&
    params.tools.length > 0 &&
    (isOpenAIGpt54MiniModel(model) ||
      (isOpenAIGpt55Model(model) && isKnownOpenAICompletionsEndpoint(model)));
  const disableChatCompletionsToolReasoning =
    Array.isArray(params.tools) &&
    params.tools.length > 0 &&
    isOpenAIGpt56Model(model) &&
    isKnownOpenAICompletionsEndpoint(model);
  const handledQwenThinkingFormat = applyQwenOpenAICompletionsThinkingParams({
    compatThinkingFormat: compat.thinkingFormat,
    modelReasoning: model.reasoning,
    payload: params,
    requestedEffort: completionsReasoningEffort,
  });
  applyTogetherOpenAICompletionsThinkingParams({
    compatThinkingFormat: compat.thinkingFormat,
    modelReasoning: model.reasoning,
    payload: params,
    requestedEffort: completionsReasoningEffort,
  });
  if (disableChatCompletionsToolReasoning) params.reasoning_effort = "none";
  else if (
    compat.thinkingFormat === "openrouter" &&
    model.reasoning &&
    resolvedCompletionsReasoningEffort
  )
    params.reasoning = { effort: resolvedCompletionsReasoningEffort };
  else if (
    resolvedCompletionsReasoningEffort &&
    model.reasoning &&
    compat.supportsReasoningEffort &&
    !handledQwenThinkingFormat &&
    !omitChatCompletionsToolReasoningEffort
  )
    params.reasoning_effort = resolvedCompletionsReasoningEffort;
  return params;
}
function parseTransportChunkUsage(rawUsage, model) {
  const cachedTokens = rawUsage.prompt_tokens_details?.cached_tokens || 0;
  const promptTokens = rawUsage.prompt_tokens || 0;
  const input = Math.max(0, promptTokens - cachedTokens);
  const outputTokens = rawUsage.completion_tokens || 0;
  const reasoningTokens = rawUsage.completion_tokens_details?.reasoning_tokens;
  const usage = {
    input,
    output: outputTokens,
    cacheRead: cachedTokens,
    cacheWrite: 0,
    ...(typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens)
      ? { reasoningTokens }
      : {}),
    totalTokens: input + outputTokens + cachedTokens,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      total: 0,
    },
  };
  calculateCost(model, usage);
  applyProviderReportedUsageCost(usage, rawUsage.cost);
  return usage;
}
function hasOpenAICompletionsReasoningUsageActivity(rawUsage) {
  const reasoningTokens = rawUsage.completion_tokens_details?.reasoning_tokens;
  return (
    typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) && reasoningTokens > 0
  );
}
const completionsTesting = {
  getCompat,
  createSseDoneDetector,
  createOpenAICompletionsClient,
  buildOpenAICompletionsClientConfig,
  parseTransportChunkUsage,
  processOpenAICompletionsStream,
  shouldEmitOpenAICompletionsReasoningForModel,
};
//#endregion
//#region src/agents/openai-responses-payload-policy.ts
/**
 * OpenAI Responses payload policy.
 * Classifies endpoint capabilities and applies store, prompt-cache,
 * server-compaction, service-tier, and reasoning payload rules.
 */
const OPENAI_RESPONSES_APIS = /* @__PURE__ */ new Set([
  "openai-responses",
  "azure-openai-responses",
  "openai-chatgpt-responses",
  "openclaw-openai-responses-transport",
]);
const OPENAI_RESPONSES_PROVIDERS = /* @__PURE__ */ new Set([
  "openai",
  "azure-openai",
  "azure-openai-responses",
]);
const LOCAL_ENDPOINT_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const MODELSTUDIO_NATIVE_BASE_URLS = /* @__PURE__ */ new Set([
  "https://coding-intl.dashscope.aliyuncs.com/v1",
  "https://coding.dashscope.aliyuncs.com/v1",
  "https://dashscope.aliyuncs.com/compatible-mode/v1",
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
]);
const MOONSHOT_NATIVE_BASE_URLS = /* @__PURE__ */ new Set([
  "https://api.moonshot.ai/v1",
  "https://api.moonshot.cn/v1",
]);
function normalizeLowercaseString(value) {
  const stringValue = readStringValue(value)?.trim().toLowerCase();
  return stringValue ? stringValue : void 0;
}
function normalizeComparableBaseUrl(value) {
  const trimmed = readStringValue(value)?.trim();
  if (!trimmed) return;
  const parsedValue = /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(trimmed)
    ? `https://${trimmed}`
    : trimmed;
  try {
    const url = new URL(parsedValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/+$/, "").toLowerCase();
  } catch {
    return;
  }
}
function resolveUrlHostname(value) {
  const trimmed = readStringValue(value)?.trim();
  if (!trimmed) return;
  try {
    return new URL(trimmed).hostname.toLowerCase();
  } catch {
    try {
      return new URL(`https://${trimmed}`).hostname.toLowerCase();
    } catch {
      return;
    }
  }
}
function hostMatchesSuffix(host, suffix) {
  return suffix.startsWith(".") || suffix.startsWith("-")
    ? host.endsWith(suffix)
    : host === suffix || host.endsWith(`.${suffix}`);
}
function isLocalEndpointHost(host) {
  return (
    LOCAL_ENDPOINT_HOSTS.has(host) ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  );
}
function resolveBundledOpenAIResponsesEndpointClass(baseUrl) {
  const trimmed = readStringValue(baseUrl)?.trim();
  if (!trimmed) return "default";
  const host = resolveUrlHostname(trimmed);
  if (!host) return "invalid";
  const comparableBaseUrl = normalizeComparableBaseUrl(trimmed);
  switch (host) {
    case "api.anthropic.com":
      return "anthropic-public";
    case "api.cerebras.ai":
      return "cerebras-native";
    case "llm.chutes.ai":
      return "chutes-native";
    case "api.deepseek.com":
      return "deepseek-native";
    case "api.groq.com":
      return "groq-native";
    case "api.mistral.ai":
      return "mistral-public";
    case "api.openai.com":
      return "openai-public";
    case "chatgpt.com":
      return "openai";
    case "generativelanguage.googleapis.com":
      return "google-generative-ai";
    case "aiplatform.googleapis.com":
      return "google-vertex";
    case "api.x.ai":
      return "xai-native";
    case "api.z.ai":
      return "zai-native";
  }
  if (hostMatchesSuffix(host, ".githubcopilot.com")) return "github-copilot-native";
  if (hostMatchesSuffix(host, ".openai.azure.com")) return "azure-openai";
  if (hostMatchesSuffix(host, "openrouter.ai")) return "openrouter";
  if (hostMatchesSuffix(host, "opencode.ai")) return "opencode-native";
  if (hostMatchesSuffix(host, "-aiplatform.googleapis.com")) return "google-vertex";
  if (comparableBaseUrl && MOONSHOT_NATIVE_BASE_URLS.has(comparableBaseUrl))
    return "moonshot-native";
  if (comparableBaseUrl && MODELSTUDIO_NATIVE_BASE_URLS.has(comparableBaseUrl))
    return "modelstudio-native";
  if (isLocalEndpointHost(host)) return "local";
  return "custom";
}
function isOpenAIResponsesApi(api) {
  return api !== void 0 && OPENAI_RESPONSES_APIS.has(api);
}
function readCompatPayloadBoolean(compat, key) {
  if (!compat || typeof compat !== "object") return;
  return asBoolean(compat[key]);
}
function resolveOpenAIResponsesPayloadCapabilities(model) {
  const provider = normalizeLowercaseString(model.provider);
  const api = normalizeLowercaseString(model.api);
  const isOpenAIProvider = provider === "openai";
  const endpointClass = resolveBundledOpenAIResponsesEndpointClass(model.baseUrl);
  const isResponsesApi = isOpenAIResponsesApi(api);
  const usesConfiguredBaseUrl = endpointClass !== "default";
  const usesKnownNativeOpenAIEndpoint =
    endpointClass === "openai-public" ||
    endpointClass === "openai" ||
    endpointClass === "azure-openai";
  const usesKnownNativeOpenAIRoute =
    endpointClass === "default" ? provider === "openai" : usesKnownNativeOpenAIEndpoint;
  const usesExplicitProxyLikeEndpoint = usesConfiguredBaseUrl && !usesKnownNativeOpenAIEndpoint;
  const promptCacheKeySupport = readCompatPayloadBoolean(model.compat, "supportsPromptCacheKey");
  const shouldStripResponsesPromptCache =
    promptCacheKeySupport === true
      ? false
      : promptCacheKeySupport === false
        ? isResponsesApi
        : isResponsesApi && usesExplicitProxyLikeEndpoint;
  const supportsResponsesStoreField =
    readCompatPayloadBoolean(model.compat, "supportsStore") !== false && isResponsesApi;
  return {
    allowsOpenAIServiceTier:
      (provider === "openai" &&
        (api === "openai-responses" || api === "openclaw-openai-responses-transport") &&
        endpointClass === "openai-public") ||
      (isOpenAIProvider &&
        (api === "openai-chatgpt-responses" ||
          api === "openai-responses" ||
          api === "openclaw-openai-responses-transport") &&
        endpointClass === "openai"),
    allowsResponsesStore:
      supportsResponsesStoreField &&
      api !== "openai-chatgpt-responses" &&
      provider !== void 0 &&
      OPENAI_RESPONSES_PROVIDERS.has(provider) &&
      usesKnownNativeOpenAIEndpoint,
    shouldStripResponsesPromptCache,
    supportsResponsesStoreField,
    usesKnownNativeOpenAIRoute,
  };
}
function parsePositiveInteger(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
  if (typeof value === "string") return parseStrictPositiveInteger(value);
}
function resolveOpenAIResponsesCompactThreshold(model) {
  const contextWindow = parsePositiveInteger(model.contextWindow);
  if (contextWindow) return Math.max(1e3, Math.floor(contextWindow * 0.7));
  return 8e4;
}
function shouldEnableOpenAIResponsesServerCompaction(explicitStore, provider, extraParams) {
  const configured = extraParams?.responsesServerCompaction;
  if (configured === false) return false;
  if (explicitStore !== true) return false;
  if (configured === true) return true;
  return provider === "openai";
}
function stripDisabledOpenAIReasoningPayload(payloadObj) {
  const reasoning = payloadObj.reasoning;
  if (reasoning === "none") {
    delete payloadObj.reasoning;
    return;
  }
  if (!reasoning || typeof reasoning !== "object" || Array.isArray(reasoning)) return;
  if (reasoning.effort === "none") delete payloadObj.reasoning;
}
/** Strip returned-item metadata rejected by strict Responses-compatible endpoints. */
function stripInputItemStatuses(input) {
  if (!Array.isArray(input)) return;
  for (const item of input)
    if (item && typeof item === "object" && !Array.isArray(item)) delete item.status;
}
/** Resolve payload mutation policy for one OpenAI Responses-style model endpoint. */
function resolveOpenAIResponsesPayloadPolicy(model, options = {}) {
  const capabilities = resolveOpenAIResponsesPayloadCapabilities(model);
  const storeMode = options.storeMode ?? "provider-policy";
  const explicitStore =
    storeMode === "preserve"
      ? void 0
      : storeMode === "disable"
        ? capabilities.supportsResponsesStoreField
          ? false
          : void 0
        : capabilities.allowsResponsesStore
          ? true
          : void 0;
  const isResponsesApi = isOpenAIResponsesApi(normalizeLowercaseString(model.api));
  const shouldStripDisabledReasoningPayload =
    isResponsesApi &&
    (!capabilities.usesKnownNativeOpenAIRoute || !supportsOpenAIReasoningEffort(model, "none"));
  const shouldStripInputStatus = isResponsesApi && !capabilities.usesKnownNativeOpenAIRoute;
  return {
    allowsServiceTier: capabilities.allowsOpenAIServiceTier,
    compactThreshold:
      parsePositiveInteger(options.extraParams?.responsesCompactThreshold) ??
      resolveOpenAIResponsesCompactThreshold(model),
    explicitStore,
    shouldStripDisabledReasoningPayload,
    shouldStripInputStatus,
    shouldStripPromptCache:
      options.enablePromptCacheStripping === true && capabilities.shouldStripResponsesPromptCache,
    shouldStripStore:
      explicitStore !== true &&
      readCompatPayloadBoolean(model.compat, "supportsStore") === false &&
      isResponsesApi,
    useServerCompaction:
      options.enableServerCompaction === true &&
      shouldEnableOpenAIResponsesServerCompaction(
        explicitStore,
        model.provider,
        options.extraParams,
      ),
  };
}
/** Mutate a Responses request payload according to the resolved endpoint policy. */
function applyOpenAIResponsesPayloadPolicy(payloadObj, policy) {
  if (policy.explicitStore !== void 0) payloadObj.store = policy.explicitStore;
  if (policy.shouldStripStore) delete payloadObj.store;
  if (policy.shouldStripPromptCache) {
    delete payloadObj.prompt_cache_key;
    delete payloadObj.prompt_cache_retention;
  }
  if (policy.useServerCompaction && payloadObj.context_management === void 0)
    payloadObj.context_management = [
      {
        type: "compaction",
        compact_threshold: policy.compactThreshold,
      },
    ];
  if (policy.shouldStripDisabledReasoningPayload) stripDisabledOpenAIReasoningPayload(payloadObj);
  if (policy.shouldStripInputStatus) stripInputItemStatuses(payloadObj.input);
}
//#endregion
//#region src/agents/openai-responses-replay.ts
/** Resolves the assistant message id that can be replayed to OpenAI Responses. */
function resolveReplayableResponsesMessageId(params) {
  if (!params.replayResponsesItemIds) return;
  if (!params.textSignatureId)
    return params.fallbackOrdinal === 0
      ? params.fallbackId
      : `${params.fallbackId}_${params.fallbackOrdinal}`;
  return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
//#endregion
//#region src/agents/responses-image-payload-sanitizer.ts
/**
 * Sanitizes OpenAI Responses payloads before transport. Invalid inline images
 * are replaced with text placeholders so the request remains valid and
 * auditable.
 */
const IMAGE_OMITTED_TEXT = "omitted image payload: invalid inline image data";
function invalidSnakeImage() {
  return {
    type: "input_text",
    text: `[${IMAGE_OMITTED_TEXT}]`,
  };
}
function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!isRecord(value)) return value;
  if (value.type === "input_image" && typeof value.image_url === "string") {
    const imageUrl = sanitizeInlineImageDataUrl(value.image_url);
    return imageUrl
      ? {
          ...value,
          image_url: imageUrl,
        }
      : invalidSnakeImage();
  }
  const next = {};
  for (const [key, child] of Object.entries(value)) next[key] = sanitizeValue(child);
  return next;
}
/** Sanitize inline image fields inside a Responses API payload. */
function sanitizeResponsesImagePayload(params) {
  if (!Array.isArray(params.input)) return params;
  return {
    ...params,
    input: sanitizeValue(params.input),
  };
}
//#endregion
//#region src/agents/openai-responses-transport.ts
/**
 * OpenAI Responses transport for Azure variants, replay, reasoning, and payload policy.
 */
const DEFAULT_AZURE_OPENAI_API_VERSION = "preview";
const OPENAI_CODEX_RESPONSES_EMPTY_INPUT_TEXT = " ";
const OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS = "Follow the user request.";
const AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS = 3e4;
const RESPONSE_FAILED_NO_DETAILS_MESSAGE = "Unknown error (no error details in response)";
const OPENAI_RESPONSES_REASONING_REPLAY_META_KEY = "__openclaw_replay";
const OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY = "openclawReasoningReplay";
const OPENAI_RESPONSES_REPLAY_ITEM_ID_MAX_LENGTH = 64;
function stringifyUnknown(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}
function stringifyJsonLike(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}
function getServiceTierCostMultiplier(serviceTier) {
  switch (serviceTier) {
    case "flex":
      return 0.5;
    case "priority":
      return 2;
    default:
      return 1;
  }
}
function applyServiceTierPricing(usage, serviceTier) {
  const multiplier = getServiceTierCostMultiplier(serviceTier);
  if (multiplier === 1) return;
  usage.cost.input *= multiplier;
  usage.cost.output *= multiplier;
  usage.cost.cacheRead *= multiplier;
  usage.cost.cacheWrite *= multiplier;
  usage.cost.total =
    usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
function safeDebugValue(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";
  if (value === void 0) return "undefined";
  return Array.isArray(value) ? "array" : typeof value;
}
function responseInputTextChars(input) {
  if (typeof input === "string") return input.length;
  if (Array.isArray(input))
    return input.reduce((total, item) => total + responseInputTextChars(item), 0);
  if (!input || typeof input !== "object") return 0;
  const record = input;
  let total = 0;
  if (typeof record.text === "string") total += record.text.length;
  if (typeof record.content === "string") total += record.content.length;
  else if (Array.isArray(record.content)) total += responseInputTextChars(record.content);
  return total;
}
function responseInputRoles(input) {
  if (!Array.isArray(input)) return "";
  const roles = /* @__PURE__ */ new Set();
  for (const item of input)
    if (item && typeof item === "object") {
      const role = item.role;
      if (typeof role === "string" && role.trim()) roles.add(role.trim());
    }
  return [...roles].toSorted().join(",");
}
function readToolPayloadField(record, field) {
  try {
    return record[field];
  } catch {
    return;
  }
}
function readResponsesToolDisplayName(tool) {
  if (!tool || typeof tool !== "object") return "";
  const record = tool;
  const name = readToolPayloadField(record, "name");
  if (typeof name === "string") return name;
  const fn = readToolPayloadField(record, "function");
  if (fn && typeof fn === "object") {
    const fnName = readToolPayloadField(fn, "name");
    if (typeof fnName === "string") return fnName;
  }
  const type = readToolPayloadField(record, "type");
  return typeof type === "string" && type !== "function" ? type : "";
}
function summarizeResponsesTools(tools) {
  if (!Array.isArray(tools)) return "count=0";
  const names = tools.map(readResponsesToolDisplayName).filter(Boolean);
  const mode = resolveModelPayloadDebugMode();
  const maxNames = mode === "tools" || mode === "full-redacted" ? names.length : 12;
  const label = maxNames >= names.length ? "names" : "sample";
  const shown = names.slice(0, maxNames).join(",");
  return `count=${tools.length}${shown ? ` ${label}=${shown}` : ""}`;
}
function stringifyRedactedPayload(value) {
  try {
    const encoded = JSON.stringify(value);
    if (!encoded) return "<empty>";
    const redacted = redactSensitiveText(encoded, { mode: "tools" });
    return redacted.length > 8e3 ? `${truncateUtf16Safe(redacted, 8e3)}…<truncated>` : redacted;
  } catch {
    return "<unserializable>";
  }
}
function stringifyRedactedEvent(value) {
  const redacted = stringifyRedactedPayload(value);
  return redacted.length > 2e3 ? `${truncateUtf16Safe(redacted, 2e3)}…<truncated>` : redacted;
}
const RESPONSE_FAILED_FAILURE_FIELD_KEYS = [
  "error",
  "incomplete_details",
  "status_details",
  "failure_reason",
  "last_error",
  "provider_error",
  "error_details",
];
function readResponseFailedString(record, key) {
  return stringifyUnknown(record?.[key]);
}
function buildResponsesFailedEventSummary(message, responseId, observation) {
  const summary = { message };
  if (responseId) summary.responseId = responseId;
  if (observation) summary.observation = observation;
  return summary;
}
function isResponseFailedIdentifierKey(key) {
  const normalized = key.replace(/[-_\s]/g, "").toLowerCase();
  return (
    normalized === "requestid" ||
    normalized === "xrequestid" ||
    normalized === "providerrequestid" ||
    normalized === "providerresponseid" ||
    normalized === "litellmrequestid" ||
    (normalized.includes("request") && normalized.endsWith("id")) ||
    (normalized.includes("provider") && normalized.endsWith("id"))
  );
}
function collectResponseFailedIdentifierHashes(value, opts = {}) {
  const path = opts.path ?? "";
  const depth = opts.depth ?? 0;
  const identifierKey = opts.identifierKey ?? "";
  const out = opts.out ?? [];
  const seen = opts.seen ?? /* @__PURE__ */ new WeakSet();
  if (out.length >= 12 || depth > 4 || !value || typeof value !== "object") return out;
  if (seen.has(value)) return out;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      if (index >= 8 || out.length >= 12) break;
      const itemString =
        typeof item === "string" || typeof item === "number" ? String(item).trim() : "";
      if (identifierKey && isResponseFailedIdentifierKey(identifierKey) && itemString) {
        out.push(`${path}[${index}]=${redactIdentifier(itemString, { len: 12 })}`);
        continue;
      }
      collectResponseFailedIdentifierHashes(item, {
        path: `${path}[${index}]`,
        depth: depth + 1,
        identifierKey,
        out,
        seen,
      });
    }
    return out;
  }
  for (const [key, child] of Object.entries(value)) {
    if (out.length >= 12) break;
    const childPath = path ? `${path}.${key}` : key;
    const childString =
      typeof child === "string" || typeof child === "number" ? String(child).trim() : "";
    if (isResponseFailedIdentifierKey(key) && childString) {
      out.push(`${childPath}=${redactIdentifier(childString, { len: 12 })}`);
      continue;
    }
    collectResponseFailedIdentifierHashes(child, {
      path: childPath,
      depth: depth + 1,
      identifierKey: isResponseFailedIdentifierKey(key) ? key : void 0,
      out,
      seen,
    });
  }
  return out;
}
function redactResponseFailedDiagnosticValue(value, opts = {}) {
  const key = opts.key ?? "";
  const depth = opts.depth ?? 0;
  if (typeof value === "string" || typeof value === "number")
    return key && isResponseFailedIdentifierKey(key)
      ? redactIdentifier(String(value), { len: 12 })
      : value;
  if (depth > 6 || !value || typeof value !== "object") return value;
  const seen = opts.seen ?? /* @__PURE__ */ new WeakSet();
  if (seen.has(value)) return "<circular>";
  seen.add(value);
  if (Array.isArray(value))
    return value.slice(0, 16).map((item) =>
      redactResponseFailedDiagnosticValue(item, {
        key,
        depth: depth + 1,
        seen,
      }),
    );
  const out = {};
  for (const [childKey, child] of Object.entries(value))
    out[childKey] = redactResponseFailedDiagnosticValue(child, {
      key: childKey,
      depth: depth + 1,
      seen,
    });
  return out;
}
function buildResponsesFailedFailureFields(response) {
  if (!response) return {};
  const fields = {};
  for (const key of RESPONSE_FAILED_FAILURE_FIELD_KEYS)
    if (response[key] !== void 0 && response[key] !== null) fields[key] = response[key];
  return fields;
}
function buildResponsesFailedNoDetailsObservation(
  event,
  model,
  response = isRecord(event.response) ? event.response : void 0,
) {
  const failureFields = redactResponseFailedDiagnosticValue(
    buildResponsesFailedFailureFields(response),
  );
  const metadataKeys = isRecord(response?.metadata)
    ? Object.keys(response.metadata).toSorted()
    : [];
  const responsePreview = {
    id: readResponseFailedString(response, "id"),
    status: readResponseFailedString(response, "status"),
    model: readResponseFailedString(response, "model"),
    object: readResponseFailedString(response, "object"),
    failureFields,
    metadataKeys,
  };
  return {
    event: "openai_responses_response_failed_without_details",
    provider: model.provider,
    api: model.api,
    transportModel: model.id,
    providerRuntimeFailureKind: "no_error_details",
    responseId: responsePreview.id,
    responseStatus: responsePreview.status,
    responseModel: responsePreview.model,
    responseObject: responsePreview.object,
    metadataKeys,
    requestIdHashes: collectResponseFailedIdentifierHashes(event),
    failureFieldsPreview: stringifyRedactedEvent(failureFields),
    responsePreview: stringifyRedactedEvent(responsePreview),
  };
}
function summarizeResponsesFailedNoDetailsObservation(observation) {
  const requestIds = observation.requestIdHashes.join(",");
  const metadataKeys = observation.metadataKeys.join(",");
  return `responseId=${safeDebugValue(observation.responseId || void 0)} responseStatus=${safeDebugValue(observation.responseStatus || void 0)} responseModel=${safeDebugValue(observation.responseModel || void 0)} requestIds=${requestIds || "none"} metadataKeys=${metadataKeys || "none"} failureFields=${observation.failureFieldsPreview}`;
}
function normalizeResponsesFailedEvent(event, model) {
  const response = isRecord(event.response) ? event.response : void 0;
  const responseId = readResponseFailedString(response, "id") || void 0;
  const error = isRecord(response?.error) ? response.error : void 0;
  if (error) {
    const code = readResponseFailedString(error, "code").trim();
    const message = readResponseFailedString(error, "message").trim();
    if (code || message)
      return buildResponsesFailedEventSummary(
        `${code || "unknown"}: ${message || "no message"}`,
        responseId,
      );
  }
  const incompleteReason = readResponseFailedString(
    isRecord(response?.incomplete_details) ? response.incomplete_details : void 0,
    "reason",
  );
  if (incompleteReason)
    return buildResponsesFailedEventSummary(`incomplete: ${incompleteReason}`, responseId);
  return buildResponsesFailedEventSummary(
    RESPONSE_FAILED_NO_DETAILS_MESSAGE,
    responseId,
    buildResponsesFailedNoDetailsObservation(event, model, response),
  );
}
function logResponsesFailedNoDetails(observation) {
  log.warn(
    `[responses] response.failed missing error details provider=${observation.provider} api=${observation.api} model=${observation.transportModel} ` +
      summarizeResponsesFailedNoDetailsObservation(observation),
    observation,
  );
}
function summarizeResponsesPayload(params) {
  if (!params || typeof params !== "object") return "payload=non-object";
  const record = params;
  const input = record.input;
  const reasoning =
    record.reasoning && typeof record.reasoning === "object" ? record.reasoning : void 0;
  const text = record.text && typeof record.text === "object" ? record.text : void 0;
  const parts = [
    `fields=${Object.keys(record).toSorted().join(",")}`,
    `model=${safeDebugValue(record.model)}`,
    `stream=${safeDebugValue(record.stream)}`,
    `inputItems=${Array.isArray(input) ? input.length : typeof input}`,
    `inputRoles=${responseInputRoles(input) || "none"}`,
    `inputTextChars=${responseInputTextChars(input)}`,
    `tools=${summarizeResponsesTools(record.tools)}`,
    `reasoningEffort=${safeDebugValue(reasoning?.effort)}`,
    `reasoningSummary=${safeDebugValue(reasoning?.summary)}`,
    `textVerbosity=${safeDebugValue(text?.verbosity)}`,
    `serviceTier=${safeDebugValue(record.service_tier)}`,
    `store=${safeDebugValue(record.store)}`,
    `promptCacheKey=${record.prompt_cache_key === void 0 ? "absent" : "present"}`,
    `metadataKeys=${record.metadata && typeof record.metadata === "object" ? Object.keys(record.metadata).toSorted().join(",") : "none"}`,
  ];
  if (resolveModelPayloadDebugMode() === "full-redacted")
    parts.push(`payload=${stringifyRedactedPayload(record)}`);
  return parts.join(" ");
}
function summarizeOpenAITransportError(error) {
  if (!error || typeof error !== "object")
    return `type=${typeof error} message=${safeDebugValue(error)}`;
  const record = error;
  const cause = record.cause && typeof record.cause === "object" ? record.cause : void 0;
  return [
    `name=${safeDebugValue(record.name)}`,
    `status=${safeDebugValue(record.status)}`,
    `code=${safeDebugValue(record.code)}`,
    `type=${safeDebugValue(record.type)}`,
    `causeName=${safeDebugValue(cause?.name)}`,
    `causeCode=${safeDebugValue(cause?.code)}`,
    `message=${error instanceof Error ? error.message : safeDebugValue(error)}`,
  ].join(" ");
}
function isInvalidEncryptedContentError(error) {
  if (!error || typeof error !== "object") return false;
  const record = error;
  if (record.code === "invalid_encrypted_content" || record.code === "thinking_signature_invalid")
    return true;
  const message = typeof record.message === "string" ? record.message : "";
  return (
    message.includes("invalid_encrypted_content") ||
    message.includes("thinking_signature_invalid") ||
    (record.status === 400 &&
      message.toLowerCase().includes("could not decrypt the provided encrypted_content"))
  );
}
function stripEncryptedContentFields(value) {
  if (!value || typeof value !== "object")
    return {
      value,
      changed: false,
    };
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const stripped = stripEncryptedContentFields(item);
      changed ||= stripped.changed;
      return stripped.value;
    });
    return changed
      ? {
          value: next,
          changed: true,
        }
      : {
          value,
          changed: false,
        };
  }
  let changed = false;
  const next = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "encrypted_content") {
      changed = true;
      continue;
    }
    const stripped = stripEncryptedContentFields(child);
    changed ||= stripped.changed;
    next[key] = stripped.value;
  }
  return changed
    ? {
        value: next,
        changed: true,
      }
    : {
        value,
        changed: false,
      };
}
function stripResponsesRequestEncryptedContent(params) {
  const stripped = stripEncryptedContentFields(params.input);
  if (!stripped.changed) return params;
  return {
    ...params,
    input: stripped.value,
  };
}
function hashOptionalReplayContextValue(value) {
  const normalized = value?.trim();
  return normalized ? shortHash(normalized) : void 0;
}
function buildOpenAIResponsesReplayContext(model, options) {
  return {
    provider: model.provider,
    api: model.api,
    model: model.id,
    baseUrlHash: hashOptionalReplayContextValue(model.baseUrl),
    sessionHash: hashOptionalReplayContextValue(options?.sessionId),
    authProfileHash: hashOptionalReplayContextValue(options?.authProfileId),
  };
}
function buildOpenAIResponsesReasoningReplayMetadata(model, options) {
  return {
    v: 1,
    source: "openai-responses",
    ...buildOpenAIResponsesReplayContext(model, options),
  };
}
function tagOpenAIResponsesReasoningReplayItem(item, model, options) {
  if (!("encrypted_content" in item)) return item;
  return {
    ...item,
    [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]: buildOpenAIResponsesReasoningReplayMetadata(
      model,
      options,
    ),
  };
}
function isOpenAIResponsesReasoningReplayMetadata(value) {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return (
    record.v === 1 &&
    record.source === "openai-responses" &&
    typeof record.provider === "string" &&
    typeof record.api === "string" &&
    typeof record.model === "string" &&
    (record.baseUrlHash === void 0 || typeof record.baseUrlHash === "string") &&
    (record.sessionHash === void 0 || typeof record.sessionHash === "string") &&
    (record.authProfileHash === void 0 || typeof record.authProfileHash === "string")
  );
}
function encryptedReasoningReplayMetadataMatches(metadata, context) {
  if (!metadata) return false;
  return (
    metadata.provider === context.provider &&
    metadata.api === context.api &&
    metadata.model === context.model &&
    metadata.baseUrlHash === context.baseUrlHash &&
    metadata.sessionHash === context.sessionHash &&
    metadata.authProfileHash === context.authProfileHash
  );
}
function readOpenAIResponsesReasoningReplayBlockMetadata(block) {
  const value = block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY];
  return isOpenAIResponsesReasoningReplayMetadata(value) ? value : void 0;
}
function normalizeOpenAIResponsesReasoningReplayItem(item) {
  const record = item;
  if (record.type !== "reasoning" || Array.isArray(record.summary)) return item;
  return {
    ...record,
    summary: [],
  };
}
function prepareOpenAIResponsesReasoningItemForReplay(item, context, blockMetadata) {
  const { [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]: rawMetadata, ...rest } = item;
  if (!("encrypted_content" in rest)) return normalizeOpenAIResponsesReasoningReplayItem(rest);
  if (
    encryptedReasoningReplayMetadataMatches(
      blockMetadata ??
        (isOpenAIResponsesReasoningReplayMetadata(rawMetadata) ? rawMetadata : void 0),
      context,
    )
  )
    return normalizeOpenAIResponsesReasoningReplayItem(rest);
  return normalizeOpenAIResponsesReasoningReplayItem(stripEncryptedContentFields(rest).value);
}
async function createResponsesStreamWithEncryptedContentRetry(params) {
  try {
    return await params.client.responses.create(params.request, params.requestOptions);
  } catch (error) {
    const retryRequest = stripResponsesRequestEncryptedContent(params.request);
    if (!isInvalidEncryptedContentError(error) || retryRequest === params.request) throw error;
    log.warn(
      `[responses] retrying without encrypted reasoning content provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`,
    );
    return await params.client.responses.create(retryRequest, params.requestOptions);
  }
}
function resolveAzureOpenAIApiVersion(env = process.env) {
  return env.AZURE_OPENAI_API_VERSION?.trim() || DEFAULT_AZURE_OPENAI_API_VERSION;
}
function shortHash(value) {
  return sha256HexPrefix(value, 16);
}
function normalizeResponsesReplayItemId(id, prefix) {
  if (!id) return;
  if (id.length <= OPENAI_RESPONSES_REPLAY_ITEM_ID_MAX_LENGTH) return id;
  return `${prefix}_${shortHash(id)}`;
}
function isSafeResponsesReplayItemId(id) {
  return (
    typeof id === "string" &&
    id.length > 0 &&
    id.length <= OPENAI_RESPONSES_REPLAY_ITEM_ID_MAX_LENGTH
  );
}
function encodeTextSignatureV1(id, phase) {
  return JSON.stringify({
    v: 1,
    id,
    ...(phase ? { phase } : {}),
  });
}
function parseTextSignature(signature) {
  if (!signature) return;
  if (signature.startsWith("{"))
    try {
      const parsed = JSON.parse(signature);
      if (parsed.v === 1) {
        const id = typeof parsed.id === "string" ? parsed.id : void 0;
        const phase =
          parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
        if (id !== void 0 || phase !== void 0)
          return {
            id,
            phase,
          };
        return;
      }
    } catch {}
  return { id: signature };
}
function buildResponsesInputMessage(role, content) {
  return {
    type: "message",
    role,
    content,
  };
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
  const messages = [];
  const shouldReplayReasoningItems = options?.replayReasoningItems ?? true;
  const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
  const replayContext = buildOpenAIResponsesReplayContext(model, {
    sessionId: options?.sessionId,
    authProfileId: options?.authProfileId,
  });
  const shouldNormalizeSameModelToolCallIds = model.provider === "github-copilot";
  const sanitizeIdPart = (part) => part.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+$/, "");
  const normalizeIdPart = (part) => {
    const sanitized = sanitizeIdPart(part);
    return (sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized).replace(/_+$/, "");
  };
  const buildForeignResponsesItemId = (itemId) => {
    const normalized = `fc_${shortHash(itemId)}`;
    return normalized.length > 64 ? normalized.slice(0, 64) : normalized;
  };
  const buildSameProviderCopilotResponsesItemId = (itemId) => {
    const sanitized = sanitizeIdPart(itemId);
    const candidate = sanitized.startsWith("fc_") ? sanitized : `fc_${sanitized}`;
    return candidate.length > 64 ? buildForeignResponsesItemId(itemId) : candidate;
  };
  const normalizeToolCallId = (id, _targetModel, source) => {
    if (!allowedToolCallProviders.has(model.provider)) return normalizeIdPart(id);
    if (!id.includes("|")) return normalizeIdPart(id);
    const separatorIndex = id.indexOf("|");
    const callId = id.slice(0, separatorIndex);
    const itemId = id.slice(separatorIndex + 1);
    const normalizedCallId = normalizeIdPart(callId);
    let normalizedItemId =
      source.provider !== model.provider || source.api !== model.api
        ? buildForeignResponsesItemId(itemId)
        : model.provider === "github-copilot"
          ? buildSameProviderCopilotResponsesItemId(itemId)
          : normalizeIdPart(itemId);
    if (!normalizedItemId.startsWith("fc_"))
      normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
    return `${normalizedCallId}|${normalizedItemId}`;
  };
  const transformedMessages = transformTransportMessages(
    context.messages,
    model,
    normalizeToolCallId,
    { normalizeSameModelToolCallIds: shouldNormalizeSameModelToolCallIds },
  );
  if ((options?.includeSystemPrompt ?? true) && context.systemPrompt)
    messages.push(
      buildResponsesInputMessage(
        model.reasoning && options?.supportsDeveloperRole !== false ? "developer" : "system",
        [
          {
            type: "input_text",
            text: sanitizeTransportPayloadText(
              stripSystemPromptCacheBoundary(context.systemPrompt),
            ),
          },
        ],
      ),
    );
  let msgIndex = 0;
  for (const msg of transformedMessages) {
    if (msg.role === "user")
      if (typeof msg.content === "string")
        messages.push(
          buildResponsesInputMessage("user", [
            {
              type: "input_text",
              text: sanitizeTransportPayloadText(msg.content),
            },
          ]),
        );
      else {
        const content = msg.content
          .map((item) =>
            item.type === "text"
              ? {
                  type: "input_text",
                  text: sanitizeTransportPayloadText(item.text),
                }
              : {
                  type: "input_image",
                  detail: "auto",
                  image_url: `data:${item.mimeType};base64,${item.data}`,
                },
          )
          .filter((item) => model.input.includes("image") || item.type !== "input_image");
        if (content.length > 0) messages.push(buildResponsesInputMessage("user", content));
      }
    else if (msg.role === "assistant") {
      const output = [];
      let textFallbackOrdinal = 0;
      let previousReplayItemWasReasoning = false;
      const isDifferentModel =
        msg.model !== model.id && msg.provider === model.provider && msg.api === model.api;
      for (const block of msg.content)
        if (block.type === "thinking") {
          if (
            shouldReplayReasoningItems &&
            block.thinkingSignature &&
            block.thinkingSignature.startsWith("{")
          ) {
            const replayableReasoningItem = prepareOpenAIResponsesReasoningItemForReplay(
              JSON.parse(block.thinkingSignature),
              replayContext,
              readOpenAIResponsesReasoningReplayBlockMetadata(block),
            );
            if (!shouldReplayResponsesItemIds) delete replayableReasoningItem.id;
            if (
              shouldReplayResponsesItemIds &&
              model.provider === "github-copilot" &&
              !isSafeResponsesReplayItemId(replayableReasoningItem.id)
            )
              continue;
            output.push(replayableReasoningItem);
            previousReplayItemWasReasoning = true;
          }
        } else if (block.type === "text") {
          const textSignature = parseTextSignature(block.textSignature);
          let msgId = resolveReplayableResponsesMessageId({
            replayResponsesItemIds: shouldReplayResponsesItemIds,
            textSignatureId: textSignature?.id,
            fallbackId: `msg_${msgIndex}`,
            fallbackOrdinal: textFallbackOrdinal,
            previousReplayItemWasReasoning,
          });
          if (!textSignature?.id) textFallbackOrdinal += 1;
          msgId = normalizeResponsesReplayItemId(msgId, "msg");
          const messageItem = {
            type: "message",
            role: "assistant",
            content: [
              {
                type: "output_text",
                text: sanitizeTransportPayloadText(block.text),
                annotations: [],
              },
            ],
            status: "completed",
            ...(msgId ? { id: msgId } : {}),
            phase: textSignature?.phase,
          };
          output.push(messageItem);
          previousReplayItemWasReasoning = false;
        } else if (block.type === "toolCall") {
          const separatorIndex = block.id.indexOf("|");
          const callId = separatorIndex === -1 ? block.id : block.id.slice(0, separatorIndex);
          const itemIdRaw = separatorIndex === -1 ? void 0 : block.id.slice(separatorIndex + 1);
          const itemId =
            shouldReplayResponsesItemIds && !(isDifferentModel && itemIdRaw?.startsWith("fc_"))
              ? itemIdRaw
              : void 0;
          output.push({
            type: "function_call",
            ...(itemId ? { id: itemId } : {}),
            call_id: callId,
            name: block.name,
            arguments:
              typeof block.arguments === "string"
                ? block.arguments
                : JSON.stringify(block.arguments ?? {}),
          });
          previousReplayItemWasReasoning = false;
        }
      if (output.length > 0) messages.push(...output);
    } else if (msg.role === "toolResult") {
      const textResult = extractToolResultText(msg.content);
      const sanitizedTextResult = sanitizeTransportPayloadText(textResult);
      const hasText = sanitizedTextResult.trim().length > 0;
      const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
      const hasImages = msg.content.some((item) => item.type === "image");
      const separatorIndex = msg.toolCallId.indexOf("|");
      const callId =
        separatorIndex === -1 ? msg.toolCallId : msg.toolCallId.slice(0, separatorIndex);
      messages.push({
        type: "function_call_output",
        call_id: callId,
        output:
          hasImages && model.input.includes("image")
            ? [
                ...(hasText
                  ? [
                      {
                        type: "input_text",
                        text: sanitizedTextResult,
                      },
                    ]
                  : mediaPlaceholder === "(see attached media)"
                    ? [
                        {
                          type: "input_text",
                          text: mediaPlaceholder,
                        },
                      ]
                    : []),
                ...msg.content
                  .filter((item) => item.type === "image")
                  .map((item) => ({
                    type: "input_image",
                    detail: "auto",
                    image_url: `data:${item.mimeType};base64,${item.data}`,
                  })),
              ]
            : sanitizeNonEmptyTransportPayloadText(textResult, mediaPlaceholder ?? "(no output)"),
      });
    }
    msgIndex += 1;
  }
  return messages;
}
function convertResponsesTools(tools, model, options) {
  const projection = projectOpenAITools(tools);
  const strict = resolveOpenAIStrictToolFlagWithDiagnostics(projection, options?.strict, {
    transport: "responses",
    model,
  });
  return {
    projection,
    tools: sortTransportToolsByName(projection.tools).map((tool) => {
      const result = {
        type: "function",
        name: tool.name,
        description: tool.description,
        parameters: normalizeOpenAIStrictToolParameters(
          tool.parameters,
          strict === true,
          model.compat,
        ),
      };
      if (strict !== void 0) result.strict = strict;
      return result;
    }),
  };
}
async function processResponsesStream(openaiStream, output, stream, model, options) {
  const resolveToolCallId = (item, fallbackId) => {
    const callId = stringifyUnknown(item.call_id).trim();
    const itemId = stringifyUnknown(item.id).trim();
    const [fallbackCallId = "", fallbackItemId = ""] = (fallbackId ?? "").split("|");
    const resolvedCallId = callId || fallbackCallId;
    const resolvedItemId = itemId || fallbackItemId;
    if (resolvedCallId)
      return resolvedItemId ? `${resolvedCallId}|${resolvedItemId}` : resolvedCallId;
    const generatedCallId = `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
    return resolvedItemId ? `${generatedCallId}|${resolvedItemId}` : generatedCallId;
  };
  let currentItem = null;
  let currentBlock = null;
  const toolCallsByOutputIndex = /* @__PURE__ */ new Map();
  const unindexedToolCalls = /* @__PURE__ */ new Set();
  let lastTextBlock = null;
  let pendingMessageText = null;
  const streamStartedAt = Date.now();
  let eventCount = 0;
  const eventTypes = /* @__PURE__ */ new Map();
  const sseDebugMode = resolveModelSseDebugMode();
  const blockIndex = () => output.content.length - 1;
  const readOutputIndex = (event) =>
    typeof event.output_index === "number" &&
    Number.isInteger(event.output_index) &&
    event.output_index >= 0
      ? event.output_index
      : void 0;
  const readIdentityValue = (value) => {
    return (typeof value === "string" ? value.trim() : "") || void 0;
  };
  const readEventToolCallIdentity = (event) => ({ itemId: readIdentityValue(event.item_id) });
  const readItemToolCallIdentity = (item) => ({
    itemId: readIdentityValue(item.id),
    callId: readIdentityValue(item.call_id),
  });
  const identitiesConflict = (state, identity) =>
    Boolean(
      (state.itemId && identity.itemId && state.itemId !== identity.itemId) ||
      (state.callId && identity.callId && state.callId !== identity.callId),
    );
  const sharesIdentity = (state, identity) =>
    Boolean(
      (state.itemId && identity.itemId && state.itemId === identity.itemId) ||
      (state.callId && identity.callId && state.callId === identity.callId),
    );
  const adoptToolCallIdentity = (state, identity) => {
    state.itemId ??= identity.itemId;
    state.callId ??= identity.callId;
    return state;
  };
  const resolveCompatibleToolCall = (candidates, identity) => {
    const uniqueCandidates = [...new Set(candidates)];
    if (!identity.itemId && !identity.callId)
      return uniqueCandidates.length === 1 ? uniqueCandidates[0] : void 0;
    const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
    const matches = compatible.filter((state) => sharesIdentity(state, identity));
    if (matches.length === 1) {
      const match = matches.at(0);
      return match ? adoptToolCallIdentity(match, identity) : void 0;
    }
    if (uniqueCandidates.length !== 1 || compatible.length !== 1 || matches.length !== 0) return;
    const candidate = compatible.at(0);
    return candidate ? adoptToolCallIdentity(candidate, identity) : void 0;
  };
  const resolveStreamingToolCall = (event, identity = readEventToolCallIdentity(event)) => {
    const outputIndex = readOutputIndex(event);
    if (outputIndex !== void 0) {
      const indexed = toolCallsByOutputIndex.get(outputIndex);
      if (indexed)
        return !identitiesConflict(indexed, identity)
          ? adoptToolCallIdentity(indexed, identity)
          : void 0;
      const unindexed = resolveCompatibleToolCall(unindexedToolCalls, identity);
      if (unindexed) {
        unindexedToolCalls.delete(unindexed);
        toolCallsByOutputIndex.set(outputIndex, unindexed);
      }
      return unindexed;
    }
    return resolveCompatibleToolCall(
      [...toolCallsByOutputIndex.values(), ...unindexedToolCalls],
      identity,
    );
  };
  const forgetStreamingToolCall = (toolCall) => {
    for (const [trackedIndex, tracked] of toolCallsByOutputIndex)
      if (tracked === toolCall) toolCallsByOutputIndex.delete(trackedIndex);
    unindexedToolCalls.delete(toolCall);
  };
  const markActiveToolCallArgumentsUnreliable = () => {
    for (const toolCall of /* @__PURE__ */ new Set([
      ...toolCallsByOutputIndex.values(),
      ...unindexedToolCalls,
    ]))
      toolCall.argumentStreamReliable = false;
  };
  const hasActiveStreamingToolCall = () =>
    toolCallsByOutputIndex.size > 0 || unindexedToolCalls.size > 0;
  const resolveCompletedToolCallName = (toolCall, value) => {
    const streamedName = readIdentityValue(toolCall?.block.name);
    const completedName = readIdentityValue(value);
    if (streamedName && completedName && streamedName !== completedName)
      throw new Error(
        `Responses stream changed tool-call function name from ${streamedName} to ${completedName}`,
      );
    const name = completedName ?? streamedName;
    if (!name) throw new Error("Responses stream completed tool call without a function name");
    return name;
  };
  const appendPendingMessageDelta = (delta) => {
    pendingMessageText = `${pendingMessageText ?? ""}${delta}`;
    const priorText = stringifyUnknown(lastTextBlock?.block.text);
    if (priorText.startsWith(pendingMessageText) || pendingMessageText.startsWith(priorText))
      return;
    const phase = currentItem?.type === "message" ? (currentItem.phase ?? void 0) : void 0;
    currentBlock = {
      type: "text",
      text: pendingMessageText,
      ...(currentItem?.type === "message" && phase
        ? { textSignature: encodeTextSignatureV1(stringifyUnknown(currentItem.id), phase) }
        : {}),
    };
    output.content.push(currentBlock);
    stream.push({
      type: "text_start",
      contentIndex: blockIndex(),
      partial: output,
    });
    stream.push({
      type: "text_delta",
      contentIndex: blockIndex(),
      delta: pendingMessageText,
    });
    pendingMessageText = null;
  };
  const appendCompletedResponseTextItem = (item) => {
    const text = readResponsesOutputMessageText(item);
    if (!text) return;
    const phase = item.phase ?? void 0;
    const collapse = resolveResponsesMessageSnapshotCollapse({
      prior: lastTextBlock && {
        text: stringifyUnknown(lastTextBlock.block.text),
        phase: lastTextBlock.phase,
      },
      nextText: text,
      nextPhase: phase,
    });
    if (collapse.kind === "extend" && lastTextBlock) {
      lastTextBlock.block.text = collapse.text;
      lastTextBlock.block.textSignature = encodeTextSignatureV1(stringifyUnknown(item.id), phase);
      stream.push({
        type: "text_end",
        contentIndex: lastTextBlock.index,
        content: collapse.text,
        partial: output,
      });
      return;
    }
    const block = {
      type: "text",
      text,
      textSignature: encodeTextSignatureV1(stringifyUnknown(item.id), phase),
    };
    output.content.push(block);
    lastTextBlock = {
      block,
      index: blockIndex(),
      phase,
    };
    stream.push({
      type: "text_start",
      contentIndex: blockIndex(),
      partial: output,
    });
    stream.push({
      type: "text_end",
      contentIndex: blockIndex(),
      content: text,
      partial: output,
    });
  };
  const appendCompletedResponseToolCallItem = (item) => {
    const args = parseStreamingJson(stringifyJsonLike(item.arguments, "{}"));
    const name = resolveCompletedToolCallName(void 0, item.name);
    const block = {
      type: "toolCall",
      id: resolveToolCallId(item),
      name,
      arguments: args,
      partialJson: stringifyJsonLike(item.arguments, "{}"),
    };
    output.content.push(block);
    stream.push({
      type: "toolcall_start",
      contentIndex: blockIndex(),
      partial: output,
    });
    stream.push({
      type: "toolcall_end",
      contentIndex: blockIndex(),
      toolCall: {
        type: "toolCall",
        id: block.id,
        name: block.name,
        arguments: args,
      },
      partial: output,
    });
  };
  const backfillCompletedResponseOutput = (response) => {
    if (output.content.length > 0 || !Array.isArray(response?.output)) return;
    for (const rawItem of response.output) {
      if (!isRecord(rawItem)) continue;
      if (rawItem.type === "message") {
        appendCompletedResponseTextItem(rawItem);
        continue;
      }
      lastTextBlock = null;
      if (rawItem.type === "function_call") appendCompletedResponseToolCallItem(rawItem);
    }
  };
  const guardedStream = withFirstStreamEventTimeout(openaiStream, {
    provider: model.provider,
    api: model.api,
    model: model.id,
    timeoutMs: options?.firstEventTimeoutMs ?? 0,
    stage: "responses",
    abort: options?.abortFirstEventStream,
    onTimeout: options?.onFirstEventTimeout,
    hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools.",
  });
  const cooperativeScheduler = createModelStreamCooperativeScheduler(options?.signal);
  for await (const rawEvent of guardedStream) {
    throwIfModelStreamAborted(options?.signal);
    const event = rawEvent;
    const type = stringifyUnknown(event.type);
    eventCount += 1;
    eventTypes.set(type, (eventTypes.get(type) ?? 0) + 1);
    if (eventCount === 1)
      emitModelTransportDebug(
        log,
        `[responses] first_event provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - streamStartedAt} type=${type}`,
      );
    if (sseDebugMode === "peek" && eventCount <= 5)
      emitModelTransportDebug(
        log,
        `[responses] event_peek provider=${model.provider} api=${model.api} model=${model.id} index=${eventCount} type=${type} event=${stringifyRedactedEvent(event)}`,
      );
    if (type === "response.created") output.responseId = stringifyUnknown(event.response?.id);
    else if (type === "response.output_item.added") {
      const item = event.item;
      if (item.type !== "message") {
        lastTextBlock = null;
        pendingMessageText = null;
      }
      if (item.type === "reasoning") {
        currentItem = item;
        currentBlock = {
          type: "thinking",
          thinking: "",
        };
        output.content.push(currentBlock);
        stream.push({
          type: "thinking_start",
          contentIndex: blockIndex(),
          partial: output,
        });
      } else if (item.type === "message") {
        currentItem = item;
        if (lastTextBlock) {
          currentBlock = null;
          pendingMessageText = "";
        } else {
          const phase = item.phase ?? void 0;
          currentBlock = {
            type: "text",
            text: "",
            ...(phase
              ? { textSignature: encodeTextSignatureV1(stringifyUnknown(item.id), phase) }
              : {}),
          };
          output.content.push(currentBlock);
          stream.push({
            type: "text_start",
            contentIndex: blockIndex(),
            partial: output,
          });
        }
      } else if (item.type === "function_call") {
        const outputIndex = readOutputIndex(event);
        if (outputIndex !== void 0 && toolCallsByOutputIndex.has(outputIndex))
          throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
        currentItem = item;
        currentBlock = {
          type: "toolCall",
          id: resolveToolCallId(item),
          name: readIdentityValue(item.name) ?? "",
          arguments: {},
          partialJson: stringifyJsonLike(item.arguments),
        };
        output.content.push(currentBlock);
        const contentIndex = blockIndex();
        const toolCallState = {
          block: currentBlock,
          contentIndex,
          argumentStreamReliable: true,
          ...readItemToolCallIdentity(item),
        };
        if (outputIndex !== void 0) toolCallsByOutputIndex.set(outputIndex, toolCallState);
        else unindexedToolCalls.add(toolCallState);
        stream.push({
          type: "toolcall_start",
          contentIndex,
          partial: output,
        });
      }
    } else if (type === "response.reasoning_summary_text.delta") {
      if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
        currentBlock.thinking = `${stringifyUnknown(currentBlock.thinking)}${stringifyUnknown(event.delta)}`;
        stream.push({
          type: "thinking_delta",
          contentIndex: blockIndex(),
          delta: stringifyUnknown(event.delta),
          partial: output,
        });
      }
    } else if (isResponsesTextDeltaEventType(type) || type === "response.refusal.delta") {
      if (currentItem?.type === "message") {
        if (pendingMessageText !== null) appendPendingMessageDelta(stringifyUnknown(event.delta));
        else if (currentBlock?.type === "text") {
          currentBlock.text = `${stringifyUnknown(currentBlock.text)}${stringifyUnknown(event.delta)}`;
          stream.push({
            type: "text_delta",
            contentIndex: blockIndex(),
            delta: stringifyUnknown(event.delta),
          });
        }
      }
    } else if (type === "response.function_call_arguments.delta") {
      const toolCall = resolveStreamingToolCall(event);
      if (toolCall) {
        toolCall.block.partialJson = `${stringifyJsonLike(toolCall.block.partialJson)}${stringifyJsonLike(event.delta)}`;
        toolCall.block.arguments = parseStreamingJson(
          stringifyJsonLike(toolCall.block.partialJson),
        );
        stream.push({
          type: "toolcall_delta",
          contentIndex: toolCall.contentIndex,
          delta: stringifyJsonLike(event.delta),
          partial: output,
        });
      } else if (hasActiveStreamingToolCall()) markActiveToolCallArgumentsUnreliable();
    } else if (type === "response.function_call_arguments.done") {
      const toolCall = resolveStreamingToolCall(event);
      if (toolCall) {
        const previousPartialJson = stringifyJsonLike(toolCall.block.partialJson);
        const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
        if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
          toolCall.block.partialJson = doneArguments;
          toolCall.block.arguments = parseStreamingJson(doneArguments);
          toolCall.argumentStreamReliable = true;
        }
        if (doneArguments?.startsWith(previousPartialJson)) {
          const delta = doneArguments.slice(previousPartialJson.length);
          if (delta.length > 0)
            stream.push({
              type: "toolcall_delta",
              contentIndex: toolCall.contentIndex,
              delta,
              partial: output,
            });
        }
      } else if (hasActiveStreamingToolCall()) markActiveToolCallArgumentsUnreliable();
    } else if (type === "response.output_item.done") {
      const item = event.item;
      if (item.type !== "message") {
        lastTextBlock = null;
        pendingMessageText = null;
      }
      if (item.type === "reasoning" && currentBlock?.type === "thinking") {
        const summary = Array.isArray(item.summary)
          ? item.summary
              .map((part) => {
                return part.text ?? "";
              })
              .join("\n\n")
          : "";
        currentBlock.thinking = summary;
        currentBlock.thinkingSignature = JSON.stringify(item);
        if ("encrypted_content" in item)
          currentBlock[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY] =
            buildOpenAIResponsesReasoningReplayMetadata(model, {
              authProfileId: options?.authProfileId,
              sessionId: options?.sessionId,
            });
        stream.push({
          type: "thinking_end",
          contentIndex: blockIndex(),
          content: stringifyUnknown(currentBlock.thinking),
          partial: output,
        });
        currentBlock = null;
      } else if (
        item.type === "message" &&
        (currentBlock?.type === "text" || pendingMessageText !== null)
      ) {
        const finalText = (Array.isArray(item.content) ? item.content : [])
          .map((part) => {
            const contentPart = part;
            return isResponsesTextContentPartType(contentPart.type)
              ? (contentPart.text ?? "")
              : (contentPart.refusal ?? "");
          })
          .join("");
        const phase = item.phase ?? void 0;
        const collapse =
          pendingMessageText !== null
            ? resolveResponsesMessageSnapshotCollapse({
                prior: lastTextBlock && {
                  text: stringifyUnknown(lastTextBlock.block.text),
                  phase: lastTextBlock.phase,
                },
                nextText: finalText,
                nextPhase: phase,
              })
            : { kind: "keep" };
        pendingMessageText = null;
        if (collapse.kind === "extend" && lastTextBlock) {
          lastTextBlock.block.text = collapse.text;
          lastTextBlock.block.textSignature = encodeTextSignatureV1(
            stringifyUnknown(item.id),
            phase,
          );
          stream.push({
            type: "text_end",
            contentIndex: lastTextBlock.index,
            content: collapse.text,
            partial: output,
          });
        } else {
          if (currentBlock?.type !== "text") {
            currentBlock = {
              type: "text",
              text: "",
              ...(phase
                ? { textSignature: encodeTextSignatureV1(stringifyUnknown(item.id), phase) }
                : {}),
            };
            output.content.push(currentBlock);
            stream.push({
              type: "text_start",
              contentIndex: blockIndex(),
              partial: output,
            });
          }
          currentBlock.text = finalText;
          currentBlock.textSignature = encodeTextSignatureV1(stringifyUnknown(item.id), phase);
          lastTextBlock = {
            block: currentBlock,
            index: blockIndex(),
            phase,
          };
          stream.push({
            type: "text_end",
            contentIndex: blockIndex(),
            content: stringifyUnknown(currentBlock.text),
            partial: output,
          });
        }
        currentBlock = null;
      } else if (item.type === "function_call") {
        const streamingToolCall = resolveStreamingToolCall(event, readItemToolCallIdentity(item));
        if (!streamingToolCall && hasActiveStreamingToolCall()) {
          await cooperativeScheduler.afterEvent();
          continue;
        }
        const completedName = resolveCompletedToolCallName(streamingToolCall, item.name);
        const streamedPartialJson = streamingToolCall
          ? stringifyJsonLike(streamingToolCall.block.partialJson)
          : "";
        const completedArguments = typeof item.arguments === "string" ? item.arguments : void 0;
        if (streamingToolCall && !streamingToolCall.argumentStreamReliable && !completedArguments) {
          await cooperativeScheduler.afterEvent();
          continue;
        }
        const finalPartialJson =
          completedArguments !== void 0 && (completedArguments.length > 0 || !streamedPartialJson)
            ? completedArguments
            : streamedPartialJson || "{}";
        const args = parseStreamingJson(finalPartialJson);
        let toolCallBlock;
        let contentIndex;
        if (streamingToolCall) {
          toolCallBlock = streamingToolCall.block;
          contentIndex = streamingToolCall.contentIndex;
        } else {
          toolCallBlock = {
            type: "toolCall",
            id: resolveToolCallId(item),
            name: completedName,
            arguments: args,
            partialJson: finalPartialJson,
          };
          output.content.push(toolCallBlock);
          contentIndex = blockIndex();
          stream.push({
            type: "toolcall_start",
            contentIndex,
            partial: output,
          });
        }
        const currentToolCallId = resolveToolCallId(
          item,
          typeof toolCallBlock.id === "string" ? toolCallBlock.id : void 0,
        );
        toolCallBlock.id = currentToolCallId;
        toolCallBlock.name = completedName;
        toolCallBlock.arguments = args;
        toolCallBlock.partialJson = finalPartialJson;
        stream.push({
          type: "toolcall_end",
          contentIndex,
          toolCall: {
            type: "toolCall",
            id: currentToolCallId,
            name: completedName,
            arguments: args,
          },
          partial: output,
        });
        if (streamingToolCall) forgetStreamingToolCall(streamingToolCall);
        if (currentBlock === toolCallBlock) {
          currentBlock = null;
          currentItem = null;
        }
      }
    } else if (type === "response.completed") {
      if (hasActiveStreamingToolCall())
        throw new Error("Responses stream completed with unresolved tool calls");
      const response = event.response;
      if (typeof response?.id === "string") output.responseId = response.id;
      backfillCompletedResponseOutput(response);
      const usage = response?.usage;
      if (usage) {
        const cachedTokens = usage.input_tokens_details?.cached_tokens || 0;
        const cacheWriteTokens = usage.input_tokens_details?.cache_write_tokens || 0;
        const inputTokens = usage.input_tokens || 0;
        const outputTokens = usage.output_tokens || 0;
        const reasoningTokens = usage.output_tokens_details?.reasoning_tokens;
        const input = Math.max(0, inputTokens - cachedTokens - cacheWriteTokens);
        output.usage = {
          input,
          output: outputTokens,
          cacheRead: cachedTokens,
          cacheWrite: cacheWriteTokens,
          ...(typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens)
            ? { reasoningTokens }
            : {}),
          totalTokens: input + outputTokens + cachedTokens + cacheWriteTokens,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
            total: 0,
          },
        };
      }
      calculateCost(model, output.usage);
      if (options?.applyServiceTierPricing)
        options.applyServiceTierPricing(
          output.usage,
          response?.service_tier ?? options.serviceTier,
        );
      output.stopReason = mapResponsesStopReason(response?.status);
      if (output.content.some((block) => block.type === "toolCall") && output.stopReason === "stop")
        output.stopReason = "toolUse";
    } else if (type === "error")
      throw new Error(
        `Error Code ${stringifyUnknown(event.code, "unknown")}: ${stringifyUnknown(event.message, "Unknown error")}`,
      );
    else if (type === "response.failed") {
      const failure = normalizeResponsesFailedEvent(event, model);
      if (failure.responseId) output.responseId = failure.responseId;
      if (failure.observation) logResponsesFailedNoDetails(failure.observation);
      throw new Error(failure.message);
    }
    await cooperativeScheduler.afterEvent();
  }
  if (hasActiveStreamingToolCall())
    throw new Error("Responses stream ended with unresolved tool calls");
  const eventTypeSummary = [...eventTypes.entries()]
    .slice(0, 12)
    .map(([eventType, count]) => `${eventType}:${count}`)
    .join(",");
  emitModelTransportDebug(
    log,
    `[responses] stream_done provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - streamStartedAt} events=${eventCount} types=${eventTypeSummary} stopReason=${output.stopReason ?? "unset"} contentBlocks=${output.content.length}`,
  );
}
function mapResponsesStopReason(status) {
  if (!status) return "stop";
  switch (status) {
    case "completed":
      return "stop";
    case "incomplete":
      return "length";
    case "failed":
    case "cancelled":
      return "error";
    case "in_progress":
    case "queued":
      return "stop";
    default:
      throw new Error(`Unhandled stop reason: ${status}`);
  }
}
function readResponsesOutputMessageText(item) {
  return (Array.isArray(item.content) ? item.content : [])
    .map((part) => {
      if (!isRecord(part)) return "";
      if (part.type === "output_text" || part.type === "text") return stringifyUnknown(part.text);
      if (part.type === "refusal") return stringifyUnknown(part.refusal);
      return "";
    })
    .join("");
}
function resolveProviderTransportTurnState(model, params) {
  const normalizedProvider = model.provider.trim().toLowerCase();
  const allowRuntimePluginLoad =
    normalizedProvider === "openai" ||
    normalizedProvider === "azure-openai" ||
    normalizedProvider === "azure-openai-responses";
  return resolveProviderTransportTurnStateWithPlugin({
    provider: model.provider,
    modelId: model.id,
    allowRuntimePluginLoad,
    context: {
      provider: model.provider,
      modelId: model.id,
      model,
      sessionId: params.sessionId,
      turnId: params.turnId,
      attempt: params.attempt,
      transport: params.transport,
    },
  });
}
function createOpenAIResponsesClient(
  model,
  context,
  apiKey,
  optionHeaders,
  turnHeaders,
  sessionId,
) {
  return new OpenAI({
    apiKey,
    baseURL: model.baseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders: buildOpenAIClientHeaders(model, context, optionHeaders, turnHeaders, sessionId),
    fetch: buildGuardedModelFetch(model),
    ...buildOpenAISdkClientOptions(model),
  });
}
function createOpenAIResponsesTransportStreamFn() {
  return (model, context, options) => {
    const responsesOptions = options;
    const eventStream = (0, event_stream_exports.createAssistantMessageEventStream)();
    const stream = eventStream;
    (async () => {
      const output = {
        role: "assistant",
        content: [],
        api: model.api,
        provider: model.provider,
        model: model.id,
        usage: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
          totalTokens: 0,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
            total: 0,
          },
        },
        stopReason: "stop",
        timestamp: Date.now(),
      };
      let firstEventAbort;
      try {
        const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
        const turnState = resolveProviderTransportTurnState(model, {
          sessionId: options?.sessionId,
          turnId: randomUUID(),
          attempt: 1,
          transport: "stream",
        });
        const client = createOpenAIResponsesClient(
          model,
          context,
          apiKey,
          options?.headers,
          turnState?.headers,
          options?.sessionId,
        );
        let params = buildOpenAIResponsesParams(
          model,
          context,
          responsesOptions,
          turnState?.metadata,
        );
        const nextParams = await options?.onPayload?.(params, model);
        if (nextParams !== void 0) params = nextParams;
        if (!isOpenAICodexResponsesModel(model))
          params = mergeTransportMetadata(params, turnState?.metadata);
        params = sanitizeOpenAICodexResponsesParams(model, params);
        params = sanitizeResponsesImagePayload(params);
        if (options?.openclawCodeModeToolSurface === true) {
          enforceCodeModeResponsesToolSurface(params);
          assertCodeModeResponsesToolSurface(params);
        }
        const requestStartedAt = Date.now();
        firstEventAbort = createFirstStreamEventAbortController(options?.signal);
        const requestOptions = buildOpenAISdkRequestOptions(model, firstEventAbort.signal, {
          stream: true,
        });
        emitModelTransportDebug(
          log,
          `[responses] start provider=${model.provider} api=${model.api} model=${model.id} baseUrl=${formatModelTransportDebugBaseUrl(model.baseUrl)} timeoutMs=${safeDebugValue(requestOptions?.timeout)} apiKey=${apiKey ? "present" : "missing"} ${summarizeResponsesPayload(params)}`,
        );
        const responseStream = await createResponsesStreamWithEncryptedContentRetry({
          client,
          request: params,
          requestOptions,
          model,
        });
        emitModelTransportDebug(
          log,
          `[responses] headers provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - requestStartedAt}`,
        );
        stream.push({
          type: "start",
          partial: output,
        });
        await processResponsesStream(responseStream, output, stream, model, {
          serviceTier: responsesOptions?.serviceTier,
          applyServiceTierPricing,
          firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
          abortFirstEventStream: firstEventAbort.abort,
          onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
          signal: options?.signal,
          authProfileId: responsesOptions?.authProfileId,
          sessionId: options?.sessionId,
        });
        if (options?.signal?.aborted) throw new Error("Request was aborted");
        if (output.stopReason === "aborted" || output.stopReason === "error")
          throw new Error("An unknown error occurred");
        stream.push({
          type: "done",
          reason: output.stopReason,
          message: output,
        });
        stream.end();
      } catch (error) {
        log.warn(
          `[responses] error provider=${model.provider} api=${model.api} model=${model.id} ` +
            summarizeOpenAITransportError(error),
        );
        assignTransportErrorDetails(output, error, options?.signal);
        stream.push({
          type: "error",
          reason: output.stopReason,
          error: output,
        });
        stream.end();
      } finally {
        firstEventAbort?.dispose();
      }
    })();
    return eventStream;
  };
}
function getPromptCacheRetention(baseUrl, cacheRetention) {
  if (cacheRetention !== "long") return;
  return baseUrl?.includes("api.openai.com") ? "24h" : void 0;
}
function resolveOpenAIReasoningEffort(options) {
  return normalizeOpenAIReasoningEffort(options?.reasoningEffort ?? options?.reasoning ?? "high");
}
function hasResponsesWebSearchTool(tools) {
  if (!Array.isArray(tools)) return false;
  return tools.some((tool) => {
    if (!isRecord(tool)) return false;
    if (tool.type === "web_search") return true;
    if (tool.type === "function" && tool.name === "web_search") return true;
    const fn = tool.function;
    return isRecord(fn) && fn.name === "web_search";
  });
}
function raiseMinimalReasoningForResponsesWebSearch(params) {
  if (params.effort !== "minimal" || !hasResponsesWebSearchTool(params.tools)) return params.effort;
  for (const effort of ["low", "medium", "high"]) {
    const resolved = resolveOpenAIReasoningEffortForModel({
      model: params.model,
      effort,
    });
    if (resolved && resolved !== "none" && resolved !== "minimal") return resolved;
  }
  return params.effort;
}
const OPENAI_CODEX_RESPONSES_UNSUPPORTED_PARAMS = [
  "max_output_tokens",
  "metadata",
  "prompt_cache_retention",
  "service_tier",
  "temperature",
  "top_p",
];
function stripOpenAICodexResponsesUnsupportedTextFields(params) {
  const text = params.text;
  if (!text || typeof text !== "object" || Array.isArray(text)) return;
  const sanitizedText = { ...text };
  delete sanitizedText.format;
  if (Object.keys(sanitizedText).length > 0) params.text = sanitizedText;
  else delete params.text;
}
function sanitizeOpenAICodexResponsesParams(model, params) {
  if (!usesNativeOpenAICodexResponsesBackend(model)) return params;
  for (const key of OPENAI_CODEX_RESPONSES_UNSUPPORTED_PARAMS) delete params[key];
  stripOpenAICodexResponsesUnsupportedTextFields(params);
  return params;
}
function buildOpenAICodexResponsesInstructions(context) {
  if (!context.systemPrompt) return;
  return sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt));
}
function resolveOpenAICodexResponsesInstructions(model, context) {
  const instructions = buildOpenAICodexResponsesInstructions(context);
  if (instructions && instructions.trim().length > 0) return instructions;
  return usesNativeOpenAICodexResponsesBackend(model)
    ? OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS
    : void 0;
}
function ensureOpenAICodexResponsesInput(messages, context) {
  if (messages.length > 0 || !context.systemPrompt) return;
  if (!buildOpenAICodexResponsesInstructions(context))
    throw new Error(
      "OpenAI Codex Responses requires non-empty input when only systemPrompt is provided.",
    );
  messages.push(
    buildResponsesInputMessage("user", [
      {
        type: "input_text",
        text: OPENAI_CODEX_RESPONSES_EMPTY_INPUT_TEXT,
      },
    ]),
  );
}
function resolveOpenAIResponsesTextFormat(responseFormat) {
  if (
    responseFormat.type === "json_schema" &&
    responseFormat.json_schema &&
    typeof responseFormat.json_schema === "object" &&
    !Array.isArray(responseFormat.json_schema)
  )
    return {
      ...responseFormat.json_schema,
      type: "json_schema",
    };
  return responseFormat;
}
function buildOpenAIResponsesParams(model, context, options, metadata) {
  const isCodexResponses = isOpenAICodexResponsesModel(model);
  const isNativeCodexResponses = usesNativeOpenAICodexResponsesBackend(model);
  const compat = getCompat(model);
  const supportsDeveloperRole =
    typeof compat.supportsDeveloperRole === "boolean" ? compat.supportsDeveloperRole : void 0;
  const payloadPolicy = resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "disable" });
  const policyAllowsReplayIds =
    payloadPolicy.explicitStore !== false && !payloadPolicy.shouldStripStore;
  const replayResponsesItemIds =
    !isNativeCodexResponses && (options?.replayResponsesItemIds ?? policyAllowsReplayIds);
  const messages = convertResponsesMessages(
    model,
    context,
    /* @__PURE__ */ new Set(["openai", "opencode", "azure-openai-responses", "github-copilot"]),
    {
      includeSystemPrompt: !isCodexResponses,
      supportsDeveloperRole,
      replayReasoningItems: true,
      replayResponsesItemIds,
      authProfileId: options?.authProfileId,
      sessionId: options?.sessionId,
    },
  );
  if (isCodexResponses) ensureOpenAICodexResponsesInput(messages, context);
  const cacheRetention = resolveCacheRetention(options?.cacheRetention);
  const promptCacheKey = resolvePromptCacheKey(options, cacheRetention);
  const params = {
    model: model.id,
    input: messages,
    stream: true,
    prompt_cache_key: promptCacheKey,
    prompt_cache_retention: getPromptCacheRetention(model.baseUrl, cacheRetention),
    ...(isCodexResponses
      ? { instructions: resolveOpenAICodexResponsesInstructions(model, context) }
      : {}),
    ...(metadata ? { metadata } : {}),
  };
  const effectiveMaxTokens = options?.maxTokens || model.maxTokens;
  if (effectiveMaxTokens) params.max_output_tokens = effectiveMaxTokens;
  if (options?.temperature !== void 0) params.temperature = options.temperature;
  if (options?.topP !== void 0) params.top_p = options.topP;
  if (options?.responseFormat !== void 0)
    params.text = {
      ...params.text,
      format: resolveOpenAIResponsesTextFormat(options.responseFormat),
    };
  if (options?.serviceTier !== void 0 && payloadPolicy.allowsServiceTier)
    params.service_tier = options.serviceTier;
  if (context.tools) {
    const converted = convertResponsesTools(context.tools, model, {
      strict: resolveOpenAIStrictToolSetting(model, { transport: "stream" }),
    });
    if (
      converted.tools.length > 0 ||
      (converted.projection.inputToolCount === 0 && converted.projection.diagnostics.length === 0)
    )
      params.tools = converted.tools;
    if (options?.toolChoice) {
      const toolChoice = reconcileOpenAIResponsesToolChoice(
        options.toolChoice,
        converted.projection,
      );
      if (toolChoice !== void 0) params.tool_choice = toolChoice;
    }
  }
  if (model.reasoning) {
    if (options?.reasoningEffort || options?.reasoning || options?.reasoningSummary) {
      const resolvedReasoningEffort = resolveOpenAIReasoningEffortForModel({
        model,
        effort: resolveOpenAIReasoningEffort(options),
      });
      const reasoningEffort = resolvedReasoningEffort
        ? raiseMinimalReasoningForResponsesWebSearch({
            model,
            effort: resolvedReasoningEffort,
            tools: params.tools,
          })
        : void 0;
      if (reasoningEffort) {
        params.reasoning = {
          effort: reasoningEffort,
          ...(reasoningEffort === "none" ? {} : { summary: options?.reasoningSummary || "auto" }),
        };
        if (reasoningEffort !== "none") params.include = ["reasoning.encrypted_content"];
      }
    } else if (model.provider !== "github-copilot") {
      const reasoningEffort = resolveOpenAIReasoningEffortForModel({
        model,
        effort: "none",
      });
      if (reasoningEffort) params.reasoning = { effort: reasoningEffort };
    }
  }
  applyOpenAIResponsesPayloadPolicy(params, payloadPolicy);
  return sanitizeOpenAICodexResponsesParams(model, params);
}
function createAzureOpenAIResponsesTransportStreamFn() {
  return (model, context, options) => {
    const responsesOptions = options;
    const eventStream = (0, event_stream_exports.createAssistantMessageEventStream)();
    const stream = eventStream;
    (async () => {
      const output = {
        role: "assistant",
        content: [],
        api: "azure-openai-responses",
        provider: model.provider,
        model: model.id,
        usage: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
          totalTokens: 0,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
            total: 0,
          },
        },
        stopReason: "stop",
        timestamp: Date.now(),
      };
      let firstEventAbort;
      try {
        const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
        const turnState = resolveProviderTransportTurnState(model, {
          sessionId: options?.sessionId,
          turnId: randomUUID(),
          attempt: 1,
          transport: "stream",
        });
        const client = createAzureOpenAIClient(
          model,
          context,
          apiKey,
          options?.headers,
          turnState?.headers,
        );
        const deploymentName = resolveAzureDeploymentName(model);
        let params = buildAzureOpenAIResponsesParams(
          model,
          context,
          responsesOptions,
          deploymentName,
          turnState?.metadata,
        );
        const nextParams = await options?.onPayload?.(params, model);
        if (nextParams !== void 0) params = nextParams;
        if (!isOpenAICodexResponsesModel(model))
          params = mergeTransportMetadata(params, turnState?.metadata);
        params = sanitizeOpenAICodexResponsesParams(model, params);
        params = sanitizeResponsesImagePayload(params);
        if (options?.openclawCodeModeToolSurface === true) {
          enforceCodeModeResponsesToolSurface(params);
          assertCodeModeResponsesToolSurface(params);
        }
        const requestStartedAt = Date.now();
        firstEventAbort = createFirstStreamEventAbortController(options?.signal);
        const requestOptions = buildOpenAISdkRequestOptions(model, firstEventAbort.signal);
        emitModelTransportDebug(
          log,
          `[responses] start provider=${model.provider} api=${model.api} model=${model.id} baseUrl=${formatModelTransportDebugBaseUrl(model.baseUrl)} timeoutMs=${safeDebugValue(requestOptions?.timeout)} apiKey=${apiKey ? "present" : "missing"} ${summarizeResponsesPayload(params)}`,
        );
        const responseStream = await client.responses.create(params, requestOptions);
        emitModelTransportDebug(
          log,
          `[responses] headers provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - requestStartedAt}`,
        );
        stream.push({
          type: "start",
          partial: output,
        });
        await processResponsesStream(responseStream, output, stream, model, {
          firstEventTimeoutMs:
            getFirstStreamEventTimeoutMs(options) ?? AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS,
          abortFirstEventStream: firstEventAbort.abort,
          onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
          signal: options?.signal,
          authProfileId: responsesOptions?.authProfileId,
          sessionId: options?.sessionId,
        });
        if (options?.signal?.aborted) throw new Error("Request was aborted");
        if (output.stopReason === "aborted" || output.stopReason === "error")
          throw new Error("An unknown error occurred");
        stream.push({
          type: "done",
          reason: output.stopReason,
          message: output,
        });
        stream.end();
      } catch (error) {
        log.warn(
          `[responses] error provider=${model.provider} api=${model.api} model=${model.id} ` +
            summarizeOpenAITransportError(error),
        );
        assignTransportErrorDetails(output, error, options?.signal);
        stream.push({
          type: "error",
          reason: output.stopReason,
          error: output,
        });
        stream.end();
      } finally {
        firstEventAbort?.dispose();
      }
    })();
    return eventStream;
  };
}
function normalizeAzureBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}
function resolveAzureDeploymentName(model) {
  return resolveAzureDeploymentNameFromMap({
    modelId: model.id,
    deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP,
  });
}
function createAzureOpenAIClient(model, context, apiKey, optionHeaders, turnHeaders) {
  const baseURL = normalizeAzureBaseUrl(model.baseUrl);
  const clientOptions = {
    apiKey,
    dangerouslyAllowBrowser: true,
    defaultHeaders: buildOpenAIClientHeaders(model, context, optionHeaders, turnHeaders),
    baseURL,
    fetch: buildGuardedModelFetch(model),
    ...buildOpenAISdkClientOptions(model),
  };
  if (isOpenAICompatibleAzureResponsesBaseUrl(baseURL)) return new OpenAI(clientOptions);
  return new AzureOpenAI({
    ...clientOptions,
    apiVersion: resolveAzureOpenAIApiVersion(),
  });
}
function buildAzureOpenAIResponsesParams(model, context, options, deploymentName, metadata) {
  const params = buildOpenAIResponsesParams(model, context, options, metadata);
  params.model = deploymentName;
  delete params.store;
  return params;
}
const responsesTesting = {
  getCompat,
  assertCodeModeResponsesToolSurface,
  buildOpenAIResponsesParams,
  buildOpenAIClientHeaders,
  buildOpenAISdkClientOptions,
  buildOpenAISdkRequestOptions,
  createAzureOpenAIClient,
  createOpenAIResponsesClient,
  enforceCodeModeResponsesToolSurface,
  sanitizeOpenAICodexResponsesParams,
  processResponsesStream,
  formatModelTransportDebugBaseUrl,
  buildResponsesFailedNoDetailsObservation,
  buildOpenAIResponsesReasoningReplayMetadata,
  isInvalidEncryptedContentError,
  normalizeResponsesFailedEvent,
  prepareOpenAIResponsesReasoningItemForReplay,
  createResponsesStreamWithEncryptedContentRetry,
  resolveAzureOpenAIApiVersion,
  stripResponsesRequestEncryptedContent,
  tagOpenAIResponsesReasoningReplayItem,
  summarizeResponsesFailedNoDetailsObservation,
  summarizeResponsesPayload,
  summarizeResponsesTools,
  stringifyRedactedEvent,
  stringifyRedactedPayload,
};
//#endregion
//#region src/agents/openai-transport-stream.ts
function buildOpenAICompletionsParams(model, context, options) {
  return buildOpenAICompletionsParams$1(model, context, options);
}
({
  ...responsesTesting,
  ...completionsTesting,
});
//#endregion
export {
  isReasoningOnlyLengthAssistantTurn as C,
  hasOnlyAssistantReasoningContent as S,
  finalizeTransportStream as _,
  resolveOpenAIResponsesPayloadPolicy as a,
  sanitizeTransportPayloadText as b,
  stripCompletionMessagesToRoleContent as c,
  resolveMaxTokensParam as d,
  coerceTransportToolCallArguments as f,
  failTransportStream as g,
  encodeAssistantTextSignatureV1 as h,
  applyOpenAIResponsesPayloadPolicy as i,
  supportsModelTools as l,
  createWritableTransportEventStream as m,
  createAzureOpenAIResponsesTransportStreamFn as n,
  createOpenAICompletionsTransportStreamFn as o,
  createEmptyTransportUsage as p,
  createOpenAIResponsesTransportStreamFn as r,
  flattenCompletionMessagesToStringContent as s,
  buildOpenAICompletionsParams as t,
  canonicalizeMaxTokensParam as u,
  mergeTransportHeaders as v,
  transformTransportMessages as x,
  sanitizeNonEmptyTransportPayloadText as y,
};
