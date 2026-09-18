import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { h as readPositiveIntegerParam, y as readStringParam } from "./common-DyDSUect.js";
import { o as wrapWebContent } from "./external-content-rRQGoatE.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import {
  _ as resolvePinnedHostnameWithPolicy,
  c as isBlockedHostnameOrIp,
  u as isPrivateIpAddress,
} from "./ssrf-keFRGQLq.js";
import { t as assertHttpUrlTargetsPrivateNetwork } from "./ssrf-policy-zxv5oRW2.js";
import "./runtime-env-D0V-7Gqz.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  S as writeCachedSearchPayload,
  _ as resolveSearchTimeoutSeconds,
  b as withSelfHostedWebSearchEndpoint,
  f as readCachedSearchPayload,
  g as resolveSearchCount,
  h as resolveSearchCacheTtlMs,
  i as buildSearchCacheKey,
  m as readProviderEnvValue,
  p as readConfiguredSecretString,
  u as parseWebSearchTimeFilters,
  v as resolveSiteName$1,
  x as withTrustedWebSearchEndpoint,
} from "./web-search-provider-common-B8EoIruV.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
import "./provider-web-search-Bpbir19i.js";
//#region extensions/brave/src/brave-web-search-provider.shared.ts
/**
 * Brave Search request normalization and result mapping. It validates Brave
 * country/language params and converts LLM-context responses into web results.
 */
const BRAVE_COUNTRY_CODES = /* @__PURE__ */ new Set([
  "AR",
  "AU",
  "AT",
  "BE",
  "BR",
  "CA",
  "CL",
  "DK",
  "FI",
  "FR",
  "DE",
  "GR",
  "HK",
  "IN",
  "ID",
  "IT",
  "JP",
  "KR",
  "MY",
  "MX",
  "NL",
  "NZ",
  "NO",
  "CN",
  "PL",
  "PT",
  "PH",
  "RU",
  "SA",
  "ZA",
  "ES",
  "SE",
  "CH",
  "TW",
  "TR",
  "GB",
  "US",
  "ALL",
]);
const BRAVE_SEARCH_LANG_CODES = /* @__PURE__ */ new Set([
  "ar",
  "eu",
  "bn",
  "bg",
  "ca",
  "zh-hans",
  "zh-hant",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "en-gb",
  "et",
  "fi",
  "fr",
  "gl",
  "de",
  "el",
  "gu",
  "he",
  "hi",
  "hu",
  "is",
  "it",
  "jp",
  "kn",
  "ko",
  "lv",
  "lt",
  "ms",
  "ml",
  "mr",
  "nb",
  "pl",
  "pt-br",
  "pt-pt",
  "pa",
  "ro",
  "ru",
  "sr",
  "sk",
  "sl",
  "es",
  "sv",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "vi",
]);
const BRAVE_SEARCH_LANG_ALIASES = {
  ja: "jp",
  zh: "zh-hans",
  "zh-cn": "zh-hans",
  "zh-hk": "zh-hant",
  "zh-sg": "zh-hans",
  "zh-tw": "zh-hant",
};
const BRAVE_UI_LANG_LOCALE = /^([a-z]{2})-([a-z]{2})$/i;
function normalizeBraveSearchLang(value) {
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  const canonical = BRAVE_SEARCH_LANG_ALIASES[lower] ?? lower;
  if (!BRAVE_SEARCH_LANG_CODES.has(canonical)) return;
  return canonical;
}
/** Normalize Brave country filter values. */
function normalizeBraveCountry(value) {
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const canonical = trimmed.toUpperCase();
  return BRAVE_COUNTRY_CODES.has(canonical) ? canonical : "ALL";
}
function normalizeBraveUiLang(value) {
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const match = trimmed.match(BRAVE_UI_LANG_LOCALE);
  if (!match) return;
  const [, language, region] = match;
  if (!language || !region) return;
  return `${normalizeLowercaseStringOrEmpty(language)}-${region.toUpperCase()}`;
}
/** Resolve Brave-specific web-search config from scoped search config. */
function resolveBraveConfig(searchConfig) {
  const brave = searchConfig?.brave;
  return brave && typeof brave === "object" && !Array.isArray(brave) ? brave : {};
}
/** Resolve whether Brave should use web search or LLM Context API mode. */
function resolveBraveMode(brave) {
  return brave?.mode === "llm-context" ? "llm-context" : "web";
}
/** Normalize Brave search and UI language params, detecting swapped fields. */
function normalizeBraveLanguageParams(params) {
  const rawSearchLang = normalizeOptionalString(params.search_lang);
  const rawUiLang = normalizeOptionalString(params.ui_lang);
  let searchLangCandidate = rawSearchLang;
  let uiLangCandidate = rawUiLang;
  if (normalizeBraveUiLang(rawSearchLang) && normalizeBraveSearchLang(rawUiLang)) {
    searchLangCandidate = rawUiLang;
    uiLangCandidate = rawSearchLang;
  }
  const search_lang = normalizeBraveSearchLang(searchLangCandidate);
  if (searchLangCandidate && !search_lang) return { invalidField: "search_lang" };
  const ui_lang = normalizeBraveUiLang(uiLangCandidate);
  if (uiLangCandidate && !ui_lang) return { invalidField: "ui_lang" };
  return {
    search_lang,
    ui_lang,
  };
}
function resolveSiteName(url) {
  if (!url) return;
  try {
    return new URL(url).hostname;
  } catch {
    return;
  }
}
/** Map Brave LLM Context API grounding results into web-search result rows. */
function mapBraveLlmContextResults(data) {
  return (Array.isArray(data.grounding?.generic) ? data.grounding.generic : []).map((entry) => ({
    url: entry.url ?? "",
    title: entry.title ?? "",
    snippets: (entry.snippets ?? []).filter(
      (snippet) => typeof snippet === "string" && snippet.length > 0,
    ),
    siteName: resolveSiteName(entry.url) || void 0,
  }));
}
//#endregion
//#region extensions/brave/src/brave-web-search-provider.runtime.ts
/**
 * Brave Search HTTP runtime. It resolves credentials, enforces endpoint safety,
 * applies caching, and maps Brave web/LLM-context API responses.
 */
