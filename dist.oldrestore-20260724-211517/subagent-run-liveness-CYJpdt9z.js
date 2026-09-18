import {
  o as asDateTimestampMs,
  p as finiteSecondsToTimerSafeMilliseconds,
} from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
//#region src/agents/subagent-run-timeout.ts
/**
 * Subagent run timeout math.
 *
 * Separates timer-safe delays from duration/deadline values because setTimeout has stricter bounds.
 */
/** Convert subagent timeout seconds to a timer-safe delay. */
function resolveSubagentRunTimerDelayMs(timeoutSeconds) {
  return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds, { floorSeconds: true });
}
/** Convert subagent timeout seconds to a finite millisecond duration. */
function resolveSubagentRunDurationMs(timeoutSeconds) {
  if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0)
    return;
  const durationMs = Math.floor(timeoutSeconds) * 1e3;
  return Number.isSafeInteger(durationMs) && durationMs > 0 ? durationMs : void 0;
}
/** Resolve the absolute timeout deadline for a subagent run. */
function resolveSubagentRunDeadlineMs(entry, observedStartedAt) {
  const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
  if (durationMs === void 0) return;
  const safeStartedAt = asDateTimestampMs(
    typeof observedStartedAt === "number" && Number.isFinite(observedStartedAt)
      ? observedStartedAt
      : typeof entry.startedAt === "number" && Number.isFinite(entry.startedAt)
        ? entry.startedAt
        : entry.createdAt,
  );
  if (safeStartedAt === void 0) return;
  const deadlineMs = safeStartedAt + durationMs;
  return Number.isSafeInteger(deadlineMs) && asDateTimestampMs(deadlineMs) !== void 0
    ? deadlineMs
    : void 0;
}
/** Clamp a reported terminal time to the run's explicit timeout deadline. */
function resolveSubagentRunEffectiveEndedAt(entry, endedAt, observedStartedAt) {
  const deadlineMs = resolveSubagentRunDeadlineMs(entry, observedStartedAt);
  return deadlineMs !== void 0 && endedAt > deadlineMs ? deadlineMs : endedAt;
}
//#endregion
//#region src/agents/subagent-lifecycle-events.ts
/**
 * Shared subagent lifecycle event literals.
 *
 * Event writers and readers use these constants to keep subagent target,
 * end-reason, and outcome values stable across registry/runtime boundaries.
 */
/** Target kind used for subagent lifecycle events. */
const SUBAGENT_TARGET_KIND_SUBAGENT = "subagent";
/** End reason for a completed subagent run. */
const SUBAGENT_ENDED_REASON_COMPLETE = "subagent-complete";
/** End reason for a failed subagent run. */
const SUBAGENT_ENDED_REASON_ERROR = "subagent-error";
/** End reason for an explicitly killed subagent run. */
const SUBAGENT_ENDED_REASON_KILLED = "subagent-killed";
/** Error subagent lifecycle outcome. */
const SUBAGENT_ENDED_OUTCOME_ERROR = "error";
/** Timeout subagent lifecycle outcome. */
const SUBAGENT_ENDED_OUTCOME_TIMEOUT = "timeout";
/** Killed subagent lifecycle outcome. */
const SUBAGENT_ENDED_OUTCOME_KILLED = "killed";
//#endregion
//#region src/agents/subagent-session-metrics.ts
/**
 * Subagent session metric helpers.
 *
 * Derives display/runtime status from partial live, archived, or recovered registry records.
 */
