import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/secrets/runtime-web-tools.types.d.ts
/** Diagnostic codes emitted while selecting runtime web search/fetch providers. */
type RuntimeWebDiagnosticCode =
  | "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT"
  | "WEB_SEARCH_AUTODETECT_SELECTED"
  | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED"
  | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK"
  | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT"
  | "WEB_FETCH_AUTODETECT_SELECTED"
  | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED"
  | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
/** User-facing diagnostic attached to runtime web-tool metadata. */
type RuntimeWebDiagnostic = {
  code: RuntimeWebDiagnosticCode;
  message: string;
  path?: string;
};
/** Runtime selection metadata for the web search tool. */
type RuntimeWebSearchMetadata = {
  /** Provider explicitly configured in source config, before auto-detect fallback. */ providerConfigured?: string;
  providerSource:
    | "configured"
    | "auto-detect"
    | "none" /** Provider that runtime calls should use after config validation and credential lookup. */;
  selectedProvider?: string /** Source that supplied the selected provider credential, or why it is unavailable. */;
  selectedProviderKeySource?:
    | "config"
    | "secretRef"
    | "env"
    | "missing" /** Perplexity transport chosen from provider config or runtime default. */;
  perplexityTransport?: "search_api" | "chat_completions";
  diagnostics: RuntimeWebDiagnostic[];
};
/** Runtime selection metadata for the web fetch tool. */
type RuntimeWebFetchMetadata = {
  /** Provider explicitly configured in source config, before auto-detect fallback. */ providerConfigured?: string;
  providerSource:
    | "configured"
    | "auto-detect"
    | "none" /** Provider that runtime calls should use after config validation and credential lookup. */;
  selectedProvider?: string /** Source that supplied the selected provider credential, or why it is unavailable. */;
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing";
  diagnostics: RuntimeWebDiagnostic[];
};
//#endregion
//#region src/cli/command-secret-gateway.d.ts
type ResolveCommandSecretsResult = {
  resolvedConfig: OpenClawConfig;
  diagnostics: string[];
  targetStatesByPath: Record<string, CommandSecretTargetState>;
  hadUnresolvedTargets: boolean;
};
type CommandSecretResolutionMode =
  | "enforce_resolved"
  | "read_only_status"
  | "read_only_operational";
type LegacyCommandSecretResolutionMode = "strict" | "summary" | "operational_readonly";
type CommandSecretResolutionModeInput =
  | CommandSecretResolutionMode
  | LegacyCommandSecretResolutionMode;
type CommandSecretTargetState =
  | "resolved_gateway"
  | "resolved_local"
  | "inactive_surface"
  | "unresolved";
declare function resolveCommandSecretRefsViaGateway(params: {
  config: OpenClawConfig;
  commandName: string;
  targetIds: Set<string>;
  mode?: CommandSecretResolutionModeInput;
  allowedPaths?: ReadonlySet<string>;
  forcedActivePaths?: ReadonlySet<string>;
  optionalActivePaths?: ReadonlySet<string>;
  allowLocalExecSecretRefs?: boolean;
  scrubUnresolvedSecretRefs?: boolean;
}): Promise<ResolveCommandSecretsResult>;
//#endregion
export {
  RuntimeWebFetchMetadata as n,
  RuntimeWebSearchMetadata as r,
  resolveCommandSecretRefsViaGateway as t,
};
