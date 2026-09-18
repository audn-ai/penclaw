import childProcess from "node:child_process";
import "./src-Bl7G9qvi.js";
import fs from "node:fs";
import "./number-coercion-EqFmHmOw.js";
import path from "node:path";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CJQ8TR--.js";
import { t as isSqliteLockError } from "./sqlite-transaction-DLqNjJHV.js";
//#region src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1e3;
const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 1800 * 1e3;
const INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS = 512;
const LINUX_NFS_SUPER_MAGIC = 26985;
const LINUX_SMB_SUPER_MAGIC = 20859;
const LINUX_CIFS_SUPER_MAGIC = 4283649346;
const LINUX_SMB2_SUPER_MAGIC = 4266872130;
const PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
const NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set(["cifs", "smbfs", "smb2", "smb3"]);
const JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
const JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
function configureSqliteBusyTimeout(db, busyTimeoutMs) {
  const normalizedTimeoutMs = normalizeNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
  db.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs};`);
  return normalizedTimeoutMs;
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
  if (db.prepare("PRAGMA page_count").get()?.page_count === 0)
    db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
}
/**
 * Configure lock retry before inspecting or mutating a fresh database header.
 * Concurrent first opens can otherwise fail before schema transactions begin.
 */
function configureSqlitePreSchemaPragmas(db, options = {}) {
  if (options.busyTimeoutMs !== void 0) configureSqliteBusyTimeout(db, options.busyTimeoutMs);
  enableIncrementalAutoVacuumForFreshDatabase(db);
}
function normalizeNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0)
    throw new Error(`${label} must be a non-negative integer`);
  return value;
}
function findExistingVolumePaths(targetPath) {
  let current = path.resolve(targetPath);
  while (true) {
    let stats;
    try {
      stats = fs.statSync(current);
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return null;
      current = parent;
      continue;
    }
    const existingPath = fs.realpathSync(current);
    return {
      canonicalPath: stats.isDirectory() ? existingPath : path.dirname(existingPath),
      originalPath: stats.isDirectory() ? current : path.dirname(current),
    };
  }
}
function decodeMountPath(value) {
  return value.replace(/\\([0-7]{3})/g, (_match, octal) =>
    String.fromCharCode(Number.parseInt(octal, 8)),
  );
}
function parseProcMountInfoEntries(contents) {
  const entries = [];
  for (const line of contents.split("\n")) {
    const separator = line.indexOf(" - ");
    if (separator === -1) continue;
    const fields = line.slice(0, separator).split(" ");
    const suffixFields = line.slice(separator + 3).split(" ");
    const mountPoint = fields[4];
    const fsType = suffixFields[0];
    if (mountPoint && fsType)
      entries.push({
        mountPoint: decodeMountPath(mountPoint),
        fsType,
        ...(suffixFields[1] ? { source: decodeMountPath(suffixFields[1]) } : {}),
      });
  }
  return entries;
}
function parseMountCommandEntries(contents) {
  const entries = [];
  for (const line of contents.split("\n")) {
    const linuxMatch = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line);
    if (linuxMatch) {
      entries.push({
        source: linuxMatch[1],
        mountPoint: expectDefined(linuxMatch[2], "linux match capture group 2"),
        fsType: expectDefined(linuxMatch[3], "linux match capture group 3"),
      });
      continue;
    }
    const bsdMatch = /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
    if (bsdMatch)
      entries.push({
        source: bsdMatch[1],
        mountPoint: expectDefined(bsdMatch[2], "bsd match capture group 2"),
        fsType: expectDefined(bsdMatch[3], "bsd match capture group 3"),
      });
  }
  return entries;
}
function readMountEntries() {
  try {
    return parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH, "utf8"));
  } catch {}
  try {
    return parseMountCommandEntries(String(childProcess.execFileSync("mount", [])));
  } catch {
    return [];
  }
}
function isPathWithinMount(targetPath, mountPoint) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedMountPoint = path.resolve(mountPoint);
  return (
    resolvedTarget === resolvedMountPoint ||
    resolvedMountPoint === path.parse(resolvedMountPoint).root ||
    resolvedTarget.startsWith(`${resolvedMountPoint}${path.sep}`)
  );
}
function isSshfsMountSource(source) {
  if (!source) return false;
  const normalized = source.toLowerCase();
  return (
    normalized === "sshfs" ||
    normalized.startsWith("sshfs#") ||
    normalized.startsWith("sshfs@") ||
    /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source)
  );
}
function resolveMountTypeJournalPolicy(entry) {
  const normalized = entry.fsType.toLowerCase();
  if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized)) return "rollback";
  if (normalized === "fuse.sshfs") return "unsupported";
  if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source))
    return "unsupported";
  return "wal";
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
  const mountEntry = mountEntries
    .filter((entry) => isPathWithinMount(targetPath, entry.mountPoint))
    .toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
  return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
function combineMountEntryJournalPolicies(targetPaths) {
  const mountEntries = readMountEntries();
  const policies = new Set(
    targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountEntries)),
  );
  if (policies.has("unsupported")) return "unsupported";
  return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
  return (
    /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) ||
    /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath)
  );
}
function isWindowsDrivePath(targetPath) {
  return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
  if (process.platform === "win32") {
    const normalizedTargetPath = path.win32.normalize(targetPath);
    if (isWindowsUncPath(normalizedTargetPath)) return "rollback";
    if (isWindowsDrivePath(normalizedTargetPath))
      try {
        return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(targetPath)))
          ? "rollback"
          : "wal";
      } catch {
        return "rollback";
      }
  }
  const checkedPaths = findExistingVolumePaths(targetPath);
  if (!checkedPaths) return "wal";
  const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
  if (typeof fs.statfsSync !== "function")
    return combineMountEntryJournalPolicies(mountLookupPaths);
  try {
    const filesystemType = fs.statfsSync(checkedPaths.canonicalPath).type;
    if (
      filesystemType === LINUX_NFS_SUPER_MAGIC ||
      filesystemType === LINUX_SMB_SUPER_MAGIC ||
      filesystemType === LINUX_CIFS_SUPER_MAGIC ||
      filesystemType === LINUX_SMB2_SUPER_MAGIC
    )
      return "rollback";
  } catch {
    return combineMountEntryJournalPolicies(mountLookupPaths);
  }
  return combineMountEntryJournalPolicies(mountLookupPaths);
}
function readJournalModeResult(row) {
  if (!row || typeof row !== "object") return null;
  const record = row;
  const value = record.journal_mode ?? Object.values(record)[0];
  return typeof value === "string" ? value.toLowerCase() : null;
}
function readCheckpointBusyResult(row) {
  if (!row || typeof row !== "object") return false;
  const record = row;
  const value = record.busy ?? Object.values(record)[0];
  return value === 1 || value === 1n;
}
function requireRollbackJournalMode(db, options) {
  const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = DELETE;").get());
  if (journalMode !== "delete") {
    const label = options.databaseLabel ?? "sqlite database";
    const location = options.databasePath ? ` at ${options.databasePath}` : "";
    throw new Error(
      `${label}${location} is on a network-backed volume but SQLite kept journal_mode=${journalMode ?? "unknown"}; refusing to continue with WAL on network storage.`,
    );
  }
}
function enableWalJournalMode(db, retryTimeoutMs) {
  const deadline = Date.now() + retryTimeoutMs;
  let restoreBusyTimeout = false;
  try {
    while (true)
      try {
        db.exec("PRAGMA journal_mode = WAL;");
        return;
      } catch (error) {
        const remainingMs = deadline - Date.now();
        if (!isSqliteLockError(error) || remainingMs <= 0) throw error;
        if (!restoreBusyTimeout) {
          configureSqliteBusyTimeout(db, 0);
          restoreBusyTimeout = true;
        }
        Atomics.wait(
          JOURNAL_MODE_RETRY_SLEEP,
          0,
          0,
          Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs),
        );
      }
  } finally {
    if (restoreBusyTimeout) configureSqliteBusyTimeout(db, retryTimeoutMs);
  }
}
function enableMacosCheckpointFullfsync(db) {
  if (process.platform !== "darwin") return;
  try {
    db.exec("PRAGMA checkpoint_fullfsync = 1;");
  } catch {}
}
function refuseUnsupportedFilesystem(options) {
  const label = options.databaseLabel ?? "sqlite database";
  const location = options.databasePath ? ` at ${options.databasePath}` : "";
  throw new Error(
    `${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`,
  );
}
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
function configureSqliteWalMaintenance(db, options = {}) {
  const busyTimeoutMs =
    options.busyTimeoutMs === void 0 ? 0 : configureSqliteBusyTimeout(db, options.busyTimeoutMs);
  const autoCheckpointPages = normalizeNonNegativeInteger(
    options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,
    "autoCheckpointPages",
  );
  const checkpointIntervalMs = normalizeNonNegativeInteger(
    options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS,
    "checkpointIntervalMs",
  );
  const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
  const checkpointMode = options.checkpointMode ?? "TRUNCATE";
  const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
  const journalPolicy = options.databasePath
    ? resolvePathJournalPolicy(options.databasePath)
    : "wal";
  if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
  if (journalPolicy === "rollback") {
    requireRollbackJournalMode(db, options);
    return {
      checkpoint: () => true,
      close: () => true,
    };
  }
  enableWalJournalMode(db, busyTimeoutMs);
  enableMacosCheckpointFullfsync(db);
  db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
  const runCheckpoint = (mode) => {
    try {
      if (readCheckpointBusyResult(db.prepare(`PRAGMA wal_checkpoint(${mode});`).get())) {
        const label = options.databaseLabel ?? "sqlite database";
        const error = /* @__PURE__ */ new Error(`${label} WAL checkpoint ${mode} remained busy`);
        options.onCheckpointError?.(error);
        return false;
      }
      return true;
    } catch (error) {
      options.onCheckpointError?.(error);
      return false;
    }
  };
  const runIncrementalVacuum = () => {
    try {
      db.exec(`PRAGMA incremental_vacuum(${INCREMENTAL_VACUUM_MAX_PAGES_PER_PASS});`);
    } catch (error) {
      options.onCheckpointError?.(error);
    }
  };
  const checkpoint = () => runCheckpoint(checkpointMode);
  let timer = null;
  if (timerIntervalMs > 0) {
    timer = setInterval(() => {
      runCheckpoint(periodicCheckpointMode);
      runIncrementalVacuum();
    }, timerIntervalMs);
    timer.unref?.();
  }
  return {
    checkpoint,
    close: () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return checkpoint();
    },
  };
}
/**
 * Register a best-effort exit-time close for a SQLite handle cache. Returns an
 * unregister callback the cache's orderly close path must invoke, so tests and
 * runtime shutdowns do not accumulate listeners on shared worker processes.
 */
function registerSqliteCacheExitClose(closeAll) {
  const closeOnExit = () => {
    try {
      closeAll();
    } catch {}
  };
  process.once("exit", closeOnExit);
  return () => {
    process.removeListener("exit", closeOnExit);
  };
}
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
function configureSqliteConnectionPragmas(db, options = {}) {
  const { foreignKeys, synchronous, ...walOptions } = options;
  const maintenance = configureSqliteWalMaintenance(db, walOptions);
  if (synchronous) db.exec(`PRAGMA synchronous = ${synchronous};`);
  if (foreignKeys) db.exec("PRAGMA foreign_keys = ON;");
  return maintenance;
}
//#endregion
export {
  registerSqliteCacheExitClose as i,
  configureSqlitePreSchemaPragmas as n,
  configureSqliteWalMaintenance as r,
  configureSqliteConnectionPragmas as t,
};
