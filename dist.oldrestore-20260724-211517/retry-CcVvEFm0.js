import { t as generateSecureFraction } from "./secure-random-Ds4AFLgz.js";
import { c as toRetryError, i as createRetryRunner } from "./src-Dqmh2693.js";
//#region src/infra/retry-attempt-errors.ts
const retryAttemptErrors = /* @__PURE__ */ new WeakMap();
function recordRetryAttemptErrors(error, attemptErrors) {
  retryAttemptErrors.set(error, [...attemptErrors]);
}
function getRetryAttemptErrors(err) {
  return err !== null && (typeof err === "object" || typeof err === "function")
    ? retryAttemptErrors.get(err)
    : void 0;
}
//#endregion
//#region src/infra/retry.ts
function createRetryFailure(rawAttemptErrors) {
  const attemptErrors = rawAttemptErrors.flatMap((err) => getRetryAttemptErrors(err) ?? [err]);
  const failure = toRetryError(
    attemptErrors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed"),
    "Non-Error thrown",
  );
  if (attemptErrors.length > 1) recordRetryAttemptErrors(failure, attemptErrors);
  return failure;
}
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
const retryAsync = createRetryRunner({
  random: generateSecureFraction,
  createFailure: createRetryFailure,
});
//#endregion
export { getRetryAttemptErrors as n, retryAsync as t };
