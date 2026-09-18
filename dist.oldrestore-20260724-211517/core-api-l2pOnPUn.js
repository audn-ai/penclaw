import fs from "node:fs/promises";
import { l as resolveBrowserActRequestTimeoutMs } from "./act-policy-DJo1OgjZ.js";
import { n as redactCdpUrl } from "./browser-config-BYZ1IWa3.js";
import { W as withTimeout, k as parseBrowserErrorPayload } from "./cdp.helpers-ChuUODxP.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { r as resolveBrowserConfig } from "./config-CzdiqFrD.js";
import "./constants-C2_ZjRRD.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-B9nZG5m4.js";
import {
  a as resolveRequestedBrowserProfile,
  i as normalizeBrowserRequestPath,
  n as isBrowserHostLocalRoute,
  r as isPersistentBrowserProfileMutation,
  t as createBrowserRouteDispatcher,
} from "./dispatcher-DYywQike.js";
import { n as detectMime } from "./mime-BSEMEb3s.js";
import {
  a as addTimerTimeoutGraceMs,
  d as clampPositiveTimerTimeoutMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import "./chrome.executables-3W0Qoqc0.js";
import "./runtime-lifecycle-9c50Fgrr.js";
import "./sdk-setup-tools-D5_dW0Tr.js";
import "./control-auth-BvDcTJb9.js";
import "./server-middleware-Bz0JpPpu.js";
import "./bridge-server-D-TAwppC.js";
import { n as createBrowserControlContext } from "./plugin-enabled-C1NU0TDI.js";
import "./trash-DGM0lK0C.js";
import "./routes-FohuCP_M.js";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-CkNNtaOz.js";
import "./snapshot-urls-UoxUrSeb.js";
import {
  C as fetchBrowserJson,
  T as withBaseUrl,
  w as buildProfileQuery,
} from "./session-tab-registry-RbALbK2T.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region extensions/browser/src/browser-proxy-envelope.ts
/**
 * Browser node-proxy response envelope shared by the node host and Gateway.
 */
/** Additive opt-in for structured browser route errors over node.invoke. */
const BROWSER_PROXY_ERROR_ENVELOPE = "browser-v1";
const BROWSER_PROXY_MAX_FILE_BYTES = 10 * 1024 * 1024;
const BROWSER_PROXY_MAX_TOTAL_FILE_BYTES = 16 * 1024 * 1024;
const BROWSER_PROXY_MAX_FILES = 256;
/** Bound filesystem work even when one action emits many tiny downloads. */
function assertBrowserProxyFileCountWithinLimit(fileCount) {
  if (fileCount > BROWSER_PROXY_MAX_FILES)
    throw new Error("browser proxy response exceeds 256 file limit");
}
/** Enforce the shared per-file and raw aggregate Browser proxy limits. */
function assertBrowserProxyFileBytesWithinLimits(fileBytes, totalBytes) {
  if (fileBytes > 10485760) throw new Error("browser proxy file exceeds 10 MiB limit");
  if (totalBytes > BROWSER_PROXY_MAX_TOTAL_FILE_BYTES)
    throw new Error("browser proxy files exceed 16 MiB aggregate limit");
}
/** Visit the route-owned file paths that may cross the Browser node boundary. */
function visitBrowserProxyFilePaths(result, visit) {
  if (!result || typeof result !== "object" || Array.isArray(result)) return;
  const root = result;
  const visitPath = (owner, key) => {
    const filePath = owner[key];
    if (typeof filePath !== "string" || !filePath.trim()) return;
    const replacement = visit(filePath);
    if (typeof replacement === "string") owner[key] = replacement;
  };
  visitPath(root, "path");
  visitPath(root, "imagePath");
  const download = root.download;
  if (download && typeof download === "object" && !Array.isArray(download))
    visitPath(download, "path");
  if (Array.isArray(root.downloads)) {
    for (const entry of root.downloads)
      if (entry && typeof entry === "object" && !Array.isArray(entry)) visitPath(entry, "path");
  }
}
function normalizeBrowserProxyErrorBody(value, fallback) {
  const parsed = parseBrowserErrorPayload(value);
  if (parsed) return parsed;
  return fallback ? { error: fallback } : null;
}
/** Build a route-failure envelope while allowing only closed Browser metadata. */
function createBrowserProxyFailure(status, body) {
  return {
    error: {
      status,
      body: normalizeBrowserProxyErrorBody(body, `HTTP ${status}`) ?? { error: `HTTP ${status}` },
    },
  };
}
/** Parse an untrusted node response without forwarding arbitrary metadata. */
function parseBrowserProxyFailure(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const error = value.error;
  if (!error || typeof error !== "object" || Array.isArray(error)) return null;
  const candidate = error;
  if (!Number.isInteger(candidate.status) || candidate.status < 400 || candidate.status > 599)
    return null;
  const body = normalizeBrowserProxyErrorBody(candidate.body);
  if (!body) return null;
  return {
    error: {
      status: candidate.status,
      body,
    },
  };
}
//#endregion
//#region extensions/browser/src/browser/client-actions-core.ts
/**
 * Browser client action helpers.
 *
 * Wraps browser-control action endpoints for navigation, dialog/file hooks,
 * screenshots, and element actions used by the Browser agent tool.
 */
function normalizePositiveTimeoutMs(value) {
  return clampPositiveTimerTimeoutMs(value);
}
function resolveBrowserOperationRequestTimeoutMs(timeoutMs) {
  return addTimerTimeoutGraceMs(normalizePositiveTimeoutMs(timeoutMs) ?? 12e4, 5e3) ?? 1;
}
async function postDownloadRequest(baseUrl, route, body, profile, timeoutMs) {
  return await fetchBrowserJson(withBaseUrl(baseUrl, `${route}${buildProfileQuery(profile)}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    timeoutMs: resolveBrowserOperationRequestTimeoutMs(timeoutMs),
  });
}
/** Navigate a browser tab through the control server. */
async function browserNavigate(baseUrl, opts) {
  return await fetchBrowserJson(
    withBaseUrl(baseUrl, `/navigate${buildProfileQuery(opts.profile)}`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: opts.url,
        targetId: opts.targetId,
      }),
      timeoutMs: 2e4,
    },
  );
}
/** Arm a one-shot browser dialog handler. */
async function browserArmDialog(baseUrl, opts) {
  return await fetchBrowserJson(
    withBaseUrl(baseUrl, `/hooks/dialog${buildProfileQuery(opts.profile)}`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accept: opts.accept,
        promptText: opts.promptText,
        dialogId: opts.dialogId,
        targetId: opts.targetId,
        timeoutMs: opts.timeoutMs,
      }),
      timeoutMs: resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs),
    },
  );
}
/** Arm or execute a browser file chooser upload. */
async function browserArmFileChooser(baseUrl, opts) {
  return await fetchBrowserJson(
    withBaseUrl(baseUrl, `/hooks/file-chooser${buildProfileQuery(opts.profile)}`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paths: opts.paths,
        ref: opts.ref,
        inputRef: opts.inputRef,
        element: opts.element,
        targetId: opts.targetId,
        timeoutMs: opts.timeoutMs,
      }),
      timeoutMs: resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs),
    },
  );
}
/** Wait for the next managed browser download and save it under the guarded download root. */
async function browserWaitForDownload(baseUrl, opts) {
  return await postDownloadRequest(
    baseUrl,
    "/wait/download",
    {
      targetId: opts.targetId,
      path: opts.path,
      timeoutMs: opts.timeoutMs,
    },
    opts.profile,
    opts.timeoutMs,
  );
}
/** Click a snapshot ref and save its download under the guarded download root. */
async function browserDownload(baseUrl, opts) {
  return await postDownloadRequest(
    baseUrl,
    "/download",
    {
      targetId: opts.targetId,
      ref: opts.ref,
      path: opts.path,
      timeoutMs: opts.timeoutMs,
    },
    opts.profile,
    opts.timeoutMs,
  );
}
/** Execute one normalized browser action request. */
async function browserAct(baseUrl, req, opts) {
  return await fetchBrowserJson(withBaseUrl(baseUrl, `/act${buildProfileQuery(opts?.profile)}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    timeoutMs: resolveTimerTimeoutMs(opts?.timeoutMs, resolveBrowserActRequestTimeoutMs(req)),
  });
}
/** Capture a screenshot through the browser control server. */
async function browserScreenshotAction(baseUrl, opts) {
  const q = buildProfileQuery(opts.profile);
  const effectiveTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
  return await fetchBrowserJson(withBaseUrl(baseUrl, `/screenshot${q}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      targetId: opts.targetId,
      fullPage: opts.fullPage,
      ref: opts.ref,
      element: opts.element,
      type: opts.type,
      labels: opts.labels,
      timeoutMs: effectiveTimeoutMs,
    }),
    timeoutMs: effectiveTimeoutMs,
  });
}
//#endregion
//#region extensions/browser/src/browser/client-actions-observe.ts
function buildQuerySuffix(params) {
  const query = new URLSearchParams();
  for (const [key, value] of params) {
    if (typeof value === "boolean") {
      query.set(key, String(value));
      continue;
    }
    if (typeof value === "string" && value.length > 0) query.set(key, value);
  }
  const encoded = query.toString();
  return encoded.length > 0 ? `?${encoded}` : "";
}
/** Read browser console messages for a tab. */
async function browserConsoleMessages(baseUrl, opts = {}) {
  return await fetchBrowserJson(
    withBaseUrl(
      baseUrl,
      `/console${buildQuerySuffix([
        ["level", opts.level],
        ["targetId", opts.targetId],
        ["profile", opts.profile],
      ])}`,
    ),
    { timeoutMs: 2e4 },
  );
}
/** Save the current page as PDF through browser control. */
async function browserPdfSave(baseUrl, opts = {}) {
  return await fetchBrowserJson(withBaseUrl(baseUrl, `/pdf${buildProfileQuery(opts.profile)}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId: opts.targetId }),
    timeoutMs: 2e4,
  });
}
//#endregion
//#region extensions/browser/src/browser/proxy-files.ts
/**
 * Browser proxy file helpers.
 *
 * Persists files returned by node-hosted browser proxy calls and rewrites
 * proxied result paths to local saved media paths.
 */
