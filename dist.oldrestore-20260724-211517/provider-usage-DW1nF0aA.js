import { t as expectDefined } from "./expect-CyE8FADM.js";
import {
  _ as parseStrictFiniteNumber,
  g as parseFiniteNumber$1,
  j as resolveTimerTimeoutMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import "./src-Bl7G9qvi.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import { c as resolveProviderRequestHeaders } from "./provider-request-config-DpW-uV6A.js";
import "./parse-finite-number-Z7n6tXLk.js";
import "./utils-DtcDeqWS.js";
import {
  n as PROVIDER_LABELS,
  o as providerUsageLabel,
  r as clampPercent,
  s as resolveProviderUsageDisplayName,
} from "./provider-usage.shared-BtRIPHWE.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
//#region src/infra/provider-usage.fetch.shared.ts
/** Fetches JSON-compatible provider usage endpoints with an abort timeout. */
async function fetchJson(url, init, timeoutMs, fetchFn) {
  const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
  const controller = new AbortController();
  const timer = setTimeout(controller.abort.bind(controller), safeTimeoutMs);
  try {
    return await fetchFn(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
async function discardUsageResponseBody(response) {
  if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
function parseFiniteNumber(value) {
  return parseFiniteNumber$1(value);
}
/** Builds a provider usage snapshot for non-HTTP fetch or parse failures. */
function buildUsageErrorSnapshot(provider, error) {
  return {
    provider,
    displayName: resolveProviderUsageDisplayName(provider),
    windows: [],
    error,
  };
}
function buildUsageHttpErrorSnapshot(options) {
  if ((options.tokenExpiredStatuses ?? []).includes(options.status))
    return buildUsageErrorSnapshot(options.provider, "Token expired");
  const suffix = options.message?.trim() ? `: ${options.message.trim()}` : "";
  return buildUsageErrorSnapshot(options.provider, `HTTP ${options.status}${suffix}`);
}
async function readUsageJson(provider, response) {
  try {
    return {
      ok: true,
      data: await readProviderJsonResponse(response, `${provider} usage`),
    };
  } catch {
    return {
      ok: false,
      snapshot: buildUsageErrorSnapshot(provider, "Malformed usage response"),
    };
  }
}
//#endregion
//#region src/infra/provider-usage.fetch.claude.ts
function buildClaudeUsageWindows(data, options) {
  const windows = [];
  if (data.five_hour?.utilization !== void 0)
    windows.push({
      label: "5h",
      usedPercent: clampPercent(data.five_hour.utilization),
      resetAt: data.five_hour.resets_at ? new Date(data.five_hour.resets_at).getTime() : void 0,
    });
  if (data.seven_day?.utilization !== void 0)
    windows.push({
      label: "Week",
      usedPercent: clampPercent(data.seven_day.utilization),
      resetAt: data.seven_day.resets_at ? new Date(data.seven_day.resets_at).getTime() : void 0,
    });
  const modelWindow = data.seven_day_sonnet || data.seven_day_opus;
  if (modelWindow?.utilization !== void 0)
    windows.push({
      label: data.seven_day_sonnet ? "Sonnet" : "Opus",
      usedPercent: clampPercent(modelWindow.utilization),
    });
  const knownLabels = new Set(windows.map((window) => window.label.toLowerCase()));
  for (const limit of data.limits ?? []) {
    if (limit.is_active === false || !Number.isFinite(limit.percent)) continue;
    const model = limit.scope?.model;
    const label = model?.display_name?.trim() || model?.id?.trim();
    if (!label || knownLabels.has(label.toLowerCase())) continue;
    knownLabels.add(label.toLowerCase());
    windows.push({
      label,
      usedPercent: clampPercent(limit.percent ?? 0),
      resetAt: limit.resets_at ? new Date(limit.resets_at).getTime() : void 0,
    });
  }
  if (
    !options?.skipExtraUsage &&
    data.extra_usage?.is_enabled &&
    Number.isFinite(data.extra_usage.utilization)
  )
    windows.push({
      label: "Extra usage",
      usedPercent: clampPercent(data.extra_usage.utilization ?? 0),
    });
  return windows;
}
function resolveClaudeWebSessionKey() {
  const direct =
    process.env.CLAUDE_AI_SESSION_KEY?.trim() ?? process.env.CLAUDE_WEB_SESSION_KEY?.trim();
  if (direct?.startsWith("sk-ant-")) return direct;
  const cookieHeader = process.env.CLAUDE_WEB_COOKIE?.trim();
  if (!cookieHeader) return;
  const value = cookieHeader
    .replace(/^cookie:\s*/i, "")
    .match(/(?:^|;\s*)sessionKey=([^;\s]+)/i)?.[1]
    ?.trim();
  return value?.startsWith("sk-ant-") ? value : void 0;
}
async function fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn) {
  const headers = {
    Cookie: `sessionKey=${sessionKey}`,
    Accept: "application/json",
  };
  const orgRes = await fetchJson(
    "https://claude.ai/api/organizations",
    { headers },
    timeoutMs,
    fetchFn,
  );
  if (!orgRes.ok) {
    await discardUsageResponseBody(orgRes);
    return null;
  }
  const parsedOrgs = await readUsageJson("anthropic", orgRes);
  if (!parsedOrgs.ok) return null;
  const orgId = parsedOrgs.data?.[0]?.uuid?.trim();
  if (!orgId) return null;
  const usageRes = await fetchJson(
    `https://claude.ai/api/organizations/${orgId}/usage`,
    { headers },
    timeoutMs,
    fetchFn,
  );
  if (!usageRes.ok) {
    await discardUsageResponseBody(usageRes);
    return null;
  }
  const parsedUsage = await readUsageJson("anthropic", usageRes);
  if (!parsedUsage.ok) return null;
  const data = parsedUsage.data;
  const windows = buildClaudeUsageWindows(data);
  if (windows.length === 0) return null;
  return {
    provider: "anthropic",
    displayName: PROVIDER_LABELS.anthropic,
    windows,
  };
}
async function fetchClaudeUsage(token, timeoutMs, fetchFn) {
  const res = await fetchJson(
    "https://api.anthropic.com/api/oauth/usage",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "openclaw",
        Accept: "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "oauth-2025-04-20",
      },
    },
    timeoutMs,
    fetchFn,
  );
  if (!res.ok) {
    let message;
    try {
      const raw = (await readProviderJsonResponse(res, "Anthropic usage error"))?.error?.message;
      if (typeof raw === "string" && raw.trim()) message = raw.trim();
    } catch {}
    if (res.status === 403 && message?.includes("scope requirement user:profile")) {
      const sessionKey = resolveClaudeWebSessionKey();
      if (sessionKey) {
        const web = await fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn);
        if (web) return web;
      }
    }
    return buildUsageHttpErrorSnapshot({
      provider: "anthropic",
      status: res.status,
      message,
    });
  }
  const parsed = await readUsageJson("anthropic", res);
  if (!parsed.ok) return parsed.snapshot;
  const data = parsed.data;
  const extra = data.extra_usage;
  const unit = extra?.currency?.trim().toUpperCase() || "USD";
  const billing =
    extra?.is_enabled === true &&
    typeof extra.used_credits === "number" &&
    Number.isFinite(extra.used_credits) &&
    extra.used_credits >= 0 &&
    typeof extra.monthly_limit === "number" &&
    Number.isFinite(extra.monthly_limit) &&
    extra.monthly_limit >= 0
      ? [
          {
            type: "budget",
            used: extra.used_credits / 100,
            limit: extra.monthly_limit / 100,
            unit,
            period: "month",
          },
        ]
      : void 0;
  const windows = buildClaudeUsageWindows(data, { skipExtraUsage: Boolean(billing) });
  return {
    provider: "anthropic",
    displayName: PROVIDER_LABELS.anthropic,
    windows,
    ...(billing ? { billing } : {}),
  };
}
//#endregion
//#region src/infra/provider-usage.fetch.codex.ts
const WEEKLY_RESET_GAP_SECONDS = 4320 * 60;
function resolveSecondaryWindowLabel(params) {
  if (params.windowHours >= 168) return "Week";
  if (params.windowHours < 24) return `${params.windowHours}h`;
  if (
    typeof params.secondaryResetAt === "number" &&
    typeof params.primaryResetAt === "number" &&
    params.secondaryResetAt - params.primaryResetAt >= WEEKLY_RESET_GAP_SECONDS
  )
    return "Week";
  return "Day";
}
async function fetchCodexUsage(token, accountId, timeoutMs, fetchFn) {
  const version = process.env.OPENCLAW_VERSION?.trim();
  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    originator: "openclaw",
    ...(version ? { version } : {}),
    "User-Agent": `openclaw/${version || "dev"}`,
  };
  if (accountId) defaultHeaders["ChatGPT-Account-Id"] = accountId;
  const res = await fetchJson(
    "https://chatgpt.com/backend-api/wham/usage",
    {
      method: "GET",
      headers:
        resolveProviderRequestHeaders({
          provider: "openai",
          baseUrl: "https://chatgpt.com/backend-api/wham/usage",
          capability: "other",
          transport: "http",
          defaultHeaders,
        }) ?? defaultHeaders,
    },
    timeoutMs,
    fetchFn,
  );
  if (!res.ok) {
    await discardUsageResponseBody(res);
    return buildUsageHttpErrorSnapshot({
      provider: "openai",
      status: res.status,
      tokenExpiredStatuses: [401, 403],
    });
  }
  const parsed = await readUsageJson("openai", res);
  if (!parsed.ok) return parsed.snapshot;
  const data = parsed.data;
  const windows = [];
  if (data.rate_limit?.primary_window) {
    const pw = data.rate_limit.primary_window;
    const windowHours = Math.round((pw.limit_window_seconds || 10800) / 3600);
    windows.push({
      label: `${windowHours}h`,
      usedPercent: clampPercent(pw.used_percent || 0),
      resetAt: pw.reset_at ? pw.reset_at * 1e3 : void 0,
    });
  }
  if (data.rate_limit?.secondary_window) {
    const sw = data.rate_limit.secondary_window;
    const label = resolveSecondaryWindowLabel({
      windowHours: Math.round((sw.limit_window_seconds || 86400) / 3600),
      primaryResetAt: data.rate_limit?.primary_window?.reset_at,
      secondaryResetAt: sw.reset_at,
    });
    windows.push({
      label,
      usedPercent: clampPercent(sw.used_percent || 0),
      resetAt: sw.reset_at ? sw.reset_at * 1e3 : void 0,
    });
  }
  const plan = data.plan_type;
  let billing;
  if (data.credits?.balance !== void 0 && data.credits.balance !== null) {
    const balance =
      typeof data.credits.balance === "number"
        ? data.credits.balance
        : parseStrictFiniteNumber(data.credits.balance);
    if (balance !== void 0 && balance >= 0)
      billing = [
        {
          type: "balance",
          amount: balance,
          unit: "credits",
        },
      ];
  }
  return {
    provider: "openai",
    displayName: PROVIDER_LABELS.openai,
    windows,
    plan,
    ...(billing ? { billing } : {}),
  };
}
//#endregion
//#region src/infra/provider-usage.fetch.deepseek.ts
const DEEPSEEK_BALANCE_URL = "https://api.deepseek.com/user/balance";
function formatCurrencyAmount(amount, currency) {
  const normalized = currency?.trim().toUpperCase();
  if (normalized === "CNY" || normalized === "RMB") return `¥${amount.toFixed(2)}`;
  if (normalized === "USD") return `$${amount.toFixed(2)}`;
  return normalized ? `${amount.toFixed(2)} ${normalized}` : amount.toFixed(2);
}
function parseBalanceAmount(value) {
  return parseFiniteNumber(value);
}
function buildBalanceSummary(info) {
  const total = parseBalanceAmount(info.total_balance);
  if (total === void 0) return;
  const granted = parseBalanceAmount(info.granted_balance);
  const toppedUp = parseBalanceAmount(info.topped_up_balance);
  const parts = [`Balance ${formatCurrencyAmount(total, info.currency)}`];
  if (granted !== void 0 && granted > 0)
    parts.push(`Granted ${formatCurrencyAmount(granted, info.currency)}`);
  if (toppedUp !== void 0 && toppedUp > 0 && toppedUp !== total)
    parts.push(`Topped up ${formatCurrencyAmount(toppedUp, info.currency)}`);
  return parts.join(" · ");
}
async function fetchDeepSeekUsage(apiKey, timeoutMs, fetchFn) {
  const res = await fetchJson(
    DEEPSEEK_BALANCE_URL,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
    timeoutMs,
    fetchFn,
  );
  if (!res.ok) {
    await discardUsageResponseBody(res);
    return buildUsageHttpErrorSnapshot({
      provider: "deepseek",
      status: res.status,
    });
  }
  const parsed = await readUsageJson("deepseek", res);
  if (!parsed.ok) return parsed.snapshot;
  const data = parsed.data;
  const balances = Array.isArray(data.balance_infos) ? data.balance_infos : [];
  const summary = balances
    .map((info) => buildBalanceSummary(info))
    .filter((entry) => Boolean(entry))
    .join(" · ");
  const billing = balances.flatMap((info) => {
    const amount = parseBalanceAmount(info.total_balance);
    if (amount === void 0 || amount < 0) return [];
    return [
      {
        type: "balance",
        amount,
        unit: info.currency?.trim().toUpperCase() || "credits",
      },
    ];
  });
  if (!summary)
    return {
      provider: "deepseek",
      displayName: PROVIDER_LABELS.deepseek,
      windows: [],
      error: "No balance data",
    };
  return {
    provider: "deepseek",
    displayName: PROVIDER_LABELS.deepseek,
    windows: [],
    billing,
    summary,
    ...(data.is_available === false ? { plan: "Unavailable" } : {}),
  };
}
//#endregion
//#region src/infra/provider-usage.fetch.gemini.ts
async function fetchGeminiUsage(token, timeoutMs, fetchFn, provider) {
  const res = await fetchJson(
    "https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    },
    timeoutMs,
    fetchFn,
  );
  if (!res.ok) {
    await discardUsageResponseBody(res);
    return buildUsageHttpErrorSnapshot({
      provider,
      status: res.status,
    });
  }
  const parsed = await readUsageJson(provider, res);
  if (!parsed.ok) return parsed.snapshot;
  const data = parsed.data;
  const quotas = {};
  for (const bucket of data.buckets || []) {
    const model = bucket.modelId || "unknown";
    const frac = bucket.remainingFraction ?? 1;
    if (!quotas[model] || frac < quotas[model]) quotas[model] = frac;
  }
  const windows = [];
  let proMin = 1;
  let flashMin = 1;
  let hasPro = false;
  let hasFlash = false;
  for (const [model, frac] of Object.entries(quotas)) {
    const lower = normalizeLowercaseStringOrEmpty(model);
    if (lower.includes("pro")) {
      hasPro = true;
      if (frac < proMin) proMin = frac;
    }
    if (lower.includes("flash")) {
      hasFlash = true;
      if (frac < flashMin) flashMin = frac;
    }
  }
  if (hasPro)
    windows.push({
      label: "Pro",
      usedPercent: clampPercent((1 - proMin) * 100),
    });
  if (hasFlash)
    windows.push({
      label: "Flash",
      usedPercent: clampPercent((1 - flashMin) * 100),
    });
  return {
    provider,
    displayName: expectDefined(providerUsageLabel(provider), "gemini provider usage label"),
    windows,
  };
}
//#endregion
//#region src/infra/provider-usage.fetch.minimax.ts
const DEFAULT_MINIMAX_USAGE_ORIGIN = "https://api.minimaxi.com";
const MINIMAX_USAGE_PATH = "/v1/token_plan/remains";
const RESET_KEYS = [
  "reset_at",
  "resetAt",
  "reset_time",
  "resetTime",
  "next_reset_at",
  "nextResetAt",
  "next_reset_time",
  "nextResetTime",
  "expires_at",
  "expiresAt",
  "expire_at",
  "expireAt",
  "end_time",
  "endTime",
  "window_end",
  "windowEnd",
];
const PERCENT_KEYS = [
  "used_percent",
  "usedPercent",
  "used_rate",
  "usage_rate",
  "used_ratio",
  "usage_ratio",
  "usedRatio",
  "usageRatio",
];
const REMAINING_PERCENT_KEYS = ["usage_percent", "usagePercent"];
const USED_KEYS = [
  "used",
  "usage",
  "used_amount",
  "usedAmount",
  "used_tokens",
  "usedTokens",
  "used_quota",
  "usedQuota",
  "used_times",
  "usedTimes",
  "prompt_used",
  "promptUsed",
  "used_prompt",
  "usedPrompt",
  "prompts_used",
  "promptsUsed",
  "consumed",
];
const TOTAL_KEYS = [
  "total",
  "total_amount",
  "totalAmount",
  "total_tokens",
  "totalTokens",
  "total_quota",
  "totalQuota",
  "total_times",
  "totalTimes",
  "prompt_total",
  "promptTotal",
  "total_prompt",
  "totalPrompt",
  "prompt_limit",
  "promptLimit",
  "limit_prompt",
  "limitPrompt",
  "prompts_total",
  "promptsTotal",
  "total_prompts",
  "totalPrompts",
  "current_interval_total_count",
  "currentIntervalTotalCount",
  "current_weekly_total_count",
  "currentWeeklyTotalCount",
  "limit",
  "quota",
  "quota_limit",
  "quotaLimit",
  "max",
];
const REMAINING_KEYS = [
  "remain",
  "remaining",
  "remain_amount",
  "remainingAmount",
  "remaining_amount",
  "remain_tokens",
  "remainingTokens",
  "remaining_tokens",
  "remain_quota",
  "remainingQuota",
  "remaining_quota",
  "remain_times",
  "remainingTimes",
  "remaining_times",
  "prompt_remain",
  "promptRemain",
  "remain_prompt",
  "remainPrompt",
  "prompt_remaining",
  "promptRemaining",
  "remaining_prompt",
  "remainingPrompt",
  "prompts_remaining",
  "promptsRemaining",
  "prompt_left",
  "promptLeft",
  "prompts_left",
  "promptsLeft",
  "left",
  "current_interval_usage_count",
  "currentIntervalUsageCount",
  "current_weekly_usage_count",
  "currentWeeklyUsageCount",
];
const PLAN_KEYS = ["plan", "plan_name", "planName", "product", "tier"];
const WINDOW_HOUR_KEYS = [
  "window_hours",
  "windowHours",
  "duration_hours",
  "durationHours",
  "hours",
];
const WINDOW_MINUTE_KEYS = [
  "window_minutes",
  "windowMinutes",
  "duration_minutes",
  "durationMinutes",
  "minutes",
];
function pickNumber(record, keys) {
  for (const key of keys) {
    const parsed = parseFiniteNumber(record[key]);
    if (parsed !== void 0) return parsed;
  }
}
function pickString(record, keys) {
  return readTrimmedStringAlias(record, keys);
}
function parseEpoch(value) {
  if (typeof value === "number" && Number.isFinite(value))
    return asDateTimestampMs(value < 0xe8d4a51000 ? Math.floor(value * 1e3) : Math.floor(value));
  if (typeof value === "string" && value.trim()) return asDateTimestampMs(Date.parse(value));
}
function hasAny(record, keys) {
  return keys.some((key) => key in record);
}
function scoreUsageRecord(record) {
  let score = 0;
  if (hasAny(record, PERCENT_KEYS)) score += 4;
  if (hasAny(record, TOTAL_KEYS)) score += 3;
  if (hasAny(record, USED_KEYS) || hasAny(record, REMAINING_KEYS)) score += 2;
  if (hasAny(record, RESET_KEYS)) score += 1;
  if (hasAny(record, PLAN_KEYS)) score += 1;
  return score;
}
function collectUsageCandidates(root) {
  const MAX_SCAN_DEPTH = 4;
  const MAX_SCAN_NODES = 60;
  const queue = [
    {
      value: root,
      depth: 0,
    },
  ];
  const seen = /* @__PURE__ */ new Set();
  const candidates = [];
  let scanned = 0;
  while (queue.length && scanned < MAX_SCAN_NODES) {
    const next = queue.shift();
    scanned += 1;
    const { value, depth } = next;
    if (isRecord(value)) {
      if (seen.has(value)) continue;
      seen.add(value);
      const score = scoreUsageRecord(value);
      if (score > 0)
        candidates.push({
          record: value,
          score,
          depth,
        });
      if (depth < MAX_SCAN_DEPTH) {
        for (const nested of Object.values(value))
          if (isRecord(nested) || Array.isArray(nested))
            queue.push({
              value: nested,
              depth: depth + 1,
            });
      }
      continue;
    }
    if (Array.isArray(value) && depth < MAX_SCAN_DEPTH) {
      for (const nested of value)
        if (isRecord(nested) || Array.isArray(nested))
          queue.push({
            value: nested,
            depth: depth + 1,
          });
    }
  }
  candidates.sort((a, b) => b.score - a.score || a.depth - b.depth);
  return candidates.map((candidate) => candidate.record);
}
function deriveWindowLabelFromTimestamps(record) {
  const startTime = parseEpoch(record.start_time ?? record.startTime);
  const endTime = parseEpoch(record.end_time ?? record.endTime);
  if (startTime !== void 0 && endTime !== void 0 && endTime > startTime) {
    const durationHours = (endTime - startTime) / 36e5;
    if (durationHours >= 1 && Number.isFinite(durationHours))
      return `${Math.round(durationHours)}h`;
    const durationMinutes = Math.round((endTime - startTime) / 6e4);
    if (durationMinutes > 0) return `${durationMinutes}m`;
  }
}
function deriveWindowLabel(payload) {
  const hours = pickNumber(payload, WINDOW_HOUR_KEYS);
  if (hours && Number.isFinite(hours)) return `${hours}h`;
  const minutes = pickNumber(payload, WINDOW_MINUTE_KEYS);
  if (minutes && Number.isFinite(minutes)) return `${minutes}m`;
  const fromTimestamps = deriveWindowLabelFromTimestamps(payload);
  if (fromTimestamps) return fromTimestamps;
  return "5h";
}
function deriveUsedPercent(payload) {
  const total = pickNumber(payload, TOTAL_KEYS);
  let used = pickNumber(payload, USED_KEYS);
  const remaining = pickNumber(payload, REMAINING_KEYS);
  if (used === void 0 && remaining !== void 0 && total !== void 0) used = total - remaining;
  const fromCounts =
    total && total > 0 && used !== void 0 && Number.isFinite(used)
      ? clampPercent((used / total) * 100)
      : null;
  if (fromCounts !== null) return fromCounts;
  const percentRaw = pickNumber(payload, PERCENT_KEYS);
  if (percentRaw !== void 0) return clampPercent(percentRaw <= 1 ? percentRaw * 100 : percentRaw);
  const remainingPercentRaw = pickNumber(payload, REMAINING_PERCENT_KEYS);
  if (remainingPercentRaw !== void 0)
    return clampPercent(
      100 -
        clampPercent(remainingPercentRaw <= 1 ? remainingPercentRaw * 100 : remainingPercentRaw),
    );
  return null;
}
function pickChatModelRemains(modelRemains) {
  const records = modelRemains.filter(isRecord);
  if (records.length === 0) return;
  const chatRecord = records.find((r) => {
    const name = typeof r.model_name === "string" ? r.model_name : "";
    const total = parseFiniteNumber(r.current_interval_total_count);
    return (
      normalizeLowercaseStringOrEmpty(name).startsWith("minimax-m") && total !== void 0 && total > 0
    );
  });
  if (chatRecord) return chatRecord;
  return records.find((r) => {
    const total = parseFiniteNumber(r.current_interval_total_count);
    return total !== void 0 && total > 0;
  });
}
function resolveMinimaxUsageUrl(baseUrl) {
  const trimmed = baseUrl?.trim();
  if (!trimmed) return `${DEFAULT_MINIMAX_USAGE_ORIGIN}${MINIMAX_USAGE_PATH}`;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:")
      return `${parsed.origin}${MINIMAX_USAGE_PATH}`;
  } catch {}
  return `${DEFAULT_MINIMAX_USAGE_ORIGIN}${MINIMAX_USAGE_PATH}`;
}
async function fetchMinimaxUsage(apiKey, timeoutMs, fetchFn, options) {
  const res = await fetchJson(
    resolveMinimaxUsageUrl(options?.baseUrl),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "MM-API-Source": "OpenClaw",
      },
    },
    timeoutMs,
    fetchFn,
  );
  if (!res.ok) {
    await discardUsageResponseBody(res);
    return buildUsageHttpErrorSnapshot({
      provider: "minimax",
      status: res.status,
    });
  }
  const data = await readProviderJsonResponse(res, "minimax usage").catch(() => null);
  if (!isRecord(data))
    return {
      provider: "minimax",
      displayName: PROVIDER_LABELS.minimax,
      windows: [],
      error: "Invalid JSON",
    };
  const baseResp = isRecord(data.base_resp) ? data.base_resp : void 0;
  if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0)
    return {
      provider: "minimax",
      displayName: PROVIDER_LABELS.minimax,
      windows: [],
      error: baseResp.status_msg?.trim() || "API error",
    };
  const payload = isRecord(data.data) ? data.data : data;
  const modelRemains = Array.isArray(payload.model_remains) ? payload.model_remains : null;
  const chatRemains = modelRemains ? pickChatModelRemains(modelRemains) : void 0;
  const usageSource = chatRemains ?? payload;
  const candidates = collectUsageCandidates(usageSource);
  let usageRecord = usageSource;
  let usedPercent = null;
  for (const candidate of candidates) {
    const candidatePercent = deriveUsedPercent(candidate);
    if (candidatePercent !== null) {
      usageRecord = candidate;
      usedPercent = candidatePercent;
      break;
    }
  }
  if (usedPercent === null) usedPercent = deriveUsedPercent(usageSource);
  if (usedPercent === null)
    return {
      provider: "minimax",
      displayName: PROVIDER_LABELS.minimax,
      windows: [],
      error: "Unsupported response shape",
    };
  const resetAt =
    parseEpoch(pickString(usageRecord, RESET_KEYS)) ??
    parseEpoch(pickNumber(usageRecord, RESET_KEYS)) ??
    parseEpoch(pickString(payload, RESET_KEYS)) ??
    parseEpoch(pickNumber(payload, RESET_KEYS));
  const windows = [
    {
      label: chatRemains ? deriveWindowLabel(chatRemains) : deriveWindowLabel(usageRecord),
      usedPercent,
      resetAt,
    },
  ];
  const modelName =
    chatRemains && typeof chatRemains.model_name === "string" ? chatRemains.model_name : void 0;
  const plan =
    pickString(usageRecord, PLAN_KEYS) ??
    pickString(payload, PLAN_KEYS) ??
    (modelName ? `Coding Plan · ${modelName}` : void 0);
  return {
    provider: "minimax",
    displayName: PROVIDER_LABELS.minimax,
    windows,
    plan,
  };
}
//#endregion
//#region src/infra/provider-usage.fetch.zai.ts
async function fetchZaiUsage(apiKey, timeoutMs, fetchFn) {
  const res = await fetchJson(
    "https://api.z.ai/api/monitor/usage/quota/limit",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
    timeoutMs,
    fetchFn,
  );
  if (!res.ok) {
    await discardUsageResponseBody(res);
    return buildUsageHttpErrorSnapshot({
      provider: "zai",
      status: res.status,
    });
  }
  const parsed = await readUsageJson("zai", res);
  if (!parsed.ok) return parsed.snapshot;
  const data = parsed.data;
  if (!data.success || data.code !== 200) {
    const errorMessage = typeof data.msg === "string" ? data.msg.trim() : "";
    return {
      provider: "zai",
      displayName: PROVIDER_LABELS.zai,
      windows: [],
      error: errorMessage || "API error",
    };
  }
  const windows = [];
  const limits = data.data?.limits || [];
  for (const limit of limits) {
    const percent = clampPercent(limit.percentage || 0);
    const nextReset = limit.nextResetTime ? new Date(limit.nextResetTime).getTime() : void 0;
    let windowLabel = "Limit";
    if (limit.unit === 1) windowLabel = `${limit.number}d`;
    else if (limit.unit === 3) windowLabel = `${limit.number}h`;
    else if (limit.unit === 5) windowLabel = `${limit.number}m`;
    if (limit.type === "TOKENS_LIMIT")
      windows.push({
        label: `Tokens (${windowLabel})`,
        usedPercent: percent,
        resetAt: nextReset,
      });
    else if (limit.type === "TIME_LIMIT")
      windows.push({
        label: "Monthly",
        usedPercent: percent,
        resetAt: nextReset,
      });
  }
  const planName = data.data?.planName || data.data?.plan || void 0;
  return {
    provider: "zai",
    displayName: PROVIDER_LABELS.zai,
    windows,
    plan: planName,
  };
}
//#endregion
export {
  fetchCodexUsage as a,
  buildUsageHttpErrorSnapshot as c,
  fetchDeepSeekUsage as i,
  fetchJson as l,
  fetchMinimaxUsage as n,
  fetchClaudeUsage as o,
  fetchGeminiUsage as r,
  buildUsageErrorSnapshot as s,
  fetchZaiUsage as t,
};
