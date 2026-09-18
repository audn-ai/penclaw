//#region src/plugin-sdk/request-url.d.ts
/** Extract a string URL from the common request-like inputs accepted by fetch helpers. */
declare function resolveRequestUrl(input: RequestInfo | URL): string;
//#endregion
export { resolveRequestUrl };
