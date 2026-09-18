import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
//#region src/infra/restart-sentinel.ts
const RESTART_SENTINEL_KEY = "current";
const LEGACY_RESTART_SENTINEL_FILENAME = "restart-sentinel.json";
function formatDoctorNonInteractiveHint(env = process.env) {
  return `Recommended follow-up: run ${formatCliCommand("openclaw doctor --non-interactive", env)} in a terminal or approvals-capable OpenClaw surface.`;
}
async function writeRestartSentinel(payload, env = process.env) {
  const updatedAtMs = Date.now();
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      executeSqliteQuerySync(
        db,
        getNodeSqliteKysely(db)
          .insertInto("gateway_restart_sentinel")
          .values({
            sentinel_key: RESTART_SENTINEL_KEY,
            version: 1,
            kind: payload.kind,
            status: payload.status,
            ts: payload.ts,
            session_key: payload.sessionKey ?? null,
            thread_id: payload.threadId ?? null,
            delivery_channel: payload.deliveryContext?.channel ?? null,
            delivery_to: payload.deliveryContext?.to ?? null,
            delivery_account_id: payload.deliveryContext?.accountId ?? null,
            message: payload.message ?? null,
            continuation_json: payload.continuation ? JSON.stringify(payload.continuation) : null,
            doctor_hint: payload.doctorHint ?? null,
            stats_json: payload.stats ? JSON.stringify(payload.stats) : null,
            payload_json: JSON.stringify(payload),
            updated_at_ms: updatedAtMs,
          })
          .onConflict((conflict) =>
            conflict.column("sentinel_key").doUpdateSet({
              version: (eb) => eb.ref("excluded.version"),
              kind: (eb) => eb.ref("excluded.kind"),
              status: (eb) => eb.ref("excluded.status"),
              ts: (eb) => eb.ref("excluded.ts"),
              session_key: (eb) => eb.ref("excluded.session_key"),
              thread_id: (eb) => eb.ref("excluded.thread_id"),
              delivery_channel: (eb) => eb.ref("excluded.delivery_channel"),
              delivery_to: (eb) => eb.ref("excluded.delivery_to"),
              delivery_account_id: (eb) => eb.ref("excluded.delivery_account_id"),
              message: (eb) => eb.ref("excluded.message"),
              continuation_json: (eb) => eb.ref("excluded.continuation_json"),
              doctor_hint: (eb) => eb.ref("excluded.doctor_hint"),
              stats_json: (eb) => eb.ref("excluded.stats_json"),
              payload_json: (eb) => eb.ref("excluded.payload_json"),
              updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms"),
            }),
          ),
      );
    },
    { env },
  );
  await removeLegacyRestartSentinel(env);
}
function cloneRestartSentinelPayload(payload) {
  return structuredClone(payload);
}
async function rewriteRestartSentinel(rewrite, env = process.env) {
  const current = await readRestartSentinel(env);
  if (!current) return null;
  const nextPayload = rewrite(cloneRestartSentinelPayload(current.payload));
  if (!nextPayload) return null;
  await writeRestartSentinel(nextPayload, env);
  return {
    version: 1,
    payload: nextPayload,
  };
}
async function finalizeUpdateRestartSentinelRunningVersion(
  version = resolveRuntimeServiceVersion(process.env),
  env = process.env,
) {
  return await rewriteRestartSentinel((payload) => {
    if (payload.kind !== "update") return null;
    const stats = payload.stats ? { ...payload.stats } : {};
    const after = isRecord(stats.after) ? { ...stats.after } : {};
    if (after.version === version) return null;
    after.version = version;
    stats.after = after;
    return {
      ...payload,
      stats,
    };
  }, env);
}
async function markUpdateRestartSentinelFailure(reason, env = process.env) {
  return await rewriteRestartSentinel((payload) => {
    if (payload.kind !== "update") return null;
    const payloadWithoutContinuation = { ...payload };
    delete payloadWithoutContinuation.continuation;
    const stats = payload.stats ? { ...payload.stats } : {};
    stats.reason = reason;
    return {
      ...payloadWithoutContinuation,
      status: "error",
      stats,
    };
  }, env);
}
async function clearRestartSentinel(env = process.env) {
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getNodeSqliteKysely(db)
            .deleteFrom("gateway_restart_sentinel")
            .where("sentinel_key", "=", RESTART_SENTINEL_KEY),
        );
      },
      { env },
    );
  } catch {}
  await removeLegacyRestartSentinel(env);
}
function resolveLegacyRestartSentinelPath(env) {
  return path.join(resolveStateDir(env), LEGACY_RESTART_SENTINEL_FILENAME);
}
async function removeLegacyRestartSentinel(env) {
  try {
    await rm(resolveLegacyRestartSentinelPath(env), { force: true });
  } catch {}
}
async function importLegacyRestartSentinel(env = process.env) {
  const legacyPath = resolveLegacyRestartSentinelPath(env);
  let parsed;
  try {
    parsed = JSON.parse(await readFile(legacyPath, "utf-8"));
  } catch {
    return null;
  }
  if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.payload)) {
    await removeLegacyRestartSentinel(env);
    return null;
  }
  const payload = parsed.payload;
  await writeRestartSentinel(payload, env);
  await removeLegacyRestartSentinel(env);
  return {
    version: 1,
    payload,
  };
}
function buildRestartSuccessContinuation(params) {
  const message = params.continuationMessage?.trim();
  if (message)
    return {
      kind: "agentTurn",
      message,
    };
  return null;
}
async function readRestartSentinel(env = process.env) {
  try {
    const database = openOpenClawStateDatabase({ env });
    const stateDb = getNodeSqliteKysely(database.db);
    const row = executeSqliteQueryTakeFirstSync(
      database.db,
      stateDb
        .selectFrom("gateway_restart_sentinel")
        .select(["version", "payload_json"])
        .where("sentinel_key", "=", RESTART_SENTINEL_KEY),
    );
    if (!row) return await importLegacyRestartSentinel(env);
    let payload;
    try {
      payload = JSON.parse(row.payload_json);
    } catch {
      await clearRestartSentinel(env);
      return null;
    }
    if (row.version !== 1 || !payload) {
      await clearRestartSentinel(env);
      return null;
    }
    return {
      version: 1,
      payload,
    };
  } catch {
    return null;
  }
}
async function hasRestartSentinel(env = process.env) {
  try {
    const database = openOpenClawStateDatabase({ env });
    const stateDb = getNodeSqliteKysely(database.db);
    if (
      executeSqliteQueryTakeFirstSync(
        database.db,
        stateDb
          .selectFrom("gateway_restart_sentinel")
          .select("sentinel_key")
          .where("sentinel_key", "=", RESTART_SENTINEL_KEY),
      )
    )
      return true;
    return Boolean(await importLegacyRestartSentinel(env));
  } catch {
    return false;
  }
}
function formatRestartSentinelMessage(payload) {
  const message = payload.message?.trim();
  if (message && (!payload.stats || payload.kind === "config-auto-recovery")) return message;
  const lines = [summarizeRestartSentinel(payload)];
  if (message) lines.push(message);
  const reason = payload.stats?.reason?.trim();
  if (reason && reason !== message) lines.push(`Reason: ${reason}`);
  if (payload.doctorHint?.trim()) lines.push(payload.doctorHint.trim());
  return lines.join("\n");
}
function isRestartRequiredConfigWriteSentinel(payload) {
  return (
    (payload.kind === "config-apply" || payload.kind === "config-patch") &&
    payload.status === "ok" &&
    payload.stats?.requiresRestart === true
  );
}
function summarizeRestartSentinel(payload) {
  if (payload.kind === "config-auto-recovery") return "Gateway auto-recovery";
  if (isRestartRequiredConfigWriteSentinel(payload))
    return `Gateway restart required${payload.stats?.mode ? ` (${payload.stats.mode})` : ""}`.trim();
  const kind = payload.kind;
  const status = payload.status;
  const mode = payload.stats?.mode ? ` (${payload.stats.mode})` : "";
  return `Gateway restart${kind === "restart" ? "" : ` ${kind}`} ${status}${mode}`.trim();
}
function trimLogTail(input, maxChars = 8e3) {
  if (!input) return null;
  const text = input.trimEnd();
  if (text.length <= maxChars) return text;
  return `…${sliceUtf16Safe(text, text.length - maxChars)}`;
}
//#endregion
export {
  formatRestartSentinelMessage as a,
  readRestartSentinel as c,
  writeRestartSentinel as d,
  formatDoctorNonInteractiveHint as i,
  summarizeRestartSentinel as l,
  clearRestartSentinel as n,
  hasRestartSentinel as o,
  finalizeUpdateRestartSentinelRunningVersion as r,
  markUpdateRestartSentinelFailure as s,
  buildRestartSuccessContinuation as t,
  trimLogTail as u,
};
