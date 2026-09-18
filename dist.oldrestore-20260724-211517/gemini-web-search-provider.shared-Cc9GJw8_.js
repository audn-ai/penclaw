import { a as normalizeGoogleApiBaseUrl } from "./google-api-base-url-B0vh8Owj.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/google/src/gemini-web-search-provider.shared.ts
const DEFAULT_GEMINI_WEB_SEARCH_MODEL = "gemini-2.5-flash";
function resolveGeminiConfig(searchConfig) {
  const gemini = searchConfig?.gemini;
  return isRecord(gemini) ? gemini : {};
}
function resolveGeminiModel(gemini) {
  return normalizeOptionalString(gemini?.model) ?? DEFAULT_GEMINI_WEB_SEARCH_MODEL;
}
function resolveGeminiBaseUrl(gemini) {
  return normalizeGoogleApiBaseUrl(
    normalizeOptionalString(gemini?.baseUrl) ?? normalizeOptionalString(gemini?.providerBaseUrl),
  );
}
//#endregion
export { resolveGeminiConfig as n, resolveGeminiModel as r, resolveGeminiBaseUrl as t };
