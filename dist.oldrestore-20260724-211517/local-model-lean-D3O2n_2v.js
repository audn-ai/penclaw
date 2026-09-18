import { AsyncLocalStorage } from "node:async_hooks";
import { spawn } from "node:child_process";
import os from "node:os";
import { Type } from "typebox";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  d as rewrapToolWithBeforeToolCallHook,
  p as wrapToolWithBeforeToolCallHook,
} from "./agent-tools.before-tool-call-B7gv78c3.js";
import { n as ToolInputError, r as asToolParamsRecord } from "./common-DyDSUect.js";
import {
  D as isToolWrappedWithBeforeToolCallHook,
  x as getChannelAgentToolMeta,
} from "./gateway-Dyh1k_4Q.js";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-CrqljM7B.js";
import {
  n as appendBoundedTextTail,
  t as SESSION_TOOL_STDERR_TAIL_BYTES,
} from "./limits-BHHfzS4A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
  v as uniqueValues,
} from "./string-normalization-CRyoFBPt.js";
import { f as expandToolGroups, m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { i as getPluginToolMeta } from "./tools-K3NqAe9E.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/agent-tools.ring-zero-context.ts
const activeRingZeroTools = new AsyncLocalStorage();
function isPromiseLike(value) {
  if ((typeof value !== "object" || value === null) && typeof value !== "function") return false;
  return "then" in value && typeof value.then === "function";
}
var HostScopedAgentToolAuthorizationError = class extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
    this.name = "HostScopedAgentToolAuthorizationError";
  }
};
function bindToolToScope(tool, scope) {
  const execute = tool.execute;
  return {
    ...tool,
    execute: async (toolCallId, params, signal, onUpdate) => {
      if (!scope.active)
        throw new HostScopedAgentToolAuthorizationError(
          `host-scoped tool "${tool.name}" is no longer authorized for this run`,
        );
      return await execute(toolCallId, params, signal, onUpdate);
    },
  };
}
/**
 * Bind host-owned tools to one selected harness run. The SDK reads this scope
 * during tool construction, so plugins never receive private authority objects.
 */
function runWithAgentRingZeroTools(tools, run) {
  const scope = {
    active: true,
    tools: [],
  };
  scope.tools = tools.map((tool) => bindToolToScope(tool, scope));
  try {
    const result = activeRingZeroTools.run(scope, run);
    if (isPromiseLike(result))
      return Promise.resolve(result).finally(() => {
        scope.active = false;
      });
    scope.active = false;
    return result;
  } catch (error) {
    scope.active = false;
    throw error;
  }
}
/** Read the host-owned tools bound to the current harness run. */
function getActiveAgentRingZeroTools() {
  const scope = activeRingZeroTools.getStore();
  return scope?.active === true ? scope.tools : [];
}
function mergeAgentRingZeroTools(ringZeroTools, tools) {
  if (ringZeroTools.length === 0) return tools;
  const reservedNames = new Set(ringZeroTools.map((tool) => tool.name));
  return [...ringZeroTools, ...tools.filter((tool) => !reservedNames.has(tool.name))];
}
/**
 * Read a host-owned tool fact for the current run. This does not activate or
 * grant a tool; only the host can bind executable authority to the run scope.
 */
function isHostScopedAgentToolActive(toolName) {
  const normalizedName = toolName.trim().toLowerCase();
  return (
    normalizedName.length > 0 &&
    getActiveAgentRingZeroTools().some((tool) => tool.name.trim().toLowerCase() === normalizedName)
  );
}
//#endregion
//#region src/agents/tool-replay-safety.ts
/**
 * Defines the narrow set of tool instances that blind attempt retries may repeat.
 */
const UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES = /* @__PURE__ */ new Set([
  "read",
  "search",
  "find",
  "grep",
  "glob",
  "ls",
  "web_search",
  "web_fetch",
  "x_search",
  "memory_get",
  "sessions_list",
  "sessions_history",
  "sessions_search",
  "agents_list",
  "get_goal",
  "update_plan",
  "tool_search",
  "tool_describe",
  "image",
]);
/**
 * Tool names are not ownership boundaries. Callers must reject plugin/channel
 * instances before using this audited core-tool allowlist.
 */
function isAgentToolReplaySafe(tool, options) {
  if (options?.declaredReplaySafe?.(tool) === false) return false;
  return UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES.has(normalizeToolName(tool.name ?? ""));
}
/**
 * Classify one concrete tool instance for an explicitly restart-safe turn.
 * Unlike blind name-only replay, an owner declaration is sufficient because
 * the host filters the concrete registered instance before execution.
 */
function isAgentToolRestartSafe(tool, options) {
  const declaredReplaySafe = options?.declaredReplaySafe?.(tool);
  if (declaredReplaySafe !== void 0) return declaredReplaySafe;
  return UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES.has(normalizeToolName(tool.name ?? ""));
}
/**
 * Name-only tool events are safe only when one concrete registered instance
 * owns the name. Duplicate/shadowed names fail closed.
 */
function collectReplaySafeToolNames(tools, options) {
  const toolsByName = /* @__PURE__ */ new Map();
  for (const tool of tools) {
    const name = normalizeToolName(tool.name ?? "");
    if (!name) continue;
    const entries = toolsByName.get(name) ?? [];
    entries.push(tool);
    toolsByName.set(name, entries);
  }
  const replaySafeNames = /* @__PURE__ */ new Set();
  for (const [name, entries] of toolsByName) {
    const tool = entries.length === 1 ? entries[0] : void 0;
    if (tool && isAgentToolReplaySafe(tool, options)) replaySafeNames.add(name);
  }
  return replaySafeNames;
}
//#endregion
//#region src/agents/tool-search.ts
/**
 * Tool Search catalog compaction.
 *
 * Presents large OpenClaw/MCP/client tool inventories through search, describe, call, and optional code-mode tools.
 */
