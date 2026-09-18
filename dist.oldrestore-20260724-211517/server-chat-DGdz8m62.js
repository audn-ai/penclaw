import { performance } from "node:perf_hooks";
import "./agent-scope-y9xQv_q1.js";
import {
  f as getAgentEventLifecycleGeneration,
  m as getAgentRunContextOwnerStatus,
  p as getAgentRunContext,
} from "./agent-events-D4UsOPeT.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C_WnQaQy.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { o as resolveAssistantEventPhase } from "./chat-message-content-CeBHi_A4.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./thinking-CVcRbjTC.js";
import {
  d as resolveFailoverReasonFromError,
  u as isTimeoutError,
} from "./failover-error-CYvhrluQ.js";
import { d as stripHeartbeatToken } from "./heartbeat-Bkwxbekw.js";
import { t as resolveHeartbeatVisibility } from "./heartbeat-visibility-BWEWr0c7.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  a as shouldSuppressAssistantEventForLiveChat,
  i as resolveMergedAssistantText,
  n as projectLiveAssistantBufferedText,
  r as resolveAssistantLiveChatInput,
  t as normalizeLiveAssistantBufferedText,
} from "./live-chat-projector-DKETpCbK.js";
import { n as logError } from "./logger-BegyOJlO.js";
import {
  a as createChatRunState,
  c as createToolEventRecipientRegistry,
  i as createChatRunRegistry,
  l as isChatAbortMarkerCurrent,
  n as createChatAbortMarker,
  o as createSessionEventSubscriberRegistry,
  s as createSessionMessageSubscriberRegistry,
} from "./server-chat-state-BIl6X0N8.js";
import {
  a as isSubagentSessionKey,
  l as parseCronRunScopeSuffix,
  n as isAcpSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  i as persistGatewaySessionLifecycleEvent,
  n as isRestartRecoveryLifecycleEvent,
  r as isStaleLifecycleEventForSession,
  t as deriveGatewaySessionLifecycleProjectionPatch,
} from "./session-lifecycle-state-BVFexA53.js";
import { l as loadGatewaySessionRow, u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import { u as normalizeVerboseLevel } from "./thinking.shared-BWnbgBUO.js";
import { t as setSafeTimeout } from "./timer-delay-Bw3nwNkv.js";
import { a as resolveToolSearchCodeDisplayTarget } from "./tool-display-common-8NL7TvdJ.js";
import { r as readToolValidationErrorSummary } from "./tool-error-summary-DDV0ZoKC.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-chat.ts
function projectToolSearchCodeEventForChannelPayload(payload) {
  const data = payload.data;
  if (!data || typeof data !== "object") return payload;
  const record = data;
  if (record.name !== "tool_search_code") return payload;
  const target = resolveToolSearchCodeDisplayTarget(record.args);
  if (!target) return payload;
  const projectedName = target.displayToolName ?? target.toolName;
  if (!projectedName || projectedName === "tool_search_code") return payload;
  const projectedData = {
    ...record,
    name: projectedName,
  };
  if (target.displayArgs) projectedData.args = target.displayArgs;
  else if (target.detail) projectedData.args = { detail: target.detail };
  if (target.bridgeVerb) {
    projectedData.bridgeToolName = "tool_search_code";
    projectedData.bridgeTargetToolName = target.toolName;
    projectedData.bridgeVerb = target.bridgeVerb;
  }
  return {
    ...payload,
    data: projectedData,
  };
}
function resolveHeartbeatAckMaxChars() {
  try {
    const cfg = getRuntimeConfig();
    return Math.max(0, cfg.agents?.defaults?.heartbeat?.ackMaxChars ?? 300);
  } catch {
    return 300;
  }
}
function resolveHeartbeatContext(runId, sourceRunId) {
  const primary = getAgentRunContext(runId);
  if (primary?.isHeartbeat) return primary;
  if (sourceRunId && sourceRunId !== runId) {
    const source = getAgentRunContext(sourceRunId);
    if (source?.isHeartbeat) return source;
  }
  return primary;
}
/**
 * Check if heartbeat ACK/noise should be hidden from interactive chat surfaces.
 */
function shouldHideHeartbeatChatOutput(runId, sourceRunId) {
  if (!resolveHeartbeatContext(runId, sourceRunId)?.isHeartbeat) return false;
  try {
    return !resolveHeartbeatVisibility({
      cfg: getRuntimeConfig(),
      channel: "webchat",
    }).showOk;
  } catch {
    return true;
  }
}
function shouldSuppressHeartbeatToolEvents(runId, sourceRunId) {
  return Boolean(resolveHeartbeatContext(runId, sourceRunId)?.isHeartbeat);
}
function shouldMirrorAssistantEventToHiddenSessionMessages(data) {
  if (!data || typeof data !== "object") return false;
  const record = data;
  const hasText = typeof record.text === "string" && record.text.length > 0;
  const hasDelta = typeof record.delta === "string" && record.delta.length > 0;
  if (!hasText && !hasDelta) return false;
  return resolveAssistantEventPhase(data) === "commentary";
}
function shouldMirrorAgentEventToHiddenSessionMessages(evt) {
  return evt.stream === "thinking" || evt.stream === "approval" || evt.stream === "lifecycle";
}
function normalizeHeartbeatChatFinalText(params) {
  if (!shouldHideHeartbeatChatOutput(params.runId, params.sourceRunId))
    return {
      suppress: false,
      text: params.text,
    };
  const stripped = stripHeartbeatToken(params.text, {
    mode: "heartbeat",
    maxAckChars: resolveHeartbeatAckMaxChars(),
  });
  if (!stripped.didStrip)
    return {
      suppress: false,
      text: params.text,
    };
  if (stripped.shouldSkip)
    return {
      suppress: true,
      text: "",
    };
  return {
    suppress: false,
    text: stripped.text,
  };
}
/**
 * Keep this aligned with the agent.wait lifecycle-error grace so chat surfaces
 * do not finalize a run before fallback or retry reuses the same runId.
 */
const AGENT_LIFECYCLE_ERROR_RETRY_GRACE_MS = 15e3;
const CHAT_ERROR_KINDS = /* @__PURE__ */ new Set([
  "refusal",
  "timeout",
  "rate_limit",
  "context_length",
  "unknown",
]);
function buildChatErrorMessage(error) {
  const raw = error ? formatForLog(error).trim() : "";
  if (!raw) return;
  return {
    role: "assistant",
    content: [
      {
        type: "text",
        text: raw.startsWith("⚠️") || raw.startsWith("Error:") ? raw : `Error: ${raw}`,
      },
    ],
    timestamp: Date.now(),
  };
}
function readChatErrorKind(value) {
  return typeof value === "string" && CHAT_ERROR_KINDS.has(value) ? value : void 0;
}
function resolveChatErrorKindFromError(error) {
  if (error === void 0) return;
  const message = formatErrorMessage(error).toLowerCase();
  if (
    message.includes("refusal") ||
    message.includes("content_filter") ||
    message.includes("sensitive") ||
    message.includes("unhandled stop reason: refusal_policy")
  )
    return "refusal";
  const reason = resolveFailoverReasonFromError(error);
  if (reason === "rate_limit" || reason === "overloaded") return "rate_limit";
  if (reason === "context_overflow") return "context_length";
  return isTimeoutError(error) ? "timeout" : void 0;
}
function excludeConnIds(connIds, excludedConnIds) {
  if (!excludedConnIds || excludedConnIds.size === 0 || connIds.size === 0) return connIds;
  const filtered = /* @__PURE__ */ new Set();
  for (const connId of connIds) if (!excludedConnIds.has(connId)) filtered.add(connId);
  return filtered;
}
function resolveBroadcastDelta(params) {
  if (!params.text) return;
  const previous = params.previousBroadcastText;
  if (previous === void 0) return { deltaText: params.text };
  if (!params.text.startsWith(previous))
    return {
      deltaText: params.text,
      replace: true,
    };
  const deltaText = params.text.slice(previous.length);
  return deltaText ? { deltaText } : void 0;
}
function roundedChatSendTimingMs(value) {
  return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function createAgentEventHandler({
  broadcast,
  broadcastToConnIds,
  nodeSendToSession,
  agentRunSeq,
  chatRunState,
  resolveSessionKeyForRun,
  clearAgentRunContext,
  toolEventRecipients,
  sessionEventSubscribers,
  sessionMessageSubscribers,
  loadGatewaySessionRowForSnapshot = loadGatewaySessionRow,
  lifecycleErrorRetryGraceMs = AGENT_LIFECYCLE_ERROR_RETRY_GRACE_MS,
  isChatSendRunActive = () => false,
  clearTrackedActiveRun,
  markTrackedRunTerminalPersisted,
  trackTrackedRunTerminalPersistence,
  resolveActiveLifecycleGenerationForRun = () => void 0,
  updateRunToolErrorSummary,
  resolveSessionActiveRunState,
}) {
  const shouldProcessOwnedEvent = (evt) => {
    const claimId = evt.contextClaimId;
    if (!claimId) return true;
    const lifecycleGeneration = evt.lifecycleGeneration;
    if (!lifecycleGeneration || lifecycleGeneration !== getAgentEventLifecycleGeneration())
      return false;
    return getAgentRunContextOwnerStatus(evt.runId, claimId, lifecycleGeneration) === "active";
  };
  const clearRunContextForEvent = (evt) => {
    if (evt.contextClaimId) {
      clearAgentRunContext(evt.runId, evt.lifecycleGeneration, evt.contextClaimId);
      return;
    }
    clearAgentRunContext(evt.runId);
  };
  const pendingTerminalLifecycleErrors = /* @__PURE__ */ new Map();
  const agentTextThrottleKey = (clientRunId, stream) => `${clientRunId}:${stream}`;
  const agentTextThrottleKeys = (clientRunId) => [
    clientRunId,
    agentTextThrottleKey(clientRunId, "assistant"),
    agentTextThrottleKey(clientRunId, "thinking"),
  ];
  const clearBufferedChatState = (clientRunId) => {
    chatRunState.clearRun(clientRunId);
  };
  const clearPendingTerminalLifecycleError = (runId, lifecycleGeneration) => {
    const pending = pendingTerminalLifecycleErrors.get(runId);
    if (!pending) return;
    if (
      lifecycleGeneration &&
      pending.event.lifecycleGeneration &&
      lifecycleGeneration !== pending.event.lifecycleGeneration
    )
      return;
    clearTimeout(pending.timer);
    pendingTerminalLifecycleErrors.delete(runId);
  };
  const resolveRestartRecoveryLifecycleState = (sessionKey, agentId, event) => {
    try {
      const { entry } = loadSessionEntry(sessionKey, {
        ...(agentId ? { agentId } : {}),
        clone: false,
      });
      return {
        suppress: isRestartRecoveryLifecycleEvent({
          entry,
          event,
        }),
      };
    } catch {
      return { suppress: false };
    }
  };
  const spawnedByCache = /* @__PURE__ */ new Map();
  const resolveSpawnedBy = (sessionKey) => {
    if (spawnedByCache.has(sessionKey)) return spawnedByCache.get(sessionKey);
    if (!isSubagentSessionKey(sessionKey) && !isAcpSessionKey(sessionKey)) return null;
    let result = null;
    try {
      result = loadGatewaySessionRow(sessionKey)?.spawnedBy ?? null;
    } catch {}
    spawnedByCache.set(sessionKey, result);
    return result;
  };
  const buildSessionEventSnapshot = (sessionKey, evt, agentId, includeActiveRunState = false) => {
    const row = loadGatewaySessionRowForSnapshot(sessionKey, agentId ? { agentId } : void 0);
    const omitUnscopedGlobalGoal = sessionKey === "global" && !agentId;
    const lifecyclePatch =
      evt &&
      !isStaleLifecycleEventForSession({
        owningSessionId: evt.sessionId,
        currentSessionId: row?.sessionId,
      })
        ? deriveGatewaySessionLifecycleProjectionPatch({
            entry: row
              ? {
                  updatedAt: row.updatedAt ?? void 0,
                  status: row.status,
                  startedAt: row.startedAt,
                  endedAt: row.endedAt,
                  runtimeMs: row.runtimeMs,
                  abortedLastRun: row.abortedLastRun,
                }
              : void 0,
            event: evt,
          })
        : {};
    const activeRunState = includeActiveRunState
      ? resolveSessionActiveRunState?.({
          requestedKey: sessionKey,
          canonicalKey: row?.key ?? sessionKey,
          ...(row?.sessionId ? { sessionId: row.sessionId } : {}),
          ...(agentId ? { agentId } : {}),
        })
      : void 0;
    const activeRunFields = activeRunState
      ? {
          hasActiveRun: activeRunState.active,
          activeRunIds: activeRunState.runIds,
        }
      : {};
    const session = row
      ? {
          ...row,
          ...lifecyclePatch,
          ...activeRunFields,
        }
      : void 0;
    if (session && omitUnscopedGlobalGoal) delete session.goal;
    const snapshotSource = session ?? lifecyclePatch;
    return {
      ...(session ? { session } : {}),
      updatedAt: snapshotSource.updatedAt,
      sessionId: row?.sessionId,
      kind: row?.kind,
      channel: row?.channel,
      subject: row?.subject,
      groupChannel: row?.groupChannel,
      space: row?.space,
      chatType: row?.chatType,
      origin: row?.origin,
      spawnedBy: row?.spawnedBy,
      spawnedWorkspaceDir: row?.spawnedWorkspaceDir,
      spawnedCwd: row?.spawnedCwd,
      forkedFromParent: row?.forkedFromParent,
      spawnDepth: row?.spawnDepth,
      subagentRole: row?.subagentRole,
      subagentControlScope: row?.subagentControlScope,
      label: row?.label,
      displayName: row?.displayName,
      deliveryContext: row?.deliveryContext,
      parentSessionKey: row?.parentSessionKey,
      childSessions: row?.childSessions,
      thinkingLevel: row?.thinkingLevel,
      fastMode: row?.fastMode,
      verboseLevel: row?.verboseLevel,
      traceLevel: row?.traceLevel,
      reasoningLevel: row?.reasoningLevel,
      elevatedLevel: row?.elevatedLevel,
      sendPolicy: row?.sendPolicy,
      systemSent: row?.systemSent,
      inputTokens: row?.inputTokens,
      outputTokens: row?.outputTokens,
      lastChannel: row?.lastChannel,
      lastTo: row?.lastTo,
      lastAccountId: row?.lastAccountId,
      lastThreadId: row?.lastThreadId,
      totalTokens: row?.totalTokens,
      totalTokensFresh: row?.totalTokensFresh,
      ...(omitUnscopedGlobalGoal ? {} : { goal: row?.goal ?? null }),
      contextTokens: row?.contextTokens,
      estimatedCostUsd: row?.estimatedCostUsd,
      responseUsage: row?.responseUsage,
      effectiveResponseUsage: row?.effectiveResponseUsage,
      modelProvider: row?.modelProvider,
      model: row?.model,
      ...activeRunFields,
      status: snapshotSource.status,
      startedAt: snapshotSource.startedAt,
      endedAt: snapshotSource.endedAt,
      runtimeMs: snapshotSource.runtimeMs,
      abortedLastRun: snapshotSource.abortedLastRun,
    };
  };
  const resolveSessionDeliveryKey = (sessionKey, agentId) => {
    if (sessionKey !== "global") return sessionKey;
    return `agent:${agentId ?? resolveDefaultAgentId(getRuntimeConfig())}:global`;
  };
  const resolveNodeSessionDeliveryKeys = (sessionKey, agentId) => {
    if (sessionKey !== "global") return [sessionKey];
    const defaultAgentId = resolveDefaultAgentId(getRuntimeConfig());
    const scopedAgentId = agentId ?? defaultAgentId;
    const keys = [`agent:${scopedAgentId}:global`];
    if (scopedAgentId === defaultAgentId) keys.push("global");
    return keys;
  };
  const sendNodeSessionPayloadForAgent = (sessionKey, event, payload, agentId) => {
    for (const deliverySessionKey of resolveNodeSessionDeliveryKeys(sessionKey, agentId))
      nodeSendToSession(deliverySessionKey, event, payload);
  };
  const emitFirstAssistantChatSendTiming = (chatLink) => {
    const timing = chatLink?.chatSendTiming;
    if (!timing || timing.firstAssistantEventSent) return;
    timing.firstAssistantEventSent = true;
    const nowMs = performance.now();
    broadcastToConnIds(
      "chat.send_timing",
      {
        phase: "first-assistant-event",
        runId: chatLink.clientRunId,
        sessionKey: chatLink.sessionKey,
        ...(chatLink.agentId ? { agentId: chatLink.agentId } : {}),
        ackToPhaseMs: roundedChatSendTimingMs(nowMs - timing.ackedAtMs),
        receivedToPhaseMs: roundedChatSendTimingMs(nowMs - timing.receivedAtMs),
        ...(timing.dispatchStartedAtMs !== void 0
          ? {
              dispatchStartedToPhaseMs: roundedChatSendTimingMs(nowMs - timing.dispatchStartedAtMs),
            }
          : {}),
      },
      /* @__PURE__ */ new Set([timing.connId]),
      { dropIfSlow: true },
    );
  };
  const finalizeLifecycleEvent = (evt, opts) => {
    if (!shouldProcessOwnedEvent(evt)) return;
    const lifecyclePhase =
      evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
    if (lifecyclePhase !== "end" && lifecyclePhase !== "error") return;
    const currentRunContext = getAgentRunContext(evt.runId);
    const activeLifecycleGeneration = resolveActiveLifecycleGenerationForRun(evt.runId);
    const currentLifecycleGeneration =
      activeLifecycleGeneration ?? currentRunContext?.lifecycleGeneration;
    const chatLink = evt.contextClaimId ? void 0 : chatRunState.registry.peek(evt.runId);
    const sessionAgentId = chatLink?.agentId ?? evt.agentId;
    const eventSessionKey =
      evt.deliverySessionKey ??
      (typeof evt.sessionKey === "string" && evt.sessionKey.trim() ? evt.sessionKey : void 0);
    const isControlUiVisible =
      evt.controlUiVisible ?? currentRunContext?.isControlUiVisible ?? true;
    const sessionKey =
      chatLink?.sessionKey ?? eventSessionKey ?? resolveSessionKeyForRun(evt.runId);
    const restartRecoverySessionKey = eventSessionKey ?? sessionKey;
    const restartRecoveryAgentId = evt.agentId ?? sessionAgentId;
    const clientRunId = chatLink?.clientRunId ?? evt.runId;
    const eventRunId = chatLink?.clientRunId ?? evt.runId;
    const isAborted =
      isChatAbortMarkerCurrent(chatRunState.abortedRuns.get(clientRunId), chatLink) ||
      isChatAbortMarkerCurrent(chatRunState.abortedRuns.get(evt.runId), chatLink);
    const lifecycleAborted = evt.data?.aborted === true;
    const deliverySessionKey = sessionKey
      ? resolveSessionDeliveryKey(sessionKey, sessionAgentId)
      : void 0;
    const restartRecoveryState =
      opts?.restartRecoveryState ??
      (restartRecoverySessionKey
        ? resolveRestartRecoveryLifecycleState(
            restartRecoverySessionKey,
            restartRecoveryAgentId,
            evt,
          )
        : void 0);
    const suppressRestartRecoveryProjection =
      opts?.suppressRestartRecoveryProjection === true ||
      Boolean(
        evt.lifecycleGeneration &&
        activeLifecycleGeneration &&
        evt.lifecycleGeneration !== activeLifecycleGeneration,
      ) ||
      restartRecoveryState?.suppress === true;
    if (
      suppressRestartRecoveryProjection &&
      Boolean(
        evt.lifecycleGeneration &&
        currentLifecycleGeneration &&
        evt.lifecycleGeneration !== currentLifecycleGeneration,
      )
    )
      return;
    if (
      !suppressRestartRecoveryProjection &&
      sessionKey &&
      (isControlUiVisible ||
        (deliverySessionKey ? sessionMessageSubscribers.get(deliverySessionKey).size > 0 : false))
    )
      if (!isAborted) {
        const evtStopReason =
          typeof evt.data?.stopReason === "string" ? evt.data.stopReason : void 0;
        const finished = chatLink ? chatRunState.registry.shift(evt.runId) : void 0;
        if (chatLink && !finished) {
          clearRunContextForEvent(evt);
          return;
        }
        const terminalSessionKey = finished?.sessionKey ?? sessionKey;
        const terminalRunId = finished?.clientRunId ?? eventRunId;
        const terminalAgentId = finished?.agentId ?? sessionAgentId;
        const terminalStopReason = evtStopReason ?? (lifecycleAborted ? "aborted" : void 0);
        const terminalOutcome = buildAgentRunTerminalOutcome({
          status: lifecyclePhase === "error" ? "error" : lifecycleAborted ? "timeout" : "ok",
          error: evt.data?.error,
          stopReason: terminalStopReason,
          livenessState: evt.data?.livenessState,
          timeoutPhase: evt.data?.timeoutPhase,
          providerStarted: evt.data?.providerStarted,
          startedAt: evt.data?.startedAt,
          endedAt: evt.data?.endedAt ?? evt.ts,
        });
        const terminalState =
          terminalOutcome.reason === "completed"
            ? "done"
            : terminalOutcome.reason === "cancelled" || terminalOutcome.reason === "aborted"
              ? "aborted"
              : "error";
        if (!(opts?.skipChatErrorFinal && terminalState === "error"))
          emitChatTerminal(
            terminalSessionKey,
            terminalRunId,
            evt.runId,
            evt.seq,
            terminalState,
            terminalOutcome.error ?? evt.data?.error,
            terminalOutcome.stopReason,
            readChatErrorKind(evt.data?.errorKind) ??
              resolveChatErrorKindFromError(evt.data?.error),
            {
              agentId: terminalAgentId,
              controlUiVisible: isControlUiVisible,
              firstAssistantTimingEntry: finished,
              abortErrorMessage: readToolValidationErrorSummary(evt.data?.toolErrorSummary),
            },
          );
      } else {
        clearBufferedChatState(clientRunId);
        if (chatLink) chatRunState.registry.remove(evt.runId, clientRunId, sessionKey);
      }
    toolEventRecipients.markFinal(evt.runId);
    clearBufferedChatState(clientRunId);
    if (suppressRestartRecoveryProjection && chatLink)
      chatRunState.registry.remove(evt.runId, clientRunId, sessionKey);
    clearRunContextForEvent(evt);
    agentRunSeq.delete(evt.runId);
    agentRunSeq.delete(clientRunId);
    if (sessionKey) {
      clearTrackedActiveRun?.({
        runId: evt.runId,
        clientRunId,
        sessionKey,
      });
      if (!suppressRestartRecoveryProjection) {
        const persistence = persistGatewaySessionLifecycleEvent({
          sessionKey,
          agentId: sessionAgentId,
          event: evt,
        });
        trackTrackedRunTerminalPersistence?.({
          runId: evt.runId,
          clientRunId,
          sessionKey,
          sessionId: evt.sessionId,
          observedAt: evt.ts,
          persistence,
        });
        const broadcastSessionChange = (snapshotEvent) => {
          if (parseCronRunScopeSuffix(sessionKey).runId) return;
          const sessionEventConnIds = sessionEventSubscribers.getAll();
          if (sessionEventConnIds.size === 0) return;
          broadcastToConnIds(
            "sessions.changed",
            {
              sessionKey,
              ...(sessionAgentId ? { agentId: sessionAgentId } : {}),
              phase: lifecyclePhase,
              runId: evt.runId,
              ...(eventRunId !== evt.runId ? { clientRunId: eventRunId } : {}),
              ts: evt.ts,
              ...buildSessionEventSnapshot(sessionKey, snapshotEvent, sessionAgentId, true),
            },
            sessionEventConnIds,
            { dropIfSlow: true },
          );
        };
        const markPersisted = () => {
          markTrackedRunTerminalPersisted?.({
            runId: evt.runId,
            clientRunId,
            sessionKey,
          });
        };
        persistence
          .then(() => {
            markPersisted();
            broadcastSessionChange();
          })
          .catch((err) => {
            logError(
              `gateway: terminal session persistence failed session=${formatForLog(sessionKey)} run=${formatForLog(evt.runId)} error=${formatForLog(err)}`,
            );
            broadcastSessionChange(evt);
          });
      }
    }
  };
  const scheduleTerminalLifecycleError = (evt, opts) => {
    clearPendingTerminalLifecycleError(evt.runId);
    const timer = setSafeTimeout(() => {
      const pending = pendingTerminalLifecycleErrors.get(evt.runId);
      if (!pending || pending.timer !== timer) return;
      pendingTerminalLifecycleErrors.delete(evt.runId);
      finalizeLifecycleEvent(pending.event, pending.opts);
    }, lifecycleErrorRetryGraceMs);
    timer.unref?.();
    pendingTerminalLifecycleErrors.set(evt.runId, {
      timer,
      event: evt,
      opts,
    });
  };
  const emitChatDelta = (sessionKey, agentId, clientRunId, sourceRunId, seq, text, delta, opts) => {
    const mergedRawText = resolveMergedAssistantText({
      previousText: chatRunState.rawBuffers.get(clientRunId) ?? "",
      nextText: text,
      nextDelta: typeof delta === "string" ? delta : "",
    });
    if (!mergedRawText) return;
    const now = Date.now();
    chatRunState.rawBuffers.set(clientRunId, mergedRawText);
    chatRunState.bufferUpdatedAt.set(clientRunId, now);
    const projected = projectLiveAssistantBufferedText(
      normalizeLiveAssistantBufferedText(mergedRawText),
    );
    const mergedText = projected.text;
    chatRunState.buffers.set(clientRunId, mergedText);
    if (projected.suppress) return;
    if (shouldHideHeartbeatChatOutput(clientRunId, sourceRunId)) return;
    if (now - (chatRunState.deltaSentAt.get(clientRunId) ?? 0) < 150) return;
    const broadcastDelta = resolveBroadcastDelta({
      text: mergedText,
      previousBroadcastText: chatRunState.deltaLastBroadcastText.get(clientRunId),
    });
    if (!broadcastDelta) return;
    chatRunState.deltaSentAt.set(clientRunId, now);
    chatRunState.deltaLastBroadcastLen.set(clientRunId, mergedText.length);
    chatRunState.deltaLastBroadcastText.set(clientRunId, mergedText);
    const spawnedBy = resolveSpawnedBy(sessionKey);
    const payload = {
      runId: clientRunId,
      sessionKey,
      ...(agentId ? { agentId } : {}),
      ...(spawnedBy && { spawnedBy }),
      seq,
      state: "delta",
      deltaText: broadcastDelta.deltaText,
      ...(broadcastDelta.replace ? { replace: true } : {}),
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text: mergedText,
          },
        ],
        timestamp: now,
      },
    };
    emitFirstAssistantChatSendTiming(chatRunState.registry.peek(sourceRunId));
    sendChatPayload(sessionKey, payload, {
      agentId,
      controlUiVisible: opts?.controlUiVisible ?? true,
      dropIfSlow: true,
    });
  };
  const resolveBufferedChatTextState = (clientRunId, sourceRunId, options) => {
    const normalizedHeartbeatText = normalizeHeartbeatChatFinalText({
      runId: clientRunId,
      sourceRunId,
      text: (chatRunState.buffers.get(clientRunId) ?? "").trim(),
    });
    const projected = projectLiveAssistantBufferedText(normalizedHeartbeatText.text.trim(), {
      suppressLeadFragments: options?.suppressLeadFragments,
    });
    return {
      text: projected.text.trim(),
      shouldSuppressSilent: normalizedHeartbeatText.suppress || projected.suppress,
    };
  };
  const flushBufferedChatDeltaIfNeeded = (
    sessionKey,
    agentId,
    clientRunId,
    sourceRunId,
    seq,
    opts,
  ) => {
    const { text, shouldSuppressSilent } = resolveBufferedChatTextState(clientRunId, sourceRunId, {
      suppressLeadFragments: true,
    });
    const shouldSuppressHeartbeatStreaming = shouldHideHeartbeatChatOutput(
      clientRunId,
      sourceRunId,
    );
    if (!text || shouldSuppressSilent || shouldSuppressHeartbeatStreaming) return;
    const now = Date.now();
    const delta = resolveBroadcastDelta({
      text,
      previousBroadcastText: chatRunState.deltaLastBroadcastText.get(clientRunId),
    });
    if (!delta) return;
    const spawnedBy = resolveSpawnedBy(sessionKey);
    const flushPayload = {
      runId: clientRunId,
      sessionKey,
      ...(agentId ? { agentId } : {}),
      ...(spawnedBy && { spawnedBy }),
      seq,
      state: "delta",
      deltaText: delta.deltaText,
      ...(delta.replace ? { replace: true } : {}),
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text,
          },
        ],
        timestamp: now,
      },
    };
    emitFirstAssistantChatSendTiming(
      opts?.firstAssistantTimingEntry ?? chatRunState.registry.peek(sourceRunId),
    );
    sendChatPayload(sessionKey, flushPayload, {
      agentId,
      controlUiVisible: opts?.controlUiVisible ?? true,
      dropIfSlow: true,
    });
    chatRunState.deltaLastBroadcastLen.set(clientRunId, text.length);
    chatRunState.deltaLastBroadcastText.set(clientRunId, text);
    chatRunState.deltaSentAt.set(clientRunId, now);
  };
  const sendChatPayload = (sessionKey, payload, opts) => {
    const deliverySessionKey = resolveSessionDeliveryKey(sessionKey, opts?.agentId);
    if (opts?.controlUiVisible ?? true) {
      broadcast("chat", payload, { dropIfSlow: opts?.dropIfSlow });
      sendNodeSessionPayloadForAgent(sessionKey, "chat", payload, opts?.agentId);
      return;
    }
    const recipients = sessionMessageSubscribers.get(deliverySessionKey);
    if (recipients.size > 0)
      broadcastToConnIds("chat", payload, recipients, { dropIfSlow: opts?.dropIfSlow });
  };
  const emitChatTerminal = (
    sessionKey,
    clientRunId,
    sourceRunId,
    seq,
    jobState,
    error,
    stopReason,
    errorKind,
    opts,
  ) => {
    const { text, shouldSuppressSilent } = resolveBufferedChatTextState(clientRunId, sourceRunId, {
      suppressLeadFragments: false,
    });
    flushBufferedChatDeltaIfNeeded(sessionKey, opts?.agentId, clientRunId, sourceRunId, seq, opts);
    chatRunState.clearRun(clientRunId);
    const spawnedBy = resolveSpawnedBy(sessionKey);
    if (jobState !== "error") {
      const payload = {
        runId: clientRunId,
        sessionKey,
        ...(opts?.agentId ? { agentId: opts.agentId } : {}),
        ...(spawnedBy && { spawnedBy }),
        seq,
        state: jobState === "done" ? "final" : "aborted",
        ...(jobState === "aborted" && opts?.abortErrorMessage
          ? { errorMessage: opts.abortErrorMessage }
          : {}),
        ...(stopReason && { stopReason }),
        message:
          text && !shouldSuppressSilent
            ? {
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text,
                  },
                ],
                timestamp: Date.now(),
              }
            : void 0,
      };
      sendChatPayload(sessionKey, payload, opts);
      return;
    }
    const payload = {
      runId: clientRunId,
      sessionKey,
      ...(opts?.agentId ? { agentId: opts.agentId } : {}),
      ...(spawnedBy && { spawnedBy }),
      seq,
      state: "error",
      errorMessage: error ? formatForLog(error) : void 0,
      message: buildChatErrorMessage(error),
      ...(errorKind && { errorKind }),
      ...(stopReason && { stopReason }),
    };
    sendChatPayload(sessionKey, payload, opts);
  };
  const sendAgentPayload = (sessionKey, payload, opts) => {
    if (opts?.controlUiVisible ?? true) {
      broadcast("agent", payload);
      if (sessionKey) sendNodeSessionPayloadForAgent(sessionKey, "agent", payload, opts?.agentId);
      return;
    }
    if (!sessionKey) return;
    const recipients = sessionMessageSubscribers.get(
      resolveSessionDeliveryKey(sessionKey, opts?.agentId),
    );
    if (recipients.size > 0)
      broadcastToConnIds("agent", payload, recipients, { dropIfSlow: opts?.dropIfSlow });
  };
  const sendNodeAgentPayload = (sessionKey, payload, agentId) => {
    if (sessionKey) sendNodeSessionPayloadForAgent(sessionKey, "agent", payload, agentId);
  };
  const flushBufferedAgentDeltaIfNeeded = (clientRunId, stream) => {
    const bufferedEntries = (
      stream ? [agentTextThrottleKey(clientRunId, stream)] : agentTextThrottleKeys(clientRunId)
    ).flatMap((key) => {
      const buffered = chatRunState.bufferedAgentEvents.get(key);
      if (!buffered) return [];
      return [
        {
          key,
          buffered,
        },
      ];
    });
    bufferedEntries.sort((a, b) => a.buffered.payload.seq - b.buffered.payload.seq);
    for (const { key, buffered } of bufferedEntries) {
      sendAgentPayload(buffered.sessionKey, buffered.payload, { agentId: buffered.agentId });
      chatRunState.bufferedAgentEvents.delete(key);
      chatRunState.agentDeltaSentAt.set(key, Date.now());
    }
    return bufferedEntries.length > 0;
  };
  const resolveAgentTextThrottleStream = (evt) => {
    if (evt.stream === "assistant") return "assistant";
    if (evt.stream === "thinking") return "thinking";
    return null;
  };
  const isAgentTextThrottleEvent = (evt) =>
    resolveAgentTextThrottleStream(evt) !== null && typeof evt.data?.text === "string";
  const shouldCoalesceAgentTextEvent = (evt) =>
    isAgentTextThrottleEvent(evt) &&
    typeof evt.data.delta === "string" &&
    evt.data.delta.length > 0 &&
    !(Array.isArray(evt.data.mediaUrls) && evt.data.mediaUrls.length > 0) &&
    typeof evt.data.mediaUrl !== "string" &&
    evt.data.replace !== true &&
    (evt.stream !== "assistant" || !shouldSuppressAssistantEventForLiveChat(evt.data));
  const shouldAdvanceAgentTextThrottle = (evt) =>
    isAgentTextThrottleEvent(evt) &&
    (typeof evt.data.delta === "string" || evt.data.replace === true);
  const buildBufferedAgentEvent = (sessionKey, agentId, payload) =>
    sessionKey
      ? {
          sessionKey,
          agentId,
          payload,
        }
      : {
          agentId,
          payload,
        };
  const mergeBufferedAgentPayload = (previous, next) => {
    if (previous.payload.stream !== next.payload.stream) return next;
    const previousDelta = previous.payload.data.delta;
    const nextDelta = next.payload.data.delta;
    if (typeof previousDelta !== "string" || typeof nextDelta !== "string") return next;
    return {
      ...next,
      payload: {
        ...next.payload,
        data: {
          ...next.payload.data,
          delta: `${previousDelta}${nextDelta}`,
        },
      },
    };
  };
  const sendOrBufferAgentTextEvent = (clientRunId, sessionKey, agentId, payload) => {
    const stream = resolveAgentTextThrottleStream(payload);
    if (!stream) {
      sendAgentPayload(sessionKey, payload, { agentId });
      return;
    }
    const now = Date.now();
    const key = agentTextThrottleKey(clientRunId, stream);
    const last = chatRunState.agentDeltaSentAt.get(key);
    if (last !== void 0 && now - last < 150) {
      const nextBuffered = buildBufferedAgentEvent(sessionKey, agentId, payload);
      const buffered = chatRunState.bufferedAgentEvents.get(key);
      chatRunState.bufferedAgentEvents.set(
        key,
        buffered ? mergeBufferedAgentPayload(buffered, nextBuffered) : nextBuffered,
      );
      return;
    }
    flushBufferedAgentDeltaIfNeeded(clientRunId);
    sendAgentPayload(sessionKey, payload, { agentId });
    chatRunState.agentDeltaSentAt.set(key, now);
  };
  const resolveToolVerboseLevel = (runId, sessionKey) => {
    const runContext = getAgentRunContext(runId);
    const runVerbose = normalizeVerboseLevel(runContext?.verboseLevel);
    if (!sessionKey) return runVerbose ?? "off";
    try {
      const { cfg, entry } = loadSessionEntry(sessionKey);
      const sessionVerbose = normalizeVerboseLevel(entry?.verboseLevel);
      const sessionUpdatedAt = typeof entry?.updatedAt === "number" ? entry.updatedAt : void 0;
      const sessionChangedAfterRunStarted =
        sessionUpdatedAt !== void 0 &&
        runContext?.registeredAt !== void 0 &&
        sessionUpdatedAt >= runContext.registeredAt;
      if (sessionVerbose && (!runVerbose || sessionChangedAfterRunStarted)) return sessionVerbose;
      if (runVerbose) return runVerbose;
      return normalizeVerboseLevel(cfg.agents?.defaults?.verboseDefault) ?? "off";
    } catch {
      return runVerbose ?? "off";
    }
  };
  return (event) => {
    const evt = event;
    if (!shouldProcessOwnedEvent(evt)) return;
    const lifecyclePhase =
      evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
    const chatLink = evt.contextClaimId ? void 0 : chatRunState.registry.peek(evt.runId);
    const sessionAgentId = chatLink?.agentId ?? evt.agentId;
    const eventSessionKey =
      evt.deliverySessionKey ??
      (typeof evt.sessionKey === "string" && evt.sessionKey.trim() ? evt.sessionKey : void 0);
    const runContext = getAgentRunContext(evt.runId);
    const activeLifecycleGeneration = resolveActiveLifecycleGenerationForRun(evt.runId);
    const isControlUiVisible = evt.controlUiVisible ?? runContext?.isControlUiVisible ?? true;
    const isHeartbeat = runContext?.isHeartbeat;
    const sessionKey =
      chatLink?.sessionKey ?? eventSessionKey ?? resolveSessionKeyForRun(evt.runId);
    const restartRecoverySessionKey = eventSessionKey ?? sessionKey;
    const restartRecoveryAgentId = evt.agentId ?? sessionAgentId;
    const clientRunId = chatLink?.clientRunId ?? evt.runId;
    const eventRunId = chatLink?.clientRunId ?? evt.runId;
    const eventForClients = chatLink
      ? {
          ...evt,
          runId: eventRunId,
        }
      : evt;
    const isAborted =
      isChatAbortMarkerCurrent(chatRunState.abortedRuns.get(clientRunId), chatLink) ||
      isChatAbortMarkerCurrent(chatRunState.abortedRuns.get(evt.runId), chatLink);
    const restartRecoveryState = restartRecoverySessionKey
      ? resolveRestartRecoveryLifecycleState(restartRecoverySessionKey, restartRecoveryAgentId, evt)
      : void 0;
    if (
      lifecyclePhase !== null &&
      (Boolean(
        evt.lifecycleGeneration &&
        activeLifecycleGeneration &&
        evt.lifecycleGeneration !== activeLifecycleGeneration,
      ) ||
        restartRecoveryState?.suppress === true)
    ) {
      clearPendingTerminalLifecycleError(evt.runId, evt.lifecycleGeneration);
      if (lifecyclePhase === "end" || lifecyclePhase === "error")
        finalizeLifecycleEvent(evt, {
          suppressRestartRecoveryProjection: true,
          restartRecoveryState,
        });
      return;
    }
    if (lifecyclePhase !== null && lifecyclePhase !== "error")
      clearPendingTerminalLifecycleError(evt.runId);
    const spawnedBy = sessionKey ? resolveSpawnedBy(sessionKey) : null;
    const agentPayload = sessionKey
      ? {
          ...eventForClients,
          sessionKey,
          ...(sessionAgentId ? { agentId: sessionAgentId } : {}),
          ...(spawnedBy && { spawnedBy }),
          ...(isHeartbeat !== void 0 && { isHeartbeat }),
        }
      : {
          ...eventForClients,
          ...(isHeartbeat !== void 0 && { isHeartbeat }),
        };
    const hasSessionMessageSubscribers = sessionKey
      ? sessionMessageSubscribers.get(resolveSessionDeliveryKey(sessionKey, sessionAgentId)).size >
        0
      : false;
    const last = agentRunSeq.get(evt.runId) ?? 0;
    const isToolEvent = evt.stream === "tool";
    const isItemEvent = evt.stream === "item";
    const toolVerbose = isToolEvent ? resolveToolVerboseLevel(evt.runId, sessionKey) : "off";
    const suppressHeartbeatToolEvents =
      isToolEvent && shouldSuppressHeartbeatToolEvents(clientRunId, evt.runId);
    const shouldCoalesceAgentEvent = shouldCoalesceAgentTextEvent(evt);
    const channelToolPayload =
      isToolEvent && toolVerbose !== "full"
        ? (() => {
            const data = evt.data ? { ...evt.data } : {};
            delete data.result;
            delete data.partialResult;
            return {
              ...agentPayload,
              data,
            };
          })()
        : agentPayload;
    if (last > 0 && evt.seq !== last + 1 && isControlUiVisible) {
      flushBufferedAgentDeltaIfNeeded(clientRunId);
      broadcast("agent", {
        runId: eventRunId,
        stream: "error",
        ts: Date.now(),
        sessionKey,
        ...(spawnedBy && { spawnedBy }),
        ...(isHeartbeat !== void 0 && { isHeartbeat }),
        data: {
          reason: "seq gap",
          expected: last + 1,
          received: evt.seq,
        },
      });
    }
    agentRunSeq.set(evt.runId, evt.seq);
    if (evt.stream === "assistant")
      updateRunToolErrorSummary?.({
        runId: evt.runId,
        clientRunId,
        summary: void 0,
      });
    if (isToolEvent) {
      const toolPhase = typeof evt.data?.phase === "string" ? evt.data.phase : "";
      if (toolPhase === "start")
        updateRunToolErrorSummary?.({
          runId: evt.runId,
          clientRunId,
          summary: void 0,
        });
      else if (toolPhase === "result")
        updateRunToolErrorSummary?.({
          runId: evt.runId,
          clientRunId,
          summary: readToolValidationErrorSummary(evt.data?.toolErrorSummary),
        });
      if (
        toolPhase === "start" &&
        (isControlUiVisible || hasSessionMessageSubscribers) &&
        sessionKey &&
        !isAborted &&
        !suppressHeartbeatToolEvents
      ) {
        flushBufferedChatDeltaIfNeeded(
          sessionKey,
          sessionAgentId,
          clientRunId,
          evt.runId,
          evt.seq,
          { controlUiVisible: isControlUiVisible },
        );
        flushBufferedAgentDeltaIfNeeded(clientRunId);
      }
      const runToolRecipients = toolEventRecipients.get(evt.runId);
      if (
        isControlUiVisible &&
        !suppressHeartbeatToolEvents &&
        runToolRecipients &&
        runToolRecipients.size > 0
      )
        broadcastToConnIds(
          "agent",
          sessionKey
            ? {
                ...agentPayload,
                ...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId),
              }
            : agentPayload,
          runToolRecipients,
        );
      if (!isControlUiVisible && sessionKey && !suppressHeartbeatToolEvents)
        sendAgentPayload(
          sessionKey,
          {
            ...agentPayload,
            ...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId),
          },
          {
            agentId: sessionAgentId,
            controlUiVisible: false,
            dropIfSlow: true,
          },
        );
      if (isControlUiVisible && sessionKey && !suppressHeartbeatToolEvents) {
        const sessionSubscribers = excludeConnIds(
          sessionEventSubscribers.getAll(),
          runToolRecipients,
        );
        if (sessionSubscribers.size > 0)
          broadcastToConnIds(
            "session.tool",
            {
              ...agentPayload,
              ...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId),
            },
            sessionSubscribers,
            { dropIfSlow: true },
          );
      }
    } else {
      if (
        (isItemEvent && typeof evt.data?.phase === "string" ? evt.data.phase : "") === "start" &&
        (isControlUiVisible || hasSessionMessageSubscribers) &&
        !isAborted
      ) {
        if (sessionKey)
          flushBufferedChatDeltaIfNeeded(
            sessionKey,
            sessionAgentId,
            clientRunId,
            evt.runId,
            evt.seq,
            { controlUiVisible: isControlUiVisible },
          );
        flushBufferedAgentDeltaIfNeeded(clientRunId);
      }
      if (isControlUiVisible)
        if (shouldCoalesceAgentEvent)
          sendOrBufferAgentTextEvent(clientRunId, sessionKey, sessionAgentId, agentPayload);
        else {
          flushBufferedAgentDeltaIfNeeded(clientRunId);
          sendAgentPayload(sessionKey, agentPayload, {
            agentId: sessionAgentId,
            controlUiVisible: isControlUiVisible,
          });
          const textThrottleStream = resolveAgentTextThrottleStream(evt);
          if (textThrottleStream && shouldAdvanceAgentTextThrottle(evt))
            chatRunState.agentDeltaSentAt.set(
              agentTextThrottleKey(clientRunId, textThrottleStream),
              Date.now(),
            );
        }
      else if (
        sessionKey &&
        hasSessionMessageSubscribers &&
        (shouldMirrorAgentEventToHiddenSessionMessages(evt) ||
          (!isAborted &&
            evt.stream === "assistant" &&
            shouldMirrorAssistantEventToHiddenSessionMessages(evt.data)))
      )
        sendAgentPayload(
          sessionKey,
          {
            ...agentPayload,
            ...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId),
          },
          {
            agentId: sessionAgentId,
            controlUiVisible: false,
            dropIfSlow: true,
          },
        );
      if (!isControlUiVisible && isItemEvent && sessionKey && hasSessionMessageSubscribers)
        sendAgentPayload(
          sessionKey,
          {
            ...agentPayload,
            ...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId),
          },
          {
            agentId: sessionAgentId,
            controlUiVisible: false,
            dropIfSlow: true,
          },
        );
    }
    if ((isControlUiVisible || hasSessionMessageSubscribers) && sessionKey) {
      if (
        isControlUiVisible &&
        isToolEvent &&
        !suppressHeartbeatToolEvents &&
        toolVerbose !== "off"
      )
        sendNodeAgentPayload(
          sessionKey,
          projectToolSearchCodeEventForChannelPayload({
            ...channelToolPayload,
            ...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId),
          }),
          sessionAgentId,
        );
      const assistantLiveChatInput =
        evt.stream === "assistant" ? resolveAssistantLiveChatInput(evt.data) : void 0;
      if (
        !isAborted &&
        assistantLiveChatInput &&
        !shouldSuppressAssistantEventForLiveChat(evt.data)
      )
        emitChatDelta(
          sessionKey,
          sessionAgentId,
          clientRunId,
          evt.runId,
          evt.seq,
          assistantLiveChatInput.text,
          assistantLiveChatInput.delta,
          { controlUiVisible: isControlUiVisible },
        );
    }
    if (lifecyclePhase === "error") {
      clearBufferedChatState(clientRunId);
      const skipChatErrorFinal = isChatSendRunActive(evt.runId) && !chatLink;
      const isFallbackExhaustedFailure = evt.data?.fallbackExhaustedFailure === true;
      if (isAborted || isFallbackExhaustedFailure || lifecycleErrorRetryGraceMs <= 0)
        finalizeLifecycleEvent(evt, {
          skipChatErrorFinal,
          restartRecoveryState,
        });
      else
        scheduleTerminalLifecycleError(evt, {
          skipChatErrorFinal,
          restartRecoveryState,
        });
      return;
    }
    if (lifecyclePhase === "end") {
      finalizeLifecycleEvent(evt, { restartRecoveryState });
      return;
    }
    if (sessionKey && lifecyclePhase === "start") {
      persistGatewaySessionLifecycleEvent({
        sessionKey,
        agentId: sessionAgentId,
        event: evt,
      }).catch((err) => {
        logError(
          `gateway: start session persistence failed session=${formatForLog(sessionKey)} run=${formatForLog(evt.runId)} error=${formatForLog(err)}`,
        );
      });
      const sessionEventConnIds = sessionEventSubscribers.getAll();
      if (sessionEventConnIds.size > 0)
        broadcastToConnIds(
          "sessions.changed",
          {
            sessionKey,
            ...(sessionAgentId ? { agentId: sessionAgentId } : {}),
            phase: lifecyclePhase,
            runId: evt.runId,
            ...(eventRunId !== evt.runId ? { clientRunId: eventRunId } : {}),
            ts: evt.ts,
            ...buildSessionEventSnapshot(sessionKey, evt, sessionAgentId, true),
          },
          sessionEventConnIds,
          { dropIfSlow: true },
        );
    }
  };
}
//#endregion
export {
  createAgentEventHandler,
  createChatAbortMarker,
  createChatRunRegistry,
  createChatRunState,
  createSessionEventSubscriberRegistry,
  createSessionMessageSubscriberRegistry,
  createToolEventRecipientRegistry,
  resolveChatErrorKindFromError,
};
