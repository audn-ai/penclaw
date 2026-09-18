import {
  c as SessionUpstreamActivity,
  d as SessionUpstreamProbe,
  r as SessionCatalogContinueProviderResult,
} from "../../session-catalog-CskF-bPr.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-xA6TtbpC.js";
//#region extensions/anthropic/session-upstream-activity.d.ts
declare const MAX_CLAUDE_UPSTREAM_SCAN_BYTES: number;
declare const continueOperations: Map<
  string,
  Promise<{
    sessionKey: string;
  }>
>;
declare function link(
  sessionKey: string,
  hostId: string,
  threadId: string,
  listSessions: () => Promise<
    Array<{
      threadId: string;
      filePath: string;
    }>
  >,
): Promise<SessionCatalogContinueProviderResult>;
declare function linkRemote(
  sessionKey: string,
  nodeId: string,
  threadId: string,
  markerUuid: string | null,
): SessionCatalogContinueProviderResult;
declare function linkContinued(params: {
  sessionKey: string;
  hostId: string;
  threadId: string;
  history?: ClaudeTranscriptItem[];
  listLocalSessions: () => Promise<
    Array<{
      threadId: string;
      filePath: string;
    }>
  >;
  readRemote: () => Promise<ClaudeTranscriptItem[]>;
}): Promise<SessionCatalogContinueProviderResult>;
declare function checkClaudeSessionUpstreamActivity(
  probe: SessionUpstreamProbe,
): Promise<SessionUpstreamActivity | undefined>;
declare function checkClaudeUpstreamActivity(
  probes: SessionUpstreamProbe[],
  readRemote?: (probe: SessionUpstreamProbe) => Promise<ClaudeTranscriptItem[]>,
): Promise<SessionUpstreamActivity[]>;
//#endregion
export {
  MAX_CLAUDE_UPSTREAM_SCAN_BYTES,
  checkClaudeSessionUpstreamActivity,
  checkClaudeUpstreamActivity,
  continueOperations,
  link,
  linkContinued,
  linkRemote,
};