const TOOL_SEARCH_CODE_MODE_TOOL_NAME = "tool_search_code";
const TOOL_SEARCH_RAW_TOOL_NAME = "tool_search";
const TOOL_DESCRIBE_RAW_TOOL_NAME = "tool_describe";
const TOOL_CALL_RAW_TOOL_NAME = "tool_call";
const TOOL_SEARCH_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
  TOOL_SEARCH_CODE_MODE_TOOL_NAME,
  TOOL_SEARCH_RAW_TOOL_NAME,
  TOOL_DESCRIBE_RAW_TOOL_NAME,
  TOOL_CALL_RAW_TOOL_NAME,
]);
const TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
  TOOL_SEARCH_RAW_TOOL_NAME,
  TOOL_DESCRIBE_RAW_TOOL_NAME,
  TOOL_CALL_RAW_TOOL_NAME,
]);
const DEFAULT_CODE_TIMEOUT_MS = 1e4;
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 20;
const MAX_REUSABLE_CATALOG_SNAPSHOTS = 256;
const MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS = 18e3;
const TOOL_DIRECTORY_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/u;
const TOOL_SEARCH_CODE_MODE_CHILD_SOURCE = String.raw`
import vm from "node:vm";

let activeController;

function send(message) {
  if (typeof process.send === "function" && process.connected) {
    process.send(message);
  }
}

function sendAndFlush(message) {
  return new Promise((resolve) => {
    if (typeof process.send !== "function" || !process.connected) {
      resolve();
      return;
    }
    try {
      process.send(message, () => resolve());
    } catch {
      resolve();
    }
  });
}

function toJsonSafe(value) {
  if (value === undefined) {
    return null;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    if (value instanceof Error) {
      return value.message;
    }
    if (value === null) {
      return null;
    }
    switch (typeof value) {
      case "string":
        return value;
      case "number":
      case "boolean":
      case "bigint":
      case "symbol":
      case "function":
        return String(value);
      default:
        return Object.prototype.toString.call(value);
    }
  }
}

function formatLogItem(value) {
  if (typeof value === "string") {
    return value;
  }
  const safe = toJsonSafe(value);
  return typeof safe === "string" ? safe : JSON.stringify(safe);
}

function bridgeResultPayload(message) {
  if (!message.ok) {
    return typeof message.error === "string" ? message.error : "tool bridge failed";
  }
  const json = JSON.stringify(toJsonSafe(message.value));
  return typeof json === "string" ? json : "null";
}

function settleBridge(message) {
  if (!activeController) {
    return;
  }
  const id = typeof message?.id === "string" ? message.id : "";
  try {
    activeController.settleBridge(id, Boolean(message.ok), bridgeResultPayload(message));
  } catch (error) {
    send({
      type: "result",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function buildModelScriptSource(code) {
  return "(async (openclaw, console) => {\n" + code + "\n})(openclaw, console)";
}

function buildControllerSource() {
  // The controller returns promise-like bridge handles. The model code can await
  // them naturally, while the parent process serializes real tool calls.
  return (
    '"use strict";\n' +
    "(() => {\n" +
    "const pending = new Map();\n" +
    "const bridgeMessages = [];\n" +
    "const logs = [];\n" +
    "let idleWaiters = [];\n" +
    "let nextBridgeId = 1;\n" +
    toJsonSafe.toString() +
    "\n" +
    formatLogItem.toString() +
    "\n" +
    "function notifyBridgeIdle() {\n" +
    "  if (pending.size !== 0 || bridgeMessages.length !== 0) return;\n" +
    "  const waiters = idleWaiters;\n" +
    "  idleWaiters = [];\n" +
    "  for (const resolve of waiters) resolve();\n" +
    "}\n" +
    "function isBridgeIdle() {\n" +
    "  return pending.size === 0 && bridgeMessages.length === 0;\n" +
    "}\n" +
    "function waitForBridgeIdle() {\n" +
    "  if (isBridgeIdle()) return Promise.resolve();\n" +
    "  return new Promise((resolve) => idleWaiters.push(resolve));\n" +
    "}\n" +
    "function bridge(method, args) {\n" +
    "  let promise;\n" +
    "  const start = () => {\n" +
    "    if (!promise) {\n" +
    "      const id = String(nextBridgeId++);\n" +
    "      promise = new Promise((resolve, reject) => {\n" +
    "        pending.set(id, { resolve, reject });\n" +
    "        bridgeMessages.push({ id, method, args: toJsonSafe(args) });\n" +
    "      });\n" +
    "    }\n" +
    "    return promise;\n" +
    "  };\n" +
    "  return Object.freeze({\n" +
    "    then: (resolve, reject) => start().then(resolve, reject),\n" +
    "    catch: (reject) => start().catch(reject),\n" +
    "    finally: (onFinally) => start().finally(onFinally),\n" +
    "  });\n" +
    "}\n" +
    "const console = Object.freeze({\n" +
    "  log: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "  warn: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "  error: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "});\n" +
    "const openclaw = Object.freeze({\n" +
    "  tools: Object.freeze({\n" +
    "    search: (query, options) => bridge('search', [query, options]),\n" +
    "    describe: (id) => bridge('describe', [id]),\n" +
    "    call: (id, input) => bridge('call', [id, input]),\n" +
    "  }),\n" +
    "});\n" +
    "return Object.freeze({\n" +
    "  openclaw,\n" +
    "  console,\n" +
    "  isBridgeIdle,\n" +
    "  waitForBridgeIdle,\n" +
    "  takeLogs: () => logs.splice(0),\n" +
    "  takeBridgeMessages: () => bridgeMessages.splice(0),\n" +
    "  settleBridge: (id, ok, payload) => {\n" +
    "    const waiter = pending.get(String(id));\n" +
    "    if (!waiter) return;\n" +
    "    pending.delete(String(id));\n" +
    "    if (ok) {\n" +
    "      waiter.resolve(JSON.parse(String(payload)));\n" +
    "    } else {\n" +
    "      waiter.reject(new Error(String(payload)));\n" +
    "    }\n" +
    "    Promise.resolve().then(notifyBridgeIdle);\n" +
    "  },\n" +
    "});\n" +
    "})()"
  );
}

function pumpController(controller) {
  for (const items of controller.takeLogs()) {
    send({ type: "log", items });
  }
  for (const message of controller.takeBridgeMessages()) {
    send({ type: "bridge", id: message.id, method: message.method, args: message.args });
  }
}

async function runModelCode(code, timeoutMs) {
  const sandbox = Object.create(null);
  const context = vm.createContext(sandbox, {
    name: "tool_search_code",
    codeGeneration: { strings: false, wasm: false },
  });
  const controllerScript = new vm.Script(buildControllerSource(), {
    filename: "tool_search_code:controller.js",
  });
  const controller = controllerScript.runInContext(context, {
    timeout: Math.max(1, Math.min(Number(timeoutMs) || 1, 2147483647)),
    breakOnSigint: false,
  });
  Object.defineProperties(sandbox, {
    console: { value: controller.console, enumerable: true },
    openclaw: { value: controller.openclaw, enumerable: true },
  });
  activeController = controller;
  const pumpTimer = setInterval(() => pumpController(controller), 1);
  try {
    const modelScript = new vm.Script(buildModelScriptSource(code), {
      filename: "tool_search_code:model.js",
    });
    const result = await Promise.resolve(
      modelScript.runInContext(context, {
        timeout: Math.max(1, Math.min(Number(timeoutMs) || 1, 2147483647)),
        breakOnSigint: false,
      }),
    ).then(
      (value) => ({ ok: true, value: toJsonSafe(value) }),
      (error) => ({ ok: false, error: error instanceof Error ? error.message : String(error) }),
    );
    do {
      pumpController(controller);
      await controller.waitForBridgeIdle();
      pumpController(controller);
    } while (!controller.isBridgeIdle());
    pumpController(controller);
    await sendAndFlush(
      result.ok
        ? { type: "result", ok: true, value: result.value }
        : { type: "result", ok: false, error: result.error },
    );
  } finally {
    clearInterval(pumpTimer);
    activeController = undefined;
  }
}

process.on("message", (message) => {
  if (message?.type === "bridge-result") {
    settleBridge(message);
    return;
  }
  if (message?.type !== "run") {
    return;
  }
  const code = typeof message.code === "string" ? message.code : "";
  runModelCode(code, message.timeoutMs).catch((error) => {
    return sendAndFlush({
      type: "result",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }).finally(() => {
    setTimeout(() => process.exit(0), 100);
  });
});
`;
const SESSION_CATALOGS_KEY = Symbol.for("openclaw.toolSearch.sessionCatalogs");
const globalToolSearchState = globalThis;
const sessionCatalogs =
  globalToolSearchState[SESSION_CATALOGS_KEY] ??
  (globalToolSearchState[SESSION_CATALOGS_KEY] = /* @__PURE__ */ new Map());
