//#region packages/media-core/src/inline-image-data-url.d.ts
/** Prefix used to distinguish inline data URLs from remote/local image references. */
declare const INLINE_IMAGE_DATA_URL_PREFIX = "data:";
/** Sniffs supported inline image formats from decoded bytes. */
declare function sniffInlineImageMime(buffer: Buffer): string | undefined;
type SanitizedInlineImageBase64 = {
  mimeType: string;
  base64: string;
};
/** Canonicalizes trusted inline image base64 and rejects malformed or non-image payloads. */
declare function sanitizeInlineImageBase64(params: {
  mimeType: string;
  base64: string;
}): SanitizedInlineImageBase64 | undefined;
/**
 * Canonicalizes trusted inline image data URLs for persistence.
 * Accepts every image signature supported by `sanitizeInlineImageBase64`.
 */
declare function sanitizeInlineImageDataUrlForStorage(imageUrl: string): string | undefined;
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
declare function sanitizeInlineImageDataUrl(imageUrl: string): string | undefined;
//#endregion
export {
  sanitizeInlineImageDataUrlForStorage as a,
  sanitizeInlineImageDataUrl as i,
  SanitizedInlineImageBase64 as n,
  sniffInlineImageMime as o,
  sanitizeInlineImageBase64 as r,
  INLINE_IMAGE_DATA_URL_PREFIX as t,
};
