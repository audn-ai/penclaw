import { u as normalizeProviderId } from "./provider-model-shared-CYlCpWlu.js";
//#region extensions/xai/provider-id.ts
const XAI_PROVIDER_IDS = /* @__PURE__ */ new Set(["xai", "x-ai"]);
function isXaiProviderId(provider) {
  return typeof provider === "string" && XAI_PROVIDER_IDS.has(normalizeProviderId(provider));
}
//#endregion
export { isXaiProviderId as t };
