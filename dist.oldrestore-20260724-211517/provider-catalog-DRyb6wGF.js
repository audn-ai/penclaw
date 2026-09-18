//#region extensions/codex/provider-catalog.ts
/** Provider id used by Codex model refs. */
const CODEX_PROVIDER_ID = "codex";
/** Synthetic base URL used to route Codex app-server model requests. */
const CODEX_BASE_URL = "https://chatgpt.com/backend-api";
/** Synthetic auth marker understood by Codex app-server runtime paths. */
const CODEX_APP_SERVER_AUTH_MARKER = "codex-app-server";
const DEFAULT_CONTEXT_WINDOW = 272e3;
const DEFAULT_MAX_TOKENS = 128e3;
const KNOWN_CONTEXT_WINDOW_BY_MODEL_ID = Object.freeze({
  "gpt-5.6-sol": 372e3,
  "gpt-5.6-terra": 372e3,
  "gpt-5.6-luna": 372e3,
});
/** Offline fallback catalog used when live app-server discovery is unavailable. */
const FALLBACK_CODEX_MODELS = [
  {
    id: "gpt-5.6-sol",
    model: "gpt-5.6-sol",
    displayName: "GPT-5.6 Sol",
    description: "Latest frontier agentic coding model.",
    isDefault: true,
    contextWindow: 372e3,
    inputModalities: ["text", "image"],
    supportedReasoningEfforts: ["low", "medium", "high", "xhigh", "max", "ultra"],
  },
  {
    id: "gpt-5.6-luna",
    model: "gpt-5.6-luna",
    displayName: "GPT-5.6 Luna",
    description: "High-throughput frontier agentic coding model.",
    contextWindow: 372e3,
    inputModalities: ["text", "image"],
    supportedReasoningEfforts: ["low", "medium", "high", "xhigh", "max"],
  },
  {
    id: "gpt-5.5",
    model: "gpt-5.5",
    displayName: "GPT-5.5",
    description: "Previous frontier agentic coding model.",
    inputModalities: ["text", "image"],
    supportedReasoningEfforts: ["low", "medium", "high", "xhigh"],
  },
  {
    id: "gpt-5.4-mini",
    model: "gpt-5.4-mini",
    displayName: "GPT-5.4-Mini",
    description: "Smaller frontier agentic coding model.",
    inputModalities: ["text", "image"],
    supportedReasoningEfforts: ["low", "medium", "high", "xhigh"],
  },
];
/**
 * Converts a Codex app-server model record into OpenClaw provider model config.
 */
function buildCodexModelDefinition(model) {
  const id = model.id.trim() || model.model.trim();
  const supportedReasoningEfforts = model.supportedReasoningEfforts;
  return {
    id,
    name: model.displayName?.trim() || id,
    api: "openai-chatgpt-responses",
    reasoning:
      supportedReasoningEfforts !== void 0
        ? supportedReasoningEfforts.length > 0
        : shouldDefaultToReasoningModel(id),
    input: model.inputModalities.includes("image") ? ["text", "image"] : ["text"],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow:
      model.contextWindow ?? KNOWN_CONTEXT_WINDOW_BY_MODEL_ID[id] ?? DEFAULT_CONTEXT_WINDOW,
    maxTokens: DEFAULT_MAX_TOKENS,
    compat: {
      ...(supportedReasoningEfforts !== void 0
        ? { supportsReasoningEffort: supportedReasoningEfforts.length > 0 }
        : {}),
      ...(supportedReasoningEfforts && supportedReasoningEfforts.length > 0
        ? { supportedReasoningEfforts: [...supportedReasoningEfforts] }
        : {}),
      supportsUsageInStreaming: true,
    },
  };
}
/** Builds the synthetic Codex provider config for a model list. */
function buildCodexProviderConfig(models) {
  return {
    baseUrl: CODEX_BASE_URL,
    apiKey: CODEX_APP_SERVER_AUTH_MARKER,
    auth: "token",
    api: "openai-chatgpt-responses",
    models: models.map(buildCodexModelDefinition),
  };
}
function shouldDefaultToReasoningModel(modelId) {
  const lower = modelId.toLowerCase();
  return (
    lower.startsWith("gpt-5") ||
    lower.startsWith("o1") ||
    lower.startsWith("o3") ||
    lower.startsWith("o4")
  );
}
//#endregion
export {
  buildCodexModelDefinition as a,
  FALLBACK_CODEX_MODELS as i,
  CODEX_BASE_URL as n,
  buildCodexProviderConfig as o,
  CODEX_PROVIDER_ID as r,
  CODEX_APP_SERVER_AUTH_MARKER as t,
};
