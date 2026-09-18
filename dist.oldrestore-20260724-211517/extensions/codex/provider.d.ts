import {
  a as CodexAppServerRequestMethod,
  c as JsonValue,
  i as CodexAppServerStartOptions,
  n as resolveCodexAppServerAuthProfileIdForAgent,
  o as CodexAppServerRequestParams,
  s as CodexAppServerRequestResult,
} from "../../auth-bridge-C7wLdHtu.js";
import { r as CodexAppServerModelListResult } from "../../models-CGxhinTD.js";
import { an as ProviderPlugin } from "../../types-Ga3mNO_F.js";
import { m as ModelProviderDeclarationConfig } from "../../types.models-BqJSiNyu.js";

//#region extensions/codex/src/app-server/request.d.ts
/** Sends a typed Codex app-server request and returns the method-specific response shape. */
declare function requestCodexAppServerJson<M extends CodexAppServerRequestMethod>(params: {
  method: M;
  requestParams: CodexAppServerRequestParams<M>;
  timeoutMs?: number;
  pluginConfig?: unknown;
  startOptions?: CodexAppServerStartOptions;
  authProfileId?: string | null;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  sessionKey?: string;
  sessionId?: string;
  isolated?: boolean;
}): Promise<CodexAppServerRequestResult<M>>;
declare function requestCodexAppServerJson<T = JsonValue | undefined>(params: {
  method: string;
  requestParams?: unknown;
  timeoutMs?: number;
  pluginConfig?: unknown;
  startOptions?: CodexAppServerStartOptions;
  authProfileId?: string | null;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  sessionKey?: string;
  sessionId?: string;
  isolated?: boolean;
}): Promise<T>;
//#endregion
//#region extensions/codex/provider.d.ts
declare const CODEX_REASONING_EFFORTS: readonly [
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "ultra",
];
type CodexReasoningEffort = (typeof CODEX_REASONING_EFFORTS)[number];
type CodexModelLister = (options: {
  timeoutMs: number;
  limit?: number;
  cursor?: string;
  startOptions?: CodexAppServerStartOptions;
  sharedClient?: boolean;
}) => Promise<CodexAppServerModelListResult>;
type CodexUsageRead = {
  rateLimits: unknown;
  accountEmail?: string;
};
type CodexUsageReader = (options: {
  timeoutMs: number;
  agentDir?: string;
  authProfileId?: string;
  config?: Parameters<typeof requestCodexAppServerUsageLazy>[0]["config"];
  startOptions?: CodexAppServerStartOptions;
}) => Promise<CodexUsageRead>;
type BuildCodexProviderOptions = {
  pluginConfig?: unknown;
  listModels?: CodexModelLister;
  readUsage?: CodexUsageReader;
};
type BuildCatalogOptions = {
  env?: NodeJS.ProcessEnv;
  pluginConfig?: unknown;
  listModels?: CodexModelLister;
  onDiscoveryFailure?: (error: unknown) => void;
};
/**
 * Builds the Codex provider plugin, including setup metadata, catalog discovery,
 * dynamic model resolution, and prompt/thinking hooks.
 */
declare function buildCodexProvider(options?: BuildCodexProviderOptions): ProviderPlugin;
/**
 * Builds the Codex model catalog from live app-server discovery, falling back
 * to built-in model records when discovery is disabled or unavailable.
 */
declare function buildCodexProviderCatalog(options?: BuildCatalogOptions): Promise<{
  provider: ModelProviderDeclarationConfig;
}>;
declare function requestCodexAppServerUsageLazy(options: {
  timeoutMs: number;
  agentDir?: string;
  authProfileId?: string;
  config?: Parameters<typeof requestCodexAppServerJson>[0]["config"];
  startOptions?: CodexAppServerStartOptions;
}): Promise<{
  rateLimits: unknown;
  accountEmail?: string;
}>;
/** Read app-server reasoning metadata from a runtime model compat union. */
declare function readCodexSupportedReasoningEfforts(compat: unknown): string[] | undefined;
/** Map a requested effort onto the authoritative app-server model contract. */
declare function resolveCodexSupportedReasoningEffort(params: {
  requested: CodexReasoningEffort;
  supportedReasoningEfforts: readonly string[];
}): CodexReasoningEffort | undefined;
/** Return the known effort contract when app-server model metadata is unavailable. */
declare function resolveCodexFallbackReasoningEfforts(
  modelId: string,
): readonly CodexReasoningEffort[] | undefined;
/** Return whether the model uses the modern Codex reasoning profile. */
declare function isModernCodexModel(modelId: string): boolean;
/** Return whether Codex accepts the preview GPT-5.6 `max` reasoning effort. */
declare function isMaxReasoningCodexModel(modelId: string): boolean;
//#endregion
export {
  CodexReasoningEffort,
  buildCodexProvider,
  buildCodexProviderCatalog,
  isMaxReasoningCodexModel,
  isModernCodexModel,
  readCodexSupportedReasoningEfforts,
  resolveCodexFallbackReasoningEfforts,
  resolveCodexSupportedReasoningEffort,
};
