import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C_WnQaQy.js";
import { at as updateSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { l as parseCronRunScopeSuffix } from "./session-key-utils-B8sNp9l4.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
//#region src/gateway/session-lifecycle-state.ts
function isFiniteTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveLifecyclePhase(event) {
  const phase = typeof event.data?.phase === "string" ? event.data.phase : "";
  return phase === "start" || phase === "end" || phase === "error" ? phase : null;
}
function mapAgentRunTerminalOutcomeToSessionStatus(outcome) {
  switch (outcome.reason) {
    case "completed":
      return "done";
    case "hard_timeout":
    case "timed_out":
      return "timeout";
    case "cancelled":
    case "aborted":
      return "killed";
    case "blocked":
    case "abandoned":
    case "failed":
      return "failed";
    default:
      return outcome.reason;
  }
}
function resolveTerminalStatus(event) {
  return mapAgentRunTerminalOutcomeToSessionStatus(
    buildAgentRunTerminalOutcome({
      status:
        resolveLifecyclePhase(event) === "error"
          ? "error"
          : event.data?.aborted === true
            ? "timeout"
            : "ok",
      error: event.data?.error,
      stopReason: event.data?.stopReason,
      livenessState: event.data?.livenessState,
      timeoutPhase: event.data?.timeoutPhase,
      providerStarted: event.data?.providerStarted,
      startedAt: event.data?.startedAt,
      endedAt: event.data?.endedAt ?? event.ts,
    }),
  );
}
function resolveLifecycleStartedAt(existingStartedAt, event) {
  if (isFiniteTimestamp(event.data?.startedAt)) return event.data.startedAt;
  if (isFiniteTimestamp(existingStartedAt)) return existingStartedAt;
  return isFiniteTimestamp(event.ts) ? event.ts : void 0;
}
function resolveLifecycleEndedAt(event) {
  if (isFiniteTimestamp(event.data?.endedAt)) return event.data.endedAt;
  return isFiniteTimestamp(event.ts) ? event.ts : void 0;
}
function resolveRuntimeMs(params) {
  const { startedAt, endedAt, existingRuntimeMs } = params;
  if (isFiniteTimestamp(startedAt) && isFiniteTimestamp(endedAt))
    return Math.max(0, endedAt - startedAt);
  if (
    typeof existingRuntimeMs === "number" &&
    Number.isFinite(existingRuntimeMs) &&
    existingRuntimeMs >= 0
  )
    return existingRuntimeMs;
}
function deriveGatewaySessionLifecycleSnapshot(params) {
  const phase = resolveLifecyclePhase(params.event);
  if (!phase) return {};
  const existing = params.session ?? void 0;
  if (phase === "start") {
    const startedAt = resolveLifecycleStartedAt(existing?.startedAt, params.event);
    return {
      updatedAt: startedAt ?? existing?.updatedAt,
      status: "running",
      startedAt,
      endedAt: void 0,
      runtimeMs: void 0,
      abortedLastRun: false,
    };
  }
  const startedAt = resolveLifecycleStartedAt(existing?.startedAt, params.event);
  const endedAt = resolveLifecycleEndedAt(params.event);
  return {
    updatedAt: endedAt ?? existing?.updatedAt,
    status: resolveTerminalStatus(params.event),
    startedAt,
    endedAt,
    runtimeMs: resolveRuntimeMs({
      startedAt,
      endedAt,
      existingRuntimeMs: existing?.runtimeMs,
    }),
    abortedLastRun: resolveTerminalStatus(params.event) === "killed",
  };
}
function derivePersistedSessionLifecyclePatch(params) {
  if (isRestartRecoveryLifecycleEvent(params)) return {};
  const snapshot = deriveGatewaySessionLifecycleSnapshot({
    session: params.entry ?? void 0,
    event: params.event,
  });
  const patch = {
    ...snapshot,
    updatedAt: typeof snapshot.updatedAt === "number" ? snapshot.updatedAt : void 0,
  };
  const runId = params.event.runId?.trim();
  const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
  const restartRecoveryRuns = params.entry?.restartRecoveryRuns;
  if (
    resolveLifecyclePhase(params.event) !== "start" &&
    runId &&
    lifecycleGeneration &&
    restartRecoveryRuns?.some(
      (run) => run.runId === runId && run.lifecycleGeneration === lifecycleGeneration,
    )
  ) {
    const remainingRuns = restartRecoveryRuns.filter(
      (run) => run.runId !== runId || run.lifecycleGeneration !== lifecycleGeneration,
    );
    if (remainingRuns.length > 0) return { restartRecoveryRuns: remainingRuns };
    patch.restartRecoveryRuns = void 0;
  }
  return patch;
}
function deriveGatewaySessionLifecycleProjectionPatch(params) {
  const { restartRecoveryRuns: _restartRecoveryRuns, ...patch } =
    derivePersistedSessionLifecyclePatch(params);
  return patch;
}
function isRestartRecoveryLifecycleEvent(params) {
  const runId = params.event.runId?.trim();
  const lifecycleGeneration = params.event.lifecycleGeneration?.trim();
  const phase = resolveLifecyclePhase(params.event);
  const interrupted = params.event.data?.stopReason === "restart";
  return (
    Boolean(
      runId &&
      lifecycleGeneration &&
      params.entry?.restartRecoveryRuns?.some(
        (run) => run.runId === runId && run.lifecycleGeneration === lifecycleGeneration,
      ),
    ) &&
    (phase === "start" || ((phase === "end" || phase === "error") && interrupted))
  );
}
/**
 * A pre-`sessions.reset` run's lifecycle event must not mutate a session row
 * whose sessionId was rotated by the reset. True only when both the owning
 * run's sessionId and the current row's sessionId are known and differ.
 */
function isStaleLifecycleEventForSession(params) {
  return Boolean(
    params.owningSessionId &&
    params.currentSessionId &&
    params.owningSessionId !== params.currentSessionId,
  );
}
function acceptsCronRunContinuationLifecycleEvent(params) {
  const marker = params.entry.cronRunContinuation;
  if (marker?.phase === "running") return true;
  const runId = params.event.runId?.trim();
  return Boolean(marker?.phase === "continuing" && runId && marker.ownerRunId === runId);
}
async function persistGatewaySessionLifecycleEvent(params) {
  if (!resolveLifecyclePhase(params.event)) return;
  const sessionEntry = loadSessionEntry(params.sessionKey, {
    ...(params.agentId ? { agentId: params.agentId } : {}),
    clone: false,
  });
  if (!sessionEntry.entry) return;
  const owningSessionId =
    typeof params.event.sessionId === "string" && params.event.sessionId
      ? params.event.sessionId
      : void 0;
  const exactCronRun = parseCronRunScopeSuffix(sessionEntry.canonicalKey).runId !== void 0;
  await updateSessionEntry(
    {
      storePath: sessionEntry.storePath,
      sessionKey: sessionEntry.canonicalKey,
    },
    async (entry) => {
      if (
        exactCronRun &&
        !acceptsCronRunContinuationLifecycleEvent({
          entry,
          event: params.event,
        })
      )
        return null;
      if (
        isStaleLifecycleEventForSession({
          owningSessionId,
          currentSessionId: entry.sessionId,
        })
      )
        return null;
      const patch = derivePersistedSessionLifecyclePatch({
        entry,
        event: params.event,
      });
      return Object.keys(patch).length > 0 ? patch : null;
    },
    {
      skipMaintenance: true,
      takeCacheOwnership: true,
      requireWriteSuccess: true,
    },
  );
}
//#endregion
export {
  persistGatewaySessionLifecycleEvent as i,
  isRestartRecoveryLifecycleEvent as n,
  isStaleLifecycleEventForSession as r,
  deriveGatewaySessionLifecycleProjectionPatch as t,
};
