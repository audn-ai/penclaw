import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import {
  a as normalizeActBoundedNonNegativeMs,
  n as ACT_MAX_VIEWPORT_DIMENSION,
  r as ACT_MAX_WAIT_TIME_MS,
  t as ACT_MAX_CLICK_DELAY_MS,
} from "./act-policy-DJo1OgjZ.js";
import { n as redactCdpUrl, t as parseBrowserHttpUrl } from "./browser-config-BYZ1IWa3.js";
import {
  A as toBrowserErrorResponse,
  C as BrowserProfileUnavailableError,
  D as BrowserTargetAmbiguousError,
  E as BrowserTabNotFoundError,
  O as BrowserValidationError,
  S as BrowserProfileNotFoundError,
  b as BrowserConflictError,
  d as redactCdpErrorText,
  h as normalizeBrowserTimerDelayMs,
  m as withCdpSocket,
  n as assertCdpEndpointAllowed,
  x as BrowserError,
} from "./cdp.helpers-ChuUODxP.js";
import {
  A as assertBrowserNavigationResultAllowed,
  E as STRUCTURAL_ROLES,
  N as withBrowserNavigationPolicy,
  O as assertBrowserNavigationAllowed,
  P as resolveBrowserNavigationProxyMode,
  S as finalizeRoleSnapshot,
  T as INTERACTIVE_ROLES,
  l as ensureOutputDirectory,
  m as captureScreenshot,
  n as getChromeWebSocketUrl,
  s as resolveOpenClawUserDataDir,
  v as snapshotAria,
  w as CONTENT_ROLES,
  y as snapshotRoleViaCdp,
} from "./chrome-C-Qf8Isl.js";
import {
  D as takeChromeMcpSnapshot,
  E as takeChromeMcpScreenshot,
  O as uploadChromeMcpFile,
  S as resizeChromeMcpPage,
  _ as navigateChromeMcpPage,
  b as pressChromeMcpKey,
  c as dragChromeMcpElement,
  d as fillChromeMcpElement,
  f as fillChromeMcpForm,
  h as hoverChromeMcpElement,
  k as withChromeMcpDocument,
  m as getChromeMcpPid,
  n as clickChromeMcpCoords,
  r as clickChromeMcpElement,
  t as ChromeMcpDocumentUnavailableError,
  u as evaluateChromeMcpScript,
} from "./chrome-mcp-BUn6ZfOU.js";
import { r as resolveBrowserExecutableForPlatform } from "./chrome.executables-3W0Qoqc0.js";
import {
  a as resolveProfile,
  i as resolveManagedBrowserHeadlessMode,
  l as resolveExistingUploadPaths,
  n as getOwnBrowserProfile,
  o as DEFAULT_DOWNLOAD_DIR,
  r as resolveBrowserConfig,
  s as DEFAULT_TRACE_DIR,
} from "./config-CzdiqFrD.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  a as isValidProfileName,
  i as setDefaultBrowserProfile,
  n as deleteBrowserProfileConfig,
  t as createBrowserProfileConfig,
} from "./config-mutations-_39pW8np.js";
import {
  l as DEFAULT_BROWSER_SCREENSHOT_TIMEOUT_MS,
  n as DEFAULT_AI_SNAPSHOT_MAX_CHARS,
  t as DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS,
} from "./constants-C2_ZjRRD.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { u as pathScope } from "./fs-safe-RNq3oO57.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  _ as resizeToJpeg,
  f as isImageProcessorUnavailableError,
  o as buildImageResizeSideGrid,
  r as IMAGE_REDUCE_QUALITY_STEPS,
  u as getImageMetadata,
} from "./media-services-Czws84B5.js";
import {
  _ as parseStrictFiniteNumber,
  b as parseStrictPositiveInteger,
  d as clampPositiveTimerTimeoutMs,
  v as parseStrictInteger,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { n as normalizeString } from "./record-shared-BNyRYPIG.js";
import "./errors-CZhWrgPb.js";
import "./config-B4sqH_Om.js";
import "./sdk-setup-tools-D5_dW0Tr.js";
import { s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import {
  i as resolveTargetIdFromTabs,
  o as resolveCdpControlPolicy,
  r as withProfileContextOperation,
} from "./server-context-CkNNtaOz.js";
import {
  _ as resolveDefaultSnapshotFormat,
  a as getOrCreateProfileRuntime,
  g as getBrowserProfileCapabilities,
  h as getPwAiModule$1,
  l as isProfileRestartRequiredError,
  o as getProfileLifecycle,
  r as beginProfileTransition,
  v as shouldUsePlaywrightForAriaSnapshot,
  y as shouldUsePlaywrightForScreenshot,
} from "./server-context.lifecycle-CPismpkV.js";
import {
  a as scaleAnnotations,
  l as matchBrowserUrlPattern,
  s as normalizeBrowserFormField,
  t as appendSnapshotUrls,
  u as normalizeBrowserEvaluateFunctionSource,
} from "./snapshot-urls-UoxUrSeb.js";
import { a as ensureMediaDir, u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString$1,
  p as readStringValue,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  a as resolveSuggestedImportTarget,
  i as recordSystemProfileImport,
  n as dismissSystemProfileImportPrompt,
  r as readSystemProfileImportState,
} from "./system-profile-import-state-DFy4mHBX.js";
import {
  n as listSystemProfiles,
  t as importSystemProfileCookies,
} from "./system-profiles-Bhl6WpeJ.js";
import { t as movePathToTrash } from "./trash-DGM0lK0C.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/browser/src/browser/screenshot.ts
/**
 * Browser screenshot normalization helpers that bound screenshots for media
 * transport and model input.
 */
const DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE = 2e3;
const DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;
/** Downscales/re-encodes screenshots to fit Browser plugin byte and dimension caps. */
async function normalizeBrowserScreenshot(buffer, opts) {
  const maxSide = Math.max(1, Math.round(opts?.maxSide ?? 2e3));
  const maxBytes = Math.max(1, Math.round(opts?.maxBytes ?? 5242880));
  const meta = await getImageMetadata(buffer);
  const width = meta?.width ?? 0;
  const height = meta?.height ?? 0;
  const maxDim = Math.max(width, height);
  if (buffer.byteLength <= maxBytes && (maxDim === 0 || (width <= maxSide && height <= maxSide)))
    return { buffer };
  const sideGrid = buildImageResizeSideGrid(
    maxSide,
    maxDim > 0 ? Math.min(maxSide, maxDim) : maxSide,
  );
  let smallest = null;
  let processorUnavailableError;
  for (const side of sideGrid) {
    for (const quality of IMAGE_REDUCE_QUALITY_STEPS) {
      let out;
      try {
        out = await resizeToJpeg({
          buffer,
          maxSide: side,
          quality,
          withoutEnlargement: true,
        });
      } catch (err) {
        if (isImageProcessorUnavailableError(err)) {
          processorUnavailableError = err;
          break;
        }
        throw err;
      }
      if (!smallest || out.byteLength < smallest.size)
        smallest = {
          buffer: out,
          size: out.byteLength,
        };
      if (out.byteLength <= maxBytes)
        return {
          buffer: out,
          contentType: "image/jpeg",
        };
    }
    if (processorUnavailableError) break;
  }
  if (processorUnavailableError)
    throw toLintErrorObject$1(processorUnavailableError, "Non-Error thrown");
  const best = smallest?.buffer ?? buffer;
  throw new Error(
    `Browser screenshot could not be reduced below ${(maxBytes / (1024 * 1024)).toFixed(0)}MB (got ${(best.byteLength / (1024 * 1024)).toFixed(2)}MB)`,
  );
}
function toLintErrorObject$1(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
//#region extensions/browser/src/browser/system-profile-domains.ts
/** Shared fail-closed parser for the system-profile cookie import domain filter. */
/**
 * Normalize the optional `domains` filter for system-profile cookie import.
 *
 * Import copies real browser session cookies, so a caller that meant to scope
 * the import must never be silently widened to "import everything". A present
 * but malformed or empty filter throws; an absent filter (undefined/null)
 * returns undefined, meaning no domain restriction.
 */
function parseSystemProfileDomains(raw) {
  if (raw === void 0 || raw === null) return;
  if (!Array.isArray(raw)) throw new Error("domains must be an array of domain strings");
  const cleaned = raw
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  if (cleaned.length === 0) throw new Error("domains must include at least one non-empty domain");
  return cleaned;
}
//#endregion
//#region extensions/browser/src/browser/routes/utils.ts
/**
 * Browser route utility functions.
 *
 * Profile lookup, JSON errors, and route value coercion shared across browser
 * control endpoints.
 */
function normalizeOptionalString(value) {
  return value.trim() || void 0;
}
/**
 * Extract profile name from query string or body and get profile context.
 * Query string takes precedence over body for consistency with GET routes.
 */
/** Resolve the profile context requested by query/profile parameters. */
function getProfileContext(req, ctx) {
  let profileName;
  if (typeof req.query.profile === "string")
    profileName = normalizeOptionalString(req.query.profile);
  if (!profileName && req.body && typeof req.body === "object") {
    const body = req.body;
    if (typeof body.profile === "string") profileName = normalizeOptionalString(body.profile);
  }
  try {
    return ctx.forProfile(profileName);
  } catch (err) {
    const mapped = ctx.mapTabError(err);
    return mapped
      ? {
          error: mapped.message,
          status: mapped.status,
        }
      : {
          error: String(err),
          status: 404,
        };
  }
}
/** Run one profile-scoped route transaction, restarting an unhealthy owned browser once. */
async function runProfileRouteOperation(params) {
  for (let attempt = 0; attempt < 2; attempt += 1)
    try {
      return await withProfileContextOperation(params.profileCtx, params.signal, params.run);
    } catch (err) {
      if (!isProfileRestartRequiredError(err)) throw err;
      if (attempt !== 0)
        throw new BrowserProfileUnavailableError(
          `Browser profile "${params.profileCtx.profile.name}" could not stabilize after restart.`,
        );
      try {
        await params.profileCtx.ensureBrowserAvailable({ signal: params.signal });
      } catch (restartErr) {
        if (isProfileRestartRequiredError(restartErr))
          throw new BrowserProfileUnavailableError(
            `Browser profile "${params.profileCtx.profile.name}" could not restart.`,
          );
        throw restartErr;
      }
    }
  throw new Error("browser profile could not stabilize");
}
/** Send a simple JSON error response. */
function jsonError(res, status, message) {
  res.status(status).json({ error: message });
}
/** Send a mapped browser-domain error while preserving validated metadata. */
function jsonBrowserError(res, error) {
  const body =
    "reason" in error
      ? {
          error: error.message,
          reason: error.reason,
          details: error.details,
        }
      : { error: error.message };
  res.status(error.status).json(body);
}
/** Coerce route values to strings while treating nullish values as empty. */
function toStringOrEmpty(value) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return normalizeOptionalString(String(value)) ?? "";
  return "";
}
/** Return a canonical HTTP origin, or null when the route value is absent or invalid. */
function readHttpOrigin(value) {
  const raw = toStringOrEmpty(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}
/** Coerce route boolean values from booleans or common string forms. */
function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string" && typeof value !== "number") return;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
}
/** Coerce a route value to a string array when every entry is a string. */
function toStringArray(value) {
  if (!Array.isArray(value)) return;
  const strings = value.map((v) => toStringOrEmpty(v)).filter(Boolean);
  return strings.length ? strings : void 0;
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.shared.ts
/**
 * Shared browser route helpers.
 *
 * Centralizes body/query parsing, profile resolution, error mapping, Playwright
 * availability checks, and tab-context guards for route modules.
 */
const SELECTOR_UNSUPPORTED_MESSAGE = [
  "Error: 'selector' is not supported. Use 'ref' from snapshot instead.",
  "",
  "Example workflow:",
  "1. snapshot action to get page state with refs",
  '2. act with ref: "e123" to interact with element',
  "",
  "This is more reliable for modern SPAs.",
].join("\n");
/** Return a safe object body for routes that accept JSON payloads. */
function readBody(req) {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return {};
  return body;
}
/** Read an optional targetId from a request body. */
function resolveTargetIdFromBody(body) {
  return (normalizeOptionalString$1(body.targetId) ?? "") || void 0;
}
/** Read an optional targetId from a query object. */
function resolveTargetIdFromQuery(query) {
  return (normalizeOptionalString$1(query.targetId) ?? "") || void 0;
}
/** Map route-level browser errors to HTTP JSON responses. */
function handleRouteError(ctx, res, err) {
  if (isProfileRestartRequiredError(err)) throw err;
  const mapped = ctx.mapTabError(err);
  if (mapped) return jsonBrowserError(res, mapped);
  const browserMapped = toBrowserErrorResponse(err);
  if (browserMapped) return jsonBrowserError(res, browserMapped);
  jsonError(res, 500, redactCdpErrorText(String(err)));
}
/** Resolve the requested browser profile and respond with JSON on failure. */
function resolveProfileContext(req, res, ctx) {
  const profileCtx = getProfileContext(req, ctx);
  if ("error" in profileCtx) {
    jsonError(res, profileCtx.status, profileCtx.error);
    return null;
  }
  return profileCtx;
}
/** Build navigation guard policy for a profile and current resolved config. */
function browserNavigationPolicyForProfile(ctx, profileCtx) {
  return withBrowserNavigationPolicy(ctx.state().resolved.ssrfPolicy, {
    browserProxyMode: resolveBrowserNavigationProxyMode({
      resolved: ctx.state().resolved,
      profile: profileCtx.profile,
    }),
  });
}
/** Load the optional Playwright bridge module in soft-fail mode. */
async function getPwAiModule() {
  return await getPwAiModule$1({ mode: "soft" });
}
/** Require Playwright support for a route feature, returning a 501 when absent. */
async function requirePwAi(res, feature) {
  const mod = await getPwAiModule();
  if (mod) return mod;
  jsonError(
    res,
    501,
    [
      `Playwright is not available in this gateway build; '${feature}' is unsupported.`,
      "Reinstall or update OpenClaw so the core browser runtime dependency is present, then restart the gateway. In Docker, also install Chromium with the bundled playwright-core CLI.",
      "Docs: /tools/browser-control#playwright-requirement",
    ].join("\n"),
  );
  return null;
}
/** Resolve profile and tab context, optionally enforcing current URL policy. */
async function withRouteTabContext(params) {
  const profileCtx = params.profileCtx ?? resolveProfileContext(params.req, params.res, params.ctx);
  if (!profileCtx) return;
  try {
    return await runProfileRouteOperation({
      profileCtx,
      signal: params.req.signal,
      run: async (signal) => {
        const tab = await profileCtx.ensureTabAvailable(params.targetId, {
          allowPlaywrightFallback: true,
          signal,
          timeoutMs: params.ctx.state().resolved.actionTimeoutMs,
        });
        if (params.enforceCurrentUrlAllowed)
          await assertBrowserNavigationResultAllowed({
            url: tab.url,
            ...browserNavigationPolicyForProfile(params.ctx, profileCtx),
          });
        return await params.run({
          profileCtx,
          tab,
          cdpUrl: profileCtx.profile.cdpUrl,
          signal,
          resolveTabUrl: (fallbackUrl) =>
            resolveSafeRouteTabUrl({
              ctx: params.ctx,
              profileCtx,
              targetId: tab.targetId,
              fallbackUrl,
              signal,
              timeoutMs: params.ctx.state().resolved.actionTimeoutMs,
            }),
        });
      },
    });
  } catch (err) {
    if (isProfileRestartRequiredError(err)) throw err;
    handleRouteError(params.ctx, params.res, err);
    return;
  }
}
/**
 * Response-only URL redaction. This swallows policy failures and must not be used as
 * an execution gate; use enforceCurrentUrlAllowed on the route helper instead.
 */
async function resolveSafeRouteTabUrl(params) {
  let tabs;
  try {
    tabs = await params.profileCtx.listTabs({
      signal: params.signal,
      timeoutMs: params.timeoutMs,
    });
  } catch {
    params.signal?.throwIfAborted();
    tabs = [];
  }
  const candidateUrl =
    tabs.find((tab) => tab.targetId === params.targetId)?.url ?? params.fallbackUrl;
  if (!candidateUrl) return;
  try {
    await assertBrowserNavigationResultAllowed({
      url: candidateUrl,
      ...browserNavigationPolicyForProfile(params.ctx, params.profileCtx),
    });
    return candidateUrl;
  } catch {
    return;
  }
}
/** Resolve profile, tab, and Playwright context for Playwright-only routes. */
async function withPlaywrightRouteContext(params) {
  return await withRouteTabContext({
    req: params.req,
    res: params.res,
    ctx: params.ctx,
    ...(params.profileCtx ? { profileCtx: params.profileCtx } : {}),
    targetId: params.targetId,
    enforceCurrentUrlAllowed: params.enforceCurrentUrlAllowed,
    run: async ({ profileCtx, tab, cdpUrl, signal, resolveTabUrl }) => {
      const pw = await requirePwAi(params.res, params.feature);
      if (!pw) return;
      return await params.run({
        profileCtx,
        tab,
        cdpUrl,
        signal,
        resolveTabUrl,
        pw,
      });
    },
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/existing-session-limits.ts
/**
 * Existing-session browser capability-limit messages.
 *
 * Centralizes unsupported-operation text so route responses and tests stay
 * stable while Chrome MCP support grows incrementally.
 */
/** User-facing messages for existing-session route limitations. */
const EXISTING_SESSION_LIMITS = {
  act: {
    clickSelector: "existing-session click does not support selector targeting yet; use ref.",
    clickButtonOrModifiers:
      "existing-session click currently supports left-click only (no button overrides/modifiers).",
    typeSelector: "existing-session type does not support selector targeting yet; use ref.",
    typeSlowly: "existing-session type does not support slowly=true; use fill/press instead.",
    typeTimeout: "existing-session type does not support timeoutMs overrides.",
    pressDelay: "existing-session press does not support delayMs.",
    hoverSelector: "existing-session hover does not support selector targeting yet; use ref.",
    hoverTimeout: "existing-session hover does not support timeoutMs overrides.",
    scrollSelector:
      "existing-session scrollIntoView does not support selector targeting yet; use ref.",
    scrollTimeout: "existing-session scrollIntoView does not support timeoutMs overrides.",
    dragSelector:
      "existing-session drag does not support selector targeting yet; use startRef/endRef.",
    dragTimeout: "existing-session drag does not support timeoutMs overrides.",
    selectSelector: "existing-session select does not support selector targeting yet; use ref.",
    selectSingleValue: "existing-session select currently supports a single value only.",
    selectTimeout: "existing-session select does not support timeoutMs overrides.",
    fillTimeout: "existing-session fill does not support timeoutMs overrides.",
    waitNetworkIdle: "existing-session wait does not support loadState=networkidle yet.",
    batch: "existing-session batch is not supported yet; send actions individually.",
  },
  hooks: {
    uploadElement:
      "existing-session file uploads do not support element selectors; use ref/inputRef.",
    uploadSingleFile: "existing-session file uploads currently support one file at a time.",
    uploadRefRequired: "existing-session file uploads require ref or inputRef.",
    dialogId: "existing-session dialog handling does not support dialogId.",
    dialogTimeout: "existing-session dialog handling does not support timeoutMs.",
  },
  download: {
    waitUnsupported: "download waiting is not supported for existing-session profiles yet.",
    downloadUnsupported: "downloads are not supported for existing-session profiles yet.",
  },
  snapshot: {
    pdfUnsupported:
      "pdf is not supported for existing-session profiles yet; use screenshot/snapshot instead.",
    screenshotElement:
      "element screenshots are not supported for existing-session profiles; use ref from snapshot.",
    snapshotSelector:
      "selector/frame snapshots are not supported for existing-session profiles; snapshot the whole page and use refs.",
  },
  responseBody: "response body is not supported for existing-session profiles yet.",
};
//#endregion
//#region extensions/browser/src/browser/routes/output-paths.ts
/**
 * Browser route output-path helpers.
 *
 * Validates writable output paths against a route-specific root before any
 * screenshot, trace, or download route writes to disk.
 */
/** Ensure a browser output root exists before resolving child write paths. */
async function ensureOutputRootDir(rootDir) {
  await ensureOutputDirectory(rootDir);
}
/** Resolve a writable output path or send a 400 JSON response on scope errors. */
async function resolveWritableOutputPathOrRespond(params) {
  if (params.ensureRootDir) await ensureOutputRootDir(params.rootDir);
  const pathResult = await pathScope(params.rootDir, { label: params.scopeLabel }).writable(
    params.requestedPath,
    { defaultName: params.defaultFileName },
  );
  if (!pathResult.ok) {
    params.res.status(400).json({ error: pathResult.error });
    return null;
  }
  return pathResult.path;
}
//#endregion
//#region extensions/browser/src/browser/routes/route-numeric.ts
/**
 * Strict numeric parsers for browser route input.
 *
 * Converts query/body values into finite integer/timeout numbers while
 * preserving route-specific error messages for JSON responses.
 */
function hasRouteInputValue(value) {
  return value != null;
}
/** Read an optional finite number route field. */
function readRouteFiniteNumber(value, fieldName) {
  const parsed = parseStrictFiniteNumber(value);
  if (parsed === void 0 && hasRouteInputValue(value))
    throw new Error(`${fieldName} must be a finite number.`);
  return parsed;
}
/** Read an optional finite number, treating blank strings as absent. */
function readOptionalRouteFiniteNumber(value, fieldName) {
  if (typeof value === "string" && value.trim() === "") return;
  return readRouteFiniteNumber(value, fieldName);
}
/** Read an optional integer route field. */
function readRouteInteger(value, fieldName, options) {
  const parsed = parseStrictInteger(value);
  if (parsed === void 0 && hasRouteInputValue(value))
    throw new Error(options?.invalidMessage ?? `${fieldName} must be an integer.`);
  return parsed;
}
/** Read an optional positive integer route field. */
function readRoutePositiveInteger(value, fieldName, options) {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0 && hasRouteInputValue(value))
    throw new Error(options?.invalidMessage ?? `${fieldName} must be a positive integer.`);
  return parsed;
}
/** Read and normalize an optional positive timeout value. */
function readRouteTimerTimeoutMs(value, fieldName = "timeoutMs", opts) {
  const parsed = readRoutePositiveInteger(value, fieldName, opts);
  return parsed === void 0 ? void 0 : normalizeBrowserTimerDelayMs(parsed, opts);
}
/** Read an optional non-negative integer route field. */
function readRouteNonNegativeInteger(value, fieldName, options) {
  const parsed = parseStrictNonNegativeInteger(value);
  if (parsed === void 0 && hasRouteInputValue(value))
    throw new Error(options?.invalidMessage ?? `${fieldName} must be a non-negative integer.`);
  return parsed;
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.download.ts
/**
 * Browser agent action routes for download handling.
 *
 * Registers endpoints that wait for a pending download or trigger a referenced
 * page download while keeping files scoped to the configured downloads root.
 */
function buildDownloadRequestBase(cdpUrl, targetId, timeoutMs) {
  return {
    cdpUrl,
    targetId,
    timeoutMs: timeoutMs ?? void 0,
  };
}
/** Register download action endpoints on the browser control server. */
function registerBrowserAgentActDownloadRoutes(app, ctx) {
  app.post("/wait/download", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const out = toStringOrEmpty(body.path) || "";
    let timeoutMs;
    try {
      timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, cdpUrl, tab }) => {
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp)
          return jsonError(res, 501, EXISTING_SESSION_LIMITS.download.waitUnsupported);
        const pw = await requirePwAi(res, "wait for download");
        if (!pw) return;
        await ensureOutputRootDir(DEFAULT_DOWNLOAD_DIR);
        let downloadPath;
        if (out.trim()) {
          const resolvedDownloadPath = await resolveWritableOutputPathOrRespond({
            res,
            rootDir: DEFAULT_DOWNLOAD_DIR,
            requestedPath: out,
            scopeLabel: "downloads directory",
          });
          if (!resolvedDownloadPath) return;
          downloadPath = resolvedDownloadPath;
        }
        const requestBase = buildDownloadRequestBase(cdpUrl, tab.targetId, timeoutMs);
        const result = await pw.waitForDownloadViaPlaywright({
          ...requestBase,
          path: downloadPath,
          rootDir: DEFAULT_DOWNLOAD_DIR,
        });
        res.json({
          ok: true,
          targetId: tab.targetId,
          download: result,
        });
      },
    });
  });
  app.post("/download", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const ref = toStringOrEmpty(body.ref);
    const out = toStringOrEmpty(body.path);
    let timeoutMs;
    try {
      timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    if (!ref) return jsonError(res, 400, "ref is required");
    if (!out) return jsonError(res, 400, "path is required");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, cdpUrl, tab }) => {
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp)
          return jsonError(res, 501, EXISTING_SESSION_LIMITS.download.downloadUnsupported);
        const pw = await requirePwAi(res, "download");
        if (!pw) return;
        await ensureOutputRootDir(DEFAULT_DOWNLOAD_DIR);
        const downloadPath = await resolveWritableOutputPathOrRespond({
          res,
          rootDir: DEFAULT_DOWNLOAD_DIR,
          requestedPath: out,
          scopeLabel: "downloads directory",
        });
        if (!downloadPath) return;
        const requestBase = buildDownloadRequestBase(cdpUrl, tab.targetId, timeoutMs);
        const result = await pw.downloadViaPlaywright({
          ...requestBase,
          ref,
          path: downloadPath,
          rootDir: DEFAULT_DOWNLOAD_DIR,
        });
        res.json({
          ok: true,
          targetId: tab.targetId,
          download: result,
        });
      },
    });
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.errors.ts
/** Stable machine-readable codes returned by browser action routes. */
const ACT_ERROR_CODES = {
  kindRequired: "ACT_KIND_REQUIRED",
  invalidRequest: "ACT_INVALID_REQUEST",
  selectorUnsupported: "ACT_SELECTOR_UNSUPPORTED",
  evaluateDisabled: "ACT_EVALUATE_DISABLED",
  unsupportedForExistingSession: "ACT_EXISTING_SESSION_UNSUPPORTED",
  targetIdMismatch: "ACT_TARGET_ID_MISMATCH",
};
/** Send a browser action JSON error with a stable action error code. */
function jsonActError(res, status, code, message) {
  res.status(status).json({
    error: message,
    code,
  });
}
/** Build the config-disabled message for JavaScript evaluation actions. */
function browserEvaluateDisabledMessage(action) {
  return [
    action === "wait"
      ? "wait --fn is disabled by config (browser.evaluateEnabled=false)."
      : "act:evaluate is disabled by config (browser.evaluateEnabled=false).",
    "Docs: /gateway/configuration#browser-openclaw-managed-browser",
  ].join("\n");
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.hooks.ts
/**
 * Browser agent action hook routes.
 *
 * Handles file chooser and dialog interception for both Playwright-backed
 * OpenClaw profiles and Chrome MCP existing-session profiles.
 */
/** Register file chooser and dialog hook endpoints on the browser control server. */
function registerBrowserAgentActHookRoutes(app, ctx) {
  app.post("/hooks/file-chooser", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const ref = toStringOrEmpty(body.ref) || void 0;
    const inputRef = toStringOrEmpty(body.inputRef) || void 0;
    const element = toStringOrEmpty(body.element) || void 0;
    const paths = toStringArray(body.paths) ?? [];
    let timeoutMs;
    try {
      timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    if (!paths.length) return jsonError(res, 400, "paths are required");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, cdpUrl, tab, signal }) => {
        const resolvedResult = await resolveExistingUploadPaths({ requestedPaths: paths });
        if (!resolvedResult.ok) {
          res.status(400).json({ error: resolvedResult.error });
          return;
        }
        const resolvedPaths = resolvedResult.paths;
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
          if (element) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.uploadElement);
          if (resolvedPaths.length !== 1)
            return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.uploadSingleFile);
          const uid = inputRef || ref;
          if (!uid) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.uploadRefRequired);
          await uploadChromeMcpFile({
            profileName: profileCtx.profile.name,
            profile: profileCtx.profile,
            targetId: tab.targetId,
            uid,
            filePath: resolvedPaths[0] ?? "",
            timeoutMs: timeoutMs ?? ctx.state().resolved.actionTimeoutMs,
            signal,
          });
          return res.json({ ok: true });
        }
        const pw = await requirePwAi(res, "file chooser hook");
        if (!pw) return;
        if (inputRef || element) {
          if (ref) return jsonError(res, 400, "ref cannot be combined with inputRef/element");
          await pw.setInputFilesViaPlaywright({
            cdpUrl,
            targetId: tab.targetId,
            inputRef,
            element,
            paths: resolvedPaths,
            ssrfPolicy: ctx.state().resolved.ssrfPolicy,
          });
        } else if (ref)
          await pw.uploadViaPlaywright({
            cdpUrl,
            targetId: tab.targetId,
            paths: resolvedPaths,
            timeoutMs: timeoutMs ?? void 0,
            ssrfPolicy: ctx.state().resolved.ssrfPolicy,
            ref,
            signal,
          });
        else
          await pw.armFileUploadViaPlaywright({
            cdpUrl,
            targetId: tab.targetId,
            paths: resolvedPaths,
            timeoutMs: timeoutMs ?? void 0,
          });
        res.json({ ok: true });
      },
    });
  });
  app.post("/hooks/dialog", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const accept = toBoolean(body.accept);
    const promptText = toStringOrEmpty(body.promptText) || void 0;
    let timeoutMs;
    try {
      timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    const dialogId = toStringOrEmpty(body.dialogId) || void 0;
    if (accept === void 0) return jsonError(res, 400, "accept is required");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, cdpUrl, tab, signal }) => {
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
          if (dialogId) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.dialogId);
          if (timeoutMs) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.dialogTimeout);
          await evaluateChromeMcpScript({
            profileName: profileCtx.profile.name,
            profile: profileCtx.profile,
            targetId: tab.targetId,
            timeoutMs: ctx.state().resolved.actionTimeoutMs,
            signal,
            fn: `() => {
              const state = (window.__openclawDialogHook ??= {});
              if (!state.originals) {
                state.originals = {
                  alert: window.alert.bind(window),
                  confirm: window.confirm.bind(window),
                  prompt: window.prompt.bind(window),
                };
              }
              const originals = state.originals;
              const restore = () => {
                window.alert = originals.alert;
                window.confirm = originals.confirm;
                window.prompt = originals.prompt;
                delete window.__openclawDialogHook;
              };
              window.alert = (...args) => {
                try {
                  return undefined;
                } finally {
                  restore();
                }
              };
              window.confirm = (...args) => {
                try {
                  return ${accept ? "true" : "false"};
                } finally {
                  restore();
                }
              };
              window.prompt = (...args) => {
                try {
                  return ${accept ? JSON.stringify(promptText ?? "") : "null"};
                } finally {
                  restore();
                }
              };
              return true;
            }`,
          });
          return res.json({ ok: true });
        }
        const pw = await requirePwAi(res, "dialog hook");
        if (!pw) return;
        await pw.armDialogViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          dialogId,
          accept,
          promptText,
          timeoutMs: timeoutMs ?? void 0,
        });
        res.json({ ok: true });
      },
    });
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.shared.ts
/**
 * Shared browser action enums and parsers.
 *
 * Keeps route normalization, schema tests, and action dispatch using the same
 * action names, mouse buttons, and keyboard modifier vocabulary.
 */
