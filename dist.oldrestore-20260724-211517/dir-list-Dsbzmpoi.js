import path from "node:path";
import { i as mimeFromExtension } from "./mime-DxNHI5sD.js";
import "./number-runtime-B-n-wjMn.js";
import "./security-runtime-CraX8Pqe.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import {
  i as statRequiredDirectory,
  n as readAbsolutePath,
  r as resolveCanonicalReadPath,
  t as classifyFsSafeReadError,
} from "./path-errors-DYrTbCuE.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
//#region extensions/file-transfer/src/node-host/dir-list.ts
const DIR_LIST_DEFAULT_MAX_ENTRIES = 200;
const DIR_LIST_HARD_MAX_ENTRIES = 5e3;
function clampMaxEntries(input) {
  if (typeof input !== "number" || !Number.isFinite(input) || input <= 0)
    return DIR_LIST_DEFAULT_MAX_ENTRIES;
  return Math.min(Math.floor(input), DIR_LIST_HARD_MAX_ENTRIES);
}
function parsePageOffset(input) {
  if (typeof input !== "string") return 0;
  return parseStrictNonNegativeInteger(input) ?? 0;
}
function classifyFsError(err) {
  const safeCode = classifyFsSafeReadError(err);
  if (safeCode) return safeCode;
  const code = err?.code;
  if (code === "ENOENT") return "NOT_FOUND";
  if (code === "EACCES" || code === "EPERM") return "PERMISSION_DENIED";
  return "READ_ERROR";
}
async function handleDirList(params) {
  const requestedPath = readAbsolutePath(params.path);
  if (typeof requestedPath !== "string") return requestedPath;
  const maxEntries = clampMaxEntries(params.maxEntries);
  const offset = parsePageOffset(params.pageToken);
  const canonical = await resolveCanonicalReadPath({
    requestedPath,
    followSymlinks: params.followSymlinks === true,
    classifyError: classifyFsError,
    notFoundMessage: "path not found",
  });
  if (typeof canonical !== "string") return canonical;
  const directory = await statRequiredDirectory(canonical, classifyFsError);
  if (!directory.ok) return directory;
  let listedEntries;
  try {
    listedEntries = await (await root(canonical)).list(".", { withFileTypes: true });
  } catch (err) {
    return {
      ok: false,
      code: classifyFsError(err),
      message: `list failed: ${String(err)}`,
      canonicalPath: canonical,
    };
  }
  listedEntries.sort((a, b) => a.name.localeCompare(b.name));
  const total = listedEntries.length;
  const page = listedEntries.slice(offset, offset + maxEntries);
  const truncated = offset + maxEntries < total;
  const nextPageToken = truncated ? String(offset + maxEntries) : void 0;
  const entries = [];
  for (const entry of page) {
    const entryPath = path.join(canonical, entry.name);
    const isDir = entry.isDirectory;
    entries.push({
      name: entry.name,
      path: entryPath,
      size: isDir ? 0 : entry.size,
      mimeType: isDir ? "inode/directory" : mimeFromExtension(entry.name),
      isDir,
      mtime: entry.mtimeMs,
    });
  }
  return {
    ok: true,
    path: canonical,
    entries,
    nextPageToken,
    truncated,
  };
}
//#endregion
export { handleDirList };
