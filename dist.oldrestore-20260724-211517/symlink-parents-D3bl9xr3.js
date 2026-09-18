import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { o as isPathRelativeEscape, r as isNotFoundPathError } from "./path-DILYn_gk.js";
//#region node_modules/@openclaw/fs-safe/dist/symlink-parents.js
function resolvePathWalk(params) {
  const root = path.resolve(params.rootDir);
  const target = path.resolve(params.targetPath);
  const relative = path.relative(root, target);
  if (isPathRelativeEscape(relative)) {
    if (params.allowOutsideRoot) return null;
    throw new Error(`${params.messagePrefix ?? "Path"} must stay under ${root}.`);
  }
  return {
    root,
    segments: relative && relative !== "." ? relative.split(path.sep).filter(Boolean) : [],
  };
}
function formatUnsafePath(params, current) {
  return `${params.messagePrefix ?? "Path"} must not traverse symlinked directory: ${current}`;
}
async function assertNoSymlinkParents(params) {
  const walk = resolvePathWalk(params);
  if (!walk) return;
  let current = walk.root;
  for (const segment of walk.segments) {
    current = path.join(current, segment);
    try {
      const stat = await fs$1.lstat(current);
      if (stat.isSymbolicLink()) {
        if (params.allowRootChildSymlink && path.dirname(current) === walk.root) continue;
        throw new Error(formatUnsafePath(params, current));
      }
      if (params.requireDirectories && !stat.isDirectory())
        throw new Error(`${params.messagePrefix ?? "Path"} must traverse directories: ${current}`);
    } catch (err) {
      if (isNotFoundPathError(err) && params.allowMissing !== false) return;
      throw err;
    }
  }
}
function assertNoSymlinkParentsSync(params) {
  const walk = resolvePathWalk(params);
  if (!walk) return;
  let current = walk.root;
  for (const segment of walk.segments) {
    current = path.join(current, segment);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) {
        if (params.allowRootChildSymlink && path.dirname(current) === walk.root) continue;
        throw new Error(formatUnsafePath(params, current));
      }
      if (params.requireDirectories && !stat.isDirectory())
        throw new Error(`${params.messagePrefix ?? "Path"} must traverse directories: ${current}`);
    } catch (err) {
      if (err.code === "ENOENT" && params.allowMissing !== false) return;
      throw err;
    }
  }
}
//#endregion
export { assertNoSymlinkParentsSync as n, assertNoSymlinkParents as t };
