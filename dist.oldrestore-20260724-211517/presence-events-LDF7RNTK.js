import { t as listSystemPresence } from "./system-presence-DDHDeupO.js";
//#region src/gateway/server/presence-events.ts
/**
 * Presence snapshot broadcaster for gateway clients.
 */
function broadcastPresenceSnapshot(params) {
  const presenceVersion = params.incrementPresenceVersion();
  params.broadcast(
    "presence",
    { presence: listSystemPresence() },
    {
      dropIfSlow: true,
      stateVersion: {
        presence: presenceVersion,
        health: params.getHealthVersion(),
      },
    },
  );
  return presenceVersion;
}
//#endregion
export { broadcastPresenceSnapshot as t };
