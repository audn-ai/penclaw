import { o as createDeferred } from "./extension-shared-DqZe9psR.js";
//#region extensions/acpx/src/runtime-turn.ts
/**
 * ACPX turn adapters. Modern runtimes can expose startTurn directly; legacy
 * runtimes that only stream runTurn events are adapted to the newer contract.
 */
function isCancellationStopReason(stopReason) {
  return stopReason === "cancel" || stopReason === "cancelled" || stopReason === "manual-cancel";
}
var LegacyRunTurnEventQueue = class {
  constructor() {
    this.items = [];
    this.waits = [];
    this.closed = false;
  }
  push(item) {
    if (this.closed) return;
    const waiter = this.waits.shift();
    if (waiter) {
      waiter.resolve(item);
      return;
    }
    this.items.push(item);
  }
  clear() {
    this.items.length = 0;
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    for (const waiter of this.waits.splice(0)) waiter.resolve(null);
  }
  fail(error) {
    if (this.closed) return;
    this.error = error;
    this.closed = true;
    for (const waiter of this.waits.splice(0)) waiter.reject(error);
  }
  async next() {
    const item = this.items.shift();
    if (item) return item;
    if (this.error) throw toLintErrorObject(this.error, "Non-Error thrown");
    if (this.closed) return null;
    return await new Promise((resolve, reject) => {
      this.waits.push({
        resolve,
        reject,
      });
    });
  }
  async *iterate() {
    for (;;) {
      const item = await this.next();
      if (!item) return;
      yield item;
    }
  }
};
function legacyRunTurnAsStartTurn(runtime, input) {
  const result = createDeferred();
  result.promise.catch(() => {});
  const queue = new LegacyRunTurnEventQueue();
  let resultSettled = false;
  const settleResult = (next) => {
    if (resultSettled) return;
    resultSettled = true;
    result.resolve(next);
  };
  (async () => {
    try {
      for await (const event of runtime.runTurn(input)) {
        if (event.type === "done") {
          settleResult({
            status:
              event.status ??
              (isCancellationStopReason(event.stopReason) ? "cancelled" : "completed"),
            ...(event.stopReason ? { stopReason: event.stopReason } : {}),
          });
          continue;
        }
        if (event.type === "error") {
          settleResult({
            status: "failed",
            error: {
              message: event.message,
              ...(event.code ? { code: event.code } : {}),
              ...(event.detailCode ? { detailCode: event.detailCode } : {}),
              ...(event.retryable === void 0 ? {} : { retryable: event.retryable }),
            },
          });
          continue;
        }
        queue.push(event);
      }
      settleResult({
        status: "failed",
        error: {
          code: "ACP_TURN_FAILED",
          message: "ACP turn ended without a terminal done event.",
        },
      });
    } catch (error) {
      result.reject(error);
      queue.fail(error);
      return;
    }
    queue.close();
  })();
  return {
    requestId: input.requestId,
    events: queue.iterate(),
    result: result.promise,
    async cancel(inputArgs) {
      await runtime.cancel({
        handle: input.handle,
        reason: inputArgs?.reason,
      });
    },
    async closeStream() {
      queue.clear();
      queue.close();
    },
  };
}
/** Start an ACP turn, adapting legacy runTurn-only runtimes when needed. */
function startRuntimeTurn(runtime, input) {
  return runtime.startTurn?.(input) ?? legacyRunTurnAsStartTurn(runtime, input);
}
/** Start an ACP turn through a lazy runtime resolver. */
function lazyStartRuntimeTurn(resolveRuntime, input) {
  const turnPromise = resolveRuntime().then((runtime) => startRuntimeTurn(runtime, input));
  return {
    requestId: input.requestId,
    events: {
      async *[Symbol.asyncIterator]() {
        yield* (await turnPromise).events;
      },
    },
    result: turnPromise.then((turn) => turn.result),
    cancel(inputArgs) {
      return turnPromise.then((turn) => turn.cancel(inputArgs));
    },
    closeStream(inputArgs) {
      return turnPromise.then((turn) => turn.closeStream(inputArgs));
    },
  };
}
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
//#region extensions/acpx/src/runtime-proxy.ts
/** Create an ACP runtime facade backed by an async runtime resolver. */
function createLazyAcpRuntimeProxy(resolveRuntime) {
  return {
    async ensureSession(input) {
      return await (await resolveRuntime()).ensureSession(input);
    },
    startTurn(input) {
      return lazyStartRuntimeTurn(resolveRuntime, input);
    },
    async *runTurn(input) {
      yield* (await resolveRuntime()).runTurn(input);
    },
    async getCapabilities(input) {
      return (await (await resolveRuntime()).getCapabilities?.(input)) ?? { controls: [] };
    },
    async getStatus(input) {
      return (await (await resolveRuntime()).getStatus?.(input)) ?? {};
    },
    async setMode(input) {
      await (await resolveRuntime()).setMode?.(input);
    },
    async setConfigOption(input) {
      await (await resolveRuntime()).setConfigOption?.(input);
    },
    async doctor() {
      return (
        (await (await resolveRuntime()).doctor?.()) ?? {
          ok: true,
          message: "ok",
        }
      );
    },
    async prepareFreshSession(input) {
      await (await resolveRuntime()).prepareFreshSession?.(input);
    },
    async cancel(input) {
      await (await resolveRuntime()).cancel(input);
    },
    async close(input) {
      await (await resolveRuntime()).close(input);
    },
  };
}
//#endregion
export { createLazyAcpRuntimeProxy as t };
