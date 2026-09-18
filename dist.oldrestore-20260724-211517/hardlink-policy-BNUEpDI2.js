import path from "node:path";
import { f as safeRealpathSync } from "./path-DILYn_gk.js";
import "./path-safety-4zNHq1Ot.js";
import { m as resolveIsNixMode } from "./paths-DEklnbzU.js";
//#region src/plugins/hardlink-policy.ts
/** Enforces plugin root hardlink policy with bundled and immutable Nix-store exceptions. */
const NIX_STORE_ROOT = "/nix/store";
/** Returns true when a plugin root resolves inside the immutable Nix store. */
function isNixStorePluginRoot(rootDir, realpathCache) {
  const rootRealPath = safeRealpathSync(rootDir, realpathCache) ?? path.resolve(rootDir);
  return rootRealPath === NIX_STORE_ROOT || rootRealPath.startsWith(`${NIX_STORE_ROOT}/`);
}
/** Decides whether plugin file hardlinks should fail boundary validation for one root. */
function shouldRejectHardlinkedPluginFiles(params) {
  if (params.origin === "bundled") return false;
  if (resolveIsNixMode(params.env) && isNixStorePluginRoot(params.rootDir, params.realpathCache))
    return false;
  return true;
}
//#endregion
export { shouldRejectHardlinkedPluginFiles as t };
