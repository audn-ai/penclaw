import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import { WebSocket } from "ws";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { t as CliDeps } from "./deps.types-BdV6g6qp.js";
import {
  c as ExecApprovalDecision,
  u as ExecApprovalRequestPayload$1,
} from "./exec-approvals-B59RubLo.js";
import { s as SpawnResult } from "./exec-D8nvu0GV.js";
import { t as HeartbeatSummary } from "./heartbeat-summary-AJKH0dPy.js";
import {
  Au as WorkerEnvironmentState,
  Hc as NodePluginToolDescriptor,
  Iu as ConnectParams,
  Qc as NodeSkillDescriptor,
  Ru as ErrorShape,
  ky as ApprovalPresentation,
  qu as RequestFrame,
  tb as SessionApprovalReplay,
} from "./index-F2ydESCy.js";
import {
  n as ModelCatalogSnapshot,
  t as ModelCatalogEntry,
} from "./model-catalog.types-DCVmZqMZ.js";
import { t as OpenClawStateDatabaseOptions } from "./openclaw-state-db-DONn495N.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import {
  c as PluginApprovalRequestPayload,
  s as PluginApprovalRequest,
} from "./plugin-approvals-DCKU3bfY.js";
import { i as WizardPrompter } from "./prompts-CWXx5gsI.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import {
  a as CronJobCreate,
  c as CronRunStatus,
  i as CronJob,
  o as CronJobPatch,
  s as CronPayload,
} from "./store-CAl2QpVW.js";
import { n as createSubsystemLogger } from "./subsystem-BvPn7HK_.js";
import { t as RuntimePluginToolGrant } from "./tool-grant-BSRz7IOf.js";
import {
  r as ChannelAccountSnapshot,
  z as ChannelThreadingToolContext,
} from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugins/provider-auth-types.d.ts
/** Provider secret input modes: inline plaintext or external secret reference. */
type SecretInputMode = "plaintext" | "ref";
//#endregion
//#region src/infra/agent-events.d.ts
/** Stream name for agent events delivered to gateway listeners and plugin host hooks. */
type AgentEventStream =
  | "lifecycle"
  | "tool"
  | "assistant"
  | "error"
  | "item"
  | "plan"
  | "approval"
  | "command_output"
  | "patch"
  | "compaction"
  | "thinking"
  | (string & {});
/** Approval event phase for request/resolution transitions. */
type AgentApprovalEventPhase = "requested" | "resolved";
/** Approval status after routing, user action, or delivery failure. */
type AgentApprovalEventStatus = "pending" | "unavailable" | "approved" | "denied" | "failed";
/** Approval family used by renderers and host hooks. */
type AgentApprovalEventKind = "exec" | "plugin" | "unknown";
/** Payload for approval requests and their later resolution events. */
type AgentApprovalEventData = {
  phase: AgentApprovalEventPhase;
  kind: AgentApprovalEventKind;
  status: AgentApprovalEventStatus;
  title: string;
  itemId?: string;
  toolCallId?: string;
  approvalId?: string;
  approvalSlug?: string;
  command?: string;
  host?: string;
  reason?: string;
  scope?: "turn" | "session";
  message?: string;
};
/** Enriched event delivered to subscribers after sequencing and context stamping. */
type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: AgentEventStream;
  ts: number;
  data: Record<
    string,
    unknown
  > /** Internal, non-enumerable gateway lifecycle generation that owns this run. */;
  lifecycleGeneration?: string;
  sessionKey?: string;
  /**
   * sessionId the run was bound to when it started. Lifecycle persistence uses
   * this to reject terminal events from a pre-`sessions.reset` run that would
   * otherwise clobber the rotated session row resolved by the shared sessionKey.
   */
  sessionId?: string;
  agentId?: string;
};
/** Starts a new ownership generation before an in-process gateway restart. */
declare function rotateAgentEventLifecycleGeneration(): string;
/** Emits an agent event after assigning per-run sequence, timestamp, and context metadata. */
declare function emitAgentEvent(event: Omit<AgentEventPayload, "seq" | "ts">): void;
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
declare function onAgentEvent(listener: (evt: AgentEventPayload) => void): () => void;
/** Clears agent event state; test suites with a live Gateway can preserve its listeners. */
declare function resetAgentEventsForTest(options?: { preserveListeners?: boolean }): void;
//#endregion
//#region src/gateway/chat-queued-turns.d.ts
type QueuedChatTurnEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string /** False once collect-mode transfers cancellation to the aggregate owner. */;
  abortable?: boolean;
  agentId?: string;
  ownerConnId?: string;
  ownerDeviceId?: string;
};
type QueuedChatTurnMap = Map<string, QueuedChatTurnEntry>;
//#endregion
//#region src/commands/daemon-runtime.d.ts
type GatewayDaemonRuntime = "node";
//#endregion
//#region src/commands/onboard-types.d.ts
type OnboardMode = "local" | "remote";
/**
 * Auth choices are plugin-owned contract ids plus a few legacy aliases that
 * are normalized elsewhere (for example `oauth` -> `setup-token`).
 */
type BuiltInAuthChoice = /** @deprecated Use `setup-token`. */ | "oauth"
  | "setup-token"
  | "token"
  | "apiKey"
  | "custom-api-key"
  | "skip";
type AuthChoice = BuiltInAuthChoice | (string & {});
type GatewayAuthChoice = "token" | "password";
type ResetScope = "config" | "config+creds+sessions" | "full";
type GatewayBind = "loopback" | "lan" | "auto" | "custom" | "tailnet";
type TailscaleMode = "off" | "serve" | "funnel";
type NodeManagerChoice = "npm" | "pnpm" | "bun";
type ChannelChoice = ChannelId;
type OnboardDynamicProviderOptions = {
  /**
   * Provider-specific non-interactive auth flags are plugin-owned and keyed by
   * manifest `providerAuthChoices[].optionKey` values.
   */
  [optionKey: string]: unknown;
};
/** Parsed options accepted by `openclaw onboard`. */
type OnboardOptions = OnboardDynamicProviderOptions & {
  mode?: OnboardMode /** "manual" is an alias for "advanced". */;
  flow?:
    | "quickstart"
    | "advanced"
    | "manual"
    | "import" /** Force the classic multi-step interactive wizard instead of guided setup. */;
  classic?: boolean;
  workspace?: string;
  nonInteractive?: boolean /** Required for non-interactive setup; skips the interactive risk prompt when true. */;
  acceptRisk?: boolean;
  reset?: boolean;
  resetScope?: ResetScope;
  authChoice?: AuthChoice /** Used when `authChoice=token` in non-interactive mode. */;
  tokenProvider?: string /** Used when `authChoice=token` in non-interactive mode. */;
  token?: string /** Used when `authChoice=token` in non-interactive mode. */;
  tokenProfileId?: string /** Used when `authChoice=token` in non-interactive mode. */;
  tokenExpiresIn?: string /** API key persistence mode for setup flows (default: plaintext). */;
  secretInputMode?: SecretInputMode;
  arceeaiApiKey?: string;
  cloudflareAiGatewayAccountId?: string;
  cloudflareAiGatewayGatewayId?: string;
  customBaseUrl?: string;
  customApiKey?: string;
  lmstudioApiKey?: string;
  customModelId?: string;
  customProviderId?: string;
  customCompatibility?: "openai" | "openai-responses" | "anthropic";
  customImageInput?: boolean;
  gatewayPort?: number;
  gatewayBind?: GatewayBind;
  gatewayAuth?: GatewayAuthChoice;
  gatewayToken?: string;
  gatewayTokenRefEnv?: string;
  gatewayPassword?: string;
  tailscale?: TailscaleMode;
  tailscaleResetOnExit?: boolean;
  installDaemon?: boolean;
  daemonRuntime?: GatewayDaemonRuntime;
  skipChannels?: boolean /** @deprecated Legacy alias for `skipChannels`. */;
  skipProviders?: boolean;
  skipSkills?: boolean;
  skipBootstrap?: boolean;
  skipSearch?: boolean;
  skipHealth?: boolean;
  skipUi?: boolean;
  suppressGatewayTokenOutput?: boolean;
  skipHooks?: boolean;
  nodeManager?: NodeManagerChoice;
  remoteUrl?: string;
  remoteToken?: string;
  importFrom?: string;
  importSource?: string;
  importSecrets?: boolean;
  json?: boolean;
};
//#endregion
//#region src/gateway/server-methods/wizard.d.ts
type ChannelSetupWizardRunner = (
  opts: {
    channel?: string;
    onConfigured?: (
      accounts: Array<{
        channel: string;
        accountId: string;
      }>,
    ) => void;
    beforePersistentEffect?: () => Promise<void>;
  },
  runtime: RuntimeEnv,
  prompter: WizardPrompter,
) => Promise<void>;
//#endregion
//#region src/infra/voicewake-routing.d.ts
type VoiceWakeRouteTarget =
  | {
      mode: "current";
      agentId?: undefined;
      sessionKey?: undefined;
    }
  | {
      agentId: string;
      sessionKey?: undefined;
      mode?: undefined;
    }
  | {
      sessionKey: string;
      agentId?: undefined;
      mode?: undefined;
    };
