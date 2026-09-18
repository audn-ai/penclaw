import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/infra/sqlite-transaction.ts
const transactionDepthByDatabase = /* @__PURE__ */ new WeakMap();
const SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
const SQLITE_BUSY_RESULT_CODE = 5;
const SQLITE_LOCKED_RESULT_CODE = 6;
const SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
let nextSavepointId = 0;
const transactionLog = createSubsystemLogger("sqlite/transaction");
function nextSavepointName() {
  nextSavepointId += 1;
  return `openclaw_tx_${nextSavepointId}`;
}
function isPromiseLike(value) {
  return Boolean(value && typeof value.then === "function");
}
function assertSyncTransactionResult(value) {
  if (isPromiseLike(value))
    throw new Error(
      "SQLite write transactions must be synchronous; Promise returns are not supported.",
    );
}
function sqliteErrorCode(error) {
  const code = error && typeof error === "object" ? error.code : void 0;
  return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
  const errcode = error && typeof error === "object" ? error.errcode : void 0;
  return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
  const errcode = sqliteExtendedResultCode(error);
  return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
  const code = sqliteErrorCode(error);
  if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) return true;
  const primaryCode = sqlitePrimaryResultCode(error);
  return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
function slowBusyWaitThresholdMs(options) {
  if (options?.busyTimeoutMs === void 0) return DEFAULT_SLOW_BUSY_WAIT_MS;
  return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, Math.max(1, options.busyTimeoutMs));
}
function slowTransactionHoldThresholdMs(options) {
  return options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS;
}
function transactionLogger(options) {
  return options?.logger ?? transactionLog;
}
function logSlowTransactionHold(params) {
  if (params.elapsedMs < slowTransactionHoldThresholdMs(params.options)) return;
  transactionLogger(params.options).warn("slow SQLite transaction hold", {
    async: false,
    ...(params.options?.databaseLabel ? { database: params.options.databaseLabel } : {}),
    elapsedMs: params.elapsedMs,
    ...(params.options?.operationLabel ? { operation: params.options.operationLabel } : {}),
    pid: process.pid,
    thresholdMs: slowTransactionHoldThresholdMs(params.options),
  });
}
function logSlowTransactionStep(params) {
  if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
  transactionLogger(params.options).warn("slow SQLite transaction lock wait", {
    async: false,
    ...(params.options?.busyTimeoutMs !== void 0
      ? { busyTimeoutMs: params.options.busyTimeoutMs }
      : {}),
    ...(params.options?.databaseLabel ? { database: params.options.databaseLabel } : {}),
    elapsedMs: params.elapsedMs,
    ...(params.options?.operationLabel ? { operation: params.options.operationLabel } : {}),
    pid: process.pid,
    step: params.step,
  });
}
function execTimedTransactionStep(params) {
  const startedAt = Date.now();
  try {
    params.db.exec(params.sql);
    const elapsedMs = Date.now() - startedAt;
    logSlowTransactionStep({
      elapsedMs,
      options: params.options,
      step: params.step,
    });
    return elapsedMs;
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    if (isSqliteLockError(error)) {
      const sqliteErrcode = sqliteExtendedResultCode(error);
      const sqlitePrimaryCode = sqlitePrimaryResultCode(error);
      transactionLogger(params.options).warn("SQLite transaction lock wait failed", {
        async: false,
        ...(params.options?.busyTimeoutMs !== void 0
          ? { busyTimeoutMs: params.options.busyTimeoutMs }
          : {}),
        ...(params.options?.databaseLabel ? { database: params.options.databaseLabel } : {}),
        code: sqliteErrorCode(error),
        elapsedMs,
        failureKind: "lock-contention",
        ...(params.options?.operationLabel ? { operation: params.options.operationLabel } : {}),
        pid: process.pid,
        ...(sqliteErrcode !== void 0 ? { sqliteErrcode } : {}),
        ...(sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {}),
        step: params.step,
      });
    }
    throw error;
  }
}
function beginTransaction(db, options, mode) {
  execTimedTransactionStep({
    db,
    options,
    sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
    step: "begin",
  });
}
function commitImmediateTransaction(db, options) {
  execTimedTransactionStep({
    db,
    options,
    sql: "COMMIT",
    step: "commit",
  });
}
function abortImmediateTransaction(db) {
  try {
    db.exec("ROLLBACK");
  } catch {
    try {
      db.close();
    } catch {}
  }
}
function getTransactionDepth(db) {
  return transactionDepthByDatabase.get(db) ?? 0;
}
function setTransactionDepth(db, depth) {
  if (depth <= 0) {
    transactionDepthByDatabase.delete(db);
    return;
  }
  transactionDepthByDatabase.set(db, depth);
}
function runSqliteTransactionSync(db, operation, mode, options) {
  const depth = getTransactionDepth(db);
  if (depth > 0) {
    const savepointName = nextSavepointName();
    db.exec(`SAVEPOINT ${savepointName}`);
    setTransactionDepth(db, depth + 1);
    try {
      const result = operation();
      assertSyncTransactionResult(result);
      db.exec(`RELEASE SAVEPOINT ${savepointName}`);
      return result;
    } catch (error) {
      try {
        db.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`);
      } finally {
        db.exec(`RELEASE SAVEPOINT ${savepointName}`);
      }
      throw error;
    } finally {
      setTransactionDepth(db, depth);
    }
  }
  beginTransaction(db, options, mode);
  setTransactionDepth(db, 1);
  let transactionStillActive = true;
  let result;
  const transactionStartedAt = Date.now();
  try {
    result = operation();
    assertSyncTransactionResult(result);
  } catch (error) {
    try {
      abortImmediateTransaction(db);
      transactionStillActive = false;
    } catch {}
    throw error;
  } finally {
    if (!transactionStillActive) setTransactionDepth(db, 0);
  }
  try {
    logSlowTransactionHold({
      elapsedMs: Date.now() - transactionStartedAt,
      options,
    });
    commitImmediateTransaction(db, options);
    transactionStillActive = false;
    return result;
  } catch (error) {
    try {
      abortImmediateTransaction(db);
      transactionStillActive = false;
    } catch {}
    throw error;
  } finally {
    if (!transactionStillActive) setTransactionDepth(db, 0);
  }
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
  return runSqliteTransactionSync(db, operation, "deferred", options);
}
function runSqliteImmediateTransactionSync(db, operation, options) {
  return runSqliteTransactionSync(db, operation, "immediate", options);
}
//#endregion
export {
  runSqliteDeferredTransactionSync as n,
  runSqliteImmediateTransactionSync as r,
  isSqliteLockError as t,
};
