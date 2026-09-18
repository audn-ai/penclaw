import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.js";
import { p as resolveThreadSessionKeys } from "./session-key-druuY-GG.js";
import "./routing-CwvmVRHd.js";
import "./html-entity-runtime-DaPF1Tq9.js";
//#region extensions/msteams/src/inbound.ts
/**
 * Strip HTML tags, preserving text content.
 */
function htmlToPlainText(html) {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " "))
    .replaceAll("\xA0", " ")
    .replace(/\s+/g, " ")
    .trim();
}
/**
 * Extract quote info from MS Teams HTML reply attachments.
 * Teams wraps quoted content in a blockquote with itemtype="http://schema.skype.com/Reply".
 */
function extractMSTeamsQuoteInfo(attachments) {
  for (const att of attachments) {
    let content = "";
    if (typeof att.content === "string") content = att.content;
    else if (typeof att.content === "object" && att.content !== null) {
      const record = att.content;
      content =
        typeof record.text === "string"
          ? record.text
          : typeof record.body === "string"
            ? record.body
            : "";
    }
    if (!content) continue;
    if (!content.includes("http://schema.skype.com/Reply")) continue;
    const senderMatch = /<strong[^>]*itemprop=["']mri["'][^>]*>(.*?)<\/strong>/i.exec(content);
    const sender = senderMatch?.[1] ? htmlToPlainText(senderMatch[1]) : void 0;
    const bodyMatch =
      /<p[^>]*itemprop=["']copy["'][^>]*>(.*?)<\/p>/is.exec(content) ??
      /<p[^>]*itemprop=["']preview["'][^>]*>(.*?)<\/p>/is.exec(content);
    const body = bodyMatch?.[1] ? htmlToPlainText(bodyMatch[1]) : void 0;
    const id =
      /<blockquote[^>]*\bitemid=["']([^"']+)["'][^>]*>/is.exec(content)?.[1]?.trim() || void 0;
    if (body)
      return {
        sender: sender ?? "unknown",
        body,
        ...(id ? { id } : {}),
      };
  }
}
function normalizeMSTeamsConversationId(raw) {
  return raw.split(";")[0] ?? raw;
}
function extractMSTeamsConversationMessageId(raw) {
  if (!raw) return;
  return (/(?:^|;)messageid=([^;]+)/i.exec(raw)?.[1]?.trim() ?? "") || void 0;
}
function parseMSTeamsActivityTimestamp(value) {
  if (!value) return;
  if (value instanceof Date) return value;
  if (typeof value !== "string") return;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? void 0 : date;
}
function stripMSTeamsMentionTags(text) {
  return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}
function wasMSTeamsBotMentioned(activity) {
  const botId = activity.recipient?.id;
  if (!botId) return false;
  return (activity.entities ?? []).some((e) => e.type === "mention" && e.mentioned?.id === botId);
}
//#endregion
//#region extensions/msteams/src/monitor-handler/thread-session.ts
const TRAILING_THREAD_SUFFIX = /(?::thread:[^:]+)+$/;
function resolveMSTeamsRouteSessionKey(params) {
  const channelThreadId = params.isChannel
    ? (params.conversationMessageId ?? params.replyToId ?? void 0)
    : void 0;
  const cleanBase = params.baseSessionKey.replace(TRAILING_THREAD_SUFFIX, "");
  return resolveThreadSessionKeys({
    baseSessionKey: cleanBase,
    threadId: channelThreadId,
    parentSessionKey: channelThreadId ? cleanBase : void 0,
  }).sessionKey;
}
//#endregion
export {
  parseMSTeamsActivityTimestamp as a,
  normalizeMSTeamsConversationId as i,
  extractMSTeamsConversationMessageId as n,
  stripMSTeamsMentionTags as o,
  extractMSTeamsQuoteInfo as r,
  wasMSTeamsBotMentioned as s,
  resolveMSTeamsRouteSessionKey as t,
};
