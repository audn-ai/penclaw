//#region extensions/opencode/session-catalog-shared.d.ts
declare const OPENCODE_SESSIONS_LIST_COMMAND = "opencode.sessions.list.v1";
declare const OPENCODE_SESSION_READ_COMMAND = "opencode.sessions.read.v1";
declare const OPENCODE_TERMINAL_RESUME_COMMAND = "opencode.terminal.resume.v1";
declare const OPENCODE_SESSIONS_CAPABILITY = "opencode-sessions";
declare const OPENCODE_LOCAL_SESSION_HOST_ID = "gateway";
declare const OPENCODE_SESSION_CATALOG_MAX_PAGE_LIMIT = 100;
declare const OPENCODE_NODE_INVOKE_TIMEOUT_MS = 35000;
declare const OPENCODE_SESSION_ID_PATTERN: RegExp;
//#endregion
export {
  OPENCODE_SESSION_CATALOG_MAX_PAGE_LIMIT as a,
  OPENCODE_TERMINAL_RESUME_COMMAND as c,
  OPENCODE_SESSIONS_LIST_COMMAND as i,
  OPENCODE_NODE_INVOKE_TIMEOUT_MS as n,
  OPENCODE_SESSION_ID_PATTERN as o,
  OPENCODE_SESSIONS_CAPABILITY as r,
  OPENCODE_SESSION_READ_COMMAND as s,
  OPENCODE_LOCAL_SESSION_HOST_ID as t,
};
