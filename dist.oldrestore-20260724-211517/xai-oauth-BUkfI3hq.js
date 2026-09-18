import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import {
  E as resolveExpiresAtMsFromEpochSeconds,
  T as resolveExpiresAtMsFromDurationSeconds,
  x as positiveSecondsToSafeMilliseconds,
} from "./number-coercion-CJQ8TR--.js";
import { n as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "./onboard-hMJBAw9W.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./response-limit-runtime-B_DBKaLw.js";
import { d as toFormUrlEncoded } from "./provider-auth-mypr64nh.js";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-C3SBJpUX.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { t as xaiUserAgent } from "./xai-user-agent-CGKMBFuk.js";
//#region extensions/xai/xai-oauth.ts
const PROVIDER_ID = "xai";
const XAI_OAUTH_METHOD_ID = "oauth";
const XAI_OAUTH_CHOICE_ID = "xai-oauth";
const XAI_DEVICE_CODE_METHOD_ID = "device-code";
const XAI_DEVICE_CODE_CHOICE_ID = "xai-device-code";
const XAI_OAUTH_CLIENT_ID = "b1a00492-073a-47ea-816f-4c329264a828";
const XAI_OAUTH_SCOPE = "openid profile email offline_access grok-cli:access api:access";
const XAI_OAUTH_ISSUER = "https://auth.x.ai";
const XAI_OAUTH_DISCOVERY_URL = `${XAI_OAUTH_ISSUER}/.well-known/openid-configuration`;
const XAI_LEGACY_OAUTH_TOKEN_ENDPOINT = `${XAI_OAUTH_ISSUER}/oauth/token`;
const XAI_OAUTH_TIMEOUT_MS = 300 * 1e3;
const XAI_OAUTH_FETCH_TIMEOUT_MS = 30 * 1e3;
const XAI_OAUTH_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
const XAI_OAUTH_REFRESH_MAX_ATTEMPTS = 3;
const XAI_OAUTH_REFRESH_RETRY_DELAY_MS = 250;
const XAI_DEVICE_CODE_DEFAULT_INTERVAL_MS = 5 * 1e3;
const XAI_DEVICE_CODE_MIN_INTERVAL_MS = 1 * 1e3;
const XAI_DEVICE_CODE_SLOW_DOWN_INCREMENT_MS = 5 * 1e3;
const XAI_DEVICE_CODE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";
function xaiOAuthFetchSignal(signal) {
  const timeout = AbortSignal.timeout(XAI_OAUTH_FETCH_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}
function getFetchImpl(fetchImpl) {
  return fetchImpl ?? fetch;
}
function isTrustedXaiOAuthEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") return false;
    return url.hostname === "x.ai" || url.hostname.endsWith(".x.ai");
  } catch {
    return false;
  }
}
function requireTrustedXaiOAuthEndpoint(endpoint, label) {
  if (!isTrustedXaiOAuthEndpoint(endpoint))
    throw new Error(`xAI OAuth discovery returned untrusted ${label}`);
  return endpoint;
}
function readStringRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
async function readResponseBody(response) {
  const buffer = await readResponseWithLimit(response, XAI_OAUTH_RESPONSE_MAX_BYTES, {
    onOverflow: ({ maxBytes }) =>
      /* @__PURE__ */ new Error(`xAI OAuth response exceeds ${maxBytes} bytes`),
  });
  const text = new TextDecoder().decode(buffer);
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return {
    json,
    text,
  };
}
async function readJsonResponse(response, context) {
  const body = await readResponseBody(response);
  if (!response.ok) {
    const errorText =
      readStringRecord(body.json).error_description ?? readStringRecord(body.json).error;
    throw new Error(
      `${context} failed (${response.status})${typeof errorText === "string" ? `: ${errorText}` : ""}`,
    );
  }
  return body.json;
}
async function fetchXaiOAuthDiscoveryDocument(options = {}) {
  return readStringRecord(
    await readJsonResponse(
      await getFetchImpl(options.fetchImpl)(XAI_OAUTH_DISCOVERY_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": xaiUserAgent(),
        },
        signal: xaiOAuthFetchSignal(options.signal),
      }),
      "xAI OAuth discovery",
    ),
  );
}
async function fetchXaiOAuthDiscovery(options = {}) {
  const tokenEndpoint = (await fetchXaiOAuthDiscoveryDocument(options)).token_endpoint;
  if (typeof tokenEndpoint !== "string")
    throw new Error("xAI OAuth discovery response is missing the token endpoint");
  return { tokenEndpoint: requireTrustedXaiOAuthEndpoint(tokenEndpoint, "token endpoint") };
}
async function fetchXaiDeviceCodeDiscovery(options = {}) {
  const json = await fetchXaiOAuthDiscoveryDocument(options);
  const deviceAuthorizationEndpoint = json.device_authorization_endpoint;
  const tokenEndpoint = json.token_endpoint;
  if (typeof deviceAuthorizationEndpoint !== "string" || typeof tokenEndpoint !== "string")
    throw new Error("xAI OAuth discovery response is missing device code endpoints");
  return {
    deviceAuthorizationEndpoint: requireTrustedXaiOAuthEndpoint(
      deviceAuthorizationEndpoint,
      "device authorization endpoint",
    ),
    tokenEndpoint: requireTrustedXaiOAuthEndpoint(tokenEndpoint, "token endpoint"),
  };
}
function normalizeExpires(value, now) {
  return resolveExpiresAtMsFromDurationSeconds(value, { nowMs: now() });
}
function parseXaiOAuthTokenResponse(value, now, options = {}) {
  const json = readStringRecord(value);
  const accessToken = json.access_token;
  if (typeof accessToken !== "string" || accessToken.trim().length === 0)
    throw new Error("xAI OAuth token response is missing access_token");
  const refreshToken =
    typeof json.refresh_token === "string" && json.refresh_token.trim().length > 0
      ? json.refresh_token
      : void 0;
  if (options.requireRefreshToken && !refreshToken)
    throw new Error(
      "xAI OAuth token response is missing refresh_token. Re-run the login; if the issue persists, the OAuth client is not configured to issue refresh tokens (commonly because the offline_access scope was rejected).",
    );
  const idToken =
    typeof json.id_token === "string" && json.id_token.trim().length > 0 ? json.id_token : void 0;
  const expires = normalizeExpires(json.expires_in, now) ?? deriveExpiresFromJwt(accessToken);
  return {
    accessToken,
    ...(refreshToken ? { refreshToken } : {}),
    ...(idToken ? { idToken } : {}),
    ...(expires ? { expires } : {}),
  };
}
function deriveExpiresFromJwt(token) {
  if (!token) return;
  const exp = decodeJwtPayload(token).exp;
  return resolveExpiresAtMsFromEpochSeconds(exp);
}
function parseXaiOAuthErrorResponse(value) {
  const json = readStringRecord(value);
  const error = typeof json.error === "string" ? json.error : void 0;
  const errorDescription =
    typeof json.error_description === "string" ? json.error_description : void 0;
  return {
    ...(error ? { error } : {}),
    ...(errorDescription ? { errorDescription } : {}),
  };
}
function formatXaiOAuthError(params) {
  const error = parseXaiOAuthErrorResponse(params.body);
  if (error.error && error.errorDescription)
    return `${params.context} failed (${params.status}): ${error.error} (${error.errorDescription})`;
  if (error.error) return `${params.context} failed (${params.status}): ${error.error}`;
  return `${params.context} failed (${params.status})`;
}
function isLikelyXaiCloudflareChallenge(params) {
  const contentType = params.response.headers.get("content-type") ?? "";
  return (
    params.response.headers.get("cf-mitigated") === "challenge" ||
    /text\/html/i.test(contentType) ||
    /<!doctype html|<html\b/i.test(params.bodyText) ||
    /\b(?:cloudflare|attention required|just a moment|enable javascript and cookies|challenge-platform)\b/i.test(
      params.bodyText,
    )
  );
}
function formatXaiOAuthCloudflareChallengeError(params) {
  return `${params.context} failed (${params.status}): xAI returned an HTML/Cloudflare challenge instead of OAuth JSON. xAI may be blocking the automated token refresh; try again later or re-run xAI OAuth login.`;
}
/**
 * Single source of truth for how a non-OK token response is reported and whether
 * it is worth retrying. Detection runs once so the message and the retry decision
 * never disagree: a structured OAuth error (e.g. invalid_grant) is authoritative
 * and final, while intermediary Cloudflare HTML challenges are retryable.
 */
