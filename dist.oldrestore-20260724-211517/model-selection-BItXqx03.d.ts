import { t as ModelCatalogEntry } from "./model-catalog.types-DCVmZqMZ.js";
import {
  n as ModelRef,
  t as ModelManifestNormalizationContext,
} from "./model-selection-normalize-Bv4Vn4_c.js";
import { r as ThinkLevel } from "./thinking.shared-0bZWY054.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/model-selection-config.d.ts
declare function resolveDefaultModelForAgent(
  params: {
    cfg: OpenClawConfig;
    agentId?: string;
    allowPluginNormalization?: boolean;
  } & ModelManifestNormalizationContext,
): ModelRef;
declare function resolveSubagentConfiguredModelSelection(params: {
  cfg: OpenClawConfig;
  agentId: string;
  includeAgentPrimary?: boolean;
}): string | undefined;
//#endregion
//#region src/agents/model-thinking-default.d.ts
/** Resolves the default thinking level for a provider/model pair. */
declare function resolveThinkingDefault(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
  agentRuntime?: string | null;
}): ThinkLevel;
/** Resolves thinking default after loading runtime catalog only when needed. */
declare function resolveThinkingDefaultWithRuntimeCatalog(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  loadModelCatalog: () => Promise<ModelCatalogEntry[]>;
  agentRuntime?: string | null;
}): Promise<ThinkLevel>;
//#endregion
//#region src/agents/model-selection-shared.d.ts
type ModelManifestPlugins = ModelManifestNormalizationContext["manifestPlugins"];
type ModelAliasIndex = {
  byAlias: Map<
    string,
    {
      alias: string;
      ref: ModelRef;
    }
  >;
  byProviderAlias?: Map<
    string,
    {
      alias: string;
      ref: ModelRef;
    }
  >;
  byKey: Map<string, string[]>;
};
/** Infer a unique provider for a bare model from configured model rows. */
declare function inferUniqueProviderFromConfiguredModels(
  params: {
    cfg: OpenClawConfig;
    model: string;
    allowManifestNormalization?: boolean;
  } & ModelManifestNormalizationContext,
): string | undefined;
/** Infer a unique provider for a bare model from a provider catalog. */
declare function inferUniqueProviderFromCatalog(params: {
  catalog: readonly ModelCatalogEntry[];
  model: string;
}): string | undefined;
/** Resolve the provider used when a model string omits provider/id syntax. */
declare function resolveBareModelDefaultProvider(
  params: {
    cfg: OpenClawConfig;
    catalog: readonly ModelCatalogEntry[];
    model: string;
    defaultProvider: string;
  } & ModelManifestNormalizationContext,
): string;
/** Build the exact configured model keys that constrain model visibility. */
declare function buildConfiguredAllowlistKeys(
  params: {
    cfg: OpenClawConfig | undefined;
    defaultProvider: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
  } & ModelManifestNormalizationContext,
): Set<string> | null;
type BuildModelAliasIndexParams = {
  cfg: OpenClawConfig;
  defaultProvider: string;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext;
/** Build lookup maps from user-facing aliases to normalized model refs. */
declare function buildModelAliasIndex(params: BuildModelAliasIndexParams): ModelAliasIndex;
declare function resolveModelRefFromString(
  params: {
    cfg?: OpenClawConfig;
    raw: string;
    defaultProvider: string;
    aliasIndex?: ModelAliasIndex;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
  } & ModelManifestNormalizationContext,
): {
  ref: ModelRef;
  alias?: string;
} | null;
/** Resolve the default configured model ref, including aliases and fallback provider rows. */
declare function resolveConfiguredModelRef(
  params: {
    cfg: OpenClawConfig;
    defaultProvider: string;
    defaultModel: string;
    allowManifestNormalization?: boolean;
    allowPluginNormalization?: boolean;
  } & ModelManifestNormalizationContext,
): ModelRef;
/** Status of a candidate model against catalog and configured allowlist state. */
type ModelRefStatus = {
  key: string;
  inCatalog: boolean;
  allowAny: boolean;
  allowed: boolean;
};
/** Build catalog entries from configured provider model rows. */
declare function buildConfiguredModelCatalog(params: {
  cfg: OpenClawConfig;
  workspaceDir?: string;
  manifestPlugins?: ModelManifestPlugins;
}): ModelCatalogEntry[];
declare function resolveHooksGmailModel(
  params: {
    cfg: OpenClawConfig;
    defaultProvider: string;
  } & ModelManifestNormalizationContext,
): ModelRef | null;
declare function normalizeModelSelection(value: unknown): string | undefined;
//#endregion
//#region src/agents/model-selection-cli.d.ts
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
declare function isCliProvider(provider: string, cfg?: OpenClawConfig): boolean;
//#endregion
//#region src/agents/model-selection.d.ts
declare function resolvePersistedOverrideModelRef(params: {
  defaultProvider?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
}): ModelRef | null;
/**
 * Runtime-first resolver for persisted model metadata.
 * Use this when callers intentionally want the last executed model identity.
 */
declare function resolvePersistedModelRef(params: {
  defaultProvider?: unknown;
  runtimeProvider?: unknown;
  runtimeModel?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
}): ModelRef | null;
/**
 * Selected-model resolver for persisted model metadata.
 * Use this for control/status/UI surfaces that should honor explicit session
 * overrides before falling back to runtime identity.
 */
declare function resolvePersistedSelectedModelRef(params: {
  defaultProvider?: unknown;
  runtimeProvider?: unknown;
  runtimeModel?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
}): ModelRef | null;
declare function normalizeStoredOverrideModel(params: {
  providerOverride?: unknown;
  modelOverride?: unknown;
}): {
  providerOverride?: string;
  modelOverride?: string;
};
declare function resolveAllowlistModelKey(
  raw: string,
  defaultProvider: string,
  cfg?: OpenClawConfig,
  manifestPlugins?: ModelManifestNormalizationContext["manifestPlugins"],
): string | null;
declare function canonicalizeCaseOnlyCatalogModelRef(params: {
  raw: string | undefined;
  cfg?: OpenClawConfig;
  defaultProvider: string;
  loadCatalog: () => Promise<ModelCatalogEntry[]>;
  aliasIndex?: ModelAliasIndex;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
  preserveAuthProfile?: boolean;
}): Promise<string | undefined>;
declare function resolveSubagentSpawnModelSelection(params: {
  cfg: OpenClawConfig;
  agentId: string;
  modelOverride?: unknown;
}): string;
declare function resolveConfiguredSubagentSpawnModelSelection(params: {
  cfg: OpenClawConfig;
  agentId: string;
  modelOverride?: unknown;
  defaultProvider?: string;
  includeAgentPrimary?: boolean;
}): string | undefined;
declare function buildAllowedModelSet(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    defaultProvider: string;
    defaultModel?: string;
    agentId?: string;
  } & ModelManifestNormalizationContext,
): {
  allowAny: boolean;
  allowedCatalog: ModelCatalogEntry[];
  allowedKeys: Set<string>;
};
declare function getModelRefStatus(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    ref: ModelRef;
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
): ModelRefStatus;
declare function resolveAllowedModelRef(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    raw: string;
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
):
  | {
      ref: ModelRef;
      key: string;
    }
  | {
      error: string;
    };
