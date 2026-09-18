//#region packages/media-core/src/file-name.d.ts
/** Returns the final filename segment for either POSIX or Windows-style paths. */
declare function basenameFromAnyPath(value: string): string;
/** Returns the extension from the final filename segment of any path flavor. */
declare function extnameFromAnyPath(value: string): string;
/** Returns the extensionless filename from the final segment of any path flavor. */
declare function nameFromAnyPath(value: string): string;
//#endregion
export { extnameFromAnyPath as n, nameFromAnyPath as r, basenameFromAnyPath as t };
