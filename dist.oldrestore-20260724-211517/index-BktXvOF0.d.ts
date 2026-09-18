import {
  AutocompleteItem,
  AutocompleteProvider,
  Box,
  Component,
  EditorComponent,
  EditorTheme,
  KeyId,
  KeybindingsConfig,
  KeybindingsManager,
  OverlayHandle,
  OverlayOptions,
  TUI,
} from "@earendil-works/pi-tui";
import { Static, TSchema, Type } from "typebox";
import { t as Agent } from "./agent-core-DblDJWw5.js";
import {
  Un as AgentOptions,
  a as TruncationResult,
  d as CompactionPreparation,
  f as CompactionResult,
  p as CompactionSettings,
} from "./index--Mxo3qUC.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import {
  i as OAuthLoginCallbacks$1,
  l as OAuthProviderInterface,
  r as OAuthCredentials$1,
  s as OAuthProviderId,
} from "./provider-oauth-runtime-rAAEMnI0.js";
import {
  _ as SessionManager,
  d as SessionEntry,
  l as ReadonlySessionManager,
  n as CompactionEntry,
  t as BranchSummaryEntry,
} from "./session-manager-CWdHG5la.js";
import {
  S as SettingsManager,
  l as PathMetadata,
  t as SourceInfo,
} from "./source-info-xH8Q5yuU.js";
import {
  A as ToolResultMessage,
  C as TextContent,
  a as AssistantMessageEventStreamContract,
  c as Context,
  f as Model,
  i as AssistantMessageEvent,
  l as ImageContent,
  n as Api,
  v as SimpleStreamOptions,
} from "./types-CqrbBnUB.js";
import {
  D as ToolExecutionMode,
  E as ThinkingLevel,
  T as StreamFn,
  b as CustomMessage,
  c as AgentState,
  f as AgentToolResult,
  i as AgentEvent,
  l as AgentTool,
  p as AgentToolUpdateCallback,
  s as AgentMessage,
} from "./types-JQFrjdua.js";
import { n as UserTurnTranscriptRecorder } from "./user-turn-transcript.types-BW3AU7-v.js";

//#region src/agents/config.d.ts
declare const VERSION: string;
/** Get the agent config directory (e.g., ~/.openclaw/agent/) */
declare function getAgentDir(): string;
//#endregion
//#region src/agents/sessions/tools/bash-operations.d.ts
/**
 * Minimal shell execution interface injected into bash session tools.
 */
interface BashOperations {
  exec: (
    command: string,
    cwd: string,
    options: {
      onData: (data: Buffer) => void;
      signal?: AbortSignal;
      timeout?: number;
      env?: NodeJS.ProcessEnv;
    },
  ) => Promise<{
    exitCode: number | null;
  }>;
}
//#endregion
//#region src/agents/sessions/bash-executor.d.ts
interface BashExecutorOptions {
  /** Callback for streaming output chunks (already sanitized) */
  onChunk?: (chunk: string) => void;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}
interface BashResult {
  /** Combined stdout + stderr output (sanitized, possibly truncated) */
  output: string;
  /** Process exit code (undefined if killed/cancelled) */
  exitCode: number | undefined;
  /** Whether the command was cancelled via signal */
  cancelled: boolean;
  /** Whether the output was truncated */
  truncated: boolean;
  /** Path to temp file containing full output (if output exceeded truncation threshold) */
  fullOutputPath?: string;
}
/**
 * Execute a bash command using custom BashOperations.
 * Used for remote execution (SSH, containers, etc.).
 */
declare function executeBashWithOperations(
  command: string,
  cwd: string,
  operations: BashOperations,
  options?: BashExecutorOptions,
): Promise<BashResult>;
//#endregion
//#region src/agents/sessions/slash-commands.d.ts
type SlashCommandSource = "extension" | "prompt" | "skill";
interface SlashCommandInfo {
  name: string;
  description?: string;
  source: SlashCommandSource;
  sourceInfo: SourceInfo;
}
//#endregion
//#region src/agents/sessions/event-bus.d.ts
/** Minimal publish/subscribe interface used by session components. */
interface EventBus {
  emit(channel: string, data: unknown): void;
  on(channel: string, handler: (data: unknown) => void): () => void;
}
/** Event bus plus lifecycle control for tests and teardown. */
interface EventBusController extends EventBus {
  clear(): void;
}
/** Creates an in-process event bus with unsubscribe and clear support. */
declare function createEventBus(): EventBusController;
//#endregion
//#region src/agents/modes/interactive/theme/theme.d.ts
type ThemeColor =
  | "accent"
  | "border"
  | "borderAccent"
  | "borderMuted"
  | "success"
  | "error"
  | "warning"
  | "muted"
  | "dim"
  | "text"
  | "thinkingText"
  | "userMessageText"
  | "customMessageText"
  | "customMessageLabel"
  | "toolTitle"
  | "toolOutput"
  | "mdHeading"
  | "mdLink"
  | "mdLinkUrl"
  | "mdCode"
  | "mdCodeBlock"
  | "mdCodeBlockBorder"
  | "mdQuote"
  | "mdQuoteBorder"
  | "mdHr"
  | "mdListBullet"
  | "toolDiffAdded"
  | "toolDiffRemoved"
  | "toolDiffContext"
  | "syntaxComment"
  | "syntaxKeyword"
  | "syntaxFunction"
  | "syntaxVariable"
  | "syntaxString"
  | "syntaxNumber"
  | "syntaxType"
  | "syntaxOperator"
  | "syntaxPunctuation"
  | "thinkingOff"
  | "thinkingMinimal"
  | "thinkingLow"
  | "thinkingMedium"
  | "thinkingHigh"
  | "thinkingXhigh"
  | "bashMode";
type ThemeBg =
  | "selectedBg"
  | "userMessageBg"
  | "customMessageBg"
  | "toolPendingBg"
  | "toolSuccessBg"
  | "toolErrorBg";
type ColorMode = "truecolor" | "256color";
declare class Theme {
  readonly name?: string;
  readonly sourcePath?: string;
  sourceInfo?: SourceInfo;
  private fgColors;
  private bgColors;
  private mode;
  constructor(
    fgColors: Record<ThemeColor, string | number>,
    bgColors: Record<ThemeBg, string | number>,
    mode: ColorMode,
    options?: {
      name?: string;
      sourcePath?: string;
      sourceInfo?: SourceInfo;
    },
  );
  fg(color: ThemeColor, text: string): string;
  bg(color: ThemeBg, text: string): string;
  bold(text: string): string;
  italic(text: string): string;
  underline(text: string): string;
  inverse(text: string): string;
  strikethrough(text: string): string;
  getFgAnsi(color: ThemeColor): string;
  getBgAnsi(color: ThemeBg): string;
  getColorMode(): ColorMode;
  getThinkingBorderColor(
    level: "off" | "minimal" | "low" | "medium" | "high" | "xhigh",
  ): (str: string) => string;
  getBashModeBorderColor(): (str: string) => string;
}
//#endregion
//#region src/agents/sessions/compaction/branch-summarization.d.ts
interface CollectEntriesResult {
  entries: SessionEntry[];
  commonAncestorId: string | null;
}
interface BranchSummaryResult {
  summary?: string;
  readFiles?: string[];
  modifiedFiles?: string[];
  aborted?: boolean;
  error?: string;
}
interface GenerateBranchSummaryOptions {
  model: Model;
  apiKey: string;
  headers?: Record<string, string>;
  signal: AbortSignal;
  customInstructions?: string;
  replaceInstructions?: boolean;
  reserveTokens?: number;
}
/** Collects entries that differ between two session branches for summarization. */
declare function collectEntriesForBranchSummary(
  session: ReadonlySessionManager,
  oldLeafId: string | null,
  targetId: string,
): CollectEntriesResult;
/** Generates a human-readable branch summary through the shared agent-core runtime. */
declare function generateBranchSummary(
  entries: SessionEntry[],
  options: GenerateBranchSummaryOptions,
): Promise<BranchSummaryResult>;
//#endregion
//#region src/agents/sessions/compaction/compaction.d.ts
/** Prepares session entries for compaction using the shared agent-core planner. */
declare function prepareCompaction(
  pathEntries: SessionEntry[],
  settings: CompactionSettings,
): CompactionPreparation | undefined;
/** Generates a compaction summary through the shared agent-core runtime. */
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
): Promise<string>;
/** Runs full compaction through agent-core and returns the compacted conversation result. */
declare function compact(
  preparation: CompactionPreparation,
  model: Model,
  apiKey: string | undefined,
  headers?: Record<string, string>,
  customInstructions?: string,
  signal?: AbortSignal,
  thinkingLevel?: ThinkingLevel,
  streamFn?: StreamFn,
): Promise<CompactionResult>;
//#endregion
//#region src/agents/sessions/exec.d.ts
/**
 * Shared command execution utilities for extensions and custom tools.
 */
/**
 * Options for executing shell commands.
 */
interface ExecOptions {
  /** AbortSignal to cancel the command */
  signal?: AbortSignal;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Working directory */
  cwd?: string;
  /** Optional maximum retained stdout/stderr characters per stream. */
  maxOutputChars?: number;
}
/**
 * Result of executing a shell command.
 */
interface ExecResult {
  stdout: string;
  stderr: string;
  stdoutTruncatedChars?: number;
  stderrTruncatedChars?: number;
  outputLimitExceeded?: "stdout" | "stderr";
  code: number;
  killed: boolean;
}
//#endregion
//#region src/agents/sessions/footer-data-provider.d.ts
/**
 * Provides git branch and extension statuses - data not otherwise accessible to extensions.
 * Token stats, model info available via ctx.sessionManager and ctx.model.
 */
declare class FooterDataProvider {
  private static readonly WATCH_DEBOUNCE_MS;
  private extensionStatuses;
  private cachedBranch;
  private gitPaths;
  private headWatcher;
  private reftableWatcher;
  private reftableTablesListWatcher;
  private reftableTablesListPath;
  private branchChangeCallbacks;
  private availableProviderCount;
  private refreshTimer;
  private gitWatcherRetryTimer;
  private refreshInFlight;
  private refreshPending;
  private disposed;
  constructor(cwd: string);
  /** Current git branch, null if not in repo, "detached" if detached HEAD */
  getGitBranch(): string | null;
  /** Extension status texts set via ctx.ui.setStatus() */
  getExtensionStatuses(): ReadonlyMap<string, string>;
  /** Subscribe to git branch changes. Returns unsubscribe function. */
  onBranchChange(callback: () => void): () => void;
  /** Internal: set extension status */
  setExtensionStatus(key: string, text: string | undefined): void;
  /** Number of unique providers with available models (for footer display) */
  getAvailableProviderCount(): number;
  /** Internal: update available provider count */
  setAvailableProviderCount(count: number): void;
  /** Internal: cleanup */
  dispose(): void;
  private notifyBranchChange;
  private scheduleRefresh;
  private refreshGitBranchAsync;
  private resolveGitBranchSync;
  private resolveGitBranchAsync;
  private clearGitWatchers;
  private scheduleGitWatcherRetry;
  private handleGitWatcherError;
  private setupGitWatcher;
}
/** Read-only view for extensions - excludes setExtensionStatus, setAvailableProviderCount and dispose */
type ReadonlyFooterDataProvider = Pick<
  FooterDataProvider,
  "getGitBranch" | "getExtensionStatuses" | "getAvailableProviderCount" | "onBranchChange"
>;
//#endregion
//#region src/agents/sessions/keybindings.d.ts
/** OpenClaw-specific key ids added to the shared pi-tui keybinding registry. */
interface AppKeybindings {
  "app.interrupt": true;
  "app.clear": true;
  "app.exit": true;
  "app.suspend": true;
  "app.thinking.cycle": true;
  "app.model.cycleForward": true;
  "app.model.cycleBackward": true;
  "app.model.select": true;
  "app.tools.expand": true;
  "app.thinking.toggle": true;
  "app.session.toggleNamedFilter": true;
  "app.editor.external": true;
  "app.message.followUp": true;
  "app.message.dequeue": true;
  "app.clipboard.pasteImage": true;
  "app.session.new": true;
  "app.session.tree": true;
  "app.session.fork": true;
  "app.session.resume": true;
  "app.tree.foldOrUp": true;
  "app.tree.unfoldOrDown": true;
  "app.tree.editLabel": true;
  "app.tree.toggleLabelTimestamp": true;
  "app.session.togglePath": true;
  "app.session.toggleSort": true;
  "app.session.rename": true;
  "app.session.delete": true;
  "app.session.deleteNoninvasive": true;
  "app.models.save": true;
  "app.models.enableAll": true;
  "app.models.clearAll": true;
  "app.models.toggleProvider": true;
  "app.models.reorderUp": true;
  "app.models.reorderDown": true;
  "app.tree.filter.default": true;
  "app.tree.filter.noTools": true;
  "app.tree.filter.userOnly": true;
  "app.tree.filter.labeledOnly": true;
  "app.tree.filter.all": true;
  "app.tree.filter.cycleForward": true;
  "app.tree.filter.cycleBackward": true;
}
/** Union of OpenClaw-specific app key ids. */
type AppKeybinding = keyof AppKeybindings;
declare module "@earendil-works/pi-tui" {
  interface Keybindings extends AppKeybindings {}
}
/** Complete keybinding definition map consumed by the TUI keybinding manager. */
/** Keybinding manager that loads OpenClaw defaults plus optional user overrides. */
declare class KeybindingsManager$1 extends KeybindingsManager {
  private configPath;
  constructor(userBindings?: KeybindingsConfig, configPath?: string);
  /** Creates a manager from the agent keybindings.json file. */
  static create(agentDir?: string): KeybindingsManager$1;
  /** Reloads user overrides from disk when this manager was created with a config path. */
  reload(): void;
  /** Returns the currently resolved keybinding map after defaults and overrides. */
  getEffectiveConfig(): KeybindingsConfig;
  private static loadFromFile;
}
//#endregion
//#region src/agents/plugin-model-catalog.d.ts
type PluginModelCatalogMetadataSnapshot = Pick<PluginMetadataSnapshot, "owners"> & {
  index?: {
    plugins: ReadonlyArray<{
      enabled: boolean;
      pluginId: string;
    }>;
  };
  normalizePluginId?: (pluginId: string) => string;
};
//#endregion
//#region src/agents/sessions/auth-storage.d.ts
type ApiKeyCredential = {
  type: "api_key";
  key: string;
};
type OAuthCredential = {
  type: "oauth";
} & OAuthCredentials$1;
type AuthCredential = ApiKeyCredential | OAuthCredential;
type AuthStorageData = Record<string, AuthCredential>;
type AuthStatus = {
  configured: boolean;
  source?:
    | "stored"
    | "runtime"
    | "environment"
    | "fallback"
    | "models_json_key"
    | "models_json_command";
  label?: string;
};
type LockResult<T> = {
  result: T;
  next?: string;
};
interface AuthStorageBackend {
  withLock<T>(fn: (current: string | undefined) => LockResult<T>): T;
  withLockAsync<T>(fn: (current: string | undefined) => Promise<LockResult<T>>): Promise<T>;
}
declare class FileAuthStorageBackend implements AuthStorageBackend {
  private authPath;
  constructor(authPath?: string);
  private ensureParentDir;
  private ensureFileExists;
  private replaceAuthFileAtomic;
  withLock<T>(fn: (current: string | undefined) => LockResult<T>): T;
  withLockAsync<T>(fn: (current: string | undefined) => Promise<LockResult<T>>): Promise<T>;
}
declare class InMemoryAuthStorageBackend implements AuthStorageBackend {
  private value;
  withLock<T>(fn: (current: string | undefined) => LockResult<T>): T;
  withLockAsync<T>(fn: (current: string | undefined) => Promise<LockResult<T>>): Promise<T>;
}
/**
 * Credential storage backed by a JSON file.
 */
declare class AuthStorage {
  private data;
  private runtimeOverrides;
  private fallbackResolver?;
  private loadError;
  private errors;
  private storage;
  private constructor();
  static create(authPath?: string): AuthStorage;
  static fromStorage(storage: AuthStorageBackend): AuthStorage;
  static inMemory(data?: AuthStorageData): AuthStorage;
  /**
   * Set a runtime API key override (not persisted to disk).
   * Used for CLI --api-key flag.
   */
  setRuntimeApiKey(provider: string, apiKey: string): void;
  /**
   * Remove a runtime API key override.
   */
  removeRuntimeApiKey(provider: string): void;
  /**
   * Set a fallback resolver for API keys not found in auth.json or env vars.
   * Used for custom provider keys from models.json.
   */
  setFallbackResolver(resolver: (provider: string) => string | undefined): void;
  private recordError;
  private parseStorageData;
  /**
   * Reload credentials from storage.
   */
  reload(): void;
  private persistProviderChange;
  /**
   * Get credential for a provider.
   */
  get(provider: string): AuthCredential | undefined;
  /**
   * Set credential for a provider.
   */
  set(provider: string, credential: AuthCredential): void;
  /**
   * Remove credential for a provider.
   */
  remove(provider: string): void;
  /**
   * List all providers with credentials.
   */
  list(): string[];
  /**
   * Check if credentials exist for a provider in auth.json.
   */
  has(provider: string): boolean;
  /**
   * Check if any form of auth is configured for a provider.
   * Unlike getApiKey(), this doesn't refresh OAuth tokens.
   */
  hasAuth(provider: string): boolean;
  /**
   * Return auth status without exposing credential values or refreshing tokens.
   */
  getAuthStatus(provider: string): AuthStatus;
  /**
   * Get all credentials (for passing to getOAuthApiKey).
   */
  getAll(): AuthStorageData;
  drainErrors(): Error[];
  /**
   * Login to an OAuth provider.
   */
  login(providerId: OAuthProviderId, callbacks: OAuthLoginCallbacks$1): Promise<void>;
  /**
   * Logout from a provider.
   */
  logout(provider: string): void;
  /**
   * Refresh OAuth token with backend locking to prevent race conditions.
   * Multiple agent sessions may try to refresh simultaneously when tokens expire.
   */
  private refreshOAuthTokenWithLock;
  /**
   * Get API key for a provider.
   * Priority:
   * 1. Runtime override (CLI --api-key)
   * 2. API key from auth.json
   * 3. OAuth token from auth.json (auto-refreshed with locking)
   * 4. Environment variable
   * 5. Fallback resolver (models.json custom providers)
   */
  getApiKey(
    providerId: string,
    options?: {
      includeFallback?: boolean;
    },
  ): Promise<string | undefined>;
  /**
   * Get all registered OAuth providers
   */
  getOAuthProviders(): OAuthProviderInterface[];
}
//#endregion
//#region src/agents/sessions/resolve-config-value.d.ts
/** Clear the config value command cache. Exported for testing. */
declare function clearConfigValueCache(): void;
//#endregion
//#region src/agents/sessions/model-registry.d.ts
declare const ProviderAuthModeSchema: Type.TUnion<
  [
    Type.TLiteral<"api-key">,
    Type.TLiteral<"aws-sdk">,
    Type.TLiteral<"oauth">,
    Type.TLiteral<"token">,
  ]
