import { createHash, createPrivateKey, sign } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import {
  i as loadOrCreateProcessDeviceIdentity,
  s as signDevicePayload,
} from "./device-identity-BmJfeLuX.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as normalizeHostname } from "./hostname-DAZapKzN.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { l as writeJson } from "./json-7OTJmMaB.js";
import { o as tryReadJson } from "./json-files-CTWRDHag.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  i as createApnsResponseBodyCapture,
  n as appendApnsResponseBodyCapture,
  r as connectApnsHttp2Session,
  t as APNS_HTTP2_CANCEL_CODE,
} from "./push-apns-http2-Cbx-N5N7.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/push-apns.relay.ts
/** Hosted APNs relay origin used only when registrations prove they were minted there. */
const DEFAULT_APNS_RELAY_BASE_URL = "https://ios-push-relay.openclaw.ai";
const DEFAULT_APNS_SANDBOX_RELAY_BASE_URL = "https://ios-push-relay-sandbox.openclaw.ai";
const DEFAULT_APNS_RELAY_TIMEOUT_MS = 1e4;
const APNS_RELAY_MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
const GATEWAY_DEVICE_ID_HEADER = "x-openclaw-gateway-device-id";
const GATEWAY_SIGNATURE_HEADER = "x-openclaw-gateway-signature";
const GATEWAY_SIGNED_AT_HEADER = "x-openclaw-gateway-signed-at-ms";
function normalizeNonEmptyString$1(value) {
  const trimmed = normalizeOptionalString(value) ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
function normalizeTimeoutMs(value) {
  const raw =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? normalizeOptionalString(value)
        : void 0;
  if (raw === void 0 || raw === "") return DEFAULT_APNS_RELAY_TIMEOUT_MS;
  return resolveTimerTimeoutMs(Number(raw), DEFAULT_APNS_RELAY_TIMEOUT_MS, 1e3);
}
function readAllowHttp(value) {
  const normalized = normalizeOptionalString(value)
    ? normalizeLowercaseStringOrEmpty(value)
    : void 0;
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
function isLoopbackRelayHostname(hostname) {
  const normalized = normalizeHostname(hostname);
  return (
    normalized === "localhost" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    /^127(?:\.\d{1,3}){3}$/.test(normalized)
  );
}
function parseReason$1(value) {
  return typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function parseRelayEnvironment(value) {
  const normalized = typeof value === "string" ? normalizeLowercaseStringOrEmpty(value) : "";
  if (normalized === "sandbox" || normalized === "production") return normalized;
}
/** Validate and canonicalize an APNs relay base URL for config and registration origins. */
function normalizeApnsRelayBaseUrl(baseUrl, env = process.env) {
  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:")
      throw new Error("unsupported protocol");
    if (!parsed.hostname) throw new Error("host required");
    if (parsed.protocol === "http:" && !readAllowHttp(env.OPENCLAW_APNS_RELAY_ALLOW_HTTP))
      throw new Error(
        "http relay URLs require OPENCLAW_APNS_RELAY_ALLOW_HTTP=true (development only)",
      );
    if (parsed.protocol === "http:" && !isLoopbackRelayHostname(parsed.hostname))
      throw new Error("http relay URLs are limited to loopback hosts");
    if (parsed.username || parsed.password) throw new Error("userinfo is not allowed");
    if (parsed.search || parsed.hash) throw new Error("query and fragment are not allowed");
    return {
      ok: true,
      value: parsed.toString().replace(/\/+$/, ""),
    };
  } catch (err) {
    return {
      ok: false,
      error: formatErrorMessage(err),
    };
  }
}
function buildRelayGatewaySignaturePayload(params) {
  return [
    "openclaw-relay-send-v1",
    params.gatewayDeviceId.trim(),
    String(Math.trunc(params.signedAtMs)),
    params.bodyJson,
  ].join("\n");
}
/** Resolve the relay endpoint from env/config and require it to match relay-minted registrations. */
function resolveApnsRelayConfigFromEnv(env = process.env, gatewayConfig, options = {}) {
  const configuredRelay = gatewayConfig?.push?.apns?.relay;
  const envBaseUrl = normalizeNonEmptyString$1(env.OPENCLAW_APNS_RELAY_BASE_URL);
  const configBaseUrl = normalizeNonEmptyString$1(configuredRelay?.baseUrl);
  const explicitBaseUrl = envBaseUrl ?? configBaseUrl;
  const normalizedRegistrationOrigin = options.registrationRelayOrigin
    ? normalizeApnsRelayBaseUrl(options.registrationRelayOrigin, env)
    : void 0;
  if (normalizedRegistrationOrigin && !normalizedRegistrationOrigin.ok)
    return {
      ok: false,
      error: `invalid relay registration origin (${options.registrationRelayOrigin}): ${normalizedRegistrationOrigin.error}`,
    };
  const hostedRelayBaseUrl =
    normalizedRegistrationOrigin?.value === DEFAULT_APNS_RELAY_BASE_URL
      ? DEFAULT_APNS_RELAY_BASE_URL
      : normalizedRegistrationOrigin?.value === DEFAULT_APNS_SANDBOX_RELAY_BASE_URL
        ? DEFAULT_APNS_SANDBOX_RELAY_BASE_URL
        : void 0;
  const baseUrl = explicitBaseUrl ?? hostedRelayBaseUrl;
  const baseUrlSource = envBaseUrl
    ? "OPENCLAW_APNS_RELAY_BASE_URL"
    : configBaseUrl
      ? "gateway.push.apns.relay.baseUrl"
      : "default APNs relay base URL";
  if (!baseUrl)
    return {
      ok: false,
      error:
        "APNs relay config missing: set gateway.push.apns.relay.baseUrl or OPENCLAW_APNS_RELAY_BASE_URL for relay registrations without the hosted relay origin",
    };
  const normalizedBaseUrl = normalizeApnsRelayBaseUrl(baseUrl, env);
  if (!normalizedBaseUrl.ok)
    return {
      ok: false,
      error: `invalid ${baseUrlSource} (${baseUrl}): ${normalizedBaseUrl.error}`,
    };
  if (
    normalizedRegistrationOrigin &&
    normalizedRegistrationOrigin.value !== normalizedBaseUrl.value
  )
    return {
      ok: false,
      error: `APNs relay config origin mismatch: registration uses ${normalizedRegistrationOrigin.value} but ${baseUrlSource} is ${normalizedBaseUrl.value}`,
    };
  return {
    ok: true,
    value: {
      baseUrl: normalizedBaseUrl.value,
      timeoutMs: normalizeTimeoutMs(
        env.OPENCLAW_APNS_RELAY_TIMEOUT_MS ?? configuredRelay?.timeoutMs,
      ),
    },
  };
}
var ApnsRelayResponseTooLargeError = class extends Error {
  constructor(size, maxBytes) {
    super(`APNs relay response exceeded ${maxBytes} bytes (${size} bytes received)`);
    this.size = size;
    this.maxBytes = maxBytes;
    this.name = "ApnsRelayResponseTooLargeError";
  }
};
async function sendApnsRelayRequest(params) {
  const response = await fetch(`${params.relayConfig.baseUrl}/v1/push/send`, {
    method: "POST",
    redirect: "manual",
    headers: {
      authorization: `Bearer ${params.sendGrant}`,
      "content-type": "application/json",
      [GATEWAY_DEVICE_ID_HEADER]: params.gatewayDeviceId,
      [GATEWAY_SIGNATURE_HEADER]: params.signature,
      [GATEWAY_SIGNED_AT_HEADER]: String(params.signedAtMs),
    },
    body: params.bodyJson,
    signal: AbortSignal.timeout(params.relayConfig.timeoutMs),
  });
  if (response.status >= 300 && response.status < 400)
    return {
      ok: false,
      status: response.status,
      reason: "RelayRedirectNotAllowed",
    };
  let json;
  try {
    const buffer = await readResponseWithLimit(response, APNS_RELAY_MAX_RESPONSE_BYTES, {
      onOverflow: ({ size, maxBytes }) => new ApnsRelayResponseTooLargeError(size, maxBytes),
    });
    json = JSON.parse(new TextDecoder("utf-8").decode(buffer));
  } catch (err) {
    if (err instanceof ApnsRelayResponseTooLargeError)
      return {
        ok: false,
        status: response.status,
        reason: "RelayResponseTooLarge",
      };
    json = null;
  }
  const body = json && typeof json === "object" && !Array.isArray(json) ? json : {};
  const status =
    typeof body.status === "number" && Number.isFinite(body.status)
      ? Math.trunc(body.status)
      : response.status;
  const environment = parseRelayEnvironment(body.environment);
  return {
    ok: typeof body.ok === "boolean" ? body.ok : response.ok && status >= 200 && status < 300,
    status,
    apnsId: parseReason$1(body.apnsId),
    reason: parseReason$1(body.reason),
    ...(environment ? { environment } : {}),
    tokenSuffix: parseReason$1(body.tokenSuffix),
  };
}
/** Sign and send an APNs relay push using the gateway device identity. */
async function sendApnsRelayPush(params) {
  const sender = params.requestSender ?? sendApnsRelayRequest;
  const gatewayIdentity = params.gatewayIdentity ?? loadOrCreateProcessDeviceIdentity();
  const signedAtMs = Date.now();
  const bodyJson = JSON.stringify({
    relayHandle: params.relayHandle,
    pushType: params.pushType,
    priority: Number(params.priority),
    payload: params.payload,
  });
  const signature = signDevicePayload(
    gatewayIdentity.privateKeyPem,
    buildRelayGatewaySignaturePayload({
      gatewayDeviceId: gatewayIdentity.deviceId,
      signedAtMs,
      bodyJson,
    }),
  );
  return await sender({
    relayConfig: params.relayConfig,
    sendGrant: params.sendGrant,
    relayHandle: params.relayHandle,
    gatewayDeviceId: gatewayIdentity.deviceId,
    signature,
    signedAtMs,
    bodyJson,
    pushType: params.pushType,
    priority: params.priority,
    payload: params.payload,
  });
}
//#endregion
//#region src/infra/push-apns.ts
const EXEC_APPROVAL_GENERIC_ALERT_BODY = "Open OpenClaw to review this request.";
const EXEC_APPROVAL_NOTIFICATION_CATEGORY = "openclaw.exec-approval";
const APNS_STATE_FILENAME = "push/apns-registrations.json";
const APNS_JWT_TTL_MS = 3e3 * 1e3;
const DEFAULT_APNS_TIMEOUT_MS = 1e4;
const MAX_NODE_ID_LENGTH = 256;
const MAX_TOPIC_LENGTH = 255;
const MAX_APNS_TOKEN_HEX_LENGTH = 512;
const MAX_RELAY_IDENTIFIER_LENGTH = 256;
const MAX_SEND_GRANT_LENGTH = 1024;
const withLock = createAsyncLock();
let cachedJwt = null;
function resolveApnsRegistrationPath(baseDir) {
  const root = baseDir ?? resolveStateDir();
  return path.join(root, APNS_STATE_FILENAME);
}
function normalizeNodeId(value) {
  return value.trim();
}
function isValidNodeId(value) {
  return value.length > 0 && value.length <= MAX_NODE_ID_LENGTH;
}
function normalizeApnsToken(value) {
  return normalizeLowercaseStringOrEmpty(value.trim().replace(/[<>\s]/g, ""));
}
function normalizeRelayHandle(value) {
  return value.trim();
}
function normalizeInstallationId(value) {
  return value.trim();
}
function validateRelayIdentifier(value, fieldName, maxLength = MAX_RELAY_IDENTIFIER_LENGTH) {
  if (!value) throw new Error(`${fieldName} required`);
  if (value.length > maxLength) throw new Error(`${fieldName} too long`);
  if (/[^\x21-\x7e]/.test(value)) throw new Error(`${fieldName} invalid`);
  return value;
}
function normalizeTopic(value) {
  return value.trim();
}
function isValidTopic(value) {
  return value.length > 0 && value.length <= MAX_TOPIC_LENGTH;
}
function normalizeTokenDebugSuffix(value) {
  if (typeof value !== "string") return;
  const normalized = normalizeLowercaseStringOrEmpty(value.trim()).replace(/[^0-9a-z]/g, "");
  return normalized.length > 0 ? normalized.slice(-8) : void 0;
}
function isLikelyApnsToken(value) {
  return value.length <= MAX_APNS_TOKEN_HEX_LENGTH && /^[0-9a-f]{32,}$/i.test(value);
}
function parseReason(body) {
  const trimmed = body.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed.reason === "string" && parsed.reason.trim().length > 0
      ? parsed.reason.trim()
      : truncateUtf16Safe(trimmed, 200);
  } catch {
    return truncateUtf16Safe(trimmed, 200);
  }
}
function toBase64UrlBytes(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
function toBase64UrlJson(value) {
  return toBase64UrlBytes(Buffer.from(JSON.stringify(value)));
}
function getJwtCacheKey(auth) {
  const keyHash = createHash("sha256").update(auth.privateKey).digest("hex");
  return `${auth.teamId}:${auth.keyId}:${keyHash}`;
}
function getApnsBearerToken(auth, nowMs = Date.now()) {
  const cacheKey = getJwtCacheKey(auth);
  if (cachedJwt && cachedJwt.cacheKey === cacheKey && nowMs < cachedJwt.expiresAtMs)
    return cachedJwt.token;
  const iat = Math.floor(nowMs / 1e3);
  const signingInput = `${toBase64UrlJson({
    alg: "ES256",
    kid: auth.keyId,
    typ: "JWT",
  })}.${toBase64UrlJson({
    iss: auth.teamId,
    iat,
  })}`;
  const token = `${signingInput}.${toBase64UrlBytes(
    sign("sha256", Buffer.from(signingInput, "utf8"), {
      key: createPrivateKey(auth.privateKey),
      dsaEncoding: "ieee-p1363",
    }),
  )}`;
  cachedJwt = {
    cacheKey,
    token,
    expiresAtMs: nowMs + APNS_JWT_TTL_MS,
  };
  return token;
}
function normalizePrivateKey(value) {
  return value.trim().replace(/\\n/g, "\n");
}
function normalizeNonEmptyString(value) {
  const trimmed = normalizeOptionalString(value) ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
function normalizeDistribution(value) {
  if (typeof value !== "string") return null;
  return (normalizeOptionalString(value) ? normalizeLowercaseStringOrEmpty(value) : void 0) ===
    "official"
    ? "official"
    : null;
}
function normalizeRelayOrigin(value) {
  if (typeof value !== "string") return;
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return;
  const normalized = normalizeApnsRelayBaseUrl(trimmed, process.env);
  return normalized.ok ? normalized.value : void 0;
}
function normalizeDirectRegistration(record) {
  if (typeof record.nodeId !== "string" || typeof record.token !== "string") return null;
  const nodeId = normalizeNodeId(record.nodeId);
  const token = normalizeApnsToken(record.token);
  const topic = normalizeTopic(typeof record.topic === "string" ? record.topic : "");
  const environment = normalizeApnsEnvironment(record.environment) ?? "sandbox";
  const updatedAtMs =
    typeof record.updatedAtMs === "number" && Number.isFinite(record.updatedAtMs)
      ? Math.trunc(record.updatedAtMs)
      : 0;
  if (!isValidNodeId(nodeId) || !isValidTopic(topic) || !isLikelyApnsToken(token)) return null;
  return {
    nodeId,
    transport: "direct",
    token,
    topic,
    environment,
    updatedAtMs,
  };
}
function normalizeRelayRegistration(record) {
  if (
    typeof record.nodeId !== "string" ||
    typeof record.relayHandle !== "string" ||
    typeof record.sendGrant !== "string" ||
    typeof record.installationId !== "string"
  )
    return null;
  const nodeId = normalizeNodeId(record.nodeId);
  const relayHandle = normalizeRelayHandle(record.relayHandle);
  const sendGrant = record.sendGrant.trim();
  const installationId = normalizeInstallationId(record.installationId);
  const topic = normalizeTopic(typeof record.topic === "string" ? record.topic : "");
  const environment = normalizeApnsEnvironment(record.environment);
  const distribution = normalizeDistribution(record.distribution);
  const relayOrigin = normalizeRelayOrigin(record.relayOrigin);
  const updatedAtMs =
    typeof record.updatedAtMs === "number" && Number.isFinite(record.updatedAtMs)
      ? Math.trunc(record.updatedAtMs)
      : 0;
  if (
    !isValidNodeId(nodeId) ||
    !relayHandle ||
    !sendGrant ||
    !installationId ||
    !isValidTopic(topic) ||
    !environment ||
    distribution !== "official"
  )
    return null;
  return {
    nodeId,
    transport: "relay",
    relayHandle,
    sendGrant,
    installationId,
    topic,
    environment,
    distribution,
    updatedAtMs,
    ...(relayOrigin ? { relayOrigin } : {}),
    tokenDebugSuffix: normalizeTokenDebugSuffix(record.tokenDebugSuffix),
  };
}
function normalizeStoredRegistration(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  const candidate = record;
  if ((normalizeLowercaseStringOrEmpty(candidate.transport) || "direct") === "relay")
    return normalizeRelayRegistration(candidate);
  return normalizeDirectRegistration(candidate);
}
async function loadRegistrationsState(baseDir) {
  const existing = await tryReadJson(resolveApnsRegistrationPath(baseDir));
  if (!existing || typeof existing !== "object") return { registrationsByNodeId: {} };
  const registrations =
    existing.registrationsByNodeId &&
    typeof existing.registrationsByNodeId === "object" &&
    !Array.isArray(existing.registrationsByNodeId)
      ? existing.registrationsByNodeId
      : {};
  const normalized = {};
  for (const [nodeId, record] of Object.entries(registrations)) {
    const registration = normalizeStoredRegistration(record);
    if (registration) {
      const normalizedNodeId = normalizeNodeId(nodeId);
      normalized[isValidNodeId(normalizedNodeId) ? normalizedNodeId : registration.nodeId] =
        registration;
    }
  }
  return { registrationsByNodeId: normalized };
}
async function persistRegistrationsState(state, baseDir) {
  await writeJson(resolveApnsRegistrationPath(baseDir), state, {
    mode: 384,
    dirMode: 448,
    trailingNewline: true,
  });
}
/** Normalizes the APNs environment string accepted by registration inputs. */
function normalizeApnsEnvironment(value) {
  if (typeof value !== "string") return null;
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (normalized === "sandbox" || normalized === "production") return normalized;
  return null;
}
/** Persists a validated direct or relay APNs registration for one node id. */
async function registerApnsRegistration(params) {
  const nodeId = normalizeNodeId(params.nodeId);
  const topic = normalizeTopic(params.topic);
  if (!isValidNodeId(nodeId)) throw new Error("nodeId required");
  if (!isValidTopic(topic)) throw new Error("topic required");
  return await withLock(async () => {
    const state = await loadRegistrationsState(params.baseDir);
    const updatedAtMs = Date.now();
    let next;
    if (params.transport === "relay") {
      const relayHandle = validateRelayIdentifier(
        normalizeRelayHandle(params.relayHandle),
        "relayHandle",
      );
      const sendGrant = validateRelayIdentifier(
        params.sendGrant.trim(),
        "sendGrant",
        MAX_SEND_GRANT_LENGTH,
      );
      const installationId = validateRelayIdentifier(
        normalizeInstallationId(params.installationId),
        "installationId",
      );
      const environment = normalizeApnsEnvironment(params.environment);
      const distribution = normalizeDistribution(params.distribution);
      const relayOrigin = normalizeRelayOrigin(params.relayOrigin);
      if (!environment) throw new Error("relay registrations must use valid APNs environment");
      if (distribution !== "official")
        throw new Error("relay registrations must use official distribution");
      next = {
        nodeId,
        transport: "relay",
        relayHandle,
        sendGrant,
        installationId,
        topic,
        environment,
        distribution,
        updatedAtMs,
        ...(relayOrigin ? { relayOrigin } : {}),
        tokenDebugSuffix: normalizeTokenDebugSuffix(params.tokenDebugSuffix),
      };
    } else {
      const token = normalizeApnsToken(params.token);
      const environment = normalizeApnsEnvironment(params.environment) ?? "sandbox";
      if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
      next = {
        nodeId,
        transport: "direct",
        token,
        topic,
        environment,
        updatedAtMs,
      };
    }
    state.registrationsByNodeId[nodeId] = next;
    await persistRegistrationsState(state, params.baseDir);
    return next;
  });
}
/** Loads one normalized APNs registration by node id. */
async function loadApnsRegistration(nodeId, baseDir) {
  const normalizedNodeId = normalizeNodeId(nodeId);
  if (!normalizedNodeId) return null;
  return (await loadRegistrationsState(baseDir)).registrationsByNodeId[normalizedNodeId] ?? null;
}
/** Loads normalized APNs registrations for the requested node ids, preserving request order. */
async function loadApnsRegistrations(nodeIds, baseDir) {
  const state = await loadRegistrationsState(baseDir);
  const registrations = [];
  for (const nodeId of nodeIds) {
    const normalizedNodeId = normalizeNodeId(nodeId);
    if (!normalizedNodeId) continue;
    const registration = state.registrationsByNodeId[normalizedNodeId];
    if (registration)
      registrations.push({
        nodeId,
        registration,
      });
  }
  return registrations;
}
function isSameApnsRegistration(a, b) {
  if (
    a.nodeId !== b.nodeId ||
    a.transport !== b.transport ||
    a.topic !== b.topic ||
    a.environment !== b.environment ||
    a.updatedAtMs !== b.updatedAtMs
  )
    return false;
  if (a.transport === "direct" && b.transport === "direct") return a.token === b.token;
  if (a.transport === "relay" && b.transport === "relay")
    return (
      a.relayHandle === b.relayHandle &&
      a.sendGrant === b.sendGrant &&
      a.installationId === b.installationId &&
      a.distribution === b.distribution &&
      a.relayOrigin === b.relayOrigin &&
      a.tokenDebugSuffix === b.tokenDebugSuffix
    );
  return false;
}
/** Clears a registration only if storage still contains the caller's observed value. */
async function clearApnsRegistrationIfCurrent(params) {
  const normalizedNodeId = normalizeNodeId(params.nodeId);
  if (!normalizedNodeId) return false;
  return await withLock(async () => {
    const state = await loadRegistrationsState(params.baseDir);
    const current = state.registrationsByNodeId[normalizedNodeId];
    if (!current || !isSameApnsRegistration(current, params.registration)) return false;
    delete state.registrationsByNodeId[normalizedNodeId];
    await persistRegistrationsState(state, params.baseDir);
    return true;
  });
}
/** Returns true for APNs responses that mean the direct device token is no longer usable. */
function shouldInvalidateApnsRegistration(result) {
  if (result.status === 410) return true;
  return result.status === 400 && result.reason?.trim() === "BadDeviceToken";
}
/** Decides whether a failed direct push should clear the persisted registration. */
function shouldClearStoredApnsRegistration(params) {
  if (params.registration.transport !== "direct") return false;
  if (params.overrideEnvironment && params.overrideEnvironment !== params.registration.environment)
    return false;
  return shouldInvalidateApnsRegistration(params.result);
}
/** Resolves direct APNs provider auth from env, accepting inline or file-backed keys. */
async function resolveApnsAuthConfigFromEnv(env = process.env) {
  const teamId = normalizeNonEmptyString(env.OPENCLAW_APNS_TEAM_ID);
  const keyId = normalizeNonEmptyString(env.OPENCLAW_APNS_KEY_ID);
  if (!teamId || !keyId)
    return {
      ok: false,
      error: "APNs auth missing: set OPENCLAW_APNS_TEAM_ID and OPENCLAW_APNS_KEY_ID",
    };
  const inlineKeyRaw =
    normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY_P8) ??
    normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY);
  if (inlineKeyRaw)
    return {
      ok: true,
      value: {
        teamId,
        keyId,
        privateKey: normalizePrivateKey(inlineKeyRaw),
      },
    };
  const keyPath = normalizeNonEmptyString(env.OPENCLAW_APNS_PRIVATE_KEY_PATH);
  if (!keyPath)
    return {
      ok: false,
      error:
        "APNs private key missing: set OPENCLAW_APNS_PRIVATE_KEY_P8 or OPENCLAW_APNS_PRIVATE_KEY_PATH",
    };
  try {
    return {
      ok: true,
      value: {
        teamId,
        keyId,
        privateKey: normalizePrivateKey(await fs.readFile(keyPath, "utf8")),
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: `failed reading OPENCLAW_APNS_PRIVATE_KEY_PATH (${keyPath}): ${formatErrorMessage(err)}`,
    };
  }
}
async function sendApnsRequest(params) {
  const authority =
    params.environment === "production"
      ? "https://api.push.apple.com"
      : "https://api.sandbox.push.apple.com";
  const body = JSON.stringify(params.payload);
  const requestPath = `/3/device/${params.token}`;
  const client = await connectApnsHttp2Session({
    authority,
    timeoutMs: params.timeoutMs,
  });
  return await new Promise((resolve, reject) => {
    let settled = false;
    const fail = (err) => {
      if (settled) return;
      settled = true;
      client.destroy();
      reject(toErrorObject(err, "Non-Error rejection"));
    };
    const finish = (result) => {
      if (settled) return;
      settled = true;
      client.close();
      resolve(result);
    };
    client.once("error", (err) => fail(err));
    const req = client.request({
      ":method": "POST",
      ":path": requestPath,
      authorization: `bearer ${params.bearerToken}`,
      "apns-topic": params.topic,
      "apns-push-type": params.pushType,
      "apns-priority": params.priority,
      "apns-expiration": "0",
      "content-type": "application/json",
      "content-length": Buffer.byteLength(body).toString(),
    });
    let statusCode = 0;
    let apnsId;
    const responseBody = createApnsResponseBodyCapture();
    req.setEncoding("utf8");
    req.setTimeout(params.timeoutMs, () => {
      req.close(APNS_HTTP2_CANCEL_CODE);
      fail(/* @__PURE__ */ new Error(`APNs request timed out after ${params.timeoutMs}ms`));
    });
    req.on("response", (headers) => {
      statusCode = headers[":status"] ?? 0;
      const idHeader = headers["apns-id"];
      if (typeof idHeader === "string" && idHeader.trim().length > 0) apnsId = idHeader.trim();
    });
    req.on("data", (chunk) => {
      if (typeof chunk === "string") appendApnsResponseBodyCapture(responseBody, chunk);
    });
    req.on("end", () => {
      finish({
        status: statusCode,
        apnsId,
        body: responseBody.text,
      });
    });
    req.on("error", (err) => fail(err));
    req.end(body);
  });
}
function resolveApnsTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, DEFAULT_APNS_TIMEOUT_MS, 1e3);
}
function resolveDirectSendContext(params) {
  const token = normalizeApnsToken(params.registration.token);
  if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
  const topic = normalizeTopic(params.registration.topic);
  if (!isValidTopic(topic)) throw new Error("topic required");
  return {
    token,
    topic,
    environment: params.registration.environment,
    bearerToken: getApnsBearerToken(params.auth),
  };
}
function toPushMetadata(params) {
  return {
    kind: params.kind,
    nodeId: params.nodeId,
    ts: Date.now(),
    ...(params.reason ? { reason: params.reason } : {}),
  };
}
function resolveRegistrationDebugSuffix(registration, relayResult) {
  if (registration.transport === "direct") return registration.token.slice(-8);
  return (
    relayResult?.tokenSuffix ?? registration.tokenDebugSuffix ?? registration.relayHandle.slice(-8)
  );
}
function toPushResult(params) {
  const response =
    "body" in params.response
      ? {
          ok: params.response.status === 200,
          status: params.response.status,
          apnsId: params.response.apnsId,
          reason: parseReason(params.response.body),
          environment: params.registration.environment,
          tokenSuffix: params.tokenSuffix,
        }
      : params.response;
  return {
    ok: response.ok,
    status: response.status,
    apnsId: response.apnsId,
    reason: response.reason,
    tokenSuffix:
      params.tokenSuffix ??
      resolveRegistrationDebugSuffix(
        params.registration,
        "tokenSuffix" in response ? response : void 0,
      ),
    topic: params.registration.topic,
    environment: response.environment ?? params.registration.environment,
    transport: params.registration.transport,
  };
}
async function sendDirectApnsPush(params) {
  const { token, topic, environment, bearerToken } = resolveDirectSendContext({
    auth: params.auth,
    registration: params.registration,
  });
  const response = await (params.requestSender ?? sendApnsRequest)({
    token,
    topic,
    environment,
    bearerToken,
    payload: params.payload,
    timeoutMs: resolveApnsTimeoutMs(params.timeoutMs),
    pushType: params.pushType,
    priority: params.priority,
  });
  return toPushResult({
    registration: params.registration,
    response,
    tokenSuffix: token.slice(-8),
  });
}
async function sendRelayApnsPush(params) {
  const response = await sendApnsRelayPush({
    relayConfig: params.relayConfig,
    sendGrant: params.registration.sendGrant,
    relayHandle: params.registration.relayHandle,
    payload: params.payload,
    pushType: params.pushType,
    priority: params.priority,
    gatewayIdentity: params.gatewayIdentity,
    requestSender: params.requestSender,
  });
  return toPushResult({
    registration: params.registration,
    response,
  });
}
function createAlertPayload(params) {
  return {
    aps: {
      alert: {
        title: params.title,
        body: params.body,
      },
      sound: "default",
    },
    openclaw: toPushMetadata({
      kind: "push.test",
      nodeId: params.nodeId,
    }),
  };
}
function createBackgroundPayload(params) {
  return {
    aps: { "content-available": 1 },
    openclaw: toPushMetadata({
      kind: "node.wake",
      reason: params.wakeReason ?? "node.invoke",
      nodeId: params.nodeId,
    }),
  };
}
function resolveExecApprovalAlertBody() {
  return EXEC_APPROVAL_GENERIC_ALERT_BODY;
}
function createExecApprovalAlertPayload(params) {
  return {
    aps: {
      alert: {
        title: "Exec approval required",
        body: resolveExecApprovalAlertBody(),
      },
      sound: "default",
      category: EXEC_APPROVAL_NOTIFICATION_CATEGORY,
      "content-available": 1,
    },
    openclaw: {
      kind: "exec.approval.requested",
      approvalId: params.approvalId,
      gatewayDeviceId: params.gatewayDeviceId,
      ts: Date.now(),
    },
  };
}
function createExecApprovalResolvedPayload(params) {
  return {
    aps: { "content-available": 1 },
    openclaw: {
      kind: "exec.approval.resolved",
      approvalId: params.approvalId,
      gatewayDeviceId: params.gatewayDeviceId,
      ts: Date.now(),
    },
  };
}
/** Sends a visible APNs alert via direct APNs token or relay registration. */
async function sendApnsAlert(params) {
  const payload = createAlertPayload({
    nodeId: params.nodeId,
    title: params.title,
    body: params.body,
  });
  if (params.registration.transport === "relay") {
    const relayParams = params;
    return await sendRelayApnsPush({
      relayConfig: relayParams.relayConfig,
      registration: relayParams.registration,
      payload,
      pushType: "alert",
      priority: "10",
      gatewayIdentity: relayParams.relayGatewayIdentity,
      requestSender: relayParams.relayRequestSender,
    });
  }
  const directParams = params;
  return await sendDirectApnsPush({
    auth: directParams.auth,
    registration: directParams.registration,
    payload,
    timeoutMs: directParams.timeoutMs,
    requestSender: directParams.requestSender,
    pushType: "alert",
    priority: "10",
  });
}
/** Sends a silent background wake via direct APNs token or relay registration. */
async function sendApnsBackgroundWake(params) {
  const payload = createBackgroundPayload({
    nodeId: params.nodeId,
    wakeReason: params.wakeReason,
  });
  if (params.registration.transport === "relay") {
    const relayParams = params;
    return await sendRelayApnsPush({
      relayConfig: relayParams.relayConfig,
      registration: relayParams.registration,
      payload,
      pushType: "background",
      priority: "5",
      gatewayIdentity: relayParams.relayGatewayIdentity,
      requestSender: relayParams.relayRequestSender,
    });
  }
  const directParams = params;
  return await sendDirectApnsPush({
    auth: directParams.auth,
    registration: directParams.registration,
    payload,
    timeoutMs: directParams.timeoutMs,
    requestSender: directParams.requestSender,
    pushType: "background",
    priority: "5",
  });
}
/** Sends an exec-approval alert notification via direct APNs or relay. */
async function sendApnsExecApprovalAlert(params) {
  const payload = createExecApprovalAlertPayload({
    approvalId: params.approvalId,
    gatewayDeviceId: params.gatewayDeviceId,
  });
  if (params.registration.transport === "relay") {
    const relayParams = params;
    return await sendRelayApnsPush({
      relayConfig: relayParams.relayConfig,
      registration: relayParams.registration,
      payload,
      pushType: "alert",
      priority: "10",
      gatewayIdentity: relayParams.relayGatewayIdentity,
      requestSender: relayParams.relayRequestSender,
    });
  }
  const directParams = params;
  return await sendDirectApnsPush({
    auth: directParams.auth,
    registration: directParams.registration,
    payload,
    timeoutMs: directParams.timeoutMs,
    requestSender: directParams.requestSender,
    pushType: "alert",
    priority: "10",
  });
}
/** Sends a silent wake telling the app an exec approval changed state. */
async function sendApnsExecApprovalResolvedWake(params) {
  const payload = createExecApprovalResolvedPayload({
    approvalId: params.approvalId,
    gatewayDeviceId: params.gatewayDeviceId,
  });
  if (params.registration.transport === "relay") {
    const relayParams = params;
    return await sendRelayApnsPush({
      relayConfig: relayParams.relayConfig,
      registration: relayParams.registration,
      payload,
      pushType: "background",
      priority: "5",
      gatewayIdentity: relayParams.relayGatewayIdentity,
      requestSender: relayParams.relayRequestSender,
    });
  }
  const directParams = params;
  return await sendDirectApnsPush({
    auth: directParams.auth,
    registration: directParams.registration,
    payload,
    timeoutMs: directParams.timeoutMs,
    requestSender: directParams.requestSender,
    pushType: "background",
    priority: "5",
  });
}
//#endregion
export {
  registerApnsRegistration as a,
  sendApnsBackgroundWake as c,
  shouldClearStoredApnsRegistration as d,
  resolveApnsRelayConfigFromEnv as f,
  normalizeApnsEnvironment as i,
  sendApnsExecApprovalAlert as l,
  loadApnsRegistration as n,
  resolveApnsAuthConfigFromEnv as o,
  loadApnsRegistrations as r,
  sendApnsAlert as s,
  clearApnsRegistrationIfCurrent as t,
  sendApnsExecApprovalResolvedWake as u,
};
