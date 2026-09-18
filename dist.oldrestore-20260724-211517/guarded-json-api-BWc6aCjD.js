import crypto from "node:crypto";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { d as readResponseWithLimit, l as readResponseTextPrefix } from "./http-body-aoMvQQlg.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import { n as getHeader, t as normalizeProxyIp } from "./proxy-ip-B3QWRNk3.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import "./error-runtime-BIAwr399.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./response-limit-runtime-B_DBKaLw.js";
import "./gateway-runtime-IrTdjV5_.js";
import "./api-CWVFC_kp.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import {
  n as markWebhookReplay,
  t as createWebhookReplayCache,
} from "./webhook-replay-DZI3394J.js";
//#region extensions/voice-call/src/webhook-security.ts
const twilioReplayCache = createWebhookReplayCache();
const plivoReplayCache = createWebhookReplayCache();
const telnyxReplayCache = createWebhookReplayCache();
function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
function createSkippedVerificationReplayKey(provider, ctx) {
  return `${provider}:skip:${sha256Hex(`${ctx.method}\n${ctx.url}\n${ctx.rawBody}`)}`;
}
/**
 * Validate Twilio webhook signature using HMAC-SHA1.
 *
 * Twilio signs requests by concatenating the URL with sorted POST params,
 * then computing HMAC-SHA1 with the auth token.
 *
 * @see https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
function validateTwilioSignature(authToken, signature, url, params) {
  if (!signature) return false;
  const dataToSign = buildTwilioDataToSign(url, params);
  return safeEqualSecret(
    signature,
    crypto.createHmac("sha1", authToken).update(dataToSign).digest("base64"),
  );
}
function buildTwilioDataToSign(url, params) {
  let dataToSign = url;
  const sortedParams = Array.from(params.entries()).toSorted((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
  );
  for (const [key, value] of sortedParams) dataToSign += key + value;
  return dataToSign;
}
function buildCanonicalTwilioParamString(params) {
  return Array.from(params.entries())
    .toSorted((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
/**
 * Validate that a hostname matches RFC 1123 format.
 * Prevents injection of malformed hostnames.
 */
function isValidHostname(hostname) {
  if (!hostname || hostname.length > 253) return false;
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(
    hostname,
  );
}
/**
 * Safely extract hostname from a host header value.
 * Handles IPv6 addresses and prevents injection via malformed values.
 */
function extractHostname(hostHeader) {
  if (!hostHeader) return null;
  if (hostHeader.startsWith("[")) {
    const endBracket = hostHeader.indexOf("]");
    if (endBracket === -1) return null;
    return normalizeLowercaseStringOrEmpty(hostHeader.slice(1, endBracket));
  }
  if (hostHeader.includes("@")) return null;
  const hostname = hostHeader.split(":").at(0);
  if (!hostname || !isValidHostname(hostname)) return null;
  return normalizeLowercaseStringOrEmpty(hostname);
}
function extractHostnameFromHeader(headerValue) {
  const first = headerValue.split(",")[0]?.trim();
  if (!first) return null;
  return extractHostname(first);
}
function normalizeAllowedHosts(allowedHosts) {
  if (!allowedHosts || allowedHosts.length === 0) return null;
  const normalized = /* @__PURE__ */ new Set();
  for (const host of allowedHosts) {
    const extracted = extractHostname(host.trim());
    if (extracted) normalized.add(extracted);
  }
  return normalized.size > 0 ? normalized : null;
}
/**
 * Reconstruct the public webhook URL from request headers.
 *
 * SECURITY: This function validates host headers to prevent host header
 * injection attacks. When using forwarding headers (X-Forwarded-Host, etc.),
 * always provide allowedHosts to whitelist valid hostnames.
 *
 * When behind a reverse proxy (Tailscale, nginx, ngrok), the original URL
 * used by Twilio differs from the local request URL. We use standard
 * forwarding headers to reconstruct it.
 *
 * Priority order:
 * 1. X-Forwarded-Proto + X-Forwarded-Host (standard proxy headers)
 * 2. X-Original-Host (nginx)
 * 3. Ngrok-Forwarded-Host (ngrok specific)
 * 4. Host header (direct connection)
 */
