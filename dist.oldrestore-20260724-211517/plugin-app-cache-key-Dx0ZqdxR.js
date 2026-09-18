import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { m as resolveCodexAppServerUserHomeDir } from "./config-C1imjxk6.js";
import { u as readPluginPackageVersion } from "./extension-shared-DqZe9psR.js";
import { t as log } from "./logger-C5RMMskO.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  S as resolveDateTimestampMs,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { A as resolveCodexAppServerHomeDir } from "./shared-client-a36Mluj-.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region extensions/codex/src/app-server/app-inventory-cache.ts
/**
 * Process-local cache for Codex app-server app inventories, keyed by runtime
 * identity and safe to refresh in the background.
 */
/** Default app inventory cache freshness window. */
const CODEX_APP_INVENTORY_CACHE_TTL_MS = 3600 * 1e3;
const CODEX_TARGETED_APP_INVENTORY_LIMIT = 1e3;
const MAX_SERIALIZED_ERROR_MESSAGE_LENGTH = 500;
/** In-memory app inventory cache with coalesced refreshes per key. */
var CodexAppInventoryCache = class {
  constructor(options = {}) {
    this.entries = /* @__PURE__ */ new Map();
    this.inFlight = /* @__PURE__ */ new Map();
    this.refreshTokens = /* @__PURE__ */ new Map();
    this.diagnostics = /* @__PURE__ */ new Map();
    this.revision = 0;
    this.ttlMs = options.ttlMs ?? CODEX_APP_INVENTORY_CACHE_TTL_MS;
  }
  /** Reads a snapshot and schedules refresh when missing, stale, or forced. */
  read(params) {
    const nowMs = resolveDateTimestampMs(params.nowMs);
    const entry = this.entries.get(params.key);
    if (!entry) {
      const refreshScheduled = params.suppressRefresh ? false : this.scheduleRefresh(params);
      return {
        state: "missing",
        key: params.key,
        revision: this.revision,
        refreshScheduled,
        ...(this.diagnostics.get(params.key)
          ? { diagnostic: this.diagnostics.get(params.key) }
          : {}),
      };
    }
    const state =
      entry.invalidated || !isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })
        ? "stale"
        : "fresh";
    const refreshScheduled =
      state === "fresh" && !params.forceRefetch ? false : this.scheduleRefresh(params);
    return {
      state,
      key: params.key,
      revision: entry.revision,
      snapshot: stripEntryState(entry),
      refreshScheduled,
      ...(entry.lastError ? { diagnostic: entry.lastError } : {}),
    };
  }
  /** Forces or joins an immediate refresh for a cache key. */
  refreshNow(params) {
    return this.refresh(params);
  }
  /** Marks a key stale and records the reason as a diagnostic. */
  invalidate(key, reason, nowMs = Date.now()) {
    this.revision += 1;
    const diagnostic = {
      message: reason,
      atMs: nowMs,
    };
    const entry = this.entries.get(key);
    if (entry) {
      entry.invalidated = true;
      entry.lastError = diagnostic;
      entry.revision = this.revision;
    } else this.diagnostics.set(key, diagnostic);
    return this.revision;
  }
  /** Clears all cached snapshots, diagnostics, in-flight requests, and revision state. */
  clear() {
    this.entries.clear();
    this.inFlight.clear();
    this.refreshTokens.clear();
    this.diagnostics.clear();
    this.revision = 0;
  }
  /** Returns the monotonically increasing cache revision. */
  getRevision() {
    return this.revision;
  }
  scheduleRefresh(params) {
    if (this.inFlight.has(params.key) && !params.forceRefetch) return true;
    const promise = this.refresh(params);
    this.inFlight.set(params.key, promise);
    promise.catch(() => void 0);
    return true;
  }
  async refresh(params) {
    const existing = this.inFlight.get(params.key);
    if (existing && !params.forceRefetch) return existing;
    const refreshToken = (this.refreshTokens.get(params.key) ?? 0) + 1;
    this.refreshTokens.set(params.key, refreshToken);
    const promise = this.refreshUncoalesced(params, refreshToken);
    this.inFlight.set(params.key, promise);
    try {
      return await promise;
    } finally {
      if (this.inFlight.get(params.key) === promise) this.inFlight.delete(params.key);
    }
  }
  async refreshUncoalesced(params, refreshToken) {
    const nowMs = resolveDateTimestampMs(params.nowMs);
    try {
      const apps = await listAllApps(
        params.request,
        params.forceRefetch ?? false,
        params.targetAppIds,
      );
      this.revision += 1;
      const expiresAtMs = resolveExpiresAtMsFromDurationMs(this.ttlMs, { nowMs }) ?? 0;
      const snapshot = {
        key: params.key,
        apps,
        fetchedAtMs: nowMs,
        expiresAtMs,
        revision: this.revision,
      };
      if (this.refreshTokens.get(params.key) === refreshToken) {
        this.entries.set(params.key, {
          ...snapshot,
          invalidated: false,
        });
        this.diagnostics.delete(params.key);
      }
      return snapshot;
    } catch (error) {
      const diagnostic = {
        message: sanitizeErrorMessage(error instanceof Error ? error.message : String(error)),
        atMs: nowMs,
      };
      this.diagnostics.set(params.key, diagnostic);
      const entry = this.entries.get(params.key);
      if (entry) entry.lastError = diagnostic;
      log.warn("codex app inventory refresh failed", {
        forceRefetch: params.forceRefetch === true,
        keyFingerprint: fingerprintInventoryCacheKey(params.key),
        error: serializeCodexAppInventoryError(error),
      });
      throw error;
    }
  }
};
/** Serializes a refresh failure without leaking large or sensitive error data. */
function serializeCodexAppInventoryError(error) {
  const record = isRecord(error) ? error : void 0;
  const data = record && "data" in record ? redactErrorData(record.data) : void 0;
  return {
    name:
      error instanceof Error ? error.name : typeof record?.name === "string" ? record.name : void 0,
    message: sanitizeErrorMessage(error instanceof Error ? error.message : String(error)),
    ...(typeof record?.code === "number" ? { code: record.code } : {}),
    ...(data !== void 0 ? { data } : {}),
  };
}
/** Shared app inventory cache used by Codex app-server runtime paths. */
const defaultCodexAppInventoryCache = new CodexAppInventoryCache();
/** Builds a stable cache key from build versions and runtime identity fields. */
function buildCodexAppInventoryCacheKey(input, openClawVersion, codexPluginVersion) {
  return JSON.stringify({
    openClawVersion,
    codexPluginVersion,
    codexHome: input.codexHome ?? null,
    endpoint: input.endpoint ?? null,
    runtimeIdentity: normalizeRuntimeIdentityForCacheKey(input.runtimeIdentity),
    authProfileId: input.authProfileId ?? null,
    accountId: input.accountId ?? null,
    envApiKeyFingerprint: input.envApiKeyFingerprint ?? null,
    appServerVersion: input.appServerVersion ?? null,
  });
}
function normalizeRuntimeIdentityForCacheKey(value) {
  if (!value) return null;
  const entries = Object.entries(value)
    .flatMap(([key, rawValue]) => {
      const normalized = rawValue?.trim();
      return normalized ? [[key, normalized]] : [];
    })
    .toSorted(([left], [right]) => left.localeCompare(right));
  return entries.length > 0 ? Object.fromEntries(entries) : null;
}
async function listAllApps(request, forceRefetch, targetAppIds = []) {
  const apps = [];
  const targetIds = new Set(targetAppIds.filter(Boolean));
  const remainingTargetIds = new Set(targetIds);
  const seenCursors = /* @__PURE__ */ new Set();
  let cursor;
  do {
    const response = await request("app/list", {
      cursor,
      limit: targetIds.size > 0 ? CODEX_TARGETED_APP_INVENTORY_LIMIT : 100,
      forceRefetch,
    });
    apps.push(...response.data);
    for (const app of response.data) remainingTargetIds.delete(app.id);
    if (targetIds.size > 0 && remainingTargetIds.size === 0) break;
    cursor = response.nextCursor;
    if (cursor && seenCursors.has(cursor))
      throw new Error(`app/list returned repeated cursor ${cursor}`);
    if (cursor) seenCursors.add(cursor);
  } while (cursor);
  return apps;
}
function stripEntryState(entry) {
  const { invalidated: _invalidated, ...snapshot } = entry;
  return snapshot;
}
function fingerprintInventoryCacheKey(key) {
  let hash = 0;
  for (let index = 0; index < key.length; index += 1)
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  return hash.toString(16).padStart(8, "0");
}
function truncateSerializedErrorText(value) {
  return value.length > MAX_SERIALIZED_ERROR_MESSAGE_LENGTH
    ? `${truncateUtf16Safe(value, MAX_SERIALIZED_ERROR_MESSAGE_LENGTH)}...`
    : value;
}
function redactErrorData(value, depth = 0) {
  if (value === void 0) return;
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (depth > 6) return "[truncated]";
  if (Array.isArray(value)) return value.map((entry) => redactErrorData(entry, depth + 1) ?? null);
  if (isRecord(value)) {
    const redacted = {};
    for (const [key, entry] of Object.entries(value))
      redacted[key] = isSensitiveErrorDataKey(key)
        ? "<redacted>"
        : (redactErrorData(entry, depth + 1) ?? null);
    return redacted;
  }
  if (typeof value === "string") return truncateSerializedErrorText(value);
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "symbol")
    return value.description ? `Symbol(${value.description})` : "Symbol()";
  if (typeof value === "function") return value.name ? `[function ${value.name}]` : "[function]";
  return "[unserializable]";
}
function sanitizeErrorMessage(message) {
  const htmlStart = message.search(/<html[\s>]/i);
  return truncateSerializedErrorText(
    (htmlStart >= 0
      ? `${message.slice(0, htmlStart).trimEnd()} [HTML response body omitted]`
      : message
    ).replace(
      /([?&][^=\s"'<>]*(?:api[_-]?key|authorization|cookie|credential|password|secret|token|tk)[^=\s"'<>]*=)[^&\s"'<>]+/gi,
      "$1<redacted>",
    ),
  );
}
function isSensitiveErrorDataKey(key) {
  return /api[_-]?key|authorization|cookie|credential|password|secret|token/i.test(key);
}
//#endregion
//#region extensions/codex/src/app-server/plugin-app-cache-key.ts
/**
 * Builds stable Codex plugin/app inventory cache keys from app-server startup,
 * auth, account, and version inputs without storing secret material.
 */
const CODEX_PLUGIN_VERSION = readPluginPackageVersion({ require: createRequire(import.meta.url) });
/** Builds the full app inventory cache key for Codex plugin/app discovery. */
function buildCodexPluginAppCacheKey(params) {
  return buildCodexAppInventoryCacheKey(
    {
      codexHome:
        params.runtimeIdentity?.codexHome ??
        resolveCodexPluginAppCacheCodexHome(params.appServer, params.agentDir),
      endpoint: resolveCodexPluginAppCacheEndpoint(params.appServer),
      authProfileId: params.authProfileId,
      accountId: params.accountId,
      envApiKeyFingerprint: params.envApiKeyFingerprint,
      appServerVersion: params.appServerVersion ?? params.runtimeIdentity?.serverVersion,
      runtimeIdentity: params.runtimeIdentity,
    },
    VERSION,
    CODEX_PLUGIN_VERSION,
  );
}
/** Builds a durable thread-binding fingerprint for one initialized app-server runtime. */
function buildCodexAppServerRuntimeFingerprint(params) {
  return JSON.stringify({
    endpoint: resolveCodexPluginAppCacheEndpoint(params.appServer),
    connectionClass: params.appServer.connectionClass,
    remoteWorkspaceRoot: params.appServer.remoteWorkspaceRoot ?? null,
    appServerVersion: params.appServerVersion ?? params.runtimeIdentity?.serverVersion ?? null,
    runtimeIdentity: params.runtimeIdentity ?? null,
  });
}
/** Fingerprints the configured connection that owns a supervised source thread. */
function buildCodexAppServerConnectionFingerprint(appServer, agentDir) {
  return JSON.stringify({
    endpoint: resolveCodexPluginAppCacheEndpoint(appServer),
    connectionClass: appServer.connectionClass,
    remoteWorkspaceRoot: appServer.remoteWorkspaceRoot ?? null,
    homeScope: appServer.start.homeScope ?? null,
    codexHome: resolveCodexAppServerConnectionHome(appServer.start, agentDir),
    cwd: appServer.start.cwd ?? null,
  });
}
function resolveCodexAppServerConnectionHome(start, agentDir) {
  const configured = start.env?.CODEX_HOME?.trim();
  if (configured) return configured;
  if (start.transport === "unix" && (!start.url || start.url === "unix://"))
    return resolveCodexAppServerUserHomeDir(start.env ?? process.env);
  if (start.transport !== "stdio") return null;
  if (start.homeScope === "user") return resolveCodexAppServerUserHomeDir(process.env);
  return agentDir ? resolveCodexAppServerHomeDir(agentDir) : null;
}
/** Serializes app-server endpoint identity, including credential fingerprints. */
function resolveCodexPluginAppCacheEndpoint(appServer) {
  return JSON.stringify({
    transport: appServer.start.transport,
    command: appServer.start.command,
    args: appServer.start.args,
    url: appServer.start.url ?? null,
    credentialFingerprint: fingerprintCodexPluginAppCacheCredentials(appServer.start),
  });
}
/** Resolves the CODEX_HOME value that scopes local app-server inventory. */
function resolveCodexPluginAppCacheCodexHome(appServer, agentDir) {
  const configuredCodexHome = appServer.start.env?.CODEX_HOME?.trim();
  if (configuredCodexHome) return configuredCodexHome;
  return appServer.start.transport === "stdio" && agentDir
    ? resolveCodexAppServerHomeDir(agentDir)
    : void 0;
}
function fingerprintCodexPluginAppCacheCredentials(startOptions) {
  const authToken = startOptions.authToken ?? "";
  const headers = Object.entries(startOptions.headers)
    .map(([key, value]) => [key.toLowerCase(), value])
    .toSorted(([left], [right]) => left.localeCompare(right));
  if (!authToken && headers.length === 0) return null;
  const hash = createHash("sha256");
  hash.update("openclaw:codex:plugin-app-cache-credentials:v1");
  hash.update("\0");
  hash.update(authToken);
  for (const [key, value] of headers) {
    hash.update("\0");
    hash.update(key);
    hash.update("\0");
    hash.update(value);
  }
  return `sha256:${hash.digest("hex")}`;
}
//#endregion
export {
  serializeCodexAppInventoryError as a,
  defaultCodexAppInventoryCache as i,
  buildCodexAppServerRuntimeFingerprint as n,
  buildCodexPluginAppCacheKey as r,
  buildCodexAppServerConnectionFingerprint as t,
};
