import {
  n as repairDreamingArtifacts,
  t as auditDreamingArtifacts,
} from "../../dreaming-repair-B7hCsPOf.js";
import { u as configureMemoryCoreDreamingState } from "../../dreaming-state-DLMGVRgZ.js";
import { t as DEFAULT_LOCAL_MODEL } from "../../embedding-defaults-BP3wPc9o.js";
import "../../memory-core-host-status-BYxFcXad.js";
import { t as checkQmdBinaryAvailability } from "../../engine-qmd-sbHvD8ZT.js";
import "../../memory-core-host-embedding-registry-DvATEsxC.js";
import { a as createEmbeddingProvider, t as MemoryIndexManager } from "../../manager-tb_prRdP.js";
import { r as getMemorySearchManager } from "../../memory-BlcuMvNK.js";
import "../../memory-core-host-engine-qmd-Cgk374S9.js";
import "../../provider-env-vars-C9E9mbdp.js";
import { n as listMemoryEmbeddingProviders } from "../../memory-embedding-provider-runtime-DO4orj5r.js";
import { t as getProviderEnvVars } from "../../provider-env-vars-BZiQzob_.js";
import { n as memoryRuntime } from "../../runtime-provider-BpTyTHbP.js";
import { t as hasConfiguredMemorySecretInput } from "../../secret-input-BxM5UYg1.js";
import {
  b as removeGroundedShortTermCandidates,
  s as auditShortTermPromotionArtifacts,
  u as loadShortTermPromotionDreamingStats,
  x as repairShortTermPromotionArtifacts,
} from "../../short-term-promotion-Km7alBR_.js";
import {
  n as resolveMemoryFtsState,
  r as resolveMemoryVectorState,
  t as resolveMemoryCacheSummary,
} from "../../status-format-ExS6-yQO.js";
//#region extensions/memory-core/src/memory/provider-adapters.ts
function getBuiltinMemoryEmbeddingProviderAdapter(id) {
  return listMemoryEmbeddingProviders().find((adapter) => adapter.id === id);
}
function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId) {
  const adapter = getBuiltinMemoryEmbeddingProviderAdapter(providerId);
  if (!adapter) return null;
  const authProviderId = adapter.authProviderId ?? adapter.id;
  return {
    providerId: adapter.id,
    authProviderId,
    envVars: getProviderEnvVars(authProviderId),
    transport: adapter.transport === "local" ? "local" : "remote",
    autoSelectPriority: adapter.autoSelectPriority,
  };
}
function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata() {
  return listMemoryEmbeddingProviders()
    .filter((adapter) => typeof adapter.autoSelectPriority === "number")
    .toSorted((a, b) => (a.autoSelectPriority ?? 0) - (b.autoSelectPriority ?? 0))
    .map((adapter) => {
      const authProviderId = adapter.authProviderId ?? adapter.id;
      return {
        providerId: adapter.id,
        authProviderId,
        envVars: getProviderEnvVars(authProviderId),
        transport: adapter.transport === "local" ? "local" : "remote",
        autoSelectPriority: adapter.autoSelectPriority,
      };
    });
}
//#endregion
export {
  DEFAULT_LOCAL_MODEL,
  MemoryIndexManager,
  auditDreamingArtifacts,
  auditShortTermPromotionArtifacts,
  checkQmdBinaryAvailability,
  configureMemoryCoreDreamingState,
  createEmbeddingProvider,
  getBuiltinMemoryEmbeddingProviderDoctorMetadata,
  getMemorySearchManager,
  hasConfiguredMemorySecretInput,
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata,
  loadShortTermPromotionDreamingStats,
  memoryRuntime,
  removeGroundedShortTermCandidates,
  repairDreamingArtifacts,
  repairShortTermPromotionArtifacts,
  resolveMemoryCacheSummary,
  resolveMemoryFtsState,
  resolveMemoryVectorState,
};
