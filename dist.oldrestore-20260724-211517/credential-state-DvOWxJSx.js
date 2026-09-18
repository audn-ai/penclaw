import "./number-coercion-CJQ8TR--.js";
import { p as normalizeSecretInputString, s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/agents/auth-profiles/credential-state.ts
/**
 * Credential state classification for auth profiles.
 * Centralizes expiry, missing-secret, and unresolved-reference checks used by
 * auth selection, refresh, health, and doctor flows.
 */
/** Default OAuth access-token refresh margin before expiry. */
const DEFAULT_OAUTH_REFRESH_MARGIN_MS = 300 * 1e3;
/** Classifies a token expiry timestamp for auth selection and refresh logic. */
function resolveTokenExpiryState(expires, now = Date.now(), opts) {
  if (expires === void 0) return "missing";
  if (typeof expires !== "number") return "invalid_expires";
  if (!Number.isFinite(expires) || expires <= 0 || expires > 864e13) return "invalid_expires";
  const remainingMs = expires - now;
  if (remainingMs <= 0) return "expired";
  const expiringWithinMs = Math.max(0, opts?.expiringWithinMs ?? 0);
  if (expiringWithinMs > 0 && remainingMs <= expiringWithinMs) return "expiring";
  return "valid";
}
/** Returns true when an OAuth credential has a non-expiring access token. */
function hasUsableOAuthCredential(credential, opts) {
  if (!credential || credential.type !== "oauth") return false;
  if (typeof credential.access !== "string" || credential.access.trim().length === 0) return false;
  const now = opts?.now ?? Date.now();
  const refreshMarginMs = Math.max(0, opts?.refreshMarginMs ?? 3e5);
  return (
    resolveTokenExpiryState(credential.expires, now, { expiringWithinMs: refreshMarginMs }) ===
    "valid"
  );
}
function hasConfiguredSecretRef(value) {
  return coerceSecretRef(value) !== null;
}
function hasConfiguredSecretString(value) {
  return normalizeSecretInputString(value) !== void 0;
}
function isMalformedApiKeyInput(value) {
  const normalized = normalizeSecretInputString(value);
  return (
    normalized !== void 0 &&
    /^openclaw\s+onboard(?:\s+.*)?\s+--auth-choice(?:\s|=|$)/i.test(normalized)
  );
}
/** Classifies whether a stored credential is eligible for auth selection. */
function evaluateStoredCredentialEligibility(params) {
  const now = params.now ?? Date.now();
  const credential = params.credential;
  if (credential.type === "api_key") {
    const hasKey = hasConfiguredSecretString(credential.key);
    const hasKeyRef = hasConfiguredSecretRef(credential.keyRef);
    if (isMalformedApiKeyInput(credential.key))
      return {
        eligible: false,
        reasonCode: "malformed_api_key",
      };
    if (!hasKey && !hasKeyRef)
      return {
        eligible: false,
        reasonCode: "missing_credential",
      };
    return {
      eligible: true,
      reasonCode: "ok",
    };
  }
  if (credential.type === "token") {
    const hasToken = hasConfiguredSecretString(credential.token);
    const hasTokenRef = hasConfiguredSecretRef(credential.tokenRef);
    if (!hasToken && !hasTokenRef)
      return {
        eligible: false,
        reasonCode: "missing_credential",
      };
    const expiryState = resolveTokenExpiryState(credential.expires, now);
    if (expiryState === "invalid_expires")
      return {
        eligible: false,
        reasonCode: "invalid_expires",
      };
    if (expiryState === "expired")
      return {
        eligible: false,
        reasonCode: "expired",
      };
    return {
      eligible: true,
      reasonCode: "ok",
    };
  }
  if (
    normalizeSecretInputString(credential.access) === void 0 &&
    normalizeSecretInputString(credential.refresh) === void 0
  ) {
    if (credential.oauthRef)
      return {
        eligible: false,
        reasonCode: "unresolved_ref",
      };
    return {
      eligible: false,
      reasonCode: "missing_credential",
    };
  }
  return {
    eligible: true,
    reasonCode: "ok",
  };
}
//#endregion
export {
  resolveTokenExpiryState as a,
  isMalformedApiKeyInput as i,
  evaluateStoredCredentialEligibility as n,
  hasUsableOAuthCredential as r,
  DEFAULT_OAUTH_REFRESH_MARGIN_MS as t,
};
