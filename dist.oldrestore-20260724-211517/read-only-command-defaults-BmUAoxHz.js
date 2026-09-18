import { n as isInstalledPluginEnabled } from "./installed-plugin-index-lBfkb-7L.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/plugins/read-only-command-defaults.ts
/**
 * Read-only channel command default resolver.
 *
 * Reads native command/skill defaults from installed plugin manifests without loading plugins.
 */
const SAFE_MANIFEST_CHANNEL_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
/**
 * Returns whether a manifest channel id is safe for own-property lookup.
 */
function isSafeManifestChannelId(channelId) {
  return SAFE_MANIFEST_CHANNEL_ID_PATTERN.test(channelId) && !isBlockedObjectKey(channelId);
}
/**
 * Reads an own record property while blocking prototype-polluting keys.
 */
function readOwnRecordValue(record, key) {
  if (isBlockedObjectKey(key) || !Object.hasOwn(record, key)) return;
  return record[key];
}
/**
 * Normalizes manifest command defaults down to supported boolean fields.
 */
function normalizeChannelCommandDefaults(value) {
  if (!value) return;
  const nativeCommandsAutoEnabled =
    typeof value.nativeCommandsAutoEnabled === "boolean" ? value.nativeCommandsAutoEnabled : void 0;
  const nativeSkillsAutoEnabled =
    typeof value.nativeSkillsAutoEnabled === "boolean" ? value.nativeSkillsAutoEnabled : void 0;
  if (nativeCommandsAutoEnabled === void 0 && nativeSkillsAutoEnabled === void 0) return;
  const defaults = {};
  if (nativeCommandsAutoEnabled !== void 0)
    defaults.nativeCommandsAutoEnabled = nativeCommandsAutoEnabled;
  if (nativeSkillsAutoEnabled !== void 0)
    defaults.nativeSkillsAutoEnabled = nativeSkillsAutoEnabled;
  return defaults;
}
/**
 * Resolves command defaults from enabled installed plugin metadata without loading plugins.
 */
function resolveReadOnlyChannelCommandDefaults(channelId, options) {
  const normalizedChannelId = normalizeOptionalString(channelId) ?? "";
  if (!normalizedChannelId || !isSafeManifestChannelId(normalizedChannelId)) return;
  const env = options.env ?? process.env;
  const resolvedSnapshot = resolvePluginMetadataSnapshot({
    config: options.config,
    stateDir: options.stateDir,
    workspaceDir: options.workspaceDir,
    env,
    allowWorkspaceScopedCurrent: true,
  });
  for (const record of resolvedSnapshot.plugins) {
    if (!record.channels.includes(normalizedChannelId)) continue;
    if (!isInstalledPluginEnabled(resolvedSnapshot.index, record.id, options.config)) continue;
    const channelConfigValue = record.channelConfigs
      ? readOwnRecordValue(record.channelConfigs, normalizedChannelId)
      : void 0;
    const channelConfig =
      channelConfigValue &&
      typeof channelConfigValue === "object" &&
      !Array.isArray(channelConfigValue)
        ? channelConfigValue
        : void 0;
    const catalogCommands =
      record.channelCatalogMeta?.id === normalizedChannelId
        ? record.channelCatalogMeta.commands
        : void 0;
    const commands = normalizeChannelCommandDefaults(channelConfig?.commands ?? catalogCommands);
    if (commands) return commands;
  }
}
//#endregion
export {
  resolveReadOnlyChannelCommandDefaults as i,
  normalizeChannelCommandDefaults as n,
  readOwnRecordValue as r,
  isSafeManifestChannelId as t,
};