>;
type ProviderAuthMode = Static<typeof ProviderAuthModeSchema>;
type ResolvedRequestAuth =
  | {
      ok: true;
      apiKey?: string;
      headers?: Record<string, string>;
    }
  | {
      ok: false;
      error: string;
    };
type ModelRegistryOptions = {
  pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
  workspaceDir?: string;
};
/** Clear the config value command cache. Exported for testing. */
declare const clearApiKeyCache: typeof clearConfigValueCache;
/**
 * Model registry - loads and manages models, resolves API keys via AuthStorage.
 */
declare class ModelRegistry {
  private models;
  private providerRequestConfigs;
  private modelRequestHeaders;
  private registeredProviders;
  private loadError;
  readonly authStorage: AuthStorage;
  private modelsJsonPath;
  private pluginMetadataSnapshot;
  private constructor();
  static create(
    authStorage: AuthStorage,
    modelsJsonPath?: string,
    options?: ModelRegistryOptions,
  ): ModelRegistry;
  static inMemory(authStorage: AuthStorage): ModelRegistry;
  /**
   * Reload models from disk (models.json).
   */
  refresh(): void;
  /** Get any root or generated plugin catalog load error. */
  getError(): string | undefined;
  private loadModels;
  private loadCustomModels;
  private validateConfig;
  private parseModels;
  /**
   * Get all configured models.
   */
  getAll(): Model[];
  /**
   * Get only models that have auth configured.
   * This is a fast check that doesn't refresh OAuth tokens.
   */
  getAvailable(): Model[];
  /**
   * Find a model by provider and ID.
   */
  find(provider: string, modelId: string): Model | undefined;
  /**
   * Get API key for a model.
   */
  hasConfiguredAuth(model: Model): boolean;
  private getModelRequestKey;
  private storeProviderRequestConfig;
  private storeModelHeaders;
  /**
   * Get API key and request headers for a model.
   */
  getApiKeyAndHeaders(model: Model): Promise<ResolvedRequestAuth>;
  /**
   * Return auth status for a provider, including request auth configured in models.json.
   * This intentionally does not execute command-backed config values.
   */
  getProviderAuthStatus(provider: string): AuthStatus;
  /**
   * Get display name for a provider.
   */
  getProviderDisplayName(provider: string): string;
  /**
   * Get API key for a provider.
   */
  getApiKeyForProvider(provider: string): Promise<string | undefined>;
  /**
   * Check if a model is using OAuth credentials (subscription).
   */
  isUsingOAuth(model: Model): boolean;
  /**
   * Register a provider dynamically (from extensions).
   *
   * If provider has models: replaces all existing models for this provider.
   * Provider-level request settings are stored for already-known models but
   * never create implicit model rows.
   * If provider has oauth: registers OAuth provider for /login support.
   */
  registerProvider(providerName: string, config: ProviderConfigInput): void;
  /**
   * Unregister a previously registered provider.
   *
   * Removes the provider from the registry and reloads models from disk.
   * Also resets dynamic OAuth and API stream registrations before reapplying
   * remaining dynamic providers.
   * Has no effect if the provider was never registered.
   */
  unregisterProvider(providerName: string): void;
  /**
   * Upsert a provider config into registeredProviders.
   * If the provider is already registered, defined values in the incoming config
   * override existing ones; undefined values are preserved from the stored config.
   * If the provider is not registered, the incoming config is stored as-is.
   */
  private upsertRegisteredProvider;
  private validateProviderConfig;
  private applyProviderConfig;
}
/**
 * Input type for registerProvider API.
 */
interface ProviderConfigInput {
  name?: string;
  baseUrl?: string;
  apiKey?: string;
  auth?: ProviderAuthMode;
  api?: Api;
  streamSimple?: (
    model: Model,
    context: Context,
    options?: SimpleStreamOptions,
  ) => AssistantMessageEventStreamContract;
  headers?: Record<string, string>;
  authHeader?: boolean;
  /** OAuth provider for /login support */
  oauth?: Omit<OAuthProviderInterface, "id">;
  models?: Array<{
    id: string;
    name: string;
    api?: Api;
    baseUrl?: string;
    reasoning: boolean;
    thinkingLevelMap?: Model["thinkingLevelMap"];
    input: ("text" | "image")[];
    cost: {
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
    };
    contextWindow: number;
    maxTokens: number;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    compat?: Model["compat"];
  }>;
}
//#endregion
//#region src/agents/sessions/diagnostics.d.ts
/**
 * Session resource diagnostic types.
 *
 * Describes collisions and warnings discovered while loading extensions, skills, prompts, and themes.
 */
interface ResourceCollision {
  resourceType: "extension" | "skill" | "prompt" | "theme";
  name: string;
  winnerPath: string;
  loserPath: string;
  winnerSource?: string;
  loserSource?: string;
}
interface ResourceDiagnostic {
  type: "warning" | "error" | "collision";
  message: string;
  path?: string;
  collision?: ResourceCollision;
}
//#endregion
//#region src/skills/loading/session.d.ts
interface SkillFrontmatter {
  name?: string;
  description?: string;
  "disable-model-invocation"?: boolean;
  [key: string]: unknown;
}
interface Skill {
  name: string;
  description: string;
  filePath: string;
  baseDir: string;
  promptVersion?: string;
  source: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
}
interface LoadSkillsResult {
  skills: Skill[];
  diagnostics: ResourceDiagnostic[];
}
interface LoadSkillsFromDirOptions {
  /** Directory to scan for skills */
  dir: string;
  /** Source identifier for these skills */
  source: string;
}
/**
 * Load skills from a directory.
 *
 * Discovery rules:
 * - if a directory contains SKILL.md, treat it as a skill root and do not recurse further
 * - otherwise, load direct .md children in the root
 * - recurse into subdirectories to find SKILL.md
 */
declare function loadSkillsFromDir(options: LoadSkillsFromDirOptions): LoadSkillsResult;
/**
 * Format skills for inclusion in a system prompt.
 * Uses XML format per Agent Skills standard.
 * See: https://agentskills.io/integrate-skills
 *
 * Skills with disableModelInvocation=true are excluded from the prompt
 * (they can only be invoked explicitly via /skill:name commands).
 */
declare function formatSkillsForPrompt(skills: Skill[]): string;
interface LoadSkillsOptions {
  /** Working directory for project-local skills. */
  cwd: string;
  /** Agent config directory for global skills. */
  agentDir: string;
  /** Explicit skill paths (files or directories) */
  skillPaths: string[];
  /** Include default skills directories. */
  includeDefaults: boolean;
}
/**
 * Load skills from all configured locations.
 * Returns skills and any validation diagnostics.
 */
declare function loadSkills(options: LoadSkillsOptions): LoadSkillsResult;
//#endregion
//#region src/agents/sessions/system-prompt.d.ts
interface BuildSystemPromptOptions {
  /** Custom system prompt (replaces default). */
  customPrompt?: string;
  /** Tools to include in prompt. Default: [read, bash, edit, write] */
  selectedTools?: string[];
  /** Optional one-line tool snippets keyed by tool name. */
  toolSnippets?: Record<string, string>;
  /** Additional guideline bullets appended to the default system prompt guidelines. */
  promptGuidelines?: string[];
  /** Text to append to system prompt. */
  appendSystemPrompt?: string;
  /** Working directory. */
  cwd: string;
  /** Pre-loaded context files. */
  contextFiles?: Array<{
    path: string;
    content: string;
  }>;
  /** Pre-loaded skills. */
  skills?: Skill[];
}
//#endregion
//#region src/agents/sessions/tools/edit-diff.d.ts
interface Edit {
  oldText: string;
  newText: string;
}
interface EditDiffResult {
  diff: string;
  firstChangedLine: number | undefined;
}
interface EditDiffError {
  error: string;
}
//#endregion
//#region src/agents/sessions/tools/tool-contracts.d.ts
interface BashToolInput {
  command: string;
  timeout?: number;
}
interface BashToolDetails {
  truncation?: TruncationResult;
  fullOutputPath?: string;
}
interface EditToolInput {
  path: string;
  edits: Edit[];
}
interface EditToolDetails {
  /** Display-oriented diff of the changes made */
  diff: string;
  /** Standard unified patch of the changes made */
  patch: string;
  /** Line number of the first change in the new file (for editor navigation) */
  firstChangedLine?: number;
}
interface FindToolInput {
  pattern: string;
  path?: string;
  limit?: number;
}
interface FindToolDetails {
  truncation?: TruncationResult;
  resultLimitReached?: number;
}
interface GrepToolInput {
  pattern: string;
  path?: string;
  glob?: string;
  ignoreCase?: boolean;
  literal?: boolean;
  context?: number;
  limit?: number;
}
interface GrepToolDetails {
  truncation?: TruncationResult;
  matchLimitReached?: number;
  linesTruncated?: boolean;
}
interface LsToolInput {
  path?: string;
  limit?: number;
}
interface LsToolDetails {
  truncation?: TruncationResult;
  entryLimitReached?: number;
}
interface ReadToolInput {
  path: string;
  offset?: number;
  limit?: number;
}
interface ReadToolDetails {
  truncation?: TruncationResult;
}
interface WriteToolInput {
  path: string;
  content: string;
}
//#endregion
//#region src/agents/sessions/extensions/types.d.ts
type OAuthCredentials = {
  refresh: string;
  access: string;
  expires: number;
  [key: string]: unknown;
};
type OAuthPrompt = {
  message: string;
  placeholder?: string;
  allowEmpty?: boolean;
};
type OAuthAuthInfo = {
  url: string;
  instructions?: string;
};
type OAuthSelectOption = {
  id: string;
  label: string;
};
type OAuthSelectPrompt = {
  message: string;
  options: OAuthSelectOption[];
};
interface OAuthLoginCallbacks {
  onAuth: (info: OAuthAuthInfo) => void;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  onProgress?: (message: string) => void;
  onManualCodeInput?: () => Promise<string>;
  /** Show an interactive selector and return the selected option id, or undefined on cancel. */
  onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
  signal?: AbortSignal;
}
/** Options for extension UI dialogs. */
interface ExtensionUIDialogOptions {
  /** AbortSignal to programmatically dismiss the dialog. */
  signal?: AbortSignal;
  /** Timeout in milliseconds. Dialog auto-dismisses with live countdown display. */
  timeout?: number;
}
/** Placement for extension widgets. */
type WidgetPlacement = "aboveEditor" | "belowEditor";
/** Options for extension widgets. */
interface ExtensionWidgetOptions {
  /** Where the widget is rendered. Defaults to "aboveEditor". */
  placement?: WidgetPlacement;
}
/** Raw terminal input listener for extensions. */
type TerminalInputHandler = (data: string) =>
  | {
      consume?: boolean;
      data?: string;
    }
  | undefined;
/** Working indicator configuration for the interactive streaming loader. */
interface WorkingIndicatorOptions {
  /** Animation frames. Use an empty array to hide the indicator entirely. Custom frames are rendered verbatim. */
  frames?: string[];
  /** Frame interval in milliseconds for animated indicators. */
  intervalMs?: number;
}
/** Wrap the current autocomplete provider with additional behavior. */
type AutocompleteProviderFactory = (current: AutocompleteProvider) => AutocompleteProvider;
type EditorFactory = (
  tui: TUI,
  theme: EditorTheme,
  keybindings: KeybindingsManager$1,
) => EditorComponent;
/**
 * UI context for extensions to request interactive UI.
 * Each mode (interactive, RPC, print) provides its own implementation.
 */
interface ExtensionUIContext {
  /** Show a selector and return the user's choice. */
  select(
    title: string,
    options: string[],
    opts?: ExtensionUIDialogOptions,
  ): Promise<string | undefined>;
  /** Show a confirmation dialog. */
  confirm(title: string, message: string, opts?: ExtensionUIDialogOptions): Promise<boolean>;
  /** Show a text input dialog. */
  input(
    title: string,
    placeholder?: string,
    opts?: ExtensionUIDialogOptions,
  ): Promise<string | undefined>;
  /** Show a notification to the user. */
  notify(message: string, type?: "info" | "warning" | "error"): void;
  /** Listen to raw terminal input (interactive mode only). Returns an unsubscribe function. */
  onTerminalInput(handler: TerminalInputHandler): () => void;
  /** Set status text in the footer/status bar. Pass undefined to clear. */
  setStatus(key: string, text: string | undefined): void;
  /** Set the working/loading message shown during streaming. Call with no argument to restore default. */
  setWorkingMessage(message?: string): void;
  /** Show or hide the built-in interactive working loader row during streaming. */
  setWorkingVisible(visible: boolean): void;
  /**
   * Configure the interactive working indicator shown during streaming.
   *
   * - Omit the argument to restore the default animated spinner.
   * - Use `frames: ["●"]` for a static indicator.
   * - Use `frames: []` to hide the indicator entirely.
   * - Custom frames are rendered as provided, so extensions must add their own colors.
   */
  setWorkingIndicator(options?: WorkingIndicatorOptions): void;
  /** Set the label shown for hidden thinking blocks. Call with no argument to restore default. */
  setHiddenThinkingLabel(label?: string): void;
  /** Set a widget to display above or below the editor. Accepts string array or component factory. */
  setWidget(key: string, content: string[] | undefined, options?: ExtensionWidgetOptions): void;
  setWidget(
    key: string,
    content:
      | ((
          tui: TUI,
          theme: Theme,
        ) => Component & {
          dispose?(): void;
        })
      | undefined,
    options?: ExtensionWidgetOptions,
  ): void;
  /** Set a custom footer component, or undefined to restore the built-in footer.
   *
   * The factory receives a FooterDataProvider for data not otherwise accessible:
   * git branch and extension statuses from setStatus(). Token stats, model info,
   * etc. are available via ctx.sessionManager and ctx.model.
   */
  setFooter(
    factory:
      | ((
          tui: TUI,
          theme: Theme,
          footerData: ReadonlyFooterDataProvider,
        ) => Component & {
          dispose?(): void;
        })
      | undefined,
  ): void;
  /** Set a custom header component (shown at startup, above chat), or undefined to restore the built-in header. */
  setHeader(
    factory:
      | ((
          tui: TUI,
          theme: Theme,
        ) => Component & {
          dispose?(): void;
        })
      | undefined,
  ): void;
  /** Set the terminal window/tab title. */
  setTitle(title: string): void;
  /** Show a custom component with keyboard focus. */
  custom<T>(
    factory: (
      tui: TUI,
      theme: Theme,
      keybindings: KeybindingsManager$1,
      done: (result: T) => void,
    ) =>
      | (Component & {
          dispose?(): void;
        })
      | Promise<
          Component & {
            dispose?(): void;
          }
        >,
    options?: {
      overlay?: boolean /** Overlay positioning/sizing options. Can be static or a function for dynamic updates. */;
      overlayOptions?:
        | OverlayOptions
        | (() => OverlayOptions) /** Called with the overlay handle after the overlay is shown. Use to control visibility. */;
      onHandle?: (handle: OverlayHandle) => void;
    },
  ): Promise<T>;
  /** Paste text into the editor, triggering paste handling (collapse for large content). */
  pasteToEditor(text: string): void;
  /** Set the text in the core input editor. */
  setEditorText(text: string): void;
  /** Get the current text from the core input editor. */
  getEditorText(): string;
  /** Show a multi-line editor for text editing. */
  editor(title: string, prefill?: string): Promise<string | undefined>;
  /** Stack additional autocomplete behavior on top of the built-in provider. */
  addAutocompleteProvider(factory: AutocompleteProviderFactory): void;
  /**
   * Set a custom editor component via factory function.
   * Pass undefined to restore the default editor.
   *
   * The factory receives:
   * - `theme`: EditorTheme for styling borders and autocomplete
   * - `keybindings`: KeybindingsManager for app-level keybindings
   *
   * For full app keybinding support (escape, ctrl+d, model switching, etc.),
   * extend `CustomEditor` from `openclaw/plugin-sdk/agent-sessions` and call
   * `super.handleInput(data)` for keys you don't handle.
   *
   * @example
   * ```ts
   * import { CustomEditor } from "openclaw/plugin-sdk/agent-sessions";
   *
   * class VimEditor extends CustomEditor {
   *   private mode: "normal" | "insert" = "insert";
   *
   *   handleInput(data: string): void {
   *     if (this.mode === "normal") {
   *       // Handle vim normal mode keys...
   *       if (data === "i") { this.mode = "insert"; return; }
   *     }
   *     super.handleInput(data);  // App keybindings + text editing
   *   }
   * }
   *
   * ctx.ui.setEditorComponent((tui, theme, keybindings) =>
   *   new VimEditor(tui, theme, keybindings)
   * );
   * ```
   */
  setEditorComponent(factory: EditorFactory | undefined): void;
  /** Get the currently configured custom editor factory, or undefined when using the default editor. */
  getEditorComponent(): EditorFactory | undefined;
  /** Get the current theme for styling. */
  readonly theme: Theme;
  /** Get all available themes with their names and file paths. */
  getAllThemes(): {
    name: string;
    path: string | undefined;
  }[];
  /** Load a theme by name without switching to it. Returns undefined if not found. */
  getTheme(name: string): Theme | undefined;
  /** Set the current theme by name or Theme object. */
  setTheme(theme: string | Theme): {
    success: boolean;
    error?: string;
  };
  /** Get current tool output expansion state. */
  getToolsExpanded(): boolean;
  /** Set tool output expansion state. */
  setToolsExpanded(expanded: boolean): void;
}
interface ContextUsage {
  /** Estimated context tokens, or null if any (e.g. right after compaction, before next LLM response). */
  tokens: number | null;
  contextWindow: number;
  /** Context usage as percentage of context window, or null if tokens is unknown. */
  percent: number | null;
}
interface CompactOptions {
  customInstructions?: string;
  onComplete?: (result: CompactionResult) => void;
  onError?: (error: Error) => void;
}
/**
 * Context passed to extension event handlers.
 */
