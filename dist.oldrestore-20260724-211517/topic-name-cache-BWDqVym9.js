import { createHash } from "node:crypto";
import path from "node:path";
import "./runtime-env-D0V-7Gqz.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import "./state-paths-DU65nx5N.js";
import { n as readJsonFileWithFallback, t as loadJsonFile } from "./json-store-CSxUwOCu.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
//#region extensions/telegram/src/sticker-cache-store.ts
const CACHE_VERSION = 1;
const TELEGRAM_STICKER_CACHE_NAMESPACE = "telegram.sticker-cache";
const TELEGRAM_STICKER_CACHE_MAX_ENTRIES = 1e4;
function getCacheFile() {
  return path.join(resolveStateDir(), "telegram", "sticker-cache.json");
}
function openStickerCacheStore() {
  return getTelegramRuntime().state.openSyncKeyedStore({
    namespace: "telegram.sticker-cache",
    maxEntries: 1e4,
  });
}
function loadCache() {
  return loadCacheFile(getCacheFile());
}
function normalizeStickerSearchText(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function normalizeCachedStickerForStore(sticker) {
  return {
    fileId: sticker.fileId,
    fileUniqueId: sticker.fileUniqueId,
    description: sticker.description,
    cachedAt: sticker.cachedAt,
    ...(sticker.emoji !== void 0 ? { emoji: sticker.emoji } : {}),
    ...(sticker.setName !== void 0 ? { setName: sticker.setName } : {}),
    ...(sticker.receivedFrom !== void 0 ? { receivedFrom: sticker.receivedFrom } : {}),
  };
}
function readStickerCacheStore(operation, read, fallback) {
  try {
    return read(openStickerCacheStore());
  } catch (err) {
    logVerbose(`telegram sticker cache ${operation} failed: ${String(err)}`);
    return fallback;
  }
}
/**
 * Get a cached sticker by its unique ID.
 */
function getCachedSticker(fileUniqueId) {
  return readStickerCacheStore("lookup", (store) => store.lookup(fileUniqueId) ?? null, null);
}
/**
 * Add or update a sticker in the cache.
 */
function cacheSticker(sticker) {
  readStickerCacheStore(
    "register",
    (store) => {
      store.register(sticker.fileUniqueId, normalizeCachedStickerForStore(sticker));
    },
    void 0,
  );
}
/**
 * Search cached stickers by text query (fuzzy match on description + emoji + setName).
 */
function searchStickers(query, limit = 10) {
  const queryLower = normalizeStickerSearchText(query);
  const results = [];
  for (const { value: sticker } of readStickerCacheStore(
    "entries",
    (store) => store.entries(),
    [],
  )) {
    let score = 0;
    const descLower = normalizeStickerSearchText(sticker.description);
    if (descLower.includes(queryLower)) score += 10;
    const queryWords = queryLower.split(/\s+/).filter(Boolean);
    const descWords = descLower.split(/\s+/);
    for (const qWord of queryWords)
      if (descWords.some((dWord) => dWord.includes(qWord))) score += 5;
    if (sticker.emoji && query.includes(sticker.emoji)) score += 8;
    if (normalizeStickerSearchText(sticker.setName).includes(queryLower)) score += 3;
    if (score > 0)
      results.push({
        sticker,
        score,
      });
  }
  return results
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.sticker);
}
/**
 * Get all cached stickers (for debugging/listing).
 */
function getAllCachedStickers() {
  return readStickerCacheStore(
    "entries",
    (store) => store.entries().map((entry) => entry.value),
    [],
  );
}
/**
 * Get cache statistics.
 */
