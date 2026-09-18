import { f as resolveClientIp, r as isLoopbackAddress } from "./net-BpMGIYrw.js";
import "./number-coercion-EqFmHmOw.js";
import {
  D as resolveIntegerOption,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
//#region src/gateway/auth-rate-limit.ts
/**
 * In-memory sliding-window rate limiter for gateway authentication attempts.
 *
 * Tracks failed auth attempts by {scope, clientIp}. A scope lets callers keep
 * independent counters for different credential classes (for example, shared
 * gateway token/password vs device-token auth) while still sharing one
 * limiter instance.
 *
 * Design decisions:
 * - Pure in-memory Map – no external dependencies; suitable for a single
 *   gateway process. The Map is periodically pruned and capped to avoid
 *   unbounded growth.
 * - Loopback addresses (127.0.0.1 / ::1) are exempt by default so that local
 *   CLI sessions are never locked out.
 * - The module is side-effect-free: callers create an instance via
 *   {@link createAuthRateLimiter} and pass it where needed.
 */
const AUTH_RATE_LIMIT_SCOPE_DEFAULT = "default";
const AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET = "shared-secret";
const AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN = "device-token";
const AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING = "node-pairing";
const AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL = "node-reapproval";
const AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN = "bootstrap-token";
const AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE = "watch-challenge";
const AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH = "hook-auth";
const BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX = "browser-origin:";
const IDENTITY_RATE_LIMIT_KEY_PREFIX = "identity:";
const DEFAULT_MAX_ATTEMPTS = 10;
const DEFAULT_WINDOW_MS = 6e4;
const DEFAULT_LOCKOUT_MS = 3e5;
const PRUNE_INTERVAL_MS = 6e4;
const DEFAULT_MAX_ENTRIES = 1e4;
/**
 * Canonicalize client IPs used for auth throttling so all call sites
 * share one representation (including IPv4-mapped IPv6 forms).
 */
function normalizeRateLimitClientIp(ip) {
  if (
    typeof ip === "string" &&
    (ip.startsWith(BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX) ||
      ip.startsWith(IDENTITY_RATE_LIMIT_KEY_PREFIX))
  )
    return ip;
  return resolveClientIp({ remoteAddr: ip }) ?? "unknown";
}
/** Build an opaque limiter identity that is not subject to loopback IP exemptions. */
function buildRateLimitIdentityKey(namespace, identity) {
  return `${IDENTITY_RATE_LIMIT_KEY_PREFIX}${namespace}:${identity}`;
}
function resolvePruneIntervalMs(value) {
  if (value === void 0) return PRUNE_INTERVAL_MS;
  if (Number.isFinite(value) && value <= 0) return 0;
  return resolveTimerTimeoutMs(value, PRUNE_INTERVAL_MS);
}
function createAuthRateLimiter(config) {
  const maxAttempts = config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const windowMs = resolveTimerTimeoutMs(config?.windowMs, DEFAULT_WINDOW_MS, 0);
  const lockoutMs = resolveTimerTimeoutMs(config?.lockoutMs, DEFAULT_LOCKOUT_MS, 0);
  const exemptLoopback = config?.exemptLoopback ?? true;
  const pruneIntervalMs = resolvePruneIntervalMs(config?.pruneIntervalMs);
  const maxEntries = resolveIntegerOption(config?.maxEntries, DEFAULT_MAX_ENTRIES, { min: 1 });
  const entries = /* @__PURE__ */ new Map();
  let overflowLockedUntil;
  const pruneTimer = pruneIntervalMs > 0 ? setInterval(() => prune(), pruneIntervalMs) : null;
  if (pruneTimer?.unref) pruneTimer.unref();
  function normalizeScope(scope) {
    return (scope ?? "default").trim() || "default";
  }
  function normalizeIp(ip) {
    return normalizeRateLimitClientIp(ip);
  }
  function resolveKey(rawIp, rawScope) {
    const ip = normalizeIp(rawIp);
    return {
      key: `${normalizeScope(rawScope)}:${ip}`,
      ip,
    };
  }
  function isExempt(ip) {
    return exemptLoopback && isLoopbackAddress(ip);
  }
  function slideWindow(entry, now) {
    const cutoff = now - windowMs;
    entry.attempts = entry.attempts.filter((ts) => ts > cutoff);
  }
  function check(rawIp, rawScope) {
    const { key, ip } = resolveKey(rawIp, rawScope);
    if (isExempt(ip))
      return {
        allowed: true,
        remaining: maxAttempts,
        retryAfterMs: 0,
      };
    const now = Date.now();
    const entry = entries.get(key);
    if (!entry) {
      const overflowLock = checkOverflowLock(now);
      if (overflowLock) return overflowLock;
      return {
        allowed: true,
        remaining: maxAttempts,
        retryAfterMs: 0,
      };
    }
    if (entry.lockedUntil && now < entry.lockedUntil)
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: entry.lockedUntil - now,
      };
    if (entry.lockedUntil && now >= entry.lockedUntil) {
      entry.lockedUntil = void 0;
      entry.attempts = [];
    }
    slideWindow(entry, now);
    const remaining = Math.max(0, maxAttempts - entry.attempts.length);
    return {
      allowed: remaining > 0,
      remaining,
      retryAfterMs: 0,
    };
  }
  function recordFailure(rawIp, rawScope) {
    const { key, ip } = resolveKey(rawIp, rawScope);
    if (isExempt(ip)) return;
    const now = Date.now();
    let entry = entries.get(key);
    if (!entry) {
      if (!enforceMaxEntries(now)) {
        overflowLockedUntil = Math.max(overflowLockedUntil ?? 0, now + lockoutMs);
        return;
      }
      entry = { attempts: [] };
      entries.set(key, entry);
    }
    if (entry.lockedUntil && now < entry.lockedUntil) return;
    slideWindow(entry, now);
    entry.attempts.push(now);
    if (entry.attempts.length >= maxAttempts) entry.lockedUntil = now + lockoutMs;
  }
  function reset(rawIp, rawScope) {
    const { key } = resolveKey(rawIp, rawScope);
    entries.delete(key);
  }
  function pruneExpiredEntries(now) {
    for (const [key, entry] of entries) {
      if (entry.lockedUntil && now < entry.lockedUntil) continue;
      slideWindow(entry, now);
      if (entry.attempts.length === 0) entries.delete(key);
    }
  }
  function checkOverflowLock(now) {
    if (!overflowLockedUntil) return;
    if (now >= overflowLockedUntil) {
      overflowLockedUntil = void 0;
      return;
    }
    if (entries.size >= maxEntries) pruneExpiredEntries(now);
    if (entries.size < maxEntries) {
      overflowLockedUntil = void 0;
      return;
    }
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: overflowLockedUntil - now,
    };
  }
  function enforceMaxEntries(now) {
    if (entries.size < maxEntries) return true;
    pruneExpiredEntries(now);
    if (entries.size < maxEntries) return true;
    for (const [entryKey, entry] of entries)
      if (!entry.lockedUntil || now >= entry.lockedUntil) {
        entries.delete(entryKey);
        return true;
      }
    return false;
  }
  function prune() {
    pruneExpiredEntries(Date.now());
  }
  function size() {
    return entries.size;
  }
  function dispose() {
    if (pruneTimer) clearInterval(pruneTimer);
    entries.clear();
    overflowLockedUntil = void 0;
  }
  return {
    check,
    recordFailure,
    reset,
    size,
    prune,
    dispose,
  };
}
//#endregion
export {
  AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING as a,
  AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE as c,
  normalizeRateLimitClientIp as d,
  AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH as i,
  buildRateLimitIdentityKey as l,
  AUTH_RATE_LIMIT_SCOPE_DEFAULT as n,
  AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL as o,
  AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN as r,
  AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET as s,
  AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN as t,
  createAuthRateLimiter as u,
};
