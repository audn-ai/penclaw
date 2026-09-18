//#region src/utils/run-with-concurrency.d.ts
/** Controls whether the worker pool keeps scheduling after a task failure. */
type ConcurrencyErrorMode = "continue" | "stop";
/** Options for running a fixed list of promise factories through a bounded worker pool. */
type RunTasksWithConcurrencyOptions<T> = {
  /** Task factories are started lazily so the helper can enforce `limit`. */ tasks: Array<
    () => Promise<T>
  > /** Maximum number of tasks allowed to run at the same time; clamped to at least one. */;
  limit: number /** `stop` prevents new work after the first failure; in-flight workers still settle. */;
  errorMode?: ConcurrencyErrorMode /** Called once per failed task with the original task index. */;
  onTaskError?: (error: unknown, index: number) => void;
};
/** Ordered task results plus aggregate error state for callers that keep partial success. */
type RunTasksWithConcurrencyResult<T> = {
  /** Results are written at their original task indexes; failed or unscheduled indexes stay empty. */ results: T[] /** First task error observed by the worker pool, if any. */;
  firstError: unknown /** True when at least one task rejected. */;
  hasError: boolean;
};
/** Runs async tasks with bounded concurrency while preserving result indexes. */
declare function runTasksWithConcurrency<T>(
  params: RunTasksWithConcurrencyOptions<T>,
): Promise<RunTasksWithConcurrencyResult<T>>;
//#endregion
export {
  runTasksWithConcurrency as i,
  RunTasksWithConcurrencyOptions as n,
  RunTasksWithConcurrencyResult as r,
  ConcurrencyErrorMode as t,
};
