import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/security/external-content-source.ts
/**
 * Resolve a hook session key into its external content source.
 * Unknown `hook:*` sessions are treated as webhooks so legacy/custom hooks stay wrapped.
 */
function resolveHookExternalContentSource(sessionKey) {
  const normalized = normalizeLowercaseStringOrEmpty(sessionKey);
  if (normalized.startsWith("hook:gmail:")) return "gmail";
  if (normalized.startsWith("hook:webhook:") || normalized.startsWith("hook:")) return "webhook";
}
/** Map hook session provenance to the prompt-facing external content source label. */
function mapHookExternalContentSource(source) {
  return source === "gmail" ? "email" : "webhook";
}
/** Return true when a session key should receive external-content prompt wrapping. */
function isExternalHookSession(sessionKey) {
  return resolveHookExternalContentSource(sessionKey) !== void 0;
}
//#endregion
export {
  mapHookExternalContentSource as n,
  resolveHookExternalContentSource as r,
  isExternalHookSession as t,
};
