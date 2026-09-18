import fs from "node:fs/promises";
import { o as truncateToVisibleWidth, s as visibleWidth } from "./ansi-D4OHEz5F.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { n as formatDurationHuman } from "./format-duration-DKk9BtRb.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DpocbsVi.js";
import { t as danger } from "./globals-CNUzHTcU.js";
import { i as parseStrictPositiveIntOrUndefined } from "./helpers-WGaRKVcg.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { f as formatTimestamp } from "./logger-BUux_Jpv.js";
import {
  A as resolvePositiveTimerTimeoutMs,
  C as resolveExpiresAtMsFromDurationMs,
  P as timestampMsToIsoString,
  b as parseStrictPositiveInteger,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import "./plugins-BKdf-5tW.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { m as sanitizeAgentId } from "./session-key-druuY-GG.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { n as resolveCronStaggerMs } from "./stagger-N9cGukpI.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { n as isRich, r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { n as THINKING_LEVELS_HELP } from "./thinking.shared-BWnbgBUO.js";
//#region src/infra/format-time/parse-offsetless-zoned-datetime.ts
const OFFSETLESS_ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?$/;
const OFFSETLESS_ISO_DATETIME_PARTS_RE =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/;
function isOffsetlessIsoDateTime(raw) {
  return OFFSETLESS_ISO_DATETIME_RE.test(raw);
}
function parseOffsetlessIsoDateTimeInTimeZone(raw, timeZone) {
  const expectedParts = parseOffsetlessIsoDateTimeParts(raw);
  if (!expectedParts) return null;
  try {
    getZonedDateTimeParts(Date.now(), timeZone);
    const naiveMs = /* @__PURE__ */ new Date(`${raw}Z`).getTime();
    if (Number.isNaN(naiveMs)) return null;
    const resolvedMs =
      naiveMs - getTimeZoneOffsetMs(naiveMs - getTimeZoneOffsetMs(naiveMs, timeZone), timeZone);
    if (!matchesOffsetlessIsoDateTimeParts(resolvedMs, timeZone, expectedParts)) return null;
    return new Date(resolvedMs).toISOString();
  } catch {
    return null;
  }
}
function parseOffsetlessIsoDateTimeParts(raw) {
  const match = OFFSETLESS_ISO_DATETIME_PARTS_RE.exec(raw);
  if (!match) return null;
  const fractionalMs = (match[7] ?? "").padEnd(3, "0").slice(0, 3);
  return {
    year: Number.parseInt(match[1] ?? "0", 10),
    month: Number.parseInt(match[2] ?? "0", 10),
    day: Number.parseInt(match[3] ?? "0", 10),
    hour: Number.parseInt(match[4] ?? "0", 10),
    minute: Number.parseInt(match[5] ?? "0", 10),
    second: Number.parseInt(match[6] ?? "0", 10),
    millisecond: Number.parseInt(fractionalMs || "0", 10),
  };
}
function matchesOffsetlessIsoDateTimeParts(utcMs, timeZone, expected) {
  const actual = getZonedDateTimeParts(utcMs, timeZone);
  return (
    actual.year === expected.year &&
    actual.month === expected.month &&
    actual.day === expected.day &&
    actual.hour === expected.hour &&
    actual.minute === expected.minute &&
    actual.second === expected.second &&
    actual.millisecond === expected.millisecond
  );
}
function getTimeZoneOffsetMs(utcMs, timeZone) {
  const parts = getZonedDateTimeParts(utcMs, timeZone);
  return (
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
    ) - utcMs
  );
}
function getZonedDateTimeParts(utcMs, timeZone) {
  const utcDate = new Date(utcMs);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(utcDate);
  const getNumericPart = (type) => {
    const part = parts.find((candidate) => candidate.type === type);
    return Number.parseInt(part?.value ?? "0", 10);
  };
  return {
    year: getNumericPart("year"),
    month: getNumericPart("month"),
    day: getNumericPart("day"),
    hour: getNumericPart("hour"),
    minute: getNumericPart("minute"),
    second: getNumericPart("second"),
    millisecond: utcDate.getUTCMilliseconds(),
  };
}
//#endregion
//#region src/cli/cron-cli/shared.ts
function parseCronCommandArgv(value) {
  if (typeof value !== "string") return;
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("--command-argv must be a JSON array of strings");
  }
  if (
    !Array.isArray(parsed) ||
    parsed.length === 0 ||
    parsed.some((entry) => typeof entry !== "string" || entry.length === 0)
  )
    throw new Error("--command-argv must be a non-empty JSON array of non-empty strings");
  return parsed;
}
function parseCronCommandEnv(values) {
  const rawValues = Array.isArray(values) ? values : typeof values === "string" ? [values] : [];
  if (rawValues.length === 0) return;
  const env = {};
  for (const raw of rawValues) {
    if (typeof raw !== "string") throw new Error("--command-env must be KEY=VALUE");
    const idx = raw.indexOf("=");
    const key = idx > 0 ? raw.slice(0, idx).trim() : "";
    if (!key) throw new Error("--command-env must be KEY=VALUE");
    env[key] = raw.slice(idx + 1);
  }
  return env;
}
const getCronChannelOptions = () => {
  const pluginIds = listChannelPlugins()
    .map((plugin) => plugin.id)
    .filter(Boolean);
  return pluginIds.length > 0 ? ["last", ...pluginIds].join("|") : "last|<channel-id>";
};
function toLocalIsoTime(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? formatTimestamp(new Date(value), { style: "long" })
    : void 0;
}
/**
 * CLI-only display enrichment for `cron runs` history entries: adds a short
 * `cause` alias for `errorReason` plus readable local-offset ISO mirrors of the
 * numeric timestamps (matching the diagnostic log `time` format). Stored data
 * and the gateway protocol stay unchanged; raw numeric fields are preserved.
 */
function enrichCronRunEntriesForDisplay(value) {
  if (!value || typeof value !== "object") return value;
  const record = value;
  const entries = record.entries;
  if (!Array.isArray(entries)) return value;
  const nextEntries = entries.map((entry) => {
    if (!entry || typeof entry !== "object") return entry;
    const item = entry;
    if (item.action !== "finished") return item;
    const extra = {};
    const cause = typeof item.errorReason === "string" ? item.errorReason.trim() : "";
    if (cause) extra.cause = cause;
    const tsIso = toLocalIsoTime(item.ts);
    if (tsIso) extra.tsIso = tsIso;
    const runAtIso = toLocalIsoTime(item.runAtMs);
    if (runAtIso) extra.runAtIso = runAtIso;
    const nextRunAtIso = toLocalIsoTime(item.nextRunAtMs);
    if (nextRunAtIso) extra.nextRunAtIso = nextRunAtIso;
    return Object.keys(extra).length > 0 ? Object.assign({}, item, extra) : item;
  });
  return {
    ...record,
    entries: nextEntries,
  };
}
function printCronJson(value) {
  defaultRuntime.writeJson(enrichCronRunEntriesForDisplay(value));
}
/**
 * Enrich a CronJob (or list response) with a computed `status` field
 * derived from enabled + state.runningAtMs + state.lastRunStatus.
 * This mirrors the human-readable status shown by `cron list` / `cron show`.
 */
