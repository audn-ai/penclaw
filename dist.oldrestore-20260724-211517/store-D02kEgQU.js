import fs from "node:fs";
import path from "node:path";
import { t as expandHomePrefix } from "./home-dir-DxrrpDft.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import {
  f as resolveOpenClawStateSqlitePath,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as replaceFileAtomic } from "./replace-file-CaPU6XwS.js";
import {
  a as replaceCronRows,
  n as loadCronRows,
  o as updateCronRuntimeRows,
  r as loadedCronStoreFromRows,
  t as assertCronStoreCanPersist,
  u as cronStoreKey,
} from "./row-codec-CaYtaRTs.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/cron/store.ts
/** Public cron store load/save API backed by SQLite plus quarantine sidecars. */
function resolveDefaultCronDir(env) {
  return path.join(resolveConfigDir(env), "cron");
}
function resolveDefaultCronStorePath(env) {
  return path.join(resolveDefaultCronDir(env), "jobs.json");
}
/** Resolves the sidecar quarantine path used for invalid cron config rows. */
function resolveCronQuarantinePath(storePath) {
  if (storePath.endsWith(".json")) return storePath.replace(/\.json$/, "-quarantine.json");
  return `${storePath}-quarantine.json`;
}
/** Resolves the cron jobs store path, expanding home-relative user input. */
function resolveCronJobsStorePath(storePath, env = process.env) {
  if (storePath?.trim()) {
    const raw = storePath.trim();
    if (raw.startsWith("~")) return path.resolve(expandHomePrefix(raw, { env }));
    return path.resolve(raw);
  }
  return resolveDefaultCronStorePath(env);
}
/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
async function loadCronJobsStoreWithConfigJobs(storePath) {
  const storeKey = cronStoreKey(path.resolve(storePath));
  const database = openOpenClawStateDatabase().db;
  const rows = loadCronRows(database, storeKey);
  if (rows.length > 0) return loadedCronStoreFromRows(rows);
  return {
    store: {
      version: 1,
      jobs: [],
    },
    configJobs: [],
    configJobIndexes: [],
    configJobRuntimeEntries: [],
    invalidConfigRows: [],
  };
}
function emptyLoadedCronStore() {
  return {
    store: {
      version: 1,
      jobs: [],
    },
    configJobs: [],
    configJobIndexes: [],
    configJobRuntimeEntries: [],
    invalidConfigRows: [],
  };
}
function tableExists(db, tableName) {
  return (
    db
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(tableName) !== void 0
  );
}
/** Loads cron jobs from an existing SQLite store without creating or migrating state. */
async function loadCronJobsStoreWithConfigJobsReadOnly(storePath) {
  const statePath = resolveOpenClawStateSqlitePath(process.env);
  if (!fs.existsSync(statePath)) return emptyLoadedCronStore();
  const storeKey = cronStoreKey(path.resolve(storePath));
  const db = new (requireNodeSqlite().DatabaseSync)(statePath, { readOnly: true });
  try {
    if (!tableExists(db, "cron_jobs")) return emptyLoadedCronStore();
    const rows = loadCronRows(db, storeKey);
    if (rows.length > 0) return loadedCronStoreFromRows(rows);
    return emptyLoadedCronStore();
  } finally {
    db.close();
  }
}
/** Loads only the persisted cron job store payload. */
async function loadCronJobsStore(storePath) {
  return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}
