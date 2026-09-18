import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-DoJxaJiY.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./diagnostic-runtime-CpZ_ot5_.js";
import {
  i as resolveProviderWebSearchPluginConfig,
  r as mergeScopedSearchConfig,
} from "./web-search-provider-config-CZdRfw7j.js";
import { t as buildBraveWebSearchProviderBase } from "./web-search-shared-D7nv41d0.js";
//#region extensions/brave/src/brave-web-search-provider.ts
/**
 * Brave web-search provider factory. It builds the agent tool definition and
 * lazy-loads HTTP execution only when a search is run.
 */
const loadBraveWebSearchRuntime = createLazyRuntimeModule(
  () => import("./brave-web-search-provider.runtime.js"),
);
const BraveSearchSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Search query string.",
    },
    count: {
      type: "integer",
      description: "Number of results to return (1-10).",
      minimum: 1,
      maximum: 10,
    },
    country: {
      type: "string",
      description:
        "2-letter country code for region-specific results (e.g., 'DE', 'US', 'ALL'). Default: 'US'.",
    },
    language: {
      type: "string",
      description: "ISO 639-1 language code for results (e.g., 'en', 'de', 'fr').",
    },
    freshness: {
      type: "string",
      description: "Filter by time: 'day' (24h), 'week', 'month', or 'year'.",
    },
    date_after: {
      type: "string",
      description: "Only results published after this date (YYYY-MM-DD).",
    },
    date_before: {
      type: "string",
      description: "Only results published before this date (YYYY-MM-DD).",
    },
    search_lang: {
      type: "string",
      description:
        "Brave language code for search results (e.g., 'en', 'de', 'en-gb', 'zh-hans', 'zh-hant', 'pt-br').",
    },
    ui_lang: {
      type: "string",
      description:
        "Locale code for UI elements in language-region format (e.g., 'en-US', 'de-DE', 'fr-FR', 'tr-TR'). Must include region subtag.",
    },
  },
};
function resolveBraveMode(searchConfig) {
  return (isRecord(searchConfig?.brave) ? searchConfig.brave : void 0)?.mode === "llm-context"
    ? "llm-context"
    : "web";
}
function createBraveToolDefinition(searchConfig, config) {
  const braveMode = resolveBraveMode(searchConfig);
  const diagnosticsEnabled = isDiagnosticFlagEnabled("brave.http", config);
  return {
    description:
      braveMode === "llm-context"
        ? "Search the web using Brave Search LLM Context API. Returns pre-extracted page content (text chunks, tables, code blocks) optimized for LLM grounding."
        : "Search the web using Brave Search API. Supports region-specific and localized search via country and language parameters. Returns titles, URLs, and snippets for fast research.",
    parameters: BraveSearchSchema,
    execute: async (args) => {
      const { executeBraveSearch } = await loadBraveWebSearchRuntime();
      return await executeBraveSearch(args, searchConfig, { diagnosticsEnabled });
    },
  };
}
/** Create the runtime Brave Search provider descriptor. */
function createBraveWebSearchProvider() {
  return {
    ...buildBraveWebSearchProviderBase(),
    createTool: (ctx) =>
      createBraveToolDefinition(
        mergeScopedSearchConfig(
          ctx.searchConfig,
          "brave",
          resolveProviderWebSearchPluginConfig(ctx.config, "brave"),
          { mirrorApiKeyToTopLevel: true },
        ),
        ctx.config,
      ),
  };
}
//#endregion
export { createBraveWebSearchProvider as t };
