import { r as resolveExecutableFromPathEnv } from "./executable-path-BP9CqJ6T.js";
import { n as runNodePtyCommand, t as decodeNodePtyResumeParams } from "./node-host-Bq0uyz7u.js";
import { t as listLocalOpenCodeSessionPage } from "./session-catalog-QO1sE6IO.js";
import {
  c as OPENCODE_TERMINAL_RESUME_COMMAND,
  i as OPENCODE_SESSIONS_LIST_COMMAND,
  n as OPENCODE_NODE_INVOKE_TIMEOUT_MS,
  o as OPENCODE_SESSION_ID_PATTERN,
  r as OPENCODE_SESSIONS_CAPABILITY,
} from "./session-catalog-shared-GSwM39Ao.js";
//#region extensions/opencode/session-catalog-terminal.ts
function validateOpenCodeThreadId(value) {
  if (typeof value !== "string" || !OPENCODE_SESSION_ID_PATTERN.test(value))
    throw new Error("INVALID_REQUEST: threadId is invalid");
  return value;
}
async function requireLocalOpenCodeSession(threadId) {
  const record = (
    await listLocalOpenCodeSessionPage({
      searchTerm: threadId,
      limit: 100,
    })
  ).sessions.find((session) => session.threadId === threadId);
  if (!record) throw new Error("OpenCode session is unavailable");
  return record;
}
function createOpenCodeTerminalNodeHostCommand(isAvailable) {
  return {
    command: OPENCODE_TERMINAL_RESUME_COMMAND,
    cap: OPENCODE_SESSIONS_CAPABILITY,
    dangerous: false,
    duplex: true,
    isAvailable,
    handle: async (paramsJSON, io) => {
      if (!io) throw new Error("OpenCode terminal command requires duplex transport");
      const params = decodeNodePtyResumeParams(paramsJSON, validateOpenCodeThreadId);
      const record = await requireLocalOpenCodeSession(params.threadId);
      const file = resolveExecutableFromPathEnv("opencode", process.env.PATH ?? "");
      if (!file) throw new Error("OpenCode CLI is unavailable");
      return JSON.stringify(
        await runNodePtyCommand(
          {
            file,
            args: ["--session", params.threadId],
            cwd: record.cwd,
            cols: params.cols,
            rows: params.rows,
          },
          io,
        ),
      );
    },
  };
}
async function resolveNodeOpenCodeSession(params) {
  const raw = await params.runtime.nodes.invoke({
    nodeId: params.nodeId,
    command: OPENCODE_SESSIONS_LIST_COMMAND,
    params: {
      searchTerm: params.threadId,
      limit: 100,
    },
    timeoutMs: OPENCODE_NODE_INVOKE_TIMEOUT_MS,
    scopes: ["operator.write"],
  });
  const record = params
    .parseNodeSessionPage(params.unwrapNodePayload(raw))
    .sessions.find((session) => session.threadId === params.threadId);
  if (!record) throw new Error("OpenCode session is unavailable");
  return record;
}
async function openOpenCodeCatalogTerminal(params) {
  const title = `opencode --session ${params.threadId.slice(0, 12)}…`;
  if (params.hostId === "gateway") {
    const record = await requireLocalOpenCodeSession(params.threadId);
    const executable = resolveExecutableFromPathEnv("opencode", process.env.PATH ?? "");
    if (!executable) throw new Error("OpenCode CLI is unavailable");
    return {
      kind: "local",
      argv: [executable, "--session", params.threadId],
      ...(record.cwd ? { cwd: record.cwd } : {}),
      title,
    };
  }
  if (!params.hostId.startsWith("node:")) throw new Error("hostId is invalid");
  const nodeId = params.hostId.slice(5);
  if (
    !(await params.runtime.nodes.list()).nodes.find((candidate) => {
      const commands = candidate.invocableCommands ?? candidate.commands;
      return (
        candidate.nodeId === nodeId &&
        candidate.connected === true &&
        commands?.includes("opencode.sessions.list.v1") === true &&
        commands.includes("opencode.terminal.resume.v1")
      );
    })
  )
    throw new Error("paired-node OpenCode terminal is unavailable");
  const record = await resolveNodeOpenCodeSession({
    runtime: params.runtime,
    nodeId,
    threadId: params.threadId,
    parseNodeSessionPage: params.parseNodeSessionPage,
    unwrapNodePayload: params.unwrapNodePayload,
  });
  return {
    kind: "node",
    nodeId,
    command: OPENCODE_TERMINAL_RESUME_COMMAND,
    paramsJSON: JSON.stringify({ threadId: params.threadId }),
    ...(record.cwd ? { cwd: record.cwd } : {}),
    title,
  };
}
//#endregion
export { openOpenCodeCatalogTerminal as n, createOpenCodeTerminalNodeHostCommand as t };
