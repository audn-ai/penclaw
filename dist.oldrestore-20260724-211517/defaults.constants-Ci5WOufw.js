import { r as resolvePluginCapabilityProviders } from "./capability-provider-runtime-eBLyfsgF.js";
import { t as resolveImageCapableConfigProviderIds } from "./config-provider-models-C4gvrjuU.js";
import {
  r as describeImagesWithModel,
  t as describeImageWithModel,
} from "./image-runtime-Bf0M579x.js";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.js";
//#region src/media-understanding/provider-registry.ts
function mergeProviderIntoRegistry(registry, provider, registryKey = provider.id) {
  const normalizedKey = normalizeMediaProviderId(registryKey);
  const existing = registry.get(normalizedKey);
  const merged = existing
    ? {
        ...existing,
        ...provider,
        capabilities: provider.capabilities ?? existing.capabilities,
        defaultModels: provider.defaultModels ?? existing.defaultModels,
        autoPriority: provider.autoPriority ?? existing.autoPriority,
        nativeDocumentInputs: provider.nativeDocumentInputs ?? existing.nativeDocumentInputs,
        documentModels: provider.documentModels ?? existing.documentModels,
      }
    : provider;
  registry.set(normalizedKey, hydrateModelBackedMediaProvider(merged));
}
function hydrateModelBackedMediaProvider(provider) {
  if (!provider.capabilities?.includes("image")) return provider;
  if (provider.describeImage && provider.describeImages) return provider;
  return {
    ...provider,
    describeImage: provider.describeImage ?? describeImageWithModel,
    describeImages: provider.describeImages ?? describeImagesWithModel,
  };
}
/** Builds the media-understanding provider registry from plugin capabilities and config providers. */
function buildMediaUnderstandingRegistry(overrides, cfg) {
  const registry = /* @__PURE__ */ new Map();
  for (const provider of resolvePluginCapabilityProviders({
    key: "mediaUnderstandingProviders",
    cfg,
  }))
    mergeProviderIntoRegistry(registry, provider);
  for (const normalizedKey of resolveImageCapableConfigProviderIds(cfg))
    if (!registry.has(normalizedKey))
      mergeProviderIntoRegistry(registry, {
        id: normalizedKey,
        capabilities: ["image"],
        describeImage: describeImageWithModel,
        describeImages: describeImagesWithModel,
      });
  if (overrides)
    for (const [key, provider] of Object.entries(overrides))
      mergeProviderIntoRegistry(registry, provider, key);
  return registry;
}
/** Looks up a media-understanding provider using the same id normalization as registry builds. */
function getMediaUnderstandingProvider(id, registry) {
  return registry.get(normalizeMediaProviderId(id));
}
//#endregion
//#region packages/media-understanding-common/src/defaults.ts
const MB = 1024 * 1024;
/** Default max response characters for bounded text outputs. */
const DEFAULT_MAX_CHARS = 500;
/** Default max response characters by capability. */
const DEFAULT_MAX_CHARS_BY_CAPABILITY = {
  image: 500,
  audio: void 0,
  video: 500,
};
/** Default input byte limits by capability. */
const DEFAULT_MAX_BYTES = {
  image: 10 * MB,
  audio: 20 * MB,
  video: 50 * MB,
};
/** Default request timeout by capability. */
const DEFAULT_TIMEOUT_SECONDS = {
  image: 60,
  audio: 60,
  video: 120,
};
/** Default prompts by capability. */
const DEFAULT_PROMPT = {
  image: "Describe the image.",
  audio: "Transcribe the audio.",
  video: "Describe the video.",
};
/** Upper bound for base64-expanded video payloads. */
const DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
/** CLI output buffer used by provider child processes. */
const CLI_OUTPUT_MAX_BUFFER = 5 * MB;
/** Default parallel media-understanding request count. */
const DEFAULT_MEDIA_CONCURRENCY = 2;
/** Minimum bytes for audio files before transcription is attempted. */
const MIN_AUDIO_FILE_BYTES = 1024;
//#endregion
export {
  DEFAULT_MEDIA_CONCURRENCY as a,
  DEFAULT_VIDEO_MAX_BASE64_BYTES as c,
  getMediaUnderstandingProvider as d,
  DEFAULT_MAX_CHARS_BY_CAPABILITY as i,
  MIN_AUDIO_FILE_BYTES as l,
  DEFAULT_MAX_BYTES as n,
  DEFAULT_PROMPT as o,
  DEFAULT_MAX_CHARS as r,
  DEFAULT_TIMEOUT_SECONDS as s,
  CLI_OUTPUT_MAX_BUFFER as t,
  buildMediaUnderstandingRegistry as u,
};
