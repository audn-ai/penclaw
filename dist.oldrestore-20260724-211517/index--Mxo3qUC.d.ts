import { validateToolArguments, validateToolCall } from "@openclaw/ai/validation";
import { t as Result } from "./result-Op6FTu_Y.js";
import {
  C as TextContent,
  M as Usage,
  b as StreamFn,
  d as Message,
  f as Model,
  j as Transport,
  l as ImageContent,
  r as AssistantMessage,
  s as CompleteSimpleFn,
  v as SimpleStreamOptions,
  w as ThinkingBudgets,
} from "./types-CqrbBnUB.js";
import {
  C as QueueMode,
  D as ToolExecutionMode,
  E as ThinkingLevel,
  T as StreamFn$1,
  _ as BranchSummaryMessage,
  a as AgentLoopConfig,
  b as CustomMessage,
  c as AgentState,
  g as BeforeToolCallResult,
  h as BeforeToolCallContext,
  i as AgentEvent,
  l as AgentTool,
  m as BashExecutionMessage,
  n as AfterToolCallResult,
  o as AgentLoopTurnUpdate,
  r as AgentContext,
  s as AgentMessage,
  t as AfterToolCallContext,
  v as CompactionSummaryMessage,
} from "./types-JQFrjdua.js";
import { i as EventStream } from "./validation-Bz0Wu-U6.js";

//#region packages/agent-core/src/runtime-deps.d.ts
/** Runtime functions injected by host packages so agent-core stays provider-agnostic. */
interface AgentCoreRuntimeDeps {
  /** Streaming completion implementation used for normal agent turns. */
  streamSimple: StreamFn;
  /** Non-streaming completion implementation used by summarization helpers. */
  completeSimple: CompleteSimpleFn;
}
/** Runtime dependency subset required by streaming agent loops. */
type AgentCoreStreamRuntimeDeps = Pick<AgentCoreRuntimeDeps, "streamSimple">;
/** Runtime dependency subset required by summarization helpers. */
type AgentCoreCompletionRuntimeDeps = Pick<AgentCoreRuntimeDeps, "completeSimple">;
/** Resolve the stream function, preferring an explicit override over injected runtime deps. */
declare function resolveAgentCoreStreamFn(
  runtime: AgentCoreStreamRuntimeDeps | undefined,
  streamFn?: StreamFn,
): StreamFn;
/** Resolve the completion function used by non-streaming helper flows. */
declare function resolveAgentCoreCompleteFn(
  runtime: AgentCoreCompletionRuntimeDeps | undefined,
): CompleteSimpleFn;
//#endregion
//#region packages/agent-core/src/agent.d.ts
/** Options for constructing an {@link Agent}. */
interface AgentOptions {
  /** Initial transcript, tools, model, and prompt state. */
  initialState?: Partial<
    Omit<AgentState, "pendingToolCalls" | "isStreaming" | "streamingMessage" | "errorMessage">
  >;
  /** Convert agent-owned transcript messages into provider-facing messages. */
  convertToLlm?: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
  /** Optionally rewrite context before each provider request. */
  transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
  /** Injected stream runtime used when streamFn is not supplied. */
  runtime?: AgentCoreStreamRuntimeDeps;
  /** Explicit stream implementation, preferred over runtime.streamSimple. */
  streamFn?: StreamFn$1;
  /** Resolve provider API keys at request time. */
  getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
  /** Inspect the provider payload before it is sent. */
  onPayload?: SimpleStreamOptions["onPayload"];
  /** Inspect the provider response after it returns. */
  onResponse?: SimpleStreamOptions["onResponse"];
  /** Hook that may short-circuit or alter a tool call before execution. */
  beforeToolCall?: (
    context: BeforeToolCallContext,
    signal?: AbortSignal,
  ) => Promise<BeforeToolCallResult | undefined>;
  /** Hook that may hydrate a deferred authorized tool call into an executable tool. */
  resolveDeferredTool?: AgentLoopConfig["resolveDeferredTool"];
  /** Hook that may alter a tool result after execution. */
  afterToolCall?: (
    context: AfterToolCallContext,
    signal?: AbortSignal,
  ) => Promise<AfterToolCallResult | undefined>;
  /** Hook that may update model, reasoning, or context after a turn. */
  prepareNextTurn?: (
    signal?: AbortSignal,
  ) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
  /** Queue drain mode for steering messages injected before the next assistant response. */
  steeringMode?: QueueMode;
  /** Queue drain mode for follow-up messages injected after the agent would otherwise stop. */
  followUpMode?: QueueMode;
  /** Session identifier forwarded to cache-aware providers. */
  sessionId?: string;
  /** Optional per-thinking-level token budgets forwarded to providers. */
  thinkingBudgets?: ThinkingBudgets;
  /** Preferred provider transport. */
  transport?: Transport;
  /** Optional cap for provider-requested retry delays. */
  maxRetryDelayMs?: number;
  /** Default strategy for executing multiple tool calls in one assistant message. */
  toolExecution?: ToolExecutionMode;
}
/**
 * Stateful wrapper around the low-level agent loop.
 *
 * `Agent` owns the current transcript, emits lifecycle events, executes tools,
 * and exposes queueing APIs for steering and follow-up messages.
 */
declare class Agent {
  private mutableState;
  private readonly listeners;
  private readonly steeringQueue;
  private readonly followUpQueue;
  convertToLlm: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
  transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
  runtime?: AgentCoreStreamRuntimeDeps;
  streamFn: StreamFn$1;
  getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
  onPayload?: SimpleStreamOptions["onPayload"];
  onResponse?: SimpleStreamOptions["onResponse"];
  beforeToolCall?: (
    context: BeforeToolCallContext,
    signal?: AbortSignal,
  ) => Promise<BeforeToolCallResult | undefined>;
  resolveDeferredTool?: AgentLoopConfig["resolveDeferredTool"];
  afterToolCall?: (
    context: AfterToolCallContext,
    signal?: AbortSignal,
  ) => Promise<AfterToolCallResult | undefined>;
  prepareNextTurn?: (
    signal?: AbortSignal,
  ) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
  private activeRun?;
  /** Session identifier forwarded to providers for cache-aware backends. */
  sessionId?: string;
  /** Optional per-level thinking token budgets forwarded to the stream function. */
  thinkingBudgets?: ThinkingBudgets;
  /** Preferred transport forwarded to the stream function. */
  transport: Transport;
  /** Optional cap for provider-requested retry delays. */
  maxRetryDelayMs?: number;
  /** Tool execution strategy for assistant messages that contain multiple tool calls. */
  toolExecution: ToolExecutionMode;
  constructor(options?: AgentOptions);
  /**
   * Subscribe to agent lifecycle events.
   *
   * Listener promises are awaited in subscription order and are included in
   * the current run's settlement. Listeners also receive the active abort
   * signal for the current run.
   *
   * `agent_end` is the final emitted event for a run, but the agent does not
   * become idle until all awaited listeners for that event have settled.
   */
  subscribe(listener: (event: AgentEvent, signal: AbortSignal) => Promise<void> | void): () => void;
  /**
   * Current agent state.
   *
   * Assigning `state.tools` or `state.messages` copies the provided top-level array.
   */
  get state(): AgentState;
  /** Controls how queued steering messages are drained. */
  set steeringMode(mode: QueueMode);
  get steeringMode(): QueueMode;
  /** Controls how queued follow-up messages are drained. */
  set followUpMode(mode: QueueMode);
  get followUpMode(): QueueMode;
  /** Queue a message to be injected after the current assistant turn finishes. */
  steer(message: AgentMessage): void;
  /** Queue a message to run only after the agent would otherwise stop. */
  followUp(message: AgentMessage): void;
  /** Remove all queued steering messages. */
  clearSteeringQueue(): void;
  /** Remove all queued follow-up messages. */
  clearFollowUpQueue(): void;
  /** Remove all queued steering and follow-up messages. */
  clearAllQueues(): void;
  /** Returns true when either queue still contains pending messages. */
  hasQueuedMessages(): boolean;
  /** Active abort signal for the current run, if any. */
  get signal(): AbortSignal | undefined;
  /** Abort the current run, if one is active. */
  abort(reason?: unknown): void;
  /**
   * Resolve when the current run and all awaited event listeners have finished.
   *
   * This resolves after `agent_end` listeners settle.
   */
  waitForIdle(): Promise<void>;
  /** Clear transcript state, runtime state, and queued messages. */
  reset(): void;
  /** Start a new prompt from text, a single message, or a batch of messages. */
  prompt(message: AgentMessage | AgentMessage[]): Promise<void>;
  prompt(input: string, images?: ImageContent[]): Promise<void>;
  /** Continue from the current transcript. The last message must be a user or tool-result message. */
  continue(): Promise<void>;
  private normalizePromptInput;
  private runPromptMessages;
  private runContinuation;
  private createContextSnapshot;
  private createLoopConfig;
  private runWithLifecycle;
  private handleRunFailure;
  private finishRun;
  /**
   * Reduce internal state for a loop event, then await listeners.
   *
   * `agent_end` only means no further loop events will be emitted. The run is
   * considered idle later, after all awaited listeners for `agent_end` finish
   * and `finishRun()` clears runtime-owned state.
   */
  private processEvents;
}
//#endregion
//#region packages/agent-core/src/agent-loop.d.ts
/** Callback used by synchronous loop runners to publish agent lifecycle events. */
type AgentEventSink = (event: AgentEvent) => Promise<void> | void;
/**
 * Start an agent loop with a new prompt message.
 * The prompt is added to the context and events are emitted for it.
 */
