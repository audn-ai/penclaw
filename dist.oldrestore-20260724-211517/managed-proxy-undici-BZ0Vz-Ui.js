import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import {
  n as getActiveManagedProxyTlsOptions,
  r as getActiveManagedProxyUrl,
} from "./active-proxy-state-DJLhrP_Z.js";
import {
  o as resolveEnvHttpProxyAgentOptions,
  s as resolveEnvHttpProxyUrl,
} from "./proxy-env-5nRGQyQD.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/infra/net/proxy/proxy-tls.ts
function normalizeOptionalPath(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function formatReadError(err) {
  return err instanceof Error ? err.message : String(err);
}
function isHttpsProxyUrl(value) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
/** Resolves the configured managed proxy CA file, with env/CLI override first. */
function resolveManagedProxyCaFile(params) {
  return (
    normalizeOptionalPath(params.caFileOverride) ??
    normalizeOptionalPath(params.config?.tls?.caFile)
  );
}
/** Returns a CA file only for HTTPS proxy URLs; HTTP proxies do not need TLS trust. */
function resolveManagedProxyCaFileForUrl(params) {
  if (!isHttpsProxyUrl(params.proxyUrl)) return;
  return resolveManagedProxyCaFile({
    config: params.config,
    caFileOverride: params.caFileOverride,
  });
}
/** Loads managed proxy TLS options asynchronously for startup paths. */
async function loadManagedProxyTlsOptions(caFile) {
  if (!caFile) return;
  try {
    return { ca: await readFile(caFile, "utf8") };
  } catch (err) {
    throw new Error(`proxy CA file could not be read (${caFile}): ${formatReadError(err)}`, {
      cause: err,
    });
  }
}
/** Loads managed proxy TLS options synchronously for inherited child-process routing. */
function loadManagedProxyTlsOptionsSync(caFile) {
  if (!caFile) return;
  try {
    return { ca: readFileSync(caFile, "utf8") };
  } catch (err) {
    throw new Error(`proxy CA file could not be read (${caFile}): ${formatReadError(err)}`, {
      cause: err,
    });
  }
}
//#endregion
//#region src/infra/net/proxy/active-managed-proxy-tls.ts
const MANAGED_PROXY_ENV_PREFIX = ["OPENCLAW", "PROXY"].join("_");
const MANAGED_PROXY_ACTIVE_ENV_KEY = `${MANAGED_PROXY_ENV_PREFIX}_ACTIVE`;
const MANAGED_PROXY_CA_FILE_ENV_KEY = `${MANAGED_PROXY_ENV_PREFIX}_CA_FILE`;
function normalizeProxyUrl(value) {
  if (!value) return;
  try {
    return new URL(value).href;
  } catch {
    return;
  }
}
function resolveManagedProxyUrl(env = process.env) {
  const activeProxyUrl = getActiveManagedProxyUrl();
  if (activeProxyUrl) return activeProxyUrl.href;
  if (env[MANAGED_PROXY_ACTIVE_ENV_KEY] !== "1") return;
  return normalizeProxyUrl(resolveEnvHttpProxyUrl("https", env));
}
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
function resolveActiveManagedProxyTlsOptions(params) {
  const env = params?.env ?? process.env;
  const managedProxyUrl = resolveManagedProxyUrl(env);
  const targetProxyUrl = normalizeProxyUrl(
    params?.proxyUrl ?? resolveEnvHttpProxyUrl("https", env),
  );
  if (!managedProxyUrl || targetProxyUrl !== managedProxyUrl) return;
  const activeProxyTls = getActiveManagedProxyTlsOptions();
  if (activeProxyTls) return activeProxyTls;
  const proxyCaFile = resolveManagedProxyCaFileForUrl({
    proxyUrl: managedProxyUrl,
    caFileOverride: env[MANAGED_PROXY_CA_FILE_ENV_KEY],
  });
  try {
    return loadManagedProxyTlsOptionsSync(proxyCaFile);
  } catch {
    return;
  }
}
//#endregion
//#region src/infra/net/proxy/managed-proxy-undici.ts
function readProxyTlsRecord(options) {
  if (!options || !("proxyTls" in options)) return;
  return isRecord(options.proxyTls) ? options.proxyTls : void 0;
}
function readProxyUrlFromOptions(options) {
  if (!options) return;
  if ("uri" in options) {
    const uri = Reflect.get(options, "uri");
    return uri instanceof URL ? uri.href : typeof uri === "string" ? uri : void 0;
  }
  if ("httpsProxy" in options || "httpProxy" in options) {
    const httpsProxy = Reflect.get(options, "httpsProxy");
    const httpProxy = Reflect.get(options, "httpProxy");
    return typeof httpsProxy === "string"
      ? httpsProxy
      : typeof httpProxy === "string"
        ? httpProxy
        : void 0;
  }
}
function addActiveManagedProxyTlsOptions(options, params) {
  const proxyTls = resolveActiveManagedProxyTlsOptions({
    proxyUrl: readProxyUrlFromOptions(options),
    env: params?.env,
  });
  if (!proxyTls) return options;
  const existingProxyTls = readProxyTlsRecord(options);
  return {
    ...options,
    proxyTls: {
      ...proxyTls,
      ...existingProxyTls,
    },
  };
}
/** Resolves env proxy options with managed proxy TLS attached when applicable. */
function resolveManagedEnvHttpProxyAgentOptions(env = process.env) {
  return addActiveManagedProxyTlsOptions(resolveEnvHttpProxyAgentOptions(env), { env });
}
//#endregion
export {
  loadManagedProxyTlsOptionsSync as a,
  loadManagedProxyTlsOptions as i,
  resolveManagedEnvHttpProxyAgentOptions as n,
  resolveManagedProxyCaFileForUrl as o,
  resolveActiveManagedProxyTlsOptions as r,
  addActiveManagedProxyTlsOptions as t,
};
