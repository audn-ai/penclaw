import fs from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import WebSocket$1 from "ws";
import { n as redactCdpUrl } from "./browser-config-BYZ1IWa3.js";
import { c as DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS } from "./constants-C2_ZjRRD.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { S as findExistingAncestor, u as pathScope } from "./fs-safe-RNq3oO57.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import "./logging-core-QnL1iLWg.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./plugin-runtime-Cwru8G47.js";
import "./gateway-runtime-IrTdjV5_.js";
import "./cli-runtime-B2OG9Kfj.js";
import {
  a as addTimerTimeoutGraceMs,
  f as clampTimerTimeoutMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import "./provider-http-BDIltggC.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import "./ssrf-runtime-internal-vyrl557U.js";
import { i as hasProxyEnvConfigured } from "./proxy-env-5nRGQyQD.js";
import { n as registerManagedProxyBrowserCdpBypass } from "./proxy-lifecycle-CW0HaJEp.js";
import { u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import {
  _ as resolvePinnedHostnameWithPolicy,
  d as isPrivateNetworkAllowedByPolicy,
  t as SsrFBlockedError,
} from "./ssrf-keFRGQLq.js";
//#region extensions/browser/src/sdk-node-runtime.ts
function normalizeTimeoutMs$1(timeoutMs) {
  return clampTimerTimeoutMs(timeoutMs);
}
function createTimeoutAbortSignal(timeoutMs, label) {
  const controller = new AbortController();
  const error = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
  const timer = setTimeout(() => controller.abort(error), timeoutMs);
  timer.unref?.();
  return {
    controller,
    error,
    timer,
  };
}
function waitForAbort(signal, fallback) {
  if (signal.aborted)
    return {
      promise: Promise.reject(toLintErrorObject(signal.reason ?? fallback, "Non-Error rejection")),
      cleanup: () => void 0,
    };
  let listener;
  return {
    cleanup: () => {
      if (listener) signal.removeEventListener("abort", listener);
    },
    promise: new Promise((_, reject) => {
      listener = () => reject(toLintErrorObject(signal.reason ?? fallback, "Non-Error rejection"));
      signal.addEventListener("abort", listener, { once: true });
    }),
  };
}
/** Runs async work with an optional aborting timeout signal. */
async function withTimeout(work, timeoutMs, label) {
  const resolved = normalizeTimeoutMs$1(timeoutMs);
  if (!resolved) return await work(void 0);
  const timeout = createTimeoutAbortSignal(resolved, label);
  const abort = waitForAbort(timeout.controller.signal, timeout.error);
  try {
    return await Promise.race([work(timeout.controller.signal), abort.promise]);
  } finally {
    clearTimeout(timeout.timer);
    abort.cleanup();
  }
}
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
//#region extensions/browser/src/sdk-security-runtime.ts
/**
 * Browser-local SDK security bridge plus directory creation helper.
 */
/** Ensures an absolute directory exists without escaping its nearest existing ancestor. */
async function ensureAbsoluteDirectory(dirPath, options) {
  const absolutePath = path.resolve(dirPath);
  const scopeLabel = options?.scopeLabel ?? "directory";
  const existingAncestor = await findExistingAncestor(absolutePath);
  if (!existingAncestor)
    return {
      ok: false,
      error: /* @__PURE__ */ new Error(`Invalid path: must stay within ${scopeLabel}`),
    };
  if (existingAncestor === absolutePath) {
    try {
      const stat = await fs.lstat(absolutePath);
      if (!stat.isSymbolicLink() && stat.isDirectory())
        return {
          ok: true,
          path: absolutePath,
        };
    } catch {}
    return {
      ok: false,
      error: /* @__PURE__ */ new Error(`Invalid path: must stay within ${scopeLabel}`),
    };
  }
  const result = await pathScope(existingAncestor, {
    label: options?.scopeLabel ?? "directory",
  }).ensureDir(path.relative(existingAncestor, absolutePath), { mode: options?.mode });
  if (result.ok) return result;
  return {
    ok: false,
    error: new Error(result.error),
  };
}
//#endregion
//#region extensions/browser/src/browser/cdp-proxy-bypass.ts
/**
 * Proxy bypass for CDP (Chrome DevTools Protocol) localhost connections.
 *
 * When HTTP_PROXY / HTTPS_PROXY / ALL_PROXY environment variables are set,
 * CDP connections to localhost/127.0.0.1 can be incorrectly routed through
 * the proxy, causing browser control to fail.
 *
 * @see https://github.com/nicepkg/openclaw/issues/31219
 */
/** HTTP agent that never uses a proxy — for localhost CDP connections. */
const directHttpAgent = new http.Agent();
const directHttpsAgent = new https.Agent();
/**
 * Returns a plain (non-proxy) agent for WebSocket or HTTP connections
 * when the target is a loopback address. Returns `undefined` otherwise
 * so callers fall through to their default behaviour.
 */
function getDirectAgentForCdp(url) {
  try {
    const parsed = new URL(url);
    if (isLoopbackHost(parsed.hostname))
      return parsed.protocol === "https:" || parsed.protocol === "wss:"
        ? directHttpsAgent
        : directHttpAgent;
  } catch {}
}
/**
 * Returns `true` when any proxy-related env var is set that could
 * interfere with loopback connections.
 */
function hasProxyEnv() {
  return hasProxyEnvConfigured();
}
const LOOPBACK_ENTRIES = "localhost,127.0.0.1,[::1]";
function noProxyValueCoversLocalhost(value) {
  const entries = new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
  return entries.has("localhost") && entries.has("127.0.0.1") && entries.has("[::1]");
}
function noProxyAlreadyCoversLocalhost() {
  return (
    noProxyValueCoversLocalhost(process.env.NO_PROXY) &&
    noProxyValueCoversLocalhost(process.env.no_proxy)
  );
}
function appendLoopbackEntries(value) {
  return value ? `${value},${LOOPBACK_ENTRIES}` : LOOPBACK_ENTRIES;
}
function isLoopbackCdpUrl(url) {
  try {
    return isLoopbackHost(new URL(url).hostname);
  } catch {
    return false;
  }
}
var NoProxyLeaseManager = class {
  constructor() {
    this.leaseCount = 0;
    this.snapshot = null;
  }
  acquire(url) {
    if (!isLoopbackCdpUrl(url) || !hasProxyEnv()) return null;
    if (this.leaseCount === 0 && !noProxyAlreadyCoversLocalhost()) {
      const noProxy = process.env.NO_PROXY;
      const noProxyLower = process.env.no_proxy;
      const appliedNoProxy = appendLoopbackEntries(noProxy || noProxyLower);
      const appliedNoProxyLower = appendLoopbackEntries(noProxyLower || noProxy);
      process.env.NO_PROXY = appliedNoProxy;
      process.env.no_proxy = appliedNoProxyLower;
      this.snapshot = {
        noProxy,
        noProxyLower,
        appliedNoProxy,
        appliedNoProxyLower,
      };
    }
    this.leaseCount += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.release();
    };
  }
  release() {
    if (this.leaseCount <= 0) return;
    this.leaseCount -= 1;
    if (this.leaseCount > 0 || !this.snapshot) return;
    const { noProxy, noProxyLower, appliedNoProxy, appliedNoProxyLower } = this.snapshot;
    const currentNoProxy = process.env.NO_PROXY;
    const currentNoProxyLower = process.env.no_proxy;
    if (currentNoProxy === appliedNoProxy)
      if (noProxy !== void 0) process.env.NO_PROXY = noProxy;
      else delete process.env.NO_PROXY;
    if (currentNoProxyLower === appliedNoProxyLower)
      if (noProxyLower !== void 0) process.env.no_proxy = noProxyLower;
      else delete process.env.no_proxy;
    this.snapshot = null;
  }
};
const noProxyLeaseManager = new NoProxyLeaseManager();
/**
 * Scoped NO_PROXY bypass for loopback CDP URLs.
 *
 * This wrapper only mutates env vars for loopback destinations. On restore,
 * it avoids clobbering external NO_PROXY changes that happened while calls
 * were in-flight.
 */
async function withNoProxyForCdpUrl(url, fn) {
  const release = noProxyLeaseManager.acquire(url);
  try {
    return await fn();
  } finally {
    release?.();
  }
}
/**
 * Scoped managed-proxy bypass for the exact CDP URL about to be used.
 *
 * Proxyline dynamic bypass registrations are exact URL matches, so callers
 * must register the concrete `/json/version` or `ws://.../devtools/...` URL
 * rather than a CDP base URL.
 */
function withManagedProxyForCdpUrl(url, fn) {
  const release = registerManagedProxyBrowserCdpBypass(url);
  let result;
  try {
    result = fn();
  } catch (err) {
    release?.();
    throw err;
  }
  const maybeThenable = result;
  if (
    typeof maybeThenable === "object" &&
    maybeThenable !== null &&
    "finally" in maybeThenable &&
    typeof maybeThenable.finally === "function"
  )
    return maybeThenable.finally(() => release?.());
  release?.();
  return result;
}
/**
 * Validate managed-proxy loopback policy without keeping a long-lived bypass.
 * Exact CDP request sites install their own scoped bypasses.
 */
function assertManagedProxyAllowsCdpUrl(url) {
  withManagedProxyForCdpUrl(url, () => void 0);
}
//#endregion
//#region extensions/browser/src/browser/cdp-timeouts.ts
/**
 * CDP and Chrome launch timeout constants.
 *
 * Centralizes timing so local loopback probes stay fast while remote/browser
 * node probes retain enough handshake slack for real networks.
 */
const CDP_HTTP_REQUEST_TIMEOUT_MS = 1500;
const CDP_WS_HANDSHAKE_TIMEOUT_MS = 5e3;
const CDP_JSON_NEW_TIMEOUT_MS = 1500;
const CHROME_BOOTSTRAP_PREFS_TIMEOUT_MS = 1e4;
const CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS = 5e3;
const CHROME_LAUNCH_READY_WINDOW_MS = DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS;
const CHROME_STOP_TIMEOUT_MS = 2500;
const CHROME_STDERR_HINT_MAX_CHARS = 2e3;
const PROFILE_HTTP_REACHABILITY_TIMEOUT_MS = 300;
const PROFILE_WS_REACHABILITY_MIN_TIMEOUT_MS = 200;
const PROFILE_WS_REACHABILITY_MAX_TIMEOUT_MS = 2e3;
const PROFILE_ATTACH_RETRY_TIMEOUT_MS = 1200;
const CHROME_MCP_ATTACH_READY_WINDOW_MS = 8e3;
/** Return true when a profile can use the short loopback CDP probe class. */
function usesFastLoopbackCdpProbeClass(params) {
  return params.profileIsLoopback && params.attachOnly !== true;
}
function normalizeTimeoutMs(value) {
  return clampTimerTimeoutMs(value);
}
function maxTimerTimeoutMs(...values) {
  return values.reduce((max, value) => Math.max(max, resolveTimerTimeoutMs(value, 1)), 1);
}
/** Resolve HTTP and WebSocket reachability timeouts for a CDP profile. */
function resolveCdpReachabilityTimeouts(params) {
  const normalized = normalizeTimeoutMs(params.timeoutMs);
  const remoteHttpTimeoutMs = resolveTimerTimeoutMs(
    params.remoteHttpTimeoutMs,
    CDP_HTTP_REQUEST_TIMEOUT_MS,
  );
  const remoteHandshakeTimeoutMs = resolveTimerTimeoutMs(
    params.remoteHandshakeTimeoutMs,
    CDP_WS_HANDSHAKE_TIMEOUT_MS,
  );
  if (
    usesFastLoopbackCdpProbeClass({
      profileIsLoopback: params.profileIsLoopback,
      attachOnly: params.attachOnly,
    })
  ) {
    const httpTimeoutMs = normalized ?? PROFILE_HTTP_REACHABILITY_TIMEOUT_MS;
    return {
      httpTimeoutMs,
      wsTimeoutMs: Math.max(
        PROFILE_WS_REACHABILITY_MIN_TIMEOUT_MS,
        Math.min(PROFILE_WS_REACHABILITY_MAX_TIMEOUT_MS, httpTimeoutMs * 2),
      ),
    };
  }
  if (normalized !== void 0) {
    const requestedWsTimeoutMs = addTimerTimeoutGraceMs(normalized, normalized) ?? normalized;
    return {
      httpTimeoutMs: maxTimerTimeoutMs(normalized, remoteHttpTimeoutMs),
      wsTimeoutMs: maxTimerTimeoutMs(requestedWsTimeoutMs, remoteHandshakeTimeoutMs),
    };
  }
  return {
    httpTimeoutMs: remoteHttpTimeoutMs,
    wsTimeoutMs: remoteHandshakeTimeoutMs,
  };
}
//#endregion
//#region extensions/browser/src/browser/errors.ts
/**
 * Browser domain errors.
 *
 * Provides HTTP-mappable error classes and stable blocked-policy messages used
 * by route handlers, clients, and Gateway proxy code.
 */
/** Stable message for blocked CDP endpoint configuration. */
const BROWSER_ENDPOINT_BLOCKED_MESSAGE = "browser endpoint blocked by policy";
/** Stable message for blocked page navigation targets. */
const BROWSER_NAVIGATION_BLOCKED_MESSAGE = "browser navigation blocked by policy";
/** Stable machine-readable browser error reasons. */
const BROWSER_ERROR_REASONS = { noDisplayForHeadedProfile: "no_display_for_headed_profile" };
const NO_DISPLAY_HEADLESS_SOURCES = ["request", "env", "profile", "config", "default"];
/** Base browser error carrying an HTTP status code. */
var BrowserError = class extends Error {
  constructor(message, status = 500, options) {
    super(message, options);
    this.name = new.target.name;
    this.status = status;
  }
};
/**
 * Raised when a browser CDP endpoint (the cdpUrl itself) fails the
 * configured SSRF policy. Distinct from a blocked navigation target so
 * callers see "fix your browser endpoint config" rather than "fix your
 * navigation URL".
 */
var BrowserCdpEndpointBlockedError = class extends BrowserError {
  constructor(options) {
    super(BROWSER_ENDPOINT_BLOCKED_MESSAGE, 400, options);
  }
};
/** Validation failure for browser route or config input. */
var BrowserValidationError = class extends BrowserError {
  constructor(message, options) {
    super(message, 400, options);
  }
};
/** Raised when one tab reference matches multiple tabs. */
var BrowserTargetAmbiguousError = class extends BrowserError {
  constructor(message = "ambiguous browser tab reference", options) {
    super(message, 409, options);
  }
};
/** Raised when a requested browser tab cannot be resolved. */
var BrowserTabNotFoundError = class extends BrowserError {
  constructor(inputOrMessage, options) {
    const input =
      typeof inputOrMessage === "object" ? inputOrMessage.input?.trim() : inputOrMessage?.trim();
    const message = input
      ? /^\d+$/.test(input)
        ? `tab not found: browser tab "${input}" not found. Numeric values are not tab targets; use a stable tab id like "t1", a label, or a raw targetId. For positional selection, use "openclaw browser tab select ${input}".`
        : `tab not found: browser tab "${input}" not found. Use action=tabs and pass suggestedTargetId, tabId, label, or raw targetId.`
      : "tab not found";
    super(message, 404, options);
  }
};
/** Raised when a requested browser profile does not exist. */
var BrowserProfileNotFoundError = class extends BrowserError {
  constructor(message, options) {
    super(message, 404, options);
  }
};
/** Raised when a browser config mutation conflicts with existing state. */
var BrowserConflictError = class extends BrowserError {
  constructor(message, options) {
    super(message, 409, options);
  }
};
/** Raised when a browser profile cannot be reset by the current driver. */
var BrowserResetUnsupportedError = class extends BrowserError {
  constructor(message, options) {
    super(message, 400, options);
  }
};
/** Raised when a profile is configured but not currently reachable. */
var BrowserProfileUnavailableError = class extends BrowserError {
  constructor(message, options) {
    super(message, 409, options);
    this.metadata = options?.metadata;
  }
};
/** Raised when browser resource allocation, such as CDP ports, is exhausted. */
var BrowserResourceExhaustedError = class extends BrowserError {
  constructor(message, options) {
    super(message, 507, options);
  }
};
/** Map browser-domain errors to HTTP response details. */
function toBrowserErrorResponse(err) {
  if (err instanceof BrowserProfileUnavailableError && err.metadata)
    return {
      status: err.status,
      message: err.message,
      ...err.metadata,
    };
  if (err instanceof BrowserError)
    return {
      status: err.status,
      message: err.message,
    };
  if (err instanceof Error && err.name === "BlockedBrowserTargetError")
    return {
      status: 409,
      message: err.message,
    };
  if (err instanceof Error && err.name === "SsrFBlockedError")
    return {
      status: 400,
      message: BROWSER_NAVIGATION_BLOCKED_MESSAGE,
    };
  if (err instanceof Error && err.name === "InvalidBrowserNavigationUrlError")
    return {
      status: 400,
      message: err.message,
    };
  return null;
}
function parseNoDisplayDetails(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const details = value;
  if (
    typeof details.profile !== "string" ||
    details.profile.length === 0 ||
    details.requestedHeadless !== false ||
    !NO_DISPLAY_HEADLESS_SOURCES.includes(details.headlessSource) ||
    details.displayPresent !== false
  )
    return null;
  return {
    profile: details.profile,
    requestedHeadless: false,
    headlessSource: details.headlessSource,
    displayPresent: false,
  };
}
/** Parse only the closed browser error metadata contract from a route payload. */
function parseBrowserErrorPayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value;
  if (typeof body.error !== "string" || body.error.length === 0) return null;
  if (body.reason === BROWSER_ERROR_REASONS.noDisplayForHeadedProfile) {
    const details = parseNoDisplayDetails(body.details);
    if (details)
      return {
        error: body.error,
        reason: body.reason,
        details,
      };
  }
  return { error: body.error };
}
//#endregion
//#region extensions/browser/src/browser/rate-limit-message.ts
/**
 * Rate-limit message selection for Browser service providers.
 */
