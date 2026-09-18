import { E as resolveAuthProfileOrder } from "./auth-profiles-BzT-kajT.js";
import { s as AuthProfileStore } from "./types-Dzb4Vh4b.js";
//#region extensions/codex/src/app-server/protocol.d.ts
type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;
type JsonObject = {
  [key: string]: JsonValue;
};
type CodexServiceTier = string;
type CodexApprovalPolicy =
  | "untrusted"
  | "on-request"
  | {
      granular: {
        sandbox_approval: boolean;
        rules: boolean;
        skill_approval: boolean;
        request_permissions: boolean;
        mcp_elicitations: boolean;
      };
    }
  | "never";
type CodexApprovalsReviewer = "user" | "auto_review" | "guardian_subagent";
type CodexSandboxMode = "read-only" | "workspace-write" | "danger-full-access";
type CodexPersonality = "none" | "friendly" | "pragmatic";
type CodexAppServerRequestMethod = keyof CodexAppServerRequestResultMap | (string & {});
type CodexAppServerRequestParams<M extends CodexAppServerRequestMethod> =
  M extends keyof CodexAppServerRequestParamsOverride
    ? CodexAppServerRequestParamsOverride[M]
    : unknown;
type CodexAppServerRequestResult<M extends CodexAppServerRequestMethod> =
  M extends keyof CodexAppServerRequestResultMap
    ? CodexAppServerRequestResultMap[M]
    : JsonValue | undefined;
type RpcRequest = {
  id?: number | string;
  method: string;
  params?: JsonValue;
};
type CodexInitializeResponse = {
  serverInfo?: {
    name?: string;
    version?: string;
  };
  protocolVersion?: string;
  userAgent?: string;
  codexHome?: string;
  platformFamily?: string;
  platformOs?: string;
};
type CodexUserInput =
  | {
      type: "text";
      text: string;
      text_elements: Array<{
        byteRange: {
          start: number;
          end: number;
        };
        placeholder: string | null;
      }>;
    }
  | {
      type: "image";
      url: string;
    }
  | {
      type: "localImage";
      path: string;
    };
type CodexDynamicToolFunctionSpec = JsonObject & {
  type: "function";
  name: string;
  description: string;
  inputSchema: JsonValue;
  deferLoading?: boolean;
};
type CodexDynamicToolNamespaceTool = CodexDynamicToolFunctionSpec;
/** Namespace Codex keeps directly model-visible without exposing it to Code Mode guests. */
type CodexDynamicToolNamespaceSpec = JsonObject & {
  type: "namespace";
  name: string;
  description: string;
  tools: CodexDynamicToolNamespaceTool[];
};
type CodexDynamicToolSpec = CodexDynamicToolFunctionSpec | CodexDynamicToolNamespaceSpec;
type CodexTurnEnvironmentParams = JsonObject & {
  environmentId: string;
  cwd: string;
};
type CodexThreadStartParams = JsonObject & {
  input?: CodexUserInput[];
  cwd?: string;
  model?: string;
  modelProvider?: string | null;
  config?: JsonObject;
  personality?: CodexPersonality | null;
  approvalPolicy?: CodexApprovalPolicy | null;
  approvalsReviewer?: CodexApprovalsReviewer | null;
  sandbox?: CodexSandboxMode | null;
  serviceTier?: CodexServiceTier | null;
  dynamicTools?: CodexDynamicToolSpec[] | null;
  developerInstructions?: string;
  experimentalRawEvents?: boolean;
  environments?: CodexTurnEnvironmentParams[] | null;
};
type CodexThreadStartResponse = {
  thread: CodexThread;
  model: string;
  modelProvider?: string | null;
};
type CodexThreadForkParams = JsonObject & {
  threadId: string;
  lastTurnId?: string | null;
  path?: string | null;
  model?: string | null;
  modelProvider?: string | null;
  serviceTier?: CodexServiceTier | null;
  cwd?: string | null;
  runtimeWorkspaceRoots?: string[] | null;
  approvalPolicy?: CodexApprovalPolicy | null;
  approvalsReviewer?: CodexApprovalsReviewer | null;
  sandbox?: CodexSandboxMode | null;
  permissions?: string | null;
  config?: JsonObject | null;
  baseInstructions?: string;
  developerInstructions?: string;
  ephemeral?: boolean;
  threadSource?: string | null;
  excludeTurns?: boolean;
};
type CodexThreadForkResponse = CodexThreadStartResponse;
declare const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS: readonly ["cli", "vscode"];
type CodexThreadSourceKind =
  | (typeof CODEX_INTERACTIVE_THREAD_SOURCE_KINDS)[number]
  | "exec"
  | "appServer"
  | "subAgent"
  | "subAgentReview"
  | "subAgentCompact"
  | "subAgentThreadSpawn"
  | "subAgentOther"
  | "unknown";
