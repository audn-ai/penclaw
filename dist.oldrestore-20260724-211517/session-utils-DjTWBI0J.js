import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as listGatewayAgentIds } from "./agent-list-DLfObW15.js";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-CmlZPRYq.js";
import "./src-Bl7G9qvi.js";
import {
  c as resolveDefaultAgentId,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  d as resolveAgentModelFallbacksOverride,
  o as resolveAgentEffectiveModelPrimary,
} from "./agent-scope-y9xQv_q1.js";
import "./utils-DtcDeqWS.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { i as lookupContextTokens, o as resolveContextTokensForModel } from "./context-D1brGGkh.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { s as normalizeSessionDeliveryFields } from "./delivery-context.shared-WPZGmi9R.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as resolveFastModeState } from "./fast-mode-C6dQXWoG.js";
import { i as insideGitCheckout } from "./git-CvJkUhVJ.js";
import { n as buildGroupDisplayTitle, t as buildGroupDisplayName } from "./group-DxnHkVUi.js";
import { r as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-QU3dVYWF.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { r as resolveAgentMainSessionKey } from "./main-session-nrmKYo2W.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-B7OGjVYg.js";
import { t as isCliProvider } from "./model-selection-cli-BGoUsby5.js";
import { i as normalizeStoredOverrideModel } from "./model-selection-DOlkTrQa.js";
import { c as parseModelRef } from "./model-selection-normalize-BoKGJiBx.js";
import {
  S as findModelCatalogEntry,
  u as inferUniqueProviderFromConfiguredModels,
  v as resolveConfiguredModelRef,
  w as modelSupportsInput,
} from "./model-selection-shared-BliwFXJy.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-C_eCEq4B.js";
import { t as resolveNonNegativeNumber } from "./number-coercion-EqFmHmOw.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { _ as projectPluginSessionExtensionsSync } from "./registry-B14M_H8G.js";
import { n as withPinnedActivePluginRegistryWorkspaceDir } from "./runtime-workspace-state-B8jf8nGo.js";
import {
  Jt as resolveSessionStoreKey,
  Yt as resolveStoredSessionKeyForAgentStore,
  qt as resolveSessionStoreAgentId,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import { l as normalizeMainKey } from "./session-key-druuY-GG.js";
import { t as resolveCronAgentSessionKey } from "./session-key-MFREoGog.js";
import {
  c as parseAgentSessionKey,
  n as isAcpSessionKey,
  r as isCronRunSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import "./model-catalog-DxYvPELu.js";
import {
  a as repairAcpSessionMetaKeyForMigration,
  i as readAcpSessionMetaForEntry,
  r as readAcpSessionMeta,
} from "./session-meta-IQvNG5NK.js";
import {
  n as resolveSessionModelRef,
  t as resolveSessionModelIdentityRef,
} from "./session-model-ref-1c6_XVhy.js";
import "./combined-store-gateway-TXobKXN7.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DgCFENjt.js";
import { s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.js";
import {
  d as readSessionTitleFieldsFromTranscript,
  f as readSessionTitleFieldsFromTranscriptAsync,
  i as readRecentSessionUsageFromTranscript,
} from "./session-transcript-readers-Bv0ty7AX.js";
import { f as resolveSessionGoalDisplayState } from "./sessions-CEG7v41b.js";
import {
  _ as isTerminalSessionStatus,
  lt as getSessionStoreCacheVersion,
  x as resolveFreshSessionTotalTokens,
} from "./store-CzZJhTF6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  a as getSessionDisplaySubagentRunByChildSessionKey,
  c as listSubagentRunsForController,
  n as buildSubagentRunReadIndex,
  o as isSubagentRunLive,
  r as countActiveDescendantRuns,
} from "./subagent-registry-read-BYGCPLV8.js";
import {
  a as shouldKeepSubagentRunChildLink,
  c as resolveSubagentSessionStatus,
  o as getSubagentSessionRuntimeMs,
  s as getSubagentSessionStartedAt,
} from "./subagent-run-liveness-CYJpdt9z.js";
import { i as resolveAllAgentSessionStoreTargetsSync } from "./targets-CjMfpXbt.js";
import {
  i as listThinkingLevelOptions,
  o as resolveSupportedThinkingLevel,
} from "./thinking-CVcRbjTC.js";
import {
  r as resolveEffectiveAgentRuntime,
  t as concretizeAgentRuntime,
} from "./thinking-runtime-D675lyzz.js";
import {
  d as resolveEffectiveResponseUsage,
  s as normalizeThinkLevel,
} from "./thinking.shared-BWnbgBUO.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-D2Sx-NyU.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/cron/job-session-bindings.ts
/**
 * Resolves every canonical session key a job is bound to: the session the run
 * joins (main/isolated/session:<key>) plus the explicit wake/delivery lane in
 * job.sessionKey. Keys use the same canonicalization as cron run/session
 * creation, so they compare equal to gateway session-store row keys.
 */
function resolveCronJobBoundSessionKeys(job, opts) {
  const agentId = normalizeAgentId(job.agentId ?? opts.defaultAgentId);
  const keys = /* @__PURE__ */ new Set();
  const add = (sessionKey) => {
    const trimmed = sessionKey?.trim();
    if (!trimmed) return;
    keys.add(
      resolveCronAgentSessionKey({
        sessionKey: trimmed,
        agentId,
        mainKey: opts.cfg.session?.mainKey,
        cfg: opts.cfg,
      }),
    );
  };
  try {
    if (job.sessionTarget === "main") add("main");
    else if (job.sessionTarget === "isolated" || job.sessionTarget === "current")
      add(`cron:${job.id}`);
    else add(resolveCronSessionTargetSessionKey(job.sessionTarget));
    add(job.sessionKey);
  } catch {
    keys.clear();
  }
  return keys;
}
/** Signals a locked re-check found the job no longer bound; a per-job no-op. */
var CronJobBindingStaleError = class extends Error {
  constructor() {
    super("cron job binding changed concurrently");
  }
};
/**
 * Disables every enabled cron job bound to a session, used when the session is
 * archived so schedules stop targeting a lane that rejects new work.
 * Returns the disabled job ids.
 */
async function disableCronJobsBoundToSession(params) {
  const jobs = await params.cron.list();
  const defaultAgentId = params.cron.getDefaultAgentId();
  const boundToSession = (job) =>
    job.enabled &&
    resolveCronJobBoundSessionKeys(job, {
      cfg: params.cfg,
      defaultAgentId,
    }).has(params.sessionKey);
  const disabled = [];
  const failures = [];
  for (const job of jobs) {
    if (!boundToSession(job)) continue;
    try {
      await params.cron.updateWithPrecondition(job.id, { enabled: false }, (currentJob) => {
        if (!boundToSession(currentJob)) throw new CronJobBindingStaleError();
      });
      disabled.push(job.id);
    } catch (error) {
      if (error instanceof CronJobBindingStaleError) continue;
      failures.push(error);
    }
  }
  if (failures.length > 0)
    throw new AggregateError(
      failures,
      `failed to disable ${failures.length} cron job(s) bound to ${params.sessionKey}`,
    );
  return disabled;
}
//#endregion
//#region src/gateway/session-automation-index.ts
let source = null;
let sourceVersion = 0;
let epochCounter = 0;
let registeredEpoch = 0;
let memo = null;
/**
 * Claimed at cron service build time so registration authority follows build
 * order: a stale service whose start resolves after a config reload cannot
 * clobber the replacement's registration.
 */
function claimSessionAutomationEpoch() {
  return ++epochCounter;
}
/** Registered by the gateway cron owner; newer epochs win over stale services. */
function registerSessionAutomationSource(next, epoch) {
  const effectiveEpoch = epoch ?? claimSessionAutomationEpoch();
  if (effectiveEpoch < registeredEpoch) return;
  registeredEpoch = effectiveEpoch;
  source = next;
  memo = null;
  sourceVersion += 1;
}
/**
 * Owner-compare unregistration: a stopped cron service must not clear a
 * replacement's registration when config reloads race the lazy service build.
 */
function unregisterSessionAutomationSource(owner) {
  if (source !== owner) return;
  source = null;
  memo = null;
  sourceVersion += 1;
}
/** Called from the cron onEvent hook after any job/store change. */
function bumpSessionAutomationVersion() {
  sourceVersion += 1;
}
function buildAutomationKeys(jobs, cfg, defaultAgentId) {
  const keys = /* @__PURE__ */ new Set();
  for (const job of jobs) {
    if (!job.enabled) continue;
    for (const key of resolveCronJobBoundSessionKeys(job, {
      cfg,
      defaultAgentId,
    }))
      keys.add(key);
  }
  return keys;
}
/** True when an enabled cron job is bound to the canonical session key. */
function sessionHasAutomation(sessionKey, cfg) {
  const jobs = source?.getJobs();
  if (!source || !jobs || jobs.length === 0) return false;
  if (!memo || memo.jobs !== jobs || memo.version !== sourceVersion || memo.cfg !== cfg)
    memo = {
      jobs,
      version: sourceVersion,
      cfg,
      keys: buildAutomationKeys(jobs, cfg, source.getDefaultAgentId()),
    };
  return memo.keys.has(sessionKey);
}
//#endregion
//#region src/gateway/session-utils.ts
const DERIVED_TITLE_MAX_LEN = 60;
function formatSessionIdPrefix(sessionId, updatedAt) {
  const prefix = sessionId.slice(0, 8);
  if (updatedAt && updatedAt > 0)
    return `${prefix} (${new Date(updatedAt).toISOString().slice(0, 10)})`;
  return prefix;
}
function truncateTitle(text, maxLen) {
  if (text.length <= maxLen) return text;
  const cut = truncateUtf16Safe(text, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.6) return cut.slice(0, lastSpace) + "…";
  return cut + "…";
}
function deriveSessionTitle(entry, firstUserMessage) {
  if (!entry) return;
  const label = normalizeOptionalString(entry.label);
  if (label) return label;
  if (normalizeOptionalString(entry.displayName)) return normalizeOptionalString(entry.displayName);
  if (normalizeOptionalString(entry.subject)) return normalizeOptionalString(entry.subject);
  if (firstUserMessage?.trim())
    return truncateTitle(firstUserMessage.replace(/\s+/g, " ").trim(), DERIVED_TITLE_MAX_LEN);
  if (entry.sessionId) return formatSessionIdPrefix(entry.sessionId, entry.updatedAt);
}
function resolveSessionRuntimeMs(run, now) {
  return getSubagentSessionRuntimeMs(run, now);
}
function resolvePositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function deriveSessionUnread(entry) {
  return (
    entry?.markedUnreadAt !== void 0 ||
    (entry?.lastReadAt !== void 0 &&
      Math.max(entry.lastInteractionAt ?? 0, entry.lastActivityAt ?? 0) > entry.lastReadAt)
  );
}
function isProjectableCompactionCheckpoint(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const checkpoint = value;
  return (
    Boolean(normalizeOptionalString(checkpoint.checkpointId)) &&
    typeof checkpoint.createdAt === "number" &&
    Number.isFinite(checkpoint.createdAt) &&
    (checkpoint.reason === "manual" ||
      checkpoint.reason === "auto-threshold" ||
      checkpoint.reason === "overflow-retry" ||
      checkpoint.reason === "timeout-retry")
  );
}
function resolveProjectableCompactionCheckpoints(entry) {
  const checkpoints = entry?.compactionCheckpoints;
  if (!Array.isArray(checkpoints) || checkpoints.length === 0) return [];
  return checkpoints.filter(isProjectableCompactionCheckpoint);
}
function resolveLatestCompactionCheckpoint(checkpoints) {
  return checkpoints.reduce(
    (latest, checkpoint) =>
      !latest || checkpoint.createdAt > latest.createdAt ? checkpoint : latest,
    void 0,
  );
}
function buildCompactionCheckpointPreview(checkpoint) {
  if (!checkpoint) return;
  const checkpointId = normalizeOptionalString(checkpoint.checkpointId);
  const createdAt = checkpoint.createdAt;
  const reason = checkpoint.reason;
  if (!checkpointId || typeof createdAt !== "number" || !Number.isFinite(createdAt)) return;
  if (
    reason !== "manual" &&
    reason !== "auto-threshold" &&
    reason !== "overflow-retry" &&
    reason !== "timeout-retry"
  )
    return;
  return {
    checkpointId,
    createdAt,
    reason,
  };
}
function resolveModelCostConfigCached(provider, model, cfg, rowContext) {
  if (!rowContext)
    return resolveModelCostConfig({
      provider,
      model,
      config: cfg,
    });
  const key = createSessionRowModelCacheKey(provider, model);
  if (rowContext.modelCostConfigByModelRef.has(key))
    return rowContext.modelCostConfigByModelRef.get(key);
  const value = resolveModelCostConfig({
    provider,
    model,
    config: cfg,
  });
  rowContext.modelCostConfigByModelRef.set(key, value);
  return value;
}
function resolveEstimatedSessionCostUsd(params) {
  const explicitCostUsd = resolveNonNegativeNumber(
    params.explicitCostUsd ?? params.entry?.estimatedCostUsd,
  );
  if (explicitCostUsd !== void 0) return explicitCostUsd;
  const input = resolvePositiveNumber(params.entry?.inputTokens);
  const output = resolvePositiveNumber(params.entry?.outputTokens);
  const cacheRead = resolvePositiveNumber(params.entry?.cacheRead);
  const cacheWrite = resolvePositiveNumber(params.entry?.cacheWrite);
  if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0)
    return;
  const cost = resolveModelCostConfigCached(
    params.provider,
    params.model,
    params.cfg,
    params.rowContext,
  );
  if (!cost) return;
  return resolveNonNegativeNumber(
    estimateUsageCost({
      usage: {
        ...(input !== void 0 ? { input } : {}),
        ...(output !== void 0 ? { output } : {}),
        ...(cacheRead !== void 0 ? { cacheRead } : {}),
        ...(cacheWrite !== void 0 ? { cacheWrite } : {}),
      },
      cost,
    }),
  );
}
const STALE_STORE_ONLY_CHILD_LINK_MS = 3600 * 1e3;
const SINGLE_ROW_CONTEXT_CACHE_MAX_ENTRIES = 64;
function isFinitePositiveTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function shouldKeepStoreOnlyChildLink(entry, now) {
  if (isTerminalSessionStatus(entry.status) || isFinitePositiveTimestamp(entry.endedAt)) {
    const endedAt = isFinitePositiveTimestamp(entry.endedAt) ? entry.endedAt : entry.updatedAt;
    return isFinitePositiveTimestamp(endedAt) && now - endedAt <= 18e5;
  }
  if (entry.status === "running" || isFinitePositiveTimestamp(entry.startedAt)) return true;
  return (
    isFinitePositiveTimestamp(entry.updatedAt) &&
    now - entry.updatedAt <= STALE_STORE_ONLY_CHILD_LINK_MS
  );
}
const singleRowChildSessionCandidateCache = /* @__PURE__ */ new Map();
function rememberSingleRowChildSessionCandidateCacheEntry(storePath, entry) {
  if (singleRowChildSessionCandidateCache.has(storePath))
    singleRowChildSessionCandidateCache.delete(storePath);
  singleRowChildSessionCandidateCache.set(storePath, entry);
  if (singleRowChildSessionCandidateCache.size <= SINGLE_ROW_CONTEXT_CACHE_MAX_ENTRIES) return;
  const oldestKey = singleRowChildSessionCandidateCache.keys().next().value;
  if (oldestKey) singleRowChildSessionCandidateCache.delete(oldestKey);
}
function buildStoreChildSessionCandidateIndex(store) {
  const childSessionsByKey = /* @__PURE__ */ new Map();
  if (!store) return childSessionsByKey;
  for (const [key, entry] of Object.entries(store)) {
    if (!entry) continue;
    const parentKeys = [
      normalizeOptionalString(entry.spawnedBy),
      normalizeOptionalString(entry.parentSessionKey),
    ].filter((value) => Boolean(value) && value !== key);
    for (const parentKey of parentKeys) addChildSessionKey(childSessionsByKey, parentKey, key);
  }
  return childSessionsByKey;
}
function getSingleRowChildSessionCandidates(params) {
  if (!params.store) return /* @__PURE__ */ new Map();
  const storeVersion = getSessionStoreCacheVersion(params.storePath);
  const cached = singleRowChildSessionCandidateCache.get(params.storePath);
  if (cached && cached.store === params.store && cached.storeVersion === storeVersion)
    return cached.childSessionCandidatesByParentKey;
  const childSessionCandidatesByParentKey = buildStoreChildSessionCandidateIndex(params.store);
  rememberSingleRowChildSessionCandidateCacheEntry(params.storePath, {
    store: params.store,
    storeVersion,
    childSessionCandidatesByParentKey,
  });
  return childSessionCandidatesByParentKey;
}
function resolveRuntimeChildSessionKeys(controllerSessionKey, now = Date.now(), subagentRuns) {
  const childSessionKeys = /* @__PURE__ */ new Set();
  const controllerKey = controllerSessionKey.trim();
  const runs = subagentRuns
    ? (subagentRuns.runsByControllerSessionKey.get(controllerKey) ?? [])
    : listSubagentRunsForController(controllerSessionKey);
  for (const entry of runs) {
    const childSessionKey = normalizeOptionalString(entry.childSessionKey);
    if (!childSessionKey) continue;
    const latest = subagentRuns
      ? subagentRuns.getDisplaySubagentRun(childSessionKey)
      : getSessionDisplaySubagentRunByChildSessionKey(childSessionKey);
    if (!latest) continue;
    if (
      (normalizeOptionalString(latest?.controllerSessionKey) ||
        normalizeOptionalString(latest?.requesterSessionKey)) !== controllerSessionKey
    )
      continue;
    if (
      !shouldKeepSubagentRunChildLink(latest, {
        activeDescendants: subagentRuns
          ? subagentRuns.countActiveDescendantRuns(childSessionKey)
          : countActiveDescendantRuns(childSessionKey),
        now,
      })
    )
      continue;
    childSessionKeys.add(childSessionKey);
  }
  const childSessions = Array.from(childSessionKeys);
  return childSessions.length > 0 ? childSessions : void 0;
}
function addChildSessionKey(childSessionsByKey, parentKey, childKey) {
  const current = childSessionsByKey.get(parentKey);
  if (current) {
    if (!current.includes(childKey)) current.push(childKey);
    return;
  }
  childSessionsByKey.set(parentKey, [childKey]);
}
function buildStoreChildSessionIndex(store, now = Date.now(), subagentRuns) {
  const childSessionsByKey = /* @__PURE__ */ new Map();
  for (const [key, entry] of Object.entries(store)) {
    if (!entry) continue;
    const parentKeys = [
      normalizeOptionalString(entry.spawnedBy),
      normalizeOptionalString(entry.parentSessionKey),
    ].filter((value) => Boolean(value) && value !== key);
    if (parentKeys.length === 0) continue;
    const latest = subagentRuns
      ? subagentRuns.getDisplaySubagentRun(key)
      : getSessionDisplaySubagentRunByChildSessionKey(key);
    let latestControllerSessionKey;
    if (latest) {
      latestControllerSessionKey =
        normalizeOptionalString(latest.controllerSessionKey) ||
        normalizeOptionalString(latest.requesterSessionKey);
      if (
        !shouldKeepSubagentRunChildLink(latest, {
          activeDescendants: subagentRuns
            ? subagentRuns.countActiveDescendantRuns(key)
            : countActiveDescendantRuns(key),
          now,
        })
      )
        continue;
    } else if (!shouldKeepStoreOnlyChildLink(entry, now)) continue;
    for (const parentKey of parentKeys) {
      if (latestControllerSessionKey && latestControllerSessionKey !== parentKey) continue;
      addChildSessionKey(childSessionsByKey, parentKey, key);
    }
  }
  return childSessionsByKey;
}
function resolveStoreChildSessionKeysFromCandidates(params) {
  const childSessionKeys = [];
  for (const childKey of params.candidates.get(params.key) ?? []) {
    const entry = params.store[childKey];
    if (!entry) continue;
    const latest = getSessionDisplaySubagentRunByChildSessionKey(childKey);
    if (latest) {
      if (
        (normalizeOptionalString(latest.controllerSessionKey) ||
          normalizeOptionalString(latest.requesterSessionKey)) !== params.key
      )
        continue;
      if (
        !shouldKeepSubagentRunChildLink(latest, {
          activeDescendants: countActiveDescendantRuns(childKey),
          now: params.now,
        })
      )
        continue;
      childSessionKeys.push(childKey);
      continue;
    }
    if (!shouldKeepStoreOnlyChildLink(entry, params.now)) continue;
    childSessionKeys.push(childKey);
  }
  return childSessionKeys.length > 0 ? childSessionKeys : void 0;
}
function buildSessionListRowContext(params) {
  const subagentRuns = buildSubagentRunReadIndex(params.now);
  return buildSessionListRowContextFromParts({
    subagentRuns,
    storeChildSessionsByKey: buildStoreChildSessionIndex(params.store, params.now, subagentRuns),
  });
}
function buildSessionListRowContextFromParts(params) {
  return {
    subagentRuns: params.subagentRuns,
    storeChildSessionsByKey: params.storeChildSessionsByKey,
    selectedModelByOverrideRef: /* @__PURE__ */ new Map(),
    thinkingMetadataByModelRef: /* @__PURE__ */ new Map(),
    displayModelIdentityByKey: /* @__PURE__ */ new Map(),
    modelCostConfigByModelRef: /* @__PURE__ */ new Map(),
  };
}
function buildSessionListRowMetadataContext(params) {
  return buildSessionListRowContextFromParts({
    subagentRuns: buildSubagentRunReadIndex(params.now),
    storeChildSessionsByKey: /* @__PURE__ */ new Map(),
  });
}
function buildSingleRowStoreChildSessionsByKey(params) {
  const storeChildSessions = resolveStoreChildSessionKeysFromCandidates({
    store: params.store,
    key: params.key,
    now: params.now,
    candidates: getSingleRowChildSessionCandidates({
      storePath: params.storePath,
      store: params.store,
    }),
  });
  return storeChildSessions
    ? /* @__PURE__ */ new Map([[params.key, storeChildSessions]])
    : /* @__PURE__ */ new Map();
}
function createSessionRowModelCacheKey(provider, model) {
  return `${normalizeLowercaseStringOrEmpty(provider)}\0${normalizeOptionalString(model) ?? ""}`;
}
function resolveSessionSelectedModelRef(params) {
  const override = normalizeStoredOverrideModel({
    providerOverride: params.entry?.providerOverride,
    modelOverride: params.entry?.modelOverride,
  });
  if (!override.modelOverride) return null;
  if (!params.rowContext)
    return resolveSessionModelRef(params.cfg, params.entry, params.agentId, {
      allowPluginNormalization: params.allowPluginNormalization,
    });
  const key = [
    normalizeAgentId(params.agentId),
    override.providerOverride ?? "",
    override.modelOverride,
  ].join("\0");
  const cached = params.rowContext.selectedModelByOverrideRef.get(key);
  if (cached) return cached;
  const selected = resolveSessionModelRef(params.cfg, params.entry, params.agentId, {
    allowPluginNormalization: params.allowPluginNormalization,
  });
  params.rowContext.selectedModelByOverrideRef.set(key, selected);
  return selected;
}
function resolveSessionRowThinkingMetadata(params) {
  if (!params.rowContext)
    return {
      levels: listThinkingLevelOptions(
        params.provider,
        params.model,
        params.modelCatalog,
        params.agentRuntime,
      ),
      defaultLevel: resolveGatewaySessionThinkingDefault({
        cfg: params.cfg,
        provider: params.provider,
        model: params.model,
        agentId: params.agentId,
        modelCatalog: params.modelCatalog,
        agentRuntime: params.agentRuntime,
      }),
    };
  const key = `${normalizeAgentId(params.agentId)}\0${params.agentRuntime}\0${createSessionRowModelCacheKey(params.provider, params.model)}`;
  const cached = params.rowContext.thinkingMetadataByModelRef.get(key);
  if (cached) return cached;
  const metadata = {
    levels: listThinkingLevelOptions(
      params.provider,
      params.model,
      params.modelCatalog,
      params.agentRuntime,
    ),
    defaultLevel: resolveGatewaySessionThinkingDefault({
      cfg: params.cfg,
      provider: params.provider,
      model: params.model,
      agentId: params.agentId,
      modelCatalog: params.modelCatalog,
      agentRuntime: params.agentRuntime,
    }),
  };
  params.rowContext.thinkingMetadataByModelRef.set(key, metadata);
  return metadata;
}
function mergeChildSessionKeys(runtimeChildSessions, storeChildSessions) {
  if (!runtimeChildSessions?.length)
    return storeChildSessions?.length ? storeChildSessions : void 0;
  if (!storeChildSessions?.length) return runtimeChildSessions;
  return uniqueStrings([...runtimeChildSessions, ...storeChildSessions]);
}
function resolveChildSessionKeys(controllerSessionKey, store, now = Date.now(), subagentRuns) {
  return mergeChildSessionKeys(
    resolveRuntimeChildSessionKeys(controllerSessionKey, now, subagentRuns),
    buildStoreChildSessionIndex(store, now, subagentRuns).get(controllerSessionKey),
  );
}
function resolveTranscriptUsageFallback(params) {
  const entry = params.entry;
  if (!entry?.sessionId) return null;
  const parsed = parseAgentSessionKey(params.key);
  const agentId = parsed?.agentId
    ? normalizeAgentId(parsed.agentId)
    : normalizeAgentId(params.agentId ?? resolveDefaultAgentId(params.cfg));
  const storePath =
    resolveConcreteSessionStorePath(params.storePath) ??
    resolveStorePath(params.cfg.session?.store, { agentId });
  let snapshot;
  try {
    snapshot = readRecentSessionUsageFromTranscript(
      {
        agentId,
        sessionEntry: entry,
        sessionId: entry.sessionId,
        sessionKey: params.key,
        storePath,
      },
      typeof params.maxTranscriptBytes === "number" ? params.maxTranscriptBytes : 256 * 1024,
    );
  } catch {
    return null;
  }
  if (!snapshot) return null;
  const modelProvider = snapshot.modelProvider ?? params.fallbackProvider;
  const model = snapshot.model ?? params.fallbackModel;
  const contextTokens = resolveContextTokensForModel({
    cfg: params.cfg,
    provider: modelProvider,
    model,
    allowAsyncLoad: false,
  });
  const estimatedCostUsd = resolveEstimatedSessionCostUsd({
    cfg: params.cfg,
    provider: modelProvider,
    model,
    explicitCostUsd: snapshot.costUsd,
    entry: {
      inputTokens: snapshot.inputTokens,
      outputTokens: snapshot.outputTokens,
      cacheRead: snapshot.cacheRead,
      cacheWrite: snapshot.cacheWrite,
    },
    rowContext: params.rowContext,
  });
  return {
    modelProvider,
    model,
    totalTokens: resolvePositiveNumber(snapshot.totalTokens),
    totalTokensFresh: snapshot.totalTokensFresh === true,
    contextTokens: resolvePositiveNumber(contextTokens),
    estimatedCostUsd,
  };
}
function readAcpMetaForDeletedAgentCheck(params) {
  if (params.entry?.acp) return params.entry.acp;
  const acpMetadataSessionKey = normalizeOptionalString(params.acpMetadataSessionKey);
  const directKeys = /* @__PURE__ */ new Set();
  if (acpMetadataSessionKey) directKeys.add(acpMetadataSessionKey);
  else {
    const acpMeta = readAcpSessionMeta({
      sessionKey: params.sessionKey,
      cfg: params.cfg,
    });
    if (acpMeta) return acpMeta;
  }
  directKeys.add(params.sessionKey);
  for (const directKey of directKeys) {
    const acpMeta = readAcpSessionMetaForEntry({
      sessionKey: directKey,
      entry: params.entry ?? void 0,
    });
    if (acpMeta) return acpMeta;
  }
  repairAcpSessionMetaKeyForMigration({
    sessionKey: params.sessionKey,
    candidateSessionKeys: directKeys,
    entry: params.entry ?? void 0,
  });
  return readAcpSessionMetaForEntry({
    sessionKey: params.sessionKey,
    entry: params.entry ?? void 0,
  });
}
/**
 * Returns the owning agent id if the session key belongs to an agent that is no
 * longer present in config (deleted). Returns null for non-agent legacy/global
 * keys, confirmed ACP runtime session keys, or when the owning agent still
 * exists (#65524).
 */
function resolveDeletedAgentIdFromSessionKey(cfg, sessionKey, entry, options) {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) return null;
  const agentId = normalizeAgentId(parsed.agentId);
  if (listAgentIds(cfg).includes(agentId)) return null;
  if (isAcpSessionKey(sessionKey) && !parsed.rest.startsWith("acp:binding:")) {
    if (
      readAcpMetaForDeletedAgentCheck({
        cfg,
        sessionKey,
        entry,
        acpMetadataSessionKey: options?.acpMetadataSessionKey,
      })
    )
      return null;
  }
  return agentId;
}
function loadSessionEntry(sessionKey, opts) {
  const cfg = getRuntimeConfig();
  const target = resolveGatewaySessionStoreTargetWithStore({
    cfg,
    key: normalizeOptionalString(sessionKey) ?? "",
    ...(opts?.clone === false ? { clone: false } : {}),
    ...(opts?.agentId ? { agentId: opts.agentId } : {}),
  });
  const storePath = target.storePath;
  const store = target.store;
  const freshestMatch = resolveFreshestSessionStoreMatchFromStoreKeys(store, target.storeKeys);
  const legacyKey = freshestMatch?.key !== target.canonicalKey ? freshestMatch?.key : void 0;
  return {
    cfg,
    storePath,
    store,
    entry: freshestMatch?.entry,
    canonicalKey: target.canonicalKey,
    storeKeys: target.storeKeys,
    legacyKey,
  };
}
function resolveFreshestSessionStoreMatchFromStoreKeys(store, storeKeys) {
  let freshest;
  for (const key of storeKeys) {
    const entry = store[key];
    if (!entry) continue;
    const match = {
      key,
      entry,
    };
    if (!freshest || (match.entry.updatedAt ?? 0) > (freshest.entry.updatedAt ?? 0))
      freshest = match;
  }
  return freshest;
}
function resolveFreshestSessionEntryFromStoreKeys(store, storeKeys) {
  return resolveFreshestSessionStoreMatchFromStoreKeys(store, storeKeys)?.entry;
}
function findFreshestStoreMatch(store, ...candidates) {
  const matches = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    const trimmed = normalizeOptionalString(candidate) ?? "";
    if (!trimmed) continue;
    const exact = store[trimmed];
    if (exact)
      matches.set(trimmed, {
        entry: exact,
        key: trimmed,
      });
  }
  if (matches.size === 0) return;
  let freshest;
  for (const match of matches.values())
    if (!freshest || (match.entry.updatedAt ?? 0) > (freshest.entry.updatedAt ?? 0))
      freshest = match;
  return freshest;
}
/**
 * Remove legacy key variants for one canonical session key.
 * Candidates can include aliases (for example, "agent:ops:main" when canonical is "agent:ops:work").
 */
