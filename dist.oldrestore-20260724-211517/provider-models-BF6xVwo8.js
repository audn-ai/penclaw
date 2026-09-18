import { u as resolveXaiCatalogEntry } from "./model-definitions-BoOPeWPv.js";
import { t as normalizeXaiModelId } from "./model-id-C3Tkp5Dy.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-model-shared-CYlCpWlu.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
import { t as applyXaiRuntimeModelCompat } from "./runtime-model-compat-gatOcnur.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region extensions/xai/provider-models.ts
const XAI_MODERN_MODEL_PREFIXES = ["grok-4.5", "grok-build-0.1", "grok-4.3", "grok-4.20"];
function isModernXaiModel(modelId) {
  const lower = normalizeOptionalLowercaseString(normalizeXaiModelId(modelId.trim())) ?? "";
  if (!lower || lower.includes("multi-agent")) return false;
  return XAI_MODERN_MODEL_PREFIXES.some((prefix) => lower.startsWith(prefix));
}
function resolveXaiForwardCompatModel(params) {
  const definition = resolveXaiCatalogEntry(params.ctx.modelId);
  if (!definition) return;
  return applyXaiRuntimeModelCompat(
    normalizeModelCompat({
      id: definition.id,
      name: definition.name,
      api: params.ctx.providerConfig?.api ?? "openai-responses",
      provider: params.providerId,
      baseUrl: normalizeOptionalString(params.ctx.providerConfig?.baseUrl) ?? "https://api.x.ai/v1",
      reasoning: definition.reasoning,
      input: definition.input,
      cost: definition.cost,
      contextWindow: definition.contextWindow,
      maxTokens: definition.maxTokens,
    }),
  );
}
//#endregion
export { resolveXaiForwardCompatModel as n, isModernXaiModel as t };
