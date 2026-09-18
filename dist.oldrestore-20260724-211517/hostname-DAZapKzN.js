import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/net/hostname.ts
/** Normalize a hostname for policy comparisons. */
function normalizeHostname(hostname) {
  const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
  if (normalized.startsWith("[") && normalized.endsWith("]")) return normalized.slice(1, -1);
  return normalized;
}
//#endregion
export { normalizeHostname as t };
