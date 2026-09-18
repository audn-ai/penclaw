import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { l as persistAcpTurnTranscript } from "./attempt-execution-BCffdpK9.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import "./sessions-CEG7v41b.js";
import { n as resolveAcpSessionCwd } from "./session-identifiers-BmbqiGBi.js";
//#region src/auto-reply/reply/dispatch-acp-transcript.runtime.ts
async function persistAcpDispatchTranscript(params) {
  const promptText = params.promptText.trim();
  const finalText = params.finalText.trim();
  if (!promptText && !finalText) return;
  const sessionAgentId = resolveSessionAgentId({
    sessionKey: params.sessionKey,
    config: params.cfg,
  });
  const storePath = resolveStorePath(params.cfg.session?.store, { agentId: sessionAgentId });
  const sessionEntry = loadSessionEntry({
    agentId: sessionAgentId,
    sessionKey: params.sessionKey,
    storePath,
  });
  const sessionId = sessionEntry?.sessionId;
  if (!sessionId) throw new Error(`unknown ACP session key: ${params.sessionKey}`);
  await persistAcpTurnTranscript({
    body: promptText,
    transcriptBody: promptText,
    finalText,
    sessionId,
    sessionKey: params.sessionKey,
    sessionEntry,
    storePath,
    sessionAgentId,
    threadId: params.threadId,
    sessionCwd: resolveAcpSessionCwd(params.meta) ?? process.cwd(),
    config: params.cfg,
  });
}
//#endregion
export { persistAcpDispatchTranscript };
