import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-B-n-wjMn.js";
//#region extensions/discord/src/monitor/timeouts.ts
const DISCORD_DEFAULT_LISTENER_TIMEOUT_MS = 12e4;
const DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS = 30 * 6e4;
const DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS = 6e4;
const DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS = 12e4;
/** @deprecated Discord listener timeouts are compatibility-only. */
function normalizeDiscordListenerTimeoutMs(raw) {
  if (!Number.isFinite(raw) || (raw ?? 0) <= 0) return DISCORD_DEFAULT_LISTENER_TIMEOUT_MS;
  return resolveTimerTimeoutMs(raw, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, 1e3);
}
/** @deprecated Discord no longer applies channel-owned inbound run timeouts. */
function normalizeDiscordInboundWorkerTimeoutMs(raw) {
  if (raw === 0) return;
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0)
    return DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS;
  return resolveTimerTimeoutMs(raw, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, 1);
}
/** @deprecated Compatibility helper for old Discord timeout integrations. */
function isAbortError(error) {
  if (typeof error !== "object" || error === null) return false;
  return "name" in error && String(error.name) === "AbortError";
}
function mergeAbortSignals(signals) {
  const activeSignals = signals.filter((signal) => Boolean(signal));
  return activeSignals.length > 1 ? AbortSignal.any(activeSignals) : activeSignals[0];
}
/** @deprecated Discord no longer uses this for channel-owned message run timeouts. */
async function runDiscordTaskWithTimeout(params) {
  const timeoutMs =
    params.timeoutMs === void 0 ? void 0 : resolveTimerTimeoutMs(params.timeoutMs, 0, 0);
  const timeoutAbortController = timeoutMs ? new AbortController() : void 0;
  const abortSignals = [...(params.abortSignals ?? []), timeoutAbortController?.signal].filter(
    (signal) => Boolean(signal),
  );
  const mergedAbortSignal =
    abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0];
  let timedOut = false;
  let timeoutHandle = null;
  const runPromise = params.run(mergedAbortSignal).catch((error) => {
    if (!timedOut) throw error;
    if (timeoutAbortController?.signal.aborted && isAbortError(error)) {
      params.onAbortAfterTimeout?.();
      return;
    }
    params.onErrorAfterTimeout?.(error);
  });
  try {
    if (!timeoutMs) {
      await runPromise;
      return false;
    }
    const timeoutPromise = new Promise((resolve) => {
      timeoutHandle = setTimeout(() => resolve("timeout"), timeoutMs);
      timeoutHandle.unref?.();
    });
    if ((await Promise.race([runPromise.then(() => "completed"), timeoutPromise])) === "timeout") {
      timedOut = true;
      timeoutAbortController?.abort();
      await params.onTimeout(timeoutMs);
      return true;
    }
    return false;
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}
async function raceWithTimeout(params) {
  const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
  let timeoutTimer;
  const timeoutPromise = new Promise((resolve) => {
    timeoutTimer = setTimeout(() => resolve(params.onTimeout()), timeoutMs);
    timeoutTimer.unref?.();
  });
  try {
    return await Promise.race([params.promise, timeoutPromise]);
  } finally {
    if (timeoutTimer) clearTimeout(timeoutTimer);
  }
}
async function withAbortTimeout(params) {
  const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
  const controller = new AbortController();
  let timeoutTimer;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutTimer = setTimeout(() => {
      controller.abort();
      reject(params.createTimeoutError());
    }, timeoutMs);
    timeoutTimer.unref?.();
  });
  try {
    return await Promise.race([params.run(controller.signal), timeoutPromise]);
  } finally {
    if (timeoutTimer) clearTimeout(timeoutTimer);
  }
}
//#endregion
export {
  isAbortError as a,
  normalizeDiscordListenerTimeoutMs as c,
  withAbortTimeout as d,
  DISCORD_DEFAULT_LISTENER_TIMEOUT_MS as i,
  raceWithTimeout as l,
  DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS as n,
  mergeAbortSignals as o,
  DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS as r,
  normalizeDiscordInboundWorkerTimeoutMs as s,
  DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS as t,
  runDiscordTaskWithTimeout as u,
};
