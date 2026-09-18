import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CQ0NgfBE.js";
import { n as attachPluginApiFacades, t as buildPluginApi } from "./api-builder-B6HcSqZf.js";
import { n as inspectBundleMcpRuntimeSupport } from "./bundle-mcp-CS3Kv3z-.js";
import "./utils-DtcDeqWS.js";
import {
  c as clearPluginCommands,
  f as listRegisteredPluginCommands,
  m as restorePluginCommands,
} from "./command-registration-CTCK5hi-.js";
import { o as createConfigRuntimeEnv } from "./config-env-vars-CwdMUFhk.js";
import {
  c as normalizePluginsConfig,
  f as resolveMemorySlotDecision,
  l as resolveEffectiveEnableState,
  n as createPluginActivationSource,
  t as applyTestPluginDefaults,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import "./boundary-file-read-CBe_wA_B.js";
import {
  c as hasExplicitPluginIdScope,
  d as serializePluginIdScope,
  f as fingerprintPluginDiscoveryContext,
  m as resolvePluginDiscoveryContext,
  s as createPluginIdScopeSet,
  u as normalizePluginIdScope,
} from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import "./json-files-CTWRDHag.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import {
  a as restoreDetachedTaskLifecycleRuntimeRegistration,
  n as getDetachedTaskLifecycleRuntimeRegistration,
  t as clearDetachedTaskLifecycleRuntimeRegistration,
} from "./detached-task-runtime-state-BrJUgd0A.js";
import {
  n as resolveOpenClawDevSourceRoot,
  t as isBundledPluginInsideDevSourceRoot,
} from "./dev-source-root-CqCwQZ8r.js";
import "./path-safety-4zNHq1Ot.js";
import { n as discoverOpenClawPlugins } from "./discovery-Df2IhoW5.js";
import {
  K as resolveMemoryDreamingConfig,
  q as resolveMemoryDreamingPluginConfig,
  v as DEFAULT_MEMORY_DREAMING_PLUGIN_ID,
} from "./dreaming-CM8RB1ct.js";
import { r as resolveConfigEnvVars } from "./env-substitution-BDfwDlDU.js";
import {
  C as restoreRegisteredEmbeddingProviders,
  x as listRegisteredEmbeddingProviders,
  y as clearEmbeddingProviders,
} from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-BNUEpDI2.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { i as initializeGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { u as collectPluginManifestCompatCodes } from "./installed-plugin-index-lBfkb-7L.js";
import { n as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  c as restorePluginInteractiveHandlers,
  r as listPluginInteractiveHandlers,
  t as clearPluginInteractiveHandlers,
} from "./interactive-registry-BnOxEacm.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import {
  a as resolveSetupChannelRegistration,
  i as resolveBundledRuntimeChannelRegistration,
  n as loadBundledRuntimeChannelPlugin,
  o as shouldDeferConfiguredChannelFullRuntimeMerge,
  r as mergeSetupRuntimeChannelPlugin,
  s as shouldLoadChannelPluginInSetupRuntime,
  t as channelPluginIdBelongsToManifest,
} from "./loader-channel-setup-6cs4isHN.js";
import {
  a as resolveManifestOwnerBasePolicyBlock,
  t as hasExplicitManifestOwnerTrust,
} from "./manifest-owner-policy-Bl1TJHcS.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import "./installed-plugin-index-records-BP7rp3ti.js";
import "./env-vars-D5-q5cD2.js";
import {
  c as listMemoryPromptSupplements,
  g as restoreMemoryPluginState,
  n as clearMemoryPluginState,
  r as getMemoryCapabilityRegistration,
  s as listMemoryCorpusSupplements,
} from "./memory-state-z9GGEQiO.js";
import { t as unwrapDefaultModuleExport } from "./module-export-DsZgGIbX.js";
import { f as safeRealpathSync, i as isPathInside, p as safeStatSync } from "./path-DILYn_gk.js";
import { t as PluginLruCache } from "./plugin-cache-primitives-BaxqicKH.js";
import { i as withProfile } from "./plugin-load-profile-Dw-hJkNg.js";
import {
  n as getCachedPluginModuleLoader,
  o as installOpenClawPluginSdkNativeResolver,
  t as createPluginModuleLoaderCache,
  u as toSafeImportPath,
} from "./plugin-module-loader-cache-CDpLvLFE.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import {
  E as listRegisteredMemoryEmbeddingProviders,
  M as restoreRegisteredCompactionProviders,
  O as restoreRegisteredMemoryEmbeddingProviders,
  S as clearMemoryEmbeddingProviders,
  j as listRegisteredCompactionProviders,
  k as clearCompactionProviders,
  t as createPluginRegistry,
} from "./registry-B14M_H8G.js";
import {
  i as listRegisteredAgentHarnesses,
  s as restoreRegisteredAgentHarnesses,
  t as clearAgentHarnesses,
} from "./registry-ef8V3P8D.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import {
  D as setActivePluginRegistry,
  O as createEmptyPluginRegistry,
  c as getActivePluginRegistry,
  f as getActivePluginRuntimeSubagentMode,
  l as getActivePluginRegistryKey,
  v as recordImportedPluginId,
} from "./runtime-CcYnX0B4.js";
import { t as validateJsonSchemaValue } from "./schema-validator-BAYKPBuJ.js";
import {
  c as resolvePluginRuntimeModulePathWithDiagnostics,
  t as buildPluginLoaderAliasMap,
} from "./sdk-alias-huj8Ygt2.js";
import { i as kindsEqual, r as hasKind } from "./slots-kpL659LX.js";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/plugins/api-lifecycle.ts
const PLUGIN_API_METHOD_POLICIES = {
  emitAgentEvent: {
    phase: "runtime",
    lateCallable: true,
  },
  sendSessionAttachment: {
    phase: "runtime",
    lateCallable: true,
  },
  scheduleSessionTurn: {
    phase: "runtime",
    lateCallable: true,
  },
  unscheduleSessionTurnsByTag: {
    phase: "runtime",
    lateCallable: true,
  },
};
/** Returns lifecycle policy for one plugin API method name. */
function getPluginApiMethodLifecyclePolicy(methodName) {
  return PLUGIN_API_METHOD_POLICIES[methodName];
}
/** True when a plugin API method remains callable after registration. */
function isLateCallablePluginApiMethod(methodName) {
  return getPluginApiMethodLifecyclePolicy(methodName)?.lateCallable === true;
}
//#endregion
//#region src/plugins/loader-cache-state.ts
/** Cache state helper for plugin loader registries, in-flight loads, and warning suppression. */
/** Error thrown when one plugin registry cache key attempts nested loading. */
var PluginLoadReentryError = class extends Error {
  constructor(cacheKey) {
    super(`plugin load reentry detected for cache key: ${cacheKey}`);
    this.name = "PluginLoadReentryError";
    this.cacheKey = cacheKey;
  }
};
/** Small registry cache with reentry detection and per-key warning memory. */
var PluginLoaderCacheState = class {
  #registryCache;
  #inFlightLoads = /* @__PURE__ */ new Set();
  #openAllowlistWarningCache = /* @__PURE__ */ new Set();
  constructor(defaultMaxEntries) {
    this.#registryCache = new PluginLruCache(defaultMaxEntries);
  }
  get maxEntries() {
    return this.#registryCache.maxEntries;
  }
  setMaxEntriesForTest(value) {
    this.#registryCache.setMaxEntriesForTest(value);
  }
  clear() {
    this.#registryCache.clear();
    this.#inFlightLoads.clear();
    this.#openAllowlistWarningCache.clear();
  }
  clearCachedRegistries() {
    this.#registryCache.clear();
    this.#openAllowlistWarningCache.clear();
  }
  get(cacheKey) {
    return this.#registryCache.get(cacheKey);
  }
  set(cacheKey, state) {
    this.#registryCache.set(cacheKey, state);
  }
  isLoadInFlight(cacheKey) {
    return this.#inFlightLoads.has(cacheKey);
  }
  beginLoad(cacheKey) {
    if (this.#inFlightLoads.has(cacheKey)) throw new PluginLoadReentryError(cacheKey);
    this.#inFlightLoads.add(cacheKey);
  }
  finishLoad(cacheKey) {
    this.#inFlightLoads.delete(cacheKey);
  }
  hasOpenAllowlistWarning(cacheKey) {
    return this.#openAllowlistWarningCache.has(cacheKey);
  }
  recordOpenAllowlistWarning(cacheKey) {
    this.#openAllowlistWarningCache.add(cacheKey);
  }
};
//#endregion
//#region src/plugins/loader-cache-instances.ts
const MAX_PLUGIN_REGISTRY_CACHE_ENTRIES = 128;
const pluginLoaderCacheInstances = {
  scoped: new PluginLoaderCacheState(MAX_PLUGIN_REGISTRY_CACHE_ENTRIES),
  fullWorkspace: new PluginLoaderCacheState(MAX_PLUGIN_REGISTRY_CACHE_ENTRIES),
};
//#endregion
//#region src/plugins/loader-provenance.ts
function createPathMatcher() {
  return {
    exact: /* @__PURE__ */ new Set(),
    dirs: [],
  };
}
function addPathToMatcher(matcher, rawPath, env = process.env) {
  const trimmed = rawPath.trim();
  if (!trimmed) return;
  const resolved = resolveUserPath(trimmed, env);
  if (!resolved) return;
  const canonical = safeRealpathSync(resolved) ?? resolved;
  if (matcher.exact.has(canonical) || matcher.dirs.includes(canonical)) return;
  if (safeStatSync(canonical)?.isDirectory()) {
    matcher.dirs.push(canonical);
    return;
  }
  matcher.exact.add(canonical);
}
function matchesPathMatcher(matcher, sourcePath) {
  if (matcher.exact.has(sourcePath)) return true;
  return matcher.dirs.some((dirPath) => isPathInside(dirPath, sourcePath));
}
function formatPluginInspectCommand(pluginId) {
  return `openclaw plugins inspect ${quoteCliArg(pluginId)}`;
}
/** Builds provenance matchers from configured load paths and install records. */
function buildProvenanceIndex(params) {
  const loadPathMatcher = createPathMatcher();
  for (const loadPath of params.normalizedLoadPaths)
    addPathToMatcher(loadPathMatcher, loadPath, params.env);
  const installRules = /* @__PURE__ */ new Map();
  const installs =
    params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
  for (const [pluginId, install] of Object.entries(installs)) {
    const rule = {
      trackedWithoutPaths: false,
      matcher: createPathMatcher(),
    };
    const trackedPaths = normalizeTrimmedStringList([install.installPath, install.sourcePath]);
    if (trackedPaths.length === 0) rule.trackedWithoutPaths = true;
    else
      for (const trackedPath of trackedPaths)
        addPathToMatcher(rule.matcher, trackedPath, params.env);
    installRules.set(pluginId, rule);
  }
  return {
    loadPathMatcher,
    installRules,
  };
}
function isTrackedByProvenance(params) {
  const sourcePath = resolveUserPath(params.source, params.env);
  const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
  const installRule = params.index.installRules.get(params.pluginId);
  if (installRule) {
    if (installRule.trackedWithoutPaths) return true;
    if (matchesPathMatcher(installRule.matcher, canonicalSourcePath)) return true;
  }
  return matchesPathMatcher(params.index.loadPathMatcher, canonicalSourcePath);
}
function matchesExplicitInstallRule(params) {
  const sourcePath = resolveUserPath(params.source, params.env);
  const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
  const installRule = params.index.installRules.get(params.pluginId);
  if (!installRule || installRule.trackedWithoutPaths) return false;
  return matchesPathMatcher(installRule.matcher, canonicalSourcePath);
}
function resolveCandidateDuplicateRank(params) {
  const pluginId = params.manifestByRoot.get(params.candidate.rootDir)?.id;
  const isExplicitInstall =
    params.candidate.origin === "global" &&
    pluginId !== void 0 &&
    matchesExplicitInstallRule({
      pluginId,
      source: params.candidate.source,
      index: params.provenance,
      env: params.env,
    });
  if (params.candidate.origin === "config") return 0;
  if (
    params.candidate.origin === "bundled" &&
    isBundledPluginInsideDevSourceRoot({
      rootDir: params.candidate.rootDir,
      env: params.env,
    })
  )
    return 1;
  if (params.candidate.origin === "global" && isExplicitInstall) return 2;
  if (params.candidate.origin === "bundled") return 3;
  if (params.candidate.origin === "workspace") return 4;
  return 5;
}
/** Orders duplicate plugin candidates by configured, installed, bundled, then workspace trust. */
function compareDuplicateCandidateOrder(params) {
  const leftPluginId = params.manifestByRoot.get(params.left.rootDir)?.id;
  const rightPluginId = params.manifestByRoot.get(params.right.rootDir)?.id;
  if (!leftPluginId || leftPluginId !== rightPluginId) return 0;
  return (
    resolveCandidateDuplicateRank({
      candidate: params.left,
      manifestByRoot: params.manifestByRoot,
      provenance: params.provenance,
      env: params.env,
    }) -
    resolveCandidateDuplicateRank({
      candidate: params.right,
      manifestByRoot: params.manifestByRoot,
      provenance: params.provenance,
      env: params.env,
    })
  );
}
/** Warns when an open plugin allowlist may auto-load non-bundled plugins. */
function warnWhenAllowlistIsOpen(params) {
  if (!params.emitWarning) return;
  if (!params.pluginsEnabled) return;
  const autoDiscoverable = params.discoverablePlugins.filter(
    (entry) =>
      (entry.origin === "workspace" || entry.origin === "global") &&
      !params.explicitlyEnabledPluginIds?.has(entry.id),
  );
  if (autoDiscoverable.length === 0) return;
  const allDiscoveredIds = new Set(params.discoverablePlugins.map((entry) => entry.id));
  const hasConfiguredAllowlist = params.allow.length > 0;
  const allowHasDiscoveredMatch = params.allow.some((id) => allDiscoveredIds.has(id));
  if (hasConfiguredAllowlist && allowHasDiscoveredMatch) return;
  if (params.warningCache.hasOpenAllowlistWarning(params.warningCacheKey)) return;
  const preview = autoDiscoverable
    .slice(0, 6)
    .map((entry) => `${entry.id} (${entry.source})`)
    .join(", ");
  const truncated = autoDiscoverable.length > 6;
  const extra = truncated ? ` (+${autoDiscoverable.length - 6} more)` : "";
  const inspectCommands = autoDiscoverable
    .map((entry) => `'${formatPluginInspectCommand(entry.id)}'`)
    .join(", ");
  const remediation = truncated
    ? "Run 'openclaw plugins list --enabled --verbose' to enumerate every discovered plugin id, inspect trusted ids with 'openclaw plugins inspect <id>', and add the ones you trust to plugins.allow in openclaw.json."
    : `To trust them explicitly, set plugins.allow in openclaw.json (e.g. "plugins": { "allow": [${autoDiscoverable.map((entry) => JSON.stringify(entry.id)).join(", ")}] }). Run 'openclaw plugins list --enabled --verbose' or ${inspectCommands} to confirm plugin ids.`;
  params.warningCache.recordOpenAllowlistWarning(params.warningCacheKey);
  if (!hasConfiguredAllowlist) {
    params.logger.warn(
      `[plugins] plugins.allow is empty; discovered non-bundled plugins may auto-load: ${preview}${extra}. ${remediation}`,
    );
    return;
  }
  const unmatchedEntries = params.allow.filter((id) => !allDiscoveredIds.has(id));
  const unmatchedPreview = unmatchedEntries
    .slice(0, 6)
    .map((id) => `"${id}"`)
    .join(", ");
  const unmatchedExtra =
    unmatchedEntries.length > 6 ? ` (+${unmatchedEntries.length - 6} more)` : "";
  params.logger.warn(
    `[plugins] plugins.allow entries ${unmatchedPreview}${unmatchedExtra} do not match any discovered plugin ids; discovered non-bundled plugins: ${preview}${extra}. Use the plugin id (not a channel id or npm package name).`,
  );
}
/** Adds diagnostics for loaded plugins without install or load-path provenance. */
function warnAboutUntrackedLoadedPlugins(params) {
  const allowSet = new Set(params.allowlist);
  for (const plugin of params.registry.plugins) {
    if (plugin.status !== "loaded" || plugin.origin === "bundled") continue;
    if (allowSet.has(plugin.id)) continue;
    if (
      isTrackedByProvenance({
        pluginId: plugin.id,
        source: plugin.source,
        index: params.provenance,
        env: params.env,
      })
    )
      continue;
    const message = `loaded without install/load-path provenance; treat as untracked local code. Verify source with '${formatPluginInspectCommand(plugin.id)}', then pin trust via plugins.allow (e.g. "plugins": { "allow": [${JSON.stringify(plugin.id)}] }) or reinstall from a trusted source so OpenClaw records install provenance.`;
    params.registry.diagnostics.push({
      level: "warn",
      pluginId: plugin.id,
      source: plugin.source,
      message,
    });
    if (params.emitWarning)
      params.logger.warn(`[plugins] ${plugin.id}: ${message} (${plugin.source})`);
  }
}
//#endregion
//#region src/plugins/loader-records.ts
/** Converts loaded plugin registries into stable plugin records for status and diagnostics. */
/** Builds the registry record shape shared by plugin loading, status, and diagnostics. */
function createPluginRecord(params) {
  return {
    id: params.id,
    name: params.name ?? params.id,
    description: params.description,
    version: params.version,
    packageName: params.packageName,
    format: params.format ?? "openclaw",
    bundleFormat: params.bundleFormat,
    bundleCapabilities: params.bundleCapabilities,
    source: params.source,
    rootDir: params.rootDir,
    origin: params.origin,
    workspaceDir: params.workspaceDir,
    trustedOfficialInstall: params.trustedOfficialInstall,
    enabled: params.enabled,
    compat: params.compat,
    explicitlyEnabled: params.activationState?.explicitlyEnabled,
    activated: params.activationState?.activated,
    activationSource: params.activationState?.source,
    activationReason: params.activationState?.reason,
    syntheticAuthRefs: params.syntheticAuthRefs ?? [],
    status: params.enabled ? "loaded" : "disabled",
    toolNames: [],
    hookNames: [],
    channelIds: [...(params.channelIds ?? [])],
    cliBackendIds: [],
    providerIds: [...(params.providerIds ?? [])],
    embeddingProviderIds: [...(params.contracts?.embeddingProviders ?? [])],
    speechProviderIds: [...(params.contracts?.speechProviders ?? [])],
    realtimeTranscriptionProviderIds: [...(params.contracts?.realtimeTranscriptionProviders ?? [])],
    realtimeVoiceProviderIds: [...(params.contracts?.realtimeVoiceProviders ?? [])],
    mediaUnderstandingProviderIds: [...(params.contracts?.mediaUnderstandingProviders ?? [])],
    transcriptSourceProviderIds: [...(params.contracts?.transcriptSourceProviders ?? [])],
    imageGenerationProviderIds: [...(params.contracts?.imageGenerationProviders ?? [])],
    videoGenerationProviderIds: [...(params.contracts?.videoGenerationProviders ?? [])],
    musicGenerationProviderIds: [...(params.contracts?.musicGenerationProviders ?? [])],
    webFetchProviderIds: [...(params.contracts?.webFetchProviders ?? [])],
    webSearchProviderIds: [...(params.contracts?.webSearchProviders ?? [])],
    migrationProviderIds: [...(params.contracts?.migrationProviders ?? [])],
    contextEngineIds: [],
    memoryEmbeddingProviderIds: [...(params.contracts?.memoryEmbeddingProviders ?? [])],
    agentHarnessIds: [],
    cliCommands: [],
    services: [],
    gatewayDiscoveryServiceIds: [],
    commands: [],
    httpRoutes: 0,
    hookCount: 0,
    configSchema: params.configSchema,
    configUiHints: void 0,
    configJsonSchema: void 0,
    contracts: params.contracts,
  };
}
/** Marks a discovered plugin inactive without discarding its metadata record. */
function markPluginActivationDisabled(record, reason) {
  record.activated = false;
  record.activationSource = "disabled";
  record.activationReason = reason;
}
/** Joins auto-enable reasons into the single registry field shown by status surfaces. */
function formatAutoEnabledActivationReason(reasons) {
  if (!reasons || reasons.length === 0) return;
  return reasons.join("; ");
}
/** Records a loader failure in the registry, diagnostics list, and operator log consistently. */
function recordPluginError(params) {
  const errorText =
    process.env.OPENCLAW_PLUGIN_LOADER_DEBUG_STACKS === "1" &&
    params.error instanceof Error &&
    typeof params.error.stack === "string"
      ? params.error.stack
      : String(params.error);
  const deprecatedApiHint =
    errorText.includes("api.registerHttpHandler") && errorText.includes("is not a function")
      ? "deprecated api.registerHttpHandler(...) was removed; use api.registerHttpRoute(...) for plugin-owned routes or registerPluginHttpRoute(...) for dynamic lifecycle routes"
      : null;
  const displayError = deprecatedApiHint ? `${deprecatedApiHint} (${errorText})` : errorText;
  params.logger.error(`${params.logPrefix}${displayError}`);
  params.record.status = "error";
  params.record.error = displayError;
  params.record.failedAt = /* @__PURE__ */ new Date();
  params.record.failurePhase = params.phase;
  params.registry.plugins.push(params.record);
  params.seenIds.set(params.pluginId, params.origin);
  params.registry.diagnostics.push({
    level: "error",
    pluginId: params.record.id,
    source: params.record.source,
    message: `${params.diagnosticMessagePrefix}${displayError}`,
    ...(params.diagnosticCode ? { code: params.diagnosticCode } : {}),
  });
}
/** Groups failed plugin ids by loader phase for compact startup summaries. */
function formatPluginFailureSummary(failedPlugins) {
  const grouped = /* @__PURE__ */ new Map();
  for (const plugin of failedPlugins) {
    const phase = plugin.failurePhase ?? "load";
    const ids = grouped.get(phase);
    if (ids) {
      ids.push(plugin.id);
      continue;
    }
    grouped.set(phase, [plugin.id]);
  }
  return [...grouped.entries()].map(([phase, ids]) => `${phase}: ${ids.join(", ")}`).join("; ");
}
function isPluginLoadDebugEnabled(env) {
  const normalized = normalizeLowercaseStringOrEmpty(env.OPENCLAW_PLUGIN_LOAD_DEBUG);
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
function describePluginModuleExportShape(
  value,
  label = "export",
  seen = /* @__PURE__ */ new Set(),
) {
  if (value === null) return [`${label}:null`];
  if (typeof value !== "object") return [`${label}:${typeof value}`];
  if (seen.has(value)) return [`${label}:circular`];
  seen.add(value);
  const record = value;
  const keys = Object.keys(record).toSorted();
  const visibleKeys = keys.slice(0, 8);
  const extraCount = keys.length - visibleKeys.length;
  const details = [
    `${label}:object keys=${visibleKeys.length > 0 ? `${visibleKeys.join(",")}${extraCount > 0 ? `,+${extraCount}` : ""}` : "none"}`,
  ];
  for (const key of ["default", "module", "register", "activate"])
    if (Object.hasOwn(record, key))
      details.push(...describePluginModuleExportShape(record[key], `${label}.${key}`, seen));
  return details;
}
function formatMissingPluginRegisterError(moduleExport, env) {
  const message = "plugin export missing register/activate";
  if (!isPluginLoadDebugEnabled(env)) return message;
  return `${message} (module shape: ${describePluginModuleExportShape(moduleExport).join("; ")})`;
}
//#endregion
//#region src/plugins/plugin-registration-transaction.ts
function snapshotPluginProcessGlobalState() {
  return {
    agentHarnesses: listRegisteredAgentHarnesses(),
    commands: listRegisteredPluginCommands(),
    compactionProviders: listRegisteredCompactionProviders(),
    detachedTaskRuntimeRegistration: getDetachedTaskLifecycleRuntimeRegistration(),
    embeddingProviders: listRegisteredEmbeddingProviders(),
    interactiveHandlers: listPluginInteractiveHandlers(),
    memoryCapability: getMemoryCapabilityRegistration(),
    memoryCorpusSupplements: listMemoryCorpusSupplements(),
    memoryEmbeddingProviders: listRegisteredMemoryEmbeddingProviders(),
    memoryPromptSupplements: listMemoryPromptSupplements(),
  };
}
function restorePluginProcessGlobalState(state) {
  restoreRegisteredAgentHarnesses(state.agentHarnesses);
  restorePluginCommands(state.commands);
  restoreRegisteredCompactionProviders(state.compactionProviders);
  restoreDetachedTaskLifecycleRuntimeRegistration(state.detachedTaskRuntimeRegistration);
  restoreRegisteredEmbeddingProviders(state.embeddingProviders);
  restorePluginInteractiveHandlers(state.interactiveHandlers);
  restoreRegisteredMemoryEmbeddingProviders(state.memoryEmbeddingProviders);
  restoreMemoryPluginState({
    capability: state.memoryCapability,
    corpusSupplements: state.memoryCorpusSupplements,
    promptSupplements: state.memoryPromptSupplements,
  });
}
function snapshotPluginRegistry(registry) {
  return Object.fromEntries(
    Object.entries(registry).map(([key, value]) => {
      if (Array.isArray(value)) return [key, [...value]];
      if (value instanceof Map) return [key, new Map(value)];
      if (value && typeof value === "object") return [key, { ...value }];
      return [key, value];
    }),
  );
}
function restorePluginRegistry(registry, snapshot) {
  Object.assign(registry, snapshot);
}
function createPluginRegistrationTransaction(params) {
  const registrySnapshot = snapshotPluginRegistry(params.registry);
  const processGlobalState = snapshotPluginProcessGlobalState();
  let settled = false;
  const settle = (action) => {
    if (settled) return;
    action();
    settled = true;
  };
  return {
    commit: ({ activate }) => {
      settle(() => {
        if (!activate) restorePluginProcessGlobalState(processGlobalState);
      });
    },
    rollback: () => {
      settle(() => {
        params.rollbackGlobalSideEffects?.();
        restorePluginRegistry(params.registry, registrySnapshot);
        restorePluginProcessGlobalState(processGlobalState);
      });
    },
  };
}
//#endregion
//#region src/plugins/plugin-runtime-artifact-resolution.ts
/** Resolves the exact root and entry selected by the plugin runtime loader. */
function safeRealpathOrResolve$1(value) {
  try {
    return fs.realpathSync(value);
  } catch {
    return path.resolve(value);
  }
}
/** Canonical packaged runtime replaces staging-only dist-runtime artifacts. */
function resolveCanonicalDistRuntimeSource(source) {
  const marker = `${path.sep}dist-runtime${path.sep}extensions${path.sep}`;
  const index = source.indexOf(marker);
  if (index === -1) return source;
  const candidate = `${source.slice(0, index)}${path.sep}dist${path.sep}extensions${path.sep}${source.slice(index + marker.length)}`;
  return fs.existsSync(candidate) ? candidate : source;
}
function rewriteBundledRuntimeArtifactRelativePath(relativePath) {
  return relativePath.replace(/\.[^.]+$/u, ".js");
}
function listPackageLocalRuntimeArtifactOutputExtensions(sourceExt) {
  switch (sourceExt) {
    case ".mts":
    case ".mjs":
      return [".mjs", ".js", ".cjs"];
    case ".cts":
    case ".cjs":
      return [".cjs", ".js", ".mjs"];
    default:
      return [".js", ".mjs", ".cjs"];
  }
}
function listPackageLocalRuntimeArtifactRelativePathBases(relativePath) {
  const ext = path.extname(relativePath).toLowerCase();
  const withoutExt = ext ? relativePath.slice(0, -ext.length) : relativePath;
  if (!withoutExt.startsWith(`src${path.sep}`) && !withoutExt.startsWith("src/"))
    return [withoutExt];
  return [withoutExt.slice(4), withoutExt];
}
function listPackageLocalDistRuntimeArtifactRelativePaths(relativePath) {
  const ext = path.extname(relativePath).toLowerCase();
  const candidates = /* @__PURE__ */ new Set();
  for (const base of listPackageLocalRuntimeArtifactRelativePathBases(relativePath))
    for (const outputExt of listPackageLocalRuntimeArtifactOutputExtensions(ext))
      candidates.add(`${base}${outputExt}`);
  return [...candidates];
}
function shouldPreferPackageLocalDistRuntimeArtifact(source) {
  switch (path.extname(source).toLowerCase()) {
    case ".ts":
    case ".tsx":
    case ".mts":
    case ".cts":
      return true;
    default:
      return false;
  }
}
function resolvePackageLocalDistRuntimeArtifact(params) {
  const relativeSource = path.relative(params.rootDir, params.source);
  if (
    !shouldPreferPackageLocalDistRuntimeArtifact(relativeSource) ||
    relativeSource === "" ||
    relativeSource.startsWith("..") ||
    path.isAbsolute(relativeSource)
  )
    return null;
  const artifactRoot = path.join(params.rootDir, "dist");
  for (const artifactRelativePath of listPackageLocalDistRuntimeArtifactRelativePaths(
    relativeSource,
  )) {
    const artifactSource = path.join(artifactRoot, artifactRelativePath);
    if (fs.existsSync(artifactSource)) return safeRealpathOrResolve$1(artifactSource);
  }
  return null;
}
function resolvePreferredBuiltRuntimeArtifact(params) {
  const rootDir = safeRealpathOrResolve$1(params.rootDir);
  const source = safeRealpathOrResolve$1(params.source);
  if (!params.preferBuiltPluginArtifacts)
    return {
      source,
      rootDir,
    };
  if (params.origin !== "bundled") {
    const artifactSource = resolvePackageLocalDistRuntimeArtifact({
      source,
      rootDir,
    });
    if (artifactSource)
      return {
        source: artifactSource,
        rootDir,
      };
    return {
      source,
      rootDir,
    };
  }
  if (params.packageManifest?.build?.bundledDist === false)
    return {
      source,
      rootDir,
    };
  const packageLocalArtifactSource = resolvePackageLocalDistRuntimeArtifact({
    source,
    rootDir,
  });
  if (packageLocalArtifactSource)
    return {
      source: packageLocalArtifactSource,
      rootDir,
    };
  const extensionsDir = path.dirname(rootDir);
  if (path.basename(extensionsDir) !== "extensions")
    return {
      source,
      rootDir,
    };
  const packageRoot = path.dirname(extensionsDir);
  if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime")
    return {
      source,
      rootDir,
    };
  const relativeSource = path.relative(rootDir, source);
  if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource))
    return {
      source,
      rootDir,
    };
  const artifactRelativePath = rewriteBundledRuntimeArtifactRelativePath(relativeSource);
  for (const artifactRootName of ["dist-runtime", "dist"]) {
    const artifactRoot = path.join(
      packageRoot,
      artifactRootName,
      "extensions",
      path.basename(rootDir),
    );
    const artifactSource = path.join(artifactRoot, artifactRelativePath);
    if (fs.existsSync(artifactSource))
      return {
        source: safeRealpathOrResolve$1(artifactSource),
        rootDir: safeRealpathOrResolve$1(artifactRoot),
      };
  }
  return {
    source,
    rootDir,
  };
}
/** Applies both loader selection phases in their runtime order. */
function resolvePluginRuntimeArtifact(params) {
  const preferred = resolvePreferredBuiltRuntimeArtifact(params);
  return {
    source: resolveCanonicalDistRuntimeSource(preferred.source),
    rootDir: resolveCanonicalDistRuntimeSource(preferred.rootDir),
  };
}
//#endregion
//#region src/plugins/loader.ts
function detailPluginStartupTrace(startupTrace, pluginId, metrics) {
  startupTrace?.detail(
    `plugins.gateway-load.plugin.${encodeStartupTraceSegment(pluginId)}`,
    metrics,
  );
}
const CLI_METADATA_ENTRY_BASENAMES = [
  "cli-metadata.ts",
  "cli-metadata.js",
  "cli-metadata.mjs",
  "cli-metadata.cjs",
];
function resolveDreamingSidecarEngineId(params) {
  const normalizedMemorySlot = normalizeLowercaseStringOrEmpty(params.memorySlot);
  if (
    !normalizedMemorySlot ||
    normalizedMemorySlot === "none" ||
    normalizedMemorySlot === "memory-core"
  )
    return null;
  return resolveMemoryDreamingConfig({
    pluginConfig: resolveMemoryDreamingPluginConfig(params.cfg),
    cfg: params.cfg,
  }).enabled
    ? DEFAULT_MEMORY_DREAMING_PLUGIN_ID
    : null;
}
function resolveAuthorizedDreamingSidecar(params) {
  const engineId = resolveDreamingSidecarEngineId({
    cfg: params.cfg,
    memorySlot: params.memorySlot,
  });
  if (!engineId || !params.normalized.enabled || !params.activationSource.plugins.enabled)
    return null;
  const selectedMemoryPluginId = normalizeLowercaseStringOrEmpty(params.memorySlot);
  if (!selectedMemoryPluginId || selectedMemoryPluginId === engineId) return null;
  if (
    params.normalized.deny.includes(engineId) ||
    params.activationSource.plugins.deny.includes(engineId) ||
    params.normalized.entries[engineId]?.enabled === false ||
    params.activationSource.plugins.entries[engineId]?.enabled === false
  )
    return null;
  const selectedMemoryPlugin = params.manifestRegistry.plugins.find(
    (plugin) => plugin.id === selectedMemoryPluginId,
  );
  const sidecarPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === engineId);
  if (
    !selectedMemoryPlugin ||
    !sidecarPlugin ||
    !hasKind(selectedMemoryPlugin.kind, "memory") ||
    !hasKind(sidecarPlugin.kind, "memory")
  )
    return null;
  return resolveEffectiveEnableState({
    id: selectedMemoryPlugin.id,
    origin: selectedMemoryPlugin.origin,
    config: params.normalized,
    rootConfig: params.cfg,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedMemoryPlugin),
    activationSource: params.activationSource,
  }).enabled
    ? {
        engineId,
        selectedMemoryPluginId,
      }
    : null;
}
function isAuthorizedDreamingSidecarPlugin(params) {
  return params.sidecar?.engineId === params.pluginId;
}
function matchesScopedPluginOrDreamingSidecar(params) {
  if (
    matchesScopedPluginRequest({
      onlyPluginIdSet: params.onlyPluginIdSet,
      pluginId: params.pluginId,
    })
  )
    return true;
  return (
    params.pluginId === params.sidecar?.engineId &&
    params.onlyPluginIdSet?.has(params.sidecar.selectedMemoryPluginId) === true
  );
}
var PluginLoadFailureError = class extends Error {
  constructor(registry) {
    const failedPlugins = registry.plugins.filter((entry) => entry.status === "error");
    const summary = failedPlugins
      .map((entry) => `${entry.id}: ${entry.error ?? "unknown plugin load error"}`)
      .join("; ");
    super(`plugin load failed: ${summary}`);
    this.name = "PluginLoadFailureError";
    this.pluginIds = failedPlugins.map((entry) => entry.id);
    this.registry = registry;
  }
};
const { scoped: pluginLoaderCacheState, fullWorkspace: fullWorkspacePluginLoaderCacheState } =
  pluginLoaderCacheInstances;
