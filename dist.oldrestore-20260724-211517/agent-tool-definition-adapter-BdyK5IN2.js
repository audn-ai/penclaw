import { createHash } from "node:crypto";
import {
  c as recordAdjustedParamsForToolCall,
  f as runBeforeToolCallHook,
  l as recordStructuredReplayTrustForToolCall,
  s as isBeforeToolCallBlockedError,
  t as buildBlockedToolResult,
} from "./agent-tools.before-tool-call-B7gv78c3.js";
import "./utils-DtcDeqWS.js";
import {
  d as reconcileCodeModeExecBeforeHookParams,
  i as getCodeModeExecBeforeHookMetadata,
  l as normalizeCodeModeExecBeforeHookParams,
} from "./code-mode-control-tools-B27uc_a6.js";
import { d as payloadTextResult } from "./common-DyDSUect.js";
import { t as sanitizeForConsole } from "./console-sanitize-NjY4pEOW.js";
import { D as isToolWrappedWithBeforeToolCallHook } from "./gateway-Dyh1k_4Q.js";
import { n as logError, t as logDebug } from "./logger-BegyOJlO.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import { l as redactToolDetail } from "./redact-CUe6Oey5.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
//#region src/agents/agent-tool-definition-adapter.ts
/**
 * Adapts runtime AgentTool objects into session ToolDefinition entries.
 * Owns hook execution, client-tool delegation, result coercion, and safe
 * logging for failed tool calls.
 */