const ACT_KINDS = [
  "batch",
  "click",
  "clickCoords",
  "close",
  "drag",
  "evaluate",
  "fill",
  "hover",
  "scrollIntoView",
  "press",
  "resize",
  "select",
  "type",
  "wait",
];
/** Return true when a raw value names a supported browser action kind. */
function isActKind(value) {
  if (typeof value !== "string") return false;
  return ACT_KINDS.includes(value);
}
const ALLOWED_CLICK_MODIFIERS = /* @__PURE__ */ new Set([
  "Alt",
  "Control",
  "ControlOrMeta",
  "Meta",
  "Shift",
]);
/** Parse a model/client mouse button string into the supported click button set. */
function parseClickButton(raw) {
  if (raw === "left" || raw === "right" || raw === "middle") return raw;
}
/** Parse and validate click modifier names accepted by Playwright actions. */
function parseClickModifiers(raw) {
  if (raw.filter((m) => !ALLOWED_CLICK_MODIFIERS.has(m)).length)
    return { error: "modifiers must be Alt|Control|ControlOrMeta|Meta|Shift" };
  return { modifiers: raw.length ? raw : void 0 };
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.normalize.ts
/**
 * Browser action request normalization.
 *
 * Converts loosely typed route bodies into the closed BrowserActRequest union
 * used by Playwright and Chrome MCP action executors.
 */
function normalizeActKind(raw) {
  const kind = toStringOrEmpty(raw);
  if (!isActKind(kind)) throw new Error("kind is required");
  return kind;
}
function countBatchActions(actions) {
  let count = 0;
  for (const action of actions) {
    count += 1;
    if (action.kind === "batch") count += countBatchActions(action.actions);
  }
  return count;
}
/** Keep nested action overrides inside the route-selected tab. */
function canonicalizeActTargetIds(action, tab, tabs = [tab], batched = false) {
  if (action.targetId) {
    const resolved = resolveTargetIdFromTabs(action.targetId, batched ? tabs : [tab]);
    if (!resolved.ok || resolved.targetId !== tab.targetId)
      return batched
        ? "batched action targetId must match request targetId"
        : "action targetId must match request targetId";
    action.targetId = tab.targetId;
  }
  if (action.kind === "batch")
    for (const subAction of action.actions) {
      const error = canonicalizeActTargetIds(subAction, tab, tabs, true);
      if (error) return error;
    }
  return null;
}
function normalizeFields(rawFields) {
  return (Array.isArray(rawFields) ? rawFields : [])
    .map((field) => {
      if (!field || typeof field !== "object") return null;
      return normalizeBrowserFormField(field);
    })
    .filter((field) => field !== null);
}
function normalizeBatchAction(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("batch actions must be objects");
  return normalizeActRequest(value, { source: "batch" });
}
function readActionNonNegativeInteger(body, key) {
  return readRouteNonNegativeInteger(body[key], key);
}
function readActionTimeoutMs(body) {
  return readRouteTimerTimeoutMs(body.timeoutMs);
}
function readBoundedActionDurationMs(body, key, fieldName, maxMs) {
  return normalizeActBoundedNonNegativeMs(
    readActionNonNegativeInteger(body, key),
    fieldName,
    maxMs,
  );
}
function readResizeDimension(body, key) {
  const value = readRouteInteger(body[key], key, {
    invalidMessage: "resize requires positive width and height",
  });
  if (value === void 0 && Object.hasOwn(body, key))
    throw new Error("resize requires positive width and height");
  return value;
}
/** Normalize one model/client action payload into a BrowserActRequest. */
function normalizeActRequest(body, options) {
  const source = options?.source ?? "request";
  const kind = normalizeActKind(body.kind);
  switch (kind) {
    case "click": {
      const ref = toStringOrEmpty(body.ref) || void 0;
      const selector = toStringOrEmpty(body.selector) || void 0;
      if (!ref && !selector) throw new Error("click requires ref or selector");
      const buttonRaw = toStringOrEmpty(body.button);
      const button = buttonRaw ? parseClickButton(buttonRaw) : void 0;
      if (buttonRaw && !button) throw new Error("click button must be left|right|middle");
      const parsedModifiers = parseClickModifiers(toStringArray(body.modifiers) ?? []);
      if (parsedModifiers.error) throw new Error(parsedModifiers.error);
      const doubleClick = toBoolean(body.doubleClick);
      const delayMs = readBoundedActionDurationMs(
        body,
        "delayMs",
        "click delayMs",
        ACT_MAX_CLICK_DELAY_MS,
      );
      const timeoutMs = readActionTimeoutMs(body);
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      return {
        kind,
        ...(ref ? { ref } : {}),
        ...(selector ? { selector } : {}),
        ...(targetId ? { targetId } : {}),
        ...(doubleClick !== void 0 ? { doubleClick } : {}),
        ...(button ? { button } : {}),
        ...(parsedModifiers.modifiers ? { modifiers: parsedModifiers.modifiers } : {}),
        ...(delayMs !== void 0 ? { delayMs } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "clickCoords": {
      const x = readRouteFiniteNumber(body.x, "x");
      const y = readRouteFiniteNumber(body.y, "y");
      if (x === void 0 || y === void 0 || x < 0 || y < 0)
        throw new Error("clickCoords requires non-negative x and y");
      const buttonRaw = toStringOrEmpty(body.button);
      const button = buttonRaw ? parseClickButton(buttonRaw) : void 0;
      if (buttonRaw && !button) throw new Error("clickCoords button must be left|right|middle");
      const doubleClick = toBoolean(body.doubleClick);
      const delayMs = readBoundedActionDurationMs(
        body,
        "delayMs",
        "clickCoords delayMs",
        ACT_MAX_CLICK_DELAY_MS,
      );
      const timeoutMs = readActionTimeoutMs(body);
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      return {
        kind,
        x,
        y,
        ...(targetId ? { targetId } : {}),
        ...(doubleClick !== void 0 ? { doubleClick } : {}),
        ...(button ? { button } : {}),
        ...(delayMs !== void 0 ? { delayMs } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "type": {
      const ref = toStringOrEmpty(body.ref) || void 0;
      const selector = toStringOrEmpty(body.selector) || void 0;
      const text = body.text;
      if (!ref && !selector) throw new Error("type requires ref or selector");
      if (typeof text !== "string") throw new Error("type requires text");
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const submit = toBoolean(body.submit);
      const slowly = toBoolean(body.slowly);
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        ...(ref ? { ref } : {}),
        ...(selector ? { selector } : {}),
        text,
        ...(targetId ? { targetId } : {}),
        ...(submit !== void 0 ? { submit } : {}),
        ...(slowly !== void 0 ? { slowly } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "press": {
      const key = toStringOrEmpty(body.key);
      if (!key) throw new Error("press requires key");
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const delayMs = readActionNonNegativeInteger(body, "delayMs");
      return {
        kind,
        key,
        ...(targetId ? { targetId } : {}),
        ...(delayMs !== void 0 ? { delayMs } : {}),
      };
    }
    case "hover":
    case "scrollIntoView": {
      const ref = toStringOrEmpty(body.ref) || void 0;
      const selector = toStringOrEmpty(body.selector) || void 0;
      if (!ref && !selector) throw new Error(`${kind} requires ref or selector`);
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        ...(ref ? { ref } : {}),
        ...(selector ? { selector } : {}),
        ...(targetId ? { targetId } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "drag": {
      const startRef = toStringOrEmpty(body.startRef) || void 0;
      const startSelector = toStringOrEmpty(body.startSelector) || void 0;
      const endRef = toStringOrEmpty(body.endRef) || void 0;
      const endSelector = toStringOrEmpty(body.endSelector) || void 0;
      if (!startRef && !startSelector) throw new Error("drag requires startRef or startSelector");
      if (!endRef && !endSelector) throw new Error("drag requires endRef or endSelector");
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        ...(startRef ? { startRef } : {}),
        ...(startSelector ? { startSelector } : {}),
        ...(endRef ? { endRef } : {}),
        ...(endSelector ? { endSelector } : {}),
        ...(targetId ? { targetId } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "select": {
      const ref = toStringOrEmpty(body.ref) || void 0;
      const selector = toStringOrEmpty(body.selector) || void 0;
      const values = toStringArray(body.values);
      if ((!ref && !selector) || !values?.length)
        throw new Error("select requires ref/selector and values");
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        ...(ref ? { ref } : {}),
        ...(selector ? { selector } : {}),
        values,
        ...(targetId ? { targetId } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "fill": {
      const fields = normalizeFields(body.fields);
      if (!fields.length) throw new Error("fill requires fields");
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        fields,
        ...(targetId ? { targetId } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "resize": {
      const width = readResizeDimension(body, "width");
      const height = readResizeDimension(body, "height");
      if (width === void 0 || height === void 0 || width <= 0 || height <= 0)
        throw new Error("resize requires positive width and height");
      if (width > 8192 || height > 8192)
        throw new Error(`resize width and height must not exceed ${ACT_MAX_VIEWPORT_DIMENSION}`);
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      return {
        kind,
        width,
        height,
        ...(targetId ? { targetId } : {}),
      };
    }
    case "wait": {
      const loadStateRaw = toStringOrEmpty(body.loadState);
      const loadState =
        loadStateRaw === "load" ||
        loadStateRaw === "domcontentloaded" ||
        loadStateRaw === "networkidle"
          ? loadStateRaw
          : void 0;
      const timeMs = readBoundedActionDurationMs(
        body,
        "timeMs",
        "wait timeMs",
        ACT_MAX_WAIT_TIME_MS,
      );
      const text = toStringOrEmpty(body.text) || void 0;
      const textGone = toStringOrEmpty(body.textGone) || void 0;
      const selector = toStringOrEmpty(body.selector) || void 0;
      const url = toStringOrEmpty(body.url) || void 0;
      const fn = toStringOrEmpty(body.fn) || void 0;
      if (timeMs === void 0 && !text && !textGone && !selector && !url && !loadState && !fn)
        throw new Error(
          "wait requires at least one of: timeMs, text, textGone, selector, url, loadState, fn",
        );
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        ...(timeMs !== void 0 ? { timeMs } : {}),
        ...(text ? { text } : {}),
        ...(textGone ? { textGone } : {}),
        ...(selector ? { selector } : {}),
        ...(url ? { url } : {}),
        ...(loadState ? { loadState } : {}),
        ...(fn ? { fn } : {}),
        ...(targetId ? { targetId } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "evaluate": {
      const fn = toStringOrEmpty(body.fn);
      if (!fn) throw new Error("evaluate requires fn");
      const ref = toStringOrEmpty(body.ref) || void 0;
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const timeoutMs = readActionTimeoutMs(body);
      return {
        kind,
        fn,
        ...(ref ? { ref } : {}),
        ...(targetId ? { targetId } : {}),
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      };
    }
    case "close": {
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      return {
        kind,
        ...(targetId ? { targetId } : {}),
      };
    }
    case "batch": {
      const actions = Array.isArray(body.actions) ? body.actions.map(normalizeBatchAction) : [];
      if (!actions.length)
        throw new Error(source === "batch" ? "batch requires actions" : "actions are required");
      if (countBatchActions(actions) > 100) throw new Error(`batch exceeds maximum of 100 actions`);
      const targetId = toStringOrEmpty(body.targetId) || void 0;
      const stopOnError = toBoolean(body.stopOnError);
      return {
        kind,
        actions,
        ...(targetId ? { targetId } : {}),
        ...(stopOnError !== void 0 ? { stopOnError } : {}),
      };
    }
  }
  throw new Error("Unsupported browser act kind");
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.snapshot-target.ts
/** Resolve the correct targetId after a navigation that may trigger a renderer swap. */
async function resolveTargetIdAfterNavigate(opts) {
  let currentTargetId = opts.oldTargetId;
  try {
    const pickReplacement = (tabs, options) => {
      if (tabs.some((tab) => tab.targetId === opts.oldTargetId))
        return {
          targetId: opts.oldTargetId,
          shouldRetry: false,
        };
      const byUrl = tabs.filter((tab) => tab.url === opts.navigatedUrl);
      if (byUrl.length === 1)
        return {
          targetId: byUrl[0]?.targetId ?? opts.oldTargetId,
          shouldRetry: false,
        };
      const uniqueReplacement = byUrl.filter((tab) => tab.targetId !== opts.oldTargetId);
      if (uniqueReplacement.length === 1)
        return {
          targetId: uniqueReplacement[0]?.targetId ?? opts.oldTargetId,
          shouldRetry: false,
        };
      if (options?.allowSingleTabFallback && tabs.length === 1)
        return {
          targetId: tabs[0]?.targetId ?? opts.oldTargetId,
          shouldRetry: false,
        };
      return {
        targetId: opts.oldTargetId,
        shouldRetry: true,
      };
    };
    const first = pickReplacement(await opts.listTabs());
    currentTargetId = first.targetId;
    if (first.shouldRetry) {
      await new Promise((r) => {
        setTimeout(r, opts.retryDelayMs ?? 800);
      });
      currentTargetId = pickReplacement(await opts.listTabs(), {
        allowSingleTabFallback: true,
      }).targetId;
    }
  } catch {}
  return currentTargetId;
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.ts
/**
 * Browser agent action route registration and existing-session execution.
 *
 * Dispatches normalized actions to either Playwright-backed OpenClaw browser
 * control or Chrome MCP existing-session operations with navigation guards.
 */
const EXISTING_SESSION_INTERACTION_NAVIGATION_RECHECK_DELAYS_MS = [0, 250, 500];
async function readExistingSessionLocationHref(params) {
  const currentUrl = await evaluateChromeMcpScript({
    ...params,
    fn: "() => window.location.href",
  });
  if (typeof currentUrl !== "string")
    throw new Error("Location probe returned a non-string result");
  const normalizedUrl = currentUrl.trim();
  if (!normalizedUrl) throw new Error("Location probe returned an empty URL");
  return normalizedUrl;
}
async function assertExistingSessionPostInteractionNavigationAllowed(params) {
  const navigationPolicy = withBrowserNavigationPolicy(params.ssrfPolicy, {
    browserProxyMode: params.browserProxyMode,
  });
  if (!navigationPolicy.ssrfPolicy && !navigationPolicy.browserProxyMode) return;
  const listTabs = params.listTabs;
  const initialTabTargetIds = params.initialTabTargetIds;
  const assertNewTabsAllowed = async () => {
    const tabs = await listTabs();
    for (const tab of tabs) {
      if (initialTabTargetIds.has(tab.targetId)) continue;
      await assertBrowserNavigationResultAllowed({
        url: tab.url,
        ...navigationPolicy,
      });
    }
  };
  let lastObservedUrl;
  let sawStableAllowedUrl = false;
  for (const delayMs of EXISTING_SESSION_INTERACTION_NAVIGATION_RECHECK_DELAYS_MS) {
    if (delayMs > 0) await setTimeout$1(delayMs, void 0, { signal: params.signal });
    let currentUrl;
    try {
      currentUrl = await readExistingSessionLocationHref(params);
    } catch {
      params.signal?.throwIfAborted();
      sawStableAllowedUrl = false;
      continue;
    }
    await assertBrowserNavigationResultAllowed({
      url: currentUrl,
      ...navigationPolicy,
    });
    if (currentUrl === lastObservedUrl) sawStableAllowedUrl = true;
    else sawStableAllowedUrl = false;
    lastObservedUrl = currentUrl;
  }
  if (sawStableAllowedUrl) {
    await assertNewTabsAllowed();
    return;
  }
  if (lastObservedUrl) {
    const lastDelay =
      EXISTING_SESSION_INTERACTION_NAVIGATION_RECHECK_DELAYS_MS[
        EXISTING_SESSION_INTERACTION_NAVIGATION_RECHECK_DELAYS_MS.length - 1
      ];
    await setTimeout$1(lastDelay, void 0, { signal: params.signal });
    try {
      const followUpUrl = await readExistingSessionLocationHref(params);
      await assertBrowserNavigationResultAllowed({
        url: followUpUrl,
        ...navigationPolicy,
      });
      if (followUpUrl === lastObservedUrl) {
        await assertNewTabsAllowed();
        return;
      }
    } catch {
      params.signal?.throwIfAborted();
    }
  }
  throw new Error("Unable to verify stable post-interaction navigation");
}
async function runExistingSessionActionWithNavigationGuard(params) {
  let actionError;
  let result;
  try {
    result = await params.execute();
  } catch (error) {
    actionError = error;
  }
  if (params.guard) await assertExistingSessionPostInteractionNavigationAllowed(params.guard);
  if (actionError) throw toLintErrorObject(actionError, "Non-Error thrown");
  return result;
}
function buildExistingSessionWaitPredicate(params) {
  const checks = [];
  if (params.text)
    checks.push(`Boolean(document.body?.innerText?.includes(${JSON.stringify(params.text)}))`);
  if (params.textGone)
    checks.push(`!document.body?.innerText?.includes(${JSON.stringify(params.textGone)})`);
  if (params.selector)
    checks.push(`Boolean(document.querySelector(${JSON.stringify(params.selector)}))`);
  if (params.loadState === "domcontentloaded")
    checks.push(`document.readyState === "interactive" || document.readyState === "complete"`);
  else if (params.loadState === "load") checks.push(`document.readyState === "complete"`);
  if (params.fn) {
    const source = normalizeBrowserEvaluateFunctionSource(params.fn);
    checks.push(`Boolean(await (${source})())`);
  }
  if (checks.length === 0) return null;
  return checks.length === 1
    ? expectDefined(checks.at(0), "single existing-session condition")
    : checks.map((check) => `(${check})`).join(" && ");
}
async function waitForExistingSessionCondition(params) {
  if (params.timeMs && params.timeMs > 0)
    await setTimeout$1(params.timeMs, void 0, { signal: params.signal });
  const predicate = buildExistingSessionWaitPredicate(params);
  if (!predicate && !params.url) return;
  const timeoutMs = Math.max(250, params.timeoutMs ?? 1e4);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if (
        await withChromeMcpDocument(params, async (document) => {
          const readAllowedUrl = async () => {
            const url = await document.evaluate(`(root) => {
            const boundDocument = root?.nodeType === 9 ? root : root?.ownerDocument;
            return boundDocument === globalThis.document ? globalThis.location.href : null;
          }`);
            if (typeof url !== "string" || !url.trim()) return null;
            await assertBrowserNavigationResultAllowed({
              url,
              ...withBrowserNavigationPolicy(params.ssrfPolicy, {
                browserProxyMode: params.browserProxyMode,
              }),
            });
            return url;
          };
          const currentUrl = await readAllowedUrl();
          if (!currentUrl) return false;
          if (params.url && !matchBrowserUrlPattern(params.url, currentUrl)) return false;
          if (!predicate) return true;
          const outcome = await document.evaluate(`async (root) => {
          const boundDocument = root?.nodeType === 9 ? root : root?.ownerDocument;
          if (boundDocument !== globalThis.document) return { kind: "navigation" };
          try {
            return { kind: "result", ready: Boolean(await (${predicate})) };
          } catch (error) {
            const message = error && typeof error === "object" && "message" in error
              ? String(error.message)
              : String(error);
            return { kind: "error", message };
          }
        }`);
          if (!outcome || typeof outcome !== "object")
            throw new Error("Document-bound wait returned an invalid result");
          if ("kind" in outcome && outcome.kind === "error")
            throw new Error(
              "message" in outcome && typeof outcome.message === "string"
                ? outcome.message
                : "Wait predicate failed",
            );
          const predicateReady =
            "kind" in outcome &&
            outcome.kind === "result" &&
            "ready" in outcome &&
            outcome.ready === true;
          if (!predicateReady || !params.url) return predicateReady;
          const finalUrl = await readAllowedUrl();
          return finalUrl !== null && matchBrowserUrlPattern(params.url, finalUrl);
        })
      )
        return;
    } catch (error) {
      if (!(error instanceof ChromeMcpDocumentUnavailableError)) throw error;
    }
    await setTimeout$1(250, void 0, { signal: params.signal });
  }
  throw new Error("Timed out waiting for condition");
}
const SELECTOR_ALLOWED_KINDS = /* @__PURE__ */ new Set([
  "batch",
  "click",
  "drag",
  "hover",
  "scrollIntoView",
  "select",
  "type",
  "wait",
]);
function shouldEnforceCurrentUrlForAct(action) {
  return action.kind !== "resize" && action.kind !== "close";
}
function getExistingSessionUnsupportedMessage(action) {
  switch (action.kind) {
    case "click":
      if (action.selector) return EXISTING_SESSION_LIMITS.act.clickSelector;
      if (
        (action.button && action.button !== "left") ||
        (Array.isArray(action.modifiers) && action.modifiers.length > 0)
      )
        return EXISTING_SESSION_LIMITS.act.clickButtonOrModifiers;
      return null;
    case "clickCoords":
      return null;
    case "type":
      if (action.selector) return EXISTING_SESSION_LIMITS.act.typeSelector;
      if (action.slowly) return EXISTING_SESSION_LIMITS.act.typeSlowly;
      return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.typeTimeout : null;
    case "press":
      return action.delayMs ? EXISTING_SESSION_LIMITS.act.pressDelay : null;
    case "hover":
      if (action.selector) return EXISTING_SESSION_LIMITS.act.hoverSelector;
      return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.hoverTimeout : null;
    case "scrollIntoView":
      if (action.selector) return EXISTING_SESSION_LIMITS.act.scrollSelector;
      return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.scrollTimeout : null;
    case "drag":
      if (action.startSelector || action.endSelector)
        return EXISTING_SESSION_LIMITS.act.dragSelector;
      return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.dragTimeout : null;
    case "select":
      if (action.selector) return EXISTING_SESSION_LIMITS.act.selectSelector;
      if (action.values.length !== 1) return EXISTING_SESSION_LIMITS.act.selectSingleValue;
      return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.selectTimeout : null;
    case "fill":
      return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.fillTimeout : null;
    case "wait":
      return action.loadState === "networkidle"
        ? EXISTING_SESSION_LIMITS.act.waitNetworkIdle
        : null;
    case "evaluate":
      return null;
    case "batch":
      return EXISTING_SESSION_LIMITS.act.batch;
    case "resize":
    case "close":
      return null;
  }
  throw new Error("Unsupported browser act kind");
}
/** Register browser action endpoints, including hook and download subroutes. */
function registerBrowserAgentActRoutes(app, ctx) {
  app.post("/act", async (req, res) => {
    const body = readBody(req);
    const kindRaw = toStringOrEmpty(body.kind);
    if (!isActKind(kindRaw))
      return jsonActError(res, 400, ACT_ERROR_CODES.kindRequired, "kind is required");
    const kind = kindRaw;
    let action;
    try {
      action = normalizeActRequest(body);
    } catch (err) {
      return jsonActError(res, 400, ACT_ERROR_CODES.invalidRequest, formatErrorMessage(err));
    }
    const targetId = resolveTargetIdFromBody(body);
    if (Object.hasOwn(body, "selector") && !SELECTOR_ALLOWED_KINDS.has(kind))
      return jsonActError(
        res,
        400,
        ACT_ERROR_CODES.selectorUnsupported,
        SELECTOR_UNSUPPORTED_MESSAGE,
      );
    const earlyFn = action.kind === "wait" || action.kind === "evaluate" ? action.fn : "";
    if (
      (action.kind === "evaluate" || (action.kind === "wait" && earlyFn)) &&
      !ctx.state().resolved.evaluateEnabled
    )
      return jsonActError(
        res,
        403,
        ACT_ERROR_CODES.evaluateDisabled,
        browserEvaluateDisabledMessage(action.kind === "evaluate" ? "evaluate" : "wait"),
      );
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: shouldEnforceCurrentUrlForAct(action),
      run: async ({ profileCtx, cdpUrl, tab, signal, resolveTabUrl }) => {
        const evaluateEnabled = ctx.state().resolved.evaluateEnabled;
        const navigationPolicy = browserNavigationPolicyForProfile(ctx, profileCtx);
        const isExistingSession = getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp;
        const existingSessionCallOptions = {
          timeoutMs:
            ("timeoutMs" in action && typeof action.timeoutMs === "number"
              ? action.timeoutMs
              : void 0) ?? ctx.state().resolved.actionTimeoutMs,
          signal,
        };
        const hasNavigationResultPolicy = Boolean(
          navigationPolicy.ssrfPolicy || navigationPolicy.browserProxyMode,
        );
        const jsonOk = async (extra, options) => {
          const responseTargetId =
            options?.resolveCurrentTarget && (!isExistingSession || hasNavigationResultPolicy)
              ? await resolveTargetIdAfterNavigate({
                  oldTargetId: tab.targetId,
                  navigatedUrl: tab.url,
                  listTabs: () => profileCtx.listTabs(existingSessionCallOptions),
                })
              : tab.targetId;
          const url =
            responseTargetId === tab.targetId
              ? await resolveTabUrl(tab.url)
              : await resolveSafeRouteTabUrl({
                  ctx,
                  profileCtx,
                  targetId: responseTargetId,
                  fallbackUrl: tab.url,
                  ...(isExistingSession ? existingSessionCallOptions : {}),
                });
          return res.json({
            ok: true,
            targetId: responseTargetId,
            ...(url ? { url } : {}),
            ...extra,
          });
        };
        const actionTabs =
          action.kind === "batch" && !isExistingSession ? await profileCtx.listTabs() : [tab];
        if (!actionTabs.some((candidate) => candidate.targetId === tab.targetId))
          actionTabs.unshift(tab);
        const targetIdError = canonicalizeActTargetIds(action, tab, actionTabs);
        if (targetIdError)
          return jsonActError(res, 403, ACT_ERROR_CODES.targetIdMismatch, targetIdError);
        const profileName = profileCtx.profile.name;
        if (isExistingSession) {
          const existingSessionTarget = {
            profileName,
            profile: profileCtx.profile,
            targetId: tab.targetId,
            ...existingSessionCallOptions,
          };
          const initialTabTargetIds = hasNavigationResultPolicy
            ? new Set(
                (await profileCtx.listTabs(existingSessionCallOptions)).map(
                  (currentTab) => currentTab.targetId,
                ),
              )
            : /* @__PURE__ */ new Set();
          const existingSessionNavigationGuard = {
            ...existingSessionTarget,
            ...navigationPolicy,
            listTabs: () => profileCtx.listTabs(existingSessionCallOptions),
            initialTabTargetIds,
          };
          const unsupportedMessage = getExistingSessionUnsupportedMessage(action);
          if (unsupportedMessage)
            return jsonActError(
              res,
              501,
              ACT_ERROR_CODES.unsupportedForExistingSession,
              unsupportedMessage,
            );
          switch (action.kind) {
            case "click":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  clickChromeMcpElement({
                    ...existingSessionTarget,
                    uid: action.ref,
                    doubleClick: action.doubleClick ?? false,
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "clickCoords":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  clickChromeMcpCoords({
                    ...existingSessionTarget,
                    x: action.x,
                    y: action.y,
                    doubleClick: action.doubleClick ?? false,
                    button: action.button,
                    delayMs: action.delayMs,
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "type":
              await runExistingSessionActionWithNavigationGuard({
                execute: async () => {
                  await fillChromeMcpElement({
                    ...existingSessionTarget,
                    uid: action.ref,
                    value: action.text,
                  });
                  if (action.submit)
                    await pressChromeMcpKey({
                      ...existingSessionTarget,
                      key: "Enter",
                    });
                },
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "press":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  pressChromeMcpKey({
                    ...existingSessionTarget,
                    key: action.key,
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "hover":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  hoverChromeMcpElement({
                    ...existingSessionTarget,
                    uid: action.ref,
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "scrollIntoView":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  evaluateChromeMcpScript({
                    ...existingSessionTarget,
                    fn: `(el) => { el.scrollIntoView({ block: "center", inline: "center" }); return true; }`,
                    args: [action.ref],
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "drag":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  dragChromeMcpElement({
                    ...existingSessionTarget,
                    fromUid: action.startRef,
                    toUid: action.endRef,
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "select":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  fillChromeMcpElement({
                    ...existingSessionTarget,
                    uid: action.ref,
                    value: action.values[0] ?? "",
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "fill":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  fillChromeMcpForm({
                    ...existingSessionTarget,
                    elements: action.fields.map((field) => ({
                      uid: field.ref,
                      value: String(field.value ?? ""),
                    })),
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk(void 0, { resolveCurrentTarget: true });
            case "resize":
              await resizeChromeMcpPage({
                ...existingSessionTarget,
                width: action.width,
                height: action.height,
              });
              return await jsonOk();
            case "wait":
              await runExistingSessionActionWithNavigationGuard({
                execute: () =>
                  waitForExistingSessionCondition({
                    ...existingSessionTarget,
                    timeMs: action.timeMs,
                    text: action.text,
                    textGone: action.textGone,
                    selector: action.selector,
                    url: action.url,
                    loadState: action.loadState,
                    fn: action.fn,
                    ...navigationPolicy,
                  }),
                guard: existingSessionNavigationGuard,
              });
              return await jsonOk();
            case "evaluate":
              return await jsonOk(
                {
                  result: await runExistingSessionActionWithNavigationGuard({
                    execute: () =>
                      evaluateChromeMcpScript({
                        ...existingSessionTarget,
                        fn: normalizeBrowserEvaluateFunctionSource(
                          action.fn,
                          action.ref ? { argumentName: "el" } : void 0,
                        ),
                        args: action.ref ? [action.ref] : void 0,
                      }),
                    guard: existingSessionNavigationGuard,
                  }),
                },
                { resolveCurrentTarget: true },
              );
            case "close":
              await profileCtx.closeTab(tab.targetId, {
                ...existingSessionCallOptions,
                exactTargetId: true,
              });
              return await jsonOk();
            case "batch":
              return jsonActError(
                res,
                501,
                ACT_ERROR_CODES.unsupportedForExistingSession,
                EXISTING_SESSION_LIMITS.act.batch,
              );
          }
        }
        const pw = await requirePwAi(res, `act:${kind}`);
        if (!pw) return;
        const result = await pw.executeActViaPlaywright({
          cdpUrl,
          action,
          targetId: tab.targetId,
          evaluateEnabled,
          ...navigationPolicy,
          signal,
        });
        if (result.blockedByDialog)
          return await jsonOk({
            blockedByDialog: true,
            browserState: result.browserState,
          });
        const downloads = result.downloads;
        switch (action.kind) {
          case "batch":
            return await jsonOk(
              {
                results: result.results ?? [],
                ...(downloads ? { downloads } : {}),
              },
              { resolveCurrentTarget: true },
            );
          case "evaluate":
            return await jsonOk(
              {
                result: result.result,
                ...(downloads ? { downloads } : {}),
              },
              { resolveCurrentTarget: true },
            );
          case "click":
          case "clickCoords":
            return await jsonOk(downloads ? { downloads } : void 0, { resolveCurrentTarget: true });
          case "resize":
            return await jsonOk(downloads ? { downloads } : void 0);
          default:
            return await jsonOk(downloads ? { downloads } : void 0, { resolveCurrentTarget: true });
        }
      },
    });
  });
  registerBrowserAgentActHookRoutes(app, ctx);
  registerBrowserAgentActDownloadRoutes(app, ctx);
  app.post("/response/body", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const url = toStringOrEmpty(body.url);
    let timeoutMs;
    let maxChars;
    try {
      timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
      maxChars = readRoutePositiveInteger(body.maxChars, "maxChars");
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    if (!url) return jsonError(res, 400, "url is required");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, cdpUrl, tab, signal, resolveTabUrl }) => {
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp)
          return jsonError(res, 501, EXISTING_SESSION_LIMITS.responseBody);
        const pw = await requirePwAi(res, "response body");
        if (!pw) return;
        const result = await pw.responseBodyViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          url,
          timeoutMs: timeoutMs ?? void 0,
          maxChars: maxChars ?? void 0,
        });
        signal.throwIfAborted();
        const currentUrl = await resolveTabUrl(tab.url);
        res.json({
          ok: true,
          targetId: tab.targetId,
          ...(currentUrl ? { url: currentUrl } : {}),
          response: result,
        });
      },
    });
  });
  app.post("/highlight", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const ref = toStringOrEmpty(body.ref);
    if (!ref) return jsonError(res, 400, "ref is required");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, cdpUrl, tab, signal, resolveTabUrl }) => {
        const jsonOk = async () => {
          const currentUrl = await resolveTabUrl(tab.url);
          return res.json({
            ok: true,
            targetId: tab.targetId,
            ...(currentUrl ? { url: currentUrl } : {}),
          });
        };
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
          await evaluateChromeMcpScript({
            profileName: profileCtx.profile.name,
            profile: profileCtx.profile,
            targetId: tab.targetId,
            args: [ref],
            timeoutMs: ctx.state().resolved.actionTimeoutMs,
            signal,
            fn: `(el) => {
              if (!(el instanceof Element)) {
                return false;
              }
              el.scrollIntoView({ block: "center", inline: "center" });
              const previousOutline = el.style.outline;
              const previousOffset = el.style.outlineOffset;
              el.style.outline = "3px solid #FF4500";
              el.style.outlineOffset = "2px";
              setTimeout(() => {
                el.style.outline = previousOutline;
                el.style.outlineOffset = previousOffset;
              }, 2000);
              return true;
            }`,
          });
          return await jsonOk();
        }
        const pw = await requirePwAi(res, "highlight");
        if (!pw) return;
        await pw.highlightViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          ref,
        });
        await jsonOk();
      },
    });
  });
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
//#region extensions/browser/src/browser/routes/agent.debug.ts
/**
 * Browser debug and trace routes.
 *
 * Exposes console messages, page errors, network requests, dialog state, and
 * Playwright tracing scoped to the selected browser tab.
 */
function browserDebugTargetPayload(targetId, url) {
  return {
    ok: true,
    targetId,
    ...(url ? { url } : {}),
  };
}
async function sendPlaywrightDebugCollection(params) {
  await withPlaywrightRouteContext({
    req: params.req,
    res: params.res,
    ctx: params.ctx,
    targetId: params.targetId,
    feature: params.feature,
    enforceCurrentUrlAllowed: true,
    run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
      const result = await params.collect({
        cdpUrl,
        targetId: tab.targetId,
        pw,
      });
      const url = await resolveTabUrl(tab.url);
      params.res.json({
        ...browserDebugTargetPayload(tab.targetId, url),
        ...result,
      });
    },
  });
}
/** Register browser debug endpoints on the control server. */
function registerBrowserAgentDebugRoutes(app, ctx) {
  app.get("/console", async (req, res) => {
    const targetId = resolveTargetIdFromQuery(req.query);
    const level = typeof req.query.level === "string" ? req.query.level : "";
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "console messages",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
        const messages = await pw.getConsoleMessagesViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          level: normalizeOptionalString$1(level),
        });
        const url = await resolveTabUrl(tab.url);
        res.json({
          ...browserDebugTargetPayload(tab.targetId, url),
          messages,
        });
      },
    });
  });
  app.get("/errors", async (req, res) => {
    const targetId = resolveTargetIdFromQuery(req.query);
    const clear = toBoolean(req.query.clear) ?? false;
    await sendPlaywrightDebugCollection({
      req,
      res,
      ctx,
      targetId,
      feature: "page errors",
      collect: async ({ cdpUrl, targetId: targetIdValue, pw }) =>
        await pw.getPageErrorsViaPlaywright({
          cdpUrl,
          targetId: targetIdValue,
          clear,
        }),
    });
  });
  app.get("/requests", async (req, res) => {
    const targetId = resolveTargetIdFromQuery(req.query);
    const filter = typeof req.query.filter === "string" ? req.query.filter : "";
    const clear = toBoolean(req.query.clear) ?? false;
    await sendPlaywrightDebugCollection({
      req,
      res,
      ctx,
      targetId,
      feature: "network requests",
      collect: async ({ cdpUrl, targetId: targetIdLocal, pw }) =>
        await pw.getNetworkRequestsViaPlaywright({
          cdpUrl,
          targetId: targetIdLocal,
          filter: normalizeOptionalString$1(filter),
          clear,
        }),
    });
  });
  app.get("/dialogs", async (req, res) => {
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId: resolveTargetIdFromQuery(req.query),
      feature: "dialog state",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
        const browserState = await pw.getObservedBrowserStateViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          ssrfPolicy: ctx.state().resolved.ssrfPolicy,
        });
        const url = await resolveTabUrl(tab.url);
        res.json({
          ...browserDebugTargetPayload(tab.targetId, url),
          browserState,
        });
      },
    });
  });
  app.post("/trace/start", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const screenshots = toBoolean(body.screenshots) ?? void 0;
    const snapshots = toBoolean(body.snapshots) ?? void 0;
    const sources = toBoolean(body.sources) ?? void 0;
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "trace start",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
        await pw.traceStartViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          screenshots,
          snapshots,
          sources,
        });
        const url = await resolveTabUrl(tab.url);
        res.json(browserDebugTargetPayload(tab.targetId, url));
      },
    });
  });
  app.post("/trace/stop", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const out = toStringOrEmpty(body.path) || "";
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "trace stop",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
        const id = crypto.randomUUID();
        const tracePath = await resolveWritableOutputPathOrRespond({
          res,
          rootDir: DEFAULT_TRACE_DIR,
          requestedPath: out,
          scopeLabel: "trace directory",
          defaultFileName: `browser-trace-${id}.zip`,
          ensureRootDir: true,
        });
        if (!tracePath) return;
        await pw.traceStopViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          path: tracePath,
        });
        const url = await resolveTabUrl(tab.url);
        res.json({
          ...browserDebugTargetPayload(tab.targetId, url),
          path: path.resolve(tracePath),
        });
      },
    });
  });
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp.snapshot.ts
/**
 * Chrome MCP snapshot conversion helpers.
 *
 * Converts chrome-devtools-mcp structured snapshots into OpenClaw ARIA nodes
 * and compact AI snapshots with stable refs and duplicate tracking.
 */
