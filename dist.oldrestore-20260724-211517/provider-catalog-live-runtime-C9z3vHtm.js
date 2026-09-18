import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { d as isNonSecretApiKeyMarker } from "./model-auth-markers-CA2Xy59Z.js";
import { i as getCachedLiveCatalogValue } from "./provider-catalog-shared-CQScmZZs.js";
import { t as retainSafeHeadersForCrossOriginRedirect } from "./redirect-headers-CivNCvUj.js";
import "./ssrf-runtime-DJ478vv8.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
//#region src/plugin-sdk/provider-catalog-live-runtime.ts
const LIVE_MODEL_CATALOG_BODY_MAX_BYTES = 4 * 1024 * 1024;
const LIVE_MODEL_CATALOG_MAX_PAGES = 50;
var LiveModelCatalogHttpError = class extends Error {
  constructor(providerId, status) {
    super(`${providerId} model discovery failed: HTTP ${status}`);
    this.name = "LiveModelCatalogHttpError";
    this.status = status;
  }
};
function readDefaultLiveModelCatalogRows(body) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object" && Array.isArray(body.data)) return body.data;
  throw new Error("Live model catalog response must be an array or { data: [] }");
}
function readDefaultLiveModelId(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const candidate = row;
  if (candidate.object !== void 0 && candidate.object !== "model") return;
  if (typeof candidate.id !== "string") return;
  return candidate.id.trim() || void 0;
}
function normalizeLiveModelCatalogRequestApiKey(value) {
  const trimmed = value?.trim();
  if (!trimmed || isNonSecretApiKeyMarker(trimmed)) return;
  return trimmed;
}
function selectLiveModelCatalogRequestApiKey(ctx) {
  return (
    normalizeLiveModelCatalogRequestApiKey(ctx.discoveryApiKey) ??
    normalizeLiveModelCatalogRequestApiKey(ctx.apiKey)
  );
}
function buildDefaultLiveModelCatalogHeaders(ctx) {
  const requestApiKey = selectLiveModelCatalogRequestApiKey(ctx);
  return {
    Accept: "application/json",
    ...(requestApiKey ? { Authorization: `Bearer ${requestApiKey}` } : {}),
  };
}
function buildHeaders(params, safeReplayHeaders) {
  const headers = safeReplayHeaders
    ? new Headers(safeReplayHeaders)
    : new Headers(
        (params.buildRequestHeaders ?? buildDefaultLiveModelCatalogHeaders)({
          apiKey: normalizeLiveModelCatalogRequestApiKey(params.apiKey),
          discoveryApiKey: selectLiveModelCatalogRequestApiKey(params),
        }),
      );
  if (!headers.has("accept")) headers.set("accept", "application/json");
  return headers;
}
async function cancelUnreadResponseBody(response) {
  if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
async function readLiveModelCatalogJson(response, timeoutMs) {
  const buffer = await readResponseWithLimit(response, LIVE_MODEL_CATALOG_BODY_MAX_BYTES, {
    chunkTimeoutMs: timeoutMs,
    onOverflow: ({ size, maxBytes }) =>
      /* @__PURE__ */ new Error(
        `Live model catalog response exceeded ${maxBytes} bytes (${size} bytes received)`,
      ),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(
        `Live model catalog response stalled: no data received for ${chunkTimeoutMs}ms`,
      ),
  });
  return JSON.parse(new TextDecoder().decode(buffer));
}
function readLiveModelCatalogString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function readLiveModelCatalogRecord(body) {
  return body && typeof body === "object" && !Array.isArray(body) ? body : void 0;
}
function readLiveModelCatalogNextUrl(body) {
  const record = readLiveModelCatalogRecord(body);
  if (!record) return;
  const links = readLiveModelCatalogRecord(record.links);
  return readLiveModelCatalogString(record.next) ?? readLiveModelCatalogString(links?.next);
}
function readLiveModelCatalogCursor(body) {
  const record = readLiveModelCatalogRecord(body);
  if (!record || record.has_more === false) return;
  const nextCursor = readLiveModelCatalogString(record.next_cursor);
  if (nextCursor)
    return {
      name: "after",
      value: nextCursor,
    };
  const nextPageToken = readLiveModelCatalogString(record.nextPageToken);
  return nextPageToken
    ? {
        name: "pageToken",
        value: nextPageToken,
      }
    : void 0;
}
function bodyAdvertisesMoreLiveModelCatalogPages(body) {
  const record = readLiveModelCatalogRecord(body);
  if (!record || record.has_more === false) return false;
  return Boolean(
    record.has_more === true ||
    readLiveModelCatalogNextUrl(body) ||
    readLiveModelCatalogString(record.next_cursor) ||
    readLiveModelCatalogString(record.nextPageToken),
  );
}
function resolveLiveModelCatalogNextPage(currentUrl, body) {
  const rawNextUrl = readLiveModelCatalogNextUrl(body);
  if (rawNextUrl) {
    const nextUrl = new URL(rawNextUrl, currentUrl);
    if (nextUrl.origin === new URL(currentUrl).origin)
      return {
        status: "next",
        url: nextUrl.toString(),
      };
  }
  const cursor = readLiveModelCatalogCursor(body);
  if (cursor) {
    const nextUrl = new URL(currentUrl);
    nextUrl.searchParams.set(cursor.name, cursor.value);
    return {
      status: "next",
      url: nextUrl.toString(),
    };
  }
  return bodyAdvertisesMoreLiveModelCatalogPages(body)
    ? { status: "incomplete" }
    : { status: "complete" };
}
async function fetchLiveProviderModelCatalogPage(params) {
  const requestHeaders = buildHeaders(params, params.safeReplayHeaders);
  const { response, finalUrl, release } = await params.fetchGuard({
    url: params.url,
    init: { headers: requestHeaders },
    signal: params.signal,
    timeoutMs: params.timeoutMs,
    policy: params.policy ?? ssrfPolicyFromHttpBaseUrlAllowedHostname(params.endpoint),
    ...(params.lookupFn ? { lookupFn: params.lookupFn } : {}),
    ...(params.requireHttps !== void 0 ? { requireHttps: params.requireHttps } : {}),
    auditContext: params.auditContext ?? `${params.providerId}-model-discovery`,
  });
  try {
    if (!response.ok) {
      await cancelUnreadResponseBody(response);
      throw new LiveModelCatalogHttpError(params.providerId, response.status);
    }
    const body = await readLiveModelCatalogJson(response, params.timeoutMs);
    return {
      body,
      finalUrl,
      requestHeaders,
      rows: (params.readRows ?? readDefaultLiveModelCatalogRows)(body),
    };
  } finally {
    await release();
  }
}
async function fetchLiveProviderModelRows(params) {
  const fetchGuard = params.fetchGuard ?? fetchWithSsrFGuard;
  const timeoutMs = params.timeoutMs ?? 5e3;
  const startedAt = Date.now();
  const rows = [];
  const seenPageUrls = /* @__PURE__ */ new Set();
  let pageUrl = params.endpoint;
  let safeReplayHeaders;
  for (let page = 0; page < LIVE_MODEL_CATALOG_MAX_PAGES && pageUrl; page += 1) {
    if (seenPageUrls.has(pageUrl)) break;
    const remainingTimeoutMs = timeoutMs - (Date.now() - startedAt);
    if (remainingTimeoutMs <= 0)
      throw new Error(
        `${params.providerId} model discovery exceeded ${timeoutMs}ms before the catalog completed`,
      );
    seenPageUrls.add(pageUrl);
    const requestedPageUrl = pageUrl;
    const result = await fetchLiveProviderModelCatalogPage({
      ...params,
      fetchGuard,
      url: requestedPageUrl,
      timeoutMs: remainingTimeoutMs,
      safeReplayHeaders,
    });
    rows.push(...result.rows);
    if (safeReplayHeaders || new URL(result.finalUrl).origin !== new URL(requestedPageUrl).origin)
      safeReplayHeaders = new Headers(
        retainSafeHeadersForCrossOriginRedirect(result.requestHeaders),
      );
    const nextPage = resolveLiveModelCatalogNextPage(result.finalUrl, result.body);
    if (nextPage.status === "incomplete")
      throw new Error(
        `${params.providerId} model discovery did not include a supported next page before the catalog completed`,
      );
    pageUrl = nextPage.status === "next" ? nextPage.url : void 0;
  }
  if (pageUrl)
    throw new Error(
      `${params.providerId} model discovery exceeded ${LIVE_MODEL_CATALOG_MAX_PAGES} pages before the catalog completed`,
    );
  return rows;
}
function liveModelCatalogAuthCacheKey(params) {
  return selectLiveModelCatalogRequestApiKey(params);
}
async function getCachedLiveProviderModelRows(params) {
  return await getCachedLiveCatalogValue({
    keyParts: params.cacheKeyParts ?? [
      params.providerId,
      "model-rows",
      params.endpoint,
      liveModelCatalogAuthCacheKey(params),
    ],
    ttlMs: params.ttlMs,
    load: async () => await fetchLiveProviderModelRows(params),
    shouldCache: params.shouldCacheRows,
  });
}
async function fetchLiveProviderModelIds(params) {
  const rows = await fetchLiveProviderModelRows(params);
  const readModelId = params.readModelId ?? readDefaultLiveModelId;
  const seen = /* @__PURE__ */ new Set();
  const modelIds = [];
  for (const row of rows) {
    const modelId = readModelId(row);
    if (!modelId || seen.has(modelId)) continue;
    seen.add(modelId);
    modelIds.push(modelId);
  }
  return modelIds;
}
function buildProviderConfig(params, models) {
  return {
    ...params.providerConfig,
    ...(params.apiKey ? { apiKey: params.apiKey } : {}),
    models: [...models],
  };
}
async function buildLiveModelProviderConfig(params) {
  try {
    const liveModelIds = await getCachedLiveCatalogValue({
      keyParts: params.cacheKeyParts ?? [
        params.providerId,
        "models",
        params.endpoint,
        liveModelCatalogAuthCacheKey(params),
      ],
      ttlMs: params.ttlMs,
      load: async () => await fetchLiveProviderModelIds(params),
      shouldCache: (modelIds) => modelIds.length > 0,
    });
    const liveModelIdSet = new Set(liveModelIds);
    const models = params.models.filter((model) => liveModelIdSet.has(model.id));
    if (models.length > 0) return buildProviderConfig(params, models);
  } catch {}
  return buildProviderConfig(params, params.models);
}
//#endregion
export {
  getCachedLiveProviderModelRows as a,
  fetchLiveProviderModelRows as i,
  buildLiveModelProviderConfig as n,
  fetchLiveProviderModelIds as r,
  LiveModelCatalogHttpError as t,
};
