import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
import {
  a as readResponseText,
  c as resolveTimeoutSeconds,
  i as readCache,
  o as resolveCacheTtlMs,
  r as normalizeCacheKey,
  u as writeCache,
} from "./web-shared-C-2hVbyp.js";
//#region src/agents/tools/web-search-provider-common.ts
/**
 * Shared web-search provider helpers.
 *
 * Handles provider config, credential normalization, guarded endpoint calls, caching, and filters.
 */
const webGuardedFetchLoader = createLazyImportLoader(
  () => import("./web-guarded-fetch-DmGTiWEs.js"),
);
async function loadTrustedWebToolsEndpoint() {
  return (await webGuardedFetchLoader.load()).withTrustedWebToolsEndpoint;
}
async function loadSelfHostedWebToolsEndpoint() {
  return (await webGuardedFetchLoader.load()).withSelfHostedWebToolsEndpoint;
}
const DEFAULT_SEARCH_COUNT = 5;
const MAX_SEARCH_COUNT = 10;
const SEARCH_CACHE = /* @__PURE__ */ new Map();
function resolveSearchTimeoutSeconds(searchConfig) {
  return resolveTimeoutSeconds(searchConfig?.timeoutSeconds, 30);
}
function resolveSearchCacheTtlMs(searchConfig) {
  return resolveCacheTtlMs(searchConfig?.cacheTtlMinutes, 15);
}
function resolveSearchCount(value, fallback) {
  return Math.max(
    1,
    Math.min(
      10,
      Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback),
    ),
  );
}
function readConfiguredSecretString(value, path) {
  return (
    normalizeSecretInput(
      normalizeResolvedSecretInputString({
        value,
        path,
      }),
    ) || void 0
  );
}
function readProviderEnvValue(envVars) {
  for (const envVar of envVars) {
    const value = normalizeSecretInput(process.env[envVar]);
    if (value) return value;
  }
}
async function withTrustedWebSearchEndpoint(params, run) {
  return (await loadTrustedWebToolsEndpoint())(
    {
      url: params.url,
      init: params.init,
      timeoutSeconds: params.timeoutSeconds,
      signal: params.signal,
    },
    async ({ response }) => run(response),
  );
}
async function withSelfHostedWebSearchEndpoint(params, run) {
  return (await loadSelfHostedWebToolsEndpoint())(
    {
      url: params.url,
      init: params.init,
      timeoutSeconds: params.timeoutSeconds,
      signal: params.signal,
    },
    async ({ response }) => run(response),
  );
}
async function postTrustedWebToolsJson(params, parseResponse) {
  return (await loadTrustedWebToolsEndpoint())(
    {
      url: params.url,
      timeoutSeconds: params.timeoutSeconds,
      signal: params.signal,
      init: {
        method: "POST",
        headers: {
          ...params.extraHeaders,
          Accept: "application/json",
          Authorization: `Bearer ${params.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params.body),
      },
    },
    async ({ response }) => {
      if (!response.ok) {
        const detail = await readResponseText(response, { maxBytes: params.maxErrorBytes ?? 64e3 });
        throw new Error(
          `${params.errorLabel} API error (${response.status}): ${detail.text || response.statusText}`,
        );
      }
      return await parseResponse(response);
    },
  );
}
async function throwWebSearchApiError(res, providerLabel) {
  const detail = (await readResponseText(res, { maxBytes: 64e3 })).text;
  throw new Error(`${providerLabel} API error (${res.status}): ${detail || res.statusText}`);
}
function resolveSiteName(url) {
  if (!url) return;
  try {
    return new URL(url).hostname;
  } catch {
    return;
  }
}
const BRAVE_FRESHNESS_SHORTCUTS = /* @__PURE__ */ new Set(["pd", "pw", "pm", "py"]);
const BRAVE_FRESHNESS_RANGE = /^(\d{4}-\d{2}-\d{2})to(\d{4}-\d{2}-\d{2})$/;
const PERPLEXITY_RECENCY_VALUES = /* @__PURE__ */ new Set(["day", "week", "month", "year"]);
const FRESHNESS_TO_RECENCY = {
  pd: "day",
  pw: "week",
  pm: "month",
  py: "year",
};
const RECENCY_TO_FRESHNESS = {
  day: "pd",
  week: "pw",
  month: "pm",
  year: "py",
};
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PERPLEXITY_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
  if (year === void 0 || month === void 0 || day === void 0) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}
function isoToPerplexityDate(iso) {
  const match = iso.match(ISO_DATE_PATTERN);
  if (!match) return;
  const [, year, month, day] = match;
  if (year === void 0 || month === void 0 || day === void 0) return;
  return `${Number.parseInt(month, 10)}/${Number.parseInt(day, 10)}/${year}`;
}
/** Accepts ISO dates plus Perplexity `M/D/YYYY` dates and returns canonical ISO dates. */
function normalizeToIsoDate(value) {
  const trimmed = value.trim();
  if (ISO_DATE_PATTERN.test(trimmed)) return isValidIsoDate(trimmed) ? trimmed : void 0;
  const match = trimmed.match(PERPLEXITY_DATE_PATTERN);
  if (match) {
    const [, month, day, year] = match;
    if (year === void 0 || month === void 0 || day === void 0) return;
    const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    return isValidIsoDate(iso) ? iso : void 0;
  }
}
/** Parses optional date range filters and returns provider-facing validation errors. */
function parseIsoDateRange(params) {
  const docs = params.docs ?? "https://docs.openclaw.ai/tools/web";
  const dateAfter = params.rawDateAfter ? normalizeToIsoDate(params.rawDateAfter) : void 0;
  if (params.rawDateAfter && !dateAfter)
    return {
      error: "invalid_date",
      message: params.invalidDateAfterMessage,
      docs,
    };
  const dateBefore = params.rawDateBefore ? normalizeToIsoDate(params.rawDateBefore) : void 0;
  if (params.rawDateBefore && !dateBefore)
    return {
      error: "invalid_date",
      message: params.invalidDateBeforeMessage,
      docs,
    };
  if (dateAfter && dateBefore && dateAfter > dateBefore)
    return {
      error: "invalid_date_range",
      message: params.invalidDateRangeMessage,
      docs,
    };
  return {
    dateAfter,
    dateBefore,
  };
}
/** Converts shared freshness names into provider-specific Brave or Perplexity values. */
function normalizeFreshness(value, provider) {
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  if (BRAVE_FRESHNESS_SHORTCUTS.has(lower)) {
    const recency = FRESHNESS_TO_RECENCY[lower];
    return provider === "brave" ? lower : recency;
  }
  if (PERPLEXITY_RECENCY_VALUES.has(lower)) {
    const freshness = RECENCY_TO_FRESHNESS[lower];
    return provider === "perplexity" ? lower : freshness;
  }
  if (provider === "brave") {
    const match = trimmed.match(BRAVE_FRESHNESS_RANGE);
    if (match) {
      const [, start, end] = match;
      if (start && end && isValidIsoDate(start) && isValidIsoDate(end) && start <= end)
        return `${start}to${end}`;
    }
  }
}
/** Parses freshness/date filters while rejecting combinations providers cannot express safely. */
function parseWebSearchTimeFilters(params) {
  const docs = params.docs ?? "https://docs.openclaw.ai/tools/web";
  const freshness = params.rawFreshness
    ? normalizeFreshness(params.rawFreshness, params.freshnessProvider)
    : void 0;
  if (params.rawFreshness && !freshness)
    return {
      error: "invalid_freshness",
      message: params.invalidFreshnessMessage,
      docs,
    };
  if (params.rawFreshness && (params.rawDateAfter || params.rawDateBefore))
    return {
      error: "conflicting_time_filters",
      message:
        params.conflictingTimeFiltersMessage ??
        "freshness and date_after/date_before cannot be used together. Use either freshness (day/week/month/year) or a date range (date_after/date_before), not both.",
      docs,
    };
  const parsedDateRange = parseIsoDateRange({
    rawDateAfter: params.rawDateAfter,
    rawDateBefore: params.rawDateBefore,
    invalidDateAfterMessage: params.invalidDateAfterMessage,
    invalidDateBeforeMessage: params.invalidDateBeforeMessage,
    invalidDateRangeMessage: params.invalidDateRangeMessage,
    docs,
  });
  if ("error" in parsedDateRange) return parsedDateRange;
  return freshness
    ? {
        freshness,
        ...parsedDateRange,
      }
    : parsedDateRange;
}
/** Reads a search cache payload and marks it so provider responses can disclose cache hits. */
function readCachedSearchPayload(cacheKey) {
  const cached = readCache(SEARCH_CACHE, cacheKey);
  return cached
    ? {
        ...cached.value,
        cached: true,
      }
    : void 0;
}
/** Builds a normalized cache key from provider-specific search dimensions. */
function buildSearchCacheKey(parts) {
  return normalizeCacheKey(
    parts.map((part) => (part === void 0 ? "default" : String(part))).join(":"),
  );
}
/** Stores one provider search payload with its provider-selected TTL. */
function writeCachedSearchPayload(cacheKey, payload, ttlMs) {
  writeCache(SEARCH_CACHE, cacheKey, payload, ttlMs);
}
function readUnsupportedSearchFilter(params) {
  for (const name of ["country", "language", "freshness", "date_after", "date_before"]) {
    const value = params[name];
    if (typeof value === "string" && value.trim()) return name;
  }
}
function describeUnsupportedSearchFilter(name) {
  switch (name) {
    case "country":
      return "country filtering";
    case "language":
      return "language filtering";
    case "freshness":
      return "freshness filtering";
    case "date_after":
    case "date_before":
      return "date_after/date_before filtering";
  }
  throw new Error("Unsupported web search filter");
}
function buildUnsupportedSearchFilterResponse(
  params,
  provider,
  docs = "https://docs.openclaw.ai/tools/web",
) {
  const unsupported = readUnsupportedSearchFilter(params);
  if (!unsupported) return;
  const label = describeUnsupportedSearchFilter(unsupported);
  const supportedLabel =
    unsupported === "date_after" || unsupported === "date_before" ? "date filtering" : label;
  return {
    error: unsupported.startsWith("date_")
      ? "unsupported_date_filter"
      : `unsupported_${unsupported}`,
    message: `${label} is not supported by the ${provider} provider. Only Brave and Perplexity support ${supportedLabel}.`,
    docs,
  };
}
//#endregion
export {
  writeCachedSearchPayload as S,
  resolveSearchTimeoutSeconds as _,
  buildUnsupportedSearchFilterResponse as a,
  withSelfHostedWebSearchEndpoint as b,
  normalizeToIsoDate as c,
  postTrustedWebToolsJson as d,
  readCachedSearchPayload as f,
  resolveSearchCount as g,
  resolveSearchCacheTtlMs as h,
  buildSearchCacheKey as i,
  parseIsoDateRange as l,
  readProviderEnvValue as m,
  FRESHNESS_TO_RECENCY as n,
  isoToPerplexityDate as o,
  readConfiguredSecretString as p,
  MAX_SEARCH_COUNT as r,
  normalizeFreshness as s,
  DEFAULT_SEARCH_COUNT as t,
  parseWebSearchTimeFilters as u,
  resolveSiteName as v,
  withTrustedWebSearchEndpoint as x,
  throwWebSearchApiError as y,
};
