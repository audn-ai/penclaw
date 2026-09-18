import { randomUUID } from "node:crypto";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/gateway/node-connection-notifications.ts
const DEFAULT_PRIMARY_DELAY_MS = 750;
const DEFAULT_FALLBACK_DELAY_MS = 5e3;
const DEFAULT_RECONNECT_COOLDOWN_MS = 5 * 6e4;
function isMacNotificationNode(node) {
  const platform = node.platform?.trim().toLowerCase() ?? "";
  return (
    (platform === "darwin" || platform.startsWith("macos")) &&
    node.commands.includes("system.notify")
  );
}
function compareActivity(left, right) {
  const activeDelta = (right.lastActiveAtMs ?? -1) - (left.lastActiveAtMs ?? -1);
  if (activeDelta !== 0) return activeDelta;
  return (right.presenceUpdatedAtMs ?? -1) - (left.presenceUpdatedAtMs ?? -1);
}
function connectionLabel(node) {
  return sliceUtf16Safe(
    (normalizeOptionalString(node.displayName) ?? node.nodeId).replace(/\s+/g, " "),
    0,
    80,
  );
}
/** One gateway-runtime router with bounded reconnect suppression and short-lived timers. */
var NodeConnectionNotificationRouter = class {
  constructor(registry, options = {}) {
    this.registry = registry;
    this.lastAlertAtByNodeId = /* @__PURE__ */ new Map();
    this.timersByNodeId = /* @__PURE__ */ new Map();
    this.pendingConnByNodeId = /* @__PURE__ */ new Map();
    this.primaryDelayMs = options.primaryDelayMs ?? DEFAULT_PRIMARY_DELAY_MS;
    this.fallbackDelayMs = options.fallbackDelayMs ?? DEFAULT_FALLBACK_DELAY_MS;
    this.reconnectCooldownMs = options.reconnectCooldownMs ?? DEFAULT_RECONNECT_COOLDOWN_MS;
    this.now = options.now ?? Date.now;
  }
  onConnected(source) {
    const now = this.now();
    const previous = this.lastAlertAtByNodeId.get(source.nodeId);
    if (previous !== void 0 && now - previous < this.reconnectCooldownMs) return;
    this.pendingConnByNodeId.set(source.nodeId, source.connId);
    this.replaceTimer(
      source.nodeId,
      setTimeout(() => {
        this.timersByNodeId.delete(source.nodeId);
        this.deliverPrimary(source);
      }, this.primaryDelayMs),
    );
  }
  dispose() {
    for (const timer of this.timersByNodeId.values()) clearTimeout(timer);
    this.timersByNodeId.clear();
    this.pendingConnByNodeId.clear();
  }
  async deliverPrimary(source) {
    if (!this.attemptIsCurrent(source)) return;
    const primary = this.notificationTargets()
      .filter((node) => node.lastActiveAtMs !== void 0)
      .toSorted(compareActivity)
      .at(0);
    const delivered = primary ? await this.notify(primary, source) : false;
    if (!this.attemptIsCurrent(source)) return;
    if (delivered) {
      this.finishAlert(source);
      return;
    }
    this.replaceTimer(
      source.nodeId,
      setTimeout(() => {
        this.timersByNodeId.delete(source.nodeId);
        this.deliverFallback(source, primary?.connId);
      }, this.fallbackDelayMs),
    );
  }
  async deliverFallback(source, attemptedConnId) {
    if (!this.attemptIsCurrent(source)) return;
    const targets = this.notificationTargets().filter((node) => node.connId !== attemptedConnId);
    await Promise.all(targets.map(async (node) => await this.notify(node, source)));
    if (this.attemptIsCurrent(source)) this.finishAlert(source);
  }
  attemptIsCurrent(source) {
    return (
      this.pendingConnByNodeId.get(source.nodeId) === source.connId &&
      this.registry
        .listConnected()
        .some((node) => node.nodeId === source.nodeId && node.connId === source.connId)
    );
  }
  finishAlert(source) {
    this.pendingConnByNodeId.delete(source.nodeId);
    const now = this.now();
    this.lastAlertAtByNodeId.set(source.nodeId, now);
    this.pruneCooldowns(now);
  }
  notificationTargets() {
    return this.registry.listConnected().filter(isMacNotificationNode);
  }
  async notify(target, source) {
    try {
      return (
        await this.registry.invoke({
          nodeId: target.nodeId,
          expectedConnId: target.connId,
          command: "system.notify",
          params: {
            title: "Node connected",
            body: `${connectionLabel(source)} connected to OpenClaw.`,
            priority: "active",
            delivery: "auto",
          },
          timeoutMs: 1e4,
          idempotencyKey: randomUUID(),
        })
      ).ok;
    } catch {
      return false;
    }
  }
  replaceTimer(nodeId, timer) {
    const existing = this.timersByNodeId.get(nodeId);
    if (existing) clearTimeout(existing);
    this.timersByNodeId.set(nodeId, timer);
  }
  pruneCooldowns(now) {
    if (this.lastAlertAtByNodeId.size <= 256) return;
    for (const [nodeId, alertedAt] of this.lastAlertAtByNodeId) {
      if (now - alertedAt >= this.reconnectCooldownMs) this.lastAlertAtByNodeId.delete(nodeId);
      if (this.lastAlertAtByNodeId.size <= 256) return;
    }
    while (this.lastAlertAtByNodeId.size > 256) {
      const oldest = this.lastAlertAtByNodeId.keys().next().value;
      if (oldest === void 0) return;
      this.lastAlertAtByNodeId.delete(oldest);
    }
  }
};
const routersByRegistry = /* @__PURE__ */ new WeakMap();
/** Schedules a staged alert for one newly connected node. */
function scheduleNodeConnectionNotification(registry, source) {
  let router = routersByRegistry.get(registry);
  if (!router) {
    router = new NodeConnectionNotificationRouter(registry);
    routersByRegistry.set(registry, router);
  }
  router.onConnected(source);
}
/** Cancels staged alerts owned by a gateway node registry during shutdown. */
function disposeNodeConnectionNotifications(registry) {
  const router = routersByRegistry.get(registry);
  if (!router) return;
  router.dispose();
  routersByRegistry.delete(registry);
}
//#endregion
export { scheduleNodeConnectionNotification as n, disposeNodeConnectionNotifications as t };
