import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  d as isNonSecretApiKeyMarker,
  u as isKnownEnvApiKeyMarker,
} from "./model-auth-markers-CA2Xy59Z.js";
import { r as normalizeApiKeyConfig } from "./models-config.providers.secrets-Dh4joY6h.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import {
  j as resolveTimerTimeoutMs,
  l as asPositiveSafeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import {
  f as readProviderJsonArrayFieldResponse,
  g as readResponseTextLimited,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import {
  c as SELF_HOSTED_DEFAULT_COST,
  l as SELF_HOSTED_DEFAULT_MAX_TOKENS,
} from "./provider-self-hosted-setup-DgXzrv8Z.js";
import { t as resolveConfiguredSecretInputString } from "./resolve-configured-secret-input-string-BylZzfX0.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./logging-core-QnL1iLWg.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import "./provider-setup-BBNOx0_n.js";
import "./ssrf-runtime-DJ478vv8.js";
import { c as hasConfiguredSecretInput } from "./types.secrets-BV0ywRAy.js";
import "./provider-http-BDIltggC.js";
import "./secret-input-runtime-NBjlSpxK.js";
//#region extensions/lmstudio/src/defaults.ts
/** Shared LM Studio defaults used by setup, runtime discovery, and embeddings paths. */
const LMSTUDIO_DEFAULT_BASE_URL = "http://localhost:1234";
const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL = `${LMSTUDIO_DEFAULT_BASE_URL}/v1`;
const LMSTUDIO_DOCKER_HOST_BASE_URL = "http://host.docker.internal:1234";
const LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL = `${LMSTUDIO_DOCKER_HOST_BASE_URL}/v1`;
const LMSTUDIO_DEFAULT_EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5";
const LMSTUDIO_PROVIDER_LABEL = "LM Studio";
const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR = "LM_API_TOKEN";
const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER = "lmstudio-local";
const LMSTUDIO_MODEL_PLACEHOLDER = "model-key-from-api-v1-models";
const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH = 64e3;
const LMSTUDIO_DEFAULT_MODEL_ID = "qwen/qwen3.5-9b";
const LMSTUDIO_PROVIDER_ID = "lmstudio";
//#endregion
//#region extensions/lmstudio/src/models.ts
const LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS = [
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
];
const LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS = [
  "none",
  ...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS,
];
function normalizeReasoningOption(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}
function isReasoningEnabledOption(value) {
  const normalized = normalizeReasoningOption(value);
  if (!normalized) return false;
  return normalized !== "off";
}
function normalizeReasoningOptions(value) {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(value.flatMap((option) => normalizeReasoningOption(option) ?? []));
}
function isLmstudioBinaryReasoningOptions(allowedOptions) {
  return (
    allowedOptions.some((option) => option === "on") &&
    allowedOptions.every((option) => option === "on" || option === "off")
  );
}
function resolveLmstudioTransportReasoningEfforts(allowedOptions) {
  if (isLmstudioBinaryReasoningOptions(allowedOptions))
    return allowedOptions.includes("off")
      ? [...LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS]
      : [...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS];
  return uniqueStrings(
    allowedOptions
      .map((option) => (option === "off" ? "none" : option))
      .filter((option) => option !== "on"),
  );
}
function resolveLmstudioEnabledTransportReasoningOption(supportedReasoningEfforts) {
  return (
    supportedReasoningEfforts.find((option) => option === "xhigh") ??
    supportedReasoningEfforts.find((option) => option === "high") ??
    supportedReasoningEfforts.find((option) => option !== "none")
  );
}
function buildLmstudioReasoningEffortMap(supportedReasoningEfforts) {
  const disabled = supportedReasoningEfforts.includes("none") ? "none" : void 0;
  const max = resolveLmstudioEnabledTransportReasoningOption(supportedReasoningEfforts);
  const map = {
    ...(disabled
      ? {
          off: disabled,
          none: disabled,
        }
      : {}),
    ...(max
      ? {
          adaptive: max,
          max,
        }
      : {}),
  };
  return Object.keys(map).length > 0 ? map : void 0;
}
function buildLmstudioReasoningCompat(allowedOptions) {
  const supportedReasoningEfforts = resolveLmstudioTransportReasoningEfforts(allowedOptions);
  if (supportedReasoningEfforts.length === 0) return;
  if (!supportedReasoningEfforts.some((option) => option !== "none")) return;
  return {
    supportsReasoningEffort: true,
    supportedReasoningEfforts,
    reasoningEffortMap: buildLmstudioReasoningEffortMap(supportedReasoningEfforts),
  };
}
function normalizeLmstudioTransportReasoningCompat(compat) {
  const supportedReasoningEfforts = compat.supportedReasoningEfforts;
  const map = compat.reasoningEffortMap;
  const hasBinarySupported =
    Array.isArray(supportedReasoningEfforts) &&
    supportedReasoningEfforts.some((option) => option === "on");
  const hasBinaryMapValue =
    map !== void 0 && Object.values(map).some((value) => value === "on" || value === "off");
  if (!hasBinarySupported && !hasBinaryMapValue) return compat;
  const normalizedSupportedReasoningEfforts =
    supportedReasoningEfforts?.includes("off") === true ||
    supportedReasoningEfforts?.includes("none") === true ||
    Object.values(map ?? {}).some((value) => value === "off" || value === "none")
      ? [...LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS]
      : [...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS];
  return {
    ...compat,
    supportedReasoningEfforts: normalizedSupportedReasoningEfforts,
    reasoningEffortMap: buildLmstudioReasoningEffortMap(normalizedSupportedReasoningEfforts),
  };
}
function resolveLmstudioReasoningCompat(entry) {
  const reasoning = entry.capabilities?.reasoning;
  if (reasoning === void 0 || reasoning === null) return;
  const allowedOptions = normalizeReasoningOptions(reasoning.allowed_options);
  if (allowedOptions.length === 0) return;
  return buildLmstudioReasoningCompat(allowedOptions);
}
/**
 * Resolves LM Studio reasoning support from capabilities payloads.
 * Defaults to false when the server omits reasoning metadata.
 */
function resolveLmstudioReasoningCapability(entry) {
  const reasoning = entry.capabilities?.reasoning;
  if (reasoning === void 0 || reasoning === null) return false;
  const allowedOptions = normalizeReasoningOptions(reasoning.allowed_options);
  if (allowedOptions.length > 0)
    return allowedOptions.some((option) => isReasoningEnabledOption(option));
  return isReasoningEnabledOption(reasoning.default);
}
/**
 * Reads loaded LM Studio instances and returns the largest valid context window.
 * Returns null when no usable loaded context is present.
 */
function resolveLoadedContextWindow(entry) {
  const loadedInstances = Array.isArray(entry.loaded_instances) ? entry.loaded_instances : [];
  let contextWindow = null;
  for (const instance of loadedInstances) {
    const normalized = asPositiveSafeInteger(instance?.config?.context_length);
    if (normalized === void 0) continue;
    contextWindow = contextWindow === null ? normalized : Math.max(contextWindow, normalized);
  }
  return contextWindow;
}
function normalizeLmstudioVariantIds(value) {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(
    value.flatMap((variant) =>
      typeof variant === "string" && variant.trim().length > 0 ? variant.trim() : [],
    ),
  );
}
/**
 * Resolves LM Studio variant ids back to their loadable model key.
 *
 * LM Studio exposes quantized variants separately from the canonical `key`, but
 * `/api/v1/models/load` expects the key. Exact key matches still win so unusual
 * servers that expose a suffix as the real key are preserved.
 */
function resolveLmstudioCanonicalModelKey(params) {
  const modelKey = params.modelKey.trim();
  if (!modelKey) return modelKey;
  const normalizedModelKey = modelKey.toLowerCase();
  for (const entry of params.models) if (entry.key?.trim() === modelKey) return modelKey;
  for (const entry of params.models) {
    const key = entry.key?.trim();
    if (!key) continue;
    const selectedVariant =
      typeof entry.selected_variant === "string" ? entry.selected_variant.trim() : "";
    const variants = normalizeLmstudioVariantIds(entry.variants);
    if (
      selectedVariant.toLowerCase() === normalizedModelKey ||
      variants.some((variant) => variant.toLowerCase() === normalizedModelKey)
    )
      return key;
  }
  return modelKey;
}
/**
 * Normalizes a server path by stripping trailing slash and inference suffixes.
 *
 * LM Studio users often copy their inference URL (e.g. "http://localhost:1234/v1") instead
 * of the server root. This function strips a trailing "/v1" or "/api/v1" so the caller always
 * receives a clean root base URL. The expected input is the server root without any API version
 * path (e.g. "http://localhost:1234").
 */
function normalizeUrlPath(pathname) {
  const trimmed = pathname.replace(/\/+$/, "");
  if (!trimmed) return "";
  return trimmed.replace(/\/api\/v1$/i, "").replace(/\/v1$/i, "");
}
function hasExplicitHttpScheme(value) {
  return /^https?:\/\//i.test(value);
}
function isLikelyHostBaseUrl(value) {
  return (
    /^(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|[a-z0-9.-]+\.[a-z]{2,}|[^/\s?#]+:\d+)(?:[/?#].*)?$/i.test(
      value,
    ) && !value.startsWith("/")
  );
}
function normalizeConfiguredReasoningEffortMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const entries = [];
  for (const [key, mapped] of Object.entries(value)) {
    const normalizedKey = key.trim();
    const normalizedValue = typeof mapped === "string" ? mapped.trim() : "";
    if (normalizedKey && normalizedValue) entries.push([normalizedKey, normalizedValue]);
  }
  const normalized = Object.fromEntries(entries);
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeLmstudioConfiguredCompat(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const record = value;
  const supportedReasoningEfforts = normalizeReasoningOptions(record.supportedReasoningEfforts);
  const reasoningEffortMap = normalizeConfiguredReasoningEffortMap(record.reasoningEffortMap);
  const compat = {};
  if (typeof record.supportsUsageInStreaming === "boolean")
    compat.supportsUsageInStreaming = record.supportsUsageInStreaming;
  if (typeof record.supportsReasoningEffort === "boolean")
    compat.supportsReasoningEffort = record.supportsReasoningEffort;
  if (supportedReasoningEfforts.length > 0)
    compat.supportedReasoningEfforts = supportedReasoningEfforts;
  if (reasoningEffortMap) compat.reasoningEffortMap = reasoningEffortMap;
  return Object.keys(compat).length > 0
    ? normalizeLmstudioTransportReasoningCompat(compat)
    : void 0;
}
function toFetchableLmstudioBaseUrl(value) {
  if (hasExplicitHttpScheme(value) || !isLikelyHostBaseUrl(value)) return value;
  return `http://${value}`;
}
/** Resolves LM Studio server base URL (without /v1 or /api/v1). */
function resolveLmstudioServerBase(configuredBaseUrl) {
  const configured = configuredBaseUrl?.trim();
  const resolved = configured && configured.length > 0 ? configured : LMSTUDIO_DEFAULT_BASE_URL;
  const fetchableBaseUrl = toFetchableLmstudioBaseUrl(resolved);
  try {
    const parsed = new URL(fetchableBaseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      throw new TypeError(`Unsupported LM Studio protocol: ${parsed.protocol}`);
    const pathname = normalizeUrlPath(parsed.pathname);
    parsed.pathname = pathname.length > 0 ? pathname : "/";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    const normalized = normalizeUrlPath(resolved.replace(/\/+$/, ""));
    return normalized.length > 0 ? normalized : LMSTUDIO_DEFAULT_BASE_URL;
  }
}
/** Resolves LM Studio inference base URL and always appends /v1. */
function resolveLmstudioInferenceBase(configuredBaseUrl) {
  return `${resolveLmstudioServerBase(configuredBaseUrl)}/v1`;
}
/** Canonicalizes persisted LM Studio provider config to the inference base URL form. */
function normalizeLmstudioProviderConfig(provider) {
  const configuredBaseUrl = typeof provider.baseUrl === "string" ? provider.baseUrl.trim() : "";
  if (!configuredBaseUrl) return provider;
  const normalizedBaseUrl = resolveLmstudioInferenceBase(configuredBaseUrl);
  const request =
    provider.request && typeof provider.request === "object" && !Array.isArray(provider.request)
      ? provider.request
      : void 0;
  const requestWithPrivateNetworkDefault =
    typeof request?.allowPrivateNetwork === "boolean"
      ? request
      : {
          ...request,
          allowPrivateNetwork: true,
        };
  if (
    normalizedBaseUrl === provider.baseUrl &&
    requestWithPrivateNetworkDefault === provider.request
  )
    return provider;
  return {
    ...provider,
    baseUrl: normalizedBaseUrl,
    request: requestWithPrivateNetworkDefault,
  };
}
function normalizeLmstudioConfiguredCatalogEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const record = entry;
  if (typeof record.id !== "string" || record.id.trim().length === 0) return null;
  const id = record.id.trim();
  const name = typeof record.name === "string" && record.name.trim().length > 0 ? record.name : id;
  const contextWindow = asPositiveSafeInteger(record.contextWindow);
  const contextTokens = asPositiveSafeInteger(record.contextTokens);
  const reasoning = typeof record.reasoning === "boolean" ? record.reasoning : void 0;
  const input = Array.isArray(record.input)
    ? record.input.filter((item) => item === "text" || item === "image" || item === "document")
    : void 0;
  const compat = normalizeLmstudioConfiguredCompat(record.compat);
  return {
    id,
    name,
    contextWindow,
    contextTokens,
    reasoning,
    input: input && input.length > 0 ? input : void 0,
    compat,
  };
}
function normalizeLmstudioConfiguredCatalogEntries(models) {
  if (!Array.isArray(models)) return [];
  return models
    .map((entry) => normalizeLmstudioConfiguredCatalogEntry(entry))
    .filter((entry) => entry !== null);
}
function buildLmstudioModelName(model) {
  const tags = [];
  if (model.format === "mlx") tags.push("MLX");
  else if (model.format === "gguf") tags.push("GGUF");
  if (model.vision) tags.push("vision");
  if (model.trainedForToolUse) tags.push("tool-use");
  if (model.loaded) tags.push("loaded");
  if (tags.length === 0) return model.displayName;
  return `${model.displayName} (${tags.join(", ")})`;
}
/**
 * Maps a single LM Studio wire entry to its base model fields.
 * Returns null for non-LLM entries or entries with no usable key.
 *
 * Shared by both the setup layer (persists simple names to config) and the
 * runtime discovery path (which enriches the name with format/state tags via
 * buildLmstudioModelName).
 */
function mapLmstudioWireEntry(entry) {
  if (entry.type !== "llm") return null;
  const id = entry.key?.trim() ?? "";
  if (!id) return null;
  const loadedContextWindow = resolveLoadedContextWindow(entry);
  const contextWindow = asPositiveSafeInteger(entry.max_context_length) ?? null ?? 128e3;
  const contextTokens = Math.min(contextWindow, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH);
  const rawDisplayName = entry.display_name?.trim();
  return {
    id,
    displayName: rawDisplayName && rawDisplayName.length > 0 ? rawDisplayName : id,
    format: entry.format ?? null,
    vision: entry.capabilities?.vision === true,
    trainedForToolUse: entry.capabilities?.trained_for_tool_use === true,
    loaded: loadedContextWindow !== null,
    reasoning: resolveLmstudioReasoningCapability(entry),
    input: entry.capabilities?.vision ? ["text", "image"] : ["text"],
    cost: SELF_HOSTED_DEFAULT_COST,
    compat: resolveLmstudioReasoningCompat(entry),
    contextWindow,
    contextTokens,
    maxTokens: Math.max(1, Math.min(contextWindow, SELF_HOSTED_DEFAULT_MAX_TOKENS)),
  };
}
/**
 * Maps LM Studio wire models to config entries using plain display names.
 * Use this for config persistence where runtime format/state tags are not needed.
 * For runtime discovery with enriched names, use discoverLmstudioModels from models.fetch.ts.
 */
function mapLmstudioWireModelsToConfig(models) {
  return models
    .map((entry) => {
      const base = mapLmstudioWireEntry(entry);
      if (!base) return null;
      return {
        id: base.id,
        name: base.displayName,
        reasoning: base.reasoning,
        input: base.input,
        cost: base.cost,
        ...(base.compat ? { compat: base.compat } : {}),
        contextWindow: base.contextWindow,
        contextTokens: base.contextTokens,
        maxTokens: base.maxTokens,
      };
    })
    .filter((entry) => entry !== null);
}
//#endregion
//#region extensions/lmstudio/src/provider-auth.ts
function hasLmstudioAuthorizationHeader(headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) return false;
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (headerName.trim().toLowerCase() !== "authorization") continue;
    if (hasConfiguredSecretInput(headerValue)) return true;
  }
  return false;
}
function resolveLmstudioProviderAuthMode(apiKey) {
  const normalized = normalizeOptionalSecretInput(apiKey);
  if (normalized !== void 0) {
    const trimmed = normalized.trim();
    if (!trimmed || trimmed === "lmstudio-local" || trimmed === "custom-local") return;
    return "api-key";
  }
  return hasConfiguredSecretInput(apiKey) ? "api-key" : void 0;
}
function shouldUseLmstudioApiKeyPlaceholder(params) {
  return params.hasModels && !params.resolvedApiKey && !params.hasAuthorizationHeader;
}
function shouldUseLmstudioSyntheticAuth(providerConfig) {
  return (
    Array.isArray(providerConfig?.models) &&
    providerConfig.models.length > 0 &&
    !resolveLmstudioProviderAuthMode(providerConfig?.apiKey) &&
    !hasLmstudioAuthorizationHeader(providerConfig?.headers)
  );
}
//#endregion
//#region extensions/lmstudio/src/runtime.ts
function buildLmstudioAuthHeaders(params) {
  const headers = { ...params.headers };
  const apiKey = params.apiKey?.trim();
  if (apiKey && !(apiKey === "lmstudio-local") && !isNonSecretApiKeyMarker(apiKey)) {
    for (const headerName of Object.keys(headers))
      if (headerName.toLowerCase() === "authorization") delete headers[headerName];
    headers.Authorization = `Bearer ${apiKey}`;
  }
  if (params.json) headers["Content-Type"] = "application/json";
  return Object.keys(headers).length > 0 ? headers : void 0;
}
function sanitizeStringHeaders(headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) return;
  const next = {};
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (typeof headerValue !== "string") continue;
    const normalized = headerValue.trim();
    if (!normalized) continue;
    next[headerName] = normalized;
  }
  return Object.keys(next).length > 0 ? next : void 0;
}
function shouldSuppressResolvedRuntimeApiKeyForHeaderAuth(source, hasAuthorizationHeader) {
  if (!hasAuthorizationHeader || !source) return false;
  return /^profile:|^(?:shell )?env(?::|$)/.test(source);
}
async function resolveLmstudioConfiguredApiKeyForProvider(params) {
  const apiKeyInput = params.config?.models?.providers?.[params.providerId]?.apiKey;
  if (apiKeyInput === void 0 || apiKeyInput === null) return;
  const path = params.path ?? `models.providers.${params.providerId}.apiKey`;
  const env = params.env ?? process.env;
  const directApiKey = normalizeOptionalSecretInput(apiKeyInput);
  if (directApiKey !== void 0) {
    const resolved = params.config
      ? await resolveConfiguredSecretInputString({
          config: params.config,
          env,
          value: directApiKey,
          path,
          unresolvedReasonStyle: "detailed",
        })
      : { value: directApiKey };
    if (resolved.unresolvedRefReason) {
      if (params.allowUnresolved) return;
      throw new Error(`${path}: ${resolved.unresolvedRefReason}`);
    }
    const resolvedValue = normalizeOptionalSecretInput(resolved.value);
    const trimmed = resolvedValue ? normalizeApiKeyConfig(resolvedValue).trim() : "";
    if (!trimmed) return;
    if (isKnownEnvApiKeyMarker(trimmed)) return normalizeOptionalSecretInput(env[trimmed]);
    return isNonSecretApiKeyMarker(trimmed) ? void 0 : trimmed;
  }
  if (!params.config) return;
  const resolved = await resolveConfiguredSecretInputString({
    config: params.config,
    env,
    value: apiKeyInput,
    path,
    unresolvedReasonStyle: "detailed",
  });
  if (resolved.unresolvedRefReason) {
    if (params.allowUnresolved) return;
    throw new Error(`${path}: ${resolved.unresolvedRefReason}`);
  }
  const resolvedValue = normalizeOptionalSecretInput(resolved.value);
  const trimmedResolvedValue = resolvedValue ? normalizeApiKeyConfig(resolvedValue).trim() : "";
  if (!trimmedResolvedValue) return;
  if (isNonSecretApiKeyMarker(trimmedResolvedValue)) return;
  return trimmedResolvedValue;
}
async function resolveLmstudioConfiguredApiKey(params) {
  return await resolveLmstudioConfiguredApiKeyForProvider({
    ...params,
    providerId: LMSTUDIO_PROVIDER_ID,
  });
}
async function resolveLmstudioProviderHeaders(params) {
  const headerInputs = params.headers;
  if (!headerInputs || typeof headerInputs !== "object" || Array.isArray(headerInputs)) return;
  if (!params.config) return sanitizeStringHeaders(headerInputs);
  const pathPrefix = params.path ?? "models.providers.lmstudio.headers";
  const resolved = {};
  for (const [headerName, headerValue] of Object.entries(headerInputs)) {
    const resolvedHeader = await resolveConfiguredSecretInputString({
      config: params.config,
      env: params.env ?? process.env,
      value: headerValue,
      path: `${pathPrefix}.${headerName}`,
      unresolvedReasonStyle: "detailed",
    });
    if (resolvedHeader.unresolvedRefReason)
      throw new Error(`${pathPrefix}.${headerName}: ${resolvedHeader.unresolvedRefReason}`);
    const resolvedValue = resolvedHeader.value;
    if (!resolvedValue) continue;
    resolved[headerName] = resolvedValue;
  }
  return Object.keys(resolved).length > 0 ? resolved : void 0;
}
/**
 * Resolves LM Studio API key and provider headers in parallel.
 * Use this as the standard auth setup step before discovery or model load calls.
 */
