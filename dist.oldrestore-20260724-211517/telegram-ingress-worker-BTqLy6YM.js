import { Worker } from "node:worker_threads";
//#region extensions/telegram/src/telegram-ingress-worker.ts
const TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER = "openclaw.telegram-ingress-worker";
const createTelegramIngressWorker = (options) => {
  const listeners = /* @__PURE__ */ new Set();
  const worker = new Worker(new URL("./telegram-ingress-worker.runtime.js", import.meta.url), {
    workerData: {
      ...options,
      runtime: TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER,
    },
  });
  const taskPromise = new Promise((resolve, reject) => {
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(/* @__PURE__ */ new Error(`Telegram ingress worker exited with code ${code}`));
    });
  });
  worker.on("message", (message) => {
    for (const listener of listeners) listener(message);
  });
  return {
    onMessage(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    ackSpooledUpdate(requestId, result) {
      try {
        Reflect.apply(Reflect.get(worker, "postMessage"), worker, [
          {
            type: "spool-ack",
            requestId,
            result,
          },
        ]);
      } catch {}
    },
    async stop() {
      Reflect.apply(Reflect.get(worker, "postMessage"), worker, [{ type: "stop" }]);
      const timeout = setTimeout(() => {
        worker.terminate();
      }, 15e3);
      timeout.unref?.();
      try {
        await taskPromise.catch(() => void 0);
      } finally {
        clearTimeout(timeout);
      }
    },
    task() {
      return taskPromise;
    },
  };
};
//#endregion
export { createTelegramIngressWorker as n, TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER as t };
