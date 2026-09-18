import path from "node:path";
//#region src/agents/sandbox/path-utils.ts
/**
 * POSIX container path helpers for sandbox paths.
 *
 * Container paths normalize independently from host platform paths.
 */
/** Normalizes a container path and treats "." as the container root. */
function normalizeContainerPath(value) {
  const normalized = path.posix.normalize(value);
  return normalized === "." ? "/" : normalized;
}
/** Returns whether target is lexically inside root after container-path normalization. */
function isPathInsideContainerRoot(root, target) {
  const normalizedRoot = normalizeContainerPath(root);
  const normalizedTarget = normalizeContainerPath(target);
  if (normalizedRoot === "/") return true;
  return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}/`);
}
/** Returns whether a relative path would escape its container root. */
function relativePathEscapesContainerRoot(relativePath) {
  return (
    relativePath === ".." || relativePath.startsWith("../") || path.posix.isAbsolute(relativePath)
  );
}
//#endregion
export {
  normalizeContainerPath as n,
  relativePathEscapesContainerRoot as r,
  isPathInsideContainerRoot as t,
};