type CodexThreadListParams = JsonObject & {
  cursor?: string | null;
  limit?: number | null;
  modelProviders?: string[] | null;
  sortKey?: "created_at" | "updated_at" | "recency_at" | null;
  sortDirection?: "asc" | "desc" | null;
  archived?: boolean | null;
  cwd?: string | string[] | null;
  useStateDbOnly?: boolean;
  searchTerm?: string | null;
  sourceKinds?: CodexThreadSourceKind[] | null;
  parentThreadId?: string | null;
  ancestorThreadId?: string | null;
};
type CodexThreadListResponse = {
  data: CodexThread[];
  nextCursor?: string | null;
  backwardsCursor?: string | null;
};
type CodexThreadReadParams = JsonObject & {
  threadId: string;
  includeTurns?: boolean;
};
type CodexThreadReadResponse = {
  thread: CodexThread;
};
type CodexThreadTurnsListParams = JsonObject & {
  threadId: string;
  cursor?: string | null;
  limit?: number | null;
  sortDirection?: "asc" | "desc" | null;
  itemsView?: "notLoaded" | "summary" | "full" | null;
};
type CodexThreadTurnsListResponse = {
  data: CodexTurn[];
  nextCursor?: string | null;
  backwardsCursor?: string | null;
};
type CodexThreadSetNameParams = JsonObject & {
  threadId: string;
  name: string;
};
type CodexThreadArchiveParams = JsonObject & {
  threadId: string;
};
type CodexThreadUnarchiveResponse = {
  thread: CodexThread;
};
type CodexThreadResumeResponse = {
  thread: CodexThread;
  model: string;
  modelProvider?: string | null;
};
type CodexThreadInjectItemsParams = JsonObject & {
  threadId: string;
  items: JsonValue[];
};
type CodexThreadUnsubscribeParams = JsonObject & {
  threadId: string;
};
type CodexTurnInterruptParams = JsonObject & {
  threadId: string;
  turnId: string;
};
type CodexTurnStartResponse = {
  turn: CodexTurn;
};
type CodexTurn = {
  id: string;
  threadId?: string;
  status?: string;
  error?: CodexErrorNotification["error"] | null;
  startedAt?: number | null;
  completedAt?: number | null;
  durationMs?: number | null;
  items: CodexThreadItem[];
};
type CodexThread = {
  id: string;
  sessionId?: string;
  historyMode?: "legacy" | "paginated";
  extra?: JsonObject | null;
  name?: string | null;
  preview?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  status?: CodexThreadStatus | null;
  modelProvider?: string | null;
  cwd?: string | null;
  source?: CodexSessionSource | null;
  threadSource?: string | null;
  agentNickname?: string | null;
  agentRole?: string | null;
  turns?: CodexTurn[];
};
type CodexThreadStatus =
  | {
      type: "notLoaded";
    }
  | {
      type: "idle";
    }
  | {
      type: "systemError";
    }
  | {
      type: "active";
      activeFlags?: string[];
    };
