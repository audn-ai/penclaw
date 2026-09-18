import { a as parseProviderModelRef } from "./model-catalog-refs-BcuK-xC3.js";
//#region packages/media-generation-core/src/model-ref.ts
/** Parses strict generation model refs and rejects missing provider or model segments. */
function parseGenerationModelRef(raw) {
  return raw === void 0 ? null : parseProviderModelRef(raw);
}
//#endregion
export { parseGenerationModelRef as t };
