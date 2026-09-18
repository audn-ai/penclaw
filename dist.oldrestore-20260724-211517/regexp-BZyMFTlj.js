//#region src/shared/regexp.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//#endregion
export { escapeRegExp as t };