type CodexSubAgentThreadSpawnSource = {
  parent_thread_id: string;
  depth?: number;
  agent_path?: string | null;
  agent_nickname?: string | null;
  agent_role?: string | null;
};
type CodexSubAgentSource =
  | "review"
  | "compact"
  | "memory_consolidation"
  | {
      thread_spawn: CodexSubAgentThreadSpawnSource;
    }
  | {
      other: string;
    };
type CodexSessionSource =
  | "cli"
  | "vscode"
  | "exec"
  | "appServer"
  | "unknown"
  | {
      custom: string;
    }
  | {
      subAgent: CodexSubAgentSource;
    };
type CodexThreadItem = {
  id: string;
  type: string;
  title: string | null;
  status: string | null;
  name: string | null;
  tool: string | null;
  server: string | null;
  command: string | null;
  cwd: string | null;
  query: string | null;
  arguments?: JsonValue;
  result?: JsonValue;
  error?: CodexErrorNotification["error"];
  exitCode?: number | null;
  durationMs?: number | null;
  aggregatedOutput: string | null;
  text: string;
  contentItems?: CodexDynamicToolCallOutputContentItem[] | null;
  changes: Array<{
    path: string;
    kind: string;
  }>;
  [key: string]: unknown;
};
type CodexServerNotification = {
  method: string;
  params?: JsonValue;
};
type CodexDynamicToolCallOutputContentItem =
  | {
      type: "inputText";
      text: string;
    }
  | {
      type: "inputImage";
      imageUrl: string;
    }
  | JsonObject;
type CodexErrorNotification = {
  error: {
    message?: string;
    codexErrorInfo?: string | JsonObject | null;
    additionalDetails?: string | null;
    [key: string]: unknown;
  };
  willRetry?: boolean;
  threadId?: string;
  turnId?: string;
};
type CodexModel = {
  id?: string;
  model?: string;
  displayName?: string | null;
  description?: string | null;
  hidden: boolean;
  isDefault: boolean;
  inputModalities: string[];
  supportedReasoningEfforts: CodexReasoningEffortOption[];
  defaultReasoningEffort?: string | null;
};
type CodexReasoningEffortOption = {
  reasoningEffort?: string | null;
};
type CodexModelListResponse = {
  data: CodexModel[];
  nextCursor?: string | null;
};
type CodexGetAccountResponse = {
  account?: JsonValue;
  requiresOpenaiAuth?: boolean;
};
type CodexModelProviderCapabilitiesReadResponse = {
  namespaceTools: boolean;
  imageGeneration: boolean;
  webSearch: boolean;
};
type CodexLoginAccountParams =
  | {
      type: "apiKey";
      apiKey: string;
    }
  | {
      type: "chatgptAuthTokens";
      accessToken: string;
      chatgptAccountId: string;
      chatgptPlanType: string | null;
    };