/** Persist proxy-returned files and return a remote-path to local-path map. */
async function persistBrowserProxyFiles(files) {
  if (!files || files.length === 0) return /* @__PURE__ */ new Map();
  assertBrowserProxyFileCountWithinLimit(files.length);
  const decoded = [];
  let totalBytes = 0;
  for (const file of files) {
    const buffer = Buffer.from(file.base64, "base64");
    totalBytes += buffer.byteLength;
    assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes);
    decoded.push({
      file,
      buffer,
    });
  }
  const mapping = /* @__PURE__ */ new Map();
  for (const { file, buffer } of decoded) {
    const saved = await saveMediaBuffer(
      buffer,
      file.mimeType,
      "browser",
      BROWSER_PROXY_MAX_FILE_BYTES,
    );
    mapping.set(file.path, saved.path);
  }
  return mapping;
}
/** Rewrite every supported result path that points at a persisted proxy file. */
function applyBrowserProxyPaths(result, mapping) {
  visitBrowserProxyFilePaths(result, (filePath) => mapping.get(filePath));
}
//#endregion
//#region extensions/browser/src/node-host/invoke-browser.ts
/**
 * Node-host browser.proxy command implementation for delegated Browser control
 * requests.
 */
const DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 2e4;
const BROWSER_PROXY_STATUS_TIMEOUT_MS = 750;
const BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES = 24 * 1024 * 1024;
function normalizeProfileAllowlist(raw) {
  return Array.isArray(raw) ? normalizeStringEntries(raw) : [];
}
function resolveBrowserProxyConfig() {
  const proxy = loadBrowserConfigForRuntimeRefresh().nodeHost?.browserProxy;
  const allowProfiles = normalizeProfileAllowlist(proxy?.allowProfiles);
  return {
    enabled: proxy?.enabled !== false,
    allowProfiles,
  };
}
let browserControlReady = null;
async function ensureBrowserControlService() {
  if (browserControlReady) return browserControlReady;
  browserControlReady = (async () => {
    const cfg = loadBrowserConfigForRuntimeRefresh();
    if (!resolveBrowserConfig(cfg.browser, cfg).enabled)
      throw new Error("browser control disabled");
    if (!(await startBrowserControlServiceFromConfig()))
      throw new Error("browser control disabled");
  })();
  return browserControlReady;
}
function isProfileAllowed(params) {
  const { allowProfiles, profile } = params;
  if (!allowProfiles.length) return true;
  if (!profile) return false;
  return allowProfiles.includes(profile.trim());
}
function collectBrowserProxyPaths(payload) {
  const paths = /* @__PURE__ */ new Set();
  visitBrowserProxyFilePaths(payload, (filePath) => {
    paths.add(filePath.trim());
    assertBrowserProxyFileCountWithinLimit(paths.size);
  });
  return [...paths];
}
async function readBrowserProxyFiles(filePaths) {
  const files = [];
  let totalBytes = 0;
  for (const filePath of filePaths)
    try {
      const stat = await fs.stat(filePath).catch(() => null);
      if (!stat || !stat.isFile()) throw new Error("file not found");
      assertBrowserProxyFileBytesWithinLimits(stat.size, totalBytes + stat.size);
      const buffer = await fs.readFile(filePath);
      assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
      totalBytes += buffer.byteLength;
      const mimeType = await detectMime({
        buffer,
        filePath,
      });
      files.push({
        path: filePath,
        base64: buffer.toString("base64"),
        mimeType,
      });
    } catch (err) {
      throw new Error(`browser proxy file read failed for ${filePath}: ${String(err)}`, {
        cause: err,
      });
    }
  return files;
}
function decodeParams(raw) {
  if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
  return JSON.parse(raw);
}
function resolveBrowserProxyTimeout(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, DEFAULT_BROWSER_PROXY_TIMEOUT_MS);
}
function isBrowserProxyTimeoutError(err) {
  return String(err).includes("browser proxy request timed out");
}
function isWsBackedBrowserProxyPath(path) {
  return (
    path === "/act" ||
    path === "/download" ||
    path === "/navigate" ||
    path === "/pdf" ||
    path === "/screenshot" ||
    path === "/snapshot" ||
    path === "/wait/download"
  );
}
async function readBrowserProxyStatus(params) {
  const query = params.profile ? { profile: params.profile } : {};
  try {
    const response = await withTimeout(
      (signal) =>
        params.dispatcher.dispatch({
          method: "GET",
          path: "/",
          query,
          signal,
        }),
      BROWSER_PROXY_STATUS_TIMEOUT_MS,
      "browser proxy status",
    );
    if (response.status >= 400 || !response.body || typeof response.body !== "object") return null;
    const body = response.body;
    return {
      running: body.running,
      transport: body.transport,
      cdpHttp: body.cdpHttp,
      cdpReady: body.cdpReady,
      cdpUrl: body.cdpUrl,
    };
  } catch {
    return null;
  }
}
function formatBrowserProxyTimeoutMessage(params) {
  const parts = [
    `browser proxy timed out for ${params.method} ${params.path} after ${params.timeoutMs}ms`,
    params.wsBacked ? "ws-backed browser action" : "browser action",
  ];
  if (params.profile) parts.push(`profile=${params.profile}`);
  if (params.status) {
    const statusParts = [
      `running=${String(params.status.running)}`,
      `cdpHttp=${String(params.status.cdpHttp)}`,
      `cdpReady=${String(params.status.cdpReady)}`,
    ];
    if (typeof params.status.transport === "string" && params.status.transport.trim())
      statusParts.push(`transport=${params.status.transport}`);
    if (typeof params.status.cdpUrl === "string" && params.status.cdpUrl.trim())
      statusParts.push(`cdpUrl=${redactCdpUrl(params.status.cdpUrl)}`);
    parts.push(`status(${statusParts.join(", ")})`);
  }
  return parts.join("; ");
}
/** Executes a serialized browser.proxy command and returns a serialized result payload. */
async function runBrowserProxyCommand(paramsJSON) {
  const params = decodeParams(paramsJSON);
  const pathValue = typeof params.path === "string" ? params.path.trim() : "";
  if (!pathValue) throw new Error("INVALID_REQUEST: path required");
  const proxyConfig = resolveBrowserProxyConfig();
  if (!proxyConfig.enabled) throw new Error("UNAVAILABLE: node browser proxy disabled");
  await ensureBrowserControlService();
  const cfg = loadBrowserConfigForRuntimeRefresh();
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  const method = typeof params.method === "string" ? params.method.toUpperCase() : "GET";
  const path = normalizeBrowserRequestPath(pathValue);
  const body = params.body;
  const requestedProfile =
    resolveRequestedBrowserProfile({
      query: params.query,
      body,
      profile: params.profile,
    }) ?? "";
  const allowedProfiles = proxyConfig.allowProfiles;
  if (isPersistentBrowserProfileMutation(method, path))
    throw new Error("INVALID_REQUEST: browser.proxy cannot mutate persistent browser profiles");
  if (isBrowserHostLocalRoute(method, path))
    throw new Error("INVALID_REQUEST: browser.proxy cannot run host-local browser routes");
  if (allowedProfiles.length > 0) {
    if (path !== "/profiles") {
      if (
        !isProfileAllowed({
          allowProfiles: allowedProfiles,
          profile: requestedProfile || resolved.defaultProfile,
        })
      )
        throw new Error("INVALID_REQUEST: browser profile not allowed");
    } else if (requestedProfile) {
      if (
        !isProfileAllowed({
          allowProfiles: allowedProfiles,
          profile: requestedProfile,
        })
      )
        throw new Error("INVALID_REQUEST: browser profile not allowed");
    }
  }
  const timeoutMs = resolveBrowserProxyTimeout(params.timeoutMs);
  const query = {};
  const rawQuery = params.query ?? {};
  for (const [key, value] of Object.entries(rawQuery)) {
    if (value === void 0 || value === null) continue;
    query[key] = typeof value === "string" ? value : String(value);
  }
  if (requestedProfile) query.profile = requestedProfile;
  const dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
  let response;
  try {
    response = await withTimeout(
      (signal) =>
        dispatcher.dispatch({
          method: method === "DELETE" ? "DELETE" : method === "POST" ? "POST" : "GET",
          path,
          query,
          body,
          signal,
        }),
      timeoutMs,
      "browser proxy request",
    );
  } catch (err) {
    if (!isBrowserProxyTimeoutError(err)) throw err;
    const profileForStatus = requestedProfile || resolved.defaultProfile;
    const status = await readBrowserProxyStatus({
      dispatcher,
      profile: path === "/profiles" ? void 0 : profileForStatus,
    });
    throw new Error(
      formatBrowserProxyTimeoutMessage({
        method,
        path,
        profile: path === "/profiles" ? void 0 : profileForStatus || void 0,
        timeoutMs,
        wsBacked: isWsBackedBrowserProxyPath(path),
        status,
      }),
      { cause: err },
    );
  }
  if (response.status >= 400) {
    if (params.errorEnvelope === "browser-v1")
      return JSON.stringify(createBrowserProxyFailure(response.status, response.body));
    const detail =
      response.body && typeof response.body === "object" && "error" in response.body
        ? String(response.body.error).trim()
        : "";
    throw new Error(detail ? `${response.status}: ${detail}` : `HTTP ${response.status}`);
  }
  const result = response.body;
  if (allowedProfiles.length > 0 && path === "/profiles") {
    const obj = typeof result === "object" && result !== null ? result : {};
    obj.profiles = (Array.isArray(obj.profiles) ? obj.profiles : []).filter((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const name = entry.name;
      return typeof name === "string" && allowedProfiles.includes(name);
    });
  }
  const paths = collectBrowserProxyPaths(result);
  const files = paths.length > 0 ? await readBrowserProxyFiles(paths) : void 0;
  const serialized = JSON.stringify(
    files
      ? {
          result,
          files,
        }
      : { result },
  );
  if (Buffer.byteLength(JSON.stringify(serialized)) > BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES)
    throw new Error("browser proxy payload exceeds 24 MiB encoded limit");
  return serialized;
}
//#endregion
export {
  browserPdfSave as a,
  browserArmFileChooser as c,
  browserScreenshotAction as d,
  browserWaitForDownload as f,
  browserConsoleMessages as i,
  browserDownload as l,
  parseBrowserProxyFailure as m,
  applyBrowserProxyPaths as n,
  browserAct as o,
  BROWSER_PROXY_ERROR_ENVELOPE as p,
  persistBrowserProxyFiles as r,
  browserArmDialog as s,
  runBrowserProxyCommand as t,
  browserNavigate as u,
};