function normalizeRole(node) {
  return normalizeLowercaseStringOrEmpty(node.role) || "generic";
}
function escapeQuoted(value) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\r", "\\r")
    .replaceAll("\n", "\\n");
}
function shouldIncludeNode(params) {
  if (params.options?.interactive && !INTERACTIVE_ROLES.has(params.role)) return false;
  if (params.options?.compact && STRUCTURAL_ROLES.has(params.role) && !params.name) return false;
  return true;
}
function shouldCreateRef(role, name) {
  return INTERACTIVE_ROLES.has(role) || (CONTENT_ROLES.has(role) && Boolean(name));
}
function createDuplicateTracker() {
  return {
    counts: /* @__PURE__ */ new Map(),
    keysByRef: /* @__PURE__ */ new Map(),
    duplicates: /* @__PURE__ */ new Set(),
  };
}
function registerRef(tracker, ref, role, name) {
  const key = `${role}:${name ?? ""}`;
  const count = tracker.counts.get(key) ?? 0;
  tracker.counts.set(key, count + 1);
  tracker.keysByRef.set(ref, key);
  if (count > 0) {
    tracker.duplicates.add(key);
    return count;
  }
}
/** Flatten a Chrome MCP snapshot tree into OpenClaw ARIA-style nodes. */
function flattenChromeMcpSnapshotToAriaNodes(root, limit = 500) {
  const boundedLimit = Math.max(1, Math.min(2e3, Math.floor(limit)));
  const out = [];
  const visit = (node, depth) => {
    if (out.length >= boundedLimit) return;
    const ref = normalizeString(node.id);
    if (ref)
      out.push({
        ref,
        role: normalizeRole(node),
        name: normalizeString(node.name) ?? "",
        value: normalizeString(node.value),
        description: normalizeString(node.description),
        depth,
      });
    for (const child of node.children ?? []) {
      visit(child, depth + 1);
      if (out.length >= boundedLimit) return;
    }
  };
  visit(root, 0);
  return out;
}
/** Build a compact text snapshot and ref map from a Chrome MCP snapshot tree. */
function buildAiSnapshotFromChromeMcpSnapshot(params) {
  const refs = {};
  const tracker = createDuplicateTracker();
  const lines = [];
  const visit = (node, depth) => {
    const role = normalizeRole(node);
    const name = normalizeString(node.name);
    const value = normalizeString(node.value);
    const description = normalizeString(node.description);
    const maxDepth = params.options?.maxDepth;
    if (maxDepth !== void 0 && depth > maxDepth) return;
    if (
      shouldIncludeNode({
        role,
        name,
        options: params.options,
      })
    ) {
      let line = `${"  ".repeat(depth)}- ${role}`;
      if (name) line += ` "${escapeQuoted(name)}"`;
      const ref = normalizeString(node.id);
      if (ref && shouldCreateRef(role, name)) {
        const nth = registerRef(tracker, ref, role, name);
        refs[ref] =
          nth === void 0
            ? {
                role,
                name,
              }
            : {
                role,
                name,
                nth,
              };
        line += ` [ref=${ref}]`;
      }
      if (value) line += ` value="${escapeQuoted(value)}"`;
      if (description) line += ` description="${escapeQuoted(description)}"`;
      lines.push(line);
    }
    for (const child of node.children ?? []) visit(child, depth + 1);
  };
  visit(params.root, 0);
  for (const [ref, data] of Object.entries(refs)) {
    const key = tracker.keysByRef.get(ref);
    if (key && !tracker.duplicates.has(key)) delete data.nth;
  }
  return {
    snapshot: lines.join("\n"),
    refs,
  };
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.snapshot.plan.ts
/**
 * Snapshot planning for browser route handlers.
 *
 * Resolves requested snapshot mode, format, limits, refs, labels, and driver
 * choice before the route talks to Playwright or Chrome MCP.
 */
/** Resolve a normalized snapshot plan from query parameters and profile caps. */
function resolveSnapshotPlan(params) {
  const mode = params.query.mode === "efficient" ? "efficient" : void 0;
  const labels = toBoolean(params.query.labels) ?? void 0;
  const urls = toBoolean(params.query.urls) ?? void 0;
  const explicitFormat =
    params.query.format === "aria" ? "aria" : params.query.format === "ai" ? "ai" : void 0;
  const format = resolveDefaultSnapshotFormat({
    profile: params.profile,
    hasPlaywright: params.hasPlaywright,
    explicitFormat,
    mode,
  });
  const limit = parseStrictPositiveInteger(params.query.limit);
  const hasMaxChars = Object.hasOwn(params.query, "maxChars");
  const maxCharsRaw = parseStrictNonNegativeInteger(params.query.maxChars);
  const resolvedMaxChars =
    format === "ai"
      ? hasMaxChars
        ? maxCharsRaw === void 0
          ? mode === "efficient"
            ? DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS
            : DEFAULT_AI_SNAPSHOT_MAX_CHARS
          : maxCharsRaw !== void 0 && maxCharsRaw > 0
            ? maxCharsRaw
            : void 0
        : mode === "efficient"
          ? DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS
          : DEFAULT_AI_SNAPSHOT_MAX_CHARS
      : void 0;
  const interactiveRaw = toBoolean(params.query.interactive);
  const compactRaw = toBoolean(params.query.compact);
  const depthRaw = parseStrictNonNegativeInteger(params.query.depth);
  const refsModeRaw = toStringOrEmpty(params.query.refs).trim();
  const refsMode = refsModeRaw === "aria" ? "aria" : refsModeRaw === "role" ? "role" : void 0;
  const interactive = interactiveRaw ?? (mode === "efficient" ? true : void 0);
  const compact = compactRaw ?? (mode === "efficient" ? true : void 0);
  const depth = depthRaw ?? (mode === "efficient" ? 6 : void 0);
  const selectorValue = normalizeOptionalString$1(toStringOrEmpty(params.query.selector));
  const frameSelectorValue = normalizeOptionalString$1(toStringOrEmpty(params.query.frame));
  const timeoutMsRaw = parseStrictPositiveInteger(params.query.timeoutMs);
  return {
    format,
    mode,
    labels,
    urls,
    limit,
    resolvedMaxChars,
    interactive,
    compact,
    depth,
    refsMode,
    selectorValue,
    frameSelectorValue,
    timeoutMs: timeoutMsRaw !== void 0 ? normalizeBrowserTimerDelayMs(timeoutMsRaw) : void 0,
    wantsRoleSnapshot:
      labels === true ||
      urls === true ||
      mode === "efficient" ||
      interactive === true ||
      compact === true ||
      depth !== void 0 ||
      Boolean(selectorValue) ||
      Boolean(frameSelectorValue),
  };
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.snapshot.ts
/**
 * Browser snapshot, navigation, and screenshot routes.
 *
 * Handles profile-aware snapshot generation across Playwright and Chrome MCP,
 * navigation policy checks, media storage, and screenshot normalization.
 */
const CHROME_MCP_OVERLAY_ATTR = "data-openclaw-mcp-overlay";
async function collectChromeMcpSnapshotUrls(params) {
  const result = await evaluateChromeMcpScript({
    ...params,
    fn: `() => {
      const seen = new Set();
      const out = [];
      for (const anchor of Array.from(document.querySelectorAll("a[href]"))) {
        const href = anchor.href || "";
        if (!href || seen.has(href)) continue;
        const text = (anchor.innerText || anchor.textContent || anchor.getAttribute("aria-label") || "")
          .replace(/\\s+/g, " ")
          .trim()
          .slice(0, 121) || href;
        seen.add(href);
        out.push({ text, url: href });
        if (out.length >= 100) break;
      }
      return out;
    }`,
  }).catch(() => []);
  return Array.isArray(result)
    ? result
        .filter(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            typeof entry.text === "string" &&
            typeof entry.url === "string",
        )
        .map((entry) => {
          entry.text = truncateUtf16Safe(entry.text, 120) || entry.url;
          return entry;
        })
    : [];
}
async function clearChromeMcpOverlay(params) {
  await evaluateChromeMcpScript({
    ...params,
    signal: void 0,
    fn: `() => {
      document.querySelectorAll("[${CHROME_MCP_OVERLAY_ATTR}]").forEach((node) => node.remove());
      return true;
    }`,
  }).catch(() => {});
}
async function renderChromeMcpLabels(params) {
  const refList = JSON.stringify(params.refs);
  const result = await evaluateChromeMcpScript({
    ...params,
    args: params.refs,
    fn: `(...elements) => {
      const refs = ${refList};
      document.querySelectorAll("[${CHROME_MCP_OVERLAY_ATTR}]").forEach((node) => node.remove());
      const root = document.createElement("div");
      root.setAttribute("${CHROME_MCP_OVERLAY_ATTR}", "labels");
      root.style.position = "fixed";
      root.style.inset = "0";
      root.style.pointerEvents = "none";
      root.style.zIndex = "2147483647";
      let labels = 0;
      let skipped = 0;
      elements.forEach((el, index) => {
        if (!(el instanceof Element)) {
          skipped += 1;
          return;
        }
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 && rect.height <= 0) {
          skipped += 1;
          return;
        }
        labels += 1;
        const badge = document.createElement("div");
        badge.setAttribute("${CHROME_MCP_OVERLAY_ATTR}", "label");
        badge.textContent = refs[index] || String(labels);
        badge.style.position = "fixed";
        badge.style.left = \`\${Math.max(0, rect.left)}px\`;
        badge.style.top = \`\${Math.max(0, rect.top)}px\`;
        badge.style.transform = "translateY(-100%)";
        badge.style.padding = "2px 6px";
        badge.style.borderRadius = "999px";
        badge.style.background = "#FF4500";
        badge.style.color = "#fff";
        badge.style.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        badge.style.boxShadow = "0 2px 6px rgba(0,0,0,0.35)";
        badge.style.whiteSpace = "nowrap";
        root.appendChild(badge);
      });
      document.documentElement.appendChild(root);
      return { labels, skipped };
    }`,
  });
  return {
    labels:
      result && typeof result === "object" && typeof result.labels === "number" ? result.labels : 0,
    skipped:
      result && typeof result === "object" && typeof result.skipped === "number"
        ? result.skipped
        : 0,
  };
}
async function saveNormalizedScreenshotResponse(params) {
  const originalMeta = params.annotations?.length
    ? ((await getImageMetadata(params.buffer)) ?? void 0)
    : void 0;
  const normalized = await normalizeBrowserScreenshot(params.buffer, {
    maxSide: DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
    maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
  });
  const annotations = await rescaleAnnotationsForNormalization({
    annotations: params.annotations,
    originalMeta,
    normalizedBuffer: normalized.buffer,
  });
  await saveBrowserMediaResponse({
    res: params.res,
    buffer: normalized.buffer,
    contentType: normalized.contentType ?? `image/${params.type}`,
    maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
    targetId: params.targetId,
    url: params.url,
    labels: params.labels,
    labelsCount: params.labelsCount,
    labelsSkipped: params.labelsSkipped,
    annotations,
  });
}
/**
 * Keep annotation coordinates aligned with the saved media after
 * normalizeBrowserScreenshot. Returns the original annotations unchanged
 * when normalization did not change the image dimensions, or when image
 * metadata is unavailable (best-effort: better to ship pre-resize coords
 * than to drop the field entirely).
 */
async function rescaleAnnotationsForNormalization(params) {
  if (!params.annotations || params.annotations.length === 0) return params.annotations;
  const orig = params.originalMeta;
  if (!orig?.width || !orig?.height) return params.annotations;
  const next = await getImageMetadata(params.normalizedBuffer);
  if (!next?.width || !next?.height) return params.annotations;
  if (next.width === orig.width && next.height === orig.height) return params.annotations;
  return scaleAnnotations(params.annotations, next.width / orig.width, next.height / orig.height);
}
async function saveBrowserMediaResponse(params) {
  await ensureMediaDir();
  const saved = await saveMediaBuffer(
    params.buffer,
    params.contentType,
    "browser",
    params.maxBytes,
  );
  params.res.json({
    ok: true,
    path: path.resolve(saved.path),
    targetId: params.targetId,
    url: params.url,
    ...(params.labels ? { labels: true } : {}),
    ...(typeof params.labelsCount === "number" ? { labelsCount: params.labelsCount } : {}),
    ...(typeof params.labelsSkipped === "number" ? { labelsSkipped: params.labelsSkipped } : {}),
    ...(params.annotations && params.annotations.length > 0
      ? { annotations: params.annotations }
      : {}),
  });
}
function hasObservableBrowserState(state) {
  if (!state || typeof state !== "object") return false;
  const dialogs = state.dialogs;
  return Boolean(dialogs?.pending?.length || dialogs?.recent?.length);
}
function hasPendingDialogs(state) {
  if (!state || typeof state !== "object") return false;
  const dialogs = state.dialogs;
  return Boolean(dialogs?.pending?.length);
}
function browserStateResponseFields(state) {
  return hasObservableBrowserState(state) ? { browserState: state } : {};
}
/** Register snapshot, screenshot, and navigation endpoints. */
function registerBrowserAgentSnapshotRoutes(app, ctx) {
  app.post("/navigate", async (req, res) => {
    const body = readBody(req);
    const url = toStringOrEmpty(body.url);
    const targetId = toStringOrEmpty(body.targetId) || void 0;
    if (!url) return jsonError(res, 400, "url is required");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      run: async ({ profileCtx, tab, cdpUrl, signal }) => {
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
          const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
          await assertBrowserNavigationAllowed({
            url,
            ...ssrfPolicyOpts,
          });
          const result = await navigateChromeMcpPage({
            profileName: profileCtx.profile.name,
            profile: profileCtx.profile,
            targetId: tab.targetId,
            url,
            signal,
          });
          await assertBrowserNavigationResultAllowed({
            url: result.url,
            ...ssrfPolicyOpts,
          });
          return res.json({
            ok: true,
            targetId: tab.targetId,
            ...result,
          });
        }
        const pw = await requirePwAi(res, "navigate");
        if (!pw) return;
        const result = await pw.navigateViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          url,
          ...browserNavigationPolicyForProfile(ctx, profileCtx),
        });
        const currentTargetId = await resolveTargetIdAfterNavigate({
          oldTargetId: tab.targetId,
          navigatedUrl: result.url,
          listTabs: () => profileCtx.listTabs(),
        });
        res.json({
          ok: true,
          targetId: currentTargetId,
          ...result,
        });
      },
    });
  });
  app.post("/pdf", async (req, res) => {
    const targetId = toStringOrEmpty(readBody(req).targetId) || void 0;
    const profileCtx = resolveProfileContext(req, res, ctx);
    if (!profileCtx) return;
    if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp)
      return jsonError(res, 501, EXISTING_SESSION_LIMITS.snapshot.pdfUnsupported);
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      profileCtx,
      targetId,
      feature: "pdf",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw }) => {
        const pdf = await pw.pdfViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
        });
        await saveBrowserMediaResponse({
          res,
          buffer: pdf.buffer,
          contentType: "application/pdf",
          maxBytes: pdf.buffer.byteLength,
          targetId: tab.targetId,
          url: tab.url,
        });
      },
    });
  });
  app.post("/screenshot", async (req, res) => {
    const body = readBody(req);
    const targetId = toStringOrEmpty(body.targetId) || void 0;
    const fullPage = toBoolean(body.fullPage) ?? false;
    const ref = toStringOrEmpty(body.ref) || void 0;
    const element = toStringOrEmpty(body.element) || void 0;
    const labels = toBoolean(body.labels) ?? false;
    const type = body.type === "jpeg" ? "jpeg" : "png";
    let timeoutMs;
    try {
      const timeoutMsRaw = readRoutePositiveInteger(body.timeoutMs, "timeoutMs");
      timeoutMs =
        timeoutMsRaw !== void 0
          ? normalizeBrowserTimerDelayMs(timeoutMsRaw)
          : DEFAULT_BROWSER_SCREENSHOT_TIMEOUT_MS;
    } catch (err) {
      return jsonError(res, 400, String(err instanceof Error ? err.message : err));
    }
    if (fullPage && (ref || element))
      return jsonError(res, 400, "fullPage is not supported for element screenshots");
    await withRouteTabContext({
      req,
      res,
      ctx,
      targetId,
      enforceCurrentUrlAllowed: true,
      run: async ({ profileCtx, tab, cdpUrl, signal }) => {
        if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
          const operation = {
            profileName: profileCtx.profile.name,
            profile: profileCtx.profile,
            targetId: tab.targetId,
            timeoutMs,
            signal,
          };
          const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
          if (ssrfPolicyOpts.ssrfPolicy)
            await assertBrowserNavigationResultAllowed({
              url: tab.url,
              ...ssrfPolicyOpts,
            });
          if (element)
            return jsonError(res, 400, EXISTING_SESSION_LIMITS.snapshot.screenshotElement);
          if (labels) {
            const built = buildAiSnapshotFromChromeMcpSnapshot({
              root: await takeChromeMcpSnapshot(operation),
            });
            const labelResult = await renderChromeMcpLabels({
              ...operation,
              refs: Object.keys(built.refs),
            });
            try {
              await saveNormalizedScreenshotResponse({
                res,
                buffer: await takeChromeMcpScreenshot({
                  ...operation,
                  fullPage,
                  format: type,
                }),
                type,
                targetId: tab.targetId,
                url: tab.url,
                labels: true,
                labelsCount: labelResult.labels,
                labelsSkipped: labelResult.skipped,
              });
            } finally {
              await clearChromeMcpOverlay(operation);
            }
            return;
          }
          await saveNormalizedScreenshotResponse({
            res,
            buffer: await takeChromeMcpScreenshot({
              ...operation,
              uid: ref,
              fullPage,
              format: type,
            }),
            type,
            targetId: tab.targetId,
            url: tab.url,
          });
          return;
        }
        let buffer;
        if (
          labels ||
          shouldUsePlaywrightForScreenshot({
            profile: profileCtx.profile,
            wsUrl: tab.wsUrl,
            ref,
            element,
          })
        ) {
          const pw = await requirePwAi(res, "screenshot");
          if (!pw) return;
          if (labels) {
            const snap = await pw.snapshotRoleViaPlaywright({
              cdpUrl,
              targetId: tab.targetId,
              ssrfPolicy: ctx.state().resolved.ssrfPolicy,
            });
            const labeled = await pw.screenshotWithLabelsViaPlaywright({
              cdpUrl,
              targetId: tab.targetId,
              refs: snap.refs,
              type,
              timeoutMs,
              fullPage,
              ref,
              element,
            });
            await saveNormalizedScreenshotResponse({
              res,
              buffer: labeled.buffer,
              type,
              targetId: tab.targetId,
              url: tab.url,
              labels: true,
              labelsCount: labeled.labels,
              labelsSkipped: labeled.skipped,
              annotations: labeled.annotations,
            });
            return;
          }
          buffer = (
            await pw.takeScreenshotViaPlaywright({
              cdpUrl,
              targetId: tab.targetId,
              ref,
              element,
              fullPage,
              type,
              timeoutMs,
            })
          ).buffer;
        } else
          buffer = await captureScreenshot({
            wsUrl: tab.wsUrl ?? "",
            fullPage,
            format: type,
            quality: type === "jpeg" ? 85 : void 0,
            timeoutMs,
          });
        await saveNormalizedScreenshotResponse({
          res,
          buffer,
          type,
          targetId: tab.targetId,
          url: tab.url,
        });
      },
    });
  });
  app.get("/snapshot", async (req, res) => {
    const profileCtx = resolveProfileContext(req, res, ctx);
    if (!profileCtx) return;
    const targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
    const pwModule = await getPwAiModule();
    const hasPlaywright = Boolean(pwModule);
    const plan = resolveSnapshotPlan({
      profile: profileCtx.profile,
      query: req.query,
      hasPlaywright,
    });
    const usesChromeMcp = getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp;
    if ((plan.labels || plan.mode === "efficient") && plan.format === "aria")
      return jsonError(res, 400, "labels/mode=efficient require format=ai");
    if (usesChromeMcp && (plan.selectorValue || plan.frameSelectorValue))
      return jsonError(res, 400, EXISTING_SESSION_LIMITS.snapshot.snapshotSelector);
    try {
      await runProfileRouteOperation({
        profileCtx,
        signal: req.signal,
        run: async (signal) => {
          const tab = await profileCtx.ensureTabAvailable(targetId || void 0, {
            allowPlaywrightFallback: hasPlaywright,
            signal,
            timeoutMs: plan.timeoutMs,
          });
          const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
          if (ssrfPolicyOpts.ssrfPolicy)
            await assertBrowserNavigationResultAllowed({
              url: tab.url,
              ...ssrfPolicyOpts,
            });
          let observedBrowserState;
          if (!usesChromeMcp && pwModule)
            observedBrowserState = await pwModule
              .getObservedBrowserStateViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                ssrfPolicy: ctx.state().resolved.ssrfPolicy,
              })
              .catch(() => void 0);
          if (usesChromeMcp) {
            const operation = {
              profileName: profileCtx.profile.name,
              profile: profileCtx.profile,
              targetId: tab.targetId,
              timeoutMs: plan.timeoutMs,
              signal,
            };
            const snapshot = await takeChromeMcpSnapshot(operation);
            if (plan.format === "aria")
              return res.json({
                ok: true,
                format: "aria",
                targetId: tab.targetId,
                url: tab.url,
                nodes: flattenChromeMcpSnapshotToAriaNodes(snapshot, plan.limit),
              });
            const built = buildAiSnapshotFromChromeMcpSnapshot({
              root: snapshot,
              options: {
                interactive: plan.interactive ?? void 0,
                compact: plan.compact ?? void 0,
                maxDepth: plan.depth ?? void 0,
              },
            });
            const finalized = finalizeRoleSnapshot({
              ...(plan.urls
                ? {
                    ...built,
                    snapshot: appendSnapshotUrls(
                      built.snapshot,
                      await collectChromeMcpSnapshotUrls(operation),
                    ),
                  }
                : built),
              maxChars: plan.resolvedMaxChars,
            });
            if (plan.labels) {
              const refs = Object.keys(finalized.refs);
              const labelResult = await renderChromeMcpLabels({
                ...operation,
                refs,
              });
              try {
                const normalized = await normalizeBrowserScreenshot(
                  await takeChromeMcpScreenshot({
                    ...operation,
                    format: "png",
                  }),
                  {
                    maxSide: DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
                    maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
                  },
                );
                await ensureMediaDir();
                const saved = await saveMediaBuffer(
                  normalized.buffer,
                  normalized.contentType ?? "image/png",
                  "browser",
                  DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
                );
                return res.json({
                  ok: true,
                  format: "ai",
                  targetId: tab.targetId,
                  url: tab.url,
                  labels: true,
                  labelsCount: labelResult.labels,
                  labelsSkipped: labelResult.skipped,
                  imagePath: path.resolve(saved.path),
                  imageType: normalized.contentType?.includes("jpeg") ? "jpeg" : "png",
                  ...finalized,
                });
              } finally {
                await clearChromeMcpOverlay(operation);
              }
            }
            return res.json({
              ok: true,
              format: "ai",
              targetId: tab.targetId,
              url: tab.url,
              ...finalized,
            });
          }
          if (hasPendingDialogs(observedBrowserState))
            return res.json({
              ok: true,
              format: plan.format,
              targetId: tab.targetId,
              url: tab.url,
              blockedByDialog: true,
              ...browserStateResponseFields(observedBrowserState),
              ...(plan.format === "aria"
                ? { nodes: [] }
                : {
                    snapshot: "",
                    refs: {},
                  }),
            });
          if (plan.format === "ai") {
            const roleSnapshotArgs = {
              cdpUrl: profileCtx.profile.cdpUrl,
              targetId: tab.targetId,
              selector: plan.selectorValue,
              frameSelector: plan.frameSelectorValue,
              refsMode: plan.refsMode,
              ssrfPolicy: ctx.state().resolved.ssrfPolicy,
              urls: plan.urls,
              timeoutMs: plan.timeoutMs,
              maxChars: plan.resolvedMaxChars,
              options: {
                interactive: plan.interactive ?? void 0,
                compact: plan.compact ?? void 0,
                maxDepth: plan.depth ?? void 0,
              },
            };
            const cdpRoleSnapshot = async () => {
              if (!tab.wsUrl) return null;
              if (plan.selectorValue || plan.frameSelectorValue) return null;
              return await snapshotRoleViaCdp({
                wsUrl: tab.wsUrl,
                urls: plan.urls,
                timeoutMs: plan.timeoutMs,
                maxChars: plan.resolvedMaxChars,
                options: {
                  interactive: plan.interactive ?? void 0,
                  compact: plan.compact ?? void 0,
                  maxDepth: plan.depth ?? void 0,
                },
              });
            };
            const pw = await getPwAiModule();
            const snap = plan.wantsRoleSnapshot
              ? pw
                ? await pw.snapshotRoleViaPlaywright(roleSnapshotArgs).catch(async (err) => {
                    const fallback = await cdpRoleSnapshot();
                    if (fallback) return fallback;
                    throw err;
                  })
                : await cdpRoleSnapshot()
              : pw
                ? await pw.snapshotAiViaPlaywright({
                    cdpUrl: profileCtx.profile.cdpUrl,
                    targetId: tab.targetId,
                    ssrfPolicy: ctx.state().resolved.ssrfPolicy,
                    urls: plan.urls,
                    timeoutMs: plan.timeoutMs,
                    ...(typeof plan.resolvedMaxChars === "number"
                      ? { maxChars: plan.resolvedMaxChars }
                      : {}),
                  })
                : await cdpRoleSnapshot();
            if (!snap) {
              await requirePwAi(res, "ai snapshot");
              return;
            }
            if (plan.labels) {
              if (!pw) return jsonError(res, 501, "Snapshot labels require Playwright.");
              const labeled = await pw.screenshotWithLabelsViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                refs: "refs" in snap ? snap.refs : {},
                type: "png",
                timeoutMs: plan.timeoutMs,
              });
              const originalMeta = labeled.annotations.length
                ? ((await getImageMetadata(labeled.buffer)) ?? void 0)
                : void 0;
              const normalized = await normalizeBrowserScreenshot(labeled.buffer, {
                maxSide: DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
                maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
              });
              const scaledAnnotations = await rescaleAnnotationsForNormalization({
                annotations: labeled.annotations,
                originalMeta,
                normalizedBuffer: normalized.buffer,
              });
              await ensureMediaDir();
              const saved = await saveMediaBuffer(
                normalized.buffer,
                normalized.contentType ?? "image/png",
                "browser",
                DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
              );
              const imageType = normalized.contentType?.includes("jpeg") ? "jpeg" : "png";
              return res.json({
                ok: true,
                format: plan.format,
                targetId: tab.targetId,
                url: tab.url,
                ...browserStateResponseFields(observedBrowserState),
                labels: true,
                labelsCount: labeled.labels,
                labelsSkipped: labeled.skipped,
                ...(scaledAnnotations && scaledAnnotations.length > 0
                  ? { annotations: scaledAnnotations }
                  : {}),
                imagePath: path.resolve(saved.path),
                imageType,
                ...snap,
              });
            }
            return res.json({
              ok: true,
              format: plan.format,
              targetId: tab.targetId,
              url: tab.url,
              ...browserStateResponseFields(observedBrowserState),
              ...snap,
            });
          }
          const usePlaywrightAriaSnapshot = shouldUsePlaywrightForAriaSnapshot({
            profile: profileCtx.profile,
            wsUrl: tab.wsUrl,
          });
          const snap = usePlaywrightAriaSnapshot
            ? (() => {
                return requirePwAi(res, "aria snapshot").then(async (pw) => {
                  if (!pw) return null;
                  return await pw.snapshotAriaViaPlaywright({
                    cdpUrl: profileCtx.profile.cdpUrl,
                    targetId: tab.targetId,
                    limit: plan.limit,
                    timeoutMs: plan.timeoutMs,
                    ssrfPolicy: ctx.state().resolved.ssrfPolicy,
                  });
                });
              })()
            : snapshotAria({
                wsUrl: tab.wsUrl ?? "",
                limit: plan.limit,
                timeoutMs: plan.timeoutMs,
              });
          const resolved = await Promise.resolve(snap);
          if (!resolved) return;
          if (!usePlaywrightAriaSnapshot)
            await pwModule?.storeAriaSnapshotRefsViaPlaywright?.({
              cdpUrl: profileCtx.profile.cdpUrl,
              targetId: tab.targetId,
              nodes: resolved.nodes,
            });
          return res.json({
            ok: true,
            format: plan.format,
            targetId: tab.targetId,
            url: tab.url,
            ...browserStateResponseFields(observedBrowserState),
            ...resolved,
          });
        },
      });
    } catch (err) {
      handleRouteError(ctx, res, err);
    }
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.storage.ts
/**
 * Browser storage and context mutation routes.
 *
 * Parses and applies cookies, local/session storage, geolocation, permissions,
 * and related browser-context mutations for the selected profile/tab.
 */
