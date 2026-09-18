import { H as normalizeProviderConfigForConfigDefaults } from "./io-B3ne6NxF.js";
import {
  n as normalizeAgentModelRefForConfig,
  t as normalizeAgentModelMapForConfig,
} from "./model-input-B7OGjVYg.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./model-selection-DOlkTrQa.js";
//#region src/plugins/provider-auth-choice-helpers.ts
function resolveProviderMatch(providers, rawProvider) {
  const raw = normalizeOptionalString(rawProvider);
  if (!raw) return null;
  const normalized = normalizeProviderId(raw);
  return (
    providers.find((provider) => normalizeProviderId(provider.id) === normalized) ??
    providers.find(
      (provider) =>
        provider.aliases?.some((alias) => normalizeProviderId(alias) === normalized) ?? false,
    ) ??
    null
  );
}
function pickAuthMethod(provider, rawMethod) {
  const raw = normalizeOptionalString(rawMethod);
  if (!raw) return null;
  const normalized = normalizeOptionalLowercaseString(raw);
  return (
    provider.auth.find((method) => normalizeLowercaseStringOrEmpty(method.id) === normalized) ??
    provider.auth.find((method) => normalizeLowercaseStringOrEmpty(method.label) === normalized) ??
    null
  );
}
const BLOCKED_MERGE_KEYS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function sanitizeConfigPatchValue(value) {
  if (Array.isArray(value)) return value.map((entry) => sanitizeConfigPatchValue(entry));
  if (!isRecord(value)) return value;
  const next = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (BLOCKED_MERGE_KEYS.has(key)) continue;
    next[key] = sanitizeConfigPatchValue(nestedValue);
  }
  return next;
}
function mergeConfigPatch(base, patch) {
  if (!isRecord(base) || !isRecord(patch)) return sanitizeConfigPatchValue(patch);
  const next = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (BLOCKED_MERGE_KEYS.has(key)) continue;
    const existing = next[key];
    if (isRecord(existing) && isRecord(value)) next[key] = mergeConfigPatch(existing, value);
    else next[key] = sanitizeConfigPatchValue(value);
  }
  return next;
}
function deleteUndefinedPatchLeaves(target, patch) {
  if (!isRecord(target) || !isRecord(patch)) return target;
  const targetRecord = target;
  for (const [key, value] of Object.entries(patch)) {
    if (value === void 0) {
      delete targetRecord[key];
      continue;
    }
    deleteUndefinedPatchLeaves(targetRecord[key], value);
  }
  return target;
}
function normalizeAgentModelConfigForWrite(value) {
  if (typeof value === "string") return normalizeAgentModelRefForConfig(value);
  if (!isRecord(value)) return value;
  const next = { ...value };
  if (typeof next.primary === "string")
    next.primary = normalizeAgentModelRefForConfig(next.primary);
  if (Array.isArray(next.fallbacks))
    next.fallbacks = next.fallbacks.map((fallback) =>
      typeof fallback === "string" ? normalizeAgentModelRefForConfig(fallback) : fallback,
    );
  return next;
}
function normalizeAgentModelMapForWrite(value) {
  if (!isRecord(value)) return value;
  return normalizeAgentModelMapForConfig(value);
}
function normalizeProviderCatalogModelIdForWrite(provider, modelId) {
  const trimmed = modelId.trim();
  if (!trimmed) return trimmed;
  return normalizeConfiguredProviderCatalogModelId(normalizeProviderId(provider), trimmed);
}
function normalizeProviderCatalogModelIdsForWrite(provider, providerConfig) {
  const models = providerConfig.models;
  if (!Array.isArray(models) || models.length === 0) return providerConfig;
  let mutated = false;
  const nextModels = models.map((model) => {
    const nextId = normalizeProviderCatalogModelIdForWrite(provider, model.id);
    if (nextId === model.id) return model;
    mutated = true;
    return Object.assign({}, model, { id: nextId });
  });
  return mutated
    ? {
        ...providerConfig,
        models: nextModels,
      }
    : providerConfig;
}
function normalizeModelProviderConfigsForWrite(cfg, providerConfigNormalizer) {
  const providers = cfg.models?.providers;
  if (!providers) return cfg;
  let mutated = false;
  const nextProviders = { ...providers };
  for (const [provider, providerConfig] of Object.entries(providers)) {
    const normalizedProviderConfig = normalizeProviderCatalogModelIdsForWrite(
      provider,
      providerConfigNormalizer({
        provider,
        providerConfig,
      }),
    );
    if (normalizedProviderConfig === providerConfig) continue;
    nextProviders[provider] = normalizedProviderConfig;
    mutated = true;
  }
  if (!mutated) return cfg;
  return {
    ...cfg,
    models: {
      ...cfg.models,
      providers: nextProviders,
    },
  };
}
function normalizeAgentListForWrite(value) {
  if (!Array.isArray(value)) return value;
  let mutated = false;
  const next = value.map((agent) => {
    if (!isRecord(agent)) return agent;
    let nextAgent = agent;
    if (Object.hasOwn(agent, "model")) {
      const normalizedModel = normalizeAgentModelConfigForWrite(agent.model);
      if (normalizedModel !== agent.model) {
        nextAgent = {
          ...nextAgent,
          model: normalizedModel,
        };
        mutated = true;
      }
    }
    if (Object.hasOwn(agent, "models")) {
      const normalizedModels = normalizeAgentModelMapForWrite(agent.models);
      if (normalizedModels !== agent.models) {
        nextAgent = {
          ...nextAgent,
          models: normalizedModels,
        };
        mutated = true;
      }
    }
    return nextAgent;
  });
  return mutated ? next : value;
}
function normalizeConfigModelRefsForWrite(cfg, providerConfigNormalizer) {
  const providerNormalized = normalizeModelProviderConfigsForWrite(cfg, providerConfigNormalizer);
  const defaults = providerNormalized.agents?.defaults;
  const agentsList = providerNormalized.agents?.list;
  let nextDefaults = defaults;
  if (defaults) {
    nextDefaults = { ...defaults };
    if (defaults.model !== void 0)
      nextDefaults.model = normalizeAgentModelConfigForWrite(defaults.model);
    if (defaults.models !== void 0)
      nextDefaults.models = normalizeAgentModelMapForWrite(defaults.models);
  }
  const nextAgentsList = normalizeAgentListForWrite(agentsList);
  if (nextDefaults === defaults && nextAgentsList === agentsList) return providerNormalized;
  return {
    ...providerNormalized,
    agents: {
      ...providerNormalized.agents,
      ...(nextDefaults ? { defaults: nextDefaults } : {}),
      ...(nextAgentsList !== void 0 ? { list: nextAgentsList } : {}),
    },
  };
}
/** Keep a restrictive model allowlist consistent with the configured primary and fallbacks. */
function ensureConfiguredDefaultModelsAllowed(cfg) {
  const defaults = cfg.agents?.defaults;
  if (!defaults?.models) return cfg;
  const model = defaults.model;
  const refs = [
    typeof model === "string" ? model : model?.primary,
    ...(typeof model === "object" ? (model.fallbacks ?? []) : []),
  ].filter((ref) => typeof ref === "string" && ref.trim().length > 0);
  const models = normalizeAgentModelMapForConfig(defaults.models);
  let changed = false;
  for (const ref of refs) {
    const normalizedRef = normalizeAgentModelRefForConfig(ref);
    if (!models[normalizedRef]) {
      models[normalizedRef] = {};
      changed = true;
    }
  }
  if (!changed) return cfg;
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        models,
      },
    },
  };
}
function applyProviderAuthConfigPatch(cfg, patch, options) {
  const providerConfigNormalizer =
    options?.providerConfigNormalizer ?? normalizeProviderConfigForConfigDefaults;
  const merged = normalizeConfigModelRefsForWrite(
    deleteUndefinedPatchLeaves(mergeConfigPatch(cfg, patch), patch),
    providerConfigNormalizer,
  );
  if (!options?.replaceDefaultModels || !isRecord(patch))
    return ensureConfiguredDefaultModelsAllowed(merged);
  const patchModels = patch.agents?.defaults?.models;
  if (!isRecord(patchModels)) return merged;
  return normalizeConfigModelRefsForWrite(
    {
      ...merged,
      agents: {
        ...merged.agents,
        defaults: {
          ...merged.agents?.defaults,
          models: sanitizeConfigPatchValue(patchModels),
        },
      },
    },
    providerConfigNormalizer,
  );
}
/**
 * Restore `agents.defaults.model` after a provider auth config merge when the user did not pass
 * `--set-default`, so `applyConfig` patches cannot replace the primary without an explicit opt-in.
 */
