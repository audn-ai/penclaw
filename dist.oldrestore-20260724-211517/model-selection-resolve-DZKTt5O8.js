import { r as resolveAgentModelFallbackValues } from "./model-input-B7OGjVYg.js";
import {
  h as resolveAllowedModelRefFromAliasIndex,
  i as buildModelAliasIndex,
  s as getModelRefStatusWithFallbackModels,
} from "./model-selection-shared-BliwFXJy.js";
//#region src/agents/model-selection-resolve.ts
/**
 * Model selection resolution facade.
 *
 * This module exposes model-selection helpers that need default fallback model
 * handling before checking aliases, allowlists, catalogs, and plugin manifests.
 */
function resolveDefaultFallbackModels(cfg) {
  return resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
}
/** Returns whether a normalized model ref is available, allowed, or fallback-backed. */
function getModelRefStatus(params) {
  const { cfg, catalog, ref, defaultProvider, defaultModel, manifestPlugins } = params;
  return getModelRefStatusWithFallbackModels({
    cfg,
    catalog,
    ref,
    defaultProvider,
    defaultModel,
    fallbackModels: resolveDefaultFallbackModels(cfg),
    manifestPlugins,
  });
}
/** Resolves a raw model string into an allowed model ref or an explanatory error. */
function resolveAllowedModelRef(params) {
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
    manifestPlugins: params.manifestPlugins,
  });
  return resolveAllowedModelRefFromAliasIndex({
    cfg: params.cfg,
    raw: params.raw,
    defaultProvider: params.defaultProvider,
    aliasIndex,
    manifestPlugins: params.manifestPlugins,
    getStatus: (ref) =>
      getModelRefStatus({
        cfg: params.cfg,
        catalog: params.catalog,
        ref,
        defaultProvider: params.defaultProvider,
        defaultModel: params.defaultModel,
        manifestPlugins: params.manifestPlugins,
      }),
  });
}
//#endregion
export { resolveAllowedModelRef as n, getModelRefStatus as t };