type VoiceWakeRouteRule = {
  trigger: string;
  target: VoiceWakeRouteTarget;
};
type VoiceWakeRoutingConfig = {
  version: 1;
  defaultTarget: VoiceWakeRouteTarget;
  routes: VoiceWakeRouteRule[];
  updatedAtMs: number;
};
//#endregion
//#region src/gateway/config-reload-status.types.d.ts
type GatewayHotReloadStatus = "active" | "disabled";
//#endregion
//#region src/gateway/server/event-loop-health.d.ts
type GatewayEventLoopHealthReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type GatewayEventLoopHealth = {
  degraded: boolean;
  reasons: GatewayEventLoopHealthReason[];
  intervalMs: number;
  delayP99Ms: number;
  delayMaxMs: number;
  utilization: number;
  cpuCoreRatio: number;
};
//#endregion
//#region src/gateway/model-pricing-cache.types.d.ts
/** Health of the gateway model-pricing sources exposed through health summaries. */
type GatewayModelPricingHealth = {
  state: "ok" | "degraded" | "disabled";
  sources: Array<{
    source: "openrouter" | "litellm" | "bootstrap" | "refresh";
    state: "ok" | "degraded";
    lastFailureAt?: number;
    detail?: string;
  }>;
  lastFailureAt?: number;
  detail?: string;
};
//#endregion
//#region src/commands/health.types.d.ts
/** Health snapshot for one configured channel account. */
type ChannelAccountHealthSummary = {
  accountId: string;
  configured?: boolean;
  linked?: boolean;
  authAgeMs?: number | null;
  probe?: unknown;
  lastProbeAt?: number | null;
  [key: string]: unknown;
};
/** Channel-level health summary with optional per-account details. */
type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};
/** Agent heartbeat and session-store health metadata. */
type AgentHealthSummary = {
  agentId: string;
  name?: string;
  isDefault: boolean;
  heartbeat: HeartbeatSummary;
  sessions: HealthSummary["sessions"];
};
/** Plugin load error details safe for the health payload. */
type PluginHealthErrorSummary = {
  id: string;
  origin: string;
  activated: boolean;
  activationSource?: string;
  activationReason?: string;
  failurePhase?: string;
  error: string;
};
/** Plugin registry health summary. */
type PluginHealthSummary = {
  loaded: string[];
  errors: PluginHealthErrorSummary[];
};
/** Context engine quarantine entry included in health output. */
type ContextEngineHealthQuarantineSummary = {
  engineId: string;
  owner?: string;
  operation: string;
  reason: string;
  failedAt: number;
};
/** Context engine health summary. */
type ContextEngineHealthSummary = {
  quarantined: ContextEngineHealthQuarantineSummary[];
};
/** Dead-lettered delivery queue entries surfaced in health output. */
type DeliveryQueueHealthSummary = {
  failed: Array<{
    queueName: string;
    count: number;
    oldestFailedAt?: number;
  }>;
};
/** Optional model pricing cache health reported by the gateway. */
type ModelPricingHealthSummary = GatewayModelPricingHealth;
/** Config hot-reload watcher status, present only when a reloader is running. */
type ConfigReloadHealthSummary = {
  hotReloadStatus: GatewayHotReloadStatus;
};
/** Full gateway health payload consumed by `openclaw health`. */
type HealthSummary = {
  ok: true;
  ts: number;
  durationMs: number;
  eventLoop?: GatewayEventLoopHealth;
  plugins?: PluginHealthSummary;
  contextEngines?: ContextEngineHealthSummary;
  deliveryQueues?: DeliveryQueueHealthSummary;
  modelPricing?: ModelPricingHealthSummary;
  configReload?: ConfigReloadHealthSummary;
  channels: Record<string, ChannelHealthSummary>;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  defaultAgentId: string;
  agents: AgentHealthSummary[];
  sessions: {
    path: string;
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number | null;
      age: number | null;
    }>;
  };
};
//#endregion
//#region src/wizard/session.d.ts
type WizardStepOption = {
  value: unknown;
  label: string;
  hint?: string;
};
type WizardStep = {
  id: string;
  type: "note" | "select" | "text" | "confirm" | "multiselect" | "progress" | "action";
  title?: string;
  message?: string;
  format?: "plain";
  options?: WizardStepOption[];
  initialValue?: unknown;
  placeholder?: string;
  sensitive?: boolean;
  executor?: "gateway" | "client";
  externalUrl?: string;
  deviceCode?: {
    code: string;
    expiresInMinutes?: number;
    message?: string;
  };
};
type WizardSessionStatus = "running" | "done" | "cancelled" | "error";
type WizardNextResult = {
  done: boolean;
  step?: WizardStep;
  status: WizardSessionStatus;
  error?: string;
  channels?: string[];
  accounts?: Array<{
    channel: string;
    accountId: string;
  }>;
};
declare class WizardSession {
  private runner;
  private readonly abortController;
  private readonly expiryTimer;
  private currentStep;
  private stepDeferred;
  private pendingTerminalResolution;
  private cancellationLocked;
  private pendingExternalUrl;
  private answerDeferred;
  private status;
  private error;
  private configuredAccounts;
  constructor(
    runner: (
      prompter: WizardPrompter,
      signal: AbortSignal,
      session: WizardSession,
    ) => Promise<void>,
    options?: {
      timeoutMs?: number;
    },
  );
  next(): Promise<WizardNextResult>;
  private terminalResult;
  /** Record what the channels flow actually configured (channels flow only). */
  setConfiguredAccounts(
    accounts: ReadonlyArray<{
      channel: string;
      accountId: string;
    }>,
  ): void;
  answer(stepId: string, value: unknown): Promise<string | undefined>;
  cancel(): boolean;
  /** The underlying mutation crossed its durable commit point and must finish. */
  lockCancellation(): void;
  get signal(): AbortSignal;
  pushStep(step: WizardStep): void;
  queueExternalUrl(url: string): void;
  consumeExternalUrl(): string | undefined;
  private run;
  awaitAnswer(step: WizardStep, validate?: (value: string) => string | undefined): Promise<unknown>;
  private resolveStep;
  getStatus(): WizardSessionStatus;
  getError(): string | undefined;
}
//#endregion
//#region src/gateway/message-action-turn-capability.d.ts
type AgentRuntimeMessageActionContext = {
  expiresAtMs: number;
  sessionId?: string;
  requesterAccountId?: string;
  requesterSenderId?: string;
  toolContext?: ChannelThreadingToolContext;
};
//#endregion
//#region src/gateway/agent-runtime-identity-token.d.ts
type AgentRuntimeIdentity = {
  kind: "agentRuntime";
  agentId: string;
  sessionKey: string;
  messageActionContext?: AgentRuntimeMessageActionContext;
};
//#endregion
//#region src/gateway/server-chat-state.d.ts
type ChatRunTiming = {
  ackedAtMs: number;
  connId: string;
  dispatchStartedAtMs?: number;
  firstAssistantEventSent?: boolean;
  receivedAtMs: number;
};
type ChatRunRegistration = {
  sessionKey: string;
  agentId?: string;
  clientRunId: string;
  chatSendTiming?: ChatRunTiming;
};
type ChatRunEntry = ChatRunRegistration & {
  registeredAtMs: number;
  registeredSequence: number;
};
type ChatAbortMarker =
  | number
  | {
      abortedAtMs: number;
      sequence: number;
    };
