import {
  i as COPILOT_INTEGRATION_ID,
  s as buildCopilotIdeHeaders,
} from "./copilot-dynamic-headers-CF9zPORX.js";
import {
  i as resolveStaticCopilotModelOverride,
  n as resolveCopilotModelCompat,
  r as resolveCopilotTransportApi,
} from "./model-metadata-C-L7_SSr.js";
import { l as asPositiveSafeInteger } from "./number-coercion-CJQ8TR--.js";
import { f as readProviderJsonArrayFieldResponse } from "./provider-http-errors-DLMRBkZU.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
import { u as supportsClaudeAdaptiveThinking } from "./src-Dcc_hMY6.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import "./provider-model-shared-CYlCpWlu.js";
import "./provider-http-BDIltggC.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/github-copilot/models.ts
const PROVIDER_ID = "github-copilot";
const CODEX_FORWARD_COMPAT_TARGET_IDS = /* @__PURE__ */ new Set(["gpt-5.4", "gpt-5.3-codex"]);
const CODEX_TEMPLATE_MODEL_IDS = ["gpt-5.3-codex"];
const DEFAULT_CONTEXT_WINDOW = 128e3;
const DEFAULT_MAX_TOKENS = 8192;
function isCopilotCodexModelId(modelId) {
  return /(?:^|[-_.])codex(?:$|[-_.])/.test(modelId);
}
function resolveCopilotForwardCompatModel(ctx) {
  const trimmedModelId = ctx.modelId.trim();
  if (!trimmedModelId) return;
  const lowerModelId = normalizeOptionalLowercaseString(trimmedModelId) ?? "";
  if (ctx.modelRegistry.find("github-copilot", lowerModelId)) return;
  if (CODEX_FORWARD_COMPAT_TARGET_IDS.has(lowerModelId))
    for (const templateId of CODEX_TEMPLATE_MODEL_IDS) {
      const template = ctx.modelRegistry.find(PROVIDER_ID, templateId);
      if (!template) continue;
      return normalizeModelCompat({
        ...template,
        id: trimmedModelId,
        name: trimmedModelId,
      });
    }
  const staticOverride = resolveStaticCopilotModelOverride(lowerModelId);
  if (staticOverride) {
    const compat = staticOverride.compat ?? resolveCopilotModelCompat(trimmedModelId);
    return normalizeModelCompat({
      id: trimmedModelId,
      name: staticOverride.name ?? trimmedModelId,
      provider: PROVIDER_ID,
      api: staticOverride.api ?? resolveCopilotTransportApi(trimmedModelId),
      reasoning: staticOverride.reasoning ?? false,
      input: staticOverride.input ?? ["text", "image"],
      cost: staticOverride.cost ?? {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
      },
      contextWindow: staticOverride.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
      ...(staticOverride.contextTokens !== void 0
        ? { contextTokens: staticOverride.contextTokens }
        : {}),
      maxTokens: staticOverride.maxTokens ?? DEFAULT_MAX_TOKENS,
      ...(staticOverride.thinkingLevelMap
        ? { thinkingLevelMap: staticOverride.thinkingLevelMap }
        : {}),
      ...(compat ? { compat } : {}),
    });
  }
  const reasoning = /^o[13](\b|$)/.test(lowerModelId) || isCopilotCodexModelId(lowerModelId);
  const compat = resolveCopilotModelCompat(trimmedModelId);
  return normalizeModelCompat({
    id: trimmedModelId,
    name: trimmedModelId,
    provider: PROVIDER_ID,
    api: resolveCopilotTransportApi(trimmedModelId),
    reasoning,
    input: ["text", "image"],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow: DEFAULT_CONTEXT_WINDOW,
    maxTokens: DEFAULT_MAX_TOKENS,
    ...(compat ? { compat } : {}),
  });
}
const COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS = 1e4;
const COPILOT_ROUTER_ID_PREFIX = "accounts/";
function resolveCopilotApiForVendor(vendor, modelId) {
  if (vendor && vendor.toLowerCase() === "anthropic") return "anthropic-messages";
  return resolveCopilotTransportApi(modelId);
}
function mergeCopilotCompat(base, reasoningEfforts) {
  const supportedReasoningEfforts = Array.isArray(reasoningEfforts)
    ? [
        ...new Set(
          reasoningEfforts
            .map((effort) => normalizeOptionalLowercaseString(effort))
            .filter((effort) => Boolean(effort)),
        ),
      ]
    : [];
  if (supportedReasoningEfforts.length === 0) return base;
  return {
    ...base,
    supportedReasoningEfforts,
  };
}
function resolveCopilotThinkingLevelMap(api, modelId, compat) {
  const efforts = compat?.supportedReasoningEfforts;
  if (api !== "anthropic-messages" || !Array.isArray(efforts)) return;
  const supportsAdaptiveEffort = supportsClaudeAdaptiveThinking({ id: modelId });
  return {
    xhigh: supportsAdaptiveEffort && efforts.includes("xhigh") ? "xhigh" : null,
    max: supportsAdaptiveEffort && efforts.includes("max") ? "max" : null,
  };
}
function mapCopilotApiModelToDefinition(entry) {
  const id = entry.id?.trim();
  if (!id) return;
  if (entry.object && entry.object !== "model") return;
  if (entry.capabilities?.type && entry.capabilities.type !== "chat") return;
  if (id.startsWith(COPILOT_ROUTER_ID_PREFIX)) return;
  const limits = entry.capabilities?.limits;
  const supports = entry.capabilities?.supports;
  const reasoning = Array.isArray(supports?.reasoning_effort)
    ? supports.reasoning_effort.length > 0
    : false;
  const input = supports?.vision === true ? ["text", "image"] : ["text"];
  const contextWindow =
    asPositiveSafeInteger(limits?.max_context_window_tokens) ?? DEFAULT_CONTEXT_WINDOW;
  const contextTokens = asPositiveSafeInteger(limits?.max_prompt_tokens);
  const maxTokens = asPositiveSafeInteger(limits?.max_output_tokens) ?? DEFAULT_MAX_TOKENS;
  const compat = mergeCopilotCompat(resolveCopilotModelCompat(id), supports?.reasoning_effort);
  const api = resolveCopilotApiForVendor(entry.vendor, id);
  const thinkingLevelMap = resolveCopilotThinkingLevelMap(api, id, compat);
  return {
    id,
    name: entry.name?.trim() || id,
    api,
    reasoning,
    input,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow,
    ...(contextTokens !== void 0 ? { contextTokens } : {}),
    maxTokens,
    ...(thinkingLevelMap ? { thinkingLevelMap } : {}),
    ...(compat ? { compat } : {}),
  };
}
function asCopilotApiModelEntry(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new Error("Copilot /models: malformed JSON response");
  return value;
}
/**
 * Fetch the live Copilot model catalog from `${baseUrl}/models` and project it
 * into `ModelDefinitionConfig[]`. Used by the plugin's discovery hook so the
 * runtime catalog tracks per-account entitlements + accurate context windows
 * without manifest churn.
 *
 * Filters out non-chat objects (embeddings, routers) and internal router ids.
 * On any HTTP/parse failure the caller should fall back to the static manifest
 * catalog; this function throws so the caller decides the recovery shape.
 */
