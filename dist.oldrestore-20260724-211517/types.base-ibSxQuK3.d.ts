import { t as ChatType } from "./chat-type-B6XXSSnm.js";

//#region src/config/types.base.d.ts
/** Reply handling mode for chat command surfaces. */
type ReplyMode = "text" | "command";
/** Typing indicator timing policy shared by channel configs. */
type TypingMode = "never" | "instant" | "thinking" | "message";
/** Session-key ownership model for inbound messages. */
type SessionScope = "per-sender" | "global";
/** DM session-key granularity across peers, channels, and accounts. */
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Which source messages outbound replies should thread or quote against. */
type ReplyToMode = "off" | "first" | "all" | "batched";
/** Group-chat admission policy for channels with allowlists. */
type GroupPolicy = "open" | "disabled" | "allowlist";
/** Direct-message admission policy for channels with pairing/allowlists. */
type DmPolicy = "pairing" | "allowlist" | "open" | "disabled";
/** How much non-allowlisted context is visible to an agent. */
type ContextVisibilityMode = "all" | "allowlist" | "allowlist_quote";
/** Text splitting strategy for outbound channel delivery. */
type TextChunkMode = "length" | "newline";
/** Preview/progress delivery mode while an agent response is still streaming. */
type StreamingMode = "off" | "partial" | "block" | "progress";
/** How command text is represented in streaming progress previews. */
type ChannelStreamingCommandTextMode = "raw" | "status";
type OutboundRetryConfig = {
  /** Max retry attempts for outbound requests (default: 3). */ attempts?: number /** Minimum retry delay in ms (default: 300-500ms depending on provider). */;
  minDelayMs?: number /** Maximum retry delay cap in ms (default: 30000). */;
  maxDelayMs?: number /** Jitter factor (0-1) applied to delays (default: 0.1). */;
  jitter?: number;
};
type BlockStreamingCoalesceConfig = {
  /** Minimum buffered characters before coalesced block delivery. */ minChars?: number /** Maximum buffered characters before a block must be flushed. */;
  maxChars?: number /** Idle time in ms before flushing a partial coalesced block. */;
  idleMs?: number;
};
type BlockStreamingChunkConfig = {
  /** Minimum preview chunk size before sending another draft update. */ minChars?: number /** Maximum preview chunk size before forcing a draft update. */;
  maxChars?: number /** Preferred natural boundary when splitting preview chunks. */;
  breakPreference?: "paragraph" | "newline" | "sentence";
};
type ChannelStreamingProgressConfig = {
  /** Initial progress title. "auto" picks from labels; false hides the title. Default: "auto". */ label?:
    | string
    | false /** Candidate labels for label="auto". Defaults to OpenClaw's built-in progress labels. */;
  labels?: string[] /** Maximum number of progress lines to keep below the label. Default: 8. */;
  maxLines?: number /** Maximum characters per compact progress line before truncation. Default: 120. */;
  maxLineChars?: number /** Progress draft renderer. "text" is the portable fallback; "rich" lets supported channels use structured UI. */;
  render?: "text" | "rich" /** Include compact tool/task progress in the draft. Default: true. */;
  toolProgress?: boolean /** Command/exec progress detail in the draft. "raw" preserves released behavior; "status" shows only the tool label. Default: "raw". */;
  commandText?: ChannelStreamingCommandTextMode /** Include assistant commentary/preamble text in the progress draft. Default: false. */;
  commentary?: boolean;
  /**
   * Replace tool lines with a short utility-model narration of what the agent
   * is doing. Runs when a utility model resolves (explicit `utilityModel` or
   * the primary provider's declared default). Default: true.
   */
  narration?: boolean;
};
type ChannelStreamingPreviewConfig = {
  /** Chunking thresholds for preview-draft updates while streaming. */ chunk?: BlockStreamingChunkConfig;
  /**
   * Render live tool/activity updates into the preview draft for channels that
   * edit a single preview message in place.
   * Default: true.
   */
  toolProgress?: boolean /** Command/exec progress detail in the preview. "raw" preserves released behavior; "status" shows only the tool label. Default: "raw". */;
  commandText?: ChannelStreamingCommandTextMode;
};
type ChannelStreamingBlockConfig = {
  /** Enable chunked block-reply delivery for channels that support it. */ enabled?: boolean /** Merge streamed block replies before sending. */;
  coalesce?: BlockStreamingCoalesceConfig;
};
type ChannelStreamingConfig = {
  /**
   * Preview streaming mode:
   * - "off": disable preview updates
   * - "partial": update one preview in place
   * - "block": emit larger chunked preview updates
   * - "progress": progress/status preview mode for channels that support it
   */
  mode?: StreamingMode /** Chunking mode for outbound text delivery. */;
  chunkMode?: TextChunkMode;
  /**
   * Channel-specific native transport streaming toggle.
   * Used today by Slack's native stream API.
   */
  nativeTransport?: boolean;
  preview?: ChannelStreamingPreviewConfig;
  progress?: ChannelStreamingProgressConfig;
  block?: ChannelStreamingBlockConfig;
};
type ChannelDeliveryStreamingConfig = Pick<ChannelStreamingConfig, "chunkMode" | "block">;
/** Streaming subset used by channels that render visible preview/progress replies. */
type ChannelPreviewStreamingConfig = Pick<
  ChannelStreamingConfig,
  "mode" | "chunkMode" | "preview" | "progress" | "block"