const TOOL_ERROR_PARAM_PREVIEW_MAX_CHARS = 600;
const TOOL_ERROR_EXEC_COMMAND_HASH_CHARS = 16;
const SENSITIVE_EXEC_ENV_VALUE = "[omitted exec env value]";
const EXEC_COMMAND_PARAM_KEYS = /* @__PURE__ */ new Set(["command", "cmd"]);
function isAbortSignal(value) {
  return typeof value === "object" && value !== null && "aborted" in value;
}
function isLegacyToolExecuteArgs(args) {
  const third = args[2];
  const fifth = args[4];
  if (typeof third === "function") return true;
  return isAbortSignal(fifth);
}
function describeToolExecutionError(err) {
  if (err instanceof Error)
    return {
      message: err.message?.trim() ? err.message : String(err),
      stack: err.stack,
    };
  return { message: String(err) };
}
function serializeToolParams(value) {
  if (value === void 0) return "<undefined>";
  if (typeof value === "string") return value;
  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  )
    return String(value);
  try {
    const serialized = JSON.stringify(value);
    if (typeof serialized === "string") return serialized;
  } catch {}
  if (typeof value === "function")
    return value.name ? `[Function ${value.name}]` : "[Function anonymous]";
  if (typeof value === "symbol")
    return value.description ? `Symbol(${value.description})` : "Symbol()";
  return Object.prototype.toString.call(value);
}
function formatToolParamPreview(label, value) {
  return `${label}=${sanitizeForConsole(redactToolDetail(serializeToolParams(value)), TOOL_ERROR_PARAM_PREVIEW_MAX_CHARS) ?? "<empty>"}`;
}
function kindForLog(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}
function summarizeSensitiveValueForLog(params) {
  const serialized = serializeToolParams(params.value);
  return {
    omitted: true,
    reason: params.reason,
    type: kindForLog(params.value),
    chars: serialized.length,
    sha256: createHash("sha256")
      .update(serialized)
      .digest("hex")
      .slice(0, TOOL_ERROR_EXEC_COMMAND_HASH_CHARS),
  };
}
function summarizeExecCommandForLog(command) {
  return summarizeSensitiveValueForLog({
    value: command,
    reason: "exec command may contain credentials",
  });
}
function sanitizeExecEnvForLog(value) {
  if (!isPlainObject(value)) return value === void 0 ? void 0 : "[omitted exec env]";
  return Object.fromEntries(
    Object.keys(value)
      .toSorted()
      .map((key) => [key, SENSITIVE_EXEC_ENV_VALUE]),
  );
}
function sanitizeExecFailureParamsForLog(value) {
  if (typeof value === "string")
    try {
      const parsed = JSON.parse(value);
      if (isPlainObject(parsed)) return sanitizeExecFailureParamsForLog(parsed);
    } catch {}
  if (!isPlainObject(value))
    return summarizeSensitiveValueForLog({
      value,
      reason: "exec params may contain command credentials",
    });
  const sanitized = {};
  for (const [key, field] of Object.entries(value)) {
    if (EXEC_COMMAND_PARAM_KEYS.has(key)) {
      sanitized[key] = summarizeExecCommandForLog(field);
      continue;
    }
    if (key === "env") {
      sanitized[key] = sanitizeExecEnvForLog(field);
      continue;
    }
    sanitized[key] = field;
  }
  return sanitized;
}
function sanitizeToolFailureParamsForLog(toolName, value) {
  return toolName === "exec" ? sanitizeExecFailureParamsForLog(value) : value;
}
function describeToolFailureInputs(params) {
  const rawParams = sanitizeToolFailureParamsForLog(params.toolName, params.rawParams);
  const effectiveParams = sanitizeToolFailureParamsForLog(params.toolName, params.effectiveParams);
  const parts = [formatToolParamPreview("raw_params", rawParams)];
  const rawSerialized = serializeToolParams(rawParams);
  if (serializeToolParams(effectiveParams) !== rawSerialized)
    parts.push(formatToolParamPreview("effective_params", effectiveParams));
  return parts.join(" ");
}
function normalizeToolExecutionResult(params) {
  const { toolName, result } = params;
  if (result && typeof result === "object") {
    const record = result;
    if (Array.isArray(record.content)) return result;
    logDebug(`tools: ${toolName} returned non-standard result (missing content[]); coercing`);
    return payloadTextResult(
      ("details" in record ? record.details : record) ?? {
        status: "ok",
        tool: toolName,
      },
    );
  }
  return payloadTextResult(
    result ?? {
      status: "ok",
      tool: toolName,
    },
  );
}
function buildToolExecutionErrorResult(params) {
  return jsonResult({
    status: "error",
    tool: params.toolName,
    error: params.message,
  });
}
function splitToolExecuteArgs(args) {
  if (isLegacyToolExecuteArgs(args)) {
    const [toolCallId, params, onUpdate, _ctx, signal] = args;
    return {
      toolCallId,
      params,
      onUpdate,
      signal,
    };
  }
  const [toolCallId, params, signal, onUpdate] = args;
  return {
    toolCallId,
    params,
    onUpdate,
    signal,
  };
}
async function prepareToolParamsBeforeHook(params) {
  const prepare = params.tool.prepareBeforeToolCallParams;
  return prepare
    ? await prepare(params.rawParams, {
        ...(params.toolCallId ? { toolCallId: params.toolCallId } : {}),
        ...(params.hookContext ? { hookContext: params.hookContext } : {}),
        ...(params.signal ? { signal: params.signal } : {}),
      })
    : params.rawParams;
}
function finalizeToolParamsBeforeExecute(params) {
  const finalize = params.tool.finalizeBeforeToolCallParams;
  return finalize ? finalize(params.executeParams, params.preparedParams) : params.executeParams;
}
const CLIENT_TOOL_NAME_CONFLICT_PREFIX = "client tool name conflict:";
/** Find client-hosted tool names that collide with runtime or sibling tools. */
function findClientToolNameConflicts(params) {
  const existingNormalized = /* @__PURE__ */ new Set();
  for (const name of params.existingToolNames ?? []) {
    const trimmed = name.trim();
    if (trimmed) existingNormalized.add(normalizeToolName(trimmed));
  }
  const conflicts = /* @__PURE__ */ new Set();
  const seenClientNames = /* @__PURE__ */ new Map();
  for (const tool of params.tools) {
    const rawName = (tool.function?.name ?? "").trim();
    if (!rawName) continue;
    const normalizedName = normalizeToolName(rawName);
    if (existingNormalized.has(normalizedName)) conflicts.add(rawName);
    const priorClientName = seenClientNames.get(normalizedName);
    if (priorClientName) {
      conflicts.add(priorClientName);
      conflicts.add(rawName);
      continue;
    }
    seenClientNames.set(normalizedName, rawName);
  }
  return Array.from(conflicts);
}
/** Build a recognizable error for rejecting conflicting client tool names. */
function createClientToolNameConflictError(conflicts) {
  return /* @__PURE__ */ new Error(`${CLIENT_TOOL_NAME_CONFLICT_PREFIX} ${conflicts.join(", ")}`);
}
/** Detect client tool conflict errors without depending on object identity. */
function isClientToolNameConflictError(err) {
  return err instanceof Error && err.message.startsWith(CLIENT_TOOL_NAME_CONFLICT_PREFIX);
}
/** Convert executable agent tools into session definitions with hook handling. */
function toToolDefinitions(tools, hookContext) {
  return tools.map((tool) => {
    const name = tool.name || "tool";
    const normalizedName = normalizeToolName(name);
    const beforeHookWrapped = isToolWrappedWithBeforeToolCallHook(tool);
    return {
      name,
      label: tool.label ?? name,
      ...(tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}),
      description: tool.description ?? "",
      parameters: tool.parameters,
      prepareArguments: tool.prepareArguments,
      executionMode: tool.executionMode,
      execute: async (...args) => {
        const { toolCallId, params, onUpdate, signal } = splitToolExecuteArgs(args);
        recordStructuredReplayTrustForToolCall(toolCallId, tool, hookContext?.runId);
        let executeParams = params;
        try {
          if (!beforeHookWrapped) {
            const preparedParams = await prepareToolParamsBeforeHook({
              tool,
              rawParams: params,
              ...(toolCallId ? { toolCallId } : {}),
              ...(hookContext ? { hookContext } : {}),
              ...(signal ? { signal } : {}),
            });
            const hookParams = normalizeCodeModeExecBeforeHookParams({
              tool,
              params: preparedParams,
            });
            const hookMetadata = getCodeModeExecBeforeHookMetadata({
              tool,
              params: preparedParams,
            });
            const hookOutcome = await runBeforeToolCallHook({
              toolName: name,
              params: hookParams,
              ...hookMetadata,
              toolCallId,
              ctx: hookContext,
            });
            if (hookOutcome.blocked) {
              if (hookOutcome.kind === "veto")
                return buildBlockedToolResult({
                  reason: hookOutcome.reason,
                  deniedReason: hookOutcome.deniedReason,
                  toolCallId,
                  runId: hookContext?.runId,
                });
              throw new Error(hookOutcome.reason);
            }
            executeParams = reconcileCodeModeExecBeforeHookParams({
              tool,
              originalParams: preparedParams,
              hookParams,
              adjustedParams: hookOutcome.params,
            });
            executeParams = finalizeToolParamsBeforeExecute({
              tool,
              executeParams,
              preparedParams,
            });
            recordAdjustedParamsForToolCall(toolCallId, executeParams, hookContext?.runId);
          }
          const rawResult = await tool.execute(toolCallId, executeParams, signal, onUpdate);
          return normalizeToolExecutionResult({
            toolName: normalizedName,
            result: rawResult,
          });
        } catch (err) {
          if (signal?.aborted) throw err;
          if (isBeforeToolCallBlockedError(err)) {
            logDebug(`tools: ${normalizedName} blocked by before_tool_call: ${err.reason}`);
            return buildBlockedToolResult({
              reason: err.reason,
              toolCallId,
              runId: hookContext?.runId,
            });
          }
          const described = describeToolExecutionError(err);
          if (described.stack && described.stack !== described.message)
            logDebug(`tools: ${normalizedName} failed stack:\n${described.stack}`);
          const inputPreview = describeToolFailureInputs({
            toolName: normalizedName,
            rawParams: params,
            effectiveParams: executeParams,
          });
          logError(`[tools] ${normalizedName} failed: ${described.message} ${inputPreview}`);
          return buildToolExecutionErrorResult({
            toolName: normalizedName,
            message: described.message,
          });
        }
      },
    };
  });
}
/**
 * Coerce tool-call params into a plain object.
 *
 * Some providers (e.g. Gemini) stream tool-call arguments as incremental
 * string deltas.  By the time the framework invokes the tool's `execute`
 * callback the accumulated value may still be a JSON **string** rather than
 * a parsed object.  `isPlainObject()` returns `false` for strings, which
 * caused the params to be silently replaced with `{}`.
 *
 * This helper tries `JSON.parse` when the value is a string and falls back
 * to an empty object only when parsing genuinely fails.
 */
