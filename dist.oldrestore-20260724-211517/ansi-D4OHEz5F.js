//#region packages/terminal-core/src/ansi-sequences.ts
const ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
const ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
const ansiOscAtIndexRegex = new RegExp(
  `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`,
  "y",
);
function matchAnsiOscAt(input, index) {
  ansiOscAtIndexRegex.lastIndex = index;
  return ansiOscAtIndexRegex.exec(input)?.[0];
}
function csiIntroducerLength(input, index) {
  const code = input.charCodeAt(index);
  if (code === 155) return 1;
  return code === 27 && input.charCodeAt(index + 1) === 91 ? 2 : 0;
}
/** Scan one CSI parser pass, retaining independently executed C0 controls. */
function scanAnsiCsiAt(input, index) {
  const introducerLength = csiIntroducerLength(input, index);
  if (introducerLength === 0) return;
  let cursor = index + introducerLength;
  const controls = [];
  let ended = false;
  while (cursor < input.length) {
    const code = input.charCodeAt(cursor);
    if (code === 24 || code === 26) {
      cursor += 1;
      ended = true;
      break;
    }
    if (code === 27 || code === 155) {
      ended = true;
      break;
    }
    if (code <= 31 || code === 127) {
      controls.push(input.charAt(cursor));
      cursor += 1;
      continue;
    }
    if (code >= 32 && code <= 63) {
      cursor += 1;
      continue;
    }
    if (code >= 64 && code <= 126) cursor += 1;
    ended = true;
    break;
  }
  return {
    controls,
    ended,
    value: input.slice(index, cursor),
  };
}
function splitAnsiSegments(input) {
  const segments = [];
  let position = 0;
  let index = 0;
  while (index < input.length) {
    const code = input.charCodeAt(index);
    if (code !== 27 && code !== 155 && code !== 157) {
      index += 1;
      continue;
    }
    const osc = matchAnsiOscAt(input, index);
    const csi = osc ? void 0 : scanAnsiCsiAt(input, index);
    const value = osc ?? csi?.value;
    if (!value) {
      index += 1;
      continue;
    }
    if (index > position)
      segments.push({
        kind: "text",
        value: input.slice(position, index),
      });
    segments.push({
      controls: csi?.controls ?? [],
      kind: "ansi",
      value,
    });
    index += value.length;
    position = index;
  }
  if (position < input.length)
    segments.push({
      kind: "text",
      value: input.slice(position),
    });
  return segments;
}
const ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX = new RegExp(
  `${`${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`}|[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`,
  "y",
);
const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(void 0, { granularity: "grapheme" })
    : null;
function hasAnsiIntroducer(input) {
  return input.includes("\x1B") || input.includes("") || input.includes("");
}
/**
 * Strip ANSI against original input positions so one removal cannot synthesize
 * a second sequence. C0 controls execute without ending CSI, CAN/SUB cancel it,
 * and ESC restarts escape parsing.
 */
function stripAnsiInternal(input, options) {
  const output = [];
  let copyStart = 0;
  let index = 0;
  while (index < input.length) {
    const introducerCode = input.charCodeAt(index);
    if (introducerCode !== 27 && introducerCode !== 155 && introducerCode !== 157) {
      index += 1;
      continue;
    }
    const osc = matchAnsiOscAt(input, index);
    if (osc) {
      output.push(input.slice(copyStart, index));
      index += osc.length;
      copyStart = index;
      continue;
    }
    const csi = scanAnsiCsiAt(input, index);
    if (!csi) {
      ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
      const compatibilityMatch = options.compatibilityGrammar
        ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input)
        : null;
      if (compatibilityMatch) {
        output.push(input.slice(copyStart, index));
        index += compatibilityMatch[0].length;
        copyStart = index;
        continue;
      }
      index += 1;
      continue;
    }
    ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.lastIndex = index;
    const compatibilityMatch = options.compatibilityGrammar
      ? ANSI_COMPAT_SEQUENCE_AT_INDEX_REGEX.exec(input)
      : null;
    if (!csi.ended && options.preserveIncompleteCsi) break;
    let cursor = index + csi.value.length;
    const canonicalLength = csi.value.length;
    if (
      csi.controls.length === 0 &&
      compatibilityMatch &&
      compatibilityMatch[0].length > canonicalLength
    )
      cursor = index + compatibilityMatch[0].length;
    output.push(input.slice(copyStart, index), ...csi.controls);
    index = cursor;
    copyStart = cursor;
  }
  output.push(input.slice(copyStart));
  return output.join("");
}
function stripAnsi(input) {
  if (!hasAnsiIntroducer(input)) return input;
  return stripAnsiInternal(input, { compatibilityGrammar: false });
}
function stripAnsiSequences(input) {
  if (typeof input !== "string")
    throw new TypeError(`Expected a \`string\`, got \`${typeof input}\``);
  if (!hasAnsiIntroducer(input)) return input;
  return stripAnsiInternal(input, { compatibilityGrammar: true });
}
/** Preserve pending CSI visibly because an output chunk boundary is not true EOF. */
function stripAnsiForStreamChunk(input, options) {
  if (!hasAnsiIntroducer(input)) return input;
  return stripAnsiInternal(input, {
    compatibilityGrammar: options?.compatibilityGrammar === true,
    preserveIncompleteCsi: true,
  });
}
function splitGraphemes(input) {
  if (!input) return [];
  if (!graphemeSegmenter) return Array.from(input);
  try {
    return Array.from(graphemeSegmenter.segment(input), (segment) => segment.segment);
  } catch {
    return Array.from(input);
  }
}
/**
 * Sanitize a value for safe interpolation into log messages.
 * Strips ANSI escape sequences, C0/C1 control characters, and DEL to
 * prevent log forging / terminal escape injection (CWE-117).
 */
