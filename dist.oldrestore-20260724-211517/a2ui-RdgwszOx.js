import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  a as isA2uiPath,
  i as injectCanvasRuntime,
  t as A2UI_PATH,
} from "./a2ui-shared-CYxiODnT.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./media-mime-B8w43n5Y.js";
import { n as detectMime } from "./mime-BSEMEb3s.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { r as lowercasePreservingWhitespace } from "./string-coerce-DW4mBlAt.js";
//#region extensions/canvas/src/host/file-resolver.ts
/**
 * Safe file resolution helpers for Canvas-hosted static assets.
 */
/** Normalizes a decoded URL path into a leading-slash POSIX path. */
function normalizeUrlPath(rawPath) {
  const decoded = decodeURIComponent(rawPath || "/");
  const normalized = path.posix.normalize(decoded);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
function pathEscapesRoot(decodedPath) {
  let depth = 0;
  for (const segment of decodedPath.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      if (depth === 0) return true;
      depth--;
      continue;
    }
    depth++;
  }
  return false;
}
function tryNormalizeUrlPath(rawPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath || "/");
  } catch {
    return null;
  }
  if (pathEscapesRoot(decoded)) return null;
  const normalized = path.posix.normalize(decoded);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
/** Opens a Canvas-hosted file only when the request stays inside the root. */
async function resolveFileWithinRoot(rootReal, urlPath) {
  const normalized = tryNormalizeUrlPath(urlPath);
  if (normalized === null) return null;
  const rel = normalized.replace(/^\/+/, "");
  if (rel.split("/").some((p) => p === "..")) return null;
  const root$1 = await root(rootReal);
  const tryOpen = async (relative) => {
    try {
      return await root$1.open(relative);
    } catch (err) {
      if (err instanceof FsSafeError) return null;
      throw err;
    }
  };
  if (normalized.endsWith("/")) return await tryOpen(path.posix.join(rel, "index.html"));
  try {
    const st = await root$1.stat(rel);
    if (st.isSymbolicLink) return null;
    if (st.isDirectory) return await tryOpen(path.posix.join(rel, "index.html"));
  } catch (err) {
    if (err instanceof FsSafeError) return null;
    throw err;
  }
  return await tryOpen(rel);
}
//#endregion
//#region extensions/canvas/src/host/a2ui.ts
/**
 * HTTP handler for serving bundled A2UI assets through Canvas host routes.
 */
let cachedA2uiRootReal;
let resolvingA2uiRoot = null;
let cachedA2uiResolvedAtMs = 0;
const A2UI_ROOT_RETRY_NULL_AFTER_MS = 1e4;
async function resolveA2uiRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const entryDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : null;
  const candidates = [
    path.resolve(here, "a2ui"),
    path.resolve(here, "canvas-host/a2ui"),
    ...(entryDir
      ? [path.resolve(entryDir, "a2ui"), path.resolve(entryDir, "canvas-host/a2ui")]
      : []),
    path.resolve(here, "../../extensions/canvas/src/host/a2ui"),
    path.resolve(here, "../extensions/canvas/src/host/a2ui"),
    path.resolve(process.cwd(), "extensions/canvas/src/host/a2ui"),
    path.resolve(process.cwd(), "dist/canvas-host/a2ui"),
  ];
  if (process.execPath) candidates.unshift(path.resolve(path.dirname(process.execPath), "a2ui"));
  for (const dir of candidates)
    try {
      const indexPath = path.join(dir, "index.html");
      const bundlePath = path.join(dir, "a2ui.bundle.js");
      await fs.stat(indexPath);
      await fs.stat(bundlePath);
      return dir;
    } catch {}
  return null;
}
async function resolveA2uiRootReal() {
  if (
    cachedA2uiRootReal !== void 0 &&
    (cachedA2uiRootReal !== null ||
      Date.now() - cachedA2uiResolvedAtMs < A2UI_ROOT_RETRY_NULL_AFTER_MS)
  )
    return cachedA2uiRootReal;
  if (!resolvingA2uiRoot)
    resolvingA2uiRoot = (async () => {
      const root = await resolveA2uiRoot();
      cachedA2uiRootReal = root ? await fs.realpath(root) : null;
      cachedA2uiResolvedAtMs = Date.now();
      resolvingA2uiRoot = null;
      return cachedA2uiRootReal;
    })();
  return resolvingA2uiRoot;
}
async function handleA2uiHttpRequestWithRootResolver(req, res, resolveRootReal, options) {
  const urlRaw = req.url;
  if (!urlRaw) return false;
  const url = new URL(urlRaw, "http://localhost");
  const basePath = isA2uiPath(url.pathname) ? A2UI_PATH : void 0;
  if (!basePath) return false;
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Method Not Allowed");
    return true;
  }
  const a2uiRootReal = await resolveRootReal();
  if (!a2uiRootReal) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("A2UI assets not found");
    return true;
  }
  const result = await resolveFileWithinRoot(
    a2uiRootReal,
    url.pathname.slice(basePath.length) || "/",
  );
  if (!result) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("not found");
    return true;
  }
  try {
    const lower = lowercasePreservingWhitespace(result.realPath);
    const mime =
      lower.endsWith(".html") || lower.endsWith(".htm")
        ? "text/html"
        : ((await detectMime({ filePath: result.realPath })) ?? "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "HEAD") {
      res.setHeader("Content-Type", mime === "text/html" ? "text/html; charset=utf-8" : mime);
      res.end();
      return true;
    }
    if (mime === "text/html") {
      const buf = await result.handle.readFile({ encoding: "utf8" });
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(injectCanvasRuntime(buf, options));
      return true;
    }
    res.setHeader("Content-Type", mime);
    res.end(await result.handle.readFile());
    return true;
  } finally {
    await result.handle.close().catch(() => {});
  }
}
/** Handles one HTTP request for the hosted A2UI asset surface. */
async function handleA2uiHttpRequest(req, res, options = {}) {
  return await handleA2uiHttpRequestWithRootResolver(req, res, resolveA2uiRootReal, options);
}
//#endregion
export { normalizeUrlPath as n, resolveFileWithinRoot as r, handleA2uiHttpRequest as t };