/** Parse the supported browser storage bucket names. */
function parseStorageKind(raw) {
  if (raw === "local" || raw === "session") return raw;
  return null;
}
/** Parse an optional storage mutation request from a route body. */
function parseStorageMutationRequest(kindParam, body) {
  return {
    kind: parseStorageKind(toStringOrEmpty(kindParam)),
    targetId: resolveTargetIdFromBody(body),
  };
}
/** Parse a required storage mutation request and throw on invalid input. */
function parseRequiredStorageMutationRequest(kindParam, body) {
  const parsed = parseStorageMutationRequest(kindParam, body);
  if (!parsed.kind) return null;
  return {
    kind: parsed.kind,
    targetId: parsed.targetId,
  };
}
function parseStorageMutationOrRespond(res, kindParam, body) {
  const parsed = parseRequiredStorageMutationRequest(kindParam, body);
  if (!parsed) {
    jsonError(res, 400, "kind must be local|session");
    return null;
  }
  return parsed;
}
function parseStorageMutationFromRequest(req, res) {
  const body = readBody(req);
  const parsed = parseStorageMutationOrRespond(res, req.params.kind, body);
  if (!parsed) return null;
  return {
    body,
    parsed,
  };
}
function assertRange(value, fieldName, min, max) {
  if (value === void 0) return;
  if (value < min || value > max)
    throw new Error(`${fieldName} must be between ${min} and ${max}.`);
  return value;
}
function readOptionalHttpOrigin(raw) {
  const value = toStringOrEmpty(raw);
  if (!value) return;
  const origin = readHttpOrigin(value);
  if (!origin) throw new Error("origin must be an http(s) origin");
  return origin;
}
/** Parse cookie options accepted by browser storage mutation routes. */
function parseCookieSetOptions(cookie) {
  return {
    name: toStringOrEmpty(cookie.name),
    value: toStringOrEmpty(cookie.value),
    url: toStringOrEmpty(cookie.url) || void 0,
    domain: toStringOrEmpty(cookie.domain) || void 0,
    path: toStringOrEmpty(cookie.path) || void 0,
    expires: readOptionalRouteFiniteNumber(cookie.expires, "cookie.expires"),
    httpOnly: toBoolean(cookie.httpOnly) ?? void 0,
    secure: toBoolean(cookie.secure) ?? void 0,
    sameSite:
      cookie.sameSite === "Lax" || cookie.sameSite === "None" || cookie.sameSite === "Strict"
        ? cookie.sameSite
        : void 0,
  };
}
/** Parse geolocation override options accepted by context mutation routes. */
function parseGeolocationOptions(body) {
  const clear = toBoolean(body.clear) ?? false;
  if (clear) return { clear };
  const origin = readOptionalHttpOrigin(body.origin);
  const latitude = assertRange(
    readRouteFiniteNumber(body.latitude, "latitude"),
    "latitude",
    -90,
    90,
  );
  const longitude = assertRange(
    readRouteFiniteNumber(body.longitude, "longitude"),
    "longitude",
    -180,
    180,
  );
  const accuracy = readRouteFiniteNumber(body.accuracy, "accuracy");
  if (accuracy !== void 0 && accuracy < 0) throw new Error("accuracy must be non-negative.");
  if (!clear && (latitude === void 0 || longitude === void 0))
    throw new Error("latitude and longitude are required (or set clear=true)");
  return {
    clear,
    latitude,
    longitude,
    accuracy,
    origin,
  };
}
/** Register storage and browser-context mutation endpoints. */
function registerBrowserAgentStorageRoutes(app, ctx) {
  app.get("/cookies", async (req, res) => {
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId: resolveTargetIdFromQuery(req.query),
      feature: "cookies",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw, signal }) => {
        const result = await pw.cookiesGetViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
          ...result,
        });
      },
    });
  });
  app.post("/cookies/set", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const cookie =
      body.cookie && typeof body.cookie === "object" && !Array.isArray(body.cookie)
        ? body.cookie
        : null;
    if (!cookie) return jsonError(res, 400, "cookie is required");
    let parsedCookie;
    try {
      parsedCookie = parseCookieSetOptions(cookie);
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "cookies set",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.cookiesSetViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          cookie: parsedCookie,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/cookies/clear", async (req, res) => {
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId: resolveTargetIdFromBody(readBody(req)),
      feature: "cookies clear",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.cookiesClearViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.get("/storage/:kind", async (req, res) => {
    const kind = parseStorageKind(toStringOrEmpty(req.params.kind));
    if (!kind) return jsonError(res, 400, "kind must be local|session");
    const targetId = resolveTargetIdFromQuery(req.query);
    const key = toStringOrEmpty(req.query.key);
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "storage get",
      enforceCurrentUrlAllowed: true,
      run: async ({ cdpUrl, tab, pw, signal }) => {
        const result = await pw.storageGetViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          kind,
          key: normalizeOptionalString$1(key),
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
          ...result,
        });
      },
    });
  });
  app.post("/storage/:kind/set", async (req, res) => {
    const mutation = parseStorageMutationFromRequest(req, res);
    if (!mutation) return;
    const key = toStringOrEmpty(mutation.body.key);
    if (!key) return jsonError(res, 400, "key is required");
    const value = typeof mutation.body.value === "string" ? mutation.body.value : "";
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId: mutation.parsed.targetId,
      feature: "storage set",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.storageSetViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          kind: mutation.parsed.kind,
          key,
          value,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/storage/:kind/clear", async (req, res) => {
    const mutation = parseStorageMutationFromRequest(req, res);
    if (!mutation) return;
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId: mutation.parsed.targetId,
      feature: "storage clear",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.storageClearViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          kind: mutation.parsed.kind,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/offline", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const offline = toBoolean(body.offline);
    if (offline === void 0) return jsonError(res, 400, "offline is required");
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "offline",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setOfflineViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          offline,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/headers", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const headers =
      body.headers && typeof body.headers === "object" && !Array.isArray(body.headers)
        ? body.headers
        : null;
    if (!headers) return jsonError(res, 400, "headers is required");
    const parsed = {};
    for (const [k, v] of Object.entries(headers)) if (typeof v === "string") parsed[k] = v;
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "headers",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setExtraHTTPHeadersViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          headers: parsed,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/credentials", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const clear = toBoolean(body.clear) ?? false;
    const username = toStringOrEmpty(body.username) || void 0;
    const password = readStringValue(body.password);
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "http credentials",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setHttpCredentialsViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          username,
          password,
          clear,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/geolocation", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    let geolocation;
    try {
      geolocation = parseGeolocationOptions(body);
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "geolocation",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setGeolocationViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          ...geolocation,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/media", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const schemeRaw = toStringOrEmpty(body.colorScheme);
    const colorScheme =
      schemeRaw === "dark" || schemeRaw === "light" || schemeRaw === "no-preference"
        ? schemeRaw
        : schemeRaw === "none"
          ? null
          : void 0;
    if (colorScheme === void 0)
      return jsonError(res, 400, "colorScheme must be dark|light|no-preference|none");
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "media emulation",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.emulateMediaViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          colorScheme,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/timezone", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const timezoneId = toStringOrEmpty(body.timezoneId);
    if (!timezoneId) return jsonError(res, 400, "timezoneId is required");
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "timezone",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setTimezoneViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          timezoneId,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/locale", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const locale = toStringOrEmpty(body.locale);
    if (!locale) return jsonError(res, 400, "locale is required");
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "locale",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setLocaleViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          locale,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
  app.post("/set/device", async (req, res) => {
    const body = readBody(req);
    const targetId = resolveTargetIdFromBody(body);
    const name = toStringOrEmpty(body.name);
    if (!name) return jsonError(res, 400, "name is required");
    await withPlaywrightRouteContext({
      req,
      res,
      ctx,
      targetId,
      feature: "device emulation",
      run: async ({ cdpUrl, tab, pw, signal }) => {
        await pw.setDeviceViaPlaywright({
          cdpUrl,
          targetId: tab.targetId,
          name,
        });
        signal.throwIfAborted();
        res.json({
          ok: true,
          targetId: tab.targetId,
        });
      },
    });
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.ts
/** Register all agent-facing browser route groups. */
function registerBrowserAgentRoutes(app, ctx) {
  registerBrowserAgentSnapshotRoutes(app, ctx);
  registerBrowserAgentActRoutes(app, ctx);
  registerBrowserAgentDebugRoutes(app, ctx);
  registerBrowserAgentStorageRoutes(app, ctx);
}
//#endregion
//#region extensions/browser/src/browser/chrome.graphics.ts
function asRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function readString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function readNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function readStringRecord(value) {
  const record = asRecord(value);
  if (!record) return {};
  const entries = Object.entries(record)
    .filter((entry) => typeof entry[1] === "string")
    .toSorted(([left], [right]) => left.localeCompare(right));
  return Object.fromEntries(entries);
}
function readStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function readSize(value) {
  const size = asRecord(value);
  return {
    width: readNumber(size?.width),
    height: readNumber(size?.height),
  };
}
function readDevices(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const device = asRecord(item);
    if (!device) return [];
    return [
      {
        vendorId: readNumber(device.vendorId),
        deviceId: readNumber(device.deviceId),
        vendor: readString(device.vendorString),
        device: readString(device.deviceString),
        driverVendor: readString(device.driverVendor),
        driverVersion: readString(device.driverVersion),
      },
    ];
  });
}
function readVideoDecoding(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const capability = asRecord(item);
    if (!capability) return [];
    return [
      {
        profile: readString(capability.profile),
        minResolution: readSize(capability.minResolution),
        maxResolution: readSize(capability.maxResolution),
      },
    ];
  });
}
function readVideoEncoding(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const capability = asRecord(item);
    if (!capability) return [];
    return [
      {
        profile: readString(capability.profile),
        maxResolution: readSize(capability.maxResolution),
        maxFramerateNumerator: readNumber(capability.maxFramerateNumerator),
        maxFramerateDenominator: readNumber(capability.maxFramerateDenominator),
      },
    ];
  });
}
function firstAttribute(attributes, names) {
  for (const name of names) {
    const value = readString(attributes[name]);
    if (value) return value;
  }
  return null;
}
function classifyGraphicsAcceleration(params) {
  const deviceText = params.devices
    .flatMap((device) => [device.vendor, device.device, device.driverVendor])
    .join(" ");
  const description = `${params.renderer ?? ""} ${deviceText}`.toLowerCase();
  if (
    /(swiftshader|swangle|llvmpipe|softpipe|software rasterizer|swrast|microsoft basic render driver|d3d11-warp|\bdisabled\b)/.test(
      description,
    )
  )
    return "software";
  if (description.trim()) return "hardware";
  return ["2d_canvas", "gpu_compositing", "rasterization", "webgl"]
    .map((feature) => params.featureStatus[feature]?.toLowerCase() ?? "")
    .some((status) => status.includes("software"))
    ? "software"
    : "unknown";
}
function normalizeChromeGraphicsInfo(value, observedAt = Date.now()) {
  const gpu = asRecord(asRecord(value)?.gpu);
  if (!gpu)
    return {
      status: "unavailable",
      observedAt,
      reason: "SystemInfo.getInfo returned no GPU information",
    };
  const attributes = readStringRecord(gpu.auxAttributes);
  const featureStatus = readStringRecord(gpu.featureStatus);
  const devices = readDevices(gpu.devices);
  const renderer = firstAttribute(attributes, ["glRenderer", "angleRenderer", "webglRenderer"]);
  const disabledFeatures = Object.entries(featureStatus)
    .filter(([, status]) => !status.toLowerCase().startsWith("enabled"))
    .map(([feature, status]) => ({
      feature,
      status,
    }));
  return {
    status: "available",
    observedAt,
    acceleration: classifyGraphicsAcceleration({
      renderer,
      devices,
      featureStatus,
    }),
    renderer,
    vendor: firstAttribute(attributes, ["glVendor", "angleVendor", "webglVendor"]),
    version: firstAttribute(attributes, ["glVersion", "angleVersion"]),
    backend: firstAttribute(attributes, ["glImplementationParts", "displayType"]),
    devices,
    featureStatus,
    disabledFeatures,
    driverBugWorkarounds: readStringArray(gpu.driverBugWorkarounds),
    videoDecoding: readVideoDecoding(gpu.videoDecoding),
    videoEncoding: readVideoEncoding(gpu.videoEncoding),
  };
}
async function inspectChromeGraphicsDiagnostics(cdpUrl, options = {}) {
  const observedAt = Date.now();
  try {
    const wsUrl = await getChromeWebSocketUrl(cdpUrl, options.httpTimeoutMs, options.ssrfPolicy);
    if (!wsUrl)
      return {
        status: "unavailable",
        observedAt,
        reason: "browser-level CDP WebSocket was not advertised",
      };
    return normalizeChromeGraphicsInfo(
      await withCdpSocket(wsUrl, async (send) => await send("SystemInfo.getInfo"), {
        handshakeTimeoutMs: options.handshakeTimeoutMs,
        commandTimeoutMs: options.commandTimeoutMs,
        handshakeRetries: 0,
      }),
      observedAt,
    );
  } catch (error) {
    return {
      status: "unavailable",
      observedAt,
      reason: redactCdpErrorText(error instanceof Error ? error.message : String(error)),
    };
  }
}
async function getCachedChromeGraphicsDiagnostics(running, load) {
  if (running.graphicsDiagnostics) return running.graphicsDiagnostics;
  running.graphicsDiagnosticsPending ??= load();
  try {
    const diagnostics = await running.graphicsDiagnosticsPending;
    running.graphicsDiagnostics = diagnostics;
    return diagnostics;
  } finally {
    running.graphicsDiagnosticsPending = void 0;
  }
}
function formatBrowserGraphicsSummary(diagnostics) {
  if (diagnostics.status === "unavailable") return `unavailable: ${diagnostics.reason}`;
  const device = diagnostics.devices[0];
  return [
    diagnostics.acceleration,
    diagnostics.renderer ? `renderer ${diagnostics.renderer}` : void 0,
    diagnostics.backend ? `backend ${diagnostics.backend}` : void 0,
    device?.device ? `device ${device.device}` : void 0,
    `video decode ${diagnostics.videoDecoding.length}, encode ${diagnostics.videoEncoding.length}`,
  ]
    .filter((value) => Boolean(value))
    .join("; ");
}
//#endregion
//#region extensions/browser/src/browser/doctor.ts
/**
 * Browser doctor report builder.
 *
 * Turns BrowserStatus into profile-aware diagnostic checks and fix hints for
 * CLI, tool, and HTTP doctor responses.
 */
