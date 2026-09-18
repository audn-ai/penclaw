import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import pMap, { pMapSkip } from "p-map";
import { n as readJsonFileWithFallback } from "./json-store-CSxUwOCu.js";
//#region extensions/memory-wiki/src/source-sync-state.ts
const MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE = "source-sync";
const MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES = 2e4;
const EMPTY_STATE = {
  version: 1,
  entries: {},
};
let configuredSourceSyncStore;
const memorySourceSyncStateByVault = /* @__PURE__ */ new Map();
const sourceSyncStateChanges = /* @__PURE__ */ new WeakMap();
function resolveMemoryWikiSourceSyncStatePath(vaultRoot) {
  return path.join(vaultRoot, ".openclaw-wiki", "source-sync.json");
}
function cloneSourceSyncState(state) {
  return {
    version: 1,
    entries: Object.fromEntries(
      Object.entries(state.entries).map(([key, value]) => [key, { ...value }]),
    ),
  };
}
function normalizeSourceSyncState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY_STATE;
  const parsed = value;
  if (parsed.version !== 1 || !parsed.entries || typeof parsed.entries !== "object")
    return EMPTY_STATE;
  const entries = {};
  for (const [syncKey, entry] of Object.entries(parsed.entries)) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      (entry.group !== "bridge" && entry.group !== "unsafe-local") ||
      typeof entry.pagePath !== "string" ||
      typeof entry.sourcePath !== "string" ||
      typeof entry.sourceUpdatedAtMs !== "number" ||
      typeof entry.sourceSize !== "number" ||
      typeof entry.renderFingerprint !== "string"
    )
      continue;
    entries[syncKey] = {
      group: entry.group,
      pagePath: entry.pagePath,
      sourcePath: entry.sourcePath,
      sourceUpdatedAtMs: entry.sourceUpdatedAtMs,
      sourceSize: entry.sourceSize,
      renderFingerprint: entry.renderFingerprint,
    };
  }
  return {
    version: 1,
    entries,
  };
}
function resolveVaultRootKey$1(vaultRoot) {
  return createHash("sha256").update(path.resolve(vaultRoot), "utf8").digest("hex").slice(0, 32);
}
function resolveStateEntryKey$1(vaultRootKey, syncKey) {
  return createHash("sha256").update(`${vaultRootKey}\0${syncKey}`, "utf8").digest("hex");
}
function createMemoryFallbackStateStore() {
  return {
    async read(vaultRoot) {
      const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
      return cloneSourceSyncState(memorySourceSyncStateByVault.get(vaultRootKey) ?? EMPTY_STATE);
    },
    async write(vaultRoot, state) {
      assertSourceSyncStateWithinLimit(state);
      const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
      memorySourceSyncStateByVault.set(vaultRootKey, cloneSourceSyncState(state));
    },
  };
}
function assertSourceSyncStateWithinLimit(state) {
  const count = Object.keys(state.entries).length;
  if (count > 2e4)
    throw new Error(
      `Memory Wiki source sync state exceeds SQLite entry limit (${count}/${MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES})`,
    );
}
function assertMemoryWikiSourceSyncStateCapacity(params) {
  const projectedCount =
    Object.values(params.state.entries).filter((entry) => entry.group !== params.group).length +
    params.incomingCount;
  if (projectedCount > 2e4)
    throw new Error(
      `Memory Wiki source sync state exceeds SQLite entry limit (${projectedCount}/${MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES})`,
    );
}
function createMemoryWikiSourceSyncStateStore(openKeyedStore) {
  const openStore = () =>
    openKeyedStore({
      namespace: MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE,
      maxEntries: MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES,
      overflowPolicy: "reject-new",
    });
  return {
    async read(vaultRoot) {
      const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
      const entries = {};
      for (const row of await openStore().entries()) {
        const value = row.value;
        if (value.vaultRootKey !== vaultRootKey || typeof value.syncKey !== "string") continue;
        const entry = normalizeSourceSyncState({
          version: 1,
          entries: { [value.syncKey]: value },
        }).entries[value.syncKey];
        if (entry) entries[value.syncKey] = entry;
      }
      return {
        version: 1,
        entries,
      };
    },
    async write(vaultRoot, state, plan) {
      assertSourceSyncStateWithinLimit(state);
      const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
      const store = openStore();
      if (plan) {
        for (const syncKey of plan.deleteKeys)
          await store.delete(resolveStateEntryKey$1(vaultRootKey, syncKey));
        for (const syncKey of plan.upsertKeys) {
          const entry = state.entries[syncKey];
          if (!entry) throw new Error(`Missing tracked Memory Wiki source sync entry: ${syncKey}`);
          await store.register(resolveStateEntryKey$1(vaultRootKey, syncKey), {
            ...entry,
            vaultRootKey,
            syncKey,
          });
        }
        return;
      }
      const normalized = normalizeSourceSyncState(state);
      const nextKeys = new Set(
        Object.keys(normalized.entries).map((syncKey) =>
          resolveStateEntryKey$1(vaultRootKey, syncKey),
        ),
      );
      for (const row of await store.entries())
        if (row.value.vaultRootKey === vaultRootKey && !nextKeys.has(row.key))
          await store.delete(row.key);
      for (const [syncKey, entry] of Object.entries(normalized.entries))
        await store.register(resolveStateEntryKey$1(vaultRootKey, syncKey), {
          ...entry,
          vaultRootKey,
          syncKey,
        });
    },
  };
}
function configureMemoryWikiSourceSyncStateStore(store) {
  configuredSourceSyncStore = store;
}
function resolveSourceSyncStore(store) {
  return store ?? configuredSourceSyncStore ?? createMemoryFallbackStateStore();
}
async function readMemoryWikiSourceSyncState(vaultRoot, store) {
  const state = await resolveSourceSyncStore(store).read(vaultRoot);
  sourceSyncStateChanges.set(state, {
    upsertKeys: /* @__PURE__ */ new Set(),
    deleteKeys: /* @__PURE__ */ new Set(),
  });
  return state;
}
async function readLegacyMemoryWikiSourceSyncState(vaultRoot) {
  const { value: parsed } = await readJsonFileWithFallback(
    resolveMemoryWikiSourceSyncStatePath(vaultRoot),
    EMPTY_STATE,
  );
  return normalizeSourceSyncState(parsed);
}
async function writeMemoryWikiSourceSyncState(vaultRoot, state, store) {
  const changes = sourceSyncStateChanges.get(state);
  if (changes && changes.upsertKeys.size === 0 && changes.deleteKeys.size === 0) return;
  const plan = changes
    ? {
        upsertKeys: [...changes.upsertKeys],
        deleteKeys: [...changes.deleteKeys],
      }
    : void 0;
  await resolveSourceSyncStore(store).write(vaultRoot, state, plan);
  changes?.upsertKeys.clear();
  changes?.deleteKeys.clear();
}
async function shouldSkipImportedSourceWrite(params) {
  const entry = params.state.entries[params.syncKey];
  if (!entry) return false;
  if (
    entry.pagePath !== params.expectedPagePath ||
    entry.sourcePath !== params.expectedSourcePath ||
    entry.sourceUpdatedAtMs !== params.sourceUpdatedAtMs ||
    entry.sourceSize !== params.sourceSize ||
    entry.renderFingerprint !== params.renderFingerprint
  )
    return false;
  const pagePath = path.join(params.vaultRoot, params.expectedPagePath);
  return await fs
    .access(pagePath)
    .then(() => true)
    .catch(() => false);
}
async function pruneImportedSourceEntries(params) {
  let removedCount = 0;
  for (const [syncKey, entry] of Object.entries(params.state.entries)) {
    if (entry.group !== params.group || params.activeKeys.has(syncKey)) continue;
    const pageAbsPath = path.join(params.vaultRoot, entry.pagePath);
    await fs.rm(pageAbsPath, { force: true }).catch(() => void 0);
    delete params.state.entries[syncKey];
    const changes = sourceSyncStateChanges.get(params.state);
    changes?.upsertKeys.delete(syncKey);
    changes?.deleteKeys.add(syncKey);
    removedCount += 1;
  }
  return removedCount;
}
function setImportedSourceEntry(params) {
  const current = params.state.entries[params.syncKey];
  if (
    current?.group === params.entry.group &&
    current.pagePath === params.entry.pagePath &&
    current.sourcePath === params.entry.sourcePath &&
    current.sourceUpdatedAtMs === params.entry.sourceUpdatedAtMs &&
    current.sourceSize === params.entry.sourceSize &&
    current.renderFingerprint === params.entry.renderFingerprint
  )
    return;
  params.state.entries[params.syncKey] = params.entry;
  const changes = sourceSyncStateChanges.get(params.state);
  changes?.deleteKeys.delete(params.syncKey);
  changes?.upsertKeys.add(params.syncKey);
}
//#endregion
//#region extensions/memory-wiki/src/import-runs-state.ts
const LEGACY_IMPORT_RUN_READ_CONCURRENCY = 16;
const MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE = "import-runs";
const MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES = 2e4;
let configuredImportRunStore;
const memoryImportRunsByVault = /* @__PURE__ */ new Map();
function resolveMemoryWikiImportRunsDir(vaultRoot) {
  return path.join(vaultRoot, ".openclaw-wiki", "import-runs");
}
function resolveVaultRootKey(vaultRoot) {
  return createHash("sha256").update(path.resolve(vaultRoot), "utf8").digest("hex").slice(0, 32);
}
function resolveStateEntryKey(vaultRootKey, runId) {
  return createHash("sha256").update(`${vaultRootKey}\0meta\0${runId}`, "utf8").digest("hex");
}
function resolvePathStateEntryKey(params) {
  return createHash("sha256")
    .update(
      `${params.vaultRootKey}\0${params.runId}\0${params.kind}\0${params.index}\0${params.path}`,
      "utf8",
    )
    .digest("hex");
}
function cloneImportRunRecord(record) {
  return {
    ...record,
    createdPaths: [...record.createdPaths],
    updatedPaths: record.updatedPaths.map((entry) => ({ ...entry })),
  };
}
function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}
function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === "string" && entry.trim().length > 0);
}
function asNonNegativeInteger(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
function normalizeMemoryWikiImportRunRecord(raw) {
  const record = asRecord(raw);
  if (!record) return null;
  const runId = typeof record.runId === "string" ? record.runId.trim() : "";
  const exportPath = typeof record.exportPath === "string" ? record.exportPath.trim() : "";
  const sourcePath = typeof record.sourcePath === "string" ? record.sourcePath.trim() : "";
  const appliedAt = typeof record.appliedAt === "string" ? record.appliedAt.trim() : "";
  if (
    record.version !== 1 ||
    record.importType !== "chatgpt" ||
    !runId ||
    !exportPath ||
    !sourcePath ||
    !appliedAt
  )
    return null;
  const updatedPaths = Array.isArray(record.updatedPaths)
    ? record.updatedPaths
        .map((entry) => asRecord(entry))
        .filter((entry) => entry !== null)
        .flatMap((entry) => {
          const entryPath = typeof entry.path === "string" ? entry.path.trim() : "";
          if (!entryPath) return [];
          const snapshotPath =
            typeof entry.snapshotPath === "string" && entry.snapshotPath.trim()
              ? entry.snapshotPath.trim()
              : void 0;
          return [
            {
              path: entryPath,
              ...(snapshotPath ? { snapshotPath } : {}),
            },
          ];
        })
    : [];
  const rolledBackAt =
    typeof record.rolledBackAt === "string" && record.rolledBackAt.trim()
      ? record.rolledBackAt.trim()
      : void 0;
  return {
    version: 1,
    runId,
    importType: "chatgpt",
    exportPath,
    sourcePath,
    appliedAt,
    conversationCount: asNonNegativeInteger(record.conversationCount),
    createdCount: asNonNegativeInteger(record.createdCount),
    updatedCount: asNonNegativeInteger(record.updatedCount),
    skippedCount: asNonNegativeInteger(record.skippedCount),
    createdPaths: asStringArray(record.createdPaths),
    updatedPaths,
    ...(rolledBackAt ? { rolledBackAt } : {}),
  };
}
function normalizeMetaRecord(raw) {
  const record = asRecord(raw);
  if (!record || record.kind !== "meta") return null;
  const normalized = normalizeMemoryWikiImportRunRecord({
    ...record,
    createdPaths: [],
    updatedPaths: [],
  });
  const vaultRootKey = typeof record.vaultRootKey === "string" ? record.vaultRootKey : "";
  return normalized && vaultRootKey
    ? {
        ...normalized,
        kind: "meta",
        vaultRootKey,
      }
    : null;
}
function normalizePathRecord(raw) {
  const record = asRecord(raw);
  if (
    !record ||
    (record.kind !== "created-path" && record.kind !== "updated-path") ||
    typeof record.vaultRootKey !== "string" ||
    typeof record.runId !== "string" ||
    typeof record.path !== "string" ||
    typeof record.index !== "number" ||
    !Number.isFinite(record.index)
  )
    return null;
  const snapshotPath =
    typeof record.snapshotPath === "string" && record.snapshotPath.trim()
      ? record.snapshotPath.trim()
      : void 0;
  return {
    kind: record.kind,
    vaultRootKey: record.vaultRootKey,
    runId: record.runId,
    index: Math.max(0, Math.floor(record.index)),
    path: record.path,
    ...(snapshotPath ? { snapshotPath } : {}),
  };
}
function composeImportRunRecord(meta, pathRows) {
  const createdPaths = pathRows
    .filter((row) => row.kind === "created-path")
    .toSorted((left, right) => left.index - right.index)
    .map((row) => row.path);
  const updatedPaths = pathRows
    .filter((row) => row.kind === "updated-path")
    .toSorted((left, right) => left.index - right.index)
    .map((row) => {
      const entry = { path: row.path };
      if (row.snapshotPath) entry.snapshotPath = row.snapshotPath;
      return entry;
    });
  return {
    version: 1,
    runId: meta.runId,
    importType: "chatgpt",
    exportPath: meta.exportPath,
    sourcePath: meta.sourcePath,
    appliedAt: meta.appliedAt,
    conversationCount: meta.conversationCount,
    createdCount: meta.createdCount,
    updatedCount: meta.updatedCount,
    skippedCount: meta.skippedCount,
    createdPaths,
    updatedPaths,
    ...(meta.rolledBackAt ? { rolledBackAt: meta.rolledBackAt } : {}),
  };
}
function toMetaRecord(vaultRootKey, record) {
  return {
    version: 1,
    kind: "meta",
    vaultRootKey,
    runId: record.runId,
    importType: "chatgpt",
    exportPath: record.exportPath,
    sourcePath: record.sourcePath,
    appliedAt: record.appliedAt,
    conversationCount: record.conversationCount,
    createdCount: record.createdCount,
    updatedCount: record.updatedCount,
    skippedCount: record.skippedCount,
    ...(record.rolledBackAt ? { rolledBackAt: record.rolledBackAt } : {}),
  };
}
function toPathRecords(vaultRootKey, record) {
  return [
    ...record.createdPaths.map((entryPath, index) => ({
      kind: "created-path",
      vaultRootKey,
      runId: record.runId,
      index,
      path: entryPath,
    })),
    ...record.updatedPaths.map((entry, index) => ({
      kind: "updated-path",
      vaultRootKey,
      runId: record.runId,
      index,
      path: entry.path,
      ...(entry.snapshotPath ? { snapshotPath: entry.snapshotPath } : {}),
    })),
  ];
}
function createMemoryFallbackImportRunStore() {
  return {
    async read(vaultRoot, runId) {
      const vaultRootKey = resolveVaultRootKey(vaultRoot);
      const record = memoryImportRunsByVault.get(vaultRootKey)?.get(runId);
      return record ? cloneImportRunRecord(record) : null;
    },
    async write(vaultRoot, record) {
      const vaultRootKey = resolveVaultRootKey(vaultRoot);
      const records = memoryImportRunsByVault.get(vaultRootKey) ?? /* @__PURE__ */ new Map();
      records.set(record.runId, cloneImportRunRecord(record));
      memoryImportRunsByVault.set(vaultRootKey, records);
    },
    async list(vaultRoot) {
      const vaultRootKey = resolveVaultRootKey(vaultRoot);
      return [...(memoryImportRunsByVault.get(vaultRootKey)?.values() ?? [])].map(
        cloneImportRunRecord,
      );
    },
    async rowCount() {
      let count = 0;
      for (const records of memoryImportRunsByVault.values())
        for (const record of records.values())
          count += 1 + record.createdPaths.length + record.updatedPaths.length;
      return count;
    },
  };
}
function createMemoryWikiImportRunStateStore(openKeyedStore) {
  const openStore = () =>
    openKeyedStore({
      namespace: MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE,
      maxEntries: MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES,
    });
  return {
    async read(vaultRoot, runId) {
      const vaultRootKey = resolveVaultRootKey(vaultRoot);
      const meta = normalizeMetaRecord(
        await openStore().lookup(resolveStateEntryKey(vaultRootKey, runId)),
      );
      if (!meta || meta.vaultRootKey !== vaultRootKey) return null;
      return composeImportRunRecord(
        meta,
        (await openStore().entries())
          .map((entry) => normalizePathRecord(entry.value))
          .filter(
            (entry) =>
              entry !== null && entry.vaultRootKey === vaultRootKey && entry.runId === runId,
          ),
      );
    },
    async write(vaultRoot, record) {
      const vaultRootKey = resolveVaultRootKey(vaultRoot);
      const store = openStore();
      await store.register(
        resolveStateEntryKey(vaultRootKey, record.runId),
        toMetaRecord(vaultRootKey, record),
      );
      const nextPathKeys = /* @__PURE__ */ new Set();
      for (const pathRecord of toPathRecords(vaultRootKey, record)) {
        const key = resolvePathStateEntryKey({
          vaultRootKey,
          runId: record.runId,
          kind: pathRecord.kind,
          index: pathRecord.index,
          path: pathRecord.path,
        });
        nextPathKeys.add(key);
        await store.register(key, pathRecord);
      }
      for (const row of await store.entries()) {
        const pathRecord = normalizePathRecord(row.value);
        if (
          pathRecord?.vaultRootKey === vaultRootKey &&
          pathRecord.runId === record.runId &&
          !nextPathKeys.has(row.key)
        )
          await store.delete(row.key);
      }
    },
    async list(vaultRoot) {
      const vaultRootKey = resolveVaultRootKey(vaultRoot);
      const metaRows = /* @__PURE__ */ new Map();
      const pathRows = [];
      for (const row of await openStore().entries()) {
        const meta = normalizeMetaRecord(row.value);
        if (meta?.vaultRootKey === vaultRootKey) {
          metaRows.set(meta.runId, meta);
          continue;
        }
        const pathRecord = normalizePathRecord(row.value);
        if (pathRecord?.vaultRootKey === vaultRootKey) pathRows.push(pathRecord);
      }
      return [...metaRows.values()].map((meta) =>
        composeImportRunRecord(
          meta,
          pathRows.filter((row) => row.runId === meta.runId),
        ),
      );
    },
    async rowCount() {
      return (await openStore().entries()).length;
    },
  };
}
function configureMemoryWikiImportRunStateStore(store) {
  configuredImportRunStore = store;
}
function resolveImportRunStore(store) {
  return store ?? configuredImportRunStore ?? createMemoryFallbackImportRunStore();
}
async function readMemoryWikiImportRunRecord(vaultRoot, runId, store) {
  return await resolveImportRunStore(store).read(vaultRoot, runId);
}
async function writeMemoryWikiImportRunRecord(vaultRoot, record, store) {
  await resolveImportRunStore(store).write(vaultRoot, record);
}
async function listMemoryWikiImportRunRecords(vaultRoot, store) {
  return await resolveImportRunStore(store).list(vaultRoot);
}
async function countMemoryWikiImportRunStateRows(store) {
  return await resolveImportRunStore(store).rowCount();
}
async function readLegacyMemoryWikiImportRunRecords(vaultRoot) {
  const importRunsDir = resolveMemoryWikiImportRunsDir(vaultRoot);
  return await pMap(
    (
      await fs.readdir(importRunsDir, { withFileTypes: true }).catch((error) => {
        if (asRecord(error)?.code === "ENOENT") return [];
        throw error;
      })
    ).filter((entry) => entry.isFile() && entry.name.endsWith(".json")),
    async (entry) => {
      const raw = await fs.readFile(path.join(importRunsDir, entry.name), "utf8");
      return normalizeMemoryWikiImportRunRecord(JSON.parse(raw)) ?? pMapSkip;
    },
    {
      concurrency: LEGACY_IMPORT_RUN_READ_CONCURRENCY,
      stopOnError: true,
    },
  );
}
//#endregion
export {
  writeMemoryWikiSourceSyncState as S,
  readLegacyMemoryWikiSourceSyncState as _,
  createMemoryWikiImportRunStateStore as a,
  setImportedSourceEntry as b,
  readMemoryWikiImportRunRecord as c,
  MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES as d,
  MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE as f,
  pruneImportedSourceEntries as g,
  createMemoryWikiSourceSyncStateStore as h,
  countMemoryWikiImportRunStateRows as i,
  resolveMemoryWikiImportRunsDir as l,
  configureMemoryWikiSourceSyncStateStore as m,
  MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE as n,
  listMemoryWikiImportRunRecords as o,
  assertMemoryWikiSourceSyncStateCapacity as p,
  configureMemoryWikiImportRunStateStore as r,
  readLegacyMemoryWikiImportRunRecords as s,
  MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES as t,
  writeMemoryWikiImportRunRecord as u,
  readMemoryWikiSourceSyncState as v,
  shouldSkipImportedSourceWrite as x,
  resolveMemoryWikiSourceSyncStatePath as y,
};
