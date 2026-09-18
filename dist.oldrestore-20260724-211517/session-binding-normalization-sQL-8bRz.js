import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/infra/outbound/session-binding-normalization.ts
/**
 * Normalizes conversation ids and drops self-referential parent ids.
 */
function normalizeConversationTargetRef(ref) {
  const conversationId = normalizeOptionalString(ref.conversationId) ?? "";
  const parentConversationId = normalizeOptionalString(ref.parentConversationId);
  const { parentConversationId: _ignoredParentConversationId, ...rest } = ref;
  return {
    ...rest,
    conversationId,
    ...(parentConversationId && parentConversationId !== conversationId
      ? { parentConversationId }
      : {}),
  };
}
/**
 * Normalizes a full conversation reference for stable binding keys.
 */
function normalizeConversationRef(ref) {
  return {
    ...normalizeConversationTargetRef(ref),
    channel: normalizeLowercaseStringOrEmpty(ref.channel),
    accountId: normalizeAccountId(ref.accountId),
  };
}
/**
 * Builds the adapter registry key shared by channel/account scoped bindings.
 */
function buildChannelAccountKey(params) {
  return `${normalizeLowercaseStringOrEmpty(params.channel)}:${normalizeAccountId(params.accountId)}`;
}
//#endregion
export {
  normalizeConversationRef as n,
  normalizeConversationTargetRef as r,
  buildChannelAccountKey as t,
};
