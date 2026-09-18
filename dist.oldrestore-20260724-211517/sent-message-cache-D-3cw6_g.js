import { createHash } from "node:crypto";
import fs from "node:fs";
import {
  i as normalizeAllowFrom,
  o as resolveTelegramEffectiveDmPolicy,
  r as isSenderAllowed,
  t as expandTelegramAllowFromWithAccessGroups,
} from "./access-groups-Xh_Qfj4e.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { n as firstDefined } from "./allow-from-o-cfFFcK.js";
import {
  n as isAutoLinkedFileRef,
  t as FILE_REF_EXTENSIONS_WITH_TLD,
} from "./auto-linked-file-ref-DIO7giFK.js";
import { r as renderMarkdownIRChunksWithinLimit } from "./chunk-items-BB3E9W12.js";
import { t as resolveCommandAuthorization } from "./command-auth-CUBmRLXD.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  b as parseStrictPositiveInteger,
  o as asDateTimestampMs,
  v as parseStrictInteger,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import "./text-chunking-Dr19ggf-.js";
import { i as readChannelAllowFromStore } from "./pairing-store-C4j5pnVS.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./routing-CwvmVRHd.js";
import {
  E as formatLocationText,
  m as resolveSendableOutboundReplyParts,
} from "./reply-payload-DDwHXDkv.js";
import { n as getTelegramRuntime, t as getOptionalTelegramRuntime } from "./runtime-B_f_VNpK.js";
import "./channel-outbound-DlkFd7rO.js";
import "./conversation-runtime-DuXhVyjf.js";
import "./command-auth-native-D63iLZoQ.js";
import "./channel-inbound-vhkYEe2n.js";
import { m as resolveStorePath } from "./session-store-runtime-BwE6SlGz.js";
import { h as resolveChannelPreviewStreamMode } from "./streaming-D_YE0SPS.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  a as markdownToIRWithMeta,
  i as markdownToIR,
  n as renderMarkdownWithMarkers,
  o as sliceMarkdownIR,
  u as tokenizeHtmlTags,
} from "./tables-YoFSvuf8.js";
//#region extensions/telegram/src/outbound-params.ts
function parseIntegerId(value) {
  return parseStrictInteger(value);
}
function parseTelegramMessageThreadId(value) {
  return parseStrictNonNegativeInteger(value);
}
function normalizeTelegramReplyToMessageId(value) {
  if (typeof value !== "string") return parseIntegerId(value);
  const trimmed = value.trim();
  return trimmed ? parseIntegerId(trimmed) : void 0;
}
function parseTelegramReplyToMessageId(replyToId) {
  return normalizeTelegramReplyToMessageId(replyToId);
}
function parseTelegramThreadId(threadId) {
  if (threadId == null) return;
  if (typeof threadId === "number") return parseIntegerId(threadId);
  const trimmed = threadId.trim();
  if (!trimmed) return;
  const topicMatch = /^-?\d+:topic:(\d+)$/.exec(trimmed);
  if (topicMatch) return parseIntegerId(topicMatch[1]);
  const scopedMatch = /^-?\d+:(-?\d+)$/.exec(trimmed);
  return parseIntegerId(scopedMatch ? scopedMatch[1] : trimmed);
}
//#endregion
//#region extensions/telegram/src/preview-streaming.ts
function resolveTelegramPreviewStreamMode(params = {}) {
  return resolveChannelPreviewStreamMode(params, "partial");
}
//#endregion
//#region extensions/telegram/src/format-html.ts
const TELEGRAM_HTML_ENTITY_PATTERN = /&(#[xX][0-9A-Fa-f]+|#\d+|amp|lt|gt|quot|apos);/g;
const TELEGRAM_RICH_BLOCK_HTML_TAGS = /* @__PURE__ */ new Set([
  "aside",
  "audio",
  "blockquote",
  "details",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "table",
  "tg-collage",
  "tg-map",
  "tg-math-block",
  "tg-slideshow",
  "tr",
  "ul",
  "video",
]);
const TELEGRAM_RICH_LINE_BREAK_STRUCTURAL_TAGS = /* @__PURE__ */ new Set([
  ...TELEGRAM_RICH_BLOCK_HTML_TAGS,
  "caption",
  "col",
  "colgroup",
  "figcaption",
  "summary",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
]);
function isNamedAnchor(rawTag, tagName) {
  return tagName === "a" && /\sname="[^"]+"/i.test(rawTag);
}
function isTelegramRichBlockHtmlTag(rawTag, tagName) {
  return TELEGRAM_RICH_BLOCK_HTML_TAGS.has(tagName) || isNamedAnchor(rawTag, tagName);
}
function isTelegramRichLineBreakStructuralTag(rawTag, tagName) {
  return TELEGRAM_RICH_LINE_BREAK_STRUCTURAL_TAGS.has(tagName) || isNamedAnchor(rawTag, tagName);
}
function isValidTelegramHtmlEntityCodePoint(codePoint) {
  return (
    Number.isInteger(codePoint) &&
    codePoint >= 0 &&
    codePoint <= 1114111 &&
    !(codePoint >= 55296 && codePoint <= 57343)
  );
}
function decodeTelegramHtmlEntity(entity, fallback) {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    const codePoint = Number.parseInt(entity.slice(2), 16);
    return isValidTelegramHtmlEntityCodePoint(codePoint)
      ? String.fromCodePoint(codePoint)
      : fallback;
  }
  if (entity.startsWith("#")) {
    const codePoint = Number.parseInt(entity.slice(1), 10);
    return isValidTelegramHtmlEntityCodePoint(codePoint)
      ? String.fromCodePoint(codePoint)
      : fallback;
  }
  switch (entity) {
    case "amp":
      return "&";
    case "lt":
      return "<";
    case "gt":
      return ">";
    case "quot":
      return '"';
    case "apos":
      return "'";
    default:
      return fallback;
  }
}
function decodeTelegramHtmlEntities(text) {
  return text.replace(TELEGRAM_HTML_ENTITY_PATTERN, (match, entity) =>
    decodeTelegramHtmlEntity(entity, match),
  );
}
function findTelegramHtmlEntityEnd(text, start) {
  if (text[start] !== "&") return -1;
  let index = start + 1;
  if (index >= text.length) return -1;
  if (text[index] === "#") {
    index += 1;
    if (index >= text.length) return -1;
    if (text[index] === "x" || text[index] === "X") {
      index += 1;
      const hexStart = index;
      while (/[0-9A-Fa-f]/.test(text[index] ?? "")) index += 1;
      if (index === hexStart) return -1;
    } else {
      const digitStart = index;
      while (/[0-9]/.test(text[index] ?? "")) index += 1;
      if (index === digitStart) return -1;
    }
  } else {
    const nameStart = index;
    while (/[A-Za-z0-9]/.test(text[index] ?? "")) index += 1;
    if (index === nameStart) return -1;
  }
  return text[index] === ";" ? index : -1;
}
//#endregion
//#region extensions/telegram/src/format-assistant-transcript.ts
const TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX = "<code>Assistant:</code> ";
function maskTelegramExcludedText(text) {
  return text
    .split("\n")
    .map((line) =>
      line.trim() ? `x${" ".repeat(Math.max(0, line.length - 1))}` : " ".repeat(line.length),
    )
    .join("\n");
}
function maskTelegramExcludedRanges(projection) {
  let masked = "";
  let cursor = 0;
  for (const range of projection.excludedRanges) {
    masked += projection.text.slice(cursor, range.start);
    masked += maskTelegramExcludedText(projection.text.slice(range.start, range.end));
    cursor = range.end;
  }
  return masked + projection.text.slice(cursor);
}
function telegramProjectionHasRoleHeader(projection) {
  return Boolean(
    markdownToIR(maskTelegramExcludedRanges(projection), {
      assistantTranscriptRoleHeaders: true,
      autolink: false,
      blockquotePrefix: "",
      headingStyle: "none",
      linkify: false,
      tableMode: "off",
    }).annotations?.some((annotation) => annotation.type === "assistant_transcript_role"),
  );
}
function appendTelegramHtmlVisibleValue(projection, value, excluded) {
  if (!value) return;
  const start = projection.text.length;
  projection.text += value;
  if (!excluded) return;
  const previous = projection.excludedRanges.at(-1);
  if (previous?.end === start) previous.end = projection.text.length;
  else
    projection.excludedRanges.push({
      start,
      end: projection.text.length,
    });
}
function appendTelegramHtmlVisibleSegment(projection, segment, excluded) {
  let index = 0;
  while (index < segment.length) {
    if (segment[index] === "&") {
      const entityEnd = findTelegramHtmlEntityEnd(segment, index);
      if (entityEnd >= 0) {
        appendTelegramHtmlVisibleValue(
          projection,
          decodeTelegramHtmlEntities(segment.slice(index, entityEnd + 1)),
          excluded,
        );
        index = entityEnd + 1;
        continue;
      }
    }
    const codePoint = segment.codePointAt(index);
    if (codePoint === void 0) break;
    const character = String.fromCodePoint(codePoint);
    appendTelegramHtmlVisibleValue(projection, character, excluded);
    index += character.length;
  }
}
function projectTelegramHtmlVisibleText(html) {
  const projection = {
    text: "",
    excludedRanges: [],
  };
  let codeDepth = 0;
  let preDepth = 0;
  let lastIndex = 0;
  for (const tag of tokenizeHtmlTags(html)) {
    const tagStart = tag.start;
    const tagEnd = tag.end;
    appendTelegramHtmlVisibleSegment(
      projection,
      html.slice(lastIndex, tagStart),
      codeDepth > 0 || preDepth > 0,
    );
    const rawTag = tag.raw;
    const tagName = tag.name;
    const isClosing = tag.closing;
    const isSelfClosing = tag.selfClosing;
    if (
      isTelegramRichLineBreakStructuralTag(rawTag, tagName) &&
      projection.text &&
      !projection.text.endsWith("\n")
    )
      appendTelegramHtmlVisibleValue(projection, "\n", codeDepth > 0 || preDepth > 0);
    if (tagName === "br" && !isClosing)
      appendTelegramHtmlVisibleValue(projection, "\n", codeDepth > 0 || preDepth > 0);
    if (!isSelfClosing && tagName === "code")
      codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
    else if (!isSelfClosing && tagName === "pre")
      preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
    lastIndex = tagEnd;
  }
  appendTelegramHtmlVisibleSegment(
    projection,
    html.slice(lastIndex),
    codeDepth > 0 || preDepth > 0,
  );
  return projection;
}
function protectTelegramAssistantTranscriptRoleHeaders(html) {
  if (html.startsWith("<code>Assistant:</code> ")) return html;
  if (!telegramProjectionHasRoleHeader(projectTelegramHtmlVisibleText(html))) return html;
  return `${TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX}${html}`;
}
//#endregion
//#region extensions/telegram/src/format-render.ts
function renderTelegramMarkdownIR(ir, options) {
  return renderMarkdownWithMarkers(ir, {
    annotationMarkers: {
      assistant_transcript_role: {
        open: "<code>",
        close: "</code>",
        suppressNestedFormatting: true,
      },
    },
    styleMarkers: {
      bold: {
        open: "<b>",
        close: "</b>",
      },
      italic: {
        open: "<i>",
        close: "</i>",
      },
      strikethrough: {
        open: "<s>",
        close: "</s>",
      },
      code: {
        open: "<code>",
        close: "</code>",
      },
      code_block: {
        open: options.buildCodeBlockOpen,
        close: "</code></pre>",
      },
      spoiler: {
        open: "<tg-spoiler>",
        close: "</tg-spoiler>",
      },
      blockquote: {
        open: "<blockquote>",
        close: "</blockquote>",
      },
      heading_1: {
        open: "<h1>",
        close: "</h1>",
      },
      heading_2: {
        open: "<h2>",
        close: "</h2>",
      },
      heading_3: {
        open: "<h3>",
        close: "</h3>",
      },
      heading_4: {
        open: "<h4>",
        close: "</h4>",
      },
      heading_5: {
        open: "<h5>",
        close: "</h5>",
      },
      heading_6: {
        open: "<h6>",
        close: "</h6>",
      },
    },
    escapeText: options.escapeText,
    buildLink: options.buildLink,
  });
}
//#endregion
//#region extensions/telegram/src/format.ts
const TELEGRAM_RICH_NESTING_LIMIT = 16;
function escapeTelegramHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeHtml(text) {
  return escapeTelegramHtml(text);
}
function escapeHtmlAttr(text) {
  return escapeHtml(text).replace(/"/g, "&quot;");
}
function isTelegramRichLinkHref(href) {
  return /^(?:https?:\/\/|tg:\/\/|mailto:|tel:|#)/i.test(href);
}
/**
 * File extensions that share TLDs and commonly appear in code/documentation.
 * These are wrapped in <code> tags to prevent Telegram from generating
 * spurious domain registrar previews.
 *
 * Only includes extensions that are:
 * 1. Commonly used as file extensions in code/docs
 * 2. Rarely used as intentional domain references
 *
 * Excluded: .ai, .io, .tv, .fm (popular domain TLDs like x.ai, vercel.io, github.io)
 */
function buildTelegramLink(link, text) {
  const href = link.href.trim();
  if (!href) return null;
  if (link.start === link.end) return null;
  if (!isTelegramRichLinkHref(href)) return null;
  if (isAutoLinkedFileRef(href, text.slice(link.start, link.end))) return null;
  const safeHref = escapeHtmlAttr(href);
  return {
    start: link.start,
    end: link.end,
    open: `<a href="${safeHref}">`,
    close: "</a>",
  };
}
function buildTelegramCodeBlockOpen(span) {
  if (!span.language) return "<pre><code>";
  return `<pre><code class="language-${escapeHtmlAttr(span.language)}">`;
}
function renderTelegramHtml(ir) {
  return renderTelegramMarkdownIR(ir, {
    escapeText: escapeHtml,
    buildLink: buildTelegramLink,
    buildCodeBlockOpen: buildTelegramCodeBlockOpen,
  });
}
function leadingWhitespaceLength(line) {
  let length = 0;
  while (line[length] === " " || line[length] === "	") length++;
  return length;
}
function isTelegramBulletLine(line) {
  return /^[ \t]*(?:[•*+-])[ \t]+\S/.test(line);
}
function isTelegramListBoundaryLine(line) {
  return /^[ \t]*(?:\d+\.|#{1,6})[ \t]+\S/.test(line);
}
function isMarkdownIndentedCodeLine(line) {
  return /^(?: {4}|\t)/.test(line);
}
function shouldPreserveTelegramListBoundarySpacing(previous, next) {
  return (
    !isMarkdownIndentedCodeLine(previous) &&
    !isMarkdownIndentedCodeLine(next) &&
    isTelegramBulletLine(previous) &&
    isTelegramListBoundaryLine(next) &&
    leadingWhitespaceLength(next) <= leadingWhitespaceLength(previous)
  );
}
function preserveTelegramListBoundarySpacing(markdown) {
  const lines = markdown.split("\n");
  const out = [];
  let inFence = false;
  let previousLine = "";
  for (const line of lines) {
    const normalizedLine = line.replace(/\r$/, "");
    const isFenceLine = /^[ \t]*(?:```|~~~)/.test(normalizedLine);
    if (!inFence && shouldPreserveTelegramListBoundarySpacing(previousLine, normalizedLine))
      out.push("");
    out.push(line);
    if (isFenceLine) inFence = !inFence;
    previousLine = normalizedLine;
  }
  return out.join("\n");
}
function markdownToTelegramHtml(markdown, options = {}) {
  const tableMode = options.tableMode === "block" ? "code" : options.tableMode;
  const telegramHtml = renderSupportedTelegramHtml(
    renderTelegramHtml(
      markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
        assistantTranscriptRoleHeaders: true,
        linkify: true,
        enableSpoilers: true,
        headingStyle: "none",
        blockquotePrefix: "",
        tableMode,
      }),
    ),
  );
  if (options.wrapFileRefs !== false) return wrapFileReferencesInHtml(telegramHtml);
  return telegramHtml;
}
/**
 * Wraps standalone file references (with TLD extensions) in <code> tags.
 * This prevents Telegram from treating them as URLs and generating
 * irrelevant domain registrar previews.
 *
 * Runs AFTER markdown→HTML conversion to avoid modifying HTML attributes.
 * Skips content inside <code>, <pre>, and <a> tags to avoid nesting issues.
 */
/** Escape regex metacharacters in a string */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const AUTO_LINKED_ANCHOR_PATTERN = /<a\s+href="https?:\/\/([^"]+)"[^>]*>\1<\/a>/gi;
const HTML_MODE_TAG_PATTERN = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>$/;
const ESCAPED_HTML_TAG_PATTERN = /&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)&gt;/g;
const TELEGRAM_HTML_ANCHOR_PATTERN =
  /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const TELEGRAM_HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const TELEGRAM_HTML_TAG_PATTERN = /<[^>]*>/g;
const TELEGRAM_RICH_MEDIA_BLOCK_PATTERN =
  /[^\S\r\n]*(?:<figure\b[^>]*>[\s\S]*?<\/figure>|<tg-collage\b[^>]*>[\s\S]*?<\/tg-collage>|<tg-slideshow\b[^>]*>[\s\S]*?<\/tg-slideshow>|<img\b[^>]*\bsrc="https?:\/\/[^"]+"[^>]*\/?>|<video\b[^>]*\bsrc="https?:\/\/[^"]+"[^>]*(?:\/>|>[\s\S]*?<\/video>)|<audio\b[^>]*\bsrc="https?:\/\/[^"]+"[^>]*(?:\/>|>[\s\S]*?<\/audio>)|<tg-map\b[^>]*\/?>)[^\S\r\n]*/gi;
const TELEGRAM_RICH_HTML_TABLE_PATTERN = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
const TELEGRAM_CANONICAL_RICH_HTML_TABLE_PATTERN = /^<table bordered striped>/i;
const TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const TELEGRAM_HTML_CAPTION_PATTERN = /<caption\b[^>]*>([\s\S]*?)<\/caption>/i;
const TELEGRAM_HTML_COLSPAN_PATTERN = /\bcolspan\s*=\s*(?:"(\d+)"|'(\d+)'|(\d+))/i;
const TELEGRAM_HTML_ROWSPAN_PATTERN = /\browspan\s*=/i;
const TELEGRAM_HTML_ALIGN_PATTERN =
  /\balign\s*=\s*(?:"(left|center|right)"|'(left|center|right)'|(left|center|right))/i;
const TELEGRAM_MARKDOWN_MEDIA_BLOCK_PATTERN =
  /^([ \t]*)!\[([^\]\n]*)\]\((https?:\/\/[^\s)"]+)(?:\s+"([^"\n]*)")?\)[ \t]*$/;
const TELEGRAM_MARKDOWN_INLINE_IMAGE_PATTERN = /!\[([^\]\n]*)\]\(([^)\n]+)\)/g;
const TELEGRAM_MARKDOWN_REFERENCE_IMAGE_PATTERN = /!\[([^\]\n]*)\]\[([^\]\n]+)\]/g;
const TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_PREFIX = "telegram-media:";
const TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_SUFFIX = "";
const TELEGRAM_SIMPLE_HTML_TAGS = /* @__PURE__ */ new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "ins",
  "s",
  "strike",
  "del",
  "code",
  "pre",
  "tg-spoiler",
]);
const TELEGRAM_ATTR_HTML_TAG_PATTERNS = /* @__PURE__ */ new Map([
  ["a", /^\s+href="[^"]+"\s*$/],
  ["span", /^\s+class="tg-spoiler"\s*$/],
  ["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
  ["tg-time", /^\s+datetime="[^"]+"\s*$/],
  ["blockquote", /^(\s+expandable)?\s*$/],
]);
const TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN = /^\s+class="language-[^"]+"\s*$/;
const TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT = 20;
const TELEGRAM_VOID_HTML_TAGS = /* @__PURE__ */ new Set(["br", "hr", "img", "input", "tg-map"]);
const TELEGRAM_RICH_MEDIA_HTML_TAGS = /* @__PURE__ */ new Set(["audio", "img", "video"]);
const TELEGRAM_RICH_SIMPLE_HTML_TAGS = /* @__PURE__ */ new Set([
  ...TELEGRAM_SIMPLE_HTML_TAGS,
  "a",
  "aside",
  "audio",
  "blockquote",
  "br",
  "caption",
  "cite",
  "details",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "li",
  "mark",
  "ol",
  "p",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tg-collage",
  "tg-math",
  "tg-math-block",
  "tg-slideshow",
  "th",
  "thead",
  "tr",
  "ul",
  "video",
]);
const TELEGRAM_RICH_ATTR_HTML_TAG_PATTERNS = new Map([
  ...TELEGRAM_ATTR_HTML_TAG_PATTERNS,
  ["a", /^\s+(?:href|name)="[^"]+"\s*$/],
  [
    "audio",
    /^(?=.*\ssrc="https?:\/\/[^"]+")(?:\s+src="https?:\/\/[^"]+"|\s+title="[^"]*")*\s*\/?\s*$/,
  ],
  ["details", /^\s+open\s*$/],
  ["figure", /^\s+tg-spoiler\s*$/],
  [
    "img",
    /^(?=.*\ssrc="https?:\/\/[^"]+")(?:\s+src="https?:\/\/[^"]+"|\s+(?:alt|title)="[^"]*"|\s+tg-spoiler)*\s*\/?\s*$/,
  ],
  ["input", /^\s+type="checkbox"(?:\s+checked)?\s*\/?\s*$/],
  ["li", /^(?:\s+(?:value|type)="[^"]*")*\s*$/],
  ["ol", /^(?:\s+(?:start|type)="[^"]*"|\s+reversed)*\s*$/],
  ["table", /^(?:\s+(?:bordered|striped))*\s*$/],
  [
    "td",
    /^(?:\s+(?:colspan|rowspan)="[1-9]\d*"|\s+align="(?:left|center|right)"|\s+valign="(?:top|middle|bottom)")*\s*$/,
  ],
  ["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
  ["tg-map", /^\s+lat="[^"]+"\s+long="[^"]+"(?:\s+zoom="[^"]+")?\s*\/?\s*$/],
  ["tg-reference", /^\s+name="[^"]+"\s*$/],
  ["tg-time", /^\s+unix="[^"]+"(?:\s+format="[^"]+")?\s*$/],
  [
    "th",
    /^(?:\s+(?:colspan|rowspan)="[1-9]\d*"|\s+align="(?:left|center|right)"|\s+valign="(?:top|middle|bottom)")*\s*$/,
  ],
  [
    "video",
    /^(?=.*\ssrc="https?:\/\/[^"]+")(?:\s+src="https?:\/\/[^"]+"|\s+title="[^"]*"|\s+tg-spoiler)*\s*\/?\s*$/,
  ],
]);
let fileReferencePattern;
let orphanedTldPattern;
const TELEGRAM_LEGACY_HTML_TAG_SUPPORT = {
  simpleTags: TELEGRAM_SIMPLE_HTML_TAGS,
  attrPatterns: TELEGRAM_ATTR_HTML_TAG_PATTERNS,
};
const TELEGRAM_RICH_HTML_TAG_SUPPORT = {
  simpleTags: TELEGRAM_RICH_SIMPLE_HTML_TAGS,
  attrPatterns: TELEGRAM_RICH_ATTR_HTML_TAG_PATTERNS,
};
function popLastTagName(tags, name) {
  for (let index = tags.length - 1; index >= 0; index -= 1)
    if (tags[index] === name) {
      tags.splice(index, 1);
      return true;
    }
  return false;
}
function isSupportedTelegramHtmlTag(rawTag, support) {
  const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
  if (!match) return false;
  const closing = match[1] === "/";
  const name = normalizeLowercaseStringOrEmpty(match[2]);
  const attrs = match[3] ?? "";
  if (closing)
    return attrs.trim() === "" && (support.simpleTags.has(name) || support.attrPatterns.has(name));
  if (name === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) return true;
  if (support.attrPatterns.get(name)?.test(attrs)) return true;
  return support.simpleTags.has(name) && attrs.trim() === "";
}
function hasOpenTelegramHtmlTag(tags, name) {
  return tags.includes(name);
}
function preserveTelegramHtmlTag(
  rawTag,
  openTags,
  escapeTag,
  support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT,
) {
  const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
  if (!match) return escapeTag(rawTag);
  const closing = match[1] === "/";
  const tagName = normalizeLowercaseStringOrEmpty(match[2]);
  const attrs = match[3] ?? "";
  if (!closing && tagName === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) {
    openTags.push(tagName);
    if (hasOpenTelegramHtmlTag(openTags, "pre")) return rawTag;
    return "<code>";
  }
  if (!isSupportedTelegramHtmlTag(rawTag, support)) return escapeTag(rawTag);
  if (closing) return popLastTagName(openTags, tagName) ? rawTag : escapeTag(rawTag);
  if (TELEGRAM_VOID_HTML_TAGS.has(tagName) || rawTag.trimEnd().endsWith("/>")) return rawTag;
  openTags.push(tagName);
  return rawTag;
}
function escapeUnsupportedTelegramHtml(text, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
  let result = "";
  let index = 0;
  const openTags = [];
  while (index < text.length) {
    const char = text[index];
    if (char === "&") {
      const entityEnd = findTelegramHtmlEntityEnd(text, index);
      if (entityEnd !== -1) {
        result += text.slice(index, entityEnd + 1);
        index = entityEnd + 1;
      } else {
        result += "&amp;";
        index += 1;
      }
      continue;
    }
    if (char === "<") {
      const end = text.indexOf(">", index + 1);
      if (end !== -1) {
        const rawTag = text.slice(index, end + 1);
        result += preserveTelegramHtmlTag(rawTag, openTags, escapeHtml, support);
        index = end + 1;
      } else {
        result += "&lt;";
        index += 1;
      }
      continue;
    }
    if (char === ">") {
      result += "&gt;";
      index += 1;
      continue;
    }
    result += char;
    index += 1;
  }
  return result;
}
function stripTelegramHtmlForPlainText(html) {
  return decodeTelegramHtmlEntities(
    html.replace(TELEGRAM_HTML_BREAK_PATTERN, "\n").replace(TELEGRAM_HTML_TAG_PATTERN, ""),
  );
}
function encodePlainTextForTelegramHtmlStrip(text) {
  return text.replace(/[&<>]/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return char;
    }
  });
}
function telegramHtmlToPlainTextFallback(html) {
  const withPlainTables = html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
    return parseTelegramRichHtmlTableRows(tableHtml)
      .map((row) => row.join(" | "))
      .join("\n");
  });
  TELEGRAM_HTML_ANCHOR_PATTERN.lastIndex = 0;
  return stripTelegramHtmlForPlainText(
    withPlainTables.replace(
      TELEGRAM_HTML_ANCHOR_PATTERN,
      (_match, doubleQuotedHref, singleQuotedHref, unquotedHref, labelHtml) => {
        const href = decodeTelegramHtmlEntities(
          doubleQuotedHref ?? singleQuotedHref ?? unquotedHref ?? "",
        ).trim();
        const label = stripTelegramHtmlForPlainText(labelHtml).trim();
        if (!href) return encodePlainTextForTelegramHtmlStrip(label);
        return encodePlainTextForTelegramHtmlStrip(
          !label || label === href ? href : `${label} (${href})`,
        );
      },
    ),
  );
}
function promoteEscapedSupportedTelegramTags(text, openTags, support) {
  ESCAPED_HTML_TAG_PATTERN.lastIndex = 0;
  return text.replace(ESCAPED_HTML_TAG_PATTERN, (match, closing, name, attrs) =>
    preserveTelegramHtmlTag(`<${closing}${name}${attrs}>`, openTags, () => match, support),
  );
}
function preserveSupportedTelegramHtmlTags(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
  let codeDepth = 0;
  let preDepth = 0;
  let result = "";
  let lastIndex = 0;
  const openEscapedTags = [];
  for (const tag of tokenizeHtmlTags(html)) {
    const tagStart = tag.start;
    const tagEnd = tag.end;
    const tagName = tag.name;
    const isClosing = tag.closing;
    const textBefore = html.slice(lastIndex, tagStart);
    result +=
      codeDepth > 0 || preDepth > 0
        ? textBefore
        : promoteEscapedSupportedTelegramTags(textBefore, openEscapedTags, support);
    if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
    else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
    result += html.slice(tagStart, tagEnd);
    lastIndex = tagEnd;
  }
  const remainingText = html.slice(lastIndex);
  result +=
    codeDepth > 0 || preDepth > 0
      ? remainingText
      : promoteEscapedSupportedTelegramTags(remainingText, openEscapedTags, support);
  return result;
}
function renderSupportedTelegramHtml(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
  return protectTelegramAssistantTranscriptRoleHeaders(
    preserveSupportedTelegramHtmlTags(html, support),
  );
}
function getFileReferencePattern() {
  if (fileReferencePattern) return fileReferencePattern;
  const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegex).join("|");
  fileReferencePattern = new RegExp(
    `(^|[^a-zA-Z0-9_\\-/])([a-zA-Z0-9_.\\-./]+\\.(?:${fileExtensionsPattern}))(?=$|[^a-zA-Z0-9_\\-/])`,
    "gi",
  );
  return fileReferencePattern;
}
function getOrphanedTldPattern() {
  if (orphanedTldPattern) return orphanedTldPattern;
  const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegex).join("|");
  orphanedTldPattern = new RegExp(
    `([^a-zA-Z0-9]|^)([A-Za-z]\\.(?:${fileExtensionsPattern}))(?=[^a-zA-Z0-9/]|$)`,
    "g",
  );
  return orphanedTldPattern;
}
function wrapStandaloneFileRef(match, prefix, filename) {
  if (filename.startsWith("//")) return match;
  if (/https?:\/\/$/i.test(prefix)) return match;
  return `${prefix}<code>${escapeHtml(filename)}</code>`;
}
function wrapSegmentFileRefs(text, codeDepth, preDepth, anchorDepth) {
  if (!text || codeDepth > 0 || preDepth > 0 || anchorDepth > 0) return text;
  return text
    .replace(getFileReferencePattern(), wrapStandaloneFileRef)
    .replace(getOrphanedTldPattern(), (match, prefix, tld) =>
      prefix === ">" ? match : `${prefix}<code>${escapeHtml(tld)}</code>`,
    );
}
function wrapFileReferencesInHtml(html) {
  AUTO_LINKED_ANCHOR_PATTERN.lastIndex = 0;
  const deLinkified = html.replace(AUTO_LINKED_ANCHOR_PATTERN, (_match, label) => {
    if (!isAutoLinkedFileRef(`http://${label}`, label)) return _match;
    return `<code>${escapeHtml(label)}</code>`;
  });
  let codeDepth = 0;
  let preDepth = 0;
  let anchorDepth = 0;
  let result = "";
  let lastIndex = 0;
  for (const tag of tokenizeHtmlTags(deLinkified)) {
    const tagStart = tag.start;
    const tagEnd = tag.end;
    const isClosing = tag.closing;
    const tagName = tag.name;
    const textBefore = deLinkified.slice(lastIndex, tagStart);
    result += wrapSegmentFileRefs(textBefore, codeDepth, preDepth, anchorDepth);
    if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
    else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
    else if (tagName === "a")
      anchorDepth = isClosing ? Math.max(0, anchorDepth - 1) : anchorDepth + 1;
    result += deLinkified.slice(tagStart, tagEnd);
    lastIndex = tagEnd;
  }
  const remainingText = deLinkified.slice(lastIndex);
  result += wrapSegmentFileRefs(remainingText, codeDepth, preDepth, anchorDepth);
  return result;
}
function renderTelegramHtmlText(text, options = {}) {
  if ((options.textMode ?? "markdown") === "html")
    return escapeUnsupportedTelegramHtmlWithTableFallback(text);
  return markdownToTelegramHtml(text, { tableMode: options.tableMode });
}
function normalizeTelegramOutboundRichHtml(html) {
  const tableNormalized = normalizeTelegramRichHtmlTables(html);
  return {
    html: limitTelegramRichHtmlNesting(
      materializeTelegramRichHtmlLineBreaks(
        normalizeTelegramRichLiteralWhitespaceEscapes(
          isolateTelegramRichMediaBlocks(
            escapeUnsupportedTelegramHtml(tableNormalized.html, TELEGRAM_RICH_HTML_TAG_SUPPORT),
          ),
        ),
      ),
      TELEGRAM_RICH_NESTING_LIMIT,
    ),
    degradationReasons: tableNormalized.degradationReasons,
  };
}
function escapeUnsupportedTelegramHtmlWithTableFallback(html) {
  return escapeUnsupportedTelegramHtml(
    normalizeTelegramLegacyHtmlTables(html),
    TELEGRAM_LEGACY_HTML_TAG_SUPPORT,
  );
}
function isInsideTelegramHtmlCodeContext(html, offset) {
  let codeDepth = 0;
  let preDepth = 0;
  for (const tag of tokenizeHtmlTags(html)) {
    if (tag.start >= offset) break;
    const tagName = tag.name;
    if (tagName !== "code" && tagName !== "pre") continue;
    const isClosing = tag.closing;
    if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
    else preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
  }
  return codeDepth > 0 || preDepth > 0;
}
function normalizeTelegramLegacyHtmlTables(html) {
  TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
  return html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml, offset) => {
    if (isInsideTelegramHtmlCodeContext(html, offset)) return tableHtml;
    const rows = parseTelegramRichHtmlTableRows(tableHtml);
    return rows.length ? renderTelegramRichHtmlRawTableFallback(tableHtml, rows) : tableHtml;
  });
}
function limitTelegramRichHtmlNesting(html, maxDepth) {
  const normalizedMaxDepth = Math.max(1, Math.floor(maxDepth));
  const stack = [];
  let keptDepth = 0;
  let output = "";
  let lastIndex = 0;
  for (const tag of tokenizeHtmlTags(html)) {
    output += html.slice(lastIndex, tag.start);
    const rawTag = tag.raw;
    const isClosing = tag.closing;
    const tagName = tag.name;
    const isSelfClosing =
      !isClosing && (TELEGRAM_VOID_HTML_TAGS.has(tagName) || rawTag.trimEnd().endsWith("/>"));
    if (isClosing) {
      const entryIndex = stack.findLastIndex((entry) => entry.name === tagName);
      if (entryIndex >= 0) {
        const [entry] = stack.splice(entryIndex, 1);
        if (entry?.kept) {
          keptDepth = Math.max(0, keptDepth - 1);
          output += rawTag;
        }
      }
    } else if (isSelfClosing) {
      if (tagName === "br" || keptDepth < normalizedMaxDepth) output += rawTag;
    } else {
      const kept = keptDepth < normalizedMaxDepth;
      stack.push({
        name: tagName,
        kept,
      });
      if (kept) {
        keptDepth += 1;
        output += rawTag;
      }
    }
    lastIndex = tag.end;
  }
  return output + html.slice(lastIndex);
}
function normalizeTelegramRichMediaBlock(block) {
  const normalized = block
    .trim()
    .replace(/<img\b([^>]*?)(\s*)>/gi, (_match, attrs, trailing) =>
      attrs.trimEnd().endsWith("/") ? `<img${attrs}${trailing}>` : `<img${attrs}${trailing}/>`,
    );
  return /^<(?:img|video|audio)\b/i.test(normalized)
    ? `<figure>${normalized}</figure>`
    : normalized;
}
function isolateTelegramRichMediaBlocks(html) {
  return html
    .replace(
      TELEGRAM_RICH_MEDIA_BLOCK_PATTERN,
      (match) => `\n\n${normalizeTelegramRichMediaBlock(match)}\n\n`,
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
function parseTelegramHtmlColspan(attrs) {
  const raw = TELEGRAM_HTML_COLSPAN_PATTERN.exec(attrs)?.slice(1).find(Boolean);
  const value = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(value) && value > 1 ? Math.min(value, 21) : 1;
}
function parseTelegramRichHtmlTableRows(tableHtml) {
  const rows = [];
  TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.lastIndex = 0;
  let rowMatch;
  while ((rowMatch = TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.exec(tableHtml)) !== null) {
    const rowHtml = rowMatch[1] ?? "";
    const row = [];
    TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.lastIndex = 0;
    let cellMatch;
    while ((cellMatch = TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.exec(rowHtml)) !== null) {
      const attrs = cellMatch[2] ?? "";
      const text = telegramHtmlToPlainTextFallback(cellMatch[3] ?? "")
        .replace(/\s+/g, " ")
        .trim();
      row.push(text, ...Array.from({ length: parseTelegramHtmlColspan(attrs) - 1 }, () => ""));
    }
    if (row.length) rows.push(row);
  }
  return rows;
}
function renderTelegramRichHtmlRawTableFallback(tableHtml, rows) {
  const columnCount = Math.max(...rows.map((row) => row.length), 0);
  const widths = Array.from({ length: columnCount }, () => 3);
  for (const row of rows)
    for (let index = 0; index < columnCount; index += 1)
      widths[index] = Math.max(widths[index] ?? 3, row[index]?.length ?? 0);
  return `<pre><code>${escapeHtml([rows.length > 0 ? telegramHtmlToPlainTextFallback(TELEGRAM_HTML_CAPTION_PATTERN.exec(tableHtml)?.[1] ?? "").trim() : "", rows.length > 0 ? rows.map((row) => `| ${widths.map((width, index) => (row[index] ?? "").padEnd(width)).join(" | ")} |`).join("\n") : stripTelegramHtmlForPlainText(tableHtml).trim()].filter(Boolean).join("\n"))}</code></pre>\n\n`;
}
function emptyTelegramTableCell(text) {
  return {
    text,
    styles: [],
    links: [],
  };
}
function parseTelegramHtmlAlign(attrs) {
  return TELEGRAM_HTML_ALIGN_PATTERN.exec(attrs)?.slice(1).find(Boolean);
}
function parseTelegramRichHtmlTableAligns(tableHtml) {
  TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.lastIndex = 0;
  const firstRow = TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.exec(tableHtml)?.[1] ?? "";
  const aligns = [];
  TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.lastIndex = 0;
  let cellMatch;
  while ((cellMatch = TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.exec(firstRow)) !== null) {
    const attrs = cellMatch[2] ?? "";
    aligns.push(
      ...Array.from({ length: parseTelegramHtmlColspan(attrs) }, () =>
        parseTelegramHtmlAlign(attrs),
      ),
    );
  }
  return aligns;
}
function parseTelegramRichHtmlTableCaption(tableHtml) {
  return (
    telegramHtmlToPlainTextFallback(
      TELEGRAM_HTML_CAPTION_PATTERN.exec(tableHtml)?.[1] ?? "",
    ).trim() || void 0
  );
}
function parseTelegramRichHtmlTableCellRows(tableHtml) {
  const rows = [];
  TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.lastIndex = 0;
  let rowMatch;
  while ((rowMatch = TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.exec(tableHtml)) !== null) {
    const rowHtml = rowMatch[1] ?? "";
    const row = [];
    TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.lastIndex = 0;
    let cellMatch;
    while ((cellMatch = TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.exec(rowHtml)) !== null) {
      const attrs = cellMatch[2] ?? "";
      const text = telegramHtmlToPlainTextFallback(cellMatch[3] ?? "")
        .replace(/\s+/g, " ")
        .trim();
      const colspan = parseTelegramHtmlColspan(attrs);
      const align = parseTelegramHtmlAlign(attrs);
      row.push({
        ...emptyTelegramTableCell(text),
        ...(align ? { align } : {}),
        ...(colspan > 1 ? { colspan } : {}),
      });
    }
    if (row.length) rows.push(row);
  }
  return rows;
}
function buildTelegramRichHtmlTableMeta(tableHtml, rows) {
  const [headers = [], ...bodyRows] = rows;
  const [headerCells = headers.map(emptyTelegramTableCell), ...rowCells] =
    parseTelegramRichHtmlTableCellRows(tableHtml);
  const caption = parseTelegramRichHtmlTableCaption(tableHtml);
  return {
    headers: [...headers],
    rows: bodyRows.map((row) => row.slice()),
    aligns: parseTelegramRichHtmlTableAligns(tableHtml),
    ...(caption ? { caption } : {}),
    rawRichHtmlTable: true,
    placeholderOffset: 0,
    headerCells,
    rowCells,
  };
}
function normalizeTelegramRichHtmlTables(html) {
  const degradationReasons = /* @__PURE__ */ new Set();
  TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
  return {
    html: html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
      if (TELEGRAM_CANONICAL_RICH_HTML_TABLE_PATTERN.test(tableHtml)) return tableHtml;
      const rows = parseTelegramRichHtmlTableRows(tableHtml);
      const columnCount = Math.max(...rows.map((row) => row.length), 0);
      if (
        !rows.length ||
        columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT ||
        TELEGRAM_HTML_ROWSPAN_PATTERN.test(tableHtml)
      ) {
        degradationReasons.add("table-ascii");
        return renderTelegramRichHtmlRawTableFallback(tableHtml, rows);
      }
      return renderTelegramRichHtmlTable(buildTelegramRichHtmlTableMeta(tableHtml, rows));
    }),
    degradationReasons: [...degradationReasons],
  };
}
function buildTelegramRichMarkdownMediaPlaceholder(index) {
  return `${TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_PREFIX}${index}${TELEGRAM_MARKDOWN_MEDIA_PLACEHOLDER_SUFFIX}`;
}
function replaceTelegramRichMarkdownMediaPlaceholders(html, mediaBlocks) {
  let result = html;
  for (const [index, block] of mediaBlocks.entries())
    result = result.replaceAll(buildTelegramRichMarkdownMediaPlaceholder(index), block);
  return result;
}
function normalizeTelegramRichMarkdownMedia(markdown) {
  const lines = markdown.split("\n");
  const out = [];
  const mediaBlocks = [];
  let inFence = false;
  for (const line of lines) {
    if (/^[ \t]*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    const match = inFence ? null : TELEGRAM_MARKDOWN_MEDIA_BLOCK_PATTERN.exec(line);
    if (inFence) {
      out.push(line);
      continue;
    }
    if (!match) {
      out.push(
        line
          .replace(TELEGRAM_MARKDOWN_INLINE_IMAGE_PATTERN, "[$1]($2)")
          .replace(TELEGRAM_MARKDOWN_REFERENCE_IMAGE_PATTERN, "[$1][$2]"),
      );
      continue;
    }
    const indent = expectDefined(match[1], "rich Markdown media indent capture");
    const alt = match[2];
    const src = expectDefined(match[3], "rich Markdown media source capture");
    const caption = match[4];
    const img = `<img src="${escapeHtmlAttr(src)}"${alt ? ` alt="${escapeHtmlAttr(alt)}"` : ""}/>`;
    const figcaption = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
    const placeholder = buildTelegramRichMarkdownMediaPlaceholder(mediaBlocks.length);
    mediaBlocks.push(`<figure>${img}${figcaption}</figure>`);
    out.push(`${indent}${placeholder}`);
  }
  return {
    markdown: out.join("\n"),
    mediaBlocks,
  };
}
function renderTelegramRichHtmlTableFallback(table) {
  const rows = [table.headers, ...table.rows];
  const columnCount = Math.max(...rows.map((row) => row.length), 0);
  const widths = Array.from({ length: columnCount }, () => 3);
  for (const row of rows)
    for (let index = 0; index < columnCount; index += 1)
      widths[index] = Math.max(widths[index] ?? 3, row[index]?.length ?? 0);
  const renderRow = (row) =>
    `| ${widths.map((width, index) => (row[index] ?? "").padEnd(width)).join(" | ")} |`;
  const divider = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
  return `<pre><code>${escapeHtml(
    [renderRow(table.headers), divider, ...table.rows.map(renderRow)].join("\n"),
  )}</code></pre>\n\n`;
}
function renderTelegramRichHtmlTable(table) {
  const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 0);
  if (columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT)
    return renderTelegramRichHtmlTableFallback(table);
  const isRawRichHtmlTable = "rawRichHtmlTable" in table && table.rawRichHtmlTable === true;
  const rawCaption =
    "caption" in table && typeof table.caption === "string" ? table.caption.trim() : "";
  const caption = rawCaption ? `<caption>${escapeHtml(rawCaption)}</caption>` : "";
  const renderCellValue = (cell) => (cell ? renderTelegramHtml(cell) : "");
  const renderCell = (tag, value, align) => {
    const rawCell = value;
    const alignValue = rawCell?.align ?? align;
    return `<${tag}${alignValue ? ` align="${alignValue}"` : ""}${rawCell?.colspan ? ` colspan="${rawCell.colspan}"` : ""}>${renderCellValue(value)}</${tag}>`;
  };
  const head = table.headers.length
    ? `<thead><tr>${isRawRichHtmlTable ? table.headerCells.map((cell) => renderCell("th", cell, void 0)).join("") : table.headerCells.map((cell, index) => renderCell("th", cell, table.aligns?.[index])).join("")}</tr></thead>`
    : "";
  const bodyRows = isRawRichHtmlTable
    ? table.rowCells
        .map((row) => `<tr>${row.map((cell) => renderCell("td", cell, void 0)).join("")}</tr>`)
        .join("")
    : table.rowCells
        .map(
          (row) =>
            `<tr>${Array.from({ length: columnCount }, (_value, index) => renderCell("td", row[index], table.aligns?.[index])).join("")}</tr>`,
        )
        .join("");
  return `<table bordered striped>${caption}${head}${bodyRows ? `<tbody>${bodyRows}</tbody>` : ""}</table>\n\n`;
}
function renderTelegramRichHtmlDocument(ir, tables) {
  if (!tables.length)
    return isolateTelegramRichMediaBlocks(
      wrapFileReferencesInHtml(
        renderSupportedTelegramHtml(renderTelegramHtml(ir), TELEGRAM_RICH_HTML_TAG_SUPPORT),
      ),
    );
  let cursor = 0;
  let html = "";
  for (const table of [...tables].toSorted(
    (left, right) => left.placeholderOffset - right.placeholderOffset,
  )) {
    const offset = Math.max(cursor, Math.min(table.placeholderOffset, ir.text.length));
    html += renderTelegramHtml(sliceMarkdownIR(ir, cursor, offset));
    html += renderTelegramRichHtmlTable(table);
    cursor = offset;
  }
  html += renderTelegramHtml(sliceMarkdownIR(ir, cursor, ir.text.length));
  return isolateTelegramRichMediaBlocks(
    wrapFileReferencesInHtml(renderSupportedTelegramHtml(html, TELEGRAM_RICH_HTML_TAG_SUPPORT)),
  );
}
function convertTelegramRichSegmentNewlines(segment, prevStructural, nextStructural) {
  if (!segment.includes("\n")) return segment;
  return segment.replace(/\n+/g, (run, offset) => {
    const hugsPrev = offset === 0 && prevStructural;
    const hugsNext = offset + run.length === segment.length && nextStructural;
    return hugsPrev || hugsNext ? run : "<br>".repeat(run.length);
  });
}
const TELEGRAM_RICH_LITERAL_WHITESPACE_TAGS = /* @__PURE__ */ new Set([
  "code",
  "pre",
  "tg-math",
  "tg-math-block",
]);
function normalizeTelegramRichLiteralWhitespaceEscapes(html) {
  if (!html.includes("\\n") && !html.includes("\\t")) return html;
  let result = "";
  let lastIndex = 0;
  let literalDepth = 0;
  for (const tag of tokenizeHtmlTags(html)) {
    const tagStart = tag.start;
    const tagEnd = tag.end;
    const rawTag = tag.raw;
    const isClosing = tag.closing;
    const tagName = tag.name;
    const segment = html.slice(lastIndex, tagStart);
    result += literalDepth > 0 ? segment : materializeTelegramRichLiteralWhitespace(segment);
    if (TELEGRAM_RICH_LITERAL_WHITESPACE_TAGS.has(tagName) && !rawTag.trimEnd().endsWith("/>"))
      literalDepth = isClosing ? Math.max(0, literalDepth - 1) : literalDepth + 1;
    result += rawTag;
    lastIndex = tagEnd;
  }
  const tail = html.slice(lastIndex);
  result += literalDepth > 0 ? tail : materializeTelegramRichLiteralWhitespace(tail);
  return result;
}
function materializeTelegramRichLiteralWhitespace(segment) {
  return segment.replace(/\\[nt]/g, (match) => (match === "\\n" ? "\n" : "	"));
}
function materializeTelegramRichHtmlLineBreaks(html) {
  if (!html.includes("\n")) return html;
  let result = "";
  let lastIndex = 0;
  let literalDepth = 0;
  let prevStructural = false;
  for (const tag of tokenizeHtmlTags(html)) {
    const tagStart = tag.start;
    const tagEnd = tag.end;
    const rawTag = tag.raw;
    const isClosing = tag.closing;
    const tagName = tag.name;
    const tagIsStructural =
      tagName === "br" || isTelegramRichLineBreakStructuralTag(rawTag, tagName);
    const segment = html.slice(lastIndex, tagStart);
    result +=
      literalDepth > 0
        ? segment
        : convertTelegramRichSegmentNewlines(segment, prevStructural, tagIsStructural);
    if (TELEGRAM_RICH_LITERAL_WHITESPACE_TAGS.has(tagName) && !rawTag.trimEnd().endsWith("/>"))
      literalDepth = isClosing ? Math.max(0, literalDepth - 1) : literalDepth + 1;
    result += rawTag;
    lastIndex = tagEnd;
    prevStructural = tagIsStructural;
  }
  const tail = html.slice(lastIndex);
  result +=
    literalDepth > 0 ? tail : convertTelegramRichSegmentNewlines(tail, prevStructural, false);
  return result;
}
function markdownToTelegramRichHtml(markdown, options = {}) {
  const tableMode = options.tableMode ?? "block";
  const normalized = normalizeTelegramRichMarkdownMedia(markdown ?? "");
  const { ir, tables } = markdownToIRWithMeta(
    preserveTelegramListBoundarySpacing(normalized.markdown),
    {
      assistantTranscriptRoleHeaders: true,
      linkify: options.skipEntityDetection !== true,
      enableSpoilers: true,
      headingStyle: "rich",
      blockquotePrefix: "",
      tableMode,
    },
  );
  return protectTelegramAssistantTranscriptRoleHeaders(
    isolateTelegramRichMediaBlocks(
      replaceTelegramRichMarkdownMediaPlaceholders(
        renderTelegramRichHtmlDocument(ir, tables),
        normalized.mediaBlocks,
      ),
    ),
  );
}
const TELEGRAM_SELF_CLOSING_HTML_TAGS = TELEGRAM_VOID_HTML_TAGS;
function buildTelegramHtmlOpenPrefix(tags) {
  return tags.map((tag) => tag.openTag).join("");
}
function buildTelegramHtmlCloseSuffix(tags) {
  return tags
    .slice()
    .toReversed()
    .map((tag) => tag.closeTag)
    .join("");
}
function buildTelegramHtmlCloseSuffixLength(tags) {
  return tags.reduce((total, tag) => total + tag.closeTag.length, 0);
}
function clampToSurrogateBoundary(text, index) {
  const high = text.charCodeAt(index - 1);
  const low = text.charCodeAt(index);
  if (!(index > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return index;
  return index > 1 ? index - 1 : index + 1;
}
function findTelegramHtmlSafeSplitIndex(text, maxLength) {
  if (text.length <= maxLength) return text.length;
  return clampToSurrogateBoundary(
    text,
    findTelegramHtmlEntitySafeSplitIndex(text, Math.max(1, Math.floor(maxLength))),
  );
}
function findTelegramHtmlEntitySafeSplitIndex(text, normalizedMaxLength) {
  const lastAmpersand = text.lastIndexOf("&", normalizedMaxLength - 1);
  if (lastAmpersand === -1) return normalizedMaxLength;
  if (lastAmpersand < text.lastIndexOf(";", normalizedMaxLength - 1)) return normalizedMaxLength;
  const entityEnd = findTelegramHtmlEntityEnd(text, lastAmpersand);
  if (entityEnd === -1 || entityEnd < normalizedMaxLength) return normalizedMaxLength;
  return lastAmpersand;
}
function popTelegramHtmlTag(tags, name) {
  for (let index = tags.length - 1; index >= 0; index -= 1)
    if (tags[index]?.name === name) {
      tags.splice(index, 1);
      return;
    }
}
function splitTelegramHtmlChunksRaw(html, limit, options = {}) {
  if (!html) return [];
  const normalizedLimit = Math.max(1, Math.floor(limit));
  const blockLimit =
    options.blockLimit == null ? void 0 : Math.max(1, Math.floor(options.blockLimit));
  const mediaLimit =
    options.mediaLimit == null ? void 0 : Math.max(1, Math.floor(options.mediaLimit));
  if (html.length <= normalizedLimit && blockLimit === void 0 && mediaLimit === void 0)
    return [html];
  const chunks = [];
  const openTags = [];
  const suppressedTagNames = [];
  let current = "";
  let currentBlockCount = 0;
  let currentMediaCount = 0;
  let chunkHasPayload = false;
  const resetCurrent = () => {
    current = buildTelegramHtmlOpenPrefix(openTags);
    currentBlockCount = openTags.filter((tag) => tag.richBlock).length;
    currentMediaCount = openTags.filter((tag) => tag.richMedia).length;
    chunkHasPayload = false;
  };
  const flushCurrent = () => {
    if (!chunkHasPayload) return;
    chunks.push(`${current}${buildTelegramHtmlCloseSuffix(openTags)}`);
    resetCurrent();
  };
  const appendText = (segment) => {
    let remaining = segment;
    while (remaining.length > 0) {
      const available =
        normalizedLimit - current.length - buildTelegramHtmlCloseSuffixLength(openTags);
      if (available <= 0) {
        if (!chunkHasPayload) {
          suppressedTagNames.push(...openTags.map((tag) => tag.name));
          openTags.length = 0;
          resetCurrent();
          continue;
        }
        flushCurrent();
        continue;
      }
      if (remaining.length <= available) {
        current += remaining;
        chunkHasPayload = true;
        break;
      }
      const splitAt = findTelegramHtmlSafeSplitIndex(remaining, available);
      if (splitAt <= 0) {
        if (!chunkHasPayload)
          throw new Error(
            `Telegram HTML chunk limit exceeded by leading entity (limit=${normalizedLimit})`,
          );
        flushCurrent();
        continue;
      }
      current += remaining.slice(0, splitAt);
      chunkHasPayload = true;
      remaining = remaining.slice(splitAt);
      flushCurrent();
    }
  };
  resetCurrent();
  let lastIndex = 0;
  for (const tag of tokenizeHtmlTags(html)) {
    const tagStart = tag.start;
    const tagEnd = tag.end;
    appendText(html.slice(lastIndex, tagStart));
    const rawTag = tag.raw;
    const isClosing = tag.closing;
    const tagName = tag.name;
    const isSelfClosing =
      !isClosing &&
      (TELEGRAM_SELF_CLOSING_HTML_TAGS.has(tagName) || rawTag.trimEnd().endsWith("/>"));
    const isRichBlock = !isClosing && isTelegramRichBlockHtmlTag(rawTag, tagName);
    const isRichMedia =
      !isClosing &&
      (tagName === "figure" ||
        (TELEGRAM_RICH_MEDIA_HTML_TAGS.has(tagName) &&
          !openTags.some((openTag) => openTag.name === "figure")));
    if (!isClosing) {
      const nextCloseLength = isSelfClosing ? 0 : `</${tagName}>`.length;
      if (
        chunkHasPayload &&
        ((blockLimit !== void 0 && isRichBlock && currentBlockCount >= blockLimit) ||
          (mediaLimit !== void 0 && isRichMedia && currentMediaCount >= mediaLimit) ||
          current.length +
            rawTag.length +
            buildTelegramHtmlCloseSuffixLength(openTags) +
            nextCloseLength >
            normalizedLimit)
      )
        flushCurrent();
    }
    const closesOpenTag = isClosing && openTags.some((openTag) => openTag.name === tagName);
    if (!(isClosing && !closesOpenTag && popLastTagName(suppressedTagNames, tagName)))
      current += rawTag;
    if (isSelfClosing) chunkHasPayload = true;
    if (isRichBlock) currentBlockCount += 1;
    if (isRichMedia) currentMediaCount += 1;
    if (isClosing) popTelegramHtmlTag(openTags, tagName);
    else if (!isSelfClosing)
      openTags.push({
        name: tagName,
        openTag: rawTag,
        closeTag: `</${tagName}>`,
        richBlock: isRichBlock,
        richMedia: isRichMedia,
      });
    lastIndex = tagEnd;
  }
  appendText(html.slice(lastIndex));
  flushCurrent();
  return chunks.length > 0 ? chunks : [html];
}
function splitTelegramHtmlChunks(html, limit, options = {}) {
  const chunks = splitTelegramHtmlChunksRaw(html, limit, options);
  if (chunks.every((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk) === chunk))
    return chunks;
  const normalizedLimit = Math.max(1, Math.floor(limit));
  const protectedContentLimit = normalizedLimit - 24;
  if (protectedContentLimit < 1)
    throw new Error(
      `Telegram HTML chunk limit cannot fit assistant transcript marker (limit=${normalizedLimit})`,
    );
  return splitTelegramHtmlChunksRaw(html, protectedContentLimit, options).map((chunk) =>
    protectTelegramAssistantTranscriptRoleHeaders(chunk),
  );
}
function renderTelegramChunkHtml(ir) {
  return wrapFileReferencesInHtml(renderSupportedTelegramHtml(renderTelegramHtml(ir)));
}
function renderTelegramChunksWithinHtmlLimit(ir, limit) {
  return renderMarkdownIRChunksWithinLimit({
    ir,
    limit,
    renderChunk: renderTelegramChunkHtml,
    measureRendered: (html) => html.length,
  }).map(({ source, rendered }) => ({
    html: rendered,
    text: source.text,
  }));
}
function markdownToTelegramChunks(markdown, limit, options = {}) {
  return renderTelegramChunksWithinHtmlLimit(
    markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
      assistantTranscriptRoleHeaders: true,
      linkify: true,
      enableSpoilers: true,
      headingStyle: "none",
      blockquotePrefix: "",
      tableMode: options.tableMode,
    }),
    limit,
  );
}
function markdownToTelegramHtmlChunks(markdown, limit, options = {}) {
  return markdownToTelegramChunks(markdown, limit, options).map((chunk) => chunk.html);
}
//#endregion
//#region extensions/telegram/src/bot/body-helpers.ts
function buildSenderName(msg) {
  return (
    [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ").trim() ||
    msg.from?.username ||
    void 0
  );
}
function resolveTelegramPrimaryMedia(msg) {
  if (!msg) return;
  const photo = msg.photo?.[msg.photo.length - 1];
  if (photo)
    return {
      placeholder: "<media:image>",
      fileRef: photo,
    };
  if (msg.video)
    return {
      placeholder: "<media:video>",
      fileRef: msg.video,
    };
  if (msg.video_note)
    return {
      placeholder: "<media:video>",
      fileRef: msg.video_note,
    };
  if (msg.audio)
    return {
      placeholder: "<media:audio>",
      fileRef: msg.audio,
    };
  if (msg.voice)
    return {
      placeholder: "<media:audio>",
      fileRef: msg.voice,
    };
  if (msg.document)
    return {
      placeholder: "<media:document>",
      fileRef: msg.document,
    };
  if (msg.sticker)
    return {
      placeholder: "<media:sticker>",
      fileRef: msg.sticker,
    };
}
function resolveTelegramMediaPlaceholder(msg) {
  return resolveTelegramPrimaryMedia(msg)?.placeholder;
}
function buildSenderLabel(msg, senderId) {
  const name = buildSenderName(msg);
  const username = msg.from?.username ? `@${msg.from.username}` : void 0;
  let label = name;
  if (name && username) label = `${name} (${username})`;
  else if (!name && username) label = username;
  const fallbackId =
    (senderId != null ? normalizeOptionalString(String(senderId)) : void 0) ??
    (msg.from?.id != null ? String(msg.from.id) : void 0);
  const idPart = fallbackId ? `id:${fallbackId}` : void 0;
  if (label && idPart) return `${label} ${idPart}`;
  if (label) return label;
  return idPart ?? "id:unknown";
}
const TELEGRAM_RICH_MESSAGE_PLACEHOLDER = "[unsupported Telegram rich_message received]";
function hasTelegramRichMessage(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function compactRichText(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}
function joinRichText(parts, separator) {
  return parts.map(compactRichText).filter(Boolean).join(separator);
}
function renderRichInlineText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(renderRichInlineText).filter(Boolean).join("");
  if (!isRecord(value)) return "";
  const directText = value.text;
  if (directText !== void 0) return renderRichInlineText(directText);
  for (const key of ["alternative_text", "expression"]) {
    const text = value[key];
    if (typeof text === "string") return text;
  }
  return "";
}
function renderRichBlocks(value) {
  if (Array.isArray(value)) return joinRichText(value.map(renderRichBlocks), "\n");
  if (!isRecord(value)) return renderRichInlineText(value);
  if (typeof value.markdown === "string") return value.markdown;
  if (typeof value.html === "string") return telegramHtmlToPlainTextFallback(value.html);
  const parts = [];
  for (const key of ["text", "summary", "label", "title", "subtitle", "credit", "expression"])
    parts.push(renderRichInlineText(value[key]));
  if (value.caption !== void 0) {
    const caption = value.caption;
    if (isRecord(caption) && caption.credit !== void 0)
      parts.push(
        joinRichText(
          [renderRichInlineText(caption.text), renderRichInlineText(caption.credit)],
          "\n",
        ),
      );
    else parts.push(renderRichInlineText(caption));
  }
  for (const key of ["blocks", "items", "rows", "cells", "headers", "children"])
    parts.push(renderRichBlocks(value[key]));
  return joinRichText(parts, "\n");
}
function resolveTelegramRichMessagePlaceholder(msg) {
  return hasTelegramRichMessage(msg.rich_message) ? TELEGRAM_RICH_MESSAGE_PLACEHOLDER : void 0;
}
function resolveTelegramRichMessageText(msg) {
  if (!hasTelegramRichMessage(msg.rich_message)) return;
  return compactRichText(renderRichBlocks(msg.rich_message)) || void 0;
}
function resolveTelegramRichMessageBody(msg) {
  return resolveTelegramRichMessageText(msg) ?? resolveTelegramRichMessagePlaceholder(msg);
}
function isBinaryContent(text) {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code <= 31 && code !== 9 && code !== 10 && code !== 13) return true;
  }
  return false;
}
function resolveTelegramTextContent(text, caption) {
  const raw = typeof text === "string" ? text : typeof caption === "string" ? caption : "";
  return isBinaryContent(raw) ? "" : raw;
}
function getTelegramTextParts(msg) {
  const text = resolveTelegramTextContent(msg.text, msg.caption);
  return {
    text,
    entities: text ? (msg.entities ?? msg.caption_entities ?? []) : [],
  };
}
function isTelegramMentionWordChar(char) {
  return char != null && /[a-z0-9_]/i.test(char);
}
function hasStandaloneTelegramMention(text, mention) {
  let startIndex = 0;
  while (startIndex < text.length) {
    const idx = text.indexOf(mention, startIndex);
    if (idx === -1) return false;
    const prev = idx > 0 ? text[idx - 1] : void 0;
    const next = text[idx + mention.length];
    if (!isTelegramMentionWordChar(prev) && !isTelegramMentionWordChar(next)) return true;
    startIndex = idx + 1;
  }
  return false;
}
function isBotCommandAddressedToMention(command, mention) {
  const normalized = normalizeLowercaseStringOrEmpty(command);
  if (!normalized.startsWith("/") || !normalized.endsWith(mention)) return false;
  return normalized.lastIndexOf(mention) > 1;
}
function hasBotMention(msg, botUsername) {
  const { text, entities } = getTelegramTextParts(msg);
  const mention = normalizeLowercaseStringOrEmpty(`@${botUsername}`);
  if (hasStandaloneTelegramMention(normalizeLowercaseStringOrEmpty(text), mention)) return true;
  for (const ent of entities) {
    const slice = text.slice(ent.offset, ent.offset + ent.length);
    if (ent.type === "mention" && normalizeLowercaseStringOrEmpty(slice) === mention) return true;
    if (ent.type === "bot_command" && isBotCommandAddressedToMention(slice, mention)) return true;
  }
  return false;
}
function hasBotMentionInText(text, botUsername) {
  return hasStandaloneTelegramMention(
    normalizeLowercaseStringOrEmpty(text),
    normalizeLowercaseStringOrEmpty(`@${botUsername}`),
  );
}
const TELEGRAM_ENTITY_MARKDOWN_PRIORITY = {
  bold: 10,
  italic: 20,
  underline: 30,
  strikethrough: 40,
  spoiler: 50,
  text_link: 60,
  code: 70,
  pre: 80,
};
function longestBacktickRun(text) {
  let longest = 0;
  let current = 0;
  for (const char of text)
    if (char === "`") {
      current += 1;
      longest = Math.max(longest, current);
    } else current = 0;
  return longest;
}
function markdownInlineCodeDelimiters(content) {
  const delimiter = "`".repeat(longestBacktickRun(content) + 1);
  if (content.startsWith(" ") || content.endsWith(" ")) return [`${delimiter} `, ` ${delimiter}`];
  return [delimiter, delimiter];
}
function markdownPreAffixes(entity, content) {
  const language = entity.language?.replace(/[\s`]+/g, "").trim();
  const fence = "`".repeat(Math.max(3, longestBacktickRun(content) + 1));
  return [
    language ? `${fence}${language}\n` : `${fence}\n`,
    content.endsWith("\n") ? fence : `\n${fence}`,
  ];
}
function markdownAffixesForTelegramEntity(entity, content) {
  switch (entity.type) {
    case "bold":
      return ["**", "**"];
    case "italic":
      return ["_", "_"];
    case "underline":
      return ["__", "__"];
    case "strikethrough":
      return ["~~", "~~"];
    case "spoiler":
      return ["||", "||"];
    case "code":
      return markdownInlineCodeDelimiters(content);
    case "pre":
      return markdownPreAffixes(entity, content);
    case "text_link":
      return entity.url ? ["[", `](${entity.url})`] : null;
    default:
      return null;
  }
}
function renderTelegramTextEntities(text, entities) {
  if (!text || !entities?.length) return text;
  const boundaries = /* @__PURE__ */ new Map();
  const addBoundary = (offset, boundary) => {
    boundaries.set(offset, [...(boundaries.get(offset) ?? []), boundary]);
  };
  entities.forEach((entity, index) => {
    if (
      !Number.isInteger(entity.offset) ||
      !Number.isInteger(entity.length) ||
      entity.offset < 0 ||
      entity.length <= 0 ||
      entity.offset + entity.length > text.length
    )
      return;
    const affixes = markdownAffixesForTelegramEntity(
      entity,
      text.slice(entity.offset, entity.offset + entity.length),
    );
    if (!affixes) return;
    const boundary = {
      open: affixes[0],
      close: affixes[1],
      start: entity.offset,
      end: entity.offset + entity.length,
      length: entity.length,
      priority: TELEGRAM_ENTITY_MARKDOWN_PRIORITY[entity.type] ?? 100,
      index,
    };
    addBoundary(boundary.start, boundary);
    addBoundary(boundary.end, boundary);
  });
  if (boundaries.size === 0) return text;
  let result = "";
  for (let offset = 0; offset <= text.length; offset += 1) {
    const boundary = boundaries.get(offset);
    if (boundary) {
      boundary
        .filter((entity) => entity.end === offset)
        .toSorted((a, b) => a.length - b.length || b.priority - a.priority || b.index - a.index)
        .forEach((entity) => {
          result += entity.close;
        });
      boundary
        .filter((entity) => entity.start === offset)
        .toSorted((a, b) => b.length - a.length || a.priority - b.priority || a.index - b.index)
        .forEach((entity) => {
          result += entity.open;
        });
    }
    if (offset < text.length) result += text[offset];
  }
  return result;
}
function normalizeForwardedUserLabel(user) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  const username = normalizeOptionalString(user.username);
  const id = String(user.id);
  return {
    display:
      (name && username
        ? `${name} (@${username})`
        : name || (username ? `@${username}` : void 0)) || `user:${id}`,
    name: name || void 0,
    username,
    id,
  };
}
function normalizeForwardedChatLabel(chat, fallbackKind) {
  const title = normalizeOptionalString(chat.title);
  const username = normalizeOptionalString(chat.username);
  const id = String(chat.id);
  return {
    display: title || (username ? `@${username}` : void 0) || `${fallbackKind}:${id}`,
    title,
    username,
    id,
  };
}
function buildForwardedContextFromUser(params) {
  const { display, name, username, id } = normalizeForwardedUserLabel(params.user);
  if (!display) return null;
  return {
    from: display,
    date: params.date,
    fromType: params.type,
    fromId: id,
    fromUsername: username,
    fromTitle: name,
  };
}
function buildForwardedContextFromHiddenName(params) {
  const trimmed = params.name?.trim();
  if (!trimmed) return null;
  return {
    from: trimmed,
    date: params.date,
    fromType: params.type,
    fromTitle: trimmed,
  };
}
function buildForwardedContextFromChat(params) {
  const fallbackKind = params.type === "channel" ? "channel" : "chat";
  const { display, title, username, id } = normalizeForwardedChatLabel(params.chat, fallbackKind);
  if (!display) return null;
  const signature = normalizeOptionalString(params.signature);
  const from = signature ? `${display} (${signature})` : display;
  const chatType = normalizeOptionalString(params.chat.type);
  return {
    from,
    date: params.date,
    fromType: params.type,
    fromId: id,
    fromUsername: username,
    fromTitle: title,
    fromSignature: signature,
    fromChatType: chatType,
    fromMessageId: params.messageId,
  };
}
function resolveForwardOrigin(origin) {
  switch (origin.type) {
    case "user":
      return buildForwardedContextFromUser({
        user: origin.sender_user,
        date: origin.date,
        type: "user",
      });
    case "hidden_user":
      return buildForwardedContextFromHiddenName({
        name: origin.sender_user_name,
        date: origin.date,
        type: "hidden_user",
      });
    case "chat":
      return buildForwardedContextFromChat({
        chat: origin.sender_chat,
        date: origin.date,
        type: "chat",
        signature: origin.author_signature,
      });
    case "channel":
      return buildForwardedContextFromChat({
        chat: origin.chat,
        date: origin.date,
        type: "channel",
        signature: origin.author_signature,
        messageId: origin.message_id,
      });
    default:
      return null;
  }
}
function normalizeForwardedContext(msg) {
  if (!msg.forward_origin) return null;
  return resolveForwardOrigin(msg.forward_origin);
}
function extractTelegramLocation(msg) {
  const { venue, location } = msg;
  if (venue)
    return {
      latitude: venue.location.latitude,
      longitude: venue.location.longitude,
      accuracy: venue.location.horizontal_accuracy,
      name: venue.title,
      address: venue.address,
      source: "place",
      isLive: false,
    };
  if (location) {
    const isLive = typeof location.live_period === "number" && location.live_period > 0;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.horizontal_accuracy,
      source: isLive ? "live" : "pin",
      isLive,
    };
  }
  return null;
}
//#endregion
//#region extensions/telegram/src/bot/helpers.ts
const TELEGRAM_GENERAL_TOPIC_ID = 1;
const TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS = 1024;
const TELEGRAM_FORUM_FLAG_CACHE_TTL_MS = 10 * 6e4;
const telegramForumFlagByChatId = /* @__PURE__ */ new Map();
function resetTelegramForumFlagCacheForTest() {
  telegramForumFlagByChatId.clear();
}
function cacheTelegramForumFlag(chatId, isForum, nowMs = Date.now()) {
  const cacheKey = String(chatId);
  const expiresAtMs = resolveExpiresAtMsFromDurationMs(TELEGRAM_FORUM_FLAG_CACHE_TTL_MS, { nowMs });
  if (expiresAtMs === void 0) {
    telegramForumFlagByChatId.delete(cacheKey);
    return;
  }
  if (
    !telegramForumFlagByChatId.has(cacheKey) &&
    telegramForumFlagByChatId.size >= TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS
  ) {
    const oldestKey = telegramForumFlagByChatId.keys().next().value;
    if (oldestKey !== void 0) telegramForumFlagByChatId.delete(oldestKey);
  }
  telegramForumFlagByChatId.set(cacheKey, {
    expiresAtMs,
    isForum,
  });
}
function hadUnsafeTelegramText(raw, sanitized) {
  return typeof raw === "string" && raw.trim().length > 0 && sanitized.trim().length === 0;
}
function shouldUseTelegramDmThreadSession(params) {
  return params.dmThreadId != null && params.botHasTopicsEnabled === true;
}
function resolveTelegramBotHasTopicsEnabled(me) {
  return (
    me !== null &&
    typeof me === "object" &&
    "has_topics_enabled" in me &&
    me.has_topics_enabled === true
  );
}
function extractTelegramForumFlag(value) {
  if (!value || typeof value !== "object" || !("is_forum" in value)) return;
  const forum = value.is_forum;
  return typeof forum === "boolean" ? forum : void 0;
}
function resolveTelegramMessageForumFlagHint(params) {
  if (params.chatType === "supergroup" && params.isTopicMessage === true) return true;
  return typeof params.isForum === "boolean" ? params.isForum : void 0;
}
async function resolveTelegramForumFlag(params) {
  const forumHint = resolveTelegramMessageForumFlagHint({
    chatType: params.chatType,
    isForum: params.isForum,
    isTopicMessage: params.isTopicMessage,
  });
  if (typeof forumHint === "boolean") {
    if (params.isGroup && params.chatType === "supergroup")
      cacheTelegramForumFlag(params.chatId, forumHint);
    return forumHint;
  }
  if (!params.isGroup || params.chatType !== "supergroup" || !params.getChat) return false;
  const cacheKey = String(params.chatId);
  const rawNowMs = Date.now();
  const nowMs = asDateTimestampMs(rawNowMs);
  const cached = telegramForumFlagByChatId.get(cacheKey);
  if (cached) {
    if (
      nowMs !== void 0 &&
      asDateTimestampMs(cached.expiresAtMs) !== void 0 &&
      cached.expiresAtMs > nowMs
    )
      return cached.isForum;
    telegramForumFlagByChatId.delete(cacheKey);
  }
  try {
    const resolved = extractTelegramForumFlag(await params.getChat(params.chatId)) === true;
    cacheTelegramForumFlag(params.chatId, resolved, rawNowMs);
    return resolved;
  } catch {
    return false;
  }
}
function withResolvedTelegramForumFlag(message, isForum) {
  if (extractTelegramForumFlag(message.chat) === isForum) return message;
  return {
    ...message,
    chat: {
      ...message.chat,
      is_forum: isForum,
    },
  };
}
async function resolveTelegramGroupAllowFromContext(params) {
  const accountId = normalizeAccountId(params.accountId);
  const threadSpec = resolveTelegramThreadSpec({
    isGroup: params.isGroup ?? false,
    isForum: params.isForum,
    messageThreadId: params.messageThreadId,
  });
  const resolvedThreadId = threadSpec.scope === "forum" ? threadSpec.id : void 0;
  const dmThreadId = threadSpec.scope === "dm" ? threadSpec.id : void 0;
  const threadIdForConfig = resolvedThreadId ?? dmThreadId;
  const { groupConfig, topicConfig } = params.resolveTelegramGroupConfig(
    params.chatId,
    threadIdForConfig,
    params.cfg,
  );
  const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
  const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
    isGroup: params.isGroup ?? false,
    groupConfig,
    dmPolicy: params.dmPolicy,
  });
  return {
    resolvedThreadId,
    dmThreadId,
    storeAllowFrom: await loadTelegramPairingStoreIfNeeded({
      cfg: params.cfg,
      allowFrom: params.allowFrom,
      groupAllowOverride,
      accountId,
      senderId: params.senderId,
      isGroup: params.isGroup ?? false,
      effectiveDmPolicy,
      skipPairingStoreRead: params.skipPairingStoreRead,
      readChannelAllowFromStore: params.readChannelAllowFromStore,
    }),
    groupConfig,
    topicConfig,
    groupAllowOverride,
    effectiveGroupAllow: normalizeAllowFrom(
      await expandTelegramAllowFromWithAccessGroups({
        cfg: params.cfg,
        allowFrom: groupAllowOverride ?? params.groupAllowFrom,
        accountId,
        senderId: params.senderId,
      }),
    ),
    hasGroupAllowOverride: groupAllowOverride !== void 0,
  };
}
async function isTelegramDmAllowedByConfiguredAllowFrom(params) {
  const configuredAllowFrom = params.groupAllowOverride ?? params.allowFrom;
  if (!configuredAllowFrom || configuredAllowFrom.length === 0) return false;
  const normalizedAllowFrom = normalizeAllowFrom(
    await expandTelegramAllowFromWithAccessGroups({
      cfg: params.cfg,
      allowFrom: configuredAllowFrom,
      accountId: params.accountId,
      senderId: params.senderId,
    }),
  );
  return (
    normalizedAllowFrom.hasEntries &&
    isSenderAllowed({
      allow: normalizedAllowFrom,
      senderId: params.senderId,
    })
  );
}
var TelegramPairingStoreReadError = class extends Error {
  constructor(cause) {
    super(`Telegram pairing store read failed: ${String(cause)}`);
    this.name = "TelegramPairingStoreReadError";
    this.cause = cause;
  }
};
async function loadTelegramPairingStoreIfNeeded(params) {
  if (params.skipPairingStoreRead || params.isGroup || params.effectiveDmPolicy !== "pairing")
    return [];
  if (
    await isTelegramDmAllowedByConfiguredAllowFrom({
      cfg: params.cfg,
      allowFrom: params.allowFrom,
      groupAllowOverride: params.groupAllowOverride,
      accountId: params.accountId,
      senderId: params.senderId,
    })
  )
    return [];
  try {
    return await (params.readChannelAllowFromStore ?? readChannelAllowFromStore)(
      "telegram",
      process.env,
      params.accountId,
    );
  } catch (cause) {
    throw new TelegramPairingStoreReadError(cause);
  }
}
/**
 * Resolve the thread ID for Telegram forum topics.
 * For non-forum groups, returns undefined even if messageThreadId is present
 * (reply threads in regular groups should not create separate sessions).
 * For forum groups, returns the topic ID (or General topic ID=1 if unspecified).
 */