type BufferedAgentEvent = {
  sessionKey?: string;
  agentId?: string;
  payload: AgentEventPayload & {
    spawnedBy?: string;
  };
};
type ChatRunRegistry = {
  add: (sessionId: string, entry: ChatRunRegistration) => void;
  peek: (sessionId: string) => ChatRunEntry | undefined;
  shift: (sessionId: string) => ChatRunEntry | undefined;
  remove: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  clear: () => void;
};
type ChatRunState = {
  registry: ChatRunRegistry;
  rawBuffers: Map<string, string>;
  buffers: Map<
    string,
    string
  > /** Last time any buffered assistant text changed, including suppressed raw buffers. */;
  bufferUpdatedAt: Map<string, number>;
  deltaSentAt: Map<
    string,
    number
  > /** Length of text at the time of the last broadcast, used to avoid duplicate flushes. */;
  deltaLastBroadcastLen: Map<string, number>;
  deltaLastBroadcastText: Map<string, string>;
  agentDeltaSentAt: Map<string, number>;
  bufferedAgentEvents: Map<string, BufferedAgentEvent>;
  abortedRuns: Map<string, ChatAbortMarker>;
  clearRun: (runId: string) => void;
  clear: () => void;
};
//#endregion
//#region src/gateway/chat-abort.d.ts
type ChatAbortControllerEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string;
  lifecycleGeneration?: string;
  agentId?: string;
  startedAtMs: number;
  expiresAtMs: number;
  ownerConnId?: string;
  ownerDeviceId?: string;
  providerId?: string;
  authProviderId?: string;
  abortStopReason?: string /** Latest argument-free validation diagnostic for operator-initiated aborts. */;
  toolErrorSummary?: string;
  /**
   * False for backend/internal agent runs that may share a session key but must
   * not be projected into operator chat surfaces.
   */
  controlUiVisible?: boolean;
  /**
   * Controls only the sessions.list active-run projection. Terminal lifecycle
   * clears this before chat.send settles, while the entry stays as the retry
   * idempotency guard until normal cleanup removes it.
   */
  projectSessionActive?: boolean /** True after the terminal session-store update has completed. */;
  projectSessionTerminalPersisted?: boolean /** A terminal lifecycle event was observed and is awaiting persistence. */;
  projectSessionTerminalPending?: boolean /** Store timestamp expected from the observed terminal lifecycle event. */;
  projectSessionTerminalObservedAt?: number /** In-flight terminal session-store update used by restart shutdown. */;
  projectSessionTerminalPersistence?: Promise<void> /** Caller completion requested cleanup before terminal lifecycle persistence settled. */;
  registrationCleanupRequested?: boolean /** False after the owning reply run commits a terminal outcome. */;
  isAbortable?: (
    entry: ChatAbortControllerEntry,
  ) => boolean /** Runs once when this registration is actually removed. */;
  onRemoved?: () => void;
  /**
   * Which RPC owns this registration. Absent (undefined) is treated as
   * `"chat-send"` so pre-existing callers that constructed entries without
   * a kind keep their behavior. Consumers that need "chat.send specifically
   * is active" must check `kind !== "agent"`, not just `.has(runId)`.
   */
  kind?:
    | "chat-send"
    | "agent" /** Side questions stay independent from main-turn TUI session stops. */;
  turnKind?: "main" | "btw";
};
type RestartRecoveryCandidate = {
  runId: string;
  lifecycleGeneration: string;
  sessionKey: string;
  sessionId: string;
  observedAt?: number;
};
//#endregion
//#region src/gateway/operator-approval-store.d.ts
type OperatorApprovalKind = "exec" | "plugin";
type OperatorApprovalStatus = "pending" | "allowed" | "denied" | "expired" | "cancelled";
type OperatorApprovalDecision = "allow-once" | "allow-always" | "deny";
type OperatorApprovalTerminalReason =
  | "user"
  | "timeout"
  | "malformed-verdict"
  | "no-route"
  | "run-aborted"
  | "gateway-restart"
  | "storage-corrupt";
type OperatorApprovalResolverKind = "device" | "channel" | "runtime" | "system";
type OperatorApprovalRequester = {
  deviceId: string | null;
  clientId: string | null;
  deviceTokenAuth: boolean;
};
type OperatorApprovalSource = {
  agentId: string | null;
  sessionKey: string | null;
  sessionId: string | null;
  runId: string | null;
  toolCallId: string | null;
  toolName: string | null;
};
type OperatorApprovalResolver = {
  kind: OperatorApprovalResolverKind;
  id: string | null;
};
type OperatorApprovalRecord = {
  id: string;
  resolutionRef: string;
  kind: OperatorApprovalKind;
  status: OperatorApprovalStatus;
  presentation: ApprovalPresentation;
  requester: OperatorApprovalRequester;
  reviewerDeviceIds: string[];
  source: OperatorApprovalSource;
  audienceSessionKeys: string[];
  runtimeEpoch: string;
  createdAtMs: number;
  expiresAtMs: number;
  updatedAtMs: number;
  decision: OperatorApprovalDecision | null;
  terminalReason: OperatorApprovalTerminalReason | null;
  resolvedAtMs: number | null;
  resolver: OperatorApprovalResolver | null;
  consumedAtMs: number | null;
  consumedBy: string | null;
};
type ResolveOperatorApprovalResult =
  | {
      outcome: "resolved";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "expired";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "already-resolved";
      retry: "same" | "conflict";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "decision-not-allowed";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "not-found";
    }
  | {
      outcome: "corrupt";
    };
type ForceDenyOperatorApprovalResult =
  | {
      outcome: "denied";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "expired";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "not-due";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "already-terminal";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "not-found";
    }
  | {
      outcome: "corrupt";
    };
//#endregion
//#region src/gateway/exec-approval-manager.d.ts
type ExecApprovalRequestPayload = ExecApprovalRequestPayload$1;
type ExecApprovalResolutionSource = "operator" | "auto-review";
type ExecApprovalRecord<TPayload = ExecApprovalRequestPayload> = {
  id: string;
  request: TPayload;
  createdAtMs: number;
  expiresAtMs: number;
  requestedByConnId?: string | null;
  requestedByDeviceId?: string | null;
  requestedByClientId?: string | null;
  requestedByDeviceTokenAuth?: boolean;
  approvalReviewerDeviceIds?: string[];
  resolvedAtMs?: number;
  decision?: ExecApprovalDecision;
  consumedDecision?: ExecApprovalDecision;
  resolutionSource?: ExecApprovalResolutionSource;
  askFallbackConsumed?: boolean;
  resolvedBy?: string | null;
  status?: OperatorApprovalStatus;
  terminalReason?: OperatorApprovalTerminalReason | null;
  runtimeEpoch?: string;
  resolverKind?: OperatorApprovalResolver["kind"] | null;
  consumedAtMs?: number | null;
  consumedBy?: string | null;
};
type OperatorApprovalPersistenceRuntime = {
  runtimeEpoch: string;
  databaseOptions?: OpenClawStateDatabaseOptions;
};
type ExecApprovalManagerOptions<TPayload> = {
  approvalKind?: OperatorApprovalKind;
  persistence?: OperatorApprovalPersistenceRuntime;
  resolveAllowedDecisions?: (request: TPayload) => readonly ExecApprovalDecision[];
  /** Session-lineage audience policy is gateway-owned and injected as a
   * non-throwing resolver; importing it here would close an agents->gateway
   * barrel cycle. Absent resolver (tests) seeds only the raising session. */
  resolveAudienceSessionKeys?: (
    sourceSessionKey: string,
    sourceAgentId?: string | null,
  ) => string[];
  onError?: (
    error: Error,
    context: {
      approvalId: string;
      approvalKind: OperatorApprovalKind;
      operation: "expire";
    },
  ) => void;
  onLifecycle?: (event: OperatorApprovalLifecycleEvent) => void;
};
type OperatorApprovalLifecycleEvent = {
  phase: "pending" | "terminal";
  record: OperatorApprovalRecord;
};
type WithLiveRecord<TResult, TPayload> = TResult extends {
  record: OperatorApprovalRecord;
}
  ? TResult & {
      liveRecord?: ExecApprovalRecord<TPayload>;
    }
  : TResult;
type ExecApprovalResolveResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<
  ResolveOperatorApprovalResult,
  TPayload
>;
type ExecApprovalForceDenyResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<
  ForceDenyOperatorApprovalResult,
  TPayload
>;
type ExecApprovalDurableLookup =
  | {
      outcome: "found";
      record: OperatorApprovalRecord;
    }
  | {
      outcome: "missing" | "corrupt";
      id: string;
    };
type ExecApprovalIdLookupResult =
  | {
      kind: "exact" | "prefix";
      id: string;
    }
  | {
      kind: "ambiguous";
      ids: string[];
    }
  | {
      kind: "none";
    };
