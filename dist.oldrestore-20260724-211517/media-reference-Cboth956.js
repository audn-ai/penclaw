import fs from "node:fs/promises";
import path from "node:path";
import "./utils-DtcDeqWS.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./local-file-access-CBe_wA_B.js";
import { x as safeFileURLToPath } from "./path-DILYn_gk.js";
import { l as resolveMediaBufferPath, s as getMediaDir } from "./store-BfbXoJVN.js";
import { t as hasHttpUrlPrefix } from "./url-protocol-oWYinajA.js";
//#region src/media/media-reference.ts
/** Error raised when a media reference cannot be mapped to an allowed local media file. */
var MediaReferenceError = class extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
    this.name = "MediaReferenceError";
  }
};
/** Strips legacy MEDIA: prefixes while preserving canonical media:// references. */
function normalizeMediaReferenceSource(source) {
  const trimmed = source.trim();
  if (/^media:\/\//i.test(trimmed)) return trimmed;
  return trimmed.replace(/^\s*MEDIA\s*:\s*/i, "").trim();
}
/** Classifies media reference schemes before local resolution or sandbox rewriting. */
function classifyMediaReferenceSource(source, options) {
  const allowDataUrl = options?.allowDataUrl ?? true;
  const looksLikeWindowsDrivePath = /^[a-zA-Z]:[\\/]/.test(source);
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(source);
  const isFileUrl = /^file:/i.test(source);
  const isHttpUrl = hasHttpUrlPrefix(source);
  const isDataUrl = /^data:/i.test(source);
  const isMediaStoreUrl = /^media:\/\//i.test(source);
  return {
    hasScheme,
    hasUnsupportedScheme:
      hasScheme &&
      !looksLikeWindowsDrivePath &&
      !isFileUrl &&
      !isHttpUrl &&
      !isMediaStoreUrl &&
      !(allowDataUrl && isDataUrl),
    isDataUrl,
    isFileUrl,
    isHttpUrl,
    isMediaStoreUrl,
    looksLikeWindowsDrivePath,
  };
}
function maybeLocalPathFromSource(source) {
  if (/^file:/i.test(source))
    try {
      return safeFileURLToPath(source);
    } catch {
      return null;
    }
  if (source.startsWith("~")) return resolveUserPath(source);
  if (path.isAbsolute(source)) return source;
  return null;
}
function relativePathEscapesBase(relativePath) {
  return (
    relativePath === ".." ||
    relativePath.startsWith("../") ||
    relativePath.startsWith("..\\") ||
    path.isAbsolute(relativePath)
  );
}
async function resolvePathForContainment(candidate) {
  try {
    return await fs.realpath(candidate);
  } catch {
    return path.resolve(candidate);
  }
}
/** Parses canonical inbound media-store URIs and rejects nested or cross-bucket references. */
function parseInboundMediaUri(source) {
  const normalizedSource = normalizeMediaReferenceSource(source);
  if (!/^media:\/\//i.test(normalizedSource)) return null;
  let parsed;
  try {
    parsed = new URL(normalizedSource);
  } catch (err) {
    throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`, {
      cause: err,
    });
  }
  if (parsed.hostname !== "inbound")
    throw new MediaReferenceError(
      "path-not-allowed",
      `Unsupported media URI location: ${parsed.hostname || "(missing)"}`,
    );
  let id;
  try {
    id = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch (err) {
    throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`, {
      cause: err,
    });
  }
  if (!id || id.includes("/") || id.includes("\\") || id.includes("\0"))
    throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`);
  return {
    id,
    normalizedSource,
  };
}
async function resolveInboundMediaUri(normalizedSource) {
  const uri = parseInboundMediaUri(normalizedSource);
  if (!uri) return null;
  return {
    ...uri,
    physicalPath: await resolveInboundMediaPath(uri.id, uri.normalizedSource),
    sourceType: "uri",
  };
}
/** Rewrites inbound media-store URIs to sandbox-relative paths for staged agent inputs. */
function resolveMediaReferenceSandboxPath(source, inboundDir = "media/inbound") {
  const normalizedSource = normalizeMediaReferenceSource(source);
  const uri = parseInboundMediaUri(normalizedSource);
  if (!uri) return { resolved: normalizedSource };
  return {
    resolved: path.posix.join(inboundDir.replace(/\\/g, "/"), uri.id),
    rewrittenFrom: uri.normalizedSource,
  };
}
/** Resolves inbound media:// URIs or first-level inbound file paths to concrete store files. */
async function resolveInboundMediaReference(source) {
  const normalizedSource = normalizeMediaReferenceSource(source);
  if (!normalizedSource) return null;
  const uriSource = await resolveInboundMediaUri(normalizedSource);
  if (uriSource) return uriSource;
  const localPath = maybeLocalPathFromSource(normalizedSource);
  if (!localPath) return null;
  const rawInboundDir = path.resolve(getMediaDir(), "inbound");
  const rawResolvedPath = path.resolve(localPath);
  const rawRel = path.relative(rawInboundDir, rawResolvedPath);
  const rel =
    rawRel && !relativePathEscapesBase(rawRel)
      ? rawRel
      : path.relative(
          await resolvePathForContainment(rawInboundDir),
          await resolvePathForContainment(localPath),
        );
  if (!rel || relativePathEscapesBase(rel) || rel.includes(path.sep)) return null;
  return {
    id: rel,
    normalizedSource,
    physicalPath: await resolveInboundMediaPath(rel, normalizedSource),
    sourceType: "path",
  };
}
/** Resolves a media reference while preserving whether it belongs to the inbound store. */
async function resolveMediaReferenceLocalPathInfo(source) {
  const normalizedSource = normalizeMediaReferenceSource(source);
  const inboundReference = await resolveInboundMediaReference(normalizedSource);
  return inboundReference
    ? {
        kind: "inbound",
        path: inboundReference.physicalPath,
      }
    : {
        kind: "local",
        path: normalizedSource,
      };
}
/** Converts inbound media references for callers that need a direct local file path. */
async function resolveMediaReferenceLocalPath(source) {
  return (await resolveMediaReferenceLocalPathInfo(source)).path;
}
async function resolveInboundMediaPath(id, source) {
  try {
    return await resolveMediaBufferPath(id, "inbound");
  } catch (err) {
    throw new MediaReferenceError(
      "invalid-path",
      err instanceof Error ? err.message : `Invalid media reference: ${source}`,
      { cause: err },
    );
  }
}
//#endregion
export {
  resolveInboundMediaReference as a,
  resolveMediaReferenceSandboxPath as c,
  parseInboundMediaUri as i,
  classifyMediaReferenceSource as n,
  resolveMediaReferenceLocalPath as o,
  normalizeMediaReferenceSource as r,
  resolveMediaReferenceLocalPathInfo as s,
  MediaReferenceError as t,
};
