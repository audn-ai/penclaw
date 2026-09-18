//#region extensions/telegram/src/topic-conversation.d.ts
type ParsedTelegramTopicConversation = {
  chatId: string;
  topicId: string;
  canonicalConversationId: string;
};
declare function parseTelegramTopicConversation(params: {
  conversationId: string;
  parentConversationId?: string;
}): ParsedTelegramTopicConversation | null;
//#endregion
export { parseTelegramTopicConversation as n, ParsedTelegramTopicConversation as t };