interface ExtensionContext {
  /** UI methods for user interaction */
  ui: ExtensionUIContext;
  /** Whether UI is available (false in print/RPC mode) */
  hasUI: boolean;
  /** Current working directory */
  cwd: string;
  /** Session manager (read-only) */
  sessionManager: ReadonlySessionManager;
  /** Model registry for API key resolution */
  modelRegistry: ModelRegistry;
  /** Current model (may be undefined) */
  model: Model | undefined;
  /** Whether the agent is idle (not streaming) */
  isIdle(): boolean;
  /** The current abort signal, or undefined when the agent is not streaming. */
  signal: AbortSignal | undefined;
  /** Abort the current agent operation */
  abort(): void;
  /** Whether there are queued messages waiting */
  hasPendingMessages(): boolean;
  /** Gracefully shut down OpenClaw and exit. Available in all contexts. */
  shutdown(): void;
  /** Get current context usage for the active model. */
  getContextUsage(): ContextUsage | undefined;
  /** Trigger compaction without awaiting completion. */
  compact(options?: CompactOptions): void;
  /** Get the current effective system prompt. */
  getSystemPrompt(): string;
}
/**
 * Extended context for command handlers.
 * Includes session control methods only safe in user-initiated commands.
 */
interface ExtensionCommandContext extends ExtensionContext {
  /** Wait for the agent to finish streaming */
  waitForIdle(): Promise<void>;
  /** Start a new session, optionally with initialization. */
  newSession(options?: {
    parentSession?: string;
    setup?: (sessionManager: SessionManager) => Promise<void>;
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }): Promise<{
    cancelled: boolean;
  }>;
  /** Fork from a specific entry, creating a new session file. */
  fork(
    entryId: string,
    options?: {
      position?: "before" | "at";
      withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
    },
  ): Promise<{
    cancelled: boolean;
  }>;
  /** Navigate to a different point in the session tree. */
  navigateTree(
    targetId: string,
    options?: {
      summarize?: boolean;
      customInstructions?: string;
      replaceInstructions?: boolean;
      label?: string;
    },
  ): Promise<{
    cancelled: boolean;
  }>;
  /** Switch to a different session file. */
  switchSession(
    sessionPath: string,
    options?: {
      withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
    },
  ): Promise<{
    cancelled: boolean;
  }>;
  /** Reload extensions, skills, prompts, and themes. */
  reload(): Promise<void>;
}
/**
 * Fresh command-capable context bound to the replacement session after a session switch.
 *
 * This is passed to `withSession()` callbacks on `newSession()`, `fork()`, and `switchSession()`.
 */
interface ReplacedSessionContext extends ExtensionCommandContext {
  sendMessage<T = unknown>(
    message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">,
    options?: {
      triggerTurn?: boolean;
      deliverAs?: "steer" | "followUp" | "nextTurn";
    },
  ): Promise<void>;
  sendUserMessage(
    content: string | (TextContent | ImageContent)[],
    options?: {
      deliverAs?: "steer" | "followUp";
    },
  ): Promise<void>;
}
/** Rendering options for tool results */
interface ToolRenderResultOptions {
  /** Whether the result view is expanded */
  expanded: boolean;
  /** Whether this is a partial/streaming result */
  isPartial: boolean;
}
/** Context passed to tool renderers. */
interface ToolRenderContext<TState = unknown, TArgs = unknown> {
  /** Current tool call arguments. Shared across call/result renders for the same tool call. */
  args: TArgs;
  /** Unique id for this tool execution. Stable across call/result renders for the same tool call. */
  toolCallId: string;
  /** Invalidate just this tool execution component for redraw. */
  invalidate: () => void;
  /** Previously returned component for this render slot, if any. */
  lastComponent: Component | undefined;
  /** Shared renderer state for this tool row. Initialized by tool-execution.ts. */
  state: TState;
  /** Working directory for this tool execution. */
  cwd: string;
  /** Whether the tool execution has started. */
  executionStarted: boolean;
  /** Whether the tool call arguments are complete. */
  argsComplete: boolean;
  /** Whether the tool result is partial/streaming. */
  isPartial: boolean;
  /** Whether the result view is expanded. */
  expanded: boolean;
  /** Whether inline images are currently shown in the TUI. */
  showImages: boolean;
  /** Whether the current result is an error. */
  isError: boolean;
}
type BivariantCallback<TArgs extends unknown[], TResult> = {
  bivarianceHack(...args: TArgs): TResult;
}["bivarianceHack"];
/**
 * Tool definition for registerTool().
 */
interface ToolDefinition<TParams extends TSchema = TSchema, TDetails = unknown, TState = unknown> {
  /** Tool name (used in LLM tool calls) */
  name: string;
  /** Human-readable label for UI */
  label: string;
  /** Preserve lifecycle telemetry without rendering transient channel progress. */
  hideFromChannelProgress?: boolean;
  /** Description for LLM */
  description: string;
  /** Optional one-line snippet for the Available tools section in the default system prompt. Custom tools are omitted from that section when this is not provided. */
  promptSnippet?: string;
  /** Optional guideline bullets appended to the default system prompt Guidelines section when this tool is active. */
  promptGuidelines?: string[];
  /** Parameter schema (TypeBox) */
  parameters: TParams;
  /** Controls whether ToolExecutionComponent renders the standard colored shell or the tool renders its own framing. */
  renderShell?: "default" | "self";
  /** Optional compatibility shim to prepare raw tool call arguments before schema validation. Must return an object conforming to TParams. */
  prepareArguments?: (args: unknown) => Static<TParams>;
  /**
   * Per-tool execution mode override.
   * - "sequential": this tool must execute one at a time with other tool calls.
   * - "parallel": this tool can execute concurrently with other tool calls.
   *
   * If omitted, the default execution mode applies.
   */
  executionMode?: ToolExecutionMode;
  /** Execute the tool. */
  execute(
    toolCallId: string,
    params: Static<TParams>,
    signal: AbortSignal | undefined,
    onUpdate: AgentToolUpdateCallback<TDetails> | undefined,
    ctx: ExtensionContext,
  ): Promise<AgentToolResult<TDetails>>;
  /** Custom rendering for tool call display */
  renderCall?: BivariantCallback<
    [args: Static<TParams>, theme: Theme, context: ToolRenderContext<TState, Static<TParams>>],
    Component
  >;
  /** Custom rendering for tool result display */
  renderResult?: BivariantCallback<
    [
      result: AgentToolResult<TDetails>,
      options: ToolRenderResultOptions,
      theme: Theme,
      context: ToolRenderContext<TState, Static<TParams>>,
    ],
    Component
  >;
}
type AnyToolDefinition = ToolDefinition;
/**
 * Preserve parameter inference for standalone tool definitions.
 *
 * Use this when assigning a tool to a variable or passing it through arrays such
 * as `customTools`, where contextual typing would otherwise widen params to
 * `unknown`.
 */
declare function defineTool<TParams extends TSchema, TDetails = unknown, TState = unknown>(
  tool: ToolDefinition<TParams, TDetails, TState>,
): ToolDefinition<TParams, TDetails, TState> & AnyToolDefinition;
/** Fired after session_start to allow extensions to provide additional resource paths. */
interface ResourcesDiscoverEvent {
  type: "resources_discover";
  cwd: string;
  reason: "startup" | "reload";
}
/** Result from resources_discover event handler */
interface ResourcesDiscoverResult {
  skillPaths?: string[];
  promptPaths?: string[];
  themePaths?: string[];
}
/** Fired when a session is started, loaded, or reloaded */
interface SessionStartEvent {
  type: "session_start";
  /** Why this session start happened. */
  reason: "startup" | "reload" | "new" | "resume" | "fork";
  /** Previously active session file. Present for "new", "resume", and "fork". */
  previousSessionFile?: string;
}
/** Fired before switching to another session (can be cancelled) */
interface SessionBeforeSwitchEvent {
  type: "session_before_switch";
  reason: "new" | "resume";
  targetSessionFile?: string;
}
/** Fired before forking a session (can be cancelled) */
interface SessionBeforeForkEvent {
  type: "session_before_fork";
  entryId: string;
  position: "before" | "at";
}
/** Fired before context compaction (can be cancelled or customized) */
interface SessionBeforeCompactEvent {
  type: "session_before_compact";
  preparation: CompactionPreparation;
  branchEntries: SessionEntry[];
  customInstructions?: string;
  signal: AbortSignal;
}
/** Fired after context compaction */
interface SessionCompactEvent {
  type: "session_compact";
  compactionEntry: CompactionEntry;
  fromExtension: boolean;
}
/** Fired before an extension runtime is torn down due to quit, reload, or session replacement. */
interface SessionShutdownEvent {
  type: "session_shutdown";
  reason: "quit" | "reload" | "new" | "resume" | "fork";
  /** Destination session file when shutting down due to session replacement. */
  targetSessionFile?: string;
}
/** Preparation data for tree navigation */
interface TreePreparation {
  targetId: string;
  oldLeafId: string | null;
  commonAncestorId: string | null;
  entriesToSummarize: SessionEntry[];
  userWantsSummary: boolean;
  /** Custom instructions for summarization */
  customInstructions?: string;
  /** If true, customInstructions replaces the default prompt instead of being appended */
  replaceInstructions?: boolean;
  /** Label to attach to the branch summary entry */
  label?: string;
}
/** Fired before navigating in the session tree (can be cancelled) */
interface SessionBeforeTreeEvent {
  type: "session_before_tree";
  preparation: TreePreparation;
  signal: AbortSignal;
}
/** Fired after navigating in the session tree */
interface SessionTreeEvent {
  type: "session_tree";
  newLeafId: string | null;
  oldLeafId: string | null;
  summaryEntry?: BranchSummaryEntry;
  fromExtension?: boolean;
}
type SessionEvent =
  | SessionStartEvent
  | SessionBeforeSwitchEvent
  | SessionBeforeForkEvent
  | SessionBeforeCompactEvent
  | SessionCompactEvent
  | SessionShutdownEvent
  | SessionBeforeTreeEvent
  | SessionTreeEvent;
/** Fired before each LLM call. Can modify messages. */
interface ContextEvent {
  type: "context";
  messages: AgentMessage[];
}
/** Fired before a provider request is sent. Can replace the payload. */
interface BeforeProviderRequestEvent {
  type: "before_provider_request";
  payload: unknown;
}
/** Fired after a provider response is received and before the response stream is consumed. */
interface AfterProviderResponseEvent {
  type: "after_provider_response";
  status: number;
  headers: Record<string, string>;
}
/** Fired after user submits prompt but before agent loop. */
interface BeforeAgentStartEvent {
  type: "before_agent_start";
  /** The raw user prompt text (after expansion). */
  prompt: string;
  /** Images attached to the user prompt, if any. */
  images?: ImageContent[];
  /** The fully assembled system prompt string. */
  systemPrompt: string;
  /** Structured options used to build the system prompt. Extensions can inspect this without re-discovering resources. */
  systemPromptOptions: BuildSystemPromptOptions;
}
/** Fired when an agent loop starts */
interface AgentStartEvent {
  type: "agent_start";
}
/** Fired when an agent loop ends */
interface AgentEndEvent {
  type: "agent_end";
  messages: AgentMessage[];
}
/** Fired at the start of each turn */
interface TurnStartEvent {
  type: "turn_start";
  turnIndex: number;
  timestamp: number;
}
/** Fired at the end of each turn */
interface TurnEndEvent {
  type: "turn_end";
  turnIndex: number;
  message: AgentMessage;
  toolResults: ToolResultMessage[];
}
/** Fired when a message starts (user, assistant, or toolResult) */
interface MessageStartEvent {
  type: "message_start";
  message: AgentMessage;
}
/** Fired during assistant message streaming with token-by-token updates */
interface MessageUpdateEvent {
  type: "message_update";
  message: AgentMessage;
  assistantMessageEvent: AssistantMessageEvent;
}
/** Fired when a message ends */
interface MessageEndEvent {
  type: "message_end";
  message: AgentMessage;
}
/** Fired when a tool starts executing */
interface ToolExecutionStartEvent {
  type: "tool_execution_start";
  toolCallId: string;
  toolName: string;
  args: unknown;
}
/** Fired during tool execution with partial/streaming output */
interface ToolExecutionUpdateEvent {
  type: "tool_execution_update";
  toolCallId: string;
  toolName: string;
  args: unknown;
  partialResult: unknown;
}
/** Fired when a tool finishes executing */
interface ToolExecutionEndEvent {
  type: "tool_execution_end";
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError: boolean;
}
type ModelSelectSource = "set" | "cycle" | "restore";
/** Fired when a new model is selected */
interface ModelSelectEvent {
  type: "model_select";
  model: Model;
  previousModel: Model | undefined;
  source: ModelSelectSource;
}
/** Fired when a new thinking level is selected */
interface ThinkingLevelSelectEvent {
  type: "thinking_level_select";
  level: ThinkingLevel;
  previousLevel: ThinkingLevel;
}
/** Fired when user executes a bash command via ! or !! prefix */
interface UserBashEvent {
  type: "user_bash";
  /** The command to execute */
  command: string;
  /** True if !! prefix was used (excluded from LLM context) */
  excludeFromContext: boolean;
  /** Current working directory */
  cwd: string;
}
/** Source of user input */
type InputSource = "interactive" | "rpc" | "extension";
/** Fired when user input is received, before agent processing */
interface InputEvent {
  type: "input";
  /** The input text */
  text: string;
  /** Attached images, if any */
  images?: ImageContent[];
  /** Where the input came from */
  source: InputSource;
}
/** Result from input event handler */
type InputEventResult =
  | {
      action: "continue";
    }
  | {
      action: "transform";
      text: string;
      images?: ImageContent[];
    }
  | {
      action: "handled";
    };
interface ToolCallEventBase {
  type: "tool_call";
  toolCallId: string;
}
interface BashToolCallEvent extends ToolCallEventBase {
  toolName: "bash";
  input: BashToolInput;
}
interface ReadToolCallEvent extends ToolCallEventBase {
  toolName: "read";
  input: ReadToolInput;
}
interface EditToolCallEvent extends ToolCallEventBase {
  toolName: "edit";
  input: EditToolInput;
}
interface WriteToolCallEvent extends ToolCallEventBase {
  toolName: "write";
  input: WriteToolInput;
}
interface GrepToolCallEvent extends ToolCallEventBase {
  toolName: "grep";
  input: GrepToolInput;
}
interface FindToolCallEvent extends ToolCallEventBase {
  toolName: "find";
  input: FindToolInput;
}
interface LsToolCallEvent extends ToolCallEventBase {
  toolName: "ls";
  input: LsToolInput;
}
interface CustomToolCallEvent extends ToolCallEventBase {
  toolName: string;
  input: Record<string, unknown>;
}
/**
 * Fired before a tool executes. Can block.
 *
 * `event.input` is mutable. Mutate it in place to patch tool arguments before execution.
 * Later `tool_call` handlers see earlier mutations. No re-validation is performed after mutation.
 */
type ToolCallEvent =
  | BashToolCallEvent
  | ReadToolCallEvent
  | EditToolCallEvent
  | WriteToolCallEvent
  | GrepToolCallEvent
  | FindToolCallEvent
  | LsToolCallEvent
  | CustomToolCallEvent;
interface ToolResultEventBase {
  type: "tool_result";
  toolCallId: string;
  input: Record<string, unknown>;
  content: (TextContent | ImageContent)[];
  isError: boolean;
}
interface BashToolResultEvent extends ToolResultEventBase {
  toolName: "bash";
  details: BashToolDetails | undefined;
}
interface ReadToolResultEvent extends ToolResultEventBase {
  toolName: "read";
  details: ReadToolDetails | undefined;
}
interface EditToolResultEvent extends ToolResultEventBase {
  toolName: "edit";
  details: EditToolDetails | undefined;
}
interface WriteToolResultEvent extends ToolResultEventBase {
  toolName: "write";
  details: undefined;
}
interface GrepToolResultEvent extends ToolResultEventBase {
  toolName: "grep";
  details: GrepToolDetails | undefined;
}
interface FindToolResultEvent extends ToolResultEventBase {
  toolName: "find";
  details: FindToolDetails | undefined;
}
interface LsToolResultEvent extends ToolResultEventBase {
  toolName: "ls";
  details: LsToolDetails | undefined;
}
interface CustomToolResultEvent extends ToolResultEventBase {
  toolName: string;
  details: unknown;
}
/** Fired after a tool executes. Can modify result. */
type ToolResultEvent =
  | BashToolResultEvent
  | ReadToolResultEvent
  | EditToolResultEvent
  | WriteToolResultEvent
  | GrepToolResultEvent
  | FindToolResultEvent
  | LsToolResultEvent
  | CustomToolResultEvent;
declare function isBashToolResult(e: ToolResultEvent): e is BashToolResultEvent;
declare function isReadToolResult(e: ToolResultEvent): e is ReadToolResultEvent;
declare function isEditToolResult(e: ToolResultEvent): e is EditToolResultEvent;
declare function isWriteToolResult(e: ToolResultEvent): e is WriteToolResultEvent;
declare function isGrepToolResult(e: ToolResultEvent): e is GrepToolResultEvent;
declare function isFindToolResult(e: ToolResultEvent): e is FindToolResultEvent;
declare function isLsToolResult(e: ToolResultEvent): e is LsToolResultEvent;
/**
 * Type guard for narrowing ToolCallEvent by tool name.
 *
 * Built-in tools narrow automatically (no type params needed):
 * ```ts
 * if (isToolCallEventType("bash", event)) {
 *   event.input.command;  // string
 * }
 * ```
 *
 * Custom tools require explicit type parameters:
 * ```ts
 * if (isToolCallEventType<"my_tool", MyToolInput>("my_tool", event)) {
 *   event.input.action;  // typed
 * }
 * ```
 *
 * Note: Direct narrowing via `event.toolName === "bash"` doesn't work because
 * CustomToolCallEvent.toolName is `string` which overlaps with all literals.
 */
