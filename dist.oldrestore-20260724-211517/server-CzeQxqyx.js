import express from "express";
import { r as resolveBrowserConfig } from "./config-CzdiqFrD.js";
import {
  n as resolveBrowserControlAuth,
  r as shouldAutoGenerateBrowserAuth,
  t as ensureBrowserControlAuth,
} from "./control-auth-BvDcTJb9.js";
import "./bounded-utf8-tail-zGgVhmwV.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./config-B4sqH_Om.js";
import {
  a as stopBrowserControlRuntime,
  i as getBrowserControlState,
  n as createBrowserControlContext,
  o as withBrowserControlStart,
  r as ensureBrowserControlRuntime,
  t as isDefaultBrowserPluginEnabled,
} from "./plugin-enabled-C1NU0TDI.js";
import { t as registerBrowserRoutes } from "./routes-FohuCP_M.js";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-CkNNtaOz.js";
import {
  n as installBrowserAuthMiddleware,
  r as installBrowserCommonMiddleware,
} from "./server-middleware-Bz0JpPpu.js";
import {
  D as setBridgeAuthForPort,
  E as deleteBridgeAuthForPort,
} from "./session-tab-registry-RbALbK2T.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region extensions/browser/src/server.ts
const logServer = createSubsystemLogger("browser").child("server");
async function startBrowserControlServerUnlocked() {
  const current = getBrowserControlState();
  if (current?.server) return current;
  const cfg = getRuntimeConfig();
  const browserCfg = loadBrowserConfigForRuntimeRefresh();
  if (!isDefaultBrowserPluginEnabled(browserCfg)) return null;
  const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
  if (!resolved.enabled) return null;
  let browserAuth = resolveBrowserControlAuth(cfg);
  let browserAuthBootstrapFailed = false;
  try {
    const ensured = await ensureBrowserControlAuth({ cfg });
    browserAuth = ensured.auth;
    if (ensured.generatedToken)
      logServer.info(
        "No browser auth configured; generated browser control auth credential automatically.",
      );
  } catch (err) {
    logServer.warn(`failed to auto-configure browser auth: ${String(err)}`);
    browserAuthBootstrapFailed = true;
  }
  if (
    (browserAuthBootstrapFailed || shouldAutoGenerateBrowserAuth(process.env)) &&
    !browserAuth.token &&
    !browserAuth.password
  ) {
    if (browserAuthBootstrapFailed)
      logServer.error(
        "browser control startup aborted: authentication bootstrap failed and no fallback auth is configured.",
      );
    else logServer.error("browser control startup aborted: no authentication configured.");
    return null;
  }
  const app = express();
  installBrowserCommonMiddleware(app);
  installBrowserAuthMiddleware(app, browserAuth);
  registerBrowserRoutes(app, createBrowserControlContext());
  const port = resolved.controlPort;
  const server = await new Promise((resolve, reject) => {
    const s = app.listen(port, "127.0.0.1", () => resolve(s));
    s.once("error", reject);
  }).catch((err) => {
    logServer.error(`openclaw browser server failed to bind 127.0.0.1:${port}: ${String(err)}`);
    return null;
  });
  if (!server) return null;
  let state;
  try {
    state = await ensureBrowserControlRuntime({
      server,
      port,
      resolved,
      owner: "server",
      onWarn: (message) => logServer.warn(message),
    });
  } catch (err) {
    await new Promise((resolve) => {
      server.close(() => resolve());
    });
    throw err;
  }
  setBridgeAuthForPort(port, browserAuth);
  const authMode = browserAuth.token ? "token" : browserAuth.password ? "password" : "off";
  logServer.info(`Browser control listening on http://127.0.0.1:${port}/ (auth=${authMode})`);
  return state;
}
/** Starts the Browser control HTTP server from runtime config. */
async function startBrowserControlServerFromConfig() {
  return await withBrowserControlStart(startBrowserControlServerUnlocked);
}
/** Stops the Browser control HTTP server and unregisters bridge auth. */
async function stopBrowserControlServer() {
  const stopped = await stopBrowserControlRuntime({
    requestedBy: "server",
    closeServer: true,
    onWarn: (message) => logServer.warn(message),
  });
  if (stopped?.port) deleteBridgeAuthForPort(stopped.port);
}
//#endregion
export { startBrowserControlServerFromConfig, stopBrowserControlServer };
