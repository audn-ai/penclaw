import { t as parseBrowserHttpUrl } from "./browser-config-BYZ1IWa3.js";
import {
  _ as resolveBrowserRateLimitMessage,
  k as parseBrowserErrorPayload,
} from "./cdp.helpers-ChuUODxP.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-CzdiqFrD.js";
import { n as resolveBrowserControlAuth } from "./control-auth-BvDcTJb9.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./response-limit-runtime-B_DBKaLw.js";
import "./ssrf-runtime-DJ478vv8.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./constants-C2_ZjRRD.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import {
  d as clampPositiveTimerTimeoutMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import "./config-B4sqH_Om.js";
import "./sdk-setup-tools-D5_dW0Tr.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region extensions/browser/src/browser/bridge-auth-registry.ts
/**
 * Ephemeral auth registry for loopback browser bridge servers.
 *
 * Dynamic sandbox/host ports need auth lookup without persisting tokens in
 * config files, so callers store credentials only for the current process.
 */
const authByPort = /* @__PURE__ */ new Map();
/** Store auth material for a loopback bridge port in the current process. */
function setBridgeAuthForPort(port, auth) {
  if (!Number.isFinite(port) || port <= 0) return;
  const token = normalizeOptionalString(auth.token) ?? "";
  const password = normalizeOptionalString(auth.password) ?? "";
  authByPort.set(port, {
    token: token || void 0,
    password: password || void 0,
  });
}
/** Read auth material for a loopback bridge port. */
function getBridgeAuthForPort(port) {
  if (!Number.isFinite(port) || port <= 0) return;
  return authByPort.get(port);
}
/** Drop auth material when a bridge server closes or changes port. */
function deleteBridgeAuthForPort(port) {
  if (!Number.isFinite(port) || port <= 0) return;
  authByPort.delete(port);
}
//#endregion
//#region extensions/browser/src/browser/client-actions-url.ts
/**
 * URL helpers for browser client action requests.
 */
/** Build a query string for profile-scoped browser requests. */
function buildProfileQuery(profile) {
  return profile ? `?profile=${encodeURIComponent(profile)}` : "";
}
/** Prefix a browser-control path with an optional base URL. */
function withBaseUrl(baseUrl, path) {
  const trimmed = baseUrl?.trim();
  if (!trimmed) return path;
  return `${trimmed.replace(/\/$/, "")}${path}`;
}
//#endregion
//#region extensions/browser/src/browser/client-fetch.ts
/**
 * Browser control client transport.
 *
 * Sends requests to either an absolute HTTP browser-control URL or the local
 * in-process dispatcher, adding loopback auth and operator-facing diagnostics.
 */
var BrowserServiceError = class extends Error {
  constructor(message, metadata, status) {
    super(message);
    this.name = "BrowserServiceError";
    this.status = status;
    this.reason = metadata?.reason;
    this.details = metadata?.details;
  }
};
function browserServiceErrorFromPayload(value, fallback, status) {
  const parsed = parseBrowserErrorPayload(value);
  return new BrowserServiceError(
    parsed?.error ?? fallback,
    parsed && "reason" in parsed ? parsed : void 0,
    status,
  );
}
function isAbsoluteHttp(url) {
  return /^https?:\/\//i.test(url.trim());
}
function isLoopbackHttpUrl(url) {
  try {
    return isLoopbackHost(new URL(url).hostname);
  } catch {
    return false;
  }
}
function withLoopbackBrowserAuthImpl(url, init, deps) {
  const headers = new Headers(init?.headers ?? {});
  if (headers.has("authorization") || headers.has("x-openclaw-password"))
    return {
      ...init,
      headers,
    };
  if (!isLoopbackHttpUrl(url))
    return {
      ...init,
      headers,
    };
  try {
    const cfg = deps.getRuntimeConfig();
    const auth = deps.resolveBrowserControlAuth(cfg);
    if (auth.token) {
      headers.set("Authorization", `Bearer ${auth.token}`);
      return {
        ...init,
        headers,
      };
    }
    if (auth.password) {
      headers.set("x-openclaw-password", auth.password);
      return {
        ...init,
        headers,
      };
    }
  } catch {}
  try {
    const { port } = parseBrowserHttpUrl(url, "browser control URL");
    const bridgeAuth = deps.getBridgeAuthForPort(port);
    if (bridgeAuth?.token) headers.set("Authorization", `Bearer ${bridgeAuth.token}`);
    else if (bridgeAuth?.password) headers.set("x-openclaw-password", bridgeAuth.password);
  } catch {}
  return {
    ...init,
    headers,
  };
}
function withLoopbackBrowserAuth(url, init) {
  return withLoopbackBrowserAuthImpl(url, init, {
    getRuntimeConfig,
    resolveBrowserControlAuth,
    getBridgeAuthForPort,
  });
}
const BROWSER_TOOL_MODEL_HINT =
  "Do NOT retry the browser tool — it will keep failing. Use an alternative approach or inform the user that the browser is currently unavailable.";
