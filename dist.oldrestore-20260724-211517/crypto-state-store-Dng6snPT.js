import { createHash, randomUUID } from "node:crypto";
import "./record-shared-DVKMvPXD.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as getMatrixRuntime } from "./runtime-C3viBnoh.js";
//#region extensions/matrix/src/matrix/sqlite-state.ts
function resolveStateDirOverride(options) {
  if (!options) return;
  if (options.stateDir) return options.stateDir;
  if (options.stateRootDir) return options.stateRootDir;
  return getMatrixRuntime().state.resolveStateDir(options.env ?? process.env, os.homedir);
}
function resolveMatrixSqliteStateKey(options) {
  return resolveStateDirOverride(options) ?? "";
}
function resolveMatrixSqliteStateEnv(options) {
  const stateDir = resolveStateDirOverride(options);
  if (!stateDir) return options?.env;
  return {
    ...(options?.env ?? process.env),
    OPENCLAW_STATE_DIR: stateDir,
  };
}
//#endregion
//#region extensions/matrix/src/matrix/crypto-state-store.ts
const STATE_KEY = "current";
const RECOVERY_KEY_NAMESPACE = "recovery-key";
const LEGACY_CRYPTO_MIGRATION_NAMESPACE = "legacy-crypto-migration";
const IDB_SNAPSHOT_NAMESPACE = "idb-snapshot";
const SMALL_STATE_MAX_ENTRIES = 10;
const IDB_SNAPSHOT_MAX_ENTRIES = 2e4;
const IDB_SNAPSHOT_MAX_CHUNKS = Math.floor((IDB_SNAPSHOT_MAX_ENTRIES - 1) / 2);
const IDB_SNAPSHOT_CHUNK_BYTES = 24e3;
const MATRIX_RECOVERY_KEY_FILENAME = "recovery-key.json";
const MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME = "legacy-crypto-migration.json";
const MATRIX_IDB_SNAPSHOT_FILENAME = "crypto-idb-snapshot.json";
function openMatrixRecoveryKeyStoreOptions(storageRootDir) {
  return {
    namespace: RECOVERY_KEY_NAMESPACE,
    maxEntries: SMALL_STATE_MAX_ENTRIES,
    env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir }),
  };
}
function openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir) {
  return {
    namespace: LEGACY_CRYPTO_MIGRATION_NAMESPACE,
    maxEntries: SMALL_STATE_MAX_ENTRIES,
    env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir }),
  };
}
function openMatrixIdbSnapshotStoreOptions(storageRootDir) {
  return {
    namespace: IDB_SNAPSHOT_NAMESPACE,
    maxEntries: IDB_SNAPSHOT_MAX_ENTRIES,
    env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir }),
  };
}
function readMatrixRecoveryKeyState(storageRootDir) {
  return readMatrixRecoveryKeyStateWithKey({
    storageRootDir,
    stateKey: STATE_KEY,
  });
}
function readMatrixRecoveryKeyStateForPath(recoveryKeyPath) {
  return readMatrixRecoveryKeyStateWithKey({
    storageRootDir: path.dirname(recoveryKeyPath),
    stateKey: resolveRecoveryKeyStateKeyForPath(recoveryKeyPath),
  });
}
function readMatrixRecoveryKeyStateWithKey(params) {
  return normalizeMatrixStoredRecoveryKey(
    openSyncStore(openMatrixRecoveryKeyStoreOptions(params.storageRootDir)).lookup(params.stateKey),
  );
}
function writeMatrixRecoveryKeyStateForPath(params) {
  writeMatrixRecoveryKeyStateWithKey({
    storageRootDir: path.dirname(params.recoveryKeyPath),
    stateKey: resolveRecoveryKeyStateKeyForPath(params.recoveryKeyPath),
    payload: params.payload,
  });
}
function writeMatrixRecoveryKeyStateWithKey(params) {
  const payload = normalizeMatrixStoredRecoveryKey(params.payload);
  if (!payload) throw new Error("Invalid Matrix recovery key state");
  openSyncStore(openMatrixRecoveryKeyStoreOptions(params.storageRootDir)).register(
    params.stateKey,
    payload,
  );
}
async function hasMatrixRecoveryKeyStateInStore(params) {
  return normalizeMatrixStoredRecoveryKey(await params.store.lookup(STATE_KEY)) !== null;
}
async function writeMatrixRecoveryKeyStateToStore(params) {
  const payload = normalizeMatrixStoredRecoveryKey(params.payload);
  if (!payload) throw new Error("Invalid Matrix recovery key state");
  await params.store.register(STATE_KEY, payload);
}
function readMatrixLegacyCryptoMigrationState(storageRootDir) {
  return normalizeMatrixLegacyCryptoMigrationState(
    openSyncStore(openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir)).lookup(STATE_KEY),
  );
}
function writeMatrixLegacyCryptoMigrationState(params) {
  const state = normalizeMatrixLegacyCryptoMigrationState(params.state);
  if (!state) throw new Error("Invalid Matrix legacy crypto migration state");
  openSyncStore(openMatrixLegacyCryptoMigrationStoreOptions(params.storageRootDir)).register(
    STATE_KEY,
    state,
  );
}
async function hasMatrixLegacyCryptoMigrationStateInStore(params) {
  return normalizeMatrixLegacyCryptoMigrationState(await params.store.lookup(STATE_KEY)) !== null;
}
async function writeMatrixLegacyCryptoMigrationStateToStore(params) {
  const state = normalizeMatrixLegacyCryptoMigrationState(params.state);
  if (!state) throw new Error("Invalid Matrix legacy crypto migration state");
  await params.store.register(STATE_KEY, state);
}
function readMatrixIdbSnapshotJson(storageRootDir) {
  return readIdbSnapshotJsonFromStore(
    openSyncStore(openMatrixIdbSnapshotStoreOptions(storageRootDir)),
  );
}
function hasMatrixIdbSnapshotState(storageRootDir) {
  return isIdbSnapshotMeta(
    openSyncStore(openMatrixIdbSnapshotStoreOptions(storageRootDir)).lookup(idbMetaKey()),
  );
}
function writeMatrixIdbSnapshotJson(params) {
  writeIdbSnapshotJsonToStore({
    snapshotJson: params.snapshotJson,
    databaseCount: params.databaseCount,
    store: openSyncStore(openMatrixIdbSnapshotStoreOptions(params.storageRootDir)),
  });
}
async function hasMatrixIdbSnapshotStateInStore(params) {
  return (await readIdbSnapshotJsonFromAsyncStore(params.store)) !== null;
}
async function writeMatrixIdbSnapshotJsonToStore(params) {
  const rows = buildIdbSnapshotRows(params.snapshotJson, params.databaseCount);
  for (const row of rows.chunks) await params.store.register(row.key, row.value);
  await params.store.register(rows.meta.key, rows.meta.value);
  for (const row of await params.store.entries())
    if (row.key.startsWith(idbChunkKeyPrefix()) && !rows.nextChunkKeys.has(row.key))
      await params.store.delete(row.key);
}
function migrateLegacyMatrixRecoveryKeyFileToStore(storageRootDir) {
  return migrateLegacyMatrixRecoveryKeyFilePathToStore(
    path.join(storageRootDir, MATRIX_RECOVERY_KEY_FILENAME),
  );
}
function migrateLegacyMatrixRecoveryKeyFilePathToStore(recoveryKeyPath) {
  const existing = readMatrixRecoveryKeyStateForPath(recoveryKeyPath);
  const legacy = readLegacyMatrixRecoveryKeyFile(recoveryKeyPath);
  if (!existing && legacy)
    writeMatrixRecoveryKeyStateForPath({
      recoveryKeyPath,
      payload: legacy,
    });
  return archiveLegacyStateFileIfPossible(recoveryKeyPath);
}
function migrateLegacyMatrixLegacyCryptoMigrationFileToStore(storageRootDir) {
  const existing = readMatrixLegacyCryptoMigrationState(storageRootDir);
  const legacy = readLegacyMatrixLegacyCryptoMigrationState(storageRootDir);
  if (!existing && legacy)
    writeMatrixLegacyCryptoMigrationState({
      storageRootDir,
      state: legacy,
    });
  return archiveLegacyStateFileIfPossible(
    path.join(storageRootDir, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME),
  );
}
function readLegacyMatrixRecoveryKeyState(storageRootDir) {
  return readLegacyMatrixRecoveryKeyFile(path.join(storageRootDir, MATRIX_RECOVERY_KEY_FILENAME));
}
function readLegacyMatrixRecoveryKeyFile(filePath) {
  return readJsonFileSync(filePath, normalizeMatrixStoredRecoveryKey);
}
function readLegacyMatrixLegacyCryptoMigrationState(storageRootDir) {
  return readJsonFileSync(
    path.join(storageRootDir, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME),
    normalizeMatrixLegacyCryptoMigrationState,
  );
}
function scoreMatrixCryptoStateInStore(storageRootDir) {
  if (!matrixCryptoStateDatabaseExists(storageRootDir)) return 0;
  let score = 0;
  try {
    if (readMatrixLegacyCryptoMigrationState(storageRootDir)) score += 3;
  } catch {}
  try {
    if (readMatrixRecoveryKeyState(storageRootDir)) score += 2;
  } catch {}
  try {
    if (hasMatrixIdbSnapshotState(storageRootDir)) score += 2;
  } catch {}
  return score;
}
function matrixCryptoStateDatabaseExists(storageRootDir) {
  return fs.existsSync(path.join(storageRootDir, "state", "openclaw.sqlite"));
}
function resolveRecoveryKeyStateKeyForPath(recoveryKeyPath) {
  const basename = path.basename(recoveryKeyPath);
  if (basename === "recovery-key.json") return STATE_KEY;
  return `file:${createHash("sha256").update(basename, "utf8").digest("hex").slice(0, 32)}`;
}
function normalizeMatrixStoredRecoveryKey(value) {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.createdAt !== "string" ||
    typeof value.privateKeyBase64 !== "string" ||
    !value.privateKeyBase64.trim()
  )
    return null;
  return {
    version: 1,
    createdAt: value.createdAt,
    keyId: typeof value.keyId === "string" ? value.keyId : null,
    ...(typeof value.encodedPrivateKey === "string"
      ? { encodedPrivateKey: value.encodedPrivateKey }
      : {}),
    privateKeyBase64: value.privateKeyBase64,
    ...(isRecord(value.keyInfo)
      ? {
          keyInfo: {
            ...(value.keyInfo.passphrase !== void 0
              ? { passphrase: value.keyInfo.passphrase }
              : {}),
            ...(typeof value.keyInfo.name === "string" ? { name: value.keyInfo.name } : {}),
          },
        }
      : {}),
  };
}
function normalizeMatrixLegacyCryptoMigrationState(value) {
  if (!isRecord(value) || value.version !== 1 || typeof value.accountId !== "string") return null;
  if (
    value.restoreStatus !== "pending" &&
    value.restoreStatus !== "completed" &&
    value.restoreStatus !== "manual-action-required"
  )
    return null;
  const roomKeyCounts =
    isRecord(value.roomKeyCounts) &&
    typeof value.roomKeyCounts.total === "number" &&
    typeof value.roomKeyCounts.backedUp === "number"
      ? {
          total: value.roomKeyCounts.total,
          backedUp: value.roomKeyCounts.backedUp,
        }
      : null;
  return {
    version: 1,
    ...(value.source === "matrix-bot-sdk-rust" ? { source: value.source } : {}),
    accountId: value.accountId,
    ...(typeof value.deviceId === "string" || value.deviceId === null
      ? { deviceId: value.deviceId }
      : {}),
    roomKeyCounts,
    ...(typeof value.backupVersion === "string" || value.backupVersion === null
      ? { backupVersion: value.backupVersion }
      : {}),
    ...(typeof value.decryptionKeyImported === "boolean"
      ? { decryptionKeyImported: value.decryptionKeyImported }
      : {}),
    restoreStatus: value.restoreStatus,
    ...(typeof value.detectedAt === "string" ? { detectedAt: value.detectedAt } : {}),
    ...(typeof value.restoredAt === "string" ? { restoredAt: value.restoredAt } : {}),
    ...(typeof value.importedCount === "number" ? { importedCount: value.importedCount } : {}),
    ...(typeof value.totalCount === "number" ? { totalCount: value.totalCount } : {}),
    ...(typeof value.lastError === "string" || value.lastError === null
      ? { lastError: value.lastError }
      : {}),
  };
}
function openSyncStore(options) {
  return getMatrixRuntime().state.openSyncKeyedStore(options);
}
function readJsonFileSync(filePath, normalize) {
  try {
    return normalize(JSON.parse(fs.readFileSync(filePath, "utf8")));
  } catch {
    return null;
  }
}
function archiveLegacyStateFileIfPossible(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const archivedPath = `${filePath}.migrated`;
  if (fs.existsSync(archivedPath)) return false;
  fs.renameSync(filePath, archivedPath);
  return true;
}
function readIdbSnapshotJsonFromStore(store) {
  const meta = store.lookup(idbMetaKey());
  if (!isIdbSnapshotMeta(meta)) return null;
  const chunks = readIdbSnapshotChunks(meta, (key) => store.lookup(key));
  return chunks ? chunks.join("") : null;
}
async function readIdbSnapshotJsonFromAsyncStore(store) {
  const meta = await store.lookup(idbMetaKey());
  if (!isIdbSnapshotMeta(meta)) return null;
  const chunks = await readIdbSnapshotChunksAsync(meta, (key) => store.lookup(key));
  return chunks ? chunks.join("") : null;
}
function readIdbSnapshotChunks(meta, lookup) {
  const chunks = [];
  for (let index = 0; index < meta.chunkCount; index += 1) {
    const chunk = lookup(idbChunkKey(meta.generation, index));
    if (!isIdbSnapshotChunk(chunk) || chunk.index !== index) return null;
    chunks.push(chunk.data);
  }
  const snapshotJson = chunks.join("");
  if (meta.digest !== digestText(snapshotJson)) return null;
  return chunks;
}
async function readIdbSnapshotChunksAsync(meta, lookup) {
  const chunks = [];
  for (let index = 0; index < meta.chunkCount; index += 1) {
    const chunk = await lookup(idbChunkKey(meta.generation, index));
    if (!isIdbSnapshotChunk(chunk) || chunk.index !== index) return null;
    chunks.push(chunk.data);
  }
  const snapshotJson = chunks.join("");
  if (meta.digest !== digestText(snapshotJson)) return null;
  return chunks;
}
function writeIdbSnapshotJsonToStore(params) {
  const rows = buildIdbSnapshotRows(params.snapshotJson, params.databaseCount);
  for (const row of rows.chunks) params.store.register(row.key, row.value);
  params.store.register(rows.meta.key, rows.meta.value);
  for (const row of params.store.entries())
    if (row.key.startsWith(idbChunkKeyPrefix()) && !rows.nextChunkKeys.has(row.key))
      params.store.delete(row.key);
}
function buildIdbSnapshotRows(snapshotJson, databaseCount) {
  const generation = randomUUID().replaceAll("-", "");
  const chunks = chunkText(snapshotJson).map((data, index) => ({
    key: idbChunkKey(generation, index),
    value: {
      kind: "snapshot-chunk",
      index,
      data,
    },
  }));
  return {
    chunks,
    nextChunkKeys: new Set(chunks.map((chunk) => chunk.key)),
    meta: {
      key: idbMetaKey(),
      value: {
        kind: "meta",
        version: 1,
        generation,
        chunkCount: chunks.length,
        digest: digestText(snapshotJson),
        databaseCount,
        persistedAt: /* @__PURE__ */ new Date().toISOString(),
      },
    },
  };
}
function idbMetaKey() {
  return `${STATE_KEY}:meta`;
}
function idbChunkKeyPrefix() {
  return `${STATE_KEY}:snapshot:`;
}
function idbChunkKey(generation, index) {
  return `${idbChunkKeyPrefix()}${generation}:${index}`;
}
function chunkText(value) {
  const chunks = [];
  let current = "";
  let currentBytes = 0;
  for (const char of value) {
    const charBytes = Buffer.byteLength(char, "utf8");
    if (current && currentBytes + charBytes > IDB_SNAPSHOT_CHUNK_BYTES) {
      pushChunk(chunks, current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += charBytes;
  }
  if (current) pushChunk(chunks, current);
  return chunks;
}
function pushChunk(chunks, chunk) {
  if (chunks.length >= IDB_SNAPSHOT_MAX_CHUNKS)
    throw new Error("Matrix IndexedDB snapshot exceeds SQLite chunk limit");
  chunks.push(chunk);
}
function digestText(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
function isIdbSnapshotMeta(value) {
  return (
    isRecord(value) &&
    value.kind === "meta" &&
    value.version === 1 &&
    typeof value.generation === "string" &&
    value.generation.trim() !== "" &&
    typeof value.chunkCount === "number" &&
    Number.isSafeInteger(value.chunkCount) &&
    value.chunkCount >= 0 &&
    value.chunkCount <= IDB_SNAPSHOT_MAX_CHUNKS &&
    typeof value.digest === "string" &&
    typeof value.databaseCount === "number" &&
    Number.isSafeInteger(value.databaseCount) &&
    value.databaseCount >= 0 &&
    typeof value.persistedAt === "string"
  );
}
function isIdbSnapshotChunk(value) {
  return (
    isRecord(value) &&
    value.kind === "snapshot-chunk" &&
    typeof value.index === "number" &&
    Number.isSafeInteger(value.index) &&
    value.index >= 0 &&
    typeof value.data === "string"
  );
}
//#endregion
export {
  writeMatrixRecoveryKeyStateToStore as C,
  writeMatrixRecoveryKeyStateForPath as S,
  resolveMatrixSqliteStateKey as T,
  readMatrixRecoveryKeyStateForPath as _,
  hasMatrixLegacyCryptoMigrationStateInStore as a,
  writeMatrixIdbSnapshotJsonToStore as b,
  migrateLegacyMatrixRecoveryKeyFilePathToStore as c,
  openMatrixLegacyCryptoMigrationStoreOptions as d,
  openMatrixRecoveryKeyStoreOptions as f,
  readMatrixIdbSnapshotJson as g,
  readLegacyMatrixRecoveryKeyState as h,
  hasMatrixIdbSnapshotStateInStore as i,
  migrateLegacyMatrixRecoveryKeyFileToStore as l,
  readLegacyMatrixRecoveryKeyFile as m,
  MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME as n,
  hasMatrixRecoveryKeyStateInStore as o,
  readLegacyMatrixLegacyCryptoMigrationState as p,
  MATRIX_RECOVERY_KEY_FILENAME as r,
  migrateLegacyMatrixLegacyCryptoMigrationFileToStore as s,
  MATRIX_IDB_SNAPSHOT_FILENAME as t,
  openMatrixIdbSnapshotStoreOptions as u,
  scoreMatrixCryptoStateInStore as v,
  resolveMatrixSqliteStateEnv as w,
  writeMatrixLegacyCryptoMigrationStateToStore as x,
  writeMatrixIdbSnapshotJson as y,
};
