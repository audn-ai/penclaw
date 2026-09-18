import path from "node:path";
import "./path-guards-CBe_wA_B.js";
import { l as normalizeWindowsPathForComparison } from "./path-DILYn_gk.js";
import { i as resolveSandboxInputPath } from "./sandbox-paths-DxDLkOQF.js";
//#region src/agents/path-policy.ts
/**
 * Shared workspace and sandbox path boundary helpers.
 *
 * Converts validated absolute or relative inputs into root-relative paths without allowing boundary escapes.
 */
function throwPathEscapesBoundary(params) {
  const boundary = params.options?.boundaryLabel ?? "workspace root";
  const suffix = params.options?.includeRootInError ? ` (${params.rootResolved})` : "";
  throw new Error(`Path escapes ${boundary}${suffix}: ${params.candidate}`);
}
function validateRelativePathWithinBoundary(params) {
  if (params.relativePath === "" || params.relativePath === ".") {
    if (params.options?.allowRoot) return "";
    throwPathEscapesBoundary({
      options: params.options,
      rootResolved: params.rootResolved,
      candidate: params.candidate,
    });
  }
  if (
    params.relativePath === ".." ||
    params.relativePath.startsWith("../") ||
    params.relativePath.startsWith("..\\") ||
    params.isAbsolutePath(params.relativePath)
  )
    throwPathEscapesBoundary({
      options: params.options,
      rootResolved: params.rootResolved,
      candidate: params.candidate,
    });
  return params.relativePath;
}
function toRelativePathUnderRoot(params) {
  const resolvedInput = resolveSandboxInputPath(
    params.candidate,
    params.options?.cwd ?? params.root,
  );
  if (process.platform === "win32") {
    const rootResolved = path.win32.resolve(params.root);
    const resolvedCandidate = path.win32.resolve(resolvedInput);
    const rootForCompare = normalizeWindowsPathForComparison(rootResolved);
    const targetForCompare = normalizeWindowsPathForComparison(resolvedCandidate);
    return validateRelativePathWithinBoundary({
      relativePath: path.win32.relative(rootForCompare, targetForCompare),
      isAbsolutePath: path.win32.isAbsolute,
      options: params.options,
      rootResolved,
      candidate: params.candidate,
    });
  }
  const rootResolved = path.resolve(params.root);
  const resolvedCandidate = path.resolve(resolvedInput);
  return validateRelativePathWithinBoundary({
    relativePath: path.relative(rootResolved, resolvedCandidate),
    isAbsolutePath: path.isAbsolute,
    options: params.options,
    rootResolved,
    candidate: params.candidate,
  });
}
function toRelativeBoundaryPath(params) {
  return toRelativePathUnderRoot({
    root: params.root,
    candidate: params.candidate,
    options: {
      allowRoot: params.options?.allowRoot,
      cwd: params.options?.cwd,
      boundaryLabel: params.boundaryLabel,
      includeRootInError: params.includeRootInError,
    },
  });
}
/**
 * Return a workspace-relative path for a candidate path after rejecting paths
 * that escape the workspace root.
 */
function toRelativeWorkspacePath(root, candidate, options) {
  return toRelativeBoundaryPath({
    root,
    candidate,
    options,
    boundaryLabel: "workspace root",
  });
}
/**
 * Return a sandbox-relative path for a candidate path after rejecting paths that
 * escape the sandbox root. Errors include the sandbox root for operator clarity.
 */
function toRelativeSandboxPath(root, candidate, options) {
  return toRelativeBoundaryPath({
    root,
    candidate,
    options,
    boundaryLabel: "sandbox root",
    includeRootInError: true,
  });
}
/** Resolve a user-supplied path against `cwd` using the sandbox input rules. */
function resolvePathFromInput(filePath, cwd) {
  return path.normalize(resolveSandboxInputPath(filePath, cwd));
}
//#endregion
export { toRelativeSandboxPath as n, toRelativeWorkspacePath as r, resolvePathFromInput as t };
