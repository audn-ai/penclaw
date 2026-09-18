import { p as getAgentRunContext } from "./agent-events-D4UsOPeT.js";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  Jt as resolveSessionStoreKey,
  qt as resolveSessionStoreAgentId,
} from "./session-accessor-PZVNxFCV.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-C386OSgw.js";
import { _ as toAgentRequestSessionKey } from "./session-key-druuY-GG.js";
import "./session-utils-DjTWBI0J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
//#region src/gateway/server-session-key.ts
const RUN_LOOKUP_CACHE_LIMIT = 256;
const RUN_LOOKUP_MISS_TTL_MS = 1e3;
const resolvedSessionKeyByRunId = /* @__PURE__ */ new Map();
function runLookupCacheKey(runId, agentId) {
  return `${agentId}\0${runId}`;
}
function setResolvedSessionKeyCache(runId, agentId, sessionKey) {
  if (!runId) return;
  const cacheKey = runLookupCacheKey(runId, agentId);
  if (
    !resolvedSessionKeyByRunId.has(cacheKey) &&
    resolvedSessionKeyByRunId.size >= RUN_LOOKUP_CACHE_LIMIT
  ) {
    const oldest = resolvedSessionKeyByRunId.keys().next().value;
    if (oldest) resolvedSessionKeyByRunId.delete(oldest);
  }
  let expiresAt = null;
  if (sessionKey === null) {
    const missExpiresAt = resolveExpiresAtMsFromDurationMs(RUN_LOOKUP_MISS_TTL_MS);
    if (missExpiresAt === void 0) return;
    expiresAt = missExpiresAt;
  }
  resolvedSessionKeyByRunId.set(cacheKey, {
    sessionKey,
    expiresAt,
  });
}
function sessionKeyMatchesAgent(sessionKey, agentId, cfg) {
  if (cfg.session?.scope === "global" && sessionKey.trim().toLowerCase() === "global") return true;
  const normalizedAgentId = normalizeAgentId(agentId);
  if (!parseAgentSessionKey(sessionKey) && sessionKey.trim().toLowerCase().startsWith("agent:"))
    return false;
  return (
    resolveSessionStoreAgentId(
      cfg,
      resolveSessionStoreKey({
        cfg,
        sessionKey,
        storeAgentId: agentId,
      }),
    ) === normalizedAgentId
  );
}
function resolveRunSessionKeyForCaller(storeKey) {
  return toAgentRequestSessionKey(storeKey) ?? storeKey;
}
/** Resolves the caller-facing session key for an active or recently persisted run id. */
function resolveSessionKeyForRun(runId, opts = {}) {
  const cfg = getRuntimeConfig();
  const explicitAgentId =
    typeof opts.agentId === "string" && opts.agentId.trim()
      ? normalizeAgentId(opts.agentId)
      : void 0;
  const cached = getAgentRunContext(runId)?.sessionKey;
  if (!explicitAgentId && cached) return cached;
  const requestedAgentId = explicitAgentId ?? normalizeAgentId(resolveDefaultAgentId(cfg));
  const cacheAgentId = requestedAgentId;
  if (cached && sessionKeyMatchesAgent(cached, requestedAgentId, cfg)) {
    const sessionKey = resolveRunSessionKeyForCaller(cached);
    setResolvedSessionKeyCache(runId, cacheAgentId, sessionKey);
    return sessionKey;
  }
  const cacheKey = runLookupCacheKey(runId, cacheAgentId);
  const cachedLookup = resolvedSessionKeyByRunId.get(cacheKey);
  if (cachedLookup !== void 0) {
    if (cachedLookup.sessionKey !== null) return cachedLookup.sessionKey;
    const expiresAt = asDateTimestampMs(cachedLookup.expiresAt);
    const now = asDateTimestampMs(Date.now());
    if (expiresAt !== void 0 && now !== void 0 && expiresAt > now) return;
    resolvedSessionKeyByRunId.delete(cacheKey);
  }
  const { store } = loadCombinedSessionStoreForGateway(cfg, { agentId: requestedAgentId });
  const storeKey = resolvePreferredSessionKeyForSessionIdMatches(
    Object.entries(store).filter(
      (entry) =>
        entry[1]?.sessionId === runId && sessionKeyMatchesAgent(entry[0], requestedAgentId, cfg),
    ),
    runId,
  );
  if (storeKey) {
    const sessionKey = resolveRunSessionKeyForCaller(storeKey);
    setResolvedSessionKeyCache(runId, cacheAgentId, sessionKey);
    return sessionKey;
  }
  setResolvedSessionKeyCache(runId, cacheAgentId, null);
}
/** Clears the run lookup cache for tests that mutate session stores. */
function resetResolvedSessionKeyForRunCacheForTest() {
  resolvedSessionKeyByRunId.clear();
}
//#endregion
export { resolveSessionKeyForRun as n, resetResolvedSessionKeyForRunCacheForTest as t };
