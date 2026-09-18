import path from "node:path";
import { i as isPathInside } from "./path-DILYn_gk.js";
import "./path-guards-CBe_wA_B.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/shared/avatar-limits.ts
/** Maximum avatar payload size accepted by local file and Gateway upload paths. */
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
/** Maximum encoded length of a supported local avatar at AVATAR_MAX_BYTES. */
const AVATAR_MAX_DATA_URL_CHARS = Math.ceil(AVATAR_MAX_BYTES / 3) * 4 + 26;
const AVATAR_IMAGE_DATA_URL_RE = /^data:image\//i;
/** Accepts image data URLs that fit the Gateway and Control UI payload boundary. */
function isRenderableAvatarImageDataUrl(value) {
  return value.length <= AVATAR_MAX_DATA_URL_CHARS && AVATAR_IMAGE_DATA_URL_RE.test(value);
}
//#endregion
//#region src/shared/avatar-policy.ts
/**
 * Shared avatar source policy for config validation, agent identity loading,
 * gateway uploads, and Control UI rendering hints.
 */
const LOCAL_AVATAR_EXTENSIONS = /* @__PURE__ */ new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
]);
/** MIME hints for known image extensions, including formats not accepted for local serving. */
const AVATAR_MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
};
/** Detects data URLs before image-specific avatar validation. */
const AVATAR_DATA_RE = /^data:/i;
/** Detects remote avatar URLs served over HTTP(S). */
const AVATAR_HTTP_RE = /^https?:\/\//i;
/** Detects URI schemes so non-path avatar values can be rejected or routed. */
const AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
/** Detects Windows absolute paths before URI-scheme classification. */
const WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;
const AVATAR_PATH_EXT_RE = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
/** Resolves a local avatar file MIME type from its extension. */
function resolveAvatarMime(filePath) {
  const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
  return AVATAR_MIME_BY_EXT[ext] ?? "application/octet-stream";
}
/** Detects any data URL value before image-specific validation. */
function isAvatarDataUrl(value) {
  return AVATAR_DATA_RE.test(value);
}
/** Detects remote HTTP(S) avatar URLs. */
function isAvatarHttpUrl(value) {
  return AVATAR_HTTP_RE.test(value);
}
/** Detects URI-scheme-like avatar values, including non-HTTP schemes. */
function hasAvatarUriScheme(value) {
  return AVATAR_SCHEME_RE.test(value);
}
/** Detects Windows absolute paths so they are not mistaken for URI schemes. */
function isWindowsAbsolutePath(value) {
  return WINDOWS_ABS_RE.test(value);
}
/** Checks that a resolved avatar path remains inside its configured root. */
function isPathWithinRoot(rootDir, targetPath) {
  return isPathInside(rootDir, targetPath);
}
/** Heuristically detects strings that look like local avatar file paths. */
function looksLikeAvatarPath(value) {
  if (/[\\/]/.test(value)) return true;
  return AVATAR_PATH_EXT_RE.test(value);
}
/** Restricts local avatar files to image extensions that can be safely served inline. */
function isSupportedLocalAvatarExtension(filePath) {
  const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
  return LOCAL_AVATAR_EXTENSIONS.has(ext);
}
//#endregion
export {
  isSupportedLocalAvatarExtension as a,
  resolveAvatarMime as c,
  isRenderableAvatarImageDataUrl as d,
  isPathWithinRoot as i,
  AVATAR_MAX_BYTES as l,
  isAvatarDataUrl as n,
  isWindowsAbsolutePath as o,
  isAvatarHttpUrl as r,
  looksLikeAvatarPath as s,
  hasAvatarUriScheme as t,
  AVATAR_MAX_DATA_URL_CHARS as u,
};
