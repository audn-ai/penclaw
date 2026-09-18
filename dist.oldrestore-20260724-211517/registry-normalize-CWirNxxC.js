import { n as getActivePluginChannelRegistrySnapshotFromState } from "./runtime-channel-state-DFG20Bn5.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/registry-lookup.ts
let registeredChannelPluginLookup;
function setLookupEntry(map, key, entry) {
  if (key && !map.has(key)) map.set(key, entry);
}
function buildRegisteredChannelPluginLookup() {
  const { registry, version } = getActivePluginChannelRegistrySnapshotFromState();
  const channels = Array.isArray(registry?.channels) ? registry.channels : void 0;
  const channelCount = channels?.length ?? 0;
  const cached = registeredChannelPluginLookup;
  if (
    cached &&
    cached.registry === registry &&
    cached.channels === channels &&
    cached.channelCount === channelCount &&
    cached.version === version
  )
    return cached;
  const entries = channelCount > 0 ? channels : [];
  const byKey = /* @__PURE__ */ new Map();
  const byId = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const id = normalizeOptionalLowercaseString(entry.plugin.id ?? "");
    setLookupEntry(byKey, id, entry);
    setLookupEntry(byId, id, entry);
    for (const alias of entry.plugin.meta?.aliases ?? [])
      setLookupEntry(byKey, normalizeOptionalLowercaseString(alias), entry);
  }
  registeredChannelPluginLookup = {
    registry,
    channels,
    channelCount,
    version,
    entries,
    byKey,
    byId,
  };
  return registeredChannelPluginLookup;
}
/** Lists active channel plugin registrations from the current registry snapshot. */
function listRegisteredChannelPluginEntries() {
  return buildRegisteredChannelPluginLookup().entries;
}
/** Finds an active channel plugin registration by normalized id or alias. */
function findRegisteredChannelPluginEntry(normalizedKey) {
  return buildRegisteredChannelPluginLookup().byKey.get(normalizedKey);
}
/** Finds an active channel plugin registration by its canonical plugin id. */
function findRegisteredChannelPluginEntryById(id) {
  const normalizedId = normalizeOptionalLowercaseString(id);
  if (!normalizedId) return;
  return buildRegisteredChannelPluginLookup().byId.get(normalizedId);
}
//#endregion
//#region src/channels/registry-normalize.ts
/** Normalizes user/config channel identifiers so aliases resolve to canonical channel ids. */
function normalizeAnyChannelId(raw) {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) return null;
  return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}
//#endregion
export {
  findRegisteredChannelPluginEntryById as n,
  listRegisteredChannelPluginEntries as r,
  normalizeAnyChannelId as t,
};