function pruneLegacyStoreKeys(params) {
  const keysToDelete = /* @__PURE__ */ new Set();
  for (const candidate of params.candidates) {
    const trimmed = normalizeOptionalString(candidate ?? "") ?? "";
    if (!trimmed) continue;
    if (trimmed !== params.canonicalKey) keysToDelete.add(trimmed);
  }
  for (const key of keysToDelete) delete params.store[key];
}
function migrateAndPruneGatewaySessionStoreKey(params) {
  const target = resolveGatewaySessionStoreTarget({
    cfg: params.cfg,
    key: params.key,
    store: params.store,
    ...(params.agentId ? { agentId: params.agentId } : {}),
  });
  const primaryKey = target.canonicalKey;
  const freshestMatch = resolveFreshestSessionStoreMatchFromStoreKeys(
    params.store,
    target.storeKeys,
  );
  if (freshestMatch) {
    const currentPrimary = params.store[primaryKey];
    if (!currentPrimary || (freshestMatch.entry.updatedAt ?? 0) > (currentPrimary.updatedAt ?? 0))
      params.store[primaryKey] = freshestMatch.entry;
  }
  pruneLegacyStoreKeys({
    store: params.store,
    canonicalKey: primaryKey,
    candidates: target.storeKeys,
  });
  return {
    target,
    primaryKey,
    entry: params.store[primaryKey],
  };
}
function classifySessionKey(key, entry) {
  if (key === "global") return "global";
  if (key === "unknown") return "unknown";
  if (entry?.chatType === "group" || entry?.chatType === "channel") return "group";
  if (key.includes(":group:") || key.includes(":channel:")) return "group";
  return "direct";
}
function parseGroupKey(key) {
  const parts = (parseAgentSessionKey(key)?.rest ?? key).split(":").filter(Boolean);
  if (parts.length >= 3) {
    const [channel, kind, ...rest] = parts;
    if (kind === "group" || kind === "channel")
      return {
        channel,
        kind,
        id: rest.join(":"),
      };
  }
  return null;
}
function isGroupOrChannelDisplaySession(entry, parsed) {
  return (
    entry?.chatType === "group" ||
    entry?.chatType === "channel" ||
    parsed?.kind === "group" ||
    parsed?.kind === "channel"
  );
}
function isStorePathTemplate(store) {
  return typeof store === "string" && store.includes("{agentId}");
}
function resolveConcreteSessionStorePath(storePath) {
  const trimmed = storePath?.trim();
  if (!trimmed || trimmed === "(multiple)" || isStorePathTemplate(trimmed)) return;
  return trimmed;
}
function normalizeFallbackList(values) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = normalizeLowercaseStringOrEmpty(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}
function resolveGatewayAgentModel(cfg, agentId) {
  const primary = resolveAgentEffectiveModelPrimary(cfg, agentId)?.trim();
  const fallbackOverride = resolveAgentModelFallbacksOverride(cfg, agentId);
  const defaultFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
  const fallbacks = normalizeFallbackList(fallbackOverride ?? defaultFallbacks);
  if (!primary && fallbacks.length === 0) return;
  return {
    ...(primary ? { primary } : {}),
    ...(fallbacks.length > 0 ? { fallbacks } : {}),
  };
}
function listAgentsForGateway(cfg, modelCatalog, options) {
  const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
  const mainKey = normalizeMainKey(cfg.session?.mainKey);
  const scope = cfg.session?.scope ?? "per-sender";
  const configuredById = /* @__PURE__ */ new Map();
  for (const entry of cfg.agents?.list ?? []) {
    if (!entry?.id) continue;
    const agentId = normalizeAgentId(entry.id);
    const configuredName = normalizeOptionalString(entry.name);
    const avatar = normalizeOptionalString(entry.identity?.avatar);
    const avatarUrl = resolveAgentAvatarUrlFromSource(cfg, agentId, avatar);
    const identity = entry.identity
      ? {
          name: normalizeOptionalString(entry.identity.name),
          theme: normalizeOptionalString(entry.identity.theme),
          emoji: normalizeOptionalString(entry.identity.emoji),
          avatar,
          avatarUrl,
        }
      : void 0;
    configuredById.set(agentId, {
      name: configuredName ?? identity?.name,
      identity,
    });
  }
  const explicitIds = new Set(
    (cfg.agents?.list ?? [])
      .map((entry) => (entry?.id ? normalizeAgentId(entry.id) : ""))
      .filter(Boolean),
  );
  const allowedIds =
    explicitIds.size > 0 ? /* @__PURE__ */ new Set([...explicitIds, defaultId]) : null;
  let agentIds = listGatewayAgentIds(cfg).filter((id) => (allowedIds ? allowedIds.has(id) : true));
  if (mainKey && !agentIds.includes(mainKey) && (!allowedIds || allowedIds.has(mainKey)))
    agentIds = [...agentIds, mainKey];
  return {
    defaultId,
    mainKey,
    scope,
    agents: agentIds.map((id) => {
      const meta = configuredById.get(id);
      const model = resolveGatewayAgentModel(cfg, id);
      const resolvedModel = resolveDefaultModelForAgent({
        cfg,
        agentId: id,
      });
      const sessionKey = resolveAgentMainSessionKey({
        cfg,
        agentId: id,
      });
      const agentRuntime = resolveModelAgentRuntimeMetadata({
        cfg,
        agentId: id,
        provider: resolvedModel.provider,
        model: resolvedModel.model,
        sessionKey,
        acpRuntime: false,
      });
      const thinkingRuntime = resolveEffectiveAgentRuntime({
        cfg,
        provider: resolvedModel.provider,
        modelId: resolvedModel.model,
        agentId: id,
        sessionKey,
      });
      const agentModelCatalog = options?.modelCatalogByAgentId?.get(id) ?? modelCatalog;
      const thinkingLevels = listThinkingLevelOptions(
        resolvedModel.provider,
        resolvedModel.model,
        agentModelCatalog,
        thinkingRuntime,
      );
      const workspace = resolveAgentWorkspaceDir(cfg, id);
      const workspaceGit = insideGitCheckout(workspace);
      return Object.assign(
        {
          id,
          name: meta?.name,
          identity: meta?.identity,
          workspace,
          workspaceGit,
          agentRuntime,
          thinkingLevels,
          thinkingOptions: thinkingLevels.map((level) => level.label),
          thinkingDefault: resolveGatewaySessionThinkingDefault({
            cfg,
            provider: resolvedModel.provider,
            model: resolvedModel.model,
            agentId: id,
            modelCatalog: agentModelCatalog,
            agentRuntime: thinkingRuntime,
          }),
        },
        model ? { model } : {},
      );
    }),
  };
}
function buildGatewaySessionStoreScanTargets(params) {
  const targets = /* @__PURE__ */ new Set();
  if (params.canonicalKey) targets.add(params.canonicalKey);
  if (params.key && params.key !== params.canonicalKey) targets.add(params.key);
  if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
  const agentMainKey = resolveAgentMainSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
  return [...targets];
}
function resolveGatewaySessionStoreCandidates(cfg, agentId) {
  const storeConfig = cfg.session?.store;
  const defaultTarget = {
    agentId,
    storePath: resolveStorePath(storeConfig, { agentId }),
  };
  if (!isStorePathTemplate(storeConfig)) return [defaultTarget];
  const targets = /* @__PURE__ */ new Map();
  targets.set(defaultTarget.storePath, defaultTarget);
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg))
    if (target.agentId === agentId) targets.set(target.storePath, target);
  return [...targets.values()];
}
function loadGatewaySessionLookupStore(storePath, clone, agentId) {
  try {
    return Object.fromEntries(
      listSessionEntries({
        ...(agentId ? { agentId } : {}),
        ...(clone === false ? { clone: false } : {}),
        storePath,
      }).map(({ sessionKey, entry }) => [sessionKey, entry]),
    );
  } catch {
    return {};
  }
}
function resolveGatewaySessionStoreLookup(params) {
  const scanTargets = buildGatewaySessionStoreScanTargets(params);
  const candidates = resolveGatewaySessionStoreCandidates(params.cfg, params.agentId);
  const fallback = candidates[0] ?? {
    agentId: params.agentId,
    storePath: resolveStorePath(params.cfg.session?.store, { agentId: params.agentId }),
  };
  const loadStore = (target) =>
    loadGatewaySessionLookupStore(target.storePath, params.clone, target.agentId);
  let selectedStorePath = fallback.storePath;
  let selectedStore = params.initialStore ?? loadStore(fallback);
  let selectedMatch = findFreshestStoreMatch(selectedStore, ...scanTargets);
  let selectedUpdatedAt = selectedMatch?.entry.updatedAt ?? Number.NEGATIVE_INFINITY;
  for (let index = 1; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (!candidate) continue;
    const store = loadStore(candidate);
    const match = findFreshestStoreMatch(store, ...scanTargets);
    if (!match) continue;
    const updatedAt = match.entry.updatedAt ?? 0;
    if (!selectedMatch || updatedAt >= selectedUpdatedAt) {
      selectedStorePath = candidate.storePath;
      selectedStore = store;
      selectedMatch = match;
      selectedUpdatedAt = updatedAt;
    }
  }
  return {
    storePath: selectedStorePath,
    store: selectedStore,
    match: selectedMatch,
  };
}
function isAgentScopedSentinelSessionKey(canonicalKey) {
  return canonicalKey === "global" || canonicalKey === "unknown";
}
function resolveExplicitDeletedLegacyMainStoreTarget(params) {
  const parsed = parseAgentSessionKey(params.key);
  const legacyAgentId = normalizeAgentId(parsed?.agentId);
  if (!parsed || legacyAgentId !== "main" || listAgentIds(params.cfg).includes(legacyAgentId))
    return null;
  const canonicalKey = resolveStoredSessionKeyForAgentStore({
    cfg: params.cfg,
    agentId: legacyAgentId,
    sessionKey: params.key,
  });
  const agentMainKey = resolveAgentMainSessionKey({
    cfg: params.cfg,
    agentId: legacyAgentId,
  });
  const legacyAgentMainKey = `agent:${legacyAgentId}:main`;
  const lookupSeeds = Array.from(
    /* @__PURE__ */ new Set([params.key, canonicalKey, agentMainKey, legacyAgentMainKey]),
  );
  let best;
  for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg)) {
    if (target.agentId !== legacyAgentId) continue;
    const store = loadGatewaySessionLookupStore(target.storePath, params.clone, target.agentId);
    const match = findFreshestStoreMatch(store, ...lookupSeeds);
    if (!match) continue;
    if (!best || (match.entry.updatedAt ?? 0) >= (best.match.entry.updatedAt ?? 0))
      best = {
        storePath: target.storePath,
        store,
        match,
      };
  }
  if (!best) return null;
  const storeKeys = /* @__PURE__ */ new Set([canonicalKey]);
  if (params.key !== canonicalKey) storeKeys.add(params.key);
  storeKeys.add(best.match.key);
  for (const seed of lookupSeeds) storeKeys.add(seed);
  return {
    agentId: legacyAgentId,
    storePath: best.storePath,
    canonicalKey,
    storeKeys: Array.from(storeKeys),
    store: best.store,
  };
}
function resolveGatewaySessionStoreTargetWithStore(params) {
  const key = normalizeOptionalString(params.key) ?? "";
  const explicitDeletedMainTarget = resolveExplicitDeletedLegacyMainStoreTarget({
    cfg: params.cfg,
    key,
    clone: params.clone,
  });
  if (explicitDeletedMainTarget) return explicitDeletedMainTarget;
  const requestedAgentId = normalizeOptionalString(params.agentId);
  const canonicalKey = resolveSessionStoreKey({
    cfg: params.cfg,
    sessionKey: key,
    ...(requestedAgentId ? { storeAgentId: requestedAgentId } : {}),
  });
  const agentId =
    requestedAgentId &&
    (isAgentScopedSentinelSessionKey(canonicalKey) || !parseAgentSessionKey(key))
      ? normalizeAgentId(requestedAgentId)
      : resolveSessionStoreAgentId(params.cfg, canonicalKey);
  const { storePath, store } = resolveGatewaySessionStoreLookup({
    cfg: params.cfg,
    key,
    canonicalKey,
    agentId,
    clone: params.clone,
    initialStore: params.store,
  });
  if (canonicalKey === "global" || canonicalKey === "unknown")
    return {
      agentId,
      storePath,
      canonicalKey,
      storeKeys: key && key !== canonicalKey ? [canonicalKey, key] : [key],
      store,
    };
  const storeKeys = new Set(
    buildGatewaySessionStoreScanTargets({
      cfg: params.cfg,
      key,
      canonicalKey,
      agentId,
    }),
  );
  return {
    agentId,
    storePath,
    canonicalKey,
    storeKeys: Array.from(storeKeys),
    store,
  };
}
function resolveGatewaySessionStoreTarget(params) {
  const { store: _store, ...target } = resolveGatewaySessionStoreTargetWithStore(params);
  return target;
}
function resolveGatewaySessionThinkingLevel(params) {
  if (
    !(params.modelCatalog
      ? findModelCatalogEntry(params.modelCatalog, {
          provider: params.provider,
          modelId: params.model,
        })
      : void 0)
  )
    return params.level;
  return resolveSupportedThinkingLevel({
    provider: params.provider,
    model: params.model,
    level: params.level,
    catalog: params.modelCatalog,
    agentRuntime: params.agentRuntime,
  });
}
function resolveGatewaySessionThinkingDefault(params) {
  const defaultLevel =
    (params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.thinkingDefault : void 0) ??
    resolveThinkingDefault({
      cfg: params.cfg,
      provider: params.provider,
      model: params.model,
      catalog: params.modelCatalog,
      agentRuntime: params.agentRuntime,
    });
  return resolveGatewaySessionThinkingLevel({
    provider: params.provider,
    model: params.model,
    level: defaultLevel,
    modelCatalog: params.modelCatalog,
    agentRuntime: params.agentRuntime,
  });
}
function resolveGatewaySessionThinkingProjectionInternal(params) {
  const acpMeta = readAcpSessionMeta({ sessionKey: params.sessionKey });
  const configuredAgentRuntime = resolveModelAgentRuntimeMetadata({
    cfg: params.cfg,
    agentId: params.agentId,
    provider: params.provider,
    model: params.model,
    sessionKey: params.sessionKey,
    acpRuntime: acpMeta != null,
    acpBackend: acpMeta?.backend,
  });
  const persistedAgentRuntime = resolveSessionRuntimeOverrideForProvider({
    provider: params.provider,
    entry: params.entry,
    cfg: params.cfg,
  });
  const persistedAgentRuntimeSource =
    params.entry?.modelSelectionLocked === true ? "session" : "session-key";
  const agentRuntime =
    acpMeta || !persistedAgentRuntime
      ? configuredAgentRuntime
      : {
          id: persistedAgentRuntime,
          source: persistedAgentRuntimeSource,
        };
  const thinkingRuntime = acpMeta
    ? concretizeAgentRuntime(acpMeta.backend ?? agentRuntime.id)
    : resolveEffectiveAgentRuntime({
        cfg: params.cfg,
        provider: params.provider,
        modelId: params.model,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        sessionEntry: params.entry,
      });
  const metadata = resolveSessionRowThinkingMetadata({
    cfg: params.cfg,
    agentId: params.agentId,
    provider: params.provider,
    model: params.model,
    agentRuntime: thinkingRuntime,
    modelCatalog: params.modelCatalog,
    rowContext: params.rowContext,
  });
  const storedThinkingLevel = normalizeThinkLevel(params.entry?.thinkingLevel);
  const thinkingLevel = storedThinkingLevel
    ? resolveGatewaySessionThinkingLevel({
        provider: params.provider,
        model: params.model,
        level: storedThinkingLevel,
        modelCatalog: params.modelCatalog,
        agentRuntime: thinkingRuntime,
      })
    : void 0;
  return {
    agentRuntime,
    thinkingLevel,
    effectiveThinkingLevel: thinkingLevel ?? metadata.defaultLevel,
    thinkingLevels: metadata.levels,
    thinkingOptions: metadata.levels.map((level) => level.label),
    thinkingDefault: metadata.defaultLevel,
  };
}
/** Resolve the canonical runtime, selected level, and picker metadata for a session. */
function resolveGatewaySessionThinkingProjection(params) {
  return resolveGatewaySessionThinkingProjectionInternal(params);
}
function getSessionDefaults(cfg, modelCatalog, options) {
  const resolved = resolveConfiguredModelRef({
    cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
    allowPluginNormalization: options?.allowPluginNormalization,
  });
  const contextTokens =
    cfg.agents?.defaults?.contextTokens ??
    lookupContextTokens(resolved.model, { allowAsyncLoad: false }) ??
    2e5;
  const agentId = normalizeAgentId(resolveDefaultAgentId(cfg));
  const sessionKey = resolveAgentMainSessionKey({
    cfg,
    agentId,
  });
  const agentRuntime = resolveModelAgentRuntimeMetadata({
    cfg,
    agentId,
    provider: resolved.provider,
    model: resolved.model,
    sessionKey,
    acpRuntime: false,
  });
  const thinkingRuntime = resolveEffectiveAgentRuntime({
    cfg,
    provider: resolved.provider,
    modelId: resolved.model,
    agentId,
    sessionKey,
  });
  const thinkingLevels = listThinkingLevelOptions(
    resolved.provider,
    resolved.model,
    modelCatalog,
    thinkingRuntime,
  );
  return {
    modelProvider: resolved.provider ?? null,
    model: resolved.model ?? null,
    contextTokens: contextTokens ?? null,
    agentRuntime,
    thinkingLevels,
    thinkingOptions: thinkingLevels.map((level) => level.label),
    thinkingDefault: resolveGatewaySessionThinkingDefault({
      cfg,
      provider: resolved.provider,
      model: resolved.model,
      modelCatalog,
      agentRuntime: thinkingRuntime,
    }),
  };
}
async function resolveGatewayModelSupportsImages(params) {
  if (!params.model) return true;
  try {
    const modelEntry = findModelCatalogEntry(
      await params.loadGatewayModelCatalog({ readOnly: false }),
      {
        provider: params.provider,
        modelId: params.model,
      },
    );
    const normalizedProvider = normalizeOptionalLowercaseString(
      params.provider ?? modelEntry?.provider,
    );
    const normalizedCandidates = [
      normalizeLowercaseStringOrEmpty(params.model),
      normalizeLowercaseStringOrEmpty(modelEntry?.name),
    ].filter(Boolean);
    if (modelEntry) {
      if (modelSupportsInput(modelEntry, "image")) return true;
      if (
        normalizedProvider === "microsoft-foundry" &&
        normalizedCandidates.some(
          (candidate) =>
            candidate.startsWith("gpt-") ||
            candidate.startsWith("o1") ||
            candidate.startsWith("o3") ||
            candidate.startsWith("o4") ||
            candidate === "computer-use-preview",
        )
      )
        return true;
      if (
        normalizedProvider === "claude-cli" &&
        normalizedCandidates.some(
          (candidate) =>
            candidate === "opus" ||
            candidate === "sonnet" ||
            candidate === "haiku" ||
            candidate.startsWith("claude-"),
        )
      )
        return true;
      return false;
    }
    if (
      normalizedProvider === "claude-cli" &&
      normalizedCandidates.some(
        (candidate) =>
          candidate === "opus" ||
          candidate === "sonnet" ||
          candidate === "haiku" ||
          candidate.startsWith("claude-"),
      )
    )
      return true;
    return false;
  } catch {
    return false;
  }
}
function resolveSessionDisplayModelIdentityRefCached(params) {
  const ctx = params.rowContext;
  if (!ctx) return resolveSessionDisplayModelIdentityRef(params);
  const key = `${params.agentId}\u0000${createSessionRowModelCacheKey(params.provider, params.model)}`;
  const cached = ctx.displayModelIdentityByKey.get(key);
  if (cached) return cached;
  const value = resolveSessionDisplayModelIdentityRef(params);
  ctx.displayModelIdentityByKey.set(key, value);
  return value;
}
function resolveSessionDisplayModelIdentityRef(params) {
  const provider = normalizeOptionalString(params.provider);
  const model = normalizeOptionalString(params.model);
  if (!provider || !model || !isCliProvider(provider, params.cfg))
    return {
      provider,
      model,
    };
  const defaultRef = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  if (model.includes("/")) {
    const parsedModel = parseModelRef(model, defaultRef.provider);
    if (parsedModel && !isCliProvider(parsedModel.provider, params.cfg)) return parsedModel;
  }
  const inferredProvider = inferUniqueProviderFromConfiguredModels({
    cfg: params.cfg,
    model,
  });
  if (inferredProvider && !isCliProvider(inferredProvider, params.cfg))
    return {
      provider: inferredProvider,
      model,
    };
  const parsedModel = parseModelRef(model, defaultRef.provider);
  if (parsedModel && !isCliProvider(parsedModel.provider, params.cfg)) return parsedModel;
  return {
    provider: defaultRef.provider || provider,
    model,
  };
}
function buildGatewaySessionRow(params) {
  const { cfg, storePath, store, key, entry } = params;
  const lightweight = params.lightweightListRow === true;
  const skipTranscriptUsage = params.skipTranscriptUsageFallback === true;
  const now = params.now ?? Date.now();
  const updatedAt = entry?.updatedAt ?? null;
  const parsed = parseGroupKey(key);
  const channel = entry?.channel ?? parsed?.channel;
  const subject = entry?.subject;
  const groupChannel = entry?.groupChannel;
  const space = entry?.space;
  const id = parsed?.id;
  const origin = entry?.origin;
  const originLabel = origin?.label;
  const isGroupSession = isGroupOrChannelDisplaySession(entry, parsed);
  const displayName =
    entry?.label ??
    (isGroupSession
      ? buildGroupDisplayTitle({
          subject,
          groupChannel,
          space,
        })
      : void 0) ??
    entry?.displayName ??
    (isGroupSession && channel
      ? buildGroupDisplayName({
          provider: channel,
          subject,
          groupChannel,
          space,
          id,
          key,
        })
      : void 0) ??
    originLabel;
  const deliveryFields = normalizeSessionDeliveryFields(entry);
  const sessionAgentId = normalizeAgentId(
    parseAgentSessionKey(key)?.agentId ?? params.agentId ?? resolveDefaultAgentId(cfg),
  );
  const rowContext = params.rowContext;
  const subagentRun = rowContext
    ? rowContext.subagentRuns.getDisplaySubagentRun(key)
    : getSessionDisplaySubagentRunByChildSessionKey(key);
  const subagentOwner =
    normalizeOptionalString(subagentRun?.controllerSessionKey) ||
    normalizeOptionalString(subagentRun?.requesterSessionKey);
  const liveSubagentRunActive = isSubagentRunLive(subagentRun);
  const persistedSessionStatus = entry?.status;
  const persistedSessionEndedAt = entry?.endedAt;
  const persistedSessionStartedAt = entry?.startedAt;
  const persistedSessionRuntimeMs = entry?.runtimeMs;
  const subagentRunState = subagentRun
    ? liveSubagentRunActive
      ? "active"
      : typeof subagentRun.endedAt === "number" ||
          persistedSessionStatus === "done" ||
          persistedSessionStatus === "failed" ||
          persistedSessionStatus === "killed" ||
          persistedSessionStatus === "timeout" ||
          typeof persistedSessionEndedAt === "number"
        ? "historical"
        : "interrupted"
    : void 0;
  const subagentStatus = subagentRun
    ? liveSubagentRunActive
      ? resolveSubagentSessionStatus(subagentRun)
      : persistedSessionStatus === "running"
        ? void 0
        : (persistedSessionStatus ??
          (typeof subagentRun.endedAt === "number"
            ? resolveSubagentSessionStatus(subagentRun)
            : void 0))
    : void 0;
  const subagentStartedAt = subagentRun
    ? liveSubagentRunActive
      ? getSubagentSessionStartedAt(subagentRun)
      : (persistedSessionStartedAt ?? getSubagentSessionStartedAt(subagentRun))
    : void 0;
  const subagentEndedAt = subagentRun
    ? liveSubagentRunActive
      ? subagentRun.endedAt
      : (persistedSessionEndedAt ?? subagentRun.endedAt)
    : void 0;
  const subagentRuntimeMs = subagentRun
    ? liveSubagentRunActive
      ? resolveSessionRuntimeMs(subagentRun, now)
      : (persistedSessionRuntimeMs ??
        (typeof subagentRun.endedAt === "number"
          ? resolveSessionRuntimeMs(subagentRun, now)
          : void 0))
    : void 0;
  const selectedModel = resolveSessionSelectedModelRef({
    cfg,
    entry,
    agentId: sessionAgentId,
    rowContext,
    allowPluginNormalization: !lightweight,
  });
  const resolvedModel = resolveSessionModelIdentityRef(
    cfg,
    entry,
    sessionAgentId,
    subagentRun?.model,
    { allowPluginNormalization: !lightweight },
  );
  const runtimeModelPresent =
    Boolean(entry?.model?.trim()) || Boolean(entry?.modelProvider?.trim());
  const freshSessionTotalTokens = resolveNonNegativeNumber(resolveFreshSessionTotalTokens(entry));
  const needsTranscriptTotalTokens = freshSessionTotalTokens === void 0;
  const needsTranscriptContextTokens = resolvePositiveNumber(entry?.contextTokens) === void 0;
  const needsTranscriptEstimatedCostUsd =
    !skipTranscriptUsage &&
    resolveEstimatedSessionCostUsd({
      cfg,
      provider: resolvedModel.provider,
      model: resolvedModel.model ?? "gpt-5.6-sol",
      entry,
      rowContext,
    }) === void 0;
  const transcriptUsage =
    !skipTranscriptUsage &&
    (needsTranscriptTotalTokens || needsTranscriptContextTokens || needsTranscriptEstimatedCostUsd)
      ? resolveTranscriptUsageFallback({
          cfg,
          key,
          entry,
          storePath,
          fallbackProvider: resolvedModel.provider,
          fallbackModel: resolvedModel.model ?? "gpt-5.6-sol",
          maxTranscriptBytes: params.transcriptUsageMaxBytes,
          rowContext: params.rowContext,
          agentId: sessionAgentId,
        })
      : null;
  const preferLiveSubagentModelIdentity =
    Boolean(subagentRun?.model?.trim()) && subagentStatus === "running";
  const shouldUseTranscriptModelIdentity =
    runtimeModelPresent &&
    !preferLiveSubagentModelIdentity &&
    (needsTranscriptTotalTokens || needsTranscriptContextTokens);
  const resolvedModelIdentity = {
    provider: resolvedModel.provider,
    model: resolvedModel.model ?? "gpt-5.6-sol",
  };
  const { provider: modelProvider, model } = shouldUseTranscriptModelIdentity
    ? {
        provider: transcriptUsage?.modelProvider ?? resolvedModelIdentity.provider,
        model: transcriptUsage?.model ?? resolvedModelIdentity.model,
      }
    : resolvedModelIdentity;
  const totalTokens =
    freshSessionTotalTokens ?? resolveNonNegativeNumber(transcriptUsage?.totalTokens);
  const totalTokensFresh =
    freshSessionTotalTokens !== void 0 ||
    (typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0)
      ? true
      : transcriptUsage?.totalTokensFresh === true;
  const goal = entry?.goal
    ? resolveSessionGoalDisplayState(
        {
          goal: entry.goal,
          totalTokens,
          totalTokensFresh,
        },
        now,
        { adoptFreshBaseline: false },
      )
    : void 0;
  const childSessions = params.storeChildSessionsByKey
    ? mergeChildSessionKeys(
        resolveRuntimeChildSessionKeys(key, now, rowContext?.subagentRuns),
        params.storeChildSessionsByKey.get(key),
      )
    : resolveChildSessionKeys(key, store, now, rowContext?.subagentRuns);
  const compactionCheckpoints = resolveProjectableCompactionCheckpoints(entry);
  const compactionCheckpointCount = Array.isArray(entry?.compactionCheckpoints)
    ? compactionCheckpoints.length
    : void 0;
  const latestCompactionCheckpoint = buildCompactionCheckpointPreview(
    resolveLatestCompactionCheckpoint(compactionCheckpoints),
  );
  const selectedOrRuntimeModelProvider = selectedModel?.provider ?? modelProvider;
  const selectedOrRuntimeModel = selectedModel?.model ?? model;
  const rowModelIdentity = lightweight
    ? {
        provider: selectedOrRuntimeModelProvider,
        model: selectedOrRuntimeModel,
      }
    : resolveSessionDisplayModelIdentityRefCached({
        cfg,
        agentId: sessionAgentId,
        provider: selectedOrRuntimeModelProvider,
        model: selectedOrRuntimeModel,
        rowContext: params.rowContext,
      });
  const rowModelProvider = rowModelIdentity.provider;
  const rowModel = rowModelIdentity.model;
  const acpSessionKey = resolveStoredSessionKeyForAgentStore({
    cfg,
    agentId: sessionAgentId,
    sessionKey: key,
  });
  const estimatedCostUsd = lightweight
    ? resolveNonNegativeNumber(entry?.estimatedCostUsd)
    : (resolveEstimatedSessionCostUsd({
        cfg,
        provider: rowModelProvider,
        model: rowModel,
        entry,
        rowContext: params.rowContext,
      }) ?? resolveNonNegativeNumber(transcriptUsage?.estimatedCostUsd));
  const contextTokens = lightweight
    ? (resolvePositiveNumber(entry?.contextTokens) ??
      resolvePositiveNumber(
        resolveContextTokensForModel({
          cfg,
          provider: rowModelProvider,
          model: rowModel,
          allowAsyncLoad: false,
        }),
      ))
    : (resolvePositiveNumber(entry?.contextTokens) ??
      resolvePositiveNumber(transcriptUsage?.contextTokens) ??
      resolvePositiveNumber(
        resolveContextTokensForModel({
          cfg,
          provider: rowModelProvider,
          model: rowModel,
          allowAsyncLoad: false,
        }),
      ));
  let derivedTitle;
  let lastMessagePreview;
  if (entry?.sessionId && (params.includeDerivedTitles || params.includeLastMessage)) {
    const fields = readSessionTitleFieldsFromTranscript({
      agentId: sessionAgentId,
      sessionEntry: entry,
      sessionId: entry.sessionId,
      sessionKey: key,
      storePath,
    });
    if (params.includeDerivedTitles)
      derivedTitle = deriveSessionTitle(entry, fields.firstUserMessage);
    if (params.includeLastMessage && fields.lastMessagePreview)
      lastMessagePreview = fields.lastMessagePreview;
  }
  const thinkingProjection = resolveGatewaySessionThinkingProjectionInternal({
    cfg,
    agentId: sessionAgentId,
    provider: rowModelProvider ?? "openai",
    model: rowModel ?? "gpt-5.6-sol",
    sessionKey: acpSessionKey,
    entry,
    modelCatalog: params.modelCatalog,
    rowContext,
  });
  const fastModeState = resolveFastModeState({
    cfg,
    provider: selectedOrRuntimeModelProvider ?? "openai",
    model: selectedOrRuntimeModel ?? "gpt-5.6-sol",
    agentId: sessionAgentId,
    sessionEntry: entry?.fastMode !== void 0 ? { fastMode: entry.fastMode } : void 0,
  });
  const pluginExtensions =
    !lightweight && entry
      ? projectPluginSessionExtensionsSync({
          sessionKey: key,
          entry,
        })
      : [];
  return {
    key,
    spawnedBy: subagentOwner || entry?.spawnedBy,
    spawnedWorkspaceDir: entry?.spawnedWorkspaceDir,
    spawnedCwd: entry?.spawnedCwd,
    worktree: entry?.worktree,
    execNode: entry?.execNode,
    execCwd: entry?.execCwd,
    forkedFromParent: entry?.forkedFromParent,
    spawnDepth: entry?.spawnDepth,
    subagentRole: entry?.subagentRole,
    subagentControlScope: entry?.subagentControlScope,
    kind: classifySessionKey(key, entry),
    label: entry?.label,
    category: entry?.category,
    displayName,
    derivedTitle,
    lastMessagePreview,
    channel,
    subject,
    groupChannel,
    space,
    chatType: entry?.chatType,
    origin,
    updatedAt,
    archived: entry?.archivedAt !== void 0,
    archivedAt: entry?.archivedAt,
    pinned: entry?.pinnedAt !== void 0,
    pinnedAt: entry?.pinnedAt,
    unread: deriveSessionUnread(entry),
    lastReadAt: entry?.lastReadAt,
    lastActivityAt: entry?.lastActivityAt,
    sessionId: entry?.sessionId,
    systemSent: entry?.systemSent,
    abortedLastRun: entry?.abortedLastRun,
    thinkingLevel: thinkingProjection.thinkingLevel,
    thinkingLevels: thinkingProjection.thinkingLevels,
    thinkingOptions: thinkingProjection.thinkingOptions,
    thinkingDefault: thinkingProjection.thinkingDefault,
    fastMode: entry?.fastMode,
    effectiveFastMode: fastModeState.mode,
    effectiveFastModeSource: fastModeState.source,
    fastAutoOnSeconds: fastModeState.fastAutoOnSeconds,
    verboseLevel: entry?.verboseLevel,
    traceLevel: entry?.traceLevel,
    reasoningLevel: entry?.reasoningLevel,
    elevatedLevel: entry?.elevatedLevel,
    sendPolicy: entry?.sendPolicy,
    inputTokens: entry?.inputTokens,
    outputTokens: entry?.outputTokens,
    totalTokens,
    totalTokensFresh,
    goal,
    estimatedCostUsd,
    status: subagentRun ? subagentStatus : entry?.status,
    hasAutomation: sessionHasAutomation(key, cfg) ? true : void 0,
    subagentRunState,
    hasActiveSubagentRun: subagentRun ? liveSubagentRunActive : void 0,
    startedAt: subagentRun ? subagentStartedAt : entry?.startedAt,
    endedAt: subagentRun ? subagentEndedAt : entry?.endedAt,
    runtimeMs: subagentRun ? subagentRuntimeMs : entry?.runtimeMs,
    parentSessionKey: subagentOwner || entry?.parentSessionKey,
    childSessions,
    responseUsage: entry?.responseUsage,
    effectiveResponseUsage: resolveEffectiveResponseUsage(
      entry?.responseUsage,
      cfg.messages?.responseUsage,
      channel,
    ),
    modelProvider: rowModelProvider,
    model: rowModel,
    modelSelectionLocked: entry?.modelSelectionLocked,
    agentRuntime: thinkingProjection.agentRuntime,
    contextTokens,
    contextBudgetStatus: entry?.contextBudgetStatus,
    deliveryContext: deliveryFields.deliveryContext,
    lastChannel: deliveryFields.lastChannel ?? entry?.lastChannel,
    lastTo: deliveryFields.lastTo ?? entry?.lastTo,
    lastAccountId: deliveryFields.lastAccountId ?? entry?.lastAccountId,
    lastThreadId: deliveryFields.lastThreadId ?? entry?.lastThreadId,
    compactionCheckpointCount,
    latestCompactionCheckpoint,
    pluginExtensions: pluginExtensions.length > 0 ? pluginExtensions : void 0,
  };
}
function resolveSessionListSearchDisplayName(key, entry) {
  if (entry?.displayName) return entry.displayName;
  const parsed = parseGroupKey(key);
  const channel = entry?.channel ?? parsed?.channel;
  if (isGroupOrChannelDisplaySession(entry, parsed) && channel)
    return buildGroupDisplayName({
      provider: channel,
      subject: entry?.subject,
      groupChannel: entry?.groupChannel,
      space: entry?.space,
      id: parsed?.id,
      key,
    });
  return entry?.label ?? entry?.origin?.label;
}
function addSessionListSearchModelFields(fields, identity) {
  const provider = normalizeOptionalString(identity.provider);
  const model = normalizeOptionalString(identity.model);
  fields.push(provider, model);
  if (provider && model) fields.push(`${provider}/${model}`);
}
function matchesSessionListSearch(fields, search) {
  return fields.some(
    (field) => typeof field === "string" && normalizeLowercaseStringOrEmpty(field).includes(search),
  );
}
function appendStoredSessionModelSearchFields(fields, entry) {
  const provider = normalizeOptionalString(entry?.modelProvider);
  const model = normalizeOptionalString(entry?.model);
  fields.push(provider, model);
  if (provider && model) fields.push(`${provider}/${model}`);
}
function shouldResolveDerivedSessionModelSearchFields(search) {
  return !search.startsWith("agent:");
}
function resolveSessionListRowContext(params) {
  return params.rowContext ?? params.getRowContext?.();
}
function resolveSessionListSearchModelFields(params) {
  const agentId = normalizeAgentId(
    parseAgentSessionKey(params.key)?.agentId ?? resolveDefaultAgentId(params.cfg),
  );
  const subagentRun = params.rowContext
    ? params.rowContext.subagentRuns.getDisplaySubagentRun(params.key)
    : getSessionDisplaySubagentRunByChildSessionKey(params.key);
  const selectedModel = resolveSessionSelectedModelRef({
    cfg: params.cfg,
    entry: params.entry,
    agentId,
    rowContext: params.rowContext,
    allowPluginNormalization: false,
  });
  const resolvedModel = resolveSessionModelIdentityRef(
    params.cfg,
    params.entry,
    agentId,
    subagentRun?.model,
    { allowPluginNormalization: false },
  );
  const modelIdentity = {
    provider: resolvedModel.provider,
    model: resolvedModel.model ?? "gpt-5.6-sol",
  };
  const selectedOrRuntimeModelProvider = selectedModel?.provider ?? modelIdentity.provider;
  const selectedOrRuntimeModel = selectedModel?.model ?? modelIdentity.model;
  const displayModelIdentity = resolveSessionDisplayModelIdentityRefCached({
    cfg: params.cfg,
    agentId,
    provider: selectedOrRuntimeModelProvider,
    model: selectedOrRuntimeModel,
    rowContext: params.rowContext,
  });
  const fields = [];
  addSessionListSearchModelFields(fields, {
    provider: params.entry?.modelProvider,
    model: params.entry?.model,
  });
  addSessionListSearchModelFields(fields, resolvedModel);
  if (selectedModel) addSessionListSearchModelFields(fields, selectedModel);
  addSessionListSearchModelFields(fields, displayModelIdentity);
  return fields;
}
function loadGatewaySessionRow(sessionKey, options) {
  const now = options?.now ?? Date.now();
  const { cfg, storePath, store, entry, canonicalKey } = loadSessionEntry(sessionKey, {
    clone: false,
    ...(options?.agentId ? { agentId: options.agentId } : {}),
  });
  if (!entry) return null;
  const storeChildSessionsByKey = buildSingleRowStoreChildSessionsByKey({
    storePath,
    store,
    key: canonicalKey,
    now,
  });
  return buildGatewaySessionRow({
    cfg,
    storePath,
    store,
    key: canonicalKey,
    entry,
    now,
    includeDerivedTitles: options?.includeDerivedTitles,
    includeLastMessage: options?.includeLastMessage,
    transcriptUsageMaxBytes: options?.transcriptUsageMaxBytes,
    storeChildSessionsByKey,
    ...(options?.agentId ? { agentId: options.agentId } : {}),
  });
}
function buildGatewaySessionInfo(params) {
  const now = params.now ?? Date.now();
  const storeChildSessionsByKey = buildSingleRowStoreChildSessionsByKey({
    storePath: params.storePath,
    store: params.store,
    key: params.key,
    now,
  });
  return buildGatewaySessionRow({
    cfg: params.cfg,
    storePath: params.storePath,
    store: params.store,
    key: params.key,
    entry: params.entry,
    agentId: params.agentId,
    modelCatalog: params.modelCatalog,
    now,
    storeChildSessionsByKey,
    skipTranscriptUsageFallback: true,
    lightweightListRow: true,
  });
}
/**
 * Number of session rows to build per batch before yielding to the event loop.
 * Keeps the main thread responsive during large session list operations while
 * avoiding excessive yielding overhead for small stores.
 */
