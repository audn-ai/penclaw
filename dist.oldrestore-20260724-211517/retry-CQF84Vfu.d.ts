import { i as RetryOptions } from "./index-btg4aXoO.js";

//#region src/infra/retry.d.ts
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
declare const retryAsync: <T>(
  fn: () => Promise<T>,
  attemptsOrOptions?: number | RetryOptions,
  initialDelayMs?: number,
) => Promise<T>;
//#endregion
export { retryAsync as t };
