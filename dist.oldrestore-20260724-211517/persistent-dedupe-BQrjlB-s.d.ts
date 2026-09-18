import { i as FileLockOptions } from "./file-lock-C2TAh7w5.js";

//#region src/plugin-sdk/persistent-dedupe.d.ts
type PersistentDedupeEntry = {
  key: string;
  seenAt: number;
};
type PersistentDedupeBaseOptions = {
  /** Milliseconds a recorded key remains recent; `0` keeps keys until cache pruning. */ ttlMs: number /** Maximum process-local cache entries used before consulting SQLite. */;
  memoryMaxSize: number;
  onDiskError?: (error: unknown) => void;
};
/** Configuration for a SQLite plugin-state dedupe namespace cache. */
type PersistentDedupePluginStateOptions = PersistentDedupeBaseOptions & {
  /** Plugin id that owns the persisted dedupe namespace. */ pluginId: string /** Prefix for persisted plugin-state namespaces; defaults to `persistent-dedupe`. */;
  namespacePrefix?: string /** Maximum persisted entries retained per namespace. */;
  stateMaxEntries: number /** Test/runtime env used to resolve the shared OpenClaw state database. */;
  env?: NodeJS.ProcessEnv;
  resolveFilePath?: undefined;
  fileMaxEntries?: undefined;
  lockOptions?: undefined;
};
/** Legacy path-shaped configuration. Paths now name SQLite namespaces, not JSON files. */
type PersistentDedupeLegacyPathOptions = PersistentDedupeBaseOptions & {
  pluginId?: undefined;
  stateMaxEntries?: undefined;
  namespacePrefix?: undefined /** Maximum persisted entries retained per legacy namespace. */;
  fileMaxEntries: number /** Maps a namespace to the retired JSON path; used only to derive a stable SQLite namespace. */;
  resolveFilePath: (
    namespace: string,
  ) => string /** Test/runtime env used to resolve the shared OpenClaw state database. */;
  env?: NodeJS.ProcessEnv /** @deprecated File locks are ignored because persistence is SQLite-backed. */;
  lockOptions?: Partial<FileLockOptions>;
};
/** Configuration for a persisted dedupe namespace cache. */
type PersistentDedupeOptions =
  | PersistentDedupePluginStateOptions
  | PersistentDedupeLegacyPathOptions;
type PersistentDedupeLegacyJsonMigrationResult = {
  imported: number;
  skippedExpired: number;
  skippedInvalid: number;
  skippedExisting: number;
  removed: boolean;
};
type PersistentDedupeLegacyJsonMigrationOptions = PersistentDedupePluginStateOptions & {
  filePath: string;
  namespace: string;
  now?: number;
  removeFile?: boolean;
};
type PersistentDedupeLegacyJsonImportEntry = {
  key: string;
  value: PersistentDedupeEntry;
  ttlMs?: number;
};
/** Per-call options used when checking or recording a dedupe key. */
type PersistentDedupeCheckOptions = {
  /** Logical bucket for the key; omitted/blank values use `global`. */ namespace?: string /** Test or replay timestamp override used for TTL checks and writes. */;
  now?: number /** Per-call disk error hook, overriding the helper-level hook. */;
  onDiskError?: (error: unknown) => void;
};
/** Disk-backed dedupe guard that records recently seen keys per namespace. */
type PersistentDedupe = {
  /** Returns true only when the key was not recently seen and was recorded for future checks. */ checkAndRecord: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<boolean> /** Checks memory/disk recency without recording a new timestamp. */;
  hasRecent: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<boolean> /** Removes a recorded key from process memory and persisted storage. */;
  forget: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<boolean> /** Loads recent disk entries into memory for one namespace and returns the loaded count. */;
  warmup: (
    namespace?: string,
    onError?: (error: unknown) => void,
  ) => Promise<number> /** Clears only process-local memory; persisted namespace files are left intact. */;
  clearMemory: () => void /** Returns the current process-local cache size. */;
  memorySize: () => number;
};
/** Claim attempt result for dedupe flows that need in-flight ownership. */
type ClaimableDedupeClaimResult =
  | {
      kind: "claimed";
    }
  | {
      kind: "duplicate";
    }
  | {
      kind: "inflight";
      pending: Promise<boolean>;
    };