const reusableCatalogSnapshots = /* @__PURE__ */ new Map();
const catalogFingerprints = /* @__PURE__ */ new WeakMap();
const catalogToolIdentities = /* @__PURE__ */ new WeakMap();
let nextCatalogToolIdentity = 1;
function readToolSearchConfig(config) {
  const toolSearch = (isRecord(config?.tools) ? config.tools : void 0)?.toolSearch;
  if (toolSearch === true) return { enabled: true };
  if (toolSearch === false) return { enabled: false };
  return isRecord(toolSearch) ? toolSearch : {};
}
function readBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function readInteger(value, fallback) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
function isToolSearchCodeModeSupported() {
  return process.allowedNodeEnvironmentFlags.has("--permission");
}
function resolveMinCodeTimeoutMs() {
  return 1e3;
}
function resolveToolSearchConfig(config) {
  const raw = readToolSearchConfig(config);
  const rawMode = typeof raw.mode === "string" ? raw.mode : "code";
  const requestedMode =
    rawMode === "tools" || rawMode === "directory" || rawMode === "code" ? rawMode : "code";
  const mode =
    requestedMode === "code" && !isToolSearchCodeModeSupported() ? "tools" : requestedMode;
  const configured = Object.keys(raw).some((key) => key !== "enabled");
  const maxSearchLimit = Math.max(
    1,
    Math.min(50, readInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT)),
  );
  return {
    enabled: readBoolean(raw.enabled, configured),
    mode,
    codeTimeoutMs: Math.max(
      resolveMinCodeTimeoutMs(),
      Math.min(6e4, readInteger(raw.codeTimeoutMs, DEFAULT_CODE_TIMEOUT_MS)),
    ),
    searchDefaultLimit: Math.max(
      1,
      Math.min(maxSearchLimit, readInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT)),
    ),
    maxSearchLimit,
  };
}
function sessionCatalogKeys(input) {
  const runId = input.runId?.trim();
  if (runId) return [`run:${runId}`];
  const keys = [];
  if (input.sessionId?.trim()) keys.push(`session:${input.sessionId.trim()}`);
  if (input.sessionKey?.trim()) keys.push(`key:${input.sessionKey.trim()}`);
  if (input.agentId?.trim()) keys.push(`agent:${input.agentId.trim()}`);
  return uniqueStrings(keys);
}
function sessionCatalogKey(input) {
  return sessionCatalogKeys(input)[0];
}
function reusableCatalogKey(input) {
  return sessionCatalogKey({
    sessionId: input.sessionId,
    sessionKey: input.sessionKey,
    agentId: input.agentId,
  });
}
function stableJsonFingerprint(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "undefined";
  if (seen.has(value)) return '"[Circular]"';
  seen.add(value);
  if (Array.isArray(value))
    return `[${value.map((item) => stableJsonFingerprint(item, seen)).join(",")}]`;
  const record = value;
  return `{${Object.keys(record)
    .toSorted()
    .map((key) => `${JSON.stringify(key)}:${stableJsonFingerprint(record[key], seen)}`)
    .join(",")}}`;
}
function catalogToolIdentity(tool) {
  const existing = catalogToolIdentities.get(tool);
  if (existing !== void 0) return existing;
  const next = nextCatalogToolIdentity;
  nextCatalogToolIdentity += 1;
  catalogToolIdentities.set(tool, next);
  return next;
}
function catalogEntriesFingerprint(entries) {
  return entries
    .map((entry) =>
      [
        entry.id,
        entry.source,
        entry.sourceName ?? "",
        stableJsonFingerprint(entry.mcp),
        entry.name,
        entry.label ?? "",
        entry.description,
        stableJsonFingerprint(entry.parameters),
        String(catalogToolIdentity(entry.tool)),
      ]
        .map((part) => JSON.stringify(part))
        .join(":"),
    )
    .toSorted()
    .join("\n");
}
function restoreToolSearchCatalog(params) {
  const keys = sessionCatalogKeys(params);
  if (keys.length === 0 && !params.catalogRef) return;
  const next = {
    entries: params.entries,
    searchCount: 0,
    describeCount: 0,
    callCount: 0,
  };
  if (params.catalogRef) params.catalogRef.current = next;
  catalogFingerprints.set(next, params.fingerprint);
  for (const key of keys) sessionCatalogs.set(key, next);
  return next;
}
function bindToolSearchCatalog(params) {
  if (params.catalogRef) params.catalogRef.current = params.catalog;
  for (const key of sessionCatalogKeys(params)) sessionCatalogs.set(key, params.catalog);
}
function rememberReusableCatalog(key, catalog) {
  if (!key) return;
  const fingerprint = catalogFingerprints.get(catalog);
  if (!fingerprint) return;
  if (reusableCatalogSnapshots.has(key)) reusableCatalogSnapshots.delete(key);
  reusableCatalogSnapshots.set(key, {
    entries: catalog.entries,
    fingerprint,
  });
  while (reusableCatalogSnapshots.size > MAX_REUSABLE_CATALOG_SNAPSHOTS) {
    const oldestKey = reusableCatalogSnapshots.keys().next().value;
    if (!oldestKey) break;
    reusableCatalogSnapshots.delete(oldestKey);
  }
}
function classifyTool(tool) {
  const meta = getPluginToolMeta(tool);
  const pluginId = meta?.pluginId?.trim();
  const mcp = meta?.mcp;
  if (mcp)
    return {
      source: "mcp",
      sourceName: mcp.safeServerName || pluginId || "mcp",
      mcp,
    };
  if (pluginId === "bundle-mcp")
    return {
      source: "mcp",
      sourceName: pluginId,
    };
  if (pluginId)
    return {
      source: "openclaw",
      sourceName: pluginId,
    };
  return {
    source: "openclaw",
    sourceName: "core",
  };
}
function makeCatalogId(tool, source, sourceName) {
  return `${source}:${sourceName?.trim() || "core"}:${tool.name}`;
}
function wrapCatalogTool(tool, hookContext) {
  if (!hookContext || isToolWrappedWithBeforeToolCallHook(tool)) return tool;
  return wrapToolWithBeforeToolCallHook(tool, hookContext);
}
function toCatalogEntry(tool, sourceOverride, hookContext) {
  const classified = classifyTool(tool);
  const source = sourceOverride ?? classified.source;
  const sourceName = sourceOverride === "client" ? "client" : classified.sourceName;
  const catalogTool = source === "client" ? tool : wrapCatalogTool(tool, hookContext);
  return {
    id: makeCatalogId(tool, source, sourceName),
    source,
    sourceName,
    ...(source === "mcp" && classified.mcp ? { mcp: classified.mcp } : {}),
    name: tool.name,
    label: tool.label,
    description: tool.description ?? "",
    parameters: tool.parameters,
    tool: catalogTool,
  };
}
function shouldCatalogTool(tool) {
  if (TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)) return false;
  return tool.catalogMode !== "direct-only";
}
/**
 * Register a catalog owned only by an explicit ref (no session keys), for
 * headless callers like cron trigger evaluation. Registration internals stay
 * module-private; this is the single public seam for ref-only catalogs.
 */
