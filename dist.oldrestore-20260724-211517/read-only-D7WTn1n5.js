import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { s as resolveListedDefaultAccountId } from "./account-helpers-BAtt8fRD.js";
import {
  n as normalizeAccountId,
  r as normalizeOptionalAccountId,
  t as DEFAULT_ACCOUNT_ID,
} from "./account-id-C7N4Rwku.js";
import "./agent-scope-y9xQv_q1.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-DgErwy8P.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { i as getBundledChannelSetupPlugin } from "./bundled-CmD3EzUu.js";
import {
  c as resolveDiscoverableScopedChannelPluginIds,
  i as listConfiguredChannelIdsForReadOnlyScope,
  n as hasExplicitChannelConfig,
} from "./channel-presence-policy-5sGDOKpp.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  a as resolveSetupChannelRegistration,
  t as channelPluginIdBelongsToManifest,
} from "./loader-channel-setup-6cs4isHN.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CDpLvLFE.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import {
  n as normalizeChannelCommandDefaults,
  r as readOwnRecordValue,
  t as isSafeManifestChannelId,
} from "./read-only-command-defaults-BmUAoxHz.js";
import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import "./channel-plugin-ids-B1yGqL5H.js";
import { r as getActivePluginChannelRegistryVersion } from "./runtime-CcYnX0B4.js";
import { y as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-BbbqRiDR.js";
import { _ as uniqueStrings, g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/channels/plugins/read-only.ts
/**
 * Read-only channel plugin discovery.
 *
 * Builds lightweight channel plugin views from config, manifests, and setup metadata.
 */
const SOURCE_PLUGIN_LOADER_MODULE_CANDIDATES = [
  "../../plugins/loader.js",
  "../../plugins/loader.ts",
];
const BUILT_PLUGIN_LOADER_MODULE_CANDIDATES = ["plugins/loader.js", "plugins/build-smoke-entry.js"];
const moduleLoaders = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("channels");
let pluginLoaderModule;
function listBuiltPluginLoaderModuleCandidateUrls(importerUrl) {
  let importerPath;
  try {
    importerPath = fileURLToPath(importerUrl);
  } catch {
    return [];
  }
  const distMarker = `${path.sep}dist${path.sep}`;
  const distMarkerIndex = importerPath.lastIndexOf(distMarker);
  if (distMarkerIndex < 0) return [];
  const distRoot = importerPath.slice(0, distMarkerIndex + distMarker.length - 1);
  return BUILT_PLUGIN_LOADER_MODULE_CANDIDATES.map((candidate) =>
    pathToFileURL(path.join(distRoot, candidate)),
  );
}
function listPluginLoaderModuleCandidateUrls(importerUrl = import.meta.url) {
  const builtCandidates = listBuiltPluginLoaderModuleCandidateUrls(importerUrl);
  if (builtCandidates.length > 0) return builtCandidates;
  return SOURCE_PLUGIN_LOADER_MODULE_CANDIDATES.map((candidate) => new URL(candidate, importerUrl));
}
function loadPluginLoaderModule() {
  if (pluginLoaderModule) return pluginLoaderModule;
  for (const candidate of listPluginLoaderModuleCandidateUrls()) {
    const modulePath = fileURLToPath(candidate);
    try {
      pluginLoaderModule = getCachedPluginModuleLoader({
        cache: moduleLoaders,
        modulePath,
        importerUrl: import.meta.url,
        preferBuiltDist: true,
        loaderFilename: import.meta.url,
        tryNative: true,
      })(modulePath);
      return pluginLoaderModule;
    } catch {}
  }
  throw new Error("Could not load plugin runtime loader for channel setup fallback.");
}
const readOnlyChannelPluginResolutionCache = /* @__PURE__ */ new Map();
const MAX_READ_ONLY_CHANNEL_PLUGIN_RESOLUTION_CACHE_SIZE = 8;
const readOnlyChannelPluginObjectIds = /* @__PURE__ */ new WeakMap();
let nextReadOnlyChannelPluginObjectId = 1;
registerPluginMetadataProcessMemoLifecycleClear(() => {
  readOnlyChannelPluginResolutionCache.clear();
});
function cloneReadOnlyChannelPluginResolution(resolution) {
  return {
    plugins: [...resolution.plugins],
    configuredChannelIds: [...resolution.configuredChannelIds],
    missingConfiguredChannelIds: [...resolution.missingConfiguredChannelIds],
    loadFailures: resolution.loadFailures.map((failure) => ({ ...failure })),
  };
}
function rememberReadOnlyChannelPluginResolution(key, resolution) {
  if (readOnlyChannelPluginResolutionCache.has(key))
    readOnlyChannelPluginResolutionCache.delete(key);
  readOnlyChannelPluginResolutionCache.set(key, cloneReadOnlyChannelPluginResolution(resolution));
  while (
    readOnlyChannelPluginResolutionCache.size > MAX_READ_ONLY_CHANNEL_PLUGIN_RESOLUTION_CACHE_SIZE
  ) {
    const oldestKey = readOnlyChannelPluginResolutionCache.keys().next().value;
    if (!oldestKey) break;
    readOnlyChannelPluginResolutionCache.delete(oldestKey);
  }
}
function resolveReadOnlyChannelPluginResolutionCacheKey(params) {
  if (params.env !== process.env) return null;
  if (params.options.includePersistedAuthState !== false) return null;
  const activationSourceConfig = params.options.activationSourceConfig ?? params.cfg;
  return [
    resolveRuntimeConfigCacheKey(params.cfg),
    activationSourceConfig === params.cfg
      ? "activation:same"
      : resolveRuntimeConfigCacheKey(activationSourceConfig),
    `channel-registry:${getActivePluginChannelRegistryVersion()}`,
    `loaded-channels:${fingerprintLoadedChannelPlugins(params.loadedChannelPlugins)}`,
    `env:${hashEnvironment(params.env)}`,
    `cwd:${process.cwd()}`,
    `state:${params.options.stateDir ?? ""}`,
    `workspace:${params.workspaceDir}`,
    `setup:${params.options.includeSetupFallbackPlugins === true}`,
  ].join("\0");
}
function resolveReadOnlyChannelPluginObjectId(plugin) {
  const existing = readOnlyChannelPluginObjectIds.get(plugin);
  if (existing !== void 0) return existing;
  const next = nextReadOnlyChannelPluginObjectId;
  nextReadOnlyChannelPluginObjectId += 1;
  readOnlyChannelPluginObjectIds.set(plugin, next);
  return next;
}
function fingerprintLoadedChannelPlugins(plugins) {
  return plugins
    .map((plugin) => `${plugin.id}:${resolveReadOnlyChannelPluginObjectId(plugin)}`)
    .join(",");
}
function hashEnvironment(env) {
  const hash = createHash("sha256");
  for (const key of Object.keys(env).toSorted((left, right) => left.localeCompare(right))) {
    hash.update(key);
    hash.update("\0");
    hash.update(env[key] ?? "");
    hash.update("\0");
  }
  return hash.digest("base64url");
}
function addChannelPlugins(byId, plugins, options) {
  for (const plugin of plugins) {
    if (!plugin) continue;
    if (options?.onlyIds && !options.onlyIds.has(plugin.id)) continue;
    if (options?.allowOverwrite === false && byId.has(plugin.id)) continue;
    byId.set(plugin.id, plugin);
  }
}
function rebindChannelScopedString(value, sourceChannelId, targetChannelId) {
  const sourcePrefix = `channels.${sourceChannelId}`;
  if (value === sourcePrefix) return `channels.${targetChannelId}`;
  if (value.startsWith(`${sourcePrefix}.`))
    return `channels.${targetChannelId}${value.slice(sourcePrefix.length)}`;
  return value;
}
function normalizeManifestText(value, fallback) {
  return sanitizeForLog(value?.trim() || fallback).trim();
}
function rebindChannelConfig(cfg, sourceChannelId, targetChannelId) {
  if (sourceChannelId === targetChannelId || !cfg.channels) return cfg;
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      [sourceChannelId]: cfg.channels[targetChannelId],
    },
  };
}
function restoreReboundChannelConfig(params) {
  if (params.sourceChannelId === params.targetChannelId || !params.updated.channels)
    return params.updated;
  const nextChannels = { ...params.updated.channels };
  if (Object.hasOwn(nextChannels, params.sourceChannelId))
    nextChannels[params.targetChannelId] = nextChannels[params.sourceChannelId];
  else delete nextChannels[params.targetChannelId];
  if (params.original.channels && Object.hasOwn(params.original.channels, params.sourceChannelId))
    nextChannels[params.sourceChannelId] = params.original.channels[params.sourceChannelId];
  else delete nextChannels[params.sourceChannelId];
  return {
    ...params.updated,
    channels: nextChannels,
  };
}
function getChannelConfigRecord(cfg, channelId) {
  if (!isSafeManifestChannelId(channelId)) return {};
  const channels = cfg.channels;
  if (!channels || typeof channels !== "object" || Array.isArray(channels)) return {};
  const entry = readOwnRecordValue(channels, channelId);
  return entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
}
function normalizeManifestAccountConfigKey(accountId) {
  return normalizeOptionalAccountId(accountId) ?? "";
}
function listManifestChannelAccountIds(cfg, channelId) {
  const accounts = getChannelConfigRecord(cfg, channelId).accounts;
  if (accounts && typeof accounts === "object" && !Array.isArray(accounts))
    return sortUniqueStrings(
      Object.keys(accounts)
        .filter((accountId) => !isBlockedObjectKey(accountId))
        .map((accountId) => normalizeOptionalAccountId(accountId))
        .filter((accountId) => Boolean(accountId)),
    );
  return hasExplicitChannelConfig({
    config: cfg,
    channelId,
  })
    ? [DEFAULT_ACCOUNT_ID]
    : [];
}
function resolveManifestChannelDefaultAccountId(cfg, channelId) {
  const channelConfig = getChannelConfigRecord(cfg, channelId);
  const configuredDefaultAccountId = normalizeOptionalAccountId(
    typeof channelConfig.defaultAccount === "string" ? channelConfig.defaultAccount : void 0,
  );
  return resolveListedDefaultAccountId({
    accountIds: listManifestChannelAccountIds(cfg, channelId),
    configuredDefaultAccountId,
  });
}
function resolveManifestChannelAccountConfig(params) {
  const channelConfig = getChannelConfigRecord(params.cfg, params.channelId);
  const resolvedAccountId = normalizeAccountId(params.accountId);
  const accounts = channelConfig.accounts;
  if (accounts && typeof accounts === "object" && !Array.isArray(accounts)) {
    const accountConfig = resolveNormalizedAccountEntry(
      accounts,
      resolvedAccountId,
      normalizeManifestAccountConfigKey,
    );
    if (accountConfig && typeof accountConfig === "object" && !Array.isArray(accountConfig))
      return accountConfig;
  }
  return channelConfig;
}
function buildManifestChannelPlugin(params) {
  if (!isSafeManifestChannelId(params.channelId)) return;
  const catalogMeta =
    params.record.channelCatalogMeta?.id === params.channelId
      ? params.record.channelCatalogMeta
      : void 0;
  const channelConfigValue = params.record.channelConfigs
    ? readOwnRecordValue(params.record.channelConfigs, params.channelId)
    : void 0;
  if (
    !catalogMeta &&
    (!channelConfigValue ||
      typeof channelConfigValue !== "object" ||
      Array.isArray(channelConfigValue)) &&
    !params.record.channels.includes(params.channelId)
  )
    return;
  const channelConfig =
    channelConfigValue &&
    typeof channelConfigValue === "object" &&
    !Array.isArray(channelConfigValue)
      ? channelConfigValue
      : void 0;
  const label =
    normalizeManifestText(
      channelConfig?.label ?? catalogMeta?.label,
      params.record.name || params.channelId,
    ) || params.channelId;
  const blurb = normalizeManifestText(
    channelConfig?.description ?? catalogMeta?.blurb,
    params.record.description || "",
  );
  const commands = normalizeChannelCommandDefaults(
    channelConfig?.commands ?? catalogMeta?.commands,
  );
  return {
    id: params.channelId,
    meta: {
      id: params.channelId,
      label,
      selectionLabel: label,
      docsPath: `/channels/${encodeURIComponent(params.channelId)}`,
      blurb,
      ...(channelConfig?.preferOver?.length
        ? { preferOver: channelConfig.preferOver }
        : catalogMeta?.preferOver?.length
          ? { preferOver: catalogMeta.preferOver }
          : {}),
    },
    capabilities: { chatTypes: ["direct"] },
    ...(commands ? { commands } : {}),
    ...(channelConfig
      ? {
          configSchema: {
            schema: channelConfig.schema,
            ...(channelConfig.uiHints ? { uiHints: channelConfig.uiHints } : {}),
            ...(channelConfig.runtime ? { runtime: channelConfig.runtime } : {}),
          },
        }
      : {}),
    config: {
      listAccountIds: (cfg) => listManifestChannelAccountIds(cfg, params.channelId),
      defaultAccountId: (cfg) => resolveManifestChannelDefaultAccountId(cfg, params.channelId),
      resolveAccount: (cfg, accountId) => ({
        accountId: normalizeAccountId(accountId),
        config: resolveManifestChannelAccountConfig({
          cfg,
          channelId: params.channelId,
          accountId,
        }),
      }),
      isEnabled: (_account, cfg) => getChannelConfigRecord(cfg, params.channelId).enabled !== false,
      isConfigured: (_account, cfg) =>
        hasExplicitChannelConfig({
          config: cfg,
          channelId: params.channelId,
        }),
      hasConfiguredState: ({ cfg }) =>
        hasExplicitChannelConfig({
          config: cfg,
          channelId: params.channelId,
        }),
    },
  };
}
function canUseManifestChannelPlugin(record, channelId) {
  if (Boolean(record.channelConfigs && Object.hasOwn(record.channelConfigs, channelId)))
    return record.setup?.requiresRuntime === false || !record.setupSource;
  return record.channelCatalogMeta?.id === channelId || !record.setupSource;
}
function loadSetupChannelPluginFromManifestRecord(params) {
  if (!params.record.setupSource || !params.record.channels.includes(params.channelId)) return {};
  try {
    const registration = resolveSetupChannelRegistration(
      getCachedPluginModuleLoader({
        cache: moduleLoaders,
        modulePath: params.record.setupSource,
        importerUrl: import.meta.url,
        preferBuiltDist: true,
        loaderFilename: import.meta.url,
        tryNative: true,
        cacheScopeKey: "read-only-setup-entry",
      })(params.record.setupSource),
    );
    if (registration.loadError)
      return {
        failure: {
          channelId: params.channelId,
          pluginId: params.record.id,
          source: params.record.setupSource,
          message: `failed to load setup entry: ${formatErrorMessage(registration.loadError)}`,
        },
      };
    if (!registration.plugin) return {};
    if (
      !channelPluginIdBelongsToManifest({
        channelId: registration.plugin.id,
        pluginId: params.record.id,
        manifestChannels: params.record.channels,
      })
    )
      return {};
    return { plugin: cloneChannelPluginForChannelId(registration.plugin, params.channelId) };
  } catch (error) {
    const detail = formatErrorMessage(error);
    log.warn(`[channels] failed to load channel setup ${params.record.id}: ${detail}`);
    return {
      failure: {
        channelId: params.channelId,
        pluginId: params.record.id,
        source: params.record.setupSource,
        message: `failed to load setup entry: ${detail}`,
      },
    };
  }
}
function collectChannelPluginLoadFailuresFromDiagnostics(params) {
  if (!params.diagnostics?.length || params.channelIds.length === 0) return [];
  const configuredChannelIds = new Set(params.channelIds);
  const recordsByPluginId = new Map(params.records.map((record) => [record.id, record]));
  const failures = [];
  for (const diagnostic of params.diagnostics) {
    if (diagnostic.level !== "error" || !diagnostic.pluginId) continue;
    const record = recordsByPluginId.get(diagnostic.pluginId);
    if (!record) continue;
    for (const channelId of record.channels) {
      if (!configuredChannelIds.has(channelId)) continue;
      failures.push({
        channelId,
        pluginId: record.id,
        source: diagnostic.source,
        message: diagnostic.message,
      });
    }
  }
  return failures;
}
function rebindChannelPluginConfig(config, sourceChannelId, targetChannelId) {
  const rebind = (cfg) => rebindChannelConfig(cfg, sourceChannelId, targetChannelId);
  return {
    ...config,
    listAccountIds: (cfg) => config.listAccountIds(rebind(cfg)),
    resolveAccount: (cfg, accountId) => config.resolveAccount(rebind(cfg), accountId),
    inspectAccount: config.inspectAccount
      ? (cfg, accountId) => config.inspectAccount?.(rebind(cfg), accountId)
      : void 0,
    defaultAccountId: config.defaultAccountId
      ? (cfg) => config.defaultAccountId?.(rebind(cfg)) ?? ""
      : void 0,
    setAccountEnabled: config.setAccountEnabled
      ? (params) =>
          restoreReboundChannelConfig({
            original: params.cfg,
            updated:
              config.setAccountEnabled?.({
                ...params,
                cfg: rebind(params.cfg),
              }) ?? params.cfg,
            sourceChannelId,
            targetChannelId,
          })
      : void 0,
    deleteAccount: config.deleteAccount
      ? (params) =>
          restoreReboundChannelConfig({
            original: params.cfg,
            updated:
              config.deleteAccount?.({
                ...params,
                cfg: rebind(params.cfg),
              }) ?? params.cfg,
            sourceChannelId,
            targetChannelId,
          })
      : void 0,
    isEnabled: config.isEnabled
      ? (account, cfg) => config.isEnabled?.(account, rebind(cfg)) ?? false
      : void 0,
    disabledReason: config.disabledReason
      ? (account, cfg) => config.disabledReason?.(account, rebind(cfg)) ?? ""
      : void 0,
    isConfigured: config.isConfigured
      ? (account, cfg) => config.isConfigured?.(account, rebind(cfg)) ?? false
      : void 0,
    unconfiguredReason: config.unconfiguredReason
      ? (account, cfg) => config.unconfiguredReason?.(account, rebind(cfg)) ?? ""
      : void 0,
    describeAccount: config.describeAccount
      ? (account, cfg) => config.describeAccount(account, rebind(cfg))
      : void 0,
    resolveAllowFrom: config.resolveAllowFrom
      ? (params) =>
          config.resolveAllowFrom?.({
            ...params,
            cfg: rebind(params.cfg),
          })
      : void 0,
    formatAllowFrom: config.formatAllowFrom
      ? (params) =>
          config.formatAllowFrom?.({
            ...params,
            cfg: rebind(params.cfg),
          }) ?? []
      : void 0,
    hasConfiguredState: config.hasConfiguredState
      ? (params) =>
          config.hasConfiguredState?.({
            ...params,
            cfg: rebind(params.cfg),
          }) ?? false
      : void 0,
    hasPersistedAuthState: config.hasPersistedAuthState
      ? (params) =>
          config.hasPersistedAuthState?.({
            ...params,
            cfg: rebind(params.cfg),
          }) ?? false
      : void 0,
    resolveDefaultTo: config.resolveDefaultTo
      ? (params) =>
          config.resolveDefaultTo?.({
            ...params,
            cfg: rebind(params.cfg),
          })
      : void 0,
  };
}
function rebindChannelPluginSecrets(secrets, sourceChannelId, targetChannelId) {
  if (!secrets) return;
  return {
    ...secrets,
    secretTargetRegistryEntries: secrets.secretTargetRegistryEntries?.map((entry) => ({
      ...entry,
      id: rebindChannelScopedString(entry.id, sourceChannelId, targetChannelId),
      pathPattern: rebindChannelScopedString(entry.pathPattern, sourceChannelId, targetChannelId),
      ...(entry.refPathPattern
        ? {
            refPathPattern: rebindChannelScopedString(
              entry.refPathPattern,
              sourceChannelId,
              targetChannelId,
            ),
          }
        : {}),
    })),
    unsupportedSecretRefSurfacePatterns: secrets.unsupportedSecretRefSurfacePatterns?.map(
      (pattern) => rebindChannelScopedString(pattern, sourceChannelId, targetChannelId),
    ),
    collectRuntimeConfigAssignments: secrets.collectRuntimeConfigAssignments
      ? (params) =>
          secrets.collectRuntimeConfigAssignments?.({
            ...params,
            config: rebindChannelConfig(params.config, sourceChannelId, targetChannelId),
          })
      : void 0,
  };
}
function cloneChannelPluginForChannelId(plugin, channelId) {
  if (plugin.id === channelId && plugin.meta.id === channelId) return plugin;
  const sourceChannelId = plugin.id;
  return {
    ...plugin,
    id: channelId,
    meta: {
      ...plugin.meta,
      id: channelId,
    },
    config: rebindChannelPluginConfig(plugin.config, sourceChannelId, channelId),
    secrets: rebindChannelPluginSecrets(plugin.secrets, sourceChannelId, channelId),
  };
}
function addSetupChannelPlugins(byId, setups, options) {
  for (const setup of setups) {
    const ownedMissingChannelIds = options.ownedMissingChannelIdsByPluginId
      .get(setup.pluginId)
      ?.filter(isSafeManifestChannelId);
    if (!ownedMissingChannelIds || ownedMissingChannelIds.length === 0) continue;
    if (ownedMissingChannelIds.includes(setup.plugin.id)) {
      addChannelPlugins(byId, [setup.plugin], {
        onlyIds: new Set(ownedMissingChannelIds),
        allowOverwrite: false,
      });
      addChannelPlugins(
        byId,
        ownedMissingChannelIds
          .filter((channelId) => channelId !== setup.plugin.id)
          .map((channelId) => cloneChannelPluginForChannelId(setup.plugin, channelId)),
        {
          onlyIds: new Set(ownedMissingChannelIds),
          allowOverwrite: false,
        },
      );
      continue;
    }
    const ownedChannelIds = (options.ownedChannelIdsByPluginId.get(setup.pluginId) ?? []).filter(
      isSafeManifestChannelId,
    );
    if (setup.plugin.id !== setup.pluginId && !ownedChannelIds.includes(setup.plugin.id)) continue;
    addChannelPlugins(
      byId,
      ownedMissingChannelIds.map((channelId) =>
        cloneChannelPluginForChannelId(setup.plugin, channelId),
      ),
      {
        onlyIds: new Set(ownedMissingChannelIds),
        allowOverwrite: false,
      },
    );
  }
}
function addManifestChannelPlugins(byId, records, options) {
  const channelIds = new Set(options.channelIds);
  for (const record of records) {
    if (!options.pluginIds.has(record.id)) continue;
    for (const channelId of record.channels) {
      if (!isSafeManifestChannelId(channelId)) continue;
      if (!channelIds.has(channelId)) continue;
      if (!canUseManifestChannelPlugin(record, channelId)) continue;
      addChannelPlugins(
        byId,
        [
          buildManifestChannelPlugin({
            record,
            channelId,
          }),
        ],
        {
          onlyIds: channelIds,
          allowOverwrite: false,
        },
      );
    }
  }
}
function resolveReadOnlyWorkspaceDir(cfg, options) {
  return options.workspaceDir ?? resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
}
function listExternalChannelManifestRecords(records) {
  return records.filter((plugin) => plugin.origin !== "bundled" && plugin.channels.length > 0);
}
function listBundledChannelManifestRecords(records) {
  return records.filter((plugin) => plugin.origin === "bundled" && plugin.channels.length > 0);
}
function listPluginIdsForChannels(records, channelIds) {
  const requestedChannelIds = new Set(channelIds);
  return records
    .filter((plugin) => plugin.channels.some((channelId) => requestedChannelIds.has(channelId)))
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
}
function resolveExternalReadOnlyChannelPluginIds(params) {
  if (params.channelIds.length === 0) return [];
  const candidatePluginIds = resolveDiscoverableScopedChannelPluginIds({
    config: params.cfg,
    activationSourceConfig: params.activationSourceConfig,
    channelIds: params.channelIds,
    workspaceDir: params.workspaceDir,
    env: params.env,
    manifestRecords: params.records,
  });
  if (candidatePluginIds.length === 0) return [];
  const requestedChannelIds = new Set(params.channelIds);
  const candidatePluginIdSet = new Set(candidatePluginIds);
  return params.records
    .filter(
      (plugin) =>
        candidatePluginIdSet.has(plugin.id) &&
        plugin.channels.some((channelId) => requestedChannelIds.has(channelId)),
    )
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
}
function listReadOnlyChannelPluginsForConfig(cfg, options) {
  return resolveReadOnlyChannelPluginsForConfig(cfg, options).plugins;
}
function resolveReadOnlyChannelPluginsForConfig(cfg, options = {}) {
  const env = options.env ?? process.env;
  const workspaceDir = resolveReadOnlyWorkspaceDir(cfg, options);
  const loadedChannelPlugins = listChannelPlugins();
  const cacheKey = resolveReadOnlyChannelPluginResolutionCacheKey({
    cfg,
    options,
    env,
    loadedChannelPlugins,
    workspaceDir,
  });
  const cached = cacheKey ? readOnlyChannelPluginResolutionCache.get(cacheKey) : void 0;
  if (cached) return cloneReadOnlyChannelPluginResolution(cached);
  const manifestRecords = resolvePluginMetadataSnapshot({
    config: cfg,
    stateDir: options.stateDir,
    workspaceDir,
    env,
    allowWorkspaceScopedCurrent: true,
  }).plugins;
  const bundledManifestRecords = listBundledChannelManifestRecords(manifestRecords);
  const externalManifestRecords = listExternalChannelManifestRecords(manifestRecords);
  const activationSourceConfig = options.activationSourceConfig ?? cfg;
  const configuredChannelIds = uniqueStrings([
    ...listConfiguredChannelIdsForReadOnlyScope({
      config: cfg,
      activationSourceConfig,
      workspaceDir,
      env,
      includePersistedAuthState: options.includePersistedAuthState,
      manifestRecords,
    }),
    ...(activationSourceConfig === cfg
      ? []
      : listConfiguredChannelIdsForReadOnlyScope({
          config: activationSourceConfig,
          activationSourceConfig,
          workspaceDir,
          env,
          includePersistedAuthState: options.includePersistedAuthState,
          manifestRecords,
        })),
  ]).filter(isSafeManifestChannelId);
  const byId = /* @__PURE__ */ new Map();
  const loadFailures = [];
  addChannelPlugins(byId, loadedChannelPlugins);
  if (options.includeSetupFallbackPlugins === true)
    for (const channelId of configuredChannelIds) {
      if (byId.has(channelId)) continue;
      const setupResults = bundledManifestRecords
        .filter((record) => record.channels.includes(channelId))
        .map((record) =>
          loadSetupChannelPluginFromManifestRecord({
            record,
            channelId,
          }),
        );
      loadFailures.push(
        ...setupResults.map((result) => result.failure).filter((failure) => Boolean(failure)),
      );
      addChannelPlugins(byId, [
        setupResults.map((result) => result.plugin).find((plugin) => plugin) ??
          getBundledChannelSetupPlugin(channelId, env),
      ]);
    }
  const bundledManifestMissingChannelIds = configuredChannelIds.filter(
    (channelId) => !byId.has(channelId),
  );
  addManifestChannelPlugins(byId, bundledManifestRecords, {
    pluginIds: new Set(
      listPluginIdsForChannels(bundledManifestRecords, bundledManifestMissingChannelIds),
    ),
    channelIds: bundledManifestMissingChannelIds,
  });
  const missingConfiguredChannelIds = configuredChannelIds.filter(
    (channelId) => !byId.has(channelId),
  );
  const externalPluginIds = resolveExternalReadOnlyChannelPluginIds({
    cfg,
    activationSourceConfig: options.activationSourceConfig ?? cfg,
    channelIds: missingConfiguredChannelIds,
    records: externalManifestRecords,
    workspaceDir,
    env,
  });
  if (externalPluginIds.length > 0) {
    const externalPluginIdSet = new Set(externalPluginIds);
    const ownedChannelIdsByPluginId = new Map(
      externalManifestRecords
        .filter((record) => externalPluginIdSet.has(record.id))
        .map((record) => [record.id, record.channels]),
    );
    if (missingConfiguredChannelIds.length > 0 && options.includeSetupFallbackPlugins === true) {
      const missingChannelIdSet = new Set(missingConfiguredChannelIds);
      const ownedMissingChannelIdsByPluginId = new Map(
        [...ownedChannelIdsByPluginId].map(([pluginId, channelIds]) => [
          pluginId,
          channelIds.filter((channelId) => missingChannelIdSet.has(channelId)),
        ]),
      );
      const registry = loadPluginLoaderModule().loadOpenClawPlugins({
        config: cfg,
        activationSourceConfig: options.activationSourceConfig ?? cfg,
        env,
        workspaceDir,
        cache: false,
        activate: false,
        includeSetupOnlyChannelPlugins: true,
        forceSetupOnlyChannelPlugins: true,
        requireSetupEntryForSetupOnlyChannelPlugins: true,
        onlyPluginIds: externalPluginIds,
      });
      loadFailures.push(
        ...collectChannelPluginLoadFailuresFromDiagnostics({
          diagnostics: registry.diagnostics,
          records: externalManifestRecords,
          channelIds: missingConfiguredChannelIds,
        }),
      );
      addSetupChannelPlugins(byId, registry.channelSetups, {
        ownedChannelIdsByPluginId,
        ownedMissingChannelIdsByPluginId,
      });
    }
    addManifestChannelPlugins(byId, externalManifestRecords, {
      pluginIds: externalPluginIdSet,
      channelIds: missingConfiguredChannelIds.filter((channelId) => !byId.has(channelId)),
    });
  }
  const resolution = {
    plugins: [...byId.values()],
    configuredChannelIds,
    missingConfiguredChannelIds: configuredChannelIds.filter((channelId) => !byId.has(channelId)),
    loadFailures,
  };
  if (cacheKey) rememberReadOnlyChannelPluginResolution(cacheKey, resolution);
  return cloneReadOnlyChannelPluginResolution(resolution);
}
//#endregion
export {
  listReadOnlyChannelPluginsForConfig as n,
  resolveReadOnlyChannelPluginsForConfig as r,
  listPluginLoaderModuleCandidateUrls as t,
};
