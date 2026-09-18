import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  f as resolveBundledChannelRootScope,
  m as resolveExistingPluginModulePath,
  p as loadChannelPluginModule,
} from "./bundled-CmD3EzUu.js";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-nHtompjW.js";
import { i as hasNonEmptyString } from "./channel-target-Bp_kJEK2.js";
import "./utils-DtcDeqWS.js";
import { c as isBundledSourceOverlayPath } from "./discovery-Df2IhoW5.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { o as listOfficialExternalChannelEnvVars } from "./official-external-plugin-catalog-B2V9K3em.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CDpLvLFE.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  d as normalizeTrimmedStringList,
} from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/channels/plugins/package-state-probes.ts
/**
 * Bundled channel package-state probes.
 *
 * Resolves lightweight configured/auth state checkers from package metadata and source overlays.
 */
const log = createSubsystemLogger("channels");
const sourcePackageStateLoaderCache = /* @__PURE__ */ new Map();
function isSourceModulePath(modulePath) {
  return /\.(?:c|m)?tsx?$/iu.test(modulePath);
}
function loadChannelPackageStateModule(params) {
  try {
    return loadChannelPluginModule(params);
  } catch (error) {
    if (!isSourceModulePath(params.modulePath)) throw error;
    return getCachedPluginModuleLoader({
      cache: sourcePackageStateLoaderCache,
      modulePath: params.modulePath,
      importerUrl: import.meta.url,
      tryNative: true,
      cacheScopeKey: "channel-package-state",
    })(params.modulePath);
  }
}
function hasNonEmptyEnvValue(env, key) {
  return typeof env?.[key] === "string" && env[key].trim().length > 0;
}
function resolveSourceBundledPluginRoot(rootDir) {
  const pluginRoot = path.resolve(rootDir);
  const extensionsDir = path.dirname(pluginRoot);
  if (path.basename(extensionsDir) !== "extensions") return null;
  const packageRoot = path.dirname(extensionsDir);
  if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime")
    return null;
  return {
    packageRoot,
    dirName: path.basename(pluginRoot),
  };
}
function isBundledSourceOverlayPluginRoot(rootDir) {
  const pluginRoot = path.resolve(rootDir);
  return (
    isBundledSourceOverlayPath({ sourcePath: pluginRoot }) ||
    (path.basename(path.dirname(pluginRoot)) === "extensions" &&
      isBundledSourceOverlayPath({ sourcePath: path.dirname(pluginRoot) }))
  );
}
function listBuiltBundledPackageStateModules(params) {
  if (isBundledSourceOverlayPluginRoot(params.rootDir)) return [];
  const sourceRoot = resolveSourceBundledPluginRoot(params.rootDir);
  if (!sourceRoot) return [];
  const locations = [];
  for (const rootDir of [
    path.join(sourceRoot.packageRoot, "dist", "extensions", sourceRoot.dirName),
    path.join(sourceRoot.packageRoot, "dist-runtime", "extensions", sourceRoot.dirName),
  ]) {
    const modulePath = resolveExistingPluginModulePath(rootDir, params.specifier);
    if (fs.existsSync(modulePath) && !isSourceModulePath(modulePath))
      locations.push({
        modulePath,
        rootDir,
      });
  }
  return locations;
}
function resolveChannelPackageStateModuleLocation(params) {
  return {
    modulePath: resolveExistingPluginModulePath(params.entry.rootDir, params.specifier),
    rootDir: params.entry.rootDir,
  };
}
function listChannelPackageStateModuleLocations(params) {
  const source = resolveChannelPackageStateModuleLocation(params);
  return [
    ...listBuiltBundledPackageStateModules({
      rootDir: params.entry.rootDir,
      specifier: params.specifier,
    }).filter((location) => location.modulePath !== source.modulePath),
    source,
  ];
}
function resolveChannelPackageStateMetadata(entry, metadataKey) {
  const metadata = entry.channel[metadataKey];
  if (!metadata || typeof metadata !== "object") return null;
  const specifier = normalizeOptionalString(metadata.specifier) ?? "";
  const exportName = normalizeOptionalString(metadata.exportName) ?? "";
  const envMetadata = "env" in metadata ? metadata.env : void 0;
  const allOf = normalizeTrimmedStringList(envMetadata?.allOf);
  const anyOf = normalizeTrimmedStringList(envMetadata?.anyOf);
  const env =
    allOf.length > 0 || anyOf.length > 0
      ? {
          allOf,
          anyOf,
        }
      : void 0;
  if ((!specifier || !exportName) && !env) return null;
  return {
    ...(specifier ? { specifier } : {}),
    ...(exportName ? { exportName } : {}),
    ...(env ? { env } : {}),
  };
}
function listChannelPackageStateCatalog(metadataKey, discovery) {
  return listChannelCatalogEntries({
    origin: "bundled",
    discovery,
  }).filter((entry) => Boolean(resolveChannelPackageStateMetadata(entry, metadataKey)));
}
function resolveChannelPackageStateChecker(params) {
  const metadata = resolveChannelPackageStateMetadata(params.entry, params.metadataKey);
  if (!metadata) return null;
  if (metadata.env)
    return ({ env }) => {
      const allOf = metadata.env?.allOf ?? [];
      const anyOf = metadata.env?.anyOf ?? [];
      return (
        allOf.every((key) => hasNonEmptyEnvValue(env, key)) &&
        (anyOf.length === 0 || anyOf.some((key) => hasNonEmptyEnvValue(env, key)))
      );
    };
  let loadError;
  for (const location of listChannelPackageStateModuleLocations({
    entry: params.entry,
    specifier: metadata.specifier,
  }))
    try {
      const checker = loadChannelPackageStateModule({
        modulePath: location.modulePath,
        rootDir: location.rootDir,
      })[metadata.exportName];
      if (typeof checker !== "function")
        throw new Error(`missing ${params.metadataKey} export ${metadata.exportName}`);
      return checker;
    } catch (error) {
      loadError = error;
    }
  if (loadError) {
    const detail = formatErrorMessage(loadError);
    log.warn(
      `[channels] failed to load ${params.metadataKey} checker for ${params.entry.pluginId}: ${detail}`,
    );
  }
  return null;
}
function resolvePackageStateChannelId(entry) {
  return normalizeOptionalString(entry.channel.id);
}
/**
 * Lists bundled channel ids that declare the requested package-state metadata.
 */
