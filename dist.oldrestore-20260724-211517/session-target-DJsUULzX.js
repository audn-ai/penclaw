//#region src/cron/session-target.ts
/** Resolves and validates session-target keys used by cron jobs and delivery. */
const INVALID_CRON_SESSION_TARGET_ID_ERROR = "invalid cron sessionTarget session id";
/** Returns whether an error came from cron session target id validation. */
function isInvalidCronSessionTargetIdError(error) {
  return error instanceof Error && error.message === INVALID_CRON_SESSION_TARGET_ID_ERROR;
}
/** Validates the opaque session id portion of a `session:` cron target. */
function assertSafeCronSessionTargetId(sessionId) {
  const trimmed = sessionId.trim();
  if (!trimmed) throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
  if (trimmed.includes("\0")) throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
  return trimmed;
}
/** Extracts the persistent session key from a `session:` cron target, if present. */
function resolveCronSessionTargetSessionKey(sessionTarget) {
  if (typeof sessionTarget !== "string" || !sessionTarget.startsWith("session:")) return;
  return assertSafeCronSessionTargetId(sessionTarget.slice(8));
}
/** Returns whether cron executes the job in a detached run session. */
function isDetachedCronSessionTarget(sessionTarget) {
  return sessionTarget === "isolated" || sessionTarget === "current";
}
/** Preserves `current` with a creation-time sessionKey so future active UI state is irrelevant. */
function resolveCronCurrentSessionTarget(params) {
  if (params.sessionTarget !== "current") return params.sessionTarget ?? void 0;
  return params.sessionKey?.trim() ? "current" : "isolated";
}
/** Chooses the session key used for cron delivery, preferring explicit persistent targets. */
function resolveCronDeliverySessionKey(job) {
  const sessionTargetKey = resolveCronSessionTargetSessionKey(job.sessionTarget);
  if (sessionTargetKey) return sessionTargetKey;
  return typeof job.sessionKey === "string" && job.sessionKey.trim()
    ? job.sessionKey.trim()
    : void 0;
}
/** Returns the notification session key, falling back to a stable per-job failure session. */
function resolveCronNotificationSessionKey(params) {
  return typeof params.sessionKey === "string" && params.sessionKey.trim()
    ? params.sessionKey.trim()
    : `cron:${params.jobId}:failure`;
}
//#endregion
export {
  resolveCronDeliverySessionKey as a,
  resolveCronCurrentSessionTarget as i,
  isDetachedCronSessionTarget as n,
  resolveCronNotificationSessionKey as o,
  isInvalidCronSessionTargetIdError as r,
  resolveCronSessionTargetSessionKey as s,
  assertSafeCronSessionTargetId as t,
};
