import { Server } from "node:http";
import { Express, Request } from "express";
import { Type } from "typebox";
import {
  a as BrowserRouteContext,
  c as BrowserTab,
  l as BrowserTransport,
  o as BrowserServerState,
  s as BrowserStatus,
  u as SnapshotAriaNode,
} from "./bridge-server-YYldXUYa.js";
import { r as AnyAgentTool } from "./common-CuQ9SS3Z.js";
import { r as ResolvedBrowserProfile } from "./config-D6we8oBa.js";
import { k as OpenClawPluginService } from "./plugin-entry-DPCR66aO.js";
import { i as GatewayRequestHandlers } from "./types-Dz3ohwUV.js";
//#region extensions/browser/src/browser/download-types.d.ts
/** Metadata for a browser download saved under the configured output root. */
type BrowserDownloadResult = {
  url: string;
  suggestedFilename: string;
  path: string;
};
//#endregion
//#region extensions/browser/src/browser/screenshot-annotate.d.ts
interface AnnotationBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface AnnotationItem {
  ref: string;
  number: number;
  role: string;
  name?: string;
  box: AnnotationBox;
}
//#endregion
//#region extensions/browser/src/browser/client-actions-types.d.ts
/** Generic success result for action endpoints. */
type BrowserActionOk = {
  ok: true;
};
/** Success result carrying the affected tab and optional URL. */
type BrowserActionTabResult = {
  ok: true;
  targetId: string;
  url?: string;
  download?: BrowserDownloadResult;
};
/** Success result carrying a filesystem output path. */
type BrowserActionPathResult = {
  ok: true;
  path: string;
  targetId: string;
  url?: string;
  labels?: boolean;
  labelsCount?: number;
  labelsSkipped?: number;
  /**
   * Per-ref bounding boxes when labels=true. Coordinates are in the
   * captured image's space (viewport / fullpage / element-relative).
   * Omitted when empty.
   */
  annotations?: AnnotationItem[];
};
//#endregion
//#region extensions/browser/src/browser/client-actions.types.d.ts
/**
 * Browser action request types.
 *
 * Defines the closed action union accepted by browser-control `/act` routes and
 * reused by the Browser agent tool.
 */
/** Form field descriptor used by fill actions. */
type BrowserFormField = {
  ref: string;
  type: string;
  value?: string | number | boolean;
};
/** Normalized browser action request sent to the control server. */
type BrowserActRequest =
  | {
      kind: "click";
      ref?: string;
      selector?: string;
      targetId?: string;
      doubleClick?: boolean;
      button?: string;
      modifiers?: string[];
      delayMs?: number;
      timeoutMs?: number;
    }
  | {
      kind: "clickCoords";
      x: number;
      y: number;
      targetId?: string;
      doubleClick?: boolean;
      button?: string;
      delayMs?: number;
      timeoutMs?: number;
    }
  | {
      kind: "type";
      ref?: string;
      selector?: string;
      text: string;
      targetId?: string;
      submit?: boolean;
      slowly?: boolean;
      timeoutMs?: number;
    }
  | {
      kind: "press";
      key: string;
      targetId?: string;
      delayMs?: number;
    }
  | {
      kind: "hover";
      ref?: string;
      selector?: string;
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "scrollIntoView";
      ref?: string;
      selector?: string;
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "drag";
      startRef?: string;
      startSelector?: string;
      endRef?: string;
      endSelector?: string;
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "select";
      ref?: string;
      selector?: string;
      values: string[];
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "fill";
      fields: BrowserFormField[];
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "resize";
      width: number;
      height: number;
      targetId?: string;
    }
  | {
      kind: "wait";
      timeMs?: number;
      text?: string;
      textGone?: string;
      selector?: string;
      url?: string;
      loadState?: "load" | "domcontentloaded" | "networkidle";
      fn?: string;
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "evaluate";
      fn: string;
      ref?: string;
      targetId?: string;
      timeoutMs?: number;
    }
  | {
      kind: "close";
      targetId?: string;
    }
  | {
      kind: "batch";
      actions: BrowserActRequest[];
      targetId?: string;
      stopOnError?: boolean;
    };
