import fs from "node:fs";
import path from "node:path";
import {
  a as tracePluginLifecyclePhase,
  i as normalizePluginDependencySpecs,
} from "./discovery-Df2IhoW5.js";
import {
  f as extractPluginInstallRecordsFromInstalledPluginIndex,
  g as hashJson,
} from "./installed-plugin-index-lBfkb-7L.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import {
  o as normalizeManifestChannelCommandDefaults,
  r as getPackageManifestMetadata,
  t as DEFAULT_PLUGIN_ENTRY_CANDIDATES,
} from "./manifest-DnFAzqZi.js";
import "./json-files-CTWRDHag.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { f as safeRealpathSync, i as isPathInside } from "./path-DILYn_gk.js";
import "./path-safety-4zNHq1Ot.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as normalizeOptionalTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/manifest-registry-installed.ts
/** Builds manifest registry records from installed plugin index snapshots. */
const installedManifestRegistryIndexFingerprintCache = /* @__PURE__ */ new WeakMap();
const installedPackageJsonPathCache = /* @__PURE__ */ new Map();
const installedPackageMetadataCache = /* @__PURE__ */ new Map();
const installedManifestRegistryRealpathCache = /* @__PURE__ */ new Map();
const MAX_INSTALLED_PACKAGE_JSON_PATH_CACHE_ENTRIES = 256;
const MAX_INSTALLED_PACKAGE_METADATA_CACHE_ENTRIES = 256;
const MAX_INSTALLED_MANIFEST_REGISTRY_REALPATH_CACHE_ENTRIES = 512;
function clearInstalledManifestRegistryProcessCaches() {
  installedPackageJsonPathCache.clear();
  installedPackageMetadataCache.clear();
  installedManifestRegistryRealpathCache.clear();
}
registerPluginMetadataProcessMemoLifecycleClear(clearInstalledManifestRegistryProcessCaches);
function isDeepFrozenJsonLike(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (!value || typeof value !== "object") return true;
  const object = value;
  if (seen.has(object)) return true;
  if (!Object.isFrozen(object)) return false;
  seen.add(object);
  return Object.values(value).every((entry) => isDeepFrozenJsonLike(entry, seen));
}
function hasPersistedFileSignatures(index) {
  return index.plugins.every(
    (record) =>
      record.manifestFile !== void 0 &&
      (record.packageJson === void 0 || record.packageJson.fileSignature !== void 0),
  );
}
function isInstalledManifestRegistryIndexFingerprintCacheable(index) {
  return hasPersistedFileSignatures(index) && isDeepFrozenJsonLike(index);
}
function isRelativePathInsideOrEqual(relativePath) {
  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}
