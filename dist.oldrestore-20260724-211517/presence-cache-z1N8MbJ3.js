//#region extensions/discord/src/monitor/presence-cache.ts
/**
 * In-memory cache of Discord user presence data.
 * Populated by PRESENCE_UPDATE gateway events when the GuildPresences intent is enabled.
 * Per-account maps are capped to prevent unbounded growth (#4948).
 */
const MAX_PRESENCE_PER_ACCOUNT = 5e3;
const presenceCache = /* @__PURE__ */ new Map();
function resolveAccountKey(accountId) {
  return accountId ?? "default";
}
/** Update cached presence for a user. */
function setPresence(accountId, userId, data) {
  const accountKey = resolveAccountKey(accountId);
  let accountCache = presenceCache.get(accountKey);
  if (!accountCache) {
    accountCache = /* @__PURE__ */ new Map();
    presenceCache.set(accountKey, accountCache);
  }
  accountCache.set(userId, data);
  if (accountCache.size > MAX_PRESENCE_PER_ACCOUNT) {
    const oldest = accountCache.keys().next().value;
    if (oldest !== void 0) accountCache.delete(oldest);
  }
}
/** Get cached presence for a user. Returns undefined if not cached. */
function getPresence(accountId, userId) {
  return presenceCache.get(resolveAccountKey(accountId))?.get(userId);
}
/** Clear cached presence data. */
function clearPresences(accountId) {
  if (accountId) {
    presenceCache.delete(resolveAccountKey(accountId));
    return;
  }
  presenceCache.clear();
}
/** Get the number of cached presence entries. */
function presenceCacheSize() {
  let total = 0;
  for (const accountCache of presenceCache.values()) total += accountCache.size;
  return total;
}
//#endregion
export { setPresence as i, getPresence as n, presenceCacheSize as r, clearPresences as t };