//#endregion
//#region extensions/browser/src/browser/client-actions-core.d.ts
type BrowserActResponse = {
  ok: true;
  targetId: string;
  url?: string;
  result?: unknown;
  results?: Array<{
    ok: boolean;
    error?: string;
  }>;
  blockedByDialog?: boolean;
  browserState?: unknown /** Download info when a click/batch/evaluate action triggers a browser download. */;
  downloads?: BrowserDownloadResult[];
};
/** Navigate a browser tab through the control server. */
declare function browserNavigate(
  baseUrl: string | undefined,
  opts: {
    url: string;
    targetId?: string;
    profile?: string;
  },
): Promise<BrowserActionTabResult>;
/** Arm a one-shot browser dialog handler. */
declare function browserArmDialog(
  baseUrl: string | undefined,
  opts: {
    accept: boolean;
    promptText?: string;
    dialogId?: string;
    targetId?: string;
    timeoutMs?: number;
    profile?: string;
  },
): Promise<BrowserActionOk>;
/** Arm or execute a browser file chooser upload. */
declare function browserArmFileChooser(
  baseUrl: string | undefined,
  opts: {
    paths: string[];
    ref?: string;
    inputRef?: string;
    element?: string;
    targetId?: string;
    timeoutMs?: number;
    profile?: string;
  },
): Promise<BrowserActionOk>;
/** Execute one normalized browser action request. */
declare function browserAct(
  baseUrl: string | undefined,
  req: BrowserActRequest,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<BrowserActResponse>;
/** Capture a screenshot through the browser control server. */
declare function browserScreenshotAction(
  baseUrl: string | undefined,
  opts: {
    targetId?: string;
    fullPage?: boolean;
    ref?: string;
    element?: string;
    type?: "png" | "jpeg";
    labels?: boolean;
    timeoutMs?: number;
    profile?: string;
  },
): Promise<BrowserActionPathResult>;
//#endregion
//#region extensions/browser/src/browser/pw-session.d.ts
/** Console message captured from a Playwright page. */
type BrowserConsoleMessage = {
  type: string;
  text: string;
  timestamp: string;
  location?: {
    url?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
};
//#endregion
//#region extensions/browser/src/browser/client-actions-observe.d.ts
/** Read browser console messages for a tab. */
declare function browserConsoleMessages(
  baseUrl: string | undefined,
  opts?: {
    level?: string;
    targetId?: string;
    profile?: string;
  },
): Promise<{
  ok: true;
  messages: BrowserConsoleMessage[];
  targetId: string;
  url?: string;
}>;
/** Save the current page as PDF through browser control. */
declare function browserPdfSave(
  baseUrl: string | undefined,
  opts?: {
    targetId?: string;
    profile?: string;
  },
): Promise<BrowserActionPathResult>;
//#endregion
//#region extensions/browser/src/browser/doctor.d.ts
type BrowserDoctorCheckStatus = "pass" | "warn" | "fail" | "info";
/** One browser doctor check result. */
type BrowserDoctorCheck = {
  id: string;
  label: string;
  status: BrowserDoctorCheckStatus;
  summary: string;
  fixHint?: string;
};
/** Browser doctor report returned by browser-control clients. */
type BrowserDoctorReport = {
  ok: boolean;
  profile: string;
  transport: BrowserTransport;
  checks: BrowserDoctorCheck[];
  status: BrowserStatus;
};
//#endregion
//#region extensions/browser/src/browser/client.d.ts
/** Profile status record returned by browser profile listing. */
type ProfileStatus = {
  name: string;
  transport?: BrowserTransport;
  cdpPort: number | null;
  cdpUrl: string | null;
  color: string;
  driver: "openclaw" | "existing-session" | "extension";
  running: boolean;
  tabCount: number;
  isDefault: boolean;
  isRemote: boolean;
  missingFromConfig?: boolean;
  reconcileReason?: string | null;
};
/** Result returned when a managed browser profile directory is reset. */
type BrowserResetProfileResult = {
  ok: true;
  moved: boolean;
  from: string;
  to?: string;
};
/** Snapshot response returned by browserSnapshot. */
type SnapshotResult =
  | {
      ok: true;
      format: "aria";
      targetId: string;
      url: string;
      nodes: SnapshotAriaNode[];
      blockedByDialog?: boolean;
      browserState?: unknown;
    }
  | {
      ok: true;
      format: "ai";
      targetId: string;
      url: string;
      snapshot: string;
      truncated?: boolean;
      refs?: Record<
        string,
        {
          role: string;
          name?: string;
          nth?: number;
        }
      >;
      stats?: {
        lines: number;
        chars: number;
        refs: number;
        interactive: number;
      };
      labels?: boolean;
      labelsCount?: number;
      labelsSkipped?: number;
      /**
       * Per-ref bounding boxes when labels=true. Coordinates are in the
       * captured image's space. Omitted when empty.
       */
      annotations?: AnnotationItem[];
      imagePath?: string;
      imageType?: "png" | "jpeg";
      blockedByDialog?: boolean;
      browserState?: unknown;
    };
/** Read browser-control status for the selected profile. */
declare function browserStatus(
  baseUrl?: string,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<BrowserStatus>;
/** Run browser doctor checks for the selected profile. */
declare function browserDoctor(
  baseUrl?: string,
  opts?: {
    profile?: string;
    deep?: boolean;
  },
): Promise<BrowserDoctorReport>;
/** List configured browser profiles and their current status. */
declare function browserProfiles(
  baseUrl?: string,
  opts?: {
    timeoutMs?: number;
  },
): Promise<ProfileStatus[]>;
/** Start the selected browser profile. */
declare function browserStart(
  baseUrl?: string,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<void>;
/** Stop the selected browser profile. */
declare function browserStop(
  baseUrl?: string,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<void>;
/** Reset the selected managed browser profile directory. */
declare function browserResetProfile(
  baseUrl?: string,
  opts?: {
    profile?: string;
  },
): Promise<BrowserResetProfileResult>;
/** Result returned after creating a browser profile. */
type BrowserCreateProfileResult = {
  ok: true;
  profile: string;
  transport?: BrowserTransport;
  cdpPort: number | null;
  cdpUrl: string | null;
  userDataDir: string | null;
  color: string;
  isRemote: boolean;
};
/** Create and persist a browser profile. */
declare function browserCreateProfile(
  baseUrl: string | undefined,
  opts: {
    name: string;
    color?: string;
    cdpUrl?: string;
    userDataDir?: string;
    driver?: "openclaw" | "existing-session";
  },
): Promise<BrowserCreateProfileResult>;
/** Result returned after deleting a browser profile. */
type BrowserDeleteProfileResult = {
  ok: true;
  profile: string;
  deleted: boolean;
};
/** Delete a configured browser profile. */
declare function browserDeleteProfile(
  baseUrl: string | undefined,
  profile: string,
): Promise<BrowserDeleteProfileResult>;
/** List tabs for the selected browser profile. */
declare function browserTabs(
  baseUrl?: string,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<BrowserTab[]>;
/** Open a new tab in the selected browser profile. */
declare function browserOpenTab(
  baseUrl: string | undefined,
  url: string,
  opts?: {
    profile?: string;
    label?: string;
    timeoutMs?: number;
  },
): Promise<BrowserTab>;
/** Focus an existing browser tab. */
declare function browserFocusTab(
  baseUrl: string | undefined,
  targetId: string,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<void>;
/** Close an existing browser tab. */
declare function browserCloseTab(
  baseUrl: string | undefined,
  targetId: string,
  opts?: {
    profile?: string;
    timeoutMs?: number;
  },
): Promise<void>;
/** Execute legacy index-based tab actions. */
declare function browserTabAction(
  baseUrl: string | undefined,
  opts: {
    action: "list" | "new" | "close" | "select";
    index?: number;
    profile?: string;
  },
): Promise<unknown>;
/** Capture an ARIA or AI snapshot for the selected tab. */
declare function browserSnapshot(
  baseUrl: string | undefined,
  opts: {
    format?: "aria" | "ai";
    targetId?: string;
    limit?: number;
    maxChars?: number;
    refs?: "role" | "aria";
    interactive?: boolean;
    compact?: boolean;
    depth?: number;
    selector?: string;
    frame?: string;
    labels?: boolean;
    urls?: boolean;
    mode?: "efficient";
    profile?: string;
    timeoutMs?: number;
  },
): Promise<SnapshotResult>;
//#endregion
//#region extensions/browser/src/browser/profile-capabilities.d.ts
type BrowserProfileMode =
  | "local-managed"
  | "local-existing-session"
  | "local-extension"
  | "remote-cdp";
type BrowserProfileCapabilities = {
  mode: BrowserProfileMode;
  isRemote: boolean /** Profile uses the Chrome DevTools MCP server (existing-session driver). */;
  usesChromeMcp: boolean;
  usesPersistentPlaywright: boolean;
  supportsPerTabWs: boolean;
  supportsJsonTabEndpoints: boolean;
  supportsReset: boolean;
  supportsManagedTabLimit: boolean;
};
/** Return feature capabilities for a resolved browser profile. */
declare function getBrowserProfileCapabilities(
  profile: ResolvedBrowserProfile,
): BrowserProfileCapabilities;
//#endregion
//#region extensions/browser/src/browser-proxy-envelope.d.ts
type BrowserProxyFile = {
  path: string;
  base64: string;
  mimeType?: string;
};
//#endregion
//#region extensions/browser/src/browser/proxy-files.d.ts
/** Persist proxy-returned files and return a remote-path to local-path map. */
declare function persistBrowserProxyFiles(
  files: BrowserProxyFile[] | undefined,
): Promise<Map<string, string>>;
/** Rewrite every supported result path that points at a persisted proxy file. */
declare function applyBrowserProxyPaths(result: unknown, mapping: Map<string, string>): void;
//#endregion
//#region extensions/browser/src/browser-tool.d.ts
/** Create the Browser tool exposed to agents. */
declare function createBrowserTool(opts?: {
  sandboxBridgeUrl?: string;
  allowHostControl?: boolean;
  agentSessionKey?: string;
  agentDir?: string;
  workspaceDir?: string;
  activeModel?: {
    provider?: string;
    model?: string;
  };
  mediaScope?: {
    sessionKey?: string;
    channel?: string;
    chatType?: string;
  };
}): AnyAgentTool;
//#endregion
//#region extensions/browser/src/node-host/invoke-browser.d.ts
/** Executes a serialized browser.proxy command and returns a serialized result payload. */
declare function runBrowserProxyCommand(paramsJSON?: string | null): Promise<string>;
//#endregion
//#region extensions/browser/src/browser/request-policy.d.ts
type BrowserRequestProfileParams = {
  query?: Record<string, unknown>;
  body?: unknown;
  profile?: string | null;
};
/** Normalizes route paths so mutation-policy checks compare stable slash forms. */
declare function normalizeBrowserRequestPath(value: string): string;
/** Returns true when a control request mutates persistent browser profile state. */
declare function isPersistentBrowserProfileMutation(method: string, path: string): boolean;
/** Resolves the requested profile from query, body, or route defaults. */
declare function resolveRequestedBrowserProfile(
  params: BrowserRequestProfileParams,
): string | undefined;
//#endregion
//#region extensions/browser/src/browser-control-state.d.ts
declare function getBrowserControlState(): BrowserServerState | null;
/** Create a route context bound to the current shared browser runtime. */
declare function createBrowserControlContext(): BrowserRouteContext;
//#endregion
//#region extensions/browser/src/control-service.d.ts
/** Starts Browser control without binding the HTTP server when config enables it. */
declare function startBrowserControlServiceFromConfig(): Promise<BrowserServerState | null>;
/** Stops the in-process Browser control service runtime. */
declare function stopBrowserControlService(): Promise<void>;
//#endregion
//#region extensions/browser/src/browser/runtime-lifecycle.d.ts
type CreateBrowserRuntimeStateParams = {
  resolved: BrowserServerState["resolved"];
  port: number;
  server?: Server | null;
  onWarn: (message: string) => void;
};
/** Creates Browser server state and starts runtime-wide cleanup handlers. */
declare function createBrowserRuntimeState(
  params: CreateBrowserRuntimeStateParams,
): Promise<BrowserServerState>;
/** Stops Browser profiles, the optional HTTP server, and loaded Playwright state. */
type StopBrowserRuntimeParams = {
  current: BrowserServerState | null /** Public API compatibility; cleanup is intentionally pinned to `current`. */;
  getState: () => BrowserServerState | null;
  clearState: () => void;
  closeServer?: boolean;
  onWarn: (message: string) => void;
};
/** Stops Browser profiles, the optional HTTP server, and loaded Playwright state. */
declare function stopBrowserRuntime(params: StopBrowserRuntimeParams): Promise<void>;
//#endregion
//#region extensions/browser/src/browser/routes/types.d.ts
/**
 * Minimal browser route HTTP types.
 *
 * Keeps route modules decoupled from Express-specific request/response types so
 * the same handlers can run through HTTP and in-process dispatch.
 */
/** Request shape consumed by browser route handlers. */
type BrowserRequest = {
  params: Record<string, string>;
  query: Record<string, unknown>;
  body?: unknown;
  /**
   * Optional abort signal for in-process dispatch. This lets callers enforce
   * timeouts and (where supported) cancel long-running operations.
   */
  signal?: AbortSignal;
};
/** Response shape used by browser route handlers. */
type BrowserResponse = {
  status: (code: number) => BrowserResponse;
  json: (body: unknown) => void;
};
/** Async route handler signature shared by HTTP and in-process dispatch. */
type BrowserRouteHandler = (req: BrowserRequest, res: BrowserResponse) => void | Promise<void>;
/** Minimal registrar interface implemented by HTTP and test dispatchers. */
type BrowserRouteRegistrar = {
  get: (path: string, handler: BrowserRouteHandler) => void;
  post: (path: string, handler: BrowserRouteHandler) => void;
  delete: (path: string, handler: BrowserRouteHandler) => void;
};
//#endregion
//#region extensions/browser/src/browser/routes/index.d.ts
/** Register every browser control route group. */
declare function registerBrowserRoutes(app: BrowserRouteRegistrar, ctx: BrowserRouteContext): void;
//#endregion
//#region extensions/browser/src/browser/routes/dispatcher.d.ts
type BrowserDispatchRequest = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  signal?: AbortSignal;
};
type BrowserDispatchResponse = {
  status: number;
  body: unknown;
};
/** Create an in-process dispatcher for registered browser routes. */
declare function createBrowserRouteDispatcher(ctx: BrowserRouteContext): {
  dispatch: (req: BrowserDispatchRequest) => Promise<BrowserDispatchResponse>;
};
//#endregion
//#region extensions/browser/src/browser/server-middleware.d.ts
/** Installs common Browser control-server middleware. */
declare function installBrowserCommonMiddleware(app: Express): void;
/** Installs optional token/password auth for Browser control-server requests. */
declare function installBrowserAuthMiddleware(
  app: Express,
  auth: {
    token?: string;
    password?: string;
  },
): void;
//#endregion
//#region extensions/browser/src/browser/form-fields.d.ts
type BrowserFormFieldValue = NonNullable<BrowserFormField["value"]>;
/** Normalize a form field value to the types accepted by fill actions. */
declare function normalizeBrowserFormFieldValue(value: unknown): BrowserFormFieldValue | undefined;
/** Normalize one form field descriptor from untrusted route/tool input. */
declare function normalizeBrowserFormField(
  record: Record<string, unknown>,
): BrowserFormField | null;
//#endregion
//#region extensions/browser/src/gateway/browser-request.d.ts
/** Handles one browser.request gateway call and streams a success/error response. */
declare function handleBrowserGatewayRequest({
  params,
  respond,
  context,
}: Parameters<GatewayRequestHandlers["browser.request"]>[0]): Promise<void>;
/** Gateway request handler map contributed by the Browser plugin. */
declare const browserHandlers: GatewayRequestHandlers;
//#endregion
//#region extensions/browser/src/plugin-service.d.ts
/** Creates the Browser plugin service registered by the plugin entrypoint. */
declare function createBrowserPluginService(): OpenClawPluginService;
//#endregion
export {
  BrowserFormField as $,
  browserCloseTab as A,
  browserStatus as B,
  persistBrowserProxyFiles as C,
  BrowserResetProfileResult as D,
  BrowserDeleteProfileResult as E,
  browserOpenTab as F,
  BrowserDoctorReport as G,
  browserTabAction as H,
  browserProfiles as I,
  browserAct as J,
  browserConsoleMessages as K,
  browserResetProfile as L,
  browserDeleteProfile as M,
  browserDoctor as N,
  ProfileStatus as O,
  browserFocusTab as P,
  browserScreenshotAction as Q,
  browserSnapshot as R,
  applyBrowserProxyPaths as S,
  BrowserCreateProfileResult as T,
  browserTabs as U,
  browserStop as V,
  BrowserDoctorCheck as W,
  browserArmFileChooser as X,
  browserArmDialog as Y,
  browserNavigate as Z,
  isPersistentBrowserProfileMutation as _,
  normalizeBrowserFormFieldValue as a,
  runBrowserProxyCommand as b,
  createBrowserRouteDispatcher as c,
  createBrowserRuntimeState as d,
  stopBrowserRuntime as f,
  getBrowserControlState as g,
  createBrowserControlContext as h,
  normalizeBrowserFormField as i,
  browserCreateProfile as j,
  SnapshotResult as k,
  registerBrowserRoutes as l,
  stopBrowserControlService as m,
  browserHandlers as n,
  installBrowserAuthMiddleware as o,
  startBrowserControlServiceFromConfig as p,
  browserPdfSave as q,
  handleBrowserGatewayRequest as r,
  installBrowserCommonMiddleware as s,
  createBrowserPluginService as t,
  BrowserRouteRegistrar as u,
  normalizeBrowserRequestPath as v,
  getBrowserProfileCapabilities as w,
  createBrowserTool as x,
  resolveRequestedBrowserProfile as y,
  browserStart as z,
};
