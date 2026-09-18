import fs from "node:fs/promises";
import path from "node:path";
import "./src-Bl7G9qvi.js";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { u as runGit } from "./git-CvJkUhVJ.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import { Zn as validateSessionsDiffParams } from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/gateway/server-methods/sessions-diff.ts
const MAX_FILES = 500;
const MAX_UNTRACKED_FILES = 100;
const MAX_PATCH_BYTES_PER_FILE = 1e5;
const MAX_TOTAL_PATCH_BYTES = 15e5;
const MAX_TOTAL_CHANGED_LINES = 1e5;
async function gitOut(cwd, args, okCodes = [0]) {
  try {
    const result = await runGit(cwd, ["-c", "core.quotePath=false", ...args]);
    return okCodes.includes(result.code ?? -1) ? result.stdout : null;
  } catch {
    return null;
  }
}
/** Parses `git diff --name-status -z -M` output; R/C entries consume two paths. */
function parseNameStatusZ(text) {
  const tokens = text.split("\0");
  const entries = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const code = tokens[i];
    if (!code) continue;
    const letter = code[0];
    if (letter === "R" || letter === "C") {
      const oldPath = tokens[i + 1];
      const path = tokens[i + 2];
      i += 2;
      if (path)
        entries.push({
          path,
          oldPath,
          status: letter === "R" ? "renamed" : "added",
        });
      continue;
    }
    const path = tokens[i + 1];
    i += 1;
    if (!path) continue;
    const status = letter === "A" ? "added" : letter === "D" ? "deleted" : "modified";
    entries.push({
      path,
      status,
    });
  }
  return entries;
}
/** Parses `git diff --numstat -z -M`; rename entries put paths in follow-up tokens. */
function parseNumstatZ(text) {
  const tokens = text.split("\0");
  const byPath = /* @__PURE__ */ new Map();
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token) continue;
    const [added, deleted, inlinePath] = token.split("	");
    if (added === void 0 || deleted === void 0) continue;
    const binary = added === "-";
    const entry = {
      additions: binary ? 0 : Number.parseInt(added, 10) || 0,
      deletions: binary ? 0 : Number.parseInt(deleted, 10) || 0,
      binary,
    };
    if (inlinePath) {
      byPath.set(inlinePath, entry);
      continue;
    }
    const path = tokens[i + 2];
    i += 2;
    if (path) byPath.set(path, entry);
  }
  return byPath;
}
function chunkPath(chunk) {
  const newFile = /^\+\+\+ b\/(.+)$/m.exec(chunk);
  if (newFile) return expectDefined(newFile[1], "new file capture group 1");
  const oldFile = /^--- a\/(.+)$/m.exec(chunk);
  if (oldFile) return expectDefined(oldFile[1], "old file capture group 1");
  const renameTo = /^rename to (.+)$/m.exec(chunk);
  if (renameTo) return expectDefined(renameTo[1], "rename to capture group 1");
  const header = /^diff --git a\/.+ b\/(.+)$/m.exec(chunk);
  return header ? expectDefined(header[1], "header capture group 1") : null;
}
/** Splits a multi-file `git diff --patch` into per-file chunks keyed by path. */
function splitPatchByFile(patch) {
  const byPath = /* @__PURE__ */ new Map();
  if (!patch.trim()) return byPath;
  const parts = patch.split(/^(?=diff --git )/m);
  for (const part of parts) {
    if (!part.startsWith("diff --git ")) continue;
    const path = chunkPath(part);
    if (path) byPath.set(path, part);
  }
  return byPath;
}
function isBinaryChunk(chunk) {
  return /^Binary files .* differ$/m.test(chunk) || chunk.includes("\nGIT binary patch\n");
}
function countPatchAdditions(chunk) {
  let additions = 0;
  let inHunk = false;
  for (const line of chunk.split("\n")) {
    if (line.startsWith("@@")) {
      inHunk = true;
      continue;
    }
    if (inHunk && line.startsWith("+")) additions += 1;
  }
  return additions;
}
/**
 * A patch-producing `git diff` reads working-tree file contents, so a
 * checkout-planted hardlink to an out-of-tree secret would otherwise leak
 * through this read-scoped RPC (same threat the fs-safe workspace readers
 * reject). Content is only emitted for a real, single-linked regular file
 * whose realpath stays inside the checkout. Deleted files are exempt: git
 * reads their content from the object DB, never the filesystem.
 */
