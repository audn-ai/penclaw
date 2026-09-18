import { n as NOVITA_DEFAULT_MODEL_REF } from "../../models-CwPImvVz.js";
import { t as buildNovitaProvider } from "../../provider-catalog-DhR6jsKe.js";
import { a as readConfiguredProviderCatalogEntries } from "../../provider-catalog-shared-CQScmZZs.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CHlACr9J.js";
import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-CYlCpWlu.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CLA-JkCS.js";
//#region extensions/novita/index.ts
const PROVIDER_ID = "novita";
var novita_default = defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "NovitaAI Provider",
  description: "Bundled NovitaAI provider plugin",
  provider: {
    label: "NovitaAI",
    docsPath: "/providers/novita",
    aliases: ["novita-ai", "novitaai"],
    envVars: ["NOVITA_API_KEY"],
    auth: [
      {
        methodId: "api-key",
        label: "NovitaAI API key",
        hint: "OpenAI-compatible NovitaAI endpoint",
        optionKey: "novitaApiKey",
        flagName: "--novita-api-key",
        envVar: "NOVITA_API_KEY",
        promptMessage: "Enter NovitaAI API key",
        defaultModel: NOVITA_DEFAULT_MODEL_REF,
        noteTitle: "NovitaAI",
        noteMessage: "Manage API keys at https://novita.ai/settings/key-management",
      },
    ],
    catalog: {
      buildProvider: buildNovitaProvider,
      buildStaticProvider: buildNovitaProvider,
      allowExplicitBaseUrl: true,
    },
    augmentModelCatalog: ({ config }) =>
      readConfiguredProviderCatalogEntries({
        config,
        providerId: PROVIDER_ID,
      }),
    ...buildProviderReplayFamilyHooks({
      family: "openai-compatible",
      dropReasoningFromHistory: false,
    }),
    ...buildProviderToolCompatFamilyHooks("openai"),
  },
});
//#endregion
export { novita_default as default };
