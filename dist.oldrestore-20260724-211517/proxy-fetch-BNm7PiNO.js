import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import {
  n as resolveManagedEnvHttpProxyAgentOptions,
  t as addActiveManagedProxyTlsOptions,
} from "./managed-proxy-undici-BZ0Vz-Ui.js";
import { t as fetchWithPreparedRuntimeDispatcher } from "./runtime-fetch-0IXFHW_8.js";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-Bm6J6FAw.js";
//#region src/infra/net/proxy-fetch.ts
/** Non-enumerable marker used to recover the explicit proxy URL from proxy fetch wrappers. */
const PROXY_FETCH_PROXY_URL = Symbol.for("openclaw.proxyFetch.proxyUrl");
/**
 * Create a fetch function that routes requests through the given HTTP proxy.
 * Uses undici's ProxyAgent under the hood.
 */
function makeProxyFetch(proxyUrl) {
  const runtimeDeps = loadUndiciRuntimeDeps();
  const { ProxyAgent } = runtimeDeps;
  let agent = null;
  const resolveAgent = () => {
    if (!agent) agent = new ProxyAgent(addActiveManagedProxyTlsOptions({ uri: proxyUrl }));
    return agent;
  };
  const proxyFetch = (input, init) =>
    fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, {
      ...init,
      dispatcher: resolveAgent(),
    });
  Object.defineProperty(proxyFetch, PROXY_FETCH_PROXY_URL, {
    value: proxyUrl,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return proxyFetch;
}
/** Return the explicit proxy URL attached by {@link makeProxyFetch}, if present. */
function getProxyUrlFromFetch(fetchImpl) {
  const proxyUrl = fetchImpl?.[PROXY_FETCH_PROXY_URL];
  if (typeof proxyUrl !== "string") return;
  const trimmed = proxyUrl.trim();
  return trimmed ? trimmed : void 0;
}
/**
 * Resolve a proxy-aware fetch from standard environment variables.
 * Respects NO_PROXY / no_proxy exclusions via undici's EnvHttpProxyAgent.
 * Returns undefined when no proxy is configured.
 * Gracefully returns undefined if the proxy URL is malformed.
 */
function resolveProxyFetchFromEnv(env = process.env) {
  const proxyOptions = resolveManagedEnvHttpProxyAgentOptions(env);
  if (!proxyOptions) return;
  try {
    const runtimeDeps = loadUndiciRuntimeDeps();
    const { EnvHttpProxyAgent } = runtimeDeps;
    const agent = new EnvHttpProxyAgent(proxyOptions);
    return (input, init) =>
      fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, {
        ...init,
        dispatcher: agent,
      });
  } catch (err) {
    logWarn(
      `Proxy env var set but agent creation failed — falling back to direct fetch: ${formatErrorMessage(err)}`,
    );
    return;
  }
}
//#endregion
export {
  resolveProxyFetchFromEnv as i,
  getProxyUrlFromFetch as n,
  makeProxyFetch as r,
  PROXY_FETCH_PROXY_URL as t,
};
