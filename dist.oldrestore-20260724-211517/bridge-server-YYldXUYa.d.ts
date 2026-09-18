import { ChildProcess } from "node:child_process";
import { IncomingMessage, Server } from "node:http";
import { WebSocket } from "ws";
import { t as BrowserExecutable } from "./chrome.executables-BBruraW5.js";
import {
  n as ResolvedBrowserConfig,
  r as ResolvedBrowserProfile,
  t as ManagedBrowserHeadlessSource,
} from "./config-D6we8oBa.js";

//#region extensions/browser/src/browser/client.types.d.ts
/**
 * Browser client response types.
 *
 * Shared by the browser control client, CLI, and Browser agent tool.
 */
/** Browser transport backing the selected profile. */
type BrowserTransport = "cdp" | "chrome-mcp" | "extension";
type BrowserHeadlessSource =
  | "request"
  | "env"
  | "profile"
  | "config"
  | "linux-display-fallback"
  | "default";
type BrowserGraphicsAcceleration = "hardware" | "software" | "unknown";
type BrowserGraphicsDevice = {
  vendorId: number;
  deviceId: number;
  vendor: string;
  device: string;
  driverVendor: string;
  driverVersion: string;
};
type BrowserVideoDecodeCapability = {
  profile: string;
  minResolution: {
    width: number;
    height: number;
  };
  maxResolution: {
    width: number;
    height: number;
  };
};
type BrowserVideoEncodeCapability = {
  profile: string;
  maxResolution: {
    width: number;
    height: number;
  };
  maxFramerateNumerator: number;
  maxFramerateDenominator: number;
};
type BrowserGraphicsDiagnostics =
  | {
      status: "available";
      observedAt: number;
      acceleration: BrowserGraphicsAcceleration;
      renderer: string | null;
      vendor: string | null;
      version: string | null;
      backend: string | null;
      devices: BrowserGraphicsDevice[];
      featureStatus: Record<string, string>;
      disabledFeatures: Array<{
        feature: string;
        status: string;
      }>;
      driverBugWorkarounds: string[];
      videoDecoding: BrowserVideoDecodeCapability[];
      videoEncoding: BrowserVideoEncodeCapability[];
    }
  | {
      status: "unavailable";
      observedAt: number;
      reason: string;
    };
