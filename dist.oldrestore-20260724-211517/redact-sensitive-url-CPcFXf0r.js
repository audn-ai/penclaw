//#region packages/net-policy/src/redact-sensitive-url.ts
function normalizeLowercaseStringOrEmpty(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
/** Config UI hint tag for URL-like values that may embed credentials or tokens. */
const SENSITIVE_URL_HINT_TAG = "url-secret";
const SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
  "token",
  "key",
  "api_key",
  "apikey",
  "secret",
  "access_token",
  "auth_token",
  "password",
  "pass",
  "passwd",
  "auth",
  "jwt",
  "session",
  "id_token",
  "code",
  "client_secret",
  "app_secret",
  "hook_token",
  "refresh_token",
  "signature",
  "x_amz_signature",
  "x_amz_security_token",
  "private_key",
  "credential",
  "authorization",
]);
const URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const TELEGRAM_BOT_TOKEN_PATH_RE = /\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu;
function redactSensitiveUrlPath(value) {
  return value.replace(TELEGRAM_BOT_TOKEN_PATH_RE, "/bot***");
}
function normalizeUrlQueryParamName(name) {
  const stripped = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
  try {
    return normalizeLowercaseStringOrEmpty(
      decodeURIComponent(stripped).replace(URL_QUERY_NAME_SEPARATOR_RE, ""),
    ).replaceAll("-", "_");
  } catch {
    return normalizeLowercaseStringOrEmpty(stripped).replaceAll("-", "_");
  }
}
/** True for auth-like URL query parameter names that should be redacted. */
function isSensitiveUrlQueryParamName(name) {
  const normalized = normalizeUrlQueryParamName(name);
  return SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized);
}
/** True for config paths whose URL values may contain credentials or secret query params. */
function isSensitiveUrlConfigPath(path) {
  if (path.endsWith(".baseUrl") || path.endsWith(".httpUrl")) return true;
  if (path.endsWith(".cdpUrl")) return true;
  if (path.endsWith(".request.proxy.url")) return true;
  return /^(?:nodeHost\.)?mcp\.servers\.(?:\*|[^.]+)\.url$/.test(path);
}
/** True when a config UI hint explicitly marks a URL-like value as secret-bearing. */
function hasSensitiveUrlHintTag(hint) {
  return hint?.tags?.includes(SENSITIVE_URL_HINT_TAG) === true;
}
/** Redacts credentials and sensitive query params from parseable URLs. */
function redactSensitiveUrl(value) {
  try {
    const parsed = new URL(value);
    let mutated = false;
    const redactedPath = redactSensitiveUrlPath(parsed.pathname);
    if (redactedPath !== parsed.pathname) {
      parsed.pathname = redactedPath;
      mutated = true;
    }
    if (parsed.username || parsed.password) {
      parsed.username = parsed.username ? "***" : "";
      parsed.password = parsed.password ? "***" : "";
      mutated = true;
    }
    for (const key of Array.from(parsed.searchParams.keys()))
      if (isSensitiveUrlQueryParamName(key)) {
        parsed.searchParams.set(key, "***");
        mutated = true;
      }
    return mutated ? parsed.toString() : value;
  } catch {
    return value;
  }
}
/** Redacts sensitive URL-looking substrings even when the full value is not a valid URL. */
function redactSensitiveUrlLikeString(value) {
  const redactedUrl = redactSensitiveUrl(value);
  if (redactedUrl !== value) return redactedUrl;
  return redactSensitiveUrlPath(
    value
      .replace(/\/\/([^@/?#\s]+)@/g, "//***:***@")
      .replace(/([?&])([^=&]+)=([^&]*)/g, (match, prefix, key) =>
        isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match,
      ),
  );
}
//#endregion
export {
  redactSensitiveUrl as a,
  isSensitiveUrlQueryParamName as i,
  hasSensitiveUrlHintTag as n,
  redactSensitiveUrlLikeString as o,
  isSensitiveUrlConfigPath as r,
  SENSITIVE_URL_HINT_TAG as t,
};
