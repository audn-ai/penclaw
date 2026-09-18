import { randomUUID } from "node:crypto";
import { n as agentCommandFromIngress } from "./agent-command-CxzoW4-d.js";
import { c as emitAgentEvent, v as onAgentEvent } from "./agent-events-D4UsOPeT.js";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-BdyK5IN2.js";
import { n as estimateBase64DecodedBytes } from "./base64-hBzWwdnH.js";
import { t as createDefaultDeps } from "./deps-BDX9tA_j.js";
import { p as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-yGjmBAjy.js";
import {
  n as authorizeOpenAiCompatibleHttpModelOverride,
  u as resolveOpenAiCompatibleHttpOperatorScopes,
} from "./http-auth-utils-Cm6rPa7b.js";
import "./stream-message-shared-DKS8UMJ_.js";
import {
  a as sendJson,
  d as setSseHeaders,
  f as watchClientDisconnect,
  p as writeDone,
  s as sendMissingScopeForbidden,
} from "./http-common-Czxz795c.js";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-4-WwJuzP.js";
import {
  c as resolveOpenAiCompatModelOverride,
  i as isUnknownGatewayAgentError,
  r as isGatewaySessionKeyOverrideError,
  s as resolveGatewayRequestContext,
} from "./http-utils-B3cLzhCe.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import "./agent-DzWgmb_I.js";
import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
import {
  a as validateOpenAiSamplingParams,
  c as buildAgentMessageFromConversationEntries,
  d as resolveAssistantStreamSnapshotText,
  i as resolveOpenAiCompatError,
  l as isReplaceableAssistantStreamEvent,
  n as resolveUnsatisfiedToolChoiceMessage,
  o as normalizeInputHostnameAllowlist,
  r as toolChoiceConstraintPrompt,
  s as IMAGE_ONLY_USER_MESSAGE,
  t as isToolChoiceConstraintSatisfied,
  u as resolveAssistantStreamDeltaText,
} from "./openai-tool-choice-CmddRmRp.js";
import {
  d as DEFAULT_INPUT_TIMEOUT_MS,
  l as DEFAULT_INPUT_IMAGE_MAX_BYTES,
  m as normalizeMimeList,
  p as extractImageContentFromSource,
  u as DEFAULT_INPUT_IMAGE_MIMES,
} from "./runner.entries-BYq5cGUt.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  Bt as hasNonzeroUsage,
  Ht as normalizeUsage,
  Ut as toOpenAiChatCompletionsUsage,
} from "./session-accessor-PZVNxFCV.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/openai-http.ts
const DEFAULT_OPENAI_CHAT_COMPLETIONS_BODY_BYTES = 20 * 1024 * 1024;
const DEFAULT_OPENAI_MAX_IMAGE_PARTS = 8;
const DEFAULT_OPENAI_MAX_TOTAL_IMAGE_BYTES = 20 * 1024 * 1024;
const DEFAULT_OPENAI_IMAGE_LIMITS = {
  allowUrl: false,
  allowedMimes: new Set(DEFAULT_INPUT_IMAGE_MIMES),
  maxBytes: DEFAULT_INPUT_IMAGE_MAX_BYTES,
  maxRedirects: 3,
  timeoutMs: DEFAULT_INPUT_TIMEOUT_MS,
};
function resolveOpenAiChatCompletionsLimits(config) {
  const imageConfig = config?.images;
  return {
    maxBodyBytes: config?.maxBodyBytes ?? DEFAULT_OPENAI_CHAT_COMPLETIONS_BODY_BYTES,
    maxImageParts: resolveIntegerOption(config?.maxImageParts, DEFAULT_OPENAI_MAX_IMAGE_PARTS, {
      min: 0,
    }),
    maxTotalImageBytes: resolveIntegerOption(
      config?.maxTotalImageBytes,
      DEFAULT_OPENAI_MAX_TOTAL_IMAGE_BYTES,
      { min: 1 },
    ),
    images: {
      allowUrl: imageConfig?.allowUrl ?? DEFAULT_OPENAI_IMAGE_LIMITS.allowUrl,
      urlAllowlist: normalizeInputHostnameAllowlist(imageConfig?.urlAllowlist),
      allowedMimes: normalizeMimeList(imageConfig?.allowedMimes, DEFAULT_INPUT_IMAGE_MIMES),
      maxBytes: imageConfig?.maxBytes ?? 10485760,
      maxRedirects: imageConfig?.maxRedirects ?? 3,
      timeoutMs: imageConfig?.timeoutMs ?? 1e4,
    },
  };
}
function writeSse(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}
function buildAgentCommandInput(params) {
  return {
    message: params.prompt.message,
    extraSystemPrompt: params.prompt.extraSystemPrompt,
    images: params.prompt.images,
    clientTools: params.clientTools,
    model: params.modelOverride,
    sessionKey: params.sessionKey,
    runId: params.runId,
    deliver: false,
    messageChannel: params.messageChannel,
    bestEffortDeliver: false,
    allowModelOverride: params.modelOverride !== void 0,
    abortSignal: params.abortSignal,
    streamParams: params.streamParams,
  };
}
function extractClientToolsFromChatRequest(tools) {
  if (tools == null) return [];
  if (!Array.isArray(tools)) throw new Error("tools must be an array");
  const clientTools = [];
  for (const tool of tools) {
    if (!tool || typeof tool !== "object" || Array.isArray(tool))
      throw new Error("each tool must be an object");
    if (tool.type !== "function") throw new Error("only function tools are supported");
    const functionValue = tool.function;
    if (!functionValue || typeof functionValue !== "object" || Array.isArray(functionValue))
      throw new Error("tool.function is required");
    const rawName = functionValue.name;
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) throw new Error("tool.function.name is required");
    const description = functionValue.description;
    const parameters = functionValue.parameters;
    const strict = functionValue.strict;
    clientTools.push({
      type: "function",
      function: {
        name,
        ...(typeof description === "string" ? { description } : {}),
        ...(parameters && typeof parameters === "object" && !Array.isArray(parameters)
          ? { parameters }
          : {}),
        ...(typeof strict === "boolean" ? { strict } : {}),
      },
    });
  }
  return clientTools;
}
function applyChatToolChoice(params) {
  const { tools, toolChoice } = params;
  if (toolChoice == null || toolChoice === "auto") return { tools };
  if (toolChoice === "none") return { tools: [] };
  if (toolChoice === "required") {
    if (tools.length === 0) throw new Error("tool_choice=required but no tools were provided");
    const constraint = { type: "required" };
    return {
      tools,
      extraSystemPrompt: toolChoiceConstraintPrompt(constraint),
      constraint,
    };
  }
  if (typeof toolChoice !== "object" || Array.isArray(toolChoice))
    throw new Error("tool_choice must be a string or object");
  const choiceType = toolChoice.type;
  if (choiceType === "function") {
    const targetName = normalizeOptionalString(toolChoice.function?.name);
    if (!targetName) throw new Error("tool_choice.function.name is required");
    const matched = tools.filter((tool) => tool.function?.name === targetName);
    if (matched.length === 0) throw new Error(`tool_choice requested unknown tool: ${targetName}`);
    const constraint = {
      type: "function",
      name: targetName,
    };
    return {
      tools: matched,
      extraSystemPrompt: toolChoiceConstraintPrompt(constraint),
      constraint,
    };
  }
  if (typeof choiceType !== "string") throw new Error("unsupported tool_choice type");
  throw new Error(`tool_choice ${choiceType} is not supported`);
}
function writeAssistantRoleChunk(res, params) {
  writeSse(res, {
    id: params.runId,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1e3),
    model: params.model,
    choices: [
      {
        index: 0,
        delta: { role: "assistant" },
        finish_reason: null,
      },
    ],
  });
}
function writeAssistantContentChunk(res, params) {
  writeSse(res, {
    id: params.runId,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1e3),
    model: params.model,
    choices: [
      {
        index: 0,
        delta: { content: params.content },
        finish_reason: params.finishReason,
      },
    ],
  });
}
function writeAssistantFinishChunk(res, params) {
  writeSse(res, {
    id: params.runId,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1e3),
    model: params.model,
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: params.finishReason,
      },
    ],
  });
}
function splitArgumentsForStreaming(argumentsValue) {
  if (!argumentsValue) return [""];
  const chunkSize = 256;
  const chunks = [];
  for (let i = 0; i < argumentsValue.length; i += chunkSize)
    chunks.push(argumentsValue.slice(i, i + chunkSize));
  return chunks.length > 0 ? chunks : [""];
}
function writeAssistantToolCallsIncrementalChunks(res, params) {
  for (const [index, call] of params.toolCalls.entries()) {
    writeSse(res, {
      id: params.runId,
      object: "chat.completion.chunk",
      created: Math.floor(Date.now() / 1e3),
      model: params.model,
      choices: [
        {
          index: 0,
          delta: {
            tool_calls: [
              {
                index,
                id: call.id,
                type: "function",
                function: {
                  name: call.name,
                  arguments: "",
                },
              },
            ],
          },
          finish_reason: null,
        },
      ],
    });
    for (const argsDelta of splitArgumentsForStreaming(call.arguments))
      writeSse(res, {
        id: params.runId,
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1e3),
        model: params.model,
        choices: [
          {
            index: 0,
            delta: {
              tool_calls: [
                {
                  index,
                  function: { arguments: argsDelta },
                },
              ],
            },
            finish_reason: null,
          },
        ],
      });
  }
}
function writeUsageChunk(res, params) {
  writeSse(res, {
    id: params.runId,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1e3),
    model: params.model,
    choices: [],
    usage: params.usage,
  });
}
function asMessages(val) {
  return Array.isArray(val) ? val : [];
}
function extractTextContent(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content))
    return content
      .map((part) => {
        if (!part || typeof part !== "object") return "";
        const type = part.type;
        const text = part.text;
        const inputText = part.input_text;
        if (type === "text" && typeof text === "string") return text;
        if (type === "input_text" && typeof text === "string") return text;
        if (typeof inputText === "string") return inputText;
        return "";
      })
      .filter(Boolean)
      .join("\n");
  return "";
}
function stringifyToolCallArguments(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string" ? serialized : "";
  } catch {
    return "";
  }
}
function extractAssistantToolCalls(value) {
  if (!Array.isArray(value)) return [];
  const calls = [];
  for (const rawCall of value) {
    if (!rawCall || typeof rawCall !== "object" || Array.isArray(rawCall)) continue;
    const id = normalizeOptionalString(rawCall.id) ?? "";
    const functionValue = rawCall.function;
    if (!functionValue || typeof functionValue !== "object" || Array.isArray(functionValue))
      continue;
    const name = normalizeOptionalString(functionValue.name) ?? "";
    if (!id || !name) continue;
    const argumentsValue = stringifyToolCallArguments(functionValue.arguments);
    calls.push({
      id,
      name,
      arguments: argumentsValue,
    });
  }
  return calls;
}
function renderAssistantToolCalls(calls) {
  return calls
    .map((call) => `tool_call id=${call.id} name=${call.name} arguments=${call.arguments}`)
    .join("\n");
}
function resolveImageUrlPart(part) {
  if (!part || typeof part !== "object") return;
  const imageUrl = part.image_url;
  if (typeof imageUrl === "string") {
    const trimmed = imageUrl.trim();
    return trimmed.length > 0 ? trimmed : void 0;
  }
  if (!imageUrl || typeof imageUrl !== "object") return;
  const rawUrl = imageUrl.url;
  if (typeof rawUrl !== "string") return;
  const trimmed = rawUrl.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function extractImageUrls(content) {
  if (!Array.isArray(content)) return [];
  const urls = [];
  for (const part of content) {
    if (!part || typeof part !== "object") continue;
    if (part.type !== "image_url") continue;
    const url = resolveImageUrlPart(part);
    if (url) urls.push(url);
  }
  return urls;
}
function parseImageUrlToSource(url) {
  const dataUriMatch = /^data:([^,]*?),(.*)$/is.exec(url);
  if (dataUriMatch) {
    const metadata = normalizeOptionalString(dataUriMatch[1]) ?? "";
    const data = dataUriMatch[2] ?? "";
    const metadataParts = metadata
      .split(";")
      .map((part) => normalizeOptionalString(part) ?? "")
      .filter(Boolean);
    if (!metadataParts.some((part) => normalizeLowercaseStringOrEmpty(part) === "base64"))
      throw new Error("image_url data URI must be base64 encoded");
    if (!(normalizeOptionalString(data) ?? ""))
      throw new Error("image_url data URI is missing payload data");
    return {
      type: "base64",
      mediaType: metadataParts.find((part) => part.includes("/")),
      data,
    };
  }
  return {
    type: "url",
    url,
  };
}
function resolveActiveTurnContext(messagesUnknown) {
  const messages = asMessages(messagesUnknown);
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    if (!msg || typeof msg !== "object") continue;
    const role = normalizeOptionalString(msg.role) ?? "";
    const normalizedRole = role === "function" ? "tool" : role;
    if (normalizedRole !== "user" && normalizedRole !== "tool") continue;
    return {
      activeTurnIndex: i,
      activeUserMessageIndex: normalizedRole === "user" ? i : -1,
      urls: normalizedRole === "user" ? extractImageUrls(msg.content) : [],
    };
  }
  return {
    activeTurnIndex: -1,
    activeUserMessageIndex: -1,
    urls: [],
  };
}
async function resolveImagesForRequest(activeTurnContext, limits) {
  const urls = activeTurnContext.urls;
  if (urls.length === 0) return [];
  if (urls.length > limits.maxImageParts)
    throw new Error(`Too many image_url parts (${urls.length}; limit ${limits.maxImageParts})`);
  const images = [];
  let totalBytes = 0;
  for (const url of urls) {
    const source = parseImageUrlToSource(url);
    if (source.type === "base64") {
      const sourceBytes = estimateBase64DecodedBytes(source.data);
      if (totalBytes + sourceBytes > limits.maxTotalImageBytes)
        throw new Error(
          `Total image payload too large (${totalBytes + sourceBytes}; limit ${limits.maxTotalImageBytes})`,
        );
    }
    const image = await extractImageContentFromSource(source, limits.images);
    totalBytes += estimateBase64DecodedBytes(image.data);
    if (totalBytes > limits.maxTotalImageBytes)
      throw new Error(
        `Total image payload too large (${totalBytes}; limit ${limits.maxTotalImageBytes})`,
      );
    images.push(image);
  }
  return images;
}
const testOnlyOpenAiHttp = {
  resolveImagesForRequest,
  resolveOpenAiChatCompletionsLimits,
  resolveChatCompletionUsage,
};
function buildAgentPrompt(messagesUnknown, activeUserMessageIndex) {
  const messages = asMessages(messagesUnknown);
  const systemParts = [];
  const conversationEntries = [];
  for (const [i, msg] of messages.entries()) {
    if (!msg || typeof msg !== "object") continue;
    const role = normalizeOptionalString(msg.role) ?? "";
    const content = extractTextContent(msg.content).trim();
    const hasImage = extractImageUrls(msg.content).length > 0;
    if (!role) continue;
    if (role === "system" || role === "developer") {
      if (content) systemParts.push(content);
      continue;
    }
    const normalizedRole = role === "function" ? "tool" : role;
    if (normalizedRole !== "user" && normalizedRole !== "assistant" && normalizedRole !== "tool")
      continue;
    const assistantToolCalls =
      normalizedRole === "assistant" ? extractAssistantToolCalls(msg.tool_calls) : [];
    const assistantToolCallsSummary =
      assistantToolCalls.length > 0 ? renderAssistantToolCalls(assistantToolCalls) : "";
    const messageContent = [
      normalizedRole === "user" && !content && hasImage && i === activeUserMessageIndex
        ? IMAGE_ONLY_USER_MESSAGE
        : content,
      assistantToolCallsSummary,
    ]
      .filter((part) => Boolean(part))
      .join("\n");
    if (!messageContent) continue;
    const name = normalizeOptionalString(msg.name) ?? "";
    const toolCallId = normalizeOptionalString(msg.tool_call_id) ?? "";
    const sender =
      normalizedRole === "assistant"
        ? "Assistant"
        : normalizedRole === "user"
          ? "User"
          : toolCallId
            ? `Tool:${toolCallId}`
            : name
              ? `Tool:${name}`
              : "Tool";
    conversationEntries.push({
      role: normalizedRole,
      entry: {
        sender,
        body: messageContent,
      },
      internalStreamError:
        normalizedRole === "assistant" &&
        normalizeOptionalString(msg.stopReason) === "error" &&
        messageContent.trim() === "[assistant turn failed before producing content]",
    });
  }
  return {
    message: buildAgentMessageFromConversationEntries(conversationEntries),
    extraSystemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0,
  };
}
function coerceRequest(val) {
  if (!val || typeof val !== "object") return {};
  return val;
}
function resolveAgentResponseText(result) {
  const payloads = result?.payloads;
  if (!Array.isArray(payloads) || payloads.length === 0) return "No response from OpenClaw.";
  return (
    payloads
      .map((p) => (typeof p.text === "string" ? p.text : ""))
      .filter(Boolean)
      .join("\n\n") || "No response from OpenClaw."
  );
}
function resolveAgentResponseCommentary(result) {
  const payloads = result?.payloads;
  if (!Array.isArray(payloads) || payloads.length === 0) return "";
  return payloads
    .map((p) => (typeof p.text === "string" ? p.text : ""))
    .filter(Boolean)
    .join("\n\n");
}
function resolveAgentRunUsage(result) {
  const agentMeta = result?.meta?.agentMeta;
  const primary = normalizeUsage(agentMeta?.usage);
  if (hasNonzeroUsage(primary)) return primary;
  const fallback = normalizeUsage(agentMeta?.lastCallUsage);
  if (hasNonzeroUsage(fallback)) return fallback;
  return primary ?? fallback;
}
function resolveStopReasonAndPendingToolCalls(meta) {
  if (!meta || typeof meta !== "object" || Array.isArray(meta))
    return {
      stopReason: void 0,
      pendingToolCalls: void 0,
    };
  const stopReasonRaw = meta.stopReason;
  const stopReason = typeof stopReasonRaw === "string" ? stopReasonRaw : void 0;
  const pendingRaw = meta.pendingToolCalls;
  if (!Array.isArray(pendingRaw))
    return {
      stopReason,
      pendingToolCalls: void 0,
    };
  const pendingToolCalls = [];
  for (const call of pendingRaw) {
    const id = typeof call?.id === "string" ? call.id.trim() : "";
    const name = typeof call?.name === "string" ? call.name.trim() : "";
    const argsValue = call?.arguments;
    const argumentsValue =
      typeof argsValue === "string"
        ? argsValue
        : argsValue == null
          ? ""
          : JSON.stringify(argsValue);
    if (!id || !name) continue;
    pendingToolCalls.push({
      id,
      name,
      arguments: argumentsValue,
    });
  }
  return {
    stopReason,
    pendingToolCalls,
  };
}
function resolveChatCompletionUsage(result) {
  return toOpenAiChatCompletionsUsage(resolveAgentRunUsage(result));
}
function resolveIncludeUsageForStreaming(payload) {
  const streamOptions = payload.stream_options;
  if (!streamOptions || typeof streamOptions !== "object" || Array.isArray(streamOptions))
    return false;
  return streamOptions.include_usage === true;
}
function resolveResponseFormat(value) {
  if (value == null) return;
  if (typeof value !== "object" || Array.isArray(value))
    throw new Error("response_format must be an object");
  const obj = value;
  const type = obj.type;
  if (type !== "text" && type !== "json_object" && type !== "json_schema")
    throw new Error("response_format.type must be text, json_object, or json_schema");
  return obj;
}
function resolveStopSequences(value) {
  if (value == null) return;
  const list = typeof value === "string" ? [value] : value;
  if (!Array.isArray(list)) throw new Error("stop must be a string or array of strings");
  if (list.length > 4) throw new Error("stop supports at most 4 sequences");
  const sequences = [];
  for (const item of list) {
    if (typeof item !== "string" || item.length === 0)
      throw new Error("stop entries must be non-empty strings");
    sequences.push(item);
  }
  return sequences.length > 0 ? sequences : void 0;
}
function resolveErrorMessage(err) {
  if (err instanceof Error) {
    const message = err.message.trim();
    if (message) return message;
  }
  return String(err);
}
async function handleOpenAiHttpRequest(req, res, opts) {
  const limits = resolveOpenAiChatCompletionsLimits(opts.config);
  const handled = await handleGatewayPostJsonEndpoint(req, res, {
    pathname: "/v1/chat/completions",
    requiredOperatorMethod: "chat.send",
    resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
    auth: opts.auth,
    trustedProxies: opts.trustedProxies,
    allowRealIpFallback: opts.allowRealIpFallback,
    rateLimiter: opts.rateLimiter,
    maxBodyBytes: opts.maxBodyBytes ?? limits.maxBodyBytes,
  });
  if (handled === false) return false;
  if (!handled) return true;
  const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
  if (!modelOverrideAuth.allowed) {
    sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
    return true;
  }
  const payload = coerceRequest(handled.body);
  const stream = Boolean(payload.stream);
  const streamIncludeUsage = stream && resolveIncludeUsageForStreaming(payload);
  const model = typeof payload.model === "string" ? payload.model : "openclaw";
  const user = typeof payload.user === "string" ? payload.user : void 0;
  const maxTokens =
    typeof payload.max_completion_tokens === "number"
      ? payload.max_completion_tokens
      : typeof payload.max_tokens === "number"
        ? payload.max_tokens
        : void 0;
  const temperature = typeof payload.temperature === "number" ? payload.temperature : void 0;
  const topP = typeof payload.top_p === "number" ? payload.top_p : void 0;
  const frequencyPenalty =
    typeof payload.frequency_penalty === "number" ? payload.frequency_penalty : void 0;
  const presencePenalty =
    typeof payload.presence_penalty === "number" ? payload.presence_penalty : void 0;
  const seed = typeof payload.seed === "number" ? payload.seed : void 0;
  let responseFormat;
  try {
    responseFormat = resolveResponseFormat(payload.response_format);
  } catch (err) {
    sendJson(res, 400, {
      error: {
        message: `Invalid response_format: ${resolveErrorMessage(err)}`,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  let stop;
  try {
    stop = resolveStopSequences(payload.stop);
  } catch (err) {
    sendJson(res, 400, {
      error: {
        message: `Invalid stop: ${resolveErrorMessage(err)}`,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const samplingError = validateOpenAiSamplingParams({
    temperature: payload.temperature,
    topP: payload.top_p,
    frequencyPenalty: payload.frequency_penalty,
    presencePenalty: payload.presence_penalty,
    seed: payload.seed,
  });
  if (samplingError) {
    sendJson(res, 400, {
      error: {
        message: samplingError,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const streamParams =
    maxTokens !== void 0 ||
    temperature !== void 0 ||
    topP !== void 0 ||
    responseFormat !== void 0 ||
    frequencyPenalty !== void 0 ||
    presencePenalty !== void 0 ||
    seed !== void 0 ||
    stop !== void 0
      ? {
          ...(maxTokens !== void 0 ? { maxTokens } : {}),
          ...(temperature !== void 0 ? { temperature } : {}),
          ...(topP !== void 0 ? { topP } : {}),
          ...(responseFormat !== void 0 ? { responseFormat } : {}),
          ...(frequencyPenalty !== void 0 ? { frequencyPenalty } : {}),
          ...(presencePenalty !== void 0 ? { presencePenalty } : {}),
          ...(seed !== void 0 ? { seed } : {}),
          ...(stop !== void 0 ? { stop } : {}),
        }
      : void 0;
  let agentId;
  let sessionKey;
  let messageChannel;
  try {
    ({ agentId, sessionKey, messageChannel } = resolveGatewayRequestContext({
      req,
      model,
      user,
      sessionPrefix: "openai",
      defaultMessageChannel: "webchat",
      useMessageChannelHeader: true,
    }));
  } catch (err) {
    if (isUnknownGatewayAgentError(err) || isGatewaySessionKeyOverrideError(err)) {
      sendJson(res, 400, {
        error: {
          message: err.message,
          type: "invalid_request_error",
        },
      });
      return true;
    }
    throw err;
  }
  const { modelOverride, errorMessage: modelError } = await resolveOpenAiCompatModelOverride({
    req,
    agentId,
    model,
  });
  if (modelError) {
    sendJson(res, 400, {
      error: {
        message: modelError,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const activeTurnContext = resolveActiveTurnContext(payload.messages);
  const prompt = buildAgentPrompt(payload.messages, activeTurnContext.activeUserMessageIndex);
  let resolvedClientTools;
  let toolChoicePrompt;
  let toolChoiceConstraint;
  try {
    const toolChoiceResult = applyChatToolChoice({
      tools: extractClientToolsFromChatRequest(payload.tools),
      toolChoice: payload.tool_choice,
    });
    resolvedClientTools = toolChoiceResult.tools;
    toolChoicePrompt = toolChoiceResult.extraSystemPrompt;
    toolChoiceConstraint = toolChoiceResult.constraint;
  } catch (err) {
    sendJson(res, 400, {
      error: {
        message: `Invalid tools/tool_choice: ${resolveErrorMessage(err)}`,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  let images;
  try {
    images = await resolveImagesForRequest(activeTurnContext, limits);
  } catch (err) {
    logWarn(`openai-compat: invalid image_url content: ${String(err)}`);
    sendJson(res, 400, {
      error: {
        message: "Invalid image_url content in `messages`.",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  if (!prompt.message && images.length === 0) {
    sendJson(res, 400, {
      error: {
        message: "Missing user message in `messages`.",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const runId = `chatcmpl_${randomUUID()}`;
  const deps = createDefaultDeps();
  const abortController = new AbortController();
  const mergedExtraSystemPrompt = [prompt.extraSystemPrompt, toolChoicePrompt]
    .filter((part) => Boolean(part))
    .join("\n\n");
  const commandInput = buildAgentCommandInput({
    prompt: {
      message: prompt.message,
      extraSystemPrompt: mergedExtraSystemPrompt || void 0,
      images: images.length > 0 ? images : void 0,
    },
    clientTools: resolvedClientTools.length > 0 ? resolvedClientTools : void 0,
    modelOverride,
    sessionKey,
    runId,
    messageChannel,
    abortSignal: abortController.signal,
    streamParams,
  });
  if (!stream) {
    const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
    try {
      const result = await agentCommandFromIngress(commandInput, defaultRuntime, deps);
      if (abortController.signal.aborted) return true;
      const usage = resolveChatCompletionUsage(result);
      const meta = result?.meta;
      const { stopReason, pendingToolCalls } = resolveStopReasonAndPendingToolCalls(meta);
      if (
        toolChoiceConstraint &&
        !isToolChoiceConstraintSatisfied({
          constraint: toolChoiceConstraint,
          pendingToolCalls,
        })
      ) {
        sendJson(res, 502, {
          error: {
            message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint),
            type: "api_error",
          },
        });
        return true;
      }
      if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
        const commentary = resolveAgentResponseCommentary(result);
        sendJson(res, 200, {
          id: runId,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1e3),
          model,
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: commentary,
                tool_calls: pendingToolCalls.map((call) => ({
                  id: call.id,
                  type: "function",
                  function: {
                    name: call.name,
                    arguments: call.arguments,
                  },
                })),
              },
              finish_reason: "tool_calls",
            },
          ],
          usage,
        });
        return true;
      }
      const content = resolveAgentResponseText(result);
      sendJson(res, 200, {
        id: runId,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1e3),
        model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content,
            },
            finish_reason: "stop",
          },
        ],
        usage,
      });
    } catch (err) {
      if (abortController.signal.aborted) return true;
      logWarn(`openai-compat: chat completion failed: ${String(err)}`);
      if (isClientToolNameConflictError(err)) {
        sendJson(res, 400, {
          error: {
            message: "invalid tool configuration",
            type: "invalid_request_error",
          },
        });
        return true;
      }
      const mapped = resolveOpenAiCompatError(err);
      if (mapped) {
        sendJson(res, mapped.status, { error: mapped.error });
        return true;
      }
      sendJson(res, 500, {
        error: {
          message: "internal error",
          type: "api_error",
        },
      });
    } finally {
      stopWatchingDisconnect();
    }
    return true;
  }
  setSseHeaders(res);
  let wroteRole = false;
  let wroteStopChunk = false;
  let sawAssistantDelta = false;
  let bufferedAssistantContent = "";
  let bufferedReplaceableAssistantContent = "";
  let finalUsage;
  let finalizeRequested = false;
  let finalizeFinishReason = "stop";
  let resultResolved = false;
  let closed = false;
  let stopWatchingDisconnect = () => {};
  const maybeFinalize = () => {
    if (closed || !finalizeRequested) return;
    if (!resultResolved) return;
    if (streamIncludeUsage && !finalUsage) return;
    closed = true;
    stopWatchingDisconnect();
    unsubscribe();
    if (!wroteStopChunk) {
      writeAssistantFinishChunk(res, {
        runId,
        model,
        finishReason: finalizeFinishReason,
      });
      wroteStopChunk = true;
    }
    if (streamIncludeUsage && finalUsage)
      writeUsageChunk(res, {
        runId,
        model,
        usage: finalUsage,
      });
    writeDone(res);
    res.end();
  };
  const requestFinalize = (finishReason = "stop") => {
    finalizeFinishReason = finishReason;
    finalizeRequested = true;
    maybeFinalize();
  };
  const unsubscribe = onAgentEvent((evt) => {
    if (evt.runId !== runId) return;
    if (closed) return;
    if (evt.stream === "assistant") {
      const text = evt.data?.text;
      if (evt.data?.replace === true && typeof text === "string")
        bufferedReplaceableAssistantContent = text;
      if (isReplaceableAssistantStreamEvent(evt)) {
        const snapshot = resolveAssistantStreamSnapshotText(evt);
        if (snapshot) bufferedReplaceableAssistantContent = snapshot;
        return;
      }
      const content = resolveAssistantStreamDeltaText(evt) ?? "";
      if (!content) return;
      if (toolChoiceConstraint) {
        bufferedAssistantContent += content;
        return;
      }
      if (!wroteRole) {
        wroteRole = true;
        writeAssistantRoleChunk(res, {
          runId,
          model,
        });
      }
      sawAssistantDelta = true;
      writeAssistantContentChunk(res, {
        runId,
        model,
        content,
        finishReason: null,
      });
      return;
    }
    if (evt.stream === "lifecycle") {
      const phase = evt.data?.phase;
      if (phase === "end" || phase === "error") requestFinalize();
    }
  });
  stopWatchingDisconnect = watchClientDisconnect(req, res, abortController, () => {
    closed = true;
    unsubscribe();
  });
  wroteRole = true;
  writeAssistantRoleChunk(res, {
    runId,
    model,
  });
  runWithGatewayIndependentRootWorkContinuation(async () => {
    try {
      const result = await agentCommandFromIngress(commandInput, defaultRuntime, deps);
      resultResolved = true;
      if (closed) return;
      finalUsage = resolveChatCompletionUsage(result);
      const meta = result?.meta;
      const { stopReason, pendingToolCalls } = resolveStopReasonAndPendingToolCalls(meta);
      if (
        toolChoiceConstraint &&
        !isToolChoiceConstraintSatisfied({
          constraint: toolChoiceConstraint,
          pendingToolCalls,
        })
      ) {
        closed = true;
        stopWatchingDisconnect();
        unsubscribe();
        writeSse(res, {
          error: {
            message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint),
            type: "api_error",
          },
        });
        writeDone(res);
        res.end();
        return;
      }
      if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
        if (!wroteRole) {
          wroteRole = true;
          writeAssistantRoleChunk(res, {
            runId,
            model,
          });
        }
        if (!sawAssistantDelta) {
          const commentary =
            bufferedAssistantContent ||
            resolveAgentResponseCommentary(result) ||
            bufferedReplaceableAssistantContent;
          if (commentary) {
            sawAssistantDelta = true;
            writeAssistantContentChunk(res, {
              runId,
              model,
              content: commentary,
              finishReason: null,
            });
          }
        }
        writeAssistantToolCallsIncrementalChunks(res, {
          runId,
          model,
          toolCalls: pendingToolCalls,
        });
        requestFinalize("tool_calls");
        return;
      }
      if (!sawAssistantDelta) {
        if (!wroteRole) {
          wroteRole = true;
          writeAssistantRoleChunk(res, {
            runId,
            model,
          });
        }
        const content =
          resolveAgentResponseCommentary(result) ||
          bufferedReplaceableAssistantContent ||
          resolveAgentResponseText(result) ||
          "No response from OpenClaw.";
        sawAssistantDelta = true;
        writeAssistantContentChunk(res, {
          runId,
          model,
          content,
          finishReason: null,
        });
      }
      requestFinalize();
    } catch (err) {
      resultResolved = true;
      if (closed || abortController.signal.aborted) return;
      logWarn(`openai-compat: streaming chat completion failed: ${String(err)}`);
      if (isClientToolNameConflictError(err)) {
        closed = true;
        stopWatchingDisconnect();
        unsubscribe();
        writeSse(res, {
          error: {
            message: "invalid tool configuration",
            type: "invalid_request_error",
          },
        });
        writeDone(res);
        res.end();
        return;
      }
      const mapped = resolveOpenAiCompatError(err);
      if (mapped) {
        closed = true;
        stopWatchingDisconnect();
        unsubscribe();
        writeSse(res, { error: mapped.error });
        writeDone(res);
        res.end();
        return;
      }
      writeAssistantContentChunk(res, {
        runId,
        model,
        content: "Error: internal error",
        finishReason: "stop",
      });
      wroteStopChunk = true;
      finalUsage = {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };
      emitAgentEvent({
        runId,
        stream: "lifecycle",
        data: { phase: "error" },
      });
      requestFinalize();
    } finally {
      if (!closed)
        emitAgentEvent({
          runId,
          stream: "lifecycle",
          data: { phase: "end" },
        });
    }
  });
  return true;
}
//#endregion
export { testOnlyOpenAiHttp as n, handleOpenAiHttpRequest as t };
