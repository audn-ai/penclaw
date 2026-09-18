import {
  a as resolveTokenExpiryState,
  r as hasUsableOAuthCredential,
} from "./credential-state-DvOWxJSx.js";
import {
  d as isNonSecretApiKeyMarker,
  u as isKnownEnvApiKeyMarker,
} from "./model-auth-markers-CA2Xy59Z.js";
import {
  c as resolveDefaultSecretProviderAlias,
  s as isValidSecretRef,
} from "./ref-contract-DVV0zYUk.js";
import { g as resolveSecretInputRef, l as isSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/agents/auth-profiles/read-only-availability.ts
function hasSecret(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function hasMalformedSecretInputSyntax(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return (
    trimmed.startsWith("secretref-env:") ||
    trimmed.startsWith("__env__:") ||
    trimmed.startsWith("$")
  );
}
function resolveSecretRefReadOnlyAvailability(value, cfg, env) {
  if (!isSecretRef(value) || !isValidSecretRef(value)) return false;
  const source = cfg.secrets?.providers?.[value.provider];
  if (
    (!source &&
      (value.source !== "env" ||
        value.provider !== resolveDefaultSecretProviderAlias(cfg, "env"))) ||
    (source && source.source !== value.source)
  )
    return false;
  if (value.source === "env")
    return source?.source === "env" && source.allowlist && !source.allowlist.includes(value.id)
      ? false
      : hasSecret(env[value.id])
        ? true
        : void 0;
  if (
    value.source === "file" &&
    source?.source === "file" &&
    (source.mode === "singleValue") !== (value.id === "value")
  )
    return false;
}
function resolveSecretInputReadOnlyAvailability(value, refValue, cfg, env) {
  const { ref } = resolveSecretInputRef({
    value,
    refValue,
    defaults: cfg.secrets?.defaults,
  });
  if (ref) return resolveSecretRefReadOnlyAvailability(ref, cfg, env);
  if (!hasSecret(value)) return false;
  if (hasMalformedSecretInputSyntax(value)) return false;
  return isKnownEnvApiKeyMarker(value)
    ? hasSecret(env[value.trim()])
    : isNonSecretApiKeyMarker(value)
      ? void 0
      : true;
}
function resolveStoredCredentialReadOnlyAvailability(params) {
  const { credential, cfg, env } = params;
  const now = params.now ?? Date.now();
  if (credential.type === "api_key")
    return resolveSecretInputReadOnlyAvailability(credential.key, credential.keyRef, cfg, env);
  if (credential.type === "token") {
    const expiryState = resolveTokenExpiryState(credential.expires, now);
    if (expiryState === "expired" || expiryState === "invalid_expires") return false;
    return resolveSecretInputReadOnlyAvailability(credential.token, credential.tokenRef, cfg, env);
  }
  if (hasUsableOAuthCredential(credential, { now })) return true;
  if (hasSecret(credential.refresh)) return params.canRefreshOAuth ? true : void 0;
  return credential.oauthRef && !hasSecret(credential.access) ? void 0 : false;
}
//#endregion
export {
  resolveSecretRefReadOnlyAvailability as n,
  resolveStoredCredentialReadOnlyAvailability as r,
  hasMalformedSecretInputSyntax as t,
};
