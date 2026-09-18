import { once } from "node:events";
import http2 from "node:http2";
import "./errors-BoHeli7m.js";
import tls from "node:tls";
import { openProxyConnectTunnel } from "@openclaw/proxyline";
import {
  n as getActiveManagedProxyTlsOptions,
  r as getActiveManagedProxyUrl,
} from "./active-proxy-state-DJLhrP_Z.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
//#region src/infra/push-apns-http2.ts
const APNS_DEFAULT_PORT = "443";
const APNS_AUTHORITIES = /* @__PURE__ */ new Set([
  "https://api.push.apple.com",
  "https://api.sandbox.push.apple.com",
]);
const APNS_HTTP2_CANCEL_CODE = http2.constants.NGHTTP2_CANCEL;
const APNS_RESPONSE_BODY_MAX_BYTES = 8192;
const APNS_HTTP2_MIN_TIMEOUT_MS = 1e3;
function assertApnsAuthority(authority) {
  let parsed;
  try {
    parsed = new URL(authority);
  } catch {
    throw new Error(`Unsupported APNs authority: ${authority}`);
  }
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash)
    throw new Error(`Unsupported APNs authority: ${authority}`);
  const port = parsed.port && parsed.port !== APNS_DEFAULT_PORT ? `:${parsed.port}` : "";
  const normalized = `${parsed.protocol}//${parsed.hostname}${port}`;
  if (!APNS_AUTHORITIES.has(normalized))
    throw new Error(`Unsupported APNs authority: ${authority}`);
  return normalized;
}
function normalizeConnectProxyUrl(proxyUrl) {
  const normalized = new URL(proxyUrl);
  normalized.pathname = "/";
  normalized.search = "";
  normalized.hash = "";
  try {
    decodeURIComponent(normalized.username);
    decodeURIComponent(normalized.password);
  } catch (err) {
    throw new Error(
      `Proxy CONNECT failed via ${normalized.origin}: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err },
    );
  }
  return normalized;
}
async function openApnsTlsTunnel(params) {
  const proxyUrl = normalizeConnectProxyUrl(params.proxyUrl);
  const deadline = Date.now() + params.timeoutMs;
  const proxySocket = await openProxyConnectTunnel({
    proxyUrl,
    ...(params.proxyTls ? { proxyTls: params.proxyTls } : {}),
    targetHost: params.targetHost,
    targetPort: params.targetPort,
    timeoutMs: params.timeoutMs,
  });
  const abortController = new AbortController();
  let targetTlsSocket;
  let timeout;
  try {
    targetTlsSocket = tls.connect({
      socket: proxySocket,
      servername: params.targetHost,
      ALPNProtocols: ["h2"],
    });
    timeout = setTimeout(
      () =>
        abortController.abort(
          /* @__PURE__ */ new Error(`Proxy CONNECT timed out after ${params.timeoutMs}ms`),
        ),
      Math.max(1, deadline - Date.now()),
    );
    timeout.unref?.();
    await Promise.race([
      once(targetTlsSocket, "secureConnect", { signal: abortController.signal }),
      once(targetTlsSocket, "close", { signal: abortController.signal }).then(() => {
        throw new Error("APNs TLS tunnel closed before secureConnect");
      }),
    ]);
    if (targetTlsSocket.alpnProtocol !== "h2")
      throw new Error(
        `APNs TLS tunnel negotiated ${targetTlsSocket.alpnProtocol || "no ALPN protocol"} instead of h2`,
      );
    return targetTlsSocket;
  } catch (err) {
    targetTlsSocket?.destroy();
    proxySocket.destroy();
    const failure = abortController.signal.aborted ? abortController.signal.reason : err;
    throw new Error(
      `Proxy CONNECT failed via ${proxyUrl.origin}: ${failure instanceof Error ? failure.message : String(failure)}`,
      { cause: err },
    );
  } finally {
    if (timeout) clearTimeout(timeout);
    abortController.abort();
  }
}
async function openProxiedApnsHttp2Session(params) {
  const apnsHost = new URL(params.authority).hostname;
  const tlsSocket = await openApnsTlsTunnel({
    proxyUrl: params.proxyUrl,
    ...(params.proxyTls ? { proxyTls: params.proxyTls } : {}),
    targetHost: apnsHost,
    targetPort: 443,
    timeoutMs: params.timeoutMs,
  });
  return http2.connect(params.authority, { createConnection: () => tlsSocket });
}
/** Connects to APNs directly, or through the active managed proxy when present. */
async function connectApnsHttp2Session(params) {
  const authority = assertApnsAuthority(params.authority);
  const timeoutMs = resolveApnsHttp2TimeoutMs(params.timeoutMs);
  const proxyUrl = getActiveManagedProxyUrl();
  if (!proxyUrl) return http2.connect(authority);
  return await openProxiedApnsHttp2Session({
    authority,
    proxyUrl,
    proxyTls: getActiveManagedProxyTlsOptions(),
    timeoutMs,
  });
}
function resolveApnsHttp2TimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, APNS_HTTP2_MIN_TIMEOUT_MS, APNS_HTTP2_MIN_TIMEOUT_MS);
}
function createApnsResponseBodyCapture() {
  return {
    text: "",
    bytes: 0,
    truncated: false,
  };
}
function appendApnsResponseBodyCapture(capture, chunk, maxBytes = APNS_RESPONSE_BODY_MAX_BYTES) {
  const buffer = Buffer.from(String(chunk));
  capture.bytes += buffer.byteLength;
  const remaining = maxBytes - Buffer.byteLength(capture.text);
  if (remaining <= 0) {
    capture.truncated = capture.truncated || buffer.byteLength > 0;
    return;
  }
  const slice = buffer.byteLength > remaining ? buffer.subarray(0, remaining) : buffer;
  capture.text += slice.toString("utf8");
  if (slice.byteLength < buffer.byteLength) capture.truncated = true;
}
/** Sends an intentionally invalid APNs push through a proxy to prove HTTP/2 reachability. */
async function probeApnsHttp2ReachabilityViaProxy(params) {
  const authority = assertApnsAuthority(params.authority);
  const timeoutMs = resolveApnsHttp2TimeoutMs(params.timeoutMs);
  const session = await openProxiedApnsHttp2Session({
    authority,
    proxyUrl: new URL(params.proxyUrl),
    ...(params.proxyTls ? { proxyTls: params.proxyTls } : {}),
    timeoutMs,
  });
  try {
    return await new Promise((resolve, reject) => {
      let settled = false;
      const body = createApnsResponseBodyCapture();
      let status;
      let responseHeaders = {};
      const timeout = setTimeout(() => {
        fail(/* @__PURE__ */ new Error(`APNs reachability probe timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      timeout.unref?.();
      const cleanup = () => {
        clearTimeout(timeout);
        session.off("error", fail);
      };
      const fail = (err) => {
        if (settled) return;
        settled = true;
        cleanup();
        session.destroy(err instanceof Error ? err : new Error(String(err)));
        reject(toErrorObject(err, "Non-Error rejection"));
      };
      const request = session.request({
        ":method": "POST",
        ":path": `/3/device/${"0".repeat(64)}`,
        authorization: "bearer intentionally.invalid.openclaw.proxy.validation",
        "apns-topic": "ai.openclaw.ios",
        "apns-push-type": "alert",
        "apns-priority": "10",
      });
      session.once("error", fail);
      request.setEncoding("utf8");
      request.on("response", (headers) => {
        const rawStatus = headers[":status"];
        status = typeof rawStatus === "number" ? rawStatus : Number(rawStatus);
        responseHeaders = Object.fromEntries(
          Object.entries(headers)
            .filter(([k]) => !k.startsWith(":"))
            .map(([k, v]) => [k, String(v)]),
        );
      });
      request.on("data", (chunk) => {
        appendApnsResponseBodyCapture(body, chunk);
      });
      request.once("error", fail);
      request.once("end", () => {
        if (settled) return;
        settled = true;
        cleanup();
        if (status === void 0 || !Number.isFinite(status)) {
          reject(
            /* @__PURE__ */ new Error("APNs reachability probe ended without an HTTP/2 status"),
          );
          return;
        }
        resolve({
          status,
          body: body.text,
          responseHeaders,
        });
      });
      request.end(JSON.stringify({ aps: { alert: "OpenClaw APNs proxy validation" } }));
    });
  } finally {
    if (!session.closed && !session.destroyed) session.close();
  }
}
//#endregion
export {
  probeApnsHttp2ReachabilityViaProxy as a,
  createApnsResponseBodyCapture as i,
  appendApnsResponseBodyCapture as n,
  connectApnsHttp2Session as r,
  APNS_HTTP2_CANCEL_CODE as t,
};
