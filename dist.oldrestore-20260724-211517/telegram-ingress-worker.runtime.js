import { parentPort, workerData } from "node:worker_threads";
import { t as resolveTelegramAllowedUpdates } from "./allowed-updates-C8V4-A3j.js";
import "./response-limit-runtime-B_DBKaLw.js";
import { o as normalizeTelegramApiRoot, r as resolveTelegramTransport } from "./fetch-C3cVXJjY.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import {
  f as readTelegramRetryAfterMs,
  n as isRetryableTelegramApiError,
} from "./network-errors-CFprAVtH.js";
import { r as makeProxyFetch } from "./proxy-fetch-BNm7PiNO.js";
import "./telegram-ingress-worker-BTqLy6YM.js";
import {
  n as resolveTelegramLongPollTimeoutSeconds,
  t as TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS,
} from "./request-timeouts-B5fpzT_g.js";
//#region extensions/telegram/src/telegram-ingress-worker.runtime.ts
const pollLimit = 100;
const TELEGRAM_GET_UPDATES_MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
const retryInitialMs = 1e3;
const retryMaxMs = 3e4;
function sleep(ms, signal) {
  if (signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", done);
      resolve();
    };
    const timeout = setTimeout(done, ms);
    timeout.unref?.();
    signal.addEventListener("abort", done, { once: true });
  });
}
function formatErrorMessage(err) {
  if (err instanceof Error) return err.message || err.name;
  return String(err);
}
function readTelegramErrorCode(err) {
  if (err && typeof err === "object" && "error_code" in err) {
    const code = err.error_code;
    if (typeof code === "number") return code;
  }
}
function postPollError(port, err) {
  const errorCode = readTelegramErrorCode(err);
  port.postMessage({
    type: "poll-error",
    message: formatErrorMessage(err),
    ...(errorCode === void 0 ? {} : { errorCode }),
    finishedAt: Date.now(),
  });
}
function resolveBackoff(attempt) {
  return Math.min(retryMaxMs, retryInitialMs * 2 ** Math.max(0, attempt - 1));
}
function createTelegramGetUpdatesError(params) {
  return Object.assign(
    new Error(params.message),
    params.errorCode === void 0 ? {} : { error_code: params.errorCode },
    params.parameters === void 0 ? {} : { parameters: params.parameters },
  );
}
function rejectPendingSpoolRequests(pendingSpoolRequests, err) {
  for (const pending of pendingSpoolRequests.values()) pending.reject(err);
  pendingSpoolRequests.clear();
}
async function fetchJson(params) {
  const controller = new AbortController();
  params.setActiveController(controller);
  const timeout = setTimeout(() => {
    controller.abort(/* @__PURE__ */ new Error("Telegram getUpdates timed out"));
  }, TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS);
  timeout.unref?.();
  try {
    const response = await params.fetch(params.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(params.body),
      signal: controller.signal,
    });
    const raw = (
      await readResponseWithLimit(response, TELEGRAM_GET_UPDATES_MAX_RESPONSE_BYTES)
    ).toString("utf8");
    let json;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      if (!response.ok)
        throw createTelegramGetUpdatesError({
          message: `Telegram getUpdates failed with HTTP ${response.status}`,
          errorCode: response.status,
        });
      throw err;
    }
    if (!response.ok || json.ok !== true)
      throw createTelegramGetUpdatesError({
        message:
          typeof json.description === "string"
            ? json.description
            : `Telegram getUpdates failed with HTTP ${response.status}`,
        errorCode: typeof json.error_code === "number" ? json.error_code : response.status,
        parameters: json.parameters,
      });
    return json.result;
  } finally {
    clearTimeout(timeout);
    params.setActiveController(void 0);
  }
}
async function runTelegramIngressWorkerRuntime(params) {
  const { options, port } = params;
  const stopController = new AbortController();
  let stopped = false;
  let activeController;
  let nextSpoolRequestId = 0;
  const pendingSpoolRequests = /* @__PURE__ */ new Map();
  const proxyFetch = options.proxy ? makeProxyFetch(options.proxy) : void 0;
  const transport =
    params.deps?.fetch === void 0
      ? resolveTelegramTransport(proxyFetch, { network: options.network })
      : void 0;
  const fetchImpl = params.deps?.fetch ?? transport?.fetch ?? globalThis.fetch;
  const closeTransport =
    params.deps?.closeTransport ?? (() => transport?.close() ?? Promise.resolve());
  const getUpdatesUrl = `${normalizeTelegramApiRoot(options.apiRoot ?? "https://api.telegram.org")}/bot${options.token}/getUpdates`;
  const pollTimeoutSeconds = resolveTelegramLongPollTimeoutSeconds(options.timeoutSeconds);
  let lastUpdateId = options.initialUpdateId;
  let failures = 0;
  port.onMessage((message) => {
    if (message?.type === "stop") {
      stopped = true;
      const err = /* @__PURE__ */ new Error("telegram ingress worker stopped");
      stopController.abort(err);
      activeController?.abort(err);
      rejectPendingSpoolRequests(pendingSpoolRequests, err);
      return;
    }
    if (message?.type !== "spool-ack") return;
    const pending = pendingSpoolRequests.get(message.requestId);
    if (!pending) return;
    pendingSpoolRequests.delete(message.requestId);
    if (message.result.ok) {
      pending.resolve(message.result.updateId);
      return;
    }
    pending.reject(new Error(message.result.message));
  });
  const requestSpoolUpdate = async (requestParams) => {
    const requestId = String(++nextSpoolRequestId);
    return await new Promise((resolve, reject) => {
      pendingSpoolRequests.set(requestId, {
        resolve,
        reject,
      });
      port.postMessage({
        type: "update",
        requestId,
        update: requestParams.update,
        queued: requestParams.queued,
      });
    });
  };
  try {
    for (;;) {
      if (stopped) break;
      const offset = lastUpdateId === null ? null : lastUpdateId + 1;
      const startedAt = Date.now();
      port.postMessage({
        type: "poll-start",
        offset,
        startedAt,
      });
      try {
        const result = await fetchJson({
          fetch: fetchImpl,
          url: getUpdatesUrl,
          body: {
            timeout: pollTimeoutSeconds,
            limit: pollLimit,
            allowed_updates: resolveTelegramAllowedUpdates(),
            ...(offset === null ? {} : { offset }),
          },
          setActiveController(controller) {
            activeController = controller;
          },
        });
        if (!Array.isArray(result))
          throw new Error("Telegram getUpdates returned a non-array result.");
        for (const update of result) {
          if (stopped) break;
          const updateId = await requestSpoolUpdate({
            update,
            queued: result.length,
          });
          if (lastUpdateId === null || updateId > lastUpdateId) lastUpdateId = updateId;
          port.postMessage({
            type: "spooled",
            updateId,
            queued: result.length,
          });
        }
        failures = 0;
        port.postMessage({
          type: "poll-success",
          offset,
          count: result.length,
          finishedAt: Date.now(),
        });
      } catch (err) {
        if (stopped) break;
        failures += 1;
        postPollError(port, err);
        if (!isRetryableTelegramApiError(err, { context: "polling" })) throw err;
        await sleep(
          readTelegramRetryAfterMs(err) ?? resolveBackoff(failures),
          stopController.signal,
        );
      }
    }
  } finally {
    await closeTransport();
  }
}
const workerPort = parentPort;
const runtimePort =
  workerPort === null
    ? null
    : {
        postMessage(message) {
          Reflect.apply(Reflect.get(workerPort, "postMessage"), workerPort, [message]);
        },
        onMessage(listener) {
          workerPort.on("message", listener);
        },
        close() {
          workerPort.close();
        },
      };
const runtimeOptions =
  workerData &&
  typeof workerData === "object" &&
  "runtime" in workerData &&
  workerData.runtime === "openclaw.telegram-ingress-worker"
    ? workerData
    : null;
if (runtimePort && runtimeOptions) {
  let exitedAfterStop = false;
  runtimePort.onMessage((message) => {
    if (message?.type === "stop") exitedAfterStop = true;
  });
  runTelegramIngressWorkerRuntime({
    options: runtimeOptions,
    port: runtimePort,
  })
    .then(() => {
      runtimePort.close();
    })
    .catch((err) => {
      postPollError(runtimePort, err);
      runtimePort.close();
      process.exitCode = exitedAfterStop ? 0 : 1;
    });
}
//#endregion
export { runTelegramIngressWorkerRuntime };