function resolveTelegramForumThreadId(params) {
  if (!params.isForum) return;
  if (params.messageThreadId == null) return TELEGRAM_GENERAL_TOPIC_ID;
  return params.messageThreadId;
}
function resolveTelegramThreadSpec(params) {
  if (params.isGroup)
    return {
      id: resolveTelegramForumThreadId({
        isForum: params.isForum,
        messageThreadId: params.messageThreadId,
      }),
      scope: params.isForum ? "forum" : "none",
    };
  if (params.messageThreadId == null) return { scope: "dm" };
  return {
    id: params.messageThreadId,
    scope: "dm",
  };
}
/**
 * Build thread params for Telegram API calls (messages, media).
 *
 * IMPORTANT: Thread IDs behave differently based on chat type:
 * - DMs (private chats): Include message_thread_id when present (DM topics)
 * - Forum topics: Skip thread_id=1 (General topic), include others
 * - Regular groups: Thread IDs are ignored by Telegram
 *
 * General forum topic (id=1) must be treated like a regular supergroup send:
 * Telegram rejects sendMessage/sendMedia with message_thread_id=1 ("thread not found").
 *
 * @param thread - Thread specification with ID and scope
 * @returns API params object or undefined if thread_id should be omitted
 */
function buildTelegramThreadParams(thread) {
  if (thread?.id == null) return;
  const normalized = Math.trunc(thread.id);
  if (thread.scope === "dm") return normalized > 0 ? { message_thread_id: normalized } : void 0;
  if (thread.scope === "none") return;
  if (normalized === TELEGRAM_GENERAL_TOPIC_ID) return;
  return { message_thread_id: normalized };
}
/**
 * Build a Telegram routing target that keeps real topic/thread ids in-band.
 *
 * This is used by generic reply plumbing that may not always carry a separate
 * `threadId` field through every hop. General forum topic stays chat-scoped
 * because Telegram rejects `message_thread_id=1` for message sends.
 */
