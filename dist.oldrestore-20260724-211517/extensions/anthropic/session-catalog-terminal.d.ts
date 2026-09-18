import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import { s as SessionCatalogTerminalPlan } from "../../session-catalog-CskF-bPr.js";
import { o as isResumableClaudeSource } from "../../session-catalog-shared-DophxI1a.js";
//#region extensions/anthropic/session-catalog-terminal.d.ts
type ClaudeTerminalDependencies = {
  listClaudeSessions: () => Promise<
    Array<{
      threadId: string;
      source?: string;
      filePath: string;
      cwd?: string;
    }>
  >;
  resolveNodeClaudeRecord: (params: {
    runtime: OpenClawPluginApi["runtime"];
    nodeId: string;
    threadId: string;
  }) => Promise<{
    source?: string;
    cwd?: string;
  }>;
};
declare function isClaudeCliAvailable(pathEnv?: string): boolean;
declare function claudeNodeTerminalCapability(node: {
  connected?: boolean;
  commands?: string[];
  invocableCommands?: string[];
}): {
  canOpenTerminalClaude?: true;
};
declare function isLocalClaudeResumable(
  host: {
    hostId: string;
  },
  source: string | undefined,
): boolean;
declare function canOpenClaudeTerminalSession(
  host: {
    hostId: string;
    canOpenTerminalClaude?: boolean;
  },
  source: string | undefined,
  localCliAvailable: boolean,
): boolean;
declare function terminalEligibility(
  host: {
    hostId: string;
    canOpenTerminalClaude?: boolean;
  },
  source: string | undefined,
  localCliAvailable: boolean,
): {
  localResumable: boolean;
  canOpenTerminal: boolean;
};
declare function openClaudeCatalogTerminal(
  params: {
    api: OpenClawPluginApi;
    hostId: string;
    threadId: string;
  } & ClaudeTerminalDependencies,
): Promise<SessionCatalogTerminalPlan>;
//#endregion
export {
  canOpenClaudeTerminalSession,
  claudeNodeTerminalCapability,
  isClaudeCliAvailable,
  isLocalClaudeResumable,
  isResumableClaudeSource,
  openClaudeCatalogTerminal,
  terminalEligibility,
};
