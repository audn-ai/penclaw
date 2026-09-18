import crypto from "node:crypto";
import path from "node:path";
import "./security-runtime-CraX8Pqe.js";
import "./process-runtime-BKNTr1ic.js";
import { t as runCommandBuffered } from "./exec-CXKmx4dL.js";
import {
  i as statRequiredDirectory,
  n as readAbsolutePath,
  r as resolveCanonicalReadPath,
  t as classifyFsSafeReadError,
} from "./path-errors-DYrTbCuE.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
//#region extensions/file-transfer/src/node-host/dir-fetch.ts
const DIR_FETCH_HARD_MAX_BYTES = 16 * 1024 * 1024;
const DIR_FETCH_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
function clampMaxBytes(input) {
  if (typeof input !== "number" || !Number.isFinite(input) || input <= 0)
    return DIR_FETCH_DEFAULT_MAX_BYTES;
  return Math.min(Math.floor(input), DIR_FETCH_HARD_MAX_BYTES);
}
function classifyFsError(err) {
  const safeCode = classifyFsSafeReadError(err);
  if (safeCode) return safeCode;
  if (err?.code === "ENOENT") return "NOT_FOUND";
  return "READ_ERROR";
}
async function preflightDu(dirPath, maxBytes) {
  const heuristicKb = Math.ceil((maxBytes * 4) / 1024);
  const result = await runCommandBuffered(["du", "-sk", dirPath], {
    discardOutput: { stderr: true },
    maxOutputBytes: 64 * 1024,
    timeoutMs: 1e4,
  }).catch(() => null);
  if (!result || result.termination !== "exit" || result.code !== 0) return true;
  const match = /^(\d+)/.exec(result.stdout.toString("utf8").trim());
  return match ? Number.parseInt(match[0], 10) <= heuristicKb : true;
}
async function listTarEntries(tarBuffer) {
  const result = await runCommandBuffered(["tar", "-tzf", "-"], {
    discardOutput: { stderr: true },
    input: tarBuffer,
    maxOutputBytes: {
      stdout: 32 * 1024 * 1024,
      stderr: 64 * 1024,
    },
    timeoutMs: 1e4,
  }).catch(() => null);
  if (!result || result.termination !== "exit" || result.code !== 0) return null;
  return result.stdout
    .toString("utf8")
    .split("\n")
    .map((line) => line.replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/\/$/u, ""))
    .filter((line) => line.length > 0);
}
async function createTarArchive(canonicalPath, maxBytes) {
  const tarBin = process.platform !== "win32" ? "/usr/bin/tar" : "tar";
  const tarArgs = ["-czf", "-", "-C", canonicalPath, "."];
  const timeoutMs = 6e4;
  const result = await runCommandBuffered([tarBin, ...tarArgs], {
    discardOutput: { stderr: true },
    maxOutputBytes: {
      stdout: maxBytes,
      stderr: 64 * 1024,
    },
    timeoutMs,
  }).catch(() => null);
  if (!result) return "ERROR";
  if (result.termination === "timeout") return "TIMEOUT";
  if (result.termination === "output-limit" && result.outputLimitStream === "stdout")
    return "TOO_LARGE";
  return result.termination === "exit" && result.code === 0 ? result.stdout : "ERROR";
}
async function listTreeEntries(root$1, maxEntries) {
  const results = [];
  const rootHandle = await root(root$1);
  async function visit(relativeDir) {
    const entries = await rootHandle.list(relativeDir, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const rel = path.posix.join(relativeDir === "." ? "" : relativeDir, entry.name);
      results.push(rel);
      if (results.length > maxEntries) return false;
      if (entry.isDirectory) {
        if (!(await visit(rel))) return false;
      }
    }
    return true;
  }
  return (await visit(".")) ? results : "TOO_MANY";
}
async function handleDirFetch(params) {
  const requestedPath = readAbsolutePath(params.path);
  if (typeof requestedPath !== "string") return requestedPath;
  const maxBytes = clampMaxBytes(params.maxBytes);
  params.includeDotfiles;
  const followSymlinks = params.followSymlinks === true;
  const preflightOnly = params.preflightOnly === true;
  const canonical = await resolveCanonicalReadPath({
    requestedPath,
    followSymlinks,
    classifyError: classifyFsError,
    notFoundMessage: "directory not found",
  });
  if (typeof canonical !== "string") return canonical;
  const directory = await statRequiredDirectory(canonical, classifyFsError);
  if (!directory.ok) return directory;
  if (preflightOnly)
    try {
      const entries = await listTreeEntries(canonical, 5e3);
      if (entries === "TOO_MANY")
        return {
          ok: false,
          code: "TREE_TOO_LARGE",
          message: "directory tree exceeds 5000 entries during preflight",
          canonicalPath: canonical,
        };
      return {
        ok: true,
        path: canonical,
        tarBase64: "",
        tarBytes: 0,
        sha256: "",
        fileCount: entries.length,
        entries,
        preflightOnly: true,
      };
    } catch (err) {
      return {
        ok: false,
        code: classifyFsError(err),
        message: `preflight readdir failed: ${String(err)}`,
        canonicalPath: canonical,
      };
    }
  if (!(await preflightDu(canonical, maxBytes)))
    return {
      ok: false,
      code: "TREE_TOO_LARGE",
      message: `directory tree exceeds estimated size limit (${maxBytes} bytes raw)`,
      canonicalPath: canonical,
    };
  const tarBuffer = await createTarArchive(canonical, maxBytes);
  if (tarBuffer === "TOO_LARGE")
    return {
      ok: false,
      code: "TREE_TOO_LARGE",
      message: `tarball exceeded ${maxBytes} byte limit mid-stream`,
      canonicalPath: canonical,
    };
  if (tarBuffer === "TIMEOUT")
    return {
      ok: false,
      code: "READ_ERROR",
      message: "tar command exceeded 60s wall-clock timeout (slow filesystem or symlink loop?)",
      canonicalPath: canonical,
    };
  if (tarBuffer === "ERROR")
    return {
      ok: false,
      code: "READ_ERROR",
      message: "tar command failed",
      canonicalPath: canonical,
    };
  const sha256 = crypto.createHash("sha256").update(tarBuffer).digest("hex");
  const tarBase64 = tarBuffer.toString("base64");
  const tarBytes = tarBuffer.byteLength;
  const entries = await listTarEntries(tarBuffer);
  if (entries === null)
    return {
      ok: false,
      code: "READ_ERROR",
      message: "tar entry listing failed",
      canonicalPath: canonical,
    };
  return {
    ok: true,
    path: canonical,
    tarBase64,
    tarBytes,
    sha256,
    fileCount: entries.length,
    entries,
  };
}
//#endregion
export { handleDirFetch };
