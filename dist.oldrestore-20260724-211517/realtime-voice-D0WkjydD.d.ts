import { randomUUID } from "node:crypto";
import {
  $t as TalkEventInput,
  Qt as TalkEventContext,
  Zt as TalkEvent,
  en as TalkEventSequencer,
  r as DiagnosticEventInput,
} from "./diagnostic-events-CKz1uC46.js";
import { n as EmbeddedAgentQueueMessageOutcome } from "./runs-DpmUlAWl.js";
import {
  Ca as RealtimeVoiceBridge,
  Ea as RealtimeVoiceBridgeEvent,
  Fa as RealtimeVoiceRole,
  Ia as RealtimeVoiceTool,
  La as RealtimeVoiceToolCallEvent,
  Na as RealtimeVoiceProviderId,
  Ra as RealtimeVoiceToolResultOptions,
  Sa as RealtimeVoiceBargeInOptions,
  Tu as RunEmbeddedAgentParams,
  Wn as RealtimeVoiceProviderPlugin,
  Xc as PluginRuntimeCore,
  Zc as RuntimeLogger,
  ba as RealtimeVoiceAudioClearReason,
  ja as RealtimeVoiceProviderConfig,
  ka as RealtimeVoiceCloseReason,
  xa as RealtimeVoiceAudioFormat,
} from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/talk/diagnostics.d.ts
type TalkDiagnosticEventInput = Extract<
  DiagnosticEventInput,
  {
    type: "talk.event";
  }
>;
/** Convert a Talk event into the bounded diagnostic payload shape. */
declare function createTalkDiagnosticEvent(event: TalkEvent): TalkDiagnosticEventInput;
/** Emit a trusted internal diagnostic event for one Talk event. */
declare function recordTalkDiagnosticEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/logging.d.ts
/**
 * Log severity produced from Talk event envelopes.
 */
type TalkLogLevel = "info" | "warn";
/**
 * Compact structured log record for a non-noisy Talk event.
 */
type TalkLogRecord = {
  level: TalkLogLevel;
  message: string;
  attributes: Record<string, string | number | boolean>;
};
/**
 * Converts high-level Talk events into compact structured log records, skipping noisy deltas.
 */
declare function createTalkLogRecord(event: TalkEvent): TalkLogRecord | undefined;
/**
 * Emits Talk logs best-effort so logging failures never break realtime audio handling.
 */
declare function recordTalkLogEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/observability.d.ts
/** Record one Talk event through diagnostics and logging projections. */
declare function recordTalkObservabilityEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/talk-session-controller.d.ts
/**
 * Why a turn-scoped Talk operation could not emit an event.
 */
type TalkTurnFailureReason = "no_active_turn" | "stale_turn";
/**
 * Successful turn operation with the emitted Talk event.
 */
type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};
/**
 * Failed turn operation when the requested turn does not match controller state.
 */
type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};
/**
 * Result for ending or cancelling an active Talk turn.
 */
type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;
/**
 * Result for operations that ensure a turn exists and may emit a start event.
 */
type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};
/**
 * Stateful Talk event controller for one session's turns, output audio, and recent event buffer.
 */
type TalkSessionController = {
  readonly activeTurnId: string | undefined;
  readonly context: TalkEventContext;
  readonly outputAudioActive: boolean;
  readonly recentEvents: readonly TalkEvent[];
  clearActiveTurn(): void;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(params?: { payload?: unknown; turnId?: string }): TalkEnsureTurnResult;
  startTurn(params?: { payload?: unknown; turnId?: string }): TalkEnsureTurnResult;
  endTurn(params?: { payload?: unknown; turnId?: string }): TalkTurnResult;
  cancelTurn(params?: { payload?: unknown; turnId?: string }): TalkTurnResult;
  finishOutputAudio(params?: { payload?: unknown; turnId?: string }): TalkEvent | undefined;
  startOutputAudio(params?: { payload?: unknown; turnId?: string }): TalkEnsureTurnResult;
};
/**
 * Session context plus controller retention settings.
 */
type TalkSessionControllerParams = TalkEventContext & {
  maxRecentEvents?: number;
  turnIdPrefix?: string;
};
/**
 * Optional controller hooks and sequencer overrides for tests and observers.
 */
type TalkSessionControllerOptions = {
  now?: () => Date | string;
  onEvent?: (event: TalkEvent) => void;
  sequencer?: TalkEventSequencer;
};
/**
 * Creates a per-session Talk controller that emits correlated turn and output-audio events.
 */
declare function createTalkSessionController(
  params: TalkSessionControllerParams,
  options?: TalkSessionControllerOptions,
): TalkSessionController;
/**
 * Normalizes legacy realtime transport names into Talk transport families.
 */
declare function normalizeTalkTransport(value: string | undefined): string | undefined;
//#endregion
//#region src/talk/activation-name.d.ts
declare const REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS = 2;
/** Transcript edge where an activation name was heard. */
type RealtimeVoiceActivationNameEdge = "leading" | "trailing";
/** Whether the heard name matched exactly or through the guarded fuzzy path. */
type RealtimeVoiceActivationNameMatchKind = "exact" | "fuzzy";
/** Activation-name match result plus transcript text with the name removed. */
type RealtimeVoiceActivationNameTranscriptResult =
  | {
      allowed: true;
      text: string;
      activationName: string;
      heardName: string;
      match: RealtimeVoiceActivationNameMatchKind;
      edge: RealtimeVoiceActivationNameEdge;
    }
  | {
      allowed: false;
      text: string;
    };
