import { ContentBlockSchema } from "@modelcontextprotocol/sdk/types.js";
import "./agent-scope-y9xQv_q1.js";
import {
  a as peekSessionMcpRuntime,
  i as getOrCreateSessionMcpRuntime,
  t as completeDeferredSessionMcpRuntimeRetirement,
} from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { r as buildMcpAppSandboxPath } from "./mcp-app-sandbox-0T2d0G77.js";
import {
  i as getMcpAppViewLease,
  r as fetchMcpAppView,
  t as acquireMcpAppViewRequest,
} from "./mcp-ui-resource-Cc6Dustx.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { g as visitSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import "./src-CIJf1lT0.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
//#region src/gateway/mcp-app-reconstruction.ts
const MCP_APP_RESTORE_IN_FLIGHT_KEY = Symbol.for("openclaw.mcpAppRestoreInFlight");
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readString(record, key) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readDescriptor(value) {
  const record = asRecord(value);
  const viewId = readString(record, "viewId");
  const serverName = readString(record, "serverName");
  const toolName = readString(record, "toolName");
  const uiResourceUri = readString(record, "uiResourceUri");
  const toolCallId = readString(record, "toolCallId");
  const rawResultMetaState = record?.resultMetaState;
  const resultMetaState = rawResultMetaState === "unavailable" ? rawResultMetaState : void 0;
  if (
    !viewId ||
    viewId.length > 128 ||
    !serverName ||
    serverName.length > 256 ||
    !toolName ||
    toolName.length > 256 ||
    !uiResourceUri?.startsWith("ui://") ||
    uiResourceUri.length > 2048 ||
    !toolCallId ||
    toolCallId.length > 512 ||
    (rawResultMetaState !== void 0 && resultMetaState === void 0)
  )
    return;
  return {
    viewId,
    serverName,
    toolName,
    uiResourceUri,
    toolCallId,
    ...(resultMetaState ? { resultMetaState } : {}),
  };
}
function readToolInputFromMessage(value, toolCallId, modelToolName) {
  const message = asRecord(value);
  if (readString(message, "role")?.toLowerCase() !== "assistant") return;
  const content = Array.isArray(message?.content) ? message.content : [];
  for (const blockValue of content) {
    const block = asRecord(blockValue);
    if ((readString(block, "id") ?? readString(block, "toolCallId")) !== toolCallId) continue;
    const type = readString(block, "type")?.toLowerCase();
    if (type !== "toolcall" && type !== "tool_call" && type !== "tooluse" && type !== "tool_use")
      continue;
    if (
      (readString(block, "name") ??
        readString(block, "toolName") ??
        readString(block, "tool_name")) !== modelToolName
    )
      continue;
    return {
      found: true,
      input: block?.arguments ?? block?.input ?? block?.args ?? {},
    };
  }
}
function readCallToolResult(message, details) {
  return {
    content: Array.isArray(message.content)
      ? message.content.flatMap((value) => {
          const parsed = ContentBlockSchema.safeParse(value);
          return parsed.success ? [parsed.data] : [];
        })
      : [],
    ...(details.structuredContent !== void 0
      ? { structuredContent: details.structuredContent }
      : {}),
    ...(message.isError === true || details.status === "error" ? { isError: true } : {}),
  };
}
function readTranscriptResult(value, viewId) {
  const message = asRecord(value);
  if (!message || readString(message, "role")?.toLowerCase() !== "toolresult") return;
  const details = asRecord(message.details);
  if (!details) return;
  const rawDescriptor = asRecord(asRecord(details.mcpAppPreview)?.mcpApp);
  if (readString(rawDescriptor, "viewId") !== viewId) return;
  const descriptor = readDescriptor(rawDescriptor);
  const modelToolName = readString(message, "toolName") ?? readString(message, "tool_name");
  if (!descriptor || !modelToolName) return { kind: "unavailable" };
  if (
    readString(message, "toolCallId") !== descriptor.toolCallId ||
    readString(details, "mcpServer") !== descriptor.serverName ||
    readString(details, "mcpTool") !== descriptor.toolName ||
    descriptor.resultMetaState === "unavailable"
  )
    return { kind: "unavailable" };
  return {
    kind: "restorable",
    value: {
      descriptor,
      modelToolName,
      toolResult: readCallToolResult(message, details),
    },
  };
}
/** Searches the full active transcript without retaining its messages in memory. */
async function findMcpAppReconstructionDataByVisit(visitTranscript, viewId) {
  let resultRead;
  let resultIndex = -1;
  let messageIndex = 0;
  await visitTranscript((message) => {
    const read = readTranscriptResult(message, viewId);
    if (read) {
      resultRead = read;
      resultIndex = messageIndex;
    }
    messageIndex += 1;
  });
  if (!resultRead || resultRead.kind === "unavailable") return;
  const resolvedResult = resultRead.value;
  let toolInput;
  let foundInput = false;
  messageIndex = 0;
  await visitTranscript((message) => {
    if (messageIndex >= resultIndex) {
      messageIndex += 1;
      return;
    }
    const input = readToolInputFromMessage(
      message,
      resolvedResult.descriptor.toolCallId,
      resolvedResult.modelToolName,
    );
    if (input) {
      foundInput = true;
      toolInput = input.input;
    }
    messageIndex += 1;
  });
  if (!foundInput) return;
  const { modelToolName: _modelToolName, ...reconstruction } = resolvedResult;
  return {
    ...reconstruction,
    toolInput,
  };
}
function getRestoreInFlight() {
  const state = globalThis;
  const existing = state[MCP_APP_RESTORE_IN_FLIGHT_KEY];
  if (existing) return existing;
  const created = /* @__PURE__ */ new Map();
  state[MCP_APP_RESTORE_IN_FLIGHT_KEY] = created;
  return created;
}
async function restoreMcpAppViewOnce(params) {
  if (!params.viewId.startsWith("mcp-app-") || params.viewId.length > 128) return;
  const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
  const loaded = loadSessionEntry(params.sessionKey, { agentId });
  const sessionId = loaded.entry?.sessionId;
  if (!sessionId) return;
  const transcriptScope = {
    agentId,
    sessionId,
    sessionKey: loaded.canonicalKey,
    storePath: loaded.storePath,
    sessionEntry: loaded.entry,
  };
  const data = await findMcpAppReconstructionDataByVisit(async (visit) => {
    await visitSessionMessagesAsync(transcriptScope, (message) => visit(message), {
      mode: "full",
      reason: "MCP App restart reconstruction",
      cache: "reuse",
    });
  }, params.viewId);
  if (!data) return;
  const runtime = await getOrCreateSessionMcpRuntime({
    sessionId,
    sessionKey: loaded.canonicalKey,
    workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId),
    agentDir: resolveAgentDir(params.cfg, agentId),
    cfg: params.cfg,
  });
  if (runtime.mcpAppsEnabled !== true) return;
  await fetchMcpAppView({
    runtime,
    serverName: data.descriptor.serverName,
    toolName: data.descriptor.toolName,
    uiResourceUri: data.descriptor.uiResourceUri,
    toolCallId: data.descriptor.toolCallId,
    toolInput: data.toolInput,
    toolResult: data.toolResult,
    viewId: data.descriptor.viewId,
    allowedAppToolNames: /* @__PURE__ */ new Set(),
  });
  const view = getMcpAppViewLease(params.viewId, runtime);
  return view
    ? {
        runtime,
        view,
      }
    : void 0;
}
async function restoreMcpAppView(params) {
  const key = `${params.sessionKey}\0${params.viewId}`;
  const inFlight = getRestoreInFlight();
  const existing = inFlight.get(key);
  if (existing) return await existing;
  const pending = restoreMcpAppViewOnce(params).finally(() => {
    if (inFlight.get(key) === pending) inFlight.delete(key);
  });
  inFlight.set(key, pending);
  return await pending;
}
//#endregion
//#region src/gateway/server-methods/mcp-app.ts
function requireString(params, key) {
  const value = params[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required`);
  return value.trim();
}
function optionalCursor(params) {
  const cursor = params.cursor;
  return typeof cursor === "string" && cursor.trim() ? { cursor: cursor.trim() } : void 0;
}
function isAppCallableTool(tool) {
  return tool.uiVisibility === void 0 || tool.uiVisibility.includes("app");
}
function isAppCallableListedTool(tool) {
  const { _meta: metadata } = tool;
  const ui =
    metadata?.ui && typeof metadata.ui === "object" && !Array.isArray(metadata.ui)
      ? metadata.ui
      : void 0;
  const visibility = Array.isArray(ui?.visibility)
    ? ui.visibility.filter((entry) => entry === "app" || entry === "model")
    : void 0;
  return visibility === void 0 || visibility.includes("app");
}
function isAllowedByView(view, toolName) {
  return view.allowedAppToolNames === void 0 || view.allowedAppToolNames.has(toolName);
}
async function requireActiveView(params, cfg) {
  const sessionKey = requireString(params, "sessionKey");
  const viewId = requireString(params, "viewId");
  const existingRuntime = peekSessionMcpRuntime({ sessionKey });
  if (
    (existingRuntime && existingRuntime.mcpAppsEnabled !== true) ||
    (cfg && cfg.mcp?.apps?.enabled !== true)
  )
    throw new Error("MCP App runtime is unavailable");
  const existingView = existingRuntime ? getMcpAppViewLease(viewId, existingRuntime) : void 0;
  const restored =
    existingRuntime?.mcpAppsEnabled === true && existingView
      ? {
          runtime: existingRuntime,
          view: existingView,
        }
      : cfg
        ? await restoreMcpAppView({
            cfg,
            sessionKey,
            viewId,
          })
        : void 0;
  if (!restored) throw new Error("MCP App view expired or is not authorized for this session");
  const { runtime, view } = restored;
  runtime.markUsed();
  return {
    runtime,
    view,
  };
}
async function withActiveView(params, kind, operation, cfg) {
  const active = await requireActiveView(params, cfg);
  const release = acquireMcpAppViewRequest(active.view, kind);
  const releaseRuntimeLease = active.runtime.acquireLease?.();
  try {
    return await operation(active);
  } finally {
    release();
    releaseRuntimeLease?.();
    await completeDeferredSessionMcpRuntimeRetirement(active.runtime).catch((error) => {
      logWarn(`mcp-app: deferred runtime cleanup failed: ${formatErrorMessage(error)}`);
    });
  }
}
async function requireCallableTool(runtime, view, toolName) {
  const tool = (await runtime.getCatalog()).tools.find(
    (entry) => entry.serverName === view.serverName && entry.toolName === toolName,
  );
  if (!tool || !isAppCallableTool(tool) || !isAllowedByView(view, toolName))
    throw new Error(`MCP tool "${toolName}" is not app-callable`);
  return tool;
}
async function handle(respond, operation) {
  try {
    respond(true, await operation());
  } catch (error) {
    respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
  }
}
const mcpAppHandlers = {
  "mcp.app.view": async ({ respond, params, context }) => {
    await handle(
      respond,
      async () =>
        await withActiveView(
          params,
          "read",
          ({ view }) => {
            const sandboxPort = context.getMcpAppSandboxPort?.();
            if (sandboxPort === void 0)
              throw new Error("MCP App sandbox listener is unavailable; restart the Gateway");
            const configuredOrigin = context.getRuntimeConfig().mcp?.apps?.sandboxOrigin;
            return {
              sandboxUrl: buildMcpAppSandboxPath(view.csp),
              sandboxPort,
              ...(configuredOrigin ? { sandboxOrigin: new URL(configuredOrigin).origin } : {}),
              html: view.html,
              ...(view.csp ? { csp: view.csp } : {}),
              toolInput: view.toolInput,
              toolResult: view.toolResult,
            };
          },
          context.getRuntimeConfig(),
        ),
    );
  },
  "mcp.app.callTool": async ({ respond, params }) => {
    await handle(
      respond,
      async () =>
        await withActiveView(params, "tool", async ({ runtime, view }) => {
          const toolName = requireString(params, "toolName");
          await requireCallableTool(runtime, view, toolName);
          return await runtime.callTool(view.serverName, toolName, params.arguments ?? {});
        }),
    );
  },
  "mcp.app.listTools": async ({ respond, params }) => {
    await handle(
      respond,
      async () =>
        await withActiveView(params, "read", async ({ runtime, view }) => {
          if (!runtime.listTools) throw new Error("MCP tools/list is unavailable");
          const [listed, catalog] = await Promise.all([
            runtime.listTools(view.serverName, optionalCursor(params)),
            runtime.getCatalog(),
          ]);
          const allowed = new Set(
            catalog.tools
              .filter(
                (tool) =>
                  tool.serverName === view.serverName &&
                  isAppCallableTool(tool) &&
                  isAllowedByView(view, tool.toolName),
              )
              .map((tool) => tool.toolName),
          );
          return {
            ...listed,
            tools: listed.tools.filter(
              (tool) => allowed.has(tool.name.trim()) && isAppCallableListedTool(tool),
            ),
          };
        }),
    );
  },
  "mcp.app.listResources": async ({ respond, params }) => {
    await handle(
      respond,
      async () =>
        await withActiveView(params, "read", async ({ runtime, view }) => {
          if (!runtime.listResources) throw new Error("MCP resources/list is unavailable");
          const resources = await runtime.listResources(view.serverName);
          return Array.isArray(resources) ? { resources } : resources;
        }),
    );
  },
  "mcp.app.listResourceTemplates": async ({ respond, params }) => {
    await handle(
      respond,
      async () =>
        await withActiveView(params, "read", async ({ runtime, view }) => {
          if (!runtime.listResourceTemplates)
            throw new Error("MCP resources/templates/list is unavailable");
          return await runtime.listResourceTemplates(view.serverName, optionalCursor(params));
        }),
    );
  },
  "mcp.app.readResource": async ({ respond, params }) => {
    await handle(
      respond,
      async () =>
        await withActiveView(params, "read", async ({ runtime, view }) => {
          if (!runtime.readResource) throw new Error("MCP resources/read is unavailable");
          return await runtime.readResource(view.serverName, requireString(params, "uri"));
        }),
    );
  },
};
//#endregion
export { mcpAppHandlers };
