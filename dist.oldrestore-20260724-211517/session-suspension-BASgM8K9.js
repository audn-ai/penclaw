import { AsyncLocalStorage } from "node:async_hooks";
import path from "node:path";
import "./number-coercion-EqFmHmOw.js";
import { h as setCommandLaneConcurrency } from "./command-queue-CVn1dJsm.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import {
  G as resolveAgentMaxConcurrent,
  K as resolveSubagentMaxConcurrent,
  U as resolveCronMaxConcurrentRuns,
} from "./io-B3ne6NxF.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import { D as patchSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { a as resolveStoredSessionKeyForSessionId } from "./session-CABQ2dYG.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/session-suspension.ts
/**
 * Session suspension and lane auto-resume helpers.
 *
 * Records quota/manual/circuit suspensions and temporarily lowers command-lane concurrency.
 */
const log = createSubsystemLogger("session-suspension");
const DEFAULT_CUSTOM_LANE_RESUME_CONCURRENCY = 1;
const DEFAULT_QUOTA_SUSPENSION_RESUME_MS = 1800 * 1e3;
/**
 * Keep timer shutdown state process-global so bundled gateway chunks cannot
 * leave one module copy scheduling lane resumes after another copy cleaned up.
 */
const SESSION_SUSPENSION_STATE_KEY = Symbol.for("openclaw.sessionSuspensionRuntimeState");
function getSessionSuspensionState() {
  const state = resolveGlobalSingleton(SESSION_SUSPENSION_STATE_KEY, () => ({
    laneResumeTimers: /* @__PURE__ */ new Map(),
    clearedLaneResumes: /* @__PURE__ */ new Map(),
    pendingSuspensionWrites: /* @__PURE__ */ new Map(),
    suspensionWriteChain: Promise.resolve(),
    cleanupGeneration: 0,
    cleanupActive: false,
  }));
  if (!state.clearedLaneResumes) state.clearedLaneResumes = /* @__PURE__ */ new Map();
  if (!state.pendingSuspensionWrites) state.pendingSuspensionWrites = /* @__PURE__ */ new Map();
  if (state.suspensionWriteChain === void 0) state.suspensionWriteChain = Promise.resolve();
  return state;
}
const deferredSessionSuspension = new AsyncLocalStorage();
function resolveLaneResumeConcurrency(cfg, laneId) {
  switch (laneId) {
    case "main":
      return resolveAgentMaxConcurrent(cfg);
    case "subagent":
      return resolveSubagentMaxConcurrent(cfg);
    case "cron":
    case "cron-nested":
      return resolveCronMaxConcurrentRuns(cfg?.cron);
    default:
      return DEFAULT_CUSTOM_LANE_RESUME_CONCURRENCY;
  }
}
function isGatewayManagedLane(laneId) {
  const lane = laneId;
  return (
    lane === "main" ||
    lane === "subagent" ||
    lane === "cron" ||
    lane === "cron-nested" ||
    lane === "nested"
  );
}
function resolveSessionSuspensionReason(reason) {
  if (reason === "billing") return "manual";
  if (reason === "rate_limit") return "quota_exhausted";
  return "circuit_open";
}
function runWithDeferredSessionSuspension(run, onDeferred) {
  return deferredSessionSuspension.run(
    {
      claimed: false,
      onDeferred,
    },
    run,
  );
}
function resolveSessionSuspensionTarget() {
  const scope = deferredSessionSuspension.getStore();
  if (!scope || scope.claimed) return { mode: "suspend" };
  scope.claimed = true;
  return {
    mode: "defer",
    defer: (params) => scope.onDeferred?.(params),
  };
}
function scheduleLaneAutoResume(laneId, delayMs, resumeConcurrency, opts = {}) {
  const nowMs = opts.nowMs ?? Date.now();
  const state = getSessionSuspensionState();
  const existing = state.laneResumeTimers.get(laneId);
  if (existing) clearTimeout(existing.timer);
  const timer = setTimeout(() => {
    if (state.laneResumeTimers.get(laneId)?.timer === timer) state.laneResumeTimers.delete(laneId);
    setCommandLaneConcurrency(laneId, resumeConcurrency);
    log.info("auto-resumed lane after suspension TTL", {
      laneId,
      delayMs,
      resumeConcurrency,
    });
  }, delayMs);
  if (typeof timer.unref === "function") timer.unref();
  state.laneResumeTimers.set(laneId, {
    timer,
    resumeConcurrency,
    resumeAtMs: nowMs + delayMs,
  });
}
function clearSessionSuspensionTimers() {
  const state = getSessionSuspensionState();
  state.cleanupGeneration += 1;
  state.cleanupActive = true;
  let cleared = 0;
  for (const [laneId, entry] of state.laneResumeTimers) {
    clearTimeout(entry.timer);
    state.clearedLaneResumes.set(laneId, {
      resumeConcurrency: entry.resumeConcurrency,
      resumeAtMs: entry.resumeAtMs,
    });
    cleared += 1;
  }
  state.laneResumeTimers.clear();
  return cleared;
}
function enableSessionSuspensionTimersForGatewayStart(
  resolveResumeConcurrency = (_laneId, savedResumeConcurrency) => savedResumeConcurrency,
) {
  const state = getSessionSuspensionState();
  state.cleanupGeneration += 1;
  state.cleanupActive = false;
  const suspendedLaneIds = /* @__PURE__ */ new Set();
  const nowMs = Date.now();
  for (const [laneId, cleared] of state.clearedLaneResumes) {
    const resumeConcurrency = resolveResumeConcurrency(laneId, cleared.resumeConcurrency);
    const remainingMs = resolveTimerTimeoutMs(cleared.resumeAtMs - nowMs, 0, 0);
    if (remainingMs > 0) {
      setCommandLaneConcurrency(laneId, 0);
      scheduleLaneAutoResume(laneId, remainingMs, resumeConcurrency, { nowMs });
      suspendedLaneIds.add(laneId);
      continue;
    }
    if (isGatewayManagedLane(laneId)) continue;
    setCommandLaneConcurrency(laneId, resumeConcurrency);
  }
  state.clearedLaneResumes.clear();
  return suspendedLaneIds;
}
function getCleanupSuspendedLaneIdsForGatewayPublication() {
  const state = getSessionSuspensionState();
  return state.cleanupActive ? new Set(state.clearedLaneResumes.keys()) : /* @__PURE__ */ new Set();
}
async function suspendSession(params) {
  const state = getSessionSuspensionState();
  const queuedGeneration = state.cleanupGeneration;
  const run = state.suspensionWriteChain
    .catch(() => void 0)
    .then(() => suspendSessionQueued(params, queuedGeneration));
  state.suspensionWriteChain = run.then(
    () => void 0,
    () => void 0,
  );
  await run;
}
async function suspendSessionQueued(params, queuedGeneration) {
  if (!params.cfg) return;
  const { sessionKey, storePath } = resolveStoredSessionKeyForSessionId({
    cfg: params.cfg,
    sessionId: params.sessionId,
    agentId: params.agentDir ? path.basename(params.agentDir) : void 0,
  });
  if (!sessionKey) return;
  const ttlMs = resolveTimerTimeoutMs(params.ttlMs, DEFAULT_QUOTA_SUSPENSION_RESUME_MS, 0);
  const now = Date.now();
  const expectedResumeBy = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now }) ?? now;
  const state = getSessionSuspensionState();
  if (state.cleanupActive || state.cleanupGeneration !== queuedGeneration) return;
  const suspensionGeneration = state.cleanupGeneration;
  const pendingWriteKey = `${storePath}\0${sessionKey}`;
  const existingPendingWrite = state.pendingSuspensionWrites.get(pendingWriteKey);
  const pendingWrite =
    existingPendingWrite?.generation === suspensionGeneration
      ? existingPendingWrite
      : {
          generation: suspensionGeneration,
          previousQuotaSuspension: void 0,
          previousSnapshotCaptured: false,
          activeCount: 0,
        };
  pendingWrite.activeCount += 1;
  state.pendingSuspensionWrites.set(pendingWriteKey, pendingWrite);
  const releasePendingWrite = () => {
    pendingWrite.activeCount -= 1;
    if (
      pendingWrite.activeCount <= 0 &&
      getSessionSuspensionState().pendingSuspensionWrites.get(pendingWriteKey) === pendingWrite
    )
      getSessionSuspensionState().pendingSuspensionWrites.delete(pendingWriteKey);
  };
  const throttleLane = () => {
    if (!params.laneId) return;
    setCommandLaneConcurrency(params.laneId, 0);
    scheduleLaneAutoResume(
      params.laneId,
      ttlMs,
      resolveLaneResumeConcurrency(params.cfg, params.laneId),
    );
  };
  let persistedSuspension;
  try {
    persistedSuspension =
      (await patchSessionEntry(
        {
          storePath,
          sessionKey,
        },
        (entry) => {
          if (getSessionSuspensionState().cleanupGeneration !== suspensionGeneration) return null;
          if (!pendingWrite.previousSnapshotCaptured) {
            pendingWrite.previousQuotaSuspension = entry.quotaSuspension;
            pendingWrite.previousSnapshotCaptured = true;
          }
          return {
            quotaSuspension: {
              schemaVersion: 1,
              suspendedAt: now,
              reason: params.reason,
              failedProvider: params.failedProvider,
              failedModel: params.failedModel,
              summary: params.summary,
              laneId: params.laneId,
              expectedResumeBy,
              state: "suspended",
            },
          };
        },
        {
          skipMaintenance: true,
          takeCacheOwnership: true,
        },
      )) !== null;
  } catch (err) {
    log.warn("failed to persist quota suspension; applying transient lane throttle", {
      sessionId: params.sessionId,
      laneId: params.laneId,
      error: err instanceof Error ? err.message : String(err),
    });
    releasePendingWrite();
    if (
      !getSessionSuspensionState().cleanupActive &&
      suspensionGeneration === getSessionSuspensionState().cleanupGeneration
    )
      throttleLane();
    return;
  }
  const postPatchState = getSessionSuspensionState();
  if (
    persistedSuspension &&
    (postPatchState.cleanupActive || suspensionGeneration !== postPatchState.cleanupGeneration)
  ) {
    try {
      await patchSessionEntry(
        {
          storePath,
          sessionKey,
        },
        (entry) =>
          entry.quotaSuspension?.suspendedAt === now &&
          entry.quotaSuspension.reason === params.reason &&
          entry.quotaSuspension.failedProvider === params.failedProvider &&
          entry.quotaSuspension.failedModel === params.failedModel &&
          entry.quotaSuspension.laneId === params.laneId
            ? { quotaSuspension: pendingWrite.previousQuotaSuspension }
            : null,
        {
          skipMaintenance: true,
          takeCacheOwnership: true,
        },
      );
    } catch (err) {
      log.warn("failed to clear quota suspension after shutdown cleanup", {
        sessionId: params.sessionId,
        laneId: params.laneId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    releasePendingWrite();
    return;
  }
  if (persistedSuspension) throttleLane();
  releasePendingWrite();
}
//#endregion
export {
  resolveSessionSuspensionTarget as a,
  resolveSessionSuspensionReason as i,
  enableSessionSuspensionTimersForGatewayStart as n,
  runWithDeferredSessionSuspension as o,
  getCleanupSuspendedLaneIdsForGatewayPublication as r,
  suspendSession as s,
  clearSessionSuspensionTimers as t,
};
