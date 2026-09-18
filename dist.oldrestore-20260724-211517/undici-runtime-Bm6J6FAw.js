import { readFileSync } from "node:fs";
import fs$1 from "node:fs/promises";
import { createRequire } from "node:module";
import * as net$1 from "node:net";
import net from "node:net";
import { t as addActiveManagedProxyTlsOptions } from "./managed-proxy-undici-BZ0Vz-Ui.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/wsl.ts
let wslCached = null;
/** Clears the cached async WSL detection result between isolated tests. */
function resetWSLStateForTests() {
  wslCached = null;
}
/** Detects WSL from environment variables without touching the filesystem. */
function isWSLEnv(env = process.env) {
  if (env.WSL_INTEROP || env.WSL_DISTRO_NAME || env.WSLENV) return true;
  return false;
}
/**
 * Synchronously detects WSL from env vars first, then `/proc/version`.
 */
function isWSLSync() {
  if (process.platform !== "linux") return false;
  if (isWSLEnv()) return true;
  try {
    const release = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
    return release.includes("microsoft") || release.includes("wsl");
  } catch {
    return false;
  }
}
/**
 * Synchronously detects WSL2 from kernel-version markers after WSL detection.
 */
function isWSL2Sync() {
  if (!isWSLSync()) return false;
  try {
    const version = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
    return version.includes("wsl2") || version.includes("microsoft-standard");
  } catch {
    return false;
  }
}
/** Asynchronously detects WSL from env vars and `/proc/sys/kernel/osrelease`, with process cache. */
async function isWSL() {
  if (wslCached !== null) return wslCached;
  if (process.platform !== "linux") {
    wslCached = false;
    return wslCached;
  }
  if (isWSLEnv()) {
    wslCached = true;
    return wslCached;
  }
  try {
    const release = normalizeLowercaseStringOrEmpty(
      await fs$1.readFile("/proc/sys/kernel/osrelease", "utf8"),
    );
    wslCached = release.includes("microsoft") || release.includes("wsl");
  } catch {
    wslCached = false;
  }
  return wslCached;
}
//#endregion
//#region src/infra/net/undici-family-policy.ts
const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
/** Resolves the process default autoSelectFamily policy, with WSL2 forced to IPv4. */
function resolveUndiciAutoSelectFamily() {
  if (typeof net$1.getDefaultAutoSelectFamily !== "function") return;
  try {
    const systemDefault = net$1.getDefaultAutoSelectFamily();
    if (systemDefault && isWSL2Sync()) return false;
    return systemDefault;
  } catch {
    return;
  }
}
/** Converts an autoSelectFamily decision into the undici connect option shape. */
function createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily) {
  if (autoSelectFamily === void 0) return;
  return {
    autoSelectFamily,
    autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS,
  };
}
/** Returns shared undici connect options for dispatchers that do not override them. */
function resolveUndiciAutoSelectFamilyConnectOptions() {
  return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}
/**
 * Temporarily applies an undici family decision around synchronous setup code.
 * Restore is best-effort because older Node runtimes may not expose the setters.
 */
