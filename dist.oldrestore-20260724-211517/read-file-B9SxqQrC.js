import fs from "node:fs/promises";
import path from "node:path";
import {
  i as resolveMemoryHostSearchPathConfig,
  n as resolveMemoryHostAgentContextLimits,
  r as resolveMemoryHostAgentWorkspaceDir,
} from "./config-utils-CrO_J2Yw.js";
import { t as isFileMissingError } from "./fs-utils-urkAyyL8.js";
import { r as retryTransientMemoryRead } from "./hash-DsDOoPhE.js";
import { c as normalizeExtraMemoryPaths, o as isMemoryPath } from "./internal-Dd4OzKYD.js";
import { a as isPathInsideWithRealpath, i as isPathInside } from "./path-DILYn_gk.js";
import { o as statRegularFile, r as readRegularFile } from "./regular-file-CuvhUtZS.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { t as assertNoSymlinkParents } from "./symlink-parents-D3bl9xr3.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region packages/memory-host-sdk/src/host/read-file-shared.ts
/** Default number of lines returned by memory read helpers. */
const DEFAULT_MEMORY_READ_LINES = 120;
/** Default max character budget for memory read helper output. */
const DEFAULT_MEMORY_READ_MAX_CHARS = 12e3;
/** Build the continuation notice appended to truncated memory excerpts. */
function buildContinuationNotice(params) {
  const base =
    typeof params.nextFrom === "number"
      ? `[More content available. Use from=${params.nextFrom} to continue.]`
      : "[More content available. Requested excerpt exceeded the default maxChars budget.]";
  const fallback = params.suggestReadFallback
    ? " If you need the full raw line, use read on the source file."
    : "";
  return `\n\n${base.slice(0, -1)}${fallback}]`;
}
/** Fit line slices to the response character budget while preserving line boundaries. */
function fitLinesToCharBudget(params) {
  const { lines, maxChars } = params;
  if (lines.length === 0)
    return {
      text: "",
      includedLines: 0,
      hardTruncatedSingleLine: false,
    };
  let includedLines = lines.length;
  let text = lines.join("\n");
  while (includedLines > 1 && text.length > maxChars) {
    includedLines -= 1;
    text = lines.slice(0, includedLines).join("\n");
  }
  if (text.length <= maxChars)
    return {
      text,
      includedLines,
      hardTruncatedSingleLine: false,
    };
  return {
    text: truncateUtf16Safe(text, maxChars),
    includedLines: 1,
    hardTruncatedSingleLine: true,
  };
}
/** Normalize optional numeric config to a positive integer fallback. */
function normalizePositiveInteger(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.floor(value))
    : fallback;
}
/** Build a memory read result from an already-selected line slice. */
function buildMemoryReadResultFromSlice(params) {
  const start = normalizePositiveInteger(params.startLine, 1);
  const fitted = fitLinesToCharBudget({
    lines: params.selectedLines,
    maxChars: normalizePositiveInteger(params.maxChars, DEFAULT_MEMORY_READ_MAX_CHARS),
  });
  const moreSourceLinesRemain = params.moreSourceLinesRemain ?? false;
  const charCapTruncated =
    fitted.hardTruncatedSingleLine || fitted.includedLines < params.selectedLines.length;
  const nextFrom =
    !fitted.hardTruncatedSingleLine &&
    (moreSourceLinesRemain || fitted.includedLines < params.selectedLines.length)
      ? start + fitted.includedLines
      : void 0;
  const truncated = charCapTruncated || moreSourceLinesRemain;
  return {
    text:
      truncated && (fitted.text || fitted.hardTruncatedSingleLine)
        ? `${fitted.text}${buildContinuationNotice({
            nextFrom,
            suggestReadFallback: fitted.hardTruncatedSingleLine && params.suggestReadFallback,
          })}`
        : fitted.text,
    path: params.relPath,
    from: start,
    lines: fitted.includedLines,
    ...(truncated ? { truncated: true } : {}),
    ...(typeof nextFrom === "number" ? { nextFrom } : {}),
  };
}
/** Build a memory read result from raw file content and caller range options. */
function buildMemoryReadResult(params) {
  const fileLines = params.content.split("\n");
  const start = normalizePositiveInteger(params.from, 1);
  const requestedCount = normalizePositiveInteger(params.lines ?? params.defaultLines, 120);
  const selectedLines = fileLines.slice(start - 1, start - 1 + requestedCount);
  const moreSourceLinesRemain = start - 1 + selectedLines.length < fileLines.length;
  return buildMemoryReadResultFromSlice({
    selectedLines,
    relPath: params.relPath,
    startLine: start,
    moreSourceLinesRemain,
    maxChars: params.maxChars,
    suggestReadFallback: params.suggestReadFallback,
  });
}
//#endregion
//#region packages/memory-host-sdk/src/host/read-file.ts
/** Check that an absolute path stays inside an allowed extra directory without symlink escapes. */
async function isAllowedAdditionalDirectoryPath(additionalPath, absPath) {
  if (!isPathInside(additionalPath, absPath)) return false;
  try {
    await assertNoSymlinkParents({
      rootDir: additionalPath,
      targetPath: absPath,
    });
  } catch {
    return false;
  }
  if (!isPathInsideWithRealpath(additionalPath, absPath)) {
    try {
      await fs.lstat(absPath);
    } catch (err) {
      return isFileMissingError(err);
    }
    return false;
  }
  return true;
}
/** Return true when a file vanished after path validation but before content read. */
function isFileDisappearedDuringReadError(err) {
  return (
    isFileMissingError(err) ||
    Boolean(err && typeof err === "object" && "code" in err && err.code === "path-mismatch")
  );
}
/** Read a validated memory markdown file from workspace or configured extra paths. */
async function readMemoryFile(params) {
  const rawPath = params.relPath.trim();
  if (!rawPath) throw new Error("path required");
  const absPath = path.isAbsolute(rawPath)
    ? path.resolve(rawPath)
    : path.resolve(params.workspaceDir, rawPath);
  const relPath = path.relative(params.workspaceDir, absPath).replace(/\\/g, "/");
  const allowedWorkspace =
    relPath.length > 0 &&
    !relPath.startsWith("..") &&
    !path.isAbsolute(relPath) &&
    isMemoryPath(relPath);
  let allowedAdditional = false;
  if (!allowedWorkspace && (params.extraPaths?.length ?? 0) > 0) {
    const additionalPaths = normalizeExtraMemoryPaths(params.workspaceDir, params.extraPaths);
    for (const additionalPath of additionalPaths)
      try {
        const stat = await fs.lstat(additionalPath);
        if (stat.isSymbolicLink()) continue;
        if (stat.isDirectory()) {
          if (await isAllowedAdditionalDirectoryPath(additionalPath, absPath)) {
            if ((await fs.lstat(absPath).catch(() => null))?.isSymbolicLink()) continue;
            allowedAdditional = true;
            break;
          }
          continue;
        }
        if (stat.isFile() && absPath === additionalPath && absPath.endsWith(".md")) {
          allowedAdditional = true;
          break;
        }
      } catch {}
  }
  if (!allowedWorkspace && !allowedAdditional) throw new Error("path required");
  if (!absPath.endsWith(".md")) throw new Error("path required");
  if (allowedWorkspace)
    try {
      await (await root(params.workspaceDir)).resolve(relPath);
    } catch (err) {
      if (isFileMissingError(err))
        return {
          text: "",
          path: relPath,
        };
      throw err;
    }
  if ((await statRegularFile(absPath)).missing)
    return {
      text: "",
      path: relPath,
    };
  let content;
  try {
    content = (
      await retryTransientMemoryRead(
        () => readRegularFile({ filePath: absPath }),
        `read memory file ${absPath}`,
      )
    ).buffer.toString("utf-8");
  } catch (err) {
    if (isFileDisappearedDuringReadError(err))
      return {
        text: "",
        path: relPath,
      };
    throw err;
  }
  return buildMemoryReadResult({
    content,
    relPath,
    from: params.from,
    lines: params.lines,
    defaultLines: params.defaultLines ?? 120,
    maxChars: params.maxChars,
    suggestReadFallback: allowedWorkspace,
  });
}
/** Resolve agent memory config and read one memory file for that agent. */
async function readAgentMemoryFile(params) {
  const settings = resolveMemoryHostSearchPathConfig(params.cfg, params.agentId);
  if (!settings) throw new Error("memory search disabled");
  const contextLimits = resolveMemoryHostAgentContextLimits(params.cfg, params.agentId);
  return await readMemoryFile({
    workspaceDir: resolveMemoryHostAgentWorkspaceDir(params.cfg, params.agentId),
    extraPaths: settings.extraPaths,
    relPath: params.relPath,
    from: params.from,
    lines: params.lines,
    defaultLines: contextLimits?.memoryGetDefaultLines,
    maxChars: contextLimits?.memoryGetMaxChars,
  });
}
//#endregion
export {
  buildMemoryReadResult as a,
  DEFAULT_MEMORY_READ_MAX_CHARS as i,
  readMemoryFile as n,
  buildMemoryReadResultFromSlice as o,
  DEFAULT_MEMORY_READ_LINES as r,
  readAgentMemoryFile as t,
};
