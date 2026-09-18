import crypto from "node:crypto";
import "../../api-F1ZU389I.js";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/diffs-language-pack/src/viewer-assets.ts
const VIEWER_ASSET_PREFIX = "/plugins/diffs-language-pack/assets/";
const VIEWER_LOADER_PATH = `${VIEWER_ASSET_PREFIX}viewer.js`;
const VIEWER_RUNTIME_PATH = `${VIEWER_ASSET_PREFIX}viewer-runtime.js`;
const VIEWER_RUNTIME_RELATIVE_IMPORT_PATH = "./viewer-runtime.js";
const VIEWER_RUNTIME_CANDIDATE_RELATIVE_PATHS = [
  "./assets/viewer-runtime.js",
  "../assets/viewer-runtime.js",
];
let runtimeAssetCache = null;
function isMissingFileError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
async function resolveViewerRuntimeFileUrl() {
  let missingFileError = null;
  for (const relativePath of VIEWER_RUNTIME_CANDIDATE_RELATIVE_PATHS) {
    const candidateUrl = new URL(relativePath, import.meta.url);
    try {
      await fs.stat(fileURLToPath(candidateUrl));
      return candidateUrl;
    } catch (error) {
      if (isMissingFileError(error)) {
        missingFileError = error;
        continue;
      }
      throw error;
    }
  }
  if (missingFileError) throw missingFileError;
  throw new Error("viewer runtime asset candidates were not checked");
}
async function getServedViewerAsset(pathname) {
  if (pathname !== VIEWER_LOADER_PATH && pathname !== VIEWER_RUNTIME_PATH) return null;
  const assets = await loadViewerAssets();
  if (pathname === VIEWER_LOADER_PATH)
    return {
      body: assets.loaderBody,
      contentType: "text/javascript; charset=utf-8",
    };
  return {
    body: assets.runtimeBody,
    contentType: "text/javascript; charset=utf-8",
  };
}
async function loadViewerAssets() {
  const runtimePath = fileURLToPath(await resolveViewerRuntimeFileUrl());
  const runtimeStat = await fs.stat(runtimePath);
  if (runtimeAssetCache && runtimeAssetCache.mtimeMs === runtimeStat.mtimeMs)
    return runtimeAssetCache;
  const runtimeBody = await fs.readFile(runtimePath);
  const hash = crypto.createHash("sha1").update(runtimeBody).digest("hex").slice(0, 12);
  runtimeAssetCache = {
    mtimeMs: runtimeStat.mtimeMs,
    runtimeBody,
    loaderBody: `import "${VIEWER_RUNTIME_RELATIVE_IMPORT_PATH}?v=${hash}";\n`,
  };
  return runtimeAssetCache;
}
//#endregion
//#region extensions/diffs-language-pack/src/plugin.ts
const IMMUTABLE_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";
function registerDiffsLanguagePackPlugin(api) {
  api.registerHttpRoute({
    path: "/plugins/diffs-language-pack",
    auth: "plugin",
    match: "prefix",
    handler: createDiffsLanguagePackHttpHandler(),
  });
}
function createDiffsLanguagePackHttpHandler() {
  return async (req, res) => {
    const parsed = parseRequestUrl(req.url);
    if (!parsed?.pathname.startsWith("/plugins/diffs-language-pack/assets/")) return false;
    if (req.method !== "GET" && req.method !== "HEAD") {
      respondText(res, 405, "Method not allowed");
      return true;
    }
    const asset = await getServedViewerAsset(parsed.pathname);
    if (!asset) {
      respondText(res, 404, "Asset not found");
      return true;
    }
    res.statusCode = 200;
    setSharedHeaders(
      res,
      asset.contentType,
      parsed.pathname === VIEWER_RUNTIME_PATH ? IMMUTABLE_ASSET_CACHE_CONTROL : void 0,
    );
    if (req.method === "HEAD") res.end();
    else res.end(asset.body);
    return true;
  };
}
function parseRequestUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl, "http://127.0.0.1");
  } catch {
    return null;
  }
}
function respondText(res, statusCode, body) {
  res.statusCode = statusCode;
  setSharedHeaders(res, "text/plain; charset=utf-8");
  res.end(body);
}
function setSharedHeaders(res, contentType, cacheControl = "no-store, max-age=0") {
  res.setHeader("cache-control", cacheControl);
  res.setHeader("content-type", contentType);
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("referrer-policy", "no-referrer");
}
//#endregion
//#region extensions/diffs-language-pack/index.ts
var diffs_language_pack_default = definePluginEntry({
  id: "diffs-language-pack",
  name: "Diff Viewer Language Pack",
  description: "Adds syntax highlighting for languages outside the default diffs viewer set.",
  register: registerDiffsLanguagePackPlugin,
});
//#endregion
export { diffs_language_pack_default as default };
