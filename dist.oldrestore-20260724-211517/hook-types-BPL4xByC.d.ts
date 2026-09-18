import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { t as PluginConversationBinding } from "./conversation-binding.types-FpB9wxq5.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { h as PluginHookChannelContext, t as FinalizedMsgContext } from "./templating-h3OQefFR.js";
import { a as SourceReplyDeliveryMode } from "./types-BgrDi5xH.js";
import { s as AgentMessage } from "./types-JQFrjdua.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { G as TtsAutoMode } from "./types.slack-DOPma3IJ.js";

//#region src/auto-reply/reply/reply-dispatcher.types.d.ts
type ReplyDispatchKind = "tool" | "block" | "final";
type ReplyFollowupAdmissionBarrierTimeoutPolicy = {
  /** Absolute failsafe for owner activity that never settles. */ maxTimeoutMs: number /** Extend by another default settle interval while bounded owner work remains active. */;
  shouldExtend: () => boolean;
};
type ReplyDispatchRuntimeInfo = {
  kind: ReplyDispatchKind;
  assistantMessageIndex?: number;
};
type ReplyDispatchBeforeDeliver = (
  payload: ReplyPayload,
  info: ReplyDispatchRuntimeInfo,
) => Promise<ReplyPayload | null> | ReplyPayload | null;
/** An owner-declared settlement budget for one before-delivery callback. */
type ReplyDispatchBeforeDeliverOptions = {
  /** Positive finite per-callback deadline in milliseconds; omit for the dispatcher default. */ timeoutMs?: number;
};
type ReplyDispatcher = {
  sendToolResult: (payload: ReplyPayload) => boolean;
  sendBlockReply: (payload: ReplyPayload) => boolean;
  sendFinalReply: (payload: ReplyPayload) => boolean;
  appendBeforeDeliver?: (
    hook: ReplyDispatchBeforeDeliver,
    options?: ReplyDispatchBeforeDeliverOptions,
  ) => void;
  waitForIdle: () => Promise<void>;
  getQueuedCounts: () => Record<ReplyDispatchKind, number>;
  getCancelledCounts?: () => Record<ReplyDispatchKind, number>;
  getFailedCounts: () => Record<ReplyDispatchKind, number>;
  markComplete: () => void /** Owner-declared deadline for holding queued follow-ups behind all queued deliveries. */;
  resolveFollowupAdmissionBarrierTimeoutPolicy?: () =>
    | ReplyFollowupAdmissionBarrierTimeoutPolicy
    | undefined;
};
//#endregion
//#region src/plugins/hook-before-agent-start.types.d.ts
type PluginHookBeforeModelResolveAttachment = {
  kind: "image" | "video" | "audio" | "document" | "other";
  mimeType?: string;
};
type PluginHookBeforeModelResolveEvent = {
  /** User prompt for this run. No session messages are available yet in this phase. */ prompt: string /** Attachment metadata for file-aware model routing. */;
  attachments?: PluginHookBeforeModelResolveAttachment[];
};
type PluginHookBeforeModelResolveResult = {
  /** Override the model for this agent run. E.g. "llama3.3:8b" */ modelOverride?: string /** Override the provider for this agent run. E.g. "local-provider" */;
  providerOverride?: string;
};
type PluginHookBeforePromptBuildEvent = {
  prompt: string /** Session messages prepared for this run. */;
  messages: unknown[];
};
type PluginHookBeforePromptBuildResult = {
  systemPrompt?: string;
  prependContext?: string;
  appendContext?: string;
  /**
   * Prepended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  prependSystemContext?: string;
  /**
   * Appended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  appendSystemContext?: string;
};
declare const PLUGIN_PROMPT_MUTATION_RESULT_FIELDS: readonly [
  "systemPrompt",
  "prependContext",
  "appendContext",
  "prependSystemContext",
  "appendSystemContext",
];
/**
 * @deprecated Use before_model_resolve and before_prompt_build.
 *
 * Legacy compatibility hook that combines both phases.
 */
type PluginHookBeforeAgentStartEvent = {
  prompt: string;
  runId?: string /** Optional because legacy hook can run in pre-session phase. */;
  messages?: unknown[];
};
/** @deprecated Use before_model_resolve and before_prompt_build result types. */
type PluginHookBeforeAgentStartResult = PluginHookBeforePromptBuildResult &
  PluginHookBeforeModelResolveResult;
/** @deprecated Use before_model_resolve override result types. */
type PluginHookBeforeAgentStartOverrideResult = Omit<
  PluginHookBeforeAgentStartResult,
  keyof PluginHookBeforePromptBuildResult
>;
declare const stripPromptMutationFieldsFromLegacyHookResult: (
  result: PluginHookBeforeAgentStartResult | void,
) => PluginHookBeforeAgentStartOverrideResult | void;
//#endregion
//#region src/plugins/hook-before-tool-call-result.d.ts
declare const PluginApprovalResolutions: {
  readonly ALLOW_ONCE: "allow-once";
  readonly ALLOW_ALWAYS: "allow-always";
  readonly DENY: "deny";
  readonly TIMEOUT: "timeout";
  readonly CANCELLED: "cancelled";
};
type PluginApprovalResolution =
  (typeof PluginApprovalResolutions)[keyof typeof PluginApprovalResolutions];
type PluginHookBeforeToolCallResult = {
  params?: Record<string, unknown>;
  block?: boolean;
  blockReason?: string;
  requireApproval?: {
    title: string;
    description: string;
    severity?: "info" | "warning" | "critical";
    timeoutMs?: number;
    /**
     * @deprecated Unresolved approvals always deny; retained for plugin API
     * compatibility. The field will be removed after one deprecation release train.
     */
    timeoutBehavior?:
      | "allow"
      | "deny" /** Override timeout text and return the timeout as a blocked tool result. */;
    timeoutReason?: string;
    allowedDecisions?: Array<"allow-once" | "allow-always" | "deny">;
    pluginId?: string;
    onResolution?: (decision: PluginApprovalResolution) => Promise<void> | void;
  };
};
//#endregion
//#region src/plugins/hook-decision-types.d.ts
/**
 * Structured decision returned by gate/policy hooks.
 * Core is outcome-agnostic — it handles the mechanics of each outcome
 * without knowing *why* the decision was made.
 */
type HookDecision = HookDecisionPass | HookDecisionBlock;
/** Content is fine. Proceed normally. */
type HookDecisionPass = {
  outcome: "pass";
};
/**
 * Content is blocked. `reason` is internal plugin-local detail; core must not log,
 * persist, broadcast, or expose it verbatim. `message` is user-facing detail.
 */
type HookDecisionBlock = {
  outcome: "block" /** Internal plugin-local reason. Do not log, persist, broadcast, or expose verbatim. */;
  reason: string /** Optional user-facing detail included in the block response envelope. */;
  message?: string /** Plugin-defined category for analytics (e.g. "violence", "pii", "cost_limit"). */;
  category?: string /** Opaque metadata for the plugin's own use. Core does not interpret it. */;
  metadata?: Record<string, unknown>;
};
/** Outcomes valid for input gates (before_agent_run). */
type InputGateDecision = HookDecisionPass | HookDecisionBlock;
/**
 * A gate hook decision paired with the pluginId that produced it.
 * Returned by gate hook runners so callers can
 * attribute blocked entries and audit events to the originating plugin.
 */
type GateHookResult<TDecision extends HookDecision = HookDecision> = {
  decision: TDecision;
  pluginId: string;
};
//#endregion
//#region src/plugins/hook-message.types.d.ts
type PluginHookMessageContext = {
  channelId: string;
  accountId?: string;
  conversationId?: string;
  /**
   * Canonical session key for this conversation — the same value the agent
   * runtime sees as `params.sessionKey` for the run that produced the
   * outbound payload, and the same value `agent_end`/`llm_input`/`llm_output`
   * fire with. Plugins correlating per-turn state across `agent_end` and
   * `message_sending` rely on this equality.
   *
   * For inbound message hooks (`inbound_claim` etc.), this is the canonical
   * session for the inbound conversation as resolved by `resolveSessionKey`
   * / `deriveInboundMessageHookContext`.
   *
   * For outbound delivery hooks (`message_sending` and `message_sent`),
   * this mirrors `OutboundSessionContext.key` from the dispatch path when
   * delivery has a session attached. When the outbound path has no
   * resolvable session (e.g. internal smoke runs without
   * `OutboundSessionContext`), this field is omitted; plugins must treat
   * it as optional.
   */
  sessionKey?: string;
  /**
   * Per-turn run identifier (UUID), unique to one end-to-end agent turn:
   * stable across all LLM-call iterations, retry attempts (compaction,
   * empty-response, planning-only, etc.), and multi-payload reply chunks
   * within that turn; distinct for each new inbound user message and for
   * each cron/heartbeat/followup-triggered run.
   *
   * Generated once in `agent-runner-execution.ts`/`followup-runner.ts` via
   * `crypto.randomUUID()`. Currently populated for inbound message hooks
   * (`inbound_claim`, `message_received`) and for agent-runtime hooks that
   * already receive the run id (e.g. `agent_end`, `llm_input`, `llm_output`).
   * It is **not yet** plumbed through the outbound delivery path, so
   * plugins observing `message_sending` / `message_sent` should not rely
   * on `runId` to correlate against `agent_end`; use `sessionKey` for
   * outbound→inbound correlation today (with the caveat that it cannot
   * disambiguate concurrent turns in the same session).
   */
  runId?: string;
  messageId?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  callDepth?: number;
};
type PluginHookInboundClaimContext = PluginHookMessageContext & {
  /** Resolved owner for session scopes whose canonical key does not encode an agent id. */ agentId?: string;
  parentConversationId?: string;
  senderId?: string;
  messageId?: string;
  pluginBinding?: PluginConversationBinding;
};
type PluginHookInboundClaimEvent = {
  content: string;
  body?: string;
  bodyForAgent?: string;
  transcript?: string;
  timestamp?: number;
  channel: string;
  accountId?: string;
  conversationId?: string;
  parentConversationId?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  threadId?: string | number;
  messageId?: string;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  isGroup: boolean;
  commandAuthorized?: boolean;
  senderIsOwner?: boolean;
  wasMentioned?: boolean;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageReceivedEvent = {
  from: string;
  content: string;
  timestamp?: number;
  threadId?: string | number;
  messageId?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSendingEvent = {
  to: string;
  content: string;
  replyToId?: string | number;
  threadId?: string | number;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSendingResult = {
  content?: string;
  cancel?: boolean;
  cancelReason?: string;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSentEvent = {
  to: string;
  content: string;
  success: boolean;
  messageId?: string;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  error?: string;
};
//#endregion
//#region src/plugins/host-hook-json.d.ts
/** JSON primitive values accepted across plugin host-hook boundaries. */
type PluginJsonPrimitive = string | number | boolean | null;
/** Bounded JSON value shape accepted from plugin hooks. */
type PluginJsonValue =
  | PluginJsonPrimitive
  | PluginJsonValue[]
  | {
      [key: string]: PluginJsonValue;
    };
//#endregion
//#region src/plugins/host-hook-turn-types.d.ts
/** Placement for context injected into the next agent turn. */
type PluginNextTurnInjectionPlacement = "prepend_context" | "append_context";
/** Plugin request to inject text into the next turn for a session. */
type PluginNextTurnInjection = {
  sessionKey: string;
  text: string;
  idempotencyKey?: string;
  placement?: PluginNextTurnInjectionPlacement;
  ttlMs?: number;
  metadata?: PluginJsonValue;
};
/** Stored next-turn injection after session/plugin metadata is attached. */
type PluginNextTurnInjectionRecord = Omit<PluginNextTurnInjection, "sessionKey"> & {
  id: string;
  pluginId: string;
  pluginName?: string;
  createdAt: number;
  placement: PluginNextTurnInjectionPlacement;
};
/** Result returned after enqueueing a next-turn injection. */
type PluginNextTurnInjectionEnqueueResult = {
  enqueued: boolean;
  id: string;
  sessionKey: string;
};
/** Event passed to plugins before an agent turn is prepared. */
type PluginAgentTurnPrepareEvent = {
  prompt: string;
  messages: unknown[];
  queuedInjections: PluginNextTurnInjectionRecord[];
};
/** Plugin contribution to prepend or append context for a prepared agent turn. */
type PluginAgentTurnPrepareResult = {
  prependContext?: string;
  appendContext?: string;
};
/** Event passed to plugins that contribute heartbeat prompt context. */
type PluginHeartbeatPromptContributionEvent = {
  sessionKey?: string;
  agentId?: string;
  heartbeatName?: string;
};
/** Plugin contribution to heartbeat prompt context. */
type PluginHeartbeatPromptContributionResult = {
  prependContext?: string;
  appendContext?: string;
};
//#endregion
//#region src/plugins/hook-types.d.ts
type PluginHookName =
  | "before_model_resolve"
  | "agent_turn_prepare"
  | "before_prompt_build"
  | "before_agent_start"
  | "before_agent_reply"
  | "model_call_started"
  | "model_call_ended"
  | "llm_input"
  | "llm_output"
  | "before_agent_finalize"
  | "agent_end"
  | "before_compaction"
  | "after_compaction"
  | "before_reset"
  | "inbound_claim"
  | "channel_pairing_requested"
  | "message_received"
  | "message_sending"
  | "reply_payload_sending"
  | "message_sent"
  | "before_tool_call"
  | "after_tool_call"
  | "tool_result_persist"
  | "before_message_write"
  | "session_start"
  | "session_end"
  /**
   * @deprecated Core prepares thread-bound subagent bindings through channel
   * session-binding adapters before `subagent_spawned` fires. Use
   * `subagent_spawned` for post-launch observation in new plugins.
   */
  | "subagent_spawning"
  | "subagent_delivery_target"
  | "subagent_spawned"
  | "subagent_ended" /** @deprecated Use gateway_stop. */
  | "deactivate"
  | "gateway_start"
  | "gateway_stop"
  | "heartbeat_prompt_contribution"
  | "cron_reconciled"
  | "cron_changed"
  | "before_dispatch"
  | "reply_dispatch"
  | "before_install"
  | "before_agent_run"
  | "resolve_exec_env";
declare const PLUGIN_HOOK_NAMES: readonly [
  "before_model_resolve",
  "agent_turn_prepare",
  "before_prompt_build",
  "before_agent_start",
  "before_agent_reply",
  "model_call_started",
  "model_call_ended",
  "llm_input",
  "llm_output",
  "before_agent_finalize",
  "agent_end",
  "before_compaction",
  "after_compaction",
  "before_reset",
  "inbound_claim",
  "channel_pairing_requested",
  "message_received",
  "message_sending",
  "reply_payload_sending",
  "message_sent",
  "before_tool_call",
  "after_tool_call",
  "tool_result_persist",
  "before_message_write",
  "session_start",
  "session_end",
  "subagent_spawning",
  "subagent_delivery_target",
  "subagent_spawned",
  "subagent_ended",
  "deactivate",
  "gateway_start",
  "gateway_stop",
  "heartbeat_prompt_contribution",
  "cron_reconciled",
  "cron_changed",
  "before_dispatch",
  "reply_dispatch",
  "before_install",
  "before_agent_run",
  "resolve_exec_env",
];
type DeprecatedPluginHookName = "subagent_spawning" | "deactivate";
type PluginHookDeprecation = {
  replacement: string;
  reason: string;
  removeAfter?: string;
};
type PluginHookChannelPairingRequestedEvent = {
  /** Channel that created the pending pairing request. */ channel: string /** Provider account ID for multi-account channel setups. */;
  accountId?: string /** Channel-scoped sender ID awaiting operator approval. */;
  senderId: string /** Short-lived code accepted by `openclaw pairing approve`. */;
  code: string /** Sender-supplied channel metadata for operator notification/audit. Treat as untrusted. */;
  metadata?: Record<string, string | undefined>;
};
type PluginHookChannelPairingContext = {
  channelId: string;
  accountId?: string;
  senderId: string;
};
declare const DEPRECATED_PLUGIN_HOOKS: {
  readonly subagent_spawning: {
    readonly replacement: "`subagent_spawned` for observation; core session bindings for routing";
    readonly reason: "Core prepares thread-bound subagent bindings through channel session-binding adapters before `subagent_spawned` fires.";
    readonly removeAfter: "2026-08-30";
  };
  readonly deactivate: {
    readonly replacement: "`gateway_stop`";
    readonly reason: "`deactivate` is a legacy cleanup hook alias for `gateway_stop`.";
    readonly removeAfter: "2026-08-16";
  };
};
declare const DEPRECATED_PLUGIN_HOOK_NAMES: DeprecatedPluginHookName[];
declare const isDeprecatedPluginHookName: (
  hookName: PluginHookName,
) => hookName is DeprecatedPluginHookName;
declare const isPluginHookName: (hookName: unknown) => hookName is PluginHookName;
declare const PROMPT_INJECTION_HOOK_NAMES: readonly [
  "agent_turn_prepare",
  "before_prompt_build",
  "before_agent_start",
  "heartbeat_prompt_contribution",
];
type PromptInjectionHookName = (typeof PROMPT_INJECTION_HOOK_NAMES)[number];
declare const isPromptInjectionHookName: (hookName: PluginHookName) => boolean;
declare const CONVERSATION_HOOK_NAMES: readonly [
  "before_model_resolve",
  "before_agent_reply",
  "llm_input",
  "llm_output",
  "before_agent_finalize",
  "agent_end",
  "before_agent_run",
];
type ConversationHookName = (typeof CONVERSATION_HOOK_NAMES)[number];
declare const isConversationHookName: (hookName: PluginHookName) => boolean;
type PluginHookAgentContext = {
  runId?: string;
  jobId?: string;
  trace?: DiagnosticTraceContext;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  modelProviderId?: string;
  modelId?: string;
  messageProvider?: string /** Channel/plugin id for channel-originated runs, e.g. `discord`. */;
  channel?: string /** Conversation target id for channel-originated runs. Mirrors `channelId` for compatibility. */;
  chatId?: string /** Sender identity for channel-originated runs when available. */;
  senderId?: string;
  trigger?: string;
  channelId?: string /** Resolved effective context-token budget after model/config/agent caps. */;
  contextTokenBudget?: number /** Source that supplied the resolved context-token budget. */;
  contextWindowSource?: PluginHookContextWindowSource /** Native/configured reference window when a lower cap wins. */;
  contextWindowReferenceTokens?: number;
  /**
   * @deprecated Core does not populate cross-app sender ids. Channel plugins
   * should expose channel-specific identities by augmenting `channelContext.sender`.
   */
  senderExternalId?: string /** Channel-owned sender/chat details. Plugins may augment the nested interfaces. */;
  channelContext?: PluginHookChannelContext;
};
type PluginHookContextWindowSource = "model" | "modelsConfig" | "agentContextTokens" | "default";
type PluginHookBeforeAgentReplyEvent = {
  cleanedBody: string;
};
type PluginHookBeforeAgentReplyResult = {
  handled: boolean;
  reply?: ReplyPayload;
  reason?: string;
};
type PluginHookLlmInputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  systemPrompt?: string;
  prompt: string;
  historyMessages: unknown[];
  imagesCount: number;
  tools?: unknown[];
};
type PluginHookModelCallBaseEvent = {
  runId: string;
  callId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  api?: string;
  transport?: string /** Resolved effective context-token budget after model/config/agent caps. */;
  contextTokenBudget?: number /** Source that supplied the resolved context-token budget. */;
  contextWindowSource?: PluginHookContextWindowSource /** Native/configured reference window when a lower cap wins. */;
  contextWindowReferenceTokens?: number;
};
type PluginHookModelCallStartedEvent = PluginHookModelCallBaseEvent;
type PluginHookModelCallEndedEvent = PluginHookModelCallBaseEvent & {
  durationMs: number;
  outcome: "completed" | "error";
  errorCategory?: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  upstreamRequestIdHash?: string;
};
type PluginHookLlmOutputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string /** Resolved effective context-token budget after model/config/agent caps. */;
  contextTokenBudget?: number /** Source that supplied the resolved context-token budget. */;
  contextWindowSource?: PluginHookContextWindowSource /** Native/configured reference window when a lower cap wins. */;
  contextWindowReferenceTokens?: number;
  /**
   * Fully resolved provider/model ref used for the call.
   *
   * This intentionally keeps the provider prefix so operator tooling can
   * distinguish e.g. openai/gpt-5.4 from codex/gpt-5.4 even when display
   * names collapse to just the model id.
   */
  resolvedRef?: string;
  /**
   * Harness/backend responsible for the model loop. Kept separate from
   * `resolvedRef` so provider/model consumers keep a stable parse contract.
   */
  harnessId?: string /** The original user prompt that produced this output. */;
  prompt?: string;
  assistantTexts: string[];
  lastAssistant?: unknown;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  /**
   * Requested reasoning/think effort for this call (provider think level, e.g.
   * "off" | "low" | "medium" | "high"). Lets a passive footer show the mode the
   * user is actually running without re-deriving it.
   */
  reasoningEffort?: string /** Whether fast mode was active for this call. */;
  fastMode?: boolean;
};
type PluginHookAgentEndEvent = {
  runId?: string;
  messages: unknown[];
  success: boolean;
  error?: string;
  durationMs?: number;
};
type PluginHookBeforeAgentFinalizeEvent = {
  runId?: string;
  sessionId: string;
  sessionKey?: string;
  turnId?: string;
  provider?: string;
  model?: string;
  cwd?: string;
  transcriptPath?: string;
  stopHookActive: boolean;
  lastAssistantMessage?: string;
  messages?: unknown[];
};
type PluginHookBeforeAgentFinalizeResult = {
  /**
   * continue: accept normal finalization.
   * revise: block finalization and ask the harness for another model pass.
   * finalize: force finalization even if another hook requested revision.
   */
  action?: "continue" | "revise" | "finalize";
  reason?: string;
  retry?: {
    instruction: string;
    idempotencyKey?: string;
    maxAttempts?: number;
  };
};
type PluginHookBeforeCompactionEvent = {
  messageCount: number;
  compactingCount?: number;
  tokenCount?: number;
  messages?: unknown[];
  sessionFile?: string;
};
type PluginHookBeforeResetEvent = {
  sessionFile?: string;
  messages?: unknown[];
  reason?: string;
};
type PluginHookAfterCompactionEvent = {
  messageCount: number;
  tokenCount?: number;
  compactedCount: number;
  sessionFile?: string /** Physical session generation replaced by this compaction, when it rotated. */;
  previousSessionId?: string;
};
type PluginHookInboundClaimResult = {
  handled: boolean;
  reply?: ReplyPayload;
};
type PluginHookBeforeDispatchEvent = {
  content: string;
  body?: string;
  channel?: string;
  sessionKey?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  isGroup?: boolean;
  timestamp?: number;
};
type PluginHookBeforeDispatchContext = {
  channelId?: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
};
type PluginHookBeforeDispatchResult = {
  handled: boolean;
  text?: string;
};
type PluginHookReplyDispatchEvent = {
  ctx: FinalizedMsgContext;
  runId?: string;
  sessionKey?: string;
  toolsAllow?: string[];
  images?: Array<{
    data: string;
    mimeType: string;
  }>;
  inboundAudio: boolean;
  sessionTtsAuto?: TtsAutoMode;
  ttsChannel?: string;
  suppressUserDelivery?: boolean;
  suppressReplyLifecycle?: boolean;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  shouldRouteToOriginating: boolean;
  originatingChannel?: string;
  originatingTo?: string;
  originatingAccountId?: string;
  originatingThreadId?: string | number;
  originatingChatType?: ChatType;
  shouldSendToolSummaries: boolean;
  sendPolicy: "allow" | "deny";
  isTailDispatch?: boolean;
};
type PluginHookReplyDispatchContext = {
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  abortSignal?: AbortSignal;
  onReplyStart?: () => Promise<void> | void;
  recordProcessed: (
    outcome: "completed" | "skipped" | "error",
    opts?: {
      reason?: string;
      error?: string;
    },
  ) => void;
  markIdle: (reason: string) => void;
};
type PluginHookReplyDispatchResult = {
  handled: boolean;
  queuedFinal: boolean;
  counts: Record<ReplyDispatchKind, number>;
};
/**
 * Per-turn execution state for the outbound reply, available to every harness
 * (embedded, CLI, Codex app-server) — sourced from the unified `runResult.meta`
 * at dispatch, not from the harness-specific `llm_output` hook. Lets a plugin
 * render a passive per-response footer without re-deriving run state.
 */
type PluginHookReplyUsageState = {
  provider?: string;
  model?: string /** Resolved provider/model ref actually used (keeps the provider prefix). */;
  resolvedRef?: string /** Requested reasoning/think effort (e.g. "off" | "low" | "medium" | "high"). */;
  reasoningEffort?: string;
  fastMode?: boolean /** True when a model fallback was used for this turn. */;
  fallbackUsed?: boolean /** Owning agent + session for this reply. */;
  agentId?: string;
  sessionId?: string /** Chat surface kind (e.g. "direct" | "group"). */;
  chatType?: string /** Credential mode the turn ran under (e.g. "oauth" | "api_key"). */;
  authMode?: string /** Session model-override source, when a non-default model was pinned. */;
  overrideSource?: string /** Provider/model ref requested for the turn (vs resolvedRef actually used). */;
  requested?: string /** Estimated cost of this turn in USD, when a cost table is configured. */;
  turnUsd?: number /** Wall-clock duration of the turn in milliseconds. */;
  durationMs?: number /** Owning agent's configured identity (name/emoji/avatar), when set. */;
  identity?: {
    name?: string;
    emoji?: string;
    avatar?: string;
  };
  compactionCount?: number /** Effective context-token budget after model/config/agent caps. */;
  contextTokenBudget?: number;
  /**
   * Actual context-window occupancy at the END of the turn — the final model
   * call's prompt tokens, NOT the per-turn aggregate. This is the value
   * `context.used_tokens` / `context.pct_used` must use: the aggregate prompt
   * total over a multi-call tool loop overstates occupancy (often beyond the
   * window). Absent on harnesses that don't report it (the contract then falls
   * back to the aggregate prompt total, which is correct for single-call turns).
   */
  contextUsedTokens?: number;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  /**
   * Usage from the FINAL model call of the turn only — vs `usage`, which is the
   * turn aggregate summed across every tool-loop call. Lets a footer render the
   * last exchange's i/o + cache instead of the whole turn. Absent on harnesses
   * that don't report per-call usage.
   */
  lastUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
};
type PluginHookReplyPayloadSendingEvent = {
  payload: PluginHookReplyPayload;
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  /**
   * Per-turn usage snapshot for live dispatcher delivery. Absent on durable
   * delivery/replay paths, and whenever no exact run correlation is available.
   */
  usageState?: PluginHookReplyUsageState;
};
type PluginHookReplyPayload = Omit<ReplyPayload, "trustedLocalMedia">;
type PluginHookReplyPayloadSendingContext = PluginHookMessageContext;
type PluginHookReplyPayloadSendingResult = {
  payload?: PluginHookReplyPayload;
  cancel?: boolean;
  reason?: string;
};
type PluginHookToolKind = "code_mode_exec";
type PluginHookToolInputKind = "javascript" | "typescript";
type PluginHookToolContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  toolName: string /** Host-authoritative discriminator for tools that intentionally share names. */;
  toolKind?: PluginHookToolKind /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */;
  toolInputKind?: PluginHookToolInputKind;
  toolCallId?: string;
  getSessionExtension?: (namespace: string) => PluginJsonValue | undefined;
  channelId?: string;
};
type PluginHookBeforeToolCallEvent = {
  toolName: string;
  params: Record<
    string,
    unknown
  > /** Host-authoritative discriminator for tools that intentionally share names. */;
  toolKind?: PluginHookToolKind /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */;
  toolInputKind?: PluginHookToolInputKind;
  runId?: string;
  toolCallId?: string;
  /**
   * Optional best-effort destination path hints the host derived from `params`
   * for well-known tool envelopes (e.g. `apply_patch`).
   *
   * This is a convenience hint, not an authoritative parse result: the host's
   * extractor may be intentionally lenient and can return paths for malformed
   * or partial envelopes. Plugins may use `derivedPaths` as a fast path, but
   * should parse and validate `params` themselves when correctness or policy
   * decisions depend on the exact set of affected paths. Absent for tools the
   * host does not know how to derive paths for.
   */
  derivedPaths?: readonly string[];
};
type PluginHookAfterToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  runId?: string;
  toolCallId?: string;
  result?: unknown;
  error?: string;
  durationMs?: number;
};
type PluginHookToolResultPersistContext = {
  agentId?: string;
  sessionKey?: string;
  toolName?: string;
  toolCallId?: string;
};
type PluginHookToolResultPersistEvent = {
  toolName?: string;
  toolCallId?: string;
  message: AgentMessage;
  isSynthetic?: boolean;
};
type PluginHookToolResultPersistResult = {
  message?: AgentMessage;
};
type PluginHookBeforeMessageWriteEvent = {
  message: AgentMessage;
  sessionKey?: string;
  agentId?: string;
};
type PluginHookBeforeMessageWriteResult = {
  block?: boolean;
  message?: AgentMessage;
};
type PluginHookSessionContext = {
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
};
type PluginHookSessionStartEvent = {
  sessionId: string;
  sessionKey?: string;
  resumedFrom?: string;
};
type PluginHookSessionEndReason =
  | "new"
  | "reset"
  | "idle"
  | "daily"
  | "compaction"
  | "deleted"
  | "shutdown"
  | "restart"
  | "unknown";
type PluginHookSessionEndEvent = {
  sessionId: string;
  sessionKey?: string;
  messageCount: number;
  durationMs?: number;
  reason?: PluginHookSessionEndReason;
  sessionFile?: string;
  transcriptArchived?: boolean;
  nextSessionId?: string;
  nextSessionKey?: string;
};
type PluginHookSubagentContext = {
  runId?: string;
  childSessionKey?: string;
  requesterSessionKey?: string;
};
type PluginHookSubagentTargetKind = "subagent" | "acp";
type PluginHookSubagentSpawnBase = {
  childSessionKey: string;
  agentId: string;
  label?: string;
  mode: "run" | "session";
  requester?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  threadRequested: boolean;
};
/**
 * @deprecated Core prepares thread-bound subagent bindings through channel
 * session-binding adapters before `subagent_spawned` fires. Use
 * `subagent_spawned` for post-launch observation in new plugins.
 */
type PluginHookSubagentSpawningEvent = PluginHookSubagentSpawnBase;
/**
 * @deprecated Core prepares thread-bound subagent bindings through channel
 * session-binding adapters before `subagent_spawned` fires. Returning routing
 * data from `subagent_spawning` is retained only for older runtimes.
 */
type PluginHookSubagentSpawningResult =
  | {
      status: "ok";
      /**
       * @deprecated Core now resolves thread-bound spawn routing from session
       * bindings and channel route projection. Keep returning this only for
       * compatibility with older OpenClaw runtimes.
       */
      threadBindingReady?: boolean;
      /**
       * @deprecated Use channel `resolveDeliveryTarget` plus core
       * `SessionBindingRecord` projection instead of returning an ad hoc
       * delivery route from this hook.
       */
      deliveryOrigin?: {
        channel?: string;
        accountId?: string;
        to?: string;
        threadId?: string | number;
      };
    }
  | {
      status: "error";
      error: string;
    };
type PluginHookSubagentDeliveryTargetEvent = {
  childSessionKey: string;
  requesterSessionKey: string;
  requesterOrigin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childRunId?: string;
  spawnMode?: "run" | "session";
  expectsCompletionMessage: boolean;
};
/**
 * @deprecated Core route projection resolves subagent delivery targets from
 * `SessionBindingRecord` and channel `resolveDeliveryTarget`. This hook result
 * remains for plugin compatibility during the transition.
 */
type PluginHookSubagentDeliveryTargetResult = {
  origin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
};
type PluginHookSubagentSpawnedEvent = PluginHookSubagentSpawnBase & {
  runId: string /** Fully resolved provider/model ref applied to the spawned child session. */;
  resolvedModel?: string /** Provider prefix parsed from resolvedModel when the ref includes one. */;
  resolvedProvider?: string;
};
type PluginHookSubagentEndedEvent = {
  targetSessionKey: string;
  targetKind: PluginHookSubagentTargetKind;
  reason: string;
  sendFarewell?: boolean;
  accountId?: string;
  runId?: string;
  endedAt?: number;
  outcome?: "ok" | "error" | "timeout" | "killed" | "reset" | "deleted";
  error?: string;
};
type PluginHookGatewayContext = {
  port?: number;
  config?: OpenClawConfig;
  workspaceDir?: string;
  getCron?: () => PluginHookGatewayCronService | undefined;
};
type PluginHookCronReconciledContext = PluginHookGatewayContext & {
  /** Aborts when this exact scheduler snapshot is superseded or the Gateway closes. */ abortSignal: AbortSignal;
};
type PluginHookGatewayStartEvent = {
  port: number;
};
type PluginHookGatewayStopEvent = {
  reason?: string;
};
type PluginHookCronReconciledEvent = {
  reason: "startup" | "reload";
  enabled: boolean;
};
type PluginHookGatewayCronRunStatus = "ok" | "error" | "skipped";
type PluginHookGatewayCronDeliveryStatus =
  | "not-requested"
  | "delivered"
  | "not-delivered"
  | "unknown";
type PluginHookGatewayCronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  lastRunStatus?: PluginHookGatewayCronRunStatus;
  lastError?: string;
  lastDurationMs?: number;
  lastDelivered?: boolean;
  lastDeliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  lastDeliveryError?: string;
  lastFailureNotificationDelivered?: boolean;
  lastFailureNotificationDeliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  lastFailureNotificationDeliveryError?: string;
};
type PluginHookGatewayCronJob = {
  id: string /** Agent id that owns this cron job. */;
  agentId?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  schedule?:
    | {
        kind: "cron";
        expr?: string;
        tz?: string;
        staggerMs?: number;
      }
    | {
        kind: "at";
        at?: string;
      }
    | {
        kind: "every";
        everyMs?: number;
        anchorMs?: number;
      }
    | {
        kind: "on-exit";
        command?: string;
        cwd?: string;
      };
  sessionTarget?: string;
  wakeMode?: string;
  payload?: {
    kind?: string;
    text?: string;
  };
  state?: PluginHookGatewayCronJobState;
  createdAtMs?: number;
  updatedAtMs?: number;
};
type PluginHookCronChangedEvent = {
  action: "added" | "updated" | "removed" | "started" | "finished" | "scheduled";
  jobId: string;
  job?: PluginHookGatewayCronJob /** Top-level session target for downstream routing (mirrors job.sessionTarget). */;
  sessionTarget?: string /** Agent id that owns this cron job (mirrors job.agentId). */;
  agentId?: string;
  runAtMs?: number;
  durationMs?: number;
  status?: PluginHookGatewayCronRunStatus;
  error?: string;
  summary?: string;
  delivered?: boolean;
  deliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  deliveryError?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
  nextRunAtMs?: number;
  model?: string;
  provider?: string;
};
type PluginHookGatewayCronCreateInput = {
  name: string;
  description: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr: string;
    tz?: string;
  };
  sessionTarget: string;
  wakeMode: string;
  payload: {
    kind: string;
    text?: string;
  };
};
type PluginHookGatewayCronUpdateInput = Partial<PluginHookGatewayCronCreateInput>;
type PluginHookGatewayCronRemoveResult = {
  removed?: boolean;
};
type PluginHookGatewayCronService = {
  list: (opts?: { includeDisabled?: boolean }) => Promise<PluginHookGatewayCronJob[]>;
  add: (input: PluginHookGatewayCronCreateInput) => Promise<unknown>;
  update: (id: string, patch: PluginHookGatewayCronUpdateInput) => Promise<unknown>;
  remove: (id: string) => Promise<PluginHookGatewayCronRemoveResult>;
};
type PluginInstallTargetType = "skill" | "plugin";
type PluginInstallRequestKind =
  | "skill-install"
  | "plugin-dir"
  | "plugin-archive"
  | "plugin-file"
  | "plugin-npm"
  | "plugin-git";
