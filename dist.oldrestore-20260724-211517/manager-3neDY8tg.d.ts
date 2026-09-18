import { DatabaseSync } from "node:sqlite";
import { FSWatcher } from "chokidar";
import { t as MemoryCoreAcquireLocalService } from "./embedding-local-service-6ShbpdO7.js";
import {
  n as MemorySearchResult,
  r as MemorySource,
  t as MemoryEmbeddingProbeResult,
} from "./memory-core-host-engine-storage-DWA5F9Hz.js";
import {
  F as MemorySyncParams,
  N as MemorySearchRuntimeDebug,
  P as MemorySessionSyncTarget,
  j as MemorySearchManager,
  k as MemoryProviderStatus,
} from "./memory-state-wPutFXhr.js";
import {
  Fo as MemoryEmbeddingProviderCreateOptions,
  Mo as MemoryEmbeddingProvider,
  Ro as MemoryEmbeddingProviderRuntime,
  Us as EmbeddingInput,
  oc as ResolvedMemorySearchConfig,
} from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region extensions/memory-core/src/memory/embeddings.d.ts
type EmbeddingProvider = MemoryEmbeddingProvider;
type EmbeddingProviderId = string;
type EmbeddingProviderRequest = string;
type EmbeddingProviderFallback = string;
type EmbeddingProviderRuntime = MemoryEmbeddingProviderRuntime;
type EmbeddingProviderResult = {
  provider: EmbeddingProvider | null;
  requestedProvider: EmbeddingProviderRequest;
  fallbackFrom?: string;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  runtime?: EmbeddingProviderRuntime;
};
type CreateEmbeddingProviderOptions = MemoryEmbeddingProviderCreateOptions & {
  provider: EmbeddingProviderRequest;
  fallback: EmbeddingProviderFallback;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
declare function createEmbeddingProvider(
  options: CreateEmbeddingProviderOptions,
): Promise<EmbeddingProviderResult>;
//#endregion
//#region extensions/memory-core/src/memory/manager-reindex-state.d.ts
type MemoryIndexMeta = {
  model: string;
  provider: string;
  providerKey?: string;
  sources?: MemorySource[];
  scopeHash?: string;
  chunkTokens: number;
  chunkOverlap: number;
  vectorDims?: number;
  ftsTokenizer?: string;
};
type MemoryIndexIdentityState =
  | {
      status: "valid";
    }
  | {
      status: "missing";
      reason: string;
    }
  | {
      status: "mismatched";
      reason: string;
    };
type MemoryIndexProviderIdentity = {
  provider: string;
  model: string;
  providerKey: string;
};
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-state.d.ts
type MemoryProviderLifecycleState =
  | {
      mode: "pending";
      requestedProvider: string;
    }
  | {
      mode: "active";
      providerId: string;
    }
  | {
      mode: "degraded";
      providerId: string;
      reason: string;
      code?: string;
    }
  | {
      mode: "fallback-active";
      providerId: string;
      fallbackFrom: string;
      reason: string;
    }
  | {
      mode: "fts-only";
      reason: string;
      attemptedProviderId?: string;
    };
//#endregion
//#region extensions/memory-core/src/memory/watch-settle.d.ts
type MemoryWatchEventStats = {
  isDirectory?: () => boolean;
  size?: number;
  mtimeMs?: number;
};
type WatchPathSnapshot = {
  size: number;
  mtimeMs: number;
};
type MemoryWatchSettleQueue = Map<string, WatchPathSnapshot | null>;
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.d.ts
type MemoryIndexEntry$1 = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  kind?: "markdown" | "multimodal";
  content?: string;
  contentText?: string;
  lineMap?: number[];
};
type MemoryIndexWorkItem = {
  entry: MemoryIndexEntry$1;
  source: MemorySource;
  afterIndex?: () => void;
};
type MemorySessionDeltaState = {
  lastSize: number;
  pendingBytes: number;
  pendingMessages: number;
};
type MemorySessionTranscriptUpdate = {
  agentId?: string;
  sessionFile?: string;
  sessionKey?: string;
  target?: {
    agentId: string;
    sessionId: string;
    sessionKey: string;
  };
};
declare abstract class MemoryManagerSyncOps {
  protected readonly acquireLocalService?: MemoryCoreAcquireLocalService;
  protected abstract readonly cfg: OpenClawConfig;
  protected abstract readonly agentId: string;
  protected abstract readonly workspaceDir: string;
  protected abstract readonly settings: ResolvedMemorySearchConfig;
  protected provider: EmbeddingProvider | null;
  protected fallbackFrom?: EmbeddingProviderId;
  protected abstract providerUnavailableReason?: string;
  protected abstract providerLifecycle: MemoryProviderLifecycleState;
  protected providerRuntime?: EmbeddingProviderRuntime;
  protected abstract batch: {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected readonly sources: Set<MemorySource>;
  protected providerKey: string | null;
  protected abstract readonly vector: {
    enabled: boolean;
    available: boolean | null;
    semanticAvailable?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  protected readonly fts: {
    enabled: boolean;
    available: boolean;
    loadError?: string;
  };
  protected vectorReady: Promise<boolean> | null;
  protected watcher: FSWatcher | null;
  private nativeMemoryWatchPairs;
  protected watchTimer: NodeJS.Timeout | null;
  protected sessionWatchTimer: NodeJS.Timeout | null;
  protected sessionUnsubscribe: (() => void) | null;
  protected fallbackReason?: string;
  protected intervalTimer: NodeJS.Timeout | null;
  protected memoryWatchPressureStartupTimer: NodeJS.Timeout | null;
  protected closed: boolean;
  protected dirty: boolean;
  protected memoryFullRetryDirty: boolean;
  protected pendingWatchPaths: MemoryWatchSettleQueue;
  protected sessionsDirty: boolean;
  protected sessionsFullRetryDirty: boolean;
  private readonly memoryWatchPressureWarning;
  protected sessionsDirtyFiles: Set<string>;
  protected sessionPendingFiles: Set<string>;
  protected sessionPendingTargets: Map<string, MemorySessionSyncTarget>;
  protected sessionDeltas: Map<string, MemorySessionDeltaState>;
  protected vectorDegradedWriteWarningShown: boolean;
  private lastMetaSerialized;
  protected abstract readonly cache: {
    enabled: boolean;
    maxEntries?: number;
  };
  protected abstract db: DatabaseSync;
  protected abstract computeProviderKey(): string;
  protected abstract resolveProviderIndexIdentities(): MemoryIndexProviderIdentity[];
  protected abstract sync(params?: MemorySyncParams): Promise<void>;
  protected abstract withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    message: string,
  ): Promise<T>;
  protected abstract getIndexConcurrency(): number;
  protected abstract pruneEmbeddingCacheIfNeeded(): void;
  protected abstract resetProviderInitializationForRetry(): void;
  protected abstract assertRequiredProviderAvailable(operation: "search" | "sync"): void;
  protected abstract indexFile(
    entry: MemoryIndexEntry$1,
    options: {
      source: MemorySource;
      content?: string;
    },
  ): Promise<void>;
  protected indexFiles(items: MemoryIndexWorkItem[]): Promise<void>;
  private emptySourceSyncPlan;
  private snapshotReindexRetryState;
  private restoreReindexRetryState;
  private markFailedFullReindexRetry;
  private clearSessionRetryState;
  private clearMemoryRetryState;
  private refreshSessionDirtyFlag;
  private shouldDeferSourceWideBatch;
  private indexQueuedFiles;
  private executeSourceSyncPlans;
  private executeSourceWideSync;
  protected hasIndexedChunks(): boolean;
  protected hasSemanticChunks(): boolean;
  protected resolveCurrentIndexIdentityState(params?: {
    meta?: MemoryIndexMeta | null;
    provider?: {
      id: string;
      model: string;
    } | null;
    providerKeyKnown?: boolean;
    vectorReady?: boolean;
    hasIndexedChunks?: boolean;
  }): MemoryIndexIdentityState;
  protected resetVectorState(): void;
  protected ensureVectorReady(dimensions?: number): Promise<boolean>;
  private loadVectorExtension;
  private ensureVectorTable;
  private dropLegacyVectorTable;
  private dropVectorTable;
  protected buildSourceFilter(
    alias?: string,
    sourcesOverride?: MemorySource[],
  ): {
    sql: string;
    params: MemorySource[];
  };
  protected openDatabase(): DatabaseSync;
  private seedEmbeddingCache;
  protected ensureSchema(): void;
  protected ensureWatcher(): void;
  private scheduleMemoryWatchPressureStartupCheck;
  private warnIfMemoryWatchPressure;
  private currentMemoryChokidarWatcher;
  protected attachNativeMemoryWatchForDir(
    dir: string,
    markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void,
  ): boolean;
  protected attachLinuxMemoryDirectoryTreeWatchForDir(
    dir: string,
    markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void,
  ): boolean;
  private attachLinuxMemoryDirectoryTreeSubtree;
  private closeNativeMemoryWatchPair;
  protected closeNativeMemoryWatchPairs(): void;
  private removeNativeMemoryParentWatch;
  private removeNativeMemoryWatchPair;
  protected attachMemoryChokidarFallback(
    dir: string,
    markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void,
  ): void;
  protected ensureSessionListener(): void;
  protected subscribeSessionTranscriptUpdates(
    listener: (update: MemorySessionTranscriptUpdate) => void,
  ): () => void;
  private scheduleCorpusSessionFileDirty;
  protected ensureSessionStartupCatchup(): void;
  protected markSessionStartupCatchupDirtyFiles(): Promise<string[]>;
  protected runSessionStartupCatchup(): Promise<string[]>;
  private scheduleSessionDirty;
  private processSessionDeltaBatch;
  private updateSessionDelta;
  private countNewlines;
  private resetSessionDelta;
  private isSessionFileForAgent;
  private resolveSessionTranscriptUpdateSyncTarget;
  private normalizeTargetArchiveFiles;
  private normalizeTargetSessions;
  private resolveArchiveFilesForSyncTargets;
  private combineTargetArchiveFiles;
  private memorySessionSyncTargetKey;
  protected ensureIntervalSync(): void;
  private scheduleWatchSync;
  private shouldSyncSessions;
  private syncMemoryFiles;
  private syncArchiveFiles;
  private createSyncProgress;
  private assertFtsOnlySyncAllowed;
  protected runSync(params?: MemorySyncParams): Promise<void>;
  protected shouldFallbackOnError(err: unknown): boolean;
  private hasRequestedTargetSessionSync;
  protected resolveBatchConfig(): {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected activateFallbackProvider(reason: string): Promise<boolean>;
  private runInPlaceReindex;
  protected readMeta(): MemoryIndexMeta | null;
  protected writeMeta(meta: MemoryIndexMeta): void;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.d.ts
type MemoryIndexEntry = MemoryIndexWorkItem["entry"];
declare abstract class MemoryManagerEmbeddingOps extends MemoryManagerSyncOps {
  protected abstract batchFailureCount: number;
  protected abstract batchFailureLastError?: string;
  protected abstract batchFailureLastProvider?: string;
  protected abstract batchFailureLock: Promise<void>;
  protected abstract markLocalEmbeddingProviderDegraded(err: unknown): void;
  protected pruneEmbeddingCacheIfNeeded(): void;
  private upsertEmbeddingCacheEntries;
  private embedChunksInBatches;
  protected computeProviderKey(): string;
  protected resolveProviderIndexIdentities(): MemoryIndexProviderIdentity[];
  private buildBatchDebug;
  private embedChunksWithBatch;
  private collectCachedEmbeddings;
  protected embedBatchWithRetry(texts: string[]): Promise<number[][]>;
  protected embedBatchInputsWithRetry(inputs: EmbeddingInput[]): Promise<number[][]>;
  private waitForEmbeddingRetry;
  private resolveEmbeddingTimeout;
  protected embedQueryWithRetry(text: string, signal?: AbortSignal): Promise<number[]>;
  protected withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T>;
  private withBatchFailureLock;
  private resetBatchFailureCount;
  private recordBatchFailure;
  private runBatchWithTimeoutRetry;
  private runBatchWithFallback;
  protected getIndexConcurrency(): number;
  private clearIndexedFileData;
  private upsertFileRecord;
  private deleteFileRecord;
  /**
   * Write chunks (and optional embeddings) for a file into the index.
   * Handles both the chunks table, the vector table, and the FTS table.
   * Pass an empty embeddings array to skip vector writes (FTS-only mode).
   */
  private writeChunks;
  private prepareIndexEntry;
  protected indexFiles(items: MemoryIndexWorkItem[]): Promise<void>;
  protected indexFile(
    entry: MemoryIndexEntry,
    options: {
      source: MemorySource;
      content?: string;
    },
  ): Promise<void>;
}
//#endregion
//#region extensions/memory-core/src/memory/manager.d.ts
type MemoryIndexManagerPurpose = "default" | "status" | "cli";
declare function closeAllMemoryIndexManagers(): Promise<void>;
declare function closeMemoryIndexManagersForAgent(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): Promise<void>;
declare class MemoryIndexManager extends MemoryManagerEmbeddingOps implements MemorySearchManager {
  private readonly cacheKey;
  private readonly purpose;
  protected readonly acquireLocalService?: MemoryCoreAcquireLocalService;
  protected readonly cfg: OpenClawConfig;
  protected readonly agentId: string;
  protected readonly workspaceDir: string;
  protected readonly settings: ResolvedMemorySearchConfig;
  private readonly providerRequirement;
  protected provider: EmbeddingProvider | null;
  private readonly requestedProvider;
  private providerInitPromise;
  private providerInitialized;
  protected fallbackFrom?: EmbeddingProviderId;
  protected fallbackReason?: string;
  protected providerUnavailableReason?: string;
  protected providerLifecycle: MemoryProviderLifecycleState;
  protected providerRuntime?: EmbeddingProviderRuntime;
  protected batch: {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected batchFailureCount: number;
  protected batchFailureLastError?: string;
  protected batchFailureLastProvider?: string;
  protected batchFailureLock: Promise<void>;
  protected db: DatabaseSync;
  protected readonly sources: Set<MemorySource>;
  protected providerKey: string;
  protected readonly cache: {
    enabled: boolean;
    maxEntries?: number;
  };
  protected readonly vector: {
    enabled: boolean;
    available: boolean | null;
    semanticAvailable?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  protected readonly fts: {
    enabled: boolean;
    available: boolean;
    loadError?: string;
  };
  protected vectorReady: Promise<boolean> | null;
  protected watcher: FSWatcher | null;
  protected watchTimer: NodeJS.Timeout | null;
  protected sessionWatchTimer: NodeJS.Timeout | null;
  protected sessionUnsubscribe: (() => void) | null;
  protected intervalTimer: NodeJS.Timeout | null;
  protected memoryWatchPressureStartupTimer: NodeJS.Timeout | null;
  protected closed: boolean;
  protected dirty: boolean;
  protected sessionsDirty: boolean;
  protected sessionsDirtyFiles: Set<string>;
  protected sessionPendingFiles: Set<string>;
  protected sessionPendingTargets: Map<string, MemorySessionSyncTarget>;
  private indexIdentityDirty;
  protected sessionDeltas: Map<
    string,
    {
      lastSize: number;
      pendingBytes: number;
      pendingMessages: number;
    }
  >;
  private sessionWarm;
  private syncing;
  private queuedArchiveFiles;
  private queuedSessions;
  private queuedSessionSync;
  private readonlyRecoveryAttempts;
  private readonlyRecoverySuccesses;
  private readonlyRecoveryFailures;
  private readonlyRecoveryLastError?;
  private indexIdentityState;
  private static loadProviderResult;
  static get(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: MemoryIndexManagerPurpose;
    acquireLocalService?: MemoryCoreAcquireLocalService;
  }): Promise<MemoryIndexManager | null>;
  private constructor();
  private applyProviderResult;
  private ensureProviderInitialized;
  protected resetProviderInitializationForRetry(): void;
  protected markLocalEmbeddingProviderDegraded(err: unknown): void;
  protected isRequiredProviderUnavailable(): boolean;
  protected buildRequiredProviderUnavailableError(operation: "search" | "sync"): Error;
  protected assertRequiredProviderAvailable(operation: "search" | "sync"): void;
  warmSession(sessionKey?: string): Promise<void>;
  private refreshIndexIdentityDirty;
  search(
    query: string,
    opts?: {
      maxResults?: number;
      minScore?: number;
      sessionKey?: string;
      qmdSearchModeOverride?: "query" | "search" | "vsearch";
      onDebug?: (
        debug: MemorySearchRuntimeDebug,
      ) => void /** When set, only these chunk sources are considered (must be enabled for this manager). */;
      sources?: MemorySource[] /** Caller-owned cancellation; aborts in-flight embedding work when the caller stops waiting. */;
      signal?: AbortSignal;
    },
  ): Promise<MemorySearchResult[]>;
  private selectScoredResults;
  private rankKeywordOnlyResults;
  private finalizeKeywordOnlyResults;
  private hasIndexedContent;
  private searchVector;
  private buildFtsQuery;
  private searchKeyword;
  private searchKeywordWithFallback;
  private resolveKeywordFallbackTerms;
  private mergeKeywordSearchHits;
  private limitKeywordSearchHits;
  private toMemorySearchResults;
  private mergeHybridResults;
  sync(params?: MemorySyncParams): Promise<void>;
  private enqueueTargetedSessionSync;
  private runSyncWithReadonlyRecovery;
  readFile(params: { relPath: string; from?: number; lines?: number }): Promise<{
    text: string;
    path: string;
  }>;
  status(): MemoryProviderStatus;
  probeVectorAvailability(): Promise<boolean>;
  probeVectorStoreAvailability(): Promise<boolean>;
  private cacheProbeResult;
  getCachedEmbeddingAvailability(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  close(): Promise<void>;
}
//#endregion
export {
  createEmbeddingProvider as i,
  closeAllMemoryIndexManagers as n,
  closeMemoryIndexManagersForAgent as r,
  MemoryIndexManager as t,
};
