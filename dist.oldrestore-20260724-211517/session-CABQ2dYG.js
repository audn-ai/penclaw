import "./agent-scope-y9xQv_q1.js";
import crypto from "node:crypto";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import "./thinking-CVcRbjTC.js";
import { n as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-C1XPSKEI.js";
import { t as clearAllCliSessions } from "./cli-session-DWiGjR21.js";
import { t as hasProviderOwnedSession } from "./entry-freshness-DUBhQwKp.js";
import {
  i as hasTerminalMainSessionTranscriptNewerThanRegistrySync,
  o as resolveSessionLifecycleTimestamps,
} from "./lifecycle-5_TQ_dr5.js";
import { i as resolveExplicitAgentSessionKey } from "./main-session-nrmKYo2W.js";
import { a as isModelSelectionLocked } from "./model-overrides-BlzAR7Nc.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  a as resolveSessionResetPolicy,
  i as evaluateSessionFreshness,
  n as resolveSessionResetType,
  t as resolveChannelResetConfig,
} from "./reset-DwjOm4Ug.js";
import { y as listSessionEntries } from "./session-accessor-PZVNxFCV.js";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-C386OSgw.js";
import { n as resolveSessionKey } from "./session-key-Beu1vXbM.js";
import {
  c as isUnscopedSessionKeySentinel,
  d as resolveAgentIdFromSessionKey,
  i as buildAgentMainSessionKey,
  l as normalizeMainKey,
  s as classifySessionKeyShape,
  t as DEFAULT_AGENT_ID,
} from "./session-key-druuY-GG.js";
import {
  s as normalizeThinkLevel,
  u as normalizeVerboseLevel,
} from "./thinking.shared-BWnbgBUO.js";
//#region src/agents/command/session.ts
/**
 * Resolves command session ids, keys, stores, and persisted thinking state.
 */
function clearRotatedSessionMetadata(entry) {
  const next = {
    ...entry,
    sessionFile: void 0,
    status: void 0,
    startedAt: void 0,
    endedAt: void 0,
    runtimeMs: void 0,
    abortedLastRun: void 0,
    restartRecoveryForceSafeTools: void 0,
    restartRecoveryDeliveryContext: void 0,
    restartRecoveryDeliveryRequestFingerprint: void 0,
    restartRecoveryDeliveryRunId: void 0,
    restartRecoveryDeliverySourceRunId: void 0,
    restartRecoveryTerminalRunIds: void 0,
    sessionStartedAt: void 0,
    lastInteractionAt: void 0,
  };
  clearAllCliSessions(next);
  return next;
}
function loadCommandSessionStore(params) {
  return Object.fromEntries(
    listSessionEntries({
      storePath: params.storePath,
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(params.clone === false ? { clone: false } : {}),
    }).map(({ sessionKey, entry }) => [sessionKey, entry]),
  );
}
/** Builds the synthetic session key used for explicit session-id runs. */
function buildExplicitSessionIdSessionKey(params) {
  return `agent:${normalizeAgentId(params.agentId)}:explicit:${params.sessionId.trim()}`;
}
function resolveLegacyMainStoreSessionForDefaultAgent(opts) {
  if (opts.defaultAgentId === "main" || !opts.sessionKey) return;
  const defaultMainSessionKey = buildAgentMainSessionKey({
    agentId: opts.defaultAgentId,
    mainKey: opts.mainKey,
  });
  if (opts.sessionKey !== defaultMainSessionKey || opts.sessionStore[opts.sessionKey]) return;
  const legacyStorePath = resolveStorePath(opts.cfg.session?.store, { agentId: DEFAULT_AGENT_ID });
  const legacyKeys = [
    buildAgentMainSessionKey({
      agentId: DEFAULT_AGENT_ID,
      mainKey: opts.mainKey,
    }),
    buildAgentMainSessionKey({
      agentId: DEFAULT_AGENT_ID,
      mainKey: "main",
    }),
  ];
  if (legacyStorePath === opts.storePath) {
    for (const legacyKey of legacyKeys) {
      const legacyEntry = opts.sessionStore[legacyKey];
      if (legacyEntry) {
        const sessionStore = opts.cloneOnWrite ? { ...opts.sessionStore } : opts.sessionStore;
        sessionStore[opts.sessionKey] = { ...legacyEntry };
        return {
          sessionKey: opts.sessionKey,
          sessionStore,
          storePath: opts.storePath,
        };
      }
    }
    return;
  }
  const legacyStore = loadCommandSessionStore({
    agentId: DEFAULT_AGENT_ID,
    storePath: legacyStorePath,
    ...(opts.cloneOnWrite ? { clone: false } : {}),
  });
  for (const legacyKey of legacyKeys) {
    const legacyEntry = legacyStore[legacyKey];
    if (legacyEntry) {
      const sessionStore = opts.cloneOnWrite ? { ...opts.sessionStore } : opts.sessionStore;
      sessionStore[opts.sessionKey] = { ...legacyEntry };
      return {
        sessionKey: opts.sessionKey,
        sessionStore,
        storePath: opts.storePath,
      };
    }
  }
}
function collectSessionIdMatchesForRequest(opts) {
  const matches = [];
  const primaryStoreMatches = [];
  const storeByKey = /* @__PURE__ */ new Map();
  const addMatches = (candidateStore, candidateStorePath, options) => {
    for (const [candidateKey, candidateEntry] of Object.entries(candidateStore)) {
      if (candidateEntry?.sessionId !== opts.sessionId) continue;
      matches.push([candidateKey, candidateEntry]);
      if (options?.primary) primaryStoreMatches.push([candidateKey, candidateEntry]);
      storeByKey.set(candidateKey, {
        sessionKey: candidateKey,
        sessionStore: candidateStore,
        storePath: candidateStorePath,
      });
    }
  };
  addMatches(opts.sessionStore, opts.storePath, { primary: true });
  if (!opts.searchOtherAgentStores)
    return {
      matches,
      primaryStoreMatches,
      storeByKey,
    };
  for (const agentId of listAgentIds(opts.cfg)) {
    if (agentId === opts.storeAgentId) continue;
    const candidateStorePath = resolveStorePath(opts.cfg.session?.store, { agentId });
    addMatches(
      loadCommandSessionStore({
        agentId,
        storePath: candidateStorePath,
        ...(opts.clone === false ? { clone: false } : {}),
      }),
      candidateStorePath,
    );
  }
  return {
    matches,
    primaryStoreMatches,
    storeByKey,
  };
}
/**
 * Resolve an existing stored session key for a session id from a specific agent store.
 * This scopes the lookup to the target store without implicitly converting `agentId`
 * into that agent's main session key.
 */
