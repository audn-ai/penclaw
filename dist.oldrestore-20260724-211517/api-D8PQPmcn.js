import { t as parseGeminiAuth } from "./gemini-auth-CDWMrlpW.js";
import "./provider-http-BDIltggC.js";
import {
  o as normalizeGoogleGenerativeAiBaseUrl,
  t as DEFAULT_GOOGLE_API_BASE_URL,
} from "./google-api-base-url-B0vh8Owj.js";
import "./thinking-api-BWA2Qah2.js";
import "./provider-policy-7Kv8Y-Tx.js";
import "./gemini-cli-provider-VkOog4cd.js";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-B3-rCSAh.js";
import { p as resolveProviderHttpRequestConfig } from "./shared-CfGzzOqJ.js";
import "./onboard-H3zK-CdP.js";
import "./transport-stream-C3mSLUWE.js";
import "./provider-registration-D5H1HDjc.js";
//#region extensions/google/api.ts
function resolveTrustedGoogleGenerativeAiBaseUrl(baseUrl) {
  const normalized =
    normalizeGoogleGenerativeAiBaseUrl(
      baseUrl ?? "https://generativelanguage.googleapis.com/v1beta",
    ) ?? "https://generativelanguage.googleapis.com/v1beta";
  let url;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error(
      "Google Generative AI baseUrl must be a valid https URL on generativelanguage.googleapis.com",
    );
  }
  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "generativelanguage.googleapis.com"
  )
    throw new Error(
      "Google Generative AI baseUrl must use https://generativelanguage.googleapis.com",
    );
  return normalized;
}
function resolveGoogleGenerativeAiHttpRequestConfig(params) {
  return resolveProviderHttpRequestConfig({
    baseUrl: resolveTrustedGoogleGenerativeAiBaseUrl(params.baseUrl),
    defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
    allowPrivateNetwork: params.request?.allowPrivateNetwork,
    headers: params.headers,
    request: params.request,
    defaultHeaders: {
      ...parseGeminiAuth(params.apiKey).headers,
      ...resolveGoogleApiClientHeaders({
        baseUrl: params.baseUrl,
        api: "google-generative-ai",
        capability: params.capability,
        transport: params.transport,
      }),
    },
    provider: "google",
    api: "google-generative-ai",
    capability: params.capability,
    transport: params.transport,
  });
}
//#endregion
export { resolveGoogleGenerativeAiHttpRequestConfig as t };
