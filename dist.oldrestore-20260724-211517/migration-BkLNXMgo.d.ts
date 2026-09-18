import {
  _ as MigrationSummary,
  l as MigrationItem,
  m as MigrationProviderContext,
  p as MigrationPlan,
} from "./types-Ga3mNO_F.js";

//#region src/plugin-sdk/migration.d.ts
/** Shared migration failure reason when an item lacks required paths. */
declare const MIGRATION_REASON_MISSING_SOURCE_OR_TARGET = "missing source or target";
/** Shared migration conflict reason when a target already exists. */
declare const MIGRATION_REASON_TARGET_EXISTS = "target exists";
/** Creates a migration item, defaulting new provider output to the planned state. */
declare function createMigrationItem(
  params: Omit<MigrationItem, "status"> & {
    status?: MigrationItem["status"];
  },
): MigrationItem;
/** Marks a planned item as blocked by an existing target value. */
declare function markMigrationItemConflict(item: MigrationItem, reason: string): MigrationItem;
/** Marks an item as failed during detection or apply. */
declare function markMigrationItemError(item: MigrationItem, reason: string): MigrationItem;
/** Marks an item as intentionally skipped, usually for manual follow-up. */
declare function markMigrationItemSkipped(item: MigrationItem, reason: string): MigrationItem;
/** Counts migration item statuses for provider plans, apply results, and CLI reports. */
declare function summarizeMigrationItems(items: readonly MigrationItem[]): MigrationSummary;
/** Structured config patch details stored on migration items. */
type MigrationConfigPatchDetails = {
  /** Config object path where the patch should be merged. */ path: string[] /** Patch value stored on the migration item. */;
  value: unknown;
};
/** Reads a nested config value, returning undefined when a parent is not an object. */
declare function readMigrationConfigPath(
  root: Record<string, unknown>,
  path: readonly string[],
): unknown;
/** Deep-merges object patches and replaces scalar/array values with a cloned target value. */
declare function mergeMigrationConfigValue(left: unknown, right: unknown): unknown;
/** Writes a config patch path in-place, creating missing object parents as needed. */
declare function writeMigrationConfigPath(
  root: Record<string, unknown>,
  path: readonly string[],
  value: unknown,
): void;
/** Checks whether a config patch would overwrite existing leaf keys without `--overwrite`. */
declare function hasMigrationConfigPatchConflict(
  config: MigrationProviderContext["config"],
  path: readonly string[],
  value: unknown,
): boolean;
/** Builds a planned or conflicting config-merge migration item. */
declare function createMigrationConfigPatchItem(params: {
  id: string;
  target: string;
  path: string[];
  value: unknown;
  message: string;
  conflict?: boolean;
  reason?: string;
  source?: string;
  sensitive?: boolean;
  details?: Record<string, unknown>;
}): MigrationItem;
/** Builds a skipped item that records user-facing manual migration guidance. */
declare function createMigrationManualItem(params: {
  id: string;
  source: string;
  message: string;
  recommendation: string;
}): MigrationItem;
/** Reads config patch metadata from an item produced by `createMigrationConfigPatchItem`. */
declare function readMigrationConfigPatchDetails(
  item: MigrationItem,
): MigrationConfigPatchDetails | undefined;
/** Applies one planned config patch through the runtime config writer and returns its final status. */
declare function applyMigrationConfigPatchItem(
  ctx: MigrationProviderContext,
  item: MigrationItem,
): Promise<MigrationItem>;
/** Manual items never mutate state; applying one preserves the skipped/manual status. */
declare function applyMigrationManualItem(item: MigrationItem): MigrationItem;
/** Redacts likely secret values while preserving SecretRef-like objects for operator context. */
declare function redactMigrationValue(value: unknown): unknown;
/** Redacts sensitive fields from one migration item before report/output serialization. */
declare function redactMigrationItem(item: MigrationItem): MigrationItem;
/** Redacts sensitive fields from a full migration plan before report/output serialization. */
declare function redactMigrationPlan<T extends MigrationPlan>(plan: T): T;
//#endregion
export {
  redactMigrationPlan as _,
  applyMigrationManualItem as a,
  writeMigrationConfigPath as b,
  createMigrationManualItem as c,
  markMigrationItemError as d,
  markMigrationItemSkipped as f,
  redactMigrationItem as g,
  readMigrationConfigPath as h,
  applyMigrationConfigPatchItem as i,
  hasMigrationConfigPatchConflict as l,
  readMigrationConfigPatchDetails as m,
  MIGRATION_REASON_TARGET_EXISTS as n,
  createMigrationConfigPatchItem as o,
  mergeMigrationConfigValue as p,
  MigrationConfigPatchDetails as r,
  createMigrationItem as s,
  MIGRATION_REASON_MISSING_SOURCE_OR_TARGET as t,
  markMigrationItemConflict as u,
  redactMigrationValue as v,
  summarizeMigrationItems as y,
};
