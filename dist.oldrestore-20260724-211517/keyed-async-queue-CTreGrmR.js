//#region src/plugin-sdk/keyed-async-queue.ts
/** Serialize async work per key while allowing unrelated keys to run concurrently. */
function enqueueKeyedTask(params) {
  params.hooks?.onEnqueue?.();
  const current = (params.tails.get(params.key) ?? Promise.resolve())
    .catch(() => void 0)
    .then(params.task)
    .finally(() => {
      params.hooks?.onSettle?.();
    });
  const tail = current.then(
    () => void 0,
    () => void 0,
  );
  params.tails.set(params.key, tail);
  const cleanup = () => {
    if (params.tails.get(params.key) === tail) params.tails.delete(params.key);
  };
  tail.then(cleanup, cleanup);
  return current;
}
/** Small per-key async queue wrapper for plugin runtimes that need serialized work. */
var KeyedAsyncQueue = class {
  constructor() {
    this.tails = /* @__PURE__ */ new Map();
  }
  /**
   * @deprecated Retained for shipped Plugin SDK compatibility. New callers must
   * not depend on queue storage; remove in a declared Plugin SDK breaking window.
   */
  getTailMapForTesting() {
    return this.tails;
  }
  enqueue(key, task, hooks) {
    return enqueueKeyedTask({
      tails: this.tails,
      key,
      task,
      ...(hooks ? { hooks } : {}),
    });
  }
};
//#endregion
export { enqueueKeyedTask as n, KeyedAsyncQueue as t };
