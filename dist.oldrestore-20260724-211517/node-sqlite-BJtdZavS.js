import { createRequire } from "node:module";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as isSqliteWalResetSafeVersion } from "./sqlite-runtime-version-Bwtp8f2j.js";
import { t as installProcessWarningFilter } from "./warning-filter-p3Ue6g9S.js";
//#region src/infra/node-sqlite.ts
const require = createRequire(import.meta.url);
let validatedSqliteModule;
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
  if (isSqliteWalResetSafeVersion(version)) return;
  throw new Error(
    `OpenClaw requires SQLite 3.51.3+ (or patched 3.50.7+/3.44.6+) for WAL safety; Node ${nodeVersion} embeds SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. Upgrade to Node 22.22.3+, 24.15.0+, or 25.9.0+ before retrying.`,
  );
}
function assertSafeSqliteRuntime(sqlite) {
  if (validatedSqliteModule === sqlite) return;
  const database = new sqlite.DatabaseSync(":memory:");
  try {
    const row = database.prepare("SELECT sqlite_version() AS version").get();
    assertSqliteWalResetSafeVersion(
      typeof row?.version === "string" ? row.version : "unknown",
      process.versions.node,
    );
    validatedSqliteModule = sqlite;
  } finally {
    database.close();
  }
}
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
  installProcessWarningFilter();
  try {
    const sqlite = require("node:sqlite");
    assertSafeSqliteRuntime(sqlite);
    return sqlite;
  } catch (err) {
    const message = formatErrorMessage(err);
    throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, {
      cause: err,
    });
  }
}
//#endregion
export { requireNodeSqlite as t };
