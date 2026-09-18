import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { r as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-D2RPlnfc.js";
import "./parse-finite-number-Z7n6tXLk.js";
import "./errors-BoHeli7m.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import {
  E as resolveExpiresAtMsFromEpochSeconds,
  T as resolveExpiresAtMsFromDurationSeconds,
  h as nonNegativeSecondsToSafeMilliseconds,
  j as resolveTimerTimeoutMs,
  x as positiveSecondsToSafeMilliseconds,
} from "./number-coercion-CJQ8TR--.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import {
  a as oauthErrorHtml,
  c as resolveOAuthTokenExpiresAt,
  d as withOAuthLoginAbort,
  i as generatePKCE,
  n as createOAuthLoginCancelledError,
  o as oauthSuccessHtml,
  r as generateOAuthState,
  s as parseOAuthAuthorizationInput,
  t as buildOAuthRequestSignal,
  u as throwIfOAuthLoginAborted,
} from "./provider-oauth-runtime-bxF650St.js";
import "./abort-BNMwuTLK.js";
//#region src/llm/utils/oauth/anthropic.ts
let nodeApis = null;
let nodeApisPromise = null;
const CLIENT_ID$1 = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const AUTHORIZE_URL = "https://claude.ai/oauth/authorize";
const TOKEN_URL = "https://platform.claude.com/v1/oauth/token";
const DEFAULT_CALLBACK_HOST = "127.0.0.1";
const LOOPBACK_CALLBACK_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
const CALLBACK_PORT = 53692;
const CALLBACK_PATH = "/callback";
const REDIRECT_URI = `http://localhost:${CALLBACK_PORT}${CALLBACK_PATH}`;
function resolveCallbackHost(env = process.env) {
  const host = env.OPENCLAW_OAUTH_CALLBACK_HOST?.trim() || DEFAULT_CALLBACK_HOST;
  if (!LOOPBACK_CALLBACK_HOSTS.has(host))
    throw new Error("Anthropic OAuth callback host must be localhost, 127.0.0.1, or ::1");
  return host;
}
const SCOPES =
  "org:create_api_key user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload";
