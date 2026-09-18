import { createHash, randomUUID } from "node:crypto";
import "./record-shared-DVKMvPXD.js";
import fs from "node:fs/promises";
import path from "node:path";
import { Category, MemoryStore, SyncAccumulator } from "matrix-js-sdk/lib/matrix.js";
import { t as createAsyncLock } from "./async-lock-BcLS4KOc.js";
import { w as resolveMatrixSqliteStateEnv } from "./crypto-state-store-Dng6snPT.js";
import { n as LogService } from "./logger--yR0BEhE.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as getMatrixRuntime } from "./runtime-C3viBnoh.js";
import { t as claimCurrentTokenStorageState } from "./storage-DhdP97oK.js";
//#region extensions/matrix/src/matrix/client/file-sync-store.ts
const STORE_VERSION = 1;
const PERSIST_DEBOUNCE_MS = 250;
const SYNC_CACHE_NAMESPACE = "sync-cache";
const SYNC_CACHE_MAX_ENTRIES = 2e4;
const SYNC_CACHE_MAX_CHUNKS = Math.floor((SYNC_CACHE_MAX_ENTRIES - 1) / 2);
const SYNC_CACHE_STATE_KEY = "current";
const SYNC_CACHE_CHUNK_BYTES = 24e3;
function normalizeRoomsData(value) {
  if (!isRecord(value)) return null;
  return {
    [Category.Join]: isRecord(value[Category.Join]) ? value[Category.Join] : {},
    [Category.Invite]: isRecord(value[Category.Invite]) ? value[Category.Invite] : {},
    [Category.Leave]: isRecord(value[Category.Leave]) ? value[Category.Leave] : {},
    [Category.Knock]: isRecord(value[Category.Knock]) ? value[Category.Knock] : {},
  };
}
function toPersistedSyncData(value) {
  if (!isRecord(value)) return null;
  if (typeof value.nextBatch === "string" && value.nextBatch.trim()) {
    const roomsData = normalizeRoomsData(value.roomsData);
    if (!Array.isArray(value.accountData) || !roomsData) return null;
    return {
      nextBatch: value.nextBatch,
      accountData: value.accountData,
      roomsData,
    };
  }
  if (typeof value.next_batch === "string" && value.next_batch.trim()) {
    const roomsData = normalizeRoomsData(value.rooms);
    if (!roomsData) return null;
    return {
      nextBatch: value.next_batch,
      accountData:
        isRecord(value.account_data) && Array.isArray(value.account_data.events)
          ? value.account_data.events
          : [],
      roomsData,
    };
  }
  return null;
}
function normalizePersistedStore(value) {
  if (!isRecord(value) || value.version !== STORE_VERSION) return null;
  return {
    version: STORE_VERSION,
    savedSync: toPersistedSyncData(value.savedSync),
    clientOptions: isRecord(value.clientOptions) ? value.clientOptions : void 0,
    cleanShutdown: value.cleanShutdown === true,
  };
}
function normalizeLegacyPersistedStore(value) {
  const persisted = normalizePersistedStore(value);
  if (persisted) return persisted;
  return {
    version: STORE_VERSION,
    savedSync: toPersistedSyncData(value),
    cleanShutdown: false,
  };
}
function cloneJson(value) {
  return structuredClone(value);
}
function syncDataToSyncResponse(syncData) {
  return {
    next_batch: syncData.nextBatch,
    rooms: syncData.roomsData,
    account_data: { events: syncData.accountData },
  };
}
var SqliteBackedMatrixSyncStore = class extends MemoryStore {
  constructor(storageRootDir) {
    super();
    this.storageRootDir = storageRootDir;
    this.persistLock = createAsyncLock();
    this.accumulator = new SyncAccumulator();
    this.savedSync = null;
    this.cleanShutdown = false;
    this.dirty = false;
    this.persistTimer = null;
    this.persistPromise = null;
    this.stateKey = SYNC_CACHE_STATE_KEY;
    let restoredSavedSync = null;
    let restoredClientOptions;
    let restoredCleanShutdown = false;
    let syncCacheStore = createNoopMatrixSyncCacheStore();
    let syncCacheStoreUnavailableError;
    try {
      syncCacheStore = openMatrixSyncCacheStore(storageRootDir);
      const persisted = readPersistedStoreFromSyncStore(syncCacheStore, this.stateKey);
      if (persisted) {
        restoredSavedSync = persisted.savedSync;
        restoredClientOptions = persisted.clientOptions;
        restoredCleanShutdown = persisted.cleanShutdown === true;
      }
    } catch (err) {
      syncCacheStoreUnavailableError = err;
      LogService.warn("MatrixSyncCacheStore", "Failed to load Matrix sync cache:", err);
    }
    this.store = syncCacheStore;
    this.storeUnavailableError = syncCacheStoreUnavailableError;
    this.savedSync = restoredSavedSync;
    this.savedClientOptions = restoredClientOptions;
    this.hadSavedSyncOnLoad = restoredSavedSync !== null;
    this.hadCleanShutdownOnLoad = this.hadSavedSyncOnLoad && restoredCleanShutdown;
    this.cleanShutdown = this.hadCleanShutdownOnLoad;
    if (this.savedSync) {
      this.accumulator.accumulate(syncDataToSyncResponse(this.savedSync), true);
      super.setSyncToken(this.savedSync.nextBatch);
    }
    if (this.savedClientOptions) super.storeClientOptions(this.savedClientOptions);
  }
  hasSavedSync() {
    return this.hadSavedSyncOnLoad;
  }
  hasSavedSyncFromCleanShutdown() {
    return this.hadCleanShutdownOnLoad;
  }
  getSavedSync() {
    return Promise.resolve(this.savedSync ? cloneJson(this.savedSync) : null);
  }
  getSavedSyncToken() {
    return Promise.resolve(this.savedSync?.nextBatch ?? null);
  }
  setSyncData(syncData) {
    this.accumulator.accumulate(syncData);
    this.savedSync = this.accumulator.getJSON();
    this.markDirtyAndSchedulePersist();
    return Promise.resolve();
  }
  getClientOptions() {
    return Promise.resolve(this.savedClientOptions ? cloneJson(this.savedClientOptions) : void 0);
  }
  storeClientOptions(options) {
    this.savedClientOptions = cloneJson(options);
    super.storeClientOptions(options);
    this.markDirtyAndSchedulePersist();
    return Promise.resolve();
  }
  save(force = false) {
    if (force) return this.flush();
    return Promise.resolve();
  }
  wantsSave() {
    return false;
  }
  async deleteAllData() {
    this.assertStoreAvailable();
    if (this.persistTimer) {
      clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
    this.dirty = false;
    await this.persistPromise?.catch(() => void 0);
    await super.deleteAllData();
    this.savedSync = null;
    this.savedClientOptions = void 0;
    this.cleanShutdown = false;
    this.store.delete(metaKey(this.stateKey));
    for (const row of this.store.entries())
      if (row.key.startsWith(chunkKeyPrefix(this.stateKey))) this.store.delete(row.key);
    await fs
      .rm(resolveLegacySyncCachePath(this.storageRootDir), { force: true })
      .catch(() => void 0);
  }
  markCleanShutdown() {
    this.cleanShutdown = true;
    this.dirty = true;
  }
  async flush() {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer);
      this.persistTimer = null;
    }
    while (this.dirty || this.persistPromise) {
      if (this.dirty && !this.persistPromise)
        this.persistPromise = this.persist().finally(() => {
          this.persistPromise = null;
        });
      await this.persistPromise;
    }
  }
  markDirtyAndSchedulePersist() {
    this.cleanShutdown = false;
    this.dirty = true;
    if (this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = null;
      this.flush().catch((err) => {
        LogService.warn("MatrixSyncCacheStore", "Failed to persist Matrix sync store:", err);
      });
    }, PERSIST_DEBOUNCE_MS);
    this.persistTimer.unref?.();
  }
  async persist() {
    this.assertStoreAvailable();
    this.dirty = false;
    const payload = {
      version: STORE_VERSION,
      savedSync: this.savedSync ? cloneJson(this.savedSync) : null,
      cleanShutdown: this.cleanShutdown,
      ...(this.savedClientOptions ? { clientOptions: cloneJson(this.savedClientOptions) } : {}),
    };
    try {
      await this.persistLock(async () => {
        this.writePersistedStore(payload);
        claimCurrentTokenStorageState({ rootDir: this.storageRootDir });
      });
    } catch (err) {
      this.dirty = true;
      throw err;
    }
  }
  writePersistedStore(payload) {
    const rows = buildSyncCacheRows(this.stateKey, payload);
    for (const row of rows.chunks) this.store.register(row.key, row.value);
    this.store.register(rows.meta.key, rows.meta.value);
    for (const row of this.store.entries())
      if (row.key.startsWith(chunkKeyPrefix(this.stateKey)) && !rows.nextChunkKeys.has(row.key))
        this.store.delete(row.key);
  }
  assertStoreAvailable() {
    if (this.storeUnavailableError == null) return;
    throw new Error("Matrix sync cache SQLite store is unavailable; cannot persist sync state", {
      cause: this.storeUnavailableError,
    });
  }
};
function createNoopMatrixSyncCacheStore() {
  return {
    register: () => {},
    registerIfAbsent: () => false,
    lookup: () => void 0,
    consume: () => void 0,
    delete: () => false,
    entries: () => [],
    clear: () => {},
  };
}
function readPersistedStoreFromSyncStore(store, stateKey) {
  const meta = store.lookup(metaKey(stateKey));
  if (!isSyncCacheMeta(meta)) return null;
  const chunks = [];
  for (let index = 0; index < meta.chunkCount; index += 1) {
    const chunk = store.lookup(chunkKey(stateKey, meta.generation, index));
    if (!isSyncCacheChunk(chunk) || chunk.index !== index)
      return normalizePersistedStore({
        version: STORE_VERSION,
        savedSync: null,
        clientOptions: meta.clientOptions,
        cleanShutdown: false,
      });
    chunks.push(chunk.data);
  }
  let savedSync = null;
  if (chunks.length > 0) {
    const syncJson = chunks.join("");
    if (meta.syncDigest !== digestText(syncJson))
      return normalizePersistedStore({
        version: STORE_VERSION,
        savedSync: null,
        clientOptions: meta.clientOptions,
        cleanShutdown: false,
      });
    try {
      savedSync = toPersistedSyncData(JSON.parse(syncJson));
    } catch {
      savedSync = null;
    }
  }
  return normalizePersistedStore({
    version: STORE_VERSION,
    savedSync,
    clientOptions: meta.clientOptions,
    cleanShutdown: meta.cleanShutdown,
  });
}
function openMatrixSyncCacheStore(storageRootDir) {
  return getMatrixRuntime().state.openSyncKeyedStore(
    openMatrixSyncCacheStoreOptions(storageRootDir),
  );
}
function metaKey(stateKey) {
  return `${stateKey}:meta`;
}
function chunkKeyPrefix(stateKey) {
  return `${stateKey}:sync:`;
}
function chunkKey(stateKey, generation, index) {
  return `${chunkKeyPrefix(stateKey)}${generation}:${index}`;
}
function resolveLegacySyncCachePath(storageRootDir) {
  return path.join(storageRootDir, "bot-storage.json");
}
function digestText(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
function isSyncCacheMeta(value) {
  return (
    isRecord(value) &&
    value.kind === "meta" &&
    value.version === STORE_VERSION &&
    typeof value.generation === "string" &&
    value.generation.trim() !== "" &&
    typeof value.chunkCount === "number" &&
    Number.isSafeInteger(value.chunkCount) &&
    value.chunkCount >= 0 &&
    value.chunkCount <= SYNC_CACHE_MAX_CHUNKS
  );
}
function isSyncCacheChunk(value) {
  return (
    isRecord(value) &&
    value.kind === "sync-chunk" &&
    typeof value.index === "number" &&
    Number.isSafeInteger(value.index) &&
    value.index >= 0 &&
    typeof value.data === "string"
  );
}
function chunkSyncCacheJson(value) {
  const chunks = [];
  const pushChunk = (chunk) => {
    if (chunks.length >= SYNC_CACHE_MAX_CHUNKS)
      throw new Error("Matrix sync cache exceeds SQLite chunk limit");
    chunks.push(chunk);
  };
  let current = "";
  let currentBytes = 0;
  for (const char of value) {
    const charBytes = Buffer.byteLength(char, "utf8");
    if (current && currentBytes + charBytes > SYNC_CACHE_CHUNK_BYTES) {
      pushChunk(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += charBytes;
  }
  if (current) pushChunk(current);
  return chunks;
}
function buildSyncCacheRows(stateKey, payload) {
  const generation = randomUUID().replaceAll("-", "");
  const syncJson = payload.savedSync ? JSON.stringify(payload.savedSync) : "";
  const chunks = (syncJson ? chunkSyncCacheJson(syncJson) : []).map((data, index) => ({
    key: chunkKey(stateKey, generation, index),
    value: {
      kind: "sync-chunk",
      index,
      data,
    },
  }));
  return {
    chunks,
    nextChunkKeys: new Set(chunks.map((chunk) => chunk.key)),
    meta: {
      key: metaKey(stateKey),
      value: {
        kind: "meta",
        version: STORE_VERSION,
        generation,
        chunkCount: chunks.length,
        ...(syncJson ? { syncDigest: digestText(syncJson) } : {}),
        ...(payload.clientOptions ? { clientOptions: payload.clientOptions } : {}),
        cleanShutdown: payload.cleanShutdown === true,
      },
    },
  };
}
async function readLegacyMatrixSyncCacheState(storageRootDir) {
  try {
    const raw = await fs.readFile(resolveLegacySyncCachePath(storageRootDir), "utf8");
    const persisted = normalizeLegacyPersistedStore(JSON.parse(raw));
    if (!persisted?.savedSync && !persisted?.clientOptions) return null;
    return persisted;
  } catch {
    return null;
  }
}
async function hasMatrixSyncCacheStateInStore(params) {
  const stateKey = SYNC_CACHE_STATE_KEY;
  const meta = await params.store.lookup(metaKey(stateKey));
  if (!isSyncCacheMeta(meta) || meta.chunkCount <= 0) return false;
  const chunks = [];
  for (let index = 0; index < meta.chunkCount; index += 1) {
    const chunk = await params.store.lookup(chunkKey(stateKey, meta.generation, index));
    if (!isSyncCacheChunk(chunk) || chunk.index !== index) return false;
    chunks.push(chunk.data);
  }
  const syncJson = chunks.join("");
  if (meta.syncDigest !== digestText(syncJson)) return false;
  try {
    return toPersistedSyncData(JSON.parse(syncJson)) !== null;
  } catch {
    return false;
  }
}
async function writeMatrixSyncCacheStateToStore(params) {
  const stateKey = SYNC_CACHE_STATE_KEY;
  const rows = buildSyncCacheRows(stateKey, params.payload);
  for (const row of rows.chunks) await params.store.register(row.key, row.value);
  await params.store.register(rows.meta.key, rows.meta.value);
  for (const row of await params.store.entries())
    if (row.key.startsWith(chunkKeyPrefix(stateKey)) && !rows.nextChunkKeys.has(row.key))
      await params.store.delete(row.key);
}
function openMatrixSyncCacheStoreOptions(storageRootDir) {
  return {
    namespace: SYNC_CACHE_NAMESPACE,
    maxEntries: SYNC_CACHE_MAX_ENTRIES,
    env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir }),
  };
}
//#endregion
export {
  writeMatrixSyncCacheStateToStore as a,
  readLegacyMatrixSyncCacheState as i,
  hasMatrixSyncCacheStateInStore as n,
  openMatrixSyncCacheStoreOptions as r,
  SqliteBackedMatrixSyncStore as t,
};
