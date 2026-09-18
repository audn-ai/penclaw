//#region src/gateway/server-methods/record-shared.ts
/**
 * Small normalization helpers shared by gateway request handlers.
 */
/** Returns a non-empty trimmed string, or `undefined` for non-string input. */
function normalizeTrimmedString(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
//#endregion
export { normalizeTrimmedString as t };
