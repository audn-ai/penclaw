import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  n as getCachedPluginModuleLoader,
  t as createPluginModuleLoaderCache,
} from "./plugin-module-loader-cache-CDpLvLFE.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-BckMdz4f.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/doctor-contract-registry-loader-state.ts
/** Shared loader state for plugin doctor contracts and test fixtures. */
const pluginDoctorContractRegistryLoaderState = {
  moduleLoaders: createPluginModuleLoaderCache(),
  moduleLoaderFactory: void 0,
};
//#endregion
//#region src/plugins/doctor-contract-registry.ts
const CONTRACT_API_EXTENSIONS = [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT =
  CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) ||
  CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
function loadPluginDoctorContractModule(modulePath) {
  return getCachedPluginModuleLoader({
    cache: pluginDoctorContractRegistryLoaderState.moduleLoaders,
    modulePath,
    importerUrl: import.meta.url,
    ...(pluginDoctorContractRegistryLoaderState.moduleLoaderFactory
      ? { createLoader: pluginDoctorContractRegistryLoaderState.moduleLoaderFactory }
      : {}),
  })(modulePath);
}
function resolveContractApiPath(rootDir) {
  const orderedExtensions = RUNNING_FROM_BUILT_ARTIFACT
    ? CONTRACT_API_EXTENSIONS
    : [...CONTRACT_API_EXTENSIONS.slice(3), ...CONTRACT_API_EXTENSIONS.slice(0, 3)];
  for (const basename of ["doctor-contract-api", "contract-api"])
    for (const extension of orderedExtensions)
      for (const baseDir of [rootDir, path.join(rootDir, "dist")]) {
        const candidate = path.join(baseDir, `${basename}${extension}`);
        if (fs.existsSync(candidate)) return candidate;
      }
  return null;
}
function coerceLegacyConfigRules(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const candidate = entry;
    return Array.isArray(candidate.path) && typeof candidate.message === "string";
  });
}
function coerceNormalizeCompatibilityConfig(value) {
  return typeof value === "function" ? value : void 0;
}
function coerceSessionStoreAgentIdsResolver(value) {
  return typeof value === "function" ? value : void 0;
}
function isDoctorSessionRouteStateOwner(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.label === "string" &&
    candidate.id.trim().length > 0 &&
    candidate.label.trim().length > 0 &&
    (candidate.providerIds === void 0 ||
      normalizeTrimmedStringList(candidate.providerIds).length > 0) &&
    (candidate.runtimeIds === void 0 ||
      normalizeTrimmedStringList(candidate.runtimeIds).length > 0) &&
    (candidate.cliSessionKeys === void 0 ||
      normalizeTrimmedStringList(candidate.cliSessionKeys).length > 0) &&
    (candidate.authProfilePrefixes === void 0 ||
      normalizeTrimmedStringList(candidate.authProfilePrefixes).length > 0)
  );
}
function coerceDoctorSessionRouteStateOwners(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(isDoctorSessionRouteStateOwner).map((owner) => ({
    id: owner.id.trim(),
    label: owner.label.trim(),
    providerIds: normalizeTrimmedStringList(owner.providerIds),
    runtimeIds: normalizeTrimmedStringList(owner.runtimeIds),
    cliSessionKeys: normalizeTrimmedStringList(owner.cliSessionKeys),
    authProfilePrefixes: normalizeTrimmedStringList(owner.authProfilePrefixes),
  }));
}
function isPluginDoctorStateMigration(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.label === "string" &&
    candidate.label.trim().length > 0 &&
    typeof candidate.detectLegacyState === "function" &&
    typeof candidate.migrateLegacyState === "function"
  );
}
function coercePluginDoctorStateMigrations(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(isPluginDoctorStateMigration).map((migration) => ({
    id: migration.id.trim(),
    label: migration.label.trim(),
    detectLegacyState: migration.detectLegacyState,
    migrateLegacyState: migration.migrateLegacyState,
  }));
}
function hasLegacyElevenLabsTalkFields(raw) {
  const talk = asNullableRecord(asNullableRecord(raw)?.talk);
  if (!talk) return false;
  return ["voiceId", "voiceAliases", "modelId", "outputFormat", "apiKey"].some((key) =>
    Object.hasOwn(talk, key),
  );
}
function collectMediaProviderIds(root, ids) {
  const media = asNullableRecord(asNullableRecord(root.tools)?.media);
  if (!media) return;
  const modelLists = [
    media.models,
    asNullableRecord(media.audio)?.models,
    asNullableRecord(media.image)?.models,
    asNullableRecord(media.video)?.models,
  ];
  for (const models of modelLists) {
    if (!Array.isArray(models)) continue;
    for (const model of models) {
      const provider = asNullableRecord(model)?.provider;
      if (typeof provider === "string" && provider.trim()) ids.add(normalizeProviderId(provider));
    }
  }
}
function collectRelevantDoctorPluginIds(raw) {
  const ids = /* @__PURE__ */ new Set();
  const root = asNullableRecord(raw);
  if (!root) return [];
  const channels = asNullableRecord(root.channels);
  if (channels) {
    for (const channelId of Object.keys(channels)) if (channelId !== "defaults") ids.add(channelId);
  }
  const pluginsEntries = asNullableRecord(asNullableRecord(root.plugins)?.entries);
  if (pluginsEntries) for (const pluginId of Object.keys(pluginsEntries)) ids.add(pluginId);
  const modelProviders = asNullableRecord(asNullableRecord(root.models)?.providers);
  if (modelProviders) for (const providerId of Object.keys(modelProviders)) ids.add(providerId);
  collectMediaProviderIds(root, ids);
  if (hasLegacyElevenLabsTalkFields(root)) ids.add("elevenlabs");
  return [...ids].toSorted();
}
function collectRelevantDoctorPluginIdsForTouchedPaths(params) {
  const root = asNullableRecord(params.raw);
  if (!root) return [];
  const ids = /* @__PURE__ */ new Set();
  for (const touchedPath of params.touchedPaths) {
    const [first, second, third] = touchedPath;
    if (first === "channels") {
      if (!second) return collectRelevantDoctorPluginIds(params.raw);
      if (second !== "defaults") ids.add(second);
      continue;
    }
    if (first === "plugins") {
      if (second !== "entries" || !third) return collectRelevantDoctorPluginIds(params.raw);
      ids.add(third);
      continue;
    }
    if (first === "models") {
      if (second !== "providers" || !third) return collectRelevantDoctorPluginIds(params.raw);
      ids.add(third);
      continue;
    }
    if (first === "tools" && second === "media") {
      collectMediaProviderIds(root, ids);
      continue;
    }
    if (first === "talk" && hasLegacyElevenLabsTalkFields(root)) ids.add("elevenlabs");
  }
  return [...ids].toSorted();
}
function loadPluginDoctorContractEntry(record) {
  const contractSource = resolveContractApiPath(record.rootDir);
  if (!contractSource) return null;
  let mod;
  try {
    mod = loadPluginDoctorContractModule(contractSource);
  } catch {
    return null;
  }
  const rules = coerceLegacyConfigRules(mod.default?.legacyConfigRules ?? mod.legacyConfigRules);
  const normalizeCompatibilityConfig = coerceNormalizeCompatibilityConfig(
    mod.normalizeCompatibilityConfig ?? mod.default?.normalizeCompatibilityConfig,
  );
  const resolveSessionStoreAgentIds = coerceSessionStoreAgentIdsResolver(
    mod.resolveSessionStoreAgentIds ?? mod.default?.resolveSessionStoreAgentIds,
  );
  const sessionRouteStateOwners = coerceDoctorSessionRouteStateOwners(
    mod.sessionRouteStateOwners ?? mod.default?.sessionRouteStateOwners,
  );
  const stateMigrations = coercePluginDoctorStateMigrations(
    mod.stateMigrations ?? mod.default?.stateMigrations,
  );
  if (
    rules.length === 0 &&
    !normalizeCompatibilityConfig &&
    !resolveSessionStoreAgentIds &&
    sessionRouteStateOwners.length === 0 &&
    stateMigrations.length === 0
  )
    return null;
  return {
    pluginId: record.id,
    rules,
    normalizeCompatibilityConfig,
    resolveSessionStoreAgentIds,
    sessionRouteStateOwners,
    stateMigrations,
  };
}
function resolvePluginDoctorContracts(params) {
  const env = params?.env ?? process.env;
  if (params?.pluginIds && params.pluginIds.length === 0) return [];
  const manifestRegistry = loadPluginManifestRegistryForPluginRegistry({
    config: params?.config,
    workspaceDir: params?.workspaceDir,
    env,
    includeDisabled: true,
  });
  const entries = [];
  const scopedPluginIds = params?.pluginIds ? new Set(params.pluginIds) : null;
  for (const record of manifestRegistry.plugins) {
    if (
      scopedPluginIds &&
      !scopedPluginIds.has(record.id) &&
      !(record.packageName && scopedPluginIds.has(record.packageName)) &&
      !record.legacyPluginIds?.some((pluginId) => scopedPluginIds.has(pluginId)) &&
      !record.channels.some((channelId) => scopedPluginIds.has(channelId)) &&
      !record.providers.some((providerId) => scopedPluginIds.has(providerId))
    )
      continue;
    const entry = loadPluginDoctorContractEntry(record);
    if (entry) entries.push(entry);
  }
  return entries;
}
function listPluginDoctorLegacyConfigRules(params) {
  return resolvePluginDoctorContracts(params).flatMap((entry) => entry.rules);
}
function listPluginDoctorSessionRouteStateOwners(params) {
  const owners = /* @__PURE__ */ new Map();
  for (const owner of resolvePluginDoctorContracts(params).flatMap(
    (entry) => entry.sessionRouteStateOwners,
  ))
    if (!owners.has(owner.id)) owners.set(owner.id, owner);
  return [...owners.values()].toSorted((left, right) => left.id.localeCompare(right.id));
}
/** Resolve plugin-owned agent IDs whose core session stores need migration. */
function listPluginDoctorSessionStoreAgentIds(params) {
  const cfg = params?.config ?? {};
  const agentIds = /* @__PURE__ */ new Set();
  for (const entry of resolvePluginDoctorContracts(params)) {
    let resolved;
    try {
      resolved = entry.resolveSessionStoreAgentIds?.({ cfg });
    } catch {
      continue;
    }
    for (const agentId of normalizeTrimmedStringList(resolved)) agentIds.add(agentId);
  }
  return [...agentIds].toSorted();
}
function listPluginDoctorStateMigrationEntries(params) {
  return resolvePluginDoctorContracts(params).flatMap((entry) =>
    entry.stateMigrations.map((migration) => ({
      pluginId: entry.pluginId,
      migration,
    })),
  );
}
function applyPluginDoctorCompatibilityMigrations(cfg, params) {
  let nextCfg = cfg;
  const changes = [];
  for (const entry of resolvePluginDoctorContracts(params)) {
    const mutation = entry.normalizeCompatibilityConfig?.({ cfg: nextCfg });
    if (!mutation || mutation.changes.length === 0) continue;
    nextCfg = mutation.config;
    changes.push(...mutation.changes);
  }
  return {
    config: nextCfg,
    changes,
  };
}
//#endregion
export {
  listPluginDoctorSessionRouteStateOwners as a,
  listPluginDoctorLegacyConfigRules as i,
  collectRelevantDoctorPluginIds as n,
  listPluginDoctorSessionStoreAgentIds as o,
  collectRelevantDoctorPluginIdsForTouchedPaths as r,
  listPluginDoctorStateMigrationEntries as s,
  applyPluginDoctorCompatibilityMigrations as t,
};
