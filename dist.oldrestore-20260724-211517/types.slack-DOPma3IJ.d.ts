import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { n as SafeBinProfileFixture } from "./exec-safe-bin-policy-profiles-CWCK911g.js";
import {
  B as StreamingMode,
  E as ReplyToMode,
  F as SessionSendPolicyConfig,
  P as SessionSendPolicyAction,
  S as MarkdownConfig,
  V as TextChunkMode,
  d as ChannelStreamingProgressConfig,
  f as ContextVisibilityMode,
  g as DmPolicy,
  s as ChannelStreamingBlockConfig,
  t as AgentElevatedAllowFromConfig,
  u as ChannelStreamingPreviewConfig,
  v as GroupPolicy,
} from "./types.base-ibSxQuK3.js";
import {
  n as ConfiguredProviderRequest,
  o as AgentModelConfig,
} from "./types.provider-request-CVFNhEKy.js";
import { d as SecretInput } from "./types.secrets-C15Z_eLX.js";

//#region src/config/types.memory.d.ts
/** Memory backend family selected for retrieval and session memory features. */
type MemoryBackend = "builtin" | "qmd";
/** Citation rendering mode for memory-injected context. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** QMD search command flavor used for retrieval. */
type MemoryQmdSearchMode = "query" | "search" | "vsearch";
/** QMD startup/update scheduling mode. */
type MemoryQmdStartupMode = "off" | "idle" | "immediate";
/** Top-level memory config block. */
type MemoryConfig = {
  backend?: MemoryBackend;
  citations?: MemoryCitationsMode;
  qmd?: MemoryQmdConfig;
};
/** QMD-specific memory backend config. */
type MemoryQmdConfig = {
  command?: string;
  mcporter?: MemoryQmdMcporterConfig;
  searchMode?: MemoryQmdSearchMode;
  rerank?: boolean;
  searchTool?: string;
  includeDefaultMemory?: boolean;
  paths?: MemoryQmdIndexPath[];
  sessions?: MemoryQmdSessionConfig;
  update?: MemoryQmdUpdateConfig;
  limits?: MemoryQmdLimitsConfig;
  scope?: SessionSendPolicyConfig;
};
/** mcporter daemon integration for long-lived QMD MCP access. */
type MemoryQmdMcporterConfig = {
  /**
   * Route QMD searches through mcporter (MCP runtime) instead of spawning `qmd` per query.
   * Requires:
   * - `mcporter` installed and on PATH
   * - A configured mcporter server that runs `qmd mcp` with `lifecycle: keep-alive`
   */
  enabled?: boolean /** mcporter server name (defaults to "qmd") */;
  serverName?: string /** Start the mcporter daemon automatically (defaults to true when enabled). */;
  startDaemon?: boolean;
};
/** Additional QMD index path entry. */
type MemoryQmdIndexPath = {
  path: string;
  name?: string;
  pattern?: string;
};
/** Session export settings for QMD memory indexing. */
type MemoryQmdSessionConfig = {
  enabled?: boolean;
  exportDir?: string;
  retentionDays?: number;
};
/** Background update and embedding schedule for QMD memory. */
type MemoryQmdUpdateConfig = {
  interval?: string;
  debounceMs?: number;
  onBoot?: boolean;
  startup?: MemoryQmdStartupMode;
  startupDelayMs?: number;
  waitForBootSync?: boolean;
  embedInterval?: string;
  commandTimeoutMs?: number;
  updateTimeoutMs?: number;
  embedTimeoutMs?: number;
};
/** Retrieval and injection limits for QMD memory results. */
type MemoryQmdLimitsConfig = {
  maxResults?: number;
  maxSnippetChars?: number;
  maxInjectedChars?: number;
  timeoutMs?: number;
};
//#endregion
//#region src/config/types.tools.d.ts
type MediaUnderstandingScopeMatch = {
  /** Channel/provider id to match before running media or link understanding. */ channel?: string /** Direct/group classification from the channel runtime, when available. */;
  chatType?: ChatType /** Attachment or link key prefix used for narrow per-source routing. */;
  keyPrefix?: string;
};
type MediaUnderstandingScopeRule = {
  /** Policy applied when match criteria select this scope rule. */ action: SessionSendPolicyAction /** Optional match filter; omitted match behaves as a catch-all rule. */;
  match?: MediaUnderstandingScopeMatch;
};
type MediaUnderstandingScopeConfig = {
  /** Fallback action when no scope rule matches. */ default?: SessionSendPolicyAction /** Ordered allow/block rules; first matching rule wins. */;
  rules?: MediaUnderstandingScopeRule[];
};
type MediaUnderstandingCapability = "image" | "audio" | "video";
type MediaUnderstandingAttachmentsConfig = {
  /** Select the first matching attachment or process multiple. */ mode?:
    | "first"
    | "all" /** Max number of attachments to process (default: 1). */;
  maxAttachments?: number /** Attachment ordering preference. */;
  prefer?: "first" | "last" | "path" | "url";
};
type MediaProviderRequestConfig = {
  /** Optional provider-specific query params (merged into requests). */ providerOptions?: Record<
    string,
    Record<string, string | number | boolean>
  > /** @deprecated Use providerOptions.deepgram instead. */;
  deepgram?: {
    detectLanguage?: boolean;
    punctuate?: boolean;
    smartFormat?: boolean;
  } /** Optional base URL override for provider requests. */;
  baseUrl?: string /** Optional headers merged into provider requests. */;
  headers?: Record<
    string,
    string
  > /** Optional request transport overrides for provider HTTP calls. */;
  request?: ConfiguredProviderRequest;
};
type MediaUnderstandingModelConfig = MediaProviderRequestConfig & {
  /** provider API id (e.g. openai, google). */ provider?: string /** Model id for provider-based understanding. */;
  model?: string /** Optional capability tags for shared model lists. */;
  capabilities?: MediaUnderstandingCapability[] /** Use a CLI command instead of provider API. */;
  type?: "provider" | "cli" /** CLI binary (required when type=cli). */;
  command?: string /** CLI args (template-enabled). */;
  args?: string[] /** Optional prompt override for this model entry. */;
  prompt?: string /** Optional max output characters for this model entry. */;
  maxChars?: number /** Optional max bytes for this model entry. */;
  maxBytes?: number /** Optional timeout override (seconds) for this model entry. */;
  timeoutSeconds?: number /** Optional language hint for audio transcription. */;
  language?: string /** Auth profile id to use for this provider. */;
  profile?: string /** Preferred profile id if multiple are available. */;
  preferredProfile?: string;
};
type MediaUnderstandingConfig = MediaProviderRequestConfig & {
  /** Enable media understanding when models are configured. */ enabled?: boolean /** Optional scope gating for understanding. */;
  scope?: MediaUnderstandingScopeConfig /** Default max bytes to send. */;
  maxBytes?: number /** Default max output characters. */;
  maxChars?: number /** Default prompt. */;
  prompt?: string /** Internal request-scoped prompt override injected by CLI/runtime wrappers. */;
  _requestPromptOverride?: string /** Default timeout (seconds). */;
  timeoutSeconds?: number /** Default language hint (audio). */;
  language?: string /** Internal request-scoped language override injected by CLI/runtime wrappers. */;
  _requestLanguageOverride?: string /** Attachment selection policy. */;
  attachments?: MediaUnderstandingAttachmentsConfig /** Ordered model list (fallbacks in order). */;
  models?: MediaUnderstandingModelConfig[];
  /**
   * Echo the audio transcript back to the originating chat before agent processing.
   * Lets users verify what was heard. Default: false.
   */
  echoTranscript?: boolean;
  /**
   * Format string for the echoed transcript. Use `{transcript}` as placeholder.
   * Default: '📝 "{transcript}"'
   */
  echoFormat?: string;
};
type LinkModelConfig = {
  /** Use a CLI command for link processing. */ type?: "cli" /** CLI binary (required when type=cli). */;
  command: string /** CLI args (template-enabled). */;
  args?: string[] /** Optional timeout override (seconds) for this model entry. */;
  timeoutSeconds?: number;
};
type LinkToolsConfig = {
  /** Enable link understanding when models are configured. */ enabled?: boolean /** Optional scope gating for understanding. */;
  scope?: MediaUnderstandingScopeConfig /** Max number of links to process per message. */;
  maxLinks?: number /** Default timeout (seconds). */;
  timeoutSeconds?: number /** Ordered model list (fallbacks in order). */;
  models?: LinkModelConfig[];
};
type MediaToolsConfig = {
  /** Shared model list applied across image/audio/video. */ models?: MediaUnderstandingModelConfig[] /** Max concurrent media understanding runs. */;
  concurrency?: number;
  asyncCompletion?: {
    /**
     * Deprecated compatibility flag. Async media generation completions stay
     * requester-session mediated so source delivery policy remains agent-owned.
     */
    directSend?: boolean;
  };
  image?: MediaUnderstandingConfig;
  audio?: MediaUnderstandingConfig;
  video?: MediaUnderstandingConfig;
};
type ToolProfileId = "minimal" | "coding" | "messaging" | "full";
type ToolLoopDetectionDetectorConfig = {
  /** Enable warning/blocking for repeated identical calls to the same tool/params. */ genericRepeat?: boolean /** Enable warning/blocking for known no-progress polling loops. */;
  knownPollNoProgress?: boolean /** Enable warning/blocking for no-progress ping-pong alternating patterns. */;
  pingPong?: boolean;
};
type ToolLoopPostCompactionGuardConfig = {
  /** How many attempts post-compaction the guard remains armed (default: 3). */ windowSize?: number;
};
type ToolLoopDetectionConfig = {
  /** Enable tool-loop protection (default: false). */ enabled?: boolean /** Maximum tool call history entries retained for loop detection (default: 30). */;
  historySize?: number /** Warning threshold before a warning-only loop classification (default: 10). */;
  warningThreshold?: number /** Block repeated calls to the same unavailable tool after this many misses (default: 10). */;
  unknownToolThreshold?: number /** Critical threshold for blocking repetitive loops (default: 20). */;
  criticalThreshold?: number /** Global no-progress breaker threshold (default: 30). */;
  globalCircuitBreakerThreshold?: number /** Detector toggles. */;
  detectors?: ToolLoopDetectionDetectorConfig /** Post-compaction loop guard: aborts when the agent repeats the same (tool, args, result) immediately after auto-compaction-retry. */;
  postCompactionGuard?: ToolLoopPostCompactionGuardConfig;
};
type ToolSearchConfig =
  | boolean
  | {
      /** Enable compact search/call cataloging for large tool sets. */ enabled?: boolean /** Exposed model surface. "code" exposes tool_search_code; "tools" exposes structured fallback tools; "directory" keeps a bounded directory plus selected schemas visible while deferring the rest behind search/describe/call. */;
      mode?:
        | "code"
        | "tools"
        | "directory" /** Timeout in milliseconds for one tool_search_code execution. Runtime clamps to 1s..60s. */;
      codeTimeoutMs?: number /** Default search result count when the model omits a limit. Runtime clamps to maxSearchLimit. */;
      searchDefaultLimit?: number /** Maximum search result count. Runtime clamps to 1..50. */;
      maxSearchLimit?: number;
    };
