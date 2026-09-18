import { n as resolveXaiTransport } from "../../api-CUUZZEIO.js";
import {
  n as readPluginCodeExecutionConfig,
  r as resolveCodeExecutionEnabled,
} from "../../code-execution-config-DHTJDDyi.js";
import {
  n as createCodeExecutionToolDefinition,
  t as buildMissingCodeExecutionApiKeyPayload,
} from "../../code-execution-tool-shared-CeAkKo1Y.js";
import { t as buildXaiImageGenerationProvider } from "../../image-generation-provider-C2Q7X_vh.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import "../../provider-web-search-Bpbir19i.js";
import { t as normalizeXaiModelId } from "../../model-id-C3Tkp5Dy.js";
import { n as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-hMJBAw9W.js";
import {
  n as buildLiveXaiProvider,
  r as buildXaiProvider,
  t as buildLiveXaiOAuthProvider,
} from "../../provider-catalog-Dy-HwcwL.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CHlACr9J.js";
import { t as isXaiProviderId } from "../../provider-id-DOYNBqSl.js";
import { r as OPENAI_COMPATIBLE_REPLAY_HOOKS } from "../../provider-model-shared-CYlCpWlu.js";
import {
  n as resolveXaiForwardCompatModel,
  t as isModernXaiModel,
} from "../../provider-models-BF6xVwo8.js";
import { t as resolveThinkingProfile } from "../../provider-policy-api-DrHS43Pt.js";
import { f as defaultToolStreamExtraParams } from "../../provider-stream-shared-CMy-5I0G.js";
import { t as buildXaiRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-CH48HnyC.js";
import { t as buildXaiRealtimeVoiceProvider } from "../../realtime-voice-provider-DWn5ZlwA.js";
import { t as applyXaiRuntimeModelCompat } from "../../runtime-model-compat-gatOcnur.js";
import { t as buildXaiSpeechProvider } from "../../speech-provider-DAgrcs2f.js";
import { r as wrapXaiProviderStream } from "../../stream-DxWzbjXr.js";
import { t as buildXaiMediaUnderstandingProvider } from "../../stt-BwdssG7X.js";
import {
  n as resolveFallbackXaiAuth,
  t as isXaiToolEnabled,
} from "../../tool-auth-shared-B64Ekm8c.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { t as buildXaiVideoGenerationProvider } from "../../video-generation-provider-B1rC9hYG.js";
import { t as createXaiWebSearchProvider } from "../../web-search-BwhGSv3b.js";
import { t as resolveEffectiveXSearchConfig } from "../../x-search-config-Didt8_m2.js";
import {
  n as buildMissingXSearchApiKeyPayload,
  r as createXSearchToolDefinition,
} from "../../x-search-tool-shared-Diktx6ye.js";
import {
  a as createXaiOAuthAuthMethod,
  i as createXaiDeviceCodeAuthMethod,
  l as refreshXaiOAuthCredential,
} from "../../xai-oauth-BUkfI3hq.js";
//#region extensions/xai/index.ts
const PROVIDER_ID = "xai";
const XAI_CREDIT_OR_SPENDING_LIMIT_RE =
  /\b(?:used all available credits|monthly spending limit|purchase more credits|raise your spending limit)\b/i;
const XAI_RATE_LIMIT_RE = /\b(?:rate limit exceeded|too many requests)\b/i;
const loadCodeExecutionModule = createLazyRuntimeModule(() => import("./code-execution.js"));
const loadXSearchModule = createLazyRuntimeModule(() => import("./x-search.js"));
function classifyXaiFailoverReason(errorMessage) {
  if (XAI_CREDIT_OR_SPENDING_LIMIT_RE.test(errorMessage)) return "billing";
  if (XAI_RATE_LIMIT_RE.test(errorMessage)) return "rate_limit";
}
function hasResolvableXaiApiKey(config, auth) {
  return isXaiToolEnabled({
    sourceConfig: config,
    auth,
  });
}
function isCodeExecutionEnabled(config, auth) {
  return resolveCodeExecutionEnabled({
    sourceConfig: config,
    runtimeConfig: config,
    config: readPluginCodeExecutionConfig(config),
    auth,
  });
}
function isXSearchEnabled(config, auth) {
  if (
    (config && typeof config === "object" ? resolveEffectiveXSearchConfig(config) : void 0)
      ?.enabled === false
  )
    return false;
  return hasResolvableXaiApiKey(config, auth);
}
function shouldExposeXaiBilledTool(params) {
  const activeProvider = params.activeProvider?.trim();
  if (!activeProvider || params.enabled === false) return false;
  return isXaiProviderId(activeProvider) || params.enabled === true;
}
function createLazyCodeExecutionTool(ctx) {
  const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
  const codeExecutionConfig = readPluginCodeExecutionConfig(effectiveConfig);
  if (
    !shouldExposeXaiBilledTool({
      activeProvider: ctx.activeModel?.provider,
      enabled: codeExecutionConfig?.enabled,
    })
  )
    return null;
  if (!isCodeExecutionEnabled(effectiveConfig, ctx)) return null;
  return createCodeExecutionToolDefinition(async (toolCallId, args) => {
    const { createCodeExecutionTool } = await loadCodeExecutionModule();
    const tool = createCodeExecutionTool({
      config: ctx.config,
      runtimeConfig: ctx.runtimeConfig ?? null,
      auth: ctx,
    });
    if (!tool) return jsonResult(buildMissingCodeExecutionApiKeyPayload());
    return await tool.execute(toolCallId, args);
  });
}
function createLazyXSearchTool(ctx) {
  const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
  const xSearchConfig = resolveEffectiveXSearchConfig(effectiveConfig);
  if (
    !shouldExposeXaiBilledTool({
      activeProvider: ctx.activeModel?.provider,
      enabled: xSearchConfig?.enabled,
    })
  )
    return null;
  if (!isXSearchEnabled(effectiveConfig, ctx)) return null;
  return createXSearchToolDefinition(async (toolCallId, args) => {
    const { createXSearchTool } = await loadXSearchModule();
    const tool = createXSearchTool({
      config: ctx.config,
      runtimeConfig: ctx.runtimeConfig ?? null,
      auth: ctx,
    });
    if (!tool) return jsonResult(buildMissingXSearchApiKeyPayload());
    return await tool.execute(toolCallId, args);
  });
}
var xai_default = defineSingleProviderPluginEntry({
  id: "xai",
  name: "xAI Plugin",
  description: "Bundled xAI plugin",
  provider: {
    label: "xAI",
    aliases: ["x-ai"],
    docsPath: "/providers/xai",
    auth: [
      {
        methodId: "api-key",
        label: "xAI API key",
        hint: "API key",
        optionKey: "xaiApiKey",
        flagName: "--xai-api-key",
        envVar: "XAI_API_KEY",
        promptMessage: "Enter xAI API key",
        defaultModel: XAI_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyXaiConfig(cfg),
        wizard: { groupLabel: "xAI (Grok)" },
      },
    ],
    extraAuth: [createXaiOAuthAuthMethod(), createXaiDeviceCodeAuthMethod()],
    catalog: {
      order: "simple",
      run: async (ctx) => {
        const auth = ctx.resolveProviderAuth(PROVIDER_ID);
        try {
          const { resolveApiKeyForProvider } =
            await import("../../plugin-sdk/provider-auth-runtime.js");
          const runtimeAuth = await resolveApiKeyForProvider({
            provider: PROVIDER_ID,
            cfg: ctx.config,
            ...(ctx.agentDir ? { agentDir: ctx.agentDir } : {}),
            ...(ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {}),
            ...(auth.profileId
              ? {
                  profileId: auth.profileId,
                  lockedProfile: true,
                }
              : {}),
          });
          if (runtimeAuth?.mode === "oauth" && runtimeAuth.apiKey)
            return {
              provider: await buildLiveXaiOAuthProvider({ discoveryApiKey: runtimeAuth.apiKey }),
            };
        } catch {
          if (auth.mode === "oauth") {
          }
        }
        if (auth.apiKey)
          return {
            provider: await buildLiveXaiProvider({
              apiKey: auth.apiKey,
              discoveryApiKey: auth.discoveryApiKey,
            }),
          };
        const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID);
        if (!apiKey.apiKey) return null;
        return {
          provider: await buildLiveXaiProvider({
            apiKey: apiKey.apiKey,
            discoveryApiKey: apiKey.discoveryApiKey,
          }),
        };
      },
      staticRun: async () => ({ provider: buildXaiProvider() }),
    },
    ...OPENAI_COMPATIBLE_REPLAY_HOOKS,
    prepareExtraParams: (ctx) => defaultToolStreamExtraParams(ctx.extraParams),
    wrapStreamFn: wrapXaiProviderStream,
    resolveSyntheticAuth: ({ config }) => {
      const fallbackAuth = resolveFallbackXaiAuth(config);
      if (!fallbackAuth) return;
      return {
        apiKey: fallbackAuth.apiKey,
        source: fallbackAuth.source,
        mode: "api-key",
      };
    },
    normalizeResolvedModel: ({ model }) => applyXaiRuntimeModelCompat(model),
    normalizeTransport: ({ provider, api, baseUrl }) =>
      resolveXaiTransport({
        provider,
        api,
        baseUrl,
      }),
    normalizeModelId: ({ modelId }) => normalizeXaiModelId(modelId),
    resolveDynamicModel: (ctx) =>
      resolveXaiForwardCompatModel({
        providerId: PROVIDER_ID,
        ctx,
      }),
    refreshOAuth: refreshXaiOAuthCredential,
    resolveThinkingProfile,
    isModernModelRef: ({ modelId }) => isModernXaiModel(modelId),
    classifyFailoverReason: ({ errorMessage }) => classifyXaiFailoverReason(errorMessage),
  },
  register(api) {
    api.registerWebSearchProvider(createXaiWebSearchProvider());
    api.registerMediaUnderstandingProvider(buildXaiMediaUnderstandingProvider());
    api.registerVideoGenerationProvider(buildXaiVideoGenerationProvider());
    api.registerImageGenerationProvider(buildXaiImageGenerationProvider());
    api.registerSpeechProvider(buildXaiSpeechProvider());
    api.registerRealtimeTranscriptionProvider(buildXaiRealtimeTranscriptionProvider());
    api.registerRealtimeVoiceProvider(buildXaiRealtimeVoiceProvider());
    api.registerTool((ctx) => createLazyCodeExecutionTool(ctx), { name: "code_execution" });
    api.registerTool((ctx) => createLazyXSearchTool(ctx), { name: "x_search" });
  },
});
//#endregion
export { xai_default as default };
