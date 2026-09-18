import JSON5 from "json5";
//#region src/utils/parse-json-compat.ts
/**
 * JSON parser compatibility helper for persisted config, manifests, and legacy stores.
 * Strict JSON stays the fast path; JSON5 is only the authored/legacy fallback.
 */
/** Parses strict JSON first, then accepts JSON5 syntax such as comments and trailing commas. */
function parseJsonWithJson5Fallback(raw, json5 = JSON5) {
  try {
    return JSON.parse(raw);
  } catch {
    return json5.parse(raw);
  }
}
//#endregion
export { parseJsonWithJson5Fallback as t };
