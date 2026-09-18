import { c as callGateway } from "./call-BVMO6az_.js";
import { n as GATEWAY_CLIENT_IDS, o as normalizeGatewayClientId } from "./client-info-Br1guPTt.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { l as normalizeMainKey } from "./session-key-druuY-GG.js";
import "./config-BDv-QbJ6.js";
import {
  a as isSubagentSessionKey,
  n as isAcpSessionKey,
  u as parseRawSessionConversationRef,
} from "./session-key-utils-B8sNp9l4.js";
import {
  a as listSpawnedSessionKeys,
  s as resolveSandboxSessionToolsVisibility,
} from "./session-visibility-B7S_cwHU.js";
import "./client-BkZfVL9e.js";
import { n as GatewayClientRequestError } from "./src-BOx4iLSi.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/sessions/session-id.ts
const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function looksLikeSessionId(value) {
  return SESSION_ID_RE.test(value.trim());
}
//#endregion
//#region src/agents/tools/sessions-resolution.ts
/**
 * Session key resolution helpers.
 *
 * Normalizes display/internal/current-session aliases and resolves session-id inputs through Gateway.
 */
const defaultSessionsResolutionDeps = { callGateway };
const CURRENT_SESSION_CLIENT_ALIAS_IDS = /* @__PURE__ */ new Set([
  GATEWAY_CLIENT_IDS.TUI,
  GATEWAY_CLIENT_IDS.CLI,
  GATEWAY_CLIENT_IDS.WEBCHAT_UI,
  GATEWAY_CLIENT_IDS.CONTROL_UI,
  GATEWAY_CLIENT_IDS.MACOS_APP,
  GATEWAY_CLIENT_IDS.IOS_APP,
  GATEWAY_CLIENT_IDS.ANDROID_APP,
]);
let sessionsResolutionDeps = defaultSessionsResolutionDeps;
function resolveMainSessionAlias(cfg) {
  const mainKey = normalizeMainKey(cfg.session?.mainKey);
  const scope = cfg.session?.scope ?? "per-sender";
  return {
    mainKey,
    alias: scope === "global" ? "global" : mainKey,
    scope,
  };
}
function resolveDisplaySessionKey(params) {
  if (params.key === params.alias) return "main";
  if (params.key === params.mainKey) return "main";
  return params.key;
}
function resolveInternalSessionKey(params) {
  if (params.key === "current") return params.requesterInternalKey ?? params.key;
  if (params.key === "main") return params.alias;
  return params.key;
}
function resolveCurrentSessionClientAlias(params) {
  const requesterKey = normalizeOptionalString(params.requesterInternalKey);
  if (!requesterKey) return;
  const clientId = normalizeGatewayClientId(params.key);
  if (!clientId || !CURRENT_SESSION_CLIENT_ALIAS_IDS.has(clientId)) return;
  return requesterKey;
}
async function isRequesterSpawnedSessionVisible(params) {
  if (params.requesterSessionKey === params.targetSessionKey) return true;
  try {
    const resolved = await sessionsResolutionDeps.callGateway({
      method: "sessions.resolve",
      params: {
        key: params.targetSessionKey,
        spawnedBy: params.requesterSessionKey,
      },
    });
    if (typeof resolved?.key === "string" && resolved.key.trim() === params.targetSessionKey)
      return true;
  } catch {}
  return (
    await listSpawnedSessionKeys({
      requesterSessionKey: params.requesterSessionKey,
      limit: params.limit,
    })
  ).has(params.targetSessionKey);
}
function looksLikeSessionKey(value) {
  const raw = normalizeOptionalString(value) ?? "";
  if (!raw) return false;
  if (raw === "main" || raw === "global" || raw === "unknown" || raw === "current") return true;
  if (isAcpSessionKey(raw)) return true;
  if (raw.startsWith("agent:")) return true;
  if (raw.startsWith("cron:") || raw.startsWith("hook:")) return true;
  if (raw.startsWith("node-") || raw.startsWith("node:")) return true;
  if (raw.includes(":group:") || raw.includes(":channel:")) return true;
  return false;
}
function shouldResolveSessionIdInput(value) {
  return looksLikeSessionId(value) || !looksLikeSessionKey(value);
}
function buildResolvedSessionReference(params) {
  return {
    ok: true,
    key: params.key,
    displayKey: resolveDisplaySessionKey({
      key: params.key,
      alias: params.alias,
      mainKey: params.mainKey,
    }),
    resolvedViaSessionId: params.resolvedViaSessionId,
  };
}
function buildSessionIdResolveParams(params) {
  return {
    sessionId: params.sessionId,
    spawnedBy: params.restrictToSpawned ? params.requesterInternalKey : void 0,
    includeGlobal: !params.restrictToSpawned,
    includeUnknown: !params.restrictToSpawned,
    ...(params.allowMissing ? { allowMissing: true } : {}),
  };
}
async function callGatewayResolveSession(params) {
  try {
    return await sessionsResolutionDeps.callGateway({
      method: "sessions.resolve",
      params,
    });
  } catch (error) {
    if (
      !(
        params.allowMissing === true &&
        error instanceof GatewayClientRequestError &&
        error.gatewayCode === "INVALID_REQUEST" &&
        error.message.includes("invalid sessions.resolve params") &&
        error.message.includes("unexpected property 'allowMissing'")
      )
    )
      throw error;
    const legacyParams = { ...params };
    delete legacyParams.allowMissing;
    return await sessionsResolutionDeps.callGateway({
      method: "sessions.resolve",
      params: legacyParams,
    });
  }
}
async function callGatewayResolveSessionId(params) {
  const key =
    normalizeOptionalString(
      (await callGatewayResolveSession(buildSessionIdResolveParams(params)))?.key,
    ) ?? "";
  if (!key)
    throw new Error(
      `Session not found: ${params.sessionId} (use the full sessionKey from sessions_list)`,
    );
  return key;
}
async function resolveSessionKeyFromSessionId(params) {
  try {
    return buildResolvedSessionReference({
      key: await callGatewayResolveSessionId(params),
      alias: params.alias,
      mainKey: params.mainKey,
      resolvedViaSessionId: true,
    });
  } catch (err) {
    if (params.restrictToSpawned)
      return {
        ok: false,
        status: "forbidden",
        error: `Session not visible from this sandboxed agent session: ${params.sessionId}`,
      };
    return {
      ok: false,
      status: "error",
      error:
        formatErrorMessage(err) ||
        `Session not found: ${params.sessionId} (use the full sessionKey from sessions_list)`,
    };
  }
}
async function resolveSessionKeyFromKey(params) {
  try {
    const key =
      normalizeOptionalString(
        (
          await callGatewayResolveSession({
            key: params.key,
            spawnedBy: params.restrictToSpawned ? params.requesterInternalKey : void 0,
            ...(params.allowMissing ? { allowMissing: true } : {}),
          })
        )?.key,
      ) ?? "";
    if (!key) return null;
    return buildResolvedSessionReference({
      key,
      alias: params.alias,
      mainKey: params.mainKey,
      resolvedViaSessionId: false,
    });
  } catch {
    return null;
  }
}
async function tryResolveSessionKeyFromSessionId(params) {
  try {
    return buildResolvedSessionReference({
      key: await callGatewayResolveSessionId(params),
      alias: params.alias,
      mainKey: params.mainKey,
      resolvedViaSessionId: true,
    });
  } catch {
    return null;
  }
}
async function resolveSessionReferenceByKeyOrSessionId(params) {
  if (!params.skipKeyLookup) {
    const resolvedByKey = await resolveSessionKeyFromKey({
      key: params.raw,
      alias: params.alias,
      mainKey: params.mainKey,
      requesterInternalKey: params.requesterInternalKey,
      restrictToSpawned: params.restrictToSpawned,
      allowMissing: params.allowMissing,
    });
    if (resolvedByKey) return resolvedByKey;
  }
  if (!(params.forceSessionIdLookup || shouldResolveSessionIdInput(params.raw))) return null;
  if (params.allowUnresolvedSessionId)
    return await tryResolveSessionKeyFromSessionId({
      sessionId: params.raw,
      alias: params.alias,
      mainKey: params.mainKey,
      requesterInternalKey: params.requesterInternalKey,
      restrictToSpawned: params.restrictToSpawned,
      allowMissing: params.allowMissing,
    });
  return await resolveSessionKeyFromSessionId({
    sessionId: params.raw,
    alias: params.alias,
    mainKey: params.mainKey,
    requesterInternalKey: params.requesterInternalKey,
    restrictToSpawned: params.restrictToSpawned,
    allowMissing: params.allowMissing,
  });
}
async function resolveSessionReference(params) {
  const rawInput =
    resolveCurrentSessionClientAlias({
      key: params.sessionKey,
      requesterInternalKey: params.requesterInternalKey,
    }) ?? params.sessionKey.trim();
  if (rawInput === "current") {
    const resolvedCurrent = await resolveSessionReferenceByKeyOrSessionId({
      raw: rawInput,
      alias: params.alias,
      mainKey: params.mainKey,
      requesterInternalKey: params.requesterInternalKey,
      restrictToSpawned: params.restrictToSpawned,
      allowUnresolvedSessionId: true,
      allowMissing: true,
      skipKeyLookup: params.restrictToSpawned,
      forceSessionIdLookup: true,
    });
    if (resolvedCurrent) return resolvedCurrent;
  }
  const raw =
    rawInput === "current" && params.requesterInternalKey ? params.requesterInternalKey : rawInput;
  if (shouldResolveSessionIdInput(raw)) {
    const resolvedByGateway = await resolveSessionReferenceByKeyOrSessionId({
      raw,
      alias: params.alias,
      mainKey: params.mainKey,
      requesterInternalKey: params.requesterInternalKey,
      restrictToSpawned: params.restrictToSpawned,
      allowUnresolvedSessionId: false,
    });
    if (resolvedByGateway) return resolvedByGateway;
  }
  const resolvedKey = resolveInternalSessionKey({
    key: raw,
    alias: params.alias,
    mainKey: params.mainKey,
    requesterInternalKey: params.requesterInternalKey,
  });
  return {
    ok: true,
    key: resolvedKey,
    displayKey: resolveDisplaySessionKey({
      key: resolvedKey,
      alias: params.alias,
      mainKey: params.mainKey,
    }),
    resolvedViaSessionId: false,
  };
}
async function resolveVisibleSessionReference(params) {
  const resolvedKey = params.resolvedSession.key;
  const displayKey = params.resolvedSession.displayKey;
  if (
    !(
      !(
        params.restrictToSpawned &&
        !params.resolvedSession.resolvedViaSessionId &&
        params.requesterSessionKey !== resolvedKey
      ) ||
      (await isRequesterSpawnedSessionVisible({
        requesterSessionKey: params.requesterSessionKey,
        targetSessionKey: resolvedKey,
      }))
    )
  )
    return {
      ok: false,
      status: "forbidden",
      error: `Session not visible from this sandboxed agent session: ${params.visibilitySessionKey}`,
      displayKey,
    };
  return {
    ok: true,
    key: resolvedKey,
    displayKey,
  };
}
//#endregion
//#region src/agents/tools/sessions-access.ts
/**
 * Session visibility and access helpers for session tools.
 *
 * Adds OpenClaw session-key alias normalization and sandbox requester scoping over SDK visibility contracts.
 */