declare class ExecApprovalManager<TPayload = ExecApprovalRequestPayload> {
  private readonly options;
  private pending;
  constructor(options?: ExecApprovalManagerOptions<TPayload>);
  get approvalKind(): OperatorApprovalKind;
  get runtimeEpoch(): string | null;
  create(request: TPayload, timeoutMs: number, id?: string | null): ExecApprovalRecord<TPayload>;
  /**
   * Register an approval record and return a promise that resolves when the decision is made.
   * This separates registration (synchronous) from waiting (async), allowing callers to
   * confirm registration before the decision is made.
   */
  register(
    record: ExecApprovalRecord<TPayload>,
    _timeoutMs: number,
  ): Promise<ExecApprovalDecision | null>;
  private emitLifecycle;
  private projectLocalRecord;
  /** Persist the first verdict, then release the process-local waiter. */
  resolveDetailed(
    recordId: string,
    decision: ExecApprovalDecision,
    resolver: OperatorApprovalResolver,
    localResolvedBy?: string | null,
    localResolutionSource?: ExecApprovalResolutionSource,
  ): ExecApprovalResolveResult<TPayload>;
  /** Persist a fail-closed terminal state, then release the local waiter. */
  forceDenyDetailed(
    recordId: string,
    reason: OperatorApprovalTerminalReason,
    resolver: OperatorApprovalResolver,
    status?: "denied" | "expired" | "cancelled",
    localDecision?: ExecApprovalDecision | null,
    requireDue?: boolean,
    localResolvedBy?: string | null,
  ): ExecApprovalForceDenyResult<TPayload>;
  private settleLocalFromStore;
  /** Settle one durable terminal transition and report whether this manager published it. */
  reconcileDurableTerminal(record: OperatorApprovalRecord): boolean;
  /** Reconciles durable truth with an existing waiter without rehydrating its request. */
  reconcileDurableLookup(
    lookup: ExecApprovalDurableLookup,
    localResolvedBy?: string | null,
  ): OperatorApprovalRecord | null;
  private settleLocalStorageFailure;
  private persistStorageCorruptDeny;
  private settleLocalEntry;
  private scheduleResolvedCleanup;
  private resolvedGraceAnchorMs;
  /** Retains an existing local binding across async delivery; final release starts a fresh grace. */
  retainForHandoff(recordId: string): (() => void) | null;
  private reportError;
  private scheduleExpiryTimer;
  private expireDue;
  private resolveLocal;
  private expireLocal;
  resolve(recordId: string, decision: ExecApprovalDecision, resolvedBy?: string | null): boolean;
  /**
   * Trusted auto-review resolution (identity-matched approval runtime).
   * Always allow-once; system.run replay validation treats the resulting
   * record more strictly than an operator decision (see #103515).
   */
  resolveAutoReview(recordId: string, resolvedBy?: string | null): boolean;
  /**
   * One-shot ask-fallback re-admission for a timed-out approval. This is
   * pre-gate policy on the process-local record only: the durable row stays
   * `expired` and no execution authority is minted here. The strict exec
   * timeout cutover is deferred (docs/refactor/operator-approvals.md); until
   * then system.run replay uses this flag to keep re-admission single-use.
   */
  consumeAskFallback(recordId: string): boolean;
  expire(recordId: string, resolvedBy?: string | null): boolean;
  getSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  /** Returns an exact live request snapshot without reading durable state or mutating expiry. */
  getLiveSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  listPendingRecords(): ExecApprovalRecord<TPayload>[];
  consumeAllowOnce(recordId: string, consumerId?: string): boolean;
  /**
   * Wait for decision on an already-registered approval.
   * Returns the decision promise if the ID is pending, null otherwise.
   */
  awaitDecision(recordId: string): Promise<ExecApprovalDecision | null> | null;
  lookupApprovalId(
    input: string,
    opts?: {
      includeResolved?: boolean;
      filter?: (record: ExecApprovalRecord<TPayload>) => boolean;
    },
  ): ExecApprovalIdLookupResult;
  lookupPendingId(input: string): ExecApprovalIdLookupResult;
}
//#endregion
//#region src/gateway/methods/descriptor.d.ts
/** Scope marker for methods that only authenticated node clients may call. */
declare const NODE_GATEWAY_METHOD_SCOPE: "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
declare const DYNAMIC_GATEWAY_METHOD_SCOPE: "dynamic";
/** Authorization scope attached to a gateway method descriptor. */
type GatewayMethodScope =
  | OperatorScope
  | typeof NODE_GATEWAY_METHOD_SCOPE
  | typeof DYNAMIC_GATEWAY_METHOD_SCOPE;
/** Owner metadata used to keep core, plugin, channel, and auxiliary methods distinguishable. */
type GatewayMethodOwner =
  | {
      kind: "core";
      area: string;
    }
  | {
      kind: "plugin";
      pluginId: string;
    }
  | {
      kind: "channel";
      channelId: string;
    }
  | {
      kind: "aux";
      area: string;
    };
