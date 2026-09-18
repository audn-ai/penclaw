//#region src/cli/gateway-cli/runtime-hooks.ts
let activeGatewayRunRuntimeHooks = {};
function getGatewayRunRuntimeHooks() {
  return activeGatewayRunRuntimeHooks;
}
function installGatewayRunRuntimeHooks(hooks) {
  const previous = activeGatewayRunRuntimeHooks;
  activeGatewayRunRuntimeHooks = hooks;
  return () => {
    if (activeGatewayRunRuntimeHooks === hooks) activeGatewayRunRuntimeHooks = previous;
  };
}
//#endregion
export { installGatewayRunRuntimeHooks as n, getGatewayRunRuntimeHooks as t };
