//#region packages/acp-core/src/meta.d.ts
/** Reads the first present string metadata value from a current-to-legacy key list. */
declare function readString(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): string | undefined;
/** Reads the first boolean metadata value without dropping false. */
declare function readBool(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): boolean | undefined;
/** Reads the first finite numeric metadata value from a current-to-legacy key list. */
declare function readNumber(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): number | undefined;
/** Reads the first safe non-negative integer metadata value, preserving zero. */
declare function readNonNegativeInteger(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): number | undefined;
//#endregion
export { readString as i, readNonNegativeInteger as n, readNumber as r, readBool as t };
