import fs from "node:fs/promises";
import "./node-host-Bq0uyz7u.js";
import { r as resolveExecutableFromPathEnv } from "./executable-path-BP9CqJ6T.js";
import "./session-catalog-adoption-C3d_naEs.js";
import {
  a as ClaudeCatalogParamsError,
  i as CLAUDE_TERMINAL_RESUME_COMMAND,
  o as isResumableClaudeSource,
} from "./session-catalog-shared-B8NbCO28.js";
//#region extensions/anthropic/session-catalog-terminal.ts
function isClaudeCliAvailable(pathEnv = process.env.PATH ?? "") {
  return resolveExecutableFromPathEnv("claude", pathEnv) !== void 0;
}
function claudeNodeTerminalCapability(node) {
  const commands = node.invocableCommands ?? node.commands;
  return node.connected === true &&
    commands?.includes("anthropic.claude.terminal.resume.v1") === true
    ? { canOpenTerminalClaude: true }
    : {};
}
function isLocalClaudeResumable(host, source) {
  return host.hostId === "gateway:local" && isResumableClaudeSource(source);
}
function canOpenClaudeTerminalSession(host, source, localCliAvailable) {
  return (
    isResumableClaudeSource(source) &&
    ((host.hostId === "gateway:local" && localCliAvailable) || host.canOpenTerminalClaude === true)
  );
}
function terminalEligibility(host, source, localCliAvailable) {
  return {
    localResumable: isLocalClaudeResumable(host, source),
    canOpenTerminal: canOpenClaudeTerminalSession(host, source, localCliAvailable),
  };
}
async function openClaudeCatalogTerminal(params) {
  const title = `claude --resume ${params.threadId.slice(0, 8)}…`;
  if (params.hostId === "gateway:local") {
    const record = (await params.listClaudeSessions()).find(
      (candidate) => candidate.threadId === params.threadId,
    );
    if (!record || !isResumableClaudeSource(record.source))
      throw new ClaudeCatalogParamsError("Claude session is unavailable");
    if (!(await fs.stat(record.filePath).catch(() => void 0))?.isFile())
      throw new ClaudeCatalogParamsError("Claude session transcript is unavailable");
    const executable = resolveExecutableFromPathEnv("claude", process.env.PATH ?? "");
    if (!executable) throw new ClaudeCatalogParamsError("Claude CLI is unavailable");
    return {
      kind: "local",
      argv: [executable, "--resume", params.threadId],
      ...(record.cwd ? { cwd: record.cwd } : {}),
      title,
    };
  }
  if (!params.hostId.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
  const nodeId = params.hostId.slice(5);
  if (
    !(await params.api.runtime.nodes.list()).nodes.find((candidate) => {
      const commands = candidate.invocableCommands ?? candidate.commands;
      return (
        candidate.nodeId === nodeId &&
        candidate.connected === true &&
        commands?.includes("anthropic.claude.sessions.list.v1") === true &&
        commands.includes("anthropic.claude.terminal.resume.v1")
      );
    })
  )
    throw new ClaudeCatalogParamsError("paired-node Claude terminal is unavailable");
  const record = await params.resolveNodeClaudeRecord({
    runtime: params.api.runtime,
    nodeId,
    threadId: params.threadId,
  });
  if (!isResumableClaudeSource(record.source))
    throw new ClaudeCatalogParamsError("Claude session cannot be resumed in a terminal");
  return {
    kind: "node",
    nodeId,
    command: CLAUDE_TERMINAL_RESUME_COMMAND,
    paramsJSON: JSON.stringify({ threadId: params.threadId }),
    ...(record.cwd ? { cwd: record.cwd } : {}),
    title,
  };
}
//#endregion
export {
  openClaudeCatalogTerminal as a,
  isLocalClaudeResumable as i,
  claudeNodeTerminalCapability as n,
  terminalEligibility as o,
  isClaudeCliAvailable as r,
  canOpenClaudeTerminalSession as t,
};
