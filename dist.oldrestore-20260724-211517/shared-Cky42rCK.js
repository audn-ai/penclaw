import {
  n as buildApiKeyCredential,
  t as applyAuthProfileConfig,
} from "./provider-auth-helpers-CLs4Yz61.js";
import {
  a as resolveClaudeFable5ModelIdentity,
  f as supportsClaudeNativeXhighEffort,
  u as supportsClaudeAdaptiveThinking,
} from "./src-Dcc_hMY6.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import "./provider-model-shared-CYlCpWlu.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region extensions/microsoft-foundry/shared.ts
const PROVIDER_ID = "microsoft-foundry";
const DEFAULT_API = "openai-completions";
const DEFAULT_GPT5_API = "openai-responses";
const ANTHROPIC_MESSAGES_API = "anthropic-messages";
const COGNITIVE_SERVICES_RESOURCE = "https://cognitiveservices.azure.com";
const FOUNDRY_ANTHROPIC_SCOPE = "https://ai.azure.com/.default";
const TOKEN_REFRESH_MARGIN_MS = 300 * 1e3;
function normalizeModelInput(input) {
  const normalized = Array.isArray(input)
    ? input.filter((item) => item === "text" || item === "image")
    : [];
  return normalized.length > 0 ? normalized : ["text"];
}
function normalizeFoundryModelName(value) {
  return normalizeLowercaseStringOrEmpty(value) || void 0;
}
function isAnthropicFoundryDeployment(modelName) {
  const normalized = normalizeFoundryModelName(modelName);
  return normalized ? normalized.startsWith("claude") : false;
}
function isFoundryClaudeMythosPreview(value) {
  return normalizeFoundryModelName(value) === "claude-mythos-preview";
}
function usesFoundryResponsesByDefault(value) {
  const normalized = normalizeFoundryModelName(value);
  if (!normalized) return false;
  return (
    normalized.startsWith("gpt-") ||
    normalized.startsWith("o1") ||
    normalized.startsWith("o3") ||
    normalized.startsWith("o4") ||
    normalized.startsWith("deepseek-v4") ||
    normalized === "computer-use-preview"
  );
}
function isFoundryMaiImageModel(value) {
  const normalized = normalizeFoundryModelName(value);
  if (!normalized) return false;
  return (
    normalized === "mai-image-2.5-flash" ||
    normalized === "mai-image-2.5" ||
    normalized === "mai-image-2e" ||
    normalized === "mai-image-2" ||
    normalized === "mai-image-2-efficient"
  );
}
function supportsFoundryReasoningContent(value) {
  const normalized = normalizeFoundryModelName(value);
  return normalized === "mai-ds-r1" || normalized === "mai-thinking-1";
}
function supportsFoundryImageInput(value) {
  const normalized = normalizeFoundryModelName(value);
  if (!normalized) return false;
  return (
    isAnthropicFoundryDeployment(normalized) ||
    normalized.startsWith("gpt-") ||
    normalized.startsWith("o1") ||
    normalized.startsWith("o3") ||
    normalized.startsWith("o4") ||
    normalized === "computer-use-preview"
  );
}
function requiresFoundryEntraIdClaudeAuth(value) {
  const normalized = normalizeFoundryModelName(value);
  return normalized
    ? normalized === "claude-mythos-preview" || normalized.startsWith("claude-mythos-")
    : false;
}
function requiresFoundryMandatoryAdaptiveClaudeThinking(value) {
  const normalized = normalizeFoundryModelName(value);
  return normalized
    ? resolveClaudeFable5ModelIdentity({ id: normalized }) !== void 0 ||
        normalized === "claude-mythos-preview" ||
        normalized.startsWith("claude-mythos-")
    : false;
}
function supportsFoundryManualClaudeThinking(value) {
  const normalized = normalizeFoundryModelName(value)?.replace(/\./g, "-");
  return normalized
    ? /(?:^|-)claude-(?:opus-4-(?:1|5)|sonnet-4-5|haiku-4-5)(?=$|[^a-z0-9])/.test(normalized)
    : false;
}
function resolveFoundryModelTokenLimits(value) {
  const normalized = normalizeFoundryModelName(value);
  const normalizedVersion = normalized?.replace(/\./g, "-");
  if (
    normalized &&
    (supportsClaudeAdaptiveThinking({ id: normalized }) ||
      requiresFoundryMandatoryAdaptiveClaudeThinking(normalized))
  )
    return {
      contextWindow: 1e6,
      maxTokens: 128e3,
    };
  if (
    normalizedVersion === "claude-opus-4-5" ||
    normalizedVersion === "claude-sonnet-4-5" ||
    normalizedVersion === "claude-haiku-4-5"
  )
    return {
      contextWindow: 2e5,
      maxTokens: 64e3,
    };
  if (normalizedVersion === "claude-opus-4-1")
    return {
      contextWindow: 2e5,
      maxTokens: 32e3,
    };
  if (normalized === "mai-ds-r1")
    return {
      contextWindow: 163840,
      maxTokens: 163840,
    };
  return {
    contextWindow: 128e3,
    maxTokens: 16384,
  };
}
function requiresFoundryMaxCompletionTokens(value) {
  const normalized = normalizeFoundryModelName(value);
  if (!normalized) return false;
  return (
    normalized.startsWith("gpt-5") ||
    normalized.startsWith("o1") ||
    normalized.startsWith("o3") ||
    normalized.startsWith("o4")
  );
}
function supportsFoundryReasoningEffort(value) {
  const normalized = normalizeFoundryModelName(value);
  if (!normalized || /^gpt-5-chat(?:-|$)/u.test(normalized) || /^o1-mini(?:-|$)/u.test(normalized))
    return false;
  return (
    normalized.startsWith("gpt-5") ||
    normalized.startsWith("o1") ||
    normalized.startsWith("o3") ||
    normalized.startsWith("o4")
  );
}
function resolveFoundryReasoningEfforts(value) {
  const normalized = normalizeFoundryModelName(value);
  if (!normalized || !supportsFoundryReasoningEffort(normalized)) return;
  if (normalized === "gpt-5.1-codex-max") return ["none", "medium", "high", "xhigh"];
  if (normalized === "gpt-5-pro") return ["high"];
  if (/^gpt-5\.[2-9](?:\.|-|$)/u.test(normalized)) return ["none", "low", "medium", "high"];
  if (/^gpt-5\.1(?:-|$)/u.test(normalized)) return ["none", "low", "medium", "high"];
  if (/^gpt-5-codex(?:-|$)/u.test(normalized)) return ["low", "medium", "high"];
  if (/^gpt-5(?:-|$)/u.test(normalized)) return ["minimal", "low", "medium", "high"];
  return ["low", "medium", "high"];
}
function buildFoundryThinkingLevelMap(efforts) {
  if (!efforts) return;
  const supported = new Set(efforts);
  return {
    off: supported.has("none") ? "none" : null,
    minimal: supported.has("minimal") ? "minimal" : null,
    low: supported.has("low") ? "low" : null,
    medium: supported.has("medium") ? "medium" : null,
    high: supported.has("high") ? "high" : null,
    xhigh: supported.has("xhigh") ? "xhigh" : null,
    max: null,
  };
}
function isFoundryProviderApi(value) {
  return (
    value === "openai-completions" || value === "openai-responses" || value === "anthropic-messages"
  );
}
function formatFoundryApiLabel(api) {
  return api === "openai-responses"
    ? "Responses"
    : api === "anthropic-messages"
      ? "Anthropic Messages"
      : "Chat Completions";
}
function normalizeFoundryEndpoint(endpoint) {
  const trimmed = normalizeOptionalString(endpoint) ?? "";
  if (!trimmed) return trimmed;
  try {
    const parsed = new URL(trimmed);
    parsed.search = "";
    parsed.hash = "";
    const normalizedPath = parsed.pathname
      .replace(/\/(?:openai|anthropic)(?:$|\/).*/i, "")
      .replace(/\/+$/, "");
    return `${parsed.origin}${normalizedPath && normalizedPath !== "/" ? normalizedPath : ""}`;
  } catch {
    return trimmed
      .replace(/[?#].*$/, "")
      .replace(/\/+$/, "")
      .replace(/\/(?:openai|anthropic)(?:$|\/).*/i, "");
  }
}
function buildFoundryV1BaseUrl(endpoint) {
  const base = normalizeFoundryEndpoint(endpoint);
  return base.endsWith("/openai/v1") ? base : `${base}/openai/v1`;
}
function buildFoundryAnthropicBaseUrl(endpoint) {
  const base = normalizeFoundryEndpoint(endpoint);
  return base.endsWith("/anthropic") ? base : `${base}/anthropic`;
}
function resolveFoundryApi(modelId, modelNameHint, configuredApi) {
  if (isFoundryProviderApi(configuredApi)) return configuredApi;
  const configuredModelName = resolveConfiguredModelNameHint(modelId, modelNameHint);
  if (isAnthropicFoundryDeployment(configuredModelName)) return ANTHROPIC_MESSAGES_API;
  return usesFoundryResponsesByDefault(configuredModelName) ? DEFAULT_GPT5_API : DEFAULT_API;
}
function buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, configuredApi) {
  return resolveFoundryApi(modelId, modelNameHint, configuredApi) === "anthropic-messages"
    ? buildFoundryAnthropicBaseUrl(endpoint)
    : buildFoundryV1BaseUrl(endpoint);
}
function extractFoundryEndpoint(baseUrl) {
  const trimmed = normalizeOptionalString(baseUrl);
  if (!trimmed) return;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
    return normalizeFoundryEndpoint(trimmed) || void 0;
  } catch {
    return;
  }
}
function buildFoundryModelCompat(modelId, modelNameHint, configuredApi) {
  const resolvedApi = resolveFoundryApi(modelId, modelNameHint, configuredApi);
  if (resolvedApi === "anthropic-messages") return;
  const configuredModelName = resolveConfiguredModelNameHint(modelId, modelNameHint);
  const needsMaxCompletionTokens = requiresFoundryMaxCompletionTokens(configuredModelName);
  const supportsReasoningEffort = supportsFoundryReasoningEffort(configuredModelName);
  const supportedReasoningEfforts = resolveFoundryReasoningEfforts(configuredModelName);
  if (resolvedApi !== "openai-responses")
    return {
      supportsReasoningEffort,
      ...(supportedReasoningEfforts ? { supportedReasoningEfforts } : {}),
      maxTokensField: needsMaxCompletionTokens ? "max_completion_tokens" : "max_tokens",
    };
  return {
    ...(resolvedApi === "openai-responses" ? { supportsStore: false } : {}),
    ...(supportsReasoningEffort
      ? {
          supportsReasoningEffort,
          supportedReasoningEfforts,
        }
      : {}),
    maxTokensField: needsMaxCompletionTokens ? "max_completion_tokens" : "max_tokens",
  };
}
function resolveFoundryModelCapabilities(modelId, modelNameHint, configuredApi, existingInput) {
  const modelName = resolveConfiguredModelNameHint(modelId, modelNameHint) ?? modelId;
  const api = resolveFoundryApi(modelId, modelName, configuredApi);
  const normalizedInput = normalizeModelInput(existingInput);
  const supportedReasoningEfforts = resolveFoundryReasoningEfforts(modelName);
  const isAnthropic = api === "anthropic-messages" || isAnthropicFoundryDeployment(modelName);
  const supportsClaudeThinking =
    isAnthropic &&
    (supportsClaudeAdaptiveThinking({ id: modelName }) ||
      supportsFoundryManualClaudeThinking(modelName) ||
      requiresFoundryMandatoryAdaptiveClaudeThinking(modelName));
  const supportsClaudeXhighThinking =
    isAnthropic && supportsClaudeNativeXhighEffort({ id: modelName });
  const tokenLimits = resolveFoundryModelTokenLimits(modelName);
  return {
    modelName,
    api,
    reasoning:
      supportsClaudeThinking ||
      supportsFoundryReasoningEffort(modelName) ||
      supportsFoundryReasoningContent(modelName),
    ...(supportsClaudeXhighThinking
      ? {
          thinkingLevelMap: {
            xhigh: "xhigh",
            max: "max",
          },
        }
      : supportedReasoningEfforts
        ? { thinkingLevelMap: buildFoundryThinkingLevelMap(supportedReasoningEfforts) }
        : {}),
    input:
      normalizedInput.includes("image") || supportsFoundryImageInput(modelName)
        ? ["text", "image"]
        : normalizedInput,
    contextWindow: tokenLimits.contextWindow,
    maxTokens: tokenLimits.maxTokens,
    compat: buildFoundryModelCompat(modelId, modelName, api),
  };
}
function mergeFoundryCanonicalModelParams(params, modelName) {
  return {
    ...params,
    canonicalModelId: modelName,
  };
}
function resolveConfiguredModelNameHint(modelId, modelNameHint) {
  const trimmedName = normalizeOptionalString(modelNameHint) ?? "";
  if (trimmedName) return trimmedName;
  const trimmedId = normalizeOptionalString(modelId) ?? "";
  return trimmedId ? trimmedId : void 0;
}
function buildFoundryProviderConfig(endpoint, modelId, modelNameHint, options) {
  const resolvedApi = resolveFoundryApi(modelId, modelNameHint, options?.api);
  const deployments = options?.deployments?.length
    ? options.deployments
    : [
        {
          name: modelId,
          modelName: modelNameHint ?? void 0,
          api: resolvedApi,
        },
      ];
  return {
    baseUrl: buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, resolvedApi),
    api: resolvedApi,
    authHeader: void 0,
    apiKey: void 0,
    headers: void 0,
    models: deployments.map((deployment) => {
      const capabilities = resolveFoundryModelCapabilities(
        deployment.name,
        deployment.modelName,
        deployment.api ?? resolvedApi,
      );
      const modelBaseUrl = buildFoundryProviderBaseUrl(
        endpoint,
        deployment.name,
        capabilities.modelName,
        capabilities.api,
      );
      return Object.assign(
        {
          id: deployment.name,
          name: capabilities.modelName,
          api: capabilities.api,
          baseUrl: modelBaseUrl,
          reasoning: capabilities.reasoning,
          ...(capabilities.thinkingLevelMap
            ? { thinkingLevelMap: capabilities.thinkingLevelMap }
            : {}),
          params: mergeFoundryCanonicalModelParams(void 0, capabilities.modelName),
          input: capabilities.input,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          contextWindow: capabilities.contextWindow,
          maxTokens: capabilities.maxTokens,
        },
        capabilities.compat ? { compat: capabilities.compat } : {},
      );
    }),
  };
}
function resolveSelectedDeploymentModelName(params) {
  const selectedDeployment = params.deployments?.find(
    (deployment) => deployment.name === params.modelId,
  );
  return resolveConfiguredModelNameHint(
    params.modelId,
    selectedDeployment?.modelName ?? params.modelNameHint,
  );
}
function isSelectedMaiImageDeployment(params) {
  return isFoundryMaiImageModel(resolveSelectedDeploymentModelName(params));
}
function buildFoundryImageDefaultPatch(params) {
  if (!isSelectedMaiImageDeployment(params)) return {};
  return {
    agents: { defaults: { imageGenerationModel: { primary: `${PROVIDER_ID}/${params.modelId}` } } },
  };
}
function buildFoundryCredentialMetadata(params) {
  const resolvedApi = resolveFoundryApi(params.modelId, params.modelNameHint, params.api);
  const metadata = {
    authMethod: params.authMethod,
    endpoint: params.endpoint,
    modelId: params.modelId,
    api: resolvedApi,
  };
  const modelName = resolveConfiguredModelNameHint(params.modelId, params.modelNameHint);
  if (modelName) metadata.modelName = modelName;
  if (params.subscriptionId) metadata.subscriptionId = params.subscriptionId;
  if (params.subscriptionName) metadata.subscriptionName = params.subscriptionName;
  if (params.tenantId) metadata.tenantId = params.tenantId;
  return metadata;
}
/**
 * Build the plugins.allow patch so the provider is allowlisted when the
 * config already gates plugins via a non-empty allow array.  Returns an
 * empty object when no patch is needed (allowlist absent / already listed).
 */