/** Max response body bytes for Anthropic OAuth token endpoint (16 MiB). */
const OAUTH_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
async function getNodeApis() {
  if (nodeApis) return nodeApis;
  if (!nodeApisPromise) {
    if (typeof process === "undefined" || (!process.versions?.node && !process.versions?.bun))
      throw new Error("Anthropic OAuth is only available in Node.js environments");
    nodeApisPromise = import("node:http").then((httpModule) => ({
      createServer: httpModule.createServer,
    }));
  }
  nodeApis = await nodeApisPromise;
  return nodeApis;
}
function formatErrorDetails(error) {
  if (error instanceof Error) {
    const details = [`${error.name}: ${error.message}`];
    const errorWithCode = error;
    if (errorWithCode.code) details.push(`code=${errorWithCode.code}`);
    if (errorWithCode.errno !== void 0) details.push(`errno=${String(errorWithCode.errno)}`);
    if (error.cause !== void 0) details.push(`cause=${formatErrorDetails(error.cause)}`);
    if (error.stack) details.push(`stack=${error.stack}`);
    return details.join("; ");
  }
  return String(error);
}
function formatTokenResponseParseContext(responseBody) {
  return `bodyBytes=${Buffer.byteLength(responseBody, "utf8")}`;
}
function parseTokenCredentials(responseBody, options) {
  let data;
  try {
    data = JSON.parse(responseBody);
  } catch (error) {
    throw new Error(
      `${options.invalidJsonMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}; details=${formatErrorDetails(error)}`,
      { cause: error },
    );
  }
  if (!data || typeof data !== "object")
    throw new Error(
      `${options.invalidFieldsMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}`,
    );
  const record = data;
  const expires = resolveOAuthTokenExpiresAt(record.expires_in, { refreshSkewMs: 300 * 1e3 });
  if (
    typeof record.access_token !== "string" ||
    !record.access_token ||
    typeof record.refresh_token !== "string" ||
    !record.refresh_token ||
    expires === void 0
  )
    throw new Error(
      `${options.invalidFieldsMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}`,
    );
  return {
    refresh: record.refresh_token,
    access: record.access_token,
    expires,
  };
}
async function startCallbackServer(expectedState) {
  const { createServer } = await getNodeApis();
  return new Promise((resolve, reject) => {
    let settleWait;
    const waitForCodePromise = new Promise((resolveWait) => {
      let settled = false;
      settleWait = (value) => {
        if (settled) return;
        settled = true;
        resolveWait(value);
      };
    });
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url || "", "http://localhost");
        if (url.pathname !== CALLBACK_PATH) {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(oauthErrorHtml("Callback route not found."));
          return;
        }
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");
        if (error) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(oauthErrorHtml("Anthropic authentication did not complete.", `Error: ${error}`));
          return;
        }
        if (!code || !state) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(oauthErrorHtml("Missing code or state parameter."));
          return;
        }
        if (state !== expectedState) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(oauthErrorHtml("State mismatch."));
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(oauthSuccessHtml("Anthropic authentication completed. You can close this window."));
        settleWait?.({
          code,
          state,
        });
      } catch {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal error");
      }
    });
    const callbackHost = resolveCallbackHost();
    server.on("error", (err) => {
      reject(err);
    });
    server.listen(CALLBACK_PORT, callbackHost, () => {
      resolve({
        server,
        cancelWait: () => {
          settleWait?.(null);
        },
        waitForCode: () => waitForCodePromise,
      });
    });
  });
}
async function postJson(url, body, options = {}) {
  const timeoutMs = options.timeoutMs ?? 3e4;
  throwIfOAuthLoginAborted(options.signal);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: buildOAuthRequestSignal({
      signal: options.signal,
      timeoutMs,
    }),
  });
  const buffer = await readResponseWithLimit(response, OAUTH_RESPONSE_MAX_BYTES, {
    onOverflow: ({ size }) =>
      /* @__PURE__ */ new Error(`Anthropic OAuth response too large: ${size} bytes`),
  });
  const responseBody = new TextDecoder().decode(buffer);
  if (!response.ok)
    throw new Error(
      `HTTP request failed. status=${response.status}; url=${url}; body=${responseBody}`,
    );
  return responseBody;
}
async function exchangeAuthorizationCode(code, state, verifier, redirectUri, signal) {
  let responseBody;
  try {
    responseBody = await postJson(
      TOKEN_URL,
      {
        grant_type: "authorization_code",
        client_id: CLIENT_ID$1,
        code,
        state,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      },
      { signal },
    );
  } catch (error) {
    if (signal?.aborted) throw createOAuthLoginCancelledError();
    throw new Error(
      `Token exchange request failed. url=${TOKEN_URL}; redirect_uri=${redirectUri}; response_type=authorization_code; details=${formatErrorDetails(error)}`,
      { cause: error },
    );
  }
  return parseTokenCredentials(responseBody, {
    invalidJsonMessage: "Token exchange returned invalid JSON.",
    invalidFieldsMessage: "Token exchange returned invalid token fields.",
  });
}
/**
 * Login with Anthropic OAuth (authorization code + PKCE)
 */
