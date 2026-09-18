//#region packages/net-policy/src/url-protocol.ts
const HTTP_URL_PREFIX_RE = /^https?:\/\//i;
function parseUrl(value) {
  if (value instanceof URL) return value;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}
function hasHttpUrlPrefix(value) {
  return HTTP_URL_PREFIX_RE.test(value);
}
function isHttpUrl(value) {
  const url = parseUrl(value);
  return url?.protocol === "http:" || url?.protocol === "https:";
}
function isHttpsUrl(value) {
  return parseUrl(value)?.protocol === "https:";
}
function isWebSocketUrl(value) {
  const url = parseUrl(value);
  return url?.protocol === "ws:" || url?.protocol === "wss:";
}
//#endregion
export { isWebSocketUrl as i, isHttpUrl as n, isHttpsUrl as r, hasHttpUrlPrefix as t };
