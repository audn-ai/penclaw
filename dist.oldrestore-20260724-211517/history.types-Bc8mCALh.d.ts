//#region src/auto-reply/reply/history.types.d.ts
/** Normalized history message used when building reply context. */
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
/** Media metadata attached to a normalized history message. */
type HistoryMediaEntry = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: "image" | "video" | "audio" | "document" | "unknown";
  messageId?: string;
};
//#endregion
export { HistoryMediaEntry as n, HistoryEntry as t };
