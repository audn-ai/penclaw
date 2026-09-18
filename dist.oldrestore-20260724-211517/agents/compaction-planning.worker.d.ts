import { s as AgentMessage } from "../types-JQFrjdua.js";
//#region src/agents/compaction-planning.d.ts
/** Decision for whether a summarization stage should run as one chunk or multiple chunks. */
type StageSplitPlan =
  | {
      mode: "single";
    }
  | {
      mode: "split";
      chunks: AgentMessage[][];
    };
/** Messages safe to summarize plus notes for messages too large to fit in a summary request. */
type OversizedFallbackPlan = {
  smallMessages: AgentMessage[];
  oversizedNotes: string[];
};
/** Token accounting and optional prune result for preserving context-window headroom. */
type HistoryPrunePlan = {
  summarizableTokens: number;
  newContentTokens: number;
  maxHistoryTokens: number;
  pruned?: ReturnType<typeof pruneHistoryForContextShare>;
};
/** Drops oldest token-share chunks until history fits the requested context share. */
declare function pruneHistoryForContextShare(params: {
  messages: AgentMessage[];
  maxContextTokens: number;
  maxHistoryShare?: number;
  parts?: number;
  mode?: "share" | "handoff";
}): {
  messages: AgentMessage[];
  droppedMessagesList: AgentMessage[];
  droppedChunks: number;
  droppedMessages: number;
  droppedTokens: number;
  keptTokens: number;
  budgetTokens: number;
};
/** Computes whether new content exceeds the history budget and plans pruning when needed. */
//#endregion
//#region src/agents/compaction-planning.worker.d.ts
/** Serializable request accepted by the compaction planning worker. */
type CompactionPlanningWorkerInput =
  | {
      kind: "summaryChunks";
      messages: AgentMessage[];
      maxChunkTokens: number;
    }
  | {
      kind: "oversizedFallback";
      messages: AgentMessage[];
      contextWindow: number;
    }
  | {
      kind: "stageSplit";
      messages: AgentMessage[];
      maxChunkTokens: number;
      parts?: number;
      minMessagesForSplit?: number;
    }
  | {
      kind: "historyPrune";
      messagesToSummarize: AgentMessage[];
      turnPrefixMessages: AgentMessage[];
      tokensBefore: number;
      contextWindowTokens: number;
      maxHistoryShare: number;
      parts?: number;
    }
  | {
      kind: "adaptiveChunkRatio";
      messages: AgentMessage[];
      contextWindow: number;
    };
/** Serializable successful value returned by the compaction planning worker. */
type CompactionPlanningWorkerValue =
  | {
      kind: "summaryChunks";
      chunks: AgentMessage[][];
    }
  | ({
      kind: "oversizedFallback";
    } & OversizedFallbackPlan)
  | ({
      kind: "stageSplit";
    } & StageSplitPlan)
  | ({
      kind: "historyPrune";
    } & HistoryPrunePlan)
  | {
      kind: "adaptiveChunkRatio";
      ratio: number;
    };
/** Serializable success/failure envelope posted by the worker. */
type CompactionPlanningWorkerResult =
  | {
      status: "ok";
      value: CompactionPlanningWorkerValue;
    }
  | {
      status: "failed";
      error: string;
    };
/** Run one compaction planning request and return a serializable result. */
declare function runCompactionPlanningWorkerInput(input: unknown): CompactionPlanningWorkerResult;
//#endregion
export {
  CompactionPlanningWorkerInput,
  CompactionPlanningWorkerResult,
  CompactionPlanningWorkerValue,
  runCompactionPlanningWorkerInput,
};
