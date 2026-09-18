import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import {
  b as ActiveRecallResult,
  tt as ResolvedActiveRecallPluginConfig,
} from "../../types-Di2zMoWq.js";

//#region extensions/active-memory/recall.d.ts
declare function maybeResolveActiveRecall(params: {
  api: OpenClawPluginApi;
  config: ResolvedActiveRecallPluginConfig;
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  messageProvider?: string;
  channelId?: string;
  query: string;
  searchQuery: string;
  currentModelProviderId?: string;
  currentModelId?: string;
  abortSignal?: AbortSignal;
}): Promise<ActiveRecallResult>;
//#endregion
export { maybeResolveActiveRecall };
