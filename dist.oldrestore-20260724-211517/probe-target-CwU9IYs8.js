import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/probe-target.ts
/** Resolves whether gateway probe commands should target local or remote gateway. */
function resolveGatewayProbeTarget(cfg) {
  const gatewayMode = cfg.gateway?.mode === "remote" ? "remote" : "local";
  const remoteUrlRaw = normalizeOptionalString(cfg.gateway?.remote?.url) ?? "";
  const remoteUrlMissing = gatewayMode === "remote" && !remoteUrlRaw;
  return {
    gatewayMode,
    mode: gatewayMode === "remote" && !remoteUrlMissing ? "remote" : "local",
    remoteUrlMissing,
  };
}
//#endregion
export { resolveGatewayProbeTarget as t };
