import crypto from "node:crypto";
import { createServer } from "node:http";
import { ContentBlockSchema } from "@modelcontextprotocol/sdk/types.js";
import { f as runBeforeToolCallHook } from "./agent-tools.before-tool-call-B7gv78c3.js";
import { c as checkBrowserOrigin } from "./auth-D-Aebsmj.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { o as getHeader } from "./http-auth-utils-Cm6rPa7b.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { a as logWarn, t as logDebug } from "./logger-BegyOJlO.js";
import { a as resolveMainSessionKey } from "./main-session-nrmKYo2W.js";
import {
  a as resolveAttachGrant,
  o as resolveMcpLoopbackClientGrant,
  u as revokeMcpLoopbackClientGrantsForRuntime,
} from "./mcp-grant-store-BXg0F56m.js";
import {
  c as markMcpLoopbackRequestFinished,
  d as markMcpLoopbackToolCallStarted,
  f as recordMcpLoopbackToolCallResult,
  h as updateMcpLoopbackToolCallCapture,
  l as markMcpLoopbackRequestStarted,
  m as setActiveMcpLoopbackRuntime,
  n as clearActiveMcpLoopbackRuntimeByOwnerToken,
  p as resolveMcpLoopbackYieldContext,
  s as markMcpLoopbackRequestClassified,
  u as markMcpLoopbackToolCallFinished,
} from "./mcp-http.loopback-runtime-BQw0DPFh.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { r as isLoopbackAddress } from "./net-BpMGIYrw.js";
import "./message-channel-NQc9DJ6B.js";
import "./sessions-CEG7v41b.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { q as resolveSessionEntryAccessTarget } from "./session-accessor-PZVNxFCV.js";
import {
  Ct as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE,
  Dt as isAgentHarnessSessionStoreEntryProtected,
  Tt as isAgentHarnessSessionKey,
} from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
import "./http-utils-B3cLzhCe.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-vc04OURE.js";
import { t as resolveGatewayScopedTools } from "./tool-resolution-CJt3Kur-.js";
import {
  a as resolveToolExecutionErrorKind,
  o as resolveToolResultFailureKind,
  t as formatToolExecutionErrorMessage,
} from "./tool-result-error-1qgstja-.js";
//#region src/gateway/mcp-http.protocol.ts
/** Server identity advertised by the local MCP loopback initialize response. */
const MCP_LOOPBACK_SERVER_NAME = "openclaw";
/** Protocol-facing loopback server version, independent from the OpenClaw app version. */
const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
/** MCP protocol versions accepted by the loopback HTTP bridge, newest first for negotiation. */
const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"];
/**
 * Builds a JSON-RPC success response, using null for notifications or malformed missing ids.
 */
function jsonRpcResult(id, result) {
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    result,
  };
}
/**
 * Builds a JSON-RPC error response with the same id normalization as success responses.
 */
