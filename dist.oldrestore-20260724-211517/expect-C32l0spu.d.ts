//#region packages/normalization-core/src/expect.d.ts
/** Returns the value or throws with the named context; use for genuine invariants only. */
declare function expectDefined<T>(value: T | null | undefined, context: string): T;
/** First element with honest optionality; callers own the absent case. */
declare function first<T>(values: readonly T[]): T | undefined;
/** Last element with honest optionality; callers own the absent case. */
declare function last<T>(values: readonly T[]): T | undefined;
//#endregion
export { first as n, last as r, expectDefined as t };
