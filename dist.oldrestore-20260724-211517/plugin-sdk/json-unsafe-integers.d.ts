//#region src/agents/json-unsafe-integers.d.ts
/** Quotes integer literals above Number.MAX_SAFE_INTEGER before JSON.parse. */
declare function quoteUnsafeIntegerLiterals(input: string): string;
/** Parses JSON while preserving unsafe integer literals as strings. */
declare function parseJsonPreservingUnsafeIntegers(input: string): unknown;
/** Parses or accepts an object while preserving unsafe integer literals in string input. */
declare function parseJsonObjectPreservingUnsafeIntegers(
  value: unknown,
): Record<string, unknown> | null;
//#endregion
export {
  parseJsonObjectPreservingUnsafeIntegers,
  parseJsonPreservingUnsafeIntegers,
  quoteUnsafeIntegerLiterals,
};
