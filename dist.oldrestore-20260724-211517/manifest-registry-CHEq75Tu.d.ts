import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";
import { t as PluginManifestCommandAlias } from "./manifest-command-aliases-DOsqsy-q.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { t as ChannelConfigRuntimeSchema } from "./types.config-D1pSqbn8.js";

//#region src/plugins/manifest-types.d.ts
/** UI hint metadata for plugin config schema fields. */
type PluginConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
};
/** Top-level plugin manifest format. */
type PluginFormat = "openclaw" | "bundle";
/** Supported external bundle manifest formats. */
type PluginBundleFormat = "codex" | "claude" | "cursor";
/**
 * Closed classification codes for plugin diagnostics. Health surfaces branch
 * on these instead of matching freeform diagnostic message text.
 */
type PluginDiagnosticCode = "channel-setup-failure";
/** Diagnostic emitted while discovering or validating plugins. */
type PluginDiagnostic = {
  level: "warn" | "error";
  message: string;
  pluginId?: string;
  source?: string;
  code?: PluginDiagnosticCode;
};
//#endregion
//#region packages/model-catalog-core/src/model-catalog-types.d.ts
/** Supported API protocols for model catalog entries. */
declare const MODEL_CATALOG_APIS: readonly [
  "openai-completions",
  "openai-responses",
  "openai-chatgpt-responses",
  "anthropic-messages",
  "google-generative-ai",
  "google-vertex",
  "github-copilot",
  "bedrock-converse-stream",
  "ollama",
  "azure-openai-responses",
];
/** API protocol for a model catalog entry. */
type ModelCatalogApi = (typeof MODEL_CATALOG_APIS)[number];
/** Supported model thinking/reasoning wire formats. */
declare const MODEL_CATALOG_THINKING_FORMATS: readonly [
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "qwen",
  "qwen-chat-template",
  "zai",
];
/** Thinking/reasoning wire format for model compatibility. */
type ModelCatalogThinkingFormat = (typeof MODEL_CATALOG_THINKING_FORMATS)[number];
/** Compatibility flags and provider-specific routing metadata for one model. */
type ModelCatalogCompatConfig = {
  supportsStore?: boolean;
  supportsDeveloperRole?: boolean;
  supportsReasoningEffort?: boolean /** Whether the model accepts the temperature parameter (GPT-5.6 family rejects it). */;
  supportsTemperature?: boolean;
  supportsUsageInStreaming?: boolean;
  supportsStrictMode?: boolean;
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  requiresToolResultName?: boolean;
  requiresAssistantAfterToolResult?: boolean;
  requiresThinkingAsText?: boolean;
  requiresReasoningContentOnAssistantMessages?: boolean;
  openRouterRouting?: ModelCatalogOpenRouterRouting;
  vercelGatewayRouting?: ModelCatalogVercelGatewayRouting;
  zaiToolStream?: boolean;
  cacheControlFormat?: "anthropic";
  sendSessionAffinityHeaders?: boolean;
  sendSessionIdHeader?: boolean;
  supportsEagerToolInputStreaming?: boolean;
  supportsLongCacheRetention?: boolean;
  supportsPromptCacheKey?: boolean;
  supportsTools?: boolean;
  requiresStringContent?: boolean;
  strictMessageKeys?: boolean;
  toolSchemaProfile?: string;
  unsupportedToolSchemaKeywords?: string[];
  nativeWebSearchTool?: boolean;
  toolCallArgumentsEncoding?: string;
  requiresMistralToolIds?: boolean;
  requiresOpenAiAnthropicToolPayload?: boolean;
  thinkingFormat?: ModelCatalogThinkingFormat;
  supportedReasoningEfforts?: string[];
  reasoningEffortMap?: Record<string, string>;
  visibleReasoningDetailTypes?: string[];
};
/** OpenRouter routing preferences copied into request metadata. */
type ModelCatalogOpenRouterRouting = {
  allow_fallbacks?: boolean;
  require_parameters?: boolean;
  data_collection?: "deny" | "allow";
  zdr?: boolean;
  enforce_distillable_text?: boolean;
  order?: string[];
  only?: string[];
  ignore?: string[];
  quantizations?: string[];
  sort?:
    | string
    | {
        by?: string;
        partition?: string | null;
      };
  max_price?: {
    prompt?: number | string;
    completion?: number | string;
    image?: number | string;
    audio?: number | string;
    request?: number | string;
  };
  preferred_min_throughput?:
    | number
    | {
        p50?: number;
        p75?: number;
        p90?: number;
        p99?: number;
      };
  preferred_max_latency?:
    | number
    | {
        p50?: number;
        p75?: number;
        p90?: number;
        p99?: number;
      };
};
/** Vercel AI Gateway routing preferences. */
type ModelCatalogVercelGatewayRouting = {
  only?: string[];
  order?: string[];
};
/** Image input limits for a model. */
type ModelCatalogImageInputConfig = {
  maxBytes?: number;
  maxPixels?: number;
  maxSidePx?: number;
  preferredSidePx?: number;
  tokenMode?: "tile" | "detail" | "provider";
};
/** Media input limits for a model. */
type ModelCatalogMediaInputConfig = {
  image?: ModelCatalogImageInputConfig;
};
/** Supported input modality for a model. */
type ModelCatalogInput = "text" | "image" | "document";
/** Model-level thinking settings carried by provider catalog metadata. */
declare const MODEL_CATALOG_THINKING_LEVELS: readonly [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
];
type ModelCatalogThinkingLevel = (typeof MODEL_CATALOG_THINKING_LEVELS)[number];
type ModelCatalogThinkingLevelMap = Partial<Record<ModelCatalogThinkingLevel, string | null>>;
/** Discovery lifecycle for a provider catalog. */
type ModelCatalogDiscovery = "static" | "refreshable" | "runtime";
/** Availability state for a model. */
type ModelCatalogStatus = "available" | "preview" | "deprecated" | "disabled";
/** Unified catalog kind across text and generated media models. */
type UnifiedModelCatalogKind =
  | "text"
  | "voice"
  | "image_generation"
  | "video_generation"
  | "music_generation";
