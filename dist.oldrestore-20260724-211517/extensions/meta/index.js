import { n as applyMetaConfig, t as META_DEFAULT_MODEL_REF } from "../../onboard-CFRv4mjU.js";
import { t as buildMetaProvider } from "../../provider-catalog-D41OXX3E.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CHlACr9J.js";
import { r as OPENAI_COMPATIBLE_REPLAY_HOOKS } from "../../provider-model-shared-CYlCpWlu.js";
import { t as wrapMetaProviderStream } from "../../stream-BRKwOEjx.js";
import { t as resolveMetaThinkingProfile } from "../../thinking-B5r9ylsm.js";
var meta_default = defineSingleProviderPluginEntry({
  id: "meta",
  name: "Meta Provider",
  description: "Bundled Meta provider plugin",
  provider: {
    label: "Meta",
    docsPath: "/providers/meta",
    auth: [
      {
        methodId: "api-key",
        label: "Meta API key",
        hint: "Meta (Responses API)",
        optionKey: "metaApiKey",
        flagName: "--meta-api-key",
        envVar: "MODEL_API_KEY",
        promptMessage: "Enter Meta API key",
        defaultModel: META_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyMetaConfig(cfg),
        noteMessage: ["Meta provides Responses API inference."].join("\n"),
        noteTitle: "Meta",
        wizard: {
          groupLabel: "Meta",
          groupHint: "Meta (Responses API)",
        },
      },
    ],
    catalog: {
      buildProvider: buildMetaProvider,
      buildStaticProvider: buildMetaProvider,
    },
    ...OPENAI_COMPATIBLE_REPLAY_HOOKS,
    wrapStreamFn: wrapMetaProviderStream,
    resolveThinkingProfile: ({ modelId }) => resolveMetaThinkingProfile(modelId),
  },
});
//#endregion
export { meta_default as default };
