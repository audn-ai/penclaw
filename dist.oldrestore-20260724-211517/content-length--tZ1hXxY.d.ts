//#region packages/media-core/src/content-length.d.ts
/** Parses a Content-Length header as a safe integer or rejects malformed values. */
declare function parseMediaContentLength(raw: string | null): number | null;
//#endregion
export { parseMediaContentLength as t };
