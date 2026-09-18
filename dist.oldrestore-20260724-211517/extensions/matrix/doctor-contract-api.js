import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import "../../record-shared-DVKMvPXD.js";
import {
  C as writeMatrixRecoveryKeyStateToStore,
  a as hasMatrixLegacyCryptoMigrationStateInStore,
  b as writeMatrixIdbSnapshotJsonToStore,
  d as openMatrixLegacyCryptoMigrationStoreOptions,
  f as openMatrixRecoveryKeyStoreOptions,
  h as readLegacyMatrixRecoveryKeyState,
  i as hasMatrixIdbSnapshotStateInStore,
  n as MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
  o as hasMatrixRecoveryKeyStateInStore,
  p as readLegacyMatrixLegacyCryptoMigrationState,
  r as MATRIX_RECOVERY_KEY_FILENAME,
  t as MATRIX_IDB_SNAPSHOT_FILENAME,
  u as openMatrixIdbSnapshotStoreOptions,
  x as writeMatrixLegacyCryptoMigrationStateToStore,
} from "../../crypto-state-store-Dng6snPT.js";
import {
  n as normalizeCompatibilityConfig,
  t as legacyConfigRules,
} from "../../doctor-contract-BGpUCkwm.js";
import {
  a as writeMatrixSyncCacheStateToStore,
  i as readLegacyMatrixSyncCacheState,
  n as hasMatrixSyncCacheStateInStore,
  r as openMatrixSyncCacheStoreOptions,
} from "../../file-sync-store-aVPL2tIF.js";
import { n as readLegacyMatrixIdbSnapshotState } from "../../idb-persistence-1FhhVvxZ.js";
import {
  a as resolveMatrixInboundDedupeStateNamespace,
  n as MATRIX_INBOUND_DEDUPE_TTL_MS,
  r as buildMatrixInboundDedupeEventKey,
} from "../../inbound-dedupe-COPa_t_3.js";
import { r as createPersistentDedupeImportEntry } from "../../persistent-dedupe-CMTHL22F.js";
import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import { t as archiveLegacyStateSource } from "../../runtime-doctor-DOtJb07X.js";
import {
  a as openMatrixStorageMetaStoreOptions,
  i as normalizeMatrixStorageMetadata,
  n as hasMatrixStorageMetaStateInStore,
  u as writeMatrixStorageMetaStateToStore,
} from "../../storage-DhdP97oK.js";
//#region extensions/matrix/src/matrix/monitor/inbound-dedupe-migration.ts
const LEGACY_SQLITE_NAMESPACE = "inbound-dedupe";
const LEGACY_SQLITE_MAX_ENTRIES = 2e4;
const LEGACY_MARKERS_NAMESPACE = "inbound-dedupe-migrations";
const LEGACY_MARKERS_MAX_ENTRIES = 1e3;
const LEGACY_JSON_VERSION = 1;
const STORAGE_META_FILENAME = "storage-meta.json";
const MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME = "inbound-dedupe.json";
async function collectMatrixInboundDedupeSources(stateDir) {
  const matrixRoot = path.join(stateDir, "matrix");
  const sqliteRoots = /* @__PURE__ */ new Set();
  const jsonRoots = /* @__PURE__ */ new Set();
  async function visit(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        if (entry.name === "openclaw.sqlite" && path.basename(dir) === "state")
          sqliteRoots.add(path.dirname(dir));
        else if (entry.name === "inbound-dedupe.json") jsonRoots.add(dir);
        continue;
      }
      if (entry.isDirectory()) await visit(entryPath);
    }
  }
  await visit(matrixRoot);
  const matrixRootResolved = path.resolve(matrixRoot);
  const isAccountRoot = (root) => path.resolve(root) !== matrixRootResolved;
  return {
    sqliteRoots: [...sqliteRoots].filter(isAccountRoot).toSorted(),
    jsonRoots: [...jsonRoots].filter(isAccountRoot).toSorted(),
  };
}
function openLegacySqliteStore(io, storageRootDir) {
  return io.context.openPluginStateKeyedStore({
    namespace: LEGACY_SQLITE_NAMESPACE,
    maxEntries: LEGACY_SQLITE_MAX_ENTRIES,
    env: {
      ...io.env,
      OPENCLAW_STATE_DIR: storageRootDir,
    },
  });
}
function openLegacyMarkersStore(io, storageRootDir) {
  return io.context.openPluginStateKeyedStore({
    namespace: LEGACY_MARKERS_NAMESPACE,
    maxEntries: LEGACY_MARKERS_MAX_ENTRIES,
    env: {
      ...io.env,
      OPENCLAW_STATE_DIR: storageRootDir,
    },
  });
}
function normalizeLegacyTimestamp(raw) {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return Math.max(0, Math.floor(raw));
}
function parseLegacySqliteRow(row) {
  const value = isRecord(row.value) ? row.value : {};
  const roomId = typeof value.roomId === "string" ? value.roomId.trim() : "";
  const eventId = typeof value.eventId === "string" ? value.eventId.trim() : "";
  const ts = normalizeLegacyTimestamp(value.ts);
  const separator = row.key.lastIndexOf(":");
  if (!roomId || !eventId || ts === null || separator <= 0) return null;
  const accountId = row.key.slice(0, separator);
  const digest = createHash("sha256")
    .update(accountId)
    .update("\0")
    .update(roomId)
    .update("\0")
    .update(eventId)
    .digest("hex");
  if (row.key.slice(separator + 1) !== digest) return null;
  return {
    accountId,
    roomId,
    eventId,
    ts,
  };
}
/** Reads one storage root's legacy SQLite dedupe rows; throws on store errors. */
async function readLegacyInboundDedupeSqliteSource(io, storageRootDir) {
  const rows = await openLegacySqliteStore(io, storageRootDir).entries();
  const markerRows = await openLegacyMarkersStore(io, storageRootDir).entries();
  const markers = [];
  for (const row of rows) {
    const marker = parseLegacySqliteRow(row);
    if (marker) markers.push(marker);
  }
  return {
    markers,
    legacyRowCount: rows.length + markerRows.length,
  };
}
/** Clears one storage root's retired legacy dedupe namespaces after import. */
async function retireLegacyInboundDedupeSqliteRows(io, storageRootDir) {
  await openLegacySqliteStore(io, storageRootDir).clear();
  await openLegacyMarkersStore(io, storageRootDir).clear();
}
async function resolveJsonRootAccountId(storageRootDir) {
  for (const filename of [STORAGE_META_FILENAME, `${STORAGE_META_FILENAME}.migrated`])
    try {
      const metadata = normalizeMatrixStorageMetadata(
        JSON.parse(await fs.readFile(path.join(storageRootDir, filename), "utf8")),
      );
      if (metadata?.accountId) return metadata.accountId;
    } catch {}
  return "default";
}
/**
 * Reads one storage root's legacy inbound-dedupe.json markers. Throws on file
 * read errors so a transiently unreadable file is never retired unread, and
 * returns null for malformed content so the caller can archive it explicitly.
 */
