import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./text-chunking-Dr19ggf-.js";
import { d as chunkTextRanges } from "./tables-YoFSvuf8.js";
import {
  S as TextStyle,
  _ as sendZaloTypingEvent,
  f as sendZaloDeliveredEvent,
  g as sendZaloTextMessage,
  h as sendZaloSeenEvent,
  m as sendZaloReaction,
  p as sendZaloLink,
  x as createZalouserSendReceipt,
} from "./zalo-js-CezP7Dd8.js";
//#region extensions/zalouser/src/text-styles.ts
const ESCAPE_SENTINEL_START = "";
const ESCAPE_SENTINEL_END = "";
const TAG_STYLE_MAP = {
  red: TextStyle.Red,
  orange: TextStyle.Orange,
  yellow: TextStyle.Yellow,
  green: TextStyle.Green,
  small: null,
  big: TextStyle.Big,
  underline: TextStyle.Underline,
};
const INLINE_MARKERS = [
  {
    pattern: /`([^`\n]+)`/g,
    extractText: (match) => expectDefined(match[0], "inline code match"),
    literal: true,
  },
  {
    pattern: /\\([*_~#\\{}>+\-`])/g,
    extractText: (match) => expectDefined(match[1], "escaped Markdown character capture"),
    literal: true,
  },
  {
    pattern: new RegExp(`\\{(${Object.keys(TAG_STYLE_MAP).join("|")})\\}(.+?)\\{/\\1\\}`, "g"),
    extractText: (match) => expectDefined(match[2], "tag body capture"),
    resolveStyles: (match) => {
      const tag = expectDefined(match[1], "tag name capture");
      const style = TAG_STYLE_MAP[tag];
      return style ? [style] : [];
    },
  },
  {
    pattern: /(?<!\*)\*\*\*(?=\S)([^\n]*?\S)(?<!\*)\*\*\*(?!\*)/g,
    extractText: (match) => expectDefined(match[1], "bold italic body capture"),
    resolveStyles: () => [TextStyle.Bold, TextStyle.Italic],
  },
  {
    pattern: /(?<!\*)\*\*(?![\s*])([^\n]*?\S)(?<!\*)\*\*(?!\*)/g,
    extractText: (match) => expectDefined(match[1], "bold body capture"),
    resolveStyles: () => [TextStyle.Bold],
  },
  {
    pattern: /(?<![\w_])__(?![\s_])([^\n]*?\S)(?<!_)__(?![\w_])/g,
    extractText: (match) => expectDefined(match[1], "underscored bold body capture"),
    resolveStyles: () => [TextStyle.Bold],
  },
  {
    pattern: /(?<!~)~~(?=\S)([^\n]*?\S)(?<!~)~~(?!~)/g,
    extractText: (match) => expectDefined(match[1], "strikethrough body capture"),
    resolveStyles: () => [TextStyle.StrikeThrough],
  },
  {
    pattern: /(?<!\*)\*(?![\s*])([^\n]*?\S)(?<!\*)\*(?!\*)/g,
    extractText: (match) => expectDefined(match[1], "italic body capture"),
    resolveStyles: () => [TextStyle.Italic],
  },
  {
    pattern: /(?<![\w_])_(?![\s_])([^\n]*?\S)(?<!_)_(?![\w_])/g,
    extractText: (match) => expectDefined(match[1], "underscored italic body capture"),
    resolveStyles: () => [TextStyle.Italic],
  },
];
function parseZalouserTextStyles(input) {
  const allStyles = [];
  const escapeMap = [];
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const lineStyles = [];
  const processedLines = [];
  let activeFence = null;
  for (const [lineIndex, rawLine] of lines.entries()) {
    const { text: unquotedLine, indent: baseIndent } = stripQuotePrefix(rawLine);
    if (activeFence) {
      const codeLine =
        activeFence.quoteIndent > 0
          ? stripQuotePrefix(rawLine, activeFence.quoteIndent).text
          : rawLine;
      if (isClosingFence(codeLine, activeFence)) {
        activeFence = null;
        continue;
      }
      processedLines.push(
        escapeLiteralText(
          normalizeCodeBlockLeadingWhitespace(stripCodeFenceIndent(codeLine, activeFence.indent)),
          escapeMap,
        ),
      );
      continue;
    }
    const line = unquotedLine;
    const openingFence = resolveOpeningFence(rawLine);
    if (openingFence) {
      const fenceLine = openingFence.quoteIndent > 0 ? unquotedLine : rawLine;
      if (!hasClosingFence(lines, lineIndex + 1, openingFence)) {
        processedLines.push(escapeLiteralText(fenceLine, escapeMap));
        activeFence = openingFence;
        continue;
      }
      activeFence = openingFence;
      continue;
    }
    const outputLineIndex = processedLines.length;
    if (isIndentedCodeBlockLine(line)) {
      if (baseIndent > 0)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Indent,
          indentSize: baseIndent,
        });
      processedLines.push(escapeLiteralText(normalizeCodeBlockLeadingWhitespace(line), escapeMap));
      continue;
    }
    const { text: markdownLine, size: markdownPadding } = stripOptionalMarkdownPadding(line);
    const headingMatch = markdownLine.match(/^(#{1,4})\s(.*)$/);
    if (headingMatch) {
      const depth = expectDefined(headingMatch[1], "heading marker capture").length;
      lineStyles.push({
        lineIndex: outputLineIndex,
        style: TextStyle.Bold,
      });
      if (depth === 1)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Big,
        });
      if (baseIndent > 0)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Indent,
          indentSize: baseIndent,
        });
      processedLines.push(expectDefined(headingMatch[2], "heading body capture"));
      continue;
    }
    const indentMatch = markdownLine.match(/^(\s+)(.*)$/);
    let indentLevel = 0;
    let content = markdownLine;
    if (indentMatch) {
      indentLevel = clampIndent(expectDefined(indentMatch[1], "indent capture").length);
      content = expectDefined(indentMatch[2], "indented content capture");
    }
    const totalIndent = Math.min(5, baseIndent + indentLevel);
    if (/^[-*+]\s\[[ xX]\]\s/.test(content)) {
      if (totalIndent > 0)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Indent,
          indentSize: totalIndent,
        });
      processedLines.push(content);
      continue;
    }
    const orderedListMatch = content.match(/^(\d+)\.\s(.*)$/);
    if (orderedListMatch) {
      if (totalIndent > 0)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Indent,
          indentSize: totalIndent,
        });
      lineStyles.push({
        lineIndex: outputLineIndex,
        style: TextStyle.OrderedList,
      });
      processedLines.push(expectDefined(orderedListMatch[2], "ordered list body capture"));
      continue;
    }
    const unorderedListMatch = content.match(/^[-*+]\s(.*)$/);
    if (unorderedListMatch) {
      if (totalIndent > 0)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Indent,
          indentSize: totalIndent,
        });
      lineStyles.push({
        lineIndex: outputLineIndex,
        style: TextStyle.UnorderedList,
      });
      processedLines.push(expectDefined(unorderedListMatch[1], "unordered list body capture"));
      continue;
    }
    if (markdownPadding > 0) {
      if (baseIndent > 0)
        lineStyles.push({
          lineIndex: outputLineIndex,
          style: TextStyle.Indent,
          indentSize: baseIndent,
        });
      processedLines.push(line);
      continue;
    }
    if (totalIndent > 0) {
      lineStyles.push({
        lineIndex: outputLineIndex,
        style: TextStyle.Indent,
        indentSize: totalIndent,
      });
      processedLines.push(content);
      continue;
    }
    processedLines.push(line);
  }
  const segments = parseInlineSegments(processedLines.join("\n"));
  let plainText = "";
  for (const segment of segments) {
    const start = plainText.length;
    plainText += segment.text;
    for (const style of segment.styles)
      allStyles.push({
        start,
        len: segment.text.length,
        st: style,
      });
  }
  if (escapeMap.length > 0) {
    const escapeRegex = new RegExp(`${ESCAPE_SENTINEL_START}(\\d+)${ESCAPE_SENTINEL_END}`, "g");
    const shifts = [];
    let cumulativeDelta = 0;
    for (const match of plainText.matchAll(escapeRegex)) {
      const escapeIndex = Number.parseInt(expectDefined(match[1], "escape sentinel index"), 10);
      const escaped = escapeMap.at(escapeIndex);
      if (escaped === void 0) continue;
      cumulativeDelta += match[0].length - escaped.length;
      shifts.push({
        pos: (match.index ?? 0) + match[0].length,
        delta: cumulativeDelta,
      });
    }
    for (const style of allStyles) {
      let startDelta = 0;
      let endDelta = 0;
      const end = style.start + style.len;
      for (const shift of shifts) {
        if (shift.pos <= style.start) startDelta = shift.delta;
        if (shift.pos <= end) endDelta = shift.delta;
      }
      style.start -= startDelta;
      style.len -= endDelta - startDelta;
    }
    plainText = plainText.replace(
      escapeRegex,
      (match, index) => escapeMap.at(Number.parseInt(index, 10)) ?? match,
    );
  }
  const finalLines = plainText.split("\n");
  let offset = 0;
  for (const [lineIndex, line] of finalLines.entries()) {
    const lineLength = line.length;
    if (lineLength > 0)
      for (const lineStyle of lineStyles) {
        if (lineStyle.lineIndex !== lineIndex) continue;
        if (lineStyle.style === TextStyle.Indent)
          allStyles.push({
            start: offset,
            len: lineLength,
            st: TextStyle.Indent,
            indentSize: lineStyle.indentSize,
          });
        else
          allStyles.push({
            start: offset,
            len: lineLength,
            st: lineStyle.style,
          });
      }
    offset += lineLength + 1;
  }
  return {
    text: plainText,
    styles: allStyles,
  };
}
function clampIndent(spaceCount) {
  return Math.min(5, Math.max(1, Math.floor(spaceCount / 2)));
}
function stripOptionalMarkdownPadding(line) {
  const match = line.match(/^( {1,3})(?=\S)/);
  if (!match)
    return {
      text: line,
      size: 0,
    };
  return {
    text: line.slice(expectDefined(match[1], "Markdown padding capture").length),
    size: expectDefined(match[1], "Markdown padding capture").length,
  };
}
function hasClosingFence(lines, startIndex, fence) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = expectDefined(lines[index], "closing fence scan index is in bounds");
    if (
      isClosingFence(
        fence.quoteIndent > 0 ? stripQuotePrefix(line, fence.quoteIndent).text : line,
        fence,
      )
    )
      return true;
  }
  return false;
}
function resolveOpeningFence(line) {
  const directFence = parseFenceMarker(line);
  if (directFence)
    return {
      ...directFence,
      quoteIndent: 0,
    };
  const quoted = stripQuotePrefix(line);
  if (quoted.indent === 0) return null;
  const quotedFence = parseFenceMarker(quoted.text);
  if (!quotedFence) return null;
  return {
    ...quotedFence,
    quoteIndent: quoted.indent,
  };
}
function stripQuotePrefix(line, maxDepth = Number.POSITIVE_INFINITY) {
  let cursor = 0;
  while (cursor < line.length && cursor < 3 && line[cursor] === " ") cursor += 1;
  let removedDepth = 0;
  let consumedCursor = cursor;
  while (removedDepth < maxDepth && consumedCursor < line.length && line[consumedCursor] === ">") {
    removedDepth += 1;
    consumedCursor += 1;
    if (line[consumedCursor] === " ") consumedCursor += 1;
  }
  if (removedDepth === 0)
    return {
      text: line,
      indent: 0,
    };
  return {
    text: line.slice(consumedCursor),
    indent: Math.min(5, removedDepth),
  };
}
function parseFenceMarker(line) {
  const match = line.match(/^([ ]{0,3})(`{3,}|~{3,})(.*)$/);
  if (!match) return null;
  const marker = expectDefined(match[2], "fence marker capture");
  const char = marker.charAt(0);
  if (char !== "`" && char !== "~") return null;
  return {
    char,
    length: marker.length,
    indent: expectDefined(match[1], "fence indent capture").length,
  };
}
function isClosingFence(line, fence) {
  const match = line.match(/^([ ]{0,3})(`{3,}|~{3,})[ \t]*$/);
  if (!match) return false;
  const marker = expectDefined(match[2], "closing fence marker capture");
  return marker.charAt(0) === fence.char && marker.length >= fence.length;
}
function escapeLiteralText(input, escapeMap) {
  return input.replace(/[\\*_~{}`]/g, (ch) => {
    const index = escapeMap.length;
    escapeMap.push(ch);
    return `\x01${index}\x02`;
  });
}
function parseInlineSegments(text, inheritedStyles = []) {
  const segments = [];
  let cursor = 0;
  while (cursor < text.length) {
    const nextMatch = findNextInlineMatch(text, cursor);
    if (!nextMatch) {
      pushSegment(segments, text.slice(cursor), inheritedStyles);
      break;
    }
    if (nextMatch.match.index > cursor)
      pushSegment(segments, text.slice(cursor, nextMatch.match.index), inheritedStyles);
    const combinedStyles = [...inheritedStyles, ...nextMatch.styles];
    if (nextMatch.marker.literal) pushSegment(segments, nextMatch.text, combinedStyles);
    else segments.push(...parseInlineSegments(nextMatch.text, combinedStyles));
    cursor = nextMatch.match.index + nextMatch.match[0].length;
  }
  return segments;
}
function findNextInlineMatch(text, startIndex) {
  let bestMatch = null;
  for (const [priority, marker] of INLINE_MARKERS.entries()) {
    const regex = new RegExp(marker.pattern.source, marker.pattern.flags);
    regex.lastIndex = startIndex;
    const match = regex.exec(text);
    if (!match) continue;
    if (
      bestMatch &&
      (match.index > bestMatch.match.index ||
        (match.index === bestMatch.match.index && priority > bestMatch.priority))
    )
      continue;
    bestMatch = {
      match,
      marker,
      text: marker.extractText(match),
      styles: marker.resolveStyles?.(match) ?? [],
      priority,
    };
  }
  return bestMatch;
}
function pushSegment(segments, text, styles) {
  if (!text) return;
  const lastSegment = segments.at(-1);
  if (lastSegment && sameStyles(lastSegment.styles, styles)) {
    lastSegment.text += text;
    return;
  }
  segments.push({
    text,
    styles: [...styles],
  });
}
function sameStyles(left, right) {
  return left.length === right.length && left.every((style, index) => style === right.at(index));
}
function normalizeCodeBlockLeadingWhitespace(line) {
  return line.replace(/^[ \t]+/, (leadingWhitespace) =>
    leadingWhitespace.replace(/\t/g, "\xA0\xA0\xA0\xA0").replace(/ /g, "\xA0"),
  );
}
function isIndentedCodeBlockLine(line) {
  return /^(?: {4,}|\t)/.test(line);
}
function stripCodeFenceIndent(line, indent) {
  let consumed = 0;
  let cursor = 0;
  while (cursor < line.length && consumed < indent && line[cursor] === " ") {
    cursor += 1;
    consumed += 1;
  }
  return line.slice(cursor);
}
//#endregion
//#region extensions/zalouser/src/send.ts
const ZALO_TEXT_LIMIT = 2e3;
async function sendMessageZalouser(threadId, text, options = {}) {
  const { onDeliveryResult, ...transportOptions } = options;
  const prepared =
    transportOptions.textMode === "markdown"
      ? parseZalouserTextStyles(text)
      : {
          text,
          styles: transportOptions.textStyles,
        };
  const textChunkLimit = transportOptions.textChunkLimit ?? ZALO_TEXT_LIMIT;
  const chunks = splitStyledText(
    prepared.text,
    (prepared.styles?.length ?? 0) > 0 ? prepared.styles : void 0,
    textChunkLimit,
    transportOptions.textChunkMode,
  );
  let lastResult = null;
  for (const [index, chunk] of chunks.entries()) {
    const chunkOptions =
      index === 0
        ? {
            ...transportOptions,
            textStyles: chunk.styles,
          }
        : {
            ...transportOptions,
            caption: void 0,
            mediaLocalRoots: void 0,
            mediaUrl: void 0,
            textStyles: chunk.styles,
          };
    const result = await sendZaloTextMessage(threadId, chunk.text, chunkOptions);
    if (!result.ok) throw new Error(result.error || "Failed to send Zalouser message");
    await onDeliveryResult?.(result);
    lastResult = result;
  }
  return (
    lastResult ?? {
      ok: false,
      error: "No message content provided",
      receipt: createZalouserSendReceipt({
        threadId,
        kind: "text",
      }),
    }
  );
}
async function sendImageZalouser(threadId, imageUrl, options = {}) {
  return await sendMessageZalouser(threadId, options.caption ?? "", {
    ...options,
    caption: void 0,
    mediaUrl: imageUrl,
  });
}
async function sendLinkZalouser(threadId, url, options = {}) {
  return await sendZaloLink(threadId, url, options);
}
async function sendTypingZalouser(threadId, options = {}) {
  await sendZaloTypingEvent(threadId, options);
}
async function sendReactionZalouser(params) {
  const result = await sendZaloReaction({
    profile: params.profile,
    threadId: params.threadId,
    isGroup: params.isGroup,
    msgId: params.msgId,
    cliMsgId: params.cliMsgId,
    emoji: params.emoji,
    remove: params.remove,
  });
  return {
    ok: result.ok,
    error: result.error,
    receipt: createZalouserSendReceipt({
      threadId: params.threadId,
      kind: "unknown",
    }),
  };
}
async function sendDeliveredZalouser(params) {
  await sendZaloDeliveredEvent(params);
}
async function sendSeenZalouser(params) {
  await sendZaloSeenEvent(params);
}
function splitStyledText(text, styles, limit, mode) {
  if (text.length === 0)
    return [
      {
        text,
        styles: void 0,
      },
    ];
  const chunks = [];
  for (const range of chunkTextRanges(text, {
    limit,
    mode: mode === "newline" ? "preferred" : "hard",
  })) {
    const { start, end } = range;
    chunks.push({
      text: text.slice(start, end),
      styles: sliceTextStyles(styles, start, end),
    });
  }
  return chunks;
}
function sliceTextStyles(styles, start, end) {
  if (!styles || styles.length === 0) return;
  const chunkStyles = styles
    .map((style) => {
      const overlapStart = Math.max(style.start, start);
      const overlapEnd = Math.min(style.start + style.len, end);
      if (overlapEnd <= overlapStart) return null;
      if (style.st === TextStyle.Indent)
        return {
          start: overlapStart - start,
          len: overlapEnd - overlapStart,
          st: style.st,
          indentSize: style.indentSize,
        };
      return {
        start: overlapStart - start,
        len: overlapEnd - overlapStart,
        st: style.st,
      };
    })
    .filter((style) => style !== null);
  return chunkStyles.length > 0 ? chunkStyles : void 0;
}
//#endregion
export {
  sendReactionZalouser as a,
  sendMessageZalouser as i,
  sendImageZalouser as n,
  sendSeenZalouser as o,
  sendLinkZalouser as r,
  sendTypingZalouser as s,
  sendDeliveredZalouser as t,
};