function listBundledChannelIdsForPackageState(metadataKey, discovery) {
  return listChannelPackageStateCatalog(metadataKey, discovery)
    .map((entry) => resolvePackageStateChannelId(entry))
    .filter((channelId) => Boolean(channelId))
    .toSorted((left, right) => left.localeCompare(right));
}
/**
 * Returns whether a bundled channel reports configured/auth package state.
 */
function hasBundledChannelPackageState(params) {
  const requestedChannelId = normalizeOptionalString(params.channelId);
  const entry = listChannelPackageStateCatalog(params.metadataKey, params.discovery).find(
    (candidate) => resolvePackageStateChannelId(candidate) === requestedChannelId,
  );
  if (!entry) return false;
  const checker = resolveChannelPackageStateChecker({
    entry,
    metadataKey: params.metadataKey,
  });
  return checker
    ? checker({
        cfg: params.cfg,
        env: params.env,
      })
    : false;
}
//#endregion
//#region src/channels/plugins/persisted-auth-state.ts
/**
 * Lists bundled channels that declare persisted-auth state metadata.
 */
function listBundledChannelIdsWithPersistedAuthState(discovery) {
  return listBundledChannelIdsForPackageState("persistedAuthState", discovery);
}
/**
 * Returns whether a bundled channel reports persisted auth state.
 */
function hasBundledChannelPersistedAuthState(params) {
  return hasBundledChannelPackageState({
    metadataKey: "persistedAuthState",
    channelId: params.channelId,
    cfg: params.cfg,
    env: params.env,
    discovery: params.discovery,
  });
}
//#endregion
//#region src/channels/plugins/bundled-ids.ts
/**
 * Bundled channel id listing helpers.
 *
 * Reads generated channel catalog entries for current package/cache scope.
 */
/**
 * Lists bundled channel ids for a package root/cache scope.
 */
function listBundledChannelIdsForRoot(_packageRoot, env = process.env, discovery) {
  return listChannelCatalogEntries({
    origin: "bundled",
    env,
    discovery,
  })
    .map((entry) => entry.channel.id)
    .filter((channelId) => Boolean(channelId))
    .toSorted((left, right) => left.localeCompare(right));
}
/**
 * Lists bundled channel ids for the current runtime root scope.
 */
function listBundledChannelIds(env = process.env, discovery) {
  return listBundledChannelIdsForRoot(resolveBundledChannelRootScope(env).cacheKey, env, discovery);
}
//#endregion
//#region src/channels/config-presence.ts
/**
 * Channel configuration presence detection.
 *
 * Finds channels made available by config, env, persisted auth, or plugin discovery signals.
 */
