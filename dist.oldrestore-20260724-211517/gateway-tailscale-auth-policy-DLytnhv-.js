//#region src/shared/gateway-tailscale-auth-policy.ts
/** True when Tailscale exposure is configured without gateway authentication. */
function isUnsafeGatewayTailscaleNoAuth(params) {
  return (
    params.authMode === "none" &&
    (params.tailscaleMode === "serve" || params.tailscaleMode === "funnel")
  );
}
/** Formats the shared validation message for unsafe Tailscale no-auth exposure. */
function formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode) {
  if (tailscaleMode === "funnel")
    return "gateway.tailscale.mode=funnel requires gateway.auth.mode=password; auth.mode=none cannot be used when exposing the gateway through Tailscale Funnel";
  return `gateway.auth.mode=none cannot be used with gateway.tailscale.mode=${tailscaleMode}; configure token, password, or trusted-proxy auth before exposing the gateway through Tailscale`;
}
//#endregion
export { isUnsafeGatewayTailscaleNoAuth as n, formatUnsafeGatewayTailscaleNoAuthMessage as t };
