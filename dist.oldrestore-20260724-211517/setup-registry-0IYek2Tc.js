import { u as listBundledChannelSetupPlugins } from "./bundled-CmD3EzUu.js";
import { n as CHAT_CHANNEL_ORDER } from "./ids-lBaN9yr4.js";
import {
  n as getActivePluginChannelRegistry,
  w as requireActivePluginRegistry,
} from "./runtime-CcYnX0B4.js";
import "./registry-xXjI-8UE.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/plugins/setup-registry.ts
/**
 * Channel setup plugin registry.
 *
 * Resolves loaded or bundled setup plugins for onboarding flows.
 */
function dedupeSetupPlugins(plugins) {
  const seen = /* @__PURE__ */ new Set();
  const resolved = [];
  for (const plugin of plugins) {
    const id = normalizeOptionalString(plugin.id) ?? "";
    if (!id || seen.has(id)) continue;
    seen.add(id);
    resolved.push(plugin);
  }
  return resolved;
}
function sortChannelSetupPlugins(plugins) {
  return dedupeSetupPlugins(plugins).toSorted((a, b) => {
    const indexA = CHAT_CHANNEL_ORDER.indexOf(a.id);
    const indexB = CHAT_CHANNEL_ORDER.indexOf(b.id);
    const orderA = a.meta.order ?? (indexA === -1 ? 999 : indexA);
    const orderB = b.meta.order ?? (indexB === -1 ? 999 : indexB);
    if (orderA !== orderB) return orderA - orderB;
    return a.id.localeCompare(b.id);
  });
}
function resolveChannelSetupPlugins() {
  const registryPlugins = (requireActivePluginRegistry().channelSetups ?? []).map(
    (entry) => entry.plugin,
  );
  const sorted = sortChannelSetupPlugins(
    registryPlugins.length > 0 ? registryPlugins : listBundledChannelSetupPlugins(),
  );
  const byId = /* @__PURE__ */ new Map();
  for (const plugin of sorted) byId.set(plugin.id, plugin);
  return {
    sorted,
    byId,
  };
}
/**
 * Lists setup-capable channel plugins, falling back to bundled setup metadata.
 */
function listChannelSetupPlugins() {
  return resolveChannelSetupPlugins().sorted.slice();
}
/**
 * Lists setup plugins from the active channel registry only.
 */
function listActiveChannelSetupPlugins() {
  return sortChannelSetupPlugins(
    (getActivePluginChannelRegistry()?.channelSetups ?? []).map((entry) => entry.plugin),
  );
}
/**
 * Returns one setup-capable channel plugin by id.
 */
function getChannelSetupPlugin(id) {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) return;
  return resolveChannelSetupPlugins().byId.get(resolvedId);
}
//#endregion
export {
  listActiveChannelSetupPlugins as n,
  listChannelSetupPlugins as r,
  getChannelSetupPlugin as t,
};
