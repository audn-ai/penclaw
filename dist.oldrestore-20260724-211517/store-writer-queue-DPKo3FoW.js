import { AsyncLocalStorage } from "node:async_hooks";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
//#region src/shared/store-writer-queue.ts
const activeStoreWriters = resolveGlobalSingleton(
  Symbol.for("openclaw.activeStoreWriters"),
  () => new AsyncLocalStorage(),
);
function isActiveStoreWriter(queues, storePath) {
  let active = activeStoreWriters.getStore();
  while (active) {
    if (active.active && active.queues === queues && active.storePath === storePath) return true;
    active = active.parent;
  }
  return false;
}
async function runActiveStoreWriter(queues, storePath, fn) {
  const writer = {
    active: true,
    parent: activeStoreWriters.getStore(),
    queues,
    storePath,
  };
  try {
    return await activeStoreWriters.run(writer, fn);
  } finally {
    writer.active = false;
  }
}
function getOrCreateStoreWriterQueue(queues, storePath) {
  const existing = queues.get(storePath);
  if (existing) return existing;
  const created = {
    running: false,
    pending: [],
    drainPromise: null,
  };
  queues.set(storePath, created);
  return created;
}
async function drainStoreWriterQueue(queues, storePath) {
  const queue = queues.get(storePath);
  if (!queue) return;
  if (queue.drainPromise) {
    await queue.drainPromise;
    return;
  }
  queue.running = true;
  queue.drainPromise = (async () => {
    try {
      while (queue.pending.length > 0) {
        const task = queue.pending.shift();
        if (!task) continue;
        let result;
        let failed;
        let hasFailure = false;
        try {
          result = await task.fn();
        } catch (err) {
          hasFailure = true;
          failed = err;
        }
        if (hasFailure) {
          task.reject(failed);
          continue;
        }
        task.resolve(result);
      }
    } finally {
      queue.running = false;
      queue.drainPromise = null;
      if (queue.pending.length === 0) queues.delete(storePath);
      else
        queueMicrotask(() => {
          drainStoreWriterQueue(queues, storePath);
        });
    }
  })();
  await queue.drainPromise;
}
/** Runs one store write after prior writes for the same store path have finished. */
async function runQueuedStoreWrite(params) {
  if (!params.storePath || typeof params.storePath !== "string")
    throw new Error(
      `${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`,
    );
  if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath))
    return await params.fn();
  const queue = getOrCreateStoreWriterQueue(params.queues, params.storePath);
  return await new Promise((resolve, reject) => {
    const task = {
      fn: async () => await runActiveStoreWriter(params.queues, params.storePath, params.fn),
      resolve: (value) => resolve(value),
      reject,
    };
    queue.pending.push(task);
    drainStoreWriterQueue(params.queues, params.storePath);
  });
}
/** Rejects pending queued writes and clears queue state for test cleanup. */
function clearStoreWriterQueuesForTest(queues, message) {
  for (const queue of queues.values())
    for (const task of queue.pending) task.reject(new Error(message));
  queues.clear();
}
//#endregion
export { runQueuedStoreWrite as n, clearStoreWriterQueuesForTest as t };
