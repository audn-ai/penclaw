import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { a as normalizeChannelId, i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import "./plugins-BKdf-5tW.js";
import { r as getActivePluginChannelRegistryVersion } from "./runtime-CcYnX0B4.js";
//#region src/config/markdown-tables.ts
function buildDefaultTableModes() {
  return new Map(
    listChannelPlugins()
      .flatMap((plugin) => {
        const defaultMarkdownTableMode = plugin.messaging?.defaultMarkdownTableMode;
        return defaultMarkdownTableMode ? [[plugin.id, defaultMarkdownTableMode]] : [];
      })
      .toSorted(([left], [right]) => left.localeCompare(right)),
  );
}
let cachedDefaultTableModes = null;
let cachedDefaultTableModesRegistryVersion = null;
function getDefaultTableModes() {
  const registryVersion = getActivePluginChannelRegistryVersion();
  if (!cachedDefaultTableModes || cachedDefaultTableModesRegistryVersion !== registryVersion) {
    cachedDefaultTableModes = buildDefaultTableModes();
    cachedDefaultTableModesRegistryVersion = registryVersion;
  }
  return cachedDefaultTableModes;
}
const isMarkdownTableMode = (value) =>
  value === "off" || value === "bullets" || value === "code" || value === "block";
function resolveMarkdownModeFromSection(section, accountId) {
  if (!section) return;
  const normalizedAccountId = normalizeAccountId(accountId);
  const accounts = section.accounts;
  if (accounts && typeof accounts === "object") {
    const matchMode = resolveAccountEntry(accounts, normalizedAccountId)?.markdown?.tables;
    if (isMarkdownTableMode(matchMode)) return matchMode;
  }
  const sectionMode = section.markdown?.tables;
  return isMarkdownTableMode(sectionMode) ? sectionMode : void 0;
}
function resolveMarkdownTableMode(params) {
  const channel = normalizeChannelId(params.channel);
  const defaultMode = channel ? (getDefaultTableModes().get(channel) ?? "code") : "code";
  let resolved = defaultMode;
  if (channel && params.cfg) {
    const channelsConfig = params.cfg.channels;
    const rootConfig = params.cfg;
    resolved =
      resolveMarkdownModeFromSection(
        channelsConfig?.[channel] ?? rootConfig[channel],
        params.accountId,
      ) ?? defaultMode;
  }
  return resolved === "block" && !params.supportsBlockTables ? "code" : resolved;
}
//#endregion
export { resolveMarkdownTableMode as t };
