import { C as BrowserProfileUnavailableError } from "./cdp.helpers-ChuUODxP.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import {
  r as stopBrowserRuntime,
  t as createBrowserRuntimeState,
} from "./runtime-lifecycle-9c50Fgrr.js";
import "./config-CzdiqFrD.js";
import { t as createBrowserRouteContext } from "./server-context-CkNNtaOz.js";
import { s as isBrowserRuntimeRunning } from "./server-context.lifecycle-CPismpkV.js";
//#region extensions/browser/src/browser-control-state.ts
let state = null;
let owner = null;
let lifecycleTail = Promise.resolve();
let completedEffectiveStops = 0;
/** Serialize complete Browser runtime start/stop workflows. */
function enqueueBrowserControlLifecycle(run) {
  const result = lifecycleTail.then(run, run);
  lifecycleTail = result.then(
    () => {},
    () => {},
  );
  return result;
}
/** Queue startup, but never turn a request made during shutdown into a post-stop restart. */
function withBrowserControlStart(run) {
  const effectiveStopsAtRequest = completedEffectiveStops;
  return enqueueBrowserControlLifecycle(() => {
    if (
      completedEffectiveStops !== effectiveStopsAtRequest ||
      (state ? !isBrowserRuntimeRunning(state) : false)
    )
      throw new BrowserProfileUnavailableError("Browser runtime is stopping.");
    return run();
  });
}
function getBrowserControlState() {
  return state && isBrowserRuntimeRunning(state) ? state : null;
}
/** Create a route context bound to the current shared browser runtime. */
function createBrowserControlContext() {
  return createBrowserRouteContext({
    getState: () => state,
    refreshConfigFromDisk: true,
  });
}
/**
 * Start or attach the shared runtime. Call only from a queued `withBrowserControlStart` entry.
 */
async function ensureBrowserControlRuntime(params) {
  if (state && isBrowserRuntimeRunning(state)) {
    if (params.server) {
      state.server = params.server;
      state.port = params.port;
      state.resolved = {
        ...params.resolved,
        controlPort: params.port,
      };
      owner = "server";
    }
    return state;
  }
  if (state)
    throw new BrowserProfileUnavailableError("Browser runtime cleanup must finish before restart.");
  state = await createBrowserRuntimeState({
    server: params.server ?? null,
    port: params.port,
    resolved: params.resolved,
    onWarn: params.onWarn,
  });
  owner = params.owner;
  return state;
}
/** Stop the shared browser runtime when the requesting owner is allowed to do so. */
function stopBrowserControlRuntime(params) {
  return enqueueBrowserControlLifecycle(async () => {
    const current = state;
    if (!current) return null;
    if (params.requestedBy === "service" && current.server && owner === "server") return null;
    await stopBrowserRuntime({
      current,
      getState: () => state,
      clearState: () => {
        state = null;
        owner = null;
      },
      closeServer: params.closeServer,
      onWarn: params.onWarn,
    });
    completedEffectiveStops += 1;
    return current;
  });
}
//#endregion
//#region extensions/browser/src/plugin-enabled.ts
/** Returns whether the bundled Browser plugin is effectively enabled by config. */
function isDefaultBrowserPluginEnabled(cfg) {
  return resolveEffectiveEnableState({
    id: "browser",
    origin: "bundled",
    config: normalizePluginsConfig(cfg.plugins),
    rootConfig: cfg,
    enabledByDefault: true,
  }).enabled;
}
//#endregion
export {
  stopBrowserControlRuntime as a,
  getBrowserControlState as i,
  createBrowserControlContext as n,
  withBrowserControlStart as o,
  ensureBrowserControlRuntime as r,
  isDefaultBrowserPluginEnabled as t,
};
