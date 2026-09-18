import {
  n as stopBrowserBridgeServer,
  t as startBrowserBridgeServer,
} from "../../bridge-server-D-TAwppC.js";
import { t as registerBrowserCli } from "../../browser-cli-C2xYXnxs.js";
import { n as redactCdpUrl } from "../../browser-config-BYZ1IWa3.js";
import {
  i as resolveGoogleChromeExecutableForPlatform,
  n as readBrowserVersion,
  t as parseBrowserMajorVersion,
} from "../../chrome.executables-3W0Qoqc0.js";
import {
  a as resolveProfile,
  c as DEFAULT_UPLOAD_DIR,
  r as resolveBrowserConfig,
} from "../../config-CzdiqFrD.js";
import {
  d as DEFAULT_OPENCLAW_BROWSER_COLOR,
  n as DEFAULT_AI_SNAPSHOT_MAX_CHARS,
  o as DEFAULT_BROWSER_EVALUATE_ENABLED,
  p as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
} from "../../constants-C2_ZjRRD.js";
import {
  n as resolveBrowserControlAuth,
  t as ensureBrowserControlAuth,
} from "../../control-auth-BvDcTJb9.js";
import {
  n as stopBrowserControlService,
  t as startBrowserControlServiceFromConfig,
} from "../../control-service-B9nZG5m4.js";
import {
  a as browserPdfSave,
  c as browserArmFileChooser,
  d as browserScreenshotAction,
  i as browserConsoleMessages,
  n as applyBrowserProxyPaths,
  o as browserAct,
  r as persistBrowserProxyFiles,
  s as browserArmDialog,
  t as runBrowserProxyCommand,
  u as browserNavigate,
} from "../../core-api-l2pOnPUn.js";
import {
  a as resolveRequestedBrowserProfile,
  i as normalizeBrowserRequestPath,
  r as isPersistentBrowserProfileMutation,
  t as createBrowserRouteDispatcher,
} from "../../dispatcher-DYywQike.js";
import { d as resolveExistingPathsWithinRoot } from "../../fs-safe-RNq3oO57.js";
import {
  i as getBrowserControlState,
  n as createBrowserControlContext,
} from "../../plugin-enabled-C1NU0TDI.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import {
  i as createBrowserTool,
  n as browserHandlers,
  r as handleBrowserGatewayRequest,
  t as createBrowserPluginService,
} from "../../plugin-service-qhBQDK9i.js";
import { t as registerBrowserRoutes } from "../../routes-FohuCP_M.js";
import {
  r as stopBrowserRuntime,
  t as createBrowserRuntimeState,
} from "../../runtime-lifecycle-9c50Fgrr.js";
import { t as createBrowserRouteContext } from "../../server-context-CkNNtaOz.js";
import { g as getBrowserProfileCapabilities } from "../../server-context.lifecycle-CPismpkV.js";
import {
  n as installBrowserAuthMiddleware,
  r as installBrowserCommonMiddleware,
} from "../../server-middleware-Bz0JpPpu.js";
import {
  _ as browserStatus,
  a as untrackSessionBrowserTab,
  b as browserTabAction,
  c as browserDeleteProfile,
  f as browserOpenTab,
  g as browserStart,
  h as browserSnapshot,
  i as trackSessionBrowserTab,
  l as browserDoctor,
  m as browserResetProfile,
  o as browserCloseTab,
  p as browserProfiles,
  s as browserCreateProfile,
  t as closeTrackedBrowserTabsForSessions,
  u as browserFocusTab,
  v as browserStop,
  x as browserTabs,
} from "../../session-tab-registry-RbALbK2T.js";
import {
  c as normalizeBrowserFormFieldValue,
  s as normalizeBrowserFormField,
} from "../../snapshot-urls-UoxUrSeb.js";
import { t as movePathToTrash } from "../../trash-DGM0lK0C.js";
export {
  DEFAULT_AI_SNAPSHOT_MAX_CHARS,
  DEFAULT_BROWSER_EVALUATE_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_COLOR,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
  DEFAULT_UPLOAD_DIR,
  applyBrowserProxyPaths,
  browserAct,
  browserArmDialog,
  browserArmFileChooser,
  browserCloseTab,
  browserConsoleMessages,
  browserCreateProfile,
  browserDeleteProfile,
  browserDoctor,
  browserFocusTab,
  browserHandlers,
  browserNavigate,
  browserOpenTab,
  browserPdfSave,
  browserProfiles,
  browserResetProfile,
  browserScreenshotAction,
  browserSnapshot,
  browserStart,
  browserStatus,
  browserStop,
  browserTabAction,
  browserTabs,
  closeTrackedBrowserTabsForSessions,
  createBrowserControlContext,
  createBrowserPluginService,
  createBrowserRouteContext,
  createBrowserRouteDispatcher,
  createBrowserRuntimeState,
  createBrowserTool,
  definePluginEntry,
  ensureBrowserControlAuth,
  getBrowserControlState,
  getBrowserProfileCapabilities,
  handleBrowserGatewayRequest,
  installBrowserAuthMiddleware,
  installBrowserCommonMiddleware,
  isPersistentBrowserProfileMutation,
  movePathToTrash,
  normalizeBrowserFormField,
  normalizeBrowserFormFieldValue,
  normalizeBrowserRequestPath,
  parseBrowserMajorVersion,
  persistBrowserProxyFiles,
  readBrowserVersion,
  redactCdpUrl,
  registerBrowserCli,
  registerBrowserRoutes,
  resolveBrowserConfig,
  resolveBrowserControlAuth,
  resolveExistingPathsWithinRoot,
  resolveGoogleChromeExecutableForPlatform,
  resolveProfile,
  resolveRequestedBrowserProfile,
  runBrowserProxyCommand,
  startBrowserBridgeServer,
  startBrowserControlServiceFromConfig,
  stopBrowserBridgeServer,
  stopBrowserControlService,
  stopBrowserRuntime,
  trackSessionBrowserTab,
  untrackSessionBrowserTab,
};