type CodeModeConfig =
  | boolean
  | {
      /** Enable generic OpenClaw code mode. Default: false. */ enabled?: boolean /** Guest runtime. Only quickjs-wasi is supported. */;
      runtime?: "quickjs-wasi" /** Model-facing mode. Only "only" is supported: expose exec/wait and hide normal tools. */;
      mode?: "only" /** Accepted source languages. */;
      languages?: Array<
        "javascript" | "typescript"
      > /** Wall-clock limit in milliseconds for one exec or wait call. */;
      timeoutMs?: number /** QuickJS heap limit in bytes. */;
      memoryLimitBytes?: number /** Maximum serialized output bytes. */;
      maxOutputBytes?: number /** Maximum serialized snapshot bytes. */;
      maxSnapshotBytes?: number /** Maximum concurrent nested tool calls. */;
      maxPendingToolCalls?: number /** Retention for suspended snapshots. */;
      snapshotTtlSeconds?: number /** Default search result count for tools.search. */;
      searchDefaultLimit?: number /** Maximum search result count for tools.search. */;
      maxSearchLimit?: number;
    };
type SessionsToolsVisibility = "self" | "tree" | "agent" | "all";
type ToolPolicyConfig = {
  /** Exact tool names allowed after the selected profile is applied. */ allow?: string[];
  /**
   * Additional allowlist entries merged into the effective allowlist.
   *
   * Intended for additive configuration (e.g., "also allow lobster") without forcing
   * users to replace/duplicate an existing allowlist or profile.
   */
  alsoAllow?: string[] /** Exact tool names denied after allow/profile expansion; deny wins. */;
  deny?: string[] /** Built-in profile used as the base policy before allow/deny merges. */;
  profile?: ToolProfileId;
};
type GroupToolPolicyConfig = {
  /** Sender-specific allowlist entries merged into the group tool policy. */ allow?: string[] /** Additional allowlist entries merged into allow. */;
  alsoAllow?: string[] /** Sender-specific deny entries; deny wins over allow/profile policy. */;
  deny?: string[];
};
declare const TOOLS_BY_SENDER_KEY_TYPES: readonly ["channel", "id", "e164", "username", "name"];
type ToolsBySenderKeyType = (typeof TOOLS_BY_SENDER_KEY_TYPES)[number];
declare function parseToolsBySenderTypedKey(rawKey: string):
  | {
      type: ToolsBySenderKeyType;
      value: string;
    }
  | undefined;
/**
 * Per-sender overrides.
 *
 * Prefer explicit key prefixes:
 * - channel:<channelId>:<senderId>
 * - id:<senderId>
 * - e164:<phone>
 * - username:<handle>
 * - name:<display-name>
 * - * (wildcard)
 *
 * Legacy unprefixed keys are supported for backward compatibility and are matched as senderId only.
 */
