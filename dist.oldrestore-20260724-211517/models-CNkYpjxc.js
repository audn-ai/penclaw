import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/byteplus/openclaw.plugin.json
var modelCatalog = {
  providers: {
    byteplus: {
      baseUrl: "https://ark.ap-southeast.bytepluses.com/api/v3",
      api: "openai-completions",
      models: [
        {
          id: "seed-1-8-251228",
          name: "Seed 1.8",
          input: ["text", "image"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "kimi-k2-5-260127",
          name: "Kimi K2.5",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 256e3,
          maxTokens: 32768,
          cost: {
            input: 0.6,
            output: 2.5,
            cacheRead: 0.12,
            cacheWrite: 0,
          },
        },
        {
          id: "glm-4-7-251222",
          name: "GLM 4.7",
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      ],
    },
    "byteplus-plan": {
      baseUrl: "https://ark.ap-southeast.bytepluses.com/api/coding/v3",
      api: "openai-completions",
      models: [
        {
          id: "ark-code-latest",
          name: "Ark Coding Plan",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "doubao-seed-code",
          name: "Doubao Seed Code",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "glm-4.7",
          name: "GLM 4.7 Coding",
          input: ["text"],
          contextWindow: 2e5,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "kimi-k2-thinking",
          name: "Kimi K2 Thinking",
          reasoning: true,
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 32768,
          cost: {
            input: 0.6,
            output: 2.5,
            cacheRead: 0.12,
            cacheWrite: 0,
          },
        },
        {
          id: "kimi-k2.5",
          name: "Kimi K2.5 Coding",
          reasoning: true,
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 32768,
          cost: {
            input: 0.6,
            output: 2.5,
            cacheRead: 0.12,
            cacheWrite: 0,
          },
        },
      ],
    },
  },
  discovery: {
    byteplus: "static",
    "byteplus-plan": "static",
  },
};
//#endregion
//#region extensions/byteplus/models.ts
/**
 * BytePlus model catalog helpers derived from the plugin manifest.
 */
const BYTEPLUS_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "byteplus",
  catalog: modelCatalog.providers.byteplus,
});
const BYTEPLUS_CODING_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "byteplus-plan",
  catalog: modelCatalog.providers["byteplus-plan"],
});
/** Base URL for BytePlus chat/model APIs from the manifest catalog. */
const BYTEPLUS_BASE_URL = BYTEPLUS_MANIFEST_PROVIDER.baseUrl;
/** Base URL for BytePlus Plan coding APIs from the manifest catalog. */
const BYTEPLUS_CODING_BASE_URL = BYTEPLUS_CODING_MANIFEST_PROVIDER.baseUrl;
/** BytePlus general model catalog entries. */
const BYTEPLUS_MODEL_CATALOG = BYTEPLUS_MANIFEST_PROVIDER.models;
/** BytePlus coding/planning model catalog entries. */
const BYTEPLUS_CODING_MODEL_CATALOG = BYTEPLUS_CODING_MANIFEST_PROVIDER.models;
/** Clones one manifest model definition so callers can mutate safely. */
function buildBytePlusModelDefinition(entry) {
  return {
    ...entry,
    input: [...entry.input],
    cost: { ...entry.cost },
  };
}
//#endregion
export {
  buildBytePlusModelDefinition as a,
  BYTEPLUS_MODEL_CATALOG as i,
  BYTEPLUS_CODING_BASE_URL as n,
  modelCatalog as o,
  BYTEPLUS_CODING_MODEL_CATALOG as r,
  BYTEPLUS_BASE_URL as t,
};