const BROWSER_SERVICE_RATE_LIMIT_MESSAGE =
  "Browser service rate limit reached. Wait for the current session to complete, or retry later.";
const BROWSERBASE_RATE_LIMIT_MESSAGE =
  "Browserbase rate limit reached (max concurrent sessions). Wait for the current session to complete, or upgrade your plan.";
function isAbsoluteHttp(url) {
  return /^https?:\/\//i.test(url.trim());
}
function isBrowserbaseUrl(url) {
  if (!isAbsoluteHttp(url)) return false;
  try {
    const host = new URL(url).hostname.trim().toLowerCase();
    return host === "browserbase.com" || host.endsWith(".browserbase.com");
  } catch {
    return false;
  }
}
/** Returns the provider-specific rate-limit message for a browser service URL. */
function resolveBrowserRateLimitMessage(url) {
  return isBrowserbaseUrl(url)
    ? BROWSERBASE_RATE_LIMIT_MESSAGE
    : BROWSER_SERVICE_RATE_LIMIT_MESSAGE;
}
//#endregion
//#region extensions/browser/src/browser/ssrf-policy-helpers.ts
/** Returns an SSRF policy restricted to one exact control-plane hostname. */
function withExactHostnamePolicy(ssrfPolicy, hostname) {
  const { allowedOrigins: _allowedOrigins, ...basePolicy } = ssrfPolicy ?? {};
  return {
    ...basePolicy,
    allowedHostnames: [hostname],
    hostnameAllowlist: [hostname],
  };
}
//#endregion
//#region extensions/browser/src/browser/timer-delay.ts
/**
 * Timer delay normalization for Browser waits and cleanup loops.
 */