function describeXaiOAuthTokenFailure(params) {
  const { context, response, body } = params;
  const status = response.status;
  const isCloudflareChallenge =
    !Boolean(parseXaiOAuthErrorResponse(body.json).error) &&
    isLikelyXaiCloudflareChallenge({
      response,
      bodyText: body.text,
    });
  return {
    message: isCloudflareChallenge
      ? formatXaiOAuthCloudflareChallengeError({
          context,
          status,
        })
      : formatXaiOAuthError({
          context,
          status,
          body: body.json,
        }),
    retryable: isCloudflareChallenge,
  };
}
async function exchangeXaiOAuthToken(params) {
  const endpoint = requireTrustedXaiOAuthEndpoint(params.tokenEndpoint, "token endpoint");
  const maxAttempts =
    params.body.grant_type === "refresh_token" ? XAI_OAUTH_REFRESH_MAX_ATTEMPTS : 1;
  let lastMessage = `${params.context} failed`;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response;
    try {
      response = await getFetchImpl(params.fetchImpl)(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": xaiUserAgent(),
        },
        body: toFormUrlEncoded(params.body),
        signal: xaiOAuthFetchSignal(params.signal),
      });
    } catch (err) {
      throw new Error(`${params.context} failed: ${formatErrorMessage(err)}`, { cause: err });
    }
    const body = await readResponseBody(response);
    if (response.ok)
      return parseXaiOAuthTokenResponse(body.json, params.now ?? Date.now, {
        requireRefreshToken: params.requireRefreshToken,
      });
    const failure = describeXaiOAuthTokenFailure({
      context: params.context,
      response,
      body,
    });
    lastMessage = failure.message;
    if (attempt >= maxAttempts || !failure.retryable) throw new Error(lastMessage);
    await sleep(XAI_OAUTH_REFRESH_RETRY_DELAY_MS);
  }
  throw new Error(lastMessage);
}
async function requestXaiDeviceCode(params) {
  const json = readStringRecord(
    await readJsonResponse(
      await getFetchImpl(params.fetchImpl)(
        requireTrustedXaiOAuthEndpoint(
          params.deviceAuthorizationEndpoint,
          "device authorization endpoint",
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            "User-Agent": xaiUserAgent(),
          },
          body: toFormUrlEncoded({
            client_id: XAI_OAUTH_CLIENT_ID,
            scope: XAI_OAUTH_SCOPE,
          }),
          signal: xaiOAuthFetchSignal(params.signal),
        },
      ),
      "xAI device code request",
    ),
  );
  const deviceCode = json.device_code;
  const userCode = json.user_code;
  const verificationUri = json.verification_uri;
  const verificationUriComplete = json.verification_uri_complete;
  if (
    typeof deviceCode !== "string" ||
    deviceCode.trim().length === 0 ||
    typeof userCode !== "string" ||
    userCode.trim().length === 0 ||
    typeof verificationUri !== "string" ||
    verificationUri.trim().length === 0
  )
    throw new Error(
      "xAI device code response is missing device_code, user_code, or verification_uri",
    );
  const trustedVerificationUri = requireTrustedXaiOAuthEndpoint(
    verificationUri,
    "device verification URI",
  );
  const trustedVerificationUriComplete =
    typeof verificationUriComplete === "string" && verificationUriComplete.trim().length > 0
      ? requireTrustedXaiOAuthEndpoint(verificationUriComplete, "complete device verification URI")
      : void 0;
  return {
    deviceCode,
    userCode,
    verificationUri: trustedVerificationUri,
    ...(trustedVerificationUriComplete
      ? { verificationUriComplete: trustedVerificationUriComplete }
      : {}),
    expiresInMs: positiveSecondsToSafeMilliseconds(json.expires_in) ?? XAI_OAUTH_TIMEOUT_MS,
    intervalMs:
      positiveSecondsToSafeMilliseconds(json.interval) ?? XAI_DEVICE_CODE_DEFAULT_INTERVAL_MS,
  };
}
function resolveNextXaiDeviceCodePollDelayMs(intervalMs, deadlineMs) {
  const remainingMs = Math.max(0, deadlineMs - Date.now());
  return Math.min(Math.max(intervalMs, XAI_DEVICE_CODE_MIN_INTERVAL_MS), remainingMs);
}
async function pollXaiDeviceCodeToken(params) {
  const fetchImpl = getFetchImpl(params.fetchImpl);
  const deadlineMs = Date.now() + params.expiresInMs;
  let intervalMs = params.intervalMs;
  while (Date.now() < deadlineMs) {
    const response = await fetchImpl(
      requireTrustedXaiOAuthEndpoint(params.tokenEndpoint, "token endpoint"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": xaiUserAgent(),
        },
        body: toFormUrlEncoded({
          grant_type: XAI_DEVICE_CODE_GRANT_TYPE,
          client_id: XAI_OAUTH_CLIENT_ID,
          device_code: params.deviceCode,
        }),
        signal: xaiOAuthFetchSignal(params.signal),
      },
    );
    let body;
    try {
      const buffer = await readResponseWithLimit(response, XAI_OAUTH_RESPONSE_MAX_BYTES, {
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`xAI device code response exceeds ${maxBytes} bytes`),
      });
      body = JSON.parse(new TextDecoder().decode(buffer));
    } catch {
      body = null;
    }
    if (response.ok)
      return parseXaiOAuthTokenResponse(body, params.now ?? Date.now, {
        requireRefreshToken: true,
      });
    const error = parseXaiOAuthErrorResponse(body).error;
    if (error === "authorization_pending") {
      await waitForXaiDeviceCodePoll(
        resolveNextXaiDeviceCodePollDelayMs(intervalMs, deadlineMs),
        params.signal,
      );
      continue;
    }
    if (error === "slow_down") {
      intervalMs += XAI_DEVICE_CODE_SLOW_DOWN_INCREMENT_MS;
      await waitForXaiDeviceCodePoll(
        resolveNextXaiDeviceCodePollDelayMs(intervalMs, deadlineMs),
        params.signal,
      );
      continue;
    }
    if (error === "access_denied" || error === "authorization_denied")
      throw new Error("xAI device authorization was denied");
    if (error === "expired_token") throw new Error("xAI device code expired. Re-run the login.");
    throw new Error(
      formatXaiOAuthError({
        context: "xAI device token exchange",
        status: response.status,
        body,
      }),
    );
  }
  throw new Error("xAI device authorization timed out");
}
async function waitForXaiDeviceCodePoll(delayMs, signal) {
  if (!signal) {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
    return;
  }
  await new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timeout);
      reject(
        signal.reason instanceof Error
          ? signal.reason
          : /* @__PURE__ */ new Error("xAI login cancelled"),
      );
    };
    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
}
function decodeJwtPayload(token) {
  if (!token) return {};
  const part = token.split(".")[1];
  if (!part) return {};
  try {
    return readStringRecord(JSON.parse(Buffer.from(part, "base64url").toString("utf8")));
  } catch {
    return {};
  }
}
function resolveXaiOAuthIdentity(tokens) {
  const payload = decodeJwtPayload(tokens.idToken ?? tokens.accessToken);
  const email = typeof payload.email === "string" ? payload.email : void 0;
  const name = typeof payload.name === "string" ? payload.name : void 0;
  const sub = typeof payload.sub === "string" ? payload.sub : void 0;
  return {
    ...(email ? { email } : {}),
    ...(name ? { displayName: name } : {}),
    ...(sub ? { accountId: sub } : {}),
  };
}
function readCredentialString(credential, key) {
  const value = credential[key];
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function isLegacyXaiOAuthTokenEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    return `${url.origin}${url.pathname}` === XAI_LEGACY_OAUTH_TOKEN_ENDPOINT;
  } catch {
    return false;
  }
}
async function resolveXaiOAuthRefreshTokenEndpoint(credential, options) {
  const cachedEndpoint = readCredentialString(credential, "tokenEndpoint");
  if (!cachedEndpoint || isLegacyXaiOAuthTokenEndpoint(cachedEndpoint))
    return (await fetchXaiOAuthDiscovery(options)).tokenEndpoint;
  return cachedEndpoint;
}
async function noteXaiDeviceCode(ctx, deviceCode) {
  const expiresInMinutes = Math.max(1, Math.round(deviceCode.expiresInMs / 6e4));
  if (ctx.prompter.deviceCode) {
    await ctx.prompter.deviceCode({
      title: "xAI OAuth",
      code: deviceCode.userCode,
      expiresInMinutes,
      message: "Enter this one-time code on the xAI sign-in page.",
    });
    return;
  }
  await ctx.prompter.note(
    [
      ctx.isRemote
        ? "Open this URL in your LOCAL browser and enter the code below."
        : "Open this URL in your browser and enter the code below.",
      `URL: ${deviceCode.verificationUriComplete ?? deviceCode.verificationUri}`,
      `Code: ${deviceCode.userCode}`,
      `Code expires in ${expiresInMinutes} minutes. Never share it.`,
    ].join("\n"),
    "xAI OAuth",
  );
}
async function loginXaiDeviceCode(ctx) {
  const progress = ctx.prompter.progress("Starting xAI OAuth...");
  try {
    const discovery = await fetchXaiDeviceCodeDiscovery(
      ctx.signal ? { signal: ctx.signal } : void 0,
    );
    progress.update("Requesting xAI OAuth device code...");
    const deviceCode = await requestXaiDeviceCode({
      deviceAuthorizationEndpoint: discovery.deviceAuthorizationEndpoint,
      ...(ctx.signal ? { signal: ctx.signal } : {}),
    });
    const browserUrl = deviceCode.verificationUriComplete ?? deviceCode.verificationUri;
    let openedBrowser = false;
    try {
      await ctx.openUrl(browserUrl);
      openedBrowser = true;
    } catch {
      ctx.runtime.log(`Open manually: ${deviceCode.verificationUri}`);
    }
    await noteXaiDeviceCode(ctx, deviceCode);
    const logUrl = deviceCode.verificationUri;
    if (ctx.isRemote) ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${logUrl}\n`);
    else if (openedBrowser) ctx.runtime.log(`Open: ${logUrl}`);
    progress.update("Waiting for xAI device authorization...");
    const tokens = await pollXaiDeviceCodeToken({
      tokenEndpoint: discovery.tokenEndpoint,
      deviceCode: deviceCode.deviceCode,
      expiresInMs: deviceCode.expiresInMs,
      intervalMs: deviceCode.intervalMs,
      ...(ctx.signal ? { signal: ctx.signal } : {}),
    });
    const identity = resolveXaiOAuthIdentity(tokens);
    progress.stop("xAI OAuth complete");
    return buildOauthProviderAuthResult({
      providerId: PROVIDER_ID,
      defaultModel: XAI_DEFAULT_MODEL_REF,
      access: tokens.accessToken,
      refresh: tokens.refreshToken,
      expires: tokens.expires,
      email: identity.email,
      displayName: identity.displayName,
      profileName: identity.email ?? identity.accountId,
      configPatch: applyXaiConfig(ctx.config),
      credentialExtra: {
        tokenEndpoint: discovery.tokenEndpoint,
        deviceAuthorizationEndpoint: discovery.deviceAuthorizationEndpoint,
        issuer: XAI_OAUTH_ISSUER,
        authFlow: "device-code",
        ...(tokens.idToken ? { idToken: tokens.idToken } : {}),
        ...(identity.accountId ? { accountId: identity.accountId } : {}),
      },
      notes: [
        "xAI OAuth uses device-code verification without requiring a localhost callback.",
        "xAI may label the consent app as Grok Build because OpenClaw uses xAI's shared OAuth client.",
      ],
    });
  } catch (err) {
    progress.stop("xAI OAuth failed");
    throw new Error(`xAI OAuth failed: ${formatErrorMessage(err)}`, { cause: err });
  }
}
async function refreshXaiOAuthCredential(credential, options = {}) {
  const refreshToken = credential.refresh;
  if (!refreshToken) throw new Error("xAI OAuth credential is missing refresh token");
  const tokenEndpoint = await resolveXaiOAuthRefreshTokenEndpoint(credential, options);
  const tokens = await exchangeXaiOAuthToken({
    ...options,
    tokenEndpoint,
    context: "xAI OAuth refresh",
    body: {
      grant_type: "refresh_token",
      client_id: XAI_OAUTH_CLIENT_ID,
      refresh_token: refreshToken,
    },
  });
  const identity = resolveXaiOAuthIdentity(tokens);
  return {
    ...credential,
    type: "oauth",
    provider: PROVIDER_ID,
    access: tokens.accessToken,
    refresh: tokens.refreshToken ?? refreshToken,
    ...(tokens.expires ? { expires: tokens.expires } : {}),
    ...(tokens.idToken ? { idToken: tokens.idToken } : {}),
    ...(identity.email ? { email: identity.email } : {}),
    ...(identity.displayName ? { displayName: identity.displayName } : {}),
    ...(identity.accountId ? { accountId: identity.accountId } : {}),
    tokenEndpoint,
    issuer: XAI_OAUTH_ISSUER,
  };
}
function createXaiOAuthAuthMethod() {
  return {
    id: XAI_OAUTH_METHOD_ID,
    label: "xAI OAuth",
    hint: "Remote-friendly browser sign-in without a localhost callback",
    kind: "oauth",
    wizard: {
      choiceId: XAI_OAUTH_CHOICE_ID,
      choiceLabel: "xAI OAuth",
      choiceHint: "Remote-friendly browser sign-in without a localhost callback",
      groupId: PROVIDER_ID,
      groupLabel: "xAI (Grok)",
      groupHint: "API key or OAuth",
      methodId: XAI_OAUTH_METHOD_ID,
    },
    run: async (ctx) => loginXaiDeviceCode(ctx),
  };
}
function createXaiDeviceCodeAuthMethod() {
  return {
    id: XAI_DEVICE_CODE_METHOD_ID,
    label: "xAI device code",
    hint: "Deprecated alias for xAI OAuth device-code login",
    kind: "device_code",
    wizard: {
      choiceId: XAI_DEVICE_CODE_CHOICE_ID,
      choiceLabel: "xAI device code",
      choiceHint: "Compatibility alias for xAI OAuth device-code sign-in",
      assistantVisibility: "manual-only",
      groupId: PROVIDER_ID,
      groupLabel: "xAI (Grok)",
      groupHint: "API key or OAuth",
      methodId: XAI_DEVICE_CODE_METHOD_ID,
    },
    run: async (ctx) => loginXaiDeviceCode(ctx),
  };
}
//#endregion
export {
  createXaiOAuthAuthMethod as a,
  loginXaiDeviceCode as c,
  createXaiDeviceCodeAuthMethod as i,
  refreshXaiOAuthCredential as l,
  XAI_OAUTH_DISCOVERY_URL as n,
  fetchXaiOAuthDiscovery as o,
  XAI_OAUTH_SCOPE as r,
  isTrustedXaiOAuthEndpoint as s,
  XAI_OAUTH_CLIENT_ID as t,
};
