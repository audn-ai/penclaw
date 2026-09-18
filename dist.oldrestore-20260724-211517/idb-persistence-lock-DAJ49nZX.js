//#region extensions/matrix/src/matrix/sdk/idb-persistence-lock.ts
const MATRIX_IDB_PERSIST_INTERVAL_MS = 6e4;
const IDB_SNAPSHOT_LOCK_STALE_MS = 5 * 6e4;
const IDB_SNAPSHOT_LOCK_RETRY_BASE = {
  factor: 2,
  minTimeout: 50,
  maxTimeout: 5e3,
  randomize: true,
};
function computeRetryDelayMs(retries, attempt) {
  return Math.min(
    retries.maxTimeout,
    Math.max(retries.minTimeout, retries.minTimeout * retries.factor ** attempt),
  );
}
function computeMinimumRetryWindowMs(retries) {
  let total = 0;
  const attempts = Math.max(1, retries.retries + 1);
  for (let attempt = 0; attempt < attempts - 1; attempt += 1)
    total += computeRetryDelayMs(retries, attempt);
  return total;
}
function resolveRetriesForMinimumWindowMs(retries, minimumWindowMs) {
  const resolved = {
    ...retries,
    retries: 0,
  };
  while (computeMinimumRetryWindowMs(resolved) < minimumWindowMs) resolved.retries += 1;
  return resolved;
}
const MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS = {
  retries: resolveRetriesForMinimumWindowMs(
    IDB_SNAPSHOT_LOCK_RETRY_BASE,
    MATRIX_IDB_PERSIST_INTERVAL_MS,
  ),
  stale: IDB_SNAPSHOT_LOCK_STALE_MS,
};
//#endregion
export { MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS as n, MATRIX_IDB_PERSIST_INTERVAL_MS as t };
