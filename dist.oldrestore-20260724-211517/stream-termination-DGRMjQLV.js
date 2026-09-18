import { i as createAssistantMessageEventStream } from "./validation-BwJmh4hU.js";
import "./llm-CMBgEkcN.js";
//#region extensions/opencode-go/stream-termination.ts
/**
 * Default idle window used in production. Matches the runtime's shared
 * `DEFAULT_LLM_IDLE_TIMEOUT_MS` (120s) so non-cron interactive runs see
 * no behavior change versus the existing watchdog, while cron runs — for
 * which the runtime disables its idle watchdog entirely
 * (`resolveLlmIdleTimeoutMs` returns 0 when `trigger === "cron"` and no
 * explicit timeout is set) — finally get a provider-owned termination
 * well before the ~622s stuck-session recovery kicks in.
 */
const OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT = 12e4;
const OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT = 3e5;
function isOpencodeGoModel(model, providerId) {
  return Boolean(model) && typeof model === "object" ? model.provider === providerId : false;
}
function validTimeoutMs(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function resolveTimeoutMs(model, fallbackMs) {
  return validTimeoutMs(model?.requestTimeoutMs) ?? fallbackMs;
}
function isProviderProgressEvent(event) {
  return (
    event.type === "text_delta" ||
    event.type === "thinking_delta" ||
    event.type === "toolcall_delta" ||
    event.type === "text_end" ||
    event.type === "thinking_end" ||
    event.type === "toolcall_start" ||
    event.type === "toolcall_end"
  );
}
const STALLED_STREAM_ERROR_MESSAGE =
  "opencode-go stream timed out after provider-owned SSE boundary stalled";
function buildStalledErrorEvent(partial) {
  if (partial)
    return {
      type: "error",
      reason: "error",
      error: {
        ...partial,
        stopReason: "error",
        errorMessage: STALLED_STREAM_ERROR_MESSAGE,
      },
    };
  return {
    type: "error",
    reason: "error",
    error: synthesizeMinimalAssistantMessage(STALLED_STREAM_ERROR_MESSAGE, "error"),
  };
}
function buildUnterminatedErrorEvent(partial) {
  if (partial)
    return {
      type: "error",
      reason: "error",
      error: {
        ...partial,
        stopReason: "error",
        errorMessage: "opencode-go stream ended without a terminal event",
      },
    };
  return {
    type: "error",
    reason: "error",
    error: synthesizeMinimalAssistantMessage(
      "opencode-go stream ended without a terminal event",
      "error",
    ),
  };
}
function buildCaughtErrorEvent(partial, error) {
  const message = error instanceof Error ? error.message : String(error);
  if (partial)
    return {
      type: "error",
      reason: "error",
      error: {
        ...partial,
        stopReason: "error",
        errorMessage: message,
      },
    };
  return {
    type: "error",
    reason: "error",
    error: synthesizeMinimalAssistantMessage(message, "error"),
  };
}
function synthesizeMinimalAssistantMessage(errorMessage, stopReason) {
  return {
    role: "assistant",
    content: [],
    api: "openai-completions",
    provider: "opencode-go",
    model: "",
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      },
    },
    stopReason,
    errorMessage,
    timestamp: Date.now(),
  };
}
/**
 * Wraps an opencode-go provider stream function so that an SSE socket that
 * fails to deliver a first event or stops producing progress is aborted at the
 * provider-owned raw boundary via the injected AbortSignal, instead of waiting
 * for the much later shared runtime stuck-session recovery.
 *
 * Behavior:
 * - Provider-scoped: only applies when `model.provider === options.provider`.
 * - Idle-based: the timer covers stream creation, first event delivery, and
 *   every gap after provider progress begins; if no event arrives within
 *   `idleTimeoutMs`, the wrapper calls `controller.abort()` on the AbortSignal
 *   injected into the underlying call (so the OpenAI SDK request is genuinely
 *   interrupted, not just the iterator) and pushes a terminal `error` event
 *   downstream.
 * - Terminal-safe: when the underlying stream emits `done` or `error`, the
 *   wrapper forwards the event, clears all timers, and ends the stream.
 *
 * The wrapper never shortens the natural end of a normal completion, because
 * provider progress refreshes the idle timer and a terminal event cancels it entirely.
 */