/** Browser status response returned by the control server. */
type BrowserStatus = {
  enabled: boolean;
  profile?: string;
  driver?: "openclaw" | "existing-session" | "extension";
  transport?: BrowserTransport;
  running: boolean;
  cdpReady?: boolean;
  cdpHttp?: boolean;
  /**
   * For Chrome MCP existing-session profiles, true only if a page-level tool
   * round-trip (`list_pages`) completes; for managed CDP profiles, mirrors
   * `cdpReady`. Distinguishes "transport handshake passed" from "page tools
   * are actually usable".
   */
  pageReady?: boolean;
  pid: number | null;
  cdpPort: number | null;
  cdpUrl?: string | null;
  chosenBrowser: string | null;
  detectedBrowser?: string | null;
  detectedExecutablePath?: string | null;
  detectError?: string | null;
  userDataDir: string | null;
  color: string;
  headless: boolean;
  headlessSource?: BrowserHeadlessSource;
  noSandbox?: boolean;
  executablePath?: string | null;
  attachOnly: boolean;
  /**
   * Cached process-lifetime diagnostics for a locally launched managed browser.
   * Passive status calls never launch a browser to populate this field.
   */
  graphics?: BrowserGraphicsDiagnostics | null;
};
/** Browser tab record exposed by tab listing and tab mutation endpoints. */
type BrowserTab = {
  /** Best handle for agents to pass back as targetId: label, then tabId, then raw targetId. */ suggestedTargetId?: string;
  targetId: string /** Stable, human-friendly tab handle for this profile runtime (for example t1). */;
  tabId?: string /** Optional user-assigned tab label. */;
  label?: string;
  title: string;
  url: string;
  wsUrl?: string;
  type?: string;
};
/** ARIA snapshot node exposed in structured snapshot responses. */
type SnapshotAriaNode = {
  ref: string;
  role: string;
  name: string;
  value?: string;
  description?: string;
  backendDOMNodeId?: number;
  depth: number;
};
//#endregion
//#region extensions/browser/src/browser/chrome.d.ts
/** Running managed Chrome process and resolved control metadata. */
type RunningChrome = {
  pid: number;
  exe: BrowserExecutable;
  userDataDir: string;
  cdpPort: number;
  startedAt: number;
  proc: ChildProcess;
  headless?: boolean;
  headlessSource?: ManagedBrowserHeadlessSource;
  graphicsDiagnostics?: BrowserGraphicsDiagnostics;
  graphicsDiagnosticsPending?: Promise<BrowserGraphicsDiagnostics> /** @deprecated Scoped CDP bypasses now release with each request. */;
  releaseCdpProxyBypass?: () => void;
};
//#endregion
//#region extensions/browser/src/browser/errors.d.ts
/** Stable machine-readable browser error reasons. */
declare const BROWSER_ERROR_REASONS: {
  readonly noDisplayForHeadedProfile: "no_display_for_headed_profile";
};
declare const NO_DISPLAY_HEADLESS_SOURCES: readonly [
  "request",
  "env",
  "profile",
  "config",
  "default",
];
type BrowserNoDisplayErrorDetails = {
  profile: string;
  requestedHeadless: false;
  headlessSource: (typeof NO_DISPLAY_HEADLESS_SOURCES)[number];
  displayPresent: false;
};
type BrowserNoDisplayErrorMetadata = {
  reason: typeof BROWSER_ERROR_REASONS.noDisplayForHeadedProfile;
  details: BrowserNoDisplayErrorDetails;
};
type WithNoDisplayMetadata<T> = T | (T & BrowserNoDisplayErrorMetadata);
type BrowserErrorResponse = WithNoDisplayMetadata<{
  status: number;
  message: string;
}>;
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-protocol.d.ts
/**
 * Wire protocol between the extension relay server and the OpenClaw Chrome
 * extension. The extension stays a dumb transport: it attaches chrome.debugger,
 * forwards CDP traffic, and manages the OpenClaw tab group. All CDP target
 * semantics (Target.* synthesis for Playwright) live server-side in the bridge.
 */
