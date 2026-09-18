import path from "node:path";
import { u as buildBundledPluginLoadPathAliases } from "./discovery-Df2IhoW5.js";
import { r as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-XopnPfaM.js";
import { t as loadPluginManifestRegistryForInstalledIndex } from "./manifest-registry-installed-CdFNhCi1.js";
import {
  d as resolveOfficialExternalPluginInstall,
  r as getOfficialExternalPluginCatalogManifest,
  t as getOfficialExternalPluginCatalogEntry,
} from "./official-external-plugin-catalog-B2V9K3em.js";
//#region src/cli/plugins-location-bridges.ts
function buildBridgeFromPersistedBundledRecord(record, manifest) {
  if (record.origin !== "bundled" || !record.enabled) return null;
  const officialEntry = getOfficialExternalPluginCatalogEntry(record.pluginId);
  const officialInstall = officialEntry
    ? resolveOfficialExternalPluginInstall(officialEntry)
    : null;
  const npmSpec = officialInstall?.npmSpec?.trim() ?? record.packageInstall?.npm?.spec;
  const clawhubSpec = officialInstall?.clawhubSpec?.trim();
  if (!npmSpec && !clawhubSpec) return null;
  const officialChannelId = officialEntry
    ? getOfficialExternalPluginCatalogManifest(officialEntry)?.channel?.id?.trim()
    : void 0;
  const channelIds = manifest?.channels.length
    ? manifest.channels
    : officialChannelId
      ? [officialChannelId]
      : [];
  return {
    bundledPluginId: record.pluginId,
    pluginId: record.pluginId,
    preferredSource:
      officialInstall?.defaultChoice === "clawhub" && clawhubSpec ? "clawhub" : "npm",
    ...(npmSpec ? { npmSpec } : {}),
    ...(clawhubSpec ? { clawhubSpec } : {}),
    ...(record.enabledByDefault ? { enabledByDefault: true } : {}),
    ...(channelIds.length ? { channelIds } : {}),
  };
}
/** List install bridges inferred from the persisted plugin index before current discovery runs. */
async function listPersistedBundledPluginLocationBridges(options) {
  const index = await readPersistedInstalledPluginIndex(options);
  if (!index) return [];
  const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
    index,
    workspaceDir: options.workspaceDir,
    env: options.env,
    includeDisabled: true,
  });
  const manifestByPluginId = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
  return index.plugins.flatMap((record) => {
    const bridge = buildBridgeFromPersistedBundledRecord(
      record,
      manifestByPluginId.get(record.pluginId),
    );
    return bridge ? [bridge] : [];
  });
}
/** List exact previous bundled paths that an explicit plugin reinstall may recover. */
async function listPersistedBundledPluginRecoveryLocations(options) {
  const index = await readPersistedInstalledPluginIndex(options);
  if (!index) return [];
  return index.plugins.flatMap((record) => {
    const rootDir = record.rootDir.trim();
    if (record.origin !== "bundled" || !path.isAbsolute(rootDir)) return [];
    const loadPaths = Array.from(
      /* @__PURE__ */ new Set([
        rootDir,
        ...buildBundledPluginLoadPathAliases(rootDir).map((alias) => alias.path),
      ]),
    );
    return [
      {
        pluginId: record.pluginId,
        loadPaths,
      },
    ];
  });
}
//#endregion
export {
  listPersistedBundledPluginRecoveryLocations as n,
  listPersistedBundledPluginLocationBridges as t,
};