async function resolveLmstudioRequestContext(params) {
  const providerHeaders =
    params.providerHeaders ?? params.config?.models?.providers?.["lmstudio"]?.headers;
  const [apiKey, headers] = await Promise.all([
    resolveLmstudioRuntimeApiKey({
      config: params.config,
      agentDir: params.agentDir,
      env: params.env,
      headers: providerHeaders,
    }),
    resolveLmstudioProviderHeaders({
      config: params.config,
      env: params.env,
      headers: providerHeaders,
    }),
  ]);
  return {
    apiKey,
    headers,
  };
}
/**
 * Resolves LM Studio runtime API key from config.
 */
async function resolveLmstudioRuntimeApiKey(params) {
  const config = params.config;
  if (!config) return;
  const hasAuthorizationHeader = hasLmstudioAuthorizationHeader(
    params.headers ?? config.models?.providers?.["lmstudio"]?.headers,
  );
  let configuredApiKeyPromise;
  const getConfiguredApiKey = async () => {
    configuredApiKeyPromise ??= resolveLmstudioConfiguredApiKey({
      config,
      env: params.env,
      allowUnresolved: hasAuthorizationHeader,
    });
    return await configuredApiKeyPromise;
  };
  const resolveConfiguredApiKeyOrThrow = async () => {
    const configuredApiKey = await getConfiguredApiKey();
    if (configuredApiKey) return configuredApiKey;
    if (hasAuthorizationHeader) return;
    throw new Error(
      [
        "LM Studio API key is required.",
        `Set models.providers.lmstudio.apiKey (for example "${`\${${LMSTUDIO_DEFAULT_API_KEY_ENV_VAR}}`}")`,
        'or run "openclaw models auth lmstudio".',
      ].join(" "),
    );
  };
  let resolved;
  try {
    resolved = await resolveApiKeyForProvider({
      provider: LMSTUDIO_PROVIDER_ID,
      cfg: config,
      agentDir: params.agentDir,
    });
  } catch {
    return await resolveConfiguredApiKeyOrThrow();
  }
  const resolvedApiKey = resolved.apiKey?.trim();
  if (!resolvedApiKey || resolvedApiKey.length === 0) return await resolveConfiguredApiKeyOrThrow();
  if (shouldSuppressResolvedRuntimeApiKeyForHeaderAuth(resolved.source, hasAuthorizationHeader))
    return await resolveConfiguredApiKeyOrThrow();
  if (
    isNonSecretApiKeyMarker(resolvedApiKey) &&
    resolvedApiKey !== "custom-local" &&
    resolvedApiKey !== "lmstudio-local"
  )
    return await resolveConfiguredApiKeyOrThrow();
  return resolvedApiKey;
}
//#endregion
//#region extensions/lmstudio/src/models.fetch.ts
const log = createSubsystemLogger("extensions/lmstudio/models");
const LMSTUDIO_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
async function fetchLmstudioEndpoint(params) {
  const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
  if (params.ssrfPolicy)
    return await fetchWithSsrFGuard({
      url: params.url,
      init: params.init,
      timeoutMs,
      fetchImpl: params.fetchImpl,
      policy: params.ssrfPolicy,
      auditContext: params.auditContext,
    });
  return {
    response: await (params.fetchImpl ?? fetch)(params.url, {
      ...params.init,
      signal: AbortSignal.timeout(timeoutMs),
    }),
    release: async () => {},
  };
}
function asLmstudioModelWire(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new Error("LM Studio model list: malformed JSON response");
  return value;
}
function withResolvedLmstudioModelKey(error, resolvedModelKey) {
  if (error instanceof Error) return Object.assign(error, { resolvedModelKey });
  return Object.assign(new Error(String(error)), {
    cause: error,
    resolvedModelKey,
  });
}
/** Fetches /api/v1/models and reports transport reachability separately from HTTP status. */
async function fetchLmstudioModels(params) {
  const baseUrl = resolveLmstudioServerBase(params.baseUrl);
  const timeoutMs = params.timeoutMs ?? 5e3;
  try {
    const { response, release } = await fetchLmstudioEndpoint({
      url: `${baseUrl}/api/v1/models`,
      init: {
        headers: buildLmstudioAuthHeaders({
          apiKey: params.apiKey,
          headers: params.headers,
        }),
      },
      timeoutMs,
      fetchImpl: params.fetchImpl,
      ssrfPolicy: params.ssrfPolicy,
      auditContext: "lmstudio-model-discovery",
    });
    try {
      if (!response.ok)
        return {
          reachable: true,
          status: response.status,
          models: [],
        };
      const models = await readProviderJsonArrayFieldResponse(
        response,
        "LM Studio model list",
        "models",
      );
      return {
        reachable: true,
        status: response.status,
        models: models.map(asLmstudioModelWire),
      };
    } finally {
      await release();
    }
  } catch (error) {
    return {
      reachable: false,
      models: [],
      error,
    };
  }
}
/** Discovers LLM models from LM Studio and maps them to OpenClaw model definitions. */
async function discoverLmstudioModels(params) {
  const fetched = await fetchLmstudioModels({
    baseUrl: params.baseUrl,
    apiKey: params.apiKey,
    headers: params.headers,
    fetchImpl: params.fetchImpl,
  });
  const quiet = params.quiet;
  if (!fetched.reachable) {
    if (!quiet) log.debug(`Failed to discover LM Studio models: ${String(fetched.error)}`);
    return [];
  }
  if (fetched.status !== void 0 && fetched.status >= 400) {
    if (!quiet) log.debug(`Failed to discover LM Studio models: ${fetched.status}`);
    return [];
  }
  const models = fetched.models;
  if (models.length === 0) {
    if (!quiet) log.debug("No LM Studio models found on local instance");
    return [];
  }
  return models
    .map((entry) => {
      const base = mapLmstudioWireEntry(entry);
      if (!base) return null;
      return {
        id: base.id,
        name: buildLmstudioModelName(base),
        reasoning: base.reasoning,
        input: base.input,
        cost: SELF_HOSTED_DEFAULT_COST,
        compat: {
          ...base.compat,
          supportsUsageInStreaming: true,
        },
        contextWindow: base.contextWindow,
        contextTokens: base.contextTokens,
        maxTokens: base.maxTokens,
      };
    })
    .filter((entry) => entry !== null);
}
/** Ensures a model is loaded in LM Studio before first real inference/embedding call. */
async function ensureLmstudioModelLoaded(params) {
  const modelKey = params.modelKey.trim();
  if (!modelKey) throw new Error("LM Studio model key is required");
  const timeoutMs = params.timeoutMs ?? 3e4;
  const baseUrl = resolveLmstudioServerBase(params.baseUrl);
  const preflight = await fetchLmstudioModels({
    baseUrl,
    apiKey: params.apiKey,
    headers: params.headers,
    ssrfPolicy: params.ssrfPolicy,
    timeoutMs,
    fetchImpl: params.fetchImpl,
  });
  if (!preflight.reachable)
    throw new Error(`LM Studio model discovery failed: ${String(preflight.error)}`);
  if (preflight.status !== void 0 && preflight.status >= 400)
    throw new Error(`LM Studio model discovery failed (${preflight.status})`);
  const canonicalModelKey = resolveLmstudioCanonicalModelKey({
    modelKey,
    models: preflight.models,
  });
  const matchingModel = preflight.models.find((entry) => entry.key?.trim() === canonicalModelKey);
  const loadedContextWindow = matchingModel ? resolveLoadedContextWindow(matchingModel) : null;
  const advertisedContextLimit = asPositiveSafeInteger(matchingModel?.max_context_length) ?? null;
  const requestedContextLength = asPositiveSafeInteger(params.requestedContextLength) ?? null;
  const contextLengthForLoad =
    advertisedContextLimit === null
      ? (requestedContextLength ?? 64e3)
      : Math.min(requestedContextLength ?? 64e3, advertisedContextLimit);
  if (loadedContextWindow !== null && loadedContextWindow >= contextLengthForLoad)
    return canonicalModelKey;
  try {
    const { response, release } = await fetchLmstudioEndpoint({
      url: `${baseUrl}/api/v1/models/load`,
      init: {
        method: "POST",
        headers: buildLmstudioAuthHeaders({
          apiKey: params.apiKey,
          headers: params.headers,
          json: true,
        }),
        body: JSON.stringify({
          model: canonicalModelKey,
          context_length: contextLengthForLoad,
        }),
      },
      timeoutMs,
      fetchImpl: params.fetchImpl,
      ssrfPolicy: params.ssrfPolicy,
      auditContext: "lmstudio-model-load",
    });
    try {
      if (!response.ok) {
        const body = await readResponseTextLimited(response, LMSTUDIO_ERROR_BODY_LIMIT_BYTES);
        throw new Error(
          `LM Studio model load failed (${response.status})${body ? `: ${body}` : ""}`,
        );
      }
      const payload = await readProviderJsonResponse(response, "LM Studio model load");
      if (typeof payload.status === "string" && payload.status.toLowerCase() !== "loaded")
        throw new Error(`LM Studio model load returned unexpected status: ${payload.status}`);
    } finally {
      await release();
    }
  } catch (error) {
    throw withResolvedLmstudioModelKey(error, canonicalModelKey);
  }
  return canonicalModelKey;
}
//#endregion
export {
  LMSTUDIO_DEFAULT_MODEL_ID as A,
  resolveLmstudioServerBase as C,
  LMSTUDIO_DEFAULT_EMBEDDING_MODEL as D,
  LMSTUDIO_DEFAULT_BASE_URL as E,
  LMSTUDIO_PROVIDER_ID as F,
  LMSTUDIO_PROVIDER_LABEL as I,
  LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL as M,
  LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER as N,
  LMSTUDIO_DEFAULT_INFERENCE_BASE_URL as O,
  LMSTUDIO_MODEL_PLACEHOLDER as P,
  resolveLmstudioReasoningCompat as S,
  LMSTUDIO_DEFAULT_API_KEY_ENV_VAR as T,
  normalizeLmstudioConfiguredCatalogEntries as _,
  resolveLmstudioConfiguredApiKey as a,
  resolveLmstudioInferenceBase as b,
  resolveLmstudioRequestContext as c,
  resolveLmstudioProviderAuthMode as d,
  shouldUseLmstudioApiKeyPlaceholder as f,
  mapLmstudioWireModelsToConfig as g,
  mapLmstudioWireEntry as h,
  buildLmstudioAuthHeaders as i,
  LMSTUDIO_DOCKER_HOST_BASE_URL as j,
  LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH as k,
  resolveLmstudioRuntimeApiKey as l,
  buildLmstudioModelName as m,
  ensureLmstudioModelLoaded as n,
  resolveLmstudioConfiguredApiKeyForProvider as o,
  shouldUseLmstudioSyntheticAuth as p,
  fetchLmstudioModels as r,
  resolveLmstudioProviderHeaders as s,
  discoverLmstudioModels as t,
  hasLmstudioAuthorizationHeader as u,
  normalizeLmstudioConfiguredCatalogEntry as v,
  resolveLoadedContextWindow as w,
  resolveLmstudioReasoningCapability as x,
  normalizeLmstudioProviderConfig as y,
};
