import { w as sweepStaleRunContexts } from "./agent-events-D4UsOPeT.js";
import {
  c as removeChatAbortControllerEntry,
  r as abortTrackedChatRunById,
} from "./chat-abort-DGc7CDOP.js";
import { n as pruneStaleControlPlaneBuckets } from "./control-plane-rate-limit-Cqz4CBuw.js";
import { o as startSkillCuratorMaintenance } from "./curator-BbVbrcMR.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { s as setBroadcastHealthUpdate } from "./health-state-B61gtgja.js";
import { m as isFutureDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-BIl6X0N8.js";
import "./server-shared-C-7Ahu3n.js";
import {
  r as HEALTH_REFRESH_INTERVAL_MS,
  s as TICK_INTERVAL_MS,
  t as DEDUPE_MAX,
} from "./server-constants-DKuFNbQH.js";
import {
  i as WORKTREE_GC_INTERVAL_MS,
  o as managedWorktrees,
  s as resolveWorktreeCleanupLimits,
} from "./service-Dhl824Yp.js";
import { r as cleanOldMedia } from "./store-BfbXoJVN.js";
import "./server-utils-Dw9BG4RN.js";
import { t as isManagedWorktreeOwnerActive } from "./worktree-owner-activity-DHiwt9iO.js";
//#region src/gateway/server-maintenance.ts
function startGatewayMaintenanceTimers(params) {
  setBroadcastHealthUpdate((snap) => {
    params.broadcast("health", snap, {
      stateVersion: {
        presence: params.getPresenceVersion(),
        health: params.getHealthVersion(),
      },
    });
    params.nodeSendToAllSubscribed("health", snap);
  });
  const tickInterval = setInterval(() => {
    const payload = { ts: Date.now() };
    params.broadcast("tick", payload);
    params.nodeSendToAllSubscribed("tick", payload);
  }, TICK_INTERVAL_MS);
  const healthInterval = setInterval(() => {
    params
      .refreshGatewayHealthSnapshot({ probe: false })
      .catch((err) => params.logHealth.error(`refresh failed: ${formatErrorMessage(err)}`));
  }, HEALTH_REFRESH_INTERVAL_MS);
  params
    .refreshGatewayHealthSnapshot({ probe: false })
    .catch((err) => params.logHealth.error(`initial refresh failed: ${formatErrorMessage(err)}`));
  const runWorktreeGc =
    params.runWorktreeGc ??
    (() =>
      managedWorktrees.gc({
        isOwnerActive: isManagedWorktreeOwnerActive,
        limits: resolveWorktreeCleanupLimits(params.getRuntimeConfig().worktrees),
      }));
  const performWorktreeGc = () =>
    runWorktreeGc().catch((err) => {
      params.logHealth.error(`managed worktree cleanup failed: ${formatErrorMessage(err)}`);
    });
  const worktreeCleanup = setInterval(() => void performWorktreeGc(), WORKTREE_GC_INTERVAL_MS);
  performWorktreeGc();
  let skillCuratorCleanup = () => {};
  if (params.enableSkillCurator)
    skillCuratorCleanup = startSkillCuratorMaintenance({
      onError: (err) =>
        params.logHealth.error(`skill curator sweep failed: ${formatErrorMessage(err)}`),
      registerUsageTracking: params.registerSkillUsageTracking,
      runSweep: params.runSkillCuratorSweep,
    });
  const dedupeCleanup = setInterval(() => {
    const AGENT_RUN_SEQ_MAX = 1e4;
    const now = Date.now();
    const resolveDedupeRunId = (key, entry) => {
      if (!key.startsWith("agent:") && !key.startsWith("chat:")) return;
      const keyRunId = key.slice(key.indexOf(":") + 1);
      if (keyRunId) {
        if (params.chatAbortControllers.has(keyRunId) || params.chatQueuedTurns.has(keyRunId))
          return keyRunId;
      }
      const payload = entry.payload;
      return payload && typeof payload === "object" && !Array.isArray(payload)
        ? typeof payload.runId === "string"
          ? payload.runId.trim() || void 0
          : void 0
        : void 0;
    };
    const isPendingAcceptedRunDedupeKey = (key, dedupeEntry) => {
      if (!key.startsWith("agent:") && !key.startsWith("pending-chat:")) return false;
      const payload = dedupeEntry.payload;
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
      if (payload.status !== "accepted") return false;
      const expiresAtMs = payload.expiresAtMs;
      return isFutureDateTimestampMs(expiresAtMs, { nowMs: now });
    };
    const isActiveRunDedupeKey = (key, dedupeEntry) => {
      const isAgentKey = key.startsWith("agent:");
      const isChatKey = key.startsWith("chat:");
      if (!isAgentKey && !isChatKey) return false;
      const runId = resolveDedupeRunId(key, dedupeEntry);
      const entry = runId ? params.chatAbortControllers.get(runId) : void 0;
      if (entry) return isAgentKey ? entry.kind === "agent" : entry.kind !== "agent";
      return Boolean(isChatKey && runId && params.chatQueuedTurns.has(runId));
    };
    for (const [k, v] of params.dedupe) {
      if (isActiveRunDedupeKey(k, v) || isPendingAcceptedRunDedupeKey(k, v)) continue;
      if (now - v.ts > 3e5) params.dedupe.delete(k);
    }
    if (params.dedupe.size > 1e3) {
      const excess = params.dedupe.size - DEDUPE_MAX;
      const oldestKeys = [...params.dedupe.entries()]
        .filter(
          ([key, entry]) =>
            !isActiveRunDedupeKey(key, entry) && !isPendingAcceptedRunDedupeKey(key, entry),
        )
        .toSorted(([, left], [, right]) => left.ts - right.ts)
        .slice(0, excess)
        .map(([key]) => key);
      for (const key of oldestKeys) params.dedupe.delete(key);
    }
    if (params.agentRunSeq.size > AGENT_RUN_SEQ_MAX) {
      const excess = params.agentRunSeq.size - AGENT_RUN_SEQ_MAX;
      let removed = 0;
      for (const runId of params.agentRunSeq.keys()) {
        params.agentRunSeq.delete(runId);
        removed += 1;
        if (removed >= excess) break;
      }
    }
    const resolveAgentThrottleRunId = (key) => {
      if (key.endsWith(":assistant")) return key.slice(0, -10);
      if (key.endsWith(":thinking")) return key.slice(0, -9);
      return key;
    };
    for (const [runId, entry] of params.chatAbortControllers) {
      if (entry.projectSessionTerminalPending === true) continue;
      if (isFutureDateTimestampMs(entry.expiresAtMs, { nowMs: now })) continue;
      if (entry.projectSessionTerminalPersistence) {
        const lifecycleGeneration = entry.lifecycleGeneration?.trim();
        const sessionKey = entry.sessionKey.trim();
        const sessionId = entry.sessionId.trim();
        if (entry.controlUiVisible !== false && lifecycleGeneration && sessionKey && sessionId)
          params.restartRecoveryCandidates.set(runId, {
            runId,
            lifecycleGeneration,
            sessionKey,
            sessionId,
            observedAt: entry.projectSessionTerminalObservedAt,
          });
        removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
        continue;
      }
      if (entry.projectSessionActive === false) {
        removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
        continue;
      }
      abortTrackedChatRunById(params, {
        runId,
        sessionKey: entry.sessionKey,
        stopReason: "timeout",
      });
    }
    const ABORTED_RUN_TTL_MS = 60 * 6e4;
    for (const [runId, abortMarker] of params.chatRunState.abortedRuns) {
      if (now - chatAbortMarkerTimestampMs(abortMarker) <= ABORTED_RUN_TTL_MS) continue;
      params.chatRunState.abortedRuns.delete(runId);
      params.chatRunState.clearRun(runId);
    }
    pruneStaleControlPlaneBuckets(now);
    for (const [runId, lastSentAt] of params.chatDeltaSentAt) {
      if (params.chatRunState.abortedRuns.has(runId)) continue;
      if (params.chatAbortControllers.has(runId)) continue;
      if (now - lastSentAt <= ABORTED_RUN_TTL_MS) continue;
      params.chatRunState.clearRun(runId);
    }
    for (const [runId, lastUpdatedAt] of params.chatRunState.bufferUpdatedAt) {
      if (params.chatRunState.abortedRuns.has(runId)) continue;
      if (params.chatAbortControllers.has(runId)) continue;
      if (now - lastUpdatedAt <= ABORTED_RUN_TTL_MS) continue;
      params.chatRunState.clearRun(runId);
    }
    for (const [key, lastSentAt] of params.chatRunState.agentDeltaSentAt) {
      const runId = resolveAgentThrottleRunId(key);
      if (params.chatRunState.abortedRuns.has(runId)) continue;
      if (params.chatAbortControllers.has(runId)) continue;
      if (now - lastSentAt <= ABORTED_RUN_TTL_MS) continue;
      params.chatRunState.clearRun(runId);
    }
    sweepStaleRunContexts();
  }, 6e4);
  if (typeof params.mediaCleanupTtlMs !== "number")
    return {
      tickInterval,
      healthInterval,
      dedupeCleanup,
      mediaCleanup: null,
      worktreeCleanup,
      skillCuratorCleanup,
    };
  let mediaCleanupInFlight = null;
  const runMediaCleanup = () => {
    if (mediaCleanupInFlight) return mediaCleanupInFlight;
    mediaCleanupInFlight = cleanOldMedia(params.mediaCleanupTtlMs, {
      recursive: true,
      pruneEmptyDirs: true,
    })
      .catch((err) => {
        params.logHealth.error(`media cleanup failed: ${formatErrorMessage(err)}`);
      })
      .finally(() => {
        mediaCleanupInFlight = null;
      });
    return mediaCleanupInFlight;
  };
  const mediaCleanup = setInterval(() => {
    runMediaCleanup();
  }, 60 * 6e4);
  runMediaCleanup();
  return {
    tickInterval,
    healthInterval,
    dedupeCleanup,
    mediaCleanup,
    worktreeCleanup,
    skillCuratorCleanup,
  };
}
//#endregion
export { startGatewayMaintenanceTimers };