const IGNORED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
/** Returns true when a channel config entry contains settings beyond enabled/disabled state. */
function hasMeaningfulChannelConfig(value) {
  if (!isRecord(value)) return false;
  return Object.keys(value).some((key) => key !== "enabled");
}
/** Lists channels explicitly disabled in config so activation logic can suppress auto-detection. */
function listExplicitlyDisabledChannelIdsForConfig(cfg) {
  const channels = isRecord(cfg.channels) ? cfg.channels : null;
  if (!channels) return [];
  return Object.entries(channels)
    .filter(([, value]) => isRecord(value) && value.enabled === false)
    .map(([channelId]) => normalizeOptionalLowercaseString(channelId))
    .filter((channelId) => Boolean(channelId));
}
function listChannelEnvPrefixes(channelIds) {
  return channelIds.map((channelId) => [
    `${channelId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}_`,
    channelId,
  ]);
}
function hasPersistedChannelState(env) {
  return fs.existsSync(resolveStateDir(env, os.homedir));
}
let persistedAuthStateChannelIds = null;
function listPersistedAuthStateChannelIds(options) {
  const override = options.persistedAuthStateProbe?.listChannelIds();
  if (override) return override;
  if (options.discovery) return listBundledChannelIdsWithPersistedAuthState(options.discovery);
  if (persistedAuthStateChannelIds) return persistedAuthStateChannelIds;
  persistedAuthStateChannelIds = listBundledChannelIdsWithPersistedAuthState();
  return persistedAuthStateChannelIds;
}
function hasPersistedAuthState(params) {
  const override = params.options.persistedAuthStateProbe;
  if (override) return override.hasState(params);
  return hasBundledChannelPersistedAuthState({
    channelId: params.channelId,
    cfg: params.cfg,
    env: params.env,
    discovery: params.options.discovery,
  });
}
/** Lists channel ids detected from config, env vars, or persisted auth state. */
function listPotentialConfiguredChannelIds(cfg, env = process.env, options = {}) {
  return uniqueStrings(
    listPotentialConfiguredChannelPresenceSignals(cfg, env, options).map(
      (signal) => signal.channelId,
    ),
  );
}
/** Lists deduplicated channel presence signals with their detection source. */
function listPotentialConfiguredChannelPresenceSignals(cfg, env = process.env, options = {}) {
  const signals = [];
  const seenSignals = /* @__PURE__ */ new Set();
  const addSignal = (channelId, source) => {
    const key = `${source}:${channelId}`;
    if (seenSignals.has(key)) return;
    seenSignals.add(key);
    signals.push({
      channelId,
      source,
    });
  };
  const configuredChannelIds = /* @__PURE__ */ new Set();
  const channelEnvPrefixes = listChannelEnvPrefixes(
    options.channelIds ?? listBundledChannelIds(env, options.discovery),
  );
  const scopedChannelIds = options.channelIds
    ? new Set(
        options.channelIds
          .map((channelId) => normalizeOptionalLowercaseString(channelId))
          .filter((channelId) => Boolean(channelId)),
      )
    : void 0;
  const officialExternalChannelEnvVars = listOfficialExternalChannelEnvVars().filter(
    ({ channelId }) => !scopedChannelIds || scopedChannelIds.has(channelId),
  );
  const channels = isRecord(cfg.channels) ? cfg.channels : null;
  if (channels)
    for (const [key, value] of Object.entries(channels)) {
      if (IGNORED_CHANNEL_CONFIG_KEYS.has(key)) continue;
      if (hasMeaningfulChannelConfig(value)) {
        configuredChannelIds.add(key);
        addSignal(key, "config");
      }
    }
  for (const [key, value] of Object.entries(env)) {
    if (!hasNonEmptyString(value)) continue;
    for (const [prefix, channelId] of channelEnvPrefixes)
      if (key.startsWith(prefix)) {
        configuredChannelIds.add(channelId);
        addSignal(channelId, "env");
      }
    for (const { channelId, envVars } of officialExternalChannelEnvVars)
      if (envVars.includes(key)) {
        configuredChannelIds.add(channelId);
        addSignal(channelId, "env");
      }
  }
  if (options.includePersistedAuthState !== false && hasPersistedChannelState(env)) {
    for (const channelId of listPersistedAuthStateChannelIds(options))
      if (
        hasPersistedAuthState({
          channelId,
          cfg,
          env,
          options,
        })
      ) {
        configuredChannelIds.add(channelId);
        addSignal(channelId, "persisted-auth");
      }
  }
  return signals.filter((signal) => configuredChannelIds.has(signal.channelId));
}
//#endregion
export {
  hasBundledChannelPackageState as a,
  listPotentialConfiguredChannelPresenceSignals as i,
  listExplicitlyDisabledChannelIdsForConfig as n,
  listBundledChannelIdsForPackageState as o,
  listPotentialConfiguredChannelIds as r,
  hasMeaningfulChannelConfig as t,
};
