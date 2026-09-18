//#region packages/media-core/src/media-source-url.ts
const HTTP_URL_RE = /^https?:\/\//i;
const MXC_URL_RE = /^mxc:\/\//i;
const BUFFER_URL_RE = /^buffer:\/\//i;
/** Returns true for remote media URLs that should stay URL-backed instead of local-file-backed. */
function isPassThroughRemoteMediaSource(value) {
  const normalized = value?.trim() ?? "";
  return (
    Boolean(normalized) &&
    (HTTP_URL_RE.test(normalized) || MXC_URL_RE.test(normalized) || BUFFER_URL_RE.test(normalized))
  );
}
//#endregion
export { isPassThroughRemoteMediaSource as t };