/** Source for unified model catalog entries. */
type UnifiedModelCatalogSource =
  | "manifest"
  | "provider-index"
  | "static"
  | "live"
  | "cache"
  | "configured"
  | "runtime-refresh";
/** Unified model catalog entry for provider/model pickers. */
type UnifiedModelCatalogEntry<TCapabilities = unknown> = {
  kind: UnifiedModelCatalogKind;
  provider: string;
  model: string;
  label?: string;
  source: UnifiedModelCatalogSource;
  default?: boolean;
  configured?: boolean;
  capabilities?: TCapabilities;
  modes?: readonly string[];
  authEnvVars?: readonly string[];
  docsPath?: string;
  fetchedAt?: number;
  expiresAt?: number;
  warnings?: readonly string[];
};
/** Tiered token cost row. */
type ModelCatalogTieredCost = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  range: [number, number] | [number];
};
/** Token cost metadata for one model. */
type ModelCatalogCost = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  tieredPricing?: ModelCatalogTieredCost[];
};
/** Provider manifest model entry. */
type ModelCatalogModel = {
  id: string;
  name?: string;
  api?: ModelCatalogApi;
  baseUrl?: string;
  headers?: Record<string, string>;
  input?: ModelCatalogInput[];
  reasoning?: boolean;
  contextWindow?: number;
  contextTokens?: number;
  maxTokens?: number;
  thinkingLevelMap?: ModelCatalogThinkingLevelMap;
  cost?: ModelCatalogCost;
  compat?: ModelCatalogCompatConfig;
  mediaInput?: ModelCatalogMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
  tags?: string[];
};
/** Provider manifest catalog entry. */
type ModelCatalogProvider = {
  baseUrl?: string;
  api?: ModelCatalogApi;
  headers?: Record<
    string,
    string
  > /** Provider-recommended small model id for short internal utility tasks. */;
  defaultUtilityModel?: string;
  models: ModelCatalogModel[];
};
/** Provider alias entry. */
type ModelCatalogAlias = {
  provider: string;
  api?: ModelCatalogApi;
  baseUrl?: string;
};
/** Suppression rule for hiding a provider/model under matching config. */
type ModelCatalogSuppression = {
  provider: string;
  model: string;
  reason?: string;
  when?: {
    baseUrlHosts?: string[];
    providerConfigApiIn?: string[];
  };
};
/** Raw model catalog manifest shape. */
type ModelCatalog = {
  providers?: Record<string, ModelCatalogProvider>;
  aliases?: Record<string, ModelCatalogAlias>;
  suppressions?: ModelCatalogSuppression[];
  discovery?: Record<string, ModelCatalogDiscovery>;
  runtimeAugment?: boolean;
};
//#endregion
//#region src/compat/legacy-names.d.ts
declare const MANIFEST_KEY: "openclaw";
//#endregion
//#region src/plugins/plugin-kind.types.d.ts
/** Plugin kind labels for non-provider plugin capability groups. */
type PluginKind = "memory" | "context-engine";
//#endregion
//#region src/plugins/manifest.d.ts
type PluginManifestChannelConfig = {
  schema: JsonSchemaObject;
  uiHints?: Record<string, PluginConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
  label?: string;
  description?: string;
  preferOver?: string[];
  commands?: PluginManifestChannelCommandDefaults;
};
type PluginManifestChannelCommandDefaults = {
  nativeCommandsAutoEnabled?: boolean;
  nativeSkillsAutoEnabled?: boolean;
};
type PluginManifestModelSupport = {
  /**
   * Cheap manifest-owned model-id prefixes for transparent provider activation
   * from shorthand model refs such as `gpt-5.4` or `claude-sonnet-4.6`.
   */
  modelPrefixes?: string[];
  /**
   * Regex sources matched against the raw model id after profile suffixes are
   * stripped. Use this when simple prefixes are not expressive enough.
   */
  modelPatterns?: string[];
};
type PluginManifestModelCatalog = ModelCatalog;
type PluginManifestModelPricingModelIdTransform = "version-dots";
type PluginManifestModelPricingSource = {
  provider?: string;
  passthroughProviderModel?: boolean;
  modelIdTransforms?: PluginManifestModelPricingModelIdTransform[];
};
type PluginManifestModelPricingProvider = {
  external?: boolean;
  openRouter?: PluginManifestModelPricingSource | false;
  liteLLM?: PluginManifestModelPricingSource | false;
};
type PluginManifestModelPricing = {
  providers?: Record<string, PluginManifestModelPricingProvider>;
};
type PluginManifestModelIdPrefixRule = {
  modelPrefix: string;
  prefix: string;
};
type PluginManifestModelIdNormalizationProvider = {
  aliases?: Record<string, string>;
  stripPrefixes?: string[];
  prefixWhenBare?: string;
  prefixWhenBareAfterAliasStartsWith?: PluginManifestModelIdPrefixRule[];
};
type PluginManifestModelIdNormalization = {
  providers?: Record<string, PluginManifestModelIdNormalizationProvider>;
};
type PluginManifestProviderEndpoint = {
  /**
   * Core endpoint class this plugin-owned endpoint should map to. Core must
   * already know the class; manifests own host/baseUrl matching metadata.
   */
  endpointClass: string /** Hostnames that should resolve to this endpoint class. */;
  hosts?: string[] /** Host suffixes that should resolve to this endpoint class. */;
  hostSuffixes?: string[] /** Exact normalized base URLs that should resolve to this endpoint class. */;
  baseUrls?: string[] /** Static Google Vertex region metadata for exact global hosts. */;
  googleVertexRegion?: string /** Host suffix whose prefix should be exposed as the Google Vertex region. */;
  googleVertexRegionHostSuffix?: string;
};
type PluginManifestProviderRequestProvider = {
  family?: string;
  compatibilityFamily?: "moonshot";
  openAICompletions?: {
    supportsStreamingUsage?: boolean;
  };
};
type PluginManifestProviderRequest = {
  providers?: Record<string, PluginManifestProviderRequestProvider>;
};
type PluginManifestSecretProviderIntegration = {
  providerAlias?: string;
  displayName?: string;
  description?: string;
  source: "exec";
  command: "${node}";
  args?: string[];
  timeoutMs?: number;
  noOutputTimeoutMs?: number;
  maxOutputBytes?: number;
  jsonOnly?: boolean;
  env?: Record<string, string>;
  passEnv?: string[];
  allowInsecurePath?: boolean;
};
type PluginManifestActivationCapability = "provider" | "channel" | "tool" | "hook";
type PluginManifestActivation = {
  /**
   * Explicit Gateway startup activation. Set true when the plugin must be
   * imported during Gateway startup; set false when narrower activation
   * triggers should load it on demand.
   */
  onStartup?: boolean;
  /**
   * Provider ids that should include this plugin in activation/load plans.
   * This is planner metadata only; runtime behavior still comes from register().
   */
  onProviders?: string[] /** Agent harness runtime ids that should include this plugin in activation/load plans. */;
  onAgentHarnesses?: string[] /** Command ids that should include this plugin in activation/load plans. */;
  onCommands?: string[] /** Channel ids that should include this plugin in activation/load plans. */;
  onChannels?: string[] /** Route kinds that should include this plugin in activation/load plans. */;
  onRoutes?: string[] /** Root-relative config paths that should include this plugin in startup/load plans. */;
  onConfigPaths?: string[] /** Broad capability hints for activation/load plans. Prefer narrower ownership metadata. */;
  onCapabilities?: PluginManifestActivationCapability[];
};
type PluginManifestDefaultPlatform = NodeJS.Platform;
type PluginManifestSetupProvider = {
  /** Provider id surfaced during setup/onboarding. */ id: string /** Setup/auth methods that this provider supports. */;
  authMethods?: string[] /** Environment variables that can satisfy setup without runtime loading. */;
  envVars?: string[];
  /**
   * Cheap local evidence that a provider can authenticate without loading
   * runtime code. Evidence checks must not read secrets, shell out, or call
   * provider APIs.
   */
  authEvidence?: PluginManifestSetupProviderAuthEvidence[];
};
type PluginManifestSetupProviderAuthEvidence = {
  /** Generic local file evidence gated by required environment metadata. */ type: "local-file-with-env" /** Optional env var containing an explicit credential file path. */;
  fileEnvVar?: string /** Optional fallback credential file paths. Supports `${HOME}` and `${APPDATA}`. */;
  fallbackPaths?: string[] /** At least one of these env vars must be non-empty when provided. */;
  requiresAnyEnv?: string[] /** Every env var listed here must be non-empty when provided. */;
  requiresAllEnv?: string[] /** Non-secret marker returned when this evidence is present. */;
  credentialMarker: string /** Human-readable auth source label. */;
  source?: string;
};
type PluginManifestSetup = {
  /** Cheap provider setup metadata exposed before runtime loads. */ providers?: PluginManifestSetupProvider[] /** Setup-time backend ids available without full runtime activation. */;
  cliBackends?: string[] /** Config migration ids owned by this plugin's setup surface. */;
  configMigrations?: string[];
  /**
   * Whether setup still needs plugin runtime execution after descriptor lookup.
   * Defaults to false when omitted.
   */
  requiresRuntime?: boolean;
};
type PluginManifestQaRunner = {
  /** Subcommand mounted beneath `openclaw qa`, for example `matrix`. */ commandName: string /** Optional user-facing help text for fallback host stubs. */;
  description?: string;
};
type PluginManifestConfigLiteral = string | number | boolean | null;
type PluginManifestDangerousConfigFlag = {
  /**
   * Dot-separated config path relative to `plugins.entries.<id>.config`.
   * Supports `*` wildcards for map/array segments.
   */
  path: string /** Exact literal that marks this config value as dangerous. */;
  equals: PluginManifestConfigLiteral;
};
type PluginManifestSecretInputPath = {
  /**
   * Dot-separated config path relative to `plugins.entries.<id>.config`.
   * Supports `*` wildcards for map/array segments.
   */
  path: string /** Expected resolved type for SecretRef materialization. */;
  expected?: "string";
};
type PluginManifestSecretInputContracts = {
  /**
   * Override bundled-plugin default enablement when deciding whether this
   * SecretRef surface is active. Use this when the plugin is bundled but the
   * surface should stay inactive until explicitly enabled in config.
   */
  bundledDefaultEnabled?: boolean;
  paths: PluginManifestSecretInputPath[];
};
type PluginManifestConfigContracts = {
  /**
   * Root-relative config paths that indicate this plugin's setup-time
   * compatibility migrations might apply. Use this to keep generic runtime
   * config reads from loading every plugin setup surface when the config does
   * not reference the plugin at all.
   */
  compatibilityMigrationPaths?: string[];
  /**
   * Root-relative compatibility paths that this plugin can service during
   * runtime before plugin code fully activates. Use this for legacy surfaces
   * that should cheaply narrow bundled candidate sets without importing every
   * compatible plugin runtime.
   */
  compatibilityRuntimePaths?: string[];
  dangerousFlags?: PluginManifestDangerousConfigFlag[];
  secretInputs?: PluginManifestSecretInputContracts;
};
type PluginManifestCatalog = {
  featured?: boolean;
  order?: number;
};
type PluginManifest = {
  id: string;
  configSchema: JsonSchemaObject /** Plugin ids that must also be installed for this plugin to have effect. */;
  requiresPlugins?: string[];
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: PluginManifestDefaultPlatform[] /** Legacy plugin ids that should normalize to this plugin id. */;
  legacyPluginIds?: string[] /** Provider ids that should auto-enable this plugin when referenced in auth/config/models. */;
  autoEnableWhenConfiguredProviders?: string[];
  kind?: PluginKind | PluginKind[];
  channels?: string[];
  providers?: string[];
  /**
   * Optional lightweight module that exports provider plugin metadata for
   * auth/catalog discovery. It should not import the full plugin runtime.
   */
  providerCatalogEntry?: string;
  /**
   * Cheap model-family ownership metadata used before plugin runtime loads.
   * Use this for shorthand model refs that omit an explicit provider prefix.
   */
  modelSupport?: PluginManifestModelSupport;
  /**
   * Declarative model catalog metadata used by future read-only listing,
   * onboarding, and model picker surfaces before provider runtime loads.
   */
  modelCatalog?: PluginManifestModelCatalog /** Manifest-owned external pricing lookup policy for provider refs. */;
  modelPricing?: PluginManifestModelPricing /** Manifest-owned model-id normalization used before provider runtime loads. */;
  modelIdNormalization?: PluginManifestModelIdNormalization /** Cheap provider endpoint metadata used before provider runtime loads. */;
  providerEndpoints?: PluginManifestProviderEndpoint[] /** Cheap provider request metadata used before provider runtime loads. */;
  providerRequest?: PluginManifestProviderRequest /** Declarative SecretRef provider presets owned by this plugin. */;
  secretProviderIntegrations?: Record<
    string,
    PluginManifestSecretProviderIntegration
  > /** Cheap startup activation lookup for plugin-owned CLI inference backends. */;
  cliBackends?: string[];
  /**
   * Provider or CLI backend refs whose plugin-owned synthetic auth hook should
   * be probed during cold model discovery before the runtime registry exists.
   */
  syntheticAuthRefs?: string[];
  /**
   * Bundled-plugin-owned placeholder API key values that represent non-secret
   * local, OAuth, or ambient credential state.
   */
  nonSecretAuthMarkers?: string[];
  /**
   * Plugin-owned command aliases that should resolve to this plugin during
   * config diagnostics before runtime loads.
   */
  commandAliases?: PluginManifestCommandAlias[];
  /**
   * Cheap provider-auth env lookup without booting plugin runtime.
   *
   * @deprecated Prefer setup.providers[].envVars for generic setup/status env
   * metadata. This field remains supported through the provider env-var
   * compatibility adapter during the deprecation window.
   */
  providerAuthEnvVars?: Record<
    string,
    string[]
  > /** Usage/billing credentials excluded from inference auth but included in secret scrubbing. */;
  providerUsageAuthEnvVars?: Record<
    string,
    string[]
  > /** Provider ids that should reuse another provider id for auth lookup. */;
  providerAuthAliases?: Record<
    string,
    string
  > /** Cheap channel env lookup without booting plugin runtime. */;
  channelEnvVars?: Record<string, string[]>;
  /**
   * Cheap onboarding/auth-choice metadata used by config validation, CLI help,
   * and non-runtime auth-choice routing before provider runtime loads.
   */
  providerAuthChoices?: PluginManifestProviderAuthChoice[] /** Cheap activation planner metadata exposed before plugin runtime loads. */;
  activation?: PluginManifestActivation /** Cheap setup/onboarding metadata exposed before plugin runtime loads. */;
  setup?: PluginManifestSetup /** Cheap QA runner metadata exposed before plugin runtime loads. */;
  qaRunners?: PluginManifestQaRunner[];
  skills?: string[];
  name?: string;
  description?: string /** Optional presentation hints for plugin catalog surfaces. */;
  catalog?: PluginManifestCatalog /** Optional HTTPS URL for marketplace/catalog card artwork. */;
  icon?: string;
  version?: string;
  uiHints?: Record<string, PluginConfigUiHint>;
  /**
   * Static capability ownership snapshot used for manifest-driven discovery,
   * compat wiring, and contract coverage without importing plugin runtime.
   */
  contracts?: PluginManifestContracts /** Cheap media-understanding provider defaults without importing plugin runtime. */;
  mediaUnderstandingProviderMetadata?: Record<
    string,
    PluginManifestMediaUnderstandingProviderMetadata
  > /** Cheap image-generation provider auth metadata without importing plugin runtime. */;
  imageGenerationProviderMetadata?: Record<
    string,
    PluginManifestCapabilityProviderMetadata
  > /** Cheap video-generation provider auth metadata without importing plugin runtime. */;
  videoGenerationProviderMetadata?: Record<
    string,
    PluginManifestCapabilityProviderMetadata
  > /** Cheap music-generation provider auth metadata without importing plugin runtime. */;
  musicGenerationProviderMetadata?: Record<
    string,
    PluginManifestCapabilityProviderMetadata
  > /** Cheap plugin-tool availability metadata without importing plugin runtime. */;
  toolMetadata?: Record<
    string,
    PluginManifestToolMetadata
  > /** Manifest-owned config behavior consumed by generic core helpers. */;
  configContracts?: PluginManifestConfigContracts;
  channelConfigs?: Record<string, PluginManifestChannelConfig>;
};
type PluginManifestContracts = {
  embeddedExtensionFactories?: string[];
  agentToolResultMiddleware?: string[];
  trustedToolPolicies?: string[];
  /**
   * Provider ids whose external auth profile hook can contribute runtime-only
   * credentials. Declaring this lets auth-store overlays load only the owning
   * plugin instead of every provider plugin.
   */
  externalAuthProviders?: string[];
  embeddingProviders?: string[];
  memoryEmbeddingProviders?: string[];
  speechProviders?: string[];
  realtimeTranscriptionProviders?: string[];
  realtimeVoiceProviders?: string[];
  mediaUnderstandingProviders?: string[];
  transcriptSourceProviders?: string[];
  documentExtractors?: string[];
  imageGenerationProviders?: string[];
  videoGenerationProviders?: string[];
  musicGenerationProviders?: string[];
  webContentExtractors?: string[];
  webFetchProviders?: string[];
  webSearchProviders?: string[];
  workerProviders?: string[] /** Provider ids whose plugin owns usage auth and snapshot hooks. */;
  usageProviders?: string[];
  migrationProviders?: string[];
  gatewayMethodDispatch?: string[];
  tools?: string[];
};
type PluginManifestMediaUnderstandingCapability = "image" | "audio" | "video";
type PluginManifestMediaUnderstandingProviderMetadata = {
  capabilities?: PluginManifestMediaUnderstandingCapability[];
  defaultModels?: Partial<Record<PluginManifestMediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<PluginManifestMediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<
    Record<
      "pdf",
      {
        textExtraction?: string;
        image?: string | false;
      }
    >
  >;
};
type PluginManifestProviderBaseUrlGuard = {
  provider: string;
  defaultBaseUrl?: string;
  allowedBaseUrls: string[];
};
type PluginManifestCapabilityProviderAuthSignal = {
  provider: string;
  providerBaseUrl?: PluginManifestProviderBaseUrlGuard;
};
type PluginManifestCapabilityProviderModeConfigSignal = {
  path?: string;
  default?: string;
  allowed?: string[];
  disallowed?: string[];
};
type PluginManifestCapabilityProviderConfigSignal = {
  rootPath: string;
  overlayPath?: string;
  overlayMapPath?: string;
  required?: string[];
  requiredAny?: string[];
  mode?: PluginManifestCapabilityProviderModeConfigSignal;
};
type PluginManifestCapabilityProviderMetadata = {
  aliases?: string[];
  authProviders?: string[];
  authSignals?: PluginManifestCapabilityProviderAuthSignal[];
  configSignals?: PluginManifestCapabilityProviderConfigSignal[];
  referenceAudioInputs?: boolean;
};
type PluginManifestToolMetadata = PluginManifestCapabilityProviderMetadata & {
  optional?: boolean /** Tool execution is safe to repeat after an incomplete model turn. */;
  replaySafe?: boolean;
};
type PluginManifestProviderAuthChoice = {
  /** Provider id owned by this manifest entry. */ provider: string /** Provider auth method id that this choice should dispatch to. */;
  method: string /** Stable auth-choice id used by onboarding and other CLI auth flows. */;
  choiceId: string /** Optional user-facing choice label/hint for grouped onboarding UI. */;
  choiceLabel?: string;
  choiceHint?: string /** Lower values sort earlier in interactive assistant pickers. */;
  assistantPriority?: number /** Keep the choice out of interactive assistant pickers while preserving manual CLI support. */;
  assistantVisibility?:
    | "visible"
    | "manual-only" /** Legacy choice ids that should point users at this replacement choice. */;
  deprecatedChoiceIds?: string[] /** Optional grouping metadata for auth-choice pickers. */;
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  /**
   * Surface this group in the featured tier of the interactive onboarding
   * picker. Featured groups appear before the "More…" entry.
   */
  onboardingFeatured?: boolean /** Optional CLI flag metadata for one-flag auth flows such as API keys. */;
  optionKey?: string;
  cliFlag?: string;
  cliOption?: string;
  cliDescription?: string /** One pasted secret plus provider defaults is sufficient for app-guided setup. */;
  appGuidedSecret?: boolean /** Provider-owned interactive login that native setup clients can render generically. */;
  appGuidedAuth?: "oauth" | "device-code";
  /**
   * Interactive onboarding surfaces where this auth choice should appear.
   * Defaults to `["text-inference"]` when omitted.
   */
  onboardingScopes?: PluginManifestOnboardingScope[];
};
type PluginManifestOnboardingScope = "text-inference" | "image-generation" | "music-generation";
type PluginPackageChannel = {
  id?: string;
  label?: string;
  selectionLabel?: string;
  detailLabel?: string;
  docsPath?: string;
  docsLabel?: string;
  blurb?: string;
  order?: number;
  aliases?: readonly string[];
  preferOver?: readonly string[];
  systemImage?: string;
  selectionDocsPrefix?: string;
  selectionDocsOmitLabel?: boolean;
  selectionExtras?: readonly string[];
  markdownCapable?: boolean;
  exposure?: {
    configured?: boolean;
    setup?: boolean;
    docs?: boolean;
  };
  showConfigured?: boolean;
  showInSetup?: boolean;
  quickstartAllowFrom?: boolean;
  forceAccountBinding?: boolean;
  preferSessionLookupForAnnounceTarget?: boolean;
  commands?: PluginManifestChannelCommandDefaults;
  configuredState?: {
    specifier?: string;
    exportName?: string;
    env?: {
      allOf?: readonly string[];
      anyOf?: readonly string[];
    };
  };
  persistedAuthState?: {
    specifier?: string;
    exportName?: string;
  };
  doctorCapabilities?: PluginPackageChannelDoctorCapabilities;
  cliAddOptions?: readonly PluginPackageChannelCliOption[];
};
type PluginPackageChannelDoctorCapabilities = {
  dmAllowFromMode?: "topOnly" | "topOrNested" | "nestedOnly";
  groupModel?: "sender" | "route" | "hybrid";
  groupAllowFromFallbackToAllowFrom?: boolean;
  warnOnEmptyGroupSenderAllowlist?: boolean;
};
type PluginPackageChannelCliOption = {
  flags: string;
  description: string;
  defaultValue?: boolean | string;
};
type PluginPackageInstall = {
  clawhubSpec?: string;
  npmSpec?: string;
  localPath?: string;
  defaultChoice?: "clawhub" | "npm" | "local";
  minHostVersion?: string;
  expectedIntegrity?: string;
  allowInvalidConfigRecovery?: boolean;
  requiredPlatformPackages?: string[];
};
type OpenClawPackageStartup = {
  /**
   * Opt-in for channel plugins whose `setupEntry` fully covers the gateway
   * startup surface needed before the server starts listening.
   */
  deferConfiguredChannelFullLoadUntilAfterListen?: boolean;
};
type OpenClawPackageSetupFeatures = {
  configPromotion?: boolean;
  legacyStateMigrations?: boolean;
  legacySessionSurfaces?: boolean;
};
type OpenClawPackageCompat = {
  pluginApi?: string;
};
type OpenClawPackageBuild = {
  bundledDist?: boolean;
};
type OpenClawPackageManifest = {
  extensions?: string[];
  runtimeExtensions?: string[];
  setupEntry?: string;
  runtimeSetupEntry?: string;
  setupFeatures?: OpenClawPackageSetupFeatures;
  plugin?: {
    id?: string;
    label?: string;
  };
  channel?: PluginPackageChannel;
  compat?: OpenClawPackageCompat;
  install?: PluginPackageInstall;
  startup?: OpenClawPackageStartup;
  build?: OpenClawPackageBuild;
};
type ManifestKey = typeof MANIFEST_KEY;
type PackageManifest = {
  name?: string;
  version?: string;
  description?: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
} & Partial<Record<ManifestKey, OpenClawPackageManifest>>;
//#endregion
//#region src/plugins/status-dependencies-core.d.ts
/** Dependency name-to-version map from a plugin package manifest. */
type PluginDependencySpecMap = Record<string, string>;
/** Installation status for one plugin dependency. */
type PluginDependencyEntry = {
  name: string;
  spec: string;
  installed: boolean;
  optional: boolean;
  resolvedPath?: string;
};
/** Aggregate installation status for required and optional plugin dependencies. */
type PluginDependencyStatus = {
  hasDependencies: boolean;
  installed: boolean;
  requiredInstalled: boolean;
  optionalInstalled: boolean;
  missing: string[];
  missingOptional: string[];
  dependencies: PluginDependencyEntry[];
  optionalDependencies: PluginDependencyEntry[];
};
//#endregion
//#region src/plugins/discovery.d.ts
/** One potential plugin root discovered before manifest validation and registry normalization. */
type PluginCandidate = {
  idHint: string;
  source: string;
  setupSource?: string;
  rootDir: string;
  origin: PluginOrigin;
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  workspaceDir?: string;
  packageName?: string;
  packageVersion?: string;
  packageDescription?: string;
  packageDir?: string;
  packageManifest?: OpenClawPackageManifest;
  packageDependencies?: PluginDependencySpecMap;
  packageOptionalDependencies?: PluginDependencySpecMap;
  bundledManifestId?: string;
  bundledManifest?: PluginManifest;
  bundledManifestPath?: string;
  requiredPluginIds?: string[];
  requiredPluginSource?: string;
  rawPackageManifest?: PackageManifest;
};
/** Discovery candidates plus warnings/errors emitted while scanning roots. */
type PluginDiscoveryResult = {
  candidates: PluginCandidate[];
  diagnostics: PluginDiagnostic[];
};
//#endregion
//#region src/plugins/manifest-registry.d.ts
type PluginManifestRecord = {
  id: string;
  name?: string;
  description?: string;
  catalog?: PluginManifestCatalog;
  icon?: string;
  version?: string;
  packageName?: string;
  packageVersion?: string;
  packageDescription?: string;
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: string[];
  autoEnableWhenConfiguredProviders?: string[];
  legacyPluginIds?: string[];
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  bundleCapabilities?: string[];
  kind?: PluginKind | PluginKind[];
  channels: string[];
  providers: string[];
  providerDiscoverySource?: string;
  modelSupport?: PluginManifestModelSupport;
  modelCatalog?: PluginManifestModelCatalog;
  modelPricing?: PluginManifestModelPricing;
  modelIdNormalization?: PluginManifestModelIdNormalization;
  providerEndpoints?: PluginManifestProviderEndpoint[];
  providerRequest?: PluginManifestProviderRequest;
  secretProviderIntegrations?: Record<string, PluginManifestSecretProviderIntegration>;
  cliBackends: string[];
  syntheticAuthRefs?: string[];
  nonSecretAuthMarkers?: string[];
  commandAliases?: PluginManifestCommandAlias[];
  providerAuthEnvVars?: Record<string, string[]>;
  providerUsageAuthEnvVars?: Record<string, string[]>;
  providerAuthAliases?: Record<string, string>;
  channelEnvVars?: Record<string, string[]>;
  providerAuthChoices?: PluginManifest["providerAuthChoices"];
  activation?: PluginManifestActivation;
  setup?: PluginManifestSetup;
  packageManifest?: OpenClawPackageManifest;
  packageDependencies?: PluginDependencySpecMap;
  packageOptionalDependencies?: PluginDependencySpecMap;
  packageChannel?: PluginPackageChannel;
  packageInstall?: PluginPackageInstall;
  trustedOfficialInstall?: boolean;
  qaRunners?: PluginManifestQaRunner[];
  skills: string[];
  settingsFiles?: string[];
  hooks: string[];
  origin: PluginOrigin;
  workspaceDir?: string;
  rootDir: string;
  source: string;
  setupSource?: string;
  startupDeferConfiguredChannelFullLoadUntilAfterListen?: boolean;
  manifestPath: string;
  schemaCacheKey?: string;
  configSchema?: Record<string, unknown>;
  configUiHints?: Record<string, PluginConfigUiHint>;
  contracts?: PluginManifestContracts;
  mediaUnderstandingProviderMetadata?: Record<
    string,
    PluginManifestMediaUnderstandingProviderMetadata
  >;
  imageGenerationProviderMetadata?: Record<string, PluginManifestCapabilityProviderMetadata>;
  videoGenerationProviderMetadata?: Record<string, PluginManifestCapabilityProviderMetadata>;
  musicGenerationProviderMetadata?: Record<string, PluginManifestCapabilityProviderMetadata>;
  toolMetadata?: Record<string, PluginManifestToolMetadata>;
  configContracts?: PluginManifestConfigContracts;
  channelConfigs?: Record<string, PluginManifestChannelConfig>;
  channelCatalogMeta?: {
    id: string;
    label?: string;
    blurb?: string;
    preferOver?: readonly string[];
    commands?: PluginManifestChannelCommandDefaults;
  };
};
type PluginManifestRegistry = {
  plugins: PluginManifestRecord[];
  diagnostics: PluginDiagnostic[];
};
//#endregion
export {
  PluginConfigUiHint as _,
  PluginDependencyStatus as a,
  PluginManifestContracts as c,
  PluginPackageInstall as d,
  PluginKind as f,
  PluginBundleFormat as g,
  UnifiedModelCatalogSource as h,
  PluginDiscoveryResult as i,
  PluginManifestSecretProviderIntegration as l,
  UnifiedModelCatalogKind as m,
  PluginManifestRegistry as n,
  OpenClawPackageBuild as o,
  UnifiedModelCatalogEntry as p,
  PluginCandidate as r,
  PluginManifestActivation as s,
  PluginManifestRecord as t,
  PluginPackageChannel as u,
  PluginDiagnostic as v,
  PluginFormat as y,
};