declare function agentLoop(
  prompts: AgentMessage[],
  context: AgentContext,
  config: AgentLoopConfig,
  signal?: AbortSignal,
  streamFn?: StreamFn$1,
  runtime?: AgentCoreStreamRuntimeDeps,
): EventStream<AgentEvent, AgentMessage[]>;
/**
 * Continue an agent loop from the current context without adding a new message.
 * Used for retries - context already has user message or tool results.
 *
 * **Important:** The last message in context must convert to a `user` or `toolResult` message
 * via `convertToLlm`. If it doesn't, the LLM provider will reject the request.
 * This cannot be validated here since `convertToLlm` is only called once per turn.
 */
declare function agentLoopContinue(
  context: AgentContext,
  config: AgentLoopConfig,
  signal?: AbortSignal,
  streamFn?: StreamFn$1,
  runtime?: AgentCoreStreamRuntimeDeps,
): EventStream<AgentEvent, AgentMessage[]>;
/** Run a prompt-started loop and emit events through a caller-owned sink. */
declare function runAgentLoop(
  prompts: AgentMessage[],
  context: AgentContext,
  config: AgentLoopConfig,
  emit: AgentEventSink,
  signal?: AbortSignal,
  streamFn?: StreamFn$1,
  runtime?: AgentCoreStreamRuntimeDeps,
): Promise<AgentMessage[]>;
/** Continue an existing loop context and emit only newly produced messages. */
declare function runAgentLoopContinue(
  context: AgentContext,
  config: AgentLoopConfig,
  emit: AgentEventSink,
  signal?: AbortSignal,
  streamFn?: StreamFn$1,
  runtime?: AgentCoreStreamRuntimeDeps,
): Promise<AgentMessage[]>;
//#endregion
//#region packages/agent-core/src/errors.d.ts
declare const TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE = "openclaw_transcript_not_continuable";
declare class TranscriptNotContinuableError extends Error {
  readonly code = "openclaw_transcript_not_continuable";
  readonly role: AgentMessage["role"];
  constructor(role: AgentMessage["role"]);
}
//#endregion
//#region packages/agent-core/src/harness/session/session.d.ts
/** Build model context from the active session branch and its latest state markers. */
declare function buildSessionContext(pathEntries: SessionTreeEntry[]): SessionContext;
/** High-level session API backed by pluggable tree storage. */
declare class Session<TMetadata extends SessionMetadata = SessionMetadata> {
  private storage;
  constructor(storage: SessionStorage<TMetadata>);
  getMetadata(): Promise<TMetadata>;
  getStorage(): SessionStorage<TMetadata>;
  getLeafId(): Promise<string | null>;
  private getAppendParentId;
  getEntry(id: string): Promise<SessionTreeEntry | undefined>;
  getEntries(): Promise<SessionTreeEntry[]>;
  getBranch(fromId?: string): Promise<SessionTreeEntry[]>;
  buildContext(): Promise<SessionContext>;
  getLabel(id: string): Promise<string | undefined>;
  getSessionName(): Promise<string | undefined>;
  private appendTypedEntry;
  appendMessage(message: AgentMessage): Promise<string>;
  appendThinkingLevelChange(thinkingLevel: string): Promise<string>;
  appendModelChange(provider: string, modelId: string): Promise<string>;
  appendCompaction(
    summary: string,
    firstKeptEntryId: string,
    tokensBefore: number,
    details?: unknown,
    fromHook?: boolean,
  ): Promise<string>;
  /** Append a non-LLM transcript marker for harness-specific state. */
  appendCustomEntry(customType: string, data?: unknown): Promise<string>;
  /** Append harness-specific content that can also be replayed into model context. */
  appendCustomMessageEntry(
    customType: string,
    content: string | (TextContent | ImageContent)[],
    display: boolean,
    details?: unknown,
  ): Promise<string>;
  /** Record or clear the display label for an existing session entry. */
  appendLabel(targetId: string, label: string | undefined): Promise<string>;
  appendSessionName(name: string): Promise<string>;
  /** Move the visible branch leaf and optionally attach a summary of the abandoned branch. */
  moveTo(
    entryId: string | null,
    summary?: {
      summary: string;
      details?: unknown;
      fromHook?: boolean;
    },
  ): Promise<string | undefined>;
}
//#endregion
//#region packages/agent-core/src/harness/agent-harness.d.ts
/** Stateful harness for running, steering, compacting, and navigating sessions. */
declare class CoreAgentHarness<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
  TTool extends AgentTool = AgentTool,
> {
  readonly env: ExecutionEnv;
  private session;
  private phase;
  private runAbortController?;
  private runPromise?;
  private pendingSessionWrites;
  private model;
  private thinkingLevel;
  private systemPrompt;
  private streamOptions;
  private getApiKeyAndHeaders?;
  private runtime?;
  private resources;
  private tools;
  private activeToolNames;
  private steerQueue;
  private steeringQueueMode;
  private followUpQueue;
  private followUpQueueMode;
  private nextTurnQueue;
  private handlers;
  constructor(options: AgentHarnessOptions<TSkill, TPromptTemplate, TTool>);
  private getHandlers;
  private emitOwn;
  private emitAny;
  private emitHook;
  private emitBeforeProviderRequest;
  private emitBeforeProviderPayload;
  private emitQueueUpdate;
  private startRunPromise;
  private createTurnState;
  private createContext;
  private createStreamFn;
  private drainQueuedMessages;
  private createLoopConfig;
  private validateToolNames;
  private flushPendingSessionWrites;
  private handleAgentEvent;
  private emitRunFailure;
  private executeTurn;
  prompt(
    text: string,
    options?: {
      images?: ImageContent[];
    },
  ): Promise<AssistantMessage>;
  skill(name: string, additionalInstructions?: string): Promise<AssistantMessage>;
  promptFromTemplate(name: string, args?: string[]): Promise<AssistantMessage>;
  steer(
    text: string,
    options?: {
      images?: ImageContent[];
    },
  ): Promise<void>;
  followUp(
    text: string,
    options?: {
      images?: ImageContent[];
    },
  ): Promise<void>;
  nextTurn(
    text: string,
    options?: {
      images?: ImageContent[];
    },
  ): Promise<void>;
  appendMessage(message: AgentMessage): Promise<void>;
  compact(customInstructions?: string): Promise<{
    summary: string;
    firstKeptEntryId: string;
    tokensBefore: number;
    details?: unknown;
  }>;
  navigateTree(
    targetId: string,
    options?: {
      summarize?: boolean;
      customInstructions?: string;
      replaceInstructions?: boolean;
      label?: string;
    },
  ): Promise<NavigateTreeResult>;
  getModel(): Model;
  getThinkingLevel(): ThinkingLevel;
  setModel(model: Model): Promise<void>;
  setThinkingLevel(level: ThinkingLevel): Promise<void>;
  setActiveTools(toolNames: string[]): Promise<void>;
  getSteeringMode(): QueueMode;
  setSteeringMode(mode: QueueMode): Promise<void>;
  getFollowUpMode(): QueueMode;
  setFollowUpMode(mode: QueueMode): Promise<void>;
  getResources(): AgentHarnessResources<TSkill, TPromptTemplate>;
  setResources(resources: AgentHarnessResources<TSkill, TPromptTemplate>): Promise<void>;
  getStreamOptions(): AgentHarnessStreamOptions;
  setStreamOptions(streamOptions: AgentHarnessStreamOptions): Promise<void>;
  setTools(tools: TTool[], activeToolNames?: string[]): Promise<void>;
  abort(): Promise<AbortResult>;
  waitForIdle(): Promise<void>;
  subscribe(
    listener: (
      event: AgentHarnessEvent<TSkill, TPromptTemplate>,
      signal?: AbortSignal,
    ) => Promise<void> | void,
  ): () => void;
  on<TType extends keyof AgentHarnessEventResultMap>(
    type: TType,
    handler: (
      event: Extract<
        AgentHarnessOwnEvent,
        {
          type: TType;
        }
      >,
    ) => Promise<AgentHarnessEventResultMap[TType]> | AgentHarnessEventResultMap[TType],
  ): () => void;
}
//#endregion
//#region packages/agent-core/src/harness/types.d.ts
/**
 * @deprecated Use `toErrorObject` from `@openclaw/normalization-core/error-coercion`.
 * Kept through the next major release for the shipped agent-core plugin API.
 */
