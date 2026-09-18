//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
  return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Moves a chunk boundary away from the middle of a UTF-16 surrogate pair. */
function avoidTrailingHighSurrogateBreak(text, start, end) {
  if (
    end <= start ||
    end >= text.length ||
    !isHighSurrogate(text.charCodeAt(end - 1)) ||
    !isLowSurrogate(text.charCodeAt(end))
  )
    return end;
  const adjusted = end - 1;
  return adjusted > start ? adjusted : end + 1;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
  const len = input.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to <= from) return "";
  if (from > 0 && from < len) {
    if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1)))
      from += 1;
  }
  if (to > 0 && to < len) {
    if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
  }
  return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) return input;
  return sliceUtf16Safe(input, 0, limit);
}
//#endregion
export { sliceUtf16Safe as n, truncateUtf16Safe as r, avoidTrailingHighSurrogateBreak as t };
