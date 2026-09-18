import {
  n as requireValidConfigSnapshot,
  t as requireValidConfigFileSnapshot$1,
} from "./config-validation-CDkGn-x8.js";
//#region src/commands/agents.command-shared.ts
/** Wrap a runtime so helper setup work stays silent in JSON output paths. */
function createQuietRuntime(runtime) {
  return {
    ...runtime,
    log: () => {},
  };
}
/** Load a config file snapshot and surface validation errors through the runtime. */
async function requireValidConfigFileSnapshot(runtime) {
  return await requireValidConfigFileSnapshot$1(runtime);
}
/** Load the current runtime config and return null after reporting validation failures. */
async function requireValidConfig(runtime) {
  return await requireValidConfigSnapshot(runtime);
}
//#endregion
export { requireValidConfig as n, requireValidConfigFileSnapshot as r, createQuietRuntime as t };
