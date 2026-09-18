import { t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-CpgfT8aN.js";
import { o as readClaudeCliCredentialsCached } from "./external-auth-aN0UYCd0.js";
import "./response-limit-runtime-B_DBKaLw.js";
import "./provider-auth-mypr64nh.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { n as validateAnthropicSetupToken } from "./provider-auth-token-DyHOhkct.js";
import {
  c as buildUsageHttpErrorSnapshot,
  o as fetchClaudeUsage,
} from "./provider-usage-DW1nF0aA.js";
//#region extensions/anthropic/usage.ts
const ANTHROPIC_COST_URL = "https://api.anthropic.com/v1/organizations/cost_report";
const ANTHROPIC_MESSAGES_USAGE_URL =
  "https://api.anthropic.com/v1/organizations/usage_report/messages";
const ANTHROPIC_ADMIN_TOKEN_PREFIX = "openclaw:anthropic-admin:v1:";
const ANTHROPIC_USAGE_RESPONSE_MAX_BYTES = 4 * 1024 * 1024;
const ANTHROPIC_USAGE_HISTORY_DAYS = 30;
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
function normalizeAdminKey(raw) {
  const cleaned = cleanCredential(raw);
  if (!cleaned) return;
  const withoutBearer = cleaned.toLowerCase().startsWith("bearer ")
    ? cleaned.slice(7).trim()
    : cleaned;
  return withoutBearer.toLowerCase().startsWith("sk-ant-admin") ? withoutBearer : void 0;
}
function encodeAdminToken(token) {
  return `${ANTHROPIC_ADMIN_TOKEN_PREFIX}${JSON.stringify({ token })}`;
}
function decodeAdminToken(raw) {
  if (!raw.startsWith(ANTHROPIC_ADMIN_TOKEN_PREFIX)) return;
  try {
    const token = objectRecord(JSON.parse(raw.slice(28)))?.token;
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
function utcDay(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : void 0;
}
function emptyDaily(date) {
  return {
    date,
    amount: 0,
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
    startingAt: /* @__PURE__ */ new Date(todayStart - (periodDays - 1) * 864e5).toISOString(),
    endingAt: new Date(todayStart + 864e5).toISOString(),
  };
}
async function readPage(response, timeoutMs) {
  const buffer = await readResponseWithLimit(response, ANTHROPIC_USAGE_RESPONSE_MAX_BYTES, {
    chunkTimeoutMs: timeoutMs,
    onOverflow: ({ maxBytes }) =>
      /* @__PURE__ */ new Error(`Anthropic usage response exceeds ${maxBytes} bytes`),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(`Anthropic usage response stalled for ${chunkTimeoutMs}ms`),
  });
  const payload = objectRecord(JSON.parse(new TextDecoder().decode(buffer)));
  if (!payload || !Array.isArray(payload.data))
    throw new Error("Anthropic usage response is not an object with data");
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
    url.searchParams.set("starting_at", params.startingAt);
    url.searchParams.set("ending_at", params.endingAt);
    url.searchParams.set("bucket_width", "1d");
    url.searchParams.set("limit", String(params.periodDays));
    url.searchParams.set("group_by[]", params.groupBy);
    if (page) url.searchParams.set("page", page);
    let response;
    try {
      response = await params.fetchFn(url, {
        headers: {
          Accept: "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": params.apiKey,
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
    inputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
  current.inputTokens += usage.inputTokens;
  current.cacheReadTokens += usage.cacheReadTokens;
  current.cacheWriteTokens += usage.cacheWriteTokens;
  current.outputTokens += usage.outputTokens;
  current.totalTokens += usage.totalTokens;
  accumulator.models.set(name, current);
}
function aggregateHistory(params) {
  const daily = /* @__PURE__ */ new Map();
  const getDaily = (startingAt) => {
    const date = utcDay(startingAt);
    if (!date) return;
    const current = daily.get(date) ?? emptyDaily(date);
    daily.set(date, current);
    return current;
  };
  for (const rawBucket of params.costs) {
    const bucket = objectRecord(rawBucket);
    const startingAt = typeof bucket?.starting_at === "string" ? bucket.starting_at : void 0;
    if (!startingAt || !Array.isArray(bucket?.results)) continue;
    const accumulator = getDaily(startingAt);
    if (!accumulator) continue;
    for (const rawResult of bucket.results) {
      const result = objectRecord(rawResult);
      const amount = (finiteNumber(result?.amount) ?? 0) / 100;
      const category = displayName(result?.description ?? result?.cost_type, "Claude API");
      accumulator.amount += amount;
      accumulator.categories.set(category, (accumulator.categories.get(category) ?? 0) + amount);
    }
  }
  for (const rawBucket of params.messages) {
    const bucket = objectRecord(rawBucket);
    const startingAt = typeof bucket?.starting_at === "string" ? bucket.starting_at : void 0;
    if (!startingAt || !Array.isArray(bucket?.results)) continue;
    const accumulator = getDaily(startingAt);
    if (!accumulator) continue;
    for (const rawResult of bucket.results) {
      const result = objectRecord(rawResult);
      if (!result) continue;
      const cacheCreation = objectRecord(result.cache_creation);
      const inputTokens = nonNegativeInteger(result.uncached_input_tokens);
      const cacheWriteTokens =
        nonNegativeInteger(cacheCreation?.ephemeral_1h_input_tokens) +
        nonNegativeInteger(cacheCreation?.ephemeral_5m_input_tokens);
      const cacheReadTokens = nonNegativeInteger(result.cache_read_input_tokens);
      const outputTokens = nonNegativeInteger(result.output_tokens);
      const totalTokens = inputTokens + cacheWriteTokens + cacheReadTokens + outputTokens;
      accumulator.inputTokens += inputTokens;
      accumulator.cacheWriteTokens += cacheWriteTokens;
      accumulator.cacheReadTokens += cacheReadTokens;
      accumulator.outputTokens += outputTokens;
      accumulator.totalTokens += totalTokens;
      addModelUsage(accumulator, displayName(result.model, "Claude API"), {
        inputTokens,
        cacheReadTokens,
        cacheWriteTokens,
        outputTokens,
        totalTokens,
      });
    }
  }
  const categories = /* @__PURE__ */ new Map();
  const models = /* @__PURE__ */ new Map();
  const historyDaily = [...daily.values()]
    .toSorted((a, b) => a.date.localeCompare(b.date))
    .map((entry) => {
      for (const [name, amount] of entry.categories)
        categories.set(name, (categories.get(name) ?? 0) + amount);
      for (const model of entry.models.values()) {
        const current = models.get(model.name) ?? {
          name: model.name,
          inputTokens: 0,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        };
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
  const totalTokens = historyDaily.reduce((total, day) => total + day.totalTokens, 0);
  return {
    provider: "anthropic",
    displayName: "Anthropic",
    windows: [],
    plan: "Admin API",
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
    summary: `${totalTokens.toLocaleString("en-US")} tokens`,
  };
}
async function fetchAnthropicAdminUsage(params) {
  const periodDays = Math.max(
    1,
    Math.min(31, Math.trunc(params.periodDays ?? ANTHROPIC_USAGE_HISTORY_DAYS)),
  );
  const range = resolveDailyRange(params.now ?? Date.now(), periodDays);
  const common = {
    apiKey: params.apiKey,
    ...range,
    periodDays,
    timeoutMs: params.timeoutMs,
    fetchFn: params.fetchFn,
  };
  const [costs, messages] = await Promise.all([
    fetchPages({
      ...common,
      baseUrl: ANTHROPIC_COST_URL,
      groupBy: "description",
    }),
    fetchPages({
      ...common,
      baseUrl: ANTHROPIC_MESSAGES_USAGE_URL,
      groupBy: "model",
    }),
  ]);
  if (!costs.ok || !messages.ok) {
    const failedStatus = !costs.ok ? costs.status : !messages.ok ? messages.status : void 0;
    if (failedStatus === 401 || failedStatus === 403)
      return {
        provider: "anthropic",
        displayName: "Anthropic",
        windows: [],
        error: "Admin API key required",
      };
    return failedStatus
      ? buildUsageHttpErrorSnapshot({
          provider: "anthropic",
          status: failedStatus,
        })
      : {
          provider: "anthropic",
          displayName: "Anthropic",
          windows: [],
          error: "Usage unavailable",
        };
  }
  return aggregateHistory({
    costs: costs.data,
    messages: messages.data,
    periodDays,
  });
}
async function resolveAnthropicUsageAuth(ctx) {
  const explicitAdminKey =
    cleanCredential(ctx.env.ANTHROPIC_ADMIN_KEY) ??
    cleanCredential(ctx.env.ANTHROPIC_ADMIN_API_KEY);
  if (explicitAdminKey) return { token: encodeAdminToken(explicitAdminKey) };
  const storedAdminKey = ((await ctx.resolveApiKeyCandidatesFromConfigAndStore?.()) ?? [])
    .map(normalizeAdminKey)
    .find((candidate) => Boolean(candidate));
  if (storedAdminKey) return { token: encodeAdminToken(storedAdminKey) };
  const oauthToken = await ctx.resolveOAuthToken();
  if (oauthToken) return oauthToken;
  const claudeCliToken = await ctx.resolveOAuthToken({ provider: CLAUDE_CLI_BACKEND_ID });
  if (claudeCliToken) return claudeCliToken;
  const apiKey = ctx.resolveApiKeyFromConfigAndStore();
  const adminKey = normalizeAdminKey(apiKey);
  if (adminKey) return { token: encodeAdminToken(adminKey) };
  if (apiKey && validateAnthropicSetupToken(apiKey) === void 0) return { token: apiKey };
  return { handled: true };
}
/** Formats keychain plan metadata like ("max", "default_max_20x") as "Max (20x)". */
function formatClaudePlanLabel(subscriptionType, rateLimitTier) {
  const base = subscriptionType?.trim();
  if (!base) return;
  const label = base.charAt(0).toUpperCase() + base.slice(1);
  const tier = rateLimitTier?.trim().match(/_(\d+x)$/i)?.[1];
  return tier ? `${label} (${tier})` : label;
}
function resolveClaudePlanLabel(ctx) {
  const fromAuth = formatClaudePlanLabel(ctx.subscriptionType, ctx.rateLimitTier);
  if (fromAuth) return fromAuth;
  const credential = readClaudeCliCredentialsCached({
    allowKeychainPrompt: false,
    ttlMs: 5 * 6e4,
  });
  if (!credential || credential.type !== "oauth") return;
  return formatClaudePlanLabel(credential.subscriptionType, credential.rateLimitTier);
}
async function fetchAnthropicUsage(ctx) {
  const adminKey = decodeAdminToken(ctx.token);
  if (adminKey)
    return await fetchAnthropicAdminUsage({
      apiKey: adminKey,
      timeoutMs: ctx.timeoutMs,
      fetchFn: ctx.fetchFn,
    });
  const snapshot = await fetchClaudeUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn);
  if (snapshot.error) return snapshot;
  const accountEmail = ctx.email;
  const plan =
    snapshot.plan ?? (snapshot.windows.length > 0 ? resolveClaudePlanLabel(ctx) : void 0);
  return {
    ...snapshot,
    ...(plan ? { plan } : {}),
    ...(accountEmail ? { accountEmail } : {}),
  };
}
//#endregion
export {
  resolveAnthropicUsageAuth as i,
  fetchAnthropicUsage as n,
  formatClaudePlanLabel as r,
  fetchAnthropicAdminUsage as t,
};
