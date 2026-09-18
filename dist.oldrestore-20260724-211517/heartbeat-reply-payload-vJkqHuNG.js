import {
  s as hasOutboundReplyContent,
  u as isReasoningReplyPayload,
} from "./reply-payload-DDwHXDkv.js";
//#region src/auto-reply/heartbeat-reply-payload.ts
/**
 * Pick the last outbound-capable reply payload for heartbeat delivery.
 *
 * Reasoning payloads are skipped using the shared SDK classifier
 * `isReasoningReplyPayload`, which recognizes the `isReasoning` flag plus the
 * common reasoning/thinking text prefixes (including lowercased and Markdown
 * blockquoted forms). Heartbeat reasoning is delivered separately and only when
 * `includeReasoning` is enabled; without this guard a trailing reasoning
 * payload (which reasoning models can emit after the final answer) would be
 * selected as the user-visible heartbeat reply.
 */
function resolveHeartbeatReplyPayload(replyResult) {
  if (!replyResult) return;
  if (!Array.isArray(replyResult))
    return isReasoningReplyPayload(replyResult) ? void 0 : replyResult;
  for (let idx = replyResult.length - 1; idx >= 0; idx -= 1) {
    const payload = replyResult[idx];
    if (!payload) continue;
    if (isReasoningReplyPayload(payload)) continue;
    if (hasOutboundReplyContent(payload)) return payload;
  }
}
//#endregion
export { resolveHeartbeatReplyPayload as t };
