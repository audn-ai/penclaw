import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as listAgentEntries } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/agents/model-runtime-policy.ts
/**
 * Model runtime policy resolution.
 *
 * Agent execution uses this to choose a model/provider-specific runtime policy
 * from agent entries, model catalog config, provider config, or QA overrides.
 */
function hasRuntimePolicy(value) {
  return Boolean(value?.id?.trim());
}
function resolveProviderConfig(config, provider) {
  if (!config?.models?.providers || !provider?.trim()) return;
  const providers = config.models.providers;
  const direct = providers[provider];
  if (direct) return direct;
  const normalizedProvider = normalizeProviderId(provider);
  for (const [candidateProvider, providerConfig] of Object.entries(providers))
    if (normalizeProviderId(candidateProvider) === normalizedProvider) return providerConfig;
}
function normalizeModelIdForProvider(provider, modelId) {
  const trimmed = modelId?.trim();
  if (!trimmed) return;
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return trimmed;
  const modelProvider = normalizeProviderId(trimmed.slice(0, slash));
  const expectedProvider = normalizeProviderId(provider ?? "");
  if (expectedProvider && modelProvider !== expectedProvider) return;
  return trimmed.slice(slash + 1).trim() || void 0;
}
function parseProviderModelKey(key) {
  return parseModelCatalogRef(key) ?? void 0;
}
function resolveEffectiveProvider(provider, modelId) {
  const normalizedProvider = normalizeProviderId(provider ?? "");
  if (normalizedProvider) return normalizedProvider;
  return parseProviderModelKey(modelId?.trim() ?? "")?.provider;
}
function providerMatchesCaller(provider, callerProvider) {
  return !callerProvider || provider === callerProvider;
}
function resolvePolicyMatch(matches, callerProvider) {
  const providerMatches = callerProvider
    ? matches.filter((match) => match.provider === callerProvider)
    : [];
  const candidates = providerMatches.length > 0 ? providerMatches : matches;
  const [first] = candidates;
  if (!first) return {};
  if (!callerProvider && candidates.some((match) => match.provider !== first.provider))
    return { ambiguous: true };
  return {
    policy: first.policy,
    source: "model",
    matchedProvider: first.provider || callerProvider,
  };
}
function modelEntryMatches(params) {
  return modelEntryMatchKind(params) === "exact";
}
function modelEntryMatchKind(params) {
  const entryId = params.entry.id.trim();
  if (entryId === params.modelId) return "exact";
  const parsed = parseProviderModelKey(entryId);
  if (!parsed) return "none";
  const callerProvider = normalizeProviderId(params.provider ?? "");
  if (!providerMatchesCaller(parsed.provider, callerProvider)) return "none";
  if (parsed.modelId === params.modelId) return "exact";
  if (parsed.modelId === "*") return "provider-wildcard";
  return "none";
}
function modelKeyMatchKind(params) {
  return modelEntryMatchKind({
    entry: { id: params.key },
    provider: params.provider,
    modelId: params.modelId,
  });
}
function modelKeyIsProviderWildcard(params) {
  const parsed = parseProviderModelKey(params.key);
  if (!parsed) return false;
  const callerProvider = normalizeProviderId(params.provider ?? "");
  return parsed.modelId === "*" && providerMatchesCaller(parsed.provider, callerProvider);
}
function resolveAgentModelEntryRuntimePolicy(params) {
  const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
  if (!params.config || (!modelId && params.matchKind !== "provider-wildcard")) return {};
  const { sessionAgentId } = resolveSessionAgentIds({
    config: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  const modelMaps = [
    listAgentEntries(params.config).find((entry) => normalizeAgentId(entry.id) === sessionAgentId)
      ?.models,
    params.config.agents?.defaults?.models,
  ];
  const callerProvider = normalizeProviderId(params.provider ?? "");
  for (const models of modelMaps) {
    const scopeMatches = [];
    for (const [key, entry] of Object.entries(models ?? {})) {
      const matches = modelId
        ? modelKeyMatchKind({
            key,
            provider: params.provider,
            modelId,
          }) === params.matchKind
        : modelKeyIsProviderWildcard({
            key,
            provider: params.provider,
          });
      const policy = entry?.agentRuntime;
      if (!matches || !policy || !hasRuntimePolicy(policy)) continue;
      scopeMatches.push({
        provider: parseProviderModelKey(key)?.provider ?? "",
        policy,
      });
    }
    const resolved = resolvePolicyMatch(scopeMatches, callerProvider);
    if (resolved.policy || resolved.ambiguous) return resolved;
  }
  return {};
}
function resolveModelConfig(params) {
  const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
  if (!modelId || !Array.isArray(params.providerConfig?.models)) return;
  return params.providerConfig.models.find((entry) =>
    modelEntryMatches({
      entry,
      provider: params.provider,
      modelId,
    }),
  );
}
/** Resolves the effective runtime policy for an agent/model/provider selection. */
function resolveModelRuntimePolicy(params) {
  const callerProvider = normalizeProviderId(params.provider ?? "");
  const effectiveProvider = resolveEffectiveProvider(params.provider, params.modelId);
  const inferredMatchedProvider = callerProvider ? void 0 : effectiveProvider;
  if (process.env.OPENCLAW_BUILD_PRIVATE_QA === "1") {
    const forcedRuntime = process.env.OPENCLAW_QA_FORCE_RUNTIME?.trim().toLowerCase();
    if (forcedRuntime === "openclaw" || forcedRuntime === "codex")
      return {
        policy: { id: forcedRuntime },
        source: "model",
      };
  }
  const agentModelPolicy = resolveAgentModelEntryRuntimePolicy({
    ...params,
    provider: effectiveProvider,
    matchKind: "exact",
  });
  if (agentModelPolicy.ambiguous) return {};
  if (agentModelPolicy.policy) return agentModelPolicy;
  const providerConfig = resolveProviderConfig(params.config, effectiveProvider);
  const modelConfig = resolveModelConfig({
    providerConfig,
    provider: effectiveProvider,
    modelId: params.modelId,
  });
  if (hasRuntimePolicy(modelConfig?.agentRuntime))
    return {
      policy: modelConfig?.agentRuntime,
      source: "model",
      ...(inferredMatchedProvider ? { matchedProvider: inferredMatchedProvider } : {}),
    };
  const agentWildcardModelPolicy = resolveAgentModelEntryRuntimePolicy({
    ...params,
    provider: effectiveProvider,
    matchKind: "provider-wildcard",
  });
  if (agentWildcardModelPolicy.policy) return agentWildcardModelPolicy;
  if (hasRuntimePolicy(providerConfig?.agentRuntime))
    return {
      policy: providerConfig?.agentRuntime,
      source: "provider",
      ...(inferredMatchedProvider ? { matchedProvider: inferredMatchedProvider } : {}),
    };
  return {};
}
//#endregion
export { resolveModelRuntimePolicy as t };
