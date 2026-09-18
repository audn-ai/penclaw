import fs from "node:fs/promises";
import "./utils-DtcDeqWS.js";
import path from "node:path";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/infra/detect-binary.ts
/** Return true when a safe executable name/path can be found on this host. */
async function detectBinary(name) {
  if (!name?.trim()) return false;
  if (!isSafeExecutableValue(name)) return false;
  const resolved = name.startsWith("~") ? resolveUserPath(name) : name;
  if (
    path.isAbsolute(resolved) ||
    resolved.startsWith(".") ||
    resolved.includes("/") ||
    resolved.includes("\\")
  )
    try {
      await fs.access(resolved);
      return true;
    } catch {
      return false;
    }
  const command =
    process.platform === "win32"
      ? [getWindowsSystem32ExePath("where.exe"), name]
      : ["/usr/bin/env", "which", name];
  try {
    const result = await runCommandWithTimeout(command, { timeoutMs: 2e3 });
    return result.code === 0 && result.stdout.trim().length > 0;
  } catch {
    return false;
  }
}
//#endregion
export { detectBinary as t };
