//#region src/gateway/ws-logging.ts
let gatewayWsLogStyle = "auto";
/** Overrides gateway WebSocket log formatting for tests or explicit runtime config. */
function setGatewayWsLogStyle(style) {
  gatewayWsLogStyle = style;
}
/** Returns the active gateway WebSocket log style. */
function getGatewayWsLogStyle() {
  return gatewayWsLogStyle;
}
//#endregion
export { setGatewayWsLogStyle as n, getGatewayWsLogStyle as t };
