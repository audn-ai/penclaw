//#region packages/memory-host-sdk/src/host/status-format.ts
/** Resolve vector indexing state from enabled and availability flags. */
function resolveMemoryVectorState(vector) {
  if (!vector.enabled)
    return {
      tone: "muted",
      state: "disabled",
    };
  if (vector.available === true)
    return {
      tone: "ok",
      state: "ready",
    };
  if (vector.available === false)
    return {
      tone: "warn",
      state: "unavailable",
    };
  return {
    tone: "muted",
    state: "unknown",
  };
}
/** Resolve full-text search state from enabled and availability flags. */
function resolveMemoryFtsState(fts) {
  if (!fts.enabled)
    return {
      tone: "muted",
      state: "disabled",
    };
  return fts.available
    ? {
        tone: "ok",
        state: "ready",
      }
    : {
        tone: "warn",
        state: "unavailable",
      };
}
/** Format cache state as concise status text with optional entry count. */
function resolveMemoryCacheSummary(cache) {
  if (!cache.enabled)
    return {
      tone: "muted",
      text: "cache off",
    };
  return {
    tone: "ok",
    text: `cache on${typeof cache.entries === "number" ? ` (${cache.entries})` : ""}`,
  };
}
//#endregion
export {
  resolveMemoryFtsState as n,
  resolveMemoryVectorState as r,
  resolveMemoryCacheSummary as t,
};
