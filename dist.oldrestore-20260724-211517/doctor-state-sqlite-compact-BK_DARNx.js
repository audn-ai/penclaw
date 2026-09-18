import fs from "node:fs";
import { t as compactDoctorSqliteFile } from "./doctor-sqlite-compact-DICTPs2h.js";
import { n as withDoctorSqliteMaintenanceLock } from "./doctor-sqlite-maintenance-lock-BQtWhmOs.js";
import {
  a as ensureOpenClawStatePermissions,
  f as resolveOpenClawStateSqlitePath,
  n as assertOpenClawStateDatabaseForMaintenance,
  o as isOpenClawStateDatabaseOpen,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
//#region src/commands/doctor-state-sqlite-compact.ts
/** Explicit doctor maintenance for the canonical shared state SQLite database. */
/** Compact only the canonical shared state database resolved for this invocation. */
async function runDoctorStateSqliteCompact(options = {}, deps = {}) {
  const env = options.env ?? process.env;
  const sqlitePath = resolveOpenClawStateSqlitePath(env);
  const stat = readCanonicalStateDatabaseStat(sqlitePath);
  if (!stat)
    return {
      mode: "compact",
      path: sqlitePath,
      reason: "missing",
      skipped: true,
    };
  if (!stat.isFile())
    throw new Error(`Canonical OpenClaw state database is not a regular file: ${sqlitePath}`);
  return await (deps.withMaintenanceLock ?? withDoctorSqliteMaintenanceLock)({
    env,
    operation: "state SQLite compaction",
    run: () => {
      if (isOpenClawStateDatabaseOpen())
        throw new Error(
          "The shared OpenClaw state database is already open in this process. Stop OpenClaw and retry.",
        );
      return {
        ...compactDoctorSqliteFile({
          afterMutation: () => ensureOpenClawStatePermissions(sqlitePath, env),
          ...(deps.busyTimeoutMs !== void 0 ? { busyTimeoutMs: deps.busyTimeoutMs } : {}),
          sqlitePath,
          validateBeforeMutation: (database) =>
            assertOpenClawStateDatabaseForMaintenance(database, { pathname: sqlitePath }),
        }),
        mode: "compact",
        path: sqlitePath,
        skipped: false,
      };
    },
  });
}
function readCanonicalStateDatabaseStat(sqlitePath) {
  try {
    return fs.lstatSync(sqlitePath);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
}
//#endregion
export { runDoctorStateSqliteCompact };
