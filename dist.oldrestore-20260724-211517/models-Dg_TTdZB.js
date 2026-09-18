import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/openrouter/models.ts
const OPENROUTER_MISTRAL_MODEL_PREFIXES = [
  "mistralai/",
  "mistral/",
  "mistral-",
  "codestral-",
  "devstral-",
  "ministral-",
  "mixtral-",
  "pixtral-",
  "voxtral-",
];
const OPENROUTER_MODEL_PREFIX = "openrouter/";
const OPENROUTER_SHORT_TO_API_MODEL_ID = /* @__PURE__ */ new Map([
  ["deepseek-v4-flash", "deepseek/deepseek-v4-flash"],
  ["deepseek-v4-pro", "deepseek/deepseek-v4-pro"],
]);
function normalizeOpenRouterModelId(modelId) {
  if (typeof modelId !== "string") return;
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return normalized.startsWith(OPENROUTER_MODEL_PREFIX) ? normalized.slice(11) : normalized;
}
function normalizeOpenRouterApiModelId(modelId) {
  if (typeof modelId !== "string") return;
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  if (!normalized.startsWith(OPENROUTER_MODEL_PREFIX)) return normalized;
  const unprefixed = normalized.slice(11);
  const shortExpanded = OPENROUTER_SHORT_TO_API_MODEL_ID.get(unprefixed);
  if (shortExpanded) return shortExpanded;
  return unprefixed.includes("/") ? unprefixed : normalized;
}
function isOpenRouterMistralModelId(modelId) {
  const normalized = normalizeOpenRouterModelId(modelId);
  return Boolean(
    normalized && OPENROUTER_MISTRAL_MODEL_PREFIXES.some((prefix) => normalized.startsWith(prefix)),
  );
}
function isOpenRouterDeepSeekV4ModelId(modelId) {
  const normalized = normalizeOpenRouterModelId(modelId);
  if (!normalized?.startsWith("deepseek/")) return false;
  const deepSeekModelId = normalized.slice(9).split(":", 1)[0];
  return deepSeekModelId === "deepseek-v4-flash" || deepSeekModelId === "deepseek-v4-pro";
}
//#endregion
export {
  normalizeOpenRouterModelId as i,
  isOpenRouterMistralModelId as n,
  normalizeOpenRouterApiModelId as r,
  isOpenRouterDeepSeekV4ModelId as t,
};
