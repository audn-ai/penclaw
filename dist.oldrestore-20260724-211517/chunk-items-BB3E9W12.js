import {
  c as mergeAnnotationSpans,
  i as markdownToIR,
  l as findAssistantTranscriptRoleHeaderSpans,
  o as sliceMarkdownIR,
  r as chunkMarkdownIR,
  s as annotateAssistantTranscriptRoleMessageBoundary,
} from "./tables-YoFSvuf8.js";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-lH-m0h6-.js";
//#region packages/markdown-core/src/render-aware-chunking.ts
function resolveIntegerOption(value, fallback, opts) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(opts.min, Math.trunc(value));
}
function prepareChunkForMessageBoundary(options, chunk) {
  return options.assistantTranscriptRoleMessageBoundaries === true
    ? annotateAssistantTranscriptRoleMessageBoundary(chunk)
    : chunk;
}
/** Chunks Markdown IR by rendered size while preserving styles, links, and whitespace. */
function renderMarkdownIRChunksWithinLimit(options) {
  if (!options.ir.text) return [];
  if (options.limit === Number.POSITIVE_INFINITY) {
    const source = prepareChunkForMessageBoundary(options, options.ir);
    return [
      {
        source,
        rendered: options.renderChunk(source),
      },
    ];
  }
  const normalizedLimit = resolveIntegerOption(options.limit, 1, { min: 1 });
  const renderResolver = {
    measureRendered: options.measureRendered,
    renderChunk: (chunk) => options.renderChunk(prepareChunkForMessageBoundary(options, chunk)),
  };
  const pending = chunkMarkdownIR(options.ir, normalizedLimit).toReversed();
  const finalized = [];
  while (pending.length > 0) {
    const chunk = pending.pop();
    if (!chunk) continue;
    const rendered = renderResolver.renderChunk(chunk);
    if (renderResolver.measureRendered(rendered) <= normalizedLimit || chunk.text.length <= 1) {
      finalized.push(chunk);
      continue;
    }
    const split = splitMarkdownIRByRenderedLimit(chunk, normalizedLimit, renderResolver);
    if (split.length <= 1) {
      finalized.push(chunk);
      continue;
    }
    for (let index = split.length - 1; index >= 0; index -= 1) {
      const next = split[index];
      if (next) pending.push(next);
    }
  }
  return coalesceWhitespaceOnlyMarkdownIRChunks(finalized, normalizedLimit, renderResolver).map(
    (chunk) => {
      const source = prepareChunkForMessageBoundary(options, chunk);
      return {
        source,
        rendered: options.renderChunk(source),
      };
    },
  );
}
function splitMarkdownIRByRenderedLimit(chunk, renderedLimit, options) {
  const currentTextLength = chunk.text.length;
  if (currentTextLength <= 1) return [chunk];
  const splitLimit = findLargestChunkTextLengthWithinRenderedLimit(chunk, renderedLimit, options);
  if (splitLimit <= 0) return [chunk];
  const split = splitMarkdownIRPreserveWhitespace(chunk, splitLimit);
  const firstChunk = split[0];
  if (firstChunk && options.measureRendered(options.renderChunk(firstChunk)) <= renderedLimit)
    return split;
  return [
    sliceMarkdownIR(chunk, 0, splitLimit),
    sliceMarkdownIR(chunk, splitLimit, currentTextLength),
  ];
}
function findLargestChunkTextLengthWithinRenderedLimit(chunk, renderedLimit, options) {
  const currentTextLength = chunk.text.length;
  if (currentTextLength <= 1) return currentTextLength;
  for (let candidateLength = currentTextLength - 1; candidateLength >= 1; candidateLength -= 1) {
    const safeCandidateLength = avoidTrailingHighSurrogateBreak(chunk.text, 0, candidateLength);
    const candidate = sliceMarkdownIR(chunk, 0, safeCandidateLength);
    const rendered = options.renderChunk(candidate);
    if (options.measureRendered(rendered) <= renderedLimit) return safeCandidateLength;
  }
  return 0;
}
function findMarkdownIRPreservedSplitIndex(text, start, limit) {
  const maxEnd = Math.min(text.length, start + limit);
  if (maxEnd >= text.length) return text.length;
  let lastOutsideParenNewlineBreak = -1;
  let lastOutsideParenWhitespaceBreak = -1;
  let lastOutsideParenWhitespaceRunStart = -1;
  let lastAnyNewlineBreak = -1;
  let lastAnyWhitespaceBreak = -1;
  let lastAnyWhitespaceRunStart = -1;
  let parenDepth = 0;
  let sawNonWhitespace = false;
  for (let index = start; index < maxEnd; index += 1) {
    const char = text.charAt(index);
    if (char === "(") {
      sawNonWhitespace = true;
      parenDepth += 1;
      continue;
    }
    if (char === ")" && parenDepth > 0) {
      sawNonWhitespace = true;
      parenDepth -= 1;
      continue;
    }
    if (!/\s/.test(char)) {
      sawNonWhitespace = true;
      continue;
    }
    if (!sawNonWhitespace) continue;
    if (char === "\n") {
      lastAnyNewlineBreak = index + 1;
      if (parenDepth === 0) lastOutsideParenNewlineBreak = index + 1;
      continue;
    }
    const whitespaceRunStart =
      index === start || !/\s/.test(text[index - 1] ?? "") ? index : lastAnyWhitespaceRunStart;
    lastAnyWhitespaceBreak = index + 1;
    lastAnyWhitespaceRunStart = whitespaceRunStart;
    if (parenDepth === 0) {
      lastOutsideParenWhitespaceBreak = index + 1;
      lastOutsideParenWhitespaceRunStart = whitespaceRunStart;
    }
  }
  const resolveWhitespaceBreak = (breakIndex, runStart) => {
    if (breakIndex <= start) return breakIndex;
    if (runStart <= start) return breakIndex;
    return /\s/.test(text[breakIndex] ?? "") ? runStart : breakIndex;
  };
  if (lastOutsideParenNewlineBreak > start) return lastOutsideParenNewlineBreak;
  if (lastOutsideParenWhitespaceBreak > start)
    return resolveWhitespaceBreak(
      lastOutsideParenWhitespaceBreak,
      lastOutsideParenWhitespaceRunStart,
    );
  if (lastAnyNewlineBreak > start) return lastAnyNewlineBreak;
  if (lastAnyWhitespaceBreak > start)
    return resolveWhitespaceBreak(lastAnyWhitespaceBreak, lastAnyWhitespaceRunStart);
  return avoidTrailingHighSurrogateBreak(text, start, maxEnd);
}
function splitMarkdownIRPreserveWhitespace(ir, limit) {
  if (!ir.text) return [];
  const normalizedLimit = resolveIntegerOption(limit, 1, { min: 1 });
  if (normalizedLimit <= 0 || ir.text.length <= normalizedLimit) return [ir];
  const chunks = [];
  let cursor = 0;
  while (cursor < ir.text.length) {
    const end = findMarkdownIRPreservedSplitIndex(ir.text, cursor, normalizedLimit);
    chunks.push(sliceMarkdownIR(ir, cursor, end));
    cursor = end;
  }
  return chunks;
}
function mergeAdjacentStyleSpans(styles) {
  const merged = [];
  for (const span of styles) {
    const last = merged.at(-1);
    if (
      last &&
      last.style === span.style &&
      last.language === span.language &&
      span.start <= last.end
    ) {
      last.end = Math.max(last.end, span.end);
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function mergeAdjacentLinkSpans(links) {
  const merged = [];
  for (const link of links) {
    const last = merged.at(-1);
    if (last && last.href === link.href && link.start <= last.end) {
      last.end = Math.max(last.end, link.end);
      continue;
    }
    merged.push({ ...link });
  }
  return merged;
}
function mergeMarkdownIRChunks(left, right) {
  const offset = left.text.length;
  const shiftedAnnotations = [];
  for (const annotation of right.annotations ?? [])
    shiftedAnnotations.push({
      ...annotation,
      start: annotation.start + offset,
      end: annotation.end + offset,
    });
  const shiftedStyles = [];
  for (const span of right.styles)
    shiftedStyles.push({
      ...span,
      start: span.start + offset,
      end: span.end + offset,
    });
  const shiftedLinks = [];
  for (const link of right.links)
    shiftedLinks.push({
      ...link,
      start: link.start + offset,
      end: link.end + offset,
    });
  const annotations = mergeAnnotationSpans([...(left.annotations ?? []), ...shiftedAnnotations]);
  return {
    text: left.text + right.text,
    styles: mergeAdjacentStyleSpans([...left.styles, ...shiftedStyles]),
    links: mergeAdjacentLinkSpans([...left.links, ...shiftedLinks]),
    ...(annotations.length > 0 ? { annotations } : {}),
  };
}
function coalesceWhitespaceOnlyMarkdownIRChunks(chunks, renderedLimit, options) {
  const coalesced = [];
  let index = 0;
  while (index < chunks.length) {
    const chunk = chunks[index];
    if (!chunk) {
      index += 1;
      continue;
    }
    if (chunk.text.trim().length > 0) {
      coalesced.push(chunk);
      index += 1;
      continue;
    }
    const prev = coalesced.at(-1);
    const next = chunks[index + 1];
    const chunkLength = chunk.text.length;
    const canMerge = (candidate) =>
      options.measureRendered(options.renderChunk(candidate)) <= renderedLimit;
    if (prev) {
      const mergedPrev = mergeMarkdownIRChunks(prev, chunk);
      if (canMerge(mergedPrev)) {
        coalesced[coalesced.length - 1] = mergedPrev;
        index += 1;
        continue;
      }
    }
    if (next) {
      const mergedNext = mergeMarkdownIRChunks(chunk, next);
      if (canMerge(mergedNext)) {
        chunks[index + 1] = mergedNext;
        index += 1;
        continue;
      }
    }
    if (prev && next)
      for (let prefixLength = chunkLength - 1; prefixLength >= 1; prefixLength -= 1) {
        const prefix = sliceMarkdownIR(chunk, 0, prefixLength);
        const suffix = sliceMarkdownIR(chunk, prefixLength, chunkLength);
        const mergedPrev = mergeMarkdownIRChunks(prev, prefix);
        const mergedNext = mergeMarkdownIRChunks(suffix, next);
        if (canMerge(mergedPrev) && canMerge(mergedNext)) {
          coalesced[coalesced.length - 1] = mergedPrev;
          chunks[index + 1] = mergedNext;
          break;
        }
      }
    index += 1;
  }
  return coalesced;
}
//#endregion
//#region src/shared/text/strip-markdown.ts
function collectLinkInsertions(ir, options) {
  const insertions = [];
  if ((options.linkStyle ?? "label-and-url") === "label-and-url")
    for (const link of ir.links) {
      const href = link.href.trim();
      const label = ir.text.slice(link.start, link.end).trim();
      const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
      if (href && label && label !== href && label !== comparableHref)
        insertions.push({
          position: link.end,
          text: ` (${href})`,
        });
    }
  return insertions;
}
function collectAssistantTranscriptRoleInsertions(text, options) {
  if (options.assistantTranscriptRoleHeaders !== true) return [];
  const prefix = options.assistantTranscriptRolePrefix ?? "[assistant-authored transcript] ";
  if (!prefix) return [];
  return findAssistantTranscriptRoleHeaderSpans(text).map((span) => ({
    position: span.start,
    text: prefix,
  }));
}
function collectParsedAssistantTranscriptRoleInsertions(ir, options) {
  if (options.assistantTranscriptRoleHeaders !== true) return [];
  const prefix = options.assistantTranscriptRolePrefix ?? "[assistant-authored transcript] ";
  if (!prefix) return [];
  return (ir.annotations ?? [])
    .filter((annotation) => annotation.type === "assistant_transcript_role")
    .map((annotation) => ({
      position: annotation.start,
      text: prefix,
    }));
}
function applyPlainTextInsertions(text, insertions) {
  if (insertions.length === 0) return text;
  const sorted = insertions.toSorted((a, b) => a.position - b.position);
  let output = "";
  let cursor = 0;
  for (const insertion of sorted) {
    const position = Math.max(cursor, Math.min(insertion.position, text.length));
    output += text.slice(cursor, position);
    output += insertion.text;
    cursor = position;
  }
  return output + text.slice(cursor);
}
/** Parse Markdown, then protect role headers exposed by the final plain-text projection. */
function stripMarkdown(text, options = {}) {
  const ir = markdownToIR(text, {
    assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders,
    autolink: false,
    blockquotePrefix: "",
    headingStyle: "none",
    horizontalRuleText: "",
    linkify: false,
    preserveSourceBlockSpacing: true,
    tableMode: "bullets",
  });
  const plainText = applyPlainTextInsertions(ir.text, [
    ...collectLinkInsertions(ir, options),
    ...collectParsedAssistantTranscriptRoleInsertions(ir, options),
  ]).trim();
  return applyPlainTextInsertions(
    plainText,
    collectAssistantTranscriptRoleInsertions(plainText, options),
  ).trim();
}
//#endregion
//#region src/utils/chunk-items.ts
/** Splits items into fixed-size chunks, preserving order and returning one row for non-positive sizes. */
function chunkItems(items, size) {
  if (size <= 0) return [Array.from(items)];
  const rows = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}
//#endregion
export { stripMarkdown as n, renderMarkdownIRChunksWithinLimit as r, chunkItems as t };
