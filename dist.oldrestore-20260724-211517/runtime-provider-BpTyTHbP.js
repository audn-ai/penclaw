import { t as resolveMemoryBackendConfig } from "./backend-config-B4LH5mk9.js";
import "./memory-core-host-runtime-files-DtgL-bJu.js";
import {
  n as closeMemorySearchManager,
  r as getMemorySearchManager,
  t as closeAllMemorySearchManagers,
} from "./memory-BlcuMvNK.js";
//#region extensions/memory-core/src/runtime-provider.ts
function createMemoryRuntime(acquireLocalService) {
  return {
    async getMemorySearchManager(params) {
      const { manager, debug, error } = await getMemorySearchManager({
        ...params,
        ...(acquireLocalService ? { acquireLocalService } : {}),
      });
      return {
        manager,
        debug,
        error,
      };
    },
    resolveMemoryBackendConfig(params) {
      return resolveMemoryBackendConfig(params);
    },
    async closeAllMemorySearchManagers() {
      await closeAllMemorySearchManagers();
    },
    async closeMemorySearchManager(params) {
      await closeMemorySearchManager(params);
    },
  };
}
const memoryRuntime = createMemoryRuntime();
//#endregion
export { memoryRuntime as n, createMemoryRuntime as t };
