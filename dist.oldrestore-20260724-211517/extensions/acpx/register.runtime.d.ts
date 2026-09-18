import { W as PluginLogger, k as OpenClawPluginService } from "../../plugin-entry-DPCR66aO.js";
import {
  r as PluginStateKeyedStore,
  t as OpenKeyedStoreOptions,
} from "../../plugin-state-store.types-xAF7b0j2.js";
import { t as AcpRuntime } from "../../types-D85xy4rc.js";
//#region extensions/acpx/src/config-schema.d.ts
declare const ACPX_PERMISSION_MODES: readonly ["approve-all", "approve-reads", "deny-all"];
/** Permission policy applied to interactive ACPX tool requests. */
type AcpxPermissionMode = (typeof ACPX_PERMISSION_MODES)[number];
declare const ACPX_NON_INTERACTIVE_POLICIES: readonly ["deny", "fail"];
/** Permission policy applied when ACPX cannot ask a human for approval. */
type AcpxNonInteractivePermissionPolicy = (typeof ACPX_NON_INTERACTIVE_POLICIES)[number];
/** Raw MCP server command config accepted from plugin configuration. */
type McpServerConfig = {
  command: string;
  args?: string[];
  env?: Record<string, string>;
};
/** Fully resolved ACPX config consumed by the runtime service. */
type ResolvedAcpxPluginConfig = {
  cwd: string;
  stateDir: string;
  probeAgent?: string;
  permissionMode: AcpxPermissionMode;
  nonInteractivePermissions: AcpxNonInteractivePermissionPolicy;
  pluginToolsMcpBridge: boolean;
  openClawToolsMcpBridge: boolean;
  strictWindowsCmdWrapper: boolean;
  timeoutSeconds?: number;
  queueOwnerTtlSeconds: number;
  legacyCompatibilityConfig: {
    strictWindowsCmdWrapper?: boolean;
    queueOwnerTtlSeconds?: number;
  };
  mcpServers: Record<string, McpServerConfig>;
  agents: Record<string, string>;
};
//#endregion
//#region extensions/acpx/src/process-lease.d.ts
/** Lifecycle state for a tracked ACPX wrapper process. */
type AcpxProcessLeaseState = "open" | "closing" | "closed" | "lost";
/** Persisted identity and command metadata for one ACPX wrapper process. */
type AcpxProcessLease = {
  leaseId: string;
  gatewayInstanceId: string;
  sessionKey: string;
  wrapperRoot: string;
  wrapperPath: string;
  rootPid: number;
  processGroupId?: number;
  commandHash: string;
  startedAt: number;
  state: AcpxProcessLeaseState;
};
/** Async lease store used by runtime sessions and cleanup routines. */
type AcpxProcessLeaseStore = {
  load(leaseId: string): Promise<AcpxProcessLease | undefined>;
  listOpen(gatewayInstanceId?: string): Promise<AcpxProcessLease[]>;
  save(lease: AcpxProcessLease): Promise<void>;
  markState(leaseId: string, state: AcpxProcessLeaseState): Promise<void>;
};
//#endregion
//#region extensions/acpx/src/process-reaper.d.ts
/** Minimal process-table row used by ACPX cleanup. */
type AcpxProcessInfo = {
  pid: number;
  ppid: number;
  command: string;
};
/** Injectable process-listing and termination hooks for tests. */
type AcpxProcessCleanupDeps = {
  listProcesses?: () => Promise<AcpxProcessInfo[]>;
  killProcess?: (pid: number, signal: NodeJS.Signals) => void;
  sleep?: (ms: number) => Promise<void>;
};
declare namespace service_d_exports {
  export { createAcpxRuntimeService$1 as createAcpxRuntimeService, resolveAcpxTimerTimeoutMs };
}
type AcpxRuntimeLike = AcpRuntime & {
  probeAvailability(): Promise<void>;
  isHealthy(): boolean;
  doctor?(): Promise<{
    ok: boolean;
    message: string;
    details?: string[];
  }>;
};
type AcpxRuntimeFactoryParams = {
  pluginConfig: ResolvedAcpxPluginConfig;
  gatewayInstanceId: string;
  processLeaseStore: AcpxProcessLeaseStore;
  wrapperRoot: string;
  logger?: PluginLogger;
};
type CreateAcpxRuntimeServiceParams$1 = {
  pluginConfig?: unknown;
  openKeyedStore?: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
  runtimeFactory?: (params: AcpxRuntimeFactoryParams) => AcpxRuntimeLike | Promise<AcpxRuntimeLike>;
  processCleanupDeps?: AcpxProcessCleanupDeps;
};
/** Convert ACPX timeout seconds into timer-safe milliseconds. */
declare function resolveAcpxTimerTimeoutMs(timeoutSeconds: number | undefined): number | undefined;
/** Create the ACPX plugin service that owns runtime registration and cleanup. */
declare function createAcpxRuntimeService$1(
  params?: CreateAcpxRuntimeServiceParams$1,
): OpenClawPluginService;
//#endregion
//#region extensions/acpx/register.runtime.d.ts
type RealAcpxServiceModule = typeof service_d_exports;
type CreateAcpxRuntimeServiceParams = NonNullable<
  Parameters<RealAcpxServiceModule["createAcpxRuntimeService"]>[0]
>;
/** Creates the plugin service that registers ACPX as an ACP runtime backend. */
declare function createAcpxRuntimeService(
  params?: CreateAcpxRuntimeServiceParams,
): OpenClawPluginService;
//#endregion
export { createAcpxRuntimeService };