/** Startup availability flag exposed to clients as retryable startup-unavailable errors. */
type GatewayMethodStartupAvailability = "available" | "unavailable-until-sidecars";
type GatewayMethodHandler = (opts: never) => unknown;
/** Complete metadata for one dispatchable gateway method. */
type GatewayMethodDescriptor = {
  name: string;
  handler: GatewayMethodHandler;
  scope: GatewayMethodScope;
  owner: GatewayMethodOwner;
  startup?: GatewayMethodStartupAvailability;
  controlPlaneWrite?: boolean;
  advertise?: boolean;
  description?: string;
};
/** Read-only method registry view used by request dispatch and method listing. */
type GatewayMethodRegistryView = {
  getHandler: (name: string) => GatewayMethodHandler | undefined;
  listMethods: () => string[];
  listAdvertisedMethods: () => string[];
  getScope: (name: string) => GatewayMethodScope | undefined;
  isStartupUnavailable: (name: string) => boolean;
  isControlPlaneWrite: (name: string) => boolean;
  descriptors: () => readonly GatewayMethodDescriptor[];
};
//#endregion
//#region src/gateway/node-plugin-tool-snapshot.d.ts
type RegisteredNodePluginToolCommand = {
  pluginId: string;
  command: {
    command?: string;
    agentTool?: {
      name?: string;
      description?: string;
      parameters?: unknown;
      mcp?: {
        server?: string;
        tool?: string;
      };
    };
  };
};
//#endregion
//#region src/gateway/node-registry.invoke-stream.d.ts
type NodeInvokeProgressParams = {
  invokeId: string;
  nodeId: string;
  connId: string | undefined;
  seq: number;
  chunk: string;
};
type NodeInvokeResultParams = {
  id: string;
  nodeId: string;
  connId: string | undefined;
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
//#endregion
//#region src/gateway/plugin-node-capability.d.ts
/** Path marker used to scope plugin-hosted node URLs with one-time capabilities. */
declare const PLUGIN_NODE_CAPABILITY_PATH_PREFIX = "/__openclaw__/cap";
/** Default lifetime for plugin-node capability tokens. */
declare const DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS: number;
/** Declared plugin surface that may receive scoped node capabilities. */
type PluginNodeCapabilitySurface = {
  surface: string;
  ttlMs?: number;
  scopeKey?: string;
};
/** Client-side storage for surface URLs and minted plugin-node capabilities. */
type PluginNodeCapabilityClient = {
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<
    string,
    {
      capability: string;
      expiresAtMs: number;
    }
  >;
};
/** Parsed URL details after extracting path/query capability tokens. */
type NormalizedPluginNodeCapabilityUrl = {
  pathname: string;
  capability?: string;
  rewrittenUrl?: string;
  scopedPath: boolean;
  malformedScopedPath: boolean;
};
/** Mint an opaque capability token for plugin-node surface access. */
declare function mintPluginNodeCapabilityToken(): string;
/** Append a capability path segment to a plugin host URL. */
declare function buildPluginNodeCapabilityScopedHostUrl(
  baseUrl: string,
  capability: string,
): string | undefined;
/** Parse and rewrite scoped capability URLs into canonical paths plus query tokens. */
declare function normalizePluginNodeCapabilityScopedUrl(
  rawUrl: string,
): NormalizedPluginNodeCapabilityUrl;
//#endregion
//#region src/gateway/worker-environments/connection-identity.d.ts
/** Hash-only worker identity retained after admission. */
type WorkerConnectionIdentity = {
  environmentId: string;
  credentialHash: string;
  bundleHash: string;
  sessionId: string | null;
  runId: string | null;
  ownerEpoch: number;
  rpcSetVersion: number;
  protocolFeatures: string[];
  credentialExpiresAtMs: number;
};
//#endregion
//#region src/gateway/server/ws-types.d.ts
type GatewayWsConnectionKind = "gateway" | "worker";
/**
 * Runtime WebSocket client state tracked by the gateway server.
 */
type GatewayWsClient = PluginNodeCapabilityClient & {
  socket: WebSocket;
  connect: ConnectParams;
  connId: string;
  connectionKind?: GatewayWsConnectionKind;
  worker?: WorkerConnectionIdentity;
  isDeviceTokenAuth?: boolean;
  usesSharedGatewayAuth: boolean;
  sharedGatewaySessionGeneration?: string;
  presenceKey?: string;
  clientIp?: string;
  internal?: {
    approvalRuntime?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
  };
  canvasHostUrl?: string;
  canvasCapability?: string;
  canvasCapabilityExpiresAtMs?: number;
  invalidated?: boolean;
  invalidatedReason?: string;
};
//#endregion
//#region src/gateway/node-registry.d.ts
/** Connected node session advertised over Gateway websocket. */
type NodeSession = {
  nodeId: string;
  connId: string;
  client: GatewayWsClient;
  clientId?: string;
  clientMode?: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  remoteIp?: string;
  declaredCaps: string[];
  sessionCapsCeiling?: string[];
  caps: string[];
  declaredCommands: string[];
  sessionCommandsCeiling?: string[];
  commands: string[];
  declaredNodePluginTools: NodePluginToolDescriptor[];
  nodePluginTools: NodePluginToolDescriptor[];
  nodeSkills: NodeSkillDescriptor[];
  declaredPermissions?: Record<string, boolean>;
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  connectedAtMs: number;
  lastActiveAtMs?: number;
  presenceUpdatedAtMs?: number;
};
/** Result payload returned from node.invoke. */
type NodeInvokeResult = {
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
/** Connectivity probe result for a registered node. */
type NodeConnectivityResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };
declare const SERIALIZED_EVENT_PAYLOAD: unique symbol;
type SerializedEventPayload = {
  readonly json: string;
  readonly [SERIALIZED_EVENT_PAYLOAD]: true;
};
/** Event transport for nodes that cannot keep a WebSocket open, such as watchOS. */
type NodeEventTransport = {
  send: (event: string, payload: unknown) => boolean;
  sendRaw: (event: string, payloadJSON?: SerializedEventPayload | null) => boolean;
  checkConnectivity?: (timeoutMs: number) => Promise<NodeConnectivityResult>;
};
type NodeRegistryOptions = {
  listRegisteredNodePluginToolCommands?:
    | (() => readonly RegisteredNodePluginToolCommand[] | undefined)
    | undefined;
  nodePluginToolsEnabled?: boolean;
  nodeSkillsEnabled?: boolean;
};
/** Registry of currently connected Gateway nodes. */
declare class NodeRegistry {
  private readonly options;
  private nodesById;
  private nodesByConn;
  private eventTransportsByConn;
  private pendingInvokes;
  private invokeStreams;
  private authorizedSystemRunEvents;
  constructor(options?: NodeRegistryOptions);
  private normalizePluginToolDescriptors;
  private replaceEffectiveNodePluginTools;
  refreshNodePluginTools(): void;
  /** Register a websocket client as the current connection for its node id. */
  register(
    client: GatewayWsClient,
    opts: {
      remoteIp?: string | undefined;
    },
  ): NodeSession;
  /** Register a node whose events are delivered by an HTTP polling transport. */
  registerTransport(
    client: GatewayWsClient,
    opts: {
      remoteIp?: string | undefined;
    },
    transport: NodeEventTransport,
  ): NodeSession;
  private registerSession;
  /** Unregister one connection and reject invokes tied to that connection. */
  unregister(connId: string): string | null;
  /** List connected node sessions. */
  listConnected(): NodeSession[];
  /** Return a connected node session by node id. */
  get(nodeId: string): NodeSession | undefined;
  /** Updates recent input activity for the exact authenticated node connection. */
  updatePresenceActivity(params: {
    nodeId: string;
    connId?: string;
    idleSeconds: number;
    saturated?: boolean;
    observedAtMs?: number;
  }): NodeSession | null;
  /** Returns the connected node with the freshest reported local input. */
  getActiveNode(): NodeSession | undefined;
  private publishActiveNodeContext;
  /** Probe websocket liveness with ping/pong when the socket supports it. */
  checkConnectivity(nodeId: string, timeoutMs?: number): Promise<NodeConnectivityResult>;
  updateNodePluginTools(
    nodeId: string,
    connId: string | undefined,
    tools: readonly NodePluginToolDescriptor[],
  ): NodeSession | null;
  updateNodeSkills(
    nodeId: string,
    connId: string | undefined,
    skills: readonly NodeSkillDescriptor[],
  ): NodeSession | null;
  updateSurface(
    nodeId: string,
    surface: {
      caps?: readonly string[];
      commands: readonly string[];
      permissions?: Record<string, boolean> | undefined;
    },
  ): NodeSession | null;
  private clearPresenceIfAccessibilityUnavailable;
  invoke(params: {
    nodeId: string;
    expectedConnId?: string;
    command: string;
    params?: unknown;
    timeoutMs?: number /** Inactivity deadline reset by each ordered progress chunk. */;
    idleTimeoutMs?: number;
    onProgress?: (chunk: string) => void;
    signal?: AbortSignal;
    idempotencyKey?: string /** Receives the id synchronously after send; the terminal relay depends on this timing. */;
    onInvokeId?: (invokeId: string) => void;
  }): Promise<NodeInvokeResult>;
  /** Send one ordered input frame to a pending streaming invoke. */
  sendInvokeInput(invokeId: string, payload: unknown): void;
  handleInvokeProgress(params: NodeInvokeProgressParams): boolean;
  /** Authorize an inbound system.run event against a recently issued node invoke. */
  authorizeSystemRunEvent(params: {
    nodeId: string;
    connId?: string;
    runId?: string;
    sessionKey: string;
    terminal: boolean;
  }): boolean;
  private rememberAuthorizedSystemRunEvent;
  private forgetAuthorizedSystemRunEvent;
  private authorizedSystemRunEventExpiresAt;
  private matchAuthorizedSystemRunEvent;
  private matchSingleAuthorizedSystemRunEvent;
  private authorizedSystemRunSessionMatches;
  private allowsLegacyMacRunIdFallback;
  private pruneAuthorizedSystemRunEvents;
  private authorizedSystemRunEventKey;
  handleInvokeResult(params: NodeInvokeResultParams): boolean;
  sendEvent(nodeId: string, event: string, payload?: unknown): boolean;
  sendEventRaw(nodeId: string, event: string, payloadJSON?: SerializedEventPayload | null): boolean;
  private sendEventInternal;
  private sendEventRawInternal;
  private sendEventToSession;
  private rejectSlowNodeSocket;
}
//#endregion
//#region src/gateway/server-broadcast-types.d.ts
type GatewayBroadcastStateVersion = {
  presence?: number;
  health?: number;
};
/** Options for gateway websocket broadcasts. */
type GatewayBroadcastOpts = {
  dropIfSlow?: boolean;
  stateVersion?: GatewayBroadcastStateVersion;
};
/** Broadcast function signature for all connected clients. */
type GatewayBroadcastFn = (event: string, payload: unknown, opts?: GatewayBroadcastOpts) => void;
/** Broadcast function signature for targeted connection ids. */
type GatewayBroadcastToConnIdsFn = (
  event: string,
  payload: unknown,
  connIds: ReadonlySet<string>,
  opts?: GatewayBroadcastOpts,
) => void;
//#endregion
//#region src/gateway/server-channel-runtime.types.d.ts
/** Snapshot of channel runtime state keyed by channel and account id. */
type ChannelRuntimeSnapshot = {
  channels: Partial<Record<ChannelId, ChannelAccountSnapshot>>;
  channelAccounts: Partial<Record<ChannelId, Record<string, ChannelAccountSnapshot>>>;
};
type StartChannelOptions = {
  preserveRestartAttempts?: boolean;
  preserveManualStop?: boolean;
  deferAccountStartUntil?: Promise<void>;
  manual?: boolean;
};
//#endregion
//#region src/cron/service/list-page-types.d.ts
/** Enabled-state filter accepted by paginated cron listing. */
type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Schedule-kind filter accepted by paginated cron listing. */
type CronJobsScheduleKindFilter = "all" | "at" | "every" | "cron" | "on-exit";
/** Last-run status filter, including jobs that have not produced a status yet. */
type CronJobsLastRunStatusFilter = "all" | CronRunStatus | "unknown";
/** Stable sort keys supported by paginated cron listing. */
type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Sort direction for paginated cron listing. */
type CronSortDir = "asc" | "desc";
/** Input contract for filtered, sorted, offset-based cron job pages. */
type CronListPageOptions = {
  includeDisabled?: boolean;
  limit?: number;
  offset?: number;
  query?: string;
  enabled?: CronJobsEnabledFilter;
  scheduleKind?: CronJobsScheduleKindFilter;
  lastRunStatus?: CronJobsLastRunStatusFilter;
  sortBy?: CronJobsSortBy;
  sortDir?: CronSortDir;
  agentId?: string;
};
/** Offset-page result returned by cron listPage callers. */
type CronListPageResult<TJobs extends readonly CronJob[] = CronJob[]> = {
  jobs: TJobs /** Opaque revision for the complete filtered, sorted result set. */;
  snapshotRevision: string;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
};
//#endregion
//#region src/cron/service/state.d.ts
/** Direct-run mode: respect due time or force execution. */
type CronRunMode = "due" | "force";
/** Main-session wake strategy used after enqueuing cron text. */
type CronWakeMode = "now" | "next-heartbeat";
/** Lightweight service status returned to gateway/control surfaces. */
type CronStatusSummary = {
  enabled: boolean /** @deprecated Legacy partition key; actual storage is SQLite. Use `sqlitePath`. */;
  storePath: string /** Storage backend identifier. */;
  storage: "sqlite" /** Resolved path to the shared state SQLite database. */;
  sqlitePath: string;
  jobs: number;
  nextWakeAtMs: number | null;
};
/** Result shape for immediate or queued cron run requests. */
type CronRunResult =
  | {
      ok: true;
      ran: true;
    }
  | {
      ok: true;
      enqueued: true;
      runId: string;
    }
  | {
      ok: true;
      ran: false;
      reason: "not-due";
    }
  | {
      ok: true;
      ran: false;
      reason: "already-running";
    }
  | {
      ok: true;
      ran: false;
      reason: "restart-recovery-pending";
    }
  | {
      ok: true;
      ran: false;
      reason: "invalid-spec";
    }
  | {
      ok: true;
      ran: false;
      reason: "stopped";
    }
  | {
      ok: false;
    };
/** Remove result that distinguishes missing jobs from failed removal. */
type CronRemoveResult =
  | {
      ok: true;
      removed: boolean;
    }
  | {
      ok: false;
      removed: false;
    };
/** Created cron job returned by service mutation calls. */
type CronDeclarativeAddResult = CronJob & {
  created: boolean;
  updated?: boolean;
  job: CronJob;
};
type CronAddResult = CronJob | CronDeclarativeAddResult;
/** Updated cron job returned by service mutation calls. */
type CronUpdateResult = CronJob;
/** Chronological job list returned by service read calls. */
type CronListResult = CronJob[];
/** Normalized create input accepted by the cron service. */
type CronAddInput = CronJobCreate;
/** Caller-specific declaration-key visibility and explicit enablement metadata. */
type CronAddOptions = {
  matchesExisting?: (job: CronJob) => boolean;
  enabledExplicit?: boolean;
};
/** Normalized patch input accepted by cron service updates. */
type CronUpdateInput = CronJobPatch;
/** Cron-store-locked guard evaluated against the current job before an update applies. */
type CronUpdatePrecondition = (job: CronJob, nowMs: number) => void | Promise<void>;
//#endregion
//#region src/cron/service-contract.d.ts
type CronWakeResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason?: "unwakeable-session-key";
    };