const LAZY_RUNTIME_REFLECTION_KEYS = [
  "version",
  "gateway",
  "config",
  "agent",
  "subagent",
  "system",
  "media",
  "mediaUnderstanding",
  "tts",
  "stt",
  "channel",
  "events",
  "logging",
  "state",
  "modelAuth",
  "imageGeneration",
  "videoGeneration",
  "musicGeneration",
  "llm",
];
function createPluginCandidatesFromManifestRegistry(manifestRegistry) {
  return manifestRegistry.plugins.map((record) => ({
    idHint: record.id,
    rootDir: record.rootDir,
    source: record.source,
    ...(record.setupSource !== void 0 ? { setupSource: record.setupSource } : {}),
    origin: record.origin,
    ...(record.workspaceDir !== void 0 ? { workspaceDir: record.workspaceDir } : {}),
    ...(record.format !== void 0 ? { format: record.format } : {}),
    ...(record.bundleFormat !== void 0 ? { bundleFormat: record.bundleFormat } : {}),
    ...(record.packageManifest !== void 0 ? { packageManifest: record.packageManifest } : {}),
  }));
}
function clearActivatedPluginRuntimeState() {
  clearAgentHarnesses();
  clearPluginCommands();
  clearCompactionProviders();
  clearDetachedTaskLifecycleRuntimeRegistration();
  clearPluginInteractiveHandlers();
  clearEmbeddingProviders();
  clearMemoryEmbeddingProviders();
  clearMemoryPluginState();
}
function clearPluginRegistryLoadCache() {
  pluginLoaderCacheState.clearCachedRegistries();
  fullWorkspacePluginLoaderCacheState.clearCachedRegistries();
}
const defaultLogger = () => createSubsystemLogger("plugins");
function isPromiseLike(value) {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof value.then === "function"
  );
}
function createGuardedPluginRegistrationApi(api) {
  let closed = false;
  return {
    api: attachPluginApiFacades(
      new Proxy(api, {
        get(target, prop, receiver) {
          const value = Reflect.get(target, prop, receiver);
          if (typeof value !== "function") return value;
          if (typeof prop === "string" && isLateCallablePluginApiMethod(prop))
            return (...args) => Reflect.apply(value, target, args);
          return (...args) => {
            const isLateCallableMethod =
              typeof prop === "string" && isLateCallablePluginApiMethod(prop);
            if (closed && !isLateCallableMethod) return;
            return Reflect.apply(value, target, args);
          };
        },
      }),
    ),
    close: () => {
      closed = true;
    },
  };
}
function runPluginRegisterSync(register, api) {
  const guarded = createGuardedPluginRegistrationApi(api);
  try {
    const result = register(guarded.api);
    if (isPromiseLike(result)) {
      Promise.resolve(result).catch(() => {});
      throw new Error("plugin register must be synchronous");
    }
  } finally {
    guarded.close();
  }
}
function createPluginModuleLoader(options) {
  const moduleLoaders = createPluginModuleLoaderCache();
  const createLoaderForModule = (modulePath) => {
    installOpenClawPluginSdkNativeResolver({
      argv1: process.argv[1],
      moduleUrl: import.meta.url,
      pluginModulePath: modulePath,
      devSourceRoot: options.devSourceRoot,
      pluginSdkResolution: options.pluginSdkResolution,
    });
    return getCachedPluginModuleLoader({
      cache: moduleLoaders,
      modulePath,
      importerUrl: import.meta.url,
      loaderFilename: modulePath,
      devSourceRoot: options.devSourceRoot,
      aliasMap: buildPluginLoaderAliasMap(
        modulePath,
        process.argv[1],
        import.meta.url,
        options.pluginSdkResolution,
        options.devSourceRoot,
      ),
      pluginSdkResolution: options.pluginSdkResolution,
    });
  };
  return (modulePath) => createLoaderForModule(modulePath)(toSafeImportPath(modulePath));
}
function formatPluginRuntimeModuleResolutionError(params) {
  const { resolution } = params;
  const candidates = resolution.candidates.length > 0 ? resolution.candidates.join(", ") : "<none>";
  return [
    "Unable to resolve plugin runtime module",
    `loader=${resolution.modulePath ?? "<unresolved>"}`,
    `packageRoot=${resolution.packageRoot ?? "<none>"}`,
    `pluginSdkResolution=${params.pluginSdkResolution ?? "auto"}`,
    `candidates=${candidates}`,
    ...(resolution.error ? [`resolverError=${resolution.error}`] : []),
  ].join("; ");
}
function getPluginRegistryCache(onlyPluginIds) {
  return onlyPluginIds ? pluginLoaderCacheState : fullWorkspacePluginLoaderCacheState;
}
function getCachedPluginRegistry(cacheKey, onlyPluginIds) {
  return getPluginRegistryCache(onlyPluginIds).get(cacheKey);
}
function setCachedPluginRegistry(cacheKey, state, onlyPluginIds) {
  getPluginRegistryCache(onlyPluginIds).set(cacheKey, state);
}
function getReusableCachedPluginRegistry(params) {
  const exact = getCachedPluginRegistry(params.cacheKey, params.onlyPluginIds);
  if (exact)
    return {
      state: exact,
      cacheKey: params.cacheKey,
      runtimeSubagentMode: params.runtimeSubagentMode,
    };
  if (params.runtimeSubagentMode !== "default") return;
  const gatewayBindableContext = resolvePluginLoadCacheContext({
    ...params.options,
    runtimeOptions: {
      ...params.options.runtimeOptions,
      allowGatewaySubagentBinding: true,
    },
  });
  const gatewayBindable = getCachedPluginRegistry(
    gatewayBindableContext.cacheKey,
    gatewayBindableContext.onlyPluginIds,
  );
  if (!gatewayBindable) return;
  return {
    state: gatewayBindable,
    cacheKey: gatewayBindableContext.cacheKey,
    runtimeSubagentMode: gatewayBindableContext.runtimeSubagentMode,
  };
}
function resolveBundledPackageRootForCache(stockRoot) {
  if (!stockRoot) return;
  const resolved = path.resolve(stockRoot);
  const parent = path.dirname(resolved);
  if (
    path.basename(resolved) === "extensions" &&
    (path.basename(parent) === "dist" || path.basename(parent) === "dist-runtime")
  )
    return path.dirname(parent);
  const sourcePackageRoot = parent;
  if (fs.existsSync(path.join(sourcePackageRoot, "package.json"))) return sourcePackageRoot;
}
function readPackageVersionForCache(packageJsonPath) {
  const parsed = tryReadJsonSync(packageJsonPath);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "unknown";
  const version = parsed.version;
  return typeof version === "string" && version.trim() ? version.trim() : "unknown";
}
const bundledPackageCacheIdentityByStockRoot = /* @__PURE__ */ new Map();
function resolveBundledPackageCacheIdentity(stockRoot) {
  if (!stockRoot) return;
  const packageRoot = resolveBundledPackageRootForCache(stockRoot);
  if (!packageRoot) return;
  const stockRootKey = path.resolve(stockRoot);
  const cached = bundledPackageCacheIdentityByStockRoot.get(stockRootKey);
  if (cached) return cached;
  const packageJsonPath = path.join(packageRoot, "package.json");
  try {
    const stat = fs.statSync(packageJsonPath);
    const identity = {
      packageJson: safeRealpathOrResolve(packageJsonPath),
      packageRoot: safeRealpathOrResolve(packageRoot),
      packageVersion: readPackageVersionForCache(packageJsonPath),
      size: stat.size,
      mtimeMs: stat.mtimeMs,
    };
    bundledPackageCacheIdentityByStockRoot.set(stockRootKey, identity);
    return identity;
  } catch {
    const identity = {
      packageJson: path.resolve(packageJsonPath),
      packageRoot: safeRealpathOrResolve(packageRoot),
      packageVersion: "missing",
      size: -1,
      mtimeMs: -1,
    };
    bundledPackageCacheIdentityByStockRoot.set(stockRootKey, identity);
    return identity;
  }
}
function buildCacheKey(params) {
  const discoveryContext = resolvePluginDiscoveryContext({
    workspaceDir: params.workspaceDir,
    loadPaths: params.plugins.loadPaths,
    env: params.env,
  });
  const { roots, loadPaths } = discoveryContext;
  const bundledPackage = resolveBundledPackageCacheIdentity(roots.stock);
  const devSourceRoot = params.devSourceRoot ?? "";
  const installs = Object.fromEntries(
    Object.entries(params.installs ?? {}).map(([pluginId, install]) => [
      pluginId,
      {
        ...install,
        installPath:
          typeof install.installPath === "string"
            ? resolveUserPath(install.installPath, params.env)
            : install.installPath,
        sourcePath:
          typeof install.sourcePath === "string"
            ? resolveUserPath(install.sourcePath, params.env)
            : install.sourcePath,
      },
    ]),
  );
  const scopeKey = serializePluginIdScope(params.onlyPluginIds);
  const setupOnlyKey = params.includeSetupOnlyChannelPlugins === true ? "setup-only" : "runtime";
  const setupOnlyModeKey =
    params.forceSetupOnlyChannelPlugins === true ? "force-setup" : "normal-setup";
  const setupOnlyRequirementKey =
    params.requireSetupEntryForSetupOnlyChannelPlugins === true
      ? "require-setup-entry"
      : "allow-full-fallback";
  const startupChannelMode =
    params.forceFullRuntimeForChannelPlugins === true
      ? "force-full"
      : params.preferSetupRuntimeForChannelPlugins === true
        ? "prefer-setup"
        : "full";
  const bundledArtifactMode =
    params.preferBuiltPluginArtifacts === true ? "prefer-built-artifacts" : "source-default";
  const rawConfigEnvMode =
    params.resolveRawConfigEnvVars === true ? "resolve-raw-env" : "runtime-config";
  const moduleLoadMode = params.loadModules === false ? "manifest-only" : "load-modules";
  const discoveryMode = params.toolDiscovery === true ? "tool-discovery" : "default-discovery";
  const runtimeSubagentMode = params.runtimeSubagentMode ?? "default";
  const gatewayMethodsKey = JSON.stringify(params.coreGatewayMethodNames ?? []);
  const activationMode = params.activate === false ? "snapshot" : "active";
  return `${roots.workspace ?? ""}::${roots.global ?? ""}::${roots.stock ?? ""}::${JSON.stringify({
    bundledPackage,
    devSourceRoot,
    discoveryFingerprint: fingerprintPluginDiscoveryContext(discoveryContext),
    ...params.plugins,
    installs,
    loadPaths,
    activationMetadataKey: params.activationMetadataKey ?? "",
  })}::${scopeKey}::${setupOnlyKey}::${setupOnlyModeKey}::${setupOnlyRequirementKey}::${startupChannelMode}::${bundledArtifactMode}::${rawConfigEnvMode}::${moduleLoadMode}::${discoveryMode}::${runtimeSubagentMode}::${params.pluginSdkResolution ?? "auto"}::${gatewayMethodsKey}::${activationMode}`;
}
function matchesScopedPluginRequest(params) {
  const scopedIds = params.onlyPluginIdSet;
  if (!scopedIds) return true;
  return scopedIds.has(params.pluginId);
}
function resolveRuntimeSubagentMode(runtimeOptions) {
  if (runtimeOptions?.allowGatewaySubagentBinding === true) return "gateway-bindable";
  if (runtimeOptions?.subagent) return "explicit";
  return "default";
}
function buildActivationMetadataHash(params) {
  const enabledSourceChannels = Object.entries(params.activationSource.rootConfig?.channels ?? {})
    .filter(([, value]) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return false;
      return value.enabled === true;
    })
    .map(([channelId]) => channelId)
    .toSorted((left, right) => left.localeCompare(right));
  const pluginEntryStates = Object.entries(params.activationSource.plugins.entries)
    .map(([pluginId, entry]) => [pluginId, entry?.enabled ?? null])
    .toSorted(([left], [right]) => left.localeCompare(right));
  const autoEnableReasonEntries = Object.entries(params.autoEnabledReasons)
    .map(([pluginId, reasons]) => [pluginId, [...reasons]])
    .toSorted(([left], [right]) => left.localeCompare(right));
  return createHash("sha256")
    .update(
      JSON.stringify({
        enabled: params.activationSource.plugins.enabled,
        allow: params.activationSource.plugins.allow,
        deny: params.activationSource.plugins.deny,
        memorySlot: params.activationSource.plugins.slots.memory,
        entries: pluginEntryStates,
        enabledChannels: enabledSourceChannels,
        autoEnabledReasons: autoEnableReasonEntries,
      }),
    )
    .digest("hex");
}
function redactPluginConfigForCacheKey(plugins) {
  const entries = Object.fromEntries(
    Object.entries(plugins.entries).map(([pluginId, entry]) => [
      pluginId,
      "config" in entry
        ? {
            ...entry,
            config: "<plugin-config>",
          }
        : entry,
    ]),
  );
  return {
    ...plugins,
    entries,
  };
}
function hasExplicitCompatibilityInputs(options) {
  return (
    options.config !== void 0 ||
    options.activationSourceConfig !== void 0 ||
    options.autoEnabledReasons !== void 0 ||
    options.workspaceDir !== void 0 ||
    options.env !== void 0 ||
    options.resolveRawConfigEnvVars !== void 0 ||
    hasExplicitPluginIdScope(options.onlyPluginIds) ||
    options.runtimeOptions !== void 0 ||
    options.pluginSdkResolution !== void 0 ||
    options.coreGatewayHandlers !== void 0 ||
    options.includeSetupOnlyChannelPlugins === true ||
    options.forceSetupOnlyChannelPlugins === true ||
    options.requireSetupEntryForSetupOnlyChannelPlugins === true ||
    options.preferSetupRuntimeForChannelPlugins === true ||
    options.preferBuiltPluginArtifacts === true ||
    options.loadModules === false
  );
}
function resolveCoreGatewayMethodNames(options) {
  const names = new Set(options.coreGatewayMethodNames ?? []);
  for (const name of Object.keys(options.coreGatewayHandlers ?? {})) names.add(name);
  return Array.from(names).toSorted();
}
function pluginLoadOptionsMatchCacheKey(options, expectedCacheKey) {
  return resolvePluginLoadCacheContext(options).cacheKey === expectedCacheKey;
}
function pluginToolDiscoveryOptionsMatchActiveCacheKey(options, expectedCacheKey) {
  if (options.toolDiscovery !== true) return false;
  const fullRuntimeOptions = {
    ...options,
    toolDiscovery: void 0,
  };
  if (pluginLoadOptionsMatchCacheKey(fullRuntimeOptions, expectedCacheKey)) return true;
  if (options.activate !== false) return false;
  return pluginLoadOptionsMatchCacheKey(
    {
      ...fullRuntimeOptions,
      activate: true,
    },
    expectedCacheKey,
  );
}
function registryContainsPluginScope(registry, onlyPluginIds) {
  if (!onlyPluginIds || onlyPluginIds.length === 0) return false;
  const loadedPluginIds = new Set(registry.plugins.map((plugin) => plugin.id));
  return onlyPluginIds.every((pluginId) => loadedPluginIds.has(pluginId));
}
function scopedPluginLoadOptionsMatchWiderActiveCacheKey(
  options,
  expectedCacheKey,
  activeRegistry,
) {
  const { onlyPluginIds } = resolvePluginLoadCacheContext(options);
  if (!registryContainsPluginScope(activeRegistry, onlyPluginIds)) return false;
  return pluginLoadOptionsMatchCacheKey(
    {
      ...options,
      onlyPluginIds: void 0,
    },
    expectedCacheKey,
  );
}
/**
 * Convert loader intent into explicit behavior flags.
 *
 * Registration modes are plugin-facing labels; this plan is the internal source
 * of truth for which entrypoint to load and which activation-only policies run.
 */
