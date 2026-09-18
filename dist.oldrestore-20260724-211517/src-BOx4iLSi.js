import { randomUUID } from "node:crypto";
import { WebSocket } from "ws";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import {
  f as readPairingConnectErrorDetails,
  l as readConnectErrorDetailCode,
  s as formatConnectErrorMessage,
  t as ConnectErrorDetailCodes,
  u as readConnectErrorRecoveryAdvice,
} from "./connect-error-details-BxqBqDDT.js";
import "./version-CwNT1gaY.js";
import { n as buildDeviceAuthPayloadV3 } from "./device-auth-na9vtJo1.js";
import {
  f as isLoopbackIpAddress,
  g as parseCanonicalIpAddress,
  h as normalizeIpAddress,
} from "./ip-CyyRxPli.js";
import { s as sleepWithAbort, t as RetrySupervisor } from "./src-Dqmh2693.js";
import { a as resolveGatewayStartupRetryAfterMs } from "./startup-unavailable-CRTM-3cy.js";
import {
  i as resolveConnectChallengeTimeoutMs,
  s as resolveSafeTimeoutDelayMs,
} from "./timeouts-Dewo7BbT.js";
//#region packages/gateway-client/src/connect-auth.ts
function normalized(value) {
  return typeof value === "string" ? value.trim() || void 0 : void 0;
}
function selectGatewayConnectAuth(params) {
  const authToken = normalized(params.token);
  const bootstrapToken = normalized(params.bootstrapToken);
  const explicitDeviceToken = normalized(params.deviceToken);
  const authPassword = normalized(params.password);
  const storedToken = normalized(params.storedToken);
  const stored = {
    storedToken,
    storedScopes: params.storedScopes,
  };
  if (params.preferBootstrapToken && bootstrapToken)
    return {
      authBootstrapToken: bootstrapToken,
      authPassword,
      ...stored,
    };
  const useRetryToken =
    params.pendingDeviceTokenRetry === true &&
    !explicitDeviceToken &&
    Boolean(authToken && storedToken && params.trustedDeviceTokenRetry);
  const resolvedDeviceToken =
    explicitDeviceToken ??
    (useRetryToken || (!(authToken || authPassword) && (!bootstrapToken || storedToken))
      ? storedToken
      : void 0);
  const usingStoredDeviceToken =
    Boolean(resolvedDeviceToken && !explicitDeviceToken && storedToken) &&
    resolvedDeviceToken === storedToken;
  const selectedToken = authToken ?? resolvedDeviceToken;
  const authBootstrapToken =
    !authToken && !resolvedDeviceToken && !authPassword ? bootstrapToken : void 0;
  return {
    authToken: selectedToken,
    authBootstrapToken,
    authDeviceToken: useRetryToken ? storedToken : void 0,
    authPassword,
    authApprovalRuntimeToken: normalized(params.approvalRuntimeToken),
    authAgentRuntimeIdentityToken: normalized(params.agentRuntimeIdentityToken),
    signatureToken: selectedToken ?? authBootstrapToken,
    resolvedDeviceToken,
    usingStoredDeviceToken,
    ...stored,
  };
}
function buildGatewayConnectAuth(selected) {
  const auth = {
    token: selected.authToken,
    bootstrapToken: selected.authBootstrapToken,
    deviceToken: selected.authDeviceToken ?? selected.resolvedDeviceToken,
    password: selected.authPassword,
    approvalRuntimeToken: selected.authApprovalRuntimeToken,
    agentRuntimeIdentityToken: selected.authAgentRuntimeIdentityToken,
  };
  return Object.values(auth).some(Boolean) ? auth : void 0;
}
function resolveGatewayConnectScopes(params) {
  return (
    params.requestedScopes ??
    (params.usingStoredDeviceToken && params.storedScopes?.length
      ? params.storedScopes
      : [...params.defaultScopes])
  );
}
function shouldRetryGatewayWithDeviceToken(params) {
  if (
    params.retryBudgetUsed ||
    params.currentDeviceToken ||
    !params.explicitToken ||
    !params.storedToken ||
    !params.trustedEndpoint
  )
    return false;
  const advice = readConnectErrorRecoveryAdvice(params.errorDetails);
  return (
    params.canRetryWithDeviceTokenHint === true ||
    advice.canRetryWithDeviceToken === true ||
    advice.recommendedNextStep === "retry_with_device_token" ||
    readConnectErrorDetailCode(params.errorDetails) === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH
  );
}
//#endregion
//#region packages/gateway-protocol/src/frame-guards.ts
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
function isNonNegativeInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isGatewayErrorShape(value) {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.code) || !isNonEmptyString(value.message)) return false;
  if (value.retryable !== void 0 && typeof value.retryable !== "boolean") return false;
  return value.retryAfterMs === void 0 || isNonNegativeInteger(value.retryAfterMs);
}
function isGatewayEventFrame(value) {
  if (!isRecord(value) || value.type !== "event" || !isNonEmptyString(value.event)) return false;
  return value.seq === void 0 || isNonNegativeInteger(value.seq);
}
function isGatewayResponseFrame(value) {
  if (
    !isRecord(value) ||
    value.type !== "res" ||
    !isNonEmptyString(value.id) ||
    typeof value.ok !== "boolean"
  )
    return false;
  return value.error === void 0 || isGatewayErrorShape(value.error);
}
//#endregion
//#region packages/gateway-client/src/protocol-client.ts
var GatewayProtocolRequestError = class extends Error {
  constructor(error) {
    super(error.message ?? "request failed");
    this.name = "GatewayProtocolRequestError";
    this.code = error.code ?? "UNAVAILABLE";
    this.gatewayCode = this.code;
    this.details = error.details;
    this.retryable = error.retryable === true;
    this.retryAfterMs = error.retryAfterMs;
  }
};
/**
 * Browser-safe gateway wire client. Environment adapters own transport and auth
 * policy; this class owns the single socket/handshake/reconnect/frame state machine.
 */
