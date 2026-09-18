import fs from "node:fs";
import { n as formatBytes } from "./doctor-disk-space-BR6YncQK.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { u as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-VC51jrBW.js";
import { f as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-Bsa8Tv1Z.js";
//#region src/commands/doctor-db-bloat.ts
const BLOAT_MIN_FILE_BYTES = 128 * 1024 * 1024;
const BLOAT_MIN_FREE_BYTES = 32 * 1024 * 1024;
const BLOAT_FREE_RATIO = 0.25;
const LARGE_DB_WARN_BYTES = 1024 * 1024 * 1024;
function readSqliteBloatStats(pathname) {
  let fileBytes;
  try {
    fileBytes = fs.statSync(pathname, { throwIfNoEntry: false })?.size ?? 0;
  } catch {
    return null;
  }
  if (fileBytes <= 0) return null;
  const sqlite = requireNodeSqlite();
  let db;
  try {
    db = new sqlite.DatabaseSync(pathname, { readOnly: true });
    const pageSize = readPragmaNumber(db, "page_size") ?? 4096;
    const freelistCount = readPragmaNumber(db, "freelist_count") ?? 0;
    const autoVacuum = readPragmaNumber(db, "auto_vacuum") ?? 0;
    return {
      fileBytes,
      freeBytes: freelistCount * pageSize,
      incrementalAutoVacuum: autoVacuum === 2,
    };
  } catch {
    return null;
  } finally {
    db?.close();
  }
}
function readPragmaNumber(db, pragma) {
  const value = db.prepare(`PRAGMA ${pragma}`).get()?.[pragma];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function describeBloat(label, stats) {
  const freeRatio = stats.fileBytes > 0 ? stats.freeBytes / stats.fileBytes : 0;
  if (
    stats.fileBytes >= BLOAT_MIN_FILE_BYTES &&
    stats.freeBytes >= BLOAT_MIN_FREE_BYTES &&
    freeRatio >= BLOAT_FREE_RATIO
  ) {
    const remedy = stats.incrementalAutoVacuum
      ? "incremental vacuum will release it gradually"
      : "run `VACUUM` offline (gateway stopped) to reclaim it";
    return `${label}: ${formatBytes(stats.fileBytes)} on disk with ${formatBytes(stats.freeBytes)} reclaimable free pages; ${remedy}.`;
  }
  if (stats.fileBytes >= LARGE_DB_WARN_BYTES)
    return `${label}: ${formatBytes(stats.fileBytes)} on disk; review session/transcript retention settings if growth is unexpected.`;
  return null;
}
function collectSqliteBloatWarnings(deps) {
  const env = deps?.env ?? process.env;
  const warnings = [];
  const stateStats = readSqliteBloatStats(resolveOpenClawStateSqlitePath(env));
  if (stateStats) {
    const warning = describeBloat("state DB", stateStats);
    if (warning) warnings.push(warning);
  }
  for (const registered of listOpenClawRegisteredAgentDatabases({ env })) {
    const stats = readSqliteBloatStats(registered.path);
    if (!stats) continue;
    const warning = describeBloat(`agent DB (${registered.agentId})`, stats);
    if (warning) warnings.push(warning);
  }
  return warnings;
}
function noteSqliteDatabaseBloat(_cfg, deps) {
  const warnings = collectSqliteBloatWarnings(deps);
  if (warnings.length === 0) return;
  note(warnings.join("\n"), "SQLite database size");
}
//#endregion
export { noteSqliteDatabaseBloat };
