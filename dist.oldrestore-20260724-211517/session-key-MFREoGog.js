import { n as canonicalizeMainSessionAlias } from "./main-session-nrmKYo2W.js";
import { v as toAgentStoreSessionKey } from "./session-key-druuY-GG.js";
//#region src/cron/isolated-agent/session-key.ts
/** Canonicalizes cron session keys into agent-scoped session-store keys. */
/** Resolves a cron session key into the canonical agent-scoped session-store key. */
function resolveCronAgentSessionKey(params) {
  const raw = toAgentStoreSessionKey({
    agentId: params.agentId,
    requestKey: params.sessionKey.trim(),
    mainKey: params.mainKey,
  });
  return canonicalizeMainSessionAlias({
    cfg: params.cfg,
    agentId: params.agentId,
    sessionKey: raw,
  });
}
//#endregion
export { resolveCronAgentSessionKey as t };
