import {
  _ as readConfigFileSnapshotForWrite,
  a as ConfigWriteOptions,
  o as ConfigWriteResult,
} from "./io-BbgXkYnD.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import { t as Result } from "./result-Op6FTu_Y.js";
import {
  n as ConfigWriteFollowUp,
  t as ConfigWriteAfterWrite,
} from "./runtime-snapshot-CCyfWEDJ.js";
import {
  i as OpenClawConfig,
  n as ConfigValidationIssue,
  t as ConfigFileSnapshot,
} from "./types.openclaw-DDo8sH3F.js";

//#region src/config/mutation-types.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
//#endregion
//#region src/config/mutation-conflict.d.ts
/** Raised when a config write loses an optimistic snapshot race. */
declare class ConfigMutationConflictError extends Error {
  readonly currentHash: string | null;
  readonly retryable: boolean;
  constructor(
    message: string,
    params: {
      currentHash: string | null;
      retryable?: boolean;
    },
  );
}
//#endregion
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
type ConfigMutationIO = {
  env?: NodeJS.ProcessEnv;
  readConfigFileSnapshotForWrite: typeof readConfigFileSnapshotForWrite;
  writeConfigFile: (
    cfg: OpenClawConfig,
    options?: ConfigWriteOptions,
  ) => Promise<ConfigWriteResult | void>;
};
type ConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
  attempt: number;
};
type ConfigTransformResult<T> = {
  nextConfig: OpenClawConfig;
  result?: T;
};
type ConfigMutationCommitParams = {
  nextConfig: OpenClawConfig;
  snapshot: ConfigFileSnapshot;
  baseHash?: string;
  writeOptions?: ConfigWriteOptions;
  afterWrite: ConfigWriteAfterWrite;
  io?: ConfigMutationIO;
};
type ConfigMutationCommitResult = {
  config: OpenClawConfig;
  persistedHash: string | null;
  afterWrite?: ConfigWriteAfterWrite;
};
type ConfigMutationCommit = (
  params: ConfigMutationCommitParams,
) => Promise<ConfigMutationCommitResult>;
type TransformConfigFileParams<T> = {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  commit?: ConfigMutationCommit;
  transform: (
    currentConfig: OpenClawConfig,
    context: ConfigMutationContext,
  ) => Promise<ConfigTransformResult<T>> | ConfigTransformResult<T>;
};
type TransformConfigFileWithRetryParams<T> = TransformConfigFileParams<T> & {
  maxAttempts?: number;
};
type ConfigMutationResult<T> = ConfigReplaceResult & {
  result: T | undefined;
  attempts: number;
};
declare function replaceConfigFile(params: {
  nextConfig: OpenClawConfig;
  baseHash?: string;
  snapshot?: ConfigFileSnapshot;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
}): Promise<ConfigReplaceResult>;
declare function transformConfigFile<T = void>(
  params: TransformConfigFileParams<T>,
): Promise<ConfigMutationResult<T>>;
declare function transformConfigFileWithRetry<T = void>(
  params: TransformConfigFileWithRetryParams<T>,
): Promise<ConfigMutationResult<T>>;
declare function mutateConfigFile<T = void>(params: {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
}): Promise<ConfigMutationResult<T>>;
declare function mutateConfigFileWithRetry<T = void>(params: {
  base?: ConfigMutationBase;
  baseHash?: string;
  maxAttempts?: number;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
}): Promise<ConfigMutationResult<T>>;
//#endregion
//#region src/config/nix-mode-write-guard.d.ts
/** Error thrown when a mutating config path is attempted while Nix owns config state. */
declare class NixModeConfigMutationError extends Error {
  readonly code = "OPENCLAW_NIX_MODE_CONFIG_IMMUTABLE";
  constructor(params?: { configPath?: string });
}
/** Throw when the current environment marks OpenClaw config as Nix-managed and immutable. */
declare function assertConfigWriteAllowedInCurrentMode(params?: {
  configPath?: string;
  env?: NodeJS.ProcessEnv;
}): void;
//#endregion
//#region src/config/recovery-policy.d.ts
/**
 * Return true when an invalid config snapshot is blocked only by plugin packaging fallout.
 * This lets callers show plugin repair hints instead of treating user config as corrupted.
 */
declare function isPluginPackagingRuntimeOutputInvalidConfigSnapshot(
  snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues"> &
    Partial<Pick<ConfigFileSnapshot, "warnings">>,
): boolean;
/**
 * Return true when an invalid config snapshot is scoped entirely to stale plugin refs.
 * Whole-file recovery is skipped for these snapshots so plugin cleanup can preserve user config.
 */