function jsonRpcError(id, code, message) {
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    error: {
      code,
      message,
    },
  };
}
//#endregion
//#region src/gateway/mcp-http.schema.ts
function readLoopbackToolField(tool, key) {
  try {
    return tool[key];
  } catch {
    return;
  }
}
/** Safely reads and normalizes a loopback tool name from plugin-provided tool objects. */
function readMcpLoopbackToolName(tool) {
  const value = readLoopbackToolField(tool, "name");
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function readLoopbackToolDescription(tool) {
  const value = readLoopbackToolField(tool, "description");
  return typeof value === "string" ? value : void 0;
}
function readLoopbackToolParameters(tool) {
  let value;
  try {
    value = tool.parameters;
  } catch {
    return;
  }
  if (!isRecord(value)) return {};
  try {
    return { ...value };
  } catch {
    return;
  }
}
function flattenUnionSchema(raw, toolName) {
  const variants = raw.anyOf ?? raw.oneOf;
  if (!Array.isArray(variants) || variants.length === 0) return raw;
  const mergedProps = Object.create(null);
  const requiredSets = [];
  for (const variant of variants) {
    if (variant === true) {
      requiredSets.push(/* @__PURE__ */ new Set());
      continue;
    }
    if (!isRecord(variant)) continue;
    const props = isRecord(variant.properties) ? variant.properties : void 0;
    if (props)
      for (const [key, schema] of Object.entries(props)) {
        if (!isPropertySchema(schema)) {
          warnSchemaOnce(
            `mcp loopback: malformed schema definition for "${toolName}.${key}", ignoring that variant`,
          );
          continue;
        }
        if (!Object.hasOwn(mergedProps, key)) {
          mergedProps[key] = schema;
          continue;
        }
        const existing = mergedProps[key];
        const incoming = schema;
        if (existing === true || incoming === true) {
          mergedProps[key] = true;
          continue;
        }
        if (existing === false) {
          mergedProps[key] = incoming;
          continue;
        }
        if (incoming === false) continue;
        if (!isRecord(existing) || !isRecord(incoming)) {
          if (existing !== incoming)
            warnSchemaOnce(
              `mcp loopback: conflicting schema definitions for "${toolName}.${key}", keeping the first variant`,
            );
          continue;
        }
        if (Array.isArray(existing.enum) && Array.isArray(incoming.enum)) {
          mergedProps[key] = {
            ...existing,
            enum: uniqueValues([...existing.enum, ...incoming.enum]),
          };
          continue;
        }
        if ("const" in existing && "const" in incoming && existing.const !== incoming.const) {
          const merged = {
            ...existing,
            enum: [existing.const, incoming.const],
          };
          delete merged.const;
          mergedProps[key] = merged;
          continue;
        }
        warnSchemaOnce(
          `mcp loopback: conflicting schema definitions for "${toolName}.${key}", keeping the first variant`,
        );
      }
    requiredSets.push(new Set(Array.isArray(variant.required) ? variant.required : []));
  }
  const required =
    requiredSets.length > 0
      ? [...(requiredSets[0] ?? [])].filter(
          (key) => Object.hasOwn(mergedProps, key) && requiredSets.every((set) => set.has(key)),
        )
      : [];
  const { anyOf: _anyOf, oneOf: _oneOf, ...rest } = raw;
  return {
    ...rest,
    type: "object",
    properties: mergedProps,
    required,
  };
}
function isPropertySchema(value) {
  return typeof value === "boolean" || isRecord(value);
}
const emittedSchemaWarnings = /* @__PURE__ */ new Set();
function warnSchemaOnce(message) {
  if (emittedSchemaWarnings.has(message)) return;
  emittedSchemaWarnings.add(message);
  logWarn(message);
}
/** Builds MCP-compatible tool schemas for loopback-visible gateway tools. */
function buildMcpToolSchema(tools) {
  return tools.flatMap((tool) => {
    const name = readMcpLoopbackToolName(tool);
    if (!name) return [];
    let raw = readLoopbackToolParameters(tool);
    if (!raw) return [];
    if (raw.anyOf || raw.oneOf) raw = flattenUnionSchema(raw, name);
    if (raw.type !== "object") raw.type = "object";
    if (!raw.properties) raw.properties = {};
    return {
      name,
      description: readLoopbackToolDescription(tool),
      inputSchema: raw,
    };
  });
}
//#endregion
//#region src/gateway/mcp-http.handlers.ts
function stringifyMcpContent(value) {
  return typeof value === "string" ? value : (JSON.stringify(value) ?? String(value));
}
const MCP_LOOPBACK_CONTENT_TYPES = /* @__PURE__ */ new Set(["text", "image", "resource"]);
function normalizeToolCallContent(result) {
  const content = result?.content;
  if (Array.isArray(content))
    return content.map((block) => {
      const parsed = ContentBlockSchema.safeParse(block);
      if (parsed.success && MCP_LOOPBACK_CONTENT_TYPES.has(parsed.data.type)) return parsed.data;
      return {
        type: "text",
        text: stringifyMcpContent(block),
      };
    });
  return [
    {
      type: "text",
      text: stringifyMcpContent(result),
    },
  ];
}
/** Handles one MCP loopback JSON-RPC message and returns a response or notification null. */
async function handleMcpJsonRpc(params) {
  const { id, method, params: methodParams } = params.message;
  switch (method) {
    case "initialize": {
      const clientVersion = methodParams?.protocolVersion ?? "";
      return jsonRpcResult(id, {
        protocolVersion:
          MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS.find((version) => version === clientVersion) ??
          MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: {
          name: MCP_LOOPBACK_SERVER_NAME,
          version: MCP_LOOPBACK_SERVER_VERSION,
        },
      });
    }
    case "notifications/initialized":
    case "notifications/cancelled":
      return null;
    case "tools/list":
      return jsonRpcResult(id, { tools: params.toolSchema });
    case "tools/call": {
      const toolName = typeof methodParams?.name === "string" ? methodParams.name.trim() : "";
      const rawToolArgs = methodParams?.arguments;
      if (rawToolArgs !== void 0 && !isRecord(rawToolArgs))
        return jsonRpcError(id, -32602, "Invalid params: tools/call arguments must be an object");
      const toolArgs = rawToolArgs ?? {};
      if (!toolName)
        return jsonRpcResult(id, {
          content: [
            {
              type: "text",
              text: "Tool not available: unknown",
            },
          ],
          isError: true,
        });
      if (!params.toolSchema.some((tool) => tool.name === toolName))
        return jsonRpcResult(id, {
          content: [
            {
              type: "text",
              text: `Tool not available: ${toolName}`,
            },
          ],
          isError: true,
        });
      const tool = params.tools.find(
        (candidate) => readMcpLoopbackToolName(candidate) === toolName,
      );
      if (!tool)
        return jsonRpcResult(id, {
          content: [
            {
              type: "text",
              text: `Tool not available: ${toolName}`,
            },
          ],
          isError: true,
        });
      const toolCallId = `mcp-${crypto.randomUUID()}`;
      let executedToolArgs = toolArgs;
      const reportToolCallResult = (outcome) => {
        try {
          params.onToolCallResult?.({
            toolName,
            args: executedToolArgs,
            ...outcome,
          });
        } catch {}
      };
      try {
        const preparedToolArgs = tool.prepareBeforeToolCallParams
          ? await tool.prepareBeforeToolCallParams(toolArgs, {
              toolCallId,
              hookContext: params.hookContext,
              signal: params.signal,
            })
          : toolArgs;
        executedToolArgs = preparedToolArgs;
        const hookResult = await runBeforeToolCallHook({
          toolName,
          params: preparedToolArgs,
          toolCallId,
          ctx: params.hookContext,
          signal: params.signal,
        });
        if (hookResult.blocked) {
          const disposition = hookResult.kind === "failure" ? hookResult.disposition : "blocked";
          reportToolCallResult(
            disposition === "blocked"
              ? {
                  outcome: disposition,
                  deniedReason: hookResult.deniedReason ?? "plugin-before-tool-call",
                }
              : { outcome: disposition },
          );
          return jsonRpcResult(id, {
            content: [
              {
                type: "text",
                text: hookResult.reason,
              },
            ],
            isError: true,
          });
        }
        const finalizedToolArgs =
          tool.finalizeBeforeToolCallParams?.(hookResult.params, preparedToolArgs) ??
          hookResult.params;
        executedToolArgs = finalizedToolArgs;
        try {
          params.onToolCallPrepared?.({
            toolName,
            args: executedToolArgs,
          });
        } catch {}
        if (params.authorizeToolCall && !params.authorizeToolCall()) {
          reportToolCallResult({
            outcome: "blocked",
            deniedReason: "client-grant-revoked",
          });
          return jsonRpcResult(id, {
            content: [
              {
                type: "text",
                text: "Tool call authorization expired",
              },
            ],
            isError: true,
          });
        }
        const result = await tool.execute(toolCallId, finalizedToolArgs, params.signal);
        const failureKind = resolveToolResultFailureKind(result);
        reportToolCallResult(
          failureKind === "blocked"
            ? {
                outcome: "blocked",
                deniedReason: "tool_result_blocked",
              }
            : {
                outcome: failureKind ?? "completed",
                result,
              },
        );
        return jsonRpcResult(id, {
          content: normalizeToolCallContent(result),
          isError: failureKind !== void 0,
        });
      } catch (error) {
        reportToolCallResult({
          outcome: params.signal?.aborted ? "unknown" : resolveToolExecutionErrorKind(error),
          result: error,
        });
        return jsonRpcResult(id, {
          content: [
            {
              type: "text",
              text:
                formatToolExecutionErrorMessage(error, "tool execution failed") ||
                "tool execution failed",
            },
          ],
          isError: true,
        });
      }
    }
    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}
//#endregion
//#region src/gateway/mcp-http.request.ts
const MAX_MCP_BODY_BYTES = 1048576;
const DEFAULT_MCP_BODY_TIMEOUT_MS = 3e4;
const MCP_HTTP_BODY_TOO_LARGE_CODE = "ETOOBIG";
const MCP_HTTP_BODY_TIMEOUT_CODE = "ETIMEDOUT";
const MCP_HTTP_BODY_CLOSED_CODE = "ECONNRESET";
function readPositiveIntEnv(name, fallback) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  if (!/^\d+$/u.test(raw))
    throw new Error(`${name} must be a positive integer. Got: ${JSON.stringify(raw)}`);
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed <= 0)
    throw new Error(`${name} must be a positive integer. Got: ${JSON.stringify(raw)}`);
  return parsed;
}
function shouldLogMcpLoopbackHttp() {
  return (
    isTruthyEnvValue(process.env.OPENCLAW_CLI_BACKEND_LOG_OUTPUT) ||
    isTruthyEnvValue(process.env.OPENCLAW_LIVE_CLI_BACKEND_DEBUG)
  );
}
function logMcpLoopbackHttp(step, details) {
  if (!shouldLogMcpLoopbackHttp()) return;
  console.error(`[mcp-loopback] ${step} ${JSON.stringify(details)}`);
}
function resolveScopedSessionKey(cfg, rawSessionKey) {
  const trimmed = normalizeOptionalString(rawSessionKey);
  return !trimmed || trimmed === "main" ? resolveMainSessionKey(cfg) : trimmed;
}
function normalizeMcpInboundEventKind(value) {
  const trimmed = normalizeOptionalString(value);
  return trimmed === "room_event" || trimmed === "user_request" ? trimmed : void 0;
}
function normalizeMcpSourceReplyDeliveryMode(value) {
  const trimmed = normalizeOptionalString(value);
  return trimmed === "automatic" || trimmed === "message_tool_only" ? trimmed : void 0;
}
function normalizeMcpTaskSuggestionDeliveryMode(value) {
  return normalizeOptionalString(value) === "gateway" ? "gateway" : void 0;
}
function normalizeMcpBooleanHeader(value) {
  const trimmed = normalizeOptionalString(value);
  return trimmed ? isTruthyEnvValue(trimmed) : void 0;
}
function rejectsBrowserLoopbackRequest(req) {
  const origin = getHeader(req, "origin");
  if (!origin) return false;
  return !checkBrowserOrigin({
    requestHost: getHeader(req, "host"),
    origin,
    isLocalClient: isLoopbackAddress(req.socket?.remoteAddress),
  }).ok;
}
function resolveMcpSender(params) {
  const authHeader = getHeader(params.req, "authorization") ?? "";
  const ownerTokenMatched = safeEqualSecret(authHeader, `Bearer ${params.ownerToken}`);
  const nonOwnerTokenMatched = safeEqualSecret(authHeader, `Bearer ${params.nonOwnerToken}`);
  if (ownerTokenMatched || nonOwnerTokenMatched) return { senderIsOwner: ownerTokenMatched };
  const grantToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const captureKey = normalizeOptionalString(getHeader(params.req, "x-openclaw-cli-capture-key"));
  const clientGrant =
    grantToken && captureKey
      ? resolveMcpLoopbackClientGrant({
          token: grantToken,
          runtimeOwnerToken: params.ownerToken,
          captureKey,
        })
      : void 0;
  if (clientGrant)
    return {
      senderIsOwner: clientGrant.context.senderIsOwner,
      boundContext: clientGrant.context,
      boundCaptureKey: clientGrant.captureKey,
      boundGrantToken: grantToken,
    };
  const grant = grantToken ? resolveAttachGrant(grantToken) : void 0;
  if (grant)
    return {
      senderIsOwner: false,
      boundSessionKey: grant.sessionKey,
    };
}
function validateMcpLoopbackRequest(params) {
  let url;
  try {
    url = new URL(params.req.url ?? "/", `http://${params.req.headers.host ?? "localhost"}`);
  } catch {
    logMcpLoopbackHttp("reject", {
      reason: "bad_request_url",
      method: params.req.method ?? "",
    });
    params.res.writeHead(400, { "Content-Type": "application/json" });
    params.res.end(JSON.stringify({ error: "bad_request" }));
    return null;
  }
  if (params.req.method === "GET" && url.pathname.startsWith("/.well-known/")) {
    params.res.writeHead(404);
    params.res.end();
    return null;
  }
  if (url.pathname !== "/mcp") {
    logMcpLoopbackHttp("reject", {
      reason: "not_found",
      method: params.req.method ?? "",
      path: url.pathname,
    });
    params.res.writeHead(404, { "Content-Type": "application/json" });
    params.res.end(JSON.stringify({ error: "not_found" }));
    return null;
  }
  if (params.req.method === "GET" || params.req.method === "DELETE") {
    if (rejectsBrowserLoopbackRequest(params.req)) {
      params.res.writeHead(403, { "Content-Type": "application/json" });
      params.res.end(JSON.stringify({ error: "forbidden" }));
      return null;
    }
    if (!resolveMcpSender(params)) {
      params.res.writeHead(401, { "Content-Type": "application/json" });
      params.res.end(JSON.stringify({ error: "unauthorized" }));
      return null;
    }
    if (params.req.method === "GET") {
      logMcpLoopbackHttp("sse-open", {
        method: "GET",
        path: url.pathname,
      });
      params.res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      params.res.flushHeaders();
      params.res.write(":\n\n");
      params.onSseResponse?.(params.res);
      params.req.on("close", () => {
        if (!params.res.writableEnded) params.res.end();
      });
      return null;
    }
    logMcpLoopbackHttp("session-delete", {
      method: "DELETE",
      path: url.pathname,
    });
    params.res.writeHead(200, { "Content-Type": "application/json" });
    params.res.end(JSON.stringify({ ok: true }));
    return null;
  }
  if (params.req.method !== "POST") {
    logMcpLoopbackHttp("reject", {
      reason: "method_not_allowed",
      method: params.req.method ?? "",
      path: url.pathname,
    });
    params.res.writeHead(405, { Allow: "GET, POST, DELETE" });
    params.res.end();
    return null;
  }
  if (rejectsBrowserLoopbackRequest(params.req)) {
    logMcpLoopbackHttp("reject", {
      reason: "forbidden_origin",
      method: params.req.method ?? "",
      origin: getHeader(params.req, "origin") ?? "",
    });
    params.res.writeHead(403, { "Content-Type": "application/json" });
    params.res.end(JSON.stringify({ error: "forbidden" }));
    return null;
  }
  const sender = resolveMcpSender(params);
  if (!sender) {
    logMcpLoopbackHttp("reject", {
      reason: "unauthorized",
      method: params.req.method ?? "",
      hasAuthorization: (getHeader(params.req, "authorization") ?? "").length > 0,
    });
    params.res.writeHead(401, { "Content-Type": "application/json" });
    params.res.end(JSON.stringify({ error: "unauthorized" }));
    return null;
  }
  const contentType = getHeader(params.req, "content-type") ?? "";
  if (!contentType.startsWith("application/json")) {
    logMcpLoopbackHttp("reject", {
      reason: "unsupported_media_type",
      method: params.req.method ?? "",
      contentType,
    });
    params.res.writeHead(415, { "Content-Type": "application/json" });
    params.res.end(JSON.stringify({ error: "unsupported_media_type" }));
    return null;
  }
  return {
    senderIsOwner: sender.senderIsOwner,
    boundSessionKey: sender.boundSessionKey,
    boundContext: sender.boundContext,
    boundCaptureKey: sender.boundCaptureKey,
    boundGrantToken: sender.boundGrantToken,
  };
}
async function readMcpHttpBody(req, options = {}) {
  return await new Promise((resolve, reject) => {
    const maxBytes = Math.max(1, Math.floor(options.maxBytes ?? MAX_MCP_BODY_BYTES));
    const timeoutMs = resolveSafeTimeoutDelayMs(options.timeoutMs ?? DEFAULT_MCP_BODY_TIMEOUT_MS);
    const chunks = [];
    let received = 0;
    let settled = false;
    const cleanup = (cleanupOptions) => {
      req.off("data", onData);
      req.off("end", onEnd);
      req.off("close", onClose);
      if (cleanupOptions?.keepErrorListener !== true) req.off("error", onError);
      clearTimeout(timeout);
    };
    const rejectOnce = (error, rejectOptions) => {
      if (settled) return;
      settled = true;
      cleanup(rejectOptions);
      reject(error);
    };
    const onData = (chunk) => {
      received += chunk.length;
      if (received > maxBytes) {
        req.pause();
        rejectOnce(createMcpHttpBodyTooLargeError(maxBytes), { keepErrorListener: true });
        return;
      }
      chunks.push(chunk);
    };
    const onEnd = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(Buffer.concat(chunks).toString("utf-8"));
    };
    const onError = (error) => {
      rejectOnce(error);
    };
    const onClose = () => {
      rejectOnce(createMcpHttpBodyClosedError());
    };
    const timeout = setTimeout(() => {
      req.pause();
      rejectOnce(createMcpHttpBodyTimeoutError(), { keepErrorListener: true });
    }, timeoutMs);
    timeout.unref?.();
    req.on("data", onData);
    req.on("end", onEnd);
    req.on("close", onClose);
    req.on("error", onError);
  });
}
function createMcpHttpBodyTooLargeError(maxBytes) {
  return Object.assign(/* @__PURE__ */ new Error(`Request body exceeds ${maxBytes} bytes`), {
    code: MCP_HTTP_BODY_TOO_LARGE_CODE,
  });
}
function createMcpHttpBodyTimeoutError() {
  return Object.assign(/* @__PURE__ */ new Error("Request body timed out"), {
    code: MCP_HTTP_BODY_TIMEOUT_CODE,
  });
}
function createMcpHttpBodyClosedError() {
  return Object.assign(/* @__PURE__ */ new Error("Request body connection closed"), {
    code: MCP_HTTP_BODY_CLOSED_CODE,
  });
}
function isMcpHttpBodyTooLargeError(error) {
  return typeof error === "object" && error !== null && error.code === MCP_HTTP_BODY_TOO_LARGE_CODE;
}
function isMcpHttpBodyTimeoutError(error) {
  return typeof error === "object" && error !== null && error.code === MCP_HTTP_BODY_TIMEOUT_CODE;
}
function resolveMcpHttpBodyTimeoutMs() {
  return readPositiveIntEnv("OPENCLAW_MCP_LOOPBACK_BODY_TIMEOUT_MS", DEFAULT_MCP_BODY_TIMEOUT_MS);
}
function resolveMcpCliCaptureKey(req, auth) {
  if (auth.boundContext || auth.boundSessionKey) return auth.boundCaptureKey;
  return normalizeOptionalString(getHeader(req, "x-openclaw-cli-capture-key"));
}
function normalizeMcpClientCapsHeader(value) {
  const clientCaps = [...new Set((value ?? "").split(",").map((cap) => cap.trim()))].filter(
    Boolean,
  );
  return clientCaps.length > 0 ? clientCaps : void 0;
}
function resolveMcpRequestContext(req, cfg, auth) {
  if (auth.boundContext) return structuredClone(auth.boundContext);
  if (auth.boundSessionKey)
    return {
      sessionKey: auth.boundSessionKey,
      sessionId: void 0,
      messageProvider: void 0,
      clientCaps: void 0,
      currentChannelId: void 0,
      currentThreadTs: void 0,
      currentMessageId: void 0,
      currentInboundAudio: void 0,
      accountId: void 0,
      inboundEventKind: void 0,
      sourceReplyDeliveryMode: void 0,
      taskSuggestionDeliveryMode: void 0,
      requireExplicitMessageTarget: void 0,
      senderIsOwner: auth.senderIsOwner,
    };
  return {
    sessionKey: resolveScopedSessionKey(cfg, getHeader(req, "x-session-key")),
    sessionId: normalizeOptionalString(getHeader(req, "x-openclaw-session-id")),
    messageProvider:
      normalizeMessageChannel(getHeader(req, "x-openclaw-message-channel")) ?? void 0,
    clientCaps: normalizeMcpClientCapsHeader(getHeader(req, "x-openclaw-client-caps")),
    currentChannelId: normalizeOptionalString(getHeader(req, "x-openclaw-current-channel-id")),
    currentThreadTs: normalizeOptionalString(getHeader(req, "x-openclaw-current-thread-ts")),
    currentMessageId: normalizeOptionalString(getHeader(req, "x-openclaw-current-message-id")),
    currentInboundAudio: normalizeMcpBooleanHeader(
      getHeader(req, "x-openclaw-current-inbound-audio"),
    ),
    accountId: normalizeOptionalString(getHeader(req, "x-openclaw-account-id")),
    inboundEventKind: normalizeMcpInboundEventKind(getHeader(req, "x-openclaw-inbound-event-kind")),
    sourceReplyDeliveryMode: normalizeMcpSourceReplyDeliveryMode(
      getHeader(req, "x-openclaw-source-reply-delivery-mode"),
    ),
    taskSuggestionDeliveryMode: normalizeMcpTaskSuggestionDeliveryMode(
      getHeader(req, "x-openclaw-task-suggestion-delivery-mode"),
    ),
    requireExplicitMessageTarget: normalizeMcpBooleanHeader(
      getHeader(req, "x-openclaw-require-explicit-message-target"),
    ),
    senderIsOwner: auth.senderIsOwner,
  };
}
//#endregion
//#region src/gateway/mcp-http.runtime.ts
const TOOL_CACHE_TTL_MS = 3e4;
const TOOL_CACHE_MAX_ENTRIES = 256;
const NATIVE_TOOL_EXCLUDE = /* @__PURE__ */ new Set([
  "read",
  "write",
  "edit",
  "apply_patch",
  "exec",
  "process",
]);
/** Resolves loopback-visible tools after applying gateway scope and native-tool exclusions. */
function resolveMcpLoopbackScopedTools(params) {
  const excludeToolNames = new Set(NATIVE_TOOL_EXCLUDE);
  if (params.nodeExecAllowed === true) excludeToolNames.delete("exec");
  const scoped = resolveGatewayScopedTools({
    ...params,
    conversationReadOrigin: "delegated",
    surface: "loopback",
    excludeToolNames,
    includeNodeExecTool: params.nodeExecAllowed === true,
  });
  return {
    agentId: scoped.agentId,
    tools: scoped.tools,
  };
}
/** Short-lived cache for loopback tool lists keyed by session/channel context. */
var McpLoopbackToolCache = class {
  #entries = /* @__PURE__ */ new Map();
  resolve(params) {
    const clientCapsCacheKey = [...new Set(params.clientCaps ?? [])].toSorted().join(",");
    const cacheKey = [
      params.sessionKey,
      params.runtimePolicySessionKey ?? "",
      params.agentId ?? "",
      params.sessionId ?? "",
      params.modelProvider ?? "",
      params.modelId ?? "",
      params.yieldContextCacheKey ?? "",
      params.messageProvider ?? "",
      clientCapsCacheKey,
      params.currentChannelId ?? "",
      params.currentThreadTs ?? "",
      params.currentMessageId != null ? String(params.currentMessageId) : "",
      params.currentInboundAudio === true ? "audio" : "no-audio",
      params.accountId ?? "",
      params.inboundEventKind ?? "",
      params.sourceReplyDeliveryMode ?? "",
      params.taskSuggestionDeliveryMode ?? "",
      params.requireExplicitMessageTarget === true ? "explicit-message-target" : "",
      params.nodeExecAllowed === true ? "node-exec" : "",
      params.execSession?.execHost ?? "",
      params.execSession?.execSecurity ?? "",
      params.execSession?.execAsk ?? "",
      params.execSession?.execNode ?? "",
      params.execOverrides?.host ?? "",
      params.execOverrides?.security ?? "",
      params.execOverrides?.ask ?? "",
      params.execOverrides?.node ?? "",
      params.bashElevated ? "elevated-present" : "elevated-absent",
      params.bashElevated?.enabled === true ? "elevated-enabled" : "elevated-disabled",
      params.bashElevated?.allowed === true ? "elevated-allowed" : "elevated-blocked",
      params.bashElevated?.defaultLevel ?? "",
      params.bashElevated?.fullAccessAvailable === true
        ? "full-access-available"
        : params.bashElevated?.fullAccessAvailable === false
          ? "full-access-unavailable"
          : "",
      params.bashElevated?.fullAccessBlockedReason ?? "",
      params.trigger ?? "",
      params.approvalReviewerDeviceId ?? "",
      params.channelContext?.sender?.id ?? "",
      params.channelContext?.chat?.id ?? "",
      params.senderName ?? "",
      params.senderUsername ?? "",
      params.senderE164 ?? "",
      params.groupId ?? "",
      params.groupChannel ?? "",
      params.groupSpace ?? "",
      params.spawnedBy ?? "",
      params.senderIsOwner === true
        ? "owner"
        : params.senderIsOwner === false
          ? "non-owner"
          : "unknown-owner",
    ].join("\0");
    const now = Date.now();
    for (const [key, entry] of this.#entries)
      if (now - entry.time >= TOOL_CACHE_TTL_MS) this.#entries.delete(key);
    const cached = this.#entries.get(cacheKey);
    if (cached && cached.configRef === params.cfg && now - cached.time < TOOL_CACHE_TTL_MS)
      return cached;
    const next = resolveMcpLoopbackScopedTools(params);
    const nextEntry = {
      agentId: next.agentId,
      tools: next.tools,
      toolSchema: buildMcpToolSchema(next.tools),
      configRef: params.cfg,
      time: now,
    };
    this.#entries.set(cacheKey, nextEntry);
    while (this.#entries.size > TOOL_CACHE_MAX_ENTRIES) {
      const oldestKey = this.#entries.keys().next().value;
      if (oldestKey === void 0) break;
      this.#entries.delete(oldestKey);
    }
    return nextEntry;
  }
};
//#endregion
//#region src/gateway/mcp-http.ts
let activeMcpLoopbackServer;
let activeMcpLoopbackServerPromise = null;
function createMcpJsonParseError(error) {
  return Object.assign(/* @__PURE__ */ new Error("MCP JSON parse error"), {
    cause: error,
    code: "mcp_json_parse_error",
  });
}
function isMcpJsonParseError(error) {
  return typeof error === "object" && error !== null && error.code === "mcp_json_parse_error";
}
function parseMcpJsonBody(body) {
  try {
    return JSON.parse(body);
  } catch (error) {
    throw createMcpJsonParseError(error);
  }
}
function readJsonRpcRequestId(message) {
  if (!isRecord(message)) return null;
  const id = message.id;
  return typeof id === "string" || typeof id === "number" || id === null ? id : void 0;
}
function isJsonRpcRequest(message) {
  return isRecord(message) && message.jsonrpc === "2.0" && typeof message.method === "string";
}
function jsonRpcInternalError(parsed) {
  if (Array.isArray(parsed))
    return parsed.map((message) =>
      jsonRpcError(readJsonRpcRequestId(message), -32603, "Internal error"),
    );
  return jsonRpcError(readJsonRpcRequestId(parsed), -32603, "Internal error");
}
function shouldLogMcpLoopbackTraffic() {
  return (
    isTruthyEnvValue(process.env.OPENCLAW_CLI_BACKEND_LOG_OUTPUT) ||
    isTruthyEnvValue(process.env.OPENCLAW_LIVE_CLI_BACKEND_DEBUG)
  );
}
function logMcpLoopbackTraffic(step, details) {
  if (!shouldLogMcpLoopbackTraffic()) return;
  console.error(`[mcp-loopback] ${step} ${JSON.stringify(details)}`);
}
function createRequestAbortSignal(req, res) {
  const controller = new AbortController();
  const abort = () => {
    if (!controller.signal.aborted) controller.abort();
  };
  const abortIfRequestIncomplete = () => {
    if (!req.complete) abort();
  };
  const abortIfResponseStillOpen = () => {
    if (!res.writableEnded) abort();
  };
  req.once("close", abortIfRequestIncomplete);
  res.once("close", abortIfResponseStillOpen);
  if (req.destroyed && !req.complete) abort();
  return {
    signal: controller.signal,
    cleanup: () => {
      req.off("close", abortIfRequestIncomplete);
      res.off("close", abortIfResponseStillOpen);
    },
  };
}
/** Starts a new MCP loopback HTTP server and registers its bearer tokens. */
async function startMcpLoopbackServer(port = 0) {
  const ownerToken = crypto.randomBytes(32).toString("hex");
  const nonOwnerToken = crypto.randomBytes(32).toString("hex");
  const toolCache = new McpLoopbackToolCache();
  const activeSseResponses = /* @__PURE__ */ new Set();
  const trackSseResponse = (res) => {
    activeSseResponses.add(res);
    const cleanup = () => {
      activeSseResponses.delete(res);
      res.off("close", cleanup);
      res.off("finish", cleanup);
    };
    res.once("close", cleanup);
    res.once("finish", cleanup);
  };
  const closeActiveSseResponses = () => {
    for (const res of activeSseResponses)
      if (!res.destroyed && !res.writableEnded) {
        const socket = res.socket;
        res.end();
        socket?.end();
      }
  };
  const httpServer = createServer((req, res) => {
    const auth = validateMcpLoopbackRequest({
      req,
      res,
      ownerToken,
      nonOwnerToken,
      onSseResponse: trackSseResponse,
    });
    if (!auth) return;
    const cliRequestCaptureHandle = markMcpLoopbackRequestStarted(
      resolveMcpCliCaptureKey(req, auth),
    );
    const requestAbort = createRequestAbortSignal(req, res);
    (async () => {
      let parsed;
      let cliCaptureHandles = [];
      try {
        parsed = parseMcpJsonBody(
          await readMcpHttpBody(req, { timeoutMs: resolveMcpHttpBodyTimeoutMs() }),
        );
        const messages = Array.isArray(parsed) ? parsed : [parsed];
        cliCaptureHandles = messages.map((message) => {
          if (
            !cliRequestCaptureHandle ||
            !isJsonRpcRequest(message) ||
            message.method !== "tools/call"
          )
            return;
          const admittedToolName =
            isRecord(message.params) && typeof message.params.name === "string"
              ? message.params.name
              : "";
          const toolArgs =
            isRecord(message.params) && isRecord(message.params.arguments)
              ? message.params.arguments
              : {};
          return markMcpLoopbackToolCallStarted({
            requestCaptureHandle: cliRequestCaptureHandle,
            toolName: admittedToolName,
            args: toolArgs,
          });
        });
        markMcpLoopbackRequestClassified(cliRequestCaptureHandle);
        const cfg = getRuntimeConfig();
        const requestContext = resolveMcpRequestContext(req, cfg, auth);
        const { boundGrantToken, boundCaptureKey } = auth;
        const authorizeToolCall =
          boundGrantToken && boundCaptureKey
            ? () =>
                Boolean(
                  resolveMcpLoopbackClientGrant({
                    token: boundGrantToken,
                    runtimeOwnerToken: ownerToken,
                    captureKey: boundCaptureKey,
                  }),
                )
            : void 0;
        const harnessEntry = isAgentHarnessSessionKey(requestContext.sessionKey)
          ? resolveSessionEntryAccessTarget({
              cfg,
              sessionKey: requestContext.sessionKey,
            }).entry
          : void 0;
        if (
          isAgentHarnessSessionKey(requestContext.sessionKey) &&
          (!harnessEntry ||
            isAgentHarnessSessionStoreEntryProtected(requestContext.sessionKey, harnessEntry))
        ) {
          const errors = messages.map((message) =>
            jsonRpcError(
              readJsonRpcRequestId(message),
              -32600,
              AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE,
            ),
          );
          const payload = Array.isArray(parsed)
            ? JSON.stringify(errors)
            : JSON.stringify(errors[0]);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(payload);
          return;
        }
        const yieldContext = resolveMcpLoopbackYieldContext(cliRequestCaptureHandle);
        const scopedTools = toolCache.resolve({
          cfg,
          sessionKey: requestContext.sessionKey,
          runtimePolicySessionKey: requestContext.runtimePolicySessionKey,
          agentId: requestContext.agentId,
          sessionId: requestContext.sessionId,
          modelProvider: requestContext.modelProvider,
          modelId: requestContext.modelId,
          yieldContextCacheKey: yieldContext?.cacheKey,
          onYield: yieldContext?.onYield,
          messageProvider: requestContext.messageProvider,
          clientCaps: requestContext.clientCaps,
          currentChannelId: requestContext.currentChannelId,
          currentThreadTs: requestContext.currentThreadTs,
          currentMessageId: requestContext.currentMessageId,
          currentInboundAudio: requestContext.currentInboundAudio,
          accountId: requestContext.accountId,
          inboundEventKind: requestContext.inboundEventKind,
          sourceReplyDeliveryMode: requestContext.sourceReplyDeliveryMode,
          taskSuggestionDeliveryMode: requestContext.taskSuggestionDeliveryMode,
          requireExplicitMessageTarget: requestContext.requireExplicitMessageTarget,
          senderIsOwner: requestContext.senderIsOwner,
          nodeExecAllowed: requestContext.nodeExecAllowed,
          execSession: requestContext.execSession,
          execOverrides: requestContext.execOverrides,
          bashElevated: requestContext.bashElevated,
          trigger: requestContext.trigger,
          approvalReviewerDeviceId: requestContext.approvalReviewerDeviceId,
          channelContext: requestContext.channelContext,
          senderName: requestContext.senderName,
          senderUsername: requestContext.senderUsername,
          senderE164: requestContext.senderE164,
          groupId: requestContext.groupId,
          groupChannel: requestContext.groupChannel,
          groupSpace: requestContext.groupSpace,
          spawnedBy: requestContext.spawnedBy,
        });
        logMcpLoopbackTraffic("request", {
          batchSize: messages.length,
          methods: messages.map((message) => (isJsonRpcRequest(message) ? message.method : void 0)),
          sessionKey: requestContext.sessionKey,
          inboundEventKind: requestContext.inboundEventKind,
          senderIsOwner: requestContext.senderIsOwner,
          toolCount: scopedTools.toolSchema.length,
          cronVisible: scopedTools.toolSchema.some((tool) => tool.name === "cron"),
        });
        const responses = [];
        for (const [messageIndex, message] of messages.entries()) {
          if (!isJsonRpcRequest(message)) {
            responses.push(jsonRpcError(readJsonRpcRequestId(message), -32600, "Invalid Request"));
            continue;
          }
          const cliCaptureHandle = cliCaptureHandles[messageIndex];
          let response;
          try {
            response = await handleMcpJsonRpc({
              message,
              tools: scopedTools.tools,
              toolSchema: scopedTools.toolSchema,
              hookContext: {
                agentId: scopedTools.agentId,
                config: cfg,
                sessionKey: requestContext.sessionKey,
                sessionId: requestContext.sessionId,
                runId: requestContext.runId,
                approvalReviewerDeviceId: requestContext.approvalReviewerDeviceId,
                channelId: requestContext.currentChannelId,
                turnSourceChannel: requestContext.messageProvider,
                turnSourceTo: requestContext.currentChannelId,
                turnSourceAccountId: requestContext.accountId,
                turnSourceThreadId: requestContext.currentThreadTs,
                loopDetection: resolveToolLoopDetectionConfig({
                  cfg,
                  agentId: scopedTools.agentId,
                }),
              },
              signal: requestAbort.signal,
              authorizeToolCall,
              onToolCallPrepared: cliCaptureHandle
                ? ({ toolName: preparedToolName, args }) => {
                    updateMcpLoopbackToolCallCapture(cliCaptureHandle, {
                      toolName: preparedToolName,
                      args,
                    });
                  }
                : void 0,
              onToolCallResult: cliCaptureHandle
                ? (result) => {
                    recordMcpLoopbackToolCallResult({
                      captureHandle: cliCaptureHandle,
                      ...result,
                    });
                  }
                : void 0,
            });
          } finally {
            markMcpLoopbackToolCallFinished(cliCaptureHandle);
          }
          if (response !== null) {
            const responseToolName =
              message.method === "tools/call" && isRecord(message.params)
                ? message.params.name
                : void 0;
            const isError =
              isRecord(response) && isRecord(response.result) && response.result.isError === true;
            logMcpLoopbackTraffic("response", {
              method: message.method,
              toolName: typeof responseToolName === "string" ? responseToolName : void 0,
              isError,
            });
            responses.push(response);
          }
        }
        if (responses.length === 0) {
          res.writeHead(202);
          res.end();
          return;
        }
        const payload = Array.isArray(parsed)
          ? JSON.stringify(responses)
          : JSON.stringify(responses[0]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(payload);
      } catch (error) {
        logWarn(`mcp loopback: request handling failed: ${formatErrorMessage(error)}`);
        logMcpLoopbackTraffic("request-failed", { message: formatErrorMessage(error) });
        if (!res.headersSent)
          if (isMcpHttpBodyTooLargeError(error)) {
            res.writeHead(413, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "payload_too_large" }), () => {
              req.destroy();
            });
          } else if (isMcpHttpBodyTimeoutError(error)) {
            res.writeHead(408, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "request_body_timeout" }), () => {
              req.destroy();
            });
          } else if (isMcpJsonParseError(error)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify(jsonRpcError(null, -32700, "Parse error")));
          } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(jsonRpcInternalError(parsed)));
          }
      } finally {
        requestAbort.cleanup();
        for (const captureHandle of cliCaptureHandles)
          markMcpLoopbackToolCallFinished(captureHandle);
        markMcpLoopbackRequestFinished(cliRequestCaptureHandle);
      }
    })();
  });
  await new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, "127.0.0.1", () => {
      httpServer.removeListener("error", reject);
      resolve();
    });
  });
  const address = httpServer.address();
  if (!address || typeof address === "string")
    throw new Error("mcp loopback did not bind to a TCP port");
  setActiveMcpLoopbackRuntime({
    port: address.port,
    ownerToken,
    nonOwnerToken,
  });
  logDebug(`mcp loopback listening on 127.0.0.1:${address.port}`);
  const server = {
    port: address.port,
    close: () => {
      clearActiveMcpLoopbackRuntimeByOwnerToken(ownerToken);
      revokeMcpLoopbackClientGrantsForRuntime(ownerToken);
      return new Promise((resolve, reject) => {
        httpServer.close((error) => {
          if (!error) {
            if (activeMcpLoopbackServer === server) activeMcpLoopbackServer = void 0;
          }
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
        closeActiveSseResponses();
      });
    },
  };
  return server;
}
/** Returns the active MCP loopback server or starts one if none exists. */
async function ensureMcpLoopbackServer(port = 0) {
  if (activeMcpLoopbackServer) return activeMcpLoopbackServer;
  if (!activeMcpLoopbackServerPromise)
    activeMcpLoopbackServerPromise = startMcpLoopbackServer(port)
      .then((server) => {
        activeMcpLoopbackServer = server;
        return server;
      })
      .finally(() => {
        activeMcpLoopbackServerPromise = null;
      });
  return activeMcpLoopbackServerPromise;
}
/** Closes the active MCP loopback server if one has been started. */
async function closeMcpLoopbackServer() {
  const server =
    activeMcpLoopbackServer ??
    (activeMcpLoopbackServerPromise ? await activeMcpLoopbackServerPromise : void 0);
  if (!server) return;
  activeMcpLoopbackServer = void 0;
  await server.close();
}
//#endregion
export {
  ensureMcpLoopbackServer as n,
  resolveMcpLoopbackScopedTools as r,
  closeMcpLoopbackServer as t,
};