/** Build a browser doctor report from a status response and environment facts. */
function buildBrowserDoctorReport(params) {
  const status = params.status;
  const checks = [];
  const transport =
    status.transport === "chrome-mcp"
      ? "chrome-mcp"
      : status.transport === "extension"
        ? "extension"
        : "cdp";
  checks.push({
    id: "plugin-enabled",
    label: "Browser plugin",
    status: status.enabled ? "pass" : "fail",
    summary: status.enabled ? "enabled" : "disabled",
    ...(status.enabled ? {} : { fixHint: "Enable the browser plugin and restart the Gateway." }),
  });
  checks.push({
    id: "profile",
    label: "Profile",
    status: "pass",
    summary: `${status.profile ?? "openclaw"} via ${transport}`,
  });
  if (transport === "chrome-mcp")
    checks.push({
      id: "attach-target",
      label: "Existing browser attach",
      status: status.running ? "pass" : "fail",
      summary: status.running
        ? "Chrome MCP target is reachable"
        : "Chrome MCP target is not reachable",
      ...(status.running
        ? {}
        : {
            fixHint:
              "Keep the matching Chromium browser running, enable remote debugging in chrome://inspect, and accept the attach prompt.",
          }),
    });
  else if (transport === "extension")
    checks.push({
      id: "extension-relay",
      label: "Chrome extension relay",
      status: status.running ? "pass" : "fail",
      summary: status.running
        ? "OpenClaw Chrome extension is connected"
        : "OpenClaw Chrome extension is not connected",
      ...(status.running
        ? {}
        : {
            fixHint:
              "Install the OpenClaw Chrome extension (openclaw browser extension path), run openclaw browser extension pair, and paste the pairing string into the extension popup.",
          }),
    });
  else {
    checks.push({
      id: "managed-executable",
      label: "Chromium executable",
      status: status.detectError ? "fail" : status.detectedExecutablePath ? "pass" : "warn",
      summary: status.detectError
        ? status.detectError
        : status.detectedExecutablePath
          ? `${status.detectedBrowser ?? "chromium"} at ${status.detectedExecutablePath}`
          : "No Chromium executable detected",
      ...(status.detectedExecutablePath || status.detectError
        ? {}
        : { fixHint: "Install Chrome/Chromium/Brave/Edge or set browser.executablePath." }),
    });
    const platform = params.platform ?? process.platform;
    const env = params.env ?? process.env;
    const uid = params.uid ?? process.getuid?.();
    const missingDisplay =
      platform === "linux" && !status.headless && !env.DISPLAY && !env.WAYLAND_DISPLAY;
    if (status.headlessSource === "linux-display-fallback")
      checks.push({
        id: "headless-mode",
        label: "Headless mode",
        status: "pass",
        summary: "Linux no-display fallback selected headless mode",
      });
    if (missingDisplay)
      checks.push({
        id: "display",
        label: "Display",
        status: "warn",
        summary: `No DISPLAY or WAYLAND_DISPLAY is set while headed mode is selected (${status.headlessSource ?? "unknown"})`,
        fixHint:
          "Use a desktop session, Xvfb, set OPENCLAW_BROWSER_HEADLESS=1, or remove the headed override.",
      });
    if (platform === "linux" && uid === 0 && !status.noSandbox)
      checks.push({
        id: "linux-sandbox",
        label: "Linux sandbox",
        status: "warn",
        summary: "Gateway is running as root while browser.noSandbox is false",
        fixHint: "Set browser.noSandbox: true for container/root Chromium runtimes.",
      });
    checks.push({
      id: "cdp-http",
      label: "CDP HTTP",
      status: status.cdpHttp ? "pass" : status.running ? "fail" : "info",
      summary: status.cdpHttp
        ? "CDP HTTP endpoint is reachable"
        : status.running
          ? "CDP HTTP endpoint is not reachable"
          : "Browser is not currently running",
      ...(status.cdpHttp || !status.running
        ? {}
        : {
            fixHint: "Run openclaw browser start or inspect browser.cdpUrl/CDP port reachability.",
          }),
    });
    checks.push({
      id: "cdp-websocket",
      label: "CDP WebSocket",
      status: status.cdpReady ? "pass" : status.running ? "fail" : "info",
      summary: status.cdpReady
        ? "CDP WebSocket is reachable"
        : status.running
          ? "CDP WebSocket is not reachable"
          : "Browser is launchable but not running",
      ...(status.cdpReady || !status.running
        ? {}
        : { fixHint: "Check Chrome launch logs, stale locks, proxy env, and port conflicts." }),
    });
    if (status.graphics) {
      const graphicsStatus =
        status.graphics.status === "unavailable"
          ? "warn"
          : status.graphics.acceleration === "hardware"
            ? "pass"
            : "info";
      checks.push({
        id: "graphics",
        label: "Graphics",
        status: graphicsStatus,
        summary: formatBrowserGraphicsSummary(status.graphics),
      });
    }
  }
  return {
    ok: checks.every((check) => check.status !== "fail"),
    profile: status.profile ?? "openclaw",
    transport,
    checks,
    status,
  };
}
//#endregion
//#region extensions/browser/src/browser/profiles-service.ts
/**
 * Browser profile service.
 *
 * Implements profile listing, creation, and deletion using browser config
 * mutation helpers and route context runtime state.
 */
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
/** Create a profile service bound to one browser route context. */
function createBrowserProfilesService(ctx) {
  const listProfiles = async () => {
    return await ctx.listProfiles();
  };
  const createProfile = async (params) => {
    const name = params.name.trim();
    const rawCdpUrl = normalizeOptionalString$1(params.cdpUrl);
    const rawUserDataDir = normalizeOptionalString$1(params.userDataDir);
    const normalizedUserDataDir = rawUserDataDir ? resolveUserPath(rawUserDataDir) : void 0;
    const driver = params.driver === "existing-session" ? "existing-session" : void 0;
    if (!isValidProfileName(name))
      throw new BrowserValidationError(
        "invalid profile name: use lowercase letters, numbers, and hyphens only",
      );
    const state = ctx.state();
    const resolvedProfiles = state.resolved.profiles;
    if (getOwnBrowserProfile(resolvedProfiles, name))
      throw new BrowserConflictError(`profile "${name}" already exists`);
    if (getOwnBrowserProfile(getRuntimeConfig().browser?.profiles ?? {}, name))
      throw new BrowserConflictError(`profile "${name}" already exists`);
    const explicitProfileColor =
      params.color && HEX_COLOR_RE.test(params.color) ? params.color : void 0;
    let parsedCdpUrl;
    if (normalizedUserDataDir && driver !== "existing-session")
      throw new BrowserValidationError(
        "driver=existing-session is required when userDataDir is provided",
      );
    if (normalizedUserDataDir && !fs.existsSync(normalizedUserDataDir))
      throw new BrowserValidationError(
        `browser user data directory not found: ${normalizedUserDataDir}`,
      );
    if (rawCdpUrl) {
      let parsed;
      try {
        parsed = parseBrowserHttpUrl(rawCdpUrl, "browser.profiles.cdpUrl");
        await assertCdpEndpointAllowed(parsed.normalized, state.resolved.ssrfPolicy);
      } catch (err) {
        throw new BrowserValidationError(formatErrorMessage(err));
      }
      parsedCdpUrl = parsed.normalized;
    }
    const profileConfig = await createBrowserProfileConfig({
      name,
      resolved: state.resolved,
      ...(explicitProfileColor ? { color: explicitProfileColor } : {}),
      ...(parsedCdpUrl ? { parsedCdpUrl } : {}),
      ...(normalizedUserDataDir ? { userDataDir: normalizedUserDataDir } : {}),
      ...(driver ? { driver } : {}),
    });
    if (!profileConfig)
      throw new BrowserProfileNotFoundError(`profile "${name}" not found after creation`);
    state.resolved.profiles[name] = profileConfig;
    const resolved = resolveProfile(state.resolved, name);
    if (!resolved)
      throw new BrowserProfileNotFoundError(`profile "${name}" not found after creation`);
    const capabilities = getBrowserProfileCapabilities(resolved);
    return {
      ok: true,
      profile: name,
      transport: capabilities.usesChromeMcp ? "chrome-mcp" : "cdp",
      cdpPort: capabilities.usesChromeMcp ? null : resolved.cdpPort,
      cdpUrl: resolved.cdpUrl ? (redactCdpUrl(resolved.cdpUrl) ?? null) : null,
      userDataDir: resolved.userDataDir ?? null,
      color: resolved.color,
      isRemote: !resolved.cdpIsLoopback,
    };
  };
  const listSystemProfiles$1 = async (browser) => {
    if (process.platform !== "darwin") return [];
    return listSystemProfiles(browser);
  };
  const importSystemProfile = async (params, options) => {
    const state = ctx.state();
    return await importSystemProfileCookies(params, {
      ctx,
      createProfile,
      signal: options?.signal,
      finalize: async (result) => {
        if (result.cookies.imported === 0) {
          if (params.makeDefault)
            throw new BrowserValidationError(
              "no cookies could be imported from the selected profile",
            );
          return;
        }
        if (params.makeDefault) {
          await setDefaultBrowserProfile(result.into);
          state.resolved.defaultProfile = result.into;
        }
        await recordSystemProfileImport({
          browser: result.browser,
          systemProfile: result.systemProfile,
          targetProfile: result.into,
        });
      },
    });
  };
  const getSystemProfileImportStatus = async () => {
    const enabled =
      process.platform === "darwin" &&
      getRuntimeConfig().browser?.allowSystemProfileImport !== false;
    const [systemProfiles, state, profiles] = await Promise.all([
      enabled ? listSystemProfiles$1() : Promise.resolve([]),
      readSystemProfileImportState(),
      listProfiles(),
    ]);
    return {
      enabled,
      systemProfiles,
      state: state ?? null,
      suggestedTarget: resolveSuggestedImportTarget({
        profileNames: profiles.map((profile) => profile.name),
        state,
      }),
    };
  };
  const deleteProfile = async (nameRaw) => {
    const name = nameRaw.trim();
    if (!name) throw new BrowserValidationError("profile name is required");
    if (!isValidProfileName(name)) throw new BrowserValidationError("invalid profile name");
    const state = ctx.state();
    const cfg = getRuntimeConfig();
    const profiles = cfg.browser?.profiles ?? {};
    if (name === (cfg.browser?.defaultProfile ?? state.resolved.defaultProfile))
      throw new BrowserValidationError(
        `cannot delete the default profile "${name}"; change browser.defaultProfile first`,
      );
    const runtimeProfile = getOwnBrowserProfile(profiles, name);
    if (!runtimeProfile) throw new BrowserProfileNotFoundError(`profile "${name}" not found`);
    const sourceProfile = getOwnBrowserProfile(
      getRuntimeConfigSourceSnapshot()?.browser?.profiles,
      name,
    );
    const expected = structuredClone(sourceProfile ?? runtimeProfile);
    let deleted = false;
    const resolved =
      resolveProfile(resolveBrowserConfig(cfg.browser, cfg), name) ??
      state.profiles.get(name)?.profile;
    const runtime = resolved ? getOrCreateProfileRuntime(state, resolved) : void 0;
    const persistDelete = async () => {
      await deleteBrowserProfileConfig({
        name,
        expected,
      });
      delete state.resolved.profiles[name];
      try {
        if (resolved?.cdpIsLoopback && resolved.driver === "openclaw" && !resolved.attachOnly) {
          const userDataDir = resolveOpenClawUserDataDir(name);
          const profileDir = path.dirname(userDataDir);
          if (fs.existsSync(profileDir))
            try {
              await movePathToTrash(profileDir);
              deleted = true;
            } catch {}
        }
      } finally {
        if (!runtime || state.profiles.get(name) === runtime) state.profiles.delete(name);
      }
    };
    if (resolved && runtime)
      await beginProfileTransition({
        state,
        runtime,
        reason: "profile deletion requested",
        terminal: "deleted",
        advanceConfigRevision: true,
        closeRelay: resolved.driver === "extension",
        afterCleanup: persistDelete,
        rollbackTerminalOnFailure: true,
      });
    else await persistDelete();
    return {
      ok: true,
      profile: name,
      deleted,
    };
  };
  return {
    listProfiles,
    listSystemProfiles: listSystemProfiles$1,
    createProfile,
    importSystemProfile,
    getSystemProfileImportStatus,
    deleteProfile,
  };
}
//#endregion
//#region extensions/browser/src/browser/routes/basic.ts
/**
 * Basic browser control routes.
 *
 * Serves status, doctor, start/stop, profile management, and simple health
 * endpoints for the browser control server.
 */
