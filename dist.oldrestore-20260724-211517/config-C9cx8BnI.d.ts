import { g as OpenClawPluginApi } from "./plugin-entry-DPCR66aO.js";
import { tt as ResolvedActiveRecallPluginConfig } from "./types-Di2zMoWq.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region extensions/active-memory/config.d.ts
declare function clampInt(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
): number;
declare function hasDeprecatedModelFallbackPolicy(pluginConfig: unknown): boolean;
declare function resolveSafeTranscriptDir(baseSessionsDir: string, transcriptDir: string): string;
declare function resolvePersistentTranscriptBaseDir(
  api: OpenClawPluginApi,
  agentId: string,
): string;
declare function requireTransientWorkspaceDir(tempDir: string | undefined): string;
declare function isMissingRegisteredMemoryToolsError(
  error: unknown,
  toolsAllow?: readonly string[],
): boolean;
declare function normalizePluginConfig(
  pluginConfig: unknown,
  cfg?: OpenClawConfig,
): ResolvedActiveRecallPluginConfig;
declare function applyActiveMemoryRuntimeConfigSnapshot(
  cfg: OpenClawConfig,
  pluginConfig: ResolvedActiveRecallPluginConfig,
): OpenClawConfig;
declare function resolveActiveMemoryCleanupConfig(
  api: OpenClawPluginApi,
): OpenClawConfig | undefined;
declare function resetActiveMemoryConfigForTests(): void;
declare function setMinimumTimeoutMsForTests(value: number): void;
declare function setSetupGraceTimeoutMsForTests(value: number): void;
//#endregion
export {
  normalizePluginConfig as a,
  resolveActiveMemoryCleanupConfig as c,
  setMinimumTimeoutMsForTests as d,
  setSetupGraceTimeoutMsForTests as f,
  isMissingRegisteredMemoryToolsError as i,
  resolvePersistentTranscriptBaseDir as l,
  clampInt as n,
  requireTransientWorkspaceDir as o,
  hasDeprecatedModelFallbackPolicy as r,
  resetActiveMemoryConfigForTests as s,
  applyActiveMemoryRuntimeConfigSnapshot as t,
  resolveSafeTranscriptDir as u,
};
