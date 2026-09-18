import { g as OpenClawPluginApi } from "./plugin-entry-DPCR66aO.js";
import {
  tt as ResolvedActiveRecallPluginConfig,
  y as ActiveRecallRecentTurn,
} from "./types-Di2zMoWq.js";

//#region extensions/active-memory/query.d.ts
declare function buildQuery(params: {
  latestUserMessage: string;
  recentTurns?: ActiveRecallRecentTurn[];
  config: ResolvedActiveRecallPluginConfig;
}): string;
declare function buildSearchQuery(params: {
  latestUserMessage: string;
  recentTurns?: ActiveRecallRecentTurn[];
}): string;
declare function extractTextContentParts(content: unknown): string[];
declare function extractTextContent(content: unknown): string;
declare function extractRecentTurns(messages: unknown[]): ActiveRecallRecentTurn[];
declare function getModelRef(
  api: OpenClawPluginApi,
  agentId: string,
  config: ResolvedActiveRecallPluginConfig,
  ctx?: {
    modelProviderId?: string;
    modelId?: string;
  },
):
  | {
      provider: string;
      model: string;
    }
  | undefined;
//#endregion
export {
  extractTextContentParts as a,
  extractTextContent as i,
  buildSearchQuery as n,
  getModelRef as o,
  extractRecentTurns as r,
  buildQuery as t,
};
