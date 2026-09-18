import {
  ANTHROPIC_OMITTED_REASONING_TEXT,
  ANTHROPIC_SERVER_SIDE_FALLBACK_BETA,
  CLAUDE_FABLE_5_FALLBACK_MODEL_COST,
  applyAnthropicFallbackBoundary,
  applyAnthropicRefusal,
  applyClaudeRequestContract,
  buildAnthropicServerSideFallbacks,
  defaultsClaudeAdaptiveThinking,
  findActiveAnthropicToolTurnAssistantIndex,
  omitFoundryBearerCredentialHeaders,
  prepareClaudeSonnet5RequestContext,
  projectAnthropicTools,
  readAnthropicFallbackBoundary,
  readAnthropicPromptUsageSnapshot,
  readAnthropicUsageTokenCount,
  readLastAnthropicIterationUsage,
  reconcileAnthropicToolChoice,
  requiresClaudeAdaptiveThinking,
  resolveClaudeNativeThinkingLevelMap,
  resolveClaudeSonnet5ModelIdentity,
  resolveOriginalAnthropicToolName,
  supportsClaudeAdaptiveThinking,
  supportsClaudeNativeMaxEffort,
  supportsClaudeNativeXhighEffort,
  usesClaudeFable5MessagesContract,
  usesClaudeStreamingRefusalContract,
  usesFoundryBearerAuth,
} from "@openclaw/ai/internal/anthropic";
import {
  calculateCost,
  clampThinkingLevel,
  createDeferredEventBuffer,
  getApiProvider,
  getEnvApiKey,
  notifyLlmRequestActivity,
  parseStreamingJson,
  registerApiProvider,
} from "@openclaw/ai/internal/runtime";
import "./errors-BoHeli7m.js";
import {
  describeToolResultMediaPlaceholder,
  extractToolResultBlockText,
  extractToolResultText,
} from "@openclaw/ai/internal/shared";
import { t as createAbortError$1 } from "./abort-signal-DEbc_zqk.js";
import { t as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./assistant-error-format-G5Se-DL7.js";
import {
  c as hasCopilotVisionInput,
  o as buildCopilotDynamicHeaders,
} from "./copilot-dynamic-headers-CF9zPORX.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { u as readResponseTextSnippet } from "./http-body-aoMvQQlg.js";
import { t as parseJsonObjectPreservingUnsafeIntegers } from "./json-unsafe-integers-DpTiDHBw.js";
import {
  _ as finalizeTransportStream,
  b as sanitizeTransportPayloadText,
  f as coerceTransportToolCallArguments,
  g as failTransportStream,
  h as encodeAssistantTextSignatureV1,
  m as createWritableTransportEventStream,
  n as createAzureOpenAIResponsesTransportStreamFn,
  o as createOpenAICompletionsTransportStreamFn,
  p as createEmptyTransportUsage,
  r as createOpenAIResponsesTransportStreamFn,
  v as mergeTransportHeaders,
  x as transformTransportMessages,
  y as sanitizeNonEmptyTransportPayloadText,
} from "./openai-transport-stream-BFFr80cz.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-CdW1rMjo.js";
import {
  d as unwrapModelHeaderSentinelsForProviderEgress,
  f as unwrapSecretSentinelsForProviderEgress,
  o as getModelProviderLocalService,
  u as unwrapHeaderSentinelsForProviderEgress,
} from "./provider-local-service-DLgcYp6u.js";
import { i as getModelProviderRequestTransport } from "./provider-request-config-DpW-uV6A.js";
import { A as resolveProviderStreamFn } from "./provider-runtime-DyIHJ2cX.js";
import {
  F as resolveAnthropicPayloadPolicy,
  N as applyAnthropicPayloadPolicyToParams,
} from "./provider-stream-shared-CMy-5I0G.js";
import { a as resolveSecretSentinel, r as looksLikeSecretSentinel } from "./sentinel-Ccb6pnS1.js";
import { a as buildGuardedModelFetch } from "./stream-DzNMuPw6.js";
import { r as buildStreamErrorAssistantMessage } from "./stream-message-shared-DKS8UMJ_.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/custom-api-registry.ts
/**
 * Registers caller-supplied custom API stream functions with the LLM registry.
 */
const CUSTOM_API_SOURCE_PREFIX = "openclaw-custom-api:";
/** Returns the registry source id used for a custom API stream function. */
function getCustomApiRegistrySourceId(api) {
  return `${CUSTOM_API_SOURCE_PREFIX}${api}`;
}
function adaptCustomStream(model, stream) {
  if (!(stream instanceof Promise)) return stream;
  const adapted = (0, event_stream_exports.createAssistantMessageEventStream)();
  (async () => {
    try {
      const resolved = await stream;
      for await (const event of resolved) adapted.push(event);
      adapted.end(await resolved.result());
    } catch (error) {
      const message = buildStreamErrorAssistantMessage({
        model,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      adapted.push({
        type: "error",
        reason: "error",
        error: message,
      });
    }
  })();
  return adapted;
}
/** Registers a custom API stream function when no provider already owns it. */
function ensureCustomApiRegistered(api, streamFn) {
  if (getApiProvider(api)) return false;
  registerApiProvider(
    {
      api,
      stream: (model, context, options) =>
        adaptCustomStream(model, streamFn(model, context, options)),
      streamSimple: (model, context, options) =>
        adaptCustomStream(model, streamFn(model, context, options)),
    },
    getCustomApiRegistrySourceId(api),
  );
  return true;
}
//#endregion
//#region src/agents/anthropic-transport-stream.ts
/**
 * Native Anthropic Messages streaming transport.
 * Converts OpenClaw contexts/tools into Anthropic payloads, streams SSE events
 * back into runtime output blocks, and applies provider request policy.
 */
const CLAUDE_CODE_VERSION = "2.1.75";
const CLAUDE_CODE_BILLING_SYSTEM_BLOCK = `x-anthropic-billing-header: cc_version=${CLAUDE_CODE_VERSION}; cc_entrypoint=sdk-cli;`;
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES = 8 * 1024;
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS = 400;
const ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS = 1e4;
const ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS = 16 * 1024 * 1024;
const CLAUDE_CODE_TOOL_LOOKUP = new Map(
  [
    "Read",
    "Write",
    "Edit",
    "Bash",
    "Grep",
    "Glob",
    "AskUserQuestion",
    "EnterPlanMode",
    "ExitPlanMode",
    "KillShell",
    "NotebookEdit",
    "Skill",
    "Task",
    "TaskOutput",
    "TodoWrite",
    "WebFetch",
    "WebSearch",
  ].map((tool) => [normalizeLowercaseStringOrEmpty(tool), tool]),
);
function resolveAnthropicRequestModelId(model) {
  if (isDirectAnthropicModel(model) && /^anthropic\//i.test(model.id))
    return model.id.replace(/^anthropic\//i, "");
  return model.id;
}
const EMPTY_ANTHROPIC_MESSAGES_FALLBACK_TEXT = ".";
function normalizeAnthropicToolChoice(thinkingEnabled, toolChoice) {
  if (
    thinkingEnabled &&
    (toolChoice === "any" || (typeof toolChoice === "object" && toolChoice.type === "tool"))
  )
    return { type: "auto" };
  return typeof toolChoice === "string" ? { type: toolChoice } : toolChoice;
}
function supportsNativeXhighEffort(model) {
  return supportsClaudeNativeXhighEffort(model);
}
function supportsAdaptiveThinking(model) {
  return supportsClaudeAdaptiveThinking(model);
}
function mapThinkingLevelToEffort(level, model) {
  const thinkingLevelMap = resolveClaudeNativeThinkingLevelMap(model);
  const resolvedLevel = clampThinkingLevel(
    {
      ...model,
      ...(typeof model.params?.canonicalModelId === "string" ? { reasoning: true } : {}),
      ...(thinkingLevelMap ? { thinkingLevelMap } : {}),
    },
    level,
  );
  const mapped = thinkingLevelMap?.[resolvedLevel];
  if (typeof mapped === "string") return mapped;
  switch (resolvedLevel) {
    case "off":
    case "minimal":
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "xhigh":
      return supportsNativeXhighEffort(model) ? "xhigh" : "high";
    case "max":
      return supportsClaudeNativeMaxEffort(model) ? "max" : "high";
    default:
      return "high";
  }
}
function clampReasoningLevel(level) {
  return level === "xhigh" || level === "max" ? "high" : level;
}
function resolvePositiveAnthropicMaxTokens(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const floored = Math.floor(value);
  return floored > 0 ? floored : void 0;
}
function resolveAnthropicMessagesMaxTokens(params) {
  const requested = resolvePositiveAnthropicMaxTokens(params.requestedMaxTokens);
  if (requested !== void 0) return requested;
  const modelMax = resolvePositiveAnthropicMaxTokens(params.modelMaxTokens);
  return modelMax !== void 0
    ? params.useModelDefault
      ? modelMax
      : Math.min(modelMax, 32e3)
    : void 0;
}
function adjustMaxTokensForThinking(params) {
  const budgets = {
    minimal: 1024,
    low: 2048,
    medium: 8192,
    high: 16384,
    ...params.customBudgets,
  };
  const minOutputTokens = 1024;
  let thinkingBudget = budgets[clampReasoningLevel(params.reasoningLevel)];
  const maxTokens = Math.min(params.baseMaxTokens + thinkingBudget, params.modelMaxTokens);
  if (maxTokens <= thinkingBudget) thinkingBudget = Math.max(0, maxTokens - minOutputTokens);
  return {
    maxTokens,
    thinkingBudget,
  };
}
function isAnthropicOAuthToken(apiKey) {
  return (
    (looksLikeSecretSentinel(apiKey) ? resolveSecretSentinel(apiKey) : apiKey) ?? apiKey
  ).includes("sk-ant-oat");
}
function isDirectAnthropicModel(model) {
  if (normalizeLowercaseStringOrEmpty(model.provider) !== "anthropic") return false;
  const endpointClass = resolveProviderEndpoint(model.baseUrl).endpointClass;
  return endpointClass === "default" || endpointClass === "anthropic-public";
}
function isKimiAnthropicProvider(provider) {
  return /^kimi(?:-|$)/.test(normalizeLowercaseStringOrEmpty(provider ?? ""));
}
/**
 * Server-side refusal fallback is a first-party Claude API beta: proxies and
 * Bedrock/Vertex/Foundry reject the `fallbacks` param, and OAuth (Claude Code
 * identity) requests are excluded until the beta is verified there.
 */
function useAnthropicServerSideFallback(model) {
  return usesClaudeFable5MessagesContract(model) && isDirectAnthropicModel(model);
}
function supportsReasoningContentReplay(model) {
  return resolveProviderEndpoint(model.baseUrl).endpointClass === "xiaomi-native";
}
function buildAnthropicBetaHeader(model, betaFeatures, params) {
  if (!isDirectAnthropicModel(model)) return;
  return params.oauth
    ? `claude-code-20250219,oauth-2025-04-20,${betaFeatures.join(",")}`
    : betaFeatures.join(",");
}
function toClaudeCodeName(name) {
  return CLAUDE_CODE_TOOL_LOOKUP.get(normalizeLowercaseStringOrEmpty(name)) ?? name;
}
function convertContentBlocks(content) {
  const text = extractToolResultText(content);
  const mediaPlaceholder = describeToolResultMediaPlaceholder(content);
  if (
    !(
      Array.isArray(content) &&
      content.some((item) => item && typeof item === "object" && item.type === "image")
    )
  )
    return sanitizeNonEmptyTransportPayloadText(text, mediaPlaceholder ?? "(no output)");
  const blocks = [];
  let hasTextBlock = false;
  for (const block of Array.isArray(content) ? content : []) {
    if (!block || typeof block !== "object") continue;
    const record = block;
    const blockText = extractToolResultBlockText(block);
    if (blockText) {
      blocks.push({
        type: "text",
        text: sanitizeTransportPayloadText(blockText),
      });
      hasTextBlock = true;
    }
    if (record.type !== "image") continue;
    blocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: typeof record.mimeType === "string" ? record.mimeType : "image/png",
        data: typeof record.data === "string" ? record.data : "",
      },
    });
  }
  if (!hasTextBlock)
    blocks.unshift({
      type: "text",
      text: mediaPlaceholder ?? "(see attached image)",
    });
  return blocks;
}
function normalizeToolCallId(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function convertAnthropicMessages(messages, model, isOAuthToken, options) {
  const params = [];
  const allowReasoningContentReplay = options.allowReasoningContentReplay === true;
  const replayThinkingEnabled = options.replayThinkingEnabled !== false;
  const transformedMessages = transformTransportMessages(messages, model, normalizeToolCallId);
  const activeToolTurnAssistantIndex = replayThinkingEnabled
    ? -1
    : findActiveAnthropicToolTurnAssistantIndex(transformedMessages);
  for (let i = 0; i < transformedMessages.length; i += 1) {
    const msg = transformedMessages[i];
    if (!msg) continue;
    if (msg.role === "user") {
      const isRuntimeContextCarrier = msg.runtimeContextCarrier === true;
      if (typeof msg.content === "string") {
        if (msg.content.trim().length > 0) {
          const userParam = {
            role: "user",
            content: sanitizeTransportPayloadText(msg.content),
          };
          if (isRuntimeContextCarrier)
            options.cacheBreakpointOptOutMessageIndexes.add(params.length);
          params.push(userParam);
        }
        continue;
      }
      const blocks = msg.content.map((item) =>
        item.type === "text"
          ? {
              type: "text",
              text: sanitizeTransportPayloadText(item.text),
            }
          : {
              type: "image",
              source: {
                type: "base64",
                media_type: item.mimeType,
                data: item.data,
              },
            },
      );
      let filteredBlocks = model.input.includes("image")
        ? blocks
        : blocks.filter((block) => block.type !== "image");
      filteredBlocks = filteredBlocks.filter(
        (block) => block.type !== "text" || block.text.trim().length > 0,
      );
      if (filteredBlocks.length === 0) continue;
      const userParam = {
        role: "user",
        content: filteredBlocks,
      };
      if (isRuntimeContextCarrier) options.cacheBreakpointOptOutMessageIndexes.add(params.length);
      params.push(userParam);
      continue;
    }
    if (msg.role === "assistant") {
      const blocks = [];
      const reasoningContent = [];
      let omittedThinking = false;
      for (const block of msg.content) {
        if (block.type === "text") {
          if (block.text.trim().length > 0)
            blocks.push({
              type: "text",
              text: sanitizeTransportPayloadText(block.text),
            });
          continue;
        }
        if (block.type === "thinking") {
          const thinkingSignature = block.thinkingSignature?.trim();
          const isReasoningContent = thinkingSignature === "reasoning_content";
          if (!replayThinkingEnabled && i !== activeToolTurnAssistantIndex && !isReasoningContent) {
            omittedThinking = true;
            continue;
          }
          if (block.redacted) {
            blocks.push({
              type: "redacted_thinking",
              data: block.thinkingSignature,
            });
            continue;
          }
          const hasNativeThinkingSignature = Boolean(thinkingSignature) && !isReasoningContent;
          if (block.thinking.trim().length === 0 && !hasNativeThinkingSignature) continue;
          if (!thinkingSignature)
            blocks.push({
              type: "text",
              text: sanitizeTransportPayloadText(block.thinking),
            });
          else {
            const thinking =
              thinkingSignature === "reasoning_content"
                ? sanitizeTransportPayloadText(block.thinking)
                : block.thinking;
            if (thinkingSignature === "reasoning_content") {
              if (allowReasoningContentReplay) {
                blocks.push({
                  type: "thinking",
                  thinking,
                  signature: thinkingSignature,
                });
                reasoningContent.push(thinking);
              }
              continue;
            }
            blocks.push({
              type: "thinking",
              thinking,
              signature: thinkingSignature,
            });
          }
          continue;
        }
        if (block.type === "toolCall")
          blocks.push({
            type: "tool_use",
            id: block.id,
            name: isOAuthToken ? toClaudeCodeName(block.name) : block.name,
            input: coerceTransportToolCallArguments(block.arguments),
          });
      }
      if (blocks.length === 0 && omittedThinking)
        blocks.push({
          type: "text",
          text: ANTHROPIC_OMITTED_REASONING_TEXT,
        });
      if (blocks.length > 0) {
        const assistantMsg = {
          role: "assistant",
          content: blocks,
        };
        if (reasoningContent.length > 0)
          assistantMsg.reasoning_content = reasoningContent.join("\n");
        else if (allowReasoningContentReplay)
          blocks.unshift({
            type: "thinking",
            thinking: "",
            signature: "reasoning_content",
          });
        params.push(assistantMsg);
      }
      continue;
    }
    if (msg.role === "toolResult") {
      const toolResult = msg;
      const toolResults = [
        {
          type: "tool_result",
          tool_use_id: toolResult.toolCallId,
          content: convertContentBlocks(toolResult.content),
          is_error: toolResult.isError,
        },
      ];
      let j = i + 1;
      while (j < transformedMessages.length) {
        const nextMsg = transformedMessages.at(j);
        if (nextMsg?.role !== "toolResult") break;
        toolResults.push({
          type: "tool_result",
          tool_use_id: nextMsg.toolCallId,
          content: convertContentBlocks(nextMsg.content),
          is_error: nextMsg.isError,
        });
        j += 1;
      }
      i = j - 1;
      params.push({
        role: "user",
        content: toolResults,
      });
    }
  }
  return params;
}
function ensureNonEmptyAnthropicMessages(messages) {
  return messages.length > 0
    ? messages
    : [
        {
          role: "user",
          content: EMPTY_ANTHROPIC_MESSAGES_FALLBACK_TEXT,
        },
      ];
}
function convertAnthropicTools(tools, isOAuthToken) {
  const projection = projectAnthropicTools(tools ?? [], (name) =>
    isOAuthToken ? toClaudeCodeName(name) : name,
  );
  const converted = [];
  for (const tool of projection.tools)
    converted.push({
      name: tool.wireName,
      description: tool.description,
      input_schema: tool.inputSchema,
    });
  return {
    projection,
    tools: converted,
  };
}
function parseAnthropicToolCallArguments(inputJson) {
  return parseJsonObjectPreservingUnsafeIntegers(inputJson) ?? parseStreamingJson(inputJson);
}
function mapStopReason(reason) {
  switch (reason) {
    case "end_turn":
      return "stop";
    case "max_tokens":
      return "length";
    case "tool_use":
      return "toolUse";
    case "pause_turn":
      return "stop";
    case "refusal":
    case "sensitive":
      return "error";
    case "stop_sequence":
      return "stop";
    default:
      throw new Error(`Unhandled stop reason: ${String(reason)}`);
  }
}
function tagPendingCommentaryText(content) {
  let commentaryTextIndex = content.filter(
    (block) => block.type === "text" && block.textSignature !== void 0,
  ).length;
  for (const block of content)
    if (block.type === "text" && block.text.trim().length > 0 && block.textSignature === void 0) {
      block.textSignature = encodeAssistantTextSignatureV1(
        `commentary-${commentaryTextIndex}`,
        "commentary",
      );
      commentaryTextIndex += 1;
    }
}
const DEFAULT_ANTHROPIC_BASE_URL = "https://api.anthropic.com";
/** Resolve the effective Anthropic API base URL from model or environment. */
function resolveAnthropicBaseUrl(baseUrl) {
  return baseUrl?.trim() || process.env.ANTHROPIC_BASE_URL?.trim() || DEFAULT_ANTHROPIC_BASE_URL;
}
/** Resolve the Anthropic Messages endpoint URL for the effective base URL. */
function resolveAnthropicMessagesUrl(baseUrl) {
  const normalized = resolveAnthropicBaseUrl(baseUrl).replace(/\/+$/, "");
  return normalized.endsWith("/v1") ? `${normalized}/messages` : `${normalized}/v1/messages`;
}
function withEffectiveAnthropicBaseUrl(model) {
  const baseUrl = resolveAnthropicBaseUrl(model.baseUrl);
  return baseUrl === model.baseUrl
    ? model
    : {
        ...model,
        baseUrl,
      };
}
function createAbortError(signal) {
  const reason = signal.reason;
  if (reason instanceof Error) return reason;
  return createAbortError$1("Request was aborted", reason === void 0 ? void 0 : { cause: reason });
}
function readAnthropicSseChunk(reader, signal) {
  if (!signal) return reader.read();
  return new Promise((resolve, reject) => {
    let settled = false;
    const onAbort = () => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      reader.cancel(signal.reason).catch(() => void 0);
      reject(createAbortError(signal));
    };
    if (signal.aborted) {
      onAbort();
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });
    reader.read().then(
      (result) => {
        if (settled) return;
        settled = true;
        signal.removeEventListener("abort", onAbort);
        resolve(result);
      },
      (error) => {
        if (settled) return;
        settled = true;
        signal.removeEventListener("abort", onAbort);
        reject(toErrorObject(error, "Non-Error rejection"));
      },
    );
  });
}
function parseAnthropicSseEventData(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, { cause: error });
    throw error;
  }
}
function assertAnthropicSsePendingBufferWithinLimit(pendingChars) {
  if (pendingChars <= ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS) return;
  throw new Error(
    `Anthropic Messages SSE response exceeded max pending buffer size (${ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS} chars) without event boundary`,
  );
}
async function* parseAnthropicSseBody(body, signal) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;
  try {
    while (true) {
      const { done, value } = await readAnthropicSseChunk(reader, signal);
      if (done) {
        completed = true;
        break;
      }
      buffer = `${buffer}${decoder.decode(value, { stream: true })}`.replaceAll("\r\n", "\n");
      let frameEnd = buffer.indexOf("\n\n");
      while (frameEnd >= 0) {
        assertAnthropicSsePendingBufferWithinLimit(frameEnd);
        const frame = buffer.slice(0, frameEnd);
        buffer = buffer.slice(frameEnd + 2);
        const data = frame
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");
        if (data && data !== "[DONE]") yield parseAnthropicSseEventData(data);
        frameEnd = buffer.indexOf("\n\n");
      }
      assertAnthropicSsePendingBufferWithinLimit(buffer.length);
    }
    const tailBuffer = `${buffer}${decoder.decode()}`.replaceAll("\r\n", "\n");
    assertAnthropicSsePendingBufferWithinLimit(tailBuffer.length);
    const tail = tailBuffer.trim();
    if (tail) {
      const data = tail
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (data && data !== "[DONE]") yield parseAnthropicSseEventData(data);
    }
  } finally {
    if (!completed) await reader.cancel(signal?.reason).catch(() => void 0);
    reader.releaseLock();
  }
}
function createAnthropicMessagesClient(params) {
  const url = resolveAnthropicMessagesUrl(params.baseURL);
  return {
    messages: {
      async *stream(body, options) {
        const headers = mergeTransportHeaders(
          {
            "content-type": "application/json",
            "anthropic-version": "2023-06-01",
            ...(params.apiKey ? { "x-api-key": params.apiKey } : {}),
            ...(params.authToken ? { authorization: `Bearer ${params.authToken}` } : {}),
          },
          params.defaultHeaders,
        );
        const response = await params.fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: options?.signal,
        });
        if (!response.ok) {
          const detail = await readAnthropicMessagesErrorBodySnippet(response);
          throw new Error(
            detail || `Anthropic Messages request failed with HTTP ${response.status}`,
          );
        }
        if (!response.body) return;
        yield* parseAnthropicSseBody(response.body, options?.signal);
      },
    },
  };
}
async function readAnthropicMessagesErrorBodySnippet(response) {
  try {
    return (
      (await readResponseTextSnippet(response, {
        maxBytes: ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES,
        maxChars: ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS,
        chunkTimeoutMs: ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS,
        onIdleTimeout: ({ chunkTimeoutMs }) =>
          /* @__PURE__ */ new Error(
            `Anthropic Messages error response stalled: no data received for ${chunkTimeoutMs}ms`,
          ),
      })) ?? ""
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Anthropic Messages error response stalled:")
    )
      return error.message;
    return "";
  }
}
function createAnthropicTransportClient(params) {
  const { model, context, apiKey, options } = params;
  const needsInterleavedBeta =
    (options?.interleavedThinking ?? true) && !supportsAdaptiveThinking(model);
  const fetch =
    isKimiAnthropicProvider(model.provider) && options?.thinkingEnabled === true
      ? buildGuardedModelFetch(model, void 0, { sanitizeSse: false })
      : buildGuardedModelFetch(model);
  if (model.provider === "github-copilot") {
    const betaFeatures = needsInterleavedBeta ? ["interleaved-thinking-2025-05-14"] : [];
    return {
      client: createAnthropicMessagesClient({
        apiKey: null,
        authToken: apiKey,
        baseURL: model.baseUrl,
        defaultHeaders: mergeTransportHeaders(
          {
            accept: "application/json",
            "anthropic-dangerous-direct-browser-access": "true",
            ...(betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}),
          },
          model.headers,
          buildCopilotDynamicHeaders({
            messages: context.messages,
            hasImages: hasCopilotVisionInput(context.messages),
          }),
          options?.headers,
        ),
        fetch,
      }),
      isOAuthToken: false,
    };
  }
  if (
    usesFoundryBearerAuth(
      unwrapModelHeaderSentinelsForProviderEgress(model, "Anthropic Foundry auth routing"),
    )
  ) {
    const betaFeatures = needsInterleavedBeta ? ["interleaved-thinking-2025-05-14"] : [];
    return {
      client: createAnthropicMessagesClient({
        apiKey: null,
        authToken: apiKey,
        baseURL: model.baseUrl,
        defaultHeaders: mergeTransportHeaders(
          {
            accept: "application/json",
            "anthropic-dangerous-direct-browser-access": "true",
            ...(betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}),
          },
          omitFoundryBearerCredentialHeaders(model.headers),
          options?.headers,
        ),
        fetch,
      }),
      isOAuthToken: false,
    };
  }
  const betaFeatures = ["fine-grained-tool-streaming-2025-05-14"];
  if (needsInterleavedBeta) betaFeatures.push("interleaved-thinking-2025-05-14");
  if (isAnthropicOAuthToken(apiKey)) {
    const betaHeader = buildAnthropicBetaHeader(model, betaFeatures, { oauth: true });
    return {
      client: createAnthropicMessagesClient({
        apiKey: null,
        authToken: apiKey,
        baseURL: model.baseUrl,
        defaultHeaders: mergeTransportHeaders(
          {
            accept: "application/json",
            "anthropic-dangerous-direct-browser-access": "true",
            ...(betaHeader ? { "anthropic-beta": betaHeader } : {}),
            "user-agent": `claude-cli/${CLAUDE_CODE_VERSION}`,
            "x-app": "cli",
          },
          model.headers,
          options?.headers,
        ),
        fetch,
      }),
      isOAuthToken: true,
    };
  }
  if (useAnthropicServerSideFallback(model)) betaFeatures.push(ANTHROPIC_SERVER_SIDE_FALLBACK_BETA);
  const betaHeader = buildAnthropicBetaHeader(model, betaFeatures, { oauth: false });
  return {
    client: createAnthropicMessagesClient({
      apiKey,
      baseURL: model.baseUrl,
      defaultHeaders: mergeTransportHeaders(
        {
          accept: "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
          ...(betaHeader ? { "anthropic-beta": betaHeader } : {}),
        },
        model.headers,
        options?.headers,
      ),
      fetch,
    }),
    isOAuthToken: false,
  };
}
function buildAnthropicParams(model, context, isOAuthToken, options) {
  const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
  const replayThinkingEnabled = mandatoryAdaptiveThinking || options?.thinkingEnabled === true;
  const maxTokens = resolveAnthropicMessagesMaxTokens({
    modelMaxTokens: model.maxTokens,
    requestedMaxTokens: options?.maxTokens,
  });
  if (maxTokens === void 0)
    throw new Error(
      `Anthropic Messages transport requires a positive maxTokens value for ${model.provider}/${model.id}`,
    );
  const payloadPolicy = resolveAnthropicPayloadPolicy({
    provider: model.provider,
    api: model.api,
    baseUrl: model.baseUrl,
    cacheRetention: options?.cacheRetention,
    enableCacheControl: true,
  });
  const cacheBreakpointOptOutMessageIndexes = /* @__PURE__ */ new Set();
  const messages = convertAnthropicMessages(context.messages, model, isOAuthToken, {
    allowReasoningContentReplay: supportsReasoningContentReplay(model),
    cacheBreakpointOptOutMessageIndexes,
    replayThinkingEnabled,
  });
  const params = {
    model: resolveAnthropicRequestModelId(model),
    messages: ensureNonEmptyAnthropicMessages(messages),
    max_tokens: maxTokens,
    stream: true,
  };
  if (!isOAuthToken && useAnthropicServerSideFallback(model))
    params.fallbacks = buildAnthropicServerSideFallbacks();
  if (isOAuthToken)
    params.system = [
      {
        type: "text",
        text: CLAUDE_CODE_BILLING_SYSTEM_BLOCK,
      },
      {
        type: "text",
        text: "You are Claude Code, Anthropic's official CLI for Claude.",
      },
      ...(context.systemPrompt
        ? [
            {
              type: "text",
              text: sanitizeTransportPayloadText(context.systemPrompt),
            },
          ]
        : []),
    ];
  else if (context.systemPrompt)
    params.system = [
      {
        type: "text",
        text: sanitizeTransportPayloadText(context.systemPrompt),
      },
    ];
  if (
    options?.temperature !== void 0 &&
    !options.thinkingEnabled &&
    !supportsNativeXhighEffort(model)
  )
    params.temperature = options.temperature;
  if (options?.stop !== void 0 && options.stop.length > 0) params.stop_sequences = options.stop;
  let toolProjection;
  if (context.tools) {
    const convertedTools = convertAnthropicTools(context.tools, isOAuthToken);
    toolProjection = convertedTools.projection;
    if (convertedTools.tools.length > 0) params.tools = convertedTools.tools;
  }
  if (mandatoryAdaptiveThinking || model.reasoning || supportsAdaptiveThinking(model)) {
    if (mandatoryAdaptiveThinking || options?.thinkingEnabled)
      if (supportsAdaptiveThinking(model)) {
        params.thinking = {
          type: "adaptive",
          display: options?.thinkingDisplay ?? "summarized",
        };
        const effort = options?.effort ?? (mandatoryAdaptiveThinking ? "high" : void 0);
        if (effort) params.output_config = { effort };
      } else
        params.thinking = {
          type: "enabled",
          budget_tokens: options?.thinkingBudgetTokens ?? 1024,
        };
    else if (options?.thinkingEnabled === false) params.thinking = { type: "disabled" };
  }
  if (options?.metadata && typeof options.metadata.user_id === "string")
    params.metadata = { user_id: options.metadata.user_id };
  if (options?.toolChoice) {
    const normalizedToolChoice = normalizeAnthropicToolChoice(
      replayThinkingEnabled,
      options.toolChoice,
    );
    const projectedToolChoice = toolProjection
      ? reconcileAnthropicToolChoice(normalizedToolChoice, toolProjection)
      : normalizedToolChoice;
    if (projectedToolChoice) params.tool_choice = projectedToolChoice;
  }
  applyAnthropicPayloadPolicyToParams(params, payloadPolicy, cacheBreakpointOptOutMessageIndexes);
  return {
    params,
    toolProjection,
  };
}
function resolveAnthropicTransportOptions(model, options, apiKey) {
  const baseMaxTokens = resolveAnthropicMessagesMaxTokens({
    modelMaxTokens: model.maxTokens,
    requestedMaxTokens: options?.maxTokens,
    useModelDefault: resolveClaudeSonnet5ModelIdentity(model) !== void 0,
  });
  if (baseMaxTokens === void 0)
    throw new Error(
      `Anthropic Messages transport requires a positive maxTokens value for ${model.provider}/${model.id}`,
    );
  const reasoningModelMaxTokens =
    resolvePositiveAnthropicMaxTokens(model.maxTokens) ?? baseMaxTokens;
  const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
  const reasoning =
    options?.reasoning === "off" && mandatoryAdaptiveThinking ? "low" : options?.reasoning;
  const resolved = {
    temperature: options?.temperature,
    stop: options?.stop,
    maxTokens: baseMaxTokens,
    signal: options?.signal,
    apiKey,
    cacheRetention: options?.cacheRetention,
    sessionId: options?.sessionId,
    headers: options?.headers,
    onPayload: options?.onPayload,
    maxRetryDelayMs: options?.maxRetryDelayMs,
    metadata: options?.metadata,
    interleavedThinking: options?.interleavedThinking,
    toolChoice: options?.toolChoice,
    thinkingBudgets: options?.thinkingBudgets,
    reasoning,
  };
  if (reasoning === "off") {
    resolved.thinkingEnabled = false;
    return resolved;
  }
  if (!reasoning) {
    resolved.thinkingEnabled = defaultsClaudeAdaptiveThinking(model);
    if (resolved.thinkingEnabled) resolved.effort = "high";
    return resolved;
  }
  if (supportsAdaptiveThinking(model)) {
    resolved.thinkingEnabled = true;
    resolved.effort = mapThinkingLevelToEffort(reasoning, model);
    return resolved;
  }
  const adjusted = adjustMaxTokensForThinking({
    baseMaxTokens,
    modelMaxTokens: reasoningModelMaxTokens,
    reasoningLevel: reasoning,
    customBudgets: options?.thinkingBudgets,
  });
  const thinkingEnabled = adjusted.thinkingBudget >= 1024;
  resolved.maxTokens = adjusted.maxTokens;
  resolved.thinkingEnabled = thinkingEnabled;
  resolved.thinkingBudgetTokens = thinkingEnabled ? adjusted.thinkingBudget : void 0;
  return resolved;
}
/** Create the stream function used by Anthropic Messages transport models. */
function createAnthropicMessagesTransportStreamFn() {
  return (rawModel, context, rawOptions) => {
    const model = withEffectiveAnthropicBaseUrl(rawModel);
    const options = rawOptions;
    const { eventStream, stream } = createWritableTransportEventStream();
    (async () => {
      const output = {
        role: "assistant",
        content: [],
        api: "anthropic-messages",
        provider: model.provider,
        model: model.id,
        usage: createEmptyTransportUsage(),
        stopReason: "stop",
        timestamp: Date.now(),
      };
      const refusalBuffer = usesClaudeStreamingRefusalContract(model)
        ? createDeferredEventBuffer(stream, () => notifyLlmRequestActivity(options?.signal))
        : void 0;
      const eventSink = refusalBuffer ?? stream;
      let costModel = model;
      let messageStartPromptUsage;
      try {
        const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
        if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
        const transportOptions = resolveAnthropicTransportOptions(model, options, apiKey);
        const requestContext = prepareClaudeSonnet5RequestContext(model, context);
        const { client, isOAuthToken } = createAnthropicTransportClient({
          model,
          context: requestContext,
          apiKey,
          options: transportOptions,
        });
        const builtParams = buildAnthropicParams(
          model,
          requestContext,
          isOAuthToken,
          transportOptions,
        );
        let params = builtParams.params;
        const toolProjection = builtParams.toolProjection;
        const nextParams = await transportOptions.onPayload?.(params, model);
        if (nextParams !== void 0) params = nextParams;
        applyClaudeRequestContract(params, model);
        const anthropicStream = client.messages.stream(
          {
            ...params,
            stream: true,
          },
          transportOptions.signal ? { signal: transportOptions.signal } : void 0,
        );
        const blocks = output.content;
        const blockIndexes = /* @__PURE__ */ new Map();
        const pendingThinkingSignatures = /* @__PURE__ */ new Map();
        const allowReasoningContentReplay = supportsReasoningContentReplay(model);
        const reasoningContentThinkingBlocks = /* @__PURE__ */ new Map();
        const reasoningContentTextBlocks = /* @__PURE__ */ new Map();
        let sawMessageStop = false;
        const pendingTextEnds = [];
        const flushPendingTextEnds = () => {
          for (const event of pendingTextEnds) eventSink.push(event);
          pendingTextEnds.length = 0;
        };
        const eventIndexKey = (eventIndex) => (typeof eventIndex === "number" ? eventIndex : -1);
        const appendReasoningContentThinkingDelta = (eventIndex, rawText) => {
          if (typeof rawText !== "string") return false;
          const text = sanitizeTransportPayloadText(rawText);
          if (text.length === 0) return false;
          const key = eventIndexKey(eventIndex);
          let contentIndex = reasoningContentThinkingBlocks.get(key);
          let block = contentIndex === void 0 ? void 0 : output.content[contentIndex];
          if (!block || block.type !== "thinking") {
            block = {
              type: "thinking",
              thinking: "",
              thinkingSignature: "reasoning_content",
            };
            output.content.push(block);
            contentIndex = output.content.length - 1;
            reasoningContentThinkingBlocks.set(key, contentIndex);
            eventSink.push({
              type: "thinking_start",
              contentIndex,
              partial: output,
            });
          }
          block.thinking += text;
          block.thinkingSignature = "reasoning_content";
          eventSink.push({
            type: "thinking_delta",
            contentIndex,
            delta: text,
            partial: output,
          });
          return true;
        };
        const appendReasoningContentTextDelta = (eventIndex, rawText) => {
          if (typeof rawText !== "string") return false;
          const text = sanitizeTransportPayloadText(rawText);
          if (text.length === 0) return false;
          const key = eventIndexKey(eventIndex);
          let contentIndex = reasoningContentTextBlocks.get(key);
          let block = contentIndex === void 0 ? void 0 : output.content[contentIndex];
          if (!block || block.type !== "text") {
            block = {
              type: "text",
              text: "",
            };
            output.content.push(block);
            contentIndex = output.content.length - 1;
            reasoningContentTextBlocks.set(key, contentIndex);
            eventSink.push({
              type: "text_start",
              contentIndex,
              partial: output,
            });
          }
          block.text += text;
          eventSink.push({
            type: "text_delta",
            contentIndex,
            delta: text,
            partial: output,
          });
          return true;
        };
        const finishReasoningContentSidecars = (eventIndex) => {
          const key = eventIndexKey(eventIndex);
          const thinkingContentIndex = reasoningContentThinkingBlocks.get(key);
          if (thinkingContentIndex !== void 0) {
            reasoningContentThinkingBlocks.delete(key);
            const block = output.content[thinkingContentIndex];
            if (block?.type === "thinking")
              eventSink.push({
                type: "thinking_end",
                contentIndex: thinkingContentIndex,
                content: block.thinking,
                partial: output,
              });
          }
          const textContentIndex = reasoningContentTextBlocks.get(key);
          if (textContentIndex === void 0) return;
          reasoningContentTextBlocks.delete(key);
          const block = output.content[textContentIndex];
          if (block?.type === "text")
            eventSink.push({
              type: "text_end",
              contentIndex: textContentIndex,
              content: block.text,
              partial: output,
            });
        };
        for await (const event of anthropicStream) {
          if (event.type === "error") {
            const error = event.error;
            throw new Error(error?.message || "Anthropic Messages stream failed");
          }
          if (event.type === "message_start") {
            const message = event.message;
            const usage = message?.usage ?? {};
            output.responseId = typeof message?.id === "string" ? message.id : void 0;
            output.responseModel = typeof message?.model === "string" ? message.model : void 0;
            const promptUsage = readAnthropicPromptUsageSnapshot(usage);
            const messageStartPromptTokens = promptUsage
              ? promptUsage.input + promptUsage.cacheRead + promptUsage.cacheWrite
              : 0;
            messageStartPromptUsage = messageStartPromptTokens > 0 ? promptUsage : void 0;
            const inputTokens = readAnthropicUsageTokenCount(usage.input_tokens);
            if (inputTokens !== void 0) output.usage.input = inputTokens;
            const outputTokens = readAnthropicUsageTokenCount(usage.output_tokens);
            if (outputTokens !== void 0) output.usage.output = outputTokens;
            const cacheReadTokens =
              usage.cache_read_input_tokens == null
                ? 0
                : readAnthropicUsageTokenCount(usage.cache_read_input_tokens);
            if (cacheReadTokens !== void 0) output.usage.cacheRead = cacheReadTokens;
            const cacheWriteTokens =
              usage.cache_creation_input_tokens == null
                ? 0
                : readAnthropicUsageTokenCount(usage.cache_creation_input_tokens);
            if (cacheWriteTokens !== void 0) output.usage.cacheWrite = cacheWriteTokens;
            output.usage.totalTokens =
              output.usage.input +
              output.usage.output +
              output.usage.cacheRead +
              output.usage.cacheWrite;
            if (messageStartPromptUsage && outputTokens !== void 0)
              output.usage.contextUsage = {
                state: "available",
                promptTokens: messageStartPromptTokens,
                totalTokens: messageStartPromptTokens + output.usage.output,
              };
            calculateCost(costModel, output.usage);
            eventSink.push({
              type: "start",
              partial: output,
            });
            continue;
          }
          if (event.type === "message_stop") {
            sawMessageStop = true;
            continue;
          }
          if (event.type === "content_block_start") {
            const contentBlock = event.content_block;
            const index = typeof event.index === "number" ? event.index : -1;
            const fallbackBoundary = refusalBuffer
              ? readAnthropicFallbackBoundary(contentBlock)
              : null;
            if (fallbackBoundary) {
              refusalBuffer?.discard();
              pendingTextEnds.length = 0;
              blockIndexes.clear();
              pendingThinkingSignatures.clear();
              applyAnthropicFallbackBoundary({
                output,
                boundary: fallbackBoundary,
                provider: model.provider,
              });
              costModel = {
                ...model,
                cost: CLAUDE_FABLE_5_FALLBACK_MODEL_COST,
              };
              calculateCost(costModel, output.usage);
              eventSink.push({
                type: "start",
                partial: output,
              });
              for (const [i, block] of output.content.entries()) {
                if (block.type !== "text") continue;
                delete block.index;
                eventSink.push({
                  type: "text_start",
                  contentIndex: i,
                  partial: output,
                });
                if (block.text)
                  eventSink.push({
                    type: "text_delta",
                    contentIndex: i,
                    delta: block.text,
                    partial: output,
                  });
                pendingTextEnds.push({
                  type: "text_end",
                  contentIndex: i,
                  content: block.text,
                  partial: output,
                });
              }
              continue;
            }
            pendingThinkingSignatures.delete(index);
            if (contentBlock?.type === "text") {
              const text =
                typeof contentBlock.text === "string"
                  ? sanitizeTransportPayloadText(contentBlock.text)
                  : "";
              const block = {
                type: "text",
                text,
                index,
              };
              output.content.push(block);
              const contentIndex = output.content.length - 1;
              blockIndexes.set(index, contentIndex);
              eventSink.push({
                type: "text_start",
                contentIndex,
                partial: output,
              });
              if (text.length > 0)
                eventSink.push({
                  type: "text_delta",
                  contentIndex,
                  delta: text,
                  partial: output,
                });
              continue;
            }
            if (contentBlock?.type === "thinking") {
              const thinking =
                typeof contentBlock.thinking === "string" ? contentBlock.thinking : "";
              const block = {
                type: "thinking",
                thinking,
                thinkingSignature:
                  typeof contentBlock.signature === "string" ? contentBlock.signature : "",
                index,
              };
              output.content.push(block);
              const contentIndex = output.content.length - 1;
              blockIndexes.set(index, contentIndex);
              eventSink.push({
                type: "thinking_start",
                contentIndex,
                partial: output,
              });
              if (thinking.length > 0)
                eventSink.push({
                  type: "thinking_delta",
                  contentIndex,
                  delta: thinking,
                  partial: output,
                });
              continue;
            }
            if (contentBlock?.type === "redacted_thinking") {
              const block = {
                type: "thinking",
                thinking: "[Reasoning redacted]",
                thinkingSignature: typeof contentBlock.data === "string" ? contentBlock.data : "",
                redacted: true,
                index,
              };
              output.content.push(block);
              blockIndexes.set(index, output.content.length - 1);
              eventSink.push({
                type: "thinking_start",
                contentIndex: output.content.length - 1,
                partial: output,
              });
              continue;
            }
            if (contentBlock?.type === "tool_use") {
              tagPendingCommentaryText(output.content);
              flushPendingTextEnds();
              const block = {
                type: "toolCall",
                id: typeof contentBlock.id === "string" ? contentBlock.id : "",
                name:
                  typeof contentBlock.name === "string"
                    ? isOAuthToken
                      ? resolveOriginalAnthropicToolName(contentBlock.name, toolProjection)
                      : contentBlock.name
                    : "",
                arguments:
                  contentBlock.input && typeof contentBlock.input === "object"
                    ? contentBlock.input
                    : {},
                partialJson: "",
                index,
              };
              output.content.push(block);
              blockIndexes.set(index, output.content.length - 1);
              eventSink.push({
                type: "toolcall_start",
                contentIndex: output.content.length - 1,
                partial: output,
              });
            }
            continue;
          }
          if (event.type === "content_block_delta") {
            const delta = event.delta;
            const eventIndex = typeof event.index === "number" ? event.index : void 0;
            let index = eventIndex === void 0 ? void 0 : blockIndexes.get(eventIndex);
            let block = index === void 0 ? void 0 : blocks[index];
            if (allowReasoningContentReplay) {
              const appendedThinking = appendReasoningContentThinkingDelta(
                event.index,
                delta?.reasoning_content,
              );
              const hasNativeAnthropicDelta =
                (delta?.type === "text_delta" && typeof delta.text === "string") ||
                (delta?.type === "thinking_delta" && typeof delta.thinking === "string") ||
                (delta?.type === "input_json_delta" && typeof delta.partial_json === "string") ||
                (delta?.type === "signature_delta" && typeof delta.signature === "string");
              let appendedContent = false;
              if (
                !hasNativeAnthropicDelta &&
                typeof delta?.content === "string" &&
                delta.content.length > 0
              ) {
                const text = sanitizeTransportPayloadText(delta.content);
                if (text.length > 0)
                  if (block?.type === "text") {
                    block.text += text;
                    eventSink.push({
                      type: "text_delta",
                      contentIndex: index,
                      delta: text,
                      partial: output,
                    });
                    appendedContent = true;
                  } else appendedContent = appendReasoningContentTextDelta(event.index, text);
              }
              if ((appendedThinking || appendedContent) && !hasNativeAnthropicDelta) continue;
            }
            if (!block && delta?.type === "text_delta" && typeof delta.text === "string") {
              block = {
                type: "text",
                text: "",
                index: typeof event.index === "number" ? event.index : blocks.length,
              };
              output.content.push(block);
              index = output.content.length - 1;
              if (typeof event.index === "number") blockIndexes.set(event.index, index);
              eventSink.push({
                type: "text_start",
                contentIndex: index,
                partial: output,
              });
            }
            if (
              block?.type === "text" &&
              delta?.type === "text_delta" &&
              typeof delta.text === "string"
            ) {
              block.text += delta.text;
              eventSink.push({
                type: "text_delta",
                contentIndex: index,
                delta: delta.text,
                partial: output,
              });
              continue;
            }
            if (
              block?.type === "thinking" &&
              delta?.type === "thinking_delta" &&
              typeof delta.thinking === "string"
            ) {
              block.thinking += delta.thinking;
              eventSink.push({
                type: "thinking_delta",
                contentIndex: index,
                delta: delta.thinking,
                partial: output,
              });
              continue;
            }
            if (
              block?.type === "toolCall" &&
              delta?.type === "input_json_delta" &&
              typeof delta.partial_json === "string"
            ) {
              const partialJson = `${block.partialJson ?? ""}${delta.partial_json}`;
              block.partialJson = partialJson;
              block.arguments = parseAnthropicToolCallArguments(partialJson);
              eventSink.push({
                type: "toolcall_delta",
                contentIndex: index,
                delta: delta.partial_json,
                partial: output,
              });
              continue;
            }
            if (
              block?.type === "thinking" &&
              delta?.type === "signature_delta" &&
              typeof delta.signature === "string"
            ) {
              const signatureIndex = eventIndexKey(event.index);
              const pendingSignature = pendingThinkingSignatures.get(signatureIndex);
              if (pendingSignature === void 0) {
                block.thinkingSignature = "";
                pendingThinkingSignatures.set(signatureIndex, delta.signature);
              } else
                pendingThinkingSignatures.set(signatureIndex, pendingSignature + delta.signature);
            }
            continue;
          }
          if (event.type === "content_block_stop") {
            const eventIndex = typeof event.index === "number" ? event.index : void 0;
            const pendingSignature =
              eventIndex === void 0 ? void 0 : pendingThinkingSignatures.get(eventIndex);
            if (eventIndex !== void 0) pendingThinkingSignatures.delete(eventIndex);
            const index = eventIndex === void 0 ? void 0 : blockIndexes.get(eventIndex);
            const block = index === void 0 ? void 0 : blocks[index];
            if (eventIndex === void 0 || index === void 0 || !block) {
              finishReasoningContentSidecars(event.index);
              continue;
            }
            blockIndexes.delete(eventIndex);
            delete block.index;
            if (block.type === "text") {
              pendingTextEnds.push({
                type: "text_end",
                contentIndex: index,
                content: block.text,
                partial: output,
              });
              finishReasoningContentSidecars(event.index);
              continue;
            }
            if (block.type === "thinking") {
              if (pendingSignature !== void 0) block.thinkingSignature = pendingSignature;
              eventSink.push({
                type: "thinking_end",
                contentIndex: index,
                content: block.thinking,
                partial: output,
              });
              finishReasoningContentSidecars(event.index);
              continue;
            }
            if (block.type === "toolCall") {
              delete block.partialJson;
              eventSink.push({
                type: "toolcall_end",
                contentIndex: index,
                toolCall: block,
                partial: output,
              });
              finishReasoningContentSidecars(event.index);
            }
            continue;
          }
          if (event.type === "message_delta") {
            const delta = event.delta;
            const usage = event.usage;
            if (delta?.stop_reason)
              if (delta.stop_reason === "refusal")
                applyAnthropicRefusal(output, delta.stop_details, model.provider);
              else output.stopReason = mapStopReason(delta.stop_reason);
            const inputTokens = readAnthropicUsageTokenCount(usage?.input_tokens);
            if (inputTokens !== void 0) output.usage.input = inputTokens;
            const outputTokens = readAnthropicUsageTokenCount(usage?.output_tokens);
            if (outputTokens !== void 0) output.usage.output = outputTokens;
            const cacheReadTokens = readAnthropicUsageTokenCount(usage?.cache_read_input_tokens);
            if (cacheReadTokens !== void 0) output.usage.cacheRead = cacheReadTokens;
            const cacheWriteTokens = readAnthropicUsageTokenCount(
              usage?.cache_creation_input_tokens,
            );
            if (cacheWriteTokens !== void 0) output.usage.cacheWrite = cacheWriteTokens;
            output.usage.totalTokens =
              output.usage.input +
              output.usage.output +
              output.usage.cacheRead +
              output.usage.cacheWrite;
            const iterationUsage = readLastAnthropicIterationUsage(usage ?? {});
            if (iterationUsage.state === "valid")
              output.usage.contextUsage = {
                state: "available",
                promptTokens: iterationUsage.usage.contextPromptTokens,
                totalTokens: iterationUsage.usage.totalTokens,
              };
            else if (iterationUsage.state === "invalid")
              output.usage.contextUsage = { state: "unavailable" };
            else if (
              outputTokens !== void 0 &&
              (messageStartPromptUsage !== void 0 ||
                (inputTokens !== void 0 &&
                  cacheReadTokens !== void 0 &&
                  cacheWriteTokens !== void 0))
            ) {
              const promptTokens =
                output.usage.input + output.usage.cacheRead + output.usage.cacheWrite;
              output.usage.contextUsage = {
                state: "available",
                promptTokens,
                totalTokens: promptTokens + output.usage.output,
              };
            } else output.usage.contextUsage = { state: "unavailable" };
            calculateCost(costModel, output.usage);
            if (
              output.stopReason === "toolUse" ||
              output.content.some((block) => block.type === "toolCall")
            )
              tagPendingCommentaryText(output.content);
            flushPendingTextEnds();
          }
        }
        if (refusalBuffer && !sawMessageStop)
          throw new Error("Anthropic stream ended before message_stop");
        if (transportOptions.signal?.aborted) throw new Error("Request was aborted");
        if (output.stopReason === "aborted" || output.stopReason === "error")
          throw new Error(output.errorMessage ?? "An unknown error occurred");
        refusalBuffer?.flush();
        if (
          output.stopReason === "toolUse" ||
          output.content.some((block) => block.type === "toolCall")
        )
          tagPendingCommentaryText(output.content);
        flushPendingTextEnds();
        finalizeTransportStream({
          stream,
          output,
        });
      } catch (error) {
        if (refusalBuffer) {
          refusalBuffer.discard();
          output.content = [];
        }
        failTransportStream({
          stream,
          output,
          signal: options?.signal,
          error,
          cleanup: () => {
            for (const block of output.content) delete block.index;
          },
        });
      }
    })();
    return eventStream;
  };
}
//#endregion
//#region src/agents/provider-transport-stream.ts
const SUPPORTED_TRANSPORT_APIS = /* @__PURE__ */ new Set([
  "openai-responses",
  "openai-chatgpt-responses",
  "openai-completions",
  "azure-openai-responses",
  "anthropic-messages",
  "google-generative-ai",
]);
const SIMPLE_TRANSPORT_API_ALIAS = {
  "openai-responses": "openclaw-openai-responses-transport",
  "openai-chatgpt-responses": "openclaw-openai-responses-transport",
  "openai-completions": "openclaw-openai-completions-transport",
  "azure-openai-responses": "openclaw-azure-openai-responses-transport",
  "anthropic-messages": "openclaw-anthropic-messages-transport",
  "google-generative-ai": "openclaw-google-generative-ai-transport",
};
function createProviderOwnedGoogleTransportStreamFn(model, ctx) {
  return (
    resolveProviderStreamFn({
      provider: model.provider,
      config: ctx?.cfg,
      workspaceDir: ctx?.workspaceDir,
      env: ctx?.env,
      context: {
        config: ctx?.cfg,
        agentDir: ctx?.agentDir,
        workspaceDir: ctx?.workspaceDir,
        provider: model.provider,
        modelId: model.id,
        model,
      },
    }) ??
    resolveProviderStreamFn({
      provider: "google",
      config: ctx?.cfg,
      workspaceDir: ctx?.workspaceDir,
      env: ctx?.env,
      context: {
        config: ctx?.cfg,
        agentDir: ctx?.agentDir,
        workspaceDir: ctx?.workspaceDir,
        provider: model.provider,
        modelId: model.id,
        model,
      },
    }) ??
    void 0
  );
}
function createSupportedTransportStreamFn(model, ctx) {
  switch (model.api) {
    case "openai-responses":
    case "openai-chatgpt-responses":
      return createOpenAIResponsesTransportStreamFn();
    case "openai-completions":
      return createOpenAICompletionsTransportStreamFn();
    case "azure-openai-responses":
      return createAzureOpenAIResponsesTransportStreamFn();
    case "anthropic-messages":
      return createAnthropicMessagesTransportStreamFn();
    case "google-generative-ai":
      return createProviderOwnedGoogleTransportStreamFn(model, ctx);
    default:
      return;
  }
}
function hasOpenClawTransportRequirement(model) {
  const request = getModelProviderRequestTransport(model);
  return Boolean(request?.proxy || request?.tls || getModelProviderLocalService(model));
}
/** Returns whether OpenClaw has a managed transport implementation for this API. */
function isTransportAwareApiSupported(api) {
  return SUPPORTED_TRANSPORT_APIS.has(api);
}
/** Maps public model APIs to the internal transport API id used by simple runtime dispatch. */
function resolveTransportAwareSimpleApi(api) {
  return SIMPLE_TRANSPORT_API_ALIAS[api];
}
/** Creates a managed transport stream only when request overrides require it. */
function createTransportAwareStreamFnForModel(model, ctx) {
  if (!hasOpenClawTransportRequirement(model)) return;
  if (!isTransportAwareApiSupported(model.api))
    throw new Error(
      `Model-provider request.proxy/request.tls/localService is not yet supported for api "${model.api}"`,
    );
  return createSupportedTransportStreamFn(model, ctx);
}
/** Creates a managed OpenClaw transport stream for explicit fallback/runtime callers. */
function createOpenClawTransportStreamFnForModel(model, ctx) {
  if (!isTransportAwareApiSupported(model.api)) return;
  return createSupportedTransportStreamFn(model, ctx);
}
function createBoundaryAwareStreamFnForModel(model, ctx) {
  if (!isTransportAwareApiSupported(model.api)) return;
  return createSupportedTransportStreamFn(model, ctx);
}
function prepareTransportAwareSimpleModel(model, ctx) {
  const streamFn = createTransportAwareStreamFnForModel(model, ctx);
  const alias = resolveTransportAwareSimpleApi(model.api);
  if (!streamFn || !alias) return model;
  return {
    ...model,
    api: alias,
  };
}
function buildTransportAwareSimpleStreamFn(model, ctx) {
  return createTransportAwareStreamFnForModel(model, ctx);
}
//#endregion
//#region src/agents/provider-stream.ts
/** Resolves and registers the stream function for a provider-backed model. */
function registerProviderStreamForModel(params) {
  const pluginModel = unwrapModelHeaderSentinelsForProviderEgress(
    params.model,
    "plugin provider stream construction",
  );
  const providerStreamFn = resolveProviderStreamFn({
    provider: params.model.provider,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
    allowRuntimePluginLoad: params.allowRuntimePluginLoad,
    context: {
      config: params.cfg,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      provider: params.model.provider,
      modelId: params.model.id,
      model: pluginModel,
    },
  });
  const transportFallback = providerStreamFn
    ? void 0
    : createTransportAwareStreamFnForModel(
        params.model.api === "google-generative-ai" ? pluginModel : params.model,
        {
          cfg: params.cfg,
          agentDir: params.agentDir,
          workspaceDir: params.workspaceDir,
          env: params.env,
        },
      );
  const streamFn = providerStreamFn
    ? wrapPluginProviderStream(providerStreamFn)
    : transportFallback && params.model.api === "google-generative-ai"
      ? wrapPluginProviderStream(transportFallback)
      : transportFallback;
  if (!streamFn) return;
  if (params.registerStream !== false) ensureCustomApiRegistered(params.model.api, streamFn);
  return streamFn;
}
function wrapPluginProviderStream(streamFn) {
  const boundary = "plugin provider stream handoff";
  return (model, context, options) => {
    const apiKey = options?.apiKey
      ? unwrapSecretSentinelsForProviderEgress(options.apiKey, boundary)
      : options?.apiKey;
    const headers = options?.headers
      ? unwrapHeaderSentinelsForProviderEgress(options.headers, boundary)
      : options?.headers;
    const resolvedOptions =
      apiKey === options?.apiKey && headers === options?.headers
        ? options
        : {
            ...options,
            apiKey,
            headers,
          };
    return streamFn(
      unwrapModelHeaderSentinelsForProviderEgress(model, boundary),
      context,
      resolvedOptions,
    );
  };
}
//#endregion
export {
  prepareTransportAwareSimpleModel as a,
  ensureCustomApiRegistered as c,
  createOpenClawTransportStreamFnForModel as i,
  buildTransportAwareSimpleStreamFn as n,
  resolveTransportAwareSimpleApi as o,
  createBoundaryAwareStreamFnForModel as r,
  resolveAnthropicMessagesUrl as s,
  registerProviderStreamForModel as t,
};
