import {
  a as getCommandLaneActiveTaskIds,
  m as resetCommandLane,
  o as getCommandLaneSnapshot,
} from "./command-queue-CVn1dJsm.js";
import {
  D as formatStoppedCronSessionDiagnosticFields,
  E as resolveStuckSessionRecoveryRef,
  O as resolveCronSessionDiagnosticContext,
  T as formatRecoveryOutcome,
} from "./diagnostic-DE-wbBb7.js";
import { a as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-C7EqD7j0.js";
import { t as diagnosticLogger } from "./diagnostic-runtime-BWVVh2ZW.js";
import { i as isDiagnosticSessionStateCurrent } from "./diagnostic-session-state-Gz0nXz2K.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { m as resolveActiveEmbeddedRunSessionId } from "./run-state-BJlMim-d.js";
import {
  C as resolveEmbeddedAgentReplyRunPhase,
  S as resolveActiveEmbeddedRunSessionIdBySessionFile,
  b as resolveActiveEmbeddedRunHandleSessionId,
  d as isEmbeddedAgentRunActive,
  f as isEmbeddedAgentRunHandleActive,
  t as abortAndDrainEmbeddedAgentRun,
  x as resolveActiveEmbeddedRunHandleSessionIdBySessionFile,
} from "./runs-GL_-RIwi.js";
//#region src/logging/diagnostic-stuck-session-recovery.runtime.ts
const STUCK_SESSION_ABORT_SETTLE_MS = 15e3;
const STUCK_SESSION_PROGRESS_STALE_MS = 5 * 6e4;
const STALE_ACTIVE_LANE_TASK_RELEASE_MS = STUCK_SESSION_PROGRESS_STALE_MS;
const recoveriesInFlight = /* @__PURE__ */ new Set();
function resolveStaleActiveProgressAbortMs(params) {
  const configured = params.staleActiveProgressAbortMs;
  return typeof configured === "number" && configured > 0
    ? configured
    : STUCK_SESSION_PROGRESS_STALE_MS;
}
function resolveStaleActiveLaneTaskReleaseMs(params) {
  const compactionSafetyTimeoutMs = params.compactionSafetyTimeoutMs;
  const compactionReleaseMs =
    typeof compactionSafetyTimeoutMs === "number" && compactionSafetyTimeoutMs > 0
      ? compactionSafetyTimeoutMs + STUCK_SESSION_ABORT_SETTLE_MS
      : 0;
  return Math.max(STALE_ACTIVE_LANE_TASK_RELEASE_MS, compactionReleaseMs);
}
function isActiveRunProgressStale(params) {
  if ((params.queueDepth ?? 0) <= 0) return false;
  const lastProgressAgeMs = getDiagnosticSessionActivitySnapshot({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
  }).lastProgressAgeMs;
  return typeof lastProgressAgeMs === "number" && lastProgressAgeMs >= params.staleAbortMs;
}
function formatRecoveryContext(params, extra) {
  const fields = [
    `sessionId=${params.sessionId ?? extra?.activeSessionId ?? "unknown"}`,
    `sessionKey=${params.sessionKey ?? "unknown"}`,
    `age=${Math.round(params.ageMs / 1e3)}s`,
    `queueDepth=${params.queueDepth ?? 0}`,
  ];
  if (extra?.activeSessionId) fields.push(`activeSessionId=${extra.activeSessionId}`);
  if (extra?.lane) fields.push(`lane=${extra.lane}`);
  if (extra?.activeCount !== void 0) fields.push(`laneActive=${extra.activeCount}`);
  if (extra?.queuedCount !== void 0) fields.push(`laneQueued=${extra.queuedCount}`);
  return fields.join(" ");
}
async function recoverStuckDiagnosticSession(params) {
  const key = resolveStuckSessionRecoveryRef(params);
  if (!key || recoveriesInFlight.has(key))
    return {
      status: "skipped",
      action: "observe_only",
      reason: key ? "already_in_flight" : "missing_session_ref",
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
    };
  recoveriesInFlight.add(key);
  try {
    if (
      !isDiagnosticSessionStateCurrent({
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        generation: params.stateGeneration,
        state: params.expectedState ?? "processing",
      })
    )
      return {
        status: "skipped",
        action: "observe_only",
        reason: "stale_session_state",
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
      };
    const fallbackActiveSessionId =
      params.sessionId && isEmbeddedAgentRunHandleActive(params.sessionId)
        ? params.sessionId
        : void 0;
    const fileActiveSessionId = params.sessionFile
      ? resolveActiveEmbeddedRunHandleSessionIdBySessionFile(params.sessionFile)
      : void 0;
    let activeSessionId = params.sessionKey
      ? (resolveActiveEmbeddedRunHandleSessionId(params.sessionKey) ??
        fileActiveSessionId ??
        fallbackActiveSessionId)
      : (fileActiveSessionId ?? fallbackActiveSessionId);
    const fileActiveWorkSessionId = params.sessionFile
      ? resolveActiveEmbeddedRunSessionIdBySessionFile(params.sessionFile)
      : void 0;
    const activeWorkSessionId = params.sessionKey
      ? (resolveActiveEmbeddedRunSessionId(params.sessionKey) ??
        fileActiveWorkSessionId ??
        params.sessionId)
      : (fileActiveWorkSessionId ?? params.sessionId);
    const sessionLane = key ? resolveEmbeddedSessionLane(key) : null;
    const preAbortActiveTaskIds = new Set(
      sessionLane ? getCommandLaneActiveTaskIds(sessionLane) : [],
    );
    let aborted = false;
    let drained = true;
    let forceCleared = false;
    const staleActiveProgressAbortMs = resolveStaleActiveProgressAbortMs(params);
    const staleActiveLaneTaskReleaseMs = resolveStaleActiveLaneTaskReleaseMs(params);
    if (activeSessionId) {
      const reclaimStaleActiveRun =
        params.allowActiveAbort !== true &&
        isActiveRunProgressStale({
          sessionId: activeSessionId,
          sessionKey: params.sessionKey,
          queueDepth: params.queueDepth,
          staleAbortMs: staleActiveProgressAbortMs,
        });
      if (params.allowActiveAbort !== true && !reclaimStaleActiveRun) {
        const outcome = {
          status: "skipped",
          action: "observe_only",
          reason: "active_embedded_run",
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          activeSessionId,
          activeWorkKind: "embedded_run",
        };
        diagnosticLogger.warn(
          `stuck session recovery skipped: ${formatRecoveryContext(params, { activeSessionId })}`,
        );
        diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
        return outcome;
      }
      if (reclaimStaleActiveRun)
        diagnosticLogger.warn(
          `stuck session recovery reclaiming stale active run: ${formatRecoveryContext(params, { activeSessionId })}`,
        );
      const result = await abortAndDrainEmbeddedAgentRun({
        sessionId: activeSessionId,
        sessionKey: params.sessionKey,
        settleMs: STUCK_SESSION_ABORT_SETTLE_MS,
        forceClear: true,
        reason: "stuck_recovery",
      });
      aborted = result.aborted;
      drained = result.drained;
      forceCleared = result.forceCleared;
    }
    if (!activeSessionId && activeWorkSessionId && isEmbeddedAgentRunActive(activeWorkSessionId)) {
      if (
        resolveEmbeddedAgentReplyRunPhase(activeWorkSessionId) ===
        "waiting_for_deferred_maintenance"
      ) {
        const outcome = {
          status: "skipped",
          action: "keep_lane",
          reason: "deferred_maintenance_wait",
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          activeSessionId: activeWorkSessionId,
        };
        diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
        return outcome;
      }
      const reclaimStaleReplyWork =
        params.allowActiveAbort !== true &&
        isActiveRunProgressStale({
          sessionId: activeWorkSessionId,
          sessionKey: params.sessionKey,
          queueDepth: params.queueDepth,
          staleAbortMs: staleActiveProgressAbortMs,
        });
      if (params.allowActiveAbort === true || reclaimStaleReplyWork) {
        if (reclaimStaleReplyWork)
          diagnosticLogger.warn(
            `stuck session recovery reclaiming stale active reply work: ${formatRecoveryContext(params, { activeSessionId: activeWorkSessionId })}`,
          );
        const result = await abortAndDrainEmbeddedAgentRun({
          sessionId: activeWorkSessionId,
          sessionKey: params.sessionKey,
          settleMs: STUCK_SESSION_ABORT_SETTLE_MS,
          forceClear: true,
          reason: "stuck_recovery",
        });
        aborted = result.aborted;
        drained = result.drained;
        forceCleared = result.forceCleared;
        activeSessionId = activeWorkSessionId;
      } else {
        const outcome = {
          status: "skipped",
          action: "keep_lane",
          reason: "active_reply_work",
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          activeSessionId: activeWorkSessionId,
          activeWorkKind: "embedded_run",
        };
        diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
        return outcome;
      }
    }
    if (!activeSessionId && sessionLane) {
      const laneSnapshot = getCommandLaneSnapshot(sessionLane);
      if (laneSnapshot.activeCount > 0) {
        if (
          !getCommandLaneActiveTaskIds(sessionLane).some((id) => !preAbortActiveTaskIds.has(id)) &&
          params.ageMs >= staleActiveLaneTaskReleaseMs
        ) {
          const released = resetCommandLane(sessionLane);
          const outcome = {
            status: "released",
            action: "release_lane",
            reason: "stale_lane_task",
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            lane: sessionLane,
            released,
            queuedCount: laneSnapshot.queuedCount,
          };
          diagnosticLogger.warn(
            `stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`,
          );
          return outcome;
        }
        const outcome = {
          status: "skipped",
          action: "keep_lane",
          reason: "active_lane_task",
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          lane: sessionLane,
          activeCount: laneSnapshot.activeCount,
          queuedCount: laneSnapshot.queuedCount,
        };
        diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
        return outcome;
      }
    }
    const queuedCount = sessionLane ? getCommandLaneSnapshot(sessionLane).queuedCount : 0;
    const laneStartedFreshTask =
      sessionLane !== null &&
      getCommandLaneActiveTaskIds(sessionLane).some((id) => !preAbortActiveTaskIds.has(id));
    const hasQueuedSessionWork = (params.queueDepth ?? 0) > 0;
    const released =
      sessionLane &&
      !laneStartedFreshTask &&
      (queuedCount > 0 || hasQueuedSessionWork || !activeSessionId || !aborted || !drained)
        ? resetCommandLane(sessionLane)
        : 0;
    const clearStaleQueuedSession = !aborted && released === 0 && (params.queueDepth ?? 0) > 0;
    if (aborted || forceCleared || released > 0 || clearStaleQueuedSession) {
      const action = aborted || forceCleared ? "abort_embedded_run" : "release_lane";
      const stoppedFields = formatStoppedCronSessionDiagnosticFields(
        resolveCronSessionDiagnosticContext({
          sessionKey: params.sessionKey,
          activeSessionId,
        }),
      );
      diagnosticLogger.warn(
        `stuck session recovery: sessionId=${params.sessionId ?? activeSessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} age=${Math.round(params.ageMs / 1e3)}s action=${action} aborted=${aborted} drained=${drained} released=${released}${stoppedFields ? ` ${stoppedFields}` : ""}`,
      );
      const outcome =
        aborted || forceCleared
          ? {
              status: "aborted",
              action: "abort_embedded_run",
              sessionId: params.sessionId,
              sessionKey: params.sessionKey,
              activeSessionId,
              activeWorkKind: "embedded_run",
              aborted,
              drained,
              forceCleared,
              released,
              lane: sessionLane ?? void 0,
              ...(queuedCount > 0 ? { queuedCount } : {}),
            }
          : {
              status: "released",
              action: "release_lane",
              sessionId: params.sessionId,
              sessionKey: params.sessionKey,
              released,
              lane: sessionLane ?? void 0,
            };
      diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
      return outcome;
    }
    const outcome = {
      status: "noop",
      action: "none",
      reason: "no_active_work",
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      lane: sessionLane ?? void 0,
    };
    diagnosticLogger.warn(`stuck session recovery outcome: ${formatRecoveryOutcome(outcome)}`);
    return outcome;
  } catch (err) {
    const outcome = {
      status: "failed",
      action: "none",
      reason: "exception",
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      error: String(err),
    };
    diagnosticLogger.warn(
      `stuck session recovery failed: sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} err=${String(err)}`,
    );
    return outcome;
  } finally {
    recoveriesInFlight.delete(key);
  }
}
/** Test hooks for clearing in-flight recovery guards. */
const testing = {
  resetRecoveriesInFlight() {
    recoveriesInFlight.clear();
  },
};
//#endregion
export { testing as __testing, testing, recoverStuckDiagnosticSession };
