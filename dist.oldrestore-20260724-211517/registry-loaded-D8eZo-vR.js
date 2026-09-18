import { n as CHAT_CHANNEL_ORDER } from "./ids-lBaN9yr4.js";
import { n as getActivePluginChannelRegistrySnapshotFromState } from "./runtime-channel-state-DFG20Bn5.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./registry-xXjI-8UE.js";
//#region src/channels/plugins/registry-loaded.ts
/**
 * Loaded channel plugin registry view.
 *
 * Normalizes and sorts active plugin runtime state for channel registry callers.
 */
let cachedChannelPluginView;
function coerceLoadedChannelPlugin(plugin) {
  const id = normalizeOptionalString(plugin?.id) ?? "";
  if (!plugin || !id) return null;
  if (!plugin.meta || typeof plugin.meta !== "object") plugin.meta = {};
  return plugin;
}
function dedupeChannels(channels) {
  const seen = /* @__PURE__ */ new Set();
  const resolved = [];
  for (const plugin of channels) {
    const id = normalizeOptionalString(plugin.id) ?? "";
    if (!id || seen.has(id)) continue;
    seen.add(id);
    resolved.push(plugin);
  }
  return resolved;
}
function resolveChannelPlugins() {
  const snapshot = getActivePluginChannelRegistrySnapshotFromState();
  const cached = cachedChannelPluginView;
  if (cached?.snapshot === snapshot) return cached;
  const registry = snapshot.registry;
  const channelPlugins = [];
  const pluginEntries = [];
  if (registry && Array.isArray(registry.channels))
    for (const entry of registry.channels) {
      const plugin = coerceLoadedChannelPlugin(entry?.plugin);
      if (plugin) {
        channelPlugins.push(plugin);
        pluginEntries.push({
          ...entry,
          plugin,
        });
      }
    }
  const sorted = dedupeChannels(channelPlugins).toSorted((a, b) => {
    const indexA = CHAT_CHANNEL_ORDER.indexOf(a.id);
    const indexB = CHAT_CHANNEL_ORDER.indexOf(b.id);
    const orderA = a.meta.order ?? (indexA === -1 ? 999 : indexA);
    const orderB = b.meta.order ?? (indexB === -1 ? 999 : indexB);
    if (orderA !== orderB) return orderA - orderB;
    return a.id.localeCompare(b.id);
  });
  const byId = /* @__PURE__ */ new Map();
  const entriesById = /* @__PURE__ */ new Map();
  const unsortedEntriesById = new Map(pluginEntries.map((entry) => [entry.plugin.id, entry]));
  for (const plugin of sorted) {
    byId.set(plugin.id, plugin);
    const entry = unsortedEntriesById.get(plugin.id);
    if (entry) entriesById.set(plugin.id, entry);
  }
  cachedChannelPluginView = {
    snapshot,
    sorted,
    byId,
    entriesById,
  };
  return cachedChannelPluginView;
}
/**
 * Lists loaded channel plugins in deterministic display/runtime order.
 */
function listLoadedChannelPlugins() {
  return resolveChannelPlugins().sorted.slice();
}
/**
 * Returns a loaded channel plugin by normalized id.
 */
function getLoadedChannelPluginById(id) {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) return;
  return resolveChannelPlugins().byId.get(resolvedId);
}
/** Returns one loaded channel plugin without triggering bundled discovery. */
function getLoadedChannelPluginForRead(id) {
  return getLoadedChannelPluginById(id);
}
/**
 * Returns the loaded channel registry entry by normalized plugin id.
 */
function getLoadedChannelPluginEntryById(id) {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) return;
  return resolveChannelPlugins().entriesById.get(resolvedId);
}
//#endregion
export {
  listLoadedChannelPlugins as i,
  getLoadedChannelPluginEntryById as n,
  getLoadedChannelPluginForRead as r,
  getLoadedChannelPluginById as t,
};
