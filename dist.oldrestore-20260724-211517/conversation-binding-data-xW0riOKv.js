import { createHash, randomUUID } from "node:crypto";
import "./string-coerce-runtime-BUe4iD0r.js";
import process from "node:process";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
//#region extensions/codex/src/conversation-binding-data.ts
const APP_SERVER_BINDING_DATA_VERSION = 2;
const CLI_BINDING_DATA_VERSION = 1;
function createCodexConversationBindingData(params) {
  const agentId = params.agentId?.trim();
  const agentDir = params.agentDir?.trim();
  const source = readConversationSource(params.source);
  const start = readConversationStart(params.start);
  return {
    kind: "codex-app-server-session",
    version: APP_SERVER_BINDING_DATA_VERSION,
    bindingId: params.bindingId?.trim() || randomUUID(),
    workspaceDir: params.workspaceDir,
    ...(agentId ? { agentId } : {}),
    ...(agentDir ? { agentDir } : {}),
    ...(source ? { source } : {}),
    ...(start ? { start } : {}),
  };
}
function createCodexCliNodeConversationBindingData(params) {
  const agentId = params.agentId?.trim();
  const cwd = params.cwd?.trim();
  return {
    kind: "codex-cli-node-session",
    version: CLI_BINDING_DATA_VERSION,
    nodeId: params.nodeId,
    sessionId: params.sessionId,
    ...(agentId ? { agentId } : {}),
    ...(cwd ? { cwd } : {}),
  };
}
function readCodexConversationBindingData(binding) {
  const data = binding?.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return;
  return readCodexConversationBindingDataRecord(data);
}
function readCodexConversationBindingDataRecord(data) {
  if (data.kind === "codex-cli-node-session") {
    if (
      data.version !== CLI_BINDING_DATA_VERSION ||
      typeof data.nodeId !== "string" ||
      !data.nodeId.trim() ||
      typeof data.sessionId !== "string" ||
      !data.sessionId.trim()
    )
      return;
    return {
      kind: "codex-cli-node-session",
      version: CLI_BINDING_DATA_VERSION,
      nodeId: data.nodeId.trim(),
      sessionId: data.sessionId.trim(),
      agentId:
        typeof data.agentId === "string" && data.agentId.trim() ? data.agentId.trim() : void 0,
      cwd: typeof data.cwd === "string" && data.cwd.trim() ? data.cwd.trim() : void 0,
    };
  }
  if (data.kind !== "codex-app-server-session") return;
  const bindingId =
    data.version === APP_SERVER_BINDING_DATA_VERSION &&
    typeof data.bindingId === "string" &&
    data.bindingId.trim()
      ? data.bindingId.trim()
      : data.version === 1 && typeof data.sessionFile === "string" && data.sessionFile.trim()
        ? legacyCodexConversationBindingId(data.sessionFile)
        : void 0;
  if (!bindingId) return;
  const start = readConversationStart(asOptionalRecord(data.start));
  const source = readConversationSource(asOptionalRecord(data.source));
  const legacyBinding = data.version === 1;
  return {
    kind: "codex-app-server-session",
    version: APP_SERVER_BINDING_DATA_VERSION,
    bindingId,
    workspaceDir:
      typeof data.workspaceDir === "string" && data.workspaceDir.trim()
        ? data.workspaceDir
        : process.cwd(),
    agentId: typeof data.agentId === "string" && data.agentId.trim() ? data.agentId.trim() : void 0,
    agentDir:
      typeof data.agentDir === "string" && data.agentDir.trim() ? data.agentDir.trim() : void 0,
    ...(source ? { source } : {}),
    ...(start ? { start } : {}),
    ...(legacyBinding ? { legacyBinding: true } : {}),
  };
}
function readConversationSource(value) {
  const agentId = readString(value, "agentId");
  const sessionId = readString(value, "sessionId");
  const threadId = readString(value, "threadId");
  const sessionKey = readString(value, "sessionKey");
  if (!agentId || !sessionId || !threadId) return;
  return {
    agentId,
    sessionId,
    threadId,
    ...(sessionKey ? { sessionKey } : {}),
  };
}
/** Doctor/runtime v1 decoder key for shipped conversation bindings that stored a file locator. */
function legacyCodexConversationBindingId(sessionFile) {
  return `legacy-${createHash("sha256").update(sessionFile).digest("base64url")}`;
}
function resolveCodexDefaultWorkspaceDir(pluginConfig) {
  return (
    readString(
      asOptionalRecord(asOptionalRecord(pluginConfig)?.appServer),
      "defaultWorkspaceDir",
    ) ?? process.cwd()
  );
}
function readString(record, key) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readConversationStart(value) {
  const read = (key) => {
    const candidate = value?.[key];
    return typeof candidate === "string" && candidate.trim() ? candidate.trim() : void 0;
  };
  const start = {
    id: read("id"),
    threadId: read("threadId"),
    model: read("model"),
    modelProvider: read("modelProvider"),
    authProfileId: read("authProfileId"),
  };
  return start.id
    ? {
        ...start,
        id: start.id,
      }
    : void 0;
}
//#endregion
export {
  readCodexConversationBindingDataRecord as a,
  readCodexConversationBindingData as i,
  createCodexConversationBindingData as n,
  resolveCodexDefaultWorkspaceDir as o,
  legacyCodexConversationBindingId as r,
  createCodexCliNodeConversationBindingData as t,
};
