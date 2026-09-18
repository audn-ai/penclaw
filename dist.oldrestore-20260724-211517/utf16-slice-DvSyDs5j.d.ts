//#region packages/normalization-core/src/utf16-slice.d.ts
/** Moves a chunk boundary away from the middle of a UTF-16 surrogate pair. */
declare function avoidTrailingHighSurrogateBreak(text: string, start: number, end: number): number;
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
declare function sliceUtf16Safe(input: string, start: number, end?: number): string;
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
declare function truncateUtf16Safe(input: string, maxLen: number): string;
//#endregion
export { sliceUtf16Safe as n, truncateUtf16Safe as r, avoidTrailingHighSurrogateBreak as t };