const STATUS_CDP_HTTP_TIMEOUT_MS = 300;
const STATUS_CDP_TRANSPORT_TIMEOUT_MS = 600;
const STATUS_GRAPHICS_COMMAND_TIMEOUT_MS = 1e3;
const STATUS_CHROME_MCP_TOTAL_TIMEOUT_MS = 7e3;
const STATUS_CHROME_MCP_TRANSPORT_TIMEOUT_MS = 5e3;
function remainingChromeMcpStatusTimeoutMs(startedAtMs) {
  return Math.max(1, STATUS_CHROME_MCP_TOTAL_TIMEOUT_MS - (Date.now() - startedAtMs));
}
async function probeChromeMcpPageReady(profileCtx, timeoutMs) {
  const abort = new AbortController();
  const timer = setTimeout(() => {
    abort.abort(
      /* @__PURE__ */ new Error(`Chrome MCP page-readiness probe timed out after ${timeoutMs}ms.`),
    );
  }, timeoutMs);
  try {
    return await profileCtx.isReachable(timeoutMs, {
      ephemeral: true,
      signal: abort.signal,
    });
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
function handleBrowserRouteError(res, err) {
  if (isProfileRestartRequiredError(err)) throw err;
  const mapped = toBrowserErrorResponse(err);
  if (mapped) return jsonBrowserError(res, mapped);
  jsonError(res, 500, String(err));
}
async function sendBasicJsonResponse(params) {
  try {
    params.res.json(await params.run());
  } catch (err) {
    return handleBrowserRouteError(params.res, err);
  }
}
async function withBasicProfileRoute(params) {
  const profileCtx = resolveProfileContext(params.req, params.res, params.ctx);
  if (!profileCtx) return;
  try {
    await params.run(profileCtx);
  } catch (err) {
    return handleBrowserRouteError(params.res, err);
  }
}
function registerBasicProfilePost(app, ctx, path, run) {
  app.post(path, async (req, res) => {
    await withBasicProfileRoute({
      req,
      res,
      ctx,
      run: async (profileCtx) =>
        await run({
          req,
          res,
          profileCtx,
        }),
    });
  });
}
async function withProfilesServiceMutation(params) {
  try {
    const service = createBrowserProfilesService(params.ctx);
    const result = await params.run(service);
    params.res.json(result);
  } catch (err) {
    return handleBrowserRouteError(params.res, err);
  }
}
async function buildBrowserStatus(ctx, profileCtx, signal) {
  signal.throwIfAborted();
  let current;
  try {
    current = ctx.state();
  } catch {
    throw new BrowserError("browser server not started", 503);
  }
  const capabilities = getBrowserProfileCapabilities(profileCtx.profile);
  const [cdpHttp, cdpReady, pageReady] = capabilities.usesChromeMcp
    ? await (async () => {
        const statusStartedAtMs = Date.now();
        const transportReady = await profileCtx.isTransportAvailable(
          STATUS_CHROME_MCP_TRANSPORT_TIMEOUT_MS,
        );
        if (!transportReady) return [false, false, false];
        return [
          transportReady,
          transportReady,
          await probeChromeMcpPageReady(
            profileCtx,
            remainingChromeMcpStatusTimeoutMs(statusStartedAtMs),
          ),
        ];
      })()
    : await (async () => {
        const [http, ready] = await Promise.all([
          profileCtx.isHttpReachable(STATUS_CDP_HTTP_TIMEOUT_MS),
          profileCtx.isTransportAvailable(STATUS_CDP_TRANSPORT_TIMEOUT_MS),
        ]);
        return [http, ready, ready];
      })();
  const profileState = current.profiles.get(profileCtx.profile.name);
  const lifecycle = profileState ? getProfileLifecycle(profileState) : null;
  const running = profileState?.running;
  const graphics =
    capabilities.mode === "local-managed" &&
    cdpReady &&
    running &&
    !lifecycle?.transitionReason &&
    !lifecycle?.blockedReason &&
    running.cdpPort === profileCtx.profile.cdpPort
      ? await getCachedChromeGraphicsDiagnostics(
          running,
          async () =>
            await inspectChromeGraphicsDiagnostics(`http://127.0.0.1:${running.cdpPort}`, {
              httpTimeoutMs: STATUS_CDP_HTTP_TIMEOUT_MS,
              handshakeTimeoutMs: STATUS_CDP_TRANSPORT_TIMEOUT_MS,
              commandTimeoutMs: STATUS_GRAPHICS_COMMAND_TIMEOUT_MS,
              ssrfPolicy: current.resolved.ssrfPolicy,
            }),
        )
      : null;
  let detectedBrowser = null;
  let detectedExecutablePath = null;
  let detectError = null;
  try {
    const detected = resolveBrowserExecutableForPlatform(current.resolved, process.platform);
    if (detected) {
      detectedBrowser = detected.kind;
      detectedExecutablePath = detected.path;
    }
  } catch (err) {
    detectError = String(err);
  }
  const configuredHeadlessMode = resolveManagedBrowserHeadlessMode(
    current.resolved,
    profileCtx.profile,
  );
  const headlessMode =
    typeof profileState?.running?.headless === "boolean"
      ? {
          headless: profileState.running.headless,
          source: profileState.running.headlessSource ?? configuredHeadlessMode.source,
        }
      : configuredHeadlessMode;
  signal.throwIfAborted();
  return {
    enabled: current.resolved.enabled,
    profile: profileCtx.profile.name,
    driver: profileCtx.profile.driver,
    transport: capabilities.usesChromeMcp
      ? "chrome-mcp"
      : capabilities.mode === "local-extension"
        ? "extension"
        : "cdp",
    running: cdpReady,
    cdpReady,
    cdpHttp,
    pageReady,
    pid: capabilities.usesChromeMcp
      ? getChromeMcpPid(profileCtx.profile.name)
      : (profileState?.running?.pid ?? null),
    cdpPort: capabilities.usesChromeMcp ? null : profileCtx.profile.cdpPort,
    cdpUrl: profileCtx.profile.cdpUrl ? (redactCdpUrl(profileCtx.profile.cdpUrl) ?? null) : null,
    chosenBrowser: profileState?.running?.exe.kind ?? null,
    detectedBrowser,
    detectedExecutablePath,
    detectError,
    userDataDir: profileState?.running?.userDataDir ?? profileCtx.profile.userDataDir ?? null,
    color: profileCtx.profile.color,
    headless: headlessMode.headless,
    headlessSource: headlessMode.source,
    noSandbox: current.resolved.noSandbox,
    executablePath: profileCtx.profile.executablePath ?? null,
    attachOnly: profileCtx.profile.attachOnly,
    graphics,
  };
}
async function runBrowserLiveProbe(profileCtx, signal) {
  const capabilities = getBrowserProfileCapabilities(profileCtx.profile);
  try {
    const tab = await profileCtx.ensureTabAvailable(void 0, { signal });
    if (capabilities.usesChromeMcp) {
      await takeChromeMcpSnapshot({
        profileName: profileCtx.profile.name,
        profile: profileCtx.profile,
        targetId: tab.targetId,
        signal,
      });
      return {
        id: "live-snapshot",
        label: "Live snapshot",
        status: "pass",
        summary: `Chrome MCP snapshot succeeded on ${tab.suggestedTargetId ?? tab.targetId}`,
      };
    }
    if (!tab.wsUrl)
      return {
        id: "live-snapshot",
        label: "Live snapshot",
        status: "warn",
        summary: "No per-tab CDP WebSocket available for the lightweight live snapshot probe",
      };
    const snap = await snapshotAria({
      wsUrl: tab.wsUrl,
      limit: 25,
    });
    return {
      id: "live-snapshot",
      label: "Live snapshot",
      status: snap.nodes.length > 0 ? "pass" : "warn",
      summary:
        snap.nodes.length > 0
          ? `CDP accessibility snapshot returned ${snap.nodes.length} nodes on ${tab.suggestedTargetId ?? tab.targetId}`
          : `CDP accessibility snapshot returned no nodes on ${tab.suggestedTargetId ?? tab.targetId}`,
    };
  } catch (err) {
    if (isProfileRestartRequiredError(err)) throw err;
    return {
      id: "live-snapshot",
      label: "Live snapshot",
      status: "fail",
      summary: String(err),
      fixHint: "Run openclaw browser start, then retry with openclaw browser doctor --deep.",
    };
  }
}
function hasQueryKey(query, key) {
  return Object.hasOwn(query ?? {}, key);
}
function parseHeadlessStartOverride(params) {
  if (!hasQueryKey(params.req.query, "headless")) return { ok: true };
  const headless = toBoolean(params.req.query.headless);
  if (typeof headless !== "boolean") {
    jsonError(params.res, 400, 'Invalid headless value. Use "true" or "false".');
    return { ok: false };
  }
  const capabilities = getBrowserProfileCapabilities(params.profileCtx.profile);
  if (
    params.profileCtx.profile.driver !== "openclaw" ||
    params.profileCtx.profile.attachOnly ||
    capabilities.isRemote
  ) {
    jsonError(
      params.res,
      400,
      `Headless start override is only supported for locally launched openclaw profiles. Profile "${params.profileCtx.profile.name}" is attach-only, remote, or existing-session.`,
    );
    return { ok: false };
  }
  return {
    ok: true,
    headless,
  };
}
/** Register basic browser lifecycle, status, doctor, and profile endpoints. */
function registerBrowserBasicRoutes(app, ctx) {
  app.get("/system-profiles", async (req, res) => {
    await sendBasicJsonResponse({
      res,
      run: async () => {
        return {
          systemProfiles: await createBrowserProfilesService(ctx).listSystemProfiles(
            toStringOrEmpty(req.query.browser) || void 0,
          ),
        };
      },
    });
  });
  app.get("/system-profile-import/status", async (_req, res) => {
    await sendBasicJsonResponse({
      res,
      run: async () => await createBrowserProfilesService(ctx).getSystemProfileImportStatus(),
    });
  });
  app.post("/system-profile-import/dismiss", async (_req, res) => {
    await sendBasicJsonResponse({
      res,
      run: async () => {
        await dismissSystemProfileImportPrompt();
        return { ok: true };
      },
    });
  });
  app.get("/profiles", async (_req, res) => {
    try {
      const profiles = await createBrowserProfilesService(ctx).listProfiles();
      res.json({ profiles });
    } catch (err) {
      return handleBrowserRouteError(res, err);
    }
  });
  app.get("/", async (req, res) => {
    const profileCtx = resolveProfileContext(req, res, ctx);
    if (!profileCtx) return;
    try {
      const status = await runProfileRouteOperation({
        profileCtx,
        signal: req.signal,
        run: async (signal) => await buildBrowserStatus(ctx, profileCtx, signal),
      });
      res.json(status);
    } catch (err) {
      return handleBrowserRouteError(res, err);
    }
  });
  app.get("/doctor", async (req, res) => {
    const profileCtx = resolveProfileContext(req, res, ctx);
    if (!profileCtx) return;
    try {
      const report = await runProfileRouteOperation({
        profileCtx,
        signal: req.signal,
        run: async (signal) => {
          const doctorReport = buildBrowserDoctorReport({
            status: await buildBrowserStatus(ctx, profileCtx, signal),
          });
          if (toBoolean(req.query.deep) === true || toBoolean(req.query.live) === true) {
            doctorReport.checks.push(await runBrowserLiveProbe(profileCtx, signal));
            doctorReport.ok = doctorReport.checks.every((check) => check.status !== "fail");
          }
          return doctorReport;
        },
      });
      res.json(report);
    } catch (err) {
      return handleBrowserRouteError(res, err);
    }
  });
  registerBasicProfilePost(app, ctx, "/start", async ({ req, res, profileCtx }) => {
    const headlessOverride = parseHeadlessStartOverride({
      req,
      res,
      profileCtx,
    });
    if (!headlessOverride.ok) return;
    await profileCtx.ensureBrowserAvailable({
      headless: headlessOverride.headless,
      ...(req.signal ? { signal: req.signal } : {}),
    });
    res.json({
      ok: true,
      profile: profileCtx.profile.name,
    });
  });
  registerBasicProfilePost(app, ctx, "/stop", async ({ res, profileCtx }) => {
    const result = await profileCtx.stopRunningBrowser();
    res.json({
      ok: true,
      stopped: result.stopped,
      profile: profileCtx.profile.name,
    });
  });
  registerBasicProfilePost(app, ctx, "/reset-profile", async ({ res, profileCtx }) => {
    const result = await profileCtx.resetProfile();
    res.json({
      ok: true,
      profile: profileCtx.profile.name,
      ...result,
    });
  });
  app.post("/profiles/create", async (req, res) => {
    const name = toStringOrEmpty(req.body?.name);
    const color = toStringOrEmpty(req.body?.color);
    const cdpUrl = toStringOrEmpty(req.body?.cdpUrl);
    const userDataDir = toStringOrEmpty(req.body?.userDataDir);
    const driver = toStringOrEmpty(req.body?.driver);
    if (!name) return jsonError(res, 400, "name is required");
    if (driver && driver !== "openclaw" && driver !== "clawd" && driver !== "existing-session")
      return jsonError(
        res,
        400,
        `unsupported profile driver "${driver}"; use "openclaw", "clawd", or "existing-session"`,
      );
    await withProfilesServiceMutation({
      res,
      ctx,
      run: async (service) =>
        await service.createProfile({
          name,
          color: color || void 0,
          cdpUrl: cdpUrl || void 0,
          userDataDir: userDataDir || void 0,
          driver:
            driver === "existing-session"
              ? "existing-session"
              : driver === "openclaw" || driver === "clawd"
                ? "openclaw"
                : void 0,
        }),
    });
  });
  app.post("/profiles/import", async (req, res) => {
    const body = req.body ?? {};
    let domains;
    try {
      domains = parseSystemProfileDomains(body.domains);
    } catch (err) {
      return jsonError(res, 400, err instanceof Error ? err.message : "invalid domains");
    }
    try {
      const result = await createBrowserProfilesService(ctx).importSystemProfile(
        {
          browser: toStringOrEmpty(body.browser) || void 0,
          systemProfile: toStringOrEmpty(body.systemProfile) || void 0,
          into: toStringOrEmpty(body.into) || void 0,
          domains,
          makeDefault: toBoolean(body.makeDefault) ?? false,
        },
        { signal: req.signal },
      );
      res.json(result);
    } catch (err) {
      return handleBrowserRouteError(res, err);
    }
  });
  app.delete("/profiles/:name", async (req, res) => {
    const name = toStringOrEmpty(req.params.name);
    if (!name) return jsonError(res, 400, "profile name is required");
    await withProfilesServiceMutation({
      res,
      ctx,
      run: async (service) => await service.deleteProfile(name),
    });
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/permissions.ts
/**
 * Browser permission routes.
 *
 * Grants required and optional browser permissions for an origin, preferring
 * Playwright context APIs when available and falling back to raw CDP.
 */
function readPermissions(raw) {
  if (!Array.isArray(raw)) return null;
  const permissions = raw
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
  if (permissions.length !== raw.length) return null;
  return uniqueStrings(permissions);
}
async function grantPermissions(params) {
  params.signal.throwIfAborted();
  const allPermissions = [
    .../* @__PURE__ */ new Set([...params.requiredPermissions, ...params.optionalPermissions]),
  ];
  const playwrightRequiredPermissions = params.requiredPermissions.map(toPlaywrightPermission);
  if (
    playwrightRequiredPermissions.every((value) => Boolean(value)) &&
    params.requiredPermissions.length > 0
  ) {
    const pw = await getPwAiModule$1({ mode: "soft" });
    if (pw)
      try {
        await (
          await pw.getPageForTargetId({
            cdpUrl: params.profileCtx.profile.cdpUrl,
            targetId: params.targetId,
            ssrfPolicy: params.ssrfPolicy,
          })
        )
          .context()
          .grantPermissions(playwrightRequiredPermissions, { origin: params.origin });
        return {
          grantedPermissions: params.requiredPermissions,
          unsupportedPermissions: params.optionalPermissions,
          grantMethod: "playwright",
        };
      } catch {
        params.signal.throwIfAborted();
      }
  }
  params.signal.throwIfAborted();
  let unsupportedPermissions = [];
  await withCdpSocket(
    params.wsUrl,
    async (send) => {
      try {
        await send("Browser.grantPermissions", {
          origin: params.origin,
          permissions: allPermissions,
        });
        return;
      } catch (error) {
        if (params.optionalPermissions.length === 0) throw error;
      }
      await send("Browser.grantPermissions", {
        origin: params.origin,
        permissions: params.requiredPermissions,
      });
      unsupportedPermissions = params.optionalPermissions;
    },
    { commandTimeoutMs: params.timeoutMs },
  );
  params.signal.throwIfAborted();
  return {
    grantedPermissions: allPermissions.filter((value) => !unsupportedPermissions.includes(value)),
    unsupportedPermissions,
    grantMethod: "cdp",
  };
}
function toPlaywrightPermission(permission) {
  switch (permission) {
    case "audioCapture":
      return "microphone";
    case "videoCapture":
      return "camera";
    default:
      return;
  }
}
/** Register permission grant endpoints on the browser control server. */
function registerBrowserPermissionRoutes(app, ctx) {
  app.post("/permissions/grant", async (req, res) => {
    const body = req.body ?? {};
    const origin = readHttpOrigin(body.origin);
    if (!origin) return jsonError(res, 400, "origin must be an http(s) origin");
    const requiredPermissions = readPermissions(body.permissions);
    if (!requiredPermissions || requiredPermissions.length === 0)
      return jsonError(res, 400, "permissions must be a non-empty string array");
    const optionalPermissions = readPermissions(body.optionalPermissions ?? []) ?? [];
    const targetId = toStringOrEmpty(body.targetId) || void 0;
    let timeoutMs;
    try {
      timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs, "timeoutMs", { minMs: 1e3 }) ?? 5e3;
    } catch (err) {
      return jsonError(res, 400, formatErrorMessage(err));
    }
    const profileCtx = getProfileContext(req, ctx);
    if ("error" in profileCtx) return jsonError(res, profileCtx.status, profileCtx.error);
    try {
      const granted = await runProfileRouteOperation({
        profileCtx,
        signal: req.signal,
        run: async (signal) => {
          await profileCtx.ensureBrowserAvailable({ signal });
          const cdpPolicy = resolveCdpControlPolicy(
            profileCtx.profile,
            ctx.state().resolved.ssrfPolicy,
          );
          const wsUrl = await getChromeWebSocketUrl(
            profileCtx.profile.cdpUrl,
            timeoutMs,
            cdpPolicy,
          );
          signal.throwIfAborted();
          if (!wsUrl) throw new BrowserProfileUnavailableError("browser CDP WebSocket unavailable");
          return await grantPermissions({
            profileCtx,
            targetId,
            wsUrl,
            origin,
            requiredPermissions,
            optionalPermissions,
            timeoutMs,
            ssrfPolicy: cdpPolicy,
            signal,
          });
        },
      });
      return res.json({
        ok: true,
        origin,
        ...granted,
      });
    } catch (error) {
      if (isProfileRestartRequiredError(error)) throw error;
      const mapped = toBrowserErrorResponse(error);
      if (mapped) return jsonBrowserError(res, mapped);
      return jsonError(res, 500, error instanceof Error ? error.message : String(error));
    }
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/tabs.ts
/**
 * Browser tab management routes.
 *
 * Lists, opens, focuses, closes, and mutates tabs while applying navigation
 * policy checks and profile reachability probes.
 */
const DEFAULT_TAB_REACHABILITY_TIMEOUT_MS = 300;
const TAB_REACHABILITY_RETRY_DELAY_MS = 250;
function handleTabsRouteError(ctx, res, err, opts) {
  if (isProfileRestartRequiredError(err)) throw err;
  if (opts?.mapTabError) {
    const mapped = ctx.mapTabError(err);
    if (mapped) return jsonBrowserError(res, mapped);
  }
  return jsonError(res, 500, String(err));
}
async function runTabsProfileRoute(params) {
  const profileCtx = resolveProfileContext(params.req, params.res, params.ctx);
  if (!profileCtx) return;
  try {
    return await runProfileRouteOperation({
      profileCtx,
      signal: params.req.signal,
      run: async (signal) => await params.run(profileCtx, signal),
    });
  } catch (err) {
    handleTabsRouteError(params.ctx, params.res, err, { mapTabError: params.mapTabError });
    return;
  }
}
function resolveTabReachabilityTimeoutMs(ctx, profileCtx) {
  if (!getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp)
    return DEFAULT_TAB_REACHABILITY_TIMEOUT_MS;
  return (
    clampPositiveTimerTimeoutMs(ctx.state().resolved.actionTimeoutMs) ??
    DEFAULT_TAB_REACHABILITY_TIMEOUT_MS
  );
}
async function checkTabReachability(ctx, profileCtx, signal) {
  const timeoutMs = resolveTabReachabilityTimeoutMs(ctx, profileCtx);
  return signal
    ? await profileCtx.isReachable(timeoutMs, { signal })
    : await profileCtx.isReachable(timeoutMs);
}
async function ensureBrowserRunning(ctx, profileCtx, signal) {
  let isReachable = await checkTabReachability(ctx, profileCtx, signal);
  if (!isReachable && !signal?.aborted) {
    await new Promise((resolve) => {
      setTimeout(resolve, TAB_REACHABILITY_RETRY_DELAY_MS);
    });
    signal?.throwIfAborted();
    isReachable = await checkTabReachability(ctx, profileCtx, signal);
  }
  if (!isReachable) throw new BrowserProfileUnavailableError("browser not running");
}
async function redactBlockedTabUrls(params) {
  if (!params.navigationPolicy.ssrfPolicy) return params.tabs;
  const redactedTabs = [];
  for (const tab of params.tabs)
    try {
      await assertBrowserNavigationResultAllowed({
        url: tab.url,
        ...params.navigationPolicy,
      });
      redactedTabs.push(tab);
    } catch {
      redactedTabs.push({
        ...tab,
        url: "",
      });
    }
  return redactedTabs;
}
function resolveIndexedTab(tabs, index) {
  return typeof index === "number" ? tabs[index] : tabs.at(0);
}
function parseRequiredTargetId(res, rawTargetId) {
  const targetId = toStringOrEmpty(rawTargetId);
  if (!targetId) {
    jsonError(res, 400, "targetId is required");
    return null;
  }
  return targetId;
}
function readOptionalTabLabel(body) {
  return toStringOrEmpty(body?.label) || void 0;
}
function readTabIndex(res, body, opts) {
  const record = body && typeof body === "object" ? body : {};
  if (!Object.hasOwn(record, "index")) {
    if (opts?.required) {
      jsonError(res, 400, "index is required");
      return null;
    }
    return;
  }
  if (record.index == null) {
    jsonError(res, 400, "index must be a non-negative integer");
    return null;
  }
  try {
    return readRouteNonNegativeInteger(record.index, "index", {
      invalidMessage: "index must be a non-negative integer",
    });
  } catch (error) {
    jsonError(res, 400, error instanceof Error ? error.message : String(error));
    return null;
  }
}
async function runTabTargetMutation(params) {
  const result = await runTabsProfileRoute({
    req: params.req,
    res: params.res,
    ctx: params.ctx,
    mapTabError: true,
    run: async (profileCtx, signal) => {
      await ensureBrowserRunning(params.ctx, profileCtx, signal);
      await params.mutate(profileCtx, params.targetId, signal);
      return { ok: true };
    },
  });
  if (result) params.res.json(result);
}
/** Register tab listing and mutation endpoints on the browser control server. */
function registerBrowserTabRoutes(app, ctx) {
  app.get("/tabs", async (req, res) => {
    const result = await runTabsProfileRoute({
      req,
      res,
      ctx,
      run: async (profileCtx, signal) => {
        if (!(await checkTabReachability(ctx, profileCtx, signal)))
          return {
            running: false,
            tabs: [],
          };
        const tabs = await redactBlockedTabUrls({
          tabs: await profileCtx.listTabs(),
          navigationPolicy: browserNavigationPolicyForProfile(ctx, profileCtx),
        });
        signal.throwIfAborted();
        return {
          running: true,
          tabs,
        };
      },
    });
    if (result) res.json(result);
  });
  app.post("/tabs/open", async (req, res) => {
    const url = toStringOrEmpty(req.body?.url);
    const label = readOptionalTabLabel(req.body);
    if (!url) return jsonError(res, 400, "url is required");
    const result = await runTabsProfileRoute({
      req,
      res,
      ctx,
      mapTabError: true,
      run: async (profileCtx, signal) => {
        await assertBrowserNavigationAllowed({
          url,
          ...browserNavigationPolicyForProfile(ctx, profileCtx),
        });
        await profileCtx.ensureBrowserAvailable({ signal });
        return await profileCtx.openTab(url, { label });
      },
    });
    if (result) res.json(result);
  });
  app.post("/tabs/focus", async (req, res) => {
    const targetId = parseRequiredTargetId(res, req.body?.targetId);
    if (!targetId) return;
    await runTabTargetMutation({
      req,
      res,
      ctx,
      targetId,
      mutate: async (profileCtx, id) => {
        const tabs = await profileCtx.listTabs();
        const resolved = resolveTargetIdFromTabs(id, tabs);
        if (!resolved.ok) {
          if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
          throw new BrowserTabNotFoundError({ input: id });
        }
        const tab = tabs.find((currentTab) => currentTab.targetId === resolved.targetId);
        if (!tab) throw new BrowserTabNotFoundError({ input: id });
        const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
        if (ssrfPolicyOpts.ssrfPolicy)
          await assertBrowserNavigationResultAllowed({
            url: tab.url,
            ...ssrfPolicyOpts,
          });
        await profileCtx.focusTab(resolved.targetId, { exactTargetId: true });
      },
    });
  });
  app.delete("/tabs/:targetId", async (req, res) => {
    const targetId = parseRequiredTargetId(res, req.params.targetId);
    if (!targetId) return;
    const targetIdMode = toStringOrEmpty(req.query.targetIdMode);
    if (targetIdMode && targetIdMode !== "raw")
      return jsonError(res, 400, 'targetIdMode must be "raw"');
    await runTabTargetMutation({
      req,
      res,
      ctx,
      targetId,
      mutate: async (profileCtx, id) => {
        await profileCtx.closeTab(id, targetIdMode === "raw" ? { exactTargetId: true } : void 0);
      },
    });
  });
  app.post("/tabs/action", async (req, res) => {
    const action = toStringOrEmpty(req.body?.action);
    if (
      action !== "list" &&
      action !== "new" &&
      action !== "label" &&
      action !== "close" &&
      action !== "select"
    )
      return jsonError(res, 400, "unknown tab action");
    const targetId = action === "label" ? parseRequiredTargetId(res, req.body?.targetId) : void 0;
    if (action === "label" && !targetId) return;
    const label = action === "label" || action === "new" ? readOptionalTabLabel(req.body) : void 0;
    if (action === "label" && !label) return jsonError(res, 400, "label is required");
    const index =
      action === "close"
        ? readTabIndex(res, req.body)
        : action === "select"
          ? readTabIndex(res, req.body, { required: true })
          : void 0;
    if ((action === "close" && index === null) || (action === "select" && index == null)) return;
    const result = await runTabsProfileRoute({
      req,
      res,
      ctx,
      mapTabError: true,
      run: async (profileCtx, signal) => {
        if (action === "list") {
          if (!(await checkTabReachability(ctx, profileCtx, signal)))
            return {
              ok: true,
              tabs: [],
            };
          const tabs = await redactBlockedTabUrls({
            tabs: await profileCtx.listTabs(),
            navigationPolicy: browserNavigationPolicyForProfile(ctx, profileCtx),
          });
          signal.throwIfAborted();
          return {
            ok: true,
            tabs,
          };
        }
        if (action === "new") {
          await profileCtx.ensureBrowserAvailable({ signal });
          return {
            ok: true,
            tab: await profileCtx.openTab("about:blank", { label }),
          };
        }
        if (action === "label") {
          await ensureBrowserRunning(ctx, profileCtx, signal);
          return {
            ok: true,
            tab: await profileCtx.labelTab(targetId, label),
          };
        }
        if (action === "close") {
          await ensureBrowserRunning(ctx, profileCtx, signal);
          const target = resolveIndexedTab(await profileCtx.listTabs(), index);
          if (!target) throw new BrowserTabNotFoundError();
          await profileCtx.closeTab(target.targetId, { exactTargetId: true });
          return {
            ok: true,
            targetId: target.targetId,
          };
        }
        await ensureBrowserRunning(ctx, profileCtx, signal);
        const target = (await profileCtx.listTabs())[index];
        if (!target) throw new BrowserTabNotFoundError();
        const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
        if (ssrfPolicyOpts.ssrfPolicy)
          await assertBrowserNavigationResultAllowed({
            url: target.url,
            ...ssrfPolicyOpts,
          });
        await profileCtx.focusTab(target.targetId, { exactTargetId: true });
        return {
          ok: true,
          targetId: target.targetId,
        };
      },
    });
    if (result) res.json(result);
  });
}
//#endregion
//#region extensions/browser/src/browser/routes/index.ts
/** Register every browser control route group. */
function registerBrowserRoutes(app, ctx) {
  registerBrowserBasicRoutes(app, ctx);
  registerBrowserTabRoutes(app, ctx);
  registerBrowserPermissionRoutes(app, ctx);
  registerBrowserAgentRoutes(app, ctx);
}
//#endregion
export {
  DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE as a,
  DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES as i,
  formatBrowserGraphicsSummary as n,
  normalizeBrowserScreenshot as o,
  parseSystemProfileDomains as r,
  registerBrowserRoutes as t,
};