/** Result shape for direct/queued cron runs. */
type CronServiceRunResult = CronRunResult;
type CronServiceRunOptions = {
  payload?: CronPayload;
};
/** Public cron service facade used by gateway, plugin SDK, and tests. */
interface CronServiceContract {
  start(): Promise<void>;
  stop(): void;
  status(): Promise<CronStatusSummary>;
  list(opts?: { includeDisabled?: boolean }): Promise<CronListResult>;
  listPage(opts?: CronListPageOptions): Promise<CronListPageResult>;
  add(input: CronAddInput, opts?: CronAddOptions): Promise<CronAddResult>;
  update(id: string, patch: CronUpdateInput): Promise<CronUpdateResult>;
  updateWithPrecondition(
    id: string,
    patch: CronUpdateInput,
    precondition: CronUpdatePrecondition,
  ): Promise<CronUpdateResult>;
  remove(id: string): Promise<CronRemoveResult>;
  run(id: string, mode?: CronRunMode, opts?: CronServiceRunOptions): Promise<CronServiceRunResult>;
  enqueueRun(id: string, mode?: CronRunMode): Promise<CronServiceRunResult>;
  getJob(id: string): CronJob | undefined;
  readJob(id: string): Promise<CronJob | undefined>;
  getDefaultAgentId(): string | undefined;
  wake(opts: {
    mode: CronWakeMode;
    text: string;
    sessionKey?: string;
    agentId?: string;
  }): CronWakeResult;
}
//#endregion
//#region src/gateway/server-cron-contract.d.ts
type GatewayCronServiceContract = CronServiceContract & {
  /** Temporarily disarm ticks without running startup recovery on resume. */ pauseScheduling(): void;
  resumeScheduling(): void /** Scheduler-owned work not represented by active cron run markers. */;
  getSuspensionBlockerCount?(): number;
};
//#endregion
//#region src/gateway/server-shared.d.ts
type DedupeEntry = {
  ts: number;
  ok: boolean;
  payload?: unknown;
  error?: ErrorShape;
};
//#endregion
//#region src/gateway/terminal/launch.d.ts
/** Why a terminal cannot open, or `null` when it can. */
type TerminalLaunchBlock =
  | {
      kind: "disabled";
    }
  | {
      kind: "unknown-agent";
      agentId: string;
    }
  | {
      kind: "sandboxed";
      agentId: string;
      mode: "all";
    };
/** Resolved plan for a host terminal session. */
type TerminalLaunchPlan = {
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  initialCommand?: string[];
  cwdOverride?: string;
};
/** Terminal launch resolution result: either a runnable plan or a block reason. */
type TerminalLaunchResolution =
  | {
      ok: true;
      plan: TerminalLaunchPlan;
    }
  | {
      ok: false;
      block: TerminalLaunchBlock;
    };
//#endregion
//#region src/process/terminal-pty.d.ts
/** Live PTY handle shared by gateway terminals and node-host commands. */
type TerminalPtyHandle = {
  pid: number;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  onData(listener: (chunk: string) => void): void;
  onExit(listener: (event: { exitCode: number; signal?: number }) => void): void;
  kill(signal?: string): void;
};
declare function spawnTerminalPty(params: {
  file: string;
  args: string[];
  cwd?: string;
  env: Record<string, string>;
  cols: number;
  rows: number;
}): Promise<TerminalPtyHandle>;
//#endregion
//#region src/gateway/terminal/backend.d.ts
type TerminalBackendExit = {
  exitCode?: number;
  signal?: number;
  error?: string;
};
interface TerminalBackend {
  write(data: string): void;
  resize(cols: number, rows: number): void;
  kill(): void;
  onData(callback: (data: string) => void): void;
  onExit(callback: (exit: TerminalBackendExit) => void): void;
}
type LocalTerminalBackendSpawner = typeof spawnTerminalPty;
//#endregion
//#region src/gateway/terminal/session-manager.d.ts
/** Emits one terminal event frame to the single owning connection. */
type TerminalEventSink = (connId: string, event: string, payload: unknown) => void;
/** One session's facts as reported by terminal.list. */
type TerminalSessionSummary = {
  sessionId: string;
  agentId: string;
  shell: string;
  cwd: string;
  attached: boolean;
  createdAtMs: number;
};
/** Default grace period before a detached session is killed (seconds). */
type TerminalSessionManagerOptions = {
  emit: TerminalEventSink;
  spawn?: LocalTerminalBackendSpawner;
  maxSessions?: number;
  env?: NodeJS.ProcessEnv;
  /**
   * How long a session may stay detached after its connection drops before it
   * is killed. 0 (default) preserves kill-on-disconnect; the config-facing
   * default lives in DEFAULT_TERMINAL_DETACH_SECONDS and is applied by the
   * gateway wiring.
   */
  detachGraceMs?: number;
  maxDetachedSessions?: number;
  scrollbackChars?: number;
};
/** Parameters for a resolved host terminal launch (isolation already checked). */
type TerminalOpenRequest = {
  connId: string;
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  cols: number;
  rows: number;
  env: Record<string, string>;
  createBackend?: () => Promise<TerminalBackend>;
};
type TerminalOpenOutcome =
  | {
      ok: true;
      sessionId: string;
      agentId: string;
      cwd: string;
      shell: string;
    }
  | {
      ok: false;
      code: "limit" | "spawn_failed" | "closed";
      message: string;
    };
/**
 * Tracks live PTY sessions keyed by session id, with a reverse index by
 * connection so a disconnect can tear down every shell it owned.
 */