function buildPluginsAllowPatch(currentAllow) {
  if (!Array.isArray(currentAllow) || currentAllow.length === 0) return {};
  if (currentAllow.includes("microsoft-foundry")) return {};
  return { plugins: { allow: [...currentAllow, PROVIDER_ID] } };
}
function buildFoundryAuthOrderPatch(params) {
  const nextOrder = [
    params.profileId,
    ...(params.currentProviderProfileIds ?? []).filter(
      (profileId) => profileId !== params.profileId,
    ),
  ];
  return { auth: { order: { [PROVIDER_ID]: nextOrder } } };
}
function listConfiguredFoundryProfileIds(config) {
  return Object.entries(config.auth?.profiles ?? {})
    .filter(([, profile]) => profile.provider === PROVIDER_ID)
    .map(([profileId]) => profileId);
}
function buildFoundryAuthResult(params) {
  const imageDefaultPatch = buildFoundryImageDefaultPatch(params);
  const defaultModel = isSelectedMaiImageDeployment(params)
    ? void 0
    : `${PROVIDER_ID}/${params.modelId}`;
  return {
    profiles: [
      {
        profileId: params.profileId,
        credential: buildApiKeyCredential(
          PROVIDER_ID,
          params.apiKey,
          buildFoundryCredentialMetadata({
            authMethod: params.authMethod,
            endpoint: params.endpoint,
            modelId: params.modelId,
            modelNameHint: params.modelNameHint,
            api: params.api,
            subscriptionId: params.subscriptionId,
            subscriptionName: params.subscriptionName,
            tenantId: params.tenantId,
          }),
          params.secretInputMode ? { secretInputMode: params.secretInputMode } : void 0,
        ),
      },
    ],
    configPatch: {
      ...buildFoundryAuthOrderPatch({
        profileId: params.profileId,
        currentProviderProfileIds: params.currentProviderProfileIds,
      }),
      ...imageDefaultPatch,
      models: {
        providers: {
          [PROVIDER_ID]: buildFoundryProviderConfig(
            params.endpoint,
            params.modelId,
            params.modelNameHint,
            {
              api: params.api,
              deployments: params.deployments,
            },
          ),
        },
      },
      ...buildPluginsAllowPatch(params.currentPluginsAllow),
    },
    ...(defaultModel ? { defaultModel } : {}),
    notes: params.notes,
  };
}
function applyFoundryProfileBinding(config, profileId) {
  config.auth = applyAuthProfileConfig(config, {
    profileId,
    provider: PROVIDER_ID,
    mode: "api_key",
  }).auth;
}
function applyFoundryProviderConfig(config, providerConfig) {
  config.models ??= {};
  config.models.providers ??= {};
  config.models.providers[PROVIDER_ID] = providerConfig;
}
function resolveFoundryTargetProfileId(config) {
  const configuredProfiles = config.auth?.profiles ?? {};
  const configuredProfileEntries = Object.entries(configuredProfiles).filter(([, profile]) => {
    return profile.provider === PROVIDER_ID;
  });
  if (configuredProfileEntries.length === 0) return;
  return (
    config.auth?.order?.["microsoft-foundry"]?.find((profileId) =>
      normalizeOptionalString(profileId),
    ) ?? (configuredProfileEntries.length === 1 ? configuredProfileEntries[0]?.[0] : void 0)
  );
}
//#endregion
export {
  supportsFoundryReasoningEffort as A,
  requiresFoundryMaxCompletionTokens as C,
  resolveFoundryTargetProfileId as D,
  resolveFoundryModelCapabilities as E,
  supportsFoundryImageInput as O,
  requiresFoundryMandatoryAdaptiveClaudeThinking as S,
  resolveFoundryApi as T,
  isFoundryProviderApi as _,
  FOUNDRY_ANTHROPIC_SCOPE as a,
  normalizeFoundryEndpoint as b,
  applyFoundryProfileBinding as c,
  buildFoundryProviderBaseUrl as d,
  extractFoundryEndpoint as f,
  isFoundryMaiImageModel as g,
  isFoundryClaudeMythosPreview as h,
  DEFAULT_GPT5_API as i,
  usesFoundryResponsesByDefault as j,
  supportsFoundryReasoningContent as k,
  applyFoundryProviderConfig as l,
  isAnthropicFoundryDeployment as m,
  COGNITIVE_SERVICES_RESOURCE as n,
  PROVIDER_ID as o,
  formatFoundryApiLabel as p,
  DEFAULT_API as r,
  TOKEN_REFRESH_MARGIN_MS as s,
  ANTHROPIC_MESSAGES_API as t,
  buildFoundryAuthResult as u,
  listConfiguredFoundryProfileIds as v,
  resolveConfiguredModelNameHint as w,
  requiresFoundryEntraIdClaudeAuth as x,
  mergeFoundryCanonicalModelParams as y,
};
