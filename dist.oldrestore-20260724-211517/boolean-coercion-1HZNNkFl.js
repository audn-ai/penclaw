//#region packages/normalization-core/src/boolean-coercion.ts
/** Parses booleans and case-insensitive `true`/`false` string tokens. */
function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
}
//#endregion
export { parseBoolean as t };
