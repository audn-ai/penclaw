import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import {
  a as getDiagnosticSessionActivitySnapshot,
  c as markDiagnosticRunProgress,
  u as resolveRunStaleThresholdMs,
} from "./diagnostic-run-activity-C7EqD7j0.js";
import { t as diagnosticLogger } from "./diagnostic-runtime-BWVVh2ZW.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import "./number-coercion-EqFmHmOw.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import {
  i as createAgentRunRestartAbortError,
  s as isAgentRunRestartAbortReason,
} from "./run-termination-BEbihwT8.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/reply-run-finalization-lease.ts
const REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS = 6e4;
function formatReplyOperationResult(result) {
  if (!result) return "none";
  return "code" in result ? `${result.kind}:${result.code}` : result.kind;
}
const activeLeases = /* @__PURE__ */ new Set();
const activeSettleTimers = /* @__PURE__ */ new Set();
const leasesByOwner = /* @__PURE__ */ new WeakMap();
function createReplyRunSettleTimer(params) {
  let timer;
  const settleTimer = {
    clear() {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
      activeSettleTimers.delete(settleTimer);
    },
    renew(timeoutMs) {
      settleTimer.clear();
      timer = setTimeout(
        () => {
          timer = void 0;
          activeSettleTimers.delete(settleTimer);
          if (params.canExpire()) params.onExpire();
        },
        resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1),
      );
      timer.unref?.();
      activeSettleTimers.add(settleTimer);
    },
    scheduleOnce(timeoutMs) {
      if (!timer) settleTimer.renew(timeoutMs);
    },
  };
  return settleTimer;
}
function createReplyRunFinalizationLease(params) {
  let finalizing = false;
  let defaultDeadlineMs = 0;
  const workDeadlinesMs = /* @__PURE__ */ new Map();
  const settleTimer = createReplyRunSettleTimer({
    canExpire: () => finalizing && params.canExpire(),
    onExpire: params.onExpire,
  });
  const schedule = () => {
    const workDeadlineMs = Math.max(0, ...workDeadlinesMs.values());
    const deadlineMs = Math.max(defaultDeadlineMs, workDeadlineMs);
    settleTimer.renew(Math.max(1, deadlineMs - Date.now()));
  };
  const recordActivity = () => {
    params.onActivity();
    if (finalizing) {
      defaultDeadlineMs = Date.now() + REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS;
      params.onFinalizationProgress();
      schedule();
    }
  };
  const lease = {
    begin() {
      if (!params.canExpire()) return;
      finalizing = true;
      activeLeases.add(lease);
      recordActivity();
    },
    beginWork(timeoutMs) {
      const workId = Symbol("reply-finalization-work");
      workDeadlinesMs.set(
        workId,
        Date.now() + resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1),
      );
      recordActivity();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        workDeadlinesMs.delete(workId);
        if (finalizing) schedule();
      };
    },
    clear() {
      finalizing = false;
      defaultDeadlineMs = 0;
      workDeadlinesMs.clear();
      settleTimer.clear();
      activeLeases.delete(lease);
      leasesByOwner.delete(params.owner);
    },
    recordActivity,
  };
  leasesByOwner.set(params.owner, lease);
  return lease;
}
function beginReplyOperationFinalizationWork(owner, timeoutMs) {
  return leasesByOwner.get(owner)?.beginWork(timeoutMs) ?? (() => void 0);
}
function resetReplyRunSettleTimersForTesting() {
  for (const lease of activeLeases) lease.clear();
  activeLeases.clear();
  for (const timer of activeSettleTimers) timer.clear();
  activeSettleTimers.clear();
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.ts
/** Prevents steering a turn into a run whose model-facing tool surface differs. */
function resolveReplyBackendQueueMessageMismatch(backend, options) {
  if (
    options?.sourceReplyDeliveryMode === "message_tool_only" &&
    backend.sourceReplyDeliveryMode !== "message_tool_only"
  )
    return "source_reply_delivery_mode_mismatch";
  if (
    options !== void 0 &&
    Object.hasOwn(options, "taskSuggestionDeliveryMode") &&
    options?.taskSuggestionDeliveryMode !== backend.taskSuggestionDeliveryMode
  )
    return "task_suggestion_delivery_mode_mismatch";
}
const replyRunState = resolveGlobalSingleton(Symbol.for("openclaw.replyRunRegistry"), () => ({
  activeRunsByKey: /* @__PURE__ */ new Map(),
  activeSessionIdsByKey: /* @__PURE__ */ new Map(),
  activeKeysBySessionId: /* @__PURE__ */ new Map(),
  waitKeysBySessionId: /* @__PURE__ */ new Map(),
  waitersByKey: /* @__PURE__ */ new Map(),
  followupAdmissionBarriersByKey: /* @__PURE__ */ new Map(),
}));
replyRunState.followupAdmissionBarriersByKey ??= /* @__PURE__ */ new Map();
const REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS = 15e3;
const REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS = 6e4;
var ReplyRunAlreadyActiveError = class extends Error {
  constructor(sessionKey) {
    super(`Reply run already active for ${sessionKey}`);
    this.name = "ReplyRunAlreadyActiveError";
  }
};
var ReplyRunFollowupAdmissionBlockedError = class extends Error {
  constructor(sessionKey) {
    super(`Reply follow-up admission is blocked for ${sessionKey}`);
    this.name = "ReplyRunFollowupAdmissionBlockedError";
  }
};
function createUserAbortError() {
  return createAbortError("Reply operation aborted by user");
}
function registerWaitSessionId(sessionKey, sessionId) {
  replyRunState.waitKeysBySessionId.set(sessionId, sessionKey);
}
function clearWaitSessionIds(sessionKey) {
  for (const [sessionId, mappedKey] of replyRunState.waitKeysBySessionId)
    if (mappedKey === sessionKey) replyRunState.waitKeysBySessionId.delete(sessionId);
}
function notifyReplyRunEnded(sessionKey) {
  const waiters = replyRunState.waitersByKey.get(sessionKey);
  if (!waiters || waiters.size === 0) return;
  replyRunState.waitersByKey.delete(sessionKey);
  for (const waiter of waiters) waiter.finish(true);
}
function resolveReplyRunForCurrentSessionId(sessionId) {
  const normalizedSessionId = normalizeOptionalString(sessionId);
  if (!normalizedSessionId) return;
  const sessionKey = replyRunState.activeKeysBySessionId.get(normalizedSessionId);
  if (!sessionKey) return;
  return replyRunState.activeRunsByKey.get(sessionKey);
}
function resolveReplyRunWaitKey(sessionId) {
  const normalizedSessionId = normalizeOptionalString(sessionId);
  if (!normalizedSessionId) return;
  return (
    replyRunState.activeKeysBySessionId.get(normalizedSessionId) ??
    replyRunState.waitKeysBySessionId.get(normalizedSessionId)
  );
}
function isReplyRunCompacting(operation) {
  if (operation.phase === "preflight_compacting" || operation.phase === "memory_flushing")
    return true;
  if (operation.phase !== "running") return false;
  return getAttachedBackend(operation)?.isCompacting?.() ?? false;
}
function isReplyOperationPreBackendPhase(phase) {
  return phase === "queued" || phase === "waiting_for_deferred_maintenance";
}
const attachedBackendByOperation = /* @__PURE__ */ new WeakMap();
const abortFrozenOperations = /* @__PURE__ */ new WeakSet();
const operationsByUpstreamAbortSignal = /* @__PURE__ */ new WeakMap();
const retainStateUntilCompleteOperations = /* @__PURE__ */ new WeakSet();
const afterClearCallbacksByOperation = /* @__PURE__ */ new WeakMap();
const expireReplyOperationByOperation = /* @__PURE__ */ new WeakMap();
function getAttachedBackend(operation) {
  return attachedBackendByOperation.get(operation);
}
function isReplyOperationAbortable(operation) {
  if (operation.result || abortFrozenOperations.has(operation)) return false;
  const backend = getAttachedBackend(operation);
  if (!backend?.isAbortable) return true;
  try {
    return backend.isAbortable();
  } catch {
    return false;
  }
}
function isReplyRunAbortableForSignal(signal) {
  const operation = operationsByUpstreamAbortSignal.get(signal);
  return operation ? isReplyOperationAbortable(operation) : true;
}
/** Keep terminal state registered until the operation owner exits via complete(). */
function retainReplyOperationUntilComplete(operation) {
  retainStateUntilCompleteOperations.add(operation);
}
function isReplyBackendMessageInjectable(backend) {
  try {
    return backend.isStopped === void 0 ? backend.isStreaming() : !backend.isStopped();
  } catch {
    return false;
  }
}
/** Run work after an operation no longer owns its session lane. */
function runAfterReplyOperationClear(operation, afterClear) {
  if (replyRunState.activeRunsByKey.get(operation.key) !== operation) {
    afterClear(operation.sessionId);
    return;
  }
  const callbacks = afterClearCallbacksByOperation.get(operation) ?? /* @__PURE__ */ new Set();
  callbacks.add(afterClear);
  afterClearCallbacksByOperation.set(operation, callbacks);
}
function flushReplyOperationAfterClear(operation, sessionId) {
  const callbacks = afterClearCallbacksByOperation.get(operation);
  if (!callbacks) return;
  afterClearCallbacksByOperation.delete(operation);
  for (const callback of callbacks) callback(sessionId);
}
function waitForReplyBarrierSettlement(barrier, timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
  return new Promise((resolve) => {
    let settled = false;
    let timer;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    const schedule = (delayMs, callback) => {
      timer = setTimeout(callback, delayMs);
      timer.unref?.();
    };
    if (typeof timeout === "number")
      schedule(resolveTimerTimeoutMs(timeout, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS), finish);
    else {
      const startedAt = Date.now();
      const maxTimeoutMs = resolveTimerTimeoutMs(
        timeout.maxTimeoutMs,
        REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS,
      );
      const checkOwnerActivity = () => {
        const remainingMs = maxTimeoutMs - (Date.now() - startedAt);
        if (remainingMs <= 0) {
          finish();
          return;
        }
        let shouldExtend;
        try {
          shouldExtend = timeout.shouldExtend();
        } catch {
          finish();
          return;
        }
        if (!shouldExtend) {
          finish();
          return;
        }
        schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, remainingMs), checkOwnerActivity);
      };
      schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, maxTimeoutMs), checkOwnerActivity);
    }
    Promise.resolve(barrier).then(finish, finish);
  });
}
function registerFollowupAdmissionBarrier(
  sessionKey,
  sessionId,
  barrier,
  timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS,
) {
  const barriersByKey = replyRunState.followupAdmissionBarriersByKey;
  const previous = barriersByKey.get(sessionKey)?.settled;
  const current = waitForReplyBarrierSettlement(barrier, timeout);
  const settled = previous ? Promise.all([previous, current]).then(() => void 0) : current;
  const entry = {
    settled,
    sessionId,
  };
  barriersByKey.set(sessionKey, entry);
  settled.then(() => {
    if (barriersByKey.get(sessionKey) === entry) barriersByKey.delete(sessionKey);
  });
  return entry;
}
function updateFollowupAdmissionSessionId(sessionKey, sessionId) {
  const barrier = replyRunState.followupAdmissionBarriersByKey.get(sessionKey);
  if (barrier) barrier.sessionId = sessionId;
}
function clearReplyRunState(params) {
  replyRunState.activeRunsByKey.delete(params.sessionKey);
  replyRunState.activeSessionIdsByKey.delete(params.sessionKey);
  if (replyRunState.activeKeysBySessionId.get(params.sessionId) === params.sessionKey)
    replyRunState.activeKeysBySessionId.delete(params.sessionId);
  clearWaitSessionIds(params.sessionKey);
  notifyReplyRunEnded(params.sessionKey);
}
function markReplyRunDiagnosticProgress(params) {
  markDiagnosticRunProgress({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    reason: params.reason,
  });
}
function createReplyOperation(params) {
  const sessionKey = normalizeOptionalString(params.sessionKey);
  const sessionId = normalizeOptionalString(params.sessionId);
  if (!sessionKey) throw new Error("Reply operations require a canonical sessionKey");
  if (!sessionId) throw new Error("Reply operations require a sessionId");
  if (
    params.respectFollowupAdmissionBarrier &&
    replyRunState.followupAdmissionBarriersByKey.has(sessionKey)
  )
    throw new ReplyRunFollowupAdmissionBlockedError(sessionKey);
  if (replyRunState.activeRunsByKey.has(sessionKey))
    throw new ReplyRunAlreadyActiveError(sessionKey);
  const controller = new AbortController();
  let currentSessionKey = sessionKey;
  let currentSessionId = sessionId;
  let phase = "queued";
  let result = null;
  let stateCleared = false;
  let retainFailureUntilComplete = false;
  let terminalRecovery = false;
  let acceptedSteeredInboundAudio = false;
  const startedAtMs = Date.now();
  let lastActivityAtMs = startedAtMs;
  const upstreamAbortSignal = params.upstreamAbortSignal;
  let upstreamAbortHandler;
  const detachUpstreamAbort = () => {
    if (!upstreamAbortHandler) return;
    upstreamAbortSignal?.removeEventListener("abort", upstreamAbortHandler);
    upstreamAbortHandler = void 0;
  };
  const ownedSessionIds = /* @__PURE__ */ new Set([sessionId]);
  const recordActivity = () => {
    lastActivityAtMs = Date.now();
  };
  const setResult = (next) => {
    result = next;
    recordActivity();
  };
  const clearState = (afterClearBarrier, followupAdmissionBarrierTimeout) => {
    if (stateCleared) return;
    stateCleared = true;
    terminalSettleTimer.clear();
    finalizationLease.clear();
    expireReplyOperationByOperation.delete(operation);
    detachUpstreamAbort();
    const registeredBarrier = afterClearBarrier
      ? registerFollowupAdmissionBarrier(
          currentSessionKey,
          currentSessionId,
          afterClearBarrier,
          followupAdmissionBarrierTimeout,
        )
      : void 0;
    updateFollowupAdmissionSessionId(currentSessionKey, currentSessionId);
    markReplyRunDiagnosticProgress({
      sessionKey: currentSessionKey,
      sessionId: currentSessionId,
      reason: "reply_operation:ended",
    });
    clearReplyRunState({
      sessionKey: currentSessionKey,
      sessionId: currentSessionId,
    });
    if (!registeredBarrier) {
      flushReplyOperationAfterClear(operation, currentSessionId);
      return;
    }
    registeredBarrier.settled.then(() =>
      flushReplyOperationAfterClear(operation, registeredBarrier.sessionId),
    );
  };
  const abortInternally = (reason) => {
    if (!controller.signal.aborted) controller.abort(reason);
  };
  const scheduleTerminalSettle = () => {
    if (stateCleared) return;
    terminalSettleTimer.scheduleOnce(REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS);
  };
  const abortWithReason = (reason, abortReason, opts) => {
    if (opts?.abortedCode && !result) {
      setResult({
        kind: "aborted",
        code: opts.abortedCode,
      });
      detachUpstreamAbort();
    }
    phase = "aborted";
    abortInternally(abortReason);
    getAttachedBackend(operation)?.cancel(reason);
  };
  const operation = {
    get key() {
      return currentSessionKey;
    },
    get sessionId() {
      return currentSessionId;
    },
    get routeThreadId() {
      return params.routeThreadId;
    },
    get abortSignal() {
      return controller.signal;
    },
    get resetTriggered() {
      return params.resetTriggered;
    },
    get terminalRecovery() {
      return terminalRecovery;
    },
    get acceptedSteeredInboundAudio() {
      return acceptedSteeredInboundAudio;
    },
    get phase() {
      return phase;
    },
    get result() {
      return result;
    },
    get startedAtMs() {
      return startedAtMs;
    },
    get lastActivityAtMs() {
      return lastActivityAtMs;
    },
    hasOwnedSessionId(candidateSessionId) {
      const normalizedSessionId = normalizeOptionalString(candidateSessionId);
      return normalizedSessionId ? ownedSessionIds.has(normalizedSessionId) : false;
    },
    recordActivity() {
      finalizationLease.recordActivity();
    },
    setPhase(next) {
      if (result) return;
      recordActivity();
      phase = next;
    },
    markWaitingForDeferredMaintenance() {
      if (result || phase !== "queued") return;
      phase = "waiting_for_deferred_maintenance";
      markReplyRunDiagnosticProgress({
        sessionKey: currentSessionKey,
        sessionId: currentSessionId,
        reason: "deferred_maintenance:waiting",
      });
    },
    markDeferredMaintenanceWaitEnded() {
      if (result || phase !== "waiting_for_deferred_maintenance") return;
      phase = "queued";
      markReplyRunDiagnosticProgress({
        sessionKey: currentSessionKey,
        sessionId: currentSessionId,
        reason: "deferred_maintenance:wait_ended",
      });
    },
    markTerminalRecovery() {
      terminalRecovery = true;
    },
    markAcceptedSteeredInboundAudio() {
      acceptedSteeredInboundAudio = true;
    },
    updateSessionId(nextSessionId) {
      if (result) return;
      const normalizedNextSessionId = normalizeOptionalString(nextSessionId);
      if (!normalizedNextSessionId || normalizedNextSessionId === currentSessionId) return;
      recordActivity();
      if (
        replyRunState.activeKeysBySessionId.has(normalizedNextSessionId) &&
        replyRunState.activeKeysBySessionId.get(normalizedNextSessionId) !== currentSessionKey
      )
        throw new Error(
          `Cannot rebind reply operation ${currentSessionKey} to active session ${normalizedNextSessionId}`,
        );
      replyRunState.activeKeysBySessionId.delete(currentSessionId);
      registerWaitSessionId(currentSessionKey, currentSessionId);
      currentSessionId = normalizedNextSessionId;
      ownedSessionIds.add(currentSessionId);
      updateFollowupAdmissionSessionId(currentSessionKey, currentSessionId);
      replyRunState.activeSessionIdsByKey.set(currentSessionKey, currentSessionId);
      replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
      registerWaitSessionId(currentSessionKey, currentSessionId);
      markReplyRunDiagnosticProgress({
        sessionKey: currentSessionKey,
        sessionId: currentSessionId,
        reason: "reply_operation:session_updated",
      });
    },
    updateSessionKey(nextSessionKey) {
      const normalizedNextKey = normalizeOptionalString(nextSessionKey);
      if (!normalizedNextKey) throw new Error("Reply operations require a canonical sessionKey");
      if (normalizedNextKey === currentSessionKey) return;
      if (result || stateCleared || phase !== "queued")
        throw new Error(`Cannot rekey reply operation ${currentSessionKey} in phase ${phase}`);
      if (replyRunState.activeRunsByKey.has(normalizedNextKey))
        throw new ReplyRunAlreadyActiveError(normalizedNextKey);
      recordActivity();
      const previousKey = currentSessionKey;
      replyRunState.activeRunsByKey.delete(previousKey);
      replyRunState.activeSessionIdsByKey.delete(previousKey);
      currentSessionKey = normalizedNextKey;
      replyRunState.activeRunsByKey.set(currentSessionKey, operation);
      replyRunState.activeSessionIdsByKey.set(currentSessionKey, currentSessionId);
      replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
      for (const ownedSessionId of ownedSessionIds)
        if (replyRunState.waitKeysBySessionId.get(ownedSessionId) === previousKey)
          replyRunState.waitKeysBySessionId.set(ownedSessionId, currentSessionKey);
      notifyReplyRunEnded(previousKey);
      markReplyRunDiagnosticProgress({
        sessionKey: currentSessionKey,
        sessionId: currentSessionId,
        reason: "reply_operation:session_key_adopted",
      });
    },
    attachBackend(handle) {
      if (result) {
        handle.cancel(
          result.kind === "aborted"
            ? result.code === "aborted_for_restart"
              ? "restart"
              : "user_abort"
            : "superseded",
        );
        return;
      }
      recordActivity();
      attachedBackendByOperation.set(operation, handle);
      if (controller.signal.aborted) handle.cancel("superseded");
    },
    detachBackend(handle) {
      if (getAttachedBackend(operation) === handle) attachedBackendByOperation.delete(operation);
    },
    freezeAbort() {
      abortFrozenOperations.add(operation);
      detachUpstreamAbort();
      finalizationLease.begin();
    },
    retainFailureUntilComplete() {
      retainFailureUntilComplete = true;
    },
    complete() {
      if (!result) {
        setResult({ kind: "completed" });
        phase = "completed";
      }
      clearState();
    },
    completeThen(afterClear) {
      runAfterReplyOperationClear(operation, afterClear);
      operation.complete();
    },
    completeWithAfterClearBarrier(barrier, timeoutMs) {
      if (!result) {
        setResult({ kind: "completed" });
        phase = "completed";
      }
      clearState(barrier, timeoutMs);
    },
    fail(code, cause) {
      abortFrozenOperations.add(operation);
      detachUpstreamAbort();
      finalizationLease.clear();
      if (!result) {
        setResult({
          kind: "failed",
          code,
          cause,
        });
        phase = "failed";
      }
      if (!retainFailureUntilComplete && !retainStateUntilCompleteOperations.has(operation))
        clearState();
      else scheduleTerminalSettle();
    },
    abortByUser() {
      if (!isReplyOperationAbortable(operation)) return false;
      const phaseBeforeAbort = phase;
      abortWithReason("user_abort", createUserAbortError(), { abortedCode: "aborted_by_user" });
      if (
        isReplyOperationPreBackendPhase(phaseBeforeAbort) &&
        !retainStateUntilCompleteOperations.has(operation)
      )
        clearState();
      else scheduleTerminalSettle();
      return true;
    },
    abortForRestart() {
      if (!isReplyOperationAbortable(operation)) return false;
      const phaseBeforeAbort = phase;
      abortWithReason("restart", createAgentRunRestartAbortError(), {
        abortedCode: "aborted_for_restart",
      });
      if (
        isReplyOperationPreBackendPhase(phaseBeforeAbort) &&
        !retainStateUntilCompleteOperations.has(operation)
      )
        clearState();
      else scheduleTerminalSettle();
      return true;
    },
  };
  expireReplyOperationByOperation.set(operation, (reason) => {
    if (replyRunState.activeRunsByKey.get(currentSessionKey) !== operation) return false;
    if (!result) {
      abortFrozenOperations.add(operation);
      detachUpstreamAbort();
      setResult({
        kind: "failed",
        code: "run_stalled",
      });
      phase = "failed";
    }
    getAttachedBackend(operation)?.cancel("superseded");
    abortInternally(createAbortError("Reply operation expired as stale"));
    diagnosticLogger.warn(
      `reply run stale takeover: forced release sessionKey=${currentSessionKey} reason=${reason} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`,
    );
    clearState();
    return true;
  });
  const finalizationLease = createReplyRunFinalizationLease({
    owner: operation,
    canExpire: () =>
      !stateCleared &&
      !result &&
      replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
    onActivity: recordActivity,
    onFinalizationProgress: () =>
      markReplyRunDiagnosticProgress({
        sessionKey: currentSessionKey,
        sessionId: currentSessionId,
        reason: "reply_operation:finalizing_progress",
      }),
    onExpire: () => {
      diagnosticLogger.warn(
        `reply run finalization settle: forced release sessionKey=${currentSessionKey} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`,
      );
      expireReplyOperationByOperation.get(operation)?.("finalization_stalled");
    },
  });
  const terminalSettleTimer = createReplyRunSettleTimer({
    canExpire: () => replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
    onExpire: () => {
      diagnosticLogger.warn(
        `reply run terminal settle: forced release sessionKey=${currentSessionKey} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`,
      );
      clearState();
    },
  });
  replyRunState.activeRunsByKey.set(sessionKey, operation);
  replyRunState.activeSessionIdsByKey.set(sessionKey, currentSessionId);
  replyRunState.activeKeysBySessionId.set(currentSessionId, sessionKey);
  registerWaitSessionId(sessionKey, currentSessionId);
  markReplyRunDiagnosticProgress({
    sessionKey,
    sessionId: currentSessionId,
    reason: "reply_operation:queued",
  });
  if (upstreamAbortSignal) {
    operationsByUpstreamAbortSignal.set(upstreamAbortSignal, operation);
    const abortFromUpstream = () => {
      if (result) return;
      const restart = isAgentRunRestartAbortReason(upstreamAbortSignal.reason);
      const phaseBeforeAbort = phase;
      abortWithReason(restart ? "restart" : "user_abort", upstreamAbortSignal.reason, {
        abortedCode: restart ? "aborted_for_restart" : "aborted_by_user",
      });
      if (
        isReplyOperationPreBackendPhase(phaseBeforeAbort) &&
        !retainStateUntilCompleteOperations.has(operation)
      )
        clearState();
      else scheduleTerminalSettle();
    };
    if (upstreamAbortSignal.aborted) abortFromUpstream();
    else {
      upstreamAbortHandler = abortFromUpstream;
      upstreamAbortSignal.addEventListener("abort", upstreamAbortHandler, { once: true });
    }
  }
  return operation;
}
function expireStaleReplyOperation(operation, reason) {
  return expireReplyOperationByOperation.get(operation)?.(reason) ?? false;
}
function expireStaleReplyRunBySessionId(sessionId, reason) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  return operation ? expireStaleReplyOperation(operation, reason) : false;
}
function isReplyRunEvidenceStale(operation) {
  const activity = getDiagnosticSessionActivitySnapshot({
    sessionId: operation.sessionId,
    sessionKey: operation.key,
  });
  return (
    !operation.result &&
    Date.now() - operation.lastActivityAtMs > resolveRunStaleThresholdMs(activity)
  );
}
function isReplyRunEvidenceStaleBySessionId(sessionId) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  return operation ? isReplyRunEvidenceStale(operation) : false;
}
const replyRunRegistry = {
  begin(params) {
    return createReplyOperation(params);
  },
  get(sessionKey) {
    const normalizedSessionKey = normalizeOptionalString(sessionKey);
    if (!normalizedSessionKey) return;
    return replyRunState.activeRunsByKey.get(normalizedSessionKey);
  },
  isActive(sessionKey) {
    const normalizedSessionKey = normalizeOptionalString(sessionKey);
    if (!normalizedSessionKey) return false;
    return replyRunState.activeRunsByKey.has(normalizedSessionKey);
  },
  isStreaming(sessionKey) {
    const operation = this.get(sessionKey);
    if (!operation || operation.phase !== "running") return false;
    return getAttachedBackend(operation)?.isStreaming() ?? false;
  },
  abort(sessionKey) {
    const operation = this.get(sessionKey);
    if (!operation) return false;
    return operation.abortByUser();
  },
  waitForIdle(sessionKey, timeoutMs, opts) {
    const normalizedSessionKey = normalizeOptionalString(sessionKey);
    if (!normalizedSessionKey || !replyRunState.activeRunsByKey.has(normalizedSessionKey))
      return Promise.resolve(true);
    if (opts?.signal?.aborted) return Promise.resolve(false);
    return new Promise((resolve) => {
      const waiters =
        replyRunState.waitersByKey.get(normalizedSessionKey) ?? /* @__PURE__ */ new Set();
      let abortHandler;
      let settled = false;
      const waiter = {
        finish: (ended) => {
          if (settled) return;
          settled = true;
          waiters.delete(waiter);
          if (waiters.size === 0) replyRunState.waitersByKey.delete(normalizedSessionKey);
          if (waiter.timer) clearTimeout(waiter.timer);
          if (abortHandler) opts?.signal?.removeEventListener("abort", abortHandler);
          resolve(ended);
        },
      };
      if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs))
        waiter.timer = setTimeout(
          () => waiter.finish(false),
          resolveTimerTimeoutMs(timeoutMs, 100, 100),
        );
      if (opts?.signal) {
        abortHandler = () => waiter.finish(false);
        opts.signal.addEventListener("abort", abortHandler, { once: true });
      }
      waiters.add(waiter);
      replyRunState.waitersByKey.set(normalizedSessionKey, waiters);
      if (!replyRunState.activeRunsByKey.has(normalizedSessionKey)) waiter.finish(true);
    });
  },
  resolveSessionId(sessionKey) {
    const normalizedSessionKey = normalizeOptionalString(sessionKey);
    if (!normalizedSessionKey) return;
    return replyRunState.activeSessionIdsByKey.get(normalizedSessionKey);
  },
};
function resolveActiveReplyRunSessionId(sessionKey) {
  return replyRunRegistry.resolveSessionId(sessionKey);
}
function resolveActiveReplyRunThreadId(sessionKey) {
  return replyRunRegistry.get(sessionKey)?.routeThreadId;
}
function isReplyRunActiveForSessionId(sessionId) {
  return resolveReplyRunForCurrentSessionId(sessionId) !== void 0;
}
function resolveReplyRunPhaseForSessionId(sessionId) {
  return resolveReplyRunForCurrentSessionId(sessionId)?.phase;
}
function isReplyRunAbortableForCompaction(sessionId) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  return Boolean(operation && !isReplyOperationPreBackendPhase(operation.phase));
}
function isReplyRunStreamingForSessionId(sessionId) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  if (!operation || operation.phase !== "running") return false;
  return getAttachedBackend(operation)?.isStreaming() ?? false;
}
function queueReplyRunMessage(sessionId, text, options) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  const backend = operation ? getAttachedBackend(operation) : void 0;
  if (!operation || operation.phase !== "running" || !backend?.queueMessage) return false;
  if (isReplyRunEvidenceStale(operation)) return false;
  if (!isReplyBackendMessageInjectable(backend)) return false;
  if (resolveReplyBackendQueueMessageMismatch(backend, options)) return false;
  (options ? backend.queueMessage(text, options) : backend.queueMessage(text)).catch((error) => {
    diagnosticLogger.debug(
      `queued reply run message rejected: sessionId=${sessionId} error=${String(error)}`,
    );
  });
  return true;
}
function abortReplyRunBySessionId(sessionId) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  if (!operation) return false;
  return operation.abortByUser();
}
function forceClearReplyRunBySessionId(sessionId, cause) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  if (!operation) return false;
  operation.fail("run_failed", cause);
  operation.complete();
  return true;
}
function clearReplyRunForResetBySessionId(sessionId) {
  const operation = resolveReplyRunForCurrentSessionId(sessionId);
  if (!operation || isReplyOperationPreBackendPhase(operation.phase)) return;
  operation.abortForRestart();
  if (replyRunState.activeRunsByKey.get(operation.key) === operation) operation.complete();
}
function waitForReplyRunEndBySessionId(sessionId, timeoutMs) {
  const waitKey = resolveReplyRunWaitKey(sessionId);
  if (!waitKey) return Promise.resolve(true);
  return replyRunRegistry.waitForIdle(waitKey, timeoutMs);
}
async function waitForReplyRunFollowupAdmission(sessionKey, timeoutMs, opts) {
  const normalizedSessionKey = normalizeOptionalString(sessionKey);
  if (!normalizedSessionKey) return { settled: true };
  const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 100, 100);
  const deadline = Date.now() + resolvedTimeoutMs;
  let sessionId;
  while (true) {
    if (opts?.signal?.aborted) return { settled: false };
    const barrier = replyRunState.followupAdmissionBarriersByKey.get(normalizedSessionKey);
    if (!barrier)
      return {
        settled: true,
        sessionId,
      };
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) return { settled: false };
    let timer;
    let abortHandler;
    const outcome = await Promise.race([
      barrier.settled.then(() => true),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(false), remainingMs);
        timer.unref?.();
      }),
      ...(opts?.signal
        ? [
            new Promise((resolve) => {
              abortHandler = () => resolve(false);
              opts.signal?.addEventListener("abort", abortHandler, { once: true });
            }),
          ]
        : []),
    ]);
    if (timer) clearTimeout(timer);
    if (abortHandler) opts?.signal?.removeEventListener("abort", abortHandler);
    if (!outcome) return { settled: false };
    sessionId = barrier.sessionId;
  }
}
function abortActiveReplyRuns(opts) {
  let aborted = false;
  for (const operation of replyRunState.activeRunsByKey.values()) {
    if (opts.mode === "compacting" && !isReplyRunCompacting(operation)) continue;
    try {
      if (operation.abortForRestart()) aborted = true;
    } catch (error) {
      if (operation.result?.kind === "aborted" && operation.result.code === "aborted_for_restart")
        aborted = true;
      opts.onAbortError?.(operation.sessionId, error);
    }
  }
  return aborted;
}
function getActiveReplyRunCount() {
  return replyRunState.activeRunsByKey.size;
}
function listActiveReplyRunSessionIds() {
  return [...replyRunState.activeSessionIdsByKey.values()];
}
function listActiveReplyRunSessionKeys() {
  return [...replyRunState.activeSessionIdsByKey.keys()];
}
const testing = {
  resetReplyRunRegistry() {
    for (const [sessionKey, sessionId] of replyRunState.activeSessionIdsByKey)
      markReplyRunDiagnosticProgress({
        sessionKey,
        sessionId,
        reason: "reply_operation:registry_reset",
      });
    replyRunState.activeRunsByKey.clear();
    replyRunState.activeSessionIdsByKey.clear();
    replyRunState.activeKeysBySessionId.clear();
    replyRunState.waitKeysBySessionId.clear();
    resetReplyRunSettleTimersForTesting();
    for (const waiters of replyRunState.waitersByKey.values())
      for (const waiter of waiters) waiter.finish(false);
    replyRunState.waitersByKey.clear();
    replyRunState.followupAdmissionBarriersByKey.clear();
  },
};
//#endregion
export {
  waitForReplyBarrierSettlement as A,
  resolveActiveReplyRunSessionId as C,
  retainReplyOperationUntilComplete as D,
  resolveReplyRunPhaseForSessionId as E,
  waitForReplyRunFollowupAdmission as M,
  beginReplyOperationFinalizationWork as N,
  runAfterReplyOperationClear as O,
  replyRunRegistry as S,
  resolveReplyBackendQueueMessageMismatch as T,
  isReplyRunEvidenceStaleBySessionId as _,
  abortActiveReplyRuns as a,
  listActiveReplyRunSessionKeys as b,
  createReplyOperation as c,
  forceClearReplyRunBySessionId as d,
  getActiveReplyRunCount as f,
  isReplyRunEvidenceStale as g,
  isReplyRunActiveForSessionId as h,
  ReplyRunFollowupAdmissionBlockedError as i,
  waitForReplyRunEndBySessionId as j,
  testing as k,
  expireStaleReplyOperation as l,
  isReplyRunAbortableForSignal as m,
  REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS as n,
  abortReplyRunBySessionId as o,
  isReplyRunAbortableForCompaction as p,
  ReplyRunAlreadyActiveError as r,
  clearReplyRunForResetBySessionId as s,
  REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS as t,
  expireStaleReplyRunBySessionId as u,
  isReplyRunStreamingForSessionId as v,
  resolveActiveReplyRunThreadId as w,
  queueReplyRunMessage as x,
  listActiveReplyRunSessionIds as y,
};
