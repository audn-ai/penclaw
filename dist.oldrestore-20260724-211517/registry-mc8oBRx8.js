import { n as getBundledChannelPlugin } from "./bundled-CmD3EzUu.js";
import {
  i as listLoadedChannelPlugins,
  n as getLoadedChannelPluginEntryById,
  t as getLoadedChannelPluginById,
} from "./registry-loaded-D8eZo-vR.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import "./registry-xXjI-8UE.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/plugins/registry.ts
/**
 * Runtime channel plugin registry facade.
 *
 * Lists, resolves, and normalizes active channel plugins with bundled fallback.
 */
/**
 * Lists currently loaded channel plugins in registry order.
 */
function listChannelPlugins() {
  return listLoadedChannelPlugins();
}
/**
 * Returns a loaded channel plugin without falling back to bundled metadata.
 */
function getLoadedChannelPlugin(id) {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) return;
  return getLoadedChannelPluginById(resolvedId);
}
/**
 * Returns the package/install origin for a loaded channel plugin.
 */
function getLoadedChannelPluginOrigin(id) {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) return;
  return normalizeOptionalString(getLoadedChannelPluginEntryById(resolvedId)?.origin) ?? void 0;
}
/**
 * Resolves the active channel implementation together with host-owned provenance.
 */
function resolveChannelPluginRegistration(id) {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) return;
  const loadedEntry = getLoadedChannelPluginEntryById(resolvedId);
  if (loadedEntry) {
    const origin = normalizeOptionalString(loadedEntry.origin) ?? void 0;
    return {
      plugin: loadedEntry.plugin,
      ...(origin ? { origin } : {}),
    };
  }
  const plugin = getBundledChannelPlugin(resolvedId);
  return plugin
    ? {
        plugin,
        origin: "bundled",
      }
    : void 0;
}
/**
 * Returns the active channel plugin, with bundled fallback for built-in channels.
 */
function getChannelPlugin(id) {
  return resolveChannelPluginRegistration(id)?.plugin;
}
/**
 * Normalizes user-facing channel aliases to canonical channel ids.
 */
function normalizeChannelId(raw) {
  return normalizeAnyChannelId(raw);
}
//#endregion
export {
  normalizeChannelId as a,
  listChannelPlugins as i,
  getLoadedChannelPlugin as n,
  resolveChannelPluginRegistration as o,
  getLoadedChannelPluginOrigin as r,
  getChannelPlugin as t,
};