async function readLegacyInboundDedupeJsonSource(storageRootDir) {
  const jsonPath = path.join(storageRootDir, MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME);
  const raw = await fs.readFile(jsonPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed) || parsed.version !== LEGACY_JSON_VERSION || !Array.isArray(parsed.entries))
    return null;
  const accountId = await resolveJsonRootAccountId(storageRootDir);
  const markers = [];
  for (const entry of parsed.entries) {
    if (!isRecord(entry) || typeof entry.key !== "string") continue;
    const separator = entry.key.indexOf("|");
    if (separator <= 0) continue;
    const roomId = entry.key.slice(0, separator).trim();
    const eventId = entry.key.slice(separator + 1).trim();
    const ts = normalizeLegacyTimestamp(entry.ts);
    if (!roomId || !eventId || ts === null) continue;
    markers.push({
      accountId,
      roomId,
      eventId,
      ts,
    });
  }
  return markers;
}
/**
 * Imports the globally newest legacy markers into the claimable-dedupe store.
 * Never exceeds capacity: eviction is by row creation time, so letting fresh
 * imports overflow the namespace would evict the newer rows the runtime
 * committed since the upgrade. Throws on store errors so the caller keeps the
 * legacy sources for the next doctor attempt.
 */
async function importNewestInboundDedupeMarkers(params) {
  const now = params.now ?? Date.now();
  const stateMaxEntries = params.stateMaxEntries ?? 2e4;
  const newestByKey = /* @__PURE__ */ new Map();
  for (const marker of params.markers) {
    const key = buildMatrixInboundDedupeEventKey(marker);
    if (!key) continue;
    const existing = newestByKey.get(key);
    if (!existing || marker.ts > existing.ts)
      newestByKey.set(key, {
        ...marker,
        key,
      });
  }
  const markers = [...newestByKey.values()].toSorted((left, right) => right.ts - left.ts);
  const store = params.io.context.openPluginStateKeyedStore({
    namespace: resolveMatrixInboundDedupeStateNamespace(),
    maxEntries: stateMaxEntries,
    defaultTtlMs: MATRIX_INBOUND_DEDUPE_TTL_MS,
    env: params.io.env,
  });
  let capacity = Math.max(0, stateMaxEntries - (await store.entries()).length);
  let imported = 0;
  for (const marker of markers) {
    if (capacity <= 0) break;
    const remainingTtlMs = MATRIX_INBOUND_DEDUPE_TTL_MS - (now - marker.ts);
    if (remainingTtlMs <= 0) continue;
    const entry = createPersistentDedupeImportEntry({
      key: marker.key,
      seenAt: marker.ts,
      ttlMs: Math.max(1, Math.floor(remainingTtlMs)),
    });
    if (await store.registerIfAbsent(entry.key, entry.value, { ttlMs: entry.ttlMs ?? 2592e6 })) {
      imported += 1;
      capacity -= 1;
    }
  }
  return {
    imported,
    total: markers.length,
  };
}
//#endregion
//#region extensions/matrix/doctor-contract-api.ts
const MATRIX_SYNC_CACHE_FILENAME = "bot-storage.json";
const MATRIX_STORAGE_META_FILENAME = "storage-meta.json";
async function collectLegacyMatrixStateRoots(stateDir, filename) {
  const matrixRoot = path.join(stateDir, "matrix");
  const roots = [];
  async function visit(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === filename) {
        roots.push(dir);
        continue;
      }
      if (entry.isDirectory()) await visit(entryPath);
    }
  }
  await visit(matrixRoot);
  return roots.filter((root) => path.resolve(root) !== path.resolve(matrixRoot)).toSorted();
}
async function collectLegacySyncCacheRoots(stateDir) {
  return collectLegacyMatrixStateRoots(stateDir, MATRIX_SYNC_CACHE_FILENAME);
}
async function readLegacyMatrixStorageMetadata(storageRootDir) {
  try {
    return normalizeMatrixStorageMetadata(
      JSON.parse(
        await fs.readFile(path.join(storageRootDir, MATRIX_STORAGE_META_FILENAME), "utf8"),
      ),
    );
  } catch {
    return null;
  }
}
async function archiveLegacySyncCache(params) {
  await archiveLegacyMatrixStateFile({
    ...params,
    filename: MATRIX_SYNC_CACHE_FILENAME,
    label: "Matrix sync cache",
  });
}
async function archiveLegacyMatrixStateFile(params) {
  const warningCount = params.warnings.length;
  await archiveLegacyStateSource({
    filePath: path.join(params.storageRootDir, params.filename),
    label: params.label,
    changes: params.changes,
    warnings: params.warnings,
  });
  if (params.notice && params.warnings.length === warningCount) params.notices?.push(params.notice);
}
const stateMigrations = [
  {
    id: "matrix-inbound-dedupe-to-claimable-dedupe",
    label: "Matrix inbound dedupe markers",
    async detectLegacyState(params) {
      const io = {
        context: params.context,
        env: params.env,
      };
      const preview = [];
      const sources = await collectMatrixInboundDedupeSources(params.stateDir);
      for (const storageRootDir of sources.sqliteRoots) {
        try {
          if ((await readLegacyInboundDedupeSqliteSource(io, storageRootDir)).legacyRowCount === 0)
            continue;
        } catch {
          continue;
        }
        preview.push(
          `Matrix inbound dedupe rows can migrate to the claimable dedupe store: ${storageRootDir}`,
        );
      }
      for (const storageRootDir of sources.jsonRoots)
        preview.push(
          `Matrix inbound dedupe JSON can migrate to the claimable dedupe store: ${path.join(storageRootDir, MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME)}`,
        );
      return preview.length > 0 ? { preview } : null;
    },
    async migrateLegacyState(params) {
      const io = {
        context: params.context,
        env: params.env,
      };
      const changes = [];
      const warnings = [];
      const sources = await collectMatrixInboundDedupeSources(params.stateDir);
      const gathered = [];
      const sqliteRootsToRetire = [];
      for (const storageRootDir of sources.sqliteRoots)
        try {
          const source = await readLegacyInboundDedupeSqliteSource(io, storageRootDir);
          if (source.legacyRowCount === 0) continue;
          gathered.push(...source.markers);
          sqliteRootsToRetire.push(storageRootDir);
        } catch (err) {
          warnings.push(
            `Failed reading Matrix inbound dedupe rows for ${storageRootDir}: ${String(err)}; left legacy rows in place`,
          );
        }
      const jsonRootsToRetire = [];
      for (const storageRootDir of sources.jsonRoots)
        try {
          const markers = await readLegacyInboundDedupeJsonSource(storageRootDir);
          if (markers === null)
            warnings.push(
              `Matrix inbound dedupe JSON for ${storageRootDir} is malformed; archived without import`,
            );
          else gathered.push(...markers);
          jsonRootsToRetire.push(storageRootDir);
        } catch (err) {
          warnings.push(
            `Failed reading Matrix inbound dedupe JSON for ${storageRootDir}: ${String(err)}; left legacy file in place`,
          );
        }
      if (sqliteRootsToRetire.length + jsonRootsToRetire.length === 0)
        return {
          changes,
          warnings,
        };
      try {
        const result = await importNewestInboundDedupeMarkers({
          io,
          markers: gathered,
        });
        changes.push(
          `Migrated Matrix inbound dedupe markers to the claimable dedupe store (${result.imported} of ${result.total} entries)`,
        );
      } catch (err) {
        warnings.push(
          `Failed importing Matrix inbound dedupe markers: ${String(err)}; left legacy sources in place`,
        );
        return {
          changes,
          warnings,
        };
      }
      for (const storageRootDir of sqliteRootsToRetire)
        try {
          await retireLegacyInboundDedupeSqliteRows(io, storageRootDir);
          changes.push(`Retired Matrix inbound dedupe rows for ${storageRootDir}`);
        } catch (err) {
          warnings.push(
            `Failed retiring Matrix inbound dedupe rows for ${storageRootDir}: ${String(err)}`,
          );
        }
      for (const storageRootDir of jsonRootsToRetire)
        await archiveLegacyMatrixStateFile({
          storageRootDir,
          filename: MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME,
          label: "Matrix inbound dedupe",
          changes,
          warnings,
        });
      return {
        changes,
        warnings,
      };
    },
  },
  {
    id: "matrix-storage-meta-json-to-plugin-state",
    label: "Matrix storage metadata",
    async detectLegacyState(params) {
      const previews = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_STORAGE_META_FILENAME,
      )) {
        if (!(await readLegacyMatrixStorageMetadata(storageRootDir))) continue;
        previews.push(`Matrix storage metadata JSON can migrate to SQLite: ${storageRootDir}`);
      }
      return previews.length > 0 ? { preview: previews } : null;
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const notices = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_STORAGE_META_FILENAME,
      )) {
        const payload = await readLegacyMatrixStorageMetadata(storageRootDir);
        if (!payload) continue;
        const store = params.context.openPluginStateKeyedStore(
          openMatrixStorageMetaStoreOptions(storageRootDir),
        );
        if (await hasMatrixStorageMetaStateInStore({ store })) {
          await archiveLegacyMatrixStateFile({
            storageRootDir,
            filename: MATRIX_STORAGE_META_FILENAME,
            label: "Matrix storage metadata",
            changes,
            warnings,
            notices,
            notice: `Kept existing Matrix storage metadata in SQLite and archived the legacy source for ${storageRootDir}`,
          });
          continue;
        }
        await writeMatrixStorageMetaStateToStore({
          payload,
          store,
        });
        changes.push(`Migrated Matrix storage metadata JSON to SQLite for ${storageRootDir}`);
        await archiveLegacyMatrixStateFile({
          storageRootDir,
          filename: MATRIX_STORAGE_META_FILENAME,
          label: "Matrix storage metadata",
          changes,
          warnings,
        });
      }
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
  {
    id: "matrix-sync-cache-json-to-plugin-state",
    label: "Matrix sync cache",
    async detectLegacyState(params) {
      const previews = [];
      for (const storageRootDir of await collectLegacySyncCacheRoots(params.stateDir)) {
        if (!(await readLegacyMatrixSyncCacheState(storageRootDir))) continue;
        previews.push(`Matrix sync cache JSON can migrate to SQLite: ${storageRootDir}`);
      }
      return previews.length > 0 ? { preview: previews } : null;
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const notices = [];
      for (const storageRootDir of await collectLegacySyncCacheRoots(params.stateDir)) {
        const persisted = await readLegacyMatrixSyncCacheState(storageRootDir);
        if (!persisted) continue;
        const store = params.context.openPluginStateKeyedStore(
          openMatrixSyncCacheStoreOptions(storageRootDir),
        );
        if (
          await hasMatrixSyncCacheStateInStore({
            storageRootDir,
            store,
          })
        ) {
          await archiveLegacySyncCache({
            storageRootDir,
            changes,
            warnings,
            notices,
            notice: `Kept existing Matrix sync cache in SQLite and archived the legacy source for ${storageRootDir}`,
          });
          continue;
        }
        await writeMatrixSyncCacheStateToStore({
          storageRootDir,
          payload: persisted,
          store,
        });
        changes.push(`Migrated Matrix sync cache JSON to SQLite for ${storageRootDir}`);
        await archiveLegacySyncCache({
          storageRootDir,
          changes,
          warnings,
        });
      }
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
  {
    id: "matrix-recovery-key-json-to-plugin-state",
    label: "Matrix recovery key",
    async detectLegacyState(params) {
      const previews = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_RECOVERY_KEY_FILENAME,
      )) {
        if (!readLegacyMatrixRecoveryKeyState(storageRootDir)) continue;
        previews.push(`Matrix recovery-key JSON can migrate to SQLite: ${storageRootDir}`);
      }
      return previews.length > 0 ? { preview: previews } : null;
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const notices = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_RECOVERY_KEY_FILENAME,
      )) {
        const payload = readLegacyMatrixRecoveryKeyState(storageRootDir);
        if (!payload) continue;
        const store = params.context.openPluginStateKeyedStore(
          openMatrixRecoveryKeyStoreOptions(storageRootDir),
        );
        if (await hasMatrixRecoveryKeyStateInStore({ store })) {
          await archiveLegacyMatrixStateFile({
            storageRootDir,
            filename: MATRIX_RECOVERY_KEY_FILENAME,
            label: "Matrix recovery key",
            changes,
            warnings,
            notices,
            notice: `Kept existing Matrix recovery key in SQLite and archived the legacy source for ${storageRootDir}`,
          });
          continue;
        }
        await writeMatrixRecoveryKeyStateToStore({
          payload,
          store,
        });
        changes.push(`Migrated Matrix recovery-key JSON to SQLite for ${storageRootDir}`);
        await archiveLegacyMatrixStateFile({
          storageRootDir,
          filename: MATRIX_RECOVERY_KEY_FILENAME,
          label: "Matrix recovery key",
          changes,
          warnings,
        });
      }
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
  {
    id: "matrix-idb-snapshot-json-to-plugin-state",
    label: "Matrix IndexedDB snapshot",
    async detectLegacyState(params) {
      const previews = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_IDB_SNAPSHOT_FILENAME,
      )) {
        if (!(await readLegacyMatrixIdbSnapshotState(storageRootDir))) continue;
        previews.push(`Matrix IndexedDB snapshot JSON can migrate to SQLite: ${storageRootDir}`);
      }
      return previews.length > 0 ? { preview: previews } : null;
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const notices = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_IDB_SNAPSHOT_FILENAME,
      )) {
        const snapshot = await readLegacyMatrixIdbSnapshotState(storageRootDir);
        if (!snapshot) continue;
        const store = params.context.openPluginStateKeyedStore(
          openMatrixIdbSnapshotStoreOptions(storageRootDir),
        );
        if (await hasMatrixIdbSnapshotStateInStore({ store })) {
          await archiveLegacyMatrixStateFile({
            storageRootDir,
            filename: MATRIX_IDB_SNAPSHOT_FILENAME,
            label: "Matrix IndexedDB snapshot",
            changes,
            warnings,
            notices,
            notice: `Kept existing Matrix IndexedDB snapshot in SQLite and archived the legacy source for ${storageRootDir}`,
          });
          continue;
        }
        await writeMatrixIdbSnapshotJsonToStore({
          snapshotJson: JSON.stringify(snapshot),
          databaseCount: snapshot.length,
          store,
        });
        changes.push(`Migrated Matrix IndexedDB snapshot JSON to SQLite for ${storageRootDir}`);
        await archiveLegacyMatrixStateFile({
          storageRootDir,
          filename: MATRIX_IDB_SNAPSHOT_FILENAME,
          label: "Matrix IndexedDB snapshot",
          changes,
          warnings,
        });
      }
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
  {
    id: "matrix-legacy-crypto-migration-json-to-plugin-state",
    label: "Matrix legacy crypto migration",
    async detectLegacyState(params) {
      const previews = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
      )) {
        if (!readLegacyMatrixLegacyCryptoMigrationState(storageRootDir)) continue;
        previews.push(
          `Matrix legacy crypto migration JSON can migrate to SQLite: ${storageRootDir}`,
        );
      }
      return previews.length > 0 ? { preview: previews } : null;
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const notices = [];
      for (const storageRootDir of await collectLegacyMatrixStateRoots(
        params.stateDir,
        MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
      )) {
        const state = readLegacyMatrixLegacyCryptoMigrationState(storageRootDir);
        if (!state) continue;
        const store = params.context.openPluginStateKeyedStore(
          openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir),
        );
        if (await hasMatrixLegacyCryptoMigrationStateInStore({ store })) {
          await archiveLegacyMatrixStateFile({
            storageRootDir,
            filename: MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
            label: "Matrix legacy crypto migration",
            changes,
            warnings,
            notices,
            notice: `Kept existing Matrix legacy crypto migration in SQLite and archived the legacy source for ${storageRootDir}`,
          });
          continue;
        }
        await writeMatrixLegacyCryptoMigrationStateToStore({
          state,
          store,
        });
        changes.push(
          `Migrated Matrix legacy crypto migration JSON to SQLite for ${storageRootDir}`,
        );
        await archiveLegacyMatrixStateFile({
          storageRootDir,
          filename: MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
          label: "Matrix legacy crypto migration",
          changes,
          warnings,
        });
      }
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