const BROWSER_ERROR_BODY_LIMIT_BYTES = 16 * 1024;
const BROWSER_SUCCESS_BODY_LIMIT_BYTES = 32 * 1024 * 1024;
function isRateLimitStatus(status) {
  return status === 429;
}
function resolveDispatcherBrowserControlOwnership(url) {
  if (isAbsoluteHttp(url)) return "unknown";
  try {
    const cfg = getRuntimeConfig();
    const resolved = resolveBrowserConfig(cfg?.browser, cfg);
    const requestedProfile = new URL(url, "http://localhost").searchParams.get("profile")?.trim();
    const profile = resolveProfile(resolved, requestedProfile || resolved.defaultProfile);
    if (!profile) return "unknown";
    return profile.driver === "openclaw" && profile.cdpIsLoopback && !profile.attachOnly
      ? "local-managed"
      : "external-browser";
  } catch {
    return "unknown";
  }
}
function resolveBrowserFetchOperatorHint(url, opts) {
  if (opts?.ownership === "external-browser")
    return "The browser profile is external to OpenClaw; make sure its browser/CDP endpoint is running and reachable. Restarting the OpenClaw gateway will not launch it.";
  return !isAbsoluteHttp(url)
    ? `Restart the OpenClaw gateway (OpenClaw.app menubar, or \`${formatCliCommand("openclaw gateway")}\`).`
    : "If this is a sandboxed session, ensure the sandbox browser is running.";
}
function normalizeErrorMessage(err) {
  const message = err instanceof Error ? normalizeOptionalString(err.message) : void 0;
  if (message) return message;
  return String(err);
}
function appendBrowserToolModelHint(message) {
  if (message.includes(BROWSER_TOOL_MODEL_HINT)) return message;
  return `${message} ${BROWSER_TOOL_MODEL_HINT}`;
}
function resolveBrowserFetchTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, 5e3);
}
function classifyBrowserFetchFailure(err) {
  const msgLower = normalizeLowercaseStringOrEmpty(normalizeErrorMessage(err));
  const nameLower = err instanceof Error ? normalizeLowercaseStringOrEmpty(err.name) : "";
  if (
    nameLower.includes("timeout") ||
    msgLower.includes("timed out") ||
    msgLower.includes("timeout")
  )
    return "timeout";
  return nameLower === "aborterror" ||
    msgLower.includes("aborterror") ||
    msgLower.includes("aborted") ||
    msgLower.includes("abort") ||
    msgLower.includes("cancelled") ||
    msgLower.includes("canceled")
    ? "aborted"
    : "persistent";
}
async function discardResponseBody(res) {
  try {
    await res.body?.cancel();
  } catch {}
}
function enhanceDispatcherPathError(url, err) {
  const msg = normalizeErrorMessage(err);
  const kind = classifyBrowserFetchFailure(err);
  const operatorHint = resolveBrowserFetchOperatorHint(url, {
    ownership: resolveDispatcherBrowserControlOwnership(url),
  });
  const suffix =
    kind === "persistent" ? `${operatorHint} ${BROWSER_TOOL_MODEL_HINT}` : operatorHint;
  const normalized = msg.endsWith(".") ? msg : `${msg}.`;
  return new Error(`${normalized} ${suffix}`, err instanceof Error ? { cause: err } : void 0);
}
function enhanceBrowserFetchError(url, err, timeoutMs) {
  const operatorHint = resolveBrowserFetchOperatorHint(url);
  const msg = normalizeErrorMessage(err);
  const kind = classifyBrowserFetchFailure(err);
  if (kind === "timeout")
    return new Error(
      `Can't reach the OpenClaw browser control service (timed out after ${timeoutMs}ms). ${operatorHint}`,
      err instanceof Error ? { cause: err } : void 0,
    );
  if (kind === "aborted")
    return new Error(
      `Browser control request was cancelled. ${operatorHint}`,
      err instanceof Error ? { cause: err } : void 0,
    );
  return new Error(
    appendBrowserToolModelHint(
      `Can't reach the OpenClaw browser control service. ${operatorHint} (${msg})`,
    ),
    err instanceof Error ? { cause: err } : void 0,
  );
}
async function fetchHttpJson(url, init) {
  const timeoutMs = resolveBrowserFetchTimeoutMs(init.timeoutMs);
  const ctrl = new AbortController();
  const upstreamSignal = init.signal;
  let upstreamAbortListener;
  if (upstreamSignal)
    if (upstreamSignal.aborted) ctrl.abort(upstreamSignal.reason);
    else {
      upstreamAbortListener = () => ctrl.abort(upstreamSignal.reason);
      upstreamSignal.addEventListener("abort", upstreamAbortListener, { once: true });
    }
  const t = setTimeout(() => ctrl.abort(/* @__PURE__ */ new Error("timed out")), timeoutMs);
  let release;
  try {
    const guarded = await fetchWithSsrFGuard({
      url,
      init,
      signal: ctrl.signal,
      policy: { allowPrivateNetwork: true },
      auditContext: "browser-control-client",
    });
    release = guarded.release;
    const res = guarded.response;
    if (!res.ok) {
      if (isRateLimitStatus(res.status)) {
        await discardResponseBody(res);
        throw new BrowserServiceError(
          `${resolveBrowserRateLimitMessage(url)} ${BROWSER_TOOL_MODEL_HINT}`,
        );
      }
      const body = await readResponseWithLimit(res, BROWSER_ERROR_BODY_LIMIT_BYTES).catch(
        () => void 0,
      );
      const text = body ? new TextDecoder().decode(body) : "";
      let parsed;
      if (text)
        try {
          parsed = JSON.parse(text);
        } catch {}
      throw browserServiceErrorFromPayload(parsed, text || `HTTP ${res.status}`, res.status);
    }
    const body = await readResponseWithLimit(res, BROWSER_SUCCESS_BODY_LIMIT_BYTES, {
      onOverflow: ({ maxBytes }) =>
        new BrowserServiceError(`Browser control response exceeded ${maxBytes} bytes`),
    });
    return JSON.parse(new TextDecoder().decode(body));
  } finally {
    clearTimeout(t);
    await release?.();
    if (upstreamSignal && upstreamAbortListener)
      upstreamSignal.removeEventListener("abort", upstreamAbortListener);
  }
}
/** Fetch JSON from browser control over HTTP or local dispatcher transport. */
async function fetchBrowserJson(url, init) {
  const timeoutMs = resolveBrowserFetchTimeoutMs(init?.timeoutMs);
  let isDispatcherPath = false;
  try {
    if (isAbsoluteHttp(url))
      return await fetchHttpJson(url, {
        ...withLoopbackBrowserAuth(url, init),
        timeoutMs,
      });
    isDispatcherPath = true;
    const { dispatchBrowserControlRequest } = await import("./local-dispatch.runtime.js");
    const parsed = new URL(url, "http://localhost");
    const query = {};
    for (const [key, value] of parsed.searchParams.entries()) query[key] = value;
    let body = init?.body;
    if (typeof body === "string")
      try {
        body = JSON.parse(body);
      } catch {}
    const abortCtrl = new AbortController();
    const upstreamSignal = init?.signal;
    let upstreamAbortListener;
    if (upstreamSignal)
      if (upstreamSignal.aborted) abortCtrl.abort(upstreamSignal.reason);
      else {
        upstreamAbortListener = () => abortCtrl.abort(upstreamSignal.reason);
        upstreamSignal.addEventListener("abort", upstreamAbortListener, { once: true });
      }
    let abortListener;
    const abortPromise = abortCtrl.signal.aborted
      ? Promise.reject(
          toLintErrorObject(
            abortCtrl.signal.reason ?? /* @__PURE__ */ new Error("aborted"),
            "Non-Error rejection",
          ),
        )
      : new Promise((_, reject) => {
          abortListener = () =>
            reject(
              toLintErrorObject(
                abortCtrl.signal.reason ?? /* @__PURE__ */ new Error("aborted"),
                "Non-Error rejection",
              ),
            );
          abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
        });
    let timer;
    if (timeoutMs)
      timer = setTimeout(() => abortCtrl.abort(/* @__PURE__ */ new Error("timed out")), timeoutMs);
    const dispatchPromise = dispatchBrowserControlRequest({
      method:
        init?.method?.toUpperCase() === "DELETE"
          ? "DELETE"
          : init?.method?.toUpperCase() === "POST"
            ? "POST"
            : "GET",
      path: parsed.pathname,
      query,
      body,
      signal: abortCtrl.signal,
    });
    const result = await Promise.race([dispatchPromise, abortPromise]).finally(() => {
      if (timer) clearTimeout(timer);
      if (abortListener) abortCtrl.signal.removeEventListener("abort", abortListener);
      if (upstreamSignal && upstreamAbortListener)
        upstreamSignal.removeEventListener("abort", upstreamAbortListener);
    });
    if (result.status >= 400) {
      if (isRateLimitStatus(result.status))
        throw new BrowserServiceError(
          `${resolveBrowserRateLimitMessage(url)} ${BROWSER_TOOL_MODEL_HINT}`,
        );
      throw browserServiceErrorFromPayload(result.body, `HTTP ${result.status}`, result.status);
    }
    return result.body;
  } catch (err) {
    if (err instanceof BrowserServiceError) throw err;
    if (isDispatcherPath) throw enhanceDispatcherPathError(url, err);
    throw enhanceBrowserFetchError(url, err, timeoutMs);
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
//#region extensions/browser/src/browser/client.ts
/**
 * Browser control client API.
 *
 * Provides typed helpers for status, profile lifecycle, tabs, and snapshots
 * over the browser-control transport.
 */
const BROWSER_STATUS_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DOCTOR_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS = 1e4;
const JSON_HEADERS = { "Content-Type": "application/json" };
function resolveBrowserClientTimeoutMs(opts, fallbackMs) {
  return resolveTimerTimeoutMs(opts?.timeoutMs, fallbackMs);
}
function withProfilePath(baseUrl, path, profile) {
  const profileQuery = buildProfileQuery(profile);
  if (!profileQuery) return withBaseUrl(baseUrl, path);
  return withBaseUrl(baseUrl, `${path}${path.includes("?") ? "&" : "?"}${profileQuery.slice(1)}`);
}
async function sendProfilePost(baseUrl, path, opts, fallbackTimeoutMs) {
  await fetchBrowserJson(withProfilePath(baseUrl, path, opts?.profile), {
    method: "POST",
    timeoutMs: resolveBrowserClientTimeoutMs(opts, fallbackTimeoutMs),
  });
}
async function sendTabTargetRequest(params) {
  await fetchBrowserJson(withProfilePath(params.baseUrl, params.path, params.opts?.profile), {
    method: params.method,
    ...(params.body
      ? {
          headers: JSON_HEADERS,
          body: JSON.stringify(params.body),
        }
      : {}),
    timeoutMs: resolveBrowserClientTimeoutMs(params.opts, 5e3),
  });
}
/** Read browser-control status for the selected profile. */
async function browserStatus(baseUrl, opts) {
  return await fetchBrowserJson(withProfilePath(baseUrl, "/", opts?.profile), {
    timeoutMs: resolveBrowserClientTimeoutMs(opts, BROWSER_STATUS_REQUEST_TIMEOUT_MS),
  });
}
/** Run browser doctor checks for the selected profile. */
async function browserDoctor(baseUrl, opts) {
  const params = new URLSearchParams();
  if (opts?.profile) params.set("profile", opts.profile);
  if (opts?.deep) params.set("deep", "true");
  return await fetchBrowserJson(
    withBaseUrl(baseUrl, `/doctor${params.size ? `?${params.toString()}` : ""}`),
    {
      timeoutMs: opts?.deep
        ? BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS
        : BROWSER_DOCTOR_REQUEST_TIMEOUT_MS,
    },
  );
}
/** List configured browser profiles and their current status. */
async function browserProfiles(baseUrl, opts) {
  return (
    (
      await fetchBrowserJson(withBaseUrl(baseUrl, `/profiles`), {
        timeoutMs: resolveBrowserClientTimeoutMs(opts, 3e3),
      })
    ).profiles ?? []
  );
}
/** List Chrome-family profiles available on the local macOS host. */
async function browserSystemProfiles(baseUrl, opts) {
  return (
    (
      await fetchBrowserJson(
        withBaseUrl(
          baseUrl,
          `/system-profiles${opts?.browser ? `?browser=${encodeURIComponent(opts.browser)}` : ""}`,
        ),
        { timeoutMs: resolveBrowserClientTimeoutMs(opts, 3e3) },
      )
    ).systemProfiles ?? []
  );
}
/** Import system-profile cookies into a managed browser profile. */
async function browserImportProfile(baseUrl, opts) {
  return await fetchBrowserJson(withBaseUrl(baseUrl, "/profiles/import"), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(opts),
    timeoutMs: 12e4,
  });
}
/** Start the selected browser profile. */
async function browserStart(baseUrl, opts) {
  await sendProfilePost(baseUrl, "/start", opts, 15e3);
}
/** Stop the selected browser profile. */
async function browserStop(baseUrl, opts) {
  await sendProfilePost(baseUrl, "/stop", opts, 15e3);
}
/** Reset the selected managed browser profile directory. */
async function browserResetProfile(baseUrl, opts) {
  return await fetchBrowserJson(
    withBaseUrl(baseUrl, `/reset-profile${buildProfileQuery(opts?.profile)}`),
    {
      method: "POST",
      timeoutMs: 2e4,
    },
  );
}
/** Create and persist a browser profile. */
async function browserCreateProfile(baseUrl, opts) {
  return await fetchBrowserJson(withBaseUrl(baseUrl, `/profiles/create`), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      name: opts.name,
      color: opts.color,
      cdpUrl: opts.cdpUrl,
      userDataDir: opts.userDataDir,
      driver: opts.driver,
    }),
    timeoutMs: 1e4,
  });
}
/** Delete a configured browser profile. */
async function browserDeleteProfile(baseUrl, profile) {
  return await fetchBrowserJson(withBaseUrl(baseUrl, `/profiles/${encodeURIComponent(profile)}`), {
    method: "DELETE",
    timeoutMs: 2e4,
  });
}
/** List tabs for the selected browser profile. */
async function browserTabs(baseUrl, opts) {
  return (
    (
      await fetchBrowserJson(withProfilePath(baseUrl, "/tabs", opts?.profile), {
        timeoutMs: resolveBrowserClientTimeoutMs(opts, 3e3),
      })
    ).tabs ?? []
  );
}
/** Open a new tab in the selected browser profile. */
async function browserOpenTab(baseUrl, url, opts) {
  return await fetchBrowserJson(withProfilePath(baseUrl, "/tabs/open", opts?.profile), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      url,
      ...(opts?.label ? { label: opts.label } : {}),
    }),
    timeoutMs: resolveBrowserClientTimeoutMs(opts, 15e3),
  });
}
/** Focus an existing browser tab. */
async function browserFocusTab(baseUrl, targetId, opts) {
  await sendTabTargetRequest({
    baseUrl,
    path: "/tabs/focus",
    method: "POST",
    opts,
    body: { targetId },
  });
}
/** Close an existing browser tab. */
async function browserCloseTab(baseUrl, targetId, opts) {
  await sendTabTargetRequest({
    baseUrl,
    path: `/tabs/${encodeURIComponent(targetId)}`,
    method: "DELETE",
    opts,
  });
}
/** Close a canonical raw target id selected by OpenClaw's internal tab bookkeeping. */
async function browserCloseTabByRawTargetId(baseUrl, targetId, opts) {
  await sendTabTargetRequest({
    baseUrl,
    path: `/tabs/${encodeURIComponent(targetId)}?targetIdMode=raw`,
    method: "DELETE",
    opts,
  });
}
/** Execute legacy index-based tab actions. */
async function browserTabAction(baseUrl, opts) {
  return await fetchBrowserJson(
    withBaseUrl(baseUrl, `/tabs/action${buildProfileQuery(opts.profile)}`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: opts.action,
        index: opts.index,
      }),
      timeoutMs: 1e4,
    },
  );
}
/** Capture an ARIA or AI snapshot for the selected tab. */
async function browserSnapshot(baseUrl, opts) {
  const q = new URLSearchParams();
  if (opts.format) q.set("format", opts.format);
  if (opts.targetId) q.set("targetId", opts.targetId);
  if (typeof opts.limit === "number") q.set("limit", String(opts.limit));
  if (typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars))
    q.set("maxChars", String(opts.maxChars));
  if (opts.refs === "aria" || opts.refs === "role") q.set("refs", opts.refs);
  if (typeof opts.interactive === "boolean") q.set("interactive", String(opts.interactive));
  if (typeof opts.compact === "boolean") q.set("compact", String(opts.compact));
  if (typeof opts.depth === "number" && Number.isFinite(opts.depth))
    q.set("depth", String(opts.depth));
  if (opts.selector?.trim()) q.set("selector", opts.selector.trim());
  if (opts.frame?.trim()) q.set("frame", opts.frame.trim());
  if (opts.labels === true) q.set("labels", "1");
  if (opts.urls === true) q.set("urls", "1");
  if (opts.mode) q.set("mode", opts.mode);
  if (opts.profile) q.set("profile", opts.profile);
  const resolvedTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
  q.set("timeoutMs", String(resolvedTimeoutMs));
  return await fetchBrowserJson(withBaseUrl(baseUrl, `/snapshot?${q.toString()}`), {
    timeoutMs: resolvedTimeoutMs,
  });
}
//#endregion
//#region extensions/browser/src/browser/session-tab-registry.ts
/**
 * In-memory registry that associates browser tabs with OpenClaw sessions for
 * cleanup on session end or idle sweeps.
 */
