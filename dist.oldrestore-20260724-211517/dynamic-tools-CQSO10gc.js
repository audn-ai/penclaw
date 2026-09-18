import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { c as emitAgentEvent } from "./agent-events-D4UsOPeT.js";
import {
  a as inferToolMetaFromArgs,
  c as createCodexAppServerToolResultExtensionRunner,
  d as runAgentHarnessBeforeCompactionHook,
  i as formatToolProgressOutput,
  n as classifyAgentHarnessTerminalOutcome,
  t as TOOL_PROGRESS_OUTPUT_MAX_CHARS,
  u as runAgentHarnessAfterCompactionHook,
} from "./agent-harness-runtime-BjY9gsEs.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import {
  f as runBeforeToolCallHook,
  h as consumePreExecutionBlockedToolCall,
  i as getBeforeToolCallFailureDisposition,
  m as consumeAdjustedParamsForToolCall,
  p as wrapToolWithBeforeToolCallHook,
  r as finalizeToolTerminalPresentation,
} from "./agent-tools.before-tool-call-B7gv78c3.js";
import { t as formatApprovalDisplayPath } from "./approval-display-paths-DlQSsCnq.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt.thread-helpers-Di7wVu5W.js";
import {
  n as createAgentToolResultMiddlewareRunner,
  t as buildEmbeddedAttemptToolRunContext,
} from "./attempt.tool-run-context-DzOtUuEC.js";
import { r as formatCodexDisplayText } from "./command-formatters-BGtw1ew1.js";
import { d as readCodexPluginConfig } from "./config-C1imjxk6.js";
import {
  d as hasPendingInternalDiagnosticEvent,
  o as emitTrustedDiagnosticEvent,
} from "./diagnostic-events-5-gsFhkM.js";
import {
  n as isDeliveredMessageToolOnlySourceReplyResult,
  r as isDeliveredMessagingToolResult,
} from "./embedded-agent-message-tool-source-reply-C7h4djeo.js";
import {
  a as isMessagingToolSendAction,
  r as isMessagingTool,
} from "./embedded-agent-messaging-C_REpMqa.js";
import {
  a as extractMessagingToolSend,
  f as filterToolResultMediaUrls,
  g as sanitizeToolResult,
  o as extractMessagingToolSendResult,
  u as extractToolResultMediaArtifact,
} from "./embedded-agent-subscribe.tools-Bv1-LBFe.js";
import { r as formatErrorMessage$1 } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import {
  D as isToolWrappedWithBeforeToolCallHook,
  O as setBeforeToolCallDiagnosticsEnabled,
  t as callGatewayTool,
  x as getChannelAgentToolMeta,
} from "./gateway-Dyh1k_4Q.js";
import { o as normalizeHeartbeatToolResponse } from "./heartbeat-tool-response-B3cJVfMo.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-BL_Cd-K4.js";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-jOYXwwnX.js";
import { n as generatedImageAssetFromBase64 } from "./image-generation-RauRpKhi.js";
import { A as isHostScopedAgentToolActive } from "./local-model-lean-D3O2n_2v.js";
import { t as log } from "./logger-C5RMMskO.js";
import { p as resolveModelAuthMode } from "./model-auth-BWFdcEzF.js";
import {
  c as resolveNativeHookRelayDeferredToolApproval,
  n as hasNativeHookRelayInvocation,
  o as registerNativeHookRelay,
  r as invokeNativeHookRelay,
} from "./native-hook-relay-WEC9uRFL.js";
import {
  n as readCodexNotificationThreadId,
  r as readCodexNotificationTurnId,
} from "./notification-correlation-BtXfV0Pa.js";
import {
  a as addTimerTimeoutGraceMs,
  j as resolveTimerTimeoutMs,
  o as asDateTimestampMs,
  p as finiteSecondsToTimerSafeMilliseconds,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { l as supportsModelTools } from "./openai-transport-stream-BFFr80cz.js";
import {
  i as isJsonObject,
  n as CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE,
} from "./protocol-BMifTfdW.js";
import "./logging-core-QnL1iLWg.js";
import "./number-runtime-B-n-wjMn.js";
import "./sandbox-LwuCYzj8.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import { c as readCodexTurn } from "./protocol-validators-CfDblFS1.js";
import { n as formatCodexUsageLimitErrorMessage } from "./rate-limits-CGMwC7L1.js";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as redactSensitiveFieldValue, u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import {
  a as resolveCodexNodeExecToolOverrides,
  i as resolveCodexNativeExecutionPolicy,
} from "./sandbox-guard-D4QOS1Tr.js";
import { Ht as normalizeUsage } from "./session-accessor-PZVNxFCV.js";
import "./routing-CwvmVRHd.js";
import { a as isSubagentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  l as parseSessionEntries,
  n as buildSessionContext,
  s as migrateSessionEntries,
} from "./session-manager-BD4l9VJc.js";
import "./media-store-CLUM1Syr.js";
import "./agent-runtime-BiQiwmwD.js";
import { i as listSessionEntries } from "./session-store-runtime-BwE6SlGz.js";
import { a as readSessionTranscriptEvents } from "./session-transcript-runtime-B2hvNHEH.js";
import "./diagnostic-runtime-CpZ_ot5_.js";
import { d as releaseLeasedSharedCodexAppServerClient } from "./shared-client-a36Mluj-.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import "./agent-sessions-DUv992OK.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { P as formatToolAggregate } from "./streaming-D_YE0SPS.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import {
  C as sanitizeInlineImageDataUrl,
  D as normalizeCodexDynamicToolName,
  E as isForcedPrivateQaCodexRuntime,
  S as sanitizeCodexHistoryImagePayloads,
  T as isCrestodianOnlyCodexDynamicToolAllowlist,
  v as resolveCodexWebSearchPlan,
  w as filterCodexDynamicTools,
  x as invalidInlineImageText,
} from "./thread-lifecycle-BI8tSeEg.js";
import { i as isReplaySafeToolCall } from "./tool-mutation-CjFyaPPn.js";
import { n as isToolAllowed } from "./tool-policy-fLngst7L.js";
import {
  a as resolveToolExecutionErrorKind,
  n as isToolResultError,
  o as resolveToolResultFailureKind,
  t as formatToolExecutionErrorMessage,
} from "./tool-result-error-1qgstja-.js";
import {
  i as projectRuntimeToolInputSchema,
  t as filterProviderNormalizableTools,
} from "./tool-schema-projection-ZrMdwk4s.js";
import { i as getPluginToolMeta } from "./tools-K3NqAe9E.js";
import { n as normalizeAgentRuntimeTools } from "./tools-M6Rtal9l.js";
import {
  c as attachCodexMirrorIdentity,
  s as promptSnapshot,
} from "./transcript-mirror-CqPkRu1h.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/codex/src/app-server/tool-abort-terminal-reason.ts
/** Leaf helper shared by native and dynamic tool diagnostics. */
const CODEX_TIMEOUT_ABORT_REASONS = /* @__PURE__ */ new Set([
  "codex_startup_timeout",
  "turn_completion_idle_timeout",
  "turn_progress_idle_timeout",
  "turn_terminal_idle_timeout",
]);
/** Preserves timeout provenance when an enclosing run aborts an active tool. */
function resolveCodexToolAbortTerminalReason(signal) {
  try {
    const reason = signal.reason;
    if (typeof reason === "string") {
      if (CODEX_TIMEOUT_ABORT_REASONS.has(reason)) return "timed_out";
      return reason === "client_closed" ? "failed" : "cancelled";
    }
    if (reason && typeof reason === "object") {
      const record = reason;
      if (record.name === "TimeoutError" || record.reason === "timeout") return "timed_out";
    }
  } catch {
    return "cancelled";
  }
  return "cancelled";
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-execution.ts
/**
 * Timeout, terminal-release, and diagnostic helpers for Codex dynamic tool
 * calls.
 */
/** Default timeout for Codex dynamic tool calls. */
const CODEX_DYNAMIC_TOOL_TIMEOUT_MS = 9e4;
/** Hard cap for per-call Codex dynamic tool timeout overrides. */
const CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS = 6e5;
const CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS = 3e4;
const CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS = 12e4;
const CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS = 3e4;
const CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS = 3e4;
/** Timeout for image-understanding style dynamic tool calls. */
const CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS = 6e4;
/** Timeout for message-delivery dynamic tool calls. */
const CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS = CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS;
const LOG_FIELD_MAX_LENGTH = 160;
function normalizeLogField(value) {
  if (typeof value !== "string") return;
  const normalized = value
    .replaceAll(String.fromCharCode(27), " ")
    .replaceAll("\r", " ")
    .replaceAll("\n", " ")
    .replaceAll("	", " ")
    .trim();
  if (!normalized) return;
  return normalized.length > LOG_FIELD_MAX_LENGTH
    ? `${truncateUtf16Safe(normalized, LOG_FIELD_MAX_LENGTH - 3)}...`
    : normalized;
}
function readNumericTimeoutMs(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value === "string") {
    const parsed = parseStrictNonNegativeInteger(value);
    if (parsed !== void 0) return Math.max(0, Math.floor(parsed));
  }
}
function formatDynamicToolTimeoutDetails(params) {
  const tool = normalizeLogField(params.call.tool) ?? "unknown";
  const baseMeta = {
    tool: params.call.tool,
    toolCallId: params.call.callId,
    threadId: params.call.threadId,
    turnId: params.call.turnId,
    timeoutMs: params.timeoutMs,
    timeoutKind: "codex_dynamic_tool_rpc",
  };
  if (tool !== "process" || !isJsonObject(params.call.arguments))
    return {
      responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms while running tool ${tool}.`,
      consoleMessage: `codex dynamic tool timeout: tool=${tool} toolTimeoutMs=${params.timeoutMs}; per-tool-call watchdog, not session idle`,
      meta: baseMeta,
    };
  const action = normalizeLogField(params.call.arguments.action);
  const sessionId = normalizeLogField(params.call.arguments.sessionId);
  const requestedTimeoutMs = readNumericTimeoutMs(params.call.arguments.timeout);
  const actionPart = action ? ` action=${action}` : "";
  const sessionPart = sessionId ? ` sessionId=${sessionId}` : "";
  const requestedPart =
    requestedTimeoutMs === void 0 ? "" : ` requestedWaitMs=${requestedTimeoutMs}`;
  const retryHint =
    action === "poll"
      ? "; repeated lines usually mean process-poll retry churn, not model progress"
      : "";
  const responseTarget =
    action || sessionId
      ? ` while waiting for process${actionPart}${sessionPart}`
      : " while waiting for the process tool";
  return {
    responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms${responseTarget}. This is a tool RPC timeout, not a session idle timeout.`,
    consoleMessage: `codex process tool timeout:${actionPart}${sessionPart} toolTimeoutMs=${params.timeoutMs}${requestedPart}; per-tool-call watchdog, not session idle${retryHint}`,
    meta: {
      ...baseMeta,
      processAction: action,
      processSessionId: sessionId,
      processRequestedTimeoutMs: requestedTimeoutMs,
    },
  };
}
/**
 * Runs a dynamic tool call with run-abort and per-call timeout handling,
 * returning a Codex protocol response instead of throwing.
 */
