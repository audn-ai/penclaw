//#region extensions/memory-core/src/memory/search-deadline.ts
const DEFAULT_MEMORY_SEARCH_TIMEOUT_MS = 15e3;
const MEMORY_SEARCH_DEADLINE_CONTROL = Symbol("memory-search-deadline-control");
function resolveMemorySearchAbortError(signal) {
  const { reason } = signal;
  if (reason instanceof Error) return reason;
  return new Error(typeof reason === "string" ? reason : "memory search aborted");
}
function createMemorySearchTimeoutError(timeoutMs) {
  return /* @__PURE__ */ new Error(`memory_search timed out after ${Math.round(timeoutMs / 1e3)}s`);
}
async function runMemorySearchWithDeadline(params) {
  if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
  const controller = new AbortController();
  const timeoutError = createMemorySearchTimeoutError(params.timeoutMs);
  const timeoutOutcome = { type: "timeout" };
  const parentAbortOutcome = { type: "parent-abort" };
  let timer;
  let remainingMs = params.timeoutMs;
  let deadlineStartedAt = Date.now();
  let removeParentAbort;
  let acceptDeadlineUpdates = true;
  let resolveTimeout;
  const timeoutPromise = new Promise((resolve) => {
    resolveTimeout = resolve;
  });
  const reachDefaultDeadline = () => {
    acceptDeadlineUpdates = false;
    resolveTimeout(timeoutOutcome);
    controller.abort(timeoutError);
  };
  const scheduleDefaultDeadline = () => {
    deadlineStartedAt = Date.now();
    timer = setTimeout(() => {
      timer = void 0;
      reachDefaultDeadline();
    }, remainingMs);
    timer.unref?.();
  };
  const controlDeadline = (action) => {
    if (!acceptDeadlineUpdates) return;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
      remainingMs = Math.max(0, remainingMs - (Date.now() - deadlineStartedAt));
    }
    if (remainingMs === 0) {
      reachDefaultDeadline();
      return;
    }
    if (action === "handoff") acceptDeadlineUpdates = false;
    else if (action === "resume") scheduleDefaultDeadline();
  };
  scheduleDefaultDeadline();
  const parentSignal = params.parentSignal;
  const parentAbortPromise = parentSignal
    ? new Promise((resolve) => {
        const onAbort = () => {
          acceptDeadlineUpdates = false;
          resolve(parentAbortOutcome);
          controller.abort(resolveMemorySearchAbortError(parentSignal));
        };
        parentSignal.addEventListener("abort", onAbort, { once: true });
        removeParentAbort = () => parentSignal.removeEventListener("abort", onAbort);
      })
    : void 0;
  const task = Promise.resolve().then(() => params.run(controller.signal, controlDeadline));
  task.catch(() => void 0);
  try {
    const result = await Promise.race(
      parentAbortPromise ? [task, timeoutPromise, parentAbortPromise] : [task, timeoutPromise],
    );
    if (result === parentAbortOutcome) throw resolveMemorySearchAbortError(parentSignal);
    if (result === timeoutOutcome) throw timeoutError;
    if (parentSignal?.aborted) throw resolveMemorySearchAbortError(parentSignal);
    if (
      acceptDeadlineUpdates &&
      timer !== void 0 &&
      Date.now() - deadlineStartedAt >= remainingMs
    ) {
      reachDefaultDeadline();
      throw timeoutError;
    }
    return result;
  } finally {
    acceptDeadlineUpdates = false;
    if (timer) clearTimeout(timer);
    removeParentAbort?.();
  }
}
//#endregion
export {
  runMemorySearchWithDeadline as i,
  MEMORY_SEARCH_DEADLINE_CONTROL as n,
  resolveMemorySearchAbortError as r,
  DEFAULT_MEMORY_SEARCH_TIMEOUT_MS as t,
};
