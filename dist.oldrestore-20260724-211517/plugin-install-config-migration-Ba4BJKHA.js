import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { Nn as record, Rn as string, Tn as object } from "./schemas-CBJjibl3.js";
import { n as PluginInstallRecordShape } from "./zod-schema.installs-DloweJxh.js";
//#region src/config/plugin-install-config-migration.ts
const PluginInstallRecordsSchema = record(string(), object(PluginInstallRecordShape).passthrough());
function pruneEmptyPluginsObject(plugins) {
  const { installs: _installs, ...rest } = plugins;
  return Object.keys(rest).length === 0 ? void 0 : rest;
}
/**
 * Reads legacy shipped `plugins.installs` records for migration into the plugin index.
 *
 * Invalid install maps are ignored so config loading can keep using the stripped
 * runtime config while doctor/write paths decide how to report or recover.
 */
function extractShippedPluginInstallConfigRecords(config) {
  if (!isRecord(config) || !isRecord(config.plugins)) return {};
  const parsed = PluginInstallRecordsSchema.safeParse(config.plugins.installs);
  return parsed.success ? structuredClone(parsed.data) : {};
}
/** Removes legacy shipped `plugins.installs` without mutating the original config object. */
function stripShippedPluginInstallConfigRecords(config) {
  if (!isRecord(config) || !isRecord(config.plugins) || !("installs" in config.plugins))
    return config;
  const plugins = pruneEmptyPluginsObject(config.plugins);
  const { plugins: _plugins, ...rest } = config;
  return plugins === void 0
    ? rest
    : {
        ...rest,
        plugins,
      };
}
//#endregion
export {
  stripShippedPluginInstallConfigRecords as n,
  extractShippedPluginInstallConfigRecords as t,
};
