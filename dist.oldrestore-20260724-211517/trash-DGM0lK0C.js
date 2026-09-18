import path from "node:path";
import { l as movePathToTrash$1 } from "./fs-safe-RNq3oO57.js";
import "./browser-config-BYZ1IWa3.js";
import "./config-CzdiqFrD.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
//#region extensions/browser/src/browser/trash.ts
/**
 * Trash helpers for data under the Browser-owned config subtree.
 */
/** Moves a path to trash only when it lives under allowed Browser roots. */
async function movePathToTrash(targetPath) {
  return await movePathToTrash$1(targetPath, { allowedRoots: [path.join(CONFIG_DIR, "browser")] });
}
//#endregion
export { movePathToTrash as t };