const SESSIONS_LIST_YIELD_BATCH_SIZE = 10;
const SESSIONS_LIST_TOP_N_LIMIT = 200;
const SESSIONS_LIST_DEFAULT_LIMIT = 100;
function compareSessionEntryPairs(a, b) {
  const aPinnedAt = a[1]?.pinnedAt ?? 0;
  const bPinnedAt = b[1]?.pinnedAt ?? 0;
  if (aPinnedAt !== bPinnedAt) return bPinnedAt - aPinnedAt;
  const byUpdatedAt = (b[1]?.updatedAt ?? 0) - (a[1]?.updatedAt ?? 0);
  if (byUpdatedAt !== 0) return byUpdatedAt;
  return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
}
function resolveSessionsListLimit(opts, defaultLimit) {
  if (typeof opts.limit !== "number" || !Number.isFinite(opts.limit)) return defaultLimit;
  return Math.max(1, Math.floor(opts.limit));
}
function resolveSessionsListOffset(opts) {
  if (typeof opts.offset !== "number" || !Number.isFinite(opts.offset)) return 0;
  return Math.max(0, Math.floor(opts.offset));
}
function resolveSessionsListWindowLimit(limit, offset) {
  if (limit === void 0) return;
  const windowLimit = offset + limit;
  return Number.isFinite(windowLimit) ? Math.min(windowLimit, Number.MAX_SAFE_INTEGER) : void 0;
}
function selectNewestLimitedEntries(entries, limit) {
  const selected = [];
  for (const entry of entries) {
    const insertAt = selected.findIndex(
      (candidate) => compareSessionEntryPairs(entry, candidate) < 0,
    );
    if (insertAt >= 0) {
      selected.splice(insertAt, 0, entry);
      if (selected.length > limit) selected.pop();
    } else if (selected.length < limit) selected.push(entry);
  }
  return selected;
}
function sortAndLimitSessionEntries(entries, limit) {
  if (limit !== void 0 && limit <= SESSIONS_LIST_TOP_N_LIMIT)
    return selectNewestLimitedEntries(entries, limit);
  const sorted = entries.toSorted(compareSessionEntryPairs);
  return limit === void 0 ? sorted : sorted.slice(0, limit);
}
function filterSessionEntries(params) {
  const { cfg, store, opts, now } = params;
  const includeGlobal = opts.includeGlobal === true;
  const includeUnknown = opts.includeUnknown === true;
  const spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
  const label = normalizeOptionalString(opts.label) ?? "";
  const agentId = typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : "";
  const search = normalizeLowercaseStringOrEmpty(opts.search);
  const activeMinutes =
    typeof opts.activeMinutes === "number" && Number.isFinite(opts.activeMinutes)
      ? Math.max(1, Math.floor(opts.activeMinutes))
      : void 0;
  let entries = Object.entries(store)
    .filter(([key]) => {
      if (isCronRunSessionKey(key)) return false;
      if (!includeGlobal && key === "global") return false;
      if (!includeUnknown && key === "unknown") return false;
      if (agentId) {
        if (key === "global") return includeGlobal;
        if (key === "unknown") return false;
        const parsed = parseAgentSessionKey(key);
        if (!parsed) return false;
        return normalizeAgentId(parsed.agentId) === agentId;
      }
      return true;
    })
    .filter(([key, entry]) => {
      if (isPhantomAgentStoreListEntry(key, entry)) return false;
      if (!spawnedBy) return true;
      if (key === "unknown" || key === "global") return false;
      const filterRowContext = resolveSessionListRowContext(params);
      const latest = filterRowContext
        ? filterRowContext.subagentRuns.getDisplaySubagentRun(key)
        : getSessionDisplaySubagentRunByChildSessionKey(key);
      if (latest)
        return (
          (normalizeOptionalString(latest.controllerSessionKey) ||
            normalizeOptionalString(latest.requesterSessionKey)) === spawnedBy &&
          shouldKeepSubagentRunChildLink(latest, {
            activeDescendants: filterRowContext
              ? filterRowContext.subagentRuns.countActiveDescendantRuns(key)
              : countActiveDescendantRuns(key),
            now,
          })
        );
      return (
        shouldKeepStoreOnlyChildLink(entry, now) &&
        (entry?.spawnedBy === spawnedBy || entry?.parentSessionKey === spawnedBy)
      );
    })
    .filter(([, entry]) => {
      const archived = entry?.archivedAt !== void 0;
      return opts.archived === true ? archived : !archived;
    })
    .filter(([, entry]) => {
      if (!label) return true;
      return entry?.label === label;
    });
  if (search)
    entries = entries.filter(([key, entry]) => {
      const cheapFields = [
        resolveSessionListSearchDisplayName(key, entry),
        entry?.label,
        entry?.subject,
        entry?.sessionId,
        key,
      ];
      appendStoredSessionModelSearchFields(cheapFields, entry);
      if (matchesSessionListSearch(cheapFields, search)) return true;
      if (!shouldResolveDerivedSessionModelSearchFields(search)) return false;
      const searchRowContext = resolveSessionListRowContext(params);
      return matchesSessionListSearch(
        resolveSessionListSearchModelFields({
          cfg,
          key,
          entry,
          rowContext: searchRowContext,
        }),
        search,
      );
    });
  if (activeMinutes !== void 0) {
    const cutoff = now - activeMinutes * 6e4;
    entries = entries.filter(([, entry]) => (entry?.updatedAt ?? 0) >= cutoff);
  }
  return entries;
}
function isPhantomAgentStoreListEntry(key, entry) {
  return (
    parseAgentSessionKey(key)?.rest === "sessions" &&
    !normalizeOptionalString(entry?.sessionId) &&
    entry?.updatedAt == null
  );
}
function selectSessionEntries(params) {
  const filtered = filterSessionEntries(params);
  const limit = resolveSessionsListLimit(params.opts, params.defaultLimit);
  const offset = resolveSessionsListOffset(params.opts);
  const sortedWindow = sortAndLimitSessionEntries(
    filtered,
    resolveSessionsListWindowLimit(limit, offset),
  );
  const entries =
    limit === void 0 ? sortedWindow.slice(offset) : sortedWindow.slice(offset, offset + limit);
  const nextOffset = offset + entries.length;
  const hasMore = nextOffset < filtered.length;
  return {
    entries,
    totalCount: filtered.length,
    limitApplied: limit,
    offset,
    nextOffset: hasMore ? nextOffset : null,
    hasMore,
  };
}
function filterAndSortSessionEntries(params) {
  return selectSessionEntries(params).entries;
}
function listSessionsFromStore(params) {
  const { cfg, storePath, store, opts } = params;
  const now = Date.now();
  const sessionListTranscriptUsageMaxBytes = 64 * 1024;
  const sessionListTranscriptFieldRows = 100;
  let rowContext;
  const getRowContext = () => {
    rowContext ??= buildSessionListRowContext({
      store,
      now,
    });
    return rowContext;
  };
  const includeDerivedTitles = opts.includeDerivedTitles === true;
  const includeLastMessage = opts.includeLastMessage === true;
  const hasSpawnedByFilter = typeof opts.spawnedBy === "string" && opts.spawnedBy.length > 0;
  const { entries, totalCount, limitApplied, offset, nextOffset, hasMore } = selectSessionEntries({
    cfg,
    store,
    opts,
    now,
    getRowContext:
      hasSpawnedByFilter || Boolean(normalizeOptionalString(opts.search)) ? getRowContext : void 0,
    defaultLimit: SESSIONS_LIST_DEFAULT_LIMIT,
  });
  const fullRowContext =
    rowContext || hasSpawnedByFilter || entries.length > SESSIONS_LIST_YIELD_BATCH_SIZE
      ? getRowContext()
      : void 0;
  const sharedRowContext =
    fullRowContext ?? (entries.length > 0 ? buildSessionListRowMetadataContext({ now }) : void 0);
  const sessions = entries.map(([key, entry], index) => {
    const includeTranscriptFields = index < sessionListTranscriptFieldRows;
    const rowAgentId =
      key === "global" && typeof opts.agentId === "string"
        ? normalizeAgentId(opts.agentId)
        : void 0;
    const storeChildSessionsByKey =
      fullRowContext?.storeChildSessionsByKey ??
      buildSingleRowStoreChildSessionsByKey({
        store,
        storePath,
        key,
        now,
      });
    return buildGatewaySessionRow({
      cfg,
      storePath,
      store,
      key,
      entry,
      agentId: rowAgentId,
      modelCatalog: params.modelCatalog,
      now,
      includeDerivedTitles: includeTranscriptFields && includeDerivedTitles,
      includeLastMessage: includeTranscriptFields && includeLastMessage,
      transcriptUsageMaxBytes: sessionListTranscriptUsageMaxBytes,
      storeChildSessionsByKey,
      rowContext: sharedRowContext,
    });
  });
  return {
    ts: now,
    path: storePath,
    count: sessions.length,
    totalCount,
    limitApplied,
    offset: offset > 0 ? offset : void 0,
    nextOffset,
    hasMore,
    defaults: getSessionDefaults(cfg, params.modelCatalog, { allowPluginNormalization: false }),
    sessions,
  };
}
/**
 * Async version of listSessionsFromStore that yields to the event loop between
 * batches of session row builds. This prevents large session stores from
 * blocking the event loop during sessions.list requests.
 *
 * The synchronous file I/O in readSessionTitleFieldsFromTranscript (head/tail
 * reads for derived titles and last-message previews) is the dominant blocker.
 * By yielding every SESSIONS_LIST_YIELD_BATCH_SIZE rows, we keep the event
 * loop responsive for WebSocket heartbeats, channel I/O, and concurrent RPC.
 */
