import { t as runBoundedCodexAppServerTurn } from "./bounded-turn-bE7rbTmh.js";
import { y as readStringParam } from "./common-DyDSUect.js";
import { o as wrapWebContent } from "./external-content-rRQGoatE.js";
import "./provider-web-search-Bpbir19i.js";
import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import { _ as buildCodexNativeWebSearchThreadConfig } from "./thread-lifecycle-BI8tSeEg.js";
import { _ as resolveSearchTimeoutSeconds } from "./web-search-provider-common-B8EoIruV.js";
//#region extensions/codex/src/web-search-provider.runtime.ts
async function executeCodexWebSearchProviderTool(ctx, args, executionContext, options) {
  const query = readStringParam(args, "query", { required: true });
  const start = Date.now();
  const result = await runBoundedCodexAppServerTurn({
    config: ctx.config,
    model: { mode: "live-default" },
    timeoutMs: resolveSearchTimeoutSeconds(ctx.searchConfig) * 1e3,
    signal: executionContext?.signal,
    agentDir: ctx.agentDir,
    options,
    taskLabel: "hosted search",
    developerInstructions:
      "You are OpenClaw's bounded web-search worker. You must use Codex hosted web_search to answer the user's search query. Return a concise grounded answer with source URLs. Do not call other tools, edit files, or ask follow-up questions.",
    input: [
      {
        type: "text",
        text: query,
        text_elements: [],
      },
    ],
    requiredModalities: ["text"],
    isolation: "private-stdio",
    threadConfig: buildCodexNativeWebSearchThreadConfig(ctx.config),
  });
  const searches = result.items
    .filter((item) => item.type === "webSearch")
    .map(summarizeCodexWebSearchItem);
  if (searches.length === 0)
    throw new Error("Codex hosted search completed without invoking web search.");
  return {
    query,
    provider: "codex",
    model: result.model,
    tookMs: Date.now() - start,
    externalContent: {
      untrusted: true,
      source: "web_search",
      provider: "codex",
      wrapped: true,
    },
    content: wrapWebContent(result.text, "web_search"),
    searches,
  };
}
function summarizeCodexWebSearchItem(item) {
  const action = isJsonObject(item.action) ? item.action : void 0;
  const actionType = readNonEmptyString(action, "type");
  const queries = actionType === "search" ? readNonEmptyStringArray(action, "queries") : [];
  const query =
    normalizeNonEmptyString(item.query) ??
    (actionType === "search" ? readNonEmptyString(action, "query") : void 0) ??
    queries[0];
  const url = readNonEmptyString(action, "url");
  const pattern = readNonEmptyString(action, "pattern");
  return {
    ...(query ? { query } : {}),
    ...(queries.length > 0 ? { queries } : {}),
    ...(actionType && actionType !== "search" ? { action: actionType } : {}),
    ...(url ? { url } : {}),
    ...(pattern ? { pattern } : {}),
  };
}
function readNonEmptyString(record, key) {
  return record ? normalizeNonEmptyString(record[key]) : void 0;
}
function readNonEmptyStringArray(record, key) {
  const value = record?.[key];
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const normalized = normalizeNonEmptyString(entry);
    return normalized ? [normalized] : [];
  });
}
function normalizeNonEmptyString(value) {
  return typeof value === "string" ? value.trim() || void 0 : void 0;
}
//#endregion
export { executeCodexWebSearchProviderTool };