type GroupToolPolicyBySenderConfig = Record<string, GroupToolPolicyConfig>;
type ExecToolConfig = {
  /** Exec host routing (default: auto). */ host?:
    | "auto"
    | "sandbox"
    | "gateway"
    | "node" /** Normalized exec policy mode. Prefer this over raw security/ask knobs. */;
  mode?:
    | "deny"
    | "allowlist"
    | "ask"
    | "auto"
    | "full" /** Exec security mode (default: full; sandbox host defaults to deny). */;
  security?: "deny" | "allowlist" | "full" /** Exec ask mode (default: off). */;
  ask?: "off" | "on-miss" | "always" /** Default node binding for exec.host=node (node id/name). */;
  node?: string /** Directories to prepend to PATH when running exec (gateway/sandbox). */;
  pathPrepend?: string[] /** Safe stdin-only binaries that can run without allowlist entries. */;
  safeBins?: string[];
  /**
   * Require explicit approval for interpreter inline-eval forms (`python -c`, `node -e`, etc.).
   * Prevents silent allowlist reuse and allow-always persistence for those forms.
   */
  strictInlineEval?: boolean /** Render parser-derived command highlights in exec approval prompts (default: false). */;
  commandHighlighting?: boolean /** Extra explicit directories trusted for safeBins path checks (never derived from PATH). */;
  safeBinTrustedDirs?: string[] /** Optional custom safe-bin profiles for entries in tools.exec.safeBins. */;
  safeBinProfiles?: Record<
    string,
    SafeBinProfileFixture
  > /** Model-backed reviewer used by tools.exec.mode=auto before falling back to human approval. */;
  reviewer?: {
    /** Optional reviewer model override (provider/model or agent model config). */ model?: AgentModelConfig /** Reviewer timeout in milliseconds (default: 30000). */;
    timeoutMs?: number;
  } /** Default time (ms) before an exec command auto-backgrounds. */;
  backgroundMs?: number /** Default timeout (seconds) before auto-killing exec commands. */;
  timeoutSec?: number /** Emit a running notice (ms) when approval-backed exec runs long (default: 10000, 0 = off). */;
  approvalRunningNoticeMs?: number /** How long to keep finished sessions in memory (ms). */;
  cleanupMs?: number /** Emit a system event and heartbeat when a backgrounded exec exits. */;
  notifyOnExit?: boolean;
  /**
   * Also emit success exit notifications when a backgrounded exec has no output.
   * Default false to reduce context noise.
   */
  notifyOnExitEmptySuccess?: boolean /** apply_patch subtool configuration. */;
  applyPatch?: {
    /** Enable apply_patch for OpenAI models (default: true; set false to disable). */ enabled?: boolean;
    /**
     * Restrict apply_patch paths to the workspace directory.
     * Default: true (safer; does not affect read/write/edit).
     */
    workspaceOnly?: boolean;
    /**
     * Optional allowlist of model ids that can use apply_patch.
     * Accepts either raw ids (e.g. "gpt-5.4") or full ids (e.g. "openai/gpt-5.4").
     */
    allowModels?: string[];
  };
};
type FsToolsConfig = {
  /**
   * Restrict filesystem tools (read/write/edit/apply_patch) to the agent workspace directory.
   * Default: false (unrestricted, matches legacy behavior).
   */
  workspaceOnly?: boolean;
};
type SessionsSpawnToolsConfig = {
  attachments?: {
    /** Enable inline attachments for sessions_spawn. */ enabled?: boolean;
    maxTotalBytes?: number;
    maxFiles?: number;
    maxFileBytes?: number;
    retainOnSessionKeep?: boolean;
  };
};
type AgentToolsConfig = {
  /** Base tool profile applied before allow/deny lists. */ profile?: ToolProfileId;
  allow?: string[] /** Additional allowlist entries merged into allow and/or profile allowlist. */;
  alsoAllow?: string[];
  deny?: string[] /** Optional tool policy overrides keyed by provider id or "provider/model". */;
  byProvider?: Record<
    string,
    ToolPolicyConfig
  > /** Per-sender tool policy overrides keyed by sender identity. */;
  toolsBySender?: GroupToolPolicyBySenderConfig /** Per-agent code mode override; merges over the top-level tools.codeMode config. */;
  codeMode?: CodeModeConfig /** Per-agent elevated exec gate (can only further restrict global tools.elevated). */;
  elevated?: {
    /** Enable or disable elevated mode for this agent (default: true). */ enabled?: boolean /** Approved senders for /elevated (per-provider allowlists). */;
    allowFrom?: AgentElevatedAllowFromConfig;
  } /** Exec tool defaults for this agent. */;
  exec?: ExecToolConfig /** Filesystem tool path guards. */;
  fs?: FsToolsConfig /** Runtime loop detection for repetitive/ stuck tool-call patterns. */;
  loopDetection?: ToolLoopDetectionConfig /** Message tool configuration for this agent. */;
  message?: MessageToolsConfig;
  sandbox?: {
    tools?: {
      allow?: string[] /** Additional allowlist entries merged into allow and/or the sandbox default allowlist. */;
      alsoAllow?: string[];
      deny?: string[];
    };
  };
};
type MemorySearchConfig = {
  /** Enable vector memory search (default: true). */ enabled?: boolean /** Sources to index and search (default: ["memory"]). */;
  sources?: Array<
    "memory" | "sessions"
  > /** Extra paths to include in memory search (directories or .md files). */;
  extraPaths?: string[] /** Optional QMD-specific extra collections for cross-agent search. */;
  qmd?: {
    /** Additional QMD collections appended for this agent's search scope. */ extraCollections?: MemoryQmdIndexPath[];
  } /** Optional multimodal file indexing for selected extra paths. */;
  multimodal?: {
    /** Enable image/audio embeddings from extraPaths. */ enabled?: boolean /** Which non-text file types to index. */;
    modalities?: Array<
      "image" | "audio" | "all"
    > /** Max bytes allowed per multimodal file before it is skipped. */;
    maxFileBytes?: number;
  } /** Experimental memory search settings. */;
  experimental?: {
    /** Enable session transcript indexing (experimental, default: false). */ sessionMemory?: boolean;
  } /** Memory embedding provider adapter id. */;
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<
      string,
      string
    > /** Max concurrent non-batch embedding tasks during indexing. Useful for slower local providers such as Ollama. */;
    nonBatchConcurrency?: number;
    batch?: {
      /** Enable batch API for embedding indexing (OpenAI/Gemini; default: true). */ enabled?: boolean /** Wait for batch completion (default: true). */;
      wait?: boolean /** Max concurrent batch jobs (default: 2). */;
      concurrency?: number /** Poll interval in ms (default: 5000). */;
      pollIntervalMs?: number /** Timeout in minutes (default: 60). */;
      timeoutMinutes?: number;
    };
  } /** Fallback memory embedding provider adapter id when embeddings fail. */;
  fallback?: string /** Embedding model id (remote) or alias (local). */;
  model?: string /** Optional provider-specific embedding input_type for query and document requests. */;
  inputType?: string /** Optional provider-specific embedding input_type for query-time memory search. */;
  queryInputType?: string /** Optional provider-specific embedding input_type for document/index embeddings. */;
  documentInputType?: string;
  /**
   * Gemini embedding-2 models only: output vector dimensions.
   * Supported values today are 768, 1536, and 3072.
   */
  outputDimensionality?: number /** Local embedding settings (node-llama-cpp). */;
  local?: {
    /** GGUF model path or hf: URI. */ modelPath?: string /** Optional cache directory for local models. */;
    modelCacheDir?: string;
    /**
     * Context window size for the local embedding context (default: 4096).
     * Use `"auto"` to defer to node-llama-cpp, which picks up to the model's
     * trained maximum — not recommended for 8B+ models.
     */
    contextSize?: number | "auto";
  } /** Index storage configuration. */;
  store?: {
    driver?: "sqlite";
    fts?: {
      /** FTS5 tokenizer (default: "unicode61"). Use "trigram" for CJK text support. */ tokenizer?:
        | "unicode61"
        | "trigram";
    };
    vector?: {
      /** Enable sqlite-vec extension for vector search (default: true). */ enabled?: boolean /** Optional override path to sqlite-vec extension (.dylib/.so/.dll). */;
      extensionPath?: string;
    };
    cache?: {
      /** Enable embedding cache (default: true). */ enabled?: boolean /** Optional max cache entries per provider/model. */;
      maxEntries?: number;
    };
  } /** Chunking configuration. */;
  chunking?: {
    tokens?: number;
    overlap?: number;
  } /** Sync behavior. */;
  sync?: {
    onSessionStart?: boolean;
    onSearch?: boolean;
    watch?: boolean;
    watchDebounceMs?: number;
    intervalMinutes?: number;
    /**
     * Timeout in seconds for inline embedding batches during memory indexing.
     * Unset uses provider defaults: 600s for local/self-hosted providers, 120s for hosted providers.
     */
    embeddingBatchTimeoutSeconds?: number;
    sessions?: {
      /** Minimum appended bytes before session transcripts are reindexed. */ deltaBytes?: number /** Minimum appended JSONL lines before session transcripts are reindexed. */;
      deltaMessages?: number /** Force session reindex after compaction-triggered transcript updates (default: true). */;
      postCompactionForce?: boolean;
    };
  } /** Query behavior. */;
  query?: {
    maxResults?: number;
    minScore?: number;
    hybrid?: {
      /** Enable hybrid BM25 + vector search (default: true). */ enabled?: boolean /** Weight for vector similarity when merging results (0-1). */;
      vectorWeight?: number /** Weight for BM25 text relevance when merging results (0-1). */;
      textWeight?: number /** Multiplier for candidate pool size (default: 4). */;
      candidateMultiplier?: number /** Optional MMR re-ranking for result diversity. */;
      mmr?: {
        /** Enable MMR re-ranking (default: false). */ enabled?: boolean /** Lambda: 0 = max diversity, 1 = max relevance (default: 0.7). */;
        lambda?: number;
      } /** Optional temporal decay to boost recency in hybrid scoring. */;
      temporalDecay?: {
        /** Enable temporal decay (default: false). */ enabled?: boolean /** Half-life in days for exponential decay (default: 30). */;
        halfLifeDays?: number;
      };
    };
  } /** Index cache behavior. */;
  cache?: {
    /** Cache chunk embeddings in SQLite (default: true). */ enabled?: boolean /** Optional cap on cached embeddings (best-effort). */;
    maxEntries?: number;
  };
};
type ToolsConfig = {
  /** Base tool profile applied before allow/deny lists. */ profile?: ToolProfileId;
  allow?: string[] /** Additional allowlist entries merged into allow and/or profile allowlist. */;
  alsoAllow?: string[];
  deny?: string[] /** Optional tool policy overrides keyed by provider id or "provider/model". */;
  byProvider?: Record<
    string,
    ToolPolicyConfig
  > /** Per-sender tool policy overrides keyed by sender identity. */;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  web?: {
    search?: {
      /** Enable managed web_search and optional Codex-native web search. */ enabled?: boolean /** Search provider id. */;
      provider?: string /** Shared API key slot used by providers that do not need nested config. */;
      apiKey?: SecretInput /** Default search results count (1-10). */;
      maxResults?: number /** Timeout in seconds for search requests. */;
      timeoutSeconds?: number /** Cache TTL in minutes for search results. */;
      cacheTtlMinutes?: number /** Optional native Codex web search for Codex-capable models. */;
      openaiCodex?: {
        /** Enable native Codex web search for eligible models. */ enabled?: boolean /** Prefer cached or explicitly request live access. Unrestricted Codex turns resolve cached to live. */;
        mode?:
          | "cached"
          | "live" /** Optional allowlist of domains passed to the native Codex tool. */;
        allowedDomains?: string[] /** Optional Codex native search context size hint. */;
        contextSize?:
          | "low"
          | "medium"
          | "high" /** Optional approximate user location passed to the native Codex tool. */;
        userLocation?: {
          country?: string;
          region?: string;
          city?: string;
          timezone?: string;
        };
      };
    } & Record<
      string,
      unknown
    > /** X (formerly Twitter) search tool configuration using xAI Grok. */;
    x_search?: {
      /** Enable X search tool (default: true when xAI auth is available via plugin config or XAI_API_KEY). */ enabled?: boolean /** Model id to use for X search. */;
      model?: string /** Keep inline citations in the xAI response payload when available. */;
      inlineCitations?: boolean /** Optional max search/tool turns for xAI to use internally. */;
      maxTurns?: number /** Timeout in seconds for X search requests. */;
      timeoutSeconds?: number /** Cache TTL in minutes for X search results. */;
      cacheTtlMinutes?: number;
    };
    fetch?: {
      /** Enable web fetch tool (default: true). */ enabled?: boolean /** Web fetch fallback provider id. */;
      provider?: string /** Max characters to return from fetched content. */;
      maxChars?: number /** Hard cap for maxChars (tool or config), defaults to 50000. */;
      maxCharsCap?: number /** Max download size before truncation, defaults to 2000000. */;
      maxResponseBytes?: number /** Timeout in seconds for fetch requests. */;
      timeoutSeconds?: number /** Cache TTL in minutes for fetched content. */;
      cacheTtlMinutes?: number /** Maximum number of redirects to follow (default: 3). */;
      maxRedirects?: number /** Override User-Agent header for fetch requests. */;
      userAgent?: string /** Use Readability to extract main content (default: true). */;
      readability?: boolean /** Route web_fetch through a trusted HTTP(S) env proxy and let the proxy resolve DNS. Enable only when that proxy enforces outbound policy. */;
      useTrustedEnvProxy?: boolean /** SSRF policy configuration for web_fetch. */;
      ssrfPolicy?: {
        /** Allow RFC 2544 benchmark range IPs (198.18.0.0/15) for fake-IP proxy compatibility (e.g., Clash TUN mode, Surge). */ allowRfc2544BenchmarkRange?: boolean /** Allow IPv6 Unique Local Addresses (fc00::/7) for trusted fake-IP proxy compatibility. */;
        allowIpv6UniqueLocalRange?: boolean;
      };
    };
  };
  media?: MediaToolsConfig;
  links?: LinkToolsConfig /** Message tool configuration. */;
  message?: MessageToolsConfig;
  agentToAgent?: {
    /** Enable agent-to-agent messaging tools. Default: false. */ enabled?: boolean /** Allowlist of agent ids or patterns (implementation-defined). */;
    allow?: string[];
  };
  /**
   * Session tool visibility controls which sessions can be targeted by session tools
   * (sessions_list, sessions_history, sessions_search, sessions_send).
   *
   * Default: "tree" (current session + spawned subagent sessions).
   */
  sessions?: {
    /**
     * - "self": only the current session
     * - "tree": current session + sessions spawned by this session (default)
     * - "agent": any session belonging to the current agent id (can include other users)
     * - "all": any session (cross-agent still requires tools.agentToAgent)
     */
    visibility?: SessionsToolsVisibility;
  } /** Elevated exec permissions for the host machine. */;
  elevated?: {
    /** Enable or disable elevated mode (default: true). */ enabled?: boolean /** Approved senders for /elevated (per-provider allowlists). */;
    allowFrom?: AgentElevatedAllowFromConfig;
  } /** Exec tool defaults. */;
  exec?: ExecToolConfig /** Filesystem tool path guards. */;
  fs?: FsToolsConfig /** Runtime loop detection for repetitive/ stuck tool-call patterns. */;
  loopDetection?: ToolLoopDetectionConfig /** Compact large OpenClaw, MCP, and client tool catalogs behind search/call tools. */;
  toolSearch?: ToolSearchConfig /** Generic code mode: expose exec/wait and hide normal tools behind a QuickJS catalog bridge. */;
  codeMode?: CodeModeConfig /** sessions_spawn tool configuration. */;
  sessions_spawn?: SessionsSpawnToolsConfig /** Sub-agent tool policy defaults (deny wins). */;
  subagents?: {
    tools?: {
      allow?: string[] /** Additional allowlist entries merged into allow and/or default sub-agent denylist. */;
      alsoAllow?: string[];
      deny?: string[];
    };
  } /** Sandbox tool policy defaults (deny wins). */;
  sandbox?: {
    tools?: {
      allow?: string[] /** Additional allowlist entries merged into allow and/or the sandbox default allowlist. */;
      alsoAllow?: string[];
      deny?: string[];
    };
  } /** Experimental tool flags. Default off unless explicitly enabled, except strict-agentic GPT-5 OpenAI/Codex runs may auto-enable `planTool`. */;
  experimental?: {
    /** Enable the structured `update_plan` tool explicitly outside strict-agentic execution mode. */ planTool?: boolean;
  };
};
type MessageToolsConfig = {
  /**
   * @deprecated Use tools.message.crossContext settings.
   * Allows cross-context sends across providers.
   */
  allowCrossContextSend?: boolean;
  crossContext?: {
    /** Allow sends to other channels within the same provider (default: true). */ allowWithinProvider?: boolean /** Allow sends across different providers (default: false). */;
    allowAcrossProviders?: boolean /** Cross-context marker configuration. */;
    marker?: {
      /** Enable origin markers for cross-context sends (default: true). */ enabled?: boolean /** Text prefix template, supports {channel}. */;
      prefix?: string /** Text suffix template, supports {channel}. */;
      suffix?: string;
    };
  };
  actions?: {
    /** Message action names exposed and accepted by the message tool. */ allow?: string[];
  };
  broadcast?: {
    /** Enable broadcast action (default: true). */ enabled?: boolean;
  };
};
//#endregion
//#region src/config/types.queue.d.ts
/** Queue handling mode for inbound channel messages. */
type QueueMode = "steer" | "followup" | "collect" | "interrupt";
type QueueDropPolicy = "old" | "new" | "summarize";
type QueueModeByProvider = {
  whatsapp?: QueueMode;
  telegram?: QueueMode;
  discord?: QueueMode;
  irc?: QueueMode;
  googlechat?: QueueMode;
  slack?: QueueMode;
  mattermost?: QueueMode;
  signal?: QueueMode;
  imessage?: QueueMode;
  msteams?: QueueMode;
  webchat?: QueueMode;
  matrix?: QueueMode;
};
//#endregion
//#region src/config/types.tts.d.ts
type TtsProvider = string;
type TtsMode = "final" | "all";
type TtsAutoMode = "off" | "always" | "inbound" | "tagged";
type TtsModelOverrideConfig = {
  /** Enable model-provided overrides for TTS. */ enabled?: boolean /** Allow model-provided TTS text blocks. */;
  allowText?: boolean /** Allow model-provided provider override (default: false). */;
  allowProvider?: boolean /** Allow model-provided voice/voiceId override. */;
  allowVoice?: boolean /** Allow model-provided modelId override. */;
  allowModelId?: boolean /** Allow model-provided voice settings override. */;
  allowVoiceSettings?: boolean /** Allow model-provided normalization or language overrides. */;
  allowNormalization?: boolean /** Allow model-provided seed override. */;
  allowSeed?: boolean;
};
type TtsProviderConfigMap = Record<string, Record<string, unknown>>;
type TtsPersonaFallbackPolicy = "preserve-persona" | "provider-defaults" | "fail";
type TtsPersonaPromptConfig = {
  profile?: string;
  scene?: string;
  sampleContext?: string;
  style?: string;
  accent?: string;
  pacing?: string;
  constraints?: string[];
};
type TtsPersonaConfig = {
  label?: string;
  description?: string /** Preferred provider for this persona. Explicit provider prefs still win. */;
  provider?: TtsProvider;
  fallbackPolicy?: TtsPersonaFallbackPolicy;
  prompt?: TtsPersonaPromptConfig /** Provider-specific persona bindings keyed by speech provider id. */;
  providers?: TtsProviderConfigMap;
};
type ResolvedTtsPersona = TtsPersonaConfig & {
  id: string;
};
type TtsConfig = {
  /** Auto-TTS mode (preferred). */ auto?: TtsAutoMode /** @deprecated Use auto. */;
  enabled?: boolean /** Apply TTS to final replies only or to all replies (tool/block/final). */;
  mode?: TtsMode /** Primary TTS provider (fallbacks are automatic). */;
  provider?: TtsProvider /** Active TTS persona id. */;
  persona?: string /** Named TTS personas. */;
  personas?: Record<
    string,
    TtsPersonaConfig
  > /** Optional model override for TTS auto-summary (provider/model or alias). */;
  summaryModel?: string /** Allow the model to override TTS parameters. */;
  modelOverrides?: TtsModelOverrideConfig /** Provider-specific TTS settings keyed by speech provider id. */;
  providers?: TtsProviderConfigMap /** Optional path for local TTS user preferences JSON. */;
  prefsPath?: string /** Hard cap for text sent to TTS (chars). */;
  maxTextLength?: number /** API request timeout (ms). */;
  timeoutMs?: number;
};
//#endregion
//#region src/config/types.messages.d.ts
type MentionPatternsMode = "allow" | "deny";
type MentionPatternsPolicyConfig = {
  mode?: MentionPatternsMode;
  allowIn?: string[];
  denyIn?: string[];
};
type GroupChatConfig = {
  mentionPatterns?: string[];
  historyLimit?: number;
  /**
   * Controls how unmentioned always-on group chatter is submitted.
   * Default: "user_request".
   */
  unmentionedInbound?: "user_request" | "room_event";
  /**
   * Controls how group/channel inbound events produce visible room replies. The
   * message-tool mode requires explicit message sends for visible room output;
   * final text stays private when the model misses the tool.
   * Default: "automatic".
   */
  visibleReplies?: "automatic" | "message_tool";
};
type DmConfig = {
  historyLimit?: number;
};
type QueueConfig = {
  mode?: QueueMode;
  byChannel?: QueueModeByProvider;
  debounceMs?: number /** Per-channel debounce overrides (ms). */;
  debounceMsByChannel?: InboundDebounceByProvider;
  cap?: number;
  drop?: QueueDropPolicy;
};
type InboundDebounceByProvider = Record<string, number>;
type InboundDebounceConfig = {
  debounceMs?: number;
  byChannel?: InboundDebounceByProvider;
};
type BroadcastStrategy = "parallel" | "sequential";
type BroadcastConfig = {
  /** Default processing strategy for broadcast peers. */ strategy?: BroadcastStrategy;
  /**
   * Map peer IDs to arrays of agent IDs that should ALL process messages.
   *
   * Note: the index signature includes `undefined` so `strategy?: ...` remains type-safe.
   */
  [peerId: string]: string[] | BroadcastStrategy | undefined;
};
type AudioConfig = {
  /** @deprecated Use tools.media.audio.models instead. */ transcription?: {
    command: string[];
    timeoutSeconds?: number;
  };
};
type StatusReactionsEmojiConfig = {
  queued?: string;
  thinking?: string;
  tool?: string;
  coding?: string;
  web?: string;
  deploy?: string;
  build?: string;
  concierge?: string;
  done?: string;
  error?: string;
  stallSoft?: string;
  stallHard?: string;
  compacting?: string;
};
type StatusReactionsTimingConfig = {
  /** Debounce interval for intermediate states (ms). Default: 700. */ debounceMs?: number /** Soft stall warning timeout (ms). Default: 10000. */;
  stallSoftMs?: number /** Hard stall warning timeout (ms). Default: 30000. */;
  stallHardMs?: number /** How long to hold done emoji before cleanup (ms). Default: 1500. */;
  doneHoldMs?: number /** How long to hold error emoji before cleanup (ms). Default: 2500. */;
  errorHoldMs?: number;
};
type StatusReactionsConfig = {
  /** Enable lifecycle status reactions (default: false). */ enabled?: boolean /** Override default emojis. */;
  emojis?: StatusReactionsEmojiConfig /** Override default timing. */;
  timing?: StatusReactionsTimingConfig;
};
type MessagesConfig = {
  /** @deprecated Use `whatsapp.messagePrefix` (WhatsApp-only inbound prefix). */ messagePrefix?: string;
  /**
   * Controls how source inbound events produce visible replies across direct,
   * group, and channel conversations. Group/channel events still default to
   * `groupChat.visibleReplies` when it is set.
   *
   * Default: "automatic". In group/channel rooms, "message_tool" keeps final
   * text private unless the model sends visibly through the message tool.
   */
  visibleReplies?: "automatic" | "message_tool";
  /**
   * Prefix auto-added to all outbound replies.
   *
   * - string: explicit prefix (may include template variables)
   * - special value: `"auto"` derives `[{agents.list[].identity.name}]` for the routed agent (when set)
   *
   * Supported template variables (case-insensitive):
   * - `{model}` - short model name (e.g., `claude-opus-4-6`, `gpt-4o`)
   * - `{modelFull}` - full model identifier (e.g., `anthropic/claude-opus-4-6`)
   * - `{provider}` - provider name (e.g., `anthropic`, `openai`)
   * - `{thinkingLevel}` or `{think}` - current thinking level (`high`, `low`, `off`)
   * - `{identity.name}` or `{identityName}` - agent identity name
   *
   * Example: `"[{model} | think:{thinkingLevel}]"` → `"[claude-opus-4-6 | think:high]"`
   *
   * Unresolved variables remain as literal text (e.g., `{model}` if context unavailable).
   *
   * Default: none
   */
  responsePrefix?: string /** Custom `/usage full` footer template, inline or JSON file path. */;
  usageTemplate?: string | Record<string, unknown>;
  /**
   * Default per-reply usage footer mode (`responseUsage`) seeded into any session
   * that has not set its own via `/usage`. Precedence: session value → channel entry
   * → `default` → `off`. Absent ⇒ `off` (unchanged behavior).
   *
   * - string: one default for every channel, e.g. `"full"`.
   * - object: per-channel with a fallback, e.g. `{ "default": "off", "discord": "full" }`.
   */
  responseUsage?:
    | "on"
    | "off"
    | "tokens"
    | "full"
    | {
        default?: "on" | "off" | "tokens" | "full";
        [channel: string]: "on" | "off" | "tokens" | "full" | undefined;
      };
  groupChat?: GroupChatConfig;
  queue?: QueueConfig /** Debounce rapid inbound messages per sender (global + per-channel overrides). */;
  inbound?: InboundDebounceConfig /** Emoji reaction used to acknowledge inbound messages (empty disables). */;
  ackReaction?: string /** When to send ack reactions. Default: "group-mentions". */;
  ackReactionScope?:
    | "group-mentions"
    | "group-all"
    | "direct"
    | "all"
    | "off"
    | "none" /** Remove ack reaction after reply is sent (default: false). */;
  removeAckAfterReply?: boolean /** Lifecycle status reactions configuration. */;
  statusReactions?: StatusReactionsConfig /** When true, suppress ⚠️ tool-error warnings from being shown to the user. Default: false. */;
  suppressToolErrors?: boolean /** Text-to-speech settings for outbound replies. */;
  tts?: TtsConfig;
};
type NativeCommandsSetting = boolean | "auto";
type CommandOwnerDisplay = "raw" | "hash";
/**
 * Per-provider allowlist for command authorization.
 * Keys are channel IDs (e.g., "discord", "whatsapp") or "*" for global default.
 * Values are arrays of sender IDs allowed to use commands on that channel.
 */
