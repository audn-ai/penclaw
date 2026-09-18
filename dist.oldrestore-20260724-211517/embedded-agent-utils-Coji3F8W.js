import {
  f as stripReasoningTagsFromText,
  n as sanitizeAssistantVisibleText,
  t as sanitizeAssistantFinalAnswerText,
} from "./assistant-visible-text-DV1Yognj.js";
import {
  a as parseAssistantTextSignature,
  i as normalizeAssistantPhase,
} from "./chat-message-content-CeBHi_A4.js";
import {
  d as sanitizeUserFacingText,
  p as extractTextFromChatContent,
} from "./sanitize-user-facing-text-B_JqK9fo.js";
import { r as resolveToolDisplay, t as formatToolDetail } from "./tool-display-D6v1e5bQ.js";
//#region src/agents/embedded-agent-utils.ts
/** Narrow an agent message to an assistant message. */
function isAssistantMessage(msg) {
  return msg?.role === "assistant";
}
/**
 * Strip thinking tags and their content from text.
 * This is a safety net for cases where the model outputs <think> tags
 * that slip through other filtering mechanisms.
 */
function stripThinkingTagsFromText(text) {
  return stripReasoningTagsFromText(text, {
    mode: "strict",
    trim: "both",
  });
}
function sanitizeAssistantText(text, phase) {
  return phase === "final_answer"
    ? sanitizeAssistantFinalAnswerText(text)
    : sanitizeAssistantVisibleText(text);
}
function isAssistantTextContentBlockType(value) {
  return value === "text" || value === "input_text" || value === "output_text";
}
function sanitizeAssistantVisibleStreamText(text) {
  return sanitizeUserFacingText(sanitizeAssistantText(text), { errorContext: false });
}
function finalizeAssistantExtraction(msg, extracted) {
  return sanitizeUserFacingText(extracted, { errorContext: msg.stopReason === "error" });
}
function extractAssistantTextForPhase(msg, phase, options) {
  const messagePhase = normalizeAssistantPhase(msg.phase);
  const shouldIncludeContent = (resolvedPhase) => {
    if (phase) return resolvedPhase === phase;
    return resolvedPhase === void 0;
  };
  if (typeof msg.content === "string") {
    const hadRequestedPhase = phase ? messagePhase === phase : messagePhase === void 0;
    return {
      text: shouldIncludeContent(messagePhase)
        ? finalizeAssistantExtraction(msg, sanitizeAssistantText(msg.content, messagePhase))
        : "",
      hadRequestedPhase,
    };
  }
  if (!Array.isArray(msg.content))
    return {
      text: "",
      hadRequestedPhase: false,
    };
  const hasExplicitPhasedTextBlocks = msg.content.some((block) => {
    if (!block || typeof block !== "object") return false;
    const record = block;
    if (!isAssistantTextContentBlockType(record.type)) return false;
    return Boolean(parseAssistantTextSignature(record.textSignature)?.phase);
  });
  let hadRequestedPhase = false;
  return {
    text: finalizeAssistantExtraction(
      msg,
      msg.content
        .map((block) => {
          if (!block || typeof block !== "object") return null;
          const record = block;
          if (!isAssistantTextContentBlockType(record.type) || typeof record.text !== "string")
            return null;
          const signature = parseAssistantTextSignature(record.textSignature);
          const resolvedPhase =
            signature?.phase ?? (hasExplicitPhasedTextBlocks ? void 0 : messagePhase);
          if (!shouldIncludeContent(resolvedPhase)) return null;
          hadRequestedPhase = true;
          const sanitizerPhase =
            resolvedPhase ??
            (options?.unphasedSignedFinalAnswer === true && signature?.id
              ? "final_answer"
              : void 0);
          const text = sanitizeAssistantText(record.text, sanitizerPhase);
          return text.trim() ? text : null;
        })
        .filter((value) => typeof value === "string")
        .join("\n")
        .trim(),
    ),
    hadRequestedPhase,
  };
}
/** Extract text intended for users, preferring explicit final-answer phase blocks. */
function extractAssistantVisibleText(msg) {
  const finalAnswerExtraction = extractAssistantTextForPhase(msg, "final_answer");
  if (finalAnswerExtraction.hadRequestedPhase)
    return finalAnswerExtraction.text.trim() ? finalAnswerExtraction.text : "";
  return extractAssistantTextForPhase(msg, void 0, { unphasedSignedFinalAnswer: true }).text;
}
/** Extract the commentary/narration text of a commentary-phase assistant message. */
function extractAssistantCommentaryText(msg) {
  return extractAssistantTextForPhase(msg, "commentary").text;
}
/** Extract sanitized assistant text across all text content blocks. */
function extractAssistantText(msg) {
  return finalizeAssistantExtraction(
    msg,
    extractTextFromChatContent(msg.content, {
      sanitizeText: (text) => sanitizeAssistantText(text),
      joinWith: "\n",
      normalizeText: (text) => text.trim(),
    }) ?? "",
  );
}
/** Extract native thinking block text; signature-only blocks (no summary) surface nothing. */
function extractAssistantThinking(msg) {
  if (!Array.isArray(msg.content)) return "";
  return msg.content
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const record = block;
      if (record.type === "thinking" && typeof record.thinking === "string") {
        const thinking = record.thinking.trim();
        if (thinking) return thinking;
        if (typeof record.thinkingSignature === "string" && record.thinkingSignature.trim())
          return "";
      }
      return "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}
/** Format reasoning text for markdown-friendly channel surfaces. */
function formatReasoningMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return `Thinking\n\n${trimmed
    .split("\n")
    .map((line) => (line ? `_${line}_` : line))
    .join("\n")}`;
}
const THINKING_TAG_NAME_PATTERN = String.raw`(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)`;
const THINKING_TAG_OPEN_RE = new RegExp(String.raw`<\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "i");
const THINKING_TAG_CLOSE_RE = new RegExp(
  String.raw`<\s*\/\s*${THINKING_TAG_NAME_PATTERN}\s*>`,
  "i",
);
const THINKING_TAG_OPEN_GLOBAL_RE = new RegExp(
  String.raw`<\s*${THINKING_TAG_NAME_PATTERN}\s*>`,
  "gi",
);
const THINKING_TAG_CLOSE_GLOBAL_RE = new RegExp(
  String.raw`<\s*\/\s*${THINKING_TAG_NAME_PATTERN}\s*>`,
  "gi",
);
/** Global regex used to scan provider-emitted thinking tags. */
const THINKING_TAG_SCAN_RE = new RegExp(
  String.raw`<\s*(\/?)\s*${THINKING_TAG_NAME_PATTERN}\s*>`,
  "gi",
);
/** Split text that starts with thinking tags into structured thinking/text blocks. */
function splitThinkingTaggedText(text) {
  const trimmedStart = text.trimStart();
  if (!trimmedStart.startsWith("<")) return null;
  if (!THINKING_TAG_OPEN_RE.test(trimmedStart)) return null;
  if (!THINKING_TAG_CLOSE_RE.test(text)) return null;
  let inThinking = false;
  let cursor = 0;
  let thinkingStart = 0;
  const blocks = [];
  const pushText = (value) => {
    if (!value) return;
    blocks.push({
      type: "text",
      text: value,
    });
  };
  const pushThinking = (value) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    blocks.push({
      type: "thinking",
      thinking: cleaned,
    });
  };
  for (const match of text.matchAll(THINKING_TAG_SCAN_RE)) {
    const index = match.index ?? 0;
    const isClose = match[1]?.includes("/") ?? false;
    if (!inThinking && !isClose) {
      pushText(text.slice(cursor, index));
      thinkingStart = index + match[0].length;
      inThinking = true;
      continue;
    }
    if (inThinking && isClose) {
      pushThinking(text.slice(thinkingStart, index));
      cursor = index + match[0].length;
      inThinking = false;
    }
  }
  if (inThinking) return null;
  pushText(text.slice(cursor));
  if (!blocks.some((b) => b.type === "thinking")) return null;
  return blocks;
}
/** Promote inline thinking-tag text blocks into native thinking blocks in place. */
function promoteThinkingTagsToBlocks(message) {
  if (!Array.isArray(message.content)) return;
  if (
    message.content.some((block) => block && typeof block === "object" && block.type === "thinking")
  )
    return;
  const next = [];
  let changed = false;
  for (const block of message.content) {
    if (!block || typeof block !== "object" || !("type" in block)) {
      next.push(block);
      continue;
    }
    if (block.type !== "text") {
      next.push(block);
      continue;
    }
    const split = splitThinkingTaggedText(block.text);
    if (!split) {
      next.push(block);
      continue;
    }
    changed = true;
    for (const part of split)
      if (part.type === "thinking")
        next.push({
          type: "thinking",
          thinking: part.thinking,
        });
      else if (part.type === "text") {
        const cleaned = part.text.trimStart();
        if (cleaned)
          next.push({
            type: "text",
            text: cleaned,
          });
      }
  }
  if (!changed) return;
  message.content = next;
}
/** Extract closed thinking-tag content from a complete text payload. */
function extractThinkingFromTaggedText(text) {
  if (!text) return "";
  let result = "";
  let lastIndex = 0;
  let inThinking = false;
  for (const match of text.matchAll(THINKING_TAG_SCAN_RE)) {
    const idx = match.index ?? 0;
    if (inThinking) result += text.slice(lastIndex, idx);
    inThinking = !(match[1] === "/");
    lastIndex = idx + match[0].length;
  }
  return result.trim();
}
/** Extract thinking-tag content from a possibly incomplete streaming payload. */
function extractThinkingFromTaggedStream(text) {
  if (!text) return "";
  const closed = extractThinkingFromTaggedText(text);
  if (closed) return closed;
  const openMatches = [...text.matchAll(THINKING_TAG_OPEN_GLOBAL_RE)];
  if (openMatches.length === 0) return "";
  const closeMatches = [...text.matchAll(THINKING_TAG_CLOSE_GLOBAL_RE)];
  const lastOpen = openMatches.at(-1);
  const lastClose = closeMatches.at(-1);
  if (!lastOpen) return "";
  if (lastClose && (lastClose.index ?? -1) > (lastOpen.index ?? -1)) return closed;
  const start = (lastOpen.index ?? 0) + lastOpen[0].length;
  return text.slice(start).trim();
}
/** Infer compact display metadata for a tool call from its args. */
function inferToolMetaFromArgs(toolName, args, options) {
  return formatToolDetail(
    resolveToolDisplay({
      name: toolName,
      args,
      detailMode: options?.detailMode,
    }),
  );
}
//#endregion
export {
  extractAssistantVisibleText as a,
  formatReasoningMessage as c,
  promoteThinkingTagsToBlocks as d,
  sanitizeAssistantVisibleStreamText as f,
  extractAssistantThinking as i,
  inferToolMetaFromArgs as l,
  stripThinkingTagsFromText as m,
  extractAssistantCommentaryText as n,
  extractThinkingFromTaggedStream as o,
  splitThinkingTaggedText as p,
  extractAssistantText as r,
  extractThinkingFromTaggedText as s,
  THINKING_TAG_SCAN_RE as t,
  isAssistantMessage as u,
};
