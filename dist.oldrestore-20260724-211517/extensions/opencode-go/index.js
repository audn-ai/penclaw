import { t as opencodeGoMediaUnderstandingProvider } from "../../media-understanding-provider-DgxnsdFU.js";
import {
  n as applyOpencodeGoConfig,
  t as OPENCODE_GO_DEFAULT_MODEL_REF,
} from "../../onboard-DbfKg6xk.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import "../../provider-auth-api-key-BYlVrz-G.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-CXfFv7q7.js";
import "../../api-DakPAnDk.js";
import {
  a as normalizeOpencodeGoBaseUrl,
  i as listOpencodeGoModelCatalogEntries,
  n as buildStaticOpencodeGoProviderConfig,
  o as normalizeOpencodeGoResolvedModel,
  s as resolveOpencodeGoModel,
  t as buildOpencodeGoLiveProviderConfig,
} from "../../provider-catalog-BeaYXsg4.js";
import { i as PASSTHROUGH_GEMINI_REPLAY_HOOKS } from "../../provider-model-shared-CYlCpWlu.js";
import { t as createOpencodeGoWrapper } from "../../stream-BtlOhv4d.js";
//#region extensions/opencode-go/index.ts
const PROVIDER_ID = "opencode-go";
const OPENCODE_SHARED_PROFILE_IDS = ["opencode:default", "opencode-go:default"];
const OPENCODE_SHARED_HINT = "Shared API key for Zen + Go catalogs";
const OPENCODE_SHARED_WIZARD_GROUP = {
  groupId: "opencode",
  groupLabel: "OpenCode",
  groupHint: OPENCODE_SHARED_HINT,
};
function hasCatalogAuth(auth) {
  return Boolean(auth.apiKey || auth.discoveryApiKey);
}
function resolveOpencodeGoCatalogAuth(resolveProviderApiKey) {
  const opencodeGoAuth = resolveProviderApiKey(PROVIDER_ID);
  if (hasCatalogAuth(opencodeGoAuth)) return opencodeGoAuth;
  const sharedOpencodeAuth = resolveProviderApiKey("opencode");
  return hasCatalogAuth(sharedOpencodeAuth) ? sharedOpencodeAuth : void 0;
}
var opencode_go_default = definePluginEntry({
  id: PROVIDER_ID,
  name: "OpenCode Go Provider",
  description: "Bundled OpenCode Go provider plugin",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "OpenCode Go",
      docsPath: "/providers/models",
      envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "OpenCode Go catalog",
          hint: OPENCODE_SHARED_HINT,
          optionKey: "opencodeGoApiKey",
          flagName: "--opencode-go-api-key",
          envVar: "OPENCODE_API_KEY",
          promptMessage: "Enter OpenCode API key",
          profileIds: [...OPENCODE_SHARED_PROFILE_IDS],
          defaultModel: OPENCODE_GO_DEFAULT_MODEL_REF,
          applyConfig: (cfg) => applyOpencodeGoConfig(cfg),
          expectedProviders: ["opencode", "opencode-go"],
          noteMessage: [
            "OpenCode uses one API key across the Zen and Go catalogs.",
            "Go focuses on Kimi, GLM, and MiniMax coding models.",
            "Get your API key at: https://opencode.ai/auth",
          ].join("\n"),
          noteTitle: "OpenCode",
          wizard: {
            choiceId: "opencode-go",
            choiceLabel: "OpenCode Go catalog",
            ...OPENCODE_SHARED_WIZARD_GROUP,
          },
        }),
      ],
      normalizeConfig: ({ providerConfig }) => {
        const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
          api: providerConfig.api,
          baseUrl: providerConfig.baseUrl,
        });
        return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl
          ? {
              ...providerConfig,
              baseUrl: normalizedBaseUrl,
            }
          : void 0;
      },
      normalizeResolvedModel: ({ model }) => {
        const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
          api: model.api,
          baseUrl: model.baseUrl,
        });
        const baseUrlNormalized =
          normalizedBaseUrl && normalizedBaseUrl !== model.baseUrl
            ? {
                ...model,
                baseUrl: normalizedBaseUrl,
              }
            : model;
        const modelNormalized = normalizeOpencodeGoResolvedModel(baseUrlNormalized);
        if (modelNormalized) return modelNormalized;
        return baseUrlNormalized !== model ? baseUrlNormalized : void 0;
      },
      normalizeTransport: ({ api: apiLocal, baseUrl }) => {
        const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
          api: apiLocal,
          baseUrl,
        });
        return normalizedBaseUrl && normalizedBaseUrl !== baseUrl
          ? {
              api: apiLocal,
              baseUrl: normalizedBaseUrl,
            }
          : void 0;
      },
      resolveDynamicModel: ({ modelId }) => resolveOpencodeGoModel(modelId),
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const auth = resolveOpencodeGoCatalogAuth(ctx.resolveProviderApiKey);
          if (!auth) return null;
          if (!auth.discoveryApiKey)
            return { provider: buildStaticOpencodeGoProviderConfig(auth.apiKey) };
          return {
            provider: await buildOpencodeGoLiveProviderConfig({
              apiKey: auth.apiKey ?? auth.discoveryApiKey,
              discoveryApiKey: auth.discoveryApiKey,
            }),
          };
        },
      },
      augmentModelCatalog: () => listOpencodeGoModelCatalogEntries(),
      ...PASSTHROUGH_GEMINI_REPLAY_HOOKS,
      wrapStreamFn: (ctx) => createOpencodeGoWrapper(ctx.streamFn, ctx.thinkingLevel),
      isModernModelRef: () => true,
    });
    api.registerMediaUnderstandingProvider(opencodeGoMediaUnderstandingProvider);
  },
});
//#endregion
export { opencode_go_default as default };
