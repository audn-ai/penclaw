import { t as normalizeHeadersInitForFetch } from "./fetch-headers-DPnOMwOE.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/net/redirect-headers.ts
const CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = /* @__PURE__ */ new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "cache-control",
  "content-language",
  "content-type",
  "if-match",
  "if-modified-since",
  "if-none-match",
  "if-unmodified-since",
  "pragma",
  "range",
  "user-agent",
]);
/**
 * Keeps only headers that are safe to replay after a redirect crosses origins.
 * Authorization/cookie-like metadata must be dropped before the follow-up fetch.
 */
function retainSafeHeadersForCrossOriginRedirect(headers) {
  if (!headers) return headers;
  const incoming = new Headers(normalizeHeadersInitForFetch(headers));
  const safeHeaders = {};
  for (const [key, value] of incoming.entries())
    if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has(normalizeLowercaseStringOrEmpty(key)))
      safeHeaders[key] = value;
  return safeHeaders;
}
//#endregion
export { retainSafeHeadersForCrossOriginRedirect as t };
