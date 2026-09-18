import "./fs-safe-defaults-B7hUN42l.js";
import path from "node:path";
import "./fs-safe-RNq3oO57.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import "./local-file-access-CBe_wA_B.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
//#region src/infra/fs-safe-remove.ts
async function listDirectoryEntries(root, relativePath) {
  return await root.list(relativePath, { withFileTypes: true });
}
function compareDirectoryEntryNames(left, right) {
  if (left.name === right.name) return 0;
  return left.name < right.name ? -1 : 1;
}
function isNotFoundError(error) {
  const code = error?.code;
  return code === "not-found" || code === "ENOENT";
}
function relativeParentPath(relativePath) {
  const parentPath = path.dirname(relativePath);
  return parentPath === "." ? "" : parentPath;
}
function joinRootRelativePath(parentRelativePath, childName) {
  return parentRelativePath.length === 0 ? childName : path.join(parentRelativePath, childName);
}
async function findDirectoryEntry(root, relativePath) {
  const targetName = path.basename(relativePath);
  if (targetName.length === 0 || targetName === ".") return;
  return (await listDirectoryEntries(root, relativeParentPath(relativePath))).find(
    (entry) => entry.name === targetName,
  );
}
async function removeRootRelativePath(root, relativePath, suppressNotFound) {
  try {
    await root.remove(relativePath);
  } catch (error) {
    if (isNotFoundError(error)) {
      if (suppressNotFound) return;
      throw new FsSafeError("not-found", "file not found", {
        cause: error instanceof Error ? error : void 0,
      });
    }
    throw error;
  }
}
function assertNotSymbolicLink(relativePath, entry) {
  if (!entry.isSymbolicLink) return;
  throw new FsSafeError("symlink", `symlink not allowed: ${relativePath}`);
}
async function removeDirectoryEntry(root, relativePath, suppressNotFound) {
  const entry = await findDirectoryEntry(root, relativePath).catch((error) => {
    if (suppressNotFound && isNotFoundError(error)) return;
    throw error;
  });
  if (!entry) {
    await removeRootRelativePath(root, relativePath, suppressNotFound);
    return;
  }
  assertNotSymbolicLink(relativePath, entry);
  if (entry.isDirectory) {
    const children = (
      await listDirectoryEntries(root, relativePath).catch((error) => {
        if (suppressNotFound && isNotFoundError(error)) return;
        throw error;
      })
    )?.toSorted(compareDirectoryEntryNames);
    if (!children) {
      await removeRootRelativePath(root, relativePath, suppressNotFound);
      return;
    }
    for (const child of children)
      await removeDirectoryEntry(
        root,
        joinRootRelativePath(relativePath, child.name),
        suppressNotFound,
      );
  }
  await removeRootRelativePath(root, relativePath, suppressNotFound);
}
async function removePathWithinRoot(params) {
  const root$1 = await root(params.rootDir);
  const suppressNotFound = params.force !== false;
  const recursive = params.recursive === true;
  const entry = await findDirectoryEntry(root$1, params.relativePath).catch((error) => {
    if (suppressNotFound && isNotFoundError(error)) return;
    throw error;
  });
  if (!entry) {
    await removeRootRelativePath(root$1, params.relativePath, suppressNotFound);
    return;
  }
  if (!recursive || !entry.isDirectory) {
    assertNotSymbolicLink(params.relativePath, entry);
    await removeRootRelativePath(root$1, params.relativePath, suppressNotFound);
    return;
  }
  await removeDirectoryEntry(root$1, params.relativePath, suppressNotFound);
}
//#endregion
export { removePathWithinRoot as t };
