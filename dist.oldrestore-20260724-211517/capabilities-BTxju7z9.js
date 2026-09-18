import { j as CodexAppServerRpcError } from "./shared-client-a36Mluj-.js";
//#region extensions/codex/src/app-server/capabilities.ts
/**
 * Capability helpers for optional Codex app-server control-plane methods.
 */
/** Known app-server methods used by OpenClaw control surfaces. */
const CODEX_CONTROL_METHODS = {
  account: "account/read",
  compact: "thread/compact/start",
  feedback: "feedback/upload",
  forkThread: "thread/fork",
  listMcpServers: "mcpServerStatus/list",
  listSkills: "skills/list",
  listThreads: "thread/list",
  listThreadTurns: "thread/turns/list",
  readThread: "thread/read",
  rateLimits: "account/rateLimits/read",
  archiveThread: "thread/archive",
  renameThread: "thread/name/set",
  resumeThread: "thread/resume",
  review: "review/start",
  unarchiveThread: "thread/unarchive",
};
/** Formats unsupported control calls differently from ordinary RPC failures. */
function describeControlFailure(error) {
  if (isUnsupportedControlError(error)) return "unsupported by this Codex app-server";
  return error instanceof Error ? error.message : String(error);
}
function isUnsupportedControlError(error) {
  return error instanceof CodexAppServerRpcError && error.code === -32601;
}
//#endregion
export { describeControlFailure as n, CODEX_CONTROL_METHODS as t };
