import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  E as resolveExpiresAtMsFromEpochSeconds,
  _ as parseStrictFiniteNumber,
  s as asFiniteNumber,
} from "./number-coercion-CJQ8TR--.js";
import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import "./provider-usage-DW1nF0aA.js";
import { n as PROVIDER_LABELS, r as clampPercent } from "./provider-usage.shared-BtRIPHWE.js";
//#region extensions/codex/src/app-server/rate-limits.ts
/**
 * Parses Codex account rate-limit payloads into user-facing usage summaries,
 * reset hints, and enriched usage-limit error messages.
 */
const CODEX_LIMIT_ID = "codex";
const LIMIT_WINDOW_KEYS = ["primary", "secondary"];
const ONE_SECOND_MS = 1e3;
const ONE_MINUTE_MS = 6e4;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const DAY_WINDOW_MINUTES = 1440;
const WEEKLY_WINDOW_MINUTES = 7 * DAY_WINDOW_MINUTES;
const WEEKLY_RESET_GAP_MS = 3 * ONE_DAY_MS;
/** Enriches Codex usage-limit failures with reset timing and recovery guidance. */
function formatCodexUsageLimitErrorMessage(params) {
  const message = normalizeText(params.message);
  if (!isCodexUsageLimitError(params.codexErrorInfo, message)) return;
  const nowMs = params.nowMs ?? Date.now();
  const usageSummary = summarizeCodexAccountUsage(params.rateLimits, nowMs);
  const nextReset =
    selectBlockingRateLimitReset(params.rateLimits, nowMs) ??
    (usageSummary?.blocked ? void 0 : selectNextRateLimitReset(params.rateLimits, nowMs));
  const parts = ["You've reached your Codex subscription usage limit."];
  let recoveryAction = "Wait until Codex becomes available";
  if (nextReset) {
    parts.push(`Next reset ${formatResetTime(nextReset.resetsAtMs, nowMs)}.`);
    recoveryAction = "Wait until the reset time";
  } else {
    const codexRetryHint = extractCodexRetryHint(message);
    if (codexRetryHint) {
      parts.push(`Codex says to try again ${codexRetryHint}.`);
      recoveryAction = "Wait until the retry time";
    } else {
      if (usageSummary?.blockingPeriod && usageSummary.blockingReason)
        parts.push(`Your ${usageSummary.blockingReason}.`);
      parts.push("OpenClaw could not determine a reset time from Codex.");
    }
  }
  parts.push(
    `${recoveryAction}, use another Codex account if available, or switch to another configured model/provider.`,
  );
  return parts.join(" ");
}
/** Detects usage-limit messages that need a fresh rate-limit query before display. */
function shouldRefreshCodexRateLimitsForUsageLimitMessage(message) {
  const text = normalizeText(message);
  return Boolean(
    text?.includes("You've reached your Codex subscription usage limit.") &&
    !text.includes("Next reset "),
  );
}
/** Formats compact summaries for raw Codex rate-limit snapshot payloads. */
function summarizeCodexRateLimits(value, nowMs = Date.now()) {
  const snapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasDisplayableData);
  if (snapshots.length === 0) return;
  const summaries = snapshots
    .slice(0, 4)
    .map((snapshot) => summarizeRateLimitSnapshot(snapshot, nowMs))
    .filter((summary) => summary !== void 0);
  return summaries.length > 0 ? summaries.join("; ") : void 0;
}
/** Returns true when a value contains any recognizable Codex rate-limit snapshots. */
function hasCodexRateLimitSnapshots(value) {
  return collectCodexRateLimitSnapshots(value).length > 0;
}
/** Builds short account availability lines suitable for status surfaces. */
function summarizeCodexAccountRateLimits(value, nowMs = Date.now()) {
  const summary = summarizeCodexAccountUsage(value, nowMs);
  if (!summary) return;
  if (!summary.blocked) return ["Codex is available."];
  return [
    summary.blockedUntilText
      ? `Codex is paused until ${summary.blockedUntilText}.`
      : "Codex is paused by a usage limit.",
    summary.blockingReason
      ? `Your ${summary.blockingReason}.`
      : "Your Codex usage limit is reached.",
  ];
}
/** Returns the reset timestamp for the currently blocking Codex usage limit. */
function resolveCodexUsageLimitResetAtMs(value, nowMs = Date.now()) {
  return selectBlockingRateLimitReset(value, nowMs)?.resetsAtMs;
}
/** Summarizes account availability, blocking reason, and reset time from rate-limit data. */
function summarizeCodexAccountUsage(value, nowMs = Date.now()) {
  const snapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasDisplayableData);
  if (snapshots.length === 0) return;
  const usageSnapshot =
    snapshots.find(isCodexLimitSnapshot) ??
    expectDefined(snapshots[0], "displayable Codex rate-limit snapshot");
  const blockedSnapshots = snapshots.filter(snapshotHasLimitBlock);
  const blockingSnapshot =
    blockedSnapshots.find(isCodexLimitSnapshot) ?? blockedSnapshots[0] ?? void 0;
  const blockingEntries = blockingSnapshot ? readWindowEntries(blockingSnapshot) : [];
  const blockingWindowEntry = selectBlockingWindowEntry(blockingEntries, nowMs);
  const blockingWindow = blockingWindowEntry?.window;
  const blockingReset =
    blockingWindow && blockingWindow.resetsAtMs > nowMs ? blockingWindow : void 0;
  const blockingPeriod = formatBlockingLimitPeriod(blockingWindowEntry, blockingEntries);
  const blockedUntilText = blockingReset
    ? formatAccountResetTime(blockingReset.resetsAtMs, nowMs)
    : void 0;
  const blockedResetRelative = blockingReset
    ? `in ${formatRelativeDuration(blockingReset.resetsAtMs - nowMs)}`
    : void 0;
  const blockingReason = blockingPeriod
    ? `${blockingPeriod} Codex usage limit is reached`
    : blockingSnapshot
      ? "Codex usage limit is reached"
      : void 0;
  return {
    usageLine: formatUsageLine(usageSnapshot),
    blocked: Boolean(blockingSnapshot),
    ...(blockingReset ? { blockedUntilMs: blockingReset.resetsAtMs } : {}),
    ...(blockedUntilText ? { blockedUntilText } : {}),
    ...(blockedResetRelative ? { blockedResetRelative } : {}),
    ...(blockingPeriod ? { blockingPeriod } : {}),
    ...(blockingReason ? { blockingReason } : {}),
  };
}
/** Converts Codex app-server rate-limit payloads into OpenAI/Codex usage windows. */
function buildCodexAppServerUsageSnapshot(value) {
  const snapshot = selectCodexProviderUsageSnapshot(value);
  const entries = snapshot ? readWindowEntries(snapshot) : [];
  const windows = entries
    .map((entry) => readProviderUsageWindow(entry, entries))
    .filter((window) => Boolean(window));
  return {
    provider: "openai",
    displayName: PROVIDER_LABELS.openai,
    windows,
    ...(snapshot ? { plan: resolveCodexProviderUsagePlan(snapshot) } : {}),
  };
}
function isCodexUsageLimitError(codexErrorInfo, message) {
  if (codexErrorInfo === "usageLimitExceeded") return true;
  if (typeof codexErrorInfo === "string") {
    if (codexErrorInfo.replace(/[_\s-]/gu, "").toLowerCase() === "usagelimitexceeded") return true;
  }
  return Boolean(message?.toLowerCase().includes("usage limit"));
}
function selectNextRateLimitReset(value, nowMs) {
  const futureWindows = collectCodexRateLimitSnapshots(value)
    .flatMap((snapshot) =>
      LIMIT_WINDOW_KEYS.flatMap((key) => readRateLimitWindow(snapshot, key) ?? []),
    )
    .filter((window) => window.resetsAtMs > nowMs);
  if (futureWindows.length === 0) return;
  const exhaustedWindows = futureWindows.filter(
    (window) => window.usedPercent !== void 0 && window.usedPercent >= 100,
  );
  return (exhaustedWindows.length > 0 ? exhaustedWindows : futureWindows).toSorted(
    (left, right) => left.resetsAtMs - right.resetsAtMs,
  )[0];
}
function selectBlockingRateLimitReset(value, nowMs) {
  const blockedSnapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasLimitBlock);
  const blockingSnapshot =
    blockedSnapshots.find(isCodexLimitSnapshot) ?? blockedSnapshots[0] ?? void 0;
  return blockingSnapshot ? selectSnapshotBlockingReset(blockingSnapshot, nowMs) : void 0;
}
function summarizeRateLimitSnapshot(snapshot, nowMs) {
  const label = formatLimitLabel(snapshot);
  const windows = LIMIT_WINDOW_KEYS.flatMap((key) => {
    const window = readRateLimitWindow(snapshot, key);
    return window ? [formatRateLimitWindow(key, window, nowMs)] : [];
  });
  const reachedType =
    readString(snapshot, "rateLimitReachedType") ?? readString(snapshot, "rate_limit_reached_type");
  const suffix = reachedType ? ` (${formatReachedType(reachedType)})` : "";
  if (windows.length > 0) return `${label}: ${windows.join(" · ")}${suffix}`;
  if (reachedType) return `${label}: ${formatReachedType(reachedType)}`;
}
function collectCodexRateLimitSnapshots(value) {
  const snapshots = [];
  collectRateLimitSnapshots(value, snapshots, /* @__PURE__ */ new Set());
  return snapshots;
}
function collectRateLimitSnapshots(value, snapshots, seen) {
  if (Array.isArray(value)) {
    for (const entry of value) collectRateLimitSnapshots(entry, snapshots, seen);
    return;
  }
  if (!isJsonObject(value)) return;
  if (isRateLimitSnapshot(value)) {
    addRateLimitSnapshot(value, snapshots, seen);
    return;
  }
  const byLimitId = value.rateLimitsByLimitId;
  if (isJsonObject(byLimitId))
    for (const key of sortedRateLimitKeys(Object.keys(byLimitId)))
      collectRateLimitSnapshots(byLimitId[key], snapshots, seen);
  const snakeByLimitId = value.rate_limits_by_limit_id;
  if (isJsonObject(snakeByLimitId))
    for (const key of sortedRateLimitKeys(Object.keys(snakeByLimitId)))
      collectRateLimitSnapshots(snakeByLimitId[key], snapshots, seen);
  collectRateLimitSnapshots(value.rateLimits, snapshots, seen);
  collectRateLimitSnapshots(value.rate_limits, snapshots, seen);
  collectRateLimitSnapshots(value.data, snapshots, seen);
  collectRateLimitSnapshots(value.items, snapshots, seen);
}
function sortedRateLimitKeys(keys) {
  return keys.toSorted((left, right) => {
    if (left === CODEX_LIMIT_ID) return -1;
    if (right === CODEX_LIMIT_ID) return 1;
    return left.localeCompare(right);
  });
}
function addRateLimitSnapshot(snapshot, snapshots, seen) {
  const signature = [
    readNullableString(snapshot, "limitId") ?? readNullableString(snapshot, "limit_id") ?? "",
    readNullableString(snapshot, "limitName") ?? readNullableString(snapshot, "limit_name") ?? "",
    formatWindowSignature(snapshot.primary),
    formatWindowSignature(snapshot.secondary),
  ].join("|");
  if (seen.has(signature)) return;
  seen.add(signature);
  snapshots.push(snapshot);
}
function isRateLimitSnapshot(value) {
  return (
    isJsonObject(value.primary) ||
    isJsonObject(value.secondary) ||
    value.rateLimitReachedType !== void 0 ||
    value.rate_limit_reached_type !== void 0 ||
    value.limitId !== void 0 ||
    value.limit_id !== void 0 ||
    value.limitName !== void 0 ||
    value.limit_name !== void 0
  );
}
function readRateLimitWindow(snapshot, key) {
  const window = snapshot[key];
  if (!isJsonObject(window)) return;
  return {
    resetsAtMs:
      resolveExpiresAtMsFromEpochSeconds(
        readNumber(window, "resetsAt") ?? readNumber(window, "resets_at"),
        { maxMs: 864e13 },
      ) ?? 0,
    ...readOptionalNumberField(window, "usedPercent", "used_percent"),
    ...readOptionalNumberField(
      window,
      "windowDurationMins",
      "window_duration_mins",
      "windowMinutes",
      "window_minutes",
    ),
  };
}
function snapshotHasDisplayableData(snapshot) {
  if (
    readString(snapshot, "rateLimitReachedType") ??
    readString(snapshot, "rate_limit_reached_type")
  )
    return true;
  return readWindowEntries(snapshot).some(
    (entry) => entry.window.usedPercent !== void 0 || entry.window.resetsAtMs > 0,
  );
}
function readOptionalNumberField(record, ...keys) {
  const value = keys.map((key) => readNumber(record, key)).find((entry) => entry !== void 0);
  if (value === void 0) return {};
  return keys.some((key) => key.toLowerCase().includes("window"))
    ? { windowDurationMins: value }
    : { usedPercent: value };
}
function formatRateLimitWindow(key, window, nowMs) {
  return `${key} ${formatRateLimitWindowDetails(window, nowMs)}`;
}
function formatRateLimitWindowDetails(window, nowMs) {
  return `${window.usedPercent === void 0 ? "usage unknown" : `${Math.max(0, 100 - Math.round(window.usedPercent))}% left`}${window.resetsAtMs > nowMs ? ` ⏱${formatResetDuration(window.resetsAtMs, nowMs)}` : ""}`;
}
function formatLimitLabel(snapshot) {
  const label =
    readNullableString(snapshot, "limitName") ??
    readNullableString(snapshot, "limit_name") ??
    readNullableString(snapshot, "limitId") ??
    readNullableString(snapshot, "limit_id");
  if (!label || label === CODEX_LIMIT_ID) return "Codex";
  return label.replace(/[_-]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function formatReachedType(value) {
  return value.replace(/[_-]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function formatResetTime(resetsAtMs, nowMs) {
  return `in ${formatRelativeDuration(resetsAtMs - nowMs)}, ${formatCalendarResetTime(resetsAtMs, nowMs)}`;
}
function formatAccountResetTime(resetsAtMs, nowMs) {
  return `${formatCalendarResetTime(resetsAtMs, nowMs)} (in ${formatRelativeDuration(resetsAtMs - nowMs)})`;
}
function snapshotHasLimitBlock(snapshot) {
  return Boolean(
    readString(snapshot, "rateLimitReachedType") ??
    readString(snapshot, "rate_limit_reached_type") ??
    readWindowEntries(snapshot).some(
      (entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100,
    ),
  );
}
function isCodexLimitSnapshot(snapshot) {
  const id = readNullableString(snapshot, "limitId") ?? readNullableString(snapshot, "limit_id");
  return !id || id === CODEX_LIMIT_ID;
}
function selectCodexProviderUsageSnapshot(value) {
  const snapshots = collectCodexRateLimitSnapshots(value);
  return snapshots.find(isCodexLimitSnapshot) ?? snapshots[0];
}
function readProviderUsageWindow(entry, entries) {
  const { window } = entry;
  if (window.usedPercent === void 0 && window.resetsAtMs <= 0) return;
  return {
    label: formatProviderUsageWindowLabel(entry, entries),
    usedPercent: clampPercent(window.usedPercent ?? 0),
    resetAt: window.resetsAtMs > 0 ? window.resetsAtMs : void 0,
  };
}
function formatProviderUsageWindowLabel(entry, entries) {
  const minutes = entry.window.windowDurationMins;
  if (minutes === WEEKLY_WINDOW_MINUTES || hasWeeklySecondaryResetCadence(entry, entries))
    return "Week";
  if (minutes === DAY_WINDOW_MINUTES) return "Day";
  if (minutes !== void 0 && minutes > 0 && minutes < DAY_WINDOW_MINUTES)
    return minutes % 60 === 0 ? `${minutes / 60}h` : `${minutes}m`;
  if (minutes !== void 0 && minutes > 0 && minutes % DAY_WINDOW_MINUTES === 0)
    return `${minutes / DAY_WINDOW_MINUTES}d`;
  if (minutes !== void 0 && minutes > 0 && minutes % 60 === 0) return `${minutes / 60}h`;
  return entry.key === "primary" ? "Short" : "Long";
}
function resolveCodexProviderUsagePlan(snapshot) {
  const plan = readString(snapshot, "planType") ?? readString(snapshot, "plan_type");
  const creditSummary = formatCodexCreditSummary(
    isJsonObject(snapshot.credits) ? snapshot.credits : void 0,
  );
  if (!creditSummary) return plan;
  return plan ? `${plan} (${creditSummary})` : creditSummary;
}
function formatCodexCreditSummary(credits) {
  if (!credits) return;
  if ((readBoolean(credits, "hasCredits") ?? readBoolean(credits, "has_credits")) === false) return;
  if (readBoolean(credits, "unlimited")) return "Unlimited credits";
  const balance =
    typeof credits.balance === "string"
      ? parseStrictFiniteNumber(credits.balance)
      : asFiniteNumber(credits.balance);
  if (balance === void 0 || balance <= 0) return;
  const roundedBalance = Math.round(balance);
  return roundedBalance > 0 ? `${roundedBalance} credits` : void 0;
}
function selectSnapshotBlockingReset(snapshot, nowMs) {
  const futureWindows = readWindowEntries(snapshot)
    .map((entry) => entry.window)
    .filter((window) => window.resetsAtMs > nowMs);
  const exhaustedWindows = futureWindows.filter(
    (window) => window.usedPercent !== void 0 && window.usedPercent >= 100,
  );
  const candidates = exhaustedWindows.length > 0 ? exhaustedWindows : futureWindows;
  const resetSort =
    exhaustedWindows.length > 0
      ? (left, right) => right.resetsAtMs - left.resetsAtMs
      : (left, right) => left.resetsAtMs - right.resetsAtMs;
  return candidates.toSorted(resetSort)[0];
}
function selectBlockingWindowEntry(entries, nowMs) {
  const futureEntries = entries.filter((entry) => entry.window.resetsAtMs > nowMs);
  const exhaustedFutureEntries = futureEntries.filter(
    (entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100,
  );
  const resetCandidates =
    exhaustedFutureEntries.length > 0 ? exhaustedFutureEntries : futureEntries;
  if (resetCandidates.length > 0) {
    const resetSort =
      exhaustedFutureEntries.length > 0
        ? (left, right) => right.window.resetsAtMs - left.window.resetsAtMs
        : (left, right) => left.window.resetsAtMs - right.window.resetsAtMs;
    return resetCandidates.toSorted(resetSort)[0];
  }
  return entries
    .filter((entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100)
    .toSorted(
      (left, right) =>
        (right.window.windowDurationMins ?? 0) - (left.window.windowDurationMins ?? 0),
    )[0];
}
function readWindowEntries(snapshot) {
  return LIMIT_WINDOW_KEYS.flatMap((key) => {
    const window = readRateLimitWindow(snapshot, key);
    return window
      ? [
          {
            key,
            window,
          },
        ]
      : [];
  });
}
function formatBlockingLimitPeriod(entry, entries) {
  const minutes = entry?.window.windowDurationMins;
  if (
    entry &&
    (minutes === WEEKLY_WINDOW_MINUTES || hasWeeklySecondaryResetCadence(entry, entries))
  )
    return "weekly";
  if (minutes === DAY_WINDOW_MINUTES) return "daily";
  if (minutes !== void 0 && minutes > 0 && minutes < DAY_WINDOW_MINUTES) return "short-term";
}
function formatUsageLine(snapshot) {
  const entries = readWindowEntries(snapshot);
  const windows = entries
    .filter((entry) => entry.window.usedPercent !== void 0)
    .toSorted(
      (left, right) =>
        (right.window.windowDurationMins ?? 0) - (left.window.windowDurationMins ?? 0),
    )
    .map((entry) => {
      return `${formatUsageWindowLabel(entry, entries)} ${Math.round(entry.window.usedPercent ?? 0)}%`;
    });
  return windows.length > 0 ? windows.join(" · ") : void 0;
}
function formatUsageWindowLabel(entry, entries) {
  const minutes = entry.window.windowDurationMins;
  if (minutes === WEEKLY_WINDOW_MINUTES || hasWeeklySecondaryResetCadence(entry, entries))
    return "weekly";
  if (minutes === DAY_WINDOW_MINUTES) return "daily";
  if (minutes !== void 0 && minutes > 0 && minutes < DAY_WINDOW_MINUTES) return "short-term";
  if (minutes !== void 0 && minutes > 0 && minutes % DAY_WINDOW_MINUTES === 0)
    return `${minutes / DAY_WINDOW_MINUTES}-day`;
  if (minutes !== void 0 && minutes > 0 && minutes % 60 === 0) return `${minutes / 60}-hour`;
  return "usage";
}
function hasWeeklySecondaryResetCadence(entry, entries) {
  if (entry.key !== "secondary" || entry.window.windowDurationMins !== DAY_WINDOW_MINUTES)
    return false;
  const primaryResetMs = entries.find((candidate) => candidate.key === "primary")?.window
    .resetsAtMs;
  return (
    typeof primaryResetMs === "number" &&
    primaryResetMs > 0 &&
    entry.window.resetsAtMs > 0 &&
    entry.window.resetsAtMs - primaryResetMs >= WEEKLY_RESET_GAP_MS
  );
}
function formatCalendarResetTime(resetsAtMs, nowMs) {
  const resetDate = new Date(resetsAtMs);
  const resetParts = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(resetDate.getFullYear() === new Date(nowMs).getFullYear() ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).formatToParts(resetDate);
  const part = (type) => resetParts.find((entry) => entry.type === type)?.value;
  const dateParts = [part("month"), part("day"), part("year")].filter(Boolean);
  return [
    dateParts.length > 1 ? `${dateParts[0]} ${dateParts.slice(1).join(", ")}` : dateParts[0],
    "at",
    [
      [part("hour"), part("minute")].filter(Boolean).join(":"),
      part("dayPeriod"),
      part("timeZoneName"),
    ]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}
function formatRelativeDuration(durationMs) {
  const safeMs = Math.max(1e3, durationMs);
  if (safeMs < ONE_MINUTE_MS) return `${Math.ceil(safeMs / 1e3)} seconds`;
  if (safeMs < ONE_HOUR_MS) {
    const minutes = Math.ceil(safeMs / ONE_MINUTE_MS);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  if (safeMs < ONE_DAY_MS) {
    const hours = Math.ceil(safeMs / ONE_HOUR_MS);
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  const days = Math.ceil(safeMs / ONE_DAY_MS);
  return `${days} ${days === 1 ? "day" : "days"}`;
}
function formatResetDuration(resetsAtMs, nowMs) {
  const durationMs =
    Math.round(Math.max(ONE_SECOND_MS, resetsAtMs - nowMs) / ONE_SECOND_MS) * ONE_SECOND_MS;
  const days = Math.floor(durationMs / ONE_DAY_MS);
  const hours = Math.floor((durationMs % ONE_DAY_MS) / ONE_HOUR_MS);
  const minutes = Math.floor((durationMs % ONE_HOUR_MS) / ONE_MINUTE_MS);
  const seconds = Math.floor((durationMs % ONE_MINUTE_MS) / ONE_SECOND_MS);
  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  if (minutes > 0) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  return `${seconds}s`;
}
function formatWindowSignature(value) {
  if (!isJsonObject(value)) return "";
  return `${readNumber(value, "usedPercent") ?? readNumber(value, "used_percent") ?? ""}:${readNumber(value, "resetsAt") ?? readNumber(value, "resets_at") ?? ""}`;
}
function extractCodexRetryHint(message) {
  if (!message) return;
  const tryAgainAt = /\btry again\s+(at\s+[^.!?\n]+)(?:[.!?]|$)/iu.exec(message);
  if (tryAgainAt?.[1]) return tryAgainAt[1].trim();
  return /\btry again\s+((?:tomorrow|in\s+[^.!?\n]+)[^.!?\n]*)(?:[.!?]|$)/iu
    .exec(message)?.[1]
    ?.trim();
}
function readString(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readNullableString(record, key) {
  return readString(record, key) ?? void 0;
}
function readNumber(record, key) {
  return asFiniteNumber(record[key]);
}
function readBoolean(record, key) {
  const value = record[key];
  return typeof value === "boolean" ? value : void 0;
}
function normalizeText(value) {
  const text = value?.trim();
  return text ? text : void 0;
}
//#endregion
export {
  shouldRefreshCodexRateLimitsForUsageLimitMessage as a,
  summarizeCodexRateLimits as c,
  resolveCodexUsageLimitResetAtMs as i,
  formatCodexUsageLimitErrorMessage as n,
  summarizeCodexAccountRateLimits as o,
  hasCodexRateLimitSnapshots as r,
  summarizeCodexAccountUsage as s,
  buildCodexAppServerUsageSnapshot as t,
};
