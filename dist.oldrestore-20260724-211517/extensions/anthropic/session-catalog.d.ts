import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import {
  a as ClaudeCatalogParamsError,
  i as CLAUDE_TERMINAL_RESUME_COMMAND,
  n as CLAUDE_SESSIONS_LIST_COMMAND,
  o as isResumableClaudeSource,
  r as CLAUDE_SESSION_READ_COMMAND,
  t as CLAUDE_CLI_NODE_RUN_COMMAND,
} from "../../session-catalog-shared-DophxI1a.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-xA6TtbpC.js";
import {
  a as ClaudeSessionTranscriptPage,
  i as ClaudeSessionCatalogSession,
  n as ClaudeSessionCatalogPage,
  r as ClaudeSessionCatalogResult,
  t as ClaudeSessionCatalogHost,
} from "../../session-catalog-types-Dy_a3pag.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";

//#region extensions/anthropic/session-catalog.d.ts
type CatalogRecord = ClaudeSessionCatalogSession & {
  filePath: string;
};
declare function listClaudeSessions(homeDir?: string): Promise<CatalogRecord[]>;
declare function listLocalClaudeSessionPage(
  value: unknown,
  homeDir?: string,
): Promise<ClaudeSessionCatalogPage>;
declare function readLocalClaudeTranscriptPage(
  value: unknown,
  homeDir?: string,
): Promise<Omit<ClaudeSessionTranscriptPage, "hostId" | "label">>;
declare function listClaudeSessionCatalog(params: {
  runtime: PluginRuntime;
  query?: unknown;
}): Promise<ClaudeSessionCatalogResult>;
declare function resolveNodeClaudeRecord(params: {
  runtime: PluginRuntime;
  nodeId: string;
  threadId: string;
}): Promise<ClaudeSessionCatalogSession>;
declare function registerClaudeSessionCatalog(api: OpenClawPluginApi): void;
//#endregion
export {
  CLAUDE_CLI_NODE_RUN_COMMAND,
  CLAUDE_SESSIONS_LIST_COMMAND,
  CLAUDE_SESSION_READ_COMMAND,
  CLAUDE_TERMINAL_RESUME_COMMAND,
  ClaudeCatalogParamsError,
  type ClaudeSessionCatalogHost,
  type ClaudeSessionCatalogPage,
  type ClaudeSessionCatalogResult,
  type ClaudeSessionCatalogSession,
  type ClaudeSessionTranscriptPage,
  type ClaudeTranscriptItem,
  isResumableClaudeSource,
  listClaudeSessionCatalog,
  listClaudeSessions,
  listLocalClaudeSessionPage,
  readLocalClaudeTranscriptPage,
  registerClaudeSessionCatalog,
  resolveNodeClaudeRecord,
};