declare function toError(error: unknown): Error;
/**
 * Skill loaded from a `SKILL.md` file or provided by an application.
 *
 * `name`, `description`, `filePath`, and optional `promptVersion` are available to host-owned prompt builders and
 * direct skill invocation.
 */
interface Skill {
  /** Stable skill name used for lookup and model-visible listings. */
  name: string;
  /** Short model-visible description of when to use the skill. */
  description: string;
  /** Full skill instructions. */
  content: string;
  /** Absolute path to the skill file. Used for model-visible location and resolving relative references. */
  filePath: string;
  /** Deterministic marker for the skill content, rendered as <version> when available. */
  promptVersion?: string;
  /** Exclude this skill from model-visible skill lists while still allowing explicit application invocation. */
  disableModelInvocation?: boolean;
}
/** Prompt template that can be formatted into a prompt for explicit invocation. */
interface PromptTemplate {
  /** Stable template name used for lookup or application command routing. */
  name: string;
  /** Optional description for command lists or autocomplete. */
  description?: string;
  /** Template content. Argument placeholders are formatted by `formatPromptTemplateInvocation`. */
  content: string;
}
/** Resources made available to explicit invocation methods and system-prompt callbacks. */
interface AgentHarnessResources<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
> {
  /** Prompt templates available for explicit invocation. */
  promptTemplates?: TPromptTemplate[];
  /** Skills available to the model and explicit skill invocation. */
  skills?: TSkill[];
}
/** Curated provider request options owned by the harness and snapshotted per turn. */
interface AgentHarnessStreamOptions {
  /** Preferred transport forwarded to the stream function. */
  transport?: Transport;
  /** Provider request timeout in milliseconds. */
  timeoutMs?: number;
  /** Maximum provider retry attempts. */
  maxRetries?: number;
  /** Optional cap for provider-requested retry delays. */
  maxRetryDelayMs?: number;
  /** Additional request headers merged with auth and lifecycle headers. */
  headers?: Record<string, string>;
  /** Provider metadata forwarded with requests. */
  metadata?: SimpleStreamOptions["metadata"];
  /** Provider cache retention hint. */
  cacheRetention?: SimpleStreamOptions["cacheRetention"];
}
/** Per-request stream option patch returned by provider hooks. */
interface AgentHarnessStreamOptionsPatch extends Omit<
  Partial<AgentHarnessStreamOptions>,
  "headers" | "metadata"
> {
  /** Header patch. `undefined` values delete keys; explicit `headers: undefined` clears all headers. */
  headers?: Record<string, string | undefined>;
  /** Metadata patch. `undefined` values delete keys; explicit `metadata: undefined` clears all metadata. */
  metadata?: Record<string, unknown>;
}
/** Kind of filesystem object as addressed by a {@link FileSystem}. Symlinks are not followed automatically. */
type FileKind = "file" | "directory" | "symlink";
/** Stable, backend-independent file error codes returned by {@link FileSystem} file operations. */
type FileErrorCode =
  | "aborted"
  | "not_found"
  | "permission_denied"
  | "not_directory"
  | "is_directory"
  | "invalid"
  | "not_supported"
  | "unknown";
/** Error returned by {@link FileSystem} file operations. */
declare class FileError extends Error {
  /** Backend-independent error code. */
  code: FileErrorCode;
  /** Absolute addressed path associated with the failure, when available. */
  path?: string;
  constructor(code: FileErrorCode, message: string, path?: string, cause?: Error);
}
/** Stable, backend-independent execution error codes returned by {@link ExecutionEnv.exec}. */
type ExecutionErrorCode =
  | "aborted"
  | "timeout"
  | "shell_unavailable"
  | "spawn_error"
  | "callback_error"
  | "unknown";
/** Error returned by {@link ExecutionEnv.exec}. */
declare class ExecutionError extends Error {
  /** Backend-independent error code. */
  code: ExecutionErrorCode;
  constructor(code: ExecutionErrorCode, message: string, cause?: Error);
}
/** Stable compaction error codes returned by compaction helpers. */
type CompactionErrorCode = "aborted" | "summarization_failed" | "invalid_session" | "unknown";
/** Error returned by compaction helpers. */
declare class CompactionError extends Error {
  /** Backend-independent error code. */
  code: CompactionErrorCode;
  constructor(code: CompactionErrorCode, message: string, cause?: Error);
}
/** Stable branch-summary error codes returned by branch summarization helpers. */
type BranchSummaryErrorCode = "aborted" | "summarization_failed" | "invalid_session";
/** Error returned by branch summarization helpers. */
declare class BranchSummaryError extends Error {
  /** Backend-independent error code. */
  code: BranchSummaryErrorCode;
  constructor(code: BranchSummaryErrorCode, message: string, cause?: Error);
}
type SessionErrorCode =
  | "not_found"
  | "invalid_session"
  | "invalid_entry"
  | "invalid_fork_target"
  | "storage"
  | "unknown";
/** Error thrown by session storage, repositories, and session tree operations. */
declare class SessionError extends Error {
  /** Session subsystem error code. */
  code: SessionErrorCode;
  constructor(code: SessionErrorCode, message: string, cause?: Error);
}
type AgentHarnessErrorCode =
  | "busy"
  | "invalid_state"
  | "invalid_argument"
  | "session"
  | "hook"
  | "auth"
  | "compaction"
  | "branch_summary"
  | "unknown";
/** Public AgentHarness failure with a stable top-level classification. */
declare class AgentHarnessError extends Error {
  code: AgentHarnessErrorCode;
  constructor(code: AgentHarnessErrorCode, message: string, cause?: Error);
}
/** Metadata for one filesystem object in a {@link FileSystem}. */
interface FileInfo {
  /** Basename of {@link path}. */
  name: string;
  /** Absolute, syntactically normalized addressed path in the execution environment. Symlinks are not followed. */
  path: string;
  /** Object kind. Symlink targets are not followed; use {@link FileSystem.canonicalPath} explicitly. */
  kind: FileKind;
  /** Size in bytes for the addressed filesystem object. */
  size: number;
  /** Modification time as milliseconds since Unix epoch. */
  mtimeMs: number;
}
/** Options for {@link Shell.exec}. */
interface ExecutionEnvExecOptions {
  /** Working directory for the command. Relative paths are resolved against {@link ExecutionEnv.cwd}. Defaults to {@link ExecutionEnv.cwd}. */
  cwd?: string;
  /** Additional environment variables for the command. Values override the environment defaults. Defaults to no overrides. */
  env?: Record<string, string>;
  /** Timeout in seconds. Implementations should return a timeout error when the command exceeds this duration. Defaults to no timeout. */
  timeout?: number;
  /** Abort signal used to terminate the command. Defaults to no abort signal. */
  abortSignal?: AbortSignal;
  /** Called with stdout chunks as they are produced. */
  onStdout?: (chunk: string) => void;
  /** Called with stderr chunks as they are produced. */
  onStderr?: (chunk: string) => void;
}
/**
 * Filesystem capability used by the harness.
 *
 * Paths passed to methods may be absolute or relative to {@link cwd}. Paths returned by file operations are addressed paths
 * in the filesystem namespace, but are not canonicalized through symlinks unless returned by {@link canonicalPath}.
 *
 * Operation methods must never throw or reject. All filesystem failures, including unexpected backend failures, must be
 * encoded in the returned {@link Result}. Implementations must preserve this invariant.
 */
