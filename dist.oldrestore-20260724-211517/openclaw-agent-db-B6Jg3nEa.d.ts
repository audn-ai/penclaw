import { DatabaseSync } from "node:sqlite";
import { t as OpenClawStateDatabaseOptions } from "./openclaw-state-db-DONn495N.js";
import { n as SqliteWalMaintenance } from "./sqlite-wal-CKrHuGAP.js";
import { t as SubsystemLogger } from "./subsystem-BvPn7HK_.js";

//#region src/infra/sqlite-transaction.d.ts
type SqliteTransactionOptions = {
  busyTimeoutMs?: number;
  databaseLabel?: string;
  logger?: Pick<SubsystemLogger, "warn">;
  operationLabel?: string;
  slowTransactionHoldMs?: number;
};
declare function runSqliteImmediateTransactionSync<T>(
  db: DatabaseSync,
  operation: () => T,
  options?: SqliteTransactionOptions,
): T;
//#endregion
//#region src/state/openclaw-agent-db.paths.d.ts
/**
 * Path helpers for per-agent SQLite state.
 *
 * Agent databases live beside the shared state database root so each agent can
 * own private runtime tables while the shared registry can still discover them.
 */
/** Inputs for resolving one agent SQLite path or directory. */
type OpenClawAgentSqlitePathOptions = {
  agentId: string;
  env?: NodeJS.ProcessEnv;
  path?: string;
};
/** Resolve the SQLite file for one normalized agent id. */
declare function resolveOpenClawAgentSqlitePath(options: OpenClawAgentSqlitePathOptions): string;
//#endregion
//#region src/state/openclaw-agent-db.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving and opening one agent database. */
type OpenClawAgentDatabaseOptions = OpenClawStateDatabaseOptions & {
  agentId: string;
};
/** Initialize agent schema/ownership metadata on an independently managed connection. */
declare function ensureOpenClawAgentDatabaseSchema(
  db: DatabaseSync,
  options: OpenClawAgentDatabaseOptions & {
    register?: boolean;
  },
): void;
/** Close and unregister one transient agent database by exact cached pathname. */
declare function disposeOpenClawAgentDatabaseByPath(
  pathname: string,
  options?: {
    env?: NodeJS.ProcessEnv;
  },
): boolean;
//#endregion
export {
  runSqliteImmediateTransactionSync as a,
  resolveOpenClawAgentSqlitePath as i,
  disposeOpenClawAgentDatabaseByPath as n,
  ensureOpenClawAgentDatabaseSchema as r,
  OpenClawAgentDatabase as t,
};