async function isPatchableWorkingTreePath(realRoot, relPath) {
  const abs = path.resolve(realRoot, relPath);
  try {
    const info = await fs.lstat(abs);
    if (!info.isFile() || info.nlink !== 1) return false;
    const resolved = await fs.realpath(abs);
    return resolved === realRoot || resolved.startsWith(realRoot + path.sep);
  } catch {
    return false;
  }
}
function takePatch(chunk, budget) {
  if (!chunk) return { truncated: true };
  const bytes = Buffer.byteLength(chunk, "utf8");
  if (bytes > MAX_PATCH_BYTES_PER_FILE || bytes > budget.remaining) return { truncated: true };
  budget.remaining -= bytes;
  return { patch: chunk };
}
/**
 * Picks the ref the session diff is computed against: merge-base with the
 * remote default branch when on a feature branch, otherwise HEAD so sessions
 * on the default branch still surface uncommitted work.
 */
async function resolveDiffBase(root, branch) {
  const remoteDefault =
    (await gitOut(root, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"]))?.trim() || null;
  const defaultShort = remoteDefault?.replace(/^origin\//, "");
  if (remoteDefault && defaultShort && branch && branch !== defaultShort) {
    const mergeBase = await gitOut(root, ["merge-base", remoteDefault, "HEAD"]);
    if (mergeBase?.trim())
      return {
        base: mergeBase.trim(),
        baseRef: defaultShort,
      };
  }
  if (branch && branch !== "main" && branch !== "master") {
    for (const candidate of ["main", "master"])
      if ((await gitOut(root, ["rev-parse", "--verify", "--quiet", candidate]))?.trim()) {
        const mergeBase = await gitOut(root, ["merge-base", candidate, "HEAD"]);
        if (mergeBase?.trim())
          return {
            base: mergeBase.trim(),
            baseRef: candidate,
          };
      }
  }
  return {
    base: "HEAD",
    baseRef: "HEAD",
  };
}
/**
 * Diff base for a repo before its first commit: the empty-tree object id, so
 * `git diff <empty>` reports staged/index files as additions. `hash-object`
 * derives the id for the repo's object format (SHA-1 vs SHA-256) and does not
 * write to the object DB. baseRef stays undefined — there is no named base.
 */
async function resolveUnbornDiffBase(root) {
  try {
    const result = await runGit(root, ["hash-object", "-t", "tree", "--stdin"], { input: "" });
    const emptyTree = result.code === 0 ? result.stdout.trim() : "";
    return emptyTree ? { base: emptyTree } : null;
  } catch {
    return null;
  }
}
async function collectUntrackedFiles(root, realRoot, budget) {
  const paths = ((await gitOut(root, ["ls-files", "--others", "--exclude-standard", "-z"])) ?? "")
    .split("\0")
    .filter(Boolean);
  const truncated = paths.length > MAX_UNTRACKED_FILES;
  const files = [];
  for (const filePath of paths.slice(0, MAX_UNTRACKED_FILES)) {
    if (!(await isPatchableWorkingTreePath(realRoot, filePath))) {
      files.push({
        path: filePath,
        status: "added",
        additions: 0,
        deletions: 0,
        untracked: true,
        truncated: true,
      });
      continue;
    }
    const patch = await gitOut(
      root,
      [
        "diff",
        "--no-color",
        "--no-ext-diff",
        "--no-textconv",
        "--no-index",
        "--",
        "/dev/null",
        filePath,
      ],
      [0, 1],
    );
    if (patch === null) {
      files.push({
        path: filePath,
        status: "added",
        additions: 0,
        deletions: 0,
        untracked: true,
        truncated: true,
      });
      continue;
    }
    if (isBinaryChunk(patch)) {
      files.push({
        path: filePath,
        status: "added",
        additions: 0,
        deletions: 0,
        untracked: true,
        binary: true,
      });
      continue;
    }
    const additions = countPatchAdditions(patch);
    files.push({
      path: filePath,
      status: "added",
      additions,
      deletions: 0,
      untracked: true,
      ...takePatch(patch, budget),
    });
  }
  return {
    files,
    truncated,
  };
}
async function collectTrackedFiles(root, realRoot, base, budget) {
  const diffArgs = ["diff", "-M", base];
  const nameStatus = await gitOut(root, [...diffArgs, "--name-status", "-z"]);
  if (nameStatus === null)
    return {
      files: [],
      truncated: false,
    };
  const entries = parseNameStatusZ(nameStatus);
  if (entries.length === 0)
    return {
      files: [],
      truncated: false,
    };
  const numstat = parseNumstatZ((await gitOut(root, [...diffArgs, "--numstat", "-z"])) ?? "");
  const patchText =
    [...numstat.values()].reduce((sum, entry) => sum + entry.additions + entry.deletions, 0) >
    MAX_TOTAL_CHANGED_LINES
      ? null
      : await gitOut(root, [
          ...diffArgs,
          "--patch",
          "--no-color",
          "--no-ext-diff",
          "--no-textconv",
        ]);
  const chunks = patchText === null ? /* @__PURE__ */ new Map() : splitPatchByFile(patchText);
  const truncated = entries.length > MAX_FILES;
  const files = [];
  for (const entry of entries.slice(0, MAX_FILES)) {
    const stat = numstat.get(entry.path);
    const chunk = chunks.get(entry.path);
    const binary = stat?.binary === true || (chunk !== void 0 && isBinaryChunk(chunk));
    const file = {
      path: entry.path,
      status: entry.status,
      additions: stat?.additions ?? 0,
      deletions: stat?.deletions ?? 0,
    };
    if (entry.oldPath) file.oldPath = entry.oldPath;
    if (binary) {
      file.binary = true;
      files.push(file);
      continue;
    }
    if (!(entry.status === "deleted" || (await isPatchableWorkingTreePath(realRoot, entry.path)))) {
      file.truncated = true;
      files.push(file);
      continue;
    }
    const taken = takePatch(chunk, budget);
    if (taken.patch !== void 0) file.patch = taken.patch;
    if (taken.truncated) file.truncated = true;
    files.push(file);
  }
  return {
    files,
    truncated,
  };
}
async function loadSessionDiff(params) {
  const empty = (unavailableReason) => ({
    sessionKey: params.sessionKey,
    files: [],
    additions: 0,
    deletions: 0,
    ...(unavailableReason ? { unavailableReason } : {}),
  });
  const { cfg, entry, storePath, canonicalKey } = loadSessionEntry(params.sessionKey, {
    agentId: params.agentId,
  });
  if (!entry?.sessionId || !storePath) return empty("unknown_session");
  const agentId = normalizeAgentId(
    parseAgentSessionKey(canonicalKey)?.agentId ??
      params.agentId ??
      parseAgentSessionKey(params.sessionKey)?.agentId ??
      resolveDefaultAgentId(cfg),
  );
  const cwd =
    normalizeOptionalString(entry.spawnedCwd) ??
    normalizeOptionalString(entry.spawnedWorkspaceDir) ??
    normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId));
  if (!cwd) return empty("unknown_session");
  const root = (await gitOut(cwd, ["rev-parse", "--show-toplevel"]))?.trim();
  if (!root) return empty("not_git");
  const realRoot = await fs.realpath(root).catch(() => root);
  const branchOut = (await gitOut(root, ["rev-parse", "--abbrev-ref", "HEAD"]))?.trim();
  const branch = branchOut && branchOut !== "HEAD" ? branchOut : void 0;
  const budget = { remaining: MAX_TOTAL_PATCH_BYTES };
  const baseInfo =
    (await gitOut(root, ["rev-parse", "--verify", "--quiet", "HEAD"])) !== null
      ? await resolveDiffBase(root, branch)
      : await resolveUnbornDiffBase(root);
  const tracked = baseInfo
    ? await collectTrackedFiles(root, realRoot, baseInfo.base, budget)
    : {
        files: [],
        truncated: false,
      };
  const untracked = await collectUntrackedFiles(root, realRoot, budget);
  const files = [...tracked.files, ...untracked.files].toSorted((a, b) =>
    a.path.localeCompare(b.path),
  );
  const additions = files.reduce((sum, file) => sum + file.additions, 0);
  const deletions = files.reduce((sum, file) => sum + file.deletions, 0);
  const truncated =
    tracked.truncated || untracked.truncated || files.some((file) => file.truncated === true);
  return {
    sessionKey: params.sessionKey,
    root,
    ...(branch ? { branch } : {}),
    ...(baseInfo?.baseRef ? { baseRef: baseInfo.baseRef } : {}),
    files,
    additions,
    deletions,
    ...(truncated ? { truncated: true } : {}),
  };
}
const sessionsDiffHandlers = {
  "sessions.diff": async ({ params, respond }) => {
    if (!assertValidParams(params, validateSessionsDiffParams, "sessions.diff", respond)) return;
    respond(true, await loadSessionDiff(params));
  },
};
//#endregion
export { loadSessionDiff, parseNameStatusZ, parseNumstatZ, sessionsDiffHandlers, splitPatchByFile };
