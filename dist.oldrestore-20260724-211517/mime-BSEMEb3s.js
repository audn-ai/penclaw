import path from "node:path";
import { o as mediaKindFromMime } from "./constants-Mf57IYS0.js";
import { n as extnameFromAnyPath } from "./file-name-D1nUHSBH.js";
//#region packages/media-core/src/mime.ts
/** Maximum byte prefix passed to dependency MIME sniffers for bounded memory/CPU work. */
const FILE_TYPE_SNIFF_MAX_BYTES = 1024 * 1024;
const EXT_BY_MIME = {
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/bmp": ".bmp",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/ogg": ".ogg",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/wave": ".wav",
  "audio/x-wav": ".wav",
  "audio/flac": ".flac",
  "audio/aac": ".aac",
  "audio/opus": ".opus",
  "audio/webm": ".webm",
  "audio/x-m4a": ".m4a",
  "audio/mp4": ".m4a",
  "audio/x-caf": ".caf",
  "video/x-msvideo": ".avi",
  "video/mp4": ".mp4",
  "video/x-matroska": ".mkv",
  "video/webm": ".webm",
  "video/x-flv": ".flv",
  "video/x-ms-wmv": ".wmv",
  "video/quicktime": ".mov",
  "application/pdf": ".pdf",
  "application/json": ".json",
  "application/yaml": ".yaml",
  "application/zip": ".zip",
  "application/gzip": ".gz",
  "application/x-tar": ".tar",
  "application/x-7z-compressed": ".7z",
  "application/vnd.rar": ".rar",
  "application/msword": ".doc",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "text/csv": ".csv",
  "text/plain": ".txt",
  "text/markdown": ".md",
  "text/html": ".html",
  "text/xml": ".xml",
  "text/css": ".css",
  "application/xml": ".xml",
};
function buildMimeByExt() {
  const byExt = {};
  for (const [mime, ext] of Object.entries(EXT_BY_MIME)) byExt[ext] ??= mime;
  return byExt;
}
const MIME_BY_EXT = {
  ...buildMimeByExt(),
  ".jpg": "image/jpeg",
  ".m2a": "audio/mpeg",
  ".mp3": "audio/mpeg",
  ".oga": "audio/ogg",
  ".wav": "audio/wav",
  ".webm": "video/webm",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript",
  ".log": "text/plain",
  ".htm": "text/html",
  ".xml": "text/xml",
  ".yml": "application/yaml",
};
/** Normalizes MIME strings by dropping parameters, lowercasing, and folding APNG to PNG. */
function normalizeMimeType(mime) {
  if (!mime) return;
  const cleaned = mime.split(";")[0]?.trim().toLowerCase();
  if (cleaned === "image/apng") return "image/png";
  return cleaned || void 0;
}
/** Returns the bounded buffer prefix used for dependency MIME sniffing. */
function sliceMimeSniffBuffer(buffer) {
  if (buffer.byteLength <= 1048576) return buffer;
  return buffer.subarray(0, FILE_TYPE_SNIFF_MAX_BYTES);
}
async function sniffMime(buffer) {
  if (!buffer) return;
  try {
    const { fileTypeFromBuffer } = await import("file-type");
    const type = await fileTypeFromBuffer(sliceMimeSniffBuffer(buffer));
    if (type?.mime) return normalizeMimeType(type.mime);
  } catch {}
  return buffer.toString("ascii", 0, 4) === "caff" ? "audio/x-caf" : void 0;
}
/** Extracts a lowercase extension from a local path or HTTP URL pathname. */
function getFileExtension(filePath) {
  if (!filePath) return;
  try {
    if (/^https?:\/\//i.test(filePath)) {
      const url = new URL(filePath);
      let filename = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
      try {
        const decodable = filename.replace(/%2f/gi, "%252F").replace(/%5c/gi, "%255C");
        filename = decodeURIComponent(decodable);
      } catch {}
      return path.posix.extname(filename).toLowerCase() || void 0;
    }
  } catch {}
  return extnameFromAnyPath(filePath).toLowerCase() || void 0;
}
/** Maps a file path or URL extension to the preferred MIME type when known. */
function mimeTypeFromFilePath(filePath) {
  const ext = getFileExtension(filePath);
  if (!ext) return;
  return MIME_BY_EXT[ext];
}
/** Returns true when a filename extension is a supported audio container. */
function isAudioFileName(fileName) {
  return mediaKindFromMime(mimeTypeFromFilePath(fileName)) === "audio";
}
/** Detects the best MIME type from bytes, file path, and header metadata. */
function detectMime(opts) {
  return detectMimeImpl(opts);
}
function isGenericMime(mime) {
  if (!mime) return true;
  const m = mime.toLowerCase();
  return m === "application/octet-stream" || m === "application/zip";
}
function isImageMime(mime) {
  return mediaKindFromMime(normalizeMimeType(mime)) === "image";
}
async function detectMimeImpl(opts) {
  const ext = getFileExtension(opts.filePath);
  const extMime = ext ? MIME_BY_EXT[ext] : void 0;
  const headerMime = normalizeMimeType(opts.headerMime);
  const sniffed = await sniffMime(opts.buffer);
  const sniffedGenericContainer = sniffed && isGenericMime(sniffed);
  const trustedExtMime = sniffedGenericContainer && isImageMime(extMime) ? void 0 : extMime;
  const trustedHeaderMime =
    sniffedGenericContainer && isImageMime(headerMime) ? void 0 : headerMime;
  if (sniffed && (!isGenericMime(sniffed) || !trustedExtMime)) return sniffed;
  if (trustedExtMime) return trustedExtMime;
  if (trustedHeaderMime && !isGenericMime(trustedHeaderMime)) return trustedHeaderMime;
  if (sniffed) return sniffed;
  if (trustedHeaderMime) return trustedHeaderMime;
}
/** Returns the preferred file extension for a normalized or raw MIME string. */
function extensionForMime(mime) {
  const normalized = normalizeMimeType(mime);
  if (!normalized) return;
  return EXT_BY_MIME[normalized];
}
/** Returns true when content type or filename identifies GIF media. */
function isGifMedia(opts) {
  if (normalizeMimeType(opts.contentType) === "image/gif") return true;
  return getFileExtension(opts.fileName) === ".gif";
}
/** Maps image format labels from encoders/probes to MIME types. */
function imageMimeFromFormat(format) {
  if (!format) return;
  switch (format.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return;
  }
}
/** Normalizes a MIME string before classifying it into a media family. */
function kindFromMime(mime) {
  return mediaKindFromMime(normalizeMimeType(mime));
}
//#endregion
export {
  imageMimeFromFormat as a,
  kindFromMime as c,
  sliceMimeSniffBuffer as d,
  getFileExtension as i,
  mimeTypeFromFilePath as l,
  detectMime as n,
  isAudioFileName as o,
  extensionForMime as r,
  isGifMedia as s,
  FILE_TYPE_SNIFF_MAX_BYTES as t,
  normalizeMimeType as u,
};