async function handleDynamicToolCallWithTimeout(params) {
  let didNotifyAgentToolResult = false;
  const notifyAgentToolResult = (event) => {
    if (didNotifyAgentToolResult) return;
    didNotifyAgentToolResult = true;
    try {
      params.onAgentToolResult?.(event);
    } catch (error) {
      log.warn(`onAgentToolResult handler failed: tool=${params.call.tool} error=${String(error)}`);
    }
  };
  const notifyFailedToolResult = (message, terminalReason = "failed") => {
    notifyAgentToolResult({
      toolName: params.call.tool,
      result: {
        content: [
          {
            type: "text",
            text: message,
          },
        ],
        details: {
          status: terminalReason,
          error: message,
        },
      },
      isError: true,
    });
  };
  if (params.signal.aborted) {
    const message = "OpenClaw dynamic tool call aborted before execution.";
    const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
    params.onFallbackSelected?.();
    notifyFailedToolResult(message, terminalReason);
    return failedDynamicToolResponse(message, { terminalReason });
  }
  const controller = new AbortController();
  let timeout;
  let timedOut = false;
  let resolveAbort;
  const abortFromRun = () => {
    const message = "OpenClaw dynamic tool call aborted.";
    const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
    params.onFallbackSelected?.();
    controller.abort(params.signal.reason ?? /* @__PURE__ */ new Error(message));
    notifyFailedToolResult(message, terminalReason);
    resolveAbort?.(
      failedDynamicToolResponse(message, {
        sideEffectEvidence: true,
        terminalReason,
      }),
    );
  };
  const abortPromise = new Promise((resolve) => {
    resolveAbort = resolve;
  });
  const timeoutPromise = new Promise((resolve) => {
    const timeoutMs = clampDynamicToolTimeoutMs(params.timeoutMs);
    timeout = setTimeout(() => {
      timedOut = true;
      const timeoutDetails = formatDynamicToolTimeoutDetails({
        call: params.call,
        timeoutMs,
      });
      params.onFallbackSelected?.();
      controller.abort(new Error(timeoutDetails.responseMessage));
      params.onTimeout?.();
      log.warn("codex dynamic tool call timed out", {
        ...timeoutDetails.meta,
        consoleMessage: timeoutDetails.consoleMessage,
      });
      notifyFailedToolResult(timeoutDetails.responseMessage, "timed_out");
      resolve(
        failedDynamicToolResponse(timeoutDetails.responseMessage, {
          sideEffectEvidence: true,
          terminalReason: "timed_out",
        }),
      );
    }, timeoutMs);
    timeout.unref?.();
  });
  try {
    params.signal.addEventListener("abort", abortFromRun, { once: true });
    if (params.signal.aborted) abortFromRun();
    const response = await Promise.race([
      params.toolBridge.handleToolCall(params.call, {
        signal: controller.signal,
        onAgentToolResult: notifyAgentToolResult,
        toolCallOrdinal: params.toolCallOrdinal,
      }),
      abortPromise,
      timeoutPromise,
    ]);
    if (!response.success && !didNotifyAgentToolResult)
      notifyFailedToolResult(
        readDynamicToolResponseText(response),
        response.diagnosticTerminalReason ?? "failed",
      );
    return response;
  } catch (error) {
    const terminalReason = params.signal.aborted
      ? resolveCodexToolAbortTerminalReason(params.signal)
      : resolveToolExecutionErrorKind(error);
    const message = formatToolExecutionErrorMessage(error, "OpenClaw dynamic tool call failed.");
    notifyFailedToolResult(message, terminalReason);
    return failedDynamicToolResponse(message, {
      sideEffectEvidence: true,
      terminalReason,
    });
  } finally {
    if (timeout) clearTimeout(timeout);
    params.signal.removeEventListener("abort", abortFromRun);
    resolveAbort = void 0;
    if (!timedOut && !controller.signal.aborted)
      controller.abort(/* @__PURE__ */ new Error("OpenClaw dynamic tool call finished."));
  }
}
function readDynamicToolResponseText(response) {
  return (
    response.contentItems
      .flatMap((item) =>
        item.type === "inputText" && typeof item.text === "string" ? [item.text] : [],
      )
      .join("\n")
      .trim() || "OpenClaw dynamic tool call failed."
  );
}
function failedDynamicToolResponse(message, options) {
  const response = {
    contentItems: [
      {
        type: "inputText",
        text: message,
      },
    ],
    success: false,
  };
  Object.defineProperty(response, "diagnosticTerminalType", {
    configurable: true,
    enumerable: false,
    value: "error",
  });
  Object.defineProperty(response, "diagnosticTerminalReason", {
    configurable: true,
    enumerable: false,
    value: options?.terminalReason ?? "failed",
  });
  if (options?.sideEffectEvidence === true)
    Object.defineProperty(response, "sideEffectEvidence", {
      configurable: true,
      enumerable: false,
      value: true,
    });
  return response;
}
/** Strips OpenClaw-only metadata before sending a dynamic tool response to Codex. */
function toCodexDynamicToolProtocolResponse(response) {
  return {
    contentItems: response.contentItems,
    success: response.success,
  };
}
/** Adds async-started progress details when a tool result continues out of band. */
function toCodexDynamicToolProgressResponse(response, protocolResponse) {
  if (response.asyncStarted !== true) return protocolResponse;
  return {
    ...protocolResponse,
    details: {
      async: true,
      status: "started",
    },
  };
}
/** Decides whether a terminal dynamic tool response can release the Codex turn. */
function shouldReleaseTurnAfterTerminalDynamicTool(state) {
  return (
    !state.completed &&
    !state.aborted &&
    state.responseSuccess &&
    !state.currentTurnHadNonTerminalDynamicToolResult &&
    state.activeAppServerTurnRequests === 0 &&
    state.activeTurnItemIdsCount === 0 &&
    state.pendingOpenClawDynamicToolCompletionIdsCount === 0
  );
}
/** Returns true when a non-async result should block terminal-release shortcuts. */
function shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response) {
  return response.asyncStarted !== true;
}
/** Resolves whether terminal diagnostic state should release, wait, or stay idle. */
function resolveTerminalDynamicToolBatchAction(state) {
  if (
    state.activeAppServerTurnRequests > 0 ||
    state.activeTurnItemIdsCount > 0 ||
    state.pendingOpenClawDynamicToolCompletionIdsCount > 0
  )
    return "wait";
  if (state.currentTurnHadNonTerminalDynamicToolResult) return "clear-nonterminal-batch";
  if (state.hasPendingTerminalDynamicToolRelease) return "release-pending-terminal";
  return "idle";
}
/** Returns true for diagnostic events that terminate a dynamic tool call. */
function isDynamicToolTerminalDiagnosticEvent(event) {
  return (
    event.type === "tool.execution.completed" ||
    event.type === "tool.execution.error" ||
    event.type === "tool.execution.blocked"
  );
}
/** Matches terminal diagnostics to a specific dynamic tool call id/name. */
function isMatchingDynamicToolTerminalDiagnostic(params) {
  if (params.event.toolCallId !== params.call.callId || params.event.toolName !== params.call.tool)
    return false;
  if (params.runId !== void 0) return params.event.runId === params.runId;
  if (params.sessionId !== void 0) return params.event.sessionId === params.sessionId;
  if (params.sessionKey !== void 0) return params.event.sessionKey === params.sessionKey;
  return (
    params.event.runId === void 0 &&
    params.event.sessionId === void 0 &&
    params.event.sessionKey === void 0
  );
}
/** Checks pending diagnostics for a terminal event matching a tool call. */
function hasPendingDynamicToolTerminalDiagnostic(params) {
  return hasPendingInternalDiagnosticEvent((event) => {
    if (!isDynamicToolTerminalDiagnosticEvent(event)) return false;
    return isMatchingDynamicToolTerminalDiagnostic({
      event,
      call: params.call,
      runId: params.runId,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
    });
  });
}
/** Resolves per-tool timeout, applying media/message defaults and hard caps. */
function resolveDynamicToolCallTimeoutMs(params) {
  if (params.call.tool === "computer")
    return clampDynamicToolTimeoutMs(readComputerToolTimeoutMs(params.call.arguments));
  if (params.call.tool === "message") return CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS;
  return clampDynamicToolTimeoutMs(
    readDynamicToolCallTimeoutMs(params.call.arguments) ??
      readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ??
      CODEX_DYNAMIC_TOOL_TIMEOUT_MS,
  );
}
function readComputerToolTimeoutMs(value) {
  const args = isJsonObject(value) ? value : void 0;
  const action = typeof args?.action === "string" ? args.action : void 0;
  const gatewayTimeoutMs =
    readPositiveFiniteTimeoutMs(args?.timeoutMs) ?? CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS;
  const gatewayCallCount = action === "screenshot" || action === "wait" ? 3 : 4;
  return (
    (action === "wait" || action === "hold_key"
      ? Math.max(0, Number(args?.duration) || 0) * 1e3
      : 0) +
    gatewayCallCount * gatewayTimeoutMs +
    CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS
  );
}
function readDynamicToolCallTimeoutMs(value) {
  if (!isJsonObject(value)) return;
  const timeoutMs = readPositiveFiniteTimeoutMs(value.timeoutMs);
  if (timeoutMs !== void 0) return timeoutMs;
  const timeoutSecondsMs = readDynamicToolTimeoutSecondsAsMs(value.timeoutSeconds);
  return timeoutSecondsMs === void 0
    ? void 0
    : addTimerTimeoutGraceMs(timeoutSecondsMs, CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS);
}
function readConfiguredDynamicToolTimeoutMs(toolName, config) {
  if (toolName === "image_generate") {
    const imageGenerationModel = config?.agents?.defaults?.imageGenerationModel;
    if (!imageGenerationModel || typeof imageGenerationModel !== "object")
      return CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
    return (
      readPositiveFiniteTimeoutMs(imageGenerationModel.timeoutMs) ??
      CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS
    );
  }
  if (toolName === "image")
    return (
      readTimeoutSecondsAsMs(config?.tools?.media?.image?.timeoutSeconds) ??
      CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS
    );
  if (toolName === "message") return CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS;
}
function readTimeoutSecondsAsMs(value) {
  const seconds = readPositiveFiniteTimeoutMs(value);
  return seconds === void 0 ? void 0 : seconds * 1e3;
}
function readDynamicToolTimeoutSecondsAsMs(value) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value <= 0
  )
    return;
  return value * 1e3;
}
function readPositiveFiniteTimeoutMs(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
function clampDynamicToolTimeoutMs(timeoutMs) {
  return Math.max(1, Math.min(CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS, Math.floor(timeoutMs)));
}
//#endregion
//#region extensions/codex/src/app-server/local-runtime-attribution.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function normalizeRuntimeId(value) {
  return value?.trim().toLowerCase() ?? "";
}
/** Maps local Codex runtime plans onto the provider/api pair exposed to event projection. */
function resolveCodexLocalRuntimeAttribution(params) {
  const authProfileProvider = normalizeRuntimeId(
    params.runtimePlan?.auth?.authProfileProviderForAuth,
  );
  if (
    normalizeRuntimeId(params.runtimePlan?.observability.harnessId) === "codex" &&
    authProfileProvider !== OPENAI_PROVIDER_ID &&
    normalizeRuntimeId(params.model.provider) === OPENAI_PROVIDER_ID &&
    normalizeRuntimeId(params.model.api) === OPENAI_RESPONSES_API
  )
    return {
      provider: OPENAI_PROVIDER_ID,
      api: OPENAI_CODEX_RESPONSES_API,
    };
  return {
    provider: params.provider,
    api: params.model.api,
  };
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay-state.ts
const pending = /* @__PURE__ */ new Set();
/** Owns delayed hook-relay cleanup across runtime scheduling and test teardown. */
const nativeHookRelayUnregisterQueue = {
  add(entry) {
    pending.add(entry);
  },
  delete(entry) {
    return pending.delete(entry);
  },
  flush() {
    while (pending.size > 0) {
      const entry = pending.values().next().value;
      if (!entry) return;
      clearTimeout(entry.timeout);
      entry.unregister();
    }
  },
  clear() {
    for (const entry of pending) clearTimeout(entry.timeout);
    pending.clear();
  },
};
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay.ts
/**
 * Bridges Codex native hook callbacks into OpenClaw's native hook relay so
 * app-server tool events can still run OpenClaw policy and diagnostics.
 */
/** Codex hook events that can be registered through OpenClaw's native relay. */
const CODEX_NATIVE_HOOK_RELAY_EVENTS = [
  "pre_tool_use",
  "post_tool_use",
  "permission_request",
  "before_agent_finalize",
];
const CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS =
  CODEX_NATIVE_HOOK_RELAY_EVENTS.filter((event) => event !== "permission_request");
const CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS = 30 * 6e4;
/** Extra relay lifetime after the expected turn budget, preventing late hook drops. */
const CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS = 5 * 6e4;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS = 250;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS = 1e3;
const CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC = 10;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS = 1e4;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS = 5e3;
/** Defers relay unregister so late native hook subprocesses can still resolve. */
function scheduleCodexNativeHookRelayUnregister(params) {
  let pending;
  const unregister = () => {
    if (!pending) return;
    const current = pending;
    pending = void 0;
    if (!nativeHookRelayUnregisterQueue.delete(current)) return;
    params.relay.unregister();
  };
  const timeout = setTimeout(
    unregister,
    resolveCodexNativeHookRelayUnregisterGraceMs(params.hookTimeoutSec),
  );
  pending = {
    timeout,
    unregister,
  };
  nativeHookRelayUnregisterQueue.add(pending);
  timeout.unref();
}
/** Computes the delayed unregister window from Codex's hook timeout. */
function resolveCodexNativeHookRelayUnregisterGraceMs(hookTimeoutSec) {
  const hookTimeoutMs =
    finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 0;
  return Math.max(
    CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS,
    addTimerTimeoutGraceMs(hookTimeoutMs, CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS) ?? 0,
  );
}
/** Records a native pre-tool failure that Codex does not project as a tool item. */
function emitCodexNativePreToolUseFailureDiagnostic(params) {
  emitTrustedDiagnosticEvent({
    type: "tool.execution.error",
    ...(params.agentId ? { agentId: params.agentId } : {}),
    sessionId: params.sessionId,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    runId: params.runId,
    toolName: params.failure.toolName,
    toolCallId: params.failure.toolCallId,
    durationMs: params.failure.durationMs,
    errorCategory: "before_tool_call",
    terminalReason:
      params.terminalReason ??
      (params.signal?.aborted
        ? resolveCodexToolAbortTerminalReason(params.signal)
        : params.failure.disposition),
    ...(params.sourceTimestampMs !== void 0 ? { sourceTimestampMs: params.sourceTimestampMs } : {}),
  });
}
/** Registers an OpenClaw native hook relay for a Codex app-server turn. */
function createCodexNativeHookRelay(params) {
  if (params.options?.enabled === false) return;
  return registerNativeHookRelay({
    provider: "codex",
    relayId: buildCodexNativeHookRelayId({
      agentId: params.agentId,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
    }),
    ...(params.generation ? { generation: params.generation } : {}),
    ...(params.generationMismatchGraceMs
      ? { generationMismatchGraceMs: params.generationMismatchGraceMs }
      : {}),
    ...(params.agentId ? { agentId: params.agentId } : {}),
    sessionId: params.sessionId,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    ...(params.config ? { config: params.config } : {}),
    runId: params.runId,
    ...(params.channelId ? { channelId: params.channelId } : {}),
    allowedEvents: params.events,
    ttlMs: resolveCodexNativeHookRelayTtlMs({
      explicitTtlMs: params.options?.ttlMs,
      attemptTimeoutMs: params.attemptTimeoutMs,
      startupTimeoutMs: params.startupTimeoutMs,
      turnStartTimeoutMs: params.turnStartTimeoutMs,
    }),
    signal: params.signal,
    onPreToolUseFailure: params.onPreToolUseFailure,
    command: {
      nice: 10,
      timeoutMs: params.options?.gatewayTimeoutMs,
    },
  });
}
/** Selects the native hook events Codex should install for the current approval mode. */
function resolveCodexNativeHookRelayEvents(params) {
  if (params.configuredEvents?.length) return params.configuredEvents;
  return params.appServer.approvalPolicy === "never"
    ? CODEX_NATIVE_HOOK_RELAY_EVENTS
    : CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS;
}
/** Derives the native hook relay TTL from the turn budget unless explicitly configured. */
function resolveCodexNativeHookRelayTtlMs(params) {
  if (params.explicitTtlMs !== void 0) return params.explicitTtlMs;
  const relayBudgetMs =
    params.attemptTimeoutMs +
    params.startupTimeoutMs +
    params.turnStartTimeoutMs +
    CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
  return Math.max(CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS, Math.floor(relayBudgetMs));
}
/** Builds a stable relay id scoped to the agent and session identity. */
function buildCodexNativeHookRelayId(params) {
  const hash = createHash("sha256");
  hash.update("openclaw:codex:native-hook-relay:v1");
  hash.update("\0");
  hash.update(params.agentId?.trim() || "");
  hash.update("\0");
  hash.update(params.sessionKey?.trim() || params.sessionId);
  return `codex-${hash.digest("hex").slice(0, 40)}`;
}
const CODEX_HOOK_EVENT_BY_NATIVE_EVENT = {
  pre_tool_use: "PreToolUse",
  post_tool_use: "PostToolUse",
  permission_request: "PermissionRequest",
  before_agent_finalize: "Stop",
};
const CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT = {
  pre_tool_use: "pre_tool_use",
  post_tool_use: "post_tool_use",
  permission_request: "permission_request",
  before_agent_finalize: "stop",
};
const CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS = [
  "/<session-flags>/config.toml",
  "<session-flags>/config.toml",
];
/** Builds the Codex config overlay that installs trusted command hooks for relay events. */
function buildCodexNativeHookRelayConfig(params) {
  const events = params.events?.length ? params.events : CODEX_NATIVE_HOOK_RELAY_EVENTS;
  const selectedEvents = new Set(events);
  const config = { "features.hooks": true };
  const hookState = {};
  for (const event of CODEX_NATIVE_HOOK_RELAY_EVENTS) {
    const codexEvent = CODEX_HOOK_EVENT_BY_NATIVE_EVENT[event];
    const selected = selectedEvents.has(event);
    const shouldRelay = params.relay.shouldRelayEvent(event);
    if (!selected || (!shouldRelay && !(selected && event === "pre_tool_use" && !shouldRelay))) {
      if (selected || params.clearOmittedEvents) config[`hooks.${codexEvent}`] = [];
      if (params.clearOmittedEvents)
        for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS)
          hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = {
            enabled: false,
          };
      continue;
    }
    const timeout = normalizeHookTimeoutSec(params.hookTimeoutSec);
    const command = params.relay.commandForEvent(event, {
      timeoutMs: resolveCodexNativeHookRelayCommandTimeoutMs(timeout),
    });
    config[`hooks.${codexEvent}`] = [
      {
        hooks: [
          {
            type: "command",
            command,
            timeout,
            async: false,
            statusMessage: "OpenClaw native hook relay",
          },
        ],
      },
    ];
    const state = {
      enabled: true,
      trusted_hash: codexCommandHookTrustedHash({
        event,
        command,
        timeout,
        statusMessage: "OpenClaw native hook relay",
      }),
    };
    for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS)
      hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = state;
  }
  config["hooks.state"] = hookState;
  return config;
}
/** Builds a Codex config overlay that disables native hooks and clears hook arrays. */
function buildCodexNativeHookRelayDisabledConfig() {
  return {
    "features.hooks": false,
    "hooks.PreToolUse": [],
    "hooks.PostToolUse": [],
    "hooks.PermissionRequest": [],
    "hooks.Stop": [],
  };
}
function normalizeHookTimeoutSec(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.ceil(value)
    : CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC;
}
function resolveCodexNativeHookRelayCommandTimeoutMs(hookTimeoutSec) {
  const parentTimeoutMs =
    finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 5e3;
  const parentMarginMs = Math.min(
    CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS,
    Math.max(CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS, Math.floor(parentTimeoutMs / 5)),
  );
  return Math.max(1, parentTimeoutMs - parentMarginMs);
}
function codexCommandHookTrustedHash(params) {
  const identity = {
    event_name: CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[params.event],
    hooks: [
      {
        async: false,
        command: params.command,
        statusMessage: params.statusMessage,
        timeout: params.timeout,
        type: "command",
      },
    ],
  };
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(sortJsonValue(identity)))
    .digest("hex")}`;
}
function sortJsonValue(value) {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortJsonValue);
  const sorted = {};
  for (const [key, entry] of Object.entries(value).toSorted(([left], [right]) =>
    left.localeCompare(right),
  ))
    sorted[key] = sortJsonValue(entry);
  return sorted;
}
//#endregion
//#region extensions/codex/src/app-server/session-history.ts
/**
 * Reads OpenClaw session history for Codex transcript mirroring and sanitizes
 * image payloads before replaying messages into the app-server projector.
 */
function isMissingFileError(error) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
/** Returns sanitized session-context messages for a Codex mirrored session file. */
async function readCodexMirroredSessionHistoryMessages(target) {
  try {
    const entries = await readCodexMirroredSessionEntries(target);
    if (entries.length === 0) return [];
    const firstEntry = entries[0];
    if (firstEntry?.type !== "session" || typeof firstEntry.id !== "string") return;
    migrateSessionEntries(entries);
    return sanitizeCodexHistoryImagePayloads(
      buildSessionContext(
        entries.filter((entry) => {
          return (
            entry !== null &&
            typeof entry === "object" &&
            !Array.isArray(entry) &&
            entry.type !== "session"
          );
        }),
      ).messages,
      "codex mirrored history",
    );
  } catch (error) {
    if (isMissingFileError(error)) return [];
    return;
  }
}
async function readCodexMirroredSessionEntries(target) {
  const sqliteMarker = parseSqliteSessionFileMarker(target.sessionFile);
  if (sqliteMarker) {
    if (
      sqliteMarker.sessionId !== target.sessionId ||
      (target.agentId !== void 0 && sqliteMarker.agentId !== target.agentId)
    )
      return [];
    const sessionKey = resolveSqliteMarkerSessionKey(target, sqliteMarker);
    if (!sessionKey) return [];
    return await readSessionTranscriptEvents({
      agentId: sqliteMarker.agentId,
      sessionId: sqliteMarker.sessionId,
      sessionKey,
      storePath: sqliteMarker.storePath,
    });
  }
  return parseSessionEntries(await fs.readFile(target.sessionFile, "utf-8"));
}
function resolveSqliteMarkerSessionKey(target, marker) {
  const explicitSessionKey = target.sessionKey?.trim();
  if (explicitSessionKey) return explicitSessionKey;
  const entries = listSessionEntries({
    agentId: marker.agentId,
    storePath: marker.storePath,
  });
  return (
    entries.find(({ entry }) => {
      return entry.sessionId === marker.sessionId && entry.sessionFile === target.sessionFile;
    }) ??
    entries.find(({ entry }) => {
      return entry.sessionId === marker.sessionId;
    })
  )?.sessionKey;
}
//#endregion
//#region extensions/codex/src/app-server/tool-progress-normalization.ts
/**
 * Normalizes and sanitizes Codex dynamic-tool progress payloads before they are
 * emitted into OpenClaw events or logs.
 */
/** Maps OpenClaw tool-progress config to the mode used by Codex progress metadata. */
function resolveCodexToolProgressDetailMode(value) {
  return value === "raw" ? "raw" : "explain";
}
/** Recursively redacts sensitive strings and handles circular values in event payloads. */
function sanitizeCodexAgentEventValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (typeof value === "string") return redactToolPayloadText(value);
  if (Array.isArray(value)) {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    return value.map((entry) => sanitizeCodexAgentEventValue(entry, seen));
  }
  if (value && typeof value === "object") {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    const out = {};
    for (const [key, child] of Object.entries(value))
      out[key] =
        typeof child === "string"
          ? redactSensitiveFieldValue(key, child)
          : sanitizeCodexAgentEventValue(child, seen);
    return out;
  }
  return value;
}
/** Sanitizes a record-shaped Codex agent event payload. */
function sanitizeCodexAgentEventRecord(value) {
  return sanitizeCodexAgentEventValue(value);
}
/** Sanitizes dynamic-tool arguments before diagnostic/event emission. */
function sanitizeCodexToolArguments(value) {
  if (!isJsonObject(value)) return;
  return sanitizeCodexAgentEventRecord(value);
}
/** Sanitizes a Codex dynamic-tool response before diagnostic/event emission. */
function sanitizeCodexToolResponse(response) {
  return sanitizeCodexAgentEventRecord(response);
}
/** Infers compact human-readable tool metadata from Codex dynamic-tool arguments. */
function inferCodexDynamicToolMeta(call, detailMode) {
  return inferToolMetaFromArgs(call.tool, call.arguments, { detailMode });
}
//#endregion
//#region extensions/codex/src/app-server/event-projector.ts
/** Projects metadata-only lifecycle diagnostics for native tool items. */
var CodexNativeToolLifecycleProjector = class {
  constructor(context, threadId, turnId, options = {}) {
    this.context = context;
    this.threadId = threadId;
    this.turnId = turnId;
    this.options = options;
    this.startedAtByItem = /* @__PURE__ */ new Map();
    this.activeItems = /* @__PURE__ */ new Map();
    this.webSearchCompletionByItem = /* @__PURE__ */ new Map();
    this.completedItemIds = /* @__PURE__ */ new Set();
    this.approvalFailureDispositionByItem = /* @__PURE__ */ new Map();
    this.preToolUseFailureByItem = /* @__PURE__ */ new Map();
    this.finalized = false;
  }
  handleNotification(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    if (
      !params ||
      readCodexNotificationThreadId(params) !== this.threadId ||
      readCodexNotificationTurnId(params) !== this.turnId
    )
      return;
    if (notification.method === "turn/completed") {
      const turn = readCodexTurn(params.turn);
      if (!turn || turn.id !== this.turnId) return;
      for (const item of turn.items ?? []) this.recordSnapshotItem(item);
      return;
    }
    if (notification.method === "rawResponseItem/completed") {
      const item = isJsonObject(params.item) ? params.item : void 0;
      if (item) this.recordRawWebSearchResult(item);
      return;
    }
    if (notification.method !== "item/started" && notification.method !== "item/completed") return;
    const item = readItem(params.item);
    if (!item) return;
    this.recordItem({
      phase: notification.method === "item/started" ? "start" : "result",
      item,
      sourceTimestampMs: asDateTimestampMs(
        notification.method === "item/started" ? params.startedAtMs : params.completedAtMs,
      ),
    });
  }
  recordItem(params) {
    const toolName = auditNativeToolName(params.item);
    if (!toolName || this.completedItemIds.has(params.item.id)) return;
    if (params.phase === "start") {
      this.recordStarted(
        params.item.id,
        toolName,
        auditNativeToolUnfinishedStatus(params.item),
        params.sourceTimestampMs,
      );
      return;
    }
    if (params.item.type === "webSearch") {
      this.webSearchCompletionByItem.set(params.item.id, {
        runWasAborted: this.options.runAbortSignal?.aborted === true,
        sourceTimestampMs: params.sourceTimestampMs,
      });
      return;
    }
    const itemDurationMs =
      typeof params.item.durationMs === "number" ? params.item.durationMs : void 0;
    this.recordTerminal(params.item.id, toolName, auditNativeToolTerminalStatus(params.item), {
      itemDurationMs,
      sourceTimestampMs: params.sourceTimestampMs,
    });
  }
  recordApprovalFailureDisposition(toolCallId, disposition) {
    if (!this.completedItemIds.has(toolCallId))
      this.approvalFailureDispositionByItem.set(toolCallId, disposition);
  }
  recordPreToolUseFailure(failure, runWasAborted = this.options.runAbortSignal?.aborted === true) {
    if (this.completedItemIds.has(failure.toolCallId)) return;
    const record = {
      failure,
      terminalReason:
        runWasAborted && this.options.runAbortSignal
          ? resolveCodexToolAbortTerminalReason(this.options.runAbortSignal)
          : failure.disposition,
    };
    if (this.finalized) {
      this.completedItemIds.add(failure.toolCallId);
      this.emitPreToolUseFailure(record, failure.toolName, failure.durationMs);
      return;
    }
    this.preToolUseFailureByItem.set(failure.toolCallId, record);
  }
  recordRawWebSearchResult(item) {
    if (readString$2(item, "type") !== "web_search_call") return;
    const toolCallId = readString$2(item, "id");
    if (!toolCallId || this.completedItemIds.has(toolCallId)) return;
    const toolName = "web_search";
    this.recordStarted(toolCallId, toolName, "unknown");
    const rawStatus = readString$2(item, "status");
    if (rawStatus === "in_progress" || rawStatus === "running") return;
    const status =
      rawStatus === "completed"
        ? "completed"
        : rawStatus === "cancelled"
          ? "cancelled"
          : rawStatus === "failed" || rawStatus === "error" || rawStatus === "incomplete"
            ? "failed"
            : "unknown";
    this.recordTerminal(toolCallId, toolName, status, {
      sourceTimestampMs: this.webSearchCompletionByItem.get(toolCallId)?.sourceTimestampMs,
    });
  }
  recordTerminal(toolCallId, toolName, status, options = {}) {
    const runWasAborted = options.runWasAborted ?? this.options.runAbortSignal?.aborted === true;
    const preToolUseFailure = this.preToolUseFailureByItem.get(toolCallId);
    this.preToolUseFailureByItem.delete(toolCallId);
    const approvalFailureDisposition = this.approvalFailureDispositionByItem.get(toolCallId);
    this.approvalFailureDispositionByItem.delete(toolCallId);
    this.completedItemIds.add(toolCallId);
    this.activeItems.delete(toolCallId);
    this.webSearchCompletionByItem.delete(toolCallId);
    const startedAt = this.startedAtByItem.get(toolCallId);
    this.startedAtByItem.delete(toolCallId);
    const endedAt = options.sourceTimestampMs ?? Date.now();
    const durationMs =
      options.itemDurationMs ?? (startedAt === void 0 ? 0 : Math.max(0, endedAt - startedAt));
    if (preToolUseFailure) {
      this.emitPreToolUseFailure(
        preToolUseFailure,
        toolName,
        durationMs,
        options.sourceTimestampMs,
      );
      return;
    }
    const terminalEvent = approvalFailureDisposition
      ? {
          type: "tool.execution.error",
          durationMs,
          errorCategory: "codex_native_tool_approval",
          terminalReason: approvalFailureDisposition,
        }
      : status === "blocked"
        ? {
            type: "tool.execution.blocked",
            reason: "codex_native_tool_blocked",
            deniedReason: "codex_native_tool_blocked",
          }
        : status === "failed" || status === "cancelled" || status === "unknown"
          ? {
              type: "tool.execution.error",
              durationMs,
              errorCategory:
                status === "unknown"
                  ? "codex_native_tool_outcome_unknown"
                  : status === "cancelled"
                    ? "aborted"
                    : "codex_native_tool_error",
              ...(status === "unknown" ? { errorCode: "tool_outcome_unknown" } : {}),
              terminalReason:
                status === "unknown"
                  ? "failed"
                  : runWasAborted && this.options.runAbortSignal
                    ? resolveCodexToolAbortTerminalReason(this.options.runAbortSignal)
                    : status === "cancelled"
                      ? "cancelled"
                      : "failed",
            }
          : {
              type: "tool.execution.completed",
              durationMs,
            };
    emitTrustedDiagnosticEvent({
      ...this.buildBase(toolCallId, toolName),
      ...terminalEvent,
      ...(options.sourceTimestampMs !== void 0
        ? { sourceTimestampMs: options.sourceTimestampMs }
        : {}),
    });
  }
  finalizeActive(runWasAborted = this.options.runAbortSignal?.aborted === true) {
    this.finalized = true;
    for (const [toolCallId, { toolName, unfinishedStatus }] of this.activeItems) {
      const webSearchCompletion = this.webSearchCompletionByItem.get(toolCallId);
      const itemRunWasAborted = webSearchCompletion
        ? webSearchCompletion.runWasAborted
        : runWasAborted;
      this.recordTerminal(toolCallId, toolName, unfinishedStatus, {
        runWasAborted: itemRunWasAborted,
        sourceTimestampMs: webSearchCompletion?.sourceTimestampMs,
      });
    }
    for (const [toolCallId, record] of this.preToolUseFailureByItem)
      if (!this.completedItemIds.has(toolCallId))
        this.recordTerminal(toolCallId, record.failure.toolName, "failed", {
          itemDurationMs: record.failure.durationMs,
        });
    this.activeItems.clear();
    this.webSearchCompletionByItem.clear();
    this.approvalFailureDispositionByItem.clear();
    this.preToolUseFailureByItem.clear();
  }
  emitPreToolUseFailure(record, toolName, durationMs, sourceTimestampMs) {
    emitCodexNativePreToolUseFailureDiagnostic({
      agentId: this.context.agentId,
      sessionId: this.context.sessionId,
      sessionKey: this.context.sessionKey,
      runId: this.context.runId,
      failure: {
        ...record.failure,
        toolName,
        durationMs,
      },
      terminalReason: record.terminalReason,
      sourceTimestampMs,
    });
  }
  recordSnapshotItem(item) {
    if (
      !auditNativeToolName(item) ||
      this.completedItemIds.has(item.id) ||
      itemStatus(item) === "running"
    )
      return;
    const toolName = auditNativeToolName(item);
    if (!toolName) return;
    this.recordStarted(item.id, toolName, auditNativeToolUnfinishedStatus(item));
    this.recordItem({
      phase: "result",
      item,
    });
  }
  recordStarted(toolCallId, toolName, unfinishedStatus, sourceTimestampMs) {
    if (this.activeItems.has(toolCallId)) return;
    this.startedAtByItem.set(toolCallId, sourceTimestampMs ?? Date.now());
    this.activeItems.set(toolCallId, {
      toolName,
      unfinishedStatus,
    });
    emitTrustedDiagnosticEvent({
      type: "tool.execution.started",
      ...this.buildBase(toolCallId, toolName),
      ...(sourceTimestampMs !== void 0 ? { sourceTimestampMs } : {}),
    });
  }
  buildBase(toolCallId, toolName) {
    return {
      agentId: this.context.agentId,
      runId: this.context.runId,
      sessionId: this.context.sessionId,
      sessionKey: this.context.sessionKey,
      toolName,
      toolCallId,
    };
  }
};
const ZERO_USAGE = {
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
const MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM = 20;
const TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS = 1e4;
const TOOL_PROGRESS_ECHO_PREFIX_MIN_CHARS = 1024;
const TOOL_PROGRESS_ECHO_SIGNATURE_CAP = 24;
const TOOL_OUTPUT_TRUNCATION_NOTICE_PREFIX = "...(OpenClaw truncated Codex native tool output";
const MISSING_TOOL_RESULT_ERROR =
  "OpenClaw recorded a native Codex tool.call without a matching tool.result before the turn completed.";
const GENERATED_IMAGE_MEDIA_SUBDIR = "tool-image-generation";
const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_GENERATED_IMAGE_MAX_BYTES = 6 * BYTES_PER_MB;
const TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES = /* @__PURE__ */ new Set([
  "message",
  "messages",
  "reply",
  "send",
  "reaction",
  "react",
  "typing",
]);
function shouldEmitTranscriptToolProgress(toolName, _args) {
  const normalized = typeof toolName === "string" ? toolName.trim().toLowerCase() : "";
  return Boolean(normalized && !TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES.has(normalized));
}
var CodexAppServerEventProjector = class {
  constructor(params, threadId, turnId, options = {}) {
    this.params = params;
    this.threadId = threadId;
    this.turnId = turnId;
    this.options = options;
    this.assistantTextByItem = /* @__PURE__ */ new Map();
    this.assistantItemOrder = [];
    this.assistantPhaseByItem = /* @__PURE__ */ new Map();
    this.latestTerminalAssistantCandidateSuperseded = false;
    this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff = false;
    this.terminalAssistantCandidateEarlierActiveItemIds = /* @__PURE__ */ new Set();
    this.lastCommentaryProgressTextByItem = /* @__PURE__ */ new Map();
    this.pendingRawCommentaryEchoes = 0;
    this.reasoningTextByGroup = /* @__PURE__ */ new Map();
    this.reasoningItemOrder = /* @__PURE__ */ new Map();
    this.planTextByItem = /* @__PURE__ */ new Map();
    this.activeItemIds = /* @__PURE__ */ new Set();
    this.completedItemIds = /* @__PURE__ */ new Set();
    this.activeCompactionItemIds = /* @__PURE__ */ new Set();
    this.toolProgressEchoesByItem = /* @__PURE__ */ new Map();
    this.rawPromotedAssistantItemIds = /* @__PURE__ */ new Set();
    this.toolResultSummaryItemIds = /* @__PURE__ */ new Set();
    this.toolResultOutputItemIds = /* @__PURE__ */ new Set();
    this.toolResultOutputStreamedItemIds = /* @__PURE__ */ new Set();
    this.transcriptToolProgressSuppressedIds = /* @__PURE__ */ new Set();
    this.toolTranscriptArgumentsById = /* @__PURE__ */ new Map();
    this.toolResultOutputDeltaState = /* @__PURE__ */ new Map();
    this.toolResultOutputPrefixByItem = /* @__PURE__ */ new Map();
    this.toolResultOutputTextByItem = /* @__PURE__ */ new Map();
    this.toolResultOutputTextOriginalLengthByItem = /* @__PURE__ */ new Map();
    this.toolResultOutputTextNormalizedLengthByItem = /* @__PURE__ */ new Map();
    this.toolResultOutputTextTrimStateByItem = /* @__PURE__ */ new Map();
    this.toolResultOutputTextTruncatedItemIds = /* @__PURE__ */ new Set();
    this.toolMetas = /* @__PURE__ */ new Map();
    this.terminalPresentationClearedItemIds = /* @__PURE__ */ new Set();
    this.nativeToolOutcomeOrdinals = /* @__PURE__ */ new Map();
    this.sideEffectingToolItemIds = /* @__PURE__ */ new Set();
    this.sideEffectingDynamicToolCallIds = /* @__PURE__ */ new Set();
    this.toolTranscriptMessages = [];
    this.toolTranscriptCallIds = /* @__PURE__ */ new Set();
    this.toolTranscriptResultIds = /* @__PURE__ */ new Set();
    this.toolTranscriptNamesById = /* @__PURE__ */ new Map();
    this.toolTrajectoryCallIds = /* @__PURE__ */ new Set();
    this.toolTrajectoryResultIds = /* @__PURE__ */ new Set();
    this.toolTrajectoryNamesById = /* @__PURE__ */ new Map();
    this.toolTrajectoryItemsById = /* @__PURE__ */ new Map();
    this.transcriptToolProgressCallIds = /* @__PURE__ */ new Set();
    this.nativeGeneratedMediaItemIds = /* @__PURE__ */ new Set();
    this.nativeGeneratedMediaUrlsByItemId = /* @__PURE__ */ new Map();
    this.afterToolCallObservedItemIds = /* @__PURE__ */ new Set();
    this.assistantStarted = false;
    this.reasoningStarted = false;
    this.reasoningEnded = false;
    this.streamedPartialAssistantItemReplaceable = false;
    this.promptErrorSource = null;
    this.synthesizedMissingToolResultError = null;
    this.aborted = false;
    this.guardianReviewCount = 0;
    this.completedCompactionCount = 0;
    this.nativeToolLifecycleProjector = new CodexNativeToolLifecycleProjector(
      params,
      threadId,
      turnId,
      { runAbortSignal: options.runAbortSignal },
    );
  }
  getCompletedTurnStatus() {
    return this.completedTurn?.status;
  }
  hasCompletedTerminalAssistantText() {
    const latestCompletedItemId = this.latestCompletedTerminalAssistantItemId;
    if (!latestCompletedItemId) return false;
    const finalItem = this.resolveFinalAssistantTextItem();
    return (
      this.latestCompletedItemId === latestCompletedItemId &&
      finalItem?.itemId === latestCompletedItemId &&
      this.completedItemIds.has(latestCompletedItemId)
    );
  }
  getLatestTerminalAssistantCandidate() {
    const itemId = this.latestTerminalAssistantCandidateItemId;
    if (!itemId) return;
    const text = this.assistantTextByItem.get(itemId)?.trim();
    return {
      itemId,
      hasText: Boolean(text && !this.isToolProgressEchoText(itemId, text)),
    };
  }
  hasLatestTerminalAssistantCandidateText() {
    return (
      !this.latestTerminalAssistantCandidateSuperseded &&
      this.getLatestTerminalAssistantCandidate()?.hasText === true
    );
  }
  canReleaseLatestTerminalAssistantAfterToolHandoff() {
    return (
      this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff &&
      this.hasLatestTerminalAssistantCandidateText()
    );
  }
  /** Restores a completed final item after only the enclosing turn timeout fired. */
  recoverCompletedTerminalAssistantAfterTurnWatchTimeout() {
    if (
      !this.aborted ||
      this.promptError !== "codex app-server attempt timed out" ||
      !this.hasCompletedTerminalAssistantText()
    )
      return false;
    this.aborted = false;
    this.promptError = void 0;
    this.promptErrorSource = null;
    return true;
  }
  /** Resolves the shared model-order position for a native tool item. */
  recordNativeToolOutcome(item) {
    if (
      !item ||
      this.nativeToolOutcomeOrdinals.has(item.id) ||
      !shouldClearTerminalPresentationForNativeItem(item)
    )
      return;
    const ordinal = this.params.allocateToolOutcomeOrdinal?.(item.id);
    if (ordinal !== void 0) this.nativeToolOutcomeOrdinals.set(item.id, ordinal);
  }
  recordNativeToolApprovalFailure(toolCallId, disposition) {
    this.nativeToolLifecycleProjector.recordApprovalFailureDisposition(toolCallId, disposition);
  }
  recordNativeToolPreToolUseFailure(failure) {
    this.nativeToolLifecycleProjector.recordPreToolUseFailure(failure);
  }
  async handleNotification(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    if (!params) return;
    if (isHookNotificationMethod(notification.method)) {
      if (!this.isHookNotificationForCurrentThread(params)) return;
    } else if (notification.method === "guardianWarning") {
      if (readCodexNotificationThreadId(params) !== this.threadId) return;
    } else if (!this.isNotificationForTurn(params)) return;
    this.nativeToolLifecycleProjector.handleNotification(notification);
    switch (notification.method) {
      case "item/agentMessage/delta":
        await this.handleAssistantDelta(params);
        break;
      case "item/reasoning/summaryTextDelta":
      case "item/reasoning/textDelta":
        await this.handleReasoningDelta(notification.method, params);
        break;
      case "item/plan/delta":
        this.handlePlanDelta(params);
        break;
      case "turn/plan/updated":
        this.handleTurnPlanUpdated(params);
        break;
      case "item/started":
        await this.handleItemStarted(params);
        break;
      case "item/completed":
        await this.handleItemCompleted(params);
        break;
      case "item/commandExecution/outputDelta":
        this.handleOutputDelta(params, "bash");
        break;
      case "item/autoApprovalReview/started":
      case "item/autoApprovalReview/completed":
        this.handleGuardianReviewNotification(notification.method, params);
        break;
      case "guardianWarning":
        this.handleGuardianWarning(params);
        break;
      case "hook/started":
      case "hook/completed":
        this.handleHookNotification(notification.method, params);
        break;
      case "thread/tokenUsage/updated":
        this.handleTokenUsage(params);
        break;
      case "turn/completed":
        await this.handleTurnCompleted(params);
        break;
      case "rawResponseItem/completed":
        await this.handleRawResponseItemCompleted(params);
        break;
      case "error":
        if (params.willRetry === true) break;
        this.promptError = this.formatCodexErrorMessage(params) ?? "codex app-server error";
        this.promptErrorSource = "prompt";
        break;
      default:
        break;
    }
  }
  buildResult(toolTelemetry, options) {
    this.nativeToolLifecycleProjector.finalizeActive();
    const assistantTexts = this.collectAssistantTexts();
    const reasoningText = collectReasoningTextValues(
      this.reasoningTextByGroup,
      this.reasoningItemOrder,
    ).join("\n\n");
    const planText = collectTextValues(this.planTextByItem).join("\n\n");
    const hasAssistantItemText = this.hasAssistantItemTextForSynthesis();
    const legacyFailClosed =
      !this.completedTurn || this.completedTurn.status !== "completed" || hasAssistantItemText;
    const hasDeliverableAssistantOnCompletedTurn =
      this.completedTurn?.status === "completed" &&
      assistantTexts.some((text) => text.trim().length > 0);
    this.synthesizeMissingToolResults({
      synthesize: legacyFailClosed,
      recordPromptError:
        legacyFailClosed && !hasDeliverableAssistantOnCompletedTurn && !this.aborted,
    });
    const lastAssistant =
      assistantTexts.length > 0 ? this.createAssistantMessage(assistantTexts.join("\n\n")) : void 0;
    const currentAttemptAssistant = this.createCurrentAttemptAssistantMessage();
    const turnId = this.turnId;
    const messagesSnapshot = promptSnapshot(this.params, turnId, this.options.upstreamUserText);
    if (reasoningText)
      messagesSnapshot.push(
        attachCodexMirrorIdentity(
          this.createAssistantMirrorMessage("Codex reasoning", reasoningText),
          `${turnId}:reasoning`,
        ),
      );
    if (planText)
      messagesSnapshot.push(
        attachCodexMirrorIdentity(
          this.createAssistantMirrorMessage("Codex plan", planText),
          `${turnId}:plan`,
        ),
      );
    messagesSnapshot.push(...this.toolTranscriptMessages);
    if (lastAssistant)
      messagesSnapshot.push(attachCodexMirrorIdentity(lastAssistant, `${turnId}:assistant`));
    const turnFailed = this.completedTurn?.status === "failed";
    const promptError =
      this.promptError ??
      this.synthesizedMissingToolResultError ??
      (turnFailed ? (this.completedTurn?.error?.message ?? "codex app-server turn failed") : null);
    const agentHarnessResultClassification = classifyAgentHarnessTerminalOutcome({
      assistantTexts,
      reasoningText,
      planText,
      promptError,
      turnCompleted: Boolean(this.completedTurn),
    });
    const toolMetas = [...this.toolMetas.values()];
    const hadPotentialSideEffects =
      toolTelemetry.didSendViaMessagingTool ||
      (toolTelemetry.successfulCronAdds ?? 0) > 0 ||
      this.nativeGeneratedMediaItemIds.size > 0 ||
      this.sideEffectingToolItemIds.size > 0 ||
      this.sideEffectingDynamicToolCallIds.size > 0;
    return {
      aborted: this.aborted,
      externalAbort: false,
      timedOut: false,
      idleTimedOut: false,
      timedOutDuringCompaction: false,
      timedOutDuringToolExecution: false,
      promptError,
      promptErrorSource: promptError ? this.promptErrorSource || "prompt" : null,
      sessionIdUsed: this.params.sessionId,
      ...(agentHarnessResultClassification ? { agentHarnessResultClassification } : {}),
      bootstrapPromptWarningSignaturesSeen: this.params.bootstrapPromptWarningSignaturesSeen,
      bootstrapPromptWarningSignature: this.params.bootstrapPromptWarningSignature,
      messagesSnapshot,
      assistantTexts,
      toolMetas,
      lastAssistant,
      currentAttemptAssistant,
      ...(this.lastNativeToolError ? { lastToolError: this.lastNativeToolError } : {}),
      didSendViaMessagingTool: toolTelemetry.didSendViaMessagingTool,
      didDeliverSourceReplyViaMessageTool:
        toolTelemetry.didDeliverSourceReplyViaMessageTool === true,
      messagingToolSentTexts: toolTelemetry.messagingToolSentTexts,
      messagingToolSentMediaUrls: toolTelemetry.messagingToolSentMediaUrls,
      messagingToolSentTargets: toolTelemetry.messagingToolSentTargets,
      messagingToolSourceReplyPayloads: toolTelemetry.messagingToolSourceReplyPayloads ?? [],
      heartbeatToolResponse: toolTelemetry.heartbeatToolResponse,
      toolMediaUrls: this.buildToolMediaUrls(toolTelemetry),
      toolAudioAsVoice: toolTelemetry.toolAudioAsVoice,
      successfulCronAdds: toolTelemetry.successfulCronAdds,
      cloudCodeAssistFormatError: false,
      attemptUsage: this.tokenUsage,
      replayMetadata: {
        hadPotentialSideEffects,
        replaySafe: !hadPotentialSideEffects,
      },
      itemLifecycle: {
        startedCount: this.activeItemIds.size + this.completedItemIds.size,
        completedCount: this.completedItemIds.size,
        activeCount: this.activeItemIds.size,
        ...(this.completedCompactionCount > 0
          ? { compactionCount: this.completedCompactionCount }
          : {}),
      },
      yieldDetected: options?.yieldDetected || false,
      didSendDeterministicApprovalPrompt: this.guardianReviewCount > 0 ? false : void 0,
    };
  }
  recordDynamicToolCall(params) {
    const args = sanitizeCodexToolArguments(params.arguments);
    this.recordToolTranscriptCall({
      id: params.callId,
      name: params.tool,
      arguments: args,
    });
  }
  recordDynamicToolResult(params) {
    const resultText = collectDynamicToolContentText(params.contentItems);
    const existing = this.toolMetas.get(params.callId);
    this.toolMetas.set(params.callId, {
      toolName: existing?.toolName ?? params.tool,
      ...(existing?.meta ? { meta: existing.meta } : {}),
      ...(params.asyncStarted === true ? { asyncStarted: true } : {}),
      ...(!params.success ? { isError: true } : {}),
    });
    this.recordToolTranscriptResult({
      id: params.callId,
      name: params.tool,
      text: resultText,
      isError: !params.success,
    });
    if (!params.success && params.terminalType === "blocked")
      this.lastNativeToolError = {
        toolName: params.tool,
        error: resultText || "codex dynamic tool blocked",
      };
    else if (params.success && this.lastNativeToolError && !this.lastNativeToolError.mutatingAction)
      this.lastNativeToolError = void 0;
    if (params.sideEffectEvidence === true) this.sideEffectingDynamicToolCallIds.add(params.callId);
  }
  markTimedOut() {
    this.aborted = true;
    this.promptError = "codex app-server attempt timed out";
    this.promptErrorSource = "prompt";
  }
  markAborted() {
    this.aborted = true;
  }
  isCompacting() {
    return this.activeCompactionItemIds.size > 0;
  }
  async handleAssistantDelta(params) {
    const itemId = readString$2(params, "itemId") ?? "assistant";
    const delta = readString$2(params, "delta") ?? "";
    if (!delta) return;
    if (itemId !== this.pendingRawTerminalAssistantEchoItemId)
      this.pendingRawTerminalAssistantEchoItemId = void 0;
    const isCommentary = this.isCommentaryAssistantItem(itemId);
    if (!isCommentary && itemId !== this.latestTerminalAssistantCandidateItemId)
      this.markTerminalAssistantCandidateSupersededBy();
    if (!this.assistantStarted) {
      this.assistantStarted = true;
      await this.params.onAssistantMessageStart?.();
    }
    this.rememberAssistantItem(itemId);
    const text = `${this.assistantTextByItem.get(itemId) ?? ""}${delta}`;
    this.assistantTextByItem.set(itemId, text);
    if (isCommentary)
      this.emitCommentaryProgress({
        itemId,
        text,
      });
    else {
      const knownFinalAnswer = this.shouldStreamAssistantPartial(itemId);
      const replace =
        this.streamedPartialAssistantItemId !== void 0 &&
        this.streamedPartialAssistantItemId !== itemId;
      if (replace && (!knownFinalAnswer || this.streamedPartialAssistantItemReplaceable))
        this.streamedPartialAssistantItemReplaceable = true;
      else if (this.streamedPartialAssistantItemId === void 0)
        this.streamedPartialAssistantItemReplaceable = !knownFinalAnswer;
      this.streamedPartialAssistantItemId = itemId;
      const replaceable = this.streamedPartialAssistantItemReplaceable;
      const replacement = replace && replaceable;
      const streamPayload = {
        text,
        delta: replacement ? "" : delta,
        ...(replacement ? { replace: true } : {}),
      };
      this.emitAgentEvent({
        stream: "assistant",
        data: {
          ...streamPayload,
          ...(replaceable ? { replaceable: true } : {}),
        },
      });
      if (knownFinalAnswer && !replaceable) await this.params.onPartialReply?.(streamPayload);
    }
  }
  async handleReasoningDelta(method, params) {
    const itemId = readString$2(params, "itemId") ?? "reasoning";
    const delta = readString$2(params, "delta") ?? "";
    if (!delta) return;
    this.reasoningStarted = true;
    if (!this.reasoningItemOrder.has(itemId))
      this.reasoningItemOrder.set(itemId, this.reasoningItemOrder.size);
    const groupIndex =
      method === "item/reasoning/textDelta"
        ? (readNonNegativeInteger(params, "contentIndex") ?? 0)
        : (readNonNegativeInteger(params, "summaryIndex") ?? 0);
    const groupKey = `${method}\0${itemId}\0${groupIndex}`;
    const current = this.reasoningTextByGroup.get(groupKey);
    this.reasoningTextByGroup.set(groupKey, {
      itemId,
      method,
      index: groupIndex,
      text: `${current?.text ?? ""}${delta}`,
    });
    await this.params.onReasoningStream?.({
      text: collectReasoningTextValues(this.reasoningTextByGroup, this.reasoningItemOrder).join(
        "\n\n",
      ),
      isReasoningSnapshot: true,
    });
  }
  handlePlanDelta(params) {
    const itemId = readString$2(params, "itemId") ?? "plan";
    const delta = readString$2(params, "delta") ?? "";
    if (!delta) return;
    const text = `${this.planTextByItem.get(itemId) ?? ""}${delta}`;
    this.planTextByItem.set(itemId, text);
    this.emitPlanUpdate({
      explanation: void 0,
      steps: splitPlanText(text),
    });
  }
  handleTurnPlanUpdated(params) {
    const plan = Array.isArray(params.plan)
      ? params.plan.flatMap((entry) => {
          if (!isJsonObject(entry)) return [];
          const step = readString$2(entry, "step");
          const status = readString$2(entry, "status");
          if (!step) return [];
          return status ? [`${step} (${status})`] : [step];
        })
      : void 0;
    this.emitPlanUpdate({
      explanation: readNullableString(params, "explanation"),
      steps: plan,
    });
  }
  async handleItemStarted(params) {
    const item = readItem(params.item);
    const itemId = item?.id ?? readString$2(params, "itemId");
    if (
      item?.type === "agentMessage" &&
      itemId &&
      itemId !== this.pendingRawTerminalAssistantEchoItemId
    )
      this.pendingRawTerminalAssistantEchoItemId = void 0;
    this.rememberAssistantPhase(item);
    if (itemId) {
      this.activeItemIds.add(itemId);
      if (itemId !== this.latestTerminalAssistantCandidateItemId) {
        this.markTerminalAssistantCandidateSupersededBy(itemId, {
          preserveEarlierActiveItem: true,
        });
        if (this.latestTerminalAssistantCandidateSuperseded)
          this.pendingRawTerminalAssistantEchoItemId = void 0;
      }
    }
    this.recordNativeToolOutcome(item);
    if (item?.type === "contextCompaction" && itemId) {
      this.activeCompactionItemIds.add(itemId);
      await runAgentHarnessBeforeCompactionHook({
        sessionFile: this.params.sessionFile,
        messages: await this.readMirroredSessionMessages(),
        ctx: {
          runId: this.params.runId,
          agentId: this.params.agentId,
          sessionKey: this.params.sessionKey,
          sessionId: this.params.sessionId,
          workspaceDir: this.params.workspaceDir,
          messageProvider: this.params.messageProvider ?? void 0,
          trigger: this.params.trigger,
          channelId: this.params.messageChannel ?? this.params.messageProvider ?? void 0,
        },
      });
      this.emitAgentEvent({
        stream: "compaction",
        data: {
          phase: "start",
          backend: "codex-app-server",
          threadId: this.threadId,
          turnId: this.turnId,
          itemId,
        },
      });
    }
    this.recordToolMeta(item);
    this.emitStandardItemEvent({
      phase: "start",
      item,
    });
    await this.emitNormalizedToolItemEvent({
      phase: "start",
      item,
    });
    this.recordNativeToolTranscriptCall(item);
    this.emitToolResultSummary(item);
    this.emitAgentEvent({
      stream: "codex_app_server.item",
      data: {
        phase: "started",
        itemId,
        type: item?.type,
      },
    });
  }
  async handleItemCompleted(params) {
    const item = readItem(params.item);
    this.recordNativeToolOutcome(item);
    this.clearTerminalPresentationForNativeItem(item);
    const itemId = item?.id ?? readString$2(params, "itemId");
    if (
      item?.type === "agentMessage" &&
      itemId &&
      itemId !== this.pendingRawTerminalAssistantEchoItemId
    )
      this.pendingRawTerminalAssistantEchoItemId = void 0;
    if (itemId) {
      this.activeItemIds.delete(itemId);
      this.completedItemIds.add(itemId);
      this.latestCompletedItemId = itemId;
    }
    this.rememberAssistantPhase(item);
    if (item?.type === "agentMessage" && !this.isCommentaryAssistantItem(item.id)) {
      this.latestCompletedTerminalAssistantItemId = item.id;
      this.markLatestTerminalAssistantCandidate(item.id);
      this.pendingRawTerminalAssistantEchoItemId = item.id;
    } else if (itemId) {
      this.markTerminalAssistantCandidateSupersededBy(itemId, { preserveEarlierActiveItem: true });
      if (this.latestTerminalAssistantCandidateSuperseded)
        this.pendingRawTerminalAssistantEchoItemId = void 0;
    }
    if (item?.type === "agentMessage" && typeof item.text === "string") {
      this.rememberAssistantItem(item.id);
      this.assistantTextByItem.set(item.id, item.text);
      if (item.text && this.isCommentaryAssistantItem(item.id)) {
        this.emitCommentaryProgress({
          itemId: item.id,
          text: item.text,
        });
        this.pendingRawCommentaryEchoes += 1;
      }
    }
    this.recordNativeGeneratedMedia(item);
    if (item?.type === "plan" && typeof item.text === "string" && item.text) {
      this.planTextByItem.set(item.id, item.text);
      this.emitPlanUpdate({
        explanation: void 0,
        steps: splitPlanText(item.text),
      });
    }
    if (item?.type === "contextCompaction" && itemId) {
      this.activeCompactionItemIds.delete(itemId);
      this.completedCompactionCount += 1;
      this.options.onContextCompacted?.();
      await runAgentHarnessAfterCompactionHook({
        sessionFile: this.params.sessionFile,
        messages: await this.readMirroredSessionMessages(),
        compactedCount: -1,
        ctx: {
          runId: this.params.runId,
          agentId: this.params.agentId,
          sessionKey: this.params.sessionKey,
          sessionId: this.params.sessionId,
          workspaceDir: this.params.workspaceDir,
          messageProvider: this.params.messageProvider ?? void 0,
          trigger: this.params.trigger,
          channelId: this.params.messageChannel ?? this.params.messageProvider ?? void 0,
        },
      });
      this.emitAgentEvent({
        stream: "compaction",
        data: {
          phase: "end",
          backend: "codex-app-server",
          completed: true,
          threadId: this.threadId,
          turnId: this.turnId,
          itemId,
        },
      });
    }
    this.recordToolMeta(item);
    this.rememberCommandAggregateOutputEcho(item);
    this.emitStandardItemEvent({
      phase: "end",
      item,
    });
    await this.emitNormalizedToolItemEvent({
      phase: "result",
      item,
    });
    this.recordNativeToolTranscriptCall(item);
    this.recordNativeToolTranscriptResult(item);
    this.emitToolResultSummary(item);
    this.emitToolResultOutput(item);
    this.emitAgentEvent({
      stream: "codex_app_server.item",
      data: {
        phase: "completed",
        itemId,
        type: item?.type,
      },
    });
  }
  handleTokenUsage(params) {
    const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
    const last = tokenUsage && isJsonObject(tokenUsage.last) ? tokenUsage.last : void 0;
    if (!last) return;
    const usage = normalizeCodexTokenUsage(last);
    if (usage) this.tokenUsage = usage;
  }
  handleGuardianReviewNotification(method, params) {
    this.guardianReviewCount += 1;
    const review = isJsonObject(params.review) ? params.review : void 0;
    const action = isJsonObject(params.action) ? params.action : void 0;
    this.emitAgentEvent({
      stream: "codex_app_server.guardian",
      data: {
        method,
        phase: method.endsWith("/started") ? "started" : "completed",
        reviewId: readString$2(params, "reviewId"),
        targetItemId: readNullableString(params, "targetItemId"),
        decisionSource: readString$2(params, "decisionSource"),
        status: review ? readString$2(review, "status") : void 0,
        riskLevel: review ? readString$2(review, "riskLevel") : void 0,
        userAuthorization: review ? readString$2(review, "userAuthorization") : void 0,
        rationale: review ? readNullableString(review, "rationale") : void 0,
        actionType: action ? readString$2(action, "type") : void 0,
      },
    });
  }
  handleGuardianWarning(params) {
    this.emitAgentEvent({
      stream: "codex_app_server.guardian",
      data: {
        phase: "warning",
        message: readString$2(params, "message"),
      },
    });
  }
  handleHookNotification(method, params) {
    const run = isJsonObject(params.run) ? params.run : void 0;
    if (!run) return;
    const durationMs = readNumber(run, "durationMs");
    const entries = readHookOutputEntries(run.entries);
    const hookTurnId = readNullableString(params, "turnId");
    this.emitAgentEvent({
      stream: "codex_app_server.hook",
      data: {
        phase: method === "hook/started" ? "started" : "completed",
        threadId: this.threadId,
        turnId: hookTurnId === void 0 ? this.turnId : hookTurnId,
        hookRunId: readString$2(run, "id"),
        eventName: readString$2(run, "eventName"),
        handlerType: readString$2(run, "handlerType"),
        executionMode: readString$2(run, "executionMode"),
        scope: readString$2(run, "scope"),
        source: readString$2(run, "source"),
        sourcePath: readString$2(run, "sourcePath"),
        status: readString$2(run, "status"),
        statusMessage: readNullableString(run, "statusMessage"),
        ...(durationMs !== void 0 ? { durationMs } : {}),
        ...(entries.length > 0 ? { entries } : {}),
      },
    });
  }
  async handleTurnCompleted(params) {
    const turn = readCodexTurn(params.turn);
    if (!turn || turn.id !== this.turnId) return;
    this.completedTurn = turn;
    if (turn.status === "failed") {
      this.promptError =
        formatCodexUsageLimitErrorMessage({
          message: turn.error?.message,
          codexErrorInfo: turn.error?.codexErrorInfo,
          rateLimits: this.options.readRecentRateLimits?.(),
        }) ??
        turn.error?.message ??
        "codex app-server turn failed";
      this.promptErrorSource = "prompt";
    }
    const turnItems = turn.items ?? [];
    for (let index = turnItems.length - 1; index >= 0; index -= 1) {
      const item = turnItems[index];
      if (!item || !this.isCurrentTurnSnapshotItem(item)) continue;
      if (item?.type === "dynamicToolCall") break;
      if (shouldClearTerminalPresentationForNativeItem(item)) {
        this.clearTerminalPresentationForNativeItem(item);
        break;
      }
    }
    for (const item of turnItems) {
      this.rememberAssistantPhase(item);
      if (item.type === "agentMessage" && typeof item.text === "string") {
        this.rememberAssistantItem(item.id);
        this.assistantTextByItem.set(item.id, item.text);
      }
      this.recordNativeGeneratedMedia(item);
      if (item.type === "plan" && typeof item.text === "string" && item.text) {
        this.planTextByItem.set(item.id, item.text);
        this.emitPlanUpdate({
          explanation: void 0,
          steps: splitPlanText(item.text),
        });
      }
      this.recordToolMeta(item);
      this.rememberCommandAggregateOutputEcho(item);
      await this.emitSnapshotOnlyNativeToolProgress(item);
      this.recordNativeToolTranscriptCall(item);
      this.recordNativeToolTranscriptResult(item);
      this.emitAfterToolCallObservation(item);
      this.emitToolResultSummary(item);
      this.emitToolResultOutput(item);
    }
    this.activeCompactionItemIds.clear();
    await this.maybeEndReasoning();
  }
  async emitSnapshotOnlyNativeToolProgress(item) {
    if (
      !shouldSynthesizeToolProgressForItem(item) ||
      !this.isCurrentTurnSnapshotItem(item) ||
      this.completedItemIds.has(item.id) ||
      itemStatus(item) === "running"
    )
      return;
    if (!this.activeItemIds.has(item.id)) {
      this.emitStandardItemEvent({
        phase: "start",
        item,
      });
      await this.emitNormalizedToolItemEvent({
        phase: "start",
        item,
      });
    }
    this.activeItemIds.delete(item.id);
    this.emitStandardItemEvent({
      phase: "end",
      item,
    });
    await this.emitNormalizedToolItemEvent({
      phase: "result",
      item,
    });
    this.completedItemIds.add(item.id);
  }
  isCurrentTurnSnapshotItem(item) {
    const itemTurnId = readItemString(item, "turnId");
    return itemTurnId === void 0 || itemTurnId === this.turnId;
  }
  handleOutputDelta(params, toolName) {
    const itemId = readString$2(params, "itemId");
    const delta = readString$2(params, "delta");
    if (!itemId || !delta) return;
    const storedOutput = appendToolOutputDeltaText(
      this.toolResultOutputTextByItem,
      this.toolResultOutputPrefixByItem,
      this.toolResultOutputTextOriginalLengthByItem,
      this.toolResultOutputTextNormalizedLengthByItem,
      this.toolResultOutputTextTrimStateByItem,
      this.toolResultOutputTextTruncatedItemIds,
      itemId,
      delta,
    );
    this.rememberToolProgressEcho(itemId, {
      displayText: storedOutput.text,
      rawLength: storedOutput.normalizedLength,
      rawPrefix: storedOutput.rawPrefix,
      streamedDisplay: true,
    });
    if (!this.shouldEmitToolOutput()) return;
    if (
      this.transcriptToolProgressSuppressedIds.has(itemId) ||
      !shouldEmitTranscriptToolProgress(toolName, this.toolTranscriptArgumentsById.get(itemId))
    )
      return;
    const state = this.toolResultOutputDeltaState.get(itemId) ?? {
      chars: 0,
      messages: 0,
      truncated: false,
    };
    if (state.truncated) return;
    const remainingChars = Math.max(0, TOOL_PROGRESS_OUTPUT_MAX_CHARS - state.chars);
    const remainingMessages = Math.max(0, MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM - state.messages);
    if (remainingChars === 0 || remainingMessages === 0) {
      state.truncated = true;
      this.toolResultOutputDeltaState.set(itemId, state);
      this.emitToolResultMessage({
        itemId,
        text: formatToolOutput(toolName, void 0, "(output truncated)"),
      });
      return;
    }
    const chunk = delta.length > remainingChars ? truncateUtf16Safe(delta, remainingChars) : delta;
    state.chars += chunk.length;
    state.messages += 1;
    const reachedLimit =
      delta.length > remainingChars ||
      state.chars >= 8e3 ||
      state.messages >= MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM;
    if (reachedLimit) state.truncated = true;
    this.toolResultOutputDeltaState.set(itemId, state);
    this.toolResultOutputStreamedItemIds.add(itemId);
    this.emitToolResultMessage({
      itemId,
      text: formatToolOutput(
        toolName,
        void 0,
        reachedLimit ? `${chunk}\n...(truncated)...` : chunk,
      ),
    });
  }
  async handleRawResponseItemCompleted(params) {
    const item = isJsonObject(params.item) ? params.item : void 0;
    if (!item) return;
    const role = readString$2(item, "role");
    const phase = readString$2(item, "phase");
    const rawItemId = readString$2(item, "id");
    const candidateWasSupersededBeforeRaw = this.latestTerminalAssistantCandidateSuperseded;
    const pendingTerminalAssistantEchoItemId = this.pendingRawTerminalAssistantEchoItemId;
    const isPendingTerminalAssistantEcho =
      role === "assistant" &&
      phase !== "commentary" &&
      pendingTerminalAssistantEchoItemId !== void 0 &&
      (rawItemId === void 0 || rawItemId === pendingTerminalAssistantEchoItemId);
    if (pendingTerminalAssistantEchoItemId !== void 0 && !isPendingTerminalAssistantEcho)
      this.pendingRawTerminalAssistantEchoItemId = void 0;
    if (!isPendingTerminalAssistantEcho) {
      this.latestCompletedItemId = void 0;
      this.markTerminalAssistantCandidateSupersededBy(rawItemId);
    }
    await this.recordRawGeneratedImageMedia(item);
    if (role !== "assistant") return;
    if (phase === "commentary" && this.pendingRawCommentaryEchoes > 0) {
      this.pendingRawCommentaryEchoes -= 1;
      return;
    }
    const text = extractRawAssistantText(item);
    if (isPendingTerminalAssistantEcho) {
      const typedItemId = pendingTerminalAssistantEchoItemId;
      this.pendingRawTerminalAssistantEchoItemId = void 0;
      if (this.assistantTextByItem.get(typedItemId)?.trim() || !text) return;
      this.rememberAssistantItem(typedItemId);
      this.assistantTextByItem.set(typedItemId, text);
      return;
    }
    if (!text) return;
    const itemId = rawItemId ?? `raw-assistant-${this.assistantItemOrder.length + 1}`;
    const isIdlessTerminalAssistantAfterCompletedWork =
      candidateWasSupersededBeforeRaw &&
      rawItemId === void 0 &&
      pendingTerminalAssistantEchoItemId === void 0 &&
      this.activeItemIds.size === 0;
    if (
      phase !== "commentary" &&
      candidateWasSupersededBeforeRaw &&
      itemId !== this.streamedPartialAssistantItemId &&
      !isIdlessTerminalAssistantAfterCompletedWork
    )
      return;
    if (phase) this.assistantPhaseByItem.set(itemId, phase);
    this.rememberAssistantItem(itemId);
    this.assistantTextByItem.set(itemId, text);
    this.rawPromotedAssistantItemIds.add(itemId);
    if (phase === "commentary")
      this.emitCommentaryProgress({
        itemId,
        text,
      });
    else
      this.markLatestTerminalAssistantCandidate(itemId, {
        canReleaseAfterToolHandoff: isIdlessTerminalAssistantAfterCompletedWork,
      });
  }
  markLatestTerminalAssistantCandidate(itemId, options) {
    this.latestTerminalAssistantCandidateItemId = itemId;
    this.latestTerminalAssistantCandidateSuperseded = false;
    this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff =
      options?.canReleaseAfterToolHandoff === true;
    this.terminalAssistantCandidateEarlierActiveItemIds = new Set(this.activeItemIds);
  }
  markTerminalAssistantCandidateSupersededBy(itemId, options) {
    if (!this.latestTerminalAssistantCandidateItemId) return;
    if (itemId && this.terminalAssistantCandidateEarlierActiveItemIds.has(itemId)) {
      if (!options?.preserveEarlierActiveItem)
        this.terminalAssistantCandidateEarlierActiveItemIds.delete(itemId);
      return;
    }
    this.latestTerminalAssistantCandidateSuperseded = true;
    this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff = false;
    this.terminalAssistantCandidateEarlierActiveItemIds.clear();
  }
  recordNativeGeneratedMedia(item) {
    if (item?.type !== "imageGeneration") return;
    const savedPath = readItemString(item, "savedPath")?.trim();
    if (savedPath)
      this.recordNativeGeneratedMediaUrl({
        itemId: item.id,
        mediaUrl: savedPath,
      });
  }
  async recordRawGeneratedImageMedia(item) {
    if (readString$2(item, "type") !== "image_generation_call") return;
    const result = readString$2(item, "result");
    if (!result) return;
    const itemId = readString$2(item, "id") ?? `raw-image-${this.nativeGeneratedMediaItemIds.size}`;
    this.nativeGeneratedMediaItemIds.add(itemId);
    const maxBytes = resolveGeneratedImageMaxBytes(this.params.config);
    const estimatedDecodedBytes = estimateBase64DecodedBytes(result);
    if (estimatedDecodedBytes !== void 0 && estimatedDecodedBytes > maxBytes) {
      log.warn("codex app-server raw image generation result exceeds media limit", {
        itemId,
        estimatedDecodedBytes,
        maxBytes,
      });
      return;
    }
    const asset = generatedImageAssetFromBase64({
      base64: result,
      index: this.nativeGeneratedMediaItemIds.size,
      revisedPrompt: readString$2(item, "revised_prompt") ?? readString$2(item, "revisedPrompt"),
      fileNamePrefix: "codex-image-generation",
      sniffMimeType: true,
    });
    if (!asset) return;
    try {
      const saved = await saveMediaBuffer(
        asset.buffer,
        asset.mimeType,
        GENERATED_IMAGE_MEDIA_SUBDIR,
        maxBytes,
        asset.fileName,
      );
      this.recordNativeGeneratedMediaUrl({
        itemId,
        mediaUrl: saved.path,
        replaceExisting: true,
      });
    } catch (error) {
      log.warn("codex app-server raw image generation result save failed", {
        itemId,
        error,
      });
    }
  }
  recordNativeGeneratedMediaUrl(params) {
    if (
      this.nativeGeneratedMediaUrlsByItemId.has(params.itemId) &&
      params.replaceExisting !== true
    ) {
      this.nativeGeneratedMediaItemIds.add(params.itemId);
      return;
    }
    this.nativeGeneratedMediaUrlsByItemId.set(params.itemId, params.mediaUrl);
    this.nativeGeneratedMediaItemIds.add(params.itemId);
  }
  buildToolMediaUrls(toolTelemetry) {
    const mediaUrls = new Set(
      toolTelemetry.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? [],
    );
    if ((toolTelemetry.messagingToolSentMediaUrls?.length ?? 0) === 0)
      for (const mediaUrl of this.nativeGeneratedMediaUrlsByItemId.values())
        mediaUrls.add(mediaUrl);
    return mediaUrls.size > 0 ? [...mediaUrls] : toolTelemetry.toolMediaUrls;
  }
  async maybeEndReasoning() {
    if (!this.reasoningStarted || this.reasoningEnded) return;
    this.reasoningEnded = true;
    await this.params.onReasoningEnd?.();
  }
  emitPlanUpdate(params) {
    if (!params.explanation && (!params.steps || params.steps.length === 0)) return;
    this.emitAgentEvent({
      stream: "plan",
      data: {
        phase: "update",
        title: "Plan updated",
        source: "codex-app-server",
        ...(params.explanation ? { explanation: params.explanation } : {}),
        ...(params.steps && params.steps.length > 0 ? { steps: params.steps } : {}),
      },
    });
  }
  rememberAssistantPhase(item) {
    if (item?.type !== "agentMessage") return;
    const phase = readItemString(item, "phase");
    if (phase) this.assistantPhaseByItem.set(item.id, phase);
  }
  isCommentaryAssistantItem(itemId) {
    return this.assistantPhaseByItem.get(itemId) === "commentary";
  }
  shouldStreamAssistantPartial(itemId) {
    return this.assistantPhaseByItem.get(itemId) === "final_answer";
  }
  emitCommentaryProgress(params) {
    const progressText = params.text.replace(/\s+/g, " ").trim();
    if (!progressText || this.lastCommentaryProgressTextByItem.get(params.itemId) === progressText)
      return;
    this.lastCommentaryProgressTextByItem.set(params.itemId, progressText);
    this.emitAgentEvent({
      stream: "item",
      data: {
        itemId: params.itemId,
        kind: "preamble",
        title: "Preamble",
        phase: "update",
        progressText,
        source: "codex-app-server",
      },
    });
  }
  emitStandardItemEvent(params) {
    const { item } = params;
    if (!item) return;
    const kind = itemKind(item);
    if (!kind) return;
    const meta = itemMeta(item, this.toolProgressDetailMode());
    const suppressChannelProgress = shouldSuppressChannelProgressForItem(item);
    this.emitAgentEvent({
      stream: "item",
      data: {
        itemId: item.id,
        phase: params.phase,
        kind,
        title: itemTitle(item),
        status: params.phase === "start" ? "running" : itemStatus(item),
        ...(itemName(item) ? { name: itemName(item) } : {}),
        ...(meta ? { meta } : {}),
        ...(suppressChannelProgress ? { suppressChannelProgress: true } : {}),
      },
    });
  }
  async emitNormalizedToolItemEvent(params) {
    const { item } = params;
    if (!item || !shouldSynthesizeToolProgressForItem(item)) return;
    const name = itemName(item);
    if (!name) return;
    const status = params.phase === "result" ? itemStatus(item) : "running";
    const args = itemToolArgs(item);
    const meta = itemMeta(item, this.toolProgressDetailMode());
    this.recordToolTrajectoryEvent({
      phase: params.phase,
      item,
      name,
      args,
      status,
    });
    if (params.phase === "result")
      this.recordNativeToolError({
        item,
        name,
        meta,
        status,
      });
    if (!shouldEmitTranscriptToolProgress(name, args)) {
      if (params.phase === "result") {
        this.emitAfterToolCallObservation(item);
        await this.options.onNativeToolResultRecorded?.();
      }
      return;
    }
    this.emitAgentEvent({
      stream: "tool",
      data: {
        phase: params.phase,
        name,
        itemId: item.id,
        toolCallId: item.id,
        ...(meta ? { meta } : {}),
        ...(params.phase === "start" && args ? { args } : {}),
        ...(params.phase === "result"
          ? {
              status,
              isError: isNonSuccessItemStatus(status),
              ...itemToolResult(item),
            }
          : {}),
      },
    });
    if (params.phase === "result") {
      this.emitAfterToolCallObservation(item);
      await this.options.onNativeToolResultRecorded?.();
    }
  }
  clearTerminalPresentationForNativeItem(item) {
    if (
      !item ||
      this.terminalPresentationClearedItemIds.has(item.id) ||
      !shouldClearTerminalPresentationForNativeItem(item)
    )
      return;
    const toolCallOrdinal = this.nativeToolOutcomeOrdinals.get(item.id);
    this.terminalPresentationClearedItemIds.add(item.id);
    this.params.onToolOutcome?.({
      toolName: itemName(item) ?? item.type,
      argsHash: "",
      resultHash: "",
      ...(toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {}),
      terminalPresentation: void 0,
      presentationOnly: true,
    });
  }
  recordNativeToolError(params) {
    if (!isNonSuccessItemStatus(params.status)) {
      if (!this.lastNativeToolError) return;
      if (!this.lastNativeToolError.mutatingAction) {
        this.lastNativeToolError = void 0;
        return;
      }
      const actionFingerprint = nativeToolActionFingerprint(params.item);
      if (
        this.lastNativeToolError.actionFingerprint &&
        actionFingerprint &&
        this.lastNativeToolError.actionFingerprint === actionFingerprint
      )
        this.lastNativeToolError = void 0;
      return;
    }
    const error = itemToolError(params.item, params.status, this.toolResultOutputTextByItem);
    const actionFingerprint = nativeToolActionFingerprint(params.item);
    this.lastNativeToolError = {
      toolName: params.name,
      ...(params.meta ? { meta: params.meta } : {}),
      ...(error ? { error } : {}),
      ...(isMutatingNativeToolItem(params.item) ? { mutatingAction: true } : {}),
      ...(actionFingerprint ? { actionFingerprint } : {}),
    };
  }
  recordToolTrajectoryEvent(params) {
    if (params.phase === "start") {
      this.toolTrajectoryCallIds.add(params.item.id);
      this.toolTrajectoryNamesById.set(params.item.id, params.name);
      this.toolTrajectoryItemsById.set(params.item.id, params.item);
      this.options.trajectoryRecorder?.recordEvent("tool.call", {
        threadId: this.threadId,
        turnId: this.turnId,
        itemId: params.item.id,
        toolCallId: params.item.id,
        name: params.name,
        arguments: params.args,
      });
      return;
    }
    this.toolTrajectoryResultIds.add(params.item.id);
    const toolResult = itemToolResult(params.item).result;
    const output = itemOutputText(params.item, this.toolResultOutputTextByItem);
    this.options.trajectoryRecorder?.recordEvent("tool.result", {
      threadId: this.threadId,
      turnId: this.turnId,
      itemId: params.item.id,
      toolCallId: params.item.id,
      name: params.name,
      status: params.status,
      isError: isNonSuccessItemStatus(params.status),
      ...(toolResult ? { result: toolResult } : {}),
      ...(output ? { output } : {}),
    });
  }
  emitAfterToolCallObservation(item) {
    if (!this.shouldEmitAfterToolCallObservation(item)) return;
    const name = itemName(item);
    if (!name) return;
    const status = itemStatus(item);
    if (status === "running") return;
    this.afterToolCallObservedItemIds.add(item.id);
    const result = itemToolResult(item).result;
    const error = itemToolError(item, status, this.toolResultOutputTextByItem);
    const startedAt = resolveStartedAtFromDurationMs(item.durationMs);
    const hookParams = {
      toolName: name,
      toolCallId: item.id,
      runId: this.params.runId,
      agentId: this.params.agentId,
      sessionId: this.params.sessionId,
      sessionKey: this.params.sessionKey,
      startArgs: itemToolArgs(item) ?? {},
      ...(result !== void 0 ? { result } : {}),
      ...(error ? { error } : {}),
      ...(startedAt !== void 0 ? { startedAt } : {}),
    };
    setImmediate(() => {
      runAgentHarnessAfterToolCallHook(hookParams);
    });
  }
  shouldEmitAfterToolCallObservation(item) {
    if (
      !shouldSynthesizeToolProgressForItem(item) ||
      this.afterToolCallObservedItemIds.has(item.id)
    )
      return false;
    if (this.options.nativePostToolUseRelayEnabled && isNativePostToolUseRelayItem(item))
      return false;
    return true;
  }
  emitToolResultSummary(item) {
    if (!item || !this.params.onToolResult || !this.shouldEmitToolResult()) return;
    const itemId = item.id;
    if (this.toolResultSummaryItemIds.has(itemId)) return;
    const toolName = itemName(item);
    if (!toolName) return;
    if (!shouldEmitTranscriptToolProgress(toolName, itemToolArgs(item))) return;
    this.toolResultSummaryItemIds.add(itemId);
    const meta = itemMeta(item, this.toolProgressDetailMode());
    this.emitToolResultMessage({
      itemId,
      text: formatToolSummary(toolName, meta),
    });
  }
  emitToolResultOutput(item) {
    if (!item || !this.params.onToolResult || !this.shouldEmitToolOutput()) return;
    const itemId = item.id;
    if (this.toolResultOutputItemIds.has(itemId)) return;
    if (this.toolResultOutputStreamedItemIds.has(itemId)) return;
    const toolName = itemName(item);
    const output = itemOutputText(item, this.toolResultOutputTextByItem);
    if (!toolName || !output) return;
    if (!shouldEmitTranscriptToolProgress(toolName, itemToolArgs(item))) return;
    this.emitToolResultMessage({
      itemId,
      text: formatToolOutput(toolName, itemMeta(item, this.toolProgressDetailMode()), output),
      finalOutput: true,
      isError: isNonSuccessItemStatus(itemStatus(item)),
    });
  }
  emitToolResultMessage(params) {
    const rawText = params.text.trim();
    const text = truncateToolTranscriptText(rawText);
    if (!text) return;
    this.rememberToolProgressEcho(params.itemId, {
      displayText: text,
      rawText,
    });
    if (params.finalOutput) this.toolResultOutputItemIds.add(params.itemId);
    try {
      Promise.resolve(
        this.params.onToolResult?.({
          text,
          ...(params.isError === true ? { isError: true } : {}),
        }),
      ).catch(() => {});
    } catch {}
  }
  shouldEmitToolResult() {
    return typeof this.params.shouldEmitToolResult === "function"
      ? this.params.shouldEmitToolResult()
      : this.params.verboseLevel === "on" || this.params.verboseLevel === "full";
  }
  shouldEmitToolOutput() {
    return typeof this.params.shouldEmitToolOutput === "function"
      ? this.params.shouldEmitToolOutput()
      : this.params.verboseLevel === "full";
  }
  toolProgressDetailMode() {
    return resolveCodexToolProgressDetailMode(this.params.toolProgressDetail);
  }
  recordToolMeta(item) {
    if (!item) return;
    if (isSideEffectingNativeToolItem(item)) this.sideEffectingToolItemIds.add(item.id);
    else this.sideEffectingToolItemIds.delete(item.id);
    const toolName = itemName(item);
    if (!toolName) return;
    const meta = itemMeta(item, this.toolProgressDetailMode());
    const status = itemStatus(item);
    const existing = this.toolMetas.get(item.id);
    this.toolMetas.set(item.id, {
      toolName,
      ...(meta ? { meta } : {}),
      ...(existing?.asyncStarted ? { asyncStarted: true } : {}),
      ...(status !== "running" && isNonSuccessItemStatus(status) ? { isError: true } : {}),
    });
  }
  recordNativeToolTranscriptCall(item) {
    if (!item || !shouldRecordNativeToolTranscript(item)) return;
    const name = itemName(item);
    if (!name) return;
    this.recordToolTranscriptCall({
      id: item.id,
      name,
      arguments: itemToolArgs(item),
    });
  }
  recordNativeToolTranscriptResult(item) {
    if (!item || !shouldRecordNativeToolTranscript(item)) return;
    const name = itemName(item);
    if (!name) return;
    this.recordToolTranscriptResult({
      id: item.id,
      name,
      text: itemTranscriptResultText(item, this.toolResultOutputTextByItem),
      isError: isNonSuccessItemStatus(itemStatus(item)),
    });
  }
  recordToolTranscriptCall(params) {
    if (!params.id || !params.name || this.toolTranscriptCallIds.has(params.id)) return;
    this.toolTranscriptCallIds.add(params.id);
    this.toolTranscriptNamesById.set(params.id, params.name);
    this.toolTranscriptArgumentsById.set(params.id, params.arguments);
    if (!shouldEmitTranscriptToolProgress(params.name, params.arguments))
      this.transcriptToolProgressSuppressedIds.add(params.id);
    else this.transcriptToolProgressSuppressedIds.delete(params.id);
    this.emitTranscriptToolCallProgress(params);
    this.toolTranscriptMessages.push(
      attachCodexMirrorIdentity(
        this.createToolCallMessage(params),
        `${this.turnId}:tool:${params.id}:call`,
      ),
    );
  }
  recordToolTranscriptResult(params) {
    if (!params.id || !params.name || this.toolTranscriptResultIds.has(params.id)) return;
    this.toolTranscriptResultIds.add(params.id);
    this.emitTranscriptToolResultProgress(params);
    this.toolTranscriptMessages.push(
      attachCodexMirrorIdentity(
        this.createToolResultMessage(params),
        `${this.turnId}:tool:${params.id}:result`,
      ),
    );
  }
  synthesizeMissingToolResults(params) {
    if (!params.synthesize) return;
    const missingTranscriptIds = [...this.toolTranscriptCallIds].filter(
      (id) => !this.toolTranscriptResultIds.has(id),
    );
    const missingTrajectoryIds = [...this.toolTrajectoryCallIds].filter(
      (id) => !this.toolTrajectoryResultIds.has(id),
    );
    if (missingTranscriptIds.length === 0 && missingTrajectoryIds.length === 0) return;
    for (const id of missingTranscriptIds) {
      const name = this.toolTranscriptNamesById.get(id) ?? this.toolTrajectoryNamesById.get(id);
      if (!name) continue;
      this.recordToolTranscriptResult({
        id,
        name,
        text: formatMissingToolResultError({
          id,
          name,
        }),
        isError: true,
      });
    }
    for (const id of missingTrajectoryIds) {
      const name = this.toolTrajectoryNamesById.get(id) ?? this.toolTranscriptNamesById.get(id);
      if (!name) continue;
      this.toolTrajectoryResultIds.add(id);
      const text = formatMissingToolResultError({
        id,
        name,
      });
      this.options.trajectoryRecorder?.recordEvent("tool.result", {
        threadId: this.threadId,
        turnId: this.turnId,
        itemId: id,
        toolCallId: id,
        name,
        status: "failed",
        isError: true,
        result: {
          status: "failed",
          reason: "missing_tool_result",
        },
        output: text,
      });
    }
    if (!params.recordPromptError) {
      const firstMissingId =
        missingTranscriptIds.find((id) => {
          const name = this.toolTranscriptNamesById.get(id) ?? this.toolTrajectoryNamesById.get(id);
          return Boolean(name);
        }) ??
        missingTrajectoryIds.find((id) => {
          const name = this.toolTrajectoryNamesById.get(id) ?? this.toolTranscriptNamesById.get(id);
          return Boolean(name);
        });
      if (firstMissingId) {
        const name =
          this.toolTranscriptNamesById.get(firstMissingId) ??
          this.toolTrajectoryNamesById.get(firstMissingId);
        if (name) {
          const item = this.toolTrajectoryItemsById.get(firstMissingId);
          const meta = item
            ? itemMeta(item, this.toolProgressDetailMode())
            : this.toolMetas.get(firstMissingId)?.meta;
          const actionFingerprint = item ? nativeToolActionFingerprint(item) : void 0;
          this.lastNativeToolError = {
            toolName: name,
            ...(meta ? { meta } : {}),
            error: formatMissingToolResultError({
              id: firstMissingId,
              name,
            }),
            ...(item && isMutatingNativeToolItem(item) ? { mutatingAction: true } : {}),
            ...(actionFingerprint ? { actionFingerprint } : {}),
          };
        }
      }
      return;
    }
    const missingCount = /* @__PURE__ */ new Set([...missingTranscriptIds, ...missingTrajectoryIds])
      .size;
    this.synthesizedMissingToolResultError =
      missingCount === 1
        ? MISSING_TOOL_RESULT_ERROR
        : `${MISSING_TOOL_RESULT_ERROR} missingToolResultCount=${missingCount}`;
    this.promptErrorSource = this.promptErrorSource ?? "prompt";
  }
  emitTranscriptToolCallProgress(params) {
    if (!shouldEmitTranscriptToolProgress(params.name, params.arguments)) return;
    this.transcriptToolProgressCallIds.add(params.id);
    const args = normalizeToolTranscriptArguments(params.arguments);
    const meta = inferToolMetaFromArgs(params.name, args, {
      detailMode: this.toolProgressDetailMode(),
    });
    if (
      !this.params.onToolResult ||
      !this.shouldEmitToolResult() ||
      this.toolResultSummaryItemIds.has(params.id) ||
      this.toolResultOutputStreamedItemIds.has(params.id)
    )
      return;
    this.toolResultSummaryItemIds.add(params.id);
    this.emitToolResultMessage({
      itemId: params.id,
      text: formatToolSummary(params.name, meta),
    });
  }
  emitTranscriptToolResultProgress(params) {
    if (
      this.transcriptToolProgressSuppressedIds.has(params.id) ||
      !shouldEmitTranscriptToolProgress(
        params.name,
        this.toolTranscriptArgumentsById.get(params.id),
      )
    )
      return;
    if (!this.transcriptToolProgressCallIds.has(params.id))
      this.emitTranscriptToolCallProgress({
        id: params.id,
        name: params.name,
        arguments: {},
      });
    if (
      !this.params.onToolResult ||
      !this.shouldEmitToolOutput() ||
      this.toolResultOutputItemIds.has(params.id) ||
      this.toolResultOutputStreamedItemIds.has(params.id)
    )
      return;
    const text = params.text?.trim();
    if (!text) return;
    this.emitToolResultMessage({
      itemId: params.id,
      text: formatToolOutput(params.name, void 0, text),
      finalOutput: true,
      isError: params.isError,
    });
  }
  formatCodexErrorMessage(params) {
    const error = isJsonObject(params.error) ? params.error : void 0;
    return (
      formatCodexUsageLimitErrorMessage({
        message: error ? readString$2(error, "message") : void 0,
        codexErrorInfo: error?.codexErrorInfo,
        rateLimits: this.options.readRecentRateLimits?.(),
      }) ?? readCodexErrorNotificationMessage(params)
    );
  }
  emitAgentEvent(event) {
    try {
      emitAgentEvent({
        runId: this.params.runId,
        stream: event.stream,
        data: event.data,
        ...(this.params.sessionKey ? { sessionKey: this.params.sessionKey } : {}),
      });
    } catch (error) {
      log.debug("codex app-server global agent event emit failed", { error });
    }
    try {
      const maybePromise = this.params.onAgentEvent?.(event);
      Promise.resolve(maybePromise).catch((error) => {
        log.debug("codex app-server agent event handler rejected", { error });
      });
    } catch (error) {
      log.debug("codex app-server agent event handler threw", { error });
    }
  }
  collectAssistantTexts() {
    const finalText = this.resolveFinalAssistantText();
    return finalText ? [finalText] : [];
  }
  hasAssistantItemTextForSynthesis() {
    for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
      const itemId = this.assistantItemOrder[i];
      if (!itemId) continue;
      if (this.assistantPhaseByItem.get(itemId) === "commentary") continue;
      const text = this.assistantTextByItem.get(itemId);
      if (text && text.length > 0) return true;
    }
    return false;
  }
  resolveFinalAssistantText() {
    return this.resolveFinalAssistantTextItem()?.text;
  }
  resolveFinalAssistantTextItem() {
    for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
      const itemId = this.assistantItemOrder[i];
      if (!itemId) continue;
      const text = this.assistantTextByItem.get(itemId)?.trim();
      if (this.assistantPhaseByItem.get(itemId) === "commentary") continue;
      if (text && !this.isToolProgressEchoText(itemId, text))
        return {
          itemId,
          text,
        };
    }
  }
  rememberAssistantItem(itemId) {
    if (!itemId || this.assistantItemOrder.includes(itemId)) return;
    this.assistantItemOrder.push(itemId);
  }
  createCurrentAttemptAssistantMessage() {
    for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
      const itemId = this.assistantItemOrder[i];
      if (
        !itemId ||
        this.isCommentaryAssistantItem(itemId) ||
        !this.assistantTextByItem.has(itemId)
      )
        continue;
      const text = this.assistantTextByItem.get(itemId) ?? "";
      const normalizedText = text.trim();
      if (normalizedText && this.isToolProgressEchoText(itemId, normalizedText)) continue;
      return this.createAssistantMessage(text);
    }
  }
  isToolProgressEchoText(itemId, text) {
    if (!this.rawPromotedAssistantItemIds.has(itemId)) return false;
    for (const state of this.toolProgressEchoesByItem.values()) {
      if (state.streamedDisplayText === text) return true;
      if (state.displayTexts.includes(text)) return true;
      if (
        state.streamedRawSignature &&
        text.length === state.streamedRawSignature.length &&
        text.startsWith(state.streamedRawSignature.prefix)
      )
        return true;
      for (const signature of state.rawSignatures)
        if (text.length === signature.length && text.startsWith(signature.prefix)) return true;
    }
    return false;
  }
  rememberToolProgressEcho(itemId, signature) {
    if (!itemId) return;
    const existing = this.toolProgressEchoesByItem.get(itemId) ?? {
      displayTexts: [],
      rawSignatures: [],
    };
    const displayText = signature.displayText?.trim();
    if (displayText) {
      if (signature.streamedDisplay) existing.streamedDisplayText = displayText;
      else if (!existing.displayTexts.includes(displayText)) {
        if (existing.displayTexts.length >= TOOL_PROGRESS_ECHO_SIGNATURE_CAP)
          existing.displayTexts.shift();
        existing.displayTexts.push(displayText);
      }
    }
    const rawText = signature.rawText?.trim();
    const rawLength = signature.rawLength ?? rawText?.length;
    const rawPrefix = signature.rawPrefix?.trim() ?? rawText;
    if (
      rawLength !== void 0 &&
      rawPrefix &&
      rawPrefix.length >= TOOL_PROGRESS_ECHO_PREFIX_MIN_CHARS
    ) {
      const next = {
        length: rawLength,
        prefix: rawPrefix.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS),
      };
      if (signature.streamedDisplay) existing.streamedRawSignature = next;
      else {
        const matchIndex = existing.rawSignatures.findIndex(
          (entry) => entry.prefix === next.prefix,
        );
        if (matchIndex >= 0) existing.rawSignatures[matchIndex] = next;
        else {
          if (existing.rawSignatures.length >= TOOL_PROGRESS_ECHO_SIGNATURE_CAP)
            existing.rawSignatures.shift();
          existing.rawSignatures.push(next);
        }
      }
    }
    this.toolProgressEchoesByItem.set(itemId, existing);
  }
  rememberCommandAggregateOutputEcho(item) {
    if (item?.type !== "commandExecution" || typeof item.aggregatedOutput !== "string") return;
    const signature = toolOutputRawEchoSignature(item.aggregatedOutput);
    if (!signature) return;
    this.rememberToolProgressEcho(item.id, signature);
  }
  async readMirroredSessionMessages() {
    return (
      (await readCodexMirroredSessionHistoryMessages({
        agentId: this.params.agentId,
        sessionFile: this.params.sessionFile,
        sessionId: this.params.sessionId,
        sessionKey: this.params.sessionKey,
      })) ?? []
    );
  }
  createAssistantMessage(text) {
    const attribution = resolveCodexLocalRuntimeAttribution(this.params);
    const usage = this.tokenUsage
      ? {
          input: this.tokenUsage.input ?? 0,
          output: this.tokenUsage.output ?? 0,
          cacheRead: this.tokenUsage.cacheRead ?? 0,
          cacheWrite: this.tokenUsage.cacheWrite ?? 0,
          totalTokens:
            this.tokenUsage.total ??
            (this.tokenUsage.input ?? 0) +
              (this.tokenUsage.output ?? 0) +
              (this.tokenUsage.cacheRead ?? 0) +
              (this.tokenUsage.cacheWrite ?? 0),
          cost: ZERO_USAGE.cost,
        }
      : ZERO_USAGE;
    return {
      role: "assistant",
      content: [
        {
          type: "text",
          text,
        },
      ],
      api: attribution.api ?? "openai-chatgpt-responses",
      provider: attribution.provider,
      model: this.params.modelId,
      usage,
      stopReason: this.aborted ? "aborted" : this.promptError ? "error" : "stop",
      errorMessage: this.promptError ? formatErrorMessage$1(this.promptError) : void 0,
      timestamp: Date.now(),
    };
  }
  createAssistantMirrorMessage(title, text) {
    const attribution = resolveCodexLocalRuntimeAttribution(this.params);
    return {
      role: "assistant",
      content: [
        {
          type: "text",
          text: `${title}:\n${text}`,
        },
      ],
      api: attribution.api ?? "openai-chatgpt-responses",
      provider: attribution.provider,
      model: this.params.modelId,
      usage: ZERO_USAGE,
      stopReason: "stop",
      timestamp: Date.now(),
    };
  }
  createToolCallMessage(params) {
    const args = normalizeToolTranscriptArguments(params.arguments);
    const attribution = resolveCodexLocalRuntimeAttribution(this.params);
    return {
      role: "assistant",
      content: [
        {
          type: "toolCall",
          id: params.id,
          name: params.name,
          arguments: args,
          input: args,
        },
      ],
      api: attribution.api ?? "openai-chatgpt-responses",
      provider: attribution.provider,
      model: this.params.modelId,
      usage: ZERO_USAGE,
      stopReason: "toolUse",
      timestamp: Date.now(),
    };
  }
  createToolResultMessage(params) {
    const text = truncateToolTranscriptText(params.text?.trim() || toolResultStatusText(params));
    return {
      role: "toolResult",
      toolCallId: params.id,
      toolName: params.name,
      isError: params.isError,
      content: [
        {
          type: "toolResult",
          id: params.id,
          name: params.name,
          toolName: params.name,
          toolCallId: params.id,
          toolUseId: params.id,
          tool_use_id: params.id,
          content: text,
          text,
        },
      ],
      timestamp: Date.now(),
    };
  }
  isNotificationForTurn(params) {
    const threadId = readCodexNotificationThreadId(params);
    const turnId = readCodexNotificationTurnId(params);
    return threadId === this.threadId && turnId === this.turnId;
  }
  isHookNotificationForCurrentThread(params) {
    const threadId = readString$2(params, "threadId");
    const turnId = params.turnId;
    return threadId === this.threadId && (turnId === this.turnId || turnId === null);
  }
};
function isHookNotificationMethod(method) {
  return method === "hook/started" || method === "hook/completed";
}
function readString$2(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : void 0;
}
function estimateBase64DecodedBytes(base64) {
  let nonWhitespaceLength = 0;
  let previousCode = -1;
  let lastCode = -1;
  for (let i = 0; i < base64.length; i += 1) {
    const code = base64.charCodeAt(i);
    if (isBase64WhitespaceCode(code)) continue;
    nonWhitespaceLength += 1;
    previousCode = lastCode;
    lastCode = code;
  }
  if (nonWhitespaceLength === 0) return;
  const equalsCode = "=".charCodeAt(0);
  const padding = lastCode === equalsCode ? (previousCode === equalsCode ? 2 : 1) : 0;
  return Math.max(0, Math.floor((nonWhitespaceLength * 3) / 4) - padding);
}
function isBase64WhitespaceCode(code) {
  return code === 32 || code === 9 || code === 10 || code === 13;
}
function resolveGeneratedImageMaxBytes(config) {
  const configured = config?.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * BYTES_PER_MB);
  return DEFAULT_GENERATED_IMAGE_MAX_BYTES;
}
function normalizeNonEmptyString(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function readNonEmptyString(record, key) {
  return normalizeNonEmptyString(record[key]);
}
function readNonEmptyStringArray(record, key) {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  const entries = [];
  for (const entry of value) {
    const normalized = normalizeNonEmptyString(entry);
    if (normalized) entries.push(normalized);
  }
  return entries;
}
function readNullableString(record, key) {
  const value = record[key];
  if (value === null) return null;
  return typeof value === "string" ? value : void 0;
}
function readNumber(record, key) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function resolveStartedAtFromDurationMs(durationMs) {
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs)) return;
  return asDateTimestampMs(Date.now() - Math.max(0, durationMs));
}
function readNonNegativeInteger(record, key) {
  const value = readNumber(record, key);
  return value !== void 0 && Number.isInteger(value) && value >= 0 ? value : void 0;
}
function readCodexErrorNotificationMessage(record) {
  const error = record.error;
  return isJsonObject(error) ? readString$2(error, "message") : void 0;
}
function readHookOutputEntries(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!isJsonObject(entry)) return [];
    const text = readString$2(entry, "text");
    if (!text) return [];
    const kind = readString$2(entry, "kind");
    return [
      {
        ...(kind ? { kind } : {}),
        text,
      },
    ];
  });
}
function normalizeCodexTokenUsage(record) {
  const inputTokens = readNumber(record, "inputTokens");
  const cacheRead = readNumber(record, "cachedInputTokens");
  return normalizeUsage({
    input:
      inputTokens !== void 0 && cacheRead !== void 0
        ? Math.max(0, inputTokens - cacheRead)
        : inputTokens,
    output: readNumber(record, "outputTokens"),
    cacheRead,
    total: readNumber(record, "totalTokens"),
  });
}
function splitPlanText(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, ""))
    .filter((line) => line.length > 0);
}
function collectTextValues(map) {
  return [...map.values()].filter((text) => text.trim().length > 0);
}
function collectReasoningTextValues(groups, itemOrder) {
  return [...groups.values()]
    .toSorted((left, right) => {
      const itemDelta =
        (itemOrder.get(left.itemId) ?? Number.MAX_SAFE_INTEGER) -
        (itemOrder.get(right.itemId) ?? Number.MAX_SAFE_INTEGER);
      if (itemDelta !== 0) return itemDelta;
      const methodDelta = reasoningMethodOrder(left.method) - reasoningMethodOrder(right.method);
      return methodDelta !== 0 ? methodDelta : left.index - right.index;
    })
    .map((group) => group.text)
    .filter((text) => text.trim().length > 0);
}
function reasoningMethodOrder(method) {
  return method === "item/reasoning/summaryTextDelta" ? 0 : 1;
}
function extractRawAssistantText(item) {
  return (
    (Array.isArray(item.content) ? item.content : [])
      .flatMap((entry) => {
        if (!isJsonObject(entry)) return [];
        const type = readString$2(entry, "type");
        if (type !== "output_text" && type !== "text") return [];
        const value = readString$2(entry, "text");
        return value ? [value] : [];
      })
      .join("")
      .trim() || void 0
  );
}
function itemKind(item) {
  switch (item.type) {
    case "dynamicToolCall":
    case "mcpToolCall":
      return "tool";
    case "commandExecution":
      return "command";
    case "fileChange":
      return "patch";
    case "webSearch":
      return "search";
    case "reasoning":
    case "contextCompaction":
      return "analysis";
    default:
      return;
  }
}
function itemTitle(item) {
  switch (item.type) {
    case "commandExecution":
      return "Command";
    case "fileChange":
      return "File change";
    case "mcpToolCall":
      return "MCP tool";
    case "dynamicToolCall":
      return "Tool";
    case "webSearch":
      return "Web search";
    case "contextCompaction":
      return "Context compaction";
    case "reasoning":
      return "Reasoning";
    default:
      return item.type;
  }
}
function itemStatus(item) {
  const status = readItemString(item, "status");
  if (status === "failed" || status === "error") return "failed";
  if (status === "declined") return "blocked";
  if (status === "inProgress" || status === "in_progress" || status === "running") return "running";
  return "completed";
}
function auditNativeToolTerminalStatus(item) {
  if (item.type === "imageView" || item.type === "sleep") return "completed";
  const status = readItemString(item, "status");
  if (status === "completed") return "completed";
  if (status === "failed" || status === "error") return "failed";
  if (status === "declined") return "blocked";
  return "unknown";
}
function auditNativeToolUnfinishedStatus(item) {
  return item.type === "webSearch" || item.type === "imageGeneration" ? "unknown" : "failed";
}
function formatMissingToolResultError(params) {
  return `${MISSING_TOOL_RESULT_ERROR} toolCallId=${params.id}; toolName=${params.name}`;
}
function isNonSuccessItemStatus(status) {
  return status === "failed" || status === "blocked";
}
function itemName(item) {
  if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
  if (item.type === "mcpToolCall" && typeof item.tool === "string") {
    const server = typeof item.server === "string" ? item.server : void 0;
    return server ? `${server}.${item.tool}` : item.tool;
  }
  if (item.type === "commandExecution") return "bash";
  if (item.type === "fileChange") return "apply_patch";
  if (item.type === "webSearch") return "web_search";
}
function auditNativeToolName(item) {
  if (item.type === "dynamicToolCall") return;
  const progressName = itemName(item);
  if (progressName) return progressName;
  if (item.type === "collabAgentToolCall")
    return typeof item.tool === "string" && item.tool.trim()
      ? `collab.${item.tool.trim()}`
      : "collab_agent";
  if (item.type === "imageGeneration") return "image_generation";
  if (item.type === "imageView") return "image_view";
  if (item.type === "sleep") return "sleep";
}
function isSideEffectingNativeToolItem(item) {
  return (
    itemStatus(item) !== "blocked" &&
    (isMutatingNativeToolItem(item) || item.type === "mcpToolCall")
  );
}
function shouldSynthesizeToolProgressForItem(item) {
  switch (item.type) {
    case "commandExecution":
    case "fileChange":
    case "webSearch":
    case "mcpToolCall":
      return true;
    default:
      return false;
  }
}
function shouldRecordNativeToolTranscript(item) {
  return shouldSynthesizeToolProgressForItem(item) && item.type !== "webSearch";
}
function isMutatingNativeToolItem(item) {
  if (item.type === "commandExecution") return true;
  return (
    item.type === "fileChange" ||
    item.type === "collabAgentToolCall" ||
    item.type === "imageGeneration"
  );
}
function shouldClearTerminalPresentationForNativeItem(item) {
  switch (item.type) {
    case "collabAgentToolCall":
    case "commandExecution":
    case "fileChange":
    case "imageGeneration":
    case "imageView":
    case "mcpToolCall":
    case "webSearch":
      return true;
    default:
      return false;
  }
}
function nativeToolActionFingerprint(item) {
  if (item.type === "commandExecution" && typeof item.command === "string")
    return JSON.stringify({
      type: item.type,
      command: item.command,
      cwd: typeof item.cwd === "string" ? item.cwd : "",
    });
  if (item.type === "fileChange")
    return JSON.stringify({
      type: item.type,
      changes: itemFileChanges(item),
    });
}
function isNativePostToolUseRelayItem(item) {
  switch (item.type) {
    case "commandExecution":
    case "fileChange":
    case "mcpToolCall":
      return true;
    default:
      return false;
  }
}
function shouldSuppressChannelProgressForItem(item) {
  if (shouldSynthesizeToolProgressForItem(item)) return true;
  return item.type === "dynamicToolCall";
}
function itemToolArgs(item) {
  if (item.type === "commandExecution")
    return sanitizeCodexAgentEventRecord({
      command: item.command,
      ...(typeof item.cwd === "string" ? { cwd: item.cwd } : {}),
    });
  if (item.type === "fileChange")
    return sanitizeCodexAgentEventRecord({ changes: itemFileChangesForTranscript(item) });
  if (item.type === "webSearch") return webSearchToolArgs(item);
  if (item.type === "dynamicToolCall" || item.type === "mcpToolCall")
    return sanitizeCodexToolArguments(item.arguments);
}
function webSearchToolArgs(item) {
  const action = isJsonObject(item.action) ? item.action : void 0;
  const actionType = action ? readNonEmptyString(action, "type") : void 0;
  const queries =
    action && actionType === "search" ? readNonEmptyStringArray(action, "queries") : [];
  const query =
    normalizeNonEmptyString(item.query) ??
    (action && actionType === "search" ? readNonEmptyString(action, "query") : void 0) ??
    queries[0];
  const url = action ? readNonEmptyString(action, "url") : void 0;
  const pattern = action ? readNonEmptyString(action, "pattern") : void 0;
  const args = {};
  if (query) args.query = query;
  if (queries.length > 0) args.queries = queries;
  if (actionType && actionType !== "search") args.action = actionType;
  if (url) args.url = url;
  if (pattern) args.pattern = pattern;
  if (!query && !url && !pattern) args.queryUnavailable = true;
  return sanitizeCodexAgentEventRecord(args);
}
function itemToolResult(item) {
  if (item.type === "commandExecution")
    return {
      result: sanitizeCodexAgentEventRecord({
        status: item.status,
        exitCode: item.exitCode,
        durationMs: item.durationMs,
      }),
    };
  if (item.type === "fileChange")
    return {
      result: sanitizeCodexAgentEventRecord({
        status: item.status,
        changes: itemFileChanges(item),
      }),
    };
  if (item.type === "mcpToolCall")
    return {
      result: sanitizeCodexAgentEventRecord({
        status: item.status,
        durationMs: item.durationMs,
        ...(item.error ? { error: item.error } : {}),
        ...(item.result ? { result: item.result } : {}),
      }),
    };
  if (item.type === "webSearch") return { result: webSearchToolResult(item) };
  return {};
}
function webSearchToolResult(item) {
  return sanitizeCodexAgentEventRecord({
    status: itemStatus(item),
    ...(typeof item.durationMs === "number" ? { durationMs: item.durationMs } : {}),
    ...webSearchToolArgs(item),
  });
}
function itemFileChangeRecords(item) {
  const changes = item.changes;
  return Array.isArray(changes) ? changes.filter(isJsonObject) : [];
}
function itemFileChanges(item) {
  return itemFileChangeRecords(item).flatMap((change) => {
    const path = normalizeNonEmptyString(change.path);
    if (!path || change.kind === void 0) return [];
    return [
      {
        path,
        kind: change.kind,
      },
    ];
  });
}
function fileChangeKindType(kind) {
  if (typeof kind === "string") return kind;
  return isJsonObject(kind) ? normalizeNonEmptyString(kind.type) : void 0;
}
function countFileContentLines(content) {
  if (!content) return 0;
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length > 1 && lines.at(-1) === "") lines.pop();
  return lines.length;
}
function fileChangeDiffStat(diff, kind) {
  const kindType = fileChangeKindType(kind);
  if (kindType === "add")
    return {
      added: countFileContentLines(diff),
      removed: 0,
    };
  if (kindType === "delete")
    return {
      added: 0,
      removed: countFileContentLines(diff),
    };
  let added = 0;
  let removed = 0;
  let inHunk = false;
  for (const line of diff.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
    if (line.startsWith("@@")) {
      inHunk = true;
      continue;
    }
    if (!inHunk) continue;
    if (line.startsWith("+")) added += 1;
    else if (line.startsWith("-")) removed += 1;
  }
  return {
    added,
    removed,
  };
}
function truncateFileChangeDiffAtLineBoundary(diff, maxChars) {
  if (diff.length <= maxChars) return { diff };
  if (maxChars <= 0) return { diffTruncated: true };
  const boundary = diff.lastIndexOf("\n", maxChars - 1);
  return boundary >= 0
    ? {
        diff: diff.slice(0, boundary + 1),
        diffTruncated: true,
      }
    : { diffTruncated: true };
}
function itemFileChangesForTranscript(item) {
  let remainingDiffChars = TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS;
  return itemFileChangeRecords(item).flatMap((change) => {
    const path = normalizeNonEmptyString(change.path);
    if (!path || change.kind === void 0) return [];
    const result = {
      path,
      kind: change.kind,
    };
    if (typeof change.diff !== "string") return [result];
    result.stat = fileChangeDiffStat(change.diff, change.kind);
    const bounded = truncateFileChangeDiffAtLineBoundary(change.diff, remainingDiffChars);
    if (bounded.diff !== void 0) {
      result.diff = bounded.diff;
      remainingDiffChars -= bounded.diff.length;
    }
    if (bounded.diffTruncated) result.diffTruncated = true;
    return [result];
  });
}
function itemToolError(item, status, outputTextByItem) {
  if (status === "blocked") return "codex native tool blocked";
  if (status !== "failed") return;
  return itemOutputText(item, outputTextByItem) ?? "codex native tool failed";
}
function itemMeta(item, detailMode = "explain") {
  if (item.type === "commandExecution" && typeof item.command === "string")
    return inferToolMetaFromArgs(
      "exec",
      {
        command: item.command,
        cwd: typeof item.cwd === "string" ? item.cwd : void 0,
      },
      { detailMode },
    );
  if (item.type === "webSearch")
    return inferToolMetaFromArgs("web_search", webSearchToolArgs(item), { detailMode });
  const toolName = itemName(item);
  if ((item.type === "dynamicToolCall" || item.type === "mcpToolCall") && toolName)
    return inferToolMetaFromArgs(toolName, item.arguments, { detailMode });
}
function itemOutputText(item, outputTextByItem) {
  if (item.type === "commandExecution") {
    const output = item.aggregatedOutput?.trim() || outputTextByItem?.get(item.id)?.trim();
    return output ? truncateToolTranscriptText(output) : void 0;
  }
  if (item.type === "dynamicToolCall") {
    const output = collectDynamicToolContentText(item.contentItems).trim();
    return output ? truncateToolTranscriptText(output) : void 0;
  }
  if (item.type === "mcpToolCall") {
    const output = item.error
      ? stringifyJsonValue(item.error)
      : item.result
        ? stringifyJsonValue(item.result)
        : void 0;
    return output ? truncateToolTranscriptText(output) : void 0;
  }
}
function itemTranscriptResultText(item, outputTextByItem) {
  const output = itemOutputText(item, outputTextByItem);
  if (output) return output;
  const result = itemToolResult(item).result;
  const resultText = result ? stringifyJsonValue(result) : void 0;
  return resultText ? truncateToolTranscriptText(resultText) : itemStatus(item);
}
function appendToolOutputDeltaText(
  outputTextByItem,
  outputPrefixByItem,
  originalLengthByItem,
  normalizedLengthByItem,
  trimStateByItem,
  truncatedItemIds,
  itemId,
  delta,
) {
  const originalLength =
    (originalLengthByItem.get(itemId) ?? outputTextByItem.get(itemId)?.length ?? 0) + delta.length;
  originalLengthByItem.set(itemId, originalLength);
  const normalizedLength = updateToolOutputTrimState(trimStateByItem, itemId, delta);
  normalizedLengthByItem.set(itemId, normalizedLength);
  if (truncatedItemIds.has(itemId)) {
    const next = appendBoundedToolTranscriptText(
      outputPrefixByItem.get(itemId) ?? outputTextByItem.get(itemId) ?? "",
      "",
      originalLength,
    );
    outputPrefixByItem.set(itemId, next.rawPrefix);
    outputTextByItem.set(itemId, next.text);
    return {
      text: next.text,
      originalLength,
      normalizedLength,
      rawPrefix: next.rawPrefix,
    };
  }
  const next = appendBoundedToolTranscriptText(
    outputPrefixByItem.get(itemId) ?? outputTextByItem.get(itemId) ?? "",
    delta,
    originalLength,
  );
  outputPrefixByItem.set(itemId, next.rawPrefix);
  outputTextByItem.set(itemId, next.text);
  if (originalLength > TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS) truncatedItemIds.add(itemId);
  return {
    text: next.text,
    originalLength,
    normalizedLength,
    rawPrefix: next.rawPrefix,
  };
}
function updateToolOutputTrimState(trimStateByItem, itemId, delta) {
  const state = trimStateByItem.get(itemId) ?? {
    totalLength: 0,
    leadingWhitespaceLength: 0,
    trailingWhitespaceLength: 0,
    sawNonWhitespace: false,
  };
  state.totalLength += delta.length;
  const firstNonWhitespace = delta.search(/\S/u);
  if (firstNonWhitespace === -1) {
    if (!state.sawNonWhitespace) state.leadingWhitespaceLength += delta.length;
    state.trailingWhitespaceLength += delta.length;
    trimStateByItem.set(itemId, state);
    return state.sawNonWhitespace
      ? state.totalLength - state.leadingWhitespaceLength - state.trailingWhitespaceLength
      : 0;
  }
  if (!state.sawNonWhitespace) {
    state.leadingWhitespaceLength += firstNonWhitespace;
    state.sawNonWhitespace = true;
  }
  state.trailingWhitespaceLength = delta.match(/\s*$/u)?.[0].length ?? 0;
  trimStateByItem.set(itemId, state);
  return state.totalLength - state.leadingWhitespaceLength - state.trailingWhitespaceLength;
}
function toolOutputRawEchoSignature(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  return {
    rawLength: trimmed.length,
    rawPrefix: trimmed.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS),
  };
}
function normalizeToolTranscriptArguments(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function collectDynamicToolContentText(contentItems) {
  if (!Array.isArray(contentItems)) return "";
  return contentItems
    .flatMap((entry) => {
      if (!isJsonObject(entry)) return [];
      const text = readString$2(entry, "text");
      return text ? [text] : [];
    })
    .join("\n");
}
function appendBoundedToolTranscriptText(currentPrefix, delta, originalLength) {
  if (originalLength <= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS) {
    const rawPrefix = currentPrefix + delta;
    return {
      text: rawPrefix,
      rawPrefix,
    };
  }
  const notice = toolTranscriptTruncationNotice(originalLength);
  if (notice.length >= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)
    return {
      text: notice.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS),
      rawPrefix: "",
    };
  const textBudget = TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS - notice.length;
  const remaining = Math.max(0, textBudget - currentPrefix.length);
  const rawPrefix = truncateUtf16Safe(
    remaining > 0 ? `${currentPrefix}${truncateUtf16Safe(delta, remaining)}` : currentPrefix,
    textBudget,
  );
  return {
    text: `${rawPrefix}${notice}`,
    rawPrefix,
  };
}
function toolTranscriptTruncationNotice(originalLength) {
  return `\n${`${TOOL_OUTPUT_TRUNCATION_NOTICE_PREFIX}: original ${originalLength} chars, showing ${TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS}; rerun with narrower args.)`}`;
}
function truncateToolTranscriptText(text, originalLength = text.length) {
  if (
    originalLength <= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS &&
    text.length <= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS
  )
    return text;
  const notice = toolTranscriptTruncationNotice(originalLength);
  if (notice.length >= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS) return notice.slice(1, 10001);
  return `${truncateUtf16Safe(text, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS - notice.length)}${notice}`;
}
function toolResultStatusText(params) {
  return params.isError ? `${params.name} failed` : `${params.name} completed`;
}
function stringifyJsonValue(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return;
  }
}
function formatToolSummary(toolName, meta) {
  const trimmedMeta = meta?.trim();
  return formatToolAggregate(toolName, trimmedMeta ? [trimmedMeta] : void 0, { markdown: true });
}
function formatToolOutput(toolName, meta, output) {
  const formattedOutput = formatToolProgressOutput(output);
  if (!formattedOutput) return formatToolSummary(toolName, meta);
  const fence = markdownFenceForText(formattedOutput);
  return `${formatToolSummary(toolName, meta)}\n${fence}txt\n${formattedOutput}\n${fence}`;
}
function markdownFenceForText(text) {
  return "`".repeat(Math.max(3, longestBacktickRun(text) + 1));
}
function longestBacktickRun(value) {
  let longest = 0;
  let current = 0;
  for (const char of value) {
    if (char === "`") {
      current += 1;
      longest = Math.max(longest, current);
      continue;
    }
    current = 0;
  }
  return longest;
}
function readItemString(item, key) {
  const value = item[key];
  return typeof value === "string" ? value : void 0;
}
function readItem(value) {
  if (!isJsonObject(value)) return;
  const type = typeof value.type === "string" ? value.type : void 0;
  const id = typeof value.id === "string" ? value.id : void 0;
  if (!type || !id) return;
  return value;
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-build-state.ts
/** Mutable dependency seam shared by dynamic-tool construction and its behavioral tests. */
const dynamicToolBuildState = {};
//#endregion
//#region extensions/codex/src/app-server/message-tool-final-control.ts
/**
 * `final` is a Codex-only control for message-tool-only source delivery. Keep
 * it on the projected Codex schema so other agent runtimes never receive an
 * API contract they do not implement.
 */
function addCodexMessageToolOnlyFinalControl(tools, sourceReplyDeliveryMode) {
  if (sourceReplyDeliveryMode !== "message_tool_only") return tools;
  for (const tool of tools)
    if (normalizeCodexDynamicToolName(tool.name) === "message") {
      const mutableTool = tool;
      mutableTool.parameters = addCodexMessageToolOnlyFinalParameter(mutableTool.parameters);
    }
  return tools;
}
function addCodexMessageToolOnlyFinalParameter(parameters) {
  if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) return parameters;
  const schema = parameters;
  const rawProperties = schema.properties;
  if (!rawProperties || typeof rawProperties !== "object" || Array.isArray(rawProperties))
    return parameters;
  return {
    ...schema,
    properties: {
      ...rawProperties,
      final: {
        type: "boolean",
        description:
          "Set true only when this message is intended to complete the reply to the current source conversation. OpenClaw stops after confirming delivery.",
      },
    },
  };
}
//#endregion
//#region extensions/codex/src/app-server/vision-tools.ts
/**
 * Filters Codex dynamic tools for turns that already contain image inputs so
 * models with native vision do not get redundant image-inspection tools.
 */
