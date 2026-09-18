import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
//#region src/agents/embedded-agent-runner/compact.runtime.ts
/**
 * Lazy-loads the embedded-agent compaction runtime.
 */
const compactRuntimeLoader = createLazyImportLoader(() => import("./compact-HUJMTb9L.js"));
function loadCompactRuntime() {
  return compactRuntimeLoader.load();
}
/** Loads the compaction runtime on demand and forwards the direct compaction call. */
async function compactEmbeddedAgentSessionDirect(...args) {
  const { compactEmbeddedAgentSessionDirect: compactEmbeddedAgentSessionDirectLocal } =
    await loadCompactRuntime();
  return compactEmbeddedAgentSessionDirectLocal(...args);
}
//#endregion
export { compactEmbeddedAgentSessionDirect };
