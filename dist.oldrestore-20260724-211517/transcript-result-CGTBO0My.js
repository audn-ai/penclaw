import { i as normalizeActiveSummary, l as truncateSummary } from "./prompt-CFlUxlid.js";
import { i as extractTextContent } from "./query-DX527y0q.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./types-gz2L16qk.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  c as isUnavailableMemorySearchDebug,
  i as fileTranscriptSource,
  l as resolveTranscriptReadLimits,
  o as hasUnavailableMemoryResultInSessionRecord,
  s as hasUsableMemoryResultInSessionRecord,
  u as streamActiveMemoryTranscriptRecords,
} from "./transcript-Dzo9636l.js";
import { i as readMergedActiveMemoryTranscriptState } from "./transcript-watch-BDDL56fg.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/active-memory/transcript-result.ts
let timeoutPartialDataGraceMs = 500;
function readMemoryToolResultEvidence(params) {
  const result = asOptionalRecord(params.result);
  const rawContent = result?.content;
  const textContent =
    normalizeOptionalString(result?.detailedContent) ??
    (typeof rawContent === "string" ? normalizeOptionalString(rawContent) : void 0);
  const record = {
    message: {
      role: "toolResult",
      toolName: params.toolName,
      isError: params.isError,
      content: Array.isArray(rawContent)
        ? rawContent
        : textContent
          ? [
              {
                type: "text",
                text: textContent,
              },
            ]
          : [],
      details: result?.details,
    },
  };
  return {
    hasUsableMemoryResult: hasUsableMemoryResultInSessionRecord(record, params.toolsAllow),
    hasUnavailableMemorySearchResult: hasUnavailableMemoryResultInSessionRecord(
      record,
      params.toolsAllow,
    ),
  };
}
function extractAssistantTextFromSessionRecord(value) {
  const record = asOptionalRecord(value);
  if (!record) return "";
  const nestedMessage = asOptionalRecord(record.message);
  const topLevelMessage = normalizeOptionalString(record.role) === "assistant" ? record : void 0;
  const message = nestedMessage ?? topLevelMessage;
  if (!message || normalizeOptionalString(message.role) !== "assistant") return "";
  return extractTextContent(message.content).trim();
}
async function readPartialAssistantText(source, limits) {
  if (!source) return null;
  const texts = [];
  const resolvedLimits = resolveTranscriptReadLimits(limits);
  let collectedChars = 0;
  await streamActiveMemoryTranscriptRecords({
    source: typeof source === "string" ? fileTranscriptSource(source) : source,
    limits: resolvedLimits,
    onRecord: (record) => {
      const text = extractAssistantTextFromSessionRecord(record);
      if (text) {
        const separatorChars = texts.length > 0 ? 1 : 0;
        const remaining = resolvedLimits.maxChars - collectedChars - separatorChars;
        if (remaining <= 0) return true;
        const nextText = truncateUtf16Safe(text, remaining);
        if (!nextText) return true;
        texts.push(nextText);
        collectedChars += separatorChars + nextText.length;
        return nextText.length < text.length || collectedChars >= resolvedLimits.maxChars;
      }
      return false;
    },
  });
  return texts.join("\n").trim() || null;
}
async function readPartialAssistantTextFromSources(sources, limits) {
  for (const source of sources) {
    const text = await readPartialAssistantText(source, limits);
    if (text) return text;
  }
  return null;
}
function attachPartialTimeoutData(
  error,
  partialReply,
  searchDebug,
  hasUnavailableMemorySearchResult,
) {
  if (!error || typeof error !== "object") return;
  const target = error;
  if (partialReply) target.activeMemoryPartialReply = partialReply;
  if (searchDebug) target.activeMemorySearchDebug = searchDebug;
  if (hasUnavailableMemorySearchResult) target.activeMemoryUnavailableMemorySearch = true;
}
function readPartialTimeoutData(error) {
  if (!error || typeof error !== "object") return {};
  const source = error;
  return {
    rawReply: normalizeOptionalString(source.activeMemoryPartialReply),
    searchDebug: source.activeMemorySearchDebug,
    hasUnavailableMemorySearchResult: source.activeMemoryUnavailableMemorySearch,
  };
}
async function waitForSubagentPartialTimeoutData(subagentPromise) {
  if (!subagentPromise) return { settled: true };
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve({ settled: false }), timeoutPartialDataGraceMs);
    timeoutId.unref?.();
  });
  try {
    return await Promise.race([
      subagentPromise.then(
        () => ({ settled: true }),
        (error) => ({
          ...readPartialTimeoutData(error),
          settled: true,
        }),
      ),
      timeoutPromise,
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
async function buildTimeoutRecallResult(params) {
  const subagentPartialData = params.rawReply
    ? { settled: true }
    : await waitForSubagentPartialTimeoutData(params.subagentPromise);
  const summary = truncateSummary(
    normalizeActiveSummary(
      params.rawReply ??
        subagentPartialData.rawReply ??
        (await readPartialAssistantTextFromSources(params.transcriptSources)) ??
        "",
    ) ?? "",
    params.maxSummaryChars,
  );
  const transcriptState =
    params.transcriptSources.length > 0
      ? await readMergedActiveMemoryTranscriptState({
          sources: params.transcriptSources,
          toolsAllow: params.toolsAllow,
        })
      : void 0;
  const searchDebug =
    params.searchDebug ?? subagentPartialData.searchDebug ?? transcriptState?.searchDebug;
  if (
    summary.length === 0 ||
    isUnavailableMemorySearchDebug(searchDebug) ||
    !subagentPartialData.settled ||
    params.hasUnavailableMemorySearchResult ||
    subagentPartialData.hasUnavailableMemorySearchResult ||
    transcriptState?.hasUnavailableMemorySearchResult
  )
    return {
      status: "timeout",
      elapsedMs: params.elapsedMs,
      summary: null,
      searchDebug,
    };
  return {
    status: "timeout_partial",
    elapsedMs: params.elapsedMs,
    summary,
    searchDebug,
  };
}
function buildSubagentRecallResult(params) {
  const { rawReply, resultStatus } = params.subagentResult;
  const searchDebug = params.subagentResult.searchDebug ?? params.fallbackSearchDebug;
  const summary = truncateSummary(normalizeActiveSummary(rawReply) ?? "", params.maxSummaryChars);
  const hasUsableMemoryResult =
    params.subagentResult.hasUsableMemoryResult === true ||
    params.fallbackHasUsableMemoryResult === true;
  const hasUnavailableMemorySearchResult =
    params.subagentResult.hasUnavailableMemorySearchResult === true;
  const canUseSummary = hasUsableMemoryResult;
  return summary.length > 0 && canUseSummary
    ? {
        status: "ok",
        elapsedMs: params.elapsedMs,
        rawReply,
        summary,
        searchDebug,
      }
    : resultStatus === "failed"
      ? {
          status: "failed",
          elapsedMs: params.elapsedMs,
          summary: null,
          searchDebug,
        }
      : resultStatus === "unavailable" ||
          isUnavailableMemorySearchDebug(searchDebug) ||
          hasUnavailableMemorySearchResult
        ? {
            status: "unavailable",
            elapsedMs: params.elapsedMs,
            summary: null,
            searchDebug,
          }
        : {
            status: "no_relevant_memory",
            elapsedMs: params.elapsedMs,
            summary: null,
            searchDebug,
          };
}
function resetActiveMemoryTranscriptForTests() {
  timeoutPartialDataGraceMs = 500;
}
function setTimeoutPartialDataGraceMsForTests(value) {
  timeoutPartialDataGraceMs = Math.max(0, Math.floor(value));
}
//#endregion
export {
  readPartialAssistantText as a,
  resetActiveMemoryTranscriptForTests as c,
  readMemoryToolResultEvidence as i,
  setTimeoutPartialDataGraceMsForTests as l,
  buildSubagentRecallResult as n,
  readPartialAssistantTextFromSources as o,
  buildTimeoutRecallResult as r,
  readPartialTimeoutData as s,
  attachPartialTimeoutData as t,
};
