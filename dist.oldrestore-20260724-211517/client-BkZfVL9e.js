import fs from "node:fs";
import path from "node:path";
import {
  n as normalizeDeviceAuthScopes,
  t as normalizeDeviceAuthRole,
} from "./device-auth-C-STNejO.js";
import {
  o as publicKeyRawBase64UrlFromPem,
  r as loadOrCreateDeviceIdentity,
  s as signDevicePayload,
} from "./device-identity-BmJfeLuX.js";
import { t as normalizeFingerprint } from "./fingerprint-BRiEKKMN.js";
import { n as logError, t as logDebug } from "./logger-BegyOJlO.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { n as privateFileStoreSync } from "./private-file-store-BSksaLX_.js";
import {
  r as registerManagedProxyGatewayLoopbackBypass,
  t as ensureInheritedManagedProxyRoutingActive,
} from "./proxy-lifecycle-CW0HaJEp.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import { t as GatewayClient$1 } from "./src-BOx4iLSi.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/shared/device-auth-store.ts
function coerceDeviceAuthEntry(role, value) {
  if (!isRecord(value) || typeof value.token !== "string") return null;
  const updatedAtMs =
    typeof value.updatedAtMs === "number" && Number.isFinite(value.updatedAtMs)
      ? value.updatedAtMs
      : 0;
  return {
    token: value.token,
    role,
    scopes: normalizeDeviceAuthScopes(Array.isArray(value.scopes) ? value.scopes : void 0),
    updatedAtMs,
  };
}
function copyCanonicalDeviceAuthTokens(tokens) {
  const out = {};
  for (const [rawRole, value] of Object.entries(tokens)) {
    const role = normalizeDeviceAuthRole(rawRole);
    if (!role) continue;
    const entry = coerceDeviceAuthEntry(role, value);
    if (entry) out[role] = entry;
  }
  return out;
}
/** Coerces raw persisted device-auth JSON into the current canonical store shape. */
function coerceDeviceAuthStore(value) {
  if (!isRecord(value) || value.version !== 1 || typeof value.deviceId !== "string") return null;
  if (!isRecord(value.tokens)) return null;
  return {
    version: 1,
    deviceId: value.deviceId,
    tokens: copyCanonicalDeviceAuthTokens(value.tokens),
  };
}
/** Load one normalized role token, ignoring stores bound to a different gateway device id. */
function loadDeviceAuthTokenFromStore(params) {
  const store = params.adapter.readStore();
  if (!store || store.deviceId !== params.deviceId) return null;
  const role = normalizeDeviceAuthRole(params.role);
  return coerceDeviceAuthEntry(role, store.tokens[role]);
}
/** Store one role token while preserving canonical tokens for the same gateway device id. */
function storeDeviceAuthTokenInStore(params) {
  const role = normalizeDeviceAuthRole(params.role);
  const existing = params.adapter.readStore();
  const next = {
    version: 1,
    deviceId: params.deviceId,
    tokens:
      existing && existing.deviceId === params.deviceId && existing.tokens
        ? copyCanonicalDeviceAuthTokens(existing.tokens)
        : {},
  };
  const entry = {
    token: params.token,
    role,
    scopes: normalizeDeviceAuthScopes(params.scopes),
    updatedAtMs: Date.now(),
  };
  next.tokens[role] = entry;
  params.adapter.writeStore(next);
  return entry;
}
/** Clear one normalized role token without rewriting missing or wrong-device stores. */
function clearDeviceAuthTokenFromStore(params) {
  const store = params.adapter.readStore();
  if (!store || store.deviceId !== params.deviceId) return;
  const role = normalizeDeviceAuthRole(params.role);
  if (!store.tokens[role]) return;
  const next = {
    version: 1,
    deviceId: store.deviceId,
    tokens: copyCanonicalDeviceAuthTokens(store.tokens),
  };
  delete next.tokens[role];
  params.adapter.writeStore(next);
}
//#endregion
//#region src/infra/device-auth-store.ts
const DEVICE_AUTH_FILE = "device-auth.json";
const storeReadCache = /* @__PURE__ */ new Map();
function storeCacheHit(cached, stat) {
  return cached !== void 0 && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size;
}
function resolveDeviceAuthPath(env = process.env) {
  return path.join(resolveStateDir(env), "identity", DEVICE_AUTH_FILE);
}
function readStore(filePath) {
  try {
    let stat = null;
    try {
      stat = fs.statSync(filePath);
    } catch {
      const cached = storeReadCache.get(filePath);
      if (cached?.mtimeMs === -1 && cached.size === -1) return cached.store;
      storeReadCache.set(filePath, {
        store: null,
        mtimeMs: -1,
        size: -1,
      });
      return null;
    }
    const cached = storeReadCache.get(filePath);
    if (cached !== void 0 && storeCacheHit(cached, stat)) return cached.store;
    const store = coerceDeviceAuthStore(
      privateFileStoreSync(path.dirname(filePath)).readJsonIfExists(path.basename(filePath)),
    );
    storeReadCache.set(filePath, {
      store,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
    });
    return store;
  } catch {
    return null;
  }
}
function writeStore(filePath, store) {
  privateFileStoreSync(path.dirname(filePath)).writeJson(path.basename(filePath), store, {
    trailingNewline: true,
  });
  try {
    const stat = fs.statSync(filePath);
    storeReadCache.set(filePath, {
      store,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
    });
  } catch {
    storeReadCache.delete(filePath);
  }
}
/** Load a cached device-auth token from the configured OpenClaw state directory. */
function loadDeviceAuthToken(params) {
  const filePath = resolveDeviceAuthPath(params.env);
  return loadDeviceAuthTokenFromStore({
    adapter: {
      readStore: () => readStore(filePath),
      writeStore: (_store) => {},
    },
    deviceId: params.deviceId,
    role: params.role,
  });
}
/** Persist or replace one device-auth role token in the private state directory. */
function storeDeviceAuthToken(params) {
  const filePath = resolveDeviceAuthPath(params.env);
  return storeDeviceAuthTokenInStore({
    adapter: {
      readStore: () => readStore(filePath),
      writeStore: (store) => writeStore(filePath, store),
    },
    deviceId: params.deviceId,
    role: params.role,
    token: params.token,
    scopes: params.scopes,
  });
}
/** Remove one role token for the current gateway device from the private state directory. */
function clearDeviceAuthToken(params) {
  const filePath = resolveDeviceAuthPath(params.env);
  clearDeviceAuthTokenFromStore({
    adapter: {
      readStore: () => readStore(filePath),
      writeStore: (store) => writeStore(filePath, store),
    },
    deviceId: params.deviceId,
    role: params.role,
  });
}
//#endregion
//#region src/gateway/client.ts
function createOpenClawGatewayClientHostDeps(overrides) {
  return {
    loadOrCreateDeviceIdentity,
    signDevicePayload,
    publicKeyRawBase64UrlFromPem,
    loadDeviceAuthToken,
    storeDeviceAuthToken,
    clearDeviceAuthToken,
    beforeConnect: ensureInheritedManagedProxyRoutingActive,
    registerGatewayLoopbackBypass: registerManagedProxyGatewayLoopbackBypass,
    normalizeTlsFingerprint: (fingerprint) => normalizeFingerprint(fingerprint ?? ""),
    logDebug,
    logError,
    redactForLog: redactToolPayloadText,
    ...overrides,
  };
}
var GatewayClient = class {
  #client;
  constructor(opts) {
    this.#client = new GatewayClient$1({
      ...opts,
      clientVersion: opts.clientVersion ?? VERSION,
      hostDeps: createOpenClawGatewayClientHostDeps(opts.hostDeps),
    });
  }
  start() {
    this.#client.start();
  }
  stop() {
    this.#client.stop();
  }
  stopAndWait(opts) {
    return this.#client.stopAndWait(opts);
  }
  request(method, params, opts) {
    return this.#client.request(method, params, opts);
  }
  getConnectionMetadata() {
    return this.#client.getConnectionMetadata();
  }
};
//#endregion
export { loadDeviceAuthToken as n, GatewayClient as t };
