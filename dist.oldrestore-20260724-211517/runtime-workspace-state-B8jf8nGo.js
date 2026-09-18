import { AsyncLocalStorage } from "node:async_hooks";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.js";
//#region src/plugins/runtime-workspace-state.ts
const pinnedWorkspaceDirStorage = resolveGlobalSingleton(
  Symbol.for("openclaw.pinnedPluginRegistryWorkspaceDir"),
  () => new AsyncLocalStorage(),
);
/** Reads the active plugin registry workspace directory from global runtime state,
 *  respecting any pinned workspace from the current async context. */
function getActivePluginRegistryWorkspaceDirFromState() {
  const pinned = pinnedWorkspaceDirStorage.getStore();
  if (pinned) return pinned.workspaceDir;
  return globalThis[PLUGIN_REGISTRY_STATE]?.workspaceDir ?? void 0;
}
/**
 * Pin the active plugin-registry workspace dir for the duration of `fn`.
 * While pinned, calls to `getActivePluginRegistryWorkspaceDirFromState()` return
 * the snapshot taken at pin time, ignoring concurrent mutations from other
 * agent turns or crons. This prevents per-row memo-busting in operations that
 * iterate over many rows (e.g. sessions.list).
 */
function withPinnedActivePluginRegistryWorkspaceDir(fn) {
  if (pinnedWorkspaceDirStorage.getStore()) return fn();
  const workspaceDir = globalThis[PLUGIN_REGISTRY_STATE]?.workspaceDir ?? void 0;
  return pinnedWorkspaceDirStorage.run({ workspaceDir }, fn);
}
//#endregion
export {
  withPinnedActivePluginRegistryWorkspaceDir as n,
  getActivePluginRegistryWorkspaceDirFromState as t,
};
