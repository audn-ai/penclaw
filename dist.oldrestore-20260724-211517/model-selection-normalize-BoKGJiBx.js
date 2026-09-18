import { createRequire } from "node:module";
import { x as stripSelfProviderModelPrefix } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as modelKey$1 } from "./model-key-BaNhQShd.js";
import { r as normalizeStaticProviderModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import {
  i as normalizeProviderIdForAuth$1,
  n as findNormalizedProviderValue$1,
  r as normalizeProviderId$1,
  t as findNormalizedProviderKey$1,
} from "./provider-id-BIcU_2-A.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/provider-model-normalization.runtime.ts
/**
 * Runtime bridge for provider-owned model id normalization hooks. Source and
 * built artifacts can resolve different extensions, so this module probes both
 * once and caches the result.
 */
const require = createRequire(import.meta.url);
const PROVIDER_RUNTIME_CANDIDATES = [
  "../plugins/provider-runtime.js",
  "../plugins/provider-runtime.ts",
];
let providerRuntimeModule;
let providerRuntimeLoadAttempted = false;
function loadProviderRuntime() {
  if (providerRuntimeModule) return providerRuntimeModule;
  if (providerRuntimeLoadAttempted) return null;
  providerRuntimeLoadAttempted = true;
  for (const candidate of PROVIDER_RUNTIME_CANDIDATES)
    try {
      providerRuntimeModule = require(candidate);
      return providerRuntimeModule;
    } catch {}
  return null;
}
/** Normalizes provider model ids through plugin runtime hooks when available. */
function normalizeProviderModelIdWithRuntime(params) {
  return loadProviderRuntime()?.normalizeProviderModelIdWithPlugin(params);
}
//#endregion
//#region src/agents/model-selection-normalize.ts
/**
 * Normalizes provider/model references and configured model ids.
 */
/** Build the canonical provider/model key for model selection. */
function modelKey(provider, model) {
  return modelKey$1(provider, model);
}
/** Return the legacy raw key when it differs from the canonical key. */
function legacyModelKey(provider, model) {
  const providerId = provider.trim();
  const modelId = model.trim();
  if (!providerId || !modelId) return null;
  const rawKey = `${providerId}/${modelId}`;
  return rawKey === modelKey(providerId, modelId) ? null : rawKey;
}
/** Normalize a provider ID using the shared catalog rules. */
function normalizeProviderId(provider) {
  return normalizeProviderId$1(provider);
}
/** Normalize a provider ID for auth lookup. */
function normalizeProviderIdForAuth(provider) {
  return normalizeProviderIdForAuth$1(provider);
}
/** Find a provider value by normalized provider ID. */
function findNormalizedProviderValue(entries, provider) {
  return findNormalizedProviderValue$1(entries, provider);
}
/** Find the original provider key matching a normalized provider ID. */
function findNormalizedProviderKey(entries, provider) {
  return findNormalizedProviderKey$1(entries, provider);
}
function normalizeProviderModelId(provider, model, options) {
  const staticModelId = normalizeStaticProviderModelId(
    provider,
    stripSelfProviderModelPrefix(provider, model),
    {
      allowManifestNormalization: options?.allowManifestNormalization,
      manifestPlugins: options?.manifestPlugins,
    },
  );
  if (options?.allowPluginNormalization === false) return staticModelId;
  return (
    normalizeProviderModelIdWithRuntime({
      provider,
      ...(options?.manifestPlugins ? { plugins: options.manifestPlugins } : {}),
      context: {
        provider,
        modelId: staticModelId,
      },
    }) ?? staticModelId
  );
}
/** Normalize a provider/model pair into a canonical model reference. */
function normalizeModelRef(provider, model, options) {
  const normalizedProvider = normalizeProviderId(provider);
  return {
    provider: normalizedProvider,
    model: normalizeProviderModelId(normalizedProvider, model.trim(), options),
  };
}
const OPENROUTER_AUTO_COMPAT_ALIAS = "openrouter:auto";
/** Parse `provider/model` or bare model text using a default provider. */
function parseModelRef(raw, defaultProvider, options) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (normalizeLowercaseStringOrEmpty(trimmed) === OPENROUTER_AUTO_COMPAT_ALIAS)
    return normalizeModelRef("openrouter", "auto", options);
  const slash = trimmed.indexOf("/");
  if (slash === -1) return normalizeModelRef(defaultProvider, trimmed, options);
  const providerRaw = trimmed.slice(0, slash).trim();
  const model = trimmed.slice(slash + 1).trim();
  if (!providerRaw || !model) return null;
  return normalizeModelRef(providerRaw, model, options);
}
//#endregion
export {
  normalizeModelRef as a,
  parseModelRef as c,
  modelKey as i,
  findNormalizedProviderValue as n,
  normalizeProviderId as o,
  legacyModelKey as r,
  normalizeProviderIdForAuth as s,
  findNormalizedProviderKey as t,
};
