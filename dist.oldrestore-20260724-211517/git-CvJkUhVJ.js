import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
//#region src/agents/worktrees/git.ts
const GIT_TIMEOUT_MS = 12e4;
async function runGit(cwd, args, options = {}) {
  return await runCommandWithTimeout(["git", "-C", cwd, ...args], {
    timeoutMs: GIT_TIMEOUT_MS,
    env: options.env,
    input: options.input,
  });
}
function commandError(command, result) {
  const detail = (result.stderr || result.stdout).trim().split("\n").slice(-12).join("\n");
  return /* @__PURE__ */ new Error(`${command} failed${detail ? `:\n${detail}` : ""}`);
}
async function requireGit(cwd, args, options = {}) {
  const result = await runGit(cwd, args, options);
  if (result.code !== 0) throw commandError(`git ${args.join(" ")}`, result);
  return result.stdout.trim();
}
async function requireGitRaw(cwd, args) {
  const result = await runGit(cwd, args);
  if (result.code !== 0) throw commandError(`git ${args.join(" ")}`, result);
  return result.stdout;
}
function parseWorktreeList(output) {
  const entries = [];
  let current;
  for (const field of output.split("\0")) {
    if (!field) {
      if (current) {
        entries.push(current);
        current = void 0;
      }
      continue;
    }
    if (field.startsWith("worktree ")) {
      if (current) entries.push(current);
      current = { path: field.slice(9) };
    } else if (current && field === "locked") current.lockedReason = "";
    else if (current && field.startsWith("locked ")) current.lockedReason = field.slice(7);
  }
  if (current) entries.push(current);
  return entries;
}
async function listGitWorktrees(repoRoot) {
  return parseWorktreeList(
    await requireGitRaw(repoRoot, ["worktree", "list", "--porcelain", "-z"]),
  );
}
/**
 * True when dir sits inside a git checkout: a .git entry on itself or any ancestor.
 * Existence, not directory-ness, is the signal — linked worktrees keep a .git file.
 * Mirrors `git rev-parse --show-toplevel` discovery without spawning git, so UI
 * capability checks and create-preflights cannot diverge from the worktree service.
 */
function findGitCheckoutRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (existsSync(path.join(current, ".git"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}
function insideGitCheckout(start) {
  return findGitCheckoutRoot(start) !== null;
}
async function hasSelfContainedGitMetadata(checkoutRoot) {
  try {
    return (await fs$1.lstat(path.join(checkoutRoot, ".git"))).isDirectory();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function pathExists(target) {
  try {
    await fs$1.lstat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function removeEmptyParents(start, stop) {
  let current = start;
  while (current.startsWith(`${stop}${path.sep}`)) {
    try {
      await fs$1.rmdir(current);
    } catch {
      return;
    }
    current = path.dirname(current);
  }
}
//#endregion
export {
  listGitWorktrees as a,
  requireGit as c,
  insideGitCheckout as i,
  requireGitRaw as l,
  findGitCheckoutRoot as n,
  pathExists as o,
  hasSelfContainedGitMetadata as r,
  removeEmptyParents as s,
  commandError as t,
  runGit as u,
};
