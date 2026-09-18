import path from "node:path";
import { c as resolveMediaReferenceSandboxPath } from "./media-reference-Cboth956.js";
import {
  n as normalizeContainerPath,
  t as isPathInsideContainerRoot,
} from "./path-utils-Dj-M9hwE.js";
import { n as assertSandboxPath } from "./sandbox-paths-DxDLkOQF.js";
//#region src/agents/sandbox-media-paths.ts
/**
 * Sandbox media path resolution helpers.
 *
 * Bridges media references through sandbox filesystems while enforcing workspace-only boundaries when required.
 */
function createSandboxBridgeReadFile(params) {
  return async (filePath) =>
    await params.sandbox.bridge.readFile({
      filePath,
      cwd: params.sandbox.root,
    });
}
async function resolveSandboxedBridgeMediaPath(params) {
  const normalizeFileUrl = (rawPath) =>
    rawPath.startsWith("file://") ? rawPath.slice(7) : rawPath;
  const mediaPathInfo = params.inboundFallbackDir
    ? resolveMediaReferenceSandboxPath(params.mediaPath, params.inboundFallbackDir)
    : { resolved: params.mediaPath };
  const filePath = normalizeFileUrl(mediaPathInfo.resolved);
  const rewrittenFrom = mediaPathInfo.rewrittenFrom;
  if (rewrittenFrom) {
    if (
      !(await params.sandbox.bridge.stat({
        filePath,
        cwd: params.sandbox.root,
      }))
    )
      throw new Error(`Sandbox media reference is not staged: ${rewrittenFrom}`);
  }
  const enforceWorkspaceBoundary = async (resolved) => {
    if (!params.sandbox.workspaceOnly) return;
    if (resolved.hostPath) {
      await assertSandboxPath({
        filePath: resolved.hostPath,
        cwd: params.sandbox.root,
        root: params.sandbox.root,
      });
      return;
    }
    if (
      !isPathInsideContainerRoot(
        normalizeContainerPath(
          params.sandbox.bridge.resolvePath({
            filePath: params.sandbox.root,
            cwd: params.sandbox.root,
          }).containerPath,
        ),
        normalizeContainerPath(resolved.containerPath),
      )
    )
      throw new Error(`Sandbox path escapes workspace root: ${resolved.containerPath}`);
  };
  const resolveDirect = () =>
    params.sandbox.bridge.resolvePath({
      filePath,
      cwd: params.sandbox.root,
    });
  try {
    const resolved = resolveDirect();
    await enforceWorkspaceBoundary(resolved);
    return {
      resolved: resolved.hostPath ?? resolved.containerPath,
      ...(rewrittenFrom ? { rewrittenFrom } : {}),
    };
  } catch (err) {
    const fallbackDir = params.inboundFallbackDir?.trim();
    if (!fallbackDir) throw err;
    const fallbackPath = path.join(fallbackDir, path.basename(filePath));
    try {
      if (
        !(await params.sandbox.bridge.stat({
          filePath: fallbackPath,
          cwd: params.sandbox.root,
        }))
      )
        throw err;
    } catch {
      throw err;
    }
    const resolvedFallback = params.sandbox.bridge.resolvePath({
      filePath: fallbackPath,
      cwd: params.sandbox.root,
    });
    await enforceWorkspaceBoundary(resolvedFallback);
    return {
      resolved: resolvedFallback.hostPath ?? resolvedFallback.containerPath,
      rewrittenFrom: filePath,
    };
  }
}
//#endregion
export { resolveSandboxedBridgeMediaPath as n, createSandboxBridgeReadFile as t };
