import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import "./error-runtime-BIAwr399.js";
import "./media-store-CLUM1Syr.js";
import "./process-runtime-BKNTr1ic.js";
import { StringDecoder } from "node:string_decoder";
import { t as projectBoundedTextTail } from "./append-bounded-text-tail-CAhyNQW0.js";
import { t as appendFileTransferAudit } from "./audit-Be1mkcpD.js";
import {
  l as FILE_TRANSFER_SUBDIR,
  n as DIR_FETCH_HARD_MAX_BYTES,
  r as DIR_FETCH_TOOL_DESCRIPTOR,
  t as DIR_FETCH_DEFAULT_MAX_BYTES,
} from "./descriptors-CAImVwMw.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { i as mimeFromExtension, t as IMAGE_MIME_INLINE_SET } from "./mime-DxNHI5sD.js";
import {
  a as readClampedInt,
  i as readBoolean,
  n as readRequiredNodePath,
  r as humanSize,
  t as invokeNodeToolPayload,
} from "./node-tool-invoke-6NAP_BDT.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
//#region extensions/file-transfer/src/tools/dir-fetch-tool.ts
const MEDIA_URL_CAP = 25;
const TAR_UNPACK_TIMEOUT_MS = 6e4;
const TAR_UNPACK_MAX_ENTRIES = 5e3;
const TAR_LIST_OUTPUT_MAX_CHARS = 32 * 1024 * 1024;
const TAR_STDERR_TAIL_CHARS = 4096;
const TAR_ERROR_REASON_STDERR_CHARS = 200;
const TAR_UNPACK_ERROR_STDERR_CHARS = 300;
const DIR_FETCH_MAX_UNCOMPRESSED_BYTES = 64 * 1024 * 1024;
const DIR_FETCH_MAX_SINGLE_FILE_BYTES = 16 * 1024 * 1024;
async function listTarOutputLines(input) {
  const tarBin = process.platform !== "win32" ? "/usr/bin/tar" : "tar";
  const decoder = new StringDecoder("utf8");
  const values = [];
  let pending = "";
  let outputBytes = 0;
  let outputTooLarge = false;
  let valueLimitReached = false;
  const appendLine = (line) => {
    if (!line) return true;
    values.push(input.mapLine(line));
    valueLimitReached = values.length >= input.maxValues;
    return !valueLimitReached;
  };
  let result;
  try {
    result = await runCommandWithTimeout([tarBin, ...input.args], {
      input: input.tarBuffer,
      maxOutputBytes: { stderr: TAR_STDERR_TAIL_CHARS },
      onOutputChunk: (chunk, stream) => {
        if (stream !== "stdout") return true;
        outputBytes += chunk.byteLength;
        if (outputBytes > TAR_LIST_OUTPUT_MAX_CHARS) {
          outputTooLarge = true;
          return false;
        }
        const lines = `${pending}${decoder.write(chunk)}`.split("\n");
        pending = lines.pop() ?? "";
        return lines.every(appendLine);
      },
      outputCapture: {
        stdout: "discard",
        stderr: "tail",
      },
      tolerateOutputError: { stderr: true },
      timeoutMs: 3e4,
    });
  } catch (error) {
    return {
      ok: false,
      reason: `${input.label} error: ${formatErrorMessage(error)}`,
    };
  }
  if (result.termination === "timeout")
    return {
      ok: false,
      reason: `${input.label} timed out`,
    };
  if (valueLimitReached)
    return {
      ok: true,
      values,
    };
  if (outputTooLarge)
    return {
      ok: false,
      reason: `${input.label} output too large`,
    };
  if (result.termination !== "exit")
    return {
      ok: false,
      reason: `${input.label} error: ${result.termination}`,
    };
  if (result.code !== 0)
    return {
      ok: false,
      reason: `${input.label} exited ${result.code}: ${projectBoundedTextTail(result.stderr, TAR_ERROR_REASON_STDERR_CHARS)}`,
    };
  appendLine(pending + decoder.end());
  return {
    ok: true,
    values,
  };
}
async function computeFileSha256(filePath) {
  const hash = crypto.createHash("sha256");
  const handle = await fs.open(filePath, "r");
  try {
    const chunkSize = 64 * 1024;
    const buf = Buffer.allocUnsafe(chunkSize);
    while (true) {
      const { bytesRead } = await handle.read(buf, 0, chunkSize, null);
      if (bytesRead === 0) break;
      hash.update(buf.subarray(0, bytesRead));
    }
  } finally {
    await handle.close();
  }
  return hash.digest("hex");
}
/**
 * Run two passes against the buffer to enumerate entries BEFORE we extract:
 *
 *   1. `tar -tf -` produces names ONLY, one per line. This is whitespace-safe
 *      because each line is exactly one path; no parsing of fixed columns.
 *      Used to validate paths (reject absolute, '..' traversal).
 *   2. `tar -tvf -` adds type info via the `ls -l`-style perm prefix.
 *      Used ONLY to detect symlinks / hardlinks / non-regular entries via
 *      the FIRST CHARACTER of each line, never the path column.
 *
 * Size limits are enforced at the *extraction* step instead — the tar
 * unpack process is bounded by the maxBytes we already pass through, and
 * the post-extract walkDir is hard-capped by TAR_UNPACK_MAX_ENTRIES.
 * Trying to parse uncompressed sizes from `tar -tvf` output is fragile
 * (filenames with whitespace shift the columns) and Aisle flagged that
 * shape as a bypass primitive — drop it.
 */
