import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeBareIMessageChatIdentifier } from "./targets-BO9NhvfG.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./account-resolution-DijsTQIy.js";
import { c as normalizeE164 } from "./utils-DtcDeqWS.js";
//#region extensions/imessage/src/normalize.ts
const SERVICE_PREFIXES = ["imessage:", "sms:", "auto:"];
const CHAT_TARGET_PREFIX_RE =
  /^(chat_id:|chatid:|chat:|chat_guid:|chatguid:|guid:|chat_identifier:|chatidentifier:|chatident:)/i;
function looksLikeHandleOrPhoneTarget(params) {
  const trimmed = params.raw.trim();
  if (!trimmed) return false;
  if (params.prefixPattern.test(trimmed)) return true;
  if (trimmed.includes("@")) return true;
  return (params.phonePattern ?? /^\+?\d{3,}$/).test(trimmed);
}
function normalizeIMessageHandle(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lowered = normalizeLowercaseStringOrEmpty(trimmed);
  if (lowered.startsWith("imessage:")) return normalizeIMessageHandle(trimmed.slice(9));
  if (lowered.startsWith("sms:")) return normalizeIMessageHandle(trimmed.slice(4));
  if (lowered.startsWith("auto:")) return normalizeIMessageHandle(trimmed.slice(5));
  if (CHAT_TARGET_PREFIX_RE.test(trimmed)) {
    const prefix = trimmed.match(CHAT_TARGET_PREFIX_RE)?.[0];
    if (!prefix) return "";
    const value = trimmed.slice(prefix.length).trim();
    return `${normalizeLowercaseStringOrEmpty(prefix)}${value}`;
  }
  if (trimmed.includes("@")) return normalizeLowercaseStringOrEmpty(trimmed);
  const bareChatIdentifier = normalizeBareIMessageChatIdentifier(trimmed);
  if (bareChatIdentifier) return `chat_identifier:${bareChatIdentifier}`;
  const normalized = normalizeE164(trimmed);
  if (normalized) return normalized;
  return trimmed.replace(/\s+/g, "");
}
function normalizeIMessageMessagingTarget(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) return;
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  for (const prefix of SERVICE_PREFIXES)
    if (lower.startsWith(prefix)) {
      const normalizedHandle = normalizeIMessageHandle(trimmed.slice(prefix.length).trim());
      if (!normalizedHandle) return;
      if (CHAT_TARGET_PREFIX_RE.test(normalizedHandle)) return normalizedHandle;
      return `${prefix}${normalizedHandle}`;
    }
  return normalizeIMessageHandle(trimmed) || void 0;
}
function looksLikeIMessageTargetId(raw) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) return false;
  if (CHAT_TARGET_PREFIX_RE.test(trimmed)) return true;
  if (normalizeBareIMessageChatIdentifier(trimmed)) return true;
  return looksLikeHandleOrPhoneTarget({
    raw: trimmed,
    prefixPattern: /^(imessage:|sms:|auto:)/i,
  });
}
//#endregion
export { normalizeIMessageMessagingTarget as n, looksLikeIMessageTargetId as t };
