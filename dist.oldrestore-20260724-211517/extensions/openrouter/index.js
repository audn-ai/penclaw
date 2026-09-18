import { t as buildOpenRouterImageGenerationProvider } from "../../image-generation-provider-C-hHC0gp.js";
import "../../defaults-CdX9UGcX.js";
import "../../text-utility-runtime-CJESZCN5.js";
import { t as openrouterMediaUnderstandingProvider } from "../../media-understanding-provider-BAxUcJH1.js";
import {
  n as isOpenRouterMistralModelId,
  r as normalizeOpenRouterApiModelId,
} from "../../models-Dg_TTdZB.js";
import { t as buildOpenRouterMusicGenerationProvider } from "../../music-generation-provider-D06lrSr2.js";
import "../../provider-auth-api-key-BYlVrz-G.js";
import { u as createOpenRouterOAuthAuthMethod } from "../../oauth-1WXULgV5.js";
import "../../provider-stream-family-BwwxQAAq.js";
import {
  n as applyOpenrouterConfig,
  t as OPENROUTER_DEFAULT_MODEL_REF,
} from "../../onboard-DLy0Lol3.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-CXfFv7q7.js";
import {
  i as normalizeOpenRouterBaseUrl,
  n as buildOpenrouterProvider,
  r as isOpenRouterProxyReasoningUnsupportedModel,
  t as OPENROUTER_BASE_URL,
} from "../../provider-catalog-Dv1kASR6.js";
import { i as PASSTHROUGH_GEMINI_REPLAY_HOOKS } from "../../provider-model-shared-CYlCpWlu.js";
import { t as resolveOpenRouterExtraParamsForTransport } from "../../provider-routing-BKidv0ix.js";
import {
  l as getOpenRouterModelCapabilities,
  u as loadOpenRouterModelCapabilities,
} from "../../provider-stream-bgGhD_p0.js";
import { t as buildOpenRouterSpeechProvider } from "../../speech-provider-BrCToU-H.js";
import { t as wrapOpenRouterProviderStream } from "../../stream-DbBDR2Wv.js";
import {
  n as supportsOpenRouterXHighThinking,
  t as resolveOpenRouterThinkingProfile,
} from "../../thinking-policy-C1yRsSs5.js";
import { t as fetchOpenRouterUsage } from "../../usage-10FwJhwx.js";
import { r as truncateUtf16Safe } from "../../utf16-slice-lH-m0h6-.js";
import { t as buildOpenRouterVideoGenerationProvider } from "../../video-generation-provider-CZJHml29.js";
import { t as listOpenRouterVideoModelCatalog } from "../../video-model-catalog-ByOmyPbF.js";
//#region extensions/openrouter/index.ts
const PROVIDER_ID = "openrouter";
const OPENROUTER_DEFAULT_MAX_TOKENS = 8192;
const OPENROUTER_FUSION_MODEL_ID = "openrouter/fusion";
const OPENROUTER_CACHE_TTL_MODEL_PREFIXES = [
  "anthropic/",
  "deepseek/",
  "moonshot/",
  "moonshotai/",
  "zai/",
];
const MAX_PROMPT_MODEL_ID_DISPLAY_CHARS = 256;
function normalizeOpenRouterResolvedModel(model) {
  const normalizedBaseUrl = normalizeOpenRouterBaseUrl(model.baseUrl);
  const normalizedId = normalizeOpenRouterApiModelId(model.id);
  const reasoning = isOpenRouterProxyReasoningUnsupportedModel(model.id) ? false : model.reasoning;
  if (
    (!normalizedBaseUrl || normalizedBaseUrl === model.baseUrl) &&
    (!normalizedId || normalizedId === model.id) &&
    reasoning === model.reasoning
  )
    return;
  return {
    ...model,
    ...(normalizedId ? { id: normalizedId } : {}),
    ...(normalizedBaseUrl ? { baseUrl: normalizedBaseUrl } : {}),
    reasoning,
  };
}
function readRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function sanitizePromptModelId(value) {
  if (typeof value !== "string") return;
  return (
    truncateUtf16Safe(
      Array.from(value)
        .filter((char) => {
          const codePoint = char.codePointAt(0) ?? 0;
          return (
            codePoint > 31 &&
            (codePoint < 127 || codePoint > 159) &&
            codePoint !== 8232 &&
            codePoint !== 8233
          );
        })
        .join("")
        .trim(),
      MAX_PROMPT_MODEL_ID_DISPLAY_CHARS,
    ) || void 0
  );
}
function openRouterModelConfigKey(modelId) {
  const providerPrefix = `${PROVIDER_ID}/`;
  return modelId.trim().toLowerCase().startsWith(providerPrefix)
    ? modelId
    : `${PROVIDER_ID}/${modelId}`;
}
function findConfiguredOpenRouterModelParams(ctx) {
  const configuredModels = ctx.config?.agents?.defaults?.models;
  if (!configuredModels) return;
  const normalizedModelId = normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId;
  const directKeys = [
    openRouterModelConfigKey(ctx.modelId),
    openRouterModelConfigKey(normalizedModelId),
    `${PROVIDER_ID}/${ctx.modelId}`,
    `${PROVIDER_ID}/${normalizedModelId}`,
  ];
  for (const key of directKeys) {
    const params = readRecord(configuredModels[key]?.params);
    if (params) return params;
  }
  for (const [rawKey, entry] of Object.entries(configuredModels)) {
    const slashIndex = rawKey.indexOf("/");
    if (slashIndex <= 0) continue;
    const provider = rawKey.slice(0, slashIndex).trim().toLowerCase();
    const modelId = rawKey.slice(slashIndex + 1);
    const candidateModelId = normalizeOpenRouterApiModelId(modelId) ?? modelId;
    if (
      provider === PROVIDER_ID &&
      candidateModelId.trim().toLowerCase() === normalizedModelId.trim().toLowerCase()
    )
      return readRecord(entry.params);
  }
}
function findConfiguredOpenRouterAgentParams(ctx) {
  if (!ctx.agentId) return;
  return readRecord(ctx.config?.agents?.list?.find((agent) => agent.id === ctx.agentId)?.params);
}
function resolveMergedOpenRouterPromptParams(ctx) {
  const merged = {
    ...readRecord(ctx.config?.agents?.defaults?.params),
    ...findConfiguredOpenRouterModelParams(ctx),
    ...findConfiguredOpenRouterAgentParams(ctx),
  };
  return Object.keys(merged).length > 0 ? merged : void 0;
}
function resolveFusionExtraBody(ctx) {
  const params = resolveMergedOpenRouterPromptParams(ctx);
  return readRecord(
    params && Object.hasOwn(params, "extra_body") ? params.extra_body : params?.extraBody,
  );
}
function resolveOpenRouterFusionPromptContribution(ctx) {
  if ((normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId) !== OPENROUTER_FUSION_MODEL_ID)
    return;
  const extraBody = resolveFusionExtraBody(ctx);
  const fusionPlugin = Array.isArray(extraBody?.plugins)
    ? extraBody.plugins.map(readRecord).find((plugin) => plugin?.id === "fusion")
    : void 0;
  if (!fusionPlugin) return;
  if (fusionPlugin.enabled === false) return;
  const analysisModels = Array.isArray(fusionPlugin.analysis_models)
    ? fusionPlugin.analysis_models.map(sanitizePromptModelId).filter((model) => Boolean(model))
    : [];
  const finalModel = sanitizePromptModelId(fusionPlugin.model);
  const lines = [
    "## OpenRouter Fusion Configuration",
    "The active OpenRouter Fusion request is configured with these non-secret Fusion plugin fields.",
    analysisModels.length > 0 ? `Analysis models: ${analysisModels.join(", ")}.` : void 0,
    finalModel ? `Final Fusion model: ${finalModel}.` : void 0,
  ].filter((line) => Boolean(line));
  return lines.length > 2 ? { dynamicSuffix: lines.join("\n") } : void 0;
}
var openrouter_default = definePluginEntry({
  id: "openrouter",
  name: "OpenRouter Provider",
  description: "Bundled OpenRouter provider plugin",
  register(api) {
    function buildDynamicOpenRouterModel(ctx) {
      const capabilities = getOpenRouterModelCapabilities(
        normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId,
      );
      return {
        id: ctx.modelId,
        name: capabilities?.name ?? ctx.modelId,
        api: "openai-completions",
        provider: PROVIDER_ID,
        baseUrl: OPENROUTER_BASE_URL,
        reasoning:
          (capabilities?.reasoning ?? false) &&
          !isOpenRouterProxyReasoningUnsupportedModel(ctx.modelId),
        input: capabilities?.input ?? ["text"],
        ...(capabilities?.supportsTools !== void 0
          ? { compat: { supportsTools: capabilities.supportsTools } }
          : {}),
        cost: capabilities?.cost ?? {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
        },
        contextWindow: capabilities?.contextWindow ?? 2e5,
        maxTokens: capabilities?.maxTokens ?? OPENROUTER_DEFAULT_MAX_TOKENS,
      };
    }
    function isOpenRouterCacheTtlModel(modelId) {
      return OPENROUTER_CACHE_TTL_MODEL_PREFIXES.some((prefix) => modelId.startsWith(prefix));
    }
    const passthroughReplayHook = PASSTHROUGH_GEMINI_REPLAY_HOOKS.buildReplayPolicy;
    function buildOpenRouterReplayPolicy(ctx) {
      const base = passthroughReplayHook?.(ctx) ?? {};
      if (isOpenRouterMistralModelId(ctx.modelId))
        return {
          ...base,
          sanitizeToolCallIds: true,
          toolCallIdMode: "strict9",
        };
      return base;
    }
    api.registerProvider({
      id: PROVIDER_ID,
      label: "OpenRouter",
      docsPath: "/providers/models",
      envVars: ["OPENROUTER_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "OpenRouter API key",
          hint: "API key",
          optionKey: "openrouterApiKey",
          flagName: "--openrouter-api-key",
          envVar: "OPENROUTER_API_KEY",
          promptMessage: "Enter OpenRouter API key",
          defaultModel: OPENROUTER_DEFAULT_MODEL_REF,
          expectedProviders: ["openrouter"],
          applyConfig: (cfg) => applyOpenrouterConfig(cfg),
          wizard: {
            choiceId: "openrouter-api-key",
            choiceLabel: "OpenRouter API key",
            groupId: "openrouter",
            groupLabel: "OpenRouter",
            groupHint: "OAuth or API key",
            onboardingScopes: ["text-inference", "music-generation"],
          },
        }),
        createOpenRouterOAuthAuthMethod(),
      ],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) return null;
          return {
            provider: {
              ...buildOpenrouterProvider(),
              apiKey,
            },
          };
        },
      },
      staticCatalog: {
        order: "simple",
        run: async () => ({ provider: buildOpenrouterProvider() }),
      },
      resolveDynamicModel: (ctx) => buildDynamicOpenRouterModel(ctx),
      prepareDynamicModel: async (ctx) => {
        await loadOpenRouterModelCapabilities(
          normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId,
        );
      },
      normalizeConfig: ({ providerConfig }) => {
        const normalizedBaseUrl = normalizeOpenRouterBaseUrl(providerConfig.baseUrl);
        return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl
          ? {
              ...providerConfig,
              baseUrl: normalizedBaseUrl,
            }
          : void 0;
      },
      normalizeResolvedModel: ({ model }) => normalizeOpenRouterResolvedModel(model),
      normalizeTransport: ({ api: apiLocal, baseUrl }) => {
        const normalizedBaseUrl = normalizeOpenRouterBaseUrl(baseUrl);
        return normalizedBaseUrl && normalizedBaseUrl !== baseUrl
          ? {
              api: apiLocal,
              baseUrl: normalizedBaseUrl,
            }
          : void 0;
      },
      ...PASSTHROUGH_GEMINI_REPLAY_HOOKS,
      buildReplayPolicy: buildOpenRouterReplayPolicy,
      resolveReasoningOutputMode: () => "native",
      supportsXHighThinking: ({ modelId }) => supportsOpenRouterXHighThinking(modelId),
      resolveThinkingProfile: ({ modelId }) => resolveOpenRouterThinkingProfile(modelId),
      isModernModelRef: () => true,
      resolveSystemPromptContribution: resolveOpenRouterFusionPromptContribution,
      extraParamsForTransport: resolveOpenRouterExtraParamsForTransport,
      wrapStreamFn: wrapOpenRouterProviderStream,
      isCacheTtlEligible: (ctx) => isOpenRouterCacheTtlModel(ctx.modelId),
      resolveUsageAuth: async (ctx) => {
        const apiKey = ctx.resolveApiKeyFromConfigAndStore({
          envDirect: [ctx.env.OPENROUTER_API_KEY],
        });
        return apiKey ? { token: apiKey } : null;
      },
      fetchUsageSnapshot: async (ctx) =>
        await fetchOpenRouterUsage({
          token: ctx.token,
          timeoutMs: ctx.timeoutMs,
          fetchFn: ctx.fetchFn,
        }),
    });
    api.registerMediaUnderstandingProvider(openrouterMediaUnderstandingProvider);
    api.registerImageGenerationProvider(buildOpenRouterImageGenerationProvider());
    api.registerMusicGenerationProvider(buildOpenRouterMusicGenerationProvider());
    api.registerVideoGenerationProvider(buildOpenRouterVideoGenerationProvider());
    api.registerModelCatalogProvider({
      provider: PROVIDER_ID,
      kinds: ["video_generation"],
      liveCatalog: listOpenRouterVideoModelCatalog,
    });
    api.registerSpeechProvider(buildOpenRouterSpeechProvider());
  },
});
//#endregion
export { openrouter_default as default };
