import { _ as isInsideCode, g as findCodeRegions } from "./assistant-visible-text-DV1Yognj.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-Btb1ssgA.js";
import { c as formatReasoningMessage } from "./embedded-agent-utils-Coji3F8W.js";
import {
  D as resolveChannelStreamingSuppressDefaultToolProgressMessages,
  T as resolveChannelStreamingProgressCommentary,
  a as createChannelProgressDraftGate,
  b as resolveChannelProgressDraftMaxLines,
  c as formatChannelProgressDraftText,
  m as normalizeChannelProgressDraftLineIdentity,
  p as mergeChannelProgressDraftLine,
  u as isChannelProgressDraftWorkToolName,
  w as resolveChannelStreamingPreviewToolProgress,
  y as resolveChannelProgressDraftMaxLineChars,
} from "./streaming-D_YE0SPS.js";
//#region src/channels/progress-draft-lines.ts
/**
 * Removes a keyed structured progress line while preserving plain text draft lines.
 * Returns the original array when no line is removed so renderers can use identity as a no-op signal.
 */
function removeChannelProgressDraftLine(lines, id) {
  const lineId = id.trim();
  if (!lineId) return lines;
  const next = lines.filter((line) => typeof line !== "object" || line.id?.trim() !== lineId);
  return next.length === lines.length ? lines : next;
}
//#endregion
//#region src/channels/progress-draft-status-text.ts
const REASONING_PROGRESS_TAG_RE =
  /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/giu;
