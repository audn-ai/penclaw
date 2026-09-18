import {
  RuntimeToolInputSchemaJson,
  RuntimeToolInputSchemaProjection,
  projectRuntimeToolInputSchema as projectRuntimeToolInputSchema$1,
} from "@openclaw/ai/internal/openai";
import { TSchema } from "typebox";
import { u as SandboxFsBridge } from "./backend-handle.types-BB1SUqT2.js";
import { t as BundleMcpDiagnostic } from "./bundle-mcp-DABlFCpS.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { r as AnyAgentTool } from "./common-CuQ9SS3Z.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CTCX7Vbc.js";
import {
  $ as PluginHookLlmOutputEvent,
  P as PluginHookContextWindowSource,
  Q as PluginHookLlmInputEvent,
  d as PluginHookAgentEndEvent,
  dn as PluginHookBeforeAgentStartResult,
  f as PluginHookBeforeAgentFinalizeEvent,
  u as PluginHookAgentContext,
} from "./hook-types-BPL4xByC.js";
import { n as ContextEngineHostSupport } from "./host-compat-P3rymViq.js";
import { Hc as NodePluginToolDescriptor } from "./index-F2ydESCy.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import { c as EmbeddedAgentQueueMessageOptions } from "./runs-DpmUlAWl.js";
import { t as SessionWriteLockAcquireTimeoutConfig } from "./session-write-lock-CTGMQVOj.js";
import { t as SubsystemLogger } from "./subsystem-BvPn7HK_.js";
import { h as PluginHookChannelContext } from "./templating-h3OQefFR.js";
import { a as SourceReplyDeliveryMode, c as PromptImageOrderEntry } from "./types-BgrDi5xH.js";
import { n as FailoverReason } from "./types-CF0DHR3y.js";
import { l as ImageContent } from "./types-CqrbBnUB.js";
import {
  Ac as ContextEngineRuntimeContext,
  Bu as BootstrapContextRunKind,
  Gi as CodexAppServerExtensionFactory,
  Lc as ContextEngineSessionTarget,
  Nc as ContextEngineRuntimeSettings,
  Sc as ContextEngine,
  Wc as TranscriptRewriteResult,
  Wi as CodexAppServerExtensionContext,
  _a as OpenClawAgentToolResult,
  co as PreemptiveCompactionRoute,
  da as AgentToolResultMiddlewareContext,
  do as BuildAgentRuntimePlanParams,
  fa as AgentToolResultMiddlewareEvent,
  fo as BeforeToolCallFailureDisposition,
  hd as MessagingToolSend,
  kc as ContextEnginePromptCacheInfo,
  nd as ProviderRuntimeModel,
  oo as EmbeddedRunAttemptParams$1,
  qi as CodexAppServerToolResultEvent,
  rd as ProviderRuntimePluginHandle,
  so as EmbeddedRunAttemptResult,
  ua as AgentToolResultMiddleware,
  uo as AgentRuntimePlan,
  wu as EmbeddedRunTrigger,
  xc as CompactResult,
  xo as requestDeferredPluginToolApproval,
  yc as AssembleResult,
} from "./types-Ga3mNO_F.js";
import { f as AgentToolResult, l as AgentTool, s as AgentMessage } from "./types-JQFrjdua.js";
import { o as ChannelAgentTool } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { Pt as MemoryCitationsMode } from "./types.slack-DOPma3IJ.js";
import { n as NormalizedUsage } from "./usage-DzTfux3q.js";

//#region src/agents/codex-mcp-config.types.d.ts
/** Codex app-server `mcp_servers` config map. */
type CodexMcpServersConfig = Record<string, Record<string, unknown>>;
/** Loaded Codex thread-config patch plus diagnostics and cache metadata. */
type CodexBundleMcpThreadConfig = {
  configPatch?: {
    mcp_servers: CodexMcpServersConfig;
  };
  diagnostics: BundleMcpDiagnostic[];
  evaluated: boolean;
  fingerprint?: string;
};
/** Inputs used to load a Codex bundle-MCP thread config patch. */
type LoadCodexBundleMcpThreadConfigParams = {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  toolsEnabled?: boolean;
  disableTools?: boolean;
  toolsAllow?: string[];
};
//#endregion
//#region src/agents/embedded-agent-message-tool-source-reply.d.ts
/** Return true only when a messaging tool result proves a real visible delivery. */
declare function isDeliveredMessagingToolResult(params: {
  toolName?: string;
  args?: unknown;
  result?: unknown;
  hookResult?: unknown;
  isError?: boolean;
}): boolean;
/**
 * Only implicit-route, non-dry-run, delivered `message.send` calls qualify.
 * Explicit routes and other messaging tools are outbound side effects, not source replies.
 */