declare function isToolCallEventType(
  toolName: "bash",
  event: ToolCallEvent,
): event is BashToolCallEvent;
declare function isToolCallEventType(
  toolName: "read",
  event: ToolCallEvent,
): event is ReadToolCallEvent;
declare function isToolCallEventType(
  toolName: "edit",
  event: ToolCallEvent,
): event is EditToolCallEvent;
declare function isToolCallEventType(
  toolName: "write",
  event: ToolCallEvent,
): event is WriteToolCallEvent;
declare function isToolCallEventType(
  toolName: "grep",
  event: ToolCallEvent,
): event is GrepToolCallEvent;
declare function isToolCallEventType(
  toolName: "find",
  event: ToolCallEvent,
): event is FindToolCallEvent;
declare function isToolCallEventType(
  toolName: "ls",
  event: ToolCallEvent,
): event is LsToolCallEvent;
declare function isToolCallEventType<TName extends string, TInput extends Record<string, unknown>>(
  toolName: TName,
  event: ToolCallEvent,
): event is ToolCallEvent & {
  toolName: TName;
  input: TInput;
};
/** Union of all event types */
type ExtensionEvent =
  | ResourcesDiscoverEvent
  | SessionEvent
  | ContextEvent
  | BeforeProviderRequestEvent
  | AfterProviderResponseEvent
  | BeforeAgentStartEvent
  | AgentStartEvent
  | AgentEndEvent
  | TurnStartEvent
  | TurnEndEvent
  | MessageStartEvent
  | MessageUpdateEvent
  | MessageEndEvent
  | ToolExecutionStartEvent
  | ToolExecutionUpdateEvent
  | ToolExecutionEndEvent
  | ModelSelectEvent
  | ThinkingLevelSelectEvent
  | UserBashEvent
  | InputEvent
  | ToolCallEvent
  | ToolResultEvent;
interface ContextEventResult {
  messages?: AgentMessage[];
}
type BeforeProviderRequestEventResult = unknown;
interface ToolCallEventResult {
  /** Block tool execution. To modify arguments, mutate `event.input` in place instead. */
  block?: boolean;
  reason?: string;
}
/** Result from user_bash event handler */
interface UserBashEventResult {
  /** Custom operations to use for execution */
  operations?: BashOperations;
  /** Full replacement: extension handled execution, use this result */
  result?: BashResult;
}
interface ToolResultEventResult {
  content?: (TextContent | ImageContent)[];
  details?: unknown;
  isError?: boolean;
}
interface MessageEndEventResult {
  /** Replace the finalized message. The replacement must keep the original message role. */
  message?: AgentMessage;
}
interface BeforeAgentStartEventResult {
  message?: Pick<CustomMessage, "customType" | "content" | "display" | "details">;
  /** Replace the system prompt for this turn. If multiple extensions return this, they are chained. */
  systemPrompt?: string;
}
interface SessionBeforeSwitchResult {
  cancel?: boolean;
}
interface SessionBeforeForkResult {
  cancel?: boolean;
  skipConversationRestore?: boolean;
}
interface SessionBeforeCompactResult {
  cancel?: boolean;
  compaction?: CompactionResult;
}
interface SessionBeforeTreeResult {
  cancel?: boolean;
  summary?: {
    summary: string;
    details?: unknown;
  };
  /** Override custom instructions for summarization */
  customInstructions?: string;
  /** Override whether customInstructions replaces the default prompt */
  replaceInstructions?: boolean;
  /** Override label to attach to the branch summary entry */
  label?: string;
}
interface MessageRenderOptions {
  expanded: boolean;
}
type MessageRenderer<T = unknown> = (
  message: CustomMessage<T>,
  options: MessageRenderOptions,
  theme: Theme,
) => Component | undefined;
interface RegisteredCommand {
  name: string;
  sourceInfo: SourceInfo;
  description?: string;
  getArgumentCompletions?: (
    argumentPrefix: string,
  ) => AutocompleteItem[] | null | Promise<AutocompleteItem[] | null>;
  handler: (args: string, ctx: ExtensionCommandContext) => Promise<void>;
}
interface ResolvedCommand extends RegisteredCommand {
  invocationName: string;
}
/** Handler function type for events */
type ExtensionHandler<E, R = undefined> = (
  event: E,
  ctx: ExtensionContext,
) => Promise<R | void> | R | void;
/**
 * ExtensionAPI passed to extension factory functions.
 */
interface ExtensionAPI {
  on(
    event: "resources_discover",
    handler: ExtensionHandler<ResourcesDiscoverEvent, ResourcesDiscoverResult>,
  ): void;
  on(event: "session_start", handler: ExtensionHandler<SessionStartEvent>): void;
  on(
    event: "session_before_switch",
    handler: ExtensionHandler<SessionBeforeSwitchEvent, SessionBeforeSwitchResult>,
  ): void;
  on(
    event: "session_before_fork",
    handler: ExtensionHandler<SessionBeforeForkEvent, SessionBeforeForkResult>,
  ): void;
  on(
    event: "session_before_compact",
    handler: ExtensionHandler<SessionBeforeCompactEvent, SessionBeforeCompactResult>,
  ): void;
  on(event: "session_compact", handler: ExtensionHandler<SessionCompactEvent>): void;
  on(event: "session_shutdown", handler: ExtensionHandler<SessionShutdownEvent>): void;
  on(
    event: "session_before_tree",
    handler: ExtensionHandler<SessionBeforeTreeEvent, SessionBeforeTreeResult>,
  ): void;
  on(event: "session_tree", handler: ExtensionHandler<SessionTreeEvent>): void;
  on(event: "context", handler: ExtensionHandler<ContextEvent, ContextEventResult>): void;
  on(
    event: "before_provider_request",
    handler: ExtensionHandler<BeforeProviderRequestEvent, BeforeProviderRequestEventResult>,
  ): void;
  on(event: "after_provider_response", handler: ExtensionHandler<AfterProviderResponseEvent>): void;
  on(
    event: "before_agent_start",
    handler: ExtensionHandler<BeforeAgentStartEvent, BeforeAgentStartEventResult>,
  ): void;
  on(event: "agent_start", handler: ExtensionHandler<AgentStartEvent>): void;
  on(event: "agent_end", handler: ExtensionHandler<AgentEndEvent>): void;
  on(event: "turn_start", handler: ExtensionHandler<TurnStartEvent>): void;
  on(event: "turn_end", handler: ExtensionHandler<TurnEndEvent>): void;
  on(event: "message_start", handler: ExtensionHandler<MessageStartEvent>): void;
  on(event: "message_update", handler: ExtensionHandler<MessageUpdateEvent>): void;
  on(event: "message_end", handler: ExtensionHandler<MessageEndEvent, MessageEndEventResult>): void;
  on(event: "tool_execution_start", handler: ExtensionHandler<ToolExecutionStartEvent>): void;
  on(event: "tool_execution_update", handler: ExtensionHandler<ToolExecutionUpdateEvent>): void;
  on(event: "tool_execution_end", handler: ExtensionHandler<ToolExecutionEndEvent>): void;
  on(event: "model_select", handler: ExtensionHandler<ModelSelectEvent>): void;
  on(event: "thinking_level_select", handler: ExtensionHandler<ThinkingLevelSelectEvent>): void;
  on(event: "tool_call", handler: ExtensionHandler<ToolCallEvent, ToolCallEventResult>): void;
  on(event: "tool_result", handler: ExtensionHandler<ToolResultEvent, ToolResultEventResult>): void;
  on(event: "user_bash", handler: ExtensionHandler<UserBashEvent, UserBashEventResult>): void;
  on(event: "input", handler: ExtensionHandler<InputEvent, InputEventResult>): void;
  /** Register a tool that the LLM can call. */
  registerTool<TParams extends TSchema = TSchema, TDetails = unknown, TState = unknown>(
    tool: ToolDefinition<TParams, TDetails, TState>,
  ): void;
  /** Register a custom command. */
  registerCommand(name: string, options: Omit<RegisteredCommand, "name" | "sourceInfo">): void;
  /** Register a keyboard shortcut. */
  registerShortcut(
    shortcut: KeyId,
    options: {
      description?: string;
      handler: (ctx: ExtensionContext) => Promise<void> | void;
    },
  ): void;
  /** Register a CLI flag. */
  registerFlag(
    name: string,
    options: {
      description?: string;
      type: "boolean" | "string";
      default?: boolean | string;
    },
  ): void;
  /** Get the value of a registered CLI flag. */
  getFlag(name: string): boolean | string | undefined;
  /** Register a custom renderer for CustomMessageEntry. */
  registerMessageRenderer<T = unknown>(customType: string, renderer: MessageRenderer<T>): void;
  /** Send a custom message to the session. */
  sendMessage<T = unknown>(
    message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">,
    options?: {
      triggerTurn?: boolean;
      deliverAs?: "steer" | "followUp" | "nextTurn";
    },
  ): void;
  /**
   * Send a user message to the agent. Always triggers a turn.
   * When the agent is streaming, use deliverAs to specify how to queue the message.
   */
  sendUserMessage(
    content: string | (TextContent | ImageContent)[],
    options?: {
      deliverAs?: "steer" | "followUp";
    },
  ): void;
  /** Append a custom entry to the session for state persistence (not sent to LLM). */
  appendEntry(customType: string, data?: unknown): void;
  /** Set the session display name (shown in session selector). */
  setSessionName(name: string): void;
  /** Get the current session name, if set. */
  getSessionName(): string | undefined;
  /** Set or clear a label on an entry. Labels are user-defined markers for bookmarking/navigation. */
  setLabel(entryId: string, label: string | undefined): void;
  /** Execute a shell command. */
  exec(command: string, args: string[], options?: ExecOptions): Promise<ExecResult>;
  /** Get the list of currently active tool names. */
  getActiveTools(): string[];
  /** Get all configured tools with parameter schema and source metadata. */
  getAllTools(): ToolInfo[];
  /** Set the active tools by name. */
  setActiveTools(toolNames: string[]): void;
  /** Get available slash commands in the current session. */
  getCommands(): SlashCommandInfo[];
  /** Set the current model. Returns false if no API key available. */
  setModel(model: Model): Promise<boolean>;
  /** Get current thinking level. */
  getThinkingLevel(): ThinkingLevel;
  /** Set thinking level (clamped to model capabilities). */
  setThinkingLevel(level: ThinkingLevel): void;
  /**
   * Register a model provider.
   *
   * If `models` is provided: replaces all existing models for this provider.
   * If `oauth` is provided: registers OAuth provider for /login support.
   * If `streamSimple` is provided: registers a custom API stream handler.
   *
   * During initial extension load this call is queued and applied once the
   * runner has bound its context. After that it takes effect immediately, so
   * it is safe to call from command handlers or event callbacks without
   * requiring a `/reload`.
   *
   * @example
   * // Register a new provider with custom models
   * api.registerProvider("my-proxy", {
   *   baseUrl: "https://proxy.example.com",
   *   apiKey: "PROXY_API_KEY",
   *   api: "anthropic-messages",
   *   models: [
   *     {
   *       id: "claude-sonnet-4-20250514",
   *       name: "Claude 4 Sonnet (proxy)",
   *       reasoning: false,
   *       input: ["text", "image"],
   *       cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
   *       contextWindow: 200000,
   *       maxTokens: 16384
   *     }
   *   ]
   * });
   *
   * @example
   * // Override baseUrl for an existing provider
   * api.registerProvider("anthropic", {
   *   baseUrl: "https://proxy.example.com"
   * });
   *
   * @example
   * // Register provider with OAuth support
   * api.registerProvider("corporate-ai", {
   *   baseUrl: "https://ai.corp.com",
   *   api: "openai-responses",
   *   models: [...],
   *   oauth: {
   *     name: "Corporate AI (SSO)",
   *     async login(callbacks) { ... },
   *     async refreshToken(credentials) { ... },
   *     getApiKey(credentials) { return credentials.access; }
   *   }
   * });
   */
  registerProvider(name: string, config: ProviderConfig): void;
  /**
   * Unregister a previously registered provider.
   *
   * Removes all models belonging to the named provider and reloads the configured
   * model registry. Has no effect if the provider is not currently registered.
   *
   * Like `registerProvider`, this takes effect immediately when called after
   * the initial load phase.
   *
   * @example
   * api.unregisterProvider("my-proxy");
   */
  unregisterProvider(name: string): void;
  /** Shared event bus for extension communication. */
  events: EventBus;
}
/** Configuration for registering a provider via api.registerProvider(). */
interface ProviderConfig {
  /** Display name for the provider in UI. */
  name?: string;
  /** Base URL for the API endpoint. Required when defining models. */
  baseUrl?: string;
  /** API key or environment variable name. Required when defining models (unless oauth provided). */
  apiKey?: string;
  /** API type. Required at provider or model level when defining models. */
  api?: Api;
  /** Optional streamSimple handler for custom APIs. */
  streamSimple?: (
    model: Model,
    context: Context,
    options?: SimpleStreamOptions,
  ) => AssistantMessageEventStreamContract;
  /** Custom headers to include in requests. */
  headers?: Record<string, string>;
  /** If true, adds Authorization: Bearer header with the resolved API key. */
  authHeader?: boolean;
  /** Models to register. If provided, replaces all existing models for this provider. */
  models?: ProviderModelConfig[];
  /** OAuth provider for /login support. The `id` is set automatically from the provider name. */
  oauth?: {
    /** Display name for the provider in login UI. */ name: string /** Run the login flow, return credentials to persist. */;
    login(
      callbacks: OAuthLoginCallbacks,
    ): Promise<OAuthCredentials> /** Refresh expired credentials, return updated credentials to persist. */;
    refreshToken(
      credentials: OAuthCredentials,
    ): Promise<OAuthCredentials> /** Convert credentials to API key string for the provider. */;
    getApiKey(
      credentials: OAuthCredentials,
    ): string /** Optional: modify models for this provider (e.g., update baseUrl based on credentials). */;
    modifyModels?(models: Model[], credentials: OAuthCredentials): Model[];
  };
}
/** Configuration for a model within a provider. */
interface ProviderModelConfig {
  /** Model ID (e.g., "claude-sonnet-4-20250514"). */
  id: string;
  /** Display name (e.g., "Claude 4 Sonnet"). */
  name: string;
  /** API type override for this model. */
  api?: Api;
  /** API endpoint URL override for this model. */
  baseUrl?: string;
  /** Whether the model supports extended thinking. */
  reasoning: boolean;
  /** Maps OpenClaw thinking levels to provider/model-specific values; null marks a level unsupported. */
  thinkingLevelMap?: Model["thinkingLevelMap"];
  /** Supported input types. */
  input: ("text" | "image")[];
  /** Cost per token (for tracking, can be 0). */
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  /** Maximum context window size in tokens. */
  contextWindow: number;
  /** Maximum output tokens. */
  maxTokens: number;
  /** Custom headers for this model. */
  headers?: Record<string, string>;
  /** OpenAI compatibility settings. */
  compat?: Model["compat"];
}
/** Extension factory function type. Supports both sync and async initialization. */
type ExtensionFactory = (api: ExtensionAPI) => void | Promise<void>;
interface RegisteredTool {
  definition: ToolDefinition;
  sourceInfo: SourceInfo;
}
interface ExtensionFlag {
  name: string;
  description?: string;
  type: "boolean" | "string";
  default?: boolean | string;
  extensionPath: string;
}
interface ExtensionShortcut {
  shortcut: KeyId;
  description?: string;
  handler: (ctx: ExtensionContext) => Promise<void> | void;
  extensionPath: string;
}
type HandlerFn = (...args: unknown[]) => Promise<unknown>;
type SendMessageHandler = <T = unknown>(
  message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">,
  options?: {
    triggerTurn?: boolean;
    deliverAs?: "steer" | "followUp" | "nextTurn";
  },
) => void;
type SendUserMessageHandler = (
  content: string | (TextContent | ImageContent)[],
  options?: {
    deliverAs?: "steer" | "followUp";
  },
) => void;
type AppendEntryHandler = (customType: string, data?: unknown) => void;
type SetSessionNameHandler = (name: string) => void;
type GetSessionNameHandler = () => string | undefined;
type GetActiveToolsHandler = () => string[];
/** Tool info with name, description, parameter schema, and source metadata */
type ToolInfo = Pick<ToolDefinition, "name" | "description" | "parameters"> & {
  sourceInfo: SourceInfo;
};
type GetAllToolsHandler = () => ToolInfo[];
type GetCommandsHandler = () => SlashCommandInfo[];
type SetActiveToolsHandler = (toolNames: string[]) => void;
type RefreshToolsHandler = () => void;
type SetModelHandler = (model: Model) => Promise<boolean>;
type GetThinkingLevelHandler = () => ThinkingLevel;
type SetThinkingLevelHandler = (level: ThinkingLevel) => void;
type SetLabelHandler = (entryId: string, label: string | undefined) => void;
/**
 * Shared state created by loader, used during registration and runtime.
 * Contains flag values (defaults set during registration, CLI values set after).
 */
interface ExtensionRuntimeState {
  flagValues: Map<string, boolean | string>;
  /** Provider registrations queued during extension loading, processed when runner binds */
  pendingProviderRegistrations: Array<{
    name: string;
    config: ProviderConfig;
    extensionPath: string;
  }>;
  /** Throws when this extension instance is stale after runtime replacement. */
  assertActive: () => void;
  /** Marks this extension instance as stale after runtime replacement or reload. */
  invalidate: (message?: string) => void;
  /**
   * Register or unregister a provider.
   *
   * Before bindCore(): queues registrations / removes from queue.
   * After bindCore(): calls ModelRegistry directly for immediate effect.
   */
  registerProvider: (name: string, config: ProviderConfig, extensionPath?: string) => void;
  unregisterProvider: (name: string, extensionPath?: string) => void;
}
/**
 * Action implementations for ExtensionAPI methods.
 * Provided to runner.initialize(), copied into the shared runtime.
 */
interface ExtensionActions {
  sendMessage: SendMessageHandler;
  sendUserMessage: SendUserMessageHandler;
  appendEntry: AppendEntryHandler;
  setSessionName: SetSessionNameHandler;
  getSessionName: GetSessionNameHandler;
  setLabel: SetLabelHandler;
  getActiveTools: GetActiveToolsHandler;
  getAllTools: GetAllToolsHandler;
  setActiveTools: SetActiveToolsHandler;
  refreshTools: RefreshToolsHandler;
  getCommands: GetCommandsHandler;
  setModel: SetModelHandler;
  getThinkingLevel: GetThinkingLevelHandler;
  setThinkingLevel: SetThinkingLevelHandler;
}
/**
 * Actions for ExtensionContext (ctx.* in event handlers).
 * Required by all modes.
 */
interface ExtensionContextActions {
  getModel: () => Model | undefined;
  isIdle: () => boolean;
  getSignal: () => AbortSignal | undefined;
  abort: () => void;
  hasPendingMessages: () => boolean;
  shutdown: () => void;
  getContextUsage: () => ContextUsage | undefined;
  compact: (options?: CompactOptions) => void;
  getSystemPrompt: () => string;
}
/**
 * Actions for ExtensionCommandContext (ctx.* in command handlers).
 * Only needed for interactive mode where extension commands are invokable.
 */