function buildTelegramRoutingTarget(chatId, thread) {
  const base = `telegram:${chatId}`;
  const messageThreadId = buildTelegramThreadParams(thread)?.message_thread_id;
  if (typeof messageThreadId !== "number") return base;
  return `${base}:topic:${messageThreadId}`;
}
/**
 * Build the canonical Telegram inbound origin used by queued follow-up routing.
 * DM thread ids remain metadata-only; real forum topics must be in-band.
 */
function buildTelegramInboundOriginTarget(chatId, thread) {
  if (thread?.scope !== "forum") return `telegram:${chatId}`;
  return buildTelegramRoutingTarget(chatId, thread);
}
/**
 * Build thread params for typing indicators (sendChatAction).
 * Empirically, General topic (id=1) needs message_thread_id for typing to appear.
 */
function buildTypingThreadParams(messageThreadId) {
  if (messageThreadId == null) return;
  return { message_thread_id: Math.trunc(messageThreadId) };
}
function resolveTelegramStreamMode(telegramCfg) {
  return resolveTelegramPreviewStreamMode(telegramCfg);
}
function buildTelegramGroupPeerId(chatId, messageThreadId) {
  return messageThreadId != null ? `${chatId}:topic:${messageThreadId}` : String(chatId);
}
/**
 * Resolve the direct-message peer identifier for Telegram routing/session keys.
 *
 * In some Telegram DM deliveries (for example certain business/chat bridge flows),
 * `chat.id` can differ from the actual sender user id. Prefer sender id when present
 * so per-peer DM scopes isolate users correctly.
 */
