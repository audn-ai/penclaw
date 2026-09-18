import { randomUUID } from "node:crypto";
import { r as setActiveNodeContext } from "./active-node-context-IT1PF0OW.js";
import "./node-commands-zATGYJg5.js";
import { n as logRejectedLargePayload } from "./diagnostic-payload-CIUwXnY0.js";
import {
  a as removeConnectedNodePluginTools,
  i as normalizeNodePluginToolDescriptors,
  o as replaceConnectedNodePluginTools,
  t as createRegisteredNodePluginToolDescriptorMap,
} from "./node-plugin-tool-snapshot-BelBVdcP.js";
import { i as NODE_SKILL_NAME_RE } from "./node-skill-constraints-DLpuutsb.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  a as addTimerTimeoutGraceMs,
  j as resolveTimerTimeoutMs,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { i as MAX_BUFFERED_BYTES } from "./server-constants-DKuFNbQH.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/gateway/node-registry.invoke-stream.ts
const MAX_PENDING_PROGRESS_CHUNKS = 128;
const MAX_INVOKE_INPUT_BYTES = 16 * 1024;
var NodeInvokeStreamController = class {
  constructor(options) {
    this.options = options;
  }
  sendInput(invokeId, payload) {
    const pending = this.options.pendingInvokes.get(invokeId);
    if (!pending) throw new Error("node invoke is not pending");
    const payloadJSON = JSON.stringify(payload);
    if (payloadJSON === void 0) throw new Error("node invoke input is not serializable");
    if (Buffer.byteLength(payloadJSON, "utf8") > MAX_INVOKE_INPUT_BYTES)
      throw new Error("node invoke input exceeds 16 KiB");
    if (!this.options.isConnectionActive(pending))
      throw new Error("node invoke connection is unavailable");
    if (!this.options.sendInput(invokeId, pending, pending.nextInputSeq, payloadJSON))
      throw new Error("failed to send node invoke input");
    pending.nextInputSeq += 1;
  }
  handleDisconnect(connId) {
    for (const [id, pending] of this.options.pendingInvokes) {
      if (pending.connId !== connId) continue;
      this.clearTimers(pending);
      this.options.disconnectPending(pending);
      this.options.pendingInvokes.delete(id);
    }
  }
  handleResult(params) {
    const pending = this.options.pendingInvokes.get(params.id);
    if (!pending || pending.nodeId !== params.nodeId || pending.connId !== params.connId)
      return false;
    this.clearTimers(pending);
    this.options.pendingInvokes.delete(params.id);
    if (!params.ok) this.options.onFailedResult(pending);
    pending.resolve({
      ok: params.ok,
      payload: params.payload,
      payloadJSON: params.payloadJSON ?? null,
      error: params.error ?? null,
    });
    return true;
  }
  armPending(params) {
    if (params.timeoutMs > 0)
      params.pending.hardTimer = setTimeout(() => {
        this.sendInvokeCancel(params.requestId, params.pending);
        this.clearTimers(params.pending);
        this.options.pendingInvokes.delete(params.requestId);
        params.pending.resolve({
          ok: false,
          error: {
            code: "TIMEOUT",
            message: "node invoke timed out",
          },
        });
      }, params.timeoutMs);
    if (params.pending.onProgress && params.idleTimeoutMs > 0)
      params.pending.idleTimeoutMs = params.idleTimeoutMs;
    this.options.pendingInvokes.set(params.requestId, params.pending);
    if (params.signal) {
      const onAbort = () => {
        if (this.options.pendingInvokes.get(params.requestId) !== params.pending) return;
        this.sendInvokeCancel(params.requestId, params.pending);
        this.clearTimers(params.pending);
        this.options.pendingInvokes.delete(params.requestId);
        params.pending.resolve({
          ok: false,
          error: {
            code: "ABORTED",
            message: "node invoke cancelled",
          },
        });
      };
      params.signal.addEventListener("abort", onAbort, { once: true });
      params.pending.removeAbortListener = () =>
        params.signal?.removeEventListener("abort", onAbort);
      if (params.signal.aborted) onAbort();
    }
  }
  handleProgress(params) {
    const pending = this.options.pendingInvokes.get(params.invokeId);
    if (
      !pending ||
      pending.nodeId !== params.nodeId ||
      pending.connId !== params.connId ||
      !pending.onProgress ||
      params.seq < pending.nextProgressSeq
    )
      return false;
    if (params.seq > pending.nextProgressSeq) {
      if (pending.progressChunks.has(params.seq)) return false;
      if (pending.progressChunks.size >= MAX_PENDING_PROGRESS_CHUNKS) return false;
    }
    pending.progressChunks.set(params.seq, params.chunk);
    this.resetIdleTimer(params.invokeId, pending);
    while (true) {
      const chunk = pending.progressChunks.get(pending.nextProgressSeq);
      if (chunk === void 0) break;
      pending.progressChunks.delete(pending.nextProgressSeq);
      pending.nextProgressSeq += 1;
      try {
        pending.onProgress(chunk);
      } catch (error) {
        this.sendInvokeCancel(params.invokeId, pending);
        this.clearTimers(pending);
        this.options.pendingInvokes.delete(params.invokeId);
        pending.reject(error instanceof Error ? error : new Error(String(error)));
        break;
      }
      if (this.options.pendingInvokes.get(params.invokeId) !== pending) {
        pending.progressChunks.clear();
        break;
      }
    }
    return true;
  }
  clearTimers(pending) {
    if (pending.hardTimer) clearTimeout(pending.hardTimer);
    if (pending.idleTimer) clearTimeout(pending.idleTimer);
    pending.removeAbortListener?.();
    pending.removeAbortListener = void 0;
  }
  createIdleTimer(requestId, pending) {
    return setTimeout(() => {
      if (this.options.pendingInvokes.get(requestId) !== pending) return;
      this.sendInvokeCancel(requestId, pending);
      this.clearTimers(pending);
      this.options.pendingInvokes.delete(requestId);
      pending.resolve({
        ok: false,
        error: {
          code: "IDLE_TIMEOUT",
          message: "node invoke produced no progress",
        },
      });
    }, pending.idleTimeoutMs);
  }
  resetIdleTimer(requestId, pending) {
    if (!pending.idleTimeoutMs) return;
    if (pending.idleTimer) clearTimeout(pending.idleTimer);
    pending.idleTimer = this.createIdleTimer(requestId, pending);
  }
  sendInvokeCancel(requestId, pending) {
    if (!pending.onProgress) return;
    this.options.sendCancel(requestId, pending);
  }
};
//#endregion
//#region src/gateway/node-registry.system-run.ts
/** Normalize system.run timeout values, preserving null for no expiry. */
function normalizeSystemRunTimeoutMs(value) {
  if (value === void 0) return;
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const timeoutMs = Math.trunc(value);
  return timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 1) : null;
}
//#endregion
//#region src/gateway/node-skill-descriptors.ts
const log = createSubsystemLogger("gateway/node-skills");
function normalizeNodeSkillDescriptors(params) {
  if (params.enabled === false) return [];
  const normalized = [];
  const seen = /* @__PURE__ */ new Set();
  let totalBytes = 0;
  let droppedCount = 0;
  for (const skill of params.skills ?? []) {
    const name = skill.name.trim();
    const description = skill.description.trim();
    const contentBytes = Buffer.byteLength(skill.content, "utf8");
    if (
      !NODE_SKILL_NAME_RE.test(name) ||
      !description ||
      description.length > 1024 ||
      !skill.content ||
      contentBytes > 65536 ||
      seen.has(name) ||
      normalized.length >= 64 ||
      totalBytes + contentBytes > 524288
    ) {
      droppedCount += 1;
      continue;
    }
    seen.add(name);
    totalBytes += contentBytes;
    normalized.push({
      name,
      description,
      content: skill.content,
    });
  }
  if (droppedCount > 0)
    log.warn(
      `node ${params.nodeId} published ${params.skills?.length ?? 0} skill descriptors; dropped ${droppedCount} invalid or over-limit descriptors`,
    );
  return normalized.toSorted((left, right) => left.name.localeCompare(right.name, "en"));
}
//#endregion
//#region src/gateway/node-registry.ts
/** Normalize optional string-ish websocket fields. */
function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}
/** Extract system.run event auth metadata from invoke params. */
function resolvePendingSystemRunEvent(params) {
  if (params.command !== "system.run" || !params.params || typeof params.params !== "object")
    return;
  const obj = params.params;
  const runId = normalizeString(obj.runId);
  if (!runId) return;
  const timeoutMs = normalizeSystemRunTimeoutMs(obj.timeoutMs);
  const sessionKey = normalizeString(obj.sessionKey);
  return {
    runId,
    ...(sessionKey ? { sessionKey } : {}),
    ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
  };
}
/** Keep node execution and Gateway authorization on the same canonical system.run fields. */
function normalizeSystemRunInvokeParams(params) {
  if (
    params.command !== "system.run" ||
    !params.params ||
    typeof params.params !== "object" ||
    Array.isArray(params.params)
  )
    return params.params;
  const obj = params.params;
  const normalized = {
    ...obj,
    runId: normalizeString(obj.runId) || randomUUID(),
  };
  const timeoutMs = normalizeSystemRunTimeoutMs(obj.timeoutMs);
  if (timeoutMs === void 0) delete normalized.timeoutMs;
  else normalized.timeoutMs = timeoutMs;
  return normalized;
}
const SERIALIZED_EVENT_PAYLOAD = Symbol("openclaw.serializedEventPayload");
const AUTHORIZED_SYSTEM_RUN_EVENT_GRACE_MS = 300 * 1e3;
const WEBSOCKET_OPEN_READY_STATE = 1;
const SLOW_CONSUMER_CLOSE_CODE = 1008;
/** Serialize an event payload once so fanout can reuse the same JSON string. */
function serializeEventPayload(payload) {
  if (payload === void 0) return null;
  const json = JSON.stringify(payload);
  return typeof json === "string"
    ? {
        json,
        [SERIALIZED_EVENT_PAYLOAD]: true,
      }
    : null;
}
/** Narrow values created by serializeEventPayload. */
function isSerializedEventPayload(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    value[SERIALIZED_EVENT_PAYLOAD] === true &&
    typeof value.json === "string"
  );
}
/** Registry of currently connected Gateway nodes. */
var NodeRegistry = class {
  constructor(options = {}) {
    this.options = options;
    this.nodesById = /* @__PURE__ */ new Map();
    this.nodesByConn = /* @__PURE__ */ new Map();
    this.eventTransportsByConn = /* @__PURE__ */ new Map();
    this.pendingInvokes = /* @__PURE__ */ new Map();
    this.invokeStreams = new NodeInvokeStreamController({
      pendingInvokes: this.pendingInvokes,
      sendCancel: (requestId, pending) => {
        const node = this.nodesById.get(pending.nodeId);
        if (!node || node.connId !== pending.connId) return;
        this.sendEventToSession(node, "node.invoke.cancel", {
          invokeId: requestId,
          nodeId: pending.nodeId,
        });
      },
      isConnectionActive: (pending) =>
        this.nodesById.get(pending.nodeId)?.connId === pending.connId,
      sendInput: (invokeId, pending, seq, payloadJSON) => {
        const node = this.nodesById.get(pending.nodeId);
        return node
          ? this.sendEventToSession(node, "node.invoke.input", {
              id: invokeId,
              nodeId: pending.nodeId,
              seq,
              payloadJSON,
            })
          : false;
      },
      onFailedResult: (pending) => {
        if (pending.systemRunEvent)
          this.forgetAuthorizedSystemRunEvent({
            nodeId: pending.nodeId,
            connId: pending.connId,
            ...pending.systemRunEvent,
          });
      },
      disconnectPending: (pending) => {
        if (pending.command === "mcp.tools.call.v1")
          pending.resolve({
            ok: false,
            error: {
              code: "MCP_SERVER_UNAVAILABLE",
              message: "node host disconnected during MCP tool call",
            },
          });
        else pending.reject(/* @__PURE__ */ new Error(`node disconnected (${pending.command})`));
      },
    });
    this.authorizedSystemRunEvents = /* @__PURE__ */ new Map();
  }
  normalizePluginToolDescriptors(params) {
    return normalizeNodePluginToolDescriptors({
      ...params,
      enabled: this.options.nodePluginToolsEnabled,
      registeredDescriptors: createRegisteredNodePluginToolDescriptorMap(
        this.options.listRegisteredNodePluginToolCommands?.(),
      ),
    });
  }
  replaceEffectiveNodePluginTools(node) {
    const normalized = this.normalizePluginToolDescriptors({
      nodeId: node.nodeId,
      tools: node.declaredNodePluginTools,
      allowedCommands: node.commands,
    });
    node.nodePluginTools = normalized.map((entry) => entry.descriptor);
    replaceConnectedNodePluginTools({
      nodeId: node.nodeId,
      displayName: node.displayName,
      platform: node.platform,
      remoteIp: node.remoteIp,
      tools: normalized,
    });
  }
  refreshNodePluginTools() {
    for (const node of this.nodesById.values()) this.replaceEffectiveNodePluginTools(node);
  }
  /** Register a websocket client as the current connection for its node id. */
  register(client, opts) {
    return this.registerSession(client, opts);
  }
  /** Register a node whose events are delivered by an HTTP polling transport. */
  registerTransport(client, opts, transport) {
    return this.registerSession(client, opts, transport);
  }
  registerSession(client, opts, transport) {
    const connect = client.connect;
    const nodeId = connect.device?.id ?? connect.client.id;
    const caps = Array.isArray(connect.caps) ? connect.caps : [];
    const declaredCaps = Array.isArray(connect.declaredCaps) ? (connect.declaredCaps ?? []) : caps;
    const commands = Array.isArray(connect.commands) ? (connect.commands ?? []) : [];
    const declaredCommands = Array.isArray(connect.declaredCommands)
      ? (connect.declaredCommands ?? [])
      : commands;
    const sessionCapsCeiling = Array.isArray(connect.sessionCapsCeiling)
      ? (connect.sessionCapsCeiling ?? [])
      : declaredCaps;
    const sessionCommandsCeiling = Array.isArray(connect.sessionCommandsCeiling)
      ? (connect.sessionCommandsCeiling ?? [])
      : declaredCommands;
    const permissions =
      typeof connect.permissions === "object" ? (connect.permissions ?? void 0) : void 0;
    const declaredPermissions =
      typeof connect.declaredPermissions === "object"
        ? (connect.declaredPermissions ?? void 0)
        : permissions;
    const pathEnv = typeof connect.pathEnv === "string" ? connect.pathEnv : void 0;
    const session = {
      nodeId,
      connId: client.connId,
      client,
      clientId: connect.client.id,
      clientMode: connect.client.mode,
      displayName: connect.client.displayName,
      platform: connect.client.platform,
      version: connect.client.version,
      coreVersion: connect.coreVersion,
      uiVersion: connect.uiVersion,
      deviceFamily: connect.client.deviceFamily,
      modelIdentifier: connect.client.modelIdentifier,
      remoteIp: opts.remoteIp,
      declaredCaps,
      sessionCapsCeiling,
      caps,
      declaredCommands,
      sessionCommandsCeiling,
      commands,
      declaredNodePluginTools: [],
      nodePluginTools: [],
      nodeSkills: [],
      declaredPermissions,
      permissions,
      pathEnv,
      connectedAtMs: Date.now(),
    };
    const replacesPresence = this.nodesById.get(nodeId)?.lastActiveAtMs !== void 0;
    this.nodesById.set(nodeId, session);
    this.nodesByConn.set(client.connId, nodeId);
    if (transport) this.eventTransportsByConn.set(client.connId, transport);
    else this.eventTransportsByConn.delete(client.connId);
    replaceConnectedNodePluginTools({
      nodeId,
      displayName: session.displayName,
      platform: session.platform,
      remoteIp: session.remoteIp,
      tools: [],
    });
    if (replacesPresence) this.publishActiveNodeContext();
    return session;
  }
  /** Unregister one connection and reject invokes tied to that connection. */
  unregister(connId) {
    const nodeId = this.nodesByConn.get(connId);
    if (!nodeId) return null;
    this.nodesByConn.delete(connId);
    this.eventTransportsByConn.delete(connId);
    const unregistersCurrentNode = this.nodesById.get(nodeId)?.connId === connId;
    if (unregistersCurrentNode) {
      const hadPresence = this.nodesById.get(nodeId)?.lastActiveAtMs !== void 0;
      this.nodesById.delete(nodeId);
      removeConnectedNodePluginTools(nodeId);
      if (hadPresence) this.publishActiveNodeContext();
    }
    this.invokeStreams.handleDisconnect(connId);
    for (const [key, event] of this.authorizedSystemRunEvents)
      if (event.connId === connId) this.authorizedSystemRunEvents.delete(key);
    return unregistersCurrentNode ? nodeId : null;
  }
  /** List connected node sessions. */
  listConnected() {
    return [...this.nodesById.values()];
  }
  /** Return a connected node session by node id. */
  get(nodeId) {
    return this.nodesById.get(nodeId);
  }
  /** Updates recent input activity for the exact authenticated node connection. */
  updatePresenceActivity(params) {
    const node = this.nodesById.get(params.nodeId);
    if (
      !node ||
      !params.connId ||
      node.connId !== params.connId ||
      node.permissions?.accessibility !== true
    )
      return null;
    const observedAtMs = params.observedAtMs ?? Date.now();
    const lastActiveAtMs = Math.max(0, observedAtMs - params.idleSeconds * 1e3);
    if (params.saturated !== true || node.lastActiveAtMs === void 0)
      node.lastActiveAtMs = Math.max(node.lastActiveAtMs ?? 0, lastActiveAtMs);
    node.presenceUpdatedAtMs = observedAtMs;
    this.publishActiveNodeContext();
    return node;
  }
  /** Returns the connected node with the freshest reported local input. */
  getActiveNode() {
    let active;
    for (const node of this.nodesById.values()) {
      if (node.lastActiveAtMs === void 0) continue;
      if (
        !active ||
        node.lastActiveAtMs > (active.lastActiveAtMs ?? 0) ||
        (node.lastActiveAtMs === active.lastActiveAtMs &&
          (node.presenceUpdatedAtMs ?? 0) > (active.presenceUpdatedAtMs ?? 0))
      )
        active = node;
    }
    return active;
  }
  publishActiveNodeContext() {
    const active = this.getActiveNode();
    setActiveNodeContext(active ? { nodeId: active.nodeId } : null);
  }
  /** Probe websocket liveness with ping/pong when the socket supports it. */
  async checkConnectivity(nodeId, timeoutMs = 2e3) {
    const node = this.nodesById.get(nodeId);
    if (!node)
      return {
        ok: false,
        error: {
          code: "NOT_CONNECTED",
          message: "node not connected",
        },
      };
    const eventTransport = this.eventTransportsByConn.get(node.connId);
    if (eventTransport) return eventTransport.checkConnectivity?.(timeoutMs) ?? { ok: true };
    const socket = node.client.socket;
    if (socket.readyState !== WEBSOCKET_OPEN_READY_STATE)
      return {
        ok: false,
        error: {
          code: "NOT_CONNECTED",
          message: "node socket not open",
        },
      };
    if (typeof socket.ping !== "function" || typeof socket.once !== "function") return { ok: true };
    const timeout = Math.max(1, Math.trunc(timeoutMs));
    return await new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        socket.off?.("pong", onPong);
        socket.off?.("close", onClose);
        socket.off?.("error", onError);
        socket.removeListener?.("pong", onPong);
        socket.removeListener?.("close", onClose);
        socket.removeListener?.("error", onError);
      };
      const finish = (result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanup();
        resolve(result);
      };
      const onPong = () => finish({ ok: true });
      const onClose = () =>
        finish({
          ok: false,
          error: {
            code: "NOT_CONNECTED",
            message: "node socket closed during connectivity probe",
          },
        });
      const onError = (err) =>
        finish({
          ok: false,
          error: {
            code: "UNAVAILABLE",
            message:
              err instanceof Error ? err.message : "node socket error during connectivity probe",
          },
        });
      const timer = setTimeout(
        () =>
          finish({
            ok: false,
            error: {
              code: "TIMEOUT",
              message: "node connectivity probe timed out",
            },
          }),
        timeout,
      );
      socket.once?.("pong", onPong);
      socket.once?.("close", onClose);
      socket.once?.("error", onError);
      try {
        socket.ping?.(void 0, false, (err) => {
          if (err)
            finish({
              ok: false,
              error: {
                code: "UNAVAILABLE",
                message: err.message,
              },
            });
        });
      } catch (err) {
        finish({
          ok: false,
          error: {
            code: "UNAVAILABLE",
            message: err instanceof Error ? err.message : "node ping failed",
          },
        });
      }
    });
  }
  updateNodePluginTools(nodeId, connId, tools) {
    const node = this.nodesById.get(nodeId);
    if (!node || node.connId !== connId) return null;
    node.declaredNodePluginTools = this.options.nodePluginToolsEnabled === false ? [] : [...tools];
    this.replaceEffectiveNodePluginTools(node);
    return node;
  }
  updateNodeSkills(nodeId, connId, skills) {
    const node = this.nodesById.get(nodeId);
    if (!node || node.connId !== connId) return null;
    node.nodeSkills = normalizeNodeSkillDescriptors({
      nodeId,
      skills,
      enabled: this.options.nodeSkillsEnabled,
    });
    return node;
  }
  updateSurface(nodeId, surface) {
    const node = this.nodesById.get(nodeId);
    if (!node) return null;
    const sessionCommandsCeiling = new Set(node.sessionCommandsCeiling ?? node.declaredCommands);
    const nextCommands = surface.commands.filter((command) => sessionCommandsCeiling.has(command));
    node.commands = nextCommands;
    node.client.connect.commands = nextCommands;
    this.replaceEffectiveNodePluginTools(node);
    if ("caps" in surface) {
      const sessionCapsCeiling = new Set(node.sessionCapsCeiling ?? node.declaredCaps);
      const nextCaps = (surface.caps ?? []).filter((capability) =>
        sessionCapsCeiling.has(capability),
      );
      node.caps = nextCaps;
      node.client.connect.caps = nextCaps;
    }
    if ("permissions" in surface) {
      if (surface.permissions === void 0) {
        node.permissions = void 0;
        node.client.connect.permissions = void 0;
        this.clearPresenceIfAccessibilityUnavailable(node);
        return node;
      }
      const declared = node.declaredPermissions ?? {};
      const nextEntries = [];
      for (const [key, declaredValue] of Object.entries(declared)) {
        if (!declaredValue) {
          nextEntries.push([key, false]);
          continue;
        }
        const approvedValue = surface.permissions?.[key];
        if (approvedValue) {
          nextEntries.push([key, true]);
          continue;
        }
        if (approvedValue !== void 0) nextEntries.push([key, false]);
      }
      const nextPermissions = nextEntries.length > 0 ? Object.fromEntries(nextEntries) : void 0;
      node.permissions = nextPermissions;
      node.client.connect.permissions = nextPermissions;
      this.clearPresenceIfAccessibilityUnavailable(node);
    }
    return node;
  }
  clearPresenceIfAccessibilityUnavailable(node) {
    if (node.permissions?.accessibility === true || node.lastActiveAtMs === void 0) return;
    node.lastActiveAtMs = void 0;
    node.presenceUpdatedAtMs = void 0;
    this.publishActiveNodeContext();
  }
  async invoke(params) {
    if (params.signal?.aborted)
      return {
        ok: false,
        error: {
          code: "ABORTED",
          message: "node invoke cancelled",
        },
      };
    const node = this.nodesById.get(params.nodeId);
    if (!node)
      return {
        ok: false,
        error: {
          code: "NOT_CONNECTED",
          message: "node not connected",
        },
      };
    if (params.expectedConnId && node.connId !== params.expectedConnId)
      return {
        ok: false,
        error: {
          code: "ROUTE_CHANGED",
          message: "node connection changed before dispatch",
        },
      };
    const requestId = randomUUID();
    const invokeParams = normalizeSystemRunInvokeParams({
      command: params.command,
      params: params.params,
    });
    const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 3e4, 0);
    const payload = {
      id: requestId,
      nodeId: params.nodeId,
      command: params.command,
      paramsJSON:
        "params" in params && invokeParams !== void 0 ? JSON.stringify(invokeParams) : null,
      timeoutMs,
      idempotencyKey: params.idempotencyKey,
    };
    const systemRunEvent = resolvePendingSystemRunEvent({
      command: params.command,
      params: invokeParams,
    });
    const result = new Promise((resolve, reject) => {
      const pending = {
        nodeId: params.nodeId,
        connId: node.connId,
        command: params.command,
        systemRunEvent,
        resolve,
        reject,
        nextProgressSeq: 0,
        progressChunks: /* @__PURE__ */ new Map(),
        nextInputSeq: 0,
        ...(params.onProgress ? { onProgress: params.onProgress } : {}),
      };
      const idleTimeoutMs = resolveTimerTimeoutMs(params.idleTimeoutMs, 0, 0);
      this.invokeStreams.armPending({
        requestId,
        pending,
        timeoutMs,
        idleTimeoutMs,
        ...(params.signal ? { signal: params.signal } : {}),
      });
    });
    if (!this.pendingInvokes.has(requestId)) return await result;
    if (!this.sendEventToSession(node, "node.invoke.request", payload)) {
      const pending = this.pendingInvokes.get(requestId);
      if (pending) {
        this.invokeStreams.clearTimers(pending);
        this.pendingInvokes.delete(requestId);
        pending.resolve({
          ok: false,
          error: {
            code: "UNAVAILABLE",
            message: "failed to send invoke to node",
          },
        });
      }
      return await result;
    }
    if (systemRunEvent)
      this.rememberAuthorizedSystemRunEvent({
        nodeId: params.nodeId,
        connId: node.connId,
        ...systemRunEvent,
      });
    params.onInvokeId?.(requestId);
    return await result;
  }
  /** Send one ordered input frame to a pending streaming invoke. */
  sendInvokeInput(invokeId, payload) {
    this.invokeStreams.sendInput(invokeId, payload);
  }
  handleInvokeProgress(params) {
    return this.invokeStreams.handleProgress(params);
  }
  /** Authorize an inbound system.run event against a recently issued node invoke. */
  authorizeSystemRunEvent(params) {
    if (!params.connId || !params.sessionKey) return false;
    const connId = params.connId;
    this.pruneAuthorizedSystemRunEvents();
    let match;
    if (params.runId) {
      match = this.matchAuthorizedSystemRunEvent({
        nodeId: params.nodeId,
        connId,
        runId: params.runId,
        sessionKey: params.sessionKey,
      });
      if (
        !match &&
        this.allowsLegacyMacRunIdFallback({
          nodeId: params.nodeId,
          connId,
        })
      )
        match = this.matchSingleAuthorizedSystemRunEvent({
          nodeId: params.nodeId,
          connId,
          sessionKey: params.sessionKey,
        });
    } else {
      if (
        !this.allowsLegacyMacRunIdFallback({
          nodeId: params.nodeId,
          connId,
        })
      )
        return false;
      match = this.matchSingleAuthorizedSystemRunEvent({
        nodeId: params.nodeId,
        connId,
        sessionKey: params.sessionKey,
      });
    }
    if (!match) return false;
    if (params.terminal) this.authorizedSystemRunEvents.delete(match.key);
    return true;
  }
  rememberAuthorizedSystemRunEvent(event) {
    this.pruneAuthorizedSystemRunEvents();
    const authorized = {
      ...event,
      expiresAtMs: this.authorizedSystemRunEventExpiresAt(event.timeoutMs),
    };
    this.authorizedSystemRunEvents.set(this.authorizedSystemRunEventKey(authorized), authorized);
  }
  forgetAuthorizedSystemRunEvent(event) {
    this.authorizedSystemRunEvents.delete(this.authorizedSystemRunEventKey(event));
  }
  authorizedSystemRunEventExpiresAt(timeoutMs) {
    if (typeof timeoutMs !== "number") return null;
    return (
      resolveExpiresAtMsFromDurationMs(
        addTimerTimeoutGraceMs(timeoutMs, AUTHORIZED_SYSTEM_RUN_EVENT_GRACE_MS),
      ) ?? 0
    );
  }
  matchAuthorizedSystemRunEvent(params) {
    for (const [key, event] of this.authorizedSystemRunEvents)
      if (
        event.nodeId === params.nodeId &&
        event.connId === params.connId &&
        event.runId === params.runId &&
        this.authorizedSystemRunSessionMatches(event, params.sessionKey)
      )
        return {
          key,
          event,
        };
    return null;
  }
  matchSingleAuthorizedSystemRunEvent(params) {
    let match = null;
    for (const [key, event] of this.authorizedSystemRunEvents) {
      if (
        event.nodeId !== params.nodeId ||
        event.connId !== params.connId ||
        !this.authorizedSystemRunSessionMatches(event, params.sessionKey)
      )
        continue;
      if (match) return null;
      match = {
        key,
        event,
      };
    }
    return match;
  }
  authorizedSystemRunSessionMatches(event, sessionKey) {
    return !event.sessionKey || event.sessionKey === sessionKey;
  }
  allowsLegacyMacRunIdFallback(params) {
    const node = this.nodesById.get(params.nodeId);
    return (
      node?.connId === params.connId &&
      node.clientId === "openclaw-macos" &&
      node.platform === "darwin"
    );
  }
  pruneAuthorizedSystemRunEvents(now = Date.now()) {
    for (const [key, event] of this.authorizedSystemRunEvents)
      if (event.expiresAtMs !== null && !isFutureDateTimestampMs(event.expiresAtMs, { nowMs: now }))
        this.authorizedSystemRunEvents.delete(key);
  }
  authorizedSystemRunEventKey(params) {
    return `${params.nodeId}\0${params.connId}\0${params.sessionKey ?? ""}\0${params.runId}`;
  }
  handleInvokeResult(params) {
    return this.invokeStreams.handleResult(params);
  }
  sendEvent(nodeId, event, payload) {
    const node = this.nodesById.get(nodeId);
    if (!node) return false;
    return this.sendEventToSession(node, event, payload);
  }
  sendEventRaw(nodeId, event, payloadJSON) {
    const node = this.nodesById.get(nodeId);
    if (!node) return false;
    return this.sendEventRawInternal(node, event, payloadJSON);
  }
  sendEventInternal(node, event, payload) {
    const eventTransport = this.eventTransportsByConn.get(node.connId);
    if (eventTransport) return eventTransport.send(event, payload);
    if (this.rejectSlowNodeSocket(node)) return false;
    try {
      node.client.socket.send(
        JSON.stringify({
          type: "event",
          event,
          payload,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }
  sendEventRawInternal(node, event, payloadJSON) {
    if (payloadJSON !== null && payloadJSON !== void 0 && !isSerializedEventPayload(payloadJSON))
      return false;
    const eventTransport = this.eventTransportsByConn.get(node.connId);
    if (eventTransport) return eventTransport.sendRaw(event, payloadJSON);
    if (this.rejectSlowNodeSocket(node)) return false;
    try {
      const payloadFragment = payloadJSON ? `,"payload":${payloadJSON.json}` : "";
      node.client.socket.send(
        `{"type":"event","event":${JSON.stringify(event)}${payloadFragment}}`,
      );
      return true;
    } catch {
      return false;
    }
  }
  sendEventToSession(node, event, payload) {
    return this.sendEventInternal(node, event, payload);
  }
  rejectSlowNodeSocket(node) {
    if (!(node.client.socket.bufferedAmount > 52428800)) return false;
    logRejectedLargePayload({
      surface: "gateway.ws.outbound_buffer",
      bytes: node.client.socket.bufferedAmount,
      limitBytes: MAX_BUFFERED_BYTES,
      reason: "ws_send_buffer_close",
    });
    try {
      node.client.socket.close(SLOW_CONSUMER_CLOSE_CODE, "slow consumer");
    } catch {}
    return true;
  }
};
//#endregion
export { serializeEventPayload as n, NodeRegistry as t };