interface ExtensionCommandContextActions {
  waitForIdle: () => Promise<void>;
  newSession: (options?: {
    parentSession?: string;
    setup?: (sessionManager: SessionManager) => Promise<void>;
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }) => Promise<{
    cancelled: boolean;
  }>;
  fork: (
    entryId: string,
    options?: {
      position?: "before" | "at";
      withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
    },
  ) => Promise<{
    cancelled: boolean;
  }>;
  navigateTree: (
    targetId: string,
    options?: {
      summarize?: boolean;
      customInstructions?: string;
      replaceInstructions?: boolean;
      label?: string;
    },
  ) => Promise<{
    cancelled: boolean;
  }>;
  switchSession: (
    sessionPath: string,
    options?: {
      withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
    },
  ) => Promise<{
    cancelled: boolean;
  }>;
  reload: () => Promise<void>;
}
/**
 * Full runtime = state + actions.
 * Created by loader with throwing action stubs, completed by runner.initialize().
 */
interface ExtensionRuntime extends ExtensionRuntimeState, ExtensionActions {}
/** Loaded extension with all registered items. */
interface Extension {
  path: string;
  resolvedPath: string;
  sourceInfo: SourceInfo;
  handlers: Map<string, HandlerFn[]>;
  tools: Map<string, RegisteredTool>;
  messageRenderers: Map<string, MessageRenderer>;
  commands: Map<string, RegisteredCommand>;
  flags: Map<string, ExtensionFlag>;
  shortcuts: Map<KeyId, ExtensionShortcut>;
}
/** Result of loading extensions. */
interface LoadExtensionsResult {
  extensions: Extension[];
  errors: Array<{
    path: string;
    error: string;
  }>;
  /** Shared runtime - actions are throwing stubs until runner.initialize() */
  runtime: ExtensionRuntime;
}
interface ExtensionError {
  extensionPath: string;
  event: string;
  error: string;
  stack?: string;
}
//#endregion
//#region src/agents/sessions/extensions/loader.d.ts
/**
 * Create a runtime with throwing stubs for action methods.
 * Runner.bindCore() replaces these with real implementations.
 */
declare function createExtensionRuntime(): ExtensionRuntime;
/**
 * Create an Extension from an inline factory function.
 */
declare function loadExtensionFromFactory(
  factory: ExtensionFactory,
  cwd: string,
  eventBus: EventBus,
  runtime: ExtensionRuntime,
  extensionPath?: string,
): Promise<Extension>;
/**
 * Load extensions from paths.
 */
declare function loadExtensions(
  paths: string[],
  cwd: string,
  eventBus?: EventBus,
): Promise<LoadExtensionsResult>;
/**
 * Discover and load extensions from standard locations.
 */
declare function discoverAndLoadExtensions(
  configuredPaths: string[],
  cwd: string,
  agentDir?: string,
  eventBus?: EventBus,
): Promise<LoadExtensionsResult>;
//#endregion
//#region src/agents/sessions/extensions/runner.d.ts
/** Combined result from all before_agent_start handlers */
interface BeforeAgentStartCombinedResult {
  messages?: NonNullable<BeforeAgentStartEventResult["message"]>[];
  systemPrompt?: string;
}
/**
 * Events handled by the generic emit() method.
 * Events with dedicated emitXxx() methods are excluded for stronger type safety.
 */
type RunnerEmitEvent = Exclude<
  ExtensionEvent,
  | ToolCallEvent
  | ToolResultEvent
  | UserBashEvent
  | ContextEvent
  | BeforeProviderRequestEvent
  | BeforeAgentStartEvent
  | MessageEndEvent
  | ResourcesDiscoverEvent
  | InputEvent
>;
type RunnerEmitResult<TEvent extends RunnerEmitEvent> = TEvent extends {
  type: "session_before_switch";
}
  ? SessionBeforeSwitchResult | undefined
  : TEvent extends {
        type: "session_before_fork";
      }
    ? SessionBeforeForkResult | undefined
    : TEvent extends {
          type: "session_before_compact";
        }
      ? SessionBeforeCompactResult | undefined
      : TEvent extends {
            type: "session_before_tree";
          }
        ? SessionBeforeTreeResult | undefined
        : undefined;
type ExtensionErrorListener = (error: ExtensionError) => void;
type NewSessionHandler = (options?: {
  parentSession?: string;
  setup?: (sessionManager: SessionManager) => Promise<void>;
  withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
}) => Promise<{
  cancelled: boolean;
}>;
type ForkHandler = (
  entryId: string,
  options?: {
    position?: "before" | "at";
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  },
) => Promise<{
  cancelled: boolean;
}>;
type NavigateTreeHandler = (
  targetId: string,
  options?: {
    summarize?: boolean;
    customInstructions?: string;
    replaceInstructions?: boolean;
    label?: string;
  },
) => Promise<{
  cancelled: boolean;
}>;
type SwitchSessionHandler = (
  sessionPath: string,
  options?: {
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  },
) => Promise<{
  cancelled: boolean;
}>;
type ShutdownHandler = () => void;
declare class ExtensionRunner {
  private extensions;
  private runtime;
  private uiContext;
  private cwd;
  private sessionManager;
  private modelRegistry;
  private errorListeners;
  private getModel;
  private isIdleFn;
  private getSignalFn;
  private waitForIdleFn;
  private abortFn;
  private hasPendingMessagesFn;
  private getContextUsageFn;
  private compactFn;
  private getSystemPromptFn;
  private newSessionHandler;
  private forkHandler;
  private navigateTreeHandler;
  private switchSessionHandler;
  private reloadHandler;
  private shutdownHandler;
  private shortcutDiagnostics;
  private commandDiagnostics;
  private staleMessage;
  constructor(
    extensions: Extension[],
    runtime: ExtensionRuntime,
    cwd: string,
    sessionManager: SessionManager,
    modelRegistry: ModelRegistry,
  );
  bindCore(
    actions: ExtensionActions,
    contextActions: ExtensionContextActions,
    providerActions?: {
      registerProvider?: (name: string, config: ProviderConfig) => void;
      unregisterProvider?: (name: string) => void;
    },
  ): void;
  bindCommandContext(actions?: ExtensionCommandContextActions): void;
  setUIContext(uiContext?: ExtensionUIContext): void;
  getUIContext(): ExtensionUIContext;
  hasUI(): boolean;
  getExtensionPaths(): string[];
  /** Get all registered tools from all extensions (first registration per name wins). */
  getAllRegisteredTools(): RegisteredTool[];
  /** Get a tool definition by name. Returns undefined if not found. */
  getToolDefinition(toolName: string): RegisteredTool["definition"] | undefined;
  getFlags(): Map<string, ExtensionFlag>;
  setFlagValue(name: string, value: boolean | string): void;
  getFlagValues(): Map<string, boolean | string>;
  getShortcuts(resolvedKeybindings: KeybindingsConfig): Map<KeyId, ExtensionShortcut>;
  getShortcutDiagnostics(): ResourceDiagnostic[];
  invalidate(message?: string): void;
  private assertActive;
  onError(listener: ExtensionErrorListener): () => void;
  emitError(error: ExtensionError): void;
  hasHandlers(eventType: string): boolean;
  getMessageRenderer(customType: string): MessageRenderer | undefined;
  private resolveRegisteredCommands;
  getRegisteredCommands(): ResolvedCommand[];
  getCommandDiagnostics(): ResourceDiagnostic[];
  getCommand(name: string): ResolvedCommand | undefined;
  /**
   * Request a graceful shutdown. Called by extension tools and event handlers.
   * The actual shutdown behavior is provided by the mode via bindExtensions().
   */
  shutdown(): void;
  /**
   * Create an ExtensionContext for use in event handlers and tool execution.
   * Context values are resolved at call time, so changes via bindCore/bindUI are reflected.
   */
  createContext(): ExtensionContext;
  createCommandContext(): ExtensionCommandContext;
  private isSessionBeforeEvent;
  emit<TEvent extends RunnerEmitEvent>(event: TEvent): Promise<RunnerEmitResult<TEvent>>;
  emitMessageEnd(event: MessageEndEvent): Promise<AgentMessage | undefined>;
  emitToolResult(event: ToolResultEvent): Promise<ToolResultEventResult | undefined>;
  emitToolCall(event: ToolCallEvent): Promise<ToolCallEventResult | undefined>;
  emitUserBash(event: UserBashEvent): Promise<UserBashEventResult | undefined>;
  emitContext(messages: AgentMessage[]): Promise<AgentMessage[]>;
  emitBeforeProviderRequest(payload: unknown): Promise<unknown>;
  emitBeforeAgentStart(
    prompt: string,
    images: ImageContent[] | undefined,
    systemPrompt: string,
    systemPromptOptions: BuildSystemPromptOptions,
  ): Promise<BeforeAgentStartCombinedResult | undefined>;
  emitResourcesDiscover(
    cwd: string,
    reason: ResourcesDiscoverEvent["reason"],
  ): Promise<{
    skillPaths: Array<{
      path: string;
      extensionPath: string;
    }>;
    promptPaths: Array<{
      path: string;
      extensionPath: string;
    }>;
    themePaths: Array<{
      path: string;
      extensionPath: string;
    }>;
  }>;
  /** Emit input event. Transforms chain, "handled" short-circuits. */
  emitInput(
    text: string,
    images: ImageContent[] | undefined,
    source: InputSource,
  ): Promise<InputEventResult>;
}
//#endregion
//#region src/agents/sessions/extensions/wrapper.d.ts
/**
 * Wrap a RegisteredTool into an AgentTool.
 * Uses the runner's createContext() for consistent context across tools and event handlers.
 */
declare function wrapRegisteredTool(
  registeredTool: RegisteredTool,
  runner: ExtensionRunner,
): AgentTool;
/**
 * Wrap all registered tools into AgentTools.
 * Uses the runner's createContext() for consistent context across tools and event handlers.
 */
declare function wrapRegisteredTools(
  registeredTools: RegisteredTool[],
  runner: ExtensionRunner,
): AgentTool[];
//#endregion
//#region src/agents/sessions/prompt-templates.d.ts
/**
 * Represents a prompt template loaded from a markdown file
 */
interface PromptTemplate {
  name: string;
  description: string;
  argumentHint?: string;
  content: string;
  sourceInfo: SourceInfo;
  filePath: string;
}
//#endregion
//#region src/agents/sessions/resource-loader.d.ts
interface ResourceExtensionPaths {
  skillPaths?: Array<{
    path: string;
    metadata: PathMetadata;
  }>;
  promptPaths?: Array<{
    path: string;
    metadata: PathMetadata;
  }>;
  themePaths?: Array<{
    path: string;
    metadata: PathMetadata;
  }>;
}
interface ResourceLoader {
  getExtensions(): LoadExtensionsResult;
  getSkills(): {
    skills: Skill[];
    diagnostics: ResourceDiagnostic[];
  };
  getPrompts(): {
    prompts: PromptTemplate[];
    diagnostics: ResourceDiagnostic[];
  };
  getThemes(): {
    themes: Theme[];
    diagnostics: ResourceDiagnostic[];
  };
  getAgentsFiles(): {
    agentsFiles: Array<{
      path: string;
      content: string;
    }>;
  };
  getSystemPrompt(): string | undefined;
  getAppendSystemPrompt(): string[];
  extendResources(paths: ResourceExtensionPaths): void;
  reload(): Promise<void>;
}
declare function loadProjectContextFiles(options: { cwd: string; agentDir: string }): Array<{
  path: string;
  content: string;
}>;
interface DefaultResourceLoaderOptions {
  cwd: string;
  agentDir: string;
  settingsManager?: SettingsManager;
  eventBus?: EventBus;
  additionalExtensionPaths?: string[];
  additionalSkillPaths?: string[];
  additionalPromptTemplatePaths?: string[];
  additionalThemePaths?: string[];
  extensionFactories?: ExtensionFactory[];
  noExtensions?: boolean;
  noSkills?: boolean;
  noPromptTemplates?: boolean;
  noThemes?: boolean;
  noContextFiles?: boolean;
  systemPrompt?: string;
  appendSystemPrompt?: string[];
  extensionsOverride?: (base: LoadExtensionsResult) => LoadExtensionsResult;
  skillsOverride?: (base: { skills: Skill[]; diagnostics: ResourceDiagnostic[] }) => {
    skills: Skill[];
    diagnostics: ResourceDiagnostic[];
  };
  promptsOverride?: (base: { prompts: PromptTemplate[]; diagnostics: ResourceDiagnostic[] }) => {
    prompts: PromptTemplate[];
    diagnostics: ResourceDiagnostic[];
  };
  themesOverride?: (base: { themes: Theme[]; diagnostics: ResourceDiagnostic[] }) => {
    themes: Theme[];
    diagnostics: ResourceDiagnostic[];
  };
  agentsFilesOverride?: (base: {
    agentsFiles: Array<{
      path: string;
      content: string;
    }>;
  }) => {
    agentsFiles: Array<{
      path: string;
      content: string;
    }>;
  };
  systemPromptTransform?: (base: string | undefined) => string | undefined;
  appendSystemPromptTransform?: (base: string[]) => string[];
  /** @deprecated Public SDK alias. Use systemPromptTransform. */
  systemPromptOverride?: (base: string | undefined) => string | undefined;
  /** @deprecated Public SDK alias. Use appendSystemPromptTransform. */
  appendSystemPromptOverride?: (base: string[]) => string[];
}
declare class DefaultResourceLoader implements ResourceLoader {
  private cwd;
  private agentDir;
  private settingsManager;
  private eventBus;
  private packageManager;
  private additionalExtensionPaths;
  private additionalSkillPaths;
  private additionalPromptTemplatePaths;
  private additionalThemePaths;
  private extensionFactories;
  private noExtensions;
  private noSkills;
  private noPromptTemplates;
  private noThemes;
  private noContextFiles;
  private systemPromptSource?;
  private appendSystemPromptSource?;
  private extensionsOverride?;
  private skillsOverride?;
  private promptsOverride?;
  private themesOverride?;
  private agentsFilesOverride?;
  private systemPromptTransform?;
  private appendSystemPromptTransform?;
  private extensionsResult;
  private skills;
  private skillDiagnostics;
  private prompts;
  private promptDiagnostics;
  private themes;
  private themeDiagnostics;
  private agentsFiles;
  private systemPrompt?;
  private appendSystemPrompt;
  private lastSkillPaths;
  private extensionSkillSourceInfos;
  private extensionPromptSourceInfos;
  private extensionThemeSourceInfos;
  private lastPromptPaths;
  private lastThemePaths;
  constructor(options: DefaultResourceLoaderOptions);
  getExtensions(): LoadExtensionsResult;
  getSkills(): {
    skills: Skill[];
    diagnostics: ResourceDiagnostic[];
  };
  getPrompts(): {
    prompts: PromptTemplate[];
    diagnostics: ResourceDiagnostic[];
  };
  getThemes(): {
    themes: Theme[];
    diagnostics: ResourceDiagnostic[];
  };
  getAgentsFiles(): {
    agentsFiles: Array<{
      path: string;
      content: string;
    }>;
  };
  getSystemPrompt(): string | undefined;
  getAppendSystemPrompt(): string[];
  extendResources(paths: ResourceExtensionPaths): void;
  reload(): Promise<void>;
  private normalizeExtensionPaths;
  private updateSkillsFromPaths;
  private updatePromptsFromPaths;
  private updateThemesFromPaths;
  private applyExtensionSourceInfo;
  private findSourceInfoForPath;
  private getDefaultSourceInfoForPath;
  private mergePaths;
  private resolveResourcePath;
  private loadThemes;
  private loadThemesFromDir;
  private loadThemeFromFile;
  private loadExtensionFactories;
  private dedupePrompts;
  private dedupeThemes;
  private discoverSystemPromptFile;
  private discoverAppendSystemPromptFile;
  private isUnderPath;
  private detectExtensionConflicts;
}
//#endregion
//#region src/agents/sessions/agent-session.d.ts
/** Parsed skill block from a user message */
interface ParsedSkillBlock {
  name: string;
  location: string;
  content: string;
  userMessage: string | undefined;
}
/**
 * Parse a skill block from message text.
 * Returns null if the text doesn't contain a skill block.
 */
declare function parseSkillBlock(text: string): ParsedSkillBlock | null;
/** Session-specific events that extend the core AgentEvent */
type AgentSessionEvent =
  | Exclude<
      AgentEvent,
      {
        type: "agent_end";
      }
    >
  | {
      type: "agent_end";
      messages: AgentMessage[];
      willRetry: boolean;
    }
  | {
      type: "queue_update";
      steering: readonly string[];
      followUp: readonly string[];
    }
  | {
      type: "compaction_start";
      reason: "manual" | "threshold" | "overflow";
    }
  | {
      type: "session_info_changed";
      name: string | undefined;
    }
  | {
      type: "thinking_level_changed";
      level: ThinkingLevel;
    }
  | {
      type: "compaction_end";
      reason: "manual" | "threshold" | "overflow";
      result: CompactionResult | undefined;
      aborted: boolean;
      willRetry: boolean;
      errorMessage?: string;
    }
  | {
      type: "auto_retry_start";
      attempt: number;
      maxAttempts: number;
      delayMs: number;
      errorMessage: string;
    }
  | {
      type: "auto_retry_end";
      success: boolean;
      attempt: number;
      finalError?: string;
    };
