import { randomUUID } from "node:crypto";
import { t as completeDeferredSessionMcpRuntimeRetirement } from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { o as normalizeMcpAppCsp } from "./mcp-app-sandbox-0T2d0G77.js";
//#region src/agents/mcp-ui-resource.ts
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
const MCP_APP_RESOURCE_MAX_BYTES = 2 * 1024 * 1024;
const MCP_APP_VIEW_TTL_MS = 10 * 6e4;
const MCP_APP_VIEW_MAX_ENTRIES = 32;
const MCP_APP_VIEW_MAX_BYTES = 6 * 1024 * 1024;
const MCP_APP_VIEW_STORE_MAX_BYTES = 64 * 1024 * 1024;
const MCP_APP_VIEW_STORE_KEY = Symbol.for("openclaw.mcpAppViewStore");
function getViewStore() {
  const globalStore = globalThis;
  const existing = globalStore[MCP_APP_VIEW_STORE_KEY];
  if (existing) return existing;
  const store = /* @__PURE__ */ new Map();
  globalStore[MCP_APP_VIEW_STORE_KEY] = store;
  return store;
}
function deleteView(viewId, expected) {
  const store = getViewStore();
  const view = store.get(viewId);
  if (!view || (expected && view !== expected)) return;
  clearTimeout(view.expiryTimer);
  view.releaseRuntimeLease?.();
  store.delete(viewId);
  completeDeferredSessionMcpRuntimeRetirement(view.runtime).catch((error) => {
    logWarn(`mcp-app: deferred runtime cleanup failed: ${formatErrorMessage(error)}`);
  });
}
function pruneViewStore(additionalBytes = 0, options) {
  const store = getViewStore();
  const nowMs = options?.nowMs ?? Date.now();
  for (const [viewId, view] of store) if (view.expiresAtMs <= nowMs) deleteView(viewId, view);
  let totalBytes = Array.from(store.values()).reduce((sum, view) => sum + (view.byteSize ?? 0), 0);
  while (
    store.size + (options?.reserveEntry ? 1 : 0) > MCP_APP_VIEW_MAX_ENTRIES ||
    totalBytes + additionalBytes > MCP_APP_VIEW_STORE_MAX_BYTES
  ) {
    const oldest = store.keys().next().value;
    if (oldest === void 0) return;
    const evicted = store.get(oldest);
    totalBytes -= evicted?.byteSize ?? 0;
    if (evicted) deleteView(oldest, evicted);
  }
}
function measureViewBytes(html, toolInput, toolResult) {
  const toolData = JSON.stringify({
    toolInput,
    toolResult,
  });
  const byteSize = Buffer.byteLength(html, "utf8") + Buffer.byteLength(toolData, "utf8");
  if (byteSize > MCP_APP_VIEW_MAX_BYTES)
    throw new Error(`MCP App view data exceeds ${MCP_APP_VIEW_MAX_BYTES} bytes`);
  return byteSize;
}
function assertBoundedViewDescriptor(value) {
  if (
    (value.viewId && (value.viewId.length > 128 || !value.viewId.startsWith("mcp-app-"))) ||
    !value.serverName ||
    value.serverName.length > 256 ||
    !value.toolName ||
    value.toolName.length > 256 ||
    !value.uiResourceUri.startsWith("ui://") ||
    value.uiResourceUri.length > 2048 ||
    (value.toolCallId !== void 0 && value.toolCallId.length > 512)
  )
    throw new Error("MCP App preview descriptor exceeds safe limits");
}
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function normalizePermissions(value) {
  const record = asRecord(value);
  if (!record) return;
  const permissions = {};
  for (const key of ["camera", "clipboardWrite", "geolocation", "microphone"])
    if (asRecord(record[key])) permissions[key] = {};
  return Object.keys(permissions).length > 0 ? permissions : void 0;
}
function decodeResourceHtml(content) {
  if (typeof content.text === "string") {
    if (Buffer.byteLength(content.text, "utf8") > 2097152)
      throw new Error(`MCP App resource exceeds ${MCP_APP_RESOURCE_MAX_BYTES} bytes`);
    return content.text;
  }
  if (typeof content.blob !== "string")
    throw new Error("MCP App resource must provide text or base64 blob content");
  const maxEncodedBytes = Math.ceil(MCP_APP_RESOURCE_MAX_BYTES / 3) * 4 + 4;
  if (content.blob.length > maxEncodedBytes)
    throw new Error(`MCP App resource exceeds ${MCP_APP_RESOURCE_MAX_BYTES} bytes`);
  const decoded = Buffer.from(content.blob, "base64");
  if (decoded.byteLength > 2097152)
    throw new Error(`MCP App resource exceeds ${MCP_APP_RESOURCE_MAX_BYTES} bytes`);
  return decoded.toString("utf8");
}
async function resolveListingUiMeta(runtime, serverName, uri) {
  try {
    const listed = await runtime.listResources?.(serverName, { failureBackoff: "ignore" });
    const { _meta: metadata } =
      (Array.isArray(listed)
        ? listed
        : Array.isArray(asRecord(listed)?.resources)
          ? asRecord(listed)?.resources
          : []
      )
        .map(asRecord)
        .find((entry) => entry?.uri === uri) ?? {};
    return asRecord(asRecord(metadata)?.ui);
  } catch (error) {
    logWarn(
      `mcp-app: failed to read optional listing metadata for ${uri} from "${serverName}": ${formatErrorMessage(error)}`,
    );
    return;
  }
}
async function fetchMcpAppView(params) {
  let releaseRuntimeLease;
  try {
    assertBoundedViewDescriptor(params);
    if (!params.runtime.readResource || !params.uiResourceUri.startsWith("ui://")) return;
    const result = asRecord(
      await params.runtime.readResource(params.serverName, params.uiResourceUri, {
        failureBackoff: "ignore",
      }),
    );
    const contents = Array.isArray(result?.contents) ? result.contents : [];
    if (contents.length !== 1)
      throw new Error(`expected one MCP App resource, received ${contents.length}`);
    const content = asRecord(contents[0]);
    if (!content || content.mimeType !== "text/html;profile=mcp-app")
      throw new Error(`resource must use ${MCP_APP_RESOURCE_MIME_TYPE}`);
    const html = decodeResourceHtml(content);
    const byteSize = measureViewBytes(html, params.toolInput, params.toolResult);
    const { _meta: metadata, meta: deprecatedMetadata } = content;
    const contentUiMeta = asRecord(asRecord(metadata ?? deprecatedMetadata)?.ui);
    const listingUiMeta = contentUiMeta
      ? void 0
      : await resolveListingUiMeta(params.runtime, params.serverName, params.uiResourceUri);
    const uiMeta = contentUiMeta ?? listingUiMeta;
    const csp = normalizeMcpAppCsp(uiMeta?.csp);
    const permissions = normalizePermissions(uiMeta?.permissions);
    const title = `${params.toolName} UI`;
    const viewId = params.viewId ?? `mcp-app-${randomUUID()}`;
    releaseRuntimeLease = params.runtime.acquireLease?.();
    deleteView(viewId);
    pruneViewStore(byteSize, { reserveEntry: true });
    const view = {
      viewId,
      runtime: params.runtime,
      sessionId: params.runtime.sessionId,
      serverName: params.serverName,
      toolName: params.toolName,
      uiResourceUri: params.uiResourceUri,
      html,
      ...(csp ? { csp } : {}),
      ...(permissions ? { permissions } : {}),
      ...(params.allowedAppToolNames
        ? { allowedAppToolNames: new Set(params.allowedAppToolNames) }
        : {}),
      toolInput: params.toolInput,
      toolResult: params.toolResult,
      expiresAtMs: Date.now() + MCP_APP_VIEW_TTL_MS,
      requestWindowStartedAtMs: Date.now(),
      requestCount: 0,
      toolCallCount: 0,
      activeRequests: 0,
      byteSize,
      ...(releaseRuntimeLease ? { releaseRuntimeLease } : {}),
    };
    releaseRuntimeLease = void 0;
    view.expiryTimer = setTimeout(() => {
      deleteView(view.viewId, view);
    }, MCP_APP_VIEW_TTL_MS);
    view.expiryTimer.unref?.();
    getViewStore().set(viewId, view);
    return {
      viewId,
      title,
      serverName: params.serverName,
      toolName: params.toolName,
      uiResourceUri: params.uiResourceUri,
      ...(params.toolCallId ? { toolCallId: params.toolCallId } : {}),
    };
  } catch (error) {
    releaseRuntimeLease?.();
    logWarn(
      `mcp-app: failed to prepare ${params.uiResourceUri} from "${params.serverName}": ${formatErrorMessage(error)}`,
    );
    return;
  }
}
function getMcpAppViewLease(viewId, runtime) {
  pruneViewStore();
  const view = getViewStore().get(viewId);
  return view?.runtime === runtime ? view : void 0;
}
function acquireMcpAppViewRequest(view, kind, nowMs = Date.now()) {
  if (nowMs - view.requestWindowStartedAtMs >= 6e4) {
    view.requestWindowStartedAtMs = nowMs;
    view.requestCount = 0;
    view.toolCallCount = 0;
  }
  if (view.activeRequests >= 4) throw new Error("MCP App request concurrency limit reached");
  if (view.requestCount >= 120 || (kind === "tool" && view.toolCallCount >= 30))
    throw new Error("MCP App request rate limit reached");
  view.requestCount += 1;
  if (kind === "tool") view.toolCallCount += 1;
  view.activeRequests += 1;
  let released = false;
  return () => {
    if (!released) {
      released = true;
      view.activeRequests = Math.max(0, view.activeRequests - 1);
    }
  };
}
function buildMcpAppCanvasPayload(view) {
  assertBoundedViewDescriptor(view);
  return {
    kind: "canvas",
    view: {
      id: view.viewId,
      title: view.title,
    },
    presentation: {
      target: "assistant_message",
      title: view.title,
      preferred_height: 600,
      sandbox: "scripts",
    },
    mcpApp: {
      viewId: view.viewId,
      serverName: view.serverName,
      toolName: view.toolName,
      uiResourceUri: view.uiResourceUri,
      ...(view.toolCallId ? { toolCallId: view.toolCallId } : {}),
      ...(view.resultMetaState ? { resultMetaState: view.resultMetaState } : {}),
    },
  };
}
//#endregion
export {
  getMcpAppViewLease as i,
  buildMcpAppCanvasPayload as n,
  fetchMcpAppView as r,
  acquireMcpAppViewRequest as t,
};
