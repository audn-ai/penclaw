import { accessSync, constants, statSync } from "node:fs";
import "./string-coerce-runtime-BUe4iD0r.js";
import path from "node:path";
import process from "node:process";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  n as optionalOpenCodeString,
  r as readLocalOpenCodeTranscriptPage,
  t as listLocalOpenCodeSessionPage,
} from "./session-catalog-QO1sE6IO.js";
import {
  c as OPENCODE_TERMINAL_RESUME_COMMAND,
  i as OPENCODE_SESSIONS_LIST_COMMAND,
  n as OPENCODE_NODE_INVOKE_TIMEOUT_MS,
  o as OPENCODE_SESSION_ID_PATTERN,
  r as OPENCODE_SESSIONS_CAPABILITY,
  s as OPENCODE_SESSION_READ_COMMAND,
  t as OPENCODE_LOCAL_SESSION_HOST_ID,
} from "./session-catalog-shared-GSwM39Ao.js";
import {
  n as openOpenCodeCatalogTerminal,
  t as createOpenCodeTerminalNodeHostCommand,
} from "./session-catalog-terminal-XsbqwnAm.js";
//#region extensions/opencode/session-catalog-plugin.ts
const MAX_HOSTS = 100;
const MAX_CURSOR_LENGTH = 128;
const MAX_SEARCH_LENGTH = 500;
const TRANSCRIPT_ITEM_TYPES = /* @__PURE__ */ new Set([
  "userMessage",
  "agentMessage",
  "reasoning",
  "toolCall",
  "toolResult",
  "other",
]);
function isOptionalString(value) {
  return value === void 0 || typeof value === "string";
}
function isOptionalNumber(value) {
  return value === void 0 || typeof value === "number";
}
function isNodeSession(value) {
  return (
    isRecord(value) &&
    typeof value.threadId === "string" &&
    OPENCODE_SESSION_ID_PATTERN.test(value.threadId) &&
    typeof value.status === "string" &&
    value.status.length > 0 &&
    typeof value.archived === "boolean" &&
    typeof value.canContinue === "boolean" &&
    typeof value.canArchive === "boolean" &&
    isOptionalString(value.name) &&
    isOptionalString(value.cwd) &&
    isOptionalString(value.source) &&
    isOptionalString(value.modelProvider) &&
    isOptionalString(value.cliVersion) &&
    isOptionalString(value.gitBranch) &&
    isOptionalString(value.openClawSessionKey) &&
    isOptionalNumber(value.createdAt) &&
    isOptionalNumber(value.updatedAt) &&
    isOptionalNumber(value.recencyAt)
  );
}
function isNodeTranscriptItem(value) {
  return (
    isRecord(value) &&
    typeof value.type === "string" &&
    TRANSCRIPT_ITEM_TYPES.has(value.type) &&
    isOptionalString(value.id) &&
    isOptionalString(value.text) &&
    isOptionalString(value.timestamp) &&
    isOptionalString(value.model) &&
    (value.truncated === void 0 || typeof value.truncated === "boolean")
  );
}
function executableOnPath(command, env) {
  const pathValue = env.PATH ?? env.Path ?? "";
  const delimiter = process.platform === "win32" ? ";" : path.delimiter;
  const extensions =
    process.platform === "win32" ? (env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";") : [""];
  for (const directory of pathValue.split(delimiter))
    for (const extension of extensions) {
      if (!directory.trim()) continue;
      const candidate = path.join(directory, `${command}${extension}`);
      try {
        if (!statSync(candidate).isFile()) continue;
        if (process.platform !== "win32") accessSync(candidate, constants.X_OK);
        return true;
      } catch {}
    }
  return false;
}
function parseNodeParams(paramsJSON) {
  if (!paramsJSON) return;
  try {
    return JSON.parse(paramsJSON);
  } catch (error) {
    throw new Error("OpenCode session parameters must be valid JSON", { cause: error });
  }
}
function fullConfigCatalogEnabled(config) {
  if (!isRecord(config) || !isRecord(config.plugins) || !isRecord(config.plugins.entries))
    return true;
  const entry = config.plugins.entries.opencode;
  if (!isRecord(entry) || !isRecord(entry.config) || !isRecord(entry.config.sessionCatalog))
    return true;
  return entry.config.sessionCatalog.enabled !== false;
}
function isOpenCodeSessionCatalogEnabled(pluginConfig) {
  return (
    !isRecord(pluginConfig) ||
    !isRecord(pluginConfig.sessionCatalog) ||
    pluginConfig.sessionCatalog.enabled !== false
  );
}
function createOpenCodeSessionNodeHostCommands() {
  const available = ({ config, env }) =>
    fullConfigCatalogEnabled(config) && executableOnPath("opencode", env);
  return [
    {
      command: OPENCODE_SESSIONS_LIST_COMMAND,
      cap: OPENCODE_SESSIONS_CAPABILITY,
      dangerous: false,
      isAvailable: available,
      handle: async (paramsJSON) =>
        JSON.stringify(await listLocalOpenCodeSessionPage(parseNodeParams(paramsJSON))),
    },
    {
      command: OPENCODE_SESSION_READ_COMMAND,
      cap: OPENCODE_SESSIONS_CAPABILITY,
      dangerous: false,
      isAvailable: available,
      handle: async (paramsJSON) =>
        JSON.stringify(await readLocalOpenCodeTranscriptPage(parseNodeParams(paramsJSON))),
    },
    createOpenCodeTerminalNodeHostCommand(available),
  ];
}
function createOpenCodeSessionNodeInvokePolicies() {
  return [
    {
      commands: [
        OPENCODE_SESSIONS_LIST_COMMAND,
        OPENCODE_SESSION_READ_COMMAND,
        OPENCODE_TERMINAL_RESUME_COMMAND,
      ],
      defaultPlatforms: ["macos", "linux", "windows"],
      handle: (context) =>
        context.command === "opencode.terminal.resume.v1" ? { ok: true } : context.invokeNode(),
    },
  ];
}
function nodeLabel(node) {
  return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function unwrapNodePayload(value) {
  return isRecord(value) && typeof value.payloadJSON === "string"
    ? JSON.parse(value.payloadJSON)
    : value;
}
function setTerminalCapability(page, canOpenTerminal) {
  for (const session of page.sessions) session.canOpenTerminal = canOpenTerminal;
  return page;
}
async function listOpenCodeNodeHost(runtime, query, node) {
  const hostId = `node:${node.nodeId}`;
  const common = {
    hostId,
    label: nodeLabel(node),
    kind: "node",
    connected: node.connected === true,
    nodeId: node.nodeId,
  };
  if (node.connected !== true)
    return {
      ...common,
      sessions: [],
      error: {
        code: "NODE_OFFLINE",
        message: "Paired node is offline",
      },
    };
  try {
    const page = parseNodeSessionPage(
      unwrapNodePayload(
        await runtime.nodes.invoke({
          nodeId: node.nodeId,
          command: OPENCODE_SESSIONS_LIST_COMMAND,
          params: {
            ...(query.limitPerHost ? { limit: query.limitPerHost } : {}),
            ...(query.search?.trim()
              ? { searchTerm: query.search.trim().slice(0, MAX_SEARCH_LENGTH) }
              : {}),
            ...(query.cursors?.[hostId] ? { cursor: query.cursors[hostId] } : {}),
          },
          timeoutMs: OPENCODE_NODE_INVOKE_TIMEOUT_MS,
          scopes: ["operator.write"],
        }),
      ),
    );
    const canOpenTerminal =
      (node.invocableCommands ?? node.commands)?.includes(OPENCODE_TERMINAL_RESUME_COMMAND) ===
      true;
    return {
      ...common,
      ...setTerminalCapability(page, canOpenTerminal),
    };
  } catch {
    return {
      ...common,
      sessions: [],
      error: {
        code: "NODE_INVOKE_FAILED",
        message: "Paired node OpenCode sessions are unavailable",
      },
    };
  }
}
function parseNodeSessionPage(value) {
  if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > 100)
    throw new Error("OpenCode node returned an invalid session page");
  if (!value.sessions.every(isNodeSession))
    throw new Error("OpenCode node returned an invalid session page");
  const sessions = value.sessions;
  const nextCursor = optionalOpenCodeString(value.nextCursor, MAX_CURSOR_LENGTH);
  if (value.nextCursor !== void 0 && !nextCursor)
    throw new Error("OpenCode node returned an invalid cursor");
  return {
    sessions,
    ...(nextCursor ? { nextCursor } : {}),
  };
}
function parseNodeTranscriptPage(value, threadId) {
  if (
    !isRecord(value) ||
    value.threadId !== threadId ||
    !Array.isArray(value.items) ||
    value.items.length > 100 ||
    !value.items.every(isNodeTranscriptItem)
  )
    throw new Error("OpenCode node returned an invalid transcript page");
  const nextCursor = optionalOpenCodeString(value.nextCursor, MAX_CURSOR_LENGTH);
  if (value.nextCursor !== void 0 && !nextCursor)
    throw new Error("OpenCode node returned an invalid cursor");
  return {
    hostId: OPENCODE_LOCAL_SESSION_HOST_ID,
    threadId,
    items: value.items,
    ...(nextCursor ? { nextCursor } : {}),
  };
}
async function listOpenCodeHosts(runtime, query) {
  const requested = query.hostIds ? new Set(query.hostIds) : void 0;
  const searchTerm = query.search?.trim().slice(0, MAX_SEARCH_LENGTH) || void 0;
  const hosts = [];
  if ((!requested || requested.has("gateway")) && executableOnPath("opencode", process.env))
    try {
      hosts.push({
        hostId: OPENCODE_LOCAL_SESSION_HOST_ID,
        label: "Local OpenCode",
        kind: "gateway",
        connected: true,
        ...(await listLocalOpenCodeSessionPage({
          limit: query.limitPerHost,
          ...(searchTerm ? { searchTerm } : {}),
          cursor: query.cursors?.[OPENCODE_LOCAL_SESSION_HOST_ID],
        }).then((page) => setTerminalCapability(page, true))),
      });
    } catch {
      hosts.push({
        hostId: OPENCODE_LOCAL_SESSION_HOST_ID,
        label: "Local OpenCode",
        kind: "gateway",
        connected: true,
        sessions: [],
        error: {
          code: "LOCAL_READ_FAILED",
          message: "Local OpenCode sessions are unavailable",
        },
      });
    }
  let nodes;
  try {
    nodes = (await runtime.nodes.list()).nodes;
  } catch {
    return hosts;
  }
  const eligible = nodes
    .filter(
      (node) =>
        node.commands?.includes("opencode.sessions.list.v1") &&
        (!requested || requested.has(`node:${node.nodeId}`)),
    )
    .toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right)))
    .slice(0, MAX_HOSTS - hosts.length);
  const nodeHosts = await Promise.all(
    eligible.map((node) => listOpenCodeNodeHost(runtime, query, node)),
  );
  return [...hosts, ...nodeHosts];
}
async function readOpenCodeTranscript(runtime, request) {
  if (request.hostId === "gateway")
    return await readLocalOpenCodeTranscriptPage({
      threadId: request.threadId,
      ...(request.limit ? { limit: request.limit } : {}),
      ...(request.cursor ? { cursor: request.cursor } : {}),
    });
  if (!request.hostId.startsWith("node:")) throw new Error("hostId is invalid");
  const nodeId = request.hostId.slice(5);
  const node = (await runtime.nodes.list()).nodes.find(
    (candidate) =>
      candidate.nodeId === nodeId &&
      candidate.connected === true &&
      candidate.commands?.includes("opencode.sessions.read.v1"),
  );
  if (!node) throw new Error("paired-node OpenCode session host is unavailable");
  return {
    ...parseNodeTranscriptPage(
      unwrapNodePayload(
        await runtime.nodes.invoke({
          nodeId,
          command: OPENCODE_SESSION_READ_COMMAND,
          params: {
            threadId: request.threadId,
            ...(request.limit ? { limit: request.limit } : {}),
            ...(request.cursor ? { cursor: request.cursor } : {}),
          },
          timeoutMs: OPENCODE_NODE_INVOKE_TIMEOUT_MS,
          scopes: ["operator.write"],
        }),
      ),
      request.threadId,
    ),
    hostId: request.hostId,
    label: nodeLabel(node),
  };
}
function registerOpenCodeSessionCatalog(api) {
  if (!isOpenCodeSessionCatalogEnabled(api.pluginConfig)) return;
  api.registerSessionCatalog({
    id: "opencode",
    label: "OpenCode",
    list: async (query) => await listOpenCodeHosts(api.runtime, query),
    read: async (request) => await readOpenCodeTranscript(api.runtime, request),
    openTerminal: async (request) =>
      await openOpenCodeCatalogTerminal({
        runtime: api.runtime,
        ...request,
        parseNodeSessionPage,
        unwrapNodePayload,
      }),
  });
  for (const command of createOpenCodeSessionNodeHostCommands())
    api.registerNodeHostCommand(command);
  for (const policy of createOpenCodeSessionNodeInvokePolicies())
    api.registerNodeInvokePolicy(policy);
}
//#endregion
export {
  registerOpenCodeSessionCatalog as i,
  createOpenCodeSessionNodeInvokePolicies as n,
  isOpenCodeSessionCatalogEnabled as r,
  createOpenCodeSessionNodeHostCommands as t,
};