/** Count alphanumeric words in a configured activation name. */
declare function realtimeVoiceActivationNameWordCount(value: string): number;
/** Normalize configured activation names while preserving word boundaries. */
declare function normalizeRealtimeVoiceActivationName(value: string): string | undefined;
/** Extract the supported leading activation-name prefix from a longer phrase. */
declare function normalizeRealtimeVoiceActivationNamePrefix(
  value: string,
  maxWords?: number,
): string | undefined;
/** Validate the configured activation name length bound. */
declare function isSupportedRealtimeVoiceActivationName(value: string, maxWords?: number): boolean;
/** Normalize and reject unsupported activation names in one reusable step. */
declare function normalizeSupportedRealtimeVoiceActivationName(
  value: string | undefined,
  maxWords?: number,
): string | undefined;
/** Prefer longer names first so nested names match the most specific option. */
declare function sortRealtimeVoiceActivationNames(names: string[]): string[];
/** Match and strip a configured activation name from either transcript edge. */
declare function matchRealtimeVoiceActivationName(
  text: string,
  activationNames: string[],
  maxWords?: number,
):
  | Extract<
      RealtimeVoiceActivationNameTranscriptResult,
      {
        allowed: true;
      }
    >
  | undefined;
//#endregion
//#region src/talk/consult-transcript.d.ts
/** Reason a transcript should be ignored before creating a consult request. */
type SkippableRealtimeVoiceConsultTranscriptReason =
  | "empty"
  | "incomplete-transcript"
  | "trailing-fragment"
  | "non-actionable-closing";
/** Classify transcript text that is empty, incomplete, fragmented, or non-actionable. */
declare function classifySkippableRealtimeVoiceConsultTranscript(
  text: string,
): SkippableRealtimeVoiceConsultTranscriptReason | undefined;
//#endregion
//#region src/talk/consult-question.d.ts
type RealtimeVoiceConsultQuestionMatchOptions = {
  /** Minimum overlap ratio against the smaller token set for fuzzy matches. */ minTokenOverlapRatio?: number /** Minimum number of non-stopword tokens that must overlap. */;
  minTokenOverlapCount?: number;
};
type RealtimeVoiceSpeakableToolResultOptions = {
  /** Candidate result keys to read from object-shaped tool output. */ keys?: readonly string[] /** Maximum spoken result length before appending a truncation marker. */;
  maxChars?: number /** Whether a raw string result is allowed as speakable output. */;
  stringResult?: boolean;
};
/** Read the consult question from a raw string or selected object keys. */
declare function readRealtimeVoiceConsultQuestion(
  args: unknown,
  keys?: readonly string[],
): string | undefined;
/** Normalize consult questions for stable matching across punctuation/casing. */
declare function normalizeRealtimeVoiceConsultQuestion(
  value: string | undefined,
): string | undefined;
/** Compare two consult questions with exact, containment, and token-overlap matching. */
declare function matchRealtimeVoiceConsultQuestions(
  left: string | undefined,
  right: string | undefined,
  options?: RealtimeVoiceConsultQuestionMatchOptions,
): boolean;
/** Extract a bounded speakable string from a tool result payload. */
declare function readSpeakableRealtimeVoiceToolResult(
  result: unknown,
  options?: RealtimeVoiceSpeakableToolResultOptions,
): string | undefined;
//#endregion
//#region src/talk/forced-consult-coordinator.d.ts
/** Timer abstraction used so tests can inject deterministic fake timers. */
type RealtimeVoiceForcedConsultTimer = {
  clear(): void;
};
/** Coordinator tuning and injectable clock/timer/matcher hooks. */
type RealtimeVoiceForcedConsultCoordinatorOptions = {
  limit?: number /** Window for matching late native consults to forced consult handles. */;
  nativeDedupeMs?: number;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => RealtimeVoiceForcedConsultTimer;
  questionsMatch?: (left: string | undefined, right: string | undefined) => boolean;
};
/** Stable handle for one forced consult lifecycle. */
type RealtimeVoiceForcedConsultHandle<TContext = unknown> = {
  id: string;
  question: string;
  context?: TContext;
};
/** Classification of a native provider consult relative to forced consult state. */
type RealtimeVoiceForcedConsultNativeMatch<TContext = unknown> =
  | {
      kind: "none";
      question?: string;
    }
  | {
      kind: "pending";
      question?: string;
      handle: RealtimeVoiceForcedConsultHandle<TContext>;
    }
  | {
      kind: "in_flight";
      question?: string;
      handle: RealtimeVoiceForcedConsultHandle<TContext>;
    }
  | {
      kind: "already_delivered";
      question?: string;
      handle: RealtimeVoiceForcedConsultHandle<TContext>;
    };
