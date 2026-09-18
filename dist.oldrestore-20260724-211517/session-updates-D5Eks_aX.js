import crypto from "node:crypto";
import {
  a as buildSessionStartHookPayload,
  i as buildSessionEndHookPayload,
  r as noteActiveSessionForShutdown,
  t as forgetActiveSessionForShutdown,
} from "./active-sessions-shutdown-tracker-DGXEyl-H.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-CZ1jkNDD.js";
import { p as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-yGjmBAjy.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { t as getRemoteSkillEligibility } from "./remote-DyEoYksv.js";
import { D as patchSessionEntry, at as updateSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-9k72HzMB.js";
import { s as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-Cjj8g4Lp.js";
import { h as resolveCompactionSessionFile } from "./sessions-CEG7v41b.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/session-updates.ts
/** Session update helpers for skill snapshots, compaction, and lifecycle hooks. */
async function persistSessionEntryUpdate(params) {
  if (!params.sessionEntryHandle && (!params.sessionStore || !params.sessionKey)) return;
  if (!params.storePath || !params.sessionKey) {
    if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(params.nextEntry);
    else if (params.sessionStore && params.sessionKey)
      params.sessionStore[params.sessionKey] = {
        ...params.sessionStore[params.sessionKey],
        ...params.nextEntry,
      };
    return params.nextEntry;
  }
  const persistedEntry = await updateSessionEntry(
    {
      storePath: params.storePath,
      sessionKey: params.sessionKey,
    },
    (entry) => (entry.sessionId === params.expectedSessionId ? params.updates : null),
  );
  if (persistedEntry) {
    if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(persistedEntry);
    else if (params.sessionStore && params.sessionKey)
      params.sessionStore[params.sessionKey] = persistedEntry;
    return persistedEntry;
  }
  params.sessionEntryHandle?.clearCurrent();
  if (params.sessionStore && params.sessionKey) delete params.sessionStore[params.sessionKey];
}
function emitCompactionSessionLifecycleHooks(params) {
  if (params.previousEntry.sessionId)
    forgetActiveSessionForShutdown(params.previousEntry.sessionId);
  if (params.nextEntry.sessionId && params.storePath)
    noteActiveSessionForShutdown({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      sessionId: params.nextEntry.sessionId,
      storePath: params.storePath,
      sessionFile: params.nextEntry.sessionFile,
      agentId: resolveAgentIdFromSessionKey(params.sessionKey),
    });
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner) return;
  if (hookRunner.hasHooks("session_end")) {
    const transcript = resolveStableSessionEndTranscript({
      sessionId: params.previousEntry.sessionId,
      storePath: params.storePath,
      sessionFile: params.previousEntry.sessionFile,
      agentId: resolveAgentIdFromSessionKey(params.sessionKey),
    });
    const payload = buildSessionEndHookPayload({
      sessionId: params.previousEntry.sessionId,
      sessionKey: params.sessionKey,
      cfg: params.cfg,
      reason: "compaction",
      sessionFile: transcript.sessionFile,
      transcriptArchived: transcript.transcriptArchived,
      nextSessionId: params.nextEntry.sessionId,
    });
    runWithGatewayIndependentRootWorkContinuation(async () => {
      await hookRunner.runSessionEnd(payload.event, payload.context);
    }).catch((err) => {
      logVerbose(`session_end hook failed: ${String(err)}`);
    });
  }
  if (hookRunner.hasHooks("session_start")) {
    const payload = buildSessionStartHookPayload({
      sessionId: params.nextEntry.sessionId,
      sessionKey: params.sessionKey,
      cfg: params.cfg,
      resumedFrom: params.previousEntry.sessionId,
    });
    runWithGatewayIndependentRootWorkContinuation(async () => {
      await hookRunner.runSessionStart(payload.event, payload.context);
    }).catch((err) => {
      logVerbose(`session_start hook failed: ${String(err)}`);
    });
  }
}
function resolveNonNegativeTokenCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : void 0;
}
/** Ensures a session entry has the reusable skill snapshot needed for reply runs. */
async function ensureSkillSnapshot(params) {
  if (process.env.OPENCLAW_TEST_FAST === "1")
    return {
      sessionEntry: params.sessionEntry,
      skillsSnapshot: params.sessionEntry?.skillsSnapshot,
      systemSent: params.sessionEntry?.systemSent ?? false,
    };
  const {
    sessionEntry,
    sessionEntryHandle,
    sessionStore,
    sessionKey,
    storePath,
    sessionId,
    isFirstTurnInSession,
    workspaceDir,
    cfg,
    skillFilter,
  } = params;
  let nextEntry = sessionEntryHandle?.getCurrent() ?? sessionEntry;
  let systemSent = sessionEntry?.systemSent ?? false;
  const sessionAgentId = resolveSessionAgentId({
    sessionKey,
    config: cfg,
  });
  const nodeSkillsEligibility = resolveNodeExecEligibility({
    cfg,
    sessionEntry,
    sessionKey,
    agentId: sessionAgentId,
    execOverrides: params.execOverrides,
  });
  const remoteEligibility = getRemoteSkillEligibility({
    advertiseExecNode: nodeSkillsEligibility.canExec,
  });
  const existingSnapshot = nextEntry?.skillsSnapshot;
  const resolveSnapshot = (snapshot) =>
    resolveReusableWorkspaceSkillSnapshot({
      workspaceDir,
      config: cfg,
      agentId: sessionAgentId,
      skillFilter,
      eligibility: {
        nodeSkills: nodeSkillsEligibility,
        remote: remoteEligibility,
      },
      existingSnapshot: snapshot,
    });
  const initialSnapshotState = resolveSnapshot(existingSnapshot);
  const shouldRefreshSnapshot = initialSnapshotState.shouldRefresh;
  if (isFirstTurnInSession && (sessionEntryHandle || sessionStore) && sessionKey) {
    const current = nextEntry ??
      sessionEntryHandle?.get(sessionKey) ??
      sessionStore?.[sessionKey] ?? {
        sessionId: sessionId ?? crypto.randomUUID(),
        updatedAt: Date.now(),
      };
    const skillSnapshot =
      !current.skillsSnapshot || shouldRefreshSnapshot
        ? initialSnapshotState.snapshot
        : resolveSnapshot(current.skillsSnapshot).snapshot;
    nextEntry = {
      ...current,
      sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
      updatedAt: Date.now(),
      systemSent: true,
      skillsSnapshot: skillSnapshot,
    };
    const persistedEntry = await persistSessionEntryUpdate({
      expectedSessionId: current.sessionId,
      sessionEntryHandle,
      sessionStore,
      sessionKey,
      storePath,
      nextEntry,
      updates: {
        sessionId: nextEntry.sessionId,
        updatedAt: nextEntry.updatedAt,
        systemSent: nextEntry.systemSent,
        skillsSnapshot: nextEntry.skillsSnapshot,
      },
    });
    nextEntry = persistedEntry;
    systemSent = persistedEntry?.systemSent ?? systemSent;
  }
  const skillsSnapshot =
    Boolean(nextEntry?.skillsSnapshot) &&
    (nextEntry?.skillsSnapshot !== existingSnapshot || !shouldRefreshSnapshot) &&
    nextEntry?.skillsSnapshot
      ? resolveSnapshot(nextEntry.skillsSnapshot).snapshot
      : shouldRefreshSnapshot || !nextEntry?.skillsSnapshot
        ? initialSnapshotState.snapshot
        : resolveSnapshot(nextEntry.skillsSnapshot).snapshot;
  if (
    skillsSnapshot &&
    (sessionEntryHandle || sessionStore) &&
    sessionKey &&
    !isFirstTurnInSession &&
    (!nextEntry?.skillsSnapshot || shouldRefreshSnapshot)
  ) {
    const current = nextEntry ?? {
      sessionId: sessionId ?? crypto.randomUUID(),
      updatedAt: Date.now(),
    };
    nextEntry = {
      ...current,
      sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
      updatedAt: Date.now(),
      skillsSnapshot,
    };
    nextEntry = await persistSessionEntryUpdate({
      expectedSessionId: current.sessionId,
      sessionEntryHandle,
      sessionStore,
      sessionKey,
      storePath,
      nextEntry,
      updates: {
        sessionId: nextEntry.sessionId,
        updatedAt: nextEntry.updatedAt,
        skillsSnapshot: nextEntry.skillsSnapshot,
      },
    });
  }
  return {
    sessionEntry: nextEntry,
    skillsSnapshot,
    systemSent,
  };
}
/** Increments compaction count and persists the updated session entry. */
async function incrementCompactionCount(params) {
  const {
    sessionEntry,
    sessionStore,
    sessionKey,
    storePath,
    cfg,
    now = Date.now(),
    amount = 1,
    tokensAfter,
    newSessionId,
    newSessionFile,
  } = params;
  if (!sessionStore || !sessionKey) return;
  const entry = sessionStore[sessionKey] ?? sessionEntry;
  if (!entry) return;
  const incrementBy = Math.max(0, amount);
  const nextCount = (entry.compactionCount ?? 0) + incrementBy;
  const updates = {
    compactionCount: nextCount,
    updatedAt: now,
  };
  const explicitNewSessionFile = normalizeOptionalString(newSessionFile);
  const sessionIdChanged = Boolean(newSessionId && newSessionId !== entry.sessionId);
  const sessionFileChanged = Boolean(
    explicitNewSessionFile && explicitNewSessionFile !== entry.sessionFile,
  );
  if (sessionIdChanged && newSessionId) {
    updates.sessionId = newSessionId;
    updates.sessionFile =
      explicitNewSessionFile ??
      resolveCompactionSessionFile({
        entry,
        sessionKey,
        storePath,
        newSessionId,
      });
    updates.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
    updates.usageFamilySessionIds = Array.from(
      /* @__PURE__ */ new Set([
        ...(entry.usageFamilySessionIds ?? []),
        entry.sessionId,
        newSessionId,
      ]),
    );
  } else if (sessionFileChanged && explicitNewSessionFile)
    updates.sessionFile = explicitNewSessionFile;
  const tokensAfterCompaction = resolveNonNegativeTokenCount(tokensAfter);
  if (tokensAfterCompaction !== void 0) {
    updates.totalTokens = tokensAfterCompaction;
    updates.totalTokensFresh = true;
    updates.inputTokens = void 0;
    updates.outputTokens = void 0;
    updates.cacheRead = void 0;
    updates.cacheWrite = void 0;
  } else if (incrementBy > 0) updates.totalTokensFresh = false;
  const nextEntry = {
    ...entry,
    ...updates,
  };
  sessionStore[sessionKey] = nextEntry;
  if (storePath) {
    const persistedEntry = await patchSessionEntry(
      {
        storePath,
        sessionKey,
      },
      () => updates,
      { fallbackEntry: nextEntry },
    );
    if (persistedEntry) sessionStore[sessionKey] = persistedEntry;
  }
  if ((sessionIdChanged || sessionFileChanged) && cfg)
    emitCompactionSessionLifecycleHooks({
      cfg,
      sessionKey,
      storePath,
      previousEntry: entry,
      nextEntry: sessionStore[sessionKey],
    });
  return nextCount;
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