declare class TerminalSessionManager {
  private readonly sessions;
  private readonly byConn;
  private readonly pendingOpens;
  private readonly emit;
  private readonly spawn?;
  private readonly maxSessions;
  private readonly detachGraceMs;
  private readonly maxDetachedSessions;
  private readonly scrollbackChars;
  private opening;
  constructor(options: TerminalSessionManagerOptions);
  /** Number of live sessions; used by tests and health surfaces. */
  get size(): number;
  /** Spawns a shell and wires its output/exit to the owning connection. */
  open(request: TerminalOpenRequest): Promise<TerminalOpenOutcome>;
  /** Writes client input to a session; returns false when the session is gone. */
  write(connId: string, sessionId: string, data: string): boolean;
  /** Applies a new PTY grid size; returns false when the session is gone. */
  resize(connId: string, sessionId: string, cols: number, rows: number): boolean;
  /** Closes one session on operator request. */
  close(connId: string, sessionId: string): boolean;
  /**
   * Rebinds a live-or-detached session to `connId` and returns the replay
   * buffer. Take-over is deliberate: the surface is operator.admin (full host
   * access already), so any admin connection may adopt any session; a previous
   * live owner is notified with reason "detached". Snapshot and rebind happen
   * in one synchronous step, so no PTY chunk can land in both the returned
   * buffer and the new owner's event stream.
   */
  attach(
    connId: string,
    sessionId: string,
  ):
    | {
        sessionId: string;
        agentId: string;
        cwd: string;
        shell: string;
        buffer: string;
      }
    | undefined;
  /** Every live session, oldest first; all admin connections see the same list. */
  list(): TerminalSessionSummary[];
  /** Raw buffered output for one session, or undefined when it is gone. */
  snapshot(sessionId: string): string | undefined;
  private trackPendingOpen;
  private untrackPendingOpen;
  /**
   * Handles a dropped connection: detaches its sessions for later reattach
   * when a grace period is configured, otherwise kills them (legacy behavior,
   * still selected by detachedSessionTimeoutSeconds: 0).
   */
  handleDisconnect(connId: string): void;
  /** Closes live and pending sessions whose agent no longer permits a host shell. */
  closeDisallowedAgents(isAllowed: (agentId: string) => boolean): void;
  /** Parks a session ownerless with a reaper; PTY output keeps buffering. */
  private detach;
  private enforceDetachedCap;
  /**
   * Tears down every session — detached ones included — on gateway
   * shutdown/stop. Silent because the sockets are going away anyway (disabling
   * the terminal is a `gateway` restart, so that path also runs through here,
   * not a live notification).
   */
  disposeAll(): void;
  private indexByConn;
  private ownedSession;
  private finalize;
}
//#endregion
//#region src/gateway/worker-environments/placement-record.d.ts
type WorkerSessionPlacementIdentity = {
  sessionId: string;
  agentId: string;
  sessionKey: string;
};
type PersistedTurnClaim =
  | {
      owner: "local";
      claimId: string;
      runId: string;
      generation: number;
      ownerEpoch: null;
    }
  | {
      owner: "worker";
      claimId: string;
      runId: string;
      generation: number;
      ownerEpoch: number;
    };
type PersistedLocalTurnClaim = Extract<
  PersistedTurnClaim,
  {
    owner: "local";
  }
>;
type PersistedWorkerTurnClaim = Extract<
  PersistedTurnClaim,
  {
    owner: "worker";
  }
>;
type PlacementRecordBase<TurnClaim extends PersistedTurnClaim | null> =
  WorkerSessionPlacementIdentity & {
    generation: number;
    turnClaim: TurnClaim;
    createdAtMs: number;
    updatedAtMs: number;
    stateChangedAtMs: number;
  };
type UnclaimedPlacementRecordBase = PlacementRecordBase<null>;
type LocalClaimablePlacementRecordBase = PlacementRecordBase<PersistedLocalTurnClaim | null>;
type WorkerClaimablePlacementRecordBase = PlacementRecordBase<PersistedWorkerTurnClaim | null>;
type EmptyWorkerPlacementMetadata = {
  environmentId: null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
};
type ProvisioningPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
};
type SyncingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
};
type StartingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
};
type OwnedWorkerPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: number;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  recoveryError: null;
};
type TerminalPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: number | null;
  workspaceBaseManifestRef: string | null;
  remoteWorkspaceDir: string | null;
  workerBundleHash: string | null;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
};
type LocalPlacementRecord = LocalClaimablePlacementRecordBase &
  EmptyWorkerPlacementMetadata & {
    state: "local";
  };
type RequestedPlacementRecord = LocalClaimablePlacementRecordBase &
  EmptyWorkerPlacementMetadata & {
    state: "requested";
  };
type ProvisioningPlacementRecord = UnclaimedPlacementRecordBase &
  ProvisioningPlacementMetadata & {
    state: "provisioning";
  };
type SyncingPlacementRecord = UnclaimedPlacementRecordBase &
  SyncingPlacementMetadata & {
    state: "syncing";
  };
type StartingPlacementRecord = UnclaimedPlacementRecordBase &
  StartingPlacementMetadata & {
    state: "starting";
  };
type ActivePlacementRecord = WorkerClaimablePlacementRecordBase &
  OwnedWorkerPlacementMetadata & {
    state: "active";
  };
type DrainingPlacementRecord = WorkerClaimablePlacementRecordBase &
  OwnedWorkerPlacementMetadata & {
    state: "draining";
  };
type ReconcilingPlacementRecord = UnclaimedPlacementRecordBase &
  OwnedWorkerPlacementMetadata & {
    state: "reconciling";
  };
type ReclaimedPlacementRecord = UnclaimedPlacementRecordBase &
  OwnedWorkerPlacementMetadata & {
    state: "reclaimed";
  };
type FailedPlacementRecord = LocalClaimablePlacementRecordBase &
  TerminalPlacementMetadata & {
    state: "failed";
    recoveryError: string;
  };
type WorkerSessionPlacementRecord =
  | LocalPlacementRecord
  | RequestedPlacementRecord
  | ProvisioningPlacementRecord
  | SyncingPlacementRecord
  | StartingPlacementRecord
  | ActivePlacementRecord
  | DrainingPlacementRecord
  | ReconcilingPlacementRecord
  | ReclaimedPlacementRecord
  | FailedPlacementRecord;