type CommandAllowFrom = Record<string, Array<string | number>>;
type CommandsConfig = {
  /** Enable native command registration when supported (default: "auto"). */ native?: NativeCommandsSetting /** Enable native skill command registration when supported (default: "auto"). */;
  nativeSkills?: NativeCommandsSetting /** Enable text command parsing (default: true). */;
  text?: boolean /** Allow bash chat command (`!`; `/bash` alias) (default: false). */;
  bash?: boolean /** How long bash waits before backgrounding (default: 2000; 0 backgrounds immediately). */;
  bashForegroundMs?: number /** Allow /config command (default: false). */;
  config?: boolean /** Allow /mcp command for OpenClaw-managed MCP settings (default: false). */;
  mcp?: boolean /** Allow /plugins command for plugin listing and enablement toggles (default: false). */;
  plugins?: boolean /** Allow /debug command (default: false). */;
  debug?: boolean /** Allow restart commands/tools (default: true). */;
  restart?: boolean /** Enforce access-group allowlists/policies for commands (default: true). */;
  useAccessGroups?: boolean /** Explicit owner allowlist for owner-scoped commands (channel-native IDs). */;
  ownerAllowFrom?: Array<string | number> /** How owner IDs are rendered in system prompts. */;
  ownerDisplay?: CommandOwnerDisplay /** Secret used to key owner ID hashes when ownerDisplay is "hash". */;
  ownerDisplaySecret?: string;
  /**
   * Per-provider allowlist restricting who can use slash commands.
   * If set, overrides the channel's allowFrom for command authorization.
   * Use "*" key for global default, provider-specific keys override the global.
   * Example: { "*": ["user1"], discord: ["user:123"] }
   */
  allowFrom?: CommandAllowFrom;
};
type ProviderCommandsConfig = {
  /** Override native command registration for this provider (bool or "auto"). */ native?: NativeCommandsSetting /** Override native skill command registration for this provider (bool or "auto"). */;
  nativeSkills?: NativeCommandsSetting;
};
//#endregion
//#region src/config/types.approvals.d.ts
type NativeExecApprovalEnableMode = boolean | "auto";
type ExecApprovalForwardingMode = "session" | "targets" | "both";
type ExecApprovalForwardTarget = {
  /** Channel id (e.g. "discord", "slack", or plugin channel id). */ channel: string /** Destination id (channel id, user id, etc. depending on channel). */;
  to: string /** Optional account id for multi-account channels. */;
  accountId?: string /** Optional thread id to reply inside a thread. */;
  threadId?: string | number;
};
type ExecApprovalForwardingConfig = {
  /** Enable forwarding exec approvals to chat channels. Default: false. */ enabled?: boolean /** Delivery mode (session=origin chat, targets=config targets, both=both). Default: session. */;
  mode?: ExecApprovalForwardingMode /** Only forward approvals for these agent IDs. Omit = all agents. */;
  agentFilter?: string[] /** Only forward approvals matching these session key patterns (substring or regex). */;
  sessionFilter?: string[] /** Explicit delivery targets (used when mode includes targets). */;
  targets?: ExecApprovalForwardTarget[];
};
type ApprovalsConfig = {
  exec?: ExecApprovalForwardingConfig;
  plugin?: ExecApprovalForwardingConfig;
};
//#endregion
//#region src/config/types.bot-loop-protection.d.ts
type ChannelBotLoopProtectionConfig = {
  /** Enable pair loop protection for channels that support it. */ enabled?: boolean /** Maximum events a sender/receiver pair may exchange within the window. */;
  maxEventsPerWindow?: number /** Sliding window length in seconds. */;
  windowSeconds?: number /** Cooldown seconds applied to a pair after the limit is hit. */;
  cooldownSeconds?: number;
};
//#endregion
//#region src/config/types.channel-health.d.ts
type ChannelHeartbeatVisibilityConfig = {
  /** Show HEARTBEAT_OK acknowledgments in chat (default: false). */ showOk?: boolean /** Show heartbeat alerts with actual content (default: true). */;
  showAlerts?: boolean /** Emit indicator events for UI status display (default: true). */;
  useIndicator?: boolean;
};
type ChannelHealthMonitorConfig = {
  /**
   * Enable channel-health-monitor restarts for this channel or account.
   * Inherits the global gateway setting when omitted.
   */
  enabled?: boolean;
};
//#endregion
//#region src/config/types.slack.d.ts
type SlackDmConfig = {
  /** If false, ignore all incoming Slack DMs. Default: true. */ enabled?: boolean /** Direct message access policy (default: pairing). */;
  policy?: DmPolicy /** Allowlist for DM senders (ids). */;
  allowFrom?: Array<string | number> /** If true, allow group DMs (default: false). */;
  groupEnabled?: boolean /** Optional allowlist for group DM channels (ids or slugs). */;
  groupChannels?: Array<
    string | number
  > /** @deprecated Prefer channels.slack.replyToModeByChatType.direct. */;
  replyToMode?: ReplyToMode;
};
type SlackChannelConfig = {
  /** If false, disable the bot in this channel. */ enabled?: boolean /** Require mentioning the bot to trigger replies. */;
  requireMention?: boolean;
  /**
   * Ignore room messages that mention another user or user group but not this bot.
   * Requires a resolved bot user ID. Default: false.
   */
  ignoreOtherMentions?: boolean /** Override Slack reply/thread behavior for this channel. */;
  replyToMode?: ReplyToMode /** Optional tool policy overrides for this channel. */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */;
  allowBots?:
    | boolean
    | "mentions" /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */;
  botLoopProtection?: ChannelBotLoopProtectionConfig /** Allowlist of users that can invoke the bot in this channel. */;
  users?: Array<string | number> /** Optional skill filter for this channel. */;
  skills?: string[] /** Optional system prompt for this channel. */;
  systemPrompt?: string;
};
type SlackReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SlackStreamingMode = "off" | "partial" | "block" | "progress";
type SlackStreamingProgressConfig = ChannelStreamingProgressConfig & {
  /** Opt in to Slack-native task cards for progress mode. Default: false. */ nativeTaskCards?: boolean;
};
type SlackChannelStreamingConfig = {
  mode?: StreamingMode;
  chunkMode?: TextChunkMode;
  nativeTransport?: boolean;
  preview?: ChannelStreamingPreviewConfig;
  progress?: SlackStreamingProgressConfig;
  block?: ChannelStreamingBlockConfig;
};
type SlackExecApprovalTarget = "dm" | "channel" | "both";
type SlackExecApprovalConfig = {
  /** Enable mode for Slack exec approvals on this account. Default: auto when approvers can be resolved; false disables. */ enabled?: NativeExecApprovalEnableMode /** Slack user IDs allowed to approve exec requests. Optional: falls back to commands.ownerAllowFrom when possible. */;
  approvers?: Array<
    string | number
  > /** Only forward approvals for these agent IDs. Omit = all agents. */;
  agentFilter?: string[] /** Only forward approvals matching these session key patterns (substring or regex). */;
  sessionFilter?: string[] /** Where to send approval prompts. Default: "dm". */;
  target?: SlackExecApprovalTarget;
};
type SlackCapabilitiesConfig =
  | string[]
  | {
      interactiveReplies?: boolean;
    };
