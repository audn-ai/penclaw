import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import "./response-limit-runtime-B_DBKaLw.js";
import { n as resolveCodexAuthIdentity } from "./openai-chatgpt-auth-identity-BW3Y9D_T.js";
import {
  a as fetchCodexUsage,
  c as buildUsageHttpErrorSnapshot,
} from "./provider-usage-DW1nF0aA.js";
//#region extensions/openai/usage.ts
const OPENAI_COSTS_URL = "https://api.openai.com/v1/organization/costs";
const OPENAI_COMPLETIONS_USAGE_URL = "https://api.openai.com/v1/organization/usage/completions";
const OPENAI_ADMIN_TOKEN_PREFIX = "openclaw:openai-admin:v1:";
const OPENAI_USAGE_RESPONSE_MAX_BYTES = 4 * 1024 * 1024;
const OPENAI_USAGE_HISTORY_DAYS = 30;
const MAX_PAGES = 100;
function cleanCredential(raw) {
  const trimmed = raw?.replaceAll(/[\r\n]/g, "").trim();
  if (!trimmed) return;
  return (
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed) || void 0
  );
}
function encodeAdminToken(token) {
  return `${OPENAI_ADMIN_TOKEN_PREFIX}${JSON.stringify({ token })}`;
}
function decodeAdminToken(raw) {
  if (!raw.startsWith(OPENAI_ADMIN_TOKEN_PREFIX)) return;
  try {
    const token = objectRecord(JSON.parse(raw.slice(25)))?.token;
    return typeof token === "string" && token.trim() ? token.trim() : void 0;
  } catch {
    return;
  }
}
function objectRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function finiteNumber(value) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;
  return Number.isFinite(parsed) ? parsed : void 0;
}
function nonNegativeInteger(value) {
  const parsed = finiteNumber(value);
  return parsed === void 0 ? 0 : Math.max(0, Math.trunc(parsed));
}
function displayName(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function utcDay(epochSeconds) {
  return /* @__PURE__ */ new Date(epochSeconds * 1e3).toISOString().slice(0, 10);
}
function emptyDaily(date) {
  return {
    date,
    amount: 0,
    requests: 0,
    inputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    categories: /* @__PURE__ */ new Map(),
    models: /* @__PURE__ */ new Map(),
  };
}
function resolveDailyRange(now, periodDays) {
  const current = new Date(now);
  const todayStart = Date.UTC(
    current.getUTCFullYear(),
    current.getUTCMonth(),
    current.getUTCDate(),
  );
  return {
    startTime: Math.floor((todayStart - (periodDays - 1) * 864e5) / 1e3),
    endTime: Math.floor((todayStart + 864e5) / 1e3),
  };
}
async function readPage(response, timeoutMs) {
  const buffer = await readResponseWithLimit(response, OPENAI_USAGE_RESPONSE_MAX_BYTES, {
    chunkTimeoutMs: timeoutMs,
    onOverflow: ({ maxBytes }) =>
      /* @__PURE__ */ new Error(`OpenAI usage response exceeds ${maxBytes} bytes`),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(`OpenAI usage response stalled for ${chunkTimeoutMs}ms`),
  });
  const payload = objectRecord(JSON.parse(new TextDecoder().decode(buffer)));
  if (!payload || !Array.isArray(payload.data))
    throw new Error("OpenAI usage response is not an object with data");
  const nextPage =
    typeof payload.next_page === "string" && payload.next_page.trim()
      ? payload.next_page.trim()
      : void 0;
  return {
    data: payload.data,
    hasMore: payload.has_more === true,
    ...(nextPage ? { nextPage } : {}),
  };
}
async function fetchPages(params) {
  const data = [];
  const seenPages = /* @__PURE__ */ new Set();
  let page;
  for (let pageCount = 1; pageCount <= MAX_PAGES; pageCount += 1) {
    const url = new URL(params.baseUrl);
    url.searchParams.set("start_time", String(params.startTime));
    url.searchParams.set("end_time", String(params.endTime));
    url.searchParams.set("bucket_width", "1d");
    url.searchParams.set("limit", String(params.periodDays));
    url.searchParams.set("group_by", params.groupBy);
    if (params.projectId) url.searchParams.set("project_ids", params.projectId);
    if (page) url.searchParams.set("page", page);
    let response;
    try {
      response = await params.fetchFn(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${params.apiKey}`,
        },
        signal: AbortSignal.timeout(params.timeoutMs),
      });
    } catch {
      return { ok: false };
    }
    if (!response.ok) {
      await response.body?.cancel().catch(() => void 0);
      return {
        ok: false,
        status: response.status,
      };
    }
    let parsed;
    try {
      parsed = await readPage(response, params.timeoutMs);
    } catch {
      return { ok: false };
    }
    data.push(...parsed.data);
    if (!parsed.hasMore)
      return {
        ok: true,
        data,
      };
    if (!parsed.nextPage || seenPages.has(parsed.nextPage)) return { ok: false };
    seenPages.add(parsed.nextPage);
    page = parsed.nextPage;
  }
  return { ok: false };
}
function addModelUsage(accumulator, name, usage) {
  const current = accumulator.models.get(name) ?? {
    name,
    requests: 0,
    inputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
  current.requests = (current.requests ?? 0) + (usage.requests ?? 0);
  current.inputTokens += usage.inputTokens;
  current.cacheReadTokens += usage.cacheReadTokens;
  current.cacheWriteTokens += usage.cacheWriteTokens;
  current.outputTokens += usage.outputTokens;
  current.totalTokens += usage.totalTokens;
  accumulator.models.set(name, current);
}
function aggregateHistory(params) {
  const daily = /* @__PURE__ */ new Map();
  const getDaily = (startTime) => {
    const current = daily.get(startTime) ?? emptyDaily(utcDay(startTime));
    daily.set(startTime, current);
    return current;
  };
  for (const rawBucket of params.costs) {
    const bucket = objectRecord(rawBucket);
    const startTime = finiteNumber(bucket?.start_time);
    if (startTime === void 0 || !Array.isArray(bucket?.results)) continue;
    const accumulator = getDaily(startTime);
    for (const rawResult of bucket.results) {
      const result = objectRecord(rawResult);
      const amount = finiteNumber(objectRecord(result?.amount)?.value) ?? 0;
      const category = displayName(result?.line_item, "API");
      accumulator.amount += amount;
      accumulator.categories.set(category, (accumulator.categories.get(category) ?? 0) + amount);
    }
  }
  for (const rawBucket of params.completions) {
    const bucket = objectRecord(rawBucket);
    const startTime = finiteNumber(bucket?.start_time);
    if (startTime === void 0 || !Array.isArray(bucket?.results)) continue;
    const accumulator = getDaily(startTime);
    for (const rawResult of bucket.results) {
      const result = objectRecord(rawResult);
      if (!result) continue;
      const requests = nonNegativeInteger(result.num_model_requests);
      const textInputTokens = nonNegativeInteger(result.input_tokens);
      const audioInputTokens = nonNegativeInteger(result.input_audio_tokens);
      const cacheReadTokens = nonNegativeInteger(result.input_cached_tokens);
      const inputTokens = Math.max(0, textInputTokens - cacheReadTokens) + audioInputTokens;
      const outputTokens =
        nonNegativeInteger(result.output_tokens) + nonNegativeInteger(result.output_audio_tokens);
      const totalTokens = textInputTokens + audioInputTokens + outputTokens;
      accumulator.requests = (accumulator.requests ?? 0) + requests;
      accumulator.inputTokens += inputTokens;
      accumulator.cacheReadTokens += cacheReadTokens;
      accumulator.outputTokens += outputTokens;
      accumulator.totalTokens += totalTokens;
      addModelUsage(accumulator, displayName(result.model, "Responses and Chat Completions"), {
        requests,
        inputTokens,
        cacheReadTokens,
        cacheWriteTokens: 0,
        outputTokens,
        totalTokens,
      });
    }
  }
  const categories = /* @__PURE__ */ new Map();
  const models = /* @__PURE__ */ new Map();
  const historyDaily = [...daily.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([, entry]) => {
      for (const [name, amount] of entry.categories)
        categories.set(name, (categories.get(name) ?? 0) + amount);
      for (const model of entry.models.values()) {
        const current = models.get(model.name) ?? {
          name: model.name,
          requests: 0,
          inputTokens: 0,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        };
        current.requests = (current.requests ?? 0) + (model.requests ?? 0);
        current.inputTokens += model.inputTokens;
        current.cacheReadTokens += model.cacheReadTokens;
        current.cacheWriteTokens += model.cacheWriteTokens;
        current.outputTokens += model.outputTokens;
        current.totalTokens += model.totalTokens;
        models.set(model.name, current);
      }
      const { categories: _categories, models: _models, ...day } = entry;
      return day;
    });
  const amount = historyDaily.reduce((total, day) => total + day.amount, 0);
  const requests = historyDaily.reduce((total, day) => total + (day.requests ?? 0), 0);
  const totalTokens = historyDaily.reduce((total, day) => total + day.totalTokens, 0);
  return {
    provider: "openai",
    displayName: "OpenAI",
    windows: [],
    plan: params.projectId ? `Admin API · ${params.projectId}` : "Admin API",
    billing: [
      {
        type: "spend",
        label: `${params.periodDays}-day API spend`,
        amount,
        unit: "USD",
        period: `${params.periodDays}d`,
      },
    ],
    costHistory: {
      unit: "USD",
      periodDays: params.periodDays,
      ...(params.projectId ? { scope: `Project ${params.projectId}` } : {}),
      daily: historyDaily,
      models: [...models.values()].toSorted(
        (a, b) => b.totalTokens - a.totalTokens || a.name.localeCompare(b.name),
      ),
      categories: [...categories.entries()]
        .map(([name, categoryAmount]) => ({
          name,
          amount: categoryAmount,
        }))
        .toSorted((a, b) => b.amount - a.amount || a.name.localeCompare(b.name)),
    },
    summary: `${requests.toLocaleString("en-US")} requests · ${totalTokens.toLocaleString("en-US")} tokens`,
  };
}
async function fetchOpenAIAdminUsage(params) {
  const periodDays = Math.max(
    1,
    Math.min(31, Math.trunc(params.periodDays ?? OPENAI_USAGE_HISTORY_DAYS)),
  );
  const range = resolveDailyRange(params.now ?? Date.now(), periodDays);
  const common = {
    apiKey: params.apiKey,
    projectId: params.projectId,
    startTime: range.startTime,
    endTime: range.endTime,
    periodDays,
    timeoutMs: params.timeoutMs,
    fetchFn: params.fetchFn,
  };
  const [costs, completions] = await Promise.all([
    fetchPages({
      ...common,
      baseUrl: OPENAI_COSTS_URL,
      groupBy: "line_item",
    }),
    fetchPages({
      ...common,
      baseUrl: OPENAI_COMPLETIONS_USAGE_URL,
      groupBy: "model",
    }),
  ]);
  if (!costs.ok || !completions.ok) {
    const failedStatus = !costs.ok ? costs.status : !completions.ok ? completions.status : void 0;
    if (failedStatus === 401 || failedStatus === 403)
      return {
        provider: "openai",
        displayName: "OpenAI",
        windows: [],
        error: "Admin API key required",
      };
    return failedStatus
      ? buildUsageHttpErrorSnapshot({
          provider: "openai",
          status: failedStatus,
        })
      : {
          provider: "openai",
          displayName: "OpenAI",
          windows: [],
          error: "Usage unavailable",
        };
  }
  return aggregateHistory({
    costs: costs.data,
    completions: completions.data,
    periodDays,
    projectId: params.projectId,
  });
}
async function resolveOpenAIUsageAuth(ctx) {
  const explicitAdminKey = cleanCredential(ctx.env.OPENAI_ADMIN_KEY);
  if (explicitAdminKey) return { token: encodeAdminToken(explicitAdminKey) };
  const oauth = await ctx.resolveOAuthToken();
  if (oauth) return oauth;
  return { handled: true };
}
async function fetchOpenAIUsage(ctx) {
  const adminKey = decodeAdminToken(ctx.token);
  if (!adminKey) {
    const snapshot = await fetchCodexUsage(ctx.token, ctx.accountId, ctx.timeoutMs, ctx.fetchFn);
    if (snapshot.error) return snapshot;
    const { token: accessToken, email: profileEmail } = ctx;
    const accountEmail =
      resolveCodexAuthIdentity({
        accessToken,
        email: profileEmail,
      }).email ?? profileEmail;
    return accountEmail
      ? {
          ...snapshot,
          accountEmail,
        }
      : snapshot;
  }
  return await fetchOpenAIAdminUsage({
    apiKey: adminKey,
    projectId: cleanCredential(ctx.env.OPENAI_PROJECT_ID),
    timeoutMs: ctx.timeoutMs,
    fetchFn: ctx.fetchFn,
  });
}
//#endregion
export { fetchOpenAIUsage as n, resolveOpenAIUsageAuth as r, fetchOpenAIAdminUsage as t };