function resolveTelegramDirectPeerId(params) {
  const senderId =
    params.senderId != null ? (normalizeOptionalString(String(params.senderId)) ?? "") : "";
  if (senderId) return senderId;
  return String(params.chatId);
}
function buildTelegramGroupFrom(chatId, messageThreadId) {
  return `telegram:group:${buildTelegramGroupPeerId(chatId, messageThreadId)}`;
}
function isTelegramCommandsAllowFromConfigured(cfg) {
  const commandsAllowFrom = cfg.commands?.allowFrom;
  return (
    commandsAllowFrom != null &&
    typeof commandsAllowFrom === "object" &&
    (Array.isArray(commandsAllowFrom.telegram) || Array.isArray(commandsAllowFrom["*"]))
  );
}
function resolveTelegramCommandAuthorization(params) {
  return resolveCommandAuthorization({
    ctx: {
      Provider: "telegram",
      Surface: "telegram",
      OriginatingChannel: "telegram",
      AccountId: params.accountId,
      ChatType: params.isGroup ? "group" : "direct",
      From: params.isGroup
        ? buildTelegramGroupFrom(params.chatId, params.resolvedThreadId)
        : `telegram:${params.chatId}`,
      SenderId: params.senderId || void 0,
      SenderUsername: params.senderUsername || void 0,
    },
    cfg: params.cfg,
    commandAuthorized: false,
  });
}
/**
 * Build parentPeer for forum topic binding inheritance.
 * When a message comes from a forum topic, the peer ID includes the topic suffix
 * (e.g., `-1001234567890:topic:99`). To allow bindings configured for the base
 * group ID to match, we provide the parent group as `parentPeer` so the routing
 * layer can fall back to it when the exact peer doesn't match.
 */