type SlackActionConfig = {
  reactions?: boolean;
  messages?: boolean;
  pins?: boolean;
  search?: boolean;
  permissions?: boolean;
  memberInfo?: boolean;
  channelInfo?: boolean;
  emojiList?: boolean;
};
type SlackSlashCommandConfig = {
  /** Enable handling for the configured slash command (default: false). */ enabled?: boolean /** Slash command name (default: "openclaw"). */;
  name?: string /** Session key prefix for slash commands (default: "slack:slash"). */;
  sessionPrefix?: string /** Reply ephemerally (default: true). */;
  ephemeral?: boolean;
};
type SlackThreadConfig = {
  /** Scope for thread history context (thread|channel). Default: thread. */ historyScope?:
    | "thread"
    | "channel" /** If true, thread sessions inherit the parent channel transcript. Default: false. */;
  inheritParent?: boolean /** Maximum number of thread messages to fetch as context when starting a new thread session (default: 20). Set to 0 to disable thread history fetching. */;
  initialHistoryLimit?: number;
  /**
   * If true, require explicit @mention even inside threads where the bot has
   * previously participated. By default (false), replying in a thread where
   * the bot is a participant counts as an implicit mention and bypasses
   * requireMention gating. Set to true to suppress implicit thread mentions
   * so only explicit @bot mentions trigger replies in threads.
   */
  requireExplicitMention?: boolean;
};
type SlackSocketModeConfig = {
  /** Slack SDK pong timeout in milliseconds. Socket Mode only. Default: 15000. */ clientPingTimeout?: number /** Slack SDK server ping timeout in milliseconds. Socket Mode only. */;
  serverPingTimeout?: number /** Enable Slack SDK ping/pong transport logging. Socket Mode only. */;
  pingPongLoggingEnabled?: boolean;
};
type SlackRelayConfig = {
  /** Full relay websocket URL, including the route path. */ url?: string /** Bearer token used to authenticate the gateway websocket to the Slack relay. */;
  authToken?: SecretInput /** Gateway destination id registered with openclaw-slack-router. */;
  gatewayId?: string;
};
type SlackAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** Slack connection mode (socket|http|relay). Default: socket. */;
  mode?: "socket" | "http" | "relay";
  /**
   * Treat this account as one Slack Enterprise Grid org-wide installation.
   * The declaration is verified against auth.test during monitor startup.
   * DMs must be disabled or use dmPolicy="open" with effective allowFrom containing "*".
   */
  enterpriseOrgInstall?: boolean /** Slack SDK Socket Mode transport options. Ignored in HTTP mode. */;
  socketMode?: SlackSocketModeConfig /** Relay-delivered Slack event source. Used when mode is "relay". */;
  relay?: SlackRelayConfig /** Slack signing secret (required for HTTP mode). */;
  signingSecret?: SecretInput /** Slack Events API webhook path (default: /slack/events). */;
  webhookPath?: string /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: SlackCapabilitiesConfig /** Slack-native exec approval delivery + approver authorization. */;
  execApprovals?: SlackExecApprovalConfig /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Override native command registration for Slack (bool or "auto"). */;
  commands?: ProviderCommandsConfig /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** If false, do not start this Slack account. Default: true. */;
  enabled?: boolean;
  botToken?: SecretInput;
  appToken?: SecretInput;
  userToken?: SecretInput /** If true, restrict user token to read operations only. Default: true. */;
  userTokenReadOnly?: boolean /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */;
  allowBots?:
    | boolean
    | "mentions" /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */;
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /**
   * Break-glass override: allow mutable identity matching (name/slug) in allowlists.
   * Default behavior is ID-only matching.
   */
  dangerouslyAllowNameMatching?: boolean /** Default mention requirement for channel messages (default: true). */;
  requireMention?: boolean;
  /**
   * Controls how channel messages are handled:
   * - "open": channels bypass allowlists; mention-gating applies
   * - "disabled": block all channel messages
   * - "allowlist": only allow channels present in channels.slack.channels
   */
  groupPolicy?: GroupPolicy /** Scope configured groupChat mentionPatterns to selected Slack channel IDs. */;
  mentionPatterns?: MentionPatternsPolicyConfig /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */;
  contextVisibility?: ContextVisibilityMode /** Max channel messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by user ID. */;
  dms?: Record<string, DmConfig>;
  textChunkLimit?: number /** Pass through Slack chat.postMessage link unfurl control. Default: false. */;
  unfurlLinks?: boolean /** Pass through Slack chat.postMessage media unfurl control. Omitted by default. */;
  unfurlMedia?: boolean /** Streaming + chunking settings. Prefer this nested shape over legacy flat keys. */;
  streaming?: SlackChannelStreamingConfig;
  mediaMaxMb?: number /** Reaction notification mode (off|own|all|allowlist). Default: own. */;
  reactionNotifications?: SlackReactionNotificationMode /** Allowlist for reaction notifications when mode is allowlist. */;
  reactionAllowlist?: Array<
    string | number
  > /** Control reply threading when reply tags are present (off|first|all|batched). */;
  replyToMode?: ReplyToMode;
  /**
   * Optional per-chat-type reply threading overrides.
   * Example: { direct: "all", group: "first", channel: "off" }.
   */
  replyToModeByChatType?: Partial<
    Record<"direct" | "group" | "channel", ReplyToMode>
  > /** Thread session behavior. */;
  thread?: SlackThreadConfig;
  actions?: SlackActionConfig;
  slashCommand?: SlackSlashCommandConfig;
  /**
   * Canonical DM policy key. Doctor migrates legacy channels.slack.dm.policy here.
   * Legacy key: channels.slack.dm.policy.
   */
  dmPolicy?: DmPolicy;
  /**
   * Canonical DM allowlist. Doctor migrates legacy channels.slack.dm.allowFrom here.
   * Legacy key: channels.slack.dm.allowFrom.
   */
  allowFrom?: Array<
    string | number
  > /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?: string;
  dm?: SlackDmConfig;
  channels?: Record<
    string,
    SlackChannelConfig
  > /** Heartbeat visibility settings for this channel. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Outbound response prefix override for this channel/account. */;
  responsePrefix?: string;
  /**
   * Per-channel ack reaction override.
   * Slack uses shortcodes (e.g., "eyes") rather than unicode emoji.
   */
  ackReaction?: string /** Reaction emoji added while processing a reply (e.g. "hourglass_flowing_sand"). Removed when done. Useful as a typing indicator fallback when assistant mode is not enabled. */;
  typingReaction?: string;
};
type SlackConfig = {
  /** Optional per-account Slack configuration (multi-account). */ accounts?: Record<
    string,
    SlackAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & SlackAccountConfig;
//#endregion
export {
  TtsProviderConfigMap as $,
  CommandsConfig as A,
  ToolsBySenderKeyType as At,
  QueueConfig as B,
  MemoryQmdSearchMode as Bt,
  ExecApprovalForwardingMode as C,
  TOOLS_BY_SENDER_KEY_TYPES as Ct,
  BroadcastStrategy as D,
  ToolPolicyConfig as Dt,
  BroadcastConfig as E,
  ToolLoopPostCompactionGuardConfig as Et,
  MentionPatternsMode as F,
  MemoryConfig as Ft,
  TtsAutoMode as G,
  StatusReactionsEmojiConfig as H,
  MemoryQmdStartupMode as Ht,
  MentionPatternsPolicyConfig as I,
  MemoryQmdConfig as It,
  TtsModelOverrideConfig as J,
  TtsConfig as K,
  MessagesConfig as L,
  MemoryQmdIndexPath as Lt,
  GroupChatConfig as M,
  parseToolsBySenderTypedKey as Mt,
  InboundDebounceByProvider as N,
  MemoryBackend as Nt,
  CommandAllowFrom as O,
  ToolProfileId as Ot,
  InboundDebounceConfig as P,
  MemoryCitationsMode as Pt,
  TtsProvider as Q,
  NativeCommandsSetting as R,
  MemoryQmdLimitsConfig as Rt,
  ExecApprovalForwardingConfig as S,
  SessionsToolsVisibility as St,
  AudioConfig as T,
  ToolLoopDetectionDetectorConfig as Tt,
  StatusReactionsTimingConfig as U,
  MemoryQmdUpdateConfig as Ut,
  StatusReactionsConfig as V,
  MemoryQmdSessionConfig as Vt,
  ResolvedTtsPersona as W,
  TtsPersonaFallbackPolicy as X,
  TtsPersonaConfig as Y,
  TtsPersonaPromptConfig as Z,
  ChannelHealthMonitorConfig as _,
  MediaUnderstandingScopeMatch as _t,
  SlackChannelStreamingConfig as a,
  ExecToolConfig as at,
  ApprovalsConfig as b,
  MessageToolsConfig as bt,
  SlackExecApprovalConfig as c,
  GroupToolPolicyConfig as ct,
  SlackRelayConfig as d,
  MediaToolsConfig as dt,
  QueueDropPolicy as et,
  SlackSlashCommandConfig as f,
  MediaUnderstandingAttachmentsConfig as ft,
  SlackThreadConfig as g,
  MediaUnderstandingScopeConfig as gt,
  SlackStreamingProgressConfig as h,
  MediaUnderstandingModelConfig as ht,
  SlackChannelConfig as i,
  CodeModeConfig as it,
  DmConfig as j,
  ToolsConfig as jt,
  CommandOwnerDisplay as k,
  ToolSearchConfig as kt,
  SlackExecApprovalTarget as l,
  LinkModelConfig as lt,
  SlackStreamingMode as m,
  MediaUnderstandingConfig as mt,
  SlackActionConfig as n,
  QueueModeByProvider as nt,
  SlackConfig as o,
  FsToolsConfig as ot,
  SlackSocketModeConfig as p,
  MediaUnderstandingCapability as pt,
  TtsMode as q,
  SlackCapabilitiesConfig as r,
  AgentToolsConfig as rt,
  SlackDmConfig as s,
  GroupToolPolicyBySenderConfig as st,
  SlackAccountConfig as t,
  QueueMode as tt,
  SlackReactionNotificationMode as u,
  LinkToolsConfig as ut,
  ChannelHeartbeatVisibilityConfig as v,
  MediaUnderstandingScopeRule as vt,
  NativeExecApprovalEnableMode as w,
  ToolLoopDetectionConfig as wt,
  ExecApprovalForwardTarget as x,
  SessionsSpawnToolsConfig as xt,
  ChannelBotLoopProtectionConfig as y,
  MemorySearchConfig as yt,
  ProviderCommandsConfig as z,
  MemoryQmdMcporterConfig as zt,
};