function enrichCronJsonWithStatus(value) {
  if (!value || typeof value !== "object") return value;
  const obj = value;
  if ("state" in obj && "enabled" in obj)
    return {
      ...obj,
      status: computeStatus(obj),
    };
  if ("jobs" in obj && Array.isArray(obj.jobs)) {
    const enrichedJobs = obj.jobs.map((job) => {
      const status = computeStatus(job);
      return Object.assign({}, job, { status });
    });
    return {
      ...obj,
      jobs: enrichedJobs,
    };
  }
  return value;
}
function computeStatus(job) {
  if (!job.enabled) return "disabled";
  const state = job.state ?? {};
  if (state.runningAtMs) return "running";
  return state.lastRunStatus ?? state.lastStatus ?? "idle";
}
function decorateStatusWithFailures(status, consecutiveErrors) {
  const failures = consecutiveErrors ?? 0;
  if (status !== "error" || failures <= 1) return status;
  return failures > 99 ? `${status} (99+x)` : `${status} (${failures}x)`;
}
function formatCronStatusForDisplay(job) {
  const state = job.state ?? {};
  return decorateStatusWithFailures(computeStatus(job), state.consecutiveErrors);
}
function handleCronCliError(err) {
  defaultRuntime.error(danger(String(err)));
  defaultRuntime.exit(1);
}
async function warnIfCronSchedulerDisabled(opts) {
  try {
    const res = await callGatewayFromCli("cron.status", opts, {});
    if (res?.enabled === true) return;
    const store =
      typeof res?.sqlitePath === "string"
        ? res.sqlitePath
        : typeof res?.storePath === "string"
          ? res.storePath
          : "";
    defaultRuntime.error(
      [
        "warning: cron scheduler is disabled in the Gateway; jobs are saved but will not run automatically.",
        "Re-enable with `cron.enabled: true` (or remove `cron.enabled: false`) and restart the Gateway.",
        store ? `store: ${store}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  } catch {}
}
function parsePositiveCronDurationMs(input) {
  try {
    const result = parseDurationMs(input);
    if (result <= 0) return null;
    return result;
  } catch {
    return null;
  }
}
function parseCronStaggerMs(params) {
  if (params.useExact) return 0;
  if (!params.staggerRaw) return;
  const parsed = parsePositiveCronDurationMs(params.staggerRaw);
  if (!parsed) throw new Error("Invalid --stagger; use e.g. 30s, 1m, 5m");
  return parsed;
}
function parseCronToolsAllow(input) {
  const tools = (
    Array.isArray(input)
      ? input.map((value) => String(value)).join(" ")
      : typeof input === "string"
        ? input
        : ""
  )
    .split(/[,\s]+/u)
    .map((tool) => normalizeOptionalString(tool))
    .filter((tool) => Boolean(tool));
  return tools.length > 0 ? tools : void 0;
}
function parseCronFallbacks(input) {
  if (input === void 0) return;
  return (
    Array.isArray(input)
      ? input.map((value) => String(value)).join(" ")
      : typeof input === "string"
        ? input
        : ""
  )
    .split(/[,\s]+/u)
    .map((fallback) => normalizeOptionalString(fallback))
    .filter((fallback) => Boolean(fallback));
}
/**
 * Parse a one-shot `--at` value into an ISO string (UTC).
 *
 * When `tz` is provided and the input is an offset-less datetime
 * (e.g. `2026-03-23T23:00:00`), the datetime is interpreted in
 * that IANA timezone instead of UTC.
 */
function parseAt(input, tz) {
  const raw = input.trim();
  if (!raw) return null;
  if (tz && isOffsetlessIsoDateTime(raw)) return parseOffsetlessIsoDateTimeInTimeZone(raw, tz);
  const absolute = parseAbsoluteTimeMs(raw);
  if (absolute !== null) return timestampMsToIsoString(absolute) ?? null;
  const dur = parsePositiveCronDurationMs(raw.startsWith("+") ? raw.slice(1) : raw);
  if (dur !== null) return timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(dur)) ?? null;
  return null;
}
const CRON_ID_PAD = 36;
const CRON_DECLARATION_PAD = 24;
const CRON_NAME_PAD = 24;
const CRON_SCHEDULE_PAD = 32;
const CRON_NEXT_PAD = 10;
const CRON_LAST_PAD = 10;
const CRON_STATUS_PAD = 12;
const CRON_TARGET_PAD = 9;
const CRON_DELIVERY_PAD = 64;
const CRON_AGENT_PAD = 10;
const CRON_OWNER_PAD = 24;
const CRON_MODEL_PAD = 20;
const TRUNCATED_SUFFIX = "...";
const stringifyCell = (value, fallback = "-") => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};
const formatCell = (value, width) => {
  const text = sanitizeTerminalText(stringifyCell(value));
  const truncated =
    visibleWidth(text) <= width
      ? text
      : width <= 3
        ? truncateToVisibleWidth(text, width)
        : `${truncateToVisibleWidth(text, width - 3)}${TRUNCATED_SUFFIX}`;
  const remaining = width - visibleWidth(truncated);
  return remaining > 0 ? `${truncated}${" ".repeat(remaining)}` : truncated;
};
const formatIsoMinute = (iso) => {
  const parsed = parseAbsoluteTimeMs(iso);
  const d = new Date(parsed ?? NaN);
  if (Number.isNaN(d.getTime())) return "-";
  const isoStr = d.toISOString();
  return `${isoStr.slice(0, 10)} ${isoStr.slice(11, 16)}Z`;
};
const formatSpan = (ms) => {
  if (ms < 6e4) return "<1m";
  if (ms < 36e5) return `${Math.round(ms / 6e4)}m`;
  if (ms < 864e5) return `${Math.round(ms / 36e5)}h`;
  return `${Math.round(ms / 864e5)}d`;
};
const formatRelative = (ms, nowMs) => {
  if (!ms) return "-";
  const delta = ms - nowMs;
  const label = formatSpan(Math.abs(delta));
  return delta >= 0 ? `in ${label}` : `${label} ago`;
};
const formatSchedule = (schedule, hasTrigger = false) => {
  const suffix = hasTrigger ? "+trigger" : "";
  if (schedule?.kind === "at") return `at ${formatIsoMinute(schedule.at)}${suffix}`;
  if (schedule?.kind === "every") return `every ${formatDurationHuman(schedule.everyMs)}${suffix}`;
  if (schedule?.kind === "on-exit") {
    const cwd = schedule.cwd ? ` @ ${schedule.cwd}` : "";
    return `on-exit ${schedule.command}${cwd}`;
  }
  if (schedule?.kind !== "cron") return "-";
  const base = schedule.tz
    ? `cron ${schedule.expr} @ ${schedule.tz}${suffix}`
    : `cron ${schedule.expr}${suffix}`;
  const staggerMs = resolveCronStaggerMs(schedule);
  if (staggerMs <= 0) return `${base} (exact)`;
  return `${base} (stagger ${formatDurationHuman(staggerMs)})`;
};
function coerceCronDeliveryPreviews(value) {
  const previews = value && typeof value === "object" ? value.deliveryPreviews : void 0;
  if (!previews || typeof previews !== "object") return /* @__PURE__ */ new Map();
  return new Map(
    Object.entries(previews).flatMap(([jobId, preview]) => {
      if (!preview || typeof preview !== "object") return [];
      const record = preview;
      if (typeof record.label !== "string" || typeof record.detail !== "string") return [];
      return [
        [
          jobId,
          {
            label: record.label,
            detail: record.detail,
          },
        ],
      ];
    }),
  );
}
function printCronList(jobs, runtime = defaultRuntime, opts) {
  if (jobs.length === 0) {
    runtime.log("No cron jobs.");
    return;
  }
  const rich = isRich();
  const header = [
    formatCell("ID", CRON_ID_PAD),
    formatCell("Declaration", CRON_DECLARATION_PAD),
    formatCell("Name", CRON_NAME_PAD),
    formatCell("Schedule", CRON_SCHEDULE_PAD),
    formatCell("Next", CRON_NEXT_PAD),
    formatCell("Last", CRON_LAST_PAD),
    formatCell("Status", CRON_STATUS_PAD),
    formatCell("Target", CRON_TARGET_PAD),
    formatCell("Delivery", CRON_DELIVERY_PAD),
    formatCell("Agent ID", CRON_AGENT_PAD),
    formatCell("Owner", CRON_OWNER_PAD),
    formatCell("Model", CRON_MODEL_PAD),
  ].join(" ");
  runtime.log(rich ? theme.heading(header) : header);
  const now = Date.now();
  for (const job of jobs) {
    const state = job.state ?? {};
    const idLabel = formatCell(job.id, CRON_ID_PAD);
    const declarationLabel = formatCell(job.declarationKey, CRON_DECLARATION_PAD);
    const nameLabel = formatCell(job.displayName ?? job.name, CRON_NAME_PAD);
    const scheduleLabel = formatCell(
      formatSchedule(job.schedule, job.trigger !== void 0),
      CRON_SCHEDULE_PAD,
    );
    const nextLabel = formatCell(
      job.enabled ? formatRelative(state.nextRunAtMs, now) : "-",
      CRON_NEXT_PAD,
    );
    const lastLabel = formatCell(formatRelative(state.lastRunAtMs, now), CRON_LAST_PAD);
    const statusRaw = computeStatus(job);
    const statusLabel = formatCell(formatCronStatusForDisplay(job), CRON_STATUS_PAD);
    const targetLabel = formatCell(job.sessionTarget, CRON_TARGET_PAD);
    const deliveryPreview = opts?.deliveryPreviews?.get(job.id);
    const deliveryText = deliveryPreview
      ? `${deliveryPreview.label} (${deliveryPreview.detail})`
      : "-";
    const deliveryLabel = formatCell(deliveryText, CRON_DELIVERY_PAD);
    const agentLabel = formatCell(job.agentId, CRON_AGENT_PAD);
    const ownerLabel = formatCell(job.owner?.sessionKey ?? job.owner?.agentId, CRON_OWNER_PAD);
    const modelLabel = formatCell(
      job.payload?.kind === "agentTurn" ? job.payload.model : void 0,
      CRON_MODEL_PAD,
    );
    const coloredStatus = (() => {
      if (statusRaw === "ok") return colorize(rich, theme.success, statusLabel);
      if (statusRaw === "error") return colorize(rich, theme.error, statusLabel);
      if (statusRaw === "running") return colorize(rich, theme.warn, statusLabel);
      if (statusRaw === "skipped") return colorize(rich, theme.muted, statusLabel);
      return colorize(rich, theme.muted, statusLabel);
    })();
    const coloredTarget =
      job.sessionTarget === "main"
        ? colorize(rich, theme.accent, targetLabel)
        : colorize(rich, theme.accentBright, targetLabel);
    const coloredAgent = job.agentId
      ? colorize(rich, theme.info, agentLabel)
      : colorize(rich, theme.muted, agentLabel);
    const line = [
      colorize(rich, theme.accent, idLabel),
      colorize(rich, theme.muted, declarationLabel),
      colorize(rich, theme.info, nameLabel),
      colorize(rich, theme.info, scheduleLabel),
      colorize(rich, theme.muted, nextLabel),
      colorize(rich, theme.muted, lastLabel),
      coloredStatus,
      coloredTarget,
      deliveryPreview
        ? colorize(rich, theme.info, deliveryLabel)
        : colorize(rich, theme.muted, deliveryLabel),
      coloredAgent,
      colorize(rich, job.owner ? theme.info : theme.muted, ownerLabel),
      job.payload?.kind === "agentTurn" && job.payload.model
        ? colorize(rich, theme.info, modelLabel)
        : colorize(rich, theme.muted, modelLabel),
    ].join(" ");
    runtime.log(line.trimEnd());
  }
}
function printCronShow(job, runtime = defaultRuntime, opts) {
  const preview = opts?.deliveryPreview ?? {
    label: "-",
    detail: "unavailable",
  };
  runtime.log(`id: ${job.id}`);
  runtime.log(`declaration: ${job.declarationKey ?? "-"}`);
  runtime.log(`name: ${job.name}`);
  runtime.log(`display name: ${job.displayName ?? "-"}`);
  runtime.log(`owner agent: ${job.owner?.agentId ?? "-"}`);
  runtime.log(`owner session: ${job.owner?.sessionKey ?? "-"}`);
  runtime.log(`enabled: ${job.enabled ? "yes" : "no"}`);
  runtime.log(`schedule: ${formatSchedule(job.schedule, job.trigger !== void 0)}`);
  runtime.log(
    `trigger: ${job.trigger ? `once=${job.trigger.once === true ? "yes" : "no"}; evals=${job.state.triggerEvalCount ?? 0}; last eval=${formatRelative(job.state.lastTriggerEvalAtMs, Date.now())}; last fire=${formatRelative(job.state.lastTriggerFireAtMs, Date.now())}` : "-"}`,
  );
  runtime.log(`session: ${job.sessionTarget ?? "-"}`);
  runtime.log(`agent: ${job.agentId ?? "-"}`);
  runtime.log(`model: ${job.payload.kind === "agentTurn" ? (job.payload.model ?? "-") : "-"}`);
  runtime.log(`delivery: ${preview.label} (${preview.detail})`);
  runtime.log(`next: ${formatRelative(job.state.nextRunAtMs, Date.now())}`);
  runtime.log(`last: ${formatRelative(job.state.lastRunAtMs, Date.now())}`);
  runtime.log(`status: ${formatCronStatusForDisplay(job)}`);
  runtime.log(`last error: ${job.state.lastError ?? "-"}`);
  runtime.log(`last delivery: ${job.state.lastDeliveryStatus ?? "-"}`);
  runtime.log(`last delivery error: ${job.state.lastDeliveryError ?? "-"}`);
  runtime.log(`diagnostic: ${job.state.lastDiagnosticSummary ?? "-"}`);
}
//#endregion
//#region src/cli/cron-cli/schedule-options.ts
/** Resolve explicit `--at`, `--every`, or `--cron` options for cron creation. */
function resolveCronCreateSchedule(options) {
  const normalized = normalizeScheduleOptions(options);
  if (normalized.onExitCwd && !normalized.onExitCommand)
    throw new Error("--on-exit-cwd requires --on-exit.");
  if (countChosenSchedules(normalized) !== 1)
    throw new Error("Choose exactly one schedule: --at, --every, --cron, or --on-exit");
  const schedule = resolveDirectSchedule(normalized);
  if (!schedule)
    throw new Error("Choose exactly one schedule: --at, --every, --cron, or --on-exit");
  return schedule;
}
/** Resolve cron creation schedule from either a positional shorthand or explicit flags. */
function resolveCronCreateScheduleFromArgs(options) {
  const positionalSchedule = normalizeOptionalString(options.positionalSchedule);
  if (!positionalSchedule) return resolveCronCreateSchedule(options);
  if (countChosenSchedules(normalizeScheduleOptions(options)) > 0)
    throw new Error("Choose a positional schedule or one of --at, --every, --cron, or --on-exit.");
  const every = parseEverySchedule(positionalSchedule);
  return resolveCronCreateSchedule({
    ...options,
    at: every ? void 0 : looksLikeCronExpression(positionalSchedule) ? void 0 : positionalSchedule,
    cron: looksLikeCronExpression(positionalSchedule) ? positionalSchedule : void 0,
    every,
  });
}
/** Resolve a cron edit request, allowing at most one direct schedule replacement. */
function resolveCronEditScheduleRequest(options) {
  const normalized = normalizeScheduleOptions(options);
  if (countChosenSchedules(normalized) > 1) throw new Error("Choose at most one schedule change");
  const schedule = resolveDirectSchedule(normalized);
  if (schedule)
    return {
      kind: "direct",
      schedule,
    };
  if (normalized.requestedStaggerMs !== void 0 || normalized.tz !== void 0)
    return {
      kind: "patch-existing-cron",
      tz: normalized.tz,
      staggerMs: normalized.requestedStaggerMs,
    };
  return { kind: "none" };
}
/** Apply `--tz`, `--stagger`, or `--exact` metadata changes to an existing cron schedule. */
function applyExistingCronSchedulePatch(existingSchedule, request) {
  if (existingSchedule.kind !== "cron")
    throw new Error("Current job is not a cron schedule; use --cron to convert first");
  return {
    kind: "cron",
    expr: existingSchedule.expr,
    tz: request.tz ?? existingSchedule.tz,
    staggerMs: request.staggerMs !== void 0 ? request.staggerMs : existingSchedule.staggerMs,
  };
}
function normalizeScheduleOptions(options) {
  const staggerRaw = normalizeOptionalString(options.stagger) ?? "";
  const useExact = Boolean(options.exact);
  if (staggerRaw && useExact) throw new Error("Choose either --stagger or --exact, not both");
  return {
    at: normalizeOptionalString(options.at) ?? "",
    every: normalizeOptionalString(options.every) ?? "",
    cronExpr: normalizeOptionalString(options.cron) ?? "",
    onExitCommand: normalizeOptionalString(options.onExit) ?? "",
    onExitCwd: normalizeOptionalString(options.onExitCwd),
    tz: normalizeOptionalString(options.tz),
    requestedStaggerMs: parseCronStaggerMs({
      staggerRaw,
      useExact,
    }),
  };
}
function countChosenSchedules(options) {
  return [
    Boolean(options.at),
    Boolean(options.every),
    Boolean(options.cronExpr),
    Boolean(options.onExitCommand),
  ].filter(Boolean).length;
}
function parseEverySchedule(value) {
  return /^every\s+(.+)$/iu.exec(value.trim())?.[1]?.trim() || void 0;
}
function looksLikeCronExpression(value) {
  const parts = value.trim().split(/\s+/u);
  return parts.length === 5 || parts.length === 6;
}
function resolveDirectSchedule(options) {
  if (options.onExitCwd && !options.onExitCommand)
    throw new Error("--on-exit-cwd requires --on-exit.");
  if (options.tz && options.every)
    throw new Error("--tz is only valid with --cron or offset-less --at");
  if (options.requestedStaggerMs !== void 0 && (options.at || options.every))
    throw new Error("--stagger/--exact are only valid for cron schedules");
  if (options.at) {
    const atIso = parseAt(options.at, options.tz);
    if (!atIso) throw new Error("Invalid --at. Use an ISO timestamp or a duration like 20m.");
    return {
      kind: "at",
      at: atIso,
    };
  }
  if (options.every) {
    const everyMs = parsePositiveCronDurationMs(options.every);
    if (!everyMs) throw new Error("Invalid --every. Use a duration like 10m, 1h, or 1d.");
    return {
      kind: "every",
      everyMs,
    };
  }
  if (options.cronExpr)
    return {
      kind: "cron",
      expr: options.cronExpr,
      tz: options.tz,
      staggerMs: options.requestedStaggerMs,
    };
  if (options.onExitCommand) {
    if (options.tz || options.requestedStaggerMs !== void 0)
      throw new Error("--tz/--stagger/--exact are not valid with --on-exit");
    return {
      kind: "on-exit",
      command: options.onExitCommand,
      ...(options.onExitCwd ? { cwd: options.onExitCwd } : {}),
    };
  }
}
//#endregion
//#region src/cli/cron-cli/thread-id-shared.ts
function parseCronThreadIdOption(value) {
  const raw = normalizeOptionalString(value);
  if (!raw) return;
  if (!/^\d+$/.test(raw))
    throw new Error("--thread-id must be a positive integer Telegram topic thread id");
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0)
    throw new Error("--thread-id must be a safe positive integer Telegram topic thread id");
  return parsed;
}
function normalizeCronSessionTargetOption(value) {
  const raw = normalizeOptionalString(value);
  if (!raw) return;
  const lower = normalizeLowercaseStringOrEmpty(raw);
  if (lower === "main" || lower === "isolated" || lower === "current") return lower;
  if (lower.startsWith("session:")) {
    const id = normalizeOptionalString(raw.slice(8));
    return id ? `session:${id}` : void 0;
  }
}
//#endregion
//#region src/cli/cron-cli/trigger-options.ts
const MAX_CRON_TRIGGER_SCRIPT_BYTES = 65536;
async function readStdin(stream) {
  const chunks = [];
  let total = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > MAX_CRON_TRIGGER_SCRIPT_BYTES)
      throw new Error("Trigger script exceeds 65536 bytes");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks, total).toString("utf8");
}
/** Reads a trigger script locally before sending the cron RPC. */
async function readCronTriggerScript(source, deps) {
  const raw =
    source === "-"
      ? await readStdin(deps?.stdin ?? process.stdin)
      : await (deps?.readFile ?? ((path) => fs.readFile(path, "utf8")))(source);
  if (Buffer.byteLength(raw, "utf8") > MAX_CRON_TRIGGER_SCRIPT_BYTES)
    throw new Error("Trigger script exceeds 65536 bytes");
  const script = raw.trim();
  if (!script) throw new Error("Trigger script must not be empty");
  return script;
}
//#endregion
//#region src/cli/cron-cli/register.cron-add.ts
function registerCronStatusCommand(cron) {
  addGatewayClientOptions(
    cron
      .command("status")
      .description("Show cron scheduler status")
      .option("--json", "Output JSON", false)
      .action(async (opts) => {
        try {
          printCronJson(await callGatewayFromCli("cron.status", opts, {}));
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
}
function registerCronListCommand(cron) {
  addGatewayClientOptions(
    cron
      .command("list")
      .description("List cron jobs")
      .option("--all", "Include disabled jobs", false)
      .option("--agent <id>", "Filter by agent id")
      .option("--json", "Output JSON", false)
      .action(async (opts) => {
        try {
          const listParams = { includeDisabled: Boolean(opts.all) };
          const agentId = normalizeOptionalString(opts.agent);
          if (agentId) listParams.agentId = sanitizeAgentId(agentId);
          const res = await callGatewayFromCli("cron.list", opts, listParams);
          if (opts.json) {
            printCronJson(enrichCronJsonWithStatus(res));
            return;
          }
          printCronList(res?.jobs ?? [], defaultRuntime, {
            deliveryPreviews: coerceCronDeliveryPreviews(res),
          });
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
}
function registerCronAddCommand(cron) {
  addGatewayClientOptions(
    cron
      .command("add")
      .alias("create")
      .description("Add a cron job")
      .argument("[scheduleOrName]", "Schedule string, or job name when using --at/--every/--cron")
      .argument("[message]", "Agent message when using a positional schedule")
      .option("--name <name>", "Job name")
      .option("--declaration-key <key>", "Idempotent declaration identity key")
      .option("--display-name <name>", "Human-readable declarative job label")
      .option("--description <text>", "Optional description")
      .option("--disabled", "Create job disabled", false)
      .option("--delete-after-run", "Delete one-shot job after it succeeds", false)
      .option("--keep-after-run", "Keep one-shot job after it succeeds", false)
      .option("--agent <id>", "Agent id for this job")
      .option("--session <target>", "Session target (main|isolated)")
      .option("--session-key <key>", "Session key for job routing (e.g. agent:my-agent:my-session)")
      .option("--wake <mode>", "Wake mode (now|next-heartbeat)", "now")
      .option(
        "--at <when>",
        "Run once at time (ISO with offset, or +duration). Use --tz for offset-less datetimes",
      )
      .option("--every <duration>", "Run every duration (e.g. 10m, 1h)")
      .option("--cron <expr>", "Cron expression (5-field or 6-field with seconds)")
      .option(
        "--on-exit <shell>",
        "Fire once when this watched command exits (event trigger; survives turn teardown)",
      )
      .option("--on-exit-cwd <path>", "Working directory for the --on-exit watched command")
      .option(
        "--tz <iana>",
        "Timezone for cron expressions (IANA; cron default: Gateway host local timezone)",
        "",
      )
      .option("--stagger <duration>", "Cron stagger window (e.g. 30s, 5m)")
      .option("--exact", "Disable cron staggering (set stagger to 0)", false)
      .option("--trigger-script <path|->", "Condition script file, or - for stdin")
      .option("--trigger-once", "Disable after the first successful triggered run", false)
      .option("--system-event <text>", "System event payload (main session)")
      .option("--message <text>", "Agent message payload")
      .option("--command <shell>", "Command payload run as sh -lc <shell> on the Gateway")
      .option("--command-argv <json>", "Command payload argv as JSON array of strings")
      .option("--command-cwd <path>", "Working directory for command payloads")
      .option(
        "--command-env <KEY=VALUE>",
        "Environment override for command payloads (repeatable)",
        (value, previous) => [...(previous ?? []), value],
      )
      .option("--command-input <text>", "stdin for command payloads")
      .option("--thinking <level>", `Thinking level for agent jobs (${THINKING_LEVELS_HELP})`)
      .option("--model <model>", "Model override for agent jobs (provider/model or alias)")
      .option("--fallbacks <list>", "Fallback model list for agent jobs")
      .option("--timeout-seconds <n>", "Timeout seconds for agent or command jobs")
      .option("--no-output-timeout-seconds <n>", "No-output timeout seconds for command jobs")
      .option("--output-max-bytes <n>", "Maximum captured stdout/stderr bytes for command jobs")
      .option("--light-context", "Use lightweight bootstrap context for agent jobs", false)
      .option("--tools <list>", "Tool allow-list (e.g. exec,read,write or exec read write)")
      .option("--announce", "Fallback-deliver final text to a chat", false)
      .option("--deliver", "Deprecated (use --announce). Fallback-delivers final text to a chat.")
      .option("--no-deliver", "Disable runner fallback delivery")
      .option("--webhook <url>", "POST the finished payload to a webhook URL")
      .option("--channel <channel>", `Delivery channel (${getCronChannelOptions()})`, "last")
      .option(
        "--to <dest>",
        "Delivery destination (E.164, Telegram chatId, or Discord channel/user)",
      )
      .option("--thread-id <id>", "Telegram forum topic thread id")
      .option("--account <id>", "Channel account id for delivery (multi-account setups)")
      .option("--best-effort-deliver", "Do not fail the job if delivery fails", false)
      .option("--json", "Output JSON", false)
      .action(async (nameArg, messageArg, opts, cmd) => {
        try {
          const hasScheduleFlag =
            typeof opts.at === "string" ||
            typeof opts.cron === "string" ||
            typeof opts.every === "string" ||
            typeof opts.onExit === "string";
          const positionalSchedule = hasScheduleFlag ? void 0 : nameArg;
          const schedule = resolveCronCreateScheduleFromArgs({
            at: opts.at,
            cron: opts.cron,
            every: opts.every,
            onExit: opts.onExit,
            onExitCwd: opts.onExitCwd,
            exact: opts.exact,
            positionalSchedule,
            stagger: opts.stagger,
            tz: opts.tz,
          });
          const wakeMode = normalizeOptionalString(opts.wake) ?? "now";
          if (wakeMode !== "now" && wakeMode !== "next-heartbeat")
            throw new Error("--wake must be now or next-heartbeat");
          const rawAgentId = normalizeOptionalString(opts.agent);
          const agentId = rawAgentId ? sanitizeAgentId(rawAgentId) : void 0;
          const hasAnnounce = Boolean(opts.announce) || opts.deliver === true;
          const hasNoDeliver = opts.deliver === false;
          const webhookUrl = normalizeOptionalString(opts.webhook);
          const hasWebhook = typeof opts.webhook === "string";
          if ([hasAnnounce, hasNoDeliver, hasWebhook].filter(Boolean).length > 1)
            throw new Error("Choose at most one of --announce, --no-deliver, or --webhook");
          const payload = (() => {
            const systemEvent = normalizeOptionalString(opts.systemEvent) ?? "";
            const optionMessage = normalizeOptionalString(opts.message);
            const positionalMessage = normalizeOptionalString(messageArg);
            const commandShell = normalizeOptionalString(opts.command);
            const commandArgv = parseCronCommandArgv(opts.commandArgv);
            if (optionMessage && positionalMessage && optionMessage !== positionalMessage)
              throw new Error(
                "Pass the cron job message either positionally or with --message, not both.",
              );
            const message = optionMessage ?? positionalMessage ?? "";
            if (commandShell && commandArgv)
              throw new Error(
                "Pass command payload either with --command or --command-argv, not both.",
              );
            if (
              [
                Boolean(systemEvent),
                Boolean(message),
                Boolean(commandShell) || Boolean(commandArgv),
              ].filter(Boolean).length !== 1
            )
              throw new Error(
                "Choose exactly one payload: --system-event, --message, or --command",
              );
            if (systemEvent)
              return {
                kind: "systemEvent",
                text: systemEvent,
              };
            const timeoutSeconds = parseStrictPositiveIntOrUndefined(opts.timeoutSeconds);
            if (opts.timeoutSeconds !== void 0 && timeoutSeconds === void 0)
              throw new Error("Invalid --timeout-seconds (must be a positive integer).");
            if (commandShell || commandArgv) {
              const rawNoOutputTimeoutSeconds =
                opts.noOutputTimeoutSeconds ??
                (typeof opts.outputTimeoutSeconds === "string" ||
                typeof opts.outputTimeoutSeconds === "number"
                  ? opts.outputTimeoutSeconds
                  : void 0);
              const noOutputTimeoutSeconds =
                parseStrictPositiveIntOrUndefined(rawNoOutputTimeoutSeconds);
              if (rawNoOutputTimeoutSeconds !== void 0 && noOutputTimeoutSeconds === void 0)
                throw new Error(
                  "Invalid --no-output-timeout-seconds (must be a positive integer).",
                );
              const outputMaxBytes = parseStrictPositiveIntOrUndefined(opts.outputMaxBytes);
              if (opts.outputMaxBytes !== void 0 && outputMaxBytes === void 0)
                throw new Error("Invalid --output-max-bytes (must be a positive integer).");
              return {
                kind: "command",
                argv: commandArgv ?? ["sh", "-lc", commandShell ?? ""],
                cwd: normalizeOptionalString(opts.commandCwd),
                env: parseCronCommandEnv(opts.commandEnv),
                input: typeof opts.commandInput === "string" ? opts.commandInput : void 0,
                timeoutSeconds:
                  timeoutSeconds && Number.isFinite(timeoutSeconds) ? timeoutSeconds : void 0,
                noOutputTimeoutSeconds:
                  noOutputTimeoutSeconds && Number.isFinite(noOutputTimeoutSeconds)
                    ? noOutputTimeoutSeconds
                    : void 0,
                outputMaxBytes:
                  outputMaxBytes && Number.isFinite(outputMaxBytes) ? outputMaxBytes : void 0,
              };
            }
            return {
              kind: "agentTurn",
              message,
              model: normalizeOptionalString(opts.model),
              fallbacks: parseCronFallbacks(opts.fallbacks),
              thinking: normalizeOptionalString(opts.thinking),
              timeoutSeconds:
                timeoutSeconds && Number.isFinite(timeoutSeconds) ? timeoutSeconds : void 0,
              lightContext: opts.lightContext === true ? true : void 0,
              toolsAllow: parseCronToolsAllow(opts.tools),
            };
          })();
          const sessionSource = cmd.getOptionValueSource("session");
          const sessionTargetRaw = normalizeOptionalString(opts.session) ?? "";
          const inferredSessionTarget =
            payload.kind === "agentTurn" || payload.kind === "command" ? "isolated" : "main";
          const sessionTarget =
            sessionSource === "cli"
              ? normalizeCronSessionTargetOption(sessionTargetRaw) || ""
              : inferredSessionTarget;
          const isCustomSessionTarget =
            normalizeLowercaseStringOrEmpty(sessionTarget).startsWith("session:") &&
            Boolean(normalizeOptionalString(sessionTarget.slice(8)));
          const isIsolatedLikeSessionTarget =
            sessionTarget === "isolated" || sessionTarget === "current" || isCustomSessionTarget;
          if (sessionTarget !== "main" && !isIsolatedLikeSessionTarget)
            throw new Error("--session must be main, isolated, current, or session:<id>");
          if (opts.deleteAfterRun && opts.keepAfterRun)
            throw new Error("Choose --delete-after-run or --keep-after-run, not both");
          if (sessionTarget === "main" && payload.kind !== "systemEvent")
            throw new Error("Main jobs require --system-event (systemEvent).");
          if (
            isIsolatedLikeSessionTarget &&
            payload.kind !== "agentTurn" &&
            payload.kind !== "command"
          )
            throw new Error(
              "Isolated/current/custom-session jobs require --message (agentTurn) or --command.",
            );
          if (
            (opts.announce || typeof opts.deliver === "boolean") &&
            (!isIsolatedLikeSessionTarget ||
              (payload.kind !== "agentTurn" && payload.kind !== "command"))
          )
            throw new Error(
              "--announce/--no-deliver require a non-main agentTurn or command session target.",
            );
          const accountId = normalizeOptionalString(opts.account);
          const threadId = parseCronThreadIdOption(opts.threadId);
          const hasThreadId = typeof threadId === "number";
          const hasChatDeliveryTarget =
            cmd.getOptionValueSource("channel") === "cli" ||
            typeof opts.to === "string" ||
            Boolean(accountId) ||
            hasThreadId;
          if (
            (accountId || hasThreadId) &&
            (!isIsolatedLikeSessionTarget ||
              (payload.kind !== "agentTurn" && payload.kind !== "command"))
          )
            throw new Error(
              "--account and --thread-id require a non-main agentTurn or command job with delivery.",
            );
          if (hasWebhook && hasChatDeliveryTarget)
            throw new Error("--webhook cannot be combined with chat delivery options.");
          const deliveryMode = hasWebhook
            ? "webhook"
            : isIsolatedLikeSessionTarget &&
                (payload.kind === "agentTurn" || payload.kind === "command")
              ? hasAnnounce
                ? "announce"
                : hasNoDeliver
                  ? "none"
                  : "announce"
              : void 0;
          const optionName = normalizeOptionalString(opts.name);
          const positionalName = hasScheduleFlag ? normalizeOptionalString(nameArg) : void 0;
          if (optionName && positionalName && optionName !== positionalName)
            throw new Error("Pass the cron job name either positionally or with --name, not both.");
          const name = optionName ?? positionalName ?? "";
          if (!name) throw new Error("Cron job name is required. Pass a name or --name <name>.");
          const description = normalizeOptionalString(opts.description);
          const declarationKey = normalizeOptionalString(opts.declarationKey);
          if (typeof opts.declarationKey === "string" && !declarationKey)
            throw new Error("--declaration-key must not be blank");
          const displayName = normalizeOptionalString(opts.displayName);
          if (typeof opts.displayName === "string" && !displayName)
            throw new Error("--display-name must not be blank");
          const sessionKey = normalizeOptionalString(opts.sessionKey);
          const triggerScriptPath = normalizeOptionalString(opts.triggerScript);
          if (opts.triggerOnce && !triggerScriptPath)
            throw new Error("--trigger-once requires --trigger-script");
          const trigger = triggerScriptPath
            ? {
                script: await readCronTriggerScript(triggerScriptPath),
                ...(opts.triggerOnce ? { once: true } : {}),
              }
            : void 0;
          if ((payload.kind === "agentTurn" || payload.kind === "command") && !agentId)
            defaultRuntime.error(
              theme.warn(
                "No --agent specified; the job will run with the configured default agent. Specify --agent to choose a specific agent.",
              ),
            );
          printCronJson(
            await callGatewayFromCli("cron.add", opts, {
              name,
              declarationKey,
              displayName,
              description,
              ...(declarationKey && cmd.getOptionValueSource("disabled") !== "cli"
                ? {}
                : { enabled: !opts.disabled }),
              deleteAfterRun: opts.deleteAfterRun ? true : opts.keepAfterRun ? false : void 0,
              agentId,
              sessionKey,
              schedule,
              trigger,
              sessionTarget,
              wakeMode,
              payload,
              delivery: deliveryMode
                ? {
                    mode: deliveryMode,
                    channel: hasWebhook ? void 0 : normalizeOptionalString(opts.channel),
                    to: hasWebhook ? webhookUrl : normalizeOptionalString(opts.to),
                    threadId: hasWebhook ? void 0 : threadId,
                    accountId: hasWebhook ? void 0 : accountId,
                    bestEffort: opts.bestEffortDeliver ? true : void 0,
                  }
                : void 0,
            }),
          );
          await warnIfCronSchedulerDisabled(opts);
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
}
//#endregion
//#region src/cli/cron-cli/register.cron-edit.ts
const CRON_EDIT_LOOKUP_PAGE_SIZE = 200;
const CRON_EDIT_LOOKUP_MAX_PAGES = 50;
const assignIf = (target, key, value, shouldAssign) => {
  if (shouldAssign) target[key] = value;
};
function isUnknownCronGetMethodError(error) {
  return (
    error instanceof Error &&
    error.name === "GatewayClientRequestError" &&
    error.gatewayCode === "INVALID_REQUEST" &&
    error.message.includes("unknown method: cron.get")
  );
}
async function loadCronJobForEditViaList(opts, id) {
  let offset = 0;
  for (let page = 0; page < CRON_EDIT_LOOKUP_MAX_PAGES; page += 1) {
    const listed = await callGatewayFromCli("cron.list", opts, {
      includeDisabled: true,
      limit: CRON_EDIT_LOOKUP_PAGE_SIZE,
      offset,
    });
    const existing = (listed?.jobs ?? []).find((job) => job.id === id);
    if (existing) return existing;
    if (!listed?.hasMore || typeof listed.nextOffset !== "number") return;
    if (listed.nextOffset <= offset)
      throw new Error("cron.list pagination did not advance while looking up cron job");
    offset = listed.nextOffset;
  }
  throw new Error("cron.list pagination exceeded maximum pages while looking up cron job");
}
async function readCronJobForEdit(opts, id) {
  try {
    return await callGatewayFromCli("cron.get", opts, { id });
  } catch (error) {
    if (!isUnknownCronGetMethodError(error)) throw error;
    const existing = await loadCronJobForEditViaList(opts, id);
    if (!existing) throw new Error(`unknown cron job id: ${id}`, { cause: error });
    return existing;
  }
}
function registerCronEditCommand(cron) {
  addGatewayClientOptions(
    cron
      .command("edit")
      .description("Edit a cron job (patch fields)")
      .argument("<id>", "Job id")
      .option("--name <name>", "Set name")
      .option("--description <text>", "Set description")
      .option("--enable", "Enable job", false)
      .option("--disable", "Disable job", false)
      .option("--delete-after-run", "Delete one-shot job after it succeeds", false)
      .option("--keep-after-run", "Keep one-shot job after it succeeds", false)
      .option("--session <target>", "Session target (main|isolated)")
      .option("--agent <id>", "Set agent id")
      .option("--clear-agent", "Unset agent and use default", false)
      .option("--session-key <key>", "Set session key for job routing")
      .option("--clear-session-key", "Unset session key", false)
      .option("--wake <mode>", "Wake mode (now|next-heartbeat)")
      .option("--at <when>", "Set one-shot time (ISO, offset-less uses --tz) or duration like 20m")
      .option("--every <duration>", "Set interval duration like 10m")
      .option("--cron <expr>", "Set cron expression")
      .option(
        "--tz <iana>",
        "Timezone for cron expressions (IANA; cron default: Gateway host local timezone)",
      )
      .option("--stagger <duration>", "Cron stagger window (e.g. 30s, 5m)")
      .option("--exact", "Disable cron staggering (set stagger to 0)")
      .option("--trigger-script <path|->", "Set condition script from file, or - for stdin")
      .option("--trigger-once", "Disable after the first successful triggered run", false)
      .option("--clear-trigger", "Remove the condition trigger", false)
      .option("--system-event <text>", "Set systemEvent payload")
      .option("--message <text>", "Set agentTurn payload message")
      .option("--command <shell>", "Set command payload run as sh -lc <shell> on the Gateway")
      .option("--command-argv <json>", "Set command payload argv as JSON array of strings")
      .option("--command-cwd <path>", "Set command payload working directory")
      .option(
        "--command-env <KEY=VALUE>",
        "Set command payload environment overrides (repeatable)",
        (value, previous) => [...(previous ?? []), value],
      )
      .option("--command-input <text>", "Set command payload stdin")
      .option("--thinking <level>", `Thinking level for agent jobs (${THINKING_LEVELS_HELP})`)
      .option(
        "--clear-thinking",
        "Remove the per-job thinking override (restore normal cron thinking precedence)",
        false,
      )
      .option("--model <model>", "Model override for agent jobs")
      .option("--fallbacks <list>", "Fallback model list for agent jobs")
      .option("--clear-fallbacks", "Remove per-job fallback override", false)
      .option(
        "--clear-model",
        "Remove the per-job model override (restore normal cron model precedence)",
        false,
      )
      .option("--timeout-seconds <n>", "Timeout seconds for agent or command jobs")
      .option("--no-output-timeout-seconds <n>", "No-output timeout seconds for command jobs")
      .option("--output-max-bytes <n>", "Maximum captured stdout/stderr bytes for command jobs")
      .option("--light-context", "Enable lightweight bootstrap context for agent jobs")
      .option("--no-light-context", "Disable lightweight bootstrap context for agent jobs")
      .option("--tools <list>", "Tool allow-list (e.g. exec,read,write or exec read write)")
      .option("--clear-tools", "Remove tool allow-list (use all tools)", false)
      .option("--announce", "Fallback-deliver final text to a chat")
      .option("--deliver", "Deprecated (use --announce). Fallback-delivers final text to a chat.")
      .option("--no-deliver", "Disable runner fallback delivery")
      .option("--webhook <url>", "POST the finished payload to a webhook URL")
      .option("--channel <channel>", `Delivery channel (${getCronChannelOptions()})`)
      .option(
        "--to <dest>",
        "Delivery destination (E.164, Telegram chatId, or Discord channel/user)",
      )
      .option("--thread-id <id>", "Telegram forum topic thread id")
      .option("--account <id>", "Channel account id for delivery (multi-account setups)")
      .option("--clear-channel", "Unset the delivery channel", false)
      .option("--clear-to", "Unset the delivery destination", false)
      .option("--clear-thread-id", "Unset the Telegram forum topic thread id", false)
      .option("--clear-account", "Unset the per-job delivery account override", false)
      .option(
        "--best-effort-deliver",
        "Do not fail job if delivery fails (also implies --announce when used alone)",
      )
      .option("--no-best-effort-deliver", "Fail job when delivery fails")
      .option("--failure-alert", "Enable failure alerts for this job")
      .option("--no-failure-alert", "Disable failure alerts for this job")
      .option("--failure-alert-after <n>", "Alert after N consecutive job errors")
      .option(
        "--failure-alert-channel <channel>",
        `Failure alert channel (${getCronChannelOptions()})`,
      )
      .option("--failure-alert-to <dest>", "Failure alert destination")
      .option("--failure-alert-cooldown <duration>", "Minimum time between alerts (e.g. 1h, 30m)")
      .option("--failure-alert-include-skipped", "Count consecutive skipped runs toward alerts")
      .option("--failure-alert-exclude-skipped", "Alert only on execution errors")
      .option("--failure-alert-mode <mode>", "Failure alert delivery mode (announce or webhook)")
      .option(
        "--failure-alert-account-id <id>",
        "Account ID for failure alert channel (multi-account setups)",
      )
      .action(async (id, opts) => {
        try {
          const sessionTarget =
            typeof opts.session === "string"
              ? normalizeCronSessionTargetOption(opts.session)
              : void 0;
          if (typeof opts.session === "string" && !sessionTarget)
            throw new Error("--session must be main, isolated, current, or session:<id>");
          if (sessionTarget === "main" && (opts.message || opts.command || opts.commandArgv))
            throw new Error(
              "Main jobs cannot use --message or --command; use --system-event or --session isolated.",
            );
          if (
            (sessionTarget === "isolated" ||
              sessionTarget === "current" ||
              sessionTarget?.startsWith("session:")) &&
            opts.systemEvent
          )
            throw new Error(
              "Isolated jobs cannot use --system-event; use --message, --command, or --session main.",
            );
          const hasWebhookDelivery = typeof opts.webhook === "string";
          if (
            [Boolean(opts.announce), typeof opts.deliver === "boolean", hasWebhookDelivery].filter(
              Boolean,
            ).length > 1
          )
            throw new Error("Choose at most one of --announce, --no-deliver, or --webhook.");
          const patch = {};
          if (typeof opts.name === "string") patch.name = opts.name;
          if (typeof opts.description === "string") patch.description = opts.description;
          if (opts.enable && opts.disable)
            throw new Error("Choose --enable or --disable, not both");
          if (opts.enable) patch.enabled = true;
          if (opts.disable) patch.enabled = false;
          if (opts.deleteAfterRun && opts.keepAfterRun)
            throw new Error("Choose --delete-after-run or --keep-after-run, not both");
          if (opts.deleteAfterRun) patch.deleteAfterRun = true;
          if (opts.keepAfterRun) patch.deleteAfterRun = false;
          if (typeof opts.session === "string") patch.sessionTarget = sessionTarget;
          if (typeof opts.wake === "string") {
            const wakeMode = opts.wake.trim();
            if (wakeMode !== "now" && wakeMode !== "next-heartbeat")
              throw new Error("--wake must be now or next-heartbeat");
            patch.wakeMode = wakeMode;
          }
          if (opts.agent && opts.clearAgent)
            throw new Error("Use --agent or --clear-agent, not both");
          if (typeof opts.agent === "string" && opts.agent.trim())
            patch.agentId = sanitizeAgentId(opts.agent.trim());
          if (opts.clearAgent) patch.agentId = null;
          if (opts.sessionKey && opts.clearSessionKey)
            throw new Error("Use --session-key or --clear-session-key, not both");
          if (typeof opts.sessionKey === "string" && opts.sessionKey.trim())
            patch.sessionKey = opts.sessionKey.trim();
          if (opts.clearSessionKey) patch.sessionKey = null;
          const triggerScriptPath = normalizeOptionalString(opts.triggerScript);
          if (opts.clearTrigger && (triggerScriptPath || opts.triggerOnce))
            throw new Error("Use --clear-trigger or trigger options, not both");
          if (opts.clearTrigger) patch.trigger = null;
          else if (triggerScriptPath)
            patch.trigger = {
              script: await readCronTriggerScript(triggerScriptPath),
              ...(opts.triggerOnce ? { once: true } : {}),
            };
          else if (opts.triggerOnce) {
            const existing = await readCronJobForEdit(opts, String(id));
            if (!existing.trigger)
              throw new Error("--trigger-once requires an existing trigger or --trigger-script");
            patch.trigger = {
              ...existing.trigger,
              once: true,
            };
          }
          const scheduleRequest = resolveCronEditScheduleRequest({
            at: opts.at,
            cron: opts.cron,
            every: opts.every,
            exact: opts.exact,
            stagger: opts.stagger,
            tz: opts.tz,
          });
          if (scheduleRequest.kind === "direct")
            if (
              scheduleRequest.schedule.kind === "cron" &&
              scheduleRequest.schedule.tz === void 0
            ) {
              const existing = await readCronJobForEdit(opts, String(id));
              patch.schedule =
                existing.schedule.kind === "cron" && existing.schedule.tz !== void 0
                  ? {
                      ...scheduleRequest.schedule,
                      tz: existing.schedule.tz,
                    }
                  : scheduleRequest.schedule;
            } else patch.schedule = scheduleRequest.schedule;
          else if (scheduleRequest.kind === "patch-existing-cron")
            patch.schedule = applyExistingCronSchedulePatch(
              (await readCronJobForEdit(opts, String(id))).schedule,
              scheduleRequest,
            );
          const hasSystemEventPatch = typeof opts.systemEvent === "string";
          const commandShell = normalizeOptionalString(opts.command);
          const commandArgv = parseCronCommandArgv(opts.commandArgv);
          if (commandShell && commandArgv)
            throw new Error(
              "Pass command payload either with --command or --command-argv, not both.",
            );
          const model = normalizeOptionalString(opts.model);
          if (model && opts.clearModel) throw new Error("Use --model or --clear-model, not both");
          const thinking = normalizeOptionalString(opts.thinking);
          if (thinking && opts.clearThinking)
            throw new Error("Use --thinking or --clear-thinking, not both");
          const fallbacks = parseCronFallbacks(opts.fallbacks);
          if (typeof opts.fallbacks === "string" && opts.clearFallbacks)
            throw new Error("Use --fallbacks or --clear-fallbacks, not both");
          const toolsAllow = parseCronToolsAllow(opts.tools);
          const rawTimeoutSeconds =
            opts.timeoutSeconds === void 0 ? void 0 : String(opts.timeoutSeconds).trim();
          if (rawTimeoutSeconds !== void 0 && !/^\d+$/u.test(rawTimeoutSeconds))
            throw new Error("Invalid --timeout-seconds (must be a positive integer).");
          const timeoutSeconds = rawTimeoutSeconds === void 0 ? void 0 : Number(rawTimeoutSeconds);
          const hasTimeoutSeconds =
            typeof timeoutSeconds === "number" &&
            Number.isSafeInteger(timeoutSeconds) &&
            timeoutSeconds > 0;
          if (rawTimeoutSeconds !== void 0 && !hasTimeoutSeconds)
            throw new Error("Invalid --timeout-seconds (must be a positive integer).");
          const rawNoOutputTimeoutSeconds =
            opts.noOutputTimeoutSeconds ??
            (typeof opts.outputTimeoutSeconds === "string" ||
            typeof opts.outputTimeoutSeconds === "number"
              ? opts.outputTimeoutSeconds
              : void 0);
          const noOutputTimeoutSeconds = parseStrictPositiveInteger(rawNoOutputTimeoutSeconds);
          if (rawNoOutputTimeoutSeconds !== void 0 && noOutputTimeoutSeconds === void 0)
            throw new Error("Invalid --no-output-timeout-seconds (must be a positive integer).");
          const outputMaxBytes = parseStrictPositiveInteger(opts.outputMaxBytes);
          if (opts.outputMaxBytes !== void 0 && outputMaxBytes === void 0)
            throw new Error("Invalid --output-max-bytes (must be a positive integer).");
          const hasDeliveryModeFlag =
            opts.announce || typeof opts.deliver === "boolean" || hasWebhookDelivery;
          const threadId = parseCronThreadIdOption(opts.threadId);
          const hasDeliveryThreadId = typeof threadId === "number";
          const hasDeliveryTarget =
            typeof opts.channel === "string" ||
            typeof opts.to === "string" ||
            hasDeliveryThreadId ||
            Boolean(opts.clearChannel) ||
            Boolean(opts.clearTo) ||
            Boolean(opts.clearThreadId);
          const hasDeliveryAccount = typeof opts.account === "string" || Boolean(opts.clearAccount);
          const hasBestEffort = typeof opts.bestEffortDeliver === "boolean";
          if (hasWebhookDelivery && (hasDeliveryTarget || hasDeliveryAccount))
            throw new Error("--webhook cannot be combined with chat delivery options.");
          if (typeof opts.channel === "string" && opts.clearChannel)
            throw new Error("Use --channel or --clear-channel, not both");
          if (typeof opts.to === "string" && opts.clearTo)
            throw new Error("Use --to or --clear-to, not both");
          if (hasDeliveryThreadId && opts.clearThreadId)
            throw new Error("Use --thread-id or --clear-thread-id, not both");
          if (typeof opts.account === "string" && opts.clearAccount)
            throw new Error("Use --account or --clear-account, not both");
          const hasCommandSpecificPayloadField =
            Boolean(commandShell) ||
            Boolean(commandArgv) ||
            typeof opts.commandCwd === "string" ||
            typeof opts.commandInput === "string" ||
            opts.commandEnv !== void 0 ||
            noOutputTimeoutSeconds !== void 0 ||
            outputMaxBytes !== void 0;
          let timeoutOnlyPayloadKind;
          if (
            hasTimeoutSeconds &&
            !hasCommandSpecificPayloadField &&
            typeof opts.message !== "string" &&
            !model &&
            typeof opts.fallbacks !== "string" &&
            !opts.clearFallbacks &&
            !thinking &&
            !opts.clearThinking &&
            typeof opts.lightContext !== "boolean" &&
            typeof opts.tools !== "string" &&
            !Array.isArray(opts.tools) &&
            !opts.clearTools
          )
            timeoutOnlyPayloadKind =
              (await readCronJobForEdit(opts, String(id))).payload.kind === "command"
                ? "command"
                : "agentTurn";
          const hasAgentTurnPayloadField =
            typeof opts.message === "string" ||
            Boolean(model) ||
            Boolean(opts.clearModel) ||
            typeof opts.fallbacks === "string" ||
            Boolean(opts.clearFallbacks) ||
            Boolean(thinking) ||
            Boolean(opts.clearThinking) ||
            (hasTimeoutSeconds &&
              !hasCommandSpecificPayloadField &&
              timeoutOnlyPayloadKind !== "command") ||
            typeof opts.lightContext === "boolean" ||
            typeof opts.tools === "string" ||
            Array.isArray(opts.tools) ||
            opts.clearTools;
          const hasCommandPayloadField =
            hasCommandSpecificPayloadField ||
            (hasTimeoutSeconds &&
              (hasCommandSpecificPayloadField || timeoutOnlyPayloadKind === "command"));
          const hasAgentTurnPatch = hasAgentTurnPayloadField;
          const hasCommandPatch = hasCommandPayloadField;
          if ([hasSystemEventPatch, hasAgentTurnPatch, hasCommandPatch].filter(Boolean).length > 1)
            throw new Error("Choose at most one payload change");
          if (hasSystemEventPatch)
            patch.payload = {
              kind: "systemEvent",
              text: String(opts.systemEvent),
            };
          else if (hasAgentTurnPatch) {
            const payload = { kind: "agentTurn" };
            assignIf(payload, "message", String(opts.message), typeof opts.message === "string");
            if (opts.clearModel) payload.model = null;
            else assignIf(payload, "model", model, Boolean(model));
            assignIf(payload, "fallbacks", fallbacks, typeof opts.fallbacks === "string");
            assignIf(payload, "fallbacks", null, Boolean(opts.clearFallbacks));
            if (opts.clearThinking) payload.thinking = null;
            else assignIf(payload, "thinking", thinking, Boolean(thinking));
            assignIf(payload, "timeoutSeconds", timeoutSeconds, hasTimeoutSeconds);
            assignIf(
              payload,
              "lightContext",
              opts.lightContext,
              typeof opts.lightContext === "boolean",
            );
            if (opts.clearTools) payload.toolsAllow = null;
            else if (toolsAllow) payload.toolsAllow = toolsAllow;
            patch.payload = payload;
          } else if (hasCommandPatch) {
            const payload = { kind: "command" };
            assignIf(payload, "argv", commandArgv, Boolean(commandArgv));
            assignIf(payload, "argv", ["sh", "-lc", commandShell], Boolean(commandShell));
            assignIf(
              payload,
              "cwd",
              normalizeOptionalString(opts.commandCwd),
              typeof opts.commandCwd === "string",
            );
            assignIf(
              payload,
              "env",
              parseCronCommandEnv(opts.commandEnv),
              opts.commandEnv !== void 0,
            );
            assignIf(payload, "input", opts.commandInput, typeof opts.commandInput === "string");
            assignIf(payload, "timeoutSeconds", timeoutSeconds, hasTimeoutSeconds);
            assignIf(
              payload,
              "noOutputTimeoutSeconds",
              noOutputTimeoutSeconds,
              noOutputTimeoutSeconds !== void 0,
            );
            assignIf(payload, "outputMaxBytes", outputMaxBytes, outputMaxBytes !== void 0);
            patch.payload = payload;
          }
          if (hasDeliveryModeFlag || hasDeliveryTarget || hasDeliveryAccount || hasBestEffort) {
            const delivery = {};
            if (hasDeliveryModeFlag)
              delivery.mode = hasWebhookDelivery
                ? "webhook"
                : opts.announce || opts.deliver === true
                  ? "announce"
                  : "none";
            else if (opts.bestEffortDeliver === true) delivery.mode = "announce";
            if (opts.clearChannel) delivery.channel = null;
            else if (typeof opts.channel === "string") {
              const channel = opts.channel.trim();
              delivery.channel = channel ? channel : void 0;
            }
            if (hasWebhookDelivery) {
              const webhook = normalizeOptionalString(opts.webhook) ?? "";
              delivery.to = webhook ? webhook : void 0;
            } else if (opts.clearTo) delivery.to = null;
            else if (typeof opts.to === "string") {
              const to = opts.to.trim();
              delivery.to = to ? to : void 0;
            }
            if (opts.clearThreadId) delivery.threadId = null;
            else if (hasDeliveryThreadId) delivery.threadId = threadId;
            if (opts.clearAccount) delivery.accountId = null;
            else if (typeof opts.account === "string") {
              const account = opts.account.trim();
              delivery.accountId = account ? account : void 0;
            }
            if (typeof opts.bestEffortDeliver === "boolean")
              delivery.bestEffort = opts.bestEffortDeliver;
            patch.delivery = delivery;
          }
          const hasFailureAlertAfter = typeof opts.failureAlertAfter === "string";
          const hasFailureAlertChannel = typeof opts.failureAlertChannel === "string";
          const hasFailureAlertTo = typeof opts.failureAlertTo === "string";
          const hasFailureAlertCooldown = typeof opts.failureAlertCooldown === "string";
          const hasFailureAlertIncludeSkipped =
            typeof opts.failureAlertIncludeSkipped === "boolean";
          const hasFailureAlertExcludeSkipped =
            typeof opts.failureAlertExcludeSkipped === "boolean";
          const hasFailureAlertMode = typeof opts.failureAlertMode === "string";
          const hasFailureAlertAccountId = typeof opts.failureAlertAccountId === "string";
          if (hasFailureAlertIncludeSkipped && hasFailureAlertExcludeSkipped)
            throw new Error(
              "Use either --failure-alert-include-skipped or --failure-alert-exclude-skipped.",
            );
          const hasFailureAlertFields =
            hasFailureAlertAfter ||
            hasFailureAlertChannel ||
            hasFailureAlertTo ||
            hasFailureAlertCooldown ||
            hasFailureAlertIncludeSkipped ||
            hasFailureAlertExcludeSkipped ||
            hasFailureAlertMode ||
            hasFailureAlertAccountId;
          const failureAlertFlag =
            typeof opts.failureAlert === "boolean" ? opts.failureAlert : void 0;
          if (failureAlertFlag === false && hasFailureAlertFields)
            throw new Error("Use --no-failure-alert alone (without failure-alert-* options).");
          if (failureAlertFlag === false) patch.failureAlert = false;
          else if (failureAlertFlag === true || hasFailureAlertFields) {
            const failureAlert = {};
            if (hasFailureAlertAfter) {
              const after = parseStrictPositiveInteger(opts.failureAlertAfter);
              if (after === void 0)
                throw new Error("Invalid --failure-alert-after (must be a positive integer).");
              failureAlert.after = after;
            }
            if (hasFailureAlertChannel)
              failureAlert.channel = normalizeOptionalLowercaseString(opts.failureAlertChannel);
            if (hasFailureAlertTo) {
              const to = normalizeOptionalString(opts.failureAlertTo) ?? "";
              failureAlert.to = to ? to : void 0;
            }
            if (hasFailureAlertCooldown) {
              const cooldownMs = parsePositiveCronDurationMs(String(opts.failureAlertCooldown));
              if (!cooldownMs && cooldownMs !== 0)
                throw new Error("Invalid --failure-alert-cooldown.");
              failureAlert.cooldownMs = cooldownMs;
            }
            if (hasFailureAlertIncludeSkipped || hasFailureAlertExcludeSkipped)
              failureAlert.includeSkipped = hasFailureAlertIncludeSkipped;
            if (hasFailureAlertMode) {
              const mode = normalizeOptionalLowercaseString(opts.failureAlertMode);
              if (mode !== "announce" && mode !== "webhook")
                throw new Error("Invalid --failure-alert-mode (must be 'announce' or 'webhook').");
              failureAlert.mode = mode;
            }
            if (hasFailureAlertAccountId) {
              const accountId = normalizeOptionalString(opts.failureAlertAccountId) ?? "";
              failureAlert.accountId = accountId ? accountId : void 0;
            }
            patch.failureAlert = failureAlert;
          }
          const res = await callGatewayFromCli("cron.update", opts, {
            id,
            patch,
          });
          defaultRuntime.writeJson(res);
          await warnIfCronSchedulerDisabled(opts);
        } catch (err) {
          defaultRuntime.error(danger(String(err)));
          defaultRuntime.exit(1);
        }
      }),
  );
}
//#endregion
//#region src/cli/cron-cli/register.cron-simple.ts
const CRON_SHOW_PAGE_SIZE = 200;
const CRON_SHOW_LOOKUP_MAX_PAGES = 50;
const CRON_RUN_WAIT_TIMEOUT_DEFAULT = "10m";
const CRON_RUN_WAIT_POLL_INTERVAL_DEFAULT = "2s";
function parseCronRunWaitDuration(raw, label) {
  const durationMs = parseDurationMs(
    typeof raw === "string" || typeof raw === "number" || typeof raw === "bigint"
      ? String(raw)
      : "",
    { defaultUnit: "ms" },
  );
  if (!Number.isFinite(durationMs) || durationMs < 0) throw new Error(`invalid ${label}`);
  return resolveTimerTimeoutMs(durationMs, 0, 0);
}
function parseCronRunPollInterval(raw) {
  const durationMs = parseCronRunWaitDuration(raw, "--poll-interval");
  if (durationMs <= 0) throw new Error("invalid --poll-interval");
  return resolvePositiveTimerTimeoutMs(durationMs, 2e3);
}
async function waitForCronRunCompletion(params) {
  const startedAt = Date.now();
  for (;;) {
    const entry = (
      await callGatewayFromCli("cron.runs", params.opts, {
        id: params.jobId,
        runId: params.runId,
        limit: 1,
      })
    ).entries?.[0];
    if (entry?.status === "ok" || entry?.status === "error" || entry?.status === "skipped")
      return entry;
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs >= params.timeoutMs)
      throw new Error(`timed out waiting for cron run ${params.runId}`);
    await sleep(Math.min(params.pollIntervalMs, params.timeoutMs - elapsedMs));
  }
}
function findCronJobInPage(jobs, idOrName) {
  const needle = normalizeLowercaseStringOrEmpty(idOrName);
  return jobs.find(
    (job) =>
      normalizeLowercaseStringOrEmpty(job.id) === needle ||
      normalizeLowercaseStringOrEmpty(job.name) === needle,
  );
}
async function loadCronJobForShow(opts, idOrName) {
  let offset = 0;
  for (let page = 0; page < CRON_SHOW_LOOKUP_MAX_PAGES; page += 1) {
    const res = await callGatewayFromCli("cron.list", opts, {
      includeDisabled: true,
      limit: CRON_SHOW_PAGE_SIZE,
      offset,
    });
    const listed = res;
    const job = findCronJobInPage(listed.jobs ?? [], idOrName);
    if (job)
      return {
        job,
        deliveryPreview: coerceCronDeliveryPreviews(res).get(job.id),
      };
    if (!listed.hasMore || typeof listed.nextOffset !== "number") return {};
    if (listed.nextOffset <= offset)
      throw new Error("cron.list pagination did not advance while looking up cron job");
    offset = listed.nextOffset;
  }
  throw new Error("cron.list pagination exceeded maximum pages while looking up cron job");
}
function registerCronToggleCommand(params) {
  addGatewayClientOptions(
    params.cron
      .command(params.name)
      .description(params.description)
      .argument("<id>", "Job id")
      .action(async (id, opts) => {
        try {
          printCronJson(
            await callGatewayFromCli("cron.update", opts, {
              id,
              patch: { enabled: params.enabled },
            }),
          );
          await warnIfCronSchedulerDisabled(opts);
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
}
function registerCronSimpleCommands(cron) {
  addGatewayClientOptions(
    cron
      .command("rm")
      .alias("remove")
      .alias("delete")
      .description("Remove a cron job")
      .argument("<id>", "Job id")
      .option("--json", "Output JSON", false)
      .action(async (id, opts) => {
        try {
          printCronJson(await callGatewayFromCli("cron.remove", opts, { id }));
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
  registerCronToggleCommand({
    cron,
    name: "enable",
    description: "Enable a cron job",
    enabled: true,
  });
  registerCronToggleCommand({
    cron,
    name: "disable",
    description: "Disable a cron job",
    enabled: false,
  });
  addGatewayClientOptions(
    cron
      .command("get")
      .description("Get a cron job as JSON")
      .argument("<id>", "Job id")
      .action(async (id, opts) => {
        try {
          printCronJson(await callGatewayFromCli("cron.get", opts, { id: String(id) }));
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
  addGatewayClientOptions(
    cron
      .command("show")
      .description("Show a cron job")
      .argument("<id>", "Job id or exact name")
      .option("--json", "Output JSON", false)
      .action(async (id, opts) => {
        try {
          const { job, deliveryPreview } = await loadCronJobForShow(opts, String(id));
          if (!job) throw new Error(`cron job not found: ${String(id)}`);
          if (opts.json) {
            printCronJson(enrichCronJsonWithStatus(job));
            return;
          }
          printCronShow(job, defaultRuntime, { deliveryPreview });
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
  addGatewayClientOptions(
    cron
      .command("runs")
      .description("Show cron run history")
      .requiredOption("--id <id>", "Job id")
      .option("--run-id <runId>", "Filter by cron run id")
      .option("--limit <n>", "Max entries (default 50)", "50")
      .action(async (opts) => {
        try {
          const limit = parseStrictPositiveInteger(opts.limit ?? "50");
          if (limit === void 0) throw new Error("Invalid --limit (must be a positive integer).");
          printCronJson(
            await callGatewayFromCli("cron.runs", opts, {
              id: String(opts.id),
              ...(typeof opts.runId === "string" && opts.runId.trim() ? { runId: opts.runId } : {}),
              limit,
            }),
          );
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
  addGatewayClientOptions(
    cron
      .command("run")
      .description("Run a cron job now (debug)")
      .argument("<id>", "Job id")
      .option("--due", "Run only when due (default behavior in older versions)", false)
      .option("--wait", "Wait for the queued run to finish", false)
      .option(
        "--wait-timeout <duration>",
        "Maximum time to wait for --wait",
        CRON_RUN_WAIT_TIMEOUT_DEFAULT,
      )
      .option(
        "--poll-interval <duration>",
        "Polling interval for --wait",
        CRON_RUN_WAIT_POLL_INTERVAL_DEFAULT,
      )
      .action(async (id, opts, command) => {
        try {
          let waitTimeoutMs = 0;
          let pollIntervalMs = 0;
          if (opts.wait) {
            waitTimeoutMs = parseCronRunWaitDuration(opts.waitTimeout, "--wait-timeout");
            pollIntervalMs = parseCronRunPollInterval(opts.pollInterval);
          }
          if (command.getOptionValueSource("timeout") === "default") opts.timeout = "600000";
          const res = await callGatewayFromCli("cron.run", opts, {
            id,
            mode: opts.due ? "due" : "force",
          });
          const result = res;
          if (opts.wait && result?.ok && result.enqueued) {
            if (!result.runId) throw new Error("cron run did not return a runId to wait for");
            const run = await waitForCronRunCompletion({
              opts,
              jobId: String(id),
              runId: result.runId,
              timeoutMs: waitTimeoutMs,
              pollIntervalMs,
            });
            printCronJson({
              ...res,
              completed: true,
              status: run.status,
              run,
            });
            defaultRuntime.exit(run.status === "ok" ? 0 : 1);
            return;
          }
          printCronJson(res);
          defaultRuntime.exit(result?.ok && (result?.ran || result?.enqueued) ? 0 : 1);
        } catch (err) {
          handleCronCliError(err);
        }
      }),
  );
}
//#endregion
//#region src/cli/cron-cli/register.ts
function registerCronCli(program) {
  const cron = program
    .command("cron")
    .description("Manage cron jobs (via Gateway)")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/cron", "docs.openclaw.ai/cli/cron")}\n${theme.muted("Upgrade tip:")} run \`openclaw doctor --fix\` to normalize legacy cron job storage.\n`,
    );
  registerCronStatusCommand(cron);
  registerCronListCommand(cron);
  registerCronAddCommand(cron);
  registerCronSimpleCommands(cron);
  registerCronEditCommand(cron);
  applyParentDefaultHelpAction(cron);
}
//#endregion
export { registerCronCli };