const DEFAULT_BRAVE_BASE_URL = "https://api.search.brave.com";
const BRAVE_SEARCH_ENDPOINT_PATH = "/res/v1/web/search";
const BRAVE_LLM_CONTEXT_ENDPOINT_PATH = "/res/v1/llm/context";
const braveHttpLogger = createSubsystemLogger("brave/http");
function logBraveHttp(diagnostics, event, meta) {
  if (!diagnostics?.enabled) return;
  braveHttpLogger.info(`brave http ${event}`, meta);
}
function describeBraveRequestUrl(url) {
  return {
    url: url.toString(),
    query: url.searchParams.get("q") ?? "",
    params: Object.fromEntries(url.searchParams.entries()),
  };
}
function resolveBraveApiKey(searchConfig) {
  return (
    readConfiguredSecretString(searchConfig?.apiKey, "tools.web.search.apiKey") ??
    readProviderEnvValue(["BRAVE_API_KEY"])
  );
}
function resolveBraveBaseUrl(braveConfig) {
  return (
    readConfiguredSecretString(
      braveConfig?.baseUrl,
      "plugins.entries.brave.config.webSearch.baseUrl",
    )?.replace(/\/+$/u, "") || DEFAULT_BRAVE_BASE_URL
  );
}
function buildBraveEndpointUrl(params) {
  const url = new URL(params.baseUrl);
  url.pathname = `${url.pathname.replace(/\/+$/u, "")}${params.endpointPath}`;
  url.search = "";
  return url;
}
async function braveEndpointTargetsPrivateNetwork(url) {
  if (isBlockedHostnameOrIp(url.hostname)) return true;
  try {
    return (
      await resolvePinnedHostnameWithPolicy(url.hostname, {
        policy: {
          allowPrivateNetwork: true,
          allowRfc2544BenchmarkRange: true,
        },
      })
    ).addresses.every((address) => isPrivateIpAddress(address));
  } catch {
    return false;
  }
}
async function validateBraveBaseUrl(baseUrl) {
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error("Brave Search base URL must be a valid http:// or https:// URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    throw new Error("Brave Search base URL must use http:// or https://.");
  if (parsed.protocol === "http:") {
    await assertHttpUrlTargetsPrivateNetwork(parsed.toString(), {
      dangerouslyAllowPrivateNetwork: true,
      errorMessage:
        "Brave Search HTTP base URL must target a trusted private or loopback host. Use https:// for public hosts.",
    });
    return "selfHosted";
  }
  return (await braveEndpointTargetsPrivateNetwork(parsed)) ? "selfHosted" : "strict";
}
function missingBraveKeyPayload() {
  return {
    error: "missing_brave_api_key",
    message: `web_search (brave) needs a Brave Search API key. Run \`${formatCliCommand("openclaw configure --section web")}\` to store it, or set BRAVE_API_KEY in the Gateway environment. If you do not want to configure a search API key, use web_fetch for a specific URL or the browser tool for interactive pages.`,
    docs: "https://docs.openclaw.ai/tools/web",
  };
}
function setBraveSearchUrlParams(url, params) {
  url.searchParams.set("q", params.query);
  if (params.country) url.searchParams.set("country", params.country);
  if (params.search_lang) url.searchParams.set("search_lang", params.search_lang);
  if (params.freshness) url.searchParams.set("freshness", params.freshness);
  else if (params.dateAfter && params.dateBefore)
    url.searchParams.set("freshness", `${params.dateAfter}to${params.dateBefore}`);
  else if (params.dateAfter)
    url.searchParams.set(
      "freshness",
      `${params.dateAfter}to${/* @__PURE__ */ new Date().toISOString().slice(0, 10)}`,
    );
  else if (params.allowDateBeforeOnly && params.dateBefore)
    url.searchParams.set("freshness", `1970-01-01to${params.dateBefore}`);
}
async function runBraveJsonRequest(params, errorLabel) {
  const url = buildBraveEndpointUrl({
    baseUrl: params.baseUrl,
    endpointPath: params.endpointPath,
  });
  params.configureUrl(url);
  logBraveHttp(params.diagnostics, "request", {
    mode: params.mode,
    ...describeBraveRequestUrl(url),
  });
  const startedAt = Date.now();
  return (
    params.endpointMode === "selfHosted"
      ? withSelfHostedWebSearchEndpoint
      : withTrustedWebSearchEndpoint
  )(
    {
      url: url.toString(),
      timeoutSeconds: params.timeoutSeconds,
      init: {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": params.apiKey,
        },
      },
    },
    async (response) => {
      logBraveHttp(params.diagnostics, "response", {
        mode: params.mode,
        status: response.status,
        ok: response.ok,
        durationMs: Date.now() - startedAt,
      });
      await assertOkOrThrowProviderError(response, errorLabel);
      return readProviderJsonResponse(response, errorLabel);
    },
  );
}
async function runBraveLlmContextSearch(params) {
  const data = await runBraveJsonRequest(
    {
      baseUrl: params.baseUrl,
      endpointPath: BRAVE_LLM_CONTEXT_ENDPOINT_PATH,
      mode: "llm-context",
      endpointMode: params.endpointMode,
      apiKey: params.apiKey,
      timeoutSeconds: params.timeoutSeconds,
      diagnostics: params.diagnostics,
      configureUrl: (url) => {
        setBraveSearchUrlParams(url, params);
      },
    },
    "Brave LLM Context API error",
  );
  return {
    results: mapBraveLlmContextResults(data),
    sources: data.sources,
  };
}
async function runBraveWebSearch(params) {
  const data = await runBraveJsonRequest(
    {
      baseUrl: params.baseUrl,
      endpointPath: BRAVE_SEARCH_ENDPOINT_PATH,
      mode: "web",
      endpointMode: params.endpointMode,
      apiKey: params.apiKey,
      timeoutSeconds: params.timeoutSeconds,
      diagnostics: params.diagnostics,
      configureUrl: (url) => {
        setBraveSearchUrlParams(url, {
          ...params,
          allowDateBeforeOnly: true,
        });
        url.searchParams.set("count", String(params.count));
        if (params.ui_lang) url.searchParams.set("ui_lang", params.ui_lang);
      },
    },
    "Brave Search API error",
  );
  return (Array.isArray(data.web?.results) ? (data.web?.results ?? []) : []).map((entry) => {
    const description = entry.description ?? "";
    const title = entry.title ?? "";
    const url = entry.url ?? "";
    return {
      title: title ? wrapWebContent(title, "web_search") : "",
      url,
      description: description ? wrapWebContent(description, "web_search") : "",
      published: entry.age || void 0,
      siteName: resolveSiteName$1(url) || void 0,
    };
  });
}
/** Execute one Brave Search request using web or LLM-context mode. */
async function executeBraveSearch(args, searchConfig, options) {
  const apiKey = resolveBraveApiKey(searchConfig);
  if (!apiKey) return missingBraveKeyPayload();
  const braveConfig = resolveBraveConfig(searchConfig);
  const braveMode = resolveBraveMode(braveConfig);
  const braveBaseUrl = resolveBraveBaseUrl(braveConfig);
  const braveEndpointMode = await validateBraveBaseUrl(braveBaseUrl);
  const query = readStringParam(args, "query", { required: true });
  const count =
    readPositiveIntegerParam(args, "count", {
      max: 10,
      message: `count must be an integer from 1 to 10.`,
    }) ??
    searchConfig?.maxResults ??
    void 0;
  const country = normalizeBraveCountry(readStringParam(args, "country"));
  const language = readStringParam(args, "language");
  const search_lang = readStringParam(args, "search_lang");
  const ui_lang = readStringParam(args, "ui_lang");
  const normalizedLanguage = normalizeBraveLanguageParams({
    search_lang: search_lang || language,
    ui_lang,
  });
  if (normalizedLanguage.invalidField === "search_lang")
    return {
      error: "invalid_search_lang",
      message:
        "search_lang must be a Brave-supported language code like 'en', 'en-gb', 'zh-hans', or 'zh-hant'.",
      docs: "https://docs.openclaw.ai/tools/web",
    };
  if (normalizedLanguage.invalidField === "ui_lang")
    return {
      error: "invalid_ui_lang",
      message: "ui_lang must be a language-region locale like 'en-US'.",
      docs: "https://docs.openclaw.ai/tools/web",
    };
  if (normalizedLanguage.ui_lang && braveMode === "llm-context")
    return {
      error: "unsupported_ui_lang",
      message:
        "ui_lang is not supported by Brave llm-context mode. Remove ui_lang or use Brave web mode for locale-based UI hints.",
      docs: "https://docs.openclaw.ai/tools/web",
    };
  const rawFreshness = readStringParam(args, "freshness");
  const parsedTimeFilters = parseWebSearchTimeFilters({
    rawDateAfter: readStringParam(args, "date_after"),
    rawDateBefore: readStringParam(args, "date_before"),
    rawFreshness,
    freshnessProvider: "brave",
    invalidFreshnessMessage: "freshness must be day, week, month, or year.",
    invalidDateAfterMessage: "date_after must be YYYY-MM-DD format.",
    invalidDateBeforeMessage: "date_before must be YYYY-MM-DD format.",
    invalidDateRangeMessage: "date_after must be before date_before.",
  });
  if ("error" in parsedTimeFilters) return parsedTimeFilters;
  const { freshness, dateAfter, dateBefore } = parsedTimeFilters;
  if (braveMode === "llm-context") {
    const today = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
    if (dateAfter && !dateBefore && dateAfter > today)
      return {
        error: "invalid_date_range",
        message: "date_after cannot be in the future for Brave llm-context mode.",
        docs: "https://docs.openclaw.ai/tools/web",
      };
    if (dateBefore && !dateAfter)
      return {
        error: "unsupported_date_filter",
        message:
          "Brave llm-context mode requires date_after when date_before is set. Use a bounded date range or freshness.",
        docs: "https://docs.openclaw.ai/tools/web",
      };
  }
  const llmContextDateEnd =
    braveMode === "llm-context" && dateAfter
      ? (dateBefore ?? /* @__PURE__ */ new Date().toISOString().slice(0, 10))
      : dateBefore;
  const cacheKey = buildSearchCacheKey(
    braveMode === "llm-context"
      ? [
          "brave",
          braveMode,
          braveBaseUrl,
          query,
          country,
          normalizedLanguage.search_lang,
          freshness,
          dateAfter,
          llmContextDateEnd,
        ]
      : [
          "brave",
          braveMode,
          braveBaseUrl,
          query,
          resolveSearchCount(count, 5),
          country,
          normalizedLanguage.search_lang,
          normalizedLanguage.ui_lang,
          freshness,
          dateAfter,
          dateBefore,
        ],
  );
  const diagnostics = { enabled: options?.diagnosticsEnabled === true };
  const cached = readCachedSearchPayload(cacheKey);
  if (cached) {
    logBraveHttp(diagnostics, "cache hit", {
      mode: braveMode,
      query,
      cacheKey,
    });
    return cached;
  }
  logBraveHttp(diagnostics, "cache miss", {
    mode: braveMode,
    query,
    cacheKey,
  });
  const start = Date.now();
  const timeoutSeconds = resolveSearchTimeoutSeconds(searchConfig);
  const cacheTtlMs = resolveSearchCacheTtlMs(searchConfig);
  if (braveMode === "llm-context") {
    const { results, sources } = await runBraveLlmContextSearch({
      baseUrl: braveBaseUrl,
      endpointMode: braveEndpointMode,
      query,
      apiKey,
      timeoutSeconds,
      diagnostics,
      country: country ?? void 0,
      search_lang: normalizedLanguage.search_lang,
      freshness,
      dateAfter,
      dateBefore,
    });
    const payload = {
      query,
      provider: "brave",
      mode: "llm-context",
      count: results.length,
      tookMs: Date.now() - start,
      externalContent: {
        untrusted: true,
        source: "web_search",
        provider: "brave",
        wrapped: true,
      },
      results: results.map((entry) => ({
        title: entry.title ? wrapWebContent(entry.title, "web_search") : "",
        url: entry.url,
        snippets: entry.snippets.map((snippet) => wrapWebContent(snippet, "web_search")),
        siteName: entry.siteName,
      })),
      sources,
    };
    writeCachedSearchPayload(cacheKey, payload, cacheTtlMs);
    logBraveHttp(diagnostics, "cache write", {
      mode: "llm-context",
      query,
      cacheKey,
      ttlMs: cacheTtlMs,
      count: results.length,
    });
    return payload;
  }
  const results = await runBraveWebSearch({
    baseUrl: braveBaseUrl,
    endpointMode: braveEndpointMode,
    query,
    count: resolveSearchCount(count, 5),
    apiKey,
    timeoutSeconds,
    diagnostics,
    country: country ?? void 0,
    search_lang: normalizedLanguage.search_lang,
    ui_lang: normalizedLanguage.ui_lang,
    freshness,
    dateAfter,
    dateBefore,
  });
  const payload = {
    query,
    provider: "brave",
    count: results.length,
    tookMs: Date.now() - start,
    externalContent: {
      untrusted: true,
      source: "web_search",
      provider: "brave",
      wrapped: true,
    },
    results,
  };
  writeCachedSearchPayload(cacheKey, payload, cacheTtlMs);
  logBraveHttp(diagnostics, "cache write", {
    mode: "web",
    query,
    cacheKey,
    ttlMs: cacheTtlMs,
    count: results.length,
  });
  return payload;
}
//#endregion
export { executeBraveSearch };
