import { createHash, randomUUID } from "node:crypto";
import { n as agentCommandFromIngress } from "./agent-command-CxzoW4-d.js";
import { c as emitAgentEvent, v as onAgentEvent } from "./agent-events-D4UsOPeT.js";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-BdyK5IN2.js";
import { n as ZodIssueCode } from "./compat-Ci0Yc9vr.js";
import { t as createDefaultDeps } from "./deps-BDX9tA_j.js";
import { a as wrapExternalContent } from "./external-content-rRQGoatE.js";
import { t as renderFileContextBlock } from "./file-context-DxYRAeM2.js";
import { p as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-yGjmBAjy.js";
import {
  a as getBearerToken,
  n as authorizeOpenAiCompatibleHttpModelOverride,
  o as getHeader,
  u as resolveOpenAiCompatibleHttpOperatorScopes,
} from "./http-auth-utils-Cm6rPa7b.js";
import {
  a as sendJson,
  d as setSseHeaders,
  f as watchClientDisconnect,
  p as writeDone,
  s as sendMissingScopeForbidden,
} from "./http-common-Czxz795c.js";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-4-WwJuzP.js";
import {
  a as resolveAgentIdForRequest,
  c as resolveOpenAiCompatModelOverride,
  i as isUnknownGatewayAgentError,
  r as isGatewaySessionKeyOverrideError,
  s as resolveGatewayRequestContext,
} from "./http-utils-B3cLzhCe.js";
import "./agent-DzWgmb_I.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
import {
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
  f as extractFileContentFromSource,
  g as resolveInputFileLimits,
  m as normalizeMimeList,
  p as extractImageContentFromSource,
  u as DEFAULT_INPUT_IMAGE_MIMES,
} from "./runner.entries-BYq5cGUt.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  At as boolean,
  Bt as discriminatedUnion,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  Zn as unknown,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
//#region src/gateway/open-responses.schema.ts
/**
 * OpenResponses API Zod Schemas
 *
 * Zod schemas for the OpenResponses `/v1/responses` endpoint.
 * This module is isolated from gateway imports to enable future codegen and prevent drift.
 *
 * @see https://www.open-responses.com/
 */
const InputTextContentPartSchema = object({
  type: literal("input_text"),
  text: string(),
}).strict();
const OutputTextContentPartSchema = object({
  type: literal("output_text"),
  text: string(),
}).strict();
const InputImageSourceSchema = discriminatedUnion("type", [
  object({
    type: literal("url"),
    url: string().url(),
  }),
  object({
    type: literal("base64"),
    media_type: _enum([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ]),
    data: string().min(1),
  }),
]);
const InputImageContentPartSchema = object({
  type: literal("input_image"),
  source: InputImageSourceSchema,
}).strict();
const InputFileSourceSchema = discriminatedUnion("type", [
  object({
    type: literal("url"),
    url: string().url(),
  }),
  object({
    type: literal("base64"),
    media_type: string().min(1),
    data: string().min(1),
    filename: string().optional(),
  }),
]);
const ContentPartSchema = discriminatedUnion("type", [
  InputTextContentPartSchema,
  OutputTextContentPartSchema,
  InputImageContentPartSchema,
  object({
    type: literal("input_file"),
    source: InputFileSourceSchema,
  }).strict(),
]);
const MessageItemRoleSchema = _enum(["system", "developer", "user", "assistant"]);
const AssistantPhaseSchema = _enum(["commentary", "final_answer"]);
const ItemParamSchema = discriminatedUnion("type", [
  object({
    type: literal("message"),
    role: MessageItemRoleSchema,
    content: union([string(), array(ContentPartSchema)]),
    phase: AssistantPhaseSchema.optional(),
  })
    .strict()
    .superRefine((value, ctx) => {
      if (value.phase !== void 0 && value.role !== "assistant")
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["phase"],
          message: "`phase` is only valid on assistant messages.",
        });
    }),
  object({
    type: literal("function_call"),
    id: string().optional(),
    call_id: string().optional(),
    name: string(),
    arguments: string(),
  }).strict(),
  object({
    type: literal("function_call_output"),
    call_id: string(),
    output: string(),
  }).strict(),
  object({
    type: literal("reasoning"),
    content: string().optional(),
    encrypted_content: string().optional(),
    summary: string().optional(),
  }).strict(),
  object({
    type: literal("item_reference"),
    id: string(),
  }).strict(),
]);
const ToolDefinitionSchema = object({
  type: literal("function"),
  name: string().min(1, "Tool name cannot be empty"),
  description: string().optional(),
  parameters: record(string(), unknown()).optional(),
  strict: boolean().optional(),
}).strict();
const ToolChoiceSchema = union([
  literal("auto"),
  literal("none"),
  literal("required"),
  object({
    type: literal("function"),
    name: string().min(1),
  }).strict(),
  object({
    type: literal("function"),
    function: object({ name: string().min(1) }),
  }).strict(),
]);
const CreateResponseBodySchema = object({
  model: string(),
  input: union([string(), array(ItemParamSchema)]),
  instructions: string().optional(),
  tools: array(ToolDefinitionSchema).optional(),
  tool_choice: ToolChoiceSchema.optional(),
  stream: boolean().optional(),
  max_output_tokens: number().int().positive().optional(),
  max_tool_calls: number().int().positive().optional(),
  user: string().optional(),
  temperature: number().min(0).max(2).optional(),
  top_p: number().min(0).max(1).optional(),
  metadata: record(string(), string()).optional(),
  store: boolean().optional(),
  previous_response_id: string().optional(),
  reasoning: object({
    effort: _enum(["low", "medium", "high"]).optional(),
    summary: _enum(["auto", "concise", "detailed"]).optional(),
  }).optional(),
  truncation: _enum(["auto", "disabled"]).optional(),
}).strict();
const ResponseStatusSchema = _enum([
  "in_progress",
  "completed",
  "failed",
  "cancelled",
  "incomplete",
]);
const OutputItemSchema = discriminatedUnion("type", [
  object({
    type: literal("message"),
    id: string(),
    role: literal("assistant"),
    content: array(OutputTextContentPartSchema),
    phase: AssistantPhaseSchema.optional(),
    status: _enum(["in_progress", "completed"]).optional(),
  }).strict(),
  object({
    type: literal("function_call"),
    id: string(),
    call_id: string(),
    name: string(),
    arguments: string(),
    status: _enum(["in_progress", "completed"]).optional(),
  }).strict(),
  object({
    type: literal("reasoning"),
    id: string(),
    content: string().optional(),
    summary: string().optional(),
  }).strict(),
]);
const UsageSchema = object({
  input_tokens: number().int().nonnegative(),
  output_tokens: number().int().nonnegative(),
  total_tokens: number().int().nonnegative(),
});
const ResponseResourceSchema = object({
  id: string(),
  object: literal("response"),
  created_at: number().int(),
  status: ResponseStatusSchema,
  model: string(),
  output: array(OutputItemSchema),
  usage: UsageSchema,
  error: object({
    code: string(),
    message: string(),
  }).optional(),
});
object({
  type: literal("response.created"),
  response: ResponseResourceSchema,
});
object({
  type: literal("response.in_progress"),
  response: ResponseResourceSchema,
});
object({
  type: literal("response.completed"),
  response: ResponseResourceSchema,
});
object({
  type: literal("response.failed"),
  response: ResponseResourceSchema,
});
object({
  type: literal("response.output_item.added"),
  output_index: number().int().nonnegative(),
  item: OutputItemSchema,
});
object({
  type: literal("response.output_item.done"),
  output_index: number().int().nonnegative(),
  item: OutputItemSchema,
});
object({
  type: literal("response.content_part.added"),
  item_id: string(),
  output_index: number().int().nonnegative(),
  content_index: number().int().nonnegative(),
  part: OutputTextContentPartSchema,
});
object({
  type: literal("response.content_part.done"),
  item_id: string(),
  output_index: number().int().nonnegative(),
  content_index: number().int().nonnegative(),
  part: OutputTextContentPartSchema,
});
object({
  type: literal("response.output_text.delta"),
  item_id: string(),
  output_index: number().int().nonnegative(),
  content_index: number().int().nonnegative(),
  delta: string(),
});
object({
  type: literal("response.output_text.done"),
  item_id: string(),
  output_index: number().int().nonnegative(),
  content_index: number().int().nonnegative(),
  text: string(),
});
//#endregion
//#region src/gateway/openresponses-file-content.ts
/** Wraps untrusted file content for OpenResponses input blocks. */
function wrapUntrustedFileContent(content) {
  return wrapExternalContent(content, {
    source: "unknown",
    includeWarning: false,
  });
}
//#endregion
//#region src/gateway/openresponses-prompt.ts
const FILE_ONLY_USER_MESSAGE = "User sent file(s) with no text.";
function extractTextContent(content) {
  if (typeof content === "string") return content;
  return content
    .map((part) => {
      if (part.type === "input_text") return part.text;
      if (part.type === "output_text") return part.text;
      return "";
    })
    .filter(Boolean)
    .join("\n");
}
function hasImageContent(content) {
  return typeof content !== "string" && content.some((part) => part.type === "input_image");
}
function hasFileContent(content) {
  return typeof content !== "string" && content.some((part) => part.type === "input_file");
}
function placeholderForActiveTurn(content) {
  if (hasImageContent(content)) return IMAGE_ONLY_USER_MESSAGE;
  if (hasFileContent(content)) return FILE_ONLY_USER_MESSAGE;
  return "";
}
/** Index of the last user message item, or -1 when there is none. */
function findActiveUserMessageIndex(input) {
  for (let i = input.length - 1; i >= 0; i -= 1) {
    const item = input[i];
    if (item?.type === "message" && item.role === "user") return i;
  }
  return -1;
}
/** Build the user message and optional system prompt from Responses API input. */
function buildAgentPrompt(input) {
  if (typeof input === "string") return { message: input };
  const systemParts = [];
  const conversationEntries = [];
  const activeUserMessageIndex = findActiveUserMessageIndex(input);
  for (const [i, item] of input.entries())
    if (item.type === "message") {
      const body =
        extractTextContent(item.content).trim() ||
        (item.role === "user" && i === activeUserMessageIndex
          ? placeholderForActiveTurn(item.content)
          : "");
      if (!body) continue;
      if (item.role === "system" || item.role === "developer") {
        systemParts.push(body);
        continue;
      }
      const normalizedRole = item.role === "assistant" ? "assistant" : "user";
      const sender = normalizedRole === "assistant" ? "Assistant" : "User";
      conversationEntries.push({
        role: normalizedRole,
        entry: {
          sender,
          body,
        },
      });
    } else if (item.type === "function_call_output")
      conversationEntries.push({
        role: "tool",
        entry: {
          sender: `Tool:${item.call_id}`,
          body: item.output,
        },
      });
  return {
    message: buildAgentMessageFromConversationEntries(conversationEntries),
    extraSystemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0,
  };
}
//#endregion
//#region src/gateway/openresponses-shape.ts
/** Creates an assistant output message item for OpenResponses-compatible responses. */
function createAssistantOutputItem(params) {
  return {
    type: "message",
    id: params.id,
    role: "assistant",
    content: [
      {
        type: "output_text",
        text: params.text,
      },
    ],
    ...(params.phase ? { phase: params.phase } : {}),
    status: params.status,
  };
}
/** Creates a function-call output item for OpenResponses-compatible responses. */
function createFunctionCallOutputItem(params) {
  return {
    type: "function_call",
    id: params.id,
    call_id: params.callId,
    name: params.name,
    arguments: params.arguments,
    status: params.status,
  };
}
//#endregion
//#region src/gateway/openresponses-http.ts
/**
 * OpenResponses HTTP Handler
 *
 * Implements the OpenResponses `/v1/responses` endpoint for OpenClaw Gateway.
 *
 * @see https://www.open-responses.com/
 */
