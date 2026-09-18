import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
const gatewaySubagentState = resolveGlobalSingleton(
  Symbol.for("openclaw.plugin.gatewaySubagentRuntime"),
  () => ({
    subagent: void 0,
    nodes: void 0,
  }),
);
/**
 * Set the process-global gateway subagent runtime.
 * Called during gateway startup so that gateway-bindable plugin runtimes can
 * resolve subagent methods dynamically even when their registry was cached
 * before the gateway finished loading plugins.
 */
function setGatewaySubagentRuntime(subagent) {
  gatewaySubagentState.subagent = subagent;
}
function setGatewayNodesRuntime(nodes) {
  gatewaySubagentState.nodes = nodes;
}
//#endregion
export { setGatewayNodesRuntime as n, setGatewaySubagentRuntime as r, gatewaySubagentState as t };
