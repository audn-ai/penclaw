import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import {
  C as resolveActiveReplyRunSessionId,
  b as listActiveReplyRunSessionKeys,
  f as getActiveReplyRunCount,
  y as listActiveReplyRunSessionIds,
} from "./reply-run-registry-CmZS-dyq.js";
//#region src/agents/embedded-agent-runner/run-state.ts
const embeddedRunState = resolveGlobalSingleton(Symbol.for("openclaw.embeddedRunState"), () => ({
  activeRuns: /* @__PURE__ */ new Map(),
  activeRunsByRunId: /* @__PURE__ */ new Map(),
  retainedAbortabilityRunIds: /* @__PURE__ */ new Set(),
  snapshots: /* @__PURE__ */ new Map(),
  sessionIdsByKey: /* @__PURE__ */ new Map(),
  sessionIdsByFile: /* @__PURE__ */ new Map(),
  abandonedRunsBySessionId: /* @__PURE__ */ new Map(),
  abandonedRunSessionIdsByKey: /* @__PURE__ */ new Map(),
  abandonedRunSessionIdsByFile: /* @__PURE__ */ new Map(),
  waiters: /* @__PURE__ */ new Map(),
}));
const ACTIVE_EMBEDDED_RUNS =
  embeddedRunState.activeRuns ?? (embeddedRunState.activeRuns = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUNS_BY_RUN_ID =
  embeddedRunState.activeRunsByRunId ??
  (embeddedRunState.activeRunsByRunId = /* @__PURE__ */ new Map());
const RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS =
  embeddedRunState.retainedAbortabilityRunIds ??
  (embeddedRunState.retainedAbortabilityRunIds = /* @__PURE__ */ new Set());
const ACTIVE_EMBEDDED_RUN_SNAPSHOTS =
  embeddedRunState.snapshots ?? (embeddedRunState.snapshots = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY =
  embeddedRunState.sessionIdsByKey ??
  (embeddedRunState.sessionIdsByKey = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE =
  embeddedRunState.sessionIdsByFile ??
  (embeddedRunState.sessionIdsByFile = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID =
  embeddedRunState.abandonedRunsBySessionId ??
  (embeddedRunState.abandonedRunsBySessionId = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY =
  embeddedRunState.abandonedRunSessionIdsByKey ??
  (embeddedRunState.abandonedRunSessionIdsByKey = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE =
  embeddedRunState.abandonedRunSessionIdsByFile ??
  (embeddedRunState.abandonedRunSessionIdsByFile = /* @__PURE__ */ new Map());
const EMBEDDED_RUN_WAITERS =
  embeddedRunState.waiters ?? (embeddedRunState.waiters = /* @__PURE__ */ new Map());
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
function getActiveEmbeddedRunCount() {
  let activeCount = ACTIVE_EMBEDDED_RUNS.size;
  for (const sessionId of listActiveReplyRunSessionIds())
    if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) activeCount += 1;
  return Math.max(activeCount, getActiveReplyRunCount());
}
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
function listActiveEmbeddedRunSessionKeys() {
  return [
    .../* @__PURE__ */ new Set([
      ...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.keys(),
      ...listActiveReplyRunSessionKeys(),
    ]),
  ].toSorted((a, b) => a.localeCompare(b));
}
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
function listActiveEmbeddedRunSessionIds() {
  return [
    .../* @__PURE__ */ new Set([
      ...ACTIVE_EMBEDDED_RUNS.keys(),
      ...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.values(),
      ...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.values(),
      ...listActiveReplyRunSessionIds(),
    ]),
  ].toSorted((a, b) => a.localeCompare(b));
}
/** Resolves the current session id for an active run after resets or compaction. */
function resolveActiveEmbeddedRunSessionId(sessionKey) {
  const normalizedSessionKey = sessionKey.trim();
  if (!normalizedSessionKey) return;
  return (
    resolveActiveReplyRunSessionId(normalizedSessionKey) ??
    ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey)
  );
}
//#endregion
export {
  ACTIVE_EMBEDDED_RUNS_BY_RUN_ID as a,
  ACTIVE_EMBEDDED_RUN_SNAPSHOTS as c,
  getActiveEmbeddedRunCount as d,
  listActiveEmbeddedRunSessionIds as f,
  ACTIVE_EMBEDDED_RUNS as i,
  EMBEDDED_RUN_WAITERS as l,
  resolveActiveEmbeddedRunSessionId as m,
  ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE as n,
  ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE as o,
  listActiveEmbeddedRunSessionKeys as p,
  ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY as r,
  ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY as s,
  ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID as t,
  RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS as u,
};