var GatewayProtocolClient = class {
  constructor(opts) {
    this.opts = opts;
    this.socket = null;
    this.pending = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.stopped = true;
    this.generation = 0;
    this.lastSeq = null;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectRequestSent = false;
    this.handshakeTimer = null;
    this.socketOpened = false;
    this.helloReceived = false;
    this.connectTiming = null;
    this.reconnectSupervisor = new RetrySupervisor({
      initialMs: opts.reconnect.initialMs,
      maxMs: opts.reconnect.maxMs,
      factor: opts.reconnect.multiplier,
      jitter: 0,
    });
  }
  get connected() {
    return this.socket?.isOpen() ?? false;
  }
  get hasPendingRequests() {
    return this.pending.size > 0;
  }
  get connecting() {
    return this.connectSent && !this.helloReceived;
  }
  get hasUnboundedPendingRequests() {
    return [...this.pending.values()].some((pending) => pending.unbounded);
  }
  start() {
    this.stopped = false;
    this.reconnectSupervisor.cancel();
    this.connect();
  }
  stop() {
    this.stopped = true;
    this.clearHandshakeTimer();
    this.reconnectSupervisor.reset();
    const socket = this.socket;
    if (socket && this.opts.notifyStoppedClose)
      this.stoppedSocket = {
        socket,
        context: this.closeContext(),
      };
    this.socket = null;
    this.connectFailure = void 0;
    this.connectTiming = null;
    this.flushRequests(/* @__PURE__ */ new Error("gateway client stopped"));
    socket?.close();
  }
  request(method, params, options) {
    const socket = this.socket;
    if (!socket?.isOpen())
      return Promise.reject(/* @__PURE__ */ new Error("gateway not connected"));
    if (typeof method !== "string" || method.length === 0)
      return Promise.reject(
        /* @__PURE__ */ new Error("invalid request frame: method must be a non-empty string"),
      );
    const id = this.opts.createRequestId();
    const timeoutMs =
      options?.timeoutMs === null ? void 0 : (options?.timeoutMs ?? this.opts.requestTimeoutMs);
    return new Promise((resolve, reject) => {
      let timeout;
      const pending = {
        resolve: (value) => resolve(value),
        reject,
        expectFinal: options?.expectFinal === true,
        acceptedNotified: false,
        onAccepted: options?.onAccepted,
        unbounded: timeoutMs === void 0,
        method,
        startedAtMs: this.nowMs(),
      };
      const onAbort = () => {
        this.pending.delete(id);
        if (timeout) clearTimeout(timeout);
        this.finishRequestTiming(id, pending, false, "CLIENT_ABORTED");
        reject(
          this.opts.createRequestAbortError?.(method) ??
            /* @__PURE__ */ new Error(`gateway request aborted for ${method}`),
        );
      };
      const cleanup = () => {
        if (timeout) clearTimeout(timeout);
        options?.signal?.removeEventListener("abort", onAbort);
      };
      if (options?.signal?.aborted) {
        reject(
          this.opts.createRequestAbortError?.(method) ??
            /* @__PURE__ */ new Error(`gateway request aborted for ${method}`),
        );
        return;
      }
      pending.cleanup = cleanup;
      if (timeoutMs !== void 0 && timeoutMs >= 0) {
        timeout = setTimeout(() => {
          this.pending.delete(id);
          options?.signal?.removeEventListener("abort", onAbort);
          this.finishRequestTiming(id, pending, false, "CLIENT_TIMEOUT");
          reject(
            this.opts.createRequestTimeoutError?.(method, timeoutMs) ??
              /* @__PURE__ */ new Error(
                `gateway request timed out after ${timeoutMs}ms: ${method}`,
              ),
          );
        }, timeoutMs);
        timeout.unref?.();
      }
      options?.signal?.addEventListener("abort", onAbort, { once: true });
      this.pending.set(id, pending);
      try {
        socket.send(
          JSON.stringify({
            type: "req",
            id,
            method,
            params,
          }),
        );
      } catch (error) {
        this.pending.delete(id);
        cleanup();
        this.finishRequestTiming(id, pending, false, "CLIENT_SEND_ERROR");
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
  addEventListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  closeSocket(code, reason) {
    this.socket?.close(code, reason);
  }
  resetReconnectBackoff(initialMs) {
    this.reconnectSupervisor.reset(initialMs);
  }
  recordTiming(phase, generation, plan, detail) {
    const now = this.nowMs();
    const state = this.connectTiming;
    if (!state || state.generation !== generation) return;
    state.hasChallenge ||= phase === "challenge";
    state.usedFallback ||= phase === "fallback";
    this.invoke("connect timing", () =>
      this.opts.onTiming?.({
        phase,
        generation,
        durationMs: Math.max(0, now - state.startedAtMs),
        phaseDurationMs: Math.max(0, now - state.lastAtMs),
        hasChallenge: state.hasChallenge,
        usedFallback: state.usedFallback,
        plan,
        detail,
      }),
    );
    state.lastAtMs = now;
    if (phase === "hello" || phase === "failed") this.connectTiming = null;
  }
  connect() {
    if (this.stopped) return;
    const generation = this.generation + 1;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectRequestSent = false;
    this.socketOpened = false;
    this.helloReceived = false;
    this.connectFailure = void 0;
    let socket;
    try {
      socket = this.opts.createSocket({
        open: () => this.handleOpen(socket, generation),
        message: (data) => this.handleMessage(socket, generation, data),
        close: (code, reason) => this.handleClose(socket, generation, code, reason),
        error: (error) => this.handleSocketError(socket, generation, error),
      });
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      this.opts.onSocketFactoryError?.(normalized);
      this.opts.onConnectError?.(normalized);
      if (this.opts.rethrowSocketFactoryError?.(normalized)) throw normalized;
      return;
    }
    this.generation = generation;
    this.socket = socket;
    const now = this.nowMs();
    this.connectTiming = {
      generation,
      startedAtMs: now,
      lastAtMs: now,
      hasChallenge: false,
      usedFallback: false,
    };
  }
  handleOpen(socket, generation) {
    if (!this.isActive(socket, generation)) return;
    this.socketOpened = true;
    this.recordTiming("socket-open", generation);
    if (this.connectNonce) {
      this.sendConnect(socket, generation);
      return;
    }
    this.armHandshakeTimer(socket, generation);
  }
  armHandshakeTimer(socket, generation) {
    this.clearHandshakeTimer();
    const armedAt = Date.now();
    this.handshakeTimer = setTimeout(() => {
      this.handshakeTimer = null;
      if (!this.isActive(socket, generation) || this.connectSent || !socket.isOpen()) return;
      if (this.opts.handshake.mode === "fallback") {
        this.recordTiming("fallback", generation);
        this.sendConnect(socket, generation);
        return;
      }
      const elapsedMs = Date.now() - armedAt;
      const error = new Error(
        this.opts.handshake.timeoutMessage?.(elapsedMs) ??
          `gateway connect challenge timeout after ${elapsedMs}ms`,
      );
      this.opts.onConnectError?.(error);
      socket.close(1008, "connect challenge timeout");
    }, this.opts.handshake.timeoutMs);
    this.handshakeTimer.unref?.();
  }
  sendConnect(socket, generation) {
    if (!this.isActive(socket, generation) || !socket.isOpen() || this.connectSent) return;
    this.connectSent = true;
    this.clearHandshakeTimer();
    let planOrPromise;
    try {
      planOrPromise = this.opts.buildConnectPlan({
        nonce: this.connectNonce,
        generation,
      });
    } catch (error) {
      this.handleConnectPlanError(socket, generation, error);
      return;
    }
    if (planOrPromise instanceof Promise) {
      planOrPromise
        .then((plan) => this.sendConnectPlan(socket, generation, plan))
        .catch((error) => this.handleConnectPlanError(socket, generation, error));
      return;
    }
    this.sendConnectPlan(socket, generation, planOrPromise);
  }
  handleConnectPlanError(socket, generation, error) {
    if (!this.isActive(socket, generation)) return;
    const normalized = error instanceof Error ? error : new Error(String(error));
    const outcome = this.opts.onConnectPlanError?.(normalized) ?? {
      closeCode: 1008,
      closeReason: "connect failed",
    };
    this.opts.onConnectError?.(outcome.error ?? normalized);
    if (outcome.stop) this.stopped = true;
    socket.close(outcome.closeCode, outcome.closeReason);
  }
  sendConnectPlan(socket, generation, plan) {
    if (!this.isActive(socket, generation) || !socket.isOpen()) return;
    const context = {
      generation,
      nonce: this.connectNonce,
      plan,
    };
    this.recordTiming("connect-plan-ready", generation, plan);
    this.recordTiming("request-sent", generation, plan);
    this.connectRequestSent = true;
    this.request("connect", this.opts.buildConnectParams(plan))
      .then((hello) => {
        if (!this.isActive(socket, generation)) return;
        this.helloReceived = true;
        this.connectFailure = void 0;
        this.reconnectSupervisor.reset();
        this.recordTiming("hello", generation, plan);
        this.opts.onConnectHello?.(hello, context);
        this.invoke("hello", () => this.opts.onHello?.(hello));
      })
      .catch((error) => {
        if (!this.isActive(socket, generation)) return;
        const requestError =
          error instanceof GatewayProtocolRequestError
            ? error
            : new GatewayProtocolRequestError({ message: String(error) });
        const outcome = this.opts.onConnectFailure?.(requestError, context) ?? {
          closeCode: 1008,
          closeReason: "connect failed",
        };
        this.connectFailure = {
          error: requestError,
          reconnectDelayMs: outcome.reconnectDelayMs,
        };
        if (outcome.stop) this.stopped = true;
        socket.close(outcome.closeCode, outcome.closeReason);
      });
  }
  handleMessage(socket, generation, raw) {
    if (!this.isActive(socket, generation)) return;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      this.opts.onParseError?.(error);
      return;
    }
    if (isGatewayEventFrame(parsed)) {
      this.opts.onActivity?.();
      if (parsed.event === "connect.challenge") {
        const payload = parsed.payload;
        const nonce = typeof payload?.nonce === "string" ? payload.nonce.trim() : "";
        if (!nonce) {
          if (this.opts.handshake.mode === "require-challenge") {
            const error = /* @__PURE__ */ new Error("gateway connect challenge missing nonce");
            this.opts.onConnectError?.(error);
            socket.close(1008, "connect challenge missing nonce");
          }
          return;
        }
        this.connectNonce = nonce;
        this.recordTiming("challenge", generation);
        this.sendConnect(socket, generation);
        return;
      }
      const seq = typeof parsed.seq === "number" ? parsed.seq : null;
      if (seq !== null) {
        if (this.lastSeq !== null && seq > this.lastSeq + 1) {
          const expected = this.lastSeq + 1;
          this.invoke("gap", () =>
            this.opts.onGap?.({
              expected,
              received: seq,
            }),
          );
        }
        this.lastSeq = seq;
      }
      this.invoke("event", () => this.opts.onEvent?.(parsed));
      for (const listener of this.listeners) this.invoke("event listener", () => listener(parsed));
      return;
    }
    if (!isGatewayResponseFrame(parsed)) return;
    this.opts.onActivity?.();
    this.handleResponse(parsed);
  }
  handleResponse(frame) {
    const pending = this.pending.get(frame.id);
    if (!pending) return;
    const status = frame.payload?.status;
    if (pending.expectFinal && status === "accepted") {
      if (!pending.acceptedNotified) {
        pending.acceptedNotified = true;
        this.invoke("accepted", () => pending.onAccepted?.(frame.payload));
      }
      return;
    }
    this.pending.delete(frame.id);
    pending.cleanup?.();
    if (frame.ok) {
      this.finishRequestTiming(frame.id, pending, true);
      pending.resolve(frame.payload);
      return;
    }
    this.finishRequestTiming(frame.id, pending, false, frame.error?.code);
    pending.reject(
      this.opts.createRequestError?.(frame.error ?? {}) ??
        new GatewayProtocolRequestError(frame.error ?? {}),
    );
  }
  handleClose(socket, generation, code, reason) {
    if (this.socket !== socket) {
      if (this.stoppedSocket?.socket === socket) {
        const context = {
          ...this.stoppedSocket.context,
          code,
          reason,
        };
        this.stoppedSocket = void 0;
        this.invoke("close", () =>
          this.opts.onClose?.(context, {
            retry: false,
            notify: true,
          }),
        );
      }
      return;
    }
    this.socket = null;
    this.clearHandshakeTimer();
    const context = {
      ...this.closeContext(),
      code,
      reason,
      generation,
    };
    this.connectFailure = void 0;
    const decision = this.opts.resolveClose(context);
    this.flushRequests(
      decision.pendingError ??
        context.connectFailure?.error ??
        /* @__PURE__ */ new Error(`gateway closed (${code}): ${reason}`),
    );
    this.invoke("close", () => this.opts.onClose?.(context, decision));
    if (decision.retry && !this.stopped)
      this.scheduleReconnect(decision.reconnectDelayMs ?? context.connectFailure?.reconnectDelayMs);
  }
  handleSocketError(socket, generation, error) {
    if (!this.isActive(socket, generation) || this.connectSent) return;
    this.opts.onConnectError?.(error);
  }
  flushRequests(error) {
    for (const [id, pending] of this.pending) {
      this.finishRequestTiming(id, pending, false, "CLIENT_CLOSED");
      pending.cleanup?.();
      pending.reject(error);
    }
    this.pending.clear();
  }
  finishRequestTiming(id, pending, ok, errorCode) {
    const endedAtMs = this.nowMs();
    this.invoke("request timing", () =>
      this.opts.onRequestTiming?.({
        id,
        method: pending.method,
        ok,
        durationMs: Math.max(0, endedAtMs - pending.startedAtMs),
        startedAtMs: pending.startedAtMs,
        endedAtMs,
        errorCode,
      }),
    );
  }
  scheduleReconnect(overrideMs) {
    if (overrideMs !== void 0) this.reconnectSupervisor.nextDelayOverrideMs = overrideMs;
    const retry = this.reconnectSupervisor.next();
    if (!retry) return;
    sleepWithAbort(retry.delayMs, retry.signal).then(
      () => this.connect(),
      () => {},
    );
  }
  closeContext() {
    return {
      generation: this.generation,
      socketOpened: this.socketOpened,
      helloReceived: this.helloReceived,
      connectRequestSent: this.connectRequestSent,
      connectFailure: this.connectFailure,
    };
  }
  isActive(socket, generation) {
    return !this.stopped && this.socket === socket && this.generation === generation;
  }
  nowMs() {
    return this.opts.nowMs?.() ?? Date.now();
  }
  clearHandshakeTimer() {
    if (this.handshakeTimer) {
      clearTimeout(this.handshakeTimer);
      this.handshakeTimer = null;
    }
  }
  invoke(label, callback) {
    try {
      callback();
    } catch (error) {
      this.opts.onCallbackError?.(label, error);
    }
  }
};
//#endregion
//#region packages/gateway-client/src/reconnect-policy.ts
const NON_RECOVERABLE_AUTH_ERRORS = /* @__PURE__ */ new Set([
  ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
  ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
  ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
  ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
  ConnectErrorDetailCodes.AUTH_RATE_LIMITED,
  ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH,
  ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH,
  ConnectErrorDetailCodes.PAIRING_REQUIRED,
  ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,
  ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED,
]);
function shouldPauseGatewayReconnect(params) {
  const code = readConnectErrorDetailCode(params.details);
  if (!code) return false;
  const pairing = readPairingConnectErrorDetails(params.details);
  if (
    code === ConnectErrorDetailCodes.PAIRING_REQUIRED &&
    (pairing?.pauseReconnect === false || pairing?.recommendedNextStep === "wait_then_retry")
  )
    return false;
  if (code === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH)
    return params.tokenMismatchIsTerminal === true && !params.deviceTokenRetryPending;
  return (
    NON_RECOVERABLE_AUTH_ERRORS.has(code) ||
    (params.protocolMismatchIsTerminal === true &&
      code === ConnectErrorDetailCodes.PROTOCOL_MISMATCH) ||
    (params.clientVersionMismatchIsTerminal === true &&
      code === ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH)
  );
}
//#endregion
//#region packages/gateway-client/src/client.ts
const DEFAULT_HOST_DEPS = {
  loadOrCreateDeviceIdentity: () => void 0,
  signDevicePayload: () => {
    throw new Error("GatewayClient device signature dependency is not configured");
  },
  publicKeyRawBase64UrlFromPem: () => {
    throw new Error("GatewayClient public key dependency is not configured");
  },
  loadDeviceAuthToken: () => null,
  storeDeviceAuthToken: () => {},
  clearDeviceAuthToken: () => {},
  beforeConnect: () => {},
  registerGatewayLoopbackBypass: () => void 0,
  logDebug: () => {},
  logError: () => {},
  redactForLog: (message) => message,
  normalizeTlsFingerprint: normalizeFingerprint,
};
function resolveHostDeps(overrides) {
  return Object.fromEntries(
    Object.entries(DEFAULT_HOST_DEPS).map(([key, fallback]) => [key, overrides?.[key] ?? fallback]),
  );
}
function normalizeLowercaseStringOrEmpty(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function rawDataToString(data) {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  if (Array.isArray(data))
    return Buffer.concat(data.map((entry) => Buffer.from(entry))).toString("utf8");
  return String(data);
}
function isSensitiveUrlQueryParamName(key) {
  return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function normalizeFingerprint(fingerprint) {
  return (fingerprint ?? "").replaceAll(":", "").trim().toLowerCase();
}
function parseHostForAddressChecks(host) {
  if (!host) return null;
  const normalizedHost = host.toLowerCase().trim();
  const canonicalHost = normalizedHost.replace(/\.+$/, "");
  if (canonicalHost === "localhost")
    return {
      isLocalhost: true,
      unbracketedHost: canonicalHost,
    };
  return {
    isLocalhost: false,
    unbracketedHost:
      normalizedHost.startsWith("[") && normalizedHost.endsWith("]")
        ? normalizedHost.slice(1, -1)
        : normalizedHost,
  };
}
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
  "loopback",
  "private",
  "linkLocal",
  "carrierGradeNat",
]);
const PRIVATE_OR_LOOPBACK_IPV6_RANGES = /* @__PURE__ */ new Set([
  "loopback",
  "linkLocal",
  "uniqueLocal",
  "deprecatedSiteLocal",
]);
function parseGatewayIpAddress(host) {
  const normalized = normalizeIpAddress(host);
  return normalized ? parseCanonicalIpAddress(normalized) : void 0;
}
function isPrivateOrLoopbackIpAddress(address) {
  return (
    address.kind() === "ipv4" ? PRIVATE_OR_LOOPBACK_IPV4_RANGES : PRIVATE_OR_LOOPBACK_IPV6_RANGES
  ).has(address.range());
}
function isLoopbackHost(host) {
  const parsed = parseHostForAddressChecks(host);
  if (!parsed) return false;
  if (parsed.isLocalhost) return true;
  return isLoopbackIpAddress(parsed.unbracketedHost);
}
function isPrivateOrLoopbackHost(host) {
  const parsed = parseHostForAddressChecks(host);
  if (!parsed) return false;
  if (parsed.isLocalhost) return true;
  const address = parseGatewayIpAddress(parsed.unbracketedHost);
  if (!address) return false;
  return isPrivateOrLoopbackIpAddress(address);
}
function isTrustedPlaintextWebSocketHost(hostname) {
  if (isPrivateOrLoopbackHost(hostname)) return true;
  const normalized = hostname.toLowerCase().trim().replace(/\.+$/, "");
  return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
function isSecureWebSocketUrl(rawUrl, options) {
  try {
    const url = new URL(rawUrl);
    const protocol =
      url.protocol === "https:" ? "wss:" : url.protocol === "http:" ? "ws:" : url.protocol;
    if (protocol === "wss:") return true;
    if (protocol !== "ws:") return false;
    if (isLoopbackHost(url.hostname) || isTrustedPlaintextWebSocketHost(url.hostname)) return true;
    if (options?.allowPrivateWs === true) {
      const hostForIpCheck =
        url.hostname.startsWith("[") && url.hostname.endsWith("]")
          ? url.hostname.slice(1, -1)
          : url.hostname;
      return (
        isPrivateOrLoopbackHost(url.hostname) || parseGatewayIpAddress(hostForIpCheck) === void 0
      );
    }
    return false;
  } catch {
    return false;
  }
}
const DEFAULT_GATEWAY_CLIENT_URL = "ws://127.0.0.1:18789";
const DEFAULT_CLIENT_VERSION = "0.0.0";
var GatewayClientRequestError = class extends GatewayProtocolRequestError {
  constructor(error) {
    super({
      ...error,
      message: formatConnectErrorMessage({
        message: error.message,
        details: error.details,
      }),
    });
    this.name = "GatewayClientRequestError";
  }
};
var GatewayClientTransientPreHelloCloseError = class extends Error {
  constructor() {
    super("gateway transient pre-hello clean close");
    this.name = "GatewayClientTransientPreHelloCloseError";
  }
};
var GatewayClientTransportPolicyError = class extends Error {};
const GATEWAY_CONNECT_ASSEMBLY_ERROR = Symbol("gateway.connectAssemblyError");
function markGatewayConnectAssemblyError(error) {
  Object.defineProperty(error, GATEWAY_CONNECT_ASSEMBLY_ERROR, {
    configurable: true,
    value: true,
  });
  return error;
}
function isGatewayConnectAssemblyError(value) {
  return value instanceof Error && value[GATEWAY_CONNECT_ASSEMBLY_ERROR] === true;
}
function readConnectChallengeTimeoutOverride(opts) {
  if (
    typeof opts.connectChallengeTimeoutMs === "number" &&
    Number.isFinite(opts.connectChallengeTimeoutMs)
  )
    return opts.connectChallengeTimeoutMs;
}
function isGatewayClientStoppedError(err) {
  const message = err instanceof Error ? err.message : String(err);
  return message === "gateway client stopped" || message === "Error: gateway client stopped";
}
function formatGatewayClientErrorForLog(err) {
  return String(err)
    .replace(/\/\/([^@/?#\s]+)@/g, "//***:***@")
    .replace(/(Authorization:\s*Bearer\s+)[^\s]+/giu, "$1***")
    .replace(/([?&])([^=&\s]+)=([^&#\s"'<>)]*)/g, (match, prefix, key) =>
      isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match,
    );
}
function resolveGatewayClientConnectChallengeTimeoutMs(opts) {
  return resolveConnectChallengeTimeoutMs(readConnectChallengeTimeoutOverride(opts), {
    env: opts.env,
    configuredTimeoutMs: opts.preauthHandshakeTimeoutMs,
  });
}
const FORCE_STOP_TERMINATE_GRACE_MS = 250;
const STOP_AND_WAIT_TIMEOUT_MS = 1e3;
const MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES = 1;
var GatewayClient = class {
  constructor(opts) {
    this.ws = null;
    this.stopped = false;
    this.pendingDeviceTokenRetry = false;
    this.deviceTokenRetryBudgetUsed = false;
    this.approvalRuntimeTokenCompatibilityDisabled = false;
    this.approvalRuntimeTokenRetryBudgetUsed = false;
    this.lastTick = null;
    this.tickIntervalMs = 3e4;
    this.tickTimer = null;
    this.pendingStop = null;
    this.transportValidated = false;
    this.suppressedTransientPreHelloCleanCloses = 0;
    this.deps = resolveHostDeps(opts.hostDeps);
    this.opts = {
      ...opts,
      deviceIdentity:
        opts.deviceIdentity === null
          ? void 0
          : (opts.deviceIdentity ?? this.deps.loadOrCreateDeviceIdentity()),
    };
    this.requestTimeoutMs =
      typeof opts.requestTimeoutMs === "number" && Number.isFinite(opts.requestTimeoutMs)
        ? resolveSafeTimeoutDelayMs(opts.requestTimeoutMs, { minMs: 0 })
        : 3e4;
    this.protocol = new GatewayProtocolClient({
      createSocket: (handlers) => this.createSocket(handlers),
      createRequestId: randomUUID,
      createRequestError: (error) => new GatewayClientRequestError(error),
      createRequestTimeoutError: (method) =>
        /* @__PURE__ */ new Error(`gateway request timeout for ${method}`),
      createRequestAbortError: createGatewayRequestAbortError,
      buildConnectPlan: ({ nonce }) => {
        if (!nonce) throw new Error("gateway connect challenge missing nonce");
        return this.assembleConnectParams({
          role: this.opts.role ?? "operator",
          nonce,
        });
      },
      buildConnectParams: (assembled) => assembled.params,
      onConnectPlanError: (error) => {
        this.stopped = true;
        const marked = markGatewayConnectAssemblyError(error);
        const msg = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
        if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error))
          this.logDebug(msg);
        else this.logError(msg);
        return {
          closeCode: 1008,
          closeReason: "connect failed",
          stop: true,
          error: marked,
        };
      },
      onConnectHello: (hello, context) => this.handleConnectHello(hello, context.plan),
      onHello: (hello) => this.opts.onHelloOk?.(hello),
      onConnectFailure: (error, context) => this.handleConnectRequestFailure(error, context.plan),
      resolveClose: (context) => this.resolveClose(context),
      onClose: (context, decision) => {
        if (this.tickTimer) {
          clearInterval(this.tickTimer);
          this.tickTimer = null;
        }
        if (decision.notify)
          this.opts.onClose?.(context.code, context.reason, this.closeInfo(context));
      },
      notifyStoppedClose: true,
      onConnectError: (error) => this.notifyConnectError(error),
      onParseError: (error) =>
        this.logDebug(`gateway client parse error: ${formatGatewayClientErrorForLog(error)}`),
      onEvent: (event) => this.opts.onEvent?.(event),
      onGap: (info) => this.opts.onGap?.(info),
      onActivity: () => {
        this.lastTick = Date.now();
      },
      onCallbackError: (label, error) =>
        this.logDebug(
          `gateway client ${label === "hello" ? "hello-ok" : label === "gap" ? "event" : label} handler error: ${formatGatewayClientErrorForLog(error)}`,
        ),
      handshake: {
        mode: "require-challenge",
        timeoutMs: resolveGatewayClientConnectChallengeTimeoutMs(this.opts),
        timeoutMessage: (elapsedMs) =>
          `gateway connect challenge timeout (waited ${elapsedMs}ms, limit ${resolveGatewayClientConnectChallengeTimeoutMs(this.opts)}ms)`,
      },
      reconnect: {
        initialMs: 1e3,
        multiplier: 2,
        maxMs: 3e4,
      },
      requestTimeoutMs: this.requestTimeoutMs,
      rethrowSocketFactoryError: (error) => error instanceof GatewayClientTransportPolicyError,
    });
  }
  getConnectionMetadata() {
    return {
      clientName: this.opts.clientName,
      hasDeviceIdentity: Boolean(this.opts.deviceIdentity),
      mode: this.opts.mode,
      preauthHandshakeTimeoutMs: this.opts.preauthHandshakeTimeoutMs,
    };
  }
  start() {
    if (this.stopped) return;
    this.protocol.start();
  }
  createSocket(handlers) {
    const url = this.opts.url ?? DEFAULT_GATEWAY_CLIENT_URL;
    if (this.opts.tlsFingerprint && !url.startsWith("wss://"))
      throw new Error("gateway tls fingerprint requires wss:// gateway url");
    const allowPrivateWs =
      (this.opts.env ?? process.env).OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
    if (!isSecureWebSocketUrl(url, { allowPrivateWs })) {
      let displayHost = url;
      try {
        displayHost = new URL(url).hostname || url;
      } catch {}
      throw new Error(
        `SECURITY ERROR: Cannot connect to "${displayHost}" over plaintext ws://. Both credentials and chat data would be exposed to network interception. Use wss:// for remote URLs. Safe defaults: keep gateway.bind=loopback and connect via SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host), or use Tailscale Serve/Funnel. ` +
          (allowPrivateWs
            ? ""
            : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1. ") +
          "Run `openclaw doctor --fix` for guidance.",
      );
    }
    this.deps.beforeConnect();
    const wsOptions = {
      maxPayload: 25 * 1024 * 1024,
      ...(this.opts.origin ? { origin: this.opts.origin } : {}),
    };
    if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
      wsOptions.rejectUnauthorized = false;
      wsOptions.checkServerIdentity = (_hostValue, cert) => {
        const fingerprintValue =
          typeof cert === "object" && cert && "fingerprint256" in cert
            ? (cert.fingerprint256 ?? "")
            : "";
        const fingerprint = this.deps.normalizeTlsFingerprint(
          typeof fingerprintValue === "string" ? fingerprintValue : "",
        );
        const expected = this.deps.normalizeTlsFingerprint(this.opts.tlsFingerprint ?? "");
        if (!expected) return;
        if (!fingerprint) return /* @__PURE__ */ new Error("Missing server TLS fingerprint");
        if (fingerprint !== expected)
          return /* @__PURE__ */ new Error("Server TLS fingerprint mismatch");
      };
    }
    let ws;
    let unregisterGatewayLoopbackBypass;
    try {
      unregisterGatewayLoopbackBypass = this.deps.registerGatewayLoopbackBypass(url);
    } catch (error) {
      throw new GatewayClientTransportPolicyError(
        error instanceof Error ? error.message : String(error),
      );
    }
    try {
      ws = new WebSocket(url, wsOptions);
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    } finally {
      unregisterGatewayLoopbackBypass?.();
    }
    this.ws = ws;
    this.transportValidated = false;
    ws.on("open", () => {
      handlers.open();
      if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
        const tlsError = this.validateTlsFingerprint();
        if (tlsError) {
          handlers.error(tlsError);
          ws.close(1008, tlsError.message);
          return;
        }
      }
      this.transportValidated = true;
    });
    ws.on("message", (data) => handlers.message(rawDataToString(data)));
    ws.on("close", (code, reason) => {
      const reasonText = rawDataToString(reason);
      if (this.ws === ws) this.ws = null;
      this.resolvePendingStop(ws);
      handlers.close(code, reasonText);
    });
    ws.on("error", (err) => {
      this.logDebug(`gateway client error: ${formatGatewayClientErrorForLog(err)}`);
      handlers.error(err instanceof Error ? err : new Error(String(err)));
    });
    return {
      isOpen: () => ws.readyState === WebSocket.OPEN,
      send: (data) => ws.send(data),
      close: (code, reason) => ws.close(code, reason),
    };
  }
  stop() {
    this.beginStop();
  }
  async stopAndWait(opts) {
    const stopPromise = this.beginStop();
    if (!stopPromise) return;
    const timeoutMs =
      opts?.timeoutMs === void 0
        ? STOP_AND_WAIT_TIMEOUT_MS
        : resolveSafeTimeoutDelayMs(opts.timeoutMs);
    let timeout = null;
    try {
      await Promise.race([
        stopPromise,
        new Promise((_, reject) => {
          timeout = setTimeout(() => {
            reject(/* @__PURE__ */ new Error(`gateway client stop timed out after ${timeoutMs}ms`));
          }, timeoutMs);
          timeout.unref?.();
        }),
      ]);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
  beginStop() {
    this.stopped = true;
    this.pendingDeviceTokenRetry = false;
    this.deviceTokenRetryBudgetUsed = false;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    if (this.pendingStop) return this.pendingStop.promise;
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      const pendingStop = this.createPendingStop(ws);
      const forceTerminateTimer = setTimeout(() => {
        try {
          ws.terminate();
        } finally {
          this.resolvePendingStop(ws);
        }
      }, FORCE_STOP_TERMINATE_GRACE_MS);
      forceTerminateTimer.unref?.();
      pendingStop.terminateTimer = forceTerminateTimer;
      if (this.protocol.connecting) {
        const error = /* @__PURE__ */ new Error("gateway client stopped");
        this.notifyConnectError(error);
        this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
      }
      this.protocol.stop();
      return pendingStop.promise;
    }
    this.protocol.stop();
    return null;
  }
  createPendingStop(ws) {
    if (this.pendingStop?.ws === ws) return this.pendingStop;
    let resolve = () => {};
    const promise = new Promise((done) => {
      resolve = done;
    });
    this.pendingStop = {
      ws,
      promise,
      resolve,
    };
    return this.pendingStop;
  }
  resolvePendingStop(ws) {
    if (this.pendingStop?.ws !== ws) return;
    const { resolve, terminateTimer } = this.pendingStop;
    if (terminateTimer) clearTimeout(terminateTimer);
    this.pendingStop = null;
    resolve();
  }
  logDebug(message) {
    this.deps.logDebug(this.deps.redactForLog(message));
  }
  logError(message) {
    this.deps.logError(this.deps.redactForLog(message));
  }
  assembleConnectParams(params) {
    const { role, nonce } = params;
    const selectedAuth = this.selectConnectAuth(role);
    const {
      authDeviceToken,
      authApprovalRuntimeToken,
      authAgentRuntimeIdentityToken,
      signatureToken,
      resolvedDeviceToken,
      storedToken,
      storedScopes,
      usingStoredDeviceToken,
    } = selectedAuth;
    if (this.pendingDeviceTokenRetry && authDeviceToken) this.pendingDeviceTokenRetry = false;
    const auth = buildGatewayConnectAuth(selectedAuth);
    const signedAtMs = Date.now();
    const scopes = resolveGatewayConnectScopes({
      requestedScopes: this.opts.scopes,
      usingStoredDeviceToken,
      storedScopes,
      defaultScopes: ["operator.admin"],
    });
    const platform = this.opts.platform ?? process.platform;
    return {
      params: {
        minProtocol: this.opts.minProtocol ?? 4,
        maxProtocol: this.opts.maxProtocol ?? 4,
        client: {
          id: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
          displayName: this.opts.clientDisplayName,
          version: this.opts.clientVersion ?? DEFAULT_CLIENT_VERSION,
          platform,
          deviceFamily: this.opts.deviceFamily,
          mode: this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND,
          instanceId: this.opts.instanceId,
        },
        caps: Array.isArray(this.opts.caps) ? this.opts.caps : [],
        commands: Array.isArray(this.opts.commands) ? this.opts.commands : void 0,
        permissions:
          this.opts.permissions && typeof this.opts.permissions === "object"
            ? this.opts.permissions
            : void 0,
        pathEnv: this.opts.pathEnv,
        auth,
        role,
        scopes,
        device: this.buildDeviceConnectParams({
          nonce,
          role,
          scopes,
          signatureToken,
          signedAtMs,
          platform,
        }),
      },
      authApprovalRuntimeToken,
      authAgentRuntimeIdentityToken,
      resolvedDeviceToken,
      storedToken,
      usingStoredDeviceToken,
    };
  }
  buildDeviceConnectParams(params) {
    if (!this.opts.deviceIdentity) return;
    const { nonce, role, scopes, signatureToken, signedAtMs, platform } = params;
    const payload = buildDeviceAuthPayloadV3({
      deviceId: this.opts.deviceIdentity.deviceId,
      clientId: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
      clientMode: this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND,
      role,
      scopes,
      signedAtMs,
      token: signatureToken ?? null,
      nonce,
      platform,
      deviceFamily: this.opts.deviceFamily,
    });
    const signature = this.deps.signDevicePayload(this.opts.deviceIdentity.privateKeyPem, payload);
    return {
      id: this.opts.deviceIdentity.deviceId,
      publicKey: this.deps.publicKeyRawBase64UrlFromPem(this.opts.deviceIdentity.publicKeyPem),
      signature,
      signedAt: signedAtMs,
      nonce,
    };
  }
  handleConnectHello(helloOk, assembled) {
    this.pendingDeviceTokenRetry = false;
    this.deviceTokenRetryBudgetUsed = false;
    this.suppressedTransientPreHelloCleanCloses = 0;
    const role = this.opts.role ?? "operator";
    const authInfo = helloOk.auth;
    if (authInfo?.deviceToken && this.opts.deviceIdentity)
      this.deps.storeDeviceAuthToken({
        deviceId: this.opts.deviceIdentity.deviceId,
        role: authInfo.role ?? role,
        token: authInfo.deviceToken,
        scopes: authInfo.scopes ?? [],
        env: this.opts.env,
      });
    this.tickIntervalMs =
      typeof helloOk.policy?.tickIntervalMs === "number" ? helloOk.policy.tickIntervalMs : 3e4;
    this.lastTick = Date.now();
    this.startTickWatch();
  }
  handleConnectRequestFailure(error, assembled) {
    const role = this.opts.role ?? "operator";
    const shouldRetryWithDeviceToken = shouldRetryGatewayWithDeviceToken({
      retryBudgetUsed: this.deviceTokenRetryBudgetUsed,
      currentDeviceToken: assembled.resolvedDeviceToken,
      explicitToken: this.opts.token?.trim() || void 0,
      storedToken: assembled.storedToken,
      trustedEndpoint: this.isTrustedDeviceRetryEndpoint(),
      errorDetails: error instanceof GatewayClientRequestError ? error.details : void 0,
    });
    if (
      this.opts.deviceIdentity &&
      assembled.usingStoredDeviceToken &&
      error instanceof GatewayClientRequestError &&
      readConnectErrorDetailCode(error.details) ===
        ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH
    ) {
      const deviceId = this.opts.deviceIdentity.deviceId;
      try {
        this.deps.clearDeviceAuthToken({
          deviceId,
          role,
          env: this.opts.env,
        });
        this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
      } catch (clearError) {
        this.logDebug(
          `failed clearing stale device-auth token for device ${deviceId}: ${String(clearError)}`,
        );
      }
    }
    if (shouldRetryWithDeviceToken) {
      this.pendingDeviceTokenRetry = true;
      this.deviceTokenRetryBudgetUsed = true;
      this.protocol.resetReconnectBackoff(250);
    }
    const startupRetryAfterMs = resolveGatewayStartupRetryAfterMs(error);
    if (startupRetryAfterMs !== null) {
      this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
      return {
        closeCode: 1013,
        closeReason: "gateway starting",
        reconnectDelayMs: startupRetryAfterMs,
      };
    }
    if (
      this.shouldFailClosedForUnsupportedAgentRuntimeIdentity({
        error,
        authAgentRuntimeIdentityToken: assembled.authAgentRuntimeIdentityToken,
      })
    ) {
      const unsupportedIdentityError = /* @__PURE__ */ new Error(
        "gateway rejected required agent runtime identity auth field; refusing to retry without it",
      );
      this.stopped = true;
      this.notifyConnectError(unsupportedIdentityError);
      this.logError(`gateway connect failed: ${unsupportedIdentityError.message}`);
      return {
        closeCode: 1008,
        closeReason: "connect failed",
        stop: true,
      };
    }
    if (
      this.shouldRetryWithoutApprovalRuntimeToken({
        error,
        authApprovalRuntimeToken: assembled.authApprovalRuntimeToken,
      })
    ) {
      this.approvalRuntimeTokenCompatibilityDisabled = true;
      this.approvalRuntimeTokenRetryBudgetUsed = true;
      this.protocol.resetReconnectBackoff(250);
      this.logDebug("gateway rejected approval runtime auth field; retrying without it");
      return {
        closeCode: 1008,
        closeReason: "connect retry",
      };
    }
    this.notifyConnectError(error);
    const message = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
    if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error))
      this.logDebug(message);
    else this.logError(message);
    return {
      closeCode: 1008,
      closeReason: "connect failed",
    };
  }
  resolveClose(context) {
    const info = this.closeInfo(context);
    const detailCode =
      context.connectFailure?.error instanceof GatewayClientRequestError
        ? readConnectErrorDetailCode(context.connectFailure.error.details)
        : null;
    const details =
      context.connectFailure?.error instanceof GatewayClientRequestError
        ? context.connectFailure.error.details
        : void 0;
    if (context.code === 1013 && context.connectFailure?.reconnectDelayMs !== void 0)
      return {
        retry: true,
        notify: false,
        reconnectDelayMs: context.connectFailure.reconnectDelayMs,
      };
    if (
      info.transientPreHelloCleanClose &&
      this.suppressedTransientPreHelloCleanCloses < MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES
    ) {
      this.suppressedTransientPreHelloCleanCloses += 1;
      return {
        retry: true,
        notify: true,
        pendingError: new GatewayClientTransientPreHelloCloseError(),
      };
    }
    if (
      info.transientPreHelloCleanClose ||
      (context.connectRequestSent && !context.helloReceived && !context.connectFailure)
    ) {
      const error = /* @__PURE__ */ new Error(
        `gateway closed (${context.code}): ${context.reason}`,
      );
      this.notifyConnectError(error);
      this.logError(`gateway connect failed: ${formatGatewayClientErrorForLog(error)}`);
    }
    this.clearStaleDeviceTokenForClose(context.code, context.reason);
    if (
      shouldPauseGatewayReconnect({
        details,
        deviceTokenRetryPending: this.pendingDeviceTokenRetry,
        tokenMismatchIsTerminal: true,
        clientVersionMismatchIsTerminal: true,
      })
    ) {
      this.notifyReconnectPaused({
        code: context.code,
        reason: context.reason,
        detailCode,
      });
      return {
        retry: false,
        notify: true,
      };
    }
    return {
      retry: true,
      notify: true,
      reconnectDelayMs: context.connectFailure?.reconnectDelayMs,
    };
  }
  closeInfo(context) {
    return {
      phase: context.helloReceived ? "post-hello" : "pre-hello",
      socketOpened: context.socketOpened,
      transportValidated: this.transportValidated,
      transientPreHelloCleanClose:
        !context.helloReceived && context.code === 1e3 && context.reason === "",
    };
  }
  clearStaleDeviceTokenForClose(code, reason) {
    if (
      code !== 1008 ||
      !normalizeLowercaseStringOrEmpty(reason).includes("device token mismatch") ||
      this.opts.token ||
      this.opts.password ||
      !this.opts.deviceIdentity
    )
      return;
    const deviceId = this.opts.deviceIdentity.deviceId;
    const role = this.opts.role ?? "operator";
    try {
      this.deps.clearDeviceAuthToken({
        deviceId,
        role,
        env: this.opts.env,
      });
      this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
    } catch (error) {
      this.logDebug(
        `failed clearing stale device-auth token for device ${deviceId}: ${String(error)}`,
      );
    }
  }
  notifyConnectError(error) {
    try {
      this.opts.onConnectError?.(error);
    } catch (err) {
      this.logDebug(
        `gateway client connect error handler error: ${formatGatewayClientErrorForLog(err)}`,
      );
    }
  }
  notifyReconnectPaused(info) {
    try {
      this.opts.onReconnectPaused?.(info);
    } catch (err) {
      this.logDebug(
        `gateway client reconnect paused handler error: ${formatGatewayClientErrorForLog(err)}`,
      );
    }
  }
  shouldRetryWithoutApprovalRuntimeToken(params) {
    if (this.approvalRuntimeTokenRetryBudgetUsed) return false;
    if (!params.authApprovalRuntimeToken) return false;
    if (!(params.error instanceof GatewayClientRequestError)) return false;
    if (params.error.gatewayCode !== "INVALID_REQUEST") return false;
    const message = normalizeLowercaseStringOrEmpty(params.error.message);
    return message.includes("invalid connect params") && message.includes("approvalruntimetoken");
  }
  shouldFailClosedForUnsupportedAgentRuntimeIdentity(params) {
    if (!params.authAgentRuntimeIdentityToken) return false;
    if (!(params.error instanceof GatewayClientRequestError)) return false;
    if (params.error.gatewayCode !== "INVALID_REQUEST") return false;
    const message = normalizeLowercaseStringOrEmpty(params.error.message);
    return (
      message.includes("invalid connect params") && message.includes("agentruntimeidentitytoken")
    );
  }
  isTrustedDeviceRetryEndpoint() {
    const rawUrl = this.opts.url ?? "ws://127.0.0.1:18789";
    try {
      const parsed = new URL(rawUrl);
      const protocol =
        parsed.protocol === "https:"
          ? "wss:"
          : parsed.protocol === "http:"
            ? "ws:"
            : parsed.protocol;
      if (isLoopbackHost(parsed.hostname)) return true;
      return protocol === "wss:" && Boolean(this.opts.tlsFingerprint?.trim());
    } catch {
      return false;
    }
  }
  selectConnectAuth(role) {
    const storedAuth = this.opts.deviceIdentity
      ? this.deps.loadDeviceAuthToken({
          deviceId: this.opts.deviceIdentity.deviceId,
          role,
          env: this.opts.env,
        })
      : null;
    return selectGatewayConnectAuth({
      token: this.opts.token,
      bootstrapToken: this.opts.bootstrapToken,
      deviceToken: this.opts.deviceToken,
      password: this.opts.password,
      approvalRuntimeToken: this.approvalRuntimeTokenCompatibilityDisabled
        ? void 0
        : this.opts.approvalRuntimeToken,
      agentRuntimeIdentityToken: this.opts.agentRuntimeIdentityToken,
      storedToken: storedAuth?.token,
      storedScopes: storedAuth?.scopes,
      pendingDeviceTokenRetry: this.pendingDeviceTokenRetry,
      trustedDeviceTokenRetry: this.isTrustedDeviceRetryEndpoint(),
    });
  }
  startTickWatch() {
    if (this.tickTimer) clearInterval(this.tickTimer);
    const rawMinInterval = this.opts.tickWatchMinIntervalMs;
    const minInterval =
      typeof rawMinInterval === "number" && Number.isFinite(rawMinInterval)
        ? Math.max(1, Math.min(3e4, rawMinInterval))
        : 1e3;
    const interval = resolveSafeTimeoutDelayMs(Math.max(this.tickIntervalMs, minInterval));
    this.tickTimer = setInterval(() => {
      if (this.stopped) return;
      if (!this.lastTick) return;
      if (this.protocol.hasPendingRequests && !this.protocol.hasUnboundedPendingRequests) return;
      const gap = Date.now() - this.lastTick;
      const rawTimeoutMs = this.opts.tickWatchTimeoutMs;
      if (
        gap >
        (typeof rawTimeoutMs === "number" && Number.isFinite(rawTimeoutMs)
          ? Math.max(1, rawTimeoutMs)
          : this.tickIntervalMs * 2)
      )
        this.protocol.closeSocket(4e3, "tick timeout");
    }, interval);
  }
  validateTlsFingerprint() {
    if (!this.opts.tlsFingerprint || !this.ws) return null;
    const expected = this.deps.normalizeTlsFingerprint(this.opts.tlsFingerprint);
    if (!expected) return /* @__PURE__ */ new Error("gateway tls fingerprint missing");
    const socket = this.ws["_socket"];
    if (!socket || typeof socket.getPeerCertificate !== "function")
      return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
    const cert = socket.getPeerCertificate();
    const fingerprint = this.deps.normalizeTlsFingerprint(cert?.fingerprint256 ?? "");
    if (!fingerprint) return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
    if (fingerprint !== expected)
      return /* @__PURE__ */ new Error("gateway tls fingerprint mismatch");
    return null;
  }
  async request(method, params, opts) {
    const expectFinal = opts?.expectFinal === true;
    const timeoutMs =
      opts?.timeoutMs === null
        ? null
        : typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs)
          ? resolveSafeTimeoutDelayMs(opts.timeoutMs, { minMs: 0 })
          : expectFinal
            ? null
            : this.requestTimeoutMs;
    return this.protocol.request(method, params, {
      expectFinal,
      timeoutMs,
      signal: opts?.signal,
      onAccepted: opts?.onAccepted,
    });
  }
};
function createGatewayRequestAbortError(method) {
  const err = /* @__PURE__ */ new Error(`gateway request aborted for ${method}`);
  err.name = "AbortError";
  return err;
}
//#endregion
export { GatewayClientRequestError as n, isGatewayConnectAssemblyError as r, GatewayClient as t };