function buildTelegramParentPeer(params) {
  if (!params.isGroup || params.resolvedThreadId == null) return;
  return {
    kind: "group",
    id: String(params.chatId),
  };
}
function buildGroupLabel(msg, chatId, messageThreadId) {
  const title = msg.chat?.title;
  const topicSuffix = messageThreadId != null ? ` topic:${messageThreadId}` : "";
  if (title) return `${title} id:${chatId}${topicSuffix}`;
  return `group:${chatId}${topicSuffix}`;
}
function resolveTelegramReplyId(raw) {
  return normalizeTelegramReplyToMessageId(raw);
}
function describeReplyTarget(msg) {
  const reply = msg.reply_to_message;
  const externalReply = msg.external_reply;
  const quote = msg.quote ?? externalReply?.quote;
  const rawQuoteText = quote?.text;
  const quoteText = resolveTelegramTextContent(rawQuoteText);
  let body;
  let kind = "reply";
  const filteredQuoteText = hadUnsafeTelegramText(rawQuoteText, quoteText);
  body = quoteText.trim();
  if (body) kind = "quote";
  const replyLike = reply ?? externalReply;
  const rawReplyText =
    replyLike && typeof replyLike.text === "string"
      ? replyLike.text
      : replyLike && typeof replyLike.caption === "string"
        ? replyLike.caption
        : void 0;
  const replyTextParts = replyLike ? getTelegramTextParts(replyLike) : void 0;
  const safeReplyText = replyTextParts?.text ?? "";
  let filteredReplyText = false;
  if (!body && replyLike) {
    const replyBody = safeReplyText.trim() || resolveTelegramRichMessageBody(replyLike) || "";
    filteredReplyText = hadUnsafeTelegramText(rawReplyText, replyBody);
    body = replyBody;
    if (!body) {
      body = resolveTelegramMediaPlaceholder(replyLike) ?? "";
      if (!body) {
        const locationData = extractTelegramLocation(replyLike);
        if (locationData) body = formatLocationText(locationData);
      }
    }
  }
  if (!body && !replyLike) return null;
  if (!body && !filteredQuoteText && !filteredReplyText) return null;
  const senderLabel = (replyLike ? buildSenderName(replyLike) : void 0) ?? "unknown sender";
  const source = reply ? "reply_to_message" : "external_reply";
  const quotePosition =
    kind === "quote" && typeof quote?.position === "number" && Number.isFinite(quote.position)
      ? Math.trunc(quote.position)
      : void 0;
  const quoteEntities =
    kind === "quote" && Array.isArray(quote?.entities) ? quote.entities : void 0;
  const forwardedFrom = replyLike ? (normalizeForwardedContext(replyLike) ?? void 0) : void 0;
  return {
    id: replyLike?.message_id ? String(replyLike.message_id) : void 0,
    sender: senderLabel,
    senderId: replyLike?.from?.id != null ? String(replyLike.from.id) : void 0,
    senderUsername: replyLike?.from?.username ?? void 0,
    body: body || void 0,
    kind,
    source,
    quoteText: kind === "quote" ? quoteText : void 0,
    quotePosition,
    quoteEntities,
    forwardedFrom,
    quoteSourceText: replyTextParts?.text || void 0,
    quoteSourceEntities: replyTextParts?.entities,
  };
}
//#endregion
//#region extensions/telegram/src/prompt-context-projection.ts
function parseTranscriptMessageId(value) {
  const id = isRecord(value) ? value.transcriptMessageId : void 0;
  return typeof id === "string" && id.trim() ? id : void 0;
}
function resolveTelegramPromptContextDeliverySignature(payload) {
  const parts = resolveSendableOutboundReplyParts(payload);
  const spokenText = payload.spokenText ?? "";
  return JSON.stringify([parts.text, parts.mediaUrls, payload.audioAsVoice === true, spokenText]);
}
function parseTelegramPromptContextProjection(value) {
  const transcriptMessageId = parseTranscriptMessageId(value);
  if (!transcriptMessageId || !isRecord(value)) return;
  const { partIndex, finalPart } = value;
  return typeof partIndex === "number" &&
    Number.isSafeInteger(partIndex) &&
    partIndex >= 0 &&
    typeof finalPart === "boolean"
    ? {
        kind: "valid",
        projection: {
          transcriptMessageId,
          partIndex,
          finalPart,
        },
      }
    : {
        kind: "invalid",
        transcriptMessageId,
      };
}
function resolveTelegramPromptContextSource(payload) {
  const telegram = payload.channelData?.telegram;
  const taggedSource = isRecord(telegram) ? telegram.promptContextSource : void 0;
  const transcriptMessageId = parseTranscriptMessageId(taggedSource);
  const deliverySignature = isRecord(taggedSource) ? taggedSource.deliverySignature : void 0;
  return transcriptMessageId &&
    deliverySignature === resolveTelegramPromptContextDeliverySignature(payload)
    ? { transcriptMessageId }
    : void 0;
}
function withTelegramPromptContextSource(payload, source) {
  if (!source) return payload;
  const telegram = payload.channelData?.telegram;
  return {
    ...payload,
    channelData: {
      ...payload.channelData,
      telegram: {
        ...(isRecord(telegram) ? telegram : {}),
        promptContextSource: {
          ...source,
          deliverySignature: resolveTelegramPromptContextDeliverySignature(payload),
        },
      },
    },
  };
}
function createTelegramPromptContextProjectionCursor(source) {
  return {
    source,
    nextPartIndex: 0,
    complete: true,
    invalidate() {
      this.complete = false;
    },
    take(finalPart) {
      return {
        ...this.source,
        partIndex: this.nextPartIndex++,
        finalPart: this.complete && finalPart,
      };
    },
  };
}
function createTelegramPromptContextProjectionSequence(params) {
  let cursor = params.source ? createTelegramPromptContextProjectionCursor(params.source) : void 0;
  let pending;
  let started = false;
  const invalidate = () => cursor?.invalidate();
  const flush = async (finalPart) => {
    if (!pending) return;
    const record = pending;
    pending = void 0;
    const projection = cursor?.take(finalPart);
    if (
      !(await params
        .record({
          ...record,
          ...(projection ? { projection } : {}),
        })
        .catch(() => false))
    )
      invalidate();
  };
  return {
    get source() {
      return cursor?.source;
    },
    isFresh: () => !started && (cursor?.complete ?? true),
    async accept(record) {
      started = true;
      await flush(false);
      pending = record;
    },
    finish: () => flush(true),
    invalidate,
    detach() {
      invalidate();
      cursor = void 0;
    },
    async fail() {
      invalidate();
      await flush(false);
    },
  };
}
function resolveCompleteTelegramPromptContextProjectionIds(markers) {
  const grouped = /* @__PURE__ */ new Map();
  for (const marker of markers) {
    if (!marker) continue;
    const id =
      marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId;
    if (marker.kind === "invalid") grouped.set(id, void 0);
    else if (grouped.get(id) !== void 0 || !grouped.has(id))
      grouped.set(id, [...(grouped.get(id) ?? []), marker.projection]);
  }
  const complete = /* @__PURE__ */ new Set();
  for (const [id, parts] of grouped) {
    const ordered = parts?.toSorted((left, right) => left.partIndex - right.partIndex);
    if (
      ordered?.every(
        (part, index) =>
          part.partIndex === index && part.finalPart === (index === ordered.length - 1),
      )
    )
      complete.add(id);
  }
  return complete;
}
//#endregion
//#region extensions/telegram/src/message-cache.ts
const DEFAULT_MAX_MESSAGES = 5e3;
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES = 3e3;
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE = "telegram.message-cache";
const PERSISTENT_BUCKET_KEY = `plugin-state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`;
const persistedMessageCacheBuckets = /* @__PURE__ */ new Map();
function telegramMessageCacheKey(params) {
  const key = `${params.accountId}:${params.chatId}:${params.messageId}`;
  return params.scopeKey ? `${params.scopeKey}:${key}` : key;
}
function telegramMessageCacheKeyPrefix(params) {
  const prefix = `${params.accountId}:${params.chatId}:`;
  return params.scopeKey ? `${params.scopeKey}:${prefix}` : prefix;
}
function resolveTelegramMessageCachePath(storePath) {
  return `${storePath}.telegram-messages.json`;
}
function resolveTelegramMessageCacheScope(storePath) {
  return resolveTelegramMessageCachePath(storePath);
}
function resolveReplyMessage(msg) {
  const externalReply = msg.external_reply;
  return msg.reply_to_message ?? externalReply;
}
function resolveEmbeddedReplyMessage(msg) {
  return msg.reply_to_message;
}
function isTelegramMessageFromCurrentBot(msg, botUserId) {
  const currentBotUserId = parseStrictPositiveInteger(botUserId);
  if (currentBotUserId === void 0) return msg.from?.is_bot === true;
  return msg.from?.id === currentBotUserId || msg.sender_business_bot?.id === currentBotUserId;
}
function resolveMessageBody(msg, preserveWhitespace) {
  const text = getTelegramTextParts(msg).text;
  if (text.trim()) return preserveWhitespace ? text : text.trim();
  const location = extractTelegramLocation(msg);
  if (location) return formatLocationText(location);
  return resolveTelegramRichMessageBody(msg) ?? resolveTelegramPrimaryMedia(msg)?.placeholder;
}
function resolveMediaType(placeholder) {
  return placeholder?.match(/^<media:([^>]+)>$/)?.[1];
}
function resolveMessageTimestamp(msg) {
  const promptContextTimestamp = msg.openclaw_prompt_context_timestamp_ms;
  return typeof promptContextTimestamp === "number" && Number.isFinite(promptContextTimestamp)
    ? promptContextTimestamp
    : msg.date
      ? msg.date * 1e3
      : void 0;
}
function normalizeMessageNode(msg, params) {
  const media = resolveTelegramPrimaryMedia(msg);
  const fileId = media?.fileRef.file_id;
  const forwardedFrom = normalizeForwardedContext(msg);
  const replyMessage = resolveReplyMessage(msg);
  const body = resolveMessageBody(msg, params.promptContextProjectionMarker !== void 0);
  const threadId = parseTelegramMessageThreadId(params.threadId);
  const timestamp = resolveMessageTimestamp(msg);
  return {
    sourceMessage: msg,
    messageId: String(msg.message_id),
    sender: buildSenderName(msg) ?? "unknown sender",
    ...(msg.from?.id != null ? { senderId: String(msg.from.id) } : {}),
    ...(msg.from?.username ? { senderUsername: msg.from.username } : {}),
    ...(timestamp !== void 0 ? { timestamp } : {}),
    ...(body ? { body } : {}),
    ...(media ? { mediaType: resolveMediaType(media.placeholder) ?? media.placeholder } : {}),
    ...(fileId ? { mediaRef: `telegram:file/${fileId}` } : {}),
    ...(replyMessage?.message_id != null ? { replyToId: String(replyMessage.message_id) } : {}),
    ...(forwardedFrom?.from ? { forwardedFrom: forwardedFrom.from } : {}),
    ...(forwardedFrom?.fromId ? { forwardedFromId: forwardedFrom.fromId } : {}),
    ...(forwardedFrom?.fromUsername ? { forwardedFromUsername: forwardedFrom.fromUsername } : {}),
    ...(forwardedFrom?.date ? { forwardedDate: forwardedFrom.date * 1e3 } : {}),
    ...(threadId !== void 0 ? { threadId: String(threadId) } : {}),
    ...(params.promptContextProjectionMarker
      ? { promptContextProjectionMarker: params.promptContextProjectionMarker }
      : {}),
  };
}
function normalizeMessageNodes(msg, params) {
  const observations = [];
  const visited = /* @__PURE__ */ new Set();
  const nodeThreadId = (node) => parseTelegramMessageThreadId(node.threadId);
  const visit = (message, inheritedThreadId, mode, promptContextProjectionMarker) => {
    const node = normalizeMessageNode(message, {
      threadId: parseTelegramMessageThreadId(message.message_thread_id) ?? inheritedThreadId,
      ...(promptContextProjectionMarker ? { promptContextProjectionMarker } : {}),
    });
    if (visited.has(node.messageId)) return;
    visited.add(node.messageId);
    const replyMessage = resolveEmbeddedReplyMessage(message);
    if (replyMessage?.message_id != null)
      visit(replyMessage, nodeThreadId(node) ?? inheritedThreadId, "partial");
    observations.push({
      node,
      mode,
    });
  };
  visit(msg, params.threadId, "authoritative", params.promptContextProjectionMarker);
  return observations;
}
function parseSafeMessageId(value) {
  return value === void 0 ? void 0 : parseStrictPositiveInteger(value);
}
function isTelegramMessageCacheSourceMessage(value) {
  return (
    isRecord(value) &&
    typeof value.message_id === "number" &&
    Number.isFinite(value.message_id) &&
    typeof value.date === "number" &&
    Number.isFinite(value.date)
  );
}
function parsePersistedCacheValue(key, value) {
  if (!isRecord(value) || (value.version !== void 0 && value.version !== 1)) return [];
  const separatorIndex = key.lastIndexOf(":");
  if (separatorIndex === -1 || !isTelegramMessageCacheSourceMessage(value.sourceMessage)) return [];
  const threadId = parseTelegramMessageThreadId(value.threadId);
  const botUserId = parseStrictPositiveInteger(value.botUserId);
  const promptContextProjectionMarker =
    value.version === 1 && isTelegramMessageFromCurrentBot(value.sourceMessage, botUserId)
      ? parseTelegramPromptContextProjection(value.promptContextProjection)
      : void 0;
  return normalizeMessageNodes(value.sourceMessage, {
    ...(threadId !== void 0 ? { threadId } : {}),
    ...(promptContextProjectionMarker ? { promptContextProjectionMarker } : {}),
  }).map(({ node, mode }) => ({
    key: `${key.slice(0, separatorIndex + 1)}${node.messageId}`,
    node,
    mode,
  }));
}
function trimMessages(messages, maxMessages) {
  while (messages.size > maxMessages) {
    const oldest = messages.keys().next().value;
    if (oldest === void 0) break;
    messages.delete(oldest);
  }
}
function mergeTelegramSourceMessage(existing, incoming) {
  const existingReply = resolveEmbeddedReplyMessage(existing);
  const incomingReply = resolveEmbeddedReplyMessage(incoming);
  if (existingReply?.message_id != null && incomingReply?.message_id === existingReply.message_id)
    return Object.assign({}, existing, incoming, {
      reply_to_message: mergeTelegramSourceMessage(existingReply, incomingReply),
    });
  return Object.assign({}, existing, incoming);
}
function mergeAuthoritativeTelegramSourceMessage(existing, incoming) {
  const existingReply = resolveEmbeddedReplyMessage(existing);
  const incomingReply = resolveEmbeddedReplyMessage(incoming);
  if (existingReply?.message_id != null && incomingReply?.message_id === existingReply.message_id)
    return Object.assign({}, incoming, {
      reply_to_message: mergeTelegramSourceMessage(existingReply, incomingReply),
    });
  return incoming;
}
function mergeCachedMessageNode(existing, incoming, mode) {
  const threadId = parseTelegramMessageThreadId(incoming.threadId ?? existing.threadId);
  const mergedSourceMessage =
    mode === "authoritative"
      ? mergeAuthoritativeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage)
      : mergeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage);
  const syntheticOutboundFrom =
    existing.senderId === "0" && incoming.sourceMessage.sender_chat
      ? existing.sourceMessage.from
      : void 0;
  const sourceMessage = syntheticOutboundFrom
    ? {
        ...mergedSourceMessage,
        from: syntheticOutboundFrom,
      }
    : mergedSourceMessage;
  const promptContextProjectionMarker =
    incoming.promptContextProjectionMarker ?? existing.promptContextProjectionMarker;
  return normalizeMessageNode(sourceMessage, {
    ...(threadId !== void 0 ? { threadId } : {}),
    ...(promptContextProjectionMarker ? { promptContextProjectionMarker } : {}),
  });
}
function upsertCachedMessageNode(params) {
  const existing = params.messages.get(params.key);
  const node = existing ? mergeCachedMessageNode(existing, params.node, params.mode) : params.node;
  params.messages.delete(params.key);
  params.messages.set(params.key, node);
  return node;
}
function resolveTelegramMessageCachePersistentScopeKey(scope) {
  return createHash("sha256").update(scope).digest("hex").slice(0, 24);
}
function resolveDefaultPersistentStore() {
  const runtime = getOptionalTelegramRuntime();
  if (!runtime) return;
  try {
    return runtime.state.openKeyedStore({
      namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
      maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES,
    });
  } catch (error) {
    logVerbose(`telegram: failed to open message cache plugin state: ${String(error)}`);
    return;
  }
}
function resolveMessageCacheBucket(params) {
  const { bucketKey } = params;
  if (!bucketKey)
    return {
      messages: /* @__PURE__ */ new Map(),
      hydrated: true,
    };
  const existing = persistedMessageCacheBuckets.get(bucketKey);
  if (existing) {
    existing.persistentStore = params.persistentStore ?? existing.persistentStore;
    return existing;
  }
  const bucket = {
    messages: /* @__PURE__ */ new Map(),
    hydrated: false,
    ...(params.persistentStore ? { persistentStore: params.persistentStore } : {}),
  };
  persistedMessageCacheBuckets.set(bucketKey, bucket);
  return bucket;
}
async function hydrateMessageCacheBucket(bucket, maxMessages, scopeKey) {
  if (bucket.hydrated) return;
  if (bucket.hydratePromise) {
    await bucket.hydratePromise;
    return;
  }
  bucket.hydratePromise = (async () => {
    let storeEntries = [];
    try {
      storeEntries = (await bucket.persistentStore?.entries()) ?? [];
    } catch (error) {
      logVerbose(`telegram: failed to hydrate message cache from plugin state: ${String(error)}`);
    }
    const scopedStoreEntries = scopeKey
      ? storeEntries.filter(({ key }) => key.startsWith(`${scopeKey}:`))
      : storeEntries;
    for (const { key, value } of scopedStoreEntries)
      for (const entry of parsePersistedCacheValue(key, value)) {
        upsertCachedMessageNode({
          messages: bucket.messages,
          key: entry.key,
          node: entry.node,
          mode: entry.mode,
        });
        trimMessages(bucket.messages, maxMessages);
      }
    bucket.hydrated = true;
  })().finally(() => {
    bucket.hydratePromise = void 0;
  });
  await bucket.hydratePromise;
}
async function persistCachedNode(params) {
  const { persistentStore } = params.bucket;
  if (!persistentStore) return;
  try {
    const marker = params.node.promptContextProjectionMarker;
    const promptContextProjection =
      marker?.kind === "valid"
        ? marker.projection
        : marker
          ? { transcriptMessageId: marker.transcriptMessageId }
          : void 0;
    await persistentStore.register(params.key, {
      version: 1,
      sourceMessage: params.node.sourceMessage,
      ...(params.botUserId !== void 0 ? { botUserId: params.botUserId } : {}),
      ...(promptContextProjection ? { promptContextProjection } : {}),
      ...(params.node.threadId ? { threadId: params.node.threadId } : {}),
    });
  } catch (error) {
    logVerbose(`telegram: failed to persist message cache: ${String(error)}`);
    const marker = params.node.promptContextProjectionMarker;
    if (marker) {
      params.node.promptContextProjectionMarker = {
        kind: "invalid",
        transcriptMessageId:
          marker.kind === "valid"
            ? marker.projection.transcriptMessageId
            : marker.transcriptMessageId,
      };
      throw error;
    }
  }
}
function createTelegramMessageCache(params) {
  const persistentStore = params?.persistentStore ?? resolveDefaultPersistentStore();
  const maxMessages = params?.maxMessages ?? (persistentStore ? 3e3 : DEFAULT_MAX_MESSAGES);
  const scopeKey = persistentStore
    ? resolveTelegramMessageCachePersistentScopeKey(params?.scope ?? "default")
    : void 0;
  const bucket = resolveMessageCacheBucket({
    bucketKey:
      params?.bucketKey ?? (persistentStore ? `${PERSISTENT_BUCKET_KEY}:${scopeKey}` : void 0),
    ...(persistentStore ? { persistentStore } : {}),
  });
  const { messages } = bucket;
  const get = async ({ accountId, chatId, messageId }) => {
    await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
    if (!messageId) return null;
    const key = telegramMessageCacheKey({
      scopeKey,
      accountId,
      chatId,
      messageId,
    });
    const entry = messages.get(key);
    if (!entry) return null;
    messages.delete(key);
    messages.set(key, entry);
    return entry;
  };
  const listChatMessages = async (paramsLocal) => {
    await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
    const prefix = telegramMessageCacheKeyPrefix({
      scopeKey,
      ...paramsLocal,
    });
    const normalizedThreadId = parseTelegramMessageThreadId(paramsLocal.threadId);
    if (paramsLocal.threadId != null && normalizedThreadId === void 0) return [];
    const threadId = normalizedThreadId !== void 0 ? String(normalizedThreadId) : void 0;
    return Array.from(messages, ([key, node]) => ({
      key,
      node,
    }))
      .filter(({ key, node }) => {
        if (!key.startsWith(prefix)) return false;
        return threadId === void 0 || node.threadId === threadId;
      })
      .map(({ node }) => node)
      .toSorted(compareCachedMessageNodes);
  };
  return {
    record: async ({ accountId, botUserId, chatId, msg, promptContextProjection, threadId }) => {
      await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
      const observations = normalizeMessageNodes(msg, {
        threadId,
        ...(promptContextProjection && isTelegramMessageFromCurrentBot(msg, botUserId)
          ? {
              promptContextProjectionMarker: {
                kind: "valid",
                projection: promptContextProjection,
              },
            }
          : {}),
      });
      const currentObservation = observations.at(-1);
      let recordedEntry = currentObservation.node;
      for (const { node, mode } of observations) {
        const { messageId } = node;
        const key = telegramMessageCacheKey({
          scopeKey,
          accountId,
          chatId,
          messageId,
        });
        const cachedNode = upsertCachedMessageNode({
          messages,
          key,
          node,
          mode,
        });
        if (messageId === currentObservation.node.messageId) recordedEntry = cachedNode;
        trimMessages(messages, maxMessages);
        await persistCachedNode({
          bucket,
          key,
          node: cachedNode,
          ...(botUserId !== void 0 ? { botUserId } : {}),
        });
      }
      return recordedEntry;
    },
    get,
    recentBefore: async ({ accountId, chatId, messageId, threadId, limit }) => {
      if (!messageId || limit <= 0) return [];
      const targetId = parseSafeMessageId(messageId);
      if (targetId === void 0) return [];
      return (
        await listChatMessages({
          accountId,
          chatId,
          threadId,
        })
      )
        .filter((entry) => {
          const entryId = parseSafeMessageId(entry.messageId);
          return entryId !== void 0 && entryId < targetId;
        })
        .slice(-limit);
    },
    around: async ({ accountId, chatId, messageId, threadId, before, after }) => {
      if (!messageId) return [];
      const entries = await listChatMessages({
        accountId,
        chatId,
        threadId,
      });
      const targetIndex = entries.findIndex((entry) => entry.messageId === messageId);
      if (targetIndex === -1) return [];
      return entries.slice(
        Math.max(0, targetIndex - Math.max(0, before)),
        targetIndex + Math.max(0, after) + 1,
      );
    },
    latestMatchingAtOrBefore: async ({ accountId, chatId, messageId, threadId, matches }) => {
      if (!messageId) return null;
      const targetId = parseSafeMessageId(messageId);
      if (targetId === void 0) return null;
      await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
      const prefix = telegramMessageCacheKeyPrefix({
        scopeKey,
        accountId,
        chatId,
      });
      const normalizedThreadId = parseTelegramMessageThreadId(threadId);
      if (threadId != null && normalizedThreadId === void 0) return null;
      const normalizedThread = normalizedThreadId !== void 0 ? String(normalizedThreadId) : void 0;
      let latest = null;
      for (const [key, entry] of messages) {
        if (!key.startsWith(prefix)) continue;
        if (normalizedThread !== void 0 && entry.threadId !== normalizedThread) continue;
        const entryId = parseSafeMessageId(entry.messageId);
        if (entryId === void 0 || entryId > targetId || !matches(entry)) continue;
        if (!latest || compareCachedMessageNodes(entry, latest) > 0) latest = entry;
      }
      return latest;
    },
  };
}
function compareCachedMessageNodes(left, right) {
  const leftId = parseSafeMessageId(left.messageId);
  const rightId = parseSafeMessageId(right.messageId);
  if (leftId !== void 0 && rightId !== void 0) return leftId - rightId;
  return (left.messageId ?? "").localeCompare(right.messageId ?? "");
}
const SESSION_BOUNDARY_COMMAND_RE = /^\/(?:new|reset)(?:@[A-Za-z0-9_]+)?(?:\s|$)/i;
const SOFT_RESET_COMMAND_RE = /^\/reset(?:@[A-Za-z0-9_]+)?\s+soft(?:\s|$)/i;
function isTelegramSessionBoundaryCommandText(text) {
  const body = text?.trim();
  return Boolean(
    body && SESSION_BOUNDARY_COMMAND_RE.test(body) && !SOFT_RESET_COMMAND_RE.test(body),
  );
}
function isSessionBoundaryCommandNode(node) {
  return isTelegramSessionBoundaryCommandText(node.body);
}
function isAfterSessionBoundary(node, boundary) {
  if (!boundary) return true;
  const nodeId = parseSafeMessageId(node.messageId);
  const boundaryId = parseSafeMessageId(boundary.messageId);
  if (nodeId !== void 0 && boundaryId !== void 0) return nodeId > boundaryId;
  if (
    typeof node.timestamp === "number" &&
    Number.isFinite(node.timestamp) &&
    typeof boundary.timestamp === "number" &&
    Number.isFinite(boundary.timestamp)
  )
    return node.timestamp > boundary.timestamp;
  return true;
}
function normalizeSessionBoundaryTimestamp(timestampMs) {
  if (typeof timestampMs !== "number" || !Number.isFinite(timestampMs)) return;
  return Math.floor(timestampMs / 1e3) * 1e3;
}
function isAtOrAfterSessionBoundaryTimestamp(node, boundaryTimestampMs) {
  if (boundaryTimestampMs === void 0) return true;
  return typeof node.timestamp !== "number" || !Number.isFinite(node.timestamp)
    ? true
    : node.timestamp >= boundaryTimestampMs;
}
async function resolveSessionBoundaryNode(params) {
  if (!params.messageId) return;
  return (
    (await params.cache.latestMatchingAtOrBefore({
      accountId: params.accountId,
      chatId: params.chatId,
      messageId: params.messageId,
      ...(params.threadId !== void 0 ? { threadId: params.threadId } : {}),
      matches: isSessionBoundaryCommandNode,
    })) ?? void 0
  );
}
async function buildTelegramReplyChain(params) {
  const replyMessage = resolveReplyMessage(params.msg);
  if (!replyMessage?.message_id) return [];
  const maxDepth = params.maxDepth ?? 4;
  const visited = /* @__PURE__ */ new Set();
  const chain = [];
  let current =
    (await params.cache.get({
      accountId: params.accountId,
      chatId: params.chatId,
      messageId: String(replyMessage.message_id),
    })) ?? normalizeMessageNode(replyMessage, {});
  while (current?.messageId && chain.length < maxDepth && !visited.has(current.messageId)) {
    visited.add(current.messageId);
    chain.push(current);
    current = await params.cache.get({
      accountId: params.accountId,
      chatId: params.chatId,
      messageId: current.replyToId,
    });
  }
  return chain;
}
async function buildTelegramConversationContext(params) {
  const selected = /* @__PURE__ */ new Map();
  const replyTargetIds = /* @__PURE__ */ new Set();
  const sessionBoundary = await resolveSessionBoundaryNode(params);
  const sessionBoundaryTimestamp = normalizeSessionBoundaryTimestamp(params.minTimestampMs);
  const addNode = (node, flags) => {
    if (!node.messageId || node.messageId === params.messageId) return false;
    if (!isAfterSessionBoundary(node, sessionBoundary)) return false;
    if (!isAtOrAfterSessionBoundaryTimestamp(node, sessionBoundaryTimestamp)) return false;
    if (params.includeNode && !params.includeNode(node, flags)) return false;
    const existing = selected.get(node.messageId);
    const isReplyTarget = existing?.isReplyTarget === true || flags?.replyTarget === true;
    selected.set(node.messageId, {
      node: existing?.node ?? node,
      isReplyTarget: isReplyTarget ? true : void 0,
    });
    return true;
  };
  const addReplyTargetWindow = async (messageId) => {
    replyTargetIds.add(messageId);
    for (const node of await params.cache.around({
      accountId: params.accountId,
      chatId: params.chatId,
      messageId,
      ...(params.threadId !== void 0 ? { threadId: params.threadId } : {}),
      before: params.replyTargetWindowSize,
      after: params.replyTargetWindowSize,
    }))
      addNode(node, { replyTarget: node.messageId === messageId });
  };
  const currentWindow = await params.cache.recentBefore({
    accountId: params.accountId,
    chatId: params.chatId,
    messageId: params.messageId,
    ...(params.threadId !== void 0 ? { threadId: params.threadId } : {}),
    limit: params.recentLimit,
  });
  for (const node of currentWindow)
    if (addNode(node) && node.replyToId) await addReplyTargetWindow(node.replyToId);
  for (const [index, node] of params.replyChainNodes.entries()) {
    const added = addNode(node, { replyTarget: index === 0 });
    if (added && index === 0 && node.messageId) await addReplyTargetWindow(node.messageId);
    if (added && node.replyToId) replyTargetIds.add(node.replyToId);
  }
  for (const messageId of replyTargetIds) {
    const node = await params.cache.get({
      accountId: params.accountId,
      chatId: params.chatId,
      messageId,
    });
    if (node) addNode(node, { replyTarget: true });
  }
  return Array.from(selected.values()).toSorted((left, right) =>
    compareCachedMessageNodes(left.node, right.node),
  );
}
//#endregion
//#region extensions/telegram/src/sent-message-cache.ts
const TTL_MS = 1440 * 60 * 1e3;
const TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE = "telegram.sent-messages";
const TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES = 1e4;
const TELEGRAM_SENT_MESSAGES_STATE_KEY = Symbol.for("openclaw.telegramSentMessagesState");
const TELEGRAM_SENT_MESSAGES_STORE_FOR_TEST_KEY = Symbol.for(
  "openclaw.telegramSentMessagesStoreForTest",
);
function getSentMessageStoreForTest() {
  return globalThis[TELEGRAM_SENT_MESSAGES_STORE_FOR_TEST_KEY];
}
function getSentMessageState() {
  const globalStore = globalThis;
  const existing = globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY];
  if (existing) return existing;
  const state = { bucketsByScope: /* @__PURE__ */ new Map() };
  globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY] = state;
  return state;
}
function createSentMessageStore() {
  return /* @__PURE__ */ new Map();
}
function resolveSentMessageStorePath(cfg) {
  return `${resolveStorePath(cfg?.session?.store)}.telegram-sent-messages.json`;
}
function resolveSentMessageScopeKey(cfg) {
  const storePath = resolveStorePath(cfg?.session?.store);
  return createHash("sha256").update(storePath, "utf8").digest("hex").slice(0, 24);
}
function sentMessageEntryKey(scopeKey, chatId, messageId) {
  return createHash("sha256")
    .update(`${scopeKey}\0${chatId}\0${messageId}`, "utf8")
    .digest("hex")
    .slice(0, 32);
}
function openSentMessageStore() {
  return (
    getSentMessageStoreForTest() ??
    getTelegramRuntime().state.openSyncKeyedStore({
      namespace: "telegram.sent-messages",
      maxEntries: 1e4,
    })
  );
}
function cleanupExpired(store, scopeKey, entry, now) {
  for (const [id, timestamp] of entry) if (now - timestamp >= TTL_MS) entry.delete(id);
  if (entry.size === 0) store.delete(scopeKey);
}
function cleanupExpiredSentMessages(store, now) {
  for (const [scopeKey, entry] of store) cleanupExpired(store, scopeKey, entry, now);
}
function readLegacySentMessages(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const store = createSentMessageStore();
    for (const [chatId, entry] of Object.entries(parsed)) {
      const messages = /* @__PURE__ */ new Map();
      for (const [messageId, timestamp] of Object.entries(entry))
        if (
          typeof timestamp === "number" &&
          Number.isFinite(timestamp) &&
          now - timestamp <= TTL_MS
        )
          messages.set(messageId, timestamp);
      if (messages.size > 0) store.set(chatId, messages);
    }
    return store;
  } catch (error) {
    logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
    return createSentMessageStore();
  }
}
function readPersistedSentMessages(scopeKey) {
  const now = Date.now();
  const store = createSentMessageStore();
  try {
    for (const entry of openSentMessageStore().entries()) {
      if (entry.value.scopeKey !== scopeKey || now - entry.value.timestamp > TTL_MS) continue;
      let messages = store.get(entry.value.chatId);
      if (!messages) {
        messages = /* @__PURE__ */ new Map();
        store.set(entry.value.chatId, messages);
      }
      messages.set(entry.value.messageId, entry.value.timestamp);
    }
  } catch (error) {
    logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
  }
  return store;
}
function getSentMessageBucket(cfg) {
  const state = getSentMessageState();
  const scopeKey = resolveSentMessageScopeKey(cfg);
  const existing = state.bucketsByScope.get(scopeKey);
  if (existing) return existing;
  const bucket = {
    scopeKey,
    store: readPersistedSentMessages(scopeKey),
  };
  state.bucketsByScope.set(scopeKey, bucket);
  return bucket;
}
function getSentMessages(cfg) {
  return getSentMessageBucket(cfg).store;
}
function persistSentMessage(bucket, chatId, messageId, timestamp) {
  openSentMessageStore().register(
    sentMessageEntryKey(bucket.scopeKey, chatId, messageId),
    {
      scopeKey: bucket.scopeKey,
      chatId,
      messageId,
      timestamp,
    },
    { ttlMs: TTL_MS },
  );
}
function recordSentMessage(chatId, messageId, cfg) {
  const scopeKey = String(chatId);
  const idKey = String(messageId);
  const now = Date.now();
  const bucket = getSentMessageBucket(cfg);
  const { store } = bucket;
  let entry = store.get(scopeKey);
  if (!entry) {
    entry = /* @__PURE__ */ new Map();
    store.set(scopeKey, entry);
  }
  entry.set(idKey, now);
  cleanupExpiredSentMessages(store, now);
  try {
    persistSentMessage(bucket, scopeKey, idKey, now);
  } catch (error) {
    logVerbose(`telegram: failed to persist sent-message cache: ${String(error)}`);
  }
}
function wasSentByBot(chatId, messageId, cfg) {
  const scopeKey = String(chatId);
  const idKey = String(messageId);
  const store = getSentMessages(cfg);
  const entry = store.get(scopeKey);
  if (!entry) return false;
  cleanupExpired(store, scopeKey, entry, Date.now());
  return entry.has(idKey);
}
function listTelegramLegacySentMessageCacheEntries(params) {
  const scopeKey = resolveSentMessageScopeKey(params.cfg);
  const filePath = params.persistedPath ?? resolveSentMessageStorePath(params.cfg);
  return [
    ...(fs.existsSync(filePath)
      ? readLegacySentMessages(filePath)
      : createSentMessageStore()
    ).entries(),
  ].flatMap(([chatId, messages]) =>
    [...messages.entries()].map(([messageId, timestamp]) => ({
      key: sentMessageEntryKey(scopeKey, chatId, messageId),
      value: {
        scopeKey,
        chatId,
        messageId,
        timestamp,
      },
      ttlMs: Math.max(1, TTL_MS - Math.max(0, Date.now() - timestamp)),
    })),
  );
}
//#endregion
export {
  hasBotMentionInText as $,
  buildTelegramThreadParams as A,
  resolveTelegramForumThreadId as B,
  TelegramPairingStoreReadError as C,
  buildTelegramInboundOriginTarget as D,
  buildTelegramGroupPeerId as E,
  resetTelegramForumFlagCacheForTest as F,
  resolveTelegramThreadSpec as G,
  resolveTelegramMessageForumFlagHint as H,
  resolveTelegramBotHasTopicsEnabled as I,
  buildSenderLabel as J,
  shouldUseTelegramDmThreadSession as K,
  resolveTelegramCommandAuthorization as L,
  describeReplyTarget as M,
  extractTelegramForumFlag as N,
  buildTelegramParentPeer as O,
  isTelegramCommandsAllowFromConfigured as P,
  hasBotMention as Q,
  resolveTelegramDirectPeerId as R,
  withTelegramPromptContextSource as S,
  buildTelegramGroupFrom as T,
  resolveTelegramReplyId as U,
  resolveTelegramGroupAllowFromContext as V,
  resolveTelegramStreamMode as W,
  extractTelegramLocation as X,
  buildSenderName as Y,
  getTelegramTextParts as Z,
  createTelegramPromptContextProjectionCursor as _,
  resolveTelegramPreviewStreamMode as _t,
  wasSentByBot as a,
  resolveTelegramRichMessagePlaceholder as at,
  resolveTelegramPromptContextDeliverySignature as b,
  parseTelegramReplyToMessageId as bt,
  buildTelegramConversationContext as c,
  markdownToTelegramChunks as ct,
  isTelegramMessageCacheSourceMessage as d,
  markdownToTelegramRichHtml as dt,
  isBinaryContent as et,
  isTelegramMessageFromCurrentBot as f,
  normalizeTelegramOutboundRichHtml as ft,
  resolveTelegramMessageCacheScope as g,
  wrapFileReferencesInHtml as gt,
  resolveTelegramMessageCachePersistentScopeKey as h,
  telegramHtmlToPlainTextFallback as ht,
  recordSentMessage as i,
  resolveTelegramPrimaryMedia as it,
  buildTypingThreadParams as j,
  buildTelegramRoutingTarget as k,
  buildTelegramReplyChain as l,
  markdownToTelegramHtml as lt,
  resolveTelegramMessageCachePath as m,
  splitTelegramHtmlChunks as mt,
  TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE as n,
  renderTelegramTextEntities as nt,
  TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES as o,
  resolveTelegramRichMessageText as ot,
  isTelegramSessionBoundaryCommandText as p,
  renderTelegramHtmlText as pt,
  withResolvedTelegramForumFlag as q,
  listTelegramLegacySentMessageCacheEntries as r,
  resolveTelegramMediaPlaceholder as rt,
  TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE as s,
  escapeTelegramHtml as st,
  TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES as t,
  normalizeForwardedContext as tt,
  createTelegramMessageCache as u,
  markdownToTelegramHtmlChunks as ut,
  createTelegramPromptContextProjectionSequence as v,
  normalizeTelegramReplyToMessageId as vt,
  buildGroupLabel as w,
  resolveTelegramPromptContextSource as x,
  parseTelegramThreadId as xt,
  resolveCompleteTelegramPromptContextProjectionIds as y,
  parseTelegramMessageThreadId as yt,
  resolveTelegramForumFlag as z,
};
