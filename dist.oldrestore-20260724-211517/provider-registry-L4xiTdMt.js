import {
  n as resolvePluginCapabilityProvider,
  r as resolvePluginCapabilityProviders,
} from "./capability-provider-runtime-eBLyfsgF.js";
import {
  c as buildCapabilityProviderMaps,
  l as normalizeCapabilityProviderId,
} from "./worker-provider-registry-CKsY-3qr.js";
//#region src/transcripts/provider-registry.ts
/**
 * Transcript source provider registry.
 *
 * Transcript providers are plugin capability providers; this module exposes
 * canonical/alias lookup and keeps direct plugin resolution ahead of map fallback.
 */
/** Normalize transcript source provider ids for registry lookup. */
function normalizeTranscriptSourceProviderId(providerId) {
  return normalizeCapabilityProviderId(providerId);
}
function resolveTranscriptsSourceProviderEntries(cfg) {
  return resolvePluginCapabilityProviders({
    key: "transcriptSourceProviders",
    cfg,
  });
}
function buildProviderMaps(cfg) {
  return buildCapabilityProviderMaps(resolveTranscriptsSourceProviderEntries(cfg));
}
/** List canonical transcript source providers for a config snapshot. */
function listTranscriptSourceProviders(cfg) {
  return [...buildProviderMaps(cfg).canonical.values()];
}
/** Resolve a transcript provider by canonical id or alias. */
function getTranscriptSourceProvider(providerId, cfg) {
  const normalized = normalizeTranscriptSourceProviderId(providerId);
  if (!normalized) return;
  const directProvider = resolvePluginCapabilityProvider({
    key: "transcriptSourceProviders",
    providerId: normalized,
    cfg,
  });
  if (directProvider) return directProvider;
  return buildProviderMaps(cfg).aliases.get(normalized);
}
//#endregion
export {
  listTranscriptSourceProviders as n,
  normalizeTranscriptSourceProviderId as r,
  getTranscriptSourceProvider as t,
};