function registerHeadlessToolSearchCatalog(params) {
  const { catalogRef, tools, hookContext } = params;
  registerToolSearchCatalog({
    catalogRef,
    entries: tools
      .filter((tool) => shouldCatalogTool(tool))
      .map((tool) => {
        return toCatalogEntry(
          hookContext && isToolWrappedWithBeforeToolCallHook(tool)
            ? rewrapToolWithBeforeToolCallHook(tool, hookContext)
            : tool,
          void 0,
          hookContext,
        );
      }),
  });
}
function collectUniqueCatalogToolNames(tools) {
  const nameCounts = /* @__PURE__ */ new Map();
  for (const tool of tools)
    if (shouldCatalogTool(tool)) nameCounts.set(tool.name, (nameCounts.get(tool.name) ?? 0) + 1);
  return new Set(
    Array.from(nameCounts)
      .filter(([, count]) => count === 1)
      .map(([name]) => name),
  );
}
function shouldExposeControlTool(name, mode) {
  if (name === "tool_search_code") return mode === "code";
  if (name === "tool_search" || name === "tool_describe" || name === "tool_call")
    return mode === "tools";
  return false;
}
function readMessageToolResultId(message) {
  const record = message;
  const role = typeof record.role === "string" ? record.role : "";
  const canUseDirectId = role === "toolResult" || role === "tool";
  const direct = record.toolCallId ?? record.toolUseId ?? record.tool_use_id;
  if (canUseDirectId && typeof direct === "string" && direct.trim()) return direct;
  const content = record.content;
  if (!Array.isArray(content)) return;
  for (const block of content) {
    if (!isRecord(block)) continue;
    if (block.type !== "toolResult") continue;
    const nested = block.toolCallId ?? block.toolUseId ?? block.tool_use_id ?? block.id;
    if (typeof nested === "string" && nested.trim()) return nested;
  }
}
function textFromToolSearchProjectionResult(result, isError) {
  if (isRecord(result)) {
    const detailError = (isRecord(result.details) ? result.details : void 0)?.error;
    if (typeof detailError === "string" && detailError.trim()) return detailError;
    const content = result.content;
    if (Array.isArray(content)) {
      const text = content
        .map((item) => (isRecord(item) && typeof item.text === "string" ? item.text : ""))
        .filter(Boolean)
        .join("\n");
      if (text.trim()) return text;
    }
  }
  const safe = toJsonSafe(result);
  if (typeof safe === "string") return safe;
  const encoded = JSON.stringify(safe);
  if (typeof encoded === "string") return encoded;
  return isError ? "Tool Search target tool failed." : "Tool Search target tool completed.";
}
function buildToolSearchTargetTranscriptMessages(projection) {
  const input = toJsonSafe(projection.input);
  const timestamp = projection.timestamp ?? Date.now();
  const resultRecord = isRecord(projection.result) ? projection.result : void 0;
  const resultContent =
    Array.isArray(resultRecord?.content) && resultRecord.content.length > 0
      ? toJsonSafe(resultRecord.content)
      : [
          {
            type: "text",
            text: textFromToolSearchProjectionResult(
              projection.result,
              projection.isError === true,
            ),
          },
        ];
  return [
    {
      role: "assistant",
      content: [
        {
          type: "toolCall",
          id: projection.toolCallId,
          name: projection.toolName,
          arguments: input,
          input,
        },
      ],
      stopReason: "toolUse",
      timestamp,
    },
    {
      role: "toolResult",
      toolCallId: projection.toolCallId,
      toolName: projection.toolName,
      isError: projection.isError === true,
      content: resultContent,
      timestamp,
    },
  ];
}
function projectToolSearchTargetTranscriptMessages(messages, projections) {
  if (projections.length === 0) return messages;
  const byParent = /* @__PURE__ */ new Map();
  const unmatched = [];
  for (const projection of projections) {
    const parent = projection.parentToolCallId?.trim();
    if (!parent) {
      unmatched.push(projection);
      continue;
    }
    const group = byParent.get(parent) ?? [];
    group.push(projection);
    byParent.set(parent, group);
  }
  const inserted = /* @__PURE__ */ new Set();
  const projected = [];
  for (const message of messages) {
    projected.push(message);
    const toolResultId = readMessageToolResultId(message);
    const group = toolResultId ? byParent.get(toolResultId) : void 0;
    if (!group) continue;
    for (const projection of group) {
      projected.push(...buildToolSearchTargetTranscriptMessages(projection));
      inserted.add(projection);
    }
  }
  for (const projection of [...unmatched, ...projections]) {
    if (inserted.has(projection)) continue;
    projected.push(...buildToolSearchTargetTranscriptMessages(projection));
    inserted.add(projection);
  }
  return projected;
}
/** Create an explicit catalog holder for callers that cannot rely on session keys. */
function createToolSearchCatalogRef() {
  return {};
}
/** Replace visible tools with Tool Search controls and register hidden catalog entries. */
function applyToolSearchCatalog(params) {
  const config = resolveToolSearchConfig(params.config);
  return applyToolCatalogCompaction({
    ...params,
    enabled: config.enabled,
    isVisibleControlTool: (tool) =>
      TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name) &&
      shouldExposeControlTool(tool.name, config.mode),
  });
}
/** Keep tool names discoverable while deferring heavyweight JSON schemas behind describe/call. */
function applyToolSchemaDirectoryCatalog(params) {
  const config = resolveToolSearchConfig(params.config);
  if (!config.enabled)
    return {
      tools: params.tools,
      compacted: false,
      catalogToolCount: 0,
      catalogRegistered: false,
      catalogReused: false,
    };
  if (!params.tools.some((tool) => tool.name === "tool_search"))
    return {
      tools: params.tools.filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)),
      compacted: false,
      catalogToolCount: 0,
      catalogRegistered: false,
      catalogReused: false,
    };
  const hydrateToolNames = new Set(
    normalizeStringEntries(Array.from(params.hydrateToolNames ?? [])),
  );
  const uniqueCatalogToolNames = collectUniqueCatalogToolNames(params.tools);
  return applyToolCatalogCompaction({
    ...params,
    enabled: config.enabled,
    isVisibleControlTool: (tool) => TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES.has(tool.name),
    isVisibleCatalogTool: (tool) =>
      hydrateToolNames.has(tool.name) && uniqueCatalogToolNames.has(tool.name),
  });
}
function buildToolSchemaDirectoryPrompt(ctx, options) {
  return formatToolSearchCatalogDirectory(
    new ToolSearchRuntime(ctx, resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config)).all(
      options,
    ),
  );
}
/** Resolve an exact hidden catalog tool name without exposing fuzzy search or catalog ids. */
function resolveToolSearchCatalogTool(ctx, name, options) {
  if (typeof name !== "string") return;
  const needle = name.trim();
  if (!needle) return;
  try {
    const matches = visibleCatalogEntries(resolveCatalog(ctx), options).filter(
      (entry) => entry.name === needle,
    );
    return matches.length === 1 ? matches[0]?.tool : void 0;
  } catch (error) {
    if (error instanceof ToolInputError) return;
    throw error;
  }
}
/** Move client-provided tools into an existing Tool Search catalog. */
function addClientToolsToToolSearchCatalog(params) {
  const config = resolveToolSearchConfig(params.config);
  if (config.mode === "directory")
    return {
      tools: params.tools,
      compacted: false,
      catalogToolCount: 0,
    };
  return addClientToolsToToolCatalog({
    ...params,
    enabled: config.enabled,
  });
}
/** Register catalog entries under run/session keys and optional direct refs. */
function registerToolSearchCatalog(params) {
  const keys = sessionCatalogKeys(params);
  const primaryKey = keys[0];
  if (!primaryKey && !params.catalogRef) return;
  const prior = params.append
    ? (params.catalogRef?.current ?? (primaryKey ? sessionCatalogs.get(primaryKey) : void 0))
    : void 0;
  const byId = /* @__PURE__ */ new Map();
  for (const entry of prior?.entries ?? []) byId.set(entry.id, entry);
  for (const entry of params.entries) {
    byId.set(entry.id, entry);
    byId.set(entry.name, entry);
  }
  const next = {
    entries: uniqueValues(byId.values()).toSorted((a, b) => a.id.localeCompare(b.id)),
    searchCount: prior?.searchCount ?? 0,
    describeCount: prior?.describeCount ?? 0,
    callCount: prior?.callCount ?? 0,
  };
  catalogFingerprints.set(next, catalogEntriesFingerprint(next.entries));
  if (params.catalogRef) params.catalogRef.current = next;
  for (const key of keys) sessionCatalogs.set(key, next);
  return next;
}
/** Clear Tool Search catalog state for a run/session/ref. */
function clearToolSearchCatalog(params) {
  if (params.catalogRef) params.catalogRef.current = void 0;
  for (const key of sessionCatalogKeys(params)) sessionCatalogs.delete(key);
  if (!params.runId?.trim()) {
    const snapshotKey = reusableCatalogKey(params);
    if (snapshotKey) reusableCatalogSnapshots.delete(snapshotKey);
  }
}
function resolveCatalog(ctx) {
  if (ctx.catalogRef?.current) return ctx.catalogRef.current;
  const keys = sessionCatalogKeys({
    sessionId: ctx.sessionId,
    sessionKey: ctx.sessionKey,
    agentId: ctx.agentId,
    runId: ctx.runId,
  });
  for (const key of keys) {
    const catalog = sessionCatalogs.get(key);
    if (catalog) return catalog;
  }
  if (ctx.runId?.trim())
    throw new ToolInputError("Tool Search catalog is unavailable for this run.");
  const uniqueCatalogs = uniqueValues(sessionCatalogs.values());
  if (uniqueCatalogs.length === 1) {
    const catalog = uniqueCatalogs[0];
    if (catalog) return catalog;
  }
  throw new ToolInputError("Tool Search catalog is unavailable for this run.");
}
function compactEntry(entry) {
  return {
    id: entry.id,
    source: entry.source,
    sourceName: entry.sourceName,
    ...(entry.mcp ? { mcp: entry.mcp } : {}),
    name: entry.name,
    label: entry.label,
    description: entry.description,
  };
}
function compactDirectoryDescription(description) {
  const normalized = description.replace(/\s+/g, " ").trim();
  if (normalized.length <= 180) return normalized;
  return `${truncateUtf16Safe(normalized, 177).trimEnd()}...`;
}
function formatToolDirectoryIdentifier(value) {
  const trimmed = value?.trim();
  return trimmed && TOOL_DIRECTORY_IDENTIFIER_RE.test(trimmed) ? trimmed : void 0;
}
function formatToolDirectoryEntry(entry) {
  if (entry.source !== "openclaw") return;
  const name = formatToolDirectoryIdentifier(entry.name);
  if (!name) return;
  const description = compactDirectoryDescription(entry.description);
  const ownerName = formatToolDirectoryIdentifier(entry.sourceName);
  return `- ${name}${ownerName ? ` (${ownerName})` : ""}: ${description || "No description."}`;
}
function renderToolSearchCatalogDirectory(lines, total) {
  const omitted = total - lines.length;
  const footer =
    omitted > 0
      ? `${omitted} additional tools omitted. Use tool_search to find them, then tool_describe to load a full schema before tool_call.`
      : "Call tool_describe with a listed tool name to load its full schema before using tool_call.";
  return ["Available deferred-schema tools:", ...lines, "", footer].join("\n");
}
function formatToolSearchCatalogDirectory(entries) {
  if (entries.length === 0) return "Available deferred-schema tools: none.";
  const nameCounts = /* @__PURE__ */ new Map();
  for (const entry of entries) nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
  const lines = entries
    .filter((entry) => nameCounts.get(entry.name) === 1)
    .toSorted((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id))
    .map(formatToolDirectoryEntry)
    .filter((line) => Boolean(line));
  const fullDirectory = renderToolSearchCatalogDirectory(lines, entries.length);
  if (fullDirectory.length <= MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS) return fullDirectory;
  let low = 0;
  let high = lines.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (
      renderToolSearchCatalogDirectory(lines.slice(0, middle), entries.length).length <=
      MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS
    )
      low = middle;
    else high = middle - 1;
  }
  return renderToolSearchCatalogDirectory(lines.slice(0, low), entries.length);
}
const TOOL_DIRECTORY_HYDRATION_KEYWORDS = [
  {
    terms: ["search", "lookup", "look", "find", "current", "today", "price", "latest", "news"],
    toolHints: ["searxng", "web"],
    weight: 8,
  },
  {
    terms: ["url", "link", "page", "fetch", "read", "article", "http", "https"],
    toolHints: ["fetch", "browser"],
    weight: 8,
  },
  {
    terms: ["send", "reply", "message", "post", "react", "embed", "discord", "imessage"],
    toolHints: ["message", "session", "send"],
    weight: 7,
  },
  {
    terms: ["file", "path", "read", "write", "edit", "patch", "grep", "list"],
    toolHints: ["read", "write", "edit", "grep", "find", "ls", "patch"],
    weight: 6,
  },
  {
    terms: ["run", "command", "shell", "terminal", "build", "test", "pnpm", "git"],
    toolHints: ["exec", "process"],
    weight: 7,
  },
  {
    terms: [
      "remember",
      "recall",
      "memory",
      "memories",
      "known",
      "history",
      "previous",
      "prior",
      "earlier",
      "decided",
      "decision",
      "discussed",
    ],
    toolHints: ["memory"],
    weight: 6,
  },
  {
    terms: ["remind", "schedule", "later", "tomorrow", "daily", "weekly", "cron"],
    toolHints: ["cron", "automation", "heartbeat"],
    weight: 8,
  },
  {
    terms: ["image", "picture", "photo", "meme", "gif", "screenshot", "visual"],
    toolHints: ["image", "vision", "browser"],
    weight: 6,
  },
  {
    terms: ["audio", "voice", "speak", "tts", "transcribe"],
    toolHints: ["audio", "voice", "tts"],
    weight: 6,
  },
];
function readToolDirectoryIntent(query) {
  const tokens = new Set(tokenize(query));
  const hasCurrentFact = ["current", "today", "latest", "price", "weather", "news"].some((term) =>
    tokens.has(term),
  );
  const hasExplicitMemoryRecall = [
    "remember",
    "recall",
    "memory",
    "memories",
    "known",
    "history",
    "previous",
    "prior",
    "earlier",
    "decided",
    "decision",
    "discussed",
  ].some((term) => tokens.has(term));
  const hasIdentityRecall =
    /\b(?:do you know|who (?:is|are|was)|what did (?:we|i|you|they)|when did (?:we|i|you|they))\b/iu.test(
      query,
    );
  return {
    tokens,
    hasUrl: tokens.has("http") || tokens.has("https") || /https?:\/\//iu.test(query),
    hasFilePath: tokens.has("/") || /(^|\s)(\.{1,2}\/|\/|[a-z]:\\)/iu.test(query),
    hasMention: /<@!?\d+>/u.test(query) || tokens.has("discord"),
    hasSchedule: ["remind", "schedule", "later", "tomorrow", "daily", "weekly", "cron"].some(
      (term) => tokens.has(term),
    ),
    hasCurrentFact,
    hasMemoryRecall: hasExplicitMemoryRecall || (hasIdentityRecall && !hasCurrentFact),
  };
}
function classifyDirectoryToolFamilies(tool, intent) {
  const toolText = `${tool.name} ${tool.description ?? ""}`.toLowerCase();
  const families = /* @__PURE__ */ new Set();
  if (TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)) return families;
  const hasMemoryToolSignal =
    /\b(?:memory|memories|recall|remember|history|prior|knowledge|libravdb)\b/iu.test(toolText) ||
    /(?:^|_)(?:memory|recall|remember|libravdb)(?:_|$)/iu.test(tool.name);
  const hasWebToolSignal =
    /\b(?:web|internet|online|browser|url|http|https|page|article|fetch|crawl|searxng|google|bing|brave|tavily|duckduckgo|serp)\b/iu.test(
      toolText,
    ) ||
    /(?:^|_)(?:web|fetch|browser|searxng|google|bing|brave|tavily|duckduckgo|serp)(?:_|$)/iu.test(
      tool.name,
    );
  const hasWebIntent =
    intent.hasUrl ||
    intent.hasCurrentFact ||
    ["search", "lookup", "look", "find", "current", "today", "price", "latest", "news"].some(
      (term) => intent.tokens.has(term),
    );
  if (hasWebToolSignal && hasWebIntent) families.add("web");
  if (hasMemoryToolSignal && intent.hasMemoryRecall) families.add("memory");
  return families;
}
function scoreDirectoryTool(tool, intent) {
  const toolText = `${tool.name} ${tool.description ?? ""}`.toLowerCase();
  const toolTokens = new Set(tokenize(toolText));
  let score = 0;
  for (const token of toolTokens) if (intent.tokens.has(token)) score += 2;
  for (const group of TOOL_DIRECTORY_HYDRATION_KEYWORDS) {
    if (!group.terms.some((term) => intent.tokens.has(term))) continue;
    if (group.toolHints.some((hint) => toolText.includes(hint))) score += group.weight;
  }
  if (intent.hasUrl && /fetch|browser|web/iu.test(toolText)) score += 10;
  if (intent.hasFilePath && /read|write|edit|grep|find|ls|file|patch/iu.test(toolText)) score += 8;
  if (intent.hasMention && /message|discord|react|send/iu.test(toolText)) score += 8;
  if (intent.hasSchedule && /cron|schedule|remind|heartbeat|automation/iu.test(toolText))
    score += 8;
  if (
    intent.hasCurrentFact &&
    /searxng|web|internet|online|fetch|weather|finance|price|google|bing|brave|tavily|duckduckgo|serp/iu.test(
      toolText,
    )
  )
    score += 8;
  if (
    intent.hasMemoryRecall &&
    /memory|memories|recall|remember|history|prior|knowledge|libravdb/iu.test(toolText)
  )
    score += 8;
  return score;
}
function expandDirectoryHydrationGroups(params) {
  if (params.maxTools <= 0) return [];
  const emitted = /* @__PURE__ */ new Set();
  const expandedFamilies = /* @__PURE__ */ new Set();
  const expanded = [];
  const toolsByName = new Map(params.tools.map((tool) => [tool.name, tool]));
  const toolsByFamily = /* @__PURE__ */ new Map();
  const selectedRank = new Map(params.selectedNames.map((name, index) => [name, index]));
  for (const tool of params.tools)
    for (const family of classifyDirectoryToolFamilies(tool, params.intent)) {
      const names = toolsByFamily.get(family) ?? [];
      names.push(tool.name);
      toolsByFamily.set(family, names);
    }
  for (const names of toolsByFamily.values())
    names.sort(
      (a, b) =>
        (selectedRank.get(a) ?? Number.MAX_SAFE_INTEGER) -
          (selectedRank.get(b) ?? Number.MAX_SAFE_INTEGER) || a.localeCompare(b),
    );
  for (const selectedName of params.selectedNames) {
    if (expanded.length >= params.maxTools) break;
    if (!emitted.has(selectedName)) {
      expanded.push(selectedName);
      emitted.add(selectedName);
    }
    if (expanded.length >= params.maxTools) break;
    const selectedTool = toolsByName.get(selectedName);
    if (!selectedTool) continue;
    for (const family of classifyDirectoryToolFamilies(selectedTool, params.intent)) {
      if (expandedFamilies.has(family)) continue;
      expandedFamilies.add(family);
      for (const groupedName of toolsByFamily.get(family) ?? []) {
        if (expanded.length >= params.maxTools) return expanded;
        if (emitted.has(groupedName)) continue;
        expanded.push(groupedName);
        emitted.add(groupedName);
      }
    }
  }
  return expanded;
}
function estimateToolSchemaDirectoryToolNames(params) {
  const maxTools = Math.max(0, Math.min(12, params.maxTools ?? 4));
  const hydratableTools = [];
  const externalToolNames = /* @__PURE__ */ new Set();
  const uniqueCatalogToolNames = collectUniqueCatalogToolNames(params.tools);
  for (const tool of params.tools) {
    if (!uniqueCatalogToolNames.has(tool.name)) continue;
    if (classifyTool(tool).source === "mcp") {
      externalToolNames.add(tool.name);
      continue;
    }
    hydratableTools.push(tool);
  }
  const required = normalizeStringEntries(Array.from(params.requiredToolNames ?? [])).filter(
    (name) => !externalToolNames.has(name),
  );
  const requiredSet = new Set(required);
  const query = params.query?.trim() ?? "";
  if (!query && required.length >= maxTools) return required.slice(0, maxTools);
  const intent = readToolDirectoryIntent(query);
  const scored = hydratableTools
    .filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name))
    .map((tool) => ({
      name: tool.name,
      score: requiredSet.has(tool.name)
        ? Number.MAX_SAFE_INTEGER
        : scoreDirectoryTool(tool, intent),
    }))
    .filter((entry) => entry.score > 0)
    .toSorted((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return expandDirectoryHydrationGroups({
    selectedNames: uniqueStrings([...required, ...scored.map((entry) => entry.name)]),
    tools: hydratableTools,
    intent,
    maxTools,
  });
}
function describeEntry(entry) {
  return {
    ...compactEntry(entry),
    parameters: entry.parameters ?? {},
  };
}
function tokenize(input) {
  return normalizeStringEntries(input.toLowerCase().split(/[^a-z0-9_./:-]+/u));
}
function scoreEntry(entry, terms) {
  if (terms.length === 0) return 1;
  const name = entry.name.toLowerCase();
  const id = entry.id.toLowerCase();
  const label = (entry.label ?? "").toLowerCase();
  const description = entry.description.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (name === term || id === term) score += 20;
    if (name.includes(term)) score += 8;
    if (id.includes(term)) score += 6;
    if (label.includes(term)) score += 4;
    if (description.includes(term)) score += 2;
  }
  return score;
}
function visibleCatalogEntries(catalog, options) {
  return options?.includeMcp === false
    ? catalog.entries.filter((entry) => entry.source !== "mcp")
    : catalog.entries;
}
function tokenizeLookupValue(input) {
  return new Set(normalizeStringEntries(input.toLowerCase().split(/[^a-z0-9]+/u)));
}
function scoreUnknownToolSuggestion(needle, entry) {
  const normalizedNeedle = needle.toLowerCase();
  const name = entry.name.toLowerCase();
  const id = entry.id.toLowerCase();
  const label = (entry.label ?? "").toLowerCase();
  const description = entry.description.toLowerCase();
  const needleTokens = tokenizeLookupValue(needle);
  const entryTokens = tokenizeLookupValue(
    `${entry.name} ${entry.id} ${entry.label ?? ""} ${entry.description}`,
  );
  let score = 0;
  if ((name && normalizedNeedle.includes(name)) || id.includes(normalizedNeedle)) score += 40;
  if (name && needleTokens.has(name)) score += 40;
  for (const token of needleTokens) if (entryTokens.has(token)) score += 12;
  if (label.includes(normalizedNeedle) || description.includes(normalizedNeedle)) score += 8;
  return score;
}
function formatUnknownToolIdError(needle, entries, options = {}) {
  const nameCounts = /* @__PURE__ */ new Map();
  for (const entry of entries) nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
  const suggestions = uniqueStrings(
    entries
      .map((entry) => ({
        value: options.exactIdOnly || (nameCounts.get(entry.name) ?? 0) > 1 ? entry.id : entry.name,
        score: scoreUnknownToolSuggestion(needle, entry),
      }))
      .filter((candidate) => candidate.score > 0)
      .toSorted((a, b) => b.score - a.score || a.value.localeCompare(b.value))
      .map((candidate) => candidate.value),
  ).slice(0, 3);
  const recoveryText =
    options.recoverySurface === "code-mode"
      ? "Use openclaw.tools.search to find a tool, openclaw.tools.describe to inspect it, then openclaw.tools.call with the exact id or name."
      : options.recoverySurface === "tools"
        ? "Use tools.search to find a tool, tools.describe to inspect it, then tools.call with the exact id or name."
        : "Use tool_search to find a tool, tool_describe to inspect it, then tool_call with the exact id or name.";
  if (suggestions.length === 0) return `Unknown tool id: ${needle}. ${recoveryText}`;
  return `Unknown tool id: ${needle}. Did you mean: ${suggestions.join(", ")}? ${recoveryText}`;
}
function findEntry(catalog, id, options, errorOptions) {
  const needle = id.trim();
  const entries = visibleCatalogEntries(catalog, options);
  const exactIdEntry = entries.find((candidate) => candidate.id === needle);
  if (exactIdEntry) return exactIdEntry;
  const namedEntries = entries.filter((candidate) => candidate.name === needle);
  if (namedEntries.length > 1)
    throw new ToolInputError(`Ambiguous tool name: ${needle}; use an exact tool id.`);
  const namedEntry = namedEntries[0];
  if (!namedEntry)
    throw new ToolInputError(formatUnknownToolIdError(needle, entries, errorOptions));
  return namedEntry;
}
function findEntryByExactId(catalog, id, errorOptions = {}) {
  const needle = id.trim();
  const entry = catalog.entries.find((candidate) => candidate.id === needle);
  if (!entry)
    throw new ToolInputError(
      formatUnknownToolIdError(needle, catalog.entries, {
        ...errorOptions,
        exactIdOnly: true,
      }),
    );
  return entry;
}
function readId(args) {
  const params = asToolParamsRecord(args);
  const value = params.id ?? params.toolId ?? params.name;
  if (typeof value !== "string" || !value.trim())
    throw new ToolInputError("id must be a non-empty string.");
  return value.trim();
}
function readLimit(value, config) {
  if (value === void 0) return config.searchDefaultLimit;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1)
    throw new ToolInputError("limit must be a positive integer.");
  return Math.min(value, config.maxSearchLimit);
}
function readSearchArgs(args, config) {
  const params = asToolParamsRecord(args);
  const query = params.query;
  if (typeof query !== "string") throw new ToolInputError("query must be a string.");
  const options = isRecord(params.options) ? params.options : void 0;
  return {
    query,
    limit: readLimit(params.limit ?? options?.limit, config),
  };
}
function readCallArgs(args) {
  const params = asToolParamsRecord(args);
  return {
    id: readId(params),
    input: params.args ?? params.input ?? {},
  };
}
function getTelemetry(catalog) {
  const sources = {
    openclaw: 0,
    mcp: 0,
    client: 0,
  };
  for (const entry of catalog.entries) sources[entry.source] += 1;
  return {
    catalogSize: catalog.entries.length,
    sources,
    searchCount: catalog.searchCount,
    describeCount: catalog.describeCount,
    callCount: catalog.callCount,
  };
}
function sanitizeToolCallIdPart(value) {
  return (
    value
      .trim()
      .replace(/[^A-Za-z0-9_.:-]+/g, "_")
      .slice(0, 120) || "call"
  );
}
var ToolSearchRuntime = class {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.callSequence = 0;
    this.search = async (query, options) => {
      const catalog = resolveCatalog(this.ctx);
      catalog.searchCount += 1;
      const limit = readLimit(options?.limit, this.config);
      const terms = tokenize(query);
      return visibleCatalogEntries(catalog, options)
        .map((entry) => ({
          entry,
          score: scoreEntry(entry, terms),
        }))
        .filter((hit) => hit.score > 0)
        .toSorted((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
        .slice(0, limit)
        .map((hit) => compactEntry(hit.entry));
    };
    this.all = (options) => {
      return visibleCatalogEntries(resolveCatalog(this.ctx), options).map((entry) =>
        compactEntry(entry),
      );
    };
    this.namespaceEntries = () => {
      return resolveCatalog(this.ctx).entries.map((entry) =>
        Object.assign(compactEntry(entry), { parameters: entry.parameters ?? {} }),
      );
    };
    this.describe = async (id, options) => {
      const catalog = resolveCatalog(this.ctx);
      catalog.describeCount += 1;
      return describeEntry(findEntry(catalog, id, options, options));
    };
    this.call = async (id, input, options) => {
      const catalog = resolveCatalog(this.ctx);
      const entry = findEntry(catalog, id, void 0, options);
      return await this.callEntry(catalog, entry, input, options);
    };
    this.callExactId = async (id, input, options) => {
      const catalog = resolveCatalog(this.ctx);
      const entry = findEntryByExactId(catalog, id, options);
      return await this.callEntry(catalog, entry, input, options);
    };
    this.isReplaySafeExactId = (id) => {
      let entry;
      try {
        entry = findEntryByExactId(resolveCatalog(this.ctx), id);
      } catch {
        return false;
      }
      if (entry.source !== "openclaw") return false;
      const pluginMeta = getPluginToolMeta(entry.tool);
      if (pluginMeta) return pluginMeta.mcp ? false : pluginMeta.replaySafe === true;
      if (getChannelAgentToolMeta(entry.tool)) return false;
      return isAgentToolReplaySafe(entry.tool);
    };
    this.callEntry = async (catalog, entry, input, options) => {
      catalog.callCount += 1;
      const toolCallId = `tool_search_code:${sanitizeToolCallIdPart(options?.parentToolCallId ?? "direct")}:${entry.name}:${++this.callSequence}`;
      const result = await (
        this.ctx.executeTool ??
        (async (params) =>
          await params.tool.execute(
            params.toolCallId,
            params.input,
            params.signal,
            params.onUpdate,
            void 0,
          ))
      )({
        tool: entry.tool,
        toolName: entry.name,
        source: entry.source,
        sourceName: entry.sourceName,
        toolCallId,
        parentToolCallId: options?.parentToolCallId,
        input: input ?? {},
        signal: options?.signal ?? this.ctx.abortSignal,
        onUpdate: options?.onUpdate,
      });
      return {
        tool: compactEntry(entry),
        result,
      };
    };
  }
  telemetry() {
    return getTelemetry(resolveCatalog(this.ctx));
  }
};
/** Compact a native tool list into visible control tools plus hidden catalog entries. */
function applyToolCatalogCompaction(params) {
  if (!params.enabled)
    return {
      tools: params.tools,
      compacted: false,
      catalogToolCount: 0,
      catalogRegistered: false,
      catalogReused: false,
    };
  const hasControlTool = params.tools.some((tool) => params.isVisibleControlTool(tool));
  const key = sessionCatalogKey(params);
  if (!hasControlTool || (!key && !params.catalogRef))
    return {
      tools: params.tools.filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)),
      compacted: false,
      catalogToolCount: 0,
      catalogRegistered: false,
      catalogReused: false,
    };
  const visible = [];
  const catalog = [];
  const shouldCatalog = (tool) =>
    shouldCatalogTool(tool) && (params.shouldCatalogTool?.(tool) ?? true);
  for (const tool of params.tools) {
    if (params.isVisibleControlTool(tool)) {
      visible.push(tool);
      continue;
    }
    if (TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)) continue;
    if (shouldCatalog(tool)) {
      catalog.push(toCatalogEntry(tool, void 0, params.toolHookContext));
      if (!params.isVisibleCatalogTool?.(tool)) continue;
    }
    visible.push(tool);
  }
  const incomingFingerprint = catalogEntriesFingerprint(catalog);
  const existingCatalog = params.catalogRef?.current ?? (key ? sessionCatalogs.get(key) : void 0);
  if (existingCatalog && catalogFingerprints.get(existingCatalog) === incomingFingerprint) {
    bindToolSearchCatalog({
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      agentId: params.agentId,
      runId: params.runId,
      catalogRef: params.catalogRef,
      catalog: existingCatalog,
    });
    return {
      tools: visible,
      compacted: catalog.length > 0,
      catalogToolCount: catalog.length,
      catalogRegistered: true,
      catalogReused: true,
    };
  }
  const reusableKey = reusableCatalogKey(params);
  const reusableSnapshot = reusableKey ? reusableCatalogSnapshots.get(reusableKey) : void 0;
  if (reusableSnapshot?.fingerprint === incomingFingerprint) {
    restoreToolSearchCatalog({
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      agentId: params.agentId,
      runId: params.runId,
      catalogRef: params.catalogRef,
      entries: reusableSnapshot.entries,
      fingerprint: reusableSnapshot.fingerprint,
    });
    if (reusableKey) {
      reusableCatalogSnapshots.delete(reusableKey);
      reusableCatalogSnapshots.set(reusableKey, reusableSnapshot);
    }
    return {
      tools: visible,
      compacted: catalog.length > 0,
      catalogToolCount: catalog.length,
      catalogRegistered: true,
      catalogReused: true,
    };
  }
  const registered = registerToolSearchCatalog({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    runId: params.runId,
    catalogRef: params.catalogRef,
    entries: catalog,
    append: false,
  });
  if (registered) rememberReusableCatalog(reusableKey, registered);
  return {
    tools: visible,
    compacted: catalog.length > 0,
    catalogToolCount: catalog.length,
    catalogRegistered: true,
    catalogReused: false,
  };
}
/** Append client-side tool definitions to an already registered catalog. */
function addClientToolsToToolCatalog(params) {
  const key = sessionCatalogKey(params);
  if (!params.enabled || (!key && !params.catalogRef))
    return {
      tools: params.tools,
      compacted: false,
      catalogToolCount: 0,
    };
  if (!(params.catalogRef?.current ?? (key ? sessionCatalogs.get(key) : void 0)))
    return {
      tools: params.tools,
      compacted: false,
      catalogToolCount: 0,
    };
  registerToolSearchCatalog({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    runId: params.runId,
    catalogRef: params.catalogRef,
    entries: params.tools.map((tool) => toCatalogEntry(tool, "client")),
    append: true,
  });
  return {
    tools: [],
    compacted: params.tools.length > 0,
    catalogToolCount: params.tools.length,
  };
}
function toJsonSafe(value) {
  if (value === void 0) return null;
  try {
    const serialized = JSON.stringify(value);
    return serialized === void 0 ? null : JSON.parse(serialized);
  } catch {
    if (value instanceof Error) return value.message;
    if (value === null) return null;
    switch (typeof value) {
      case "string":
        return value;
      case "number":
      case "boolean":
      case "bigint":
      case "symbol":
      case "function":
        return String(value);
      default:
        return Object.prototype.toString.call(value);
    }
  }
}
async function runCodeMode(params) {
  const runtime = new ToolSearchRuntime(params.ctx, params.config);
  const logs = [];
  return {
    ok: true,
    value: toJsonSafe(
      await runCodeModeChild({
        code: params.code,
        config: params.config,
        logs,
        parentToolCallId: params.toolCallId,
        runtime,
        signal: params.signal,
        onUpdate: params.onUpdate,
      }),
    ),
    logs,
    telemetry: runtime.telemetry(),
  };
}
function buildCodeModeChildArgs() {
  if (!process.allowedNodeEnvironmentFlags.has("--permission"))
    throw new ToolInputError("tool_search_code requires a Node runtime with --permission support.");
  return ["--permission", "--input-type=module", "--eval", TOOL_SEARCH_CODE_MODE_CHILD_SOURCE];
}
function isCodeModeBridgeMethod(value) {
  return value === "search" || value === "describe" || value === "call";
}
async function runCodeModeBridgeRequest(runtime, method, args, options) {
  const values = Array.isArray(args) ? args : [];
  switch (method) {
    case "search": {
      const query = values[0];
      if (typeof query !== "string") throw new ToolInputError("search query must be a string.");
      const optionsLocal = isRecord(values[1]) ? values[1] : void 0;
      return await runtime.search(query, {
        limit: typeof optionsLocal?.limit === "number" ? optionsLocal.limit : void 0,
      });
    }
    case "describe": {
      const id = values[0];
      if (typeof id !== "string") throw new ToolInputError("describe id must be a string.");
      return await runtime.describe(id, { recoverySurface: "code-mode" });
    }
    case "call": {
      const id = values[0];
      if (typeof id !== "string") throw new ToolInputError("call id must be a string.");
      return await runtime.call(id, values[1] ?? {}, {
        ...options,
        recoverySurface: "code-mode",
      });
    }
  }
  throw new ToolInputError("Unsupported tool_search_code bridge method.");
}
function appendToolSearchCodeStderrTail(current, chunk) {
  return appendBoundedTextTail(current, chunk, SESSION_TOOL_STDERR_TAIL_BYTES);
}
function runCodeModeChild(params) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, buildCodeModeChildArgs(), {
      cwd: os.tmpdir(),
      env: {},
      stdio: ["ignore", "ignore", "pipe", "ipc"],
    });
    let stderrTail = "";
    let settled = false;
    let timedOut = false;
    let exitRejectionTimer;
    const bridgeAbortController = new AbortController();
    const settle = (callback) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (exitRejectionTimer) clearTimeout(exitRejectionTimer);
      params.signal?.removeEventListener("abort", abortFromParent);
      child.kill();
      callback();
    };
    const abortFromParent = () => {
      bridgeAbortController.abort(params.signal?.reason);
      child.kill("SIGKILL");
      settle(() => reject(/* @__PURE__ */ new Error("tool_search_code aborted")));
    };
    const timer = setTimeout(() => {
      timedOut = true;
      bridgeAbortController.abort(/* @__PURE__ */ new Error("tool_search_code timed out"));
      child.kill("SIGKILL");
      settle(() => reject(/* @__PURE__ */ new Error("tool_search_code timed out")));
    }, params.config.codeTimeoutMs);
    params.signal?.addEventListener("abort", abortFromParent, { once: true });
    if (params.signal?.aborted) {
      abortFromParent();
      return;
    }
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (chunk) => {
      stderrTail = appendToolSearchCodeStderrTail(stderrTail, chunk);
    });
    child.stderr?.on("error", (error) => {
      settle(() => reject(error));
    });
    child.on("error", (error) => {
      settle(() => reject(error));
    });
    child.on("exit", (code, signal) => {
      if (settled) return;
      const rejectOnExit = () => {
        const suffix = stderrTail.trim();
        const detail = suffix ? `: ${sliceUtf16Safe(suffix, -500)}` : "";
        settle(() =>
          reject(
            /* @__PURE__ */ new Error(
              timedOut
                ? "tool_search_code timed out"
                : `tool_search_code child exited with ${signal ?? code}${detail}`,
            ),
          ),
        );
      };
      if (code === 0 && signal === null) {
        exitRejectionTimer = setTimeout(rejectOnExit, 250);
        return;
      }
      rejectOnExit();
    });
    child.on("message", (message) => {
      if (settled) return;
      if (!isRecord(message) || typeof message.type !== "string") return;
      if (message.type === "log") {
        const items = Array.isArray(message.items) ? message.items : [];
        params.logs.push(items.map((item) => String(item)).join(" "));
        return;
      }
      if (message.type === "result") {
        if (message.ok) settle(() => resolve(message.value));
        else
          settle(() =>
            reject(new Error(typeof message.error === "string" ? message.error : "code failed")),
          );
        return;
      }
      if (message.type !== "bridge") return;
      const id = typeof message.id === "string" ? message.id : "";
      const method = isCodeModeBridgeMethod(message.method) ? message.method : void 0;
      if (!id || !method) return;
      runCodeModeBridgeRequest(params.runtime, method, message.args, {
        parentToolCallId: params.parentToolCallId,
        signal: bridgeAbortController.signal,
        onUpdate: params.onUpdate,
      })
        .then((value) => {
          if (settled || !child.connected) return;
          const response = {
            type: "bridge-result",
            id,
            ok: true,
            value: toJsonSafe(value),
          };
          child.send(response, () => void 0);
        })
        .catch((error) => {
          if (settled || !child.connected) return;
          const response = {
            type: "bridge-result",
            id,
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          };
          child.send(response, () => void 0);
        });
    });
    child.send({
      type: "run",
      code: params.code,
      timeoutMs: params.config.codeTimeoutMs,
    });
  });
}
function readCode(args) {
  const code = asToolParamsRecord(args).code;
  if (typeof code !== "string" || !code.trim())
    throw new ToolInputError("code must be a non-empty string.");
  return code;
}
/** Create Tool Search control tools for the current run/session context. */
function createToolSearchTools(ctx) {
  const config = resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config);
  const runtime = new ToolSearchRuntime(ctx, config);
  return [
    {
      name: TOOL_SEARCH_CODE_MODE_TOOL_NAME,
      label: "Tool Search Code",
      description:
        "Run JavaScript in an isolated Node subprocess with openclaw.tools.search, openclaw.tools.describe, and openclaw.tools.call for large tool catalogs.",
      parameters: Type.Object({
        code: Type.String({
          description:
            "JavaScript body for an async function. Use return to return the final value. The openclaw.tools bridge is available.",
        }),
      }),
      execute: async (toolCallId, args, signal, onUpdate) =>
        jsonResult(
          await runCodeMode({
            toolCallId,
            ctx,
            code: readCode(args),
            config,
            signal,
            onUpdate,
          }),
        ),
    },
    {
      name: TOOL_SEARCH_RAW_TOOL_NAME,
      label: "Tool Search",
      description: "Search the effective Tool Search catalog.",
      parameters: Type.Object({
        query: Type.String({ description: "Search query." }),
        limit: Type.Optional(Type.Number({ description: "Maximum number of results." })),
      }),
      execute: async (_toolCallId, args) => {
        const search = readSearchArgs(args, config);
        return jsonResult(await runtime.search(search.query, { limit: search.limit }));
      },
    },
    {
      name: TOOL_DESCRIBE_RAW_TOOL_NAME,
      label: "Tool Describe",
      description: "Load the full schema and metadata for one search result.",
      parameters: Type.Object({
        id: Type.String({ description: "Tool search result id or tool name." }),
      }),
      execute: async (_toolCallId, args) => jsonResult(await runtime.describe(readId(args))),
    },
    {
      name: TOOL_CALL_RAW_TOOL_NAME,
      label: "Tool Call",
      description: "Call a selected Tool Search catalog entry through OpenClaw.",
      parameters: Type.Object({
        id: Type.String({ description: "Tool search result id or tool name." }),
        args: Type.Optional(
          Type.Record(Type.String(), Type.Unknown(), { description: "Tool input." }),
        ),
      }),
      execute: async (_toolCallId, args, signal, onUpdate) => {
        const call = readCallArgs(args);
        return jsonResult(
          await runtime.call(call.id, call.input, {
            parentToolCallId: _toolCallId,
            signal,
            onUpdate,
          }),
        );
      },
    },
  ];
}
//#endregion
//#region src/agents/local-model-lean.ts
const LOCAL_MODEL_LEAN_DENY_TOOL_NAMES = /* @__PURE__ */ new Set([
  "browser",
  "cron",
  "image_generate",
  "message",
  "music_generate",
  "pdf",
  "tts",
  "video_generate",
]);
const LOCAL_MODEL_LEAN_DIRECT_TOOL_NAMES = /* @__PURE__ */ new Set(["exec"]);
const LOCAL_MODEL_LEAN_TOOL_SEARCH_DEFAULTS = {
  enabled: true,
  mode: "tools",
  searchDefaultLimit: 5,
  maxSearchLimit: 10,
};
function resolvePreservedLocalModelLeanToolNames(names) {
  if (!names) return [];
  return compileGlobPatterns({
    raw: expandToolGroups([...names]).filter((name) => normalizeToolName(name) !== "*"),
    normalize: normalizeToolName,
  });
}
/** Resolves tool names that must survive local-model lean filtering. */
function resolveLocalModelLeanPreserveToolNames(params) {
  const names = [...(params?.toolNames ?? [])];
  if (params?.forceMessageTool || params?.sourceReplyDeliveryMode === "message_tool_only")
    names.push("message");
  return [...new Set(names)];
}
function resolveLocalModelLeanAgentId(params) {
  const explicitAgentId =
    typeof params.agentId === "string" && params.agentId.trim()
      ? normalizeAgentId(params.agentId)
      : void 0;
  if (explicitAgentId) return explicitAgentId;
  const parsedSessionAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
  if (parsedSessionAgentId) return normalizeAgentId(parsedSessionAgentId);
  return params.config ? resolveDefaultAgentId(params.config) : void 0;
}
/** Returns true when local-model lean mode is enabled for the selected agent. */
function isLocalModelLeanEnabled(params) {
  const normalizedAgentId = resolveLocalModelLeanAgentId(params);
  return (
    (params.config && normalizedAgentId
      ? (resolveAgentConfig(params.config, normalizedAgentId)?.experimental ??
        params.config.agents?.defaults?.experimental)
      : params.config?.agents?.defaults?.experimental
    )?.localModelLean ?? false
  );
}
/** Filters tools for local-model lean mode while preserving required delivery tools. */
function filterLocalModelLeanTools(params) {
  if (!isLocalModelLeanEnabled(params)) return params.tools;
  const preservedToolNames = resolvePreservedLocalModelLeanToolNames(params.preserveToolNames);
  return params.tools.filter((tool) => {
    const normalizedName = normalizeToolName(tool.name);
    return (
      matchesAnyGlobPattern(normalizedName, preservedToolNames) ||
      !LOCAL_MODEL_LEAN_DENY_TOOL_NAMES.has(normalizedName)
    );
  });
}
function shouldCatalogToolForLocalModelLean(tool) {
  return !LOCAL_MODEL_LEAN_DIRECT_TOOL_NAMES.has(normalizeToolName(tool.name));
}
function applyLocalModelLeanToolSearchDefaults(params) {
  if (!params.config || !isLocalModelLeanEnabled(params)) return params.config;
  if (params.config.tools?.toolSearch !== void 0) return params.config;
  return {
    ...params.config,
    tools: {
      ...params.config.tools,
      toolSearch: LOCAL_MODEL_LEAN_TOOL_SEARCH_DEFAULTS,
    },
  };
}
//#endregion
export {
  isHostScopedAgentToolActive as A,
  registerHeadlessToolSearchCatalog as C,
  isAgentToolReplaySafe as D,
  collectReplaySafeToolNames as E,
  runWithAgentRingZeroTools as M,
  isAgentToolRestartSafe as O,
  projectToolSearchTargetTranscriptMessages as S,
  resolveToolSearchConfig as T,
  clearToolSearchCatalog as _,
  shouldCatalogToolForLocalModelLean as a,
  createToolSearchTools as b,
  TOOL_SEARCH_CODE_MODE_TOOL_NAME as c,
  addClientToolsToToolCatalog as d,
  addClientToolsToToolSearchCatalog as f,
  buildToolSchemaDirectoryPrompt as g,
  applyToolSearchCatalog as h,
  resolveLocalModelLeanPreserveToolNames as i,
  mergeAgentRingZeroTools as j,
  getActiveAgentRingZeroTools as k,
  TOOL_SEARCH_RAW_TOOL_NAME as l,
  applyToolSchemaDirectoryCatalog as m,
  filterLocalModelLeanTools as n,
  TOOL_CALL_RAW_TOOL_NAME as o,
  applyToolCatalogCompaction as p,
  isLocalModelLeanEnabled as r,
  TOOL_DESCRIBE_RAW_TOOL_NAME as s,
  applyLocalModelLeanToolSearchDefaults as t,
  ToolSearchRuntime as u,
  collectUniqueCatalogToolNames as v,
  resolveToolSearchCatalogTool as w,
  estimateToolSchemaDirectoryToolNames as x,
  createToolSearchCatalogRef as y,
};