declare function isDeliveredMessageToolOnlySourceReplyResult(params: {
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  toolName: string;
  args?: unknown;
  result?: unknown;
  hookResult?: unknown;
  isError?: boolean;
  allowExplicitSourceRoute?: boolean;
}): boolean;
//#endregion
//#region src/agents/harness/user-input-bridge.d.ts
type AgentHarnessUserInputOption = {
  label: string;
  description?: string;
};
type AgentHarnessUserInputQuestion = {
  id: string;
  header: string;
  question: string;
  isOther?: boolean;
  isSecret?: boolean;
  options?: readonly AgentHarnessUserInputOption[] | null;
};
type AgentHarnessUserInputAnswers = {
  answers: Record<
    string,
    {
      answers: string[];
    }
  >;
};
type AgentHarnessUserInputPromptOptions = {
  intro?: string;
  formatText?: (text: string) => string;
  secretWarning?: string;
  otherLabel?: string;
};
type PromptDeliveryParams = Pick<EmbeddedRunAttemptParams$1, "onBlockReply" | "onPartialReply">;
declare function emptyAgentHarnessUserInputAnswers(): AgentHarnessUserInputAnswers;
declare function formatAgentHarnessUserInputPrompt(
  questions: readonly AgentHarnessUserInputQuestion[],
  options?: AgentHarnessUserInputPromptOptions,
): string;
declare function deliverAgentHarnessUserInputPrompt(
  params: PromptDeliveryParams,
  questions: readonly AgentHarnessUserInputQuestion[],
  options?: AgentHarnessUserInputPromptOptions,
): Promise<void>;
declare function buildAgentHarnessUserInputAnswers(
  questions: readonly AgentHarnessUserInputQuestion[],
  inputText: string,
): AgentHarnessUserInputAnswers;
declare function normalizeAgentHarnessUserInputAnswer(
  answer: string,
  question: AgentHarnessUserInputQuestion,
): string | undefined;
//#endregion
//#region src/agents/harness/native-hook-relay.d.ts
type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };
declare const NATIVE_HOOK_RELAY_EVENTS: readonly [
  "pre_tool_use",
  "post_tool_use",
  "permission_request",
  "before_agent_finalize",
];
declare const NATIVE_HOOK_RELAY_PROVIDERS: readonly ["codex"];
type NativeHookRelayEvent = (typeof NATIVE_HOOK_RELAY_EVENTS)[number];
type NativeHookRelayProvider = (typeof NATIVE_HOOK_RELAY_PROVIDERS)[number];
type NativeHookRelayInvocation = {
  provider: NativeHookRelayProvider;
  relayId: string;
  event: NativeHookRelayEvent;
  nativeEventName?: string;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  runId: string;
  cwd?: string;
  model?: string;
  turnId?: string;
  transcriptPath?: string;
  permissionMode?: string;
  stopHookActive?: boolean;
  lastAssistantMessage?: string;
  toolName?: string;
  toolUseId?: string;
  rawPayload: JsonValue;
  receivedAt: string;
};
type NativeHookRelayProcessResponse = {
  stdout: string;
  stderr: string;
  exitCode: number;
  failureDisposition?: Exclude<BeforeToolCallFailureDisposition, "blocked">;
};
type NativeHookRelayRegistration = {
  relayId: string;
  provider: NativeHookRelayProvider;
  generationMismatchGraceExpiresAtMs?: number;
  generationMismatchGraceAcceptedGeneration?: string;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  allowedEvents: readonly NativeHookRelayEvent[];
  expiresAtMs: number;
  signal?: AbortSignal;
  onPreToolUseFailure?: (failure: {
    toolName: string;
    toolCallId: string;
    disposition: Exclude<BeforeToolCallFailureDisposition, "blocked">;
    durationMs: number;
  }) => void | Promise<void>;
};
type NativeHookRelayRegistrationHandle = NativeHookRelayRegistration & {
  generation?: string;
  shouldRelayEvent: (event: NativeHookRelayEvent) => boolean;
  commandForEvent: (
    event: NativeHookRelayEvent,
    options?: NativeHookRelayCommandForEventOptions,
  ) => string;
  renew: (ttlMs?: number) => void;
  unregister: () => void;
};
type RegisterNativeHookRelayParams = {
  provider: NativeHookRelayProvider;
  relayId?: string;
  generation?: string;
  generationMismatchGraceMs?: number;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  allowedEvents?: readonly NativeHookRelayEvent[];
  ttlMs?: number;
  command?: NativeHookRelayCommandOptions;
  signal?: AbortSignal;
  onPreToolUseFailure?: NativeHookRelayRegistration["onPreToolUseFailure"];
};
type NativeHookRelayCommandOptions = {
  executable?: string;
  nice?: number | false;
  nodeExecutable?: string;
  timeoutMs?: number;
};
type NativeHookRelayCommandForEventOptions = {
  timeoutMs?: number;
};
type InvokeNativeHookRelayParams = {
  provider: unknown;
  relayId: unknown;
  generation?: unknown;
  event: unknown;
  rawPayload: unknown;
  requireGeneration?: boolean;
};
type NativeHookRelayPermissionDecision = "allow" | "deny";
type NativeHookRelayPermissionApprovalResult =
  | NativeHookRelayPermissionDecision
  | "allow-always"
  | "defer";
type ActiveNativeHookRelayRegistrationHandle = NativeHookRelayRegistrationHandle & {
  generation: string;
};
type NativeHookRelayPermissionApprovalRequest = {
  provider: NativeHookRelayProvider;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  runId: string;
  toolName: string;
  toolCallId?: string;
  cwd?: string;
  model?: string;
  toolInput: Record<string, JsonValue>;
  signal?: AbortSignal;
};
type NativeHookRelayPermissionApprovalRequester = (
  request: NativeHookRelayPermissionApprovalRequest,
) => Promise<NativeHookRelayPermissionApprovalResult>;
type NativeHookRelayDeferredToolApprovalRequester = typeof requestDeferredPluginToolApproval;
type NativeHookRelayDeferredApprovalOutcome =
  | {
      handled: true;
      outcome: "approved-once";
    }
  | {
      handled: true;
      outcome: "denied";
      reason: string;
      failureDisposition?: Exclude<BeforeToolCallFailureDisposition, "blocked">;
    };
declare function registerNativeHookRelay(
  params: RegisterNativeHookRelayParams,
): ActiveNativeHookRelayRegistrationHandle;
declare function buildNativeHookRelayCommand(params: {
  provider: NativeHookRelayProvider;
  relayId: string;
  generation?: string;
  event: NativeHookRelayEvent;
  preToolUseUnavailable?: "noop";
  timeoutMs?: number;
  executable?: string;
  nice?: number | false;
  nodeExecutable?: string;
}): string;
declare function invokeNativeHookRelay(
  params: InvokeNativeHookRelayParams,
): Promise<NativeHookRelayProcessResponse>;
declare function hasNativeHookRelayInvocation(params: {
  relayId: string;
  event: NativeHookRelayEvent;
  toolUseId?: string;
}): boolean;
declare function resolveNativeHookRelayDeferredToolApproval(params: {
  relayId: string;
  toolUseId?: string;
  signal?: AbortSignal;
}): Promise<NativeHookRelayDeferredApprovalOutcome | undefined>;
declare const testing: {
  readonly clearNativeHookRelaysForTests: () => void;
  readonly getNativeHookRelayInvocationsForTests: () => NativeHookRelayInvocation[];
  readonly getNativeHookRelayRegistrationForTests: (
    relayId: string,
  ) => NativeHookRelayRegistration | undefined;
  readonly getNativeHookRelayBridgeDirForTests: () => string;
  readonly getNativeHookRelayBridgeRegistryPathForTests: (relayId: string) => string;
  readonly getNativeHookRelayBridgeRecordForTests: (
    relayId: string,
  ) => Record<string, unknown> | undefined;
  readonly isNativeHookRelayBridgeLookupRetryableForTests: (
    error: unknown,
    elapsedMs?: number,
  ) => boolean;
  readonly formatPermissionApprovalDescriptionForTests: (
    request: NativeHookRelayPermissionApprovalRequest,
  ) => string;
  readonly permissionRequestContentFingerprintForTests: (
    request: NativeHookRelayPermissionApprovalRequest,
  ) => string;
  readonly permissionRequestToolInputKeyFingerprintForTests: (
    toolInput: Record<string, unknown>,
  ) => string;
  readonly setNativeHookRelayPermissionApprovalRequesterForTests: (
    requester: NativeHookRelayPermissionApprovalRequester,
  ) => void;
  readonly setNativeHookRelayDeferredToolApprovalRequesterForTests: (
    requester: NativeHookRelayDeferredToolApprovalRequester,
  ) => void;
};
//#endregion
//#region src/plugins/hook-agent-context.d.ts
/** Builds channel/provider fields for plugin agent hook context. */
declare function buildAgentHookContextChannelFields(params: {
  sessionKey?: string | null;
  messageChannel?: string | null;
  messageProvider?: string | null;
  currentChannelId?: string | null;
  messageTo?: string | null;
  senderId?: string | null;
}): Pick<
  PluginHookAgentContext,
  "channel" | "channelId" | "chatId" | "messageProvider" | "senderId"
