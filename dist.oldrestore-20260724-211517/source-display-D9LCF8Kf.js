import path from "node:path";
import { i as isPathInside } from "./path-DILYn_gk.js";
import "./path-guards-CBe_wA_B.js";
import { n as resolvePluginSourceRoots } from "./roots-62ohA5O8.js";
import { m as shortenHomeInString } from "./utils-DtcDeqWS.js";
//#region src/plugins/source-display.ts
/** Formats plugin source paths for user-facing status output. */
function tryRelative(root, filePath) {
  if (!isPathInside(root, filePath)) return null;
  const rel = path.relative(root, filePath);
  if (!rel || rel === ".") return null;
  return rel.replaceAll("\\", "/");
}
/** Formats a plugin source path for status tables using known source roots. */
function formatPluginSourceForTable(plugin, roots) {
  const raw = plugin.source;
  if (plugin.origin === "bundled" && roots.stock) {
    const rel = tryRelative(roots.stock, raw);
    if (rel)
      return {
        value: `stock:${rel}`,
        rootKey: "stock",
      };
  }
  if (plugin.origin === "workspace" && roots.workspace) {
    const rel = tryRelative(roots.workspace, raw);
    if (rel)
      return {
        value: `workspace:${rel}`,
        rootKey: "workspace",
      };
  }
  if (plugin.origin === "global" && roots.global) {
    const rel = tryRelative(roots.global, raw);
    if (rel)
      return {
        value: `global:${rel}`,
        rootKey: "global",
      };
  }
  return { value: shortenHomeInString(raw) };
}
//#endregion
export { formatPluginSourceForTable, resolvePluginSourceRoots };
