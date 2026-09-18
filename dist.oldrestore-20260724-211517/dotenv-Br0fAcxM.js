import path from "node:path";
import { n as loadWorkspaceDotEnvFile } from "./dotenv-CrR8ttZb.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-Dy5kOq7F.js";
import { u as tryProcessCwd } from "./home-dir-DxrrpDft.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
//#region src/cli/dotenv.ts
/** Load `.env` files for normal CLI commands without overriding existing process env. */
function loadCliDotEnv(opts) {
  const quiet = opts?.quiet ?? true;
  const cwd = tryProcessCwd();
  if (cwd) loadWorkspaceDotEnvFile(path.join(cwd, ".env"), { quiet });
  if (opts?.loadGlobalEnv === false) return;
  loadGlobalRuntimeDotEnvFiles({
    quiet,
    stateEnvPath: path.join(resolveStateDir(process.env), ".env"),
  });
}
//#endregion
export { loadCliDotEnv };