>;
//#endregion
//#region src/agents/run-cleanup-timeout.d.ts
type AgentCleanupLogger = {
  warn: (message: string) => void;
};
/** Run one cleanup step with timeout logging and late-rejection handling. */
declare function runAgentCleanupStep(params: {
  runId: string;
  sessionId: string;
  step: string;
  cleanup: () => Promise<void>;
  getTimeoutDetails?: () => string | undefined;
  log: AgentCleanupLogger;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
}): Promise<void>;
//#endregion
//#region src/agents/run-termination.d.ts
/**
 * Shared agent run termination constants.
 *
 * Runtime and stream consumers use these stable literals to recognize user or
 * controller aborts without matching free-form error text.
 */
/** Stop reason emitted when an agent run is aborted. */
declare const AGENT_RUN_ABORTED_STOP_REASON: "aborted";
/** Error text used for aborted agent runs. */
declare const AGENT_RUN_RESTART_ABORT_STOP_REASON: "restart";
declare function resolveAgentRunAbortLifecycleFields(signal: AbortSignal | undefined): {
  aborted?: true;
  stopReason?:
    | typeof AGENT_RUN_ABORTED_STOP_REASON
    | typeof AGENT_RUN_RESTART_ABORT_STOP_REASON
    | "timeout";
};
//#endregion
//#region src/agents/agent-tools.ring-zero-context.d.ts
/**
 * Read a host-owned tool fact for the current run. This does not activate or
 * grant a tool; only the host can bind executable authority to the run scope.
 */
declare function isHostScopedAgentToolActive(toolName: string): boolean;
//#endregion
//#region src/agents/embedded-agent-runner/logger.d.ts
/**
 * Shared logger for embedded-agent runner internals.
 */
declare const log: SubsystemLogger;
//#endregion
//#region src/agents/runtime-plan/build.d.ts
/** Build the complete runtime plan for an embedded agent attempt. */
declare function buildAgentRuntimePlan(params: BuildAgentRuntimePlanParams): AgentRuntimePlan;
//#endregion
//#region src/agents/model-fallback.d.ts
type ModelFallbackResultClassification =
  | {
      message: string;
      reason?: FailoverReason;
      status?: number;
      code?: string;
      rawError?: string;
      preserveResultOnExhaustion?: boolean;
      preserveResultPriority?: number;
    }
  | {
      error: unknown;
    }
  | null
  | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/result-fallback-classifier.d.ts
/** Returns a fallback classification when an embedded run failed without user-visible output. */
declare function classifyEmbeddedAgentRunResultForModelFallback(params: {
  provider: string;
  model: string;
  result: unknown;
  hasDirectlySentBlockReply?: boolean;
  hasBlockReplyPipelineOutput?: boolean;
}): ModelFallbackResultClassification;
//#endregion
//#region src/agents/tools/gateway.d.ts
/** Optional gateway connection overrides accepted by agent tools. */
type GatewayCallOptions = {
  gatewayUrl?: string;
  gatewayToken?: string;
  timeoutMs?: number;
};
/**
 * Calls a gateway method as the agent-tool backend client with least-privilege scopes.
 */
declare function callGatewayTool<T = Record<string, unknown>>(
  method: string,
  opts: GatewayCallOptions,
  params?: unknown,
  extra?: {
    expectFinal?: boolean;
    scopes?: OperatorScope[];
    requireAgentRuntimeIdentity?: boolean;
    signal?: AbortSignal;
  },
): Promise<T>;
//#endregion
//#region src/shared/node-list-types.d.ts
/** Node record returned by gateway node-list endpoints. */
type NodeListNode = {
  nodeId: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  clientId?: string;
  clientMode?: string;
  remoteIp?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  pathEnv?: string;
  caps?: string[];
  commands?: string[];
  nodePluginTools?: NodePluginToolDescriptor[];
  permissions?: Record<string, boolean>;
  approvalState?: "approved" | "pending-approval" | "pending-reapproval" | "unapproved";
  pendingRequestId?: string;
  pendingDeclaredCaps?: string[];
  pendingDeclaredCommands?: string[];
  pendingDeclaredPermissions?: Record<string, boolean>;
  paired?: boolean;
  connected?: boolean;
  connectedAtMs?: number;
  lastActiveAtMs?: number;
  presenceUpdatedAtMs?: number;
  active?: boolean;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
  approvedAtMs?: number;
};
//#endregion
//#region src/agents/tools/nodes-utils.d.ts
type DefaultNodeFallback = "none" | "first";
type DefaultNodeSelectionOptions = {
  capability?: string;
  fallback?: DefaultNodeFallback;
  preferLocalMac?: boolean;
};
/** Selects the implicit node target when a tool call omits an explicit node query. */
declare function selectDefaultNodeFromList(
  nodes: NodeListNode[],
  options?: DefaultNodeSelectionOptions,
): NodeListNode | null;
/** Lists Gateway nodes, falling back to paired-node records for older Gateway versions. */
declare function listNodes(opts: GatewayCallOptions, signal?: AbortSignal): Promise<NodeListNode[]>;
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
declare function resolveNodeIdFromList(
  nodes: NodeListNode[],
  query?: string,
  allowDefault?: boolean,
  options?: {
    allowCompactDisplayName?: boolean;
  },
): string;
//#endregion
//#region src/auto-reply/tool-meta.d.ts
type ToolAggregateOptions = {
  markdown?: boolean;
};
/** Formats one grouped tool-progress label from a tool name and metadata entries. */
declare function formatToolAggregate(
  toolName?: string,
  metas?: string[],
  options?: ToolAggregateOptions,
): string;
//#endregion
//#region src/agents/embedded-agent-messaging.d.ts
/** Return true for core or channel-plugin messaging tool names. */
declare function isMessagingTool(toolName: string): boolean;
/** Return true when the specific tool invocation is an outbound send. */
declare function isMessagingToolSendAction(
  toolName: string,
  args: Record<string, unknown>,
): boolean;
//#endregion
//#region src/agents/tool-result-error.d.ts
declare function isToolResultError(result: unknown): boolean;
type ToolResultFailureKind = "blocked" | "cancelled" | "failed" | "timed_out";
/** Classify a thrown tool error without inferring cancellation from message text. */
declare function resolveToolExecutionErrorKind(error: unknown): "failed" | "timed_out";
/** Format a redacted tool error without allowing hostile getters to escape observability. */
declare function formatToolExecutionErrorMessage(error: unknown, fallback: string): string;
/** Classify a resolved structured tool result through the shared terminal contract. */
declare function resolveToolResultFailureKind(result: unknown): ToolResultFailureKind | undefined;
//#endregion
//#region src/agents/embedded-agent-subscribe.tools.d.ts
declare function sanitizeToolResult(result: unknown): unknown;
declare function filterToolResultMediaUrls(
  toolName: string | undefined,
  mediaUrls: string[],
  result?: unknown,
  trustedLocalMediaToolNames?: ReadonlySet<string>,
): string[];
/**
 * Extract media file paths from a tool result.
 *
 * Strategy (first match wins):
 * 1. Read structured `details.media` attachments from tool details.
 * 2. Fall back to `details.path` when image content exists (legacy imageResult).
 *
 * Returns an empty array when no media is found (e.g. embedded `read` tool
 * returns base64 image data but no file path; those need a different delivery
 * path like saving to a temp file).
 */
