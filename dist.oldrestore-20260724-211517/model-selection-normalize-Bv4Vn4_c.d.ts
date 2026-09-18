import { t as PluginManifestRecord } from "./manifest-registry-CHEq75Tu.js";

//#region src/agents/model-selection-normalize.d.ts
type ModelRef = {
  provider: string;
  model: string;
};
type ModelManifestNormalizationContext = {
  manifestPlugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
};
/** Build the canonical provider/model key for model selection. */
declare function modelKey(provider: string, model: string): string;
/** Return the legacy raw key when it differs from the canonical key. */
declare function legacyModelKey(provider: string, model: string): string | null;
/** Normalize a provider ID using the shared catalog rules. */
declare function normalizeProviderId(provider: string): string;
/** Normalize a provider ID for auth lookup. */
declare function normalizeProviderIdForAuth(provider: string): string;
/** Find a provider value by normalized provider ID. */
declare function findNormalizedProviderValue<T>(
  entries: Record<string, T> | undefined,
  provider: string,
): T | undefined;
/** Find the original provider key matching a normalized provider ID. */
declare function findNormalizedProviderKey(
  entries: Record<string, unknown> | undefined,
  provider: string,
): string | undefined;
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
};
/** Normalize a provider/model pair into a canonical model reference. */
declare function normalizeModelRef(
  provider: string,
  model: string,
  options?: ModelRefNormalizeOptions,
): ModelRef;
/** Parse `provider/model` or bare model text using a default provider. */
declare function parseModelRef(
  raw: string,
  defaultProvider: string,
  options?: ModelRefNormalizeOptions,
): ModelRef | null;
//#endregion
export {
  legacyModelKey as a,
  normalizeProviderId as c,
  findNormalizedProviderValue as i,
  normalizeProviderIdForAuth as l,
  ModelRef as n,
  modelKey as o,
  findNormalizedProviderKey as r,
  normalizeModelRef as s,
  ModelManifestNormalizationContext as t,
  parseModelRef as u,
};