interface FileSystem {
  /** Current working directory for relative paths. */
  cwd: string;
  /** Return an absolute addressed path without requiring it to exist and without resolving symlinks. */
  absolutePath(path: string, abortSignal?: AbortSignal): Promise<Result<string, FileError>>;
  /** Join path segments in the filesystem namespace without requiring the result to exist. */
  joinPath(parts: string[], abortSignal?: AbortSignal): Promise<Result<string, FileError>>;
  /** Read a UTF-8 text file. */
  readTextFile(path: string, abortSignal?: AbortSignal): Promise<Result<string, FileError>>;
  /** Read UTF-8 text lines. Implementations should stop once `maxLines` lines have been read. */
  readTextLines(
    path: string,
    options?: {
      maxLines?: number;
      abortSignal?: AbortSignal;
    },
  ): Promise<Result<string[], FileError>>;
  /** Read a binary file. */
  readBinaryFile(path: string, abortSignal?: AbortSignal): Promise<Result<Uint8Array, FileError>>;
  /** Create or overwrite a file, creating parent directories when supported. */
  writeFile(
    path: string,
    content: string | Uint8Array,
    abortSignal?: AbortSignal,
  ): Promise<Result<void, FileError>>;
  /** Create or append to a file, creating parent directories when supported. */
  appendFile(
    path: string,
    content: string | Uint8Array,
    abortSignal?: AbortSignal,
  ): Promise<Result<void, FileError>>;
  /** Return metadata for the addressed path without following symlinks. */
  fileInfo(path: string, abortSignal?: AbortSignal): Promise<Result<FileInfo, FileError>>;
  /** List direct children of a directory without following symlinks. */
  listDir(path: string, abortSignal?: AbortSignal): Promise<Result<FileInfo[], FileError>>;
  /** Return the canonical path for an existing path, resolving symlinks where supported. */
  canonicalPath(path: string, abortSignal?: AbortSignal): Promise<Result<string, FileError>>;
  /** Return false for missing paths. Other errors, such as permission failures, return a {@link FileError}. */
  exists(path: string, abortSignal?: AbortSignal): Promise<Result<boolean, FileError>>;
  /** Create a directory. Defaults: `recursive: true`, no abort signal. */
  createDir(
    path: string,
    options?: {
      recursive?: boolean;
      abortSignal?: AbortSignal;
    },
  ): Promise<Result<void, FileError>>;
  /** Remove a file or directory. Defaults: `recursive: false`, `force: false`, no abort signal. */
  remove(
    path: string,
    options?: {
      recursive?: boolean;
      force?: boolean;
      abortSignal?: AbortSignal;
    },
  ): Promise<Result<void, FileError>>;
  /** Create a temporary directory and return its absolute path. Defaults: `prefix: "tmp-"`, no abort signal. */
  createTempDir(prefix?: string, abortSignal?: AbortSignal): Promise<Result<string, FileError>>;
  /** Create a temporary file and return its absolute path. Defaults: `prefix: ""`, `suffix: ""`, no abort signal. */
  createTempFile(options?: {
    prefix?: string;
    suffix?: string;
    abortSignal?: AbortSignal;
  }): Promise<Result<string, FileError>>;
  /** Release filesystem resources. Must be best-effort and must not throw or reject. */
  cleanup(): Promise<void>;
}
/** Shell execution capability used by the harness. */
interface Shell {
  /** Execute a shell command in {@link FileSystem.cwd} unless `options.cwd` is provided. */
  exec(
    command: string,
    options?: ExecutionEnvExecOptions,
  ): Promise<
    Result<
      {
        stdout: string;
        stderr: string;
        exitCode: number;
      },
      ExecutionError
    >
  >;
  /** Release shell resources. Must be best-effort and must not throw or reject. */
  cleanup(): Promise<void>;
}
/** Filesystem and process execution environment used by the harness. */
interface ExecutionEnv extends FileSystem, Shell {}
/** Base fields shared by append-only session tree entries. */
interface SessionTreeEntryBase {
  /** Entry discriminator used for JSONL persistence and typed narrowing. */
  type: string;
  /** Stable entry id unique within a session file. */
  id: string;
  /** Parent entry id, or null for a root entry. */
  parentId: string | null;
  /** ISO timestamp string used for persistence and sorting. */
  timestamp: string;
  /** This row consumes the raw side cursor instead of the visible leaf. */
  appendMode?: "side";
}
/** Persisted transcript message entry. */
interface MessageEntry extends SessionTreeEntryBase {
  type: "message";
  message: AgentMessage;
}
/** Persisted thinking-level selection marker. */
interface ThinkingLevelChangeEntry extends SessionTreeEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;
}
/** Persisted model selection marker. */
interface ModelChangeEntry extends SessionTreeEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}
/** Persisted summary that replaces older transcript history in context. */
interface CompactionEntry<T = unknown> extends SessionTreeEntryBase {
  type: "compaction";
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  details?: T;
  fromHook?: boolean;
}
/** Persisted summary of an abandoned branch when navigating the session tree. */
interface BranchSummaryEntry<T = unknown> extends SessionTreeEntryBase {
  type: "branch_summary";
  fromId: string;
  summary: string;
  details?: T;
  fromHook?: boolean;
}
/** Persisted harness/application marker that is not replayed into model context. */
interface CustomEntry<T = unknown> extends SessionTreeEntryBase {
  type: "custom";
  customType: string;
  data?: T;
}
/** Persisted harness/application message that can be replayed into model context. */
interface CustomMessageEntry<T = unknown> extends SessionTreeEntryBase {
  type: "custom_message";
  customType: string;
  content: string | (TextContent | ImageContent)[];
  details?: T;
  display: boolean;
}
/** Append-only label update for another session entry. */
interface LabelEntry extends SessionTreeEntryBase {
  type: "label";
  targetId: string;
  label: string | undefined;
}
/** Persisted session metadata marker. */
interface SessionInfoEntry extends SessionTreeEntryBase {
  type: "session_info";
  name?: string;
}
/** Append-only marker that changes the active visible leaf. */
interface LeafEntry extends SessionTreeEntryBase {
  type: "leaf";
  targetId: string | null;
  /** Raw parent for the next append when it differs from the visible leaf. */
  appendParentId?: string | null;
}
/** All persisted session tree entry variants. */
type SessionTreeEntry =
  | MessageEntry
  | ThinkingLevelChangeEntry
  | ModelChangeEntry
  | CompactionEntry
  | BranchSummaryEntry
  | CustomEntry
  | CustomMessageEntry
  | LabelEntry
  | SessionInfoEntry
  | LeafEntry;
interface SessionContext {
  messages: AgentMessage[];
  thinkingLevel: string;
  model: {
    provider: string;
    modelId: string;
  } | null;
}
interface SessionMetadata {
  id: string;
  createdAt: string;
}
interface JsonlSessionMetadata extends SessionMetadata {
  cwd: string;
  path: string;
  parentSessionPath?: string;
}
interface SessionStorage<TMetadata extends SessionMetadata = SessionMetadata> {
  getMetadata(): Promise<TMetadata>;
  getLeafId(): Promise<string | null>;
  getAppendParentId?(): Promise<string | null>;
  /** Persist a leaf entry that records the active session-tree leaf. */
  setLeafId(leafId: string | null): Promise<void>;
  createEntryId(): Promise<string>;
  appendEntry(entry: SessionTreeEntry): Promise<void>;
  getEntry(id: string): Promise<SessionTreeEntry | undefined>;
  findEntries<TType extends SessionTreeEntry["type"]>(
    type: TType,
  ): Promise<
    Array<
      Extract<
        SessionTreeEntry,
        {
          type: TType;
        }
      >
    >
  >;
  getLabel(id: string): Promise<string | undefined>;
  getPathToRoot(leafId: string | null): Promise<SessionTreeEntry[]>;
  getEntries(): Promise<SessionTreeEntry[]>;
}
type AgentHarnessPhase = "idle" | "turn" | "compaction" | "branch_summary" | "retry";
type PendingSessionWrite = SessionTreeEntry extends infer TEntry
  ? TEntry extends SessionTreeEntry
    ? Omit<TEntry, "id" | "parentId" | "timestamp">
    : never
  : never;