function resolveStoredSessionKeyForSessionId(opts) {
  const sessionId = opts.sessionId.trim();
  const storeAgentId = opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0;
  const storePath = resolveStorePath(opts.cfg.session?.store, { agentId: storeAgentId });
  const sessionStore = loadCommandSessionStore({
    storePath,
    ...(storeAgentId ? { agentId: storeAgentId } : {}),
  });
  if (!sessionId)
    return {
      sessionKey: void 0,
      sessionStore,
      storePath,
    };
  const selection = resolveSessionIdMatchSelection(
    Object.entries(sessionStore).filter(([, entry]) => entry?.sessionId === sessionId),
    sessionId,
  );
  return {
    sessionKey: selection.kind === "selected" ? selection.sessionKey : void 0,
    sessionStore,
    storePath,
  };
}
/** Resolves the session key/store targeted by one command request. */
function resolveSessionKeyForRequest(opts) {
  const sessionCfg = opts.cfg.session;
  const scope = sessionCfg?.scope ?? "per-sender";
  const mainKey = normalizeMainKey(sessionCfg?.mainKey);
  const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(opts.cfg));
  const requestedAgentId = opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0;
  const requestedSessionId = opts.sessionId?.trim() || void 0;
  const requestedSessionKey = opts.sessionKey?.trim() || void 0;
  const toSessionKey =
    !requestedSessionKey && !requestedSessionId && classifySessionKeyShape(opts.to) === "agent"
      ? opts.to?.trim()
      : void 0;
  const explicitSessionKey =
    requestedSessionKey ||
    toSessionKey ||
    (!requestedSessionId
      ? resolveExplicitAgentSessionKey({
          cfg: opts.cfg,
          agentId: requestedAgentId,
        })
      : void 0);
  const storeAgentId = explicitSessionKey
    ? isUnscopedSessionKeySentinel(explicitSessionKey)
      ? (requestedAgentId ?? defaultAgentId)
      : resolveAgentIdFromSessionKey(explicitSessionKey)
    : (requestedAgentId ?? defaultAgentId);
  const storePath = resolveStorePath(sessionCfg?.store, { agentId: storeAgentId });
  const sessionStore = loadCommandSessionStore({
    storePath,
    agentId: storeAgentId,
    ...((opts.clone === false ? { clone: false } : void 0) ? { clone: false } : {}),
  });
  const ctx = opts.to?.trim() ? { From: opts.to } : void 0;
  let sessionKey =
    explicitSessionKey ?? (ctx ? resolveSessionKey(scope, ctx, mainKey, storeAgentId) : void 0);
  if (ctx && !requestedAgentId && !requestedSessionId && !explicitSessionKey) {
    const legacyMainSession = resolveLegacyMainStoreSessionForDefaultAgent({
      cfg: opts.cfg,
      defaultAgentId,
      mainKey,
      sessionKey,
      sessionStore,
      storePath,
      cloneOnWrite: opts.clone === false,
    });
    if (legacyMainSession) return legacyMainSession;
  }
  if (
    requestedSessionId &&
    !explicitSessionKey &&
    (!sessionKey || sessionStore[sessionKey]?.sessionId !== requestedSessionId)
  ) {
    const { matches, primaryStoreMatches, storeByKey } = collectSessionIdMatchesForRequest({
      cfg: opts.cfg,
      sessionStore,
      storePath,
      storeAgentId,
      sessionId: requestedSessionId,
      searchOtherAgentStores: requestedAgentId === void 0,
      ...(opts.clone === false ? { clone: false } : {}),
    });
    const preferredSelection = resolveSessionIdMatchSelection(matches, requestedSessionId);
    const currentStoreSelection =
      preferredSelection.kind === "selected"
        ? preferredSelection
        : resolveSessionIdMatchSelection(primaryStoreMatches, requestedSessionId);
    if (currentStoreSelection.kind === "selected") {
      const preferred = storeByKey.get(currentStoreSelection.sessionKey);
      if (preferred) return preferred;
      sessionKey = currentStoreSelection.sessionKey;
    }
  }
  if (requestedSessionId && !sessionKey)
    sessionKey = buildExplicitSessionIdSessionKey({
      sessionId: requestedSessionId,
      agentId: opts.agentId,
    });
  return {
    sessionKey,
    sessionStore,
    storePath,
  };
}
/** Resolves or creates the session used by one agent command request. */
function resolveSession(opts) {
  const sessionCfg = opts.cfg.session;
  const { sessionKey, sessionStore, storePath } = resolveSessionKeyForRequest({
    cfg: opts.cfg,
    to: opts.to,
    sessionId: opts.sessionId,
    sessionKey: opts.sessionKey,
    agentId: opts.agentId,
    ...(opts.clone === false ? { clone: false } : {}),
  });
  const now = Date.now();
  const sessionEntry = sessionKey ? sessionStore[sessionKey] : void 0;
  const sessionAgentId = opts.agentId?.trim()
    ? normalizeAgentId(opts.agentId)
    : resolveAgentIdFromSessionKey(sessionKey);
  const resetPolicy = resolveSessionResetPolicy({
    sessionCfg,
    resetType: resolveSessionResetType({ sessionKey }),
    resetOverride: resolveChannelResetConfig({
      sessionCfg,
      channel: sessionEntry?.lastChannel ?? sessionEntry?.channel ?? sessionEntry?.origin?.provider,
    }),
  });
  const requestedSessionId = opts.sessionId?.trim() || void 0;
  const terminalMainTranscriptNewerThanRegistry =
    sessionEntry && !requestedSessionId
      ? hasTerminalMainSessionTranscriptNewerThanRegistrySync({
          entry: sessionEntry,
          sessionScope: sessionCfg?.scope,
          sessionKey,
          agentId: sessionAgentId,
          mainKey: sessionCfg?.mainKey,
          storePath,
        })
      : false;
  const lockedModelSelection = isModelSelectionLocked(sessionEntry);
  const skipImplicitExpiry =
    resetPolicy.configured !== true && hasProviderOwnedSession(sessionEntry);
  const fresh = sessionEntry
    ? lockedModelSelection ||
      (!terminalMainTranscriptNewerThanRegistry &&
        (skipImplicitExpiry ||
          evaluateSessionFreshness({
            updatedAt: sessionEntry.updatedAt,
            ...resolveSessionLifecycleTimestamps({
              entry: sessionEntry,
              agentId: sessionAgentId,
              storePath,
            }),
            now,
            policy: resetPolicy,
          }).fresh))
    : false;
  const sessionId =
    requestedSessionId || (fresh ? sessionEntry?.sessionId : void 0) || crypto.randomUUID();
  const isNewSession = !fresh && !requestedSessionId;
  const resolvedSessionEntry =
    isNewSession && sessionEntry ? clearRotatedSessionMetadata(sessionEntry) : sessionEntry;
  clearBootstrapSnapshotOnSessionRollover({
    sessionKey,
    previousSessionId: isNewSession ? sessionEntry?.sessionId : void 0,
  });
  return {
    sessionId,
    sessionKey,
    sessionEntry: resolvedSessionEntry,
    sessionStore,
    storePath,
    isNewSession,
    persistedThinking:
      fresh && sessionEntry?.thinkingLevel
        ? normalizeThinkLevel(sessionEntry.thinkingLevel)
        : void 0,
    persistedVerbose:
      fresh && sessionEntry?.verboseLevel
        ? normalizeVerboseLevel(sessionEntry.verboseLevel)
        : void 0,
  };
}
//#endregion
export {
  resolveStoredSessionKeyForSessionId as a,
  resolveSessionKeyForRequest as i,
  clearRotatedSessionMetadata as n,
  resolveSession as r,
  buildExplicitSessionIdSessionKey as t,
};
