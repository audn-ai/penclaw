import { randomBytes } from "node:crypto";
import { n as sha256Base64Url } from "./crypto-digest-CNeb2i19.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { T as resolveExpiresAtMsFromDurationSeconds } from "./number-coercion-CJQ8TR--.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import { t as buildOAuthRequestSignal } from "./provider-oauth-runtime-bxF650St.js";
import "./abort-BNMwuTLK.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/chutes-oauth.ts
/**
 * Implements Chutes OAuth PKCE, callback parsing, token exchange, and refresh
 * for agent model authentication.
 */
const CHUTES_OAUTH_REQUEST_TIMEOUT_MS = 3e4;
const CHUTES_OAUTH_ISSUER = "https://api.chutes.ai";
const CHUTES_AUTHORIZE_ENDPOINT = `${CHUTES_OAUTH_ISSUER}/idp/authorize`;
const CHUTES_TOKEN_ENDPOINT = `${CHUTES_OAUTH_ISSUER}/idp/token`;
const CHUTES_USERINFO_ENDPOINT = `${CHUTES_OAUTH_ISSUER}/idp/userinfo`;
const DEFAULT_EXPIRES_BUFFER_MS = 300 * 1e3;
/** Generates a PKCE verifier/challenge pair for Chutes login. */
function generateChutesPkce() {
  const verifier = randomBytes(32).toString("hex");
  return {
    verifier,
    challenge: sha256Base64Url(verifier),
  };
}
/** Parses pasted Chutes redirect input and enforces the expected OAuth state. */
function parseOAuthCallbackInput(input, expectedState) {
  const trimmed = input.trim();
  if (!trimmed) return { error: "No input provided" };
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    if (
      !/\s/.test(trimmed) &&
      !trimmed.includes("://") &&
      !trimmed.includes("?") &&
      !trimmed.includes("=")
    )
      return { error: "Paste the full redirect URL (must include code + state)." };
    const qs = trimmed.startsWith("?") ? trimmed : `?${trimmed}`;
    try {
      url = new URL(`http://localhost/${qs}`);
    } catch {
      return { error: "Paste the full redirect URL (must include code + state)." };
    }
  }
  const code = normalizeOptionalString(url.searchParams.get("code"));
  const state = normalizeOptionalString(url.searchParams.get("state"));
  if (!code) return { error: "Missing 'code' parameter in URL" };
  if (!state) return { error: "Missing 'state' parameter. Paste the full redirect URL." };
  if (state !== expectedState)
    return { error: "OAuth state mismatch - possible CSRF attack. Please retry login." };
  return {
    code,
    state,
  };
}
function resolveChutesExpiresAt(value, now) {
  return resolveExpiresAtMsFromDurationSeconds(value, {
    nowMs: now,
    bufferMs: DEFAULT_EXPIRES_BUFFER_MS,
    minRemainingMs: 3e4,
  });
}
async function cancelUnreadResponseBody(response) {
  if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
async function fetchChutesUserInfo(params) {
  const response = await (params.fetchFn ?? fetch)(CHUTES_USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${params.accessToken}` },
    signal: buildOAuthRequestSignal({ timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS }),
  });
  if (!response.ok) {
    await cancelUnreadResponseBody(response);
    return null;
  }
  const data = await readProviderJsonResponse(response, "Chutes userinfo");
  if (!data || typeof data !== "object") return null;
  return data;
}
/** Exchanges an authorization code for stored Chutes OAuth credentials. */
async function exchangeChutesCodeForTokens(params) {
  const fetchFn = params.fetchFn ?? fetch;
  const now = params.now ?? Date.now();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: params.app.clientId,
    code: params.code,
    redirect_uri: params.app.redirectUri,
    code_verifier: params.codeVerifier,
  });
  if (params.app.clientSecret) body.set("client_secret", params.app.clientSecret);
  const response = await fetchFn(CHUTES_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: buildOAuthRequestSignal({ timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS }),
  });
  await assertOkOrThrowProviderError(response, "Chutes token exchange failed");
  const data = await readProviderJsonResponse(response, "Chutes token exchange");
  const access = data.access_token?.trim();
  const refresh = data.refresh_token?.trim();
  const expires = resolveChutesExpiresAt(data.expires_in, now);
  if (!access) throw new Error("Chutes token exchange returned no access_token");
  if (!refresh) throw new Error("Chutes token exchange returned no refresh_token");
  if (expires === void 0) throw new Error("Chutes token exchange returned invalid expires_in");
  let info = null;
  try {
    info = await fetchChutesUserInfo({
      accessToken: access,
      fetchFn,
    });
  } catch {}
  return {
    access,
    refresh,
    expires,
    email: info?.username,
    accountId: info?.sub,
    clientId: params.app.clientId,
  };
}
/** Refreshes stored Chutes OAuth credentials, preserving refresh tokens when absent. */
async function refreshChutesTokens(params) {
  const fetchFn = params.fetchFn ?? fetch;
  const now = params.now ?? Date.now();
  const refreshToken = params.credential.refresh?.trim();
  if (!refreshToken) throw new Error("Chutes OAuth credential is missing refresh token");
  const clientId = params.credential.clientId?.trim() ?? process.env.CHUTES_CLIENT_ID?.trim();
  if (!clientId)
    throw new Error("Missing CHUTES_CLIENT_ID for Chutes OAuth refresh (set env var or re-auth).");
  const clientSecret = normalizeOptionalString(process.env.CHUTES_CLIENT_SECRET);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });
  if (clientSecret) body.set("client_secret", clientSecret);
  const response = await fetchFn(CHUTES_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: buildOAuthRequestSignal({ timeoutMs: CHUTES_OAUTH_REQUEST_TIMEOUT_MS }),
  });
  await assertOkOrThrowProviderError(response, "Chutes token refresh failed");
  const data = await readProviderJsonResponse(response, "Chutes token refresh");
  const access = data.access_token?.trim();
  const newRefresh = data.refresh_token?.trim();
  const expires = resolveChutesExpiresAt(data.expires_in, now);
  if (!access) throw new Error("Chutes token refresh returned no access_token");
  if (expires === void 0) throw new Error("Chutes token refresh returned invalid expires_in");
  return {
    ...params.credential,
    access,
    refresh: newRefresh || refreshToken,
    expires,
    clientId,
  };
}
//#endregion
export {
  refreshChutesTokens as a,
  parseOAuthCallbackInput as i,
  exchangeChutesCodeForTokens as n,
  generateChutesPkce as r,
  CHUTES_AUTHORIZE_ENDPOINT as t,
};
