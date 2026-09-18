import { r as resolvePluginCapabilityProviders } from "./capability-provider-runtime-eBLyfsgF.js";
import { t as parseGenerationModelRef } from "./model-ref-DeFiHmoa.js";
import {
  c as buildCapabilityProviderMaps,
  l as normalizeCapabilityProviderId,
} from "./worker-provider-registry-CKsY-3qr.js";
//#region src/image-generation/model-ref.ts
/** Parses image-generation model references into provider/model components. */
function parseImageGenerationModelRef(raw) {
  return parseGenerationModelRef(raw);
}
//#endregion
//#region src/image-generation/provider-registry.ts
const BUILTIN_IMAGE_GENERATION_PROVIDERS = [];
function resolvePluginImageGenerationProviders(cfg) {
  return resolvePluginCapabilityProviders({
    key: "imageGenerationProviders",
    cfg,
  });
}
function buildProviderMaps(cfg) {
  return buildCapabilityProviderMaps(
    [...BUILTIN_IMAGE_GENERATION_PROVIDERS, ...resolvePluginImageGenerationProviders(cfg)],
    normalizeCapabilityProviderId,
  );
}
/** Lists canonical image-generation providers visible for config. */
function listImageGenerationProviders(cfg) {
  return [...buildProviderMaps(cfg).canonical.values()];
}
/** Resolves an image-generation provider by canonical id or alias. */
function getImageGenerationProvider(providerId, cfg) {
  const normalized = normalizeCapabilityProviderId(providerId);
  if (!normalized) return;
  return buildProviderMaps(cfg).aliases.get(normalized);
}
//#endregion
export {
  listImageGenerationProviders as n,
  parseImageGenerationModelRef as r,
  getImageGenerationProvider as t,
};