//#endregion
//#region src/gateway/worker-environments/placement-projector.d.ts
type WorkerSessionPlacementReader = {
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
};
//#endregion
//#region src/gateway/worker-environments/tunnel-contract.d.ts
type WorkerTunnelStatus = "stopped" | "connecting" | "connected" | "reconnecting";
type WorkerTunnelRequest = {
  environmentId: string;
  ownerEpoch: number;
};
type WorkerWorkspaceCommand = {
  argv: readonly string[];
  input?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
};
type WorkerWorkspaceSyncRequest = {
  localPath: string;
  sessionId: string;
  generation: number;
};
type WorkerWorkspaceSyncResult = {
  mode: "git" | "plain";
  remoteWorkspaceDir: string;
  manifestRef: string;
};
type WorkerTunnelHandle = {
  environmentId: string;
  ownerEpoch: number;
  remoteSocketPath: string;
  runWorkspaceCommand(command: WorkerWorkspaceCommand): Promise<SpawnResult>;
  syncWorkspace(request: WorkerWorkspaceSyncRequest): Promise<WorkerWorkspaceSyncResult>;
  stop(): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/service-contract.d.ts
/** Non-secret worker projection available to Gateway request handlers. */
type WorkerEnvironmentServiceRecord = {
  environmentId: string;
  providerId: string;
  leaseId: string | null;
  state: WorkerEnvironmentState;
  ownerEpoch: number;
  createdAtMs: number;
  idleSinceAtMs: number | null;
  attachedSessionIds: readonly string[];
  tunnelStatus: WorkerTunnelStatus;
};
/** Request-facing lifecycle methods, kept separate from persistence and provider internals. */
type WorkerEnvironmentServiceContract = {
  list(): WorkerEnvironmentServiceRecord[];
  get(environmentId: string): WorkerEnvironmentServiceRecord | undefined;
  create(profileId: string, idempotencyKey: string): Promise<WorkerEnvironmentServiceRecord>;
  destroy(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  startTunnel(request: WorkerTunnelRequest): Promise<WorkerTunnelHandle>;
  stopTunnel(environmentId: string, ownerEpoch?: number): Promise<void>;
};
type WorkerPlacementDispatchRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
  profileId: string;
};
type WorkerPlacementDispatchContract = {
  dispatch(request: WorkerPlacementDispatchRequest): Promise<
    Extract<
      WorkerSessionPlacementRecord,
      {
        state: "active";
      }
    >
  >;
};
//#endregion
//#region src/gateway/server-methods/shared-types.d.ts
/**
 * Shared gateway request types used by every server-method module.
 */
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
/** Per-connection client metadata captured after the gateway handshake. */
type GatewayClient = {
  connect: ConnectParams;
  connId?: string;
  clientIp?: string;
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<
    string,
    {
      capability: string;
      expiresAtMs: number;
    }
  >;
  isDeviceTokenAuth?: boolean;
  internal?: {
    allowModelOverride?: boolean;
    approvalRuntime?: boolean;
    cronRunContinuation?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
    pluginRuntimeOwnerId?: string;
    agentRunTracking?: "plugin_subagent" /** Plugin-owned tools authorized for this internal subagent run. */;
    runtimePluginToolGrant?: RuntimePluginToolGrant;
  };
};
/** Callback used by method handlers to emit one protocol response frame. */
type RespondFn = (
  ok: boolean,
  payload?: unknown,
  error?: ErrorShape,
  meta?: Record<string, unknown>,
) => void;
/** Minimal hosted Crestodian contract retained by the gateway request router. */
type GatewayCrestodianSession = {
  engine: {
    handle: (message: string) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
    }>;
    dispose: () => Promise<void>;
  };
  welcome: string;
  lastUsedAt: number;
};
/** Runtime services and mutable gateway state available to request handlers. */
type GatewayRequestContext = {
  deps: CliDeps;
  cron: GatewayCronServiceContract;
  cronStorePath: string;
  getRuntimeConfig: () => OpenClawConfig;
  getMcpAppSandboxPort?: () => number | undefined;
  resolveTerminalLaunchPolicy: (agentId?: string) => TerminalLaunchResolution;
  isTerminalEnabled: () => boolean;
  execApprovalManager?: ExecApprovalManager;
  pluginApprovalManager?: ExecApprovalManager<PluginApprovalRequestPayload>;
  forwardPluginApprovalRequest?: (request: PluginApprovalRequest) => Promise<boolean>;
  listSessionPendingApprovals?: (
    sessionKey: string,
    client: GatewayClient | null,
  ) => SessionApprovalReplay;
  loadGatewayModelCatalog: (params?: { readOnly?: boolean }) => Promise<ModelCatalogEntry[]>;
  loadGatewayModelCatalogSnapshot: (params?: {
    readOnly?: boolean;
  }) => Promise<ModelCatalogSnapshot>;
  getHealthCache: () => HealthSummary | null;
  refreshHealthSnapshot: (opts?: {
    probe?: boolean;
    includeSensitive?: boolean;
  }) => Promise<HealthSummary>;
  logHealth: {
    error: (message: string) => void;
  };
  logGateway: SubsystemLogger;
  incrementPresenceVersion: () => number;
  getHealthVersion: () => number;
  broadcast: GatewayBroadcastFn;
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
  nodeSendToAllSubscribed: (event: string, payload: unknown) => void;
  nodeSubscribe: (nodeId: string, sessionKey: string) => void;
  nodeUnsubscribe: (nodeId: string, sessionKey: string) => void;
  nodeUnsubscribeAll: (nodeId: string) => void;
  hasConnectedTalkNode: () => boolean;
  isConnectionActive?: (connId: string) => boolean;
  hasExecApprovalClients?: (excludeConnId?: string) => boolean;
  getApprovalClientConnIds?: <TPayload>(params?: {
    excludeConnId?: string;
    filter?: (client: GatewayClient, record?: ExecApprovalRecord<TPayload>) => boolean;
    record?: ExecApprovalRecord<TPayload>;
  }) => ReadonlySet<string>;
  disconnectClientsForDevice?: (
    deviceId: string,
    opts?: {
      role?: string;
    },
  ) => void;
  invalidateClientsForDevice?: (
    deviceId: string,
    opts?: {
      role?: string;
      reason?: string;
    },
  ) => void;
  hasConnectedClientsForDevice?: (deviceId: string) => boolean;
  disconnectClientsUsingSharedGatewayAuth?: () => void;
  enforceSharedGatewayAuthGenerationForConfigWrite?: (nextConfig: OpenClawConfig) => void;
  nodeRegistry: NodeRegistry /** Durable cloud-worker lifecycle; absent from lightweight in-process contexts. */;
  workerEnvironmentService?: WorkerEnvironmentServiceContract /** Durable per-session worker placement; absent when cloud workers are disabled. */;
  workerSessionPlacementService?: WorkerSessionPlacementReader /** One-way local-to-worker dispatch; absent when cloud workers are disabled. */;
  workerPlacementDispatchService?: WorkerPlacementDispatchContract;
  terminalSessions?: TerminalSessionManager;
  agentRunSeq: Map<string, number>;
  chatAbortControllers: Map<
    string,
    ChatAbortControllerEntry
  > /** Cancel identities for turns waiting in the followup/collect queue. */;
  chatQueuedTurns: Map<string, QueuedChatTurnEntry>;
  chatAbortedRuns: Map<string, ChatAbortMarker>;
  chatRunBuffers: Map<string, string>;
  chatDeltaSentAt: Map<string, number>;
  chatDeltaLastBroadcastLen: Map<string, number>;
  chatDeltaLastBroadcastText: Map<string, string>;
  agentDeltaSentAt: Map<string, number>;
  bufferedAgentEvents: Map<string, BufferedAgentEvent>;
  clearChatRunState: (runId: string) => void;
  addChatRun: (sessionId: string, entry: ChatRunRegistration) => void;
  removeChatRun: (
    sessionId: string,
    clientRunId: string,
    sessionKey?: string,
  ) => ChatRunEntry | undefined;
  subscribeSessionEvents: (connId: string) => void;
  unsubscribeSessionEvents: (connId: string) => void;
  subscribeSessionMessageEvents: (
    connId: string,
    sessionKey: string,
    opts?: {
      includeApprovals?: boolean;
    },
  ) => (() => void) | undefined;
  unsubscribeSessionMessageEvents: (connId: string, sessionKey: string) => void;
  unsubscribeAllSessionEvents: (connId: string) => void;
  getSessionEventSubscriberConnIds: () => ReadonlySet<string>;
  registerToolEventRecipient: (runId: string, connId: string) => void;
  dedupe: Map<string, DedupeEntry>;
  wizardSessions: Map<string, WizardSession>;
  crestodianSessions: Map<string, GatewayCrestodianSession>;
  findRunningWizard: () => string | null;
  purgeWizardSession: (id: string) => void;
  getRuntimeSnapshot: () => ChannelRuntimeSnapshot;
  getEventLoopHealth?: () => GatewayEventLoopHealth | undefined;
  getConfigReloaderHotReloadStatus?: () => GatewayHotReloadStatus | undefined;
  startChannel: (
    channel: ChannelId,
    accountId?: string,
    opts?: StartChannelOptions,
  ) => Promise<void>;
  stopChannel: (channel: ChannelId, accountId?: string) => Promise<void>;
  markChannelLoggedOut: (channelId: ChannelId, cleared: boolean, accountId?: string) => void;
  wizardRunner: (
    opts: OnboardOptions,
    runtime: RuntimeEnv,
    prompter: WizardPrompter,
  ) => Promise<void>;
  channelWizardRunner: ChannelSetupWizardRunner;
  broadcastVoiceWakeChanged: (triggers: string[]) => void;
  broadcastVoiceWakeRoutingChanged: (config: VoiceWakeRoutingConfig) => void;
  unavailableGatewayMethods?: ReadonlySet<string>;
};
/** Full dispatch context for raw request frames before params are normalized. */
type GatewayRequestOptions = {
  req: RequestFrame;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
  methodRegistry?: GatewayMethodRegistryView;
};
/** Normalized method invocation options passed to registered handlers. */
type GatewayRequestHandlerOptions = {
  req: RequestFrame;
  params: Record<string, unknown>;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
};
/** Single gateway method implementation. */
type GatewayRequestHandler = (opts: GatewayRequestHandlerOptions) => Promise<void> | void;
/** Registry fragment keyed by gateway protocol method name. */
type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;
//#endregion
export {
  rotateAgentEventLifecycleGeneration as A,
  QueuedChatTurnMap as C,
  emitAgentEvent as D,
  AgentEventStream as E,
  onAgentEvent as O,
  ChannelChoice as S,
  AgentEventPayload as T,
  GatewayMethodDescriptor as _,
  GatewayRequestOptions as a,
  ChatRunEntry as b,
  CronServiceContract as c,
  NormalizedPluginNodeCapabilityUrl as d,
  PLUGIN_NODE_CAPABILITY_PATH_PREFIX as f,
  normalizePluginNodeCapabilityScopedUrl as g,
  mintPluginNodeCapabilityToken as h,
  GatewayRequestHandlers as i,
  SecretInputMode as j,
  resetAgentEventsForTest as k,
  NodeSession as l,
  buildPluginNodeCapabilityScopedHostUrl as m,
  GatewayRequestHandler as n,
  RespondFn as o,
  PluginNodeCapabilitySurface as p,
  GatewayRequestHandlerOptions as r,
  spawnTerminalPty as s,
  GatewayRequestContext as t,
  DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS as u,
  ChatAbortControllerEntry as v,
  AgentApprovalEventData as w,
  ChatRunState as x,
  RestartRecoveryCandidate as y,
};
