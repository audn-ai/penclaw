import {
  C as resolveLmstudioReasoningCapability,
  D as resolveLoadedContextWindow,
  E as resolveLmstudioServerBase,
  S as resolveLmstudioProviderHeaders,
  T as resolveLmstudioRuntimeApiKey,
  _ as fetchLmstudioModels,
  a as LMSTUDIO_DEFAULT_INFERENCE_BASE_URL,
  b as resolveLmstudioConfiguredApiKey,
  c as LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER,
  d as LMSTUDIO_PROVIDER_LABEL,
  f as LmstudioModelBase,
  g as ensureLmstudioModelLoaded,
  h as discoverLmstudioModels,
  i as LMSTUDIO_DEFAULT_EMBEDDING_MODEL,
  l as LMSTUDIO_MODEL_PLACEHOLDER,
  m as buildLmstudioAuthHeaders,
  n as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
  o as LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH,
  p as LmstudioModelWire,
  r as LMSTUDIO_DEFAULT_BASE_URL,
  s as LMSTUDIO_DEFAULT_MODEL_ID,
  u as LMSTUDIO_PROVIDER_ID,
  v as mapLmstudioWireEntry,
  x as resolveLmstudioInferenceBase,
  y as normalizeLmstudioProviderConfig,
} from "../lmstudio-runtime-DGN-dHpK.js";
import { i as WizardPrompter } from "../prompts-CWXx5gsI.js";
import {
  C as OpenClawPluginApi,
  Ct as ProviderAuthContext,
  Dt as ProviderAuthMethodNonInteractiveContext,
  Ft as ProviderCatalogContext,
  Ot as ProviderAuthResult,
  Vt as ProviderDiscoveryContext,
  fn as ProviderPrepareDynamicModelContext,
  nd as ProviderRuntimeModel,
} from "../types-Ga3mNO_F.js";
import { f as ModelProviderConfig } from "../types.models-BqJSiNyu.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/lmstudio.d.ts
type LmstudioInteractiveParams = {
  config: OpenClawConfig;
  prompter?: WizardPrompter;
  secretInputMode?: unknown;
  allowSecretRefPrompt?: boolean;
  promptText?: (params: {
    message: string;
    initialValue?: string;
    placeholder?: string;
    validate?: (value: string | undefined) => string | undefined;
  }) => Promise<string | undefined>;
  note?: (message: string, title?: string) => Promise<void> | void;
};
type FacadeModule = {
  promptAndConfigureLmstudioInteractive: (
    params: LmstudioInteractiveParams,
  ) => Promise<ProviderAuthResult>;
  configureLmstudioNonInteractive: (
    ctx: ProviderAuthMethodNonInteractiveContext,
  ) => Promise<OpenClawConfig | null>;
  discoverLmstudioProvider: (ctx: ProviderCatalogContext) => Promise<{
    provider: ModelProviderConfig;
  } | null>;
  prepareLmstudioDynamicModels: (
    ctx: ProviderPrepareDynamicModelContext,
  ) => Promise<ProviderRuntimeModel[]>;
};
/** Prompts for LM Studio configuration through the activated bundled provider facade. */
declare const promptAndConfigureLmstudioInteractive: FacadeModule["promptAndConfigureLmstudioInteractive"];
/** Applies non-interactive LM Studio auth/configuration through the provider facade. */
declare const configureLmstudioNonInteractive: FacadeModule["configureLmstudioNonInteractive"];
/** Discovers LM Studio provider config through the activated provider facade. */
declare const discoverLmstudioProvider: FacadeModule["discoverLmstudioProvider"];
/** Prepares dynamic LM Studio models through the activated provider facade. */
declare const prepareLmstudioDynamicModels: FacadeModule["prepareLmstudioDynamicModels"];
//#endregion
export {
  LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
  LMSTUDIO_DEFAULT_BASE_URL,
  LMSTUDIO_DEFAULT_EMBEDDING_MODEL,
  LMSTUDIO_DEFAULT_INFERENCE_BASE_URL,
  LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH,
  LMSTUDIO_DEFAULT_MODEL_ID,
  LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER,
  LMSTUDIO_MODEL_PLACEHOLDER,
  LMSTUDIO_PROVIDER_ID,
  LMSTUDIO_PROVIDER_LABEL,
  type LmstudioModelBase,
  type LmstudioModelWire,
  type OpenClawPluginApi,
  type ProviderAuthContext,
  type ProviderAuthMethodNonInteractiveContext,
  type ProviderAuthResult,
  type ProviderCatalogContext,
  type ProviderDiscoveryContext,
  type ProviderPrepareDynamicModelContext,
  type ProviderRuntimeModel,
  buildLmstudioAuthHeaders,
  configureLmstudioNonInteractive,
  discoverLmstudioModels,
  discoverLmstudioProvider,
  ensureLmstudioModelLoaded,
  fetchLmstudioModels,
  mapLmstudioWireEntry,
  normalizeLmstudioProviderConfig,
  prepareLmstudioDynamicModels,
  promptAndConfigureLmstudioInteractive,
  resolveLmstudioConfiguredApiKey,
  resolveLmstudioInferenceBase,
  resolveLmstudioProviderHeaders,
  resolveLmstudioReasoningCapability,
  resolveLmstudioRuntimeApiKey,
  resolveLmstudioServerBase,
  resolveLoadedContextWindow,
};