type CodexPluginSummary = {
  id: string;
  remotePluginId?: string;
  name: string;
  source?: JsonObject;
  installed: boolean;
  enabled: boolean;
  installPolicy?: string;
  authPolicy?: string;
  availability?: string;
  interface?: JsonValue;
};
type CodexAppSummary = {
  id: string;
  name: string;
  description?: string | null;
  installUrl?: string | null;
  needsAuth: boolean;
};
type CodexPluginDetail = {
  marketplaceName?: string;
  marketplacePath?: string | null;
  summary: CodexPluginSummary;
  description?: string | null;
  skills?: JsonValue[];
  apps: CodexAppSummary[];
  mcpServers: string[];
};
type CodexPluginMarketplaceEntry = {
  name: string;
  path?: string | null;
  interface?: JsonValue;
  plugins: CodexPluginSummary[];
};
type CodexPluginListResponse = {
  marketplaces: CodexPluginMarketplaceEntry[];
  marketplaceLoadErrors?: JsonValue[];
  featuredPluginIds?: string[];
};
type CodexPluginReadResponse = {
  plugin: CodexPluginDetail;
};
type CodexPluginInstallResponse = {
  authPolicy: string;
  appsNeedingAuth: CodexAppSummary[];
};
type CodexAppInfo = {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  logoUrlDark?: string | null;
  distributionChannel?: string | null;
  branding?: JsonValue;
  appMetadata?: JsonValue;
  labels?: JsonValue;
  installUrl?: string | null;
  isAccessible: boolean;
  isEnabled: boolean;
  pluginDisplayNames: string[];
};
type CodexAppsListResponse = {
  data: CodexAppInfo[];
  nextCursor?: string | null;
};
type CodexSkillScope = "user" | "repo" | "system" | "admin";
type CodexSkillMetadata = {
  name: string;
  description: string;
  shortDescription?: string;
  interface?: JsonObject;
  dependencies?: JsonObject;
  path: string;
  scope: CodexSkillScope;
  enabled: boolean;
};
type CodexSkillErrorInfo = {
  path: string;
  message: string;
};
type CodexSkillsListEntry = {
  cwd: string;
  skills: CodexSkillMetadata[];
  errors: CodexSkillErrorInfo[];
};
type CodexSkillsListResponse = {
  data: CodexSkillsListEntry[];
};
type CodexHooksListResponse = {
  data: JsonValue[];
  nextCursor?: string | null;
};
type CodexMcpServerStatus = {
  name: string;
  tools: JsonObject;
};
type CodexListMcpServerStatusResponse = {
  data: CodexMcpServerStatus[];
  nextCursor?: string | null;
};
type CodexConfigReadResponse = {
  config: JsonObject;
  layers?: JsonValue[] | null;
};
type CodexConfigRequirementsReadResponse = {
  requirements: JsonObject | null;
};
type CodexAppServerRequestParamsOverride = {
  "environment/add": {
    environmentId: string;
    execServerUrl: string;
  };
  "thread/fork": CodexThreadForkParams;
  "thread/archive": CodexThreadArchiveParams;
  "thread/inject_items": CodexThreadInjectItemsParams;
  "thread/list": CodexThreadListParams;
  "thread/turns/list": CodexThreadTurnsListParams;
  "thread/name/set": CodexThreadSetNameParams;
  "thread/read": CodexThreadReadParams;
  "thread/start": CodexThreadStartParams;
  "thread/unarchive": CodexThreadArchiveParams;
  "thread/unsubscribe": CodexThreadUnsubscribeParams;
  "turn/interrupt": CodexTurnInterruptParams;
};
type CodexAppServerRequestResultMap = {
  initialize: CodexInitializeResponse;
  "account/rateLimits/read": JsonValue;
  "account/read": CodexGetAccountResponse;
  "app/list": CodexAppsListResponse;
  "config/mcpServer/reload": JsonValue;
  "config/read": CodexConfigReadResponse;
  "configRequirements/read": CodexConfigRequirementsReadResponse;
  "config/value/write": JsonValue;
  "environment/add": JsonValue;
  "experimentalFeature/enablement/set": JsonValue;
  "feedback/upload": JsonValue;
  "hooks/list": CodexHooksListResponse;
  "marketplace/add": JsonValue;
  "mcpServerStatus/list": CodexListMcpServerStatusResponse;
  "model/list": CodexModelListResponse;
  "modelProvider/capabilities/read": CodexModelProviderCapabilitiesReadResponse;
  "plugin/install": CodexPluginInstallResponse;
  "plugin/list": CodexPluginListResponse;
  "plugin/read": CodexPluginReadResponse;
  "review/start": JsonValue;
  "skills/list": CodexSkillsListResponse;
  "thread/compact/start": JsonValue;
  "thread/archive": JsonValue;
  "thread/fork": CodexThreadForkResponse;
  "thread/inject_items": JsonValue;
  "thread/list": CodexThreadListResponse;
  "thread/turns/list": CodexThreadTurnsListResponse;
  "thread/name/set": JsonValue;
  "thread/read": CodexThreadReadResponse;
  "thread/resume": CodexThreadResumeResponse;
  "thread/start": CodexThreadStartResponse;
  "thread/unarchive": CodexThreadUnarchiveResponse;
  "thread/unsubscribe": JsonValue;
  "turn/interrupt": JsonValue;
  "turn/start": CodexTurnStartResponse;
  "turn/steer": JsonValue;
};
//#endregion
//#region extensions/codex/src/app-server/config.d.ts
type CodexAppServerTransportMode = "stdio" | "websocket" | "unix";
type CodexAppServerHomeScope = "agent" | "user";
type CodexAppServerCommandSource = "managed" | "resolved-managed" | "config" | "env";
type CodexManagedCommandOrder = "package-first" | "desktop-first";
type CodexAppServerStartOptions = {
  transport: CodexAppServerTransportMode;
  homeScope?: CodexAppServerHomeScope;
  command: string;
  commandSource?: CodexAppServerCommandSource /** Desktop-first is reserved for the macOS app process that owns Computer Use permissions. */;
  managedCommandOrder?: CodexManagedCommandOrder /** Native plugin names checked at the final managed spawn boundary. */;
  managedComputerUsePluginNames?: string[];
  managedFallbackCommandPaths?: string[];
  args: string[] /** Process working directory for shipped Supervisor stdio endpoint compatibility. */;
  cwd?: string;
  url?: string;
  authToken?: string;
  headers: Record<string, string>;
  env?: Record<string, string>;
  clearEnv?: string[];
};
//#endregion
//#region extensions/codex/src/app-server/transport.d.ts
/**
 * Shared transport lifecycle helpers for stdio and WebSocket Codex app-server
 * connections.
 */