async function fetchCopilotModelCatalog(params) {
  const fetchImpl = params.fetchImpl ?? fetch;
  const trimmedBase = params.baseUrl.replace(/\/+$/, "");
  if (!trimmedBase) throw new Error("fetchCopilotModelCatalog: baseUrl required");
  if (!params.copilotApiToken.trim())
    throw new Error("fetchCopilotModelCatalog: copilotApiToken required");
  const url = `${trimmedBase}/models`;
  const controller = params.signal ? void 0 : new AbortController();
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS)
    : void 0;
  try {
    const res = await fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${params.copilotApiToken}`,
        ...buildCopilotIdeHeaders(),
        "Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
      },
      signal: params.signal ?? controller?.signal,
    });
    if (!res.ok) throw new Error(`Copilot /models fetch failed: HTTP ${res.status}`);
    const data = await readProviderJsonArrayFieldResponse(res, "Copilot /models", "data");
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const rawEntry of data) {
      const def = mapCopilotApiModelToDefinition(asCopilotApiModelEntry(rawEntry));
      if (!def) continue;
      if (seen.has(def.id)) continue;
      seen.add(def.id);
      out.push(def);
    }
    return out;
  } finally {
    if (timeoutId !== void 0) clearTimeout(timeoutId);
  }
}
//#endregion
export { fetchCopilotModelCatalog as n, resolveCopilotForwardCompatModel as r, PROVIDER_ID as t };
