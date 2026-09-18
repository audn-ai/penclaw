import {
  l as MigrationItem,
  m as MigrationProviderContext,
  s as MigrationApplyResult,
} from "./types-Ga3mNO_F.js";

//#region src/plugin-sdk/migration-runtime.d.ts
/** Directories a migration provider writes imported agent data into. */
type PlannedMigrationTargets = {
  workspaceDir: string;
  stateDir: string;
  agentDir: string;
};
/**
 * Resolves default agent workspace/state/agent directories. Prefers the runtime resolver,
 * then configured agentDir (using effective-home resolution), then canonical state layout.
 */
declare function resolvePlannedMigrationTargets(
  ctx: MigrationProviderContext,
): PlannedMigrationTargets;
/** Wrap migration runtime config access with a cached mutable snapshot during apply. */
declare function withCachedMigrationConfigRuntime(
  runtime: MigrationProviderContext["runtime"] | undefined,
  fallbackConfig: MigrationProviderContext["config"],
): MigrationProviderContext["runtime"] | undefined;
/** Archive a migration item source into the report directory and mark the item migrated. */
declare function archiveMigrationItem(
  item: MigrationItem,
  reportDir: string,
): Promise<MigrationItem>;
/** Copy a migration item source to its target, optionally backing up an overwritten target. */
declare function copyMigrationFileItem(
  item: MigrationItem,
  reportDir: string,
  opts?: {
    overwrite?: boolean;
  },
): Promise<MigrationItem>;
/** Copy one regular memory file through an fs-safe workspace root. */
declare function copyMemoryMigrationFileItem(
  item: MigrationItem,
  reportDir: string,
  opts: {
    workspaceDir: string;
    overwrite?: boolean;
  },
): Promise<MigrationItem>;
/** Write redacted JSON and Markdown migration reports into the apply report directory. */
declare function writeMigrationReport(
  result: MigrationApplyResult,
  opts?: {
    title?: string;
  },
): Promise<void>;
//#endregion
export {
  resolvePlannedMigrationTargets as a,
  copyMigrationFileItem as i,
  archiveMigrationItem as n,
  withCachedMigrationConfigRuntime as o,
  copyMemoryMigrationFileItem as r,
  writeMigrationReport as s,
  PlannedMigrationTargets as t,
};
