import crypto, { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
import { r as sanitizeServerName } from "./agent-bundle-mcp-names-B9PLR-i_.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { t as wrapGuardedBodyStream } from "./guarded-body-stream-Cwx1yhbk.js";
import "./file-lock-CsC2zkbH.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { i as resolveOpenClawMcpTransportAlias } from "./mcp-config-normalize-Cgi6vawf.js";
import {
  i as toMcpStringRecord,
  n as resolveStdioMcpServerLaunchConfig,
  r as isMcpConfigRecord,
  t as describeStdioMcpServerLaunchConfig,
} from "./mcp-stdio-CT1C_4ex.js";
import { n as resolveApiKeyForProfile } from "./oauth-CqNVt6lC.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  a as redactSensitiveUrl,
  o as redactSensitiveUrlLikeString,
} from "./redact-sensitive-url-CPcFXf0r.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-keFRGQLq.js";
import { d as loadAuthProfileStoreForSecretsRuntime } from "./store-B7DoDdVM.js";
import { n as runQueuedStoreWrite } from "./store-writer-queue-DPKo3FoW.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-Bm6J6FAw.js";
//#region src/agents/mcp-http-fetch.ts
/**
 * MCP HTTP fetch wrappers.
 * Adds SSRF protection, scoped TLS/client-cert dispatchers, response cleanup,
 * and same-origin header handling around the MCP SDK fetch contract.
 */
/** Default MCP HTTP fetch backed by lazy-loaded undici runtime deps. */
const fetchWithUndici = async (url, init) => await loadUndiciRuntimeDeps().fetch(url, init);
const fetchWithUndiciGuard = async (input, init) =>
  await fetchWithUndici(input instanceof Request ? input.url : input, init);
