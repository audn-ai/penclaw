import { g as parseFiniteNumber, j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import {
  n as createTypingKeepaliveLoop,
  t as createTypingStartGuard,
} from "./typing-start-guard-BT0F1xjf.js";
//#region src/channels/typing.ts
const DEFAULT_MAX_CONSECUTIVE_TYPING_FAILURES = 2;
function resolvePositiveIntegerOption(value, fallback) {
  const parsed = parseFiniteNumber(value);
  return parsed === void 0 || parsed <= 0 ? fallback : Math.max(1, Math.floor(parsed));
}
function resolveKeepaliveIntervalMs(value) {
  return resolveTimerTimeoutMs(value, 3e3, 0);
}
function resolveDurationMsOption(value, fallback) {
  return resolveTimerTimeoutMs(value, fallback, 0);
}
function createTypingCallbacks(params) {
  const stop = params.stop;
  const keepaliveIntervalMs = resolveKeepaliveIntervalMs(params.keepaliveIntervalMs);
  const maxConsecutiveFailures = resolvePositiveIntegerOption(
    params.maxConsecutiveFailures,
    DEFAULT_MAX_CONSECUTIVE_TYPING_FAILURES,
  );
  const maxDurationMs = resolveDurationMsOption(params.maxDurationMs, 6e4);
  let stopSent = false;
  let closed = false;
  let ttlTimer;
  const startGuard = createTypingStartGuard({
    isSealed: () => closed,
    onStartError: params.onStartError,
    maxConsecutiveFailures,
    onTrip: () => {
      keepaliveLoop.stop();
    },
  });
  const fireStart = async () => {
    await startGuard.run(() => params.start());
  };
  const keepaliveLoop = createTypingKeepaliveLoop({
    intervalMs: keepaliveIntervalMs,
    onTick: fireStart,
  });
  const startTtlTimer = () => {
    if (maxDurationMs <= 0) return;
    clearTtlTimer();
    ttlTimer = setTimeout(() => {
      if (!closed) {
        console.warn(`[typing] TTL exceeded (${maxDurationMs}ms), auto-stopping typing indicator`);
        fireStop();
      }
    }, maxDurationMs);
    ttlTimer.unref?.();
  };
  const clearTtlTimer = () => {
    if (ttlTimer) {
      clearTimeout(ttlTimer);
      ttlTimer = void 0;
    }
  };
  const onReplyStart = async () => {
    if (closed) return;
    stopSent = false;
    startGuard.reset();
    keepaliveLoop.stop();
    clearTtlTimer();
    fireStart().then(() => {
      if (closed || startGuard.isTripped()) return;
      keepaliveLoop.start();
      startTtlTimer();
    });
    await Promise.resolve();
  };
  const fireStop = () => {
    closed = true;
    keepaliveLoop.stop();
    clearTtlTimer();
    if (!stop || stopSent) return;
    stopSent = true;
    stop().catch((err) => (params.onStopError ?? params.onStartError)(err));
  };
  return {
    onReplyStart,
    onIdle: fireStop,
    onCleanup: fireStop,
  };
}
//#endregion
export { createTypingCallbacks as t };
