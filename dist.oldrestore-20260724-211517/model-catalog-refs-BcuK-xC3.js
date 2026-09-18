import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region packages/model-catalog-core/src/model-catalog-refs.ts
/** Normalize provider ids for catalog refs. */
function normalizeModelCatalogProviderId(provider) {
  return normalizeLowercaseStringOrEmpty(provider);
}
/** Build a provider/model catalog reference. */
function buildModelCatalogRef(provider, modelId) {
  return `${normalizeModelCatalogProviderId(provider)}/${modelId}`;
}
/** Parse a strict provider/model reference without normalizing either segment. */
function parseProviderModelRef(value) {
  const trimmed = value.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) return null;
  const provider = trimmed.slice(0, slashIndex).trim();
  const model = trimmed.slice(slashIndex + 1).trim();
  return provider && model
    ? {
        provider,
        model,
      }
    : null;
}
/** Parse a strict provider/model catalog reference. */
function parseModelCatalogRef(value) {
  const parsed = parseProviderModelRef(value);
  if (!parsed) return null;
  return {
    provider: normalizeModelCatalogProviderId(parsed.provider),
    modelId: parsed.model,
  };
}
/** Build a case-insensitive merge key for provider/model rows. */
function buildModelCatalogMergeKey(provider, modelId) {
  return `${normalizeModelCatalogProviderId(provider)}::${normalizeLowercaseStringOrEmpty(modelId)}`;
}
//#endregion
export {
  parseProviderModelRef as a,
  parseModelCatalogRef as i,
  buildModelCatalogRef as n,
  normalizeModelCatalogProviderId as r,
  buildModelCatalogMergeKey as t,
};