function withTemporaryUndiciAutoSelectFamily(autoSelectFamily, run) {
  if (
    autoSelectFamily === void 0 ||
    typeof net$1.getDefaultAutoSelectFamily !== "function" ||
    typeof net$1.setDefaultAutoSelectFamily !== "function"
  )
    return run();
  let previous;
  try {
    previous = net$1.getDefaultAutoSelectFamily();
    net$1.setDefaultAutoSelectFamily(autoSelectFamily);
  } catch {
    return run();
  }
  try {
    return run();
  } finally {
    try {
      net$1.setDefaultAutoSelectFamily(previous);
    } catch {}
  }
}
//#endregion
//#region src/infra/net/undici-runtime.ts
const TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
const requireUndici = createRequire(import.meta.url);
const HTTP1_ONLY_DISPATCHER_OPTIONS = Object.freeze({ allowH2: false });
function applyMissingConnectOptions(connect, defaults) {
  for (const [key, value] of Object.entries(defaults)) if (!(key in connect)) connect[key] = value;
}
function loadUndiciModule(requiredExports) {
  const override = globalThis[TEST_UNDICI_RUNTIME_DEPS_KEY];
  if (isRecord(override) && requiredExports.every((key) => typeof override[key] === "function"))
    return override;
  return requireUndici("undici");
}
function stripIpServernameFromConnectOptions(options) {
  if (!isRecord(options) || typeof options.servername !== "string") return options;
  const servername = options.servername.replace(/^\[|\]$/g, "");
  if (net.isIP(servername) === 0) return options;
  const next = { ...options };
  delete next.servername;
  return next;
}
function stripIpServernameFromConnect(connect) {
  if (typeof connect !== "function") return connect;
  return (options, callback) => connect(stripIpServernameFromConnectOptions(options), callback);
}
function createIpSafeProxyClientFactory() {
  return (origin, options) => {
    const { Pool } = loadUndiciModule(["Pool"]);
    return new Pool(
      origin,
      isRecord(options)
        ? {
            ...options,
            connect: stripIpServernameFromConnect(options.connect),
          }
        : options,
    );
  };
}
function addIpSafeProxyClientFactory(options) {
  if ("clientFactory" in options) return options;
  return {
    ...options,
    clientFactory: createIpSafeProxyClientFactory(),
  };
}
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
function loadUndiciRuntimeDeps() {
  return loadUndiciModule(["Agent", "EnvHttpProxyAgent", "ProxyAgent", "fetch"]);
}
/** Loads only the undici global-dispatcher API used by startup proxy setup. */
function loadUndiciGlobalDispatcherDeps() {
  return loadUndiciModule([
    "Agent",
    "EnvHttpProxyAgent",
    "getGlobalDispatcher",
    "setGlobalDispatcher",
  ]);
}
function withHttp1OnlyDispatcherOptions(options, timeoutMs, applyTo) {
  const base = {};
  if (options) Object.assign(base, options);
  Object.assign(base, HTTP1_ONLY_DISPATCHER_OPTIONS);
  const baseRecord = base;
  const targets = applyTo ?? { connect: true };
  const autoSelectConnect = resolveUndiciAutoSelectFamilyConnectOptions();
  if (autoSelectConnect && targets.connect && typeof baseRecord.connect !== "function") {
    const connect = isRecord(baseRecord.connect) ? baseRecord.connect : {};
    applyMissingConnectOptions(connect, autoSelectConnect);
    baseRecord.connect = connect;
  }
  if (autoSelectConnect && targets.proxyTls) {
    const proxyTls = isRecord(baseRecord.proxyTls) ? baseRecord.proxyTls : {};
    applyMissingConnectOptions(proxyTls, autoSelectConnect);
    baseRecord.proxyTls = proxyTls;
  }
  if (timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0) {
    const normalizedTimeoutMs = Math.floor(timeoutMs);
    baseRecord.bodyTimeout = normalizedTimeoutMs;
    baseRecord.headersTimeout = normalizedTimeoutMs;
    if (targets.connect && typeof baseRecord.connect !== "function")
      baseRecord.connect = {
        ...(isRecord(baseRecord.connect) ? baseRecord.connect : {}),
        timeout: normalizedTimeoutMs,
      };
    if (targets.proxyTls)
      baseRecord.proxyTls = {
        ...(isRecord(baseRecord.proxyTls) ? baseRecord.proxyTls : {}),
        timeout: normalizedTimeoutMs,
      };
  }
  return base;
}
/** Creates a direct undici Agent with OpenClaw's HTTP/1-only dispatcher policy. */
function createHttp1Agent(options, timeoutMs) {
  const { Agent } = loadUndiciRuntimeDeps();
  return new Agent(withHttp1OnlyDispatcherOptions(options, timeoutMs));
}
/**
 * Creates an EnvHttpProxyAgent with OpenClaw proxy TLS, IP-safe proxy pools,
 * timeout propagation, and HTTP/1-only dispatch.
 */
function createHttp1EnvHttpProxyAgent(options, timeoutMs) {
  const { EnvHttpProxyAgent } = loadUndiciRuntimeDeps();
  return new EnvHttpProxyAgent(
    withHttp1OnlyDispatcherOptions(
      addIpSafeProxyClientFactory(addActiveManagedProxyTlsOptions(options) ?? {}),
      timeoutMs,
      {
        connect: true,
        proxyTls: true,
      },
    ),
  );
}
/**
 * Creates a fixed ProxyAgent with the same HTTP/1, managed TLS, timeout, and
 * IP-safe proxy connection policy used by env proxy dispatchers.
 */
function createHttp1ProxyAgent(options, timeoutMs) {
  const { ProxyAgent } = loadUndiciRuntimeDeps();
  return new ProxyAgent(
    withHttp1OnlyDispatcherOptions(
      addIpSafeProxyClientFactory(
        addActiveManagedProxyTlsOptions(
          typeof options === "string" || options instanceof URL
            ? { uri: options.toString() }
            : { ...options },
        ),
      ),
      timeoutMs,
      { proxyTls: true },
    ),
  );
}
//#endregion
export {
  loadUndiciRuntimeDeps as a,
  withTemporaryUndiciAutoSelectFamily as c,
  isWSLEnv as d,
  isWSLSync as f,
  loadUndiciGlobalDispatcherDeps as i,
  isWSL as l,
  createHttp1EnvHttpProxyAgent as n,
  createUndiciAutoSelectFamilyConnectOptions as o,
  resetWSLStateForTests as p,
  createHttp1ProxyAgent as r,
  resolveUndiciAutoSelectFamily as s,
  createHttp1Agent as t,
  isWSL2Sync as u,
};
