//#region packages/normalization-core/src/expect.ts
/** Returns the value or throws with the named context; use for genuine invariants only. */
function expectDefined(value, context) {
  if (value === null || value === void 0) throw new Error("expected " + context + " to be defined");
  return value;
}
/** First element with honest optionality; callers own the absent case. */
function first(values) {
  return values.at(0);
}
/** Last element with honest optionality; callers own the absent case. */
function last(values) {
  return values.at(-1);
}
//#endregion
export { first as n, last as r, expectDefined as t };
