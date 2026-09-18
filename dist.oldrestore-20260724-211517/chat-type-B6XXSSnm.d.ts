//#region src/channels/chat-type.d.ts
/**
 * Normalized conversation kind shared by channel routing, sessions, and SDK helpers.
 */
type ChatType = "direct" | "group" | "channel";
/**
 * Normalizes channel-specific chat type labels into OpenClaw conversation kinds.
 */
declare function normalizeChatType(raw?: string): ChatType | undefined;
//#endregion
export { normalizeChatType as n, ChatType as t };
