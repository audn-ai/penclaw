import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import "./response-limit-runtime-B_DBKaLw.js";
import { c as buildUsageHttpErrorSnapshot } from "./provider-usage-DW1nF0aA.js";
//#region extensions/openrouter/usage.ts
const OPENROUTER_USAGE_RESPONSE_MAX_BYTES = 1024 * 1024;
const OPENROUTER_API_ROOT = "https://openrouter.ai/api/v1";
function nonNegativeNumber(value) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : void 0;
}
function objectRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function resolveLimitReset(value) {
  return value === "daily" || value === "weekly" || value === "monthly" ? value : void 0;
}
function resolveKeyBudget(data) {
  const limit = nonNegativeNumber(data?.limit);
  if (limit === void 0) return;
  const period = resolveLimitReset(data?.limit_reset);
  const periodUsage =
    period === "daily"
      ? nonNegativeNumber(data?.usage_daily)
      : period === "weekly"
        ? nonNegativeNumber(data?.usage_weekly)
        : period === "monthly"
          ? nonNegativeNumber(data?.usage_monthly)
          : nonNegativeNumber(data?.usage);
  const remaining = nonNegativeNumber(data?.limit_remaining);
  const used = remaining === void 0 ? periodUsage : Math.max(0, limit - remaining);
  return used === void 0
    ? void 0
    : {
        used,
        limit,
        ...(period ? { period } : {}),
      };
}
async function readJson(response, timeoutMs) {
  const buffer = await readResponseWithLimit(response, OPENROUTER_USAGE_RESPONSE_MAX_BYTES, {
    chunkTimeoutMs: timeoutMs,
    onOverflow: ({ maxBytes }) =>
      /* @__PURE__ */ new Error(`OpenRouter usage response exceeds ${maxBytes} bytes`),
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(`OpenRouter usage response stalled for ${chunkTimeoutMs}ms`),
  });
  return JSON.parse(new TextDecoder().decode(buffer));
}
async function fetchEndpoint(params) {
  let response;
  try {
    response = await params.fetchFn(`${OPENROUTER_API_ROOT}/${params.path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      signal: AbortSignal.timeout(params.timeoutMs),
    });
  } catch {
    return {
      ok: false,
      reason: "transport",
    };
  }
  if (!response.ok) {
    await response.body?.cancel().catch(() => void 0);
    return {
      ok: false,
      status: response.status,
    };
  }
  try {
    const data = objectRecord(objectRecord(await readJson(response, params.timeoutMs))?.data);
    return data
      ? {
          ok: true,
          data,
        }
      : {
          ok: false,
          reason: "malformed",
        };
  } catch {
    return {
      ok: false,
      reason: "malformed",
    };
  }
}
async function fetchOpenRouterUsage(params) {
  const [creditsResult, keyResult] = await Promise.all([
    fetchEndpoint({
      ...params,
      path: "credits",
    }),
    fetchEndpoint({
      ...params,
      path: "key",
    }),
  ]);
  if (!creditsResult.ok && !keyResult.ok) {
    const status =
      "status" in creditsResult
        ? creditsResult.status
        : "status" in keyResult
          ? keyResult.status
          : void 0;
    if (status !== void 0)
      return buildUsageHttpErrorSnapshot({
        provider: "openrouter",
        status,
      });
    return {
      provider: "openrouter",
      displayName: "OpenRouter",
      windows: [],
      error: [creditsResult, keyResult].some(
        (result) => "reason" in result && result.reason === "transport",
      )
        ? "Usage unavailable"
        : "Malformed usage response",
    };
  }
  const credits = creditsResult.ok ? creditsResult.data : void 0;
  const key = keyResult.ok ? keyResult.data : void 0;
  const totalCredits = nonNegativeNumber(credits?.total_credits);
  const totalUsage = nonNegativeNumber(credits?.total_usage);
  const keyUsage = nonNegativeNumber(key?.usage);
  const keyBudget = resolveKeyBudget(key);
  const windows = [];
  if (keyBudget) {
    const periodLabel = keyBudget.period
      ? `${keyBudget.period[0]?.toUpperCase()}${keyBudget.period.slice(1)} key budget`
      : "API key budget";
    windows.push({
      label: periodLabel,
      usedPercent:
        keyBudget.limit === 0 ? 100 : Math.min(100, (keyBudget.used / keyBudget.limit) * 100),
    });
  }
  const billing = [];
  if (totalCredits !== void 0 && totalUsage !== void 0) {
    billing.push({
      type: "balance",
      label: "Account balance",
      amount: totalCredits - totalUsage,
      unit: "USD",
    });
    billing.push({
      type: "spend",
      label: "Account usage",
      amount: totalUsage,
      unit: "USD",
    });
  }
  if (keyBudget)
    billing.push({
      type: "budget",
      label: "API key budget",
      used: keyBudget.used,
      limit: keyBudget.limit,
      unit: "USD",
      ...(keyBudget.period ? { period: keyBudget.period } : {}),
    });
  else if (keyUsage !== void 0)
    billing.push({
      type: "spend",
      label: "API key usage",
      amount: keyUsage,
      unit: "USD",
    });
  const keyLabel = typeof key?.label === "string" ? key.label.trim() : "";
  const summary = [
    ["today", nonNegativeNumber(key?.usage_daily)],
    ["this week", nonNegativeNumber(key?.usage_weekly)],
    ["this month", nonNegativeNumber(key?.usage_monthly)],
  ]
    .flatMap(([period, amount]) => (amount === void 0 ? [] : [`$${amount.toFixed(2)} ${period}`]))
    .join(" · ");
  return {
    provider: "openrouter",
    displayName: "OpenRouter",
    windows,
    ...(billing.length > 0 ? { billing } : {}),
    ...(summary ? { summary } : {}),
    ...(keyLabel ? { plan: keyLabel } : {}),
  };
}
//#endregion
export { fetchOpenRouterUsage as t };