/** Resolves the requester context used to filter sandboxed session-tool access. */
function resolveSandboxedSessionToolContext(params) {
  const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
  const visibility = resolveSandboxSessionToolsVisibility(params.cfg);
  const requesterSessionKey = normalizeOptionalString(params.agentSessionKey);
  const requesterInternalKey = requesterSessionKey
    ? resolveInternalSessionKey({
        key: requesterSessionKey,
        alias,
        mainKey,
      })
    : void 0;
  return {
    mainKey,
    alias,
    visibility,
    requesterInternalKey,
    effectiveRequesterKey: requesterInternalKey ?? alias,
    restrictToSpawned:
      params.sandboxed === true &&
      visibility === "spawned" &&
      Boolean(requesterInternalKey) &&
      !isSubagentSessionKey(requesterInternalKey),
  };
}
//#endregion
//#region src/agents/tools/sessions-helpers.ts
/** Resolves config plus sandbox visibility context for a session tool call. */
function resolveSessionToolContext(opts) {
  const cfg = opts?.config ?? getRuntimeConfig();
  return {
    cfg,
    ...resolveSandboxedSessionToolContext({
      cfg,
      agentSessionKey: opts?.agentSessionKey,
      sandboxed: opts?.sandboxed,
    }),
  };
}
/** Classifies a session key/gateway kind into the row category used by tools. */
function classifySessionKind(params) {
  const key = params.key;
  if (key === params.alias || key === params.mainKey) return "main";
  if (key.startsWith("cron:")) return "cron";
  if (key.startsWith("hook:")) return "hook";
  if (key.startsWith("node-") || key.startsWith("node:")) return "node";
  if (params.gatewayKind === "group") return "group";
  if (key.includes(":group:") || key.includes(":channel:")) return "group";
  return "other";
}
/** Derives the best channel label for a session row. */
function deriveChannel(params) {
  if (params.kind === "cron" || params.kind === "hook" || params.kind === "node") return "internal";
  const channel = normalizeOptionalString(params.channel ?? void 0);
  if (channel) return channel;
  const lastChannel = normalizeOptionalString(params.lastChannel ?? void 0);
  if (lastChannel) return lastChannel;
  return parseRawSessionConversationRef(params.key)?.channel ?? "unknown";
}
//#endregion
export {
  resolveCurrentSessionClientAlias as a,
  resolveMainSessionAlias as c,
  shouldResolveSessionIdInput as d,
  SESSION_ID_RE as f,
  resolveSandboxedSessionToolContext as i,
  resolveSessionReference as l,
  deriveChannel as n,
  resolveDisplaySessionKey as o,
  looksLikeSessionId as p,
  resolveSessionToolContext as r,
  resolveInternalSessionKey as s,
  classifySessionKind as t,
  resolveVisibleSessionReference as u,
};