type RealtimeVoiceForcedConsultNativeRecentOptions = {
  /** Treat native calls without readable questions as recent generic consults. */ allowUnknownQuestion?: boolean;
};
/** Public state machine for forced/native consult dedupe in a voice session. */
type RealtimeVoiceForcedConsultCoordinator<TContext = unknown> = {
  prepare(
    question: string,
    options?: {
      context?: TContext;
      id?: string;
    },
  ): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  schedule(
    handle: RealtimeVoiceForcedConsultHandle<TContext>,
    delayMs: number,
    run: (handle: RealtimeVoiceForcedConsultHandle<TContext>) => void,
  ): void;
  clearPending(): void;
  consumePending(question?: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  cancelPending(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  recordNativeConsult(
    args: unknown,
    nativeCallId?: string,
  ): RealtimeVoiceForcedConsultNativeMatch<TContext>;
  markStarted(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markDelivered(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  isCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): boolean;
  nativeCallIds(handle: RealtimeVoiceForcedConsultHandle<TContext>): readonly string[];
  handles(): readonly RealtimeVoiceForcedConsultHandle<TContext>[];
  rememberQuestion(handle: RealtimeVoiceForcedConsultHandle<TContext>, question: string): void;
  findRecent(question: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  hasRecent(question: string): boolean;
  hasRecentNativeConsult(
    question: string,
    options?: RealtimeVoiceForcedConsultNativeRecentOptions,
  ): boolean;
  remove(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  clear(): void;
};
/** Create an in-memory forced-consult coordinator for one realtime session. */
declare function createRealtimeVoiceForcedConsultCoordinator<TContext = unknown>(
  options?: RealtimeVoiceForcedConsultCoordinatorOptions,
): RealtimeVoiceForcedConsultCoordinator<TContext>;
//#endregion
//#region src/talk/turn-context-tracker.d.ts
/**
 * Retention and clock controls for realtime voice turn context tracking.
 */
type RealtimeVoiceTurnContextTrackerOptions = {
  limit?: number;
  ignoredContextTtlMs?: number;
  now?: () => number;
  deferUntilAudio?: boolean;
};
/**
 * Mutable handle for a single realtime voice turn and caller-owned per-turn metadata.
 */
type RealtimeVoiceTurnContextHandle<
  TContext,
  TExtra extends object = Record<never, never>,
> = TExtra & {
  id: string;
  context: TContext;
  hasAudio: boolean;
  closed: boolean;
  startedAt: number;
  lastAudioAt?: number;
};
type RealtimeVoiceTurnContextOpenArgs<TExtra extends object> = keyof TExtra extends never
  ? [extra?: TExtra]
  : [extra: TExtra];
/**
 * Tracks which realtime voice turn context should be attached to the next audio-bearing response.
 */
type RealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>> = {
  open(
    context: TContext,
    ...extra: RealtimeVoiceTurnContextOpenArgs<TExtra>
  ): RealtimeVoiceTurnContextHandle<TContext, TExtra>;
  markAudio(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
  close(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
  consumeAudioContext(): TContext | undefined;
  peekAudioTurn(): RealtimeVoiceTurnContextHandle<TContext, TExtra> | undefined;
  hasAudioContext(): boolean;
  rememberIgnoredContext(context: TContext | undefined): void;
  consumeIgnoredContext(): TContext | undefined;
  size(): number;
  clear(): void;
};
declare function createRealtimeVoiceTurnContextTracker<
  TContext,
  TExtra extends object = Record<never, never>,
>(
  options?: RealtimeVoiceTurnContextTrackerOptions,
): RealtimeVoiceTurnContextTracker<TContext, TExtra>;
//#endregion
//#region src/talk/output-activity-tracker.d.ts
/**
 * Realtime voice output activity counters and playback-state tracking.
 *
 * Providers use this to decide whether assistant output is active,
 * interruptible, or overdue relative to the audio duration already emitted.
 */
type RealtimeVoiceOutputActivityTrackerOptions = {
  /** Injectable clock for deterministic tests and playback watchdog math. */ now?: () => number;
};
/** One output activity increment from source audio and/or sink audio. */
type RealtimeVoiceOutputActivityDelta = {
  audioMs?: number;
  sourceAudioBytes?: number;
  sinkAudioBytes?: number;
};
/** Current output counters and playback timestamps. */
type RealtimeVoiceOutputActivitySnapshot = {
  audioMs: number;
  chunks: number;
  sourceAudioBytes: number;
  sinkAudioBytes: number;
  playbackStarted: boolean;
  streamEnding: boolean;
  lastAudioAt?: number;
  playbackStartedAt?: number;
};
/** Mutable tracker for one realtime voice output stream. */
type RealtimeVoiceOutputActivityTracker = {
  markStreamOpened(): void;
  markStreamEnding(): void;
  markPlaybackStarted(): void;
  markAudio(delta: RealtimeVoiceOutputActivityDelta): void;
  reset(): void /** Whether output exists or the downstream sink reports active playback. */;
  isActive(
    sinkActive?: boolean,
  ): boolean /** Whether caller speech should be treated as interrupting current output. */;
  isInterruptible(sinkActive?: boolean): boolean;
  elapsedPlaybackMs(): number /** Delay before watchdog should assume playback has exceeded expected audio duration. */;
  playbackWatchdogDelayMs(options: { marginMs: number; minMs?: number }): number | undefined;
  snapshot(): RealtimeVoiceOutputActivitySnapshot;
};
/** Create a fresh output activity tracker for a realtime voice session. */
declare function createRealtimeVoiceOutputActivityTracker(
  options?: RealtimeVoiceOutputActivityTrackerOptions,
): RealtimeVoiceOutputActivityTracker;
//#endregion
//#region src/talk/agent-consult-tool.d.ts
/** Stable provider-facing tool name for realtime voice agent delegation. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME = "openclaw_agent_consult";
/** Closed policy set controlling whether the consult tool is exposed. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly [
  "safe-read-only",
  "owner",
  "none",
];
/** Tool exposure policy for the shared realtime voice consult tool. */
type RealtimeVoiceAgentConsultToolPolicy =
  (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
/** Normalized tool-call arguments accepted from realtime providers. */
type RealtimeVoiceAgentConsultArgs = {
  question: string;
  context?: string;
  responseStyle?: string;
};
/** Compact transcript entry included in delegated agent prompts. */
type RealtimeVoiceAgentConsultTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};
/** Shared realtime voice function-tool descriptor projected to providers. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL: RealtimeVoiceTool;
/** Build the interim spoken instruction while the delegated agent turn runs. */
declare function buildRealtimeVoiceAgentConsultWorkingResponse(
  audienceLabel?: string,
): Record<string, unknown>;
/** Type guard for user/config supplied consult tool policies. */
declare function isRealtimeVoiceAgentConsultToolPolicy(
  value: unknown,
): value is RealtimeVoiceAgentConsultToolPolicy;
/** Normalize a configured consult tool policy with a caller-owned fallback. */
declare function resolveRealtimeVoiceAgentConsultToolPolicy(
  value: unknown,
  fallback: RealtimeVoiceAgentConsultToolPolicy,
): RealtimeVoiceAgentConsultToolPolicy;
/** Merge the shared consult tool with provider/plugin custom realtime tools. */
declare function resolveRealtimeVoiceAgentConsultTools(
  policy: RealtimeVoiceAgentConsultToolPolicy,
  customTools?: RealtimeVoiceTool[],
): RealtimeVoiceTool[];
/** Resolve the OpenClaw tool allowlist paired with the consult exposure policy. */
declare function resolveRealtimeVoiceAgentConsultToolsAllow(
  policy: RealtimeVoiceAgentConsultToolPolicy,
): string[] | undefined;
/** Build model instructions for when the voice agent should call the consult tool. */
declare function buildRealtimeVoiceAgentConsultPolicyInstructions(config: {
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  consultPolicy?: "auto" | "substantive" | "always";
}): string | undefined;
/** Parse provider-owned consult tool arguments into the normalized contract. */
declare function parseRealtimeVoiceAgentConsultArgs(args: unknown): RealtimeVoiceAgentConsultArgs;
/** Build the plain chat message used by browser/chat forwarding paths. */
declare function buildRealtimeVoiceAgentConsultChatMessage(args: unknown): string;
/** Build the delegated OpenClaw agent prompt for a live voice consult. */
declare function buildRealtimeVoiceAgentConsultPrompt(params: {
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
}): string;
/** Collect only visible answer text from streamed delegated-agent payloads. */
declare function collectRealtimeVoiceAgentConsultVisibleText(
  payloads: Array<{
    text?: unknown;
    isError?: boolean;
    isReasoning?: boolean;
    isCommentary?: boolean;
  }>,
): string | null;
//#endregion
//#region src/talk/agent-consult-runtime.d.ts
/**
 * Agent runtime surface used by realtime voice consults.
 */
type RealtimeVoiceAgentConsultRuntime = PluginRuntimeCore["agent"];
/**
 * Speakable text returned to the realtime voice bridge after an agent consult.
 */
type RealtimeVoiceAgentConsultResult = {
  text: string;
};
/**
 * Controls whether voice consults run in a fresh session or fork context from the requester.
 */
type RealtimeVoiceAgentConsultContextMode = "isolated" | "fork";
/**
 * Fails closed when a realtime consult would cross a model-selection lock.
 */
declare function assertRealtimeVoiceAgentConsultModelSelectionUnlocked(params: {
  cfg: OpenClawConfig;
  agentRuntime: RealtimeVoiceAgentConsultRuntime;
  agentId: string;
  sessionKey: string;
  spawnedBy?: string | null;
  storePath?: string;
}): void;
/**
 * Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
 */
declare function consultRealtimeVoiceAgent(params: {
  cfg: OpenClawConfig;
  agentRuntime: RealtimeVoiceAgentConsultRuntime;
  logger: Pick<RuntimeLogger, "warn">;
  sessionKey: string;
  messageProvider: string;
  lane: string;
  runIdPrefix: string;
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
  agentId?: string;
  spawnedBy?: string | null;
  contextMode?: RealtimeVoiceAgentConsultContextMode;
  provider?: RunEmbeddedAgentParams["provider"];
  model?: RunEmbeddedAgentParams["model"];
  thinkLevel?: RunEmbeddedAgentParams["thinkLevel"];
  fastMode?: RunEmbeddedAgentParams["fastMode"];
  timeoutMs?: number;
  toolsAllow?: string[];
  extraSystemPrompt?: string;
  fallbackText?: string;
}): Promise<RealtimeVoiceAgentConsultResult>;
//#endregion
//#region src/talk/agent-talkback-runtime.d.ts
/** Text produced by a delegated voice consult. */
type RealtimeVoiceAgentTalkbackResult = {
  text: string;
};
/** Minimal queue API owned by a realtime voice session. */
type RealtimeVoiceAgentTalkbackQueue = {
  close(): void;
  enqueue(question: string, metadata?: unknown): void;
};
/** Runtime dependencies and policy knobs for the talkback queue. */
type RealtimeVoiceAgentTalkbackQueueParams = {
  /** Delay used to merge nearby transcript fragments into one consult. */ debounceMs: number;
  isStopped: () => boolean;
  logger: Pick<RuntimeLogger, "info" | "warn">;
  logPrefix: string;
  responseStyle: string;
  fallbackText: string /** Delegates a batched question to OpenClaw and respects the abort signal. */;
  consult: (args: {
    question: string;
    metadata?: unknown;
    responseStyle: string;
    signal: AbortSignal;
  }) => Promise<RealtimeVoiceAgentTalkbackResult> /** Delivers final speakable text back to the realtime provider/session. */;
  deliver: (text: string) => void;
};
/** Create a serial consult queue for realtime transcript talkback. */
declare function createRealtimeVoiceAgentTalkbackQueue(
  params: RealtimeVoiceAgentTalkbackQueueParams,
): RealtimeVoiceAgentTalkbackQueue;
//#endregion
//#region src/talk/agent-run-control-shared.d.ts
/** Provider-facing control modes for status, steering, cancellation, and follow-up work. */
declare const REALTIME_VOICE_AGENT_CONTROL_MODES: readonly [
  "status",
  "steer",
  "cancel",
  "followup",
];
/** Closed set of realtime voice agent-control modes. */
type RealtimeVoiceAgentControlMode = (typeof REALTIME_VOICE_AGENT_CONTROL_MODES)[number];
/** Provider return shape for control calls that cancel active work immediately. */
type RealtimeVoiceAgentControlProviderResult = {
  status: "cancelled";
  message: string;
};
/** Stable provider-facing tool name for active-run voice control. */
declare const REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME = "openclaw_agent_control";
/** Realtime function-tool descriptor projected to voice providers. */
declare const REALTIME_VOICE_AGENT_CONTROL_TOOL: RealtimeVoiceTool;
/** Classified control intent plus whether automatic tool routing is safe. */
type RealtimeVoiceAgentControlIntent = {
  mode: RealtimeVoiceAgentControlMode;
  confidence: "high" | "medium" | "low";
  reason:
    | "explicit_mode"
    | "cancel_safety"
    | "status_query"
    | "followup_marker"
    | "steer_command"
    | "safe_default";
  shouldAutoControl: boolean;
};
/** Snapshot of active work used when recent Talk events cannot describe status. */
type RealtimeVoiceAgentRunActivity = {
  activeWorkKind?: "tool_call" | "model_call" | "embedded_run";
  hasActiveEmbeddedRun?: boolean;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
};
/** Result returned after applying or reporting a voice control request. */
type RealtimeVoiceAgentControlResult = {
  ok: boolean;
  mode: RealtimeVoiceAgentControlMode;
  sessionKey: string;
  sessionId?: string;
  active: boolean;
  queued?: boolean;
  aborted?: boolean;
  target?: "embedded_run" | "reply_run";
  reason?: string;
  message: string;
  speak: boolean;
  show: boolean;
  suppress: boolean;
  providerResult?: RealtimeVoiceAgentControlProviderResult;
  enqueuedAtMs?: number;
  deliveredAtMs?: number;
};
/** Normalize user/config/provider supplied control modes. */
declare function normalizeRealtimeVoiceAgentControlMode(
  value: unknown,
): RealtimeVoiceAgentControlMode | undefined;
/** Classify raw spoken control text with conservative auto-control gating. */
declare function resolveRealtimeVoiceAgentControlIntent(params: {
  text: string;
  mode?: unknown;
}): RealtimeVoiceAgentControlIntent;
/** Return the best control mode for a spoken utterance, even if auto-routing is unsafe. */
declare function classifyRealtimeVoiceAgentControlText(text: string): RealtimeVoiceAgentControlMode;
/** Whether a spoken utterance is safe to route automatically to the control tool. */
declare function shouldAutoControlRealtimeVoiceAgentText(text: string): boolean;
/** Parse provider-owned control tool args from JSON strings or object payloads. */
declare function parseRealtimeVoiceAgentControlToolArgs(args: unknown): {
  text: string;
  mode: RealtimeVoiceAgentControlMode;
};
/** Build the system-style instruction that forces exact spoken status output. */
declare function buildRealtimeVoiceAgentControlSpeechMessage(text: string): string;
/** Provider result payload used when the control tool cancels active work. */
declare function buildRealtimeVoiceAgentCancelProviderResult(
  message?: string,
): RealtimeVoiceAgentControlProviderResult;
//#endregion
//#region src/talk/agent-run-control.d.ts
type RealtimeVoiceAgentControlDeps = {
  abortEmbeddedAgentRun: (sessionId: string) => boolean;
  queueEmbeddedAgentMessageWithOutcomeAsync: (
    sessionId: string,
    text: string,
    options?: {
      steeringMode?: "all";
      debounceMs?: number;
      taskSuggestionDeliveryMode?: undefined;
    },
  ) => Promise<EmbeddedAgentQueueMessageOutcome>;
  getDiagnosticSessionActivitySnapshot: (params: {
    sessionId?: string;
    sessionKey?: string;
  }) => RealtimeVoiceAgentRunActivity;
  resolveActiveEmbeddedRunSessionId: (sessionKey: string) => string | undefined;
};
/** Apply a spoken status, cancel, steer, or follow-up request to an active run. */
declare function controlRealtimeVoiceAgentRun(
  params: {
    sessionKey: string;
    text: string;
    mode?: unknown;
    recentEvents?: readonly TalkEvent[];
  },
  deps?: RealtimeVoiceAgentControlDeps,
): Promise<RealtimeVoiceAgentControlResult>;
//#endregion
//#region src/talk/fast-context-runtime.d.ts
type Logger = {
  debug?: (message: string) => void;
};
/** Fast-context lookup policy for realtime voice consult shortcuts. */
type RealtimeVoiceFastContextConfig = {
  enabled: boolean /** Maximum memory/session hits to include in the spoken-context prompt. */;
  maxResults: number /** Search backends allowed for the quick lookup. */;
  sources: Array<"memory" | "sessions"> /** Deadline before the quick lookup gives up. */;
  timeoutMs: number /** Whether miss/unavailable/timeout should fall back to a full consult. */;
  fallbackToConsult: boolean;
};
/** Human labels used in generated fast-context responses. */
type RealtimeVoiceFastContextLabels = {
  audienceLabel: string;
  contextName: string;
};
type RealtimeVoiceFastContextConsultResult =
  | {
      handled: false;
    }
  | {
      handled: true;
      result: RealtimeVoiceAgentConsultResult;
    };
/** Try to answer a realtime consult from fast memory/session context. */
declare function resolveRealtimeVoiceFastContextConsult(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  config: RealtimeVoiceFastContextConfig;
  args: unknown;
  logger: Logger;
  labels?: Partial<RealtimeVoiceFastContextLabels>;
}): Promise<RealtimeVoiceFastContextConsultResult>;
//#endregion
//#region src/talk/provider-registry.d.ts
/**
 * Normalizes realtime voice provider ids so direct ids and aliases compare through one registry key.
 */
declare function normalizeRealtimeVoiceProviderId(
  providerId: string | undefined,
): RealtimeVoiceProviderId | undefined;
/**
 * Lists canonical realtime voice provider plugins in registry order.
 */
declare function listRealtimeVoiceProviders(cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin[];
/**
 * Resolves a realtime voice provider by canonical id or declared alias.
 */
declare function getRealtimeVoiceProvider(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): RealtimeVoiceProviderPlugin | undefined;
/**
 * Converts a realtime voice provider id or alias into the canonical provider id when known.
 */
declare function canonicalizeRealtimeVoiceProviderId(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): RealtimeVoiceProviderId | undefined;
//#endregion
//#region src/talk/provider-resolver.d.ts
/** Resolved realtime voice provider plus provider-normalized config. */
type ResolvedRealtimeVoiceProvider = {
  provider: RealtimeVoiceProviderPlugin;
  providerConfig: RealtimeVoiceProviderConfig;
};
/** Inputs for resolving a configured or auto-selected realtime voice provider. */
type ResolveConfiguredRealtimeVoiceProviderParams = {
  configuredProviderId?: string;
  providerConfigs?: Record<
    string,
    Record<string, unknown> | undefined
  > /** Last-mile overrides from a session/client request. */;
  providerConfigOverrides?: Record<string, unknown>;
  cfg?: OpenClawConfig /** Alternate config object used by generic provider selection internals. */;
  cfgForResolve?: OpenClawConfig /** Test/runtime override for the provider list. */;
  providers?: RealtimeVoiceProviderPlugin[] /** Model injected before provider-specific resolveConfig runs. */;
  defaultModel?: string;
  noRegisteredProviderMessage?: string;
};
/** Resolve the configured realtime voice provider or auto-select the first configured one. */
declare function resolveConfiguredRealtimeVoiceProvider(
  params: ResolveConfiguredRealtimeVoiceProviderParams,
): ResolvedRealtimeVoiceProvider;
//#endregion
//#region src/talk/session-runtime.d.ts
/**
 * Transport-facing audio target used by realtime voice bridge sessions.
 */
type RealtimeVoiceAudioSink = {
  isOpen?: () => boolean;
  sendAudio: (audio: Buffer) => void;
  clearAudio?: (reason?: RealtimeVoiceAudioClearReason) => void;
  sendMark?: (markName: string) => void;
};
/**
 * Controls how provider playback marks are bridged to transports that may or may not ack marks.
 */
type RealtimeVoiceMarkStrategy = "transport" | "ack-immediately" | "ignore";
/**
 * Stable session facade handed to gateway code and provider tool callbacks.
 */
type RealtimeVoiceBridgeSession = {
  bridge: RealtimeVoiceBridge;
  acknowledgeMark(markName?: string): void;
  close(): void;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  sendUserMessage(text: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  setMediaTimestamp(ts: number): void;
  submitToolResult(
    callId: string,
    result: unknown,
    options?: RealtimeVoiceToolResultOptions,
  ): void | Promise<void>;
  triggerGreeting(instructions?: string): void;
};
/**
 * Provider bridge inputs plus transport callbacks for one realtime voice session.
 */
type RealtimeVoiceBridgeSessionParams = {
  provider: RealtimeVoiceProviderPlugin;
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  audioSink: RealtimeVoiceAudioSink;
  instructions?: string;
  initialGreetingInstructions?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  markStrategy?: RealtimeVoiceMarkStrategy;
  triggerGreetingOnReady?: boolean;
  tools?: RealtimeVoiceTool[];
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onToolCall?: (
    event: RealtimeVoiceToolCallEvent,
    session: RealtimeVoiceBridgeSession,
  ) => void | Promise<void>;
  onReady?: (session: RealtimeVoiceBridgeSession) => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
/**
 * Creates a realtime voice bridge session and wires provider events to the configured audio sink.
 */
declare function createRealtimeVoiceBridgeSession(
  params: RealtimeVoiceBridgeSessionParams,
): RealtimeVoiceBridgeSession;
//#endregion
//#region src/talk/session-log-runtime.d.ts
/** Ring-buffer entry for transcript text used by Talk health and echo suppression. */
type RealtimeVoiceTranscriptEntry = {
  at: string;
  role: RealtimeVoiceRole;
  text: string;
};
/** Compact health snapshot exposed to diagnostics without dumping full transcript history. */
type RealtimeVoiceTranscriptHealth = {
  realtimeTranscriptLines: number;
  lastRealtimeTranscriptAt?: string;
  lastRealtimeTranscriptRole?: RealtimeVoiceRole;
  lastRealtimeTranscriptText?: string;
  recentRealtimeTranscript: RealtimeVoiceTranscriptEntry[];
};
/** Bridge event plus capture time, kept separate from provider event payload shape. */
type RealtimeVoiceBridgeEventLogEntry = RealtimeVoiceBridgeEvent & {
  at: string;
};
/** Compact health snapshot of recent realtime bridge events. */
type RealtimeVoiceBridgeEventHealth = {
  lastRealtimeEventAt?: string;
  lastRealtimeEventType?: string;
  lastRealtimeEventDetail?: string;
  recentRealtimeEvents: RealtimeVoiceBridgeEventLogEntry[];
};
/** Appends a transcript entry and trims old rows in-place to bound Talk diagnostics memory. */
declare function recordRealtimeVoiceTranscript(
  transcript: RealtimeVoiceTranscriptEntry[],
  role: RealtimeVoiceRole,
  text: string,
  maxEntries?: number,
): RealtimeVoiceTranscriptEntry;
/** Summarizes transcript history for health endpoints and UI diagnostics. */
declare function getRealtimeVoiceTranscriptHealth(
  transcript: RealtimeVoiceTranscriptEntry[],
): RealtimeVoiceTranscriptHealth;
/** Records low-volume bridge events while dropping raw audio chunks from diagnostics. */
declare function recordRealtimeVoiceBridgeEvent(
  events: RealtimeVoiceBridgeEventLogEntry[],
  event: RealtimeVoiceBridgeEvent,
  maxEntries?: number,
): void;
/** Summarizes recent bridge events without exposing the full rolling event buffer. */
declare function getRealtimeVoiceBridgeEventHealth(
  events: RealtimeVoiceBridgeEventLogEntry[],
): RealtimeVoiceBridgeEventHealth;
/** Detects user transcript text that likely came from assistant speaker echo, not speech. */
declare function isLikelyRealtimeVoiceAssistantEchoTranscript(params: {
  transcript: RealtimeVoiceTranscriptEntry[];
  text: string;
  lookbackMs: number;
  nowMs?: number;
}): boolean;
/** Extends input suppression through the estimated playback tail for assistant audio. */
declare function extendRealtimeVoiceOutputEchoSuppression(params: {
  audio: Buffer;
  bytesPerMs: number;
  tailMs: number;
  nowMs: number;
  lastOutputPlayableUntilMs: number;
  suppressInputUntilMs: number;
}): {
  lastOutputPlayableUntilMs: number;
  suppressInputUntilMs: number;
  durationMs: number;
};
//#endregion
//#region src/talk/audio-codec.d.ts
/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
declare function resamplePcm(
  input: Buffer,
  inputSampleRate: number,
  outputSampleRate: number,
): Buffer;
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
declare function resamplePcmTo8k(input: Buffer, inputSampleRate: number): Buffer;
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
declare function pcmToMulaw(pcm: Buffer): Buffer;
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
declare function mulawToPcm(mulaw: Buffer): Buffer;
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
declare function convertPcmToMulaw8k(pcm: Buffer, inputSampleRate: number): Buffer;
//#endregion
export {
  assertRealtimeVoiceAgentConsultModelSelectionUnlocked as $,
  TalkSessionController as $t,
  RealtimeVoiceFastContextLabels as A,
  RealtimeVoiceForcedConsultNativeRecentOptions as At,
  buildRealtimeVoiceAgentCancelProviderResult as B,
  classifySkippableRealtimeVoiceConsultTranscript as Bt,
  resolveConfiguredRealtimeVoiceProvider as C,
  RealtimeVoiceTurnContextTracker as Ct,
  normalizeRealtimeVoiceProviderId as D,
  RealtimeVoiceForcedConsultCoordinatorOptions as Dt,
  listRealtimeVoiceProviders as E,
  RealtimeVoiceForcedConsultCoordinator as Et,
  REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME as F,
  matchRealtimeVoiceConsultQuestions as Ft,
  resolveRealtimeVoiceAgentControlIntent as G,
  isSupportedRealtimeVoiceActivationName as Gt,
  classifyRealtimeVoiceAgentControlText as H,
  RealtimeVoiceActivationNameEdge as Ht,
  RealtimeVoiceAgentControlIntent as I,
  normalizeRealtimeVoiceConsultQuestion as It,
  RealtimeVoiceAgentTalkbackQueueParams as J,
  normalizeRealtimeVoiceActivationNamePrefix as Jt,
  shouldAutoControlRealtimeVoiceAgentText as K,
  matchRealtimeVoiceActivationName as Kt,
  RealtimeVoiceAgentControlMode as L,
  readRealtimeVoiceConsultQuestion as Lt,
  controlRealtimeVoiceAgentRun as M,
  createRealtimeVoiceForcedConsultCoordinator as Mt,
  REALTIME_VOICE_AGENT_CONTROL_MODES as N,
  RealtimeVoiceConsultQuestionMatchOptions as Nt,
  RealtimeVoiceFastContextConfig as O,
  RealtimeVoiceForcedConsultHandle as Ot,
  REALTIME_VOICE_AGENT_CONTROL_TOOL as P,
  RealtimeVoiceSpeakableToolResultOptions as Pt,
  RealtimeVoiceAgentConsultRuntime as Q,
  TalkEnsureTurnResult as Qt,
  RealtimeVoiceAgentControlProviderResult as R,
  readSpeakableRealtimeVoiceToolResult as Rt,
  ResolvedRealtimeVoiceProvider as S,
  RealtimeVoiceTurnContextHandle as St,
  getRealtimeVoiceProvider as T,
  createRealtimeVoiceTurnContextTracker as Tt,
  normalizeRealtimeVoiceAgentControlMode as U,
  RealtimeVoiceActivationNameMatchKind as Ut,
  buildRealtimeVoiceAgentControlSpeechMessage as V,
  REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS as Vt,
  parseRealtimeVoiceAgentControlToolArgs as W,
  RealtimeVoiceActivationNameTranscriptResult as Wt,
  createRealtimeVoiceAgentTalkbackQueue as X,
  realtimeVoiceActivationNameWordCount as Xt,
  RealtimeVoiceAgentTalkbackResult as Y,
  normalizeSupportedRealtimeVoiceActivationName as Yt,
  RealtimeVoiceAgentConsultResult as Z,
  sortRealtimeVoiceActivationNames as Zt,
  RealtimeVoiceBridgeSession as _,
  RealtimeVoiceOutputActivityDelta as _t,
  resamplePcmTo8k as a,
  TalkTurnSuccess as an,
  RealtimeVoiceAgentConsultToolPolicy as at,
  createRealtimeVoiceBridgeSession as b,
  RealtimeVoiceOutputActivityTrackerOptions as bt,
  RealtimeVoiceTranscriptEntry as c,
  recordTalkObservabilityEvent as cn,
  buildRealtimeVoiceAgentConsultPolicyInstructions as ct,
  getRealtimeVoiceBridgeEventHealth as d,
  createTalkDiagnosticEvent as dn,
  collectRealtimeVoiceAgentConsultVisibleText as dt,
  TalkSessionControllerOptions as en,
  consultRealtimeVoiceAgent as et,
  getRealtimeVoiceTranscriptHealth as f,
  recordTalkDiagnosticEvent as fn,
  isRealtimeVoiceAgentConsultToolPolicy as ft,
  RealtimeVoiceAudioSink as g,
  resolveRealtimeVoiceAgentConsultToolsAllow as gt,
  recordRealtimeVoiceTranscript as h,
  resolveRealtimeVoiceAgentConsultTools as ht,
  resamplePcm as i,
  TalkTurnResult as in,
  RealtimeVoiceAgentConsultArgs as it,
  resolveRealtimeVoiceFastContextConsult as j,
  RealtimeVoiceForcedConsultTimer as jt,
  RealtimeVoiceFastContextConsultResult as k,
  RealtimeVoiceForcedConsultNativeMatch as kt,
  RealtimeVoiceTranscriptHealth as l,
  createTalkLogRecord as ln,
  buildRealtimeVoiceAgentConsultPrompt as lt,
  recordRealtimeVoiceBridgeEvent as m,
  resolveRealtimeVoiceAgentConsultToolPolicy as mt,
  mulawToPcm as n,
  TalkTurnFailure as nn,
  REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME as nt,
  RealtimeVoiceBridgeEventHealth as o,
  createTalkSessionController as on,
  RealtimeVoiceAgentConsultTranscriptEntry as ot,
  isLikelyRealtimeVoiceAssistantEchoTranscript as p,
  parseRealtimeVoiceAgentConsultArgs as pt,
  RealtimeVoiceAgentTalkbackQueue as q,
  normalizeRealtimeVoiceActivationName as qt,
  pcmToMulaw as r,
  TalkTurnFailureReason as rn,
  REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES as rt,
  RealtimeVoiceBridgeEventLogEntry as s,
  normalizeTalkTransport as sn,
  buildRealtimeVoiceAgentConsultChatMessage as st,
  convertPcmToMulaw8k as t,
  TalkSessionControllerParams as tn,
  REALTIME_VOICE_AGENT_CONSULT_TOOL as tt,
  extendRealtimeVoiceOutputEchoSuppression as u,
  recordTalkLogEvent as un,
  buildRealtimeVoiceAgentConsultWorkingResponse as ut,
  RealtimeVoiceBridgeSessionParams as v,
  RealtimeVoiceOutputActivitySnapshot as vt,
  canonicalizeRealtimeVoiceProviderId as w,
  RealtimeVoiceTurnContextTrackerOptions as wt,
  ResolveConfiguredRealtimeVoiceProviderParams as x,
  createRealtimeVoiceOutputActivityTracker as xt,
  RealtimeVoiceMarkStrategy as y,
  RealtimeVoiceOutputActivityTracker as yt,
  RealtimeVoiceAgentControlResult as z,
  SkippableRealtimeVoiceConsultTranscriptReason as zt,
};
