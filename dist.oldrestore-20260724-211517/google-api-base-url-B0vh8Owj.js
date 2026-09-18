import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/google/src/google-api-base-url.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
function trimTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}
function isCanonicalGoogleApiOriginShorthand(value) {
  return /^https:\/\/generativelanguage\.googleapis\.com\/?$/i.test(value);
}
function isGoogleGenerativeAiUrl(url) {
  return (
    url.protocol === "https:" && url.hostname.toLowerCase() === "generativelanguage.googleapis.com"
  );
}
function stripUrlUserInfo(url) {
  url.username = "";
  url.password = "";
}
const GOOGLE_VERTEX_HOST = "aiplatform.googleapis.com";
const GOOGLE_VERTEX_REGION_HOST_SUFFIX = "-aiplatform.googleapis.com";
const GOOGLE_VERTEX_MULTI_REGION_HOSTS = /* @__PURE__ */ new Set([
  "aiplatform.eu.rep.googleapis.com",
  "aiplatform.us.rep.googleapis.com",
]);
function isGoogleVertexHostname(hostname) {
  const normalized = hostname.toLowerCase();
  return (
    normalized === GOOGLE_VERTEX_HOST ||
    normalized.endsWith(GOOGLE_VERTEX_REGION_HOST_SUFFIX) ||
    GOOGLE_VERTEX_MULTI_REGION_HOSTS.has(normalized)
  );
}
function isGoogleVertexBaseUrl(baseUrl) {
  const raw = normalizeOptionalString(baseUrl);
  if (!raw) return false;
  try {
    return isGoogleVertexHostname(new URL(raw).hostname);
  } catch {
    return false;
  }
}
function normalizeGoogleApiBaseUrl(baseUrl) {
  const raw = trimTrailingSlashes(
    normalizeOptionalString(baseUrl) || "https://generativelanguage.googleapis.com/v1beta",
  );
  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    stripUrlUserInfo(url);
    if (isGoogleGenerativeAiUrl(url))
      url.pathname = trimTrailingSlashes(url.pathname || "") || "/v1beta";
    return trimTrailingSlashes(url.toString());
  } catch {
    if (isCanonicalGoogleApiOriginShorthand(raw)) return DEFAULT_GOOGLE_API_BASE_URL;
    return raw;
  }
}
function isGoogleGenerativeAiApi(api) {
  return api === "google-generative-ai";
}
function normalizeGoogleGenerativeAiBaseUrl(baseUrl) {
  if (!baseUrl) return baseUrl;
  const normalized = normalizeGoogleApiBaseUrl(baseUrl);
  try {
    const url = new URL(normalized);
    stripUrlUserInfo(url);
    if (isGoogleGenerativeAiUrl(url)) {
      url.pathname = trimTrailingSlashes(url.pathname || "").replace(/\/openai$/i, "") || "/v1beta";
      return trimTrailingSlashes(url.toString());
    }
  } catch {}
  return normalized;
}
//#endregion
export {
  normalizeGoogleApiBaseUrl as a,
  isGoogleVertexHostname as i,
  isGoogleGenerativeAiApi as n,
  normalizeGoogleGenerativeAiBaseUrl as o,
  isGoogleVertexBaseUrl as r,
  DEFAULT_GOOGLE_API_BASE_URL as t,
};