function sanitizeForLog(v) {
  const controlCharsRegex = new RegExp(
    `[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}${String.fromCharCode(128)}-${String.fromCharCode(159)}]`,
    "g",
  );
  return stripAnsi(v).replace(controlCharsRegex, "");
}
function isZeroWidthCodePoint(codePoint) {
  return (
    (codePoint <= 31 && codePoint !== 9) ||
    (codePoint >= 127 && codePoint <= 159) ||
    (codePoint >= 768 && codePoint <= 879) ||
    (codePoint >= 6832 && codePoint <= 6911) ||
    (codePoint >= 7616 && codePoint <= 7679) ||
    (codePoint >= 8400 && codePoint <= 8447) ||
    (codePoint >= 65056 && codePoint <= 65071) ||
    (codePoint >= 65024 && codePoint <= 65039) ||
    codePoint === 8205
  );
}
function isFullWidthCodePoint(codePoint) {
  if (codePoint < 4352) return false;
  return (
    codePoint <= 4447 ||
    codePoint === 9001 ||
    codePoint === 9002 ||
    (codePoint >= 11904 && codePoint <= 12871 && codePoint !== 12351) ||
    (codePoint >= 12880 && codePoint <= 19903) ||
    (codePoint >= 19968 && codePoint <= 42182) ||
    (codePoint >= 43360 && codePoint <= 43388) ||
    (codePoint >= 44032 && codePoint <= 55203) ||
    (codePoint >= 63744 && codePoint <= 64255) ||
    (codePoint >= 65040 && codePoint <= 65049) ||
    (codePoint >= 65072 && codePoint <= 65131) ||
    (codePoint >= 65281 && codePoint <= 65376) ||
    (codePoint >= 65504 && codePoint <= 65510) ||
    (codePoint >= 110576 && codePoint <= 110579) ||
    (codePoint >= 110581 && codePoint <= 110587) ||
    (codePoint >= 110589 && codePoint <= 110590) ||
    (codePoint >= 110592 && codePoint <= 111359) ||
    (codePoint >= 127488 && codePoint <= 127569) ||
    (codePoint >= 131072 && codePoint <= 262141)
  );
}
const rgiEmojiPattern = /* @__PURE__ */ new RegExp("^\\p{RGI_Emoji}$", "v");
const emojiPresentationPattern = /\p{Emoji_Presentation}/u;
const regionalIndicatorPattern = /\p{Regional_Indicator}/u;
const unqualifiedKeycapPattern = /^[#*0-9]\u20E3$/u;
const extendedPictographicPattern = /\p{Extended_Pictographic}/gu;
function isWideEmojiGrapheme(grapheme) {
  const isRgiEmoji = rgiEmojiPattern.test(grapheme);
  if (regionalIndicatorPattern.test(grapheme)) return isRgiEmoji;
  if (
    emojiPresentationPattern.test(grapheme) ||
    isRgiEmoji ||
    unqualifiedKeycapPattern.test(grapheme)
  )
    return true;
  return grapheme.includes("‍") && (grapheme.match(extendedPictographicPattern)?.length ?? 0) >= 2;
}
function graphemeWidth(grapheme) {
  if (!grapheme) return 0;
  if (isWideEmojiGrapheme(grapheme)) return 2;
  let sawPrintable = false;
  for (const char of grapheme) {
    const codePoint = char.codePointAt(0);
    if (codePoint == null) continue;
    if (isZeroWidthCodePoint(codePoint)) continue;
    if (isFullWidthCodePoint(codePoint)) return 2;
    sawPrintable = true;
  }
  return sawPrintable ? 1 : 0;
}
function visibleWidth(input) {
  return splitGraphemes(stripAnsi(input)).reduce(
    (sum, grapheme) => sum + graphemeWidth(grapheme),
    0,
  );
}
/**
 * Truncate to at most `maxWidth` visible columns, dropping whole grapheme
 * clusters that would overflow while preserving zero-width ANSI sequences
 * verbatim. Independently executed controls inside CSI count toward the budget
 * while the containing sequence stays atomic. A single wide grapheme that
 * cannot fit is dropped whole, so `visibleWidth(result) <= maxWidth`.
 */
function truncateToVisibleWidth(input, maxWidth) {
  if (maxWidth <= 0) return "";
  if (visibleWidth(input) <= maxWidth) return input;
  let out = "";
  let used = 0;
  let budgetSpent = false;
  const appendVisible = (segment) => {
    if (budgetSpent) return;
    for (const grapheme of splitGraphemes(segment)) {
      const width = graphemeWidth(grapheme);
      if (used + width > maxWidth) {
        budgetSpent = true;
        return;
      }
      out += grapheme;
      used += width;
    }
  };
  for (const segment of splitAnsiSegments(input))
    if (segment.kind === "ansi") {
      const widthControls = segment.controls.filter((control) => graphemeWidth(control) > 0);
      const controlWidth = widthControls.reduce((sum, control) => sum + graphemeWidth(control), 0);
      if (!budgetSpent && used + controlWidth <= maxWidth) {
        out += segment.value;
        used += controlWidth;
      } else if (controlWidth > 0) {
        out += widthControls.reduce(
          (value, control) => value.replaceAll(control, ""),
          segment.value,
        );
        budgetSpent = true;
      } else out += segment.value;
    } else appendVisible(segment.value);
  return out;
}
//#endregion
export {
  stripAnsiSequences as a,
  splitAnsiSegments as c,
  stripAnsiForStreamChunk as i,
  splitGraphemes as n,
  truncateToVisibleWidth as o,
  stripAnsi as r,
  visibleWidth as s,
  sanitizeForLog as t,
};