interface QueueUpdateEvent {
  type: "queue_update";
  steer: AgentMessage[];
  followUp: AgentMessage[];
  nextTurn: AgentMessage[];
}
interface SavePointEvent {
  type: "save_point";
  hadPendingMutations: boolean;
}
interface AbortEvent {
  type: "abort";
  clearedSteer: AgentMessage[];
  clearedFollowUp: AgentMessage[];
}
interface SettledEvent {
  type: "settled";
  nextTurnCount: number;
}
interface BeforeAgentStartEvent<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
> {
  type: "before_agent_start";
  prompt: string;
  images?: ImageContent[];
  systemPrompt: string;
  resources: AgentHarnessResources<TSkill, TPromptTemplate>;
}
interface ContextEvent {
  type: "context";
  messages: AgentMessage[];
}
interface BeforeProviderRequestEvent {
  type: "before_provider_request";
  model: Model;
  sessionId: string;
  streamOptions: AgentHarnessStreamOptions;
}
interface BeforeProviderPayloadEvent {
  type: "before_provider_payload";
  model: Model;
  payload: unknown;
}
interface AfterProviderResponseEvent {
  type: "after_provider_response";
  status: number;
  headers: Record<string, string>;
}
interface ToolCallEvent {
  type: "tool_call";
  toolCallId: string;
  toolName: string;
  input: Record<string, unknown>;
}
interface ToolResultEvent {
  type: "tool_result";
  toolCallId: string;
  toolName: string;
  input: Record<string, unknown>;
  content: Array<TextContent | ImageContent>;
  details: unknown;
  isError: boolean;
}
interface SessionBeforeCompactEvent {
  type: "session_before_compact";
  preparation: CompactionPreparation$1;
  branchEntries: SessionTreeEntry[];
  customInstructions?: string;
  signal: AbortSignal;
}
interface SessionCompactEvent {
  type: "session_compact";
  compactionEntry: CompactionEntry;
  fromHook: boolean;
}
interface SessionBeforeTreeEvent {
  type: "session_before_tree";
  preparation: TreePreparation;
  signal: AbortSignal;
}
interface SessionTreeEvent {
  type: "session_tree";
  newLeafId: string | null;
  oldLeafId: string | null;
  summaryEntry?: BranchSummaryEntry;
  fromHook?: boolean;
}
interface ModelSelectEvent {
  type: "model_select";
  model: Model;
  previousModel: Model | undefined;
  source: "set" | "restore";
}
interface ThinkingLevelSelectEvent {
  type: "thinking_level_select";
  level: ThinkingLevel;
  previousLevel: ThinkingLevel;
}
interface ResourcesUpdateEvent<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
> {
  type: "resources_update";
  resources: AgentHarnessResources<TSkill, TPromptTemplate>;
  previousResources: AgentHarnessResources<TSkill, TPromptTemplate>;
}
type AgentHarnessOwnEvent<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
> =
  | QueueUpdateEvent
  | SavePointEvent
  | AbortEvent
  | SettledEvent
  | BeforeAgentStartEvent<TSkill, TPromptTemplate>
  | ContextEvent
  | BeforeProviderRequestEvent
  | BeforeProviderPayloadEvent
  | AfterProviderResponseEvent
  | ToolCallEvent
  | ToolResultEvent
  | SessionBeforeCompactEvent
  | SessionCompactEvent
  | SessionBeforeTreeEvent
  | SessionTreeEvent
  | ModelSelectEvent
  | ThinkingLevelSelectEvent
  | ResourcesUpdateEvent<TSkill, TPromptTemplate>;
type AgentHarnessEvent<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
> = AgentEvent | AgentHarnessOwnEvent<TSkill, TPromptTemplate>;
/** Hook result for mutating the initial prompt run before the agent starts. */
interface BeforeAgentStartResult {
  /** Replacement messages for the prompt run. */
  messages?: AgentMessage[];
  /** Replacement system prompt for the prompt run. */
  systemPrompt?: string;
}
/** Hook result for replacing the full context message list before provider conversion. */
interface ContextResult {
  messages: AgentMessage[];
}
/** Hook result for patching provider request options before payload construction. */
interface BeforeProviderRequestResult {
  streamOptions?: AgentHarnessStreamOptionsPatch;
}
/** Hook result for replacing the provider payload after construction. */
interface BeforeProviderPayloadResult {
  payload: unknown;
}
/** Hook result for blocking a tool call before execution. */
interface ToolCallResult {
  block?: boolean;
  reason?: string;
}
/** Hook patch for a completed tool result before it is persisted/emitted. */
interface ToolResultPatch {
  content?: Array<TextContent | ImageContent>;
  details?: unknown;
  isError?: boolean;
  terminate?: boolean;
}
/** Hook result for cancelling or replacing a planned compaction. */
interface SessionBeforeCompactResult {
  cancel?: boolean;
  compaction?: CompactResult;
}
/** Hook result for cancelling, labeling, or supplying branch-summary behavior before tree navigation. */
interface SessionBeforeTreeResult {
  cancel?: boolean;
  summary?: {
    summary: string;
    details?: unknown;
  };
  customInstructions?: string;
  replaceInstructions?: boolean;
  label?: string;
}
/** Typed return values expected from AgentHarness hook handlers by event type. */
type AgentHarnessEventResultMap = {
  before_agent_start: BeforeAgentStartResult | undefined;
  context: ContextResult | undefined;
  before_provider_request: BeforeProviderRequestResult | undefined;
  before_provider_payload: BeforeProviderPayloadResult | undefined;
  after_provider_response: undefined;
  tool_call: ToolCallResult | undefined;
  tool_result: ToolResultPatch | undefined;
  session_before_compact: SessionBeforeCompactResult | undefined;
  session_compact: undefined;
  session_before_tree: SessionBeforeTreeResult | undefined;
  session_tree: undefined;
  model_select: undefined;
  thinking_level_select: undefined;
  resources_update: undefined;
  queue_update: undefined;
  save_point: undefined;
  abort: undefined;
  settled: undefined;
};
/** Queued messages removed by an abort operation. */
interface AbortResult {
  clearedSteer: AgentMessage[];
  clearedFollowUp: AgentMessage[];
}
/** Compaction data supplied by hooks or returned from compaction preparation. */
interface CompactResult {
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  details?: unknown;
}
/** Result of moving the active session-tree leaf. */
interface NavigateTreeResult {
  cancelled: boolean;
  editorText?: string;
  summaryEntry?: BranchSummaryEntry;
}
/** Settings that control automatic context compaction. */
interface CompactionSettings$1 {
  enabled: boolean;
  reserveTokens: number;
  keepRecentTokens: number;
}
/** Prepared compaction inputs exposed to hooks before a summary is generated. */
interface CompactionPreparation$1 {
  firstKeptEntryId: string;
  messagesToSummarize: AgentMessage[];
  turnPrefixMessages: AgentMessage[];
  isSplitTurn: boolean;
  tokensBefore: number;
  previousSummary?: string;
  fileOps: FileOperations$1;
  settings: CompactionSettings$1;
}
/** File operations accumulated from summarized transcript ranges. */
interface FileOperations$1 {
  read: Set<string>;
  written: Set<string>;
  edited: Set<string>;
}
/** Prepared branch navigation inputs exposed to hooks before a summary is generated. */
interface TreePreparation {
  targetId: string;
  oldLeafId: string | null;
  commonAncestorId: string | null;
  entriesToSummarize: SessionTreeEntry[];
  userWantsSummary: boolean;
  customInstructions?: string;
  replaceInstructions?: boolean;
  label?: string;
}
/** Options for generating a branch summary. */
interface GenerateBranchSummaryOptions$1 {
  model: Model;
  apiKey: string;
  headers?: Record<string, string>;
  signal: AbortSignal;
  runtime?: AgentCoreCompletionRuntimeDeps;
  streamFn?: StreamFn;
  customInstructions?: string;
  replaceInstructions?: boolean;
  reserveTokens?: number;
}
/** Generated branch summary text and file-operation metadata. */
interface BranchSummaryResult {
  summary: string;
  readFiles: string[];
  modifiedFiles: string[];
}
/** Construction options for AgentHarness. */
interface AgentHarnessOptions<
  TSkill extends Skill = Skill,
  TPromptTemplate extends PromptTemplate = PromptTemplate,
  TTool extends AgentTool = AgentTool,
