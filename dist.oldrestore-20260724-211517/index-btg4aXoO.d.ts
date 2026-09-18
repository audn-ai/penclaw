//#region packages/retry/src/index.d.ts
type BackoffPolicy = {
  initialMs: number;
  maxMs: number;
  factor: number;
  jitter: number;
};
declare function computeBackoff(policy: BackoffPolicy, attempt: number): number;
declare function computeBackoffSchedule(scheduleMs: readonly number[], attempt: number): number;
declare function sleepWithAbort(ms: number, abortSignal?: AbortSignal): Promise<void>;
declare class RetrySupervisor {
  private readonly policy;
  private readonly maxAttempts;
  attempts: number;
  nextDelayOverrideMs: number | undefined;
  private initialMs;
  private pendingAbort;
  constructor(policy: BackoffPolicy, maxAttempts?: number);
  reset(initialMs?: number): void;
  cancel(reason?: unknown): void;
  next(abortSignal?: AbortSignal):
    | {
        attempt: number;
        delayMs: number;
        signal: AbortSignal;
      }
    | undefined;
}
type RetryConfig = {
  attempts?: number;
  minDelayMs?: number;
  maxDelayMs?: number /** Fractional symmetric spread or full jitter. */;
  jitter?: number | "full";
};
type RetryDelayContext = {
  attempt: number;
  maxAttempts: number;
  err: unknown;
  label?: string;
};
type RetryInfo = RetryDelayContext & {
  delayMs: number;
};
type RetryOptions = RetryConfig & {
  label?: string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
  retryAfterMaxDelayMs?: number;
  delayMs?: number | ((context: RetryDelayContext) => number);
  onRetry?: (info: RetryInfo) => unknown;
  random?: () => number;
  sleep?: (ms: number) => Promise<void>;
};
type RetryRuntime = {
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
  createFailure?: (attemptErrors: readonly unknown[]) => Error;
};
declare function resolveRetryConfig(
  defaults?: Required<RetryConfig>,
  overrides?: RetryConfig,
): Required<RetryConfig>;
declare function toRetryError(value: unknown, fallbackMessage?: string): Error;
declare function createRetryRunner(
  runtime?: RetryRuntime,
): <T>(
  fn: () => Promise<T>,
  attemptsOrOptions?: number | RetryOptions,
  initialDelayMs?: number,
) => Promise<T>;
declare const retryAsync: <T>(
  fn: () => Promise<T>,
  attemptsOrOptions?: number | RetryOptions,
  initialDelayMs?: number,
) => Promise<T>;
//#endregion
export {
  RetryRuntime as a,
  computeBackoffSchedule as c,
  retryAsync as d,
  sleepWithAbort as f,
  RetryOptions as i,
  createRetryRunner as l,
  RetryConfig as n,
  RetrySupervisor as o,
  toRetryError as p,
  RetryInfo as r,
  computeBackoff as s,
  BackoffPolicy as t,
  resolveRetryConfig as u,
};
