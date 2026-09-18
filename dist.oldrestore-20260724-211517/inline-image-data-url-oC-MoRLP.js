import { t as canonicalizeBase64 } from "./base64-hBzWwdnH.js";
//#region packages/media-core/src/inline-image-data-url.ts
/** Prefix used to distinguish inline data URLs from remote/local image references. */
const INLINE_IMAGE_DATA_URL_PREFIX = "data:";
const IMAGE_SIGNATURES = [
  {
    mime: "image/png",
    matches: (buffer) =>
      buffer.length >= 8 &&
      buffer[0] === 137 &&
      buffer[1] === 80 &&
      buffer[2] === 78 &&
      buffer[3] === 71 &&
      buffer[4] === 13 &&
      buffer[5] === 10 &&
      buffer[6] === 26 &&
      buffer[7] === 10,
  },
  {
    mime: "image/jpeg",
    matches: (buffer) =>
      buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255,
  },
  {
    mime: "image/webp",
    matches: (buffer) =>
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP",
  },
  {
    mime: "image/gif",
    matches: (buffer) =>
      buffer.length >= 6 &&
      (buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
        buffer.subarray(0, 6).toString("ascii") === "GIF89a"),
  },
  {
    mime: "image/bmp",
    matches: (buffer) => buffer.length >= 2 && buffer[0] === 66 && buffer[1] === 77,
  },
];
const HEIC_BRANDS = /* @__PURE__ */ new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heis",
  "heim",
  "hevm",
  "hevs",
]);
const HEIF_BRANDS = /* @__PURE__ */ new Set(["mif1", "msf1"]);
const IMAGE_SIGNATURE_PREFIX_BASE64_CHARS = 128;
const INLINE_IMAGE_DATA_URL_MIMES = /* @__PURE__ */ new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
function startsWithDataUrl(value) {
  return value.slice(0, 5).toLowerCase() === INLINE_IMAGE_DATA_URL_PREFIX;
}
function sniffIsoBmffImageMime(buffer) {
  if (buffer.length < 12 || buffer.subarray(4, 8).toString("ascii") !== "ftyp") return;
  const brands = [buffer.subarray(8, 12).toString("ascii")];
  for (let offset = 16; offset + 4 <= buffer.length; offset += 4)
    brands.push(buffer.subarray(offset, offset + 4).toString("ascii"));
  if (brands.some((brand) => HEIC_BRANDS.has(brand))) return "image/heic";
  if (brands.some((brand) => HEIF_BRANDS.has(brand))) return "image/heif";
}
/** Sniffs supported inline image formats from decoded bytes. */
function sniffInlineImageMime(buffer) {
  return (
    IMAGE_SIGNATURES.find((signature) => signature.matches(buffer))?.mime ??
    sniffIsoBmffImageMime(buffer)
  );
}
function isImageMimeType(value) {
  return value.trim().toLowerCase().startsWith("image/");
}
/** Canonicalizes trusted inline image base64 and rejects malformed or non-image payloads. */
function sanitizeInlineImageBase64(params) {
  if (!isImageMimeType(params.mimeType)) return;
  const canonicalPayload = canonicalizeBase64(params.base64);
  if (!canonicalPayload) return;
  const sniffedMimeType = sniffInlineImageMime(
    Buffer.from(canonicalPayload.slice(0, IMAGE_SIGNATURE_PREFIX_BASE64_CHARS), "base64"),
  );
  if (!sniffedMimeType) return;
  return {
    mimeType: sniffedMimeType,
    base64: canonicalPayload,
  };
}
function parseInlineImageDataUrl(value) {
  if (!startsWithDataUrl(value))
    return {
      metadata: [],
      payload: value,
    };
  const commaIndex = value.indexOf(",");
  if (commaIndex < 0) return;
  return {
    metadata: value
      .slice(5, commaIndex)
      .split(";")
      .map((part) => part.trim()),
    payload: value.slice(commaIndex + 1),
  };
}
function metadataAllowsImageBase64(metadata) {
  const [mimeType, ...options] = metadata;
  return (
    mimeType !== void 0 &&
    isImageMimeType(mimeType) &&
    options.some((part) => part.toLowerCase() === "base64")
  );
}
function sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, allowedMimes) {
  const parsed = parseInlineImageDataUrl(imageUrl);
  if (!parsed) return;
  if (parsed.metadata.length === 0) return imageUrl;
  if (!metadataAllowsImageBase64(parsed.metadata)) return;
  const [mimeType] = parsed.metadata;
  const sanitized = sanitizeInlineImageBase64({
    mimeType: mimeType ?? "",
    base64: parsed.payload,
  });
  if (!sanitized) return;
  if (allowedMimes && !allowedMimes.has(sanitized.mimeType)) return;
  return `data:${sanitized.mimeType};base64,${sanitized.base64}`;
}
/**
 * Canonicalizes trusted inline image data URLs for persistence.
 * Accepts every image signature supported by `sanitizeInlineImageBase64`.
 */
function sanitizeInlineImageDataUrlForStorage(imageUrl) {
  return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl);
}
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
function sanitizeInlineImageDataUrl(imageUrl) {
  return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, INLINE_IMAGE_DATA_URL_MIMES);
}
//#endregion
export {
  sniffInlineImageMime as a,
  sanitizeInlineImageDataUrlForStorage as i,
  sanitizeInlineImageBase64 as n,
  sanitizeInlineImageDataUrl as r,
  INLINE_IMAGE_DATA_URL_PREFIX as t,
};