const trackedTabsBySession = /* @__PURE__ */ new Map();
function normalizeSessionKey(raw) {
  return normalizeOptionalLowercaseString(raw) ?? "";
}
function normalizeTargetId(raw) {
  return raw.trim();
}
function normalizeProfile(raw) {
  return normalizeOptionalLowercaseString(raw);
}
function normalizeBaseUrl(raw) {
  if (!raw) return;
  const trimmed = raw.trim();
  return trimmed ? trimmed : void 0;
}
function toTrackedTabId(params) {
  return `${params.targetId}\u0000${params.baseUrl ?? ""}\u0000${params.profile ?? ""}`;
}
function resolveTrackedTabIdentity(params) {
  const sessionKeyRaw = params.sessionKey?.trim();
  const targetIdRaw = params.targetId?.trim();
  if (!sessionKeyRaw || !targetIdRaw) return;
  return {
    sessionKey: normalizeSessionKey(sessionKeyRaw),
    targetId: normalizeTargetId(targetIdRaw),
    baseUrl: normalizeBaseUrl(params.baseUrl),
    profile: normalizeProfile(params.profile),
  };
}
function trackedTabsForIdentity(identity) {
  return trackedTabsBySession.get(identity.sessionKey);
}
function deleteTrackedTab(identity) {
  const trackedForSession = trackedTabsForIdentity(identity);
  if (!trackedForSession) return;
  trackedForSession.delete(toTrackedTabId(identity));
  if (trackedForSession.size === 0) trackedTabsBySession.delete(identity.sessionKey);
}
function isIgnorableCloseError(err) {
  const message = normalizeLowercaseStringOrEmpty(String(err));
  return (
    message.includes("tab not found") ||
    message.includes("target closed") ||
    message.includes("target not found") ||
    message.includes("no such target")
  );
}
/** Starts tracking a browser tab for later session cleanup. */
function trackSessionBrowserTab(params) {
  const identity = resolveTrackedTabIdentity(params);
  if (!identity) return;
  const now = Date.now();
  const tracked = {
    ...identity,
    trackedAt: now,
    lastUsedAt: now,
  };
  const trackedId = toTrackedTabId(tracked);
  let trackedForSession = trackedTabsBySession.get(identity.sessionKey);
  if (!trackedForSession) {
    trackedForSession = /* @__PURE__ */ new Map();
    trackedTabsBySession.set(identity.sessionKey, trackedForSession);
  }
  const existing = trackedForSession.get(trackedId);
  trackedForSession.set(trackedId, {
    ...tracked,
    trackedAt: existing?.trackedAt ?? tracked.trackedAt,
  });
}
/** Updates last-used time for a tracked browser tab. */
function touchSessionBrowserTab(params) {
  const identity = resolveTrackedTabIdentity(params);
  if (!identity) return;
  const trackedForSession = trackedTabsForIdentity(identity);
  if (!trackedForSession) return;
  const trackedId = toTrackedTabId(identity);
  const tracked = trackedForSession.get(trackedId);
  if (!tracked) return;
  trackedForSession.set(trackedId, {
    ...tracked,
    lastUsedAt: params.now ?? Date.now(),
  });
}
/** Removes a browser tab from session cleanup tracking. */
function untrackSessionBrowserTab(params) {
  const identity = resolveTrackedTabIdentity(params);
  if (!identity) return;
  deleteTrackedTab(identity);
}
function takeTrackedTabsForSessionKeys(sessionKeys) {
  const uniqueSessionKeys = /* @__PURE__ */ new Set();
  for (const key of sessionKeys) {
    if (!key?.trim()) continue;
    uniqueSessionKeys.add(normalizeSessionKey(key));
  }
  if (uniqueSessionKeys.size === 0) return [];
  const seenTrackedIds = /* @__PURE__ */ new Set();
  const tabs = [];
  for (const sessionKey of uniqueSessionKeys) {
    const trackedForSession = trackedTabsBySession.get(sessionKey);
    if (!trackedForSession || trackedForSession.size === 0) continue;
    trackedTabsBySession.delete(sessionKey);
    for (const tracked of trackedForSession.values()) {
      const trackedId = toTrackedTabId(tracked);
      if (seenTrackedIds.has(trackedId)) continue;
      seenTrackedIds.add(trackedId);
      tabs.push(tracked);
    }
  }
  return tabs;
}
async function closeTrackedTabs(params) {
  if (params.tabs.length === 0) return 0;
  const closeTab =
    params.closeTab ??
    (async (tab) => {
      await browserCloseTabByRawTargetId(tab.baseUrl, tab.targetId, { profile: tab.profile });
    });
  let closed = 0;
  for (const tab of params.tabs)
    try {
      await closeTab({
        targetId: tab.targetId,
        baseUrl: tab.baseUrl,
        profile: tab.profile,
      });
      closed += 1;
    } catch (err) {
      if (!isIgnorableCloseError(err))
        params.onWarn?.(`failed to close tracked browser tab ${tab.targetId}: ${String(err)}`);
    }
  return closed;
}
/** Closes and untracks tabs for the supplied session keys. */
async function closeTrackedBrowserTabsForSessions(params) {
  return await closeTrackedTabs({
    tabs: takeTrackedTabsForSessionKeys(params.sessionKeys),
    closeTab: params.closeTab,
    onWarn: params.onWarn,
  });
}
function takeStaleTrackedTabs(params) {
  const tabsToClose = [];
  const takenIdsBySession = /* @__PURE__ */ new Map();
  const mark = (sessionKey, trackedId, tracked) => {
    let takenForSession = takenIdsBySession.get(sessionKey);
    if (!takenForSession) {
      takenForSession = /* @__PURE__ */ new Set();
      takenIdsBySession.set(sessionKey, takenForSession);
    }
    if (takenForSession.has(trackedId)) return;
    takenForSession.add(trackedId);
    tabsToClose.push(tracked);
  };
  for (const [sessionKey, trackedForSession] of trackedTabsBySession) {
    if (params.sessionFilter && !params.sessionFilter(sessionKey)) continue;
    const entries = [...trackedForSession.entries()].toSorted(
      (a, b) => a[1].lastUsedAt - b[1].lastUsedAt || a[1].trackedAt - b[1].trackedAt,
    );
    if (params.idleMs && params.idleMs > 0) {
      for (const [trackedId, tracked] of entries)
        if (params.now - tracked.lastUsedAt >= params.idleMs) mark(sessionKey, trackedId, tracked);
    }
    const remainingEntries = entries.filter(
      ([trackedId]) => !takenIdsBySession.get(sessionKey)?.has(trackedId),
    );
    if (
      params.maxTabsPerSession &&
      params.maxTabsPerSession > 0 &&
      remainingEntries.length > params.maxTabsPerSession
    ) {
      const excess = remainingEntries.length - params.maxTabsPerSession;
      for (const [trackedId, tracked] of remainingEntries.slice(0, excess))
        mark(sessionKey, trackedId, tracked);
    }
  }
  for (const [sessionKey, trackedIds] of takenIdsBySession) {
    const trackedForSession = trackedTabsBySession.get(sessionKey);
    if (!trackedForSession) continue;
    for (const trackedId of trackedIds) trackedForSession.delete(trackedId);
    if (trackedForSession.size === 0) trackedTabsBySession.delete(sessionKey);
  }
  return tabsToClose;
}
/** Closes and untracks stale or excess browser tabs across tracked sessions. */
async function sweepTrackedBrowserTabs(params) {
  return await closeTrackedTabs({
    tabs: takeStaleTrackedTabs({
      now: params.now ?? Date.now(),
      idleMs: params.idleMs,
      maxTabsPerSession: params.maxTabsPerSession,
      sessionFilter: params.sessionFilter,
    }),
    closeTab: params.closeTab,
    onWarn: params.onWarn,
  });
}
//#endregion
export {
  fetchBrowserJson as C,
  setBridgeAuthForPort as D,
  deleteBridgeAuthForPort as E,
  BrowserServiceError as S,
  withBaseUrl as T,
  browserStatus as _,
  untrackSessionBrowserTab as a,
  browserTabAction as b,
  browserDeleteProfile as c,
  browserImportProfile as d,
  browserOpenTab as f,
  browserStart as g,
  browserSnapshot as h,
  trackSessionBrowserTab as i,
  browserDoctor as l,
  browserResetProfile as m,
  sweepTrackedBrowserTabs as n,
  browserCloseTab as o,
  browserProfiles as p,
  touchSessionBrowserTab as r,
  browserCreateProfile as s,
  closeTrackedBrowserTabsForSessions as t,
  browserFocusTab as u,
  browserStop as v,
  buildProfileQuery as w,
  browserTabs as x,
  browserSystemProfiles as y,
};
