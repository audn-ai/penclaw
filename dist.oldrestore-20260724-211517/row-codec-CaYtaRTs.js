import path from "node:path";
import { i as coerceFiniteScheduleNumber } from "./normalize-CSef2SY2.js";
import { n as normalizeCronJobInput } from "./normalize-pVPLopSK.js";
import {
  L as executeSqliteQuerySync,
  m as normalizeSqliteNumber,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as normalizeCronStaggerMs } from "./stagger-N9cGukpI.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/cron/store/key.ts
/** Cron store key normalization for SQLite partitions. */
/** Returns the canonical per-file SQLite partition key for cron store rows. */
function cronStoreKey(storePath) {
  return path.resolve(storePath);
}
//#endregion
//#region src/cron/normalize-job-identity.ts
/** Repairs legacy cron job identity fields into the canonical id shape. */
/** Normalizes mutable cron job rows from old `jobId` storage into the canonical `id` field. */
function normalizeCronJobIdentityFields(raw) {
  const rawId = normalizeOptionalString(raw.id) ?? "";
  const legacyJobId = normalizeOptionalString(raw.jobId) ?? "";
  const hadJobIdKey = "jobId" in raw;
  const normalizedId = rawId || legacyJobId;
  const idChanged = Boolean(normalizedId && raw.id !== normalizedId);
  if (idChanged) raw.id = normalizedId;
  if (hadJobIdKey) delete raw.jobId;
  return {
    mutated: idChanged || hadJobIdKey,
    legacyJobIdIssue: hadJobIdKey,
  };
}
//#endregion
//#region src/cron/persisted-shape.ts
/** Validates persisted cron job records before loading them from disk/state. */
/** Returns the first structural reason a persisted cron job cannot be loaded safely. */
function getInvalidPersistedCronJobReason(candidate) {
  const id = candidate.id;
  if (typeof id !== "string" || !id.trim()) return "missing-id";
  const schedule = candidate.schedule;
  if (!schedule || Array.isArray(schedule)) return "missing-schedule";
  if (typeof schedule === "string") return null;
  if (typeof schedule !== "object") return "missing-schedule";
  const scheduleRecord = schedule;
  const scheduleKind = scheduleRecord.kind;
  if (
    scheduleKind !== "at" &&
    scheduleKind !== "every" &&
    scheduleKind !== "cron" &&
    scheduleKind !== "on-exit"
  )
    return "invalid-schedule";
  if (scheduleKind === "at") {
    const at = scheduleRecord.at;
    if (typeof at !== "string" || parseAbsoluteTimeMs(at) === null) return "invalid-schedule";
  }
  if (scheduleKind === "every") {
    const everyMs = scheduleRecord.everyMs;
    if (typeof everyMs !== "number" || !Number.isFinite(everyMs) || everyMs <= 0)
      return "invalid-schedule";
  }
  if (scheduleKind === "cron") {
    const expr = scheduleRecord.expr;
    if (typeof expr !== "string" || expr.trim().length === 0) return "invalid-schedule";
  }
  if (scheduleKind === "on-exit") {
    const command = scheduleRecord.command;
    if (typeof command !== "string" || command.trim().length === 0) return "invalid-schedule";
  }
  if ("trigger" in candidate) {
    const trigger = candidate.trigger;
    if (!trigger || typeof trigger !== "object" || Array.isArray(trigger)) return "invalid-trigger";
    const script = trigger.script;
    if (
      typeof script !== "string" ||
      script.trim().length === 0 ||
      scheduleKind === "at" ||
      scheduleKind === "on-exit"
    )
      return "invalid-trigger";
  }
  const payload = candidate.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "missing-payload";
  const payloadRecord = payload;
  const payloadKind = payloadRecord.kind;
  if (payloadKind !== "systemEvent" && payloadKind !== "agentTurn" && payloadKind !== "command")
    return "invalid-payload";
  if (payloadKind === "systemEvent") {
    if (typeof payloadRecord.text !== "string") return "invalid-payload";
  }
  if (payloadKind === "agentTurn") {
    const message = payloadRecord.message;
    if (typeof message !== "string" || message.trim().length === 0) return "invalid-payload";
  }
  if (payloadKind === "command") {
    const argv = payloadRecord.argv;
    if (
      !Array.isArray(argv) ||
      argv.length === 0 ||
      argv.some((value) => typeof value !== "string" || value.length === 0)
    )
      return "invalid-payload";
  }
  return null;
}
//#endregion
//#region src/cron/schedule-identity.ts
/** Builds stable identities for cron scheduling inputs. */
function readString(record, key) {
  return normalizeOptionalString(record[key]);
}
function readNumber(record, key) {
  return coerceFiniteScheduleNumber(record[key]);
}
function readStaggerMs(record) {
  return normalizeCronStaggerMs(record.staggerMs);
}
function schedulePayloadFromRecord(schedule) {
  const rawKind = readString(schedule, "kind")?.toLowerCase();
  const expr = readString(schedule, "expr");
  const at = readString(schedule, "at");
  const everyMs = readNumber(schedule, "everyMs");
  const anchorMs = readNumber(schedule, "anchorMs");
  const tz = readString(schedule, "tz");
  const staggerMs = readStaggerMs(schedule);
  const kind =
    rawKind === "at" || rawKind === "every" || rawKind === "cron"
      ? rawKind
      : at
        ? "at"
        : everyMs !== void 0
          ? "every"
          : expr
            ? "cron"
            : void 0;
  if (kind === "at")
    return at
      ? {
          kind: "at",
          at,
        }
      : void 0;
  if (kind === "every" && everyMs !== void 0)
    return {
      kind: "every",
      everyMs,
      anchorMs,
    };
  if (kind === "cron" && expr)
    return {
      kind: "cron",
      expr,
      tz,
      staggerMs,
    };
}
function resolveSchedulePayload(job) {
  if (job.schedule && typeof job.schedule === "object" && !Array.isArray(job.schedule))
    return schedulePayloadFromRecord(job.schedule);
}
/** Builds a stable scheduling identity for deciding whether stored timer state is still valid. */
function tryCronScheduleIdentity(job) {
  const schedule = resolveSchedulePayload(job);
  if (!schedule) return;
  return JSON.stringify({
    version: 1,
    enabled: typeof job.enabled === "boolean" ? job.enabled : true,
    schedule,
  });
}
/** Compares two cron jobs by the normalized inputs that affect next-run computation. */
function cronSchedulingInputsEqual(previous, next) {
  const previousIdentity = tryCronScheduleIdentity(previous);
  const nextIdentity = tryCronScheduleIdentity(next);
  return (
    previousIdentity !== void 0 && nextIdentity !== void 0 && previousIdentity === nextIdentity
  );
}
//#endregion
//#region src/cron/store/scalar-codec.ts
/** Parses a JSON object column, returning the fallback for malformed or non-object values. */
function parseJsonObject(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}
/** Parses a JSON column without shape validation, returning the fallback only on parse failure. */
function parseJsonValue(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
/** Converts optional booleans into nullable SQLite integer flags. */
function booleanToInteger(value) {
  return typeof value === "boolean" ? (value ? 1 : 0) : null;
}
/** Converts SQLite integer flags into booleans while preserving missing columns as undefined. */
function integerToBoolean(value) {
  const normalized = normalizeSqliteNumber(value);
  return normalized == null ? void 0 : normalized !== 0;
}
/** Serializes optional structured values for JSON columns. */
function serializeJson(value) {
  return value == null ? null : JSON.stringify(value);
}
/** Parses a JSON string-array column and drops non-string entries from legacy data. */
function parseJsonArray(raw) {
  if (!raw) return;
  const parsed = parseJsonObject(raw, void 0);
  return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : void 0;
}
//#endregion
//#region src/cron/store/delivery-codec.ts
/** Maps cron delivery config into normalized SQLite columns. */
function bindDeliveryColumns(delivery) {
  const failureDestination = delivery?.failureDestination;
  return {
    delivery_mode: delivery?.mode ?? null,
    delivery_channel: delivery?.channel ?? null,
    delivery_to: delivery?.to ?? null,
    delivery_thread_id:
      delivery?.threadId === void 0 || delivery.threadId === null
        ? null
        : String(delivery.threadId),
    delivery_thread_id_type:
      delivery?.threadId === void 0 || delivery.threadId === null ? null : typeof delivery.threadId,
    delivery_account_id: delivery?.accountId ?? null,
    delivery_best_effort: booleanToInteger(delivery?.bestEffort),
    delivery_completion_mode: delivery?.completionDestination?.mode ?? null,
    delivery_completion_to: delivery?.completionDestination?.to ?? null,
    failure_delivery_mode: bindFailureDestinationField(failureDestination, "mode"),
    failure_delivery_channel: bindFailureDestinationField(failureDestination, "channel"),
    failure_delivery_to: bindFailureDestinationField(failureDestination, "to"),
    failure_delivery_account_id: bindFailureDestinationField(failureDestination, "accountId"),
  };
}
function bindFailureDestinationField(failureDestination, key) {
  if (!failureDestination || !Object.hasOwn(failureDestination, key)) return null;
  return failureDestination[key] ?? "";
}
function readFailureDestinationField(value) {
  return value === "" || value == null ? void 0 : value;
}
function cronDeliveryModeFromValue(value) {
  return value === "none" || value === "announce" || value === "webhook" ? value : void 0;
}
function threadIdFromRow(row) {
  const value = row.delivery_thread_id;
  if (!value) return;
  if (row.delivery_thread_id_type === "number") {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : value;
  }
  return value;
}
/** Reconstructs delivery config from split SQLite columns, preserving legacy partial rows. */
function deliveryFromRow(row) {
  const rowMode = cronDeliveryModeFromValue(row.delivery_mode);
  const threadId = threadIdFromRow(row);
  const hasDeliveryColumns =
    Boolean(
      row.delivery_channel ||
      row.delivery_to ||
      threadId !== void 0 ||
      row.delivery_account_id ||
      row.delivery_completion_mode ||
      row.delivery_completion_to ||
      row.failure_delivery_channel != null ||
      row.failure_delivery_to != null ||
      row.failure_delivery_mode != null ||
      row.failure_delivery_account_id != null,
    ) || row.delivery_best_effort != null;
  const completionDestination =
    rowMode === "announce" && row.delivery_completion_mode === "webhook"
      ? {
          mode: "webhook",
          ...(row.delivery_completion_to ? { to: row.delivery_completion_to } : {}),
        }
      : void 0;
  const failureDestination =
    row.failure_delivery_channel != null ||
    row.failure_delivery_to != null ||
    row.failure_delivery_mode != null ||
    row.failure_delivery_account_id != null
      ? {
          ...(row.failure_delivery_channel != null
            ? { channel: readFailureDestinationField(row.failure_delivery_channel) }
            : {}),
          ...(row.failure_delivery_to != null
            ? { to: readFailureDestinationField(row.failure_delivery_to) }
            : {}),
          ...(row.failure_delivery_mode != null
            ? { mode: readFailureDestinationField(row.failure_delivery_mode) }
            : {}),
          ...(row.failure_delivery_account_id != null
            ? { accountId: readFailureDestinationField(row.failure_delivery_account_id) }
            : {}),
        }
      : void 0;
  if (!rowMode && !hasDeliveryColumns) return;
  return {
    mode: rowMode ?? "announce",
    ...(row.delivery_channel ? { channel: row.delivery_channel } : {}),
    ...(row.delivery_to ? { to: row.delivery_to } : {}),
    ...(threadId !== void 0 ? { threadId } : {}),
    ...(row.delivery_account_id ? { accountId: row.delivery_account_id } : {}),
    ...(row.delivery_best_effort != null
      ? { bestEffort: integerToBoolean(row.delivery_best_effort) }
      : {}),
    ...(completionDestination ? { completionDestination } : {}),
    ...(failureDestination ? { failureDestination } : {}),
  };
}
//#endregion
//#region src/cron/store/failure-alert-codec.ts
/** Maps cron failure-alert config into normalized SQLite columns. */
function bindFailureAlertColumns(failureAlert) {
  if (failureAlert === false)
    return {
      failure_alert_disabled: 1,
      failure_alert_after: null,
      failure_alert_channel: null,
      failure_alert_to: null,
      failure_alert_cooldown_ms: null,
      failure_alert_include_skipped: null,
      failure_alert_mode: null,
      failure_alert_account_id: null,
    };
  return {
    failure_alert_disabled: failureAlert ? 0 : null,
    failure_alert_after: failureAlert?.after ?? null,
    failure_alert_channel: failureAlert?.channel ?? null,
    failure_alert_to: failureAlert?.to ?? null,
    failure_alert_cooldown_ms: failureAlert?.cooldownMs ?? null,
    failure_alert_include_skipped: booleanToInteger(failureAlert?.includeSkipped),
    failure_alert_mode: failureAlert?.mode ?? null,
    failure_alert_account_id: failureAlert?.accountId ?? null,
  };
}
/** Reconstructs failure-alert config, distinguishing disabled from omitted config. */
function failureAlertFromRow(row) {
  if (row.failure_alert_disabled === 1) return false;
  const failureAlertExplicitlyEnabled = row.failure_alert_disabled === 0;
  if (
    row.failure_alert_after == null &&
    !row.failure_alert_channel &&
    !row.failure_alert_to &&
    row.failure_alert_cooldown_ms == null &&
    row.failure_alert_include_skipped == null &&
    !row.failure_alert_mode &&
    !row.failure_alert_account_id &&
    !failureAlertExplicitlyEnabled
  )
    return;
  return {
    ...(row.failure_alert_after != null
      ? { after: normalizeSqliteNumber(row.failure_alert_after) }
      : {}),
    ...(row.failure_alert_channel ? { channel: row.failure_alert_channel } : {}),
    ...(row.failure_alert_to ? { to: row.failure_alert_to } : {}),
    ...(row.failure_alert_cooldown_ms != null
      ? { cooldownMs: normalizeSqliteNumber(row.failure_alert_cooldown_ms) }
      : {}),
    ...(row.failure_alert_include_skipped != null
      ? { includeSkipped: integerToBoolean(row.failure_alert_include_skipped) }
      : {}),
    ...(row.failure_alert_mode ? { mode: row.failure_alert_mode } : {}),
    ...(row.failure_alert_account_id ? { accountId: row.failure_alert_account_id } : {}),
  };
}
//#endregion
//#region src/cron/store/payload-codec.ts
function parseExternalContentSource(raw) {
  const parsed = raw ? parseJsonValue(raw, void 0) : void 0;
  return parsed === "gmail" || parsed === "webhook" ? parsed : void 0;
}
function parseCommandPayloadMessage(raw) {
  const parsed = raw ? parseJsonValue(raw, void 0) : void 0;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const record = parsed;
  if (
    !Array.isArray(record.argv) ||
    record.argv.length === 0 ||
    record.argv.some((value) => typeof value !== "string" || value.length === 0)
  )
    return null;
  const argv = record.argv.map((value) => String(value));
  const env =
    record.env && typeof record.env === "object" && !Array.isArray(record.env)
      ? Object.fromEntries(
          Object.entries(record.env).filter((entry) => typeof entry[1] === "string"),
        )
      : void 0;
  const rawNoOutputTimeoutSeconds =
    typeof record.noOutputTimeoutSeconds === "number" ||
    typeof record.noOutputTimeoutSeconds === "bigint"
      ? record.noOutputTimeoutSeconds
      : null;
  const rawOutputMaxBytes =
    typeof record.outputMaxBytes === "number" || typeof record.outputMaxBytes === "bigint"
      ? record.outputMaxBytes
      : null;
  const noOutputTimeoutSeconds = normalizeSqliteNumber(rawNoOutputTimeoutSeconds);
  const outputMaxBytes = normalizeSqliteNumber(rawOutputMaxBytes);
  return {
    argv,
    ...(typeof record.cwd === "string" && record.cwd.trim() ? { cwd: record.cwd } : {}),
    ...(env && Object.keys(env).length > 0 ? { env } : {}),
    ...(typeof record.input === "string" ? { input: record.input } : {}),
    ...(noOutputTimeoutSeconds != null ? { noOutputTimeoutSeconds } : {}),
    ...(outputMaxBytes != null && outputMaxBytes > 0 ? { outputMaxBytes } : {}),
  };
}
/** Maps cron payload variants into normalized SQLite columns. */
function bindPayloadColumns(payload) {
  if (payload.kind === "systemEvent")
    return {
      payload_kind: "systemEvent",
      payload_message: payload.text,
      payload_model: null,
      payload_fallbacks_json: null,
      payload_thinking: null,
      payload_timeout_seconds: null,
      payload_allow_unsafe_external_content: null,
      payload_external_content_source_json: null,
      payload_light_context: null,
      payload_tools_allow_json: null,
      payload_tools_allow_is_default: null,
    };
  if (payload.kind === "command") {
    const { timeoutSeconds: _timeoutSeconds, ...payloadMessage } = payload;
    return {
      payload_kind: "command",
      payload_message: serializeJson(payloadMessage),
      payload_model: null,
      payload_fallbacks_json: null,
      payload_thinking: null,
      payload_timeout_seconds: payload.timeoutSeconds ?? null,
      payload_allow_unsafe_external_content: null,
      payload_external_content_source_json: null,
      payload_light_context: null,
      payload_tools_allow_json: null,
      payload_tools_allow_is_default: null,
    };
  }
  return {
    payload_kind: "agentTurn",
    payload_message: payload.message,
    payload_model: payload.model ?? null,
    payload_fallbacks_json: serializeJson(payload.fallbacks),
    payload_thinking: payload.thinking ?? null,
    payload_timeout_seconds: payload.timeoutSeconds ?? null,
    payload_allow_unsafe_external_content: booleanToInteger(payload.allowUnsafeExternalContent),
    payload_external_content_source_json: serializeJson(payload.externalContentSource),
    payload_light_context: booleanToInteger(payload.lightContext),
    payload_tools_allow_json: serializeJson(payload.toolsAllow),
    payload_tools_allow_is_default: payload.toolsAllow
      ? booleanToInteger(payload.toolsAllowIsDefault)
      : null,
  };
}
/** Reconstructs cron payload variants from SQLite columns, returning null for invalid rows. */
function payloadFromRow(row) {
  if (row.payload_kind === "systemEvent")
    return row.payload_message == null
      ? null
      : {
          kind: "systemEvent",
          text: row.payload_message,
        };
  if (row.payload_kind === "agentTurn") {
    if (row.payload_message == null) return null;
    const fallbacks = row.payload_fallbacks_json
      ? parseJsonArray(row.payload_fallbacks_json)
      : void 0;
    const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
    const allowUnsafeExternalContent =
      row.payload_allow_unsafe_external_content != null
        ? integerToBoolean(row.payload_allow_unsafe_external_content)
        : void 0;
    const externalContentSource = parseExternalContentSource(
      row.payload_external_content_source_json,
    );
    const lightContext =
      row.payload_light_context != null ? integerToBoolean(row.payload_light_context) : void 0;
    const toolsAllow = row.payload_tools_allow_json
      ? parseJsonArray(row.payload_tools_allow_json)
      : void 0;
    const toolsAllowIsDefault =
      row.payload_tools_allow_is_default != null
        ? integerToBoolean(row.payload_tools_allow_is_default)
        : void 0;
    return {
      kind: "agentTurn",
      message: row.payload_message,
      ...(row.payload_model ? { model: row.payload_model } : {}),
      ...(fallbacks ? { fallbacks } : {}),
      ...(row.payload_thinking ? { thinking: row.payload_thinking } : {}),
      ...(timeoutSeconds != null ? { timeoutSeconds } : {}),
      ...(allowUnsafeExternalContent != null ? { allowUnsafeExternalContent } : {}),
      ...(externalContentSource ? { externalContentSource } : {}),
      ...(lightContext != null ? { lightContext } : {}),
      ...(toolsAllow ? { toolsAllow } : {}),
      ...(toolsAllow && toolsAllowIsDefault ? { toolsAllowIsDefault: true } : {}),
    };
  }
  if (row.payload_kind === "command") {
    const command = parseCommandPayloadMessage(row.payload_message);
    if (!command) return null;
    const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
    return {
      kind: "command",
      ...command,
      ...(timeoutSeconds != null ? { timeoutSeconds } : {}),
    };
  }
  return null;
}
//#endregion
//#region src/cron/store/schema.ts
/** Creates the Kysely facade scoped to cron_jobs for synchronous SQLite access. */
function getCronStoreKysely(db) {
  return getNodeSqliteKysely(db);
}
//#endregion
//#region src/cron/store/state-codec.ts
/** Maps mutable cron runtime state into normalized SQLite columns. */
function bindStateColumns(state) {
  return {
    next_run_at_ms: state.nextRunAtMs ?? null,
    running_at_ms: state.runningAtMs ?? null,
    last_run_at_ms: state.lastRunAtMs ?? null,
    last_run_status: state.lastRunStatus ?? state.lastStatus ?? null,
    last_error: state.lastError ?? null,
    last_duration_ms: state.lastDurationMs ?? null,
    consecutive_errors: state.consecutiveErrors ?? null,
    consecutive_skipped: state.consecutiveSkipped ?? null,
    schedule_error_count: state.scheduleErrorCount ?? null,
    last_delivery_status: state.lastDeliveryStatus ?? null,
    last_delivery_error: state.lastDeliveryError ?? null,
    last_delivered: booleanToInteger(state.lastDelivered),
    last_failure_alert_at_ms: state.lastFailureAlertAtMs ?? null,
  };
}
/** Reconstructs cron runtime state from JSON plus split indexed columns. */
function stateFromRow(row) {
  return {
    ...parseJsonObject(row.state_json, {}),
    ...(row.next_run_at_ms != null
      ? { nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms) }
      : {}),
    ...(row.running_at_ms != null ? { runningAtMs: normalizeSqliteNumber(row.running_at_ms) } : {}),
    ...(row.last_run_at_ms != null
      ? { lastRunAtMs: normalizeSqliteNumber(row.last_run_at_ms) }
      : {}),
    ...(row.last_run_status ? { lastRunStatus: row.last_run_status } : {}),
    ...(row.last_error ? { lastError: row.last_error } : {}),
    ...(row.last_duration_ms != null
      ? { lastDurationMs: normalizeSqliteNumber(row.last_duration_ms) }
      : {}),
    ...(row.consecutive_errors != null
      ? { consecutiveErrors: normalizeSqliteNumber(row.consecutive_errors) }
      : {}),
    ...(row.consecutive_skipped != null
      ? { consecutiveSkipped: normalizeSqliteNumber(row.consecutive_skipped) }
      : {}),
    ...(row.schedule_error_count != null
      ? { scheduleErrorCount: normalizeSqliteNumber(row.schedule_error_count) }
      : {}),
    ...(row.last_delivery_status ? { lastDeliveryStatus: row.last_delivery_status } : {}),
    ...(row.last_delivery_error ? { lastDeliveryError: row.last_delivery_error } : {}),
    ...(row.last_delivered != null ? { lastDelivered: integerToBoolean(row.last_delivered) } : {}),
    ...(row.last_failure_alert_at_ms != null
      ? { lastFailureAlertAtMs: normalizeSqliteNumber(row.last_failure_alert_at_ms) }
      : {}),
  };
}
//#endregion
//#region src/cron/store/trigger-codec.ts
/** Maps cron trigger config into normalized SQLite columns. */
function bindTriggerColumns(trigger) {
  return {
    trigger_script: trigger?.script ?? null,
    trigger_once: booleanToInteger(trigger?.once),
  };
}
/** Reconstructs trigger config from normalized SQLite columns. */
function triggerFromRow(row) {
  if (!row.trigger_script) return;
  return {
    script: row.trigger_script,
    ...(row.trigger_once != null ? { once: integerToBoolean(row.trigger_once) } : {}),
  };
}
//#endregion
//#region src/cron/store/row-codec.ts
function bindScheduleColumns(schedule) {
  if (schedule.kind === "at")
    return {
      schedule_kind: "at",
      at: schedule.at,
      every_ms: null,
      anchor_ms: null,
      schedule_expr: null,
      schedule_tz: null,
      stagger_ms: null,
    };
  if (schedule.kind === "every")
    return {
      schedule_kind: "every",
      at: null,
      every_ms: schedule.everyMs,
      anchor_ms: schedule.anchorMs ?? null,
      schedule_expr: null,
      schedule_tz: null,
      stagger_ms: null,
    };
  if (schedule.kind === "on-exit")
    return {
      schedule_kind: "on-exit",
      at: null,
      every_ms: null,
      anchor_ms: null,
      schedule_expr: schedule.command,
      schedule_tz: schedule.cwd ?? null,
      stagger_ms: null,
    };
  return {
    schedule_kind: "cron",
    at: null,
    every_ms: null,
    anchor_ms: null,
    schedule_expr: schedule.expr,
    schedule_tz: schedule.tz ?? null,
    stagger_ms: schedule.staggerMs ?? null,
  };
}
function stripJobRuntimeFields(job) {
  const { state: _state, updatedAtMs: _updatedAtMs, ...rest } = job;
  return {
    ...rest,
    state: {},
  };
}
function mergeFailureDestinationProjection(configJob, projectedJob) {
  const failureDestination = projectedJob?.delivery?.failureDestination;
  if (!failureDestination) return configJob;
  const delivery =
    isRecord(configJob.delivery) && !Array.isArray(configJob.delivery)
      ? { ...configJob.delivery }
      : projectedJob?.delivery
        ? {
            mode: projectedJob.delivery.mode,
            ...(projectedJob.delivery.channel ? { channel: projectedJob.delivery.channel } : {}),
            ...(projectedJob.delivery.to ? { to: projectedJob.delivery.to } : {}),
            ...(projectedJob.delivery.threadId !== void 0
              ? { threadId: projectedJob.delivery.threadId }
              : {}),
            ...(projectedJob.delivery.accountId
              ? { accountId: projectedJob.delivery.accountId }
              : {}),
            ...(projectedJob.delivery.bestEffort !== void 0
              ? { bestEffort: projectedJob.delivery.bestEffort }
              : {}),
            ...(projectedJob.delivery.completionDestination
              ? { completionDestination: projectedJob.delivery.completionDestination }
              : {}),
          }
        : {};
  const nextFailureDestination = isRecord(delivery.failureDestination)
    ? { ...delivery.failureDestination }
    : {};
  if (Object.hasOwn(failureDestination, "channel"))
    nextFailureDestination.channel = failureDestination.channel;
  if (Object.hasOwn(failureDestination, "to")) nextFailureDestination.to = failureDestination.to;
  if (Object.hasOwn(failureDestination, "accountId"))
    nextFailureDestination.accountId = failureDestination.accountId;
  if (Object.hasOwn(failureDestination, "mode"))
    nextFailureDestination.mode = failureDestination.mode;
  delivery.failureDestination = nextFailureDestination;
  return {
    ...configJob,
    delivery,
  };
}
function bindCronJobRow(storeKey, job, sortOrder) {
  return {
    store_key: storeKey,
    job_id: job.id,
    declaration_key: job.declarationKey ?? null,
    display_name: job.displayName ?? null,
    owner_agent_id: job.owner?.agentId ?? null,
    owner_session_key: job.owner?.sessionKey ?? null,
    name: job.name,
    description: job.description ?? null,
    enabled: job.enabled ? 1 : 0,
    delete_after_run: booleanToInteger(job.deleteAfterRun),
    created_at_ms: job.createdAtMs,
    updated_at: job.updatedAtMs,
    agent_id: job.agentId ?? null,
    session_key: job.sessionKey ?? null,
    session_target: job.sessionTarget,
    wake_mode: job.wakeMode,
    ...bindTriggerColumns(job.trigger),
    ...bindScheduleColumns(job.schedule),
    ...bindPayloadColumns(job.payload),
    ...bindDeliveryColumns(job.delivery),
    ...bindFailureAlertColumns(job.failureAlert),
    ...bindStateColumns(job.state ?? {}),
    job_json: JSON.stringify(stripJobRuntimeFields(job)),
    state_json: JSON.stringify(job.state ?? {}),
    runtime_updated_at_ms: job.updatedAtMs,
    schedule_identity: tryCronScheduleIdentity(job) ?? null,
    sort_order: sortOrder,
  };
}
function normalizeCronJobForSqlite(job) {
  const raw = structuredClone(job);
  const hadDeleteAfterRun = Object.hasOwn(raw, "deleteAfterRun");
  normalizeCronJobIdentityFields(raw);
  const normalized = normalizeCronJobInput(raw, { applyDefaults: true });
  if (!normalized || getInvalidPersistedCronJobReason(normalized)) return null;
  if (!hadDeleteAfterRun) delete normalized.deleteAfterRun;
  const createdAtMs =
    typeof normalized.createdAtMs === "number" && Number.isFinite(normalized.createdAtMs)
      ? normalized.createdAtMs
      : Date.now();
  const updatedAtMs =
    typeof normalized.updatedAtMs === "number" && Number.isFinite(normalized.updatedAtMs)
      ? normalized.updatedAtMs
      : createdAtMs;
  return {
    ...normalized,
    createdAtMs,
    updatedAtMs,
    state: isRecord(normalized.state) ? normalized.state : {},
  };
}
function countUnpersistableCronJobs(store) {
  return store.jobs.reduce((count, job) => count + (normalizeCronJobForSqlite(job) ? 0 : 1), 0);
}
/** Fails before replacing SQLite rows when any config job cannot round-trip. */
function assertCronStoreCanPersist(store) {
  const invalidJobs = countUnpersistableCronJobs(store);
  if (invalidJobs > 0)
    throw new Error(`Cannot persist cron store with ${invalidJobs} invalid job(s)`);
}
function scheduleFromRow(row) {
  if (row.schedule_kind === "at" && row.at)
    return {
      kind: "at",
      at: row.at,
    };
  if (row.schedule_kind === "every" && row.every_ms != null)
    return {
      kind: "every",
      everyMs: normalizeSqliteNumber(row.every_ms) ?? 0,
      ...(row.anchor_ms != null ? { anchorMs: normalizeSqliteNumber(row.anchor_ms) } : {}),
    };
  if (row.schedule_kind === "cron" && row.schedule_expr)
    return {
      kind: "cron",
      expr: row.schedule_expr,
      ...(row.schedule_tz ? { tz: row.schedule_tz } : {}),
      ...(row.stagger_ms != null ? { staggerMs: normalizeSqliteNumber(row.stagger_ms) } : {}),
    };
  if (row.schedule_kind === "on-exit" && row.schedule_expr)
    return {
      kind: "on-exit",
      command: row.schedule_expr,
      ...(row.schedule_tz ? { cwd: row.schedule_tz } : {}),
    };
  return null;
}
function rowToCronJob(row) {
  const schedule = scheduleFromRow(row);
  const payload = payloadFromRow(row);
  const delivery = deliveryFromRow(row);
  const failureAlert = failureAlertFromRow(row);
  const trigger = triggerFromRow(row);
  if (!schedule || !payload) return null;
  const createdAtMs = normalizeSqliteNumber(row.created_at_ms) ?? Date.now();
  return {
    id: row.job_id,
    ...(row.declaration_key ? { declarationKey: row.declaration_key } : {}),
    ...(row.display_name ? { displayName: row.display_name } : {}),
    ...(row.owner_agent_id || row.owner_session_key
      ? {
          owner: {
            ...(row.owner_agent_id ? { agentId: row.owner_agent_id } : {}),
            ...(row.owner_session_key ? { sessionKey: row.owner_session_key } : {}),
          },
        }
      : {}),
    name: row.name,
    ...(row.description ? { description: row.description } : {}),
    enabled: row.enabled !== 0,
    ...(row.delete_after_run != null
      ? { deleteAfterRun: integerToBoolean(row.delete_after_run) }
      : {}),
    createdAtMs,
    updatedAtMs:
      normalizeSqliteNumber(row.runtime_updated_at_ms) ??
      normalizeSqliteNumber(row.updated_at) ??
      createdAtMs,
    ...(row.agent_id ? { agentId: row.agent_id } : {}),
    ...(row.session_key ? { sessionKey: row.session_key } : {}),
    schedule,
    sessionTarget: row.session_target,
    wakeMode: row.wake_mode,
    ...(trigger ? { trigger } : {}),
    payload,
    ...(delivery ? { delivery } : {}),
    ...(failureAlert !== void 0 ? { failureAlert } : {}),
    state: stateFromRow(row),
  };
}
/** Projects a live job through the same normalization/codecs used by SQLite persistence. */
function projectCronJobThroughStorageCodec(job) {
  const normalized = normalizeCronJobForSqlite(job);
  if (!normalized) throw new Error(`cannot project invalid cron job ${job.id}`);
  const projected = rowToCronJob(bindCronJobRow("config-revision", normalized, 0));
  if (!projected) throw new Error(`cannot project cron job ${job.id} through storage codecs`);
  return projected;
}
/** Loads cron rows in config order with deterministic fallbacks for old rows. */
function loadCronRows(db, storeKey) {
  return executeSqliteQuerySync(
    db,
    getCronStoreKysely(db)
      .selectFrom("cron_jobs")
      .selectAll()
      .where("store_key", "=", storeKey)
      .orderBy("sort_order", "asc")
      .orderBy("updated_at", "asc")
      .orderBy("job_id", "asc"),
  ).rows;
}
/** Replaces all persisted cron rows for one store key from the config store snapshot. */
function replaceCronRows(db, storeKey, store) {
  executeSqliteQuerySync(
    db,
    getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", storeKey),
  );
  for (const [index, job] of store.jobs.entries()) {
    const normalized = normalizeCronJobForSqlite(job);
    if (!normalized) continue;
    executeSqliteQuerySync(
      db,
      getCronStoreKysely(db)
        .insertInto("cron_jobs")
        .values(bindCronJobRow(storeKey, normalized, index)),
    );
  }
}
/** Updates only mutable runtime columns without rewriting full job config JSON. */
function updateCronRuntimeRows(db, storeKey, store) {
  for (const job of store.jobs)
    executeSqliteQuerySync(
      db,
      getCronStoreKysely(db)
        .updateTable("cron_jobs")
        .set({
          ...bindStateColumns(job.state ?? {}),
          state_json: JSON.stringify(job.state ?? {}),
          runtime_updated_at_ms: job.updatedAtMs,
          schedule_identity: tryCronScheduleIdentity(job),
        })
        .where("store_key", "=", storeKey)
        .where("job_id", "=", job.id),
    );
}
/** Reconstructs loaded cron store data and config-runtime sidecars from SQLite rows. */
function loadedCronStoreFromRows(rows) {
  const parsedJobs = rows.map(rowToCronJob);
  const jobs = parsedJobs.filter((job) => job !== null);
  const configJobs = rows.map((row, index) =>
    mergeFailureDestinationProjection(
      parseJsonObject(row.job_json, stripJobRuntimeFields(parsedJobs[index] ?? {})),
      parsedJobs[index] ?? null,
    ),
  );
  const configJobRuntimeEntries = rows.map((row) => ({
    updatedAtMs:
      normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at),
    scheduleIdentity: row.schedule_identity ?? void 0,
    state: stateFromRow(row),
  }));
  return {
    store: {
      version: 1,
      jobs,
    },
    configJobs,
    configJobIndexes: rows.map((_row, index) => index),
    configJobRuntimeEntries,
    invalidConfigRows: [],
  };
}
//#endregion
export {
  replaceCronRows as a,
  getInvalidPersistedCronJobReason as c,
  projectCronJobThroughStorageCodec as i,
  normalizeCronJobIdentityFields as l,
  loadCronRows as n,
  updateCronRuntimeRows as o,
  loadedCronStoreFromRows as r,
  cronSchedulingInputsEqual as s,
  assertCronStoreCanPersist as t,
  cronStoreKey as u,
};
