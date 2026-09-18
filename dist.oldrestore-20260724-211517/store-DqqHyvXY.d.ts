import { s as SessionEntry } from "./types-Dk-ocvLl.js";
import { k as SessionMaintenanceMode } from "./types.base-ibSxQuK3.js";

//#region src/config/sessions/disk-budget.d.ts
type SessionDiskBudgetSweepResult = {
  totalBytesBefore: number;
  totalBytesAfter: number;
  removedFiles: number;
  removedEntries: number;
  freedBytes: number;
  maxBytes: number;
  highWaterBytes: number;
  overBudget: boolean;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type SessionMaintenanceWarning = {
  activeSessionKey: string;
  activeUpdatedAt?: number;
  totalEntries: number;
  pruneAfterMs: number;
  maxEntries: number;
  wouldPrune: boolean;
  wouldCap: boolean;
};
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<
  ResolvedSessionMaintenanceConfig,
  "modelRunPruneAfterMs"
> &
  Partial<Pick<ResolvedSessionMaintenanceConfig, "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/store-maintenance-operations.d.ts
type SessionMaintenanceApplyReport = {
  mode: ResolvedSessionMaintenanceConfig["mode"];
  beforeCount: number;
  afterCount: number;
  modelRunPruned: number;
  pruned: number;
  capped: number;
  diskBudget: SessionDiskBudgetSweepResult | null;
};
//#endregion
//#region src/config/sessions/store-writer-state.d.ts
/** Clears session store writer queues and cache for tests. */
declare function clearSessionStoreCacheForTest(): void;
//#endregion
//#region src/config/sessions/store-load.d.ts
type LoadSessionStoreOptions = {
  skipCache?: boolean;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
  runMaintenance?: boolean;
  clone?: boolean;
  hydrateSkillPromptRefs?: boolean;
};
declare function loadSessionStore(
  storePath: string,
  opts?: LoadSessionStoreOptions,
): Record<string, SessionEntry>;
//#endregion
//#region src/config/sessions/store.d.ts
type SaveSessionStoreOptions = {
  /** Skip pruning, capping, and rotation (e.g. during one-time migrations). */ skipMaintenance?: boolean /** Caller already proved the store serialization is unchanged unless maintenance mutates it. */;
  skipSerializeForUnchangedStore?: boolean /** Internal hot paths can hand writer-owned stores to the cache after persistence. */;
  takeCacheOwnership?: boolean /** Active session key for warn-only maintenance. */;
  activeSessionKey?: string /** Optional callback for warn-only maintenance. */;
  onWarn?: (
    warning: SessionMaintenanceWarning,
  ) => void | Promise<void> /** Optional callback with maintenance stats after a save. */;
  onMaintenanceApplied?: (
    report: SessionMaintenanceApplyReport,
  ) => void | Promise<void> /** Optional overrides used by maintenance commands. */;
  maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig> /** Fully resolved maintenance settings when the caller already has config loaded. */;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig /** Changed top-level entry when a hot path only updated one existing session. */;
  singleEntryPersistence?: SingleEntryPersistencePatch /** Throw when best-effort store recovery cannot confirm the requested write. */;
  requireWriteSuccess?: boolean;
};
type SingleEntryPersistencePatch = {
  sessionKey: string;
  entry: SessionEntry;
};
declare function saveSessionStore(
  storePath: string,
  store: Record<string, SessionEntry>,
  opts?: SaveSessionStoreOptions,
): Promise<void>;
declare function updateSessionStoreEntry(params: {
  storePath: string;
  sessionKey: string;
  update: (
    entry: SessionEntry,
  ) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  requireWriteSuccess?: boolean;
}): Promise<SessionEntry | null>;
//#endregion
export {
  ResolvedSessionMaintenanceConfigInput as a,
  clearSessionStoreCacheForTest as i,
  updateSessionStoreEntry as n,
  loadSessionStore as r,
  saveSessionStore as t,
};