/** Child-process-like transport shape consumed by the Codex app-server client. */
type CodexAppServerTransport = {
  stdin: {
    write: (data: string, callback?: (error?: Error | null) => void) => unknown;
    end?: () => unknown;
    destroy?: () => unknown;
    unref?: () => unknown;
    on?: (event: "error", listener: (error: Error) => void) => unknown;
  };
  stdout: NodeJS.ReadableStream & {
    destroy?: () => unknown;
    unref?: () => unknown;
  };
  stderr: NodeJS.ReadableStream & {
    destroy?: () => unknown;
    unref?: () => unknown;
  };
  pid?: number;
  exitCode?: number | null;
  signalCode?: string | null;
  killed?: boolean;
  kill?: (signal?: NodeJS.Signals) => unknown;
  unref?: () => unknown;
  once: (event: string, listener: (...args: unknown[]) => void) => unknown;
  off?: (event: string, listener: (...args: unknown[]) => void) => unknown;
};
//#endregion
//#region extensions/codex/src/app-server/client.d.ts
type CodexServerRequestHandler = (
  request: Required<Pick<RpcRequest, "id" | "method">> & {
    params?: JsonValue;
  },
) => Promise<JsonValue | undefined> | JsonValue | undefined;
/** Notification handler registered on a Codex app-server client. */
type CodexServerNotificationHandler = (
  notification: CodexServerNotification,
) => Promise<void> | void;
/** Runtime identity returned by the Codex app-server initialize handshake. */
type CodexAppServerRuntimeIdentity = {
  serverVersion: string;
  userAgent?: string;
  codexHome?: string;
  platformFamily?: string;
  platformOs?: string;
};
/** Stateful app-server JSON-RPC client over stdio or websocket transport. */
declare class CodexAppServerClient {
  private readonly instanceId;
  private readonly child;
  private readonly lines;
  private readonly pending;
  private readonly requestHandlers;
  private readonly notificationHandlers;
  private readonly closeHandlers;
  private nextId;
  private initialized;
  private closed;
  private transportExited;
  private closeError;
  private serverVersion;
  private runtimeIdentity;
  private threadSessionRequestGuard;
  private stderrTail;
  private pendingParse;
  private constructor();
  /** Starts a new app-server client using resolved runtime start options. */
  static start(options?: Partial<CodexAppServerStartOptions>): CodexAppServerClient;
  /** Builds a client around a fake transport for tests. */
  static fromTransportForTests(child: CodexAppServerTransport): CodexAppServerClient;
  /** Performs the app-server initialize handshake and validates protocol version. */
  initialize(): Promise<void>;
  /** Returns the version detected during initialize. */
  getServerVersion(): string | undefined;
  /** Returns runtime metadata detected during initialize. */
  getRuntimeIdentity(): CodexAppServerRuntimeIdentity | undefined;
  /** Stable generation id for this exact physical client instance. */
  getInstanceId(): string;
  /** Installs the spawn-owner check run before config-loading thread requests. */
  setThreadSessionRequestGuard(
    guard:
      | ((options: {
          signal?: AbortSignal;
          timeoutMs?: number;
          timeoutMessage: string;
          abortMessage: string;
        }) => Promise<() => void>)
      | undefined,
  ): void;
  /** Returns the local transport PID for scoped child-process cleanup, when available. */
  getTransportPid(): number | undefined;
  request<M extends CodexAppServerRequestMethod>(
    method: M,
    params: CodexAppServerRequestParams<M>,
    options?: {
      timeoutMs?: number;
      signal?: AbortSignal;
    },
  ): Promise<CodexAppServerRequestResult<M>>;
  request<T = JsonValue | undefined>(
    method: string,
    params?: unknown,
    options?: {
      timeoutMs?: number;
      signal?: AbortSignal;
    },
  ): Promise<T>;
  private requestWithoutThreadSessionGuard;
  /** Sends a fire-and-forget JSON-RPC notification to the app-server. */
  notify(method: string, params?: JsonValue): void;
  /** Registers a handler for app-server requests sent back to OpenClaw. */
  addRequestHandler(handler: CodexServerRequestHandler): () => void;
  /** Registers a notification handler and returns its disposer. */
  addNotificationHandler(handler: CodexServerNotificationHandler): () => void;
  /** Registers a close handler and returns its disposer. */
  addCloseHandler(handler: (client: CodexAppServerClient) => void): () => void;
  /** Closes the transport without waiting for process/socket shutdown. */
  close(): void;
  /** Closes the transport and waits for shutdown according to transport policy. */
  closeAndWait(options?: { exitTimeoutMs?: number; forceKillDelayMs?: number }): Promise<boolean>;
  /** Closes this transport and runs cleanup only after physical process exit. */
  closeAndRunAfterExit(onExit: () => void, operation: string): Promise<void>;
  private writeMessage;
  private handleLine;
  private handlePendingParseLine;
  private handleParsedMessage;
  private handleResponse;
  private handleServerRequest;
  private runServerRequestHandlers;
  private runServerRequestHandlersWithoutTimeout;
  private handleNotification;
  private closeWithError;
  private markClosed;
  private rejectPendingRequests;
}
//#endregion
//#region extensions/codex/src/app-server/auth-bridge.d.ts
type AuthProfileOrderConfig = Parameters<typeof resolveAuthProfileOrder>[0]["cfg"];
declare function resolveCodexAppServerAuthProfileIdForAgent(params: {
  authProfileId?: string;
  authProfileStore?: AuthProfileStore;
  agentDir?: string;
  config?: AuthProfileOrderConfig;
}): string | undefined;
type CodexAppServerPreparedAuthProfileSnapshot = {
  loginParams: CodexLoginAccountParams;
  secretFreeCacheKey: string;
};
type CodexAppServerPreparedAuth =
  | {
      kind: "api-key";
      apiKey: string;
    }
  | {
      kind: "profile";
      profileId: string;
      store: AuthProfileStore;
      snapshot?: CodexAppServerPreparedAuthProfileSnapshot;
    };
//#endregion
export {
  CodexAppServerRequestMethod as a,
  JsonValue as c,
  CodexAppServerStartOptions as i,
  resolveCodexAppServerAuthProfileIdForAgent as n,
  CodexAppServerRequestParams as o,
  CodexAppServerClient as r,
  CodexAppServerRequestResult as s,
  CodexAppServerPreparedAuth as t,
};