const REASONING_PROGRESS_TAG_PREFIXES = [
  "think",
  "thinking",
  "thought",
  "antthinking",
  "antml:think",
  "antml:thinking",
  "antml:thought",
  "mm:think",
  "mm:thinking",
  "mm:thought",
].flatMap((name) => [`<${name}`, `</${name}`]);
function normalizeReasoningProgressLine(text) {
  const reasoningText = readReasoningProgressTextOutsideCode(text);
  if (reasoningText === void 0) return "";
  return stripReasoningProgressTagsOutsideCode(reasoningText)
    .replace(
      /^\s*(?:>\s*)?(?:Reasoning:\s*(?:\r?\n|\r)\s*|Thinking\.{0,3}\s*(?:\r?\n|\r)\s*(?:\r?\n|\r)\s*)/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}
function readReasoningProgressTextOutsideCode(text) {
  if (isPartialReasoningProgressTagPrefix(text)) return;
  const codeRegions = findCodeRegions(text);
  let hasTags = false;
  let inReasoning = false;
  let cursor = 0;
  const chunks = [];
  for (const match of text.matchAll(REASONING_PROGRESS_TAG_RE)) {
    const offset = match.index ?? 0;
    if (isInsideCode(offset, codeRegions)) continue;
    hasTags = true;
    if (match[1]) {
      if (inReasoning) chunks.push(text.slice(cursor, offset));
      inReasoning = false;
      cursor = offset + match[0].length;
      continue;
    }
    if (inReasoning) chunks.push(text.slice(cursor, offset));
    inReasoning = true;
    cursor = offset + match[0].length;
  }
  if (!hasTags) return text;
  if (inReasoning) chunks.push(text.slice(cursor));
  return chunks.join("").trim();
}
function isPartialReasoningProgressTagPrefix(text) {
  const normalized = text.trimStart().toLowerCase();
  return (
    normalized.startsWith("<") &&
    !normalized.includes(">") &&
    REASONING_PROGRESS_TAG_PREFIXES.some(
      (prefix) => prefix.startsWith(normalized) || normalized.startsWith(prefix),
    )
  );
}
function stripReasoningProgressTagsOutsideCode(text) {
  const codeRegions = findCodeRegions(text);
  return text.replace(REASONING_PROGRESS_TAG_RE, (match, _closing, offset) =>
    isInsideCode(offset, codeRegions) ? match : "",
  );
}
function normalizeReasoningProgressInput(text) {
  const normalized = normalizeReasoningProgressLine(text);
  return (normalized.match(/^_(.*)_$/u)?.[1] ?? normalized).trim();
}
function formatReasoningProgressDisplayLine(text, maxChars) {
  const formatted = normalizeReasoningProgressLine(
    formatReasoningMessage(normalizeReasoningProgressInput(text)),
  );
  if (!formatted) return "";
  if (Array.from(formatted).length <= maxChars) return formatted;
  const italic = formatted.match(/^_(.*)_$/u);
  if (!italic) return compactReasoningProgressDisplayLine(formatted, maxChars);
  const body = compactReasoningProgressDisplayLine(italic[1] ?? "", Math.max(1, maxChars - 2));
  return body ? `_${body}_` : "";
}
function compactReasoningProgressDisplayLine(text, maxChars) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const chars = Array.from(normalized);
  if (chars.length <= maxChars) return normalized;
  if (maxChars <= 1) return "…";
  const head = chars
    .slice(0, maxChars - 1)
    .join("")
    .trimEnd();
  const boundary = head.search(/\s+\S*$/u);
  if (boundary > Math.floor(maxChars * 0.6)) return `${head.slice(0, boundary).trimEnd()}…`;
  return `${head}…`;
}
function sanitizeProgressStatusText(text) {
  const cleaned = stripInlineDirectiveTagsForDelivery(text).text.trim();
  if (!cleaned || isSilentCommentaryProgressText(cleaned)) return "";
  return cleaned;
}
function normalizeCommentaryProgressText(text) {
  const cleaned = sanitizeProgressStatusText(text);
  if (!cleaned) return "";
  return cleaned
    .split(/\r?\n/u)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((line) => `_${line}_`)
    .join("\n");
}
function isSilentCommentaryProgressText(text) {
  const normalized = text.replace(/^[\s*_`~]+|[\s*_`~]+$/gu, "").trim();
  return /^NO_REPLY$/iu.test(normalized);
}
function mergeReasoningProgressText(current, incoming, options) {
  if (!current) return incoming;
  const normalizedCurrent = normalizeReasoningProgressInput(current);
  const normalizedIncoming = normalizeReasoningProgressInput(incoming);
  if (!normalizedIncoming)
    return shouldAppendEmptyReasoningProgressDelta(current, incoming)
      ? `${current}${incoming}`
      : current;
  if (normalizedIncoming === normalizedCurrent) return current;
  if (
    options?.snapshot === true ||
    isReasoningSnapshotText(incoming) ||
    (normalizedCurrent && normalizedIncoming.startsWith(normalizedCurrent))
  )
    return incoming;
  return `${current}${incoming}`;
}
function isReasoningSnapshotText(text) {
  return /^\s*(?:>\s*)?(?:Reasoning:\s*(?:\r?\n|\r)\s*|Thinking\.{0,3}\s*(?:\r?\n|\r)\s*(?:\r?\n|\r)\s*)/i.test(
    text,
  );
}
function shouldAppendEmptyReasoningProgressDelta(current, incoming) {
  return (
    isPartialReasoningProgressTagPrefix(current) ||
    isPartialReasoningProgressTagPrefix(incoming) ||
    hasReasoningProgressTagOutsideCode(incoming)
  );
}
function hasReasoningProgressTagOutsideCode(text) {
  const codeRegions = findCodeRegions(text);
  for (const match of text.matchAll(REASONING_PROGRESS_TAG_RE))
    if (!isInsideCode(match.index ?? 0, codeRegions)) return true;
  return false;
}
//#endregion
//#region src/channels/progress-draft-compositor.ts
const PROGRESS_STATUS_PREAMBLE_FRESH_MS = 2e4;
/** Creates a stateful compositor for one streaming channel reply. */
function createChannelProgressDraftCompositor(params) {
  const now = params.now ?? Date.now;
  const setTimeoutFn = params.setTimeoutFn ?? setTimeout;
  const clearTimeoutFn = params.clearTimeoutFn ?? clearTimeout;
  const reasoningLinePrefix = params.reasoningLinePrefix ?? "";
  const commentaryLinePrefix = params.commentaryLinePrefix ?? "";
  const commentaryItalics = params.commentaryItalics ?? true;
  const stripLaneItalics = (text) =>
    text
      .split("\n")
      .map((line) => line.replace(/^_(.*)_$/su, "$1"))
      .join("\n");
  const previewToolProgressEnabled =
    params.active && resolveChannelStreamingPreviewToolProgress(params.entry);
  const commentaryProgressEnabled =
    params.active && resolveChannelStreamingProgressCommentary(params.entry);
  const thinkingProgressEnabled =
    params.active && (params.reasoningGate ?? previewToolProgressEnabled);
  const suppressDefaultToolProgressMessages =
    params.active &&
    resolveChannelStreamingSuppressDefaultToolProgressMessages(params.entry, {
      draftStreamActive: true,
      previewToolProgressEnabled,
    });
  let progressSuppressed = false;
  let lines = [];
  let lastRenderedText = "";
  let reasoningRawText = "";
  let lastReasoningLine;
  let preambleText = "";
  let preambleItemId;
  let preambleAt;
  let narrationText = "";
  let finalReplyStarted = false;
  let finalReplyDelivered = false;
  let preambleExpiryTimer;
  const clearPreambleExpiryTimer = () => {
    if (preambleExpiryTimer !== void 0) {
      clearTimeoutFn(preambleExpiryTimer);
      preambleExpiryTimer = void 0;
    }
  };
  const resolveStatusText = () => {
    const preambleIsFresh = preambleAt !== void 0 && now() - preambleAt < 2e4;
    return preambleText && (preambleIsFresh || !narrationText) ? preambleText : narrationText;
  };
  const formatDraftText = (draftLines = lines, options) =>
    formatChannelProgressDraftText({
      entry: params.entry,
      lines: draftLines,
      seed: params.seed,
      formatLine: options?.formatted === false ? void 0 : params.formatLine,
      narration: resolveStatusText() || void 0,
    });
  const clearProgressState = (suppressed) => {
    clearPreambleExpiryTimer();
    progressSuppressed = suppressed;
    lines = [];
    lastRenderedText = "";
    reasoningRawText = "";
    lastReasoningLine = void 0;
    preambleText = "";
    preambleItemId = void 0;
    preambleAt = void 0;
    narrationText = "";
  };
  const render = async (options) => {
    if (!params.active || params.mode !== "progress" || finalReplyStarted || finalReplyDelivered)
      return false;
    const text = formatDraftText();
    if (!text || text === lastRenderedText) return false;
    lastRenderedText = text;
    await params.update(text, {
      ...options,
      lines: [...lines],
    });
    return true;
  };
  const schedulePreambleExpiryRefresh = () => {
    clearPreambleExpiryTimer();
    if (
      !preambleText ||
      !narrationText ||
      preambleAt === void 0 ||
      !gate.hasStarted ||
      finalReplyStarted ||
      finalReplyDelivered
    )
      return;
    const remaining = PROGRESS_STATUS_PREAMBLE_FRESH_MS - (now() - preambleAt);
    if (remaining <= 0) return;
    preambleExpiryTimer = setTimeoutFn(() => {
      preambleExpiryTimer = void 0;
      render().catch((err) => {
        console.warn(`[progress-draft] channel progress status refresh failed: ${String(err)}`);
      });
    }, remaining);
  };
  const gate = createChannelProgressDraftGate({
    onStart: async () => {
      await render({ flush: true });
      schedulePreambleExpiryRefresh();
    },
  });
  const clearLine = async (lineId) => {
    const nextLines = removeChannelProgressDraftLine(lines, lineId);
    if (nextLines === lines) return;
    lines = nextLines;
    if (!gate.hasStarted) return;
    if (formatDraftText()) {
      await render();
      return;
    }
    lastRenderedText = "";
    await params.deleteCurrent?.();
  };
  const noteProgress = async (line, options) => {
    if (!params.active || finalReplyStarted || finalReplyDelivered) return false;
    if (options?.toolName !== void 0 && !isChannelProgressDraftWorkToolName(options.toolName))
      return false;
    if (params.isEmptyLine?.(line)) return false;
    const normalized = normalizeChannelProgressDraftLineIdentity(line);
    if (!normalized || progressSuppressed) return false;
    if (params.mode !== "progress" && !previewToolProgressEnabled) return false;
    const progressLine = typeof line === "object" && line !== void 0 ? line : normalized;
    const shouldStoreLine = previewToolProgressEnabled;
    const nextLines = shouldStoreLine
      ? mergeChannelProgressDraftLine(lines, progressLine, {
          maxLines: resolveChannelProgressDraftMaxLines(params.entry),
        })
      : lines;
    if (shouldStoreLine && nextLines === lines) return false;
    if (shouldStoreLine) {
      reasoningRawText = "";
      lastReasoningLine = void 0;
    }
    if (shouldStoreLine && params.tryNativeUpdate) {
      const text = formatDraftText(nextLines, { formatted: false });
      if (text && (await params.tryNativeUpdate(text))) {
        lines = nextLines;
        lastRenderedText = text;
        return true;
      }
    }
    lines = nextLines;
    if (params.mode !== "progress") {
      if (!shouldStoreLine) return false;
      const text = formatDraftText();
      if (!text || text === lastRenderedText) return false;
      lastRenderedText = text;
      await params.update(text, { lines: [...lines] });
      return true;
    }
    if (options?.startImmediately || params.shouldStartNow?.(line)) {
      const alreadyStarted = gate.hasStarted;
      await gate.startNow();
      if (!gate.hasStarted) return false;
      return alreadyStarted ? await render() : true;
    }
    const alreadyStarted = gate.hasStarted;
    const progressActive = await gate.noteWork();
    if ((alreadyStarted || progressActive) && gate.hasStarted) return await render();
    return false;
  };
  return {
    get previewToolProgressEnabled() {
      return previewToolProgressEnabled;
    },
    get commentaryProgressEnabled() {
      return commentaryProgressEnabled;
    },
    get suppressDefaultToolProgressMessages() {
      return suppressDefaultToolProgressMessages;
    },
    get hasStarted() {
      return gate.hasStarted;
    },
    get isVisible() {
      return gate.hasStarted && !finalReplyStarted && !finalReplyDelivered;
    },
    get hasStatusHeadline() {
      return Boolean(preambleText);
    },
    markFinalReplyStarted() {
      finalReplyStarted = true;
      gate.cancel();
      clearPreambleExpiryTimer();
    },
    markFinalReplyDelivered() {
      finalReplyDelivered = true;
      clearPreambleExpiryTimer();
    },
    beginNewTurn() {
      if (!finalReplyStarted && !finalReplyDelivered) return false;
      finalReplyStarted = false;
      finalReplyDelivered = false;
      gate.reset();
      clearProgressState(false);
      return true;
    },
    reset() {
      clearProgressState(false);
    },
    resetReasoningProgress() {
      reasoningRawText = "";
    },
    suppress() {
      clearProgressState(true);
    },
    cancel() {
      gate.cancel();
      clearPreambleExpiryTimer();
    },
    start() {
      return gate.startNow();
    },
    async noteActivity(options) {
      if (
        !params.active ||
        params.mode !== "progress" ||
        progressSuppressed ||
        finalReplyStarted ||
        finalReplyDelivered
      )
        return false;
      if (options?.startImmediately) {
        await gate.startNow();
        return gate.hasStarted ? await render({ flush: true }) : false;
      }
      const alreadyStarted = gate.hasStarted;
      const progressActive = await gate.noteWork();
      if ((alreadyStarted || progressActive) && gate.hasStarted) return await render();
      return false;
    },
    pushToolProgress: noteProgress,
    async pushPreambleHeadline(text, options) {
      if (!params.active || params.mode !== "progress" || progressSuppressed) return false;
      if (commentaryProgressEnabled) return false;
      if (finalReplyStarted || finalReplyDelivered) return false;
      const itemId = options?.itemId?.trim() || void 0;
      const normalized = sanitizeProgressStatusText(text ?? "")
        .replace(/\s+/g, " ")
        .trim();
      if (!normalized) {
        if (!itemId || itemId !== preambleItemId) return false;
        preambleText = "";
        preambleItemId = void 0;
        preambleAt = void 0;
        clearPreambleExpiryTimer();
        if (!gate.hasStarted) return false;
        const rendered = await render();
        if (rendered || formatDraftText()) return rendered;
        lastRenderedText = "";
        await params.deleteCurrent?.();
        return true;
      }
      const isNewPreambleItem = Boolean(itemId && itemId !== preambleItemId);
      if (isNewPreambleItem) preambleItemId = itemId;
      else if (!itemId) preambleItemId = void 0;
      if (normalized === preambleText && !isNewPreambleItem) return false;
      preambleText = normalized;
      preambleAt = now();
      schedulePreambleExpiryRefresh();
      return gate.hasStarted ? await render() : false;
    },
    async pushNarrationProgress(text) {
      if (!params.active || params.mode !== "progress" || progressSuppressed) return false;
      if (finalReplyStarted || finalReplyDelivered) return false;
      const normalized = text?.replace(/\s+/g, " ").trim() ?? "";
      if (normalized === narrationText) return false;
      if (!normalized) {
        narrationText = "";
        clearPreambleExpiryTimer();
        return await render();
      }
      narrationText = normalized;
      schedulePreambleExpiryRefresh();
      return gate.hasStarted ? await render() : false;
    },
    async pushReasoningProgress(text, options) {
      if (
        !params.active ||
        params.mode !== "progress" ||
        !text ||
        progressSuppressed ||
        finalReplyDelivered ||
        !thinkingProgressEnabled
      )
        return false;
      reasoningRawText = mergeReasoningProgressText(reasoningRawText, text, {
        snapshot: options?.snapshot === true,
      });
      const normalized = normalizeReasoningProgressLine(reasoningRawText);
      if (!normalized) return false;
      const compactLine = formatReasoningProgressDisplayLine(
        normalized,
        resolveChannelProgressDraftMaxLineChars(params.entry),
      );
      if (!compactLine) return false;
      const displayLine = `${reasoningLinePrefix}${compactLine}`;
      const priorIndex = lastReasoningLine === void 0 ? -1 : lines.lastIndexOf(lastReasoningLine);
      if (priorIndex >= 0) {
        lines = [...lines];
        lines[priorIndex] = displayLine;
      } else
        lines = [...lines, displayLine].slice(-resolveChannelProgressDraftMaxLines(params.entry));
      lastReasoningLine = displayLine;
      if ((await gate.noteWork()) && gate.hasStarted) return await render();
      return false;
    },
    async pushCommentaryProgress(text, options) {
      if (!params.active || params.mode !== "progress" || !commentaryProgressEnabled) return false;
      if (finalReplyStarted || finalReplyDelivered) return false;
      const itemId = options?.itemId?.trim();
      if (!text && !itemId) return false;
      const normalized = normalizeCommentaryProgressText(text ?? "");
      const lineId = itemId ? `commentary:${itemId}` : normalized ? `commentary:${normalized}` : "";
      if (!normalized) {
        if (lineId) await clearLine(lineId);
        return false;
      }
      const line = {
        id: lineId,
        text: `${commentaryLinePrefix}${commentaryItalics ? normalized : stripLaneItalics(normalized)}`,
        kind: "item",
        label: "Commentary",
        prefix: false,
      };
      lines = mergeChannelProgressDraftLine(lines, line, {
        maxLines: resolveChannelProgressDraftMaxLines(params.entry),
      });
      const alreadyStarted = gate.hasStarted;
      await gate.startNow();
      if (!gate.hasStarted) return false;
      if (alreadyStarted) await render();
      return true;
    },
  };
}
//#endregion
export {
  createChannelProgressDraftCompositor as n,
  sanitizeProgressStatusText as r,
  PROGRESS_STATUS_PREAMBLE_FRESH_MS as t,
};