declare function isPluginLocalInvalidConfigSnapshot(
  snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues">,
): boolean;
/**
 * Decide whether whole-file last-known-good recovery is appropriate for an invalid snapshot.
 * Plugin-local failures stay on the current file so targeted plugin cleanup can run.
 */
declare function shouldAttemptLastKnownGoodRecovery(
  snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues">,
): boolean;
//#endregion
//#region src/config/runtime-overrides.d.ts
type OverrideTree = Record<string, unknown>;
/** Return the process-local runtime override tree used by debug config commands. */
declare function getConfigOverrides(): OverrideTree;
/** Clear all process-local runtime overrides. Intended for debug reset flows and tests. */
declare function resetConfigOverrides(): void;
/** Set one runtime override at a parsed config path after sanitizing object values. */
declare function setConfigOverride(pathRaw: string, value: unknown): Result<string[], string>;
/** Remove one runtime override path and report whether an override was present. */
declare function unsetConfigOverride(pathRaw: string): Result<boolean, string>;
/** Merge the current runtime overrides over a loaded config without mutating the input config. */
declare function applyConfigOverrides(cfg: OpenClawConfig): OpenClawConfig;
/** Capture an immutable applier for the process-local overrides active at this instant. */
declare function captureConfigOverrideApplier(): (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion
//#region src/config/validation.d.ts
/**
 * Validates config without applying runtime defaults.
 * Use this when you need the raw validated config (e.g., for writing back to file).
 */
declare function validateConfigObjectRaw(
  raw: unknown,
  opts?: {
    sourceRaw?: unknown;
    touchedPaths?: ReadonlyArray<ReadonlyArray<string>>;
    validateBundledChannels?: boolean;
    preservedLegacyRootKeys?: readonly string[];
  },
):
  | {
      ok: true;
      config: OpenClawConfig;
    }
  | {
      ok: false;
      issues: ConfigValidationIssue[];
    };
declare function validateConfigObject(
  raw: unknown,
  opts?: {
    manifestRegistry?: Pick<PluginMetadataSnapshot, "manifestRegistry">["manifestRegistry"];
    sourceRaw?: unknown;
  },
):
  | {
      ok: true;
      config: OpenClawConfig;
    }
  | {
      ok: false;
      issues: ConfigValidationIssue[];
    };
type ValidateConfigWithPluginsResult =
  | {
      ok: true;
      config: OpenClawConfig;
      warnings: ConfigValidationIssue[];
    }
  | {
      ok: false;
      issues: ConfigValidationIssue[];
      warnings: ConfigValidationIssue[];
    };
type ValidateConfigWithPluginsParams = {
  env?: NodeJS.ProcessEnv;
  pluginValidation?: "full" | "skip";
  pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry">;
  loadPluginMetadataSnapshot?: (
    config: OpenClawConfig,
  ) => Pick<PluginMetadataSnapshot, "manifestRegistry">;
  sourceRaw?: unknown;
  preservedLegacyRootKeys?: readonly string[];
};
declare function validateConfigObjectWithPlugins(
  raw: unknown,
  params?: ValidateConfigWithPluginsParams,
): ValidateConfigWithPluginsResult;
declare function validateConfigObjectRawWithPlugins(
  raw: unknown,
  params?: ValidateConfigWithPluginsParams,
): ValidateConfigWithPluginsResult;
//#endregion
export {
  transformConfigFileWithRetry as A,
  ConfigTransformResult as C,
  mutateConfigFileWithRetry as D,
  mutateConfigFile as E,
  ConfigMutationBase as M,
  replaceConfigFile as O,
  ConfigReplaceResult as S,
  TransformConfigFileWithRetryParams as T,
  ConfigMutationCommitParams as _,
  applyConfigOverrides as a,
  ConfigMutationIO as b,
  resetConfigOverrides as c,
  isPluginLocalInvalidConfigSnapshot as d,
  isPluginPackagingRuntimeOutputInvalidConfigSnapshot as f,
  ConfigMutationCommit as g,
  assertConfigWriteAllowedInCurrentMode as h,
  validateConfigObjectWithPlugins as i,
  ConfigMutationConflictError as j,
  transformConfigFile as k,
  setConfigOverride as l,
  NixModeConfigMutationError as m,
  validateConfigObjectRaw as n,
  captureConfigOverrideApplier as o,
  shouldAttemptLastKnownGoodRecovery as p,
  validateConfigObjectRawWithPlugins as r,
  getConfigOverrides as s,
  validateConfigObject as t,
  unsetConfigOverride as u,
  ConfigMutationCommitResult as v,
  TransformConfigFileParams as w,
  ConfigMutationResult as x,
  ConfigMutationContext as y,
};
