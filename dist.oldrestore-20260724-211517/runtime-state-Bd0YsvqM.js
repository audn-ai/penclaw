import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.js";
import { t as getActivePluginRegistryWorkspaceDirFromState$1 } from "./runtime-workspace-state-B8jf8nGo.js";
//#region src/plugins/runtime-state.ts
function getPluginRegistryState() {
  return globalThis[PLUGIN_REGISTRY_STATE];
}
function getActivePluginRegistryWorkspaceDirFromState() {
  return getActivePluginRegistryWorkspaceDirFromState$1();
}
//#endregion
export { getPluginRegistryState as n, getActivePluginRegistryWorkspaceDirFromState as t };
