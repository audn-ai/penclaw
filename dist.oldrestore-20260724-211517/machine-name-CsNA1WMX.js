import os from "node:os";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/machine-name.ts
let cachedPromise = null;
async function tryScutil(key) {
  try {
    const { stdout } = await runExec("/usr/sbin/scutil", ["--get", key], {
      logOutput: false,
      timeoutMs: 1e3,
    });
    const value = normalizeOptionalString(stdout) ?? "";
    return value.length > 0 ? value : null;
  } catch {
    return null;
  }
}
function fallbackHostName() {
  return (normalizeOptionalString(os.hostname()) ?? "").replace(/\.local$/i, "") || "openclaw";
}
/** Resolve a user-facing name for the current machine. */
async function getMachineDisplayName() {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    if (process.env.VITEST || false) return fallbackHostName();
    if (process.platform === "darwin") {
      const computerName = await tryScutil("ComputerName");
      if (computerName) return computerName;
      const localHostName = await tryScutil("LocalHostName");
      if (localHostName) return localHostName;
    }
    return fallbackHostName();
  })();
  return cachedPromise;
}
//#endregion
export { getMachineDisplayName as t };
