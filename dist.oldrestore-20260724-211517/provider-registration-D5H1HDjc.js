import { r as isGoogleVertexBaseUrl } from "./google-api-base-url-B0vh8Owj.js";
import "./provider-auth-api-key-BYlVrz-G.js";
import { n as normalizeGoogleModelId } from "./model-id-CAmKILzd.js";
import {
  n as applyGoogleGeminiModelDefault,
  t as GOOGLE_GEMINI_DEFAULT_MODEL,
} from "./onboard-H3zK-CdP.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-CXfFv7q7.js";
import {
  n as buildGoogleVertexStaticCatalogProvider,
  t as buildGoogleStaticCatalogProvider,
} from "./provider-catalog-C8tQt0Jl.js";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-Cpu4biP8.js";
import {
  n as resolveGoogleGeminiForwardCompatModel,
  t as isModernGoogleModel,
} from "./provider-models-BovOaplt.js";
import {
  r as resolveGoogleGenerativeAiTransport,
  t as normalizeGoogleProviderConfig,
} from "./provider-policy-7Kv8Y-Tx.js";
import {
  i as createGoogleVertexTransportStreamFn,
  r as createGoogleGenerativeAiTransportStreamFn,
} from "./transport-stream-C3mSLUWE.js";
import { a as resolveGoogleVertexConfigApiKey } from "./vertex-adc-RdKKWwTZ.js";
//#region extensions/google/provider-registration.ts
function resolveGoogleReasoningOutputMode(ctx) {
  if (ctx.provider === "google" || ctx.provider === "google-vertex") {
    const api = ctx.model?.api ?? ctx.modelApi;
    if (!api || api === "google-generative-ai" || api === "google-vertex") return "native";
  }
  return "tagged";
}
function buildGoogleProvider() {
  return {
    id: "google",
    label: "Google AI Studio",
    docsPath: "/providers/models",
    hookAliases: ["google-antigravity", "google-vertex"],
    envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
    auth: [
      createProviderApiKeyAuthMethod({
        providerId: "google",
        methodId: "api-key",
        label: "Google Gemini API key",
        hint: "AI Studio / Gemini API key",
        optionKey: "geminiApiKey",
        flagName: "--gemini-api-key",
        envVar: "GEMINI_API_KEY",
        promptMessage: "Enter Gemini API key",
        defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
        expectedProviders: ["google"],
        applyConfig: (cfg) => applyGoogleGeminiModelDefault(cfg).next,
        wizard: {
          choiceId: "gemini-api-key",
          choiceLabel: "Google Gemini API key",
          groupId: "google",
          groupLabel: "Google",
          groupHint: "Gemini API key + OAuth",
        },
      }),
    ],
    normalizeTransport: ({ provider, api, baseUrl }) =>
      resolveGoogleGenerativeAiTransport({
        provider,
        api,
        baseUrl,
      }),
    normalizeConfig: ({ provider, providerConfig }) =>
      normalizeGoogleProviderConfig(provider, providerConfig),
    resolveConfigApiKey: ({ provider, env }) =>
      provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
    staticCatalog: {
      order: "simple",
      run: async () => ({
        providers: {
          google: buildGoogleStaticCatalogProvider(),
          "google-vertex": buildGoogleVertexStaticCatalogProvider(),
        },
      }),
    },
    normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
    resolveDynamicModel: (ctx) =>
      resolveGoogleGeminiForwardCompatModel({
        providerId: ctx.provider,
        ctx,
      }),
    createStreamFn: ({ model }) => {
      if (
        model.api === "google-vertex" ||
        (model.api === "google-generative-ai" &&
          (model.provider === "google-vertex" || isGoogleVertexBaseUrl(model.baseUrl)))
      )
        return createGoogleVertexTransportStreamFn();
      if (model.api === "google-generative-ai") return createGoogleGenerativeAiTransportStreamFn();
    },
    ...GOOGLE_GEMINI_PROVIDER_HOOKS,
    resolveReasoningOutputMode: resolveGoogleReasoningOutputMode,
    isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId),
  };
}
function registerGoogleProvider(api) {
  api.registerProvider(buildGoogleProvider());
}
//#endregion
export { registerGoogleProvider as n, buildGoogleProvider as t };
