import { parentPort, workerData } from "node:worker_threads";
import {
  a as buildStageSplitPlan,
  i as buildOversizedFallbackPlan,
  o as buildSummaryChunks,
  r as buildHistoryPrunePlan,
  s as computeAdaptiveChunkRatio,
} from "../compaction-planning-BCL9SM9y.js";
//#region src/agents/compaction-planning.worker.ts
/**
 * Worker-thread entrypoint for serializable compaction planning requests.
 */
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function isMessageArray(value) {
  return Array.isArray(value);
}
function isWorkerInput(value) {
  if (!value || typeof value !== "object" || !("kind" in value)) return false;
  const input = value;
  switch (input.kind) {
    case "summaryChunks":
      return isMessageArray(input.messages) && isFiniteNumber(input.maxChunkTokens);
    case "oversizedFallback":
      return isMessageArray(input.messages) && isFiniteNumber(input.contextWindow);
    case "stageSplit":
      return isMessageArray(input.messages) && isFiniteNumber(input.maxChunkTokens);
    case "historyPrune":
      return (
        isMessageArray(input.messagesToSummarize) &&
        isMessageArray(input.turnPrefixMessages) &&
        isFiniteNumber(input.tokensBefore) &&
        isFiniteNumber(input.contextWindowTokens) &&
        isFiniteNumber(input.maxHistoryShare)
      );
    case "adaptiveChunkRatio":
      return isMessageArray(input.messages) && isFiniteNumber(input.contextWindow);
    default:
      return false;
  }
}
/** Run one compaction planning request and return a serializable result. */
function runCompactionPlanningWorkerInput(input) {
  if (!isWorkerInput(input))
    return {
      status: "failed",
      error: "invalid compaction planning worker input",
    };
  try {
    switch (input.kind) {
      case "summaryChunks":
        return {
          status: "ok",
          value: {
            kind: "summaryChunks",
            chunks: buildSummaryChunks(input),
          },
        };
      case "oversizedFallback":
        return {
          status: "ok",
          value: {
            kind: "oversizedFallback",
            ...buildOversizedFallbackPlan(input),
          },
        };
      case "stageSplit":
        return {
          status: "ok",
          value: {
            kind: "stageSplit",
            ...buildStageSplitPlan(input),
          },
        };
      case "historyPrune":
        return {
          status: "ok",
          value: {
            kind: "historyPrune",
            ...buildHistoryPrunePlan(input),
          },
        };
      case "adaptiveChunkRatio":
        return {
          status: "ok",
          value: {
            kind: "adaptiveChunkRatio",
            ratio: computeAdaptiveChunkRatio(input.messages, input.contextWindow),
          },
        };
    }
    return {
      status: "failed",
      error: "unsupported compaction planning worker input",
    };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
if (parentPort)
  parentPort.postMessage.bind(parentPort)(runCompactionPlanningWorkerInput(workerData));
//#endregion
export { runCompactionPlanningWorkerInput };
