import { t as buildAgentSessionKey } from "./resolve-route-oiOq6bK9.js";
//#region src/infra/outbound/base-session-key.ts
/**
 * Builds the canonical outbound base-session key for a resolved route peer.
 *
 * Mirrors the routing layer's session-scope rules so outbound-only sends and
 * inbound route resolution keep the same `dmScope` and identity-link behavior.
 */
function buildOutboundBaseSessionKey(params) {
  return buildAgentSessionKey({
    agentId: params.agentId,
    mainKey: params.cfg.session?.mainKey,
    channel: params.channel,
    accountId: params.accountId,
    peer: params.peer,
    dmScope: params.cfg.session?.dmScope ?? "main",
    identityLinks: params.cfg.session?.identityLinks,
  });
}
//#endregion
export { buildOutboundBaseSessionKey as t };
