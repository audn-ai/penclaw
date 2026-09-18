//#region packages/media-core/src/media-source-url.d.ts
/** Returns true for remote media URLs that should stay URL-backed instead of local-file-backed. */
declare function isPassThroughRemoteMediaSource(value: string | null | undefined): boolean;
//#endregion
export { isPassThroughRemoteMediaSource as t };
