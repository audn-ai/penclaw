import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
//#region src/channels/plugins/conversation-bindings.ts
/**
 * Channel conversation binding lifecycle helpers.
 *
 * Starts plugin binding managers and updates per-session binding idle/max-age limits.
 */
/**
 * Updates the idle timeout for bindings that match a session key.
 *
 * Missing plugin support is a no-op because session commands fan out through
 * generic channel helpers while only some channels keep conversation bindings.
 */
function setChannelConversationBindingIdleTimeoutBySessionKey(params) {
  const setIdleTimeoutBySessionKey = getChannelPlugin(params.channelId)?.conversationBindings
    ?.setIdleTimeoutBySessionKey;
  if (!setIdleTimeoutBySessionKey) return [];
  return setIdleTimeoutBySessionKey({
    targetSessionKey: params.targetSessionKey,
    accountId: params.accountId,
    idleTimeoutMs: params.idleTimeoutMs,
  });
}
/**
 * Updates the max age for bindings that match a session key.
 *
 * Returns the modified binding snapshots so command handlers can report the
 * concrete sessions affected by the generic channel command.
 */
function setChannelConversationBindingMaxAgeBySessionKey(params) {
  const setMaxAgeBySessionKey = getChannelPlugin(params.channelId)?.conversationBindings
    ?.setMaxAgeBySessionKey;
  if (!setMaxAgeBySessionKey) return [];
  return setMaxAgeBySessionKey({
    targetSessionKey: params.targetSessionKey,
    accountId: params.accountId,
    maxAgeMs: params.maxAgeMs,
  });
}
//#endregion
export {
  setChannelConversationBindingMaxAgeBySessionKey as n,
  setChannelConversationBindingIdleTimeoutBySessionKey as t,
};
