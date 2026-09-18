import { o as resolveAssistantEventPhase } from "./chat-message-content-CeBHi_A4.js";
import {
  n as isSuppressedControlReplyText,
  t as isSuppressedControlReplyLeadFragment,
} from "./control-reply-text-B-VLZaLp.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-Btb1ssgA.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import {
  c as stripLeadingSilentToken,
  n as SILENT_REPLY_TOKEN,
  s as startsWithSilentToken,
} from "./tokens-DKI4eGAu.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/gateway/live-chat-projector.ts
const MAX_LIVE_CHAT_BUFFER_CHARS = 5e5;
/** Normalizes assistant event payloads that contain a snapshot, a delta, or both. */
function resolveAssistantLiveChatInput(data) {
  if (!data || typeof data !== "object") return;
  const record = data;
  if (typeof record.text !== "string" && typeof record.delta !== "string") return;
  return {
    text: typeof record.text === "string" ? record.text : "",
    delta: typeof record.delta === "string" ? record.delta : "",
  };
}
function capLiveAssistantBuffer(text) {
  if (text.length <= MAX_LIVE_CHAT_BUFFER_CHARS) return text;
  return sliceUtf16Safe(text, -5e5);
}
/** Merges assistant full-text and delta events into a capped live buffer. */
function resolveMergedAssistantText(params) {
  const { previousText, nextText, nextDelta } = params;
  if (nextText && previousText) {
    if (nextText.startsWith(previousText) && nextText.length > previousText.length)
      return capLiveAssistantBuffer(nextText);
    if (previousText.startsWith(nextText) && !nextDelta)
      return capLiveAssistantBuffer(previousText);
  }
  if (nextDelta) return capLiveAssistantBuffer(previousText + nextDelta);
  if (nextText) return capLiveAssistantBuffer(nextText);
  return capLiveAssistantBuffer(previousText);
}
/** Removes runtime-only context/directive tags from the merged live assistant buffer. */
function normalizeLiveAssistantBufferedText(text) {
  return stripInternalRuntimeContext(stripInlineDirectiveTagsForDisplay(text).text);
}
/** Projects buffered assistant text into display text or a suppressed/pending state. */
function projectLiveAssistantBufferedText(rawText, options) {
  if (!rawText)
    return {
      text: "",
      suppress: true,
      pendingLeadFragment: false,
    };
  if (isSuppressedControlReplyText(rawText))
    return {
      text: "",
      suppress: true,
      pendingLeadFragment: false,
    };
  if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(rawText))
    return {
      text: rawText,
      suppress: true,
      pendingLeadFragment: true,
    };
  const text = startsWithSilentToken(rawText, "NO_REPLY")
    ? stripLeadingSilentToken(rawText, SILENT_REPLY_TOKEN)
    : rawText;
  if (!text || isSuppressedControlReplyText(text))
    return {
      text: "",
      suppress: true,
      pendingLeadFragment: false,
    };
  if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(text))
    return {
      text,
      suppress: true,
      pendingLeadFragment: true,
    };
  return {
    text,
    suppress: false,
    pendingLeadFragment: false,
  };
}
/** Returns true when an assistant event phase should not appear in live chat. */
function shouldSuppressAssistantEventForLiveChat(data) {
  return resolveAssistantEventPhase(data) === "commentary";
}
//#endregion
export {
  shouldSuppressAssistantEventForLiveChat as a,
  resolveMergedAssistantText as i,
  projectLiveAssistantBufferedText as n,
  resolveAssistantLiveChatInput as r,
  normalizeLiveAssistantBufferedText as t,
};