/** Tab snapshot reported by the extension for tabs shared with OpenClaw. */
type RelayTabInfo = {
  tabId: number;
  url: string;
  title: string;
  active: boolean;
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-bridge.d.ts
/** Minimal socket seam so tests can drive the bridge without real WebSockets. */
type BridgeSocket = {
  send: (data: string) => void;
  close: (code?: number, reason?: string) => void;
};
/** Browser identity reported by the paired extension. */
type ExtensionIdentity = {
  userAgent: string;
  browserVersion: string;
  extensionVersion: string;
};
/**
 * One relay bridge per extension-driver profile. Accepts at most one extension
 * connection (a newer one replaces the old — MV3 workers restart freely) and
 * any number of CDP clients (pw-session caches one per cdpUrl in practice).
 */
declare class ExtensionRelayBridge {
  private extension;
  private readonly clients;
  private readonly tabs;
  /** Browser-level sessions created by Playwright for page-scoped CDP access. */
  private readonly browserSessions;
  /** Extra root-page sessions multiplexed over one chrome.debugger attachment. */
  private readonly auxiliaryTabSessions;
  /** Child debugger sessions (iframes/workers) mapped to their owning tab. */
  private readonly childSessions;
  private readonly pendingExtension;
  private nextSeq;
  private nextSessionOrdinal;
  private pingTimer;
  private readonly onStateChange?;
  constructor(opts?: { onStateChange?: () => void });
  /** True once an extension socket completed its hello handshake. */
  get extensionConnected(): boolean;
  /** Identity of the paired browser, when connected. */
  get identity(): ExtensionIdentity | null;
  /** Tabs currently shared with OpenClaw (the extension's tab group). */
  sharedTabs(): RelayTabInfo[];
  /** Number of connected CDP clients (diagnostics). */
  get cdpClientCount(): number;
  /** Wire up a newly accepted extension WebSocket. */
  attachExtensionSocket(socket: BridgeSocket): {
    onMessage: (raw: string) => void;
    onClose: () => void;
  };
  private handleExtensionMessage;
  private handleExtensionGone;
  private startPing;
  private stopPing;
  private sendToExtension;
  private callExtension;
  private syncTabs;
  private ensureTabAttached;
  private targetInfoForTab;
  private announceAttachedTab;
  private emitDetachedFromTarget;
  private forwardExtensionEvent;
  /** Wire up a newly accepted CDP client WebSocket. */
  attachCdpClientSocket(socket: BridgeSocket): {
    onMessage: (raw: string) => void;
    onClose: () => void;
  };
  /**
   * Drop chrome.debugger sessions once no CDP client is connected so the
   * "OpenClaw is debugging this browser" infobar only spans active automation.
   */
  private detachAllWhenIdle;
  private respond;
  private respondError;
  private tabBySessionId;
  private tabByTargetId;
  private handleCdpRequest;
  private handleSessionScopedRequest;
  private handleBrowserScopedRequest;
  /** Close all sockets and reject pending work (relay shutdown). */
  dispose(): void;
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-server.d.ts
/** Running relay server handle owned by the profile runtime state. */
type ExtensionRelayHandle = {
  port: number /** Auth token this relay validates against; used to detect auth rotation. */;
  token: string;
  bridge: ExtensionRelayBridge;
  close: () => Promise<void>;
};
//#endregion
//#region extensions/browser/src/browser/server-context.types.d.ts
type BrowserTabTargetOptions = BrowserOperationOptions & {
  /** Resolve only the raw target-id namespace for an id already selected internally. */ exactTargetId?: true;
};
/** Runtime state for a single profile's Chrome instance. */
type ProfileRuntimeState = {
  profile: ResolvedBrowserProfile;
  running: RunningChrome | null /** @deprecated Lifecycle starts are owned by the profile actor. */;
  ensureBrowserAvailable?: {
    key: string;
    promise: Promise<void>;
  } | null;
  managedLaunchFailure?: {
    consecutiveFailures: number;
    lastFailureAt: number;
    cooldownUntil?: number;
    lastError: string;
  } /** Sticky tab selection when callers omit targetId (keeps snapshot+act consistent). */;
  lastTargetId?:
    | string
    | null /** Stable, user-facing tab aliases scoped to this profile runtime. */;
  tabAliases?: {
    nextTabNumber: number;
    byTargetId: Record<
      string,
      {
        tabId: string;
        label?: string;
        url?: string;
      }
    >;
  } /** @deprecated Lifecycle reconciliation is owned by the profile actor. */;
  reconcile?: {
    previousProfile: ResolvedBrowserProfile;
    reason: string;
  } | null;
};
/** Runtime state for the Browser control server. */
type BrowserServerState = {
  server?: Server | null;
  port: number;
  resolved: ResolvedBrowserConfig;
  profiles: Map<
    string,
    ProfileRuntimeState
  > /** Running extension relay servers keyed by profile name (extension driver). */;
  extensionRelays?: Map<string, ExtensionRelayHandle>;
  stopTrackedTabCleanup?: () => void;
  stopUnhandledRejectionHandler?: () => void;
};
type BrowserOperationOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
type EnsureTabAvailableOptions = BrowserOperationOptions & {
  /** Allow a target-id-only tab when the caller can continue through Playwright. */ allowPlaywrightFallback?: boolean;
};
type BrowserProfileActions = {
  ensureBrowserAvailable: (opts?: { headless?: boolean; signal?: AbortSignal }) => Promise<void>;
  ensureTabAvailable: (
    targetId?: string,
    options?: EnsureTabAvailableOptions,
  ) => Promise<BrowserTab>;
  isHttpReachable: (timeoutMs?: number) => Promise<boolean>;
  isTransportAvailable: (timeoutMs?: number) => Promise<boolean>;
  isReachable: (
    timeoutMs?: number,
    options?: {
      ephemeral?: boolean;
      signal?: AbortSignal;
    },
  ) => Promise<boolean>;
  listTabs: (options?: BrowserOperationOptions) => Promise<BrowserTab[]>;
  openTab: (
    url: string,
    opts?: {
      label?: string;
      signal?: AbortSignal;
      timeoutMs?: number;
    },
  ) => Promise<BrowserTab>;
  labelTab: (targetId: string, label: string) => Promise<BrowserTab>;
  focusTab: (targetId: string, options?: BrowserTabTargetOptions) => Promise<void>;
  closeTab: (targetId: string, options?: BrowserTabTargetOptions) => Promise<void>;
  stopRunningBrowser: () => Promise<{
    stopped: boolean;
  }>;
  resetProfile: () => Promise<{
    moved: boolean;
    from: string;
    to?: string;
  }>;
};
/** Profile-aware operations exposed to Browser route handlers. */
type BrowserRouteContext = {
  state: () => BrowserServerState;
  forProfile: (profileName?: string) => ProfileContext;
  listProfiles: () => Promise<ProfileStatus[]>;
  mapTabError: (err: unknown) => BrowserErrorResponse | null;
} & BrowserProfileActions;
/** Operations scoped to a single resolved Browser profile. */
type ProfileContext = {
  profile: ResolvedBrowserProfile;
} & BrowserProfileActions;
/** Status payload returned by Browser profile listing. */
type ProfileStatus = {
  name: string;
  transport: BrowserTransport;
  cdpPort: number | null;
  cdpUrl: string | null;
  color: string;
  driver: ResolvedBrowserProfile["driver"];
  running: boolean;
  tabCount: number;
  isDefault: boolean;
  isRemote: boolean;
  missingFromConfig?: boolean;
  reconcileReason?: string | null;
};
/** Inputs for creating a Browser route context. */
type ContextOptions = {
  getState: () => BrowserServerState | null;
  onEnsureAttachTarget?: (profile: ResolvedBrowserProfile) => Promise<void>;
  refreshConfigFromDisk?: boolean;
};
//#endregion
//#region extensions/browser/src/browser/server-context.d.ts
/** Creates the Browser route context used by control-server route handlers. */
declare function createBrowserRouteContext(opts: ContextOptions): BrowserRouteContext;
//#endregion
//#region extensions/browser/src/browser/bridge-server.d.ts
/** Running bridge server details returned to callers that manage its lifecycle. */
type BrowserBridge = {
  server: Server;
  port: number;
  baseUrl: string;
  state: BrowserServerState;
};
type ResolvedNoVncObserver = {
  noVncPort: number;
  password?: string;
};
/** Start an authenticated loopback browser bridge and register browser routes. */
declare function startBrowserBridgeServer(params: {
  resolved: ResolvedBrowserConfig;
  host?: string;
  port?: number;
  authToken?: string;
  authPassword?: string;
  onEnsureAttachTarget?: (profile: ProfileContext["profile"]) => Promise<void>;
  resolveSandboxNoVncToken?: (token: string) => ResolvedNoVncObserver | null;
  skipRouteRegistrationForTest?: boolean;
}): Promise<BrowserBridge>;
/** Stop a browser bridge server and clear its ephemeral port auth. */
declare function stopBrowserBridgeServer(server: Server): Promise<void>;
//#endregion
export {
  BrowserRouteContext as a,
  BrowserTab as c,
  createBrowserRouteContext as i,
  BrowserTransport as l,
  startBrowserBridgeServer as n,
  BrowserServerState as o,
  stopBrowserBridgeServer as r,
  BrowserStatus as s,
  BrowserBridge as t,
  SnapshotAriaNode as u,
};
