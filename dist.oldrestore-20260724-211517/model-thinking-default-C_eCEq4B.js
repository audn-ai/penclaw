import {
  i as modelKey,
  o as normalizeProviderId,
  r as legacyModelKey,
} from "./model-selection-normalize-BoKGJiBx.js";
import {
  p as normalizeModelSelection,
  r as buildConfiguredModelCatalog,
} from "./model-selection-shared-BliwFXJy.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { s as resolveThinkingDefaultForModel } from "./thinking-CVcRbjTC.js";
import "./model-selection-resolve-DZKTt5O8.js";
//#region src/agents/model-thinking-default.ts
/**
 * Resolves default thinking levels for provider/model pairs. It combines
 * explicit per-model config, global defaults, catalog metadata, and model
 * family fallbacks.
 */
/** Resolves the default thinking level for a provider/model pair. */
function resolveThinkingDefault(params) {
  const normalizedProvider = normalizeProviderId(params.provider);
  const normalizedModel = normalizeLowercaseStringOrEmpty(params.model).replace(/\./g, "-");
  const catalog = Array.isArray(params.catalog)
    ? params.catalog
    : buildConfiguredModelCatalog({ cfg: params.cfg });
  const catalogCandidate = catalog.find(
    (entry) => entry.provider === params.provider && entry.id === params.model,
  );
  const configuredModels = params.cfg.agents?.defaults?.models;
  const canonicalKey = modelKey(params.provider, params.model);
  const legacyKey = legacyModelKey(params.provider, params.model);
  const normalizedCanonicalKey = normalizeLowercaseStringOrEmpty(canonicalKey);
  const normalizedLegacyKey = normalizeOptionalLowercaseString(legacyKey);
  const normalizedPrimarySelection = normalizeOptionalLowercaseString(
    normalizeModelSelection(params.cfg.agents?.defaults?.model),
  );
  const explicitModelConfigured =
    (configuredModels ? canonicalKey in configuredModels : false) ||
    Boolean(legacyKey && configuredModels && legacyKey in configuredModels) ||
    normalizedPrimarySelection === normalizedCanonicalKey ||
    Boolean(normalizedLegacyKey && normalizedPrimarySelection === normalizedLegacyKey) ||
    normalizedPrimarySelection === normalizeLowercaseStringOrEmpty(params.model);
  const perModelThinking =
    configuredModels?.[canonicalKey]?.params?.thinking ??
    (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0);
  if (perModelThinking === false || perModelThinking === "disabled" || perModelThinking === "none")
    return "off";
  if (
    perModelThinking === "off" ||
    perModelThinking === "minimal" ||
    perModelThinking === "low" ||
    perModelThinking === "medium" ||
    perModelThinking === "high" ||
    perModelThinking === "xhigh" ||
    perModelThinking === "adaptive" ||
    perModelThinking === "max" ||
    perModelThinking === "ultra"
  )
    return perModelThinking;
  const configured = params.cfg.agents?.defaults?.thinkingDefault;
  if (configured) return configured;
  const isClaudeProvider =
    normalizedProvider === "anthropic" ||
    normalizedProvider === "anthropic-vertex" ||
    normalizedProvider === "claude-cli";
  if (
    isClaudeProvider &&
    (normalizedModel.startsWith("claude-opus-4-8") || normalizedModel.startsWith("claude-opus-4.8"))
  )
    return "off";
  if (
    isClaudeProvider &&
    (normalizedModel.startsWith("claude-opus-4-7") || normalizedModel.startsWith("claude-opus-4.7"))
  )
    return "off";
  if (
    normalizedProvider === "anthropic" &&
    explicitModelConfigured &&
    typeof catalogCandidate?.name === "string" &&
    /4\.6\b/.test(catalogCandidate.name) &&
    (normalizedModel.startsWith("claude-opus-4-6") ||
      normalizedModel.startsWith("claude-sonnet-4-6"))
  )
    return "adaptive";
  return resolveThinkingDefaultForModel({
    provider: params.provider,
    model: params.model,
    catalog,
    agentRuntime: params.agentRuntime,
  });
}
/** Resolves thinking default after loading runtime catalog only when needed. */
async function resolveThinkingDefaultWithRuntimeCatalog(params) {
  const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
  const configuredSelectedEntry = configuredCatalog.find(
    (entry) => entry.provider === params.provider && entry.id === params.model,
  );
  const runtimeCatalog =
    configuredCatalog.length === 0 ||
    !configuredSelectedEntry ||
    configuredSelectedEntry.reasoning === void 0
      ? await params.loadModelCatalog()
      : void 0;
  const catalog =
    runtimeCatalog?.find(
      (entry) => entry.provider === params.provider && entry.id === params.model,
    ) || configuredCatalog.length === 0
      ? (runtimeCatalog ?? configuredCatalog)
      : configuredCatalog;
  return resolveThinkingDefault({
    cfg: params.cfg,
    provider: params.provider,
    model: params.model,
    catalog,
    agentRuntime: params.agentRuntime,
  });
}
//#endregion
export { resolveThinkingDefaultWithRuntimeCatalog as n, resolveThinkingDefault as t };
