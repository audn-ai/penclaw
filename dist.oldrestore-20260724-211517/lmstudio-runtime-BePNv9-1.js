import {
  i as loadBundledPluginPublicSurfaceModuleSync,
  n as createLazyFacadeValue,
} from "./facade-runtime-D2RPlnfc.js";
//#region src/plugin-sdk/lmstudio-runtime.ts
function loadFacadeModule() {
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: "lmstudio",
    artifactBasename: "runtime-api.js",
  });
}
/** Default local LM Studio server base URL. */
const LMSTUDIO_DEFAULT_BASE_URL = "http://localhost:1234";
/** Default OpenAI-compatible inference base derived from the local LM Studio server URL. */
const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL = `${LMSTUDIO_DEFAULT_BASE_URL}/v1`;
/** Default embedding model id advertised by LM Studio setup helpers. */
const LMSTUDIO_DEFAULT_EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5";
/** Human-readable provider label for LM Studio catalogs and setup output. */
const LMSTUDIO_PROVIDER_LABEL = "LM Studio";
/** Environment variable checked for LM Studio API tokens. */
const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR = "LM_API_TOKEN";
/** Placeholder token used for local LM Studio servers that accept any API key. */
const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER = "lmstudio-local";
/** Placeholder model id shown when setup needs a model from `/api/v1/models`. */
const LMSTUDIO_MODEL_PLACEHOLDER = "model-key-from-api-v1-models";
/** Default context length requested when loading LM Studio models. */
const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH = 64e3;
/** Default chat model id used when no local LM Studio model has been selected. */
const LMSTUDIO_DEFAULT_MODEL_ID = "qwen/qwen3.5-9b";
/** Stable provider id used in OpenClaw config and provider catalogs. */
const LMSTUDIO_PROVIDER_ID = "lmstudio";
/** Resolve whether an LM Studio wire entry advertises reasoning support. */
const resolveLmstudioReasoningCapability = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioReasoningCapability",
);
/** Resolve context-window metadata from currently loaded LM Studio instances. */
const resolveLoadedContextWindow = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLoadedContextWindow",
);
/** Normalize a configured LM Studio server base URL. */
const resolveLmstudioServerBase = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioServerBase",
);
/** Normalize the OpenAI-compatible LM Studio inference base URL. */
const resolveLmstudioInferenceBase = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioInferenceBase",
);
/** Normalize an LM Studio provider config before runtime use. */
const normalizeLmstudioProviderConfig = createLazyFacadeValue(
  loadFacadeModule,
  "normalizeLmstudioProviderConfig",
);
/** Fetch raw LM Studio model entries with SSRF and timeout handling owned by the facade. */
const fetchLmstudioModels = createLazyFacadeValue(loadFacadeModule, "fetchLmstudioModels");
/** Map one raw LM Studio model entry into OpenClaw model metadata. */
const mapLmstudioWireEntry = createLazyFacadeValue(loadFacadeModule, "mapLmstudioWireEntry");
/** Discover OpenClaw model definitions from an LM Studio server. */
const discoverLmstudioModels = createLazyFacadeValue(loadFacadeModule, "discoverLmstudioModels");
/** Ensure a specific LM Studio model is loaded before use. */
const ensureLmstudioModelLoaded = createLazyFacadeValue(
  loadFacadeModule,
  "ensureLmstudioModelLoaded",
);
/** Build request headers for LM Studio calls from optional API key and caller headers. */
const buildLmstudioAuthHeaders = createLazyFacadeValue(
  loadFacadeModule,
  "buildLmstudioAuthHeaders",
);
/** Resolve the configured LM Studio API key from config, env, or profile path. */
const resolveLmstudioConfiguredApiKey = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioConfiguredApiKey",
);
/** Resolve provider headers for LM Studio catalog and runtime requests. */
const resolveLmstudioProviderHeaders = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioProviderHeaders",
);
/** Resolve the combined API key and headers used for LM Studio requests. */
const resolveLmstudioRequestContext = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioRequestContext",
);
/** Resolve the runtime API key for an agent-scoped LM Studio request. */
const resolveLmstudioRuntimeApiKey = createLazyFacadeValue(
  loadFacadeModule,
  "resolveLmstudioRuntimeApiKey",
);
//#endregion
export {
  resolveLmstudioServerBase as C,
  resolveLmstudioRuntimeApiKey as S,
  resolveLmstudioConfiguredApiKey as _,
  LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH as a,
  resolveLmstudioReasoningCapability as b,
  LMSTUDIO_MODEL_PLACEHOLDER as c,
  buildLmstudioAuthHeaders as d,
  discoverLmstudioModels as f,
  normalizeLmstudioProviderConfig as g,
  mapLmstudioWireEntry as h,
  LMSTUDIO_DEFAULT_INFERENCE_BASE_URL as i,
  LMSTUDIO_PROVIDER_ID as l,
  fetchLmstudioModels as m,
  LMSTUDIO_DEFAULT_BASE_URL as n,
  LMSTUDIO_DEFAULT_MODEL_ID as o,
  ensureLmstudioModelLoaded as p,
  LMSTUDIO_DEFAULT_EMBEDDING_MODEL as r,
  LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER as s,
  LMSTUDIO_DEFAULT_API_KEY_ENV_VAR as t,
  LMSTUDIO_PROVIDER_LABEL as u,
  resolveLmstudioInferenceBase as v,
  resolveLoadedContextWindow as w,
  resolveLmstudioRequestContext as x,
  resolveLmstudioProviderHeaders as y,
};
