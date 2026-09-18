import { Nt as BrowserConfig, i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/browser-types.d.ts
/** Browser profile config embedded in resolved browser config. */
type ResolvedBrowserProfileConfig = {
  cdpPort?: number;
  cdpUrl?: string;
  userDataDir?: string;
  mcpCommand?: string;
  mcpArgs?: string[];
  driver?: "openclaw" | "clawd" | "existing-session";
  headless?: boolean;
  executablePath?: string;
  attachOnly?: boolean;
  color: string;
};
/** SSRF policy embedded in resolved browser config. */
type ResolvedBrowserSsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  allowedOrigins?: string[];
  hostnameAllowlist?: string[];
};
/** Resolved browser tab cleanup settings after defaults and config are applied. */
type ResolvedBrowserTabCleanupConfig = {
  enabled: boolean;
  idleMinutes: number;
  maxTabsPerSession: number;
  sweepMinutes: number;
};
/** Fully resolved browser plugin config used by browser runtime callers. */
type ResolvedBrowserConfig = {
  enabled: boolean;
  evaluateEnabled: boolean;
  controlPort: number;
  cdpPortRangeStart: number;
  cdpPortRangeEnd: number;
  cdpProtocol: "http" | "https";
  cdpHost: string;
  cdpIsLoopback: boolean;
  remoteCdpTimeoutMs: number;
  remoteCdpHandshakeTimeoutMs: number;
  localLaunchTimeoutMs: number;
  localCdpReadyTimeoutMs: number;
  actionTimeoutMs: number;
  color: string;
  executablePath?: string;
  headless: boolean;
  noSandbox: boolean;
  attachOnly: boolean;
  defaultProfile: string;
  profiles: Record<string, ResolvedBrowserProfileConfig>;
  tabCleanup: ResolvedBrowserTabCleanupConfig;
  ssrfPolicy?: ResolvedBrowserSsrFPolicy;
  extraArgs: string[];
};
/** One resolved browser profile target including CDP endpoint and launch mode. */
type ResolvedBrowserProfile = {
  name: string;
  cdpPort: number;
  cdpUrl: string;
  cdpHost: string;
  cdpIsLoopback: boolean;
  userDataDir?: string;
  color: string;
  driver: "openclaw" | "existing-session";
  headless?: boolean;
  attachOnly: boolean;
};
//#endregion
//#region src/plugin-sdk/browser-profiles.d.ts
/** Default global browser plugin enabled state. */
declare const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default setting for model/tool browser page evaluation. */
declare const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Default browser profile accent color shown in UI surfaces. */
declare const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default OpenClaw-managed browser profile name. */
declare const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when config omits a profile name. */
declare const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser actions issued through the browser plugin. */
declare const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 60000;
/** Default maximum AI snapshot text captured from browser pages. */
declare const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000;
/** Default upload staging directory used by browser-backed file uploads. */
declare const DEFAULT_UPLOAD_DIR: string;
/** Resolves browser config through the activated bundled browser profile facade. */
declare function resolveBrowserConfig(
  cfg: BrowserConfig | undefined,
  rootConfig?: OpenClawConfig,
): ResolvedBrowserConfig;
/** Resolves one named browser profile from an already resolved browser config. */
declare function resolveProfile(
  resolved: ResolvedBrowserConfig,
  profileName: string,
): ResolvedBrowserProfile | null;
//#endregion
//#region src/plugin-sdk/browser-cdp.d.ts
/** Parsed browser/CDP endpoint details with display-safe normalized URL variants. */
type BrowserHttpUrlParseResult = {
  /** Parsed URL object retained for callers that need protocol, host, path, or credentials. */ parsed: URL /** Effective TCP port, including inferred 80/443 defaults. */;
  port: number /** Whether the raw URL text included a port, even if URL normalization drops it. */;
  hasExplicitPort: boolean /** URL string normalized by WHATWG URL rules with a trailing slash removed. */;
  normalized: string /** Normalized URL string that preserves an explicitly supplied default port. */;
  normalizedWithPort: string;
};
/**
 * Parses a browser/CDP endpoint and returns both URL semantics and display-safe normalized forms.
 */
declare function parseBrowserHttpUrl(raw: string, label: string): BrowserHttpUrlParseResult;
/**
 * Redacts credentials and known sensitive tokens from CDP URLs before logs or diagnostics.
 */
declare function redactCdpUrl(cdpUrl: string | null | undefined): string | null | undefined;
//#endregion
//#region src/plugin-sdk/browser-control-auth.d.ts
/** Browser control credentials resolved from config, env, or generated setup state. */
type BrowserControlAuth = {
  /** Bearer token accepted by the browser control HTTP surface. */ token?: string /** Password fallback for deployments that expose password-based browser control auth. */;
  password?: string;
};
/** Inputs used when resolving or creating browser control auth for the active config. */
type EnsureBrowserControlAuthParams = {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
};
/** Resolved auth plus the generated token when this call created one. */
type EnsureBrowserControlAuthResult = {
  auth: BrowserControlAuth;
  generatedToken?: string;
};
/** Resolves browser control auth from config/env without generating new credentials. */
declare function resolveBrowserControlAuth(
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
): BrowserControlAuth;
/** Ensures browser control auth exists, returning any token generated during the call. */
declare function ensureBrowserControlAuth(
  params: EnsureBrowserControlAuthParams,
): Promise<EnsureBrowserControlAuthResult>;
//#endregion
export {
  ResolvedBrowserProfile as _,
  redactCdpUrl as a,
  DEFAULT_BROWSER_DEFAULT_PROFILE_NAME as c,
  DEFAULT_OPENCLAW_BROWSER_ENABLED as d,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME as f,
  ResolvedBrowserConfig as g,
  resolveProfile as h,
  parseBrowserHttpUrl as i,
  DEFAULT_BROWSER_EVALUATE_ENABLED as l,
  resolveBrowserConfig as m,
  ensureBrowserControlAuth as n,
  DEFAULT_AI_SNAPSHOT_MAX_CHARS as o,
  DEFAULT_UPLOAD_DIR as p,
  resolveBrowserControlAuth as r,
  DEFAULT_BROWSER_ACTION_TIMEOUT_MS as s,
  BrowserControlAuth as t,
  DEFAULT_OPENCLAW_BROWSER_COLOR as u,
  ResolvedBrowserTabCleanupConfig as v,
};
