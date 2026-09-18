import { randomUUID } from "node:crypto";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/restart-handoff.ts
const GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND = "gateway-supervisor-restart-handoff";
const GATEWAY_SUPERVISOR_RESTART_HANDOFF_KEY = "current";
const GATEWAY_RESTART_HANDOFF_TTL_MS = 6e4;
const GATEWAY_RESTART_TRACE_HANDOFF_MAX_DURATION_MS = 10 * 6e4;
const MAX_INTENT_ID_LENGTH = 120;
const MAX_PROCESS_INSTANCE_ID_LENGTH = 120;
const MAX_REASON_LENGTH = 200;
const handoffLog = createSubsystemLogger("restart-handoff");
function formatShortDuration(ms) {
  const clamped = Math.max(0, Math.floor(ms));
  if (clamped < 1e3) return `${clamped}ms`;
  const seconds = Math.floor(clamped / 1e3);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds === 0 ? `${minutes}m` : `${minutes}m ${remainingSeconds}s`;
}
function formatDiagnosticValue(value) {
  let normalized = "";
  let previousWasSpace = true;
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code <= 31 || code === 127 || /\s/u.test(char)) {
      if (!previousWasSpace) {
        normalized += " ";
        previousWasSpace = true;
      }
      continue;
    }
    normalized += char;
    previousWasSpace = false;
  }
  return normalized.trimEnd();
}
/** Format a compact diagnostic for a recently consumed restart handoff. */
function formatGatewayRestartHandoffDiagnostic(handoff, now = Date.now()) {
  const reason = handoff.reason ? formatDiagnosticValue(handoff.reason) : void 0;
  return `Recent restart handoff: ${[
    `${handoff.restartKind} via ${handoff.supervisorMode}`,
    `source=${handoff.source}`,
    reason ? `reason=${reason}` : void 0,
    `pid=${handoff.pid}`,
    `age=${formatShortDuration(now - handoff.createdAt)}`,
    `expiresIn=${formatShortDuration(handoff.expiresAt - now)}`,
  ]
    .filter((value) => Boolean(value))
    .join("; ")}`;
}
function normalizePid(pid) {
  return typeof pid === "number" && Number.isSafeInteger(pid) && pid > 0 ? pid : null;
}
function normalizeText(value, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? truncateUtf16Safe(text, maxLength) : void 0;
}
function normalizeCreatedAt(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : Date.now();
}
function normalizeTtlMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return GATEWAY_RESTART_HANDOFF_TTL_MS;
  return Math.min(Math.floor(value), GATEWAY_RESTART_HANDOFF_TTL_MS);
}
function normalizeRestartTraceHandoff(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return;
  const record = value;
  if (
    typeof record.startedAt !== "number" ||
    !Number.isFinite(record.startedAt) ||
    typeof record.lastAt !== "number" ||
    !Number.isFinite(record.lastAt) ||
    record.startedAt <= 0 ||
    record.lastAt < record.startedAt ||
    record.lastAt - record.startedAt > GATEWAY_RESTART_TRACE_HANDOFF_MAX_DURATION_MS
  )
    return;
  return {
    startedAt: record.startedAt,
    lastAt: record.lastAt,
  };
}
function normalizeSource(source, reason) {
  if (source) return source;
  if (!reason) return "unknown";
  const normalized = reason.toLowerCase();
  if (normalized === "update.run") return "gateway-update";
  if (normalized === "sigusr1") return "signal";
  if (normalized === "gateway.restart") return "operator-restart";
  if (normalized.includes("plugin")) return "plugin-change";
  if (normalized.includes("config") || normalized.includes("include")) return "config-write";
  return "unknown";
}
function isSource(value) {
  return (
    value === "config-write" ||
    value === "gateway-update" ||
    value === "operator-restart" ||
    value === "plugin-change" ||
    value === "signal" ||
    value === "unknown"
  );
}
function isRestartKind(value) {
  return value === "full-process" || value === "update-process";
}
function isSupervisorMode(value) {
  return value === "launchd" || value === "systemd" || value === "schtasks" || value === "external";
}
function normalizeGatewayRestartHandoffRow(row) {
  const intentId = normalizeText(row.intent_id, MAX_INTENT_ID_LENGTH);
  if (
    row.kind !== GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND ||
    row.version !== 1 ||
    !intentId ||
    typeof row.pid !== "number" ||
    !Number.isSafeInteger(row.pid) ||
    row.pid <= 0 ||
    typeof row.created_at !== "number" ||
    !Number.isFinite(row.created_at) ||
    typeof row.expires_at !== "number" ||
    !Number.isFinite(row.expires_at) ||
    row.expires_at <= row.created_at ||
    row.expires_at - row.created_at > GATEWAY_RESTART_HANDOFF_TTL_MS ||
    !isSource(row.source) ||
    !isRestartKind(row.restart_kind) ||
    !isSupervisorMode(row.supervisor_mode)
  )
    return null;
  const restartTrace = normalizeRestartTraceHandoff(
    row.restart_trace_started_at !== null && row.restart_trace_last_at !== null
      ? {
          startedAt: row.restart_trace_started_at,
          lastAt: row.restart_trace_last_at,
        }
      : null,
  );
  const processInstanceId = normalizeText(row.process_instance_id, MAX_PROCESS_INSTANCE_ID_LENGTH);
  const reason = normalizeText(row.reason, MAX_REASON_LENGTH);
  return {
    kind: GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND,
    version: 1,
    intentId,
    pid: row.pid,
    ...(processInstanceId ? { processInstanceId } : {}),
    createdAt: Math.floor(row.created_at),
    expiresAt: Math.floor(row.expires_at),
    ...(reason ? { reason } : {}),
    source: row.source,
    restartKind: row.restart_kind,
    supervisorMode: row.supervisor_mode,
    ...(restartTrace ? { restartTrace } : {}),
  };
}
function readGatewayRestartHandoffRowSync(env) {
  try {
    const { db } = openOpenClawStateDatabase({ env });
    return executeSqliteQueryTakeFirstSync(
      db,
      getNodeSqliteKysely(db)
        .selectFrom("gateway_restart_handoff")
        .select([
          "kind",
          "version",
          "intent_id",
          "pid",
          "process_instance_id",
          "created_at",
          "expires_at",
          "reason",
          "restart_trace_started_at",
          "restart_trace_last_at",
          "source",
          "restart_kind",
          "supervisor_mode",
        ])
        .where("handoff_key", "=", GATEWAY_SUPERVISOR_RESTART_HANDOFF_KEY),
    );
  } catch {
    return null;
  }
}
/** Write the bounded supervisor restart handoff atomically. */
function writeGatewayRestartHandoffSync(opts) {
  const pid = normalizePid(opts.pid ?? process.pid);
  if (pid === null || !isRestartKind(opts.restartKind)) return null;
  if (opts.source !== void 0 && !isSource(opts.source)) return null;
  const supervisorMode = opts.supervisorMode ?? "external";
  if (!isSupervisorMode(supervisorMode)) return null;
  const env = opts.env ?? process.env;
  const createdAt = normalizeCreatedAt(opts.createdAt);
  const ttlMs = normalizeTtlMs(opts.ttlMs);
  const reason = normalizeText(opts.reason, MAX_REASON_LENGTH);
  const processInstanceId = normalizeText(opts.processInstanceId, MAX_PROCESS_INSTANCE_ID_LENGTH);
  const restartTrace = normalizeRestartTraceHandoff(opts.restartTrace);
  const payload = {
    kind: GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND,
    version: 1,
    intentId: randomUUID(),
    pid,
    ...(processInstanceId ? { processInstanceId } : {}),
    createdAt,
    expiresAt: createdAt + ttlMs,
    ...(reason ? { reason } : {}),
    source: normalizeSource(opts.source, reason),
    restartKind: opts.restartKind,
    supervisorMode,
    ...(restartTrace ? { restartTrace } : {}),
  };
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getNodeSqliteKysely(db)
            .insertInto("gateway_restart_handoff")
            .values({
              handoff_key: GATEWAY_SUPERVISOR_RESTART_HANDOFF_KEY,
              kind: payload.kind,
              version: payload.version,
              intent_id: payload.intentId,
              pid: payload.pid,
              process_instance_id: payload.processInstanceId ?? null,
              created_at: payload.createdAt,
              expires_at: payload.expiresAt,
              reason: payload.reason ?? null,
              restart_trace_started_at: payload.restartTrace?.startedAt ?? null,
              restart_trace_last_at: payload.restartTrace?.lastAt ?? null,
              source: payload.source,
              restart_kind: payload.restartKind,
              supervisor_mode: payload.supervisorMode,
              updated_at_ms: Date.now(),
            })
            .onConflict((conflict) =>
              conflict.column("handoff_key").doUpdateSet({
                kind: (eb) => eb.ref("excluded.kind"),
                version: (eb) => eb.ref("excluded.version"),
                intent_id: (eb) => eb.ref("excluded.intent_id"),
                pid: (eb) => eb.ref("excluded.pid"),
                process_instance_id: (eb) => eb.ref("excluded.process_instance_id"),
                created_at: (eb) => eb.ref("excluded.created_at"),
                expires_at: (eb) => eb.ref("excluded.expires_at"),
                reason: (eb) => eb.ref("excluded.reason"),
                restart_trace_started_at: (eb) => eb.ref("excluded.restart_trace_started_at"),
                restart_trace_last_at: (eb) => eb.ref("excluded.restart_trace_last_at"),
                source: (eb) => eb.ref("excluded.source"),
                restart_kind: (eb) => eb.ref("excluded.restart_kind"),
                supervisor_mode: (eb) => eb.ref("excluded.supervisor_mode"),
                updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms"),
              }),
            ),
        );
      },
      { env },
    );
    return payload;
  } catch (err) {
    handoffLog.warn(`failed to write gateway restart handoff: ${String(err)}`);
    return null;
  }
}
/** Read the current unexpired restart handoff without consuming it. */
function readGatewayRestartHandoffSync(env = process.env, now = Date.now()) {
  const row = readGatewayRestartHandoffRowSync(env);
  const payload = row ? normalizeGatewayRestartHandoffRow(row) : null;
  if (!payload || now < payload.createdAt || now > payload.expiresAt) return null;
  return payload;
}
//#endregion
export {
  readGatewayRestartHandoffSync as n,
  writeGatewayRestartHandoffSync as r,
  formatGatewayRestartHandoffDiagnostic as t,
};
