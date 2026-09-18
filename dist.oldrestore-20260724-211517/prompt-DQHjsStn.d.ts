import { tt as ResolvedActiveRecallPluginConfig } from "./types-Di2zMoWq.js";

//#region extensions/active-memory/prompt.d.ts
declare function buildRecallPrompt(params: {
  config: ResolvedActiveRecallPluginConfig;
  query: string;
  searchQuery: string;
}): string;
declare function readExplicitMemoryEvidence(source: Record<string, unknown>): boolean | undefined;
declare function readStructuredMemoryFailure(source: unknown): boolean | undefined;
declare function readStructuredMemoryFailureFromContent(content: unknown): boolean | undefined;
declare function readStructuredMemoryEvidenceFromContent(content: unknown): boolean | undefined;
declare function normalizeActiveSummary(rawReply: string): string | null;
declare function truncateSummary(summary: string, maxSummaryChars: number): string;
declare function buildMetadata(summary: string | null): string | undefined;
declare function buildPromptPrefix(summary: string | null): string | undefined;
//#endregion
export {
  readExplicitMemoryEvidence as a,
  readStructuredMemoryFailureFromContent as c,
  normalizeActiveSummary as i,
  truncateSummary as l,
  buildPromptPrefix as n,
  readStructuredMemoryEvidenceFromContent as o,
  buildRecallPrompt as r,
  readStructuredMemoryFailure as s,
  buildMetadata as t,
};
