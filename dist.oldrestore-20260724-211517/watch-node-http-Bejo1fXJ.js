import { randomBytes, randomUUID } from "node:crypto";
import {
  i as hasForwardedRequestHeaders,
  s as withSerializedRateLimitAttempt,
} from "./auth-D-Aebsmj.js";
import {
  a as AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING,
  c as AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE,
  l as buildRateLimitIdentityKey,
} from "./auth-rate-limit-DYOdqnES.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import "./version-CwNT1gaY.js";
import {
  C as isNodePairingSetupBootstrapProfile,
  a as redeemDeviceBootstrapTokenProfile,
  l as verifyDeviceBootstrapToken,
  n as getBoundDeviceBootstrapProfile,
  o as restoreDeviceBootstrapToken,
  s as revokeDeviceBootstrapToken,
} from "./device-bootstrap-km7Bg8Dl.js";
import {
  a as normalizeDevicePublicKeyBase64Url,
  t as deriveDeviceIdFromPublicKey,
} from "./device-identity-BmJfeLuX.js";
import "./method-scopes-DrxGpKMT.js";
import {
  a as getPairedDevice,
  b as verifyDeviceToken,
  h as requestDevicePairing,
  r as ensureDeviceToken,
  t as approveBootstrapDevicePairing,
} from "./device-pairing-BIH9-x3P.js";
import {
  a as sendJson,
  c as sendRateLimited,
  i as sendInvalidRequest,
  l as sendUnauthorized,
  n as readJsonBodyOrError,
  o as sendMethodNotAllowed,
} from "./http-common-Czxz795c.js";
import { _ as resolveRequestClientIp, r as isLoopbackAddress } from "./net-BpMGIYrw.js";
import {
  l as resolveConnectAuthDecision,
  n as resolveDeviceSignaturePayloadVersion,
  t as reconcileNodePairingOnConnect,
} from "./node-connect-reconcile-bUK_9O47.js";
import {
  c as requestNodePairing,
  n as beginNodePairingConnect,
  o as releaseNodePairingCleanupClaim,
  r as finalizeNodePairingCleanupClaim,
  t as approveNodePairing,
  u as updatePairedNodeMetadata,
} from "./node-pairing-CPgz4J2C.js";
import {
  o as WRITE_SCOPE,
  r as PAIRING_SCOPE,
  t as ADMIN_SCOPE,
} from "./operator-scopes-CpPJIv7P.js";
import { Y as validateConnectParams } from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/watch-node-http.ts
const BASE_PATH = "/api/nodes/watch";
const CONNECT_PATH = `${BASE_PATH}/connect`;
const CHALLENGE_PATH = `${BASE_PATH}/challenge`;
const DISCONNECT_PATH = `${BASE_PATH}/disconnect`;
const POLL_PATH = `${BASE_PATH}/poll`;
const RESULT_PATH = `${BASE_PATH}/result`;
const CHALLENGE_TTL_MS = 6e4;
const SIGNATURE_SKEW_MS = 2 * 6e4;
const POLL_TIMEOUT_MS = 2e4;
const SESSION_IDLE_MS = 75e3;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_QUEUED_EVENT_BYTES = 64 * 1024;
const MAX_QUEUED_BYTES = 512 * 1024;
const MAX_QUEUED_EVENTS = 32;
const MAX_PENDING_CHALLENGES = 4096;
const MAX_PENDING_CHALLENGES_PER_CLIENT = 8;
const WATCH_CAPS = /* @__PURE__ */ new Set();
const WATCH_COMMANDS = /* @__PURE__ */ new Set(["device.info", "device.status", "system.notify"]);
const WATCH_PERMISSIONS = /* @__PURE__ */ new Set(["notifications"]);
var WatchNodePairingRateLimitError = class extends Error {
  constructor(retryAfterMs) {
    super("watch node pairing rate limited");
    this.retryAfterMs = retryAfterMs;
  }
};
function normalizePath(req) {
  try {
    return new URL(req.url ?? "/", "http://localhost").pathname;
  } catch {
    return null;
  }
}
function readBearerToken(req) {
  const header = req.headers.authorization?.trim() ?? "";
  return /^Bearer\s+(.+)$/i.exec(header)?.[1]?.trim() || null;
}
function resolveWatchClientAddress(req, config) {
  const clientIp = resolveRequestClientIp(
    req,
    config.gateway?.trustedProxies ?? [],
    config.gateway?.allowRealIpFallback === true,
  );
  if (hasForwardedRequestHeaders(req) && isLoopbackAddress(clientIp))
    return {
      rateLimitKey: buildRateLimitIdentityKey("watch-proxy", req.socket.remoteAddress ?? "unknown"),
    };
  return {
    ...(clientIp ? { clientIp } : {}),
    rateLimitKey: clientIp ?? buildRateLimitIdentityKey("watch-client", "unknown"),
  };
}
function isStringRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function trackResponseLifecycle(res) {
  let aborted = false;
  let settled = false;
  let resolveCompleted = () => void 0;
  const completed = new Promise((resolve) => {
    resolveCompleted = resolve;
  });
  const settle = (value) => {
    if (settled) return;
    settled = true;
    res.off("finish", onFinish);
    res.off("close", onClose);
    resolveCompleted(value);
  };
  const onFinish = () => settle(true);
  const onClose = () => {
    aborted = !res.writableFinished;
    settle(!aborted);
  };
  res.once("finish", onFinish);
  res.once("close", onClose);
  return {
    completed,
    isAborted: () => aborted,
  };
}
function hasOnlyBoundedWatchSurface(connect) {
  const caps = Array.isArray(connect.caps) ? connect.caps : [];
  const commands = Array.isArray(connect.commands) ? connect.commands : [];
  const permissionEntries = Object.entries(connect.permissions ?? {});
  return (
    caps.every((cap) => WATCH_CAPS.has(cap)) &&
    commands.length > 0 &&
    commands.every((command) => WATCH_COMMANDS.has(command)) &&
    permissionEntries.every(([permission]) => WATCH_PERMISSIONS.has(permission))
  );
}
function isCanonicalWatchNode(connect) {
  const platform = connect.client.platform.trim().toLowerCase();
  const family = connect.client.deviceFamily?.trim().toLowerCase();
  return (
    connect.minProtocol <= 4 &&
    connect.maxProtocol >= 4 &&
    connect.role === "node" &&
    (connect.scopes?.length ?? 0) === 0 &&
    connect.client.id === GATEWAY_CLIENT_IDS.WATCHOS_APP &&
    connect.client.mode === GATEWAY_CLIENT_MODES.NODE &&
    platform.startsWith("watchos") &&
    family === "apple watch" &&
    hasOnlyBoundedWatchSurface(connect)
  );
}
function createChallengeStore() {
  const challenges = /* @__PURE__ */ new Map();
  const pruneExpired = (current) => {
    for (const [nonce, challenge] of challenges)
      if (challenge.expiresAtMs <= current) challenges.delete(nonce);
  };
  return {
    issue: (clientKey, current) => {
      pruneExpired(current);
      const clientNonces = [...challenges.entries()].filter(
        ([, challenge]) => challenge.clientKey === clientKey,
      );
      while (clientNonces.length >= MAX_PENDING_CHALLENGES_PER_CLIENT) {
        const oldest = clientNonces.shift();
        if (oldest) challenges.delete(oldest[0]);
      }
      while (challenges.size >= MAX_PENDING_CHALLENGES) {
        const oldest = challenges.keys().next().value;
        if (typeof oldest !== "string") break;
        challenges.delete(oldest);
      }
      const nonce = randomBytes(24).toString("base64url");
      const expiresAtMs = current + CHALLENGE_TTL_MS;
      challenges.set(nonce, {
        clientKey,
        expiresAtMs,
      });
      return {
        nonce,
        expiresAtMs,
      };
    },
    consume: (nonce, clientKey, current) => {
      const challenge = challenges.get(nonce);
      challenges.delete(nonce);
      return Boolean(
        challenge && challenge.clientKey === clientKey && challenge.expiresAtMs > current,
      );
    },
    clear: () => challenges.clear(),
  };
}
function broadcastPairingSuperseded(broadcast, result, now) {
  for (const superseded of result.created ? (result.superseded ?? []) : [])
    broadcast(
      "node.pair.resolved",
      {
        requestId: superseded.requestId,
        nodeId: superseded.nodeId,
        decision: "rejected",
        ts: now,
      },
      { dropIfSlow: true },
    );
}
/** Create the first-party watchOS node HTTP transport for one Gateway process. */
function createWatchNodeHttpRuntime(options) {
  const now = options.now ?? Date.now;
  const challenges = createChallengeStore();
  const sessionsByToken = /* @__PURE__ */ new Map();
  const sessionsByNodeId = /* @__PURE__ */ new Map();
  let closed = false;
  const closeSession = (session, reason) => {
    if (sessionsByToken.get(session.token) !== session) return;
    sessionsByToken.delete(session.token);
    if (sessionsByNodeId.get(session.nodeId) === session) sessionsByNodeId.delete(session.nodeId);
    clearTimeout(session.expiresTimer);
    if (session.waiter) {
      clearTimeout(session.waiter.timer);
      if (!session.waiter.res.writableEnded)
        sendJson(session.waiter.res, 401, {
          ok: false,
          reason,
        });
      session.waiter = void 0;
    }
    const disconnectedNodeId = options.nodeRegistry.unregister(session.connId);
    if (disconnectedNodeId)
      try {
        options.onNodeDisconnected?.(disconnectedNodeId, reason);
      } catch (error) {
        options.onError?.("watch node disconnect cleanup failed", error);
      }
  };
  const armExpiry = (session) => {
    clearTimeout(session.expiresTimer);
    session.expiresTimer = setTimeout(
      () => closeSession(session, "session expired"),
      SESSION_IDLE_MS,
    );
    session.expiresTimer.unref?.();
  };
  const touchSession = (session) => {
    session.lastSeenAtMs = now();
    armExpiry(session);
  };
  const sendQueuedEvent = (res, queued) => {
    if (res.writableEnded) return false;
    try {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(`{"ok":true,"event":${queued.json}}`);
      return true;
    } catch {
      return false;
    }
  };
  const enqueue = (session, queued) => {
    if (sessionsByToken.get(session.token) !== session || session.invalidatedReason) return false;
    if (!queued || queued.byteLength > MAX_QUEUED_EVENT_BYTES) {
      closeSession(session, "event payload too large");
      return false;
    }
    if (session.waiter) {
      const waiter = session.waiter;
      session.waiter = void 0;
      clearTimeout(waiter.timer);
      if (!sendQueuedEvent(waiter.res, queued)) {
        closeSession(session, "event delivery failed");
        return false;
      }
      return true;
    }
    if (
      session.queue.length >= MAX_QUEUED_EVENTS ||
      session.queuedBytes + queued.byteLength > MAX_QUEUED_BYTES
    ) {
      closeSession(session, "event queue overflow");
      return false;
    }
    session.queue.push(queued);
    session.queuedBytes += queued.byteLength;
    return true;
  };
  const serializeEvent = (event, payload) => {
    try {
      const json = JSON.stringify({
        event,
        ...(payload === void 0 ? {} : { payload }),
      });
      return {
        json,
        byteLength: Buffer.byteLength(json),
      };
    } catch {
      return null;
    }
  };
  const serializeRawEvent = (event, payloadJSON) => {
    const eventJSON = JSON.stringify(event);
    if (!payloadJSON) {
      const json = `{"event":${eventJSON}}`;
      return {
        json,
        byteLength: Buffer.byteLength(json),
      };
    }
    const prefix = `{"event":${eventJSON},"payload":`;
    const byteLength =
      Buffer.byteLength(prefix) + Buffer.byteLength(payloadJSON.json) + Buffer.byteLength("}");
    if (byteLength > MAX_QUEUED_EVENT_BYTES) return null;
    return {
      json: `${prefix}${payloadJSON.json}}`,
      byteLength,
    };
  };
  const createTransport = (session) => ({
    send: (event, payload) => enqueue(session, serializeEvent(event, payload)),
    sendRaw: (event, payloadJSON) => enqueue(session, serializeRawEvent(event, payloadJSON)),
    checkConnectivity: async () => {
      if (session.invalidatedReason)
        return {
          ok: false,
          error: {
            code: "NOT_CONNECTED",
            message: session.invalidatedReason,
          },
        };
      return now() - session.lastSeenAtMs < SESSION_IDLE_MS
        ? { ok: true }
        : {
            ok: false,
            error: {
              code: "NOT_CONNECTED",
              message: "watch node poll expired",
            },
          };
    },
  });
  const getSession = (req, res) => {
    const token = readBearerToken(req);
    const session = token ? sessionsByToken.get(token) : void 0;
    if (!session) {
      sendUnauthorized(res);
      return null;
    }
    if (session.invalidatedReason) {
      closeSession(session, session.invalidatedReason);
      sendUnauthorized(res);
      return null;
    }
    touchSession(session);
    return session;
  };
  const handleChallenge = (req, res) => {
    if ((req.method ?? "GET").toUpperCase() !== "GET") {
      sendMethodNotAllowed(res, "GET");
      return;
    }
    const { rateLimitKey: clientKey } = resolveWatchClientAddress(req, options.getConfig());
    const rateLimit = options.rateLimiter?.check(clientKey, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE);
    if (rateLimit && !rateLimit.allowed) {
      sendRateLimited(res, rateLimit.retryAfterMs);
      return;
    }
    options.rateLimiter?.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE);
    const challenge = challenges.issue(clientKey, now());
    res.setHeader("Cache-Control", "no-store");
    sendJson(res, 200, {
      ok: true,
      ...challenge,
    });
  };
  const handleConnect = async (req, res) => {
    if ((req.method ?? "").toUpperCase() !== "POST") {
      sendMethodNotAllowed(res);
      return;
    }
    const responseLifecycle = trackResponseLifecycle(res);
    const body = await readJsonBodyOrError(req, res, MAX_BODY_BYTES);
    if (body === void 0) return;
    if (!validateConnectParams(body)) {
      sendInvalidRequest(
        res,
        `invalid connect params: ${formatValidationErrors(validateConnectParams.errors)}`,
      );
      return;
    }
    const connect = body;
    if (!isCanonicalWatchNode(connect)) {
      sendInvalidRequest(res, "unsupported watch node identity or capability surface");
      return;
    }
    const auth = connect.auth;
    const bootstrapToken = auth?.bootstrapToken?.trim() || null;
    const deviceToken = auth?.deviceToken?.trim() || null;
    const expectedAuthField = bootstrapToken
      ? "bootstrapToken"
      : deviceToken
        ? "deviceToken"
        : null;
    const authFields = Object.keys(auth ?? {});
    if (
      !expectedAuthField ||
      authFields.length !== 1 ||
      authFields[0] !== expectedAuthField ||
      !connect.device
    ) {
      sendUnauthorized(res);
      return;
    }
    const current = now();
    const { clientIp, rateLimitKey: clientKey } = resolveWatchClientAddress(
      req,
      options.getConfig(),
    );
    if (
      !challenges.consume(connect.device.nonce, clientKey, current) ||
      Math.abs(current - connect.device.signedAt) > SIGNATURE_SKEW_MS
    ) {
      sendUnauthorized(res);
      return;
    }
    const publicKey = normalizeDevicePublicKeyBase64Url(connect.device.publicKey);
    const derivedDeviceId = publicKey ? deriveDeviceIdFromPublicKey(publicKey) : null;
    if (!publicKey || !derivedDeviceId || derivedDeviceId !== connect.device.id) {
      sendUnauthorized(res);
      return;
    }
    if (
      !resolveDeviceSignaturePayloadVersion({
        device: {
          ...connect.device,
          publicKey,
        },
        connectParams: connect,
        role: "node",
        scopes: [],
        signedAtMs: connect.device.signedAt,
        nonce: connect.device.nonce,
      })
    ) {
      sendUnauthorized(res);
      return;
    }
    const authDecision = await resolveConnectAuthDecision({
      state: {
        authResult: {
          ok: false,
          reason: "token_mismatch",
        },
        authOk: false,
        authMethod: "token",
        sharedAuthOk: false,
        sharedAuthProvided: false,
        ...(bootstrapToken ? { bootstrapTokenCandidate: bootstrapToken } : {}),
        ...(deviceToken
          ? {
              deviceTokenCandidate: deviceToken,
              deviceTokenCandidateSource: "explicit-device-token",
            }
          : {}),
      },
      hasDeviceIdentity: true,
      deviceId: derivedDeviceId,
      publicKey,
      role: "node",
      scopes: [],
      rateLimiter: options.rateLimiter,
      clientIp: clientKey,
      verifyBootstrapToken: async (params) =>
        await verifyDeviceBootstrapToken({
          ...params,
          baseDir: options.pairingBaseDir,
        }),
      verifyDeviceToken: async (params) =>
        await verifyDeviceToken({
          ...params,
          baseDir: options.pairingBaseDir,
        }),
    });
    if (!authDecision.authOk) {
      if (authDecision.authResult.rateLimited)
        sendRateLimited(res, authDecision.authResult.retryAfterMs ?? 0);
      else sendUnauthorized(res);
      return;
    }
    let issuedDeviceToken = deviceToken;
    let setupBootstrapAccepted = false;
    if (bootstrapToken) {
      const existing = await getPairedDevice(derivedDeviceId, options.pairingBaseDir);
      if (existing && existing.publicKey !== publicKey) {
        sendUnauthorized(res);
        return;
      }
      const profile = await getBoundDeviceBootstrapProfile({
        token: bootstrapToken,
        deviceId: derivedDeviceId,
        publicKey,
        baseDir: options.pairingBaseDir,
      });
      if (!profile || !isNodePairingSetupBootstrapProfile(profile)) {
        sendUnauthorized(res);
        return;
      }
      if (existing)
        issuedDeviceToken =
          (
            await ensureDeviceToken({
              deviceId: derivedDeviceId,
              role: "node",
              scopes: [],
              baseDir: options.pairingBaseDir,
            })
          )?.token ?? null;
      if (!issuedDeviceToken) {
        const pairing = await requestDevicePairing(
          {
            deviceId: derivedDeviceId,
            publicKey,
            displayName: connect.client.displayName,
            platform: connect.client.platform,
            deviceFamily: connect.client.deviceFamily,
            clientId: connect.client.id,
            clientMode: connect.client.mode,
            role: "node",
            roles: ["node"],
            scopes: [],
            remoteIp: clientIp,
            silent: true,
          },
          options.pairingBaseDir,
        );
        const approved = await approveBootstrapDevicePairing(
          pairing.request.requestId,
          profile,
          options.pairingBaseDir,
        );
        if (approved?.status !== "approved") {
          sendUnauthorized(res);
          return;
        }
        issuedDeviceToken = approved.device.tokens?.node?.token ?? null;
        options.broadcast(
          "device.pair.resolved",
          {
            requestId: pairing.request.requestId,
            deviceId: derivedDeviceId,
            decision: "approved",
            ts: current,
          },
          { dropIfSlow: true },
        );
      }
      setupBootstrapAccepted = Boolean(issuedDeviceToken);
    } else if (deviceToken) {
      if (
        (await getPairedDevice(derivedDeviceId, options.pairingBaseDir))?.publicKey !== publicKey
      ) {
        sendUnauthorized(res);
        return;
      }
    }
    if (!issuedDeviceToken) {
      sendUnauthorized(res);
      return;
    }
    const nodeSnapshot = await beginNodePairingConnect(derivedDeviceId, options.pairingBaseDir);
    let cleanupClaim = nodeSnapshot.cleanupClaim;
    try {
      let reconciliation;
      try {
        reconciliation = await reconcileNodePairingOnConnect({
          cfg: options.getConfig(),
          connectParams: connect,
          pairedNode: nodeSnapshot.pairedNode,
          reportedClientIp: clientIp,
          requestPairing: async (input) => {
            if (nodeSnapshot.pairedNode && options.nodeReapprovalCoordinator)
              return await options.nodeReapprovalCoordinator.request({
                input,
                cleanupClaim,
                baseDir: options.pairingBaseDir,
              });
            if (!options.rateLimiter)
              return await requestNodePairing(input, options.pairingBaseDir);
            return await withSerializedRateLimitAttempt({
              ip: clientKey,
              scope: AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING,
              run: async () => {
                const rateCheck = options.rateLimiter?.check(
                  clientKey,
                  AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING,
                );
                if (rateCheck && !rateCheck.allowed)
                  throw new WatchNodePairingRateLimitError(rateCheck.retryAfterMs);
                const result = await requestNodePairing(input, options.pairingBaseDir);
                options.rateLimiter?.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING);
                return result;
              },
            });
          },
        });
      } catch (error) {
        if (error instanceof WatchNodePairingRateLimitError) {
          sendRateLimited(res, error.retryAfterMs);
          return;
        }
        throw error;
      }
      if (reconciliation.pendingPairing)
        broadcastPairingSuperseded(options.broadcast, reconciliation.pendingPairing, current);
      if (
        setupBootstrapAccepted &&
        !nodeSnapshot.pairedNode &&
        reconciliation.pendingPairing &&
        hasOnlyBoundedWatchSurface(connect)
      ) {
        const approved = await approveNodePairing(
          reconciliation.pendingPairing.request.requestId,
          { callerScopes: [ADMIN_SCOPE, PAIRING_SCOPE, WRITE_SCOPE] },
          options.pairingBaseDir,
        );
        if (approved && "node" in approved) {
          options.broadcast(
            "node.pair.resolved",
            {
              requestId: reconciliation.pendingPairing.request.requestId,
              nodeId: derivedDeviceId,
              decision: "approved",
              ts: current,
            },
            { dropIfSlow: true },
          );
          reconciliation = {
            ...reconciliation,
            effectiveCaps: reconciliation.declaredCaps,
            effectiveCommands: reconciliation.declaredCommands,
            effectivePermissions: reconciliation.declaredPermissions,
            pendingPairing: void 0,
            shouldClearPendingPairings: true,
          };
        }
      }
      if (reconciliation.pendingPairing?.created)
        options.broadcast("node.pair.requested", reconciliation.pendingPairing.request, {
          dropIfSlow: true,
        });
      let revokedBootstrapTokenRecord;
      if (closed || responseLifecycle.isAborted()) return;
      if (bootstrapToken) {
        const redemption = await redeemDeviceBootstrapTokenProfile({
          token: bootstrapToken,
          role: "node",
          scopes: [],
          baseDir: options.pairingBaseDir,
        });
        if (!redemption.recorded || !redemption.fullyRedeemed) {
          sendUnauthorized(res);
          return;
        }
        const revoked = await revokeDeviceBootstrapToken({
          token: bootstrapToken,
          baseDir: options.pairingBaseDir,
        });
        if (!revoked.removed || !revoked.record) {
          sendUnauthorized(res);
          return;
        }
        revokedBootstrapTokenRecord = revoked.record;
      }
      let finalTokenVerification;
      try {
        finalTokenVerification = await verifyDeviceToken({
          deviceId: derivedDeviceId,
          token: issuedDeviceToken,
          role: "node",
          scopes: [],
          baseDir: options.pairingBaseDir,
        });
      } catch (error) {
        if (revokedBootstrapTokenRecord)
          await restoreDeviceBootstrapToken({
            record: revokedBootstrapTokenRecord,
            baseDir: options.pairingBaseDir,
          });
        throw error;
      }
      if (!finalTokenVerification.ok) {
        sendUnauthorized(res);
        return;
      }
      if (closed || responseLifecycle.isAborted()) {
        if (revokedBootstrapTokenRecord)
          await restoreDeviceBootstrapToken({
            record: revokedBootstrapTokenRecord,
            baseDir: options.pairingBaseDir,
          });
        return;
      }
      const registeredConnect = connect;
      registeredConnect.declaredCaps = reconciliation.declaredCaps;
      registeredConnect.declaredCommands = reconciliation.declaredCommands;
      registeredConnect.declaredPermissions = reconciliation.declaredPermissions;
      registeredConnect.caps = reconciliation.effectiveCaps;
      registeredConnect.commands = reconciliation.effectiveCommands;
      registeredConnect.permissions = reconciliation.effectivePermissions;
      let session;
      try {
        const previous = sessionsByNodeId.get(derivedDeviceId);
        const connId = randomUUID();
        session = {
          token: randomBytes(32).toString("base64url"),
          nodeId: derivedDeviceId,
          connId,
          lastSeenAtMs: now(),
          expiresTimer: setTimeout(() => void 0, SESSION_IDLE_MS),
          queue: [],
          queuedBytes: 0,
        };
        const client = {
          socket: void 0,
          connect: registeredConnect,
          connId,
          isDeviceTokenAuth: true,
          usesSharedGatewayAuth: false,
          clientIp,
        };
        const nodeSession = options.nodeRegistry.registerTransport(
          client,
          { remoteIp: clientIp },
          createTransport(session),
        );
        sessionsByToken.set(session.token, session);
        sessionsByNodeId.set(session.nodeId, session);
        armExpiry(session);
        if (previous) closeSession(previous, "replaced by a newer watch session");
        options.onNodeConnected?.(nodeSession);
        sendJson(res, 200, {
          ok: true,
          sessionToken: session.token,
          deviceToken: issuedDeviceToken,
          nodeId: session.nodeId,
          protocol: 4,
          pollTimeoutMs: POLL_TIMEOUT_MS,
        });
        if (!(await responseLifecycle.completed)) {
          closeSession(session, "connect response aborted");
          if (revokedBootstrapTokenRecord)
            await restoreDeviceBootstrapToken({
              record: revokedBootstrapTokenRecord,
              baseDir: options.pairingBaseDir,
            });
          return;
        }
        options.rateLimiter?.reset(clientKey, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE);
        if (reconciliation.shouldClearPendingPairings && cleanupClaim) {
          const claim = cleanupClaim;
          cleanupClaim = void 0;
          try {
            const resolvedPairings = options.nodeReapprovalCoordinator
              ? await options.nodeReapprovalCoordinator.finalizeCleanup(claim)
              : await finalizeNodePairingCleanupClaim(claim);
            const resolvedAt = now();
            for (const resolved of resolvedPairings)
              options.broadcast(
                "node.pair.resolved",
                {
                  requestId: resolved.requestId,
                  nodeId: resolved.nodeId,
                  decision: "rejected",
                  ts: resolvedAt,
                },
                { dropIfSlow: true },
              );
          } catch (error) {
            options.onError?.("watch node pending-pairing cleanup failed", error);
          }
        }
        updatePairedNodeMetadata(
          session.nodeId,
          { lastConnectedAtMs: nodeSession.connectedAtMs },
          options.pairingBaseDir,
        ).catch((error) =>
          options.onError?.("watch node last-connect metadata update failed", error),
        );
      } catch (error) {
        if (session) closeSession(session, "connect failed");
        if (revokedBootstrapTokenRecord)
          await restoreDeviceBootstrapToken({
            record: revokedBootstrapTokenRecord,
            baseDir: options.pairingBaseDir,
          });
        throw error;
      }
    } finally {
      if (cleanupClaim) await releaseNodePairingCleanupClaim(cleanupClaim);
    }
  };
  const handlePoll = async (req, res) => {
    if ((req.method ?? "").toUpperCase() !== "POST") {
      sendMethodNotAllowed(res);
      return;
    }
    const session = getSession(req, res);
    if (!session) return;
    const queued = session.queue.shift();
    if (queued) {
      session.queuedBytes -= queued.byteLength;
      if (!sendQueuedEvent(res, queued)) closeSession(session, "event delivery failed");
      return;
    }
    if (session.waiter) {
      clearTimeout(session.waiter.timer);
      sendJson(session.waiter.res, 409, {
        ok: false,
        reason: "superseded poll",
      });
    }
    const timer = setTimeout(() => {
      if (session.waiter?.res !== res) return;
      session.waiter = void 0;
      if (!res.writableEnded)
        sendJson(res, 200, {
          ok: true,
          event: null,
        });
    }, POLL_TIMEOUT_MS);
    timer.unref?.();
    session.waiter = {
      res,
      timer,
    };
    res.once("close", () => {
      if (!res.writableEnded && session.waiter?.res === res) {
        clearTimeout(session.waiter.timer);
        session.waiter = void 0;
        closeSession(session, "poll connection closed");
      }
    });
  };
  const handleDisconnect = (req, res) => {
    if ((req.method ?? "").toUpperCase() !== "POST") {
      sendMethodNotAllowed(res);
      return;
    }
    const session = getSession(req, res);
    if (!session) return;
    closeSession(session, "watch disconnected");
    sendJson(res, 200, { ok: true });
  };
  const handleResult = async (req, res) => {
    if ((req.method ?? "").toUpperCase() !== "POST") {
      sendMethodNotAllowed(res);
      return;
    }
    const session = getSession(req, res);
    if (!session) return;
    const body = await readJsonBodyOrError(req, res, MAX_BODY_BYTES);
    if (body === void 0) return;
    if (!isStringRecord(body) || typeof body.id !== "string" || typeof body.ok !== "boolean") {
      sendInvalidRequest(res, "invalid node invoke result");
      return;
    }
    const error = isStringRecord(body.error)
      ? {
          ...(typeof body.error.code === "string" ? { code: body.error.code } : {}),
          ...(typeof body.error.message === "string" ? { message: body.error.message } : {}),
        }
      : null;
    sendJson(
      res,
      200,
      options.nodeRegistry.handleInvokeResult({
        id: body.id,
        nodeId: session.nodeId,
        connId: session.connId,
        ok: body.ok,
        payload: body.payload,
        payloadJSON: typeof body.payloadJSON === "string" ? body.payloadJSON : null,
        error,
      })
        ? { ok: true }
        : {
            ok: true,
            ignored: true,
          },
    );
  };
  const handleRequest = async (req, res) => {
    const path = normalizePath(req);
    if (!path?.startsWith(`${BASE_PATH}/`)) return false;
    if (closed) {
      sendJson(res, 503, {
        ok: false,
        error: "gateway shutting down",
      });
      return true;
    }
    res.setHeader("Cache-Control", "no-store");
    switch (path) {
      case CHALLENGE_PATH:
        handleChallenge(req, res);
        return true;
      case CONNECT_PATH:
        await handleConnect(req, res);
        return true;
      case DISCONNECT_PATH:
        handleDisconnect(req, res);
        return true;
      case POLL_PATH:
        await handlePoll(req, res);
        return true;
      case RESULT_PATH:
        await handleResult(req, res);
        return true;
      default:
        sendJson(res, 404, {
          ok: false,
          error: "not found",
        });
        return true;
    }
  };
  return {
    handleRequest,
    invalidateSessionsForDevice: (deviceId, opts) => {
      if (opts?.role && opts.role !== "node") return;
      const session = sessionsByNodeId.get(deviceId);
      if (session) session.invalidatedReason = opts?.reason ?? "device-invalidated";
    },
    disconnectSessionsForDevice: (deviceId, opts) => {
      if (opts?.role && opts.role !== "node") return;
      const session = sessionsByNodeId.get(deviceId);
      if (session) closeSession(session, session.invalidatedReason ?? "device removed");
    },
    close: () => {
      closed = true;
      for (const session of sessionsByToken.values())
        closeSession(session, "gateway shutting down");
      challenges.clear();
    },
  };
}
//#endregion
export { createWatchNodeHttpRuntime };
