import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region src/media/outbound-attachment.ts
/** Loads a remote/local media URL and stages it into the outbound media store. */
async function resolveOutboundAttachmentFromUrl(mediaUrl, maxBytes, options) {
  const media = await loadWebMedia(
    mediaUrl,
    buildOutboundMediaLoadOptions({
      maxBytes,
      mediaAccess: options?.mediaAccess,
      mediaLocalRoots: options?.localRoots,
      mediaReadFile: options?.readFile,
    }),
  );
  const saved = await saveMediaBuffer(
    media.buffer,
    media.contentType ?? void 0,
    "outbound",
    maxBytes,
    media.fileName,
  );
  return {
    path: saved.path,
    contentType: saved.contentType,
  };
}
/** Stages an in-memory attachment buffer into the outbound media store. */
async function resolveOutboundAttachmentFromBuffer(buffer, maxBytes, options) {
  const saved = await saveMediaBuffer(
    buffer,
    options?.contentType,
    "outbound",
    maxBytes,
    options?.filename,
  );
  return {
    path: saved.path,
    contentType: saved.contentType,
  };
}
//#endregion
export { resolveOutboundAttachmentFromUrl as n, resolveOutboundAttachmentFromBuffer as t };