/** Largest timeout delay accepted reliably by Node timers. */
const MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
/** Clamps timer delays to Node's safe range with an optional lower bound. */
function normalizeBrowserTimerDelayMs(timeoutMs, opts) {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1),
  );
  return Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(minMs, Number.isFinite(timeoutMs) ? Math.floor(timeoutMs) : minMs),
  );
}
//#endregion
//#region extensions/browser/src/browser/cdp.helpers.ts
/**
 * Chrome DevTools Protocol URL, fetch, and socket helpers.
 *
 * Handles CDP URL normalization, SSRF-guarded HTTP discovery, credential
 * redaction/headers, and request/response correlation over WebSocket.
 */
const CDP_URL_IN_TEXT_RE = /\b(?:https?|wss?):\/\/[^\s"'<>`]+/gi;
/**
 * Returns true when the URL uses a WebSocket protocol (ws: or wss:).
 * Used to distinguish direct-WebSocket CDP endpoints
 * from HTTP(S) endpoints that require /json/version discovery.
 */
function isWebSocketUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "ws:" || parsed.protocol === "wss:";
  } catch {
    return false;
  }
}
/**
 * Returns true when `url` is a ws/wss URL with a `/devtools/<kind>/<id>`
 * path segment — i.e. a handshake-ready per-browser or per-target CDP
 * endpoint that can be opened directly without HTTP discovery.
 *
 * Bare ws roots (`ws://host:port`, `ws://host:port/`) and any other
 * non-`/devtools/...` paths are NOT direct endpoints: Chrome's debug
 * port only accepts WebSocket upgrades on the specific path returned
 * by `GET /json/version`. Callers with a bare ws root must normalise
 * it to http for discovery instead of attempting a root handshake that
 * Chrome will reject with HTTP 400.
 */