type ToolResultMediaArtifact = {
  mediaUrls: string[];
  audioAsVoice?: boolean;
  trustedLocalMedia?: boolean;
};
declare function extractToolResultMediaArtifact(
  result: unknown,
): ToolResultMediaArtifact | undefined;
declare function extractToolErrorMessage(result: unknown): string | undefined;
declare function extractMessagingToolSend(
  toolName: string,
  args: Record<string, unknown>,
  options?: {
    config?: OpenClawConfig;
    currentChannelId?: string;
    currentMessagingTarget?: string;
    currentThreadId?: string;
    currentMessageId?: string | number;
    replyToMode?: "off" | "first" | "all" | "batched";
    hasRepliedRef?: {
      value: boolean;
    };
  },
): MessagingToolSend | undefined;
/** Reconciles pending send evidence with the provider's successful action result. */
declare function extractMessagingToolSendResult(
  pending: MessagingToolSend,
  result: unknown,
): MessagingToolSend;
//#endregion
//#region src/agents/model-tool-support.d.ts
/**
 * Model capability helper for tool-use support.
 *
 * Provider catalogs can opt a model out via `compat.supportsTools === false`;
 * absent metadata remains permissive for older catalog entries.
 */
/** Returns whether a catalog model should be offered tool calls. */
declare function supportsModelTools(model: { compat?: unknown }): boolean;
//#endregion
//#region src/agents/tool-replay-safety.d.ts
/**
 * Tool names are not ownership boundaries. Callers must reject plugin/channel
 * instances before using this audited core-tool allowlist.
 */
declare function isAgentToolReplaySafe(
  tool: {
    name?: string;
  },
  options?: {
    declaredReplaySafe?: (tool: { name?: string }) => boolean | undefined;
  },
): boolean;
//#endregion
//#region src/agents/channel-tool-metadata.d.ts
type ChannelAgentToolMeta = {
  channelId: string;
};
/** Read channel metadata attached to a channel-owned agent tool. */
declare function getChannelAgentToolMeta(tool: ChannelAgentTool): ChannelAgentToolMeta | undefined;
//#endregion
//#region src/agents/skill-workshop-prompt.d.ts
/**
 * System-prompt contribution for routing durable skill edits through the
 * Skill Workshop tool instead of direct filesystem writes.
 */
declare const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop routing rules. */
declare function buildSkillWorkshopPromptSection(): string[];
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.prompt-helpers.d.ts
declare function resolveAttemptFsWorkspaceOnly(params: {
  config?: OpenClawConfig;
  sessionAgentId: string;
}): boolean;
type AfterTurnRuntimeContextAttempt = Pick<
  EmbeddedRunAttemptParams$1,
  | "sessionTarget"
  | "sessionKey"
  | "sandboxSessionKey"
  | "messageChannel"
  | "messageProvider"
  | "agentAccountId"
  | "currentChannelId"
  | "currentThreadTs"
  | "currentMessageId"
  | "config"
  | "skillsSnapshot"
  | "senderId"
  | "provider"
  | "modelId"
  | "agentHarnessId"
  | "modelSelectionLocked"
  | "thinkLevel"
  | "reasoningLevel"
  | "bashElevated"
  | "extraSystemPrompt"
  | "ownerNumbers"
  | "authProfileId"
  | "authProfileIdSource"
  | "runtimePlan"
> & {
  sessionId?: EmbeddedRunAttemptParams$1["sessionId"];
};
/** Build runtime context passed into context-engine afterTurn hooks. */
declare function buildAfterTurnRuntimeContext(params: {
  attempt: AfterTurnRuntimeContextAttempt;
  workspaceDir: string;
  cwd?: string;
  agentDir: string;
  activeAgentId?: string;
  contextEnginePluginId?: string;
  tokenBudget?: number;
  currentTokenCount?: number;
  promptCache?: ContextEnginePromptCacheInfo;
}): ContextEngineRuntimeContext;
declare function buildAfterTurnRuntimeContextFromUsage(
  params: Omit<Parameters<typeof buildAfterTurnRuntimeContext>[0], "currentTokenCount"> & {
    lastCallUsage?: NormalizedUsage;
  },
): ContextEngineRuntimeContext;
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.thread-helpers.d.ts
/**
 * Returns the workspace path that must be mounted for sandboxed spawn attempts.
 * Read-only sandbox modes need the resolved workspace explicitly; full rw
 * access uses the normal workspace wiring.
 */
declare function resolveAttemptSpawnWorkspaceDir(params: {
  sandbox?: {
    enabled?: boolean;
    workspaceAccess?: string;
  } | null;
  resolvedWorkspace: string;
}): string | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.tool-run-context.d.ts
/**
 * Builds the stable tool-run context forwarded into an embedded-attempt execution.
 */
declare function buildEmbeddedAttemptToolRunContext(params: {
  trigger?: EmbeddedRunTrigger;
  jobId?: string;
  memoryFlushWritePath?: string;
  toolsAllow?: string[];
  trace?: DiagnosticTraceContext;
}): {
  trigger?: EmbeddedRunTrigger;
  jobId?: string;
  memoryFlushWritePath?: string;
  runtimeToolAllowlist?: string[];
  trace?: DiagnosticTraceContext;
};
//#endregion
//#region src/agents/core-tool-factory-descriptors.d.ts
type OpenClawCodingToolConstructionPlan = {
  includeBaseCodingTools: boolean;
  includeShellTools: boolean;
  includeChannelTools: boolean;
  includeOpenClawTools: boolean;
  includePluginTools: boolean;
};
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.d.ts
/**
 * Applies a runtime allowlist to a concrete tool list after expanding tool and
 * plugin groups. Undefined allowlists keep all tools; an explicit empty list
 * intentionally disables all runtime tools.
 */
