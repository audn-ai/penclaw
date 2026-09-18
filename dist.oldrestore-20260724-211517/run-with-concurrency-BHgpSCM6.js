import pLimit from "p-limit";
//#region src/utils/run-with-concurrency.ts
/** Runs async tasks with bounded concurrency while preserving result indexes. */
async function runTasksWithConcurrency(params) {
  const { tasks, limit, onTaskError } = params;
  const errorMode = params.errorMode ?? "continue";
  if (tasks.length === 0)
    return {
      results: [],
      firstError: void 0,
      hasError: false,
    };
  const resolvedLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(Math.floor(limit), tasks.length))
    : tasks.length;
  const results = Array.from({ length: tasks.length });
  let firstError = void 0;
  let hasError = false;
  const limiter = pLimit(resolvedLimit);
  const runs = tasks.map((task, index) =>
    limiter(async () => {
      if (errorMode === "stop" && hasError) return;
      try {
        results[index] = await task();
      } catch (error) {
        if (!hasError) {
          firstError = error;
          hasError = true;
        }
        onTaskError?.(error, index);
      }
    }),
  );
  await Promise.allSettled(runs);
  return {
    results,
    firstError,
    hasError,
  };
}
//#endregion
export { runTasksWithConcurrency as t };
