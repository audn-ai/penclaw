import {
  C as resolveExpiresAtMsFromDurationMs,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-B-n-wjMn.js";
//#region extensions/voice-call/src/webhook-replay.ts
const REPLAY_WINDOW_MS = 600 * 1e3;
const REPLAY_CACHE_MAX_ENTRIES = 1e4;
const REPLAY_CACHE_PRUNE_INTERVAL = 64;
function createWebhookReplayCache() {
  return {
    seenUntil: /* @__PURE__ */ new Map(),
    calls: 0,
  };
}
function pruneWebhookReplayCache(cache, now) {
  for (const [key, expiresAt] of cache.seenUntil)
    if (!isFutureDateTimestampMs(expiresAt, { nowMs: now })) cache.seenUntil.delete(key);
  while (cache.seenUntil.size > REPLAY_CACHE_MAX_ENTRIES) {
    const oldest = cache.seenUntil.keys().next().value;
    if (!oldest) break;
    cache.seenUntil.delete(oldest);
  }
}
function markWebhookReplay(cache, replayKey) {
  const now = Date.now();
  cache.calls += 1;
  if (cache.calls % REPLAY_CACHE_PRUNE_INTERVAL === 0) pruneWebhookReplayCache(cache, now);
  const existing = cache.seenUntil.get(replayKey);
  if (existing !== void 0 && isFutureDateTimestampMs(existing, { nowMs: now })) return true;
  const expiresAt = resolveExpiresAtMsFromDurationMs(REPLAY_WINDOW_MS, { nowMs: now });
  if (expiresAt !== void 0) cache.seenUntil.set(replayKey, expiresAt);
  if (cache.seenUntil.size > REPLAY_CACHE_MAX_ENTRIES) pruneWebhookReplayCache(cache, now);
  return false;
}
//#endregion
export { markWebhookReplay as n, createWebhookReplayCache as t };