async function listSessionsFromStoreAsync(params) {
  return withPinnedActivePluginRegistryWorkspaceDir(async () => {
    const { cfg, storePath, store, opts } = params;
    const now = Date.now();
    const sessionListTranscriptUsageMaxBytes = 64 * 1024;
    const sessionListTranscriptFieldRows = 100;
    let rowContext;
    const getRowContext = () => {
      rowContext ??= buildSessionListRowContext({
        store,
        now,
      });
      return rowContext;
    };
    const includeDerivedTitles = opts.includeDerivedTitles === true;
    const includeLastMessage = opts.includeLastMessage === true;
    const hasSpawnedByFilter = typeof opts.spawnedBy === "string" && opts.spawnedBy.length > 0;
    const { entries, totalCount, limitApplied, offset, nextOffset, hasMore } = selectSessionEntries(
      {
        cfg,
        store,
        opts,
        now,
        getRowContext:
          hasSpawnedByFilter || Boolean(normalizeOptionalString(opts.search))
            ? getRowContext
            : void 0,
        defaultLimit: SESSIONS_LIST_DEFAULT_LIMIT,
      },
    );
    const fullRowContext =
      rowContext || hasSpawnedByFilter || entries.length > SESSIONS_LIST_YIELD_BATCH_SIZE
        ? getRowContext()
        : void 0;
    const sharedRowContext =
      fullRowContext ?? (entries.length > 0 ? buildSessionListRowMetadataContext({ now }) : void 0);
    const sessions = [];
    for (let i = 0; i < entries.length; i++) {
      const [key, entry] = expectDefined(entries[i], "entries entry at i");
      const includeTranscriptFields = i < sessionListTranscriptFieldRows;
      const rowAgentId =
        key === "global" && typeof opts.agentId === "string"
          ? normalizeAgentId(opts.agentId)
          : void 0;
      const storeChildSessionsByKey =
        fullRowContext?.storeChildSessionsByKey ??
        buildSingleRowStoreChildSessionsByKey({
          store,
          storePath,
          key,
          now,
        });
      const row = buildGatewaySessionRow({
        cfg,
        storePath,
        store,
        key,
        entry,
        agentId: rowAgentId,
        modelCatalog: params.modelCatalog,
        now,
        includeDerivedTitles: false,
        includeLastMessage: false,
        transcriptUsageMaxBytes: sessionListTranscriptUsageMaxBytes,
        storeChildSessionsByKey,
        rowContext: sharedRowContext,
        skipTranscriptUsageFallback: true,
        lightweightListRow: true,
      });
      if (
        entry?.sessionId &&
        includeTranscriptFields &&
        (includeDerivedTitles || includeLastMessage)
      ) {
        const parsed = parseAgentSessionKey(key);
        const fields = await readSessionTitleFieldsFromTranscriptAsync({
          agentId:
            rowAgentId ??
            (parsed?.agentId ? normalizeAgentId(parsed.agentId) : resolveDefaultAgentId(cfg)),
          sessionEntry: entry,
          sessionId: entry.sessionId,
          sessionKey: key,
          storePath,
        });
        if (includeDerivedTitles)
          row.derivedTitle = deriveSessionTitle(entry, fields.firstUserMessage);
        if (includeLastMessage && fields.lastMessagePreview)
          row.lastMessagePreview = fields.lastMessagePreview;
      }
      sessions.push(row);
      if ((i + 1) % SESSIONS_LIST_YIELD_BATCH_SIZE === 0 && i + 1 < entries.length)
        await new Promise((resolve) => {
          setImmediate(resolve);
        });
    }
    return {
      ts: now,
      path: storePath,
      count: sessions.length,
      totalCount,
      limitApplied,
      offset: offset > 0 ? offset : void 0,
      nextOffset,
      hasMore,
      defaults: getSessionDefaults(cfg, params.modelCatalog, { allowPluginNormalization: false }),
      sessions,
    };
  });
}
//#endregion
export {
  disableCronJobsBoundToSession as C,
  unregisterSessionAutomationSource as S,
  resolveGatewaySessionThinkingProjection as _,
  getSessionDefaults as a,
  claimSessionAutomationEpoch as b,
  listSessionsFromStoreAsync as c,
  migrateAndPruneGatewaySessionStoreKey as d,
  resolveDeletedAgentIdFromSessionKey as f,
  resolveGatewaySessionStoreTargetWithStore as g,
  resolveGatewaySessionStoreTarget as h,
  filterAndSortSessionEntries as i,
  loadGatewaySessionRow as l,
  resolveGatewayModelSupportsImages as m,
  buildGatewaySessionRow as n,
  listAgentsForGateway as o,
  resolveFreshestSessionEntryFromStoreKeys as p,
  deriveSessionTitle as r,
  listSessionsFromStore as s,
  buildGatewaySessionInfo as t,
  loadSessionEntry as u,
  resolveSessionDisplayModelIdentityRef as v,
  resolveCronJobBoundSessionKeys as w,
  registerSessionAutomationSource as x,
  bumpSessionAutomationVersion as y,
};
