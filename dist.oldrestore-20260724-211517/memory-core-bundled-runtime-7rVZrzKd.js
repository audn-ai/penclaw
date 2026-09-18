import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader-KNgtRNDP.js";
import "./config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { n as createPluginStateKeyedStore } from "./plugin-state-store-CdAHpy0G.js";
import { n as createConfiguredProviderLocalServiceAcquirer } from "./provider-local-service-DLgcYp6u.js";
//#region src/plugin-sdk/memory-core-bundled-runtime.ts
function loadApiFacadeModule() {
  const module = loadBundledPluginPublicSurfaceModuleSync({
    dirName: "memory-core",
    artifactBasename: "api.js",
  });
  module.configureMemoryCoreDreamingState((options) =>
    createPluginStateKeyedStore("memory-core", options),
  );
  return module;
}
function loadRuntimeFacadeModule() {
  const module = loadBundledPluginPublicSurfaceModuleSync({
    dirName: "memory-core",
    artifactBasename: "runtime-api.js",
  });
  module.configureMemoryCoreDreamingState((options) =>
    createPluginStateKeyedStore("memory-core", options),
  );
  return module;
}
const acquireLocalService = createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig);
/** Create a memory embedding provider with built-in fallback metadata. */
const createEmbeddingProvider = (options) => {
  const createOptions = {
    ...options,
    acquireLocalService,
  };
  return loadRuntimeFacadeModule().createEmbeddingProvider(createOptions);
};
/** Remove short-term recall candidates already grounded into durable memory. */
const removeGroundedShortTermCandidates = (...args) =>
  loadRuntimeFacadeModule().removeGroundedShortTermCandidates(...args);
/** Load short-term dreaming stats for doctor/control status. */
const loadShortTermPromotionDreamingStats = (...args) =>
  loadRuntimeFacadeModule().loadShortTermPromotionDreamingStats(...args);
/** Repair or archive problematic dreaming artifacts through the bundled runtime facade. */
const repairDreamingArtifacts = (...args) =>
  loadRuntimeFacadeModule().repairDreamingArtifacts(...args);
/** Preview grounded REM markdown facts and candidates for selected input files. */
const previewGroundedRemMarkdown = (...args) =>
  loadApiFacadeModule().previewGroundedRemMarkdown(...args);
/** Remove duplicate dreaming diary entries while preserving canonical records. */
const dedupeDreamDiaryEntries = (...args) => loadApiFacadeModule().dedupeDreamDiaryEntries(...args);
/** Write synthetic/backfill dreaming diary entries for harness or migration use. */
const writeBackfillDiaryEntries = (...args) =>
  loadApiFacadeModule().writeBackfillDiaryEntries(...args);
/** Remove dreaming diary entries previously written by the backfill helper. */
const removeBackfillDiaryEntries = (...args) =>
  loadApiFacadeModule().removeBackfillDiaryEntries(...args);
/** Preview REM harness output across dreaming, grounded, and deep promotion candidates. */
const previewRemHarness = (...args) => loadApiFacadeModule().previewRemHarness(...args);
//#endregion
export {
  previewRemHarness as a,
  repairDreamingArtifacts as c,
  previewGroundedRemMarkdown as i,
  writeBackfillDiaryEntries as l,
  dedupeDreamDiaryEntries as n,
  removeBackfillDiaryEntries as o,
  loadShortTermPromotionDreamingStats as r,
  removeGroundedShortTermCandidates as s,
  createEmbeddingProvider as t,
};