/** Options for a claimable dedupe guard, either persistent or memory-only. */
type ClaimableDedupeOptions =
  | PersistentDedupePluginStateOptions
  | PersistentDedupeLegacyPathOptions
  | {
      ttlMs: number;
      memoryMaxSize: number;
      pluginId?: undefined;
      stateMaxEntries?: undefined;
      namespacePrefix?: undefined;
      env?: undefined;
      resolveFilePath?: undefined;
      fileMaxEntries?: undefined;
      lockOptions?: undefined;
      onDiskError?: undefined;
    };
/** Dedupe guard that lets one caller own a key while others wait or detect duplicates. */
type ClaimableDedupe = {
  /** Starts ownership of a key, reports duplicates, or returns the active claim's pending result. */ claim: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<ClaimableDedupeClaimResult> /** Records a claimed key as handled and resolves any waiters with the recorded result. */;
  commit: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<boolean> /** Releases an active claim without recording it, rejecting waiters with the supplied error. */;
  release: (
    key: string,
    options?: {
      namespace?: string;
      error?: unknown;
    },
  ) => void /** Checks whether the key is recent without claiming or committing it. */;
  hasRecent: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<boolean> /** Removes an active or committed key from memory and persisted storage when supported. */;
  forget?: (
    key: string,
    options?: PersistentDedupeCheckOptions,
  ) => Promise<boolean> /** Warms persistent storage into memory when configured; memory-only guards return zero. */;
  warmup: (
    namespace?: string,
    onError?: (error: unknown) => void,
  ) => Promise<number> /** Clears process-local caches and in-memory persistent state. */;
  clearMemory: () => void /** Returns the current process-local cache size. */;
  memorySize: () => number;
};
declare function createPersistentDedupeImportEntry(params: {
  key: string;
  seenAt: number;
  ttlMs?: number;
}): PersistentDedupeLegacyJsonImportEntry;
declare function resolvePersistentDedupePluginStateNamespace(options: {
  namespace: string;
  namespacePrefix?: string;
}): string;
declare function listPersistentDedupeLegacyJsonFileEntries(options: {
  filePath: string;
  ttlMs: number;
  now?: number;
}): Promise<PersistentDedupeLegacyJsonImportEntry[]>;
declare function shouldReplacePersistentDedupeEntry(params: {
  existingValue: unknown;
  incomingValue: unknown;
}): boolean;
/** Import one retired JSON dedupe cache file into plugin-state SQLite during doctor repair. */
declare function migratePersistentDedupeLegacyJsonFile(
  options: PersistentDedupeLegacyJsonMigrationOptions,
): Promise<PersistentDedupeLegacyJsonMigrationResult>;
/** Create a dedupe helper that combines in-memory fast checks with SQLite-backed state. */
declare function createPersistentDedupe(options: PersistentDedupeOptions): PersistentDedupe;
/** Create a claim/commit/release dedupe guard backed by memory and optional persistent storage. */
declare function createClaimableDedupe(
  options: ClaimableDedupeOptions,
): ClaimableDedupe & Required<Pick<ClaimableDedupe, "forget">>;
//#endregion
export {
  migratePersistentDedupeLegacyJsonFile as _,
  PersistentDedupeCheckOptions as a,
  PersistentDedupeLegacyJsonMigrationOptions as c,
  PersistentDedupeOptions as d,
  PersistentDedupePluginStateOptions as f,
  listPersistentDedupeLegacyJsonFileEntries as g,
  createPersistentDedupeImportEntry as h,
  PersistentDedupe as i,
  PersistentDedupeLegacyJsonMigrationResult as l,
  createPersistentDedupe as m,
  ClaimableDedupeClaimResult as n,
  PersistentDedupeEntry as o,
  createClaimableDedupe as p,
  ClaimableDedupeOptions as r,
  PersistentDedupeLegacyJsonImportEntry as s,
  ClaimableDedupe as t,
  PersistentDedupeLegacyPathOptions as u,
  resolvePersistentDedupePluginStateNamespace as v,
  shouldReplacePersistentDedupeEntry as y,
};
