import { s as SessionEntry } from "../types-Dk-ocvLl.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
//#region src/agents/context-resolution.d.ts
type ContextTokenResolutionParams = {
  cfg?: OpenClawConfig;
  sourceCfg?: OpenClawConfig | null;
  provider?: string;
  modelProvider?: string;
  model?: string;
  contextTokensOverride?: number;
  fallbackContextTokens?: number;
  modelContextWindow?: number;
  modelContextTokens?: number;
  allowAsyncLoad?: boolean;
  allowUnscopedModelLookup?: boolean;
};
declare function resolveContextTokensForModelFromCache(
  params: ContextTokenResolutionParams,
  lookupContextTokens?: (modelId?: string) => number | undefined,
  lookupContextWindow?: (modelId?: string) => number | undefined,
): number | undefined;
//#endregion
//#region src/agents/context.d.ts
declare function waitForContextWindowCacheLoad(options?: {
  timeoutMs?: number;
}): Promise<"idle" | "loaded" | "timeout">;
//#endregion
//#region src/sessions/classify-session-kind.d.ts
type SessionKind = "cron" | "direct" | "group" | "global" | "spawn-child" | "unknown";
/**
 * Classify a session key + entry into a display kind.
 *
 * Evaluation order matters — more-specific signals take priority:
 *   1. sentinel keys ("global", "unknown")
 *   2. cron key shape
 *   3. spawn-child (entry has `spawnedBy`) — checked before key-shape so ACP
 *      spawn-child sessions with opaque keys are not misclassified as "direct"
 *   4. group/channel chatType or key-shape substring
 *   5. fallback: "direct"
 */
declare function classifySessionKind(
  key: string,
  entry?: {
    chatType?: string | null;
    spawnedBy?: string | null;
  },
): SessionKind;
//#endregion
//#region src/commands/status.summary.runtime.d.ts
declare function resolveConfiguredStatusModelRef(params: {
  cfg: OpenClawConfig;
  defaultProvider: string;
  defaultModel: string;
  agentId?: string;
}): {
  provider: string;
  model: string;
};
declare function resolveStatusModelLookupRef(params: {
  provider?: unknown;
  model?: unknown;
  defaultProvider?: unknown;
}): {
  provider: string;
  model: string;
} | null;
declare function resolveStatusModelComparisonLabel(params: {
  provider?: unknown;
  model?: unknown;
  defaultProvider?: unknown;
}): string | null;
declare function resolveSessionModelRef(
  cfg: OpenClawConfig,
  entry?:
    | SessionEntry
    | Pick<SessionEntry, "model" | "modelProvider" | "modelOverride" | "providerOverride">,
  agentId?: string,
): {
  provider: string;
  model: string;
};
declare function resolveSessionRuntimeLabel(params: {
  cfg: OpenClawConfig;
  entry?: SessionEntry;
  provider: string;
  model: string;
  agentId?: string;
  sessionKey: string;
}): string;
declare const statusSummaryRuntime: {
  waitForContextWindowCacheLoad: typeof waitForContextWindowCacheLoad;
  resolveContextTokensForModel: typeof resolveContextTokensForModelFromCache;
  classifySessionKey: typeof classifySessionKind;
  resolveSessionModelRef: typeof resolveSessionModelRef;
  resolveSessionRuntimeLabel: typeof resolveSessionRuntimeLabel;
  resolveConfiguredStatusModelRef: typeof resolveConfiguredStatusModelRef;
  resolveStatusModelLookupRef: typeof resolveStatusModelLookupRef;
  resolveStatusModelComparisonLabel: typeof resolveStatusModelComparisonLabel;
};
//#endregion
export { statusSummaryRuntime };
