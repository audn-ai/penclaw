import { j as MemorySearchManager } from "../memory-state-wPutFXhr.js";
import {
  r as PluginStateKeyedStore,
  t as OpenKeyedStoreOptions,
} from "../plugin-state-store.types-xAF7b0j2.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/memory-core-engine-runtime.d.ts
/** Doctor metadata for a built-in memory embedding provider. */
type BuiltinMemoryEmbeddingProviderDoctorMetadata = {
  providerId: string;
  authProviderId: string;
  envVars: string[];
  transport: "local" | "remote";
  autoSelectPriority?: number;
};
/** One issue found while auditing dreaming/session-corpus artifacts. */
type DreamingArtifactsAuditIssue = {
  severity: "warn" | "error";
  code:
    | "dreaming-session-corpus-unreadable"
    | "dreaming-session-corpus-self-ingested"
    | "dreaming-session-ingestion-unreadable"
    | "dreaming-diary-unreadable";
  message: string;
  fixable: boolean;
};
/** Summary of dreaming diary and session-corpus artifact health. */
type DreamingArtifactsAuditSummary = {
  dreamsPath?: string;
  sessionCorpusDir: string;
  sessionCorpusFileCount: number;
  suspiciousSessionCorpusFileCount: number;
  suspiciousSessionCorpusLineCount: number;
  sessionIngestionPath: string;
  sessionIngestionExists: boolean;
  issues: DreamingArtifactsAuditIssue[];
};
/** Result from archiving or repairing problematic dreaming artifacts. */
type RepairDreamingArtifactsResult = {
  changed: boolean;
  archiveDir?: string;
  archivedDreamsDiary: boolean;
  archivedSessionCorpus: boolean;
  archivedSessionIngestion: boolean;
  archivedPaths: string[];
  warnings: string[];
};
/** One issue found while auditing short-term promotion artifacts. */
type ShortTermAuditIssue = {
  severity: "warn" | "error";
  code:
    | "recall-store-unreadable"
    | "recall-store-empty"
    | "recall-store-invalid"
    | "recall-store-over-limit"
    | "recall-lock-stale"
    | "recall-lock-unreadable"
    | "qmd-index-missing"
    | "qmd-index-empty"
    | "qmd-collections-empty";
  message: string;
  fixable: boolean;
};
/** Summary of recall-store and qmd state used by short-term promotion. */
type ShortTermAuditSummary = {
  storePath: string;
  lockPath: string;
  updatedAt?: string;
  exists: boolean;
  entryCount: number;
  promotedCount: number;
  spacedEntryCount: number;
  conceptTaggedEntryCount: number;
  conceptTagScripts?: Record<string, unknown>;
  invalidEntryCount: number;
  issues: ShortTermAuditIssue[];
  qmd?:
    | {
        dbPath?: string;
        collections?: number;
        dbBytes?: number;
      }
    | undefined;
};
/** Result from repairing invalid recall-store entries or stale short-term locks. */
type RepairShortTermPromotionArtifactsResult = {
  changed: boolean;
  removedInvalidEntries: number;
  removedOverflowEntries?: number;
  rewroteStore: boolean;
  removedStaleLock: boolean;
};
type MemoryIndexManagerFacade = {
  get(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status";
  }): Promise<MemorySearchManager | null>;
};
type FacadeModule = {
  configureMemoryCoreDreamingState: (
    openKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>,
  ) => void;
  auditShortTermPromotionArtifacts: (params: {
    workspaceDir: string;
    qmd?: {
      dbPath?: string;
      collections?: number;
    };
  }) => Promise<ShortTermAuditSummary>;
  auditDreamingArtifacts: (params: {
    workspaceDir: string;
  }) => Promise<DreamingArtifactsAuditSummary>;
  getBuiltinMemoryEmbeddingProviderDoctorMetadata: (
    providerId: string,
  ) => BuiltinMemoryEmbeddingProviderDoctorMetadata | null;
  getMemorySearchManager: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
  }) => Promise<{
    manager: MemorySearchManager | null;
    error?: string;
  }>;
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata: () => Array<BuiltinMemoryEmbeddingProviderDoctorMetadata>;
  MemoryIndexManager: MemoryIndexManagerFacade;
  repairShortTermPromotionArtifacts: (params: {
    workspaceDir: string;
  }) => Promise<RepairShortTermPromotionArtifactsResult>;
  repairDreamingArtifacts: (params: {
    workspaceDir: string;
    archiveDiary?: boolean;
    now?: Date;
  }) => Promise<RepairDreamingArtifactsResult>;
};
/** Audit short-term promotion artifacts in an agent workspace. */
declare const auditShortTermPromotionArtifacts: FacadeModule["auditShortTermPromotionArtifacts"];
/** Audit dreaming diary and session-corpus artifacts in an agent workspace. */
declare const auditDreamingArtifacts: FacadeModule["auditDreamingArtifacts"];
/** Resolve doctor metadata for one built-in memory embedding provider. */
declare const getBuiltinMemoryEmbeddingProviderDoctorMetadata: FacadeModule["getBuiltinMemoryEmbeddingProviderDoctorMetadata"];
/** Resolve the active memory search manager and any runtime availability error. */
declare const getMemorySearchManager: FacadeModule["getMemorySearchManager"];
/** List built-in memory embedding providers eligible for automatic selection. */
declare const listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata: FacadeModule["listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata"];
/** Lazy memory index manager facade used by status and runtime callers. */
declare const MemoryIndexManager: FacadeModule["MemoryIndexManager"];
/** Repair invalid recall-store entries and stale short-term promotion locks. */
declare const repairShortTermPromotionArtifacts: FacadeModule["repairShortTermPromotionArtifacts"];
/** Repair or archive problematic dreaming artifacts. */
declare const repairDreamingArtifacts: FacadeModule["repairDreamingArtifacts"];
//#endregion
export {
  BuiltinMemoryEmbeddingProviderDoctorMetadata,
  DreamingArtifactsAuditIssue,
  DreamingArtifactsAuditSummary,
  MemoryIndexManager,
  RepairDreamingArtifactsResult,
  RepairShortTermPromotionArtifactsResult,
  ShortTermAuditIssue,
  ShortTermAuditSummary,
  auditDreamingArtifacts,
  auditShortTermPromotionArtifacts,
  getBuiltinMemoryEmbeddingProviderDoctorMetadata,
  getMemorySearchManager,
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata,
  repairDreamingArtifacts,
  repairShortTermPromotionArtifacts,
};
