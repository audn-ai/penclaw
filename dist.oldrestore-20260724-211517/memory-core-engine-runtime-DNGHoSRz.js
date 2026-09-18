import { r as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-D2RPlnfc.js";
import "./config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { n as createPluginStateKeyedStore } from "./plugin-state-store-CdAHpy0G.js";
import { n as createConfiguredProviderLocalServiceAcquirer } from "./provider-local-service-DLgcYp6u.js";
//#region src/plugin-sdk/memory-core-engine-runtime.ts
/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Prefer vendor-neutral memory-host SDK subpaths for new plugin code.
 */
function loadFacadeModule() {
  const module = loadActivatedBundledPluginPublicSurfaceModuleSync({
    dirName: "memory-core",
    artifactBasename: "runtime-api.js",
  });
  module.configureMemoryCoreDreamingState((options) =>
    createPluginStateKeyedStore("memory-core", options),
  );
  return module;
}
const acquireLocalService = createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig);
/** Audit short-term promotion artifacts in an agent workspace. */
const auditShortTermPromotionArtifacts = (...args) =>
  loadFacadeModule()["auditShortTermPromotionArtifacts"](...args);
/** Audit dreaming diary and session-corpus artifacts in an agent workspace. */
const auditDreamingArtifacts = (...args) => loadFacadeModule()["auditDreamingArtifacts"](...args);
/** Resolve doctor metadata for one built-in memory embedding provider. */
const getBuiltinMemoryEmbeddingProviderDoctorMetadata = (...args) =>
  loadFacadeModule()["getBuiltinMemoryEmbeddingProviderDoctorMetadata"](...args);
/** Resolve the active memory search manager and any runtime availability error. */
const getMemorySearchManager = (params) => {
  const managerParams = {
    ...params,
    acquireLocalService,
  };
  return loadFacadeModule()["getMemorySearchManager"](managerParams);
};
/** List built-in memory embedding providers eligible for automatic selection. */
const listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata = (...args) =>
  loadFacadeModule()["listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata"](...args);
/** Lazy memory index manager facade used by status and runtime callers. */
const MemoryIndexManager = {
  async get(params) {
    const managerParams = {
      ...params,
      acquireLocalService,
    };
    return await loadFacadeModule()["MemoryIndexManager"].get(managerParams);
  },
};
/** Repair invalid recall-store entries and stale short-term promotion locks. */
const repairShortTermPromotionArtifacts = (...args) =>
  loadFacadeModule()["repairShortTermPromotionArtifacts"](...args);
/** Repair or archive problematic dreaming artifacts. */
const repairDreamingArtifacts = (...args) => loadFacadeModule()["repairDreamingArtifacts"](...args);
//#endregion
export {
  getMemorySearchManager as a,
  repairShortTermPromotionArtifacts as c,
  getBuiltinMemoryEmbeddingProviderDoctorMetadata as i,
  auditDreamingArtifacts as n,
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata as o,
  auditShortTermPromotionArtifacts as r,
  repairDreamingArtifacts as s,
  MemoryIndexManager as t,
};