/** Listener function for agent session events */
type AgentSessionEventListener = (event: AgentSessionEvent) => void;
type AgentSessionWriteLockRunner = <T>(run: () => Promise<T> | T) => Promise<T>;
interface AgentSessionConfig {
  agent: Agent;
  sessionManager: SessionManager;
  settingsManager: SettingsManager;
  cwd: string;
  /** Models to cycle through with Ctrl+P (from --models flag) */
  scopedModels?: Array<{
    model: Model;
    thinkingLevel?: ThinkingLevel;
  }>;
  /** Resource loader for skills, prompts, themes, context files, system prompt */
  resourceLoader: ResourceLoader;
  /** SDK custom tools registered outside extensions */
  customTools?: ToolDefinition[];
  /** Model registry for API key resolution and model discovery */
  modelRegistry: ModelRegistry;
  /** Initial active built-in tool names. Default: [read, bash, edit, write] */
  initialActiveToolNames?: string[];
  /** Optional allowlist of tool names. When provided, only these tool names are exposed. */
  allowedToolNames?: string[];
  /** Exclude built-in shell/filesystem tools from the registry. */
  disableBuiltInTools?: boolean;
  /**
   * Override base tools (useful for custom runtimes).
   *
   * These are synthesized into minimal ToolDefinitions internally so AgentSession can keep
   * a definition-first registry even when callers provide plain AgentTool instances.
   */
  baseToolsOverride?: Record<string, AgentTool>;
  /** Mutable ref used by Agent to access the current ExtensionRunner */
  extensionRunnerRef?: {
    current?: ExtensionRunner;
  };
  /** Session start event metadata emitted when extensions bind to this runtime. */
  sessionStartEvent?: SessionStartEvent;
  /** Optional lock used by embedded runs before session-file writes or write-capable hooks. */
  withSessionWriteLock?: AgentSessionWriteLockRunner;
}
interface ExtensionBindings {
  uiContext?: ExtensionUIContext;
  commandContextActions?: ExtensionCommandContextActions;
  abortHandler?: () => void;
  shutdownHandler?: ShutdownHandler;
  onError?: ExtensionErrorListener;
}
/** Options for AgentSession.prompt() */
interface PromptOptions {
  /** Whether to expand file-based prompt templates (default: true) */
  expandPromptTemplates?: boolean;
  /** Image attachments */
  images?: ImageContent[];
  /** When streaming, how to queue the message: "steer" (interrupt) or "followUp" (wait). Required if streaming. */
  streamingBehavior?: "steer" | "followUp";
  /** Source of input for extension input event handlers. Defaults to "interactive". */
  source?: InputSource;
  /** Internal hook used by RPC mode to observe prompt preflight acceptance or rejection. */
  preflightResult?: (success: boolean) => void;
}
/** Result from cycleModel() */
interface ModelCycleResult {
  model: Model;
  thinkingLevel: ThinkingLevel;
  /** Whether cycling through scoped models (--models flag) or all available */
  isScoped: boolean;
}
/** Session statistics for /session command */
interface SessionStats {
  sessionFile: string | undefined;
  sessionId: string;
  userMessages: number;
  assistantMessages: number;
  toolCalls: number;
  toolResults: number;
  totalMessages: number;
  tokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
  cost: number;
  contextUsage?: ContextUsage;
}
declare class AgentSession {
  readonly agent: Agent;
  readonly sessionManager: SessionManager;
  readonly settingsManager: SettingsManager;
  private scopedModelEntries;
  private unsubscribeAgent?;
  private eventListeners;
  /** Tracks pending steering messages for UI display. Removed when delivered. */
  private steeringMessages;
  /** Tracks pending follow-up messages for UI display. Removed when delivered. */
  private followUpMessages;
  /** Messages queued to be included with the next user prompt as context ("asides"). */
  private pendingNextTurnMessages;
  private compactionAbortController;
  private autoCompactionAbortController;
  private overflowRecoveryAttempted;
  private branchSummaryAbortController;
  private extensionModifiedToolResultIds;
  private retryAbortController;
  private retryCount;
  private autoContinueRunHadToolCall;
  private bashAbortController;
  private pendingBashMessages;
  private currentExtensionRunner;
  private turnIndex;
  private sessionResourceLoader;
  private customTools;
  private baseToolDefinitions;
  private cwd;
  private extensionRunnerRef?;
  private initialActiveToolNames?;
  private allowedToolNames?;
  private disableBuiltInTools;
  private baseToolsOverride?;
  private sessionStartEvent;
  private withExternalSessionWriteLock?;
  private extensionUIContext?;
  private extensionCommandContextActions?;
  private extensionAbortHandler?;
  private extensionShutdownHandler?;
  private extensionErrorListener?;
  private extensionErrorUnsubscriber?;
  private sessionModelRegistry;
  private toolRegistry;
  private toolDefinitions;
  private toolPromptSnippets;
  private toolPromptGuidelines;
  private baseSystemPrompt;
  private baseSystemPromptOptions;
  private exactBaseSystemPrompt;
  constructor(config: AgentSessionConfig);
  /** Model registry for API key resolution and model discovery */
  get modelRegistry(): ModelRegistry;
  private getRequiredRequestAuth;
  private getCompactionRequestAuth;
  private runWithSessionWriteLock;
  private eventMayWriteSession;
  /**
   * Install tool hooks once on the Agent instance.
   *
   * The callbacks read `this.currentExtensionRunner` at execution time, so extension reload swaps in the
   * new runner without reinstalling hooks. Extension-specific tool wrappers are still used to adapt
   * registered tool execution to the extension context. Tool call and tool result interception now
   * happens here instead of in wrappers.
   */
  private installAgentToolHooks;
  /** Emit an event to all listeners */
  private emit;
  private emitQueueUpdate;
  private lastAssistantMessage;
  /** Internal handler for agent events - shared by subscribe and reconnect */
  private handleAgentEvent;
  private handleAgentEventUnlocked;
  private willRetryAfterAgentEnd;
  /** Extract text content from a message */
  private getUserMessageText;
  /** Find the last assistant message in agent state (including aborted ones) */
  private findLastAssistantMessage;
  private replaceMessageInPlace;
  /** Emit extension events based on agent events */
  private emitExtensionEvent;
  /**
   * Subscribe to agent events.
   * Session persistence is handled internally (saves messages on message_end).
   * Multiple listeners can be added. Returns unsubscribe function for this listener.
   */
  subscribe(listener: AgentSessionEventListener): () => void;
  /**
   * Temporarily disconnect from agent events.
   * User listeners are preserved and will receive events again after resubscribe().
   * Used internally during operations that need to pause event processing.
   */
  private disconnectFromAgent;
  /**
   * Reconnect to agent events after disconnectFromAgent().
   * Preserves all existing listeners.
   */
  private reconnectToAgent;
  /**
   * Remove all listeners and disconnect from agent.
   * Call this when completely done with the session.
   */
  dispose(): void;
  /** Full agent state */
  get state(): AgentState;
  /** Current model (may be undefined if not yet selected) */
  get model(): Model | undefined;
  /** Current thinking level */
  get thinkingLevel(): ThinkingLevel;
  /** Whether agent is currently streaming a response */
  get isStreaming(): boolean;
  /** Current effective system prompt (includes any per-turn extension modifications) */
  get systemPrompt(): string;
  /** Current retry attempt (0 if not retrying) */
  get retryAttempt(): number;
  /**
   * Get the names of currently active tools.
   * Returns the names of tools currently set on the agent.
   */
  getActiveToolNames(): string[];
  /**
   * Get all configured tools with name, description, parameter schema, and source metadata.
   */
  getAllTools(): ToolInfo[];
  getToolDefinition(name: string): ToolDefinition | undefined;
  /**
   * Set active tools by name.
   * Only tools in the registry can be enabled. Unknown tool names are ignored.
   * Also rebuilds the system prompt to reflect the new tool set.
   * Changes take effect on the next agent turn.
   */
  setActiveToolsByName(toolNames: string[]): void;
  /** Set an exact base prompt owned by the current runtime. */
  setBaseSystemPrompt(systemPrompt: string): void;
  /** Whether compaction or branch summarization is currently running */
  get isCompacting(): boolean;
  /** All messages including custom types like BashExecutionMessage */
  get messages(): AgentMessage[];
  /** Current steering mode */
  get steeringMode(): "all" | "one-at-a-time";
  /** Current follow-up mode */
  get followUpMode(): "all" | "one-at-a-time";
  /** Current session file path, or undefined if sessions are disabled */
  get sessionFile(): string | undefined;
  /** Current session ID */
  get sessionId(): string;
  /** Current session display name, if set */
  get sessionName(): string | undefined;
  /** Scoped models for cycling (from --models flag) */
  get scopedModels(): ReadonlyArray<{
    model: Model;
    thinkingLevel?: ThinkingLevel;
  }>;
  /** Update scoped models for cycling */
  setScopedModels(
    scopedModels: Array<{
      model: Model;
      thinkingLevel?: ThinkingLevel;
    }>,
  ): void;
  /** File-based prompt templates */
  get promptTemplates(): ReadonlyArray<PromptTemplate>;
  private normalizePromptSnippet;
  private normalizePromptGuidelines;
  private collectActiveToolPromptMetadata;
  private rebuildSystemPrompt;
  private runAgentPrompt;
  /** [autoproduct] The task the planner reasons over: the first user message of this prompt. */
  private extractAutoContinueTask;
  /** [autoproduct] Concatenated text blocks of an assistant message (the run's final output). */
  private extractAssistantText;
  /** [autoproduct] The synthetic "Continue." user turn fed back to self-continue the loop. */
  private buildAutoContinueMessage;
  private handlePostAgentRun;
  /**
   * Send a prompt to the agent.
   * - Handles extension commands immediately, even during streaming
   * - Expands file-based prompt templates by default
   * - During streaming, queues via steer() or followUp() based on streamingBehavior option
   * - Validates model and API key before sending (when not streaming)
   * @throws Error if streaming and no streamingBehavior specified
   * @throws Error if no model selected or no API key available (when not streaming)
   */
  prompt(text: string, options?: PromptOptions): Promise<void>;
  /**
   * Try to execute an extension command. Returns true if command was found and executed.
   */
  private tryExecuteExtensionCommand;
  /**
   * Expand skill commands (/skill:name args) to their full content.
   * Returns the expanded text, or the original text if not a skill command or skill not found.
   * Emits errors via extension runner if file read fails.
   */
  private expandSkillCommand;
  /**
   * Queue a steering message while the agent is running.
   * Delivered after the current assistant turn finishes executing its tool calls,
   * before the next LLM call.
   * Expands skill commands and prompt templates. Errors on extension commands.
   * @param images Optional image attachments to include with the message
   * @param userTurnTranscriptRecorder Prepared channel fields for transcript-only persistence
   * @throws Error if text is an extension command
   */
  steer(
    text: string,
    images?: ImageContent[],
    userTurnTranscriptRecorder?: UserTurnTranscriptRecorder,
  ): Promise<void>;
  /**
   * Queue a follow-up message to be processed after the agent finishes.
   * Delivered only when agent has no more tool calls or steering messages.
   * Expands skill commands and prompt templates. Errors on extension commands.
   * @param images Optional image attachments to include with the message
   * @throws Error if text is an extension command
   */
  followUp(text: string, images?: ImageContent[]): Promise<void>;
  /**
   * Internal: Queue a steering message (already expanded, no extension command check).
   */
  private queueSteer;
  /**
   * Internal: Queue a follow-up message (already expanded, no extension command check).
   */
  private queueFollowUp;
  /**
   * Throw an error if the text is an extension command.
   */
  private throwIfExtensionCommand;
  /**
   * Send a custom message to the session. Creates a CustomMessageEntry.
   *
   * Handles three cases:
   * - Streaming: queues message, processed when loop pulls from queue
   * - Not streaming + triggerTurn: appends to state/session, starts new turn
   * - Not streaming + no trigger: appends to state/session, no turn
   *
   * @param message Custom message with customType, content, display, details
   * @param options.triggerTurn If true and not streaming, triggers a new LLM turn
   * @param options.deliverAs Delivery mode: "steer", "followUp", or "nextTurn"
   */
  sendCustomMessage<T = unknown>(
    message: Pick<CustomMessage<T>, "customType" | "content" | "display" | "details">,
    options?: {
      triggerTurn?: boolean;
      deliverAs?: "steer" | "followUp" | "nextTurn";
    },
  ): Promise<void>;
  /**
   * Send a user message to the agent. Always triggers a turn.
   * When the agent is streaming, use deliverAs to specify how to queue the message.
   *
   * @param content User message content (string or content array)
   * @param options.deliverAs Delivery mode when streaming: "steer" or "followUp"
   */
  sendUserMessage(
    content: string | (TextContent | ImageContent)[],
    options?: {
      deliverAs?: "steer" | "followUp";
    },
  ): Promise<void>;
  /**
   * Clear all queued messages and return them.
   * Useful for restoring to editor when user aborts.
   * @returns Object with steering and followUp arrays
   */
  clearQueue(): {
    steering: string[];
    followUp: string[];
  };
  /** Number of pending messages (includes both steering and follow-up) */
  get pendingMessageCount(): number;
  /** Get pending steering messages (read-only) */
  getSteeringMessages(): readonly string[];
  /** Get pending follow-up messages (read-only) */
  getFollowUpMessages(): readonly string[];
  get resourceLoader(): ResourceLoader;
  /** Abort the current run; yield callers pass a turnHandoff reason to skip interruption guidance. */
  abort(reason?: unknown): Promise<void>;
  private emitModelSelect;
  /**
   * Set model directly.
   * Validates that auth is configured, saves to session and settings.
   * @throws Error if no auth is configured for the model
   */
  setModel(model: Model): Promise<void>;
  /**
   * Cycle to next/previous model.
   * Uses scoped models (from --models flag) if available, otherwise all available models.
   * @param direction - "forward" (default) or "backward"
   * @returns The new model info, or undefined if only one model available
   */
  cycleModel(direction?: "forward" | "backward"): Promise<ModelCycleResult | undefined>;
  private cycleScopedModel;
  private cycleAvailableModel;
  /**
   * Set thinking level.
   * Clamps to model capabilities based on available thinking levels.
   * Saves to session and settings only if the level actually changes.
   */
  setThinkingLevel(level: ThinkingLevel): void;
  /**
   * Cycle to next thinking level.
   * @returns New level, or undefined if model doesn't support thinking
   */
  cycleThinkingLevel(): ThinkingLevel | undefined;
  /**
   * Get available thinking levels for current model.
   * The provider will clamp to what the specific model supports internally.
   */
  getAvailableThinkingLevels(): ThinkingLevel[];
  /**
   * Check if current model supports thinking/reasoning.
   */
  supportsThinking(): boolean;
  private getThinkingLevelForModelSwitch;
  private clampThinkingLevel;
  /**
   * Set steering message mode.
   * Saves to settings.
   */
  setSteeringMode(mode: "all" | "one-at-a-time"): void;
  /**
   * Set follow-up message mode.
   * Saves to settings.
   */
  setFollowUpMode(mode: "all" | "one-at-a-time"): void;
  /**
   * Manually compact the session context.
   * Aborts current agent operation first.
   * @param customInstructions Optional instructions for the compaction summary
   */
  compact(customInstructions?: string): Promise<CompactionResult>;
  private compactWithSessionWriteLock;
  /**
   * Cancel in-progress compaction (manual or auto).
   */
  abortCompaction(): void;
  /**
   * Cancel in-progress branch summarization.
   */
  abortBranchSummary(): void;
  private getAutoCompactionRequestAuth;
  private runCompactionWork;
  /**
   * Check if compaction is needed and run it.
   * Called after agent_end and before prompt submission.
   *
   * Two cases:
   * 1. Overflow: LLM returned context overflow error, remove error message from agent state, compact, auto-retry
   * 2. Threshold: Context over threshold, compact, NO auto-retry (user continues manually)
   *
   * @param assistantMessage The assistant message to check
   * @param skipAbortedCheck If false, include aborted messages (for pre-prompt check). Default: true
   */
  private checkCompaction;
  /**
   * Internal: Run auto-compaction with events.
   */
  private runAutoCompaction;
  /**
   * Toggle auto-compaction setting.
   */
  setAutoCompactionEnabled(enabled: boolean): void;
  /** Whether auto-compaction is enabled */
  get autoCompactionEnabled(): boolean;
  bindExtensions(bindings: ExtensionBindings): Promise<void>;
  private extendResourcesFromExtensions;
  private buildExtensionResourcePaths;
  private getExtensionSourceLabel;
  private applyExtensionBindings;
  private refreshCurrentModelFromRegistry;
  private bindExtensionCore;
  private refreshToolRegistry;
  private buildRuntime;
  reload(): Promise<void>;
  /**
   * Check if an error is retryable (overloaded, rate limit, server errors).
   * Context overflow errors are NOT retryable (handled by compaction instead).
   */
  private isRetryableError;
  /**
   * Prepare a retryable error for continuation with exponential backoff.
   * @returns true if the caller should continue the agent, false otherwise
   */
  private prepareRetry;
  /**
   * Cancel in-progress retry.
   */
  abortRetry(): void;
  /** Whether auto-retry is currently in progress */
  get isRetrying(): boolean;
  /** Whether auto-retry is enabled */
  get autoRetryEnabled(): boolean;
  /**
   * Toggle auto-retry setting.
   */
  setAutoRetryEnabled(enabled: boolean): void;
  /**
   * Execute a bash command.
   * Adds result to agent context and session.
   * @param command The bash command to execute
   * @param onChunk Optional streaming callback for output
   * @param options.excludeFromContext If true, command output won't be sent to LLM (!! prefix)
   * @param options.operations Custom BashOperations for remote execution
   */
  executeBash(
    command: string,
    onChunk?: (chunk: string) => void,
    options?: {
      excludeFromContext?: boolean;
      operations?: BashOperations;
    },
  ): Promise<BashResult>;
  /**
   * Record a bash execution result in session history.
   * Used by executeBash and by extensions that handle bash execution themselves.
   */
  recordBashResult(
    command: string,
    result: BashResult,
    options?: {
      excludeFromContext?: boolean;
    },
  ): void;
  /**
   * Cancel running bash command.
   */
  abortBash(): void;
  /** Whether a bash command is currently running */
  get isBashRunning(): boolean;
  /** Whether there are pending bash messages waiting to be flushed */
  get hasPendingBashMessages(): boolean;
  /**
   * Flush pending bash messages to agent state and session.
   * Called after agent turn completes to maintain proper message ordering.
   */
  private flushPendingBashMessages;
  /**
   * Set a display name for the current session.
   */
  setSessionName(name: string): void;
  /**
   * Navigate to a different node in the session tree.
   * Unlike fork() which creates a new session file, this stays in the same file.
   *
   * @param targetId The entry ID to navigate to
   * @param options.summarize Whether user wants to summarize abandoned branch
   * @param options.customInstructions Custom instructions for summarizer
   * @param options.replaceInstructions If true, customInstructions replaces the default prompt
   * @param options.label Label to attach to the branch summary entry
   * @returns Result with editorText (if user message) and cancelled status
   */
  navigateTree(
    targetId: string,
    options?: {
      summarize?: boolean;
      customInstructions?: string;
      replaceInstructions?: boolean;
      label?: string;
    },
  ): Promise<{
    editorText?: string;
    cancelled: boolean;
    aborted?: boolean;
    summaryEntry?: BranchSummaryEntry;
  }>;
  /**
   * Get all user messages from session for fork selector.
   */
  getUserMessagesForForking(): Array<{
    entryId: string;
    text: string;
  }>;
  private extractUserMessageText;
  /**
   * Get session statistics.
   */
  getSessionStats(): SessionStats;
  getContextUsage(): ContextUsage | undefined;
  /**
   * @deprecated Use the OpenClaw session export command instead.
   * @param outputPath Optional output path (defaults to session directory)
   * @returns Path to exported file
   */
  exportToHtml(_outputPath?: string): Promise<string>;
  /**
   * Export the current session branch to a JSONL file.
   * Writes the session header followed by all entries on the current branch path.
   * @param outputPath Target file path. If omitted, generates a timestamped file in cwd.
   * @returns The resolved output file path.
   */
  exportToJsonl(outputPath?: string): string;
  /**
   * Get text content of last assistant message.
   * Useful for /copy command.
   * @returns Text content, or undefined if no assistant message exists
   */
  getLastAssistantText(): string | undefined;
  createReplacedSessionContext(): ReplacedSessionContext;
  /**
   * Check if extensions have handlers for a specific event type.
   */
  hasExtensionHandlers(eventType: string): boolean;
  /**
   * Get the extension runner (for setting UI context and error handlers).
   */
  get extensionRunner(): ExtensionRunner;
}
//#endregion
//#region src/agents/sessions/tools/bash.d.ts
declare const bashSchema: Type.TObject<{
  command: Type.TString;
  timeout: Type.TOptional<Type.TNumber>;
}>;
/**
 * Create bash operations using OpenClaw runtime's built-in local shell execution backend.
 *
 * This is useful for extensions that intercept user_bash and still want OpenClaw runtime's
 * standard local shell behavior while wrapping or rewriting commands.
 */
