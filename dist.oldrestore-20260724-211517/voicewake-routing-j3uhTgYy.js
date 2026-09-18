import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-DDgUze4y.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as classifySessionKeyShape } from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/voicewake-routing.ts
const MAX_VOICEWAKE_ROUTES = 32;
const MAX_VOICEWAKE_TRIGGER_LENGTH = 64;
const VOICEWAKE_ROUTING_CONFIG_KEY = "default";
const DEFAULT_ROUTING = {
  version: 1,
  defaultTarget: { mode: "current" },
  routes: [],
  updatedAtMs: 0,
};
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
/** Normalize a voice wake trigger phrase for matching and duplicate checks. */
function normalizeVoiceWakeTriggerWord(value) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter(Boolean)
    .join(" ");
}
function normalizeRouteTarget(value) {
  if (!value || typeof value !== "object") return null;
  const rec = value;
  if (normalizeOptionalString(rec.mode) === "current") return { mode: "current" };
  const agentId = normalizeOptionalString(rec.agentId);
  const sessionKey = normalizeOptionalString(rec.sessionKey);
  if (agentId && !sessionKey) return { agentId: normalizeAgentId(agentId) };
  if (sessionKey && !agentId) return { sessionKey };
  return null;
}
function normalizeRouteRule(value) {
  if (!value || typeof value !== "object") return null;
  const rec = value;
  const triggerRaw = normalizeOptionalString(rec.trigger);
  if (!triggerRaw) return null;
  const trigger = normalizeVoiceWakeTriggerWord(triggerRaw);
  if (!trigger) return null;
  const target = normalizeRouteTarget(rec.target);
  if (!target) return null;
  return {
    trigger,
    target,
  };
}
function isCanonicalAgentSessionKey(value) {
  const trimmed = value.trim();
  if (classifySessionKeyShape(trimmed) !== "agent") return false;
  return !trimmed.split(":").some((part) => part.length === 0);
}
function validateRouteTargetInput(value, label) {
  if (!isRecord(value))
    return {
      ok: false,
      message: `${label} must be an object`,
    };
  const rec = value;
  const mode = normalizeOptionalString(rec.mode);
  const agentId = normalizeOptionalString(rec.agentId);
  const sessionKey = normalizeOptionalString(rec.sessionKey);
  if (mode !== void 0) {
    if (mode !== "current")
      return {
        ok: false,
        message: `${label}.mode must be "current" when provided`,
      };
    if (agentId !== void 0 || sessionKey !== void 0)
      return {
        ok: false,
        message: `${label} cannot mix mode with agentId or sessionKey`,
      };
    return { ok: true };
  }
  if (agentId !== void 0 && sessionKey !== void 0)
    return {
      ok: false,
      message: `${label} cannot include both agentId and sessionKey`,
    };
  if (agentId !== void 0) {
    if (!isValidAgentId(agentId))
      return {
        ok: false,
        message: `${label}.agentId must be a valid agent id`,
      };
    return { ok: true };
  }
  if (sessionKey !== void 0) {
    if (!isCanonicalAgentSessionKey(sessionKey))
      return {
        ok: false,
        message: `${label}.sessionKey must be a canonical agent session key`,
      };
    return { ok: true };
  }
  return {
    ok: false,
    message: `${label} must include mode, agentId, or sessionKey`,
  };
}
/** Validate user-provided voice wake routing config before persistence. */
function validateVoiceWakeRoutingConfigInput(input) {
  if (!isRecord(input))
    return {
      ok: false,
      message: "config must be an object",
    };
  const rec = input;
  if (rec.defaultTarget !== void 0) {
    const validatedDefaultTarget = validateRouteTargetInput(
      rec.defaultTarget,
      "config.defaultTarget",
    );
    if (!validatedDefaultTarget.ok) return validatedDefaultTarget;
  }
  if (rec.routes !== void 0 && !Array.isArray(rec.routes))
    return {
      ok: false,
      message: "config.routes must be an array",
    };
  if (Array.isArray(rec.routes)) {
    if (rec.routes.length > MAX_VOICEWAKE_ROUTES)
      return {
        ok: false,
        message: `config.routes must contain at most ${MAX_VOICEWAKE_ROUTES} entries`,
      };
    const normalizedTriggers = /* @__PURE__ */ new Map();
    for (const [index, route] of rec.routes.entries()) {
      if (!isRecord(route))
        return {
          ok: false,
          message: `config.routes[${index}] must be an object`,
        };
      const trigger = normalizeOptionalString(route.trigger);
      const normalizedTrigger = trigger ? normalizeVoiceWakeTriggerWord(trigger) : "";
      if (!trigger || !normalizedTrigger)
        return {
          ok: false,
          message: `config.routes[${index}].trigger must be a non-empty string`,
        };
      if (trigger.length > MAX_VOICEWAKE_TRIGGER_LENGTH)
        return {
          ok: false,
          message: `config.routes[${index}].trigger must be at most ${MAX_VOICEWAKE_TRIGGER_LENGTH} characters`,
        };
      const duplicateIndex = normalizedTriggers.get(normalizedTrigger);
      if (duplicateIndex !== void 0)
        return {
          ok: false,
          message: `config.routes[${index}].trigger duplicates config.routes[${duplicateIndex}].trigger after normalization`,
        };
      normalizedTriggers.set(normalizedTrigger, index);
      const validatedTarget = validateRouteTargetInput(
        route.target,
        `config.routes[${index}].target`,
      );
      if (!validatedTarget.ok) return validatedTarget;
    }
  }
  return { ok: true };
}
/** Normalize persisted or user-provided voice wake routing config. */
function normalizeVoiceWakeRoutingConfig(input) {
  if (!input || typeof input !== "object") return { ...DEFAULT_ROUTING };
  const rec = input;
  return {
    version: 1,
    defaultTarget: normalizeRouteTarget(rec.defaultTarget) ?? { mode: "current" },
    routes: Array.isArray(rec.routes)
      ? rec.routes.map((entry) => normalizeRouteRule(entry)).filter((entry) => Boolean(entry))
      : [],
    updatedAtMs:
      typeof rec.updatedAtMs === "number" && Number.isFinite(rec.updatedAtMs) && rec.updatedAtMs > 0
        ? Math.floor(rec.updatedAtMs)
        : 0,
  };
}
function targetColumns(target) {
  if ("agentId" in target && target.agentId)
    return {
      targetAgentId: target.agentId,
      targetMode: "agent",
      targetSessionKey: null,
    };
  if ("sessionKey" in target && target.sessionKey)
    return {
      targetAgentId: null,
      targetMode: "session",
      targetSessionKey: target.sessionKey,
    };
  return {
    targetAgentId: null,
    targetMode: "current",
    targetSessionKey: null,
  };
}
function targetFromColumns(params) {
  if (params.mode === "agent" && params.agentId) return { agentId: params.agentId };
  if (params.mode === "session" && params.sessionKey) return { sessionKey: params.sessionKey };
  return { mode: "current" };
}
/** Load persisted voice wake routing config from state. */
async function loadVoiceWakeRoutingConfig(baseDir) {
  const database = openStateDatabase(baseDir);
  const routingDb = getNodeSqliteKysely(database.db);
  const configRow = executeSqliteQueryTakeFirstSync(
    database.db,
    routingDb
      .selectFrom("voicewake_routing_config")
      .selectAll()
      .where("config_key", "=", VOICEWAKE_ROUTING_CONFIG_KEY),
  );
  if (!configRow) return { ...DEFAULT_ROUTING };
  const routeRows = executeSqliteQuerySync(
    database.db,
    routingDb
      .selectFrom("voicewake_routing_routes")
      .selectAll()
      .where("config_key", "=", VOICEWAKE_ROUTING_CONFIG_KEY)
      .orderBy("position", "asc"),
  ).rows;
  return {
    version: 1,
    defaultTarget: targetFromColumns({
      agentId: configRow.default_target_agent_id,
      mode: configRow.default_target_mode,
      sessionKey: configRow.default_target_session_key,
    }),
    routes: routeRows.map((row) => ({
      trigger: row.trigger,
      target: targetFromColumns({
        agentId: row.target_agent_id,
        mode: row.target_mode,
        sessionKey: row.target_session_key,
      }),
    })),
    updatedAtMs: configRow.updated_at_ms,
  };
}
/** Persist normalized voice wake routing config. */
async function setVoiceWakeRoutingConfig(config, baseDir) {
  const normalized = normalizeVoiceWakeRoutingConfig(config);
  const updatedAtMs = Date.now();
  const next = {
    ...normalized,
    updatedAtMs,
  };
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      const routingDb = getNodeSqliteKysely(db);
      executeSqliteQuerySync(
        db,
        routingDb
          .deleteFrom("voicewake_routing_routes")
          .where("config_key", "=", VOICEWAKE_ROUTING_CONFIG_KEY),
      );
      executeSqliteQuerySync(
        db,
        routingDb
          .deleteFrom("voicewake_routing_config")
          .where("config_key", "=", VOICEWAKE_ROUTING_CONFIG_KEY),
      );
      const defaultTarget = targetColumns(next.defaultTarget);
      executeSqliteQuerySync(
        db,
        routingDb.insertInto("voicewake_routing_config").values({
          config_key: VOICEWAKE_ROUTING_CONFIG_KEY,
          version: 1,
          default_target_mode: defaultTarget.targetMode,
          default_target_agent_id: defaultTarget.targetAgentId,
          default_target_session_key: defaultTarget.targetSessionKey,
          updated_at_ms: updatedAtMs,
        }),
      );
      if (next.routes.length > 0)
        executeSqliteQuerySync(
          db,
          routingDb.insertInto("voicewake_routing_routes").values(
            next.routes.map((route, position) => {
              const target = targetColumns(route.target);
              return {
                config_key: VOICEWAKE_ROUTING_CONFIG_KEY,
                position,
                trigger: route.trigger,
                target_mode: target.targetMode,
                target_agent_id: target.targetAgentId,
                target_session_key: target.targetSessionKey,
                updated_at_ms: updatedAtMs,
              };
            }),
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
  return next;
}
function resolveVoiceWakeRouteTarget(routeTarget) {
  if (!routeTarget || ("mode" in routeTarget && routeTarget.mode === "current"))
    return { mode: "current" };
  if ("agentId" in routeTarget && routeTarget.agentId) return { agentId: routeTarget.agentId };
  if ("sessionKey" in routeTarget && routeTarget.sessionKey)
    return { sessionKey: routeTarget.sessionKey };
  return { mode: "current" };
}
/** Resolve the route target for a normalized wake trigger. */
function resolveVoiceWakeRouteByTrigger(params) {
  const normalizedTrigger = normalizeOptionalString(params.trigger)
    ? normalizeVoiceWakeTriggerWord(params.trigger)
    : "";
  if (normalizedTrigger) {
    const matched = params.config.routes.find((route) => route.trigger === normalizedTrigger);
    if (matched) return resolveVoiceWakeRouteTarget(matched.target);
  }
  return resolveVoiceWakeRouteTarget(params.config.defaultTarget);
}
//#endregion
export {
  validateVoiceWakeRoutingConfigInput as a,
  setVoiceWakeRoutingConfig as i,
  normalizeVoiceWakeRoutingConfig as n,
  resolveVoiceWakeRouteByTrigger as r,
  loadVoiceWakeRoutingConfig as t,
};
