//#region src/agents/session-write-lock-error.ts
/**
 * Session write-lock error types and guards.
 *
 * Session persistence uses stable error codes so callers can distinguish lock
 * contention or stale lock cleanup from ordinary write failures.
 */
const SESSION_WRITE_LOCK_TIMEOUT_CODE = "OPENCLAW_SESSION_WRITE_LOCK_TIMEOUT";
const SESSION_WRITE_LOCK_STALE_CODE = "OPENCLAW_SESSION_WRITE_LOCK_STALE";
/** Error thrown when a session write lock cannot be acquired before timeout. */
var SessionWriteLockTimeoutError = class extends Error {
  constructor(params) {
    super(
      `session file locked (timeout ${params.timeoutMs}ms): ${params.owner} ${params.lockPath}`,
    );
    this.code = SESSION_WRITE_LOCK_TIMEOUT_CODE;
    this.name = "SessionWriteLockTimeoutError";
    this.timeoutMs = params.timeoutMs;
    this.owner = params.owner;
    this.lockPath = params.lockPath;
  }
};
/** Error thrown when an existing session write lock is stale and needs cleanup. */
var SessionWriteLockStaleError = class extends Error {
  constructor(params) {
    const staleReasons = params.staleReasons?.length ? params.staleReasons : ["unknown"];
    super(
      `session file lock stale (${staleReasons.join(", ")}): ${params.owner} ${params.lockPath}`,
    );
    this.code = SESSION_WRITE_LOCK_STALE_CODE;
    this.name = "SessionWriteLockStaleError";
    this.owner = params.owner;
    this.lockPath = params.lockPath;
    this.staleReasons = staleReasons;
  }
};
/** Returns whether an error is a session write-lock timeout. */
function isSessionWriteLockTimeoutError(err) {
  return (
    err instanceof SessionWriteLockTimeoutError ||
    Boolean(err && typeof err === "object" && err.code === SESSION_WRITE_LOCK_TIMEOUT_CODE)
  );
}
/** Returns whether an error is a stale session write-lock failure. */
function isSessionWriteLockStaleError(err) {
  return (
    err instanceof SessionWriteLockStaleError ||
    Boolean(err && typeof err === "object" && err.code === SESSION_WRITE_LOCK_STALE_CODE)
  );
}
/** Returns whether an error is any session write-lock acquisition failure. */
function isSessionWriteLockAcquireError(err) {
  return isSessionWriteLockTimeoutError(err) || isSessionWriteLockStaleError(err);
}
//#endregion
export {
  SessionWriteLockTimeoutError as n,
  isSessionWriteLockAcquireError as r,
  SessionWriteLockStaleError as t,
};