async function listTarPaths(tarBuffer) {
  const result = await listTarOutputLines({
    args: ["-tzf", "-"],
    label: "tar -tzf",
    tarBuffer,
    mapLine: (line) => line,
    maxValues: 5001,
  });
  return result.ok
    ? {
        ok: true,
        paths: result.values,
      }
    : result;
}
async function listTarTypeChars(tarBuffer) {
  const result = await listTarOutputLines({
    args: ["-tzvf", "-"],
    label: "tar -tzvf",
    tarBuffer,
    mapLine: (line) => line.charAt(0),
    maxValues: 5001,
  });
  return result.ok
    ? {
        ok: true,
        typeChars: result.values,
      }
    : result;
}
async function preValidateTarball(tarBuffer) {
  const namesResult = await listTarPaths(tarBuffer);
  if (!namesResult.ok) return namesResult;
  const paths = namesResult.paths;
  if (paths.length > TAR_UNPACK_MAX_ENTRIES)
    return {
      ok: false,
      reason: `archive contains ${paths.length} entries; limit ${TAR_UNPACK_MAX_ENTRIES}`,
    };
  const typesResult = await listTarTypeChars(tarBuffer);
  if (!typesResult.ok) return typesResult;
  const typeChars = typesResult.typeChars;
  if (typeChars.length !== paths.length)
    return {
      ok: false,
      reason: `tar -tzf and tar -tzvf disagree on entry count (${paths.length} vs ${typeChars.length}); refusing`,
    };
  for (const [index, entryPath] of paths.entries()) {
    const t = typeChars.at(index);
    if (t === void 0)
      return {
        ok: false,
        reason: `tar -tzf and tar -tzvf disagree on entry count (${paths.length} vs ${typeChars.length}); refusing`,
      };
    if (t === "l" || t === "h")
      return {
        ok: false,
        reason: `archive contains link entry: ${entryPath}`,
      };
    if (t !== "-" && t !== "d")
      return {
        ok: false,
        reason: `archive contains non-regular entry type '${t}': ${entryPath}`,
      };
    if (path.isAbsolute(entryPath))
      return {
        ok: false,
        reason: `archive contains absolute path: ${entryPath}`,
      };
    const norm = path.posix.normalize(entryPath);
    if (norm === ".." || norm.startsWith("../") || norm.includes("/../"))
      return {
        ok: false,
        reason: `archive contains '..' traversal: ${entryPath}`,
      };
    if (entryPath.includes("\\"))
      return {
        ok: false,
        reason: `archive contains backslash in path: ${entryPath}`,
      };
  }
  return { ok: true };
}
async function validateTarUncompressedBudget(
  tarBuffer,
  maxBytes = DIR_FETCH_MAX_UNCOMPRESSED_BYTES,
) {
  const tarBin = process.platform !== "win32" ? "/usr/bin/tar" : "tar";
  let totalBytes = 0;
  let budgetExceeded = false;
  let result;
  try {
    result = await runCommandWithTimeout([tarBin, "-xOzf", "-"], {
      input: tarBuffer,
      maxOutputBytes: { stderr: TAR_STDERR_TAIL_CHARS },
      onOutputChunk: (chunk, stream) => {
        if (stream !== "stdout") return true;
        totalBytes += chunk.byteLength;
        budgetExceeded = totalBytes > maxBytes;
        return !budgetExceeded;
      },
      outputCapture: {
        stdout: "discard",
        stderr: "tail",
      },
      tolerateOutputError: { stderr: true },
      timeoutMs: TAR_UNPACK_TIMEOUT_MS,
    });
  } catch (error) {
    return {
      ok: false,
      reason: `tar uncompressed budget validation error: ${formatErrorMessage(error)}`,
    };
  }
  if (result.termination === "timeout")
    return {
      ok: false,
      reason: "tar uncompressed budget validation timed out",
    };
  if (budgetExceeded)
    return {
      ok: false,
      reason: `archive expands past uncompressed budget ${maxBytes} bytes`,
    };
  if (result.termination !== "exit")
    return {
      ok: false,
      reason: `tar uncompressed budget validation error: ${result.termination}`,
    };
  if (result.code !== 0)
    return {
      ok: false,
      reason: `tar uncompressed budget validation exited ${result.code}: ${projectBoundedTextTail(result.stderr, TAR_ERROR_REASON_STDERR_CHARS)}`,
    };
  return { ok: true };
}
/**
 * Unpack a gzipped tarball into a target directory via `tar -xzf -`.
 * Caller MUST have run `preValidateTarball` first — this function trusts
 * that the archive contains only regular files / dirs with relative,
 * non-traversing paths. Without that pre-validation, raw `tar -xzf` is
 * unsafe (tarbomb, symlink-then-write tricks, decompression bomb).
 *
 * The `-P` flag is intentionally omitted so absolute paths in the
 * archive are stripped to relative ones (defense-in-depth on top of the
 * pre-validation rejection). A hard wall-clock timeout caps the unpack
 * at TAR_UNPACK_TIMEOUT_MS to avoid hangs.
 *
 * BSD tar (macOS) and GNU tar disagree on flags: `--no-overwrite-dir` is
 * GNU-only and BSD tar rejects it. We use only flags both implementations
 * accept. Defense-in-depth comes from the pre-validation step instead.
 *
 * `--no-same-owner` and `--no-same-permissions` are accepted by both BSD
 * and GNU tar. They prevent the archive from setting file ownership
 * (uid/gid) and dangerous mode bits (setuid/setgid/world-writable) on
 * the gateway filesystem. If the gateway is ever run as root or with
 * elevated privileges, a malicious node could otherwise plant
 * privileged executables here.
 */
