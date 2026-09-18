import fs from "node:fs/promises";
import path from "node:path";
import "./security-runtime-CraX8Pqe.js";
import { C as resolveAbsolutePathForRead } from "./fs-safe-RNq3oO57.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
//#region extensions/file-transfer/src/node-host/path-errors.ts
const SYMLINK_REJECTED_MESSAGE =
  "path traverses a symlink; refusing because followSymlinks=false (set plugins.entries.file-transfer.config.nodes.<node>.followSymlinks=true to allow, or update allowReadPaths to the canonical path)";
function classifyFsSafeReadError(err) {
  if (!(err instanceof FsSafeError)) return;
  if (err.code === "not-found") return "NOT_FOUND";
  if (err.code === "symlink") return "SYMLINK_REDIRECT";
  if (err.code === "invalid-path") return "INVALID_PATH";
}
function readAbsolutePath(input) {
  if (typeof input !== "string" || input.length === 0)
    return {
      ok: false,
      code: "INVALID_PATH",
      message: "path required",
    };
  if (input.includes("\0"))
    return {
      ok: false,
      code: "INVALID_PATH",
      message: "path contains NUL byte",
    };
  if (!path.isAbsolute(input))
    return {
      ok: false,
      code: "INVALID_PATH",
      message: "path must be absolute",
    };
  return input;
}
function canonicalPathFromFsSafeError(err) {
  if (!(err instanceof FsSafeError) || !err.cause || typeof err.cause !== "object") return;
  return "canonicalPath" in err.cause && typeof err.cause.canonicalPath === "string"
    ? err.cause.canonicalPath
    : void 0;
}
async function resolveCanonicalReadPath(input) {
  try {
    return (
      await resolveAbsolutePathForRead(input.requestedPath, {
        symlinks: input.followSymlinks ? "follow" : "reject",
      })
    ).canonicalPath;
  } catch (err) {
    const code = input.classifyError(err);
    const canonicalPath = canonicalPathFromFsSafeError(err);
    return {
      ok: false,
      code,
      message:
        code === "NOT_FOUND"
          ? input.notFoundMessage
          : code === "SYMLINK_REDIRECT"
            ? SYMLINK_REJECTED_MESSAGE
            : `realpath failed: ${String(err)}`,
      ...(canonicalPath ? { canonicalPath } : {}),
    };
  }
}
async function statRequiredDirectory(canonicalPath, classifyError) {
  let stats;
  try {
    stats = await fs.stat(canonicalPath);
  } catch (err) {
    return {
      ok: false,
      code: classifyError(err),
      message: `stat failed: ${String(err)}`,
      canonicalPath,
    };
  }
  if (!stats.isDirectory())
    return {
      ok: false,
      code: "IS_FILE",
      message: "path is not a directory",
      canonicalPath,
    };
  return { ok: true };
}
//#endregion
export {
  statRequiredDirectory as i,
  readAbsolutePath as n,
  resolveCanonicalReadPath as r,
  classifyFsSafeReadError as t,
};
