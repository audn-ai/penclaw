import { h as readPositiveIntegerParam, y as readStringParam } from "./common-DyDSUect.js";
import { o as wrapWebContent } from "./external-content-rRQGoatE.js";
import {
  n as resolveGeminiConfig,
  r as resolveGeminiModel,
  t as resolveGeminiBaseUrl,
} from "./gemini-web-search-provider.shared-Cc9GJw8_.js";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-B3-rCSAh.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  o as createProviderHttpError,
  p as readProviderJsonObjectResponse,
  u as formatProviderHttpErrorMessage,
} from "./provider-http-errors-DLMRBkZU.js";
import "./provider-http-BDIltggC.js";
import { r as resolveCitationRedirectUrl } from "./provider-web-search-Bpbir19i.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  S as writeCachedSearchPayload,
  _ as resolveSearchTimeoutSeconds,
  a as buildUnsupportedSearchFilterResponse,
  f as readCachedSearchPayload,
  g as resolveSearchCount,
  h as resolveSearchCacheTtlMs,
  i as buildSearchCacheKey,
  m as readProviderEnvValue,
  p as readConfiguredSecretString,
  u as parseWebSearchTimeFilters,
  x as withTrustedWebSearchEndpoint,
} from "./web-search-provider-common-B8EoIruV.js";
//#region extensions/google/src/gemini-web-search-provider.runtime.ts
function throwMalformedGeminiResponse() {
  throw new Error("Gemini API error: malformed JSON response");
}
const GEMINI_FRESHNESS_DAYS = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};
const GEMINI_DAY_FRESHNESS_HINT = "Prioritize web sources published in the last 24 hours.";
function toGeminiTimeRangeTimestamp(date) {
  return date.toISOString().replace(/\.\d+Z$/, "Z");
}
function isoDateStart(value) {
  return `${value}T00:00:00Z`;
}
function isoDateExclusiveEnd(value) {
  const end = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  return toGeminiTimeRangeTimestamp(end);
}
function freshnessStartTime(freshness, now) {
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - GEMINI_FRESHNESS_DAYS[freshness]);
  return toGeminiTimeRangeTimestamp(start);
}
function queryWithSoftFreshness(query, freshness) {
  if (freshness !== "day") return query;
  return `${query}\n\nSearch recency instruction: ${GEMINI_DAY_FRESHNESS_HINT} If no matching recent sources are available, state that limitation and use the most relevant available sources.`;
}
function resolveGeminiTimeRangeFilter(args, now = /* @__PURE__ */ new Date()) {
  const rawFreshness = readStringParam(args, "freshness");
  const parsedTimeFilters = parseWebSearchTimeFilters({
    rawDateAfter: readStringParam(args, "date_after"),
    rawDateBefore: readStringParam(args, "date_before"),
    rawFreshness,
    freshnessProvider: "perplexity",
    invalidFreshnessMessage:
      "freshness must be day, week, month, year, or the shortcuts pd, pw, pm, py.",
    invalidDateAfterMessage: "date_after must be YYYY-MM-DD format.",
    invalidDateBeforeMessage: "date_before must be YYYY-MM-DD format.",
    invalidDateRangeMessage: "date_after must be before date_before.",
  });
  if ("error" in parsedTimeFilters) return parsedTimeFilters;
  const { freshness, dateAfter, dateBefore } = parsedTimeFilters;
  if (freshness) {
    if (freshness === "day") return { freshness };
    return {
      timeRangeFilter: {
        startTime: freshnessStartTime(freshness, now),
        endTime: toGeminiTimeRangeTimestamp(now),
      },
    };
  }
  if (!dateAfter && !dateBefore) return {};
  return {
    timeRangeFilter: {
      startTime: dateAfter ? isoDateStart(dateAfter) : "1970-01-01T00:00:00Z",
      endTime: dateBefore ? isoDateExclusiveEnd(dateBefore) : toGeminiTimeRangeTimestamp(now),
    },
  };
}
function resolveGeminiRuntimeApiKey(gemini) {
  return (
    readConfiguredSecretString(gemini?.apiKey, "tools.web.search.gemini.apiKey") ??
    readProviderEnvValue(["GEMINI_API_KEY"]) ??
    readConfiguredSecretString(gemini?.providerApiKey, "models.providers.google.apiKey")
  );
}
async function runGeminiSearch(params) {
  const endpoint = `${params.baseUrl}/models/${params.model}:generateContent`;
  const googleSearch =
    params.timeRangeFilter === void 0 ? {} : { timeRangeFilter: params.timeRangeFilter };
  return withTrustedWebSearchEndpoint(
    {
      url: endpoint,
      timeoutSeconds: params.timeoutSeconds,
      signal: params.signal,
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": params.apiKey,
          ...resolveGoogleApiClientHeaders({
            baseUrl: params.baseUrl,
            api: "google-generative-ai",
            capability: "other",
            transport: "http",
          }),
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: params.query }] }],
          tools: [{ google_search: googleSearch }],
        }),
      },
    },
    async (res) => {
      if (!res.ok) {
        const error = await createProviderHttpError(res, "Gemini API error");
        throw new Error(error.message.replace(/key=[^&\s]+/giu, "key=***"));
      }
      const data = await readProviderJsonObjectResponse(res, "Gemini API error");
      if (data.error) {
        const rawMessage = data.error.message || data.error.status || "unknown";
        throw new Error(
          formatProviderHttpErrorMessage({
            label: "Gemini API error",
            status: data.error.code ?? 0,
            detail: rawMessage.replace(/key=[^&\s]+/giu, "key=***"),
          }),
        );
      }
      if (!Array.isArray(data.candidates)) throwMalformedGeminiResponse();
      const candidate = data.candidates[0];
      if (!isRecord(candidate) || !isRecord(candidate.content)) throwMalformedGeminiResponse();
      const parts = candidate.content.parts;
      if (!Array.isArray(parts)) throwMalformedGeminiResponse();
      const content = parts
        .map((part) => (isRecord(part) && typeof part.text === "string" ? part.text : void 0))
        .filter((text) => Boolean(text))
        .join("\n");
      if (!content) throwMalformedGeminiResponse();
      const groundingMetadata = candidate.groundingMetadata;
      const groundingChunks =
        groundingMetadata === void 0
          ? []
          : isRecord(groundingMetadata)
            ? groundingMetadata.groundingChunks === void 0
              ? []
              : Array.isArray(groundingMetadata.groundingChunks)
                ? groundingMetadata.groundingChunks
                : void 0
            : void 0;
      if (!groundingChunks) throwMalformedGeminiResponse();
      const rawCitations = groundingChunks.flatMap((chunk) => {
        if (!isRecord(chunk) || !isRecord(chunk.web) || typeof chunk.web.uri !== "string")
          return [];
        return [
          {
            url: chunk.web.uri,
            title: typeof chunk.web.title === "string" ? chunk.web.title : void 0,
          },
        ];
      });
      const citations = [];
      for (let index = 0; index < rawCitations.length; index += 10) {
        const batch = rawCitations.slice(index, index + 10);
        const resolved = await Promise.all(
          batch.map(async (citation) =>
            Object.assign({}, citation, { url: await resolveCitationRedirectUrl(citation.url) }),
          ),
        );
        citations.push(...resolved);
      }
      return {
        content,
        citations,
      };
    },
  );
}
async function executeGeminiSearch(args, searchConfig, context) {
  const unsupportedResponse = buildUnsupportedSearchFilterResponse(
    {
      country: args.country,
      language: args.language,
    },
    "gemini",
  );
  if (unsupportedResponse) return unsupportedResponse;
  const timeRange = resolveGeminiTimeRangeFilter(args);
  if ("error" in timeRange) return timeRange;
  const geminiConfig = resolveGeminiConfig(searchConfig);
  const apiKey = resolveGeminiRuntimeApiKey(geminiConfig);
  if (!apiKey)
    return {
      error: "missing_gemini_api_key",
      message:
        "web_search (gemini) needs an API key. Set GEMINI_API_KEY in the Gateway environment, configure plugins.entries.google.config.webSearch.apiKey, or reuse models.providers.google.apiKey. If you do not want to configure a search API key, use web_fetch for a specific URL or the browser tool for interactive pages.",
      docs: "https://docs.openclaw.ai/tools/web",
    };
  const query = readStringParam(args, "query", { required: true });
  const count =
    readPositiveIntegerParam(args, "count", {
      max: 10,
      message: `count must be an integer from 1 to 10.`,
    }) ??
    searchConfig?.maxResults ??
    void 0;
  const model = resolveGeminiModel(geminiConfig);
  const baseUrl = resolveGeminiBaseUrl(geminiConfig);
  const cacheKey = buildSearchCacheKey([
    "gemini",
    query,
    resolveSearchCount(count, 5),
    baseUrl,
    model,
    timeRange.freshness,
    timeRange.timeRangeFilter?.startTime,
    timeRange.timeRangeFilter?.endTime,
  ]);
  const cached = readCachedSearchPayload(cacheKey);
  if (cached) return cached;
  const start = Date.now();
  const result = await runGeminiSearch({
    query: queryWithSoftFreshness(query, timeRange.freshness),
    apiKey,
    baseUrl,
    model,
    timeoutSeconds: resolveSearchTimeoutSeconds(searchConfig),
    signal: context?.signal,
    timeRangeFilter: timeRange.timeRangeFilter,
  });
  const payload = {
    query,
    provider: "gemini",
    model,
    tookMs: Date.now() - start,
    externalContent: {
      untrusted: true,
      source: "web_search",
      provider: "gemini",
      wrapped: true,
    },
    content: wrapWebContent(result.content),
    citations: result.citations,
  };
  writeCachedSearchPayload(cacheKey, payload, resolveSearchCacheTtlMs(searchConfig));
  return payload;
}
//#endregion
export { executeGeminiSearch };
