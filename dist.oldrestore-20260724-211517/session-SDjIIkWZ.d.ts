import { g as OpenClawPluginApi } from "./plugin-entry-DPCR66aO.js";
import {
  b as ActiveRecallResult,
  m as ActiveMemorySearchDebug,
  tt as ResolvedActiveRecallPluginConfig,
} from "./types-Di2zMoWq.js";

//#region extensions/active-memory/session.d.ts
declare function resolveCanonicalSessionKeyFromSessionId(params: {
  api: OpenClawPluginApi;
  agentId: string;
  sessionId?: string;
}): string | undefined;
declare function resolveRecallRunChannelContext(params: {
  api: OpenClawPluginApi;
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  messageProvider?: string;
  channelId?: string;
}): {
  messageChannel?: string;
  messageProvider?: string;
};
declare function resolveStatusUpdateAgentId(ctx: { agentId?: string; sessionKey?: string }): string;
declare function buildPluginStatusLine(params: {
  result: ActiveRecallResult;
  config: ResolvedActiveRecallPluginConfig;
}): string;
declare function buildPersistedDebugSummary(result: ActiveRecallResult): string | null;
declare function persistPluginStatusLines(params: {
  api: OpenClawPluginApi;
  agentId: string;
  sessionKey?: string;
  statusLine?: string;
  debugSummary?: string | null;
  searchDebug?: ActiveMemorySearchDebug;
}): Promise<void>;
//#endregion
export {
  resolveRecallRunChannelContext as a,
  resolveCanonicalSessionKeyFromSessionId as i,
  buildPluginStatusLine as n,
  resolveStatusUpdateAgentId as o,
  persistPluginStatusLines as r,
  buildPersistedDebugSummary as t,
};
