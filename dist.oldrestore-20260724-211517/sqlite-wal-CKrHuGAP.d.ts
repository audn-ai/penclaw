import { DatabaseSync } from "node:sqlite";

//#region src/infra/sqlite-wal.d.ts
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
type SqliteWalMaintenance = {
  checkpoint: () => boolean;
  close: () => boolean;
};
/** Options controlling WAL autocheckpoint and periodic checkpoint behavior. */
type SqliteWalMaintenanceOptions = {
  autoCheckpointPages?: number;
  busyTimeoutMs?: number;
  checkpointIntervalMs?: number;
  checkpointMode?: SqliteWalCheckpointMode;
  databaseLabel?: string;
  databasePath?: string;
  onCheckpointError?: (error: unknown) => void;
};
type SqliteConnectionPragmaOptions = SqliteWalMaintenanceOptions & {
  foreignKeys?: boolean;
  synchronous?: "NORMAL";
};
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
declare function configureSqliteConnectionPragmas(
  db: DatabaseSync,
  options?: SqliteConnectionPragmaOptions,
): SqliteWalMaintenance;
//#endregion
export {
  configureSqliteConnectionPragmas as i,
  SqliteWalMaintenance as n,
  SqliteWalMaintenanceOptions as r,
  SqliteConnectionPragmaOptions as t,
};