/** Synchronously loads only the persisted cron job store payload. */
function loadCronJobsStoreSync(storePath) {
  const storeKey = cronStoreKey(path.resolve(storePath));
  const database = openOpenClawStateDatabase().db;
  const rows = loadCronRows(database, storeKey);
  if (rows.length > 0) return loadedCronStoreFromRows(rows).store;
  return {
    version: 1,
    jobs: [],
  };
}
async function atomicWrite(filePath, content, dirMode = 448) {
  await replaceFileAtomic({
    filePath,
    content,
    dirMode,
    mode: 384,
    tempPrefix: ".openclaw-cron",
    renameMaxRetries: 3,
    copyFallbackOnPermissionError: true,
  });
}
/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
async function saveCronJobsStore(storePath, store, opts) {
  const storeKey = cronStoreKey(path.resolve(storePath));
  if (opts?.stateOnly) {
    runOpenClawStateWriteTransaction(({ db }) => {
      updateCronRuntimeRows(db, storeKey, store);
    });
    return;
  }
  assertCronStoreCanPersist(store);
  runOpenClawStateWriteTransaction(({ db }) => {
    replaceCronRows(db, storeKey, store);
  });
}
/** Atomically acquire doctor migration metadata and replace cron rows only for the winner. */
async function saveCronJobsStoreWithMetadata(storePath, store, acquireMetadata) {
  const storeKey = cronStoreKey(path.resolve(storePath));
  assertCronStoreCanPersist(store);
  return runOpenClawStateWriteTransaction(({ db }) => {
    if (!acquireMetadata(db)) return false;
    replaceCronRows(db, storeKey, store);
    return true;
  });
}
/** Resolves the public plugin-SDK cron store path. */
function resolveCronStorePath(storePath) {
  return resolveCronJobsStorePath(storePath);
}
/** Plugin-SDK alias for loading the cron store. */
async function loadCronStore(storePath) {
  return await loadCronJobsStore(storePath);
}
/** Plugin-SDK alias for saving the cron store. */
async function saveCronStore(storePath, store, opts) {
  await saveCronJobsStore(storePath, store, opts);
}
/** Loads the cron quarantine sidecar, validating its persisted v1 shape. */
async function loadCronQuarantineFile(pathLocal) {
  try {
    const parsed = parseJsonWithJson5Fallback(await fs.promises.readFile(pathLocal, "utf-8"));
    if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.jobs))
      throw new Error(`Unsupported cron quarantine file shape at ${pathLocal}`);
    return {
      version: 1,
      jobs: parsed.jobs.map((entry, index) => {
        if (
          !isRecord(entry) ||
          typeof entry.reason !== "string" ||
          (!isRecord(entry.job) && !("raw" in entry))
        )
          throw new Error(`Unsupported cron quarantine entry at ${pathLocal} index ${index}`);
        const sourceIndex = typeof entry.sourceIndex === "number" ? entry.sourceIndex : -1;
        const quarantined = {
          quarantinedAtMs:
            typeof entry.quarantinedAtMs === "number" && Number.isFinite(entry.quarantinedAtMs)
              ? entry.quarantinedAtMs
              : Date.now(),
          sourceIndex,
          reason: entry.reason,
        };
        if (isRecord(entry.job)) quarantined.job = entry.job;
        if ("raw" in entry) quarantined.raw = entry.raw;
        if (isRecord(entry.state)) quarantined.state = entry.state;
        if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs))
          quarantined.updatedAtMs = entry.updatedAtMs;
        if (typeof entry.scheduleIdentity === "string")
          quarantined.scheduleIdentity = entry.scheduleIdentity;
        return quarantined;
      }),
    };
  } catch (err) {
    if (err?.code === "ENOENT")
      return {
        version: 1,
        jobs: [],
      };
    throw err;
  }
}
function quarantineEntryKey(entry) {
  const rawId = entry.job
    ? (normalizeOptionalString(entry.job.id) ?? normalizeOptionalString(entry.job.jobId))
    : null;
  return JSON.stringify({
    id: rawId ?? null,
    sourceIndex: entry.sourceIndex,
    reason: entry.reason,
    job: entry.job ?? null,
    raw: entry.raw ?? null,
    state: entry.state ?? null,
    updatedAtMs: entry.updatedAtMs ?? null,
    scheduleIdentity: entry.scheduleIdentity ?? null,
  });
}
/** Appends new invalid cron config rows to the quarantine sidecar without duplicating entries. */
async function saveCronQuarantineFile(params) {
  if (params.entries.length === 0) return null;
  const quarantinePath = resolveCronQuarantinePath(params.storePath);
  const existing = await loadCronQuarantineFile(quarantinePath);
  const seen = new Set(existing.jobs.map(quarantineEntryKey));
  const nextJobs = existing.jobs.slice();
  let appended = false;
  for (const entry of params.entries.toSorted((a, b) => a.sourceIndex - b.sourceIndex)) {
    const key = quarantineEntryKey(entry);
    if (seen.has(key)) continue;
    seen.add(key);
    appended = true;
    nextJobs.push({
      quarantinedAtMs: params.nowMs,
      sourceIndex: entry.sourceIndex,
      reason: entry.reason,
      ...(entry.job ? { job: structuredClone(entry.job) } : {}),
      ...("raw" in entry ? { raw: structuredClone(entry.raw) } : {}),
      ...(entry.state ? { state: structuredClone(entry.state) } : {}),
      ...(entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {}),
      ...(entry.scheduleIdentity !== void 0 ? { scheduleIdentity: entry.scheduleIdentity } : {}),
    });
  }
  if (!appended) return quarantinePath;
  await atomicWrite(
    quarantinePath,
    JSON.stringify(
      {
        version: 1,
        jobs: nextJobs,
      },
      null,
      2,
    ),
  );
  return quarantinePath;
}
//#endregion
export {
  loadCronQuarantineFile as a,
  resolveCronQuarantinePath as c,
  saveCronJobsStoreWithMetadata as d,
  saveCronQuarantineFile as f,
  loadCronJobsStoreWithConfigJobsReadOnly as i,
  resolveCronStorePath as l,
  loadCronJobsStoreSync as n,
  loadCronStore as o,
  saveCronStore as p,
  loadCronJobsStoreWithConfigJobs as r,
  resolveCronJobsStorePath as s,
  loadCronJobsStore as t,
  saveCronJobsStore as u,
};
