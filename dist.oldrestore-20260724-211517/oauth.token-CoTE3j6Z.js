import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { T as resolveExpiresAtMsFromDurationSeconds } from "./number-coercion-CJQ8TR--.js";
import {
  m as readProviderJsonResponse,
  o as createProviderHttpError,
} from "./provider-http-errors-DLMRBkZU.js";
import "./number-runtime-B-n-wjMn.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
//#region extensions/msteams/src/http-error.ts
async function createMSTeamsHttpError(response, label, options) {
  return await createProviderHttpError(response, label, options);
}
//#endregion
//#region extensions/msteams/src/oauth.shared.ts
const MSTEAMS_OAUTH_REDIRECT_URI = "http://localhost:8086/oauth2callback";
const MSTEAMS_OAUTH_CALLBACK_PORT = 8086;
const MSTEAMS_OAUTH_CALLBACK_PATH = "/oauth2callback";
const MSTEAMS_DEFAULT_TOKEN_FETCH_TIMEOUT_MS = 1e4;
const MSTEAMS_DEFAULT_DELEGATED_SCOPES = [
  "ChatMessage.Send",
  "ChannelMessage.Send",
  "Chat.ReadWrite",
  "offline_access",
];
function buildMSTeamsAuthEndpoint(tenantId) {
  return `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize`;
}
function buildMSTeamsTokenEndpoint(tenantId) {
  return `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
}
//#endregion
//#region extensions/msteams/src/oauth.token.ts
/** Five-minute buffer subtracted from token expiry to avoid edge-case clock drift. */
const EXPIRY_BUFFER_MS = 300 * 1e3;
function createMSTeamsTokenBody(params) {
  const body = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    grant_type: params.grantType,
    scope: [...params.scopes].join(" "),
  });
  for (const [key, value] of Object.entries(params.values ?? {})) body.set(key, value);
  return body;
}
function resolveMSTeamsTokenExpiresAt(value) {
  return resolveExpiresAtMsFromDurationSeconds(value, { bufferMs: EXPIRY_BUFFER_MS });
}
function parseMSTeamsTokenResponse(data, failureLabel) {
  const expiresAt = resolveMSTeamsTokenExpiresAt(data.expires_in);
  if (
    typeof data.access_token !== "string" ||
    !data.access_token ||
    expiresAt === void 0 ||
    (data.refresh_token !== void 0 && typeof data.refresh_token !== "string") ||
    (data.scope !== void 0 && typeof data.scope !== "string")
  )
    throw new Error(`MSTeams ${failureLabel} failed: invalid token response fields`);
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiresAt,
    scope: data.scope,
  };
}
async function fetchMSTeamsTokens(params) {
  const { response, release } = await fetchWithSsrFGuard({
    url: params.tokenUrl,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      body: params.body,
      signal: AbortSignal.timeout(MSTEAMS_DEFAULT_TOKEN_FETCH_TIMEOUT_MS),
    },
    auditContext: params.auditContext,
  });
  try {
    if (!response.ok)
      throw await createMSTeamsHttpError(response, `MSTeams ${params.failureLabel} failed`);
    return parseMSTeamsTokenResponse(
      await readProviderJsonResponse(response, `MSTeams ${params.failureLabel} failed`),
      params.failureLabel,
    );
  } finally {
    await release();
  }
}
async function requestMSTeamsDelegatedTokens(params) {
  const scopes = params.scopes ?? MSTEAMS_DEFAULT_DELEGATED_SCOPES;
  const body = createMSTeamsTokenBody({
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    grantType: params.grantType,
    scopes,
    values: params.values,
  });
  const data = await fetchMSTeamsTokens({
    tokenUrl: buildMSTeamsTokenEndpoint(params.tenantId),
    body,
    auditContext: params.auditContext,
    failureLabel: params.failureLabel,
  });
  return {
    accessToken: data.access_token,
    refreshToken: params.resolveRefreshToken(data),
    expiresAt: data.expiresAt,
    scopes: data.scope ? data.scope.split(" ") : [...scopes],
  };
}
async function exchangeMSTeamsCodeForTokens(params) {
  return await requestMSTeamsDelegatedTokens({
    tenantId: params.tenantId,
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    grantType: "authorization_code",
    scopes: params.scopes,
    values: {
      code: params.code,
      redirect_uri: MSTEAMS_OAUTH_REDIRECT_URI,
      code_verifier: params.verifier,
    },
    auditContext: "msteams-oauth-token-exchange",
    failureLabel: "token exchange",
    resolveRefreshToken: (data) => {
      if (!data.refresh_token)
        throw new Error("No refresh token received from Azure AD. Please try again.");
      return data.refresh_token;
    },
  });
}
async function refreshMSTeamsDelegatedTokens(params) {
  return await requestMSTeamsDelegatedTokens({
    tenantId: params.tenantId,
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    grantType: "refresh_token",
    scopes: params.scopes,
    values: { refresh_token: params.refreshToken },
    auditContext: "msteams-oauth-token-refresh",
    failureLabel: "token refresh",
    resolveRefreshToken: (data) => data.refresh_token ?? params.refreshToken,
  });
}
//#endregion
export {
  MSTEAMS_OAUTH_CALLBACK_PORT as a,
  createMSTeamsHttpError as c,
  MSTEAMS_OAUTH_CALLBACK_PATH as i,
  refreshMSTeamsDelegatedTokens as n,
  MSTEAMS_OAUTH_REDIRECT_URI as o,
  MSTEAMS_DEFAULT_DELEGATED_SCOPES as r,
  buildMSTeamsAuthEndpoint as s,
  exchangeMSTeamsCodeForTokens as t,
};
