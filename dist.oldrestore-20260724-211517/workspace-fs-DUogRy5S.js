import { createHash } from "node:crypto";
import "./fs-safe-RNq3oO57.js";
import path from "node:path";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
//#region src/gateway/server-methods/workspace-fs.ts
/** Shared preview cap: keeps file payloads comfortably under client WS limits. */
const WORKSPACE_PREVIEW_MAX_BYTES = 256 * 1024;
let workspaceFileUpdateQueue = Promise.resolve();
async function openWorkspaceRoot(rootDir) {
  try {
    return await root(rootDir, {
      hardlinks: "reject",
      maxBytes: WORKSPACE_PREVIEW_MAX_BYTES,
      nonBlockingRead: true,
      symlinks: "reject",
    });
  } catch {
    return;
  }
}
async function statWorkspacePath(rootDir, browserPath) {
  const workspaceRoot = await openWorkspaceRoot(rootDir);
  if (!workspaceRoot) return;
  try {
    return await workspaceRoot.stat(browserPath || ".");
  } catch {
    return;
  }
}
async function listWorkspacePath(rootDir, browserPath) {
  const workspaceRoot = await openWorkspaceRoot(rootDir);
  if (!workspaceRoot) return;
  try {
    return await workspaceRoot.list(browserPath || ".", { withFileTypes: true });
  } catch {
    return;
  }
}
async function readWorkspaceFile(rootDir, browserPath, opts) {
  const workspaceRoot = await openWorkspaceRoot(rootDir);
  if (!workspaceRoot) return;
  try {
    const read = await workspaceRoot.read(browserPath, {
      hardlinks: "reject",
      maxBytes: opts?.maxBytes ?? 262144,
      nonBlockingRead: true,
      symlinks: "reject",
    });
    return {
      ...read,
      canonicalPath: path.relative(workspaceRoot.rootReal, read.realPath).split(path.sep).join("/"),
    };
  } catch (err) {
    if (err instanceof FsSafeError && err.code === "too-large") return "too-large";
    return;
  }
}
function enqueueWorkspaceFileUpdate(update) {
  const result = workspaceFileUpdateQueue.then(update, update);
  workspaceFileUpdateQueue = result.then(
    () => void 0,
    () => void 0,
  );
  return result;
}
async function updateWorkspaceFile(rootDir, browserPath, content, expectedHash) {
  const workspaceRoot = await openWorkspaceRoot(rootDir);
  if (!workspaceRoot) return { status: "unsafe" };
  return await enqueueWorkspaceFileUpdate(async () => {
    let current;
    try {
      current = await workspaceRoot.read(browserPath, {
        hardlinks: "reject",
        maxBytes: WORKSPACE_PREVIEW_MAX_BYTES,
        nonBlockingRead: true,
        symlinks: "reject",
      });
    } catch {
      return { status: "unsafe" };
    }
    if (decodeUtf8Strict(current.buffer) === void 0) return { status: "unsafe" };
    const currentHash = createHash("sha256").update(current.buffer).digest("hex");
    if (currentHash !== expectedHash)
      return {
        status: "conflict",
        currentHash,
      };
    await workspaceRoot.write(browserPath, content, {
      encoding: "utf8",
      renameIdentity: "strict",
    });
    const stat = await workspaceRoot.stat(browserPath);
    if (workspaceStatKind(stat) !== "file") return { status: "unsafe" };
    return {
      status: "updated",
      canonicalPath: path
        .relative(workspaceRoot.rootReal, current.realPath)
        .split(path.sep)
        .join("/"),
      hash: createHash("sha256").update(content, "utf8").digest("hex"),
      stat,
    };
  });
}
function decodeUtf8Strict(buffer) {
  if (buffer.includes(0)) return;
  try {
    return new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    }).decode(buffer);
  } catch {
    return;
  }
}
/** Collapses `.` segments and separators into a canonical root-relative path. */
function normalizeRelativePath(value) {
  if (!value) return "";
  return value
    .replaceAll("\\", "/")
    .split("/")
    .filter((part) => part && part !== ".")
    .join("/");
}
/**
 * Lexical containment pre-check before any fs access; fs-safe re-verifies
 * against the realpathed root so symlinked escapes still fail later.
 */
function resolveWorkspacePath(root, filePath) {
  if (!root) return;
  const resolved = path.isAbsolute(filePath)
    ? path.resolve(filePath)
    : path.resolve(root, filePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;
  return resolved;
}
function workspaceStatKind(stat) {
  const kind = stat.kind;
  if (kind === "file" || kind === "directory" || kind === "symlink") return kind;
  const nodeStat = stat;
  if (typeof nodeStat.isFile === "function" ? nodeStat.isFile() : nodeStat.isFile) return "file";
  if (typeof nodeStat.isDirectory === "function" ? nodeStat.isDirectory() : nodeStat.isDirectory)
    return "directory";
  return (
    typeof nodeStat.isSymbolicLink === "function"
      ? nodeStat.isSymbolicLink()
      : nodeStat.isSymbolicLink
  )
    ? "symlink"
    : void 0;
}
/** Protocol timestamps are integer milliseconds. */
function toUpdatedAtMs(mtimeMs) {
  return Math.floor(mtimeMs);
}
function sortDirents(dirents) {
  return dirents.toSorted((a, b) => a.name.localeCompare(b.name));
}
/** Directories first, then name order — the shared browser display order. */
function sortWorkspaceEntries(entries) {
  return entries.toSorted((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
//#endregion
export {
  readWorkspaceFile as a,
  sortWorkspaceEntries as c,
  updateWorkspaceFile as d,
  workspaceStatKind as f,
  normalizeRelativePath as i,
  statWorkspacePath as l,
  decodeUtf8Strict as n,
  resolveWorkspacePath as o,
  listWorkspacePath as r,
  sortDirents as s,
  WORKSPACE_PREVIEW_MAX_BYTES as t,
  toUpdatedAtMs as u,
};
