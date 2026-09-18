//#region extensions/feishu/src/conversation-id.d.ts
type FeishuGroupSessionScope = "group" | "group_sender" | "group_topic" | "group_topic_sender";
declare function buildFeishuConversationId(params: {
  chatId: string;
  scope: FeishuGroupSessionScope;
  senderOpenId?: string;
  topicId?: string;
}): string;
declare function parseFeishuTargetId(raw: unknown): string | undefined;
declare function parseFeishuDirectConversationId(raw: unknown): string | undefined;
declare function parseFeishuConversationId(params: {
  conversationId: string;
  parentConversationId?: string;
}): {
  canonicalConversationId: string;
  chatId: string;
  topicId?: string;
  senderOpenId?: string;
  scope: FeishuGroupSessionScope;
} | null;
declare function buildFeishuModelOverrideParentCandidates(
  parentConversationId?: string | null,
): string[];
//#endregion
export {
  parseFeishuDirectConversationId as a,
  parseFeishuConversationId as i,
  buildFeishuConversationId as n,
  parseFeishuTargetId as o,
  buildFeishuModelOverrideParentCandidates as r,
  FeishuGroupSessionScope as t,
};
