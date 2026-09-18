import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/config/config-env-vars.d.ts
/** Config-owned runtime env staged for one acceptance transaction. */
type ConfigRuntimeEnvPublication = (() => void) & {
  commit: () => void;
};
type PreparedConfigRuntimeEnv = {
  env: NodeJS.ProcessEnv;
  publish: () => ConfigRuntimeEnvPublication;
};
//#endregion
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};
type RuntimeConfigSnapshotRefreshParams = RuntimeConfigSnapshotRefreshOptions & {
  sourceConfig: OpenClawConfig;
  preflightResult?: unknown;
};
type MaybePromise<T> = T | Promise<T>;
type ConfigWriteAfterWrite =
  | {
      mode: "auto";
    }
  | {
      mode: "restart";
      reason: string;
    }
  | {
      mode: "none";
      reason: string;
    };
type ConfigWriteFollowUp =
  | {
      mode: "auto";
      requiresRestart: false;
    }
  | {
      mode: "none";
      reason: string;
      requiresRestart: false;
    }
  | {
      mode: "restart";
      reason: string;
      requiresRestart: true;
    };
declare function resolveConfigWriteAfterWrite(
  afterWrite?: ConfigWriteAfterWrite,
): ConfigWriteAfterWrite;
declare function resolveConfigWriteFollowUp(
  afterWrite?: ConfigWriteAfterWrite,
): ConfigWriteFollowUp;
type RuntimeConfigSnapshotRefreshHandler = {
  preflight?: (params: RuntimeConfigSnapshotRefreshParams) => MaybePromise<unknown>;
  refresh: (params: RuntimeConfigSnapshotRefreshParams) => boolean | Promise<boolean>;
  clearOnRefreshFailure?: () => void;
};
type RuntimeConfigWriteNotification = {
  configPath: string;
  sourceConfig: OpenClawConfig;
  runtimeConfig: OpenClawConfig;
  persistedHash: string;
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  writtenAtMs: number;
  afterWrite?: ConfigWriteAfterWrite;
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  preparedCandidate?: RuntimeConfigWritePreparedCandidate;
  preparedCandidatesByOwner?: ReadonlyMap<symbol, RuntimeConfigWritePreparedCandidate>;
};
type RuntimeConfigWritePreparedCandidate = {
  runtimeConfig: OpenClawConfig;
  compareConfig: OpenClawConfig;
  runtimeEnv?: PreparedConfigRuntimeEnv;
  reapplyRuntimeOverlays?: (config: OpenClawConfig) => OpenClawConfig;
  reapplyCompareOverlays?: (config: OpenClawConfig) => OpenClawConfig;
};
type RuntimeConfigSnapshotMetadata = {
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  updatedAtMs: number;
};
declare function hashRuntimeConfigValue(value: OpenClawConfig): string;
declare function setRuntimeConfigSnapshot(
  config: OpenClawConfig,
  sourceConfig?: OpenClawConfig,
): void;
declare function resetConfigRuntimeState(): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSnapshotMetadata(): RuntimeConfigSnapshotMetadata | null;
declare function resolveRuntimeConfigCacheKey(config: OpenClawConfig): string;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
declare function setRuntimeConfigSnapshotRefreshHandler(
  refreshHandler: RuntimeConfigSnapshotRefreshHandler | null,
): void;
//#endregion
export {
  setRuntimeConfigSnapshot as _,
  RuntimeConfigWriteNotification as a,
  getRuntimeConfigSnapshot as c,
  hashRuntimeConfigValue as d,
  resetConfigRuntimeState as f,
  selectApplicableRuntimeConfig as g,
  resolveRuntimeConfigCacheKey as h,
  RuntimeConfigSnapshotRefreshOptions as i,
  getRuntimeConfigSnapshotMetadata as l,
  resolveConfigWriteFollowUp as m,
  ConfigWriteFollowUp as n,
  RuntimeConfigWritePreparedCandidate as o,
  resolveConfigWriteAfterWrite as p,
  RuntimeConfigSnapshotMetadata as r,
  clearRuntimeConfigSnapshot as s,
  ConfigWriteAfterWrite as t,
  getRuntimeConfigSourceSnapshot as u,
  setRuntimeConfigSnapshotRefreshHandler as v,
};
