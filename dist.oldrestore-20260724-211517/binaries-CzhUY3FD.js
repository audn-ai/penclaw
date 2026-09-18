import { n as runExec } from "./exec-CXKmx4dL.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/infra/binaries.ts
async function ensureBinary(name, exec = runExec, runtime = defaultRuntime) {
  await exec("which", [name]).catch(() => {
    runtime.error(`Missing required binary: ${name}. Please install it.`);
    runtime.exit(1);
  });
}
//#endregion
export { ensureBinary };
