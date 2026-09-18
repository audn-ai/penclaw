import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { l as resolveBrowserActRequestTimeoutMs } from "./act-policy-DJo1OgjZ.js";
import {
  n as describeBrowserTool,
  t as BrowserToolSchema,
} from "./browser-tool.schema-CbcSu9RM.js";
import { W as withTimeout } from "./cdp.helpers-ChuUODxP.js";
import { j as parseBrowserNavigationUrl } from "./chrome-C-Qf8Isl.js";
import {
  c as imageResultFromFile,
  h as readPositiveIntegerParam,
  p as readNonNegativeIntegerParam,
  y as readStringParam,
} from "./common-DyDSUect.js";
import {
  a as resolveProfile,
  l as resolveExistingUploadPaths,
  r as resolveBrowserConfig,
} from "./config-CzdiqFrD.js";
import { n as DEFAULT_AI_SNAPSHOT_MAX_CHARS } from "./constants-C2_ZjRRD.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-B9nZG5m4.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import {
  a as browserPdfSave,
  c as browserArmFileChooser,
  d as browserScreenshotAction,
  f as browserWaitForDownload,
  i as browserConsoleMessages,
  l as browserDownload,
  m as parseBrowserProxyFailure,
  n as applyBrowserProxyPaths,
  o as browserAct,
  p as BROWSER_PROXY_ERROR_ENVELOPE,
  r as persistBrowserProxyFiles,
  s as browserArmDialog,
  u as browserNavigate,
} from "./core-api-l2pOnPUn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./media-store-CLUM1Syr.js";
import {
  a as resolveRequestedBrowserProfile,
  n as isBrowserHostLocalRoute,
  r as isPersistentBrowserProfileMutation,
  t as createBrowserRouteDispatcher,
} from "./dispatcher-DYywQike.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { a as wrapExternalContent } from "./external-content-rRQGoatE.js";
import "./param-readers-8wnI_A3p.js";
import { t as callGatewayTool } from "./gateway-Dyh1k_4Q.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  l as resolveNodeCommandAllowlist,
  o as isNodeCommandAllowed,
} from "./node-command-policy-pdhFRd-t.js";
import {
  a as selectDefaultNodeFromList,
  i as resolveNodeIdFromList,
  t as listNodes,
} from "./nodes-utils-CLhkTx8I.js";
import {
  i as safeParseJson,
  n as respondUnavailableOnNodeInvokeError,
} from "./nodes.helpers-eTJDH6p7.js";
import { f as clampTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { n as createBrowserControlContext } from "./plugin-enabled-C1NU0TDI.js";
import { n as startLazyPluginServiceModule } from "./plugin-runtime-Cwru8G47.js";
import "./sdk-setup-tools-D5_dW0Tr.js";
import {
  i as DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
  o as normalizeBrowserScreenshot,
  r as parseSystemProfileDomains,
} from "./routes-FohuCP_M.js";
import { t as describeImageFile } from "./runtime-BzZe4Z88.js";
import { g as getBrowserProfileCapabilities } from "./server-context.lifecycle-CPismpkV.js";
import {
  C as fetchBrowserJson,
  S as BrowserServiceError,
  _ as browserStatus,
  a as untrackSessionBrowserTab,
  d as browserImportProfile,
  f as browserOpenTab,
  g as browserStart,
  h as browserSnapshot,
  i as trackSessionBrowserTab,
  l as browserDoctor,
  o as browserCloseTab,
  p as browserProfiles,
  r as touchSessionBrowserTab,
  u as browserFocusTab,
  v as browserStop,
  x as browserTabs,
  y as browserSystemProfiles,
} from "./session-tab-registry-RbALbK2T.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
//#region extensions/browser/src/browser-node-fallback.ts
/**
 * Browser-node fallback classification.
 *
 * Only the node host's explicit pre-dispatch reachability failure is safe to
 * retry on the Gateway host. Other failures may follow a mutating action.
 */
const BROWSER_CONTROL_HOST_UNREACHABLE = /\bbrowser control host is not reachable\b/i;
function isBrowserControlHostUnavailableError(value) {
  const seen = /* @__PURE__ */ new Set();
  const visit = (candidate, depth) => {
    if (typeof candidate === "string") return BROWSER_CONTROL_HOST_UNREACHABLE.test(candidate);
    if (!candidate || typeof candidate !== "object" || depth > 3 || seen.has(candidate))
      return false;
    seen.add(candidate);
    const record = candidate;
    if (typeof record.message === "string" && BROWSER_CONTROL_HOST_UNREACHABLE.test(record.message))
      return true;
    return [record.error, record.cause, record.details, record.nodeError].some((entry) =>
      visit(entry, depth + 1),
    );
  };
  return visit(value, 0);
}
//#endregion
//#region extensions/browser/src/browser/screenshot-sharing.ts
/** Stages a bounded screenshot copy in the sandbox-authorized outbound store. */
async function stageBrowserScreenshotForSharing(filePath, maxDimensionPx) {
  const normalized = await normalizeBrowserScreenshot(await readFile(filePath), {
    maxSide: maxDimensionPx ?? 2e3,
    maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
  });
  return (
    await saveMediaBuffer(
      normalized.buffer,
      normalized.contentType,
      "outbound",
      DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
      path.basename(filePath),
    )
  ).path;
}
//#endregion
//#region extensions/browser/src/browser-tool.runtime.ts
/**
 * Runtime dependency barrel for the Browser agent tool.
 *
 * Kept separate from browser-tool.ts so tests can mock the tool boundary while
 * production still imports SDK helpers and browser client actions lazily.
 */
/** Resolve global image downscaling for screenshots returned to agent tools. */
function resolveRuntimeImageSanitization() {
  const configured = getRuntimeConfig().agents?.defaults?.imageMaxDimensionPx;
  if (typeof configured !== "number" || !Number.isFinite(configured)) return;
  return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
//#endregion
//#region extensions/browser/src/browser-node-proxy.ts
const logger$1 = createSubsystemLogger("browser");
const DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 2e4;
const BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS = 5e3;
var BrowserNodeControlHostUnavailableError = class extends Error {
  constructor(cause) {
    super("auto-selected browser node control host unavailable", { cause });
    this.name = "BrowserNodeControlHostUnavailableError";
  }
};
function unwrapBrowserProxyPayload(payload) {
  if (payload?.payload !== void 0) return payload.payload;
  if (typeof payload?.payloadJSON !== "string" || !payload.payloadJSON.trim()) return null;
  try {
    return JSON.parse(payload.payloadJSON);
  } catch {
    return null;
  }
}
async function callBrowserProxy(params) {
  const proxyTimeoutMs =
    typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
      ? Math.max(1, Math.floor(params.timeoutMs))
      : DEFAULT_BROWSER_PROXY_TIMEOUT_MS;
  const gatewayTimeoutMs = proxyTimeoutMs + BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS;
  let payload;
  try {
    payload = await callGatewayTool(
      "node.invoke",
      { timeoutMs: gatewayTimeoutMs },
      {
        nodeId: params.nodeId,
        command: "browser.proxy",
        timeoutMs: gatewayTimeoutMs,
        params: {
          method: params.method,
          path: params.path,
          query: params.query,
          body: params.body,
          timeoutMs: proxyTimeoutMs,
          profile: params.profile,
          errorEnvelope: BROWSER_PROXY_ERROR_ENVELOPE,
        },
        idempotencyKey: crypto.randomUUID(),
      },
      { scopes: ["operator.admin"] },
    );
  } catch (error) {
    if (params.markControlHostUnavailable && isBrowserControlHostUnavailableError(error))
      throw new BrowserNodeControlHostUnavailableError(error);
    throw error;
  }
  const parsed = unwrapBrowserProxyPayload(payload);
  const failure = parseBrowserProxyFailure(parsed);
  if (failure) {
    const { status, body } = failure.error;
    throw new BrowserServiceError(body.error, "reason" in body ? body : void 0, status);
  }
  if (!parsed || typeof parsed !== "object" || !("result" in parsed))
    throw new Error("browser proxy failed");
  return parsed;
}
async function callLocalBrowserControl(params) {
  const url = new URL(params.path, "http://localhost");
  for (const [key, value] of Object.entries(params.query ?? {}))
    if (value !== void 0) url.searchParams.set(key, String(value));
  if (params.profile) url.searchParams.set("profile", params.profile);
  return await fetchBrowserJson(`${url.pathname}${url.search}`, {
    method: params.method,
    body: params.body === void 0 ? void 0 : JSON.stringify(params.body),
    timeoutMs: params.timeoutMs,
  });
}
function createBrowserNodeProxyRequest(params) {
  let hostFallbackActive = false;
  const dispatch = async (request) => {
    if (hostFallbackActive) return await callLocalBrowserControl(request);
    try {
      const proxy = await callBrowserProxy({
        nodeId: params.nodeTarget.nodeId,
        markControlHostUnavailable: params.allowAutomaticHostFallback,
        ...request,
      });
      const mapping = await persistBrowserProxyFiles(proxy.files);
      applyBrowserProxyPaths(proxy.result, mapping);
      return proxy.result;
    } catch (error) {
      if (
        !params.allowAutomaticHostFallback ||
        !(error instanceof BrowserNodeControlHostUnavailableError)
      )
        throw error;
      hostFallbackActive = true;
      logger$1.warn(
        `browser node ${params.nodeTarget.label ?? params.nodeTarget.nodeId} control host unavailable; falling back to Gateway host`,
      );
      return await callLocalBrowserControl(request);
    }
  };
  return Object.assign(dispatch, { isHostFallbackActive: () => hostFallbackActive });
}
//#endregion
//#region extensions/browser/src/browser/vision.ts
/**
 * Browser screenshot description helpers built on the shared media image
 * understanding contract. No browser-specific model registry lives here.
 */
/** Default prompt for turning browser screenshots into text-only page context. */
const DEFAULT_BROWSER_SCREENSHOT_DESCRIPTION_PROMPT =
  "Describe what is visible in this browser screenshot. Capture page layout, headings, primary content blocks, visible text, and notable interactive elements so a text-only assistant can reason about the page.";
function normalizeActiveModel(activeModel) {
  const provider = activeModel?.provider?.trim();
  if (!provider) return;
  const model = activeModel?.model?.trim();
  return model
    ? {
        provider,
        model,
      }
    : { provider };
}
async function resolveImageUnderstandingFilePath(ctx, deps) {
  const maxDimensionPx = ctx.imageSanitization?.maxDimensionPx;
  if (typeof maxDimensionPx !== "number" || !Number.isFinite(maxDimensionPx)) return ctx.filePath;
  const source = await readFile(ctx.filePath);
  const normalized = await deps.normalizeBrowserScreenshot(source, {
    maxSide: Math.max(1, Math.floor(maxDimensionPx)),
  });
  if (normalized.buffer === source) return ctx.filePath;
  return (
    await deps.saveMediaBuffer(normalized.buffer, normalized.contentType ?? "image/jpeg", "browser")
  ).path;
}
/** Produces a text description for a browser screenshot, or null when no text was produced. */
async function describeBrowserScreenshot(ctx, deps) {
  const filePath = await resolveImageUnderstandingFilePath(ctx, deps);
  const described = await deps.describeImageFile({
    filePath,
    cfg: ctx.cfg,
    prompt: DEFAULT_BROWSER_SCREENSHOT_DESCRIPTION_PROMPT,
    agentDir: ctx.agentDir,
    workspaceDir: ctx.workspaceDir,
    activeModel: normalizeActiveModel(ctx.activeModel),
    scopeContext: ctx.mediaScope,
  });
  const text = described.text?.trim();
  if (!text) return null;
  return {
    text,
    provider: described.provider,
    model: described.model,
    decision: described.decision,
  };
}
/** Neutralizes model-generated MEDIA directives before feeding text back to tools. */
function neutralizeMediaDirectives(text) {
  if (!text || !/media:/i.test(text)) return text;
  const lines = text.split("\n");
  let changed = false;
  for (const [i, line] of lines.entries()) {
    const leading = line.length - line.trimStart().length;
    const rest = line.slice(leading);
    if (/^MEDIA:/i.test(rest)) {
      lines[i] = `${line.slice(0, leading)}[neutralized] ${rest}`;
      changed = true;
    }
  }
  return changed ? lines.join("\n") : text;
}
//#endregion
//#region extensions/browser/src/browser-tool.actions.ts
const browserToolActionDeps = {
  browserAct,
  browserConsoleMessages,
  browserDownload,
  browserSnapshot,
  browserTabs,
  browserWaitForDownload,
  getRuntimeConfig,
  imageResultFromFile,
};
const BROWSER_DOWNLOAD_REQUEST_TIMEOUT_SLACK_MS = 5e3;
function normalizePositiveTimeoutMs(value) {
  return readPositiveIntegerParam({ value }, "value", {
    message: "timeoutMs must be a positive integer.",
  });
}
function normalizeNonNegativeDurationMs(value) {
  return readNonNegativeIntegerParam({ value }, "value", {
    message: "timeMs must be a non-negative integer.",
  });
}
function supportsBrowserActTimeout(request) {
  switch (request.kind) {
    case "click":
    case "type":
    case "hover":
    case "scrollIntoView":
    case "drag":
    case "select":
    case "fill":
    case "evaluate":
    case "wait":
      return true;
    default:
      return false;
  }
}
function existingSessionRejectsActTimeout(request) {
  switch (request.kind) {
    case "type":
    case "hover":
    case "scrollIntoView":
    case "drag":
    case "select":
    case "fill":
      return true;
    default:
      return false;
  }
}
function usesExistingSessionProfile(profileName) {
  const cfg = browserToolActionDeps.getRuntimeConfig();
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  const profile = resolveProfile(resolved, profileName ?? resolved.defaultProfile);
  return profile ? getBrowserProfileCapabilities(profile).usesChromeMcp : false;
}
function withConfiguredActTimeout(request, profileName) {
  const typedRequest = request;
  if (normalizePositiveTimeoutMs(typedRequest.timeoutMs) !== void 0) return request;
  if (!supportsBrowserActTimeout(request)) return request;
  if (existingSessionRejectsActTimeout(request) && usesExistingSessionProfile(profileName))
    return request;
  const configuredTimeout =
    normalizePositiveTimeoutMs(browserToolActionDeps.getRuntimeConfig().browser?.actionTimeoutMs) ??
    6e4;
  return {
    ...typedRequest,
    timeoutMs: configuredTimeout,
  };
}
function resolveActProxyTimeoutMs(request) {
  return resolveBrowserActRequestTimeoutMs(request);
}
function formatAgentTab(tab) {
  if (!tab || typeof tab !== "object") return { value: tab };
  const source = tab;
  const targetId = readStringValue(source.targetId);
  const tabId = readStringValue(source.tabId);
  const label = readStringValue(source.label);
  const suggestedTargetId = readStringValue(source.suggestedTargetId) ?? label ?? tabId ?? targetId;
  return {
    ...(suggestedTargetId ? { suggestedTargetId } : {}),
    ...(tabId ? { tabId } : {}),
    ...(label ? { label } : {}),
    title: source.title,
    url: source.url,
    type: source.type,
    ...(targetId ? { targetId } : {}),
    ...(source.wsUrl ? { wsUrl: source.wsUrl } : {}),
  };
}
function wrapBrowserExternalJson(params) {
  return {
    wrappedText: wrapExternalContent(
      JSON.stringify(
        params.payload,
        (_key, value) => (typeof value === "string" ? neutralizeMediaDirectives(value) : value),
        2,
      ),
      {
        source: "browser",
        includeWarning: params.includeWarning ?? true,
      },
    ),
    safeDetails: {
      ok: true,
      externalContent: {
        untrusted: true,
        source: "browser",
        kind: params.kind,
        wrapped: true,
      },
    },
  };
}
function formatTabsToolResult(tabs) {
  const formattedTabs = tabs.map((tab) => formatAgentTab(tab));
  const wrapped = wrapBrowserExternalJson({
    kind: "tabs",
    payload: { tabs: formattedTabs },
    includeWarning: false,
  });
  return {
    content: [
      {
        type: "text",
        text: wrapped.wrappedText,
      },
    ],
    details: {
      ...wrapped.safeDetails,
      tabCount: tabs.length,
      tabs: formattedTabs,
    },
  };
}
function formatConsoleToolResult(result) {
  const wrapped = wrapBrowserExternalJson({
    kind: "console",
    payload: result,
    includeWarning: false,
  });
  return {
    content: [
      {
        type: "text",
        text: wrapped.wrappedText,
      },
    ],
    details: {
      ...wrapped.safeDetails,
      targetId: readStringValue(result.targetId),
      url: readStringValue(result.url),
      messageCount: Array.isArray(result.messages) ? result.messages.length : void 0,
    },
  };
}
function isChromeStaleTargetError(profile, err) {
  if (!profile) return false;
  const status = err && typeof err === "object" && "status" in err ? err.status : null;
  const msg = String(err);
  const isTabNotFound = (status === 404 || msg.includes("404:")) && msg.includes("tab not found");
  if (profile === "user") return isTabNotFound;
  const cfg = browserToolActionDeps.getRuntimeConfig();
  const browserProfile = resolveProfile(resolveBrowserConfig(cfg.browser, cfg), profile);
  if (!browserProfile || !getBrowserProfileCapabilities(browserProfile).usesChromeMcp) return false;
  return isTabNotFound;
}
function replaceStaleTargetIdInActRequest(request, targetId) {
  if (!normalizeOptionalString(request.targetId) || !targetId) return null;
  return {
    ...request,
    targetId,
  };
}
function canRetryChromeActAfterSoleTargetRefresh(request) {
  if (request.kind !== "wait" || normalizeNonNegativeDurationMs(request.timeMs) === void 0)
    return false;
  return [
    request.fn,
    request.text,
    request.textGone,
    request.selector,
    request.url,
    request.loadState,
  ].every((value) => !normalizeOptionalString(value));
}
function isAriaRefsUnsupportedError(err) {
  const msg = String(err).toLowerCase();
  return msg.includes("refs=aria") && msg.includes("not support");
}
function withRoleRefsFallback(snapshotQuery) {
  return {
    ...snapshotQuery,
    refs: "role",
  };
}
async function executeTabsAction(params) {
  const { baseUrl, profile, timeoutMs, proxyRequest } = params;
  if (proxyRequest)
    return formatTabsToolResult(
      (
        await proxyRequest({
          method: "GET",
          path: "/tabs",
          profile,
          timeoutMs,
        })
      ).tabs ?? [],
    );
  return formatTabsToolResult(
    await browserToolActionDeps.browserTabs(baseUrl, {
      profile,
      timeoutMs,
    }),
  );
}
/** Execute and format browser snapshots for agent consumption. */
async function executeSnapshotAction(params) {
  const { input, baseUrl, profile, proxyRequest } = params;
  const snapshotDefaults = browserToolActionDeps.getRuntimeConfig().browser?.snapshotDefaults;
  const format =
    input.snapshotFormat === "ai" ? "ai" : input.snapshotFormat === "aria" ? "aria" : void 0;
  const formatExplicit = format !== void 0;
  const mode =
    input.mode === "efficient"
      ? "efficient"
      : !formatExplicit && format !== "aria" && snapshotDefaults?.mode === "efficient"
        ? "efficient"
        : void 0;
  const labels = typeof input.labels === "boolean" ? input.labels : void 0;
  const urls = typeof input.urls === "boolean" ? input.urls : void 0;
  const refs = input.refs === "aria" || input.refs === "role" ? input.refs : void 0;
  const hasMaxChars = Object.hasOwn(input, "maxChars");
  const targetId = normalizeOptionalString(input.targetId);
  const limit = readPositiveIntegerParam(input, "limit", {
    message: "limit must be a positive integer.",
  });
  const maxCharsRaw = readNonNegativeIntegerParam(input, "maxChars", {
    message: "maxChars must be a non-negative integer.",
  });
  const maxChars = maxCharsRaw !== void 0 && maxCharsRaw > 0 ? maxCharsRaw : void 0;
  const interactive = typeof input.interactive === "boolean" ? input.interactive : void 0;
  const compact = typeof input.compact === "boolean" ? input.compact : void 0;
  const depth = readNonNegativeIntegerParam(input, "depth", {
    message: "depth must be a non-negative integer.",
  });
  const selector = normalizeOptionalString(input.selector);
  const frame = normalizeOptionalString(input.frame);
  const resolvedMaxChars =
    format === "ai"
      ? hasMaxChars
        ? maxChars
        : mode === "efficient"
          ? void 0
          : DEFAULT_AI_SNAPSHOT_MAX_CHARS
      : hasMaxChars
        ? maxChars
        : void 0;
  const snapshotTimeoutMs =
    readPositiveIntegerParam(input, "timeoutMs", {
      message: "timeoutMs must be a positive integer.",
    }) ?? 2e4;
  const snapshotQuery = {
    ...(format ? { format } : {}),
    targetId,
    limit,
    ...(typeof resolvedMaxChars === "number" ? { maxChars: resolvedMaxChars } : {}),
    refs,
    interactive,
    compact,
    depth,
    selector,
    frame,
    labels,
    urls,
    mode,
    timeoutMs: snapshotTimeoutMs,
  };
  let refsFallback;
  const readSnapshot = async (query) =>
    proxyRequest
      ? await proxyRequest({
          method: "GET",
          path: "/snapshot",
          profile,
          query,
          timeoutMs: snapshotTimeoutMs,
        })
      : await browserToolActionDeps.browserSnapshot(baseUrl, {
          ...query,
          profile,
        });
  let snapshot;
  try {
    snapshot = await readSnapshot(snapshotQuery);
  } catch (err) {
    if (refs !== "aria" || !isAriaRefsUnsupportedError(err)) throw err;
    refsFallback = "role";
    snapshot = await readSnapshot(withRoleRefsFallback(snapshotQuery));
  }
  params.onTabActivity?.(readStringValue(snapshot.targetId) ?? targetId);
  if (snapshot.format === "ai") {
    const dialogStateFields = {
      ...(snapshot.blockedByDialog ? { blockedByDialog: true } : {}),
      ...(snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {}),
    };
    if (snapshot.blockedByDialog) {
      const wrapped = wrapBrowserExternalJson({
        kind: "snapshot",
        payload: {
          format: snapshot.format,
          targetId: snapshot.targetId,
          url: snapshot.url,
          ...dialogStateFields,
        },
      });
      return {
        content: [
          {
            type: "text",
            text: wrapped.wrappedText,
          },
        ],
        details: {
          ...wrapped.safeDetails,
          format: snapshot.format,
          targetId: snapshot.targetId,
          url: snapshot.url,
          ...dialogStateFields,
        },
      };
    }
    const wrappedSnapshot = wrapExternalContent(
      neutralizeMediaDirectives(snapshot.snapshot ?? ""),
      {
        source: "browser",
        includeWarning: true,
      },
    );
    const safeDetails = {
      ok: true,
      format: snapshot.format,
      targetId: snapshot.targetId,
      url: snapshot.url,
      truncated: snapshot.truncated,
      stats: snapshot.stats,
      refs: snapshot.refs ? Object.keys(snapshot.refs).length : void 0,
      labels: snapshot.labels,
      labelsCount: snapshot.labelsCount,
      labelsSkipped: snapshot.labelsSkipped,
      annotations: snapshot.annotations,
      imagePath: snapshot.imagePath,
      imageType: snapshot.imageType,
      refsFallback,
      ...dialogStateFields,
      externalContent: {
        untrusted: true,
        source: "browser",
        kind: "snapshot",
        format: "ai",
        wrapped: true,
      },
    };
    if (labels && snapshot.imagePath)
      return await browserToolActionDeps.imageResultFromFile({
        label: "browser:snapshot",
        path: snapshot.imagePath,
        extraText: wrappedSnapshot,
        details: safeDetails,
        imageSanitization: resolveRuntimeImageSanitization(),
      });
    return {
      content: [
        {
          type: "text",
          text: wrappedSnapshot,
        },
      ],
      details: safeDetails,
    };
  }
  {
    const wrapped = wrapBrowserExternalJson({
      kind: "snapshot",
      payload: snapshot,
    });
    return {
      content: [
        {
          type: "text",
          text: wrapped.wrappedText,
        },
      ],
      details: {
        ...wrapped.safeDetails,
        format: "aria",
        targetId: snapshot.targetId,
        url: snapshot.url,
        nodeCount: snapshot.nodes.length,
        ...(snapshot.blockedByDialog ? { blockedByDialog: true } : {}),
        ...(snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {}),
        externalContent: {
          untrusted: true,
          source: "browser",
          kind: "snapshot",
          format: "aria",
          wrapped: true,
        },
      },
    };
  }
}
/** Execute browser console retrieval and wrap page-controlled messages. */
async function executeConsoleAction(params) {
  const { input, baseUrl, profile, proxyRequest } = params;
  const level = normalizeOptionalString(input.level);
  const targetId = normalizeOptionalString(input.targetId);
  if (proxyRequest)
    return formatConsoleToolResult(
      await proxyRequest({
        method: "GET",
        path: "/console",
        profile,
        query: {
          level,
          targetId,
        },
      }),
    );
  return formatConsoleToolResult(
    await browserToolActionDeps.browserConsoleMessages(baseUrl, {
      level,
      targetId,
      profile,
    }),
  );
}
function resolveDownloadProxyTimeoutMs(timeoutMs) {
  return (timeoutMs ?? 12e4) + BROWSER_DOWNLOAD_REQUEST_TIMEOUT_SLACK_MS;
}
function readBrowserDownloadRequest(action, input) {
  if (action === "download")
    return {
      action,
      route: "/download",
      ref: readStringParam(input, "ref", { required: true }),
      path: readStringParam(input, "path", { required: true }),
    };
  return {
    action,
    route: "/wait/download",
    path: readStringParam(input, "path"),
  };
}
/** Execute explicit Browser download operations through the local or node-host path. */
async function executeDownloadAction(params) {
  const { action, input, baseUrl, profile, proxyRequest } = params;
  const targetId = normalizeOptionalString(input.targetId);
  const timeoutMs = normalizePositiveTimeoutMs(input.timeoutMs);
  const request = readBrowserDownloadRequest(action, input);
  const result = proxyRequest
    ? await proxyRequest({
        method: "POST",
        path: request.route,
        profile,
        timeoutMs: resolveDownloadProxyTimeoutMs(timeoutMs),
        body:
          request.action === "download"
            ? {
                ref: request.ref,
                path: request.path,
                targetId,
                timeoutMs,
              }
            : {
                path: request.path,
                targetId,
                timeoutMs,
              },
      })
    : request.action === "download"
      ? await browserToolActionDeps.browserDownload(baseUrl, {
          ref: request.ref,
          path: request.path,
          targetId,
          timeoutMs,
          profile,
        })
      : await browserToolActionDeps.browserWaitForDownload(baseUrl, {
          path: request.path,
          targetId,
          timeoutMs,
          profile,
        });
  params.onTabActivity?.(readStringValue(result.targetId) ?? targetId);
  return jsonResult(result);
}
/** Execute browser actions with profile-aware timeout defaults and stale-tab recovery. */
async function executeActAction(params) {
  const { request, baseUrl, profile, proxyRequest } = params;
  const effectiveRequest = withConfiguredActTimeout(request, profile);
  try {
    const result = proxyRequest
      ? await proxyRequest({
          method: "POST",
          path: "/act",
          profile,
          body: effectiveRequest,
          timeoutMs: resolveActProxyTimeoutMs(effectiveRequest),
        })
      : await browserToolActionDeps.browserAct(baseUrl, effectiveRequest, { profile });
    params.onTabActivity?.(
      readStringValue(result.targetId) ?? readStringValue(effectiveRequest.targetId),
    );
    return jsonResult(result);
  } catch (err) {
    if (isChromeStaleTargetError(profile, err)) {
      const tabs = proxyRequest
        ? ((
            await proxyRequest({
              method: "GET",
              path: "/tabs",
              profile,
            })
          ).tabs ?? [])
        : await browserToolActionDeps.browserTabs(baseUrl, { profile }).catch(() => []);
      const freshTargetId = tabs.length === 1 ? readStringValue(tabs[0]?.targetId) : void 0;
      const retryRequest = freshTargetId
        ? replaceStaleTargetIdInActRequest(effectiveRequest, freshTargetId)
        : null;
      if (
        retryRequest &&
        canRetryChromeActAfterSoleTargetRefresh(effectiveRequest) &&
        tabs.length === 1
      ) {
        const retryResult = proxyRequest
          ? await proxyRequest({
              method: "POST",
              path: "/act",
              profile,
              body: retryRequest,
              timeoutMs: resolveActProxyTimeoutMs(retryRequest),
            })
          : await browserToolActionDeps.browserAct(baseUrl, retryRequest, { profile });
        params.onTabActivity?.(
          readStringValue(retryResult.targetId) ?? readStringValue(retryRequest.targetId),
        );
        return jsonResult(retryResult);
      }
      if (!tabs.length)
        throw new Error(
          `No browser tabs found for profile="${profile}". Make sure the configured Chromium-based browser (v144+) is running and has open tabs, then retry.`,
          { cause: err },
        );
      throw new Error(
        `Chrome tab not found (stale targetId?). Run action=tabs profile="${profile}" and use one of the returned targetIds.`,
        { cause: err },
      );
    }
    throw err;
  }
}
//#endregion
//#region extensions/browser/src/browser-tool.ts
/**
 * Browser agent tool registration.
 *
 * Builds the model-facing browser tool, chooses sandbox/host/node routing, and
 * maps high-level actions onto browser control client calls.
 */
const browserToolDeps = {
  browserAct,
  browserArmDialog,
  browserArmFileChooser,
  browserCloseTab,
  browserDoctor,
  browserFocusTab,
  browserImportProfile,
  browserNavigate,
  browserOpenTab,
  browserPdfSave,
  browserProfiles,
  browserSystemProfiles,
  browserScreenshotAction,
  browserStart,
  browserStatus,
  browserStop,
  describeImageFile,
  getRuntimeConfig,
  imageResultFromFile,
  listNodes,
  normalizeBrowserScreenshot,
  saveMediaBuffer,
  stageBrowserScreenshotForSharing,
  touchSessionBrowserTab,
  trackSessionBrowserTab,
  untrackSessionBrowserTab,
};
function readOptionalTargetAndTimeout(params) {
  return {
    targetId: normalizeOptionalString(params.targetId),
    timeoutMs: readPositiveIntegerParam(params, "timeoutMs", {
      message: "timeoutMs must be a positive integer.",
    }),
  };
}
function readTargetUrlParam(params) {
  const targetUrl =
    readStringParam(params, "targetUrl") ??
    readStringParam(params, "url", {
      required: true,
      label: "targetUrl",
    });
  parseBrowserNavigationUrl(targetUrl);
  return targetUrl;
}
function formatScreenshotShareHint(filePath) {
  return `[Screenshot saved to ${JSON.stringify(filePath)}. Use this path with the message tool to share the screenshot explicitly.]`;
}
const SCREENSHOT_SHARE_UNAVAILABLE =
  "[Screenshot sharing is unavailable because an outbound copy could not be prepared.]";
const LEGACY_BROWSER_ACT_REQUEST_KEYS = [
  "kind",
  "actions",
  "stopOnError",
  "targetId",
  "ref",
  "doubleClick",
  "button",
  "modifiers",
  "x",
  "y",
  "text",
  "submit",
  "slowly",
  "key",
  "delayMs",
  "startRef",
  "endRef",
  "values",
  "fields",
  "width",
  "height",
  "timeMs",
  "textGone",
  "selector",
  "url",
  "loadState",
  "fn",
  "timeoutMs",
];
const LEGACY_BROWSER_ACT_SHARED_REQUEST_KEYS = /* @__PURE__ */ new Set(["targetId"]);
function readActRequestParam(params) {
  const requestParam = params.request;
  if (requestParam && typeof requestParam === "object") {
    const request = { ...requestParam };
    const hasMismatchedKind =
      typeof request.kind === "string" &&
      typeof params.kind === "string" &&
      request.kind !== params.kind;
    for (const key of LEGACY_BROWSER_ACT_REQUEST_KEYS) {
      if (Object.hasOwn(request, key) || !Object.hasOwn(params, key)) continue;
      if (hasMismatchedKind && !LEGACY_BROWSER_ACT_SHARED_REQUEST_KEYS.has(key)) continue;
      request[key] = params[key];
    }
    return request;
  }
  if (!readStringParam(params, "kind")) return;
  const request = {};
  for (const key of LEGACY_BROWSER_ACT_REQUEST_KEYS) {
    if (!Object.hasOwn(params, key)) continue;
    request[key] = params[key];
  }
  return request;
}
function isBrowserNode$1(node) {
  const caps = Array.isArray(node.caps) ? node.caps : [];
  const commands = Array.isArray(node.commands) ? node.commands : [];
  return caps.includes("browser") || commands.includes("browser.proxy");
}
async function resolveBrowserNodeTarget$1(params) {
  if (params.allowHostControl === false) {
    if (params.target === "node" || params.requestedNode)
      throw new Error("Node browser control is disabled by sandbox policy.");
    return null;
  }
  const policy = browserToolDeps.getRuntimeConfig().gateway?.nodes?.browser;
  const mode = policy?.mode ?? "auto";
  if (mode === "off") {
    if (params.target === "node" || params.requestedNode)
      throw new Error("Node browser proxy is disabled (gateway.nodes.browser.mode=off).");
    return null;
  }
  if (params.sandboxBridgeUrl?.trim() && params.target !== "node" && !params.requestedNode)
    return null;
  if (params.target && params.target !== "node") return null;
  if (mode === "manual" && params.target !== "node" && !params.requestedNode) return null;
  const browserNodes = (await browserToolDeps.listNodes({})).filter(
    (node) => node.connected && isBrowserNode$1(node),
  );
  if (browserNodes.length === 0) {
    if (params.target === "node" || params.requestedNode)
      throw new Error("No connected browser-capable nodes.");
    return null;
  }
  const requested = params.requestedNode?.trim() || policy?.node?.trim();
  if (requested) {
    const nodeId = resolveNodeIdFromList(browserNodes, requested, false, {
      allowCompactDisplayName: true,
    });
    const node = browserNodes.find((entry) => entry.nodeId === nodeId);
    return {
      nodeId,
      label: node?.displayName ?? node?.remoteIp ?? nodeId,
    };
  }
  const selected = selectDefaultNodeFromList(browserNodes, {
    preferLocalMac: false,
    fallback: "none",
  });
  if (params.target === "node") {
    if (selected)
      return {
        nodeId: selected.nodeId,
        label: selected.displayName ?? selected.remoteIp ?? selected.nodeId,
      };
    throw new Error(
      `Multiple browser-capable nodes connected (${browserNodes.length}). Set gateway.nodes.browser.node or pass node=<id>.`,
    );
  }
  if (mode === "manual") return null;
  if (selected)
    return {
      nodeId: selected.nodeId,
      label: selected.displayName ?? selected.remoteIp ?? selected.nodeId,
    };
  return null;
}
function resolveBrowserBaseUrl(params) {
  const cfg = getRuntimeConfig();
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  const normalizedSandbox = params.sandboxBridgeUrl?.trim() ?? "";
  if ((params.target ?? (normalizedSandbox ? "sandbox" : "host")) === "sandbox") {
    if (!normalizedSandbox)
      throw new Error(
        'Sandbox browser is unavailable. Enable agents.defaults.sandbox.browser.enabled or use target="host" if allowed.',
      );
    return normalizedSandbox.replace(/\/$/, "");
  }
  if (params.allowHostControl === false)
    throw new Error("Host browser control is disabled by sandbox policy.");
  if (!resolved.enabled)
    throw new Error(
      "Browser control is disabled. Set browser.enabled=true in ~/.openclaw/openclaw.json.",
    );
}
/**
 * Read importable system profiles from the host control server. Discovery must
 * match where import runs (host-local), so it never uses a node proxy or the
 * sandbox base URL. Returns [] when host control is unavailable.
 */
async function readHostSystemProfiles(params) {
  if (params.allowHostControl === false) return [];
  let hostBaseUrl;
  try {
    hostBaseUrl = resolveBrowserBaseUrl({
      target: "host",
      sandboxBridgeUrl: params.sandboxBridgeUrl,
      allowHostControl: params.allowHostControl,
    });
  } catch {
    return [];
  }
  return await browserToolDeps
    .browserSystemProfiles(hostBaseUrl, { timeoutMs: params.timeoutMs })
    .catch(() => []);
}
function shouldPreferHostForProfile(profileName) {
  if (!profileName) return false;
  const cfg = browserToolDeps.getRuntimeConfig();
  const profile = resolveProfile(resolveBrowserConfig(cfg.browser, cfg), profileName);
  if (!profile) return false;
  return getBrowserProfileCapabilities(profile).usesChromeMcp;
}
const DEFAULT_EXISTING_SESSION_MANAGE_TIMEOUT_MS = 45e3;
const EXISTING_SESSION_MANAGE_ACTIONS = /* @__PURE__ */ new Set([
  "status",
  "start",
  "stop",
  "profiles",
  "tabs",
  "open",
  "focus",
  "close",
]);
function usesExistingSessionManageFlow(params) {
  if (!EXISTING_SESSION_MANAGE_ACTIONS.has(params.action)) return false;
  const cfg = browserToolDeps.getRuntimeConfig();
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  const profile = resolveProfile(resolved, params.profileName ?? resolved.defaultProfile);
  if (profile && getBrowserProfileCapabilities(profile).usesChromeMcp) return true;
  if (params.action !== "profiles") return false;
  return Object.keys(resolved.profiles).some((name) => {
    const candidate = resolveProfile(resolved, name);
    return candidate ? getBrowserProfileCapabilities(candidate).usesChromeMcp : false;
  });
}
function readToolTimeoutMs(params) {
  return readPositiveIntegerParam(params, "timeoutMs", {
    message: "timeoutMs must be a positive integer.",
  });
}
/** Create the Browser tool exposed to agents. */
function createBrowserTool(opts) {
  return {
    label: "Browser",
    name: "browser",
    description: describeBrowserTool({
      targetDefault: opts?.sandboxBridgeUrl ? "sandbox" : "host",
      hostHint:
        opts?.allowHostControl === false
          ? "Host target blocked by policy."
          : "Host target allowed.",
    }),
    parameters: BrowserToolSchema,
    execute: async (_toolCallId, args) => {
      const params = args;
      const action = readStringParam(params, "action", { required: true });
      const profile = readStringParam(params, "profile");
      const requestedNode = readStringParam(params, "node");
      const requestedTimeoutMs = readToolTimeoutMs(params);
      let target = readStringParam(params, "target");
      const configuredNode = browserToolDeps
        .getRuntimeConfig()
        .gateway?.nodes?.browser?.node?.trim();
      if (requestedNode && target && target !== "node")
        throw new Error('node is only supported with target="node".');
      if (action === "importprofile") {
        if (target === "sandbox" || target === "node" || requestedNode)
          throw new Error(
            'system profile import must run on the host; omit target or use target="host".',
          );
        target = "host";
      }
      const isUserBrowserProfile = shouldPreferHostForProfile(profile);
      if (isUserBrowserProfile) {
        if (target === "sandbox")
          throw new Error(
            `profile="${profile}" cannot use the sandbox browser; use target="host" or omit target.`,
          );
      }
      let nodeTarget = null;
      try {
        nodeTarget = await resolveBrowserNodeTarget$1({
          requestedNode: requestedNode ?? void 0,
          target,
          sandboxBridgeUrl: opts?.sandboxBridgeUrl,
          allowHostControl: opts?.allowHostControl,
        });
      } catch (error) {
        if (!(isUserBrowserProfile && !target && !requestedNode && !configuredNode)) throw error;
      }
      if (isUserBrowserProfile && !target && !requestedNode && !nodeTarget) target = "host";
      const baseUrl = nodeTarget
        ? void 0
        : resolveBrowserBaseUrl({
            target: target === "node" ? void 0 : target,
            sandboxBridgeUrl: opts?.sandboxBridgeUrl,
            allowHostControl: opts?.allowHostControl,
          });
      const allowAutomaticHostFallback = Boolean(
        nodeTarget &&
        !target &&
        !requestedNode &&
        !configuredNode &&
        opts?.allowHostControl !== false,
      );
      const proxyRequest = nodeTarget
        ? createBrowserNodeProxyRequest({
            nodeTarget,
            allowAutomaticHostFallback,
          })
        : null;
      const toolTimeoutMs =
        requestedTimeoutMs ??
        (usesExistingSessionManageFlow({
          action,
          profileName: profile,
        })
          ? DEFAULT_EXISTING_SESSION_MANAGE_TIMEOUT_MS
          : void 0);
      const touchTrackedTab = (targetId) => {
        if (!targetId || (proxyRequest && !proxyRequest.isHostFallbackActive())) return;
        browserToolDeps.touchSessionBrowserTab({
          sessionKey: opts?.agentSessionKey,
          targetId,
          baseUrl,
          profile,
        });
      };
      switch (action) {
        case "doctor":
          if (proxyRequest)
            return jsonResult(
              await proxyRequest({
                method: "GET",
                path: "/doctor",
                profile,
              }),
            );
          return jsonResult(await browserToolDeps.browserDoctor(baseUrl, { profile }));
        case "status":
          if (proxyRequest)
            return jsonResult(
              await proxyRequest({
                method: "GET",
                path: "/",
                profile,
                timeoutMs: toolTimeoutMs,
              }),
            );
          return jsonResult(
            await browserToolDeps.browserStatus(baseUrl, {
              profile,
              timeoutMs: toolTimeoutMs,
            }),
          );
        case "start":
          if (proxyRequest) {
            await proxyRequest({
              method: "POST",
              path: "/start",
              profile,
              timeoutMs: toolTimeoutMs,
            });
            return jsonResult(
              await proxyRequest({
                method: "GET",
                path: "/",
                profile,
                timeoutMs: toolTimeoutMs,
              }),
            );
          }
          await browserToolDeps.browserStart(baseUrl, {
            profile,
            timeoutMs: toolTimeoutMs,
          });
          return jsonResult(
            await browserToolDeps.browserStatus(baseUrl, {
              profile,
              timeoutMs: toolTimeoutMs,
            }),
          );
        case "stop":
          if (proxyRequest) {
            await proxyRequest({
              method: "POST",
              path: "/stop",
              profile,
              timeoutMs: toolTimeoutMs,
            });
            return jsonResult(
              await proxyRequest({
                method: "GET",
                path: "/",
                profile,
                timeoutMs: toolTimeoutMs,
              }),
            );
          }
          await browserToolDeps.browserStop(baseUrl, {
            profile,
            timeoutMs: toolTimeoutMs,
          });
          return jsonResult(
            await browserToolDeps.browserStatus(baseUrl, {
              profile,
              timeoutMs: toolTimeoutMs,
            }),
          );
        case "profiles": {
          const systemProfiles = await readHostSystemProfiles({
            allowHostControl: opts?.allowHostControl,
            sandboxBridgeUrl: opts?.sandboxBridgeUrl,
            timeoutMs: toolTimeoutMs,
          });
          if (proxyRequest) {
            const result = await proxyRequest({
              method: "GET",
              path: "/profiles",
              timeoutMs: toolTimeoutMs,
            });
            return jsonResult({
              ...(result && typeof result === "object" ? result : { profiles: result }),
              systemProfiles,
            });
          }
          return jsonResult({
            profiles: await browserToolDeps.browserProfiles(baseUrl, { timeoutMs: toolTimeoutMs }),
            systemProfiles,
          });
        }
        case "importprofile": {
          if (proxyRequest) throw new Error("system profile import must run on the browser host");
          const domains = parseSystemProfileDomains(params.domains);
          return jsonResult(
            await browserToolDeps.browserImportProfile(baseUrl, {
              browser: normalizeOptionalString(params.browser) ?? "chrome",
              systemProfile: normalizeOptionalString(params.systemProfile) ?? "Default",
              into: normalizeOptionalString(params.into) ?? "imported",
              domains,
            }),
          );
        }
        case "tabs":
          return await executeTabsAction({
            baseUrl,
            profile,
            timeoutMs: toolTimeoutMs,
            proxyRequest,
          });
        case "open": {
          const targetUrl = readTargetUrlParam(params);
          const label = normalizeOptionalString(params.label);
          if (proxyRequest) {
            const result = await proxyRequest({
              method: "POST",
              path: "/tabs/open",
              profile,
              body: {
                url: targetUrl,
                ...(label ? { label } : {}),
              },
              timeoutMs: toolTimeoutMs,
            });
            if (proxyRequest.isHostFallbackActive())
              browserToolDeps.trackSessionBrowserTab({
                sessionKey: opts?.agentSessionKey,
                targetId: readStringValue(result.targetId),
                baseUrl,
                profile,
              });
            return jsonResult(result);
          }
          const opened = await browserToolDeps.browserOpenTab(baseUrl, targetUrl, {
            profile,
            label,
            timeoutMs: toolTimeoutMs,
          });
          browserToolDeps.trackSessionBrowserTab({
            sessionKey: opts?.agentSessionKey,
            targetId: opened.targetId,
            baseUrl,
            profile,
          });
          return jsonResult(opened);
        }
        case "focus": {
          const targetId = readStringParam(params, "targetId", { required: true });
          if (proxyRequest) {
            const result = await proxyRequest({
              method: "POST",
              path: "/tabs/focus",
              profile,
              body: { targetId },
              timeoutMs: toolTimeoutMs,
            });
            touchTrackedTab(targetId);
            return jsonResult(result);
          }
          await browserToolDeps.browserFocusTab(baseUrl, targetId, {
            profile,
            timeoutMs: toolTimeoutMs,
          });
          touchTrackedTab(targetId);
          return jsonResult({ ok: true });
        }
        case "close": {
          const targetId = readStringParam(params, "targetId");
          if (proxyRequest) {
            const result = targetId
              ? await proxyRequest({
                  method: "DELETE",
                  path: `/tabs/${encodeURIComponent(targetId)}`,
                  profile,
                  timeoutMs: toolTimeoutMs,
                })
              : await proxyRequest({
                  method: "POST",
                  path: "/act",
                  profile,
                  body: { kind: "close" },
                  timeoutMs: toolTimeoutMs,
                });
            if (targetId && proxyRequest.isHostFallbackActive())
              browserToolDeps.untrackSessionBrowserTab({
                sessionKey: opts?.agentSessionKey,
                targetId,
                baseUrl,
                profile,
              });
            return jsonResult(result);
          }
          if (targetId) {
            await browserToolDeps.browserCloseTab(baseUrl, targetId, {
              profile,
              timeoutMs: toolTimeoutMs,
            });
            browserToolDeps.untrackSessionBrowserTab({
              sessionKey: opts?.agentSessionKey,
              targetId,
              baseUrl,
              profile,
            });
          } else
            await browserToolDeps.browserAct(
              baseUrl,
              { kind: "close" },
              {
                profile,
                timeoutMs: toolTimeoutMs,
              },
            );
          return jsonResult({ ok: true });
        }
        case "snapshot":
          return await executeSnapshotAction({
            input: params,
            baseUrl,
            profile,
            proxyRequest,
            onTabActivity: touchTrackedTab,
          });
        case "screenshot": {
          const targetId = readStringParam(params, "targetId");
          const fullPage = Boolean(params.fullPage);
          const ref = readStringParam(params, "ref");
          const element = readStringParam(params, "element");
          const labels = typeof params.labels === "boolean" ? params.labels : void 0;
          const type = params.type === "jpeg" ? "jpeg" : "png";
          const effectiveTimeoutMs = requestedTimeoutMs ?? 2e4;
          const result = proxyRequest
            ? await proxyRequest({
                method: "POST",
                path: "/screenshot",
                profile,
                timeoutMs: effectiveTimeoutMs,
                body: {
                  targetId,
                  fullPage,
                  ref,
                  element,
                  type,
                  labels,
                  timeoutMs: effectiveTimeoutMs,
                },
              })
            : await browserToolDeps.browserScreenshotAction(baseUrl, {
                targetId,
                fullPage,
                ref,
                element,
                type,
                labels,
                timeoutMs: effectiveTimeoutMs,
                profile,
              });
          touchTrackedTab(readStringValue(result.targetId) ?? targetId);
          const screenshotPath = result.path;
          const screenshotCfg = browserToolDeps.getRuntimeConfig();
          const imageSanitization = resolveRuntimeImageSanitization();
          let shareHint = SCREENSHOT_SHARE_UNAVAILABLE;
          try {
            shareHint = formatScreenshotShareHint(
              await browserToolDeps.stageBrowserScreenshotForSharing(
                screenshotPath,
                imageSanitization?.maxDimensionPx,
              ),
            );
          } catch {}
          const screenshotDetails = {
            ...result,
            media: { outbound: false },
          };
          try {
            const described = await describeBrowserScreenshot(
              {
                cfg: screenshotCfg,
                filePath: screenshotPath,
                agentDir: opts?.agentDir,
                workspaceDir: opts?.workspaceDir,
                activeModel: opts?.activeModel,
                mediaScope: opts?.mediaScope,
                imageSanitization,
              },
              {
                describeImageFile: browserToolDeps.describeImageFile,
                normalizeBrowserScreenshot: browserToolDeps.normalizeBrowserScreenshot,
                saveMediaBuffer: browserToolDeps.saveMediaBuffer,
              },
            );
            if (described) {
              const headerLines = [
                `[analyzed by ${described.provider && described.model ? `${described.provider}/${described.model}` : "media image understanding"}]`,
              ];
              const wrappedDescription = wrapExternalContent(
                neutralizeMediaDirectives(described.text.trim()),
                {
                  source: "browser",
                  includeWarning: true,
                },
              );
              return {
                content: [
                  {
                    type: "text",
                    text: `${headerLines.join("\n")}\n${wrappedDescription}\n${shareHint}`,
                  },
                ],
                details: {
                  ...result,
                  vision: {
                    provider: described.provider,
                    model: described.model,
                    decision: described.decision,
                  },
                },
              };
            }
          } catch (err) {
            const extraText = `[browser screenshot vision failed: ${neutralizeMediaDirectives(err instanceof Error ? err.message : String(err))}]\n${shareHint}`;
            return await browserToolDeps.imageResultFromFile({
              label: "browser:screenshot",
              path: screenshotPath,
              extraText,
              details: screenshotDetails,
              imageSanitization,
            });
          }
          return await browserToolDeps.imageResultFromFile({
            label: "browser:screenshot",
            path: screenshotPath,
            extraText: shareHint,
            details: screenshotDetails,
            imageSanitization,
          });
        }
        case "navigate": {
          const targetUrl = readTargetUrlParam(params);
          const targetId = readStringParam(params, "targetId");
          if (proxyRequest) {
            const result = await proxyRequest({
              method: "POST",
              path: "/navigate",
              profile,
              body: {
                url: targetUrl,
                targetId,
              },
            });
            touchTrackedTab(readStringValue(result.targetId) ?? targetId);
            return jsonResult(result);
          }
          const result = await browserToolDeps.browserNavigate(baseUrl, {
            url: targetUrl,
            targetId,
            profile,
          });
          touchTrackedTab(readStringValue(result.targetId) ?? targetId);
          return jsonResult(result);
        }
        case "console":
          return await executeConsoleAction({
            input: params,
            baseUrl,
            profile,
            proxyRequest,
          });
        case "pdf": {
          const targetId = normalizeOptionalString(params.targetId);
          const result = proxyRequest
            ? await proxyRequest({
                method: "POST",
                path: "/pdf",
                profile,
                body: { targetId },
              })
            : await browserToolDeps.browserPdfSave(baseUrl, {
                targetId,
                profile,
              });
          touchTrackedTab(readStringValue(result.targetId) ?? targetId);
          return {
            content: [
              {
                type: "text",
                text: `FILE:${result.path}`,
              },
            ],
            details: result,
          };
        }
        case "download":
        case "waitfordownload":
          return await executeDownloadAction({
            action,
            input: params,
            baseUrl,
            profile,
            proxyRequest,
            onTabActivity: touchTrackedTab,
          });
        case "upload": {
          const paths = Array.isArray(params.paths) ? params.paths.map((p) => String(p)) : [];
          if (paths.length === 0) throw new Error("paths required");
          const resolvedResult = await resolveExistingUploadPaths({ requestedPaths: paths });
          if (!resolvedResult.ok) throw new Error(resolvedResult.error);
          const normalizedPaths = resolvedResult.paths;
          const ref = readStringParam(params, "ref");
          const inputRef = readStringParam(params, "inputRef");
          const element = readStringParam(params, "element");
          const { targetId, timeoutMs } = readOptionalTargetAndTimeout(params);
          if (proxyRequest)
            return jsonResult(
              await proxyRequest({
                method: "POST",
                path: "/hooks/file-chooser",
                profile,
                body: {
                  paths: normalizedPaths,
                  ref,
                  inputRef,
                  element,
                  targetId,
                  timeoutMs,
                },
              }),
            );
          const result = await browserToolDeps.browserArmFileChooser(baseUrl, {
            paths: normalizedPaths,
            ref,
            inputRef,
            element,
            targetId,
            timeoutMs,
            profile,
          });
          touchTrackedTab(readStringValue(result.targetId) ?? targetId);
          return jsonResult(result);
        }
        case "dialog": {
          const accept = Boolean(params.accept);
          const promptText = readStringValue(params.promptText);
          const dialogId = readStringValue(params.dialogId);
          const { targetId, timeoutMs } = readOptionalTargetAndTimeout(params);
          if (proxyRequest)
            return jsonResult(
              await proxyRequest({
                method: "POST",
                path: "/hooks/dialog",
                profile,
                body: {
                  accept,
                  promptText,
                  dialogId,
                  targetId,
                  timeoutMs,
                },
              }),
            );
          const result = await browserToolDeps.browserArmDialog(baseUrl, {
            accept,
            promptText,
            dialogId,
            targetId,
            timeoutMs,
            profile,
          });
          touchTrackedTab(readStringValue(result.targetId) ?? targetId);
          return jsonResult(result);
        }
        case "act": {
          const request = readActRequestParam(params);
          if (!request) throw new Error("request required");
          return await executeActAction({
            request,
            baseUrl,
            profile,
            proxyRequest,
            onTabActivity: touchTrackedTab,
          });
        }
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
  };
}
//#endregion
//#region extensions/browser/src/gateway/browser-request.ts
/**
 * Gateway handler for browser.request, including optional node-host proxy
 * dispatch and local Browser control route dispatch.
 */
const logger = createSubsystemLogger("browser");
function isBrowserNode(node) {
  const caps = Array.isArray(node.caps) ? node.caps : [];
  const commands = Array.isArray(node.commands) ? node.commands : [];
  return caps.includes("browser") || commands.includes("browser.proxy");
}
function resolveBrowserNode(nodes, query) {
  const q = normalizeOptionalString(query) ?? "";
  if (!q) return null;
  const nodeId = resolveNodeIdFromList(nodes, q, false, { allowCompactDisplayName: true });
  return nodes.find((node) => node.nodeId === nodeId) ?? null;
}
function resolveBrowserNodeTarget(params) {
  const policy = params.cfg.gateway?.nodes?.browser;
  const mode = policy?.mode ?? "auto";
  if (mode === "off") return null;
  const browserNodes = params.nodes.filter((node) => isBrowserNode(node));
  if (browserNodes.length === 0) {
    if (normalizeOptionalString(policy?.node))
      throw new Error("No connected browser-capable nodes.");
    return null;
  }
  const requested = normalizeOptionalString(policy?.node) ?? "";
  if (requested) {
    const resolved = resolveBrowserNode(browserNodes, requested);
    if (!resolved) throw new Error(`Configured browser node not connected: ${requested}`);
    return resolved;
  }
  if (mode === "manual") return null;
  if (browserNodes.length === 1) return browserNodes[0] ?? null;
  return null;
}
async function persistProxyFiles(files) {
  return await persistBrowserProxyFiles(files);
}
function applyProxyPaths(result, mapping) {
  applyBrowserProxyPaths(result, mapping);
}
/** Handles one browser.request gateway call and streams a success/error response. */
async function handleBrowserGatewayRequest({ params, respond, context }) {
  const typed = params;
  const methodRaw = (normalizeOptionalString(typed.method) ?? "").toUpperCase();
  const path = normalizeOptionalString(typed.path) ?? "";
  const query = typed.query && typeof typed.query === "object" ? typed.query : void 0;
  const body = typed.body;
  const timeoutMs = clampTimerTimeoutMs(typed.timeoutMs);
  if (!methodRaw || !path) {
    respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "method and path are required"));
    return;
  }
  if (methodRaw !== "GET" && methodRaw !== "POST" && methodRaw !== "DELETE") {
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, "method must be GET, POST, or DELETE"),
    );
    return;
  }
  const cfg = getRuntimeConfig();
  const configuredNode = normalizeOptionalString(cfg.gateway?.nodes?.browser?.node);
  const forceHostLocal = isBrowserHostLocalRoute(methodRaw, path);
  let nodeTarget = null;
  if (!forceHostLocal)
    try {
      nodeTarget = resolveBrowserNodeTarget({
        cfg,
        nodes: context.nodeRegistry.listConnected(),
      });
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
      return;
    }
  if (nodeTarget) {
    if (isPersistentBrowserProfileMutation(methodRaw, path)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "browser.request cannot mutate persistent browser profiles over a node proxy",
        ),
      );
      return;
    }
    const allowlist = resolveNodeCommandAllowlist(cfg, nodeTarget);
    const allowed = isNodeCommandAllowed({
      command: "browser.proxy",
      declaredCommands: nodeTarget.commands,
      allowlist,
    });
    if (!allowed.ok) {
      const platform = nodeTarget.platform ?? "unknown";
      const hint = `node command not allowed: ${allowed.reason} (platform: ${platform}, command: browser.proxy)`;
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, hint, {
          details: {
            reason: allowed.reason,
            command: "browser.proxy",
          },
        }),
      );
      return;
    }
    const proxyParams = {
      method: methodRaw,
      path,
      query,
      body,
      timeoutMs,
      profile: resolveRequestedBrowserProfile({
        query,
        body,
      }),
      errorEnvelope: BROWSER_PROXY_ERROR_ENVELOPE,
    };
    const res = await context.nodeRegistry.invoke({
      nodeId: nodeTarget.nodeId,
      command: "browser.proxy",
      params: proxyParams,
      timeoutMs,
      idempotencyKey: crypto.randomUUID(),
    });
    if (!configuredNode && isBrowserControlHostUnavailableError(res.error) && !res.ok)
      logger.warn(
        `browser node ${nodeTarget.displayName ?? nodeTarget.nodeId} control host unavailable; falling back to Gateway host`,
      );
    else {
      if (!respondUnavailableOnNodeInvokeError(respond, res)) return;
      const payload = res.payloadJSON ? safeParseJson(res.payloadJSON) : res.payload;
      const failure = parseBrowserProxyFailure(payload);
      if (failure) {
        const { status, body: errorBody } = failure.error;
        respond(
          false,
          void 0,
          errorShape(
            status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST,
            errorBody.error,
            { details: errorBody },
          ),
        );
        return;
      }
      const proxy = payload && typeof payload === "object" ? payload : null;
      if (!proxy || !("result" in proxy)) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "browser proxy failed"));
        return;
      }
      const success = proxy;
      const mapping = await persistProxyFiles(success.files);
      applyProxyPaths(success.result, mapping);
      respond(true, success.result);
      return;
    }
  }
  if (!(await startBrowserControlServiceFromConfig())) {
    respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "browser control is disabled"));
    return;
  }
  let dispatcher;
  try {
    dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
  } catch (err) {
    respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    return;
  }
  let result;
  try {
    result = timeoutMs
      ? await withTimeout(
          (signal) =>
            dispatcher.dispatch({
              method: methodRaw,
              path,
              query,
              body,
              signal,
            }),
          timeoutMs,
          "browser request",
        )
      : await dispatcher.dispatch({
          method: methodRaw,
          path,
          query,
          body,
        });
  } catch (err) {
    respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    return;
  }
  if (result.status >= 400) {
    const message =
      result.body && typeof result.body === "object" && "error" in result.body
        ? String(result.body.error)
        : `browser request failed (${result.status})`;
    respond(
      false,
      void 0,
      errorShape(
        result.status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST,
        message,
        { details: result.body },
      ),
    );
    return;
  }
  respond(true, result.body);
}
/** Gateway request handler map contributed by the Browser plugin. */
const browserHandlers = { "browser.request": handleBrowserGatewayRequest };
//#endregion
//#region extensions/browser/src/plugin-service.ts
/**
 * Browser plugin service factory that lazily starts the control server.
 */
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER = /^(?:data|http|https|node):/i;
function isTruthyEnvValue(value) {
  return /^(?:1|true|yes|on)$/iu.test(value?.trim() ?? "");
}
function validateBrowserControlOverrideSpecifier(specifier) {
  const trimmed = specifier.trim();
  if (UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER.test(trimmed))
    throw new Error(`Refusing unsafe browser control override specifier: ${trimmed}`);
  return trimmed;
}
/** Creates the Browser plugin service registered by the plugin entrypoint. */
function createBrowserPluginService() {
  let handle = null;
  return {
    id: "browser-control",
    start: async () => {
      if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
      if (handle) return;
      handle = await startLazyPluginServiceModule({
        skipEnvVar: "OPENCLAW_SKIP_BROWSER_CONTROL_SERVER",
        overrideEnvVar: "OPENCLAW_BROWSER_CONTROL_MODULE",
        validateOverrideSpecifier: validateBrowserControlOverrideSpecifier,
        loadDefaultModule: async () => await import("./server-CzeQxqyx.js"),
        startExportNames: [
          "startBrowserControlServiceFromConfig",
          "startBrowserControlServerFromConfig",
        ],
        stopExportNames: ["stopBrowserControlService", "stopBrowserControlServer"],
      });
    },
    stop: async () => {
      const current = handle;
      if (current) {
        await current.stop();
        if (handle === current) handle = null;
        return;
      }
      const { stopBrowserControlService } = await import("./control-service-BkQZDn4M.js");
      await stopBrowserControlService();
    },
  };
}
//#endregion
export {
  createBrowserTool as i,
  browserHandlers as n,
  handleBrowserGatewayRequest as r,
  createBrowserPluginService as t,
};