function createOpencodeGoStalledStreamWrapper(underlying, options) {
  if (!options || options.idleTimeoutMs <= 0)
    throw new Error("createOpencodeGoStalledStreamWrapper requires idleTimeoutMs > 0");
  if (options.firstEventTimeoutMs !== void 0 && options.firstEventTimeoutMs <= 0)
    throw new Error("createOpencodeGoStalledStreamWrapper requires firstEventTimeoutMs > 0");
  const providerId = options.provider;
  const idleTimeoutMsDefault = options.idleTimeoutMs;
  const firstEventTimeoutMsDefault = options.firstEventTimeoutMs ?? options.idleTimeoutMs;
  return (model, context, callOptions) => {
    if (!isOpencodeGoModel(model, providerId)) return underlying(model, context, callOptions);
    const output = createAssistantMessageEventStream();
    const idleTimeoutMs = resolveTimeoutMs(model, idleTimeoutMsDefault);
    const firstEventTimeoutMs = resolveTimeoutMs(model, firstEventTimeoutMsDefault);
    const controller = new AbortController();
    const callerSignal = callOptions?.signal;
    const signal = callerSignal
      ? AbortSignal.any([callerSignal, controller.signal])
      : controller.signal;
    const wrappedOptions = {
      ...callOptions,
      firstEventTimeoutMs,
      signal,
    };
    let idleTimer;
    let lastSeenPartial;
    let settled = false;
    let baseIterator;
    const clearIdleTimer = () => {
      if (idleTimer !== void 0) {
        clearTimeout(idleTimer);
        idleTimer = void 0;
      }
    };
    const cleanup = () => {
      clearIdleTimer();
    };
    const releaseBaseStream = () => {
      if (baseIterator?.return) Promise.resolve(baseIterator.return()).catch(() => void 0);
    };
    const finishWith = (event) => {
      if (settled) return;
      settled = true;
      cleanup();
      output.push(event);
      output.end(event.type === "done" ? event.message : void 0);
    };
    const abortStalledStream = () => {
      if (settled) return;
      settled = true;
      clearIdleTimer();
      controller.abort(/* @__PURE__ */ new Error("opencode-go stream stalled"));
      releaseBaseStream();
      output.push(buildStalledErrorEvent(lastSeenPartial));
      output.end();
    };
    const armTimer = (timeoutMs) => {
      clearIdleTimer();
      idleTimer = setTimeout(abortStalledStream, timeoutMs);
      idleTimer.unref?.();
    };
    const armFirstEventTimer = () => armTimer(firstEventTimeoutMs);
    const armIdleTimer = () => armTimer(idleTimeoutMs);
    const trackPartial = (event) => {
      const partial = event.partial ?? event.message;
      if (partial) lastSeenPartial = partial;
    };
    const releaseResolvedStream = (baseStream) => {
      const iterator = baseStream[Symbol.asyncIterator]();
      if (iterator.return) Promise.resolve(iterator.return()).catch(() => void 0);
    };
    armFirstEventTimer();
    let baseStreamResult;
    try {
      baseStreamResult = underlying(model, context, wrappedOptions);
    } catch (error) {
      cleanup();
      throw error;
    }
    (async () => {
      try {
        const baseStream = await Promise.resolve(baseStreamResult);
        if (settled) {
          releaseResolvedStream(baseStream);
          return;
        }
        baseIterator = baseStream[Symbol.asyncIterator]();
        for (;;) {
          const result = await baseIterator.next();
          if (settled) return;
          if (result.done) {
            finishWith(buildUnterminatedErrorEvent(lastSeenPartial));
            return;
          }
          const event = result.value;
          if (event.type === "done" || event.type === "error") {
            trackPartial(event);
            finishWith(event);
            return;
          }
          trackPartial(event);
          output.push(event);
          if (isProviderProgressEvent(event)) armIdleTimer();
        }
      } catch (error) {
        if (!settled) finishWith(buildCaughtErrorEvent(lastSeenPartial, error));
      } finally {
        cleanup();
      }
    })();
    return output;
  };
}
//#endregion
export {
  OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT as n,
  createOpencodeGoStalledStreamWrapper as r,
  OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT as t,
};
