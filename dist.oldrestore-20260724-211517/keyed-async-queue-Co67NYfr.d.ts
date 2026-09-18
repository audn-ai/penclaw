//#region src/plugin-sdk/keyed-async-queue.d.ts
/** Optional lifecycle hooks fired around each queued task. */
type KeyedAsyncQueueHooks = {
  onEnqueue?: () => void;
  onSettle?: () => void;
};
/** Serialize async work per key while allowing unrelated keys to run concurrently. */
declare function enqueueKeyedTask<T>(params: {
  tails: Map<string, Promise<void>>;
  key: string;
  task: () => Promise<T>;
  hooks?: KeyedAsyncQueueHooks;
}): Promise<T>;
/** Small per-key async queue wrapper for plugin runtimes that need serialized work. */
declare class KeyedAsyncQueue {
  private readonly tails;
  /**
   * @deprecated Retained for shipped Plugin SDK compatibility. New callers must
   * not depend on queue storage; remove in a declared Plugin SDK breaking window.
   */
  getTailMapForTesting(): Map<string, Promise<void>>;
  enqueue<T>(key: string, task: () => Promise<T>, hooks?: KeyedAsyncQueueHooks): Promise<T>;
}
//#endregion
export { KeyedAsyncQueueHooks as n, enqueueKeyedTask as r, KeyedAsyncQueue as t };
