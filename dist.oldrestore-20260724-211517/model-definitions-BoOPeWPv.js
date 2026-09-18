import { t as normalizeXaiModelId } from "./model-id-C3Tkp5Dy.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/xai/model-definitions.ts
const XAI_BASE_URL = "https://api.x.ai/v1";
const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
const XAI_IMAGE_MODELS = ["grok-imagine-image", "grok-imagine-image-quality"];
const XAI_DEFAULT_CONTEXT_WINDOW = 1e6;
const XAI_GROK_45_CONTEXT_WINDOW = 5e5;
const XAI_CODE_CONTEXT_WINDOW = 256e3;
const XAI_DEFAULT_MAX_TOKENS = 64e3;
const XAI_DEFAULT_MODEL_ID = "grok-4.3";
const XAI_GROK_420_COST = {
  input: 1.25,
  output: 2.5,
  cacheRead: 0.2,
  cacheWrite: 0,
};
const XAI_GROK_43_COST = {
  input: 1.25,
  output: 2.5,
  cacheRead: 0.2,
  cacheWrite: 0,
};
const XAI_GROK_45_COST = {
  input: 2,
  output: 6,
  cacheRead: 0.5,
  cacheWrite: 0,
};
const XAI_MODEL_CATALOG = [
  {
    id: "grok-4.5",
    name: "Grok 4.5",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: XAI_GROK_45_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_45_COST,
  },
  {
    id: "grok-build-0.1",
    name: "Grok Build 0.1",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: XAI_CODE_CONTEXT_WINDOW,
    cost: {
      input: 1,
      output: 2,
      cacheRead: 0.2,
      cacheWrite: 0,
    },
  },
  {
    id: "grok-3",
    name: "Grok 3",
    reasoning: false,
    input: ["text"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-3-fast",
    name: "Grok 3 Fast",
    reasoning: false,
    input: ["text"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-3-mini",
    name: "Grok 3 Mini",
    reasoning: true,
    input: ["text"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-3-mini-fast",
    name: "Grok 3 Mini Fast",
    reasoning: true,
    input: ["text"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4.3",
    name: "Grok 4.3",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4",
    name: "Grok 4",
    reasoning: true,
    input: ["text"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4-0709",
    name: "Grok 4 0709",
    reasoning: true,
    input: ["text"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4-fast",
    name: "Grok 4 Fast",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4-fast-non-reasoning",
    name: "Grok 4 Fast (Non-Reasoning)",
    reasoning: false,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4-1-fast",
    name: "Grok 4.1 Fast",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4-1-fast-non-reasoning",
    name: "Grok 4.1 Fast (Non-Reasoning)",
    reasoning: false,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: XAI_DEFAULT_MAX_TOKENS,
    cost: XAI_GROK_43_COST,
  },
  {
    id: "grok-4.20-0309-reasoning",
    name: "Grok 4.20 0309 (Reasoning)",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: 3e4,
    cost: XAI_GROK_420_COST,
  },
  {
    id: "grok-4.20-0309-non-reasoning",
    name: "Grok 4.20 0309 (Non-Reasoning)",
    reasoning: false,
    input: ["text", "image"],
    contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
    maxTokens: 3e4,
    cost: XAI_GROK_420_COST,
  },
];
const XAI_SELECTABLE_MODEL_IDS = /* @__PURE__ */ new Set([
  "grok-4.5",
  "grok-build-0.1",
  "grok-4.3",
  "grok-4.20-0309-reasoning",
  "grok-4.20-0309-non-reasoning",
]);
const LEGACY_XAI_BUILTIN_SIGNATURES = {
  "grok-3": ["Grok 3", false, "text", 131072, 8192, 3, 15, 0.75, 0],
  "grok-3-fast": ["Grok 3 Fast", false, "text", 131072, 8192, 5, 25, 1.25, 0],
  "grok-3-mini": ["Grok 3 Mini", true, "text", 131072, 8192, 0.3, 0.5, 0.075, 0],
  "grok-3-mini-fast": ["Grok 3 Mini Fast", true, "text", 131072, 8192, 0.6, 4, 0.15, 0],
  "grok-4": ["Grok 4", true, "text", 256e3, 64e3, 3, 15, 0.75, 0],
  "grok-4-0709": ["Grok 4 0709", false, "text", 256e3, 64e3, 3, 15, 0.75, 0],
  "grok-4-fast": ["Grok 4 Fast", true, "text,image", 2e6, 3e4, 0.2, 0.5, 0.05, 0],
  "grok-4-fast-non-reasoning": [
    "Grok 4 Fast (Non-Reasoning)",
    false,
    "text,image",
    2e6,
    3e4,
    0.2,
    0.5,
    0.05,
    0,
  ],
  "grok-4-1-fast": ["Grok 4.1 Fast", true, "text,image", 2e6, 3e4, 0.2, 0.5, 0.05, 0],
  "grok-4-1-fast-non-reasoning": [
    "Grok 4.1 Fast (Non-Reasoning)",
    false,
    "text,image",
    2e6,
    3e4,
    0.2,
    0.5,
    0.05,
    0,
  ],
};
const LEGACY_MODEL_KEYS = /* @__PURE__ */ new Set([
  "id",
  "name",
  "reasoning",
  "input",
  "cost",
  "contextWindow",
  "maxTokens",
]);
const LEGACY_COST_KEYS = /* @__PURE__ */ new Set(["input", "output", "cacheRead", "cacheWrite"]);
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function normalizeXaiCatalogModelId(modelId) {
  const lower = normalizeOptionalLowercaseString(modelId) ?? "";
  return normalizeXaiModelId(lower.startsWith("xai/") ? lower.slice(4) : lower);
}
function isLegacyXaiBuiltinModel(model) {
  const record = asRecord(model);
  const id = normalizeOptionalLowercaseString(record?.id);
  const signature = id ? LEGACY_XAI_BUILTIN_SIGNATURES[id] : void 0;
  const cost = asRecord(record?.cost);
  if (!record || !signature || !cost) return false;
  if (
    Object.keys(record).some((key) => !LEGACY_MODEL_KEYS.has(key)) ||
    Object.keys(cost).some((key) => !LEGACY_COST_KEYS.has(key))
  )
    return false;
  const [
    name,
    reasoning,
    input,
    contextWindow,
    maxTokens,
    inputCost,
    outputCost,
    cacheReadCost,
    cacheWriteCost,
  ] = signature;
  return (
    record.name === name &&
    record.reasoning === reasoning &&
    Array.isArray(record.input) &&
    record.input.join(",") === input &&
    record.contextWindow === contextWindow &&
    record.maxTokens === maxTokens &&
    cost.input === inputCost &&
    cost.output === outputCost &&
    cost.cacheRead === cacheReadCost &&
    cost.cacheWrite === cacheWriteCost
  );
}
function toModelDefinition(entry) {
  return {
    id: entry.id,
    name: entry.name,
    reasoning: entry.reasoning,
    input: entry.input ?? ["text"],
    cost: entry.cost,
    contextWindow: entry.contextWindow,
    maxTokens: entry.maxTokens ?? 64e3,
  };
}
function buildXaiModelDefinition() {
  return toModelDefinition(
    XAI_MODEL_CATALOG.find((entry) => entry.id === "grok-4.3") ?? {
      id: "grok-4.3",
      name: "Grok 4.3",
      reasoning: true,
      input: ["text", "image"],
      contextWindow: 1e6,
      maxTokens: 64e3,
      cost: XAI_GROK_43_COST,
    },
  );
}
function buildXaiCatalogModels() {
  return XAI_MODEL_CATALOG.filter((entry) => XAI_SELECTABLE_MODEL_IDS.has(entry.id)).map((entry) =>
    toModelDefinition(entry),
  );
}
function resolveXaiCatalogEntry(modelId) {
  const trimmed = modelId.trim();
  const lower = normalizeXaiCatalogModelId(modelId);
  const exact = XAI_MODEL_CATALOG.find(
    (entry) => normalizeOptionalLowercaseString(entry.id) === lower,
  );
  if (exact) return toModelDefinition(exact);
  if (lower === "grok-latest")
    return toModelDefinition({
      id: trimmed,
      name: trimmed,
      reasoning: true,
      input: ["text", "image"],
      contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
      maxTokens: XAI_DEFAULT_MAX_TOKENS,
      cost: XAI_GROK_43_COST,
    });
  if (lower.includes("multi-agent")) return;
  if (
    lower.startsWith("grok-3-mini-fast") ||
    lower.startsWith("grok-3-mini") ||
    lower.startsWith("grok-3-fast") ||
    lower.startsWith("grok-3")
  )
    return toModelDefinition({
      id: trimmed,
      name: trimmed,
      reasoning: lower.includes("mini"),
      input: ["text"],
      contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
      maxTokens: XAI_DEFAULT_MAX_TOKENS,
      cost: XAI_GROK_43_COST,
    });
  if (
    lower.startsWith("grok-4.5") ||
    lower.startsWith("grok-4.3") ||
    lower.startsWith("grok-4.20") ||
    lower.startsWith("grok-4-1") ||
    lower.startsWith("grok-4-fast")
  )
    return toModelDefinition({
      id: trimmed,
      name: trimmed,
      reasoning: !lower.includes("non-reasoning"),
      input: ["text", "image"],
      contextWindow: lower.startsWith("grok-4.5")
        ? XAI_GROK_45_CONTEXT_WINDOW
        : XAI_DEFAULT_CONTEXT_WINDOW,
      maxTokens:
        lower.startsWith("grok-4.5") || lower.startsWith("grok-4.3")
          ? XAI_DEFAULT_MAX_TOKENS
          : lower.startsWith("grok-4.20")
            ? 3e4
            : XAI_DEFAULT_MAX_TOKENS,
      cost: lower.startsWith("grok-4.5")
        ? XAI_GROK_45_COST
        : lower.startsWith("grok-4.3")
          ? XAI_GROK_43_COST
          : lower.startsWith("grok-4.20")
            ? XAI_GROK_420_COST
            : XAI_GROK_43_COST,
    });
  if (lower.startsWith("grok-4"))
    return toModelDefinition({
      id: modelId.trim(),
      name: modelId.trim(),
      reasoning: !lower.includes("non-reasoning"),
      input: ["text"],
      contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
      maxTokens: XAI_DEFAULT_MAX_TOKENS,
      cost: XAI_GROK_43_COST,
    });
}
//#endregion
export {
  XAI_DEFAULT_MODEL_ID as a,
  buildXaiModelDefinition as c,
  XAI_DEFAULT_MAX_TOKENS as i,
  isLegacyXaiBuiltinModel as l,
  XAI_DEFAULT_CONTEXT_WINDOW as n,
  XAI_IMAGE_MODELS as o,
  XAI_DEFAULT_IMAGE_MODEL as r,
  buildXaiCatalogModels as s,
  XAI_BASE_URL as t,
  resolveXaiCatalogEntry as u,
};
