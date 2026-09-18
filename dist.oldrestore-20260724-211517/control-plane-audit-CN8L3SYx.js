import { t as normalizeControlPlaneIdentityPart } from "./control-plane-identity-CDhSlyN5.js";
//#region src/gateway/control-plane-audit.ts
/** Extracts audit identity from a possibly missing or partially connected client. */
function resolveControlPlaneActor(client) {
  return {
    actor: normalizeControlPlaneIdentityPart(client?.connect?.client?.id, "unknown-actor"),
    deviceId: normalizeControlPlaneIdentityPart(client?.connect?.device?.id, "unknown-device"),
    clientIp: normalizeControlPlaneIdentityPart(client?.clientIp, "unknown-ip"),
    connId: normalizeControlPlaneIdentityPart(client?.connId, "unknown-conn"),
  };
}
/** Formats actor identity as compact key/value text for structured gateway logs. */
function formatControlPlaneActor(actor) {
  return `actor=${actor.actor} device=${actor.deviceId} ip=${actor.clientIp} conn=${actor.connId}`;
}
/** Summarizes changed config/state paths without letting audit logs grow unbounded. */
function summarizeChangedPaths(paths, maxPaths = 8) {
  if (paths.length === 0) return "<none>";
  if (paths.length <= maxPaths) return paths.join(",");
  return `${paths.slice(0, maxPaths).join(",")},+${paths.length - maxPaths} more`;
}
//#endregion
export { resolveControlPlaneActor as n, summarizeChangedPaths as r, formatControlPlaneActor as t };