/** Removes the image tool when the model can directly consume inbound images. */
function filterToolsForVisionInputs(tools, params) {
  if (!params.modelHasVision || !params.hasInboundImages) return tools;
  return tools.filter((tool) => tool.name !== "image");
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-build.ts
/**
 * Builds the Codex app-server dynamic tool list for one turn, including
 * OpenClaw-owned tools, Codex native-tool fallback rules, sandbox shell shims,
 * and provider allowlist normalization.
 */
const CODEX_NATIVE_SANDBOX_TOOL_REQUIREMENTS = [
  "exec",
  "process",
  "read",
  "write",
  "edit",
  "apply_patch",
];
const CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW = /* @__PURE__ */ new Set(["read", "write"]);
const CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME = "node_exec";
const CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME = "node_process";
const CODEX_NODE_EXEC_POLICY_PARAMETER_NAMES = /* @__PURE__ */ new Set(["host", "security", "ask"]);
function preserveRingZeroCrestodianTool(allTools, filteredTools) {
  const crestodian = allTools.find(
    (tool) => tool.name === "crestodian" && tool.catalogMode === "direct-only",
  );
  if (!crestodian) return filteredTools;
  return [crestodian, ...filteredTools.filter((tool) => tool.name !== "crestodian")];
}
/** Splits sandbox and run session keys so tool calls can bind to both scopes when needed. */
function resolveOpenClawCodingToolsSessionKeys(params, sandboxSessionKey) {
  return {
    sessionKey: sandboxSessionKey,
    runSessionKey:
      params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0,
  };
}
/** Returns the canonical channel used for Codex message routing and receipts. */
function resolveCodexMessageToolProvider(params) {
  return params.messageChannel ?? params.messageProvider;
}
/** Resolves the channel id that hook events should target for this Codex app-server turn. */
function resolveCodexAppServerHookChannelId(params, sandboxSessionKey) {
  return buildAgentHookContextChannelFields({
    sessionKey: sandboxSessionKey,
    messageChannel: params.messageChannel,
    messageProvider: params.messageProvider,
    currentChannelId: params.currentChannelId,
    messageTo: params.messageTo,
  }).channelId;
}
const CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS = 1e3;
const CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS = 500;
/** Creates cheap optional timing instrumentation for the dynamic-tool hot path. */
function createCodexDynamicToolBuildStageTracker(options = {}) {
  if (!options.enabled)
    return {
      mark() {},
      snapshot() {
        return {
          totalMs: 0,
          stages: [],
        };
      },
    };
  const startedAt = Date.now();
  let previousAt = startedAt;
  const stages = [];
  const toMs = (value) => Math.max(0, Math.round(value));
  return {
    mark(name) {
      const currentAt = Date.now();
      stages.push({
        name,
        durationMs: toMs(currentAt - previousAt),
        elapsedMs: toMs(currentAt - startedAt),
      });
      previousAt = currentAt;
    },
    snapshot() {
      return {
        totalMs: toMs(Date.now() - startedAt),
        stages: stages.slice(),
      };
    },
  };
}
/** Returns true when dynamic-tool construction is slow enough to warrant a warning log. */
function shouldWarnCodexDynamicToolBuildStageSummary(summary) {
  return (
    summary.totalMs >= CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS ||
    summary.stages.some((stage) => stage.durationMs >= CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS)
  );
}
/** Formats per-stage timings into the compact form used by Codex app-server logs. */
function formatCodexDynamicToolBuildStageSummary(summary) {
  return summary.stages.length > 0
    ? summary.stages
        .map((stage) => `${stage.name}:${stage.durationMs}ms@${stage.elapsedMs}ms`)
        .join(",")
    : "none";
}
/** Builds, filters, and normalizes Codex-compatible runtime tools for a single turn. */
async function buildDynamicTools(input) {
  const { params } = input;
  const messagePolicyParams = input.ignoreDisableMessageTool
    ? {
        ...params,
        disableMessageTool: false,
      }
    : params;
  if (params.disableTools) {
    input.onWebSearchPolicyResolved?.(false);
    return [];
  }
  if (!supportsModelTools(params.model)) {
    input.onPersistentWebSearchPolicyResolved?.(false);
    input.onWebSearchPolicyResolved?.(false);
    return [];
  }
  const toolBuildStages = createCodexDynamicToolBuildStageTracker({
    enabled: input.profilerEnabled,
  });
  const modelHasVision = params.model.input?.includes("image") ?? false;
  const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, input.sessionAgentId);
  const agentHarness = await import("./plugin-sdk/agent-harness.js");
  const createOpenClawCodingTools =
    dynamicToolBuildState.openClawCodingToolsFactory ?? agentHarness.createOpenClawCodingTools;
  toolBuildStages.mark("load-agent-harness-tools");
  const sessionKeys = resolveOpenClawCodingToolsSessionKeys(params, input.sandboxSessionKey);
  const nativeExecutionPolicy = resolveCodexNativeExecutionPolicyForDynamicTools(input);
  const codexScopedTools = addCodexMessageToolOnlyFinalControl(
    createOpenClawCodingTools({
      agentId: input.sessionAgentId,
      ...buildEmbeddedAttemptToolRunContext(params),
      exec: {
        ...params.execOverrides,
        ...resolveCodexNodeExecToolOverrides(nativeExecutionPolicy),
        config: params.config,
        elevated: params.bashElevated,
      },
      sandbox: input.sandbox,
      messageProvider: resolveCodexMessageToolProvider(params),
      toolPolicyMessageProvider: params.messageProvider ?? params.messageChannel,
      clientCaps: params.clientCaps,
      chatType: params.chatType,
      agentAccountId: params.agentAccountId,
      messageTo: params.messageTo,
      messageThreadId: params.messageThreadId,
      nativeChannelId: params.chatId,
      messageActionTurnCapability: params.messageActionTurnCapability,
      groupId: params.groupId,
      groupChannel: params.groupChannel,
      groupSpace: params.groupSpace,
      spawnedBy: params.spawnedBy,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
      senderIsOwner: params.senderIsOwner,
      allowGatewaySubagentBinding:
        params.allowGatewaySubagentBinding || isForcedPrivateQaCodexRuntime(),
      ...sessionKeys,
      sessionId: params.sessionId,
      runId: params.runId,
      approvalReviewerDeviceId: params.approvalReviewerDeviceId,
      agentDir,
      cwd: input.effectiveCwd ?? input.effectiveWorkspace,
      workspaceDir: input.effectiveWorkspace,
      spawnWorkspaceDir:
        input.effectiveCwd && input.effectiveCwd !== input.effectiveWorkspace
          ? input.resolvedWorkspace
          : resolveAttemptSpawnWorkspaceDir({
              sandbox: input.sandbox,
              resolvedWorkspace: input.resolvedWorkspace,
            }),
      config: params.config,
      authProfileStore: params.toolAuthProfileStore ?? params.authProfileStore,
      abortSignal: input.runAbortController.signal,
      emitBeforeToolCallDiagnostics: false,
      modelProvider: params.model.provider,
      modelId: params.modelId,
      modelCompat:
        params.model.compat && typeof params.model.compat === "object"
          ? params.model.compat
          : void 0,
      modelApi: params.model.api,
      modelContextWindowTokens: params.model.contextWindow,
      modelAuthMode: resolveModelAuthMode(
        params.model.provider,
        params.config,
        params.toolAuthProfileStore ?? params.authProfileStore,
        { workspaceDir: input.effectiveWorkspace },
      ),
      suppressManagedWebSearch: false,
      currentChannelId: params.currentChannelId,
      currentMessagingTarget: params.currentMessagingTarget,
      hookChannelId: resolveCodexAppServerHookChannelId(params, input.sandboxSessionKey),
      currentThreadTs: params.currentThreadTs,
      currentMessageId: params.currentMessageId,
      replyToMode: params.replyToMode,
      hasRepliedRef: params.hasRepliedRef,
      modelHasVision,
      computerContextEpoch: input.computerContextEpoch,
      requireExplicitMessageTarget:
        params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
      sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
      disableMessageTool: input.ignoreDisableMessageTool ? false : params.disableMessageTool,
      forceMessageTool: shouldForceMessageTool(messagePolicyParams),
      enableHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
      forceHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
      onYield: (message) => {
        input.onYieldDetected();
        input.onCodexAppServerEvent?.({
          stream: "codex_app_server.tool",
          data: {
            name: "sessions_yield",
            message,
          },
        });
      },
      recordToolPrepStage: (name) => {
        toolBuildStages.mark(name);
      },
      onToolOutcome: params.onToolOutcome,
      allocateToolOutcomeOrdinal: params.allocateToolOutcomeOrdinal,
    }),
    params.sourceReplyDeliveryMode,
  );
  toolBuildStages.mark("create-openclaw-coding-tools");
  const preNormalizationDiagnostics = [];
  const readableAllToolProjection = filterProviderNormalizableTools(codexScopedTools);
  preNormalizationDiagnostics.push(...readableAllToolProjection.diagnostics);
  const webSearchPlan = resolveCodexWebSearchPlan({
    config: params.config,
    disableTools: params.disableTools,
    nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled,
    nativeProviderWebSearchSupport: input.nativeProviderWebSearchSupport,
  });
  const readableAllTools = [...readableAllToolProjection.tools];
  const normallyProfiledTools = filterCodexDynamicTools(readableAllTools, input.pluginConfig);
  const profileFilteredTools =
    (input.isHostScopedToolActive?.("crestodian") ?? isHostScopedAgentToolActive("crestodian")) &&
    isCrestodianOnlyCodexDynamicToolAllowlist(params.toolsAllow)
      ? preserveRingZeroCrestodianTool(readableAllTools, normallyProfiledTools)
      : normallyProfiledTools;
  const codexFilteredTools = addNodeShellDynamicToolsIfNeeded(
    addSandboxShellDynamicToolsIfAvailable(
      isCodexMemoryFlushRun(params)
        ? filterCodexMemoryFlushDynamicTools(readableAllTools)
        : profileFilteredTools,
      readableAllTools,
      input,
    ),
    readableAllTools,
    input,
    nativeExecutionPolicy,
  );
  toolBuildStages.mark("codex-filtering");
  const visionFilteredTools = filterToolsForVisionInputs(codexFilteredTools, {
    modelHasVision,
    hasInboundImages: (params.images?.length ?? 0) > 0,
  });
  toolBuildStages.mark("vision-filtering");
  const webSearchPresent = visionFilteredTools.some((tool) => tool.name === "web_search");
  const webSearchPolicy = agentHarness.resolveWebSearchToolPolicy({
    config: params.config,
    modelProvider: params.model.provider,
    modelId: params.modelId,
    agentId: input.sessionAgentId,
    sessionKey: input.sandboxSessionKey,
    sandboxToolPolicy: input.sandbox?.tools,
    messageProvider: resolveCodexMessageToolProvider(params),
    agentAccountId: params.agentAccountId,
    groupId: params.groupId,
    groupChannel: params.groupChannel,
    groupSpace: params.groupSpace,
    spawnedBy: params.spawnedBy,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  const transientWebSearchRestriction =
    (!webSearchPolicy.allowed && webSearchPolicy.persistentAllowed) ||
    isCodexMemoryFlushRun(params);
  const persistentCodexWebSearchSurface =
    params.config?.tools?.web?.search?.enabled !== false &&
    !(input.pluginConfig.codexDynamicToolsExclude ?? []).some(
      (name) => normalizeCodexDynamicToolName(name) === "web_search",
    );
  input.onPersistentWebSearchPolicyResolved?.(
    webSearchPresent ||
      (persistentCodexWebSearchSurface &&
        transientWebSearchRestriction &&
        webSearchPolicy.persistentAllowed),
  );
  const filteredTools = filterCodexDynamicToolsForAllowlist(
    visionFilteredTools,
    includeForcedCodexDynamicToolAllow(params.toolsAllow, messagePolicyParams),
  );
  toolBuildStages.mark("allowlist-filter");
  const normalizedTools = normalizeAgentRuntimeTools({
    runtimePlan: input.ignoreRuntimePlan ? void 0 : params.runtimePlan,
    tools: filteredTools,
    provider: params.provider,
    config: params.config,
    workspaceDir: input.effectiveWorkspace,
    env: process.env,
    modelId: params.modelId,
    modelApi: params.model.api,
    model: params.model,
    onPreNormalizationSchemaDiagnostics: (diagnostics) =>
      preNormalizationDiagnostics.push(...diagnostics),
  });
  toolBuildStages.mark("runtime-normalization");
  input.onWebSearchPolicyResolved?.(normalizedTools.some((tool) => tool.name === "web_search"));
  const exposedTools = webSearchPlan.suppressManagedWebSearch
    ? normalizedTools.filter((tool) => tool.name !== "web_search")
    : normalizedTools;
  if (preNormalizationDiagnostics.length > 0)
    log.warn(
      `codex app-server quarantined ${preNormalizationDiagnostics.length} unsupported runtime tool schema${preNormalizationDiagnostics.length === 1 ? "" : "s"} before dynamic tool registration`,
      {
        runId: params.runId,
        sessionId: params.sessionId,
        diagnostics: preNormalizationDiagnostics.map((diagnostic) => ({
          index: diagnostic.toolIndex,
          tool: diagnostic.toolName,
          violations: diagnostic.violations.slice(0, 12),
          violationCount: diagnostic.violations.length,
        })),
      },
    );
  const summary = toolBuildStages.snapshot();
  if (shouldWarnCodexDynamicToolBuildStageSummary(summary)) {
    const phase = input.forceHeartbeatTool ? "registered-tools" : "runtime-tools";
    log.warn(
      `codex app-server dynamic tool build timings runId=${params.runId} sessionId=${params.sessionId} phase=${phase} totalMs=${summary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(summary)}`,
      {
        runId: params.runId,
        sessionId: params.sessionId,
        phase,
        totalMs: summary.totalMs,
        stages: summary.stages,
        allToolCount: readableAllTools.length,
        codexFilteredToolCount: codexFilteredTools.length,
        visionFilteredToolCount: visionFilteredTools.length,
        filteredToolCount: filteredTools.length,
        normalizedToolCount: exposedTools.length,
        forceHeartbeatTool: input.forceHeartbeatTool === true,
        ignoreRuntimePlan: input.ignoreRuntimePlan === true,
        nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled === true,
      },
    );
  }
  return exposedTools;
}
/** Preserves delivery-critical tools when a narrow allowlist would otherwise hide them. */
function includeForcedCodexDynamicToolAllow(toolsAllow, params) {
  if (toolsAllow === void 0 || hasWildcardCodexToolsAllow(toolsAllow)) return toolsAllow;
  const forcedToolNames = shouldForceMessageTool(params) ? ["message"] : [];
  if (forcedToolNames.length === 0) return toolsAllow;
  if (toolsAllow.length === 0) return forcedToolNames;
  const normalized = new Set(toolsAllow.map((name) => normalizeCodexDynamicToolName(name)));
  const missingToolNames = forcedToolNames.filter(
    (toolName) => !normalized.has(normalizeCodexDynamicToolName(toolName)),
  );
  return missingToolNames.length === 0 ? toolsAllow : [...toolsAllow, ...missingToolNames];
}
/** Decides whether Codex native code mode can own shell/file tools for this turn. */
function shouldEnableCodexAppServerNativeToolSurface(params, sandbox, options = {}) {
  if (isCodexMemoryFlushRun(params)) return false;
  const toolsAllow = includeForcedCodexDynamicToolAllow(params.toolsAllow, params);
  if (toolsAllow === void 0)
    return canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
  return (
    hasWildcardCodexToolsAllow(toolsAllow) &&
    canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options)
  );
}
/** Returns true when OpenClaw policy requires the Node-owned exec/process tools instead. */
function isCodexNativeExecutionBlockedByNodeExecHost(params, options = {}) {
  return !resolveCodexNativeExecutionPolicy({
    config: params.config,
    sessionKey: resolveCodexRuntimePolicySessionKey(params, options.runtimeSessionKey),
    sessionId: params.sessionId,
    agentId: options.agentId,
    execOverrides: params.execOverrides,
    sandboxAvailable: options.sandbox?.enabled,
    readRuntimeSessionEntry: true,
  }).nativeToolSurfaceAllowed;
}
function resolveCodexRuntimePolicySessionKey(params, runtimeSessionKey) {
  return (
    runtimeSessionKey?.trim() ||
    params.sandboxSessionKey?.trim() ||
    params.sessionKey?.trim() ||
    params.sessionId
  );
}
function canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options = {}) {
  if (!sandbox?.enabled) return true;
  if (
    options.sandboxExecServerEnabled === true &&
    sandbox.backend &&
    canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox)
  )
    return true;
  return false;
}
function canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox) {
  return CODEX_NATIVE_SANDBOX_TOOL_REQUIREMENTS.every((toolName) =>
    isToolAllowed(sandbox.tools, toolName),
  );
}
function isCodexMemoryFlushRun(params) {
  return params?.trigger === "memory" && Boolean(params.memoryFlushWritePath?.trim());
}
function filterCodexMemoryFlushDynamicTools(tools) {
  return tools.filter((tool) =>
    CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW.has(normalizeCodexDynamicToolName(tool.name)),
  );
}
/** Requires a Codex sandbox environment only when native tools must run inside OpenClaw sandboxing. */
function shouldRequireCodexSandboxExecServerEnvironment(params) {
  return Boolean(
    params.sandbox?.enabled && params.nativeToolSurfaceEnabled && params.sandboxExecServerEnabled,
  );
}
/** Selects the sandbox exec-server environment passed through the Codex app-server protocol. */
function resolveCodexSandboxEnvironmentSelection(environment, nativeToolSurfaceEnabled) {
  return environment && nativeToolSurfaceEnabled ? [environment] : void 0;
}
/** Chooses the cwd visible to Codex native execution after sandbox exec-server setup. */
function resolveCodexAppServerExecutionCwd(params) {
  return mapCodexAppServerRemoteWorkspacePath({
    value:
      params.environment && params.nativeToolSurfaceEnabled
        ? params.environment.cwd
        : params.effectiveCwd,
    localWorkspaceRoot: params.localWorkspaceRoot,
    remoteWorkspaceRoot: params.remoteWorkspaceRoot,
  });
}
/** Projects a local OpenClaw workspace cwd into the remote Codex app-server workspace root. */
function mapCodexAppServerRemoteWorkspacePath(params) {
  if (!params.remoteWorkspaceRoot) return params.value;
  const localRoot = normalizeRemoteWorkspaceMatchPath(params.localWorkspaceRoot);
  const remoteRoot = normalizeRemoteWorkspaceMatchPath(params.remoteWorkspaceRoot);
  const normalizedValue = normalizeRemoteWorkspaceMatchPath(params.value);
  if (!localRoot || !remoteRoot)
    throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
  if (normalizedValue === localRoot) return remoteRoot;
  const prefix = `${localRoot}/`;
  if (!normalizedValue.startsWith(prefix))
    throw new Error(
      `Codex remoteWorkspaceRoot is configured but cwd ${params.value} is outside OpenClaw workspace root ${params.localWorkspaceRoot}; refusing to send a gateway-local cwd to the remote Codex app-server.`,
    );
  return joinRemoteWorkspacePath(remoteRoot, normalizedValue.slice(prefix.length));
}
function normalizeRemoteWorkspaceMatchPath(value) {
  return trimTrailingPathSeparator(value.replace(/\\/gu, "/"));
}
function trimTrailingPathSeparator(value) {
  return value.length > 1 ? value.replace(/[\\/]+$/u, "") : value;
}
function joinRemoteWorkspacePath(remoteRoot, suffix) {
  return remoteRoot === "/" ? `/${suffix}` : `${remoteRoot}/${suffix}`;
}
/** Converts OpenClaw sandbox networking into Codex's external-sandbox policy shape. */
function resolveCodexExternalSandboxPolicyForOpenClawSandbox(sandbox) {
  return {
    type: "externalSandbox",
    networkAccess: codexNetworkAccessForOpenClawSandbox(sandbox) ? "enabled" : "restricted",
  };
}
function codexNetworkAccessForOpenClawSandbox(sandbox) {
  if (sandbox?.backendId !== "docker") return true;
  const network = sandbox?.docker?.network?.trim().toLowerCase();
  return Boolean(network && network !== "none");
}
/** Returns a Codex config copy with all app exposure disabled for restricted thread tools. */
function disableCodexPluginThreadConfig(pluginConfig) {
  const config = readCodexPluginConfig(pluginConfig);
  return {
    ...config,
    codexPlugins: {
      ...config.codexPlugins,
      enabled: false,
    },
  };
}
/** Adds sandbox_exec/process aliases when native Code Mode cannot directly honor the sandbox. */
function addSandboxShellDynamicToolsIfAvailable(filteredTools, allTools, input) {
  if (
    !shouldExposeSandboxExecDynamicTool(input) ||
    isSandboxShellDynamicToolExcluded(input.pluginConfig)
  )
    return filteredTools;
  const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
  const processTool = allTools.find(
    (tool) => normalizeCodexDynamicToolName(tool.name) === "process",
  );
  if (!execTool || !processTool) return filteredTools;
  const sandboxExecTool = {
    ...execTool,
    name: "sandbox_exec",
    description:
      "Run a shell command through OpenClaw's configured sandbox backend for this session. Use when OpenClaw sandboxing is active or when a command must execute in the sandbox backend, such as an SSH-backed sandbox or Docker container-path bind layout. Use Codex's native shell only when no OpenClaw sandbox is active and native Code Mode is available.",
    execute: async (toolCallId, args, signal, onUpdate) => {
      const result = await execTool.execute(toolCallId, args, signal, onUpdate);
      return {
        ...result,
        content: result.content.map((item) =>
          item.type === "text"
            ? Object.assign({}, item, {
                text: item.text.replace(
                  "Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.",
                  "Use sandbox_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.",
                ),
              })
            : item,
        ),
      };
    },
  };
  const sandboxProcessTool = {
    ...processTool,
    name: "sandbox_process",
    description:
      "Manage sandbox_exec sessions that were started through OpenClaw's configured sandbox backend for this session: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for sandbox_exec follow-up; use Codex's native shell session handling only when no OpenClaw sandbox is active and native Code Mode is available.",
  };
  return [...filteredTools, sandboxExecTool, sandboxProcessTool];
}
function shouldExposeSandboxExecDynamicTool(input) {
  if (isCodexMemoryFlushRun(input.params)) return false;
  if (
    isCodexNativeExecutionBlockedByNodeExecHost(input.params, {
      agentId: input.sessionAgentId,
      runtimeSessionKey: input.sandboxSessionKey,
      sandbox: input.sandbox,
    })
  )
    return false;
  const backendId = input.sandbox?.enabled ? input.sandbox.backendId.trim().toLowerCase() : "";
  return Boolean(backendId && input.nativeToolSurfaceEnabled === false);
}
function isCodexDynamicToolExcluded(config, names) {
  const normalizedNames = new Set(names.map((name) => normalizeCodexDynamicToolName(name)));
  return (config.codexDynamicToolsExclude ?? []).some((name) => {
    const normalized = normalizeCodexDynamicToolName(name);
    return normalizedNames.has(normalized);
  });
}
function isSandboxShellDynamicToolExcluded(config) {
  return isCodexDynamicToolExcluded(config, ["exec", "sandbox_exec", "process", "sandbox_process"]);
}
function addNodeShellDynamicToolsIfNeeded(filteredTools, allTools, input, nodePolicy) {
  if (isCodexMemoryFlushRun(input.params)) return filteredTools;
  const nodeExecIsDefault = nodePolicy.effectiveExecHost === "node";
  const nodeExecAvailableFromAuto =
    nodePolicy.requestedExecHost === "auto" && nodePolicy.effectiveExecHost === "gateway";
  if (!nodeExecIsDefault && !nodeExecAvailableFromAuto) return filteredTools;
  const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
  const processTool = allTools.find(
    (tool) => normalizeCodexDynamicToolName(tool.name) === "process",
  );
  if (!execTool || !processTool) return filteredTools;
  const toolsToAppend = [];
  if (
    !isCodexDynamicToolExcluded(input.pluginConfig, ["exec", CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME]) &&
    !filteredTools.some(
      (tool) => normalizeCodexDynamicToolName(tool.name) === CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME,
    )
  )
    toolsToAppend.push(createNodeExecDynamicTool(execTool, nodePolicy.node));
  if (
    !isCodexDynamicToolExcluded(input.pluginConfig, [
      "process",
      CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME,
    ]) &&
    !filteredTools.some(
      (tool) => normalizeCodexDynamicToolName(tool.name) === CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME,
    )
  )
    toolsToAppend.push(createNodeProcessDynamicTool(processTool));
  return toolsToAppend.length > 0 ? [...filteredTools, ...toolsToAppend] : filteredTools;
}
function createNodeExecDynamicTool(execTool, configuredNode) {
  const pinnedNode = configuredNode?.trim();
  return {
    ...execTool,
    name: CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME,
    description: pinnedNode
      ? "Run a shell command on the OpenClaw configured remote node for this session. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Use node_process for follow-up on backgrounded node_exec sessions. Use Codex's native shell for local app-server work."
      : "Run a shell command on an OpenClaw remote node. Select the node by name or id when multiple nodes are available. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Use node_process for follow-up on backgrounded node_exec sessions. Use Codex's native shell for local app-server work.",
    parameters: hideNodeExecDynamicToolParameters(execTool.parameters, {
      hideNode: Boolean(pinnedNode),
    }),
    execute: async (toolCallId, args, signal, onUpdate) => {
      const result = await execTool.execute(
        toolCallId,
        pinNodeExecDynamicToolArgs(args, pinnedNode),
        signal,
        onUpdate,
      );
      return {
        ...result,
        content: result.content.map((item) =>
          item.type === "text"
            ? Object.assign({}, item, {
                text: item.text.replace(
                  "Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.",
                  "Use node_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.",
                ),
              })
            : item,
        ),
      };
    },
  };
}
function createNodeProcessDynamicTool(processTool) {
  return {
    ...processTool,
    name: CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME,
    description:
      "Manage node_exec sessions that were started on OpenClaw remote nodes: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for node_exec follow-up; use Codex's native shell session handling for local app-server work.",
  };
}
function pinNodeExecDynamicToolArgs(args, configuredNode) {
  const {
    host: _host,
    security: _security,
    ask: _ask,
    node: requestedNode,
    ...rest
  } = args && typeof args === "object" && !Array.isArray(args) ? args : {};
  const node = configuredNode ?? (typeof requestedNode === "string" ? requestedNode.trim() : "");
  return {
    ...rest,
    host: "node",
    ...(node ? { node } : {}),
  };
}
function hideNodeExecDynamicToolParameters(parameters, options) {
  if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) return parameters;
  const schema = parameters;
  const rawProperties = schema.properties;
  if (!rawProperties || typeof rawProperties !== "object" || Array.isArray(rawProperties))
    return parameters;
  const nextProperties = Object.fromEntries(
    Object.entries(rawProperties).filter(
      ([name]) =>
        !CODEX_NODE_EXEC_POLICY_PARAMETER_NAMES.has(normalizeCodexDynamicToolName(name)) &&
        !(options.hideNode && normalizeCodexDynamicToolName(name) === "node"),
    ),
  );
  const rawRequired = schema.required;
  const nextRequired = Array.isArray(rawRequired)
    ? rawRequired.filter(
        (name) =>
          typeof name !== "string" ||
          (!CODEX_NODE_EXEC_POLICY_PARAMETER_NAMES.has(normalizeCodexDynamicToolName(name)) &&
            !(options.hideNode && normalizeCodexDynamicToolName(name) === "node")),
      )
    : rawRequired;
  return {
    ...schema,
    properties: nextProperties,
    ...(Array.isArray(rawRequired) ? { required: nextRequired } : {}),
  };
}
function resolveCodexNativeExecutionPolicyForDynamicTools(input) {
  return resolveCodexNativeExecutionPolicy({
    config: input.params.config,
    sessionKey: resolveCodexRuntimePolicySessionKey(input.params, input.sandboxSessionKey),
    sessionId: input.params.sessionId,
    agentId: input.sessionAgentId,
    execOverrides: input.params.execOverrides,
    sandboxAvailable: input.sandbox?.enabled,
    readRuntimeSessionEntry: true,
  });
}
/** Applies a normalized tool allowlist while preserving shell aliases for exec/process. */
function filterCodexDynamicToolsForAllowlist(tools, toolsAllow) {
  if (!toolsAllow) return tools;
  if (toolsAllow.length === 0) return [];
  if (hasWildcardCodexToolsAllow(toolsAllow)) return tools;
  const allowSet = new Set(
    toolsAllow.map((name) => normalizeCodexDynamicToolName(name)).filter(Boolean),
  );
  return tools.filter((tool) => {
    const normalized = normalizeCodexDynamicToolName(tool.name);
    return (
      allowSet.has(normalized) ||
      (normalized === "sandbox_exec" && allowSet.has("exec")) ||
      (normalized === "sandbox_process" && (allowSet.has("exec") || allowSet.has("process"))) ||
      (normalized === CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME && allowSet.has("exec")) ||
      (normalized === CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME &&
        (allowSet.has("exec") || allowSet.has("process")))
    );
  });
}
/** Detects the wildcard allowlist marker after Codex tool-name normalization. */
function hasWildcardCodexToolsAllow(toolsAllow) {
  return toolsAllow.some((name) => normalizeCodexDynamicToolName(name) === "*");
}
/** Forces message delivery through the message tool when the source channel requires it. */
function shouldForceMessageTool(params) {
  return (
    params.disableMessageTool !== true && params.sourceReplyDeliveryMode === "message_tool_only"
  );
}
//#endregion
//#region extensions/codex/src/app-server/attempt-timeouts.ts
/**
 * Timeout defaults and normalizers for Codex app-server startup and turn
 * liveness watches.
 */