>;
type MarkdownTableMode = "off" | "bullets" | "code" | "block";
type MarkdownConfig = {
  /** Table rendering mode (off|bullets|code|block). */ tables?: MarkdownTableMode;
};
type HumanDelayConfig = {
  /** Delay style for block replies (off|natural|custom). */ mode?:
    | "off"
    | "natural"
    | "custom" /** Minimum delay in milliseconds (default: 800). */;
  minMs?: number /** Maximum delay in milliseconds (default: 2500). */;
  maxMs?: number;
};
type SessionSendPolicyAction = "allow" | "deny";
type SessionSendPolicyMatch = {
  /** Channel/provider id match. */ channel?: string /** Direct/group/thread classification when the caller has channel metadata. */;
  chatType?: ChatType;
  /**
   * Session key prefix match.
   * Note: some consumers match against a normalized key (for example, stripping `agent:<id>:`).
   */
  keyPrefix?: string /** Optional raw session-key prefix match for consumers that normalize session keys. */;
  rawKeyPrefix?: string;
};
type SessionSendPolicyRule = {
  /** Action applied when match criteria select this rule. */ action: SessionSendPolicyAction /** Optional match filter; omitted match behaves as a catch-all rule. */;
  match?: SessionSendPolicyMatch;
};
type SessionSendPolicyConfig = {
  /** Fallback action when no send-policy rule matches. */ default?: SessionSendPolicyAction /** Ordered allow/deny rules; first matching rule wins. */;
  rules?: SessionSendPolicyRule[];
};
type SessionResetMode = "daily" | "idle";
type SessionResetConfig = {
  mode?: SessionResetMode /** Local hour (0-23) for the daily reset boundary. */;
  atHour?: number /** Sliding idle window (minutes). When set with daily mode, whichever expires first wins. */;
  idleMinutes?: number;
};
type SessionResetByTypeConfig = {
  direct?: SessionResetConfig /** @deprecated Use `direct` instead. Kept for backward compatibility. */;
  dm?: SessionResetConfig;
  group?: SessionResetConfig;
  thread?: SessionResetConfig;
};
type SessionThreadBindingsConfig = {
  /**
   * Master switch for thread-bound session routing features.
   * Channel/provider keys can override this default.
   */
  enabled?: boolean;
  /**
   * Inactivity window for thread-bound sessions (hours).
   * Session auto-unfocuses after this amount of idle time. Set to 0 to disable. Default: 24.
   */
  idleHours?: number;
  /**
   * Optional hard max age for thread-bound sessions (hours).
   * Session auto-unfocuses once this age is reached even if active. Set to 0 to disable. Default: 0.
   */
  maxAgeHours?: number;
  /**
   * Allow channel integrations to create thread-bound work sessions from
   * sessions_spawn or native ACP spawn flows. Channel/account keys can override.
   * Default: true when thread bindings are enabled.
   */
  spawnSessions?: boolean;
  /**
   * Default context mode for native subagents spawned into a bound thread.
   * Default: "fork" so the child starts from the requester transcript.
   */
  defaultSpawnContext?: "isolated" | "fork";
};
type SessionConfig = {
  scope?: SessionScope /** DM session scoping (default: "main"). */;
  dmScope?: DmScope /** Map platform-prefixed identities (e.g. "telegram:123") to canonical DM peers. */;
  identityLinks?: Record<string, string[]>;
  resetTriggers?: string[];
  idleMinutes?: number;
  reset?: SessionResetConfig;
  resetByType?: SessionResetByTypeConfig /** Channel-specific reset overrides (e.g. { discord: { mode: "idle", idleMinutes: 10080 } }). */;
  resetByChannel?: Record<string, SessionResetConfig>;
  store?: string;
  typingIntervalSeconds?: number;
  typingMode?: TypingMode;
  mainKey?: string;
  sendPolicy?: SessionSendPolicyConfig /** Session transcript write-lock acquisition policy. */;
  writeLock?: SessionWriteLockConfig;
  agentToAgent?: {
    /** Max ping-pong turns between requester/target (0-20). Default: 5. */ maxPingPongTurns?: number;
  } /** Shared defaults for thread-bound session routing across channels/providers. */;
  threadBindings?: SessionThreadBindingsConfig /** Automatic session store maintenance (pruning, capping, archive retention, disk budget). */;
  maintenance?: SessionMaintenanceConfig;
};
type SessionWriteLockConfig = {
  /** How long to wait while acquiring a session transcript write lock. Default: 60000. */ acquireTimeoutMs?: number /** When an existing lock can be treated as stale and reclaimed. Default: 1800000. */;
  staleMs?: number /** Maximum in-process hold time before the watchdog releases the lock. Default: 300000. */;
  maxHoldMs?: number;
};
type SessionMaintenanceMode = "enforce" | "warn";
/** Session-store cleanup policy for transcript count, age, archives, and disk budget. */
type SessionMaintenanceConfig = {
  /** Whether to enforce maintenance or warn only. Default: "warn". */ mode?: SessionMaintenanceMode /** Remove session entries older than this duration (e.g. "30d", "12h"). Default: "30d". */;
  pruneAfter?: string | number /** @deprecated Use pruneAfter instead. */;
  pruneDays?: number /** Maximum number of session entries to keep. Default: 500. */;
  maxEntries?: number;
  /**
   * Age-based retention for archived transcripts (`*.reset.<timestamp>` and
   * `*.deleted.<timestamp>`). Default and `false`: keep archives until the
   * disk budget evicts them oldest-first; a duration opts into deletion.
   */
  resetArchiveRetention?: string | number | false;
  /**
   * Per-agent sessions-directory disk budget (e.g. "500mb"). Default: "2gb".
   * When exceeded, warn (mode=warn) or enforce oldest-first cleanup
   * (mode=enforce). Set `false` to disable the budget entirely.
   */
  maxDiskBytes?: number | string | false;
  /**
   * Target size after disk-budget cleanup (high-water mark), e.g. "400mb".
   * Default: 80% of maxDiskBytes.
   */
  highWaterBytes?: number | string;
};
type LoggingConfig = {
  level?: "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  file?: string /** Maximum size of a single log file in bytes before rotation. Default: 100 MB. */;
  maxFileBytes?: number;
  consoleLevel?: "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  consoleStyle?:
    | "pretty"
    | "compact"
    | "json" /** Redact sensitive tokens in log sinks and persisted transcript text. Default: "tools". Safety-boundary UI/tool/diagnostic payloads may still redact when this is "off". */;
  redactSensitive?:
    | "off"
    | "tools" /** Regex patterns used to redact sensitive tokens from logs and transcripts. */;
  redactPatterns?: string[];
};
type DiagnosticsOtelConfig = {
  enabled?: boolean;
  endpoint?: string;
  tracesEndpoint?: string;
  metricsEndpoint?: string;
  logsEndpoint?: string;
  protocol?: "http/protobuf" | "grpc";
  headers?: Record<string, string>;
  serviceName?: string;
  traces?: boolean;
  metrics?: boolean;
  logs?: boolean /** Log export sink: OTLP by default, stdout JSONL, or both. */;
  logsExporter?: "otlp" | "stdout" | "both" /** Trace sample rate (0.0 - 1.0). */;
  sampleRate?: number /** Metric export interval (ms). */;
  flushIntervalMs?: number;
  /**
   * Opt-in raw content capture for OTEL span attributes.
   * Boolean `true` captures non-system message/tool content; the object form
   * can enable each content class explicitly.
   */
  captureContent?:
    | boolean
    | {
        enabled?: boolean;
        inputMessages?: boolean;
        outputMessages?: boolean;
        toolInputs?: boolean;
        toolOutputs?: boolean;
        systemPrompt?: boolean;
        toolDefinitions?: boolean;
      };
};
type DiagnosticsCacheTraceConfig = {
  /** Write prompt-cache trace artifacts for debugging deterministic cache input. */ enabled?: boolean /** Optional output path for cache trace artifacts. */;
  filePath?: string /** Include normalized messages in cache trace output. */;
  includeMessages?: boolean /** Include prompt payload text in cache trace output. */;
  includePrompt?: boolean /** Include system-message content in cache trace output. */;
  includeSystem?: boolean;
};
type AuditConfig = {
  /**
   * Record metadata-only run, tool, and enabled message lifecycle events into
   * the shared state database. Content is never stored. Default: true. This is
   * startup-scoped; disabling stops new event inserts after restart while retained
   * records stay readable until they expire.
   */
  enabled?: boolean;
  /**
   * Record content-free message lifecycle metadata. `direct` records only
   * known direct conversations; `all` also records group, channel, and
   * unknown conversation kinds. Default: `off`.
   */
  messages?: "off" | "direct" | "all";
};
type DiagnosticsConfig = {
  enabled?: boolean /** Optional ad-hoc diagnostics flags (e.g. "telegram.http"). */;
  flags?: string[] /** Threshold in ms before a processing session with no observed progress logs diagnostics. */;
  stuckSessionWarnMs?: number /** Threshold in ms before eligible stalled active work may be aborted for recovery. */;
  stuckSessionAbortMs?: number /** Capture a redacted stability snapshot when memory pressure reaches critical. Default: false. */;
  memoryPressureSnapshot?: boolean;
  otel?: DiagnosticsOtelConfig;
  cacheTrace?: DiagnosticsCacheTraceConfig;
};
type WebReconnectConfig = {
  initialMs?: number;
  maxMs?: number;
  factor?: number;
  jitter?: number;
  maxAttempts?: number;
};
type WebWhatsAppConfig = {
  /** Baileys application ping interval in milliseconds. Default: 25000. */ keepAliveIntervalMs?: number /** WebSocket opening handshake timeout in milliseconds. Default: 60000. */;
  connectTimeoutMs?: number /** Baileys query and WhatsApp outbound/read-receipt operation timeout in milliseconds. Default: 60000. */;
  defaultQueryTimeoutMs?: number;
};
type WebConfig = {
  /** If false, do not start the WhatsApp web provider. Default: true. */ enabled?: boolean;
  heartbeatSeconds?: number;
  reconnect?: WebReconnectConfig;
  whatsapp?: WebWhatsAppConfig;
};
type AgentElevatedAllowFromConfig = Partial<Record<string, Array<string | number>>>;
type IdentityConfig = {
  name?: string;
  theme?: string;
  emoji?: string /** Avatar image: workspace-relative path, http(s) URL, or data URI. */;
  avatar?: string;
};
//#endregion
export {
  SessionResetByTypeConfig as A,
  StreamingMode as B,
  MarkdownTableMode as C,
  SessionConfig as D,
  ReplyToMode as E,
  SessionSendPolicyConfig as F,
  WebWhatsAppConfig as G,
  TypingMode as H,
  SessionSendPolicyMatch as I,
  SessionSendPolicyRule as L,
  SessionResetMode as M,
  SessionScope as N,
  SessionMaintenanceConfig as O,
  SessionSendPolicyAction as P,
  SessionThreadBindingsConfig as R,
  MarkdownConfig as S,
  ReplyMode as T,
  WebConfig as U,
  TextChunkMode as V,
  WebReconnectConfig as W,
  DmScope as _,
  ChannelDeliveryStreamingConfig as a,
  IdentityConfig as b,
  ChannelStreamingCommandTextMode as c,
  ChannelStreamingProgressConfig as d,
  ContextVisibilityMode as f,
  DmPolicy as g,
  DiagnosticsOtelConfig as h,
  BlockStreamingCoalesceConfig as i,
  SessionResetConfig as j,
  SessionMaintenanceMode as k,
  ChannelStreamingConfig as l,
  DiagnosticsConfig as m,
  AuditConfig as n,
  ChannelPreviewStreamingConfig as o,
  DiagnosticsCacheTraceConfig as p,
  BlockStreamingChunkConfig as r,
  ChannelStreamingBlockConfig as s,
  AgentElevatedAllowFromConfig as t,
  ChannelStreamingPreviewConfig as u,
  GroupPolicy as v,
  OutboundRetryConfig as w,
  LoggingConfig as x,
  HumanDelayConfig as y,
  SessionWriteLockConfig as z,
};
