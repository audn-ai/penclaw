import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/config/sensitive-paths.ts
const NORMALIZED_SENSITIVE_KEY_WHITELIST_SUFFIXES = [
  "maxtokens",
  "maxoutputtokens",
  "maxinputtokens",
  "maxcompletiontokens",
  "contexttokens",
  "totaltokens",
  "tokencount",
  "tokenlimit",
  "tokenbudget",
  "passwordFile",
].map((suffix) => normalizeLowercaseStringOrEmpty(suffix));
const SENSITIVE_PATTERNS = [
  /token$/i,
  /password/i,
  /secret/i,
  /api.?key/i,
  /encrypt.?key/i,
  /private.?key/i,
  /serviceaccount(?:ref)?$/i,
];
function isWhitelistedSensitivePath(path) {
  const lowerPath = normalizeLowercaseStringOrEmpty(path);
  return NORMALIZED_SENSITIVE_KEY_WHITELIST_SUFFIXES.some((suffix) => lowerPath.endsWith(suffix));
}
function matchesSensitivePattern(path) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(path));
}
function isLocalServiceEnvValuePath(path) {
  return normalizeLowercaseStringOrEmpty(path).includes("localservice.env.");
}
/**
 * Classifies config paths whose values should be redacted from UI/API output.
 *
 * This intentionally works from path labels, not schema nodes, so plugin-owned
 * fields and raw local-service env vars get the same conservative treatment.
 */
function isSensitiveConfigPath(path) {
  return (
    isLocalServiceEnvValuePath(path) ||
    (!isWhitelistedSensitivePath(path) && matchesSensitivePattern(path))
  );
}
//#endregion
export { isSensitiveConfigPath as t };
