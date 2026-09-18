import {
  a as ModelApi,
  f as ModelProviderConfig,
  s as ModelDefinitionConfig,
} from "./types.models-BqJSiNyu.js";
import { fn as AgentModelEntryConfig, i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/provider-onboard.d.ts
/** Alias registration accepted by provider onboarding presets. */
type AgentModelAliasEntry =
  | string
  | {
      modelRef: string;
      alias?: string;
    };
/** Current OpenCode Zen default model ref used by onboarding and repair flows. */
declare const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";
/** Pair of preset appliers exposed by provider setup modules. */
type ProviderOnboardPresetAppliers<TArgs extends unknown[]> = {
  applyProviderConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
  applyConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
};
/** Merge provider alias entries into the agent default model map without clobbering existing aliases. */
declare function withAgentModelAliases(
  existing: Record<string, AgentModelEntryConfig> | undefined,
  aliases: readonly AgentModelAliasEntry[],
): Record<string, AgentModelEntryConfig>;
/** Write onboarding-auth model aliases and provider configs into the canonical config sections. */
declare function applyOnboardAuthAgentModelsAndProviders(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providers: Record<string, ModelProviderConfig>;
  },
): OpenClawConfig;
/** Set the agent default primary model while preserving normalized fallbacks and provider models. */
declare function applyAgentDefaultModelPrimary(
  cfg: OpenClawConfig,
  primary: string,
): OpenClawConfig;
/** Move configs without a primary default onto the current OpenCode Zen model. */
declare function applyOpencodeZenModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
};
/** Merge a provider config and seed required default models when the provider has no matching model yet. */
declare function applyProviderConfigWithDefaultModels(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
  },
): OpenClawConfig;
/** Single-model wrapper around `applyProviderConfigWithDefaultModels`. */
declare function applyProviderConfigWithDefaultModel(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
  },
): OpenClawConfig;
/** Apply a single-model provider preset and set the primary model only when the user has none. */
declare function applyProviderConfigWithDefaultModelPreset(
  cfg: OpenClawConfig,
  params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
  },
): OpenClawConfig;
/** Build setup appliers for presets that resolve to one default provider model. */
declare function createDefaultModelPresetAppliers<TArgs extends unknown[]>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) =>
    | Omit<Parameters<typeof applyProviderConfigWithDefaultModelPreset>[1], "primaryModelRef">
    | null
    | undefined;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs>;
/** Apply a multi-model provider preset and set the primary model only when the user has none. */
declare function applyProviderConfigWithDefaultModelsPreset(
  cfg: OpenClawConfig,
  params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
  },
): OpenClawConfig;
/** Build setup appliers for presets that resolve to multiple default provider models. */
declare function createDefaultModelsPresetAppliers<TArgs extends unknown[]>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) =>
    | Omit<Parameters<typeof applyProviderConfigWithDefaultModelsPreset>[1], "primaryModelRef">
    | null
    | undefined;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs>;
/** Merge a provider config with a catalog while preserving existing model entries first. */
declare function applyProviderConfigWithModelCatalog(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
  },
): OpenClawConfig;
/** Apply a catalog-backed provider preset and set the primary model only when the user has none. */
declare function applyProviderConfigWithModelCatalogPreset(
  cfg: OpenClawConfig,
  params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
  },
): OpenClawConfig;
/** Build setup appliers for presets that resolve to a provider model catalog. */
declare function createModelCatalogPresetAppliers<TArgs extends unknown[]>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) =>
    | Omit<Parameters<typeof applyProviderConfigWithModelCatalogPreset>[1], "primaryModelRef">
    | null
    | undefined;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs>;
/** Ensure static model allowlists include a provider model ref after onboarding. */
declare function ensureModelAllowlistEntry(params: {
  cfg: OpenClawConfig;
  modelRef: string;
  defaultProvider?: string;
}): OpenClawConfig;
//#endregion
export {
  withAgentModelAliases as _,
  applyOnboardAuthAgentModelsAndProviders as a,
  applyProviderConfigWithDefaultModelPreset as c,
  applyProviderConfigWithModelCatalog as d,
  applyProviderConfigWithModelCatalogPreset as f,
  ensureModelAllowlistEntry as g,
  createModelCatalogPresetAppliers as h,
  applyAgentDefaultModelPrimary as i,
  applyProviderConfigWithDefaultModels as l,
  createDefaultModelsPresetAppliers as m,
  OPENCODE_ZEN_DEFAULT_MODEL as n,
  applyOpencodeZenModelDefault as o,
  createDefaultModelPresetAppliers as p,
  ProviderOnboardPresetAppliers as r,
  applyProviderConfigWithDefaultModel as s,
  AgentModelAliasEntry as t,
  applyProviderConfigWithDefaultModelsPreset as u,
};
