import { n as AcpRuntimeError } from "./errors-Buu3ylDF.js";
import { i as requireAcpRuntimeBackend, n as getAcpRuntimeBackend } from "./registry-CpUYxH9H.js";
import {
  a as SessionAcpIdentity,
  c as SessionAcpMeta,
  i as AcpSessionRuntimeOptions,
} from "./types-Bst3_XVW.js";
import {
  c as AcpRuntimePromptMode,
  l as AcpRuntimeSessionMode,
  n as AcpRuntimeCapabilities,
  o as AcpRuntimeEvent,
  s as AcpRuntimeHandle,
  t as AcpRuntime,
  u as AcpRuntimeStatus,
} from "./types-D85xy4rc.js";
import { s as SessionEntry } from "./types-Dk-ocvLl.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/acp/runtime/session-meta.d.ts
/** ACP metadata joined with its legacy session-store row and config context. */
type AcpSessionStoreEntry = {
  cfg: OpenClawConfig;
  agentId?: string;
  storePath: string;
  sessionKey: string;
  storeSessionKey: string;
  entry?: SessionEntry;
  acp?: SessionAcpMeta;
  storeReadFailed?: boolean;
};
declare function readAcpSessionEntry(params: {
  sessionKey: string;
  cfg?: OpenClawConfig;
  clone?: boolean;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
}): AcpSessionStoreEntry | null;
declare function listAcpSessionEntries(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  clone?: boolean;
  databasePath?: string;
}): Promise<AcpSessionStoreEntry[]>;
declare function upsertAcpSessionMeta(params: {
  sessionKey: string;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
  now?: () => number;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  mutate: (
    current: SessionAcpMeta | undefined,
    entry: SessionEntry | undefined,
  ) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
//#endregion
//#region src/acp/control-plane/manager.types.d.ts
/** Result of resolving persisted ACP metadata for a session key. */
type AcpSessionResolution =
  | {
      kind: "none";
      sessionKey: string;
    }
  | {
      kind: "stale";
      sessionKey: string;
      error: AcpRuntimeError;
    }
  | {
      kind: "ready";
      sessionKey: string;
      meta: SessionAcpMeta;
      entry?: SessionEntry;
    };
/** Input required to create or resume an ACP runtime session. */
type AcpInitializeSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  agent: string;
  mode: AcpRuntimeSessionMode;
  resumeSessionId?: string;
  runtimeOptions?: Partial<AcpSessionRuntimeOptions>;
  cwd?: string;
  backendId?: string;
};
type AcpTurnAttachment = {
  mediaType: string;
  data: string;
};
/** Input for one ACP prompt turn routed through the manager. */
type AcpRunTurnInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  provenance: "human" | "agent" | "system";
  text: string;
  attachments?: AcpTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
  onLifecycle?: (event: AcpTurnLifecycleEvent) => Promise<void> | void;
  onEvent?: (event: AcpRuntimeEvent) => Promise<void> | void;
};
type AcpTurnLifecycleEvent = {
  type: "prompt_submitted";
  at: number;
};
/** Input for closing, resetting, or cleaning up an ACP session. */
type AcpCloseSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: string;
  discardPersistentState?: boolean;
  clearMeta?: boolean;
  allowBackendUnavailable?: boolean;
  requireAcpSession?: boolean;
};
type AcpCloseSessionResult = {
  runtimeClosed: boolean;
  runtimeNotice?: string;
  metaCleared: boolean;
};
/** User-facing session status assembled from persisted metadata and runtime status. */
type AcpSessionStatus = {
  sessionKey: string;
  backend: string;
  agent: string;
  identity?: SessionAcpIdentity;
  state: SessionAcpMeta["state"];
  mode: AcpRuntimeSessionMode;
  runtimeOptions: AcpSessionRuntimeOptions;
  capabilities: AcpRuntimeCapabilities;
  runtimeStatus?: AcpRuntimeStatus;
  lastActivityAt: number;
  lastError?: string;
};
/** Process-local ACP manager counters exposed for diagnostics. */
type AcpManagerObservabilitySnapshot = {
  runtimeCache: {
    activeSessions: number;
    idleTtlMs: number;
    evictedTotal: number;
    lastEvictedAt?: number;
  };
  turns: {
    active: number;
    queueDepth: number;
    completed: number;
    failed: number;
    averageLatencyMs: number;
    maxLatencyMs: number;
  };
  errorsByCode: Record<string, number>;
};
type AcpStartupIdentityReconcileResult = {
  checked: number;
  resolved: number;
  failed: number;
};
type AcpSessionManagerDeps = {
  listAcpSessions: typeof listAcpSessionEntries;
  loadSessionEntry: typeof readAcpSessionEntry;
  upsertSessionMeta: typeof upsertAcpSessionMeta;
  getRuntimeBackend: typeof getAcpRuntimeBackend;
  requireRuntimeBackend: typeof requireAcpRuntimeBackend;
};
//#endregion
//#region src/acp/control-plane/manager.core.d.ts
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
declare class AcpSessionManager {
  private readonly actorQueue;
  private readonly runtimeHandles;
  private readonly activeTurnBySession;
  private readonly turnLatencyStats;
  private readonly errorCountsByCode;
  private readonly deps;
  constructor(deps?: AcpSessionManagerDeps);
  resolveSession(params: { cfg: OpenClawConfig; sessionKey: string }): AcpSessionResolution;
  getObservabilitySnapshot(cfg: OpenClawConfig): AcpManagerObservabilitySnapshot;
  reconcilePendingSessionIdentities(params: {
    cfg: OpenClawConfig;
  }): Promise<AcpStartupIdentityReconcileResult>;
  initializeSession(input: AcpInitializeSessionInput): Promise<{
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
  }>;
  getSessionStatus(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    signal?: AbortSignal;
  }): Promise<AcpSessionStatus>;
  setSessionRuntimeMode(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    runtimeMode: string;
  }): Promise<AcpSessionRuntimeOptions>;
  setSessionConfigOption(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    key: string;
    value: string;
  }): Promise<AcpSessionRuntimeOptions>;
  updateSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    patch: Partial<AcpSessionRuntimeOptions>;
  }): Promise<AcpSessionRuntimeOptions>;
  resetSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }): Promise<AcpSessionRuntimeOptions>;
  runTurn(input: AcpRunTurnInput): Promise<void>;
  cancelSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason?: string;
  }): Promise<void>;
  closeSession(input: AcpCloseSessionInput): Promise<AcpCloseSessionResult>;
  private ensureRuntimeHandle;
  private runtimeOptionCommandServices;
  private enforceConcurrentSessionLimit;
  private recordTurnCompletion;
  private recordErrorCode;
  private resolveRuntimeCapabilities;
  private evictIdleRuntimeHandles;
  private applyRuntimeControls;
  private setSessionState;
  private reconcileRuntimeSessionIdentifiers;
  private writeSessionMeta;
  private withSessionActor;
  private throwIfAborted;
}
//#endregion
export {
  AcpManagerObservabilitySnapshot as a,
  AcpSessionStatus as c,
  readAcpSessionEntry as d,
  AcpInitializeSessionInput as i,
  AcpStartupIdentityReconcileResult as l,
  AcpCloseSessionInput as n,
  AcpRunTurnInput as o,
  AcpCloseSessionResult as r,
  AcpSessionResolution as s,
  AcpSessionManager as t,
  AcpSessionStoreEntry as u,
};
