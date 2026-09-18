//#region packages/media-core/src/constants.ts
/** Default outbound image payload cap shared by media loaders and adapters. */
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
/** Default outbound audio payload cap shared by media loaders and adapters. */
const MAX_AUDIO_BYTES = 16 * 1024 * 1024;
/** Default outbound video payload cap shared by media loaders and adapters. */
const MAX_VIDEO_BYTES = 16 * 1024 * 1024;
/** Default outbound document payload cap shared by media loaders and adapters. */
const MAX_DOCUMENT_BYTES = 100 * 1024 * 1024;
/** Maps a MIME type to the media family used for size limits and routing. */
function mediaKindFromMime(mime) {
  if (!mime) return;
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "document";
  if (mime.startsWith("text/")) return "document";
  if (mime.startsWith("application/")) return "document";
}
/** Returns the default byte cap for a classified media family. */
function maxBytesForKind(kind) {
  switch (kind) {
    case "image":
      return MAX_IMAGE_BYTES;
    case "audio":
      return MAX_AUDIO_BYTES;
    case "video":
      return MAX_VIDEO_BYTES;
    case "document":
      return MAX_DOCUMENT_BYTES;
    default:
      return MAX_DOCUMENT_BYTES;
  }
}
//#endregion
export {
  maxBytesForKind as a,
  MAX_VIDEO_BYTES as i,
  MAX_DOCUMENT_BYTES as n,
  mediaKindFromMime as o,
  MAX_IMAGE_BYTES as r,
  MAX_AUDIO_BYTES as t,
};