/** Minimum startup timeout accepted by the Codex app-server harness. */
const CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS = 100;
/** Default idle timeout while waiting for app-server turn completion. */
const CODEX_TURN_COMPLETION_IDLE_TIMEOUT_MS = 6e4;
/** Short guard after apparent assistant completion. */
const CODEX_TURN_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS = 1e4;
const CODEX_POST_TOOL_RAW_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS = 5 * 6e4;
/** Guard after reasoning/commentary progress when no tool handoff occurred. */
const CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS = 5 * 6e4;
/** Long terminal idle watch for app-server turns that never send completion. */
const CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS = 30 * 6e4;
function resolvePositiveIntegerTimeoutMs(value, fallbackMs) {
  return resolveTimerTimeoutMs(value, resolveTimerTimeoutMs(fallbackMs, 1));
}
/** Runs startup work with abort and timeout handling plus optional cleanup. */
async function withCodexStartupTimeout(params) {
  if (params.signal.aborted) throw new Error("codex app-server startup aborted");
  let timeout;
  let abortCleanup;
  let timeoutError;
  let timeoutCleanup;
  try {
    return await Promise.race([
      params.operation(),
      new Promise((_, reject) => {
        const rejectOnce = (error) => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = void 0;
          }
          reject(error);
        };
        timeout = setTimeout(() => {
          timeoutError = /* @__PURE__ */ new Error("codex app-server startup timed out");
          timeoutCleanup = Promise.resolve(params.onTimeout?.()).then(
            () => void 0,
            () => void 0,
          );
          timeoutCleanup.finally(() => {
            rejectOnce(timeoutError);
          });
        }, params.timeoutMs);
        const abortListener = () =>
          rejectOnce(/* @__PURE__ */ new Error("codex app-server startup aborted"));
        params.signal.addEventListener("abort", abortListener, { once: true });
        abortCleanup = () => params.signal.removeEventListener("abort", abortListener);
      }),
    ]);
  } catch (error) {
    if (timeoutError) {
      await timeoutCleanup;
      throw timeoutError;
    }
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
    abortCleanup?.();
  }
}
/** Resolves startup timeout while honoring the configured floor. */
function resolveCodexStartupTimeoutMs(params) {
  const timeoutFloorMs = resolvePositiveIntegerTimeoutMs(
    params.timeoutFloorMs,
    CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS,
  );
  const timeoutMs = resolvePositiveIntegerTimeoutMs(params.timeoutMs, timeoutFloorMs);
  return Math.max(timeoutFloorMs, timeoutMs);
}
/** Resolves the completion-idle timeout for an active turn. */
function resolveCodexTurnCompletionIdleTimeoutMs(value) {
  return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_COMPLETION_IDLE_TIMEOUT_MS);
}
/** Resolves the short assistant-completion release timeout. */
function resolveCodexTurnAssistantCompletionIdleTimeoutMs(value) {
  return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS);
}
/** Resolves the conservative post-tool raw assistant guard timeout. */
function resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs(value, fallbackMs) {
  return resolvePositiveIntegerTimeoutMs(
    value,
    Math.max(
      resolvePositiveIntegerTimeoutMs(void 0, fallbackMs),
      CODEX_POST_TOOL_RAW_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS,
    ),
  );
}
/** Resolves the long terminal turn idle timeout. */
function resolveCodexTurnTerminalIdleTimeoutMs(value, runTimeoutOverrideMs) {
  const explicitRunBudgetMs = resolvePositiveIntegerTimeoutMs(
    runTimeoutOverrideMs,
    CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS,
  );
  return resolvePositiveIntegerTimeoutMs(
    value,
    Math.max(CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS, explicitRunBudgetMs),
  );
}
/** Adds gateway grace time to a caller timeout without overflowing invalid values. */
function resolveCodexGatewayTimeoutWithGraceMs(timeoutMs, graceMs = 1e4) {
  const timeout = resolvePositiveIntegerTimeoutMs(timeoutMs, 1);
  return addTimerTimeoutGraceMs(timeout, resolveTimerTimeoutMs(graceMs, 0, 0)) ?? timeout;
}
//#endregion
//#region extensions/codex/src/app-server/provider-capabilities.ts
async function readConfiguredProviderWebSearchSupport(params) {
  return (
    await params.client.request(
      "modelProvider/capabilities/read",
      {},
      {
        timeoutMs: params.timeoutMs,
        signal: params.signal,
      },
    )
  ).webSearch
    ? "supported"
    : "unsupported";
}
async function resolveCodexProviderWebSearchSupportForClient(params) {
  const modelProviderOverride = params.modelProviderOverride?.trim().toLowerCase();
  if (modelProviderOverride === "openai") return "supported";
  if (modelProviderOverride) return "unsupported";
  try {
    return await readConfiguredProviderWebSearchSupport(params);
  } catch {
    return "unknown";
  }
}
async function resolveCodexProviderWebSearchSupport(params) {
  let client;
  try {
    client = await params.clientFactory({
      startOptions: params.appServer.start,
      ...(params.preparedAuth
        ? { preparedAuth: params.preparedAuth }
        : { authProfileId: params.authProfileId }),
      agentDir: params.agentDir,
      config: params.config,
      timeoutMs: params.appServer.requestTimeoutMs,
    });
    return await resolveCodexProviderWebSearchSupportForClient({
      client,
      timeoutMs: params.appServer.requestTimeoutMs,
      modelProviderOverride: params.modelProviderOverride,
      signal: params.signal,
    });
  } catch {
    return "unknown";
  } finally {
    if (client) releaseLeasedSharedCodexAppServerClient(client);
  }
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-diagnostics.ts
/**
 * Trusted diagnostics emitted around Codex dynamic tool execution lifecycle.
 */
/** Emits a start event for one Codex dynamic tool call. */
function emitDynamicToolStartedDiagnostic(params) {
  emitTrustedDiagnosticEvent({
    type: "tool.execution.started",
    agentId: params.agentId,
    runId: params.runId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    toolName: params.call.tool,
    toolCallId: params.call.callId,
  });
}
/** Emits an error event for one Codex dynamic tool call. */
function emitDynamicToolErrorDiagnostic(params) {
  emitTrustedDiagnosticEvent({
    type: "tool.execution.error",
    agentId: params.agentId,
    runId: params.runId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    toolName: params.call.tool,
    toolCallId: params.call.callId,
    durationMs: params.durationMs,
    errorCategory: "codex_dynamic_tool_error",
    terminalReason: params.terminalReason ?? "failed",
  });
}
/** Emits the terminal event matching a dynamic tool response's diagnostic type. */
function emitDynamicToolTerminalDiagnostic(params) {
  const terminalType =
    params.response.diagnosticTerminalType ?? (params.response.success ? "completed" : "error");
  if (terminalType === "completed") {
    emitTrustedDiagnosticEvent({
      type: "tool.execution.completed",
      agentId: params.agentId,
      runId: params.runId,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      toolName: params.call.tool,
      toolCallId: params.call.callId,
      durationMs: params.durationMs,
    });
    return;
  }
  if (terminalType === "blocked") {
    emitTrustedDiagnosticEvent({
      type: "tool.execution.blocked",
      agentId: params.agentId,
      runId: params.runId,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      toolName: params.call.tool,
      toolCallId: params.call.callId,
      deniedReason: "plugin-before-tool-call",
      reason: "Tool call blocked",
    });
    return;
  }
  emitDynamicToolErrorDiagnostic({
    ...params,
    terminalReason: params.response.diagnosticTerminalReason ?? "failed",
  });
}
//#endregion
//#region extensions/codex/src/app-server/plugin-approval-roundtrip.ts
/**
 * Routes Codex app-server plugin approval prompts through OpenClaw's gateway
 * approval tool and maps gateway decisions back to Codex outcomes.
 */
const DEFAULT_CODEX_APPROVAL_TIMEOUT_MS = 12e4;
const MAX_PLUGIN_APPROVAL_TITLE_LENGTH = 80;
const MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH = 256;
/** Starts a two-phase plugin approval request through the OpenClaw gateway. */
async function requestPluginApproval(params) {
  const timeoutMs = DEFAULT_CODEX_APPROVAL_TIMEOUT_MS;
  return callGatewayTool(
    "plugin.approval.request",
    { timeoutMs: resolveCodexGatewayTimeoutWithGraceMs(timeoutMs) },
    {
      pluginId: "openclaw-codex-app-server",
      title: truncateForGateway(params.title, MAX_PLUGIN_APPROVAL_TITLE_LENGTH),
      description: truncateForGateway(params.description, MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH),
      severity: params.severity,
      toolName: params.toolName,
      toolCallId: params.toolCallId,
      agentId: params.paramsForRun.agentId,
      sessionKey: params.paramsForRun.sessionKey,
      turnSourceChannel: params.paramsForRun.messageChannel ?? params.paramsForRun.messageProvider,
      turnSourceTo: params.paramsForRun.currentChannelId,
      turnSourceAccountId: params.paramsForRun.agentAccountId,
      turnSourceThreadId: params.paramsForRun.currentThreadTs,
      timeoutMs,
      twoPhase: true,
      ...(params.allowedDecisions ? { allowedDecisions: params.allowedDecisions } : {}),
    },
    { expectFinal: false },
  );
}
/** Detects the gateway's explicit null-decision marker for unavailable approvals. */
function approvalRequestExplicitlyUnavailable(result) {
  if (result === null || result === void 0 || typeof result !== "object") return false;
  let descriptor;
  try {
    descriptor = Object.getOwnPropertyDescriptor(result, "decision");
  } catch {
    return false;
  }
  return descriptor !== void 0 && "value" in descriptor && descriptor.value === null;
}
/** Waits for the gateway's final approval decision, respecting turn aborts. */
async function waitForPluginApprovalDecision(params) {
  const waitPromise = callGatewayTool(
    "plugin.approval.waitDecision",
    { timeoutMs: resolveCodexGatewayTimeoutWithGraceMs(DEFAULT_CODEX_APPROVAL_TIMEOUT_MS) },
    { id: params.approvalId },
  );
  const bindDecision = (result) => (result?.id === params.approvalId ? result.decision : void 0);
  if (!params.signal) return bindDecision(await waitPromise);
  let onAbort;
  const abortPromise = new Promise((_, reject) => {
    if (params.signal.aborted) {
      reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
      return;
    }
    onAbort = () => reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
    params.signal.addEventListener("abort", onAbort, { once: true });
  });
  try {
    return bindDecision(await Promise.race([waitPromise, abortPromise]));
  } finally {
    if (onAbort) params.signal.removeEventListener("abort", onAbort);
  }
}
/** Converts a gateway exec approval decision into the app-server approval outcome enum. */
function mapExecDecisionToOutcome(decision) {
  if (decision === "allow-once") return "approved-once";
  if (decision === "allow-always") return "approved-session";
  if (decision === null || decision === void 0) return "unavailable";
  return "denied";
}
function truncateForGateway(value, maxLength) {
  return value.length <= maxLength ? value : `${truncateUtf16Safe(value, maxLength - 3)}...`;
}
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
//#region extensions/codex/src/app-server/elicitation-bridge.ts
const MCP_TOOL_APPROVAL_KIND = "mcp_tool_call";
const MCP_TOOL_APPROVAL_KIND_KEY = "codex_approval_kind";
const MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY = "connector_name";
const MCP_TOOL_APPROVAL_TOOL_TITLE_KEY = "tool_title";
const MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY = "tool_description";
const MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY = "tool_params_display";
const MCP_TOOL_APPROVAL_SOURCE_KEY = "source";
const MCP_TOOL_APPROVAL_CONNECTOR_SOURCE = "connector";
const CODEX_APPS_SERVER_NAME = "codex_apps";
const COMPUTER_USE_APPROVAL_TITLE = "Computer Use approval";
const EMPTY_OBJECT_SCHEMA = {
  type: "object",
  properties: {},
};
const PLUGIN_APP_ID_META_KEYS = ["app_id", "appId", "codex_app_id", "codexAppId"];
const PLUGIN_CONNECTOR_ID_META_KEYS = ["connector_id", "connectorId"];
const PLUGIN_NAME_META_KEYS = ["plugin_name", "pluginName", "codex_plugin_name", "codexPluginName"];
const PLUGIN_CONFIG_KEY_META_KEYS = ["config_key", "configKey", "codex_config_key"];
const PLUGIN_MARKETPLACE_NAME_META_KEYS = [
  "marketplace_name",
  "marketplaceName",
  "codex_marketplace_name",
  "codexMarketplaceName",
];
const MAX_DISPLAY_PARAM_ENTRIES = 8;
const MAX_DISPLAY_PARAM_VALUE_LENGTH = 120;
const MAX_DISPLAY_VALUE_ARRAY_ITEMS = 8;
const MAX_DISPLAY_VALUE_OBJECT_KEYS = 8;
const MAX_DISPLAY_VALUE_DEPTH = 3;
const DISPLAY_TEXT_SCAN_MAX_LENGTH = 4096;
const ANSI_OSC_SEQUENCE_RE$1 = new RegExp(
  String.raw`(?:\u001b]|\u009d)[^\u001b\u009c\u0007]*(?:\u0007|\u001b\\|\u009c)`,
  "g",
);
const ANSI_CONTROL_SEQUENCE_RE$1 = new RegExp(
  String.raw`(?:\u001b\[[0-?]*[ -/]*[@-~]|\u009b[0-?]*[ -/]*[@-~]|\u001b[@-Z\\-_])`,
  "g",
);
const CONTROL_CHARACTER_RE$1 = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]+`, "g");
const INVISIBLE_FORMATTING_CONTROL_RE$1 = new RegExp(
  String.raw`[\u00ad\u034f\u061c\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufe00-\ufe0f\u{e0100}-\u{e01ef}]`,
  "gu",
);
const DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE$1 = new RegExp(
  String.raw`(?:\u001b\][^\u001b\u009c\u0007]*|\u009d[^\u001b\u009c\u0007]*|\u001b\[[0-?]*[ -/]*|\u009b[0-?]*[ -/]*|\u001b)$`,
);
async function handleCodexAppServerElicitationRequest(params) {
  const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
  if (!requestParams) return;
  if (!matchesCurrentThread(requestParams, params.threadId)) return;
  if (turnIdMismatches(requestParams, params.turnId)) return;
  const pluginResolution = resolvePluginElicitation({
    requestParams,
    pluginAppPolicyContext: params.pluginAppPolicyContext,
  });
  if (pluginResolution.kind !== "not_plugin") {
    if (pluginResolution.kind === "decline") {
      logPluginElicitationDecline(pluginResolution.reason, requestParams);
      return declineElicitationResponse();
    }
    if (!hasExactTurnId(requestParams, params.turnId)) {
      logPluginElicitationDecline("missing_active_turn", requestParams);
      return declineElicitationResponse();
    }
    return await buildPluginPolicyElicitationResponse({
      entry: pluginResolution.entry,
      requestParams,
      paramsForRun: params.paramsForRun,
      signal: params.signal,
    });
  }
  const approvalPrompt =
    readComputerUseApprovalElicitation(requestParams, params.computerUseMcpServerName) ??
    readBridgeableApprovalElicitation(requestParams);
  if (!approvalPrompt) return;
  return buildElicitationResponse(
    approvalPrompt,
    await requestPluginApprovalOutcome({
      paramsForRun: params.paramsForRun,
      title: approvalPrompt.title,
      description: approvalPrompt.description,
      allowedDecisions: approvalPrompt.allowedDecisions,
      signal: params.signal,
    }),
  );
}
function matchesCurrentThread(requestParams, threadId) {
  if (!requestParams) return false;
  return readString$1(requestParams, "threadId") === threadId;
}
function turnIdMismatches(requestParams, turnId) {
  const rawTurnId = requestParams?.turnId;
  return rawTurnId !== null && rawTurnId !== void 0 && rawTurnId !== turnId;
}
function hasExactTurnId(requestParams, turnId) {
  return requestParams?.turnId === turnId;
}
function resolvePluginElicitation(params) {
  const requestParams = params.requestParams;
  if (!requestParams) return { kind: "not_plugin" };
  const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
  const context = params.pluginAppPolicyContext;
  const entries = context ? Object.values(context.apps) : [];
  const pluginEntries = entries.filter(isPluginAppPolicyContextEntry);
  const appId =
    readFirstString$1(meta, PLUGIN_APP_ID_META_KEYS) ??
    readFirstString$1(requestParams, PLUGIN_APP_ID_META_KEYS);
  const connectorId = readFirstString$1(meta, PLUGIN_CONNECTOR_ID_META_KEYS);
  const isCodexConnectorApproval = isCodexConnectorApprovalElicitation(requestParams, meta);
  if (isCodexConnectorApproval && appId && connectorId && appId !== connectorId)
    return {
      kind: "decline",
      reason: "app_id_connector_id_mismatch",
    };
  if (appId) {
    if (!context)
      return {
        kind: "decline",
        reason: "missing_policy_context",
      };
    const entry = context.apps[appId];
    if (entry?.source === "account" && !isCodexConnectorApproval)
      return {
        kind: "decline",
        reason: "account_app_source_mismatch",
      };
    return uniquePluginMatch(entry ? [entry] : [], "app_id");
  }
  if (isCodexConnectorApproval && connectorId) {
    if (!context)
      return {
        kind: "decline",
        reason: "missing_policy_context",
      };
    const entry = context.apps[connectorId];
    return uniquePluginMatch(entry ? [entry] : [], "connector_id");
  }
  const serverName = readString$1(requestParams, "serverName");
  if (serverName && context) {
    const matches = entries.filter((entry) => entry.mcpServerNames.includes(serverName));
    if (matches.length > 0) return uniquePluginMatch(matches, "server_name");
  }
  const metadataResolution = resolvePluginStableMetadataMatch({
    meta,
    requestParams,
    entries: pluginEntries,
    context,
  });
  if (metadataResolution.kind !== "not_plugin") return metadataResolution;
  if (context && hasDisplayNameOnlyPluginMatch(meta, entries))
    return {
      kind: "decline",
      reason: "display_name_only",
    };
  return { kind: "not_plugin" };
}
function isCodexConnectorApprovalElicitation(requestParams, meta) {
  return (
    readString$1(requestParams, "serverName") === CODEX_APPS_SERVER_NAME &&
    readString$1(meta, MCP_TOOL_APPROVAL_KIND_KEY) === MCP_TOOL_APPROVAL_KIND &&
    readString$1(meta, MCP_TOOL_APPROVAL_SOURCE_KEY) === MCP_TOOL_APPROVAL_CONNECTOR_SOURCE
  );
}
function resolvePluginStableMetadataMatch(params) {
  const pluginName =
    readFirstString$1(params.meta, PLUGIN_NAME_META_KEYS) ??
    readFirstString$1(params.requestParams, PLUGIN_NAME_META_KEYS);
  const configKey =
    readFirstString$1(params.meta, PLUGIN_CONFIG_KEY_META_KEYS) ??
    readFirstString$1(params.requestParams, PLUGIN_CONFIG_KEY_META_KEYS);
  const marketplaceName =
    readFirstString$1(params.meta, PLUGIN_MARKETPLACE_NAME_META_KEYS) ??
    readFirstString$1(params.requestParams, PLUGIN_MARKETPLACE_NAME_META_KEYS);
  if (!pluginName && !configKey) return { kind: "not_plugin" };
  if (!params.context)
    return {
      kind: "decline",
      reason: "missing_policy_context",
    };
  return uniquePluginMatch(
    params.entries.filter((entry) => {
      if (marketplaceName && entry.marketplaceName !== marketplaceName) return false;
      if (pluginName && entry.pluginName !== pluginName) return false;
      if (configKey && entry.configKey !== configKey) return false;
      return true;
    }),
    "metadata",
  );
}
function uniquePluginMatch(matches, source) {
  if (matches.length === 1 && matches[0])
    return {
      kind: "matched",
      entry: matches[0],
    };
  return {
    kind: "decline",
    reason: matches.length === 0 ? `${source}_not_enabled` : `${source}_ambiguous`,
  };
}
function hasDisplayNameOnlyPluginMatch(meta, entries) {
  const connectorName = readString$1(meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY);
  if (!connectorName) return false;
  const normalized = normalizePluginIdentityText(connectorName);
  return entries.some(
    (entry) =>
      normalizePluginIdentityText(appPolicyDisplayName(entry)) === normalized ||
      (isPluginAppPolicyContextEntry(entry) &&
        normalizePluginIdentityText(entry.configKey) === normalized),
  );
}
function isPluginAppPolicyContextEntry(entry) {
  return entry.source !== "account";
}
function appPolicyDisplayName(entry) {
  return isPluginAppPolicyContextEntry(entry) ? entry.pluginName : entry.appName;
}
function normalizePluginIdentityText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
async function buildPluginPolicyElicitationResponse(params) {
  const mode = resolvePluginDestructiveApprovalMode(params.entry);
  if (mode === "deny") {
    logPluginElicitationDecline("destructive_actions_disabled", params.requestParams);
    return declineElicitationResponse();
  }
  const approvalPrompt = readPluginApprovalElicitation(params.entry, params.requestParams);
  if (!approvalPrompt) {
    logPluginElicitationDecline("unsupported_schema", params.requestParams);
    return declineElicitationResponse();
  }
  const response = buildElicitationResponse(approvalPrompt, "approved-once");
  if (isJsonObject(response) && response.action === "accept") {
    if (mode === "allow") return response;
    return buildElicitationResponse(
      approvalPrompt,
      oneShotPluginPolicyApprovalOutcome(
        mode,
        await requestPluginApprovalOutcome({
          paramsForRun: params.paramsForRun,
          title: approvalPrompt.title,
          description: approvalPrompt.description,
          allowedDecisions: allowedPluginPolicyApprovalDecisions(mode, approvalPrompt),
          signal: params.signal,
        }),
      ),
    );
  }
  logPluginElicitationDecline("unmappable_schema", params.requestParams);
  return declineElicitationResponse();
}
function resolvePluginDestructiveApprovalMode(entry) {
  return entry.destructiveApprovalMode ?? (entry.allowDestructiveActions ? "allow" : "deny");
}
function allowedPluginPolicyApprovalDecisions(mode, approvalPrompt) {
  const allowedDecisions = approvalPrompt.allowedDecisions ?? ["allow-once", "deny"];
  if (mode !== "ask") return allowedDecisions;
  return allowedDecisions.filter((decision) => decision !== "allow-always");
}
function oneShotPluginPolicyApprovalOutcome(mode, outcome) {
  return mode === "ask" && outcome === "approved-session" ? "approved-once" : outcome;
}
function readPluginApprovalElicitation(entry, requestParams) {
  if (
    readString$1(requestParams, "mode") !== "form" ||
    !isJsonObject(requestParams.requestedSchema)
  )
    return;
  const requestedSchema = requestParams.requestedSchema;
  if (
    readString$1(requestedSchema, "type") !== "object" ||
    !isJsonObject(requestedSchema.properties)
  )
    return;
  const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
  const title =
    sanitizeDisplayText(readString$1(requestParams, "message") ?? "") || "Codex plugin approval";
  const descriptionMeta = { ...meta };
  if (!readString$1(descriptionMeta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY))
    descriptionMeta[MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY] = appPolicyDisplayName(entry);
  return {
    title,
    description: buildApprovalDescription({
      title,
      meta: descriptionMeta,
      requestedSchema,
      serverName: sanitizeOptionalDisplayText(readString$1(requestParams, "serverName")),
    }),
    requestedSchema,
    meta,
    persistHintsMode: "explicit",
    allowedDecisions: buildApprovalAllowedDecisions(requestedSchema, meta),
  };
}
function buildApprovalAllowedDecisions(requestedSchema, meta) {
  return canMapPersistentApproval(requestedSchema, meta)
    ? ["allow-once", "allow-always", "deny"]
    : ["allow-once", "deny"];
}
function canMapPersistentApproval(requestedSchema, meta) {
  const persistHints = readPersistHints(meta, "explicit");
  if (persistHints.length > 0) return persistHints.includes("always");
  const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
  return Object.entries(properties).some(([name, value]) => {
    const schema = isJsonObject(value) ? value : void 0;
    if (!schema) return false;
    return (
      isPersistField({
        name,
        schema,
        required: false,
      }) && chooseAlwaysPersistOptionValue(readEnumOptions(schema)) !== void 0
    );
  });
}
function declineElicitationResponse() {
  return {
    action: "decline",
    content: null,
    _meta: null,
  };
}
function logPluginElicitationDecline(reason, requestParams) {
  log.debug("codex plugin elicitation declined", {
    reason,
    serverName: readString$1(requestParams, "serverName"),
    mode: readString$1(requestParams, "mode"),
  });
}
function readBridgeableApprovalElicitation(requestParams) {
  if (
    !requestParams ||
    readString$1(requestParams, "mode") !== "form" ||
    !isJsonObject(requestParams["_meta"]) ||
    requestParams["_meta"][MCP_TOOL_APPROVAL_KIND_KEY] !== MCP_TOOL_APPROVAL_KIND ||
    !isJsonObject(requestParams.requestedSchema)
  )
    return;
  const requestedSchema = requestParams.requestedSchema;
  if (
    readString$1(requestedSchema, "type") !== "object" ||
    !isJsonObject(requestedSchema.properties)
  )
    return;
  const title =
    sanitizeDisplayText(readString$1(requestParams, "message") ?? "") || "Codex MCP tool approval";
  return {
    title,
    description: buildApprovalDescription({
      title,
      meta: requestParams["_meta"],
      requestedSchema,
      serverName: sanitizeOptionalDisplayText(readString$1(requestParams, "serverName")),
    }),
    requestedSchema,
    meta: requestParams["_meta"],
  };
}
function readComputerUseApprovalElicitation(requestParams, expectedServerName) {
  const serverName = readString$1(requestParams, "serverName");
  if (
    !serverName ||
    !expectedServerName ||
    serverName !== expectedServerName ||
    readString$1(requestParams, "mode") !== "form"
  )
    return;
  const requestedSchema = isJsonObject(requestParams?.requestedSchema)
    ? requestParams.requestedSchema
    : EMPTY_OBJECT_SCHEMA;
  if (
    readString$1(requestedSchema, "type") !== "object" ||
    !isJsonObject(requestedSchema.properties)
  )
    return;
  const meta = isJsonObject(requestParams?.["_meta"]) ? requestParams["_meta"] : {};
  const title =
    sanitizeDisplayText(readString$1(requestParams, "message") ?? "") ||
    COMPUTER_USE_APPROVAL_TITLE;
  return {
    title,
    description: buildApprovalDescription({
      title,
      meta,
      requestedSchema,
      serverName: sanitizeOptionalDisplayText(serverName),
    }),
    requestedSchema,
    meta,
  };
}
function buildApprovalDescription(params) {
  const connectorName = sanitizeOptionalDisplayText(
    readString$1(params.meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY),
  );
  const toolTitle = sanitizeOptionalDisplayText(
    readString$1(params.meta, MCP_TOOL_APPROVAL_TOOL_TITLE_KEY),
  );
  const toolDescription = sanitizeOptionalDisplayText(
    readString$1(params.meta, MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY),
  );
  const summaryLines = [
    connectorName && `App: ${connectorName}`,
    toolTitle && `Tool: ${toolTitle}`,
    params.serverName && `MCP server: ${params.serverName}`,
    toolDescription,
  ].filter((line) => Boolean(line));
  const paramLines = readDisplayParamLines(params.meta);
  const propertyLines = readPropertyDescriptionLines(params.requestedSchema);
  return [
    params.title,
    summaryLines.join("\n"),
    paramLines.length > 0 ? ["Parameters:", ...paramLines].join("\n") : "",
    propertyLines.length > 0 ? ["Fields:", ...propertyLines].join("\n") : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
function readPropertyDescriptionLines(requestedSchema) {
  const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
  return Object.entries(properties)
    .map(([name, value]) => {
      const schema = isJsonObject(value) ? value : void 0;
      if (!schema) return;
      const propTitle =
        sanitizeDisplayText(readString$1(schema, "title") ?? "") ||
        sanitizeDisplayText(name) ||
        "field";
      const description = sanitizeOptionalDisplayText(readString$1(schema, "description"));
      return description ? `- ${propTitle}: ${description}` : `- ${propTitle}`;
    })
    .filter((line) => Boolean(line));
}
function readDisplayParamLines(meta) {
  const displayParams = meta[MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY];
  if (!Array.isArray(displayParams)) return [];
  const lines = displayParams
    .slice(0, MAX_DISPLAY_PARAM_ENTRIES)
    .map((entry) => {
      const param = isJsonObject(entry) ? entry : void 0;
      if (!param) return;
      const name =
        sanitizeOptionalDisplayText(readString$1(param, "display_name")) ??
        sanitizeOptionalDisplayText(readString$1(param, "name"));
      if (!name) return;
      return `- ${name}: ${formatDisplayParamValue(param.value)}`;
    })
    .filter((line) => Boolean(line));
  const remaining = displayParams.length - MAX_DISPLAY_PARAM_ENTRIES;
  return remaining > 0 ? [...lines, `- Additional parameters: ${remaining} more`] : lines;
}
function formatDisplayParamValue(value) {
  return truncateDisplayText(
    sanitizeDisplayText(typeof value === "string" ? value : formatDisplayJsonValue(value ?? null)),
    MAX_DISPLAY_PARAM_VALUE_LENGTH,
  );
}
function formatDisplayJsonValue(value, depth = MAX_DISPLAY_VALUE_DEPTH) {
  if (value === null) return "null";
  if (typeof value === "string")
    return JSON.stringify(truncateDisplayText(sanitizeDisplayText(value), 80));
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (depth <= 0) return "[truncated]";
    const parts = [];
    const limit = Math.min(value.length, MAX_DISPLAY_VALUE_ARRAY_ITEMS);
    for (let i = 0; i < limit; i += 1)
      parts.push(formatDisplayJsonValue(value[i] ?? null, depth - 1));
    if (value.length > MAX_DISPLAY_VALUE_ARRAY_ITEMS) parts.push("...");
    return `[${parts.join(",")}]`;
  }
  if (typeof value === "object") {
    if (depth <= 0) return "{truncated}";
    const parts = [];
    let count = 0;
    let truncated = false;
    for (const key in value) {
      if (!Object.hasOwn(value, key)) continue;
      if (count >= MAX_DISPLAY_VALUE_OBJECT_KEYS) {
        truncated = true;
        break;
      }
      const safeKey = truncateDisplayText(sanitizeDisplayText(key), 80);
      parts.push(
        `${JSON.stringify(safeKey)}:${formatDisplayJsonValue(value[key] ?? null, depth - 1)}`,
      );
      count += 1;
    }
    if (truncated) parts.push("...");
    return `{${parts.join(",")}}`;
  }
  return "null";
}
function sanitizeOptionalDisplayText(value) {
  return (value === void 0 ? "" : sanitizeDisplayText(value)) || void 0;
}
function sanitizeDisplayText(value) {
  const scanned = sliceUtf16Safe(value, 0, DISPLAY_TEXT_SCAN_MAX_LENGTH);
  const clipped = value.length > DISPLAY_TEXT_SCAN_MAX_LENGTH;
  const sanitized = scanned
    .replace(ANSI_OSC_SEQUENCE_RE$1, "")
    .replace(ANSI_CONTROL_SEQUENCE_RE$1, "")
    .replace(DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE$1, "")
    .replace(INVISIBLE_FORMATTING_CONTROL_RE$1, " ")
    .replace(CONTROL_CHARACTER_RE$1, " ")
    .replace(/\s+/g, " ")
    .trim();
  const escaped = sanitized ? formatCodexDisplayText(sanitized) : "";
  return clipped && escaped ? `${escaped}...` : escaped;
}
function truncateDisplayText(value, maxLength) {
  return value.length <= maxLength ? value : `${truncateUtf16Safe(value, maxLength - 3)}...`;
}
async function requestPluginApprovalOutcome(params) {
  try {
    const requestResult = await requestPluginApproval({
      paramsForRun: params.paramsForRun,
      title: params.title,
      description: params.description,
      severity: "warning",
      toolName: "codex_mcp_tool_approval",
      allowedDecisions: params.allowedDecisions,
    });
    const approvalId = requestResult?.id;
    if (!approvalId) return "unavailable";
    return mapExecDecisionToOutcome(
      approvalRequestExplicitlyUnavailable(requestResult)
        ? null
        : await waitForPluginApprovalDecision({
            approvalId,
            signal: params.signal,
          }),
    );
  } catch {
    return params.signal?.aborted ? "cancelled" : "denied";
  }
}
function buildElicitationResponse(approvalPrompt, outcome) {
  const { requestedSchema, meta } = approvalPrompt;
  if (outcome === "cancelled")
    return {
      action: "cancel",
      content: null,
      _meta: null,
    };
  if (outcome === "denied" || outcome === "unavailable")
    return {
      action: "decline",
      content: null,
      _meta: null,
    };
  const content = buildAcceptedContent(approvalPrompt, outcome);
  if (!content) {
    if (hasNoSchemaProperties(requestedSchema))
      return {
        action: "accept",
        content: null,
        _meta: buildAcceptedMeta(meta, outcome, approvalPrompt.persistHintsMode ?? "legacy"),
      };
    log.warn("codex MCP approval elicitation approved without a mappable response", {
      approvalKind: meta[MCP_TOOL_APPROVAL_KIND_KEY],
      fields: Object.keys(requestedSchema.properties ?? {}),
      outcome,
    });
    return {
      action: "decline",
      content: null,
      _meta: null,
    };
  }
  return {
    action: "accept",
    content,
    _meta: buildAcceptedMeta(meta, outcome, approvalPrompt.persistHintsMode ?? "legacy"),
  };
}
function buildAcceptedContent(approvalPrompt, outcome) {
  const { requestedSchema, meta } = approvalPrompt;
  const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : void 0;
  if (!properties) return;
  const required = Array.isArray(requestedSchema.required)
    ? new Set(requestedSchema.required.filter((entry) => typeof entry === "string"))
    : /* @__PURE__ */ new Set();
  const content = {};
  let sawApprovalField = false;
  for (const [name, value] of Object.entries(properties)) {
    const schema = isJsonObject(value) ? value : void 0;
    if (!schema) continue;
    const property = {
      name,
      schema,
      required: required.has(name),
    };
    const next =
      readApprovalFieldValue(property, outcome) ??
      readPersistFieldValue(property, meta, outcome, approvalPrompt.persistHintsMode ?? "legacy") ??
      readFallbackFieldValue(property, outcome);
    if (next === void 0) {
      if (isApprovalField(property)) sawApprovalField = true;
      if (property.required) return;
      continue;
    }
    if (isApprovalField(property)) sawApprovalField = true;
    content[name] = next;
  }
  return sawApprovalField ? content : void 0;
}
function readApprovalFieldValue(property, outcome) {
  if (!isApprovalField(property)) return;
  if (readString$1(property.schema, "type") === "boolean") return true;
  const options = readEnumOptions(property.schema);
  if (options.length === 0) return;
  const sessionChoice = options.find((option) => isSessionApprovalOption(option));
  const acceptChoice = options.find((option) => isPositiveApprovalOption(option));
  if (outcome === "approved-session") return sessionChoice?.value ?? acceptChoice?.value;
  return acceptChoice?.value ?? sessionChoice?.value;
}
function readPersistFieldValue(property, meta, outcome, persistHintsMode) {
  if (!isPersistField(property) || outcome !== "approved-session") return;
  const persistHints = readPersistHints(meta, persistHintsMode);
  const options = readEnumOptions(property.schema);
  if (options.length === 0) return;
  const preferred = choosePersistHint(persistHints);
  if (preferred)
    return options.find((option) => option.value === preferred || option.label === preferred)
      ?.value;
  if (persistHintsMode === "explicit") return chooseAlwaysPersistOptionValue(options);
}
function readDefaultValue(schema) {
  return schema.default;
}
function readFallbackFieldValue(property, outcome) {
  if (outcome === "approved-once" && isPersistField(property)) return;
  return readDefaultValue(property.schema);
}
function isApprovalField(property) {
  const haystack = propertyText(property).toLowerCase();
  return /\b(approve|approval|allow|accept|decision)\b/.test(haystack);
}
function isPersistField(property) {
  const haystack = propertyText(property).toLowerCase();
  return /\b(persist|session|always|scope)\b/.test(haystack);
}
function propertyText(property) {
  return [
    property.name,
    readString$1(property.schema, "title"),
    readString$1(property.schema, "description"),
  ]
    .filter(Boolean)
    .join(" ");
}
function readPersistHints(meta, mode = "legacy") {
  const raw = meta.persist;
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) return raw.filter((entry) => typeof entry === "string");
  return mode === "legacy" ? ["session", "always"] : [];
}
function buildAcceptedMeta(meta, outcome, persistHintsMode) {
  if (outcome !== "approved-session") return null;
  const persist = choosePersistHint(readPersistHints(meta, persistHintsMode));
  return persist ? { persist } : null;
}
function choosePersistHint(persistHints) {
  if (persistHints.includes("always")) return "always";
  if (persistHints.includes("session")) return "session";
}
function chooseAlwaysPersistOptionValue(options) {
  return options.find((option) => optionMatchesPersist(option, "always"))?.value;
}
function optionMatchesPersist(option, persist) {
  return option.value.toLowerCase() === persist || option.label.toLowerCase() === persist;
}
function hasNoSchemaProperties(requestedSchema) {
  const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
  return Object.keys(properties).length === 0;
}
function readEnumOptions(schema) {
  if (Array.isArray(schema.enum)) {
    const values = schema.enum.filter((entry) => typeof entry === "string");
    const labels = Array.isArray(schema.enumNames)
      ? schema.enumNames.filter((entry) => typeof entry === "string")
      : [];
    return values.map((value, index) => ({
      value,
      label: labels[index] ?? value,
    }));
  }
  if (Array.isArray(schema.oneOf))
    return schema.oneOf
      .map((entry) => {
        const option = isJsonObject(entry) ? entry : void 0;
        const value = readString$1(option, "const");
        if (!value) return;
        return {
          value,
          label: readString$1(option, "title") ?? value,
        };
      })
      .filter((entry) => Boolean(entry));
  return [];
}
function isPositiveApprovalOption(option) {
  const haystack = `${option.value} ${option.label}`.toLowerCase();
  return /\b(allow|approve|accept|yes|continue|proceed|true)\b/.test(haystack);
}
function isSessionApprovalOption(option) {
  const haystack = `${option.value} ${option.label}`.toLowerCase();
  return (
    /\b(session|always|persistent)\b/.test(haystack) && /\b(allow|approve|accept)\b/.test(haystack)
  );
}
function readString$1(record, key) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : void 0;
}
function readFirstString$1(record, keys) {
  for (const key of keys) {
    const value = readString$1(record, key);
    if (value) return value;
  }
}
//#endregion
//#region extensions/codex/src/app-server/approval-bridge.ts
/**
 * Bridges Codex app-server approval requests into OpenClaw policy hooks and
 * plugin approval UX.
 */
const PERMISSION_DESCRIPTION_MAX_LENGTH = 700;
const PERMISSION_SAMPLE_LIMIT = 2;
const PERMISSION_VALUE_MAX_LENGTH = 48;
const COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH = 80;
const APPROVAL_PREVIEW_SCAN_MAX_LENGTH = 4096;
const APPROVAL_PREVIEW_OMITTED = "[preview truncated or unsafe content omitted]";
const ANSI_OSC_SEQUENCE_RE = new RegExp(
  String.raw`(?:\u001b]|\u009d)[^\u001b\u009c\u0007]*(?:\u0007|\u001b\\|\u009c)`,
  "g",
);
const ANSI_CONTROL_SEQUENCE_RE = new RegExp(
  String.raw`(?:\u001b\[[0-?]*[ -/]*[@-~]|\u009b[0-?]*[ -/]*[@-~]|\u001b[@-Z\\-_])`,
  "g",
);
const CONTROL_CHARACTER_RE = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]+`, "g");
const INVISIBLE_FORMATTING_CONTROL_RE = new RegExp(
  String.raw`[\u00ad\u034f\u061c\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufe00-\ufe0f\u{e0100}-\u{e01ef}]`,
  "gu",
);
const DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE = new RegExp(
  String.raw`(?:\u001b\][^\u001b\u009c\u0007]*|\u009d[^\u001b\u009c\u0007]*|\u001b\[[0-?]*[ -/]*|\u009b[0-?]*[ -/]*|\u001b)$`,
);
/**
 * Handles one app-server approval request for the active thread/turn, returning
 * the app-server response payload when the request belongs to this run.
 */
