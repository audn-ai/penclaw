import crypto from "node:crypto";
import "./agent-scope-y9xQv_q1.js";
import fs from "node:fs";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { i as getLogger } from "./logger-BUux_Jpv.js";
import { a as resolveMainSessionKey } from "./main-session-nrmKYo2W.js";
import { p as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-VC51jrBW.js";
import {
  i as resolveSessionFilePathOptions,
  l as resolveStorePath,
  r as resolveSessionFilePath,
} from "./paths-TfuVT-K8.js";
import {
  D as patchSessionEntry,
  I as purgeDeletedAgentSessionEntries,
  P as previewSessionDiskBudget,
  S as loadSessionEntry,
  a as applySessionEntryLifecycleMutation,
  w as loadTranscriptEventsSync,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import "./group-DxnHkVUi.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import "./delivery-info-Du3-Z2RS.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import "./combined-store-gateway-TXobKXN7.js";
import { l as recordSessionGoalChanged } from "./session-state-events-DXdC9X_q.js";
import "./lifecycle-5_TQ_dr5.js";
import "./reset-DwjOm4Ug.js";
import "./session-key-Beu1vXbM.js";
import "./transcript-kgNtplfz.js";
import {
  A as capEntryCount,
  D as rewriteSessionFileForNewSessionId,
  E as canonicalizeAbsoluteSessionFilePath,
  G as collectActiveSessionWorkAdmissionKeys,
  I as shouldPreserveMaintenanceEntry,
  L as shouldRunModelRunPrune,
  M as pruneStaleEntries,
  N as pruneStaleModelRunEntries,
  c as pruneUnreferencedSessionArtifacts,
  ct as cloneSessionStoreRecord,
  k as resolveMaintenanceConfig,
  l as resolveSessionArtifactCanonicalPathsForEntry,
  q as collectSessionMaintenancePreserveKeysForStore,
  x as resolveFreshSessionTotalTokens,
} from "./store-CzZJhTF6.js";
import {
  a as resolveSessionStoreTargets,
  o as resolveSqliteTargetFromSessionStorePath,
} from "./targets-CjMfpXbt.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
//#region src/config/sessions/compaction-session-file.ts
function resolveCompactionSessionFile(params) {
  const pathOpts = resolveSessionFilePathOptions({
    agentId: resolveAgentIdFromSessionKey(params.sessionKey),
    storePath: params.storePath,
  });
  const rewrittenSessionFile = rewriteSessionFileForNewSessionId({
    sessionFile: params.entry.sessionFile,
    previousSessionId: params.entry.sessionId,
    nextSessionId: params.newSessionId,
  });
  const normalizedRewrittenSessionFile =
    rewrittenSessionFile && path.isAbsolute(rewrittenSessionFile)
      ? canonicalizeAbsoluteSessionFilePath(rewrittenSessionFile)
      : rewrittenSessionFile;
  return resolveSessionFilePath(
    params.newSessionId,
    normalizedRewrittenSessionFile ? { sessionFile: normalizedRewrittenSessionFile } : void 0,
    pathOpts,
  );
}
//#endregion
//#region src/config/sessions/goals.ts
const MODEL_UPDATABLE_SESSION_GOAL_STATUSES = ["complete", "blocked"];
const TERMINAL_GOAL_STATUSES = /* @__PURE__ */ new Set(["complete"]);
function nowMs(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
}
function normalizeTokenCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : void 0;
}
function resolveEntryFreshTotalTokens(entry) {
  return normalizeTokenCount(resolveFreshSessionTotalTokens(entry));
}
function resolveEntryGoalStartTokens(entry) {
  return resolveEntryFreshTotalTokens(entry) ?? 0;
}
function normalizeTokenBudget(value) {
  const normalized = normalizeTokenCount(value);
  return normalized && normalized > 0 ? normalized : void 0;
}
function cloneGoal(goal) {
  return { ...goal };
}
function recordGoalChange(options, entry, summary) {
  recordSessionGoalChanged({
    sessionKey: options.sessionKey,
    entry,
    actor: options.actor,
    agentId: options.agentId,
    summary,
  });
}
function resolveSessionGoalDisplayState(entry, now, options) {
  return accountGoalUsage(entry, nowMs(now), options);
}
function accountGoalUsage(entry, now, options) {
  const goal = entry.goal;
  if (!goal) return;
  const totalTokens = resolveEntryFreshTotalTokens(entry);
  const hasFreshStart = goal.tokenStartFresh !== false;
  const shouldHoldStaleStart = !hasFreshStart && options?.adoptFreshBaseline === false;
  const shouldAdoptFreshStart = !shouldHoldStaleStart && totalTokens !== void 0 && !hasFreshStart;
  const tokenStart = shouldAdoptFreshStart
    ? totalTokens
    : (normalizeTokenCount(goal.tokenStart) ?? totalTokens ?? 0);
  const tokensUsed =
    totalTokens === void 0 || shouldAdoptFreshStart || shouldHoldStaleStart
      ? goal.tokensUsed
      : Math.max(goal.tokensUsed, Math.max(0, totalTokens - tokenStart));
  const next = {
    ...goal,
    tokenStart,
    tokenStartFresh: hasFreshStart || shouldAdoptFreshStart,
    tokensUsed,
  };
  if (next.status === "active" && next.tokenBudget !== void 0 && tokensUsed >= next.tokenBudget) {
    next.status = "budget_limited";
    next.budgetLimitedAt = now;
    next.updatedAt = now;
  }
  return next;
}
function goalsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function formatSessionGoalStatus(goal) {
  if (!goal) return "No goal for this session.\nStart one with /goal start <objective>.";
  const budget =
    goal.tokenBudget === void 0
      ? ""
      : `\nToken budget: ${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
  const note = goal.lastStatusNote ? `\nNote: ${goal.lastStatusNote}` : "";
  const commands = resolveGoalCommandHint(goal.status);
  return [
    "Goal",
    `Status: ${goal.status}`,
    `Objective: ${goal.objective}`,
    `Tokens used: ${formatTokenCount(goal.tokensUsed)}`,
    ...(budget ? [budget.slice(1)] : []),
    ...(note ? [note.slice(1)] : []),
    "",
    `Commands: ${commands}`,
  ].join("\n");
}
function resolveGoalCommandHint(status) {
  switch (status) {
    case "active":
      return "/goal edit <objective>, /goal pause, /goal complete, /goal clear";
    case "paused":
    case "blocked":
    case "usage_limited":
    case "budget_limited":
      return "/goal resume, /goal edit <objective>, /goal clear";
    case "complete":
      return "/goal clear";
  }
  return "/goal";
}
async function getSessionGoal(options) {
  const now = nowMs(options.now);
  if (options.persist === false) {
    const entry =
      loadSessionEntry({
        sessionKey: options.sessionKey,
        storePath: options.storePath,
      }) ?? options.fallbackEntry;
    const projected = entry
      ? resolveSessionGoalDisplayState(entry, now, { adoptFreshBaseline: false })
      : void 0;
    return projected
      ? {
          status: "found",
          goal: projected,
        }
      : { status: "missing" };
  }
  let goal;
  if (
    !(await patchSessionEntry(
      {
        sessionKey: options.sessionKey,
        storePath: options.storePath,
      },
      (entry) => {
        const accounted = accountGoalUsage(entry, now);
        goal = accounted ? cloneGoal(accounted) : void 0;
        if (!accounted || goalsEqual(accounted, entry.goal)) return null;
        return { goal: accounted };
      },
      { fallbackEntry: options.fallbackEntry },
    )) ||
    !goal
  )
    return { status: "missing" };
  return {
    status: "found",
    goal,
  };
}
async function createSessionGoal(options) {
  const objective = options.objective.trim();
  if (!objective) throw new Error("objective required");
  const now = nowMs(options.now);
  let created;
  const result = await patchSessionEntry(
    {
      sessionKey: options.sessionKey,
      storePath: options.storePath,
    },
    (entry) => {
      if (entry.goal) throw new Error("goal already exists");
      const tokenBudget = normalizeTokenBudget(options.tokenBudget);
      const tokenStartFresh = resolveEntryFreshTotalTokens(entry) !== void 0;
      created = {
        schemaVersion: 1,
        id: crypto.randomUUID(),
        objective,
        status: "active",
        createdAt: now,
        updatedAt: now,
        tokenStart: resolveEntryGoalStartTokens(entry),
        tokenStartFresh,
        tokensUsed: 0,
        ...(tokenBudget ? { tokenBudget } : {}),
        continuationTurns: 0,
      };
      return { goal: created };
    },
    { fallbackEntry: options.fallbackEntry },
  );
  if (!result || !created) throw new Error("session not found");
  recordGoalChange(options, result, "goal created");
  return cloneGoal(created);
}
async function updateSessionGoalStatus(options) {
  const now = nowMs(options.now);
  let updated;
  let foundSession = false;
  const result = await patchSessionEntry(
    {
      sessionKey: options.sessionKey,
      storePath: options.storePath,
    },
    (entry) => {
      foundSession = true;
      const accounted = accountGoalUsage(entry, now);
      if (!accounted) throw new Error("goal not found");
      if (TERMINAL_GOAL_STATUSES.has(accounted.status) && accounted.status !== options.status)
        throw new Error(`goal is already ${accounted.status}`);
      const resetsBudgetWindow =
        options.status === "active" &&
        (accounted.status === "budget_limited" ||
          accounted.status === "usage_limited" ||
          (accounted.tokenBudget !== void 0 && accounted.tokensUsed >= accounted.tokenBudget));
      const freshTokenStart = resetsBudgetWindow ? resolveEntryFreshTotalTokens(entry) : void 0;
      const next = {
        ...accounted,
        status: options.status,
        updatedAt: now,
        ...(options.note ? { lastStatusNote: options.note } : {}),
        ...(options.status === "paused" ? { pausedAt: now } : {}),
        ...(options.status === "blocked" ? { blockedAt: now } : {}),
        ...(options.status === "complete" ? { completedAt: now } : {}),
      };
      if (resetsBudgetWindow) {
        next.tokenStart = freshTokenStart ?? 0;
        next.tokenStartFresh = freshTokenStart !== void 0;
        next.tokensUsed = 0;
        delete next.budgetLimitedAt;
        delete next.usageLimitedAt;
      }
      if (
        next.status === "active" &&
        next.tokenBudget !== void 0 &&
        next.tokensUsed >= next.tokenBudget
      ) {
        next.status = "budget_limited";
        next.budgetLimitedAt = now;
      }
      updated = next;
      return { goal: updated };
    },
  );
  if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
  recordGoalChange(options, result, `goal status changed to ${updated.status}`);
  return cloneGoal(updated);
}
async function updateSessionGoalObjective(options) {
  const objective = options.objective.trim();
  if (!objective) throw new Error("objective required");
  const now = nowMs(options.now);
  let updated;
  let foundSession = false;
  const result = await patchSessionEntry(
    {
      sessionKey: options.sessionKey,
      storePath: options.storePath,
    },
    (entry) => {
      foundSession = true;
      const accounted = accountGoalUsage(entry, now);
      if (!accounted) throw new Error("goal not found");
      if (TERMINAL_GOAL_STATUSES.has(accounted.status))
        throw new Error(`goal is already ${accounted.status}`);
      updated = {
        ...accounted,
        objective,
        updatedAt: now,
      };
      return { goal: updated };
    },
  );
  if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
  recordGoalChange(options, result, "goal objective changed");
  return cloneGoal(updated);
}
async function clearSessionGoal(options) {
  let removed = false;
  const result = await patchSessionEntry(
    {
      sessionKey: options.sessionKey,
      storePath: options.storePath,
    },
    (entry) => {
      if (!entry.goal) return null;
      removed = true;
      return { goal: void 0 };
    },
  );
  if (result && removed) recordGoalChange(options, result, "goal cleared");
  return Boolean(result && removed);
}
//#endregion
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
  return resolveMainSessionKey(getRuntimeConfig());
}
//#endregion
//#region src/config/sessions/session-registry-maintenance.ts
function parseCronRunSessionJobId(sessionKey) {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) return;
  return /^cron:([^:]+):run:[^:]+$/u.exec(parsed.rest)?.[1];
}
function buildSessionRegistryPreserveKeys(params) {
  const preserveKeys =
    collectActiveSessionWorkAdmissionKeys({
      storePath: params.storePath,
      store: params.store,
    }) ?? /* @__PURE__ */ new Set();
  let preservedRunning = 0;
  for (const key of Object.keys(params.store)) {
    const jobId = parseCronRunSessionJobId(key);
    if (!jobId) {
      preserveKeys.add(key);
      continue;
    }
    if (params.runningCronJobIds.has(jobId)) {
      preserveKeys.add(key);
      preservedRunning += 1;
    }
  }
  return {
    preserveKeys,
    preservedRunning,
  };
}
function pruneSessionRegistryStore(params) {
  const { preserveKeys, preservedRunning } = buildSessionRegistryPreserveKeys({
    runningCronJobIds: params.runningCronJobIds,
    storePath: params.storePath,
    store: params.store,
  });
  const pruned = pruneStaleEntries(params.store, params.retentionMs, {
    log: false,
    onPruned: params.removals
      ? ({ key, entry }) => {
          params.removals?.push({
            sessionKey: key,
            expectedEntry: entry,
          });
        }
      : void 0,
    preserveKeys,
  });
  return {
    afterCount: Object.keys(params.store).length,
    preservedRunning,
    pruned,
  };
}
/**
 * Runs task session-registry maintenance for one resolved agent store.
 * Preview prunes a clone; apply uses one store-sized write transaction and
 * skips generic session maintenance so non-cron rows stay outside this sweep.
 */
async function runSessionRegistryMaintenanceForStore(params) {
  const sqliteTarget = resolveSqliteTargetFromSessionStorePath(params.storePath);
  if (sqliteTarget.path && !fs.existsSync(sqliteTarget.path))
    return {
      beforeCount: 0,
      afterCount: 0,
      preservedRunning: 0,
      pruned: 0,
    };
  const beforeStore = Object.fromEntries(
    listSessionEntries({ storePath: params.storePath }).map(({ sessionKey, entry }) => [
      sessionKey,
      entry,
    ]),
  );
  const beforeCount = Object.keys(beforeStore).length;
  if (!params.apply) {
    const previewStore = structuredClone(beforeStore);
    return {
      beforeCount,
      ...pruneSessionRegistryStore({
        retentionMs: params.retentionMs,
        runningCronJobIds: params.runningCronJobIds,
        storePath: params.storePath,
        store: previewStore,
      }),
    };
  }
  const applyStore = structuredClone(beforeStore);
  const removals = [];
  const applied = pruneSessionRegistryStore({
    retentionMs: params.retentionMs,
    removals,
    runningCronJobIds: params.runningCronJobIds,
    storePath: params.storePath,
    store: applyStore,
  });
  if (removals.length > 0) {
    const mutation = await applySessionEntryLifecycleMutation({
      storePath: params.storePath,
      removals,
      skipMaintenance: true,
    });
    return {
      afterCount: mutation.afterCount,
      beforeCount,
      preservedRunning: applied.preservedRunning,
      pruned: mutation.removedEntries,
    };
  }
  return {
    beforeCount,
    ...applied,
  };
}
//#endregion
//#region src/config/sessions/cleanup-service.ts
function resolveCleanupSqlitePath(target) {
  return (
    resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path ??
    resolveOpenClawAgentSqlitePath({ agentId: target.agentId })
  );
}
function loadCleanupSessionStore(target, options = {}) {
  if (options.createIfMissing !== true && !fs.existsSync(resolveCleanupSqlitePath(target)))
    return {};
  return Object.fromEntries(
    listSessionEntries({
      agentId: target.agentId,
      storePath: target.storePath,
    }).map(({ sessionKey, entry }) => [sessionKey, entry]),
  );
}
function isTranscriptMessageRole(role) {
  return (
    role === "user" ||
    role === "assistant" ||
    role === "tool" ||
    role === "toolResult" ||
    role === "system"
  );
}
function isTranscriptMessageRecord(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  if (record.type === "message") return true;
  if (
    record.type === void 0 &&
    record.message &&
    typeof record.message === "object" &&
    isTranscriptMessageRole(record.message.role)
  )
    return true;
  return record.type === void 0 && isTranscriptMessageRole(record.role);
}
function sqliteTranscriptHasMessageRecords(params) {
  try {
    return loadTranscriptEventsSync(params).some(isTranscriptMessageRecord);
  } catch {
    return false;
  }
}
/** Resolves the action label for one session key from cleanup key sets. */
function resolveSessionCleanupAction(params) {
  if (params.dmScopeRetiredKeys.has(params.key)) return "retire-dm-scope";
  if (params.missingKeys.has(params.key)) return "prune-missing";
  if (params.modelRunPrunedKeys.has(params.key)) return "prune-model-run";
  if (params.staleKeys.has(params.key)) return "prune-stale";
  if (params.cappedKeys.has(params.key)) return "cap-overflow";
  if (params.budgetEvictedKeys.has(params.key)) return "evict-budget";
  return "keep";
}
function isMainScopeStaleDirectSessionKey(params) {
  if ((params.cfg.session?.dmScope ?? "main") !== "main") return false;
  if (params.activeKey && params.key === params.activeKey) return false;
  const parsed = parseAgentSessionKey(params.key);
  if (!parsed || normalizeAgentId(parsed.agentId) !== normalizeAgentId(params.targetAgentId))
    return false;
  const parts = parsed.rest.split(":");
  if (parts[0] === "agent") return false;
  return (
    (parts.length === 2 && parts[0] === "direct" && Boolean(parts[1])) ||
    (parts.length === 3 && Boolean(parts[0]) && parts[1] === "direct" && Boolean(parts[2])) ||
    (parts.length === 4 &&
      Boolean(parts[0]) &&
      Boolean(parts[1]) &&
      parts[2] === "direct" &&
      Boolean(parts[3]))
  );
}
function retireMainScopeDirectSessionEntries(params) {
  let retired = 0;
  for (const [key, entry] of Object.entries(params.store))
    if (
      isMainScopeStaleDirectSessionKey({
        cfg: params.cfg,
        targetAgentId: params.targetAgentId,
        key,
        activeKey: params.activeKey,
      })
    ) {
      params.onRetired?.(key, entry);
      delete params.store[key];
      retired += 1;
    }
  return retired;
}
function serializeSessionCleanupResult(params) {
  if (params.summaries.length === 1) return params.summaries[0] ?? {};
  return {
    allAgents: true,
    mode: params.mode,
    dryRun: params.dryRun,
    stores: params.summaries,
  };
}
function pruneMissingTranscriptEntries(params) {
  let removed = 0;
  for (const [key, entry] of Object.entries(params.store)) {
    if (
      entry?.modelSelectionLocked === true &&
      shouldPreserveMaintenanceEntry({
        key,
        entry,
      })
    )
      continue;
    if (parseAgentSessionKey(key) && entry.sessionId === key && !entry.sessionFile) continue;
    if (!entry?.sessionId) {
      if (parseAgentSessionKey(key)) continue;
      delete params.store[key];
      removed += 1;
      params.onPruned?.(key, entry);
      continue;
    }
    if (
      !sqliteTranscriptHasMessageRecords({
        sessionId: entry.sessionId,
        sessionKey: key,
        storePath: params.storePath,
      })
    ) {
      delete params.store[key];
      removed += 1;
      params.onPruned?.(key, entry);
    }
  }
  return removed;
}
function addEntryArtifactPathsToSet(params) {
  const sessionsDir = path.dirname(params.storePath);
  for (const key of params.keys) {
    const entry = params.store[key];
    if (!entry) continue;
    for (const artifactPath of resolveSessionArtifactCanonicalPathsForEntry({
      sessionsDir,
      entry,
    }))
      params.paths.add(artifactPath);
  }
}
async function previewStoreCleanup(params) {
  const beforeStore = loadCleanupSessionStore(params.target, { createIfMissing: !params.dryRun });
  const previewStore = cloneSessionStoreRecord(beforeStore);
  const staleKeys = /* @__PURE__ */ new Set();
  const cappedKeys = /* @__PURE__ */ new Set();
  const missingKeys = /* @__PURE__ */ new Set();
  const modelRunPrunedKeys = /* @__PURE__ */ new Set();
  const dmScopeRetiredKeys = /* @__PURE__ */ new Set();
  const missing =
    params.fixMissing === true
      ? pruneMissingTranscriptEntries({
          store: previewStore,
          storePath: params.target.storePath,
          onPruned: (key) => {
            missingKeys.add(key);
          },
        })
      : 0;
  const dmScopeRetired =
    params.fixDmScope === true
      ? retireMainScopeDirectSessionEntries({
          cfg: params.cfg,
          store: previewStore,
          targetAgentId: params.target.agentId,
          activeKey: params.activeKey,
          onRetired: (key) => {
            dmScopeRetiredKeys.add(key);
          },
        })
      : 0;
  const preserveSessionKeys = collectSessionMaintenancePreserveKeysForStore({
    storePath: params.target.storePath,
    store: previewStore,
    baseKeys: [params.activeKey],
  });
  const modelRunPruned = shouldRunModelRunPrune({
    maintenance: params.maintenance,
    entryCount: Object.keys(previewStore).length,
    force: true,
  })
    ? pruneStaleModelRunEntries(previewStore, params.maintenance.modelRunPruneAfterMs, {
        log: false,
        preserveKeys: preserveSessionKeys,
        onPruned: ({ key }) => {
          modelRunPrunedKeys.add(key);
        },
      })
    : 0;
  const pruned = pruneStaleEntries(previewStore, params.maintenance.pruneAfterMs, {
    log: false,
    preserveKeys: preserveSessionKeys,
    onPruned: ({ key }) => {
      staleKeys.add(key);
    },
  });
  const capped = capEntryCount(previewStore, params.maintenance.maxEntries, {
    log: false,
    preserveKeys: preserveSessionKeys,
    onCapped: ({ key }) => {
      cappedKeys.add(key);
    },
  });
  const entryCleanupArtifactPaths = /* @__PURE__ */ new Set();
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: modelRunPrunedKeys,
  });
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: staleKeys,
  });
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: cappedKeys,
  });
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: dmScopeRetiredKeys,
  });
  const diskBudgetPreview = fs.existsSync(resolveCleanupSqlitePath(params.target))
    ? previewSessionDiskBudget({
        agentId: params.target.agentId,
        store: previewStore,
        storePath: params.target.storePath,
        activeSessionKey: params.activeKey,
        preserveKeys: preserveSessionKeys,
        maintenance: params.maintenance,
      })
    : {
        diskBudget: null,
        removedKeys: /* @__PURE__ */ new Set(),
      };
  const diskBudget = diskBudgetPreview.diskBudget;
  const unreferencedArtifacts = await pruneUnreferencedSessionArtifacts({
    store: previewStore,
    storePath: params.target.storePath,
    olderThanMs: params.maintenance.pruneAfterMs,
    dryRun: true,
    excludeCanonicalPaths: entryCleanupArtifactPaths,
  });
  const budgetEvictedKeys = diskBudgetPreview.removedKeys;
  const beforeCount = Object.keys(beforeStore).length;
  const afterPreviewCount = Object.keys(previewStore).length;
  const wouldMutate =
    missing > 0 ||
    dmScopeRetired > 0 ||
    modelRunPruned > 0 ||
    pruned > 0 ||
    capped > 0 ||
    unreferencedArtifacts.removedFiles > 0 ||
    (diskBudget?.removedEntries ?? 0) > 0 ||
    (diskBudget?.removedFiles ?? 0) > 0;
  return {
    summary: {
      agentId: params.target.agentId,
      storePath: params.target.storePath,
      mode: params.mode,
      dryRun: params.dryRun,
      beforeCount,
      afterCount: afterPreviewCount,
      missing,
      dmScopeRetired,
      modelRunPruned,
      pruned,
      capped,
      unreferencedArtifacts,
      diskBudget,
      wouldMutate,
    },
    beforeStore,
    missingKeys,
    modelRunPrunedKeys,
    staleKeys,
    cappedKeys,
    budgetEvictedKeys,
    dmScopeRetiredKeys,
  };
}
/** Runs session cleanup preview/apply for the selected store targets. */
async function runSessionsCleanup(params) {
  const { cfg, opts } = params;
  const maintenance = resolveMaintenanceConfig();
  const mode = opts.enforce ? "enforce" : maintenance.mode;
  const targets =
    params.targets ??
    resolveSessionStoreTargets(cfg, {
      store: opts.store,
      agent: opts.agent,
      allAgents: opts.allAgents,
    });
  const previewResults = [];
  for (const target of targets) {
    const result = await previewStoreCleanup({
      cfg,
      target,
      maintenance,
      mode,
      dryRun: Boolean(opts.dryRun),
      activeKey: opts.activeKey,
      fixMissing: Boolean(opts.fixMissing),
      fixDmScope: Boolean(opts.fixDmScope),
    });
    previewResults.push(result);
  }
  const appliedSummaries = [];
  if (!opts.dryRun)
    for (const target of targets) {
      const applyStore = loadCleanupSessionStore(target, { createIfMissing: true });
      const missingRemovals = [];
      const dmScopeRetiredRemovals = [];
      if (opts.fixMissing)
        pruneMissingTranscriptEntries({
          store: applyStore,
          storePath: target.storePath,
          onPruned: (sessionKey, entry) => {
            missingRemovals.push({
              sessionKey,
              expectedEntry: cloneSessionStoreRecord({ entry }).entry,
            });
          },
        });
      if (opts.fixDmScope)
        retireMainScopeDirectSessionEntries({
          cfg,
          store: applyStore,
          targetAgentId: target.agentId,
          activeKey: opts.activeKey,
          onRetired: (sessionKey, entry) => {
            dmScopeRetiredRemovals.push({
              sessionKey,
              expectedEntry: cloneSessionStoreRecord({ entry }).entry,
              archiveRemovedTranscript: true,
            });
          },
        });
      const removals = [...missingRemovals, ...dmScopeRetiredRemovals];
      const lifecycleResult = await applySessionEntryLifecycleMutation({
        storePath: target.storePath,
        removals,
        activeSessionKey: opts.activeKey,
        preserveActiveWork: true,
        maintenanceOverride: {
          ...maintenance,
          mode,
        },
        restrictArchivedTranscriptsToStoreDir: true,
      });
      const postApplyStore = loadCleanupSessionStore(target, { createIfMissing: true });
      const appliedUnreferencedArtifacts =
        mode === "warn"
          ? null
          : await pruneUnreferencedSessionArtifacts({
              store: postApplyStore,
              storePath: target.storePath,
              olderThanMs: maintenance.pruneAfterMs,
              dryRun: false,
            });
      const removedSessionKeys = new Set(lifecycleResult.removedSessionKeys);
      const missingApplied = missingRemovals.filter(({ sessionKey }) =>
        removedSessionKeys.has(sessionKey),
      ).length;
      const dmScopeRetiredApplied = dmScopeRetiredRemovals.filter(({ sessionKey }) =>
        removedSessionKeys.has(sessionKey),
      ).length;
      const unreferencedArtifacts =
        mode === "warn"
          ? {
              scannedFiles: 0,
              removedFiles: 0,
              freedBytes: 0,
              olderThanMs: maintenance.pruneAfterMs,
            }
          : (lifecycleResult.unreferencedArtifacts ??
            appliedUnreferencedArtifacts ?? {
              scannedFiles: 0,
              removedFiles: 0,
              freedBytes: 0,
              olderThanMs: maintenance.pruneAfterMs,
            });
      const preview = previewResults.find(
        (result) => result.summary.storePath === target.storePath,
      );
      const appliedReport = lifecycleResult.maintenanceReport;
      const summary =
        appliedReport === null
          ? {
              ...(preview?.summary ?? {
                agentId: target.agentId,
                storePath: target.storePath,
                mode,
                dryRun: false,
                beforeCount: 0,
                afterCount: 0,
                missing: 0,
                dmScopeRetired: 0,
                modelRunPruned: 0,
                pruned: 0,
                capped: 0,
                unreferencedArtifacts,
                diskBudget: null,
                wouldMutate: false,
              }),
              dryRun: false,
              unreferencedArtifacts,
              wouldMutate:
                (preview?.summary.wouldMutate ?? false) || unreferencedArtifacts.removedFiles > 0,
              applied: true,
              appliedCount: lifecycleResult.afterCount,
            }
          : {
              agentId: target.agentId,
              storePath: target.storePath,
              mode: appliedReport.mode,
              dryRun: false,
              beforeCount: appliedReport.beforeCount,
              afterCount: appliedReport.afterCount,
              missing: missingApplied,
              dmScopeRetired: dmScopeRetiredApplied,
              modelRunPruned: appliedReport.modelRunPruned,
              pruned: appliedReport.pruned,
              capped: appliedReport.capped,
              unreferencedArtifacts,
              diskBudget: appliedReport.diskBudget,
              wouldMutate:
                missingApplied > 0 ||
                dmScopeRetiredApplied > 0 ||
                appliedReport.modelRunPruned > 0 ||
                appliedReport.pruned > 0 ||
                appliedReport.capped > 0 ||
                unreferencedArtifacts.removedFiles > 0 ||
                (appliedReport.diskBudget?.removedEntries ?? 0) > 0 ||
                (appliedReport.diskBudget?.removedFiles ?? 0) > 0,
              applied: true,
              appliedCount: lifecycleResult.afterCount,
            };
      appliedSummaries.push(summary);
    }
  return {
    mode,
    previewResults,
    appliedSummaries,
  };
}
/** Purge session store entries for a deleted agent (#65524). Best-effort. */
async function purgeAgentSessionStoreEntries(cfg, agentId) {
  try {
    const normalizedAgentId = normalizeAgentId(agentId);
    const storeConfig = cfg.session?.store;
    await purgeDeletedAgentSessionEntries({
      cfg,
      agentId: normalizedAgentId,
      storeAgentId:
        typeof storeConfig === "string" && !storeConfig.includes("{agentId}")
          ? normalizeAgentId(resolveDefaultAgentId(cfg))
          : normalizedAgentId,
      storePath: resolveStorePath(cfg.session?.store, { agentId: normalizedAgentId }),
    });
  } catch (err) {
    getLogger().debug("session store purge skipped during agent delete", err);
  }
}
//#endregion
export {
  runSessionRegistryMaintenanceForStore as a,
  clearSessionGoal as c,
  getSessionGoal as d,
  resolveSessionGoalDisplayState as f,
  resolveCompactionSessionFile as h,
  serializeSessionCleanupResult as i,
  createSessionGoal as l,
  updateSessionGoalStatus as m,
  resolveSessionCleanupAction as n,
  resolveMainSessionKeyFromConfig as o,
  updateSessionGoalObjective as p,
  runSessionsCleanup as r,
  MODEL_UPDATABLE_SESSION_GOAL_STATUSES as s,
  purgeAgentSessionStoreEntries as t,
  formatSessionGoalStatus as u,
};
