import { t as FallbackAttempt } from "./model-fallback.types-BQxBBoz4.js";
import { t as MediaGenerationNormalizationMetadataInput } from "./normalization-DLCKp1Ce.js";
import { n as getProviderEnvVars } from "./provider-env-vars-D_E_Txif.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { o as AgentModelConfig } from "./types.provider-request-CVFNhEKy.js";

//#region src/media-generation/runtime-shared.d.ts
type ParsedProviderModelRef = {
  provider: string;
  model: string;
};
/** Records one provider/model failure in the common fallback-attempt shape. */
declare function recordCapabilityCandidateFailure(params: {
  attempts: FallbackAttempt[];
  provider: string;
  model: string;
  error: unknown;
}): void;
declare function resolveMediaProviderDefaultTimeoutMs(
  timeoutMs: number | undefined,
): number | undefined;
/** Resolves a request timeout, preferring per-request over provider defaults. */
declare function resolveMediaProviderRequestTimeoutMs(params: {
  timeoutMs?: number;
  providerDefaultTimeoutMs?: number;
}): number | undefined;
type CapabilityProviderCandidate = {
  id: string;
  aliases?: readonly string[];
  defaultModel?: string | null;
  models?: readonly string[];
  isConfigured?: (ctx: { cfg?: OpenClawConfig; agentDir?: string }) => boolean;
};
/** Builds ordered provider/model candidates for one media capability request. */
declare function resolveCapabilityModelCandidates(params: {
  cfg: OpenClawConfig;
  modelConfig: AgentModelConfig | undefined;
  modelOverride?: string;
  parseModelRef: (raw: string | undefined) => ParsedProviderModelRef | null;
  agentDir?: string;
  listProviders?: (cfg?: OpenClawConfig) => CapabilityProviderCandidate[];
  autoProviderFallback?: boolean;
}): ParsedProviderModelRef[];
/** Derives a reduced aspect ratio string from a WIDTHxHEIGHT size. */
declare function deriveAspectRatioFromSize(size?: string): string | undefined;
/** Chooses the closest supported aspect ratio for a request. */
declare function resolveClosestAspectRatio(params: {
  requestedAspectRatio?: string;
  requestedSize?: string;
  supportedAspectRatios?: readonly string[];
}): string | undefined;
/** Chooses the closest supported size by aspect ratio and area. */
declare function resolveClosestSize(params: {
  requestedSize?: string;
  requestedAspectRatio?: string;
  supportedSizes?: readonly string[];
}): string | undefined;
/** Chooses the closest supported resolution by numeric rank or custom order. */
declare function resolveClosestResolution<TResolution extends string>(params: {
  requestedResolution?: TResolution;
  supportedResolutions?: readonly TResolution[];
  order?: readonly TResolution[];
}): TResolution | undefined;
/** Rounds duration and clamps it to a provider maximum when supplied. */
declare function normalizeDurationToClosestMax(
  durationSeconds?: number,
  maxDurationSeconds?: number,
): number | undefined;
/** Builds user-visible metadata describing provider normalization decisions. */
declare function buildMediaGenerationNormalizationMetadata(params: {
  normalization?: MediaGenerationNormalizationMetadataInput;
  requestedSizeForDerivedAspectRatio?: string;
  includeSupportedDurationSeconds?: boolean;
}): Record<string, unknown>;
/** Throws a summarized error after all provider/model candidates fail. */
declare function throwCapabilityGenerationFailure(params: {
  capabilityLabel: string;
  attempts: FallbackAttempt[];
  lastError: unknown;
}): never;
/** Formats setup guidance when no model is configured for a media capability. */
declare function buildNoCapabilityModelConfiguredMessage(params: {
  capabilityLabel: string;
  modelConfigKey: string;
  providers: Array<{
    id: string;
    defaultModel?: string | null;
  }>;
  fallbackSampleRef?: string;
  getProviderEnvVars?: typeof getProviderEnvVars;
}): string;
//#endregion
export {
  normalizeDurationToClosestMax as a,
  resolveClosestAspectRatio as c,
  resolveMediaProviderDefaultTimeoutMs as d,
  resolveMediaProviderRequestTimeoutMs as f,
  deriveAspectRatioFromSize as i,
  resolveClosestResolution as l,
  buildMediaGenerationNormalizationMetadata as n,
  recordCapabilityCandidateFailure as o,
  throwCapabilityGenerationFailure as p,
  buildNoCapabilityModelConfiguredMessage as r,
  resolveCapabilityModelCandidates as s,
  ParsedProviderModelRef as t,
  resolveClosestSize as u,
};