declare function createLocalBashOperations(options?: { shellPath?: string }): BashOperations;
interface BashSpawnContext {
  command: string;
  cwd: string;
  env: NodeJS.ProcessEnv;
}
type BashSpawnHook = (context: BashSpawnContext) => BashSpawnContext;
interface BashToolOptions {
  /** Custom operations for command execution. Default: local shell */
  operations?: BashOperations;
  /** Command prefix prepended to every command (for example shell setup commands) */
  commandPrefix?: string;
  /** Optional explicit shell path from settings */
  shellPath?: string;
  /** Hook to adjust command, cwd, or env before execution */
  spawnHook?: BashSpawnHook;
}
type BashRenderState = {
  startedAt: number | undefined;
  endedAt: number | undefined;
  interval: NodeJS.Timeout | undefined;
};
declare function createBashToolDefinition(
  cwd: string,
  options?: BashToolOptions,
): ToolDefinition<typeof bashSchema, BashToolDetails | undefined, BashRenderState>;
declare function createBashTool(
  cwd: string,
  options?: BashToolOptions,
): AgentTool<typeof bashSchema>;
//#endregion
//#region src/agents/sessions/tools/edit.d.ts
type EditPreview = EditDiffResult | EditDiffError;
type EditRenderState = {
  callComponent?: EditCallRenderComponent;
};
declare const editSchema: Type.TObject<{
  path: Type.TString;
  edits: Type.TArray<
    Type.TObject<{
      oldText: Type.TString;
      newText: Type.TString;
    }>
  >;
}>;
/**
 * Pluggable operations for the edit tool.
 * Override these to delegate file editing to remote systems (for example SSH).
 */
interface EditOperations {
  /** Read file contents as a Buffer */
  readFile: (absolutePath: string) => Promise<Buffer>;
  /** Write content to a file */
  writeFile: (absolutePath: string, content: string) => Promise<void>;
  /** Check if file is readable and writable (throw if not) */
  access: (absolutePath: string) => Promise<void>;
}
interface EditToolOptions {
  /** Custom operations for file editing. Default: local filesystem */
  operations?: EditOperations;
}
type EditCallRenderComponent = Box & {
  preview?: EditPreview;
  previewArgsKey?: string;
  previewPending?: boolean;
  settledError?: boolean;
};
declare function createEditToolDefinition(
  cwd: string,
  options?: EditToolOptions,
): ToolDefinition<typeof editSchema, EditToolDetails | undefined, EditRenderState>;
declare function createEditTool(
  cwd: string,
  options?: EditToolOptions,
): AgentTool<typeof editSchema>;
//#endregion
//#region src/agents/sessions/tools/file-mutation-queue.d.ts
/**
 * Serialize file mutation operations targeting the same file.
 * Operations for different files still run in parallel.
 */
declare function withFileMutationQueue<T>(filePath: string, fn: () => Promise<T>): Promise<T>;
//#endregion
//#region src/agents/sessions/tools/find.d.ts
declare const findSchema: Type.TObject<{
  pattern: Type.TString;
  path: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TNumber>;
}>;
/**
 * Pluggable operations for the find tool.
 * Override these to delegate file search to remote systems (for example SSH).
 */
interface FindOperations {
  /** Check if path exists */
  exists: (absolutePath: string) => Promise<boolean> | boolean;
  /** Find files matching glob pattern. Returns relative or absolute paths. */
  glob: (
    pattern: string,
    cwd: string,
    options: {
      ignore: string[];
      limit: number;
    },
  ) => Promise<string[]> | string[];
}
interface FindToolOptions {
  /** Custom operations for find. Default: local filesystem plus fd */
  operations?: FindOperations;
}
declare function createFindToolDefinition(
  cwd: string,
  options?: FindToolOptions,
): ToolDefinition<typeof findSchema, FindToolDetails | undefined>;
declare function createFindTool(
  cwd: string,
  options?: FindToolOptions,
): AgentTool<typeof findSchema>;
//#endregion
//#region src/agents/sessions/tools/grep.d.ts
declare const grepSchema: Type.TObject<{
  pattern: Type.TString;
  path: Type.TOptional<Type.TString>;
  glob: Type.TOptional<Type.TString>;
  ignoreCase: Type.TOptional<Type.TBoolean>;
  literal: Type.TOptional<Type.TBoolean>;
  context: Type.TOptional<Type.TNumber>;
  limit: Type.TOptional<Type.TNumber>;
}>;
/**
 * Pluggable operations for the grep tool.
 * Override these to delegate search to remote systems (for example SSH).
 */
interface GrepOperations {
  /** Check if path is a directory. Throws if path does not exist. */
  isDirectory: (absolutePath: string) => Promise<boolean> | boolean;
  /** Read file contents for context lines */
  readFile: (absolutePath: string) => Promise<string> | string;
}
interface GrepToolOptions {
  /** Custom operations for grep. Default: local filesystem plus ripgrep */
  operations?: GrepOperations;
}
declare function createGrepToolDefinition(
  cwd: string,
  options?: GrepToolOptions,
): ToolDefinition<typeof grepSchema, GrepToolDetails | undefined>;
declare function createGrepTool(
  cwd: string,
  options?: GrepToolOptions,
): AgentTool<typeof grepSchema>;
//#endregion
//#region src/agents/sessions/tools/ls.d.ts
declare const lsSchema: Type.TObject<{
  path: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TNumber>;
}>;
/**
 * Pluggable operations for the ls tool.
 * Override these to delegate directory listing to remote systems (for example SSH).
 */
interface LsOperations {
  /** Check if path exists */
  exists: (absolutePath: string) => Promise<boolean> | boolean;
  /** Get file or directory stats. Throws if not found. */
  stat: (absolutePath: string) =>
    | Promise<{
        isDirectory: () => boolean;
      }>
    | {
        isDirectory: () => boolean;
      };
  /** Read directory entries */
  readdir: (absolutePath: string) => Promise<string[]> | string[];
}
interface LsToolOptions {
  /** Custom operations for directory listing. Default: local filesystem */
  operations?: LsOperations;
}
declare function createLsToolDefinition(
  cwd: string,
  options?: LsToolOptions,
): ToolDefinition<typeof lsSchema, LsToolDetails | undefined>;
declare function createLsTool(cwd: string, options?: LsToolOptions): AgentTool<typeof lsSchema>;
//#endregion
//#region src/agents/sessions/tools/read.d.ts
declare const readSchema: Type.TObject<{
  path: Type.TString;
  offset: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TNumber>;
}>;
/**
 * Pluggable operations for the read tool.
 * Override these to delegate file reading to remote systems (for example SSH).
 */
interface ReadOperations {
  /** Resolve a user-supplied path for this read backend. */
  resolvePath?: (filePath: string, cwd: string) => string | Promise<string>;
  /** Decode text bytes for this backend. Custom backends default to UTF-8. */
  decodeText?: (params: { buffer: Buffer; absolutePath: string }) => string;
  /** Read file contents as a Buffer */
  readFile: (absolutePath: string) => Promise<Buffer>;
  /** Check if file is readable (throw if not) */
  access: (absolutePath: string) => Promise<void>;
  /** Detect image MIME type, return null or undefined for non-images */
  detectImageMimeType?: (absolutePath: string) => Promise<string | null | undefined>;
}
interface ReadToolOptions {
  /** Whether to auto-resize images to 2000x2000 max. Default: true */
  autoResizeImages?: boolean;
  /** Custom operations for file reading. Default: local filesystem */
  operations?: ReadOperations;
}
declare function createReadToolDefinition(
  cwd: string,
  options?: ReadToolOptions,
): ToolDefinition<typeof readSchema, ReadToolDetails | undefined>;
declare function createReadTool(
  cwd: string,
  options?: ReadToolOptions,
): AgentTool<typeof readSchema>;
//#endregion
//#region src/agents/sessions/tools/write.d.ts
declare const writeSchema: Type.TObject<{
  path: Type.TString;
  content: Type.TString;
}>;
/**
 * Pluggable operations for the write tool.
 * Override these to delegate file writing to remote systems (for example SSH).
 */
interface WriteOperations {
  /** Write content to a file */
  writeFile: (absolutePath: string, content: string) => Promise<void>;
  /** Create directory recursively */
  mkdir: (dir: string) => Promise<void>;
  /** Optional readback used to recover when a write succeeded but the tool aborted before returning */
  readFile?: (absolutePath: string) => Promise<Buffer | string>;
  /** Optional stat used to avoid reporting success for files that already matched before execution */
  statFile?: (absolutePath: string) => Promise<WriteToolFileStat | null>;
}
interface WriteToolOptions {
  /** Custom operations for file writing. Default: local filesystem */
  operations?: WriteOperations;
}
type WriteToolFileStat = {
  type: "file" | "directory" | "other";
  size: number;
  mtimeMs?: number;
};
declare function createWriteToolDefinition(
  cwd: string,
  options?: WriteToolOptions,
): ToolDefinition<typeof writeSchema, undefined>;
declare function createWriteTool(
  cwd: string,
  options?: WriteToolOptions,
): AgentTool<typeof writeSchema>;
//#endregion
//#region src/agents/sessions/tools/index.d.ts
/**
 * Public factory barrel for the built-in coding and read-only session tools.
 *
 * Keep grouped creators here so callers can request stable tool sets without importing each
 * individual implementation module.
 */
type Tool = AgentTool;
type ToolDef = ToolDefinition;
type ToolName = "read" | "bash" | "edit" | "write" | "grep" | "find" | "ls";
declare const allToolNames: Set<ToolName>;
interface ToolsOptions {
  read?: ReadToolOptions;
  bash?: BashToolOptions;
  write?: WriteToolOptions;
  edit?: EditToolOptions;
  grep?: GrepToolOptions;
  find?: FindToolOptions;
  ls?: LsToolOptions;
}
/** Creates one tool definition by stable built-in tool name. */
declare function createToolDefinition(
  toolName: ToolName,
  cwd: string,
  options?: ToolsOptions,
): ToolDef;
/** Creates one executable built-in tool by stable tool name. */
declare function createTool(toolName: ToolName, cwd: string, options?: ToolsOptions): Tool;
/** Creates the mutable coding tool definitions used by agent coding sessions. */
declare function createCodingToolDefinitions(cwd: string, options?: ToolsOptions): ToolDef[];
/** Creates read-only discovery tool definitions for restricted sessions. */
declare function createReadOnlyToolDefinitions(cwd: string, options?: ToolsOptions): ToolDef[];
/** Creates all built-in tool definitions keyed by tool name. */
declare function createAllToolDefinitions(
  cwd: string,
  options?: ToolsOptions,
): Record<ToolName, ToolDef>;
/** Creates the mutable coding tools used by local agent sessions. */
declare function createCodingTools(cwd: string, options?: ToolsOptions): Tool[];
/** Creates read-only discovery tools for restricted sessions. */
declare function createReadOnlyTools(cwd: string, options?: ToolsOptions): Tool[];
/** Creates all built-in tools keyed by tool name. */
declare function createAllTools(cwd: string, options?: ToolsOptions): Record<ToolName, Tool>;
//#endregion
//#region src/agents/sessions/sdk.d.ts
interface CreateAgentSessionOptions {
  /** Working directory for project-local discovery. Default: process.cwd() */
  cwd?: string;
  /** Global config directory. Default: ~/.openclaw/agents/default */
  agentDir?: string;
  /** Auth storage for credentials. Default: AuthStorage.create(agentDir/auth.json) */
  authStorage?: AuthStorage;
  /** Model registry. Default: ModelRegistry.create(authStorage, agentDir/models.json) */
  modelRegistry?: ModelRegistry;
  /** Model to use. Default: from settings, else first available */
  model?: Model;
  /** Thinking level. Default: from settings, else 'medium' (clamped to model capabilities) */
  thinkingLevel?: ThinkingLevel;
  /** Models available for cycling (Ctrl+P in interactive mode) */
  scopedModels?: Array<{
    model: Model;
    thinkingLevel?: ThinkingLevel;
  }>;
  /**
   * Optional default tool suppression mode when no explicit allowlist is provided.
   *
   * - "all": start with no tools enabled
   * - "builtin": disable the default built-in tools (read, bash, edit, write)
   *   but keep extension/custom tools enabled
   */
  noTools?: "all" | "builtin";
  /**
   * Optional allowlist of tool names.
   *
   * When omitted, OpenClaw enables the default built-in tools (read, bash, edit, write)
   * and leaves extension/custom tools enabled unless `noTools` changes that default.
   * When provided, only the listed tool names are enabled.
   */
  tools?: string[];
  /** Custom tools to register (in addition to built-in tools). */
  customTools?: ToolDefinition[];
  /** Hydrate an authorized tool deferred out of the current provider-visible tool set. */
  resolveDeferredTool?: AgentOptions["resolveDeferredTool"];
  /** Resource loader. When omitted, DefaultResourceLoader is used. */
  resourceLoader?: ResourceLoader;
  /** Session manager. Default: SessionManager.create(cwd) */
  sessionManager?: SessionManager;
  /** Settings manager. Default: SettingsManager.create(cwd, agentDir) */
  settingsManager?: SettingsManager;
  /** Session start event metadata for extension runtime startup. */
  sessionStartEvent?: SessionStartEvent;
  /** Optional lock used before session-file writes or write-capable extension hooks. */
  withSessionWriteLock?: AgentSessionWriteLockRunner;
}
/** Result from createAgentSession */
interface CreateAgentSessionResult {
  /** The created session */
  session: AgentSession;
  /** Extensions result (for UI context setup in interactive mode) */
  extensionsResult: LoadExtensionsResult;
  /** Warning if session was restored with a different model than saved */
  modelFallbackMessage?: string;
}
/**
 * Create an AgentSession with the specified options.
 *
 * @example
 * ```typescript
 * // Minimal - uses defaults
 * const { session } = await createAgentSession();
 *
 * // With explicit model from the configured registry
 * const model = ModelRegistry.create(AuthStorage.load()).find('anthropic', 'claude-opus-4-5');
 * const { session } = await createAgentSession({
 *   model,
 *   thinkingLevel: 'high',
 * });
 *
 * // Continue previous session
 * const { session, modelFallbackMessage } = await createAgentSession({
 *   continueSession: true,
 * });
 *
 * // Full control
 * const loader = new DefaultResourceLoader({
 *   cwd: process.cwd(),
 *   agentDir: getAgentDir(),
 *   settingsManager: SettingsManager.create(),
 * });
 * await loader.reload();
 * const { session } = await createAgentSession({
 *   model: myModel,
 *   tools: ["read", "bash"],
 *   resourceLoader: loader,
 *   sessionManager: SessionManager.inMemory(),
 * });
 * ```
 */
declare function createAgentSession(
  options?: CreateAgentSessionOptions,
): Promise<CreateAgentSessionResult>;
//#endregion
//#region src/agents/sessions/agent-session-services.d.ts
/**
 * Non-fatal issues collected while creating services or sessions.
 *
 * Runtime creation returns diagnostics to the caller instead of printing or
 * exiting. The app layer decides whether warnings should be shown and whether
 * errors should abort startup.
 */
interface AgentSessionRuntimeDiagnostic {
  type: "info" | "warning" | "error";
  message: string;
}
/**
 * Inputs for creating cwd-bound runtime services.
 *
 * These services are recreated whenever the effective session cwd changes.
 * CLI-provided resource paths should be resolved to absolute paths before they
 * reach this function, so later cwd switches do not reinterpret them.
 */
interface CreateAgentSessionServicesOptions {
  cwd: string;
  agentDir?: string;
  authStorage?: AuthStorage;
  settingsManager?: SettingsManager;
  modelRegistry?: ModelRegistry;
  extensionFlagValues?: Map<string, boolean | string>;
  resourceLoaderOptions?: Omit<
    DefaultResourceLoaderOptions,
    "cwd" | "agentDir" | "settingsManager"
  >;
}
/**
 * Inputs for creating an AgentSession from already-created services.
 *
 * Use this after services exist and any cwd-bound model/tool/session options
 * have been resolved against those services.
 */
interface CreateAgentSessionFromServicesOptions {
  services: AgentSessionServices;
  sessionManager: SessionManager;
  sessionStartEvent?: SessionStartEvent;
  model?: Model;
  thinkingLevel?: ThinkingLevel;
  scopedModels?: Array<{
    model: Model;
    thinkingLevel?: ThinkingLevel;
  }>;
  tools?: string[];
  noTools?: CreateAgentSessionOptions["noTools"];
  customTools?: ToolDefinition[];
}
/**
 * Coherent cwd-bound runtime services for one effective session cwd.
 *
 * This is infrastructure only. The AgentSession itself is created separately so
 * session options can be resolved against these services first.
 */
interface AgentSessionServices {
  cwd: string;
  agentDir: string;
  authStorage: AuthStorage;
  settingsManager: SettingsManager;
  modelRegistry: ModelRegistry;
  resourceLoader: ResourceLoader;
  diagnostics: AgentSessionRuntimeDiagnostic[];
}
/**
 * Create cwd-bound runtime services.
 *
 * Returns services plus diagnostics. It does not create an AgentSession.
 */
