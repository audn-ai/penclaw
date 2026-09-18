import { randomUUID } from "node:crypto";
import path from "node:path";
import process$1 from "node:process";
import { createAmbientNodeProxyAgent } from "@openclaw/proxyline";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
//#region src/proxy-capture/paths.ts
function resolveDebugProxyRootDir(env = process.env) {
  return path.join(resolveStateDir(env), "debug-proxy");
}
/** @deprecated Capture storage now lives in the shared state database. */
function resolveDebugProxyDbPath(env = process.env) {
  return path.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}
/** @deprecated Capture payloads now live in the shared state database. */
function resolveDebugProxyBlobDir(env = process.env) {
  return path.join(resolveDebugProxyRootDir(env), "blobs");
}
function resolveDebugProxyCertDir(env = process.env) {
  return path.join(resolveDebugProxyRootDir(env), "certs");
}
//#endregion
//#region src/proxy-capture/env.ts
const OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
const OPENCLAW_DEBUG_PROXY_URL = "OPENCLAW_DEBUG_PROXY_URL";
/** @deprecated Capture storage now lives in the shared state database. */
const OPENCLAW_DEBUG_PROXY_DB_PATH = "OPENCLAW_DEBUG_PROXY_DB_PATH";
/** @deprecated Capture payloads now live in the shared state database. */
const OPENCLAW_DEBUG_PROXY_BLOB_DIR = "OPENCLAW_DEBUG_PROXY_BLOB_DIR";
const OPENCLAW_DEBUG_PROXY_CERT_DIR = "OPENCLAW_DEBUG_PROXY_CERT_DIR";
const OPENCLAW_DEBUG_PROXY_SESSION_ID = "OPENCLAW_DEBUG_PROXY_SESSION_ID";
const OPENCLAW_DEBUG_PROXY_REQUIRE = "OPENCLAW_DEBUG_PROXY_REQUIRE";
let cachedImplicitSessionId;
function isTruthy(value) {
  return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveDebugProxySettings(env = process$1.env) {
  const enabled = isTruthy(env[OPENCLAW_DEBUG_PROXY_ENABLED]);
  const sessionId =
    (env["OPENCLAW_DEBUG_PROXY_SESSION_ID"]?.trim() || void 0) ??
    (cachedImplicitSessionId ??= randomUUID());
  return {
    enabled,
    required: isTruthy(env[OPENCLAW_DEBUG_PROXY_REQUIRE]),
    proxyUrl: env[OPENCLAW_DEBUG_PROXY_URL]?.trim() || void 0,
    dbPath: env[OPENCLAW_DEBUG_PROXY_DB_PATH]?.trim() || resolveDebugProxyDbPath(env),
    blobDir: env[OPENCLAW_DEBUG_PROXY_BLOB_DIR]?.trim() || resolveDebugProxyBlobDir(env),
    certDir: env[OPENCLAW_DEBUG_PROXY_CERT_DIR]?.trim() || resolveDebugProxyCertDir(env),
    sessionId,
    sourceProcess: "openclaw",
  };
}
function applyDebugProxyEnv(env, params) {
  const baseEnv = { ...env };
  delete baseEnv.OPENCLAW_DEBUG_PROXY_DB_PATH;
  delete baseEnv.OPENCLAW_DEBUG_PROXY_BLOB_DIR;
  return {
    ...baseEnv,
    [OPENCLAW_DEBUG_PROXY_ENABLED]: "1",
    [OPENCLAW_DEBUG_PROXY_REQUIRE]: "1",
    [OPENCLAW_DEBUG_PROXY_URL]: params.proxyUrl,
    [OPENCLAW_DEBUG_PROXY_CERT_DIR]: params.certDir ?? resolveDebugProxyCertDir(env),
    [OPENCLAW_DEBUG_PROXY_SESSION_ID]: params.sessionId,
    HTTP_PROXY: params.proxyUrl,
    HTTPS_PROXY: params.proxyUrl,
    ALL_PROXY: params.proxyUrl,
  };
}
function createDebugProxyWebSocketAgent(settings) {
  if (!settings.enabled || !settings.proxyUrl) return;
  return createAmbientNodeProxyAgent({
    protocol: "https",
    env: {
      HTTP_PROXY: settings.proxyUrl,
      HTTPS_PROXY: settings.proxyUrl,
      ALL_PROXY: void 0,
      NO_PROXY: void 0,
      http_proxy: void 0,
      https_proxy: void 0,
      all_proxy: void 0,
      no_proxy: void 0,
    },
  });
}
function resolveEffectiveDebugProxyUrl(configuredProxyUrl) {
  const explicit = configuredProxyUrl?.trim();
  if (explicit) return explicit;
  const settings = resolveDebugProxySettings();
  return settings.enabled ? settings.proxyUrl : void 0;
}
//#endregion
export {
  resolveEffectiveDebugProxyUrl as i,
  createDebugProxyWebSocketAgent as n,
  resolveDebugProxySettings as r,
  applyDebugProxyEnv as t,
};
