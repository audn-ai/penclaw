import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-C386OSgw.js";
import {
  g as resolveGatewaySessionStoreTargetWithStore,
  p as resolveFreshestSessionEntryFromStoreKeys,
} from "./session-utils-DjTWBI0J.js";
//#region src/gateway/worker-environments/session-target.ts
function resolveWorkerSessionTarget(cfg, sessionId) {
  const { store } = loadCombinedSessionStoreForGateway(cfg);
  const selection = resolveSessionIdMatchSelection(
    Object.entries(store).filter(([, entry]) => entry.sessionId === sessionId),
    sessionId,
  );
  if (selection.kind !== "selected") return;
  const target = resolveGatewaySessionStoreTargetWithStore({
    cfg,
    key: selection.sessionKey,
    clone: false,
  });
  const entry = resolveFreshestSessionEntryFromStoreKeys(target.store, target.storeKeys);
  if (!entry || entry.sessionId !== sessionId) return;
  return {
    agentId: target.agentId,
    sessionEntry: entry,
    sessionId,
    sessionKey: target.canonicalKey,
    sessionStore: target.store,
    storePath: target.storePath,
  };
}
//#endregion
export { resolveWorkerSessionTarget as t };
