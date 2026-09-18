import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-CXfFv7q7.js";
import {
  i as normalizeClawRouterRootUrl,
  n as normalizeClawRouterApiBaseUrl,
  r as normalizeClawRouterResolvedModel,
  t as buildClawRouterProviderConfig,
} from "../../provider-catalog-DLyVBiDu.js";
import "../../provider-auth-api-key-BYlVrz-G.js";
import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-CYlCpWlu.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CLA-JkCS.js";
import { t as wrapClawRouterProviderStream } from "../../stream-j2VE7kLN.js";
import { t as fetchClawRouterUsage } from "../../usage-BKazkb8q.js";
//#region extensions/clawrouter/index.ts
const PROVIDER_ID = "clawrouter";
const ENV_VAR = "CLAWROUTER_API_KEY";
const openAiReplay = buildProviderReplayFamilyHooks({
  family: "openai-compatible",
  dropReasoningFromHistory: false,
});
const anthropicReplay = buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" });
const googleReplay = buildProviderReplayFamilyHooks({ family: "google-gemini" });
const openAiTools = buildProviderToolCompatFamilyHooks("openai");
const deepSeekTools = buildProviderToolCompatFamilyHooks("deepseek");
const geminiTools = buildProviderToolCompatFamilyHooks("gemini");
function buildApiKeyAuth() {
  return createProviderApiKeyAuthMethod({
    providerId: PROVIDER_ID,
    methodId: "api-key",
    label: "ClawRouter proxy key",
    hint: "Credential-scoped access to approved models and budgets",
    optionKey: "clawrouterApiKey",
    flagName: "--clawrouter-api-key",
    envVar: ENV_VAR,
    promptMessage: "Enter ClawRouter proxy key",
    noteTitle: "ClawRouter",
    noteMessage: [
      "Use the proxy key issued by your ClawRouter administrator.",
      "OpenClaw discovers only the models granted to that key.",
    ].join("\n"),
    wizard: {
      choiceId: "clawrouter-api-key",
      choiceLabel: "ClawRouter proxy key",
      choiceHint: "Approved models through one managed key",
      groupId: PROVIDER_ID,
      groupLabel: "ClawRouter",
      groupHint: "Managed model access and quotas",
    },
  });
}
function configuredBaseUrl(config) {
  const value = config?.models?.providers?.[PROVIDER_ID]?.baseUrl;
  return typeof value === "string" ? value : void 0;
}
function dynamicModelScope(ctx) {
  return JSON.stringify([
    ctx.agentDir ?? "",
    ctx.workspaceDir ?? "",
    ctx.authProfileId ?? "",
    normalizeClawRouterRootUrl(ctx.providerConfig?.baseUrl ?? configuredBaseUrl(ctx.config)),
  ]);
}
function buildRuntimeModels(providerConfig) {
  const models = /* @__PURE__ */ new Map();
  for (const model of providerConfig.models) {
    const api = model.api ?? providerConfig.api;
    const baseUrl = model.baseUrl ?? providerConfig.baseUrl;
    if (!api || !baseUrl) continue;
    models.set(model.id, {
      ...model,
      api,
      baseUrl,
      provider: PROVIDER_ID,
      input: model.input.filter((entry) => entry === "text" || entry === "image"),
    });
  }
  return models;
}
function resolveToolFamily(modelId) {
  const normalized = modelId.toLowerCase();
  if (normalized.startsWith("deepseek/")) return deepSeekTools;
  if (normalized.startsWith("google/")) return geminiTools;
  return openAiTools;
}
var clawrouter_default = definePluginEntry({
  id: PROVIDER_ID,
  name: "ClawRouter",
  description: "Managed multi-provider model routing and quotas",
  register(api) {
    const dynamicModels = /* @__PURE__ */ new Map();
    api.registerProvider({
      id: PROVIDER_ID,
      label: "ClawRouter",
      docsPath: "/providers/clawrouter",
      envVars: [ENV_VAR],
      auth: [buildApiKeyAuth()],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const auth = ctx.resolveProviderAuth(PROVIDER_ID);
          let discoveryApiKey = auth.discoveryApiKey;
          if (!discoveryApiKey)
            try {
              const { resolveApiKeyForProvider } =
                await import("../../plugin-sdk/provider-auth-runtime.js");
              discoveryApiKey = (
                await resolveApiKeyForProvider({
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
                })
              )?.apiKey;
            } catch {
              return null;
            }
          const apiKey = auth.apiKey ?? discoveryApiKey;
          if (!apiKey || !discoveryApiKey) return null;
          return {
            provider: await buildClawRouterProviderConfig({
              apiKey,
              discoveryApiKey,
              baseUrl: configuredBaseUrl(ctx.config),
            }),
          };
        },
      },
      resolveDynamicModel: (ctx) => dynamicModels.get(dynamicModelScope(ctx))?.get(ctx.modelId),
      prepareDynamicModel: async (ctx) => {
        const scope = dynamicModelScope(ctx);
        dynamicModels.delete(scope);
        const { resolveApiKeyForProvider } =
          await import("../../plugin-sdk/provider-auth-runtime.js");
        const apiKey = (
          await resolveApiKeyForProvider({
            provider: PROVIDER_ID,
            cfg: ctx.config,
            ...(ctx.agentDir ? { agentDir: ctx.agentDir } : {}),
            ...(ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {}),
            ...(ctx.authProfileId
              ? {
                  profileId: ctx.authProfileId,
                  lockedProfile: true,
                }
              : {}),
          })
        )?.apiKey;
        if (!apiKey) return;
        const providerConfig = await buildClawRouterProviderConfig({
          apiKey,
          discoveryApiKey: apiKey,
          baseUrl: ctx.providerConfig?.baseUrl ?? configuredBaseUrl(ctx.config),
        });
        dynamicModels.set(scope, buildRuntimeModels(providerConfig));
      },
      normalizeConfig: ({ providerConfig }) => {
        const baseUrl = normalizeClawRouterApiBaseUrl(providerConfig.baseUrl);
        return baseUrl !== providerConfig.baseUrl
          ? {
              ...providerConfig,
              baseUrl,
            }
          : void 0;
      },
      normalizeResolvedModel: ({ model }) => normalizeClawRouterResolvedModel(model),
      wrapSimpleCompletionStreamFn: wrapClawRouterProviderStream,
      wrapStreamFn: wrapClawRouterProviderStream,
      buildReplayPolicy: (ctx) => {
        if (ctx.modelApi === "anthropic-messages") return anthropicReplay.buildReplayPolicy?.(ctx);
        if (ctx.modelApi === "google-generative-ai") return googleReplay.buildReplayPolicy?.(ctx);
        return openAiReplay.buildReplayPolicy?.(ctx);
      },
      sanitizeReplayHistory: (ctx) =>
        ctx.modelApi === "google-generative-ai"
          ? googleReplay.sanitizeReplayHistory?.(ctx)
          : void 0,
      resolveReasoningOutputMode: (ctx) =>
        ctx.modelApi === "google-generative-ai"
          ? googleReplay.resolveReasoningOutputMode?.(ctx)
          : void 0,
      normalizeToolSchemas: (ctx) => resolveToolFamily(ctx.modelId ?? "").normalizeToolSchemas(ctx),
      inspectToolSchemas: (ctx) => resolveToolFamily(ctx.modelId ?? "").inspectToolSchemas(ctx),
      isModernModelRef: () => true,
      resolveUsageAuth: async (ctx) => {
        const apiKey = ctx.resolveApiKeyFromConfigAndStore({ envDirect: [ctx.env[ENV_VAR]] });
        return apiKey ? { token: apiKey } : null;
      },
      fetchUsageSnapshot: async (ctx) =>
        await fetchClawRouterUsage({
          token: ctx.token,
          baseUrl: configuredBaseUrl(ctx.config),
          timeoutMs: ctx.timeoutMs,
        }),
    });
  },
});
//#endregion
export { clawrouter_default as default };
