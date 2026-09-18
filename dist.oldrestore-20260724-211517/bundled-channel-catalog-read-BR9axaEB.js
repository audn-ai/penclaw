import fs from "node:fs";
import path from "node:path";
import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import "./json-files-CTWRDHag.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/bundled-channel-catalog-read.ts
/**
 * Bundled channel catalog reader.
 *
 * Loads channel metadata from generated package catalogs and bundled plugin package manifests.
 */
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
const officialCatalogFileCache = /* @__PURE__ */ new Map();
const bundledPackageCatalogCache = /* @__PURE__ */ new Map();
function listPackageRoots() {
  return uniqueStrings(
    [
      resolveOpenClawPackageRootSync({ cwd: process.cwd() }),
      resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url }),
    ].filter((entry) => Boolean(entry)),
  );
}
function readBundledExtensionCatalogEntriesSync() {
  const pluginsDir = resolveBundledPluginsDir();
  if (!pluginsDir) return [];
  const cached = bundledPackageCatalogCache.get(pluginsDir);
  if (cached !== void 0) return cached ?? [];
  try {
    const entries = fs
      .readdirSync(pluginsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => {
        const parsed = tryReadJsonSync(path.join(pluginsDir, entry.name, "package.json"));
        return parsed ? [parsed] : [];
      });
    bundledPackageCatalogCache.set(pluginsDir, entries);
    return entries;
  } catch {
    bundledPackageCatalogCache.set(pluginsDir, null);
    return [];
  }
}
function readOfficialCatalogFileSync() {
  for (const packageRoot of listPackageRoots()) {
    const candidate = path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH);
    const cached = officialCatalogFileCache.get(candidate);
    if (cached !== void 0) {
      if (cached) return cached;
      continue;
    }
    if (!fs.existsSync(candidate)) {
      officialCatalogFileCache.set(candidate, null);
      continue;
    }
    const payload = tryReadJsonSync(candidate);
    if (payload) {
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      officialCatalogFileCache.set(candidate, entries);
      return entries;
    }
    officialCatalogFileCache.set(candidate, null);
  }
  return [];
}
function isChannelCatalogEntryLike(entry) {
  return "openclaw" in entry;
}
function toBundledChannelEntry(entry) {
  const channel = isChannelCatalogEntryLike(entry) ? entry.openclaw?.channel : entry;
  const id = normalizeOptionalLowercaseString(channel?.id);
  if (!id || !channel) return null;
  return {
    id,
    channel,
    aliases: Array.isArray(channel.aliases)
      ? channel.aliases
          .map((alias) => normalizeOptionalLowercaseString(alias))
          .filter((alias) => Boolean(alias))
      : [],
    order:
      typeof channel.order === "number" && Number.isFinite(channel.order)
        ? channel.order
        : Number.MAX_SAFE_INTEGER,
  };
}
/**
 * Lists bundled channel catalog entries from package manifests and generated catalog files.
 */
function listBundledChannelCatalogEntries() {
  const entries = /* @__PURE__ */ new Map();
  for (const entry of readBundledExtensionCatalogEntriesSync()) {
    const channelEntry = toBundledChannelEntry(entry);
    if (channelEntry) entries.set(channelEntry.id, channelEntry);
  }
  for (const entry of readOfficialCatalogFileSync()) {
    const channelEntry = toBundledChannelEntry(entry);
    if (channelEntry) entries.set(channelEntry.id, entries.get(channelEntry.id) ?? channelEntry);
  }
  if (entries.size === 0) return [];
  return Array.from(entries.values()).toSorted(
    (left, right) => left.order - right.order || left.id.localeCompare(right.id),
  );
}
//#endregion
export { listBundledChannelCatalogEntries as t };