function getCacheStats() {
  const stickers = getAllCachedStickers();
  if (stickers.length === 0) return { count: 0 };
  const sorted = [...stickers].toSorted(
    (a, b) => new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime(),
  );
  return {
    count: stickers.length,
    oldestAt: sorted[0]?.cachedAt,
    newestAt: sorted[sorted.length - 1]?.cachedAt,
  };
}
function listTelegramLegacyStickerCacheEntries(params = {}) {
  const cache = params.persistedPath ? loadCacheFile(params.persistedPath) : loadCache();
  return Object.entries(cache.stickers).map(([key, value]) => ({
    key,
    value: normalizeCachedStickerForStore(value),
  }));
}
function loadCacheFile(filePath) {
  const data = loadJsonFile(filePath);
  if (!data || typeof data !== "object")
    return {
      version: CACHE_VERSION,
      stickers: {},
    };
  const cache = data;
  if (cache.version !== CACHE_VERSION)
    return {
      version: CACHE_VERSION,
      stickers: {},
    };
  return cache;
}
//#endregion
//#region extensions/telegram/src/topic-name-cache.ts
const TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES = 2048;
const STORE_NAMESPACE_PREFIX = "telegram.topic-name-cache";
const TOPIC_NAME_CACHE_STATE_KEY = Symbol.for("openclaw.telegramTopicNameCacheState");
const DEFAULT_TOPIC_NAME_CACHE_SCOPE = "default";
function createTopicNameStore() {
  return /* @__PURE__ */ new Map();
}
function createTopicNameStoreState(namespace) {
  return {
    lastUpdatedAt: 0,
    store: createTopicNameStore(),
    hydrated: false,
    persistentStore: openTopicNamePersistentStore(namespace),
  };
}
function getTopicNameCacheState() {
  const globalStore = globalThis;
  const existing = globalStore[TOPIC_NAME_CACHE_STATE_KEY];
  if (existing) return existing;
  const state = { stores: /* @__PURE__ */ new Map() };
  globalStore[TOPIC_NAME_CACHE_STATE_KEY] = state;
  return state;
}
function cacheKey(chatId, threadId) {
  return `${chatId}:${threadId}`;
}
function namespaceForScope(scope) {
  const hash = createHash("sha256").update(scope).digest("hex").slice(0, 16);
  return `${STORE_NAMESPACE_PREFIX}.${hash}`;
}
function resolveTopicNameCachePath(storePath) {
  return `${storePath}.telegram-topic-names.json`;
}
function resolveTopicNameCacheScope(storePath) {
  return storePath;
}
function resolveTopicNameCacheNamespace(scope) {
  return namespaceForScope(scope);
}
function openTopicNamePersistentStore(namespace) {
  return getTelegramRuntime().state.openKeyedStore({
    namespace,
    maxEntries: 2048,
  });
}
function evictOldest(store) {
  if (store.size <= 2048) return;
  let oldestKey;
  let oldestTime = Infinity;
  for (const [key, entry] of store)
    if (entry.updatedAt < oldestTime) {
      oldestTime = entry.updatedAt;
      oldestKey = key;
    }
  if (oldestKey) store.delete(oldestKey);
  return oldestKey;
}
function isTopicEntry(value) {
  if (!value || typeof value !== "object") return false;
  const entry = value;
  return (
    typeof entry.name === "string" &&
    entry.name.length > 0 &&
    typeof entry.updatedAt === "number" &&
    Number.isFinite(entry.updatedAt)
  );
}
function getTopicStoreState(scope) {
  const state = getTopicNameCacheState();
  const stateKey = scope ?? DEFAULT_TOPIC_NAME_CACHE_SCOPE;
  const existing = state.stores.get(stateKey);
  if (existing) return existing;
  const next = createTopicNameStoreState(namespaceForScope(stateKey));
  state.stores.set(stateKey, next);
  return next;
}
async function hydrateTopicStoreState(state) {
  if (state.hydrated) return;
  if (state.hydratePromise) {
    await state.hydratePromise;
    return;
  }
  state.hydratePromise = (async () => {
    const entries = await state.persistentStore.entries();
    for (const { key, value } of entries) if (isTopicEntry(value)) state.store.set(key, value);
    state.lastUpdatedAt = Math.max(
      0,
      ...Array.from(state.store.values(), (entry) => entry.updatedAt),
    );
    state.hydrated = true;
  })().finally(() => {
    state.hydratePromise = void 0;
  });
  await state.hydratePromise;
}
function nextUpdatedAt(scope) {
  const state = getTopicStoreState(scope);
  const now = Date.now();
  state.lastUpdatedAt = now > state.lastUpdatedAt ? now : state.lastUpdatedAt + 1;
  return state.lastUpdatedAt;
}
async function updateTopicName(chatId, threadId, patch, scope) {
  const state = getTopicStoreState(scope);
  await hydrateTopicStoreState(state);
  const key = cacheKey(chatId, threadId);
  const existing = state.store.get(key);
  const iconColor = patch.iconColor ?? existing?.iconColor;
  const iconCustomEmojiId = patch.iconCustomEmojiId ?? existing?.iconCustomEmojiId;
  const closed = patch.closed ?? existing?.closed;
  const merged = {
    name: patch.name ?? existing?.name ?? "",
    updatedAt: nextUpdatedAt(scope),
    ...(iconColor !== void 0 ? { iconColor } : {}),
    ...(iconCustomEmojiId !== void 0 ? { iconCustomEmojiId } : {}),
    ...(closed !== void 0 ? { closed } : {}),
  };
  if (!merged.name) return;
  state.store.set(key, merged);
  await state.persistentStore.register(key, merged);
  const evictedKey = evictOldest(state.store);
  if (evictedKey) await state.persistentStore.delete(evictedKey);
}
async function getTopicName(chatId, threadId, scope) {
  const state = getTopicStoreState(scope);
  await hydrateTopicStoreState(state);
  const key = cacheKey(chatId, threadId);
  const entry = state.store.get(key);
  if (entry) {
    entry.updatedAt = nextUpdatedAt(scope);
    await state.persistentStore.register(key, entry);
  }
  return entry?.name;
}
async function listTelegramLegacyTopicNameCacheEntries(params) {
  const { value } = await readJsonFileWithFallback(params.persistedPath, {});
  return Object.entries(value)
    .filter((entry) => isTopicEntry(entry[1]))
    .toSorted(([, left], [, right]) => right.updatedAt - left.updatedAt)
    .slice(0, params.maxEntries ?? 2048)
    .map(([key, entry]) => ({
      key,
      value: entry,
    }));
}
//#endregion
export {
  resolveTopicNameCachePath as a,
  TELEGRAM_STICKER_CACHE_MAX_ENTRIES as c,
  getAllCachedStickers as d,
  getCacheStats as f,
  searchStickers as h,
  resolveTopicNameCacheNamespace as i,
  TELEGRAM_STICKER_CACHE_NAMESPACE as l,
  listTelegramLegacyStickerCacheEntries as m,
  getTopicName as n,
  resolveTopicNameCacheScope as o,
  getCachedSticker as p,
  listTelegramLegacyTopicNameCacheEntries as r,
  updateTopicName as s,
  TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES as t,
  cacheSticker as u,
};