async function unpackTar(tarBuffer, destDir) {
  await fs.mkdir(destDir, {
    recursive: true,
    mode: 448,
  });
  const result = await runCommandWithTimeout(
    [
      process.platform !== "win32" ? "/usr/bin/tar" : "tar",
      "-xzf",
      "-",
      "-C",
      destDir,
      "--no-same-owner",
      "--no-same-permissions",
    ],
    {
      input: tarBuffer,
      maxOutputBytes: { stderr: TAR_STDERR_TAIL_CHARS },
      outputCapture: {
        stdout: "discard",
        stderr: "tail",
      },
      tolerateOutputError: { stderr: true },
      timeoutMs: TAR_UNPACK_TIMEOUT_MS,
    },
  );
  if (result.termination === "timeout")
    throw new Error(`tar unpack timed out after ${TAR_UNPACK_TIMEOUT_MS}ms`);
  if (result.termination !== "exit") throw new Error(`tar unpack failed: ${result.termination}`);
  if (result.code !== 0)
    throw new Error(
      `tar unpack exited ${result.code}: ${projectBoundedTextTail(result.stderr, TAR_UNPACK_ERROR_STDERR_CHARS)}`,
    );
}
/**
 * Walk a directory recursively, collecting file entries (skips directories).
 * Skips symlinks — we don't want to follow links the archive might have
 * carried in. Files only.
 */