async function loginAnthropic(options) {
  throwIfOAuthLoginAborted(options.signal);
  const { verifier, challenge } = await generatePKCE();
  const expectedState = generateOAuthState();
  const server = await startCallbackServer(expectedState);
  let code;
  let state;
  try {
    throwIfOAuthLoginAborted(options.signal);
    const authParams = new URLSearchParams({
      code: "true",
      client_id: CLIENT_ID$1,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge: challenge,
      code_challenge_method: "S256",
      state: expectedState,
    });
    options.onAuth({
      url: `${AUTHORIZE_URL}?${authParams.toString()}`,
      instructions:
        "Complete login in your browser. If the browser is on another machine, paste the final redirect URL here.",
    });
    throwIfOAuthLoginAborted(options.signal);
    if (options.onManualCodeInput) {
      let manualInput;
      let manualError;
      const manualPromise = options
        .onManualCodeInput()
        .then((input) => {
          manualInput = input;
          server.cancelWait();
        })
        .catch((err) => {
          manualError = err instanceof Error ? err : new Error(String(err));
          server.cancelWait();
        });
      const result = await withOAuthLoginAbort(
        server.waitForCode(),
        options.signal,
        server.cancelWait,
      );
      if (manualError) throw manualError;
      if (result?.code) {
        code = result.code;
        state = result.state;
      } else if (manualInput) {
        const parsed = parseOAuthAuthorizationInput(manualInput);
        if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
        code = parsed.code;
        state = parsed.state ?? expectedState;
      }
      if (!code) {
        await withOAuthLoginAbort(manualPromise, options.signal, server.cancelWait);
        if (manualError) throw toErrorObject(manualError, "Non-Error thrown");
        if (manualInput) {
          const parsed = parseOAuthAuthorizationInput(manualInput);
          if (parsed.state && parsed.state !== expectedState)
            throw new Error("OAuth state mismatch");
          code = parsed.code;
          state = parsed.state ?? expectedState;
        }
      }
    } else {
      const result = await withOAuthLoginAbort(
        server.waitForCode(),
        options.signal,
        server.cancelWait,
      );
      if (result?.code) {
        code = result.code;
        state = result.state;
      }
    }
    if (!code) {
      const parsed = parseOAuthAuthorizationInput(
        await withOAuthLoginAbort(
          options.onPrompt({
            message: "Paste the authorization code or full redirect URL:",
            placeholder: REDIRECT_URI,
          }),
          options.signal,
          server.cancelWait,
        ),
      );
      if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
      code = parsed.code;
      state = parsed.state ?? expectedState;
    }
    if (!code) throw new Error("Missing authorization code");
    if (!state) throw new Error("Missing OAuth state");
    options.onProgress?.("Exchanging authorization code for tokens...");
    return exchangeAuthorizationCode(code, state, verifier, REDIRECT_URI, options.signal);
  } finally {
    server.server.close();
  }
}
/**
 * Refresh Anthropic OAuth token
 */
async function refreshAnthropicToken(refreshToken) {
  let responseBody;
  try {
    responseBody = await postJson(TOKEN_URL, {
      grant_type: "refresh_token",
      client_id: CLIENT_ID$1,
      refresh_token: refreshToken,
    });
  } catch (error) {
    throw new Error(
      `Anthropic token refresh request failed. url=${TOKEN_URL}; details=${formatErrorDetails(error)}`,
      { cause: error },
    );
  }
  return parseTokenCredentials(responseBody, {
    invalidJsonMessage: "Anthropic token refresh returned invalid JSON.",
    invalidFieldsMessage: "Anthropic token refresh returned invalid token fields.",
  });
}
const anthropicOAuthProvider = {
  id: "anthropic",
  name: "Anthropic (Claude Pro/Max)",
  usesCallbackServer: true,
  async login(callbacks) {
    return loginAnthropic({
      onAuth: callbacks.onAuth,
      onPrompt: callbacks.onPrompt,
      onProgress: callbacks.onProgress,
      onManualCodeInput: callbacks.onManualCodeInput,
      signal: callbacks.signal,
    });
  },
  async refreshToken(credentials) {
    return refreshAnthropicToken(credentials.refresh);
  },
  getApiKey(credentials) {
    return credentials.access;
  },
};
//#endregion
//#region src/llm/utils/oauth/github-copilot.ts
/**
 * GitHub Copilot OAuth flow
 */
const CLIENT_ID = "Iv1.b507a08c87ecfe98";
const COPILOT_HEADERS = {
  "User-Agent": "GitHubCopilotChat/0.35.0",
  "Editor-Version": "vscode/1.107.0",
  "Editor-Plugin-Version": "copilot-chat/0.35.0",
  "Copilot-Integration-Id": "vscode-chat",
};
const INITIAL_POLL_INTERVAL_MULTIPLIER = 1.2;
const SLOW_DOWN_POLL_INTERVAL_MULTIPLIER = 1.4;
const COPILOT_ROUTER_ID_PREFIX = "accounts/";
const COPILOT_REQUEST_TIMEOUT_MS = 3e4;
function resolveExpiresAtFromDurationSeconds(value) {
  return resolveExpiresAtMsFromDurationSeconds(value);
}
function resolveExpiresAtFromEpochSeconds(value) {
  return resolveExpiresAtMsFromEpochSeconds(value, { bufferMs: 300 * 1e3 });
}
function normalizeDomain(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    return (trimmed.includes("://") ? new URL(trimmed) : new URL(`https://${trimmed}`)).hostname;
  } catch {
    return null;
  }
}
function getUrls(domain) {
  return {
    deviceCodeUrl: `https://${domain}/login/device/code`,
    accessTokenUrl: `https://${domain}/login/oauth/access_token`,
    copilotTokenUrl: `https://api.${domain}/copilot_internal/v2/token`,
  };
}
/**
 * Parse the proxy-ep from a Copilot token and convert to API base URL.
 * Token format: tid=...;exp=...;proxy-ep=proxy.individual.githubcopilot.com;...
 * Returns API URL like https://api.individual.githubcopilot.com
 */
