import { o as SsrFPolicy } from "./ssrf-skjEI_i5.js";
import {
  Nt as BrowserConfig,
  Pt as BrowserProfileConfig,
  i as OpenClawConfig,
} from "./types.openclaw-DDo8sH3F.js";
//#region extensions/browser/src/browser/constants.d.ts
/**
 * Browser default configuration constants.
 *
 * Shared defaults for config resolution, tool schemas, managed Chrome launch,
 * tab cleanup, screenshots, and AI snapshot sizing.
 */
/** Default enabled state for the browser plugin. */
declare const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default JavaScript evaluation permission for managed browser actions. */
declare const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Default color for the managed OpenClaw browser profile. */
declare const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default managed profile name shown to users. */
declare const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when no profile is requested. */
declare const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser action execution. */
declare const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 60000;
/** Default maximum AI snapshot text size. */
declare const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 40000;
//#endregion
//#region extensions/browser/src/browser/paths.d.ts
/** Default root directory for browser upload inputs. */
declare const DEFAULT_UPLOAD_DIR: string;
//#endregion
//#region extensions/browser/src/browser/config.d.ts
/** Browser config after defaults, derived ports, and profile defaults are applied. */
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
  headlessSource?: "config" | "default";
  noSandbox: boolean;
  attachOnly: boolean;
  defaultProfile: string;
  profiles: Record<string, BrowserProfileConfig>;
  tabCleanup: ResolvedBrowserTabCleanupConfig;
  ssrfPolicy?: SsrFPolicy;
  extraArgs: string[] /** Default loopback port for extension-driver relay servers. */;
  extensionRelayDefaultPort: number /** Assigned loopback relay port per extension-driver profile (no explicit cdpPort). */;
  extensionRelayPorts: Record<
    string,
    number
  > /** Derived bearer token for extension relay auth (absent until gateway auth exists). */;
  extensionRelayToken?: string;
};
/** Normalized tab-cleanup settings for session-owned browser tabs. */
type ResolvedBrowserTabCleanupConfig = {
  enabled: boolean;
  idleMinutes: number;
  maxTabsPerSession: number;
  sweepMinutes: number;
};
/** Runtime browser profile settings resolved from global and profile config. */
type ResolvedBrowserProfile = {
  name: string;
  cdpPort: number;
  cdpUrl: string;
  cdpHost: string;
  cdpIsLoopback: boolean;
  userDataDir?: string;
  mcpCommand?: string;
  mcpArgs?: string[];
  color: string;
  driver: "openclaw" | "existing-session" | "extension";
  executablePath?: string;
  headless: boolean;
  headlessSource?: "profile" | "config" | "default";
  attachOnly: boolean;
};
/** Source that determined managed Chrome headless mode. */
type ManagedBrowserHeadlessSource =
  | "request"
  | "env"
  | "profile"
  | "config"
  | "linux-display-fallback"
  | "default";
/** Resolve raw browser config into runtime browser defaults. */
declare function resolveBrowserConfig(
  cfg: BrowserConfig | undefined,
  rootConfig?: OpenClawConfig,
): ResolvedBrowserConfig;
/** Resolve one configured browser profile by name. */
declare function resolveProfile(
  resolved: ResolvedBrowserConfig,
  profileName: string,
): ResolvedBrowserProfile | null;
//#endregion
export {
  resolveBrowserConfig as a,
  DEFAULT_AI_SNAPSHOT_MAX_CHARS as c,
  DEFAULT_BROWSER_EVALUATE_ENABLED as d,
  DEFAULT_OPENCLAW_BROWSER_COLOR as f,
  ResolvedBrowserTabCleanupConfig as i,
  DEFAULT_BROWSER_ACTION_TIMEOUT_MS as l,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME as m,
  ResolvedBrowserConfig as n,
  resolveProfile as o,
  DEFAULT_OPENCLAW_BROWSER_ENABLED as p,
  ResolvedBrowserProfile as r,
  DEFAULT_UPLOAD_DIR as s,
  ManagedBrowserHeadlessSource as t,
  DEFAULT_BROWSER_DEFAULT_PROFILE_NAME as u,
};
