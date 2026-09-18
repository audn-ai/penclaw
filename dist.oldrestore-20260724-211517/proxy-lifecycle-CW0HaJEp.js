import { installGlobalProxy } from "@openclaw/proxyline";
import {
  a as stopActiveManagedProxyRegistration,
  i as registerActiveManagedProxyUrl,
  r as getActiveManagedProxyUrl,
  t as getActiveManagedProxyLoopbackMode,
} from "./active-proxy-state-DJLhrP_Z.js";
import { f as isLoopbackIpAddress } from "./ip-CyyRxPli.js";
import { a as logWarn, r as logInfo } from "./logger-BegyOJlO.js";
import {
  a as loadManagedProxyTlsOptionsSync,
  i as loadManagedProxyTlsOptions,
  o as resolveManagedProxyCaFileForUrl,
} from "./managed-proxy-undici-BZ0Vz-Ui.js";
import { a as forceResetGlobalDispatcher } from "./undici-global-dispatcher-BoVfmODy.js";
import { i as isWebSocketUrl, n as isHttpUrl } from "./url-protocol-oWYinajA.js";
//#region src/infra/net/proxy/proxy-lifecycle.ts
const PROXY_ENV_KEYS = ["http_proxy", "https_proxy", "HTTP_PROXY", "HTTPS_PROXY"];
const NO_PROXY_ENV_KEYS = ["no_proxy", "NO_PROXY"];
const PROXY_ACTIVE_KEYS = [
  "OPENCLAW_PROXY_ACTIVE",
  "OPENCLAW_PROXY_LOOPBACK_MODE",
  "OPENCLAW_PROXY_CA_FILE",
];
const ALL_PROXY_ENV_KEYS = [...PROXY_ENV_KEYS, ...NO_PROXY_ENV_KEYS, ...PROXY_ACTIVE_KEYS];
let baseProxyEnvSnapshot = null;
let proxylineHandle = null;
const MANAGED_PROXY_UNDICI_OPTIONS = Object.freeze({ allowH2: false });
/** Resets process-wide proxy lifecycle state between tests that share a worker. */
function resetProxyLifecycleForTests() {
  baseProxyEnvSnapshot = null;
  proxylineHandle?.stop();
  proxylineHandle = null;
}
function captureProxyEnv() {
  return {
    http_proxy: process.env["http_proxy"],
    https_proxy: process.env["https_proxy"],
    HTTP_PROXY: process.env["HTTP_PROXY"],
    HTTPS_PROXY: process.env["HTTPS_PROXY"],
    no_proxy: process.env["no_proxy"],
    NO_PROXY: process.env["NO_PROXY"],
    OPENCLAW_PROXY_ACTIVE: process.env["OPENCLAW_PROXY_ACTIVE"],
    OPENCLAW_PROXY_LOOPBACK_MODE: process.env["OPENCLAW_PROXY_LOOPBACK_MODE"],
    OPENCLAW_PROXY_CA_FILE: process.env["OPENCLAW_PROXY_CA_FILE"],
  };
}
function injectProxyEnv(proxyUrl, loopbackMode, proxyCaFile) {
  const snapshot = captureProxyEnv();
  applyProxyEnv(proxyUrl, loopbackMode, proxyCaFile);
  return snapshot;
}
function applyProxyEnv(proxyUrl, loopbackMode, proxyCaFile) {
  for (const key of PROXY_ENV_KEYS) process.env[key] = proxyUrl;
  process.env["OPENCLAW_PROXY_ACTIVE"] = "1";
  process.env["OPENCLAW_PROXY_LOOPBACK_MODE"] = loopbackMode;
  if (proxyCaFile) process.env["OPENCLAW_PROXY_CA_FILE"] = proxyCaFile;
  else delete process.env["OPENCLAW_PROXY_CA_FILE"];
  for (const key of NO_PROXY_ENV_KEYS) process.env[key] = "";
}
function restoreProxyEnv(snapshot) {
  for (const key of ALL_PROXY_ENV_KEYS) {
    const value = snapshot[key];
    if (value === void 0) delete process.env[key];
    else process.env[key] = value;
  }
}
function restoreInactiveProxyRuntime(snapshot) {
  try {
    proxylineHandle?.stop();
  } catch (err) {
    logWarn(`proxy: failed to stop Proxyline: ${String(err)}`);
  }
  proxylineHandle = null;
  restoreProxyEnv(snapshot);
  forceResetGlobalDispatcher();
  ensureInheritedManagedProxyRoutingActive();
}
function restoreAfterFailedProxyActivation(restoreSnapshot) {
  restoreInactiveProxyRuntime(restoreSnapshot);
  baseProxyEnvSnapshot = null;
}
function stopActiveProxyRegistration(registration) {
  if (registration.stopped) return;
  stopActiveManagedProxyRegistration(registration);
  if (getActiveManagedProxyUrl()) return;
  const restoreSnapshot = baseProxyEnvSnapshot ?? captureProxyEnv();
  baseProxyEnvSnapshot = null;
  restoreInactiveProxyRuntime(restoreSnapshot);
}
function resolveProxyUrl(config) {
  const candidate = config?.proxyUrl?.trim() || process.env["OPENCLAW_PROXY_URL"]?.trim();
  if (!candidate)
    throw new Error(
      "proxy: enabled but no HTTP proxy URL is configured; set proxy.proxyUrl or OPENCLAW_PROXY_URL to an http:// or https:// forward proxy.",
    );
  if (!isHttpUrl(candidate))
    throw new Error(
      "proxy: enabled but proxy URL is invalid; set proxy.proxyUrl or OPENCLAW_PROXY_URL to an http:// or https:// forward proxy.",
    );
  return candidate;
}
function redactProxyUrlForLog(value) {
  try {
    return new URL(value).origin;
  } catch {
    return "<invalid proxy URL>";
  }
}
/** Reinstalls Proxyline routing in child processes that inherited active proxy env. */
function ensureInheritedManagedProxyRoutingActive() {
  if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") return;
  const proxyUrl = process.env["HTTP_PROXY"];
  if (!proxyUrl || !isHttpUrl(proxyUrl)) return;
  const proxyTls = loadManagedProxyTlsOptionsSync(
    resolveManagedProxyCaFileForUrl({
      proxyUrl,
      caFileOverride: process.env["OPENCLAW_PROXY_CA_FILE"],
    }),
  );
  proxylineHandle = installGlobalProxy({
    mode: "managed",
    proxyUrl,
    ...(proxyTls ? { proxyTls } : {}),
    ifActive: "reuse-compatible",
    undici: MANAGED_PROXY_UNDICI_OPTIONS,
  });
  forceResetGlobalDispatcher({ preserveProxylineManaged: true });
}
/** Starts process-wide managed proxy routing and returns the owner stop handle. */
async function startProxy(config) {
  if (config?.enabled !== true) return null;
  const proxyUrl = resolveProxyUrl(config);
  const loopbackMode = config.loopbackMode ?? "gateway-only";
  const proxyCaFile = resolveManagedProxyCaFileForUrl({
    proxyUrl,
    config,
  });
  const proxyTls = await loadManagedProxyTlsOptions(proxyCaFile);
  if (getActiveManagedProxyUrl()) {
    const registration = registerActiveManagedProxyUrl(new URL(proxyUrl), {
      loopbackMode,
      proxyTls,
    });
    return {
      proxyUrl,
      stop: async () => {
        stopActiveProxyRegistration(registration);
      },
      kill: () => {
        stopActiveProxyRegistration(registration);
      },
    };
  }
  baseProxyEnvSnapshot ??= captureProxyEnv();
  const lifecycleBaseEnvSnapshot = baseProxyEnvSnapshot;
  let registration = null;
  try {
    injectProxyEnv(proxyUrl, loopbackMode, proxyCaFile);
    proxylineHandle = installGlobalProxy({
      mode: "managed",
      proxyUrl,
      ...(proxyTls ? { proxyTls } : {}),
      ifActive: "replace",
      undici: MANAGED_PROXY_UNDICI_OPTIONS,
    });
    forceResetGlobalDispatcher({ preserveProxylineManaged: true });
    registration = registerActiveManagedProxyUrl(new URL(proxyUrl), {
      loopbackMode,
      proxyTls,
    });
  } catch (err) {
    if (registration) stopActiveManagedProxyRegistration(registration);
    restoreAfterFailedProxyActivation(lifecycleBaseEnvSnapshot);
    throw new Error(`proxy: failed to activate external proxy routing: ${String(err)}`, {
      cause: err,
    });
  }
  logInfo(
    `proxy: routing process HTTP traffic through external proxy ${redactProxyUrlForLog(proxyUrl)}`,
  );
  return {
    proxyUrl,
    stop: async () => {
      if (registration) stopActiveProxyRegistration(registration);
    },
    kill: () => {
      if (registration) stopActiveProxyRegistration(registration);
    },
  };
}
/** Stops a managed proxy handle if one was started. */
async function stopProxy(handle) {
  if (!handle) return;
  await handle.stop();
}
function parseGatewayControlPlaneUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
function getGatewayControlPlaneBypassAuthority(value) {
  const url = parseGatewayControlPlaneUrl(value);
  if (
    url === null ||
    (!isHttpUrl(url) && !isWebSocketUrl(url)) ||
    !isGatewayControlPlaneLoopbackHost(url.hostname)
  )
    return null;
  return url.port ? `${url.hostname}:${url.port}` : url.hostname;
}
/** Registers a temporary direct route for trusted Gateway loopback control-plane URLs. */
function registerManagedProxyGatewayLoopbackBypass(url) {
  if (!getGatewayControlPlaneBypassAuthority(url)) return;
  const loopbackMode = getActiveManagedProxyLoopbackMode();
  if (loopbackMode === "block")
    throw new Error(
      "proxy: Gateway loopback control-plane connections are blocked by proxy.loopbackMode",
    );
  if (loopbackMode === "proxy") return;
  return proxylineHandle?.registerBypass({ url });
}
function isGatewayControlPlaneLoopbackHost(hostname) {
  return (
    hostname.trim().toLowerCase().replace(/\.+$/, "") === "localhost" ||
    isLoopbackIpAddress(hostname)
  );
}
/**
 * Carve out the operator-managed external proxy for the Browser plugin's
 * loopback CDP probe to a Chromium instance OpenClaw spawned itself.
 *
 * The managed proxy installs a process-wide undici dispatcher that would
 * otherwise route `http://127.0.0.1:<cdpPort>/json/version` and the
 * `ws://127.0.0.1:<cdpPort>/devtools/...` upgrade through the external
 * forward proxy, which returns 502 because nothing on the proxy listens for
 * the loopback CDP port. The bypass restores direct loopback delivery for
 * the duration the caller holds the returned `unregister` callback.
 *
 * Loopback-gated by structure: non-loopback authorities (e.g. an `attachOnly`
 * profile pointing at a remote CDP service like Browserless/Browserbase) are
 * not bypassed and continue to traverse the external proxy as configured.
 *
 * Honors `proxy.loopbackMode`:
 * - `gateway-only` (default): register the bypass.
 * - `proxy`: do not bypass — operator opted into proxy-everything routing.
 * - `block`: throw — operator forbids loopback IPC under managed proxy.
 *
 * Note: A loopback `attachOnly` profile whose `cdpUrl` is e.g.
 * `http://127.0.0.1:<port>` would also satisfy this gate. This mirrors the
 * structural semantics of `registerManagedProxyGatewayLoopbackBypass` —
 * loopback IPC on this host is assumed to be operator-trusted.
 */
function registerManagedProxyBrowserCdpBypass(url) {
  if (!getGatewayControlPlaneBypassAuthority(url)) return;
  const loopbackMode = getActiveManagedProxyLoopbackMode();
  if (loopbackMode === "block")
    throw new Error("proxy: Browser loopback CDP connections are blocked by proxy.loopbackMode");
  if (loopbackMode === "proxy") return;
  return proxylineHandle?.registerBypass({ url });
}
//#endregion
export {
  startProxy as a,
  resetProxyLifecycleForTests as i,
  registerManagedProxyBrowserCdpBypass as n,
  stopProxy as o,
  registerManagedProxyGatewayLoopbackBypass as r,
  ensureInheritedManagedProxyRoutingActive as t,
};
