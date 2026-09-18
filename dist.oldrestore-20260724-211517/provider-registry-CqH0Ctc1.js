import { r as resolvePluginCapabilityProviders } from "./capability-provider-runtime-eBLyfsgF.js";
import { t as parseGenerationModelRef } from "./model-ref-DeFiHmoa.js";
import {
  c as buildCapabilityProviderMaps,
  l as normalizeCapabilityProviderId,
} from "./worker-provider-registry-CKsY-3qr.js";
//#region src/music-generation/model-ref.ts
/**
 * Model reference parsing for music generation.
 *
 * Music generation uses the same provider/model ref grammar as other media
 * capabilities, but keeps this wrapper for a dedicated capability boundary.
 */
/** Parse a music generation model ref into provider and model ids. */
function parseMusicGenerationModelRef(raw) {
  return parseGenerationModelRef(raw);
}
//#endregion
//#region src/music-generation/provider-registry.ts
/**
 * Registry for music generation providers.
 *
 * Built-ins and plugin-provided capability providers share one alias map while
 * rejecting unsafe object keys before they reach Maps or config-derived lookups.
 */
const BUILTIN_MUSIC_GENERATION_PROVIDERS = [];
function resolvePluginMusicGenerationProviders(cfg) {
  return resolvePluginCapabilityProviders({
    key: "musicGenerationProviders",
    cfg,
  });
}
function buildProviderMaps(cfg) {
  return buildCapabilityProviderMaps(
    [...BUILTIN_MUSIC_GENERATION_PROVIDERS, ...resolvePluginMusicGenerationProviders(cfg)],
    normalizeCapabilityProviderId,
  );
}
/** List canonical music generation providers available for the current config. */
function listMusicGenerationProviders(cfg) {
  return [...buildProviderMaps(cfg).canonical.values()];
}
/** Resolve a music generation provider by canonical id or alias. */
function getMusicGenerationProvider(providerId, cfg) {
  const normalized = normalizeCapabilityProviderId(providerId);
  if (!normalized) return;
  return buildProviderMaps(cfg).aliases.get(normalized);
}
//#endregion
export {
  listMusicGenerationProviders as n,
  parseMusicGenerationModelRef as r,
  getMusicGenerationProvider as t,
};
