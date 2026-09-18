import fs from "node:fs/promises";
import "./path-guards-CBe_wA_B.js";
import "./local-file-access-CBe_wA_B.js";
import path from "node:path";
import { t as isInboundPathAllowed } from "./inbound-path-policy-CH_uJYn5.js";
import { a as getDefaultMediaLocalRoots } from "./local-roots-CgMgS9r2.js";
import { a as resolveInboundMediaReference } from "./media-reference-Cboth956.js";
import { g as assertNoWindowsNetworkPath, i as isPathInside } from "./path-DILYn_gk.js";
//#region src/media/local-media-access.ts
/** Error raised when a local media path escapes the configured allowlist. */
var LocalMediaAccessError = class extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
    this.name = "LocalMediaAccessError";
  }
};
/** Returns the default root allowlist for local media reads. */
function getDefaultLocalRoots() {
  return getDefaultMediaLocalRoots();
}
/** Resolves an allowlist once for callers that validate several media paths. */
async function resolveLocalMediaRoots(localRoots) {
  const roots = localRoots ?? getDefaultLocalRoots();
  return await Promise.all(
    roots.map(async (root) => {
      let resolvedRoot;
      try {
        resolvedRoot = await fs.realpath(root);
      } catch {
        resolvedRoot = path.resolve(root);
      }
      if (resolvedRoot === path.parse(resolvedRoot).root)
        throw new LocalMediaAccessError(
          "invalid-root",
          `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`,
        );
      return resolvedRoot;
    }),
  );
}
/** Verifies that a local media path is managed inbound media or lives under allowed roots. */
async function assertLocalMediaAllowed(mediaPath, localRoots, options) {
  if (localRoots === "any") return;
  if (await resolveInboundMediaReference(mediaPath).catch(() => null)) return;
  try {
    assertNoWindowsNetworkPath(mediaPath, "Local media path");
  } catch (err) {
    throw new LocalMediaAccessError("network-path-not-allowed", err.message, { cause: err });
  }
  if (
    options?.inboundRoots?.length &&
    isInboundPathAllowed({
      filePath: mediaPath,
      roots: options.inboundRoots,
    })
  )
    return;
  const roots = localRoots ?? getDefaultLocalRoots();
  let resolved;
  try {
    resolved = await fs.realpath(mediaPath);
  } catch {
    resolved = path.resolve(mediaPath);
  }
  if (localRoots === void 0) {
    const workspaceRoot = roots.find((root) => path.basename(root) === "workspace");
    if (workspaceRoot) {
      const stateDir = path.dirname(workspaceRoot);
      const rel = path.relative(stateDir, resolved);
      if (rel && isPathInside(stateDir, resolved)) {
        if ((rel.split(path.sep)[0] ?? "").startsWith("workspace-"))
          throw new LocalMediaAccessError(
            "path-not-allowed",
            `Local media path is not under an allowed directory: ${mediaPath}`,
          );
      }
    }
  }
  const resolvedRoots =
    options?.resolvedRoots ??
    (await options?.resolveRoots?.()) ??
    (await resolveLocalMediaRoots(roots));
  for (const [index, resolvedRoot] of resolvedRoots.entries()) {
    const root = roots[index] ?? resolvedRoot;
    if (resolvedRoot === path.parse(resolvedRoot).root)
      throw new LocalMediaAccessError(
        "invalid-root",
        `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`,
      );
    if (isPathInside(resolvedRoot, resolved)) return;
  }
  throw new LocalMediaAccessError(
    "path-not-allowed",
    `Local media path is not under an allowed directory: ${mediaPath}`,
  );
}
//#endregion
export {
  resolveLocalMediaRoots as i,
  assertLocalMediaAllowed as n,
  getDefaultLocalRoots as r,
  LocalMediaAccessError as t,
};
