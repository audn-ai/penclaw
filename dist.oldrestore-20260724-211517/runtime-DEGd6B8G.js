import { isDeepStrictEqual } from "node:util";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-DtcDeqWS.js";
import { g as registerSecretValueForRedaction } from "./redact-CUe6Oey5.js";
import {
  i as mergeSecretsRuntimeEnv,
  n as collectCandidateAgentDirs,
  o as resolveRefreshAgentDirs,
  r as createEmptyRuntimeWebToolsMetadata,
  t as canUseSecretsRuntimeFastPath,
} from "./runtime-fast-path-CDvQ-ayV.js";
import { i as getRuntimeConfigSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import { i as getRuntimeAuthProfileStoreCredentialsRevision } from "./runtime-snapshots-BU3oOWrH.js";
import {
  a as getActiveSecretsRuntimeEnv$1,
  c as getActiveSecretsRuntimeSnapshotRevision$1,
  h as setPreparedSecretsRuntimeSnapshotRefreshContext,
  l as getLiveSecretsRuntimeAuthStores,
  m as restoreSecretsRuntimeSnapshotStateIfCurrent,
  n as activateSecretsRuntimeSnapshotStateIfCurrent,
  o as getActiveSecretsRuntimeRefreshContext,
  p as registerSecretsRuntimeStateClearHook,
  r as clearSecretsRuntimeSnapshot$1,
  s as getActiveSecretsRuntimeSnapshot$1,
  t as activateSecretsRuntimeSnapshotState,
  u as getPreparedSecretsRuntimeSnapshotRefreshContext,
} from "./runtime-state-B7u15R2P.js";
import "./auth-profiles-CX7JDmZ9.js";
import { n as getActiveRuntimeWebToolsMetadata$1 } from "./runtime-web-tools-state-fE_he60Y.js";
import {
  d as loadAuthProfileStoreForSecretsRuntime,
  f as loadAuthProfileStoreWithoutExternalProfiles,
  r as clearRuntimeAuthProfileStoreSnapshots,
} from "./store-B7DoDdVM.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/secrets/runtime.ts
/** Prepares secrets runtime snapshots from config, auth stores, plugins, and env. */
registerSecretsRuntimeStateClearHook(clearRuntimeAuthProfileStoreSnapshots);
const loadRuntimeManifestHelpers = createLazyRuntimeModule(
  () => import("./runtime-manifest.runtime.js"),
);
const loadRuntimePrepareHelpers = createLazyRuntimeModule(
  () => import("./runtime-prepare.runtime.js"),
);
async function resolveLoadablePluginOrigins(params) {
  const workspaceDir = resolveAgentWorkspaceDir(
    params.config,
    resolveDefaultAgentId(params.config),
  );
  const { listPluginOriginsFromMetadataSnapshot, loadPluginMetadataSnapshot } =
    await loadRuntimeManifestHelpers();
  return listPluginOriginsFromMetadataSnapshot(
    params.pluginMetadataSnapshot ??
      loadPluginMetadataSnapshot({
        config: params.config,
        workspaceDir,
        env: params.env,
      }),
  );
}
function hasConfiguredPluginEntries(config) {
  const entries = config.plugins?.entries;
  return (
    Boolean(entries) &&
    typeof entries === "object" &&
    !Array.isArray(entries) &&
    Object.keys(entries).length > 0
  );
}
function hasConfiguredChannelEntries(config) {
  const channels = config.channels;
  return (
    Boolean(channels) &&
    typeof channels === "object" &&
    !Array.isArray(channels) &&
    Object.keys(channels).some((channelId) => channelId !== "defaults")
  );
}
function hasConfiguredPluginIntegrationSecretProviders(config) {
  const providers = config.secrets?.providers;
  if (!providers || typeof providers !== "object" || Array.isArray(providers)) return false;
  return Object.values(providers).some(
    (provider) =>
      provider?.source === "exec" &&
      "pluginIntegration" in provider &&
      provider.pluginIntegration !== void 0,
  );
}
function shouldLoadPluginMetadataForSecrets(config) {
  return (
    hasConfiguredPluginEntries(config) ||
    hasConfiguredChannelEntries(config) ||
    hasConfiguredPluginIntegrationSecretProviders(config)
  );
}
/** Prepares a secrets runtime snapshot and records refresh context for later activation. */
async function prepareSecretsRuntimeSnapshot(params) {
  const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
  const authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
  const sourceConfig = structuredClone(params.config);
  const assignmentSourceConfig = structuredClone(params.assignmentConfig ?? params.config);
  const resolvedConfig = structuredClone(assignmentSourceConfig);
  const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
  let authStores = [];
  const fastPathLoadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreWithoutExternalProfiles;
  const candidateDirs = params.agentDirs?.length
    ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, runtimeEnv)))
    : collectCandidateAgentDirs(resolvedConfig, runtimeEnv);
  if (includeAuthStoreRefs)
    for (const agentDir of candidateDirs)
      authStores.push({
        agentDir,
        store: structuredClone(fastPathLoadAuthStore(agentDir)),
      });
  if (
    canUseSecretsRuntimeFastPath({
      sourceConfig: assignmentSourceConfig,
      authStores,
    })
  ) {
    const manifestRegistry =
      params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
    const snapshot = {
      sourceConfig,
      config: resolvedConfig,
      authStores,
      authStoreCredentialsRevision,
      warnings: [],
      webTools: createEmptyRuntimeWebToolsMetadata(),
    };
    setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
      env: runtimeEnv,
      explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
      includeAuthStoreRefs,
      loadAuthStore: fastPathLoadAuthStore,
      loadablePluginOrigins: params.loadablePluginOrigins ?? /* @__PURE__ */ new Map(),
      ...(manifestRegistry ? { manifestRegistry } : {}),
    });
    return snapshot;
  }
  const {
    applyResolvedAssignments,
    collectAuthStoreAssignments,
    collectConfigAssignments,
    createResolverContext,
    resolveRuntimeWebTools,
    resolveSecretRefValues,
  } = await loadRuntimePrepareHelpers();
  const manifestRegistry =
    params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
  const loadablePluginOrigins =
    params.loadablePluginOrigins ??
    (shouldLoadPluginMetadataForSecrets(sourceConfig)
      ? await resolveLoadablePluginOrigins({
          config: sourceConfig,
          env: runtimeEnv,
          pluginMetadataSnapshot:
            params.pluginMetadataSnapshot ??
            (manifestRegistry ? { plugins: manifestRegistry.plugins } : void 0),
        })
      : /* @__PURE__ */ new Map());
  const context = createResolverContext({
    sourceConfig,
    env: runtimeEnv,
    ...(manifestRegistry ? { manifestRegistry } : {}),
  });
  collectConfigAssignments({
    config: resolvedConfig,
    context,
    loadablePluginOrigins,
  });
  if (includeAuthStoreRefs) {
    const loadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime;
    if (!params.loadAuthStore)
      authStores = candidateDirs.map((agentDir) => ({
        agentDir,
        store: structuredClone(loadAuthStore(agentDir)),
      }));
    for (const entry of authStores)
      collectAuthStoreAssignments({
        store: entry.store,
        context,
        agentDir: entry.agentDir,
      });
  }
  if (context.assignments.length > 0) {
    const resolved = await resolveSecretRefValues(
      context.assignments.map((assignment) => assignment.ref),
      {
        config: sourceConfig,
        env: context.env,
        cache: context.cache,
        manifestRegistry: context.manifestRegistry,
      },
    );
    for (const value of resolved.values())
      if (typeof value === "string") registerSecretValueForRedaction(value);
    applyResolvedAssignments({
      assignments: context.assignments,
      resolved,
    });
  }
  const snapshot = {
    sourceConfig,
    config: resolvedConfig,
    authStores,
    authStoreCredentialsRevision,
    warnings: context.warnings,
    webTools: await resolveRuntimeWebTools({
      sourceConfig,
      resolvedConfig,
      context,
    }),
  };
  setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
    env: runtimeEnv,
    explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
    includeAuthStoreRefs,
    loadAuthStore: params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime,
    loadablePluginOrigins,
    ...(manifestRegistry ? { manifestRegistry } : {}),
  });
  return snapshot;
}
/** Activates a prepared secrets runtime snapshot for fast runtime lookup. */
function activateSecretsRuntimeSnapshot(snapshot) {
  activateSecretsRuntimeSnapshotState(createSecretsRuntimeSnapshotActivation(snapshot));
}
/** Compare-and-activate boundary for snapshots prepared from process-wide runtime state. */
function activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, options) {
  return activateSecretsRuntimeSnapshotStateIfCurrent({
    ...createSecretsRuntimeSnapshotActivation(snapshot),
    expectedRevision,
    preserveActivationLineage: options?.preserveActivationLineage,
  });
}
/** Restores an owned predecessor while retaining changes after candidate preparation. */
function restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot) {
  return restoreSecretsRuntimeSnapshotStateIfCurrent({
    ...createSecretsRuntimeSnapshotActivation(snapshot),
    expectedRevision,
    ownedSnapshot,
  });
}
function coercePreflightRefresh(value, sourceConfig) {
  if (!value || typeof value !== "object") return null;
  const candidate = value;
  return candidate.snapshot &&
    typeof candidate.expectedRevision === "number" &&
    isDeepStrictEqual(candidate.snapshot.sourceConfig, sourceConfig)
    ? candidate
    : null;
}
async function prepareActiveSecretsRuntimeRefresh(
  sourceConfig,
  includeAuthStoreRefs,
  snapshotConfig = sourceConfig,
) {
  const expectedRevision = getActiveSecretsRuntimeSnapshotRevision$1();
  const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
  if (!getActiveSecretsRuntimeSnapshot$1() || !activeRefreshContext) return null;
  return {
    snapshot: await prepareSecretsRuntimeSnapshot({
      config: sourceConfig,
      assignmentConfig: snapshotConfig,
      env: activeRefreshContext.env,
      agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
      includeAuthStoreRefs: includeAuthStoreRefs ?? activeRefreshContext.includeAuthStoreRefs,
      loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
      ...(activeRefreshContext.manifestRegistry
        ? { manifestRegistry: activeRefreshContext.manifestRegistry }
        : {}),
      ...(activeRefreshContext.loadAuthStore
        ? { loadAuthStore: activeRefreshContext.loadAuthStore }
        : {}),
    }),
    expectedRevision,
  };
}
/** Prepares a config-write refresh candidate tied to the current runtime revision. */
async function preflightActiveSecretsRuntimeSnapshotRefresh(params) {
  return await prepareActiveSecretsRuntimeRefresh(params.sourceConfig, params.includeAuthStoreRefs);
}
/** Publishes a config-write refresh after retrying any candidate invalidated while preparing. */
async function refreshActiveSecretsRuntimeSnapshotForConfig(params) {
  let candidate = coercePreflightRefresh(params.preflightResult, params.sourceConfig);
  for (;;) {
    candidate ??= await prepareActiveSecretsRuntimeRefresh(
      params.sourceConfig,
      params.includeAuthStoreRefs,
    );
    if (!candidate) return false;
    const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
    if (!activeRefreshContext) return false;
    if (params.includeAuthStoreRefs === false && activeRefreshContext.includeAuthStoreRefs) {
      candidate.snapshot.authStores = getLiveSecretsRuntimeAuthStores();
      candidate.snapshot.authStoreCredentialsRevision =
        getRuntimeAuthProfileStoreCredentialsRevision();
      setPreparedSecretsRuntimeSnapshotRefreshContext(candidate.snapshot, activeRefreshContext);
    }
    if (activateSecretsRuntimeSnapshotIfCurrent(candidate.snapshot, candidate.expectedRevision))
      return true;
    candidate = null;
  }
}
function patchResolvedSecretRefLeaves(params) {
  if (coerceSecretRef(params.source, params.defaults))
    return isDeepStrictEqual(params.source, params.resolved)
      ? {
          changed: false,
          value: params.current,
        }
      : {
          changed: true,
          value: params.resolved,
        };
  if (Array.isArray(params.source) && Array.isArray(params.resolved)) {
    const next = Array.isArray(params.current)
      ? [...params.current]
      : structuredClone(params.resolved);
    let changed = false;
    for (const [index, source] of params.source.entries()) {
      const patch = patchResolvedSecretRefLeaves({
        current: next[index],
        source,
        resolved: params.resolved[index],
        defaults: params.defaults,
      });
      if (patch.changed) {
        next[index] = patch.value;
        changed = true;
      }
    }
    return {
      changed,
      value: changed ? next : params.current,
    };
  }
  if (isRecord(params.source) && isRecord(params.resolved)) {
    const next = isRecord(params.current)
      ? { ...params.current }
      : structuredClone(params.resolved);
    let changed = false;
    for (const [key, source] of Object.entries(params.source)) {
      const patch = patchResolvedSecretRefLeaves({
        current: next[key],
        source,
        resolved: params.resolved[key],
        defaults: params.defaults,
      });
      if (patch.changed) {
        next[key] = patch.value;
        changed = true;
      }
    }
    return {
      changed,
      value: changed ? next : params.current,
    };
  }
  return {
    changed: false,
    value: params.current,
  };
}
function selectProviderAuthConfig(config) {
  return {
    ...(config.secrets === void 0 ? {} : { secrets: config.secrets }),
    ...(config.models === void 0 ? {} : { models: config.models }),
  };
}
function createSecretsRuntimeSnapshotActivation(snapshot) {
  return {
    snapshot,
    refreshContext: getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot) ??
      getActiveSecretsRuntimeRefreshContext() ?? {
        env: { ...process.env },
        explicitAgentDirs: null,
        includeAuthStoreRefs: snapshot.authStores.length > 0,
        loadAuthStore: loadAuthProfileStoreForSecretsRuntime,
        loadablePluginOrigins: /* @__PURE__ */ new Map(),
      },
    refreshHandler: {
      preflight: preflightActiveSecretsRuntimeSnapshotRefresh,
      refresh: refreshActiveSecretsRuntimeSnapshotForConfig,
    },
  };
}
/** Refresh provider credentials without republishing transport-owned config. */
async function refreshActiveProviderAuthRuntimeSnapshot() {
  for (;;) {
    const activeSnapshot = getActiveSecretsRuntimeSnapshot$1();
    if (!activeSnapshot) return false;
    const providerAuthConfig = selectProviderAuthConfig(activeSnapshot.sourceConfig);
    const candidate = await prepareActiveSecretsRuntimeRefresh(
      activeSnapshot.sourceConfig,
      void 0,
      providerAuthConfig,
    );
    if (!candidate) return false;
    const runtimeConfig = getRuntimeConfigSnapshot();
    if (!runtimeConfig) return false;
    const config = { ...runtimeConfig };
    const modelsPatch = patchResolvedSecretRefLeaves({
      current: runtimeConfig.models,
      source: providerAuthConfig.models,
      resolved: candidate.snapshot.config.models,
      defaults: activeSnapshot.sourceConfig.secrets?.defaults,
    });
    if (modelsPatch.changed) config.models = modelsPatch.value;
    if (
      activateSecretsRuntimeSnapshotIfCurrent(
        {
          ...activeSnapshot,
          config,
          authStores: candidate.snapshot.authStores,
          authStoreCredentialsRevision: candidate.snapshot.authStoreCredentialsRevision,
        },
        candidate.expectedRevision,
        { preserveActivationLineage: true },
      )
    )
      return true;
  }
}
function getActiveSecretsRuntimeSnapshot() {
  return getActiveSecretsRuntimeSnapshot$1();
}
function getActiveSecretsRuntimeSnapshotRevision() {
  return getActiveSecretsRuntimeSnapshotRevision$1();
}
function getActiveSecretsRuntimeEnv() {
  return getActiveSecretsRuntimeEnv$1();
}
function getActiveRuntimeWebToolsMetadata() {
  return getActiveRuntimeWebToolsMetadata$1();
}
function clearSecretsRuntimeSnapshot() {
  clearSecretsRuntimeSnapshot$1();
}
//#endregion
export {
  getActiveSecretsRuntimeEnv as a,
  preflightActiveSecretsRuntimeSnapshotRefresh as c,
  refreshActiveSecretsRuntimeSnapshotForConfig as d,
  restoreSecretsRuntimeSnapshotIfCurrent as f,
  getActiveRuntimeWebToolsMetadata as i,
  prepareSecretsRuntimeSnapshot as l,
  activateSecretsRuntimeSnapshotIfCurrent as n,
  getActiveSecretsRuntimeSnapshot as o,
  clearSecretsRuntimeSnapshot as r,
  getActiveSecretsRuntimeSnapshotRevision as s,
  activateSecretsRuntimeSnapshot as t,
  refreshActiveProviderAuthRuntimeSnapshot as u,
};