function reconstructWebhookUrl(ctx, options) {
  const { headers } = ctx;
  const allowedHosts = normalizeAllowedHosts(options?.allowedHosts);
  const hasAllowedHosts = allowedHosts !== null;
  const explicitlyTrusted = options?.trustForwardingHeaders === true;
  const trustedProxyIPs = options?.trustedProxyIPs?.filter(Boolean) ?? [];
  const hasTrustedProxyIPs = trustedProxyIPs.length > 0;
  const remoteIP = options?.remoteIP ?? ctx.remoteAddress;
  const normalizedTrustedProxyIps = new Set(
    trustedProxyIPs.map((ip) => normalizeProxyIp(ip)).filter((ip) => Boolean(ip)),
  );
  const normalizedRemoteIp = normalizeProxyIp(remoteIP);
  const fromTrustedProxy =
    !hasTrustedProxyIPs ||
    (normalizedRemoteIp ? normalizedTrustedProxyIps.has(normalizedRemoteIp) : false);
  const shouldTrustForwardingHeaders = (hasAllowedHosts || explicitlyTrusted) && fromTrustedProxy;
  const isAllowedForwardedHost = (host) => !allowedHosts || allowedHosts.has(host);
  let proto = "https";
  if (shouldTrustForwardingHeaders) {
    const forwardedProto = getHeader(headers, "x-forwarded-proto");
    if (forwardedProto === "http" || forwardedProto === "https") proto = forwardedProto;
  }
  let host = null;
  if (shouldTrustForwardingHeaders)
    for (const headerName of ["x-forwarded-host", "x-original-host", "ngrok-forwarded-host"]) {
      const headerValue = getHeader(headers, headerName);
      if (headerValue) {
        const extracted = extractHostnameFromHeader(headerValue);
        if (extracted && isAllowedForwardedHost(extracted)) {
          host = extracted;
          break;
        }
      }
    }
  if (!host) {
    const hostHeader = getHeader(headers, "host");
    if (hostHeader) {
      const extracted = extractHostnameFromHeader(hostHeader);
      if (extracted) host = extracted;
    }
  }
  if (!host)
    try {
      const extracted = extractHostname(new URL(ctx.url).host);
      if (extracted) host = extracted;
    } catch {
      host = "";
    }
  if (!host) host = "";
  let path = "/";
  try {
    const parsed = new URL(ctx.url);
    path = parsed.pathname + parsed.search;
  } catch {}
  return `${proto}://${host}${path}`;
}
function buildTwilioVerificationUrl(ctx, publicUrl, urlOptions) {
  if (!publicUrl) return reconstructWebhookUrl(ctx, urlOptions);
  try {
    const base = new URL(publicUrl);
    const requestUrl = new URL(ctx.url);
    base.pathname = requestUrl.pathname;
    base.search = requestUrl.search;
    return base.toString();
  } catch {
    return publicUrl;
  }
}
function redactTwilioVerificationUrlForDiagnostics(url) {
  try {
    const parsed = new URL(url);
    parsed.username = parsed.username ? "***" : "";
    parsed.password = parsed.password ? "***" : "";
    parsed.hash = parsed.hash ? "#***" : "";
    for (const key of Array.from(parsed.searchParams.keys())) parsed.searchParams.set(key, "***");
    return parsed.toString();
  } catch {
    return "<invalid verification URL>";
  }
}
function stripPortFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.port) return url;
    parsed.port = "";
    return parsed.toString();
  } catch {
    return url;
  }
}
function setPortOnUrl(url, port) {
  try {
    const parsed = new URL(url);
    parsed.port = port;
    return parsed.toString();
  } catch {
    return url;
  }
}
function extractPortFromHostHeader(hostHeader) {
  if (!hostHeader) return;
  try {
    return new URL(`https://${hostHeader}`).port || void 0;
  } catch {
    return;
  }
}
function createTwilioReplayKey(params) {
  const canonicalParams = buildCanonicalTwilioParamString(params.requestParams);
  return `twilio:req:${sha256Hex(`${params.verificationUrl}\n${canonicalParams}\n${params.signature}`)}`;
}
function decodeBase64OrBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLen);
  return Buffer.from(padded, "base64");
}
function base64UrlEncode(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function importEd25519PublicKey(publicKey) {
  const trimmed = publicKey.trim();
  if (trimmed.startsWith("-----BEGIN")) return trimmed;
  const decoded = decodeBase64OrBase64Url(trimmed);
  if (decoded.length === 32)
    return crypto.createPublicKey({
      key: {
        kty: "OKP",
        crv: "Ed25519",
        x: base64UrlEncode(decoded),
      },
      format: "jwk",
    });
  return crypto.createPublicKey({
    key: decoded,
    format: "der",
    type: "spki",
  });
}
/**
 * Verify Telnyx webhook signature using Ed25519.
 *
 * Telnyx signs `timestamp|payload` and provides:
 * - `telnyx-signature-ed25519` (Base64 signature)
 * - `telnyx-timestamp` (Unix seconds)
 */
function verifyTelnyxWebhook(ctx, publicKey, options) {
  if (options?.skipVerification) {
    const replayKey = createSkippedVerificationReplayKey("telnyx", ctx);
    return {
      ok: true,
      reason: "verification skipped (dev mode)",
      isReplay: markWebhookReplay(telnyxReplayCache, replayKey),
      verifiedRequestKey: replayKey,
    };
  }
  if (!publicKey)
    return {
      ok: false,
      reason: "Missing telnyx.publicKey (configure to verify webhooks)",
    };
  const signature = getHeader(ctx.headers, "telnyx-signature-ed25519");
  const timestamp = getHeader(ctx.headers, "telnyx-timestamp");
  if (!signature || !timestamp)
    return {
      ok: false,
      reason: "Missing signature or timestamp header",
    };
  const eventTimeSec = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(eventTimeSec))
    return {
      ok: false,
      reason: "Invalid timestamp header",
    };
  try {
    const signedPayload = `${timestamp}|${ctx.rawBody}`;
    const signatureBuffer = decodeBase64OrBase64Url(signature);
    const canonicalSignature = signatureBuffer.toString("base64");
    const key = importEd25519PublicKey(publicKey);
    if (!crypto.verify(null, Buffer.from(signedPayload), key, signatureBuffer))
      return {
        ok: false,
        reason: "Invalid signature",
      };
    const maxSkewMs = options?.maxSkewMs ?? 300 * 1e3;
    const eventTimeMs = eventTimeSec * 1e3;
    if (Math.abs(Date.now() - eventTimeMs) > maxSkewMs)
      return {
        ok: false,
        reason: "Timestamp too old",
      };
    const replayKey = `telnyx:${sha256Hex(`${timestamp}\n${canonicalSignature}\n${ctx.rawBody}`)}`;
    return {
      ok: true,
      isReplay: markWebhookReplay(telnyxReplayCache, replayKey),
      verifiedRequestKey: replayKey,
    };
  } catch (err) {
    return {
      ok: false,
      reason: `Verification error: ${formatErrorMessage(err)}`,
    };
  }
}
/**
 * Verify Twilio webhook with full context and detailed result.
 */
