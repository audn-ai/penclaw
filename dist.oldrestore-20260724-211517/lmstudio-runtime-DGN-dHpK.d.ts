import { f as ModelProviderConfig, s as ModelDefinitionConfig } from "./types.models-BqJSiNyu.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/lmstudio-runtime.d.ts
type LmstudioReasoningCapabilityWire = {
  allowed_options?: unknown;
  default?: unknown;
};
/** Raw model entry returned by LM Studio's local model catalog endpoints. */
type LmstudioModelWire = {
  type?: "llm" | "embedding";
  key?: string;
  display_name?: string;
  max_context_length?: number;
  format?: "gguf" | "mlx" | null;
  capabilities?: {
    vision?: boolean;
    trained_for_tool_use?: boolean;
    reasoning?: LmstudioReasoningCapabilityWire;
  };
  loaded_instances?: Array<{
    id?: string;
    config?: {
      context_length?: number;
    } | null;
  } | null>;
};
/** Normalized model metadata used by OpenClaw provider catalogs. */
type LmstudioModelBase = {
  id: string;
  displayName: string;
  format: "gguf" | "mlx" | null;
  vision: boolean;
  trainedForToolUse: boolean;
  loaded: boolean;
  reasoning: boolean;
  input: Array<"text" | "image">;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  contextTokens: number;
  maxTokens: number;
};
/** Result from probing LM Studio model discovery without throwing on unreachable servers. */
type FetchLmstudioModelsResult = {
  reachable: boolean;
  status?: number;
  models: LmstudioModelWire[];
  error?: unknown;
};
type FacadeModule = {
  LMSTUDIO_DEFAULT_BASE_URL: string;
  LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: string;
  LMSTUDIO_DEFAULT_EMBEDDING_MODEL: string;
  LMSTUDIO_PROVIDER_LABEL: string;
  LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: string;
  LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: string;
  LMSTUDIO_MODEL_PLACEHOLDER: string;
  LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: number;
  LMSTUDIO_DEFAULT_MODEL_ID: string;
  LMSTUDIO_PROVIDER_ID: string;
  resolveLmstudioReasoningCapability: (entry: Pick<LmstudioModelWire, "capabilities">) => boolean;
  resolveLoadedContextWindow: (entry: Pick<LmstudioModelWire, "loaded_instances">) => number | null;
  resolveLmstudioServerBase: (configuredBaseUrl?: string) => string;
  resolveLmstudioInferenceBase: (configuredBaseUrl?: string) => string;
  normalizeLmstudioProviderConfig: (provider: ModelProviderConfig) => ModelProviderConfig;
  fetchLmstudioModels: (params?: {
    baseUrl?: string;
    apiKey?: string;
    headers?: Record<string, string>;
    ssrfPolicy?: unknown;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
  }) => Promise<FetchLmstudioModelsResult>;
  mapLmstudioWireEntry: (entry: LmstudioModelWire) => LmstudioModelBase | null;
  discoverLmstudioModels: (params?: {
    config?: OpenClawConfig;
    baseUrl?: string;
    apiKey?: string;
    headers?: Record<string, string>;
  }) => Promise<ModelDefinitionConfig[]>;
  ensureLmstudioModelLoaded: (params: Record<string, unknown>) => Promise<unknown>;
  buildLmstudioAuthHeaders: (params: {
    apiKey?: string;
    json?: boolean;
    headers?: Record<string, string>;
  }) => Record<string, string> | undefined;
  resolveLmstudioConfiguredApiKey: (params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    path?: string;
  }) => Promise<string | undefined>;
  resolveLmstudioProviderHeaders: (params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    headers?: unknown;
    path?: string;
  }) => Promise<Record<string, string> | undefined>;
  resolveLmstudioRequestContext: (params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    headers?: unknown;
    providerHeaders?: unknown;
    path?: string;
  }) => Promise<{
    apiKey?: string;
    headers?: Record<string, string>;
  }>;
  resolveLmstudioRuntimeApiKey: (params: {
    config?: OpenClawConfig;
    agentDir?: string;
    env?: NodeJS.ProcessEnv;
    headers?: unknown;
  }) => Promise<string | undefined>;
};
/** Default local LM Studio server base URL. */
declare const LMSTUDIO_DEFAULT_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_BASE_URL"];
/** Default OpenAI-compatible inference base derived from the local LM Studio server URL. */
declare const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_INFERENCE_BASE_URL"];
/** Default embedding model id advertised by LM Studio setup helpers. */
declare const LMSTUDIO_DEFAULT_EMBEDDING_MODEL: FacadeModule["LMSTUDIO_DEFAULT_EMBEDDING_MODEL"];
/** Human-readable provider label for LM Studio catalogs and setup output. */
declare const LMSTUDIO_PROVIDER_LABEL: FacadeModule["LMSTUDIO_PROVIDER_LABEL"];
/** Environment variable checked for LM Studio API tokens. */
declare const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: FacadeModule["LMSTUDIO_DEFAULT_API_KEY_ENV_VAR"];
/** Placeholder token used for local LM Studio servers that accept any API key. */
declare const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: FacadeModule["LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER"];
/** Placeholder model id shown when setup needs a model from `/api/v1/models`. */
declare const LMSTUDIO_MODEL_PLACEHOLDER: FacadeModule["LMSTUDIO_MODEL_PLACEHOLDER"];
/** Default context length requested when loading LM Studio models. */
declare const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: FacadeModule["LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH"];
/** Default chat model id used when no local LM Studio model has been selected. */
declare const LMSTUDIO_DEFAULT_MODEL_ID: FacadeModule["LMSTUDIO_DEFAULT_MODEL_ID"];
/** Stable provider id used in OpenClaw config and provider catalogs. */
declare const LMSTUDIO_PROVIDER_ID: FacadeModule["LMSTUDIO_PROVIDER_ID"];
/** Resolve whether an LM Studio wire entry advertises reasoning support. */
declare const resolveLmstudioReasoningCapability: FacadeModule["resolveLmstudioReasoningCapability"];
/** Resolve context-window metadata from currently loaded LM Studio instances. */
declare const resolveLoadedContextWindow: FacadeModule["resolveLoadedContextWindow"];
/** Normalize a configured LM Studio server base URL. */
declare const resolveLmstudioServerBase: FacadeModule["resolveLmstudioServerBase"];
/** Normalize the OpenAI-compatible LM Studio inference base URL. */
declare const resolveLmstudioInferenceBase: FacadeModule["resolveLmstudioInferenceBase"];
/** Normalize an LM Studio provider config before runtime use. */
declare const normalizeLmstudioProviderConfig: FacadeModule["normalizeLmstudioProviderConfig"];
/** Fetch raw LM Studio model entries with SSRF and timeout handling owned by the facade. */
declare const fetchLmstudioModels: FacadeModule["fetchLmstudioModels"];
/** Map one raw LM Studio model entry into OpenClaw model metadata. */
declare const mapLmstudioWireEntry: FacadeModule["mapLmstudioWireEntry"];
/** Discover OpenClaw model definitions from an LM Studio server. */
declare const discoverLmstudioModels: FacadeModule["discoverLmstudioModels"];
/** Ensure a specific LM Studio model is loaded before use. */
declare const ensureLmstudioModelLoaded: FacadeModule["ensureLmstudioModelLoaded"];
/** Build request headers for LM Studio calls from optional API key and caller headers. */
declare const buildLmstudioAuthHeaders: FacadeModule["buildLmstudioAuthHeaders"];
/** Resolve the configured LM Studio API key from config, env, or profile path. */
declare const resolveLmstudioConfiguredApiKey: FacadeModule["resolveLmstudioConfiguredApiKey"];
/** Resolve provider headers for LM Studio catalog and runtime requests. */
declare const resolveLmstudioProviderHeaders: FacadeModule["resolveLmstudioProviderHeaders"];
/** Resolve the combined API key and headers used for LM Studio requests. */
declare const resolveLmstudioRequestContext: FacadeModule["resolveLmstudioRequestContext"];
/** Resolve the runtime API key for an agent-scoped LM Studio request. */
declare const resolveLmstudioRuntimeApiKey: FacadeModule["resolveLmstudioRuntimeApiKey"];
//#endregion
export {
  resolveLmstudioReasoningCapability as C,
  resolveLoadedContextWindow as D,
  resolveLmstudioServerBase as E,
  resolveLmstudioProviderHeaders as S,
  resolveLmstudioRuntimeApiKey as T,
  fetchLmstudioModels as _,
  LMSTUDIO_DEFAULT_INFERENCE_BASE_URL as a,
  resolveLmstudioConfiguredApiKey as b,
  LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER as c,
  LMSTUDIO_PROVIDER_LABEL as d,
  LmstudioModelBase as f,
  ensureLmstudioModelLoaded as g,
  discoverLmstudioModels as h,
  LMSTUDIO_DEFAULT_EMBEDDING_MODEL as i,
  LMSTUDIO_MODEL_PLACEHOLDER as l,
  buildLmstudioAuthHeaders as m,
  LMSTUDIO_DEFAULT_API_KEY_ENV_VAR as n,
  LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH as o,
  LmstudioModelWire as p,
  LMSTUDIO_DEFAULT_BASE_URL as r,
  LMSTUDIO_DEFAULT_MODEL_ID as s,
  FetchLmstudioModelsResult as t,
  LMSTUDIO_PROVIDER_ID as u,
  mapLmstudioWireEntry as v,
  resolveLmstudioRequestContext as w,
  resolveLmstudioInferenceBase as x,
  normalizeLmstudioProviderConfig as y,
};
