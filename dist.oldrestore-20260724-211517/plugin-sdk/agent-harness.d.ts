import { t as resolveOpenClawAgentDir } from "../agent-dir-compat-ochOeoeD.js";
import {
  $ as inspectRuntimeToolInputSchemas,
  $t as buildAgentHarnessUserInputAnswers,
  A as resolveCompactionTimeoutMs,
  At as NodeListNode,
  B as resolveAgentHarnessBeforePromptBuildResult,
  Bt as NativeHookRelayProcessResponse,
  C as PREEMPTIVE_OVERFLOW_ERROR_TEXT,
  Ct as resolveToolResultFailureKind,
  D as shouldPreemptivelyCompactBeforePrompt,
  Dt as listNodes,
  E as formatPrePromptPrecheckLog,
  Et as formatToolAggregate,
  F as finalizeHarnessContextEngineTurn,
  Ft as isHostScopedAgentToolActive,
  G as resolveWritableSandboxBindHostRoots,
  Gt as invokeNativeHookRelay,
  H as runAgentHarnessBeforeCompactionHook,
  Ht as NativeHookRelayRegistrationHandle,
  I as isActiveHarnessContextEngine,
  It as resolveAgentRunAbortLifecycleFields,
  J as normalizeAgentRuntimeTools,
  Jt as testing,
  K as normalizeProviderToolSchemas,
  Kt as registerNativeHookRelay,
  L as runHarnessContextEngineMaintenance,
  Lt as runAgentCleanupStep,
  M as bootstrapHarnessContextEngine,
  Mt as classifyEmbeddedAgentRunResultForModelFallback,
  N as buildHarnessContextEngineRuntimeContext,
  Nt as buildAgentRuntimePlan,
  O as compactContextEngineWithSafetyTimeout,
  Ot as resolveNodeIdFromList,
  P as buildHarnessContextEngineRuntimeContextFromUsage,
  Pt as log,
  Q as filterProviderNormalizableTools,
  Qt as AgentHarnessUserInputQuestion,
  R as createAgentToolResultMiddlewareRunner,
  Rt as buildAgentHookContextChannelFields,
  S as LlmBoundaryTokenPressure,
  St as resolveToolExecutionErrorKind,
  T as estimateRenderedLlmBoundaryTokenPressure,
  Tt as isMessagingToolSendAction,
  U as hasSandboxBindContainerPathAliases,
  Ut as buildNativeHookRelayCommand,
  V as runAgentHarnessAfterCompactionHook,
  Vt as NativeHookRelayProvider,
  W as hasSandboxBindReadonlyHostShadows,
  Wt as hasNativeHookRelayInvocation,
  X as RuntimeToolInputSchemaProjection,
  Xt as AgentHarnessUserInputOption,
  Y as RuntimeToolInputSchemaJson,
  Yt as AgentHarnessUserInputAnswers,
  Z as RuntimeToolSchemaDiagnostic,
  Zt as AgentHarnessUserInputPromptOptions,
  _ as runAgentHarnessBeforeAgentFinalizeHook,
  _t as filterToolResultMediaUrls,
  a as ToolProgressDetailMode,
  an as isDeliveredMessagingToolResult,
  at as buildEmbeddedAttemptToolRunContext,
  b as runAgentHarnessAfterToolCallHook,
  bt as formatToolExecutionErrorMessage,
  c as formatToolProgressOutput,
  ct as SKILL_WORKSHOP_TOOL_NAME,
  d as queueAgentHarnessMessage,
  dt as isAgentToolReplaySafe,
  en as deliverAgentHarnessUserInputPrompt,
  et as projectRuntimeToolInputSchema,
  f as awaitAgentEndSideEffects,
  ft as supportsModelTools,
  g as runAgentHarnessAgentEndHook,
  gt as extractToolResultMediaArtifact,
  h as getAgentHarnessHookRunner,
  ht as extractToolErrorMessage,
  i as TOOL_PROGRESS_OUTPUT_MAX_CHARS,
  in as isDeliveredMessageToolOnlySourceReplyResult,
  it as OpenClawCodingToolConstructionPlan,
  j as assembleHarnessContextEngine,
  jt as callGatewayTool,
  k as compactWithSafetyTimeout,
  kt as selectDefaultNodeFromList,
  l as inferToolMetaFromArgs,
  lt as buildSkillWorkshopPromptSection,
  m as awaitAgentHarnessAgentEndHook,
  mt as extractMessagingToolSendResult,
  n as AgentHarnessTerminalOutcomeInput,
  nn as formatAgentHarnessUserInputPrompt,
  nt as applyEmbeddedAttemptToolsAllow,
  o as classifyAgentHarnessTerminalOutcome,
  on as CodexBundleMcpThreadConfig,
  ot as resolveAttemptSpawnWorkspaceDir,
  p as runAgentEndSideEffects,
  pt as extractMessagingToolSend,
  q as logAgentRuntimeToolDiagnostics,
  qt as resolveNativeHookRelayDeferredToolApproval,
  r as EmbeddedRunAttemptParams,
  rn as normalizeAgentHarnessUserInputAnswer,
  rt as resolveEmbeddedAttemptToolConstructionPlan,
  s as detectAndLoadAgentHarnessPromptImages,
  sn as LoadCodexBundleMcpThreadConfigParams,
  st as resolveAttemptFsWorkspaceOnly,
  t as AgentHarnessTerminalOutcomeClassification,
  tn as emptyAgentHarnessUserInputAnswers,
  tt as disposeRegisteredAgentHarnesses,
  u as loadCodexBundleMcpThreadConfig,
  ut as getChannelAgentToolMeta,
  v as runAgentHarnessLlmInputHook,
  vt as sanitizeToolResult,
  w as PreemptiveCompactionDecision,
  wt as isMessagingTool,
  x as runAgentHarnessBeforeMessageWriteHook,
  xt as isToolResultError,
  y as runAgentHarnessLlmOutputHook,
  yt as ToolResultFailureKind,
  z as createCodexAppServerToolResultExtensionRunner,
  zt as NativeHookRelayEvent,
} from "../agent-harness-runtime-DPd68NFS.js";
import {
  C as resolveSessionAgentIds,
  F as resolveDefaultAgentDir,
  N as resolveAgentDir,
} from "../agent-scope-C-j0oyUV.js";
import { t as formatApprovalDisplayPath } from "../approval-display-paths-Hb4BQ_zR.js";
import { t as ChatType } from "../chat-type-B6XXSSnm.js";
import { r as AnyAgentTool } from "../common-CuQ9SS3Z.js";
import { t as ResolvedConversationCapabilityProfile } from "../conversation-capability-profile-Xd4Ff0zW.js";
import { t as CrestodianToolOptions } from "../crestodian-tool-50WDa1oF.js";
import { t as DiagnosticTraceContext } from "../diagnostic-trace-context-c5mRZYEt.js";
import { r as formatErrorMessage } from "../errors-DFNEfRR0.js";
import { c as ExecApprovalDecision } from "../exec-approvals-B59RubLo.js";
import {
  i as ExecAutoReviewer,
  r as ExecAutoReviewInput,
  t as ExecAutoReviewDecision,
} from "../exec-auto-review-D8kEqNZE.js";
import { r as fingerprintResolvedAuthProfileCredential } from "../execution-auth-binding-C-IDfQYX.js";
import { c as resolveUserPath } from "../home-dir-4pOw9r_P.js";
import {
  r as assertContextEngineHostSupport,
  t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
} from "../host-compat-P3rymViq.js";
import { _ as resolveModelAuthMode, t as ModelAuthMode } from "../model-auth-DQnRyl6R.js";
import {
  c as getModelProviderRequestTransport,
  s as attachModelProviderRequestTransport,
} from "../provider-request-config-CKlP6x21.js";
import { t as FAST_MODE_AUTO_PROGRESS_KIND } from "../reply-payload-DPFdJynw.js";
import {
  a as clearActiveEmbeddedRun,
  f as resolveActiveEmbeddedRunSessionId,
  i as abortEmbeddedAgentRun,
  o as setActiveEmbeddedRun,
  r as abortAndDrainEmbeddedAgentRun,
  t as AbortAndDrainEmbeddedAgentRunResult,
} from "../runs-DpmUlAWl.js";
import { P as resolveSandboxContext } from "../sandbox-BOYyXwTy.js";
import { d as isSubagentSessionKey } from "../session-key-COxKqlXJ.js";
import {
  i as resolveSessionWriteLockOptions,
  n as acquireSessionWriteLock,
  r as resolveSessionWriteLockAcquireTimeoutMs,
  t as SessionWriteLockAcquireTimeoutConfig,
} from "../session-write-lock-CTGMQVOj.js";
import { _ as InboundEventKind, h as PluginHookChannelContext } from "../templating-h3OQefFR.js";
import {
  n as ToolSearchCatalogToolExecutor,
  t as ToolSearchCatalogRef,
} from "../tool-search-D3CNzovA.js";
import { a as getPluginToolMeta } from "../tools-C_SS-MvJ.js";
import { a as SkillUsagePath, r as SkillSnapshot } from "../types-9R5xAbjv.js";
import {
  a as SourceReplyDeliveryMode,
  o as TaskSuggestionDeliveryMode,
} from "../types-BgrDi5xH.js";
import {
  i as SandboxToolPolicy,
  n as SandboxContext,
  o as SandboxWorkspaceAccess,
} from "../types-CD5wx17Q.js";
import { t as EmbeddedContextFile } from "../types-CF0DHR3y.js";
import {
  D as emitAgentEvent,
  O as onAgentEvent,
  T as AgentEventPayload,
  k as resetAgentEventsForTest,
  w as AgentApprovalEventData,
} from "../types-Dz3ohwUV.js";
import { s as AuthProfileStore } from "../types-Dzb4Vh4b.js";
import {
  $a as AgentHarnessResetParams,
  Au as formatFastModeAutoProgressText,
  Cc as ContextEngineHostCapability,
  Co as wrapToolWithBeforeToolCallHook,
  Dc as ContextEngineOperation,
  Do as consumePreExecutionBlockedToolCall,
  Du as AgentHarnessRuntimeArtifactBinding,
  Eo as consumeAdjustedParamsForToolCall,
  Fu as resolveFastModeForElapsed,
  Gi as CodexAppServerExtensionFactory,
  Hu as ExecToolDefaults,
  Ja as AgentHarnessAttemptResult,
  Ji as CodexAppServerToolResultHandlerResult,
  Ka as AgentHarness,
  Ki as CodexAppServerExtensionRuntime,
  Oc as ContextEngineProjection,
  Qa as AgentHarnessDeliveryDefaults,
  Sc as ContextEngine,
  So as runBeforeToolCallHook,
  To as setBeforeToolCallDiagnosticsEnabled,
  Wi as CodexAppServerExtensionContext,
  Xa as AgentHarnessCompactParams,
  Ya as AgentHarnessAuthBindingFingerprintParams,
  Za as AgentHarnessCompactResult,
  _a as OpenClawAgentToolResult,
  _d as HEARTBEAT_RESPONSE_TOOL_NAME,
  _i as resolveBootstrapFilesForRun,
  _o as finalizeToolTerminalPresentation,
  ao as CompactEmbeddedAgentSessionParams,
  bd as SkillWorkshopRunOptions,
  bo as hasBeforeToolCallPolicy,
  da as AgentToolResultMiddlewareContext,
  eo as AgentHarnessResultClassification,
  fa as AgentToolResultMiddlewareEvent,
  fd as EmbeddedAgentCompactResult,
  fo as BeforeToolCallFailureDisposition,
  ga as AgentToolResultMiddlewareRuntime,
  gd as MessagingToolSourceReplyPayload,
  gi as resolveBootstrapContextForRun,
  go as ToolOutcomeObserver,
  ha as AgentToolResultMiddlewareResult,
  hd as MessagingToolSend,
  hi as buildBootstrapContextForFiles,
  io as AgentHarnessSupportContext,
  ko as resolveEmbeddedAgentRuntime,
  ku as FastModeAutoProgressState,
  lo as isReplaySafeToolCall,
  ma as AgentToolResultMiddlewareOptions,
  mo as DeferredPluginToolApproval,
  no as AgentHarnessSideQuestionResult,
  pa as AgentToolResultMiddlewareHarness,
  po as BeforeToolCallPolicyDiagnosticState,
  qa as AgentHarnessAttemptParams,
  qi as CodexAppServerToolResultEvent,
  ro as AgentHarnessSupport,
  so as EmbeddedRunAttemptResult,
  to as AgentHarnessSideQuestionParams,
  ua as AgentToolResultMiddleware,
  vc as resolveContextEngineOwnerPluginId,
  vd as HeartbeatToolResponse,
  vi as ProcessToolDefaults,
  vo as getBeforeToolCallFailureDisposition,
  wo as isToolWrappedWithBeforeToolCallHook,
  xo as requestDeferredPluginToolApproval,
  yd as normalizeHeartbeatToolResponse,
  yo as getBeforeToolCallPolicyDiagnosticState,
} from "../types-Ga3mNO_F.js";
import { s as AgentMessage } from "../types-JQFrjdua.js";
import { o as ModelCompatConfig } from "../types.models-BqJSiNyu.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
import { n as NormalizedUsage, r as normalizeUsage } from "../usage-DzTfux3q.js";
import { r as VERSION } from "../version-C1kCd9e0.js";

