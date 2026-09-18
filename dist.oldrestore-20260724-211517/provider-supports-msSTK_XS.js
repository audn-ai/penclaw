//#region packages/media-understanding-common/src/provider-supports.ts
/** Return true when a provider exposes the method for a media capability. */
function providerSupportsCapability(provider, capability) {
  if (!provider) return false;
  if (capability === "audio") return Boolean(provider.transcribeAudio);
  if (capability === "image") return Boolean(provider.describeImage);
  return Boolean(provider.describeVideo);
}
//#endregion
export { providerSupportsCapability as t };