function verifyTwilioWebhook(ctx, authToken, options) {
  if (options?.skipVerification) {
    const replayKey = createSkippedVerificationReplayKey("twilio", ctx);
    return {
      ok: true,
      reason: "verification skipped (dev mode)",
      isReplay: markWebhookReplay(twilioReplayCache, replayKey),
      verifiedRequestKey: replayKey,
    };
  }
  const signature = getHeader(ctx.headers, "x-twilio-signature");
  if (!signature)
    return {
      ok: false,
      reason: "Missing X-Twilio-Signature header",
    };
  const isLoopback = isLoopbackHost(options?.remoteIP ?? ctx.remoteAddress ?? "");
  const allowLoopbackForwarding = options?.allowNgrokFreeTierLoopbackBypass && isLoopback;
  const verificationUrl = buildTwilioVerificationUrl(ctx, options?.publicUrl, {
    allowedHosts: options?.allowedHosts,
    trustForwardingHeaders: options?.trustForwardingHeaders || allowLoopbackForwarding,
    trustedProxyIPs: options?.trustedProxyIPs,
    remoteIP: options?.remoteIP,
  });
  const params = new URLSearchParams(ctx.rawBody);
  if (validateTwilioSignature(authToken, signature, verificationUrl, params)) {
    const replayKey = createTwilioReplayKey({
      verificationUrl,
      signature,
      requestParams: params,
    });
    return {
      ok: true,
      verificationUrl,
      isReplay: markWebhookReplay(twilioReplayCache, replayKey),
      verifiedRequestKey: replayKey,
    };
  }
  const variants = /* @__PURE__ */ new Set();
  variants.add(verificationUrl);
  variants.add(stripPortFromUrl(verificationUrl));
  if (options?.publicUrl)
    try {
      const publicPort = new URL(options.publicUrl).port;
      if (publicPort) variants.add(setPortOnUrl(verificationUrl, publicPort));
    } catch {}
  const hostHeaderPort = extractPortFromHostHeader(getHeader(ctx.headers, "host"));
  if (hostHeaderPort) variants.add(setPortOnUrl(verificationUrl, hostHeaderPort));
  for (const candidateUrl of variants) {
    if (candidateUrl === verificationUrl) continue;
    if (!validateTwilioSignature(authToken, signature, candidateUrl, params)) continue;
    const replayKey = createTwilioReplayKey({
      verificationUrl: candidateUrl,
      signature,
      requestParams: params,
    });
    return {
      ok: true,
      verificationUrl: candidateUrl,
      isReplay: markWebhookReplay(twilioReplayCache, replayKey),
      verifiedRequestKey: replayKey,
    };
  }
  const isNgrokFreeTier =
    verificationUrl.includes(".ngrok-free.app") || verificationUrl.includes(".ngrok.io");
  return {
    ok: false,
    reason: `Invalid signature for URL: ${redactTwilioVerificationUrlForDiagnostics(verificationUrl)}`,
    isNgrokFreeTier,
  };
}
function normalizeSignatureBase64(input) {
  return Buffer.from(input, "base64").toString("base64");
}
function getBaseUrlNoQuery(url) {
  const u = new URL(url);
  return `${u.protocol}//${u.host}${u.pathname}`;
}
function createPlivoV2ReplayKey(url, nonce) {
  return `plivo:v2:${sha256Hex(`${getBaseUrlNoQuery(url)}\n${nonce}`)}`;
}
function createPlivoV3ReplayKey(params) {
  return `plivo:v3:${sha256Hex(
    `${constructPlivoV3BaseUrl({
      method: params.method,
      url: params.url,
      postParams: params.postParams,
    })}\n${params.nonce}`,
  )}`;
}
function validatePlivoV2Signature(params) {
  const baseUrl = getBaseUrlNoQuery(params.url);
  return safeEqualSecret(
    normalizeSignatureBase64(
      crypto
        .createHmac("sha256", params.authToken)
        .update(baseUrl + params.nonce)
        .digest("base64"),
    ),
    normalizeSignatureBase64(params.signature),
  );
}
function toParamMapFromSearchParams(sp) {
  const map = {};
  for (const [key, value] of sp.entries()) {
    if (!map[key]) map[key] = [];
    map[key].push(value);
  }
  return map;
}
function sortedQueryString(params) {
  const parts = [];
  const entries = Object.entries(params).toSorted(([left], [right]) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
  for (const [key, entryValues] of entries) {
    const values = [...entryValues].toSorted();
    for (const value of values) parts.push(`${key}=${value}`);
  }
  return parts.join("&");
}
function sortedParamsString(params) {
  const parts = [];
  const entries = Object.entries(params).toSorted(([left], [right]) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
  for (const [key, entryValues] of entries) {
    const values = [...entryValues].toSorted();
    for (const value of values) parts.push(`${key}${value}`);
  }
  return parts.join("");
}
function constructPlivoV3BaseUrl(params) {
  const hasPostParams = Object.keys(params.postParams).length > 0;
  const u = new URL(params.url);
  const baseNoQuery = `${u.protocol}//${u.host}${u.pathname}`;
  const queryString = sortedQueryString(toParamMapFromSearchParams(u.searchParams));
  let baseUrl = baseNoQuery;
  if (queryString.length > 0 || hasPostParams) baseUrl = `${baseNoQuery}?${queryString}`;
  if (queryString.length > 0 && hasPostParams) baseUrl = `${baseUrl}.`;
  if (params.method === "GET") return baseUrl;
  return baseUrl + sortedParamsString(params.postParams);
}
function validatePlivoV3Signature(params) {
  const hmacBase = `${constructPlivoV3BaseUrl({
    method: params.method,
    url: params.url,
    postParams: params.postParams,
  })}.${params.nonce}`;
  const expected = normalizeSignatureBase64(
    crypto.createHmac("sha256", params.authToken).update(hmacBase).digest("base64"),
  );
  const provided = normalizeStringEntries(params.signatureHeader.split(",")).map((s) =>
    normalizeSignatureBase64(s),
  );
  for (const sig of provided) if (safeEqualSecret(expected, sig)) return true;
  return false;
}
/**
 * Verify Plivo webhooks using V3 signature if present; fall back to V2.
 *
 * Header names (case-insensitive; Node provides lower-case keys):
 * - V3: X-Plivo-Signature-V3 / X-Plivo-Signature-V3-Nonce
 * - V2: X-Plivo-Signature-V2 / X-Plivo-Signature-V2-Nonce
 */
function verifyPlivoWebhook(ctx, authToken, options) {
  if (options?.skipVerification) {
    const replayKey = createSkippedVerificationReplayKey("plivo", ctx);
    return {
      ok: true,
      reason: "verification skipped (dev mode)",
      isReplay: markWebhookReplay(plivoReplayCache, replayKey),
      verifiedRequestKey: replayKey,
    };
  }
  const signatureV3 = getHeader(ctx.headers, "x-plivo-signature-v3");
  const nonceV3 = getHeader(ctx.headers, "x-plivo-signature-v3-nonce");
  const signatureV2 = getHeader(ctx.headers, "x-plivo-signature-v2");
  const nonceV2 = getHeader(ctx.headers, "x-plivo-signature-v2-nonce");
  const reconstructed = reconstructWebhookUrl(ctx, {
    allowedHosts: options?.allowedHosts,
    trustForwardingHeaders: options?.trustForwardingHeaders,
    trustedProxyIPs: options?.trustedProxyIPs,
    remoteIP: options?.remoteIP,
  });
  let verificationUrl = reconstructed;
  if (options?.publicUrl)
    try {
      const req = new URL(reconstructed);
      const base = new URL(options.publicUrl);
      base.pathname = req.pathname;
      base.search = req.search;
      verificationUrl = base.toString();
    } catch {
      verificationUrl = reconstructed;
    }
  if (signatureV3 && nonceV3) {
    const method = ctx.method === "GET" || ctx.method === "POST" ? ctx.method : null;
    if (!method)
      return {
        ok: false,
        version: "v3",
        verificationUrl,
        reason: `Unsupported HTTP method for Plivo V3 signature: ${ctx.method}`,
      };
    const postParams = toParamMapFromSearchParams(new URLSearchParams(ctx.rawBody));
    if (
      !validatePlivoV3Signature({
        authToken,
        signatureHeader: signatureV3,
        nonce: nonceV3,
        method,
        url: verificationUrl,
        postParams,
      })
    )
      return {
        ok: false,
        version: "v3",
        verificationUrl,
        reason: "Invalid Plivo V3 signature",
      };
    const replayKey = createPlivoV3ReplayKey({
      method,
      url: verificationUrl,
      postParams,
      nonce: nonceV3,
    });
    const isReplay = markWebhookReplay(plivoReplayCache, replayKey);
    return {
      ok: true,
      version: "v3",
      verificationUrl,
      isReplay,
      verifiedRequestKey: replayKey,
    };
  }
  if (signatureV2 && nonceV2) {
    if (
      !validatePlivoV2Signature({
        authToken,
        signature: signatureV2,
        nonce: nonceV2,
        url: verificationUrl,
      })
    )
      return {
        ok: false,
        version: "v2",
        verificationUrl,
        reason: "Invalid Plivo V2 signature",
      };
    const replayKey = createPlivoV2ReplayKey(verificationUrl, nonceV2);
    const isReplay = markWebhookReplay(plivoReplayCache, replayKey);
    return {
      ok: true,
      version: "v2",
      verificationUrl,
      isReplay,
      verifiedRequestKey: replayKey,
    };
  }
  return {
    ok: false,
    reason: "Missing Plivo signature headers (V3 or V2)",
    verificationUrl,
  };
}
//#endregion
//#region extensions/voice-call/src/providers/shared/response-body.ts
const PROVIDER_JSON_RESPONSE_MAX_BYTES = 1 * 1024 * 1024;
const PROVIDER_ERROR_RESPONSE_MAX_BYTES = 8 * 1024;
const TRUNCATED_SUFFIX = "... [truncated]";
async function cancelProviderResponseBody(response) {
  await response.body?.cancel().catch(() => void 0);
}
function appendTruncatedSuffix(text) {
  return `${text.trimEnd()}${TRUNCATED_SUFFIX}`;
}
async function readProviderResponseTextWithLimit(params) {
  if (params.truncateOnLimit) {
    const prefix = await readResponseTextPrefix(params.response, params.maxBytes);
    return prefix.truncated ? appendTruncatedSuffix(prefix.text) : prefix.text;
  }
  const body = await readResponseWithLimit(params.response, params.maxBytes, {
    onOverflow: ({ size, maxBytes }) =>
      /* @__PURE__ */ new Error(
        `provider response body too large: ${size} bytes (limit: ${maxBytes} bytes)`,
      ),
  });
  return new TextDecoder().decode(body);
}
async function readProviderJsonResponseText(response) {
  return await readProviderResponseTextWithLimit({
    response,
    maxBytes: PROVIDER_JSON_RESPONSE_MAX_BYTES,
  });
}
async function readProviderErrorResponseSnippet(response) {
  return await readProviderResponseTextWithLimit({
    response,
    maxBytes: PROVIDER_ERROR_RESPONSE_MAX_BYTES,
    truncateOnLimit: true,
  });
}
//#endregion
//#region extensions/voice-call/src/providers/shared/guarded-json-api.ts
const VOICE_CALL_PROVIDER_API_TIMEOUT_MS = 3e4;
/** Send a provider JSON request through the SSRF guard and parse bounded JSON responses. */
async function guardedJsonApiRequest(params) {
  const { response, release } = await fetchWithSsrFGuard({
    url: params.url,
    init: {
      method: params.method,
      headers: params.headers,
      body: params.body ? JSON.stringify(params.body) : void 0,
    },
    policy: { allowedHostnames: params.allowedHostnames },
    auditContext: params.auditContext,
    timeoutMs: VOICE_CALL_PROVIDER_API_TIMEOUT_MS,
  });
  try {
    if (!response.ok) {
      if (params.allowNotFound && response.status === 404) {
        await cancelProviderResponseBody(response);
        return;
      }
      const errorText = await readProviderErrorResponseSnippet(response);
      throw new Error(`${params.errorPrefix}: ${response.status} ${errorText}`);
    }
    const text = await readProviderJsonResponseText(response);
    if (!text) return;
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`${params.errorPrefix}: malformed JSON response`);
    }
  } finally {
    await release();
  }
}
//#endregion
export {
  reconstructWebhookUrl as a,
  verifyTwilioWebhook as c,
  readProviderJsonResponseText as i,
  cancelProviderResponseBody as n,
  verifyPlivoWebhook as o,
  readProviderErrorResponseSnippet as r,
  verifyTelnyxWebhook as s,
  guardedJsonApiRequest as t,
};
