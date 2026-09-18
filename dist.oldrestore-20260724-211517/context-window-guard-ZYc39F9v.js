import { n as resolveProviderEndpoint } from "./provider-attribution-CdW1rMjo.js";
import { n as findNormalizedProviderValue } from "./provider-id-BIcU_2-A.js";
//#region src/agents/context-window-guard.ts
/**
 * Resolves effective model context windows and formats guard warnings/blocks.
 *
 * Configured model values can cap provider metadata, and local endpoints get
 * more actionable remediation text.
 */
const CONTEXT_WINDOW_HARD_MIN_TOKENS = 4e3;
const CONTEXT_WINDOW_WARN_BELOW_TOKENS = 8e3;
const CONTEXT_WINDOW_HARD_MIN_RATIO = 0.1;
const CONTEXT_WINDOW_WARN_BELOW_RATIO = 0.2;
function normalizePositiveInt(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const int = Math.floor(value);
  return int > 0 ? int : null;
}
function modelIdMatchesProviderScope(params) {
  const configuredId = params.configuredId?.trim();
  if (!configuredId) return false;
  if (configuredId === params.modelId) return true;
  const providerPrefix = params.provider ? `${params.provider}/` : "";
  if (!providerPrefix) return false;
  const stripProvider = (id) =>
    id.startsWith(providerPrefix) ? id.slice(providerPrefix.length) : id;
  return stripProvider(configuredId) === stripProvider(params.modelId);
}
/** Resolve the effective context window and source for one provider/model. */
function resolveContextWindowInfo(params) {
  const fromModelsConfig = (() => {
    const providers = params.cfg?.models?.providers;
    const providerEntry = findNormalizedProviderValue(providers, params.provider);
    const match = (Array.isArray(providerEntry?.models) ? providerEntry.models : []).find((model) =>
      modelIdMatchesProviderScope({
        configuredId: model?.id,
        provider: params.provider,
        modelId: params.modelId,
      }),
    );
    return normalizePositiveInt(match?.contextTokens) ?? normalizePositiveInt(match?.contextWindow);
  })();
  const fromModel =
    normalizePositiveInt(params.modelContextTokens) ??
    normalizePositiveInt(params.modelContextWindow);
  const defaultTokens =
    normalizePositiveInt(params.defaultTokens) ?? CONTEXT_WINDOW_WARN_BELOW_TOKENS;
  const baseInfo = fromModelsConfig
    ? {
        tokens: fromModelsConfig,
        source: "modelsConfig",
      }
    : fromModel
      ? {
          tokens: fromModel,
          source: "model",
        }
      : {
          tokens: defaultTokens,
          source: "default",
        };
  const capTokens =
    normalizePositiveInt(params.agentContextTokens) ??
    normalizePositiveInt(params.cfg?.agents?.defaults?.contextTokens);
  if (capTokens && capTokens < baseInfo.tokens)
    return {
      tokens: capTokens,
      referenceTokens: baseInfo.tokens,
      source: "agentContextTokens",
    };
  return baseInfo;
}
function resolveContextWindowGuardHint(params) {
  const endpoint = resolveProviderEndpoint(params.runtimeBaseUrl ?? void 0);
  return {
    endpointClass: endpoint.endpointClass,
    likelySelfHosted: endpoint.endpointClass === "local",
  };
}
/** Derive warning/block floors from the resolved model context window. */
function resolveContextWindowGuardThresholds(contextWindowTokens) {
  const tokens = normalizePositiveInt(contextWindowTokens) ?? 0;
  return {
    hardMinTokens: Math.max(
      CONTEXT_WINDOW_HARD_MIN_TOKENS,
      Math.floor(tokens * CONTEXT_WINDOW_HARD_MIN_RATIO),
    ),
    warnBelowTokens: Math.max(
      CONTEXT_WINDOW_WARN_BELOW_TOKENS,
      Math.floor(tokens * CONTEXT_WINDOW_WARN_BELOW_RATIO),
    ),
  };
}
/** Format a non-blocking low-context warning message. */
function formatContextWindowWarningMessage(params) {
  const base = `low context window: ${params.provider}/${params.modelId} ctx=${params.guard.tokens} (warn<${params.guard.warnBelowTokens}) source=${params.guard.source}`;
  if (!resolveContextWindowGuardHint({ runtimeBaseUrl: params.runtimeBaseUrl }).likelySelfHosted)
    return base;
  if (params.guard.source === "agentContextTokens")
    return `${base}; OpenClaw is capped by agents.defaults.contextTokens, so raise that cap if you want to use more of the model context window`;
  if (params.guard.source === "modelsConfig")
    return `${base}; OpenClaw is using the configured model context limit for this model, so raise contextWindow/contextTokens if it is set too low`;
  return `${base}; local/self-hosted runs work best at ${params.guard.warnBelowTokens}+ tokens and may show weaker tool use or more compaction until the server/model context limit is raised`;
}
/** Format a blocking context-window guard message. */
function formatContextWindowBlockMessage(params) {
  const base = `Model context window too small (${params.guard.tokens} tokens; source=${params.guard.source}). Minimum is ${params.guard.hardMinTokens}.`;
  if (!resolveContextWindowGuardHint({ runtimeBaseUrl: params.runtimeBaseUrl }).likelySelfHosted)
    return base;
  if (params.guard.source === "agentContextTokens")
    return `${base} OpenClaw is capped by agents.defaults.contextTokens. Raise that cap.`;
  if (params.guard.source === "modelsConfig")
    return `${base} OpenClaw is using the configured model context limit for this model. Raise contextWindow/contextTokens or choose a larger model.`;
  return `${base} This looks like a local model endpoint. Raise the server/model context limit or choose a larger model. OpenClaw local/self-hosted runs work best at ${params.guard.warnBelowTokens}+ tokens.`;
}
/** Evaluate whether the resolved context window should warn or block. */
function evaluateContextWindowGuard(params) {
  const normalizedTokens = normalizePositiveInt(params.info.tokens);
  const tokens = normalizedTokens ?? 0;
  const resolvedThresholds = resolveContextWindowGuardThresholds(
    normalizePositiveInt(params.info.referenceTokens) ?? tokens,
  );
  const warnBelow = Math.max(
    1,
    Math.floor(params.warnBelowTokens ?? resolvedThresholds.warnBelowTokens),
  );
  const defaultHardMin = Math.min(
    resolvedThresholds.hardMinTokens,
    Math.max(tokens, CONTEXT_WINDOW_HARD_MIN_TOKENS),
  );
  const hardMin = Math.max(1, Math.floor(params.hardMinTokens ?? defaultHardMin));
  return {
    ...params.info,
    tokens,
    hardMinTokens: hardMin,
    warnBelowTokens: warnBelow,
    shouldWarn: !normalizedTokens || tokens < warnBelow,
    shouldBlock: !normalizedTokens || tokens < hardMin,
  };
}
//#endregion
export {
  resolveContextWindowInfo as a,
  formatContextWindowWarningMessage as i,
  evaluateContextWindowGuard as n,
  formatContextWindowBlockMessage as r,
  CONTEXT_WINDOW_HARD_MIN_TOKENS as t,
};