async function walkDir(dir, rootDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walkDir(absPath, rootDir);
      results.push(...nested);
    } else if (entry.isFile()) {
      const relPath = path.relative(rootDir, absPath);
      results.push({
        relPath,
        absPath,
      });
    }
  }
  return results;
}
function createDirFetchTool() {
  return {
    ...DIR_FETCH_TOOL_DESCRIPTOR,
    execute: async (_toolCallId, args) => {
      const params = args;
      const { node, requestedPath: dirPath } = readRequiredNodePath(params);
      const { nodeId, nodeDisplayName, payload, startedAt } = await invokeNodeToolPayload({
        node,
        params,
        command: "dir.fetch",
        commandParams: {
          path: dirPath,
          maxBytes: readClampedInt({
            input: params,
            key: "maxBytes",
            defaultValue: DIR_FETCH_DEFAULT_MAX_BYTES,
            hardMin: 1,
            hardMax: DIR_FETCH_HARD_MAX_BYTES,
          }),
          includeDotfiles: readBoolean(params, "includeDotfiles", false),
        },
        requestedPath: dirPath,
      });
      const canonicalPath = typeof payload.path === "string" ? payload.path : "";
      const tarBase64 = typeof payload.tarBase64 === "string" ? payload.tarBase64 : "";
      const tarBytes = typeof payload.tarBytes === "number" ? payload.tarBytes : -1;
      const sha256 = typeof payload.sha256 === "string" ? payload.sha256 : "";
      const fileCount = typeof payload.fileCount === "number" ? payload.fileCount : 0;
      if (!canonicalPath || !tarBase64 || tarBytes < 0 || !sha256)
        throw new Error("invalid dir.fetch payload (missing fields)");
      const tarBuffer = Buffer.from(tarBase64, "base64");
      if (tarBuffer.byteLength !== tarBytes)
        throw new Error(
          `dir.fetch size mismatch: payload says ${tarBytes} bytes, decoded ${tarBuffer.byteLength}`,
        );
      if (crypto.createHash("sha256").update(tarBuffer).digest("hex") !== sha256)
        throw new Error("dir.fetch sha256 mismatch (integrity failure)");
      const validation = await preValidateTarball(tarBuffer);
      if (!validation.ok) {
        await appendFileTransferAudit({
          op: "dir.fetch",
          nodeId,
          nodeDisplayName,
          requestedPath: dirPath,
          canonicalPath,
          decision: "error",
          errorCode: "UNSAFE_ARCHIVE",
          errorMessage: validation.reason,
          sizeBytes: tarBytes,
          sha256,
          durationMs: Date.now() - startedAt,
        });
        throw new Error(`dir.fetch UNSAFE_ARCHIVE: ${validation.reason}`);
      }
      const budget = await validateTarUncompressedBudget(tarBuffer);
      if (!budget.ok) {
        await appendFileTransferAudit({
          op: "dir.fetch",
          nodeId,
          nodeDisplayName,
          requestedPath: dirPath,
          canonicalPath,
          decision: "error",
          errorCode: "TREE_TOO_LARGE",
          errorMessage: budget.reason,
          sizeBytes: tarBytes,
          sha256,
          durationMs: Date.now() - startedAt,
        });
        throw new Error(`dir.fetch UNCOMPRESSED_TOO_LARGE: ${budget.reason}`);
      }
      const savedTar = await saveMediaBuffer(
        tarBuffer,
        "application/gzip",
        FILE_TRANSFER_SUBDIR,
        DIR_FETCH_HARD_MAX_BYTES,
      );
      const tarDir = path.dirname(savedTar.path);
      const unpackId = `dir-fetch-${path.basename(savedTar.path, path.extname(savedTar.path))}`;
      const rootDir = path.join(tarDir, unpackId);
      await unpackTar(tarBuffer, rootDir);
      const walked = await walkDir(rootDir, rootDir);
      const files = [];
      let totalUncompressed = 0;
      const abortAndCleanup = async (reason) => {
        await fs
          .rm(rootDir, {
            recursive: true,
            force: true,
          })
          .catch(() => {});
        await appendFileTransferAudit({
          op: "dir.fetch",
          nodeId,
          nodeDisplayName,
          requestedPath: dirPath,
          canonicalPath,
          decision: "error",
          errorCode: "TREE_TOO_LARGE",
          errorMessage: reason,
          sizeBytes: tarBytes,
          sha256,
          durationMs: Date.now() - startedAt,
        });
        throw new Error(`dir.fetch UNCOMPRESSED_TOO_LARGE: ${reason}`);
      };
      for (const { relPath, absPath } of walked) {
        let size;
        try {
          size = (await fs.stat(absPath)).size;
        } catch {
          continue;
        }
        if (size > DIR_FETCH_MAX_SINGLE_FILE_BYTES)
          await abortAndCleanup(
            `extracted file ${relPath} is ${size} bytes (limit ${DIR_FETCH_MAX_SINGLE_FILE_BYTES})`,
          );
        totalUncompressed += size;
        if (totalUncompressed > DIR_FETCH_MAX_UNCOMPRESSED_BYTES)
          await abortAndCleanup(
            `extracted tree exceeds uncompressed budget ${DIR_FETCH_MAX_UNCOMPRESSED_BYTES} bytes (decompression bomb?)`,
          );
        const mimeType = mimeFromExtension(relPath);
        const fileSha256 = await computeFileSha256(absPath);
        files.push({
          relPath,
          size,
          mimeType,
          sha256: fileSha256,
          localPath: absPath,
        });
      }
      const imageFiles = files.filter((f) => IMAGE_MIME_INLINE_SET.has(f.mimeType));
      const nonImageFiles = files.filter((f) => !IMAGE_MIME_INLINE_SET.has(f.mimeType));
      const allOrdered = [...imageFiles, ...nonImageFiles];
      const droppedFromMedia = Math.max(0, allOrdered.length - MEDIA_URL_CAP);
      const mediaUrls = allOrdered.slice(0, MEDIA_URL_CAP).map((f) => f.localPath);
      const shortHash = sha256.slice(0, 12);
      const mediaNote = droppedFromMedia
        ? ` (channel attaches first ${MEDIA_URL_CAP}; ${droppedFromMedia} more in details.files)`
        : "";
      const summaryText = `Fetched ${fileCount} files from ${canonicalPath} (${humanSize(tarBytes)} compressed, sha256:${shortHash}) — saved on the gateway under ${rootDir}/${mediaNote}`;
      await appendFileTransferAudit({
        op: "dir.fetch",
        nodeId,
        nodeDisplayName,
        requestedPath: dirPath,
        canonicalPath,
        decision: "allowed",
        sizeBytes: tarBytes,
        sha256,
        durationMs: Date.now() - startedAt,
      });
      return {
        content: [
          {
            type: "text",
            text: summaryText,
          },
        ],
        details: {
          path: canonicalPath,
          rootDir,
          fileCount,
          tarBytes,
          sha256,
          files,
          media: { mediaUrls },
        },
      };
    },
  };
}
//#endregion
export { createDirFetchTool };
