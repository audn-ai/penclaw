import http from "node:http";
import { WebSocketServer } from "ws";
import { a as resolveProfile } from "./config-CzdiqFrD.js";
import "./security-runtime-CraX8Pqe.js";
import "./cdp.helpers-ChuUODxP.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import "./bounded-utf8-tail-zGgVhmwV.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import {
  a as getOrCreateProfileRuntime,
  m as withProfileOperationLease,
  o as getProfileLifecycle,
  s as isBrowserRuntimeRunning,
} from "./server-context.lifecycle-CPismpkV.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region extensions/browser/src/browser/extension-relay/relay-protocol.ts
/** Parse one extension frame; returns null for malformed input. */
function parseExtensionMessage(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const type = parsed.type;
  if (typeof type !== "string") return null;
  switch (type) {
    case "hello":
    case "tabs":
    case "cdpEvent":
    case "result":
    case "error":
    case "detached":
    case "pong":
      return parsed;
    default:
      return null;
  }
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-bridge.ts
/**
 * Extension relay CDP bridge.
 *
 * Presents a CDP browser endpoint (compatible with Playwright connectOverCDP)
 * on one side and the OpenClaw Chrome extension's chrome.debugger transport on
 * the other. The bridge owns all Target.* synthesis so the extension stays a
 * thin forwarder — the old assets/chrome-extension put this logic in an
 * untestable MV3 service worker, which is why it rotted and was removed.
 */
const log$2 = createSubsystemLogger("browser").child("extension-relay");
/** Default timeout for commands forwarded to the extension. */
const EXTENSION_COMMAND_TIMEOUT_MS = 15e3;
/** App-level keepalive interval; message traffic keeps the MV3 worker alive. */
const EXTENSION_PING_INTERVAL_MS = 2e4;
/** Synthetic targetId for the emulated browser target. */
const BROWSER_TARGET_ID = "openclaw-extension-relay";
/** Playwright requires every attached page target to identify its browser context. */
const BROWSER_CONTEXT_ID = "openclaw-extension-context";
function toErrorPayload(id, sessionId, message, code = -32e3) {
  return JSON.stringify({
    id,
    ...(sessionId ? { sessionId } : {}),
    error: {
      code,
      message,
    },
  });
}
/**
 * One relay bridge per extension-driver profile. Accepts at most one extension
 * connection (a newer one replaces the old — MV3 workers restart freely) and
 * any number of CDP clients (pw-session caches one per cdpUrl in practice).
 */
var ExtensionRelayBridge = class {
  constructor(opts = {}) {
    this.extension = null;
    this.clients = /* @__PURE__ */ new Set();
    this.tabs = /* @__PURE__ */ new Map();
    this.browserSessions = /* @__PURE__ */ new Map();
    this.auxiliaryTabSessions = /* @__PURE__ */ new Map();
    this.childSessions = /* @__PURE__ */ new Map();
    this.pendingExtension = /* @__PURE__ */ new Map();
    this.nextSeq = 1;
    this.nextSessionOrdinal = 1;
    this.pingTimer = null;
    this.onStateChange = opts.onStateChange;
  }
  /** True once an extension socket completed its hello handshake. */
  get extensionConnected() {
    return this.extension !== null;
  }
  /** Identity of the paired browser, when connected. */
  get identity() {
    return this.extension?.identity ?? null;
  }
  /** Tabs currently shared with OpenClaw (the extension's tab group). */
  sharedTabs() {
    return [...this.tabs.values()].map((tab) => tab.info);
  }
  /** Number of connected CDP clients (diagnostics). */
  get cdpClientCount() {
    return this.clients.size;
  }
  /** Wire up a newly accepted extension WebSocket. */
  attachExtensionSocket(socket) {
    if (this.extension) {
      log$2.info("extension reconnected; replacing previous relay connection");
      this.extension.socket.close(4e3, "replaced by newer extension connection");
      this.handleExtensionGone();
    }
    let helloSeen = false;
    const onMessage = (raw) => {
      const msg = parseExtensionMessage(raw);
      if (!msg) {
        log$2.warn("dropping malformed extension relay frame");
        return;
      }
      if (!helloSeen) {
        if (msg.type !== "hello") {
          socket.close(4001, "expected hello");
          return;
        }
        helloSeen = true;
        this.extension = {
          socket,
          identity: {
            userAgent: msg.userAgent,
            browserVersion: msg.browserVersion,
            extensionVersion: msg.extensionVersion,
          },
        };
        this.syncTabs(msg.tabs);
        this.startPing();
        this.onStateChange?.();
        return;
      }
      this.handleExtensionMessage(msg);
    };
    const onClose = () => {
      if (this.extension?.socket === socket) {
        this.handleExtensionGone();
        this.onStateChange?.();
      }
    };
    return {
      onMessage,
      onClose,
    };
  }
  handleExtensionMessage(msg) {
    switch (msg.type) {
      case "result": {
        const pending = this.pendingExtension.get(msg.seq);
        if (pending) {
          this.pendingExtension.delete(msg.seq);
          clearTimeout(pending.timer);
          pending.resolve(msg.result);
        }
        return;
      }
      case "error": {
        const pending = this.pendingExtension.get(msg.seq);
        if (pending) {
          this.pendingExtension.delete(msg.seq);
          clearTimeout(pending.timer);
          pending.reject(new Error(msg.message));
        }
        return;
      }
      case "cdpEvent":
        this.forwardExtensionEvent(msg.tabId, msg.sessionId, msg.method, msg.params);
        return;
      case "tabs":
        this.syncTabs(msg.tabs);
        return;
      case "detached": {
        const tab = this.tabs.get(msg.tabId);
        if (tab?.attached) {
          this.emitDetachedFromTarget(msg.tabId, tab.attached.sessionId, tab.attached.targetId);
          tab.attached = void 0;
        }
        break;
      }
      case "pong":
      case "hello":
        break;
    }
  }
  handleExtensionGone() {
    this.extension = null;
    this.stopPing();
    for (const pending of this.pendingExtension.values()) {
      clearTimeout(pending.timer);
      pending.reject(/* @__PURE__ */ new Error("extension disconnected"));
    }
    this.pendingExtension.clear();
    for (const [tabId, tab] of this.tabs)
      if (tab.attached) {
        this.emitDetachedFromTarget(tabId, tab.attached.sessionId, tab.attached.targetId);
        tab.attached = void 0;
      }
    this.childSessions.clear();
  }
  startPing() {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      this.sendToExtension({ type: "ping" });
    }, EXTENSION_PING_INTERVAL_MS);
    this.pingTimer.unref?.();
  }
  stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
  sendToExtension(msg) {
    if (!this.extension) throw new Error("OpenClaw Chrome extension is not connected to the relay");
    this.extension.socket.send(JSON.stringify(msg));
  }
  callExtension(command, timeoutMs = EXTENSION_COMMAND_TIMEOUT_MS) {
    const seq = this.nextSeq++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingExtension.delete(seq);
        reject(/* @__PURE__ */ new Error(`extension relay command timed out: ${command.type}`));
      }, timeoutMs);
      timer.unref?.();
      this.pendingExtension.set(seq, {
        resolve,
        reject,
        timer,
      });
      try {
        this.sendToExtension({
          ...command,
          seq,
        });
      } catch (err) {
        this.pendingExtension.delete(seq);
        clearTimeout(timer);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }
  syncTabs(tabs) {
    const nextIds = new Set(tabs.map((tab) => tab.tabId));
    for (const [tabId, tab] of this.tabs)
      if (!nextIds.has(tabId)) {
        if (tab.attached)
          this.emitDetachedFromTarget(tabId, tab.attached.sessionId, tab.attached.targetId);
        this.tabs.delete(tabId);
      }
    for (const info of tabs) {
      const existing = this.tabs.get(info.tabId);
      if (existing) existing.info = info;
      else {
        this.tabs.set(info.tabId, { info });
        if ([...this.clients].some((client) => client.autoAttach))
          this.ensureTabAttached(info.tabId)
            .then(({ targetId, sessionId }) => {
              this.announceAttachedTab(info.tabId, targetId, sessionId, { onlyAutoAttach: true });
            })
            .catch((err) => {
              log$2.warn(`auto-attach of shared tab ${info.tabId} failed: ${String(err)}`);
            });
      }
    }
  }
  async ensureTabAttached(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab) throw new Error(`tab ${tabId} is not shared with OpenClaw`);
    if (tab.attached) return tab.attached;
    if (tab.attaching) return await tab.attaching;
    const attaching = (async () => {
      const result = await this.callExtension({
        type: "attach",
        tabId,
      });
      const attached = {
        targetId: typeof result?.targetId === "string" ? result.targetId : `tab-${tabId}`,
        sessionId: `openclaw-tab-${tabId}-${this.nextSessionOrdinal++}`,
      };
      const current = this.tabs.get(tabId);
      if (current !== tab) {
        this.callExtension({
          type: "detach",
          tabId,
        }).catch(() => {});
        throw new Error(`tab ${tabId} closed during attach`);
      }
      current.attached = attached;
      return attached;
    })();
    tab.attaching = attaching;
    try {
      return await attaching;
    } finally {
      tab.attaching = void 0;
    }
  }
  targetInfoForTab(tab, targetId) {
    return {
      targetId,
      type: "page",
      title: tab.info.title,
      url: tab.info.url,
      browserContextId: BROWSER_CONTEXT_ID,
      attached: true,
      canAccessOpener: false,
    };
  }
  announceAttachedTab(tabId, targetId, sessionId, opts) {
    const tab = this.tabs.get(tabId);
    if (!tab) return;
    const event = {
      method: "Target.attachedToTarget",
      params: {
        sessionId,
        targetInfo: this.targetInfoForTab(tab, targetId),
        waitingForDebugger: false,
      },
    };
    const recipients = opts.onlyClient
      ? [opts.onlyClient]
      : [...this.clients].filter((client) => !opts.onlyAutoAttach || client.autoAttach);
    for (const client of recipients) {
      if (client.announcedSessions.has(sessionId)) continue;
      client.announcedSessions.add(sessionId);
      client.socket.send(JSON.stringify(event));
    }
  }
  emitDetachedFromTarget(tabId, sessionId, targetId) {
    const event = JSON.stringify({
      method: "Target.detachedFromTarget",
      params: {
        sessionId,
        targetId,
      },
    });
    for (const client of this.clients)
      if (client.announcedSessions.delete(sessionId)) client.socket.send(event);
    for (const [auxiliarySessionId, auxiliary] of this.auxiliaryTabSessions) {
      if (auxiliary.tabId !== tabId) continue;
      auxiliary.client.socket.send(
        JSON.stringify({
          sessionId: auxiliary.parentSessionId,
          method: "Target.detachedFromTarget",
          params: {
            sessionId: auxiliarySessionId,
            targetId,
          },
        }),
      );
      this.auxiliaryTabSessions.delete(auxiliarySessionId);
    }
    for (const [childSessionId, ownerTabId] of this.childSessions) {
      if (ownerTabId !== tabId) continue;
      this.childSessions.delete(childSessionId);
      for (const client of this.clients) client.announcedSessions.delete(childSessionId);
    }
  }
  forwardExtensionEvent(tabId, childSessionId, method, params) {
    const rootSessionId = this.tabs.get(tabId)?.attached?.sessionId;
    if (!rootSessionId) return;
    const sessionId = childSessionId ?? rootSessionId;
    if (childSessionId) this.childSessions.set(childSessionId, tabId);
    if (method === "Target.attachedToTarget") {
      const announced = params?.sessionId;
      if (typeof announced === "string") {
        this.childSessions.set(announced, tabId);
        for (const client of this.clients)
          if (client.announcedSessions.has(sessionId)) client.announcedSessions.add(announced);
      }
    }
    const frame = JSON.stringify({
      sessionId,
      method,
      params,
    });
    for (const client of this.clients)
      if (client.announcedSessions.has(sessionId)) client.socket.send(frame);
    if (!childSessionId) {
      for (const [auxiliarySessionId, auxiliary] of this.auxiliaryTabSessions)
        if (auxiliary.tabId === tabId)
          auxiliary.client.socket.send(
            JSON.stringify({
              sessionId: auxiliarySessionId,
              method,
              params,
            }),
          );
    }
  }
  /** Wire up a newly accepted CDP client WebSocket. */
  attachCdpClientSocket(socket) {
    const client = {
      socket,
      autoAttach: false,
      announcedSessions: /* @__PURE__ */ new Set(),
    };
    this.clients.add(client);
    const onMessage = (raw) => {
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        client.socket.send(toErrorPayload(null, void 0, "Parse error", -32700));
        return;
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        client.socket.send(toErrorPayload(null, void 0, "Invalid request", -32600));
        return;
      }
      const request = parsed;
      if (typeof request.id !== "number" || typeof request.method !== "string") {
        const id = typeof request.id === "number" ? request.id : null;
        const sessionId = typeof request.sessionId === "string" ? request.sessionId : void 0;
        client.socket.send(toErrorPayload(id, sessionId, "Invalid request", -32600));
        return;
      }
      this.handleCdpRequest(client, request);
    };
    const onClose = () => {
      this.clients.delete(client);
      for (const [sessionId, owner] of this.browserSessions)
        if (owner === client) this.browserSessions.delete(sessionId);
      for (const [sessionId, auxiliary] of this.auxiliaryTabSessions)
        if (auxiliary.client === client) this.auxiliaryTabSessions.delete(sessionId);
      this.detachAllWhenIdle();
    };
    return {
      onMessage,
      onClose,
    };
  }
  /**
   * Drop chrome.debugger sessions once no CDP client is connected so the
   * "OpenClaw is debugging this browser" infobar only spans active automation.
   */
  detachAllWhenIdle() {
    if (this.clients.size > 0 || !this.extension) return;
    for (const [tabId, tab] of this.tabs)
      if (tab.attached) {
        const { sessionId, targetId } = tab.attached;
        tab.attached = void 0;
        this.emitDetachedFromTarget(tabId, sessionId, targetId);
        this.callExtension({
          type: "detach",
          tabId,
        }).catch(() => {});
      }
  }
  respond(client, request, result) {
    client.socket.send(
      JSON.stringify({
        id: request.id,
        ...(request.sessionId ? { sessionId: request.sessionId } : {}),
        result: result ?? {},
      }),
    );
  }
  respondError(client, request, message, code = -32e3) {
    client.socket.send(toErrorPayload(request.id, request.sessionId, message, code));
  }
  tabBySessionId(sessionId) {
    for (const [tabId, tab] of this.tabs)
      if (tab.attached?.sessionId === sessionId)
        return {
          tabId,
          child: false,
        };
    const auxiliary = this.auxiliaryTabSessions.get(sessionId);
    if (auxiliary)
      return {
        tabId: auxiliary.tabId,
        child: false,
      };
    const childOwner = this.childSessions.get(sessionId);
    if (childOwner !== void 0)
      return {
        tabId: childOwner,
        child: true,
      };
    return null;
  }
  tabByTargetId(targetId) {
    for (const [tabId, tab] of this.tabs)
      if (tab.attached?.targetId === targetId)
        return {
          tabId,
          tab,
        };
    return null;
  }
  async handleCdpRequest(client, request) {
    try {
      if (request.sessionId) {
        if (this.browserSessions.get(request.sessionId) === client) {
          await this.handleBrowserScopedRequest(client, request);
          return;
        }
        await this.handleSessionScopedRequest(client, request);
        return;
      }
      await this.handleBrowserScopedRequest(client, request);
    } catch (err) {
      this.respondError(client, request, err instanceof Error ? err.message : String(err));
    }
  }
  async handleSessionScopedRequest(client, request) {
    const sessionId = request.sessionId;
    const auxiliary = this.auxiliaryTabSessions.get(sessionId);
    if (auxiliary && auxiliary.client !== client) {
      this.respondError(client, request, `Session not found: ${sessionId}`, -32001);
      return;
    }
    const route = this.tabBySessionId(sessionId);
    if (!route) {
      this.respondError(client, request, `Session not found: ${sessionId}`, -32001);
      return;
    }
    const result = await this.callExtension({
      type: "cdp",
      tabId: route.tabId,
      ...(route.child ? { sessionId } : {}),
      method: request.method,
      params: request.params,
    });
    this.respond(client, request, result);
  }
  async handleBrowserScopedRequest(client, request) {
    switch (request.method) {
      case "Browser.getVersion": {
        const identity = this.extension?.identity;
        this.respond(client, request, {
          protocolVersion: "1.3",
          product: identity?.browserVersion ?? "Chrome/unknown",
          revision: "openclaw-extension-relay",
          userAgent: identity?.userAgent ?? "unknown",
          jsVersion: "",
        });
        return;
      }
      case "Browser.close":
        this.respond(client, request, {});
        client.socket.close(1e3, "Browser.close");
        return;
      case "Browser.setDownloadBehavior":
      case "Target.setDiscoverTargets":
        this.respond(client, request, {});
        return;
      case "Target.getTargetInfo": {
        const targetId = request.params?.targetId;
        if (!targetId || targetId === BROWSER_TARGET_ID) {
          this.respond(client, request, {
            targetInfo: {
              targetId: BROWSER_TARGET_ID,
              type: "browser",
              title: "OpenClaw Extension Relay",
              url: "",
              attached: true,
              canAccessOpener: false,
            },
          });
          return;
        }
        const found = this.tabByTargetId(targetId);
        if (!found) {
          this.respondError(client, request, `No target with given id found: ${targetId}`, -32602);
          return;
        }
        this.respond(client, request, { targetInfo: this.targetInfoForTab(found.tab, targetId) });
        return;
      }
      case "Target.getTargets": {
        const targetInfos = [...this.tabs.values()]
          .filter((tab) => tab.attached)
          .map((tab) => this.targetInfoForTab(tab, tab.attached?.targetId ?? ""));
        this.respond(client, request, { targetInfos });
        return;
      }
      case "Target.attachToBrowserTarget": {
        const sessionId = `openclaw-browser-${this.nextSessionOrdinal++}`;
        this.browserSessions.set(sessionId, client);
        this.respond(client, request, { sessionId });
        return;
      }
      case "Target.setAutoAttach": {
        const autoAttach = request.params?.autoAttach !== false;
        client.autoAttach = autoAttach;
        if (autoAttach) {
          const attachResults = await Promise.allSettled(
            [...this.tabs.keys()].map(async (tabId) => {
              const { targetId, sessionId } = await this.ensureTabAttached(tabId);
              return {
                tabId,
                targetId,
                sessionId,
              };
            }),
          );
          for (const settled of attachResults)
            if (settled.status === "fulfilled")
              this.announceAttachedTab(
                settled.value.tabId,
                settled.value.targetId,
                settled.value.sessionId,
                {
                  onlyAutoAttach: false,
                  onlyClient: client,
                },
              );
            else log$2.warn(`setAutoAttach attach failed: ${String(settled.reason)}`);
        }
        this.respond(client, request, {});
        return;
      }
      case "Target.attachToTarget": {
        const targetId = request.params?.targetId;
        const found = targetId ? this.tabByTargetId(targetId) : null;
        if (!found && targetId) {
          this.respondError(client, request, `No target with given id found: ${targetId}`, -32602);
          return;
        }
        if (!found) {
          this.respondError(client, request, "targetId is required", -32602);
          return;
        }
        const attached = await this.ensureTabAttached(found.tabId);
        if (request.sessionId && this.browserSessions.get(request.sessionId) === client) {
          const sessionId = `openclaw-tab-${found.tabId}-${this.nextSessionOrdinal++}`;
          this.auxiliaryTabSessions.set(sessionId, {
            tabId: found.tabId,
            parentSessionId: request.sessionId,
            client,
          });
          this.respond(client, request, { sessionId });
          return;
        }
        this.announceAttachedTab(found.tabId, attached.targetId, attached.sessionId, {
          onlyAutoAttach: false,
          onlyClient: client,
        });
        this.respond(client, request, { sessionId: attached.sessionId });
        return;
      }
      case "Target.detachFromTarget": {
        const sessionId = request.params?.sessionId;
        if (sessionId && this.browserSessions.get(sessionId) === client) {
          this.browserSessions.delete(sessionId);
          for (const [auxiliarySessionId, auxiliary] of this.auxiliaryTabSessions)
            if (auxiliary.parentSessionId === sessionId && auxiliary.client === client)
              this.auxiliaryTabSessions.delete(auxiliarySessionId);
          this.respond(client, request, {});
          return;
        }
        const auxiliary = sessionId ? this.auxiliaryTabSessions.get(sessionId) : void 0;
        if (auxiliary?.client === client) {
          this.auxiliaryTabSessions.delete(sessionId);
          this.respond(client, request, {});
          return;
        }
        if (auxiliary) {
          this.respondError(client, request, `Session not found: ${String(sessionId)}`, -32001);
          return;
        }
        const route = sessionId ? this.tabBySessionId(sessionId) : null;
        if (route && !route.child) {
          const tab = this.tabs.get(route.tabId);
          if (tab?.attached) {
            const { sessionId: rootSession, targetId } = tab.attached;
            tab.attached = void 0;
            this.emitDetachedFromTarget(route.tabId, rootSession, targetId);
            await this.callExtension({
              type: "detach",
              tabId: route.tabId,
            }).catch(() => {});
          }
        }
        this.respond(client, request, {});
        return;
      }
      case "Target.createTarget": {
        const url = typeof request.params?.url === "string" ? request.params.url : "about:blank";
        const created = await this.callExtension({
          type: "createTab",
          url,
        });
        if (typeof created?.tabId !== "number") {
          this.respondError(client, request, "extension did not return a tabId for createTab");
          return;
        }
        const tabId = created.tabId;
        if (!this.tabs.has(tabId))
          this.tabs.set(tabId, {
            info: {
              tabId,
              url,
              title: "",
              active: false,
            },
          });
        const attached = await this.ensureTabAttached(tabId);
        this.announceAttachedTab(tabId, attached.targetId, attached.sessionId, {
          onlyAutoAttach: true,
        });
        this.announceAttachedTab(tabId, attached.targetId, attached.sessionId, {
          onlyAutoAttach: false,
          onlyClient: client,
        });
        this.respond(client, request, { targetId: attached.targetId });
        return;
      }
      case "Target.closeTarget": {
        const targetId = request.params?.targetId;
        const found = targetId ? this.tabByTargetId(targetId) : null;
        if (!found) {
          this.respondError(
            client,
            request,
            `No target with given id found: ${String(targetId)}`,
            -32602,
          );
          return;
        }
        await this.callExtension({
          type: "closeTab",
          tabId: found.tabId,
        });
        this.respond(client, request, { success: true });
        return;
      }
      case "Target.activateTarget": {
        const targetId = request.params?.targetId;
        const found = targetId ? this.tabByTargetId(targetId) : null;
        if (!found) {
          this.respondError(
            client,
            request,
            `No target with given id found: ${String(targetId)}`,
            -32602,
          );
          return;
        }
        await this.callExtension({
          type: "activateTab",
          tabId: found.tabId,
        });
        this.respond(client, request, {});
        return;
      }
      case "Target.createBrowserContext":
        this.respondError(
          client,
          request,
          "The OpenClaw extension relay drives the user's real browser profile; isolated browser contexts are not supported.",
        );
        return;
      default:
        this.respondError(client, request, `'${request.method}' wasn't found`, -32601);
    }
  }
  /** Close all sockets and reject pending work (relay shutdown). */
  dispose() {
    this.stopPing();
    for (const pending of this.pendingExtension.values()) {
      clearTimeout(pending.timer);
      pending.reject(/* @__PURE__ */ new Error("extension relay stopped"));
    }
    this.pendingExtension.clear();
    this.extension?.socket.close(1001, "relay stopped");
    this.extension = null;
    for (const client of this.clients) client.socket.close(1001, "relay stopped");
    this.clients.clear();
    this.browserSessions.clear();
    this.auxiliaryTabSessions.clear();
    this.tabs.clear();
    this.childSessions.clear();
  }
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-server.ts
/**
 * Extension relay HTTP/WebSocket server.
 *
 * Loopback-only endpoint that pairs the OpenClaw Chrome extension with the
 * browser control service:
 *   GET /json/version  -> CDP discovery for pw-session (503 until paired)
 *   WS  /cdp           -> CDP browser endpoint (Playwright connectOverCDP)
 *   WS  /extension     -> the Chrome extension's relay transport
 * Both sides authenticate with the derived relay token: CDP clients send it as
 * Basic auth (flows from the profile cdpUrl userinfo via getHeadersWithAuth),
 * the extension sends the token in its WebSocket subprotocol list.
 */
