import { IncomingMessage, ServerResponse } from "node:http";
import { Duplex } from "node:stream";
import { Command } from "commander";
import { TSchema, Type } from "typebox";
import {
  a as createAckReactionHandle,
  c as shouldAckReaction,
  d as resolveAgentIdentity,
  f as resolveEffectiveMessagesConfig,
  o as removeAckReactionAfterReply,
  p as resolveHumanDelayConfig,
  s as removeAckReactionHandleAfterReply,
} from "./ack-reactions-CPe7vd_e.js";
import { N as resolveAgentDir, P as resolveAgentWorkspaceDir } from "./agent-scope-C-j0oyUV.js";
import {
  c as SandboxBackendWorkdirValidator,
  r as SandboxBackendExecSpec,
  s as SandboxBackendWorkdirValidation,
  u as SandboxFsBridge,
} from "./backend-handle.types-BB1SUqT2.js";
import {
  n as getChannelActivity,
  r as recordChannelActivity,
} from "./channel-activity-B4WQX84y.js";
import { t as ChannelId$1 } from "./channel-id.types-DjYEl-_2.js";
import { o as ChannelRouteRef } from "./channel-route-DUbOqcPC.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { t as hasControlCommand } from "./command-detection-BGfS9Paq.js";
import { r as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-pUtyEXB1.js";
import {
  n as RuntimeWebFetchMetadata,
  r as RuntimeWebSearchMetadata,
} from "./command-secret-gateway-CIYWt4i4.js";
import {
  s as CommandNormalizeOptions,
  u as ShouldHandleTextCommandsParams,
} from "./commands-registry.types-Cxf8RKoB.js";
import { r as AnyAgentTool } from "./common-CuQ9SS3Z.js";
import { M as ConfigMutationBase, S as ConfigReplaceResult } from "./config-COuhEATv.js";
import { s as mediaKindFromMime } from "./constants-DUpDbaN0.js";
import {
  a as PluginConversationBindingResolvedEvent,
  n as PluginConversationBindingRequestParams,
  r as PluginConversationBindingRequestResult,
  t as PluginConversationBinding,
} from "./conversation-binding.types-FpB9wxq5.js";
import { n as TimeFormatPreference } from "./date-time-C_aF3jiN.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-DZhrVvBP.js";
import {
  a as OutboundDeliveryQueuePolicy,
  n as DurableFinalDeliveryRequirement,
  r as DurableFinalDeliveryRequirements,
  t as DeliverOutboundPayloadsParams,
} from "./deliver-CNrSs2eV.js";
import { t as DeliveryContext } from "./delivery-context.types-DyNhFIjW.js";
import {
  St as DiagnosticToolTerminalReason,
  a as DiagnosticEventPayload,
  i as DiagnosticEventMetadata,
  o as DiagnosticEventPrivateData,
  r as DiagnosticEventInput,
  rn as TalkTransport,
} from "./diagnostic-events-CKz1uC46.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";
import { r as EmbeddingProviderAdapter } from "./embedding-providers-WKzPF8ab.js";
import {
  C as ExecTarget,
  S as ExecSecurity,
  x as ExecMode,
  y as ExecAsk,
} from "./exec-approvals-B59RubLo.js";
import { i as ExecAutoReviewer } from "./exec-auto-review-D8kEqNZE.js";
import { o as runCommandWithTimeout } from "./exec-D8nvu0GV.js";
import { t as ExecPolicyOverrides } from "./exec-defaults-mW2NZWKv.js";
import { n as SafeBinProfileFixture } from "./exec-safe-bin-policy-profiles-CWCK911g.js";
import { a as fetchWithSsrFGuard } from "./fetch-guard-BKvfwdRa.js";
import {
  d as readRemoteMediaBuffer,
  f as saveRemoteMedia,
  g as isVoiceCompatibleAudio,
  p as saveResponseMedia,
  u as fetchRemoteMedia,
} from "./fetch-tnLc3P_i.js";
import { a as shouldLogVerbose } from "./globals-BL1_NohW.js";
import {
  n as resolveChannelGroupPolicy,
  r as resolveChannelGroupRequireMention,
} from "./group-policy-qBQEoR2A.js";
import { n as requestHeartbeat, t as HeartbeatRunResult } from "./heartbeat-wake-B86CisPK.js";
import { n as HistoryMediaEntry, t as HistoryEntry } from "./history.types-Bc8mCALh.js";
import {
  Cn as ReplyFollowupAdmissionBarrierTimeoutPolicy,
  Dt as PluginHookToolContext,
  Kt as PluginNextTurnInjection,
  N as PluginHookBeforeToolCallEvent,
  Ot as PluginHookToolInputKind,
  Sn as ReplyDispatcher,
  X as PluginHookHandlerMap,
  Yt as PluginJsonValue,
  an as PluginApprovalResolution,
  bn as ReplyDispatchKind,
  dn as PluginHookBeforeAgentStartResult,
  kt as PluginHookToolKind,
  qt as PluginNextTurnInjectionEnqueueResult,
  rt as PluginHookName,
  sn as PluginHookBeforeToolCallResult,
  vn as ReplyDispatchBeforeDeliver,
  xn as ReplyDispatchRuntimeInfo,
  yn as ReplyDispatchBeforeDeliverOptions,
} from "./hook-types-BPL4xByC.js";
import {
  n as createInboundDebouncer,
  r as resolveInboundDebounceMs,
} from "./inbound-debounce-DmPtE4l0.js";
import { Ai as AuthStorage, Ci as ModelRegistry$1 } from "./index-BktXvOF0.js";
import { d as retryAsync } from "./index-btg4aXoO.js";
import { Hc as NodePluginToolDescriptor } from "./index-F2ydESCy.js";
import {
  a as ensureAgentWorkspace,
  i as WorkspaceBootstrapFile,
  r as InternalHookHandler,
} from "./internal-hook-types-BohNPEA8.js";
import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";
import { _ as completeSimple } from "./llm-D7I9hiPT.js";
import {
  _ as PluginConfigUiHint,
  f as PluginKind,
  m as UnifiedModelCatalogKind,
  p as UnifiedModelCatalogEntry,
  t as PluginManifestRecord,
} from "./manifest-registry-CHEq75Tu.js";
import { t as ResolveMarkdownTableMode } from "./markdown-tables.types-Cm1PU7Vw.js";
import { h as resizeToJpeg, u as getImageMetadata } from "./media-services-BERk4_dH.js";
import {
  d as MemoryPromptSectionBuilder,
  o as MemoryFlushPlanResolver,
  r as MemoryCorpusSupplement,
  s as MemoryPluginCapability,
  u as MemoryPluginRuntime,
} from "./memory-state-wPutFXhr.js";
import {
  f as implicitMentionKindWhen,
  p as resolveInboundMentionDecision,
} from "./mention-gating-D6dFDlTf.js";
import {
  a as MatchesMentionWithExplicit,
  i as MatchesMentionPatterns,
  t as BuildMentionRegexes,
} from "./mentions.types-CoRK8mYD.js";
import { n as detectMime } from "./mime-B6baDqNM.js";
import { w as ResolvedProviderAuth } from "./model-auth-DQnRyl6R.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-DCVmZqMZ.js";
import { t as FallbackAttempt } from "./model-fallback.types-BQxBBoz4.js";
import {
  n as MemoryMultimodalSettings,
  t as MemoryMultimodalModality,
} from "./multimodal-B2zGqeG7.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import {
  _ as chunkTextWithMode,
  g as chunkText,
  h as chunkMarkdownTextWithMode,
  m as chunkMarkdownText,
  n as ChannelOutboundAdapter,
  p as chunkByNewline,
  v as resolveChunkMode,
  y as resolveTextChunkLimit,
} from "./outbound.types-Bu7WWq9f.js";
import {
  a as PairLoopGuardResult,
  i as PairLoopGuardConfig,
} from "./pair-loop-guard-runtime-D5O3zwX9.js";
import { t as buildPairingReply } from "./pairing-messages-Wsx2loB_.js";
import {
  n as ReadChannelAllowFromStoreForAccount$1,
  r as UpsertChannelPairingRequestForAccount$1,
} from "./pairing-store.types-Be-qiql4.js";
import { y as resolveStateDir } from "./paths-CAFnjuPj.js";
import { t as PluginMetadataRegistryView } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import {
  i as PluginStateSyncKeyedStore,
  r as PluginStateKeyedStore,
  t as OpenKeyedStoreOptions,
} from "./plugin-state-store.types-xAF7b0j2.js";
import { i as WizardPrompter } from "./prompts-CWXx5gsI.js";
import {
  c as ProviderRouteOverridePresence,
  i as ProviderModelRouteRuntimePolicy,
  t as ProviderModelRouteAuthRequirement,
} from "./provider-model-types-BoDUnm4e.js";
import { t as ModelProviderRequestTransportOverrides$1 } from "./provider-request-config-CKlP6x21.js";
import { o as TranscriptSourceProvider$1 } from "./provider-types-BrEVLGDY.js";
import {
  o as ProviderUsageSnapshot,
  s as UsageProviderId,
} from "./provider-usage.types-CSw7pG9h.js";
import { l as shouldUseEnvHttpProxyForUrl } from "./proxy-env-CRHrWZla.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { n as CreateChannelReplyPipelineParams } from "./reply-pipeline-BKuDvmoC.js";
import { a as ResponsePrefixContext, s as TypingCallbacks } from "./reply-prefix-CA4uLlTg.js";
import { i as buildAgentSessionKey, o as resolveAgentRoute } from "./resolve-route-CtaxCE-K.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { t as ConfigWriteAfterWrite } from "./runtime-snapshot-CCyfWEDJ.js";
import { a as MediaUnderstandingRuntime } from "./runtime-types-QfLkmPUQ.js";
import { mt as ZodType } from "./schemas-CkRCGSfd.js";
import { c as SessionBindingRecord } from "./session-binding.types-BbT2v6Ty.js";
import { a as SessionCatalogProvider } from "./session-catalog-CskF-bPr.js";
import { i as resolveStorePath } from "./session-key-D5blOtL7.js";
import {
  n as RecordInboundSession$1,
  t as InboundLastRouteUpdate,
} from "./session.types--DBIZ07e.js";
import { o as SsrFPolicy$1 } from "./ssrf-skjEI_i5.js";
import { l as EmbeddedAgentExecutionPhase } from "./store-CAl2QpVW.js";
import { p as saveMediaBuffer } from "./store-DQdI3SvC.js";
import { a as ResolvedSessionMaintenanceConfigInput } from "./store-DqqHyvXY.js";
import { t as FastMode } from "./string-coerce-DJnd-JG-.js";
import { s as LogLevel } from "./subsystem-BvPn7HK_.js";
import { o as enqueueSystemEvent } from "./system-events-BXY8tQQd.js";
import { n as SilentReplyPromptMode, t as PromptMode } from "./system-prompt.types-DK8-zL3a.js";
import { t as convertMarkdownTables } from "./tables-BBMGs0qO.js";
import {
  _ as InboundEventKind,
  a as SupplementalContextFacts,
  c as CommandTurnKind,
  h as PluginHookChannelContext,
  i as MsgContext,
  n as InboundSourceModality,
  r as MentionSource,
  s as CommandTurnContext,
  t as FinalizedMsgContext,
} from "./templating-h3OQefFR.js";
import {
  a as TraceLevel,
  i as ThinkingCatalogEntry,
  n as ReasoningLevel,
  o as VerboseLevel,
  r as ThinkLevel,
  t as ElevatedLevel,
} from "./thinking.shared-0bZWY054.js";
import { t as RuntimePluginToolGrant } from "./tool-grant-BSRz7IOf.js";
import { p as onSessionTranscriptUpdate } from "./transcript-B5Rnl-3l.js";
import {
  a as SkillUsagePath,
  i as SkillTelemetrySource,
  r as SkillSnapshot,
  t as SkillCommandSpec,
} from "./types-9R5xAbjv.js";
import { t as HookEntry } from "./types-BCpQVPCb.js";
import {
  a as SourceReplyDeliveryMode,
  c as PromptImageOrderEntry,
  n as GetReplyOptions,
  o as TaskSuggestionDeliveryMode,
  r as PartialReplyPayload,
  s as TypingController,
  t as BlockReplyContext,
} from "./types-BgrDi5xH.js";
import { f as MediaUnderstandingProvider } from "./types-Bp5h7fLi.js";
import { n as FailoverReason, t as EmbeddedContextFile } from "./types-CF0DHR3y.js";
import {
  E as ThinkingLevel,
  b as StreamFn,
  f as Model,
  l as ImageContent,
  n as Api,
  r as AssistantMessage,
} from "./types-CqrbBnUB.js";
import {
  _ as ImageGenerationSourceImage,
  c as ImageGenerationOutputFormat,
  f as ImageGenerationProviderOptions,
  h as ImageGenerationResolution,
  i as ImageGenerationNormalization,
  l as ImageGenerationProvider,
  n as ImageGenerationBackground,
  p as ImageGenerationQuality,
  r as ImageGenerationIgnoredOverride,
  t as GeneratedImageAsset,
} from "./types-CVRxRIni.js";
import {
  c as SessionPluginJsonValue,
  l as SessionScope$1,
  n as CliSessionBinding,
  o as SessionContextBudgetStatus,
  r as GroupKeyResolution,
  s as SessionEntry,
  u as SessionSystemPromptReport,
} from "./types-Dk-ocvLl.js";
import {
  E as AgentEventStream,
  O as onAgentEvent,
  T as AgentEventPayload,
  j as SecretInputMode,
  n as GatewayRequestHandler,
} from "./types-Dz3ohwUV.js";
import {
  c as OAuthCredential,
  i as AuthProfileCredential,
  s as AuthProfileStore,
  t as ApiKeyCredential,
} from "./types-Dzb4Vh4b.js";
import {
  c as VideoGenerationProvider,
  f as VideoGenerationResolution,
  m as VideoGenerationSourceAsset,
  r as VideoGenerationIgnoredOverride,
  s as VideoGenerationNormalization,
  t as GeneratedVideoAsset,
} from "./types-fuRzS_f5.js";
import { P as MessageReceipt } from "./types-FwtQl4mH.js";
import {
  T as StreamFn$1,
  f as AgentToolResult,
  l as AgentTool,
  s as AgentMessage,
} from "./types-JQFrjdua.js";
import {
  c as MusicGenerationProvider,
  f as MusicGenerationSourceImage,
  o as MusicGenerationNormalization,
  r as MusicGenerationIgnoredOverride,
  s as MusicGenerationOutputFormat,
  t as GeneratedMusicAsset,
} from "./types-nag6eG01.js";
import {
  N as SessionScope,
  f as ContextVisibilityMode,
  y as HumanDelayConfig,
} from "./types.base-ibSxQuK3.js";
import { q as ConversationReadInvocationOrigin } from "./types.core-CcwzPNhX.js";
import {
  a as ModelApi,
  d as ModelProviderAuthMode,
  f as ModelProviderConfig,
  l as ModelMediaInputConfig,
  o as ModelCompatConfig,
} from "./types.models-BqJSiNyu.js";
import {
  An as SilentReplyConversationType,
  gn as CliBackendConfig,
  i as OpenClawConfig,
  t as ConfigFileSnapshot,
  yt as TalkProviderConfig,
} from "./types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin$1 } from "./types.plugin-BGk2f9vp.js";
import { o as AgentModelConfig } from "./types.provider-request-CVFNhEKy.js";
import { d as SecretInput, h as SecretRef } from "./types.secrets-C15Z_eLX.js";
import {
  G as TtsAutoMode,
  K as TtsConfig,
  Pt as MemoryCitationsMode,
  Q as TtsProvider,
  W as ResolvedTtsPersona,
  q as TtsMode,
  wt as ToolLoopDetectionConfig,
} from "./types.slack-DOPma3IJ.js";
import { n as NormalizedUsage, t as ContextUsage } from "./usage-DzTfux3q.js";
import {
  n as UserTurnTranscriptRecorder,
  r as InputProvenance,
} from "./user-turn-transcript.types-BW3AU7-v.js";
import { n as loadWebMedia } from "./web-media-D1aVPCGn.js";

//#region src/auto-reply/reply/reply-run-registry.d.ts
type ReplyRunKey = string;
type ReplyBackendKind = "embedded" | "cli";
type ReplyBackendCancelReason = "user_abort" | "restart" | "superseded";
type ReplyBackendQueueMessageOptions = {
  steeringMode?: "all";
  debounceMs?: number;
  deliveryTimeoutMs?: number;
  waitForTranscriptCommit?: boolean;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode /** Prepared channel turn to merge only at transcript persistence. */;
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
};
type ReplyBackendHandle = {
  readonly kind: ReplyBackendKind;
  readonly sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  readonly taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  cancel(reason?: ReplyBackendCancelReason): void;
  isStreaming(): boolean;
  isStopped?: () => boolean;
  isAbortable?: () => boolean;
  queueMessage?: (text: string, options?: ReplyBackendQueueMessageOptions) => Promise<void>;
  /**
   * Compatibility-only hook so legacy "abort compacting runs" paths can still
   * find embedded runs that are compacting during the main run phase.
   */
  isCompacting?: () => boolean;
};
type ReplyOperationPhase =
  | "queued"
  | "waiting_for_deferred_maintenance"
  | "preflight_compacting"
  | "memory_flushing"
  | "running"
  | "completed"
  | "failed"
  | "aborted";
type ReplyOperationFailureCode =
  | "gateway_draining"
  | "command_lane_cleared"
  | "aborted_by_user"
  | "session_corruption_reset"
  | "run_stalled"
  | "run_failed";
type ReplyOperationAbortCode = "aborted_by_user" | "aborted_for_restart";
type ReplyOperationResult =
  | {
      kind: "completed";
    }
  | {
      kind: "failed";
      code: ReplyOperationFailureCode;
      cause?: unknown;
    }
  | {
      kind: "aborted";
      code: ReplyOperationAbortCode;
    };
type ReplyOperation = {
  readonly key: ReplyRunKey;
  readonly sessionId: string;
  readonly routeThreadId?: string | number;
  readonly abortSignal: AbortSignal;
  readonly resetTriggered: boolean;
  /**
   * True when this operation was admitted to recover a terminal session (a
   * leftover failed/timeout/killed run). Concurrent visible turns reading the
   * same terminal store snapshot must NOT force-clear such an operation: it is a
   * sibling recovery already in flight, not the proven stale leftover.
   */
  readonly terminalRecovery: boolean;
  /**
   * Sticky fact for audio accepted into this operation after its originating turn.
   * Final delivery reads it because the original dispatch context cannot change.
   */
  readonly acceptedSteeredInboundAudio: boolean;
  readonly phase: ReplyOperationPhase;
  readonly result: ReplyOperationResult | null;
  readonly startedAtMs: number;
  readonly lastActivityAtMs: number /** True when this operation has owned the supplied session ID. */;
  hasOwnedSessionId(sessionId: string): boolean;
  recordActivity(): void;
  setPhase(
    next:
      | "queued"
      | "waiting_for_deferred_maintenance"
      | "preflight_compacting"
      | "memory_flushing"
      | "running",
  ): void /** Mark this operation as waiting on prior same-session maintenance. */;
  markWaitingForDeferredMaintenance(): void /** Return a maintenance-waiting operation to queued if the run has not started. */;
  markDeferredMaintenanceWaitEnded(): void /** Mark this operation as an in-flight terminal-session recovery. */;
  markTerminalRecovery(): void;
  markAcceptedSteeredInboundAudio(): void;
  updateSessionId(nextSessionId: string): void;
  /**
   * Move this queued operation to another session key's run slot. Native command
   * turns admit under the slash SOURCE key; when the command continues into a full
   * agent turn it must own the TARGET session's slot so concurrent target inbounds
   * queue/steer instead of double-admitting. Throws ReplyRunAlreadyActiveError when
   * the target slot is owned.
   */
  updateSessionKey(nextSessionKey: string): void;
  attachBackend(handle: ReplyBackendHandle): void;
  detachBackend(
    handle: ReplyBackendHandle,
  ): void /** Reject later aborts after the backend has committed its terminal outcome. */;
  freezeAbort(): void;
  /**
   * Keep a failed operation active until complete() releases the session lane.
   * Dispatch uses this while a user-visible failure payload still needs delivery.
   */
  retainFailureUntilComplete(): void;
  complete(): void;
  /**
   * Complete the operation, clear active-run state, then run follow-up work.
   * Use when the follow-up can create another ReplyOperation for this session.
   */
  completeThen(afterClear: () => void): void;
  /**
   * Clear active-run state immediately, but delay registered after-clear work
   * until delivery or another external barrier settles.
   */
  completeWithAfterClearBarrier(
    barrier: PromiseLike<unknown>,
    timeout?: number | ReplyFollowupAdmissionBarrierTimeoutPolicy,
  ): void;
  fail(code: Exclude<ReplyOperationFailureCode, "aborted_by_user">, cause?: unknown): void;
  abortByUser(): boolean;
  abortForRestart(): boolean;
};
//#endregion
//#region src/process/command-queue.types.d.ts
/**
 * Public enqueue knobs shared by command-lane callers and narrower injection
 * points that should not import the full queue implementation.
 */
type CommandQueueEnqueueOptions = {
  warnAfterMs?: number;
  onWait?: (waitMs: number, queuedAhead: number) => void;
  taskTimeoutMs?: number;
  taskTimeoutProgressAtMs?: () => number | undefined;
  taskTimeoutAbortSignal?: AbortSignal;
  taskTimeoutAbortGraceMs?: number /** Ends the task after a caller-owned timeout cleanup grace has already elapsed. */;
  taskTimeoutReleaseSignal?: AbortSignal;
  priority?: "foreground" | "normal" | "background";
};
/** Minimal queue function contract used by code that only needs to schedule work. */
type CommandQueueEnqueueFn = <T>(
  task: () => Promise<T>,
  opts?: CommandQueueEnqueueOptions,
) => Promise<T>;
//#endregion
//#region src/skills/workshop/types.d.ts
type SkillProposalOrigin = {
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
};
/** Run-scoped budget shared by every workshop tool instance created across runner retries. */
type SkillWorkshopProposalMutationBudget = {
  remaining: number /** Distinct proposal records successfully mutated by this run. */;
  completed?: number /** Successful persisted mutation calls, including repeated revisions. */;
  successfulMutations?: number /** Failed or incompletely checkpointed reservations in the current model run. */;
  failedMutations?: number /** Run-local identity set used to keep idea counts distinct. */;
  mutatedProposalIds?: Set<string>;
};
type SkillWorkshopProposalReviewProgress = {
  proposalIds: string[];
  remaining: number;
  successfulMutations: number;
};
/** Shared completion latch for proposal-only reviewers that require a durable final checkpoint. */
type SkillWorkshopProposalReviewCompletion = {
  activeMutations?: Set<Promise<void>>;
  completed: boolean;
  complete: () => Promise<void>;
  phase?: "open" | "completing" | "completed";
  recordProgress?: (progress: SkillWorkshopProposalReviewProgress) => Promise<void>;
};
type SkillWorkshopRunOptions = {
  env?: NodeJS.ProcessEnv;
  proposalOnly?: boolean;
  origin?: SkillProposalOrigin;
  proposalMutationBudget?: SkillWorkshopProposalMutationBudget;
  proposalReviewCompletion?: SkillWorkshopProposalReviewCompletion;
};
//#endregion
//#region src/infra/event-session-routing.d.ts
/** Routing policy derived from config and the source session for an event. */
type EventSessionRoutingPolicy = {
  mainKey?: string;
  sessionScope?: SessionScope;
  dmScope?: string | null;
  allowFrom?: ReadonlyArray<string | number> | null;
  channel?: string | null;
  accountId?: string | null;
  preserveSessionKey?: boolean;
};
//#endregion
//#region src/agents/bash-tools.shared.d.ts
/** Sandbox metadata needed to map host workspaces into container exec calls. */
type BashSandboxConfig = {
  containerName: string;
  workspaceDir: string;
  containerWorkdir: string;
  workdirValidation?: SandboxBackendWorkdirValidation;
  validateWorkdir?: SandboxBackendWorkdirValidator;
  discardPreparedWorkdir?: (workdir: string) => void;
  workdirRoots?: readonly string[];
  env?: Record<string, string>;
  buildExecSpec?: (params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
    usePty: boolean;
  }) => Promise<SandboxBackendExecSpec>;
  finalizeExec?: (params: {
    status: "completed" | "failed";
    exitCode: number | null;
    timedOut: boolean;
    token?: unknown;
  }) => Promise<void>;
};
//#endregion
//#region src/auto-reply/heartbeat-tool-response.d.ts
/** Tool name used by heartbeat runs to report visible or silent progress. */
declare const HEARTBEAT_RESPONSE_TOOL_NAME = "heartbeat_respond";
/** Allowed heartbeat response outcomes. */
declare const HEARTBEAT_TOOL_OUTCOMES: readonly [
  "no_change",
  "progress",
  "done",
  "blocked",
  "needs_attention",
];
type HeartbeatToolOutcome = (typeof HEARTBEAT_TOOL_OUTCOMES)[number];
/** Allowed heartbeat notification priorities. */
declare const HEARTBEAT_TOOL_PRIORITIES: readonly ["low", "normal", "high"];
type HeartbeatToolPriority = (typeof HEARTBEAT_TOOL_PRIORITIES)[number];
/** Normalized response emitted by the heartbeat response tool. */
type HeartbeatToolResponse = {
  outcome: HeartbeatToolOutcome;
  notify: boolean;
  summary: string;
  notificationText?: string;
  reason?: string;
  priority?: HeartbeatToolPriority;
  nextCheck?: string;
};
/** Validate and normalize unknown heartbeat tool output. */
declare function normalizeHeartbeatToolResponse(value: unknown): HeartbeatToolResponse | undefined;
//#endregion
//#region src/agents/accepted-session-spawn.d.ts
type AcceptedSessionSpawn = {
  runId: string;
  childSessionKey: string;
};
//#endregion
//#region src/agents/embedded-agent-messaging.types.d.ts
type MessagingToolSend = {
  tool: string;
  provider: string;
  accountId?: string;
  to?: string;
  threadId?: string;
  threadImplicit?: boolean;
  threadSuppressed?: boolean;
  text?: string;
  mediaUrls?: string[];
  hasRichContent?: true /** Present only when Codex classified this current-source delivery intent. */;
  sourceReplyFinal?: boolean;
};
type MessagingToolSourceReplyPayload = Pick<
  ReplyPayload,
  | "audioAsVoice"
  | "channelData"
  | "interactive"
  | "mediaUrl"
  | "mediaUrls"
  | "presentation"
  | "text"
> & {
  idempotencyKey?: string /** Present only when Codex classified this current-source delivery intent. */;
  sourceReplyFinal?: boolean;
};
//#endregion
//#region src/agents/run-timeout-attribution.d.ts
/** Agent run phases used when attributing timeout/cancellation sources. */
declare const AGENT_RUN_TIMEOUT_PHASES: readonly [
  "queue",
  "preflight",
  "provider",
  "post_turn",
  "gateway_draining",
];
/** Timeout attribution phase for agent run lifecycle spans. */
type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
//#endregion
//#region src/agents/embedded-agent-runner/types.d.ts
type BlockReplyFlushContext =
  | {
      /** Boundary that requested the flush. */ reason: "message_end" | "terminal";
    }
  | {
      /** Tool boundary separating pre-tool narration from the eventual answer. */ reason: "tool_start";
      assistantMessageIndex: number;
    }
  | {
      /** Pre-compaction delivery is safe only for a completed assistant attempt. */ reason: "pre_compaction";
      attemptAccepted: boolean;
    };
type EmbeddedAgentMeta = {
  sessionId: string;
  sessionFile?: string;
  provider: string;
  model: string;
  contextTokens?: number;
  agentHarnessId?: string;
  fallbackAttempts?: FallbackAttempt[];
  cliSessionBinding?: CliSessionBinding;
  clearCliSessionBinding?: boolean;
  compactionCount?: number;
  /**
   * Token count estimate after the most recent successful auto-compaction.
   * Used as the freshest context snapshot when the follow-up model call omits
   * usage metadata.
   */
  compactionTokensAfter?: number;
  /**
   * Prompt/context snapshot from the latest model request. Prefer this for
   * context-window utilization because provider usage totals can include cached
   * and completion tokens that are useful for billing but noisy as live context.
   */
  promptTokens?: number;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    reasoningTokens?: number;
    total?: number;
  };
  /**
   * Usage from the last individual API call (not accumulated across tool-use
   * loops or compaction retries). Used for context-window utilization display
   * (`totalTokens` in sessions.json) because the accumulated `usage.input`
   * sums input tokens from every API call in the run, which overstates the
   * actual context size.
   */
  lastCallUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    contextUsage?: ContextUsage;
    reasoningTokens?: number;
    total?: number;
  };
  contextBudgetStatus?: SessionContextBudgetStatus;
};
type TraceAttempt = {
  provider: string;
  model: string;
  result:
    | "success"
    | "timeout"
    | "surface_error"
    | "candidate_failed"
    | "rotate_profile"
    | "same_model_rate_limit"
    | "fallback_model"
    | "aborted"
    | "error";
  reason?: string;
  stage?: "prompt" | "assistant";
  elapsedMs?: number;
  status?: number;
};
type ExecutionTrace = {
  winnerProvider?: string;
  winnerModel?: string;
  attempts?: TraceAttempt[];
  fallbackUsed?: boolean;
  runner?: "embedded" | "cli";
};
type RequestShapingTrace = {
  authMode?: string;
  thinking?: string;
  reasoning?: string;
  verbose?: string;
  trace?: string;
  fallbackEligible?: boolean;
  blockStreaming?: string;
};
type PromptSegmentTrace = {
  key: string;
  chars: number;
};
type ToolSummaryTrace = {
  calls: number;
  tools: string[];
  failures?: number;
  totalToolTimeMs?: number;
};
type CompletionTrace = {
  finishReason?: string;
  stopReason?: string;
  refusal?: boolean;
};
type ContextManagementTrace = {
  sessionCompactions?: number;
  lastTurnCompactions?: number;
  preflightCompactionApplied?: boolean;
  postCompactionContextInjected?: boolean;
};
type EmbeddedRunLivenessState = "working" | "paused" | "blocked" | "abandoned";
type EmbeddedRunFailureSignal = {
  kind: "execution_denied";
  source: "tool";
  toolName?: string;
  code: "SYSTEM_RUN_DENIED" | "INVALID_REQUEST";
  message: string;
  fatalForCron: true;
};
type EmbeddedAgentRunMeta = {
  durationMs: number;
  agentMeta?: EmbeddedAgentMeta;
  aborted?: boolean;
  systemPromptReport?: SessionSystemPromptReport;
  finalPromptText?: string;
  finalAssistantVisibleText?: string;
  finalAssistantRawText?: string;
  replayInvalid?: boolean;
  livenessState?: EmbeddedRunLivenessState;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
  agentHarnessResultClassification?: "empty" | "reasoning-only" | "planning-only";
  terminalReplyKind?: "silent-empty";
  yielded?: boolean;
  error?: {
    kind:
      | "context_overflow"
      | "compaction_failure"
      | "role_ordering"
      | "image_size"
      | "retry_limit"
      | "incomplete_turn"
      | "hook_block";
    message: string /** True only when model fallback can retry this terminal error without repeating side effects. */;
    fallbackSafe?: boolean /** True when the payload includes a trusted structured terminal tool summary. */;
    terminalPresentation?: boolean;
  };
  failureSignal?: EmbeddedRunFailureSignal /** Stop reason for the agent run (e.g., "completed", "tool_calls"). */;
  stopReason?: string /** Pending tool calls when stopReason is "tool_calls". */;
  pendingToolCalls?: Array<{
    id: string;
    name: string;
    arguments: string;
  }>;
  executionTrace?: ExecutionTrace;
  requestShaping?: RequestShapingTrace;
  promptSegments?: PromptSegmentTrace[];
  toolSummary?: ToolSummaryTrace;
  completion?: CompletionTrace;
  contextManagement?: ContextManagementTrace;
};
type EmbeddedAgentRunResult = {
  payloads?: Array<{
    text?: string;
    mediaUrl?: string;
    mediaUrls?: string[];
    replyToId?: string;
    isError?: boolean;
    isReasoning?: boolean /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */;
    isCommentary?: boolean;
    audioAsVoice?: boolean;
    trustedLocalMedia?: boolean;
    channelData?: Record<string, unknown>;
  }>;
  meta: EmbeddedAgentRunMeta;
  diagnosticTrace?: DiagnosticTraceContext;
  didSendViaMessagingTool?: boolean;
  didDeliverSourceReplyViaMessageTool?: boolean;
  didSendDeterministicApprovalPrompt?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  messagingToolSourceReplyPayloads?: MessagingToolSourceReplyPayload[];
  acceptedSessionSpawns?: AcceptedSessionSpawn[];
  heartbeatToolResponse?: HeartbeatToolResponse;
  successfulCronAdds?: number;
};
type EmbeddedAgentCompactResult = {
  ok: boolean;
  compacted: boolean;
  reason?: string /** Structured failure metadata used by model fallback classification. */;
  failure?: {
    reason?: string;
    status?: number;
    code?: string;
    rawError?: string;
  };
  result?: {
    summary: string;
    firstKeptEntryId: string;
    tokensBefore: number;
    tokensAfter?: number;
    details?: unknown;
    sessionId?: string;
    sessionFile?: string;
  };
};
type EmbeddedFullAccessBlockedReason = "sandbox" | "host-policy" | "channel" | "runtime";
//#endregion
//#region src/llm/model-registry.d.ts
/** Registry abstraction used by model pickers and provider availability checks. */
type ModelRegistry = {
  getAll(): Model[];
  getAvailable(): Model[];
  find(provider: string, modelId: string): Model | undefined;
  hasConfiguredAuth(model: Model): boolean;
};
//#endregion
//#region src/plugins/provider-external-auth.types.d.ts
type ProviderAuthOptionBag = {
  token?: string;
  tokenProvider?: string;
  secretInputMode?: SecretInputMode;
  [key: string]: unknown;
};
/** Context for resolving synthetic provider credentials from config. */
type ProviderResolveSyntheticAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
/** Synthetic provider credential returned by plugin auth helpers. */
type ProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: Exclude<ModelProviderAuthMode, "aws-sdk">;
  expiresAt?: number;
};
/** Context for resolving external provider auth profiles. */
type ProviderResolveExternalAuthProfilesContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  store: AuthProfileStore;
};
/** OAuth-specific external auth profile resolution context. */
type ProviderResolveExternalOAuthProfilesContext = ProviderResolveExternalAuthProfilesContext;
/** External auth profile credential resolved for a provider. */
type ProviderExternalAuthProfile = {
  profileId: string;
  credential: OAuthCredential;
  persistence?: "runtime-only" | "persisted";
};
/** OAuth-specific provider external auth profile alias. */
type ProviderExternalOAuthProfile = ProviderExternalAuthProfile;
//#endregion
//#region src/agents/system-prompt-contribution.d.ts
/**
 * Provider-owned system prompt contribution types.
 * Separates cache-stable prefixes, dynamic suffixes, and section overrides for
 * runtime prompt assembly.
 */
/** Core system-prompt sections that providers may replace. */
type ProviderSystemPromptSectionId = "interaction_style" | "tool_call_style" | "execution_bias";
/** Provider guidance merged into the assembled agent system prompt. */
type ProviderSystemPromptContribution = {
  /**
   * Cache-stable provider guidance inserted above the system-prompt cache boundary.
   *
   * Use this for static provider/model-family instructions that should preserve
   * KV cache reuse across turns.
   */
  stablePrefix?: string;
  /**
   * Provider guidance inserted below the cache boundary.
   *
   * Use this only for genuinely dynamic text that is expected to vary across
   * runs or sessions.
   */
  dynamicSuffix?: string;
  /**
   * Whole-section replacements for selected core prompt sections.
   *
   * Values should contain the complete rendered section, including any desired
   * heading such as `## Tool Call Style`.
   */
  sectionOverrides?: Partial<Record<ProviderSystemPromptSectionId, string>>;
};
//#endregion
//#region src/plugins/provider-hook-runtime.d.ts
type ProviderRuntimePluginLookupParams = {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  bundledProviderVitestCompat?: boolean;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
};
type ProviderRuntimePluginHandle = ProviderRuntimePluginLookupParams & {
  plugin?: ProviderPlugin;
};
declare function clearProviderRuntimePluginCacheForTest(): void;
declare function resolveProviderRuntimePlugin(
  params: ProviderRuntimePluginLookupParams,
): ProviderPlugin | undefined;
declare function prepareProviderExtraParams(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderPrepareExtraParamsContext;
}): Record<string, unknown> | undefined;
declare function resolveProviderExtraParamsForTransport(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderExtraParamsForTransportContext;
}): ProviderExtraParamsForTransportResult | undefined;
declare function resolveProviderAuthProfileId(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderResolveAuthProfileIdContext;
}): string | undefined;
declare function resolveProviderFollowupFallbackRoute(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderFollowupFallbackRouteContext;
}): ProviderFollowupFallbackRouteResult | undefined;
declare function wrapProviderStreamFn(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderWrapStreamFnContext;
}): StreamFn | undefined;
declare function wrapProviderSimpleCompletionStreamFn(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderWrapStreamFnContext;
}): StreamFn | undefined;
//#endregion
//#region src/plugins/provider-runtime-model.types.d.ts
/**
 * Fully-resolved runtime model shape used after provider/plugin-owned
 * discovery, overrides, and compat normalization.
 */
type ProviderRuntimeModel = Omit<Model, "compat"> & {
  compat?: ModelCompatConfig;
  contextTokens?: number;
  params?: Record<string, unknown>;
  requestTimeoutMs?: number;
  mediaInput?: ModelMediaInputConfig;
};
//#endregion
//#region src/plugins/provider-thinking.types.d.ts
/**
 * Provider-owned thinking policy input.
 *
 * Used by shared `/think`, ACP controls, and directive parsing to ask a
 * provider whether a model supports special reasoning UX such as adaptive,
 * xhigh, max, or a binary on/off toggle.
 */
type ProviderThinkingPolicyContext = {
  provider: string;
  modelId: string;
};
type ProviderThinkingModelCompat = {
  thinkingFormat?: string;
  supportedReasoningEfforts?: readonly string[] | null;
};
/**
 * Provider-owned default thinking policy input.
 *
 * `reasoning` is the merged catalog hint for the selected model when one is
 * available. Providers can use it to keep "reasoning model => low" behavior
 * without re-reading the catalog themselves.
 *
 * `compat` carries model-level request contract facts for the selected model
 * when available. Providers can use it to expose model-specific thinking
 * profiles only when the configured payload style supports them.
 */
type ProviderDefaultThinkingPolicyContext = ProviderThinkingPolicyContext & {
  /** Effective agent runtime selected for this model, when known. */ agentRuntime?: string | null;
  reasoning?: boolean;
  params?: Record<string, unknown>;
  compat?: ProviderThinkingModelCompat | null;
};
type ProviderThinkingLevelId =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max"
  | "ultra";
type ProviderThinkingLevel = {
  id: ProviderThinkingLevelId;
  /**
   * Optional display label. Use this when the stored value differs from the
   * provider-facing UX, for example binary providers storing `low` but showing
   * `on`.
   */
  label?: string;
  /**
   * Relative strength used when downgrading a stored level that the selected
   * model no longer supports.
   */
  rank?: number;
};
type ProviderThinkingProfile = {
  levels: ProviderThinkingLevel[] | ReadonlyArray<ProviderThinkingLevel>;
  defaultLevel?: ProviderThinkingLevelId | null;
  /**
   * Some bundled providers have model-specific thinking contracts that are more
   * current than cached generic catalog metadata. Keep this opt-in so
   * `reasoning: false` remains authoritative for ordinary catalog entries.
   */
  preserveWhenCatalogReasoningFalse?: boolean;
};
declare namespace provider_runtime_d_exports {
  export {
    ProviderUsagePluginDescriptor,
    applyProviderConfigDefaultsWithPlugin,
    applyProviderNativeStreamingUsageCompatWithPlugin,
    applyProviderResolvedTransportWithPlugin,
    augmentModelCatalogWithProviderPlugins,
    buildProviderAuthDoctorHintWithPlugin,
    buildProviderMissingAuthMessageWithPlugin,
    buildProviderUnknownModelHintWithPlugin,
    classifyProviderFailoverReasonWithPlugin,
    createProviderEmbeddingProvider,
    formatProviderAuthProfileApiKeyWithPlugin,
    inspectProviderToolSchemasWithPlugin,
    listProviderUsagePluginDescriptors,
    matchesProviderContextOverflowWithPlugin,
    normalizeProviderConfigWithPlugin,
    normalizeProviderModelIdWithPlugin,
    normalizeProviderResolvedModelWithPlugin,
    normalizeProviderToolSchemasWithPlugin,
    normalizeProviderTransportWithPlugin,
    prepareProviderDynamicModel,
    prepareProviderExtraParams,
    prepareProviderRuntimeAuth,
    refreshProviderOAuthCredentialWithPlugin,
    resolveExternalAuthProfilesWithPlugins,
    resolveProviderAuthProfileId,
    resolveProviderBinaryThinking,
    resolveProviderCacheTtlEligibility,
    resolveProviderConfigApiKeyWithPlugin,
    resolveProviderDefaultThinkingLevel,
    resolveProviderExtraParamsForTransport,
    resolveProviderFollowupFallbackRoute,
    resolveProviderModernModelRef,
    resolveProviderReasoningOutputModeWithPlugin,
    resolveProviderReplayPolicyWithPlugin,
    resolveProviderRuntimePlugin,
    resolveProviderStreamFn,
    resolveProviderSyntheticAuthWithPlugin,
    resolveProviderSystemPromptContribution,
    resolveProviderTextTransforms,
    resolveProviderThinkingProfile,
    resolveProviderTransportTurnStateWithPlugin,
    resolveProviderUsageAuthWithPlugin,
    resolveProviderUsageSnapshotWithPlugin,
    resolveProviderXHighThinking,
    runProviderDynamicModel,
    sanitizeProviderReplayHistoryWithPlugin,
    shouldDeferProviderSyntheticProfileAuthWithPlugin,
    shouldPreferProviderRuntimeResolvedModel,
    testing,
    transformProviderSystemPrompt,
    validateProviderReplayTurnsWithPlugin,
    wrapProviderSimpleCompletionStreamFn,
    wrapProviderStreamFn,
  };
}
declare function resetExternalAuthFallbackWarningCacheForTest(): void;
declare const testing: {
  readonly clearProviderRuntimePluginCacheForTest: typeof clearProviderRuntimePluginCacheForTest;
  readonly resetExternalAuthFallbackWarningCacheForTest: typeof resetExternalAuthFallbackWarningCacheForTest;
};
declare function runProviderDynamicModel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function resolveProviderSystemPromptContribution(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderSystemPromptContributionContext;
}): ProviderSystemPromptContribution | undefined;
declare function transformProviderSystemPrompt(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderTransformSystemPromptContext;
}): string;
declare function resolveProviderTextTransforms(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
}): PluginTextTransforms | undefined;
declare function prepareProviderDynamicModel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderPrepareDynamicModelContext;
}): Promise<void>;
declare function shouldPreferProviderRuntimeResolvedModel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderPreferRuntimeResolvedModelContext;
}): boolean;
declare function normalizeProviderResolvedModelWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
  context: {
    config?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    provider: string;
    modelId: string;
    model: ProviderRuntimeModel;
  };
}): ProviderRuntimeModel | undefined;
declare function applyProviderResolvedTransportWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderNormalizeResolvedModelContext;
}): ProviderRuntimeModel | undefined;
declare function normalizeProviderModelIdWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  plugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
  context: ProviderNormalizeModelIdContext;
}): string | undefined;
declare function normalizeProviderTransportWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderNormalizeTransportContext;
}):
  | {
      api?: string | null;
      baseUrl?: string;
    }
  | undefined;
declare function normalizeProviderConfigWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderNormalizeConfigContext;
  allowRuntimePluginLoad?: boolean;
}): ModelProviderConfig | undefined;
declare function applyProviderNativeStreamingUsageCompatWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderNormalizeConfigContext;
  allowRuntimePluginLoad?: boolean;
}): ModelProviderConfig | undefined;
declare function resolveProviderConfigApiKeyWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveConfigApiKeyContext;
  allowRuntimePluginLoad?: boolean;
}): string | undefined;
declare function resolveProviderReplayPolicyWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderReplayPolicyContext;
}): ProviderReplayPolicy | undefined;
declare function sanitizeProviderReplayHistoryWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderSanitizeReplayHistoryContext;
}): Promise<AgentMessage[] | null | undefined>;
declare function validateProviderReplayTurnsWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderValidateReplayTurnsContext;
}): Promise<AgentMessage[] | null | undefined>;
declare function normalizeProviderToolSchemasWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowRuntimePluginLoad?: boolean;
  context: ProviderNormalizeToolSchemasContext;
}): AnyAgentTool[] | undefined;
declare function inspectProviderToolSchemasWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowRuntimePluginLoad?: boolean;
  context: ProviderNormalizeToolSchemasContext;
}): ProviderToolSchemaDiagnostic[] | undefined;
declare function resolveProviderReasoningOutputModeWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderReasoningOutputModeContext;
}): ProviderReasoningOutputMode | undefined;
declare function resolveProviderStreamFn(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  allowRuntimePluginLoad?: boolean;
  context: ProviderCreateStreamFnContext;
}): StreamFn | undefined;
declare function resolveProviderTransportTurnStateWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  allowRuntimePluginLoad?: boolean;
  context: ProviderResolveTransportTurnStateContext;
}): ProviderTransportTurnState | undefined;
declare function createProviderEmbeddingProvider(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderCreateEmbeddingProviderContext;
}): Promise<PluginEmbeddingProvider | null | undefined>;
declare function prepareProviderRuntimeAuth(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderPrepareRuntimeAuthContext;
}): Promise<ProviderPreparedRuntimeAuth | null | undefined>;
declare function resolveProviderUsageAuthWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveUsageAuthContext;
}): Promise<ProviderResolvedUsageAuth | undefined>;
declare function resolveProviderUsageSnapshotWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderFetchUsageSnapshotContext;
}): Promise<ProviderUsageSnapshot | null | undefined>;
type ProviderUsagePluginDescriptor = {
  provider: UsageProviderId;
  displayName: string;
};
/** Lists provider plugins that own the complete usage auth + fetch lifecycle. */
declare function listProviderUsagePluginDescriptors(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): ProviderUsagePluginDescriptor[];
declare function matchesProviderContextOverflowWithPlugin(params: {
  provider?: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderFailoverErrorContext;
}): boolean;
declare function classifyProviderFailoverReasonWithPlugin(params: {
  provider?: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderFailoverErrorContext;
}): FailoverReason | undefined;
declare function formatProviderAuthProfileApiKeyWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: AuthProfileCredential;
}): string | undefined;
declare function refreshProviderOAuthCredentialWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: OAuthCredential;
}): Promise<OAuthCredential | undefined>;
declare function buildProviderAuthDoctorHintWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderAuthDoctorHintContext;
}): Promise<string | null | undefined>;
declare function resolveProviderCacheTtlEligibility(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderCacheTtlEligibilityContext;
}): boolean | undefined;
declare function resolveProviderBinaryThinking(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderThinkingPolicyContext;
}): boolean | undefined;
declare function resolveProviderXHighThinking(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderThinkingPolicyContext;
}): boolean | undefined;
declare function resolveProviderThinkingProfile(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderDefaultThinkingPolicyContext;
}): ProviderThinkingProfile | null | undefined;
declare function resolveProviderDefaultThinkingLevel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderDefaultThinkingPolicyContext;
}): "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | null | undefined;
declare function applyProviderConfigDefaultsWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderApplyConfigDefaultsContext;
}): OpenClawConfig | undefined;
declare function resolveProviderModernModelRef(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderModernModelPolicyContext;
}): boolean | undefined;
declare function buildProviderMissingAuthMessageWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderBuildMissingAuthMessageContext;
}): string | undefined;
declare function buildProviderUnknownModelHintWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderBuildUnknownModelHintContext;
}): string | undefined;
declare function resolveProviderSyntheticAuthWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveSyntheticAuthContext;
  modelApi?: string;
}): ProviderSyntheticAuthResult | null | undefined;
declare function resolveExternalAuthProfilesWithPlugins(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveExternalAuthProfilesContext;
}): ProviderExternalAuthProfile[];
declare function shouldDeferProviderSyntheticProfileAuthWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderDeferSyntheticProfileAuthContext;
  modelApi?: string;
}): boolean | undefined;
declare function augmentModelCatalogWithProviderPlugins(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderAugmentModelCatalogContext;
}): Promise<ModelCatalogEntry[]>;
//#endregion
//#region src/agents/embedded-agent-runner/model.d.ts
type ProviderRuntimeHooks = {
  applyProviderResolvedTransportWithPlugin?: (
    params: Parameters<typeof applyProviderResolvedTransportWithPlugin>[0],
  ) => unknown;
  buildProviderUnknownModelHintWithPlugin: (
    params: Parameters<typeof buildProviderUnknownModelHintWithPlugin>[0],
  ) => string | undefined;
  prepareProviderDynamicModel: (
    params: Parameters<typeof prepareProviderDynamicModel>[0],
  ) => Promise<void>;
  runProviderDynamicModel: (params: Parameters<typeof runProviderDynamicModel>[0]) => unknown;
  shouldPreferProviderRuntimeResolvedModel?: (
    params: Parameters<typeof shouldPreferProviderRuntimeResolvedModel>[0],
  ) => boolean;
  normalizeProviderResolvedModelWithPlugin: (
    params: Parameters<typeof normalizeProviderResolvedModelWithPlugin>[0],
  ) => unknown;
  normalizeProviderTransportWithPlugin: typeof normalizeProviderTransportWithPlugin;
};
/** Creates isolated model/auth stores for harnesses that own model discovery themselves. */
declare function resolveModelAsync(
  provider: string,
  modelId: string,
  agentDir?: string,
  cfg?: OpenClawConfig,
  options?: {
    authStorage?: AuthStorage;
    modelRegistry?: ModelRegistry$1;
    allowBundledStaticCatalogFallback?: boolean;
    preferBundledStaticCatalogTransport?: boolean;
    retryTransientProviderRuntimeMiss?: boolean;
    agentRuntimeId?: string;
    runtimeHooks?: ProviderRuntimeHooks;
    skipProviderRuntimeHooks?: boolean;
    skipAgentDiscovery?: boolean;
    workspaceDir?: string;
    authProfileId?: string;
    authProfileMode?: AuthProfileCredential["type"] | "aws-sdk";
    preferredProfile?: string;
  },
): Promise<{
  model?: Model;
  error?: string;
  authStorage: AuthStorage;
  modelRegistry: ModelRegistry$1;
}>;
//#endregion
//#region src/agents/simple-completion-runtime.d.ts
type AllowedMissingApiKeyMode = ResolvedProviderAuth["mode"];
type SimpleCompletionModelOptions = {
  maxTokens?: number;
  temperature?: number;
  reasoning?: ThinkLevel | ThinkingLevel;
  signal?: AbortSignal;
};
type PreparedSimpleCompletionModel =
  | {
      model: Model;
      auth: ResolvedProviderAuth /** Non-reversible owner proof captured from the same auth snapshot. */;
      sourceAuthFingerprint?: string;
    }
  | {
      error: string;
      auth?: ResolvedProviderAuth;
    };
type AgentSimpleCompletionSelection = {
  provider: string;
  modelId: string /** Provider used for auth/transport when runtime policy redirects the logical model ref. */;
  runtimeProvider?: string;
  profileId?: string;
  agentDir: string;
};
type PreparedSimpleCompletionModelForAgent =
  | {
      selection: AgentSimpleCompletionSelection;
      model: Model;
      auth: ResolvedProviderAuth;
      sourceAuthFingerprint?: string;
    }
  | {
      error: string;
      selection?: AgentSimpleCompletionSelection;
      auth?: ResolvedProviderAuth;
    };
declare function resolveSimpleCompletionSelectionForAgent(params: {
  cfg: OpenClawConfig;
  agentId: string;
  agentDir?: string;
  modelRef?: string;
  useUtilityModel?: boolean;
}): AgentSimpleCompletionSelection | null;
declare function prepareSimpleCompletionModel(params: {
  cfg: OpenClawConfig | undefined;
  provider: string;
  modelId: string;
  agentDir?: string;
  profileId?: string;
  preferredProfile?: string;
  allowMissingApiKeyModes?: ReadonlyArray<AllowedMissingApiKeyMode>;
  allowBundledStaticCatalogFallback?: boolean;
  useAsyncModelResolution?: boolean;
  skipAgentDiscovery?: boolean;
  bindAuthOwner?: boolean;
  modelResolver?: typeof resolveModelAsync;
}): Promise<PreparedSimpleCompletionModel>;
declare function prepareSimpleCompletionModelForAgent(params: {
  cfg: OpenClawConfig;
  agentId: string;
  agentDir?: string;
  modelRef?: string;
  useUtilityModel?: boolean;
  preferredProfile?: string;
  allowMissingApiKeyModes?: ReadonlyArray<AllowedMissingApiKeyMode>;
  allowBundledStaticCatalogFallback?: boolean;
  useAsyncModelResolution?: boolean;
  skipAgentDiscovery?: boolean;
  bindAuthOwner?: boolean;
  modelResolver?: typeof resolveModelAsync;
}): Promise<PreparedSimpleCompletionModelForAgent>;
declare function completeWithPreparedSimpleCompletionModel(params: {
  model: Model;
  auth: ResolvedProviderAuth;
  context: Parameters<typeof completeSimple>[1];
  cfg?: OpenClawConfig;
  options?: SimpleCompletionModelOptions;
}): Promise<AssistantMessage>;
//#endregion
//#region src/agents/exec-auto-reviewer.d.ts
/** Config for the optional model-backed exec reviewer. */
type ExecReviewerConfig = {
  model?: AgentModelConfig;
  timeoutMs?: number;
};
//#endregion
//#region src/agents/bash-tools.exec-types.d.ts
/** Runtime defaults passed into exec/process tool factories. */
type ExecToolDefaults = {
  hasCronTool?: boolean;
  host?: ExecTarget;
  mode?: ExecMode;
  security?: ExecSecurity;
  ask?: ExecAsk;
  trigger?: string;
  node?: string /** Default working directory for node-host execution only. */;
  nodeCwd?: string;
  pathPrepend?: string[];
  safeBins?: string[];
  strictInlineEval?: boolean;
  commandHighlighting?: boolean;
  safeBinTrustedDirs?: string[];
  safeBinProfiles?: Record<string, SafeBinProfileFixture>;
  reviewer?: ExecReviewerConfig;
  config?: OpenClawConfig;
  autoReviewer?: ExecAutoReviewer;
  agentId?: string;
  backgroundMs?: number;
  timeoutSec?: number;
  approvalWarningText?: string;
  approvalFollowupText?: string;
  approvalFollowup?: ExecApprovalFollowupFactory;
  approvalFollowupMode?: "agent" | "direct";
  approvalRunningNoticeMs?: number;
  sandbox?: BashSandboxConfig;
  elevated?: ExecElevatedDefaults;
  allowBackground?: boolean;
  scopeKey?: string;
  sessionKey?: string;
  /** Ephemeral session UUID active when this exec tool was built. Regenerated
   *  on `/new` and `/reset`, so it pins exec-approval followups to the original
   *  session instance and lets stale followups drop after a session rebind. */
  sessionId?: string;
  /** `session.store` template from the runtime config. Lets the direct/denied
   *  exec approval followup path resolve the session key's current sessionId and
   *  drop the followup when the key was rebound by `/new` or `/reset`. */
  sessionStore?: string;
  /** `session.mainKey` from the runtime config; passed through into
   *  runExecProcess so background-exit notifications can remap cron-run
   *  session keys to the agent's main queue without an ambient config load. */
  mainKey?: string;
  /** `session.scope` from the runtime config; passed alongside `mainKey`
   *  so the cron-run remap can route global-scope agents to the "global"
   *  queue instead of agent-main. */
  sessionScope?:
    | "per-sender"
    | "global" /** Start-time routing policy for detached exec system events. */;
  eventRouting?: EventSessionRoutingPolicy;
  messageProvider?: string;
  currentChannelId?: string;
  currentThreadTs?: string /** Channel-owned sender/chat metadata. Exec subprocesses receive only sender/chat IDs. */;
  channelContext?: PluginHookChannelContext;
  accountId?: string;
  approvalReviewerDeviceId?: string;
  notifyOnExit?: boolean;
  notifyOnExitEmptySuccess?: boolean;
  cwd?: string;
};
/** Outcome passed to approval follow-up factories after approved async exec. */
type ExecApprovalFollowupOutcome = {
  status: "completed" | "failed";
  exitCode: number | null;
  timedOut: boolean;
  aggregated: string;
  reason?: string;
};
type ExecApprovalFollowupContext = {
  approvalId: string;
  sessionId: string;
  trigger?: string;
  outcome: ExecApprovalFollowupOutcome;
};
/** Hook that can append domain-specific text to approval follow-up messages. */
type ExecApprovalFollowupFactory = (
  context: ExecApprovalFollowupContext,
) => string | undefined | Promise<string | undefined>;
/** Effective elevated-exec defaults derived from config/runtime policy. */
type ExecElevatedDefaults = {
  enabled: boolean;
  allowed: boolean;
  defaultLevel: "on" | "off" | "ask" | "full";
  fullAccessAvailable?: boolean;
  fullAccessBlockedReason?: EmbeddedFullAccessBlockedReason;
};
//#endregion
//#region src/agents/bootstrap-mode.d.ts
type BootstrapContextRunKind = "default" | "heartbeat" | "cron" | "commitment-only";
//#endregion
//#region src/agents/command/shared-types.d.ts
/**
 * Shared command types that are imported by both public and runtime modules.
 */
/** Best-effort provider stream parameter overrides for an agent command. */
type AgentStreamParams = {
  /** Provider stream params override (best-effort). */ temperature?: number;
  topP?: number;
  maxTokens?: number /** Stop sequences forwarded to the provider (best-effort). */;
  stop?: string[] /** Provider fast-mode override (best-effort). */;
  fastMode?: boolean;
  responseFormat?: Record<string, unknown>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};
/** Simplified tool definition for client-provided OpenResponses hosted tools. */
type ClientToolDefinition = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<
      string,
      unknown
    > /** Strict argument enforcement (Responses API). Propagated from the request. */;
    strict?: boolean;
  };
};
//#endregion
//#region src/agents/embedded-agent-payloads.d.ts
/**
 * Channel-facing reply payload emitted by embedded agents. Keep this type
 * small: channel adapters decide how to render text, media, and reply targets.
 */
type BlockReplyPayload = {
  text?: string;
  mediaUrls?: string[];
  audioAsVoice?: boolean;
  trustedLocalMedia?: boolean;
  sensitiveMedia?: boolean;
  isReasoning?: boolean /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */;
  isCommentary?: boolean;
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean;
};
//#endregion
//#region src/agents/embedded-agent-block-chunker.d.ts
/**
 * Splits streamed embedded-agent replies into Markdown-safe message chunks.
 */
type BlockReplyChunking = {
  minChars: number;
  maxChars: number;
  breakPreference?:
    | "paragraph"
    | "newline"
    | "sentence" /** When true, prefer \n\n paragraph boundaries once minChars has been satisfied. */;
  flushOnParagraph?: boolean;
};
declare class EmbeddedBlockChunker {
  #private;
  constructor(chunking: BlockReplyChunking);
  /** Add streamed text to the pending chunk buffer. */
  append(text: string): void;
  /** Clear any buffered reply text without emitting it. */
  reset(): void;
  /** Return the currently buffered text for tests and flush logic. */
  get bufferedText(): string;
  /** Return true when there is pending text to drain. */
  hasBuffered(): boolean;
  /** Emit safe chunks according to size and Markdown fence constraints. */
  drain(params: { force: boolean; emit: (chunk: string) => void }): void;
}
//#endregion
//#region src/agents/embedded-agent-subscribe.shared-types.d.ts
/** Rendering mode for completed tool results in subscribed replies. */
type ToolResultFormat = "markdown" | "plain";
/** Detail level for in-flight tool progress messages. */
type ToolProgressDetailMode = "explain" | "raw";
//#endregion
//#region src/shared/fast-mode.d.ts
type FastModeSource = "session" | "agent" | "config" | "default";
type FastModeAutoProgressState = {
  offAnnounced: boolean;
  resetAnnounced: boolean;
};
declare function resolveFastModeForElapsed(params: {
  mode?: FastMode;
  startedAtMs: number;
  fastAutoOnSeconds?: number;
  nowMs?: number;
}): {
  mode: FastMode | undefined;
  enabled: boolean;
  elapsedSeconds: number;
  fastAutoOnSeconds: number;
};
declare function formatFastModeAutoProgressText(params: {
  enabled: boolean;
  elapsedSeconds: number;
  fastAutoOnSeconds?: number;
}): string;
declare function formatFastModeStatusValue(params: {
  mode: FastMode | undefined;
  fastAutoOnSeconds?: number;
}): string;
declare function formatFastModeCommandOptions(params?: { fastAutoOnSeconds?: number }): string;
declare function formatFastModeSourceSuffix(source: FastModeSource | undefined): string;
declare function formatFastModeCurrentStatus(params: {
  mode: FastMode | undefined;
  source?: FastModeSource;
  fastAutoOnSeconds?: number;
  label?: string;
}): string;
//#endregion
//#region src/agents/fast-mode.d.ts
type FastModeState = {
  mode: FastMode;
  enabled: boolean;
  source: FastModeSource;
  fastAutoOnSeconds: number;
};
/** Resolve the effective fast-mode setting and its source. */
declare function resolveFastModeState(params: {
  cfg: OpenClawConfig | undefined;
  provider: string;
  model: string;
  agentId?: string;
  sessionEntry?: Pick<SessionEntry, "fastMode"> | undefined;
}): FastModeState;
//#endregion
//#region src/agents/harness/runtime-artifact.types.d.ts
/** Exact local implementation owned by one plugin agent harness process. */
type AgentHarnessRuntimeArtifactBinding = Readonly<{
  id: string;
  fingerprint: string;
}>;
/** Runtime artifact a verified continuation must keep using. */
type ExpectedAgentHarnessRuntimeArtifact = Readonly<{
  harnessId: string;
  artifact: AgentHarnessRuntimeArtifactBinding;
}>;
//#endregion
//#region src/agents/generated-attachments.d.ts
type AgentGeneratedAttachment = {
  type?: "image" | "audio" | "video" | "file";
  path?: string;
  url?: string;
  mediaUrl?: string;
  filePath?: string;
  mimeType?: string;
  name?: string;
};
//#endregion
//#region src/agents/internal-event-contract.d.ts
declare const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION: "task_completion";
declare const AGENT_INTERNAL_EVENT_SOURCES: readonly [
  "subagent",
  "cron",
  "image_generation",
  "video_generation",
  "music_generation",
];
declare const AGENT_INTERNAL_EVENT_STATUSES: readonly ["ok", "timeout", "error", "unknown"];
type AgentInternalEventSource = (typeof AGENT_INTERNAL_EVENT_SOURCES)[number];
type AgentInternalEventStatus = (typeof AGENT_INTERNAL_EVENT_STATUSES)[number];
//#endregion
//#region src/agents/internal-events.d.ts
type AgentTaskCompletionInternalEvent = {
  type: typeof AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION;
  source: AgentInternalEventSource;
  childSessionKey: string;
  childSessionId?: string;
  announceType: string;
  taskLabel: string;
  status: AgentInternalEventStatus;
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
  replyInstruction: string;
};
/** Internal event variants that can be rendered into agent prompt context. */
type AgentInternalEvent = AgentTaskCompletionInternalEvent;
//#endregion
//#region src/agents/run-session-target.d.ts
/** Identifies a run transcript target without naming the current storage artifact. */
type AgentRunSessionTarget = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  storePath?: string;
  threadId?: string | number;
};
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.types.d.ts
/**
 * Scope used when classifying auth-profile failures for retry/fallback decisions.
 */
type AuthProfileFailurePolicy = "shared" | "local" | "local_transient";
//#endregion
//#region src/agents/embedded-agent-runner/run/params.d.ts
type EmbeddedRunTrigger = "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
type ReasoningStreamPayload = Pick<
  ReplyPayload,
  "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"
> & {
  requiresReasoningProgressOptIn?: boolean;
};
type CurrentInboundPromptContext = {
  text: string;
  resumableText?: string;
  promptJoiner?:
    | "\n\n"
    | "\n"
    | " " /** Generated goal blocks owned by inbound-context assembly, never user text. */;
  injectedGoalContexts?: string[];
};
type RunEmbeddedAgentParams = {
  sessionId: string;
  sessionKey?: string /** Storage-neutral transcript/session target. Defaults to sessionId/sessionKey/agentId. */;
  sessionTarget?: AgentRunSessionTarget /** Immutable gateway lifecycle ownership captured when this execution was admitted. */;
  lifecycleGeneration?: string /** Provider prompt-cache affinity key; distinct from transcript/session identity. */;
  promptCacheKey?: string /** Session-like key for sandbox and tool-policy resolution. Defaults to sessionKey. */;
  sandboxSessionKey?: string;
  agentId?: string;
  messageChannel?: string;
  messageProvider?: string /** Capabilities declared by the gateway client that originated this run. */;
  clientCaps?: string[];
  chatType?: ChatType;
  agentAccountId?: string /** What initiated this agent run: "user", "heartbeat", "cron", "memory", "overflow", or "manual". */;
  trigger?: EmbeddedRunTrigger /** Stable cron job identifier populated for cron-triggered runs. */;
  jobId?: string /** Relative workspace path that memory-triggered writes are allowed to append to. */;
  memoryFlushWritePath?: string /** Delivery target for topic/thread routing. */;
  messageTo?: string /** Thread/topic identifier for routing replies to the originating thread. */;
  messageThreadId?: string | number /** Group id for channel-level tool policy resolution. */;
  groupId?:
    | string
    | null /** Group channel label (e.g. #general) for channel-level tool policy resolution. */;
  groupChannel?:
    | string
    | null /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */;
  groupSpace?: string | null /** Trusted provider role ids for the requester in this group turn. */;
  memberRoleIds?: string[] /** Opaque host-issued capability for current-turn channel message actions. */;
  messageActionTurnCapability?: string /** Parent session key for subagent policy inheritance. */;
  spawnedBy?:
    | string
    | null /** Whether workspaceDir points at the canonical agent workspace for bootstrap purposes. */;
  isCanonicalWorkspace?: boolean;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null /** Trusted sender identity bit for command/channel-action auth. */;
  senderIsOwner?: boolean /** Device-scoped operator session allowed to review approvals initiated by this run. */;
  approvalReviewerDeviceId?: string /** Current channel ID for auto-threading (Slack). */;
  currentChannelId?: string /** Transport-native chat/conversation ID for hook identity context. */;
  chatId?: string /** Channel-specific identity metadata surfaced to plugin hooks. */;
  channelContext?: PluginHookChannelContext /** Routable target for the current conversation when it differs from the native channel ID. */;
  currentMessagingTarget?: string /** Current thread timestamp for auto-threading (Slack). */;
  currentThreadTs?: string /** Current inbound message id for action fallbacks (e.g. Telegram react). */;
  currentMessageId?: string | number /** True when the current inbound turn carried audio media. */;
  currentInboundAudio?: boolean /** Reply-to mode for Slack auto-threading. */;
  replyToMode?:
    | "off"
    | "first"
    | "all"
    | "batched" /** Mutable ref to track if a reply was sent (for "first" mode). */;
  hasRepliedRef?: {
    value: boolean;
  } /** Require explicit message tool targets (no implicit last-route sends). */;
  requireExplicitMessageTarget?: boolean /** If true, omit the message tool from the tool list. */;
  disableMessageTool?: boolean /** Restrict this reconstructed run to restart-safe tools. */;
  forceRestartSafeTools?: boolean /** Internal one-shot model probe mode: no tools, no workspace/chat prompt policy. */;
  modelRun?: boolean /** Disable trajectory persistence for auxiliary runs with no durable session owner. */;
  disableTrajectory?: boolean /** Restrict Skill Workshop to a bounded pending-proposal budget for an internal review run. */;
  skillWorkshopProposalOnly?: boolean /** Preserve the foreground run as proposal provenance for an internal review run. */;
  skillWorkshopOrigin?: SkillProposalOrigin /** Run-scoped mutation budget shared across internal runner attempts. */;
  skillWorkshopProposalMutationBudget?: SkillWorkshopProposalMutationBudget /** Optional state environment for isolated Skill Workshop proposal persistence. */;
  skillWorkshopProposalEnv?: NodeJS.ProcessEnv /** Shared completion latch for proposal-only review runs that checkpoint their batch. */;
  skillWorkshopProposalReviewCompletion?: SkillWorkshopRunOptions["proposalReviewCompletion"] /** Explicit system prompt mode override for trusted callers. */;
  promptMode?: PromptMode /** Keep the message tool available even when a narrow profile would omit it. */;
  forceMessageTool?: boolean /** Include the heartbeat response tool for structured heartbeat outcomes. */;
  enableHeartbeatTool?: boolean /** Keep the heartbeat response tool available even when a narrow profile would omit it. */;
  forceHeartbeatTool?: boolean /** Allow runtime plugins for this run to late-bind the gateway subagent. */;
  allowGatewaySubagentBinding?: boolean /** @deprecated Use sessionTarget plus sessionId/sessionKey/agentId for runtime identity. */;
  sessionFile?: string;
  workspaceDir: string /** Task working directory for tool/runtime execution. Defaults to workspaceDir. */;
  cwd?: string;
  agentDir?: string;
  /**
   * Run config consumed by core paths (model selection, tools, plugin
   * activation). Plugin harnesses resolve `plugins.entries.<id>.config` from
   * the live global config, NOT from this object — per-run plugin-config
   * overrides are unsupported; use an explicit run param instead.
   */
  config?: OpenClawConfig;
  skillsSnapshot?: SkillSnapshot;
  prompt: string /** User-visible prompt body to submit and persist; runtime context travels separately. */;
  transcriptPrompt?: string;
  currentInboundEventKind?: InboundEventKind;
  currentInboundContext?: CurrentInboundPromptContext;
  images?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[] /** Optional client-provided tools (OpenResponses hosted tools). */;
  clientTools?: ClientToolDefinition[] /** Disable built-in tools for this run (LLM-only mode). */;
  disableTools?: boolean;
  provider?: string;
  model?: string /** Effective model fallback chain for this session attempt. Undefined uses config defaults. */;
  modelFallbacksOverride?: string[] /** Session-pinned embedded harness id. Prevents runtime hot-switching. */;
  agentHarnessId?: string /** True when the pinned non-default harness owns model selection for this session. */;
  modelSelectionLocked?: boolean /** Explicit runtime override selected for this turn. Unlike agentHarnessId, this may force OpenClaw. */;
  agentHarnessRuntimeOverride?: string /** Verified setup continuation: pin both the harness and its local implementation. */;
  expectedAgentHarnessRuntimeArtifact?: ExpectedAgentHarnessRuntimeArtifact;
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
  thinkLevel?: ThinkLevel;
  fastMode?: FastMode /** Stable outer-run start time for auto fast-mode cutoff across retries/fallbacks. */;
  fastModeStartedAtMs?: number /** Effective auto fast-mode cutoff for this run, in seconds. */;
  fastModeAutoOnSeconds?: number /** Shared notification state for nested harnesses that can observe the same tool boundary. */;
  fastModeAutoProgressState?: FastModeAutoProgressState /** True when the outer model fallback loop has reached its final candidate. */;
  isFinalFallbackAttempt?: boolean;
  verboseLevel?: VerboseLevel;
  reasoningLevel?: ReasoningLevel;
  toolResultFormat?: ToolResultFormat;
  toolProgressDetail?: ToolProgressDetailMode /** If true, suppress tool error warning payloads for this run (including mutating tools). */;
  suppressToolErrorWarnings?:
    | boolean
    | (() => boolean | undefined) /** Bootstrap context mode for workspace file injection. */;
  bootstrapContextMode?: "full" | "lightweight" /** Run kind hint for context mode behavior. */;
  bootstrapContextRunKind?: BootstrapContextRunKind /** Optional tool allow-list; when set, only these tools are sent to the model. */;
  toolsAllow?: string[] /** Owner-scoped plugin tool grant; normal policy and deny rules still apply. */;
  runtimePluginToolGrant?: RuntimePluginToolGrant /** Seen bootstrap truncation warning signatures for this session (once mode dedupe). */;
  bootstrapPromptWarningSignaturesSeen?: string[] /** Last shown bootstrap truncation warning signature for this session. */;
  bootstrapPromptWarningSignature?: string;
  execOverrides?: Pick<
    ExecToolDefaults,
    "host" | "security" | "ask" | "node" | "nodeCwd" | "notifyOnExit" | "notifyOnExitEmptySuccess"
  >;
  bashElevated?: ExecElevatedDefaults;
  timeoutMs: number;
  /**
   * Explicit per-run timeout override, in milliseconds, when the caller knows
   * the run was launched with a deliberate per-run value (e.g. a cron payload's
   * `timeoutSeconds`) rather than inheriting `agents.defaults.timeoutSeconds`.
   * When set, the LLM idle watchdog honors this value directly instead of
   * inferring "explicitness" from `timeoutMs !== agents.defaults.timeoutSeconds`,
   * which fails when the explicit value happens to numerically equal the agent
   * default.
   */
  runTimeoutOverrideMs?: number;
  runId: string;
  abortSignal?: AbortSignal;
  onExecutionStarted?: (info?: { lifecycleGeneration?: string }) => void;
  onExecutionPhase?: (info: {
    phase: EmbeddedAgentExecutionPhase;
    provider?: string;
    model?: string;
    backend?: string;
    source?: string;
    tool?: string;
    toolCallId?: string;
    itemId?: string;
    firstModelCallStarted?: boolean;
  }) => void;
  onLaneWait?: (info: { waitMs: number; queuedAhead: number; waiting?: boolean }) => void;
  onRunProgress?: (info: {
    reason: string;
    provider?: string;
    model?: string;
    backend?: string;
  }) => void;
  onSessionIdChanged?: (sessionId: string) => void;
  replyOperation?: ReplyOperation;
  shouldEmitToolResult?: () => boolean;
  shouldEmitToolOutput?: () => boolean;
  onPartialReply?: (payload: PartialReplyPayload) => void | Promise<void>;
  onAssistantMessageStart?: () => void | Promise<void>;
  onBlockReply?: (payload: BlockReplyPayload, context?: BlockReplyContext) => void | Promise<void>;
  onBlockReplyFlush?: (context: BlockReplyFlushContext) => void | Promise<void>;
  blockReplyBreak?: "text_end" | "message_end";
  blockReplyChunking?: BlockReplyChunking;
  onReasoningStream?: (payload: ReasoningStreamPayload) => void | Promise<void>;
  streamReasoningInNonStreamModes?: boolean;
  onReasoningEnd?: () => void | Promise<void>;
  onToolResult?: (
    payload: ReplyPayload,
  ) => void | Promise<void> /** Synchronous private observer for the sanitized per-tool result. */;
  onAgentToolResult?: (event: { toolName: string; result: unknown; isError: boolean }) => void;
  onAgentEvent?: (evt: {
    stream: string;
    data: Record<string, unknown>;
    sessionKey?: string;
  }) => void | Promise<void>;
  onToolStreamBoundary?: () => void | Promise<void>;
  /**
   * Emit lifecycle "finishing" when the attempt ends; the caller owns the
   * final lifecycle "end" or "error" after fallback and post-turn work settle.
   */
  deferTerminalLifecycle?: boolean /** @deprecated Use deferTerminalLifecycle. */;
  deferTerminalLifecycleEnd?: boolean;
  lane?: string;
  enqueue?: CommandQueueEnqueueFn;
  extraSystemPrompt?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  silentReplyPromptMode?: SilentReplyPromptMode;
  internalEvents?: AgentInternalEvent[];
  inputProvenance?: InputProvenance;
  streamParams?: AgentStreamParams;
  ownerNumbers?: string[];
  enforceFinalTag?: boolean;
  silentExpected?: boolean /** Skip per-chunk live visible-text parsing when no live stream consumer exists (e.g. subagents). */;
  suppressLiveStreamOutput?: boolean;
  /**
   * Treat a clean empty assistant stop as an intentional silent reply.
   * Only set when the caller's prompt policy already allows an exact NO_REPLY
   * final answer for silence.
   */
  allowEmptyAssistantReplyAsSilent?: boolean;
  authProfileFailurePolicy?: AuthProfileFailurePolicy;
  /**
   * Allow a single run attempt even when all auth profiles are in cooldown,
   * but only for inferred transient cooldowns like `rate_limit` or `overloaded`.
   *
   * This is used by model fallback when trying sibling models on providers
   * where transient service pressure is often model-scoped.
   */
  allowTransientCooldownProbe?: boolean;
  suppressNextUserMessagePersistence?: boolean;
  suppressTranscriptOnlyAssistantPersistence?: boolean;
  suppressAssistantErrorPersistence?: boolean;
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder /** Keep an internal continuation prompt from being replaced by the original prepared turn. */;
  skipPreparedUserTurnMessage?: boolean;
  onUserMessagePersisted?: (
    message: Extract<
      AgentMessage,
      {
        role: "user";
      }
    >,
  ) => void;
  onUserMessagePersistenceInvalidated?: () => void;
  onAssistantErrorMessagePersisted?: (
    message: Extract<
      AgentMessage,
      {
        role: "assistant";
      }
    >,
  ) => void;
  /**
   * Dispose bundled MCP runtimes when the overall run ends instead of preserving
   * the session-scoped cache. Intended for one-shot local CLI runs that must
   * exit promptly after emitting the final JSON result.
   */
  cleanupBundleMcpOnRunEnd?: boolean /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */;
  oneShotCliRun?: boolean;
};
//#endregion
//#region src/agents/timeout.d.ts
declare function resolveAgentTimeoutMs(opts: {
  cfg?: OpenClawConfig;
  overrideMs?: number | null;
  overrideSeconds?: number | null;
  minMs?: number;
}): number;
//#endregion
//#region src/plugins/runtime/native-deps.d.ts
/** Inputs used to format native dependency install/rebuild guidance. */
type NativeDependencyHintParams = {
  packageName: string;
  manager?: "pnpm" | "npm" | "yarn";
  rebuildCommand?: string;
  approveBuildsCommand?: string;
  downloadCommand?: string;
};
/** Formats concise guidance for installing and rebuilding a native dependency. */
declare function formatNativeDependencyHint(params: NativeDependencyHintParams): string;
//#endregion
//#region src/image-generation/runtime-types.d.ts
type GenerateImageParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution /** Resolution inferred from reference images; omitted for incompatible fallback models. */;
  inferredResolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  autoProviderFallback?: boolean /** Optional per-request provider timeout in milliseconds. */;
  timeoutMs?: number;
  providerOptions?: ImageGenerationProviderOptions /** SSRF policy to propagate into image-generation provider HTTP calls. */;
  ssrfPolicy?: SsrFPolicy$1;
};
type GenerateImageRuntimeResult = {
  images: GeneratedImageAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  appliedResolution?: ImageGenerationResolution;
  normalization?: ImageGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: ImageGenerationIgnoredOverride[];
};
//#endregion
//#region src/video-generation/runtime-types.d.ts
type GenerateVideoParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number;
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[];
  inputAudios?: VideoGenerationSourceAsset[];
  autoProviderFallback?: boolean /** Arbitrary provider-specific options forwarded as-is to provider.generateVideo. */;
  providerOptions?: Record<
    string,
    unknown
  > /** Optional per-request provider timeout in milliseconds. */;
  timeoutMs?: number;
};
type GenerateVideoRuntimeResult = {
  videos: GeneratedVideoAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  normalization?: VideoGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: VideoGenerationIgnoredOverride[];
};
//#endregion
//#region src/music-generation/runtime-types.d.ts
/**
 * Runtime input/output contracts for music generation.
 *
 * These are separate from provider contracts because runtime results include
 * fallback attempts, normalized metadata, and selected provider/model identity.
 */
/** Parameters accepted by the core music generation runtime. */
type GenerateMusicParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
  autoProviderFallback?: boolean /** Optional per-request provider timeout in milliseconds. */;
  timeoutMs?: number;
};
/** Result returned after a successful runtime provider attempt. */
type GenerateMusicRuntimeResult = {
  tracks: GeneratedMusicAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  lyrics?: string[];
  normalization?: MusicGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: MusicGenerationIgnoredOverride[];
};
//#endregion
//#region src/plugins/web-provider-types.d.ts
type WebSearchProviderId = string;
type WebFetchProviderId = string;
type WebSearchProviderToolDefinition = {
  description: string;
  parameters: TSchema;
  execute: (
    args: Record<string, unknown>,
    context?: WebSearchProviderToolExecutionContext,
  ) => Promise<Record<string, unknown>>;
};
type WebFetchProviderToolDefinition = {
  description: string;
  parameters: TSchema;
  execute: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};
type WebSearchProviderContext = {
  config?: OpenClawConfig;
  searchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebSearchMetadata;
  agentDir?: string;
};
type WebSearchProviderToolExecutionContext = {
  signal?: AbortSignal;
};
type WebFetchProviderContext = {
  config?: OpenClawConfig;
  fetchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebFetchMetadata;
};
type WebSearchCredentialResolutionSource = "config" | "secretRef" | "env" | "missing";
type WebSearchProviderConfiguredCredentialFallback = {
  path: string;
  value: unknown;
};
type WebFetchProviderConfiguredCredentialFallback = {
  path: string;
  value: unknown;
};
type WebSearchRuntimeMetadataContext = {
  config?: OpenClawConfig;
  searchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebSearchMetadata;
  resolvedCredential?: {
    value?: string;
    source: WebSearchCredentialResolutionSource;
    fallbackEnvVar?: string;
  };
};
type WebSearchProviderSetupContext = {
  config: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  quickstartDefaults?: boolean;
  secretInputMode?: SecretInputMode;
};
type WebFetchCredentialResolutionSource = "config" | "secretRef" | "env" | "missing";
type WebFetchRuntimeMetadataContext = {
  config?: OpenClawConfig;
  fetchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebFetchMetadata;
  resolvedCredential?: {
    value?: string;
    source: WebFetchCredentialResolutionSource;
    fallbackEnvVar?: string;
  };
};
type WebSearchProviderPlugin = {
  id: WebSearchProviderId;
  label: string;
  hint: string;
  onboardingScopes?: readonly "text-inference"[];
  requiresCredential?: boolean;
  credentialLabel?: string;
  envVars: string[] /** Optional model-provider auth profile id that can satisfy this web provider without a tool-specific API key. */;
  authProviderId?: string;
  placeholder: string;
  signupUrl: string;
  docsUrl?: string /** Optional note shown before credential collection for provider-specific prerequisites. */;
  credentialNote?: string;
  autoDetectOrder?: number;
  credentialPath: string;
  inactiveSecretPaths?: string[];
  getCredentialValue: (searchConfig?: Record<string, unknown>) => unknown;
  setCredentialValue: (searchConfigTarget: Record<string, unknown>, value: unknown) => void;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  setConfiguredCredentialValue?: (configTarget: OpenClawConfig, value: unknown) => void;
  getConfiguredCredentialFallback?: (
    config?: OpenClawConfig,
  ) => WebSearchProviderConfiguredCredentialFallback | undefined;
  applySelectionConfig?: (config: OpenClawConfig) => OpenClawConfig;
  runSetup?: (ctx: WebSearchProviderSetupContext) => OpenClawConfig | Promise<OpenClawConfig>;
  resolveRuntimeMetadata?: (
    ctx: WebSearchRuntimeMetadataContext,
  ) => Partial<RuntimeWebSearchMetadata> | Promise<Partial<RuntimeWebSearchMetadata>>;
  createTool: (ctx: WebSearchProviderContext) => WebSearchProviderToolDefinition | null;
};
type PluginWebSearchProviderEntry = WebSearchProviderPlugin & {
  pluginId: string;
};
type WebFetchProviderPlugin = {
  id: WebFetchProviderId;
  label: string;
  hint: string;
  requiresCredential?: boolean;
  credentialLabel?: string;
  envVars: string[];
  placeholder: string;
  signupUrl: string;
  docsUrl?: string;
  autoDetectOrder?: number;
  credentialPath: string;
  inactiveSecretPaths?: string[];
  getCredentialValue: (fetchConfig?: Record<string, unknown>) => unknown;
  setCredentialValue: (fetchConfigTarget: Record<string, unknown>, value: unknown) => void;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  setConfiguredCredentialValue?: (configTarget: OpenClawConfig, value: unknown) => void;
  getConfiguredCredentialFallback?: (
    config?: OpenClawConfig,
  ) => WebFetchProviderConfiguredCredentialFallback | undefined;
  applySelectionConfig?: (config: OpenClawConfig) => OpenClawConfig;
  resolveRuntimeMetadata?: (
    ctx: WebFetchRuntimeMetadataContext,
  ) => Partial<RuntimeWebFetchMetadata> | Promise<Partial<RuntimeWebFetchMetadata>>;
  createTool: (ctx: WebFetchProviderContext) => WebFetchProviderToolDefinition | null;
};
type PluginWebFetchProviderEntry = WebFetchProviderPlugin & {
  pluginId: string;
};
//#endregion
//#region src/web-search/runtime-types.d.ts
/** Provider/tool resolution inputs for web_search. */
type ResolveWebSearchDefinitionParams = {
  config?: OpenClawConfig;
  agentDir?: string;
  sandboxed?: boolean;
  runtimeWebSearch?: RuntimeWebSearchMetadata;
  providerId?: string;
  preferRuntimeProviders?: boolean;
  preferInputConfig?: boolean;
};
/** Inputs for executing a web_search request through the selected provider. */
type RunWebSearchParams = ResolveWebSearchDefinitionParams & {
  args: Record<string, unknown>;
  signal?: AbortSignal;
};
/** Normalized execution result that records which provider answered. */
type RunWebSearchResult = {
  provider: string;
  result: Record<string, unknown>;
};
//#endregion
//#region src/channels/message/ingress-queue.d.ts
/** Pending or retryable inbound channel event stored in the durable ingress queue. */
type ChannelIngressQueueRecord<TPayload, TMetadata = unknown> = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  payload: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  laneKey?: string;
  attempts: number;
  lastAttemptAt?: number;
  lastError?: string;
};
/** Pending ingress event currently claimed by a worker. */
type ChannelIngressQueueClaim<TPayload, TMetadata = unknown> = ChannelIngressQueueRecord<
  TPayload,
  TMetadata
> & {
  claim: {
    token: string;
    ownerId: string;
    claimedAt: number;
  };
};
/** Minimal claim reference used to guard completion/release/failure with a claim token. */
type ChannelIngressQueueClaimRef = {
  id: string;
  claim: {
    token: string;
  };
};
/** Claim identity available when a stale row's payload cannot be decoded. */
type ChannelIngressQueueCorruptClaim = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  laneKey?: string;
  reason: "corrupt_payload";
  claim: {
    token: string;
    ownerId: string;
    claimedAt: number;
  };
};
/** Completed ingress event tombstone retained for duplicate detection. */
type ChannelIngressQueueCompletedRecord<TCompletedMetadata = unknown> = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  completedAt: number;
  metadata?: TCompletedMetadata;
};
/** Failed ingress event tombstone retained for duplicate detection and diagnostics. */
type ChannelIngressQueueFailedRecord = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  failedAt: number;
  reason: string;
  message?: string;
};
/** Retention options for pending, completed, and failed ingress queue rows. */
type ChannelIngressQueuePruneOptions = {
  pendingTtlMs?: number;
  completedTtlMs?: number;
  failedTtlMs?: number;
  pendingMaxEntries?: number;
  completedMaxEntries?: number;
  failedMaxEntries?: number;
  protectIds?: Iterable<string>;
  now?: number;
};
/** Result of enqueueing a possibly duplicate ingress event id. */
type ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata> =
  | {
      kind: "accepted";
      duplicate: false;
      record: ChannelIngressQueueRecord<TPayload, TMetadata>;
    }
  | {
      kind: "pending";
      duplicate: true;
      record: ChannelIngressQueueRecord<TPayload, TMetadata>;
    }
  | {
      kind: "claimed";
      duplicate: true;
      record: ChannelIngressQueueClaim<TPayload, TMetadata>;
    }
  | {
      kind: "completed";
      duplicate: true;
      record: ChannelIngressQueueCompletedRecord<TCompletedMetadata>;
    }
  | {
      kind: "failed";
      duplicate: true;
      record: ChannelIngressQueueFailedRecord;
    };
/** Durable FIFO-ish ingress queue with claims, duplicate detection, and retention pruning. */
type ChannelIngressQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  enqueue(
    id: string,
    payload: TPayload,
    options?: {
      metadata?: TMetadata;
      receivedAt?: number;
      laneKey?: string;
    },
  ): Promise<ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata>>;
  listPending(options?: {
    limit?: number | "all";
    orderBy?: "received" | "id";
  }): Promise<Array<ChannelIngressQueueRecord<TPayload, TMetadata>>>;
  listClaims(): Promise<Array<ChannelIngressQueueClaim<TPayload, TMetadata>>>;
  claimNext(options?: {
    ownerId?: string;
    blockedLaneKeys?: Iterable<string>;
    staleMs?: number;
    orderBy?: "received" | "id";
    scanLimit?: number;
    candidateIds?: Iterable<string>;
    deriveLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>) => string | undefined;
  }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
  claim(
    id: string,
    options?: {
      ownerId?: string;
    },
  ): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
  refreshClaim?(
    claim: ChannelIngressQueueClaimRef,
    options?: {
      refreshedAt?: number;
    },
  ): Promise<boolean>;
  complete(
    idOrClaim: string | ChannelIngressQueueClaimRef,
    options?: {
      metadata?: TCompletedMetadata;
      completedAt?: number;
    },
  ): Promise<boolean>;
  release(
    idOrClaim: string | ChannelIngressQueueClaimRef,
    options?: {
      lastError?: string;
      releasedAt?: number;
      recordAttempt?: boolean;
    },
  ): Promise<boolean>;
  fail(
    idOrClaim: string | ChannelIngressQueueClaimRef,
    options: {
      reason: string;
      message?: string;
      failedAt?: number;
    },
  ): Promise<boolean>;
  delete(
    idOrClaim:
      | string
      | ChannelIngressQueueRecord<TPayload, TMetadata>
      | ChannelIngressQueueClaimRef,
  ): Promise<boolean>;
  recoverStaleClaims(options?: {
    staleMs?: number;
    now?: number;
    shouldRecover?: (
      claim: ChannelIngressQueueClaim<TPayload, TMetadata>,
    ) => boolean | Promise<boolean>;
    shouldRecoverCorrupt?: (claim: ChannelIngressQueueCorruptClaim) => boolean | Promise<boolean>;
  }): Promise<number>;
  prune(options?: ChannelIngressQueuePruneOptions): Promise<number>;
};
/** Construction options for a channel/account-scoped ingress queue. */
type CreateChannelIngressQueueOptions = {
  channelId: string;
  accountId?: string;
  stateDir?: string;
  now?: () => number;
};
//#endregion
//#region src/tasks/task-registry.types.d.ts
/** JSON value shape persisted with runtime-owned task detail. */
type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };
/** Runtime family that owns a task run lifecycle. */
type TaskRuntime = "subagent" | "acp" | "cli" | "cron";
type TaskStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "timed_out"
  | "cancelled"
  | "lost";
type TaskDeliveryStatus =
  | "pending"
  | "delivered"
  | "session_queued"
  | "failed"
  | "parent_missing"
  | "not_applicable";
type TaskNotifyPolicy = "done_only" | "state_changes" | "silent";
/** Semantic success detail for required-completion task outcomes. */
type TaskTerminalOutcome = "succeeded" | "blocked";
type TaskScopeKind = "session" | "system";
type TaskStatusCounts = Record<TaskStatus, number>;
type TaskRuntimeCounts = Record<TaskRuntime, number>;
type TaskRegistrySummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};
type TaskDeliveryState = {
  taskId: string;
  requesterOrigin?: DeliveryContext;
  lastNotifiedEventAt?: number;
};
type TaskRecord = {
  taskId: string;
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey: string;
  ownerKey: string;
  scopeKind: TaskScopeKind;
  childSessionKey?: string;
  parentFlowId?: string;
  parentTaskId?: string;
  agentId?: string;
  /** Agent store for requester transcripts whose session key is unscoped, such as `global`.
   * Task authorization remains keyed by ownerKey. */
  requesterAgentId?: string;
  runId?: string;
  label?: string;
  task: string;
  status: TaskStatus;
  deliveryStatus: TaskDeliveryStatus;
  notifyPolicy: TaskNotifyPolicy;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  lastEventAt?: number;
  cleanupAfter?: number /** Tool invocations observed on this run's agent-event stream. */;
  toolUseCount?: number /** Name of the most recent tool invocation observed for this run. */;
  lastToolName?: string;
  error?: string;
  progressSummary?: string;
  terminalSummary?: string;
  terminalOutcome?: TaskTerminalOutcome;
  detail?: JsonValue;
};
//#endregion
//#region src/tasks/task-flow-registry.types.d.ts
type TaskFlowSyncMode = "task_mirrored" | "managed";
/** Lifecycle status for multi-step task flows. */
type TaskFlowStatus =
  | "queued"
  | "running"
  | "waiting"
  | "blocked"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "lost";
type TaskFlowRecord = {
  flowId: string;
  syncMode: TaskFlowSyncMode;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  controllerId?: string;
  revision: number;
  status: TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  blockedTaskId?: string;
  blockedSummary?: string;
  stateJson?: JsonValue;
  waitJson?: JsonValue;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};
//#endregion
//#region src/agents/tool-fs-policy.types.d.ts
/** Filesystem policy for agent tools that can touch local paths. */
type ToolFsPolicy = {
  workspaceOnly: boolean;
};
//#endregion
//#region src/plugins/tool-types.d.ts
type OpenClawPluginActiveModelContext = {
  provider?: string;
  modelId?: string;
  modelRef?: string;
};
/** Trusted execution context passed to plugin-owned agent tool factories. */
type OpenClawPluginToolContext = {
  config?: OpenClawConfig /** Active runtime-resolved config snapshot when one is available. */;
  runtimeConfig?: OpenClawConfig /** Returns the latest runtime-resolved config snapshot for long-lived tool definitions. */;
  getRuntimeConfig?: () =>
    | OpenClawConfig
    | undefined /** Effective filesystem policy for the active tool run. */;
  fsPolicy?: ToolFsPolicy;
  workspaceDir?: string;
  agentDir?: string;
  agentId?: string;
  sessionKey?: string /** Ephemeral session UUID - regenerated on /new and /reset. Use for per-conversation isolation. */;
  sessionId?: string;
  /**
   * Runtime-supplied active model metadata for informational use, diagnostics,
   * and plugin-owned policy decisions. This is not a security boundary against
   * the local operator, installed plugin code, or a modified OpenClaw runtime.
   */
  activeModel?: OpenClawPluginActiveModelContext;
  browser?: {
    sandboxBridgeUrl?: string;
    allowHostControl?: boolean;
  };
  messageChannel?: string;
  agentAccountId?: string /** Trusted provider auth availability from the active auth profile store. */;
  hasAuthForProvider?: (
    providerId: string,
  ) => boolean /** Resolves an API key from the active auth profile store when available. */;
  resolveApiKeyForProvider?: (
    providerId: string,
  ) => Promise<
    string | undefined
  > /** Trusted ambient delivery route for the active agent/session. */;
  deliveryContext?: DeliveryContext /** Trusted platform-native conversation id for the active inbound turn. */;
  nativeChannelId?: string /** Trusted sender id from inbound context (runtime-provided, not tool args). */;
  requesterSenderId?: string /** Trusted owner bit from inbound context (runtime-provided, not tool args). */;
  senderIsOwner?: boolean;
  /**
   * Server-owned origin for this operation. Missing values are delegated.
   * Plugins must use it only for conversation-read visibility policy.
   */
  conversationReadOrigin?: ConversationReadInvocationOrigin;
  sandboxed?: boolean;
  /**
   * True for explicit one-shot local CLI runs that must release plugin-owned
   * process resources before the command exits.
   */
  oneShotCliRun?: boolean;
};
type OpenClawPluginToolFactory = (
  ctx: OpenClawPluginToolContext,
) => AnyAgentTool | AnyAgentTool[] | null | undefined;
type OpenClawPluginToolOptions = {
  name?: string;
  names?: string[];
  optional?: boolean;
};
type OpenClawPluginHookOptions = {
  entry?: HookEntry;
  name?: string;
  description?: string;
  register?: boolean;
};
//#endregion
//#region src/plugins/runtime/runtime-taskflow.types.d.ts
type ManagedTaskFlowRecord = TaskFlowRecord & {
  syncMode: "managed";
  controllerId: string;
};
type ManagedTaskFlowMutationErrorCode =
  | "not_found"
  | "not_managed"
  | "revision_conflict"
  | "persist_failed";
type ManagedTaskFlowMutationResult =
  | {
      applied: true;
      flow: ManagedTaskFlowRecord;
    }
  | {
      applied: false;
      code: ManagedTaskFlowMutationErrorCode;
      current?: TaskFlowRecord;
    };
type ManagedTaskFlowCreateParams = {
  controllerId: string;
  goal: string;
  status?: ManagedTaskFlowRecord["status"];
  notifyPolicy?: TaskNotifyPolicy;
  currentStep?: string | null;
  stateJson?: JsonValue | null;
  waitJson?: JsonValue | null;
  cancelRequestedAt?: number | null;
  createdAt?: number;
  updatedAt?: number;
  endedAt?: number | null;
};
type BoundTaskFlowTaskRunResult =
  | {
      created: true;
      flow: ManagedTaskFlowRecord;
      task: TaskRecord;
    }
  | {
      created: false;
      reason: string;
      found: boolean;
      flow?: TaskFlowRecord;
    };
type BoundTaskFlowCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  flow?: TaskFlowRecord;
  tasks?: TaskRecord[];
};
type BoundTaskFlowRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  createManaged: (params: ManagedTaskFlowCreateParams) => ManagedTaskFlowRecord;
  tryCreateManaged: (params: ManagedTaskFlowCreateParams) => ManagedTaskFlowRecord | null;
  get: (flowId: string) => TaskFlowRecord | undefined;
  list: () => TaskFlowRecord[];
  findLatest: () => TaskFlowRecord | undefined;
  resolve: (token: string) => TaskFlowRecord | undefined;
  getTaskSummary: (flowId: string) => TaskRegistrySummary | undefined;
  setWaiting: (params: {
    flowId: string;
    expectedRevision: number;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    waitJson?: JsonValue | null;
    blockedTaskId?: string | null;
    blockedSummary?: string | null;
    updatedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  resume: (params: {
    flowId: string;
    expectedRevision: number;
    status?: Extract<ManagedTaskFlowRecord["status"], "queued" | "running">;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    updatedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  finish: (params: {
    flowId: string;
    expectedRevision: number;
    stateJson?: JsonValue | null;
    updatedAt?: number;
    endedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  fail: (params: {
    flowId: string;
    expectedRevision: number;
    stateJson?: JsonValue | null;
    blockedTaskId?: string | null;
    blockedSummary?: string | null;
    updatedAt?: number;
    endedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  requestCancel: (params: {
    flowId: string;
    expectedRevision: number;
    cancelRequestedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  cancel: (params: { flowId: string; cfg: OpenClawConfig }) => Promise<BoundTaskFlowCancelResult>;
  runTask: (params: {
    flowId: string;
    runtime: TaskRuntime;
    sourceId?: string;
    childSessionKey?: string;
    parentTaskId?: string;
    agentId?: string;
    runId?: string;
    label?: string;
    task: string;
    preferMetadata?: boolean;
    notifyPolicy?: TaskNotifyPolicy;
    deliveryStatus?: TaskDeliveryStatus;
    status?: "queued" | "running";
    startedAt?: number;
    lastEventAt?: number;
    progressSummary?: string | null;
  }) => BoundTaskFlowTaskRunResult;
};
type PluginRuntimeTaskFlow = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskFlowRuntime;
  fromToolContext: (
    ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">,
  ) => BoundTaskFlowRuntime;
};
//#endregion
//#region src/plugins/runtime/model-auth-types.d.ts
/**
 * Runtime-ready auth result exposed to native plugins and context engines.
 *
 * `source`, `mode`, and `profileId` describe how the original credential was
 * resolved. `apiKey` is the request-ready credential after any provider-owned
 * runtime exchange, so it may differ from the stored/raw credential.
 */
type ResolvedProviderRuntimeAuth = Omit<ResolvedProviderAuth, "apiKey"> & {
  apiKey?: string;
  baseUrl?: string;
  request?: ModelProviderRequestTransportOverrides$1;
  expiresAt?: number;
};
//#endregion
//#region src/tts/provider-types.d.ts
/** Canonical speech provider identifier after provider registry normalization. */
type SpeechProviderId = string;
/** Output context requested from a speech provider. */
type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";
/** Provider-owned normalized config map. */
type SpeechProviderConfig = Record<string, unknown>;
/** Provider-owned per-request directive/persona overrides. */
type SpeechProviderOverrides = Record<string, unknown>;
/** Policy controlling which [[tts:*]] directive fields can affect synthesis. */
type SpeechModelOverridePolicy = {
  enabled: boolean;
  allowText: boolean;
  allowProvider: boolean;
  allowVoice: boolean;
  allowModelId: boolean;
  allowVoiceSettings: boolean;
  allowNormalization: boolean;
  allowSeed: boolean;
};
/** Parsed directive overrides grouped by provider. */
type TtsDirectiveOverrides = {
  ttsText?: string;
  provider?: SpeechProviderId;
  providerOverrides?: Record<string, SpeechProviderOverrides>;
};
/** Result of parsing TTS directives from message text. */
type TtsDirectiveParseResult = {
  cleanedText: string;
  ttsText?: string;
  hasDirective: boolean;
  overrides: TtsDirectiveOverrides;
  warnings: string[];
};
/** Context for checking whether a provider has enough config to synthesize. */
type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};
/** Request for buffered speech synthesis. */
type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Buffered speech synthesis result plus file/voice-note compatibility metadata. */
type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};
type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;
/** Streaming speech synthesis result; release frees provider transport resources. */
type SpeechSynthesisStreamResult = {
  audioStream: ReadableStream<Uint8Array>;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
  release?: () => Promise<void>;
};
/** Telephony synthesis request for provider output that needs a fixed sample rate. */
type SpeechTelephonySynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Telephony synthesis result with sample-rate metadata for call transports. */
type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};
/** Provider hook input for applying persona/config before synthesis. */
type SpeechProviderPrepareSynthesisContext = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  persona?: ResolvedTtsPersona;
  personaProviderConfig?: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  timeoutMs: number;
};
/** Optional provider-prepared synthesis overrides. */
type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};
/** Voice metadata returned by provider list-voices hooks. */
type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};
/** Provider voice-listing request with optional direct auth/URL overrides. */
type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string /** Core-resolved request timeout after config and provider defaults. */;
  timeoutMs?: number;
};
/** Provider hook input for resolving normalized config from raw OpenClaw config. */
type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};
/** One parsed directive key/value plus current provider override state. */
type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};
/** Provider directive parser result. */
type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};
/** Provider hook input for resolving talk-command speech config. */
type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};
/** Provider hook input for per-call talk-command overrides. */
type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
//#endregion
//#region src/tts/tts-auto-mode.d.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
declare const TTS_AUTO_MODES: Set<TtsAutoMode>;
/** Normalize an unknown value into a supported TTS auto mode. */
declare function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined;
//#endregion
//#region src/tts/tts-config.d.ts
/** Routing context used to layer global, agent, channel, and account TTS config. */
type TtsConfigResolutionContext = {
  agentId?: string;
  channelId?: string;
  accountId?: string;
};
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
declare function resolveEffectiveTtsConfig(
  cfg: OpenClawConfig,
  contextOrAgentId?: string | TtsConfigResolutionContext,
): TtsConfig;
//#endregion
//#region src/tts/tts-types.d.ts
/** Resolved directive override policy after config defaults are applied. */
type ResolvedTtsModelOverrides = SpeechModelOverridePolicy;
/** Fully resolved TTS runtime config consumed by synthesis and status paths. */
type ResolvedTtsConfig = {
  auto: TtsAutoMode;
  mode: TtsMode;
  provider: TtsProvider;
  providerSource: "config" | "default";
  persona?: string;
  personas: Record<string, ResolvedTtsPersona>;
  summaryModel?: string;
  modelOverrides: ResolvedTtsModelOverrides;
  providerConfigs: Record<string, SpeechProviderConfig>;
  prefsPath?: string;
  maxTextLength: number;
  timeoutMs: number;
  timeoutMsSource?: "config" | "default";
  rawConfig?: TtsConfig;
  sourceConfig?: OpenClawConfig;
};
//#endregion
//#region src/plugin-sdk/tts-runtime.types.d.ts
/** Stable reason codes for one provider attempt in a TTS fallback chain. */
type TtsAttemptReasonCode =
  | "success"
  | "no_provider_registered"
  | "not_configured"
  | "unsupported_for_streaming"
  | "unsupported_for_telephony"
  | "timeout"
  | "provider_error";
/** Per-provider attempt record used in TTS status, logs, and result metadata. */
type TtsProviderAttempt = {
  provider: string;
  outcome: "success" | "skipped" | "failed";
  reasonCode: TtsAttemptReasonCode;
  persona?: string;
  personaBinding?: "applied" | "missing" | "none";
  latencyMs?: number;
  error?: string;
};
/** Delivery target requested for synthesized speech output. */
type TtsSpeechTarget = "audio-file" | "voice-note";
/** Standard text-to-speech request for file or stream synthesis. */
type TtsRequestParams = {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
};
/** Telephony-specific synthesis request where output format is constrained by the caller. */
type TtsTelephonyRequestParams = {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  overrides?: TtsDirectiveOverrides;
};
/** Inputs for listing voices from a speech provider with optional resolved config. */
type ListSpeechVoicesParams = {
  provider: string;
  cfg?: OpenClawConfig;
  config?: ResolvedTtsConfig;
  apiKey?: string;
  baseUrl?: string;
};
/** File-backed text-to-speech result returned by high-level runtime helpers. */
type TtsResult = {
  success: boolean;
  audioPath?: string;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  audioAsVoice?: boolean;
  target?: TtsSpeechTarget;
};
/** Stream-backed synthesis result with optional release hook for provider resources. */
type TtsStreamResult = {
  success: boolean;
  audioStream?: ReadableStream<Uint8Array>;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: TtsSpeechTarget;
  release?: () => Promise<void>;
};
/** Telephony synthesis result with provider voice/model and sample-rate metadata. */
type TtsTelephonyResult = {
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  sampleRate?: number;
};
/** High-level function contract for file-backed text-to-speech synthesis. */
type TextToSpeech = (params: TtsRequestParams) => Promise<TtsResult>;
/** High-level function contract for streaming text-to-speech synthesis. */
type TextToSpeechStream = (params: TtsRequestParams) => Promise<TtsStreamResult>;
/** High-level function contract for telephony-safe text-to-speech synthesis. */
type TextToSpeechTelephony = (params: TtsTelephonyRequestParams) => Promise<TtsTelephonyResult>;
/** Function contract for provider voice discovery. */
type ListSpeechVoices = (params: ListSpeechVoicesParams) => Promise<SpeechVoiceOption[]>;
//#endregion
//#region src/plugins/runtime/task-domain-types.d.ts
/** Aggregate task-run counts exposed to plugin task views. */
type TaskRunAggregateSummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};
/** Public task run summary exposed through plugin runtime task APIs. */
type TaskRunView = {
  id: string;
  runtime: TaskRuntime;
  sourceId?: string;
  sessionKey: string;
  ownerKey: string;
  scope: TaskScopeKind;
  childSessionKey?: string;
  flowId?: string;
  parentTaskId?: string;
  agentId?: string;
  runId?: string;
  label?: string;
  title: string;
  status: TaskStatus;
  deliveryStatus: TaskDeliveryStatus;
  notifyPolicy: TaskNotifyPolicy;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  lastEventAt?: number;
  cleanupAfter?: number;
  error?: string;
  progressSummary?: string;
  terminalSummary?: string;
  terminalOutcome?: TaskTerminalOutcome;
};
/** Detailed task run view; currently equal to the summary view. */
type TaskRunDetail = TaskRunView;
/** Result returned when cancelling a task run. */
type TaskRunCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskRunDetail;
};
/** Public task flow summary exposed through plugin runtime task APIs. */
type TaskFlowView = {
  id: string;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  status: TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};
/** Detailed task flow view with state, wait, blocked, and task summary data. */
type TaskFlowDetail = TaskFlowView & {
  state?: JsonValue;
  wait?: JsonValue;
  blocked?: {
    taskId?: string;
    summary?: string;
  };
  tasks: TaskRunView[];
  taskSummary: TaskRunAggregateSummary;
};
//#endregion
//#region src/tasks/detached-task-runtime-contract.d.ts
type DetachedTaskCreateParams = {
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey?: string;
  ownerKey?: string;
  scopeKind?: TaskScopeKind;
  requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  parentFlowId?: string;
  childSessionKey?: string;
  parentTaskId?: string;
  agentId?: string;
  requesterAgentId?: string;
  runId?: string;
  label?: string;
  task: string;
  preferMetadata?: boolean;
  notifyPolicy?: TaskNotifyPolicy;
  deliveryStatus?: TaskDeliveryStatus;
  detail?: JsonValue;
};
type DetachedRunningTaskCreateParams = DetachedTaskCreateParams & {
  startedAt?: number;
  lastEventAt?: number;
  progressSummary?: string | null;
};
type DetachedTaskStartParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  startedAt?: number;
  lastEventAt?: number;
  progressSummary?: string | null;
  eventSummary?: string | null;
};
type DetachedTaskProgressParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  lastEventAt?: number;
  progressSummary?: string | null;
  eventSummary?: string | null;
};
type DetachedTaskFinalizeCommonParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  childSessionKey?: string | null;
  endedAt: number;
  lastEventAt?: number;
  progressSummary?: string | null;
  terminalSummary?: string | null;
  preserveTerminalSummary?: boolean;
  detail?: JsonValue;
  suppressDelivery?: boolean;
};
type DetachedTaskCompleteParams = DetachedTaskFinalizeCommonParams & {
  terminalOutcome?: TaskTerminalOutcome | null;
};
type DetachedTaskFailParams = DetachedTaskFinalizeCommonParams & {
  status?: Extract<TaskStatus, "failed" | "timed_out" | "cancelled">;
  error?: string;
};
type DetachedTaskFinalizeParams = DetachedTaskFinalizeCommonParams & {
  status: Extract<TaskStatus, "succeeded" | "failed" | "timed_out" | "cancelled">;
  error?: string;
  clearError?: boolean;
  terminalOutcome?: TaskTerminalOutcome | null;
};
type DetachedTaskTerminalState = Omit<
  DetachedTaskFinalizeParams,
  "runId" | "runtime" | "sessionKey"
>;
type DetachedTaskDeliveryStatusParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  deliveryStatus: TaskDeliveryStatus;
  error?: string;
};
type DetachedTaskCancelParams = {
  cfg: OpenClawConfig;
  taskId: string;
  reason?: string;
};
type DetachedTaskCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskRecord;
};
type DetachedTaskRecoveryAttemptParams = {
  taskId: string;
  runtime: TaskRuntime;
  task: TaskRecord;
  now: number;
};
type DetachedTaskRecoveryAttemptResult = {
  recovered: boolean;
};
type DetachedTaskFindParams = {
  runId: string;
  runtime: TaskRuntime;
  sessionKey: string;
  createdAtOrAfter: number;
  createdBefore?: number;
  allowSessionFallback?: boolean;
};
type DetachedTaskLifecycleRuntime = {
  createQueuedTaskRun: (params: DetachedTaskCreateParams) => TaskRecord | null;
  createRunningTaskRun: (params: DetachedRunningTaskCreateParams) => TaskRecord | null;
  startTaskRunByRunId: (params: DetachedTaskStartParams) => TaskRecord[];
  recordTaskRunProgressByRunId: (params: DetachedTaskProgressParams) => TaskRecord[];
  finalizeTaskRunByRunId?: (params: DetachedTaskFinalizeParams) => TaskRecord[];
  completeTaskRunByRunId: (params: DetachedTaskCompleteParams) => TaskRecord[];
  failTaskRunByRunId: (params: DetachedTaskFailParams) => TaskRecord[];
  setDetachedTaskDeliveryStatusByRunId: (params: DetachedTaskDeliveryStatusParams) => TaskRecord[];
  /**
   * Resolve the task owned by one run generation. Custom runtimes should
   * implement this when their records are not mirrored into core task state.
   */
  findTaskRun?: (params: DetachedTaskFindParams) => TaskRecord | undefined;
  /**
   * Return `found: false` when this runtime does not own the task so core can
   * fall back to the legacy detached-task cancel path.
   */
  cancelDetachedTaskRunById: (
    params: DetachedTaskCancelParams,
  ) => Promise<DetachedTaskCancelResult>;
  /**
   * Give a registered detached runtime one last chance to recover a stale task
   * before core marks it lost during maintenance.
   */
  tryRecoverTaskBeforeMarkLost?: (
    params: DetachedTaskRecoveryAttemptParams,
  ) => DetachedTaskRecoveryAttemptResult | Promise<DetachedTaskRecoveryAttemptResult>;
};
//#endregion
//#region src/plugins/runtime/runtime-tasks.types.d.ts
type BoundTaskRunsRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  get: (taskId: string) => TaskRunDetail | undefined;
  list: () => TaskRunView[];
  findLatest: () => TaskRunDetail | undefined;
  resolve: (token: string) => TaskRunDetail | undefined;
  cancel: (params: { taskId: string; cfg: OpenClawConfig }) => Promise<TaskRunCancelResult>;
};
type PluginRuntimeTaskRuns = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskRunsRuntime;
  fromToolContext: (
    ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">,
  ) => BoundTaskRunsRuntime;
};
type BoundTaskFlowsRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  get: (flowId: string) => TaskFlowDetail | undefined;
  list: () => TaskFlowView[];
  findLatest: () => TaskFlowDetail | undefined;
  resolve: (token: string) => TaskFlowDetail | undefined;
  getTaskSummary: (flowId: string) => TaskRunAggregateSummary | undefined;
};
type PluginRuntimeTaskFlows = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskFlowsRuntime;
  fromToolContext: (
    ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">,
  ) => BoundTaskFlowsRuntime;
};
type PluginRuntimeTasks = {
  runs: PluginRuntimeTaskRuns;
  flows: PluginRuntimeTaskFlows;
  managedFlows: PluginRuntimeTaskFlow /** @deprecated Use runtime.tasks.flows for DTO-based TaskFlow access. */;
  flow: PluginRuntimeTaskFlow;
};
//#endregion
//#region src/plugins/runtime/types-core.d.ts
type RuntimeRequestHeartbeatOptions = Parameters<typeof requestHeartbeat>[0];
type RuntimeRequestHeartbeatNowOptions = Omit<RuntimeRequestHeartbeatOptions, "source" | "intent"> &
  Partial<Pick<RuntimeRequestHeartbeatOptions, "source" | "intent">>;
type RuntimeWriteConfigOptions = {
  envSnapshotForRestore?: Record<string, string | undefined>;
  expectedConfigPath?: string;
  unsetPaths?: string[][];
};
type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;
type RuntimeConfigAfterWrite = ConfigWriteAfterWrite;
type RuntimeConfigReplaceResult = ConfigReplaceResult;
type RuntimeProviderListParams = {
  config?: OpenClawConfig;
};
type RuntimeConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
};
type RuntimeMutateConfigFileParams<T = void> = {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite: RuntimeConfigAfterWrite;
  writeOptions?: RuntimeWriteConfigOptions;
  mutate: (
    draft: OpenClawConfig,
    context: RuntimeConfigMutationContext,
  ) => Promise<T | void> | T | void;
};
type RuntimeReplaceConfigFileParams = {
  nextConfig: OpenClawConfig;
  baseHash?: string;
  afterWrite: RuntimeConfigAfterWrite;
  writeOptions?: RuntimeWriteConfigOptions;
};
type RuntimeSessionEntry = SessionEntry;
type RuntimeSessionPluginExtensions =
  | Record<string, Record<string, SessionPluginJsonValue>>
  | undefined;
type RuntimeSessionStoreReadParams = {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  sessionKey: string;
  readConsistency?: "latest";
  storePath?: string;
};
type RuntimeSessionStoreListParams = Partial<Omit<RuntimeSessionStoreReadParams, "sessionKey">>;
type RuntimeSessionStoreEntrySummary = {
  sessionKey: string;
  entry: RuntimeSessionEntry;
};
type RuntimeCreateSessionEntryResult = {
  key: string;
  agentId: string;
  sessionId: string;
  entry: RuntimeSessionEntry;
};
type RuntimeCreateSessionEntryFinalPatch = {
  pluginExtensions: RuntimeSessionPluginExtensions;
};
type RuntimeCreateSessionEntryBaseParams = {
  cfg: OpenClawConfig;
  key: string;
  agentId?: string;
  label?: string;
  spawnedCwd?: string /** Bind the created session's CLI execution to this paired node. */;
  execNode?: string /** Working directory interpreted only by execNode. */;
  execCwd?: string;
  initialEntry:
    | {
        agentHarnessId: string;
        modelSelectionLocked?: true;
        pluginExtensions?: RuntimeSessionPluginExtensions;
      }
    | {
        cliBackendId: string;
        model: string;
        cliSessionBinding: CliSessionBinding;
        modelSelectionLocked: true;
        pluginExtensions?: RuntimeSessionPluginExtensions /** Registry-injected owner; plugin callers cannot select another owner. */;
        pluginOwnerId?: string;
      };
};
type RuntimeCreateSessionEntryParams = RuntimeCreateSessionEntryBaseParams &
  (
    | {
        /** Retry an interrupted initializer only when persisted trusted state matches exactly. */ recoverMatchingInitialEntry: true;
        afterCreate: (
          created: RuntimeCreateSessionEntryResult,
        ) => Promise<RuntimeCreateSessionEntryFinalPatch>;
      }
    | {
        recoverMatchingInitialEntry?: never;
        afterCreate?: (
          created: RuntimeCreateSessionEntryResult,
        ) => Promise<RuntimeCreateSessionEntryFinalPatch | void>;
      }
  );
type RuntimeSessionStoreEntryPatchParams = RuntimeSessionStoreReadParams & {
  fallbackEntry?: RuntimeSessionEntry;
  maintenanceConfig?: ResolvedSessionMaintenanceConfigInput;
  preserveActivity?: boolean;
  replaceEntry?: boolean;
  update: (
    entry: RuntimeSessionEntry,
    context: {
      existingEntry?: RuntimeSessionEntry;
    },
  ) => Promise<Partial<RuntimeSessionEntry> | null> | Partial<RuntimeSessionEntry> | null;
};
type RuntimeUpsertSessionEntryParams = RuntimeSessionStoreReadParams & {
  entry: RuntimeSessionEntry;
};
type RuntimeSessionWorkAdmissionParams = {
  storePath: string;
  sessionKey: string;
  signal?: AbortSignal;
};
type RuntimeSessionStoreEntryUpdateParams = {
  storePath: string;
  sessionKey: string;
  update: (
    entry: RuntimeSessionEntry,
  ) => Promise<Partial<RuntimeSessionEntry> | null> | Partial<RuntimeSessionEntry> | null;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  requireWriteSuccess?: boolean;
};
/** @public Part of the PluginRuntime declaration contract. */
type PluginRuntimeThinkingPolicyRequest = {
  provider?: string | null;
  model?: string | null;
  catalog?: ThinkingCatalogEntry[];
  agentRuntime?: string | null;
};
/** @public Part of the PluginRuntime declaration contract. */
type PluginRuntimeThinkingPolicyLevel = {
  id: ThinkLevel;
  label: string;
};
/** @public Part of the PluginRuntime declaration contract. */
type PluginRuntimeThinkingPolicy = {
  levels: PluginRuntimeThinkingPolicyLevel[];
  defaultLevel?: ThinkLevel | null;
};
/** Structured logger surface injected into runtime-backed plugin helpers. */
type RuntimeLogger = {
  debug?: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
};
type RunHeartbeatOnceOptions = {
  reason?: string;
  agentId?: string;
  sessionKey?: string /** Override heartbeat config (e.g. `{ target: "last" }` to deliver to the last active channel). */;
  heartbeat?: {
    target?: string;
  };
};
type LlmCompleteMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
type LlmCompleteCaller = {
  kind: "plugin" | "context-engine" | "host" | "unknown";
  id?: string;
  name?: string;
};
type LlmCompleteUsage = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  totalTokens?: number;
  costUsd?: number;
};
type LlmCompleteParams = {
  messages: LlmCompleteMessage[] /** Model ref (e.g. "anthropic/claude-sonnet-4-6"); defaults to the target agent's configured model. */;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  signal?: AbortSignal /** Human-readable reason for audit/debug output. */;
  purpose?: string /** Agent whose model/credentials to use. Session-bound capabilities may disallow overrides. */;
  agentId?: string;
};
type LlmCompleteResult = {
  text: string;
  provider: string;
  model: string;
  agentId: string;
  usage: LlmCompleteUsage;
  audit: {
    caller: LlmCompleteCaller;
    purpose?: string;
    sessionKey?: string;
  };
};
type RuntimeRunEmbeddedAgent = (params: RunEmbeddedAgentParams) => Promise<EmbeddedAgentRunResult>;
/** Core runtime helpers exposed to trusted native plugins. */
type PluginRuntimeCore = {
  version: string;
  config: {
    /** Current process runtime config snapshot. Prefer config passed into the active call path. */ current: () => DeepReadonly<OpenClawConfig>;
    /**
     * Persist a focused config mutation. Callers must choose the post-write
     * behavior explicitly so the gateway can hot-reload, restart, or defer.
     */
    mutateConfigFile: <T = void>(
      params: RuntimeMutateConfigFileParams<T>,
    ) => Promise<
      RuntimeConfigReplaceResult & {
        result: T | undefined;
      }
    >;
    /**
     * Persist a full config replacement. Callers must choose the post-write
     * behavior explicitly so the gateway can hot-reload, restart, or defer.
     */
    replaceConfigFile: (
      params: RuntimeReplaceConfigFileParams,
    ) => Promise<RuntimeConfigReplaceResult>;
    /**
     * @deprecated Use current(), or pass the already loaded config through the
     * call path. Runtime code must not reload config on demand. Bundled
     * plugins and repo code are blocked from using this by the
     * deprecated-internal-config-api architecture guard.
     */
    loadConfig: () => OpenClawConfig;
    /**
     * @deprecated Use mutateConfigFile() or replaceConfigFile() with an
     * explicit afterWrite intent so restart behavior stays under host control.
     * Bundled plugins and repo code are blocked from using this by the
     * deprecated-internal-config-api architecture guard.
     */
    writeConfigFile: (
      cfg: OpenClawConfig,
      options?: RuntimeWriteConfigOptions & {
        afterWrite?: RuntimeConfigAfterWrite;
      },
    ) => Promise<void>;
  };
  agent: {
    defaults: {
      model: typeof DEFAULT_MODEL;
      provider: typeof DEFAULT_PROVIDER;
    };
    resolveAgentDir: typeof resolveAgentDir;
    resolveAgentWorkspaceDir: typeof resolveAgentWorkspaceDir;
    resolveAgentIdentity: typeof resolveAgentIdentity;
    resolveThinkingDefault: (params: {
      cfg: OpenClawConfig;
      provider: string;
      model: string;
      catalog?: ModelCatalogEntry[];
    }) => ThinkLevel;
    normalizeThinkingLevel: (raw?: string | null) => ThinkLevel | undefined;
    resolveThinkingPolicy: (
      params: PluginRuntimeThinkingPolicyRequest,
    ) => PluginRuntimeThinkingPolicy;
    runEmbeddedAgent: RuntimeRunEmbeddedAgent /** @deprecated Use runEmbeddedAgent. */;
    runEmbeddedPiAgent: RuntimeRunEmbeddedAgent;
    resolveAgentTimeoutMs: typeof resolveAgentTimeoutMs;
    ensureAgentWorkspace: typeof ensureAgentWorkspace;
    session: {
      resolveStorePath: typeof resolveStorePath;
      createSessionEntry: (
        params: RuntimeCreateSessionEntryParams,
      ) => Promise<RuntimeCreateSessionEntryResult>;
      getSessionEntry: (params: RuntimeSessionStoreReadParams) => RuntimeSessionEntry | undefined;
      listSessionEntries: (
        params?: RuntimeSessionStoreListParams,
      ) => RuntimeSessionStoreEntrySummary[];
      patchSessionEntry: (
        params: RuntimeSessionStoreEntryPatchParams,
      ) => Promise<RuntimeSessionEntry | null>;
      upsertSessionEntry: (params: RuntimeUpsertSessionEntryParams) => Promise<void>;
      runWithWorkAdmission: <T>(
        params: RuntimeSessionWorkAdmissionParams,
        run: (signal: AbortSignal) => Promise<T>,
      ) => Promise<T>;
      updateSessionStoreEntry: (
        params: RuntimeSessionStoreEntryUpdateParams,
      ) => Promise<RuntimeSessionEntry | null>;
    };
  };
  system: {
    enqueueSystemEvent: typeof enqueueSystemEvent;
    requestHeartbeat: typeof requestHeartbeat;
    /**
     * @deprecated Use `requestHeartbeat({ source, intent, reason })` so wake producers declare
     * scheduler intent explicitly.
     */
    requestHeartbeatNow: (opts?: RuntimeRequestHeartbeatNowOptions) => void;
    /**
     * Run a single heartbeat cycle immediately (bypassing the coalesce timer).
     * Accepts an optional `heartbeat` config override so callers can force
     * delivery to the last active channel — the same pattern the cron service
     * uses to avoid the default `target: "none"` suppression.
     */
    runHeartbeatOnce: (opts?: RunHeartbeatOnceOptions) => Promise<HeartbeatRunResult>;
    runCommandWithTimeout: typeof runCommandWithTimeout;
    formatNativeDependencyHint: typeof formatNativeDependencyHint;
  };
  media: {
    loadWebMedia: typeof loadWebMedia;
    detectMime: typeof detectMime;
    mediaKindFromMime: typeof mediaKindFromMime;
    isVoiceCompatibleAudio: typeof isVoiceCompatibleAudio;
    getImageMetadata: typeof getImageMetadata;
    resizeToJpeg: typeof resizeToJpeg;
  };
  tts: {
    textToSpeech: TextToSpeech;
    textToSpeechStream: TextToSpeechStream;
    textToSpeechTelephony: TextToSpeechTelephony;
    listVoices: ListSpeechVoices;
  };
  mediaUnderstanding: {
    runFile: MediaUnderstandingRuntime["runMediaUnderstandingFile"];
    describeImageFile: MediaUnderstandingRuntime["describeImageFile"];
    describeImageFileWithModel: MediaUnderstandingRuntime["describeImageFileWithModel"];
    extractStructuredWithModel: MediaUnderstandingRuntime["extractStructuredWithModel"];
    describeVideoFile: MediaUnderstandingRuntime["describeVideoFile"];
    transcribeAudioFile: MediaUnderstandingRuntime["transcribeAudioFile"];
  };
  imageGeneration: {
    generate: (params: GenerateImageParams) => Promise<GenerateImageRuntimeResult>;
    listProviders: (params?: RuntimeProviderListParams) => ImageGenerationProvider[];
  };
  videoGeneration: {
    generate: (params: GenerateVideoParams) => Promise<GenerateVideoRuntimeResult>;
    listProviders: (params?: RuntimeProviderListParams) => VideoGenerationProvider[];
  };
  musicGeneration: {
    generate: (params: GenerateMusicParams) => Promise<GenerateMusicRuntimeResult>;
    listProviders: (params?: RuntimeProviderListParams) => MusicGenerationProvider[];
  };
  webSearch: {
    listProviders: (params?: RuntimeProviderListParams) => PluginWebSearchProviderEntry[];
    search: (params: RunWebSearchParams) => Promise<RunWebSearchResult>;
  };
  stt: {
    transcribeAudioFile: MediaUnderstandingRuntime["transcribeAudioFile"];
  };
  events: {
    onAgentEvent: typeof onAgentEvent;
    onSessionTranscriptUpdate: typeof onSessionTranscriptUpdate;
  };
  logging: {
    shouldLogVerbose: typeof shouldLogVerbose;
    getChildLogger: (
      bindings?: Record<string, unknown>,
      opts?: {
        level?: LogLevel;
      },
    ) => RuntimeLogger;
  };
  state: {
    resolveStateDir: typeof resolveStateDir;
    openKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
    openSyncKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateSyncKeyedStore<T>;
    openChannelIngressQueue: <TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(
      options?: Omit<CreateChannelIngressQueueOptions, "channelId">,
    ) => ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  };
  tasks: {
    runs: PluginRuntimeTaskRuns;
    flows: PluginRuntimeTaskFlows;
    managedFlows: PluginRuntimeTaskFlow /** @deprecated Use runtime.tasks.flows for DTO-based TaskFlow access. */;
    flow: PluginRuntimeTaskFlow;
  } /** @deprecated Use runtime.tasks.flows for DTO-based TaskFlow access. */;
  taskFlow: PluginRuntimeTaskFlow;
  llm: {
    complete: (params: LlmCompleteParams) => Promise<LlmCompleteResult>;
    acquireLocalService: (
      target: {
        providerId: string;
        baseUrl: string;
        headers?: HeadersInit;
      },
      signal?: AbortSignal | null,
    ) => Promise<
      | {
          release: () => void;
        }
      | undefined
    >;
  };
  modelAuth: {
    /** Resolve auth for a model. Only provider/model, optional cfg, and workspaceDir are used. */ getApiKeyForModel: (params: {
      model: Model<Api>;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderAuth> /** Resolve request-ready auth for a model, including provider runtime exchanges. */;
    getRuntimeAuthForModel: (params: {
      model: Model<Api>;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderRuntimeAuth> /** Resolve auth for a provider by name. Only provider, optional cfg, and workspaceDir are used. */;
    resolveApiKeyForProvider: (params: {
      provider: string;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderAuth>;
  };
};
//#endregion
//#region src/context-engine/types.d.ts
type AssembleResult = {
  /** Ordered messages to use as model context */ messages: AgentMessage[] /** Estimated total tokens in assembled context */;
  estimatedTokens: number;
  /**
   * Controls which token estimate the runner treats as authoritative for
   * preemptive overflow prechecks. The returned `messages` are always the
   * prompt sent to the model; this only affects the precheck's token comparison.
   *
   * - "assembled": the generic precheck uses only the assembled prompt's estimate
   *   unless the engine owns compaction; owning engines manage prompt admission.
   * - "preassembly_may_overflow": the precheck takes the maximum of the
   *   assembled estimate and the pre-assembly (unwindowed) session-history
   *   estimate. Engines opt into this when their assembled view can hide an
   *   overflow that would still affect the underlying transcript. This opt-in
   *   keeps the generic precheck active even for engines that own compaction.
   *
   * Defaults to "assembled".
   */
  promptAuthority?:
    | "assembled"
    | "preassembly_may_overflow" /** Optional context-engine-provided instructions prepended to the runtime system prompt */;
  systemPromptAddition?: string;
  /**
   * Optional projection lifecycle for hosts with persistent backend threads.
   *
   * Context engines that return `thread_bootstrap` ask the host to inject the
   * assembled context once for the supplied epoch, then reuse the backend
   * thread until the epoch changes. Engines that omit this field retain the
   * legacy per-turn projection behavior.
   */
  contextProjection?: ContextEngineProjection;
};
type ContextEngineProjection = {
  /** How the assembled context should be projected into the backend runtime. */ mode:
    | "per_turn"
    | "thread_bootstrap" /** Stable context epoch. Changing this tells persistent backends to rotate. */;
  epoch?: string /** Optional diagnostic fingerprint for the projected context payload. */;
  fingerprint?: string;
};
type ContextEngineOperation = "agent-run" | "manual-compact" | "subagent-spawn";
type ContextEngineRuntimeMode = "normal" | "fallback" | "degraded";
type ContextEngineSelectionSource = "configured" | "default" | "unknown";
type ContextEngineRuntimeReasonCode =
  | "provider_timeout"
  | "provider_unavailable"
  | "rate_limited"
  | "context_overflow"
  | "runtime_unavailable"
  | "unknown";
type ContextEngineHostCapability =
  | "bootstrap"
  | "assemble-before-prompt"
  | "after-turn"
  | "maintain"
  | "compact"
  | "runtime-llm-complete"
  | "thread-bootstrap-projection";
type ContextEngineHostRequirements = {
  /** Host capabilities required before the engine can safely serve this operation. */ requiredCapabilities: ContextEngineHostCapability[] /** Optional engine-authored guidance appended to the host compatibility error. */;
  unsupportedMessage?: string;
};
type ContextEngineRuntimeSettings = {
  schemaVersion: 1;
  runtime: {
    host: "openclaw";
    mode: ContextEngineRuntimeMode;
    harnessId: string | null;
    runtimeId: string | null;
  };
  model: {
    requested: string | null;
    resolved: string | null;
    provider: string | null;
    family: string | null;
  };
  contextEngineSelection: {
    selectedId: string | null;
    source: ContextEngineSelectionSource;
  };
  executionHost: {
    id: string | null;
    label: string | null;
  };
  limits: {
    promptTokenBudget: number | null;
    maxOutputTokens: number | null;
  };
  diagnostics: {
    fallbackReason: ContextEngineRuntimeReasonCode | null;
    degradedReason: ContextEngineRuntimeReasonCode | null;
  };
};
declare class ContextEngineRuntimeSettingsUnavailableError extends Error {
  readonly code = "context_engine_runtime_settings_unavailable";
  constructor(message?: string);
}
declare class ContextEngineRuntimeSettingsUnsupportedError extends Error {
  readonly code = "context_engine_runtime_settings_unsupported";
  constructor(message?: string);
}
type CompactResult = {
  ok: boolean;
  compacted: boolean;
  reason?: string;
  result?: {
    summary?: string;
    firstKeptEntryId?: string;
    tokensBefore: number;
    tokensAfter?: number;
    details?: unknown /** Session id after compaction, when the runtime rotated transcripts. */;
    sessionId?: string /** Typed post-compaction live session target; successor when the runtime rotated transcripts. */;
    sessionTarget?: ContextEngineSessionTarget;
    /**
     * Raw session file path after compaction.
     *
     * @deprecated Use `sessionTarget`. Shipped plugin-sdk contract: released
     * third-party context engines (v2026.6.x and earlier) report rotated
     * transcripts through this field. Remove once typed session targets are
     * the only successor contract.
     */
    sessionFile?: string;
  };
};
type IngestResult = {
  /** Whether the message was ingested (false if duplicate or no-op) */ ingested: boolean;
};
type IngestBatchResult = {
  /** Number of messages ingested from the supplied batch */ ingestedCount: number;
};
type BootstrapResult = {
  /** Whether bootstrap ran and initialized the engine's store */ bootstrapped: boolean /** Number of historical messages imported (if applicable) */;
  importedMessages?: number /** Optional reason when bootstrap was skipped */;
  reason?: string;
};
type ContextEngineInfo = {
  id: string;
  name: string;
  version?: string /** True when the engine manages its own compaction lifecycle. */;
  ownsCompaction?: boolean;
  /**
   * Controls how turn-triggered maintenance should be executed.
   *
   * Engines remain compatible by default unless the host explicitly opts into
   * background turn maintenance.
   */
  turnMaintenanceMode?: "foreground" | "background";
  /**
   * Host capability requirements for operations where using an unsupported
   * runtime would silently degrade or corrupt the engine's behavior.
   */
  hostRequirements?: Partial<Record<ContextEngineOperation, ContextEngineHostRequirements>>;
};
type SubagentSpawnPreparation = {
  /** Roll back pre-spawn setup when subagent launch fails. */ rollback: () => void | Promise<void>;
};
type SubagentEndReason = "deleted" | "completed" | "swept" | "released";
type TranscriptRewriteReplacement = {
  /** Existing transcript entry id to replace on the active branch. */ entryId: string /** Replacement message content for that entry. */;
  message: AgentMessage;
};
type TranscriptRewriteRequest = {
  /** Message entry replacements to apply in one branch-and-reappend pass. */ replacements: TranscriptRewriteReplacement[] /** Optional entry-id set that must cover every active-branch entry from the first replacement onward. */;
  allowedRewriteSuffixEntryIds?: string[];
};
type TranscriptRewriteResult = {
  /** Whether the active branch changed. */ changed: boolean /** Estimated bytes removed from the active branch message payloads. */;
  bytesFreed: number /** Number of transcript message entries rewritten. */;
  rewrittenEntries: number /** Optional reason when no rewrite occurred. */;
  reason?: string;
};
type ContextEngineMaintenanceResult = TranscriptRewriteResult;
type ContextEnginePromptCacheRetention = "none" | "short" | "long" | "in_memory" | "24h";
type ContextEnginePromptCacheUsage = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  contextUsage?:
    | {
        state: "available";
        promptTokens: number;
        totalTokens: number;
      }
    | {
        state: "unavailable";
      };
  total?: number;
};
type ContextEnginePromptCacheObservationChangeCode =
  | "cacheRetention"
  | "model"
  | "streamStrategy"
  | "systemPrompt"
  | "tools"
  | "transport";
type ContextEnginePromptCacheObservationChange = {
  code: ContextEnginePromptCacheObservationChangeCode;
  detail: string;
};
type ContextEnginePromptCacheObservation = {
  broke: boolean;
  previousCacheRead?: number;
  cacheRead?: number;
  changes?: ContextEnginePromptCacheObservationChange[];
};
type ContextEnginePromptCacheInfo = {
  /** Runtime-resolved retention for the actual provider/model/request path. */ retention?: ContextEnginePromptCacheRetention /** Usage from the most recent API call, not accumulated retry/tool-loop totals. */;
  lastCallUsage?: ContextEnginePromptCacheUsage /** Result from the runtime's prompt-cache observability heuristic. */;
  observation?: ContextEnginePromptCacheObservation /** Last known cache-touch timestamp from runtime-managed cache-TTL bookkeeping. */;
  lastCacheTouchAt?: number /** Known cache expiry time when the runtime can source it confidently. */;
  expiresAt?: number;
};
type ContextEngineTranscriptStorageInfo = {
  /**
   * Authoritative transcript backend for this runtime turn.
   *
   * Hosts may still pass legacy locator fields such as `sessionFile` for older
   * plugin contracts, but context engines should use this field to decide
   * whether that locator is a live transcript source.
   */
  kind: "sqlite";
};
type ContextEngineSessionTarget = {
  /** Agent that owns the session in the runtime store. */ agentId?: string /** Runtime session id to compact. */;
  sessionId?: string /** Stable session key used for aliases, policy, and store resolution. */;
  sessionKey?: string /** Session store path that scopes the SQLite-backed runtime session. */;
  storePath?: string /** Optional transport thread identity for session target resolution. */;
  threadId?: string | number;
};
type ContextEngineRuntimeContext = Record<string, unknown> & {
  /** Runtime task working directory; workspaceDir remains the agent bootstrap workspace. */ cwd?: string;
  /**
   * True when the host has explicitly opted this maintenance run into
   * consuming deferred compaction debt.
   */
  allowDeferredCompactionExecution?: boolean /** Runtime-resolved context window budget for the active model call. */;
  tokenBudget?: number /** Selected agent harness id when compaction delegates back to the runtime. */;
  agentHarnessId?: string /** Best-effort current prompt/context token estimate for this turn. */;
  currentTokenCount?: number /** Optional prompt-cache telemetry for cache-aware engines. */;
  promptCache?: ContextEnginePromptCacheInfo /** Authoritative transcript backend for this turn. */;
  transcriptStorage?: ContextEngineTranscriptStorageInfo /** Storage-neutral runtime session target for compaction delegation. */;
  sessionTarget?: ContextEngineSessionTarget;
  /**
   * Safe transcript rewrite helper implemented by the runtime.
   *
   * Engines decide what is safe to rewrite; the runtime owns how the session
   * DAG is updated on disk.
   */
  rewriteTranscriptEntries?: (
    request: TranscriptRewriteRequest,
  ) => Promise<TranscriptRewriteResult> /** LLM completion capability for engines that need model inference. */;
  llm?: {
    complete: (params: LlmCompleteParams) => Promise<LlmCompleteResult>;
  };
};
/**
 * ContextEngine defines the pluggable contract for context management.
 *
 * Required methods define a generic lifecycle; optional methods allow engines
 * to provide additional capabilities (retrieval, lineage, etc.).
 */
interface ContextEngine {
  /** Engine identifier and metadata */
  readonly info: ContextEngineInfo;
  /**
   * Initialize engine state for a session, optionally importing historical context.
   */
  bootstrap?(params: {
    sessionId: string;
    sessionKey?: string /** Storage-neutral runtime session target for transcript/session SDK helpers. */;
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<BootstrapResult>;
  /**
   * Run transcript maintenance after bootstrap, successful turns, or compaction.
   *
   * Engines can use runtimeContext.rewriteTranscriptEntries() to request safe
   * branch-and-reappend transcript rewrites without depending on runner internals.
   */
  maintain?(params: {
    sessionId: string;
    sessionKey?: string /** Storage-neutral runtime session target for transcript/session SDK helpers. */;
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<ContextEngineMaintenanceResult>;
  /**
   * Ingest a single message into the engine's store.
   */
  ingest(params: {
    sessionId: string;
    sessionKey?: string;
    message: AgentMessage /** True when the message belongs to a heartbeat run. */;
    isHeartbeat?: boolean;
  }): Promise<IngestResult>;
  /**
   * Ingest a completed turn batch as a single unit.
   */
  ingestBatch?(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[] /** True when the batch belongs to a heartbeat run. */;
    isHeartbeat?: boolean;
  }): Promise<IngestBatchResult>;
  /**
   * Execute optional post-turn lifecycle work after a run attempt completes.
   * Engines can use this to persist canonical context and trigger background
   * compaction decisions.
   */
  afterTurn?(params: {
    sessionId: string;
    sessionKey?: string /** Storage-neutral runtime session target for transcript/session SDK helpers. */;
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    messages: AgentMessage[] /** Number of messages that existed before the prompt was sent. */;
    prePromptMessageCount: number /** Optional auto-compaction summary emitted by the runtime. */;
    autoCompactionSummary?: string /** True when this turn belongs to a heartbeat run. */;
    isHeartbeat?: boolean /** Optional model context token budget for proactive compaction. */;
    tokenBudget?: number /** Optional runtime-owned context for engines that need caller state. */;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<void>;
  /**
   * Assemble model context under a token budget.
   * Returns an ordered set of messages ready for the model.
   */
  assemble(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[];
    tokenBudget?: number /** Tool names available for this run so engines can align prompt guidance with runtime tool access. */;
    availableTools?: Set<string> /** Active memory citation mode when engines want to mirror memory prompt guidance. */;
    citationsMode?: MemoryCitationsMode;
    /** Current model identifier (e.g. "claude-opus-4", "gpt-4o", "qwen2.5-7b").
     *  Allows context engine plugins to adapt formatting per model. */
    model?: string /** The incoming user prompt for this turn (useful for retrieval-oriented engines). */;
    prompt?: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
  }): Promise<AssembleResult>;
  /**
   * Compact context to reduce token usage.
   * May create summaries, prune old turns, etc.
   *
   * The host always bounds this call with a finite safety timeout (the same
   * one that protects native runtime compaction). Engines that run long
   * operations SHOULD additionally honor `abortSignal` so an in-flight
   * compaction can be canceled promptly on run abort or host timeout instead
   * of running to completion in the background.
   */
  compact(params: {
    sessionId: string;
    sessionKey: string /** Caller-resolved owner agent for global session aliases. */;
    agentId?: string /** Storage-neutral runtime session target for delegated compaction. */;
    sessionTarget?: ContextEngineSessionTarget;
    tokenBudget?: number /** Force compaction even below the default trigger threshold. */;
    force?: boolean /** Optional live token estimate from the caller's active context. */;
    currentTokenCount?: number /** Controls convergence target; defaults to budget. */;
    compactionTarget?: "budget" | "threshold";
    customInstructions?: string /** Optional runtime-owned context for engines that need caller state. */;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
    /**
     * Optional abort signal honored before and during compaction. The host
     * aborts it on run-level abort or when its compaction safety timeout
     * fires; engines should stop work and reject promptly when it aborts.
     */
    abortSignal?: AbortSignal;
  }): Promise<CompactResult>;
  /**
   * Prepare context-engine-managed subagent state before the child run starts.
   *
   * Implementations can return a rollback handle that is invoked when spawn
   * fails after preparation succeeds.
   */
  prepareSubagentSpawn?(params: {
    parentSessionKey: string;
    childSessionKey: string;
    contextMode?: "isolated" | "fork";
    parentSessionId?: string;
    parentSessionFile?: string;
    childSessionId?: string;
    childSessionFile?: string;
    ttlMs?: number;
  }): Promise<SubagentSpawnPreparation | undefined>;
  /**
   * Notify the context engine that a subagent lifecycle ended.
   */
  onSubagentEnded?(params: { childSessionKey: string; reason: SubagentEndReason }): Promise<void>;
  /**
   * Dispose of any resources held by the engine.
   */
  dispose?(): Promise<void>;
}
//#endregion
//#region src/context-engine/registry.d.ts
/**
 * Runtime context passed to context engine factories during resolution.
 * Provides config and path information so plugins can initialize engines
 * without fragile workarounds.
 */
type ContextEngineFactoryContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
};
/**
 * A factory that creates a ContextEngine instance.
 * Supports async creation for engines that need DB connections etc.
 *
 * The factory receives a {@link ContextEngineFactoryContext} with runtime
 * environment context (config, paths). Existing no-arg factories remain
 * backward compatible because TypeScript permits assigning functions with
 * fewer parameters to wider signatures.
 */
type ContextEngineFactory = (
  ctx: ContextEngineFactoryContext,
) => ContextEngine | Promise<ContextEngine>;
type ContextEngineRegistrationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      existingOwner: string;
    };
/**
 * Public SDK entry point for third-party registrations.
 *
 * This path is intentionally unprivileged: it cannot claim core-owned ids and
 * it cannot safely refresh an existing registration because the caller's
 * identity is not authenticated.
 */
declare function registerContextEngine(
  id: string,
  factory: ContextEngineFactory,
): ContextEngineRegistrationResult;
/**
 * Return the trusted plugin id that registered a resolved context engine.
 */
declare function resolveContextEngineOwnerPluginId(
  engine: ContextEngine | undefined | null,
): string | undefined;
/**
 * Options for {@link resolveContextEngine}.
 */
type ResolveContextEngineOptions = {
  agentDir?: string;
  workspaceDir?: string;
};
/**
 * Resolve which ContextEngine to use based on plugin slot configuration.
 *
 * Resolution order:
 *   1. `config.plugins.slots.contextEngine` (explicit slot override)
 *   2. Default slot value ("legacy")
 *
 * When `config` is provided it is forwarded to the factory as part of a
 * {@link ContextEngineFactoryContext}. Additional runtime paths can be
 * supplied via `options`. Existing no-arg factories continue to work
 * because JavaScript permits extra arguments at call sites.
 *
 * Non-default engines that fail (unregistered, factory throw, or contract
 * violation) are logged and silently replaced by the default engine.
 * Throws only when the default engine itself cannot be resolved.
 */
declare function resolveContextEngine(
  config?: OpenClawConfig,
  options?: ResolveContextEngineOptions,
): Promise<ContextEngine>;
//#endregion
//#region src/plugins/compaction-provider.d.ts
/**
 * Compaction provider registry — process-global singleton.
 *
 * Plugins implement the CompactionProvider interface and register via
 * `registerCompactionProvider()`. The compaction safeguard checks this
 * registry before falling back to the built-in `summarizeInStages()`.
 */
/**
 * A pluggable compaction provider that can replace the built-in
 * summarizeInStages pipeline.
 */
type CompactionProviderSummarizationInstructions = {
  identifierPolicy?: "strict" | "off" | "custom";
  identifierInstructions?: string;
};
interface CompactionProvider {
  id: string;
  label: string;
  summarize(params: {
    messages: unknown[];
    signal?: AbortSignal;
    compressionRatio?: number;
    customInstructions?: string;
    summarizationInstructions?: CompactionProviderSummarizationInstructions /** Summary from a prior compaction round, if re-compacting. */;
    previousSummary?: string;
  }): Promise<string>;
}
//#endregion
//#region src/agents/current-time.d.ts
type CronStyleNow = {
  userTimezone: string;
  formattedTime: string;
  timeLine: string;
};
type TimeConfigLike = {
  agents?: {
    defaults?: {
      userTimezone?: string;
      timeFormat?: TimeFormatPreference;
    };
  };
};
/** Resolve localized and UTC current-time text for agent prompts. */
declare function resolveCronStyleNow(cfg: TimeConfigLike, nowMs: number): CronStyleNow;
declare function appendCronStyleCurrentTimeLine(
  text: string,
  cfg: TimeConfigLike,
  nowMs: number,
): string;
//#endregion
//#region src/agents/agent-settings.d.ts
declare const DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR = 20000;
//#endregion
//#region src/agents/memory-search.d.ts
type ResolvedMemorySearchConfig = {
  enabled: boolean;
  sources: Array<"memory" | "sessions">;
  extraPaths: string[];
  multimodal: MemoryMultimodalSettings;
  provider: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
    nonBatchConcurrency?: number;
    batch?: {
      enabled: boolean;
      wait: boolean;
      concurrency: number;
      pollIntervalMs: number;
      timeoutMinutes: number;
    };
  };
  experimental: {
    sessionMemory: boolean;
  };
  fallback: string;
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
  local: {
    modelPath?: string;
    modelCacheDir?: string;
    contextSize?: number | "auto";
  };
  store: {
    driver: "sqlite";
    databasePath: string;
    fts: {
      tokenizer: "unicode61" | "trigram";
    };
    vector: {
      enabled: boolean;
      extensionPath?: string;
    };
  };
  chunking: {
    tokens: number;
    overlap: number;
  };
  sync: {
    onSessionStart: boolean;
    onSearch: boolean;
    watch: boolean;
    watchDebounceMs: number;
    intervalMinutes: number;
    embeddingBatchTimeoutSeconds: number | undefined;
    sessions: {
      deltaBytes: number;
      deltaMessages: number;
      postCompactionForce: boolean;
    };
  };
  query: {
    maxResults: number;
    minScore: number;
    hybrid: {
      enabled: boolean;
      vectorWeight: number;
      textWeight: number;
      candidateMultiplier: number;
      mmr: {
        enabled: boolean;
        lambda: number;
      };
      temporalDecay: {
        enabled: boolean;
        halfLifeDays: number;
      };
    };
  };
  cache: {
    enabled: boolean;
    maxEntries?: number;
  };
};
type ResolvedMemorySearchSyncConfig = ResolvedMemorySearchConfig["sync"];
declare function resolveMemorySearchConfig(
  cfg: OpenClawConfig,
  agentId: string,
): ResolvedMemorySearchConfig | null;
declare function resolveMemorySearchSyncConfig(
  cfg: OpenClawConfig,
  agentId: string,
): ResolvedMemorySearchSyncConfig | null;
//#endregion
//#region src/auto-reply/heartbeat.d.ts
/** Default prompt for heartbeat turns when config does not override it. */
declare const HEARTBEAT_PROMPT =
  "Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.";
declare const DEFAULT_HEARTBEAT_ACK_MAX_CHARS = 300;
/** Resolves configured heartbeat prompt text with the built-in default fallback. */
declare function resolveHeartbeatPrompt(raw?: string): string;
type StripHeartbeatMode = "heartbeat" | "message";
/** Strips HEARTBEAT_OK acknowledgements and decides whether visible notification is needed. */
declare function stripHeartbeatToken(
  raw?: string,
  opts?: {
    mode?: StripHeartbeatMode;
    maxAckChars?: number;
  },
): {
  shouldSkip: boolean;
  text: string;
  didStrip: boolean;
};
//#endregion
//#region src/cli/progress.d.ts
type ProgressOptions = {
  label: string;
  indeterminate?: boolean;
  total?: number;
  enabled?: boolean;
  delayMs?: number;
  stream?: NodeJS.WriteStream;
  fallback?: "spinner" | "line" | "log" | "none";
};
/** Minimal progress API exposed to CLI work callbacks. */
type ProgressReporter = {
  setLabel: (label: string) => void;
  setPercent: (percent: number) => void;
  tick: (delta?: number) => void;
  done: () => void;
};
/** Completed/total progress update shape used by totals-based commands. */
type ProgressTotalsUpdate = {
  completed: number;
  total: number;
  label?: string;
};
/** Run async work with a progress reporter that is always stopped in finally. */
declare function withProgress<T>(
  options: ProgressOptions,
  work: (progress: ProgressReporter) => Promise<T>,
): Promise<T>;
/** Run async work with a progress reporter plus a completed/total update adapter. */
declare function withProgressTotals<T>(
  options: ProgressOptions,
  work: (update: (update: ProgressTotalsUpdate) => void, progress: ProgressReporter) => Promise<T>,
): Promise<T>;
//#endregion
//#region src/config/byte-size.d.ts
/**
 * Parse an optional byte-size value from config.
 * Accepts non-negative numbers or strings like "2mb".
 */
declare function parseNonNegativeByteSize(value: unknown): number | null;
//#endregion
//#region src/plugins/memory-embedding-provider-runtime.d.ts
/** Lists registered memory embedding provider adapters without registry metadata. */
declare function listRegisteredMemoryEmbeddingProviderAdapters(): MemoryEmbeddingProviderAdapter[];
/** Lists memory embedding providers from runtime config and registered adapters. */
declare function listMemoryEmbeddingProviders(
  cfg?: OpenClawConfig,
): MemoryEmbeddingProviderAdapter[];
/** Resolves one memory embedding provider by id, alias, or configured API owner. */
declare function getMemoryEmbeddingProvider(
  id: string,
  cfg?: OpenClawConfig,
): MemoryEmbeddingProviderAdapter | undefined;
//#endregion
//#region src/plugins/config-schema.d.ts
type BuildPluginConfigSchemaOptions = {
  uiHints?: Record<string, PluginConfigUiHint>;
  safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
type BuildJsonPluginConfigSchemaOptions = {
  cacheKey?: string;
  uiHints?: Record<string, PluginConfigUiHint>;
  safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
/** Build a plugin config schema from JSON Schema with runtime validation/default support. */
declare function buildJsonPluginConfigSchema(
  schema: JsonSchemaObject,
  options?: BuildJsonPluginConfigSchemaOptions,
): OpenClawPluginConfigSchema;
/** Build a plugin config schema from Zod, exporting JSON Schema when the Zod runtime supports it. */
declare function buildPluginConfigSchema(
  schema: ZodType,
  options?: BuildPluginConfigSchemaOptions,
): OpenClawPluginConfigSchema;
/** Return a schema for plugins that intentionally accept no config keys. */
declare function emptyPluginConfigSchema(): OpenClawPluginConfigSchema;
//#endregion
//#region src/utils/shell-argv.d.ts
/** Splits a shell-like argv string into tokens, returning null for unterminated quotes or escapes. */
declare function splitShellArgs(raw: string): string[] | null;
//#endregion
//#region packages/memory-host-sdk/src/host/fs-utils.d.ts
/** True for missing-file errors emitted by Node or fs-safe. */
declare function isFileMissingError(err: unknown): err is NodeJS.ErrnoException & {
  code: "ENOENT" | "ENOTDIR" | "not-found";
};
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-inputs.d.ts
/** Text part passed through embedding providers that support structured input. */
type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};
/** Inline binary payload encoded for providers with multimodal embedding support. */
type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};
/** Single structured embedding input part. */
type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;
/** Provider-facing input while preserving the plain text fallback. */
type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};
/** Return true when a chunk needs structured provider handling, not text splitting. */
declare function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings.types.d.ts
type EmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string, options?: EmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (texts: string[], options?: EmbeddingProviderCallOptions) => Promise<number[][]>;
  embedBatchInputs?: (
    inputs: EmbeddingInput[],
    options?: EmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};
type EmbeddingProviderCallOptions = {
  signal?: AbortSignal;
};
/** @public */
type EmbeddingProviderRequest = string;
/** @public */
type EmbeddingProviderFallback = string;
/** @public */
type GeminiTaskType =
  | "RETRIEVAL_QUERY"
  | "RETRIEVAL_DOCUMENT"
  | "SEMANTIC_SIMILARITY"
  | "CLASSIFICATION"
  | "CLUSTERING"
  | "QUESTION_ANSWERING"
  | "FACT_VERIFICATION";
type EmbeddingProviderOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: EmbeddingProviderRequest;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  fallback?: EmbeddingProviderFallback;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
    /**
     * Context size passed to node-llama-cpp `createEmbeddingContext`.
     * Default: 4096, chosen to cover typical memory-search chunks (128–512 tokens)
     * while keeping non-weight VRAM bounded.
     * Set `"auto"` to let node-llama-cpp use the model's trained maximum — not
     * recommended for 8B+ models (e.g. Qwen3-Embedding-8B: up to 40 960 tokens → ~32 GB VRAM).
     */
    contextSize?: number | "auto";
  } /** Provider-specific output vector dimensions for supported embedding families. */;
  outputDimensionality?: number /** Gemini: override the default task type sent with embedding requests. */;
  taskType?: GeminiTaskType;
};
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-defaults.d.ts
/** Default local embedding model used when config omits an explicit model. */
declare const DEFAULT_LOCAL_MODEL =
  "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings.d.ts
type LocalEmbeddingProviderRuntimeOptions = {
  workerScriptPath?: string;
  nodeLlamaCppImportUrl?: string;
};
declare function createLocalEmbeddingProvider(
  options: EmbeddingProviderOptions,
  runtimeOptions?: LocalEmbeddingProviderRuntimeOptions,
): Promise<EmbeddingProvider>;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-output.d.ts
type ReadEmbeddingBatchJsonlOptions<T> = {
  label: string;
  maxRecords: number;
  maxRecordBytes?: number;
  onRecord: (record: T) => boolean;
};
/** Stream bounded JSONL records without buffering the provider output file. */
declare function readEmbeddingBatchJsonl<T>(
  response: Response,
  options: ReadEmbeddingBatchJsonlOptions<T>,
): Promise<void>;
/** Minimal OpenAI-compatible embedding batch output line. */
type EmbeddingBatchOutputLine = {
  custom_id?: string;
  error?: {
    message?: string;
  } | null;
  response?: {
    status_code?: number;
    message?: string;
    body?:
      | {
          data?: Array<{
            embedding?: number[];
          }>;
          error?: {
            message?: string;
          };
        }
      | string;
  };
};
/** Apply one output line, collecting errors and successful embeddings by custom id. */
declare function applyEmbeddingBatchOutputLine(params: {
  line: EmbeddingBatchOutputLine;
  remaining: Set<string>;
  errors: string[];
  byCustomId: Map<string, number[]>;
}): void;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-error-utils.d.ts
/** Signals that a provider cannot run the configured embedding batch operation. */
declare class EmbeddingBatchUnavailableError extends Error {
  readonly code = "embedding_batch_unavailable";
  constructor(message: string, options?: ErrorOptions);
}
declare function isEmbeddingBatchUnavailableError(error: unknown): boolean;
/** Return the first useful error message from batch output lines. */
declare function extractBatchErrorMessage(lines: EmbeddingBatchOutputLine[]): string | undefined;
/** Redact and bound provider-controlled batch diagnostics before logging them. */
declare function formatBatchErrorDetail(detail: string | undefined): string | undefined;
/** Format a failed error-file read without hiding the underlying read problem. */
declare function formatUnavailableBatchError(err: unknown): string | undefined;
//#endregion
//#region packages/memory-host-sdk/src/host/ssrf-policy.d.ts
/** Host/network allowlist policy forwarded to the runtime SSRF guard. */
type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  hostnameAllowlist?: string[];
};
//#endregion
//#region packages/memory-host-sdk/src/host/batch-http.d.ts
/** POST JSON and retry provider 429/5xx failures with bounded backoff. */
declare function postJsonWithRetry<T>(params: {
  url: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  retryImpl?: typeof retryAsync;
  body: unknown;
  errorPrefix: string;
}): Promise<T>;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-provider-common.d.ts
/** Minimal provider batch status payload used by polling code. */
type EmbeddingBatchStatus = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};
/** Provider output line after an embedding batch file is read. */
type ProviderBatchOutputLine = EmbeddingBatchOutputLine;
/** OpenAI-compatible endpoint used inside embedding batch request lines. */
declare const EMBEDDING_BATCH_ENDPOINT = "/v1/embeddings";
//#endregion
//#region packages/memory-host-sdk/src/host/batch-runner.d.ts
/** Execution controls for provider embedding batch submissions and polling. */
type EmbeddingBatchExecutionParams = {
  wait: boolean;
  pollIntervalMs: number;
  timeoutMs: number;
  concurrency: number;
  debug?: (message: string, data?: Record<string, unknown>) => void;
};
type EmbeddingBatchGroupRunArgs<TRequest> = {
  group: TRequest[];
  groupIndex: number;
  groups: number;
  byCustomId: Map<string, number[]>;
  pollIntervalMs: number;
  timeoutMs: number;
};
type EmbeddingBatchSplitArgs<TRequest> = {
  error: unknown;
  group: TRequest[];
  parts: TRequest[][];
  groupIndex: number;
  groups: number;
  depth: number;
};
/** Run request groups with bounded concurrency and return embeddings by custom id. */
declare function runEmbeddingBatchGroups<TRequest>(params: {
  requests: TRequest[];
  maxRequests: number;
  maxJsonlBytes?: number;
  wait: EmbeddingBatchExecutionParams["wait"];
  pollIntervalMs: EmbeddingBatchExecutionParams["pollIntervalMs"];
  timeoutMs: EmbeddingBatchExecutionParams["timeoutMs"];
  concurrency: EmbeddingBatchExecutionParams["concurrency"];
  debugLabel: string;
  debug?: EmbeddingBatchExecutionParams["debug"];
  shouldSplitGroupOnError?: (error: unknown, group: TRequest[]) => boolean;
  onSplitGroup?: (args: EmbeddingBatchSplitArgs<TRequest>) => void;
  runGroup: (args: EmbeddingBatchGroupRunArgs<TRequest>) => Promise<void>;
}): Promise<Map<string, number[]>>;
/** Build normalized batch-group options for provider-specific runners. */
declare function buildEmbeddingBatchGroupOptions<TRequest>(
  params: {
    requests: TRequest[];
  } & EmbeddingBatchExecutionParams,
  options: {
    maxRequests: number;
    maxJsonlBytes?: number;
    debugLabel: string;
  },
): {
  requests: TRequest[];
  maxRequests: number;
  maxJsonlBytes: number | undefined;
  wait: boolean;
  pollIntervalMs: number;
  timeoutMs: number;
  concurrency: number;
  debug: ((message: string, data?: Record<string, unknown>) => void) | undefined;
  debugLabel: string;
};
//#endregion
//#region packages/memory-host-sdk/src/host/batch-status.d.ts
/** File ids returned once a batch has completed. */
type BatchCompletionResult = {
  outputFileId: string;
  errorFileId?: string;
};
/** Convert a completed provider status payload into output/error file ids. */
declare function resolveBatchCompletionFromStatus(params: {
  provider: string;
  batchId: string;
  status: EmbeddingBatchStatus;
}): BatchCompletionResult;
/** Fail a completed partial/all-error batch before requiring its success file. */
declare function throwIfBatchCompletionError(params: {
  provider: string;
  status: EmbeddingBatchStatus;
  readError: (errorFileId: string) => Promise<string | undefined>;
}): Promise<void>;
/** Throw when a provider reports a terminal failure, including error-file detail if available. */
declare function throwIfBatchTerminalFailure(params: {
  provider: string;
  status: EmbeddingBatchStatus;
  readError: (errorFileId: string) => Promise<string | undefined>;
}): Promise<void>;
/** Resolve the completed batch files, optionally waiting according to caller policy. */
declare function resolveCompletedBatchResult(params: {
  provider: string;
  status: EmbeddingBatchStatus;
  wait: boolean;
  waitForBatch: () => Promise<BatchCompletionResult>;
}): Promise<BatchCompletionResult>;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-utils.d.ts
/** Minimal HTTP client config needed by batch providers. */
type BatchHttpClientConfig = {
  baseUrl?: string;
  headers?: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
};
/** Normalize batch API base URLs by removing one trailing slash. */
declare function normalizeBatchBaseUrl(client: BatchHttpClientConfig): string;
/** Build request headers, preserving caller auth and controlling JSON/form content type. */
declare function buildBatchHeaders(
  client: Pick<BatchHttpClientConfig, "headers">,
  params: {
    json: boolean;
  },
): Record<string, string>;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-upload.d.ts
/** Upload embedding batch requests and return the provider file id. */
declare function uploadBatchJsonlFile(params: {
  client: BatchHttpClientConfig;
  requests: unknown[];
  errorPrefix: string;
  maxResponseBytes?: number;
  signal?: AbortSignal;
}): Promise<string>;
//#endregion
//#region packages/memory-host-sdk/src/host/hash.d.ts
/** SHA-256 hash helper for stable cache/content keys. */
declare function hashText(value: string): string;
//#endregion
//#region packages/memory-host-sdk/src/host/internal.d.ts
type MemoryFileEntry = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  dataHash?: string;
  kind?: "markdown" | "multimodal";
  contentText?: string;
  modality?: MemoryMultimodalModality;
  mimeType?: string;
};
type MemoryChunk = {
  startLine: number;
  endLine: number;
  text: string;
  hash: string;
  embeddingInput?: EmbeddingInput;
};
type MultimodalMemoryChunk = {
  chunk: MemoryChunk;
  structuredInputBytes: number;
};
declare function ensureMemoryHostDir(dir: string): string;
declare function normalizeExtraMemoryPaths(workspaceDir: string, extraPaths?: string[]): string[];
declare function listMemoryFiles(
  workspaceDir: string,
  extraPaths?: string[],
  multimodal?: MemoryMultimodalSettings,
): Promise<string[]>;
declare function buildFileEntry(
  absPath: string,
  workspaceDir: string,
  multimodal?: MemoryMultimodalSettings,
): Promise<MemoryFileEntry | null>;
declare function buildMultimodalChunkForIndexing(
  entry: Pick<
    MemoryFileEntry,
    "absPath" | "contentText" | "mimeType" | "kind" | "hash" | "size" | "dataHash"
  >,
): Promise<MultimodalMemoryChunk | null>;
declare function chunkMarkdown(
  content: string,
  chunking: {
    tokens: number;
    overlap: number;
  },
): MemoryChunk[];
/**
 * Remap chunk startLine/endLine from content-relative positions to original
 * source file positions using a lineMap.  Each entry in lineMap gives the
 * 1-indexed source line for the corresponding 0-indexed content line.
 *
 * This is used for session JSONL files where buildSessionEntry() flattens
 * messages into a plain-text string before chunking.  Without remapping the
 * stored line numbers would reference positions in the flattened text rather
 * than the original JSONL file.
 */
declare function remapChunkLines(chunks: MemoryChunk[], lineMap: number[] | undefined): void;
declare function parseEmbedding(raw: string): number[];
declare function cosineSimilarity(a: number[], b: number[]): number;
declare function runMemoryHostTasksWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
): Promise<T[]>;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-chunk-limits.d.ts
/**
 * Split text-only chunks to the provider's effective input limit.
 *
 * Structured multimodal chunks are preserved because only the provider can decide how to count
 * non-text parts.
 */
declare function enforceEmbeddingMaxInputTokens(
  provider: EmbeddingProvider,
  chunks: MemoryChunk[],
  hardMaxInputTokens?: number,
): MemoryChunk[];
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-provider-adapter-utils.d.ts
/** Detect missing API key errors from provider auth resolution. */
declare function isMissingEmbeddingApiKeyError(err: unknown): boolean;
/** Return stable cache headers after removing provider-specific secret headers. */
declare function sanitizeEmbeddingCacheHeaders(
  headers: Record<string, string>,
  excludedHeaderNames: string[],
): Array<[string, string]>;
/** Convert custom-id keyed batch embeddings back to request-index order. */
declare function mapBatchEmbeddingsByIndex(
  byCustomId: Map<string, number[]>,
  count: number,
): number[][];
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-vectors.d.ts
/** Replace invalid coordinates and L2-normalize non-empty vectors. */
declare function sanitizeAndNormalizeEmbedding(vec: number[]): number[];
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-debug.d.ts
/** Write embedding debug metadata when OPENCLAW_DEBUG_MEMORY_EMBEDDINGS is enabled. */
declare function debugEmbeddingsLog(message: string, meta?: Record<string, unknown>): void;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-model-normalize.d.ts
/** Trim a configured model id, fall back when empty, and strip known prefixes. */
declare function normalizeEmbeddingModelWithPrefixes(params: {
  model: string;
  defaultModel: string;
  prefixes: string[];
}): string;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-client.d.ts
/** Provider id used for remote embedding auth and config lookup. */
type RemoteEmbeddingProviderId = string;
/** Resolve base URL, bearer headers, header overrides, and SSRF policy for remote embeddings. */
declare function resolveRemoteEmbeddingBearerClient(params: {
  provider: RemoteEmbeddingProviderId;
  options: EmbeddingProviderOptions;
  defaultBaseUrl: string;
}): Promise<{
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
}>;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-provider.d.ts
/** HTTP client details required by a remote embedding provider. */
type RemoteEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  model: string;
};
/** Create an EmbeddingProvider backed by a remote embeddings endpoint. */
declare function createRemoteEmbeddingProvider(params: {
  id: string;
  client: RemoteEmbeddingClient;
  errorPrefix: string;
  maxInputTokens?: number;
}): EmbeddingProvider;
/** Resolve a normalized remote embedding client from provider config and model options. */
declare function resolveRemoteEmbeddingClient(params: {
  provider: RemoteEmbeddingProviderId;
  options: EmbeddingProviderOptions;
  defaultBaseUrl: string;
  normalizeModel: (model: string) => string;
}): Promise<RemoteEmbeddingClient>;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-fetch.d.ts
/** POST an embedding request and return validated vectors in provider response order. */
declare function fetchRemoteEmbeddingVectors(params: {
  url: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  signal?: AbortSignal;
  body: unknown;
  errorPrefix: string;
}): Promise<number[][]>;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-input-limits.d.ts
declare function estimateUtf8Bytes(text: string): number;
declare function estimateStructuredEmbeddingInputBytes(input: EmbeddingInput): number;
//#endregion
//#region packages/memory-host-sdk/src/host/remote-http.d.ts
/** Build an SSRF allow policy from a configured remote base URL. */
declare const buildRemoteBaseUrlPolicy: (baseUrl: string) => SsrFPolicy | undefined;
/** Execute a remote HTTP request under SSRF guard and always release the response handle. */
declare function withRemoteHttpResponse<T>(params: {
  url: string;
  init?: RequestInit;
  signal?: AbortSignal;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  fetchWithSsrFGuardImpl?: typeof fetchWithSsrFGuard;
  shouldUseEnvHttpProxyForUrlImpl?: typeof shouldUseEnvHttpProxyForUrl;
  auditContext?: string;
  onResponse: (response: Response) => Promise<T>;
}): Promise<T>;
//#endregion
//#region src/plugins/memory-embedding-providers.d.ts
/** Chunk submitted to memory embedding batch processing. */
type MemoryEmbeddingBatchChunk = {
  text: string;
  embeddingInput?: EmbeddingInput;
};
/** Options for batch memory embedding work. */
type MemoryEmbeddingBatchOptions = {
  agentId: string;
  chunks: MemoryEmbeddingBatchChunk[];
  wait: boolean;
  concurrency: number;
  pollIntervalMs: number;
  timeoutMs: number;
  debug: (message: string, data?: Record<string, unknown>) => void;
};
/** Per-call options for memory embedding providers. */
type MemoryEmbeddingProviderCallOptions = {
  signal?: AbortSignal;
};
/** Runtime metadata returned with memory embedding providers. */
type MemoryEmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<
    string,
    unknown
  > /** Prior persisted model/cache identities that are equivalent to the current identity. */;
  indexIdentityAliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
  sourceWideBatchEmbed?: boolean;
  batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};
/** Provider-owned canonical identity and exact aliases for persisted indexes. */
type MemoryEmbeddingProviderIndexIdentity = {
  model: string;
  cacheKeyData: Record<string, unknown>;
  aliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
};
/** Created memory embedding provider instance. */
type MemoryEmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string, options?: MemoryEmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (
    texts: string[],
    options?: MemoryEmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  embedBatchInputs?: (
    inputs: EmbeddingInput[],
    options?: MemoryEmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};
/** Options passed to memory embedding provider adapters. */
type MemoryEmbeddingProviderCreateOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
  fallback?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
    contextSize?: number | "auto";
  };
  outputDimensionality?: number;
  taskType?:
    | "RETRIEVAL_QUERY"
    | "RETRIEVAL_DOCUMENT"
    | "SEMANTIC_SIMILARITY"
    | "CLASSIFICATION"
    | "CLUSTERING"
    | "QUESTION_ANSWERING"
    | "FACT_VERIFICATION";
};
/** Result returned by a memory embedding provider adapter. */
type MemoryEmbeddingProviderCreateResult = {
  provider: MemoryEmbeddingProvider | null;
  runtime?: MemoryEmbeddingProviderRuntime;
};
/** Adapter contract for registered memory embedding providers. */
type MemoryEmbeddingProviderAdapter = {
  id: string;
  defaultModel?: string;
  transport?: "local" | "remote";
  authProviderId?: string;
  autoSelectPriority?: number;
  allowExplicitWhenConfiguredAuto?: boolean;
  supportsMultimodalEmbeddings?: (params: { model: string }) => boolean;
  resolveIndexIdentity?: (
    options: MemoryEmbeddingProviderCreateOptions,
  ) => MemoryEmbeddingProviderIndexIdentity;
  create: (
    options: MemoryEmbeddingProviderCreateOptions,
  ) => Promise<MemoryEmbeddingProviderCreateResult>;
  formatSetupError?: (err: unknown) => string;
  shouldContinueAutoSelection?: (err: unknown) => boolean;
};
/** Registered memory embedding provider with optional owning plugin metadata. */
type RegisteredMemoryEmbeddingProvider = {
  adapter: MemoryEmbeddingProviderAdapter;
  ownerPluginId?: string;
};
/** Registers a memory embedding provider adapter for the current process. */
declare function registerMemoryEmbeddingProvider(
  adapter: MemoryEmbeddingProviderAdapter,
  options?: {
    ownerPluginId?: string;
  },
): void;
/** Lists registered memory embedding provider entries. */
declare function listRegisteredMemoryEmbeddingProviders(): RegisteredMemoryEmbeddingProvider[];
/** Clears registered memory embedding providers. */
declare function clearMemoryEmbeddingProviders(): void;
//#endregion
//#region src/agents/agent-runtime-id.d.ts
/** Agent runtime id normalization and retired runtime-selection compatibility helpers. */
type EmbeddedAgentRuntime = "openclaw" | "auto" | (string & {});
/**
 * @deprecated Whole-agent runtime environment selection is retired. Use
 * provider/model runtime policy or a registered agent harness instead.
 */
declare function resolveEmbeddedAgentRuntime(_env?: NodeJS.ProcessEnv): EmbeddedAgentRuntime;
//#endregion
//#region src/tasks/agent-harness-task-runtime-scope.d.ts
type AgentHarnessTaskRuntimeScope = {
  readonly requesterSessionKey: string;
  readonly requesterOrigin?: DeliveryContext;
};
//#endregion
//#region src/agents/agent-tools.before-tool-call.state.d.ts
/** Consume and remove hook-adjusted params for a completed tool call. */
declare function consumeAdjustedParamsForToolCall(toolCallId: string, runId?: string): unknown;
/** Consume whether policy prevented the target tool from starting. */
declare function consumePreExecutionBlockedToolCall(toolCallId: string, runId?: string): boolean;
//#endregion
//#region src/agents/before-tool-call-metadata.d.ts
/** Return true when a tool already carries the before_tool_call wrapper marker. */
declare function isToolWrappedWithBeforeToolCallHook(tool: AnyAgentTool): boolean;
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
declare function setBeforeToolCallDiagnosticsEnabled(tool: AnyAgentTool, enabled: boolean): void;
//#endregion
//#region src/agents/agent-tools.before-tool-call.d.ts
type ToolOutcomeObservation = {
  toolName: string;
  argsHash: string;
  resultHash: string /** Monotonic model-call order within the owning embedded run. */;
  toolCallOrdinal?: number;
  terminalPresentation?: string;
  presentationOnly?: boolean;
};
type ToolOutcomeObserver = (observation: ToolOutcomeObservation) => void;
type HookContext = {
  agentId?: string;
  config?: OpenClawConfig /** Tool execution cwd for host-derived path facts. */;
  cwd?: string /** Host workspace used to resolve relative tool params for diagnostics only. */;
  workspaceDir?: string;
  sessionKey?: string /** Ephemeral session UUID — regenerated on /new and /reset. */;
  sessionId?: string;
  runId?: string /** Device-scoped operator session allowed to review approvals initiated by this run. */;
  approvalReviewerDeviceId?: string;
  trace?: DiagnosticTraceContext;
  channelId?: string /** Originating channel for approval delivery routing; mirrors exec approval turn-source fields. */;
  turnSourceChannel?: string;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
  loopDetection?: ToolLoopDetectionConfig;
  onToolOutcome?: ToolOutcomeObserver;
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
  skillsSnapshot?: SkillSnapshot;
  skillUsagePaths?: SkillUsagePath[];
  skillCommand?: {
    commandName: string;
    skillFile?: string;
    skillName: string;
    skillSource?: SkillTelemetrySource;
    toolName?: string;
  };
  sandbox?: {
    root: string;
    bridge: SandboxFsBridge;
  };
};
type HookBlockedReason = "plugin-before-tool-call" | "plugin-approval" | "tool-loop";
type BeforeToolCallFailureDisposition = "blocked" | DiagnosticToolTerminalReason;
type HookBlockedOutcome = {
  blocked: true;
  deniedReason?: HookBlockedReason;
  reason: string;
  params?: unknown;
};
type HookOutcome =
  | (HookBlockedOutcome & {
      kind: "veto";
    })
  | (HookBlockedOutcome & {
      kind: "failure";
      disposition: BeforeToolCallFailureDisposition;
    })
  | {
      blocked: false;
      params: unknown;
      approvalResolution?: PluginApprovalResolution;
      deferredApproval?: DeferredPluginToolApproval;
    };
type PluginApprovalRequest = NonNullable<PluginHookBeforeToolCallResult["requireApproval"]>;
type DeferredPluginToolApproval = {
  approval: PluginApprovalRequest;
  toolName: string;
  toolCallId?: string;
  ctx?: HookContext;
  baseParams: unknown;
  overrideParams?: unknown;
};
type BeforeToolCallPolicyDiagnosticState = {
  hasBeforeToolCallHook: boolean;
  trustedToolPolicies: Array<{
    id: string;
    pluginId: string;
    pluginName?: string;
  }>;
};
/** Return whether before_tool_call hooks or trusted policies are active. */
declare function getBeforeToolCallPolicyDiagnosticState(): BeforeToolCallPolicyDiagnosticState;
/** Return true when any before_tool_call policy could affect tool execution. */
declare function hasBeforeToolCallPolicy(): boolean;
/** Finalizes a trusted terminal summary after harness result middleware. */
declare function finalizeToolTerminalPresentation(params: {
  toolCallId: string;
  runId?: string;
  result: Awaited<ReturnType<AnyAgentTool["execute"]>>;
  isError: boolean;
  observer?: ToolOutcomeObserver;
  toolName?: string;
  toolCallOrdinal?: number;
}): void;
/** Return the closed terminal disposition carried by a before-tool failure. */
declare function getBeforeToolCallFailureDisposition(
  error: unknown,
): BeforeToolCallFailureDisposition | undefined;
/** Resolve a deferred plugin approval request at the later execution boundary. */
declare function requestDeferredPluginToolApproval(params: {
  deferredApproval: DeferredPluginToolApproval;
  signal?: AbortSignal;
}): Promise<HookOutcome>;
/** Run the full before_tool_call policy chain for a pending tool call. */
declare function runBeforeToolCallHook(args: {
  toolName: string;
  params: unknown;
  toolKind?: PluginHookToolKind;
  toolInputKind?: PluginHookToolInputKind;
  toolCallId?: string;
  ctx?: HookContext;
  signal?: AbortSignal;
  approvalMode?: "request" | "report" | "defer";
}): Promise<HookOutcome>;
/** Wrap a tool execute function with before_tool_call hooks and diagnostics. */
declare function wrapToolWithBeforeToolCallHook(
  tool: AnyAgentTool,
  ctx?: HookContext,
  options?: {
    approvalMode?: "request" | "report";
    emitDiagnostics?: boolean;
  },
): AnyAgentTool;
//#endregion
//#region src/agents/runtime-plan/types.d.ts
/** Runtime transport selected for one model attempt. */
type AgentRuntimeTransport = "sse" | "websocket" | "auto";
/** Thinking levels accepted by runtime-plan extra-param preparation. */
type AgentRuntimeThinkLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";
/** System prompt rendering mode selected for one attempt. */
type AgentRuntimePromptMode = "full" | "minimal" | "none";
/** Trigger source that can alter provider system prompt contributions. */
type AgentRuntimePromptTrigger = "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
/** Normalized failure reason used by model fallback classification. */
type AgentRuntimeFailoverReason =
  | "auth"
  | "auth_permanent"
  | "format"
  | "rate_limit"
  | "overloaded"
  | "billing"
  | "server_error"
  | "timeout"
  | "context_overflow"
  | "model_not_found"
  | "session_expired"
  | "empty_response"
  | "no_error_details"
  | "unclassified"
  | "unknown";
/** Provider/runtime config object passed through plugin boundaries. */
type AgentRuntimeConfig = unknown;
/** Provider model descriptor consumed by runtime-plan hooks. */
type AgentRuntimeModel = {
  id?: string;
  name?: string;
  api?: string;
  provider?: string;
  baseUrl?: string;
  reasoning?: boolean;
  input?: readonly string[];
  cost?: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  contextWindow?: number;
  maxTokens?: number;
  contextTokens?: number;
  compat?: unknown;
};
/** Text replacement rule used by provider input/output transforms. */
type AgentRuntimeTextReplacement = {
  from: string | RegExp;
  to: string;
};
/** Provider text transforms applied around model calls. */
type AgentRuntimeTextTransforms = {
  input?: AgentRuntimeTextReplacement[];
  output?: AgentRuntimeTextReplacement[];
};
/** Resolved provider runtime handle forwarded to plugin-owned hooks. */
type AgentRuntimeProviderHandle = {
  provider: string;
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  bundledProviderVitestCompat?: boolean;
};
type AgentRuntimeInteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
type AgentRuntimeMessagePresentationAction =
  | {
      type: "command";
      command: string;
    }
  | {
      type: "callback";
      value: string;
    }
  | {
      type: "approval";
      approvalId: string;
      approvalKind: "exec" | "plugin";
      decision: "allow-once" | "allow-always" | "deny";
    }
  | {
      type: "url";
      url: string;
    }
  | {
      type: "web-app";
      url: string;
    };
/** Portable action control exposed to agent runtime reply payloads. */
type AgentRuntimeMessagePresentationButton = {
  /** User-visible button label. */ label: string /** Typed action sent when pressed. */;
  action?: AgentRuntimeMessagePresentationAction /** @deprecated Use action. */;
  value?: string /** @deprecated Use an action with type "url". */;
  url?: string /** @deprecated Use an action with type "web-app". */;
  webApp?: {
    url: string;
  } /** @deprecated Use an action with type "web-app". */;
  web_app?: {
    url: string;
  } /** Higher values are kept first when channel action limits require dropping controls. */;
  priority?: number /** Disabled action hint; channels without disabled-state support render fallback text. */;
  disabled?: boolean /** Optional visual style hint for renderers that support styled actions. */;
  style?: AgentRuntimeInteractiveButtonStyle;
};
/** Portable select/menu option exposed to agent runtime reply payloads. */
type AgentRuntimeMessagePresentationOption = {
  /** User-visible option label. */ label: string /** Typed action sent when selected. */;
  action?: Extract<
    AgentRuntimeMessagePresentationAction,
    {
      type: "command" | "callback";
    }
  > /** @deprecated Use action. */;
  value?: string;
};
/**
 * @deprecated Use AgentRuntimeMessagePresentationButton.
 */
type AgentRuntimeInteractiveReplyButton = AgentRuntimeMessagePresentationButton;
/**
 * @deprecated Use AgentRuntimeMessagePresentationOption.
 */
type AgentRuntimeInteractiveReplyOption = AgentRuntimeMessagePresentationOption;
/**
 * @deprecated Use AgentRuntimeMessagePresentationBlock.
 */
type AgentRuntimeInteractiveReplyBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "buttons";
      buttons: AgentRuntimeInteractiveReplyButton[];
    }
  | {
      type: "select";
      placeholder?: string;
      options: AgentRuntimeInteractiveReplyOption[];
    };
/**
 * @deprecated Use AgentRuntimeMessagePresentation.
 */
type AgentRuntimeInteractiveReply = {
  blocks: AgentRuntimeInteractiveReplyBlock[];
};
/** Portable reply presentation severity/style hint. */
type AgentRuntimeMessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
type AgentRuntimeMessagePresentationChartBlock =
  | {
      type: "chart";
      chartType: "pie";
      title: string;
      segments: Array<{
        label: string;
        value: number;
      }>;
    }
  | {
      type: "chart";
      chartType: "bar" | "area" | "line";
      title: string;
      categories: string[];
      series: Array<{
        name: string;
        values: number[];
      }>;
      xLabel?: string;
      yLabel?: string;
    };
type AgentRuntimeMessagePresentationTableCell = string | number;
type AgentRuntimeMessagePresentationTableBlock = {
  type: "table";
  caption: string;
  headers: string[];
  rows: AgentRuntimeMessagePresentationTableCell[][];
  rowHeaderColumnIndex?: number;
};
/** Portable structured reply block rendered or downgraded by channels. */
type AgentRuntimeMessagePresentationBlock =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "context";
      text: string;
    }
  | {
      type: "divider";
    }
  | {
      type: "buttons";
      buttons: AgentRuntimeMessagePresentationButton[];
    }
  | {
      type: "select";
      placeholder?: string;
      options: AgentRuntimeMessagePresentationOption[];
    }
  | AgentRuntimeMessagePresentationChartBlock
  | AgentRuntimeMessagePresentationTableBlock;
/** Portable structured reply presentation for channel adapters. */
type AgentRuntimeMessagePresentation = {
  /** Optional short heading rendered before blocks when supported. */ title?: string /** Optional severity/status tone for renderers that support toned presentations. */;
  tone?: AgentRuntimeMessagePresentationTone /** Ordered portable blocks rendered or downgraded by channel adapters. */;
  blocks: AgentRuntimeMessagePresentationBlock[];
};
/** Delivery pin options attached to runtime reply payloads. */
type AgentRuntimeReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};
/** Delivery instructions attached to runtime reply payloads. */
type AgentRuntimeReplyPayloadDelivery = {
  pin?: boolean | AgentRuntimeReplyPayloadDeliveryPin;
};
type AgentRuntimeReplyPayloadLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
};
/** Portable reply payload emitted by agent runtimes before channel rendering. */
type AgentRuntimeReplyPayload = {
  text?: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  trustedLocalMedia?: boolean;
  sensitiveMedia?: boolean;
  presentation?: AgentRuntimeMessagePresentation;
  delivery?: AgentRuntimeReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   */
  interactive?: AgentRuntimeInteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean;
  audioAsVoice?: boolean;
  videoAsNote?: boolean;
  location?: AgentRuntimeReplyPayloadLocation;
  spokenText?: string;
  ttsSupplement?: {
    spokenText: string;
    visibleTextAlreadyDelivered?: boolean;
  };
  isError?: boolean;
  isReasoning?: boolean /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */;
  isCommentary?: boolean;
  isReasoningSnapshot?: boolean;
  isCompactionNotice?: boolean;
  isFallbackNotice?: boolean;
  isStatusNotice?: boolean;
  channelData?: Record<string, unknown>;
};
/** Stable section IDs for provider system prompt overrides. */
type AgentRuntimeSystemPromptSectionId = "interaction_style" | "tool_call_style" | "execution_bias";
/** Provider-owned system prompt contribution and section overrides. */
type AgentRuntimeSystemPromptContribution = {
  stablePrefix?: string;
  dynamicSuffix?: string;
  sectionOverrides?: Partial<Record<AgentRuntimeSystemPromptSectionId, string>>;
};
/** Context passed when resolving provider system prompt contributions. */
type AgentRuntimeSystemPromptContributionContext = {
  config?: AgentRuntimeConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  promptMode: AgentRuntimePromptMode;
  runtimeChannel?: string;
  runtimeCapabilities?: string[];
  agentId?: string;
  trigger?: AgentRuntimePromptTrigger;
};
/** Provider fallback route decision for follow-up delivery. */
type AgentRuntimeFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};
/** Tool-call id sanitizer mode for provider transcript policy. */
type AgentRuntimeToolCallIdMode = "strict" | "strict9";
/** Provider transcript sanitation, repair, and validation policy. */
type AgentRuntimeTranscriptPolicy = {
  sanitizeMode: "full" | "images-only";
  sanitizeToolCallIds: boolean;
  toolCallIdMode?: AgentRuntimeToolCallIdMode;
  duplicateToolCallIdStyle?: "openai";
  preserveNativeAnthropicToolUseIds: boolean;
  repairToolUseResultPairing: boolean;
  preserveSignatures: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  dropThinkingBlocks: boolean;
  dropReasoningFromHistory?: boolean;
  applyGoogleTurnOrdering: boolean;
  validateGeminiTurns: boolean;
  validateAnthropicTurns: boolean;
  allowSyntheticToolResults: boolean;
};
/** Classified model-call failure or success observation for fallback. */
type AgentRuntimeOutcomeClassification =
  | {
      message: string;
      reason?: AgentRuntimeFailoverReason;
      status?: number;
      code?: string;
      rawError?: string;
    }
  | {
      error: unknown;
    }
  | null
  | undefined;
/** Runtime hook that classifies run results for model fallback. */
type AgentRuntimeOutcomeClassifier = (params: {
  provider: string;
  model: string;
  result: unknown;
  hasDirectlySentBlockReply?: boolean;
  hasBlockReplyPipelineOutput?: boolean;
}) => AgentRuntimeOutcomeClassification;
/** Resolved provider/model/harness/transport reference for an attempt. */
type AgentRuntimeResolvedRef = {
  provider: string;
  modelId: string;
  modelApi?: string;
  harnessId?: string;
  transport?: AgentRuntimeTransport;
};
/** Concrete provider-owned route selected for one runtime attempt. */
type AgentRuntimeAuthModelRoute = {
  provider: string;
  modelId: string;
  api: ModelApi;
  baseUrl: string;
  authRequirement:
    | "api-key"
    | "subscription" /** Secret-free request behavior that the selected runtime must reproduce. */;
  requestTransportOverrides: ProviderRouteOverridePresence /** Provider-owned native-runtime compatibility for this concrete route. */;
  runtimePolicy?: ProviderModelRouteRuntimePolicy;
};
/** Common native-runtime support proven across every route left to the harness. */
type AgentRuntimeAuthDeferredRouteSupport = {
  requestTransportOverrides: ProviderRouteOverridePresence;
  runtimePolicy: ProviderModelRouteRuntimePolicy;
};
/** Auth forwarding decision for one runtime attempt. */
type AgentRuntimeAuthPlan = {
  providerForAuth: string /** Model whose order, cooldown, and route facts produced this plan. */;
  modelId?: string;
  authProfileProviderForAuth: string;
  harnessAuthProvider?: string /** Preferred or user-locked profile; automatic selection may not have resolved its secret yet. */;
  forwardedAuthProfileId?: string;
  forwardedAuthProfileSource?:
    | "auto"
    | "user" /** Ordered exhaustive candidates for the selected route; a singleton is terminal. */;
  forwardedAuthProfileCandidateIds?: string[] /** Exact selected credential/config mode; secret-free route materialization input. */;
  selectedAuthMode?: string /** Concrete provider-owned route selected before runtime dispatch. */;
  modelRoute?: AgentRuntimeAuthModelRoute /** Secret-free support shared by every route deferred to harness-owned auth. */;
  deferredRouteSupport?: AgentRuntimeAuthDeferredRouteSupport;
};
/** Prompt transforms and provider contribution hooks for one runtime attempt. */
type AgentRuntimePromptPlan = {
  provider: string;
  modelId: string;
  textTransforms?: AgentRuntimeTextTransforms;
  resolveSystemPromptContribution(
    context: AgentRuntimeSystemPromptContributionContext,
  ): AgentRuntimeSystemPromptContribution | undefined;
  transformSystemPrompt(
    context: AgentRuntimeSystemPromptContributionContext & {
      systemPrompt: string;
    },
  ): string;
};
/** Prepared plugin metadata snapshot kept opaque to runtime-plan consumers. */
type AgentRuntimePreparedMetadataSnapshot = object;
/** Prepared metadata loader used by tool planning without eager manifest reads. */
type PreparedOpenClawToolPlanning = {
  metadataSnapshot?: AgentRuntimePreparedMetadataSnapshot;
  loadMetadataSnapshot?: () => AgentRuntimePreparedMetadataSnapshot;
};
/** Tool normalization and diagnostics hooks for one runtime attempt. */
type AgentRuntimeToolPlan = {
  preparedPlanning?: PreparedOpenClawToolPlanning;
  normalize<TSchemaType extends TSchema = TSchema, TResult = unknown>(
    tools: AgentTool<TSchemaType, TResult>[],
    params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    },
  ): AgentTool<TSchemaType, TResult>[];
  logDiagnostics(
    tools: AgentTool[],
    params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    },
  ): void;
};
/** Delivery behavior hooks for one runtime attempt. */
type AgentRuntimeDeliveryPlan = {
  isSilentPayload(
    payload: Pick<
      AgentRuntimeReplyPayload,
      "text" | "mediaUrl" | "mediaUrls" | "presentation" | "interactive" | "channelData"
    >,
  ): boolean;
  resolveFollowupRoute(params: {
    payload: AgentRuntimeReplyPayload;
    originatingChannel?: string;
    originatingTo?: string;
    originRoutable: boolean;
    dispatcherAvailable: boolean;
  }): AgentRuntimeFollowupFallbackRouteResult | undefined;
};
/** Outcome classification hooks for one runtime attempt. */
type AgentRuntimeOutcomePlan = {
  classifyRunResult: AgentRuntimeOutcomeClassifier;
};
/** Extra transport parameter plan for one runtime attempt. */
type AgentRuntimeTransportPlan = {
  extraParams: Record<string, unknown>;
  resolveExtraParams(params?: {
    extraParamsOverride?: Record<string, unknown>;
    thinkingLevel?: AgentRuntimeThinkLevel;
    agentId?: string;
    workspaceDir?: string;
    model?: AgentRuntimeModel;
    resolvedTransport?: AgentRuntimeTransport;
  }): Record<string, unknown>;
};
/** Complete prepared runtime plan consumed by embedded-agent attempts. */
type AgentRuntimePlan = {
  resolvedRef: AgentRuntimeResolvedRef;
  providerRuntimeHandle?: AgentRuntimeProviderHandle;
  auth: AgentRuntimeAuthPlan;
  prompt: AgentRuntimePromptPlan;
  tools: AgentRuntimeToolPlan;
  transcript: {
    policy: AgentRuntimeTranscriptPolicy;
    resolvePolicy(params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    }): AgentRuntimeTranscriptPolicy;
  };
  delivery: AgentRuntimeDeliveryPlan;
  outcome: AgentRuntimeOutcomePlan;
  transport: AgentRuntimeTransportPlan;
  observability: {
    resolvedRef: string;
    provider: string;
    modelId: string;
    modelApi?: string;
    harnessId?: string;
    authProfileId?: string;
    transport?: AgentRuntimeTransport;
  };
};
/** Inputs needed to build the full prepared runtime plan. */
type BuildAgentRuntimePlanParams = {
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  model?: AgentRuntimeModel;
  modelApi?: string | null;
  harnessId?: string;
  harnessRuntime?: string;
  allowHarnessAuthProfileForwarding?: boolean /** Canonical route/auth decision prepared before attempt orchestration. */;
  preparedAuthPlan?: AgentRuntimeAuthPlan;
  authProfileProvider?: string;
  authProfileMode?: string;
  sessionAuthProfileId?: string;
  sessionAuthProfileSource?: "auto" | "user";
  sessionAuthProfileCandidateIds?: string[];
  authProfileStore?: AuthProfileStore;
  modelRoute?: AgentRuntimeAuthModelRoute;
  agentId?: string;
  thinkingLevel?: AgentRuntimeThinkLevel;
  extraParamsOverride?: Record<string, unknown>;
  resolvedTransport?: AgentRuntimeTransport;
  providerRuntimeHandle?: AgentRuntimeProviderHandle;
};
//#endregion
//#region src/agents/tool-mutation.d.ts
type FileTarget = {
  path?: string;
  oldpath?: string;
};
/** Return true only for tool calls whose structured contract proves replay safety. */
declare function isReplaySafeToolCall(toolName: string, args: unknown): boolean;
//#endregion
//#region src/agents/tool-error-summary.d.ts
type ToolErrorSummary = {
  toolName: string;
  meta?: string;
  errorCode?: string;
  error?: string;
  validationErrorSummary?: string;
  timedOut?: boolean;
  middlewareError?: boolean;
  mutatingAction?: boolean;
  actionFingerprint?: string;
  fileTarget?: FileTarget;
};
//#endregion
//#region src/agents/embedded-agent-runner/replay-state.d.ts
/**
 * Tracks whether an embedded run can be replayed after compaction or retry.
 */
type EmbeddedRunReplayState = {
  replayInvalid: boolean;
  hadPotentialSideEffects: boolean;
};
/** Serializable replay metadata stored with run results. */
type EmbeddedRunReplayMetadata = {
  hadPotentialSideEffects: boolean;
  replaySafe: boolean;
};
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.types.d.ts
/**
 * Route chosen before a model call when context pressure may require compaction or truncation.
 */
type PreemptiveCompactionRoute =
  | "fits"
  | "compact_only"
  | "truncate_tool_results_only"
  | "compact_then_truncate";
//#endregion
//#region src/agents/embedded-agent-runner/run/types.d.ts
type EmbeddedRunAttemptBase = Omit<
  RunEmbeddedAgentParams,
  | "provider"
  | "model"
  | "authProfileId"
  | "authProfileIdSource"
  | "thinkLevel"
  | "fastMode"
  | "lane"
  | "enqueue"
  | "sessionFile"
>;
type EmbeddedRunContextWindowInfo = {
  tokens: number;
  referenceTokens?: number;
  source: "model" | "modelsConfig" | "agentContextTokens" | "default";
};
type EmbeddedRunFastModeParam = boolean | (() => boolean | undefined);
/** Host-owned trajectory recorder supplied to plugin harnesses for attempt-local runtime events. */
type EmbeddedRunAttemptTrajectoryRecorder = {
  recordEvent: (type: string, data?: Record<string, unknown>) => void;
  flush: () => Promise<void>;
};
type EmbeddedRunAttemptParams = EmbeddedRunAttemptBase & {
  /** Active file-backed artifact target resolved by the run/session target seam. */ sessionFile: string;
  initialReplayState?: EmbeddedRunReplayState /** Pluggable context engine for ingest/assemble/compact lifecycle. */;
  contextEngine?: ContextEngine /** Resolved model context window in tokens for assemble/compact budgeting. */;
  contextTokenBudget?: number /** Source metadata for the resolved model context budget. */;
  contextWindowInfo?: EmbeddedRunContextWindowInfo /** Resolved API key for this run when runtime auth did not replace it. */;
  resolvedApiKey?: string /** Auth profile resolved for this attempt's provider/model call. */;
  authProfileId?: string /** Source for the resolved auth profile (user-locked or automatic). */;
  authProfileIdSource?: "auto" | "user";
  provider: string;
  modelId: string /** Operator-requested or initial model id before any fallback resolution. */;
  requestedModelId?:
    | string
    | null /** True when this attempt is running after a model fallback decision. */;
  fallbackActive?: boolean /** Concrete fallback reason that selected this attempt, when known. */;
  fallbackReason?:
    | string
    | null /** Concrete degraded-runtime reason for this attempt, when known. */;
  degradedReason?:
    | string
    | null /** Session-pinned embedded harness id. Prevents runtime hot-switching. */;
  agentHarnessId?: string /** Capture a local harness implementation only for setup/verified continuations. */;
  captureRuntimeArtifact?: boolean /** Exact implementation that must own the attempt before it creates a native thread. */;
  expectedRuntimeArtifact?: AgentHarnessRuntimeArtifactBinding /** OpenClaw-owned runtime policy prepared by the orchestrator for this attempt. */;
  runtimePlan?: AgentRuntimePlan /** Host-issued scope for harnesses that mirror native child runs into task state. */;
  agentHarnessTaskRuntimeScope?: AgentHarnessTaskRuntimeScope /** Storage-neutral trajectory target for harness-owned runtime trace artifacts. */;
  trajectorySessionFile?: string /** Storage-aware trajectory recorder owned by the OpenClaw host. */;
  trajectoryRecorder?: EmbeddedRunAttemptTrajectoryRecorder | null /** Live observer called after wrapped tool outcomes are recorded. */;
  onToolOutcome?: ToolOutcomeObserver /** Signals that the attempt's own run-timeout watchdog is active. */;
  onAttemptTimeoutArmed?: () => void /** Signals that this attempt's timeout has fired and must unwind promptly. */;
  onAttemptTimeout?: (
    reason: Error,
  ) => void /** Signals an explicit cancellation through the active native run handle. */;
  onAttemptAbort?: () => void /** Supplies run-global model-call ordering for parallel tool outcomes. */;
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
  model: Model;
  authStorage: AuthStorage /** Auth profile store already resolved during startup for this attempt. */;
  authProfileStore: AuthProfileStore;
  /**
   * Full auth profile store for OpenClaw tool availability.
   * Plugin-owned harnesses may scope `authProfileStore` to model transport credentials.
   */
  toolAuthProfileStore?: AuthProfileStore;
  modelRegistry: ModelRegistry$1;
  thinkLevel: ThinkLevel;
  fastMode?: EmbeddedRunFastModeParam /** True when this attempt is running the auto fast-mode policy. */;
  fastModeAuto?: boolean;
  beforeAgentStartResult?: PluginHookBeforeAgentStartResult;
  beforeAgentFinalizeRevisionAttempts?: number;
  maxBeforeAgentFinalizeRevisions?: number;
};
type EmbeddedRunAttemptResult = {
  aborted: boolean /** True when the runtime made the authoritative final-assistant transcript decision. */;
  assistantTranscriptOwned?: boolean /** True when the abort originated from the caller-provided abortSignal. */;
  externalAbort: boolean;
  timedOut: boolean /** True when the no-response LLM idle watchdog caused the timeout. */;
  idleTimedOut: boolean /** True if the timeout occurred while compaction was in progress or pending. */;
  timedOutDuringCompaction: boolean /** Optional because this type is re-exported as `AgentHarnessAttemptResult`. */;
  timedOutDuringToolExecution?: boolean;
  timedOutByRunBudget?: boolean;
  promptError: unknown;
  /**
   * Identifies which phase produced the promptError.
   * - "prompt": the LLM call itself failed and may be eligible for retry/fallback.
   * - "compaction": the prompt succeeded, but waiting for compaction/retry teardown was aborted;
   *   this must not be retried as a fresh prompt or the same tool turn can replay.
   * - "precheck": pre-prompt overflow recovery intentionally short-circuited the prompt so the
   *   outer run loop can recover via compaction/truncation before any model call is made.
   * - "hook:before_agent_run": a lifecycle hook blocked the run before the prompt was sent.
   * - null: no promptError.
   */
  promptErrorSource: "prompt" | "compaction" | "precheck" | "hook:before_agent_run" | null;
  preflightRecovery?:
    | {
        route: Exclude<PreemptiveCompactionRoute, "fits">;
        source?: "mid-turn";
        estimatedPromptTokens?: number;
        promptBudgetBeforeReserve?: number;
        overflowTokens?: number;
        handled: true;
        truncatedCount?: number;
      }
    | {
        route: Exclude<PreemptiveCompactionRoute, "fits">;
        source?: "mid-turn";
        estimatedPromptTokens?: number;
        promptBudgetBeforeReserve?: number;
        overflowTokens?: number;
        handled?: false;
      };
  sessionIdUsed: string;
  sessionFileUsed?: string;
  diagnosticTrace?: DiagnosticTraceContext;
  agentHarnessId?: string /** Exact credential material fingerprint reported by a harness-owned auth boundary. */;
  authBindingFingerprint?: string /** Exact local implementation used by a plugin-owned harness attempt. */;
  runtimeArtifact?: AgentHarnessRuntimeArtifactBinding;
  agentHarnessResultClassification?: "empty" | "reasoning-only" | "planning-only";
  promptTimeoutOutcome?: {
    message?: string;
    replayInvalid?: boolean;
    livenessState?: EmbeddedRunLivenessState;
    timeoutPhase?: AgentRunTimeoutPhase;
    providerStarted?: boolean;
  };
  codexAppServerFailure?: {
    kind: "client_closed_before_turn_completed" | "turn_completion_idle_timeout";
    turnWatchTimeoutKind?: "progress" | "completion" | "terminal";
    transport: "stdio" | "unix" | "websocket";
    threadId?: string;
    turnId?: string;
    replaySafe: boolean;
    replayBlockedReason?:
      | "assistant_output"
      | "tool_activity"
      | "potential_side_effect"
      | "active_item";
    diagnostics?: {
      idleMs?: number;
      timeoutMs?: number;
      lastActivityReason?: string;
      lastNotificationMethod?: string;
      lastNotificationItemId?: string;
      lastNotificationItemType?: string;
      lastNotificationItemRole?: string;
      lastAssistantTextPreview?: string;
      activeAppServerTurnRequests?: number;
      activeTurnItemCount?: number;
      terminalTurnNotificationQueued?: boolean;
      completionIdleWatchArmed?: boolean;
      assistantCompletionIdleWatchArmed?: boolean;
      terminalIdleWatchArmed?: boolean;
    };
  };
  bootstrapPromptWarningSignaturesSeen?: string[];
  bootstrapPromptWarningSignature?: string;
  systemPromptReport?: SessionSystemPromptReport;
  finalPromptText?: string;
  messagesSnapshot: AgentMessage[];
  beforeAgentFinalizeRevisionReason?: string;
  assistantTexts: string[];
  lastAssistantTextMessageIndex?: number;
  toolMetas: Array<{
    toolName: string;
    meta?: string;
    replaySafe?: boolean;
    isError?: boolean;
    asyncStarted?: boolean;
    asyncTaskRunId?: string;
    asyncTaskId?: string;
  }>;
  acceptedSessionSpawns?: AcceptedSessionSpawn[];
  lastAssistant: AssistantMessage | undefined;
  currentAttemptAssistant?: AssistantMessage | undefined;
  lastToolError?: ToolErrorSummary;
  didSendViaMessagingTool: boolean;
  didDeliverSourceReplyViaMessageTool?: boolean;
  didSendDeterministicApprovalPrompt?: boolean;
  messagingToolSentTexts: string[];
  messagingToolSentMediaUrls: string[];
  messagingToolSentTargets: MessagingToolSend[];
  messagingToolSourceReplyPayloads?: MessagingToolSourceReplyPayload[];
  heartbeatToolResponse?: HeartbeatToolResponse;
  toolMediaUrls?: string[];
  toolAudioAsVoice?: boolean;
  toolTrustedLocalMedia?: boolean;
  hasToolMediaBlockReply?: boolean;
  successfulCronAdds?: number;
  cloudCodeAssistFormatError: boolean;
  attemptUsage?: NormalizedUsage;
  promptCache?: ContextEnginePromptCacheInfo;
  contextBudgetStatus?: SessionContextBudgetStatus;
  compactionCount?: number;
  compactionTokensAfter?: number;
  /**
   * Client tool calls detected during this attempt (OpenResponses hosted
   * tools), in the order the underlying LLM emitted them. Field is
   * `undefined` when no client tools were called so existing truthiness
   * checks across the runner pipeline (`attempt.clientToolCalls ? ...`)
   * keep their meaning. When set, the array always has at least one entry.
   */
  clientToolCalls?: Array<{
    name: string;
    params: Record<string, unknown>;
  }> /** True when sessions_yield tool was called during this attempt. */;
  yieldDetected?: boolean;
  replayMetadata: EmbeddedRunReplayMetadata;
  /**
   * Replay metadata for this attempt before prior session state is accumulated.
   * Older harnesses may omit it and retain conservative cumulative retry gating.
   */
  currentAttemptReplayMetadata?: EmbeddedRunReplayMetadata;
  itemLifecycle: {
    startedCount: number;
    completedCount: number;
    activeCount: number;
  };
  setTerminalLifecycleMeta?: (meta: {
    replayInvalid?: boolean;
    livenessState?: EmbeddedRunLivenessState;
    stopReason?: string;
    yielded?: boolean;
    timeoutPhase?: AgentRunTimeoutPhase;
    providerStarted?: boolean;
    aborted?: boolean;
  }) => void;
};
//#endregion
//#region src/agents/embedded-agent-runner/compact.types.d.ts
type CompactEmbeddedAgentSessionParams = {
  sessionId: string;
  runId?: string;
  sessionKey?: string /** Storage-neutral transcript/session target. Defaults to sessionId/sessionKey/agentId. */;
  sessionTarget?: AgentRunSessionTarget /** Caller-resolved owner agent for global session aliases. */;
  agentId?: string /** Session key used only for runtime policy/sandbox resolution. Defaults to sessionKey. */;
  sandboxSessionKey?: string;
  messageChannel?: string;
  messageProvider?: string /** Capabilities declared by the gateway client that originated this run. */;
  clientCaps?: string[];
  chatType?: ChatType;
  agentAccountId?: string;
  currentChannelId?: string;
  currentThreadTs?: string;
  currentMessageId?:
    | string
    | number /** Trusted sender id from inbound context for scoped message-tool discovery. */;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  authProfileId?: string;
  authProfileIdSource?:
    | "auto"
    | "user" /** Host-resolved provider credential for native harness compaction. */;
  resolvedApiKey?: string /** Group id for channel-level tool policy resolution. */;
  groupId?:
    | string
    | null /** Group channel label (e.g. #general) for channel-level tool policy resolution. */;
  groupChannel?:
    | string
    | null /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */;
  groupSpace?: string | null /** Parent session key for subagent policy inheritance. */;
  spawnedBy?: string | null;
  sessionFile: string /** Optional caller-observed live prompt tokens used for compaction diagnostics. */;
  currentTokenCount?: number;
  workspaceDir: string /** Optional task working directory; workspaceDir remains the agent bootstrap workspace. */;
  cwd?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  skillsSnapshot?: SkillSnapshot;
  senderIsOwner?: boolean;
  provider?: string;
  model?: string /** Caller-resolved model/provider shape used by native harness compactors. */;
  runtimeModel?: Model /** Effective model fallback chain for this session attempt. Undefined uses config defaults. */;
  modelFallbacksOverride?: string[] /** Optional caller-resolved context engine for harness-owned compaction. */;
  contextEngine?: ContextEngine /** Optional caller-resolved token budget for harness-owned compaction. */;
  contextTokenBudget?: number /** Optional caller-resolved runtime context for harness-owned context-engine compaction. */;
  contextEngineRuntimeContext?: ContextEngineRuntimeContext /** Session-pinned embedded harness id. Prevents compaction hot-switching. */;
  agentHarnessId?: string /** Prevent compaction from changing the persisted session runtime or model. */;
  modelSelectionLocked?: boolean /** OpenClaw-owned runtime policy prepared for this compaction path. */;
  runtimePlan?: AgentRuntimePlan /** Host-prepared route and credential selection for native harness compaction. */;
  runtimeAuthPlan?: AgentRuntimeAuthPlan;
  thinkLevel?: ThinkLevel;
  reasoningLevel?: ReasoningLevel;
  execOverrides?: Pick<ExecToolDefaults, "host" | "security" | "ask" | "node" | "nodeCwd">;
  bashElevated?: ExecElevatedDefaults;
  customInstructions?: string;
  tokenBudget?: number;
  force?: boolean /** Force compaction because the caller already determined this turn must compact before prompt submission. */;
  forcePreflight?: boolean /** Alias for forcePreflight used by preflight budget gates. */;
  preflightRequired?: boolean /** Diagnostic trigger that made preflight compaction mandatory. */;
  preflightCompactionTrigger?: "tokens" | "transcript_bytes";
  trigger?: "budget" | "overflow" | "manual";
  /**
   * Preflight callers can allow native/current-session harness compaction but
   * move plugin-owned budget compaction onto background turn maintenance.
   */
  deferOwningContextEngineCompaction?: boolean;
  diagId?: string;
  attempt?: number;
  maxAttempts?: number;
  lane?: string;
  enqueue?: CommandQueueEnqueueFn;
  extraSystemPrompt?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  ownerNumbers?: string[];
  abortSignal?: AbortSignal;
  onCompactionHookMessages?: (payload: {
    phase: "before" | "after";
    messages: string[];
    sessionId: string;
    sessionKey: string;
  }) => void | Promise<void> /** Allow runtime plugins for this compaction to late-bind the gateway subagent. */;
  allowGatewaySubagentBinding?: boolean /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */;
  oneShotCliRun?: boolean;
};
//#endregion
//#region src/agents/harness/types.d.ts
type AgentHarnessPreparedAuthSupport = {
  source: "profile" | "direct" | "harness" | "none";
  mode?: string;
  requirement?: ProviderModelRouteAuthRequirement;
};
type AgentHarnessSupportContext = {
  provider: string;
  modelId?: string;
  modelProvider?: {
    api?: string;
    baseUrl?: string;
    azureApiVersion?: string /** Secret-free projection of request behavior a native harness must reproduce. */;
    requestTransportOverrides?: ProviderRouteOverridePresence /** Provider-owned native-runtime compatibility for the prepared route. */;
    runtimePolicy?: ProviderModelRouteRuntimePolicy /** Secret-free auth source the native runtime must reproduce for this attempt. */;
    preparedAuth?: AgentHarnessPreparedAuthSupport;
    request?: {
      auth?: {
        mode?: unknown;
      };
      proxy?: unknown;
      tls?: unknown;
      allowPrivateNetwork?: unknown;
    };
  };
  requestedRuntime: EmbeddedAgentRuntime;
  providerOwnerStatus?: "unowned" | "owned" | "ambiguous";
  providerOwnerPluginIds?: readonly string[];
};
type AgentHarnessSupport =
  | {
      supported: true;
      priority?: number;
      reason?: string;
    }
  | {
      supported: false;
      reason?: string;
    };
type InternalEmbeddedRunAttemptParams = EmbeddedRunAttemptParams;
type AgentHarnessAttemptParams = Omit<InternalEmbeddedRunAttemptParams, "trajectoryRecorder">;
type AgentHarnessAttemptResult = EmbeddedRunAttemptResult;
type AgentHarnessAuthBindingFingerprintParams = {
  authProfileId: string;
  authProfileStore: AuthProfileStore;
  agentDir: string;
  config?: OpenClawConfig;
};
type AgentHarnessSideQuestionParams = {
  cfg: OpenClawConfig;
  agentDir: string;
  provider: string;
  model: string;
  runtimeModel?: Model<Api> /** One atomic route/profile/store snapshot prepared before native dispatch. */;
  preparedRuntimeAuth: {
    plan: AgentRuntimeAuthPlan;
    authProfileStore: AuthProfileStore;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry$1 /** Resolved host credential for an immutable API-key route only. */;
    resolvedApiKey?: string;
  };
  question: string;
  sessionEntry: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey?: string;
  storePath?: string;
  resolvedThinkLevel?: ThinkLevel;
  resolvedReasoningLevel: ReasoningLevel;
  blockReplyChunking?: BlockReplyChunking;
  resolvedBlockStreamingBreak?: "text_end" | "message_end";
  opts?: GetReplyOptions;
  isNewSession: boolean;
  sessionId: string;
  sessionFile: string;
  sandboxSessionKey?: string;
  agentId?: string;
  workspaceDir?: string;
  messageChannel?: string;
  messageProvider?: string;
  chatType?: ChatType;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?: string | number;
  chatId?: string;
  messageActionTurnCapability?: string;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  memberRoleIds?: string[];
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  senderIsOwner?: boolean;
  currentChannelId?: string;
  toolsAllow?: string[];
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
};
type AgentHarnessSideQuestionResult = {
  text: string;
};
type AgentHarnessCompactParams = CompactEmbeddedAgentSessionParams;
type AgentHarnessCompactResult = EmbeddedAgentCompactResult;
type AgentHarnessResetParams = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  reason?: "new" | "reset" | "idle" | "daily" | "compaction" | "deleted" | "unknown";
};
type AgentHarnessResultClassification =
  | "ok"
  | NonNullable<AgentHarnessAttemptResult["agentHarnessResultClassification"]>;
type AgentHarnessDeliveryDefaults = {
  /**
   * @deprecated Prefer `messages.visibleReplies` / `messages.groupChat.visibleReplies`
   * config. Kept for existing harness plugins.
   */
  sourceVisibleReplies?: "automatic" | "message_tool";
};
type AgentHarnessRunCapability = {
  id: string;
  label: string;
  pluginId?: string;
  /**
   * Plugin ids this harness owner permits to execute its locked sessions.
   * Delegates receive work admission and execution only; session mutation stays owner-only.
   */
  delegatedExecutionPluginIds?: readonly string[];
  /**
   * Context-engine host capabilities provided by this harness during agent
   * runs. Harnesses that omit this are unsupported for engines that declare
   * host requirements.
   */
  contextEngineHostCapabilities?: readonly ContextEngineHostCapability[];
  deliveryDefaults?: AgentHarnessDeliveryDefaults;
  supports(
    ctx: AgentHarnessSupportContext,
  ): AgentHarnessSupport /** Lets this harness resolve forwarded profiles or its own native credentials. */;
  authBootstrap?: "harness";
  runAttempt(params: AgentHarnessAttemptParams): Promise<AgentHarnessAttemptResult>;
};
type AgentHarnessSideQuestionCapability = {
  runSideQuestion?(params: AgentHarnessSideQuestionParams): Promise<AgentHarnessSideQuestionResult>;
};
type AgentHarnessClassificationCapability = {
  classify?(
    result: AgentHarnessAttemptResult,
    ctx: AgentHarnessAttemptParams,
  ): AgentHarnessResultClassification | undefined;
};
type AgentHarnessCompactionCapability = {
  compact?(params: AgentHarnessCompactParams): Promise<AgentHarnessCompactResult | undefined>;
};
type AgentHarnessSessionLifecycleCapability = {
  reset?(params: AgentHarnessResetParams): Promise<void> | void;
  dispose?(): Promise<void> | void;
};
type AgentHarnessRuntimeArtifactCapability = {
  /** Revalidate an artifact only at setup and persistent-operation boundaries. */ runtimeArtifact?: {
    validate(binding: AgentHarnessRuntimeArtifactBinding): Promise<boolean>;
  };
};
type AgentHarnessAuthBindingCapability = {
  /** Recomputes the exact credential fingerprint at persistent trust boundaries. */ authBinding?: {
    fingerprint(params: AgentHarnessAuthBindingFingerprintParams): Promise<string | undefined>;
  };
};
type AgentHarness = AgentHarnessRunCapability &
  AgentHarnessSideQuestionCapability &
  AgentHarnessClassificationCapability &
  AgentHarnessCompactionCapability &
  AgentHarnessRuntimeArtifactCapability &
  AgentHarnessAuthBindingCapability &
  AgentHarnessSessionLifecycleCapability;
//#endregion
//#region src/realtime-transcription/provider-types.d.ts
type RealtimeTranscriptionProviderId = string;
type RealtimeTranscriptionProviderConfig = Record<string, unknown>;
type RealtimeTranscriptionProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeTranscriptionProviderConfig;
};
type RealtimeTranscriptionProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Callback hooks emitted by realtime transcription sessions. */
type RealtimeTranscriptionSessionCallbacks = {
  onPartial?: (partial: string) => void;
  onTranscript?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onError?: (error: Error) => void;
};
/** Inputs passed to a provider when creating a transcription session. */
type RealtimeTranscriptionSessionCreateRequest = RealtimeTranscriptionSessionCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Runtime control surface for a realtime transcription session. */
type RealtimeTranscriptionSession = {
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  close(): void;
  isConnected(): boolean;
};
//#endregion
//#region src/security/audit.types.d.ts
/** Severity levels emitted by security audit checks. */
type SecurityAuditSeverity = "info" | "warn" | "critical";
/** One actionable or informational security audit finding. */
type SecurityAuditFinding = {
  checkId: string;
  severity: SecurityAuditSeverity;
  title: string;
  detail: string;
  remediation?: string;
};
//#endregion
//#region src/talk/provider-types.d.ts
type RealtimeVoiceProviderId = string;
type RealtimeVoiceRole = "user" | "assistant";
type RealtimeVoiceCloseReason = "completed" | "error";
type RealtimeVoiceAudioFormat =
  | {
      encoding: "g711_ulaw";
      sampleRateHz: 8000;
      channels: 1;
    }
  | {
      encoding: "pcm16";
      sampleRateHz: 24000;
      channels: 1;
    };
declare const REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ: RealtimeVoiceAudioFormat;
declare const REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ: RealtimeVoiceAudioFormat;
type RealtimeVoiceTool = {
  type: "function";
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};
type RealtimeVoiceToolCallEvent = {
  itemId: string;
  callId: string;
  name: string;
  args: unknown;
};
type RealtimeVoiceToolResultOptions = {
  /**
   * Submit the tool result without prompting the realtime provider to generate a new assistant
   * response. Use when another channel has already delivered the user-visible answer.
   */
  suppressResponse?: boolean;
  willContinue?: boolean;
};
type RealtimeVoiceBridgeEvent = {
  direction: "client" | "server";
  type: string;
  detail?: string;
  itemId?: string;
  responseId?: string;
};
type RealtimeVoiceAudioClearReason = "barge-in";
type RealtimeVoiceBridgeCallbacks = {
  onAudio: (audio: Buffer) => void;
  onClearAudio: (reason?: RealtimeVoiceAudioClearReason) => void;
  onMark?: (markName: string) => void;
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
type RealtimeVoiceProviderConfig = Record<string, unknown>;
type RealtimeVoiceProviderCapabilities = {
  transports: TalkTransport[];
  inputAudioFormats: RealtimeVoiceAudioFormat[];
  outputAudioFormats: RealtimeVoiceAudioFormat[];
  supportsBrowserSession?: boolean;
  supportsBargeIn?: boolean /** True when provider VAD reports confirmed interruptions through onClearAudio("barge-in"). */;
  handlesInputAudioBargeIn?: boolean;
  supportsToolCalls?: boolean;
  supportsVideoFrames?: boolean;
  supportsSessionResumption?: boolean;
};
type RealtimeVoiceProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceBridgeCreateRequest = RealtimeVoiceBridgeCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  instructions?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  tools?: RealtimeVoiceTool[];
};
type RealtimeVoiceBrowserSessionCreateRequest = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
  instructions?: string;
  tools?: RealtimeVoiceTool[];
  model?: string;
  voice?: string;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  reasoningEffort?: string;
};
type RealtimeVoiceBrowserAudioContract = {
  inputEncoding: "pcm16" | "g711_ulaw";
  inputSampleRateHz: number;
  outputEncoding: "pcm16" | "g711_ulaw";
  outputSampleRateHz: number;
};
type RealtimeVoiceBrowserWebRtcSdpSession = {
  provider: RealtimeVoiceProviderId;
  transport: "webrtc";
  clientSecret: string;
  offerUrl?: string;
  offerHeaders?: Record<string, string>;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserJsonPcmWebSocketSession = {
  provider: RealtimeVoiceProviderId;
  transport: "provider-websocket";
  protocol: string;
  clientSecret: string;
  websocketUrl: string;
  audio: RealtimeVoiceBrowserAudioContract;
  initialMessage?: unknown;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserGatewayRelaySession = {
  provider: RealtimeVoiceProviderId;
  transport: "gateway-relay";
  relaySessionId: string;
  audio: RealtimeVoiceBrowserAudioContract;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserManagedRoomSession = {
  provider: RealtimeVoiceProviderId;
  transport: "managed-room";
  roomUrl: string;
  token?: string;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserSession =
  | RealtimeVoiceBrowserWebRtcSdpSession
  | RealtimeVoiceBrowserJsonPcmWebSocketSession
  | RealtimeVoiceBrowserGatewayRelaySession
  | RealtimeVoiceBrowserManagedRoomSession;
type RealtimeVoiceBridge = {
  supportsToolResultContinuation?: boolean /** False when the provider cannot accept a tool result without starting a response. */;
  supportsToolResultSuppression?: boolean;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(ts: number): void;
  sendUserMessage?(text: string): void;
  triggerGreeting?(instructions?: string): void;
  handleBargeIn?(options?: RealtimeVoiceBargeInOptions): void;
  /**
   * Returns void when submission completes synchronously, or a Promise that resolves at the
   * asynchronous completion boundary exposed by the provider and rejects on submission failure.
   */
  submitToolResult(
    callId: string,
    result: unknown,
    options?: RealtimeVoiceToolResultOptions,
  ): void | Promise<void>;
  acknowledgeMark(markName?: string): void;
  close(): void;
  isConnected(): boolean;
};
type RealtimeVoiceBargeInOptions = {
  /**
   * The caller has already confirmed assistant audio is still playing in its output sink.
   * This lets providers interrupt output even when the sink cannot provide real playback marks.
   */
  audioPlaybackActive?: boolean /** Interrupt even when normal barge-in audio-duration guards would treat the event as echo. */;
  force?: boolean;
};
//#endregion
//#region src/plugins/agent-tool-result-middleware-types.d.ts
type OpenClawAgentToolResult<TResult = unknown> = AgentToolResult<TResult>;
type AgentToolResultMiddlewareRuntime = "openclaw" | "codex";
/** @deprecated Use AgentToolResultMiddlewareRuntime. */
type AgentToolResultMiddlewareHarness = AgentToolResultMiddlewareRuntime | "codex-app-server";
type AgentToolResultMiddlewareEvent = {
  threadId?: string;
  turnId?: string;
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  cwd?: string;
  isError?: boolean;
  result: OpenClawAgentToolResult;
};
type AgentToolResultMiddlewareContext = {
  runtime: AgentToolResultMiddlewareRuntime /** @deprecated Use runtime. */;
  harness?: AgentToolResultMiddlewareRuntime;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};
type AgentToolResultMiddlewareResult = {
  result: OpenClawAgentToolResult;
};
type AgentToolResultMiddleware = (
  event: AgentToolResultMiddlewareEvent,
  ctx: AgentToolResultMiddlewareContext,
) => Promise<AgentToolResultMiddlewareResult | void> | AgentToolResultMiddlewareResult | void;
type AgentToolResultMiddlewareOptions = {
  runtimes?: AgentToolResultMiddlewareRuntime[] /** @deprecated Use runtimes. */;
  harnesses?: AgentToolResultMiddlewareHarness[];
};
//#endregion
//#region src/plugins/cli-backend.types.d.ts
type PluginTextReplacement = {
  from: string | RegExp;
  to: string;
};
type PluginTextTransforms = {
  /** Rewrites applied to outbound prompt text before provider/CLI transport. */ input?: PluginTextReplacement[] /** Rewrites applied to inbound assistant text before OpenClaw consumes it. */;
  output?: PluginTextReplacement[];
};
type CliBundleMcpMode = "claude-config-file" | "codex-config-overrides" | "gemini-system-settings";
type CliBackendPrepareExecutionContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  agentDir?: string;
  provider: string;
  modelId: string /** Effective OpenClaw context budget selected for this run. */;
  contextTokenBudget?: number;
  authProfileId?: string;
  executionMode?: CliBackendExecutionMode;
};
type CliBackendPreparedExecution = {
  env?: Record<string, string>;
  clearEnv?: string[];
  /**
   * Backend-owned staging that must run after the core CLI queue admits the turn.
   * Use this for mutable per-profile CLI homes that the launched process also owns.
   */
  beforeExecution?: () => Promise<void>;
  cleanup?: () => Promise<void>;
};
type CliBackendThinkingLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";
type CliBackendExecutionMode = "agent" | "side-question";
/** Host-isolated tool grant for a CLI run with every native tool disabled. */
type CliBackendToolAvailability = {
  native: readonly [] /** MCP tools already isolated by the host transport that may be auto-approved. */;
  mcp: readonly string[];
};
type CliBackendResolveExecutionArgsContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  provider: string;
  modelId: string;
  authProfileId?: string;
  thinkingLevel?: CliBackendThinkingLevel;
  executionMode?: CliBackendExecutionMode;
  toolAvailability?: CliBackendToolAvailability;
  useResume: boolean;
  baseArgs: readonly string[];
};
type CliBackendResolveExecutionArgs = (
  ctx: CliBackendResolveExecutionArgsContext,
) => readonly string[] | null | undefined;
type CliBackendAuthEpochMode = "combined" | "profile-only";
type CliBackendNativeToolMode = "none" | "always-on" | "selectable";
type CliBackendSideQuestionToolMode = "disabled";
type CliBackendNormalizeConfigContext = {
  config?: OpenClawConfig;
  backendId: string;
  agentId?: string;
};
/** Backend-owned implementation boundary for script-backed CLI executables. */
type CliBackendRuntimeArtifactPolicy = Readonly<{
  kind: "bundled-package-tree" /** Exact package.json name whose complete installed tree owns inference. */;
  packageName: string /** Only the command itself may be the package entrypoint. */;
  entrypoint: "command" /** Canonical basenames allowed when this backend ships a self-contained native build. */;
  nativeExecutableNames?: readonly string[];
}>;
/** Plugin-owned CLI backend defaults used by the text-only CLI runner. */
type CliBackendPlugin = {
  /** Provider id used in model refs, for example `claude-cli/opus`. */ id: string /** Canonical model provider whose models this CLI backend can execute. */;
  modelProvider?: string /** Default backend config before user overrides from `agents.defaults.cliBackends`. */;
  config: CliBackendConfig;
  /**
   * Context-engine host capabilities provided by this backend when it is
   * driven through the generic CLI runner.
   */
  contextEngineHostCapabilities?: readonly ContextEngineHostCapability[];
  /**
   * Backend-owned compaction for non-harness CLI sessions.
   * Set only when the backend bounds its own transcript and persists resumable state.
   */
  ownsNativeCompaction?: boolean;
  /**
   * Optional live-smoke metadata owned by the backend plugin.
   *
   * Keep provider-specific test wiring here instead of scattering it across
   * Docker wrappers, docs, and gateway live tests.
   */
  liveTest?: {
    defaultModelRef?: string;
    defaultImageProbe?: boolean;
    defaultMcpProbe?: boolean;
    docker?: {
      npmPackage?: string;
      binaryName?: string;
    };
  } /** Required whenever this backend can become a verified inference owner. */;
  runtimeArtifact?: CliBackendRuntimeArtifactPolicy;
  /**
   * Whether OpenClaw should inject bundle MCP config for this backend.
   *
   * Keep this opt-in. Only backends that explicitly consume OpenClaw's bundle
   * MCP bridge should enable it.
   */
  bundleMcp?: boolean;
  /**
   * Provider-owned bundle MCP integration strategy.
   *
   * Different CLIs wire MCP through different surfaces:
   * - Claude: `--strict-mcp-config --mcp-config`
   * - Codex: `-c mcp_servers=...`
   * - Gemini: system-level `settings.json`
   */
  bundleMcpMode?: CliBundleMcpMode;
  /**
   * Optional config normalizer applied after user overrides merge.
   *
   * Use this for backend-specific compatibility rewrites when old config
   * shapes need to stay working.
   */
  normalizeConfig?: (
    config: CliBackendConfig,
    context?: CliBackendNormalizeConfigContext,
  ) => CliBackendConfig;
  /**
   * Backend-owned final system-prompt transform.
   *
   * Use this for tiny CLI-specific compatibility rewrites without replacing
   * the generic CLI runner or prompt builder.
   */
  transformSystemPrompt?: (ctx: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    provider: string;
    modelId: string;
    modelDisplay: string;
    agentId?: string;
    systemPrompt: string;
  }) => string | null | undefined;
  /**
   * Backend-owned bidirectional text replacements.
   *
   * `input` applies to the system prompt and user prompt passed to the CLI.
   * `output` applies to parsed/streamed assistant text from the CLI.
   */
  textTransforms?: PluginTextTransforms;
  /**
   * Preferred auth-profile id when the caller did not explicitly lock one.
   *
   * Use this when the backend should consume a canonical OpenClaw auth profile
   * rather than ambient host auth by default.
   */
  defaultAuthProfileId?: string;
  /**
   * Session/auth epoch source policy.
   *
   * `combined` keeps the legacy "host credential + auth profile" fingerprint.
   * `profile-only` treats the selected OpenClaw auth profile as the sole auth
   * owner for session invalidation when one is present.
   */
  authEpochMode?: CliBackendAuthEpochMode;
  /**
   * Whether `prepareExecution` may auto-select a configured auth profile.
   *
   * Defaults to true for auth bridges. Set false for environment/config-only
   * hooks that do not consume OpenClaw auth profiles.
   */
  autoSelectAuthProfile?: boolean;
  /**
   * Backend-owned execution bridge.
   *
   * Use this on async run paths when the backend needs a generated auth/config
   * bridge (for example a private CLI home directory) without teaching the core
   * runner about provider-specific file formats.
   */
  prepareExecution?: (
    ctx: CliBackendPrepareExecutionContext,
  ) =>
    | Promise<CliBackendPreparedExecution | null | undefined>
    | CliBackendPreparedExecution
    | null
    | undefined;
  /**
   * Backend-owned per-run argv rewrite.
   *
   * Use this for request-scoped CLI dialect flags that should not be modeled
   * as static config, such as mapping OpenClaw thinking levels to a backend's
   * native effort flag.
   */
  resolveExecutionArgs?: CliBackendResolveExecutionArgs;
  /**
   * Whether this CLI backend can expose native tools outside OpenClaw's tool
   * catalog. `selectable` backends must enforce `toolAvailability` through
   * `resolveExecutionArgs`; `always-on` backends fail closed for restricted
   * callers.
   */
  nativeToolMode?: CliBackendNativeToolMode;
  /**
   * Side-question native tool behavior.
   *
   * Set to `disabled` only when `executionMode: "side-question"` reliably
   * launches the CLI without native tools, even if normal agent turns expose
   * backend-owned tools.
   */
  sideQuestionToolMode?: CliBackendSideQuestionToolMode;
};
//#endregion
//#region src/plugins/codex-app-server-extension-types.d.ts
/** Tool-result event emitted to Codex app-server plugin extensions. */
type CodexAppServerToolResultEvent = {
  threadId: string;
  turnId: string;
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result: AgentToolResult<unknown>;
};
/** Session context passed with Codex app-server extension events. */
type CodexAppServerExtensionContext = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};
/** Optional replacement result returned by a Codex app-server extension handler. */
type CodexAppServerToolResultHandlerResult = {
  result: AgentToolResult<unknown>;
};
/** Runtime event surface exposed to Codex app-server extension factories. */
type CodexAppServerExtensionRuntime = {
  on: (
    event: "tool_result",
    handler: (
      event: CodexAppServerToolResultEvent,
      ctx: CodexAppServerExtensionContext,
    ) =>
      | Promise<CodexAppServerToolResultHandlerResult | void>
      | CodexAppServerToolResultHandlerResult
      | void,
  ) => void;
};
/** Factory signature for Codex app-server plugin extensions. */
type CodexAppServerExtensionFactory = (
  runtime: CodexAppServerExtensionRuntime,
) => Promise<void> | void;
//#endregion
//#region src/plugins/host-hooks.d.ts
/** Reason passed to plugin cleanup callbacks when host-owned state changes. */
type PluginHostCleanupReason = "disable" | "reset" | "delete" | "restart";
type PluginSessionExtensionProjectionContext = {
  sessionKey: string;
  sessionId?: string;
  state: PluginJsonValue | undefined;
};
/** Session extension registration owned by a plugin namespace. */
type PluginSessionExtensionRegistration = {
  namespace: string;
  description: string;
  project?: (ctx: PluginSessionExtensionProjectionContext) => PluginJsonValue | undefined;
  cleanup?: (ctx: { reason: PluginHostCleanupReason; sessionKey?: string }) => void | Promise<void>;
  /**
   * When set, after every successful `patchSessionExtension` the projected
   * value is mirrored to `SessionEntry[<slotKey>]` so non-plugin readers
   * can consume the typed slot without reaching into
   * `pluginExtensions[pluginId][namespace]`.
   *
   * The slot is a read-only mirror: writes always go through
   * `patchSessionExtension`; the host overwrites the slot value on every
   * subsequent patch.
   */
  sessionEntrySlotKey?: string;
  /**
   * Optional JSON-compatible schema describing the projected slot value.
   * Purely informational at this layer; clients may use it to validate the
   * mirrored slot against a contract.
   */
  sessionEntrySlotSchema?: PluginJsonValue;
};
type PluginSessionExtensionProjection = {
  pluginId: string;
  namespace: string;
  value: PluginJsonValue;
};
type PluginToolPolicyDecision =
  | PluginHookBeforeToolCallResult
  | {
      allow?: boolean;
      reason?: string;
    };
type PluginTrustedToolPolicyRegistration = {
  id: string;
  description: string;
  evaluate: (
    event: PluginHookBeforeToolCallEvent,
    ctx: PluginHookToolContext,
  ) => PluginToolPolicyDecision | void | Promise<PluginToolPolicyDecision | void>;
};
type PluginToolMetadataRegistration = {
  toolName: string;
  displayName?: string;
  description?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};
type PluginControlUiTabGroup = "control" | "agent";
type PluginControlUiDescriptor = {
  id: string /** "tab" adds a Control UI sidebar tab; other surfaces attach to existing views. */;
  surface: "session" | "tool" | "run" | "settings" | "tab";
  label: string;
  description?: string;
  placement?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[] /** Icon name hint for tab descriptors; unknown names fall back to a generic icon. */;
  icon?: string;
  /**
   * Gateway HTTP path (e.g. /plugins/<id>/panel) rendered in a sandboxed frame
   * when the Control UI has no bundled view for this tab.
   */
  path?: string /** Sidebar group for tab descriptors; defaults to "control". */;
  group?: PluginControlUiTabGroup /** Sort order among plugin tabs; lower renders first. */;
  order?: number;
};
type PluginSessionActionContext = {
  pluginId: string;
  actionId: string;
  sessionKey?: string;
  payload?: PluginJsonValue;
  client?: {
    connId?: string;
    scopes: string[];
  };
};
type PluginSessionActionResult =
  | {
      ok?: true;
      result?: PluginJsonValue;
      reply?: PluginJsonValue;
      continueAgent?: boolean;
    }
  | {
      ok: false;
      error: string;
      code?: string;
      details?: PluginJsonValue;
    };
type PluginSessionActionRegistration = {
  id: string;
  description?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  handler: (
    ctx: PluginSessionActionContext,
  ) => PluginSessionActionResult | void | Promise<PluginSessionActionResult | void>;
};
type PluginRuntimeLifecycleRegistration = {
  id: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
  }) => void | Promise<void>;
};
type PluginAgentEventSubscriptionRegistration = {
  id: string;
  description?: string;
  streams?: AgentEventStream[];
  handle: (
    event: AgentEventPayload,
    ctx: {
      getRunContext: <T extends PluginJsonValue = PluginJsonValue>(
        namespace: string,
      ) => T | undefined;
      setRunContext: (namespace: string, value: PluginJsonValue) => void;
      clearRunContext: (namespace?: string) => void;
    },
  ) => void | Promise<void>;
};
type PluginAgentEventEmitParams = {
  runId: string;
  stream: AgentEventStream;
  data: PluginJsonValue;
  sessionKey?: string;
};
type PluginAgentEventEmitResult =
  | {
      emitted: true;
      stream: AgentEventStream;
    }
  | {
      emitted: false;
      reason: string;
    };
type PluginRunContextPatch = {
  runId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};
type PluginRunContextGetParams = {
  runId: string;
  namespace: string;
};
type PluginSessionSchedulerJobRegistration = {
  id: string;
  sessionKey: string;
  kind: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey: string;
    jobId: string;
  }) => void | Promise<void>;
};
type PluginSessionSchedulerJobHandle = {
  id: string;
  pluginId: string;
  sessionKey: string;
  kind: string;
};
type PluginSessionAttachmentFile = {
  path: string;
};
type PluginAttachmentChannelHints = {
  telegram?: {
    parseMode?: "HTML";
    disableNotification?: boolean;
    /**
     * Require host-side detection to match this MIME before forcing document delivery.
     * Mismatched files are rejected before the outbound adapter is called.
     */
    forceDocumentMime?: string;
  };
  slack?: {
    threadTs?: string;
  };
};
type PluginSessionAttachmentCaptionFormat = "plain" | "html" | "markdown";
type PluginSessionAttachmentParams = {
  sessionKey: string;
  files: PluginSessionAttachmentFile[];
  text?: string;
  threadId?: string | number;
  forceDocument?: boolean;
  maxBytes?: number;
  captionFormat?: PluginSessionAttachmentCaptionFormat;
  channelHints?: PluginAttachmentChannelHints;
};
type PluginSessionAttachmentResult =
  | {
      ok: true;
      channel: string;
      deliveredTo: string;
      count: number;
    }
  | {
      ok: false;
      error: string;
    };
type PluginSessionTurnScheduleCommonParams = {
  sessionKey: string;
  message: string;
  agentId?: string;
  deliveryMode?: "none" | "announce";
  name?: string /** Optional cleanup tag. Reserved cron-name delimiters like `:` are rejected. */;
  tag?: string;
};
type PluginSessionTurnScheduleParams =
  | ({
      at: string | number | Date;
      deleteAfterRun?: boolean;
    } & PluginSessionTurnScheduleCommonParams)
  | ({
      delayMs: number;
      deleteAfterRun?: boolean;
    } & PluginSessionTurnScheduleCommonParams)
  | ({
      cron: string;
      tz?: string;
      deleteAfterRun?: false;
    } & PluginSessionTurnScheduleCommonParams);
type PluginSessionTurnUnscheduleByTagParams = {
  sessionKey: string;
  tag: string;
};
type PluginSessionTurnUnscheduleByTagResult = {
  removed: number;
  failed: number;
};
//#endregion
//#region src/plugins/logger-types.d.ts
/** Logger passed into plugin registration, services, and CLI surfaces. */
type PluginLogger = {
  debug?: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
//#endregion
//#region src/plugins/provider-config-context.types.d.ts
/**
 * Provider-owned config normalization for `models.providers.<id>` entries.
 *
 * Use this for provider-specific config cleanup that should stay with the
 * plugin rather than in core config-policy tables.
 */
type ProviderNormalizeConfigContext = {
  provider: string;
  providerConfig: ModelProviderConfig;
};
/**
 * Provider-owned env/config auth marker resolution for `models.providers`.
 *
 * Use this when a provider resolves auth from env vars that do not follow the
 * generic API-key conventions.
 */
type ProviderResolveConfigApiKeyContext = {
  provider: string;
  env: NodeJS.ProcessEnv;
};
/**
 * Provider-owned config-default application input.
 *
 * Use this when a provider needs to add global config defaults that depend on
 * provider auth mode or provider-specific model families.
 */
type ProviderApplyConfigDefaultsContext = {
  provider: string;
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
};
//#endregion
//#region src/plugins/provider-oauth-flow.d.ts
/** Prompt payload used when OAuth flow code entry needs user input. */
type OAuthPrompt = {
  message: string;
  placeholder?: string;
};
/** Creates OAuth callbacks that use local browser auth locally and manual code entry on VPS hosts. */
declare function createVpsAwareOAuthHandlers(params: {
  isRemote: boolean;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  spin: ReturnType<WizardPrompter["progress"]>;
  openUrl: (url: string) => Promise<unknown>;
  localBrowserMessage: string;
  manualPromptMessage?: string;
}): {
  onAuth: (event: { url: string }) => Promise<void>;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
};
//#endregion
//#region src/auto-reply/reply/abort.runtime-types.d.ts
/** Result from the fast abort path before normal reply dispatch starts. */
type FastAbortResult = {
  handled: boolean;
  aborted: boolean;
  rejectionReason?: "finalizing";
  stoppedSubagents?: number;
};
/** Runtime hook that may convert a message into an immediate abort action. */
type TryFastAbortFromMessage = (params: {
  ctx: FinalizedMsgContext;
  cfg: OpenClawConfig;
}) => Promise<FastAbortResult>;
/** Formats the user-visible abort acknowledgement text. */
type FormatAbortReplyText = (
  stoppedSubagents?: number,
  rejectionReason?: FastAbortResult["rejectionReason"],
) => string;
//#endregion
//#region src/agents/bash-tools.process.d.ts
/** Defaults injected by tests, agent scopes, and scoped process registries. */
type ProcessToolDefaults = {
  cleanupMs?: number;
  hasCronTool?: boolean;
  inputWaitIdleMs?: number;
  scopeKey?: string;
};
//#endregion
//#region src/agents/bootstrap-files.d.ts
type BootstrapContextMode = "full" | "lightweight";
/** Resolves hook-adjusted, session-filtered bootstrap files for a run. */
declare function resolveBootstrapFilesForRun(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  warn?: (message: string) => void;
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): Promise<WorkspaceBootstrapFile[]>;
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
declare function resolveBootstrapContextForRun(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  warn?: (message: string) => void;
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): Promise<{
  bootstrapFiles: WorkspaceBootstrapFile[];
  contextFiles: EmbeddedContextFile[];
}>;
/** Builds bounded context files from already-resolved bootstrap file metadata. */
declare function buildBootstrapContextForFiles(
  bootstrapFiles: WorkspaceBootstrapFile[],
  params: {
    config?: OpenClawConfig;
    agentId?: string | null;
    warn?: (message: string) => void;
  },
): EmbeddedContextFile[];
//#endregion
//#region src/agents/cli-runner/types.d.ts
/** Input contract for one CLI-backed agent run. */
type RunCliAgentParams = {
  sessionId: string;
  sessionKey?: string /** Session identity used only for sandbox and tool-policy resolution. */;
  runtimePolicySessionKey?: string;
  sessionEntry?: SessionEntry;
  agentId?: string;
  trigger?: EmbeddedRunTrigger;
  sessionFile: string;
  workspaceDir: string /** Trusted model/auth owner directory. Defaults to the session agent directory. */;
  agentDir?: string /** Task working directory for CLI execution. Defaults to workspaceDir. */;
  cwd?: string /** Start a fresh CLI process so per-turn MCP authority is reloaded from this run. */;
  disableCliLiveSession?: boolean;
  config?: OpenClawConfig;
  prompt: string;
  transcriptPrompt?: string /** Undecorated current-turn prompt used to merge inline and offloaded images. */;
  imagePrompt?: string;
  /**
   * Execution mode for the generic CLI runner. Side questions are one-shot
   * background answers and must not reuse or mutate normal agent sessions.
   */
  executionMode?: CliBackendExecutionMode /** Persist the successful CLI assistant reply into the OpenClaw session transcript. */;
  persistAssistantTranscript?: boolean /** Session store path used when assistant transcript persistence is enabled. */;
  storePath?: string /** Canonical user-turn recorder shared with gateway/queue dispatch. */;
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder /** Skip current-turn user persistence when a retry/fallback already wrote it. */;
  suppressNextUserMessagePersistence?: boolean /** Notification fired after the current user turn has been accepted into the transcript. */;
  onUserMessagePersisted?: (
    message: Extract<
      AgentMessage,
      {
        role: "user";
      }
    >,
  ) => void;
  currentInboundEventKind?: InboundEventKind;
  currentInboundContext?: CurrentInboundPromptContext;
  inputProvenance?: InputProvenance /** Selected model provider used for tool policy; distinct from a CLI runtime id. */;
  modelProvider?: string;
  provider: string;
  model?: string;
  thinkLevel?: ThinkLevel;
  fastMode?: FastMode /** Stable outer-run start time for auto fast-mode cutoff across retries/fallbacks. */;
  fastModeStartedAtMs?: number /** Effective auto fast-mode cutoff for this run, in seconds. */;
  fastModeAutoOnSeconds?: number /** Shared notification state for nested harnesses that can observe the same tool boundary. */;
  fastModeAutoProgressState?: FastModeAutoProgressState /** True when the outer model fallback loop has reached its final candidate. */;
  isFinalFallbackAttempt?: boolean;
  timeoutMs: number;
  /**
   * Explicit run timeout, in milliseconds, when the caller can distinguish a
   * deliberate timeout override from the inherited agent default.
   */
  runTimeoutOverrideMs?: number;
  runId: string /** Immutable lifecycle ownership captured when this execution was admitted. */;
  lifecycleGeneration?: string;
  lane?: string;
  jobId?: string;
  extraSystemPrompt?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  requireExplicitMessageTarget?: boolean;
  silentReplyPromptMode?: SilentReplyPromptMode;
  allowEmptyAssistantReplyAsSilent?: boolean /** Static portion of extraSystemPrompt (excluding per-message inbound metadata) for session reuse hashing. */;
  extraSystemPromptStatic?: string;
  cliSessionBindingFacts?: CliSessionBindingFacts;
  streamParams?: AgentStreamParams;
  ownerNumbers?: string[];
  cliSessionId?: string;
  cliSessionBinding?: CliSessionBinding /** Consume the backend fork argument on this resume invocation only. */;
  forkCliSessionOnResume?: boolean /** Atomically claim the persisted one-shot marker after the CLI queue admits this turn. */;
  claimCliSessionFork?: () => Promise<boolean> /** Re-arm a claimed marker when the CLI turn fails before producing a successor session. */;
  restoreCliSessionFork?: () => Promise<void> /** Persist the successor ID as soon as the CLI reports the forked session. */;
  persistCliSessionForkSuccessor?: (sessionId: string) => Promise<void>;
  authProfileId?: string /** Private seam: report the credential/runtime owner only after a successful real turn. */;
  onSuccessfulAuthBinding?: (binding: {
    authProfileId?: string;
    authFingerprint?: string;
    runtimeOwnerFingerprint?: string;
    runtimeOwnerKind?: "cli-runtime" | "plugin-harness" | "aws-sdk";
    runtimeOwnerId?: string;
    runtimeArtifactFingerprint?: string;
    runtimeArtifactId?: string;
    skipLocalCredential?: true;
  }) => void;
  onBeforeFreshCliSessionRetry?: (params: {
    provider: string;
    reason: FailoverReason;
    sessionId: string;
  }) => boolean | Promise<boolean>;
  bootstrapPromptWarningSignaturesSeen?: string[];
  bootstrapPromptWarningSignature?: string;
  bootstrapContextMode?: BootstrapContextMode;
  bootstrapContextRunKind?: BootstrapContextRunKind;
  images?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[];
  skillsSnapshot?: SkillSnapshot;
  messageChannel?: string;
  messageProvider?: string /** Capabilities declared by the gateway client that originated this run. */;
  clientCaps?: string[];
  currentChannelId?: string;
  chatId?: string;
  channelContext?: PluginHookChannelContext;
  currentThreadTs?: string;
  currentMessageId?: string | number;
  currentInboundAudio?: boolean;
  agentAccountId?: string /** Sender identity for channel-originated runs when available. */;
  senderId?: string | null /** Trusted sender identity bit for channel action auth. */;
  senderIsOwner?: boolean /** Additional trusted sender identities used by toolsBySender policy. */;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null /** Group policy context captured from the originating run. */;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?:
    | string
    | null /** Parent session provenance used to validate inherited group policy. */;
  spawnedBy?:
    | string
    | null /** Effective turn-local exec policy resolved before entering the CLI runtime. */;
  execOverrides?: ExecPolicyOverrides /** Effective elevated-exec defaults resolved before entering the CLI runtime. */;
  bashElevated?: ExecElevatedDefaults /** Device-scoped operator session allowed to review approvals initiated by this run. */;
  approvalReviewerDeviceId?: string /** Runtime tool allow-list. CLI harnesses fail closed when this is set. */;
  toolsAllow?: string[] /** Exact native surface plus host-isolated MCP permissions for a selectable CLI backend. */;
  cliToolAvailability?: {
    native: [];
    mcp: string[];
  };
  disableTools?: boolean;
  abortSignal?: AbortSignal;
  onExecutionStarted?: () => void;
  onExecutionPhase?: (info: {
    phase: EmbeddedAgentExecutionPhase;
    provider?: string;
    model?: string;
    backend?: string;
    source?: string;
    firstModelCallStarted?: boolean;
  }) => void;
  replyOperation?: ReplyOperation;
  emitCommentaryText?: boolean;
  /**
   * Close any long-lived CLI live session created for this run after the run
   * finishes. Intended for temporary helper calls that should not keep process
   * handles alive after returning.
   */
  cleanupCliLiveSessionOnRunEnd?: boolean;
  /**
   * Close process-wide bundle MCP resources after this run. Intended for
   * one-shot local CLI calls where the loopback server should not keep Node
   * alive after the JSON response is emitted.
   */
  cleanupBundleMcpOnRunEnd?: boolean /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */;
  oneShotCliRun?: boolean;
};
type CliSessionBindingFacts = {
  extraSystemPromptStatic?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  requireExplicitMessageTarget?: boolean;
};
//#endregion
//#region src/auto-reply/reply/queue/types.d.ts
type QueueMode = "steer" | "followup" | "collect" | "interrupt";
type QueueDropPolicy = "old" | "new" | "summarize";
//#endregion
//#region src/auto-reply/reply/directive-handling.parse.d.ts
/** Parsed inline directives removed from a user message before agent execution. */
type InlineDirectives = {
  cleaned: string;
  hasThinkDirective: boolean;
  thinkLevel?: ThinkLevel;
  rawThinkLevel?: string;
  clearThinkLevel: boolean;
  hasVerboseDirective: boolean;
  verboseLevel?: VerboseLevel;
  rawVerboseLevel?: string;
  hasTraceDirective: boolean;
  traceLevel?: TraceLevel;
  rawTraceLevel?: string;
  hasFastDirective: boolean;
  fastMode?: FastMode;
  rawFastMode?: string;
  clearFastMode: boolean;
  hasReasoningDirective: boolean;
  reasoningLevel?: ReasoningLevel;
  rawReasoningLevel?: string;
  hasElevatedDirective: boolean;
  elevatedLevel?: ElevatedLevel;
  rawElevatedLevel?: string;
  hasExecDirective: boolean;
  execHost?: ExecTarget;
  execSecurity?: ExecSecurity;
  execAsk?: ExecAsk;
  execNode?: string;
  rawExecHost?: string;
  rawExecSecurity?: string;
  rawExecAsk?: string;
  rawExecNode?: string;
  hasExecOptions: boolean;
  invalidExecHost: boolean;
  invalidExecSecurity: boolean;
  invalidExecAsk: boolean;
  invalidExecNode: boolean;
  hasStatusDirective: boolean;
  hasModelDirective: boolean;
  rawModelDirective?: string;
  rawModelProfile?: string;
  rawModelRuntime?: string;
  hasQueueDirective: boolean;
  queueMode?: QueueMode;
  queueReset: boolean;
  rawQueueMode?: string;
  debounceMs?: number;
  cap?: number;
  dropPolicy?: QueueDropPolicy;
  rawDebounce?: string;
  rawCap?: string;
  rawDrop?: string;
  hasQueueOptions: boolean;
};
//#endregion
//#region src/auto-reply/reply/commands-types.d.ts
/** Normalized command metadata derived from an inbound message. */
type CommandContext = {
  surface: string;
  channel: string;
  channelId?: ChannelId$1;
  accountId?: string;
  ownerList: string[];
  senderIsOwner: boolean;
  isAuthorizedSender: boolean;
  senderId?: string;
  abortKey?: string;
  rawBodyNormalized: string;
  commandBodyNormalized: string;
  from?: string;
  to?: string /** Internal marker to prevent duplicate reset-hook emission across command pipelines. */;
  resetHookTriggered?: boolean /** Internal marker for prompt reload without session rollover. */;
  softResetTriggered?: boolean /** Optional tail to append after a soft reset startup prompt. */;
  softResetTail?: string;
};
/** Full input object passed to each command handler. */
type HandleCommandsParams = {
  ctx: MsgContext;
  rootCtx?: MsgContext;
  cfg: OpenClawConfig;
  command: CommandContext;
  agentId?: string;
  agentDir?: string;
  directives: InlineDirectives;
  elevated: {
    enabled: boolean;
    allowed: boolean;
    failures: Array<{
      gate: string;
      key: string;
    }>;
  };
  sessionEntry?: SessionEntry /** Snapshot captured before command handlers mutate the active entry. */;
  initialSessionEntry?: SessionEntry /** True only when the current command owns first creation of this session row. */;
  allowCreateSessionEntry?: boolean;
  previousSessionEntry?: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey: string;
  storePath?: string;
  sessionScope?: SessionScope$1;
  workspaceDir: string;
  opts?: GetReplyOptions;
  defaultGroupActivation: () => "always" | "mention";
  resolvedThinkLevel?: ThinkLevel;
  resolvedFastMode?: FastMode;
  resolvedVerboseLevel: VerboseLevel;
  resolvedReasoningLevel: ReasoningLevel;
  resolvedElevatedLevel?: ElevatedLevel;
  blockReplyChunking?: BlockReplyChunking;
  resolvedBlockStreamingBreak?: "text_end" | "message_end";
  resolveDefaultThinkingLevel: () => Promise<ThinkLevel | undefined>;
  provider: string;
  model: string;
  contextTokens: number;
  isGroup: boolean;
  skillCommands?: SkillCommandSpec[];
  loadSkillCommands?: () => Promise<SkillCommandSpec[]>;
  typing?: TypingController;
};
/** Result returned by a command handler. */
type CommandHandlerResult = {
  reply?: ReplyPayload;
  shouldContinue: boolean;
};
/** Command handler function shape. */
type CommandHandler = (
  params: HandleCommandsParams,
  allowTextCommands: boolean,
) => Promise<CommandHandlerResult | null>;
//#endregion
//#region src/auto-reply/reply/command-session-metadata.d.ts
type CommandSessionMetadataChange = {
  sessionKey: string;
  agentId?: string;
  reason: "command-metadata";
};
//#endregion
//#region src/infra/heartbeat-run-scope.d.ts
type HeartbeatRunScope = "global" | "commitment-only";
declare const HEARTBEAT_RUN_SCOPE: unique symbol;
type ReplyOptionsWithHeartbeatRunScope = {
  [HEARTBEAT_RUN_SCOPE]?: HeartbeatRunScope;
};
//#endregion
//#region src/auto-reply/reply/get-reply.types.d.ts
type ReplySessionBinding = {
  sessionKey?: string;
  sessionId: string;
  storePath?: string;
};
type InternalReplySessionOptions = {
  expectedExistingSessionId?: string;
  onSessionPrepared?: (
    binding: ReplySessionBinding,
  ) => void /** Prevent implicit rollover after a caller has durably admitted this exact session. */;
  pinExpectedExistingSession?: boolean;
  requestedSessionId?: string;
  resumeRequestedSession?: boolean;
  sessionPromptSourceReplyDeliveryMode?: GetReplyOptions["sourceReplyDeliveryMode"] /** Marks queued follow-up admission waits on an older owner's delivery barrier. */;
  onFollowupAdmissionWaitChange?: (waiting: boolean) => void;
};
type InternalGetReplyOptions = GetReplyOptions &
  InternalReplySessionOptions &
  ReplyOptionsWithHeartbeatRunScope;
/** Reply resolver signature used by dispatchers and tests for dependency injection. */
type GetReplyFromConfig = (
  ctx: MsgContext,
  opts?: GetReplyOptions,
  configOverride?: OpenClawConfig,
) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
type InternalGetReplyFromConfig = (
  ctx: MsgContext,
  opts?: InternalGetReplyOptions,
  configOverride?: OpenClawConfig,
) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.types.d.ts
type DispatchFromConfigResult = {
  queuedFinal: boolean;
  counts: Record<ReplyDispatchKind, number>;
  failedCounts?: Partial<Record<ReplyDispatchKind, number>>;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  sendPolicyDenied?: boolean;
  observedReplyDelivery?: boolean;
  noVisibleReplyFallbackEligible?: boolean;
  beforeAgentRunBlocked?: boolean;
  sessionMetadataChanges?: CommandSessionMetadataChange[];
};
type DispatchFromConfigParams = {
  ctx: FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  replyOptions?: Omit<InternalGetReplyOptions, "onBlockReply">;
  replyResolver?: InternalGetReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
  fastAbortResolver?: TryFastAbortFromMessage;
  formatAbortReplyTextResolver?: FormatAbortReplyText /** Optional patch applied to the already loaded config before reply resolution. */;
  configOverride?: OpenClawConfig;
};
type DispatchReplyFromConfig = (
  params: DispatchFromConfigParams,
) => Promise<DispatchFromConfigResult>;
//#endregion
//#region src/auto-reply/reply/normalize-reply.d.ts
type NormalizeReplySkipReason = "empty" | "silent" | "heartbeat";
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.d.ts
type ReplyDispatchErrorHandler = (
  err: unknown,
  info: ReplyDispatchRuntimeInfo,
) => Promise<void> | void;
type ReplyDispatchSkipHandler = (
  payload: ReplyPayload,
  info: ReplyDispatchRuntimeInfo & {
    reason: NormalizeReplySkipReason;
  },
) => void;
type ReplyDispatchCancelHandler = (
  payload: ReplyPayload,
  info: ReplyDispatchRuntimeInfo,
) => Promise<void> | void;
type ReplyDispatchDeliverer = (
  payload: ReplyPayload,
  info: ReplyDispatchRuntimeInfo,
) => Promise<unknown>;
type ReplyDispatcherOptions = {
  deliver: ReplyDispatchDeliverer;
  silentReplyContext?: {
    cfg?: OpenClawConfig;
    sessionKey?: string;
    surface?: string;
    conversationType?: SilentReplyConversationType;
  };
  responsePrefix?: string;
  transformReplyPayload?: (
    payload: ReplyPayload,
  ) => ReplyPayload | null /** Static context for response prefix template interpolation. */;
  responsePrefixContext?: ResponsePrefixContext;
  /** Dynamic context provider for response prefix template interpolation.
   * Called at normalization time, after model selection is complete. */
  responsePrefixContextProvider?: () => ResponsePrefixContext;
  onHeartbeatStrip?: () => void;
  onIdle?: () => Promise<void> | void;
  onError?: ReplyDispatchErrorHandler;
  onSkip?: ReplyDispatchSkipHandler /** Human-like delay between block replies for natural rhythm. */;
  humanDelay?: HumanDelayConfig;
  beforeDeliver?: ReplyDispatchBeforeDeliver /** Owner-declared deadline for the constructor before-delivery callback. */;
  beforeDeliverOptions?: ReplyDispatchBeforeDeliverOptions;
  onBeforeDeliverCancelled?: ReplyDispatchCancelHandler /** Observe each queued payload settling, including cancellation and delivery failure. */;
  onDeliverySettled?: (
    info: ReplyDispatchRuntimeInfo,
  ) => void /** Resolve an owner activity policy for holding queued follow-ups behind delivery. */;
  resolveFollowupAdmissionBarrierTimeoutPolicy?: (context: {
    queuedCounts: Readonly<Record<ReplyDispatchKind, number>>;
    humanDelayBudgetMs: number;
  }) => ReplyFollowupAdmissionBarrierTimeoutPolicy | undefined;
};
type ReplyDispatcherWithTypingOptions = Omit<ReplyDispatcherOptions, "onIdle"> & {
  typingCallbacks?: TypingCallbacks;
  onReplyStart?: () => Promise<void> | void;
  onIdle?: () => Promise<void> | void;
  onSettled?: () => unknown;
  onFreshSettledDelivery?: () => unknown /** Called when the typing controller is cleaned up (e.g., on NO_REPLY). */;
  onCleanup?: () => void;
};
type ReplyDispatcherWithTypingResult = {
  dispatcher: ReplyDispatcher;
  replyOptions: Pick<GetReplyOptions, "onReplyStart" | "onTypingController" | "onTypingCleanup">;
  markDispatchIdle: () => void /** Signal that the model run is complete so the typing controller can stop. */;
  markRunComplete: () => void;
};
declare function createReplyDispatcher(options: ReplyDispatcherOptions): ReplyDispatcher;
declare function createReplyDispatcherWithTyping(
  options: ReplyDispatcherWithTypingOptions,
): ReplyDispatcherWithTypingResult;
//#endregion
//#region src/auto-reply/reply/provider-dispatcher.types.d.ts
type DispatchReplyContext = MsgContext | FinalizedMsgContext;
type DispatchReplyOptions = Omit<GetReplyOptions, "onBlockReply">;
/** Buffered block dispatcher entry point used by provider reply flows. */
type DispatchReplyWithBufferedBlockDispatcher$1 = (params: {
  ctx: DispatchReplyContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherWithTypingOptions;
  toolsAllow?: string[];
  replyOptions?: DispatchReplyOptions;
  replyResolver?: GetReplyFromConfig;
}) => Promise<DispatchFromConfigResult>;
/** Plain dispatcher entry point used when block buffering is not needed. */
type DispatchReplyWithDispatcher = (params: {
  ctx: DispatchReplyContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: DispatchReplyOptions;
  replyResolver?: GetReplyFromConfig;
}) => Promise<DispatchFromConfigResult>;
//#endregion
//#region src/auto-reply/dispatch-dispatcher.d.ts
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
declare function settleReplyDispatcher(params: {
  dispatcher: ReplyDispatcher;
  onSettled?: () => void | Promise<void>;
}): Promise<void>;
/** Run work with a dispatcher and always drain it before returning or throwing. */
declare function withReplyDispatcher<T>(params: {
  dispatcher: ReplyDispatcher;
  run: () => Promise<T>;
  onSettled?: () => void | Promise<void>;
}): Promise<T>;
//#endregion
//#region src/auto-reply/reply/inbound-context.d.ts
type FinalizeInboundContextOptions = {
  forceBodyForAgent?: boolean;
  forceBodyForCommands?: boolean;
  forceChatType?: boolean;
  forceConversationLabel?: boolean;
};
declare function finalizeInboundContext<T extends Record<string, unknown>>(
  ctx: T,
  opts?: FinalizeInboundContextOptions,
): T & FinalizedMsgContext;
//#endregion
//#region src/channels/sender-label.d.ts
type SenderLabelParams = {
  name?: string;
  username?: string;
  tag?: string;
  e164?: string;
  id?: string;
};
//#endregion
//#region src/auto-reply/envelope.d.ts
type AgentEnvelopeParams = {
  channel: string;
  from?: string;
  timestamp?: number | Date;
  host?: string;
  ip?: string;
  body: string;
  previousTimestamp?: number | Date;
  envelope?: EnvelopeFormatOptions;
};
/** User/config-facing controls for timestamp rendering in prompt envelopes. */
type EnvelopeFormatOptions = {
  /**
   * "local" (default), "utc", "user", or an explicit IANA timezone string.
   */
  timezone?: string;
  /**
   * Include absolute timestamps in the envelope (default: true).
   */
  includeTimestamp?: boolean;
  /**
   * Include elapsed time suffix when previousTimestamp is provided (default: true).
   */
  includeElapsed?: boolean;
  /**
   * Optional user timezone used when timezone="user".
   */
  userTimezone?: string;
};
/** Resolves envelope formatting defaults from agent config. */
declare function resolveEnvelopeFormatOptions(cfg?: OpenClawConfig): EnvelopeFormatOptions;
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
declare function formatAgentEnvelope(params: AgentEnvelopeParams): string;
/** Formats an inbound message body with sender attribution appropriate for direct/group chats. */
declare function formatInboundEnvelope(params: {
  channel: string;
  from: string;
  body: string;
  timestamp?: number | Date;
  chatType?: string;
  senderLabel?: string;
  sender?: SenderLabelParams;
  previousTimestamp?: number | Date;
  envelope?: EnvelopeFormatOptions;
  fromMe?: boolean;
}): string;
/** Builds the compact `from` label used in inbound envelope headers. */
declare function formatInboundFromLabel(params: {
  isGroup: boolean;
  groupLabel?: string;
  groupId?: string;
  directLabel: string;
  directId?: string;
  groupFallback?: string;
}): string;
//#endregion
//#region src/channels/turn/bot-loop-protection.d.ts
/** Facts used to detect repeated bot-to-bot channel reply loops. */
type ChannelBotLoopProtectionFacts = {
  scopeId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  config?: PairLoopGuardConfig;
  defaultsConfig?: PairLoopGuardConfig;
  defaultEnabled: boolean;
  nowMs?: number;
};
/** Records a bot pair interaction and returns whether the loop guard should suppress it. */
declare function recordChannelBotPairLoopAndCheckSuppression(
  params: ChannelBotLoopProtectionFacts,
): PairLoopGuardResult;
//#endregion
//#region src/channels/turn/types.d.ts
/** Admission decision for an inbound channel event before agent dispatch. */
type ChannelTurnAdmission =
  | {
      kind: "dispatch";
      reason?: string;
    }
  | {
      kind: "observeOnly";
      reason: string;
    }
  | {
      kind: "handled";
      reason: string;
    }
  | {
      kind: "drop";
      reason: string;
      recordHistory?: boolean;
    };
/** Coarse event classification used to decide whether an event can start an agent turn. */
type ChannelEventClass = {
  kind: "message" | "command" | "interaction" | "reaction" | "lifecycle" | "unknown";
  canStartAgentTurn: boolean;
  requiresImmediateAck?: boolean;
};
/** Normalized inbound event text and raw payload after channel-specific ingestion. */
type NormalizedTurnInput = {
  id: string;
  timestamp?: number;
  rawText: string;
  textForAgent?: string;
  textForCommands?: string;
  raw?: unknown;
};
/** Sender identity facts projected into channel access, routing, and prompt context. */
type SenderFacts = {
  id?: string;
  name?: string;
  username?: string;
  tag?: string;
  roles?: string[];
  isBot?: boolean;
  isSelf?: boolean;
  displayLabel?: string;
};
/** Conversation identity and threading facts for a channel turn. */
type ConversationFacts = {
  kind: "direct" | "group" | "channel";
  id: string;
  label?: string;
  spaceId?: string;
  parentId?: string;
  threadId?: string;
  nativeChannelId?: string;
  routePeer?: {
    kind: "direct" | "group" | "channel";
    id: string;
  };
};
/** Session routing facts derived before dispatch. */
type RouteFacts = {
  agentId: string;
  accountId?: string;
  routeSessionKey: string;
  dispatchSessionKey?: string;
  persistedSessionKey?: string;
  parentSessionKey?: string;
  modelParentSessionKey?: string;
  mainSessionKey?: string;
  createIfMissing?: boolean;
};
/** Reply target and source-delivery facts for a channel turn. */
type ReplyPlanFacts = {
  to: string;
  originatingTo?: string;
  nativeChannelId?: string;
  replyTarget?: string;
  deliveryTarget?: string;
  replyToId?: string;
  replyToIdFull?: string;
  messageThreadId?: string | number;
  threadParentId?: string;
  sourceReplyDeliveryMode?: "thread" | "reply" | "channel" | "direct" | "none";
};
/** Allowlist projection used by access checks without exposing raw configured entries. */
type ProjectedAllowlistAccessFacts = {
  configured: boolean;
  matched: boolean;
  reasonCode?: string;
  matchedEntryIds: string[];
  invalidEntryCount: number;
  disabledEntryCount: number;
  accessGroups: {
    referenced: string[];
    matched: string[];
    missing: string[];
    unsupported: string[];
    failed: string[];
  };
};
/** Event-level access projection for commands, reactions, buttons, and native events. */
type ProjectedEventAccessFacts = {
  kind:
    | "message"
    | "reaction"
    | "button"
    | "postback"
    | "native-command"
    | "slash-command"
    | "system";
  authMode: "inbound" | "command" | "origin-subject" | "route-only" | "none";
  mayPair: boolean;
  authorized: boolean;
  reasonCode?: string;
  hasOriginSubject: boolean;
  originSubjectMatched: boolean;
};
/** Access decisions for DMs, groups, commands, events, and mention gating. */
type AccessFacts = {
  dm?: {
    decision: "allow" | "pairing" | "deny";
    reason?: string;
    /**
     * @deprecated Shared ingress projections redact allowlist entries and return an empty compat list.
     * Use allowlist diagnostics instead.
     */
    allowFrom: string[];
    allowlist?: ProjectedAllowlistAccessFacts;
  };
  group?: {
    policy: "open" | "allowlist" | "disabled";
    routeAllowed: boolean;
    senderAllowed: boolean;
    /**
     * @deprecated Shared ingress projections redact allowlist entries and return an empty compat list.
     * Use allowlist diagnostics instead.
     */
    allowFrom: string[];
    requireMention: boolean;
    allowlist?: ProjectedAllowlistAccessFacts;
  };
  commands?: {
    authorized?: boolean;
    shouldBlockControlCommand?: boolean;
    reasonCode?: string;
    useAccessGroups: boolean;
    allowTextCommands: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    /**
     * @deprecated Shared ingress projections do not expose raw authorizer lists.
     * Use authorized and reasonCode instead.
     */
    authorizers: Array<{
      configured: boolean;
      allowed: boolean;
    }>;
  };
  event?: ProjectedEventAccessFacts;
  mentions?: {
    canDetectMention: boolean;
    wasMentioned: boolean;
    hasAnyMention?: boolean;
    explicitlyMentionedBot?: boolean;
    mentionedUserIds?: string[];
    mentionedSubteamIds?: string[];
    mentionSource?: MentionSource;
    implicitMentionKinds?: Array<
      "reply_to_bot" | "quoted_bot" | "bot_thread_participant" | "native"
    >;
    requireMention?: boolean;
    effectiveWasMentioned?: boolean;
    shouldSkip?: boolean;
  };
};
/** Message text/history facts passed into templating and dispatch. */
type MessageFacts = {
  inboundEventKind?: InboundEventKind;
  body?: string;
  rawBody: string;
  bodyForAgent?: string;
  commandBody?: string;
  envelopeFrom?: string;
  senderLabel?: string;
  preview?: string;
  inboundHistory?: HistoryEntry[];
  sourceModality?: InboundSourceModality;
};
/** Parsed command facts for command-like channel turns. */
type CommandFacts = {
  kind: CommandTurnKind;
  body?: string;
  name?: string;
  authorized?: boolean;
};
/** Inbound media facts supplied to the agent context. */
type InboundMediaFacts = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: "image" | "video" | "audio" | "document" | "unknown";
  transcribed?: boolean;
  messageId?: string;
};
type MaybePromise$1<T> = T | Promise<T>;
/** Adapter preflight output assembled before turn resolution. */
type PreflightFacts = {
  admission?: ChannelTurnAdmission;
  command?: CommandFacts;
  message?: Partial<MessageFacts>;
  media?:
    | readonly InboundMediaFacts[]
    | (() => MaybePromise$1<
        readonly InboundMediaFacts[] | readonly HistoryMediaEntry[] | null | undefined
      >);
  supplemental?: SupplementalContextFacts;
  history?: ChannelTurnDroppedHistoryOptions;
};
/** Delivery metadata for one reply payload dispatch. */
type ChannelDeliveryInfo = {
  kind: ReplyDispatchKind;
};
/** Durable delivery queue intent recorded when a reply is deferred. */
type ChannelDeliveryIntent = {
  id: string;
  kind: "outbound_queue";
  queuePolicy: OutboundDeliveryQueuePolicy;
};
/** Result returned after delivering one channel reply payload. */
type ChannelDeliveryResult = {
  messageIds?: string[];
  receipt?: MessageReceipt;
  threadId?: string;
  replyToId?: string;
  visibleReplySent?: boolean;
  deliveryIntent?: ChannelDeliveryIntent;
};
/** Durable outbound delivery options available to channel turn delivery adapters. */
type ChannelTurnDurableDeliveryOptions = Pick<
  DeliverOutboundPayloadsParams,
  "deps" | "formatting" | "identity" | "mediaAccess" | "replyToMode" | "silent" | "threadId"
> & {
  to?: string | null;
  replyToId?: string | null;
  requiredCapabilities?: DurableFinalDeliveryRequirements;
};
/** Delivery adapter used by channel turns to send reply payloads. */
type ChannelEventDeliveryAdapter = {
  preparePayload?: (
    payload: ReplyPayload,
    info: ChannelDeliveryInfo,
  ) => Promise<ReplyPayload> | ReplyPayload;
  deliver: (
    payload: ReplyPayload,
    info: ChannelDeliveryInfo,
  ) => Promise<ChannelDeliveryResult | void>;
  durable?:
    | false
    | ChannelTurnDurableDeliveryOptions
    | ((
        payload: ReplyPayload,
        info: ChannelDeliveryInfo,
      ) =>
        | false
        | ChannelTurnDurableDeliveryOptions
        | Promise<false | ChannelTurnDurableDeliveryOptions>);
  onDelivered?: (
    payload: ReplyPayload,
    info: ChannelDeliveryInfo,
    result: ChannelDeliveryResult | void,
  ) => Promise<void> | void;
  onError?: (
    err: unknown,
    info: {
      kind: string;
    },
  ) => void;
};
/** Options for recording inbound session route state around a turn. */
type ChannelTurnRecordOptions = {
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError?: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
};
/** Options for finalizing visible conversation history after dispatch. */
type ChannelTurnHistoryFinalizeOptions = {
  isGroup?: boolean;
  historyKey?: string;
  historyMap?: Map<string, HistoryEntry[]>;
  limit?: number;
};
/** Options for recording history when an inbound event is dropped before dispatch. */
type ChannelTurnDroppedHistoryOptions = {
  key: string;
  limit: number;
  historyMap: Map<string, HistoryEntry[]>;
  recordOnDrop?: boolean;
  mediaLimit?: number;
  shouldRecord?: () => boolean;
};
/** Dispatcher options excluding delivery hooks owned by the channel turn adapter. */
type ChannelTurnDispatcherOptions = Omit<ReplyDispatcherWithTypingOptions, "deliver" | "onError">;
/** Reply pipeline options excluding cfg/agent/channel identity supplied by the turn. */
type ChannelTurnReplyPipelineOptions = Omit<
  CreateChannelReplyPipelineParams,
  "cfg" | "agentId" | "channel" | "accountId"
>;
/** Fully assembled channel turn ready to build the dispatch runner. */
type AssembledChannelTurn = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSession$1;
  afterRecord?: () => void | Promise<void>;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher$1;
  delivery: ChannelEventDeliveryAdapter;
  replyPipeline?: ChannelTurnReplyPipelineOptions;
  dispatcherOptions?: ChannelTurnDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: Omit<GetReplyOptions, "onBlockReply">;
  replyResolver?: GetReplyFromConfig;
  record?: ChannelTurnRecordOptions;
  history?: ChannelTurnHistoryFinalizeOptions;
  admission?: Extract<
    ChannelTurnAdmission,
    {
      kind: "dispatch" | "observeOnly";
    }
  >;
  botLoopProtection?: ChannelBotLoopProtectionFacts;
  log?: (event: ChannelTurnLogEvent) => void;
  messageId?: string;
  /**
   * Observes turn adoption without waiting for settle. Threaded into
   * replyOptions for the agent runner (after recovery persist attempt).
   */
  onTurnAdopted?: () => void | Promise<void>;
};
/** Channel turn with dispatch runner already prepared. */
type PreparedChannelTurn<TDispatchResult = DispatchFromConfigResult> = {
  channel: string;
  accountId?: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSession$1;
  afterRecord?: () => void | Promise<void>;
  record?: ChannelTurnRecordOptions;
  history?: ChannelTurnHistoryFinalizeOptions;
  onPreDispatchFailure?: (err: unknown) => void | Promise<void>;
  runDispatch: () => Promise<TDispatchResult>;
  observeOnlyDispatchResult?: TDispatchResult;
  admission?: Extract<
    ChannelTurnAdmission,
    {
      kind: "dispatch" | "observeOnly";
    }
  >;
  botLoopProtection?: ChannelBotLoopProtectionFacts;
  log?: (event: ChannelTurnLogEvent) => void;
  messageId?: string;
};
/** Resolved turn shape returned by adapters before final run/dispatch handling. */
type ChannelTurnResolved<TDispatchResult = DispatchFromConfigResult> =
  | (AssembledChannelTurn & {
      admission?: Extract<
        ChannelTurnAdmission,
        {
          kind: "dispatch" | "observeOnly";
        }
      >;
    })
  | (PreparedChannelTurn<TDispatchResult> & {
      admission?: Extract<
        ChannelTurnAdmission,
        {
          kind: "dispatch" | "observeOnly";
        }
      >;
    });
/** Ordered lifecycle stage names emitted to channel turn log hooks. */
type ChannelTurnStage =
  | "ingest"
  | "classify"
  | "preflight"
  | "resolve"
  | "authorize"
  | "assemble"
  | "record"
  | "dispatch"
  | "finalize";
/** Structured channel turn log event. */
type ChannelTurnLogEvent = {
  stage: ChannelTurnStage;
  event: "start" | "done" | "drop" | "handled" | "error" | "warning";
  channel: string;
  accountId?: string;
  messageId?: string;
  sessionKey?: string;
  admission?: ChannelTurnAdmission["kind"];
  reason?: string;
  error?: unknown;
};
/** Final result for a channel turn, dispatched or admitted without dispatch. */
type ChannelTurnResult<TDispatchResult = DispatchFromConfigResult> =
  | DispatchedChannelTurnResult<TDispatchResult>
  | {
      admission: ChannelTurnAdmission;
      dispatched: false;
      ctxPayload?: MsgContext;
      routeSessionKey?: string;
    };
/** Successful dispatch result for a channel turn. */
type DispatchedChannelTurnResult<TDispatchResult = DispatchFromConfigResult> = {
  admission: Extract<
    ChannelTurnAdmission,
    {
      kind: "dispatch" | "observeOnly";
    }
  >;
  dispatched: true;
  ctxPayload: MsgContext;
  routeSessionKey: string;
  dispatchResult: TDispatchResult;
};
/** Adapter contract for ingesting, classifying, resolving, and finalizing raw channel events. */
type ChannelTurnAdapter<TRaw, TDispatchResult = DispatchFromConfigResult> = {
  ingest: (raw: TRaw) => Promise<NormalizedTurnInput | null> | NormalizedTurnInput | null;
  classify?: (input: NormalizedTurnInput) => Promise<ChannelEventClass> | ChannelEventClass;
  preflight?: (
    input: NormalizedTurnInput,
    eventClass: ChannelEventClass,
  ) =>
    | Promise<PreflightFacts | ChannelTurnAdmission | null | undefined>
    | PreflightFacts
    | ChannelTurnAdmission
    | null
    | undefined;
  resolveTurn: (
    input: NormalizedTurnInput,
    eventClass: ChannelEventClass,
    preflight: PreflightFacts,
  ) => Promise<ChannelTurnResolved<TDispatchResult>> | ChannelTurnResolved<TDispatchResult>;
  onFinalize?: (result: ChannelTurnResult<TDispatchResult>) => Promise<void> | void;
};
/** Parameters for running one raw channel event through the turn kernel. */
type RunChannelTurnParams<TRaw, TDispatchResult = DispatchFromConfigResult> = {
  channel: string;
  accountId?: string;
  raw: TRaw;
  adapter: ChannelTurnAdapter<TRaw, TDispatchResult>;
  log?: (event: ChannelTurnLogEvent) => void;
  /**
   * Observes turn adoption without waiting for settle. Fired after the
   * recovery-context persist attempt (context may be absent when source
   * delivery is suppressed). Default callers still await full settle.
   */
  onTurnAdopted?: () => void | Promise<void>;
};
//#endregion
//#region src/channels/inbound-event/context.d.ts
type MaybePromise<T> = T | Promise<T>;
type ChannelInboundSupplementalMediaResolver = () => MaybePromise<
  readonly InboundMediaFacts[] | null | undefined
>;
type ChannelInboundSupplementalQuoteFacts = NonNullable<SupplementalContextFacts["quote"]> & {
  isSelf?: boolean;
  media?: readonly InboundMediaFacts[] | ChannelInboundSupplementalMediaResolver;
};
type ChannelInboundSupplementalFacts = Omit<SupplementalContextFacts, "quote"> & {
  quote?: ChannelInboundSupplementalQuoteFacts;
};
/**
 * @deprecated Prefer passing `resolveSupplementalMedia: true` directly to
 * `buildChannelInboundEventContext` without naming this compatibility type.
 */
type ChannelInboundSupplementalResolutionOptions = {
  resolveSupplementalMedia: true;
  suppressSelfQuoteBody?: boolean;
  suppressSelfQuoteMedia?: boolean;
};
type BuildAccessFacts = Omit<AccessFacts, "commands"> & {
  commands?: Partial<NonNullable<AccessFacts["commands"]>>;
};
type BuildChannelInboundEventContextParams = {
  channel: string;
  accountId?: string;
  provider?: string;
  surface?: string;
  messageId?: string;
  messageIdFull?: string;
  timestamp?: number;
  from: string;
  sender: SenderFacts;
  conversation: ConversationFacts;
  route: RouteFacts;
  reply: ReplyPlanFacts;
  message: MessageFacts;
  access?: BuildAccessFacts;
  command?: CommandFacts;
  commandTurn?: CommandTurnContext;
  media?: InboundMediaFacts[];
  supplemental?: ChannelInboundSupplementalFacts;
  channelContext?: PluginHookChannelContext;
  contextVisibility?: ContextVisibilityMode;
  finalize?: FinalizeInboundContextFn;
  finalizeOptions?: FinalizeInboundContextOptions;
  extra?: Record<string, unknown>;
};
/**
 * @deprecated Prefer `BuildChannelInboundEventContextParams` with
 * `resolveSupplementalMedia: true` at call sites that need lazy quote media.
 */
type BuildChannelInboundEventContextAsyncParams = BuildChannelInboundEventContextParams &
  ChannelInboundSupplementalResolutionOptions;
type BuiltChannelInboundEventContext = FinalizedMsgContext & {
  Body: string;
  BodyForAgent: string;
  BodyForCommands: string;
  ChatType: ConversationFacts["kind"];
  CommandAuthorized: boolean;
  CommandBody: string;
  From: string;
  RawBody: string;
  SessionKey: string;
  To: string;
  InboundEventKind: InboundEventKind;
};
type FinalizeInboundContextFn = (
  ctx: Record<string, unknown>,
  opts?: FinalizeInboundContextOptions,
) => unknown;
/**
 * @deprecated Used by deprecated `finalizeChannelInboundContext`; new channel
 * code should pass facts to `buildChannelInboundEventContext`.
 */
type FinalizeChannelInboundContextParams<T extends Record<string, unknown>> = {
  context: T;
  supplemental?: SupplementalContextFacts | ChannelInboundSupplementalFacts;
  contextVisibility?: ContextVisibilityMode;
  media?: readonly InboundMediaFacts[];
  finalize?: FinalizeInboundContextFn;
  finalizeOptions?: FinalizeInboundContextOptions;
};
/**
 * @deprecated Prefer `FinalizeChannelInboundContextParams<T>` with
 * `resolveSupplementalMedia: true` when lazy quote media must be resolved.
 */
type FinalizeChannelInboundContextAsyncParams<T extends Record<string, unknown>> =
  FinalizeChannelInboundContextParams<T> & {
    resolveSupplementalMedia: true;
  } & Pick<
      ChannelInboundSupplementalResolutionOptions,
      "suppressSelfQuoteBody" | "suppressSelfQuoteMedia"
    >;
/**
 * @deprecated Result type for deprecated `finalizeChannelInboundContext`.
 */
type FinalizeChannelInboundContextResult<T extends Record<string, unknown>> = {
  context: T & FinalizedMsgContext;
  supplemental?: SupplementalContextFacts;
  quoteHidden: boolean;
  forwardedHidden: boolean;
  threadHidden: boolean;
};
declare function filterChannelInboundSupplementalContext(params: {
  supplemental?: SupplementalContextFacts;
  contextVisibility?: ContextVisibilityMode;
}): SupplementalContextFacts | undefined;
declare function filterChannelInboundQuoteContext(
  contextVisibility: ContextVisibilityMode | undefined,
  quote: SupplementalContextFacts["quote"] | undefined,
): SupplementalContextFacts["quote"] | undefined;
/**
 * @deprecated Prefer `buildChannelInboundEventContext({ resolveSupplementalMedia: true })`
 * for channel inbound payloads.
 */
declare function resolveChannelInboundSupplementalContext(params: {
  supplemental?: ChannelInboundSupplementalFacts;
  contextVisibility?: ContextVisibilityMode;
  media?: readonly InboundMediaFacts[];
  suppressSelfQuoteBody?: boolean;
  suppressSelfQuoteMedia?: boolean;
}): Promise<{
  supplemental?: SupplementalContextFacts;
  media: InboundMediaFacts[];
  quoteHidden: boolean;
}>;
/**
 * @deprecated Public compatibility for callers that already prepared legacy
 * prompt fields. New channel code should use `buildChannelInboundEventContext`.
 */
declare function finalizeChannelInboundContext<T extends Record<string, unknown>>(
  params: FinalizeChannelInboundContextAsyncParams<T>,
): Promise<FinalizeChannelInboundContextResult<T>>;
declare function finalizeChannelInboundContext<T extends Record<string, unknown>>(
  params: FinalizeChannelInboundContextParams<T>,
): FinalizeChannelInboundContextResult<T>;
declare function buildChannelInboundEventContext(
  params: BuildChannelInboundEventContextAsyncParams,
): Promise<BuiltChannelInboundEventContext>;
declare function buildChannelInboundEventContext(
  params: BuildChannelInboundEventContextParams,
): BuiltChannelInboundEventContext;
//#endregion
//#region src/channels/turn/durable-delivery.d.ts
/** Options controlling durable final delivery for inbound channel replies. */
type DurableInboundReplyDeliveryOptions = Pick<
  DeliverOutboundPayloadsParams,
  "deps" | "formatting" | "identity" | "mediaAccess" | "replyToMode" | "silent" | "threadId"
> & {
  to?: string | null;
  replyToId?: string | null;
  requiredCapabilities?: DurableFinalDeliveryRequirements;
};
/** Full context required to deliver one inbound final reply through durable message sending. */
type DurableInboundReplyDeliveryParams = DurableInboundReplyDeliveryOptions & {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  ctxPayload: FinalizedMsgContext;
  payload: ReplyPayload;
  info: ChannelDeliveryInfo;
};
/** Outcome of attempting durable final delivery for an inbound reply payload. */
type DurableInboundReplyDeliveryResult =
  | {
      status: "not_applicable";
      reason: "non_final";
    }
  | {
      status: "unsupported";
      reason:
        | "missing_channel"
        | "missing_target"
        | "missing_outbound_handler"
        | "capability_mismatch";
      capability?: DurableFinalDeliveryRequirement;
    }
  | {
      status: "handled_visible";
      delivery: ChannelDeliveryResult;
    }
  | {
      status: "handled_no_send";
      reason: "no_visible_result";
      delivery: ChannelDeliveryResult;
    }
  | {
      status: "failed";
      error: unknown;
      sentBeforeError?: true;
    };
/** Narrows durable delivery results that handled the payload without caller fallback. */
declare function isDurableInboundReplyDeliveryHandled(
  result: DurableInboundReplyDeliveryResult,
): result is Extract<
  DurableInboundReplyDeliveryResult,
  {
    status: "handled_visible" | "handled_no_send";
  }
>;
/** Throws failed durable delivery results, preserving visible-send metadata when applicable. */
declare function throwIfDurableInboundReplyDeliveryFailed(
  result: DurableInboundReplyDeliveryResult,
): void;
/** Delivers final inbound replies through the durable message-send context when supported. */
declare function deliverInboundReplyWithMessageSendContext(
  params: DurableInboundReplyDeliveryParams,
): Promise<DurableInboundReplyDeliveryResult>;
//#endregion
//#region src/channels/turn/dispatch-result.d.ts
/** Minimal dispatch result shape needed to count visible channel deliveries. */
type ChannelTurnDispatchResultLike =
  | {
      queuedFinal?: boolean;
      counts?: Partial<Record<ReplyDispatchKind, number>>;
      observedReplyDelivery?: boolean;
    }
  | null
  | undefined;
/** Extra delivery signals observed outside the normal dispatch count payload. */
type ChannelTurnVisibleDeliverySignals = {
  observedReplyDelivery?: boolean;
  fallbackDelivered?: boolean;
  deliverySummaryDelivered?: boolean;
};
/** Resolves dispatch counts with missing reply kinds filled as zero. */
declare function resolveChannelTurnDispatchCounts(
  result: ChannelTurnDispatchResultLike,
): Record<ReplyDispatchKind, number>;
/** Returns whether a turn produced any visible reply delivery signal. */
declare function hasVisibleChannelTurnDispatch(
  result: ChannelTurnDispatchResultLike,
  signals?: ChannelTurnVisibleDeliverySignals,
): boolean;
/** Returns whether a turn produced a final reply, fallback, summary, or queued final payload. */
declare function hasFinalChannelTurnDispatch(
  result: ChannelTurnDispatchResultLike,
  signals?: Pick<
    ChannelTurnVisibleDeliverySignals,
    "fallbackDelivered" | "deliverySummaryDelivered"
  >,
): boolean;
declare namespace kernel_d_exports {
  export {
    ChannelBotLoopProtectionFacts,
    ChannelTurnResult,
    DispatchedChannelTurnResult,
    DurableInboundReplyDeliveryOptions,
    DurableInboundReplyDeliveryParams,
    DurableInboundReplyDeliveryResult,
    deliverInboundReplyWithMessageSendContext,
    dispatchAssembledChannelTurn,
    dispatchChannelInboundReply,
    hasFinalChannelTurnDispatch,
    hasVisibleChannelTurnDispatch,
    isDurableInboundReplyDeliveryHandled,
    recordChannelBotPairLoopAndCheckSuppression,
    recordDroppedChannelInboundHistory,
    resolveChannelTurnDispatchCounts,
    runChannelInboundEvent,
    runPreparedInboundReply,
    throwIfDurableInboundReplyDeliveryFailed,
  };
}
declare function recordDroppedChannelTurnHistory(params: {
  input: NormalizedTurnInput;
  preflight: PreflightFacts;
  admission?: ChannelTurnAdmission;
}): Promise<void>;
declare const recordDroppedChannelInboundHistory: typeof recordDroppedChannelTurnHistory;
type AssembledChannelTurnWithBotLoopProtection = AssembledChannelTurn & {
  botLoopProtection: NonNullable<AssembledChannelTurn["botLoopProtection"]>;
};
type AssembledChannelTurnWithoutBotLoopProtection = Omit<
  AssembledChannelTurn,
  "botLoopProtection"
> & {
  botLoopProtection?: undefined;
};
declare function dispatchAssembledChannelTurn(
  params: AssembledChannelTurnWithBotLoopProtection,
): Promise<ChannelTurnResult>;
declare function dispatchAssembledChannelTurn(
  params: AssembledChannelTurnWithoutBotLoopProtection,
): Promise<DispatchedChannelTurnResult>;
declare function dispatchAssembledChannelTurn(
  params: AssembledChannelTurn,
): Promise<ChannelTurnResult>;
declare const dispatchChannelInboundReply: typeof dispatchAssembledChannelTurn;
type PreparedChannelTurnWithBotLoopProtection<TDispatchResult> =
  PreparedChannelTurn<TDispatchResult> & {
    botLoopProtection: NonNullable<PreparedChannelTurn<TDispatchResult>["botLoopProtection"]>;
  };
type PreparedChannelTurnWithoutBotLoopProtection<TDispatchResult> = Omit<
  PreparedChannelTurn<TDispatchResult>,
  "botLoopProtection"
> & {
  botLoopProtection?: undefined;
};
declare function runPreparedChannelTurn<
  TDispatchResult = DispatchedChannelTurnResult["dispatchResult"],
>(
  params: PreparedChannelTurnWithBotLoopProtection<TDispatchResult>,
): Promise<ChannelTurnResult<TDispatchResult>>;
declare function runPreparedChannelTurn<
  TDispatchResult = DispatchedChannelTurnResult["dispatchResult"],
>(
  params: PreparedChannelTurnWithoutBotLoopProtection<TDispatchResult>,
): Promise<DispatchedChannelTurnResult<TDispatchResult>>;
declare function runPreparedChannelTurn<
  TDispatchResult = DispatchedChannelTurnResult["dispatchResult"],
>(params: PreparedChannelTurn<TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
declare const runPreparedInboundReply: typeof runPreparedChannelTurn;
declare function runChannelTurn<
  TRaw,
  TDispatchResult = DispatchedChannelTurnResult["dispatchResult"],
>(params: RunChannelTurnParams<TRaw, TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
declare const runChannelInboundEvent: typeof runChannelTurn;
//#endregion
//#region src/auto-reply/command-detection.runtime-types.d.ts
/** Runtime-injected predicate for deciding whether visible text is an OpenClaw command. */
type IsControlCommandMessage = (
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
) => boolean;
/** Runtime-injected predicate for deciding whether command authorization must be computed. */
type ShouldComputeCommandAuthorized = (
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
) => boolean;
//#endregion
//#region src/auto-reply/commands-registry.runtime-types.d.ts
/** Runtime-injected policy hook for whether text slash commands should be honored. */
type ShouldHandleTextCommands = (params: ShouldHandleTextCommandsParams) => boolean;
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.runtime-types.d.ts
/** Type of the lazy reply dispatcher factory used by runtime dispatch paths. */
type CreateReplyDispatcherWithTyping = typeof createReplyDispatcherWithTyping;
//#endregion
//#region src/channels/plugins/outbound/load.types.d.ts
/**
 * Lazy loader contract for channel outbound adapters.
 */
type LoadChannelOutboundAdapter = (id: ChannelId$1) => Promise<ChannelOutboundAdapter | undefined>;
//#endregion
//#region src/config/sessions/runtime-types.d.ts
/** Runtime hook for reading a session store entry timestamp. */
type ReadSessionUpdatedAt = (params: {
  storePath: string;
  sessionKey: string;
}) => number | undefined;
type RecordSessionMetaFromInbound = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}) => Promise<SessionEntry | null>;
type UpdateLastRoute = (params: {
  storePath: string;
  sessionKey: string;
  channel?: SessionEntry["lastChannel"];
  to?: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  ctx?: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}) => Promise<SessionEntry | null>;
//#endregion
//#region src/plugins/runtime/types-channel.d.ts
type DispatchReplyWithBufferedBlockDispatcher = DispatchReplyWithBufferedBlockDispatcher$1;
type ReadChannelAllowFromStoreForAccount = ReadChannelAllowFromStoreForAccount$1;
type UpsertChannelPairingRequestForAccount = UpsertChannelPairingRequestForAccount$1;
type RecordInboundSession = RecordInboundSession$1;
type RuntimeThreadBindingLifecycleRecord =
  | SessionBindingRecord
  | {
      boundAt: number;
      lastActivityAt: number;
      idleTimeoutMs?: number;
      maxAgeMs?: number;
    };
type PluginRuntimeChannelContextKey = {
  channelId: string;
  accountId?: string | null;
  capability: string;
};
type PluginRuntimeChannelContextEvent = {
  type: "registered" | "unregistered";
  key: {
    channelId: string;
    accountId?: string;
    capability: string;
  };
  context?: unknown;
};
type PluginRuntimeChannelContextRegistry = {
  register: (
    params: PluginRuntimeChannelContextKey & {
      context: unknown;
      abortSignal?: AbortSignal;
    },
  ) => {
    dispose: () => void;
  };
  get: <T = unknown>(params: PluginRuntimeChannelContextKey) => T | undefined;
  watch: (params: {
    channelId?: string;
    accountId?: string | null;
    capability?: string;
    onEvent: (event: PluginRuntimeChannelContextEvent) => void;
  }) => () => void;
};
type PluginRuntimeChannel$1 = {
  text: {
    chunkByNewline: typeof chunkByNewline;
    chunkMarkdownText: typeof chunkMarkdownText;
    chunkMarkdownTextWithMode: typeof chunkMarkdownTextWithMode;
    chunkText: typeof chunkText;
    chunkTextWithMode: typeof chunkTextWithMode;
    resolveChunkMode: typeof resolveChunkMode;
    resolveTextChunkLimit: typeof resolveTextChunkLimit;
    hasControlCommand: typeof hasControlCommand;
    resolveMarkdownTableMode: ResolveMarkdownTableMode;
    convertMarkdownTables: typeof convertMarkdownTables;
  };
  reply: {
    dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
    /**
     * @deprecated Prefer `openclaw/plugin-sdk/channel-outbound` adapters plus
     * `dispatchReplyWithBufferedBlockDispatcher` or channel turn helpers.
     * This is a low-level legacy dispatcher escape hatch.
     */
    createReplyDispatcherWithTyping: CreateReplyDispatcherWithTyping;
    resolveEffectiveMessagesConfig: typeof resolveEffectiveMessagesConfig;
    /**
     * @deprecated Prefer the channel-message reply pipeline helpers. This is
     * tied to the low-level legacy dispatcher path.
     */
    resolveHumanDelayConfig: typeof resolveHumanDelayConfig;
    /**
     * @deprecated Prefer `dispatchReplyWithBufferedBlockDispatcher` with a
     * channel-message adapter or the channel turn helpers. Direct use must
     * manually preserve source reply delivery metadata such as
     * `sourceReplyDeliveryMode`.
     */
    dispatchReplyFromConfig: DispatchReplyFromConfig;
    withReplyDispatcher: typeof withReplyDispatcher;
    settleReplyDispatcher: typeof settleReplyDispatcher;
    /**
     * @deprecated Prefer `buildChannelInboundEventContext` from
     * `openclaw/plugin-sdk/channel-inbound` so inbound event metadata is
     * carried into reply dispatch.
     */
    finalizeInboundContext: typeof finalizeInboundContext;
    formatAgentEnvelope: typeof formatAgentEnvelope /** @deprecated Prefer `BodyForAgent` + structured user-context blocks (do not build plaintext envelopes for prompts). */;
    formatInboundEnvelope: typeof formatInboundEnvelope;
    resolveEnvelopeFormatOptions: typeof resolveEnvelopeFormatOptions;
  };
  routing: {
    buildAgentSessionKey: typeof buildAgentSessionKey;
    resolveAgentRoute: typeof resolveAgentRoute;
  };
  pairing: {
    buildPairingReply: typeof buildPairingReply;
    readAllowFromStore: ReadChannelAllowFromStoreForAccount;
    upsertPairingRequest: UpsertChannelPairingRequestForAccount;
  };
  media: {
    readRemoteMediaBuffer: typeof readRemoteMediaBuffer /** @deprecated Use `readRemoteMediaBuffer`. */;
    fetchRemoteMedia: typeof fetchRemoteMedia;
    saveRemoteMedia: typeof saveRemoteMedia;
    saveResponseMedia: typeof saveResponseMedia;
    saveMediaBuffer: typeof saveMediaBuffer;
  };
  activity: {
    record: typeof recordChannelActivity;
    get: typeof getChannelActivity;
  };
  session: {
    /** @deprecated Prefer channel turn helpers that record inbound sessions as part of dispatch. */ resolveStorePath: typeof resolveStorePath;
    readSessionUpdatedAt: ReadSessionUpdatedAt;
    recordSessionMetaFromInbound: RecordSessionMetaFromInbound /** @deprecated Prefer channel turn helpers that record inbound sessions as part of dispatch. */;
    recordInboundSession: RecordInboundSession;
    updateLastRoute: UpdateLastRoute;
  };
  mentions: {
    buildMentionRegexes: BuildMentionRegexes;
    matchesMentionPatterns: MatchesMentionPatterns;
    matchesMentionWithExplicit: MatchesMentionWithExplicit;
    implicitMentionKindWhen: typeof implicitMentionKindWhen;
    resolveInboundMentionDecision: typeof resolveInboundMentionDecision;
  };
  reactions: {
    createAckReactionHandle: typeof createAckReactionHandle;
    shouldAckReaction: typeof shouldAckReaction;
    removeAckReactionAfterReply: typeof removeAckReactionAfterReply;
    removeAckReactionHandleAfterReply: typeof removeAckReactionHandleAfterReply;
  };
  groups: {
    resolveGroupPolicy: typeof resolveChannelGroupPolicy;
    resolveRequireMention: typeof resolveChannelGroupRequireMention;
  };
  debounce: {
    createInboundDebouncer: typeof createInboundDebouncer;
    resolveInboundDebounceMs: typeof resolveInboundDebounceMs;
  };
  commands: {
    resolveCommandAuthorizedFromAuthorizers: typeof resolveCommandAuthorizedFromAuthorizers;
    isControlCommandMessage: IsControlCommandMessage;
    shouldComputeCommandAuthorized: ShouldComputeCommandAuthorized;
    shouldHandleTextCommands: ShouldHandleTextCommands;
  };
  outbound: {
    loadAdapter: LoadChannelOutboundAdapter;
  };
  inbound: {
    buildContext: typeof buildChannelInboundEventContext;
    run: typeof runChannelInboundEvent /** @deprecated Prefer `run` for raw inbound events or `dispatchReply` for assembled contexts. */;
    runPreparedReply: typeof runPreparedInboundReply;
    dispatchReply: typeof dispatchChannelInboundReply;
  };
  threadBindings: {
    setIdleTimeoutBySessionKey: (params: {
      channelId: string;
      targetSessionKey: string;
      accountId?: string;
      idleTimeoutMs: number;
    }) => RuntimeThreadBindingLifecycleRecord[];
    setMaxAgeBySessionKey: (params: {
      channelId: string;
      targetSessionKey: string;
      accountId?: string;
      maxAgeMs: number;
    }) => RuntimeThreadBindingLifecycleRecord[];
  };
  runtimeContexts: PluginRuntimeChannelContextRegistry;
};
//#endregion
//#region src/plugins/runtime/types.d.ts
type PluginRuntimeChannel = PluginRuntimeChannel$1;
type SubagentRunParams = {
  sessionKey: string;
  message: string /** Add exact tools registered by the calling plugin to the worker's normal tool surface. */;
  toolsAlsoAllow?: string[];
  provider?: string;
  model?: string;
  extraSystemPrompt?: string;
  lane?: string;
  lightContext?: boolean;
  deliver?: boolean;
  idempotencyKey?: string;
  cwd?: string;
};
type PluginManagedWorktree = {
  id: string;
  path: string;
  branch: string;
};
type SubagentRunResult = {
  runId: string;
};
type SubagentWaitParams = {
  runId: string;
  timeoutMs?: number;
};
type SubagentWaitResult = {
  status: "ok" | "error" | "timeout";
  error?: string;
};
type SubagentGetSessionMessagesParams = {
  sessionKey: string;
  limit?: number;
};
type SubagentGetSessionMessagesResult = {
  messages: unknown[];
};
/** @deprecated Use SubagentGetSessionMessagesParams. */
type SubagentGetSessionParams = SubagentGetSessionMessagesParams;
/** @deprecated Use SubagentGetSessionMessagesResult. */
type SubagentGetSessionResult = SubagentGetSessionMessagesResult;
type SubagentDeleteSessionParams = {
  sessionKey: string;
  deleteTranscript?: boolean;
};
type RuntimeNodeListParams = {
  connected?: boolean;
};
type RuntimeNodeListResult = {
  nodes: Array<{
    nodeId: string;
    displayName?: string;
    remoteIp?: string;
    connected?: boolean;
    caps?: string[];
    commands?: string[] /** Advertised commands currently permitted by Gateway node-command policy. */;
    invocableCommands?: string[];
    nodePluginTools?: NodePluginToolDescriptor[];
  }>;
};
type RuntimeNodeInvokeParams = {
  nodeId: string;
  command: string;
  params?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string /** Requested Gateway scopes. Honored only for bundled or trusted official plugins. */;
  scopes?: OperatorScope[];
};
type RuntimeGatewayRequestOptions = {
  timeoutMs?: number /** Requested Gateway scopes. Honored only for bundled or trusted official plugins. */;
  scopes?: OperatorScope[];
};
/** Trusted in-process runtime surface injected into native plugins. */
type PluginRuntime = PluginRuntimeCore & {
  gateway: {
    /** Whether this process owns an active Gateway request context. */ isAvailable: () => Promise<boolean> /** Dispatch a Gateway method as the current trusted plugin. */;
    request: <T = unknown>(
      method: string,
      params?: Record<string, unknown>,
      options?: RuntimeGatewayRequestOptions,
    ) => Promise<T>;
  };
  subagent: {
    run: (params: SubagentRunParams) => Promise<SubagentRunResult>;
    waitForRun: (params: SubagentWaitParams) => Promise<SubagentWaitResult>;
    getSessionMessages: (
      params: SubagentGetSessionMessagesParams,
    ) => Promise<SubagentGetSessionMessagesResult> /** @deprecated Use getSessionMessages. */;
    getSession: (params: SubagentGetSessionParams) => Promise<SubagentGetSessionResult>;
    deleteSession: (params: SubagentDeleteSessionParams) => Promise<void>;
  };
  nodes: {
    list: (params?: RuntimeNodeListParams) => Promise<RuntimeNodeListResult>;
    invoke: (params: RuntimeNodeInvokeParams) => Promise<unknown>;
  };
  sandbox: {
    resolveWorkspaceAuthority: (params: {
      config: OpenClawConfig;
      agentId?: string;
      confinedToolNames?: readonly string[];
      requiredToolNames?: readonly string[];
      modelProvider?: string;
      modelId?: string;
      sessionKey: string;
    }) => {
      sandboxed: boolean;
      workspaceAccess: "none" | "ro" | "rw";
      confinementError?: string;
    };
    prepareWorkspaceAuthority: (params: {
      config: OpenClawConfig;
      agentId?: string;
      confinedToolNames?: readonly string[];
      requiredToolNames?: readonly string[];
      modelProvider?: string;
      modelId?: string;
      sessionKey: string;
      workspaceDir: string;
    }) => Promise<{
      sandboxed: boolean;
      workspaceAccess: "none" | "ro" | "rw";
      confinementError?: string;
    }>;
  };
  worktrees: {
    resolveCheckoutRoot: (params: { path: string }) => Promise<string | undefined>;
    hasSelfContainedCheckoutMetadata?: (params: { path: string }) => Promise<boolean>;
    create: (params: {
      repoRoot: string;
      name: string;
      baseRef?: string;
      ownerKind: "workboard";
      ownerId: string;
    }) => Promise<PluginManagedWorktree>;
    release: (params: { path: string }) => Promise<void>;
    removeIfLossless: (params: {
      path: string;
      ownerKind: "workboard";
      ownerId: string;
    }) => Promise<boolean>;
  };
  channel: PluginRuntimeChannel;
};
type CreatePluginRuntimeOptions = {
  subagent?: PluginRuntime["subagent"];
  nodes?: PluginRuntime["nodes"];
  allowGatewaySubagentBinding?: boolean;
};
//#endregion
//#region src/plugins/types.node-host.d.ts
type OpenClawPluginNodeHostCommandAvailabilityContext = {
  /** Node-local configuration used to build this host's Gateway declaration. */ config: OpenClawConfig /** Node-host process environment. */;
  env: NodeJS.ProcessEnv;
};
type OpenClawPluginNodeHostCommandIo = {
  emitChunk(chunk: string): Promise<void>;
  onInput(callback: (payloadJSON: string) => void): void;
  signal: AbortSignal;
};
type OpenClawPluginNodeHostCommandBase = {
  command: string;
  cap?: string;
  dangerous?: boolean /** Return false to omit this command and capability from the node declaration. */;
  isAvailable?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => boolean;
  agentTool?: {
    name: string;
    description: string;
    parameters?: Record<
      string,
      unknown
    > /** Platforms where this tool is allowlisted by default; omit for explicit config only. */;
    defaultPlatforms?: Array<"ios" | "android" | "macos" | "windows" | "linux" | "unknown">;
    mcp?: {
      server: string;
      tool: string;
    };
  };
};
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommandBase & {
  duplex?: boolean;
  handle: (paramsJSON?: string | null, io?: OpenClawPluginNodeHostCommandIo) => Promise<string>;
};
//#endregion
//#region src/plugins/types.d.ts
type ModelProviderRequestTransportOverrides = ModelProviderRequestTransportOverrides$1;
type ChannelId = ChannelId$1;
type ChannelPlugin = ChannelPlugin$1;
type PluginConfigValidation =
  | {
      ok: true;
      value?: unknown;
    }
  | {
      ok: false;
      errors: string[];
    };
/**
 * Config schema contract accepted by plugin manifests and runtime registration.
 *
 * Plugins can provide a Zod-like parser, a lightweight `validate(...)`
 * function, or both. `uiHints` and `jsonSchema` are optional extras for docs,
 * forms, and config UIs.
 */
type OpenClawPluginConfigSchema = {
  safeParse?: (value: unknown) => {
    success: boolean;
    data?: unknown;
    error?: {
      issues?: Array<{
        path: Array<string | number>;
        message: string;
      }>;
    };
  };
  parse?: (value: unknown) => unknown;
  validate?: (value: unknown) => PluginConfigValidation;
  uiHints?: Record<string, PluginConfigUiHint>;
  jsonSchema?: JsonSchemaObject;
};
type ProviderAuthKind = "oauth" | "api_key" | "token" | "device_code" | "custom";
/** Standard result payload returned by provider auth methods. */
type ProviderAuthResult = {
  profiles: Array<{
    profileId: string;
    credential: AuthProfileCredential;
  }>;
  /**
   * Optional config patch to merge after credentials are written.
   *
   * Use this for provider-owned onboarding defaults such as
   * `models.providers.<id>` entries, default aliases, or agent model helpers.
   * The caller still persists auth-profile bindings separately.
   */
  configPatch?: Partial<OpenClawConfig>;
  defaultModel?: string;
  notes?: string[];
  /**
   * Opt in to replace `agents.defaults.models` wholesale with the patch map.
   * Default behavior merges the map so other providers' entries survive.
   * Set only from migrations that intentionally rename/remove model keys.
   */
  replaceDefaultModels?: boolean;
};
/** Interactive auth context passed to provider login/setup methods. */
type ProviderAuthContext = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  agentDir?: string;
  workspaceDir?: string;
  prompter: WizardPrompter;
  runtime: RuntimeEnv /** Cancels browser callbacks, device polling, and other app-owned auth work. */;
  signal?: AbortSignal;
  /**
   * Optional onboarding CLI options that triggered this auth flow.
   *
   * Present for setup/configure/auth-choice flows so provider methods can
   * honor preseeded flags like `--openai-api-key` or generic
   * `--token/--token-provider` pairs. Direct `models auth login` usually
   * leaves this undefined.
   */
  opts?: ProviderAuthOptionBag;
  /**
   * Onboarding secret persistence preference.
   *
   * Interactive wizard flows set this when the caller explicitly requested
   * plaintext or env/file/exec ref storage. Ad-hoc `models auth login` flows
   * usually leave it undefined.
   */
  secretInputMode?: SecretInputMode;
  /**
   * Whether the provider auth flow should offer the onboarding secret-storage
   * mode picker when `secretInputMode` is unset.
   *
   * This is true for onboarding/configure flows and false for direct
   * `models auth` commands, which should keep a tighter, provider-owned prompt
   * surface.
   */
  allowSecretRefPrompt?: boolean;
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  oauth: {
    createVpsAwareHandlers: typeof createVpsAwareOAuthHandlers;
  };
};
type ProviderNonInteractiveApiKeyResult = {
  key: string;
  source: "profile" | "env" | "flag";
  envVarName?: string;
};
type ProviderResolveNonInteractiveApiKeyParams = {
  provider: string;
  flagValue?: string;
  flagName: `--${string}`;
  envVar: string;
  envVarName?: string;
  allowProfile?: boolean;
  required?: boolean;
};
type ProviderNonInteractiveApiKeyCredentialParams = {
  provider: string;
  resolved: ProviderNonInteractiveApiKeyResult;
  email?: string;
  metadata?: Record<string, string>;
};
type ProviderAuthMethodNonInteractiveContext = {
  authChoice: string;
  config: OpenClawConfig;
  baseConfig: OpenClawConfig;
  opts: ProviderAuthOptionBag;
  runtime: RuntimeEnv;
  agentDir?: string;
  workspaceDir?: string;
  resolveApiKey: (
    params: ProviderResolveNonInteractiveApiKeyParams,
  ) => Promise<ProviderNonInteractiveApiKeyResult | null>;
  toApiKeyCredential: (
    params: ProviderNonInteractiveApiKeyCredentialParams,
  ) => ApiKeyCredential | null;
};
type ProviderAuthMethod = {
  id: string;
  label: string;
  hint?: string;
  kind: ProviderAuthKind /** Provider-owned model used to validate app-guided secret setup. */;
  starterModel?: string;
  /**
   * Optional wizard/onboarding metadata for this specific auth method.
   *
   * Use this when one provider exposes multiple setup entries (for example API
   * key + OAuth, or region-specific login flows). OpenClaw uses this to expose
   * method-specific auth choices while keeping the provider id stable.
   */
  wizard?: ProviderPluginWizardSetup;
  run: (ctx: ProviderAuthContext) => Promise<ProviderAuthResult>;
  runNonInteractive?: (
    ctx: ProviderAuthMethodNonInteractiveContext,
  ) => Promise<OpenClawConfig | null>;
};
type ProviderCatalogOrder = "simple" | "profile" | "paired" | "late";
type ProviderCatalogContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  resolveProviderApiKey: (providerId?: string) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
  };
  resolveProviderAuth: (
    providerId?: string,
    options?: {
      oauthMarker?: string;
    },
  ) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
    mode: "api_key" | "aws-sdk" | "oauth" | "token" | "none";
    source: "env" | "profile" | "none";
    profileId?: string;
  };
};
type ProviderCatalogResult =
  | {
      provider: ModelProviderConfig;
    }
  | {
      providers: Record<string, ModelProviderConfig>;
    }
  | null
  | undefined;
type ProviderPluginCatalog = {
  order?: ProviderCatalogOrder;
  run: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
};
type UnifiedModelCatalogProviderContext = ProviderCatalogContext & {
  signal?: AbortSignal;
  includeLive?: boolean;
  timeoutMs?: number;
};
type UnifiedModelCatalogProviderPlugin = {
  provider: string;
  kinds: readonly UnifiedModelCatalogKind[];
  staticCatalog?: (
    ctx: UnifiedModelCatalogProviderContext,
  ) =>
    | readonly UnifiedModelCatalogEntry[]
    | Promise<readonly UnifiedModelCatalogEntry[] | null | undefined>
    | null
    | undefined;
  liveCatalog?: (
    ctx: UnifiedModelCatalogProviderContext,
  ) =>
    | readonly UnifiedModelCatalogEntry[]
    | Promise<readonly UnifiedModelCatalogEntry[] | null | undefined>
    | null
    | undefined;
};
type ProviderRuntimeProviderConfig = {
  baseUrl?: string;
  api?: ModelProviderConfig["api"];
  auth?: ModelProviderConfig["auth"];
  models?: ModelProviderConfig["models"];
  headers?: unknown;
};
/**
 * Sync hook for provider-owned model ids that are not present in the local
 * registry/catalog yet.
 *
 * Use this for pass-through providers or provider-specific forward-compat
 * behavior. The hook should be cheap and side-effect free; async refreshes
 * belong in `prepareDynamicModel`.
 */
type ProviderResolveDynamicModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  agentRuntimeId?: string;
  provider: string;
  modelId: string;
  modelRegistry: ModelRegistry;
  providerConfig?: ProviderRuntimeProviderConfig;
  authProfileId?: string;
  authProfileMode?: AuthProfileCredential["type"] | "aws-sdk";
};
/**
 * Optional async warm-up for dynamic model resolution.
 *
 * Called only from async model resolution paths, before retrying
 * `resolveDynamicModel`. This is the place to refresh caches or fetch provider
 * metadata over the network.
 */
type ProviderPrepareDynamicModelContext = ProviderResolveDynamicModelContext;
type ProviderPreferRuntimeResolvedModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
};
/**
 * Last-chance rewrite hook for provider-owned transport normalization.
 *
 * Runs after OpenClaw resolves an explicit/discovered/dynamic model and before
 * the embedded runner uses it. Typical uses: swap API ids, fix base URLs, or
 * patch provider-specific compat bits.
 */
type ProviderNormalizeResolvedModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
};
/**
 * Provider-owned model-id normalization before config/runtime lookup.
 *
 * Use this for provider-specific alias cleanup that should stay with the
 * plugin rather than in core string tables.
 */
type ProviderNormalizeModelIdContext = {
  provider: string;
  modelId: string;
};
/**
 * Provider-owned transport normalization for arbitrary provider/model config.
 *
 * Use this when transport cleanup depends on API/baseUrl rather than the
 * owning provider id, for example custom providers that still target a
 * plugin-owned transport family.
 */
type ProviderNormalizeTransportContext = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  provider: string;
  modelId?: string;
  api?: string | null;
  baseUrl?: string;
};
/**
 * Runtime auth input for providers that need an extra exchange step before
 * inference. The incoming `apiKey` is the raw credential resolved from auth
 * profiles/env/config. The returned value should be the actual token/key to use
 * for the request.
 */
type ProviderPrepareRuntimeAuthContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
  apiKey: string;
  authMode: string;
  profileId?: string;
};
/**
 * Result of `prepareRuntimeAuth`.
 *
 * `apiKey` is required and becomes the runtime credential stored in auth
 * storage. `baseUrl` is optional and lets providers like GitHub Copilot swap to
 * an entitlement-specific endpoint at request time. `expiresAt` enables generic
 * background refresh in long-running turns.
 */
type ProviderPreparedRuntimeAuth = {
  apiKey: string;
  baseUrl?: string;
  request?: ModelProviderRequestTransportOverrides;
  expiresAt?: number;
};
/**
 * Usage/billing auth input for providers that expose quota/usage endpoints.
 *
 * This hook is intentionally separate from `prepareRuntimeAuth`: usage
 * snapshots often need a different credential source than live inference
 * requests, and they run outside the embedded runner.
 *
 * The helper methods cover the common OpenClaw auth resolution paths:
 *
 * - `resolveApiKeyFromConfigAndStore`: env/config/plain token/api_key profiles
 * - `resolveOAuthToken`: oauth/token profiles resolved through the auth store,
 *   optionally for an explicit provider override
 *
 * Plugins can still do extra provider-specific work on top (for example parse a
 * token blob, read a legacy credential file, or pick between aliases).
 */
type ProviderResolveUsageAuthContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  resolveApiKeyFromConfigAndStore: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) =>
    | string
    | undefined /** Ordered API-key/token candidates, including resolved SecretRefs, for credential classification. */;
  resolveApiKeyCandidatesFromConfigAndStore?: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) => Promise<string[]>;
  resolveOAuthToken: (params?: { provider?: string }) => Promise<ProviderUsageAuthToken | null>;
};
type ProviderUsageAuthToken = {
  token: string;
  accountId?: string /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */;
  subscriptionType?: string;
  rateLimitTier?: string /** Account email captured on the resolved credential, when known. */;
  email?: string;
};
/**
 * Result of `resolveUsageAuth`.
 *
 * Two shapes are supported:
 * - `{ token: string; accountId?: string }` — use this token for provider usage endpoints.
 * - `{ handled: true }` — this provider handled the request but has no usable
 *   usage token; core must skip further fallback (generic API-key/OAuth fallback
 *   must not run).
 *
 * Returning `null` or `undefined` means "not handled by this provider"; core
 * proceeds to generic fallback resolution.
 */
type ProviderResolvedUsageAuth =
  | ProviderUsageAuthToken
  | {
      handled: true;
    };
/**
 * Usage/quota snapshot input for providers that own their usage endpoint
 * fetch/parsing behavior.
 *
 * This hook runs after `resolveUsageAuth` succeeds. Core still owns summary
 * fan-out, timeout wrapping, filtering, and formatting; the provider plugin
 * owns the provider-specific HTTP request + response normalization.
 */
type ProviderFetchUsageSnapshotContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  token: string;
  accountId?: string;
  authProfileId?: string /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */;
  subscriptionType?: string;
  rateLimitTier?: string /** Account email captured on the resolved credential, when known. */;
  email?: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
};
/**
 * Provider-owned auth-doctor hint input.
 *
 * Called when OAuth refresh fails and OpenClaw wants a provider-specific repair
 * hint to append to the generic re-auth message. Use this for legacy profile-id
 * migrations or other provider-owned auth-store cleanup guidance.
 */
type ProviderAuthDoctorHintContext = {
  config?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  profileId?: string;
};
/**
 * Provider-owned extra-param normalization before OpenClaw builds its generic
 * stream option wrapper.
 *
 * Use this to set provider defaults or rewrite provider-specific config keys
 * into the merged `extraParams` object. Return the full next extraParams object.
 */
/** Provider-facing effort after OpenClaw lowers orchestration-only modes. */
type ProviderTransportThinkingLevel = Exclude<ThinkLevel, "ultra">;
type ProviderPrepareExtraParamsContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  agentId?: string;
  nativeWebSearchAllowedByToolPolicy?: boolean;
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  extraParams?: Record<string, unknown>;
  thinkingLevel?: ProviderTransportThinkingLevel;
};
type ProviderExtraParamsForTransportContext = Omit<
  ProviderPrepareExtraParamsContext,
  "extraParams"
> & {
  model?: ProviderRuntimeModel;
  transport?: "sse" | "websocket" | "auto";
  extraParams: Record<string, unknown>;
};
type ProviderExtraParamsForTransportResult = {
  patch?: Record<string, unknown> | null;
};
type ProviderResolvePromptOverlayContext = ProviderSystemPromptContributionContext & {
  baseOverlay?: ProviderSystemPromptContribution;
};
type ProviderFollowupFallbackRouteContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  payload: ReplyPayload;
  originatingChannel?: string;
  originatingTo?: string;
  originRoutable: boolean;
  dispatcherAvailable: boolean;
};
type ProviderFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};
type ProviderResolveAuthProfileIdContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  preferredProfileId?: string;
  lockedProfileId?: string;
  profileOrder: string[];
  authStore: AuthProfileStore;
};
type ProviderReplaySanitizeMode = "full" | "images-only";
type ProviderReplayToolCallIdMode = "strict" | "strict9";
type ProviderReasoningOutputMode = "native" | "tagged";
/**
 * @deprecated Legacy static provider capability bag.
 *
 * Core replay/runtime ownership now lives on explicit provider hooks such as
 * `buildReplayPolicy`, `normalizeToolSchemas`, and `wrapStreamFn`. OpenClaw no
 * longer reads this bag at runtime, but the field remains typed so existing
 * third-party plugins do not fail to compile immediately.
 */
type ProviderCapabilities = Record<string, unknown>;
/**
 * Provider-owned replay/compaction transcript policy.
 *
 * These values are consumed by shared history replay and compaction logic.
 * Return only the fields the provider wants to override; core fills the rest
 * with its default policy.
 */
type ProviderReplayPolicy = {
  sanitizeMode?: ProviderReplaySanitizeMode;
  sanitizeToolCallIds?: boolean;
  toolCallIdMode?: ProviderReplayToolCallIdMode;
  duplicateToolCallIdStyle?: "openai";
  preserveNativeAnthropicToolUseIds?: boolean;
  preserveSignatures?: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  dropThinkingBlocks?: boolean;
  dropReasoningFromHistory?: boolean;
  repairToolUseResultPairing?: boolean;
  applyAssistantFirstOrderingFix?: boolean;
  validateGeminiTurns?: boolean;
  validateAnthropicTurns?: boolean;
  allowSyntheticToolResults?: boolean;
};
/**
 * Provider-owned replay/compaction policy input.
 *
 * Use this when transcript replay rules depend on provider/model transport
 * behavior and should stay with the provider plugin instead of core tables.
 */
type ProviderReplayPolicyContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  provider: string;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
};
type ProviderReplaySessionEntry = {
  customType: string;
  data?: unknown;
};
type ProviderReplaySessionState = {
  getCustomEntries(): ProviderReplaySessionEntry[];
  appendCustomEntry(customType: string, data: unknown): void;
};
/**
 * Provider-owned replay-history sanitization input.
 *
 * Runs after core applies generic transcript cleanup so plugins can make
 * provider-specific replay rewrites without owning the whole compaction flow.
 */
type ProviderSanitizeReplayHistoryContext = ProviderReplayPolicyContext & {
  sessionId: string;
  messages: AgentMessage[];
  allowedToolNames?: Iterable<string>;
  sessionState?: ProviderReplaySessionState;
};
/**
 * Provider-owned final replay-turn validation input.
 *
 * Use this for providers that require strict turn ordering or additional
 * replay-time transcript validation beyond generic sanitation.
 */
type ProviderValidateReplayTurnsContext = ProviderReplayPolicyContext & {
  sessionId?: string;
  messages: AgentMessage[];
  sessionState?: ProviderReplaySessionState;
};
/**
 * Provider-owned tool-schema normalization input.
 *
 * Runs before tool registration for replay/compaction/inference so providers
 * can rewrite schema keywords that their transport family does not support.
 */
type ProviderNormalizeToolSchemasContext = ProviderReplayPolicyContext & {
  tools: AnyAgentTool[];
};
type ProviderToolSchemaDiagnostic = {
  toolName: string;
  toolIndex?: number;
  violations: string[];
};
/**
 * Provider-owned reasoning output mode input.
 *
 * Use this when a provider requires a specific reasoning-output contract, such
 * as text tags instead of native structured reasoning fields.
 */
type ProviderReasoningOutputModeContext = ProviderReplayPolicyContext;
/**
 * Provider-owned transport creation.
 *
 * Use this when the provider needs to replace shared model runtime's default transport with a
 * custom StreamFn (for example a native API transport that cannot be expressed
 * as a wrapper around `streamSimple`).
 */
type ProviderCreateStreamFnContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
};
/**
 * Provider-owned stream wrapper hook after OpenClaw applies its generic
 * transport-independent wrappers.
 *
 * Use this for provider-specific payload/header/model mutations that still run
 * through the normal `shared model runtime` stream path.
 */
type ProviderWrapStreamFnContext = ProviderPrepareExtraParamsContext & {
  model?: ProviderRuntimeModel;
  streamFn?: StreamFn$1;
};
/**
 * Provider-owned transport turn state.
 *
 * Use this for provider-native request headers or metadata that should stay
 * stable across retries while still being attached by generic core transports.
 */
type ProviderTransportTurnState = {
  headers?: Record<string, string>;
  metadata?: Record<string, string>;
};
/**
 * Provider-owned request identity for transport turns.
 *
 * Use this when the provider exposes native request/session metadata that must
 * be attached by both HTTP and WebSocket transports.
 */
type ProviderResolveTransportTurnStateContext = {
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  sessionId?: string;
  turnId: string;
  attempt: number;
  transport: "stream" | "websocket";
};
/**
 * Provider-owned WebSocket session policy.
 *
 * Use this for session-scoped headers or cool-down behavior that should apply
 * before a generic WebSocket transport decides to retry or fall back.
 */
type ProviderWebSocketSessionPolicy = {
  headers?: Record<string, string>;
  degradeCooldownMs?: number;
};
/**
 * Provider-owned WebSocket session policy input.
 *
 * Use this when the provider wants to control native session handshake headers
 * or the post-failure cool-down window for a generic WebSocket transport.
 */
type ProviderResolveWebSocketSessionPolicyContext = {
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  sessionId?: string;
};
/**
 * Provider-owned failover error classification input.
 *
 * Use this when provider-specific transport or API errors need classification
 * hints that generic string matching cannot express safely.
 */
type ProviderFailoverErrorContext = {
  provider?: string;
  modelId?: string;
  errorMessage: string;
  status?: number;
  code?: string;
  errorType?: string;
};
/**
 * Generic embedding provider shape returned by provider plugins.
 *
 * Keep this aligned with the memory embedding contract without forcing the
 * plugin system to import memory internals directly.
 */
type PluginEmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (
    text: string,
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<number[]>;
  embedBatch: (
    texts: string[],
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<number[][]>;
  embedBatchInputs?: (
    inputs: unknown[],
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<number[][]>;
  client?: unknown;
};
/**
 * Provider-owned embedding transport creation.
 *
 * Use this when a provider wants memory embeddings to live with the provider
 * plugin instead of the core memory switchboard.
 */
type ProviderCreateEmbeddingProviderContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  model: string;
  remote?: {
    baseUrl?: string;
    apiKey?: unknown;
    headers?: Record<string, string>;
  };
  providerApiKey?: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
  taskType?: string;
};
/**
 * Provider-owned prompt-cache eligibility.
 *
 * Return `true` or `false` to override OpenClaw's built-in provider cache TTL
 * detection for this provider. Return `undefined` to fall back to core rules.
 */
type ProviderCacheTtlEligibilityContext = {
  provider: string;
  modelId: string;
  modelApi?: string;
};
/**
 * Provider-owned missing-auth message override.
 *
 * Runs only after OpenClaw exhausts normal env/profile/config auth resolution
 * for the requested provider. Return a custom message to replace the generic
 * "No API key found" error.
 */
type ProviderBuildMissingAuthMessageContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  listProfileIds: (providerId: string) => string[];
};
/**
 * Provider-owned unknown-model hint override.
 *
 * Runs after catalog/runtime lookup misses for the requested provider. Return a
 * hint suffix that OpenClaw should append to the generic `Unknown model`
 * error.
 */
type ProviderBuildUnknownModelHintContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  baseUrl?: string;
};
/**
 * Built-in model suppression hook context.
 *
 * @deprecated Use manifest `modelCatalog.suppressions`. Runtime suppression
 * hooks are no longer called by model resolution.
 */
type ProviderBuiltInModelSuppressionContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  baseUrl?: string;
};
type ProviderBuiltInModelSuppressionResult = {
  suppress: boolean;
  errorMessage?: string;
};
/**
 * Provider-owned "modern model" policy input.
 *
 * Live smoke/model-profile selection uses this to keep provider-specific
 * inclusion/exclusion rules out of core.
 */
type ProviderModernModelPolicyContext = {
  provider: string;
  modelId: string;
};
/**
 * Final catalog augmentation hook.
 *
 * Runs after OpenClaw loads the discovered model catalog and merges configured
 * opt-in providers. Use this for forward-compat rows or vendor-owned synthetic
 * entries that should appear in `models list` and model pickers even when the
 * upstream registry has not caught up yet.
 */
type ProviderAugmentModelCatalogContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  resolveProviderApiKey?: ProviderCatalogContext["resolveProviderApiKey"];
  entries: ModelCatalogEntry[];
};
/**
 * @deprecated Use ProviderCatalogOrder.
 */
type ProviderDiscoveryOrder = ProviderCatalogOrder;
/**
 * @deprecated Use ProviderCatalogContext.
 */
type ProviderDiscoveryContext = ProviderCatalogContext;
/**
 * @deprecated Use ProviderCatalogResult.
 */
type ProviderDiscoveryResult = ProviderCatalogResult;
/**
 * @deprecated Use ProviderPluginCatalog.
 */
type ProviderPluginDiscovery = ProviderPluginCatalog;
type ProviderPluginWizardSetup = {
  choiceId?: string;
  choiceLabel?: string;
  choiceHint?: string;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
  onboardingFeatured?: boolean;
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  methodId?: string;
  /**
   * Interactive onboarding surfaces where this auth choice should appear.
   * Defaults to `["text-inference"]` when omitted.
   */
  onboardingScopes?: Array<"text-inference" | "image-generation" | "music-generation">;
  /**
   * Optional model-allowlist prompt policy applied after this auth choice is
   * selected in configure/onboarding flows.
   *
   * Keep this UI-facing and static. Provider logic that needs runtime state
   * should stay in `run`/`runNonInteractive`.
   */
  modelAllowlist?: {
    allowedKeys?: string[];
    initialSelections?: string[];
    loadCatalog?: boolean;
    message?: string;
  };
  /**
   * Optional default-model prompt policy for this auth/setup choice.
   *
   * Use this when selecting the auth choice should still force a model picker
   * even if the choice was preseeded via CLI/configure, or when "keep current"
   * would skip required provider-owned post-selection work.
   */
  modelSelection?: {
    promptWhenAuthChoiceProvided?: boolean;
    allowKeepCurrent?: boolean;
  };
};
/** Optional model-picker metadata shown in interactive provider selection flows. */
type ProviderPluginWizardModelPicker = {
  label?: string;
  hint?: string;
  methodId?: string;
};
/** UI metadata that lets provider plugins appear in onboarding and configure flows. */
type ProviderPluginWizard = {
  setup?: ProviderPluginWizardSetup;
  modelPicker?: ProviderPluginWizardModelPicker;
};
type ProviderOAuthProfileIdRepair = {
  /**
   * Legacy OAuth profile id to migrate away from.
   *
   * When omitted, OpenClaw falls back to `<provider>:default`.
   */
  legacyProfileId?: string;
  /**
   * Optional custom doctor prompt label.
   *
   * Defaults to the provider label when omitted.
   */
  promptLabel?: string;
};
type ProviderModelSelectedContext = {
  config: OpenClawConfig;
  model: string;
  prompter: WizardPrompter;
  agentDir?: string;
  workspaceDir?: string;
};
type ProviderDeferSyntheticProfileAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
  resolvedApiKey?: string;
};
type ProviderSystemPromptContributionContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  promptMode: PromptMode;
  runtimeChannel?: string;
  runtimeCapabilities?: string[];
  agentId?: string;
  trigger?: "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
};
type ProviderTransformSystemPromptContext = ProviderSystemPromptContributionContext & {
  systemPrompt: string;
};
type PluginTextTransformRegistration = PluginTextTransforms;
/** JSON-compatible provider settings for one configured worker profile. */
type WorkerProfile = Readonly<Record<string, PluginJsonValue>>;
/** SSH endpoint material returned by a worker provider after provisioning. */
type WorkerSshEndpoint = {
  host: string;
  port: number;
  user: string /** OpenSSH public host-key line obtained from trusted provisioning output. */;
  hostKey: string /** Secret reference only; providers must never return plaintext key material. */;
  keyRef: SecretRef;
};
/** Resolved SSH client identity. Providers may return a local path or ephemeral material. */
type WorkerSshIdentity =
  | {
      kind: "path";
      path: string;
    }
  | {
      kind: "material";
      contents: string;
    };
/** Durable context supplied when a worker provider resolves the identity it minted. */
type WorkerSshIdentityRequest = {
  leaseId: string;
  profile: WorkerProfile;
  keyRef: SecretRef;
};
/** Durable lease identity and endpoint returned by a successful provision operation. */
type WorkerLease = {
  leaseId: string;
  ssh: WorkerSshEndpoint;
};
/** Authoritative inspection result for an already-known worker lease. */
type WorkerLeaseStatus =
  | {
      status: "active";
    }
  | {
      status: "destroyed";
    }
  | {
      status: "unknown";
    };
/** Permanent provider rejection recorded as a terminal worker failure. */
declare class WorkerProviderError extends Error {
  readonly code = "invalid_profile";
  constructor(message: string);
}
/** Cloud-worker lifecycle capability registered by a plugin. */
type WorkerProvider = {
  id: string;
  /**
   * Provision or adopt the lease for this operation id.
   * Repeating the same operation id must be idempotent across gateway restarts.
   */
  provision: (
    profile: WorkerProfile,
    operationId: string,
  ) => Promise<WorkerLease> /** Throws on transient/indeterminate failures; `unknown` means authoritative absence. */;
  inspect: (lease: { leaseId: string; profile: WorkerProfile }) => Promise<WorkerLeaseStatus>;
  /**
   * Resolves provider-owned dynamic identities. When absent, the gateway uses its generic
   * SecretRef resolver; when present, failures are authoritative and never fall back.
   */
  resolveSshIdentity?: (request: WorkerSshIdentityRequest) => Promise<WorkerSshIdentity>;
  renew?: (
    leaseId: string,
  ) => Promise<void> /** Idempotent; resolves only after the provider can prove teardown. */;
  destroy: (lease: { leaseId: string; profile: WorkerProfile }) => Promise<void>;
};
/** Text-inference provider capability registered by a plugin. */
type ProviderPlugin = {
  id: string;
  pluginId?: string;
  label: string;
  docsPath?: string;
  aliases?: string[];
  /**
   * Internal-only aliases used for runtime/config hook lookup.
   *
   * Unlike `aliases`, these values are not treated as user-facing provider ids
   * for auth/setup surfaces. Use them for legacy config keys or compat-only
   * hook routing.
   */
  hookAliases?: string[];
  /**
   * Provider-related env vars shown in setup/search/help surfaces.
   *
   * Keep entries in preferred display order. This can include direct auth env
   * vars or setup inputs such as OAuth client id/secret vars.
   */
  envVars?: string[];
  auth: ProviderAuthMethod[];
  /**
   * Legacy text-provider catalog hook.
   *
   * @deprecated New catalog/control-plane surfaces should use
   * `api.registerModelCatalogProvider`. This hook remains the text runtime
   * source until the unified loader fully replaces it.
   * Returns provider config/model definitions that merge into models.providers.
   */
  catalog?: ProviderPluginCatalog;
  /**
   * Legacy offline text-provider catalog hook for display-only surfaces.
   *
   * @deprecated New static rows should be registered with
   * `api.registerModelCatalogProvider`.
   *
   * Unlike `catalog`, this hook must not perform network I/O or require real
   * credentials. Use it for bundled/static rows that can be shown before auth is
   * configured.
   */
  staticCatalog?: ProviderPluginCatalog;
  /**
   * Show catalog row labels as the literal `<provider>/<entry.id>`
   * composition instead of the canonical (deduped) key.
   *
   * `modelKey` strips a duplicate `<provider>/` prefix so storage and
   * lookups stay stable. This flag only changes the picker label — the
   * option value and persisted config remain canonical.
   *
   * Set when the leading `<provider>/` segment in the native model id is
   * a meaningful vendor namespace (e.g. NVIDIA's `nvidia/nemotron-...`
   * alongside `moonshotai/kimi-k2.5`).
   */
  preserveLiteralProviderPrefix?: boolean;
  /**
   * @deprecated Use catalog.
   *
   * Legacy alias for catalog.
   * Kept for compatibility with existing provider plugins.
   */
  discovery?: ProviderPluginDiscovery;
  /**
   * Sync runtime fallback for model ids not present in the local catalog.
   *
   * Hook order:
   * 1. discovered/static model lookup
   * 2. plugin `resolveDynamicModel`
   * 3. core fallback heuristics
   * 4. generic provider-config fallback
   *
   * Keep this hook cheap and deterministic. If you need network I/O first, use
   * `prepareDynamicModel` to prime state for the async retry path.
   */
  resolveDynamicModel?: (
    ctx: ProviderResolveDynamicModelContext,
  ) => ProviderRuntimeModel | null | undefined;
  /**
   * Optional async prefetch for dynamic model resolution.
   *
   * OpenClaw calls this only from async model resolution paths. After it
   * completes, `resolveDynamicModel` is called again.
   */
  prepareDynamicModel?: (ctx: ProviderPrepareDynamicModelContext) => Promise<void>;
  /**
   * Lets a provider plugin opt exact configured models into a runtime
   * metadata comparison pass before the embedded runner returns the explicit
   * entry unchanged.
   */
  preferRuntimeResolvedModel?: (ctx: ProviderPreferRuntimeResolvedModelContext) => boolean;
  /**
   * Provider-owned transport normalization.
   *
   * Use this to rewrite a resolved model without forking the generic runner:
   * swap API ids, update base URLs, or adjust compat flags for a provider's
   * transport quirks.
   */
  normalizeResolvedModel?: (
    ctx: ProviderNormalizeResolvedModelContext,
  ) => ProviderRuntimeModel | null | undefined;
  /**
   * Provider-owned model-id normalization.
   *
   * Runs before model lookup/canonicalization. Use this for alias cleanup such
   * as provider-owned preview/legacy model ids.
   */
  normalizeModelId?: (ctx: ProviderNormalizeModelIdContext) => string | null | undefined;
  /**
   * Provider-owned transport-family normalization before generic model
   * assembly.
   *
   * Use this for API/baseUrl cleanup that may apply to custom provider ids
   * which still target the provider's transport family.
   */
  normalizeTransport?: (ctx: ProviderNormalizeTransportContext) =>
    | {
        api?: string | null;
        baseUrl?: string;
      }
    | null
    | undefined;
  /**
   * Provider-owned config normalization for `models.providers.<id>`.
   *
   * Use this for provider-specific baseUrl/model-id cleanup that should stay
   * with the plugin rather than in core config-policy tables.
   */
  normalizeConfig?: (ctx: ProviderNormalizeConfigContext) => ModelProviderConfig | null | undefined;
  /**
   * Provider-owned final native-streaming compat pass for config providers.
   *
   * Use this when a provider opts specific native base URLs into
   * `supportsUsageInStreaming` or similar transport compatibility flags.
   */
  applyNativeStreamingUsageCompat?: (
    ctx: ProviderNormalizeConfigContext,
  ) => ModelProviderConfig | null | undefined;
  /**
   * Provider-owned config apiKey/env marker resolution.
   *
   * Use this when a provider resolves auth from env vars such as AWS/GCP
   * markers rather than a normal API-key env var.
   */
  resolveConfigApiKey?: (ctx: ProviderResolveConfigApiKeyContext) => string | null | undefined;
  /**
   * @deprecated Legacy static capability bag kept only for compatibility.
   *
   * New provider behavior should use explicit hooks instead. Core replay and
   * stream/runtime logic no longer consumes this field.
   */
  capabilities?: ProviderCapabilities;
  /**
   * Provider-owned replay/compaction policy override.
   *
   * Use this when transcript replay or compaction should follow provider-owned
   * rules that are more expressive than the static `capabilities` bag.
   */
  buildReplayPolicy?: (ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined;
  /**
   * Provider-owned replay-history sanitization.
   *
   * Runs after OpenClaw performs generic transcript cleanup. Use this for
   * provider-specific replay rewrites that should stay with the provider
   * plugin rather than in shared core compaction helpers.
   */
  sanitizeReplayHistory?: (
    ctx: ProviderSanitizeReplayHistoryContext,
  ) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /**
   * Provider-owned final replay-turn validation.
   *
   * Use this when provider transports need stricter replay-time validation or
   * turn reshaping after generic sanitation. Returning a non-null value
   * replaces the built-in replay validators rather than composing with them.
   */
  validateReplayTurns?: (
    ctx: ProviderValidateReplayTurnsContext,
  ) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /**
   * Provider-owned tool-schema normalization.
   *
   * Use this for transport-family schema cleanup before OpenClaw registers
   * tools with the embedded runner.
   */
  normalizeToolSchemas?: (
    ctx: ProviderNormalizeToolSchemasContext,
  ) => AnyAgentTool[] | null | undefined;
  /**
   * Provider-owned tool-schema diagnostics after normalization.
   *
   * Use this when a provider wants to surface transport-specific schema
   * warnings without teaching core about provider-specific keyword rules.
   */
  inspectToolSchemas?: (
    ctx: ProviderNormalizeToolSchemasContext,
  ) => ProviderToolSchemaDiagnostic[] | null | undefined;
  /**
   * Provider-owned reasoning output mode.
   *
   * Use this when a provider requires tagged reasoning/final output instead of
   * native structured reasoning fields.
   */
  resolveReasoningOutputMode?: (
    ctx: ProviderReasoningOutputModeContext,
  ) => ProviderReasoningOutputMode | null | undefined;
  /**
   * Provider-owned extra-param normalization before generic stream option
   * wrapping.
   *
   * Typical uses: set provider-default `transport`, map provider-specific
   * config aliases, or inject extra request metadata sourced from
   * `agents.defaults.models.<provider>/<model>.params`.
   */
  prepareExtraParams?: (
    ctx: ProviderPrepareExtraParamsContext,
  ) => Record<string, unknown> | null | undefined;
  /**
   * Provider-owned request params after transport/model resolution.
   *
   * Use this for transport-family request knobs that should be keyed by the
   * resolved model API/transport rather than a hardcoded core allowlist.
   */
  extraParamsForTransport?: (
    ctx: ProviderExtraParamsForTransportContext,
  ) => ProviderExtraParamsForTransportResult | null | undefined;
  /**
   * Provider-owned transport factory.
   *
   * Use this when the provider needs a fully custom StreamFn instead of a
   * wrapper around the normal `streamSimple` path.
   */
  createStreamFn?: (ctx: ProviderCreateStreamFnContext) => StreamFn$1 | null | undefined;
  /**
   * Provider-owned stream wrapper applied after generic OpenClaw wrappers.
   *
   * Typical uses: provider attribution headers, request-body rewrites, or
   * provider-specific compat payload patches that do not justify a separate
   * transport implementation.
   */
  wrapStreamFn?: (ctx: ProviderWrapStreamFnContext) => StreamFn$1 | null | undefined;
  /**
   * Provider-owned wrapper for direct `completeSimple` callers.
   *
   * Opt in only when the provider must enforce the same wire contract outside
   * the embedded agent runtime.
   */
  wrapSimpleCompletionStreamFn?: (
    ctx: ProviderWrapStreamFnContext,
  ) => StreamFn$1 | null | undefined;
  /**
   * Provider-owned native transport turn identity.
   *
   * Use this when a provider wants generic transports to attach provider-native
   * request headers or metadata on each turn without hardcoding vendor logic in
   * core.
   */
  resolveTransportTurnState?: (
    ctx: ProviderResolveTransportTurnStateContext,
  ) => ProviderTransportTurnState | null | undefined;
  /**
   * Provider-owned WebSocket session policy.
   *
   * Use this when a provider wants generic WebSocket transports to attach
   * native session headers or tune the session-scoped cool-down before HTTP
   * fallback.
   */
  resolveWebSocketSessionPolicy?: (
    ctx: ProviderResolveWebSocketSessionPolicyContext,
  ) => ProviderWebSocketSessionPolicy | null | undefined;
  /**
   * Provider-owned embedding provider factory.
   *
   * Use this when memory embedding behavior belongs with the provider plugin
   * rather than the core embedding switchboard.
   */
  createEmbeddingProvider?: (
    ctx: ProviderCreateEmbeddingProviderContext,
  ) =>
    | Promise<PluginEmbeddingProvider | null | undefined>
    | PluginEmbeddingProvider
    | null
    | undefined;
  /**
   * Runtime auth exchange hook.
   *
   * Called after OpenClaw resolves the raw configured credential but before the
   * runner stores it in runtime auth storage. This lets plugins exchange a
   * source credential (for example a GitHub token) into a short-lived runtime
   * token plus optional base URL override.
   */
  prepareRuntimeAuth?: (
    ctx: ProviderPrepareRuntimeAuthContext,
  ) => Promise<ProviderPreparedRuntimeAuth | null | undefined>;
  /**
   * Usage/billing auth resolution hook.
   *
   * Called by provider-usage surfaces (`/usage`, status snapshots, reporting).
   * Use this when a provider's usage endpoint needs provider-owned token
   * extraction, blob parsing, or alias handling.
   */
  resolveUsageAuth?: (
    ctx: ProviderResolveUsageAuthContext,
  ) =>
    | Promise<ProviderResolvedUsageAuth | null | undefined>
    | ProviderResolvedUsageAuth
    | null
    | undefined;
  /**
   * Usage/quota snapshot fetch hook.
   *
   * Called after `resolveUsageAuth` by `/usage` and related reporting surfaces.
   * Use this when the provider's usage endpoint or payload shape is
   * provider-specific and you want that logic to live with the provider plugin
   * instead of the core switchboard.
   */
  fetchUsageSnapshot?: (
    ctx: ProviderFetchUsageSnapshotContext,
  ) => Promise<ProviderUsageSnapshot | null | undefined> | ProviderUsageSnapshot | null | undefined;
  /**
   * Provider-owned failover context-overflow matcher.
   *
   * Return true when the provider recognizes the raw error as a context-window
   * overflow shape that generic heuristics would miss.
   */
  matchesContextOverflowError?: (ctx: ProviderFailoverErrorContext) => boolean | undefined;
  /**
   * Provider-owned failover error classification.
   *
   * Return a failover reason when the provider recognizes a provider-specific
   * raw error shape. Return undefined to fall back to generic classification.
   */
  classifyFailoverReason?: (ctx: ProviderFailoverErrorContext) => FailoverReason | null | undefined;
  /**
   * Provider-owned cache TTL eligibility.
   *
   * Use this when a proxy provider supports Anthropic-style prompt caching for
   * only a subset of upstream models.
   */
  isCacheTtlEligible?: (ctx: ProviderCacheTtlEligibilityContext) => boolean | undefined;
  /**
   * Provider-owned missing-auth message override.
   *
   * Return a custom message when the provider wants a more specific recovery
   * hint than OpenClaw's generic auth-store guidance.
   */
  buildMissingAuthMessage?: (
    ctx: ProviderBuildMissingAuthMessageContext,
  ) => string | null | undefined;
  /**
   * Provider-owned unknown-model hint override.
   *
   * Return a suffix when the provider wants a more specific recovery hint than
   * OpenClaw's generic `Unknown model` error after catalog/runtime lookup
   * fails.
   */
  buildUnknownModelHint?: (ctx: ProviderBuildUnknownModelHintContext) => string | null | undefined;
  /**
   * Provider-owned built-in model suppression.
   *
   * Return `{ suppress: true }` to hide a stale upstream row. Include
   * `errorMessage` when OpenClaw should surface a provider-specific hint for
   * direct model resolution failures.
   *
   * @deprecated Use manifest `modelCatalog.suppressions`. Runtime suppression
   * hooks are no longer called by model resolution.
   */
  suppressBuiltInModel?: (
    ctx: ProviderBuiltInModelSuppressionContext,
  ) => ProviderBuiltInModelSuppressionResult | null | undefined;
  /**
   * Provider-owned final catalog augmentation.
   *
   * @deprecated Use `api.registerModelCatalogProvider` for supplemental catalog
   * rows. This hook is kept only for existing text-provider runtime
   * compatibility during the migration window.
   *
   * Return extra rows to append to the final catalog after discovery/config
   * merging. OpenClaw deduplicates by `provider/id`, so plugins only need to
   * describe the desired supplemental rows.
   */
  augmentModelCatalog?: (
    ctx: ProviderAugmentModelCatalogContext,
  ) =>
    | Array<ModelCatalogEntry>
    | ReadonlyArray<ModelCatalogEntry>
    | Promise<Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | null | undefined>
    | null
    | undefined;
  /**
   * Provider-owned binary thinking toggle.
   *
   * Return true when the provider exposes a coarse on/off reasoning control
   * instead of the normal multi-level ladder shown by `/think`.
   *
   * @deprecated Prefer `resolveThinkingProfile`.
   */
  isBinaryThinking?: (ctx: ProviderThinkingPolicyContext) => boolean | undefined;
  /**
   * Provider-owned xhigh reasoning support.
   *
   * Return true only for models that should expose the `xhigh` thinking level.
   *
   * @deprecated Prefer `resolveThinkingProfile`.
   */
  supportsXHighThinking?: (ctx: ProviderThinkingPolicyContext) => boolean | undefined;
  /**
   * Provider-owned thinking level profile.
   *
   * Prefer this over the individual thinking capability hooks when a provider
   * or model exposes a custom set of thinking levels. OpenClaw stores the
   * canonical `id`, shows `label` when provided, and downgrades stale stored
   * values by profile rank.
   */
  resolveThinkingProfile?: (
    ctx: ProviderDefaultThinkingPolicyContext,
  ) => ProviderThinkingProfile | null | undefined;
  /**
   * Provider-owned default thinking level.
   *
   * Use this to keep model-family defaults (for example Claude 4.6 =>
   * adaptive) out of core command logic.
   *
   * @deprecated Prefer `resolveThinkingProfile`.
   */
  resolveDefaultThinkingLevel?: (
    ctx: ProviderDefaultThinkingPolicyContext,
  ) => "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | null | undefined;
  /**
   * Provider-owned system-prompt contribution.
   *
   * Use this when a provider/model family needs cache-aware prompt tuning
   * without replacing the full OpenClaw-owned system prompt.
   */
  resolveSystemPromptContribution?: (
    ctx: ProviderSystemPromptContributionContext,
  ) => ProviderSystemPromptContribution | null | undefined;
  /**
   * Provider-owned GPT/model prompt overlay seam.
   *
   * Runs after OpenClaw's built-in overlay is resolved and before the
   * provider's regular system-prompt contribution is merged.
   */
  resolvePromptOverlay?: (
    ctx: ProviderResolvePromptOverlayContext,
  ) => ProviderSystemPromptContribution | null | undefined;
  /**
   * Provider-owned fallback route override for model/profile failure handling.
   *
   * Return undefined/null to keep OpenClaw's default fallback policy.
   */
  followupFallbackRoute?: (
    ctx: ProviderFollowupFallbackRouteContext,
  ) => ProviderFollowupFallbackRouteResult | null | undefined;
  /**
   * Provider-owned auth profile resolver.
   *
   * Return a profile id from the supplied order to prefer it for this attempt;
   * invalid or missing ids are ignored by core.
   */
  resolveAuthProfileId?: (ctx: ProviderResolveAuthProfileIdContext) => string | null | undefined;
  /**
   * Provider-owned final system-prompt transform.
   *
   * Use this sparingly when a provider transport needs small compatibility
   * rewrites after OpenClaw has assembled the complete prompt. Return
   * `undefined`/`null` to leave the prompt unchanged.
   */
  transformSystemPrompt?: (ctx: ProviderTransformSystemPromptContext) => string | null | undefined;
  /**
   * Provider-owned bidirectional text replacements.
   *
   * `input` applies to system prompts and text message content before transport.
   * `output` applies to assistant text deltas/final text before OpenClaw handles
   * its own control markers or channel delivery.
   */
  textTransforms?: PluginTextTransforms;
  /**
   * Provider-owned global config defaults.
   *
   * Use this when config materialization needs provider-specific defaults that
   * depend on auth mode, env, or provider model-family semantics.
   */
  applyConfigDefaults?: (
    ctx: ProviderApplyConfigDefaultsContext,
  ) => OpenClawConfig | null | undefined;
  /**
   * Provider-owned "modern model" matcher used by live profile/smoke filters.
   *
   * Return true when the given provider/model ref should be treated as a
   * preferred modern model candidate.
   */
  isModernModelRef?: (ctx: ProviderModernModelPolicyContext) => boolean | undefined;
  wizard?: ProviderPluginWizard;
  /**
   * Provider-owned auth-profile API-key formatter.
   *
   * OpenClaw uses this when a stored auth profile is already valid and needs to
   * be converted into the runtime `apiKey` string expected by the provider. Use
   * this for providers whose auth profile stores extra metadata alongside the
   * bearer token (for example Gemini CLI's `{ token, projectId }` payload).
   */
  formatApiKey?: (cred: AuthProfileCredential) => string;
  /**
   * Legacy auth-profile ids that should be retired by `openclaw doctor`.
   *
   * Use this when a provider plugin replaces an older core-managed profile id
   * and wants cleanup/migration messaging to live with the provider instead of
   * in hardcoded doctor tables.
   */
  deprecatedProfileIds?: string[];
  /**
   * Legacy OAuth profile-id migrations that `openclaw doctor` should offer.
   *
   * Use this when a provider moved from a legacy default OAuth profile id to a
   * newer identity-based id and wants doctor to own the config rewrite without
   * another core-specific migration branch.
   */
  oauthProfileIdRepairs?: ProviderOAuthProfileIdRepair[];
  /**
   * Provider-owned OAuth refresh.
   *
   * OpenClaw calls this before falling back to the shared `shared model runtime` OAuth
   * refreshers. Use it when the provider has a custom refresh endpoint, or when
   * the provider needs custom refresh-failure behavior that should stay out of
   * core auth-profile code.
   */
  refreshOAuth?: (cred: OAuthCredential) => Promise<OAuthCredential>;
  /**
   * Provider-owned auth-doctor hint.
   *
   * Return a multiline repair hint when OAuth refresh fails and the provider
   * wants to steer users toward a specific auth-profile migration or recovery
   * path. Return nothing to keep OpenClaw's generic error text.
   */
  buildAuthDoctorHint?: (
    ctx: ProviderAuthDoctorHintContext,
  ) => string | Promise<string | null | undefined> | null | undefined;
  /**
   * Provider-owned config-backed auth resolution.
   *
   * Providers own any provider-specific fallback secret rules here so core
   * auth/discovery code can stay generic and avoid parsing provider-private
   * config layouts.
   *
   * The returned `apiKey` may be:
   * - a real credential from the active runtime snapshot, suitable for runtime use
   * - a non-secret marker (for example a managed SecretRef marker), suitable only
   *   for discovery/bootstrap callers
   *
   * Runtime callers must not treat non-secret markers as runnable credentials;
   * they should retry against the active runtime snapshot when available.
   *
   * This hook is the canonical seam for provider-specific fallback auth
   * derived from plugin/private config. It may return:
   * - a runnable literal credential for runtime callers
   * - a non-secret marker for managed-secret source config, which is still useful
   *   for discovery/bootstrap callers
   *
   * Runtime callers must not treat non-secret markers as runnable credentials;
   * they should retry against the active runtime snapshot when available.
   *
   * Use this when the provider can operate without a real secret for certain
   * configured local/self-hosted cases and wants auth resolution to treat that
   * config as available.
   */
  resolveSyntheticAuth?: (
    ctx: ProviderResolveSyntheticAuthContext,
  ) => ProviderSyntheticAuthResult | null | undefined;
  /**
   * Provider-owned external auth profile discovery.
   *
   * Use this when credentials are managed by an external tool and should be visible
   * to runtime auth resolution without being written back into `auth-profiles.json`
   * by core.
   */
  resolveExternalAuthProfiles?: (
    ctx: ProviderResolveExternalAuthProfilesContext,
  ) =>
    | Array<ProviderExternalAuthProfile>
    | ReadonlyArray<ProviderExternalAuthProfile>
    | null
    | undefined;
  /**
   * @deprecated Declare `contracts.externalAuthProviders` in the plugin manifest
   * and implement `resolveExternalAuthProfiles` instead. Kept at the public
   * plugin boundary until the SDK removal window closes.
   */
  resolveExternalOAuthProfiles?: (
    ctx: ProviderResolveExternalOAuthProfilesContext,
  ) =>
    | Array<ProviderExternalOAuthProfile>
    | ReadonlyArray<ProviderExternalOAuthProfile>
    | null
    | undefined;
  /**
   * Provider-owned precedence rule for stored synthetic auth profiles.
   *
   * Return true when a stored profile API key is only a provider-owned
   * synthetic placeholder and should yield to env/config-backed auth before
   * OpenClaw falls back to that stored profile.
   */
  shouldDeferSyntheticProfileAuth?: (
    ctx: ProviderDeferSyntheticProfileAuthContext,
  ) => boolean | undefined;
  onModelSelected?: (ctx: ProviderModelSelectedContext) => Promise<void>;
};
/** Speech capability registered by a plugin. */
type SpeechProviderPlugin = {
  id: SpeechProviderId;
  label: string;
  aliases?: string[];
  autoSelectOrder?: number /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */;
  defaultTimeoutMs?: number;
  defaultModel?: string;
  models?: readonly string[];
  voices?: readonly string[];
  resolveConfig?: (ctx: SpeechProviderResolveConfigContext) => SpeechProviderConfig;
  parseDirectiveToken?: (ctx: SpeechDirectiveTokenParseContext) => SpeechDirectiveTokenParseResult;
  resolveTalkConfig?: (ctx: SpeechProviderResolveTalkConfigContext) => SpeechProviderConfig;
  resolveTalkOverrides?: (
    ctx: SpeechProviderResolveTalkOverridesContext,
  ) => SpeechProviderConfig | undefined;
  prepareSynthesis?: (
    ctx: SpeechProviderPrepareSynthesisContext,
  ) =>
    | SpeechProviderPreparedSynthesis
    | undefined
    | Promise<SpeechProviderPreparedSynthesis | undefined>;
  isConfigured: (ctx: SpeechProviderConfiguredContext) => boolean;
  synthesize: (req: SpeechSynthesisRequest) => Promise<SpeechSynthesisResult>;
  streamSynthesize?: (req: SpeechSynthesisStreamRequest) => Promise<SpeechSynthesisStreamResult>;
  synthesizeTelephony?: (
    req: SpeechTelephonySynthesisRequest,
  ) => Promise<SpeechTelephonySynthesisResult>;
  listVoices?: (req: SpeechListVoicesRequest) => Promise<SpeechVoiceOption[]>;
};
type PluginSpeechProviderEntry = SpeechProviderPlugin & {
  pluginId: string;
};
/** Realtime transcription capability registered by a plugin. */
type RealtimeTranscriptionProviderPlugin = {
  id: RealtimeTranscriptionProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[];
  autoSelectOrder?: number;
  resolveConfig?: (
    ctx: RealtimeTranscriptionProviderResolveConfigContext,
  ) => RealtimeTranscriptionProviderConfig;
  isConfigured: (ctx: RealtimeTranscriptionProviderConfiguredContext) => boolean;
  createSession: (req: RealtimeTranscriptionSessionCreateRequest) => RealtimeTranscriptionSession;
};
type PluginRealtimeTranscriptionProviderEntry = RealtimeTranscriptionProviderPlugin & {
  pluginId: string;
};
/** Transcript source capability registered by a channel or meeting plugin. */
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type PluginTranscriptsSourceProviderEntry = TranscriptSourceProvider & {
  pluginId: string;
};
/** Realtime voice capability registered by a plugin. */
type RealtimeVoiceProviderPlugin = {
  id: RealtimeVoiceProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[];
  autoSelectOrder?: number;
  capabilities?: RealtimeVoiceProviderCapabilities;
  resolveConfig?: (ctx: RealtimeVoiceProviderResolveConfigContext) => RealtimeVoiceProviderConfig;
  isConfigured: (ctx: RealtimeVoiceProviderConfiguredContext) => boolean;
  createBridge: (req: RealtimeVoiceBridgeCreateRequest) => RealtimeVoiceBridge;
  createBrowserSession?: (
    req: RealtimeVoiceBrowserSessionCreateRequest,
  ) => Promise<RealtimeVoiceBrowserSession>;
};
type PluginRealtimeVoiceProviderEntry = RealtimeVoiceProviderPlugin & {
  pluginId: string;
};
type MediaUnderstandingProviderPlugin = MediaUnderstandingProvider;
type ImageGenerationProviderPlugin = ImageGenerationProvider;
type VideoGenerationProviderPlugin = VideoGenerationProvider;
type MusicGenerationProviderPlugin = MusicGenerationProvider;
type OpenClawPluginGatewayMethod = {
  method: string;
  handler: GatewayRequestHandler;
};
type PluginCommandDiagnosticsSession = {
  /** Stable host session key when available. */ sessionKey?: string /** Ephemeral OpenClaw session id when available. */;
  sessionId?: string;
  /**
   * Deprecated transcript locator for this OpenClaw session when available.
   *
   * SQLite-backed sessions use a `sqlite:<agentId>:<sessionId>:<storePath>`
   * marker, not a filesystem path. Use session id/key plus transcript-runtime
   * helpers for active transcript reads.
   *
   * @deprecated Use session identity fields with `plugin-sdk/session-transcript-runtime`.
   */
  sessionFile?: string /** Embedded agent harness selected for this session. */;
  agentHarnessId?: string /** Channel/provider for this session when available. */;
  channel?: string /** Provider channel id when available. */;
  channelId?: ChannelId /** Account id for multi-account channels when available. */;
  accountId?: string /** Thread/topic id when available. */;
  messageThreadId?:
    | string
    | number /** Parent conversation id for thread-capable channels when available. */;
  threadParentId?: string;
};
/**
 * Context passed to plugin command handlers.
 */
type PluginCommandContext = {
  /** The sender's identifier (for example a channel-scoped user ID) */ senderId?: string /** The channel/surface (for example "chat" or "team-chat") */;
  channel: string /** Provider channel id */;
  channelId?: ChannelId /** Whether the sender is on the allowlist */;
  isAuthorizedSender: boolean /** Whether the sender is an owner for owner-only command surfaces. */;
  senderIsOwner?: boolean /** Gateway client scopes for internal control-plane callers */;
  gatewayClientScopes?: string[] /** Host-resolved agent that owns the active session. */;
  agentId?: string /** Stable host session key for the active conversation when available. */;
  sessionKey?: string /** Ephemeral host session id for the active conversation when available. */;
  sessionId?: string;
  /**
   * Deprecated transcript locator for the active OpenClaw session when available.
   *
   * SQLite-backed sessions use a `sqlite:<agentId>:<sessionId>:<storePath>`
   * marker, not a filesystem path. Use session id/key plus transcript-runtime
   * helpers for active transcript reads.
   *
   * @deprecated Use session identity fields with `plugin-sdk/session-transcript-runtime`.
   */
  sessionFile?: string /** Raw command arguments after the command name */;
  args?: string /** The full normalized command body */;
  commandBody: string /** Current OpenClaw configuration */;
  config: OpenClawConfig /** Raw "From" value (channel-scoped id) */;
  from?: string /** Raw "To" value (channel-scoped id) */;
  to?: string /** Account id for multi-account channels */;
  accountId?: string /** Thread/topic id if available */;
  messageThreadId?: string | number /** Parent conversation id for thread-capable channels */;
  threadParentId?: string /** Sensitive diagnostics-only session inventory for owner-gated commands. */;
  diagnosticsSessions?: PluginCommandDiagnosticsSession[] /** Host-bound runtime capabilities scoped to this command invocation. */;
  runtimeContext?: {
    llm?: Pick<PluginRuntimeCore["llm"], "complete">;
  } /** Internal diagnostics-only marker that exec approval already authorized upload. */;
  diagnosticsUploadApproved?: boolean /** Internal diagnostics-only marker to preview upload effects without exposing ids. */;
  diagnosticsPreviewOnly?: boolean /** Internal diagnostics-only marker for owner-private routed confirmations. */;
  diagnosticsPrivateRouted?: boolean;
  requestConversationBinding: (
    params?: PluginConversationBindingRequestParams,
  ) => Promise<PluginConversationBindingRequestResult>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
/**
 * Result returned by a plugin command handler.
 */
type PluginCommandResult = ReplyPayload & {
  /** Allows the agent session to continue processing after the command. */ continueAgent?: boolean /** Suppresses channel fallback replies when the handler already delivered a response. */;
  suppressReply?: boolean;
};
/**
 * Handler function for plugin commands.
 */
type PluginCommandHandler = (
  ctx: PluginCommandContext,
) => PluginCommandResult | Promise<PluginCommandResult>;
/**
 * Definition for a plugin-registered command.
 */
declare const AGENT_PROMPT_SURFACE_KINDS: readonly [
  "openclaw_main",
  "pi_main",
  "codex_app_server",
  "cli_backend",
  "acp_backend",
  "subagent",
];
type AgentPromptSurfaceKind = (typeof AGENT_PROMPT_SURFACE_KINDS)[number];
type AgentPromptGuidanceEntry = {
  text: string;
  surfaces?: readonly AgentPromptSurfaceKind[];
};
type AgentPromptGuidance = string | AgentPromptGuidanceEntry;
type OpenClawPluginCommandDefinition = {
  /** Command name without leading slash (e.g., "tts") */ name: string;
  /**
   * Optional native-command aliases for slash/menu surfaces.
   * `default` applies to all native providers unless a provider-specific
   * override exists (for example `{ default: "talkvoice", teamChat: "voice2" }`).
   */
  nativeNames?: Partial<Record<string, string>> & {
    default?: string;
  };
  /**
   * Optional native progress placeholder text for native command surfaces.
   * `default` applies to all native providers unless a provider-specific
   * override exists.
   */
  nativeProgressMessages?: Partial<Record<string, string>> & {
    default?: string;
  } /** Description shown in /help and command menus */;
  description: string /** Localized descriptions for native command surfaces that support them. */;
  descriptionLocalizations?: Record<string, string>;
  /**
   * Optional channel ids this command belongs to.
   * Omit to keep the command available on every channel surface.
   */
  channels?: readonly string[] /** Optional system-prompt guidance for agents when this command is registered. */;
  agentPromptGuidance?: readonly AgentPromptGuidance[] /** Whether this command accepts arguments */;
  acceptsArgs?: boolean /** Whether only authorized senders can use this command (default: true) */;
  requireAuth?: boolean /** Operator scopes required by gateway clients; command owners may satisfy this on chat surfaces. */;
  requiredScopes?: OperatorScope[] /** Whether a trusted bundled handler needs owner status for subcommand-level authorization. */;
  exposeSenderIsOwner?: boolean;
  /**
   * Allows a bundled plugin to claim a command name that is otherwise reserved
   * by core. External plugins cannot use this field.
   */
  ownership?: "plugin" | "reserved" /** The handler function */;
  handler: PluginCommandHandler;
};
type PluginInteractiveHandlerResult = {
  handled?: boolean;
} | void;
type PluginInteractiveRegistration<
  TContext = unknown,
  TChannel extends string = string,
  TResult = PluginInteractiveHandlerResult,
> = {
  channel: TChannel;
  namespace: string;
  handler: (ctx: TContext) => Promise<TResult> | TResult;
};
type PluginInteractiveHandlerRegistration = PluginInteractiveRegistration;
type OpenClawPluginHttpRouteAuth = "gateway" | "plugin";
type OpenClawPluginHttpRouteMatch = "exact" | "prefix";
type OpenClawPluginGatewayRuntimeScopeSurface = "write-default" | "trusted-operator";
type OpenClawPluginHttpRouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<boolean | void> | boolean | void;
type OpenClawPluginHttpRouteUpgradeHandler = (
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer,
) => Promise<boolean | void> | boolean | void;
type OpenClawPluginHttpRouteParams = {
  path: string;
  handler: OpenClawPluginHttpRouteHandler;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match?: OpenClawPluginHttpRouteMatch;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface;
  nodeCapability?: {
    surface: string;
    ttlMs?: number;
  };
  replaceExisting?: boolean;
};
type OpenClawPluginHostedMediaResolver = (
  mediaUrl: string,
) => string | null | undefined | Promise<string | null | undefined>;
type OpenClawPluginCliContext = {
  /**
   * Command object where this plugin should register its commands.
   *
   * For root CLI registrations this is the root `openclaw` program. For nested
   * registrations it is the resolved parent command from `parentPath`.
   */
  program: Command;
  parentPath: readonly string[];
  config: OpenClawConfig;
  workspaceDir?: string;
  logger: PluginLogger;
};
type OpenClawPluginCliRegistrar = (ctx: OpenClawPluginCliContext) => void | Promise<void>;
/**
 * Top-level CLI metadata for plugin-owned commands.
 *
 * Descriptors are the parse-time contract for lazy plugin CLI registration.
 * If you want OpenClaw to keep a plugin command lazy-loaded while still
 * advertising it at the root CLI level, provide descriptors that cover every
 * top-level command root registered by that plugin CLI surface.
 */
type OpenClawPluginCliCommandDescriptor = {
  name: string;
  description: string;
  hasSubcommands: boolean;
};
type OpenClawPluginNodeCliFeatureOptions = {
  /** Explicit node feature command names owned under `openclaw nodes`. */ commands?: string[];
  /**
   * Parse-time command descriptors for lazy node feature CLI registration.
   *
   * Descriptors are registered under `openclaw nodes`, so a descriptor named
   * `"camera"` exposes `openclaw nodes camera`.
   */
  descriptors?: OpenClawPluginCliCommandDescriptor[];
};
type OpenClawPluginReloadRegistration = {
  restartPrefixes?: string[];
  hotPrefixes?: string[];
  noopPrefixes?: string[];
};
type OpenClawPluginNodeInvokeTransportResult =
  | {
      ok: true;
      payload?: unknown;
      payloadJSON?: string | null;
    }
  | {
      ok: false;
      code?: string;
      message: string;
      details?: Record<string, unknown>;
    };
type OpenClawPluginNodeInvokeApprovalDecision = "allow-once" | "allow-always" | "deny";
type OpenClawPluginNodeInvokePolicyApprovalRuntime = {
  request: (input: {
    title: string;
    description: string;
    severity?: "info" | "warning" | "critical";
    toolName?: string;
    toolCallId?: string;
    agentId?: string;
    sessionKey?: string;
    timeoutMs?: number;
  }) => Promise<{
    id?: string;
    decision?: OpenClawPluginNodeInvokeApprovalDecision | null;
  }>;
};
type OpenClawPluginNodeInvokePolicyContext = {
  nodeId: string;
  command: string;
  params: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
  config: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  node?: {
    nodeId: string;
    displayName?: string;
    platform?: string;
    deviceFamily?: string;
    commands?: string[];
  };
  client?: {
    connId?: string;
    scopes?: string[];
  } | null;
  approvals?: OpenClawPluginNodeInvokePolicyApprovalRuntime;
  invokeNode: (input?: {
    params?: unknown;
    timeoutMs?: number;
    idempotencyKey?: string;
  }) => Promise<OpenClawPluginNodeInvokeTransportResult>;
};
type OpenClawPluginNodeInvokePolicyResult =
  | {
      ok: true;
      payload?: unknown;
      payloadJSON?: string | null;
    }
  | {
      ok: false;
      message: string;
      code?: string;
      details?: Record<string, unknown>;
      unavailable?: boolean;
    };
type OpenClawPluginNodeInvokePolicy = {
  commands: string[];
  /**
   * Platforms where these node-handled commands should be allowlisted by default.
   * Omit for commands that require explicit `gateway.nodes.allowCommands`.
   */
  defaultPlatforms?: Array<"ios" | "android" | "macos" | "windows" | "linux" | "unknown">;
  /**
   * Dangerous policy commands are filtered out of default allowlists unless
   * explicitly allowed by config.
   */
  dangerous?: boolean;
  /**
   * iOS foreground-restricted commands should be queued for foreground delivery
   * when an iOS node reports BACKGROUND_UNAVAILABLE.
   */
  foregroundRestrictedOnIos?: boolean;
  handle: (
    ctx: OpenClawPluginNodeInvokePolicyContext,
  ) => Promise<OpenClawPluginNodeInvokePolicyResult> | OpenClawPluginNodeInvokePolicyResult;
};
type OpenClawPluginSecurityAuditContext = {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  configPath: string;
};
type OpenClawPluginSecurityAuditCollector = (
  ctx: OpenClawPluginSecurityAuditContext,
) => SecurityAuditFinding[] | Promise<SecurityAuditFinding[]>;
type OpenClawGatewayDiscoveryAdvertiseContext = {
  machineDisplayName: string;
  gatewayPort: number;
  gatewayTlsEnabled: boolean;
  gatewayTlsFingerprintSha256?: string;
  gatewayDirectReachable: boolean;
  canvasPort?: number;
  tailnetDns?: string;
  sshPort?: number;
  cliPath?: string;
  minimal: boolean;
};
type OpenClawGatewayDiscoveryService = {
  id: string;
  advertise: (ctx: OpenClawGatewayDiscoveryAdvertiseContext) => void | Promise<void | {
    stop?: () => void | Promise<void>;
  }>;
};
/** Context passed to long-lived plugin services. */
type OpenClawPluginServiceContext = {
  config: OpenClawConfig;
  workspaceDir?: string;
  stateDir: string;
  logger: PluginLogger;
  startupTrace?: {
    detail?: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
    measure: <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
  };
  internalDiagnostics?: {
    emit: (event: DiagnosticEventInput, privateData?: DiagnosticEventPrivateData) => void;
    onEvent: (
      listener: (
        event: DiagnosticEventPayload,
        metadata: DiagnosticEventMetadata,
        privateData: DiagnosticEventPrivateData,
      ) => void,
    ) => () => void;
  };
};
/** Background service registered by a plugin during `register(api)`. */
type OpenClawPluginService = {
  id: string;
  start: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
  stop?: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
};
type OpenClawPluginChannelRegistration = {
  plugin: ChannelPlugin;
};
/** Module-level plugin definition loaded from a native plugin entry file. */
type OpenClawPluginDefinition = {
  id?: string;
  name?: string;
  description?: string;
  version?: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-exported `kind` is kept as a compatibility
   * fallback for older plugins and may require loading plugin runtime on
   * metadata-only command paths.
   */
  kind?: PluginKind | PluginKind[];
  configSchema?: OpenClawPluginConfigSchema;
  reload?: OpenClawPluginReloadRegistration;
  nodeHostCommands?: OpenClawPluginNodeHostCommand[];
  securityAuditCollectors?: OpenClawPluginSecurityAuditCollector[];
  register?: (api: OpenClawPluginApi) => void;
  activate?: (api: OpenClawPluginApi) => void;
};
type OpenClawPluginModule = OpenClawPluginDefinition | ((api: OpenClawPluginApi) => void);
/**
 * Public label exposed to plugin `register(api)` calls.
 *
 * Keep this as a compatibility signal for plugin authors. Loader internals
 * should derive explicit capability booleans from the mode instead of branching
 * on raw strings throughout the code path.
 *
 * - `full`: live runtime activation; long-lived side effects may start.
 * - `discovery`: read-only capability discovery; skip sockets/workers/clients.
 * - `tool-discovery`: capability discovery for executable tools; skip channel runtime hydration.
 * - `setup-only`: lightweight channel setup entry only.
 * - `setup-runtime`: setup flow that also needs the runtime channel entry.
 * - `cli-metadata`: CLI command metadata collection.
 */
type PluginRegistrationMode =
  | "full"
  | "discovery"
  | "tool-discovery"
  | "setup-only"
  | "setup-runtime"
  | "cli-metadata";
type PluginConfigMigration = (config: OpenClawConfig) =>
  | {
      config: OpenClawConfig;
      changes: string[];
    }
  | null
  | undefined;
type MigrationItemStatus = "planned" | "migrated" | "skipped" | "warning" | "conflict" | "error";
type MigrationItemKind =
  | "auth"
  | "config"
  | "secret"
  | "memory"
  | "skill"
  | "workspace"
  | "session"
  | "file"
  | "archive"
  | "manual";
type MigrationItemAction =
  | "copy"
  | "create"
  | "update"
  | "merge"
  | "append"
  | "archive"
  | "skip"
  | "manual";
type MigrationItem = {
  id: string;
  kind: MigrationItemKind | (string & {});
  action: MigrationItemAction | (string & {});
  status: MigrationItemStatus;
  source?: string;
  target?: string;
  message?: string;
  reason?: string;
  sensitive?: boolean /** Core-owned source revision bound by reviewed embedded migration flows. */;
  sourceRevision?: {
    algorithm: "sha256";
    digest: string;
  };
  details?: Record<string, unknown>;
};
type MigrationSummary = {
  total: number;
  planned: number;
  migrated: number;
  skipped: number;
  conflicts: number;
  errors: number;
  sensitive: number;
};
type MigrationDetection = {
  found: boolean;
  source?: string;
  label?: string;
  confidence?: "low" | "medium" | "high";
  message?: string;
};
type MigrationPlan = {
  providerId: string;
  source: string;
  target?: string;
  summary: MigrationSummary;
  items: MigrationItem[];
  warnings?: string[];
  nextSteps?: string[];
  metadata?: Record<string, unknown>;
};
type MigrationApplyResult = MigrationPlan & {
  backupPath?: string;
  reportDir?: string;
};
type MigrationProviderPreparation = {
  dispose?: () => void | Promise<void>;
};
type MigrationProviderContext = {
  config: OpenClawConfig;
  runtime?: PluginRuntime;
  logger: PluginLogger;
  stateDir: string /** Explicit destination agent for embedded migration surfaces such as Control UI. */;
  targetAgentId?: string /** Optional item-kind scope used by embedded migration surfaces to avoid unrelated discovery. */;
  itemKinds?: readonly string[];
  source?: string;
  includeSecrets?: boolean;
  overwrite?: boolean;
  providerOptions?: Record<string, unknown>;
  backupPath?: string;
  reportDir?: string;
  signal?: AbortSignal;
};
/** Migration source implemented by a plugin and orchestrated by `openclaw migrate`. */
type MigrationProviderPlugin = {
  id: string;
  label: string;
  description?: string /** Item kinds this provider can expose without requiring a full plan. */;
  supportedItemKinds?: readonly string[];
  detect?: (ctx: MigrationProviderContext) => MigrationDetection | Promise<MigrationDetection>;
  prepareApply?: (
    ctx: MigrationProviderContext,
  ) => MigrationProviderPreparation | Promise<MigrationProviderPreparation | undefined> | undefined;
  plan: (ctx: MigrationProviderContext) => MigrationPlan | Promise<MigrationPlan>;
  apply: (
    ctx: MigrationProviderContext,
    plan?: MigrationPlan,
  ) => MigrationApplyResult | Promise<MigrationApplyResult>;
};
type PluginSetupAutoEnableContext = {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
};
type PluginSetupAutoEnableProbe = (
  ctx: PluginSetupAutoEnableContext,
) => string | string[] | null | undefined;
type OpenClawPluginSessionStateApi = {
  /** Register plugin-owned session state projected into Gateway session rows. */ registerSessionExtension: (
    extension: PluginSessionExtensionRegistration,
  ) => void;
};
type OpenClawPluginSessionWorkflowApi = {
  /** Queue one plugin-owned context injection for the next agent turn in a session. */ enqueueNextTurnInjection: (
    injection: PluginNextTurnInjection,
  ) => Promise<PluginNextTurnInjectionEnqueueResult>;
  /**
   * Register cleanup metadata for a plugin-owned session scheduler job.
   * This does not schedule work or create task records; it only lets the host
   * clean external scheduler state during reset/delete/disable.
   */
  registerSessionSchedulerJob: (
    job: PluginSessionSchedulerJobRegistration,
  ) =>
    | PluginSessionSchedulerJobHandle
    | undefined /** Send host-validated files to the active direct-outbound route for a session. */;
  sendSessionAttachment: (
    params: PluginSessionAttachmentParams,
  ) => Promise<PluginSessionAttachmentResult>;
  /**
   * Schedule a future agent turn in a session through Cron.
   * Cron owns timing and creates the task ledger entry when the turn runs.
   */
  scheduleSessionTurn: (
    params: PluginSessionTurnScheduleParams,
  ) => Promise<
    PluginSessionSchedulerJobHandle | undefined
  > /** Remove Cron-backed scheduled session turns that share a plugin-owned tag. */;
  unscheduleSessionTurnsByTag: (
    params: PluginSessionTurnUnscheduleByTagParams,
  ) => Promise<PluginSessionTurnUnscheduleByTagResult>;
};
type OpenClawPluginSessionControlsApi = {
  /** Register a typed session action that clients can dispatch through the Gateway. */ registerSessionAction: (
    action: PluginSessionActionRegistration,
  ) => void /** Register a generic Control UI contribution descriptor. */;
  registerControlUiDescriptor: (descriptor: PluginControlUiDescriptor) => void;
};
type OpenClawPluginSessionApi = {
  state: OpenClawPluginSessionStateApi;
  workflow: OpenClawPluginSessionWorkflowApi;
  controls: OpenClawPluginSessionControlsApi;
};
type OpenClawPluginAgentEventsApi = {
  /** Subscribe to sanitized agent events through the host-owned plugin lifecycle. */ registerAgentEventSubscription: (
    subscription: PluginAgentEventSubscriptionRegistration,
  ) => void /** Emit a host-routed, plugin-attributed event for workflow/UI subscribers. */;
  emitAgentEvent: (params: PluginAgentEventEmitParams) => PluginAgentEventEmitResult;
};
type OpenClawPluginAgentApi = {
  events: OpenClawPluginAgentEventsApi;
};
type OpenClawPluginRunContextApi = {
  /** Store namespaced, JSON-compatible data for the active run. Cleared on run end/error. */ setRunContext: (
    patch: PluginRunContextPatch,
  ) => boolean /** Read namespaced plugin data for a run. */;
  getRunContext: (
    params: PluginRunContextGetParams,
  ) =>
    | PluginJsonValue
    | undefined /** Clear one namespace or all namespaces this plugin owns for a run. */;
  clearRunContext: (params: { runId: string; namespace?: string }) => void;
};
type OpenClawPluginLifecycleApi = {
  /** Register cleanup hooks for plugin-owned host state and background work. */ registerRuntimeLifecycle: (
    lifecycle: PluginRuntimeLifecycleRegistration,
  ) => void;
};
/** Main registration API injected into native plugin entry files. */
type OpenClawPluginApi = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  source: string;
  rootDir?: string;
  registrationMode: PluginRegistrationMode;
  config: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  /**
   * In-process runtime helpers for trusted native plugins.
   *
   * This surface is broader than hooks. Prefer hooks for third-party
   * automation/integration unless you need native registry integration.
   */
  runtime: PluginRuntime;
  logger: PluginLogger;
  /**
   * Grouped facade over the existing flat session-related plugin API.
   * Flat methods remain supported for compatibility.
   */
  session: OpenClawPluginSessionApi /** Grouped facade for agent-event workflow seams. */;
  agent: OpenClawPluginAgentApi /** Grouped facade for run-scoped plugin scratch state. */;
  runContext: OpenClawPluginRunContextApi /** Grouped facade for plugin-owned lifecycle cleanup hooks. */;
  lifecycle: OpenClawPluginLifecycleApi;
  registerTool: (
    tool: AnyAgentTool | OpenClawPluginToolFactory,
    opts?: OpenClawPluginToolOptions,
  ) => void;
  registerHook: (
    events: string | string[],
    handler: InternalHookHandler,
    opts?: OpenClawPluginHookOptions,
  ) => void;
  registerHttpRoute: (
    params: OpenClawPluginHttpRouteParams,
  ) => void /** Register a plugin-owned resolver for browser-style hosted media URLs. */;
  registerHostedMediaResolver: (
    resolver: OpenClawPluginHostedMediaResolver,
  ) => void /** Register a native messaging channel plugin (channel capability). */;
  registerChannel: (registration: OpenClawPluginChannelRegistration | ChannelPlugin) => void;
  /**
   * Register a gateway RPC method for this plugin.
   *
   * Reserved core admin namespaces (`config.*`, `exec.approvals.*`,
   * `wizard.*`, `update.*`) always normalize to `operator.admin` even if a
   * narrower scope is requested.
   */
  registerGatewayMethod: (
    method: string,
    handler: GatewayRequestHandler,
    opts?: {
      scope?: OperatorScope;
    },
  ) => void /** Register a read-only external-session catalog with optional native adoption actions. */;
  registerSessionCatalog: (provider: SessionCatalogProvider) => void;
  registerCli: (
    registrar: OpenClawPluginCliRegistrar,
    opts?: {
      /** Parent command path for nested command groups, for example `["nodes"]`. */ parentPath?: string[] /** Explicit command names owned by this registrar at `parentPath`. */;
      commands?: string[];
      /**
       * Parse-time command descriptors for lazy CLI registration.
       *
       * When descriptors cover every command exposed at `parentPath`, OpenClaw
       * can keep the plugin registrar lazy. Command-only registrations stay on
       * the eager compatibility path.
       */
      descriptors?: OpenClawPluginCliCommandDescriptor[];
    },
  ) => void;
  /**
   * Register a plugin-owned node feature command group under `openclaw nodes`.
   *
   * This is equivalent to `registerCli(registrar, { parentPath: ["nodes"], ... })`
   * and is intended for paired-node capabilities such as camera, screen, or Canvas.
   */
  registerNodeCliFeature: (
    registrar: OpenClawPluginCliRegistrar,
    opts?: OpenClawPluginNodeCliFeatureOptions,
  ) => void;
  registerReload: (registration: OpenClawPluginReloadRegistration) => void;
  registerNodeHostCommand: (command: OpenClawPluginNodeHostCommand) => void;
  registerNodeInvokePolicy: (policy: OpenClawPluginNodeInvokePolicy) => void;
  registerSecurityAuditCollector: (collector: OpenClawPluginSecurityAuditCollector) => void;
  registerService: (
    service: OpenClawPluginService,
  ) => void /** Register a local gateway discovery advertiser such as mDNS/Bonjour. */;
  registerGatewayDiscoveryService: (
    service: OpenClawGatewayDiscoveryService,
  ) => void /** Register a text-only CLI backend used by the local CLI runner. */;
  registerCliBackend: (
    backend: CliBackendPlugin,
  ) => void /** Register plugin-owned prompt/message compatibility text transforms. */;
  registerTextTransforms: (
    transforms: PluginTextTransformRegistration,
  ) => void /** Register a lightweight config migration that can run before plugin runtime loads. */;
  registerConfigMigration: (
    migrate: PluginConfigMigration,
  ) => void /** Register an importer for `openclaw migrate` (migration capability). */;
  registerMigrationProvider: (
    provider: MigrationProviderPlugin,
  ) => void /** Register a lightweight config probe that can auto-enable this plugin generically. */;
  registerAutoEnableProbe: (
    probe: PluginSetupAutoEnableProbe,
  ) => void /** Register a native model/provider plugin (text inference capability). */;
  registerProvider: (
    provider: ProviderPlugin,
  ) => void /** Register a cloud-worker lifecycle provider. */;
  registerWorkerProvider: (
    provider: WorkerProvider,
  ) => void /** Register provider-owned model catalog rows for text and media generation. */;
  registerModelCatalogProvider: (
    provider: UnifiedModelCatalogProviderPlugin,
  ) => void /** Register a general embedding provider (embedding capability). */;
  registerEmbeddingProvider: (
    adapter: EmbeddingProviderAdapter,
  ) => void /** Register a speech synthesis provider (speech capability). */;
  registerSpeechProvider: (
    provider: SpeechProviderPlugin,
  ) => void /** Register a realtime transcription provider (streaming STT capability). */;
  registerRealtimeTranscriptionProvider: (
    provider: RealtimeTranscriptionProviderPlugin,
  ) => void /** Register a realtime voice provider (duplex voice capability). */;
  registerRealtimeVoiceProvider: (
    provider: RealtimeVoiceProviderPlugin,
  ) => void /** Register a media understanding provider (media understanding capability). */;
  registerMediaUnderstandingProvider: (
    provider: MediaUnderstandingProviderPlugin,
  ) => void /** Register a transcripts source provider (live or imported meeting transcript capability). */;
  registerTranscriptSourceProvider: (
    provider: TranscriptSourceProvider,
  ) => void /** Register an image generation provider (image generation capability). */;
  registerImageGenerationProvider: (
    provider: ImageGenerationProviderPlugin,
  ) => void /** Register a video generation provider (video generation capability). */;
  registerVideoGenerationProvider: (
    provider: VideoGenerationProviderPlugin,
  ) => void /** Register a music generation provider (music generation capability). */;
  registerMusicGenerationProvider: (
    provider: MusicGenerationProviderPlugin,
  ) => void /** Register a web fetch provider (web fetch capability). */;
  registerWebFetchProvider: (
    provider: WebFetchProviderPlugin,
  ) => void /** Register a web search provider (web search capability). */;
  registerWebSearchProvider: (provider: WebSearchProviderPlugin) => void;
  registerInteractiveHandler: (registration: PluginInteractiveHandlerRegistration) => void;
  onConversationBindingResolved: (
    handler: (event: PluginConversationBindingResolvedEvent) => void | Promise<void>,
  ) => void;
  /**
   * Register a custom command that bypasses the LLM agent.
   * Plugin commands are processed before built-in commands and before agent invocation.
   * Use this for simple state-toggling or status commands that don't need AI reasoning.
   */
  registerCommand: (
    command: OpenClawPluginCommandDefinition,
  ) => void /** Register a context engine implementation (exclusive slot - only one active at a time). */;
  registerContextEngine: (
    id: string,
    factory: ContextEngineFactory,
  ) => void /** Register a compaction provider (pluggable summarization backend). */;
  registerCompactionProvider: (
    provider: CompactionProvider,
  ) => void /** Register an agent harness implementation. */;
  registerAgentHarness: (harness: AgentHarness) => void;
  /**
   * Register a Codex app-server extension factory for Codex harness tool-result
   * middleware. Only bundled plugins may use this seam, and
   * `contracts.embeddedExtensionFactories` must include `"codex-app-server"`.
   */
  registerCodexAppServerExtensionFactory: (factory: CodexAppServerExtensionFactory) => void;
  /**
   * Register runtime-neutral tool-result middleware. Declare
   * `contracts.agentToolResultMiddleware` for every targeted runtime.
   */
  registerAgentToolResultMiddleware: (
    handler: AgentToolResultMiddleware,
    options?: AgentToolResultMiddlewareOptions,
  ) => void;
  /**
   * Register plugin-owned session state that can be projected into Gateway session rows.
   * @deprecated Use `api.session.state.registerSessionExtension(...)`.
   */
  registerSessionExtension: (extension: PluginSessionExtensionRegistration) => void;
  /**
   * Queue one plugin-owned context injection for the next agent turn in a session.
   * @deprecated Use `api.session.workflow.enqueueNextTurnInjection(...)`.
   */
  enqueueNextTurnInjection: (
    injection: PluginNextTurnInjection,
  ) => Promise<PluginNextTurnInjectionEnqueueResult>;
  /**
   * Register a trusted pre-tool policy. Installed plugins must declare the
   * policy id in `contracts.trustedToolPolicies`.
   */
  registerTrustedToolPolicy: (policy: PluginTrustedToolPolicyRegistration) => void;
  /**
   * Register display/policy metadata for a plugin-owned tool. Metadata is
   * scoped to the (pluginId, toolName) pair at projection time, so plugins
   * cannot decorate other plugins' tools or core tools through this surface.
   */
  registerToolMetadata: (metadata: PluginToolMetadataRegistration) => void;
  /**
   * Register a generic Control UI contribution descriptor.
   * @deprecated Use `api.session.controls.registerControlUiDescriptor(...)`.
   */
  registerControlUiDescriptor: (descriptor: PluginControlUiDescriptor) => void;
  /**
   * Register cleanup hooks for plugin-owned host state and background work.
   * @deprecated Use `api.lifecycle.registerRuntimeLifecycle(...)`.
   */
  registerRuntimeLifecycle: (lifecycle: PluginRuntimeLifecycleRegistration) => void;
  /**
   * Subscribe to sanitized agent events through the host-owned plugin lifecycle.
   * @deprecated Use `api.agent.events.registerAgentEventSubscription(...)`.
   */
  registerAgentEventSubscription: (subscription: PluginAgentEventSubscriptionRegistration) => void;
  /**
   * Emit a host-routed, plugin-attributed agent event for workflow/UI subscribers.
   * @deprecated Use `api.agent.events.emitAgentEvent(...)`.
   */
  emitAgentEvent: (params: PluginAgentEventEmitParams) => PluginAgentEventEmitResult;
  /**
   * Store namespaced, JSON-compatible data for the active run. Cleared on run end/error.
   * @deprecated Use `api.runContext.setRunContext(...)`.
   */
  setRunContext: (patch: PluginRunContextPatch) => boolean;
  /**
   * Read namespaced plugin data for a run.
   * @deprecated Use `api.runContext.getRunContext(...)`.
   */
  getRunContext: (params: PluginRunContextGetParams) => PluginJsonValue | undefined;
  /**
   * Clear one namespace or all namespaces this plugin owns for a run.
   * @deprecated Use `api.runContext.clearRunContext(...)`.
   */
  clearRunContext: (params: { runId: string; namespace?: string }) => void;
  /**
   * Register cleanup metadata for a plugin-owned session scheduler job.
   * This does not schedule work or create task records; it only lets the host
   * clean external scheduler state during reset/delete/disable.
   *
   * @deprecated Use `api.session.workflow.registerSessionSchedulerJob(...)`.
   */
  registerSessionSchedulerJob: (
    job: PluginSessionSchedulerJobRegistration,
  ) => PluginSessionSchedulerJobHandle | undefined;
  /**
   * Register a typed session action that clients can dispatch through the Gateway.
   * @deprecated Use `api.session.controls.registerSessionAction(...)`.
   */
  registerSessionAction: (action: PluginSessionActionRegistration) => void;
  /**
   * Send one or more host-validated files to the active direct-outbound channel for a session.
   *
   * This API is intended for bundled plugins running with the host channel/session
   * integration available. Calls may resolve to `{ ok: false }` instead of attaching
   * files when global side effects are disabled or when the required plugin/channel
   * runtime is not loaded, so callers must handle rejection via the returned result.
   *
   * @deprecated Use `api.session.workflow.sendSessionAttachment(...)`.
   */
  sendSessionAttachment: (
    params: PluginSessionAttachmentParams,
  ) => Promise<PluginSessionAttachmentResult>;
  /**
   * Schedule a future agent turn in a session through Cron.
   * Cron owns timing and creates the task ledger entry when the turn runs.
   * Bundled plugins only; workspace plugins receive undefined.
   *
   * @deprecated Use `api.session.workflow.scheduleSessionTurn(...)`.
   */
  scheduleSessionTurn: (
    params: PluginSessionTurnScheduleParams,
  ) => Promise<PluginSessionSchedulerJobHandle | undefined>;
  /**
   * Remove Cron-backed scheduled session turns that share the same plugin-owned tag.
   * Bundled plugins only; workspace plugins receive a zero-count result.
   *
   * @deprecated Use `api.session.workflow.unscheduleSessionTurnsByTag(...)`.
   */
  unscheduleSessionTurnsByTag: (
    params: PluginSessionTurnUnscheduleByTagParams,
  ) => Promise<PluginSessionTurnUnscheduleByTagResult> /** Register the active detached task runtime for this plugin (exclusive slot). */;
  registerDetachedTaskRuntime: (
    runtime: DetachedTaskLifecycleRuntime,
  ) => void /** Register the active memory capability for this memory plugin (exclusive slot). */;
  registerMemoryCapability: (capability: MemoryPluginCapability) => void;
  /**
   * Register the system prompt section builder for this memory plugin (exclusive slot).
   * @deprecated Use registerMemoryCapability({ promptBuilder }) instead.
   */
  registerMemoryPromptSection: (
    builder: MemoryPromptSectionBuilder,
  ) => void /** Register an additive memory-adjacent prompt section (non-exclusive). */;
  registerMemoryPromptSupplement: (
    builder: MemoryPromptSectionBuilder,
  ) => void /** Register an additive memory-adjacent search/read corpus supplement (non-exclusive). */;
  registerMemoryCorpusSupplement: (supplement: MemoryCorpusSupplement) => void;
  /**
   * Register the pre-compaction flush plan resolver for this memory plugin (exclusive slot).
   * @deprecated Use registerMemoryCapability({ flushPlanResolver }) instead.
   */
  registerMemoryFlushPlan: (resolver: MemoryFlushPlanResolver) => void;
  /**
   * Register the active memory runtime adapter for this memory plugin (exclusive slot).
   * @deprecated Use registerMemoryCapability({ runtime }) instead.
   */
  registerMemoryRuntime: (runtime: MemoryPluginRuntime) => void;
  /**
   * Register a memory embedding provider adapter. Multiple adapters may coexist.
   * @deprecated New embedding providers should use `registerEmbeddingProvider`
   * and `contracts.embeddingProviders`. This memory-specific seam is retained
   * while existing memory providers migrate.
   */
  registerMemoryEmbeddingProvider: (adapter: MemoryEmbeddingProviderAdapter) => void;
  resolvePath: (input: string) => string /** Register a lifecycle hook handler */;
  on: <K extends PluginHookName>(
    hookName: K,
    handler: PluginHookHandlerMap[K],
    opts?: {
      priority?: number;
      timeoutMs?: number;
    },
  ) => void;
};
//#endregion
export {
  OpenClawPluginServiceContext as $,
  AgentHarnessResetParams as $a,
  BoundTaskRunsRuntime as $c,
  CliBackendPlugin as $i,
  ChannelIngressQueueFailedRecord as $l,
  WorkerProvider as $n,
  debugEmbeddingsLog as $o,
  finalizeInboundContext as $r,
  parseNonNegativeByteSize as $s,
  ProviderNonInteractiveApiKeyResult as $t,
  ProviderDefaultThinkingPolicyContext as $u,
  OpenClawPluginDefinition as A,
  RealtimeVoiceProviderCapabilities as Aa,
  ContextEngineRuntimeContext as Ac,
  PluginSessionActionContext as Ai,
  SpeechProviderResolveTalkOverridesContext as Al,
  ProviderResolveWebSocketSessionPolicyContext as An,
  MemoryEmbeddingBatchChunk as Ao,
  filterChannelInboundQuoteContext as Ar,
  EMBEDDING_BATCH_ENDPOINT as As,
  ProviderBuildUnknownModelHintContext as At,
  formatFastModeAutoProgressText as Au,
  OpenClawPluginModule as B,
  RealtimeTranscriptionProviderConfiguredContext as Ba,
  SubagentEndReason as Bc,
  PluginSessionTurnUnscheduleByTagParams as Bi,
  OpenClawPluginActiveModelContext as Bl,
  ProviderValidateReplayTurnsContext as Bn,
  listRegisteredMemoryEmbeddingProviders as Bo,
  CommandFacts as Br,
  readEmbeddingBatchJsonl as Bs,
  ProviderDeferSyntheticProfileAuthContext as Bt,
  BootstrapContextRunKind as Bu,
  OpenClawPluginApi as C,
  RealtimeVoiceBridge as Ca,
  ContextEngineHostCapability as Cc,
  PluginAgentEventEmitParams as Ci,
  SpeechProviderConfiguredContext as Cl,
  ProviderReplayToolCallIdMode as Cn,
  wrapToolWithBeforeToolCallHook as Co,
  BuildChannelInboundEventContextParams as Cr,
  resolveBatchCompletionFromStatus as Cs,
  ProviderAuthContext as Ct,
  CurrentInboundPromptContext as Cu,
  OpenClawPluginCliRegistrar as D,
  RealtimeVoiceBrowserSession as Da,
  ContextEngineOperation as Dc,
  PluginRunContextGetParams as Di,
  SpeechProviderPreparedSynthesis as Dl,
  ProviderResolvePromptOverlayContext as Dn,
  consumePreExecutionBlockedToolCall as Do,
  FinalizeChannelInboundContextParams as Dr,
  EmbeddingBatchExecutionParams as Ds,
  ProviderAuthMethodNonInteractiveContext as Dt,
  AgentHarnessRuntimeArtifactBinding as Du,
  OpenClawPluginCliContext as E,
  RealtimeVoiceBridgeEvent as Ea,
  ContextEngineMaintenanceResult as Ec,
  PluginControlUiDescriptor as Ei,
  SpeechProviderPrepareSynthesisContext as El,
  ProviderResolveNonInteractiveApiKeyParams as En,
  consumeAdjustedParamsForToolCall as Eo,
  FinalizeChannelInboundContextAsyncParams as Er,
  throwIfBatchTerminalFailure as Es,
  ProviderAuthMethod as Et,
  AgentInternalEvent as Eu,
  OpenClawPluginHttpRouteHandler as F,
  RealtimeVoiceRole as Fa,
  ContextEngineRuntimeSettingsUnsupportedError as Fc,
  PluginSessionExtensionProjection as Fi,
  SpeechTelephonySynthesisRequest as Fl,
  ProviderToolSchemaDiagnostic as Fn,
  MemoryEmbeddingProviderCreateOptions as Fo,
  AssembledChannelTurn as Fr,
  extractBatchErrorMessage as Fs,
  ProviderCatalogContext as Ft,
  resolveFastModeForElapsed as Fu,
  OpenClawPluginNodeInvokePolicyContext as G,
  RealtimeTranscriptionSessionCreateRequest as Ga,
  LlmCompleteCaller as Gc,
  CodexAppServerExtensionFactory as Gi,
  TaskRecord as Gl,
  SpeechProviderPlugin as Gn,
  estimateUtf8Bytes as Go,
  RunChannelTurnParams as Gr,
  isFileMissingError as Gs,
  ProviderExtraParamsForTransportResult as Gt,
  PreparedSimpleCompletionModelForAgent as Gu,
  OpenClawPluginNodeInvokeApprovalDecision as H,
  RealtimeTranscriptionProviderResolveConfigContext as Ha,
  TranscriptRewriteReplacement as Hc,
  PluginToolMetadataRegistration as Hi,
  OpenClawPluginToolContext as Hl,
  ProviderWrapStreamFnContext as Hn,
  buildRemoteBaseUrlPolicy as Ho,
  DispatchedChannelTurnResult as Hr,
  DEFAULT_LOCAL_MODEL as Hs,
  ProviderDiscoveryOrder as Ht,
  ExecToolDefaults as Hu,
  OpenClawPluginHttpRouteMatch as I,
  RealtimeVoiceTool as Ia,
  ContextEngineSelectionSource as Ic,
  PluginSessionExtensionRegistration as Ii,
  SpeechVoiceOption as Il,
  ProviderTransformSystemPromptContext as In,
  MemoryEmbeddingProviderCreateResult as Io,
  ChannelTurnAdmission as Ir,
  formatBatchErrorDetail as Is,
  ProviderCatalogOrder as It,
  BlockReplyChunking as Iu,
  OpenClawPluginReloadRegistration as J,
  AgentHarnessAttemptResult as Ja,
  LlmCompleteResult as Jc,
  CodexAppServerToolResultHandlerResult as Ji,
  ChannelIngressQueueClaim as Jl,
  UnifiedModelCatalogProviderPlugin as Jn,
  createRemoteEmbeddingProvider as Jo,
  EnvelopeFormatOptions as Jr,
  buildPluginConfigSchema as Js,
  ProviderFollowupFallbackRouteContext as Jt,
  prepareSimpleCompletionModel as Ju,
  OpenClawPluginNodeInvokePolicyResult as K,
  AgentHarness as Ka,
  LlmCompleteMessage as Kc,
  CodexAppServerExtensionRuntime as Ki,
  TaskStatus as Kl,
  TranscriptSourceProvider as Kn,
  fetchRemoteEmbeddingVectors as Ko,
  ChannelBotLoopProtectionFacts as Kr,
  splitShellArgs as Ks,
  ProviderFailoverErrorContext as Kt,
  SimpleCompletionModelOptions as Ku,
  OpenClawPluginHttpRouteParams as L,
  RealtimeVoiceToolCallEvent as La,
  ContextEngineSessionTarget as Lc,
  PluginSessionSchedulerJobHandle as Li,
  TtsDirectiveOverrides as Ll,
  ProviderTransportThinkingLevel as Ln,
  MemoryEmbeddingProviderIndexIdentity as Lo,
  ChannelTurnDroppedHistoryOptions as Lr,
  formatUnavailableBatchError as Ls,
  ProviderCatalogResult as Lt,
  EmbeddedBlockChunker as Lu,
  OpenClawPluginGatewayRuntimeScopeSurface as M,
  RealtimeVoiceProviderConfiguredContext as Ma,
  ContextEngineRuntimeReasonCode as Mc,
  PluginSessionActionResult as Mi,
  SpeechSynthesisStreamRequest as Ml,
  ProviderRuntimeProviderConfig as Mn,
  MemoryEmbeddingProvider as Mo,
  finalizeChannelInboundContext as Mr,
  ProviderBatchOutputLine as Ms,
  ProviderBuiltInModelSuppressionResult as Mt,
  formatFastModeCurrentStatus as Mu,
  OpenClawPluginHostedMediaResolver as N,
  RealtimeVoiceProviderId as Na,
  ContextEngineRuntimeSettings as Nc,
  PluginSessionAttachmentParams as Ni,
  SpeechSynthesisStreamResult as Nl,
  ProviderSanitizeReplayHistoryContext as Nn,
  MemoryEmbeddingProviderAdapter as No,
  resolveChannelInboundSupplementalContext as Nr,
  postJsonWithRetry as Ns,
  ProviderCacheTtlEligibilityContext as Nt,
  formatFastModeSourceSuffix as Nu,
  OpenClawPluginCommandDefinition as O,
  RealtimeVoiceBrowserSessionCreateRequest as Oa,
  ContextEngineProjection as Oc,
  PluginRunContextPatch as Oi,
  SpeechProviderResolveConfigContext as Ol,
  ProviderResolveTransportTurnStateContext as On,
  AgentHarnessTaskRuntimeScope as Oo,
  FinalizeChannelInboundContextResult as Or,
  buildEmbeddingBatchGroupOptions as Os,
  ProviderAuthResult as Ot,
  resolveFastModeState as Ou,
  OpenClawPluginHttpRouteAuth as P,
  RealtimeVoiceProviderResolveConfigContext as Pa,
  ContextEngineRuntimeSettingsUnavailableError as Pc,
  PluginSessionAttachmentResult as Pi,
  SpeechSynthesisTarget as Pl,
  ProviderSystemPromptContributionContext as Pn,
  MemoryEmbeddingProviderCallOptions as Po,
  AccessFacts as Pr,
  EmbeddingBatchUnavailableError as Ps,
  ProviderCapabilities as Pt,
  formatFastModeStatusValue as Pu,
  OpenClawPluginService as Q,
  AgentHarnessDeliveryDefaults as Qa,
  BoundTaskFlowsRuntime as Qc,
  CliBackendNormalizeConfigContext as Qi,
  ChannelIngressQueueEnqueueResult as Ql,
  WorkerProfile as Qn,
  normalizeEmbeddingModelWithPrefixes as Qo,
  resolveEnvelopeFormatOptions as Qr,
  listRegisteredMemoryEmbeddingProviderAdapters as Qs,
  ProviderNonInteractiveApiKeyCredentialParams as Qt,
  provider_runtime_d_exports as Qu,
  OpenClawPluginHttpRouteUpgradeHandler as R,
  RealtimeVoiceToolResultOptions as Ra,
  IngestBatchResult as Rc,
  PluginSessionSchedulerJobRegistration as Ri,
  TtsDirectiveParseResult as Rl,
  ProviderTransportTurnState as Rn,
  MemoryEmbeddingProviderRuntime as Ro,
  ChannelTurnRecordOptions as Rr,
  isEmbeddingBatchUnavailableError as Rs,
  ProviderCreateEmbeddingProviderContext as Rt,
  AgentStreamParams as Ru,
  OpenClawPluginAgentEventsApi as S,
  RealtimeVoiceBargeInOptions as Sa,
  ContextEngine as Sc,
  PluginLogger as Si,
  SpeechProviderConfig as Sl,
  ProviderReplaySessionState as Sn,
  runBeforeToolCallHook as So,
  BuildChannelInboundEventContextAsyncParams as Sr,
  BatchCompletionResult as Ss,
  ProviderAugmentModelCatalogContext as St,
  resolveAgentTimeoutMs as Su,
  OpenClawPluginCliCommandDescriptor as T,
  RealtimeVoiceBridgeCreateRequest as Ta,
  ContextEngineInfo as Tc,
  PluginAgentEventSubscriptionRegistration as Ti,
  SpeechProviderOverrides as Tl,
  ProviderResolveDynamicModelContext as Tn,
  setBeforeToolCallDiagnosticsEnabled as To,
  ChannelInboundSupplementalResolutionOptions as Tr,
  throwIfBatchCompletionError as Ts,
  ProviderAuthKind as Tt,
  RunEmbeddedAgentParams as Tu,
  OpenClawPluginNodeInvokePolicy as U,
  RealtimeTranscriptionSession as Ua,
  TranscriptRewriteRequest as Uc,
  PluginTrustedToolPolicyRegistration as Ui,
  OpenClawPluginToolFactory as Ul,
  RealtimeTranscriptionProviderPlugin as Un,
  withRemoteHttpResponse as Uo,
  InboundMediaFacts as Ur,
  EmbeddingInput as Us,
  ProviderDiscoveryResult as Ut,
  AgentSimpleCompletionSelection as Uu,
  OpenClawPluginNodeCliFeatureOptions as V,
  RealtimeTranscriptionProviderId as Va,
  SubagentSpawnPreparation as Vc,
  PluginSessionTurnUnscheduleByTagResult as Vi,
  OpenClawPluginHookOptions as Vl,
  ProviderWebSocketSessionPolicy as Vn,
  registerMemoryEmbeddingProvider as Vo,
  ConversationFacts as Vr,
  createLocalEmbeddingProvider as Vs,
  ProviderDiscoveryContext as Vt,
  ExecElevatedDefaults as Vu,
  OpenClawPluginNodeInvokePolicyApprovalRuntime as W,
  RealtimeTranscriptionSessionCallbacks as Wa,
  TranscriptRewriteResult as Wc,
  CodexAppServerExtensionContext as Wi,
  OpenClawPluginToolOptions as Wl,
  RealtimeVoiceProviderPlugin as Wn,
  estimateStructuredEmbeddingInputBytes as Wo,
  PreparedChannelTurn as Wr,
  hasNonTextEmbeddingParts as Ws,
  ProviderExtraParamsForTransportContext as Wt,
  PreparedSimpleCompletionModel as Wu,
  OpenClawPluginSecurityAuditCollector as X,
  AgentHarnessCompactParams as Xa,
  PluginRuntimeCore as Xc,
  CliBackendExecutionMode as Xi,
  ChannelIngressQueueCompletedRecord as Xl,
  WorkerLease as Xn,
  RemoteEmbeddingProviderId as Xo,
  formatInboundEnvelope as Xr,
  getMemoryEmbeddingProvider as Xs,
  ProviderModelSelectedContext as Xt,
  resolveSimpleCompletionSelectionForAgent as Xu,
  OpenClawPluginRunContextApi as Y,
  AgentHarnessAuthBindingFingerprintParams as Ya,
  LlmCompleteUsage as Yc,
  CliBackendAuthEpochMode as Yi,
  ChannelIngressQueueClaimRef as Yl,
  VideoGenerationProviderPlugin as Yn,
  resolveRemoteEmbeddingClient as Yo,
  formatAgentEnvelope as Yr,
  emptyPluginConfigSchema as Ys,
  ProviderFollowupFallbackRouteResult as Yt,
  prepareSimpleCompletionModelForAgent as Yu,
  OpenClawPluginSecurityAuditContext as Z,
  AgentHarnessCompactResult as Za,
  RuntimeLogger as Zc,
  CliBackendNativeToolMode as Zi,
  ChannelIngressQueueCorruptClaim as Zl,
  WorkerLeaseStatus as Zn,
  resolveRemoteEmbeddingBearerClient as Zo,
  formatInboundFromLabel as Zr,
  listMemoryEmbeddingProviders as Zs,
  ProviderModernModelPolicyContext as Zt,
  augmentModelCatalogWithProviderPlugins as Zu,
  MigrationSummary as _,
  OpenClawAgentToolResult as _a,
  resolveContextEngine as _c,
  HEARTBEAT_RESPONSE_TOOL_NAME as _d,
  resolveBootstrapFilesForRun as _i,
  normalizeTtsAutoMode as _l,
  ProviderReasoningOutputModeContext as _n,
  finalizeToolTerminalPresentation as _o,
  resolveChannelTurnDispatchCounts as _r,
  hashText as _s,
  PluginSetupAutoEnableContext as _t,
  WebSearchRuntimeMetadataContext as _u,
  ImageGenerationProviderPlugin as a,
  CliBackendSideQuestionToolMode as aa,
  stripHeartbeatToken as ac,
  ProviderAuthOptionBag as ad,
  createReplyDispatcher as ai,
  DetachedTaskTerminalState as al,
  ProviderPlugin as an,
  CompactEmbeddedAgentSessionParams as ao,
  OpenClawPluginNodeHostCommandAvailabilityContext as ar,
  MemoryChunk as as,
  PluginCommandDiagnosticsSession as at,
  WebFetchProviderContext as au,
  OpenClawGatewayDiscoveryService as b,
  RealtimeVoiceAudioClearReason as ba,
  BootstrapResult as bc,
  SkillWorkshopRunOptions as bd,
  ProviderNormalizeConfigContext as bi,
  SpeechListVoicesRequest as bl,
  ProviderReplaySanitizeMode as bn,
  hasBeforeToolCallPolicy as bo,
  DurableInboundReplyDeliveryResult as br,
  buildBatchHeaders as bs,
  PluginTextTransformRegistration as bt,
  GenerateImageParams as bu,
  MigrationDetection as c,
  PluginTextReplacement as ca,
  resolveMemorySearchConfig as cc,
  ProviderResolveExternalAuthProfilesContext as cd,
  InternalGetReplyFromConfig as ci,
  TaskRunAggregateSummary as cl,
  ProviderPluginWizard as cn,
  PreemptiveCompactionRoute as co,
  PluginRuntime as cr,
  buildMultimodalChunkForIndexing as cs,
  PluginConfigMigration as ct,
  WebFetchProviderToolDefinition as cu,
  MigrationItemKind as d,
  AgentToolResultMiddlewareContext as da,
  CronStyleNow as dc,
  ProviderSyntheticAuthResult as dd,
  CommandContext as di,
  TaskRunView as dl,
  ProviderPreferRuntimeResolvedModelContext as dn,
  BuildAgentRuntimePlanParams as do,
  kernel_d_exports as dr,
  ensureMemoryHostDir as ds,
  PluginInteractiveHandlerRegistration as dt,
  WebSearchProviderContext as du,
  CliBackendPrepareExecutionContext as ea,
  withProgress as ec,
  ProviderThinkingPolicyContext as ed,
  settleReplyDispatcher as ei,
  PluginRuntimeTaskFlows as el,
  ProviderNormalizeModelIdContext as en,
  AgentHarnessResultClassification as eo,
  WorkerProviderError as er,
  sanitizeAndNormalizeEmbedding as es,
  OpenClawPluginSessionApi as et,
  ChannelIngressQueuePruneOptions as eu,
  MigrationItemStatus as f,
  AgentToolResultMiddlewareEvent as fa,
  appendCronStyleCurrentTimeLine as fc,
  EmbeddedAgentCompactResult as fd,
  CommandHandler as fi,
  ResolvedTtsConfig as fl,
  ProviderPrepareDynamicModelContext as fn,
  BeforeToolCallFailureDisposition as fo,
  recordDroppedChannelInboundHistory as fr,
  listMemoryFiles as fs,
  PluginInteractiveHandlerResult as ft,
  WebSearchProviderId as fu,
  MigrationProviderPreparation as g,
  AgentToolResultMiddlewareRuntime as ga,
  registerContextEngine as gc,
  MessagingToolSourceReplyPayload as gd,
  resolveBootstrapContextForRun as gi,
  TTS_AUTO_MODES as gl,
  ProviderReasoningOutputMode as gn,
  ToolOutcomeObserver as go,
  hasVisibleChannelTurnDispatch as gr,
  runMemoryHostTasksWithConcurrency as gs,
  PluginRegistrationMode as gt,
  WebSearchProviderToolExecutionContext as gu,
  MigrationProviderPlugin as h,
  AgentToolResultMiddlewareResult as ha,
  ContextEngineFactoryContext as hc,
  MessagingToolSend as hd,
  buildBootstrapContextForFiles as hi,
  resolveEffectiveTtsConfig as hl,
  ProviderPreparedRuntimeAuth as hn,
  HookContext as ho,
  hasFinalChannelTurnDispatch as hr,
  remapChunkLines as hs,
  PluginRealtimeVoiceProviderEntry as ht,
  WebSearchProviderToolDefinition as hu,
  AgentPromptSurfaceKind as i,
  CliBackendRuntimeArtifactPolicy as ia,
  resolveHeartbeatPrompt as ic,
  ProviderSystemPromptContribution as id,
  ReplyDispatcherWithTypingOptions as ii,
  DetachedTaskLifecycleRuntime as il,
  ProviderOAuthProfileIdRepair as in,
  AgentHarnessSupportContext as io,
  OpenClawPluginNodeHostCommand as ir,
  enforceEmbeddingMaxInputTokens as is,
  PluginCommandContext as it,
  WebFetchCredentialResolutionSource as iu,
  OpenClawPluginGatewayMethod as j,
  RealtimeVoiceProviderConfig as ja,
  ContextEngineRuntimeMode as jc,
  PluginSessionActionRegistration as ji,
  SpeechSynthesisRequest as jl,
  ProviderResolvedUsageAuth as jn,
  MemoryEmbeddingBatchOptions as jo,
  filterChannelInboundSupplementalContext as jr,
  EmbeddingBatchStatus as js,
  ProviderBuiltInModelSuppressionContext as jt,
  formatFastModeCommandOptions as ju,
  OpenClawPluginConfigSchema as k,
  RealtimeVoiceCloseReason as ka,
  ContextEnginePromptCacheInfo as kc,
  PluginRuntimeLifecycleRegistration as ki,
  SpeechProviderResolveTalkConfigContext as kl,
  ProviderResolveUsageAuthContext as kn,
  resolveEmbeddedAgentRuntime as ko,
  buildChannelInboundEventContext as kr,
  runEmbeddingBatchGroups as ks,
  ProviderBuildMissingAuthMessageContext as kt,
  FastModeAutoProgressState as ku,
  MigrationItem as l,
  PluginTextTransforms as la,
  resolveMemorySearchSyncConfig as lc,
  ProviderResolveExternalOAuthProfilesContext as ld,
  InternalGetReplyOptions as li,
  TaskRunCancelResult as ll,
  ProviderPluginWizardModelPicker as ln,
  isReplaySafeToolCall as lo,
  SubagentRunParams as lr,
  chunkMarkdown as ls,
  PluginConfigValidation as lt,
  WebFetchRuntimeMetadataContext as lu,
  MigrationProviderContext as m,
  AgentToolResultMiddlewareOptions as ma,
  ContextEngineFactory as mc,
  EmbeddedAgentRunResult as md,
  RunCliAgentParams as mi,
  TtsConfigResolutionContext as ml,
  ProviderPrepareRuntimeAuthContext as mn,
  DeferredPluginToolApproval as mo,
  ChannelTurnVisibleDeliverySignals as mr,
  parseEmbedding as ms,
  PluginRealtimeTranscriptionProviderEntry as mt,
  WebSearchProviderSetupContext as mu,
  AgentPromptGuidance as n,
  CliBackendResolveExecutionArgs as na,
  DEFAULT_HEARTBEAT_ACK_MAX_CHARS as nc,
  ProviderRuntimeModel as nd,
  DispatchReplyWithDispatcher as ni,
  PluginRuntimeTasks as nl,
  ProviderNormalizeToolSchemasContext as nn,
  AgentHarnessSideQuestionResult as no,
  WorkerSshIdentity as nr,
  mapBatchEmbeddingsByIndex as ns,
  OpenClawPluginSessionStateApi as nt,
  PluginWebFetchProviderEntry as nu,
  MediaUnderstandingProviderPlugin as o,
  CliBackendThinkingLevel as oa,
  ResolvedMemorySearchConfig as oc,
  ProviderExternalAuthProfile as od,
  createReplyDispatcherWithTyping as oi,
  TaskFlowDetail as ol,
  ProviderPluginCatalog as on,
  EmbeddedRunAttemptParams as oo,
  OpenClawPluginNodeHostCommandIo as or,
  MemoryFileEntry as os,
  PluginCommandHandler as ot,
  WebFetchProviderId as ou,
  MigrationPlan as p,
  AgentToolResultMiddlewareHarness as pa,
  resolveCronStyleNow as pc,
  EmbeddedAgentRunMeta as pd,
  CliSessionBindingFacts as pi,
  ResolvedTtsModelOverrides as pl,
  ProviderPrepareExtraParamsContext as pn,
  BeforeToolCallPolicyDiagnosticState as po,
  ChannelTurnDispatchResultLike as pr,
  normalizeExtraMemoryPaths as ps,
  PluginInteractiveRegistration as pt,
  WebSearchProviderPlugin as pu,
  OpenClawPluginNodeInvokeTransportResult as q,
  AgentHarnessAttemptParams as qa,
  LlmCompleteParams as qc,
  CodexAppServerToolResultEvent as qi,
  ChannelIngressQueue as ql,
  UnifiedModelCatalogProviderContext as qn,
  RemoteEmbeddingClient as qo,
  recordChannelBotPairLoopAndCheckSuppression as qr,
  buildJsonPluginConfigSchema as qs,
  ProviderFetchUsageSnapshotContext as qt,
  completeWithPreparedSimpleCompletionModel as qu,
  AgentPromptGuidanceEntry as r,
  CliBackendResolveExecutionArgsContext as ra,
  HEARTBEAT_PROMPT as rc,
  ProviderRuntimePluginHandle as rd,
  ReplyDispatcherOptions as ri,
  DetachedTaskFinalizeParams as rl,
  ProviderNormalizeTransportContext as rn,
  AgentHarnessSupport as ro,
  WorkerSshIdentityRequest as rr,
  sanitizeEmbeddingCacheHeaders as rs,
  OpenClawPluginSessionWorkflowApi as rt,
  PluginWebSearchProviderEntry as ru,
  MigrationApplyResult as s,
  CliBundleMcpMode as sa,
  ResolvedMemorySearchSyncConfig as sc,
  ProviderExternalOAuthProfile as sd,
  DispatchFromConfigResult as si,
  TaskFlowView as sl,
  ProviderPluginDiscovery as sn,
  EmbeddedRunAttemptResult as so,
  CreatePluginRuntimeOptions as sr,
  buildFileEntry as ss,
  PluginCommandResult as st,
  WebFetchProviderPlugin as su,
  AGENT_PROMPT_SURFACE_KINDS as t,
  CliBackendPreparedExecution as ta,
  withProgressTotals as tc,
  ProviderThinkingProfile as td,
  DispatchReplyWithBufferedBlockDispatcher$1 as ti,
  PluginRuntimeTaskRuns as tl,
  ProviderNormalizeResolvedModelContext as tn,
  AgentHarnessSideQuestionParams as to,
  WorkerSshEndpoint as tr,
  isMissingEmbeddingApiKeyError as ts,
  OpenClawPluginSessionControlsApi as tt,
  ChannelIngressQueueRecord as tu,
  MigrationItemAction as u,
  AgentToolResultMiddleware as ua,
  DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR as uc,
  ProviderResolveSyntheticAuthContext as ud,
  CommandSessionMetadataChange as ui,
  TaskRunDetail as ul,
  ProviderPluginWizardSetup as un,
  AgentRuntimePlan as uo,
  SubagentRunResult as ur,
  cosineSimilarity as us,
  PluginEmbeddingProvider as ut,
  WebSearchCredentialResolutionSource as uu,
  MusicGenerationProviderPlugin as v,
  REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ as va,
  resolveContextEngineOwnerPluginId as vc,
  HeartbeatToolResponse as vd,
  ProcessToolDefaults as vi,
  SpeechDirectiveTokenParseContext as vl,
  ProviderReplayPolicy as vn,
  getBeforeToolCallFailureDisposition as vo,
  DurableInboundReplyDeliveryOptions as vr,
  uploadBatchJsonlFile as vs,
  PluginSetupAutoEnableProbe as vt,
  GenerateVideoParams as vu,
  OpenClawPluginChannelRegistration as w,
  RealtimeVoiceBridgeCallbacks as wa,
  ContextEngineHostRequirements as wc,
  PluginAgentEventEmitResult as wi,
  SpeechProviderId as wl,
  ProviderResolveAuthProfileIdContext as wn,
  isToolWrappedWithBeforeToolCallHook as wo,
  BuiltChannelInboundEventContext as wr,
  resolveCompletedBatchResult as ws,
  ProviderAuthDoctorHintContext as wt,
  EmbeddedRunTrigger as wu,
  OpenClawPluginAgentApi as x,
  RealtimeVoiceAudioFormat as xa,
  CompactResult as xc,
  ReplyBackendQueueMessageOptions as xd,
  ProviderResolveConfigApiKeyContext as xi,
  SpeechModelOverridePolicy as xl,
  ProviderReplaySessionEntry as xn,
  requestDeferredPluginToolApproval as xo,
  deliverInboundReplyWithMessageSendContext as xr,
  normalizeBatchBaseUrl as xs,
  PluginTranscriptsSourceProviderEntry as xt,
  GenerateImageRuntimeResult as xu,
  OpenClawGatewayDiscoveryAdvertiseContext as y,
  REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ as ya,
  AssembleResult as yc,
  normalizeHeartbeatToolResponse as yd,
  ProviderApplyConfigDefaultsContext as yi,
  SpeechDirectiveTokenParseResult as yl,
  ProviderReplayPolicyContext as yn,
  getBeforeToolCallPolicyDiagnosticState as yo,
  DurableInboundReplyDeliveryParams as yr,
  BatchHttpClientConfig as ys,
  PluginSpeechProviderEntry as yt,
  GenerateVideoRuntimeResult as yu,
  OpenClawPluginLifecycleApi as z,
  RealtimeTranscriptionProviderConfig as za,
  IngestResult as zc,
  PluginSessionTurnScheduleParams as zi,
  ResolvedProviderRuntimeAuth as zl,
  ProviderUsageAuthToken as zn,
  clearMemoryEmbeddingProviders as zo,
  ChannelTurnResult as zr,
  applyEmbeddingBatchOutputLine as zs,
  ProviderCreateStreamFnContext as zt,
  ClientToolDefinition as zu,
};
