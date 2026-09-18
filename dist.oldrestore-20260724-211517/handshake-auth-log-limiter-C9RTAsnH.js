import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
//#region src/gateway/server/ws-connection/handshake-auth-log-limiter.ts
/** Per-key log limiter that reports suppressed auth attempts on the next emitted log. */
var HandshakeAuthLogLimiter = class {
  constructor(options) {
    this.entries = /* @__PURE__ */ new Map();
    this.intervalMs = resolveIntegerOption(options?.intervalMs, 3e4, { min: 1 });
    this.maxEntries = resolveIntegerOption(options?.maxEntries, 256, { min: 1 });
  }
  /** Register one auth event key and decide whether it should be logged now. */
  register(key, nowMs = Date.now()) {
    const entry = this.entries.get(key);
    if (!entry) {
      this.pruneIfNeeded();
      this.entries.set(key, {
        lastLoggedAtMs: nowMs,
        suppressedSinceLastLog: 0,
      });
      return {
        shouldLog: true,
        suppressedSinceLastLog: 0,
      };
    }
    if (nowMs - entry.lastLoggedAtMs < this.intervalMs) {
      entry.suppressedSinceLastLog += 1;
      return {
        shouldLog: false,
        suppressedSinceLastLog: 0,
      };
    }
    const suppressedSinceLastLog = entry.suppressedSinceLastLog;
    entry.lastLoggedAtMs = nowMs;
    entry.suppressedSinceLastLog = 0;
    return {
      shouldLog: true,
      suppressedSinceLastLog,
    };
  }
  pruneIfNeeded() {
    if (this.entries.size < this.maxEntries) return;
    const oldestKey = this.entries.keys().next().value;
    if (oldestKey !== void 0) this.entries.delete(oldestKey);
  }
};
/** Build the limiter key from auth failure context. */
function buildHandshakeAuthLogKey(params) {
  return [
    params.reason ?? "unknown",
    params.remoteAddr ?? "?",
    params.client ?? "?",
    params.mode ?? "?",
    params.authProvided ?? "?",
  ].join("|");
}
/** Return whether a missing-credential failure should use log rate limiting. */
function shouldLimitMissingCredentialAuthLog(params) {
  return (
    params.authProvided === "none" &&
    (params.reason === "token_missing" || params.reason === "password_missing")
  );
}
//#endregion
export {
  buildHandshakeAuthLogKey as n,
  shouldLimitMissingCredentialAuthLog as r,
  HandshakeAuthLogLimiter as t,
};