function restorePriorAgentsDefaultsModelUnlessOptIn(params) {
  if (params.setDefault || params.priorAgentsDefaultsModel === void 0) return params.cfg;
  return {
    ...params.cfg,
    agents: {
      ...params.cfg.agents,
      defaults: {
        ...params.cfg.agents?.defaults,
        model: params.priorAgentsDefaultsModel,
      },
    },
  };
}
function applyDefaultModel(cfg, model, opts) {
  const normalizedModel = normalizeAgentModelRefForConfig(model);
  const models = { ...normalizeAgentModelMapForConfig(cfg.agents?.defaults?.models ?? {}) };
  models[normalizedModel] = models[normalizedModel] ?? {};
  const existingModel = cfg.agents?.defaults?.model;
  const existingPrimary =
    typeof existingModel === "string"
      ? existingModel
      : existingModel && typeof existingModel === "object"
        ? existingModel.primary
        : void 0;
  const normalizedExistingPrimary = existingPrimary
    ? normalizeAgentModelRefForConfig(existingPrimary)
    : void 0;
  const existingFallbacks =
    existingModel && typeof existingModel === "object" && "fallbacks" in existingModel
      ? existingModel.fallbacks?.map((fallback) => normalizeAgentModelRefForConfig(fallback))
      : void 0;
  return ensureConfiguredDefaultModelsAllowed({
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models,
        model: {
          ...(existingFallbacks ? { fallbacks: existingFallbacks } : void 0),
          primary:
            opts?.preserveExistingPrimary === true
              ? (normalizedExistingPrimary ?? normalizedModel)
              : normalizedModel,
        },
      },
    },
  });
}
//#endregion
export {
  restorePriorAgentsDefaultsModelUnlessOptIn as a,
  resolveProviderMatch as i,
  applyProviderAuthConfigPatch as n,
  pickAuthMethod as r,
  applyDefaultModel as t,
};