const log$1 = createSubsystemLogger("browser").child("extension-relay");
const EXTENSION_RELAY_PROTOCOL = "openclaw-extension-relay";
const EXTENSION_RELAY_TOKEN_PROTOCOL_PREFIX = "openclaw-extension-token.";
/**
 * Cap relay frame size to bound memory from a hostile/buggy peer while leaving
 * headroom for CDP payloads (base64 screenshots, DOM snapshots, network bodies).
 */
const EXTENSION_RELAY_MAX_PAYLOAD_BYTES = 64 * 1024 * 1024;
/** Wire an accepted extension WebSocket to a bridge (shared by loopback + gateway paths). */
function attachExtensionWebSocket(bridge, ws) {
  bindSocket(ws, bridge.attachExtensionSocket(toBridgeSocket(ws)));
}
function firstHeader(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}
/** Extract a relay token carried by the extension's WebSocket subprotocol list. */
function requestExtensionProtocolToken(req) {
  const protocols = firstHeader(req.headers["sec-websocket-protocol"])
    .split(",")
    .map((value) => value.trim());
  if (!protocols.includes(EXTENSION_RELAY_PROTOCOL)) return "";
  return (
    protocols.find((value) => value.startsWith(EXTENSION_RELAY_TOKEN_PROTOCOL_PREFIX))?.slice(25) ??
    ""
  );
}
/** Extract relay auth from a CDP header, extension subprotocol, or legacy query. */
function requestToken(req) {
  const auth = firstHeader(req.headers.authorization);
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  if (auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return separator >= 0 ? decoded.slice(separator + 1) : decoded;
  }
  const protocolToken = requestExtensionProtocolToken(req);
  if (protocolToken) return protocolToken;
  try {
    return new URL(req.url ?? "/", "http://127.0.0.1").searchParams.get("token") ?? "";
  } catch {
    return "";
  }
}
function isAuthorized(req, token) {
  const candidate = requestToken(req);
  return candidate.length > 0 && safeEqualSecret(token, candidate);
}
/** Reject cross-origin websocket upgrades; the extension side must come from Chrome. */
function isAllowedExtensionOrigin(req) {
  const origin = firstHeader(req.headers.origin);
  return origin === "" || origin.startsWith("chrome-extension://");
}
/** Reject DNS-rebinding style requests that reach loopback with a foreign Host. */
function hasLoopbackHostHeader(req) {
  const host = firstHeader(req.headers.host);
  if (!host) return true;
  try {
    return isLoopbackHost(new URL(`http://${host}`).hostname);
  } catch {
    return false;
  }
}
function destroySocket(socket, response) {
  socket.write(response);
  socket.destroy();
}
/** Start the relay server for one extension-driver profile. */
async function startExtensionRelayServer(params) {
  const bridge = new ExtensionRelayBridge({ onStateChange: params.onStateChange });
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES,
  });
  const server = http.createServer((req, res) => {
    if (!hasLoopbackHostHeader(req)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if (!isAuthorized(req, params.token)) {
      res.writeHead(401, { "WWW-Authenticate": 'Basic realm="openclaw-extension-relay"' });
      res.end("Unauthorized");
      return;
    }
    const path = (req.url ?? "/").split("?")[0];
    if (req.method === "GET" && (path === "/json/version" || path === "/json/version/")) {
      if (!bridge.extensionConnected) {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              "OpenClaw Chrome extension is not connected. Install the extension and pair it with `openclaw browser extension pair`.",
          }),
        );
        return;
      }
      const identity = bridge.identity;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          Browser: identity?.browserVersion ?? "Chrome/unknown",
          "Protocol-Version": "1.3",
          "User-Agent": identity?.userAgent ?? "unknown",
          webSocketDebuggerUrl: `ws://127.0.0.1:${resolvedPort()}/cdp`,
        }),
      );
      return;
    }
    if (req.method === "GET" && (path === "/json" || path === "/json/list")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(bridge.sharedTabs()));
      return;
    }
    res.writeHead(404).end("Not found");
  });
  server.on("upgrade", (req, socket, head) => {
    const path = (req.url ?? "/").split("?")[0];
    if (!hasLoopbackHostHeader(req)) {
      destroySocket(socket, "HTTP/1.1 403 Forbidden\r\n\r\n");
      return;
    }
    if (!isAuthorized(req, params.token)) {
      destroySocket(socket, "HTTP/1.1 401 Unauthorized\r\n\r\n");
      return;
    }
    if (path === "/extension") {
      if (!isAllowedExtensionOrigin(req)) {
        destroySocket(socket, "HTTP/1.1 403 Forbidden\r\n\r\n");
        return;
      }
      wss.handleUpgrade(req, socket, head, (ws) => {
        attachExtensionWebSocket(bridge, ws);
        log$1.info("extension connected to relay");
      });
      return;
    }
    if (path === "/cdp") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        bindSocket(ws, bridge.attachCdpClientSocket(toBridgeSocket(ws)));
      });
      return;
    }
    destroySocket(socket, "HTTP/1.1 404 Not Found\r\n\r\n");
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(params.port, "127.0.0.1", () => resolve());
  });
  const resolvedPort = () => {
    const address = server.address();
    return typeof address === "object" && address ? address.port : params.port;
  };
  return {
    port: resolvedPort(),
    token: params.token,
    bridge,
    close: async () => {
      bridge.dispose();
      wss.close();
      await new Promise((resolve) => {
        server.close(() => resolve());
      });
    },
  };
}
function toBridgeSocket(ws) {
  return {
    send: (data) => {
      if (ws.readyState === ws.OPEN) ws.send(data);
    },
    close: (code, reason) => {
      try {
        ws.close(code, reason);
      } catch {}
    },
  };
}
/** Decode a ws frame (string | Buffer | Buffer[] | ArrayBuffer) to text. */
function decodeWsData(data) {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  return Buffer.from(data).toString("utf8");
}
function bindSocket(ws, handlers) {
  ws.on("message", (data) => {
    handlers.onMessage(decodeWsData(data));
  });
  ws.on("close", handlers.onClose);
  ws.on("error", (err) => {
    log$1.warn(`relay socket error: ${String(err)}`);
  });
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-lifecycle.ts
/**
 * Extension relay lifecycle: one relay server per extension-driver profile,
 * owned by the browser control runtime state.
 */
const log = createSubsystemLogger("browser").child("extension-relay");
const pendingRelayEnsures = /* @__PURE__ */ new WeakMap();
/** Human guidance for a relay without a paired/connected extension. */
const EXTENSION_PAIRING_HINT =
  "Install the OpenClaw Chrome extension, then run `openclaw browser extension pair` and paste the pairing string into the extension popup.";
function relays(state) {
  if (!state.extensionRelays) state.extensionRelays = /* @__PURE__ */ new Map();
  return state.extensionRelays;
}
/**
 * Start the relay server for one extension-driver profile, reconciling any
 * existing one. Idempotency is keyed on profile name, but the desired (port,
 * token) can drift when the host-local relay secret is rotated or the profile's
 * cdpPort changes — a stale relay would then authenticate the extension against
 * the old token or listen on the wrong port. When the desired config differs,
 * the old relay is closed and a fresh one bound.
 */
async function ensureExtensionRelayForProfile(state, profile) {
  for (;;) {
    if (!isBrowserRuntimeRunning(state)) throw new Error("Browser runtime is stopping");
    const { ensureExtensionRelayToken, readExtensionRelayToken } =
      await import("./relay-auth-DNuSazJy.js");
    const token = readExtensionRelayToken() ?? ensureExtensionRelayToken();
    if (state.resolved.extensionRelayToken !== token)
      state.resolved = {
        ...state.resolved,
        extensionRelayToken: token,
      };
    const desiredProfile = resolveProfile(state.resolved, profile.name);
    if (
      profile.driver !== "extension" ||
      desiredProfile?.driver !== "extension" ||
      desiredProfile.cdpPort !== profile.cdpPort
    )
      throw new Error(`Extension relay profile "${profile.name}" changed during startup.`);
    Object.assign(profile, desiredProfile);
    const runtime = getOrCreateProfileRuntime(state, desiredProfile);
    if (
      runtime.profile !== profile &&
      runtime.profile.driver === "extension" &&
      runtime.profile.cdpPort === desiredProfile.cdpPort
    )
      Object.assign(runtime.profile, desiredProfile);
    const pending = pendingRelayEnsures.get(runtime);
    if (pending) {
      if (pending.port === desiredProfile.cdpPort && pending.token === token)
        return await pending.promise;
      try {
        await pending.promise;
      } catch (err) {
        if (getProfileLifecycle(runtime).blockedReason) throw err;
      }
      continue;
    }
    const promise = ensureDesiredRelay({
      state,
      runtime,
      profile: desiredProfile,
      token,
    });
    const owned = {
      port: desiredProfile.cdpPort,
      token,
      promise,
    };
    pendingRelayEnsures.set(runtime, owned);
    try {
      return await promise;
    } finally {
      if (pendingRelayEnsures.get(runtime) === owned) pendingRelayEnsures.delete(runtime);
    }
  }
}
async function ensureDesiredRelay(params) {
  const { state, runtime, profile, token } = params;
  return await withProfileOperationLease({
    state,
    runtime,
    configRevision: getProfileLifecycle(runtime).configRevision,
    run: async (signal) => {
      const map = relays(state);
      const actor = getProfileLifecycle(runtime);
      const existing = map.get(profile.name);
      if (existing) {
        if (existing.port === profile.cdpPort && existing.token === token) return existing;
        actor.cleanupRelays.add(existing);
        await existing.close();
        actor.cleanupRelays.delete(existing);
        if (map.get(profile.name) === existing) map.delete(profile.name);
      }
      let handle;
      try {
        handle = await startExtensionRelayServer({
          port: profile.cdpPort,
          token,
        });
        actor.cleanupRelays.add(handle);
        signal.throwIfAborted();
        const currentProfile = resolveProfile(state.resolved, profile.name);
        if (
          state.profiles.get(profile.name) !== runtime ||
          currentProfile?.driver !== "extension" ||
          currentProfile.cdpUrl !== profile.cdpUrl ||
          state.resolved.extensionRelayToken !== token
        )
          throw new Error(`Extension relay profile "${profile.name}" changed during startup.`);
        map.set(profile.name, handle);
        actor.cleanupRelays.delete(handle);
        log.info(
          `extension relay for profile "${profile.name}" listening on 127.0.0.1:${handle.port}`,
        );
        return handle;
      } catch (err) {
        if (handle)
          try {
            await handle.close();
            actor.cleanupRelays.delete(handle);
          } catch (closeError) {
            actor.blockedReason = "extension relay cleanup failed";
            throw closeError;
          }
        throw err;
      }
    },
  });
}
/** Start relays for every extension-driver profile (control service startup). */
async function startConfiguredExtensionRelays(state, resolveProfileByName, onWarn) {
  for (const [name, profile] of Object.entries(state.resolved.profiles)) {
    if (profile.driver !== "extension") continue;
    const resolved = resolveProfileByName(name);
    if (!resolved) continue;
    try {
      await ensureExtensionRelayForProfile(state, resolved);
    } catch (err) {
      onWarn(`extension relay for profile "${name}" failed to start: ${String(err)}`);
    }
  }
}
/** Stop every running relay (runtime shutdown). */
async function stopExtensionRelays(state) {
  const map = state.extensionRelays;
  if (!map) return;
  let firstError;
  for (const [name, handle] of map)
    try {
      await handle.close();
      if (map.get(name) === handle) map.delete(name);
    } catch (err) {
      log.warn(`extension relay for profile "${name}" failed to stop: ${String(err)}`);
      firstError ??=
        err instanceof Error ? err : new Error("Extension relay cleanup failed.", { cause: err });
    }
  if (firstError) throw firstError;
}
//#endregion
export {
  EXTENSION_RELAY_MAX_PAYLOAD_BYTES as a,
  requestExtensionProtocolToken as c,
  stopExtensionRelays as i,
  ensureExtensionRelayForProfile as n,
  attachExtensionWebSocket as o,
  startConfiguredExtensionRelays as r,
  isAllowedExtensionOrigin as s,
  EXTENSION_PAIRING_HINT as t,
};
