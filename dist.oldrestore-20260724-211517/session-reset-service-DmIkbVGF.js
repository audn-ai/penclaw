import { randomUUID } from "node:crypto";
import "./agent-scope-y9xQv_q1.js";
import { r as stopSubagentsForRequester } from "./abort-BdpEE8j9.js";
import {
  a as buildSessionStartHookPayload,
  i as buildSessionEndHookPayload,
  n as listActiveSessionsForShutdown,
  r as noteActiveSessionForShutdown,
  t as forgetActiveSessionForShutdown,
} from "./active-sessions-shutdown-tracker-DGXEyl-H.js";
import { s as retireSessionMcpRuntime } from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as clearBootstrapSnapshot } from "./bootstrap-cache-C1XPSKEI.js";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-BPqCnyqs.js";
import { i as rebindCliSessionReseedReceiptsForReset } from "./cli-session-binding-CfY4fqsE.js";
import { t as clearAllCliSessions } from "./cli-session-DWiGjR21.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { p as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-yGjmBAjy.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { n as runPluginHostCleanup } from "./host-hook-cleanup-BFycd1C0.js";
import {
  m as triggerInternalHook,
  n as createInternalHookEvent,
} from "./internal-hooks-CckLIOgu.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-5_TQ_dr5.js";
import { t as getAcpSessionManager } from "./manager-CU7-9RFR.js";
import {
  a as isModelSelectionLocked,
  n as MODEL_SELECTION_LOCKED_RESET_MESSAGE,
} from "./model-overrides-BlzAR7Nc.js";
import "./sessions-CEG7v41b.js";
import { t as getAcpRuntimeBackend } from "./registry-BVG2dQ33.js";
import { o as resetRegisteredAgentHarnessSessions } from "./registry-ef8V3P8D.js";
import {
  n as clearSessionResetRuntimeState,
  t as resolveResetPreservedSelection,
} from "./reset-preserved-selection-DUxJ5zNa.js";
import { A as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun } from "./runs-GL_-RIwi.js";
import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
import {
  Ft as snapshotSessionOrigin,
  G as resetSessionEntryLifecycle,
  Jt as resolveSessionStoreKey,
} from "./session-accessor-PZVNxFCV.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { n as getSessionBindingService } from "./session-binding-service-DPVMwWUH.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  o as upsertAcpSessionMeta,
  r as readAcpSessionMeta,
  s as writeAcpSessionMetaForMigration,
} from "./session-meta-IQvNG5NK.js";
import { n as resolveSessionModelRef } from "./session-model-ref-1c6_XVhy.js";
import { r as resolveSessionPlacementResetBlock } from "./session-placement-admission-C_WzNYGC.js";
import "./src-CIJf1lT0.js";
import "./embedded-agent-T_kAEk06.js";
import { o as handleSessionStateSessionReset } from "./session-state-events-DXdC9X_q.js";
import {
  r as archiveSessionTranscriptsDetailed,
  s as resolveStableSessionEndTranscript,
} from "./session-transcript-files.fs-Cjj8g4Lp.js";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import {
  h as resolveGatewaySessionStoreTarget,
  u as loadSessionEntry,
} from "./session-utils-DjTWBI0J.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import {
  $ as hasOnlySessionLifecycleMutationKindActive,
  Pt as resolveMissingAgentHarnessSessionError,
  Y as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
  et as interruptSessionWorkAdmissions,
  rt as runExclusiveSessionLifecycleMutation,
  tt as isSessionLifecycleMutationActive,
} from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/session-child-sessions.ts
/** Returns true when a session store row is a direct child of the parent key. */
function isDirectChildSessionEntry(params) {
  const parentKey = normalizeOptionalString(params.parentKey);
  if (!parentKey || params.sessionKey === parentKey || !params.entry) return false;
  return (
    normalizeOptionalString(params.entry.spawnedBy) === parentKey ||
    normalizeOptionalString(params.entry.parentSessionKey) === parentKey
  );
}
/** Finds direct child sessions for a parent session across the combined gateway store. */
function findDirectChildSessionsForParent(params) {
  const { store } = loadCombinedSessionStoreForGateway(params.cfg);
  return Object.entries(store)
    .filter(([sessionKey, entry]) =>
      isDirectChildSessionEntry({
        sessionKey,
        entry,
        parentKey: params.parentKey,
      }),
    )
    .map(([sessionKey, entry]) => ({
      sessionKey,
      entry,
    }));
}
//#endregion
//#region src/gateway/session-reset-service.ts
const ACP_RUNTIME_CLEANUP_TIMEOUT_MS = 15e3;
function archiveSessionTranscriptsForSessionDetailed(params) {
  if (!params.sessionId) return [];
  return archiveSessionTranscriptsDetailed({
    sessionId: params.sessionId,
    storePath: params.storePath,
    sessionFile: params.sessionFile,
    agentId: params.agentId,
    reason: params.reason,
    onArchiveError: params.onArchiveError,
  });
}
function emitGatewaySessionEndPluginHook(params) {
  if (!params.sessionId) return;
  forgetActiveSessionForShutdown(params.sessionId);
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("session_end")) return;
  const transcript = resolveStableSessionEndTranscript({
    sessionId: params.sessionId,
    storePath: params.storePath,
    sessionFile: params.sessionFile,
    agentId: params.agentId,
    archivedTranscripts: params.archivedTranscripts,
  });
  const payload = buildSessionEndHookPayload({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cfg: params.cfg,
    reason: params.reason,
    sessionFile: transcript.sessionFile,
    transcriptArchived: transcript.transcriptArchived,
    nextSessionId: params.nextSessionId,
    nextSessionKey: params.nextSessionKey,
  });
  runWithGatewayIndependentRootWorkContinuation(async () => {
    await hookRunner.runSessionEnd(payload.event, payload.context);
  }).catch((err) => {
    logVerbose(`session_end hook failed: ${String(err)}`);
  });
}
function emitGatewaySessionStartPluginHook(params) {
  if (!params.sessionId) return;
  if (params.storePath)
    noteActiveSessionForShutdown({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      sessionId: params.sessionId,
      storePath: params.storePath,
      sessionFile: params.sessionFile,
      agentId: params.agentId,
    });
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("session_start")) return;
  const payload = buildSessionStartHookPayload({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    cfg: params.cfg,
    resumedFrom: params.resumedFrom,
  });
  runWithGatewayIndependentRootWorkContinuation(async () => {
    await hookRunner.runSessionStart(payload.event, payload.context);
  }).catch((err) => {
    logVerbose(`session_start hook failed: ${String(err)}`);
  });
}
const SHUTDOWN_DRAIN_DEFAULT_TOTAL_TIMEOUT_MS = 2e3;
/**
 * Emit a typed `session_end` for every session that received `session_start`
 * but did not yet receive a paired `session_end`. The bounded total timeout
 * mirrors the gateway lifecycle hook timeout so a slow plugin cannot block
 * SIGTERM/SIGINT past the runtime's overall shutdown grace window.
 *
 * Sessions that have already been finalized through replace / reset / delete /
 * compaction are forgotten from the tracker by `emitGatewaySessionEndPluginHook`
 * before this drain runs, so they will not be double-fired here.
 */