/** Default reasoning level when session/directive do not set it: "on" if model supports reasoning, else "off". */
declare function resolveReasoningDefault(params: {
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
}): "on" | "off";
//#endregion
export {
  resolveConfiguredModelRef as C,
  resolveThinkingDefaultWithRuntimeCatalog as D,
  resolveThinkingDefault as E,
  resolveDefaultModelForAgent as O,
  resolveBareModelDefaultProvider as S,
  resolveModelRefFromString as T,
  buildConfiguredModelCatalog as _,
  resolveAllowedModelRef as a,
  inferUniqueProviderFromConfiguredModels as b,
  resolvePersistedModelRef as c,
  resolveReasoningDefault as d,
  resolveSubagentSpawnModelSelection as f,
  buildConfiguredAllowlistKeys as g,
  ModelRefStatus as h,
  normalizeStoredOverrideModel as i,
  resolveSubagentConfiguredModelSelection as k,
  resolvePersistedOverrideModelRef as l,
  ModelAliasIndex as m,
  canonicalizeCaseOnlyCatalogModelRef as n,
  resolveAllowlistModelKey as o,
  isCliProvider as p,
  getModelRefStatus as r,
  resolveConfiguredSubagentSpawnModelSelection as s,
  buildAllowedModelSet as t,
  resolvePersistedSelectedModelRef as u,
  buildModelAliasIndex as v,
  resolveHooksGmailModel as w,
  normalizeModelSelection as x,
  inferUniqueProviderFromCatalog as y,
};
