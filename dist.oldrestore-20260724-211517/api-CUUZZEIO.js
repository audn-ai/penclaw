import { t as isXaiProviderId } from "./provider-id-DOYNBqSl.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./model-compat-ZOv4pn6r.js";
import "./model-definitions-BoOPeWPv.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./provider-catalog-Dy-HwcwL.js";
import "./onboard-hMJBAw9W.js";
import "./image-generation-provider-C2Q7X_vh.js";
import "./runtime-model-compat-gatOcnur.js";
import "./provider-models-BF6xVwo8.js";
//#region extensions/xai/api.ts
const XAI_NATIVE_ENDPOINT_HOSTS = /* @__PURE__ */ new Set(["api.x.ai"]);
function resolveHostname(value) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return;
  }
}
function isXaiNativeEndpoint(baseUrl) {
  return (
    typeof baseUrl === "string" && XAI_NATIVE_ENDPOINT_HOSTS.has(resolveHostname(baseUrl) ?? "")
  );
}
function isXaiModelHint(modelId) {
  return getModelProviderHint(modelId) === "x-ai";
}
function getModelProviderHint(modelId) {
  const trimmed = normalizeOptionalLowercaseString(modelId);
  if (!trimmed) return null;
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) return null;
  return trimmed.slice(0, slashIndex) || null;
}
function shouldUseXaiResponsesTransport(params) {
  const hasDefaultXaiRoute =
    isXaiProviderId(params.provider) && !normalizeOptionalString(params.baseUrl);
  return params.api === "openai-responses"
    ? hasDefaultXaiRoute
    : params.api === "openai-completions" &&
        (isXaiNativeEndpoint(params.baseUrl) || hasDefaultXaiRoute);
}
function resolveXaiTransport(params) {
  if (!shouldUseXaiResponsesTransport(params)) return;
  return {
    api: "openai-responses",
    baseUrl:
      normalizeOptionalString(params.baseUrl) ??
      (isXaiProviderId(params.provider) ? "https://api.x.ai/v1" : void 0),
  };
}
//#endregion
export { resolveXaiTransport as n, isXaiModelHint as t };
