import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
//#region src/channels/draft-stream-loop.ts
/**
 * Throttled draft stream loop.
 *
 * Sends the latest pending draft text with single-flight edit semantics.
 */
/** Creates a single-flight draft stream loop that preserves the newest pending text. */
function createDraftStreamLoop(params) {
  const throttleMs = resolveTimerTimeoutMs(params.throttleMs, 0, 0);
  let lastSentAt = 0;
  let pendingText = "";
  let inFlightPromise;
  let timer;
  const flush = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    while (!params.isStopped()) {
      if (inFlightPromise) {
        await inFlightPromise;
        continue;
      }
      const text = pendingText;
      if (!text.trim()) {
        pendingText = "";
        return;
      }
      pendingText = "";
      let current;
      try {
        current = Promise.resolve(params.sendOrEditStreamMessage(text)).finally(() => {
          if (inFlightPromise === current) inFlightPromise = void 0;
        });
      } catch (err) {
        pendingText ||= text;
        throw err;
      }
      inFlightPromise = current;
      let sent;
      try {
        sent = await current;
      } catch (err) {
        pendingText ||= text;
        throw err;
      }
      if (sent === false) {
        pendingText = text;
        return;
      }
      lastSentAt = Date.now();
      if (!pendingText) return;
    }
  };
  const startBackgroundFlush = () => {
    flush().catch((err) => {
      try {
        params.onBackgroundFlushError?.(err);
      } catch {}
    });
  };
  const schedule = () => {
    if (timer) return;
    const delay = Math.max(0, throttleMs - (Date.now() - lastSentAt));
    timer = setTimeout(() => {
      startBackgroundFlush();
    }, delay);
  };
  return {
    update: (text) => {
      if (params.isStopped()) return;
      pendingText = text;
      if (inFlightPromise) {
        schedule();
        return;
      }
      if (!timer && Date.now() - lastSentAt >= throttleMs) {
        startBackgroundFlush();
        return;
      }
      schedule();
    },
    flush,
    stop: () => {
      pendingText = "";
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
    },
    resetPending: () => {
      pendingText = "";
    },
    resetThrottleWindow: () => {
      lastSentAt = 0;
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
    },
    waitForInFlight: async () => {
      if (inFlightPromise) await inFlightPromise;
    },
    takePending: () => {
      const text = pendingText;
      pendingText = "";
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
      return text;
    },
  };
}
//#endregion
//#region src/channels/draft-stream-controls.ts
/**
 * Finalizable draft stream controls.
 *
 * Coordinates preview updates, final flushes, clears, and deletion callbacks for channel drafts.
 */
/**
 * Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
 */
function createFinalizableDraftStreamControls(params) {
  const loop = createDraftStreamLoop({
    throttleMs: params.throttleMs,
    isStopped: params.isStopped,
    sendOrEditStreamMessage: params.sendOrEditStreamMessage,
  });
  const update = (text) => {
    if (params.isStopped() || params.isFinal()) return;
    loop.update(text);
  };
  const stop = async () => {
    params.markFinal();
    await loop.flush();
  };
  const stopForClear = async () => {
    params.markStopped();
    loop.stop();
    await loop.waitForInFlight();
  };
  const seal = async () => {
    params.markFinal();
    loop.stop();
    await loop.waitForInFlight();
  };
  return {
    loop,
    update,
    stop,
    seal,
    discardPending: stopForClear,
    stopForClear,
  };
}
/**
 * Creates finalizable draft controls backed by a shared mutable state object.
 */
function createFinalizableDraftStreamControlsForState(params) {
  return createFinalizableDraftStreamControls({
    throttleMs: params.throttleMs,
    isStopped: () => params.state.stopped,
    isFinal: () => params.state.final,
    markStopped: () => {
      params.state.stopped = true;
    },
    markFinal: () => {
      params.state.final = true;
    },
    sendOrEditStreamMessage: params.sendOrEditStreamMessage,
  });
}
/**
 * Stops a draft stream, reads the current preview message id, then clears the stored id.
 */
async function takeMessageIdAfterStop(params) {
  await params.stopForClear();
  const messageId = params.readMessageId();
  params.clearMessageId();
  return messageId;
}
async function deleteFinalizableDraftMessage(params, messageId) {
  try {
    await params.deleteMessage(messageId);
  } catch (err) {
    params.warn?.(`${params.warnPrefix}: ${formatErrorMessage(err)}`);
    return false;
  }
  try {
    if (Object.is(params.readMessageId(), messageId)) params.clearMessageId();
    params.onDeleteSuccess?.(messageId);
  } catch (err) {
    params.warn?.(`${params.warnPrefix} after delete: ${formatErrorMessage(err)}`);
  }
  return true;
}
/**
 * Stops a draft stream and deletes its preview message when the stored id is valid.
 * Claims the current id before deletion; stateful callers can retain failures through
 * onDeleteFailure without making overlapping clears delete the same message twice.
 */
async function clearFinalizableDraftMessage(params) {
  await params.stopForClear();
  const messageId = params.readMessageId();
  params.clearMessageId();
  if (!params.isValidMessageId(messageId)) return;
  if (!(await deleteFinalizableDraftMessage(params, messageId)))
    params.onDeleteFailure?.(messageId);
}
/**
 * Builds the standard draft lifecycle used by channel streaming preview implementations.
 */
function createFinalizableDraftLifecycle(params) {
  const controls = createFinalizableDraftStreamControlsForState({
    throttleMs: params.throttleMs,
    state: params.state,
    sendOrEditStreamMessage: params.sendOrEditStreamMessage,
  });
  let pendingDeleteIds = [];
  let clearTail = Promise.resolve();
  const clearOnce = async (stopForClear) => {
    await stopForClear();
    const currentMessageId = params.readMessageId();
    const deleteIds = pendingDeleteIds;
    pendingDeleteIds = [];
    if (!params.isValidMessageId(currentMessageId)) params.clearMessageId();
    else if (!deleteIds.some((messageId) => Object.is(messageId, currentMessageId)))
      deleteIds.push(currentMessageId);
    for (const messageId of deleteIds)
      if (
        !(await deleteFinalizableDraftMessage(params, messageId)) &&
        !pendingDeleteIds.some((pendingId) => Object.is(pendingId, messageId))
      )
        pendingDeleteIds.push(messageId);
  };
  const clearWithStop = (stopForClear) => {
    const clearRun = clearTail.catch(() => {}).then(() => clearOnce(stopForClear));
    clearTail = clearRun;
    return clearRun;
  };
  const clear = () => clearWithStop(controls.stopForClear);
  return {
    ...controls,
    clear,
    clearWithStop,
  };
}
//#endregion
export {
  takeMessageIdAfterStop as a,
  createFinalizableDraftStreamControlsForState as i,
  createFinalizableDraftLifecycle as n,
  createDraftStreamLoop as o,
  createFinalizableDraftStreamControls as r,
  clearFinalizableDraftMessage as t,
};