function resolvePluginRegistrationPlan(params) {
  if (params.canLoadScopedSetupOnlyChannelPlugin)
    return {
      mode: "setup-only",
      loadSetupEntry: true,
      loadSetupRuntimeEntry: false,
      runRuntimeCapabilityPolicy: false,
      runFullActivationOnlyRegistrations: false,
    };
  if (
    params.scopedSetupOnlyChannelPluginRequested &&
    params.requireSetupEntryForSetupOnlyChannelPlugins
  )
    return null;
  if (!params.enableStateEnabled) return null;
  if (params.toolDiscovery)
    return {
      mode: "tool-discovery",
      loadSetupEntry: false,
      loadSetupRuntimeEntry: false,
      runRuntimeCapabilityPolicy: true,
      runFullActivationOnlyRegistrations: false,
    };
  if (
    !params.forceFullRuntimeForChannelPlugins &&
    params.shouldLoadModules &&
    !params.validateOnly &&
    shouldLoadChannelPluginInSetupRuntime({
      manifestChannels: params.manifestRecord.channels,
      setupSource: params.manifestRecord.setupSource,
      startupDeferConfiguredChannelFullLoadUntilAfterListen:
        params.manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
      cfg: params.cfg,
      env: params.env,
      preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
    })
  )
    return {
      mode: "setup-runtime",
      loadSetupEntry: true,
      loadSetupRuntimeEntry: true,
      runRuntimeCapabilityPolicy: false,
      runFullActivationOnlyRegistrations: false,
    };
  const mode = params.shouldActivate ? "full" : "discovery";
  return {
    mode,
    loadSetupEntry: false,
    loadSetupRuntimeEntry: false,
    runRuntimeCapabilityPolicy: true,
    runFullActivationOnlyRegistrations: mode === "full",
  };
}
function applyManifestSnapshotMetadata(record, manifestRecord) {
  record.channelIds = [...(manifestRecord.channels ?? [])];
  record.providerIds = [...(manifestRecord.providers ?? [])];
  record.cliBackendIds = [
    ...(manifestRecord.cliBackends ?? []),
    ...(manifestRecord.setup?.cliBackends ?? []),
  ];
  record.commands = (manifestRecord.commandAliases ?? []).map((alias) => alias.name);
}
function resolvePluginLoadCacheContext(options = {}) {
  const shouldResolveRawConfigEnvVars = options.resolveRawConfigEnvVars === true;
  const baseEnv = options.env ?? process.env;
  const rawConfig = options.config ?? {};
  const rawActivationSourceConfig = resolvePluginActivationSourceConfig({
    config: options.config,
    activationSourceConfig: options.activationSourceConfig,
  });
  const env = shouldResolveRawConfigEnvVars ? createConfigRuntimeEnv(rawConfig, baseEnv) : baseEnv;
  const cfg = applyTestPluginDefaults(
    shouldResolveRawConfigEnvVars
      ? resolveConfigEnvVars(rawConfig, env, { onMissing: () => void 0 })
      : rawConfig,
    env,
  );
  const activationSourceConfig = shouldResolveRawConfigEnvVars
    ? resolveConfigEnvVars(rawActivationSourceConfig, env, { onMissing: () => void 0 })
    : rawActivationSourceConfig;
  const normalized = normalizePluginsConfig(cfg.plugins);
  const activationSource = createPluginActivationSource({ config: activationSourceConfig });
  const trustNormalized = mergeTrustPluginConfigFromActivationSource({
    normalized,
    activationSource,
  });
  const onlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
  const includeSetupOnlyChannelPlugins = options.includeSetupOnlyChannelPlugins === true;
  const forceSetupOnlyChannelPlugins = options.forceSetupOnlyChannelPlugins === true;
  const requireSetupEntryForSetupOnlyChannelPlugins =
    options.requireSetupEntryForSetupOnlyChannelPlugins === true;
  const preferSetupRuntimeForChannelPlugins = options.preferSetupRuntimeForChannelPlugins === true;
  const forceFullRuntimeForChannelPlugins = options.forceFullRuntimeForChannelPlugins === true;
  const preferBuiltPluginArtifacts = options.preferBuiltPluginArtifacts === true;
  const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
  const coreGatewayMethodNames = resolveCoreGatewayMethodNames(options);
  const installRecords = {
    ...(options.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env })),
    ...cfg.plugins?.installs,
  };
  const devSourceRoot = resolveOpenClawDevSourceRoot(env);
  const cacheKey = buildCacheKey({
    workspaceDir: options.workspaceDir,
    plugins: shouldResolveRawConfigEnvVars
      ? redactPluginConfigForCacheKey(trustNormalized)
      : trustNormalized,
    activationMetadataKey: buildActivationMetadataHash({
      activationSource,
      autoEnabledReasons: options.autoEnabledReasons ?? {},
    }),
    installs: installRecords,
    env,
    devSourceRoot,
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    forceSetupOnlyChannelPlugins,
    requireSetupEntryForSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    forceFullRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts,
    resolveRawConfigEnvVars: options.resolveRawConfigEnvVars,
    toolDiscovery: options.toolDiscovery,
    loadModules: options.loadModules,
    runtimeSubagentMode,
    pluginSdkResolution: options.pluginSdkResolution,
    ...(coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames }),
    activate: options.activate,
  });
  return {
    env,
    cfg,
    normalized: trustNormalized,
    activationSourceConfig,
    activationSource,
    autoEnabledReasons: options.autoEnabledReasons ?? {},
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    forceSetupOnlyChannelPlugins,
    requireSetupEntryForSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    forceFullRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts,
    shouldActivate: options.activate !== false,
    shouldLoadModules: options.loadModules !== false,
    runtimeSubagentMode,
    installRecords,
    devSourceRoot,
    cacheKey,
  };
}
function mergeTrustPluginConfigFromActivationSource(params) {
  const source = params.activationSource.plugins;
  const allow = mergePluginTrustList(params.normalized.allow, source.allow);
  const deny = mergePluginTrustList(params.normalized.deny, source.deny);
  const loadPaths = mergePluginTrustList(params.normalized.loadPaths, source.loadPaths);
  if (
    allow === params.normalized.allow &&
    deny === params.normalized.deny &&
    loadPaths === params.normalized.loadPaths
  )
    return params.normalized;
  return {
    ...params.normalized,
    allow,
    deny,
    loadPaths,
  };
}
function mergePluginTrustList(runtimeList, sourceList) {
  if (sourceList.length === 0) return runtimeList;
  const merged = [...runtimeList];
  const seen = new Set(merged);
  for (const entry of sourceList)
    if (!seen.has(entry)) {
      merged.push(entry);
      seen.add(entry);
    }
  return merged.length === runtimeList.length ? runtimeList : merged;
}
function getCompatibleActivePluginRegistry(options = {}) {
  if (options.resolveRawConfigEnvVars === true) return;
  const activeRegistry = getActivePluginRegistry() ?? void 0;
  if (!activeRegistry) return;
  if (!hasExplicitCompatibilityInputs(options)) return activeRegistry;
  const activeCacheKey = getActivePluginRegistryKey();
  if (!activeCacheKey) return;
  const loadContext = resolvePluginLoadCacheContext(options);
  const matchesActiveCacheKey = (candidate) => {
    if (pluginLoadOptionsMatchCacheKey(candidate, activeCacheKey)) return true;
    if (candidate.coreGatewayMethodNames !== void 0) return false;
    return pluginLoadOptionsMatchCacheKey(
      {
        ...candidate,
        coreGatewayMethodNames: activeRegistry.coreGatewayMethodNames,
      },
      activeCacheKey,
    );
  };
  const matchesCompatibleActiveRegistry = (candidate) => {
    if (matchesActiveCacheKey(candidate)) return true;
    if (scopedPluginLoadOptionsMatchWiderActiveCacheKey(candidate, activeCacheKey, activeRegistry))
      return true;
    return pluginToolDiscoveryOptionsMatchActiveCacheKey(candidate, activeCacheKey);
  };
  if (matchesCompatibleActiveRegistry(options)) return activeRegistry;
  if (!loadContext.shouldActivate) {
    if (
      matchesCompatibleActiveRegistry({
        ...options,
        activate: true,
      })
    )
      return activeRegistry;
  }
  const activeRuntimeSubagentMode = getActivePluginRuntimeSubagentMode();
  if (activeRuntimeSubagentMode === "gateway-bindable") {
    if (
      matchesCompatibleActiveRegistry({
        ...options,
        preferBuiltPluginArtifacts: true,
      })
    )
      return activeRegistry;
    if (!loadContext.shouldActivate) {
      if (
        matchesCompatibleActiveRegistry({
          ...options,
          activate: true,
          preferBuiltPluginArtifacts: true,
        })
      )
        return activeRegistry;
    }
  }
  if (
    loadContext.runtimeSubagentMode === "default" &&
    activeRuntimeSubagentMode === "gateway-bindable"
  ) {
    const gatewayBindableOptions = {
      ...options,
      runtimeOptions: {
        ...options.runtimeOptions,
        allowGatewaySubagentBinding: true,
      },
    };
    const gatewayStartupOptions = {
      ...gatewayBindableOptions,
      preferBuiltPluginArtifacts: true,
    };
    if (!loadContext.shouldActivate) {
      const activatingGatewayBindableOptions = {
        ...options,
        activate: true,
        runtimeOptions: {
          ...options.runtimeOptions,
          allowGatewaySubagentBinding: true,
        },
      };
      const activatingGatewayStartupOptions = {
        ...activatingGatewayBindableOptions,
        preferBuiltPluginArtifacts: true,
      };
      if (
        matchesCompatibleActiveRegistry(gatewayBindableOptions) ||
        matchesCompatibleActiveRegistry(gatewayStartupOptions) ||
        matchesCompatibleActiveRegistry(activatingGatewayBindableOptions) ||
        matchesCompatibleActiveRegistry(activatingGatewayStartupOptions)
      )
        return activeRegistry;
    } else if (
      matchesCompatibleActiveRegistry(gatewayBindableOptions) ||
      matchesCompatibleActiveRegistry(gatewayStartupOptions)
    )
      return activeRegistry;
  }
}
function resolveRuntimePluginRegistry(options) {
  if (!options || !hasExplicitCompatibilityInputs(options))
    return getCompatibleActivePluginRegistry();
  const compatible = getCompatibleActivePluginRegistry(options);
  if (compatible) return compatible;
  if (isPluginRegistryLoadInFlight(options)) return;
  return loadOpenClawPlugins(options);
}
function getRuntimePluginRegistryForLoadOptions(options) {
  return resolveRuntimePluginRegistry(options);
}
function resolvePluginRegistryLoadCacheKey(options = {}) {
  return resolvePluginLoadCacheContext(options).cacheKey;
}
function isPluginRegistryLoadInFlight(options = {}) {
  return pluginLoaderCacheState.isLoadInFlight(resolvePluginRegistryLoadCacheKey(options));
}
function resolveCompatibleRuntimePluginRegistry(options) {
  return getCompatibleActivePluginRegistry(options);
}
function validatePluginConfig(params) {
  const { schema, value } = params;
  if (!schema) return ok(value);
  if (isEmptyPluginConfigJsonSchema(schema)) {
    if (
      value === void 0 ||
      (value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0)
    )
      return ok({});
    if (!value || typeof value !== "object" || Array.isArray(value))
      return err(["<root>: must be object"]);
    return err(["<root>: config must be empty"]);
  }
  const result = validateJsonSchemaValue({
    schema,
    cacheKey: params.cacheKey ?? JSON.stringify(schema),
    value: value ?? {},
    applyDefaults: true,
  });
  if (result.ok) return ok(result.value);
  return err(result.errors.map((error) => error.text));
}
function isEmptyPluginConfigJsonSchema(schema) {
  if (schema.type !== "object" || schema.additionalProperties !== false) return false;
  const properties = schema.properties;
  if (
    !properties ||
    typeof properties !== "object" ||
    Array.isArray(properties) ||
    Object.keys(properties).length > 0
  )
    return false;
  return !(
    "required" in schema ||
    "dependentRequired" in schema ||
    "dependencies" in schema ||
    "minProperties" in schema ||
    "allOf" in schema ||
    "anyOf" in schema ||
    "oneOf" in schema ||
    "not" in schema
  );
}
function resolvePluginModuleExport(moduleExport) {
  const seen = /* @__PURE__ */ new Set();
  const candidates = [unwrapDefaultModuleExport(moduleExport), moduleExport];
  for (let index = 0; index < candidates.length && index < 12; index += 1) {
    const resolved = candidates[index];
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    if (typeof resolved === "function") return { register: resolved };
    if (resolved && typeof resolved === "object") {
      const def = resolved;
      const register = def.register ?? def.activate;
      if (typeof register === "function")
        return {
          definition: def,
          register,
        };
      for (const key of ["default", "module"]) if (key in def) candidates.push(def[key]);
    }
  }
  const resolved = candidates[0];
  if (typeof resolved === "function") return { register: resolved };
  if (resolved && typeof resolved === "object") {
    const def = resolved;
    return {
      definition: def,
      register: def.register ?? def.activate,
    };
  }
  return {};
}
function kindIncludes(kind, target) {
  return kind === target || (Array.isArray(kind) && kind.includes(target));
}
function formatBundledChannelWrongLoaderError(kind) {
  if (kindIncludes(kind, "bundled-channel-setup-entry"))
    return "bundled channel setup entry requires setup-runtime loader";
  if (kindIncludes(kind, "bundled-channel-entry"))
    return "bundled channel entry requires setup-runtime loader";
  return null;
}
function pushDiagnostics(diagnostics, append) {
  diagnostics.push(...append);
}
function pushPluginValidationError(params) {
  params.record.status = "error";
  params.record.error = params.message;
  params.record.failedAt = /* @__PURE__ */ new Date();
  params.record.failurePhase = "validation";
  params.registry.plugins.push(params.record);
  params.seenIds.set(params.pluginId, params.origin);
  params.registry.diagnostics.push({
    level: "error",
    pluginId: params.record.id,
    source: params.record.source,
    message: params.record.error,
  });
}
function maybeThrowOnPluginLoadError(registry, throwOnLoadError) {
  if (!throwOnLoadError) return;
  if (!registry.plugins.some((entry) => entry.status === "error")) return;
  throw new PluginLoadFailureError(registry);
}
function activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir) {
  setActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir);
  initializeGlobalHookRunner(registry);
}
function loadOpenClawPlugins(options = {}) {
  const requestedOnlyPluginIdSet = createPluginIdScopeSet(
    normalizePluginIdScope(options.onlyPluginIds),
  );
  if (requestedOnlyPluginIdSet && requestedOnlyPluginIdSet.size === 0) {
    const emptyRegistry = createEmptyPluginRegistry();
    if (options.activate !== false) {
      clearActivatedPluginRuntimeState();
      activatePluginRegistry(
        emptyRegistry,
        `empty-plugin-scope::${resolveRuntimeSubagentMode(options.runtimeOptions)}::${options.workspaceDir ?? ""}`,
        resolveRuntimeSubagentMode(options.runtimeOptions),
        options.workspaceDir,
      );
    }
    return emptyRegistry;
  }
  const {
    env,
    cfg,
    normalized,
    activationSource,
    autoEnabledReasons,
    onlyPluginIds,
    includeSetupOnlyChannelPlugins,
    forceSetupOnlyChannelPlugins,
    requireSetupEntryForSetupOnlyChannelPlugins,
    preferSetupRuntimeForChannelPlugins,
    forceFullRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts,
    shouldActivate,
    shouldLoadModules,
    cacheKey,
    runtimeSubagentMode,
    installRecords,
    devSourceRoot,
  } = resolvePluginLoadCacheContext(options);
  const logger = options.logger ?? defaultLogger();
  const validateOnly = options.mode === "validate";
  const onlyPluginIdSet = createPluginIdScopeSet(onlyPluginIds);
  const cacheEnabled = options.cache !== false && options.resolveRawConfigEnvVars !== true;
  if (cacheEnabled) {
    const cached = getReusableCachedPluginRegistry({
      cacheKey,
      onlyPluginIds,
      runtimeSubagentMode,
      options,
    });
    if (cached) {
      if (shouldActivate) {
        restorePluginProcessGlobalState(cached.state.processGlobalState);
        activatePluginRegistry(
          cached.state.registry,
          cached.cacheKey,
          cached.runtimeSubagentMode,
          options.workspaceDir,
        );
      }
      return cached.state.registry;
    }
  }
  pluginLoaderCacheState.beginLoad(cacheKey);
  try {
    if (shouldActivate) clearActivatedPluginRuntimeState();
    const loadPluginModule = createPluginModuleLoader({
      devSourceRoot,
      pluginSdkResolution: options.pluginSdkResolution,
    });
    let createPluginRuntimeFactory = null;
    const resolveCreatePluginRuntime = () => {
      if (createPluginRuntimeFactory) return createPluginRuntimeFactory;
      const runtimeModuleResolution = resolvePluginRuntimeModulePathWithDiagnostics({
        devSourceRoot,
        pluginSdkResolution: options.pluginSdkResolution,
      });
      const runtimeModulePath = runtimeModuleResolution.resolvedPath;
      if (!runtimeModulePath)
        throw new Error(
          formatPluginRuntimeModuleResolutionError({
            resolution: runtimeModuleResolution,
            pluginSdkResolution: options.pluginSdkResolution,
          }),
        );
      const runtimeModule = withProfile({ source: runtimeModulePath }, "runtime-module", () =>
        loadPluginModule(runtimeModulePath),
      );
      if (typeof runtimeModule.createPluginRuntime !== "function")
        throw new Error("Plugin runtime module missing createPluginRuntime export");
      createPluginRuntimeFactory = runtimeModule.createPluginRuntime;
      return createPluginRuntimeFactory;
    };
    let resolvedRuntime = null;
    const resolveRuntime = () => {
      resolvedRuntime ??= resolveCreatePluginRuntime()(options.runtimeOptions);
      return resolvedRuntime;
    };
    const lazyRuntimeReflectionKeySet = new Set(LAZY_RUNTIME_REFLECTION_KEYS);
    const resolveLazyRuntimeDescriptor = (prop) => {
      if (!lazyRuntimeReflectionKeySet.has(prop))
        return Reflect.getOwnPropertyDescriptor(resolveRuntime(), prop);
      return {
        configurable: true,
        enumerable: true,
        get() {
          return Reflect.get(resolveRuntime(), prop);
        },
        set(value) {
          Reflect.set(resolveRuntime(), prop, value);
        },
      };
    };
    const {
      registry,
      createApi,
      rollbackPluginGlobalSideEffects,
      registerReload,
      registerNodeHostCommand,
      registerSecurityAuditCollector,
    } = createPluginRegistry({
      logger,
      runtime: new Proxy(
        {},
        {
          get(_target, prop, receiver) {
            return Reflect.get(resolveRuntime(), prop, receiver);
          },
          set(_target, prop, value, receiver) {
            return Reflect.set(resolveRuntime(), prop, value, receiver);
          },
          has(_target, prop) {
            return lazyRuntimeReflectionKeySet.has(prop) || Reflect.has(resolveRuntime(), prop);
          },
          ownKeys() {
            return [...LAZY_RUNTIME_REFLECTION_KEYS];
          },
          getOwnPropertyDescriptor(_target, prop) {
            return resolveLazyRuntimeDescriptor(prop);
          },
          defineProperty(_target, prop, attributes) {
            return Reflect.defineProperty(resolveRuntime(), prop, attributes);
          },
          deleteProperty(_target, prop) {
            return Reflect.deleteProperty(resolveRuntime(), prop);
          },
          getPrototypeOf() {
            return Reflect.getPrototypeOf(resolveRuntime());
          },
        },
      ),
      coreGatewayHandlers: options.coreGatewayHandlers,
      ...(options.coreGatewayMethodNames !== void 0 && {
        coreGatewayMethodNames: options.coreGatewayMethodNames,
      }),
      ...(options.hostServices !== void 0 && { hostServices: options.hostServices }),
      activateGlobalSideEffects: shouldActivate,
    });
    const suppliedManifestRegistry = options.manifestRegistry;
    const discovery = suppliedManifestRegistry
      ? {
          candidates: createPluginCandidatesFromManifestRegistry(suppliedManifestRegistry),
          diagnostics: [],
        }
      : (options.discovery ??
        discoverOpenClawPlugins({
          workspaceDir: options.workspaceDir,
          extraPaths: normalized.loadPaths,
          env,
          installRecords,
        }));
    const manifestRegistry =
      suppliedManifestRegistry ??
      loadPluginManifestRegistry({
        config: cfg,
        workspaceDir: options.workspaceDir,
        env,
        candidates: discovery.candidates,
        diagnostics: discovery.diagnostics,
        installRecords: Object.keys(installRecords).length > 0 ? installRecords : void 0,
      });
    pushDiagnostics(registry.diagnostics, manifestRegistry.diagnostics);
    warnWhenAllowlistIsOpen({
      emitWarning: shouldActivate,
      logger,
      pluginsEnabled: normalized.enabled,
      allow: normalized.allow,
      warningCacheKey: cacheKey,
      warningCache: pluginLoaderCacheState,
      explicitlyEnabledPluginIds: new Set(
        Object.entries(normalized.entries)
          .filter(([, entry]) => entry.enabled === true)
          .map(([pluginId]) => pluginId),
      ),
      discoverablePlugins: manifestRegistry.plugins
        .filter((plugin) => !onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))
        .map((plugin) => ({
          id: plugin.id,
          source: plugin.source,
          origin: plugin.origin,
        })),
    });
    const provenance = buildProvenanceIndex({
      normalizedLoadPaths: normalized.loadPaths,
      env,
      installRecords,
    });
    const manifestByRoot = new Map(
      manifestRegistry.plugins.map((record) => [record.rootDir, record]),
    );
    const orderedCandidates = [...discovery.candidates].toSorted((left, right) => {
      return compareDuplicateCandidateOrder({
        left,
        right,
        manifestByRoot,
        provenance,
        env,
      });
    });
    const seenIds = /* @__PURE__ */ new Map();
    const memorySlot = normalized.slots.memory;
    let selectedMemoryPluginId = null;
    let memorySlotMatched = false;
    const dreamingSidecar = resolveAuthorizedDreamingSidecar({
      cfg,
      normalized,
      activationSource,
      manifestRegistry,
      memorySlot,
    });
    const pluginLoadStartMs = performance.now();
    let pluginLoadAttemptCount = 0;
    for (const candidate of orderedCandidates) {
      const manifestRecord = manifestByRoot.get(candidate.rootDir);
      if (!manifestRecord) continue;
      const pluginId = manifestRecord.id;
      if (
        !matchesScopedPluginOrDreamingSidecar({
          onlyPluginIdSet,
          pluginId,
          sidecar: dreamingSidecar,
        })
      )
        continue;
      const isDreamingSidecar = isAuthorizedDreamingSidecarPlugin({
        sidecar: dreamingSidecar,
        pluginId,
      });
      const activationState = isDreamingSidecar
        ? {
            enabled: true,
            activated: true,
            explicitlyEnabled: false,
            source: "auto",
            reason: `dreaming sidecar for selected memory slot "${dreamingSidecar?.selectedMemoryPluginId ?? ""}"`,
          }
        : resolveEffectivePluginActivationState({
            id: pluginId,
            origin: candidate.origin,
            config: normalized,
            rootConfig: cfg,
            enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
            activationSource,
            autoEnabledReason: formatAutoEnabledActivationReason(autoEnabledReasons[pluginId]),
          });
      const existingOrigin = seenIds.get(pluginId);
      if (existingOrigin) {
        const record = createPluginRecord({
          id: pluginId,
          name: manifestRecord.name ?? pluginId,
          description: manifestRecord.description,
          version: manifestRecord.version,
          packageName: manifestRecord.packageName,
          format: manifestRecord.format,
          bundleFormat: manifestRecord.bundleFormat,
          bundleCapabilities: manifestRecord.bundleCapabilities,
          source: candidate.source,
          rootDir: candidate.rootDir,
          origin: candidate.origin,
          workspaceDir: candidate.workspaceDir,
          trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
          enabled: false,
          compat: collectPluginManifestCompatCodes(manifestRecord),
          activationState,
          syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
          channelIds: manifestRecord.channels,
          providerIds: manifestRecord.providers,
          configSchema: Boolean(manifestRecord.configSchema),
          contracts: manifestRecord.contracts,
        });
        record.status = "disabled";
        record.error = `overridden by ${existingOrigin} plugin`;
        markPluginActivationDisabled(record, record.error);
        registry.plugins.push(record);
        continue;
      }
      const enableState = isDreamingSidecar
        ? { enabled: true }
        : resolveEffectiveEnableState({
            id: pluginId,
            origin: candidate.origin,
            config: normalized,
            rootConfig: cfg,
            enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
            activationSource,
          });
      const entry = normalized.entries[pluginId];
      const record = createPluginRecord({
        id: pluginId,
        name: manifestRecord.name ?? pluginId,
        description: manifestRecord.description,
        version: manifestRecord.version,
        packageName: manifestRecord.packageName,
        format: manifestRecord.format,
        bundleFormat: manifestRecord.bundleFormat,
        bundleCapabilities: manifestRecord.bundleCapabilities,
        source: candidate.source,
        rootDir: candidate.rootDir,
        origin: candidate.origin,
        workspaceDir: candidate.workspaceDir,
        trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
        enabled: enableState.enabled,
        compat: collectPluginManifestCompatCodes(manifestRecord),
        activationState,
        syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
        channelIds: manifestRecord.channels,
        providerIds: manifestRecord.providers,
        configSchema: Boolean(manifestRecord.configSchema),
        contracts: manifestRecord.contracts,
      });
      record.kind = manifestRecord.kind;
      record.configUiHints = manifestRecord.configUiHints;
      record.configJsonSchema = manifestRecord.configSchema;
      const trustedLocalScopedChannelSetupImport =
        resolveManifestOwnerBasePolicyBlock({
          plugin: { id: pluginId },
          normalizedConfig: normalized,
        }) === null &&
        (hasExplicitManifestOwnerTrust({
          plugin: { id: pluginId },
          normalizedConfig: normalized,
        }) ||
          (candidate.origin === "workspace" && activationState.source === "auto"));
      const blockUntrustedLocalScopedChannelSetupImport =
        includeSetupOnlyChannelPlugins &&
        !validateOnly &&
        Boolean(onlyPluginIdSet) &&
        manifestRecord.channels.length > 0 &&
        candidate.origin !== "bundled" &&
        !trustedLocalScopedChannelSetupImport;
      const pushPluginLoadError = (message) =>
        pushPluginValidationError({
          registry,
          seenIds,
          pluginId,
          origin: candidate.origin,
          record,
          message,
        });
      if (blockUntrustedLocalScopedChannelSetupImport) {
        record.status = "disabled";
        record.error =
          activationState.reason ??
          enableState.reason ??
          "local plugin requires explicit trust for setup";
        markPluginActivationDisabled(record, record.error);
        registry.plugins.push(record);
        continue;
      }
      const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
      const runtimeCandidateEntry = resolvePluginRuntimeArtifact({
        source: candidate.source,
        rootDir: pluginRoot,
        origin: candidate.origin,
        preferBuiltPluginArtifacts,
        packageManifest: candidate.packageManifest,
      });
      const runtimeSetupEntry = manifestRecord.setupSource
        ? resolvePluginRuntimeArtifact({
            source: manifestRecord.setupSource,
            rootDir: pluginRoot,
            origin: candidate.origin,
            preferBuiltPluginArtifacts,
            packageManifest: candidate.packageManifest,
          })
        : void 0;
      const scopedSetupOnlyChannelPluginRequested =
        includeSetupOnlyChannelPlugins &&
        !validateOnly &&
        Boolean(onlyPluginIdSet) &&
        manifestRecord.channels.length > 0 &&
        (!enableState.enabled || forceSetupOnlyChannelPlugins);
      const registrationPlan = resolvePluginRegistrationPlan({
        canLoadScopedSetupOnlyChannelPlugin:
          scopedSetupOnlyChannelPluginRequested &&
          (candidate.origin !== "workspace" || enableState.enabled) &&
          (!requireSetupEntryForSetupOnlyChannelPlugins || Boolean(manifestRecord.setupSource)),
        scopedSetupOnlyChannelPluginRequested,
        requireSetupEntryForSetupOnlyChannelPlugins,
        enableStateEnabled: enableState.enabled,
        shouldLoadModules,
        validateOnly,
        shouldActivate,
        manifestRecord,
        cfg,
        env,
        preferSetupRuntimeForChannelPlugins: forceFullRuntimeForChannelPlugins
          ? false
          : preferSetupRuntimeForChannelPlugins,
        forceFullRuntimeForChannelPlugins,
        toolDiscovery: options.toolDiscovery === true,
      });
      if (!registrationPlan) {
        record.status = "disabled";
        record.error = enableState.reason;
        markPluginActivationDisabled(record, enableState.reason);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      const registrationMode = registrationPlan.mode;
      if (!enableState.enabled) {
        record.status = "disabled";
        record.error = enableState.reason;
        markPluginActivationDisabled(record, enableState.reason);
      }
      if (record.format === "bundle") {
        const unsupportedCapabilities = (record.bundleCapabilities ?? []).filter(
          (capability) =>
            capability !== "skills" &&
            capability !== "mcpServers" &&
            capability !== "settings" &&
            !(
              (capability === "commands" ||
                capability === "agents" ||
                capability === "outputStyles" ||
                capability === "lspServers") &&
              (record.bundleFormat === "claude" || record.bundleFormat === "cursor")
            ) &&
            !(
              capability === "hooks" &&
              (record.bundleFormat === "codex" || record.bundleFormat === "claude")
            ),
        );
        for (const capability of unsupportedCapabilities)
          registry.diagnostics.push({
            level: "warn",
            pluginId: record.id,
            source: record.source,
            message: `bundle capability detected but not wired into OpenClaw yet: ${capability}`,
          });
        if (
          enableState.enabled &&
          record.rootDir &&
          record.bundleFormat &&
          (record.bundleCapabilities ?? []).includes("mcpServers")
        ) {
          const runtimeSupport = inspectBundleMcpRuntimeSupport({
            pluginId: record.id,
            rootDir: record.rootDir,
            bundleFormat: record.bundleFormat,
          });
          for (const message of runtimeSupport.diagnostics)
            registry.diagnostics.push({
              level: "warn",
              pluginId: record.id,
              source: record.source,
              message,
            });
          if (runtimeSupport.unsupportedServerNames.length > 0)
            registry.diagnostics.push({
              level: "warn",
              pluginId: record.id,
              source: record.source,
              message: `bundle MCP servers use unsupported transports or incomplete configs (stdio only today): ${runtimeSupport.unsupportedServerNames.join(", ")}`,
            });
        }
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      if (
        registrationPlan.runRuntimeCapabilityPolicy &&
        candidate.origin === "bundled" &&
        hasKind(manifestRecord.kind, "memory")
      ) {
        if (!isDreamingSidecar) {
          const earlyMemoryDecision = resolveMemorySlotDecision({
            id: record.id,
            kind: manifestRecord.kind,
            slot: memorySlot,
            selectedId: selectedMemoryPluginId,
          });
          if (!earlyMemoryDecision.enabled) {
            record.enabled = false;
            record.status = "disabled";
            record.error = earlyMemoryDecision.reason;
            markPluginActivationDisabled(record, earlyMemoryDecision.reason);
            registry.plugins.push(record);
            seenIds.set(pluginId, candidate.origin);
            continue;
          }
        }
      }
      if (!manifestRecord.configSchema) {
        pushPluginLoadError("missing config schema");
        continue;
      }
      if (!shouldLoadModules && registrationPlan.runRuntimeCapabilityPolicy) {
        const memoryDecision = resolveMemorySlotDecision({
          id: record.id,
          kind: record.kind,
          slot: memorySlot,
          selectedId: selectedMemoryPluginId,
        });
        if (!memoryDecision.enabled && !isDreamingSidecar) {
          record.enabled = false;
          record.status = "disabled";
          record.error = memoryDecision.reason;
          markPluginActivationDisabled(record, memoryDecision.reason);
          registry.plugins.push(record);
          seenIds.set(pluginId, candidate.origin);
          continue;
        }
        if (memoryDecision.selected && hasKind(record.kind, "memory")) {
          selectedMemoryPluginId = record.id;
          memorySlotMatched = true;
          record.memorySlotSelected = true;
        }
      }
      const validatedConfig = validatePluginConfig({
        schema: manifestRecord.configSchema,
        cacheKey: manifestRecord.schemaCacheKey,
        value: entry?.config,
      });
      if (!validatedConfig.ok) {
        logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
        pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
        continue;
      }
      if (!shouldLoadModules) {
        applyManifestSnapshotMetadata(record, manifestRecord);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      const loadEntry =
        registrationPlan.loadSetupEntry && runtimeSetupEntry
          ? runtimeSetupEntry
          : runtimeCandidateEntry;
      const moduleLoadSource = resolveCanonicalDistRuntimeSource(loadEntry.source);
      const moduleRoot = resolveCanonicalDistRuntimeSource(loadEntry.rootDir);
      const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
        origin: candidate.origin,
        rootDir: candidate.rootDir,
        env,
      });
      const opened = openRootFileSync({
        absolutePath: moduleLoadSource,
        rootPath: moduleRoot,
        boundaryLabel: "plugin root",
        rejectHardlinks,
        skipLexicalRootCheck: true,
      });
      if (!opened.ok) {
        pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
        continue;
      }
      const safeSource = opened.path;
      fs.closeSync(opened.fd);
      let mod = null;
      let moduleLoadMs = 0;
      let moduleLoadFailed = false;
      const beforeModuleLoad = performance.now();
      try {
        recordImportedPluginId(record.id);
        pluginLoadAttemptCount++;
        logger.debug?.(`[plugins] loading ${record.id} from ${safeSource}`);
        mod = withProfile(
          {
            pluginId: record.id,
            source: safeSource,
          },
          registrationMode,
          () => loadPluginModule(safeSource),
        );
      } catch (err) {
        recordPluginError({
          logger,
          registry,
          record,
          seenIds,
          pluginId,
          origin: candidate.origin,
          phase: "load",
          error: err,
          logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
          diagnosticMessagePrefix: "failed to load plugin: ",
        });
        moduleLoadFailed = true;
        continue;
      } finally {
        moduleLoadMs = performance.now() - beforeModuleLoad;
        detailPluginStartupTrace(options.startupTrace, record.id, [
          ["loadMs", moduleLoadMs],
          ["loadFailedCount", moduleLoadFailed ? 1 : 0],
        ]);
      }
      if (registrationPlan.loadSetupEntry && manifestRecord.setupSource) {
        const setupRegistration = resolveSetupChannelRegistration(mod);
        if (setupRegistration.loadError) {
          recordPluginError({
            logger,
            registry,
            record,
            seenIds,
            pluginId,
            origin: candidate.origin,
            phase: "load",
            error: setupRegistration.loadError,
            logPrefix: `[plugins] ${record.id} failed to load setup entry from ${record.source}: `,
            diagnosticMessagePrefix: "failed to load setup entry: ",
            diagnosticCode: "channel-setup-failure",
          });
          continue;
        }
        if (setupRegistration.plugin) {
          if (
            !channelPluginIdBelongsToManifest({
              channelId: setupRegistration.plugin.id,
              pluginId: record.id,
              manifestChannels: manifestRecord.channels,
            })
          ) {
            pushPluginLoadError(
              `plugin id mismatch (config uses "${record.id}", setup export uses "${setupRegistration.plugin.id}")`,
            );
            continue;
          }
          const api = createApi(record, {
            config: cfg,
            pluginConfig: {},
            hookPolicy: entry?.hooks,
            registrationMode,
          });
          let mergedSetupRegistration = setupRegistration;
          let runtimeSetterApplied = false;
          if (
            registrationPlan.loadSetupRuntimeEntry &&
            setupRegistration.usesBundledSetupContract &&
            !shouldDeferConfiguredChannelFullRuntimeMerge({
              manifestChannels: manifestRecord.channels,
              startupDeferConfiguredChannelFullLoadUntilAfterListen:
                manifestRecord.startupDeferConfiguredChannelFullLoadUntilAfterListen,
              cfg,
              env,
              preferSetupRuntimeForChannelPlugins,
            }) &&
            resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source) !== safeSource
          ) {
            const runtimeOpened = openRootFileSync({
              absolutePath: resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source),
              rootPath: resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.rootDir),
              boundaryLabel: "plugin root",
              rejectHardlinks,
              skipLexicalRootCheck: true,
            });
            if (!runtimeOpened.ok) {
              pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
              continue;
            }
            const safeRuntimeSource = runtimeOpened.path;
            fs.closeSync(runtimeOpened.fd);
            let runtimeMod = null;
            try {
              runtimeMod = withProfile(
                {
                  pluginId: record.id,
                  source: safeRuntimeSource,
                },
                "load-setup-runtime-entry",
                () => loadPluginModule(safeRuntimeSource),
              );
            } catch (err) {
              recordPluginError({
                logger,
                registry,
                record,
                seenIds,
                pluginId,
                origin: candidate.origin,
                phase: "load",
                error: err,
                logPrefix: `[plugins] ${record.id} failed to load setup-runtime entry from ${record.source}: `,
                diagnosticMessagePrefix: "failed to load setup-runtime entry: ",
                diagnosticCode: "channel-setup-failure",
              });
              continue;
            }
            const runtimeRegistration = resolveBundledRuntimeChannelRegistration(runtimeMod);
            if (runtimeRegistration.id && runtimeRegistration.id !== record.id) {
              pushPluginLoadError(
                `plugin id mismatch (config uses "${record.id}", runtime entry uses "${runtimeRegistration.id}")`,
              );
              continue;
            }
            if (runtimeRegistration.setChannelRuntime)
              try {
                runtimeRegistration.setChannelRuntime(api.runtime);
                runtimeSetterApplied = true;
              } catch (err) {
                recordPluginError({
                  logger,
                  registry,
                  record,
                  seenIds,
                  pluginId,
                  origin: candidate.origin,
                  phase: "load",
                  error: err,
                  logPrefix: `[plugins] ${record.id} failed to apply setup-runtime channel runtime from ${record.source}: `,
                  diagnosticMessagePrefix: "failed to apply setup-runtime channel runtime: ",
                  diagnosticCode: "channel-setup-failure",
                });
                continue;
              }
            const runtimePluginRegistration = loadBundledRuntimeChannelPlugin({
              registration: runtimeRegistration,
            });
            if (runtimePluginRegistration.loadError) {
              recordPluginError({
                logger,
                registry,
                record,
                seenIds,
                pluginId,
                origin: candidate.origin,
                phase: "load",
                error: runtimePluginRegistration.loadError,
                logPrefix: `[plugins] ${record.id} failed to load setup-runtime channel entry from ${record.source}: `,
                diagnosticMessagePrefix: "failed to load setup-runtime channel entry: ",
                diagnosticCode: "channel-setup-failure",
              });
              continue;
            }
            if (runtimePluginRegistration.plugin) {
              if (
                runtimePluginRegistration.plugin.id &&
                runtimePluginRegistration.plugin.id !== record.id
              ) {
                pushPluginLoadError(
                  `plugin id mismatch (config uses "${record.id}", runtime export uses "${runtimePluginRegistration.plugin.id}")`,
                );
                continue;
              }
              mergedSetupRegistration = {
                ...setupRegistration,
                plugin: mergeSetupRuntimeChannelPlugin(
                  runtimePluginRegistration.plugin,
                  setupRegistration.plugin,
                ),
                setChannelRuntime:
                  runtimeRegistration.setChannelRuntime ?? setupRegistration.setChannelRuntime,
              };
            }
          }
          const mergedSetupPlugin = mergedSetupRegistration.plugin;
          if (!mergedSetupPlugin) continue;
          if (
            !channelPluginIdBelongsToManifest({
              channelId: mergedSetupPlugin.id,
              pluginId: record.id,
              manifestChannels: manifestRecord.channels,
            })
          ) {
            pushPluginLoadError(
              `plugin id mismatch (config uses "${record.id}", setup export uses "${mergedSetupPlugin.id}")`,
            );
            continue;
          }
          if (!runtimeSetterApplied)
            try {
              mergedSetupRegistration.setChannelRuntime?.(api.runtime);
            } catch (err) {
              recordPluginError({
                logger,
                registry,
                record,
                seenIds,
                pluginId,
                origin: candidate.origin,
                phase: "load",
                error: err,
                logPrefix: `[plugins] ${record.id} failed to apply setup channel runtime from ${record.source}: `,
                diagnosticMessagePrefix: "failed to apply setup channel runtime: ",
                diagnosticCode: "channel-setup-failure",
              });
              continue;
            }
          if (registrationMode === "setup-runtime") {
            const registerSetupRuntime = mergedSetupRegistration.registerSetupRuntime;
            if (registerSetupRuntime) {
              const transaction = createPluginRegistrationTransaction({ registry });
              try {
                runPluginRegisterSync(
                  (registrationApi) => registerSetupRuntime(registrationApi),
                  api,
                );
                transaction.commit({ activate: true });
              } catch (err) {
                transaction.rollback();
                recordPluginError({
                  logger,
                  registry,
                  record,
                  seenIds,
                  pluginId,
                  origin: candidate.origin,
                  phase: "register",
                  error: err,
                  logPrefix: `[plugins] ${record.id} failed to register setup-runtime channel side effects from ${record.source}: `,
                  diagnosticMessagePrefix:
                    "failed to register setup-runtime channel side effects: ",
                  diagnosticCode: "channel-setup-failure",
                });
                continue;
              }
            }
          }
          try {
            api.registerChannel(mergedSetupPlugin);
          } catch (err) {
            recordPluginError({
              logger,
              registry,
              record,
              seenIds,
              pluginId,
              origin: candidate.origin,
              phase: "load",
              error: err,
              logPrefix: `[plugins] ${record.id} failed to register setup channel from ${record.source}: `,
              diagnosticMessagePrefix: "failed to register setup channel: ",
              diagnosticCode: "channel-setup-failure",
            });
            continue;
          }
          registry.plugins.push(record);
          seenIds.set(pluginId, candidate.origin);
          continue;
        }
      }
      const resolved = resolvePluginModuleExport(mod);
      const definition = resolved.definition;
      const register = resolved.register;
      if (definition?.id && definition.id !== record.id) {
        pushPluginLoadError(
          `plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`,
        );
        continue;
      }
      record.name = definition?.name ?? record.name;
      record.description = definition?.description ?? record.description;
      record.version = definition?.version ?? record.version;
      const manifestKind = record.kind;
      const exportKind = definition?.kind;
      if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind))
        registry.diagnostics.push({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`,
        });
      record.kind = definition?.kind ?? record.kind;
      if (hasKind(record.kind, "memory") && memorySlot === record.id) memorySlotMatched = true;
      if (registrationPlan.runRuntimeCapabilityPolicy) {
        if (!isDreamingSidecar) {
          const memoryDecision = resolveMemorySlotDecision({
            id: record.id,
            kind: record.kind,
            slot: memorySlot,
            selectedId: selectedMemoryPluginId,
          });
          if (!memoryDecision.enabled) {
            record.enabled = false;
            record.status = "disabled";
            record.error = memoryDecision.reason;
            markPluginActivationDisabled(record, memoryDecision.reason);
            registry.plugins.push(record);
            seenIds.set(pluginId, candidate.origin);
            continue;
          }
          if (memoryDecision.selected && hasKind(record.kind, "memory")) {
            selectedMemoryPluginId = record.id;
            record.memorySlotSelected = true;
          }
        }
      }
      if (registrationPlan.runFullActivationOnlyRegistrations) {
        if (definition?.reload) registerReload(record, definition.reload);
        for (const nodeHostCommand of definition?.nodeHostCommands ?? [])
          registerNodeHostCommand(record, nodeHostCommand);
        for (const collector of definition?.securityAuditCollectors ?? [])
          registerSecurityAuditCollector(record, collector);
      }
      if (validateOnly) {
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      if (typeof register !== "function") {
        const bundledChannelWrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
        if (bundledChannelWrongLoaderError) {
          logger.error(
            `[plugins] ${record.id} ${bundledChannelWrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`,
          );
          pushPluginLoadError(bundledChannelWrongLoaderError);
        } else {
          logger.error(`[plugins] ${record.id} missing register/activate export`);
          pushPluginLoadError(formatMissingPluginRegisterError(mod, env));
        }
        continue;
      }
      const api = createApi(record, {
        config: cfg,
        pluginConfig: validatedConfig.value,
        hookPolicy: entry?.hooks,
        registrationMode,
      });
      const transaction = createPluginRegistrationTransaction({
        registry,
        rollbackGlobalSideEffects: () => rollbackPluginGlobalSideEffects(record.id),
      });
      const beforeRegister = performance.now();
      let registerFailed = false;
      try {
        withProfile(
          {
            pluginId: record.id,
            source: record.source,
          },
          `${registrationMode}:register`,
          () => runPluginRegisterSync(register, api),
        );
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        transaction.commit({ activate: shouldActivate });
      } catch (err) {
        transaction.rollback();
        recordPluginError({
          logger,
          registry,
          record,
          seenIds,
          pluginId,
          origin: candidate.origin,
          phase: "register",
          error: err,
          logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
          diagnosticMessagePrefix: "plugin failed during register: ",
        });
        registerFailed = true;
      } finally {
        const registerMs = performance.now() - beforeRegister;
        detailPluginStartupTrace(options.startupTrace, record.id, [
          ["registerMs", registerMs],
          ["loadAndRegisterMs", moduleLoadMs + registerMs],
          ["registerFailedCount", registerFailed ? 1 : 0],
        ]);
      }
    }
    const pluginLoadElapsedMs = performance.now() - pluginLoadStartMs;
    if (pluginLoadAttemptCount > 0)
      logger.debug?.(
        `[plugins] loaded ${registry.plugins.length} plugin(s) (${pluginLoadAttemptCount} attempted) in ${pluginLoadElapsedMs.toFixed(1)}ms`,
      );
    if (!onlyPluginIdSet && typeof memorySlot === "string" && !memorySlotMatched)
      registry.diagnostics.push({
        level: "warn",
        message: `memory slot plugin not found or not marked as memory: ${memorySlot}`,
      });
    warnAboutUntrackedLoadedPlugins({
      registry,
      provenance,
      allowlist: normalized.allow,
      emitWarning: shouldActivate,
      logger,
      env,
    });
    maybeThrowOnPluginLoadError(registry, options.throwOnLoadError);
    if (shouldActivate && options.mode !== "validate") {
      const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
      if (failedPlugins.length > 0)
        logger.warn(
          `[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(failedPlugins)}). Run 'openclaw plugins inspect <id> --runtime --json' for runtime diagnostics, 'openclaw plugins list' for registry state, and restart the Gateway after plugin code or load-path changes.`,
        );
    }
    if (cacheEnabled)
      setCachedPluginRegistry(
        cacheKey,
        {
          registry,
          processGlobalState: snapshotPluginProcessGlobalState(),
        },
        onlyPluginIds,
      );
    if (shouldActivate)
      activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, options.workspaceDir);
    return registry;
  } finally {
    pluginLoaderCacheState.finishLoad(cacheKey);
  }
}
async function loadOpenClawPluginCliRegistry(options = {}) {
  const {
    env,
    cfg,
    normalized,
    activationSource,
    autoEnabledReasons,
    onlyPluginIds,
    cacheKey,
    installRecords,
    devSourceRoot,
  } = resolvePluginLoadCacheContext({
    ...options,
    activate: false,
  });
  const logger = options.logger ?? defaultLogger();
  const onlyPluginIdSet = createPluginIdScopeSet(onlyPluginIds);
  const loadPluginModule = createPluginModuleLoader({
    devSourceRoot,
    pluginSdkResolution: options.pluginSdkResolution,
  });
  const { registry, registerCli } = createPluginRegistry({
    logger,
    runtime: {},
    coreGatewayHandlers: options.coreGatewayHandlers,
    ...(options.coreGatewayMethodNames !== void 0 && {
      coreGatewayMethodNames: options.coreGatewayMethodNames,
    }),
    activateGlobalSideEffects: false,
  });
  const discovery =
    options.discovery ??
    discoverOpenClawPlugins({
      workspaceDir: options.workspaceDir,
      extraPaths: normalized.loadPaths,
      env,
      installRecords,
    });
  const manifestRegistry = loadPluginManifestRegistry({
    config: cfg,
    workspaceDir: options.workspaceDir,
    env,
    candidates: discovery.candidates,
    diagnostics: discovery.diagnostics,
    installRecords: Object.keys(installRecords).length > 0 ? installRecords : void 0,
  });
  pushDiagnostics(registry.diagnostics, manifestRegistry.diagnostics);
  warnWhenAllowlistIsOpen({
    emitWarning: false,
    logger,
    pluginsEnabled: normalized.enabled,
    allow: normalized.allow,
    warningCacheKey: `${cacheKey}::cli-metadata`,
    warningCache: pluginLoaderCacheState,
    explicitlyEnabledPluginIds: new Set(
      Object.entries(normalized.entries)
        .filter(([, entry]) => entry.enabled === true)
        .map(([pluginId]) => pluginId),
    ),
    discoverablePlugins: manifestRegistry.plugins
      .filter((plugin) => !onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))
      .map((plugin) => ({
        id: plugin.id,
        source: plugin.source,
        origin: plugin.origin,
      })),
  });
  const provenance = buildProvenanceIndex({
    normalizedLoadPaths: normalized.loadPaths,
    env,
    installRecords,
  });
  const manifestByRoot = new Map(
    manifestRegistry.plugins.map((record) => [record.rootDir, record]),
  );
  const orderedCandidates = [...discovery.candidates].toSorted((left, right) => {
    return compareDuplicateCandidateOrder({
      left,
      right,
      manifestByRoot,
      provenance,
      env,
    });
  });
  const seenIds = /* @__PURE__ */ new Map();
  const memorySlot = normalized.slots.memory;
  let selectedMemoryPluginId = null;
  const dreamingSidecar = resolveAuthorizedDreamingSidecar({
    cfg,
    normalized,
    activationSource,
    manifestRegistry,
    memorySlot,
  });
  for (const candidate of orderedCandidates) {
    const manifestRecord = manifestByRoot.get(candidate.rootDir);
    if (!manifestRecord) continue;
    const pluginId = manifestRecord.id;
    if (
      !matchesScopedPluginOrDreamingSidecar({
        onlyPluginIdSet,
        pluginId,
        sidecar: dreamingSidecar,
      })
    )
      continue;
    const isDreamingSidecar = isAuthorizedDreamingSidecarPlugin({
      sidecar: dreamingSidecar,
      pluginId,
    });
    const activationState = isDreamingSidecar
      ? {
          enabled: true,
          activated: true,
          explicitlyEnabled: false,
          source: "auto",
          reason: `dreaming sidecar for selected memory slot "${dreamingSidecar?.selectedMemoryPluginId ?? ""}"`,
        }
      : resolveEffectivePluginActivationState({
          id: pluginId,
          origin: candidate.origin,
          config: normalized,
          rootConfig: cfg,
          enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
          activationSource,
          autoEnabledReason: formatAutoEnabledActivationReason(autoEnabledReasons[pluginId]),
        });
    const existingOrigin = seenIds.get(pluginId);
    if (existingOrigin) {
      const record = createPluginRecord({
        id: pluginId,
        name: manifestRecord.name ?? pluginId,
        description: manifestRecord.description,
        version: manifestRecord.version,
        packageName: manifestRecord.packageName,
        format: manifestRecord.format,
        bundleFormat: manifestRecord.bundleFormat,
        bundleCapabilities: manifestRecord.bundleCapabilities,
        source: candidate.source,
        rootDir: candidate.rootDir,
        origin: candidate.origin,
        workspaceDir: candidate.workspaceDir,
        trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
        enabled: false,
        compat: collectPluginManifestCompatCodes(manifestRecord),
        activationState,
        syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
        channelIds: manifestRecord.channels,
        providerIds: manifestRecord.providers,
        configSchema: Boolean(manifestRecord.configSchema),
        contracts: manifestRecord.contracts,
      });
      record.status = "disabled";
      record.error = `overridden by ${existingOrigin} plugin`;
      markPluginActivationDisabled(record, record.error);
      registry.plugins.push(record);
      continue;
    }
    const enableState = isDreamingSidecar
      ? { enabled: true }
      : resolveEffectiveEnableState({
          id: pluginId,
          origin: candidate.origin,
          config: normalized,
          rootConfig: cfg,
          enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
          activationSource,
        });
    const entry = normalized.entries[pluginId];
    const record = createPluginRecord({
      id: pluginId,
      name: manifestRecord.name ?? pluginId,
      description: manifestRecord.description,
      version: manifestRecord.version,
      packageName: manifestRecord.packageName,
      format: manifestRecord.format,
      bundleFormat: manifestRecord.bundleFormat,
      bundleCapabilities: manifestRecord.bundleCapabilities,
      source: candidate.source,
      rootDir: candidate.rootDir,
      origin: candidate.origin,
      workspaceDir: candidate.workspaceDir,
      trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
      enabled: enableState.enabled,
      compat: collectPluginManifestCompatCodes(manifestRecord),
      activationState,
      syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
      channelIds: manifestRecord.channels,
      providerIds: manifestRecord.providers,
      configSchema: Boolean(manifestRecord.configSchema),
      contracts: manifestRecord.contracts,
    });
    record.kind = manifestRecord.kind;
    record.configUiHints = manifestRecord.configUiHints;
    record.configJsonSchema = manifestRecord.configSchema;
    const pushPluginLoadError = (message) =>
      pushPluginValidationError({
        registry,
        seenIds,
        pluginId,
        origin: candidate.origin,
        record,
        message,
      });
    if (!enableState.enabled) {
      record.status = "disabled";
      record.error = enableState.reason;
      markPluginActivationDisabled(record, enableState.reason);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    if (record.format === "bundle") {
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    if (!manifestRecord.configSchema) {
      pushPluginLoadError("missing config schema");
      continue;
    }
    const validatedConfig = validatePluginConfig({
      schema: manifestRecord.configSchema,
      cacheKey: manifestRecord.schemaCacheKey,
      value: entry?.config,
    });
    if (!validatedConfig.ok) {
      logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
      pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
      continue;
    }
    const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
    const cliMetadataSource = resolveCliMetadataEntrySource(candidate.rootDir);
    const sourceForCliMetadata =
      candidate.origin === "bundled"
        ? cliMetadataSource
          ? safeRealpathOrResolve(cliMetadataSource)
          : null
        : (cliMetadataSource ?? candidate.source);
    if (!sourceForCliMetadata) {
      record.status = "loaded";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    const opened = openRootFileSync({
      absolutePath: sourceForCliMetadata,
      rootPath: pluginRoot,
      boundaryLabel: "plugin root",
      rejectHardlinks: shouldRejectHardlinkedPluginFiles({
        origin: candidate.origin,
        rootDir: candidate.rootDir,
        env,
      }),
      skipLexicalRootCheck: true,
    });
    if (!opened.ok) {
      pushPluginLoadError("plugin entry path escapes plugin root or fails alias checks");
      continue;
    }
    const safeSource = opened.path;
    fs.closeSync(opened.fd);
    let mod;
    try {
      mod = withProfile(
        {
          pluginId: record.id,
          source: safeSource,
        },
        "cli-metadata",
        () => loadPluginModule(safeSource),
      );
    } catch (err) {
      recordPluginError({
        logger,
        registry,
        record,
        seenIds,
        pluginId,
        origin: candidate.origin,
        phase: "load",
        error: err,
        logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
        diagnosticMessagePrefix: "failed to load plugin: ",
      });
      continue;
    }
    const resolved = resolvePluginModuleExport(mod);
    const definition = resolved.definition;
    const register = resolved.register;
    if (definition?.id && definition.id !== record.id) {
      pushPluginLoadError(
        `plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`,
      );
      continue;
    }
    record.name = definition?.name ?? record.name;
    record.description = definition?.description ?? record.description;
    record.version = definition?.version ?? record.version;
    const manifestKind = record.kind;
    const exportKind = definition?.kind;
    if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind))
      registry.diagnostics.push({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`,
      });
    record.kind = definition?.kind ?? record.kind;
    if (!isDreamingSidecar) {
      const memoryDecision = resolveMemorySlotDecision({
        id: record.id,
        kind: record.kind,
        slot: memorySlot,
        selectedId: selectedMemoryPluginId,
      });
      if (!memoryDecision.enabled) {
        record.enabled = false;
        record.status = "disabled";
        record.error = memoryDecision.reason;
        markPluginActivationDisabled(record, memoryDecision.reason);
        registry.plugins.push(record);
        seenIds.set(pluginId, candidate.origin);
        continue;
      }
      if (memoryDecision.selected && hasKind(record.kind, "memory")) {
        selectedMemoryPluginId = record.id;
        record.memorySlotSelected = true;
      }
    }
    if (typeof register !== "function") {
      const bundledChannelWrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
      if (bundledChannelWrongLoaderError) {
        logger.error(
          `[plugins] ${record.id} ${bundledChannelWrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`,
        );
        pushPluginLoadError(bundledChannelWrongLoaderError);
      } else {
        logger.error(`[plugins] ${record.id} missing register/activate export`);
        pushPluginLoadError(formatMissingPluginRegisterError(mod, env));
      }
      continue;
    }
    const api = buildPluginApi({
      id: record.id,
      name: record.name,
      version: record.version,
      description: record.description,
      source: record.source,
      rootDir: record.rootDir,
      registrationMode: "cli-metadata",
      config: cfg,
      pluginConfig: validatedConfig.value,
      runtime: {},
      logger,
      resolvePath: (input) => resolveUserPath(input),
      handlers: { registerCli: (registrar, opts) => registerCli(record, registrar, opts) },
    });
    const transaction = createPluginRegistrationTransaction({ registry });
    try {
      withProfile(
        {
          pluginId: record.id,
          source: record.source,
        },
        "cli-metadata:register",
        () => runPluginRegisterSync(register, api),
      );
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      transaction.commit({ activate: true });
    } catch (err) {
      transaction.rollback();
      recordPluginError({
        logger,
        registry,
        record,
        seenIds,
        pluginId,
        origin: candidate.origin,
        phase: "register",
        error: err,
        logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
        diagnosticMessagePrefix: "plugin failed during register: ",
      });
    }
  }
  return registry;
}
function safeRealpathOrResolve(value) {
  try {
    return fs.realpathSync(value);
  } catch {
    return path.resolve(value);
  }
}
function resolveCliMetadataEntrySource(rootDir) {
  for (const basename of CLI_METADATA_ENTRY_BASENAMES) {
    const candidate = path.join(rootDir, basename);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}
//#endregion
export {
  loadOpenClawPluginCliRegistry as a,
  resolvePluginRegistryLoadCacheKey as c,
  isPluginRegistryLoadInFlight as i,
  resolveRuntimePluginRegistry as l,
  clearPluginRegistryLoadCache as n,
  loadOpenClawPlugins as o,
  getRuntimePluginRegistryForLoadOptions as r,
  resolveCompatibleRuntimePluginRegistry as s,
  clearActivatedPluginRuntimeState as t,
  resolvePluginRuntimeArtifact as u,
};