function resolvePackageJsonPath(record, realpathCache) {
  if (!record.packageJson?.path) return;
  const cacheKey = buildInstalledPackageJsonPathCacheKey(record);
  if (cacheKey) {
    const cached = installedPackageJsonPathCache.get(cacheKey);
    if (cached !== void 0) return cached ?? void 0;
  }
  const rootDir = resolveInstalledPluginRootDir(record);
  const realRootDir = safeRealpathSync(rootDir, realpathCache) ?? path.resolve(rootDir);
  const packageJsonPath = path.resolve(realRootDir, record.packageJson.path);
  if (!isRelativePathInsideOrEqual(path.relative(realRootDir, packageJsonPath)))
    return rememberInstalledPackageJsonPath(cacheKey, void 0);
  const packageJsonRealPath = safeRealpathSync(packageJsonPath, realpathCache);
  if (!packageJsonRealPath || !isPathInside(realRootDir, packageJsonRealPath))
    return rememberInstalledPackageJsonPath(cacheKey, void 0);
  return rememberInstalledPackageJsonPath(cacheKey, packageJsonPath);
}
function safeFileSignature(filePath) {
  if (!filePath) return;
  try {
    return formatFileSignature(filePath, fs.statSync(filePath));
  } catch {
    return `${filePath}:missing`;
  }
}
function formatFileSignature(filePath, signature) {
  return `${filePath}:${signature.size}:${signature.mtimeMs}`;
}
function rememberInstalledPackageMetadata(key, metadata) {
  if (!key) return metadata;
  installedPackageMetadataCache.set(key, metadata);
  while (installedPackageMetadataCache.size > MAX_INSTALLED_PACKAGE_METADATA_CACHE_ENTRIES) {
    const oldest = installedPackageMetadataCache.keys().next().value;
    if (oldest === void 0) break;
    installedPackageMetadataCache.delete(oldest);
  }
  return metadata;
}
function rememberInstalledPackageJsonPath(key, packageJsonPath) {
  if (!key) return packageJsonPath;
  installedPackageJsonPathCache.set(key, packageJsonPath ?? null);
  while (installedPackageJsonPathCache.size > MAX_INSTALLED_PACKAGE_JSON_PATH_CACHE_ENTRIES) {
    const oldest = installedPackageJsonPathCache.keys().next().value;
    if (oldest === void 0) break;
    installedPackageJsonPathCache.delete(oldest);
  }
  return packageJsonPath;
}
function trimInstalledManifestRegistryRealpathCache() {
  while (
    installedManifestRegistryRealpathCache.size >
    MAX_INSTALLED_MANIFEST_REGISTRY_REALPATH_CACHE_ENTRIES
  ) {
    const oldest = installedManifestRegistryRealpathCache.keys().next().value;
    if (oldest === void 0) break;
    installedManifestRegistryRealpathCache.delete(oldest);
  }
}
function buildInstalledPackageJsonPathCacheKey(record) {
  if (!record.packageJson?.path || !record.packageJson.hash) return;
  return hashJson({
    rootDir: path.resolve(resolveInstalledPluginRootDir(record)),
    packageJson: record.packageJson,
  });
}
function buildInstalledPackageMetadataCacheKey(params) {
  if (!params.packageJsonPath || !params.record.packageJson?.hash) return;
  return hashJson({
    packageJsonPath: path.resolve(params.packageJsonPath),
    packageJson: params.record.packageJson,
    packageChannel: params.record.packageChannel ?? null,
  });
}
function buildInstalledManifestRegistryIndexKey(index) {
  return {
    version: index.version,
    hostContractVersion: index.hostContractVersion,
    compatRegistryVersion: index.compatRegistryVersion,
    migrationVersion: index.migrationVersion,
    policyHash: index.policyHash,
    installRecords: index.installRecords,
    diagnostics: index.diagnostics,
    plugins: index.plugins.map((record) => {
      const packageJsonPath = resolvePackageJsonPath(
        record,
        installedManifestRegistryRealpathCache,
      );
      trimInstalledManifestRegistryRealpathCache();
      const packageJsonFile = record.packageJson?.fileSignature
        ? packageJsonPath
          ? formatFileSignature(packageJsonPath, record.packageJson.fileSignature)
          : void 0
        : safeFileSignature(packageJsonPath);
      return {
        pluginId: record.pluginId,
        packageName: record.packageName,
        packageVersion: record.packageVersion,
        installRecord: record.installRecord,
        installRecordHash: record.installRecordHash,
        packageInstall: record.packageInstall,
        packageChannel: record.packageChannel,
        manifestPath: record.manifestPath,
        manifestHash: record.manifestHash,
        manifestFile: record.manifestFile
          ? formatFileSignature(record.manifestPath, record.manifestFile)
          : safeFileSignature(record.manifestPath),
        format: record.format,
        bundleFormat: record.bundleFormat,
        source: record.source,
        setupSource: record.setupSource,
        packageJson: record.packageJson,
        packageJsonFile,
        rootDir: record.rootDir,
        origin: record.origin,
        enabled: record.enabled,
        enabledByDefault: record.enabledByDefault,
        enabledByDefaultOnPlatforms: record.enabledByDefaultOnPlatforms
          ? [...record.enabledByDefaultOnPlatforms]
          : void 0,
        syntheticAuthRefs: record.syntheticAuthRefs,
        startup: record.startup,
        compat: record.compat,
      };
    }),
  };
}
function resolveInstalledManifestRegistryIndexFingerprint(index) {
  const cached = installedManifestRegistryIndexFingerprintCache.get(index);
  if (cached) return cached;
  const fingerprint = hashJson(buildInstalledManifestRegistryIndexKey(index));
  if (isInstalledManifestRegistryIndexFingerprintCacheable(index))
    installedManifestRegistryIndexFingerprintCache.set(index, fingerprint);
  return fingerprint;
}
function resolveInstalledPluginRootDir(record) {
  return record.rootDir || path.dirname(record.manifestPath || process.cwd());
}
function resolveFallbackPluginSource(record) {
  const rootDir = resolveInstalledPluginRootDir(record);
  for (const entry of DEFAULT_PLUGIN_ENTRY_CANDIDATES) {
    const candidate = path.join(rootDir, entry);
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.join(rootDir, DEFAULT_PLUGIN_ENTRY_CANDIDATES[0]);
}
function normalizePackageChannelExposure(exposure) {
  if (!isRecord(exposure)) return;
  const configured = typeof exposure.configured === "boolean" ? exposure.configured : void 0;
  const setup = typeof exposure.setup === "boolean" ? exposure.setup : void 0;
  const docs = typeof exposure.docs === "boolean" ? exposure.docs : void 0;
  return configured !== void 0 || setup !== void 0 || docs !== void 0
    ? {
        ...(configured !== void 0 ? { configured } : {}),
        ...(setup !== void 0 ? { setup } : {}),
        ...(docs !== void 0 ? { docs } : {}),
      }
    : void 0;
}
function normalizePackageChannelConfiguredState(configuredState) {
  if (!isRecord(configuredState)) return;
  const env = isRecord(configuredState.env)
    ? {
        ...(normalizeOptionalTrimmedStringList(configuredState.env.allOf)?.length
          ? { allOf: normalizeOptionalTrimmedStringList(configuredState.env.allOf) }
          : {}),
        ...(normalizeOptionalTrimmedStringList(configuredState.env.anyOf)?.length
          ? { anyOf: normalizeOptionalTrimmedStringList(configuredState.env.anyOf) }
          : {}),
      }
    : void 0;
  const specifier = normalizeOptionalString(configuredState.specifier);
  const exportName = normalizeOptionalString(configuredState.exportName);
  return specifier || exportName || (env && Object.keys(env).length > 0)
    ? {
        ...(specifier ? { specifier } : {}),
        ...(exportName ? { exportName } : {}),
        ...(env && Object.keys(env).length > 0 ? { env } : {}),
      }
    : void 0;
}
function normalizePackageChannelPersistedAuthState(persistedAuthState) {
  if (!isRecord(persistedAuthState)) return;
  const specifier = normalizeOptionalString(persistedAuthState.specifier);
  const exportName = normalizeOptionalString(persistedAuthState.exportName);
  return specifier || exportName
    ? {
        ...(specifier ? { specifier } : {}),
        ...(exportName ? { exportName } : {}),
      }
    : void 0;
}
function normalizePackageChannelDoctorCapabilities(doctorCapabilities) {
  if (!isRecord(doctorCapabilities)) return;
  const dmAllowFromMode =
    doctorCapabilities.dmAllowFromMode === "topOnly" ||
    doctorCapabilities.dmAllowFromMode === "topOrNested" ||
    doctorCapabilities.dmAllowFromMode === "nestedOnly"
      ? doctorCapabilities.dmAllowFromMode
      : void 0;
  const groupModel =
    doctorCapabilities.groupModel === "sender" ||
    doctorCapabilities.groupModel === "route" ||
    doctorCapabilities.groupModel === "hybrid"
      ? doctorCapabilities.groupModel
      : void 0;
  const groupAllowFromFallbackToAllowFrom =
    typeof doctorCapabilities.groupAllowFromFallbackToAllowFrom === "boolean"
      ? doctorCapabilities.groupAllowFromFallbackToAllowFrom
      : void 0;
  const warnOnEmptyGroupSenderAllowlist =
    typeof doctorCapabilities.warnOnEmptyGroupSenderAllowlist === "boolean"
      ? doctorCapabilities.warnOnEmptyGroupSenderAllowlist
      : void 0;
  return dmAllowFromMode ||
    groupModel ||
    groupAllowFromFallbackToAllowFrom !== void 0 ||
    warnOnEmptyGroupSenderAllowlist !== void 0
    ? {
        ...(dmAllowFromMode ? { dmAllowFromMode } : {}),
        ...(groupModel ? { groupModel } : {}),
        ...(groupAllowFromFallbackToAllowFrom !== void 0
          ? { groupAllowFromFallbackToAllowFrom }
          : {}),
        ...(warnOnEmptyGroupSenderAllowlist !== void 0 ? { warnOnEmptyGroupSenderAllowlist } : {}),
      }
    : void 0;
}
function normalizePackageChannelCliOptions(cliAddOptions) {
  if (!Array.isArray(cliAddOptions)) return;
  const normalized = cliAddOptions.flatMap((option) => {
    if (!isRecord(option)) return [];
    const flags = normalizeOptionalString(option.flags);
    const description = normalizeOptionalString(option.description);
    if (!flags || !description) return [];
    const defaultValue =
      typeof option.defaultValue === "boolean" || typeof option.defaultValue === "string"
        ? option.defaultValue
        : void 0;
    return [
      {
        flags,
        description,
        ...(defaultValue !== void 0 ? { defaultValue } : {}),
      },
    ];
  });
  return normalized.length > 0 ? normalized : void 0;
}
function normalizePersistedPackageChannel(value) {
  if (!isRecord(value)) return;
  const id = normalizeOptionalString(value.id);
  if (!id) return;
  const channel = { id };
  for (const key of [
    "label",
    "selectionLabel",
    "detailLabel",
    "docsPath",
    "docsLabel",
    "blurb",
    "systemImage",
    "selectionDocsPrefix",
  ]) {
    const normalized = normalizeOptionalString(value[key]);
    if (normalized) channel[key] = normalized;
  }
  if (typeof value.order === "number" && Number.isFinite(value.order)) channel.order = value.order;
  for (const key of ["aliases", "preferOver", "selectionExtras"]) {
    const normalized = normalizeOptionalTrimmedStringList(value[key]);
    if (normalized?.length) channel[key] = normalized;
  }
  for (const key of [
    "selectionDocsOmitLabel",
    "markdownCapable",
    "showConfigured",
    "showInSetup",
    "quickstartAllowFrom",
    "forceAccountBinding",
    "preferSessionLookupForAnnounceTarget",
  ])
    if (typeof value[key] === "boolean") channel[key] = value[key];
  const exposure = normalizePackageChannelExposure(value.exposure);
  if (exposure) channel.exposure = exposure;
  const commands = normalizeManifestChannelCommandDefaults(value.commands);
  if (commands) channel.commands = commands;
  const configuredState = normalizePackageChannelConfiguredState(value.configuredState);
  if (configuredState) channel.configuredState = configuredState;
  const persistedAuthState = normalizePackageChannelPersistedAuthState(value.persistedAuthState);
  if (persistedAuthState) channel.persistedAuthState = persistedAuthState;
  const doctorCapabilities = normalizePackageChannelDoctorCapabilities(value.doctorCapabilities);
  if (doctorCapabilities) channel.doctorCapabilities = doctorCapabilities;
  const cliAddOptions = normalizePackageChannelCliOptions(value.cliAddOptions);
  if (cliAddOptions) channel.cliAddOptions = cliAddOptions;
  return channel;
}
function resolveInstalledPackageMetadata(record, realpathCache) {
  const recordPackageChannel = normalizePersistedPackageChannel(record.packageChannel);
  const fallbackPackageManifest = recordPackageChannel ? { channel: recordPackageChannel } : void 0;
  const packageJsonPath = record.packageJson?.path
    ? resolvePackageJsonPath(record, realpathCache)
    : void 0;
  const cacheKey = buildInstalledPackageMetadataCacheKey({
    packageJsonPath,
    record,
  });
  const cached = cacheKey ? installedPackageMetadataCache.get(cacheKey) : void 0;
  if (cached) return cached;
  if (!packageJsonPath)
    return rememberInstalledPackageMetadata(
      cacheKey,
      fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {},
    );
  const packageJson = tryReadJsonSync(packageJsonPath);
  if (packageJson) {
    const packageManifest = getPackageManifestMetadata(packageJson);
    const dependencies = normalizePluginDependencySpecs({
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies,
    });
    if (!packageManifest)
      return rememberInstalledPackageMetadata(cacheKey, {
        ...(fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {}),
        packageDependencies: dependencies.dependencies,
        packageOptionalDependencies: dependencies.optionalDependencies,
      });
    const packageChannel = normalizePersistedPackageChannel(packageManifest.channel);
    const channel =
      recordPackageChannel || packageChannel
        ? {
            ...recordPackageChannel,
            ...packageChannel,
          }
        : void 0;
    const { channel: _ignoredChannel, ...packageManifestWithoutChannel } = packageManifest;
    return rememberInstalledPackageMetadata(cacheKey, {
      packageManifest: {
        ...packageManifestWithoutChannel,
        ...(channel ? { channel } : {}),
      },
      packageDependencies: dependencies.dependencies,
      packageOptionalDependencies: dependencies.optionalDependencies,
    });
  }
  return rememberInstalledPackageMetadata(
    cacheKey,
    fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {},
  );
}
function toPluginCandidate(record, realpathCache) {
  const rootDir = resolveInstalledPluginRootDir(record);
  const packageMetadata = resolveInstalledPackageMetadata(record, realpathCache);
  return {
    idHint: record.pluginId,
    source: record.source ?? resolveFallbackPluginSource(record),
    ...(record.setupSource ? { setupSource: record.setupSource } : {}),
    rootDir,
    origin: record.origin,
    ...(record.format ? { format: record.format } : {}),
    ...(record.bundleFormat ? { bundleFormat: record.bundleFormat } : {}),
    ...(record.packageName ? { packageName: record.packageName } : {}),
    ...(record.packageVersion ? { packageVersion: record.packageVersion } : {}),
    ...(packageMetadata.packageManifest
      ? { packageManifest: packageMetadata.packageManifest }
      : {}),
    ...(packageMetadata.packageDependencies
      ? { packageDependencies: packageMetadata.packageDependencies }
      : {}),
    ...(packageMetadata.packageOptionalDependencies
      ? { packageOptionalDependencies: packageMetadata.packageOptionalDependencies }
      : {}),
    packageDir: rootDir,
  };
}
function loadPluginManifestRegistryForInstalledIndex(params) {
  return tracePluginLifecyclePhase(
    "manifest registry",
    () => {
      if (params.pluginIds && params.pluginIds.length === 0)
        return {
          plugins: [],
          diagnostics: [],
        };
      const env = params.env ?? process.env;
      const pluginIdSet = params.pluginIds?.length ? new Set(params.pluginIds) : null;
      const realpathCache = /* @__PURE__ */ new Map();
      const diagnostics = pluginIdSet
        ? params.index.diagnostics.filter((diagnostic) => {
            const pluginId = diagnostic.pluginId;
            return !pluginId || pluginIdSet.has(pluginId);
          })
        : params.index.diagnostics;
      const candidates = params.index.plugins
        .filter((plugin) => params.includeDisabled || plugin.enabled)
        .filter((plugin) => !pluginIdSet || pluginIdSet.has(plugin.pluginId))
        .map((plugin) => toPluginCandidate(plugin, realpathCache));
      return loadPluginManifestRegistry({
        config: params.config,
        workspaceDir: params.workspaceDir,
        env,
        candidates,
        diagnostics: [...diagnostics],
        installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(params.index),
        ...(params.bundledChannelConfigCollector
          ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector }
          : {}),
      });
    },
    {
      includeDisabled: params.includeDisabled === true,
      pluginIdCount: params.pluginIds?.length,
      indexPluginCount: params.index.plugins.length,
    },
  );
}
//#endregion
export {
  resolveInstalledManifestRegistryIndexFingerprint as n,
  loadPluginManifestRegistryForInstalledIndex as t,
};