function resolveSubagentSessionStartedAtInternal(entry) {
  if (typeof entry.sessionStartedAt === "number" && Number.isFinite(entry.sessionStartedAt))
    return entry.sessionStartedAt;
  if (typeof entry.startedAt === "number" && Number.isFinite(entry.startedAt))
    return entry.startedAt;
  return typeof entry.createdAt === "number" && Number.isFinite(entry.createdAt)
    ? entry.createdAt
    : void 0;
}
/** Returns the best available session start timestamp for a run record. */
function getSubagentSessionStartedAt(entry) {
  return entry ? resolveSubagentSessionStartedAtInternal(entry) : void 0;
}
/** Computes accumulated runtime including the current live run when still active. */
function getSubagentSessionRuntimeMs(entry, now = Date.now()) {
  if (!entry) return;
  const accumulatedRuntimeMs =
    typeof entry.accumulatedRuntimeMs === "number" && Number.isFinite(entry.accumulatedRuntimeMs)
      ? Math.max(0, entry.accumulatedRuntimeMs)
      : 0;
  if (typeof entry.startedAt !== "number" || !Number.isFinite(entry.startedAt))
    return entry.accumulatedRuntimeMs != null ? accumulatedRuntimeMs : void 0;
  const currentRunEndedAt =
    typeof entry.endedAt === "number" && Number.isFinite(entry.endedAt) ? entry.endedAt : now;
  return Math.max(0, accumulatedRuntimeMs + Math.max(0, currentRunEndedAt - entry.startedAt));
}
/** Maps persisted run outcome fields to the compact session status shown in tools/UI. */
function resolveSubagentSessionStatus(entry) {
  if (!entry) return;
  if (!entry.endedAt) return "running";
  if (entry.endedReason === "subagent-killed") return "killed";
  const status = entry.outcome?.status;
  if (status === "error") return "failed";
  if (status === "timeout") return "timeout";
  return "done";
}
//#endregion
//#region src/agents/subagent-run-liveness.ts
const STALE_UNENDED_SUBAGENT_RUN_MS = 7200 * 1e3;
const RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS = 1800 * 1e3;
const EXPLICIT_TIMEOUT_STALE_GRACE_MS = 6e4;
const MIN_REALISTIC_RUN_TIMESTAMP_MS = Date.UTC(2020, 0, 1);
/** Return whether a subagent run has a finite endedAt timestamp. */
function hasSubagentRunEnded(entry) {
  return typeof entry.endedAt === "number" && Number.isFinite(entry.endedAt);
}
function resolveStaleCutoffMs(entry) {
  const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
  if (durationMs !== void 0)
    return Math.max(STALE_UNENDED_SUBAGENT_RUN_MS, durationMs + EXPLICIT_TIMEOUT_STALE_GRACE_MS);
  return STALE_UNENDED_SUBAGENT_RUN_MS;
}
/** Return whether an unended subagent run is stale enough to hide as inactive. */
function isStaleUnendedSubagentRun(entry, now = Date.now()) {
  if (hasSubagentRunEnded(entry)) return false;
  const startedAt = getSubagentSessionStartedAt(entry);
  if (
    typeof startedAt !== "number" ||
    !Number.isFinite(startedAt) ||
    startedAt < MIN_REALISTIC_RUN_TIMESTAMP_MS
  )
    return false;
  return now - startedAt > resolveStaleCutoffMs(entry);
}
/** Return whether a subagent run is still live and unended. */
function isLiveUnendedSubagentRun(entry, now = Date.now()) {
  return !hasSubagentRunEnded(entry) && !isStaleUnendedSubagentRun(entry, now);
}
function isRecentlyEndedSubagentRun(
  entry,
  now = Date.now(),
  recentMs = RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS,
) {
  if (!hasSubagentRunEnded(entry)) return false;
  return now - entry.endedAt <= recentMs;
}
/** Return whether a child-session link should still appear in subagent listings. */
function shouldKeepSubagentRunChildLink(entry, options) {
  const now = options?.now ?? Date.now();
  return (
    isLiveUnendedSubagentRun(entry, now) ||
    (options?.activeDescendants ?? 0) > 0 ||
    isRecentlyEndedSubagentRun(entry, now)
  );
}
//#endregion
export {
  resolveSubagentRunEffectiveEndedAt as _,
  shouldKeepSubagentRunChildLink as a,
  resolveSubagentSessionStatus as c,
  SUBAGENT_ENDED_OUTCOME_TIMEOUT as d,
  SUBAGENT_ENDED_REASON_COMPLETE as f,
  resolveSubagentRunDeadlineMs as g,
  SUBAGENT_TARGET_KIND_SUBAGENT as h,
  isStaleUnendedSubagentRun as i,
  SUBAGENT_ENDED_OUTCOME_ERROR as l,
  SUBAGENT_ENDED_REASON_KILLED as m,
  hasSubagentRunEnded as n,
  getSubagentSessionRuntimeMs as o,
  SUBAGENT_ENDED_REASON_ERROR as p,
  isLiveUnendedSubagentRun as r,
  getSubagentSessionStartedAt as s,
  RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS as t,
  SUBAGENT_ENDED_OUTCOME_KILLED as u,
  resolveSubagentRunTimerDelayMs as v,
};