declare function applyEmbeddedAttemptToolsAllow<
  T extends {
    name: string;
  },
>(
  tools: T[],
  toolsAllow?: string[],
  options?: {
    toolMeta?: (tool: T) =>
      | {
          pluginId: string;
        }
      | undefined;
  },
): T[];
/**
 * Decides which tool families need to be constructed for an embedded attempt.
 * This keeps allowlisted plugin/channel tools available without forcing every
 * local core tool factory to run for narrow plugin-only configurations.
 */
declare function resolveEmbeddedAttemptToolConstructionPlan(params: {
  disableTools?: boolean;
  isRawModelRun?: boolean;
  toolsEnabled?: boolean;
  toolsAllow?: string[];
  forceMessageTool?: boolean;
}): {
  constructTools: boolean;
  includeCoreTools: boolean;
  runtimeToolAllowlist?: string[];
  codingToolConstructionPlan: OpenClawCodingToolConstructionPlan;
};
//#endregion
//#region src/agents/harness/registry.d.ts
/** Calls each registered harness dispose hook during registry shutdown or reload. */
declare function disposeRegisteredAgentHarnesses(): Promise<void>;
//#endregion
//#region src/agents/tool-schema-projection.d.ts
/** Diagnostic for one incompatible runtime tool schema. */
type RuntimeToolSchemaDiagnostic = {
  readonly toolName: string;
  readonly toolIndex: number;
  readonly violations: readonly string[];
};
/** Runtime tool list split into compatible tools and schema diagnostics. */
type RuntimeToolSchemaInspection<TTool extends Pick<AnyAgentTool, "name" | "parameters">> = {
  readonly tools: readonly TTool[];
  readonly diagnostics: readonly RuntimeToolSchemaDiagnostic[];
};
/** Inspects runtime tool schemas and returns diagnostics without filtering tools. */
declare function inspectRuntimeToolInputSchemas(
  tools: readonly Pick<AnyAgentTool, "name" | "parameters">[],
): RuntimeToolSchemaDiagnostic[];
/** Filters tools to those that providers can normalize before dispatch. */
declare function filterProviderNormalizableTools<
  TTool extends Pick<AnyAgentTool, "name" | "parameters">,
>(tools: readonly TTool[]): RuntimeToolSchemaInspection<TTool>;
//#endregion
//#region src/agents/runtime-plan/tools.d.ts
type AgentRuntimeToolPolicyParams<TSchemaType extends TSchema = TSchema, TResult = unknown> = {
  runtimePlan?: AgentRuntimePlan;
  tools: AgentTool<TSchemaType, TResult>[];
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowProviderRuntimePluginLoad?: boolean;
  /**
   * Invoked on every normalization, including with an empty list, so
   * consumers can observe the all-clear and retire stale quarantine state.
   */
  onPreNormalizationSchemaDiagnostics?: (
    diagnostics: readonly RuntimeToolSchemaDiagnostic[],
    tools: readonly AgentTool<TSchemaType, TResult>[],
  ) => void;
};
/** Normalizes tool schemas through a runtime plan or provider fallback policy. */
declare function normalizeAgentRuntimeTools<
  TSchemaType extends TSchema = TSchema,
  TResult = unknown,
>(params: AgentRuntimeToolPolicyParams<TSchemaType, TResult>): AgentTool<TSchemaType, TResult>[];
/** Emits runtime-plan or provider fallback diagnostics for normalized tools. */
declare function logAgentRuntimeToolDiagnostics(params: AgentRuntimeToolPolicyParams): void;
//#endregion
//#region src/agents/embedded-agent-runner/tool-schema-runtime.d.ts
type ProviderToolSchemaParams<TSchemaType extends TSchema = TSchema, TResult = unknown> = {
  tools: AgentTool<TSchemaType, TResult>[];
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowRuntimePluginLoad?: boolean;
};
/**
 * Runs provider-owned tool-schema normalization without encoding provider
 * families in the embedded runner.
 */
declare function normalizeProviderToolSchemas<
  TSchemaType extends TSchema = TSchema,
  TResult = unknown,
>(params: ProviderToolSchemaParams<TSchemaType, TResult>): AgentTool<TSchemaType, TResult>[];
//#endregion
//#region src/agents/sandbox/fs-paths.d.ts
declare function resolveWritableSandboxBindHostRoots(
  binds: readonly string[] | undefined,
): string[];
declare function hasSandboxBindContainerPathAliases(binds: readonly string[] | undefined): boolean;
declare function hasSandboxBindReadonlyHostShadows(binds: readonly string[] | undefined): boolean;
//#endregion
//#region src/agents/harness/hook-context.d.ts
/**
 * Input facts used to build the agent portion of plugin hook events.
 *
 * Only stable run/session/model facts are forwarded to plugin hooks; config remains a local
 * construction input so hooks do not accidentally depend on mutable raw configuration.
 */
type AgentHarnessHookContext = {
  runId?: string;
  trace?: DiagnosticTraceContext;
  jobId?: string;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  modelProviderId?: string;
  modelId?: string;
  messageProvider?: string;
  trigger?: string;
  channelId?: string;
  contextTokenBudget?: number;
  contextWindowSource?: PluginHookContextWindowSource;
  contextWindowReferenceTokens?: number;
  config?: OpenClawConfig;
  senderId?: string;
  chatId?: string;
  channel?: string;
  channelContext?: PluginHookChannelContext;
};
//#endregion
//#region src/agents/harness/prompt-compaction-hook-helpers.d.ts
/** Prompt/developer-instruction pair after harness prompt-build hooks run. */
type AgentHarnessPromptBuildResult = {
  prompt: string;
  developerInstructions: string /** Span within prompt containing the original prompt input. */;
  promptInputRange?: {
    start: number;
    end: number;
  };
};
/** Runs before-prompt hooks and returns the adjusted prompt fields. */
declare function resolveAgentHarnessBeforePromptBuildResult(params: {
  prompt: string;
  developerInstructions: string;
  messages: unknown[];
  ctx: AgentHarnessHookContext;
  beforeAgentStartResult?: PluginHookBeforeAgentStartResult;
  bootstrapContextRunKind?: BootstrapContextRunKind;
}): Promise<AgentHarnessPromptBuildResult>;
/** Runs best-effort before-compaction hooks for a harness session. */
declare function runAgentHarnessBeforeCompactionHook(params: {
  sessionFile: string;
  messages?: AgentMessage[];
  ctx: AgentHarnessHookContext;
}): Promise<void>;
/** Runs best-effort after-compaction hooks for a harness session. */
declare function runAgentHarnessAfterCompactionHook(params: {
  sessionFile: string;
  messages?: AgentMessage[];
  ctx: AgentHarnessHookContext;
  compactedCount: number;
}): Promise<void>;
//#endregion
//#region src/agents/harness/codex-app-server-extensions.d.ts
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
declare function createCodexAppServerToolResultExtensionRunner(
  ctx: CodexAppServerExtensionContext,
  factories?: CodexAppServerExtensionFactory[],
): {
  applyToolResultExtensions(
    event: CodexAppServerToolResultEvent,
  ): Promise<AgentToolResult<unknown>>;
};
//#endregion
//#region src/agents/harness/tool-result-middleware.d.ts
declare function createAgentToolResultMiddlewareRunner(
  ctx: AgentToolResultMiddlewareContext,
  handlers?: AgentToolResultMiddleware[],
): {
  applyToolResultMiddleware(
    event: AgentToolResultMiddlewareEvent,
  ): Promise<OpenClawAgentToolResult>;
};
//#endregion
//#region src/agents/harness/context-engine-lifecycle.d.ts
type HarnessContextEngine = ContextEngine;
/**
 * Run optional bootstrap + bootstrap maintenance for a harness-owned context engine.
 */
