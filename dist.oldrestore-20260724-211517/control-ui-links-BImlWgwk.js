import { t as resolveAdvertisedLanHost } from "./advertised-lan-host-EzCosS8d.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { l as isValidIPv4 } from "./net-BpMGIYrw.js";
import {
  n as pickBestEffortPrimaryLanIPv4,
  t as inspectBestEffortPrimaryTailnetIPv4,
} from "./network-discovery-display-hQA33VdG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/control-ui-links.ts
/** Resolve the advertised HTTP and websocket URLs for the Control UI. */
function resolveControlUiLinks(params) {
  const port = params.port;
  const bind = params.bind ?? "loopback";
  const customBindHost = params.customBindHost?.trim();
  const advertisedLanHost = normalizeOptionalString(params.advertisedLanHost);
  const { tailnetIPv4 } = inspectBestEffortPrimaryTailnetIPv4();
  const host = (() => {
    if (bind === "custom" && customBindHost && isValidIPv4(customBindHost)) return customBindHost;
    if (bind === "tailnet" && tailnetIPv4) return tailnetIPv4 ?? "127.0.0.1";
    if (bind === "lan") return advertisedLanHost ?? pickBestEffortPrimaryLanIPv4() ?? "127.0.0.1";
    return "127.0.0.1";
  })();
  const basePath = normalizeControlUiBasePath(params.basePath);
  const uiPath = basePath ? `${basePath}/` : "/";
  const wsPath = basePath ? basePath : "";
  const httpScheme = params.tlsEnabled === true ? "https" : "http";
  const wsScheme = params.tlsEnabled === true ? "wss" : "ws";
  return {
    httpUrl: `${httpScheme}://${host}:${port}${uiPath}`,
    wsUrl: `${wsScheme}://${host}:${port}${wsPath}`,
  };
}
/** Resolve Control UI URLs meant for display to nearby devices. */
async function resolveAdvertisedControlUiLinks(params) {
  const advertisedLanHost =
    params.bind === "lan" ? await resolveAdvertisedLanHost().catch(() => null) : null;
  return resolveControlUiLinks({
    ...params,
    advertisedLanHost,
  });
}
/** Resolve Control UI URLs for co-located readiness probes and health checks. */
function resolveLocalControlUiProbeLinks(params) {
  return resolveControlUiLinks({
    ...params,
    bind: params.bind === "lan" ? "loopback" : params.bind,
  });
}
//#endregion
export {
  resolveControlUiLinks as n,
  resolveLocalControlUiProbeLinks as r,
  resolveAdvertisedControlUiLinks as t,
};