const MCP_HTTP_MAX_REDIRECTS = 20;
function resolveFetchRequest(input, init) {
  if (input instanceof Request) {
    const request = new Request(input, init);
    const body = request.body ?? void 0;
    return {
      url: request.url,
      signal: request.signal,
      init: {
        method: request.method,
        headers: request.headers,
        body,
        redirect: request.redirect,
        ...(body ? { duplex: "half" } : {}),
      },
    };
  }
  const { signal, ...requestInit } = init ?? {};
  return {
    url: input instanceof URL ? input.toString() : input,
    signal: signal ?? void 0,
    init: init ? requestInit : void 0,
  };
}
async function ensureGlobalFetchResponse(response) {
  const init = {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
  if (response.body != null) return new Response(response.body, init);
  if (response.status === 204 || response.status === 205 || response.status === 304)
    return new Response(null, init);
  return new Response(null, init);
}
async function buildManagedMcpResponse(response, release, refreshTimeout) {
  if (!response.body) {
    release();
    return await ensureGlobalFetchResponse(response);
  }
  const wrappedBody = wrapGuardedBodyStream({
    body: response.body,
    cleanup: release,
    refreshTimeout,
  });
  return await ensureGlobalFetchResponse(
    new Response(wrappedBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }),
  );
}
/** Builds an MCP fetch function with optional TLS/client-cert dispatcher support. */
function buildMcpHttpFetch(params) {
  const needsCustomDispatcher =
    params.sslVerify === false || Boolean(params.clientCert || params.clientKey);
  const scopedOrigin = params.resourceUrl ? new URL(params.resourceUrl).origin : void 0;
  const policy = params.resourceUrl
    ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.resourceUrl)
    : void 0;
  let customConnect;
  const resolveCustomDispatcherPolicy = (url) => {
    if (!needsCustomDispatcher || !scopedOrigin || url.origin !== scopedOrigin) return;
    customConnect ??= {
      ...(params.sslVerify === false ? { rejectUnauthorized: false } : {}),
      ...(params.clientCert ? { cert: fs.readFileSync(params.clientCert, "utf-8") } : {}),
      ...(params.clientKey ? { key: fs.readFileSync(params.clientKey, "utf-8") } : {}),
    };
    return {
      mode: "direct",
      connect: customConnect,
    };
  };
  return async (url, init) => {
    const request = resolveFetchRequest(url, init);
    const guarded = await fetchWithSsrFGuard({
      url: request.url,
      init: request.init,
      fetchImpl: fetchWithUndiciGuard,
      maxRedirects: MCP_HTTP_MAX_REDIRECTS,
      allowCrossOriginUnsafeRedirectReplay: true,
      auditContext: "mcp-http",
      useEnvProxyForEligibleUrls: true,
      ...(request.signal ? { signal: request.signal } : {}),
      ...(params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}),
      ...(policy ? { policy } : {}),
      ...(needsCustomDispatcher ? { resolveDispatcherPolicy: resolveCustomDispatcherPolicy } : {}),
    });
    return await buildManagedMcpResponse(guarded.response, guarded.release, guarded.refreshTimeout);
  };
}
/** Removes Authorization from MCP headers before forwarding to non-authorized paths. */
function withoutMcpAuthorizationHeader(headers) {
  if (!headers) return;
  const entries = Object.entries(headers).filter(([key]) => key.toLowerCase() !== "authorization");
  return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Wraps MCP fetch so configured headers are applied only to the resource origin. */
function withSameOriginMcpHttpHeaders(params) {
  if (!params.headers || Object.keys(params.headers).length === 0) return params.fetchFn;
  const resourceOrigin = new URL(params.resourceUrl).origin;
  return (url, init) => {
    if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
    const headers = new Headers(params.headers);
    for (const [key, value] of new Headers(init?.headers)) headers.set(key, value);
    return params.fetchFn(url, {
      ...init,
      headers,
    });
  };
}
//#endregion
//#region src/agents/mcp-oauth.ts
/**
 * MCP OAuth credential store and login helpers. Credentials are stored in the
 * private OpenClaw state directory with one hashed file per MCP server URL.
 */
const LEGACY_DEFAULT_REDIRECT_URL = "http://127.0.0.1:8989/oauth/callback";
const LOCALHOST_REDIRECT_URL = "http://localhost:8989/oauth/callback";
const TOKEN_EXPIRY_SKEW_MS = 3e4;
const MCP_OAUTH_LOCK_OPTIONS = {
  retries: {
    retries: 20,
    factor: 1.3,
    minTimeout: 25,
    maxTimeout: 500,
    randomize: true,
  },
  stale: 6e4,
  staleRecovery: "fail-closed",
};
const MCP_OAUTH_STORE_QUEUES = resolveGlobalSingleton(
  Symbol.for("openclaw.mcp-oauth.store-writer-queues"),
  () => /* @__PURE__ */ new Map(),
);
function resolveTokenExpiresAt(tokens) {
  const expiresIn = tokens.expires_in;
  return typeof expiresIn === "number" && Number.isFinite(expiresIn)
    ? Date.now() + expiresIn * 1e3
    : void 0;
}
function isMcpOAuthRedirectRegistrationError(error) {
  return /invalid_client_metadata|redirect_uri/i.test(String(error));
}
function oauthStorePath(serverName, serverUrl) {
  const safeServerName = sanitizeServerName(serverName, /* @__PURE__ */ new Set());
  const key = createHash("sha256").update(serverName).update("\0").update(serverUrl).digest("hex");
  return path.join(resolveStateDir(), "mcp-oauth", `${safeServerName}-${key.slice(0, 16)}.json`);
}
async function readStore(filePath) {
  try {
    return JSON.parse(await fs$1.readFile(filePath, "utf-8"));
  } catch {
    return {};
  }
}
function readStoreSync(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
}
async function writeStore(filePath, store) {
  await fs$1.mkdir(path.dirname(filePath), {
    recursive: true,
    mode: 448,
  });
  await fs$1.writeFile(filePath, JSON.stringify(store, null, 2), {
    encoding: "utf-8",
    mode: 384,
  });
  await fs$1.chmod(filePath, 384).catch(() => {});
}
async function withMcpOAuthStoreLock(filePath, fn) {
  return await runQueuedStoreWrite({
    queues: MCP_OAUTH_STORE_QUEUES,
    storePath: filePath,
    label: "withMcpOAuthStoreLock",
    fn: async () => {
      await fs$1.mkdir(path.dirname(filePath), {
        recursive: true,
        mode: 448,
      });
      return await withFileLock(filePath, MCP_OAUTH_LOCK_OPTIONS, fn);
    },
  });
}
function resolveOAuthRedirectUrl(config, store = {}) {
  return (
    normalizeOptionalString(config.redirectUrl) ??
    normalizeOptionalString(store.redirectUrl) ??
    LEGACY_DEFAULT_REDIRECT_URL
  );
}
function buildOAuthClientMetadata(config, store = {}) {
  return {
    client_name: "OpenClaw MCP",
    redirect_uris: [resolveOAuthRedirectUrl(config, store)],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
    ...(normalizeOptionalString(config.scope)
      ? { scope: normalizeOptionalString(config.scope) }
      : {}),
  };
}
/** Creates the MCP SDK OAuth provider backed by OpenClaw's private store. */
function createMcpOAuthClientProvider(params) {
  const config = params.config ?? {};
  const filePath = oauthStorePath(params.serverName, params.serverUrl);
  const allowAuthorizationRedirect =
    params.allowAuthorizationRedirect ?? Boolean(params.onAuthorizationUrl);
  const assertAuthorizationRedirectAllowed = () => {
    if (!allowAuthorizationRedirect)
      throw new Error(
        `MCP server "${params.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.serverName}.`,
      );
  };
  return {
    get redirectUrl() {
      return resolveOAuthRedirectUrl(config, readStoreSync(filePath));
    },
    clientMetadataUrl: normalizeOptionalString(config.clientMetadataUrl),
    get clientMetadata() {
      return buildOAuthClientMetadata(config, readStoreSync(filePath));
    },
    async state() {
      assertAuthorizationRedirectAllowed();
      const store = await readStore(filePath);
      const state = randomUUID();
      await writeStore(filePath, {
        ...store,
        state,
      });
      return state;
    },
    async clientInformation() {
      return (await readStore(filePath)).clientInformation;
    },
    async saveClientInformation(clientInformation) {
      const store = await readStore(filePath);
      await writeStore(filePath, {
        ...store,
        clientInformation,
      });
    },
    async tokens() {
      return (await readStore(filePath)).tokens;
    },
    async saveTokens(tokens) {
      const store = await readStore(filePath);
      const tokenExpiresAt = resolveTokenExpiresAt(tokens);
      const nextStore = {
        ...store,
        tokens,
      };
      if (tokenExpiresAt === void 0) delete nextStore.tokenExpiresAt;
      else nextStore.tokenExpiresAt = tokenExpiresAt;
      await writeStore(filePath, nextStore);
    },
    async redirectToAuthorization(authorizationUrl) {
      assertAuthorizationRedirectAllowed();
      const store = await readStore(filePath);
      await writeStore(filePath, {
        ...store,
        lastAuthorizationUrl: authorizationUrl.toString(),
      });
      await params.onAuthorizationUrl?.(authorizationUrl);
    },
    async saveCodeVerifier(codeVerifier) {
      assertAuthorizationRedirectAllowed();
      const store = await readStore(filePath);
      await writeStore(filePath, {
        ...store,
        codeVerifier,
      });
    },
    async codeVerifier() {
      const codeVerifier = (await readStore(filePath)).codeVerifier;
      if (!codeVerifier)
        throw new Error("Missing MCP OAuth code verifier. Run the login flow again.");
      return codeVerifier;
    },
    async invalidateCredentials(scope) {
      const next = { ...(await readStore(filePath)) };
      if (scope === "all" || scope === "client") delete next.clientInformation;
      if (scope === "all" || scope === "tokens") delete next.tokens;
      if (scope === "all" || scope === "verifier") delete next.codeVerifier;
      if (scope === "all" || scope === "discovery") delete next.discoveryState;
      await writeStore(filePath, next);
    },
    async saveDiscoveryState(discoveryState) {
      const store = await readStore(filePath);
      await writeStore(filePath, {
        ...store,
        discoveryState,
      });
    },
    async discoveryState() {
      return (await readStore(filePath)).discoveryState;
    },
  };
}
/** Returns a current MCP-native OAuth access token for external runtime projection. */
async function resolveMcpOAuthAccessToken(params) {
  const filePath = oauthStorePath(params.serverName, params.serverUrl);
  return await withMcpOAuthStoreLock(filePath, async () => {
    return await resolveMcpOAuthAccessTokenLocked(params, filePath);
  });
}
async function resolveMcpOAuthAccessTokenLocked(params, filePath) {
  const store = await readStore(filePath);
  const tokens = store.tokens;
  if (!tokens?.access_token)
    throw new Error(
      `MCP server "${params.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.serverName}.`,
    );
  if (
    (store.tokenExpiresAt !== void 0 && store.tokenExpiresAt > Date.now() + TOKEN_EXPIRY_SKEW_MS) ||
    (store.tokenExpiresAt === void 0 && !tokens.refresh_token)
  )
    return tokens.access_token;
  if (!tokens.refresh_token)
    throw new Error(
      `MCP server "${params.serverName}" has expired OAuth credentials. Run openclaw mcp login ${params.serverName}.`,
    );
  const provider = createMcpOAuthClientProvider(params);
  const result = await auth(provider, {
    serverUrl: params.serverUrl,
    scope: normalizeOptionalString(params.config?.scope),
    fetchFn: params.fetchFn,
  });
  const refreshedTokens = await provider.tokens();
  if (result !== "AUTHORIZED" || !refreshedTokens?.access_token)
    throw new Error(
      `MCP server "${params.serverName}" could not refresh OAuth credentials. Run openclaw mcp login ${params.serverName}.`,
    );
  return refreshedTokens.access_token;
}
/** Deletes stored OAuth credentials for one MCP server. */
async function clearMcpOAuthCredentials(params) {
  await fs$1.rm(oauthStorePath(params.serverName, params.serverUrl), { force: true });
}
/** Reads stored OAuth credential presence without exposing credential values. */
async function readMcpOAuthCredentialsStatus(params) {
  const store = await readStore(oauthStorePath(params.serverName, params.serverUrl));
  return {
    hasTokens: Boolean(store.tokens),
    hasClientInformation: Boolean(store.clientInformation),
    hasCodeVerifier: Boolean(store.codeVerifier),
    hasDiscoveryState: Boolean(store.discoveryState),
    hasLastAuthorizationUrl: Boolean(store.lastAuthorizationUrl),
  };
}
async function runMcpOAuthLoginAttempt(params) {
  return await withMcpOAuthStoreLock(
    oauthStorePath(params.serverName, params.serverUrl),
    async () => {
      return (await auth(
        createMcpOAuthClientProvider({
          ...params,
          allowAuthorizationRedirect: true,
        }),
        {
          serverUrl: params.serverUrl,
          authorizationCode: normalizeOptionalString(params.authorizationCode),
          scope: normalizeOptionalString(params.config?.scope),
          fetchFn: params.fetchFn,
        },
      )) === "AUTHORIZED"
        ? "authorized"
        : "redirect";
    },
  );
}
/** Runs the MCP OAuth login flow, returning whether it authorized or needs redirect. */
async function runMcpOAuthLogin(params) {
  const filePath = oauthStorePath(params.serverName, params.serverUrl);
  const store = await readStore(filePath);
  const loginParams = {
    ...params,
    config: {
      ...params.config,
      redirectUrl: normalizeOptionalString(params.config?.redirectUrl) ?? store.redirectUrl,
    },
  };
  try {
    return await runMcpOAuthLoginAttempt(loginParams);
  } catch (error) {
    if (
      !normalizeOptionalString(params.authorizationCode) &&
      !normalizeOptionalString(params.config?.redirectUrl) &&
      isMcpOAuthRedirectRegistrationError(error)
    ) {
      const result = await runMcpOAuthLoginAttempt({
        ...params,
        config: {
          ...params.config,
          redirectUrl: LOCALHOST_REDIRECT_URL,
        },
      });
      await writeStore(filePath, {
        ...(await readStore(filePath)),
        redirectUrl: LOCALHOST_REDIRECT_URL,
      });
      return result;
    }
    throw error;
  }
}
//#endregion
//#region src/agents/mcp-http.ts
/**
 * HTTP MCP launch config normalization.
 *
 * MCP server setup uses this to validate SSE/streamable HTTP server records,
 * sanitize headers, and redact sensitive URLs in diagnostics.
 */
/** Normalizes an HTTP MCP server config record into a launchable transport config. */
function resolveHttpMcpServerLaunchConfig(raw, options) {
  if (!isMcpConfigRecord(raw))
    return {
      ok: false,
      reason: "server config must be an object",
    };
  if (typeof raw.url !== "string" || raw.url.trim().length === 0)
    return {
      ok: false,
      reason: "its url is missing",
    };
  const url = raw.url.trim();
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return {
      ok: false,
      reason: `its url is not a valid URL: ${redactSensitiveUrlLikeString(url)}`,
    };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    return {
      ok: false,
      reason: `only http and https URLs are supported, got ${parsed.protocol}`,
    };
  let headers;
  if (raw.headers !== void 0 && raw.headers !== null)
    if (!isMcpConfigRecord(raw.headers)) options?.onMalformedHeaders?.(raw.headers);
    else headers = toMcpStringRecord(raw.headers, { onDroppedEntry: options?.onDroppedHeader });
  return {
    ok: true,
    config: {
      transportType: options?.transportType ?? "sse",
      url,
      headers,
    },
  };
}
/** Describes an HTTP MCP server launch config without leaking URL credentials. */
function describeHttpMcpServerLaunchConfig(config) {
  return redactSensitiveUrl(config.url);
}
//#endregion
//#region src/agents/mcp-transport-config.ts
/**
 * Resolves MCP transport command, environment, and timeout configuration.
 */
const DEFAULT_CONNECTION_TIMEOUT_MS = 3e4;
const DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
function getPositiveNumber(rawServer, keys) {
  if (!rawServer || typeof rawServer !== "object") return;
  const record = rawServer;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  }
}
function getConnectionTimeoutMs(rawServer) {
  const milliseconds = getPositiveNumber(rawServer, ["connectionTimeoutMs"]);
  if (milliseconds) return Math.floor(milliseconds);
  const seconds = getPositiveNumber(rawServer, ["connectTimeout", "connect_timeout"]);
  if (seconds) return Math.floor(seconds * 1e3);
  return DEFAULT_CONNECTION_TIMEOUT_MS;
}
function getRequestTimeoutMs(rawServer) {
  const milliseconds = getPositiveNumber(rawServer, ["requestTimeoutMs"]);
  if (milliseconds) return Math.floor(milliseconds);
  const seconds = getPositiveNumber(rawServer, ["timeout"]);
  if (seconds) return Math.floor(seconds * 1e3);
  return DEFAULT_REQUEST_TIMEOUT_MS;
}
function getBooleanField(rawServer, keys) {
  if (!rawServer || typeof rawServer !== "object") return;
  const record = rawServer;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
  }
}
function getStringField(rawServer, keys) {
  if (!rawServer || typeof rawServer !== "object") return;
  return readTrimmedStringAlias(rawServer, keys);
}
function getRequestedTransport(rawServer) {
  if (!rawServer || typeof rawServer !== "object" || typeof rawServer.transport !== "string")
    return "";
  return normalizeLowercaseStringOrEmpty(rawServer.transport);
}
function getRequestedTransportAlias(rawServer) {
  if (!rawServer || typeof rawServer !== "object" || typeof rawServer.type !== "string") return "";
  return resolveOpenClawMcpTransportAlias(rawServer.type) ?? "";
}
function resolveHttpTransportConfig(serverName, rawServer, transportType) {
  const launch = resolveHttpMcpServerLaunchConfig(rawServer, {
    transportType,
    onDroppedHeader: (key) => {
      logWarn(
        `bundle-mcp: server "${serverName}": header "${key}" has an unsupported value type and was ignored.`,
      );
    },
    onMalformedHeaders: () => {
      logWarn(
        `bundle-mcp: server "${serverName}": "headers" must be a JSON object; the value was ignored.`,
      );
    },
  });
  if (!launch.ok) return null;
  return {
    kind: "http",
    transportType: launch.config.transportType,
    url: launch.config.url,
    headers: launch.config.headers,
    ...(rawServer && typeof rawServer === "object" && rawServer.auth === "oauth"
      ? { auth: "oauth" }
      : {}),
    ...(rawServer &&
    typeof rawServer === "object" &&
    rawServer.oauth &&
    typeof rawServer.oauth === "object" &&
    !Array.isArray(rawServer.oauth)
      ? { oauth: rawServer.oauth }
      : {}),
    ...(getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) !== void 0
      ? { sslVerify: getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) }
      : {}),
    ...(getStringField(rawServer, ["clientCert", "client_cert"])
      ? { clientCert: getStringField(rawServer, ["clientCert", "client_cert"]) }
      : {}),
    ...(getStringField(rawServer, ["clientKey", "client_key"])
      ? { clientKey: getStringField(rawServer, ["clientKey", "client_key"]) }
      : {}),
    description: describeHttpMcpServerLaunchConfig(launch.config),
    connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
    requestTimeoutMs: getRequestTimeoutMs(rawServer),
    supportsParallelToolCalls:
      getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ??
      false,
  };
}
/** Resolve one MCP server's launch transport config, or null when unsupported. */
function resolveMcpTransportConfig(serverName, rawServer) {
  const logServerName = sanitizeForLog(serverName);
  const requestedTransport = getRequestedTransport(rawServer);
  const requestedTransportAlias = requestedTransport ? "" : getRequestedTransportAlias(rawServer);
  const effectiveTransport = requestedTransport || requestedTransportAlias;
  const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer, {
    onDroppedEnv: (key) => {
      logWarn(
        `bundle-mcp: server "${logServerName}": env "${sanitizeForLog(key)}" is blocked for stdio startup safety and was ignored.`,
      );
    },
  });
  if (stdioLaunch.ok)
    return {
      kind: "stdio",
      transportType: "stdio",
      command: stdioLaunch.config.command,
      args: stdioLaunch.config.args,
      env: stdioLaunch.config.env,
      cwd: stdioLaunch.config.cwd,
      description: describeStdioMcpServerLaunchConfig(stdioLaunch.config),
      connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
      requestTimeoutMs: getRequestTimeoutMs(rawServer),
      supportsParallelToolCalls:
        getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ??
        false,
    };
  if (
    effectiveTransport &&
    effectiveTransport !== "sse" &&
    effectiveTransport !== "streamable-http"
  ) {
    logWarn(
      `bundle-mcp: skipped server "${logServerName}" because transport "${sanitizeForLog(effectiveTransport)}" is not supported.`,
    );
    return null;
  }
  if (effectiveTransport === "streamable-http") {
    const httpTransport = resolveHttpTransportConfig(serverName, rawServer, "streamable-http");
    if (httpTransport) return httpTransport;
  }
  const sseTransport = resolveHttpTransportConfig(serverName, rawServer, "sse");
  if (sseTransport) return sseTransport;
  const httpLaunch = resolveHttpMcpServerLaunchConfig(rawServer);
  const httpReason = httpLaunch.ok ? "not an HTTP MCP server" : httpLaunch.reason;
  logWarn(
    `bundle-mcp: skipped server "${logServerName}" because ${stdioLaunch.reason} and ${httpReason}.`,
  );
  return null;
}
//#endregion
//#region src/agents/mcp-auth-profile.ts
/**
 * Auth-profile backed bearer injection for remote MCP servers.
 */
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeStringHeaders(value) {
  if (!isRecord(value)) return;
  const entries = Object.entries(value).filter((entry) => typeof entry[1] === "string");
  return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Returns the refresh-capable auth profile selected for one MCP server. */
function resolveMcpAuthProfileId(rawServer) {
  if (!isRecord(rawServer) || rawServer.auth !== "oauth" || !isRecord(rawServer.oauth)) return;
  const authProfileId = rawServer.oauth.authProfileId;
  return typeof authProfileId === "string" && authProfileId.trim().length > 0
    ? authProfileId.trim()
    : void 0;
}
/** Returns whether a server needs an OpenClaw-managed bearer projected externally. */
function requiresMcpBearerProjection(rawServer) {
  if (!isRecord(rawServer) || rawServer.auth !== "oauth") return false;
  return Boolean(resolveMcpAuthProfileId(rawServer) || typeof rawServer.url === "string");
}
async function resolveMcpAuthProfileBearerToken(params) {
  const store = loadAuthProfileStoreForSecretsRuntime(params.agentDir, {
    config: params.cfg,
    externalCliProfileIds: [params.profileId],
  });
  const credential = store.profiles[params.profileId];
  if (!credential)
    throw new Error(
      `MCP server "${params.serverName}" references auth profile "${params.profileId}", but that profile was not found.`,
    );
  if (credential.type !== "oauth")
    throw new Error(
      `MCP server "${params.serverName}" references auth profile "${params.profileId}", but ${credential.type} profiles are not refreshable. Use a refresh-capable OAuth profile.`,
    );
  const resolved = await resolveApiKeyForProfile({
    cfg: params.cfg,
    store,
    profileId: params.profileId,
    agentDir: params.agentDir,
  });
  if (!resolved || resolved.profileType !== "oauth" || !resolved.apiKey)
    throw new Error(
      `MCP server "${params.serverName}" could not resolve refreshable OAuth auth profile "${params.profileId}". Re-authenticate the profile and retry.`,
    );
  if (
    !resolved.credential ||
    resolved.credential.type !== "oauth" ||
    typeof resolved.credential.access !== "string" ||
    resolved.credential.access.trim().length === 0
  )
    throw new Error(
      `MCP server "${params.serverName}" resolved OAuth auth profile "${params.profileId}", but no raw access token was available for bearer projection.`,
    );
  return resolved.credential.access;
}
async function resolveMcpBearerToken(params) {
  const authProfileId = resolveMcpAuthProfileId(params.server);
  if (authProfileId)
    return await resolveMcpAuthProfileBearerToken({
      serverName: params.serverName,
      profileId: authProfileId,
      cfg: params.cfg,
      agentDir: params.agentDir,
    });
  if (params.server.auth !== "oauth") return;
  const resolved = resolveMcpTransportConfig(params.serverName, params.server);
  if (!resolved || resolved.kind !== "http") return;
  const fetchFn = withSameOriginMcpHttpHeaders({
    fetchFn: buildMcpHttpFetch({
      sslVerify: resolved.sslVerify,
      clientCert: resolved.clientCert,
      clientKey: resolved.clientKey,
      resourceUrl: resolved.url,
      timeoutMs: resolved.requestTimeoutMs,
    }),
    headers: withoutMcpAuthorizationHeader(resolved.headers),
    resourceUrl: resolved.url,
  });
  return await resolveMcpOAuthAccessToken({
    serverName: params.serverName,
    serverUrl: resolved.url,
    config: resolved.oauth,
    fetchFn,
  });
}
/** Wraps HTTP MCP fetch with same-origin, refreshed bearer injection. */
function withMcpAuthProfileBearer(params) {
  const resourceOrigin = new URL(params.resourceUrl).origin;
  const configuredHeaders = withoutMcpAuthorizationHeader(params.headers);
  return async (url, init) => {
    if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
    const headers = new Headers(configuredHeaders);
    for (const [key, value] of new Headers(init?.headers))
      if (key.toLowerCase() !== "authorization") headers.set(key, value);
    const token = await resolveMcpAuthProfileBearerToken({
      serverName: params.serverName,
      profileId: params.authProfileId,
      cfg: params.cfg,
      agentDir: params.agentDir,
    });
    headers.set("authorization", `Bearer ${token}`);
    return params.fetchFn(url, {
      ...init,
      headers,
    });
  };
}
function buildTokenEnvVarName(serverName) {
  return `OPENCLAW_MCP_AUTH_${crypto.createHash("sha256").update(serverName).digest("hex").slice(0, 12).toUpperCase()}_TOKEN`;
}
function stripOpenClawOnlyOAuthConfig(server) {
  const next = { ...server };
  delete next.auth;
  delete next.oauth;
  return next;
}
/** Resolves OAuth-backed MCP servers into bearer headers for external runtimes. */
async function resolveMcpBearerBundleConfig(params) {
  let nextServers;
  let nextEnv = params.env;
  const tokenProjection = params.tokenProjection ?? "env";
  for (const [serverName, server] of Object.entries(params.config.mcpServers)) {
    let token;
    try {
      token = await resolveMcpBearerToken({
        serverName,
        server,
        cfg: params.cfg,
        agentDir: params.agentDir,
      });
    } catch (error) {
      if (!params.omitUnavailableOAuthServers || !requiresMcpBearerProjection(server)) throw error;
      nextServers ??= { ...params.config.mcpServers };
      delete nextServers[serverName];
      params.onServerUnavailable?.(serverName, error);
      continue;
    }
    if (!token) continue;
    let authorization;
    if (tokenProjection === "literal") authorization = `Bearer ${token}`;
    else {
      const envVar = buildTokenEnvVarName(serverName);
      if (!nextEnv || nextEnv === params.env) nextEnv = { ...params.env };
      nextEnv[envVar] = token;
      authorization = `Bearer \${${envVar}}`;
    }
    const headers = withoutMcpAuthorizationHeader(normalizeStringHeaders(server.headers));
    nextServers ??= { ...params.config.mcpServers };
    nextServers[serverName] = stripOpenClawOnlyOAuthConfig({
      ...server,
      headers: {
        ...headers,
        Authorization: authorization,
      },
    });
  }
  return {
    config: nextServers ? { mcpServers: nextServers } : params.config,
    env: nextEnv,
  };
}
//#endregion
export {
  resolveMcpTransportConfig as a,
  readMcpOAuthCredentialsStatus as c,
  withSameOriginMcpHttpHeaders as d,
  withoutMcpAuthorizationHeader as f,
  withMcpAuthProfileBearer as i,
  runMcpOAuthLogin as l,
  resolveMcpAuthProfileId as n,
  clearMcpOAuthCredentials as o,
  resolveMcpBearerBundleConfig as r,
  createMcpOAuthClientProvider as s,
  requiresMcpBearerProjection as t,
  buildMcpHttpFetch as u,
};