type PluginInstallSourcePathKind = "file" | "directory";
type PluginInstallFinding = {
  ruleId: string;
  severity: "info" | "warn" | "critical";
  file: string;
  line: number;
  message: string;
};
type PluginHookBeforeInstallRequest = {
  kind: PluginInstallRequestKind;
  mode: "install" | "update";
  requestedSpecifier?: string;
};
type PluginHookBeforeInstallBuiltinScan = {
  status: "ok" | "error";
  scannedFiles: number;
  critical: number;
  warn: number;
  info: number;
  findings: PluginInstallFinding[];
  error?: string;
};
type PluginHookBeforeInstallSkillInstallSpec = {
  id?: string;
  kind: "brew" | "node" | "go" | "uv" | "download";
  label?: string;
  bins?: string[];
  os?: string[];
  formula?: string;
  package?: string;
  module?: string;
  url?: string;
  archive?: string;
  extract?: boolean;
  stripComponents?: number;
  targetDir?: string;
};
type PluginHookBeforeInstallSkill = {
  installId: string;
  installSpec?: PluginHookBeforeInstallSkillInstallSpec;
};
type PluginHookBeforeInstallPlugin = {
  pluginId: string;
  contentType: "bundle" | "package" | "file";
  packageName?: string;
  manifestId?: string;
  version?: string;
  extensions?: string[];
};
type PluginHookBeforeInstallContext = {
  targetType: PluginInstallTargetType;
  requestKind: PluginInstallRequestKind;
  origin?: string;
};
type PluginHookBeforeInstallEvent = {
  targetType: PluginInstallTargetType;
  targetName: string;
  sourcePath: string;
  sourcePathKind: PluginInstallSourcePathKind;
  origin?: string;
  request: PluginHookBeforeInstallRequest;
  builtinScan: PluginHookBeforeInstallBuiltinScan;
  skill?: PluginHookBeforeInstallSkill;
  plugin?: PluginHookBeforeInstallPlugin;
};
type PluginHookBeforeInstallResult = {
  findings?: PluginInstallFinding[];
  block?: boolean;
  blockReason?: string;
};
/** Event payload for the before_agent_run gate hook. */
type PluginHookBeforeAgentRunEvent = {
  /** The user's message that triggered this run. */ prompt: string /** Loaded session history before the current prompt is submitted. */;
  messages: unknown[] /** Active system prompt prepared for this run. */;
  systemPrompt?: string /** Account identity when available. */;
  accountId?: string /** Channel the message came from. */;
  channelId?: string /** Sender identity when available. */;
  senderId?: string /** Trusted sender identity bit when available. */;
  senderIsOwner?: boolean;
};
/** Result type for before_agent_run. Returns pass/block or void (= pass). */
type PluginHookBeforeAgentRunResult = InputGateDecision | void;
type PluginHookResolveExecEnvEvent = {
  sessionKey?: string;
  toolName: "exec";
  host: "gateway" | "sandbox" | "node";
};
type PluginHookResolveExecEnvContext = PluginHookAgentContext;
type PluginHookHandlerMap = {
  agent_turn_prepare: (
    event: PluginAgentTurnPrepareEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<PluginAgentTurnPrepareResult | void> | PluginAgentTurnPrepareResult | void;
  before_model_resolve: (
    event: PluginHookBeforeModelResolveEvent,
    ctx: PluginHookAgentContext,
  ) =>
    | Promise<PluginHookBeforeModelResolveResult | void>
    | PluginHookBeforeModelResolveResult
    | void;
  before_prompt_build: (
    event: PluginHookBeforePromptBuildEvent,
    ctx: PluginHookAgentContext,
  ) =>
    | Promise<PluginHookBeforePromptBuildResult | void>
    | PluginHookBeforePromptBuildResult
    | void /** @deprecated Use before_model_resolve and before_prompt_build. */;
  before_agent_start: (
    event: PluginHookBeforeAgentStartEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<PluginHookBeforeAgentStartResult | void> | PluginHookBeforeAgentStartResult | void;
  before_agent_reply: (
    event: PluginHookBeforeAgentReplyEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<PluginHookBeforeAgentReplyResult | void> | PluginHookBeforeAgentReplyResult | void;
  model_call_started: (
    event: PluginHookModelCallStartedEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<void> | void;
  model_call_ended: (
    event: PluginHookModelCallEndedEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<void> | void;
  llm_input: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  llm_output: (
    event: PluginHookLlmOutputEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<void> | void;
  before_agent_finalize: (
    event: PluginHookBeforeAgentFinalizeEvent,
    ctx: PluginHookAgentContext,
  ) =>
    | Promise<PluginHookBeforeAgentFinalizeResult | void>
    | PluginHookBeforeAgentFinalizeResult
    | void;
  agent_end: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_compaction: (
    event: PluginHookBeforeCompactionEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<void> | void;
  after_compaction: (
    event: PluginHookAfterCompactionEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<void> | void;
  before_reset: (
    event: PluginHookBeforeResetEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<void> | void;
  inbound_claim: (
    event: PluginHookInboundClaimEvent,
    ctx: PluginHookInboundClaimContext,
  ) => Promise<PluginHookInboundClaimResult | void> | PluginHookInboundClaimResult | void;
  channel_pairing_requested: (
    event: PluginHookChannelPairingRequestedEvent,
    ctx: PluginHookChannelPairingContext,
  ) => Promise<void> | void;
  before_dispatch: (
    event: PluginHookBeforeDispatchEvent,
    ctx: PluginHookBeforeDispatchContext,
  ) => Promise<PluginHookBeforeDispatchResult | void> | PluginHookBeforeDispatchResult | void;
  reply_dispatch: (
    event: PluginHookReplyDispatchEvent,
    ctx: PluginHookReplyDispatchContext,
  ) => Promise<PluginHookReplyDispatchResult | void> | PluginHookReplyDispatchResult | void;
  reply_payload_sending: (
    event: PluginHookReplyPayloadSendingEvent,
    ctx: PluginHookReplyPayloadSendingContext,
  ) =>
    | Promise<PluginHookReplyPayloadSendingResult | void>
    | PluginHookReplyPayloadSendingResult
    | void;
  message_received: (
    event: PluginHookMessageReceivedEvent,
    ctx: PluginHookMessageContext,
  ) => Promise<void> | void;
  message_sending: (
    event: PluginHookMessageSendingEvent,
    ctx: PluginHookMessageContext,
  ) => Promise<PluginHookMessageSendingResult | void> | PluginHookMessageSendingResult | void;
  message_sent: (
    event: PluginHookMessageSentEvent,
    ctx: PluginHookMessageContext,
  ) => Promise<void> | void;
  before_tool_call: (
    event: PluginHookBeforeToolCallEvent,
    ctx: PluginHookToolContext,
  ) => Promise<PluginHookBeforeToolCallResult | void> | PluginHookBeforeToolCallResult | void;
  after_tool_call: (
    event: PluginHookAfterToolCallEvent,
    ctx: PluginHookToolContext,
  ) => Promise<void> | void;
  tool_result_persist: (
    event: PluginHookToolResultPersistEvent,
    ctx: PluginHookToolResultPersistContext,
  ) => PluginHookToolResultPersistResult | void;
  before_message_write: (
    event: PluginHookBeforeMessageWriteEvent,
    ctx: {
      agentId?: string;
      sessionKey?: string;
    },
  ) => PluginHookBeforeMessageWriteResult | void;
  session_start: (
    event: PluginHookSessionStartEvent,
    ctx: PluginHookSessionContext,
  ) => Promise<void> | void;
  session_end: (
    event: PluginHookSessionEndEvent,
    ctx: PluginHookSessionContext,
  ) => Promise<void> | void;
  /**
   * @deprecated Core prepares thread-bound subagent bindings through channel
   * session-binding adapters before `subagent_spawned` fires. Use
   * `subagent_spawned` for post-launch observation in new plugins.
   */
  subagent_spawning: (
    event: PluginHookSubagentSpawningEvent,
    ctx: PluginHookSubagentContext,
  ) => Promise<PluginHookSubagentSpawningResult | void> | PluginHookSubagentSpawningResult | void;
  subagent_delivery_target: (
    event: PluginHookSubagentDeliveryTargetEvent,
    ctx: PluginHookSubagentContext,
  ) =>
    | Promise<PluginHookSubagentDeliveryTargetResult | void>
    | PluginHookSubagentDeliveryTargetResult
    | void;
  subagent_spawned: (
    event: PluginHookSubagentSpawnedEvent,
    ctx: PluginHookSubagentContext,
  ) => Promise<void> | void;
  subagent_ended: (
    event: PluginHookSubagentEndedEvent,
    ctx: PluginHookSubagentContext,
  ) => Promise<void> | void;
  /**
   * Deprecated compatibility alias for gateway_stop.
   *
   * New plugins should register gateway_stop directly; the loader normalizes
   * deactivate registrations onto gateway_stop so cleanup handlers still run
   * during Gateway shutdown.
   *
   * @deprecated Use gateway_stop.
   */
  deactivate: (
    event: PluginHookGatewayStopEvent,
    ctx: PluginHookGatewayContext,
  ) => Promise<void> | void;
  gateway_start: (
    event: PluginHookGatewayStartEvent,
    ctx: PluginHookGatewayContext,
  ) => Promise<void> | void;
  gateway_stop: (
    event: PluginHookGatewayStopEvent,
    ctx: PluginHookGatewayContext,
  ) => Promise<void> | void;
  heartbeat_prompt_contribution: (
    event: PluginHeartbeatPromptContributionEvent,
    ctx: PluginHookAgentContext,
  ) =>
    | Promise<PluginHeartbeatPromptContributionResult | void>
    | PluginHeartbeatPromptContributionResult
    | void;
  cron_reconciled: (
    event: PluginHookCronReconciledEvent,
    ctx: PluginHookCronReconciledContext,
  ) => Promise<void> | void;
  cron_changed: (
    event: PluginHookCronChangedEvent,
    ctx: PluginHookGatewayContext,
  ) => Promise<void> | void;
  before_install: (
    event: PluginHookBeforeInstallEvent,
    ctx: PluginHookBeforeInstallContext,
  ) => Promise<PluginHookBeforeInstallResult | void> | PluginHookBeforeInstallResult | void;
  before_agent_run: (
    event: PluginHookBeforeAgentRunEvent,
    ctx: PluginHookAgentContext,
  ) => Promise<PluginHookBeforeAgentRunResult> | PluginHookBeforeAgentRunResult;
  resolve_exec_env: (
    event: PluginHookResolveExecEnvEvent,
    ctx: PluginHookResolveExecEnvContext,
  ) => Promise<Record<string, string> | void> | Record<string, string> | void;
};
type PluginHookRegistration<K extends PluginHookName = PluginHookName> = {
  pluginId: string;
  hookName: K;
  handler: PluginHookHandlerMap[K];
  priority?: number;
  timeoutMs?: number;
  source: string;
};
//#endregion
export {
  PluginHookLlmOutputEvent as $,
  PluginHookMessageReceivedEvent as $t,
  PluginHookBeforeMessageWriteEvent as A,
  PluginHookToolResultPersistContext as At,
  PluginHookGatewayCronCreateInput as B,
  isPluginHookName as Bt,
  PluginHookBeforeInstallContext as C,
  ReplyFollowupAdmissionBarrierTimeoutPolicy as Cn,
  PluginHookSubagentSpawnedEvent as Ct,
  PluginHookBeforeInstallResult as D,
  PluginHookToolContext as Dt,
  PluginHookBeforeInstallRequest as E,
  PluginHookSubagentTargetKind as Et,
  PluginHookCronChangedEvent as F,
  PluginInstallSourcePathKind as Ft,
  PluginHookGatewayCronRunStatus as G,
  PluginHeartbeatPromptContributionResult as Gt,
  PluginHookGatewayCronJob as H,
  PluginAgentTurnPrepareEvent as Ht,
  PluginHookCronReconciledContext as I,
  PluginInstallTargetType as It,
  PluginHookGatewayStartEvent as J,
  PluginNextTurnInjectionRecord as Jt,
  PluginHookGatewayCronService as K,
  PluginNextTurnInjection as Kt,
  PluginHookCronReconciledEvent as L,
  PromptInjectionHookName as Lt,
  PluginHookBeforeResetEvent as M,
  PluginHookToolResultPersistResult as Mt,
  PluginHookBeforeToolCallEvent as N,
  PluginInstallFinding as Nt,
  PluginHookBeforeInstallSkill as O,
  PluginHookToolInputKind as Ot,
  PluginHookContextWindowSource as P,
  PluginInstallRequestKind as Pt,
  PluginHookLlmInputEvent as Q,
  PluginHookMessageContext as Qt,
  PluginHookDeprecation as R,
  isConversationHookName as Rt,
  PluginHookBeforeInstallBuiltinScan as S,
  ReplyDispatcher as Sn,
  PluginHookSubagentEndedEvent as St,
  PluginHookBeforeInstallPlugin as T,
  PluginHookSubagentSpawningResult as Tt,
  PluginHookGatewayCronJobState as U,
  PluginAgentTurnPrepareResult as Ut,
  PluginHookGatewayCronDeliveryStatus as V,
  isPromptInjectionHookName as Vt,
  PluginHookGatewayCronRemoveResult as W,
  PluginHeartbeatPromptContributionEvent as Wt,
  PluginHookHandlerMap as X,
  PluginHookInboundClaimContext as Xt,
  PluginHookGatewayStopEvent as Y,
  PluginJsonValue as Yt,
  PluginHookInboundClaimResult as Z,
  PluginHookInboundClaimEvent as Zt,
  PluginHookBeforeAgentRunResult as _,
  stripPromptMutationFieldsFromLegacyHookResult as _n,
  PluginHookSessionEndReason as _t,
  DeprecatedPluginHookName as a,
  PluginApprovalResolution as an,
  PluginHookReplyDispatchContext as at,
  PluginHookBeforeDispatchEvent as b,
  ReplyDispatchKind as bn,
  PluginHookSubagentDeliveryTargetEvent as bt,
  PluginHookAfterCompactionEvent as c,
  PLUGIN_PROMPT_MUTATION_RESULT_FIELDS as cn,
  PluginHookReplyPayload as ct,
  PluginHookAgentEndEvent as d,
  PluginHookBeforeAgentStartResult as dn,
  PluginHookReplyPayloadSendingResult as dt,
  PluginHookMessageSendingEvent as en,
  PluginHookModelCallBaseEvent as et,
  PluginHookBeforeAgentFinalizeEvent as f,
  PluginHookBeforeModelResolveAttachment as fn,
  PluginHookReplyUsageState as ft,
  PluginHookBeforeAgentRunEvent as g,
  PluginHookBeforePromptBuildResult as gn,
  PluginHookSessionEndEvent as gt,
  PluginHookBeforeAgentReplyResult as h,
  PluginHookBeforePromptBuildEvent as hn,
  PluginHookSessionContext as ht,
  DEPRECATED_PLUGIN_HOOK_NAMES as i,
  InputGateDecision as in,
  PluginHookRegistration as it,
  PluginHookBeforeMessageWriteResult as j,
  PluginHookToolResultPersistEvent as jt,
  PluginHookBeforeInstallSkillInstallSpec as k,
  PluginHookToolKind as kt,
  PluginHookAfterToolCallEvent as l,
  PluginHookBeforeAgentStartEvent as ln,
  PluginHookReplyPayloadSendingContext as lt,
  PluginHookBeforeAgentReplyEvent as m,
  PluginHookBeforeModelResolveResult as mn,
  PluginHookResolveExecEnvEvent as mt,
  ConversationHookName as n,
  PluginHookMessageSentEvent as nn,
  PluginHookModelCallStartedEvent as nt,
  PLUGIN_HOOK_NAMES as o,
  PluginApprovalResolutions as on,
  PluginHookReplyDispatchEvent as ot,
  PluginHookBeforeAgentFinalizeResult as p,
  PluginHookBeforeModelResolveEvent as pn,
  PluginHookResolveExecEnvContext as pt,
  PluginHookGatewayCronUpdateInput as q,
  PluginNextTurnInjectionEnqueueResult as qt,
  DEPRECATED_PLUGIN_HOOKS as r,
  GateHookResult as rn,
  PluginHookName as rt,
  PROMPT_INJECTION_HOOK_NAMES as s,
  PluginHookBeforeToolCallResult as sn,
  PluginHookReplyDispatchResult as st,
  CONVERSATION_HOOK_NAMES as t,
  PluginHookMessageSendingResult as tn,
  PluginHookModelCallEndedEvent as tt,
  PluginHookAgentContext as u,
  PluginHookBeforeAgentStartOverrideResult as un,
  PluginHookReplyPayloadSendingEvent as ut,
  PluginHookBeforeCompactionEvent as v,
  ReplyDispatchBeforeDeliver as vn,
  PluginHookSessionStartEvent as vt,
  PluginHookBeforeInstallEvent as w,
  PluginHookSubagentSpawningEvent as wt,
  PluginHookBeforeDispatchResult as x,
  ReplyDispatchRuntimeInfo as xn,
  PluginHookSubagentDeliveryTargetResult as xt,
  PluginHookBeforeDispatchContext as y,
  ReplyDispatchBeforeDeliverOptions as yn,
  PluginHookSubagentContext as yt,
  PluginHookGatewayContext as z,
  isDeprecatedPluginHookName as zt,
};
