import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { l as normalizeMainKey } from "./session-key-druuY-GG.js";
//#region src/config/sessions/main-session.ts
const FALLBACK_DEFAULT_AGENT_ID = "main";
const SESSION_ROUTING_CHANGED_ERROR_REASON = "session-routing-changed";
/** Builds the canonical main session key for an agent. */
function buildMainSessionKey(agentId, mainKey) {
  return `agent:${normalizeAgentId(agentId)}:${normalizeMainKey(mainKey)}`;
}
/** Resolves the configured main session key, honoring global session scope. */
function resolveMainSessionKey(cfg) {
  if (cfg?.session?.scope === "global") return "global";
  const agents = Array.isArray(cfg?.agents?.list) ? cfg.agents.list : [];
  return buildMainSessionKey(
    agents.find((agent) => agent?.default)?.id ?? agents[0]?.id ?? FALLBACK_DEFAULT_AGENT_ID,
    cfg?.session?.mainKey,
  );
}
/** Stable fingerprint for the config values that canonicalize chat session keys. */
function resolveSessionRoutingContract(cfg) {
  const agents = Array.isArray(cfg?.agents?.list) ? cfg.agents.list : [];
  const defaultAgentId =
    agents.find((agent) => agent?.default)?.id ?? agents[0]?.id ?? FALLBACK_DEFAULT_AGENT_ID;
  return [
    cfg?.session?.scope ?? "per-sender",
    normalizeMainKey(cfg?.session?.mainKey),
    normalizeAgentId(defaultAgentId),
  ].join("|");
}
/** Resolves the main session key for one explicit agent. */
function resolveAgentMainSessionKey(params) {
  return buildMainSessionKey(params.agentId, params.cfg?.session?.mainKey);
}
/** Resolves an explicit agent id to its canonical main session key. */
function resolveExplicitAgentSessionKey(params) {
  const agentId = params.agentId?.trim();
  if (!agentId) return;
  return resolveAgentMainSessionKey({
    cfg: params.cfg,
    agentId,
  });
}
/** Canonicalizes main-session aliases to the current scoped session key. */
function canonicalizeMainSessionAlias(params) {
  const raw = params.sessionKey.trim();
  if (!raw) return raw;
  const agentId = normalizeAgentId(params.agentId);
  const mainKey = normalizeMainKey(params.cfg?.session?.mainKey);
  const agentMainSessionKey = buildMainSessionKey(agentId, mainKey);
  const agentMainAliasKey = buildMainSessionKey(agentId, "main");
  const legacyMainKey = buildMainSessionKey(FALLBACK_DEFAULT_AGENT_ID, mainKey);
  const legacyMainAliasKey = buildMainSessionKey(FALLBACK_DEFAULT_AGENT_ID, "main");
  const isMainAlias =
    raw === "main" ||
    raw === mainKey ||
    raw === agentMainSessionKey ||
    raw === agentMainAliasKey ||
    raw === legacyMainKey ||
    raw === legacyMainAliasKey;
  if (params.cfg?.session?.scope === "global" && isMainAlias) return "global";
  if (isMainAlias) return agentMainSessionKey;
  return raw;
}
//#endregion
export {
  resolveMainSessionKey as a,
  resolveExplicitAgentSessionKey as i,
  canonicalizeMainSessionAlias as n,
  resolveSessionRoutingContract as o,
  resolveAgentMainSessionKey as r,
  SESSION_ROUTING_CHANGED_ERROR_REASON as t,
};
