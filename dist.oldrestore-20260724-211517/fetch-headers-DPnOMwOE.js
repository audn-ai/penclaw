//#region src/infra/fetch-headers.ts
function isHeadersLike(value) {
  if (typeof Headers !== "undefined" && value instanceof Headers) return true;
  const candidate = value;
  return (
    typeof candidate.entries === "function" &&
    typeof candidate.get === "function" &&
    typeof candidate[Symbol.iterator] === "function"
  );
}
/** Normalizes HeadersInit records so fetch receives only string-keyed header properties. */
function normalizeHeadersInitForFetch(headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers) || isHeadersLike(headers))
    return headers;
  if (Object.getOwnPropertySymbols(headers).length === 0) return headers;
  const normalized = Object.create(null);
  const headerRecord = headers;
  for (const key of Object.getOwnPropertyNames(headerRecord))
    normalized[key] = String(headerRecord[key]);
  return normalized;
}
/** Normalizes request init headers without cloning the init object when no change is needed. */
function normalizeRequestInitHeadersForFetch(init) {
  if (!init?.headers) return init;
  const headers = normalizeHeadersInitForFetch(init.headers);
  if (headers === init.headers) return init;
  return {
    ...init,
    headers,
  };
}
//#endregion
export { normalizeRequestInitHeadersForFetch as n, normalizeHeadersInitForFetch as t };
