import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/anthropic/session-catalog-runtime.d.ts
declare function currentClaudeSessionCatalogConfig(api: OpenClawPluginApi): OpenClawConfig;
declare function listBoundClaudeSessions(api: OpenClawPluginApi): Map<string, string>;
declare function resolveClaudeCatalogCreateSession(
  api: OpenClawPluginApi,
  requestedAgentId?: string,
):
  | {
      model: string;
      agentRuntime: string;
    }
  | undefined;
//#endregion
export {
  currentClaudeSessionCatalogConfig,
  listBoundClaudeSessions,
  resolveClaudeCatalogCreateSession,
};