async function drainActiveSessionsForShutdown(params) {
  const tracked = listActiveSessionsForShutdown();
  if (tracked.length === 0)
    return {
      emittedSessionIds: [],
      timedOut: false,
    };
  const totalTimeoutMs = Math.max(
    100,
    Math.floor(params.totalTimeoutMs ?? SHUTDOWN_DRAIN_DEFAULT_TOTAL_TIMEOUT_MS),
  );
  const emittedSessionIds = [];
  const hookRunner = getGlobalHookRunner();
  let settledEmissions = 0;
  const drain = Promise.allSettled(
    tracked.map(async (entry) => {
      try {
        forgetActiveSessionForShutdown(entry.sessionId);
        emittedSessionIds.push(entry.sessionId);
        if (!hookRunner?.hasHooks("session_end")) return;
        const transcript = resolveStableSessionEndTranscript({
          sessionId: entry.sessionId,
          storePath: entry.storePath,
          sessionFile: entry.sessionFile,
          agentId: entry.agentId,
        });
        const payload = buildSessionEndHookPayload({
          sessionId: entry.sessionId,
          sessionKey: entry.sessionKey,
          cfg: entry.cfg,
          reason: params.reason,
          sessionFile: transcript.sessionFile,
          transcriptArchived: transcript.transcriptArchived,
        });
        await hookRunner.runSessionEnd(payload.event, payload.context);
      } catch (err) {
        logVerbose(`session_end hook failed during shutdown drain: ${String(err)}`);
      } finally {
        settledEmissions++;
      }
    }),
  );
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve("timeout"), totalTimeoutMs);
    timer.unref?.();
  });
  try {
    if ((await Promise.race([drain.then(() => "ok"), timeout])) === "timeout") {
      logVerbose(
        `shutdown session-end drain timed out after ${totalTimeoutMs}ms with ${tracked.length - settledEmissions} session_end handler(s) still pending`,
      );
      return {
        emittedSessionIds,
        timedOut: true,
      };
    }
    return {
      emittedSessionIds,
      timedOut: false,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function emitSessionUnboundLifecycleEvent(params) {
  const targetKind = isSubagentSessionKey(params.targetSessionKey) ? "subagent" : "acp";
  await getSessionBindingService().unbind({
    targetSessionKey: params.targetSessionKey,
    reason: params.reason,
  });
  if (params.emitHooks === false) return;
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("subagent_ended")) return;
  await hookRunner.runSubagentEnded(
    {
      targetSessionKey: params.targetSessionKey,
      targetKind,
      reason: params.reason,
      sendFarewell: true,
      outcome: params.reason === "session-reset" ? "reset" : "deleted",
    },
    { childSessionKey: params.targetSessionKey },
  );
}
async function ensureSessionRuntimeCleanup(params) {
  const closeTrackedBrowserTabs = async () => {
    params.assertCurrent?.();
    const closeKeys = /* @__PURE__ */ new Set([
      params.key,
      params.target.canonicalKey,
      ...params.target.storeKeys,
      params.sessionId ?? "",
    ]);
    await cleanupBrowserSessionsForLifecycleEnd({
      cfg: params.cfg,
      sessionKeys: [...closeKeys],
      onWarn: (message) => logVerbose(message),
    });
    params.assertCurrent?.();
  };
  params.assertCurrent?.();
  const queueKeys = new Set(params.target.storeKeys);
  queueKeys.add(params.target.canonicalKey);
  if (params.sessionId) queueKeys.add(params.sessionId);
  clearSessionResetRuntimeState([...queueKeys], { activeReplySessionId: params.sessionId });
  stopSubagentsForRequester({
    cfg: params.cfg,
    requesterSessionKey: params.target.canonicalKey,
  });
  if (!params.sessionId) {
    params.assertCurrent?.();
    clearBootstrapSnapshot(params.target.canonicalKey);
    await closeTrackedBrowserTabs();
    return;
  }
  params.assertCurrent?.();
  abortEmbeddedAgentRun(params.sessionId);
  const ended = await waitForEmbeddedAgentRunEnd(params.sessionId, 15e3);
  params.assertCurrent?.();
  clearBootstrapSnapshot(params.target.canonicalKey);
  if (ended) {
    params.assertCurrent?.();
    await retireSessionMcpRuntime({
      sessionId: params.sessionId,
      reason: "gateway-session-cleanup",
      onError: (error, sessionId) => {
        logVerbose(
          `sessions cleanup: failed to dispose bundle MCP runtime for ${sessionId}: ${String(error)}`,
        );
      },
    });
    params.assertCurrent?.();
    await closeTrackedBrowserTabs();
    return;
  }
  return errorShape(
    ErrorCodes.UNAVAILABLE,
    `Session ${params.key} is still active; try again in a moment.`,
  );
}
async function runAcpCleanupStep(params) {
  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ status: "timeout" }), ACP_RUNTIME_CLEANUP_TIMEOUT_MS);
  });
  const opPromise = params
    .op()
    .then(() => ({ status: "ok" }))
    .catch((error) => ({
      status: "error",
      error,
    }));
  const outcome = await Promise.race([opPromise, timeoutPromise]);
  if (timer) clearTimeout(timer);
  return outcome;
}
async function closeAcpRuntimeForSession(params) {
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
  const sessionKeys = Array.from(
    new Set(
      [params.sessionKey, ...(params.fallbackSessionKeys ?? [])]
        .map((key) => (typeof key === "string" ? key.trim() : ""))
        .filter(Boolean),
    ),
  );
  let acpMeta;
  let acpSessionKey = params.sessionKey;
  for (const sessionKey of sessionKeys) {
    acpMeta = readAcpSessionMeta({ sessionKey });
    if (acpMeta) {
      acpSessionKey = sessionKey;
      break;
    }
  }
  if (!acpMeta) return;
  const acpManager = getAcpSessionManager();
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
  const cancelOutcome = await runAcpCleanupStep({
    op: async () => {
      await acpManager.cancelSession({
        cfg: params.cfg,
        sessionKey: acpSessionKey,
        reason: params.reason,
      });
    },
  });
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
  if (cancelOutcome.status === "timeout")
    return errorShape(
      ErrorCodes.UNAVAILABLE,
      `Session ${params.sessionKey} is still active; try again in a moment.`,
    );
  if (cancelOutcome.status === "error")
    logVerbose(
      `sessions.${params.reason}: ACP cancel failed for ${params.sessionKey}: ${String(cancelOutcome.error)}`,
    );
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
  const closeOutcome = await runAcpCleanupStep({
    op: async () => {
      await acpManager.closeSession({
        cfg: params.cfg,
        sessionKey: acpSessionKey,
        reason: params.reason,
        discardPersistentState: true,
        requireAcpSession: false,
        allowBackendUnavailable: true,
      });
    },
  });
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
  if (closeOutcome.status === "timeout")
    return errorShape(
      ErrorCodes.UNAVAILABLE,
      `Session ${params.sessionKey} is still active; try again in a moment.`,
    );
  if (closeOutcome.status === "error")
    logVerbose(
      `sessions.${params.reason}: ACP runtime close failed for ${params.sessionKey}: ${String(closeOutcome.error)}`,
    );
  if (params.reason === "session-delete") {
    params.assertCurrent?.();
    await upsertAcpSessionMeta({
      cfg: params.cfg,
      sessionKey: acpSessionKey,
      mutate: () => null,
    });
    params.assertCurrent?.();
  } else if (params.deferResetState)
    params.onDeferredResetState?.({
      sessionKey: acpSessionKey,
      meta: acpMeta,
    });
  else {
    const resetMeta = await ensureFreshAcpResetState({
      cfg: params.cfg,
      sessionKey: acpSessionKey,
      reason: params.reason,
      acpMeta,
      assertCurrent: params.assertCurrent,
      shouldApply: params.shouldCleanup,
    });
    if (resetMeta)
      params.onResetMeta?.({
        sessionKey: acpSessionKey,
        meta: resetMeta,
      });
  }
}
function buildPendingAcpMeta(base, now) {
  const currentIdentity = base.identity;
  const nextIdentity = currentIdentity
    ? {
        state: "pending",
        ...(currentIdentity.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {}),
        source: currentIdentity.source,
        lastUpdatedAt: now,
      }
    : void 0;
  return {
    backend: base.backend,
    agent: base.agent,
    runtimeSessionName: base.runtimeSessionName,
    ...(nextIdentity ? { identity: nextIdentity } : {}),
    mode: base.mode,
    ...(base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {}),
    ...(base.cwd ? { cwd: base.cwd } : {}),
    state: "idle",
    lastActivityAt: now,
  };
}
async function ensureFreshAcpResetState(params) {
  if (params.reason !== "session-reset") return;
  const latestMeta = readAcpSessionMeta({ sessionKey: params.sessionKey }) ?? params.acpMeta;
  if (
    !latestMeta?.identity ||
    latestMeta.identity.state !== "resolved" ||
    (!latestMeta.identity.acpxSessionId && !latestMeta.identity.agentSessionId)
  )
    return;
  const backendId = (latestMeta.backend || params.cfg.acp?.backend || "").trim() || void 0;
  if (params.shouldApply && !params.shouldApply()) return;
  try {
    params.assertCurrent?.();
    await getAcpRuntimeBackend(backendId)?.runtime.prepareFreshSession?.({
      sessionKey: params.sessionKey,
    });
    if (params.shouldApply && !params.shouldApply()) return;
    params.assertCurrent?.();
  } catch (error) {
    params.assertCurrent?.();
    logVerbose(
      `sessions.${params.reason}: ACP prepareFreshSession failed for ${params.sessionKey}: ${String(error)}`,
    );
  }
  const now = Date.now();
  let resetMeta;
  if (params.shouldApply && !params.shouldApply()) return;
  params.assertCurrent?.();
  await upsertAcpSessionMeta({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
    mutate: (current) => {
      if (params.shouldApply && !params.shouldApply()) return current;
      resetMeta = buildPendingAcpMeta(current ?? latestMeta, now);
      return resetMeta;
    },
  });
  params.assertCurrent?.();
  return resetMeta;
}
async function closeChildAcpRuntimesForParent(params) {
  let children;
  try {
    if (params.shouldCleanup && !params.shouldCleanup()) return;
    params.assertCurrent?.();
    children = findDirectChildSessionsForParent({
      cfg: params.cfg,
      parentKey: params.parentKey,
    }).flatMap(({ sessionKey }) => {
      return readAcpSessionMeta({ sessionKey }) ? [{ sessionKey }] : [];
    });
  } catch (error) {
    logVerbose(
      `sessions.${params.reason}: failed to enumerate sessions for child ACP cleanup: ${String(error)}`,
    );
    return;
  }
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
  await Promise.allSettled(
    children.map(({ sessionKey }) =>
      closeAcpRuntimeForSession({
        cfg: params.cfg,
        sessionKey,
        reason: params.reason,
        assertCurrent: params.assertCurrent,
        shouldCleanup: params.shouldCleanup,
      }).then((childError) => {
        if (childError)
          logVerbose(`sessions.${params.reason}: child ACP cleanup incomplete for ${sessionKey}`);
      }),
    ),
  );
  if (params.shouldCleanup && !params.shouldCleanup()) return;
  params.assertCurrent?.();
}
async function cleanupSessionBeforeMutation(params) {
  const cleanupError = await ensureSessionRuntimeCleanup({
    cfg: params.cfg,
    key: params.key,
    target: params.target,
    sessionId: params.entry?.sessionId,
    assertCurrent: params.assertCurrent,
  });
  if (cleanupError) return cleanupError;
  const pluginCleanup = await runPluginHostCleanup({
    cfg: params.cfg,
    registry: getActivePluginRegistry(),
    reason: params.reason === "session-reset" ? "reset" : "delete",
    sessionKey: params.target.canonicalKey ?? params.key,
    shouldCleanup: () => {
      params.assertCurrent?.();
      return true;
    },
  });
  params.assertCurrent?.();
  for (const failure of pluginCleanup.failures)
    logVerbose(
      `plugin host cleanup failed for ${failure.pluginId}/${failure.hookId}: ${String(failure.error)}`,
    );
  const parentSessionKey = params.target.canonicalKey ?? params.canonicalKey ?? params.key;
  const parentAcpError = await closeAcpRuntimeForSession({
    cfg: params.cfg,
    sessionKey: parentSessionKey,
    fallbackSessionKeys: [params.canonicalKey, params.legacyKey, params.key],
    reason: params.reason,
    onResetMeta: params.onAcpResetMeta,
    assertCurrent: params.assertCurrent,
  });
  params.assertCurrent?.();
  await closeChildAcpRuntimesForParent({
    cfg: params.cfg,
    parentKey: params.target.canonicalKey ?? params.canonicalKey ?? params.key,
    reason: params.reason,
    assertCurrent: params.assertCurrent,
  });
  params.assertCurrent?.();
  if (parentAcpError) return parentAcpError;
  if (params.entry?.sessionId) {
    await resetRegisteredAgentHarnessSessions({
      agentId: normalizeAgentId(params.target.agentId ?? resolveDefaultAgentId(params.cfg)),
      sessionId: params.entry.sessionId,
      sessionKey: params.target.canonicalKey ?? params.key,
      sessionFile: params.entry.sessionFile,
      reason: params.reason === "session-reset" ? "reset" : "deleted",
    });
    params.assertCurrent?.();
  }
}
async function emitGatewayBeforeResetPluginHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("before_reset")) return;
  const sessionKey = params.target.canonicalKey ?? params.key;
  const sessionId = params.entry?.sessionId;
  const sessionFile = params.entry?.sessionFile;
  const agentId = normalizeAgentId(params.target.agentId ?? resolveDefaultAgentId(params.cfg));
  const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
  const messages =
    params.messages ??
    (await readGatewayBeforeResetPluginHookMessages({
      agentId,
      entry: params.entry,
      sessionId,
      sessionKey,
      storePath: params.storePath,
    }));
  hookRunner
    .runBeforeReset(
      {
        sessionFile,
        messages,
        reason: params.reason,
      },
      {
        agentId,
        sessionKey,
        sessionId,
        workspaceDir,
      },
    )
    .catch((err) => {
      logVerbose(`before_reset hook failed: ${String(err)}`);
    });
}
async function readGatewayBeforeResetPluginHookMessages(params) {
  if (typeof params.sessionId !== "string" || params.sessionId.trim().length === 0) return [];
  try {
    return await readSessionMessagesAsync(
      {
        agentId: params.agentId,
        sessionEntry: params.entry,
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        storePath: params.storePath,
      },
      {
        mode: "full",
        reason: "before_reset hook payload",
      },
    );
  } catch (err) {
    logVerbose(
      `before_reset: failed to read session messages for ${params.sessionId}; firing hook with empty messages (${String(err)})`,
    );
    return [];
  }
}
async function performGatewaySessionReset(params) {
  const resetTarget = (() => {
    const cfg = getRuntimeConfig();
    const explicitAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
    const parsedKey = parseAgentSessionKey(params.key);
    const inferredGlobalAgentId =
      !explicitAgentId &&
      parsedKey &&
      resolveSessionStoreKey({
        cfg,
        sessionKey: params.key,
      }) === "global"
        ? normalizeAgentId(parsedKey.agentId)
        : void 0;
    const requestedAgentId = explicitAgentId ?? inferredGlobalAgentId;
    if (requestedAgentId && !listAgentIds(cfg).includes(requestedAgentId))
      return {
        ok: false,
        error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id: ${requestedAgentId}`),
      };
    if (
      explicitAgentId &&
      parsedKey?.agentId &&
      normalizeAgentId(parsedKey.agentId) !== explicitAgentId
    )
      return {
        ok: false,
        error: errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId"),
      };
    const target = resolveGatewaySessionStoreTarget({
      cfg,
      key: params.key,
      ...(requestedAgentId ? { agentId: requestedAgentId } : {}),
    });
    return {
      ok: true,
      cfg,
      target,
      storePath: target.storePath,
      requestedAgentId,
    };
  })();
  if (!resetTarget.ok) return resetTarget;
  const initialResetEntry = loadSessionEntry(
    params.key,
    resetTarget.requestedAgentId ? { agentId: resetTarget.requestedAgentId } : void 0,
  ).entry;
  const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(
    resetTarget.target.canonicalKey,
    initialResetEntry,
  );
  if (missingHarnessSessionError)
    return {
      ok: false,
      error: errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError),
    };
  if (isModelSelectionLocked(initialResetEntry))
    return {
      ok: false,
      error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE),
    };
  const initialPlacementBlock = initialResetEntry?.sessionId
    ? resolveSessionPlacementResetBlock(initialResetEntry.sessionId)
    : void 0;
  if (initialPlacementBlock)
    return {
      ok: false,
      error: errorShape(
        ErrorCodes.INVALID_REQUEST,
        `Session ${params.key} cannot reset while ${initialPlacementBlock}.`,
      ),
    };
  const resetLifecycleIdentities = [
    resetTarget.target.canonicalKey,
    params.key,
    initialResetEntry?.sessionId,
  ];
  const activeLifecycleMutation = isSessionLifecycleMutationActive(
    resetTarget.storePath,
    resetLifecycleIdentities,
  );
  const activeCompaction = hasOnlySessionLifecycleMutationKindActive(
    resetTarget.storePath,
    resetLifecycleIdentities,
    "compaction",
  );
  if (activeLifecycleMutation && !activeCompaction)
    return {
      ok: false,
      error: errorShape(
        ErrorCodes.UNAVAILABLE,
        `Session ${params.key} has another lifecycle mutation in progress; try again.`,
      ),
    };
  let admittedWorkReleased = true;
  return await runExclusiveSessionLifecycleMutation({
    scope: resetTarget.storePath,
    identities: resetLifecycleIdentities,
    prepare: async () => {
      params.assertCurrent?.();
      admittedWorkReleased = await interruptSessionWorkAdmissions({
        scope: resetTarget.storePath,
        identities: resetLifecycleIdentities,
        timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
      });
    },
    run: async () => {
      const { cfg, target, storePath, requestedAgentId } = resetTarget;
      if (!admittedWorkReleased)
        return {
          ok: false,
          error: errorShape(
            ErrorCodes.UNAVAILABLE,
            `Session ${params.key} is still active; try again in a moment.`,
          ),
        };
      const { entry, legacyKey, canonicalKey } = loadSessionEntry(
        params.key,
        requestedAgentId ? { agentId: requestedAgentId } : void 0,
      );
      const placementBlock = entry?.sessionId
        ? resolveSessionPlacementResetBlock(entry.sessionId)
        : void 0;
      if (placementBlock)
        return {
          ok: false,
          error: errorShape(
            ErrorCodes.INVALID_REQUEST,
            `Session ${params.key} cannot reset while ${placementBlock}.`,
          ),
        };
      const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
      if (archivedSessionError)
        return {
          ok: false,
          error: errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError),
        };
      if (isModelSelectionLocked(entry))
        return {
          ok: false,
          error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE),
        };
      const hadExistingEntry = Boolean(entry);
      const agentId = normalizeAgentId(target.agentId ?? resolveDefaultAgentId(cfg));
      const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
      const resetPluginRegistry = getActivePluginRegistry();
      const isResetLifecycleCurrent = () => {
        try {
          params.assertCurrent?.();
          return true;
        } catch {
          return false;
        }
      };
      let deferredAcpResetState;
      const hookEvent = createInternalHookEvent(
        "command",
        params.reason,
        target.canonicalKey ?? params.key,
        {
          sessionEntry: entry,
          previousSessionEntry: entry,
          commandSource: params.commandSource,
          cfg,
          workspaceDir,
        },
      );
      params.assertCurrent?.();
      await triggerInternalHook(hookEvent);
      params.assertCurrent?.();
      const runtimeCleanupError = await ensureSessionRuntimeCleanup({
        cfg,
        key: params.key,
        target,
        sessionId: entry?.sessionId,
      });
      if (runtimeCleanupError)
        return {
          ok: false,
          error: runtimeCleanupError,
        };
      const parentAcpError = await closeAcpRuntimeForSession({
        cfg,
        sessionKey: target.canonicalKey ?? canonicalKey ?? params.key,
        fallbackSessionKeys: [canonicalKey, legacyKey, params.key],
        reason: "session-reset",
        deferResetState: true,
        onDeferredResetState: (state) => {
          deferredAcpResetState = state;
        },
      });
      if (parentAcpError)
        return {
          ok: false,
          error: parentAcpError,
        };
      const pluginCleanup = await runPluginHostCleanup({
        cfg,
        registry: resetPluginRegistry,
        reason: "reset",
        sessionKey: target.canonicalKey ?? params.key,
        skipPersistentSessionState: true,
      });
      for (const failure of pluginCleanup.failures)
        logVerbose(
          `plugin host cleanup failed for ${failure.pluginId}/${failure.hookId}: ${String(failure.error)}`,
        );
      await closeChildAcpRuntimesForParent({
        cfg,
        parentKey: target.canonicalKey ?? canonicalKey ?? params.key,
        reason: "session-reset",
      });
      if (entry?.sessionId)
        await resetRegisteredAgentHarnessSessions({
          agentId,
          sessionId: entry.sessionId,
          sessionKey: target.canonicalKey ?? params.key,
          sessionFile: entry.sessionFile,
          reason: "reset",
        });
      const beforeResetMessages = getGlobalHookRunner()?.hasHooks("before_reset")
        ? await readGatewayBeforeResetPluginHookMessages({
            agentId: normalizeAgentId(
              target.agentId ?? requestedAgentId ?? resolveDefaultAgentId(cfg),
            ),
            entry,
            sessionId: entry?.sessionId,
            sessionKey: target.canonicalKey ?? params.key,
            storePath,
          })
        : void 0;
      const lifecycle = await resetSessionEntryLifecycle({
        agentId: target.agentId,
        storePath,
        target: {
          canonicalKey: target.canonicalKey,
          storeKeys: target.storeKeys,
        },
        buildNextEntry: ({ currentEntry, primaryKey }) => {
          if (!isResetLifecycleCurrent() && currentEntry?.sessionId !== entry?.sessionId)
            params.assertCurrent?.();
          const sessionAgentId = normalizeAgentId(
            parseAgentSessionKey(primaryKey)?.agentId ??
              target.agentId ??
              requestedAgentId ??
              resolveDefaultAgentId(cfg),
          );
          const resetPreservedSelection = resolveResetPreservedSelection({ entry: currentEntry });
          const now = Date.now();
          const nextSessionId = randomUUID();
          const nextEntry = {
            sessionId: nextSessionId,
            sessionFile: formatSqliteSessionFileMarker({
              agentId: sessionAgentId,
              sessionId: nextSessionId,
              storePath,
            }),
            updatedAt: now,
            systemSent: false,
            abortedLastRun: false,
            thinkingLevel: currentEntry?.thinkingLevel,
            fastMode: currentEntry?.fastMode,
            verboseLevel: currentEntry?.verboseLevel,
            traceLevel: currentEntry?.traceLevel,
            reasoningLevel: currentEntry?.reasoningLevel,
            elevatedLevel: currentEntry?.elevatedLevel,
            ttsAuto: currentEntry?.ttsAuto,
            execHost: params.execNode
              ? "node"
              : params.clearExecBinding
                ? void 0
                : currentEntry?.execHost,
            execSecurity: currentEntry?.execSecurity,
            execAsk: currentEntry?.execAsk,
            execNode: params.execNode
              ? params.execNode
              : params.clearExecBinding
                ? void 0
                : currentEntry?.execNode,
            execCwd: params.execNode
              ? params.execCwd
              : params.clearExecBinding
                ? void 0
                : currentEntry?.execCwd,
            responseUsage: currentEntry?.responseUsage,
            pinnedAt: currentEntry?.pinnedAt,
            ...resetPreservedSelection,
            groupActivation: currentEntry?.groupActivation,
            groupActivationNeedsSystemIntro: currentEntry?.groupActivationNeedsSystemIntro,
            chatType: currentEntry?.chatType,
            compactionCount: currentEntry?.compactionCount,
            compactionCheckpoints: currentEntry?.compactionCheckpoints,
            sendPolicy: currentEntry?.sendPolicy,
            queueMode: currentEntry?.queueMode,
            queueDebounceMs: currentEntry?.queueDebounceMs,
            queueCap: currentEntry?.queueCap,
            queueDrop: currentEntry?.queueDrop,
            spawnedBy: currentEntry?.spawnedBy,
            spawnedWorkspaceDir: currentEntry?.spawnedWorkspaceDir,
            spawnedCwd: params.clearSpawnedCwd
              ? void 0
              : (params.spawnedCwd ?? currentEntry?.spawnedCwd),
            worktree: params.clearSpawnedCwd ? void 0 : (params.worktree ?? currentEntry?.worktree),
            parentSessionKey: currentEntry?.parentSessionKey,
            forkedFromParent: currentEntry?.forkedFromParent,
            spawnDepth: currentEntry?.spawnDepth,
            subagentRole: currentEntry?.subagentRole,
            subagentControlScope: currentEntry?.subagentControlScope,
            label: currentEntry?.label,
            displayName: currentEntry?.displayName,
            channel: currentEntry?.channel,
            groupId: currentEntry?.groupId,
            subject: currentEntry?.subject,
            groupChannel: currentEntry?.groupChannel,
            space: currentEntry?.space,
            origin: snapshotSessionOrigin(currentEntry),
            deliveryContext: currentEntry?.deliveryContext,
            cliSessionBindings: currentEntry?.cliSessionBindings,
            cliSessionIds: currentEntry?.cliSessionIds,
            claudeCliSessionId: currentEntry?.claudeCliSessionId,
            lastChannel: currentEntry?.lastChannel,
            lastTo: currentEntry?.lastTo,
            lastAccountId: currentEntry?.lastAccountId,
            lastThreadId: currentEntry?.lastThreadId,
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            totalTokensFresh: true,
          };
          if (!isSubagentSessionKey(primaryKey)) clearAllCliSessions(nextEntry);
          else
            nextEntry.cliSessionBindings = rebindCliSessionReseedReceiptsForReset(
              nextEntry.cliSessionBindings,
              nextSessionId,
            );
          return nextEntry;
        },
        afterEntryMutation: async (mutation) => {
          let committedAcpResetState;
          if (deferredAcpResetState) {
            const identity = deferredAcpResetState.meta.identity;
            if (
              identity?.state === "resolved" &&
              (identity.acpxSessionId || identity.agentSessionId)
            ) {
              committedAcpResetState = {
                sessionKey: deferredAcpResetState.sessionKey,
                meta: buildPendingAcpMeta(deferredAcpResetState.meta, Date.now()),
              };
              writeAcpSessionMetaForMigration({
                sessionKey: committedAcpResetState.sessionKey,
                sessionId: mutation.nextEntry.sessionId,
                meta: committedAcpResetState.meta,
              });
            }
          }
          params.onCommitted?.({
            key: target.canonicalKey,
            sessionId: mutation.nextEntry.sessionId,
          });
          if (committedAcpResetState && isResetLifecycleCurrent())
            try {
              await getAcpRuntimeBackend(
                (committedAcpResetState.meta.backend || cfg.acp?.backend || "").trim() || void 0,
              )?.runtime.prepareFreshSession?.({ sessionKey: committedAcpResetState.sessionKey });
            } catch (error) {
              logVerbose(
                `sessions.session-reset: ACP prepareFreshSession failed for ${committedAcpResetState.sessionKey}: ${String(error)}`,
              );
            }
          await emitGatewayBeforeResetPluginHook({
            cfg,
            key: params.key,
            messages: beforeResetMessages,
            target,
            storePath,
            entry: mutation.previousEntry,
            reason: params.reason,
          });
        },
      });
      handleSessionStateSessionReset(target.canonicalKey ?? params.key);
      const next = lifecycle.nextEntry;
      const selectedModel = resolveSessionModelRef(cfg, next, target.agentId);
      const resolved = {
        modelProvider: selectedModel.provider,
        model: selectedModel.model,
      };
      const responseEntry = {
        ...next,
        modelProvider: resolved.modelProvider,
        model: resolved.model,
      };
      const oldSessionId = lifecycle.previousSessionId;
      const oldSessionFile = lifecycle.previousSessionFile;
      const archivedTranscripts = lifecycle.archivedTranscripts;
      emitGatewaySessionEndPluginHook({
        cfg,
        sessionKey: target.canonicalKey ?? params.key,
        sessionId: oldSessionId,
        storePath,
        sessionFile: oldSessionFile,
        agentId: target.agentId,
        reason: params.reason,
        archivedTranscripts,
        nextSessionId: next.sessionId,
      });
      emitGatewaySessionStartPluginHook({
        cfg,
        sessionKey: target.canonicalKey ?? params.key,
        sessionId: next.sessionId,
        resumedFrom: oldSessionId,
        storePath,
        sessionFile: next.sessionFile,
        agentId: target.agentId,
      });
      if (hadExistingEntry)
        await emitSessionUnboundLifecycleEvent({
          targetSessionKey: target.canonicalKey ?? params.key,
          reason: "session-reset",
        });
      return {
        ok: true,
        key: target.canonicalKey,
        entry: responseEntry,
        resolved,
        agentId: target.agentId,
        storePath,
      };
    },
  });
}
//#endregion
export {
  emitGatewaySessionEndPluginHook as a,
  performGatewaySessionReset as c,
  emitGatewayBeforeResetPluginHook as i,
  cleanupSessionBeforeMutation as n,
  emitGatewaySessionStartPluginHook as o,
  drainActiveSessionsForShutdown as r,
  emitSessionUnboundLifecycleEvent as s,
  archiveSessionTranscriptsForSessionDetailed as t,
};