function getBaseUrlFromToken(token) {
  const match = token.match(/proxy-ep=([^;]+)/);
  if (!match) return null;
  return `https://${expectDefined(match[1], "github copilot regex capture 1").replace(/^proxy\./, "api.")}`;
}
function getGitHubCopilotBaseUrl(token, enterpriseDomain) {
  if (token) {
    const urlFromToken = getBaseUrlFromToken(token);
    if (urlFromToken) return urlFromToken;
  }
  if (enterpriseDomain) return `https://copilot-api.${enterpriseDomain}`;
  return "https://api.individual.githubcopilot.com";
}
function formatCopilotRequestError(operation, error, options) {
  if (options.signal?.aborted) return /* @__PURE__ */ new Error("Login cancelled");
  if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError"))
    return /* @__PURE__ */ new Error(
      `GitHub Copilot ${operation} timed out after ${options.timeoutMs}ms`,
    );
  return error instanceof Error
    ? error
    : /* @__PURE__ */ new Error(`GitHub Copilot ${operation} failed: ${String(error)}`);
}
function buildCopilotRequestSignal(options) {
  const timeoutSignal = AbortSignal.timeout(
    resolveTimerTimeoutMs(options.timeoutMs, COPILOT_REQUEST_TIMEOUT_MS),
  );
  if (!options.signal) return timeoutSignal;
  return AbortSignal.any([options.signal, timeoutSignal]);
}
async function fetchResponse(url, init, operation, options = {}) {
  const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, COPILOT_REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: buildCopilotRequestSignal({
        ...options,
        timeoutMs,
      }),
    });
  } catch (error) {
    throw formatCopilotRequestError(operation, error, {
      signal: options.signal,
      timeoutMs,
    });
  }
}
async function fetchJson(url, init, operation, options = {}) {
  const response = await fetchResponse(url, init, operation, options);
  const label = `GitHub Copilot ${operation}`;
  await assertOkOrThrowProviderError(response, label);
  return readProviderJsonResponse(response, label);
}
async function startDeviceFlow(domain, options = {}) {
  const data = await fetchJson(
    getUrls(domain).deviceCodeUrl,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "GitHubCopilotChat/0.35.0",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "read:user",
      }),
    },
    "device code request",
    options,
  );
  if (!data || typeof data !== "object") throw new Error("Invalid device code response");
  const deviceCode = data.device_code;
  const userCode = data.user_code;
  const verificationUri = data.verification_uri;
  const interval = data.interval;
  const intervalMs = nonNegativeSecondsToSafeMilliseconds(interval);
  const expiresAt = resolveExpiresAtFromDurationSeconds(data.expires_in);
  if (
    typeof deviceCode !== "string" ||
    typeof userCode !== "string" ||
    typeof verificationUri !== "string" ||
    intervalMs === void 0 ||
    expiresAt === void 0
  )
    throw new Error("Invalid device code response fields");
  return {
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: verificationUri,
    intervalMs,
    expiresAt,
  };
}
/**
 * Sleep that can be interrupted by an AbortSignal
 */
function abortableSleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(/* @__PURE__ */ new Error("Login cancelled"));
      return;
    }
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(/* @__PURE__ */ new Error("Login cancelled"));
      },
      { once: true },
    );
  });
}
async function pollForGitHubAccessToken(domain, deviceCode, intervalMs, deadline, signal) {
  const urls = getUrls(domain);
  let pollingIntervalMs = Math.max(1e3, intervalMs);
  let intervalMultiplier = INITIAL_POLL_INTERVAL_MULTIPLIER;
  let slowDownResponses = 0;
  while (Date.now() < deadline) {
    if (signal?.aborted) throw new Error("Login cancelled");
    const remainingMs = deadline - Date.now();
    await abortableSleep(
      Math.min(Math.ceil(pollingIntervalMs * intervalMultiplier), remainingMs),
      signal,
    );
    const raw = await fetchJson(
      urls.accessTokenUrl,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "GitHubCopilotChat/0.35.0",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          device_code: deviceCode,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        }),
      },
      "device token request",
      { signal },
    );
    if (raw && typeof raw === "object" && typeof raw.access_token === "string")
      return raw.access_token;
    if (raw && typeof raw === "object" && typeof raw.error === "string") {
      const { error, error_description: description, interval } = raw;
      if (error === "authorization_pending") continue;
      if (error === "slow_down") {
        slowDownResponses += 1;
        const slowDownIntervalMs = positiveSecondsToSafeMilliseconds(interval);
        pollingIntervalMs =
          slowDownIntervalMs === void 0
            ? Math.max(1e3, pollingIntervalMs + 5e3)
            : Math.max(1e3, slowDownIntervalMs);
        intervalMultiplier = SLOW_DOWN_POLL_INTERVAL_MULTIPLIER;
        continue;
      }
      const descriptionSuffix = description ? `: ${description}` : "";
      throw new Error(`Device flow failed: ${error}${descriptionSuffix}`);
    }
  }
  if (slowDownResponses > 0)
    throw new Error(
      "Device flow timed out after one or more slow_down responses. This is often caused by clock drift in WSL or VM environments. Please sync or restart the VM clock and try again.",
    );
  throw new Error("Device flow timed out");
}
/**
 * Refresh GitHub Copilot token
 */