function coerceParamsRecord(value) {
  if (isPlainObject(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length > 0)
      try {
        const parsed = JSON.parse(trimmed);
        if (isPlainObject(parsed)) return parsed;
      } catch {}
  }
  return {};
}
/** Convert client-hosted tools into pending session definitions. */
function toClientToolDefinitions(tools, onClientToolCall, hookContext) {
  return tools.map((tool) => {
    const func = tool.function;
    return {
      name: func.name,
      label: func.name,
      description: func.description ?? "",
      parameters: func.parameters,
      execute: async (...args) => {
        const { toolCallId, params } = splitToolExecuteArgs(args);
        if (onClientToolCall && typeof onClientToolCall !== "function")
          onClientToolCall.reserve?.(toolCallId, func.name);
        const initialParamsRecord = coerceParamsRecord(params);
        try {
          const outcome = await runBeforeToolCallHook({
            toolName: func.name,
            params: initialParamsRecord,
            toolCallId,
            ctx: hookContext,
          });
          if (outcome.blocked) {
            if (onClientToolCall && typeof onClientToolCall !== "function")
              onClientToolCall.discard?.(toolCallId, func.name);
            if (outcome.kind === "veto")
              return buildBlockedToolResult({
                reason: outcome.reason,
                deniedReason: outcome.deniedReason,
                toolCallId,
                runId: hookContext?.runId,
              });
            throw new Error(outcome.reason);
          }
          const adjustedParams = outcome.params;
          const paramsRecord = coerceParamsRecord(adjustedParams);
          if (onClientToolCall)
            if (typeof onClientToolCall === "function") onClientToolCall(func.name, paramsRecord);
            else onClientToolCall.complete(toolCallId, func.name, paramsRecord);
        } catch (err) {
          if (onClientToolCall && typeof onClientToolCall !== "function")
            onClientToolCall.discard?.(toolCallId, func.name);
          throw err;
        }
        return {
          ...jsonResult({
            status: "pending",
            tool: func.name,
            message: "Tool execution delegated to client",
          }),
          terminate: true,
        };
      },
    };
  });
}
//#endregion
export {
  toToolDefinitions as a,
  toClientToolDefinitions as i,
  findClientToolNameConflicts as n,
  isClientToolNameConflictError as r,
  createClientToolNameConflictError as t,
};
