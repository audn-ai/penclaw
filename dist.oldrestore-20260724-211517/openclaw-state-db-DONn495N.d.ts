import { DatabaseSync } from "node:sqlite";

//#region src/state/openclaw-state-db.d.ts
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
};
type OpenClawStateDatabaseSchemaMigration =
  | {
      kind: "agent-databases-composite-primary-key";
      path: string;
    }
  | {
      kind: "audit-events-v2";
      path: string;
    };
declare function detectOpenClawStateDatabaseSchemaMigrations(
  options?: OpenClawStateDatabaseOptions,
): OpenClawStateDatabaseSchemaMigration[];
declare function repairOpenClawStateDatabaseSchema(options?: OpenClawStateDatabaseOptions): {
  changes: string[];
  warnings: string[];
};
//#endregion
export {
  repairOpenClawStateDatabaseSchema as i,
  OpenClawStateDatabaseSchemaMigration as n,
  detectOpenClawStateDatabaseSchemaMigrations as r,
  OpenClawStateDatabaseOptions as t,
};
