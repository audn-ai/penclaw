import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/secrets/runtime-secret-scan.ts
/** Scans config-like values for SecretRefs and credential-looking fields. */
/** Field names treated as credential-bearing even before a value is converted to SecretRef. */
const CREDENTIAL_FIELD_NAMES = /* @__PURE__ */ new Set([
  "apikey",
  "key",
  "token",
  "secret",
  "password",
]);
function hasRecursiveSecretValue(params) {
  if (coerceSecretRef(params.value, params.defaults)) return true;
  if (!params.value || typeof params.value !== "object") return false;
  if (params.seen.has(params.value)) return false;
  params.seen.add(params.value);
  if (Array.isArray(params.value))
    return params.value.some((entry) =>
      hasRecursiveSecretValue({
        ...params,
        value: entry,
      }),
    );
  return Object.entries(params.value).some(([key, entry]) => {
    if (params.matchesEntry?.(key, entry)) return true;
    return hasRecursiveSecretValue({
      ...params,
      value: entry,
    });
  });
}
/**
 * Returns whether a value tree contains anything coercible to a SecretRef.
 * `seen` may be shared across sibling probes to preserve cycle safety.
 */
function hasSecretRefCandidate(value, defaults, seen = /* @__PURE__ */ new WeakSet()) {
  return hasRecursiveSecretValue({
    value,
    defaults,
    seen,
  });
}
/**
 * Returns whether a value tree contains SecretRefs or non-empty credential-looking fields.
 * Used before runtime fast-paths so enabled web tools do not skip secret-aware preparation.
 */
function hasCredentialBearingObjectValue(value, defaults, seen = /* @__PURE__ */ new WeakSet()) {
  return hasRecursiveSecretValue({
    value,
    defaults,
    seen,
    matchesEntry: (rawKey, entry) => {
      const key = rawKey.toLowerCase();
      return CREDENTIAL_FIELD_NAMES.has(key) && entry != null && entry !== "";
    },
  });
}
//#endregion
export { hasSecretRefCandidate as n, hasCredentialBearingObjectValue as t };
