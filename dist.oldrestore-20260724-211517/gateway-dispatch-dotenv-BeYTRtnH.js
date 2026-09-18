import fs from "node:fs";
import path from "node:path";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-Dy5kOq7F.js";
import { u as tryProcessCwd } from "./home-dir-DxrrpDft.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
//#region src/cli/gateway-dispatch-dotenv.ts
/** Load only the env files needed before dispatching a command through the gateway. */
async function loadGatewayDispatchCliDotEnv(opts) {
  const quiet = opts?.quiet ?? true;
  const cwd = tryProcessCwd();
  if (cwd && fs.existsSync(path.join(cwd, ".env"))) {
    const { loadCliDotEnv } = await import("./dotenv-Br0fAcxM.js");
    loadCliDotEnv({ quiet });
    return;
  }
  loadGlobalRuntimeDotEnvFiles({
    quiet,
    stateEnvPath: path.join(resolveStateDir(process.env), ".env"),
  });
}
//#endregion
export { loadGatewayDispatchCliDotEnv };