//#region src/agents/tools/cron-tool.d.ts
type CronCreatorToolAllowlistEntry =
  | string
  | {
      name: string;
      pluginId?: string;
    };
//#endregion
//#region src/agents/agent-tools.d.ts
/** Public options for building one plugin-owned agent tool surface. */
type OpenClawCodingToolsOptions = {
  agentId?: string;
  exec?: ExecToolDefaults & ProcessToolDefaults;
  messageProvider?: string /** Canonical transport channel when tool-policy provider differs from delivery channel. */;
  messageChannel?: string /** Capabilities declared by the gateway client that originated this run. */;
  clientCaps?: string[] /** Normalized conversation kind when the caller already has channel metadata. */;
  chatType?: ChatType /** Specific ingress provider used only for transport tool availability. */;
  toolPolicyMessageProvider?: string;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?:
    | string
    | number /** Trusted platform-native conversation id for the active inbound turn. */;
  nativeChannelId?: string /** Opaque host-issued capability for current-turn channel message actions. */;
  messageActionTurnCapability?: string;
  sandbox?: SandboxContext | null;
  sessionKey?: string;
  /**
   * The actual live run session key. When the tool set is constructed with a
   * sandbox/policy session key, this allows `session_status({sessionKey:"current"})`
   * to resolve to the live run session instead of the stale sandbox key.
   */
  runSessionKey?: string /** Ephemeral session UUID — regenerated on /new and /reset. */;
  sessionId?: string;
  /**
   * Explicit one-shot local CLI runs should not keep plugin-owned process
   * resources alive after emitting their result.
   */
  oneShotCliRun?: boolean /** Stable run identifier for this agent invocation. */;
  runId?: string /** Device-scoped operator session allowed to review approvals initiated by this run. */;
  approvalReviewerDeviceId?: string /** Diagnostic trace context for hook/log correlation during this run. */;
  trace?: DiagnosticTraceContext /** What initiated this run (for trigger-specific tool restrictions). */;
  trigger?: string /** Stable cron job identifier populated for cron-triggered runs. */;
  jobId?: string /** Relative workspace path that memory-triggered writes may append to. */;
  memoryFlushWritePath?: string;
  agentDir?: string /** Task working directory for coding tools. Defaults to workspaceDir. */;
  cwd?: string;
  workspaceDir?: string;
  /**
   * Workspace directory that spawned subagents should inherit.
   * When sandboxing uses a copied workspace (`ro` or `none`), workspaceDir is the
   * sandbox copy but subagents should inherit the real agent workspace instead.
   * Defaults to workspaceDir when not set.
   */
  spawnWorkspaceDir?: string;
  config?: OpenClawConfig;
  abortSignal?: AbortSignal /** Disable hook-owned diagnostics when an outer runtime owns tool diagnostics. */;
  emitBeforeToolCallDiagnostics?: boolean;
  /**
   * Provider of the currently selected model (used for provider-specific tool quirks).
   * Example: "anthropic", "openai", "google", "openai".
   */
  modelProvider?: string /** Model id for the current provider (used for model-specific tool gating). */;
  modelId?: string /** Internal review-run restrictions and proposal provenance. */;
  skillWorkshop?: SkillWorkshopRunOptions /** Model API for the current provider (used for provider-native tool arbitration). */;
  modelApi?: string /** Model context window in tokens (used to scale read-tool output budget). */;
  modelContextWindowTokens?: number /** Resolved runtime model compatibility hints. */;
  modelCompat?: ModelCompatConfig /** If false, keep OpenClaw web_search even when a provider-native search tool is active. */;
  suppressManagedWebSearch?: boolean;
  /**
   * Auth mode for the current provider. We only need this for Anthropic OAuth
   * tool-name blocking quirks.
   */
  modelAuthMode?: ModelAuthMode /** Current channel ID for auto-threading (Slack). */;
  currentChannelId?: string /** Routable target for the current conversation when it differs from the native channel ID. */;
  currentMessagingTarget?: string /** Normalized conversation id exposed to tool hooks. Defaults to currentChannelId. */;
  hookChannelId?: string /** Channel-owned sender/chat metadata exposed to subprocess environments. */;
  channelContext?: PluginHookChannelContext /** Current thread timestamp for auto-threading (Slack). */;
  currentThreadTs?: string /** Current inbound message id for action fallbacks (e.g. Telegram react). */;
  currentMessageId?: string | number /** True when the current inbound turn carried audio media. */;
  currentInboundAudio?: boolean /** Dynamic audio state for runs that can accept steered input after tool creation. */;
  hasCurrentInboundAudio?: () => boolean /** Group id for channel-level tool policy resolution. */;
  groupId?:
    | string
    | null /** Group channel label (e.g. #general) for channel-level tool policy resolution. */;
  groupChannel?:
    | string
    | null /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */;
  groupSpace?: string | null /** Trusted provider role ids for the requester in this group turn. */;
  memberRoleIds?: string[] /** Parent session key for subagent group policy inheritance. */;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null /** Reply-to mode for Slack auto-threading. */;
  replyToMode?:
    | "off"
    | "first"
    | "all"
    | "batched" /** Mutable ref to track if a reply was sent (for "first" mode). */;
  hasRepliedRef?: {
    value: boolean;
  } /** Allow plugin tools for this run to late-bind the gateway subagent. */;
  allowGatewaySubagentBinding?: boolean /** Runtime-scoped explicit allowlist used to materialize matching plugin tools. */;
  runtimeToolAllowlist?: string[] /** Mutable cron creator cap ref for callers that append final runtime tools later. */;
  cronCreatorToolAllowlistRef?: CronCreatorToolAllowlistEntry[] /** If true, the model has native vision capability */;
  modelHasVision?: boolean /** Mutable model-context generation used to expire screenshot coordinate frames. */;
  computerContextEpoch?: {
    value: number;
  } /** Require explicit message targets (no implicit last-route sends). */;
  requireExplicitMessageTarget?: boolean /** Visible source replies must be sent through the message tool when set to message_tool_only. */;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode /** Action sink available for model-proposed follow-up tasks. */;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  inboundEventKind?: InboundEventKind /** If true, omit the message tool from the tool list. */;
  disableMessageTool?: boolean /** Keep the message tool available even when the selected profile omits it. */;
  forceMessageTool?: boolean /** Include the heartbeat response tool for structured heartbeat outcomes. */;
  enableHeartbeatTool?: boolean /** Keep the heartbeat response tool available even when the selected profile omits it. */;
  forceHeartbeatTool?: boolean /** If false, build plugin tools only while preserving the shared policy pipeline. */;
  includeCoreTools?: boolean /** Include Tool Search control tools when enabled for this run. */;
  includeToolSearchControls?: boolean /** Executes cataloged tools through the active agent run lifecycle. */;
  toolSearchCatalogExecutor?: ToolSearchCatalogToolExecutor /** Runtime-local Tool Search catalog ref shared with attempt compaction. */;
  toolSearchCatalogRef?: ToolSearchCatalogRef /** Limits which tool families are materialized before the shared policy pipeline runs. */;
  toolConstructionPlan?: OpenClawCodingToolConstructionPlan /** Ring-zero Crestodian tool; set only by the Crestodian agent runner. */;
  crestodianTool?: CrestodianToolOptions /** Trusted sender identity bit for command/channel-action auth and owner-gated plugin tools. */;
  senderIsOwner?: boolean /** Auth profiles already loaded for this run; used for prompt-time tool availability. */;
  authProfileStore?: AuthProfileStore /** Callback invoked when sessions_yield tool is called. */;
  onYield?: (
    message: string,
  ) => Promise<void> | void /** Optional instrumentation callback for tool preparation stage timing. */;
  recordToolPrepStage?: (
    name: string,
  ) => void /** Lower routine policy-removal audits for diagnostic-only tool probes. */;
  toolPolicyAuditLogLevel?:
    | "info"
    | "debug" /** Live observer called after wrapped tool outcomes are recorded. */;
  onToolOutcome?: ToolOutcomeObserver /** Supplies run-global model-call ordering for parallel tool outcomes. */;
  allocateToolOutcomeOrdinal?: (
    toolCallId?: string,
  ) => number /** Runtime-only resolved skill paths that the read tool may load under workspaceOnly. */;
  skillsSnapshot?: SkillSnapshot /** Original identities for sandbox-materialized skill instruction paths. */;
  skillUsagePaths?: SkillUsagePath[] /** Prepared conversation-scoped facts for callers that already resolved this run context. */;
  conversationCapabilityProfile?: ResolvedConversationCapabilityProfile;
};
/** Build the runtime tool list exposed through the public agent harness SDK. */
declare function createOpenClawCodingTools(options?: OpenClawCodingToolsOptions): AnyAgentTool[];
//#endregion
//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  config?: OpenClawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
  sandboxToolPolicy?: SandboxToolPolicy;
  messageProvider?: string;
  agentAccountId?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