function isDirectCdpWebSocketEndpoint(url) {
  if (!isWebSocketUrl(url)) return false;
  try {
    const parsed = new URL(url);
    return /\/devtools\/(?:browser|page|worker|shared_worker|service_worker)\/[^/]/i.test(
      parsed.pathname,
    );
  } catch {
    return false;
  }
  /* c8 ignore stop */
}
/** Restricts discovered CDP endpoints to the configured control-plane host. */
function scopeCdpPolicyToConfiguredEndpoint(cdpUrl, ssrfPolicy) {
  if (!ssrfPolicy) return;
  return withExactHostnamePolicy(ssrfPolicy, new URL(cdpUrl).hostname);
}
function cdpEndpointAuthority(url) {
  const parsed = new URL(url);
  const usesTls = parsed.protocol === "https:" || parsed.protocol === "wss:";
  const port = parsed.port || (usesTls ? "443" : "80");
  return `${usesTls ? "tls" : "plain"}://${parsed.hostname}:${port}`;
}
function assertDiscoveredCdpEndpointMatchesConfigured(discoveredUrl, configuredUrl, ssrfPolicy) {
  if (
    !ssrfPolicy ||
    isPrivateNetworkAllowedByPolicy(ssrfPolicy) ||
    cdpEndpointAuthority(discoveredUrl) === cdpEndpointAuthority(configuredUrl)
  )
    return;
  throw new BrowserCdpEndpointBlockedError({
    cause: new SsrFBlockedError("discovered CDP endpoint changed configured authority"),
  });
}
async function assertCdpEndpointAllowed(cdpUrl, ssrfPolicy, options) {
  if (options?.source === "discovered")
    assertDiscoveredCdpEndpointMatchesConfigured(cdpUrl, options.configuredUrl, ssrfPolicy);
  if (!ssrfPolicy) return;
  const parsed = new URL(cdpUrl);
  if (!["http:", "https:", "ws:", "wss:"].includes(parsed.protocol))
    throw new Error(`Invalid CDP URL protocol: ${parsed.protocol.replace(":", "")}`);
  try {
    const policy =
      isLoopbackHost(parsed.hostname) && options?.source !== "discovered"
        ? withExactHostnamePolicy(ssrfPolicy, parsed.hostname)
        : ssrfPolicy;
    await resolvePinnedHostnameWithPolicy(parsed.hostname, { policy });
  } catch (error) {
    throw new BrowserCdpEndpointBlockedError({ cause: error });
  }
}
function decodeUrlUserInfo(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function rawCdpMessageToString(data) {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  if (ArrayBuffer.isView(data))
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8");
  return Buffer.from(data).toString("utf8");
}
/** Merge URL basic-auth credentials into headers without overriding explicit auth. */
function getHeadersWithAuth(url, headers = {}) {
  const mergedHeaders = { ...headers };
  try {
    const parsed = new URL(url);
    if (Object.keys(mergedHeaders).some((key) => key.trim().toLowerCase() === "authorization"))
      return mergedHeaders;
    if (parsed.username || parsed.password) {
      const username = decodeUrlUserInfo(parsed.username);
      const password = decodeUrlUserInfo(parsed.password);
      const auth = Buffer.from(`${username}:${password}`).toString("base64");
      return {
        ...mergedHeaders,
        Authorization: `Basic ${auth}`,
      };
    }
  } catch {}
  return mergedHeaders;
}
/** Remove URL userinfo after callers have converted it to an Authorization header. */
function stripCdpUrlCredentials(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.username && !parsed.password) return url;
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return url;
  }
}
/** Redact CDP URLs and credential-shaped text before dependency errors leave Browser. */
function redactCdpErrorText(text) {
  return redactToolPayloadText(
    text.replace(CDP_URL_IN_TEXT_RE, (match) => redactCdpUrl(match) ?? match),
  );
}
/** Append a JSON endpoint path to a CDP HTTP base URL. */
function appendCdpPath(cdpUrl, path) {
  const url = new URL(cdpUrl);
  url.pathname = `${url.pathname.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  return url.toString();
}
/** Normalize ws/wss and direct devtools URLs back to the HTTP JSON endpoint base. */
function normalizeCdpHttpBaseForJsonEndpoints(cdpUrl) {
  try {
    const url = new URL(cdpUrl);
    if (url.protocol === "ws:") url.protocol = "http:";
    else if (url.protocol === "wss:") url.protocol = "https:";
    url.pathname = url.pathname.replace(/\/devtools\/browser\/.*$/, "");
    url.pathname = url.pathname.replace(/\/cdp$/, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return cdpUrl
      .replace(/^ws:/, "http:")
      .replace(/^wss:/, "https:")
      .replace(/\/devtools\/browser\/.*$/, "")
      .replace(/\/cdp$/, "")
      .replace(/\/$/, "");
  }
}
function createCdpSender(ws, opts) {
  let nextId = 1;
  const pending = /* @__PURE__ */ new Map();
  const commandTimeoutMs =
    typeof opts?.commandTimeoutMs === "number" && Number.isFinite(opts.commandTimeoutMs)
      ? normalizeBrowserTimerDelayMs(opts.commandTimeoutMs)
      : void 0;
  const clearPendingTimer = (p) => {
    if (p.timer !== void 0) clearTimeout(p.timer);
  };
  const send = (method, params, sessionId) => {
    const id = nextId++;
    const msg = {
      id,
      method,
      params,
      sessionId,
    };
    return new Promise((resolve, reject) => {
      if (ws.readyState !== WebSocket$1.OPEN) {
        reject(/* @__PURE__ */ new Error("CDP socket closed"));
        return;
      }
      const entry = {
        resolve,
        reject,
      };
      if (commandTimeoutMs !== void 0)
        entry.timer = setTimeout(() => {
          closeWithError(
            /* @__PURE__ */ new Error(
              `CDP command ${method} timed out after ${commandTimeoutMs}ms`,
            ),
          );
        }, commandTimeoutMs);
      pending.set(id, entry);
      try {
        ws.send(JSON.stringify(msg));
      } catch (err) {
        pending.delete(id);
        clearPendingTimer(entry);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  };
  const closeWithError = (err) => {
    for (const [, p] of pending) {
      clearPendingTimer(p);
      p.reject(err);
    }
    pending.clear();
    try {
      ws.close();
    } catch {}
  };
  ws.on("error", (err) => {
    /* c8 ignore next */
    closeWithError(err instanceof Error ? err : new Error(String(err)));
  });
  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(rawCdpMessageToString(data));
      if (typeof parsed.id !== "number") return;
      const p = pending.get(parsed.id);
      if (!p) return;
      pending.delete(parsed.id);
      clearPendingTimer(p);
      if (parsed.error?.message) {
        p.reject(new Error(parsed.error.message));
        return;
      }
      p.resolve(parsed.result);
    } catch {}
  });
  ws.on("close", () => {
    closeWithError(/* @__PURE__ */ new Error("CDP socket closed"));
  });
  return {
    send,
    closeWithError,
  };
}
/** Fetch and parse a CDP JSON endpoint through the configured SSRF guard. */
async function fetchJson(url, timeoutMs = CDP_HTTP_REQUEST_TIMEOUT_MS, init, ssrfPolicy) {
  const { response, release } = await fetchCdpChecked(url, timeoutMs, init, ssrfPolicy);
  try {
    return await readProviderJsonResponse(response, "cdp-json");
  } finally {
    await release();
  }
}
/** Fetch a CDP endpoint and return the response with an idempotent release hook. */
async function fetchCdpChecked(url, timeoutMs = CDP_HTTP_REQUEST_TIMEOUT_MS, init, ssrfPolicy) {
  const ctrl = new AbortController();
  const t = setTimeout(ctrl.abort.bind(ctrl), normalizeBrowserTimerDelayMs(timeoutMs));
  let guardedRelease;
  let released = false;
  const release = async () => {
    if (released) return;
    released = true;
    clearTimeout(t);
    await guardedRelease?.();
  };
  try {
    const headers = getHeadersWithAuth(url, init?.headers || {});
    const fetchUrl = stripCdpUrlCredentials(url);
    const res = await withManagedProxyForCdpUrl(fetchUrl, () =>
      withNoProxyForCdpUrl(fetchUrl, async () => {
        const parsedUrl = new URL(fetchUrl);
        const policy = isLoopbackHost(parsedUrl.hostname)
          ? withExactHostnamePolicy(ssrfPolicy, parsedUrl.hostname)
          : (ssrfPolicy ?? { allowPrivateNetwork: true });
        const guarded = await fetchWithSsrFGuard({
          url: fetchUrl,
          init: {
            ...init,
            headers,
          },
          signal: ctrl.signal,
          policy,
          auditContext: "browser-cdp",
        });
        guardedRelease = guarded.release;
        return guarded.response;
      }),
    );
    if (!res.ok) {
      if (res.status === 429)
        throw new Error(`${resolveBrowserRateLimitMessage(url)} Do NOT retry the browser tool.`);
      throw new Error(`HTTP ${res.status}`);
    }
    return {
      response: res,
      release,
    };
  } catch (error) {
    await release();
    if (error instanceof SsrFBlockedError)
      throw new BrowserCdpEndpointBlockedError({ cause: error });
    throw error;
  }
}
/** Probe that a CDP endpoint responds with an OK HTTP status. */
async function fetchOk(url, timeoutMs = CDP_HTTP_REQUEST_TIMEOUT_MS, init, ssrfPolicy) {
  const { release } = await fetchCdpChecked(url, timeoutMs, init, ssrfPolicy);
  await release();
}
/** Open a CDP WebSocket with URL basic-auth and proxy bypass handling. */
function openCdpWebSocket(wsUrl, opts) {
  const headers = getHeadersWithAuth(wsUrl, opts?.headers ?? {});
  const handshakeTimeoutMs =
    typeof opts?.handshakeTimeoutMs === "number" && Number.isFinite(opts.handshakeTimeoutMs)
      ? Math.max(1, Math.floor(opts.handshakeTimeoutMs))
      : CDP_WS_HANDSHAKE_TIMEOUT_MS;
  const connectionUrl = stripCdpUrlCredentials(wsUrl);
  const agent = getDirectAgentForCdp(connectionUrl);
  return withManagedProxyForCdpUrl(
    connectionUrl,
    () =>
      new WebSocket$1(connectionUrl, {
        handshakeTimeout: handshakeTimeoutMs,
        ...(Object.keys(headers).length ? { headers } : {}),
        ...(agent ? { agent } : {}),
      }),
  );
}
function normalizeRetryCount(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}
function computeHandshakeRetryDelayMs(attempt, opts) {
  const baseDelayMs =
    typeof opts?.handshakeRetryDelayMs === "number" && Number.isFinite(opts.handshakeRetryDelayMs)
      ? Math.max(1, Math.floor(opts.handshakeRetryDelayMs))
      : 200;
  const maxDelayMs =
    typeof opts?.handshakeMaxRetryDelayMs === "number" &&
    Number.isFinite(opts.handshakeMaxRetryDelayMs)
      ? Math.max(baseDelayMs, Math.floor(opts.handshakeMaxRetryDelayMs))
      : 3e3;
  const raw = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt - 1));
  const jitterScale = 0.8 + Math.random() * 0.4;
  return Math.max(1, Math.floor(raw * jitterScale));
}
function shouldRetryCdpHandshakeError(err) {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  if (!msg) return false;
  if (msg.includes("rate limit")) return false;
  const statusMatch = msg.match(/(?:unexpected server response|response):\s*(\d{3})/);
  if (statusMatch?.[1]) return Number(statusMatch[1]) >= 500;
  return (
    msg.includes("cdp socket closed") ||
    msg.includes("econnreset") ||
    msg.includes("econnrefused") ||
    msg.includes("econnaborted") ||
    msg.includes("ehostunreach") ||
    msg.includes("enetunreach") ||
    msg.includes("etimedout") ||
    msg.includes("socket hang up") ||
    msg.includes("websocket error") ||
    msg.includes("closed before")
  );
}
async function withCdpSocket(wsUrl, fn, opts) {
  const maxHandshakeRetries = normalizeRetryCount(opts?.handshakeRetries, 2);
  let lastHandshakeError;
  for (let attempt = 0; attempt <= maxHandshakeRetries; attempt += 1) {
    const ws = openCdpWebSocket(wsUrl, opts);
    const { send, closeWithError } = createCdpSender(ws, opts);
    const openPromise = new Promise((resolve, reject) => {
      ws.once("open", () => resolve());
      ws.once("error", (err) => reject(err));
      ws.once("close", () => reject(/* @__PURE__ */ new Error("CDP socket closed")));
    });
    try {
      await openPromise;
    } catch (err) {
      lastHandshakeError = err;
      /* c8 ignore next */
      closeWithError(err instanceof Error ? err : new Error(String(err)));
      try {
        ws.close();
      } catch {}
      if (attempt >= maxHandshakeRetries || !shouldRetryCdpHandshakeError(err)) throw err;
      await sleep(computeHandshakeRetryDelayMs(attempt + 1, opts));
      continue;
    }
    try {
      return await fn(send);
    } catch (err) {
      closeWithError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      try {
        ws.close();
      } catch {}
    }
  }
  if (lastHandshakeError instanceof Error) throw lastHandshakeError;
  throw new Error("CDP socket failed to open");
}
//#endregion
export {
  toBrowserErrorResponse as A,
  usesFastLoopbackCdpProbeClass as B,
  BrowserProfileUnavailableError as C,
  BrowserTargetAmbiguousError as D,
  BrowserTabNotFoundError as E,
  CHROME_MCP_ATTACH_READY_WINDOW_MS as F,
  withNoProxyForCdpUrl as H,
  CHROME_STDERR_HINT_MAX_CHARS as I,
  CHROME_STOP_TIMEOUT_MS as L,
  CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS as M,
  CHROME_BOOTSTRAP_PREFS_TIMEOUT_MS as N,
  BrowserValidationError as O,
  CHROME_LAUNCH_READY_WINDOW_MS as P,
  PROFILE_ATTACH_RETRY_TIMEOUT_MS as R,
  BrowserProfileNotFoundError as S,
  BrowserResourceExhaustedError as T,
  ensureAbsoluteDirectory as U,
  assertManagedProxyAllowsCdpUrl as V,
  withTimeout as W,
  resolveBrowserRateLimitMessage as _,
  fetchOk as a,
  BrowserConflictError as b,
  isWebSocketUrl as c,
  redactCdpErrorText as d,
  scopeCdpPolicyToConfiguredEndpoint as f,
  withExactHostnamePolicy as g,
  normalizeBrowserTimerDelayMs as h,
  fetchJson as i,
  CDP_JSON_NEW_TIMEOUT_MS as j,
  parseBrowserErrorPayload as k,
  normalizeCdpHttpBaseForJsonEndpoints as l,
  withCdpSocket as m,
  assertCdpEndpointAllowed as n,
  getHeadersWithAuth as o,
  stripCdpUrlCredentials as p,
  fetchCdpChecked as r,
  isDirectCdpWebSocketEndpoint as s,
  appendCdpPath as t,
  openCdpWebSocket as u,
  BROWSER_ERROR_REASONS as v,
  BrowserResetUnsupportedError as w,
  BrowserError as x,
  BrowserCdpEndpointBlockedError as y,
  resolveCdpReachabilityTimeouts as z,
};
