//#region packages/normalization-core/src/result.ts
/** Create a successful {@link Result}. */
function ok(value) {
  return {
    ok: true,
    value,
  };
}
/** Create a failed {@link Result}. */
function err(error) {
  return {
    ok: false,
    error,
  };
}
//#endregion
export { ok as n, err as t };