declare function bootstrapHarnessContextEngine(params: {
  hadSessionFile: boolean;
  contextEngine?: HarnessContextEngine;
  sessionId: string;
  sessionKey?: string;
  sessionTarget?: ContextEngineSessionTarget;
  sessionFile: string;
  sessionManager?: unknown;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  runMaintenance?: typeof runHarnessContextEngineMaintenance;
  config?: SessionWriteLockAcquireTimeoutConfig;
  warn: (message: string) => void;
}): Promise<void>;
/**
 * Assemble model context through the active harness-owned context engine.
 */
declare function assembleHarnessContextEngine(params: {
  contextEngine?: HarnessContextEngine;
  sessionId: string;
  sessionKey?: string;
  messages: AgentMessage[];
  tokenBudget?: number;
  availableTools?: Set<string>;
  citationsMode?: MemoryCitationsMode;
  modelId: string;
  prompt?: string;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelFamily?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
}): Promise<AssembleResult | undefined>;
/**
 * Finalize a completed harness turn via afterTurn or ingest fallbacks.
 */
declare function finalizeHarnessContextEngineTurn(params: {
  contextEngine?: HarnessContextEngine;
  promptError: boolean;
  aborted: boolean;
  yieldAborted: boolean;
  sessionIdUsed: string;
  sessionKey?: string;
  sessionTarget?: ContextEngineSessionTarget;
  sessionFile: string;
  messagesSnapshot: AgentMessage[];
  prePromptMessageCount: number;
  tokenBudget?: number;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  runMaintenance?: typeof runHarnessContextEngineMaintenance;
  sessionManager?: unknown;
  config?: SessionWriteLockAcquireTimeoutConfig;
  warn: (message: string) => void /** True when this turn belongs to a heartbeat run. */;
  isHeartbeat?: boolean;
}): Promise<{
  postTurnFinalizationSucceeded: boolean;
}>;
/**
 * Build runtime context passed into harness context-engine hooks.
 */
declare function buildHarnessContextEngineRuntimeContext(
  params: Parameters<typeof buildAfterTurnRuntimeContext>[0],
): ContextEngineRuntimeContext;
/**
 * Build runtime context passed into harness context-engine hooks from usage data.
 */
declare function buildHarnessContextEngineRuntimeContextFromUsage(
  params: Parameters<typeof buildAfterTurnRuntimeContextFromUsage>[0],
): ContextEngineRuntimeContext;
/**
 * Run optional transcript maintenance for a harness-owned context engine.
 */
declare function runHarnessContextEngineMaintenance(params: {
  contextEngine?: HarnessContextEngine;
  sessionId: string;
  sessionKey?: string;
  sessionTarget?: ContextEngineSessionTarget;
  sessionFile: string;
  reason: "bootstrap" | "compaction" | "turn";
  sessionManager?: unknown;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  tokenBudget?: number | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  executionMode?: "foreground" | "background";
  onDeferredMaintenance?: (promise: Promise<void>) => void;
  config?: SessionWriteLockAcquireTimeoutConfig;
}): Promise<TranscriptRewriteResult | undefined>;
/**
 * Return true when a non-legacy context engine should affect plugin harness behavior.
 */
declare function isActiveHarnessContextEngine(
  contextEngine: ContextEngine | undefined,
): contextEngine is ContextEngine;
//#endregion
//#region src/agents/embedded-agent-runner/compaction-safety-timeout.d.ts
declare function resolveCompactionTimeoutMs(cfg?: OpenClawConfig): number;
declare function compactWithSafetyTimeout<T>(
  compact: (abortSignal?: AbortSignal) => Promise<T>,
  timeoutMs?: number,
  opts?: {
    abortSignal?: AbortSignal;
    onCancel?: () => void;
  },
): Promise<T>;
/** Parameters for a single {@link ContextEngine.compact} invocation. */
type ContextEngineCompactParams = Parameters<ContextEngine["compact"]>[0];
/**
 * Invoke a plugin-owned {@link ContextEngine.compact} bounded by the same
 * finite safety timeout that protects native runtime compaction.
 *
 * Plugin context engines that advertise `ownsCompaction` previously had their
 * `compact()` awaited with no timeout, no watchdog, and no abort signal — a
 * slow or hung plugin compaction would hang the agent turn indefinitely. This
 * wrapper closes that gap:
 *  - the call is bounded by `timeoutMs` (host-resolved, default
 *    {@link EMBEDDED_COMPACTION_TIMEOUT_MS}); on timeout it rejects with a
 *    "Compaction timed out" error so the caller's existing failure handling
 *    runs instead of hanging;
 *  - the timeout signal and caller `abortSignal` are both raced against the
 *    call (so a non-cooperating engine is still bounded) and threaded into the
 *    `compact()` params (so cooperating engines can cancel their own in-flight
 *    work).
 *
 * Callers keep their existing try/catch — a timeout or abort surfaces as a
 * thrown error, never a silent hang.
 */
declare function compactContextEngineWithSafetyTimeout(
  contextEngine: Pick<ContextEngine, "compact">,
  params: ContextEngineCompactParams,
  timeoutMs?: number,
  abortSignal?: AbortSignal,
): Promise<CompactResult>;
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.d.ts
declare const PREEMPTIVE_OVERFLOW_ERROR_TEXT =
  "Context overflow: prompt too large for the model (precheck).";
/** Pre-prompt routing decision plus the budget facts used to explain it in logs and session state. */
type PreemptiveCompactionDecision = {
  route: PreemptiveCompactionRoute;
  shouldCompact: boolean;
  estimatedPromptTokens: number;
  pressureSource?: string;
  promptBudgetBeforeReserve: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  effectiveReserveTokens: number;
};
/** Token pressure reported by the rendered provider-boundary prompt when available. */
type LlmBoundaryTokenPressure = {
  estimatedPromptTokens: number;
  source: string;
  renderedChars?: number;
};
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
declare function estimateRenderedLlmBoundaryTokenPressure(params: {
  systemPrompt?: string;
  prompt: string;
}): number;
/**
 * Decides whether a run should compact before submitting the prompt, and
 * whether reducible tool results can avoid or follow compaction. Rendered LLM
 * boundary pressure wins over local transcript estimates when supplied.
 */
