import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-CXfFv7q7.js";
import { t as BYTEPLUS_PROVIDER_CATALOG_ENTRIES } from "../../provider-catalog-DZNg4BDC.js";
import "../../provider-auth-api-key-BYlVrz-G.js";
import { m as ensureModelAllowlistEntry } from "../../provider-onboard-CvQgbxgZ.js";
import { t as buildBytePlusVideoGenerationProvider } from "../../video-generation-provider-DJPMUa3J.js";
//#region extensions/byteplus/index.ts
/**
 * BytePlus provider plugin entrypoint for model and video generation providers.
 */
const PROVIDER_ID = "byteplus";
const BYTEPLUS_DEFAULT_MODEL_REF = "byteplus-plan/ark-code-latest";
var byteplus_default = definePluginEntry({
  id: PROVIDER_ID,
  name: "BytePlus Provider",
  description: "Bundled BytePlus provider plugin",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "BytePlus",
      docsPath: "/concepts/model-providers#byteplus-international",
      envVars: ["BYTEPLUS_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "BytePlus API key",
          hint: "API key",
          optionKey: "byteplusApiKey",
          flagName: "--byteplus-api-key",
          envVar: "BYTEPLUS_API_KEY",
          promptMessage: "Enter BytePlus API key",
          defaultModel: BYTEPLUS_DEFAULT_MODEL_REF,
          expectedProviders: ["byteplus"],
          applyConfig: (cfg) =>
            ensureModelAllowlistEntry({
              cfg,
              modelRef: BYTEPLUS_DEFAULT_MODEL_REF,
            }),
          wizard: {
            choiceId: "byteplus-api-key",
            choiceLabel: "BytePlus API key",
            groupId: "byteplus",
            groupLabel: "BytePlus",
            groupHint: "API key",
          },
        }),
      ],
      catalog: {
        order: "paired",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) return null;
          return {
            providers: Object.fromEntries(
              BYTEPLUS_PROVIDER_CATALOG_ENTRIES.map(({ id, buildProvider }) => [
                id,
                {
                  ...buildProvider(),
                  apiKey,
                },
              ]),
            ),
          };
        },
      },
      augmentModelCatalog: () =>
        BYTEPLUS_PROVIDER_CATALOG_ENTRIES.flatMap(({ id: provider, models }) =>
          models.map((entry) => ({
            provider,
            id: entry.id,
            name: entry.name,
            reasoning: entry.reasoning,
            input: [...entry.input],
            contextWindow: entry.contextWindow,
          })),
        ),
    });
    api.registerVideoGenerationProvider(buildBytePlusVideoGenerationProvider());
  },
});
//#endregion
export { byteplus_default as default };
