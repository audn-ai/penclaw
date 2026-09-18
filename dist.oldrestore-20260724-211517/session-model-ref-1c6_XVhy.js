import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import {
  i as normalizeStoredOverrideModel,
  u as resolvePersistedSelectedModelRef,
} from "./model-selection-DOlkTrQa.js";
import { c as parseModelRef } from "./model-selection-normalize-BoKGJiBx.js";
import {
  u as inferUniqueProviderFromConfiguredModels,
  v as resolveConfiguredModelRef,
} from "./model-selection-shared-BliwFXJy.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/session-model-ref.ts
function resolveSessionModelRef(cfg, entry, agentId, options) {
  const normalizedOverride = normalizeStoredOverrideModel({
    providerOverride: entry?.providerOverride,
    modelOverride: entry?.modelOverride,
  });
  if (normalizedOverride.providerOverride && normalizedOverride.modelOverride)
    return resolvePersistedSelectedModelRef({
      defaultProvider: normalizedOverride.providerOverride,
      overrideProvider: normalizedOverride.providerOverride,
      overrideModel: normalizedOverride.modelOverride,
      allowPluginNormalization: options?.allowPluginNormalization,
    });
  const runtimeProvider = normalizeOptionalString(entry?.modelProvider);
  const runtimeModel = normalizeOptionalString(entry?.model);
  const resolved = agentId
    ? resolveDefaultModelForAgent({
        cfg,
        agentId,
        allowPluginNormalization: options?.allowPluginNormalization,
      })
    : resolveConfiguredModelRef({
        cfg,
        defaultProvider: DEFAULT_PROVIDER,
        defaultModel: DEFAULT_MODEL,
        allowPluginNormalization: options?.allowPluginNormalization,
      });
  return (
    resolvePersistedSelectedModelRef({
      defaultProvider: resolved.provider || "openai",
      runtimeProvider: agentId ? void 0 : runtimeProvider,
      runtimeModel: agentId ? void 0 : runtimeModel,
      overrideProvider: normalizedOverride.providerOverride,
      overrideModel: normalizedOverride.modelOverride,
      allowPluginNormalization: options?.allowPluginNormalization,
    }) ?? resolved
  );
}
function resolveSessionModelIdentityRef(cfg, entry, agentId, fallbackModelRef, options) {
  const runtimeModel = entry?.model?.trim();
  const runtimeProvider = entry?.modelProvider?.trim();
  if (runtimeModel) {
    if (runtimeProvider)
      return {
        provider: runtimeProvider,
        model: runtimeModel,
      };
    const inferredProvider = inferUniqueProviderFromConfiguredModels({
      cfg,
      model: runtimeModel,
    });
    if (inferredProvider)
      return {
        provider: inferredProvider,
        model: runtimeModel,
      };
    if (runtimeModel.includes("/")) {
      const parsedRuntime = parseModelRef(runtimeModel, DEFAULT_PROVIDER, {
        allowPluginNormalization: options?.allowPluginNormalization,
      });
      if (parsedRuntime)
        return {
          provider: parsedRuntime.provider,
          model: parsedRuntime.model,
        };
      return { model: runtimeModel };
    }
    return { model: runtimeModel };
  }
  const fallbackRef = fallbackModelRef?.trim();
  if (fallbackRef) {
    const parsedFallback = parseModelRef(fallbackRef, DEFAULT_PROVIDER, {
      allowPluginNormalization: options?.allowPluginNormalization,
    });
    if (parsedFallback)
      return {
        provider: parsedFallback.provider,
        model: parsedFallback.model,
      };
    const inferredProvider = inferUniqueProviderFromConfiguredModels({
      cfg,
      model: fallbackRef,
    });
    if (inferredProvider)
      return {
        provider: inferredProvider,
        model: fallbackRef,
      };
    return { model: fallbackRef };
  }
  const resolved = resolveSessionModelRef(cfg, entry, agentId, {
    allowPluginNormalization: options?.allowPluginNormalization,
  });
  return {
    provider: resolved.provider,
    model: resolved.model,
  };
}
//#endregion
export { resolveSessionModelRef as n, resolveSessionModelIdentityRef as t };
