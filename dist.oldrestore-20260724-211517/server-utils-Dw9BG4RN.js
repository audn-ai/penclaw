import {
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import "./errors-BoHeli7m.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/voicewake.ts
const DEFAULT_TRIGGERS = ["openclaw", "claude", "computer"];
const VOICEWAKE_CONFIG_KEY = "default";
function sanitizeTriggers(triggers) {
  const cleaned = (triggers ?? [])
    .map((w) => normalizeOptionalString(w) ?? "")
    .filter((w) => w.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULT_TRIGGERS;
}
function openStateDatabase(stateDir) {
  return openOpenClawStateDatabase({
    env: stateDir
      ? {
          ...process.env,
          OPENCLAW_STATE_DIR: stateDir,
        }
      : process.env,
  });
}
/** Return the built-in voice wake trigger list. */
function defaultVoiceWakeTriggers() {
  return [...DEFAULT_TRIGGERS];
}
/** Load persisted voice wake triggers, falling back to defaults. */
async function loadVoiceWakeConfig(baseDir) {
  const database = openStateDatabase(baseDir);
  const voicewakeDb = getNodeSqliteKysely(database.db);
  const rows = executeSqliteQuerySync(
    database.db,
    voicewakeDb
      .selectFrom("voicewake_triggers")
      .select(["trigger", "updated_at_ms"])
      .where("config_key", "=", VOICEWAKE_CONFIG_KEY)
      .orderBy("position", "asc"),
  ).rows;
  if (rows.length === 0)
    return {
      triggers: defaultVoiceWakeTriggers(),
      updatedAtMs: 0,
    };
  return {
    triggers: sanitizeTriggers(rows.map((row) => row.trigger)),
    updatedAtMs: Math.max(0, ...rows.map((row) => row.updated_at_ms)),
  };
}
/** Persist the configured voice wake trigger list. */
async function setVoiceWakeTriggers(triggers, baseDir) {
  const sanitized = sanitizeTriggers(triggers);
  const updatedAtMs = Date.now();
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      const voicewakeDb = getNodeSqliteKysely(db);
      executeSqliteQuerySync(
        db,
        voicewakeDb.deleteFrom("voicewake_triggers").where("config_key", "=", VOICEWAKE_CONFIG_KEY),
      );
      executeSqliteQuerySync(
        db,
        voicewakeDb.insertInto("voicewake_triggers").values(
          sanitized.map((trigger, position) => ({
            config_key: VOICEWAKE_CONFIG_KEY,
            position,
            trigger,
            updated_at_ms: updatedAtMs,
          })),
        ),
      );
    },
    baseDir
      ? {
          env: {
            ...process.env,
            OPENCLAW_STATE_DIR: baseDir,
          },
        }
      : {},
  );
  return {
    triggers: sanitized,
    updatedAtMs,
  };
}
//#endregion
//#region src/gateway/server-utils.ts
/** Normalizes voice-wake trigger config with bounded count/length and defaults. */
function normalizeVoiceWakeTriggers(input) {
  const cleaned = normalizeTrimmedStringList(input)
    .slice(0, 32)
    .map((value) => truncateUtf16Safe(value, 64));
  return cleaned.length > 0 ? cleaned : defaultVoiceWakeTriggers();
}
//#endregion
export { loadVoiceWakeConfig as n, setVoiceWakeTriggers as r, normalizeVoiceWakeTriggers as t };
