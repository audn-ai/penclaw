import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-X-jDa4d1.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/plugins/thread-binding-api.ts
/**
 * Bundled channel thread-binding public artifact loader.
 *
 * Reads lightweight thread placement and inbound conversation hooks without full plugin loading.
 */
const THREAD_BINDING_API_ARTIFACT_BASENAME = "thread-binding-api.js";
const MISSING_PUBLIC_SURFACE_PREFIX = "Unable to resolve bundled plugin public surface ";
function loadBundledChannelThreadBindingApi(channelId) {
  const cacheKey = channelId.trim();
  try {
    return loadBundledPluginPublicArtifactModuleSync({
      dirName: cacheKey,
      artifactBasename: THREAD_BINDING_API_ARTIFACT_BASENAME,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(MISSING_PUBLIC_SURFACE_PREFIX)) return;
    throw error;
  }
}
function normalizeThreadBindingPlacement(value) {
  const normalized = normalizeOptionalString(typeof value === "string" ? value : void 0);
  return normalized === "current" || normalized === "child" ? normalized : void 0;
}
/**
 * Resolves the default top-level thread-binding placement for a bundled channel.
 */
function resolveBundledChannelThreadBindingDefaultPlacement(channelId) {
  return normalizeThreadBindingPlacement(
    loadBundledChannelThreadBindingApi(channelId)?.defaultTopLevelPlacement,
  );
}
/**
 * Resolves inbound conversation refs from a bundled channel thread-binding artifact.
 */
function resolveBundledChannelThreadBindingInboundConversation(params) {
  const api = loadBundledChannelThreadBindingApi(params.channelId);
  if (typeof api?.resolveInboundConversation !== "function") return;
  return api.resolveInboundConversation({
    from: params.from,
    to: params.to,
    conversationId: params.conversationId,
    threadId: params.threadId,
    threadParentId: params.threadParentId,
    isGroup: params.isGroup,
  });
}
//#endregion
export {
  resolveBundledChannelThreadBindingInboundConversation as n,
  resolveBundledChannelThreadBindingDefaultPlacement as t,
};