> {
  env: ExecutionEnv;
  session: Session;
  tools?: TTool[];
  /**
   * Concrete resources available to explicit invocation methods and system-prompt callbacks.
   * Applications own loading/reloading resources and should call `setResources()` with new values.
   */
  resources?: AgentHarnessResources<TSkill, TPromptTemplate>;
  systemPrompt?:
    | string
    | ((context: {
        env: ExecutionEnv;
        session: Session;
        model: Model;
        thinkingLevel: ThinkingLevel;
        activeTools: TTool[];
        resources: AgentHarnessResources<TSkill, TPromptTemplate>;
      }) => string | Promise<string>);
  getApiKeyAndHeaders?: (model: Model) => Promise<
    | {
        apiKey: string;
        headers?: Record<string, string>;
      }
    | undefined
  >;
  runtime?: AgentCoreRuntimeDeps;
  /** Curated stream/provider request options. Snapshotted at turn start. */
  streamOptions?: AgentHarnessStreamOptions;
  model: Model;
  thinkingLevel?: ThinkingLevel;
  activeToolNames?: string[];
  steeringMode?: QueueMode;
  followUpMode?: QueueMode;
}
//#endregion
//#region packages/agent-core/src/harness/env/nodejs.d.ts
/** Node-backed execution environment for agent harness filesystem and shell operations. */
declare class NodeExecutionEnv implements ExecutionEnv {
  cwd: string;
  private shellPath?;
  private shellEnv?;
  constructor(options: { cwd: string; shellPath?: string; shellEnv?: NodeJS.ProcessEnv });
  absolutePath(path: string): Promise<Result<string, FileError>>;
  joinPath(parts: string[]): Promise<Result<string, FileError>>;
  exec(
    command: string,
    options?: {
      cwd?: string;
      env?: Record<string, string>;
      timeout?: number;
      abortSignal?: AbortSignal;
      onStdout?: (chunk: string) => void;
      onStderr?: (chunk: string) => void;
    },
  ): Promise<
    Result<
      {
        stdout: string;
        stderr: string;
        exitCode: number;
      },
      ExecutionError
    >
  >;
  readTextFile(path: string, abortSignal?: AbortSignal): Promise<Result<string, FileError>>;
  readTextLines(
    path: string,
    options?: {
      maxLines?: number;
      abortSignal?: AbortSignal;
    },
  ): Promise<Result<string[], FileError>>;
  readBinaryFile(path: string, abortSignal?: AbortSignal): Promise<Result<Uint8Array, FileError>>;
  writeFile(
    path: string,
    content: string | Uint8Array,
    abortSignal?: AbortSignal,
  ): Promise<Result<void, FileError>>;
  appendFile(path: string, content: string | Uint8Array): Promise<Result<void, FileError>>;
  fileInfo(path: string): Promise<Result<FileInfo, FileError>>;
  listDir(path: string, abortSignal?: AbortSignal): Promise<Result<FileInfo[], FileError>>;
  canonicalPath(path: string): Promise<Result<string, FileError>>;
  exists(path: string): Promise<Result<boolean, FileError>>;
  createDir(
    path: string,
    options?: {
      recursive?: boolean;
    },
  ): Promise<Result<void, FileError>>;
  remove(
    path: string,
    options?: {
      recursive?: boolean;
      force?: boolean;
    },
  ): Promise<Result<void, FileError>>;
  createTempDir(prefix?: string): Promise<Result<string, FileError>>;
  createTempFile(options?: {
    prefix?: string;
    suffix?: string;
  }): Promise<Result<string, FileError>>;
  cleanup(): Promise<void>;
}
//#endregion
//#region packages/agent-core/src/harness/env/kill-tree.d.ts
type KillProcessTreeOptions = {
  graceMs?: number;
  detached?: boolean;
  force?: boolean;
};
/**
 * Best-effort process-tree termination with graceful shutdown.
 * - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
 *   first (without /F), then force-kills if process survives.
 * - Unix: send SIGTERM to process group first, wait grace period, then SIGKILL.
 *
 * When the child was spawned with `detached: false`, pass `detached: false` to
 * skip the Unix `process.kill(-pid, ...)` group-kill. That avoids signaling the
 * gateway's own process group.
 */
declare function killProcessTree(pid: number, opts?: KillProcessTreeOptions): void;
declare function signalProcessTree(
  pid: number,
  signal: "SIGTERM" | "SIGKILL",
  opts?: {
    detached?: boolean;
  },
): void;
//#endregion
//#region packages/agent-core/src/harness/messages.d.ts
/** Harness-only transcript entries that can be normalized into LLM messages. */
type HarnessMessage =
  | AgentMessage
  | BashExecutionMessage
  | CustomMessage
  | BranchSummaryMessage
  | CompactionSummaryMessage;
declare function asAgentMessage(message: HarnessMessage): AgentMessage;
declare const COMPACTION_SUMMARY_PREFIX =
  "The conversation history before this point was compacted into the following summary:\n\n<summary>\n";
declare const COMPACTION_SUMMARY_SUFFIX = "\n</summary>";
declare const BRANCH_SUMMARY_PREFIX =
  "The following is a summary of a branch that this conversation came back from:\n\n<summary>\n";
declare const BRANCH_SUMMARY_SUFFIX = "</summary>";
/** Render a shell execution record as user-visible context text for the model. */
declare function bashExecutionToText(msg: BashExecutionMessage): string;
/** Build a persisted branch summary message from the repository timestamp string. */
declare function createBranchSummaryMessage(
  summary: string,
  fromId: string,
  timestamp: string,
): BranchSummaryMessage;
/** Build a persisted compaction summary message from the repository timestamp string. */
declare function createCompactionSummaryMessage(
  summary: string,
  tokensBefore: number,
  timestamp: string,
): CompactionSummaryMessage;
/** Build a custom transcript message that can be shown and replayed into context. */
declare function createCustomMessage(
  customType: string,
  content: string | (TextContent | ImageContent)[],
  display: boolean,
  details: unknown,
  timestamp: string,
): CustomMessage;
/** Convert harness transcript messages into the LLM-facing message sequence. */
declare function convertToLlm(messages: AgentMessage[]): Message[];
//#endregion
//#region packages/agent-core/src/harness/prompt-template-arguments.d.ts
/** Parse an argument string using simple shell-style single and double quotes. */
declare function parseCommandArgs(argsString: string): string[];
/**
 * Substitute prompt template placeholders (`$1`, `$@`, `$ARGUMENTS`, `${@:N}`, `${@:N:L}`) with command arguments.
 *
 * Unsafe integer placeholders resolve to empty text instead of throwing, so malformed templates cannot abort prompt
 * loading or invocation.
 */
declare function substituteArgs(content: string, args: string[]): string;
/** Format a prompt template invocation using command-style argument substitution. */
declare function formatPromptTemplateInvocation(template: PromptTemplate, args?: string[]): string;
//#endregion
//#region packages/agent-core/src/harness/skills.d.ts
/** Format a skill invocation prompt, optionally appending additional user instructions. */
declare function formatSkillInvocation(skill: Skill, additionalInstructions?: string): string;
//#endregion
//#region packages/agent-core/src/harness/session/storage-base.d.ts
declare abstract class BaseSessionStorage<
  TMetadata extends SessionMetadata = SessionMetadata,
> implements SessionStorage<TMetadata> {
  private readonly metadata;
  private readonly entries;
  private readonly byId;
  private readonly labelsById;
  private readonly logicalParentsById;
  private leafId;
  private appendParentId;
  protected constructor(
    metadata: TMetadata,
    entries: SessionTreeEntry[],
    leafId?: string | null,
    appendParentId?: string | null,
  );
  getMetadata(): Promise<TMetadata>;
  getLeafId(): Promise<string | null>;
  getAppendParentId(): Promise<string | null>;
  protected createLeafEntry(leafId: string | null): LeafEntry;
  createEntryId(): Promise<string>;
  protected validateEntryForAppend(entry: SessionTreeEntry): void;
  protected recordEntry(entry: SessionTreeEntry): void;
  getEntry(id: string): Promise<SessionTreeEntry | undefined>;
  findEntries<TType extends SessionTreeEntry["type"]>(
    type: TType,
  ): Promise<
    Array<
      Extract<
        SessionTreeEntry,
        {
          type: TType;
        }
      >
    >
  >;
  getLabel(id: string): Promise<string | undefined>;
  getPathToRoot(leafId: string | null): Promise<SessionTreeEntry[]>;
  getEntries(): Promise<SessionTreeEntry[]>;
  abstract setLeafId(leafId: string | null): Promise<void>;
  abstract appendEntry(entry: SessionTreeEntry): Promise<void>;
}
//#endregion
//#region packages/agent-core/src/harness/session/jsonl-storage.d.ts
type JsonlSessionStorageFileSystem = Pick<
  FileSystem,
  "readTextFile" | "readTextLines" | "writeFile" | "appendFile"
>;
/** Read only the JSONL session header and convert it to session metadata. */
declare function loadJsonlSessionMetadata(
  fs: JsonlSessionStorageFileSystem,
  filePath: string,
): Promise<JsonlSessionMetadata>;
/** Append-only JSONL-backed storage for one session tree. */
declare class JsonlSessionStorage extends BaseSessionStorage<JsonlSessionMetadata> {
  private readonly fs;
  private readonly filePath;
  private constructor();
  static open(fs: JsonlSessionStorageFileSystem, filePath: string): Promise<JsonlSessionStorage>;
  /** Create a new JSONL file with a session header and no entries. */
  static create(
    fs: JsonlSessionStorageFileSystem,
    filePath: string,
    options: {
      cwd: string;
      sessionId: string;
      parentSessionPath?: string;
    },
  ): Promise<JsonlSessionStorage>;
  setLeafId(leafId: string | null): Promise<void>;
  appendEntry(entry: SessionTreeEntry): Promise<void>;
}
//#endregion
//#region packages/agent-core/src/harness/session/memory-storage.d.ts
/** Volatile session storage used by tests and in-process harness callers. */
declare class InMemorySessionStorage<
  TMetadata extends SessionMetadata = SessionMetadata,
