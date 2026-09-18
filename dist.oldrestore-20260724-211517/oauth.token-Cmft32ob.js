import {
  T as resolveExpiresAtMsFromDurationSeconds,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { r as resolveOAuthClientConfig } from "./oauth.credentials-BsHPp6q7.js";
import "./number-runtime-B-n-wjMn.js";
import "./provider-http-BDIltggC.js";
import { t as fetchWithTimeout } from "./oauth.http-C3HV9f9W.js";
import {
  n as resolveGooglePersonalOAuthIdentity,
  t as resolveGoogleOAuthIdentity,
} from "./oauth.project-ZJqDyPw8.js";
import { t as isGeminiCliPersonalOAuth } from "./oauth.settings-DI4C7qPo.js";
import { f as TOKEN_URL, s as REDIRECT_URI } from "./oauth.shared-BD6M390i.js";
import {
  g as readResponseTextLimited,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
//#region extensions/google/oauth.token.ts
const TOKEN_EXPIRY_BUFFER_MS = 300 * 1e3;
const GOOGLE_OAUTH_TOKEN_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
async function requestTokenGrant(body, signal) {
  const response = await fetchWithTimeout(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Accept: "*/*",
      "User-Agent": "google-api-nodejs-client/9.15.1",
    },
    body,
    ...(signal ? { signal } : {}),
  });
  if (!response.ok) {
    const errorText = await readResponseTextLimited(
      response,
      GOOGLE_OAUTH_TOKEN_ERROR_BODY_LIMIT_BYTES,
    );
    throw new Error(`Token exchange failed: ${errorText}`);
  }
  return readProviderJsonResponse(response, "google.token");
}
function resolveExpiredTokenTimestampMs(nowMs) {
  return asDateTimestampMs(nowMs - TOKEN_EXPIRY_BUFFER_MS) ?? nowMs;
}
function resolveTokenExpiresAt(value) {
  const nowMs = asDateTimestampMs(Date.now());
  if (nowMs === void 0) return 0;
  return (
    resolveExpiresAtMsFromDurationSeconds(value, {
      nowMs,
      bufferMs: TOKEN_EXPIRY_BUFFER_MS,
    }) ?? resolveExpiredTokenTimestampMs(nowMs)
  );
}
async function buildGeminiCliCredentials(params) {
  const accessToken = params.tokenResponse.access_token;
  if (!accessToken) throw new Error("No access token received. Please try again.");
  let identity = params.existing ?? {};
  try {
    if (!identity.email || !identity.projectId) {
      const discovered = await resolveGeminiCliIdentity(accessToken, params.signal);
      identity = {
        email: identity.email ?? discovered.email,
        projectId: identity.projectId ?? discovered.projectId,
      };
    }
  } catch (error) {
    if (!params.allowIdentityFallback || (!params.existing?.email && !params.existing?.projectId))
      throw error;
  }
  const expiresAt = resolveTokenExpiresAt(params.tokenResponse.expires_in);
  return {
    refresh: params.tokenResponse.refresh_token ?? params.refreshTokenFallback ?? "",
    access: accessToken,
    expires: expiresAt,
    projectId: identity.projectId,
    email: identity.email,
  };
}
async function resolveGeminiCliIdentity(accessToken, signal) {
  return isGeminiCliPersonalOAuth()
    ? await resolveGooglePersonalOAuthIdentity(accessToken, signal)
    : await resolveGoogleOAuthIdentity(accessToken, signal);
}
async function exchangeCodeForTokens(code, verifier, signal) {
  const { clientId, clientSecret } = resolveOAuthClientConfig();
  const body = new URLSearchParams({
    client_id: clientId,
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });
  if (clientSecret) body.set("client_secret", clientSecret);
  const refreshed = await buildGeminiCliCredentials({
    tokenResponse: await requestTokenGrant(body, signal),
    signal,
  });
  if (!refreshed.refresh) throw new Error("No refresh token received. Please try again.");
  return refreshed;
}
async function refreshTokensForGeminiCli(credentials) {
  const { clientId, clientSecret } = resolveOAuthClientConfig();
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: credentials.refresh,
  });
  if (clientSecret) body.set("client_secret", clientSecret);
  return await buildGeminiCliCredentials({
    tokenResponse: await requestTokenGrant(body),
    refreshTokenFallback: credentials.refresh,
    existing: {
      email: credentials.email,
      projectId: credentials.projectId,
    },
    allowIdentityFallback: true,
  });
}
//#endregion
export { refreshTokensForGeminiCli as n, exchangeCodeForTokens as t };
