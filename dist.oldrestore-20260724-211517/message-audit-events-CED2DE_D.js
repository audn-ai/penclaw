import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.js";
//#region src/audit/message-audit-events.ts
/** Trusted in-process message lifecycle stream for durable audit projection. */
const listeners = /* @__PURE__ */ new Set();
/** Emit only closed metadata. This stream is intentionally not part of the plugin SDK. */
function emitTrustedMessageAuditEvent(event) {
  if (listeners.size === 0) return;
  notifyListeners(listeners, event);
}
function onTrustedMessageAuditEvent(listener) {
  return registerListener(listeners, listener);
}
/** Lets hot producers skip attribution work while message audit is disabled. */
function hasTrustedMessageAuditListeners() {
  return listeners.size > 0;
}
//#endregion
export {
  hasTrustedMessageAuditListeners as n,
  onTrustedMessageAuditEvent as r,
  emitTrustedMessageAuditEvent as t,
};
