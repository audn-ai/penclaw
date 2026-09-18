import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { t as createDedupeCache } from "./dedupe-BqZ2YTEC.js";
import { O as resolveNonNegativeIntegerOption } from "./number-coercion-CJQ8TR--.js";
import {
  r as createPluginStateSyncKeyedStore,
  t as createCorePluginStateSyncKeyedStore,
} from "./plugin-state-store-CdAHpy0G.js";
//#region src/plugin-sdk/persistent-dedupe.ts
const LEGACY_PATH_OWNER_ID = "core:persistent-dedupe";
const DEFAULT_NAMESPACE_PREFIX = "persistent-dedupe";
function resolveNamespace(namespace) {
  return namespace?.trim() || "global";
}
function resolveScopedKey(namespace, key) {
  return `${namespace}:${key}`;
}
function isRecentTimestamp(seenAt, ttlMs, now) {
  return seenAt != null && (ttlMs <= 0 || now - seenAt < ttlMs);
}
function resolveEntrySeenAt(entry) {
  return typeof entry?.seenAt === "number" && Number.isFinite(entry.seenAt) ? entry.seenAt : void 0;
}
function resolveUnknownEntrySeenAt(value) {
  if (!value || typeof value !== "object" || !("seenAt" in value)) return;
  return typeof value.seenAt === "number" && Number.isFinite(value.seenAt) ? value.seenAt : void 0;
}
function shortHash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
function resolveEntryKey(key) {
  return `k.${shortHash(key)}`;
}
function createPersistentDedupeImportEntry(params) {
  return {
    key: resolveEntryKey(params.key),
    value: {
      key: params.key,
      seenAt: params.seenAt,
    },
    ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
  };
}
function resolveRemainingTtlMs(seenAt, ttlMs, now) {
  if (ttlMs <= 0) return;
  const remaining = ttlMs - (now - seenAt);
  return remaining > 0 ? { ttlMs: Math.max(1, Math.floor(remaining)) } : null;
}
function normalizeNamespacePrefix(value) {
  return (
    (value ?? DEFAULT_NAMESPACE_PREFIX)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^[._-]+|[._-]+$/g, "")
      .slice(0, 48) || DEFAULT_NAMESPACE_PREFIX
  );
}
function resolveStateNamespace(prefix, namespace) {
  return `${prefix}.${shortHash(namespace)}`;
}
function resolvePersistentDedupePluginStateNamespace(options) {
  return resolveStateNamespace(
    normalizeNamespacePrefix(options.namespacePrefix),
    resolveNamespace(options.namespace),
  );
}
function hasPluginStateOptions(options) {
  return typeof options.pluginId === "string";
}
function hasLegacyPathOptions(options) {
  return typeof options.resolveFilePath === "function";
}
function resolveStateMaxEntries(options) {
  const maxEntries = hasPluginStateOptions(options)
    ? options.stateMaxEntries
    : options.fileMaxEntries;
  return Math.max(1, resolveNonNegativeIntegerOption(maxEntries, 1));
}
function resolvePersistentStoreCacheKey(pluginId, namespace) {
  return `${pluginId}\0${namespace}`;
}
function createPersistentStoreResolver(options) {
  const maxEntries = resolveStateMaxEntries(options);
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const defaultTtlMs = ttlMs > 0 ? ttlMs : void 0;
  const stores = /* @__PURE__ */ new Map();
  if (hasPluginStateOptions(options)) {
    const pluginId = options.pluginId;
    const prefix = normalizeNamespacePrefix(options.namespacePrefix);
    return (namespace) => {
      const stateNamespace = resolveStateNamespace(prefix, namespace);
      const cacheKey = resolvePersistentStoreCacheKey(pluginId, stateNamespace);
      const existing = stores.get(cacheKey);
      if (existing) return existing;
      const store = createPluginStateSyncKeyedStore(pluginId, {
        namespace: stateNamespace,
        maxEntries,
        ...(defaultTtlMs != null ? { defaultTtlMs } : {}),
        ...(options.env ? { env: options.env } : {}),
      });
      stores.set(cacheKey, store);
      return store;
    };
  }
  const prefix = normalizeNamespacePrefix("legacy-path");
  return (namespace) => {
    const legacyPath = options.resolveFilePath(namespace);
    const stateNamespace = resolveStateNamespace(prefix, legacyPath);
    const cacheKey = resolvePersistentStoreCacheKey(LEGACY_PATH_OWNER_ID, stateNamespace);
    const existing = stores.get(cacheKey);
    if (existing) return existing;
    const store = createCorePluginStateSyncKeyedStore({
      ownerId: LEGACY_PATH_OWNER_ID,
      namespace: stateNamespace,
      maxEntries,
      ...(defaultTtlMs != null ? { defaultTtlMs } : {}),
      ...(options.env ? { env: options.env } : {}),
    });
    stores.set(cacheKey, store);
    return store;
  };
}
function parseLegacyDedupeData(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      data: {},
      invalidCount: 0,
    };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    return {
      data: {},
      invalidCount: 0,
    };
  const data = {};
  let invalidCount = 0;
  for (const [key, seenAt] of Object.entries(parsed))
    if (typeof seenAt === "number" && Number.isFinite(seenAt) && seenAt > 0) data[key] = seenAt;
    else invalidCount++;
  return {
    data,
    invalidCount,
  };
}
async function readPersistentDedupeLegacyJsonFileEntries(options) {
  const { data, invalidCount } = parseLegacyDedupeData(await fs.readFile(options.filePath, "utf8"));
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const now = options.now ?? Date.now();
  const entries = [];
  let skippedExpired = 0;
  for (const [key, seenAt] of Object.entries(data)) {
    const ttlOption = resolveRemainingTtlMs(seenAt, ttlMs, now);
    if (ttlOption === null) {
      skippedExpired++;
      continue;
    }
    entries.push(
      createPersistentDedupeImportEntry({
        key,
        seenAt,
        ...ttlOption,
      }),
    );
  }
  return {
    entries,
    skippedExpired,
    skippedInvalid: invalidCount,
  };
}
async function listPersistentDedupeLegacyJsonFileEntries(options) {
  return (await readPersistentDedupeLegacyJsonFileEntries(options)).entries;
}
function shouldReplacePersistentDedupeEntry(params) {
  const incomingSeenAt = resolveUnknownEntrySeenAt(params.incomingValue);
  return (
    incomingSeenAt != null &&
    incomingSeenAt > (resolveUnknownEntrySeenAt(params.existingValue) ?? 0)
  );
}
/** Import one retired JSON dedupe cache file into plugin-state SQLite during doctor repair. */
async function migratePersistentDedupeLegacyJsonFile(options) {
  const legacy = await readPersistentDedupeLegacyJsonFileEntries(options);
  const store = createPersistentStoreResolver(options)(resolveNamespace(options.namespace));
  const result = {
    imported: 0,
    skippedExpired: legacy.skippedExpired,
    skippedInvalid: legacy.skippedInvalid,
    skippedExisting: 0,
    removed: false,
  };
  for (const entry of legacy.entries)
    if (
      store.update?.(
        entry.key,
        (current) => {
          const currentSeenAt = resolveEntrySeenAt(current);
          if (currentSeenAt != null && currentSeenAt >= entry.value.seenAt) return;
          return entry.value;
        },
        entry.ttlMs != null ? { ttlMs: entry.ttlMs } : void 0,
      )
    )
      result.imported++;
    else result.skippedExisting++;
  if (options.removeFile !== false) {
    await fs.rm(options.filePath, { force: true });
    result.removed = true;
  }
  return result;
}
/** Create a dedupe helper that combines in-memory fast checks with SQLite-backed state. */
function createPersistentDedupe(options) {
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const memoryMaxSize = resolveNonNegativeIntegerOption(options.memoryMaxSize, 0);
  const getStore = createPersistentStoreResolver(options);
  const memory = createDedupeCache({
    ttlMs,
    maxSize: memoryMaxSize,
  });
  const inflight = /* @__PURE__ */ new Map();
  async function checkAndRecordInner(key, namespace, scopedKey, now, onDiskError) {
    if (memory.check(scopedKey, now)) return false;
    try {
      const entryKey = resolveEntryKey(key);
      const store = getStore(namespace);
      let duplicateSeenAt;
      store.update?.(
        entryKey,
        (entry) => {
          const seenAt = resolveEntrySeenAt(entry);
          if (isRecentTimestamp(seenAt, ttlMs, now)) {
            duplicateSeenAt = seenAt;
            return;
          }
          return {
            key,
            seenAt: now,
          };
        },
        ttlMs > 0 ? { ttlMs } : void 0,
      );
      if (duplicateSeenAt != null) {
        memory.check(scopedKey, duplicateSeenAt);
        return false;
      }
      memory.check(scopedKey, now);
      return true;
    } catch (error) {
      onDiskError?.(error);
      memory.check(scopedKey, now);
      return true;
    }
  }
  async function hasRecentInner(key, namespace, scopedKey, now, onDiskError) {
    if (memory.peek(scopedKey, now)) return true;
    try {
      const seenAt = resolveEntrySeenAt(getStore(namespace).lookup(resolveEntryKey(key)));
      if (!isRecentTimestamp(seenAt, ttlMs, now)) return false;
      memory.check(scopedKey, seenAt);
      return true;
    } catch (error) {
      onDiskError?.(error);
      return memory.peek(scopedKey, now);
    }
  }
  async function warmup(namespace = "global", onError) {
    const now = Date.now();
    try {
      let loaded = 0;
      for (const entry of getStore(resolveNamespace(namespace)).entries()) {
        const ts = resolveEntrySeenAt(entry.value);
        if (ts == null) continue;
        if (ttlMs > 0 && now - ts >= ttlMs) continue;
        const scopedKey = `${resolveNamespace(namespace)}:${entry.value.key}`;
        memory.check(scopedKey, ts);
        loaded++;
      }
      return loaded;
    } catch (error) {
      onError?.(error);
      return 0;
    }
  }
  async function checkAndRecord(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return true;
    const namespace = resolveNamespace(dedupeOptions?.namespace);
    const scopedKey = resolveScopedKey(namespace, trimmed);
    if (inflight.has(scopedKey)) return false;
    const onDiskError = dedupeOptions?.onDiskError ?? options.onDiskError;
    const work = checkAndRecordInner(
      trimmed,
      namespace,
      scopedKey,
      dedupeOptions?.now ?? Date.now(),
      onDiskError,
    );
    inflight.set(scopedKey, work);
    try {
      return await work;
    } finally {
      inflight.delete(scopedKey);
    }
  }
  async function hasRecent(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return false;
    const namespace = resolveNamespace(dedupeOptions?.namespace);
    const scopedKey = resolveScopedKey(namespace, trimmed);
    const onDiskError = dedupeOptions?.onDiskError ?? options.onDiskError;
    return hasRecentInner(
      trimmed,
      namespace,
      scopedKey,
      dedupeOptions?.now ?? Date.now(),
      onDiskError,
    );
  }
  async function forget(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return false;
    const namespace = resolveNamespace(dedupeOptions?.namespace);
    const scopedKey = resolveScopedKey(namespace, trimmed);
    memory.delete(scopedKey);
    try {
      return getStore(namespace).delete(resolveEntryKey(trimmed));
    } catch (error) {
      (dedupeOptions?.onDiskError ?? options.onDiskError)?.(error);
      return false;
    }
  }
  return {
    checkAndRecord,
    hasRecent,
    forget,
    warmup,
    clearMemory: () => memory.clear(),
    memorySize: () => memory.size(),
  };
}
function createReleasedClaimError(scopedKey) {
  return /* @__PURE__ */ new Error(`claim released before commit: ${scopedKey}`);
}
/** Create a claim/commit/release dedupe guard backed by memory and optional persistent storage. */
function createClaimableDedupe(options) {
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const memoryMaxSize = resolveNonNegativeIntegerOption(options.memoryMaxSize, 0);
  const memory = createDedupeCache({
    ttlMs,
    maxSize: memoryMaxSize,
  });
  let persistent = null;
  if (hasPluginStateOptions(options))
    persistent = createPersistentDedupe({
      ttlMs,
      memoryMaxSize,
      pluginId: options.pluginId,
      stateMaxEntries: Math.max(1, resolveNonNegativeIntegerOption(options.stateMaxEntries, 1)),
      ...(options.namespacePrefix ? { namespacePrefix: options.namespacePrefix } : {}),
      ...(options.env ? { env: options.env } : {}),
      ...(options.onDiskError ? { onDiskError: options.onDiskError } : {}),
    });
  else if (hasLegacyPathOptions(options))
    persistent = createPersistentDedupe({
      ttlMs,
      memoryMaxSize,
      fileMaxEntries: Math.max(1, resolveNonNegativeIntegerOption(options.fileMaxEntries, 1)),
      resolveFilePath: options.resolveFilePath,
      ...(options.env ? { env: options.env } : {}),
      ...(options.lockOptions ? { lockOptions: options.lockOptions } : {}),
      ...(options.onDiskError ? { onDiskError: options.onDiskError } : {}),
    });
  const inflight = /* @__PURE__ */ new Map();
  async function hasRecent(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return false;
    const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
    if (persistent) return persistent.hasRecent(trimmed, dedupeOptions);
    return memory.peek(scopedKey, dedupeOptions?.now);
  }
  async function forget(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return false;
    const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
    inflight.get(scopedKey)?.reject(createReleasedClaimError(scopedKey));
    inflight.delete(scopedKey);
    if (persistent) return persistent.forget(trimmed, dedupeOptions);
    memory.delete(scopedKey);
    return true;
  }
  async function claim(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return { kind: "claimed" };
    const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
    const existing = inflight.get(scopedKey);
    if (existing)
      return {
        kind: "inflight",
        pending: existing.promise,
      };
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    promise.catch(() => {});
    inflight.set(scopedKey, {
      promise,
      resolve,
      reject,
    });
    try {
      if (await hasRecent(trimmed, dedupeOptions)) {
        resolve(false);
        inflight.delete(scopedKey);
        return { kind: "duplicate" };
      }
      return { kind: "claimed" };
    } catch (error) {
      reject(error);
      inflight.delete(scopedKey);
      throw error;
    }
  }
  async function commit(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return true;
    const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
    const claimValue = inflight.get(scopedKey);
    try {
      const recorded = persistent
        ? await persistent.checkAndRecord(trimmed, dedupeOptions)
        : !memory.check(scopedKey, dedupeOptions?.now);
      claimValue?.resolve(recorded);
      return recorded;
    } catch (error) {
      claimValue?.reject(error);
      throw error;
    } finally {
      inflight.delete(scopedKey);
    }
  }
  function release(key, dedupeOptions) {
    const trimmed = key.trim();
    if (!trimmed) return;
    const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
    const claimLocal = inflight.get(scopedKey);
    if (!claimLocal) return;
    claimLocal.reject(dedupeOptions?.error ?? createReleasedClaimError(scopedKey));
    inflight.delete(scopedKey);
  }
  return {
    claim,
    commit,
    release,
    hasRecent,
    forget,
    warmup: persistent?.warmup ?? (async () => 0),
    clearMemory: () => {
      persistent?.clearMemory();
      memory.clear();
    },
    memorySize: () => persistent?.memorySize() ?? memory.size(),
  };
}
//#endregion
export {
  migratePersistentDedupeLegacyJsonFile as a,
  listPersistentDedupeLegacyJsonFileEntries as i,
  createPersistentDedupe as n,
  resolvePersistentDedupePluginStateNamespace as o,
  createPersistentDedupeImportEntry as r,
  shouldReplacePersistentDedupeEntry as s,
  createClaimableDedupe as t,
};
