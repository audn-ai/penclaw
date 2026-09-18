//#region packages/memory-host-sdk/src/host/config-utils.d.ts
/** Chat shape used by memory send-policy matching. */
type ChatType = "direct" | "group" | "channel";
/** Memory backend selected by user config. */
type MemoryBackend = "builtin" | "qmd";
/** Citation injection behavior for memory search results. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** QMD command mode used for search calls. */
type MemoryQmdSearchMode = "query" | "search" | "vsearch";
/** QMD startup policy for background indexing. */
type MemoryQmdStartupMode = "off" | "idle" | "immediate";
/** Action returned by a session send-policy rule. */
type SessionSendPolicyAction = "allow" | "deny";
/** Match criteria for one memory send-policy rule. */
type SessionSendPolicyMatch = {
  channel?: string;
  chatType?: ChatType;
  keyPrefix?: string;
  rawKeyPrefix?: string;
};
/** One ordered rule in session send-policy config. */
type SessionSendPolicyRule = {
  action: SessionSendPolicyAction;
  match?: SessionSendPolicyMatch;
};
/** Memory send-policy config with default action and ordered rules. */
type SessionSendPolicyConfig = {
  default?: SessionSendPolicyAction;
  rules?: SessionSendPolicyRule[];
};
/** QMD collection path plus optional display name and glob pattern. */
type MemoryQmdIndexPath = {
  path: string;
  name?: string;
  pattern?: string;
};
/** QMD mcporter daemon integration config. */
type MemoryQmdMcporterConfig = {
  enabled?: boolean;
  serverName?: string;
  startDaemon?: boolean;
};
/** QMD session export config. */
type MemoryQmdSessionConfig = {
  enabled?: boolean;
  exportDir?: string;
  retentionDays?: number;
};
/** QMD update, debounce, startup, and timeout config. */
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
/** Search and injection limits for QMD memory results. */
type MemoryQmdLimitsConfig = {
  maxResults?: number;
  maxSnippetChars?: number;
  maxInjectedChars?: number;
  timeoutMs?: number;
};
/** Full QMD-backed memory config. */
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
/** Top-level memory config shared by host and runtime callers. */
type MemoryConfig = {
  backend?: MemoryBackend;
  citations?: MemoryCitationsMode;
  qmd?: MemoryQmdConfig;
};
/** Per-agent memory search enablement and extra collection paths. */
type MemorySearchConfig = {
  enabled?: boolean;
  extraPaths?: string[];
  qmd?: {
    extraCollections?: MemoryQmdIndexPath[];
  };
};
/** Agent context limits that bound memory file reads. */
type AgentContextLimitsConfig = {
  memoryGetMaxChars?: number;
  memoryGetDefaultLines?: number;
};
/** Secret reference accepted by provider header config. */
type SecretInput =
  | string
  | {
      source: string;
      provider: string;
      id: string;
    };
/** Agent-level config fields consumed by memory host helpers. */
type AgentConfig = {
  id?: string;
  default?: boolean;
  workspace?: string;
  memorySearch?: MemorySearchConfig;
  contextLimits?: AgentContextLimitsConfig;
};
/** Narrow OpenClaw config shape consumed by memory host utilities. */
type OpenClawConfig = {
  agents?: {
    defaults?: {
      workspace?: string;
      memorySearch?: MemorySearchConfig;
      contextLimits?: AgentContextLimitsConfig;
    };
    list?: AgentConfig[];
  };
  memory?: MemoryConfig;
  models?: {
    providers?: Record<
      string,
      {
        api?: string;
        baseUrl?: string;
        headers?: Record<string, SecretInput>;
      }
    >;
  };
};
//#endregion
//#region packages/memory-host-sdk/src/host/backend-config.d.ts
type ResolvedMemoryBackendConfig = {
  backend: MemoryBackend;
  citations: MemoryCitationsMode;
  qmd?: ResolvedQmdConfig;
};
/** @public */
type ResolvedQmdCollection = {
  name: string;
  path: string;
  pattern: string;
  kind: "memory" | "custom" | "sessions";
};
/** @public */
type ResolvedQmdUpdateConfig = {
  intervalMs: number;
  debounceMs: number;
  onBoot: boolean;
  startup: MemoryQmdStartupMode;
  startupDelayMs: number;
  waitForBootSync: boolean;
  embedIntervalMs: number;
  commandTimeoutMs: number;
  updateTimeoutMs: number;
  embedTimeoutMs: number;
};
/** @public */
type ResolvedQmdLimitsConfig = {
  maxResults: number;
  maxSnippetChars: number;
  maxInjectedChars: number;
  timeoutMs: number;
};
/** @public */
type ResolvedQmdSessionConfig = {
  enabled: boolean;
  exportDir?: string;
  retentionDays?: number;
};
type ResolvedQmdMcporterConfig = {
  enabled: boolean;
  serverName: string;
  startDaemon: boolean;
};
type ResolvedQmdConfig = {
  command: string;
  mcporter: ResolvedQmdMcporterConfig;
  searchMode: MemoryQmdSearchMode;
  rerank?: boolean;
  searchTool?: string;
  collections: ResolvedQmdCollection[];
  sessions: ResolvedQmdSessionConfig;
  update: ResolvedQmdUpdateConfig;
  limits: ResolvedQmdLimitsConfig;
  includeDefaultMemory: boolean;
  scope?: SessionSendPolicyConfig;
};
declare function resolveMemoryBackendConfig(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): ResolvedMemoryBackendConfig;
//#endregion
export {
  OpenClawConfig as a,
  resolveMemoryBackendConfig as i,
  ResolvedQmdConfig as n,
  ResolvedQmdMcporterConfig as r,
  ResolvedMemoryBackendConfig as t,
};
