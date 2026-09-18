import path from "node:path";
//#region packages/media-core/src/file-name.ts
/** Returns the final filename segment for either POSIX or Windows-style paths. */
function basenameFromAnyPath(value) {
  return path.win32.basename(path.posix.basename(value));
}
/** Returns the extension from the final filename segment of any path flavor. */
function extnameFromAnyPath(value) {
  return path.extname(basenameFromAnyPath(value));
}
/** Returns the extensionless filename from the final segment of any path flavor. */
function nameFromAnyPath(value) {
  const base = basenameFromAnyPath(value);
  const ext = path.extname(base);
  return path.basename(base, ext);
}
//#endregion
export { extnameFromAnyPath as n, nameFromAnyPath as r, basenameFromAnyPath as t };