const DEFAULT_BODY_BYTES = 20 * 1024 * 1024;
const DEFAULT_MAX_URL_PARTS = 8;
const RESPONSE_SESSION_TTL_MS = 1800 * 1e3;
const MAX_RESPONSE_SESSION_ENTRIES = 500;
const responseSessionMap = /* @__PURE__ */ new Map();
function normalizeResponseSessionScope(scope) {
  const authSubject = scope.authSubject.trim();
  const requestedSessionKey = scope.requestedSessionKey?.trim();
  return {
    authSubject,
    agentId: scope.agentId,
    requestedSessionKey: requestedSessionKey || void 0,
  };
}
function resolveResponseSessionAuthSubject(params) {
  const bearer = getBearerToken(params.req);
  if (bearer) return `bearer:${createHash("sha256").update(bearer).digest("hex")}`;
  if (params.auth.mode === "trusted-proxy" && params.auth.trustedProxy?.userHeader) {
    const user = getHeader(params.req, params.auth.trustedProxy.userHeader)?.trim();
    if (user) return `trusted-proxy:${user}`;
  }
  return `gateway-auth:${params.auth.mode}`;
}
function createResponseSessionScope(params) {
  return normalizeResponseSessionScope({
    authSubject: resolveResponseSessionAuthSubject({
      req: params.req,
      auth: params.auth,
    }),
    agentId: params.agentId,
    requestedSessionKey: getHeader(params.req, "x-openclaw-session-key"),
  });
}
function matchesResponseSessionScope(entry, scope) {
  return (
    entry.authSubject === scope.authSubject &&
    entry.agentId === scope.agentId &&
    entry.requestedSessionKey === scope.requestedSessionKey
  );
}
function pruneExpiredResponseSessions(now) {
  while (responseSessionMap.size > 0) {
    const oldest = responseSessionMap.entries().next().value;
    if (!oldest) return;
    const [oldestKey, oldestValue] = oldest;
    if (now - oldestValue.ts <= RESPONSE_SESSION_TTL_MS) return;
    responseSessionMap.delete(oldestKey);
  }
}
function evictOverflowResponseSessions() {
  while (responseSessionMap.size > MAX_RESPONSE_SESSION_ENTRIES) {
    const oldestKey = responseSessionMap.keys().next().value;
    if (!oldestKey) return;
    responseSessionMap.delete(oldestKey);
  }
}
function storeResponseSession(responseId, sessionKey, scope, now = Date.now()) {
  responseSessionMap.delete(responseId);
  responseSessionMap.set(responseId, {
    ...scope,
    sessionKey,
    ts: now,
  });
  pruneExpiredResponseSessions(now);
  evictOverflowResponseSessions();
}
function lookupResponseSession(responseId, scope, now = Date.now()) {
  if (!responseId) return;
  const entry = responseSessionMap.get(responseId);
  if (!entry) return;
  if (now - entry.ts > RESPONSE_SESSION_TTL_MS) {
    responseSessionMap.delete(responseId);
    return;
  }
  if (!matchesResponseSessionScope(entry, scope)) return;
  return entry.sessionKey;
}
const testing = {
  resetResponseSessionState() {
    responseSessionMap.clear();
  },
  wrapUntrustedFileContent,
  storeResponseSessionAt(
    responseId,
    sessionKey,
    now,
    scope = {
      authSubject: "test",
      agentId: "main",
    },
  ) {
    storeResponseSession(responseId, sessionKey, normalizeResponseSessionScope(scope), now);
  },
  lookupResponseSessionAt(
    responseId,
    now,
    scope = {
      authSubject: "test",
      agentId: "main",
    },
  ) {
    return lookupResponseSession(responseId, normalizeResponseSessionScope(scope), now);
  },
  getResponseSessionIds() {
    return [...responseSessionMap.keys()];
  },
  resolveResponsesLimits,
};
function writeSseEvent(res, event) {
  res.write(`event: ${event.type}\n`);
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}
function resolveResponsesLimits(config) {
  const files = config?.files;
  const images = config?.images;
  const fileLimits = resolveInputFileLimits(files);
  return {
    maxBodyBytes: config?.maxBodyBytes ?? DEFAULT_BODY_BYTES,
    maxUrlParts: resolveIntegerOption(config?.maxUrlParts, DEFAULT_MAX_URL_PARTS, { min: 0 }),
    files: {
      ...fileLimits,
      urlAllowlist: normalizeInputHostnameAllowlist(files?.urlAllowlist),
    },
    images: {
      allowUrl: images?.allowUrl ?? true,
      urlAllowlist: normalizeInputHostnameAllowlist(images?.urlAllowlist),
      allowedMimes: normalizeMimeList(images?.allowedMimes, DEFAULT_INPUT_IMAGE_MIMES),
      maxBytes: images?.maxBytes ?? 10485760,
      maxRedirects: images?.maxRedirects ?? 3,
      timeoutMs: images?.timeoutMs ?? 1e4,
    },
  };
}
function extractClientTools(body) {
  return (body.tools ?? []).map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      strict: tool.strict,
    },
  }));
}
function applyToolChoice(params) {
  const { tools, toolChoice } = params;
  if (!toolChoice) return { tools };
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
  if (typeof toolChoice === "object" && toolChoice.type === "function") {
    const targetName = ("name" in toolChoice ? toolChoice.name : toolChoice.function.name).trim();
    if (!targetName) throw new Error("tool_choice.name is required");
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
  return { tools };
}
function createEmptyUsage() {
  return {
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0,
  };
}
function toUsage(value) {
  if (!value) return createEmptyUsage();
  const input = value.input ?? 0;
  const output = value.output ?? 0;
  const cacheRead = value.cacheRead ?? 0;
  const cacheWrite = value.cacheWrite ?? 0;
  const total = value.total ?? input + output + cacheRead + cacheWrite;
  return {
    input_tokens: Math.max(0, input),
    output_tokens: Math.max(0, output),
    total_tokens: Math.max(0, total),
  };
}
function extractUsageFromResult(result) {
  const meta = result?.meta;
  return toUsage(meta && typeof meta === "object" ? meta.agentMeta?.usage : void 0);
}
function resolveStopReasonAndPendingToolCalls(meta) {
  if (!meta || typeof meta !== "object")
    return {
      stopReason: void 0,
      pendingToolCalls: void 0,
    };
  const record = meta;
  return {
    stopReason: record.stopReason,
    pendingToolCalls: record.pendingToolCalls,
  };
}
function createResponseResource(params) {
  return {
    id: params.id,
    object: "response",
    created_at: Math.floor(Date.now() / 1e3),
    status: params.status,
    model: params.model,
    output: params.output,
    usage: params.usage ?? createEmptyUsage(),
    error: params.error,
  };
}
async function runResponsesAgentCommand(params) {
  return agentCommandFromIngress(
    {
      message: params.message,
      images: params.images.length > 0 ? params.images : void 0,
      clientTools: params.clientTools.length > 0 ? params.clientTools : void 0,
      extraSystemPrompt: params.extraSystemPrompt || void 0,
      model: params.modelOverride,
      streamParams: params.streamParams ?? void 0,
      sessionKey: params.sessionKey,
      runId: params.runId,
      deliver: false,
      messageChannel: params.messageChannel,
      bestEffortDeliver: false,
      allowModelOverride: params.modelOverride !== void 0,
      abortSignal: params.abortSignal,
    },
    defaultRuntime,
    params.deps,
  );
}
async function handleOpenResponsesHttpRequest(req, res, opts) {
  const limits = resolveResponsesLimits(opts.config);
  const maxBodyBytes =
    opts.maxBodyBytes ??
    (opts.config?.maxBodyBytes
      ? limits.maxBodyBytes
      : Math.max(limits.maxBodyBytes, limits.files.maxBytes * 2, limits.images.maxBytes * 2));
  const handled = await handleGatewayPostJsonEndpoint(req, res, {
    pathname: "/v1/responses",
    requiredOperatorMethod: "chat.send",
    resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
    auth: opts.auth,
    trustedProxies: opts.trustedProxies,
    allowRealIpFallback: opts.allowRealIpFallback,
    rateLimiter: opts.rateLimiter,
    maxBodyBytes,
  });
  if (handled === false) return false;
  if (!handled) return true;
  const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
  if (!modelOverrideAuth.allowed) {
    sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
    return true;
  }
  const parseResult = CreateResponseBodySchema.safeParse(handled.body);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    sendJson(res, 400, {
      error: {
        message: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid request body",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const payload = parseResult.data;
  const stream = Boolean(payload.stream);
  const model = payload.model;
  const user = payload.user;
  let agentId;
  try {
    agentId = resolveAgentIdForRequest({
      req,
      model,
    });
  } catch (err) {
    if (isUnknownGatewayAgentError(err)) {
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
  let images = [];
  const fileContexts = [];
  let urlParts = 0;
  const markUrlPart = () => {
    urlParts += 1;
    if (urlParts > limits.maxUrlParts)
      throw new Error(
        `Too many URL-based input sources: ${urlParts} (limit: ${limits.maxUrlParts})`,
      );
  };
  try {
    if (Array.isArray(payload.input)) {
      for (const item of payload.input)
        if (item.type === "message" && typeof item.content !== "string")
          for (const part of item.content) {
            if (part.type === "input_image") {
              const source = part.source;
              const sourceType =
                source.type === "base64" || source.type === "url" ? source.type : void 0;
              if (!sourceType)
                throw new Error("input_image must have 'source.url' or 'source.data'");
              if (sourceType === "url") markUrlPart();
              const image = await extractImageContentFromSource(
                sourceType === "url"
                  ? {
                      type: "url",
                      url: source.url ?? "",
                      mediaType: source.media_type,
                    }
                  : {
                      type: "base64",
                      data: source.data ?? "",
                      mediaType: source.media_type,
                    },
                limits.images,
              );
              images.push(image);
              continue;
            }
            if (part.type === "input_file") {
              const source = part.source;
              const sourceType =
                source.type === "base64" || source.type === "url" ? source.type : void 0;
              if (!sourceType)
                throw new Error("input_file must have 'source.url' or 'source.data'");
              if (sourceType === "url") markUrlPart();
              const file = await extractFileContentFromSource({
                source:
                  sourceType === "url"
                    ? {
                        type: "url",
                        url: source.url ?? "",
                        mediaType: source.media_type,
                        filename: source.filename,
                      }
                    : {
                        type: "base64",
                        data: source.data ?? "",
                        mediaType: source.media_type,
                        filename: source.filename,
                      },
                limits: limits.files,
              });
              const rawText = file.text;
              if (rawText?.trim())
                fileContexts.push(
                  renderFileContextBlock({
                    filename: file.filename,
                    content: wrapUntrustedFileContent(rawText),
                  }),
                );
              else if (file.images && file.images.length > 0)
                fileContexts.push(
                  renderFileContextBlock({
                    filename: file.filename,
                    content: "[PDF content rendered to images]",
                    surroundContentWithNewlines: false,
                  }),
                );
              else
                fileContexts.push(
                  renderFileContextBlock({
                    filename: file.filename,
                    content: "[No extractable text]",
                    surroundContentWithNewlines: false,
                  }),
                );
              if (file.images && file.images.length > 0) images = images.concat(file.images);
            }
          }
    }
  } catch (err) {
    logWarn(`openresponses: request parsing failed: ${String(err)}`);
    sendJson(res, 400, {
      error: {
        message: "invalid request",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const clientTools = extractClientTools(payload);
  let toolChoicePrompt;
  let toolChoiceConstraint;
  let resolvedClientTools = clientTools;
  try {
    const toolChoiceResult = applyToolChoice({
      tools: clientTools,
      toolChoice: payload.tool_choice,
    });
    resolvedClientTools = toolChoiceResult.tools;
    toolChoicePrompt = toolChoiceResult.extraSystemPrompt;
    toolChoiceConstraint = toolChoiceResult.constraint;
  } catch (err) {
    logWarn(`openresponses: tool configuration failed: ${String(err)}`);
    sendJson(res, 400, {
      error: {
        message: "invalid tool configuration",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  let resolved;
  try {
    resolved = resolveGatewayRequestContext({
      req,
      model,
      user,
      sessionPrefix: "openresponses",
      defaultMessageChannel: "webchat",
      useMessageChannelHeader: true,
    });
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
  const responseSessionScope = createResponseSessionScope({
    req,
    auth: opts.auth,
    agentId: resolved.agentId,
  });
  const sessionKey =
    lookupResponseSession(payload.previous_response_id, responseSessionScope) ??
    resolved.sessionKey;
  const messageChannel = resolved.messageChannel;
  const prompt = buildAgentPrompt(payload.input);
  const fileContext = fileContexts.length > 0 ? fileContexts.join("\n\n") : void 0;
  const toolChoiceContext = toolChoicePrompt?.trim();
  const extraSystemPrompt = [
    payload.instructions,
    prompt.extraSystemPrompt,
    toolChoiceContext,
    fileContext,
  ]
    .filter(Boolean)
    .join("\n\n");
  if (!prompt.message) {
    sendJson(res, 400, {
      error: {
        message: "Missing user message in `input`.",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const responseId = `resp_${randomUUID()}`;
  const rememberResponseSession = () =>
    storeResponseSession(responseId, sessionKey, responseSessionScope);
  const outputItemId = `msg_${randomUUID()}`;
  const deps = createDefaultDeps();
  const abortController = new AbortController();
  const streamMaxTokens =
    typeof payload.max_output_tokens === "number" ? payload.max_output_tokens : void 0;
  const streamTemperature = typeof payload.temperature === "number" ? payload.temperature : void 0;
  const streamTopP = typeof payload.top_p === "number" ? payload.top_p : void 0;
  const streamParams =
    streamMaxTokens !== void 0 || streamTemperature !== void 0 || streamTopP !== void 0
      ? {
          ...(streamMaxTokens !== void 0 ? { maxTokens: streamMaxTokens } : {}),
          ...(streamTemperature !== void 0 ? { temperature: streamTemperature } : {}),
          ...(streamTopP !== void 0 ? { topP: streamTopP } : {}),
        }
      : void 0;
  if (!stream) {
    const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
    try {
      const result = await runResponsesAgentCommand({
        message: prompt.message,
        images,
        clientTools: resolvedClientTools,
        extraSystemPrompt,
        modelOverride,
        streamParams,
        sessionKey,
        runId: responseId,
        messageChannel,
        deps,
        abortSignal: abortController.signal,
      });
      if (abortController.signal.aborted) return true;
      const payloads = result?.payloads;
      const usage = extractUsageFromResult(result);
      const meta = result?.meta;
      const { stopReason, pendingToolCalls } = resolveStopReasonAndPendingToolCalls(meta);
      if (
        toolChoiceConstraint &&
        !isToolChoiceConstraintSatisfied({
          constraint: toolChoiceConstraint,
          pendingToolCalls,
        })
      ) {
        const failed = createResponseResource({
          id: responseId,
          model,
          status: "failed",
          output: [],
          error: {
            code: "api_error",
            message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint),
          },
          usage,
        });
        rememberResponseSession();
        sendJson(res, 502, failed);
        return true;
      }
      if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
        const assistantText =
          Array.isArray(payloads) && payloads.length > 0
            ? payloads
                .map((p) => (typeof p.text === "string" ? p.text : ""))
                .filter(Boolean)
                .join("\n\n")
            : "";
        const output = [];
        if (assistantText)
          output.push(
            createAssistantOutputItem({
              id: outputItemId,
              text: assistantText,
              phase: "commentary",
              status: "completed",
            }),
          );
        for (const functionCall of pendingToolCalls)
          output.push(
            createFunctionCallOutputItem({
              id: `call_${randomUUID()}`,
              callId: functionCall.id,
              name: functionCall.name,
              arguments: functionCall.arguments,
            }),
          );
        const response = createResponseResource({
          id: responseId,
          model,
          status: "incomplete",
          output,
          usage,
        });
        rememberResponseSession();
        sendJson(res, 200, response);
        return true;
      }
      const response = createResponseResource({
        id: responseId,
        model,
        status: "completed",
        output: [
          createAssistantOutputItem({
            id: outputItemId,
            text:
              Array.isArray(payloads) && payloads.length > 0
                ? payloads
                    .map((p) => (typeof p.text === "string" ? p.text : ""))
                    .filter(Boolean)
                    .join("\n\n")
                : "No response from OpenClaw.",
            phase: "final_answer",
            status: "completed",
          }),
        ],
        usage,
      });
      rememberResponseSession();
      sendJson(res, 200, response);
    } catch (err) {
      if (abortController.signal.aborted) return true;
      logWarn(`openresponses: non-stream response failed: ${String(err)}`);
      if (isClientToolNameConflictError(err)) {
        sendJson(
          res,
          400,
          createResponseResource({
            id: responseId,
            model,
            status: "failed",
            output: [],
            error: {
              code: "invalid_request_error",
              message: "invalid tool configuration",
            },
          }),
        );
        return true;
      }
      const response = createResponseResource({
        id: responseId,
        model,
        status: "failed",
        output: [],
        error: {
          code: "api_error",
          message: "internal error",
        },
      });
      const mapped = resolveOpenAiCompatError(err);
      if (mapped) {
        const mappedResponse = createResponseResource({
          id: responseId,
          model,
          status: "failed",
          output: [],
          error: {
            code: mapped.error.type,
            message: mapped.error.message,
          },
        });
        rememberResponseSession();
        sendJson(res, mapped.status, mappedResponse);
        return true;
      }
      rememberResponseSession();
      sendJson(res, 500, response);
    } finally {
      stopWatchingDisconnect();
    }
    return true;
  }
  setSseHeaders(res);
  let accumulatedText = "";
  let bufferedReplaceableAssistantContent = "";
  let sawAssistantDelta = false;
  let closed = false;
  let unsubscribe = () => {};
  let stopWatchingDisconnect = () => {};
  let finalUsage;
  let finalizeStatus = null;
  let finalizeRequested = null;
  const maybeFinalize = () => {
    if (closed) return;
    if (!finalizeRequested) return;
    if (!finalUsage) return;
    const usage = finalUsage;
    closed = true;
    stopWatchingDisconnect();
    unsubscribe();
    writeSseEvent(res, {
      type: "response.output_text.done",
      item_id: outputItemId,
      output_index: 0,
      content_index: 0,
      text: finalizeRequested.text,
    });
    writeSseEvent(res, {
      type: "response.content_part.done",
      item_id: outputItemId,
      output_index: 0,
      content_index: 0,
      part: {
        type: "output_text",
        text: finalizeRequested.text,
      },
    });
    const completedItem = createAssistantOutputItem({
      id: outputItemId,
      text: finalizeRequested.text,
      phase: finalizeRequested.status === "completed" ? "final_answer" : "commentary",
      status: "completed",
    });
    writeSseEvent(res, {
      type: "response.output_item.done",
      output_index: 0,
      item: completedItem,
    });
    const finalResponse = createResponseResource({
      id: responseId,
      model,
      status: finalizeRequested.status,
      output: [completedItem],
      usage,
    });
    rememberResponseSession();
    writeSseEvent(res, {
      type: "response.completed",
      response: finalResponse,
    });
    writeDone(res);
    res.end();
  };
  const requestFinalize = (status, text) => {
    if (finalizeRequested) return;
    finalizeStatus = status;
    finalizeRequested = {
      status,
      text,
    };
    maybeFinalize();
  };
  const initialResponse = createResponseResource({
    id: responseId,
    model,
    status: "in_progress",
    output: [],
  });
  writeSseEvent(res, {
    type: "response.created",
    response: initialResponse,
  });
  writeSseEvent(res, {
    type: "response.in_progress",
    response: initialResponse,
  });
  writeSseEvent(res, {
    type: "response.output_item.added",
    output_index: 0,
    item: createAssistantOutputItem({
      id: outputItemId,
      text: "",
      status: "in_progress",
    }),
  });
  writeSseEvent(res, {
    type: "response.content_part.added",
    item_id: outputItemId,
    output_index: 0,
    content_index: 0,
    part: {
      type: "output_text",
      text: "",
    },
  });
  unsubscribe = onAgentEvent((evt) => {
    if (evt.runId !== responseId) return;
    if (closed) return;
    if (evt.stream === "assistant") {
      if (isReplaceableAssistantStreamEvent(evt)) {
        const snapshot = resolveAssistantStreamSnapshotText(evt);
        if (snapshot) bufferedReplaceableAssistantContent = snapshot;
        return;
      }
      const text = evt.data?.text;
      const replace = evt.data?.replace === true;
      const hadAssistantDelta = sawAssistantDelta;
      if (replace && typeof text === "string") accumulatedText = text;
      const content = resolveAssistantStreamDeltaText(evt);
      if (!content) {
        if (
          replace &&
          typeof text === "string" &&
          text &&
          !toolChoiceConstraint &&
          !hadAssistantDelta
        ) {
          sawAssistantDelta = true;
          writeSseEvent(res, {
            type: "response.output_text.delta",
            item_id: outputItemId,
            output_index: 0,
            content_index: 0,
            delta: text,
          });
        }
        return;
      }
      if (toolChoiceConstraint) {
        accumulatedText += content;
        return;
      }
      sawAssistantDelta = true;
      accumulatedText += content;
      writeSseEvent(res, {
        type: "response.output_text.delta",
        item_id: outputItemId,
        output_index: 0,
        content_index: 0,
        delta: content,
      });
      return;
    }
    if (evt.stream === "lifecycle") {
      const phase = evt.data?.phase;
      if (phase === "end" || phase === "error")
        requestFinalize(
          phase === "error" ? "failed" : "completed",
          accumulatedText || bufferedReplaceableAssistantContent || "No response from OpenClaw.",
        );
    }
  });
  stopWatchingDisconnect = watchClientDisconnect(req, res, abortController, () => {
    closed = true;
    unsubscribe();
  });
  runWithGatewayIndependentRootWorkContinuation(async () => {
    try {
      const result = await runResponsesAgentCommand({
        message: prompt.message,
        images,
        clientTools: resolvedClientTools,
        extraSystemPrompt,
        modelOverride,
        streamParams,
        sessionKey,
        runId: responseId,
        messageChannel,
        deps,
        abortSignal: abortController.signal,
      });
      finalUsage = extractUsageFromResult(result);
      const resultAny = result;
      const resultPayloadText = Array.isArray(resultAny.payloads)
        ? resultAny.payloads
            .map((p) => (typeof p.text === "string" ? p.text : ""))
            .filter(Boolean)
            .join("\n\n")
        : "";
      const meta = resultAny.meta;
      const { stopReason, pendingToolCalls } = resolveStopReasonAndPendingToolCalls(meta);
      if (
        !closed &&
        toolChoiceConstraint &&
        !isToolChoiceConstraintSatisfied({
          constraint: toolChoiceConstraint,
          pendingToolCalls,
        })
      ) {
        const failed = createResponseResource({
          id: responseId,
          model,
          status: "failed",
          output: [],
          error: {
            code: "api_error",
            message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint),
          },
          usage: finalUsage ?? createEmptyUsage(),
        });
        closed = true;
        stopWatchingDisconnect();
        unsubscribe();
        rememberResponseSession();
        writeSseEvent(res, {
          type: "response.failed",
          response: failed,
        });
        writeDone(res);
        res.end();
        return;
      }
      if (
        !closed &&
        stopReason === "tool_calls" &&
        pendingToolCalls &&
        pendingToolCalls.length > 0
      ) {
        const usage = finalUsage ?? createEmptyUsage();
        const finalText =
          accumulatedText || resultPayloadText || bufferedReplaceableAssistantContent;
        if (toolChoiceConstraint && finalText && !sawAssistantDelta) {
          sawAssistantDelta = true;
          writeSseEvent(res, {
            type: "response.output_text.delta",
            item_id: outputItemId,
            output_index: 0,
            content_index: 0,
            delta: finalText,
          });
        }
        writeSseEvent(res, {
          type: "response.output_text.done",
          item_id: outputItemId,
          output_index: 0,
          content_index: 0,
          text: finalText,
        });
        writeSseEvent(res, {
          type: "response.content_part.done",
          item_id: outputItemId,
          output_index: 0,
          content_index: 0,
          part: {
            type: "output_text",
            text: finalText,
          },
        });
        const completedItem = createAssistantOutputItem({
          id: outputItemId,
          text: finalText,
          phase: "commentary",
          status: "completed",
        });
        writeSseEvent(res, {
          type: "response.output_item.done",
          output_index: 0,
          item: completedItem,
        });
        const functionCallItems = [];
        let nextStreamOutputIndex = 1;
        for (const functionCall of pendingToolCalls) {
          const functionCallItemId = `call_${randomUUID()}`;
          const functionCallItem = createFunctionCallOutputItem({
            id: functionCallItemId,
            callId: functionCall.id,
            name: functionCall.name,
            arguments: functionCall.arguments,
          });
          writeSseEvent(res, {
            type: "response.output_item.added",
            output_index: nextStreamOutputIndex,
            item: functionCallItem,
          });
          const completedFunctionCallItem = createFunctionCallOutputItem({
            id: functionCallItemId,
            callId: functionCall.id,
            name: functionCall.name,
            arguments: functionCall.arguments,
            status: "completed",
          });
          writeSseEvent(res, {
            type: "response.output_item.done",
            output_index: nextStreamOutputIndex,
            item: completedFunctionCallItem,
          });
          functionCallItems.push(functionCallItem);
          nextStreamOutputIndex += 1;
        }
        const incompleteResponse = createResponseResource({
          id: responseId,
          model,
          status: "incomplete",
          output: [completedItem, ...functionCallItems],
          usage,
        });
        closed = true;
        stopWatchingDisconnect();
        unsubscribe();
        rememberResponseSession();
        writeSseEvent(res, {
          type: "response.completed",
          response: incompleteResponse,
        });
        writeDone(res);
        res.end();
        return;
      }
      if (!sawAssistantDelta) {
        const content =
          resultPayloadText || bufferedReplaceableAssistantContent || "No response from OpenClaw.";
        accumulatedText = content;
        sawAssistantDelta = true;
        if (finalizeStatus !== null)
          finalizeRequested = {
            status: finalizeStatus,
            text: content,
          };
        writeSseEvent(res, {
          type: "response.output_text.delta",
          item_id: outputItemId,
          output_index: 0,
          content_index: 0,
          delta: content,
        });
      }
      maybeFinalize();
    } catch (err) {
      if (closed || abortController.signal.aborted) return;
      logWarn(`openresponses: streaming response failed: ${String(err)}`);
      finalUsage = finalUsage ?? createEmptyUsage();
      if (isClientToolNameConflictError(err)) {
        writeSseEvent(res, {
          type: "response.failed",
          response: createResponseResource({
            id: responseId,
            model,
            status: "failed",
            output: [],
            error: {
              code: "invalid_request_error",
              message: "invalid tool configuration",
            },
            usage: finalUsage,
          }),
        });
        emitAgentEvent({
          runId: responseId,
          stream: "lifecycle",
          data: { phase: "error" },
        });
        return;
      }
      const errorResponse = createResponseResource({
        id: responseId,
        model,
        status: "failed",
        output: [],
        error: {
          code: "api_error",
          message: "internal error",
        },
        usage: finalUsage,
      });
      const mapped = resolveOpenAiCompatError(err);
      if (mapped) {
        const mappedResponse = createResponseResource({
          id: responseId,
          model,
          status: "failed",
          output: [],
          error: {
            code: mapped.error.type,
            message: mapped.error.message,
          },
          usage: finalUsage,
        });
        rememberResponseSession();
        writeSseEvent(res, {
          type: "response.failed",
          response: mappedResponse,
        });
        emitAgentEvent({
          runId: responseId,
          stream: "lifecycle",
          data: { phase: "error" },
        });
        return;
      }
      rememberResponseSession();
      writeSseEvent(res, {
        type: "response.failed",
        response: errorResponse,
      });
      emitAgentEvent({
        runId: responseId,
        stream: "lifecycle",
        data: { phase: "error" },
      });
    } finally {
      if (!closed)
        emitAgentEvent({
          runId: responseId,
          stream: "lifecycle",
          data: { phase: "end" },
        });
    }
  });
  return true;
}
//#endregion
export { testing as __testing, testing, buildAgentPrompt, handleOpenResponsesHttpRequest };
