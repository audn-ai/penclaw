import { f as RegisteredMemorySearchManager } from "../memory-state-wPutFXhr.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/memory-host-search.d.ts
type ActiveMemorySearchPurpose = "default" | "status";
/** Active manager lookup result, including a soft error when memory is unavailable. */
type ActiveMemorySearchManagerResult = {
  manager: RegisteredMemorySearchManager | null;
  error?: string;
};
/** Loads the active memory search manager for one agent and purpose. */
declare function getActiveMemorySearchManager(params: {
  cfg: OpenClawConfig;
  agentId: string;
  purpose?: ActiveMemorySearchPurpose;
}): Promise<ActiveMemorySearchManagerResult>;
/** Closes every active memory search manager for the provided config. */
declare function closeActiveMemorySearchManagers(cfg?: OpenClawConfig): Promise<void>;
/** Closes the active memory search manager for one agent. */
declare function closeActiveMemorySearchManager(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): Promise<void>;
//#endregion
export {
  ActiveMemorySearchManagerResult,
  closeActiveMemorySearchManager,
  closeActiveMemorySearchManagers,
  getActiveMemorySearchManager,
};
