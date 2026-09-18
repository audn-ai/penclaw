import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { at as updateSessionEntry } from "./session-accessor-PZVNxFCV.js";
//#region src/agents/embedded-agent-subscribe.handlers.compaction.runtime.ts
/**
 * Runtime helpers for reconciling compaction counts after subscribe events.
 */
/** Persist the highest observed compaction count after a successful subscribed run. */
async function reconcileSessionStoreCompactionCountAfterSuccess(params) {
  const { sessionKey, agentId, configStore, observedCompactionCount, now = Date.now() } = params;
  if (!sessionKey || observedCompactionCount <= 0) return;
  return (
    await updateSessionEntry(
      {
        sessionKey,
        storePath: resolveStorePath(configStore, { agentId }),
      },
      async (entry) => {
        const currentCount = Math.max(0, entry.compactionCount ?? 0);
        const nextCount = Math.max(currentCount, observedCompactionCount);
        if (nextCount === currentCount) return null;
        return {
          compactionCount: nextCount,
          updatedAt: Math.max(entry.updatedAt ?? 0, now),
        };
      },
    )
  )?.compactionCount;
}
//#endregion
export { reconcileSessionStoreCompactionCountAfterSuccess as default };
