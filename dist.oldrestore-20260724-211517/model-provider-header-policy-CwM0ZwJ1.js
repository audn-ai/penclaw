import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/secrets/model-provider-header-policy.ts
/** Classifies model-provider request headers that should be treated as credential material. */
/** Exact header names that always carry credential material for model provider requests. */
const ALWAYS_SENSITIVE_MODEL_PROVIDER_HEADER_NAMES = /* @__PURE__ */ new Set([
  "authorization",
  "proxy-authorization",
  "x-api-key",
  "api-key",
  "apikey",
  "x-auth-token",
  "auth-token",
  "x-access-token",
  "access-token",
  "x-secret-key",
  "secret-key",
]);
const SENSITIVE_MODEL_PROVIDER_HEADER_NAME_FRAGMENTS = [
  "api-key",
  "apikey",
  "token",
  "secret",
  "password",
  "credential",
];
/**
 * Returns whether a model-provider header name should be treated as secret-bearing.
 * This is intentionally conservative: false positives are audit noise, false negatives leak keys.
 */
function isLikelySensitiveModelProviderHeaderName(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (!normalized) return false;
  if (ALWAYS_SENSITIVE_MODEL_PROVIDER_HEADER_NAMES.has(normalized)) return true;
  return SENSITIVE_MODEL_PROVIDER_HEADER_NAME_FRAGMENTS.some((fragment) =>
    normalized.includes(fragment),
  );
}
//#endregion
export { isLikelySensitiveModelProviderHeaderName as t };
