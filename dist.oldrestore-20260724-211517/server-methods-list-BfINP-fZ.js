import { o as listCoreAdvertisedGatewayMethodNames } from "./core-descriptors-CxB_dkaR.js";
import { t as GATEWAY_EVENT_UPDATE_AVAILABLE } from "./events-CrZXFXYx.js";
import { i as listLoadedChannelPlugins } from "./registry-loaded-D8eZo-vR.js";
//#region src/gateway/server-aux-methods.ts
/** Gateway method ids handled by auxiliary approval/secret surfaces. */
const GATEWAY_AUX_METHODS = [
  "exec.approval.get",
  "exec.approval.list",
  "exec.approval.request",
  "exec.approval.waitDecision",
  "exec.approval.resolve",
  "plugin.approval.list",
  "plugin.approval.request",
  "plugin.approval.waitDecision",
  "plugin.approval.resolve",
  "approval.get",
  "approval.resolve",
  "secrets.reload",
  "secrets.resolve",
];
//#endregion
//#region src/gateway/server-methods-list.ts
/** Lists core methods intentionally advertised to gateway clients. */
function listCoreGatewayMethods() {
  return listCoreAdvertisedGatewayMethodNames();
}
function listChannelGatewayMethods() {
  const methods = [];
  for (const plugin of listLoadedChannelPlugins()) {
    methods.push(...(plugin.gatewayMethods ?? []));
    for (const descriptor of plugin.gatewayMethodDescriptors ?? []) methods.push(descriptor.name);
  }
  return methods;
}
/** Returns the de-duplicated gateway method catalog advertised through method-list APIs. */
function listGatewayMethods() {
  return Array.from(
    /* @__PURE__ */ new Set([
      ...listCoreGatewayMethods(),
      ...GATEWAY_AUX_METHODS,
      ...listChannelGatewayMethods(),
    ]),
  );
}
/** Gateway event names that clients can subscribe to or receive over the wire. */
const GATEWAY_EVENTS = [
  "connect.challenge",
  "agent",
  "chat",
  "session.approval",
  "session.message",
  "session.operation",
  "session.tool",
  "sessions.changed",
  "presence",
  "tick",
  "talk.mode",
  "talk.event",
  "shutdown",
  "health",
  "heartbeat",
  "cron",
  "task",
  "task.suggestion",
  "node.pair.requested",
  "node.pair.resolved",
  "node.presence",
  "node.invoke.cancel",
  "node.invoke.input",
  "node.invoke.request",
  "device.pair.requested",
  "device.pair.resolved",
  "voicewake.changed",
  "voicewake.routing.changed",
  "exec.approval.requested",
  "exec.approval.resolved",
  "plugin.approval.requested",
  "plugin.approval.resolved",
  "terminal.data",
  "terminal.exit",
  GATEWAY_EVENT_UPDATE_AVAILABLE,
];
//#endregion
export { listGatewayMethods as n, GATEWAY_EVENTS as t };
