import { t as hasNonEmptyString$1 } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/browser/src/record-shared.ts
/**
 * Small record/string coercion helpers shared by Browser setup and audits.
 */
/** Re-export shared non-empty string predicate. */
const hasNonEmptyString = hasNonEmptyString$1;
/** Normalizes primitive string/number/boolean values to non-empty strings. */
function normalizeString(value) {
  if (typeof value === "string") return value.trim() || void 0;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
}
//#endregion
export { normalizeString as n, hasNonEmptyString as t };
