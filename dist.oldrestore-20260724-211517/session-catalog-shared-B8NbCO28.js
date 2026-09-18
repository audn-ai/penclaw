//#region extensions/anthropic/session-catalog-shared.ts
const CLAUDE_SESSIONS_LIST_COMMAND = "anthropic.claude.sessions.list.v1";
const CLAUDE_SESSION_READ_COMMAND = "anthropic.claude.sessions.read.v1";
const CLAUDE_CLI_NODE_RUN_COMMAND = "agent.cli.claude.run.v1";
const CLAUDE_TERMINAL_RESUME_COMMAND = "anthropic.claude.terminal.resume.v1";
var ClaudeCatalogParamsError = class extends Error {};
function isResumableClaudeSource(source) {
  return source === "claude-cli" || source === "claude-desktop";
}
//#endregion
export {
  ClaudeCatalogParamsError as a,
  CLAUDE_TERMINAL_RESUME_COMMAND as i,
  CLAUDE_SESSIONS_LIST_COMMAND as n,
  isResumableClaudeSource as o,
  CLAUDE_SESSION_READ_COMMAND as r,
  CLAUDE_CLI_NODE_RUN_COMMAND as t,
};
