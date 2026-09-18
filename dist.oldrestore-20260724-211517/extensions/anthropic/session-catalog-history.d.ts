import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-xA6TtbpC.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/anthropic/session-catalog-history.d.ts
declare function importClaudeHistory(params: {
  items: ClaudeTranscriptItem[];
  threadId: string;
  sessionFile: string;
  sessionId: string;
  sessionKey: string;
  agentId: string;
  cwd?: string;
  config: OpenClawConfig;
}): Promise<void>;
//#endregion
export { importClaudeHistory };
