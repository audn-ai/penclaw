import { s as visibleWidth } from "./ansi-D4OHEz5F.js";
import {
  a as HTML_TAG_RE,
  i as isWhiteSpace,
  n as isMdAsciiPunct,
  r as isPunctChar,
  t as MarkdownIt,
} from "./markdown-it-CuMGuate.js";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-lH-m0h6-.js";
//#region packages/markdown-core/src/chunk-text.ts
function resolveChunkEarlyReturn(text, limit) {
  if (!text) return [];
  if (limit <= 0) return [text];
  if (text.length <= limit) return [text];
}
function scanParenAwareBreakpoints(text) {
  let lastNewline = -1;
  let lastWhitespace = -1;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (char === "(") {
      depth += 1;
      continue;
    }
    if (char === ")" && depth > 0) {
      depth -= 1;
      continue;
    }
    if (depth !== 0) continue;
    if (char === "\n") lastNewline = i;
    else if (/\s/.test(char)) lastWhitespace = i;
  }
  return {
    lastNewline,
    lastWhitespace,
  };
}
function findPreferredRangeEnd(text, start, end) {
  const slice = text.slice(start, end);
  let paragraphEnd;
  for (const match of slice.matchAll(/\n[\t ]*\n+/g))
    if (match.index !== void 0) paragraphEnd = start + match.index + match[0].length;
  if (paragraphEnd !== void 0) return paragraphEnd;
  const newlineIndex = text.lastIndexOf("\n", end - 1);
  if (newlineIndex >= start) return newlineIndex + 1;
  for (let index = end - 1; index > start; index -= 1)
    if (/\s/.test(text.charAt(index))) return index + 1;
}
/**
 * Splits text into contiguous UTF-16 ranges without dropping separator whitespace.
 * Preferred mode selects paragraph, newline, then whitespace boundaries.
 */
function chunkTextRanges(text, options) {
  if (!text) return [];
  if (options.limit <= 0 || text.length <= options.limit)
    return [
      {
        start: 0,
        end: text.length,
      },
    ];
  const ranges = [];
  let start = 0;
  while (start < text.length) {
    const maxEnd = Math.min(text.length, start + options.limit);
    const preferredEnd =
      options.mode === "preferred" && maxEnd < text.length
        ? findPreferredRangeEnd(text, start, maxEnd)
        : void 0;
    const end = avoidTrailingHighSurrogateBreak(
      text,
      start,
      preferredEnd && preferredEnd > start ? preferredEnd : maxEnd,
    );
    ranges.push({
      start,
      end,
    });
    start = end;
  }
  return ranges;
}
/**
 * Splits plain text into size-bounded chunks at readable boundaries.
 *
 * Returns the original text as one chunk when the limit is non-positive.
 */
function chunkText(text, limit) {
  const early = resolveChunkEarlyReturn(text, limit);
  if (early) return early;
  const chunks = [];
  let cursor = 0;
  while (cursor < text.length) {
    if (text.length - cursor <= limit) {
      chunks.push(text.slice(cursor));
      break;
    }
    const windowEnd = Math.min(text.length, cursor + limit);
    const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(
      text.slice(cursor, windowEnd),
    );
    const breakOffset = lastNewline > 0 ? lastNewline : lastWhitespace;
    const end = avoidTrailingHighSurrogateBreak(
      text,
      cursor,
      breakOffset > 0 ? cursor + breakOffset : windowEnd,
    );
    chunks.push(text.slice(cursor, end));
    cursor = end;
    while (cursor < text.length && /\s/.test(text[cursor] ?? "")) cursor += 1;
  }
  return chunks;
}
//#endregion
//#region packages/markdown-core/src/html-tags.ts
function htmlTagName(rawTag, closing) {
  let end = closing ? 2 : 1;
  while (end < rawTag.length) {
    const code = rawTag.charCodeAt(end);
    if (
      !((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) &&
      !(code >= 48 && code <= 57) &&
      code !== 45
    )
      break;
    end += 1;
  }
  return rawTag.slice(closing ? 2 : 1, end).toLowerCase();
}
/** Tokenizes valid open/close HTML tags with Markdown-It's quote-aware grammar. */
function* tokenizeHtmlTags(html) {
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf("<", cursor);
    if (start < 0) return;
    const match = HTML_TAG_RE.exec(html.slice(start));
    if (!match) {
      cursor = start + 1;
      continue;
    }
    const raw = match[0];
    const closing = raw.startsWith("</");
    const end = start + raw.length;
    const name = htmlTagName(raw, closing);
    if (!name) {
      cursor = end;
      continue;
    }
    yield {
      raw,
      start,
      end,
      name,
      closing,
      selfClosing: !closing && raw.trimEnd().endsWith("/>"),
    };
    cursor = end;
  }
}
const ambiguousRanges = [
  161, 161, 164, 164, 167, 168, 170, 170, 173, 174, 176, 180, 182, 186, 188, 191, 198, 198, 208,
  208, 215, 216, 222, 225, 230, 230, 232, 234, 236, 237, 240, 240, 242, 243, 247, 250, 252, 252,
  254, 254, 257, 257, 273, 273, 275, 275, 283, 283, 294, 295, 299, 299, 305, 307, 312, 312, 319,
  322, 324, 324, 328, 331, 333, 333, 338, 339, 358, 359, 363, 363, 462, 462, 464, 464, 466, 466,
  468, 468, 470, 470, 472, 472, 474, 474, 476, 476, 593, 593, 609, 609, 708, 708, 711, 711, 713,
  715, 717, 717, 720, 720, 728, 731, 733, 733, 735, 735, 768, 879, 913, 929, 931, 937, 945, 961,
  963, 969, 1025, 1025, 1040, 1103, 1105, 1105, 8208, 8208, 8211, 8214, 8216, 8217, 8220, 8221,
  8224, 8226, 8228, 8231, 8240, 8240, 8242, 8243, 8245, 8245, 8251, 8251, 8254, 8254, 8308, 8308,
  8319, 8319, 8321, 8324, 8364, 8364, 8451, 8451, 8453, 8453, 8457, 8457, 8467, 8467, 8470, 8470,
  8481, 8482, 8486, 8486, 8491, 8491, 8531, 8532, 8539, 8542, 8544, 8555, 8560, 8569, 8585, 8585,
  8592, 8601, 8632, 8633, 8658, 8658, 8660, 8660, 8679, 8679, 8704, 8704, 8706, 8707, 8711, 8712,
  8715, 8715, 8719, 8719, 8721, 8721, 8725, 8725, 8730, 8730, 8733, 8736, 8739, 8739, 8741, 8741,
  8743, 8748, 8750, 8750, 8756, 8759, 8764, 8765, 8776, 8776, 8780, 8780, 8786, 8786, 8800, 8801,
  8804, 8807, 8810, 8811, 8814, 8815, 8834, 8835, 8838, 8839, 8853, 8853, 8857, 8857, 8869, 8869,
  8895, 8895, 8978, 8978, 9312, 9449, 9451, 9547, 9552, 9587, 9600, 9615, 9618, 9621, 9632, 9633,
  9635, 9641, 9650, 9651, 9654, 9655, 9660, 9661, 9664, 9665, 9670, 9672, 9675, 9675, 9678, 9681,
  9698, 9701, 9711, 9711, 9733, 9734, 9737, 9737, 9742, 9743, 9756, 9756, 9758, 9758, 9792, 9792,
  9794, 9794, 9824, 9825, 9827, 9829, 9831, 9834, 9836, 9837, 9839, 9839, 9886, 9887, 9919, 9919,
  9926, 9933, 9935, 9939, 9941, 9953, 9955, 9955, 9960, 9961, 9963, 9969, 9972, 9972, 9974, 9977,
  9979, 9980, 9982, 9983, 10045, 10045, 10102, 10111, 11094, 11097, 12872, 12879, 57344, 63743,
  65024, 65039, 65533, 65533, 127232, 127242, 127248, 127277, 127280, 127337, 127344, 127373,
  127375, 127376, 127387, 127404, 917760, 917999, 983040, 1048573, 1048576, 1114109,
];
const fullwidthRanges = [12288, 12288, 65281, 65376, 65504, 65510];
const halfwidthRanges = [
  8361, 8361, 65377, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 65512, 65518,
];
const narrowRanges = [32, 126, 162, 163, 165, 166, 172, 172, 175, 175, 10214, 10221, 10629, 10630];
const wideRanges = [
  4352, 4447, 8986, 8987, 9001, 9002, 9193, 9196, 9200, 9200, 9203, 9203, 9725, 9726, 9748, 9749,
  9776, 9783, 9800, 9811, 9855, 9855, 9866, 9871, 9875, 9875, 9889, 9889, 9898, 9899, 9917, 9918,
  9924, 9925, 9934, 9934, 9940, 9940, 9962, 9962, 9970, 9971, 9973, 9973, 9978, 9978, 9981, 9981,
  9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071,
  10133, 10135, 10160, 10160, 10175, 10175, 11035, 11036, 11088, 11088, 11093, 11093, 11904, 11929,
  11931, 12019, 12032, 12245, 12272, 12287, 12289, 12350, 12353, 12438, 12441, 12543, 12549, 12591,
  12593, 12686, 12688, 12773, 12783, 12830, 12832, 12871, 12880, 42124, 42128, 42182, 43360, 43388,
  44032, 55203, 63744, 64255, 65040, 65049, 65072, 65106, 65108, 65126, 65128, 65131, 94176, 94180,
  94192, 94198, 94208, 101589, 101631, 101662, 101760, 101874, 110576, 110579, 110581, 110587,
  110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951,
  110960, 111355, 119552, 119638, 119648, 119670, 126980, 126980, 127183, 127183, 127374, 127374,
  127377, 127386, 127488, 127490, 127504, 127547, 127552, 127560, 127568, 127569, 127584, 127589,
  127744, 127776, 127789, 127797, 127799, 127868, 127870, 127891, 127904, 127946, 127951, 127955,
  127968, 127984, 127988, 127988, 127992, 128062, 128064, 128064, 128066, 128252, 128255, 128317,
  128331, 128334, 128336, 128359, 128378, 128378, 128405, 128406, 128420, 128420, 128507, 128591,
  128640, 128709, 128716, 128716, 128720, 128722, 128725, 128728, 128732, 128735, 128747, 128748,
  128756, 128764, 128992, 129003, 129008, 129008, 129292, 129338, 129340, 129349, 129351, 129535,
  129648, 129660, 129664, 129674, 129678, 129734, 129736, 129736, 129741, 129756, 129759, 129770,
  129775, 129784, 131072, 196605, 196608, 262141,
];
//#endregion
//#region node_modules/get-east-asian-width/utilities.js
/**
Binary search on a sorted flat array of [start, end] pairs.

@param {number[]} ranges - Flat array of inclusive [start, end] range pairs, e.g. [0, 5, 10, 20].
@param {number} codePoint - The value to search for.
@returns {boolean} Whether the value falls within any of the ranges.
*/
const isInRange = (ranges, codePoint) => {
  let low = 0;
  let high = Math.floor(ranges.length / 2) - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const i = mid * 2;
    if (codePoint < ranges[i]) high = mid - 1;
    else if (codePoint > ranges[i + 1]) low = mid + 1;
    else return true;
  }
  return false;
};
//#endregion
//#region node_modules/get-east-asian-width/lookup.js
const commonCjkCodePoint = 19968;
const [wideFastPathStart, wideFastPathEnd] = /* #__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
  let fastPathStart = ranges[0];
  let fastPathEnd = ranges[1];
  for (let index = 0; index < ranges.length; index += 2) {
    const start = ranges[index];
    const end = ranges[index + 1];
    if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) return [start, end];
    if (end - start > fastPathEnd - fastPathStart) {
      fastPathStart = start;
      fastPathEnd = end;
    }
  }
  return [fastPathStart, fastPathEnd];
}
const isAmbiguous = (codePoint) => {
  if (codePoint < 161 || codePoint > 1114109) return false;
  return isInRange(ambiguousRanges, codePoint);
};
const isFullWidth = (codePoint) => {
  if (codePoint < 12288 || codePoint > 65510) return false;
  return isInRange(fullwidthRanges, codePoint);
};
const isHalfWidth = (codePoint) => {
  if (codePoint < 8361 || codePoint > 65518) return false;
  return isInRange(halfwidthRanges, codePoint);
};
const isNarrow = (codePoint) => {
  if (codePoint < 32 || codePoint > 10630) return false;
  return isInRange(narrowRanges, codePoint);
};
const isWide = (codePoint) => {
  if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) return true;
  if (codePoint < 4352 || codePoint > 262141) return false;
  return isInRange(wideRanges, codePoint);
};
function getCategory(codePoint) {
  if (isAmbiguous(codePoint)) return "ambiguous";
  if (isFullWidth(codePoint)) return "fullwidth";
  if (isHalfWidth(codePoint)) return "halfwidth";
  if (isNarrow(codePoint)) return "narrow";
  if (isWide(codePoint)) return "wide";
  return "neutral";
}
//#endregion
//#region node_modules/get-east-asian-width/index.js
function validate(codePoint) {
  if (!Number.isSafeInteger(codePoint))
    throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
}
function eastAsianWidthType(codePoint) {
  validate(codePoint);
  return getCategory(codePoint);
}
//#endregion
//#region node_modules/markdown-it-cjk-friendly/dist/index.js
function isEmoji(uc) {
  return /^\p{Emoji_Presentation}/u.test(String.fromCodePoint(uc));
}
/**
 * Check if `uc` is CJK. Deferred (returns `null`) if IVS.
 *
 * @param uc code point
 * @returns `true` if `uc` is CJK, `false` if not, `null` if IVS
 */
