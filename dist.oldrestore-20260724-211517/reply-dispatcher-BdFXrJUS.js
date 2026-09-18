import { n as registerDispatcher } from "./dispatcher-registry-CaTZukRA.js";
import "./utils-DtcDeqWS.js";
import { t as normalizeReplyPayload } from "./normalize-reply-DyJ9i_w0.js";
import {
  a as getReplyPayloadMetadata,
  i as copyReplyPayloadMetadata,
} from "./reply-payload-BK_jICQ3.js";
import { r as generateSecureInt } from "./secure-random-Ds4AFLgz.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DKI4eGAu.js";
//#region src/auto-reply/reply/reply-dispatcher.types.ts
function readDispatcherFailedCounts(dispatcher) {
  return (
    dispatcher.getFailedCounts?.() ?? {
      tool: 0,
      block: 0,
      final: 0,
    }
  );
}
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.ts
const DEFAULT_HUMAN_DELAY_MIN_MS = 800;
const DEFAULT_HUMAN_DELAY_MAX_MS = 2500;
const DEFAULT_BEFORE_DELIVER_TIMEOUT_MS = 15e3;
const silentReplyLogger = createSubsystemLogger("silent-reply/dispatcher");
const beforeDeliverCancelledHooks = /* @__PURE__ */ new WeakMap();
const deliveryOutcomeTrackers = /* @__PURE__ */ new WeakMap();
const beforeDeliverStagesByHook = /* @__PURE__ */ new WeakMap();
var ReplyDispatchBeforeDeliverTimeoutError = class extends Error {
  constructor(timeoutMs) {
    super(`beforeDeliver timed out after ${timeoutMs}ms`);
    this.name = "ReplyDispatchBeforeDeliverTimeoutError";
  }
};
function resolveReplyDispatchBeforeDeliverTimeoutMs(options) {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_BEFORE_DELIVER_TIMEOUT_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new RangeError("beforeDeliver timeoutMs must be a positive finite number");
  return timeoutMs;
}
async function runReplyDispatchBeforeDeliverStage(stage, payload, info) {
  const timeoutMs = stage.timeoutMs;
  if (!timeoutMs) return await stage.hook(payload, info);
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new ReplyDispatchBeforeDeliverTimeoutError(timeoutMs)),
      timeoutMs,
    );
    timer.unref?.();
  });
  try {
    return await Promise.race([Promise.resolve(stage.hook(payload, info)), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
function resolveReplyDispatchBeforeDeliverStages(input) {
  if (!input) return [];
  if (typeof input === "function")
    return (
      beforeDeliverStagesByHook.get(input) ?? [
        {
          hook: input,
          timeoutMs: DEFAULT_BEFORE_DELIVER_TIMEOUT_MS,
        },
      ]
    );
  const existingStages = beforeDeliverStagesByHook.get(input.hook);
  if (existingStages) return existingStages;
  return [
    {
      hook: input.hook,
      timeoutMs: resolveReplyDispatchBeforeDeliverTimeoutMs(input.options),
    },
  ];
}
/** Compose core delivery stages while retaining a separate deadline for each actual hook. */
function composeReplyDispatchBeforeDeliver(...hooks) {
  const stages = [];
  for (const hook of hooks) if (hook) stages.push(...resolveReplyDispatchBeforeDeliverStages(hook));
  if (stages.length === 0) return;
  const composed = async (payload, info) => {
    let current = payload;
    for (const stage of stages) {
      if (!current) return null;
      const next = await runReplyDispatchBeforeDeliverStage(stage, current, info);
      current = next ? copyReplyPayloadMetadata(current, next) : null;
    }
    return current;
  };
  beforeDeliverStagesByHook.set(composed, stages);
  return composed;
}
/** Mark a core hook whose lifecycle owner controls settlement and any deadline. */
function markReplyDispatchBeforeDeliverDeadlineOwned(hook) {
  beforeDeliverStagesByHook.set(hook, [{ hook }]);
  return hook;
}
/** Adds a core-internal cancellation observer without expanding the plugin-facing dispatcher. */
function appendReplyDispatcherBeforeDeliverCancelled(dispatcher, hook) {
  const hooks = beforeDeliverCancelledHooks.get(dispatcher);
  if (!hooks) return false;
  hooks.push(hook);
  return true;
}
/** Capture one core-dispatcher delivery outcome without changing send* return types. */
function captureReplyDispatchDeliveryOutcome(payload) {
  let resolveOutcome;
  const tracker = {
    promise: new Promise((resolve) => {
      resolveOutcome = resolve;
    }),
    resolve: (outcome) => resolveOutcome(outcome),
    tracked: false,
  };
  deliveryOutcomeTrackers.set(payload, tracker);
  return {
    promise: tracker.promise,
    isTracked: () => tracker.tracked,
  };
}
function buildReplyDispatchRuntimeInfo(payload, kind) {
  const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
  return {
    kind,
    ...(assistantMessageIndex !== void 0 ? { assistantMessageIndex } : {}),
  };
}
/** Generate a random delay within the configured range. */
function getHumanDelay(config) {
  const mode = config?.mode ?? "off";
  if (mode === "off") return 0;
  const min =
    mode === "custom" ? (config?.minMs ?? DEFAULT_HUMAN_DELAY_MIN_MS) : DEFAULT_HUMAN_DELAY_MIN_MS;
  const max =
    mode === "custom" ? (config?.maxMs ?? DEFAULT_HUMAN_DELAY_MAX_MS) : DEFAULT_HUMAN_DELAY_MAX_MS;
  if (max <= min) return min;
  return min + generateSecureInt(max - min + 1);
}
function getHumanDelayMax(config) {
  const mode = config?.mode ?? "off";
  if (mode === "off") return 0;
  const min =
    mode === "custom" ? (config?.minMs ?? DEFAULT_HUMAN_DELAY_MIN_MS) : DEFAULT_HUMAN_DELAY_MIN_MS;
  const max =
    mode === "custom" ? (config?.maxMs ?? DEFAULT_HUMAN_DELAY_MAX_MS) : DEFAULT_HUMAN_DELAY_MAX_MS;
  return max <= min ? min : max;
}
function normalizeReplyPayloadInternal(payload, opts) {
  const prefixContext = opts.responsePrefixContextProvider?.() ?? opts.responsePrefixContext;
  return normalizeReplyPayload(payload, {
    responsePrefix: opts.responsePrefix,
    responsePrefixContext: prefixContext,
    onHeartbeatStrip: opts.onHeartbeatStrip,
    transformReplyPayload: opts.transformReplyPayload,
    onSkip: opts.onSkip,
  });
}
function createReplyDispatcher(options) {
  let beforeDeliver = composeReplyDispatchBeforeDeliver(
    options.beforeDeliver
      ? {
          hook: options.beforeDeliver,
          options: options.beforeDeliverOptions,
        }
      : void 0,
  );
  const appendedBeforeDeliverCancelledHooks = [];
  let sendChain = Promise.resolve();
  let pending = 1;
  let completeCalled = false;
  let sentFirstBlock = false;
  const queuedCounts = {
    tool: 0,
    block: 0,
    final: 0,
  };
  const failedCounts = {
    tool: 0,
    block: 0,
    final: 0,
  };
  const cancelledCounts = {
    tool: 0,
    block: 0,
    final: 0,
  };
  const { unregister } = registerDispatcher({
    pending: () => pending,
    waitForIdle: () => sendChain,
  });
  const reportObserverError = (err, info) => {
    Promise.resolve(options.onError?.(err, info)).catch(() => void 0);
  };
  const notifyBeforeDeliverCancelled = async (payload, info) => {
    const observers = [
      ...(options.onBeforeDeliverCancelled ? [options.onBeforeDeliverCancelled] : []),
      ...appendedBeforeDeliverCancelledHooks,
    ];
    for (const observer of observers)
      try {
        await runReplyDispatchBeforeDeliverStage(
          {
            hook: async (current, currentInfo) => {
              await observer(current, currentInfo);
              return current;
            },
            timeoutMs: DEFAULT_BEFORE_DELIVER_TIMEOUT_MS,
          },
          payload,
          info,
        );
      } catch (err) {
        reportObserverError(err, info);
      }
  };
  const enqueue = (kind, payload) => {
    const originalWasExactSilent = isSilentReplyText(payload.text, SILENT_REPLY_TOKEN);
    const normalized = normalizeReplyPayloadInternal(payload, {
      responsePrefix: options.responsePrefix,
      responsePrefixContext: options.responsePrefixContext,
      responsePrefixContextProvider: options.responsePrefixContextProvider,
      transformReplyPayload: options.transformReplyPayload,
      onHeartbeatStrip: options.onHeartbeatStrip,
      onSkip: (reason) =>
        options.onSkip?.(payload, {
          ...buildReplyDispatchRuntimeInfo(payload, kind),
          reason,
        }),
    });
    if (!normalized) {
      if (kind === "final" && originalWasExactSilent)
        silentReplyLogger.debug("exact NO_REPLY final payload was skipped before delivery", {
          hasSessionKey: Boolean(options.silentReplyContext?.sessionKey),
          surface: options.silentReplyContext?.surface,
          conversationType: options.silentReplyContext?.conversationType,
        });
      return false;
    }
    queuedCounts[kind] += 1;
    pending += 1;
    const deliveryOutcomeTracker = deliveryOutcomeTrackers.get(payload);
    if (deliveryOutcomeTracker) deliveryOutcomeTracker.tracked = true;
    const shouldDelay = kind === "block" && sentFirstBlock;
    if (kind === "block") sentFirstBlock = true;
    let deliveryStarted = false;
    let deliveryOutcome = "failed-before-deliver";
    sendChain = sendChain
      .then(async () => {
        if (shouldDelay) {
          const delayMs = getHumanDelay(options.humanDelay);
          if (delayMs > 0) await sleep(delayMs);
        }
        const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
        let deliverPayload = normalized;
        if (beforeDeliver) {
          try {
            deliverPayload = await beforeDeliver(normalized, dispatchInfo);
          } catch (err) {
            await notifyBeforeDeliverCancelled(normalized, dispatchInfo);
            throw err;
          }
          if (!deliverPayload) {
            deliveryOutcome = "cancelled";
            cancelledCounts[kind] += 1;
            await notifyBeforeDeliverCancelled(normalized, dispatchInfo);
            return;
          }
          deliverPayload = copyReplyPayloadMetadata(normalized, deliverPayload);
        }
        deliveryStarted = true;
        await options.deliver(deliverPayload, dispatchInfo);
        deliveryOutcome = "delivered";
      })
      .catch((err) => {
        deliveryOutcome = deliveryStarted ? "failed-deliver" : "failed-before-deliver";
        failedCounts[kind] += 1;
        options.onError?.(err, buildReplyDispatchRuntimeInfo(normalized, kind));
      })
      .finally(() => {
        const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
        deliveryOutcomeTracker?.resolve(deliveryOutcome);
        deliveryOutcomeTrackers.delete(payload);
        try {
          options.onDeliverySettled?.(dispatchInfo);
        } catch (err) {
          reportObserverError(err, dispatchInfo);
        }
        pending -= 1;
        if (pending === 1 && completeCalled) pending -= 1;
        if (pending === 0) {
          unregister();
          options.onIdle?.();
        }
      });
    return true;
  };
  const markComplete = () => {
    if (completeCalled) return;
    completeCalled = true;
    Promise.resolve().then(() => {
      if (pending === 1 && completeCalled) {
        pending -= 1;
        if (pending === 0) {
          unregister();
          options.onIdle?.();
        }
      }
    });
  };
  const dispatcher = {
    sendToolResult: (payload) => enqueue("tool", payload),
    sendBlockReply: (payload) => enqueue("block", payload),
    sendFinalReply: (payload) => enqueue("final", payload),
    appendBeforeDeliver: (hook, stageOptions) => {
      beforeDeliver = composeReplyDispatchBeforeDeliver(beforeDeliver, {
        hook,
        options: stageOptions,
      });
    },
    waitForIdle: () => sendChain,
    getQueuedCounts: () => ({ ...queuedCounts }),
    getCancelledCounts: () => ({ ...cancelledCounts }),
    getFailedCounts: () => ({ ...failedCounts }),
    markComplete,
    resolveFollowupAdmissionBarrierTimeoutPolicy:
      options.resolveFollowupAdmissionBarrierTimeoutPolicy
        ? () =>
            options.resolveFollowupAdmissionBarrierTimeoutPolicy?.({
              queuedCounts: { ...queuedCounts },
              humanDelayBudgetMs:
                Math.max(0, queuedCounts.block - 1) * getHumanDelayMax(options.humanDelay),
            })
        : void 0,
  };
  beforeDeliverCancelledHooks.set(dispatcher, appendedBeforeDeliverCancelledHooks);
  return dispatcher;
}
async function waitForReplyDispatcherIdle(dispatcher, abortSignal) {
  if (!abortSignal) {
    await dispatcher.waitForIdle();
    return;
  }
  if (abortSignal.aborted) return;
  let removeAbortListener;
  const aborted = new Promise((resolve) => {
    const onAbort = () => resolve();
    abortSignal.addEventListener("abort", onAbort, { once: true });
    removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
  });
  try {
    await Promise.race([dispatcher.waitForIdle(), aborted]);
  } finally {
    removeAbortListener?.();
  }
}
function createReplyDispatcherWithTyping(options) {
  const {
    typingCallbacks,
    onReplyStart,
    onIdle,
    onSettled: _onSettled,
    onFreshSettledDelivery: _onFreshSettledDelivery,
    onCleanup,
    ...dispatcherOptions
  } = options;
  const resolvedOnReplyStart = onReplyStart ?? typingCallbacks?.onReplyStart;
  const resolvedOnIdle = onIdle ?? typingCallbacks?.onIdle;
  const resolvedOnCleanup = onCleanup ?? typingCallbacks?.onCleanup;
  let typingController;
  return {
    dispatcher: createReplyDispatcher({
      ...dispatcherOptions,
      onIdle: () => {
        typingController?.markDispatchIdle();
        return resolvedOnIdle?.();
      },
    }),
    replyOptions: {
      onReplyStart: resolvedOnReplyStart,
      onTypingCleanup: resolvedOnCleanup,
      onTypingController: (typing) => {
        typingController = typing;
      },
    },
    markDispatchIdle: () => {
      typingController?.markDispatchIdle();
      resolvedOnIdle?.();
    },
    markRunComplete: () => {
      typingController?.markRunComplete();
    },
  };
}
//#endregion
export {
  createReplyDispatcherWithTyping as a,
  readDispatcherFailedCounts as c,
  createReplyDispatcher as i,
  captureReplyDispatchDeliveryOutcome as n,
  markReplyDispatchBeforeDeliverDeadlineOwned as o,
  composeReplyDispatchBeforeDeliver as r,
  waitForReplyDispatcherIdle as s,
  appendReplyDispatcherBeforeDeliverCancelled as t,
};
