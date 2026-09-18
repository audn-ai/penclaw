import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import { c as normalizeAccountId } from "./delivery-context.shared-WPZGmi9R.js";
import { o as resolveMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import "./message-channel-NQc9DJ6B.js";
//#region src/agents/command/run-context.ts
/**
 * Resolves channel/account/thread run context for agent command execution.
 */
/** Merges explicit run context with command routing options. */
function resolveAgentRunContext(opts) {
  const merged = opts.runContext ? { ...opts.runContext } : {};
  const normalizedChannel = resolveMessageChannel(
    merged.messageChannel ?? opts.messageChannel,
    opts.replyChannel ?? opts.channel,
  );
  if (normalizedChannel) merged.messageChannel = normalizedChannel;
  const normalizedAccountId = normalizeAccountId(merged.accountId ?? opts.accountId);
  if (normalizedAccountId) merged.accountId = normalizedAccountId;
  const groupId = (merged.groupId ?? opts.groupId)?.toString().trim();
  if (groupId) merged.groupId = groupId;
  const groupChannel = (merged.groupChannel ?? opts.groupChannel)?.toString().trim();
  if (groupChannel) merged.groupChannel = groupChannel;
  const groupSpace = (merged.groupSpace ?? opts.groupSpace)?.toString().trim();
  if (groupSpace) merged.groupSpace = groupSpace;
  if (
    merged.currentThreadTs == null &&
    opts.threadId != null &&
    opts.threadId !== "" &&
    opts.threadId !== null
  ) {
    const threadId = stringifyRouteThreadId(opts.threadId);
    if (threadId) merged.currentThreadTs = threadId;
  }
  if (!merged.currentChannelId && opts.to) {
    const trimmedTo = opts.to.trim();
    if (trimmedTo) merged.currentChannelId = trimmedTo;
  }
  return merged;
}
//#endregion
export { resolveAgentRunContext as t };