declare function createAgentSessionServices(
  options: CreateAgentSessionServicesOptions,
): Promise<AgentSessionServices>;
/**
 * Create an AgentSession from previously created services.
 *
 * This keeps session creation separate from service creation so callers can
 * resolve model, thinking, tools, and other session inputs against the target
 * cwd before constructing the session.
 */
declare function createAgentSessionFromServices(
  options: CreateAgentSessionFromServicesOptions,
): Promise<CreateAgentSessionResult>;
//#endregion
//#region src/agents/sessions/agent-session-runtime.d.ts
/**
 * Result returned by runtime creation.
 *
 * The caller gets the created session, its cwd-bound services, and all
 * diagnostics collected during setup.
 */
interface CreateAgentSessionRuntimeResult extends CreateAgentSessionResult {
  services: AgentSessionServices;
  diagnostics: AgentSessionRuntimeDiagnostic[];
}
/**
 * Creates a full runtime for a target cwd and session manager.
 *
 * The factory closes over process-global fixed inputs, recreates cwd-bound
 * services for the effective cwd, resolves session options against those
 * services, and finally creates the AgentSession.
 */
type CreateAgentSessionRuntimeFactory = (options: {
  cwd: string;
  agentDir: string;
  sessionManager: SessionManager;
  sessionStartEvent?: SessionStartEvent;
}) => Promise<CreateAgentSessionRuntimeResult>;
/**
 * Thrown when /import references a JSONL file path that does not exist.
 */
declare class SessionImportFileNotFoundError extends Error {
  readonly filePath: string;
  constructor(filePath: string);
}
/**
 * Owns the current AgentSession plus its cwd-bound services.
 *
 * Session replacement methods tear down the current runtime first, then create
 * and apply the next runtime. If creation fails, the error is propagated to the
 * caller. The caller is responsible for user-facing error handling.
 */
declare class AgentSessionRuntime {
  private rebindSession?;
  private beforeSessionInvalidate?;
  private currentSession;
  private runtimeServices;
  private readonly createRuntime;
  private runtimeDiagnostics;
  private fallbackMessage?;
  constructor(
    session: AgentSession,
    services: AgentSessionServices,
    createRuntime: CreateAgentSessionRuntimeFactory,
    diagnostics?: AgentSessionRuntimeDiagnostic[],
    modelFallbackMessage?: string,
  );
  get services(): AgentSessionServices;
  get session(): AgentSession;
  get cwd(): string;
  get diagnostics(): readonly AgentSessionRuntimeDiagnostic[];
  get modelFallbackMessage(): string | undefined;
  setRebindSession(rebindSession?: (session: AgentSession) => Promise<void>): void;
  /**
   * Set a synchronous callback that runs after `session_shutdown` handlers finish
   * but before the current session is invalidated.
   *
   * This is for host-owned UI teardown that must not yield to the event loop,
   * such as detaching extension-provided TUI components before the old extension
   * context becomes stale.
   */
  setBeforeSessionInvalidate(beforeSessionInvalidate?: () => void): void;
  private emitBeforeSwitch;
  private emitBeforeFork;
  private teardownCurrent;
  private apply;
  private finishSessionReplacement;
  switchSession(
    sessionPath: string,
    options?: {
      cwdOverride?: string;
      withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
    },
  ): Promise<{
    cancelled: boolean;
  }>;
  newSession(options?: {
    parentSession?: string;
    setup?: (sessionManager: SessionManager) => Promise<void>;
    withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
  }): Promise<{
    cancelled: boolean;
  }>;
  fork(
    entryId: string,
    options?: {
      position?: "before" | "at";
      withSession?: (ctx: ReplacedSessionContext) => Promise<void>;
    },
  ): Promise<{
    cancelled: boolean;
    selectedText?: string;
  }>;
  /**
   * Import a session JSONL file and switch runtime state to the imported session.
   *
   * @returns `{ cancelled: true }` when cancelled by `session_before_switch`, otherwise `{ cancelled: false }`.
   * @throws {SessionImportFileNotFoundError} When the input path does not exist.
   * @throws {MissingSessionCwdError} When the imported session cwd cannot be resolved and no override is provided.
   */
  importFromJsonl(
    inputPath: string,
    cwdOverride?: string,
  ): Promise<{
    cancelled: boolean;
  }>;
  dispose(): Promise<void>;
}
/**
 * Create the initial runtime from a runtime factory and initial session target.
 *
 * The same factory is stored on the returned AgentSessionRuntime and reused for
 * later /new, /resume, /fork, and import flows.
 */
declare function createAgentSessionRuntime(
  createRuntime: CreateAgentSessionRuntimeFactory,
  options: {
    cwd: string;
    agentDir: string;
    sessionManager: SessionManager;
    sessionStartEvent?: SessionStartEvent;
  },
): Promise<AgentSessionRuntime>;
//#endregion
//#region src/agents/sessions/model-resolver.d.ts
interface ScopedModel {
  model: Model;
  /** Thinking level if explicitly specified in pattern (e.g., "model:high"), undefined otherwise */
  thinkingLevel?: ThinkingLevel;
}
/**
 * Find an exact model reference match.
 * Supports either a bare model id or a canonical provider/modelId reference.
 * When matching by bare id, ambiguous matches across providers are rejected.
 */
declare function findExactModelReferenceMatch(
  modelReference: string,
  availableModels: Model[],
): Model | undefined;
interface ParsedModelResult {
  model: Model | undefined;
  /** Thinking level if explicitly specified in pattern, undefined otherwise */
  thinkingLevel?: ThinkingLevel;
  warning: string | undefined;
}
/**
 * Parse a pattern to extract model and thinking level.
 * Handles models with colons in their IDs (e.g., OpenRouter's :exacto suffix).
 *
 * Algorithm:
 * 1. Try to match full pattern as a model
 * 2. If found, return it with "off" thinking level
 * 3. If not found and has colons, split on last colon:
 *    - If suffix is valid thinking level, use it and recurse on prefix
 *    - If suffix is invalid, warn and recurse on prefix with "off"
 *
 * @internal Exported for testing
 */
declare function parseModelPattern(
  pattern: string,
  availableModels: Model[],
  options?: {
    allowInvalidThinkingLevelFallback?: boolean;
  },
): ParsedModelResult;
/**
 * Resolve model patterns to actual Model objects with optional thinking levels
 * Format: "pattern:level" where :level is optional
 * For each pattern, finds all matching models and picks the best version:
 * 1. Prefer alias (e.g., claude-sonnet-4-5) over dated versions (claude-sonnet-4-5-20250929)
 * 2. If no alias, pick the latest dated version
 *
 * Supports models with colons in their IDs (e.g., OpenRouter's model:exacto).
 * The algorithm tries to match the full pattern first, then progressively
 * strips colon-suffixes to find a match.
 */
declare function resolveModelScope(
  patterns: string[],
  modelRegistry: ModelRegistry,
): Promise<ScopedModel[]>;
interface ResolveCliModelResult {
  model: Model | undefined;
  thinkingLevel?: ThinkingLevel;
  warning: string | undefined;
  /**
   * Error message suitable for CLI display.
   * When set, model will be undefined.
   */
  error: string | undefined;
}
/**
 * Resolve a single model from CLI flags.
 *
 * Supports:
 * - --provider <provider> --model <pattern>
 * - --model <provider>/<pattern>
 * - Fuzzy matching (same rules as model scoping: exact id, then partial id/name)
 *
 * Note: This does not apply the thinking level by itself, but it may *parse* and
 * return a thinking level from "<pattern>:<thinking>" so the caller can apply it.
 */
declare function resolveCliModel(options: {
  cliProvider?: string;
  cliModel?: string;
  modelRegistry: ModelRegistry;
}): ResolveCliModelResult;
interface InitialModelResult {
  model: Model | undefined;
  thinkingLevel: ThinkingLevel;
  fallbackMessage: string | undefined;
}
/**
 * Find the initial model to use based on priority:
 * 1. CLI args (provider + model)
 * 2. First model from scoped models (if not continuing/resuming)
 * 3. Restored from session (if continuing/resuming)
 * 4. Saved default from settings
 * 5. First available model with valid API key
 */
declare function findInitialModel(options: {
  cliProvider?: string;
  cliModel?: string;
  scopedModels: ScopedModel[];
  isContinuing: boolean;
  defaultProvider?: string;
  defaultModelId?: string;
  defaultThinkingLevel?: ThinkingLevel;
  modelRegistry: ModelRegistry;
}): Promise<InitialModelResult>;
/**
 * Restore model from session, with fallback to available models
 */
declare function restoreModelFromSession(
  savedProvider: string,
  savedModelId: string,
  currentModel: Model | undefined,
  shouldPrintMessages: boolean,
  modelRegistry: ModelRegistry,
): Promise<{
  model: Model | undefined;
  fallbackMessage: string | undefined;
}>;
//#endregion
export {
  createGrepToolDefinition as $,
  SlashCommandInfo as $i,
  RegisteredCommand as $n,
  BashToolDetails as $r,
  BeforeAgentStartEventResult as $t,
  createAllToolDefinitions as A,
  AuthStorage as Ai,
  GetActiveToolsHandler as An,
  ToolExecutionUpdateEvent as Ar,
  loadProjectContextFiles as At,
  createWriteTool as B,
  ExecOptions as Bi,
  LsToolCallEvent as Bn,
  WidgetPlacement as Br,
  SwitchSessionHandler as Bt,
  CreateAgentSessionResult as C,
  ModelRegistry as Ci,
  ExtensionRuntime as Cn,
  SetThinkingLevelHandler as Cr,
  PromptOptions as Ct,
  ToolName as D,
  ApiKeyCredential as Di,
  ExtensionWidgetOptions as Dn,
  ToolDefinition as Dr,
  DefaultResourceLoaderOptions as Dt,
  ToolDef as E,
  clearApiKeyCache as Ei,
  ExtensionUIDialogOptions as En,
  ToolCallEventResult as Er,
  DefaultResourceLoader as Et,
  createReadOnlyTools as F,
  OAuthCredential as Fi,
  GrepToolResultEvent as Fn,
  TreePreparation as Fr,
  ExtensionRunner as Ft,
  createReadToolDefinition as G,
  BranchSummaryResult as Gi,
  MessageStartEvent as Gn,
  isBashToolResult as Gr,
  AfterProviderResponseEvent as Gt,
  ReadOperations as H,
  compact as Hi,
  MessageEndEvent as Hn,
  WriteToolCallEvent as Hr,
  discoverAndLoadExtensions as Ht,
  createTool as I,
  PluginModelCatalogMetadataSnapshot as Ii,
  InputEvent as In,
  TurnEndEvent as Ir,
  ForkHandler as It,
  createLsTool as J,
  collectEntriesForBranchSummary as Ji,
  ModelSelectSource as Jn,
  isGrepToolResult as Jr,
  AppendEntryHandler as Jt,
  LsOperations as K,
  CollectEntriesResult as Ki,
  MessageUpdateEvent as Kn,
  isEditToolResult as Kr,
  AgentEndEvent as Kt,
  createToolDefinition as L,
  AppKeybinding as Li,
  InputEventResult as Ln,
  TurnStartEvent as Lr,
  NavigateTreeHandler as Lt,
  createCodingToolDefinitions as M,
  AuthStorageData as Mi,
  GetCommandsHandler as Mn,
  ToolRenderResultOptions as Mr,
  wrapRegisteredTool as Mt,
  createCodingTools as N,
  FileAuthStorageBackend as Ni,
  GetThinkingLevelHandler as Nn,
  ToolResultEvent as Nr,
  wrapRegisteredTools as Nt,
  ToolsOptions as O,
  AuthCredential as Oi,
  FindToolCallEvent as On,
  ToolExecutionEndEvent as Or,
  ResourceExtensionPaths as Ot,
  createReadOnlyToolDefinitions as P,
  InMemoryAuthStorageBackend as Pi,
  GrepToolCallEvent as Pn,
  ToolResultEventResult as Pr,
  ExtensionErrorListener as Pt,
  createGrepTool as Q,
  createEventBus as Qi,
  ReadToolResultEvent as Qn,
  isWriteToolResult as Qr,
  BeforeAgentStartEvent as Qt,
  WriteOperations as R,
  KeybindingsManager$1 as Ri,
  InputSource as Rn,
  UserBashEvent as Rr,
  NewSessionHandler as Rt,
  CreateAgentSessionOptions as S,
  ResourceDiagnostic as Si,
  ExtensionHandler as Sn,
  SetModelHandler as Sr,
  ParsedSkillBlock as St,
  Tool as T,
  ResolvedRequestAuth as Ti,
  ExtensionUIContext as Tn,
  ToolCallEvent as Tr,
  parseSkillBlock as Tt,
  ReadToolOptions as U,
  generateSummary as Ui,
  MessageRenderOptions as Un,
  WriteToolResultEvent as Ur,
  loadExtensionFromFactory as Ut,
  createWriteToolDefinition as V,
  ExecResult as Vi,
  LsToolResultEvent as Vn,
  WorkingIndicatorOptions as Vr,
  createExtensionRuntime as Vt,
  createReadTool as W,
  prepareCompaction as Wi,
  MessageRenderer as Wn,
  defineTool as Wr,
  loadExtensions as Wt,
  GrepOperations as X,
  EventBus as Xi,
  ProviderModelConfig as Xn,
  isReadToolResult as Xr,
  BashToolCallEvent as Xt,
  createLsToolDefinition as Y,
  generateBranchSummary as Yi,
  ProviderConfig as Yn,
  isLsToolResult as Yr,
  AutocompleteProviderFactory as Yt,
  GrepToolOptions as Z,
  EventBusController as Zi,
  ReadToolCallEvent as Zn,
  isToolCallEventType as Zr,
  BashToolResultEvent as Zt,
  AgentSessionServices as _,
  SkillFrontmatter as _i,
  ExtensionContextActions as _n,
  SessionShutdownEvent as _r,
  AgentSessionEvent as _t,
  findExactModelReferenceMatch as a,
  VERSION as aa,
  GrepToolDetails as ai,
  ContextUsage as an,
  SendMessageHandler as ar,
  EditOperations as at,
  createAgentSessionFromServices as b,
  loadSkillsFromDir as bi,
  ExtensionFactory as bn,
  SetActiveToolsHandler as br,
  ExtensionBindings as bt,
  resolveCliModel as c,
  LsToolInput as ci,
  EditToolCallEvent as cn,
  SessionBeforeCompactResult as cr,
  createEditToolDefinition as ct,
  AgentSessionRuntime as d,
  WriteToolInput as di,
  Extension as dn,
  SessionBeforeSwitchEvent as dr,
  BashToolOptions as dt,
  SlashCommandSource as ea,
  BashToolInput as ei,
  BeforeProviderRequestEvent as en,
  RegisteredTool as er,
  FindOperations as et,
  CreateAgentSessionRuntimeFactory as f,
  BuildSystemPromptOptions as fi,
  ExtensionAPI as fn,
  SessionBeforeSwitchResult as fr,
  createBashTool as ft,
  AgentSessionRuntimeDiagnostic as g,
  Skill as gi,
  ExtensionContext as gn,
  SessionEvent as gr,
  AgentSessionConfig as gt,
  createAgentSessionRuntime as h,
  LoadSkillsResult as hi,
  ExtensionCommandContextActions as hn,
  SessionCompactEvent as hr,
  AgentSession as ht,
  ScopedModel as i,
  BashOperations as ia,
  FindToolInput as ii,
  ContextEventResult as in,
  ResourcesDiscoverResult as ir,
  withFileMutationQueue as it,
  createAllTools as j,
  AuthStorageBackend as ji,
  GetAllToolsHandler as jn,
  ToolInfo as jr,
  PromptTemplate as jt,
  allToolNames as k,
  AuthStatus as ki,
  FindToolResultEvent as kn,
  ToolExecutionStartEvent as kr,
  ResourceLoader as kt,
  resolveModelScope as l,
  ReadToolDetails as li,
  EditToolResultEvent as ln,
  SessionBeforeForkEvent as lr,
  BashSpawnContext as lt,
  SessionImportFileNotFoundError as m,
  LoadSkillsOptions as mi,
  ExtensionCommandContext as mn,
  SessionBeforeTreeResult as mr,
  createLocalBashOperations as mt,
  ParsedModelResult as n,
  BashResult as na,
  EditToolInput as ni,
  CompactOptions as nn,
  ResolvedCommand as nr,
  createFindTool as nt,
  findInitialModel as o,
  getAgentDir as oa,
  GrepToolInput as oi,
  CustomToolCallEvent as on,
  SendUserMessageHandler as or,
  EditToolOptions as ot,
  CreateAgentSessionRuntimeResult as p,
  LoadSkillsFromDirOptions as pi,
  ExtensionActions as pn,
  SessionBeforeTreeEvent as pr,
  createBashToolDefinition as pt,
  LsToolOptions as q,
  GenerateBranchSummaryOptions as qi,
  ModelSelectEvent as qn,
  isFindToolResult as qr,
  AgentStartEvent as qt,
  ResolveCliModelResult as r,
  executeBashWithOperations as ra,
  FindToolDetails as ri,
  ContextEvent as rn,
  ResourcesDiscoverEvent as rr,
  createFindToolDefinition as rt,
  parseModelPattern as s,
  LsToolDetails as si,
  CustomToolResultEvent as sn,
  SessionBeforeCompactEvent as sr,
  createEditTool as st,
  InitialModelResult as t,
  BashExecutorOptions as ta,
  EditToolDetails as ti,
  BeforeProviderRequestEventResult as tn,
  ReplacedSessionContext as tr,
  FindToolOptions as tt,
  restoreModelFromSession as u,
  ReadToolInput as ui,
  EditorFactory as un,
  SessionBeforeForkResult as ur,
  BashSpawnHook as ut,
  CreateAgentSessionFromServicesOptions as v,
  formatSkillsForPrompt as vi,
  ExtensionError as vn,
  SessionStartEvent as vr,
  AgentSessionEventListener as vt,
  createAgentSession as w,
  ProviderConfigInput as wi,
  ExtensionShortcut as wn,
  TerminalInputHandler as wr,
  SessionStats as wt,
  createAgentSessionServices as x,
  ResourceCollision as xi,
  ExtensionFlag as xn,
  SetLabelHandler as xr,
  ModelCycleResult as xt,
  CreateAgentSessionServicesOptions as y,
  loadSkills as yi,
  ExtensionEvent as yn,
  SessionTreeEvent as yr,
  AgentSessionWriteLockRunner as yt,
  WriteToolOptions as z,
  ReadonlyFooterDataProvider as zi,
  LoadExtensionsResult as zn,
  UserBashEventResult as zr,
  ShutdownHandler as zt,
};
