//#region extensions/anthropic/session-catalog-shared.d.ts
declare const CLAUDE_SESSIONS_LIST_COMMAND = "anthropic.claude.sessions.list.v1";
declare const CLAUDE_SESSION_READ_COMMAND = "anthropic.claude.sessions.read.v1";
declare const CLAUDE_CLI_NODE_RUN_COMMAND = "agent.cli.claude.run.v1";
declare const CLAUDE_TERMINAL_RESUME_COMMAND = "anthropic.claude.terminal.resume.v1";
declare class ClaudeCatalogParamsError extends Error {}
declare function isResumableClaudeSource(source: string | undefined): boolean;
//#endregion
export {
  ClaudeCatalogParamsError as a,
  CLAUDE_TERMINAL_RESUME_COMMAND as i,
  CLAUDE_SESSIONS_LIST_COMMAND as n,
  isResumableClaudeSource as o,
  CLAUDE_SESSION_READ_COMMAND as r,
  CLAUDE_CLI_NODE_RUN_COMMAND as t,
};