function isCjkBase(uc) {
  if (uc < 4352) return false;
  switch (eastAsianWidthType(uc)) {
    case "fullwidth":
    case "halfwidth":
      return true;
    case "wide":
      return !isEmoji(uc);
    case "narrow":
      return false;
    case "ambiguous":
      return null;
    case "neutral":
      return /^\p{sc=Hangul}/u.test(String.fromCodePoint(uc));
  }
}
function is2PreviousCjk(uc, prev) {
  return isCjkBase(uc) ?? (prev === 65025 && isQuotationMark(uc));
  function isQuotationMark(uc$1) {
    return uc$1 === 8216 || uc$1 === 8217 || uc$1 === 8220 || uc$1 === 8221;
  }
}
function isPreviousCjk(uc) {
  return isCjkBase(uc) ?? (917760 <= uc && uc <= 917999);
}
function isNextCjk(uc) {
  return isCjkBase(uc) ?? false;
}
function nonEmojiGeneralUseVS(uc) {
  return uc >= 65024 && uc <= 65038;
}
function markdownItCjkFriendlyPlugin(md) {
  const PreviousState = md.inline.State;
  class CjkFriendlyState extends PreviousState {
    scanDelims(start, canSplitWord) {
      const max = this.posMax;
      const marker = this.src.charCodeAt(start);
      const [lastChar, lastCharPos] = getLastCharCode(this.src, start);
      let lastMainChar = lastChar;
      let twoPrevChar = null;
      if (nonEmojiGeneralUseVS(lastChar)) {
        twoPrevChar = getLastCharCode(this.src, lastCharPos)[0];
        if (!/^\p{Zs}/u.test(String.fromCodePoint(twoPrevChar))) lastMainChar = twoPrevChar;
      }
      let pos = start;
      while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
      const count = pos - start;
      const nextChar = pos < max ? this.src.codePointAt(pos) : 32;
      const isLastWhiteSpace = isWhiteSpace(lastMainChar);
      const isNextWhiteSpace = isWhiteSpace(nextChar);
      if (isLastWhiteSpace || isNextWhiteSpace)
        return {
          can_open: !isNextWhiteSpace,
          can_close: !isLastWhiteSpace,
          length: count,
        };
      const isLastPunctChar =
        isMdAsciiPunct(lastMainChar) || isPunctChar(String.fromCodePoint(lastMainChar));
      const isNextPunctChar =
        isMdAsciiPunct(nextChar) || isPunctChar(String.fromCodePoint(nextChar));
      let left_flanking = isLastPunctChar;
      let right_flanking = isNextPunctChar;
      if (canSplitWord) {
        const isEitherCJKChar =
          isNextCjk(nextChar) ||
          (twoPrevChar !== null ? is2PreviousCjk(twoPrevChar, lastChar) : isPreviousCjk(lastChar));
        left_flanking ||= isEitherCJKChar || !isNextPunctChar;
        right_flanking ||= isEitherCJKChar || !isLastPunctChar;
      }
      return {
        can_open: left_flanking,
        can_close: right_flanking,
        length: count,
      };
      function getLastCharCode(str, pos$1) {
        if (pos$1 <= 0) return [32, -1];
        const charCode = str.charCodeAt(pos$1 - 1);
        if ((charCode & 64512) !== 56320) return [charCode, pos$1 - 1];
        const codePoint = str.codePointAt(pos$1 - 2);
        return codePoint > 65535 ? [codePoint, pos$1 - 2] : [charCode, pos$1 - 1];
      }
    }
  }
  md.inline.State = CjkFriendlyState;
}
//#endregion
//#region packages/markdown-core/src/assistant-transcript-headers.ts
const TRANSCRIPT_ROLES = ["assistant", "developer", "system", "user"];
function isHorizontalWhitespace(char) {
  return char === " " || char === "	";
}
function isLineTrailingWhitespace(char) {
  return isHorizontalWhitespace(char) || char === "\r";
}
function skipHorizontalWhitespace(text, start, end) {
  let cursor = start;
  while (cursor < end && isHorizontalWhitespace(text[cursor])) cursor += 1;
  return cursor;
}
function matchRoleAt(text, start, end) {
  for (const role of TRANSCRIPT_ROLES) {
    const roleEnd = start + role.length;
    if (roleEnd <= end && text.slice(start, roleEnd).toLowerCase() === role)
      return {
        role,
        end: roleEnd,
      };
  }
  return null;
}
function findDelimitedEnd(params) {
  const searchEnd = Math.min(params.lineEnd, params.contentStart + params.maxContentLength + 1);
  let closeAt = -1;
  for (let index = params.contentStart; index < searchEnd; index += 1) {
    const char = params.text[index];
    if (char === "`") return null;
    if (char === params.close) {
      closeAt = index;
      break;
    }
  }
  if (closeAt === -1) return null;
  const contentLength = closeAt - params.contentStart;
  if (contentLength < params.minContentLength || contentLength > params.maxContentLength)
    return null;
  return closeAt + 1;
}
function isHeaderBoundary(char) {
  return char === void 0 || isLineTrailingWhitespace(char) || char === ":" || char === "：";
}
function matchRoleTimestampHeader(text, start, lineEnd) {
  const role = matchRoleAt(text, start, lineEnd);
  if (!role) return null;
  const bracketStart = skipHorizontalWhitespace(text, role.end, lineEnd);
  if (text[bracketStart] !== "[") return null;
  const headerEnd = findDelimitedEnd({
    text,
    contentStart: bracketStart + 1,
    lineEnd,
    close: "]",
    minContentLength: 1,
    maxContentLength: 160,
  });
  if (!headerEnd || !isHeaderBoundary(text[headerEnd])) return null;
  return {
    start,
    end: headerEnd,
    kind: "role_timestamp_bracket",
    role: role.role,
  };
}
function matchTimestampRoleHeader(text, start, lineEnd) {
  if (text[start] !== "[") return null;
  const bracketEnd = findDelimitedEnd({
    text,
    contentStart: start + 1,
    lineEnd,
    close: "]",
    minContentLength: 4,
    maxContentLength: 160,
  });
  if (!bracketEnd) return null;
  const role = matchRoleAt(text, skipHorizontalWhitespace(text, bracketEnd, lineEnd), lineEnd);
  if (!role) return null;
  const colonAt = skipHorizontalWhitespace(text, role.end, lineEnd);
  if (text[colonAt] !== ":" && text[colonAt] !== "：") return null;
  return {
    start,
    end: colonAt + 1,
    kind: "timestamp_role_colon",
    role: role.role,
  };
}
function matchAngleRoleHeader(text, start, lineEnd) {
  if (text[start] !== "<") return null;
  const role = matchRoleAt(text, skipHorizontalWhitespace(text, start + 1, lineEnd), lineEnd);
  const roleBoundary = role ? text[role.end] : void 0;
  if (!role || (roleBoundary !== ">" && !isHorizontalWhitespace(roleBoundary))) return null;
  const headerEnd = findDelimitedEnd({
    text,
    contentStart: role.end,
    lineEnd,
    close: ">",
    minContentLength: 0,
    maxContentLength: 160,
  });
  if (!headerEnd || !isHeaderBoundary(text[headerEnd])) return null;
  return {
    start,
    end: headerEnd,
    kind: "angle_role_header",
    role: role.role,
  };
}
function rangesOverlap$1(left, right) {
  return left.start < right.end && left.end > right.start;
}
/** Finds supported transcript-role headers in parser-visible text. */
function findAssistantTranscriptRoleHeaderSpans(text, excludedRanges = []) {
  const spans = [];
  const sortedExcludedRanges = [...excludedRanges].toSorted(
    (left, right) => left.start - right.start || left.end - right.end,
  );
  let excludedRangeIndex = 0;
  let lineStart = 0;
  while (lineStart < text.length) {
    const newlineAt = text.indexOf("\n", lineStart);
    const lineEnd = newlineAt === -1 ? text.length : newlineAt;
    const contentStart = skipHorizontalWhitespace(text, lineStart, lineEnd);
    const span =
      matchTimestampRoleHeader(text, contentStart, lineEnd) ??
      matchAngleRoleHeader(text, contentStart, lineEnd) ??
      matchRoleTimestampHeader(text, contentStart, lineEnd);
    if (span) {
      for (;;) {
        const excludedRange = sortedExcludedRanges[excludedRangeIndex];
        if (!excludedRange || excludedRange.end > span.start) break;
        excludedRangeIndex += 1;
      }
      const excludedRange = sortedExcludedRanges[excludedRangeIndex];
      if (!excludedRange || !rangesOverlap$1(span, excludedRange)) spans.push(span);
    }
    if (newlineAt === -1) break;
    lineStart = newlineAt + 1;
  }
  return spans;
}
//#endregion
//#region packages/markdown-core/src/assistant-transcript.ts
const ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE = "assistant_transcript_role_text";
const RAW_CODE_CONTAINER_TAGS = /* @__PURE__ */ new Set([
  "code",
  "pre",
  "script",
  "style",
  "textarea",
]);
function findRawCodeContainerRanges(text) {
  const ranges = [];
  const openTags = [];
  let rangeStart = -1;
  for (const tag of tokenizeHtmlTags(text)) {
    if (!RAW_CODE_CONTAINER_TAGS.has(tag.name)) continue;
    if (tag.closing) {
      const openIndex = openTags.lastIndexOf(tag.name);
      if (openIndex !== -1) {
        openTags.splice(openIndex);
        if (openTags.length === 0 && rangeStart !== -1) {
          ranges.push({
            start: rangeStart,
            end: tag.end,
          });
          rangeStart = -1;
        }
      }
    } else if (!tag.selfClosing) {
      if (openTags.length === 0) rangeStart = tag.start;
      openTags.push(tag.name);
    }
  }
  if (openTags.length > 0 && rangeStart !== -1)
    ranges.push({
      start: rangeStart,
      end: text.length,
    });
  return ranges;
}
function visibleTokenProjection(token, options) {
  if (token.type === "softbreak" || token.type === "hardbreak")
    return {
      text: "\n",
      excludedRanges: [],
    };
  if (token.type === "html_inline" && options.isStructuralHtmlInline?.(token) === true) return null;
  if (token.type === "text" || token.type === "html_inline")
    return {
      text: token.content,
      excludedRanges: [],
    };
  if (token.type === "code_inline")
    return {
      text: token.content,
      excludedRanges: [
        {
          start: 0,
          end: token.content.length,
        },
      ],
    };
  if (token.type === "image")
    return token.children && token.children.length > 0
      ? visibleTokensProjection(token.children, options)
      : {
          text: token.content,
          excludedRanges: [],
        };
  return null;
}
function visibleTokensProjection(tokens, options) {
  let text = "";
  const excludedRanges = [];
  for (const token of tokens) {
    const projection = visibleTokenProjection(token, options);
    if (!projection) continue;
    const offset = text.length;
    text += projection.text;
    for (const range of projection.excludedRanges)
      excludedRanges.push({
        start: offset + range.start,
        end: offset + range.end,
      });
  }
  excludedRanges.push(...findRawCodeContainerRanges(text));
  return {
    text,
    excludedRanges,
  };
}
function cloneToken(TokenType, source, content, type = source.type) {
  const token = new TokenType(type, type === "assistant_transcript_role_text" ? "" : source.tag, 0);
  Object.assign(token, source);
  token.type = type;
  token.content = content;
  token.children = null;
  return token;
}
function annotatedToken(TokenType, source, content, span) {
  const token = cloneToken(TokenType, source, content, ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE);
  token.meta = {
    ...(source.meta && typeof source.meta === "object" ? source.meta : {}),
    assistantTranscriptRoleHeader: {
      kind: span.kind,
      role: span.role,
    },
  };
  return token;
}
function splitVisibleToken(params) {
  const { token, visibleStart } = params;
  const visibleEnd = visibleStart + token.content.length;
  const firstSpan = params.spans[params.spanStartIndex];
  if (!firstSpan || firstSpan.start >= visibleEnd) return [token];
  const result = [];
  let localCursor = 0;
  for (let spanIndex = params.spanStartIndex; spanIndex < params.spans.length; spanIndex += 1) {
    const span = params.spans[spanIndex];
    if (!span || span.start >= visibleEnd) break;
    if (span.end <= visibleStart) continue;
    const overlapStart = Math.max(span.start, visibleStart) - visibleStart;
    const overlapEnd = Math.min(span.end, visibleEnd) - visibleStart;
    if (overlapStart > localCursor)
      result.push(
        cloneToken(params.TokenType, token, token.content.slice(localCursor, overlapStart)),
      );
    if (overlapEnd > overlapStart)
      result.push(
        annotatedToken(
          params.TokenType,
          token,
          token.content.slice(overlapStart, overlapEnd),
          span,
        ),
      );
    localCursor = overlapEnd;
  }
  if (localCursor < token.content.length)
    result.push(cloneToken(params.TokenType, token, token.content.slice(localCursor)));
  return result;
}
function annotateInlineChildren(TokenType, children, preserveLinks, options) {
  const projection = visibleTokensProjection(children, options);
  const spans = findAssistantTranscriptRoleHeaderSpans(projection.text, projection.excludedRanges);
  if (spans.length === 0) return children;
  const result = [];
  let visibleCursor = 0;
  let spanCursor = 0;
  for (const token of children) {
    const tokenProjection = visibleTokenProjection(token, options);
    if (!tokenProjection) {
      result.push(token);
      continue;
    }
    const content = tokenProjection.text;
    for (;;) {
      const span = spans[spanCursor];
      if (!span || span.end > visibleCursor) break;
      spanCursor += 1;
    }
    if (token.type === "text" || token.type === "html_inline")
      result.push(
        ...splitVisibleToken({
          TokenType,
          token,
          visibleStart: visibleCursor,
          spanStartIndex: spanCursor,
          spans,
        }),
      );
    else if (token.type === "image") {
      const visibleEnd = visibleCursor + content.length;
      const imageSpans = [];
      for (let spanIndex = spanCursor; spanIndex < spans.length; spanIndex += 1) {
        const span = spans[spanIndex];
        if (!span || span.start >= visibleEnd) break;
        if (span.end <= visibleCursor) continue;
        imageSpans.push({
          ...span,
          start: Math.max(span.start, visibleCursor) - visibleCursor,
          end: Math.min(span.end, visibleEnd) - visibleCursor,
        });
      }
      if (imageSpans.length > 0)
        token.meta = {
          ...(token.meta && typeof token.meta === "object" ? token.meta : {}),
          assistantTranscriptRoleImage: {
            text: content,
            spans: imageSpans,
          },
        };
      result.push(token);
    } else result.push(token);
    visibleCursor += content.length;
  }
  return preserveLinks ? result : removeLinksContainingAssistantTranscriptRoles(result);
}
function removeLinksContainingAssistantTranscriptRoles(tokens) {
  const openLinks = [];
  const suppressedLinks = /* @__PURE__ */ new Set();
  for (const token of tokens) {
    if (token.type === "link_open") {
      openLinks.push({
        token,
        containsRole: false,
      });
      continue;
    }
    const imageMeta = token.meta?.assistantTranscriptRoleImage;
    if (token.type === "assistant_transcript_role_text" || imageMeta?.spans.length) {
      for (const link of openLinks) link.containsRole = true;
      continue;
    }
    if (token.type !== "link_close") continue;
    const openLink = openLinks.pop();
    if (!openLink?.containsRole) continue;
    suppressedLinks.add(openLink.token);
    suppressedLinks.add(token);
  }
  const result = [];
  for (const token of tokens) {
    if (suppressedLinks.has(token)) continue;
    const previous = result.at(-1);
    if (
      previous?.type === "assistant_transcript_role_text" &&
      token.type === "assistant_transcript_role_text"
    ) {
      previous.content += token.content;
      continue;
    }
    result.push(token);
  }
  return result;
}
function annotateHtmlBlock(TokenType, token) {
  const spans = findAssistantTranscriptRoleHeaderSpans(
    token.content,
    findRawCodeContainerRanges(token.content),
  );
  if (spans.length === 0) return [token];
  return splitVisibleToken({
    TokenType,
    token,
    visibleStart: 0,
    spanStartIndex: 0,
    spans,
  });
}
/** Adds semantic transcript-role tokens to assistant-authored Markdown only. */
function markdownItAssistantTranscriptRoles(md, options = {}) {
  md.core.ruler.after("text_join", "assistant_transcript_roles", (state) => {
    if (state.env?.assistantTranscriptRoleHeaders !== true) return;
    const tokens = [];
    const preserveLinks = state.env?.assistantTranscriptRolePreserveLinks === true;
    for (const token of state.tokens) {
      if (token.type === "inline" && token.children) {
        token.children = annotateInlineChildren(
          state.Token,
          token.children,
          preserveLinks,
          options,
        );
        tokens.push(token);
        continue;
      }
      if (token.type === "html_block") {
        tokens.push(...annotateHtmlBlock(state.Token, token));
        continue;
      }
      tokens.push(token);
    }
    state.tokens = tokens;
  });
}
//#endregion
//#region packages/markdown-core/src/ir-spans.ts
function createStyleSpan(params) {
  const span = {
    start: params.start,
    end: params.end,
    style: params.style,
  };
  if (params.language) span.language = params.language;
  return span;
}
function clampStyleSpans(spans, maxLength) {
  const clamped = [];
  for (const span of spans) {
    const start = Math.max(0, Math.min(span.start, maxLength));
    const end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start)
      clamped.push(
        createStyleSpan({
          start,
          end,
          style: span.style,
          language: span.language,
        }),
      );
  }
  return clamped;
}
function clampLinkSpans(spans, maxLength) {
  const clamped = [];
  for (const span of spans) {
    const start = Math.max(0, Math.min(span.start, maxLength));
    const end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start)
      clamped.push({
        start,
        end,
        href: span.href,
      });
  }
  return clamped;
}
function clampAnnotationSpans(spans, maxLength) {
  const clamped = [];
  for (const span of spans) {
    const start = Math.max(0, Math.min(span.start, maxLength));
    const end = Math.max(start, Math.min(span.end, maxLength));
    if (end > start)
      clamped.push({
        ...span,
        start,
        end,
      });
  }
  return clamped;
}
function mergeAnnotationSpans(spans) {
  const sorted = [...spans].toSorted((a, b) => a.start - b.start || a.end - b.end);
  const merged = [];
  for (const span of sorted) {
    const previous = merged.at(-1);
    if (
      previous &&
      previous.end === span.start &&
      previous.type === span.type &&
      previous.kind === span.kind &&
      previous.role === span.role
    ) {
      previous.end = span.end;
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function mergeStyleSpans(spans) {
  const sorted = [...spans].toSorted((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return a.end - b.end;
    return a.style.localeCompare(b.style);
  });
  const merged = [];
  for (const span of sorted) {
    const previous = merged.at(-1);
    if (
      previous &&
      previous.style === span.style &&
      previous.language === span.language &&
      (span.start < previous.end || (span.start === previous.end && span.style !== "blockquote"))
    ) {
      previous.end = Math.max(previous.end, span.end);
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function resolveSliceBounds(span, start, end) {
  const sliceStart = Math.max(span.start, start);
  const sliceEnd = Math.min(span.end, end);
  return sliceEnd > sliceStart
    ? {
        start: sliceStart,
        end: sliceEnd,
      }
    : null;
}
function sliceStyleSpans(spans, start, end) {
  const sliced = [];
  for (const span of spans) {
    const bounds = resolveSliceBounds(span, start, end);
    if (bounds)
      sliced.push(
        createStyleSpan({
          start: bounds.start - start,
          end: bounds.end - start,
          style: span.style,
          language: span.language,
        }),
      );
  }
  return mergeStyleSpans(sliced);
}
function sliceLinkSpans(spans, start, end) {
  const sliced = [];
  for (const span of spans) {
    const bounds = resolveSliceBounds(span, start, end);
    if (bounds)
      sliced.push({
        start: bounds.start - start,
        end: bounds.end - start,
        href: span.href,
      });
  }
  return sliced;
}
function sliceAnnotationSpans(spans, start, end) {
  const sliced = [];
  for (const span of spans) {
    const bounds = resolveSliceBounds(span, start, end);
    if (bounds)
      sliced.push({
        ...span,
        start: bounds.start - start,
        end: bounds.end - start,
      });
  }
  return mergeAnnotationSpans(sliced);
}
//#endregion
//#region packages/markdown-core/src/ir-annotations.ts
function rangesOverlap(left, right) {
  return left.start < right.end && left.end > right.start;
}
/** Re-evaluate the first visible line after a transport creates a new message boundary. */
function annotateAssistantTranscriptRoleMessageBoundary(ir) {
  const firstLineEnd = ir.text.indexOf("\n");
  const boundaryText = firstLineEnd === -1 ? ir.text : ir.text.slice(0, firstLineEnd);
  const boundarySpan = findAssistantTranscriptRoleHeaderSpans(
    boundaryText,
    ir.styles
      .filter((span) => span.style === "code" || span.style === "code_block")
      .filter((span) => span.start < boundaryText.length)
      .map(({ start, end }) => ({
        start,
        end: Math.min(end, boundaryText.length),
      })),
  )[0];
  if (!boundarySpan || (ir.annotations ?? []).some((span) => rangesOverlap(span, boundarySpan)))
    return ir;
  const annotation = {
    ...boundarySpan,
    type: "assistant_transcript_role",
  };
  return {
    ...ir,
    links: ir.links.filter((link) => !rangesOverlap(link, annotation)),
    annotations: mergeAnnotationSpans([...(ir.annotations ?? []), annotation]),
  };
}
function appendAssistantTranscriptRoleText(target, value, meta) {
  if (!value) return;
  const start = target.text.length;
  target.text += value;
  target.annotations.push({
    start,
    end: target.text.length,
    type: "assistant_transcript_role",
    kind: meta.kind,
    role: meta.role,
  });
}
function appendAssistantTranscriptRoleImage(target, meta) {
  if (!meta.text) return;
  const offset = target.text.length;
  target.text += meta.text;
  for (const span of meta.spans)
    target.annotations.push({
      ...span,
      start: offset + span.start,
      end: offset + span.end,
      type: "assistant_transcript_role",
    });
}
//#endregion
//#region packages/markdown-core/src/ir-source-spacing.ts
/** Prepare the next mapped block start for each token in one reverse pass. */
function computeNextMappedBlockStarts(tokens) {
  const nextStarts = [];
  let nextStart;
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    nextStarts[index] = nextStart;
    const currentStart = tokens[index]?.map?.[0];
    if (currentStart !== void 0) nextStart = currentStart;
  }
  return nextStarts;
}
function sourceBlockNewlineCount(preserveSourceBlockSpacing, nextBlockStart, blockLineEnd) {
  if (!preserveSourceBlockSpacing || blockLineEnd === void 0) return;
  return nextBlockStart === void 0 ? 0 : Math.max(1, nextBlockStart - blockLineEnd + 1);
}
//#endregion
//#region packages/markdown-core/src/ir.ts
const OPEN_MARKDOWN_HTML_TAG_PATTERN = /<\/?[a-zA-Z][a-zA-Z0-9-]*\b[^<>]*$/;
function appendHeadingSeparator(state, nextBlockStart) {
  const newlineCount = sourceBlockNewlineCount(
    state.preserveSourceBlockSpacing,
    nextBlockStart,
    state.headingLineEnd,
  );
  if (newlineCount === void 0) {
    appendParagraphSeparator(state);
    return;
  }
  if (newlineCount > 0) state.text += "\n".repeat(newlineCount);
  state.headingLineEnd = void 0;
}
function createMarkdownIt(options) {
  const md = new MarkdownIt({
    html: false,
    linkify: options.linkify ?? true,
    breaks: false,
    typographer: false,
  });
  md.use(markdownItCjkFriendlyPlugin);
  md.use(markdownItAssistantTranscriptRoles);
  if (options.enableSpoilers)
    md.core.ruler.before("assistant_transcript_roles", "markdown_core_spoilers", (state) => {
      applySpoilerTokens(state.tokens);
    });
  md.enable("strikethrough");
  if (options.tableMode && options.tableMode !== "off") md.enable("table");
  else md.disable("table");
  if (options.autolink === false) md.disable("autolink");
  return md;
}
function getAttr(token, name) {
  if (token.attrGet) return token.attrGet(name);
  if (token.attrs) {
    for (const [key, value] of token.attrs) if (key === name) return value;
  }
  return null;
}
function markdownTableAlignmentFromToken(token) {
  const value = getAttr(token, "style") ?? "";
  if (/text-align\s*:\s*left/i.test(value)) return "left";
  if (/text-align\s*:\s*center/i.test(value)) return "center";
  if (/text-align\s*:\s*right/i.test(value)) return "right";
}
function createTextToken(base, content) {
  return {
    ...base,
    type: "text",
    content,
    children: void 0,
  };
}
function applySpoilerTokens(tokens) {
  for (const token of tokens)
    if (token.children && token.children.length > 0)
      token.children = injectSpoilersIntoInline(token.children);
}
function injectSpoilersIntoInline(tokens) {
  let totalDelims = 0;
  for (const token of tokens) {
    if (token.type !== "text") continue;
    const content = token.content ?? "";
    let i = 0;
    while (i < content.length) {
      const next = content.indexOf("||", i);
      if (next === -1) break;
      totalDelims += 1;
      i = next + 2;
    }
  }
  if (totalDelims < 2) return tokens;
  const usableDelims = totalDelims - (totalDelims % 2);
  const result = [];
  const state = { spoilerOpen: false };
  let consumedDelims = 0;
  for (const token of tokens) {
    if (token.type !== "text") {
      result.push(token);
      continue;
    }
    const content = token.content ?? "";
    if (!content.includes("||")) {
      result.push(token);
      continue;
    }
    let index = 0;
    while (index < content.length) {
      const next = content.indexOf("||", index);
      if (next === -1) {
        if (index < content.length) result.push(createTextToken(token, content.slice(index)));
        break;
      }
      if (consumedDelims >= usableDelims) {
        result.push(createTextToken(token, content.slice(index)));
        break;
      }
      if (next > index) result.push(createTextToken(token, content.slice(index, next)));
      consumedDelims += 1;
      state.spoilerOpen = !state.spoilerOpen;
      result.push({ type: state.spoilerOpen ? "spoiler_open" : "spoiler_close" });
      index = next + 2;
    }
  }
  return result;
}
function initRenderTarget() {
  return {
    text: "",
    styles: [],
    openStyles: [],
    links: [],
    linkStack: [],
    annotations: [],
  };
}
function resolveRenderTarget(state) {
  return state.table?.currentCell ?? state;
}
function appendText(state, value) {
  if (!value) return;
  const target = resolveRenderTarget(state);
  target.text += value;
}
function openStyle(state, style) {
  const target = resolveRenderTarget(state);
  target.openStyles.push({
    style,
    start: target.text.length,
  });
}
function closeStyle(state, style, options) {
  const target = resolveRenderTarget(state);
  for (let i = target.openStyles.length - 1; i >= 0; i -= 1) {
    const open = target.openStyles.at(i);
    if (open?.style === style) {
      const start = open.start;
      target.openStyles.splice(i, 1);
      const end =
        options?.trimTrailingParagraphSeparator && target.text.endsWith("\n\n")
          ? target.text.length - 2
          : target.text.length;
      if (end > start)
        target.styles.push({
          start,
          end,
          style,
        });
      return;
    }
  }
}
function appendParagraphSeparator(state, token) {
  if (state.table) return;
  if (state.env.listStack.length > 0) {
    const directListParagraphLevel =
      (state.env.listStack[state.env.listStack.length - 1]?.openLevel ?? 0) + 2;
    if (
      token?.type !== "paragraph_close" ||
      token.hidden ||
      token.level !== directListParagraphLevel
    )
      return;
  }
  state.text += "\n\n";
}
function appendTopLevelListSeparator(state) {
  if ((state.text.match(/\n*$/)?.[0].length ?? 0) < 2) state.text += "\n";
}
function appendNestedListSeparator(state) {
  if (!state.text.endsWith("\n")) state.text += "\n";
}
function appendListPrefix(state) {
  const stack = state.env.listStack;
  const top = stack[stack.length - 1];
  if (!top) return;
  top.index += 1;
  const indent = "  ".repeat(Math.max(0, stack.length - 1));
  const prefix = top.type === "ordered" ? `${top.index}. ` : "• ";
  state.text += `${indent}${prefix}`;
}
function renderInlineCode(state, content) {
  if (!content) return;
  const target = resolveRenderTarget(state);
  const start = target.text.length;
  target.text += content;
  target.styles.push({
    start,
    end: start + content.length,
    style: "code",
  });
}
function resolveFenceLanguage(info) {
  return info?.trim().split(/\s+/, 1)[0]?.trim() || void 0;
}
function renderCodeBlock(state, content, info, sourceNewlineCount) {
  let code = content ?? "";
  if (!code.endsWith("\n")) code = `${code}\n`;
  const target = resolveRenderTarget(state);
  const start = target.text.length;
  target.text += code;
  target.styles.push(
    createStyleSpan({
      start,
      end: start + code.length,
      style: "code_block",
      language: resolveFenceLanguage(info),
    }),
  );
  if (state.env.listStack.length === 0) {
    const extraNewlines = sourceNewlineCount === void 0 ? 1 : Math.max(0, sourceNewlineCount - 1);
    target.text += "\n".repeat(extraNewlines);
  }
}
function handleLinkClose(state) {
  const target = resolveRenderTarget(state);
  const link = target.linkStack.pop();
  if (!link?.href) return;
  const href = link.href.trim();
  if (!href) return;
  const start = link.labelStart;
  const end = target.text.length;
  if (end <= start) {
    target.links.push({
      start,
      end,
      href,
    });
    return;
  }
  target.links.push({
    start,
    end,
    href,
  });
}
function headingStyleFromToken(token) {
  switch (token.tag) {
    case "h1":
      return "heading_1";
    case "h2":
      return "heading_2";
    case "h3":
      return "heading_3";
    case "h4":
      return "heading_4";
    case "h5":
      return "heading_5";
    case "h6":
      return "heading_6";
    default:
      return null;
  }
}
function isInsideMarkdownHtmlTag(text) {
  const openTagStart = text.lastIndexOf("<");
  if (openTagStart === -1) return false;
  return (
    text.lastIndexOf(">") < openTagStart &&
    OPEN_MARKDOWN_HTML_TAG_PATTERN.test(text.slice(openTagStart))
  );
}
function initTableState() {
  return {
    headers: [],
    rows: [],
    aligns: [],
    currentRow: [],
    currentCell: null,
    inHeader: false,
  };
}
function finishTableCell(cell) {
  closeRemainingStyles(cell);
  return {
    text: cell.text,
    styles: cell.styles,
    links: cell.links,
    ...(cell.annotations.length > 0 ? { annotations: cell.annotations } : {}),
  };
}
function trimCell(cell) {
  const text = cell.text;
  let start = 0;
  let end = text.length;
  while (start < end && /\s/.test(text[start] ?? "")) start += 1;
  while (end > start && /\s/.test(text[end - 1] ?? "")) end -= 1;
  if (start === 0 && end === text.length) return cell;
  const trimmedText = text.slice(start, end);
  const trimmedLength = trimmedText.length;
  const trimmedStyles = [];
  for (const span of cell.styles) {
    const sliceStart = Math.max(0, span.start - start);
    const sliceEnd = Math.min(trimmedLength, span.end - start);
    if (sliceEnd > sliceStart)
      trimmedStyles.push({
        start: sliceStart,
        end: sliceEnd,
        style: span.style,
      });
  }
  const trimmedLinks = [];
  for (const span of cell.links) {
    const sliceStart = Math.max(0, span.start - start);
    const sliceEnd = Math.min(trimmedLength, span.end - start);
    if (sliceEnd > sliceStart)
      trimmedLinks.push({
        start: sliceStart,
        end: sliceEnd,
        href: span.href,
      });
  }
  const trimmedAnnotations = sliceAnnotationSpans(cell.annotations ?? [], start, end);
  return {
    text: trimmedText,
    styles: trimmedStyles,
    links: trimmedLinks,
    ...(trimmedAnnotations.length > 0 ? { annotations: trimmedAnnotations } : {}),
  };
}
function appendCell(state, cell) {
  if (!cell.text) return;
  const start = state.text.length;
  state.text += cell.text;
  for (const span of cell.styles)
    state.styles.push({
      start: start + span.start,
      end: start + span.end,
      style: span.style,
    });
  for (const link of cell.links)
    state.links.push({
      start: start + link.start,
      end: start + link.end,
      href: link.href,
    });
  for (const annotation of cell.annotations ?? [])
    state.annotations.push({
      ...annotation,
      start: start + annotation.start,
      end: start + annotation.end,
    });
}
function appendCellTextOnly(state, cell) {
  if (!cell.text) return;
  state.text += cell.text;
}
function collectTableBlock(state) {
  if (!state.table) return;
  const headerCells = state.table.headers.map(trimCell);
  const rowCells = state.table.rows.map((row) => row.map(trimCell));
  const table = {
    headers: headerCells.map((cell) => cell.text),
    rows: rowCells.map((row) => row.map((cell) => cell.text)),
    headerCells,
    rowCells,
    placeholderOffset: state.text.length,
    ...(state.table.aligns.some(Boolean) ? { aligns: [...state.table.aligns] } : {}),
  };
  state.collectedTables.push(table);
}
function appendTableBulletValue(state, params) {
  const { header, value, columnIndex, includeColumnFallback } = params;
  if (!value?.text) return;
  state.text += "• ";
  if (header?.text) {
    appendCell(state, header);
    state.text += ": ";
  } else if (includeColumnFallback) state.text += `Column ${columnIndex}: `;
  appendCell(state, value);
  state.text += "\n";
}
function renderTableAsBullets(state) {
  if (!state.table) return;
  const headers = state.table.headers.map(trimCell);
  const rows = state.table.rows.map((row) => row.map(trimCell));
  if (headers.length === 0 && rows.length === 0) return;
  if (headers.length > 1 && rows.length > 0)
    for (const row of rows) {
      if (row.length === 0) continue;
      const rowLabel = row[0];
      if (rowLabel?.text) {
        const labelStart = state.text.length;
        appendCell(state, rowLabel);
        const labelEnd = state.text.length;
        if (labelEnd > labelStart)
          state.styles.push({
            start: labelStart,
            end: labelEnd,
            style: "bold",
          });
        state.text += "\n";
      }
      for (let i = 1; i < row.length; i++)
        appendTableBulletValue(state, {
          header: headers[i],
          value: row[i],
          columnIndex: i,
          includeColumnFallback: true,
        });
      state.text += "\n";
    }
  else
    for (const row of rows) {
      for (let i = 0; i < row.length; i++)
        appendTableBulletValue(state, {
          header: headers[i],
          value: row[i],
          columnIndex: i,
          includeColumnFallback: false,
        });
      state.text += "\n";
    }
}
function renderTableAsCode(state) {
  if (!state.table) return;
  const headers = state.table.headers.map(trimCell);
  const rows = state.table.rows.map((row) => row.map(trimCell));
  const columnCount = Math.max(headers.length, ...rows.map((row) => row.length));
  if (columnCount === 0) return;
  const widths = Array.from({ length: columnCount }, () => 0);
  const updateWidths = (cells) => {
    for (const [i, currentWidth] of widths.entries()) {
      const cell = cells[i];
      const width = visibleWidth(cell?.text ?? "");
      if (currentWidth < width) widths[i] = width;
    }
  };
  updateWidths(headers);
  for (const row of rows) updateWidths(row);
  const codeStart = state.text.length;
  const appendRow = (cells) => {
    state.text += "|";
    for (const [i, width] of widths.entries()) {
      state.text += " ";
      const cell = cells[i];
      if (cell) appendCellTextOnly(state, cell);
      const pad = width - visibleWidth(cell?.text ?? "");
      if (pad > 0) state.text += " ".repeat(pad);
      state.text += " |";
    }
    state.text += "\n";
  };
  const appendDivider = () => {
    state.text += "|";
    for (const width of widths) {
      const dashCount = Math.max(3, width);
      state.text += ` ${"-".repeat(dashCount)} |`;
    }
    state.text += "\n";
  };
  appendRow(headers);
  appendDivider();
  for (const row of rows) appendRow(row);
  const codeEnd = state.text.length;
  if (codeEnd > codeStart)
    state.styles.push({
      start: codeStart,
      end: codeEnd,
      style: "code_block",
    });
  if (state.env.listStack.length === 0) state.text += "\n";
}
function renderTokens(tokens, state) {
  const nextMappedBlockStarts = computeNextMappedBlockStarts(tokens);
  for (const [tokenIndex, token] of tokens.entries())
    switch (token.type) {
      case "inline":
        if (token.children) renderTokens(token.children, state);
        break;
      case "text":
        appendText(state, token.content ?? "");
        break;
      case ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE: {
        const meta = token.meta?.assistantTranscriptRoleHeader;
        if (meta)
          appendAssistantTranscriptRoleText(resolveRenderTarget(state), token.content ?? "", meta);
        else appendText(state, token.content ?? "");
        break;
      }
      case "em_open":
        openStyle(state, "italic");
        break;
      case "em_close":
        closeStyle(state, "italic");
        break;
      case "strong_open":
        openStyle(state, "bold");
        break;
      case "strong_close":
        closeStyle(state, "bold");
        break;
      case "s_open":
        openStyle(state, "strikethrough");
        break;
      case "s_close":
        closeStyle(state, "strikethrough");
        break;
      case "code_inline":
        renderInlineCode(state, token.content ?? "");
        break;
      case "spoiler_open":
        if (state.enableSpoilers) openStyle(state, "spoiler");
        break;
      case "spoiler_close":
        if (state.enableSpoilers) closeStyle(state, "spoiler");
        break;
      case "link_open": {
        const target = resolveRenderTarget(state);
        const href = isInsideMarkdownHtmlTag(target.text) ? "" : (getAttr(token, "href") ?? "");
        target.linkStack.push({
          href,
          labelStart: target.text.length,
        });
        break;
      }
      case "link_close":
        handleLinkClose(state);
        break;
      case "image": {
        const meta = token.meta?.assistantTranscriptRoleImage;
        if (meta) appendAssistantTranscriptRoleImage(resolveRenderTarget(state), meta);
        else appendText(state, token.content ?? "");
        break;
      }
      case "softbreak":
      case "hardbreak":
        appendText(state, "\n");
        break;
      case "paragraph_close":
        appendParagraphSeparator(state, token);
        break;
      case "heading_open":
        state.headingLineEnd = token.map?.[1];
        if (state.headingStyle === "bold") openStyle(state, "bold");
        else if (state.headingStyle === "rich") {
          const style = headingStyleFromToken(token);
          if (style) openStyle(state, style);
        }
        break;
      case "heading_close":
        if (state.headingStyle === "bold") closeStyle(state, "bold");
        else if (state.headingStyle === "rich") {
          const style = headingStyleFromToken(token);
          if (style) closeStyle(state, style);
        }
        appendHeadingSeparator(state, nextMappedBlockStarts[tokenIndex]);
        break;
      case "blockquote_open":
        if (state.blockquotePrefix) state.text += state.blockquotePrefix;
        openStyle(state, "blockquote");
        break;
      case "blockquote_close":
        closeStyle(state, "blockquote", { trimTrailingParagraphSeparator: true });
        break;
      case "bullet_list_open":
        if (state.env.listStack.length > 0) appendNestedListSeparator(state);
        state.env.listStack.push({
          type: "bullet",
          index: 0,
          openLevel: token.level ?? 0,
        });
        break;
      case "bullet_list_close":
        state.env.listStack.pop();
        if (state.env.listStack.length === 0) appendTopLevelListSeparator(state);
        break;
      case "ordered_list_open": {
        if (state.env.listStack.length > 0) appendNestedListSeparator(state);
        const start = Number(getAttr(token, "start") ?? "1");
        state.env.listStack.push({
          type: "ordered",
          index: start - 1,
          openLevel: token.level ?? 0,
        });
        break;
      }
      case "ordered_list_close":
        state.env.listStack.pop();
        if (state.env.listStack.length === 0) appendTopLevelListSeparator(state);
        break;
      case "list_item_open":
        appendListPrefix(state);
        break;
      case "list_item_close":
        if (!state.text.endsWith("\n")) state.text += "\n";
        break;
      case "code_block":
      case "fence":
        renderCodeBlock(
          state,
          token.content ?? "",
          token.info,
          sourceBlockNewlineCount(
            state.preserveSourceBlockSpacing,
            nextMappedBlockStarts[tokenIndex],
            token.map?.[1],
          ),
        );
        break;
      case "html_block":
      case "html_inline":
        appendText(state, token.content ?? "");
        break;
      case "table_open":
        if (state.tableMode !== "off") {
          state.table = initTableState();
          state.hasTables = true;
        }
        break;
      case "table_close":
        if (state.table) {
          if (state.tableMode === "bullets") renderTableAsBullets(state);
          else if (state.tableMode === "code") renderTableAsCode(state);
          else if (state.tableMode === "block") collectTableBlock(state);
        }
        state.table = null;
        break;
      case "thead_open":
        if (state.table) state.table.inHeader = true;
        break;
      case "thead_close":
        if (state.table) state.table.inHeader = false;
        break;
      case "tbody_open":
      case "tbody_close":
        break;
      case "tr_open":
        if (state.table) state.table.currentRow = [];
        break;
      case "tr_close":
        if (state.table) {
          if (state.table.inHeader) state.table.headers = state.table.currentRow;
          else state.table.rows.push(state.table.currentRow);
          state.table.currentRow = [];
        }
        break;
      case "th_open":
      case "td_open":
        if (state.table) {
          state.table.currentCell = initRenderTarget();
          if (token.type === "th_open" && state.table.inHeader)
            state.table.aligns[state.table.currentRow.length] =
              markdownTableAlignmentFromToken(token);
        }
        break;
      case "th_close":
      case "td_close":
        if (state.table?.currentCell) {
          state.table.currentRow.push(finishTableCell(state.table.currentCell));
          state.table.currentCell = null;
        }
        break;
      case "hr":
        if (state.horizontalRuleText) state.text += `${state.horizontalRuleText}\n\n`;
        break;
      default:
        if (token.children) renderTokens(token.children, state);
        break;
    }
}
function closeRemainingStyles(target) {
  for (const open of target.openStyles.toReversed()) {
    const end = target.text.length;
    if (end > open.start)
      target.styles.push({
        start: open.start,
        end,
        style: open.style,
      });
  }
  target.openStyles = [];
}
function sliceMarkdownIR(ir, start, end) {
  const annotations = sliceAnnotationSpans(ir.annotations ?? [], start, end);
  return {
    text: ir.text.slice(start, end),
    styles: sliceStyleSpans(ir.styles, start, end),
    links: sliceLinkSpans(ir.links, start, end),
    ...(annotations.length > 0 ? { annotations } : {}),
  };
}
function markdownToIR(markdown, options = {}) {
  return markdownToIRWithMeta(markdown, options).ir;
}
function markdownToIRWithMeta(markdown, options = {}) {
  const env = {
    listStack: [],
    assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders === true,
    assistantTranscriptRolePreserveLinks: options.assistantTranscriptRoleHeaders === true,
  };
  const tokens = createMarkdownIt(options).parse(markdown ?? "", env);
  const tableMode = options.tableMode ?? "off";
  const state = {
    text: "",
    styles: [],
    openStyles: [],
    links: [],
    linkStack: [],
    annotations: [],
    env,
    headingStyle: options.headingStyle ?? "none",
    blockquotePrefix: options.blockquotePrefix ?? "",
    enableSpoilers: options.enableSpoilers ?? false,
    tableMode,
    table: null,
    hasTables: false,
    collectedTables: [],
    horizontalRuleText: options.horizontalRuleText ?? "───",
    preserveSourceBlockSpacing: options.preserveSourceBlockSpacing ?? false,
    headingLineEnd: void 0,
  };
  renderTokens(tokens, state);
  closeRemainingStyles(state);
  const trimmedLength = state.text.trimEnd().length;
  let codeBlockEnd = 0;
  for (const span of state.styles) {
    if (span.style !== "code_block") continue;
    if (span.end > codeBlockEnd) codeBlockEnd = span.end;
  }
  const finalLength = Math.max(trimmedLength, codeBlockEnd);
  const finalText =
    finalLength === state.text.length ? state.text : state.text.slice(0, finalLength);
  const annotations = mergeAnnotationSpans(clampAnnotationSpans(state.annotations, finalLength));
  return {
    ir: {
      text: finalText,
      styles: mergeStyleSpans(clampStyleSpans(state.styles, finalLength)),
      links: clampLinkSpans(state.links, finalLength),
      ...(annotations.length > 0 ? { annotations } : {}),
    },
    hasTables: state.hasTables,
    tables: state.collectedTables.map((table) =>
      Object.assign({}, table, {
        placeholderOffset: Math.min(table.placeholderOffset, finalLength),
      }),
    ),
  };
}
function chunkMarkdownIR(ir, limit) {
  if (!ir.text) return [];
  if (limit <= 0 || ir.text.length <= limit) return [ir];
  const chunks = chunkText(ir.text, limit);
  const results = [];
  let cursor = 0;
  chunks.forEach((chunk, index) => {
    if (!chunk) return;
    if (index > 0) while (cursor < ir.text.length && /\s/.test(ir.text[cursor] ?? "")) cursor += 1;
    const start = cursor;
    const end = Math.min(ir.text.length, start + chunk.length);
    const annotations = sliceAnnotationSpans(ir.annotations ?? [], start, end);
    results.push({
      text: chunk,
      styles: sliceStyleSpans(ir.styles, start, end),
      links: sliceLinkSpans(ir.links, start, end),
      ...(annotations.length > 0 ? { annotations } : {}),
    });
    cursor = end;
  });
  return results;
}
//#endregion
//#region packages/markdown-core/src/render.ts
const STYLE_RANK = new Map(
  [
    "blockquote",
    "code_block",
    "code",
    "heading_1",
    "heading_2",
    "heading_3",
    "heading_4",
    "heading_5",
    "heading_6",
    "bold",
    "italic",
    "strikethrough",
    "spoiler",
  ].map((style, index) => [style, index]),
);
const STRUCTURAL_STYLES = /* @__PURE__ */ new Set([
  "blockquote",
  "heading_1",
  "heading_2",
  "heading_3",
  "heading_4",
  "heading_5",
  "heading_6",
]);
function sortStyleSpans(spans) {
  return [...spans].toSorted((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return b.end - a.end;
    return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
  });
}
function mergeRanges(ranges) {
  const merged = [];
  for (const range of [...ranges].toSorted((a, b) => a.start - b.start || a.end - b.end)) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}
function firstOverlappingRangeIndex(ranges, start) {
  let low = 0;
  let high = ranges.length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    const range = ranges[middle];
    if (range && range.end <= start) low = middle + 1;
    else high = middle;
  }
  return low;
}
function subtractRanges(span, ranges) {
  const firstOverlap = firstOverlappingRangeIndex(ranges, span.start);
  const firstRange = ranges[firstOverlap];
  if (!firstRange || firstRange.start >= span.end) return [span];
  const pieces = [];
  let cursor = span.start;
  for (let index = firstOverlap; index < ranges.length; index += 1) {
    const range = ranges[index];
    if (!range || range.start >= span.end) break;
    const rangeStart = Math.max(span.start, range.start);
    const rangeEnd = Math.min(span.end, range.end);
    if (rangeStart > cursor)
      pieces.push({
        ...span,
        start: cursor,
        end: rangeStart,
      });
    cursor = Math.max(cursor, rangeEnd);
  }
  if (cursor < span.end)
    pieces.push({
      ...span,
      start: cursor,
      end: span.end,
    });
  return pieces;
}
function splitAtBoundaries(span, boundaries) {
  let low = 0;
  let high = boundaries.length;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if ((boundaries[middle] ?? Number.POSITIVE_INFINITY) <= span.start) low = middle + 1;
    else high = middle;
  }
  if ((boundaries[low] ?? Number.POSITIVE_INFINITY) >= span.end) return [span];
  const pieces = [];
  let cursor = span.start;
  for (let index = low; index < boundaries.length; index += 1) {
    const boundary = boundaries[index];
    if (boundary === void 0 || boundary >= span.end) break;
    pieces.push({
      ...span,
      start: cursor,
      end: boundary,
    });
    cursor = boundary;
  }
  pieces.push({
    ...span,
    start: cursor,
    end: span.end,
  });
  return pieces;
}
function sortAnnotationSpans(spans) {
  return [...spans].toSorted((a, b) => a.start - b.start || b.end - a.end);
}
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
function renderMarkdownWithMarkers(ir, options) {
  const text = ir.text ?? "";
  if (!text) return "";
  const styleMarkers = options.styleMarkers;
  const annotationMarkers = options.annotationMarkers ?? {};
  const annotated = sortAnnotationSpans(
    (ir.annotations ?? []).filter((span) => Boolean(annotationMarkers[span.type])),
  );
  const dominantAnnotationRanges = mergeRanges(
    annotated.filter((span) => annotationMarkers[span.type]?.suppressNestedFormatting === true),
  );
  const annotationBoundaries = [
    ...new Set(annotated.flatMap((span) => [span.start, span.end])),
  ].toSorted((a, b) => a - b);
  const styled = sortStyleSpans(
    ir.styles
      .filter((span) => Boolean(styleMarkers[span.style]))
      .flatMap((span) => {
        if (STRUCTURAL_STYLES.has(span.style)) return [span];
        return subtractRanges(span, dominantAnnotationRanges).flatMap((piece) =>
          splitAtBoundaries(piece, annotationBoundaries),
        );
      }),
  );
  const boundaries = /* @__PURE__ */ new Set();
  boundaries.add(0);
  boundaries.add(text.length);
  const startsAt = /* @__PURE__ */ new Map();
  for (const span of styled) {
    if (span.start === span.end) continue;
    boundaries.add(span.start);
    boundaries.add(span.end);
    const bucket = startsAt.get(span.start);
    if (bucket) bucket.push(span);
    else startsAt.set(span.start, [span]);
  }
  for (const spans of startsAt.values())
    spans.sort((a, b) => {
      if (a.end !== b.end) return b.end - a.end;
      return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
    });
  const annotationStarts = /* @__PURE__ */ new Map();
  for (const span of annotated) {
    if (span.start === span.end) continue;
    boundaries.add(span.start);
    boundaries.add(span.end);
    const bucket = annotationStarts.get(span.start);
    if (bucket) bucket.push(span);
    else annotationStarts.set(span.start, [span]);
  }
  const linkStarts = /* @__PURE__ */ new Map();
  if (options.buildLink) {
    const links = ir.links.flatMap((span) =>
      subtractRanges(span, dominantAnnotationRanges).flatMap((piece) =>
        splitAtBoundaries(piece, annotationBoundaries),
      ),
    );
    for (const link of links) {
      if (link.start === link.end) continue;
      const rendered = options.buildLink(link, text);
      if (!rendered) continue;
      boundaries.add(rendered.start);
      boundaries.add(rendered.end);
      const openBucket = linkStarts.get(rendered.start);
      if (openBucket) openBucket.push(rendered);
      else linkStarts.set(rendered.start, [rendered]);
    }
  }
  const points = [...boundaries].toSorted((a, b) => a - b);
  const stack = [];
  let out = "";
  for (const [i, pos] of points.entries()) {
    while (stack.length && stack[stack.length - 1]?.end === pos) {
      const item = stack.pop();
      if (item) out += item.close;
    }
    const openingItems = [];
    const openingAnnotations = annotationStarts.get(pos);
    if (openingAnnotations)
      for (const [index, span] of openingAnnotations.entries()) {
        const marker = annotationMarkers[span.type];
        if (!marker) continue;
        openingItems.push({
          end: span.end,
          open: typeof marker.open === "function" ? marker.open(span) : marker.open,
          close: marker.close,
          kind: "annotation",
          index,
        });
      }
    const openingLinks = linkStarts.get(pos);
    if (openingLinks && openingLinks.length > 0)
      for (const [index, link] of openingLinks.entries())
        openingItems.push({
          end: link.end,
          open: link.open,
          close: link.close,
          kind: "link",
          index,
        });
    const openingStyles = startsAt.get(pos);
    if (openingStyles)
      for (const [index, span] of openingStyles.entries()) {
        const marker = styleMarkers[span.style];
        if (!marker) continue;
        openingItems.push({
          end: span.end,
          open: typeof marker.open === "function" ? marker.open(span) : marker.open,
          close: marker.close,
          kind: "style",
          style: span.style,
          index,
        });
      }
    if (openingItems.length > 0) {
      openingItems.sort((a, b) => {
        if (a.end !== b.end) return b.end - a.end;
        const aStructural = a.kind === "style" && STRUCTURAL_STYLES.has(a.style);
        const bStructural = b.kind === "style" && STRUCTURAL_STYLES.has(b.style);
        if (aStructural !== bStructural || a.kind !== b.kind) {
          const kindRank = {
            annotation: 0,
            link: 1,
            style: 2,
          };
          return (aStructural ? -1 : kindRank[a.kind]) - (bStructural ? -1 : kindRank[b.kind]);
        }
        if (a.kind === "style" && b.kind === "style")
          return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
        return a.index - b.index;
      });
      for (const item of openingItems) {
        out += item.open;
        stack.push({
          close: item.close,
          end: item.end,
        });
      }
    }
    const next = points.at(i + 1);
    if (next === void 0) break;
    if (next > pos) out += options.escapeText(text.slice(pos, next));
  }
  return out;
}
//#endregion
//#region packages/markdown-core/src/tables.ts
const MARKDOWN_STYLE_MARKERS = {
  bold: {
    open: "**",
    close: "**",
  },
  italic: {
    open: "_",
    close: "_",
  },
  strikethrough: {
    open: "~~",
    close: "~~",
  },
  code: {
    open: "`",
    close: "`",
  },
  code_block: {
    open: "```\n",
    close: "```",
  },
};
/** Converts markdown tables into the configured plaintext/code rendering mode. */
function convertMarkdownTables(markdown, mode) {
  if (!markdown || mode === "off") return markdown;
  const { ir, hasTables } = markdownToIRWithMeta(markdown, {
    linkify: false,
    autolink: false,
    headingStyle: "none",
    blockquotePrefix: "",
    tableMode: mode === "block" ? "code" : mode,
  });
  if (!hasTables) return markdown;
  return renderMarkdownWithMarkers(ir, {
    styleMarkers: MARKDOWN_STYLE_MARKERS,
    escapeText: (text) => text,
    buildLink: (link, text) => {
      const href = link.href.trim();
      if (!href) return null;
      if (!text.slice(link.start, link.end)) return null;
      return {
        start: link.start,
        end: link.end,
        open: "[",
        close: `](${href})`,
      };
    },
  });
}
//#endregion
export {
  markdownToIRWithMeta as a,
  mergeAnnotationSpans as c,
  chunkTextRanges as d,
  markdownToIR as i,
  findAssistantTranscriptRoleHeaderSpans as l,
  renderMarkdownWithMarkers as n,
  sliceMarkdownIR as o,
  chunkMarkdownIR as r,
  annotateAssistantTranscriptRoleMessageBoundary as s,
  convertMarkdownTables as t,
  tokenizeHtmlTags as u,
};