async function handleCodexAppServerApprovalRequest(params) {
  const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
  if (!matchesCurrentTurn(requestParams, params.threadId, params.turnId)) return;
  if (!isSupportedAppServerApprovalMethod(params.method)) return unsupportedApprovalResponse();
  const context = buildApprovalContext({
    method: params.method,
    requestParams,
    paramsForRun: params.paramsForRun,
  });
  try {
    const policyOutcome = await runOpenClawToolPolicyForApprovalRequest({
      method: params.method,
      requestParams,
      paramsForRun: params.paramsForRun,
      context,
      nativeHookRelay: params.nativeHookRelay,
      signal: params.signal,
    });
    if (policyOutcome?.outcome === "denied") {
      recordNativeToolFailureDisposition(params, context, policyOutcome.failureDisposition);
      emitApprovalEvent(params.paramsForRun, {
        phase: "resolved",
        kind: context.kind,
        status: "denied",
        title: context.title,
        ...context.eventDetails,
        ...approvalEventScope(params.method, "denied"),
        message: policyOutcome.reason,
      });
      return buildApprovalResponse(params.method, context.requestParams, "denied");
    }
    if (
      policyOutcome?.outcome === "approved-once" ||
      policyOutcome?.outcome === "approved-session"
    ) {
      emitApprovalEvent(params.paramsForRun, {
        phase: "resolved",
        kind: context.kind,
        status: "approved",
        title: context.title,
        ...context.eventDetails,
        ...approvalEventScope(params.method, policyOutcome.outcome),
        message: approvalResolutionMessage(policyOutcome.outcome),
      });
      return buildApprovalResponse(params.method, context.requestParams, policyOutcome.outcome);
    }
    if (params.autoApprove === true) {
      emitApprovalEvent(params.paramsForRun, {
        phase: "resolved",
        kind: context.kind,
        status: "approved",
        title: context.title,
        ...context.eventDetails,
        ...approvalEventScope(params.method, "approved-session"),
        message: "Codex app-server approval auto-approved by runtime policy.",
      });
      return buildApprovalResponse(params.method, context.requestParams, "approved-session");
    }
    const requestResult = await requestPluginApproval({
      paramsForRun: params.paramsForRun,
      title: context.title,
      description: context.description,
      severity: context.severity,
      toolName: context.toolName,
      toolCallId: context.approvalId,
    });
    const approvalId = requestResult?.id;
    if (!approvalId) {
      recordNativeToolFailureDisposition(params, context, "failed");
      emitApprovalEvent(params.paramsForRun, {
        phase: "resolved",
        kind: context.kind,
        status: "unavailable",
        title: context.title,
        ...context.eventDetails,
        ...approvalEventScope(params.method, "denied"),
        message: "Codex app-server approval route unavailable.",
      });
      return buildApprovalResponse(params.method, context.requestParams, "denied");
    }
    emitApprovalEvent(params.paramsForRun, {
      phase: "requested",
      kind: context.kind,
      status: "pending",
      title: context.title,
      approvalId,
      approvalSlug: approvalId,
      ...context.eventDetails,
      message: "Codex app-server approval requested.",
    });
    const requestUnavailable = approvalRequestExplicitlyUnavailable(requestResult);
    const decision = requestUnavailable
      ? null
      : await waitForPluginApprovalDecision({
          approvalId,
          signal: params.signal,
        });
    const approvalExpired = !requestUnavailable && decision === null;
    const outcome = params.signal?.aborted ? "cancelled" : mapExecDecisionToOutcome(decision);
    if (outcome === "cancelled")
      recordNativeToolFailureDisposition(
        params,
        context,
        params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : "cancelled",
      );
    else if (outcome === "unavailable")
      recordNativeToolFailureDisposition(params, context, approvalExpired ? "timed_out" : "failed");
    emitApprovalEvent(params.paramsForRun, {
      phase: "resolved",
      kind: context.kind,
      status:
        outcome === "denied"
          ? "denied"
          : outcome === "unavailable"
            ? "unavailable"
            : outcome === "cancelled"
              ? "failed"
              : "approved",
      title: context.title,
      approvalId,
      approvalSlug: approvalId,
      ...context.eventDetails,
      ...approvalEventScope(params.method, outcome),
      message: approvalResolutionMessage(outcome),
    });
    return buildApprovalResponse(params.method, context.requestParams, outcome);
  } catch (error) {
    const cancelled = params.signal?.aborted === true;
    recordNativeToolFailureDisposition(
      params,
      context,
      cancelled && params.signal ? resolveCodexToolAbortTerminalReason(params.signal) : "failed",
    );
    emitApprovalEvent(params.paramsForRun, {
      phase: "resolved",
      kind: context.kind,
      status: cancelled ? "failed" : "unavailable",
      title: context.title,
      ...context.eventDetails,
      ...approvalEventScope(params.method, cancelled ? "cancelled" : "denied"),
      message: cancelled
        ? "Codex app-server approval cancelled because the run stopped."
        : `Codex app-server approval route failed: ${formatCodexDisplayText(formatErrorMessage(error))}`,
    });
    return buildApprovalResponse(
      params.method,
      context.requestParams,
      cancelled ? "cancelled" : "denied",
    );
  }
}
function recordNativeToolFailureDisposition(params, context, disposition) {
  if (!context.itemId || !disposition) return;
  try {
    params.onNativeToolFailureDisposition?.(
      context.itemId,
      params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : disposition,
    );
  } catch {}
}
/** Converts an OpenClaw approval outcome into the app-server method response. */
function buildApprovalResponse(method, requestParams, outcome) {
  if (method === "item/commandExecution/requestApproval")
    return { decision: commandApprovalDecision(requestParams, outcome) };
  if (method === "item/fileChange/requestApproval")
    return { decision: fileChangeApprovalDecision(outcome) };
  if (method === "item/permissions/requestApproval") {
    if (outcome === "approved-session" || outcome === "approved-once")
      return {
        permissions: requestedPermissions(requestParams),
        scope: outcome === "approved-session" ? "session" : "turn",
      };
    return {
      permissions: {},
      scope: "turn",
    };
  }
  return unsupportedApprovalResponse();
}
function matchesCurrentTurn(requestParams, threadId, turnId) {
  if (!requestParams) return false;
  const requestThreadId = readString(requestParams, "threadId");
  const requestTurnId = readString(requestParams, "turnId");
  return requestThreadId === threadId && requestTurnId === turnId;
}
function buildApprovalContext(params) {
  const itemId =
    readString(params.requestParams, "itemId") ??
    readString(params.requestParams, "callId") ??
    readString(params.requestParams, "approvalId");
  const approvalId = readString(params.requestParams, "approvalId") ?? itemId;
  const commandDetailLines =
    params.method === "item/commandExecution/requestApproval"
      ? describeCommandApprovalDetails(params.requestParams)
      : [];
  const commandPreview = sanitizeApprovalPreview(
    readDisplayCommandPreview(params.requestParams),
    commandDetailLines.length > 0 ? COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH : 180,
  );
  const reasonPreview = sanitizeApprovalPreview(
    readStringPreview(params.requestParams, "reason"),
    180,
  );
  const command = commandPreview.text;
  const reason = reasonPreview.text;
  const kind = approvalKindForMethod(params.method);
  const permissionLines =
    params.method === "item/permissions/requestApproval"
      ? describeRequestedPermissions(params.requestParams)
      : [];
  const title =
    kind === "exec"
      ? "Codex app-server command approval"
      : params.method === "item/permissions/requestApproval"
        ? "Codex app-server permission approval"
        : kind === "plugin"
          ? "Codex app-server file approval"
          : "Codex app-server approval";
  const subject =
    permissionLines[0] ??
    (command
      ? `Command: ${formatApprovalPreviewSubject(command, commandPreview.omitted)}`
      : commandPreview.omitted
        ? `Command: ${APPROVAL_PREVIEW_OMITTED}`
        : reason
          ? `Reason: ${formatApprovalPreviewSubject(reason, reasonPreview.omitted)}`
          : reasonPreview.omitted
            ? `Reason: ${APPROVAL_PREVIEW_OMITTED}`
            : `Request method: ${params.method}`);
  return {
    kind,
    title,
    description:
      permissionLines.length > 0
        ? joinDescriptionLinesWithinLimit(permissionLines, PERMISSION_DESCRIPTION_MAX_LENGTH)
        : [
            subject,
            ...commandDetailLines,
            params.paramsForRun.sessionKey && `Session: ${params.paramsForRun.sessionKey}`,
          ]
            .filter(Boolean)
            .join("\n"),
    severity: kind === "exec" ? "warning" : "info",
    toolName:
      kind === "exec"
        ? "codex_command_approval"
        : params.method === "item/permissions/requestApproval"
          ? "codex_permission_approval"
          : "codex_file_approval",
    itemId,
    approvalId,
    requestParams: params.requestParams,
    eventDetails: {
      ...(itemId ? { itemId } : {}),
      ...(command ? { command } : {}),
      ...(commandPreview.omitted ? { commandPreviewOmitted: true } : {}),
      ...(reason ? { reason } : {}),
      ...(reasonPreview.omitted ? { reasonPreviewOmitted: true } : {}),
    },
  };
}
async function runOpenClawToolPolicyForApprovalRequest(params) {
  const policyRequest = buildOpenClawToolPolicyRequest(params.method, params.requestParams);
  if (!policyRequest) return;
  const cwd = readString(params.requestParams, "cwd") ?? params.paramsForRun.workspaceDir;
  const nativeRelayOutcome = await runNativeRelayToolPolicyForApprovalRequest({
    method: params.method,
    requestParams: params.requestParams,
    context: params.context,
    policyRequest,
    nativeHookRelay: params.nativeHookRelay,
    cwd,
    signal: params.signal,
  });
  if (nativeRelayOutcome?.blocked)
    return {
      outcome: "denied",
      reason: nativeRelayOutcome.reason,
      ...(nativeRelayOutcome.failureDisposition
        ? { failureDisposition: nativeRelayOutcome.failureDisposition }
        : {}),
    };
  if (
    nativeRelayOutcome?.outcome === "approved-once" ||
    nativeRelayOutcome?.outcome === "approved-session"
  )
    return { outcome: nativeRelayOutcome.outcome };
  if (nativeRelayOutcome?.handled) return { outcome: "no-decision" };
  const hookChannelId = buildAgentHookContextChannelFields({
    sessionKey: params.paramsForRun.sessionKey,
    messageChannel: params.paramsForRun.messageChannel,
    messageProvider: params.paramsForRun.messageProvider,
    currentChannelId: params.paramsForRun.currentChannelId,
    messageTo: params.paramsForRun.messageTo,
  }).channelId;
  const outcome = await runBeforeToolCallHook({
    toolName: policyRequest.toolName,
    params: policyRequest.params,
    ...(params.context.approvalId ? { toolCallId: params.context.approvalId } : {}),
    approvalMode: "request",
    signal: params.signal,
    ctx: {
      ...(params.paramsForRun.agentId ? { agentId: params.paramsForRun.agentId } : {}),
      ...(params.paramsForRun.config ? { config: params.paramsForRun.config } : {}),
      ...(cwd ? { cwd } : {}),
      workspaceDir: params.paramsForRun.workspaceDir,
      ...(params.paramsForRun.sessionKey ? { sessionKey: params.paramsForRun.sessionKey } : {}),
      ...(params.paramsForRun.sessionId ? { sessionId: params.paramsForRun.sessionId } : {}),
      ...(params.paramsForRun.runId ? { runId: params.paramsForRun.runId } : {}),
      ...(hookChannelId ? { channelId: hookChannelId } : {}),
    },
  });
  if (outcome.blocked)
    return {
      outcome: "denied",
      reason: outcome.reason,
      ...(outcome.kind === "failure" && outcome.disposition !== "blocked"
        ? { failureDisposition: outcome.disposition }
        : {}),
    };
  if ("params" in outcome && toolPolicyParamsWereRewritten(policyRequest.params, outcome.params))
    return {
      outcome: "denied",
      reason:
        "OpenClaw tool policy rewrote Codex app-server approval params; refusing original request.",
    };
  if (outcome.approvalResolution) return { outcome: "approved-once" };
}
async function runNativeRelayToolPolicyForApprovalRequest(params) {
  if (
    params.method !== "item/commandExecution/requestApproval" ||
    !params.nativeHookRelay?.allowedEvents.includes("pre_tool_use")
  )
    return;
  const payload = buildNativeRelayPreToolUsePayload({
    requestParams: params.requestParams,
    policyRequest: params.policyRequest,
    context: params.context,
    cwd: params.cwd,
  });
  if (!payload) return;
  if (
    hasNativeHookRelayInvocation({
      relayId: params.nativeHookRelay.relayId,
      event: "pre_tool_use",
      toolUseId: params.context.approvalId,
    })
  ) {
    const approvalOutcome = await resolveNativeHookRelayDeferredToolApproval({
      relayId: params.nativeHookRelay.relayId,
      toolUseId: params.context.approvalId,
      signal: params.signal,
    });
    if (approvalOutcome?.outcome === "denied")
      return {
        handled: true,
        blocked: true,
        reason: approvalOutcome.reason,
        ...(approvalOutcome.failureDisposition
          ? { failureDisposition: approvalOutcome.failureDisposition }
          : {}),
      };
    if (approvalOutcome?.outcome === "approved-once")
      return {
        handled: true,
        outcome: approvalOutcome.outcome,
      };
    return { handled: true };
  }
  try {
    const decision = readNativeRelayPreToolUseDecision(
      await invokeNativeHookRelay({
        provider: "codex",
        relayId: params.nativeHookRelay.relayId,
        generation: params.nativeHookRelay.generation,
        event: "pre_tool_use",
        rawPayload: payload,
        requireGeneration: true,
      }),
    );
    if (decision.blocked)
      return {
        handled: true,
        blocked: true,
        reason: decision.reason,
        ...(decision.failureDisposition ? { failureDisposition: decision.failureDisposition } : {}),
      };
    const approvalOutcome = await resolveNativeHookRelayDeferredToolApproval({
      relayId: params.nativeHookRelay.relayId,
      toolUseId: params.context.approvalId,
      signal: params.signal,
    });
    if (approvalOutcome?.outcome === "denied")
      return {
        handled: true,
        blocked: true,
        reason: approvalOutcome.reason,
        ...(approvalOutcome.failureDisposition
          ? { failureDisposition: approvalOutcome.failureDisposition }
          : {}),
      };
    if (approvalOutcome?.outcome === "approved-once")
      return {
        handled: true,
        outcome: approvalOutcome.outcome,
      };
    return { handled: true };
  } catch (error) {
    return {
      handled: true,
      blocked: true,
      reason: `OpenClaw native hook relay unavailable for Codex app-server approval: ${formatCodexDisplayText(formatErrorMessage(error))}`,
      failureDisposition: "failed",
    };
  }
}
function buildNativeRelayPreToolUsePayload(params) {
  const command = readString(params.policyRequest.params, "command");
  if (!command) return;
  const turnId = readString(params.requestParams, "turnId");
  return {
    hook_event_name: "PreToolUse",
    openclaw_approval_mode: "report",
    tool_name: "exec_command",
    ...(params.context.approvalId ? { tool_use_id: params.context.approvalId } : {}),
    ...(params.cwd ? { cwd: params.cwd } : {}),
    ...(turnId ? { turn_id: turnId } : {}),
    tool_input: {
      ...params.policyRequest.params,
      command,
      cmd: command,
    },
  };
}
function readNativeRelayPreToolUseDecision(response) {
  if (!response || response.exitCode !== 0)
    return {
      blocked: true,
      reason:
        sanitizeRelayDecisionReason(response?.stderr) ||
        sanitizeRelayDecisionReason(response?.stdout) ||
        "OpenClaw native hook relay failed for Codex app-server approval.",
      failureDisposition: response?.failureDisposition ?? "failed",
    };
  const stdout = response.stdout?.trim();
  if (!stdout) return { blocked: false };
  const parsed = parseRelayJsonResponse(stdout);
  const output = isJsonObject(parsed?.hookSpecificOutput) ? parsed.hookSpecificOutput : void 0;
  if (output?.permissionDecision === "deny")
    return {
      blocked: true,
      reason:
        readString(output, "permissionDecisionReason") ||
        "OpenClaw native hook policy denied Codex app-server approval.",
      ...(response.failureDisposition ? { failureDisposition: response.failureDisposition } : {}),
    };
  return {
    blocked: true,
    reason: output
      ? "OpenClaw native hook relay returned a non-deny Codex app-server approval decision."
      : "OpenClaw native hook relay returned an unreadable Codex app-server approval result.",
    failureDisposition: "failed",
  };
}
function parseRelayJsonResponse(text) {
  try {
    const parsed = JSON.parse(text);
    return isJsonObject(parsed) ? parsed : void 0;
  } catch {
    return;
  }
}
function sanitizeRelayDecisionReason(value) {
  return sanitizeApprovalPreview(
    value
      ? {
          value,
          clipped: false,
        }
      : void 0,
    240,
  ).text;
}
function buildOpenClawToolPolicyRequest(method, requestParams) {
  if (method === "item/commandExecution/requestApproval") {
    const command = readPolicyCommand(requestParams);
    return {
      toolName: "exec",
      params: {
        ...(command ? { command } : {}),
        ...(readString(requestParams, "cwd") ? { cwd: readString(requestParams, "cwd") } : {}),
        approval: requestParams ?? {},
      },
    };
  }
  if (method === "item/fileChange/requestApproval")
    return {
      toolName: "apply_patch",
      params: requestParams ?? {},
    };
  if (method === "item/permissions/requestApproval")
    return {
      toolName: "codex_permission_approval",
      params: requestParams ?? {},
    };
}
function toolPolicyParamsWereRewritten(original, candidate) {
  if (candidate === original) return false;
  const originalText = stableJsonText(original);
  const candidateText = stableJsonText(candidate);
  return !candidateText || candidateText !== originalText;
}
function stableJsonText(value) {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
    return JSON.stringify(value);
  if (Array.isArray(value)) {
    const items = value.map((item) => stableJsonText(item));
    return items.every((item) => item !== void 0) ? `[${items.join(",")}]` : void 0;
  }
  if (isPlainRecord(value)) {
    const entries = Object.entries(value)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => {
        const text = stableJsonText(item);
        return text === void 0 ? void 0 : `${JSON.stringify(key)}:${text}`;
      });
    return entries.every((entry) => entry !== void 0) ? `{${entries.join(",")}}` : void 0;
  }
}
function isPlainRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function commandApprovalDecision(requestParams, outcome) {
  if (outcome === "cancelled") return commandRejectionDecision(requestParams, "cancel");
  if (outcome === "denied" || outcome === "unavailable")
    return commandRejectionDecision(requestParams, "decline");
  if (outcome === "approved-session") {
    if (hasAvailableDecision(requestParams, "acceptForSession")) return "acceptForSession";
    const amendmentDecision = findAvailableCommandAmendmentDecision(requestParams);
    if (amendmentDecision) return amendmentDecision;
  }
  return hasAvailableDecision(requestParams, "accept")
    ? "accept"
    : commandRejectionDecision(requestParams, "decline");
}
function fileChangeApprovalDecision(outcome) {
  if (outcome === "cancelled") return "cancel";
  if (outcome === "denied" || outcome === "unavailable") return "decline";
  return outcome === "approved-session" ? "acceptForSession" : "accept";
}
function requestedPermissions(requestParams) {
  const permissions = isJsonObject(requestParams?.permissions) ? requestParams.permissions : {};
  const granted = {};
  if (isJsonObject(permissions.network)) granted.network = permissions.network;
  if (isJsonObject(permissions.fileSystem)) granted.fileSystem = permissions.fileSystem;
  return granted;
}
function unsupportedApprovalResponse() {
  return {
    decision: "decline",
    reason: "OpenClaw codex app-server bridge does not grant native approvals yet.",
  };
}
function describeRequestedPermissions(requestParams) {
  return describePermissionProfile(requestedPermissions(requestParams), "Permissions");
}
function describeCommandApprovalDetails(requestParams) {
  const lines = [];
  const additionalPermissions = isJsonObject(requestParams?.additionalPermissions)
    ? requestParams.additionalPermissions
    : void 0;
  if (additionalPermissions)
    lines.push(...describePermissionProfile(additionalPermissions, "Additional permissions"));
  const execpolicySummary = summarizeStringArray(
    requestParams?.proposedExecpolicyAmendment,
    "Proposed exec policy",
    sanitizePermissionScalar,
  );
  if (execpolicySummary) lines.push(execpolicySummary);
  const networkAmendmentSummary = summarizeNetworkPolicyAmendments(
    requestParams?.proposedNetworkPolicyAmendments,
  );
  if (networkAmendmentSummary) lines.push(networkAmendmentSummary);
  return lines;
}
function describePermissionProfile(permissions, label) {
  const lines = [];
  const kinds = [];
  const risks = /* @__PURE__ */ new Set();
  if (isJsonObject(permissions.network)) kinds.push("network");
  if (isJsonObject(permissions.fileSystem)) kinds.push("fileSystem");
  if (kinds.length > 0) lines.push(`${label}: ${kinds.join(", ")}`);
  let networkSummary;
  if (isJsonObject(permissions.network)) {
    const summaries = [
      summarizeNetworkEnabledPermission(permissions.network, risks),
      summarizePermissionRecord(permissions.network, risks, [
        {
          key: "allowHosts",
          label: "allowHosts",
          sanitize: sanitizePermissionHostValue,
          risksFor: permissionHostRisks,
        },
      ]),
    ].filter((summary) => Boolean(summary));
    networkSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
  }
  let fileSystemSummary;
  if (isJsonObject(permissions.fileSystem)) {
    const summaries = [
      summarizePermissionRecord(permissions.fileSystem, risks, [
        {
          key: "read",
          label: "read",
          sanitize: sanitizePermissionPathValue,
          risksFor: permissionPathRisks,
        },
        {
          key: "write",
          label: "write",
          sanitize: sanitizePermissionPathValue,
          risksFor: permissionPathRisks,
        },
        {
          key: "roots",
          label: "roots",
          sanitize: sanitizePermissionPathValue,
          risksFor: permissionPathRisks,
        },
        {
          key: "readPaths",
          label: "readPaths",
          sanitize: sanitizePermissionPathValue,
          risksFor: permissionPathRisks,
        },
        {
          key: "writePaths",
          label: "writePaths",
          sanitize: sanitizePermissionPathValue,
          risksFor: permissionPathRisks,
        },
      ]),
      summarizeFileSystemEntries(permissions.fileSystem, risks),
    ].filter((summary) => Boolean(summary));
    fileSystemSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
  }
  if (risks.size > 0) lines.push(`High-risk targets: ${[...risks].join(", ")}`);
  if (networkSummary) lines.push(`Network ${networkSummary}`);
  if (fileSystemSummary) lines.push(`File system ${fileSystemSummary}`);
  return lines;
}
function summarizeNetworkEnabledPermission(permission, risks) {
  const enabled = permission.enabled;
  if (typeof enabled !== "boolean") return;
  if (enabled) risks.add("network access");
  return `enabled: ${enabled}`;
}
function summarizeFileSystemEntries(permission, risks) {
  const entries = permission.entries;
  if (!Array.isArray(entries)) return;
  const samples = [];
  let count = 0;
  for (const entry of entries) {
    const item = isJsonObject(entry) ? entry : void 0;
    const path = typeof item?.path === "string" ? item.path.trim() : "";
    const access = typeof item?.access === "string" ? item.access.trim() : "";
    if (!path || !access) continue;
    count += 1;
    if (access !== "none") for (const risk of permissionPathRisks(path)) risks.add(risk);
    if (samples.length < PERMISSION_SAMPLE_LIMIT)
      samples.push(`${sanitizePermissionScalar(access)} ${sanitizePermissionPathValue(path)}`);
  }
  if (count === 0) return;
  const remaining = count - samples.length;
  const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
  return `entries: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizePermissionRecord(permission, risks, descriptors) {
  const details = [];
  for (const descriptor of descriptors) {
    const summary = summarizePermissionArray(permission, descriptor, risks);
    if (summary) details.push(summary);
  }
  return details.length > 0 ? details.join("; ") : void 0;
}
function summarizePermissionArray(record, descriptor, risks) {
  const values = readStringArray(record, descriptor.key);
  if (values.length === 0) return;
  for (const value of values) for (const risk of descriptor.risksFor(value)) risks.add(risk);
  const sampleValues = values
    .slice(0, PERMISSION_SAMPLE_LIMIT)
    .map(descriptor.sanitize)
    .filter(Boolean);
  if (sampleValues.length === 0) return `${descriptor.label}: ${values.length}`;
  const remaining = values.length - sampleValues.length;
  const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
  return `${descriptor.label}: ${sampleValues.join(", ")}${remainderSuffix}`;
}
function summarizeStringArray(value, label, sanitize) {
  if (!Array.isArray(value)) return;
  const values = value
    .filter((entry) => typeof entry === "string")
    .map((entry) => sanitize(entry))
    .filter(Boolean);
  if (values.length === 0) return;
  const samples = values.slice(0, PERMISSION_SAMPLE_LIMIT);
  const remaining = values.length - samples.length;
  const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
  return `${label}: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizeNetworkPolicyAmendments(value) {
  if (!Array.isArray(value)) return;
  const samples = [];
  let count = 0;
  for (const entry of value) {
    const amendment = isJsonObject(entry) ? entry : void 0;
    const host = typeof amendment?.host === "string" ? amendment.host : "";
    const action = typeof amendment?.action === "string" ? amendment.action : "";
    if (!host || !action) continue;
    count += 1;
    if (samples.length < PERMISSION_SAMPLE_LIMIT)
      samples.push(`${sanitizePermissionScalar(action)} ${sanitizePermissionHostValue(host)}`);
  }
  if (count === 0) return;
  const remaining = count - samples.length;
  const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
  return `Proposed network policy: ${samples.join(", ")}${remainderSuffix}`;
}
function readStringArray(record, key) {
  return normalizeTrimmedStringList(record[key]);
}
function sanitizePermissionHostValue(value) {
  const withoutScheme = sanitizePermissionScalar(value)
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  const authority = withoutScheme.split(/[/?#]/, 1)[0] ?? withoutScheme;
  return truncate(
    authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority,
    PERMISSION_VALUE_MAX_LENGTH,
  );
}
function sanitizePermissionPathValue(value) {
  return truncate(
    formatApprovalDisplayPath(sanitizePermissionScalar(value)),
    PERMISSION_VALUE_MAX_LENGTH,
  );
}
function sanitizePermissionScalar(value) {
  return sanitizeVisibleScalar(value);
}
function permissionHostRisks(value) {
  const normalized = value.trim().toLowerCase();
  const risks = [];
  if (normalized.includes("*")) {
    risks.push("wildcard hosts");
    if (isPrivateNetworkHostPattern(normalized)) risks.push("private-network wildcards");
  }
  return risks;
}
function permissionPathRisks(value) {
  const normalized = sanitizePermissionScalar(value);
  const risks = [];
  if (normalized === "/" || normalized === "\\" || /^[A-Za-z]:[\\/]*$/.test(normalized))
    risks.push("filesystem root");
  return risks;
}
function isPrivateNetworkHostPattern(value) {
  const wildcardStripped = value.toLowerCase().replace(/^\*\./, "");
  if (
    wildcardStripped === "localhost" ||
    wildcardStripped === "local" ||
    wildcardStripped === "internal" ||
    wildcardStripped === "lan" ||
    wildcardStripped === "home" ||
    wildcardStripped === "corp" ||
    wildcardStripped === "private" ||
    wildcardStripped.endsWith(".local") ||
    wildcardStripped.endsWith(".internal") ||
    wildcardStripped.endsWith(".lan") ||
    wildcardStripped.endsWith(".home") ||
    wildcardStripped.endsWith(".corp") ||
    wildcardStripped.endsWith(".private")
  )
    return true;
  if (
    wildcardStripped.startsWith("10.") ||
    wildcardStripped.startsWith("127.") ||
    wildcardStripped.startsWith("192.168.") ||
    wildcardStripped.startsWith("169.254.")
  )
    return true;
  return /^172\.(1[6-9]|2\d|3[0-1])\./.test(wildcardStripped);
}
function hasAvailableDecision(requestParams, decision) {
  const available = requestParams?.availableDecisions;
  if (!Array.isArray(available)) return true;
  return available.includes(decision);
}
function findAvailableCommandAmendmentDecision(requestParams) {
  const available = requestParams?.availableDecisions;
  if (!Array.isArray(available)) return;
  return available.find(
    (entry) =>
      isJsonObject(entry) &&
      (isJsonObject(entry.acceptWithExecpolicyAmendment) ||
        isJsonObject(entry.applyNetworkPolicyAmendment)),
  );
}
function commandRejectionDecision(requestParams, preferred) {
  const available = requestParams?.availableDecisions;
  if (!Array.isArray(available)) return preferred;
  if (available.includes(preferred)) return preferred;
  const alternate = preferred === "decline" ? "cancel" : "decline";
  if (available.includes(alternate)) return alternate;
  return preferred;
}
function approvalResolutionMessage(outcome) {
  if (outcome === "approved-session") return "Codex app-server approval granted for the session.";
  if (outcome === "approved-once") return "Codex app-server approval granted for this turn.";
  if (outcome === "cancelled") return "Codex app-server approval cancelled.";
  if (outcome === "unavailable") return "Codex app-server approval unavailable.";
  return "Codex app-server approval denied.";
}
function approvalScopeForOutcome(outcome) {
  return outcome === "approved-session" ? "session" : "turn";
}
function approvalEventScope(method, outcome) {
  return method === "item/permissions/requestApproval"
    ? { scope: approvalScopeForOutcome(outcome) }
    : {};
}
function approvalKindForMethod(method) {
  if (method.includes("commandExecution") || method.includes("execCommand")) return "exec";
  if (method.includes("fileChange") || method.includes("Patch") || method.includes("permissions"))
    return "plugin";
  return "unknown";
}
function isSupportedAppServerApprovalMethod(method) {
  return (
    method === "item/commandExecution/requestApproval" ||
    method === "item/fileChange/requestApproval" ||
    method === "item/permissions/requestApproval"
  );
}
function emitApprovalEvent(params, data) {
  params.onAgentEvent?.({
    stream: "approval",
    data,
  });
}
function readDisplayCommandPreview(record) {
  const actionCommand = readCommandActionsPreview(record);
  if (actionCommand) return actionCommand;
  return readCommandPreview(record);
}
function readPolicyCommand(record) {
  const command = record?.command;
  if (typeof command === "string") return command;
  if (Array.isArray(command) && command.every((part) => typeof part === "string"))
    return command.join(" ");
  const actionCommands = readCommandActions(record);
  if (actionCommands.length > 0) return actionCommands.join(" && ");
}
function readCommandActions(record) {
  const actions = record?.commandActions;
  if (!Array.isArray(actions)) return [];
  return actions
    .map((action) => (isJsonObject(action) ? readString(action, "command") : void 0))
    .filter((command) => Boolean(command));
}
function readCommandActionsPreview(record) {
  let source;
  for (const command of readCommandActions(record)) {
    source = appendPreviewPart(source, command, " && ");
    if (source.clipped) break;
  }
  return source;
}
function readCommandPreview(record) {
  const command = record?.command;
  if (typeof command === "string") return previewSource(command);
  if (!Array.isArray(command)) return;
  let source;
  for (const part of command) {
    if (typeof part !== "string") return;
    source = appendPreviewPart(source, part, " ");
    if (source.clipped) break;
  }
  return source;
}
function readStringPreview(record, key) {
  const value = readString(record, key);
  return value === void 0 ? void 0 : previewSource(value);
}
function readString(record, key) {
  const value = record?.[key];
  return typeof value === "string" ? value : void 0;
}
function truncate(value, maxLength) {
  return value.length <= maxLength ? value : `${truncateUtf16Safe(value, maxLength - 3)}...`;
}
function previewSource(value) {
  return {
    value: sliceUtf16Safe(value, 0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
    clipped: value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH,
  };
}
function appendPreviewPart(source, part, separator) {
  const value = `${source?.value ? `${source.value}${separator}` : ""}${part}`;
  const clipped = source?.clipped === true || value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH;
  return {
    value: sliceUtf16Safe(value, 0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
    clipped,
  };
}
function sanitizeApprovalPreview(source, maxLength) {
  if (!source || !source.value) return { omitted: false };
  const sanitized = sanitizeVisibleScalar(
    source.value.replace(DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE, ""),
  );
  if (!sanitized) return { omitted: true };
  return {
    text: formatCodexDisplayText(truncate(sanitized, maxLength)),
    omitted: source.clipped,
  };
}
function sanitizeVisibleScalar(value) {
  return value
    .replace(ANSI_OSC_SEQUENCE_RE, "")
    .replace(ANSI_CONTROL_SEQUENCE_RE, "")
    .replace(INVISIBLE_FORMATTING_CONTROL_RE, " ")
    .replace(CONTROL_CHARACTER_RE, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function formatApprovalPreviewSubject(text, omitted) {
  return omitted ? `${text} ${APPROVAL_PREVIEW_OMITTED}` : text;
}
function joinDescriptionLinesWithinLimit(lines, maxLength) {
  let description = "";
  for (const line of lines) {
    const prefix = description ? "\n" : "";
    const next = `${description}${prefix}${line}`;
    if (next.length <= maxLength) {
      description = next;
      continue;
    }
    const remaining = maxLength - description.length - prefix.length;
    if (remaining < 3) break;
    description += `${prefix}${truncate(line, remaining)}`;
    break;
  }
  return description;
}
function formatErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region extensions/codex/src/app-server/agent-context-limits.ts
/** Resolves an agent override before falling back to the configured default. */
function resolveAgentContextLimitValue(params) {
  const agents = asOptionalRecord(params.config?.agents);
  const defaultValue = readPositiveInteger(
    asOptionalRecord(asOptionalRecord(agents?.defaults)?.contextLimits)?.[params.key],
  );
  if (!params.agentId) return defaultValue;
  const list = agents?.list;
  if (!Array.isArray(list)) return defaultValue;
  const normalizedAgentId = normalizeAgentId(params.agentId);
  return (
    readPositiveInteger(
      asOptionalRecord(
        asOptionalRecord(
          list.find((entry) => {
            const entryId = asOptionalRecord(entry)?.id;
            return typeof entryId === "string" && normalizeAgentId(entryId) === normalizedAgentId;
          }),
        )?.contextLimits,
      )?.[params.key],
    ) ?? defaultValue
  );
}
function readPositiveInteger(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
  return Math.floor(value);
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tools.ts
/**
 * Bridges OpenClaw runtime tools into Codex app-server dynamic tool specs and
 * tool-call responses.
 */
function applyCurrentMessageProvider(toolName, args, currentProvider) {
  const hasProvider =
    typeof args.provider === "string" && args.provider.trim().length > 0
      ? true
      : typeof args.channel === "string" && args.channel.trim().length > 0;
  const provider = currentProvider?.trim();
  if (toolName !== "message" || hasProvider || !provider) return args;
  return {
    ...args,
    provider,
  };
}
function normalizeRouteToken(value) {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : void 0;
}
function sourceRouteTokens(hookContext) {
  const tokens = /* @__PURE__ */ new Set();
  const currentTarget = normalizeRouteToken(hookContext?.currentMessagingTarget);
  const currentChannel = normalizeRouteToken(hookContext?.currentChannelId);
  const currentProvider = normalizeRouteToken(hookContext?.currentChannelProvider);
  if (currentTarget) tokens.add(currentTarget);
  if (currentChannel) tokens.add(currentChannel);
  const channelPrefixIndex = currentChannel?.indexOf(":") ?? -1;
  if (channelPrefixIndex >= 0 && currentChannel) {
    const unprefixedChannel = currentChannel.slice(channelPrefixIndex + 1);
    if (unprefixedChannel) {
      tokens.add(unprefixedChannel);
      for (const segment of unprefixedChannel.split(/[;,]/u)) {
        const token = normalizeRouteToken(segment);
        if (token) tokens.add(token);
      }
    }
  }
  if (currentProvider && currentChannel?.startsWith(`${currentProvider}:`)) {
    const unprefixedChannel = currentChannel.slice(currentProvider.length + 1);
    if (unprefixedChannel) tokens.add(unprefixedChannel);
  }
  return tokens;
}
function routeTokenMatchesSource(token, hookContext) {
  const normalized = normalizeRouteToken(token);
  return normalized !== void 0 && sourceRouteTokens(hookContext).has(normalized);
}
function routeProviderMatchesSource(provider, hookContext) {
  const normalized = normalizeRouteToken(provider);
  if (!normalized) return false;
  const currentProvider = normalizeRouteToken(hookContext?.currentChannelProvider);
  const currentChannel = normalizeRouteToken(hookContext?.currentChannelId);
  return currentProvider === normalized || currentChannel?.startsWith(`${normalized}:`) === true;
}
function routeTokenMatchesCurrentMessage(token, hookContext) {
  const normalized = normalizeRouteToken(token);
  return normalized !== void 0 && normalized === normalizeRouteToken(hookContext?.currentMessageId);
}
function readRouteToken(record, key) {
  const value = record[key];
  return typeof value === "string" || typeof value === "number" ? value : void 0;
}
function explicitRouteTokensMismatchCurrent(args, keys, currentToken) {
  const normalizedCurrent = normalizeRouteToken(currentToken);
  if (!normalizedCurrent) return false;
  return keys.some((key) => {
    const normalized = normalizeRouteToken(readRouteToken(args, key));
    return normalized !== void 0 && normalized !== normalizedCurrent;
  });
}
function explicitThreadRouteTargetsNonSource(args, hookContext, messagingTarget) {
  const normalizedCurrentThread = normalizeRouteToken(hookContext?.currentThreadId);
  const explicitThreadTokens = [
    ...EXPLICIT_MESSAGE_THREAD_KEYS.map((key) => normalizeRouteToken(readRouteToken(args, key))),
    normalizeRouteToken(messagingTarget?.threadId),
  ].filter((value) => value !== void 0);
  if (explicitThreadTokens.length === 0) return false;
  return (
    normalizedCurrentThread === void 0 ||
    explicitThreadTokens.some((value) => value !== normalizedCurrentThread)
  );
}
function replyReceiptMatchesCurrentMessage(value, hookContext, depth = 0) {
  if (depth > 4 || value === null) return false;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || !["{", "["].includes(trimmed[0] ?? "")) return false;
    try {
      return replyReceiptMatchesCurrentMessage(JSON.parse(trimmed), hookContext, depth + 1);
    } catch {
      return false;
    }
  }
  if (typeof value !== "object") return false;
  if (Array.isArray(value))
    return value.some((item) => replyReceiptMatchesCurrentMessage(item, hookContext, depth + 1));
  const record = value;
  for (const key of ["repliedTo", "replyTo", "replyToId", "replyToIdFull"])
    if (
      routeTokenMatchesCurrentMessage(
        typeof record[key] === "string" ? record[key] : void 0,
        hookContext,
      )
    )
      return true;
  for (const key of [
    "content",
    "details",
    "payload",
    "receipt",
    "result",
    "results",
    "sendResult",
    "text",
  ])
    if (replyReceiptMatchesCurrentMessage(record[key], hookContext, depth + 1)) return true;
  return false;
}
function hasExplicitNonSourceMessageRoute(args, hookContext, messagingTarget) {
  const currentProvider = normalizeRouteToken(hookContext?.currentChannelProvider);
  for (const key of EXPLICIT_MESSAGE_PROVIDER_KEYS) {
    const provider = normalizeRouteToken(typeof args[key] === "string" ? args[key] : void 0);
    if (
      provider &&
      currentProvider !== provider &&
      !routeProviderMatchesSource(provider, hookContext)
    )
      return true;
  }
  const targetValues = [
    ...EXPLICIT_MESSAGE_TARGET_KEYS.map((key) =>
      typeof args[key] === "string" ? args[key] : void 0,
    ),
    ...(Array.isArray(args.targets)
      ? args.targets.map((value) => (typeof value === "string" ? value : void 0))
      : []),
  ].filter((value) => normalizeRouteToken(value) !== void 0);
  if (explicitThreadRouteTargetsNonSource(args, hookContext, messagingTarget)) return true;
  if (
    explicitRouteTokensMismatchCurrent(
      args,
      EXPLICIT_MESSAGE_REPLY_KEYS,
      hookContext?.currentMessageId,
    )
  )
    return true;
  if (messagingTarget?.to !== void 0 && !routeTokenMatchesSource(messagingTarget.to, hookContext))
    return true;
  if (messagingTarget?.to !== void 0) return false;
  if (targetValues.length === 0) return false;
  if (targetValues.some((value) => !routeTokenMatchesSource(value, hookContext))) return true;
  return false;
}
/** Namespace attached to OpenClaw-owned dynamic tools exposed to Codex. */
const CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE = "openclaw";
const ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES = /* @__PURE__ */ new Set([
  "agents_list",
  "sessions_spawn",
  "sessions_yield",
]);
const EXPLICIT_MESSAGE_PROVIDER_KEYS = ["channel", "provider"];
const EXPLICIT_MESSAGE_TARGET_KEYS = ["target", "to", "channelId"];
const EXPLICIT_MESSAGE_THREAD_KEYS = ["threadId", "thread_id", "messageThreadId", "topicId"];
const EXPLICIT_MESSAGE_REPLY_KEYS = ["replyTo", "replyToId", "replyToIdFull"];
const DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS = 16e3;
function computerFrameImageIdentity(content) {
  if (!Array.isArray(content)) return;
  const images = content.filter((block) => block.type === "image");
  if (images.length !== 1) return;
  const image = expectDefined(images[0], "single Codex computer frame image");
  return createHash("sha256")
    .update(JSON.stringify([image.mimeType, image.data]))
    .digest("hex");
}
function invalidateComputerFrame(contextEpoch) {
  contextEpoch.value += 1;
  delete contextEpoch.frameToolCallId;
  delete contextEpoch.frameImageIdentity;
}
/**
 * Creates dynamic tool specs and a call handler that executes OpenClaw tools,
 * applies hooks/middleware, and records delivery/media telemetry.
 */
function createCodexDynamicToolBridge(params) {
  const toolResultHookContext = toToolResultHookContext(params.hookContext);
  const toolResultMaxChars = resolveCodexDynamicToolResultMaxChars(params.hookContext);
  const availableProjection = projectCodexDynamicTools(params.tools);
  const registeredProjection = params.registeredTools
    ? projectCodexDynamicTools(params.registeredTools)
    : availableProjection;
  const wrappedAvailableProjection = wrapProjectedCodexDynamicTools(
    availableProjection.tools,
    params.hookContext,
  );
  const availableTools = wrappedAvailableProjection.tools;
  const quarantinedAvailableToolNames = new Set(
    [...availableProjection.quarantinedTools, ...wrappedAvailableProjection.quarantinedTools].map(
      (tool) => tool.tool,
    ),
  );
  const registeredSpecTools = (
    params.registeredTools ? registeredProjection.tools : availableTools
  ).filter((entry) => !quarantinedAvailableToolNames.has(entry.name));
  const toolMap = new Map(availableTools.map((entry) => [entry.name, entry]));
  const registeredToolNames = new Set(registeredSpecTools.map((entry) => entry.name));
  const quarantinedTools = dedupeQuarantinedDynamicTools([
    ...availableProjection.quarantinedTools,
    ...registeredProjection.quarantinedTools,
    ...wrappedAvailableProjection.quarantinedTools,
  ]);
  warnQuarantinedDynamicTools(quarantinedTools);
  emitQuarantinedDynamicToolDiagnostics(quarantinedTools, params.hookContext);
  const telemetry = {
    didSendViaMessagingTool: false,
    didDeliverSourceReplyViaMessageTool: false,
    messagingToolSentTexts: [],
    messagingToolSentMediaUrls: [],
    messagingToolSentTargets: [],
    messagingToolSourceReplyPayloads: [],
    toolMediaUrls: [],
    toolAudioAsVoice: false,
    quarantinedTools,
  };
  const middlewareRunner = createAgentToolResultMiddlewareRunner({
    runtime: "codex",
    ...toolResultHookContext,
  });
  const isReplaySafeToolInstance = (tool) => {
    const pluginMeta = getPluginToolMeta(tool);
    if (pluginMeta) return pluginMeta.replaySafe === true;
    return getChannelAgentToolMeta(tool) === void 0;
  };
  const legacyExtensionRunner =
    createCodexAppServerToolResultExtensionRunner(toolResultHookContext);
  const directToolNames = /* @__PURE__ */ new Set([
    ...ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES,
    ...(params.directToolNames ?? []),
  ]);
  return {
    availableSpecs: createCodexDynamicToolSpecs({
      entries: availableTools,
      loading: params.loading ?? "searchable",
      directToolNames,
    }),
    specs: createCodexDynamicToolSpecs({
      entries: registeredSpecTools,
      loading: params.loading ?? "searchable",
      directToolNames,
    }),
    telemetry,
    handleToolCall: async (call, options) => {
      const toolEntry = toolMap.get(call.tool);
      if (!toolEntry) {
        const message = registeredToolNames.has(call.tool)
          ? `OpenClaw tool is not available for this turn: ${call.tool}`
          : `Unknown OpenClaw tool: ${call.tool}`;
        finalizeToolTerminalPresentation({
          toolCallId: call.callId,
          runId: toolResultHookContext.runId,
          result: failedToolResult(message),
          isError: true,
          observer: params.hookContext?.onToolOutcome,
          toolName: call.tool,
          toolCallOrdinal: options?.toolCallOrdinal,
        });
        notifyAgentToolResult(
          options?.onAgentToolResult,
          call.tool,
          failedToolResult(message),
          true,
        );
        if (registeredToolNames.has(call.tool))
          return {
            contentItems: [
              {
                type: "inputText",
                text: message,
              },
            ],
            success: false,
          };
        return {
          contentItems: [
            {
              type: "inputText",
              text: message,
            },
          ],
          success: false,
        };
      }
      const { tool, name: toolName } = toolEntry;
      const args = jsonObjectToRecord(call.arguments);
      const startedAt = Date.now();
      const signal = composeAbortSignals(params.signal, options?.signal);
      let didStartExecution = false;
      let executionPrevented = false;
      let executedArgs = structuredClone(args);
      try {
        const preparedArgs = tool.prepareArguments ? tool.prepareArguments(args) : args;
        const telemetryArgs = isRecord(preparedArgs) ? preparedArgs : args;
        executedArgs = structuredClone(telemetryArgs);
        const messagingContext = {
          config: params.hookContext?.config,
          currentChannelId: params.hookContext?.currentChannelId,
          currentMessagingTarget: params.hookContext?.currentMessagingTarget,
          currentThreadId: params.hookContext?.currentThreadId,
          replyToMode: params.hookContext?.replyToMode,
          hasRepliedRef: params.hookContext?.hasRepliedRef
            ? { value: params.hookContext.hasRepliedRef.value }
            : void 0,
        };
        didStartExecution = true;
        const rawResult = await tool.execute(call.callId, preparedArgs, signal);
        const adjustedExecutedArgs = consumeAdjustedParamsForToolCall(
          call.callId,
          toolResultHookContext.runId,
        );
        if (isRecord(adjustedExecutedArgs)) executedArgs = structuredClone(adjustedExecutedArgs);
        executionPrevented = consumePreExecutionBlockedToolCall(
          call.callId,
          toolResultHookContext.runId,
        );
        const telemetryRawResult = sanitizeToolResult(rawResult);
        const rawIsError = isCodexToolResultError(rawResult);
        const rawResultFailureKind = resolveToolResultFailureKind(rawResult);
        const middlewareResult = await middlewareRunner.applyToolResultMiddleware({
          threadId: call.threadId,
          turnId: call.turnId,
          toolCallId: call.callId,
          toolName,
          args: structuredClone(executedArgs),
          isError: rawIsError,
          result: rawResult,
        });
        const result = await legacyExtensionRunner.applyToolResultExtensions({
          threadId: call.threadId,
          turnId: call.turnId,
          toolCallId: call.callId,
          toolName,
          args: structuredClone(executedArgs),
          result: middlewareResult,
        });
        const resultIsError = rawIsError || isCodexToolResultError(result);
        const finalResultFailureKind = resolveToolResultFailureKind(result);
        const resultFailureKind = rawResultFailureKind ?? finalResultFailureKind;
        const observerResult =
          rawResultFailureKind && finalResultFailureKind !== rawResultFailureKind
            ? {
                ...result,
                details: {
                  ...(isRecord(result.details) ? result.details : {}),
                  status: rawResultFailureKind,
                },
              }
            : result;
        notifyAgentToolResult(options?.onAgentToolResult, toolName, observerResult, resultIsError);
        runAgentHarnessAfterToolCallHook({
          toolName,
          toolCallId: call.callId,
          runId: toolResultHookContext.runId,
          agentId: toolResultHookContext.agentId,
          sessionId: toolResultHookContext.sessionId,
          sessionKey: toolResultHookContext.sessionKey,
          channelId: toolResultHookContext.channelId,
          startArgs: executedArgs,
          result,
          startedAt,
        });
        finalizeToolTerminalPresentation({
          toolCallId: call.callId,
          runId: toolResultHookContext.runId,
          result,
          isError: resultIsError,
          observer: params.hookContext?.onToolOutcome,
          toolName,
          toolCallOrdinal: options?.toolCallOrdinal,
        });
        const messagingTelemetryArgs = applyCurrentMessageProvider(
          toolName,
          executedArgs,
          params.hookContext?.currentChannelProvider,
        );
        const messagingTarget = isMessagingTool(toolName)
          ? extractMessagingToolSend(toolName, messagingTelemetryArgs, messagingContext)
          : void 0;
        const confirmedMessagingTarget =
          !rawIsError && messagingTarget
            ? extractMessagingToolSendResult(messagingTarget, telemetryRawResult)
            : messagingTarget;
        const terminalType =
          resultFailureKind === "blocked" ? "blocked" : resultIsError ? "error" : "completed";
        const contentItems = convertToolContents(result.content, toolResultMaxChars);
        const deliveredFrameImages = contentItems.filter((item) => item.type === "inputImage");
        const finalFrameImageIdentity = computerFrameImageIdentity(result.content);
        if (
          toolName === "computer" &&
          params.computerContextEpoch?.frameToolCallId === call.callId &&
          (deliveredFrameImages.length !== 1 ||
            finalFrameImageIdentity === void 0 ||
            finalFrameImageIdentity !== params.computerContextEpoch.frameImageIdentity)
        )
          invalidateComputerFrame(params.computerContextEpoch);
        const response = withDiagnosticTerminalType(
          {
            contentItems,
            success: !resultIsError,
          },
          terminalType,
        );
        withDiagnosticFailureDisposition(response, resultFailureKind);
        const blocksSourceReplyTermination = hasExplicitNonSourceMessageRoute(
          executedArgs,
          params.hookContext,
          confirmedMessagingTarget,
        );
        const deliveredSourceReply = isDeliveredMessageToolOnlySourceReplyResult({
          sourceReplyDeliveryMode: params.hookContext?.sourceReplyDeliveryMode,
          toolName,
          args: executedArgs,
          result,
          hookResult: rawResult,
          isError: resultIsError,
          allowExplicitSourceRoute: !blocksSourceReplyTermination,
        });
        const receiptConfirmedSourceReply =
          params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" &&
          toolName === "message" &&
          normalizeRouteToken(
            typeof executedArgs.action === "string" ? executedArgs.action : void 0,
          ) === "reply" &&
          !resultIsError &&
          !blocksSourceReplyTermination &&
          isDeliveredMessagingToolResult({
            toolName,
            args: executedArgs,
            result,
            hookResult: rawResult,
            isError: resultIsError,
          }) &&
          (replyReceiptMatchesCurrentMessage(rawResult, params.hookContext) ||
            replyReceiptMatchesCurrentMessage(result, params.hookContext));
        const toolConfirmedSourceReply =
          params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" &&
          toolName === "message" &&
          !resultIsError &&
          (rawResult.terminate === true || result.terminate === true);
        const hasExplicitFinalControl = typeof executedArgs.final === "boolean";
        const sourceReplyFinal =
          params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" &&
          toolName === "message" &&
          (toolConfirmedSourceReply || deliveredSourceReply || receiptConfirmedSourceReply)
            ? hasExplicitFinalControl
              ? executedArgs.final === true
              : true
            : void 0;
        collectToolTelemetry({
          toolName,
          args: executedArgs,
          result,
          mediaTrustResult: telemetryRawResult,
          telemetry,
          isError: resultIsError,
          messagingTarget: confirmedMessagingTarget,
          sourceReplyFinal,
        });
        if (deliveredSourceReply || receiptConfirmedSourceReply || toolConfirmedSourceReply)
          telemetry.didDeliverSourceReplyViaMessageTool = true;
        withDynamicToolTermination(
          response,
          ((rawResult.terminate === true || result.terminate === true) &&
            !(
              params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" &&
              toolName === "message" &&
              executedArgs.final === false
            )) ||
            isToolResultYield(rawResult) ||
            isToolResultYield(result) ||
            ((deliveredSourceReply || receiptConfirmedSourceReply) && executedArgs.final !== false),
        );
        const asyncStarted =
          isAsyncStartedToolResult(rawResult) || isAsyncStartedToolResult(result);
        withDynamicToolAsyncStarted(response, asyncStarted);
        return withSideEffectEvidence(
          response,
          !(
            executionPrevented ||
            (!asyncStarted &&
              isReplaySafeToolInstance(toolEntry.tool) &&
              isReplaySafeToolCall(toolName, executedArgs))
          ),
        );
      } catch (error) {
        if (toolName === "computer" && params.computerContextEpoch?.frameToolCallId === call.callId)
          invalidateComputerFrame(params.computerContextEpoch);
        const executionDisposition =
          getBeforeToolCallFailureDisposition(error) ??
          (signal.aborted
            ? resolveCodexToolAbortTerminalReason(signal)
            : resolveToolExecutionErrorKind(error));
        const errorMessage = formatToolExecutionErrorMessage(
          error,
          "OpenClaw dynamic tool call failed.",
        );
        const adjustedExecutedArgs = consumeAdjustedParamsForToolCall(
          call.callId,
          toolResultHookContext.runId,
        );
        if (isRecord(adjustedExecutedArgs)) executedArgs = structuredClone(adjustedExecutedArgs);
        executionPrevented =
          executionPrevented ||
          consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
        const failedResult = failedToolResult(errorMessage, executionDisposition);
        finalizeToolTerminalPresentation({
          toolCallId: call.callId,
          runId: toolResultHookContext.runId,
          result: failedResult,
          isError: true,
          observer: params.hookContext?.onToolOutcome,
          toolName,
          toolCallOrdinal: options?.toolCallOrdinal,
        });
        notifyAgentToolResult(options?.onAgentToolResult, toolName, failedResult, true);
        collectToolTelemetry({
          toolName,
          args: executedArgs,
          result: void 0,
          telemetry,
          isError: true,
        });
        runAgentHarnessAfterToolCallHook({
          toolName,
          toolCallId: call.callId,
          runId: toolResultHookContext.runId,
          agentId: toolResultHookContext.agentId,
          sessionId: toolResultHookContext.sessionId,
          sessionKey: toolResultHookContext.sessionKey,
          channelId: toolResultHookContext.channelId,
          startArgs: executedArgs,
          error: errorMessage,
          startedAt,
        });
        const replaySafe =
          !didStartExecution ||
          executionPrevented ||
          (isReplaySafeToolInstance(toolEntry.tool) &&
            isReplaySafeToolCall(toolName, executedArgs));
        return withSideEffectEvidence(
          withDiagnosticFailureDisposition(
            {
              contentItems: [
                {
                  type: "inputText",
                  text: errorMessage,
                },
              ],
              success: false,
            },
            executionDisposition,
          ),
          didStartExecution && !replaySafe,
        );
      }
    },
  };
}
function notifyAgentToolResult(observer, toolName, result, isError) {
  try {
    observer?.({
      toolName,
      result: sanitizeToolResult(result),
      isError,
    });
  } catch (error) {
    log.warn(`onAgentToolResult handler failed: tool=${toolName} error=${String(error)}`);
  }
}
function failedToolResult(message, status = "failed") {
  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
    details: {
      status,
      error: message,
    },
  };
}
function wrapProjectedCodexDynamicTools(tools, hookContext) {
  const wrappedTools = [];
  const quarantinedTools = [];
  for (const entry of tools)
    try {
      if (isToolWrappedWithBeforeToolCallHook(entry.tool)) {
        setBeforeToolCallDiagnosticsEnabled(entry.tool, false);
        wrappedTools.push(entry);
        continue;
      }
      wrappedTools.push({
        ...entry,
        tool: wrapToolWithBeforeToolCallHook(entry.tool, hookContext, { emitDiagnostics: false }),
      });
    } catch {
      quarantinedTools.push({
        tool: entry.name,
        violations: [`${entry.name} could not be wrapped for before-tool-call hooks`],
      });
    }
  return {
    tools: wrappedTools,
    quarantinedTools,
  };
}
function createCodexDynamicToolSpecs(params) {
  const specs = [];
  const namespaceTools = [];
  const directOnlyNamespaceTools = [];
  for (const entry of params.entries) {
    const functionSpec = createCodexDynamicToolFunctionSpec({ entry });
    if (entry.name === "crestodian" && params.directToolNames.has(entry.name)) {
      specs.push(functionSpec);
      continue;
    }
    if (entry.tool.catalogMode === "direct-only") {
      directOnlyNamespaceTools.push(functionSpec);
      continue;
    }
    if (params.loading === "direct" || params.directToolNames.has(entry.name)) {
      specs.push(functionSpec);
      continue;
    }
    namespaceTools.push({
      ...functionSpec,
      deferLoading: true,
    });
  }
  if (namespaceTools.length > 0)
    specs.push({
      type: "namespace",
      name: CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE,
      description: "",
      tools: namespaceTools,
    });
  if (directOnlyNamespaceTools.length > 0)
    specs.push({
      type: "namespace",
      name: CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE,
      description: "",
      tools: directOnlyNamespaceTools,
    });
  return specs;
}
function createCodexDynamicToolFunctionSpec(params) {
  return {
    type: "function",
    name: params.entry.name,
    description: params.entry.description,
    inputSchema: params.entry.inputSchema,
  };
}
function projectCodexDynamicTools(tools) {
  const projectedTools = [];
  const quarantinedTools = [];
  let length;
  try {
    length = tools.length;
  } catch {
    return {
      tools: [],
      quarantinedTools: [
        {
          tool: "tool[0]",
          violations: ["tool[0] is unreadable"],
        },
      ],
    };
  }
  for (let toolIndex = 0; toolIndex < length; toolIndex += 1) {
    let tool;
    try {
      tool = tools[toolIndex];
    } catch {
      quarantinedTools.push({
        tool: `tool[${toolIndex}]`,
        violations: [`tool[${toolIndex}] is unreadable`],
      });
      continue;
    }
    const descriptor = readCodexDynamicToolDescriptor(tool, toolIndex);
    if (!descriptor.ok) {
      quarantinedTools.push(descriptor.diagnostic);
      continue;
    }
    const projection = projectRuntimeToolInputSchema(
      descriptor.parameters,
      `${descriptor.name}.inputSchema`,
    );
    if (projection.violations.length > 0) {
      quarantinedTools.push({
        tool: descriptor.name,
        violations: projection.violations,
      });
      continue;
    }
    projectedTools.push({
      tool,
      name: descriptor.name,
      description: descriptor.description,
      inputSchema: projection.schema,
    });
  }
  return {
    tools: projectedTools,
    quarantinedTools,
  };
}
function readCodexDynamicToolDescriptor(tool, toolIndex) {
  const fallbackName = `tool[${toolIndex}]`;
  let name;
  try {
    const rawName = tool.name;
    if (typeof rawName !== "string" || !rawName)
      return {
        ok: false,
        diagnostic: {
          tool: fallbackName,
          violations: [`${fallbackName}.name must be a non-empty string`],
        },
      };
    name = rawName;
  } catch {
    return {
      ok: false,
      diagnostic: {
        tool: fallbackName,
        violations: [`${fallbackName}.name is unreadable`],
      },
    };
  }
  let description;
  try {
    description = typeof tool.description === "string" ? tool.description : "";
  } catch {
    return {
      ok: false,
      diagnostic: {
        tool: name,
        violations: [`${name}.description is unreadable`],
      },
    };
  }
  let parameters;
  try {
    parameters = tool.parameters;
  } catch {
    return {
      ok: false,
      diagnostic: {
        tool: name,
        violations: [`${name}.inputSchema is unreadable`],
      },
    };
  }
  return {
    ok: true,
    name,
    description,
    parameters,
  };
}
function warnQuarantinedDynamicTools(tools) {
  if (tools.length === 0) return;
  const unique = /* @__PURE__ */ new Map();
  for (const tool of tools) unique.set(tool.tool, tool.violations);
  log.warn(
    `codex app-server quarantined ${unique.size} dynamic ${unique.size === 1 ? "tool" : "tools"} with unsupported input schemas: ${[...unique.keys()].join(", ")}`,
    {
      tools: [...unique.entries()].map(([tool, violations]) => ({
        tool,
        violations,
      })),
    },
  );
}
function emitQuarantinedDynamicToolDiagnostics(tools, ctx) {
  for (const tool of tools)
    emitTrustedDiagnosticEvent({
      type: "tool.execution.blocked",
      agentId: ctx?.agentId,
      runId: ctx?.runId,
      sessionId: ctx?.sessionId,
      sessionKey: ctx?.sessionKey,
      toolName: tool.tool,
      deniedReason: "unsupported_tool_schema",
      reason: tool.violations.join(", "),
    });
}
function dedupeQuarantinedDynamicTools(tools) {
  return [
    ...new Map(
      tools.map((tool) => [
        tool.tool,
        {
          tool: tool.tool,
          violations: tool.violations,
        },
      ]),
    ).values(),
  ];
}
function toToolResultHookContext(ctx) {
  const { agentId, sessionId, sessionKey, runId, channelId } = ctx ?? {};
  return {
    ...(agentId && { agentId }),
    ...(sessionId && { sessionId }),
    ...(sessionKey && { sessionKey }),
    ...(runId && { runId }),
    ...(channelId && { channelId }),
  };
}
function resolveCodexDynamicToolResultMaxChars(ctx) {
  return (
    resolveAgentContextLimitValue({
      config: ctx?.config,
      agentId: ctx?.agentId,
      key: "toolResultMaxChars",
    }) ?? DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS
  );
}
function composeAbortSignals(...signals) {
  const activeSignals = signals.filter((signal) => Boolean(signal));
  if (activeSignals.length === 0) return new AbortController().signal;
  if (activeSignals.length === 1)
    return expectDefined(activeSignals[0], "single active Codex abort signal");
  return AbortSignal.any(activeSignals);
}
function collectToolTelemetry(params) {
  if (params.isError) return;
  if (!params.isError && params.toolName === "cron" && isCronAddAction(params.args))
    params.telemetry.successfulCronAdds = (params.telemetry.successfulCronAdds ?? 0) + 1;
  if (!params.isError && params.toolName === "heartbeat_respond") {
    const response = normalizeHeartbeatToolResponse(params.result?.details);
    if (response) params.telemetry.heartbeatToolResponse = response;
  }
  if (!params.isError && params.result) {
    const media = extractToolResultMediaArtifact(params.result);
    if (media) {
      const mediaUrls = filterToolResultMediaUrls(
        params.toolName,
        media.mediaUrls,
        params.mediaTrustResult ?? params.result,
      );
      const seen = new Set(params.telemetry.toolMediaUrls);
      for (const mediaUrl of mediaUrls)
        if (!seen.has(mediaUrl)) {
          seen.add(mediaUrl);
          params.telemetry.toolMediaUrls.push(mediaUrl);
        }
      if (media.audioAsVoice) params.telemetry.toolAudioAsVoice = true;
    }
  }
  if (!isMessagingTool(params.toolName)) return;
  const isMessagingSendAction = isMessagingToolSendAction(params.toolName, params.args);
  if (!isMessagingSendAction && !params.messagingTarget) return;
  if (
    !isMessagingSendAction &&
    !isDeliveredMessagingToolResult({
      toolName: params.toolName,
      args: params.args,
      result: params.result,
      hookResult: params.mediaTrustResult,
      isError: params.isError,
    })
  )
    return;
  params.telemetry.didSendViaMessagingTool = true;
  const sourceReplyPayload = extractInternalSourceReplyPayload(params.result?.details);
  if (sourceReplyPayload) {
    params.telemetry.messagingToolSourceReplyPayloads.push({
      ...sourceReplyPayload,
      ...(params.sourceReplyFinal !== void 0 ? { sourceReplyFinal: params.sourceReplyFinal } : {}),
    });
    return;
  }
  const text = readFirstString(params.args, ["text", "message", "body", "content"]);
  if (text) params.telemetry.messagingToolSentTexts.push(text);
  const mediaUrls = collectMediaUrls(params.args);
  params.telemetry.messagingToolSentMediaUrls.push(...mediaUrls);
  params.telemetry.messagingToolSentTargets.push({
    ...(params.messagingTarget ?? {
      tool: params.toolName,
      provider: readFirstString(params.args, ["provider", "channel"]) ?? params.toolName,
      accountId: readFirstString(params.args, ["accountId", "account_id"]),
      to: readFirstString(params.args, ["to", "target", "recipient"]),
      threadId: readFirstString(params.args, ["threadId", "thread_id", "messageThreadId"]),
    }),
    ...(text ? { text } : {}),
    ...(mediaUrls.length > 0 ? { mediaUrls } : {}),
    ...(params.sourceReplyFinal !== void 0 ? { sourceReplyFinal: params.sourceReplyFinal } : {}),
  });
}
function extractInternalSourceReplyPayload(details) {
  if (!isRecord(details) || details.sourceReplySink !== "internal-ui") return;
  const rawPayload = details.sourceReply;
  if (!isRecord(rawPayload)) return;
  const text = readFirstString(rawPayload, ["text", "message"]);
  const mediaUrls = collectMediaUrls(rawPayload);
  const mediaUrl =
    typeof rawPayload.mediaUrl === "string" && rawPayload.mediaUrl.trim()
      ? rawPayload.mediaUrl.trim()
      : mediaUrls[0];
  const payload = {
    ...(text ? { text } : {}),
    ...(mediaUrl ? { mediaUrl } : {}),
    ...(mediaUrls.length > 0 ? { mediaUrls } : {}),
    ...(rawPayload.audioAsVoice === true ? { audioAsVoice: true } : {}),
    ...(isRecord(rawPayload.presentation) ? { presentation: rawPayload.presentation } : {}),
    ...(isRecord(rawPayload.interactive) ? { interactive: rawPayload.interactive } : {}),
    ...(isRecord(rawPayload.channelData) ? { channelData: rawPayload.channelData } : {}),
    ...(typeof details.idempotencyKey === "string" && details.idempotencyKey.trim()
      ? { idempotencyKey: details.idempotencyKey.trim() }
      : {}),
  };
  return text || mediaUrls.length > 0 || payload.presentation || payload.interactive
    ? payload
    : void 0;
}
function isCodexToolResultError(result) {
  if (isToolResultError(result)) return true;
  const details = result.details;
  if (!isRecord(details)) return false;
  if (details.ok === true || details.success === true) return false;
  if (details.timedOut === true) return true;
  if (typeof details.exitCode === "number" && details.exitCode !== 0) return true;
  if (typeof details.status !== "string") return false;
  const status = details.status.trim().toLowerCase();
  return (
    status !== "" &&
    status !== "0" &&
    status !== "ok" &&
    status !== "success" &&
    status !== "completed" &&
    status !== "recorded" &&
    status !== "created" &&
    status !== "updated" &&
    status !== "accepted" &&
    status !== "found" &&
    status !== "missing" &&
    status !== "pending" &&
    status !== "started" &&
    status !== "running" &&
    status !== "yielded"
  );
}
function isToolResultYield(result) {
  const details = result.details;
  if (!isRecord(details) || typeof details.status !== "string") return false;
  return details.status.trim().toLowerCase() === "yielded";
}
function isAsyncStartedToolResult(result) {
  const details = result.details;
  return isRecord(details) && details.async === true && details.status === "started";
}
function withDiagnosticTerminalType(response, terminalType) {
  Object.defineProperty(response, "diagnosticTerminalType", {
    configurable: true,
    enumerable: false,
    value: terminalType,
  });
  return response;
}
function withDiagnosticFailureDisposition(response, disposition) {
  if (!disposition) return response;
  withDiagnosticTerminalType(response, disposition === "blocked" ? "blocked" : "error");
  if (disposition !== "blocked")
    Object.defineProperty(response, "diagnosticTerminalReason", {
      configurable: true,
      enumerable: false,
      value: disposition,
    });
  return response;
}
function withSideEffectEvidence(response, sideEffectEvidence) {
  if (!sideEffectEvidence) return response;
  Object.defineProperty(response, "sideEffectEvidence", {
    configurable: true,
    enumerable: false,
    value: true,
  });
  return response;
}
function withDynamicToolTermination(response, terminate) {
  if (!terminate) return response;
  Object.defineProperty(response, "terminate", {
    configurable: true,
    enumerable: false,
    value: true,
  });
  return response;
}
function withDynamicToolAsyncStarted(response, asyncStarted) {
  if (!asyncStarted) return response;
  Object.defineProperty(response, "asyncStarted", {
    configurable: true,
    enumerable: false,
    value: true,
  });
  return response;
}
function normalizeToolResultMaxChars(maxChars) {
  return typeof maxChars === "number" && Number.isFinite(maxChars) && maxChars > 0
    ? Math.floor(maxChars)
    : DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS;
}
function convertToolContents(
  content,
  toolResultMaxChars = DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS,
) {
  const maxChars = normalizeToolResultMaxChars(toolResultMaxChars);
  const totalTextChars = content.reduce(
    (total, item) => total + (item.type === "text" ? item.text.length : 0),
    0,
  );
  if (totalTextChars <= maxChars) return content.flatMap(convertToolContent);
  const noticeText = `...(OpenClaw truncated dynamic tool result: original ${totalTextChars} chars, showing ${maxChars}; rerun with narrower args.)`;
  const notice = `\n${noticeText}`;
  let remainingTextBudget = Math.max(0, maxChars - notice.length);
  let appendedNotice = false;
  const output = [];
  for (const item of content) {
    if (item.type !== "text") {
      output.push(...convertToolContent(item));
      continue;
    }
    if (appendedNotice) continue;
    if (notice.length >= maxChars) {
      output.push({
        type: "inputText",
        text: truncateUtf16Safe(noticeText, maxChars),
      });
      appendedNotice = true;
      continue;
    }
    const sliceLength = Math.min(item.text.length, remainingTextBudget);
    remainingTextBudget -= sliceLength;
    const shouldAppendNotice = remainingTextBudget <= 0;
    const text = truncateUtf16Safe(item.text, sliceLength);
    if (shouldAppendNotice) {
      output.push({
        type: "inputText",
        text: `${text.trimEnd()}${notice}`,
      });
      appendedNotice = true;
    } else if (text.length > 0)
      output.push({
        type: "inputText",
        text,
      });
  }
  if (!appendedNotice)
    output.push({
      type: "inputText",
      text: truncateUtf16Safe(noticeText, maxChars),
    });
  return output;
}
function convertToolContent(content) {
  if (content.type === "text")
    return [
      {
        type: "inputText",
        text: content.text,
      },
    ];
  const imageUrl = sanitizeInlineImageDataUrl(`data:${content.mimeType};base64,${content.data}`);
  if (!imageUrl)
    return [
      {
        type: "inputText",
        text: invalidInlineImageText("codex dynamic tool"),
      },
    ];
  return [
    {
      type: "inputImage",
      imageUrl,
    },
  ];
}
function jsonObjectToRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function readFirstString(record, keys) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
}
function collectMediaUrls(record) {
  const urls = [];
  const pushMediaUrl = (value) => {
    if (typeof value === "string" && value.trim()) urls.push(value.trim());
  };
  const pushAttachment = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const attachment = value;
    for (const key of ["media", "mediaUrl", "path", "filePath", "fileUrl", "url"])
      pushMediaUrl(attachment[key]);
  };
  for (const key of [
    "media",
    "mediaUrl",
    "media_url",
    "path",
    "filePath",
    "fileUrl",
    "imageUrl",
    "image_url",
  ]) {
    const value = record[key];
    pushMediaUrl(value);
  }
  for (const key of ["mediaUrls", "media_urls", "imageUrls", "image_urls"]) {
    const value = record[key];
    if (!Array.isArray(value)) continue;
    for (const entry of value) pushMediaUrl(entry);
  }
  const attachments = record.attachments;
  if (Array.isArray(attachments)) for (const attachment of attachments) pushAttachment(attachment);
  return urls;
}
function isCronAddAction(args) {
  const action = args.action;
  return typeof action === "string" && action.trim().toLowerCase() === "add";
}
//#endregion
export {
  shouldBlockTerminalReleaseForNonTerminalDynamicToolResult as $,
  CodexNativeToolLifecycleProjector as A,
  buildCodexNativeHookRelayDisabledConfig as B,
  resolveCodexMessageToolProvider as C,
  shouldWarnCodexDynamicToolBuildStageSummary as D,
  shouldRequireCodexSandboxExecServerEnvironment as E,
  sanitizeCodexToolResponse as F,
  scheduleCodexNativeHookRelayUnregister as G,
  emitCodexNativePreToolUseFailureDiagnostic as H,
  readCodexMirroredSessionHistoryMessages as I,
  hasPendingDynamicToolTerminalDiagnostic as J,
  resolveCodexLocalRuntimeAttribution as K,
  CODEX_NATIVE_HOOK_RELAY_EVENTS as L,
  inferCodexDynamicToolMeta as M,
  resolveCodexToolProgressDetailMode as N,
  filterToolsForVisionInputs as O,
  sanitizeCodexToolArguments as P,
  resolveTerminalDynamicToolBatchAction as Q,
  CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS as R,
  resolveCodexExternalSandboxPolicyForOpenClawSandbox as S,
  shouldEnableCodexAppServerNativeToolSurface as T,
  resolveCodexNativeHookRelayEvents as U,
  createCodexNativeHookRelay as V,
  resolveCodexNativeHookRelayTtlMs as W,
  isMatchingDynamicToolTerminalDiagnostic as X,
  isDynamicToolTerminalDiagnosticEvent as Y,
  resolveDynamicToolCallTimeoutMs as Z,
  createCodexDynamicToolBuildStageTracker as _,
  emitDynamicToolStartedDiagnostic as a,
  resolveCodexAppServerExecutionCwd as b,
  resolveCodexProviderWebSearchSupportForClient as c,
  resolveCodexStartupTimeoutMs as d,
  shouldReleaseTurnAfterTerminalDynamicTool as et,
  resolveCodexTurnAssistantCompletionIdleTimeoutMs as f,
  buildDynamicTools as g,
  withCodexStartupTimeout as h,
  emitDynamicToolErrorDiagnostic as i,
  shouldEmitTranscriptToolProgress as j,
  CodexAppServerEventProjector as k,
  CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS as l,
  resolveCodexTurnTerminalIdleTimeoutMs as m,
  handleCodexAppServerApprovalRequest as n,
  toCodexDynamicToolProtocolResponse as nt,
  emitDynamicToolTerminalDiagnostic as o,
  resolveCodexTurnCompletionIdleTimeoutMs as p,
  handleDynamicToolCallWithTimeout as q,
  handleCodexAppServerElicitationRequest as r,
  resolveCodexToolAbortTerminalReason as rt,
  resolveCodexProviderWebSearchSupport as s,
  createCodexDynamicToolBridge as t,
  toCodexDynamicToolProgressResponse as tt,
  resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs as u,
  disableCodexPluginThreadConfig as v,
  resolveCodexSandboxEnvironmentSelection as w,
  resolveCodexAppServerHookChannelId as x,
  formatCodexDynamicToolBuildStageSummary as y,
  buildCodexNativeHookRelayConfig as z,
};