declare function shouldPreemptivelyCompactBeforePrompt(params: {
  messages: AgentMessage[];
  unwindowedMessages?: AgentMessage[];
  systemPrompt?: string;
  prompt: string;
  contextTokenBudget: number;
  reserveTokens: number;
  toolResultMaxChars?: number;
  llmBoundaryTokenPressure?: LlmBoundaryTokenPressure;
}): PreemptiveCompactionDecision;
/** Formats the compact operator log line for one pre-prompt budget check. */
declare function formatPrePromptPrecheckLog(params: {
  result: PreemptiveCompactionDecision;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  modelId: string;
  messageCount: number;
  unwindowedMessageCount?: number;
  contextTokenBudget: number;
  reserveTokens: number;
  sessionFile?: string;
}): string;
//#endregion
//#region src/agents/harness/hook-helpers.d.ts
/** Runs best-effort after-tool-call hooks for a completed tool invocation. */
declare function runAgentHarnessAfterToolCallHook(params: {
  toolName: string;
  toolCallId: string;
  runId?: string;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  channelId?: string;
  startArgs: Record<string, unknown>;
  result?: unknown;
  error?: string;
  startedAt?: number;
}): Promise<void>;
/** Runs before-message-write hooks and returns the possibly rewritten message. */
declare function runAgentHarnessBeforeMessageWriteHook(params: {
  message: AgentMessage;
  agentId?: string;
  sessionKey?: string;
}): AgentMessage | null;
//#endregion
//#region src/agents/harness/lifecycle-hook-helpers.d.ts
type AgentHarnessHookRunner = ReturnType<typeof getGlobalHookRunner>;
/** Returns the current global hook runner for harness lifecycle hooks. */
declare function getAgentHarnessHookRunner(): AgentHarnessHookRunner;
/** Dispatches best-effort LLM input hooks for a harness attempt. */
declare function runAgentHarnessLlmInputHook(params: {
  event: PluginHookLlmInputEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): void;
/** Dispatches best-effort LLM output hooks for a harness attempt. */
declare function runAgentHarnessLlmOutputHook(params: {
  event: PluginHookLlmOutputEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): void;
/** Starts agent_end hooks with unref timeout behavior. */
declare function runAgentHarnessAgentEndHook(params: {
  event: PluginHookAgentEndEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): void;
/** Runs agent_end hooks and waits for completion. */
declare function awaitAgentHarnessAgentEndHook(params: {
  event: PluginHookAgentEndEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): Promise<void>;
/** Normalized before-finalize hook decision consumed by harness loops. */
type AgentHarnessBeforeAgentFinalizeOutcome =
  | {
      action: "continue";
    }
  | {
      action: "revise";
      reason: string;
    }
  | {
      action: "finalize";
      reason?: string;
    };
/** Runs before-finalize hooks and normalizes finalize/revise/continue decisions. */
declare function runAgentHarnessBeforeAgentFinalizeHook(params: {
  event: PluginHookBeforeAgentFinalizeEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): Promise<AgentHarnessBeforeAgentFinalizeOutcome>;
//#endregion
//#region src/agents/harness/agent-end-side-effects.d.ts
type BaseAgentEndSideEffectsParams = Parameters<typeof runAgentHarnessAgentEndHook>[0];
type AgentEndSideEffectsParams = Omit<BaseAgentEndSideEffectsParams, "ctx"> & {
  ctx: BaseAgentEndSideEffectsParams["ctx"] & {
    authProfileId?: string;
    skillWorkshopAvailable?: boolean;
    compacted?: boolean;
    messageChannel?: string | null;
    chatType?: ChatType;
    agentAccountId?: string | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    memberRoleIds?: readonly string[];
    spawnedBy?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
    senderIsOwner?: boolean;
  };
};
/** Starts agent-end side effects without waiting for completion. */
declare function runAgentEndSideEffects(params: AgentEndSideEffectsParams): void;
/** Runs agent-end side effects and waits for plugin/core completion. */
declare function awaitAgentEndSideEffects(params: AgentEndSideEffectsParams): Promise<void>;
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.d.ts
/** Default truncation limit for user-facing tool progress output. */
declare const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8000;
type EmbeddedRunAttemptParams = Omit<EmbeddedRunAttemptParams$1, "trajectoryRecorder">;
/**
 * @deprecated Active-run queueing is an internal runtime concern. This legacy
 * boolean API only reports immediate queue eligibility and cannot observe async
 * runtime rejection; runtime-owned delivery paths should use acceptance-aware
 * steering instead of public SDK queueing.
 */
declare function queueAgentHarnessMessage(
  sessionId: string,
  text: string,
  options?: EmbeddedAgentQueueMessageOptions,
): boolean;
/** Detect prompt image references and load them through the same limits used by embedded runs. */
declare function detectAndLoadAgentHarnessPromptImages(params: {
  prompt: string;
  workspaceDir: string;
  model: {
    input?: string[];
  };
  existingImages?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[];
  config?: OpenClawConfig;
  workspaceOnly?: boolean;
  localRoots?: readonly string[];
  sandbox?: {
    root: string;
    bridge: SandboxFsBridge;
  };
}): Promise<{
  images: ImageContent[];
  detectedRefs: Array<{
    raw: string;
    resolved: string;
    type: "path" | "media-uri";
  }>;
  loadedCount: number;
  skippedCount: number;
}>;
/** Load Codex bundle MCP thread config without forcing the heavy config module into SDK imports. */
declare function loadCodexBundleMcpThreadConfig(
  params: LoadCodexBundleMcpThreadConfigParams,
): Promise<CodexBundleMcpThreadConfig>;
/**
 * Derive the same compact user-facing tool detail that embedded OpenClaw uses for progress logs.
 */
type ToolProgressDetailMode = "explain" | "raw";
/** Infer compact display metadata for one tool invocation from its name and arguments. */
declare function inferToolMetaFromArgs(
  toolName: string,
  args: unknown,
  options?: {
    detailMode?: ToolProgressDetailMode;
  },
): string | undefined;
/**
 * Prepare verbose tool output for user-facing progress messages.
 */
declare function formatToolProgressOutput(
  output: string,
  options?: {
    maxChars?: number;
  },
): string | undefined;
/** Inputs used to classify a finished harness turn with little or no visible assistant output. */
type AgentHarnessTerminalOutcomeInput = {
  assistantTexts: readonly string[];
  reasoningText?: string | null;
  planText?: string | null;
  promptError?: unknown;
  turnCompleted: boolean;
};
/** Terminal fallback classification emitted by agent harness adapters. */
type AgentHarnessTerminalOutcomeClassification = NonNullable<
  EmbeddedRunAttemptResult["agentHarnessResultClassification"]
>;
/**
 * Classify terminal harness turns that completed without assistant output that
 * should advance fallback. Deliberate silent replies such as NO_REPLY count as
 * intentional output, while whitespace-only text remains fallback-eligible.
 * This is intentionally SDK-level so plugin harness adapters such as Codex
 * preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
 * without re-implementing terminal-result policy.
 */
declare function classifyAgentHarnessTerminalOutcome(
  params: AgentHarnessTerminalOutcomeInput,
): AgentHarnessTerminalOutcomeClassification | undefined;
//#endregion
export {
  inspectRuntimeToolInputSchemas as $,
  buildAgentHarnessUserInputAnswers as $t,
  resolveCompactionTimeoutMs as A,
  NodeListNode as At,
  resolveAgentHarnessBeforePromptBuildResult as B,
  NativeHookRelayProcessResponse as Bt,
  PREEMPTIVE_OVERFLOW_ERROR_TEXT as C,
  resolveToolResultFailureKind as Ct,
  shouldPreemptivelyCompactBeforePrompt as D,
  listNodes as Dt,
  formatPrePromptPrecheckLog as E,
  formatToolAggregate as Et,
  finalizeHarnessContextEngineTurn as F,
  isHostScopedAgentToolActive as Ft,
  resolveWritableSandboxBindHostRoots as G,
  invokeNativeHookRelay as Gt,
  runAgentHarnessBeforeCompactionHook as H,
  NativeHookRelayRegistrationHandle as Ht,
  isActiveHarnessContextEngine as I,
  resolveAgentRunAbortLifecycleFields as It,
  normalizeAgentRuntimeTools as J,
  testing as Jt,
  normalizeProviderToolSchemas as K,
  registerNativeHookRelay as Kt,
  runHarnessContextEngineMaintenance as L,
  runAgentCleanupStep as Lt,
  bootstrapHarnessContextEngine as M,
  classifyEmbeddedAgentRunResultForModelFallback as Mt,
  buildHarnessContextEngineRuntimeContext as N,
  buildAgentRuntimePlan as Nt,
  compactContextEngineWithSafetyTimeout as O,
  resolveNodeIdFromList as Ot,
  buildHarnessContextEngineRuntimeContextFromUsage as P,
  log as Pt,
  filterProviderNormalizableTools as Q,
  AgentHarnessUserInputQuestion as Qt,
  createAgentToolResultMiddlewareRunner as R,
  buildAgentHookContextChannelFields as Rt,
  LlmBoundaryTokenPressure as S,
  resolveToolExecutionErrorKind as St,
  estimateRenderedLlmBoundaryTokenPressure as T,
  isMessagingToolSendAction as Tt,
  hasSandboxBindContainerPathAliases as U,
  buildNativeHookRelayCommand as Ut,
  runAgentHarnessAfterCompactionHook as V,
  NativeHookRelayProvider as Vt,
  hasSandboxBindReadonlyHostShadows as W,
  hasNativeHookRelayInvocation as Wt,
  RuntimeToolInputSchemaProjection as X,
  AgentHarnessUserInputOption as Xt,
  RuntimeToolInputSchemaJson as Y,
  AgentHarnessUserInputAnswers as Yt,
  RuntimeToolSchemaDiagnostic as Z,
  AgentHarnessUserInputPromptOptions as Zt,
  runAgentHarnessBeforeAgentFinalizeHook as _,
  filterToolResultMediaUrls as _t,
  ToolProgressDetailMode as a,
  isDeliveredMessagingToolResult as an,
  buildEmbeddedAttemptToolRunContext as at,
  runAgentHarnessAfterToolCallHook as b,
  formatToolExecutionErrorMessage as bt,
  formatToolProgressOutput as c,
  SKILL_WORKSHOP_TOOL_NAME as ct,
  queueAgentHarnessMessage as d,
  isAgentToolReplaySafe as dt,
  deliverAgentHarnessUserInputPrompt as en,
  projectRuntimeToolInputSchema$1 as et,
  awaitAgentEndSideEffects as f,
  supportsModelTools as ft,
  runAgentHarnessAgentEndHook as g,
  extractToolResultMediaArtifact as gt,
  getAgentHarnessHookRunner as h,
  extractToolErrorMessage as ht,
  TOOL_PROGRESS_OUTPUT_MAX_CHARS as i,
  isDeliveredMessageToolOnlySourceReplyResult as in,
  OpenClawCodingToolConstructionPlan as it,
  assembleHarnessContextEngine as j,
  callGatewayTool as jt,
  compactWithSafetyTimeout as k,
  selectDefaultNodeFromList as kt,
  inferToolMetaFromArgs as l,
  buildSkillWorkshopPromptSection as lt,
  awaitAgentHarnessAgentEndHook as m,
  extractMessagingToolSendResult as mt,
  AgentHarnessTerminalOutcomeInput as n,
  formatAgentHarnessUserInputPrompt as nn,
  applyEmbeddedAttemptToolsAllow as nt,
  classifyAgentHarnessTerminalOutcome as o,
  CodexBundleMcpThreadConfig as on,
  resolveAttemptSpawnWorkspaceDir as ot,
  runAgentEndSideEffects as p,
  extractMessagingToolSend as pt,
  logAgentRuntimeToolDiagnostics as q,
  resolveNativeHookRelayDeferredToolApproval as qt,
  EmbeddedRunAttemptParams as r,
  normalizeAgentHarnessUserInputAnswer as rn,
  resolveEmbeddedAttemptToolConstructionPlan as rt,
  detectAndLoadAgentHarnessPromptImages as s,
  LoadCodexBundleMcpThreadConfigParams as sn,
  resolveAttemptFsWorkspaceOnly as st,
  AgentHarnessTerminalOutcomeClassification as t,
  emptyAgentHarnessUserInputAnswers as tn,
  disposeRegisteredAgentHarnesses as tt,
  loadCodexBundleMcpThreadConfig as u,
  getChannelAgentToolMeta as ut,
  runAgentHarnessLlmInputHook as v,
  sanitizeToolResult as vt,
  PreemptiveCompactionDecision as w,
  isMessagingTool as wt,
  runAgentHarnessBeforeMessageWriteHook as x,
  isToolResultError as xt,
  runAgentHarnessLlmOutputHook as y,
  ToolResultFailureKind as yt,
  createCodexAppServerToolResultExtensionRunner as z,
  NativeHookRelayEvent as zt,
};
