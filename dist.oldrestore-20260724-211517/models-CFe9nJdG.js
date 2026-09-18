import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#endregion
//#region extensions/meta/models.ts
/**
 * Meta model catalog helpers derived from the plugin manifest.
 */
const META_MANIFEST_CATALOG = {
  providers: {
    meta: {
      baseUrl: "https://api.meta.ai/v1",
      api: "openai-responses",
      models: [
        {
          id: "muse-spark-1.1",
          name: "Muse Spark 1.1",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 1048576,
          maxTokens: 131072,
          thinkingLevelMap: {
            off: "minimal",
            minimal: "minimal",
            low: "low",
            medium: "medium",
            high: "high",
            xhigh: "xhigh",
          },
          compat: {
            supportsTools: true,
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["minimal", "low", "medium", "high", "xhigh"],
          },
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      ],
    },
  },
  discovery: { meta: "static" },
}.providers["meta"];
/** Base URL for Meta OpenAI-compatible inference. */
const META_BASE_URL = META_MANIFEST_CATALOG.baseUrl;
/** Meta model catalog entries from the plugin manifest. */
const META_MODEL_CATALOG = META_MANIFEST_CATALOG.models;
/** Builds normalized Meta catalog model definitions. */
function buildMetaCatalogModels() {
  return buildManifestModelProviderConfig({
    providerId: "meta",
    catalog: META_MANIFEST_CATALOG,
  }).models;
}
/** Builds one normalized Meta model definition from a manifest entry. */
function buildMetaModelDefinition(model) {
  return expectDefined(
    buildManifestModelProviderConfig({
      providerId: "meta",
      catalog: {
        ...META_MANIFEST_CATALOG,
        models: [model],
      },
    }).models.at(0),
    "normalized Meta manifest model",
  );
}
//#endregion
export {
  buildMetaModelDefinition as i,
  META_MODEL_CATALOG as n,
  buildMetaCatalogModels as r,
  META_BASE_URL as t,
};