> extends BaseSessionStorage<TMetadata> {
  constructor(options?: { entries?: SessionTreeEntry[]; metadata?: TMetadata });
  setLeafId(leafId: string | null): Promise<void>;
  appendEntry(entry: SessionTreeEntry): Promise<void>;
}
//#endregion
//#region packages/agent-core/src/harness/session/uuid.d.ts
/** Generate a monotonic UUIDv7 string. */
declare function uuidv7(): string;
//#endregion
//#region packages/agent-core/src/harness/compaction/utils.d.ts
/** File paths touched by a session branch or compaction range. */
interface FileOperations {
  /** Files read but not necessarily modified. */
  read: Set<string>;
  /** Files written by full-file write operations. */
  written: Set<string>;
  /** Files modified by edit operations. */
  edited: Set<string>;
}
/** Serialize LLM messages to plain text for summarization prompts. */
declare function serializeConversation(messages: Message[]): string;
//#endregion
//#region packages/agent-core/src/harness/compaction/branch-summarization.d.ts
/** File-operation details stored on generated branch summary entries. */
interface BranchSummaryDetails {
  /** Files read while exploring the summarized branch. */
  readFiles: string[];
  /** Files modified while exploring the summarized branch. */
  modifiedFiles: string[];
}
/** Prepared branch content for summarization. */
interface BranchPreparation {
  /** Messages selected for the branch summary. */
  messages: AgentMessage[];
  /** File operations extracted from the branch. */
  fileOps: FileOperations;
  /** Estimated token count for selected messages. */
  totalTokens: number;
}
/** Entries selected for branch summarization. */
interface CollectEntriesResult {
  /** Entries to summarize in chronological order. */
  entries: SessionTreeEntry[];
  /** Deepest common ancestor between the previous leaf and target entry. */
  commonAncestorId: string | null;
}
/** Minimal tree entry shape needed to compare two session branches. */
interface BranchPathEntry {
  /** Stable entry id. */
  id: string;
  /** Parent entry id, or null for the session root. */
  parentId: string | null;
}
/** Branch entries selected after comparing old and target paths. */
interface CollectBranchPathEntriesResult<TEntry extends BranchPathEntry> {
  /** Entries to summarize in chronological order. */
  entries: TEntry[];
  /** Deepest common ancestor between the previous leaf and target entry. */
  commonAncestorId: string | null;
}
/** Options for generating a branch summary. */
interface GenerateBranchSummaryOptions {
  /** Model used for summarization. */
  model: Model;
  /** API key forwarded to the provider. */
  apiKey: string;
  /** Optional request headers forwarded to the provider. */
  headers?: Record<string, string>;
  /** Abort signal for the summarization request. */
  signal: AbortSignal;
  /** Runtime used to complete the summarization request. */
  runtime?: AgentCoreCompletionRuntimeDeps;
  /** Optional stream implementation used instead of the runtime complete function. */
  streamFn?: StreamFn;
  /** Optional instructions appended to or replacing the default prompt. */
  customInstructions?: string;
  /** Replace the default prompt with custom instructions instead of appending them. */
  replaceInstructions?: boolean;
  /** Tokens reserved for prompt and model output. Defaults to 16384. */
  reserveTokens?: number;
}
/** Collect entries that should be summarized before navigating to a different session tree entry. */
declare function collectEntriesForBranchSummaryFromBranches<TEntry extends BranchPathEntry>(
  oldBranch: readonly TEntry[],
  targetBranch: readonly TEntry[],
): CollectBranchPathEntriesResult<TEntry>;
/** Collect concrete session entries to summarize before moving from one leaf to another. */
declare function collectEntriesForBranchSummary(
  session: Session,
  oldLeafId: string | null,
  targetId: string,
): Promise<CollectEntriesResult>;
/** Prepare branch entries for summarization within an optional token budget. */
declare function prepareBranchEntries(
  entries: SessionTreeEntry[],
  tokenBudget?: number,
): BranchPreparation;
/** Generate a summary for abandoned branch entries. */
declare function generateBranchSummary(
  entries: SessionTreeEntry[],
  options: GenerateBranchSummaryOptions,
): Promise<Result<BranchSummaryResult, BranchSummaryError>>;
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.d.ts
/** File-operation details stored on generated compaction entries. */
interface CompactionDetails {
  /** Files read in the compacted history. */
  readFiles: string[];
  /** Files modified in the compacted history. */
  modifiedFiles: string[];
}
/** Generated compaction data ready to be persisted as a compaction entry. */
interface CompactionResult<T = unknown> {
  /** Summary text that replaces compacted history in future context. */
  summary: string;
  /** Entry id where retained history starts. */
  firstKeptEntryId: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Optional implementation-specific details stored with the compaction entry. */
  details?: T;
}
/** Compaction thresholds and retention settings. */
interface CompactionSettings {
  /** Enable automatic compaction decisions. */
  enabled: boolean;
  /** Tokens reserved for summary prompt and output. */
  reserveTokens: number;
  /** Approximate recent-context tokens to keep after compaction. */
  keepRecentTokens: number;
}
/** Default compaction settings used by the harness. */
declare const DEFAULT_COMPACTION_SETTINGS: CompactionSettings;
/** Calculate total context tokens from provider usage. */
declare function calculateContextTokens(usage: Usage): number;
/** Return usage from the last successful assistant message in session entries. */
declare function getLastAssistantUsage(entries: SessionTreeEntry[]): Usage | undefined;
/** Estimated context-token usage for a message list. */
interface ContextUsageEstimate {
  /** Estimated total context tokens. */
  tokens: number;
  /** Tokens reported by the most recent assistant usage block. */
  usageTokens: number;
  /** Estimated tokens not covered by usable provider usage. */
  trailingTokens: number;
  /** Index of the message that provided usage, or null when none exists. */
  lastUsageIndex: number | null;
}
/** Estimate context tokens for messages using provider usage when available. */
declare function estimateContextTokens(messages: AgentMessage[]): ContextUsageEstimate;
/** Return whether context usage exceeds the configured compaction threshold. */
declare function shouldCompact(
  contextTokens: number,
  contextWindow: number,
  settings: CompactionSettings,
): boolean;
/** Estimate token count for one message using a conservative character heuristic. */
declare function estimateTokens(message: AgentMessage): number;
/** Find the user-visible message that starts the turn containing an entry. */
declare function findTurnStartIndex(
  entries: SessionTreeEntry[],
  entryIndex: number,
  startIndex: number,
): number;
/** Cut point selected for compaction. */
interface CutPointResult {
  /** Index of the first entry retained after compaction. */
  firstKeptEntryIndex: number;
  /** Index of the turn-start entry when the cut splits a turn, otherwise -1. */
  turnStartIndex: number;
  /** Whether the selected cut point splits an in-progress turn. */
  isSplitTurn: boolean;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
declare function findCutPoint(
  entries: SessionTreeEntry[],
  startIndex: number,
  endIndex: number,
  keepRecentTokens: number,
): CutPointResult;
/** Generate or update a conversation summary for compaction. */
declare function generateSummary(
  currentMessages: AgentMessage[],
  model: Model,
  reserveTokens: number,
  apiKey: string | undefined,
  headers?: Record<string, string>,
  signal?: AbortSignal,
  customInstructions?: string,
  previousSummary?: string,
  thinkingLevel?: ThinkingLevel,
  streamFn?: StreamFn,
  runtime?: AgentCoreCompletionRuntimeDeps,
): Promise<Result<string, CompactionError>>;
/** Prepared inputs for a compaction run. */
interface CompactionPreparation {
  /** Entry id where retained history starts. */
  firstKeptEntryId: string;
  /** Messages summarized into the history summary. */
  messagesToSummarize: AgentMessage[];
  /** Prefix messages summarized separately when compaction splits a turn. */
  turnPrefixMessages: AgentMessage[];
  /** Whether compaction splits a turn. */
  isSplitTurn: boolean;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Previous compaction summary used for iterative updates. */
  previousSummary?: string;
  /** File operations extracted from summarized history. */
  fileOps: FileOperations;
  /** Settings used to prepare compaction. */
  settings: CompactionSettings;
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
declare function prepareCompaction(
  pathEntries: SessionTreeEntry[],
  settings: CompactionSettings,
): Result<CompactionPreparation | undefined, CompactionError>;
/** Generate compaction summary data from prepared session history. */
declare function compact(
  preparation: CompactionPreparation,
  model: Model,
  apiKey: string | undefined,
  headers?: Record<string, string>,
  customInstructions?: string,
  signal?: AbortSignal,
  thinkingLevel?: ThinkingLevel,
  streamFn?: StreamFn,
  runtime?: AgentCoreCompletionRuntimeDeps,
): Promise<Result<CompactionResult, CompactionError>>;
//#endregion
//#region packages/agent-core/src/harness/utils/truncate.d.ts
declare const DEFAULT_MAX_LINES = 2000;
declare const DEFAULT_MAX_BYTES: number;
declare const GREP_MAX_LINE_LENGTH = 500;
/** Result metadata for content truncated by line count, byte count, or both. */
interface TruncationResult {
  /** The truncated content */
  content: string;
  /** Whether truncation occurred */
  truncated: boolean;
  /** Which limit was hit: "lines", "bytes", or null if not truncated */
  truncatedBy: "lines" | "bytes" | null;
  /** Total number of lines in the original content */
  totalLines: number;
  /** Total number of bytes in the original content */
  totalBytes: number;
  /** Number of complete lines in the truncated output */
  outputLines: number;
  /** Number of bytes in the truncated output */
  outputBytes: number;
  /** Whether the last line was partially truncated (only for tail truncation edge case) */
  lastLinePartial: boolean;
  /** Whether the first line exceeded the byte limit (for head truncation) */
  firstLineExceedsLimit: boolean;
  /** The max lines limit that was applied */
  maxLines: number;
  /** The max bytes limit that was applied */
  maxBytes: number;
}
/** Byte and line ceilings used by the truncation helpers. */
interface TruncationOptions {
  /** Maximum number of lines (default: 2000) */
  maxLines?: number;
  /** Maximum number of bytes (default: 50KB) */
  maxBytes?: number;
}
/**
 * Format byte counts for compact tool-output diagnostics.
 */
declare function formatSize(bytes: number): string;
/**
 * Keep the beginning of content while respecting independent line and byte ceilings.
 *
 * Head truncation preserves complete lines; a first line that exceeds the byte
 * ceiling produces empty output and sets firstLineExceedsLimit.
 */
declare function truncateHead(content: string, options?: TruncationOptions): TruncationResult;
/**
 * Keep the end of content while respecting independent line and byte ceilings.
 *
 * Tail truncation preserves recent output for command errors and may keep a
 * partial first line when one final line alone exceeds the byte ceiling.
 */
declare function truncateTail(content: string, options?: TruncationOptions): TruncationResult;
/**
 * Trim a single display line and mark it with the grep-style truncation suffix.
 *
 * The cut point is backed off by one code unit when it would otherwise split a
 * surrogate pair, so emoji / CJK Extension B characters crossing the boundary
 * stay intact instead of rendering as replacement characters.
 */
declare function truncateLine(
  line: string,
  maxChars?: number,
): {
  text: string;
  wasTruncated: boolean;
};
//#endregion
export {
  createCompactionSummaryMessage as $,
  ModelChangeEntry as $t,
  CollectEntriesResult as A,
  TreePreparation as An,
  CompactResult as At,
  formatSkillInvocation as B,
  runAgentLoop as Bn,
  ExecutionError as Bt,
  getLastAssistantUsage as C,
  Skill as Cn,
  BeforeProviderPayloadResult as Ct,
  BranchPreparation as D,
  ToolCallResult as Dn,
  BranchSummaryError as Dt,
  BranchPathEntry as E,
  ToolCallEvent as En,
  BranchSummaryEntry as Et,
  serializeConversation as F,
  TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE as Fn,
  ContextResult as Ft,
  BRANCH_SUMMARY_SUFFIX as G,
  AgentCoreRuntimeDeps as Gn,
  FileKind as Gt,
  parseCommandArgs as H,
  Agent as Hn,
  FileError as Ht,
  uuidv7 as I,
  TranscriptNotContinuableError as In,
  CustomEntry as It,
  HarnessMessage as J,
  resolveAgentCoreStreamFn as Jn,
  GenerateBranchSummaryOptions$1 as Jt,
  COMPACTION_SUMMARY_PREFIX as K,
  AgentCoreStreamRuntimeDeps as Kn,
  FileOperations$1 as Kt,
  InMemorySessionStorage as L,
  AgentEventSink as Ln,
  CustomMessageEntry as Lt,
  collectEntriesForBranchSummaryFromBranches as M,
  CoreAgentHarness as Mn,
  CompactionError as Mt,
  generateBranchSummary as N,
  Session as Nn,
  CompactionErrorCode as Nt,
  BranchSummaryDetails as O,
  ToolResultEvent as On,
  BranchSummaryErrorCode as Ot,
  prepareBranchEntries as P,
  buildSessionContext as Pn,
  ContextEvent as Pt,
  createBranchSummaryMessage as Q,
  MessageEntry as Qt,
  JsonlSessionStorage as R,
  agentLoop as Rn,
  ExecutionEnv as Rt,
  generateSummary as S,
  Shell as Sn,
  BeforeProviderPayloadEvent as St,
  shouldCompact as T,
  ThinkingLevelSelectEvent as Tn,
  BeforeProviderRequestResult as Tt,
  substituteArgs as U,
  AgentOptions as Un,
  FileErrorCode as Ut,
  formatPromptTemplateInvocation as V,
  runAgentLoopContinue as Vn,
  ExecutionErrorCode as Vt,
  BRANCH_SUMMARY_PREFIX as W,
  AgentCoreCompletionRuntimeDeps as Wn,
  FileInfo as Wt,
  bashExecutionToText as X,
  LabelEntry as Xt,
  asAgentMessage as Y,
  JsonlSessionMetadata as Yt,
  convertToLlm as Z,
  LeafEntry as Zt,
  compact as _,
  SessionStorage as _n,
  AgentHarnessResources as _t,
  TruncationResult as a,
  ResourcesUpdateEvent as an,
  validateToolCall as at,
  findCutPoint as b,
  SessionTreeEvent as bn,
  BeforeAgentStartEvent as bt,
  truncateLine as c,
  SessionBeforeCompactResult as cn,
  AbortResult as ct,
  CompactionPreparation as d,
  SessionCompactEvent as dn,
  AgentHarnessErrorCode as dt,
  ModelSelectEvent as en,
  createCustomMessage as et,
  CompactionResult as f,
  SessionContext as fn,
  AgentHarnessEvent as ft,
  calculateContextTokens as g,
  SessionMetadata as gn,
  AgentHarnessPhase as gt,
  DEFAULT_COMPACTION_SETTINGS as h,
  SessionInfoEntry as hn,
  AgentHarnessOwnEvent as ht,
  TruncationOptions as i,
  QueueUpdateEvent as in,
  validateToolArguments as it,
  collectEntriesForBranchSummary as j,
  toError as jn,
  CompactionEntry as jt,
  CollectBranchPathEntriesResult as k,
  ToolResultPatch as kn,
  BranchSummaryResult as kt,
  truncateTail as l,
  SessionBeforeTreeEvent as ln,
  AfterProviderResponseEvent as lt,
  ContextUsageEstimate as m,
  SessionErrorCode as mn,
  AgentHarnessOptions as mt,
  DEFAULT_MAX_LINES as n,
  PendingSessionWrite as nn,
  killProcessTree as nt,
  formatSize as o,
  SavePointEvent as on,
  NodeExecutionEnv as ot,
  CompactionSettings as p,
  SessionError as pn,
  AgentHarnessEventResultMap as pt,
  COMPACTION_SUMMARY_SUFFIX as q,
  resolveAgentCoreCompleteFn as qn,
  FileSystem as qt,
  GREP_MAX_LINE_LENGTH as r,
  PromptTemplate as rn,
  signalProcessTree as rt,
  truncateHead as s,
  SessionBeforeCompactEvent as sn,
  AbortEvent as st,
  DEFAULT_MAX_BYTES as t,
  NavigateTreeResult as tn,
  KillProcessTreeOptions as tt,
  CompactionDetails as u,
  SessionBeforeTreeResult as un,
  AgentHarnessError as ut,
  estimateContextTokens as v,
  SessionTreeEntry as vn,
  AgentHarnessStreamOptions as vt,
  prepareCompaction as w,
  ThinkingLevelChangeEntry as wn,
  BeforeProviderRequestEvent as wt,
  findTurnStartIndex as x,
  SettledEvent as xn,
  BeforeAgentStartResult as xt,
  estimateTokens as y,
  SessionTreeEntryBase as yn,
  AgentHarnessStreamOptionsPatch as yt,
  loadJsonlSessionMetadata as z,
  agentLoopContinue as zn,
  ExecutionEnvExecOptions as zt,
};
