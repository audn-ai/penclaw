import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./types-gz2L16qk.js";
import {
  a as hasTerminalUnavailableMemoryResultInSessionRecord,
  i as fileTranscriptSource,
  n as extractActiveMemorySearchDebugFromSessionRecord,
  o as hasUnavailableMemoryResultInSessionRecord,
  r as extractToolResultNameFromSessionRecord,
  s as hasUsableMemoryResultInSessionRecord,
  u as streamActiveMemoryTranscriptRecords,
} from "./transcript-Dzo9636l.js";
//#region extensions/active-memory/transcript-watch.ts
async function readActiveMemoryTranscriptState(source, limits, toolsAllow) {
  let searchDebug;
  let hasUsableMemoryResult = false;
  let hasUnavailableMemorySearchResult = false;
  await streamActiveMemoryTranscriptRecords({
    source: typeof source === "string" ? fileTranscriptSource(source) : source,
    limits,
    onRecord: (record) => {
      const debug = extractActiveMemorySearchDebugFromSessionRecord(record);
      if (debug) searchDebug = debug;
      hasUnavailableMemorySearchResult ||= hasUnavailableMemoryResultInSessionRecord(
        record,
        toolsAllow,
      );
      hasUsableMemoryResult ||= hasUsableMemoryResultInSessionRecord(record, toolsAllow);
    },
  });
  return {
    searchDebug,
    hasUsableMemoryResult,
    hasUnavailableMemorySearchResult,
  };
}
async function readActiveMemorySearchDebug(source, limits) {
  return (await readActiveMemoryTranscriptState(source, limits)).searchDebug;
}
async function readMergedActiveMemoryTranscriptState(params) {
  let searchDebug;
  let hasUsableMemoryResult = false;
  let hasUnavailableMemorySearchResult = false;
  const seen = /* @__PURE__ */ new Set();
  for (const source of params.sources) {
    const key =
      source.kind === "runtime"
        ? `runtime:${source.target.agentId ?? ""}:${source.target.sessionId}:${source.target.sessionKey}:${source.target.storePath ?? ""}:${source.target.threadId ?? ""}`
        : `file:${source.sessionFile}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const state = await readActiveMemoryTranscriptState(source, void 0, params.toolsAllow);
    searchDebug = state.searchDebug ?? searchDebug;
    hasUsableMemoryResult ||= state.hasUsableMemoryResult;
    hasUnavailableMemorySearchResult ||= state.hasUnavailableMemorySearchResult;
  }
  return {
    searchDebug,
    hasUsableMemoryResult,
    hasUnavailableMemorySearchResult,
  };
}
async function readTerminalMemorySearchResult(source, limits, toolsAllow) {
  const recallPathNames = new Set(
    toolsAllow
      ?.map((toolName) => normalizeLowercaseStringOrEmpty(toolName))
      .filter((toolName) => toolName && toolName !== "memory_get"),
  );
  if (recallPathNames.size === 0) return;
  const unavailablePathNames = /* @__PURE__ */ new Set();
  let hasUsableMemoryResult = false;
  let searchDebug;
  await streamActiveMemoryTranscriptRecords({
    source,
    limits,
    onRecord: (record) => {
      hasUsableMemoryResult ||= hasUsableMemoryResultInSessionRecord(record, toolsAllow);
      searchDebug = extractActiveMemorySearchDebugFromSessionRecord(record) ?? searchDebug;
      const toolName = extractToolResultNameFromSessionRecord(record);
      if (!toolName || !recallPathNames.has(toolName)) return false;
      if (hasTerminalUnavailableMemoryResultInSessionRecord(record, toolsAllow ?? []))
        unavailablePathNames.add(toolName);
      else unavailablePathNames.delete(toolName);
      return false;
    },
  });
  if (unavailablePathNames.size !== recallPathNames.size) return;
  return {
    status: "unavailable",
    hasUsableMemoryResult,
    searchDebug,
  };
}
async function readTerminalMemorySearchResultFromSources(sources, limits, toolsAllow) {
  for (const source of sources) {
    const result = await readTerminalMemorySearchResult(source, limits, toolsAllow);
    if (result) return result;
  }
}
function watchTerminalMemorySearchResult(params) {
  let stopped = false;
  let timeoutId;
  let inFlight = false;
  let resolveWatch = () => {};
  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = void 0;
    }
    params.abortSignal.removeEventListener("abort", onAbort);
  };
  const finish = (result) => {
    stop();
    resolveWatch(result);
  };
  const schedule = () => {
    if (stopped) return;
    timeoutId = setTimeout(() => {
      tick();
    }, 25);
    timeoutId.unref?.();
  };
  const tick = async () => {
    if (stopped || inFlight) return;
    if (params.abortSignal.aborted) {
      stop();
      return;
    }
    inFlight = true;
    try {
      const result = await readTerminalMemorySearchResultFromSources(
        params.getTranscriptSources(),
        void 0,
        params.toolsAllow,
      );
      if (result) {
        finish(result);
        return;
      }
    } catch {
    } finally {
      inFlight = false;
    }
    schedule();
  };
  function onAbort() {
    stop();
  }
  return {
    promise: new Promise((resolve) => {
      resolveWatch = resolve;
      params.abortSignal.addEventListener("abort", onAbort, { once: true });
      tick();
    }),
    stop,
  };
}
function normalizeSearchDebug(value) {
  const debug = asOptionalRecord(value);
  if (!debug) return;
  const normalized = {
    backend: normalizeOptionalString(debug.backend),
    configuredMode: normalizeOptionalString(debug.configuredMode),
    effectiveMode: normalizeOptionalString(debug.effectiveMode),
    fallback: normalizeOptionalString(debug.fallback),
    searchMs:
      typeof debug.searchMs === "number" && Number.isFinite(debug.searchMs)
        ? debug.searchMs
        : void 0,
    hits: typeof debug.hits === "number" && Number.isFinite(debug.hits) ? debug.hits : void 0,
    warning: normalizeOptionalString(debug.warning) ?? normalizeOptionalString(debug.reason),
    action: normalizeOptionalString(debug.action),
    error: normalizeOptionalString(debug.error),
  };
  return normalized.backend ||
    normalized.configuredMode ||
    normalized.effectiveMode ||
    normalized.fallback ||
    typeof normalized.searchMs === "number" ||
    typeof normalized.hits === "number" ||
    normalized.warning ||
    normalized.action ||
    normalized.error
    ? normalized
    : void 0;
}
function readActiveMemorySearchDebugFromRunResult(result) {
  const record = asOptionalRecord(result);
  const meta = asOptionalRecord(record?.meta);
  return (
    normalizeSearchDebug(meta?.activeMemorySearchDebug) ??
    normalizeSearchDebug(meta?.memorySearchDebug) ??
    normalizeSearchDebug(record?.activeMemorySearchDebug) ??
    normalizeSearchDebug(record?.memorySearchDebug)
  );
}
function readActiveMemorySessionFileFromRunResult(result) {
  const meta = asOptionalRecord(asOptionalRecord(result)?.meta);
  return (
    normalizeOptionalString(asOptionalRecord(meta?.agentMeta)?.sessionFile) ??
    normalizeOptionalString(meta?.sessionFile)
  );
}
//#endregion
export {
  watchTerminalMemorySearchResult as a,
  readMergedActiveMemoryTranscriptState as i,
  readActiveMemorySearchDebugFromRunResult as n,
  readActiveMemorySessionFileFromRunResult as r,
  readActiveMemorySearchDebug as t,
};
