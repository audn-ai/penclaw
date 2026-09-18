import { ClientCapabilities } from "@modelcontextprotocol/sdk/types.js";
import { jsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/types.js";
import {
  a as SessionMcpRuntimeManager,
  i as SessionMcpRuntime,
} from "../agent-bundle-mcp-types-DZJv9FXg.js";
import { n as PluginManifestRegistry } from "../manifest-registry-CHEq75Tu.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/agents/mcp-json-schema-validator.d.ts
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
declare function createMcpJsonSchemaValidator(): jsonSchemaValidator;
//#endregion
//#region src/agents/agent-bundle-mcp-runtime.d.ts
type CreateSessionMcpRuntime = (
  params: Parameters<typeof createSessionMcpRuntime>[0] & {
    configFingerprint?: string;
  },
) => SessionMcpRuntime;
declare function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs?: number): void;
declare function setBundleMcpDisposeTimeoutMsForTest(timeoutMs?: number): void;
declare function buildMcpClientCapabilities(mcpAppsEnabled: boolean): ClientCapabilities;
/**
 * Loads enabled MCP config metadata for a session without creating runtimes,
 * connecting transports, or issuing MCP tools/list requests.
 */
declare function resolveSessionMcpConfigSummary(params: {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): {
  fingerprint: string;
  serverNames: string[];
};
declare function resolveSessionMcpRuntimeIdleTtlMs(cfg?: OpenClawConfig): number;
declare function createSessionMcpRuntime(params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): SessionMcpRuntime;
declare function createSessionMcpRuntimeManager(opts?: {
  createRuntime?: CreateSessionMcpRuntime;
  now?: () => number;
  enableIdleSweepTimer?: boolean;
  idleSweepIntervalMs?: number;
}): SessionMcpRuntimeManager;
declare function getOrCreateSessionMcpRuntime(params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): Promise<SessionMcpRuntime>;
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
declare function peekSessionMcpRuntime(params: {
  sessionId?: string | null;
  sessionKey?: string | null;
}): SessionMcpRuntime | undefined;
declare function retireSessionMcpRuntime(params: {
  sessionId?: string | null;
  reason: string;
  preserveActiveLeases?: boolean;
  onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
/** Completes a one-shot retirement after its final run, view, or request lease releases. */
declare function completeDeferredSessionMcpRuntimeRetirement(
  runtime: SessionMcpRuntime,
): Promise<boolean>;
declare function retireSessionMcpRuntimeForSessionKey(params: {
  sessionKey?: string | null;
  reason: string;
  preserveActiveLeases?: boolean;
  onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
declare function disposeAllSessionMcpRuntimes(): Promise<void>;
declare const testing: {
  buildMcpClientCapabilities: typeof buildMcpClientCapabilities;
  createSessionMcpRuntimeManager: typeof createSessionMcpRuntimeManager;
  resetSessionMcpRuntimeManager(): Promise<void>;
  getCachedSessionIds(): string[];
  setBundleMcpCatalogListTimeoutMsForTest: typeof setBundleMcpCatalogListTimeoutMsForTest;
  setBundleMcpDisposeTimeoutMsForTest: typeof setBundleMcpDisposeTimeoutMsForTest;
  resolveSessionMcpRuntimeIdleTtlMs: typeof resolveSessionMcpRuntimeIdleTtlMs;
};
//#endregion
export {
  completeDeferredSessionMcpRuntimeRetirement,
  createMcpJsonSchemaValidator as createBundleMcpJsonSchemaValidator,
  createSessionMcpRuntime,
  disposeAllSessionMcpRuntimes,
  getOrCreateSessionMcpRuntime,
  peekSessionMcpRuntime,
  resolveSessionMcpConfigSummary,
  retireSessionMcpRuntime,
  retireSessionMcpRuntimeForSessionKey,
  testing,
};
