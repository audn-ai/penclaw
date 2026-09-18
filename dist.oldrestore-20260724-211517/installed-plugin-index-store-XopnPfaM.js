import { existsSync, readFileSync } from "node:fs";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import {
  a as refreshInstalledPluginIndex,
  c as hasMissingConfigPathActivationMetadata,
  f as extractPluginInstallRecordsFromInstalledPluginIndex,
  g as hashJson,
  l as INSTALLED_PLUGIN_INDEX_WARNING,
  m as resolveInstalledPluginIndexPolicyHash,
  o as diffInstalledPluginIndexInvalidationReasons,
  p as resolveCompatRegistryVersion,
  r as loadInstalledPluginIndex,
} from "./installed-plugin-index-lBfkb-7L.js";
import {
  a as resolveInstalledPluginIndexStateDatabaseOptions,
  c as clearLoadInstalledPluginIndexInstallRecordsCache,
  l as withOpenClawStateDatabaseReadOnly,
  o as resolveInstalledPluginIndexStorePath,
} from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import {
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  Zn as unknown,
  dn as literal,
  wn as number,
} from "./schemas-CBJjibl3.js";
import { o as resolveCompatibilityHostVersion } from "./version-CeFj_iGk.js";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.js";
//#region src/plugins/installed-plugin-index-store.ts
/** Persists, inspects, and refreshes the installed plugin index in the state database. */
const StringArraySchema = array(string());
const INSTALLED_PLUGIN_INDEX_SQLITE_KEY = "installed-plugin-index";
const InstalledPluginIndexStartupSchema = object({
  sidecar: boolean(),
  memory: boolean(),
  deferConfiguredChannelFullLoadUntilAfterListen: boolean(),
  agentHarnesses: StringArraySchema,
  configPaths: StringArraySchema.optional(),
});
const InstalledPluginIndexContributionSchema = object({
  channels: StringArraySchema,
  channelConfigs: StringArraySchema,
  providers: StringArraySchema,
  modelCatalogProviders: StringArraySchema,
  modelSupportPrefixes: StringArraySchema,
  modelSupportPatterns: StringArraySchema,
  autoEnableProviderIds: StringArraySchema,
  commandAliases: StringArraySchema,
  contracts: record(string(), StringArraySchema),
});
const InstalledPluginFileSignatureSchema = object({
  size: number(),
  mtimeMs: number(),
  ctimeMs: number().optional(),
});
const InstalledPluginIndexRecordSchema = object({
  pluginId: string(),
  packageName: string().optional(),
  packageVersion: string().optional(),
  installRecord: record(string(), unknown()).optional(),
  installRecordHash: string().optional(),
  packageInstall: unknown().optional(),
  packageChannel: unknown().optional(),
  packageBuild: object({ bundledDist: boolean().optional() }).optional(),
  manifestPath: string(),
  manifestHash: string(),
  manifestFile: InstalledPluginFileSignatureSchema.optional(),
  format: string().optional(),
  bundleFormat: string().optional(),
  source: string().optional(),
  setupSource: string().optional(),
  packageJson: object({
    path: string(),
    hash: string(),
    fileSignature: InstalledPluginFileSignatureSchema.optional(),
  }).optional(),
  rootDir: string(),
  origin: string(),
  enabled: boolean(),
  enabledByDefault: boolean().optional(),
  enabledByDefaultOnPlatforms: StringArraySchema.optional(),
  syntheticAuthRefs: StringArraySchema.optional(),
  startup: InstalledPluginIndexStartupSchema,
  contributions: InstalledPluginIndexContributionSchema.optional(),
  compat: array(string()),
});
const InstalledPluginInstallRecordSchema = record(string(), unknown());
const PluginDiagnosticSchema = object({
  level: union([literal("warn"), literal("error")]),
  message: string(),
  pluginId: string().optional(),
  source: string().optional(),
});
const InstalledPluginIndexSchema = object({
  version: literal(1),
  warning: string().optional(),
  hostContractVersion: string(),
  compatRegistryVersion: string(),
  migrationVersion: literal(1),
  policyHash: string(),
  generatedAtMs: number(),
  refreshReason: string().optional(),
  installRecords: record(string(), InstalledPluginInstallRecordSchema).optional(),
  plugins: array(InstalledPluginIndexRecordSchema),
  diagnostics: array(PluginDiagnosticSchema),
});
function copySafeInstallRecords(records) {
  if (!records) return;
  const safeRecords = {};
  for (const [pluginId, record] of Object.entries(records)) {
    if (isBlockedObjectKey(pluginId)) continue;
    safeRecords[pluginId] = record;
  }
  return safeRecords;
}
function parseInstalledPluginIndex(value) {
  const parsed = safeParseWithSchema(InstalledPluginIndexSchema, value);
  if (!parsed) return null;
  const installRecords =
    copySafeInstallRecords(parsed.installRecords) ??
    copySafeInstallRecords(extractPluginInstallRecordsFromInstalledPluginIndex(parsed)) ??
    {};
  return {
    version: parsed.version,
    ...(parsed.warning ? { warning: parsed.warning } : {}),
    hostContractVersion: parsed.hostContractVersion,
    compatRegistryVersion: parsed.compatRegistryVersion,
    migrationVersion: parsed.migrationVersion,
    policyHash: parsed.policyHash,
    generatedAtMs: parsed.generatedAtMs,
    ...(parsed.refreshReason ? { refreshReason: parsed.refreshReason } : {}),
    installRecords,
    plugins: parsed.plugins,
    diagnostics: parsed.diagnostics,
  };
}
function isExplicitLegacyJsonStorePath(options) {
  return Boolean(options.filePath && options.filePath.endsWith(".json"));
}
function readLegacyRecordContainer(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const legacy = value;
  return legacy.installRecords ?? legacy.records;
}
function readPersistedInstalledPluginIndexFromLegacyJson(options) {
  if (!options.filePath || !existsSync(options.filePath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(options.filePath, "utf8"));
    const current = parseInstalledPluginIndex(parsed);
    if (current) return current;
    const installRecords = readLegacyRecordContainer(parsed);
    if (!installRecords) return null;
    return parseInstalledPluginIndex({
      version: 1,
      hostContractVersion: "legacy-file",
      compatRegistryVersion: "legacy-file",
      migrationVersion: 1,
      policyHash: "legacy-file",
      generatedAtMs: 0,
      installRecords,
      plugins: [],
      diagnostics: [],
    });
  } catch {
    return null;
  }
}
function assertWritableInstalledPluginIndexStoreOptions(options) {
  if (isExplicitLegacyJsonStorePath(options))
    throw new Error(
      "Explicit JSON installed plugin index paths are retired. Use the shared SQLite state DB or run openclaw doctor --fix to migrate legacy plugins/installs.json.",
    );
}
function parseJsonColumn(value) {
  try {
    return JSON.parse(value);
  } catch {
    return;
  }
}
function parseInstalledPluginIndexSqliteRow(row) {
  if (!row) return null;
  return parseInstalledPluginIndex({
    version: Number(row.version),
    ...(row.warning ? { warning: row.warning } : {}),
    hostContractVersion: row.host_contract_version,
    compatRegistryVersion: row.compat_registry_version,
    migrationVersion: Number(row.migration_version),
    policyHash: row.policy_hash,
    generatedAtMs: Number(row.generated_at_ms),
    ...(row.refresh_reason ? { refreshReason: row.refresh_reason } : {}),
    installRecords: parseJsonColumn(row.install_records_json),
    plugins: parseJsonColumn(row.plugins_json),
    diagnostics: parseJsonColumn(row.diagnostics_json),
  });
}
function readPersistedInstalledPluginIndexFromSqlite(options = {}) {
  if (isExplicitLegacyJsonStorePath(options))
    return readPersistedInstalledPluginIndexFromLegacyJson(options);
  if (!existsSync(resolveInstalledPluginIndexStorePath(options))) return null;
  try {
    return withOpenClawStateDatabaseReadOnly(({ db }) => {
      return parseInstalledPluginIndexSqliteRow(
        db
          .prepare(`
            SELECT version, warning, host_contract_version, compat_registry_version,
                   migration_version, policy_hash, generated_at_ms, refresh_reason,
                   install_records_json, plugins_json, diagnostics_json
              FROM installed_plugin_index
             WHERE index_key = ?
          `)
          .get(INSTALLED_PLUGIN_INDEX_SQLITE_KEY),
      );
    }, resolveInstalledPluginIndexStateDatabaseOptions(options));
  } catch {
    return null;
  }
}
function writePersistedInstalledPluginIndexToSqlite(index, options = {}) {
  assertWritableInstalledPluginIndexStoreOptions(options);
  const persisted = {
    ...index,
    warning: INSTALLED_PLUGIN_INDEX_WARNING,
    installRecords: copySafeInstallRecords(index.installRecords) ?? {},
  };
  const now = Date.now();
  runOpenClawStateWriteTransaction(({ db }) => {
    db.prepare(`
        INSERT INTO installed_plugin_index (
          index_key, version, host_contract_version, compat_registry_version,
          migration_version, policy_hash, generated_at_ms, refresh_reason,
          install_records_json, plugins_json, diagnostics_json, warning, updated_at_ms
        ) VALUES (
          @index_key, @version, @host_contract_version, @compat_registry_version,
          @migration_version, @policy_hash, @generated_at_ms, @refresh_reason,
          @install_records_json, @plugins_json, @diagnostics_json, @warning, @updated_at_ms
        )
        ON CONFLICT(index_key) DO UPDATE SET
          version = excluded.version,
          host_contract_version = excluded.host_contract_version,
          compat_registry_version = excluded.compat_registry_version,
          migration_version = excluded.migration_version,
          policy_hash = excluded.policy_hash,
          generated_at_ms = excluded.generated_at_ms,
          refresh_reason = excluded.refresh_reason,
          install_records_json = excluded.install_records_json,
          plugins_json = excluded.plugins_json,
          diagnostics_json = excluded.diagnostics_json,
          warning = excluded.warning,
          updated_at_ms = excluded.updated_at_ms
      `).run({
      index_key: INSTALLED_PLUGIN_INDEX_SQLITE_KEY,
      version: persisted.version,
      host_contract_version: persisted.hostContractVersion,
      compat_registry_version: persisted.compatRegistryVersion,
      migration_version: persisted.migrationVersion,
      policy_hash: persisted.policyHash,
      generated_at_ms: persisted.generatedAtMs,
      refresh_reason: persisted.refreshReason ?? null,
      install_records_json: JSON.stringify(persisted.installRecords),
      plugins_json: JSON.stringify(persisted.plugins),
      diagnostics_json: JSON.stringify(persisted.diagnostics),
      warning: persisted.warning,
      updated_at_ms: now,
    });
  }, resolveInstalledPluginIndexStateDatabaseOptions(options));
}
async function readPersistedInstalledPluginIndex(options = {}) {
  return readPersistedInstalledPluginIndexFromSqlite(options);
}
function readPersistedInstalledPluginIndexSync(options = {}) {
  return readPersistedInstalledPluginIndexFromSqlite(options);
}
async function writePersistedInstalledPluginIndex(index, options = {}) {
  const filePath = resolveInstalledPluginIndexStorePath(options);
  writePersistedInstalledPluginIndexToSqlite(index, options);
  clearPluginMetadataLifecycleCaches();
  clearLoadInstalledPluginIndexInstallRecordsCache();
  return filePath;
}
function writePersistedInstalledPluginIndexSync(index, options = {}) {
  const filePath = resolveInstalledPluginIndexStorePath(options);
  writePersistedInstalledPluginIndexToSqlite(index, options);
  clearPluginMetadataLifecycleCaches();
  clearLoadInstalledPluginIndexInstallRecordsCache();
  return filePath;
}
function hasPolicyRefreshTargets(persisted, policyPluginIds) {
  if (!policyPluginIds || policyPluginIds.length === 0) return true;
  const pluginIds = new Set(persisted.plugins.map((plugin) => plugin.pluginId));
  return policyPluginIds.every((pluginId) => pluginIds.has(pluginId));
}
function canRefreshPersistedPolicyState(persisted, params) {
  if (!persisted || params.reason !== "policy-changed") return false;
  const env = params.env ?? process.env;
  if (
    persisted.version !== 1 ||
    persisted.hostContractVersion !== resolveCompatibilityHostVersion(env) ||
    persisted.compatRegistryVersion !== resolveCompatRegistryVersion() ||
    persisted.migrationVersion !== 1 ||
    hasMissingConfigPathActivationMetadata(persisted)
  )
    return false;
  if (
    params.installRecords &&
    hashJson(params.installRecords) !== hashJson(persisted.installRecords ?? {})
  )
    return false;
  return hasPolicyRefreshTargets(persisted, params.policyPluginIds);
}
function refreshPersistedPolicyState(persisted, params) {
  const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
  return {
    ...persisted,
    policyHash: resolveInstalledPluginIndexPolicyHash(params.config),
    generatedAtMs: (params.now?.() ?? /* @__PURE__ */ new Date()).getTime(),
    refreshReason: params.reason,
    plugins: persisted.plugins.map((plugin) => ({
      ...plugin,
      enabled: resolveEffectiveEnableState({
        id: plugin.pluginId,
        origin: plugin.origin,
        config: normalizedConfig,
        rootConfig: params.config,
        enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
      }).enabled,
    })),
  };
}
async function inspectPersistedInstalledPluginIndex(params = {}) {
  const persisted = await readPersistedInstalledPluginIndex(params);
  const current = loadInstalledPluginIndex({
    ...params,
    installRecords:
      params.installRecords ?? extractPluginInstallRecordsFromInstalledPluginIndex(persisted),
  });
  if (!persisted)
    return {
      state: "missing",
      refreshReasons: ["missing"],
      persisted: null,
      current,
    };
  const refreshReasons = diffInstalledPluginIndexInvalidationReasons(persisted, current);
  return {
    state: refreshReasons.length > 0 ? "stale" : "fresh",
    refreshReasons,
    persisted,
    current,
  };
}
async function refreshPersistedInstalledPluginIndex(params) {
  const persisted =
    params.reason === "policy-changed" || !params.installRecords
      ? await readPersistedInstalledPluginIndex(params)
      : null;
  if (canRefreshPersistedPolicyState(persisted, params)) {
    const index = refreshPersistedPolicyState(persisted, params);
    await writePersistedInstalledPluginIndex(index, params);
    return index;
  }
  const index = refreshInstalledPluginIndex({
    ...params,
    installRecords:
      params.installRecords ?? extractPluginInstallRecordsFromInstalledPluginIndex(persisted),
  });
  await writePersistedInstalledPluginIndex(index, params);
  return index;
}
function refreshPersistedInstalledPluginIndexSync(params) {
  const persisted =
    params.reason === "policy-changed" || !params.installRecords
      ? readPersistedInstalledPluginIndexSync(params)
      : null;
  if (canRefreshPersistedPolicyState(persisted, params)) {
    const index = refreshPersistedPolicyState(persisted, params);
    writePersistedInstalledPluginIndexSync(index, params);
    return index;
  }
  const index = refreshInstalledPluginIndex({
    ...params,
    installRecords:
      params.installRecords ?? extractPluginInstallRecordsFromInstalledPluginIndex(persisted),
  });
  writePersistedInstalledPluginIndexSync(index, params);
  return index;
}
//#endregion
export {
  refreshPersistedInstalledPluginIndex as a,
  writePersistedInstalledPluginIndexSync as c,
  readPersistedInstalledPluginIndexSync as i,
  parseInstalledPluginIndex as n,
  refreshPersistedInstalledPluginIndexSync as o,
  readPersistedInstalledPluginIndex as r,
  writePersistedInstalledPluginIndex as s,
  inspectPersistedInstalledPluginIndex as t,
};
