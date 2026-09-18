import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
//#region src/gateway/server-plugin-fallback-context.ts
const FALLBACK_GATEWAY_CONTEXT_STATE_KEY = Symbol.for("openclaw.fallbackGatewayContextState");
const getFallbackGatewayContextState = () =>
  resolveGlobalSingleton(FALLBACK_GATEWAY_CONTEXT_STATE_KEY, () => ({
    context: void 0,
    resolveContext: void 0,
  }));
/** Set the process fallback gateway context for channel adapters outside WS requests. */
function setFallbackGatewayContext(ctx) {
  const fallbackGatewayContextState = getFallbackGatewayContextState();
  fallbackGatewayContextState.context = ctx;
  fallbackGatewayContextState.resolveContext = void 0;
  return () => {
    const currentFallbackGatewayContextState = getFallbackGatewayContextState();
    if (
      currentFallbackGatewayContextState.context === ctx &&
      currentFallbackGatewayContextState.resolveContext === void 0
    )
      currentFallbackGatewayContextState.context = void 0;
  };
}
function setFallbackGatewayContextResolver(resolveContext) {
  const fallbackGatewayContextState = getFallbackGatewayContextState();
  fallbackGatewayContextState.context = void 0;
  fallbackGatewayContextState.resolveContext = resolveContext;
  return () => {
    const currentFallbackGatewayContextState = getFallbackGatewayContextState();
    if (currentFallbackGatewayContextState.resolveContext === resolveContext) {
      currentFallbackGatewayContextState.context = void 0;
      currentFallbackGatewayContextState.resolveContext = void 0;
    }
  };
}
/** Clear the fallback gateway context installed for non-WS dispatch paths. */
function clearFallbackGatewayContext() {
  const fallbackGatewayContextState = getFallbackGatewayContextState();
  fallbackGatewayContextState.context = void 0;
  fallbackGatewayContextState.resolveContext = void 0;
}
function getFallbackGatewayContext() {
  const fallbackGatewayContextState = getFallbackGatewayContextState();
  return fallbackGatewayContextState.resolveContext?.() ?? fallbackGatewayContextState.context;
}
//#endregion
export {
  setFallbackGatewayContextResolver as i,
  getFallbackGatewayContext as n,
  setFallbackGatewayContext as r,
  clearFallbackGatewayContext as t,
};
