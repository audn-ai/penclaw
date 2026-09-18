import {
  n as resolvePluginCapabilityProvider,
  r as resolvePluginCapabilityProviders,
} from "./capability-provider-runtime-eBLyfsgF.js";
import {
  c as buildCapabilityProviderMaps,
  l as normalizeCapabilityProviderId,
} from "./worker-provider-registry-CKsY-3qr.js";
//#region src/realtime-transcription/provider-registry.ts
function normalizeRealtimeTranscriptionProviderId(providerId) {
  return normalizeCapabilityProviderId(providerId);
}
function resolveRealtimeTranscriptionProviderEntries(cfg) {
  return resolvePluginCapabilityProviders({
    key: "realtimeTranscriptionProviders",
    cfg,
  });
}
function buildProviderMaps(cfg) {
  return buildCapabilityProviderMaps(resolveRealtimeTranscriptionProviderEntries(cfg));
}
/** Lists canonical realtime transcription providers for the active config. */
function listRealtimeTranscriptionProviders(cfg) {
  return [...buildProviderMaps(cfg).canonical.values()];
}
/** Resolves a realtime transcription provider by id or alias. */
function getRealtimeTranscriptionProvider(providerId, cfg) {
  const normalized = normalizeRealtimeTranscriptionProviderId(providerId);
  if (!normalized) return;
  const directProvider = resolvePluginCapabilityProvider({
    key: "realtimeTranscriptionProviders",
    providerId: normalized,
    cfg,
  });
  if (directProvider) return directProvider;
  return buildProviderMaps(cfg).aliases.get(normalized);
}
/** Canonicalizes a configured provider id while preserving unknown ids. */
function canonicalizeRealtimeTranscriptionProviderId(providerId, cfg) {
  const normalized = normalizeRealtimeTranscriptionProviderId(providerId);
  if (!normalized) return;
  return getRealtimeTranscriptionProvider(normalized, cfg)?.id ?? normalized;
}
//#endregion
export {
  normalizeRealtimeTranscriptionProviderId as i,
  getRealtimeTranscriptionProvider as n,
  listRealtimeTranscriptionProviders as r,
  canonicalizeRealtimeTranscriptionProviderId as t,
};
