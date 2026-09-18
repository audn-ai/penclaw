import { t as buildNpmResolutionFields } from "./install-source-utils-Cvk6wk9f.js";
import { o as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  a as refreshPersistedInstalledPluginIndex,
  o as refreshPersistedInstalledPluginIndexSync,
} from "./installed-plugin-index-store-XopnPfaM.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
//#region src/plugins/installs.ts
const CLAWHUB_TRUST_INSTALL_RECORD_FIELDS = [
  "clawhubTrustDisposition",
  "clawhubTrustScanStatus",
  "clawhubTrustModerationState",
  "clawhubTrustReasons",
  "clawhubTrustPending",
  "clawhubTrustStale",
  "clawhubTrustCheckedAt",
  "clawhubTrustAcknowledgedAt",
];
/** Builds install record fields from resolved npm package metadata. */
function buildNpmResolutionInstallFields(resolution) {
  return buildNpmResolutionFields(resolution);
}
function isExactRegistryNpmSpec(spec) {
  return (spec ? parseRegistryNpmSpec(spec) : null)?.selectorKind === "exact-version";
}
function resolveNpmInstallRecordSpec(params) {
  const resolvedSpec = params.resolution?.resolvedSpec;
  if (!params.pinResolvedRegistrySpec || !isExactRegistryNpmSpec(resolvedSpec))
    return params.requestedSpec;
  return resolvedSpec;
}
/** Records or updates a plugin install record in OpenClaw config. */
function recordPluginInstall(cfg, update) {
  const { pluginId, ...record } = update;
  const nextRecord = {
    ...clearStaleInstallRecordFields(cfg.plugins?.installs?.[pluginId]),
    ...record,
    installedAt: record.installedAt ?? /* @__PURE__ */ new Date().toISOString(),
  };
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      installs: {
        ...cfg.plugins?.installs,
        [pluginId]: nextRecord,
      },
    },
  };
}
function clearStaleInstallRecordFields(record) {
  if (!record) return;
  const next = { ...record };
  for (const field of CLAWHUB_TRUST_INSTALL_RECORD_FIELDS) delete next[field];
  return next;
}
//#endregion
//#region src/plugins/installed-plugin-index-records.ts
/** Config path for legacy plugin install records kept for migration/doctor flows. */
const PLUGIN_INSTALLS_CONFIG_PATH = ["plugins", "installs"];
/** Resolves the installed plugin index record store path. */
function resolveInstalledPluginIndexRecordsStorePath(options = {}) {
  return resolveInstalledPluginIndexStorePath(options);
}
/** Refreshes persisted installed plugin index records asynchronously. */
async function writePersistedInstalledPluginIndexInstallRecords(records, options = {}) {
  await refreshPersistedInstalledPluginIndex({
    ...options,
    reason: "source-changed",
    installRecords: records,
  });
  return resolveInstalledPluginIndexRecordsStorePath(options);
}
/** Refreshes persisted installed plugin index records synchronously. */
function writePersistedInstalledPluginIndexInstallRecordsSync(records, options = {}) {
  refreshPersistedInstalledPluginIndexSync({
    ...options,
    reason: "source-changed",
    installRecords: records,
  });
  return resolveInstalledPluginIndexRecordsStorePath(options);
}
/** Returns config with plugin install records attached at the canonical config path. */
function withPluginInstallRecords(config, records) {
  return {
    ...config,
    plugins: {
      ...config.plugins,
      installs: records,
    },
  };
}
/** Returns config with legacy plugin install records removed. */
function withoutPluginInstallRecords(config, options = {}) {
  if (!config.plugins?.installs) return config;
  const { installs: _installs, ...plugins } = config.plugins;
  if (Object.keys(plugins).length === 0) {
    if (options.preserveEmptyPlugins)
      return {
        ...config,
        plugins: {},
      };
    const { plugins: _plugins, ...rest } = config;
    return rest;
  }
  return {
    ...config,
    plugins,
  };
}
/** Applies one install update to an in-memory install record map. */
function recordPluginInstallInRecords(records, update) {
  return recordPluginInstall({ plugins: { installs: records } }, update).plugins?.installs ?? {};
}
/** Removes one plugin install record from an in-memory record map. */
function removePluginInstallRecordFromRecords(records, pluginId) {
  const { [pluginId]: _removed, ...rest } = records;
  return rest;
}
//#endregion
export {
  withPluginInstallRecords as a,
  writePersistedInstalledPluginIndexInstallRecordsSync as c,
  resolveNpmInstallRecordSpec as d,
  resolveInstalledPluginIndexRecordsStorePath as i,
  buildNpmResolutionInstallFields as l,
  recordPluginInstallInRecords as n,
  withoutPluginInstallRecords as o,
  removePluginInstallRecordFromRecords as r,
  writePersistedInstalledPluginIndexInstallRecords as s,
  PLUGIN_INSTALLS_CONFIG_PATH as t,
  recordPluginInstall as u,
};
