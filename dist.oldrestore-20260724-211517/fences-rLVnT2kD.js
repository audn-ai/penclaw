//#region packages/markdown-core/src/fences.ts
/** Scans fenced-code spans incrementally so chunking can carry an open fence forward. */
function scanFenceSpans(buffer, state) {
  const spans = [];
  const startsAtLineStart = state?.atLineStart ?? true;
  let open = state?.open
    ? {
        ...state.open,
        start: 0,
      }
    : void 0;
  let offset = 0;
  while (offset <= buffer.length) {
    const nextNewline = buffer.indexOf("\n", offset);
    const lineEnd = nextNewline === -1 ? buffer.length : nextNewline;
    const line = buffer.slice(offset, lineEnd).replace(/\r$/, "");
    const match = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (match && (offset > 0 || startsAtLineStart)) {
      const [, indent, marker, trailing] = match;
      if (indent === void 0 || marker === void 0 || trailing === void 0) {
        if (nextNewline === -1) break;
        offset = nextNewline + 1;
        continue;
      }
      const markerChar = marker.charAt(0);
      const markerLen = marker.length;
      if (!open)
        open = {
          start: offset,
          markerChar,
          markerLen,
          openLine: line,
          marker,
          indent,
        };
      else if (
        open.markerChar === markerChar &&
        markerLen >= open.markerLen &&
        /^[ \t]*$/.test(trailing)
      ) {
        const end = lineEnd;
        spans.push({
          start: open.start,
          end,
          openLine: open.openLine,
          marker: open.marker,
          indent: open.indent,
        });
        open = void 0;
      }
    }
    if (nextNewline === -1) break;
    offset = nextNewline + 1;
  }
  if (open)
    spans.push({
      start: open.start,
      end: buffer.length,
      openLine: open.openLine,
      marker: open.marker,
      indent: open.indent,
    });
  return {
    spans,
    state: {
      atLineStart: buffer.length === 0 ? startsAtLineStart : buffer.endsWith("\n"),
      ...(open
        ? {
            open: {
              markerChar: open.markerChar,
              markerLen: open.markerLen,
              openLine: open.openLine,
              marker: open.marker,
              indent: open.indent,
            },
          }
        : {}),
    },
  };
}
/** Parses all fenced-code spans in a complete markdown buffer. */
function parseFenceSpans(buffer) {
  return scanFenceSpans(buffer).spans;
}
/** Looks up the fence containing an offset; spans must be sorted by start offset. */
function findFenceSpanAt(spans, index) {
  let low = 0;
  let high = spans.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const span = spans[mid];
    if (!span) break;
    if (index <= span.start) {
      high = mid - 1;
      continue;
    }
    if (index >= span.end) {
      low = mid + 1;
      continue;
    }
    return span;
  }
}
/** True when a chunk boundary would not split a fenced-code block. */
function isSafeFenceBreak(spans, index) {
  return !findFenceSpanAt(spans, index);
}
//#endregion
export { scanFenceSpans as i, isSafeFenceBreak as n, parseFenceSpans as r, findFenceSpanAt as t };