declare function resolveWebSearchToolPolicy(
  params: WebSearchToolPolicyParams,
): WebSearchToolPolicyResolution;
//#endregion
export {
  type AbortAndDrainEmbeddedAgentRunResult as AbortAndDrainAgentHarnessRunResult,
  type AgentApprovalEventData,
  type AgentEventPayload,
  type AgentHarness,
  type AgentHarnessAttemptParams,
  type AgentHarnessAttemptResult,
  type AgentHarnessAuthBindingFingerprintParams,
  type AgentHarnessCompactParams,
  type AgentHarnessCompactResult,
  type AgentHarnessDeliveryDefaults,
  type AgentHarnessResetParams,
  type AgentHarnessResultClassification,
  type AgentHarnessRuntimeArtifactBinding,
  type AgentHarnessSideQuestionParams,
  type AgentHarnessSideQuestionResult,
  type AgentHarnessSupport,
  type AgentHarnessSupportContext,
  AgentHarnessTerminalOutcomeClassification,
  AgentHarnessTerminalOutcomeInput,
  type AgentHarnessUserInputAnswers,
  type AgentHarnessUserInputOption,
  type AgentHarnessUserInputPromptOptions,
  type AgentHarnessUserInputQuestion,
  type AgentMessage,
  type AgentToolResultMiddleware,
  type AgentToolResultMiddlewareContext,
  type AgentToolResultMiddlewareEvent,
  type AgentToolResultMiddlewareHarness,
  type AgentToolResultMiddlewareOptions,
  type AgentToolResultMiddlewareResult,
  type AgentToolResultMiddlewareRuntime,
  type AnyAgentTool,
  type BeforeToolCallFailureDisposition,
  type BeforeToolCallPolicyDiagnosticState,
  CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
  type CodexAppServerExtensionContext,
  type CodexAppServerExtensionFactory,
  type CodexAppServerExtensionRuntime,
  type CodexAppServerToolResultEvent,
  type CodexAppServerToolResultHandlerResult,
  type CodexBundleMcpThreadConfig,
  type CompactEmbeddedAgentSessionParams,
  type CompactEmbeddedAgentSessionParams as CompactEmbeddedPiSessionParams,
  type ContextEngineHostCapability,
  type ContextEngineOperation,
  type ContextEngineProjection,
  type DeferredPluginToolApproval,
  type EmbeddedAgentCompactResult,
  type EmbeddedAgentCompactResult as EmbeddedPiCompactResult,
  type EmbeddedContextFile,
  EmbeddedRunAttemptParams,
  type EmbeddedRunAttemptResult,
  type ExecApprovalDecision,
  type ExecAutoReviewDecision,
  type ExecAutoReviewInput,
  type ExecAutoReviewer,
  FAST_MODE_AUTO_PROGRESS_KIND,
  type FastModeAutoProgressState,
  HEARTBEAT_RESPONSE_TOOL_NAME,
  type ContextEngine as HarnessContextEngine,
  type HeartbeatToolResponse,
  type LlmBoundaryTokenPressure,
  type LoadCodexBundleMcpThreadConfigParams,
  type MessagingToolSend,
  type MessagingToolSourceReplyPayload,
  type NativeHookRelayEvent,
  type NativeHookRelayProcessResponse,
  type NativeHookRelayProvider,
  type NativeHookRelayRegistrationHandle,
  type NodeListNode,
  type NormalizedUsage,
  VERSION as OPENCLAW_VERSION,
  type OpenClawAgentToolResult,
  PREEMPTIVE_OVERFLOW_ERROR_TEXT,
  type PreemptiveCompactionDecision,
  type RuntimeToolInputSchemaJson,
  type RuntimeToolInputSchemaProjection,
  type RuntimeToolSchemaDiagnostic,
  SKILL_WORKSHOP_TOOL_NAME,
  type SandboxContext,
  type SandboxWorkspaceAccess,
  type SessionWriteLockAcquireTimeoutConfig,
  TOOL_PROGRESS_OUTPUT_MAX_CHARS,
  ToolProgressDetailMode,
  type ToolResultFailureKind,
  abortEmbeddedAgentRun as abortAgentHarnessRun,
  abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun,
  acquireSessionWriteLock,
  applyEmbeddedAttemptToolsAllow,
  assembleHarnessContextEngine,
  assertContextEngineHostSupport,
  attachModelProviderRequestTransport,
  awaitAgentEndSideEffects,
  awaitAgentHarnessAgentEndHook,
  bootstrapHarnessContextEngine,
  buildAgentHarnessUserInputAnswers,
  buildAgentHookContextChannelFields,
  buildAgentRuntimePlan,
  buildBootstrapContextForFiles,
  buildEmbeddedAttemptToolRunContext,
  buildHarnessContextEngineRuntimeContext,
  buildHarnessContextEngineRuntimeContextFromUsage,
  buildNativeHookRelayCommand,
  buildSkillWorkshopPromptSection,
  callGatewayTool,
  classifyAgentHarnessTerminalOutcome,
  classifyEmbeddedAgentRunResultForModelFallback,
  classifyEmbeddedAgentRunResultForModelFallback as classifyEmbeddedPiRunResultForModelFallback,
  clearActiveEmbeddedRun,
  compactContextEngineWithSafetyTimeout,
  compactWithSafetyTimeout,
  consumeAdjustedParamsForToolCall,
  consumePreExecutionBlockedToolCall,
  createAgentToolResultMiddlewareRunner,
  createCodexAppServerToolResultExtensionRunner,
  createOpenClawCodingTools,
  deliverAgentHarnessUserInputPrompt,
  detectAndLoadAgentHarnessPromptImages,
  disposeRegisteredAgentHarnesses,
  log as embeddedAgentLog,
  emitAgentEvent,
  emptyAgentHarnessUserInputAnswers,
  estimateRenderedLlmBoundaryTokenPressure,
  extractMessagingToolSend,
  extractMessagingToolSendResult,
  extractToolErrorMessage,
  extractToolResultMediaArtifact,
  filterProviderNormalizableTools,
  filterToolResultMediaUrls,
  finalizeHarnessContextEngineTurn,
  finalizeToolTerminalPresentation,
  fingerprintResolvedAuthProfileCredential,
  formatAgentHarnessUserInputPrompt,
  formatApprovalDisplayPath,
  formatErrorMessage,
  formatFastModeAutoProgressText,
  formatPrePromptPrecheckLog,
  formatToolAggregate,
  formatToolExecutionErrorMessage,
  formatToolProgressOutput,
  getAgentHarnessHookRunner,
  getBeforeToolCallFailureDisposition,
  getBeforeToolCallPolicyDiagnosticState,
  getChannelAgentToolMeta,
  getModelProviderRequestTransport,
  getPluginToolMeta,
  hasBeforeToolCallPolicy,
  hasNativeHookRelayInvocation,
  hasSandboxBindContainerPathAliases,
  hasSandboxBindReadonlyHostShadows,
  inferToolMetaFromArgs,
  inspectRuntimeToolInputSchemas,
  invokeNativeHookRelay,
  isActiveHarnessContextEngine,
  isAgentToolReplaySafe,
  isDeliveredMessageToolOnlySourceReplyResult,
  isDeliveredMessagingToolResult,
  isHostScopedAgentToolActive,
  isMessagingTool,
  isMessagingToolSendAction,
  isReplaySafeToolCall,
  isSubagentSessionKey,
  isToolResultError,
  isToolWrappedWithBeforeToolCallHook,
  listNodes,
  loadCodexBundleMcpThreadConfig,
  logAgentRuntimeToolDiagnostics,
  testing as nativeHookRelayTesting,
  normalizeAgentHarnessUserInputAnswer,
  normalizeAgentRuntimeTools,
  normalizeHeartbeatToolResponse,
  normalizeProviderToolSchemas,
  normalizeUsage,
  onAgentEvent,
  projectRuntimeToolInputSchema,
  queueAgentHarnessMessage,
  registerNativeHookRelay,
  requestDeferredPluginToolApproval,
  resetAgentEventsForTest,
  resolveActiveEmbeddedRunSessionId,
  resolveAgentDir,
  resolveAgentHarnessBeforePromptBuildResult,
  resolveAgentRunAbortLifecycleFields,
  resolveAttemptFsWorkspaceOnly,
  resolveAttemptSpawnWorkspaceDir,
  resolveBootstrapContextForRun,
  resolveBootstrapFilesForRun,
  resolveCompactionTimeoutMs,
  resolveContextEngineOwnerPluginId,
  resolveDefaultAgentDir,
  resolveEmbeddedAgentRuntime,
  resolveEmbeddedAttemptToolConstructionPlan,
  resolveFastModeForElapsed,
  resolveModelAuthMode,
  resolveNativeHookRelayDeferredToolApproval,
  resolveNodeIdFromList,
  resolveOpenClawAgentDir,
  resolveSandboxContext,
  resolveSessionAgentIds,
  resolveSessionWriteLockAcquireTimeoutMs,
  resolveSessionWriteLockOptions,
  resolveToolExecutionErrorKind,
  resolveToolResultFailureKind,
  resolveUserPath,
  resolveWebSearchToolPolicy,
  resolveWritableSandboxBindHostRoots,
  runAgentCleanupStep,
  runAgentEndSideEffects,
  runAgentHarnessAfterCompactionHook,
  runAgentHarnessAfterToolCallHook,
  runAgentHarnessAgentEndHook,
  runAgentHarnessBeforeAgentFinalizeHook,
  runAgentHarnessBeforeCompactionHook,
  runAgentHarnessBeforeMessageWriteHook,
  runAgentHarnessLlmInputHook,
  runAgentHarnessLlmOutputHook,
  runBeforeToolCallHook,
  runHarnessContextEngineMaintenance,
  sanitizeToolResult,
  selectDefaultNodeFromList,
  setActiveEmbeddedRun,
  setBeforeToolCallDiagnosticsEnabled,
  shouldPreemptivelyCompactBeforePrompt,
  supportsModelTools,
  wrapToolWithBeforeToolCallHook,
};