async function refreshGitHubCopilotToken(refreshToken, enterpriseDomain, options = {}) {
  const raw = await fetchJson(
    getUrls(enterpriseDomain || "github.com").copilotTokenUrl,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${refreshToken}`,
        ...COPILOT_HEADERS,
      },
    },
    "token refresh request",
    options,
  );
  if (!raw || typeof raw !== "object") throw new Error("Invalid Copilot token response");
  const token = raw.token;
  const expires = resolveExpiresAtFromEpochSeconds(raw.expires_at);
  if (typeof token !== "string" || expires === void 0)
    throw new Error("Invalid Copilot token response fields");
  return {
    refresh: refreshToken,
    access: token,
    expires,
    enterpriseUrl: enterpriseDomain,
  };
}
/**
 * Enable a model for the user's GitHub Copilot account.
 * This is required for some models (like Claude, Grok) before they can be used.
 */
async function enableGitHubCopilotModel(token, modelId, enterpriseDomain, options = {}) {
  const url = `${getGitHubCopilotBaseUrl(token, enterpriseDomain)}/models/${modelId}/policy`;
  let response;
  try {
    response = await fetchResponse(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...COPILOT_HEADERS,
          "openai-intent": "chat-policy",
          "x-interaction-type": "chat-policy",
        },
        body: JSON.stringify({ state: "enabled" }),
      },
      "model policy request",
      options,
    );
    return response.ok;
  } catch {
    return false;
  } finally {
    await response?.body?.cancel().catch(() => void 0);
  }
}
async function listGitHubCopilotModelIds(token, enterpriseDomain, options = {}) {
  const url = `${getGitHubCopilotBaseUrl(token, enterpriseDomain)}/models`;
  try {
    const raw = await fetchJson(
      url,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          ...COPILOT_HEADERS,
        },
      },
      "model list request",
      options,
    );
    const data = raw && typeof raw === "object" ? raw.data : void 0;
    if (!Array.isArray(data)) return [];
    return data.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const model = entry;
      const id = typeof model.id === "string" ? model.id.trim() : "";
      if (!id || id.startsWith(COPILOT_ROUTER_ID_PREFIX)) return [];
      if (model.object && model.object !== "model") return [];
      if (model.capabilities?.type && model.capabilities.type !== "chat") return [];
      return [id];
    });
  } catch {
    return [];
  }
}
/**
 * Enable GitHub Copilot models visible to this account.
 * Called after successful login to ensure available models are policy-enabled.
 */
async function enableAllGitHubCopilotModels(token, enterpriseDomain, onProgress) {
  const modelIds = await listGitHubCopilotModelIds(token, enterpriseDomain);
  await Promise.all(
    modelIds.map(async (modelId) => {
      const success = await enableGitHubCopilotModel(token, modelId, enterpriseDomain);
      onProgress?.(modelId, success);
    }),
  );
}
/**
 * Login with GitHub Copilot OAuth (device code flow)
 *
 * @param options.onAuth - Callback with URL and optional instructions (user code)
 * @param options.onPrompt - Callback to prompt user for input
 * @param options.onProgress - Optional progress callback
 * @param options.signal - Optional AbortSignal for cancellation
 */
async function loginGitHubCopilot(options) {
  const input = await options.onPrompt({
    message: "GitHub Enterprise URL/domain (blank for github.com)",
    placeholder: "company.ghe.com",
    allowEmpty: true,
  });
  if (options.signal?.aborted) throw new Error("Login cancelled");
  const trimmed = input.trim();
  const enterpriseDomain = normalizeDomain(input);
  if (trimmed && !enterpriseDomain) throw new Error("Invalid GitHub Enterprise URL/domain");
  const domain = enterpriseDomain || "github.com";
  const device = await startDeviceFlow(domain, { signal: options.signal });
  options.onAuth(device.verification_uri, `Enter code: ${device.user_code}`);
  const credentials = await refreshGitHubCopilotToken(
    await pollForGitHubAccessToken(
      domain,
      device.device_code,
      device.intervalMs,
      device.expiresAt,
      options.signal,
    ),
    enterpriseDomain ?? void 0,
  );
  options.onProgress?.("Enabling models...");
  await enableAllGitHubCopilotModels(credentials.access, enterpriseDomain ?? void 0);
  return credentials;
}
const githubCopilotOAuthProvider = {
  id: "github-copilot",
  name: "GitHub Copilot",
  async login(callbacks) {
    return loginGitHubCopilot({
      onAuth: (url, instructions) =>
        callbacks.onAuth({
          url,
          instructions,
        }),
      onPrompt: callbacks.onPrompt,
      onProgress: callbacks.onProgress,
      signal: callbacks.signal,
    });
  },
  async refreshToken(credentials) {
    const creds = credentials;
    return refreshGitHubCopilotToken(creds.refresh, creds.enterpriseUrl);
  },
  getApiKey(credentials) {
    return credentials.access;
  },
  modifyModels(models, credentials) {
    const creds = credentials;
    const domain = creds.enterpriseUrl ? (normalizeDomain(creds.enterpriseUrl) ?? void 0) : void 0;
    const baseUrl = getGitHubCopilotBaseUrl(creds.access, domain);
    return models.map((m) =>
      m.provider === "github-copilot"
        ? {
            ...m,
            baseUrl,
          }
        : m,
    );
  },
};
//#endregion
//#region src/llm/utils/oauth/openai-chatgpt.ts
const OPENAI_CODEX_PROVIDER_ID = "openai";
function loadOpenAICodexOAuthFacade() {
  return loadActivatedBundledPluginPublicSurfaceModuleSync({
    dirName: "openai",
    artifactBasename: "api.js",
  });
}
function createLegacyRuntime(callbacks) {
  return {
    log: (message) => callbacks.onProgress?.(String(message)),
    error: (message) => callbacks.onProgress?.(String(message)),
    exit: (code) => {
      throw new Error(`exit:${code}`);
    },
  };
}
function createLegacyPrompter(callbacks) {
  const progress = {
    update: (message) => callbacks.onProgress?.(message),
    stop: (message) => {
      if (message) callbacks.onProgress?.(message);
    },
  };
  return {
    intro: async () => {},
    outro: async () => {},
    note: async (message) => callbacks.onProgress?.(message),
    select: async (params) => params.options[0]?.value,
    multiselect: async (params) => params.initialValues ?? [],
    text: async (prompt) => {
      return await withOAuthLoginAbort(
        callbacks.onPrompt({
          message: prompt.message,
          placeholder: prompt.placeholder,
        }),
        callbacks.signal,
      );
    },
    confirm: async () => false,
    progress: () => progress,
  };
}
async function refreshViaProviderRuntime(refreshToken) {
  const { refreshProviderOAuthCredentialWithPlugin } =
    await import("./plugins/provider-runtime.runtime.js");
  const refreshed = await refreshProviderOAuthCredentialWithPlugin({
    provider: OPENAI_CODEX_PROVIDER_ID,
    context: {
      type: "oauth",
      provider: OPENAI_CODEX_PROVIDER_ID,
      access: "",
      refresh: refreshToken,
      expires: 0,
    },
  });
  if (!refreshed) return await loadOpenAICodexOAuthFacade().refreshOpenAICodexToken(refreshToken);
  const credentials = { ...refreshed };
  delete credentials.type;
  delete credentials.provider;
  return credentials;
}
/** Runs the ChatGPT/Codex OAuth login flow and returns normalized credentials. */
async function loginOpenAICodex(callbacks) {
  throwIfOAuthLoginAborted(callbacks.signal);
  const { loginOpenAICodexOAuth } = await import("./provider-openai-chatgpt-oauth-CEb8vs6S.js");
  const manualCodeInput = callbacks.onManualCodeInput;
  const onManualCodeInput = manualCodeInput
    ? async () => await withOAuthLoginAbort(manualCodeInput(), callbacks.signal)
    : void 0;
  const credentials = await withOAuthLoginAbort(
    loginOpenAICodexOAuth({
      prompter: createLegacyPrompter(callbacks),
      runtime: createLegacyRuntime(callbacks),
      isRemote: false,
      signal: callbacks.signal,
      onManualCodeInput,
      openUrl: async (url) => {
        throwIfOAuthLoginAborted(callbacks.signal);
        await callbacks.onAuth({ url });
      },
    }),
    callbacks.signal,
  );
  if (!credentials) throw new Error("OpenAI Codex OAuth login did not return credentials.");
  return credentials;
}
/** Refreshes a ChatGPT/Codex OAuth token through the provider runtime or bundled facade. */
async function refreshOpenAICodexToken(refreshToken) {
  return await refreshViaProviderRuntime(refreshToken);
}
//#endregion
//#region src/llm/utils/oauth/index.ts
const BUILT_IN_OAUTH_PROVIDERS = [
  anthropicOAuthProvider,
  githubCopilotOAuthProvider,
  {
    id: OPENAI_CODEX_PROVIDER_ID,
    name: "ChatGPT Plus/Pro (Codex Subscription)",
    usesCallbackServer: true,
    async login(callbacks) {
      return await loginOpenAICodex(callbacks);
    },
    async refreshToken(credentials) {
      return await refreshOpenAICodexToken(credentials.refresh);
    },
    getApiKey(credentials) {
      return credentials.access;
    },
  },
];
const oauthProviderRegistry = new Map(
  BUILT_IN_OAUTH_PROVIDERS.map((provider) => [provider.id, provider]),
);
/**
 * Get an OAuth provider by ID
 */
function getOAuthProvider(id) {
  return oauthProviderRegistry.get(id);
}
/**
 * Register a custom OAuth provider
 */
function registerOAuthProvider(provider) {
  oauthProviderRegistry.set(provider.id, provider);
}
/**
 * Reset OAuth providers to built-ins.
 */
function resetOAuthProviders() {
  oauthProviderRegistry.clear();
  for (const provider of BUILT_IN_OAUTH_PROVIDERS) oauthProviderRegistry.set(provider.id, provider);
}
/**
 * Get all registered OAuth providers
 */
function getOAuthProviders() {
  return Array.from(oauthProviderRegistry.values());
}
/**
 * Get API key for a provider from OAuth credentials.
 * Automatically refreshes expired tokens.
 *
 * @returns API key string and updated credentials, or null if no credentials
 * @throws Error if refresh fails
 */
async function getOAuthApiKey(providerId, credentials) {
  const provider = getOAuthProvider(providerId);
  if (!provider) throw new Error(`Unknown OAuth provider: ${providerId}`);
  let creds = credentials[providerId];
  if (!creds) return null;
  if (Date.now() >= creds.expires)
    try {
      creds = await provider.refreshToken(creds);
    } catch (error) {
      throw new Error(`Failed to refresh OAuth token for ${providerId}`, { cause: error });
    }
  const apiKey = provider.getApiKey(creds);
  return {
    newCredentials: creds,
    apiKey,
  };
}
//#endregion
export {
  resetOAuthProviders as a,
  registerOAuthProvider as i,
  getOAuthProvider as n,
  getOAuthProviders as r,
  getOAuthApiKey as t,
};
