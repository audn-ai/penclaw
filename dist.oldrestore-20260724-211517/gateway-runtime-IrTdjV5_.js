import "./net-BpMGIYrw.js";
import "./auth-D-Aebsmj.js";
import "./client-BkZfVL9e.js";
import "./node-command-policy-pdhFRd-t.js";
import "./operator-approvals-client-DekCwBNw.js";
import "./gateway-rpc-DpocbsVi.js";
import "./hosted-plugin-surface-url-ByiDFoqE.js";
import "./plugin-node-capability-BAHU33fB.js";
import "./nodes.helpers-eTJDH6p7.js";
import "./startup-auth-2fsYhDPK.js";
//#region src/gateway/channel-status-patches.ts
/** Creates a connected-channel status patch with matching connection/event timestamps. */
function createConnectedChannelStatusPatch(at = Date.now()) {
  return {
    connected: true,
    lastConnectedAt: at,
    lastEventAt: at,
  };
}
/** Creates a transport-activity patch for health/activity monitors. */
function createTransportActivityStatusPatch(at = Date.now()) {
  return { lastTransportActivityAt: at };
}
//#endregion
//#region src/plugin-sdk/gateway-runtime.ts
async function resolveAdvertisedLanHost() {
  return await (await import("./advertised-lan-host-5FUaCpXZ.js")).resolveAdvertisedLanHost();
}
//#endregion
export {
  createConnectedChannelStatusPatch as n,
  createTransportActivityStatusPatch as r,
  resolveAdvertisedLanHost as t,
};
