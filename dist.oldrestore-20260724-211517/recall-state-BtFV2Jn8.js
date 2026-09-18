import crypto from "node:crypto";
import { c as resolveActiveMemoryCleanupConfig } from "./config-DSPNikPv.js";
import "./number-runtime-B-n-wjMn.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as closeActiveMemorySearchManager } from "./memory-host-search-aW3_BiIK.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { g as DEFAULT_MAX_CACHE_ENTRIES } from "./types-gz2L16qk.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/active-memory/recall-state.ts
let lastActiveRecallCacheSweepAt = 0;
const activeRecallCache = /* @__PURE__ */ new Map();
const timeoutCircuitBreaker = /* @__PURE__ */ new Map();
function buildCircuitBreakerKey(agentId, provider, model) {
  return `${agentId}:${provider ?? "unknown"}/${model ?? "unknown"}`;
}
function isCircuitBreakerOpen(key, maxTimeouts, cooldownMs) {
  const entry = timeoutCircuitBreaker.get(key);
  if (!entry || entry.consecutiveTimeouts < maxTimeouts) return false;
  if (Date.now() - entry.lastTimeoutAt >= cooldownMs) {
    timeoutCircuitBreaker.delete(key);
    return false;
  }
  return true;
}
function recordCircuitBreakerTimeout(key) {
  const entry = timeoutCircuitBreaker.get(key);
  if (entry) {
    entry.consecutiveTimeouts++;
    entry.lastTimeoutAt = Date.now();
  } else
    timeoutCircuitBreaker.set(key, {
      consecutiveTimeouts: 1,
      lastTimeoutAt: Date.now(),
    });
}
function resetCircuitBreaker(key) {
  timeoutCircuitBreaker.delete(key);
}
function scheduleMemorySearchCleanupAfterTimeout(api, logPrefix, agentId) {
  const cfg = resolveActiveMemoryCleanupConfig(api);
  setTimeout(() => {
    closeActiveMemorySearchManager({
      cfg: cfg ?? api.config,
      agentId,
    })
      .then(() => {
        api.logger.debug?.(`${logPrefix} released memory search managers after timeout`);
      })
      .catch((error) => {
        const message = toSingleLineLogValue(
          error instanceof Error ? error.message : String(error),
        );
        api.logger.warn?.(
          `${logPrefix} failed to release memory search managers after timeout: ${message}`,
        );
      });
  }, 0);
}
function buildCacheKey(params) {
  const hash = crypto.createHash("sha1").update(params.query).digest("hex");
  return `${params.agentId}:${params.sessionKey ?? params.sessionId ?? "none"}:${hash}`;
}
function getCachedResult(cacheKey) {
  const cached = activeRecallCache.get(cacheKey);
  if (!cached) return;
  const now = asDateTimestampMs(Date.now());
  if (now === void 0 || asDateTimestampMs(cached.expiresAt) === void 0 || cached.expiresAt <= now) {
    activeRecallCache.delete(cacheKey);
    return;
  }
  return cached.result;
}
function setCachedResult(cacheKey, result, ttlMs) {
  const rawNow = Date.now();
  const now = asDateTimestampMs(rawNow);
  if (
    activeRecallCache.size >= 1e3 ||
    (now !== void 0 && now - lastActiveRecallCacheSweepAt >= 1e3)
  ) {
    sweepExpiredCacheEntries(now);
    if (now !== void 0) lastActiveRecallCacheSweepAt = now;
  }
  const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
  if (expiresAt === void 0) {
    activeRecallCache.delete(cacheKey);
    return;
  }
  if (activeRecallCache.has(cacheKey)) activeRecallCache.delete(cacheKey);
  activeRecallCache.set(cacheKey, {
    expiresAt,
    result,
  });
  while (activeRecallCache.size > DEFAULT_MAX_CACHE_ENTRIES) {
    const oldestKey = activeRecallCache.keys().next().value;
    if (!oldestKey) break;
    activeRecallCache.delete(oldestKey);
  }
}
function sweepExpiredCacheEntries(now = asDateTimestampMs(Date.now())) {
  if (now === void 0) {
    activeRecallCache.clear();
    return;
  }
  for (const [cacheKey, cached] of activeRecallCache.entries())
    if (asDateTimestampMs(cached.expiresAt) === void 0 || cached.expiresAt <= now)
      activeRecallCache.delete(cacheKey);
}
function toSingleLineLogValue(value) {
  const singleLine = (
    typeof value === "string"
      ? value
      : typeof value === "number" ||
          typeof value === "boolean" ||
          typeof value === "bigint" ||
          typeof value === "symbol"
        ? String(value)
        : value == null
          ? ""
          : JSON.stringify(value)
  )
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return singleLine.length > 300 ? `${truncateUtf16Safe(singleLine, 300)}...` : singleLine;
}
function shouldCacheResult(result) {
  return result.status === "ok" && result.summary.length > 0;
}
function resetActiveRecallStateForTests() {
  activeRecallCache.clear();
  timeoutCircuitBreaker.clear();
  lastActiveRecallCacheSweepAt = 0;
}
function getCircuitBreakerEntry(key) {
  return timeoutCircuitBreaker.get(key);
}
//#endregion
export {
  isCircuitBreakerOpen as a,
  resetCircuitBreaker as c,
  shouldCacheResult as d,
  toSingleLineLogValue as f,
  getCircuitBreakerEntry as i,
  scheduleMemorySearchCleanupAfterTimeout as l,
  buildCircuitBreakerKey as n,
  recordCircuitBreakerTimeout as o,
  getCachedResult as r,
  resetActiveRecallStateForTests as s,
  buildCacheKey as t,
  setCachedResult as u,
};
