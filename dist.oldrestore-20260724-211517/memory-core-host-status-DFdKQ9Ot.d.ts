//#region packages/memory-host-sdk/src/host/status-format.d.ts
/** Display tone used by memory status renderers. */
type Tone = "ok" | "warn" | "muted";
/** Resolve vector indexing state from enabled and availability flags. */
declare function resolveMemoryVectorState(vector: { enabled: boolean; available?: boolean }): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled" | "unknown";
};
/** Resolve full-text search state from enabled and availability flags. */
declare function resolveMemoryFtsState(fts: { enabled: boolean; available: boolean }): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled";
};
/** Format cache state as concise status text with optional entry count. */
declare function resolveMemoryCacheSummary(cache: { enabled: boolean; entries?: number }): {
  tone: Tone;
  text: string;
};
//#endregion
export {
  resolveMemoryVectorState as i,
  resolveMemoryCacheSummary as n,
  resolveMemoryFtsState as r,
  Tone as t,
};
