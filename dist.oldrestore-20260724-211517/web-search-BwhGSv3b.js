import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as buildXaiWebSearchProviderBase } from "./web-search-provider-shared-CgD45KIN.js";
//#region extensions/xai/web-search.ts
const loadXaiWebSearchProviderRuntime = createLazyRuntimeModule(
  () => import("./web-search-provider.runtime-C59sO5_y.js"),
);
const GenericXaiSearchSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Search query string.",
    },
    count: {
      type: "number",
      description: "Number of results to return (1-10).",
      minimum: 1,
      maximum: 10,
    },
  },
  additionalProperties: false,
};
async function runXaiSearchProviderSetup(ctx) {
  return await (await loadXaiWebSearchProviderRuntime()).runXaiSearchProviderSetup(ctx);
}
function createXaiWebSearchProvider() {
  return {
    ...buildXaiWebSearchProviderBase(),
    runSetup: runXaiSearchProviderSetup,
    createTool: (ctx) => ({
      description:
        "Search the web using xAI Grok. Returns AI-synthesized answers with citations from real-time web search.",
      parameters: GenericXaiSearchSchema,
      execute: async (args) => {
        const { executeXaiWebSearchProviderTool } = await loadXaiWebSearchProviderRuntime();
        return await executeXaiWebSearchProviderTool(ctx, args);
      },
    }),
  };
}
//#endregion
export { createXaiWebSearchProvider as t };
