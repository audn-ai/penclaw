import fs from "node:fs";
import JSON5 from "json5";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import {
  a as RuntimeConfigWriteNotification,
  i as RuntimeConfigSnapshotRefreshOptions,
  o as RuntimeConfigWritePreparedCandidate,
  t as ConfigWriteAfterWrite,
} from "./runtime-snapshot-CCyfWEDJ.js";
import { i as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-DDo8sH3F.js";

//#region src/config/runtime-source-projection.d.ts
/** Projects a runtime-derived config back onto the active authored source snapshot. */
declare function projectConfigOntoRuntimeSourceSnapshot(config: OpenClawConfig): OpenClawConfig;
//#endregion
//#region src/config/io.d.ts
type ParseConfigJson5Result =
  | {
      ok: true;
      parsed: unknown;
    }
  | {
      ok: false;
      error: string;
    };
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
};
declare const configWritePostCommitRollback: unique symbol;
type InternalConfigWriteResult = ConfigWriteResult & {
  [configWritePostCommitRollback]?: () => void;
};
type ConfigWriteOptions = {
  /**
   * Read-time env snapshot used to validate `${VAR}` restoration decisions.
   * If omitted, write falls back to current process env.
   */
  envSnapshotForRestore?: Record<string, string | undefined>;
  /**
   * Optional safety check: only use envSnapshotForRestore when writing the
   * same config file path that produced the snapshot.
   */
  expectedConfigPath?: string /** Internal write destination captured by readConfigFileSnapshotForWrite(). */;
  ownedConfigPathForWrite?: string;
  /**
   * Internal mutation-start ownership guard. Rechecks that the config path
   * captured by readConfigFileSnapshotForWrite() is still active at commit.
   */
  assertConfigPathForWrite?: () => void;
  /**
   * Paths that must be explicitly removed from the persisted file payload,
   * even if schema/default normalization reintroduces them.
   */
  unsetPaths?: string[][];
  /**
   * Paths that were explicitly set by the caller. Values at these paths are
   * persisted even when they equal runtime-injected defaults.
   */
  explicitSetPaths?: readonly (readonly string[])[];
  /**
   * Internal companion for explicitSetPaths after a wrapper has projected a
   * runtime-shaped config back onto the authored source shape.
   */
  explicitSetValueSource?: OpenClawConfig;
  /**
   * Internal fast path for callers that already hold a fresh config snapshot.
   * Avoids rereading the full config just to prepare an immediate write.
   */
  baseSnapshot?: ConfigFileSnapshot;
  /**
   * Plugin metadata paired with baseSnapshot when the caller already read it.
   */
  basePluginMetadataSnapshot?: PluginMetadataSnapshot;
  /**
   * Internal one-shot CLI fast path. When no runtime snapshot is active, skip
   * the post-write runtime snapshot refresh/reload tail entirely.
   */
  skipRuntimeSnapshotRefresh?: boolean;
  /**
   * Optional controls for the active runtime snapshot refresh after this write.
   */
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  /**
   * Allow intentionally destructive config writes, such as explicit reset flows.
   * Normal writers must keep this false so clobbers are rejected before disk commit.
   */
  allowDestructiveWrite?: boolean;
  /**
   * Allow an intentional large config size drop while keeping other destructive
   * guards active. Used by repair flows that remove stale or legacy config.
   */
  allowConfigSizeDrop?: boolean;
  /**
   * Suppress human-readable output logs (overwrite/anomaly messages).
   * Useful when the caller wants machine-readable output only (--json mode).
   */
  skipOutputLogs?: boolean;
  /**
   * Runtime reload intent for observers that react to committed config writes.
   * Omitted means the observer should use its normal reload plan.
   */
  afterWrite?: ConfigWriteAfterWrite;
  /**
   * Legacy root keys to preserve on disk while excluding them from write validation.
   * This is for doctor repair of historical config metadata that should not become
   * part of the public schema contract again.
   */
  preservedLegacyRootKeys?: readonly string[];
  /**
   * Skip plugin-aware validation before writing. Use only for safe partial
   * migrations (e.g. legacy key removal) where the base schema is valid but
   * an unrelated plugin rule prevents the full write from succeeding.
   */
  skipPluginValidation?: boolean;
  /**
   * Preserve an older writer version for update handoff writes that must be
   * readable by the parent process after a candidate doctor repair.
   */
  lastTouchedVersionOverride?: string;
  /**
   * Guard invoked after validation has produced the exact source config that
   * will be committed. The exported writer composes it after runtime preflight.
   */
  preCommitRuntimePreflight?: (
    sourceConfig: OpenClawConfig,
  ) => Promise<unknown> /** Internal snapshot-time hashes for include files that mutation writers may update directly. */;
  includeFileHashesForWrite?: Record<
    string,
    string
  > /** Internal snapshot-time canonical targets for include files that mutation writers may update. */;
  includeFileTargetsForWrite?: Record<string, string>;
};
type ReadConfigFileSnapshotForWriteResult = {
  snapshot: ConfigFileSnapshot;
  writeOptions: ConfigWriteOptions;
};
type ConfigWriteNotification = RuntimeConfigWriteNotification;
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
declare class ConfigRuntimeRefreshError extends Error {
  constructor(
    message: string,
    options?: {
      cause?: unknown;
    },
  );
}
declare function resolveConfigSnapshotHash(snapshot: {
  hash?: string;
  raw?: string | null;
}): string | null;
type ConfigIoDeps = {
  fs?: typeof fs;
  json5?: typeof JSON5;
  env?: NodeJS.ProcessEnv;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  homedir?: () => string;
  configPath?: string;
  logger?: Pick<typeof console, "error" | "warn">;
  measure?: ConfigSnapshotReadMeasure;
  suppressFutureVersionWarning?: boolean;
  observe?: boolean;
};
type ConfigSnapshotReadOptions = {
  measure?: ConfigSnapshotReadMeasure;
  observe?: boolean;
  isolateEnv?: boolean;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  recoverSuspicious?: boolean;
  allowSuspiciousRecovery?: (
    candidate: OpenClawConfig,
    current: OpenClawConfig,
  ) => boolean | Promise<boolean>;
  skipPluginValidation?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  suppressFutureVersionWarning?: boolean;
};
declare function parseConfigJson5(
  raw: string,
  json5?: {
    parse: (value: string) => unknown;
  },
): ParseConfigJson5Result;
type ReadConfigFileSnapshotWithPluginMetadataResult = {
  snapshot: ConfigFileSnapshot;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
type BestEffortConfigSnapshot = {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
};
declare function createConfigIO(
  overrides?: ConfigIoDeps & {
    pluginValidation?: "full" | "skip";
    preservedLegacyRootKeys?: readonly string[];
    shellEnvFallback?: "load" | "defer";
  },
): {
  configPath: string;
  env: NodeJS.ProcessEnv;
  loadConfig: (options?: { skipSuspiciousRecovery?: boolean }) => OpenClawConfig;
  readBestEffortConfig: () => Promise<OpenClawConfig>;
  readBestEffortConfigSnapshot: () => Promise<BestEffortConfigSnapshot>;
  readSourceConfigBestEffort: () => Promise<OpenClawConfig>;
  readConfigFileSnapshot: (options?: ConfigSnapshotReadOptions) => Promise<ConfigFileSnapshot>;
  readConfigFileSnapshotWithPluginMetadata: (
    options?: ConfigSnapshotReadOptions,
  ) => Promise<ReadConfigFileSnapshotWithPluginMetadataResult>;
  readConfigFileSnapshotForWrite: () => Promise<ReadConfigFileSnapshotForWriteResult>;
  promoteConfigSnapshotToLastKnownGood: (snapshot: ConfigFileSnapshot) => Promise<boolean>;
  recoverConfigFromLastKnownGood: (params: {
    snapshot: ConfigFileSnapshot;
    reason: string;
  }) => Promise<boolean>;
  recoverConfigFromJsonRootSuffix: (snapshot: ConfigFileSnapshot) => Promise<boolean>;
  writeConfigFile: (
    cfg: OpenClawConfig,
    options?: ConfigWriteOptions,
  ) => Promise<InternalConfigWriteResult>;
};
declare function clearConfigCache(): void;
declare function registerConfigWriteListener(
  listener: (event: ConfigWriteNotification) => void,
  options?: {
    ownsRuntimeActivationFor?: string;
    preCommitRuntimePreflight?: (
      sourceConfig: OpenClawConfig,
      refreshOptions?: RuntimeConfigSnapshotRefreshOptions,
    ) => Promise<RuntimeConfigWritePreparedCandidate>;
  },
): () => void;
declare function loadConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function getRuntimeConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function readBestEffortConfig(options?: {
  isolateEnv?: boolean;
  observe?: boolean;
  skipPluginValidation?: boolean;
}): Promise<OpenClawConfig>;
declare function readBestEffortConfigSnapshot(options?: {
  observe?: boolean;
  skipPluginValidation?: boolean;
}): Promise<BestEffortConfigSnapshot>;
declare function readSourceConfigBestEffort(): Promise<OpenClawConfig>;
declare function readConfigFileSnapshot(
  options?: ConfigSnapshotReadOptions,
): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotWithPluginMetadata(
  options?: Pick<
    ConfigSnapshotReadOptions,
    | "allowSuspiciousRecovery"
    | "isolateEnv"
    | "lowerPrecedenceEnv"
    | "measure"
    | "observe"
    | "recoverSuspicious"
  >,
): Promise<ReadConfigFileSnapshotWithPluginMetadataResult>;
declare function promoteConfigSnapshotToLastKnownGood(
  snapshot: ConfigFileSnapshot,
): Promise<boolean>;
declare function recoverConfigFromLastKnownGood(params: {
  snapshot: ConfigFileSnapshot;
  reason: string;
}): Promise<boolean>;
declare function recoverConfigFromJsonRootSuffix(snapshot: ConfigFileSnapshot): Promise<boolean>;
declare function readSourceConfigSnapshot(): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function readSourceConfigSnapshotForWrite(): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(
  cfg: OpenClawConfig,
  options?: ConfigWriteOptions,
): Promise<ConfigWriteResult>;
//#endregion
export {
  recoverConfigFromLastKnownGood as C,
  projectConfigOntoRuntimeSourceSnapshot as D,
  writeConfigFile as E,
  recoverConfigFromJsonRootSuffix as S,
  resolveConfigSnapshotHash as T,
  readConfigFileSnapshotForWrite as _,
  ConfigWriteOptions as a,
  readSourceConfigSnapshot as b,
  clearConfigCache as c,
  loadConfig as d,
  parseConfigJson5 as f,
  readConfigFileSnapshot as g,
  readBestEffortConfigSnapshot as h,
  ConfigWriteNotification as i,
  createConfigIO as l,
  readBestEffortConfig as m,
  ConfigRuntimeRefreshError as n,
  ConfigWriteResult as o,
  promoteConfigSnapshotToLastKnownGood as p,
  ConfigSnapshotReadOptions as r,
  ReadConfigFileSnapshotWithPluginMetadataResult as s,
  BestEffortConfigSnapshot as t,
  getRuntimeConfig as u,
  readConfigFileSnapshotWithPluginMetadata as v,
  registerConfigWriteListener as w,
  readSourceConfigSnapshotForWrite as x,
  readSourceConfigBestEffort as y,
};
