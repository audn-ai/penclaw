import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cu28Ynzk.js";
import "./config-BDv-QbJ6.js";
import {
  A as clearPluginRunContext,
  P as makePluginSessionSchedulerJobKey,
  c as getActivePluginRegistry,
  k as cleanupPluginSessionSchedulerJobs,
  z as withPluginHostCleanupTimeout,
} from "./runtime-CcYnX0B4.js";
import { d as cleanupPluginHostSessionStore } from "./session-accessor-PZVNxFCV.js";
import { h as normalizeSessionEntrySlotKey } from "./store-CzZJhTF6.js";
import {
  i as resolveAllAgentSessionStoreTargetsSync,
  o as resolveSqliteTargetFromSessionStorePath,
} from "./targets-CjMfpXbt.js";
//#region src/plugins/host-hook-cleanup.ts
/** Runs plugin cleanup callbacks and clears host-side plugin session/runtime state. */
function shouldCleanPlugin(pluginId, filterPluginId) {
  return !filterPluginId || pluginId === filterPluginId;
}
function cleanupTargetKey(target) {
  return `${target.agentId}\0${target.storePath}`;
}
function resolveExistingSessionStoreTargets(cfg) {
  const targets = /* @__PURE__ */ new Map();
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg))
    targets.set(cleanupTargetKey(target), target);
  return [...targets.values()];
}
function createMemoizedCleanupSessionStoreTargetResolver(cfg) {
  let targets;
  return () => {
    targets ??= resolveExistingSessionStoreTargets(cfg);
    return targets;
  };
}
function pathsToCleanupTargets(storePaths) {
  return storePaths.map((storePath) => {
    return {
      agentId: resolveSqliteTargetFromSessionStorePath(storePath).agentId ?? "main",
      storePath,
    };
  });
}
function resolveCleanupSessionStoreTargets(params) {
  return (
    params.storeTargets ??
    (params.storePaths ? pathsToCleanupTargets(params.storePaths) : void 0) ??
    params.resolveStoreTargets?.() ??
    resolveExistingSessionStoreTargets(params.cfg)
  );
}
async function clearPluginOwnedSessionStores(params) {
  if (!params.pluginId && !params.sessionKey) return 0;
  const storeTargets = resolveCleanupSessionStoreTargets(params);
  let cleared = 0;
  for (const target of storeTargets) {
    if (params.shouldCleanup && !params.shouldCleanup()) break;
    cleared += await cleanupPluginHostSessionStore({
      agentId: target.agentId,
      storePath: target.storePath,
      mode: "plugin-owned-state",
      pluginId: params.pluginId,
      sessionKey: params.sessionKey,
      sessionEntrySlotKeys: params.sessionEntrySlotKeys,
      preserveLockedHarnessIds: params.preserveLockedHarnessIds,
      shouldCleanup: params.shouldCleanup,
    });
  }
  return cleared;
}
async function clearPromotedSessionEntrySlotStores(params) {
  if ((!params.pluginId && !params.sessionKey) || params.sessionEntrySlotKeys.size === 0) return 0;
  const storeTargets = resolveCleanupSessionStoreTargets(params);
  let cleared = 0;
  for (const target of storeTargets) {
    if (params.shouldCleanup && !params.shouldCleanup()) break;
    cleared += await cleanupPluginHostSessionStore({
      agentId: target.agentId,
      storePath: target.storePath,
      mode: "promoted-slots",
      pluginId: params.pluginId,
      sessionKey: params.sessionKey,
      sessionEntrySlotKeys: params.sessionEntrySlotKeys,
      shouldCleanup: params.shouldCleanup,
    });
  }
  return cleared;
}
function collectSessionEntrySlotKeys(registry, pluginId) {
  const slotKeys = /* @__PURE__ */ new Set();
  for (const registration of registry?.sessionExtensions ?? []) {
    if (!shouldCleanPlugin(registration.pluginId, pluginId)) continue;
    const slotKey = registration.extension.sessionEntrySlotKey;
    if (slotKey === void 0) continue;
    const normalized = normalizeSessionEntrySlotKey(slotKey);
    if (normalized.ok) slotKeys.add(normalized.key);
  }
  return slotKeys;
}
function collectAgentHarnessIds(registry, pluginId) {
  const harnessIds = /* @__PURE__ */ new Set();
  for (const registration of registry?.agentHarnesses ?? []) {
    if (!shouldCleanPlugin(registration.pluginId, pluginId)) continue;
    const harnessId = normalizeOptionalAgentRuntimeId(registration.harness.id);
    if (harnessId) harnessIds.add(harnessId);
  }
  return harnessIds;
}
/** Runs persistent and in-memory cleanup for a plugin, session, or host lifecycle event. */
/** Runs cleanup callbacks for one plugin and returns failures instead of throwing. */
async function runPluginHostCleanup(params) {
  const failures = [];
  const shouldCleanup = params.shouldCleanup ?? (() => true);
  if (!shouldCleanup())
    return {
      cleanupCount: 0,
      failures,
    };
  const registry = params.registry;
  const cleanupRegistry = registry ?? getActivePluginRegistry();
  const sessionEntrySlotKeys = collectSessionEntrySlotKeys(cleanupRegistry, params.pluginId);
  const preserveLockedHarnessIds =
    params.reason === "disable" ? collectAgentHarnessIds(cleanupRegistry, params.pluginId) : void 0;
  const restartPromotedSessionEntrySlotKeys =
    params.restartPromotedSessionEntrySlotKeys ?? sessionEntrySlotKeys;
  let persistentCleanupCount = 0;
  if (!params.skipPersistentSessionState && shouldCleanup())
    try {
      persistentCleanupCount =
        params.reason === "restart"
          ? await clearPromotedSessionEntrySlotStores({
              cfg: params.cfg ?? getRuntimeConfig(),
              pluginId: params.pluginId,
              sessionKey: params.sessionKey,
              sessionEntrySlotKeys: restartPromotedSessionEntrySlotKeys,
              storePaths: params.sessionStorePaths,
              storeTargets: params.sessionStoreTargets,
              resolveStoreTargets: params.resolveSessionStoreTargets,
              shouldCleanup,
            })
          : await clearPluginOwnedSessionStores({
              cfg: params.cfg ?? getRuntimeConfig(),
              pluginId: params.pluginId,
              sessionKey: params.sessionKey,
              sessionEntrySlotKeys,
              storePaths: params.sessionStorePaths,
              preserveLockedHarnessIds,
              storeTargets: params.sessionStoreTargets,
              resolveStoreTargets: params.resolveSessionStoreTargets,
              shouldCleanup,
            });
    } catch (error) {
      failures.push({
        pluginId: params.pluginId ?? "plugin-host",
        hookId: "session-store",
        error,
      });
    }
  let cleanupCount = persistentCleanupCount;
  if (registry) {
    for (const registration of registry.sessionExtensions) {
      if (!shouldCleanup())
        return {
          cleanupCount,
          failures,
        };
      if (!shouldCleanPlugin(registration.pluginId, params.pluginId)) continue;
      const cleanup = registration.extension.cleanup;
      if (!cleanup) continue;
      const hookId = `session:${registration.extension.namespace}`;
      try {
        await withPluginHostCleanupTimeout(hookId, () =>
          cleanup({
            reason: params.reason,
            sessionKey: params.sessionKey,
          }),
        );
        cleanupCount += 1;
      } catch (error) {
        failures.push({
          pluginId: registration.pluginId,
          hookId,
          error,
        });
      }
    }
    for (const registration of registry.runtimeLifecycles) {
      if (!shouldCleanup())
        return {
          cleanupCount,
          failures,
        };
      if (!shouldCleanPlugin(registration.pluginId, params.pluginId)) continue;
      const cleanup = registration.lifecycle.cleanup;
      if (!cleanup) continue;
      const hookId = `runtime:${registration.lifecycle.id}`;
      try {
        await withPluginHostCleanupTimeout(hookId, () =>
          cleanup({
            reason: params.reason,
            sessionKey: params.sessionKey,
            runId: params.runId,
          }),
        );
        cleanupCount += 1;
      } catch (error) {
        failures.push({
          pluginId: registration.pluginId,
          hookId,
          error,
        });
      }
    }
    const schedulerFailures = await cleanupPluginSessionSchedulerJobs({
      pluginId: params.pluginId,
      reason: params.reason,
      sessionKey: params.sessionKey,
      records: registry.sessionSchedulerJobs,
      preserveJobIds: params.preserveSchedulerJobIds,
      preserveOwnerRegistry: params.preserveSchedulerOwnerRegistry,
      shouldCleanup,
    });
    for (const failure of schedulerFailures) failures.push(failure);
  }
  if (params.reason !== "restart" && shouldCleanup()) {
    const registrySchedulerJobKeys = new Set(
      (registry?.sessionSchedulerJobs ?? [])
        .filter((record) => !params.pluginId || record.pluginId === params.pluginId)
        .map((record) => ({
          pluginId: record.pluginId,
          jobId: typeof record.job.id === "string" ? record.job.id.trim() : "",
        }))
        .filter(({ jobId }) => jobId.length > 0)
        .map(({ pluginId, jobId }) => makePluginSessionSchedulerJobKey(pluginId, jobId)),
    );
    const runtimeSchedulerFailures = await cleanupPluginSessionSchedulerJobs({
      pluginId: params.pluginId,
      reason: params.reason,
      sessionKey: params.sessionKey,
      preserveJobIds: params.preserveSchedulerJobIds,
      excludeJobKeys: registrySchedulerJobKeys,
      shouldCleanup,
    });
    for (const failure of runtimeSchedulerFailures) failures.push(failure);
  }
  if (
    shouldCleanup() &&
    (params.pluginId || params.runId) &&
    (params.reason !== "restart" || params.runId)
  )
    clearPluginRunContext({
      pluginId: params.pluginId,
      runId: params.runId,
    });
  return {
    cleanupCount,
    failures,
  };
}
function collectHostHookPluginIds(registry) {
  const ids = /* @__PURE__ */ new Set();
  for (const registration of registry.sessionExtensions) ids.add(registration.pluginId);
  for (const registration of registry.runtimeLifecycles) ids.add(registration.pluginId);
  for (const registration of registry.agentEventSubscriptions) ids.add(registration.pluginId);
  for (const registration of registry.sessionSchedulerJobs) ids.add(registration.pluginId);
  return ids;
}
function collectLoadedPluginIds(registry) {
  return new Set(
    registry.plugins.filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id),
  );
}
function collectSchedulerJobIds(registry, pluginId) {
  return new Set(
    (registry?.sessionSchedulerJobs ?? [])
      .filter((registration) => registration.pluginId === pluginId)
      .map((registration) =>
        typeof registration.job.id === "string" ? registration.job.id.trim() : "",
      )
      .filter(Boolean),
  );
}
function collectRestartPromotedSessionEntrySlotKeys(previousRegistry, nextRegistry, pluginId) {
  const staleSlotKeys = collectSessionEntrySlotKeys(previousRegistry, pluginId);
  const preservedSlotKeys = collectSessionEntrySlotKeys(nextRegistry, pluginId);
  for (const slotKey of preservedSlotKeys) staleSlotKeys.delete(slotKey);
  return staleSlotKeys;
}
/** Cleans up plugin host state when a registry snapshot is replaced. */
async function cleanupReplacedPluginHostRegistry(params) {
  const previousRegistry = params.previousRegistry;
  const shouldCleanup = params.shouldCleanup ?? (() => true);
  if (!previousRegistry || previousRegistry === params.nextRegistry || !shouldCleanup())
    return {
      cleanupCount: 0,
      failures: [],
    };
  const nextPluginIds = params.nextRegistry
    ? collectLoadedPluginIds(params.nextRegistry)
    : /* @__PURE__ */ new Set();
  const previousPluginIds = /* @__PURE__ */ new Set([
    ...collectLoadedPluginIds(previousRegistry),
    ...collectHostHookPluginIds(previousRegistry),
  ]);
  const resolveSessionStoreTargets = createMemoizedCleanupSessionStoreTargetResolver(params.cfg);
  const failures = [];
  let cleanupCount = 0;
  for (const pluginId of previousPluginIds) {
    if (!shouldCleanup()) break;
    const restarted = nextPluginIds.has(pluginId);
    const result = await runPluginHostCleanup({
      cfg: params.cfg,
      registry: previousRegistry,
      pluginId,
      reason: restarted ? "restart" : "disable",
      preserveSchedulerJobIds: restarted
        ? collectSchedulerJobIds(params.nextRegistry, pluginId)
        : void 0,
      shouldCleanup,
      restartPromotedSessionEntrySlotKeys: restarted
        ? collectRestartPromotedSessionEntrySlotKeys(
            previousRegistry,
            params.nextRegistry,
            pluginId,
          )
        : void 0,
      preserveSchedulerOwnerRegistry: restarted ? params.nextRegistry : void 0,
      resolveSessionStoreTargets,
    });
    cleanupCount += result.cleanupCount;
    failures.push(...result.failures);
  }
  return {
    cleanupCount,
    failures,
  };
}
//#endregion
export { runPluginHostCleanup as n, cleanupReplacedPluginHostRegistry as t };
