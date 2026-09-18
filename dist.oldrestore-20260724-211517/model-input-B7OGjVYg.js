import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import {
  n as normalizeGooglePreviewModelId,
  r as normalizeTogetherModelId,
} from "./provider-model-id-normalize-DODOj1rv.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  c as normalizeOptionalString,
  m as resolvePrimaryStringValue,
} from "./string-coerce-DW4mBlAt.js";
//#region src/config/model-input.ts
/** Returns the primary model ref from either string or object-style agent model config. */
function resolveAgentModelPrimaryValue(model) {
  return resolvePrimaryStringValue(model);
}
/** Returns configured fallback model refs, preserving their configured order. */
function resolveAgentModelFallbackValues(model) {
  if (!model || typeof model !== "object") return [];
  return Array.isArray(model.fallbacks) ? model.fallbacks : [];
}
/** Returns a positive finite tool timeout rounded down to whole milliseconds. */
function resolveAgentModelTimeoutMsValue(model) {
  if (!model || typeof model !== "object") return;
  return typeof model.timeoutMs === "number" &&
    Number.isFinite(model.timeoutMs) &&
    model.timeoutMs > 0
    ? Math.floor(model.timeoutMs)
    : void 0;
}
/** Converts legacy string model config into the object shape used by model patch helpers. */
function toAgentModelListLike(model) {
  if (typeof model === "string") {
    const primary = normalizeOptionalString(model);
    return primary ? { primary } : void 0;
  }
  if (!model || typeof model !== "object") return;
  return model;
}
const GOOGLE_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "google",
  "google-gemini-cli",
  "google-vertex",
]);
/** Canonicalizes provider/model refs before they are persisted to config. */
function normalizeAgentModelRefForConfig(model) {
  const trimmed = model.trim();
  const parsed = parseModelCatalogRef(trimmed);
  if (!parsed) return trimmed;
  const { provider, modelId: modelSuffix } = parsed;
  return modelKey(
    provider,
    GOOGLE_PROVIDER_IDS.has(provider) || modelSuffix.startsWith("google/")
      ? normalizeGooglePreviewModelId(modelSuffix)
      : provider === "together"
        ? normalizeTogetherModelId(modelSuffix)
        : modelSuffix,
  );
}
function mergeAgentModelEntryForConfig(existing, incoming) {
  if (!isRecord(existing) || !isRecord(incoming)) return incoming;
  const existingParams = isRecord(existing.params) ? existing.params : void 0;
  const incomingParams = isRecord(incoming.params) ? incoming.params : void 0;
  return {
    ...existing,
    ...incoming,
    ...(existingParams || incomingParams
      ? {
          params: {
            ...existingParams,
            ...incomingParams,
          },
        }
      : void 0),
  };
}
/** Normalizes model map keys and merges entries that collapse to the same canonical ref. */
function normalizeAgentModelMapForConfig(models) {
  let mutated = false;
  const next = {};
  for (const [key, entry] of Object.entries(models)) {
    const normalizedKey = normalizeAgentModelRefForConfig(key);
    if (normalizedKey !== key || Object.hasOwn(next, normalizedKey)) mutated = true;
    next[normalizedKey] = mergeAgentModelEntryForConfig(next[normalizedKey], entry);
  }
  return mutated ? next : models;
}
//#endregion
export {
  resolveAgentModelTimeoutMsValue as a,
  resolveAgentModelPrimaryValue as i,
  normalizeAgentModelRefForConfig as n,
  toAgentModelListLike as o,
  resolveAgentModelFallbackValues as r,
  normalizeAgentModelMapForConfig as t,
};
