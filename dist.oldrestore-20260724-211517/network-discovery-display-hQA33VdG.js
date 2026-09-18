import { d as pickPrimaryLanIPv4, p as resolveGatewayBindHost } from "./net-BpMGIYrw.js";
import { n as pickPrimaryTailnetIPv4 } from "./tailnet-k93TkOdF.js";
//#region src/infra/network-discovery-display.ts
function summarizeDisplayNetworkError(error) {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message) return message;
  }
  return "network interface discovery failed";
}
function fallbackBindHostForDisplay(bindMode, customBindHost) {
  if (bindMode === "lan") return "0.0.0.0";
  if (bindMode === "custom") return customBindHost?.trim() || "0.0.0.0";
  return "127.0.0.1";
}
/** Return a LAN IPv4 for display, or undefined when interface discovery fails. */
function pickBestEffortPrimaryLanIPv4() {
  try {
    return pickPrimaryLanIPv4();
  } catch {
    return;
  }
}
/** Return a tailnet IPv4 plus an optional warning suitable for user output. */
function inspectBestEffortPrimaryTailnetIPv4(params) {
  try {
    return { tailnetIPv4: pickPrimaryTailnetIPv4() };
  } catch (error) {
    const prefix = params?.warningPrefix?.trim();
    const warning = prefix ? `${prefix}: ${summarizeDisplayNetworkError(error)}.` : void 0;
    return {
      tailnetIPv4: void 0,
      ...(warning ? { warning } : {}),
    };
  }
}
/** Resolve the gateway bind host for display, falling back to a safe placeholder. */
async function resolveBestEffortGatewayBindHostForDisplay(params) {
  try {
    return { bindHost: await resolveGatewayBindHost(params.bindMode, params.customBindHost) };
  } catch (error) {
    const prefix = params.warningPrefix?.trim();
    const warning = prefix ? `${prefix}: ${summarizeDisplayNetworkError(error)}.` : void 0;
    return {
      bindHost: fallbackBindHostForDisplay(params.bindMode, params.customBindHost),
      ...(warning ? { warning } : {}),
    };
  }
}
//#endregion
export {
  pickBestEffortPrimaryLanIPv4 as n,
  resolveBestEffortGatewayBindHostForDisplay as r,
  inspectBestEffortPrimaryTailnetIPv4 as t,
};
