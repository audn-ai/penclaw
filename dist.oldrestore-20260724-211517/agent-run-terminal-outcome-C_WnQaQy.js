import { t as asBoolean } from "./boolean-CrriykWV.js";
import {
  a as isAbortedAgentStopReason,
  n as AGENT_RUN_RESTART_ABORT_STOP_REASON,
  t as AGENT_RUN_ABORTED_ERROR,
} from "./run-termination-BEbihwT8.js";
//#region src/shared/agent-liveness.ts
/** Return true for the normalized liveness state that means a run is blocked. */
function isBlockedLivenessState(livenessState) {
  return typeof livenessState === "string" && livenessState.trim().toLowerCase() === "blocked";
}
/** Return true for the normalized liveness state that means a run ended incomplete. */
function isAbandonedLivenessState(livenessState) {
  return typeof livenessState === "string" && livenessState.trim().toLowerCase() === "abandoned";
}
/** Convert a blocked-run error payload into a user-facing wait/status message. */
function formatBlockedLivenessError(error) {
  return (
    (typeof error === "string" ? error.trim() : "") ||
    "Agent run blocked before producing a usable result."
  );
}
/** Convert an abandoned-run error payload into a user-facing wait/status message. */
function formatAbandonedLivenessError(error) {
  return (
    (typeof error === "string" ? error.trim() : "") ||
    "Agent run ended before producing a complete result."
  );
}
/** Coerce any blocked liveness state into an error status while preserving other statuses. */
function normalizeBlockedLivenessWaitStatus(params) {
  const error = typeof params.error === "string" ? params.error : void 0;
  if (!isBlockedLivenessState(params.livenessState))
    return {
      status: params.status,
      error,
    };
  return {
    status: "error",
    error: formatBlockedLivenessError(error),
  };
}
//#endregion
//#region src/agents/run-timeout-attribution.ts
const AGENT_RUN_TIMEOUT_PHASE_SET = /* @__PURE__ */ new Set([
  "queue",
  "preflight",
  "provider",
  "post_turn",
  "gateway_draining",
]);
/** Normalizes raw timeout phase metadata into a known agent run phase. */
function normalizeAgentRunTimeoutPhase(value) {
  if (typeof value !== "string") return;
  const normalized = value.trim();
  return AGENT_RUN_TIMEOUT_PHASE_SET.has(normalized) ? normalized : void 0;
}
//#endregion
//#region src/agents/agent-run-terminal-outcome.ts
/** Normalizes agent run wait/liveness/timeout metadata into sticky terminal outcomes. */
/** Shared grace window for terminal observations that may still be followed by a retry. */
const AGENT_RUN_TERMINAL_RETRY_GRACE_MS = 15e3;
const HARD_TIMEOUT_PHASES = /* @__PURE__ */ new Set(["preflight", "provider", "post_turn"]);
function asFiniteTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asNonEmptyString(value) {
  return typeof value === "string" && value.trim() ? value : void 0;
}
/** True when a timeout phase should be treated as a hard agent-run timeout. */
function isHardAgentRunTimeoutPhase(value) {
  const phase = normalizeAgentRunTimeoutPhase(value);
  return phase !== void 0 && HARD_TIMEOUT_PHASES.has(phase);
}
/** True when an existing outcome is a hard timeout. */
function isHardAgentRunTimeoutOutcome(outcome) {
  return outcome?.reason === "hard_timeout";
}
/** True when an outcome should not be overwritten by ordinary later status. */
function isStickyAgentRunTerminalOutcome(outcome) {
  return outcome?.reason === "hard_timeout" || outcome?.reason === "cancelled";
}
function isCancellationStopReason(value) {
  return value === "rpc" || value === "stop";
}
function asAgentRunWaitStatus(value) {
  return value === "ok" || value === "timeout" || value === "error" || value === "pending"
    ? value
    : void 0;
}
/** Builds the normalized terminal outcome from raw run status metadata. */
function buildAgentRunTerminalOutcome(input) {
  const stopReason = asNonEmptyString(input.stopReason);
  const livenessState = asNonEmptyString(input.livenessState);
  const timeoutPhase = normalizeAgentRunTimeoutPhase(input.timeoutPhase);
  const providerStarted = asBoolean(input.providerStarted);
  const rawError = asNonEmptyString(input.error);
  const restartCancelled = stopReason === AGENT_RUN_RESTART_ABORT_STOP_REASON;
  const hardTimeout =
    isHardAgentRunTimeoutPhase(timeoutPhase) ||
    (!restartCancelled && input.status === "timeout" && providerStarted === true);
  const aborted = isAbortedAgentStopReason(stopReason) && !restartCancelled;
  const cancelled =
    restartCancelled || (input.status !== "ok" && isCancellationStopReason(stopReason));
  const blocked = isBlockedLivenessState(livenessState);
  const abandoned = isAbandonedLivenessState(livenessState);
  const error = hardTimeout
    ? rawError
    : blocked
      ? formatBlockedLivenessError(rawError)
      : aborted && !rawError
        ? AGENT_RUN_ABORTED_ERROR
        : aborted || cancelled
          ? rawError
          : abandoned
            ? formatAbandonedLivenessError(rawError)
            : rawError;
  const reason = hardTimeout
    ? "hard_timeout"
    : blocked
      ? "blocked"
      : aborted
        ? "aborted"
        : cancelled
          ? "cancelled"
          : abandoned
            ? "abandoned"
            : input.status === "timeout"
              ? "timed_out"
              : input.status === "error"
                ? "failed"
                : "completed";
  return {
    reason,
    status:
      reason === "completed"
        ? "ok"
        : reason === "hard_timeout" || reason === "timed_out"
          ? "timeout"
          : "error",
    ...(error ? { error } : {}),
    ...(stopReason ? { stopReason } : {}),
    ...(livenessState ? { livenessState } : {}),
    ...(timeoutPhase ? { timeoutPhase } : {}),
    ...(providerStarted !== void 0 ? { providerStarted } : {}),
    ...(asFiniteTimestamp(input.startedAt) !== void 0
      ? { startedAt: asFiniteTimestamp(input.startedAt) }
      : {}),
    ...(asFiniteTimestamp(input.endedAt) !== void 0
      ? { endedAt: asFiniteTimestamp(input.endedAt) }
      : {}),
  };
}
/** Builds a terminal outcome from a wait result, ignoring pending/unknown status. */
/** Builds a terminal outcome from wait paths where status may still be pending/unknown. */
function buildAgentRunTerminalOutcomeFromWaitResult(wait) {
  const status = asAgentRunWaitStatus(wait?.status);
  if (!status || status === "pending") return;
  return buildAgentRunTerminalOutcome({
    status,
    error: wait?.error,
    stopReason: wait?.stopReason,
    livenessState: wait?.livenessState,
    timeoutPhase: wait?.timeoutPhase,
    providerStarted: wait?.providerStarted,
    startedAt: wait?.startedAt,
    endedAt: wait?.endedAt,
  });
}
function completedBeforeOrAtTimeout(params) {
  return (
    params.completed.reason === "completed" &&
    typeof params.completed.endedAt === "number" &&
    typeof params.timeout.endedAt === "number" &&
    params.completed.endedAt <= params.timeout.endedAt
  );
}
/** Merges terminal outcomes while preserving cancellation and hard-timeout ownership. */
/** Merges later terminal observations without overwriting sticky cancellation/hard-timeout state. */
function mergeAgentRunTerminalOutcome(current, incoming) {
  if (!current) return incoming;
  if (current.reason === "cancelled") return current;
  if (isHardAgentRunTimeoutOutcome(current))
    return completedBeforeOrAtTimeout({
      completed: incoming,
      timeout: current,
    })
      ? incoming
      : current;
  if (incoming.reason === "cancelled") return incoming;
  if (isHardAgentRunTimeoutOutcome(incoming))
    return completedBeforeOrAtTimeout({
      completed: current,
      timeout: incoming,
    })
      ? current
      : incoming;
  return incoming;
}
//#endregion
export {
  mergeAgentRunTerminalOutcome as a,
  formatBlockedLivenessError as c,
  normalizeBlockedLivenessWaitStatus as d,
  isStickyAgentRunTerminalOutcome as i,
  isAbandonedLivenessState as l,
  buildAgentRunTerminalOutcome as n,
  normalizeAgentRunTimeoutPhase as o,
  buildAgentRunTerminalOutcomeFromWaitResult as r,
  formatAbandonedLivenessError as s,
  AGENT_RUN_TERMINAL_RETRY_GRACE_MS as t,
  isBlockedLivenessState as u,
};
