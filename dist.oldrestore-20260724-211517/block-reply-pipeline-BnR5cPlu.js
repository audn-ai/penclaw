import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { d as clampPositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import {
  a as getReplyPayloadMetadata,
  i as copyReplyPayloadMetadata,
  l as isReplyPayloadStatusNotice,
} from "./reply-payload-BK_jICQ3.js";
import {
  m as resolveSendableOutboundReplyParts,
  s as hasOutboundReplyContent,
} from "./reply-payload-DDwHXDkv.js";
//#region src/auto-reply/reply/block-reply-coalescer.ts
/** Creates a text coalescer with idle and size-based flush behavior. */
function createBlockReplyCoalescer(params) {
  const { config, shouldAbort, onFlush } = params;
  const minChars = Math.max(1, Math.floor(config.minChars));
  const maxChars = Math.max(minChars, Math.floor(config.maxChars));
  const idleMs = Math.max(0, Math.floor(config.idleMs));
  const joiner = config.joiner ?? "";
  const flushOnEnqueue = config.flushOnEnqueue === true;
  let bufferText = "";
  let bufferReplyToId;
  let bufferAudioAsVoice;
  let bufferIsReasoning;
  let bufferIsCommentary;
  let bufferIsCompactionNotice;
  let bufferIsFallbackNotice;
  let bufferIsStatusNotice;
  let bufferMetadataSource;
  let idleTimer;
  const clearIdleTimer = () => {
    if (!idleTimer) return;
    clearTimeout(idleTimer);
    idleTimer = void 0;
  };
  const resetBuffer = () => {
    bufferText = "";
    bufferReplyToId = void 0;
    bufferAudioAsVoice = void 0;
    bufferIsReasoning = void 0;
    bufferIsCommentary = void 0;
    bufferIsCompactionNotice = void 0;
    bufferIsFallbackNotice = void 0;
    bufferIsStatusNotice = void 0;
    bufferMetadataSource = void 0;
  };
  const startBufferFromPayload = (payload) => {
    bufferReplyToId = payload.replyToId;
    bufferAudioAsVoice = payload.audioAsVoice;
    bufferIsReasoning = payload.isReasoning;
    bufferIsCommentary = payload.isCommentary;
    bufferIsCompactionNotice = payload.isCompactionNotice;
    bufferIsFallbackNotice = payload.isFallbackNotice;
    bufferIsStatusNotice = payload.isStatusNotice;
    bufferMetadataSource = payload;
  };
  const scheduleIdleFlush = () => {
    if (idleMs <= 0) return;
    clearIdleTimer();
    idleTimer = setTimeout(() => {
      flush({ force: false });
    }, idleMs);
  };
  const flush = async (options) => {
    clearIdleTimer();
    if (shouldAbort()) {
      resetBuffer();
      return;
    }
    if (!bufferText) return;
    if (!options?.force && !flushOnEnqueue && bufferText.length < minChars) {
      scheduleIdleFlush();
      return;
    }
    const payload = {
      text: bufferText,
      replyToId: bufferReplyToId,
      audioAsVoice: bufferAudioAsVoice,
      isReasoning: bufferIsReasoning,
      isCommentary: bufferIsCommentary,
      isCompactionNotice: bufferIsCompactionNotice,
      isFallbackNotice: bufferIsFallbackNotice,
      isStatusNotice: bufferIsStatusNotice,
    };
    const payloadWithMetadata = copyReplyPayloadMetadata(bufferMetadataSource ?? payload, payload);
    resetBuffer();
    await onFlush(payloadWithMetadata);
  };
  const canMergeBufferedTextWithMedia = (payload) =>
    Boolean(bufferText) &&
    !flushOnEnqueue &&
    !bufferAudioAsVoice &&
    !payload.audioAsVoice &&
    !payload.isReasoning &&
    !payload.isCommentary &&
    !isReplyPayloadStatusNotice(payload) &&
    !bufferIsReasoning &&
    !bufferIsCommentary &&
    !isReplyPayloadStatusNotice({
      isCompactionNotice: bufferIsCompactionNotice,
      isFallbackNotice: bufferIsFallbackNotice,
      isStatusNotice: bufferIsStatusNotice,
    }) &&
    (!payload.replyToId || bufferReplyToId === payload.replyToId);
  /** Merges buffered text into a media payload without changing media metadata. */
  const mergeBufferedTextWithMedia = (payload, text) => {
    const mergedText = text ? `${bufferText}${joiner}${text}` : bufferText;
    const mergedPayload = {
      ...payload,
      text: mergedText,
      replyToId: payload.replyToId ?? bufferReplyToId,
    };
    const metadataMergedPayload = copyReplyPayloadMetadata(
      bufferMetadataSource ?? mergedPayload,
      mergedPayload,
    );
    resetBuffer();
    return copyReplyPayloadMetadata(payload, metadataMergedPayload);
  };
  const enqueue = (payload) => {
    if (shouldAbort()) return;
    const reply = resolveSendableOutboundReplyParts(payload);
    const hasMedia = reply.hasMedia;
    const text = reply.text;
    const hasText = reply.hasText;
    if (hasMedia) {
      if (canMergeBufferedTextWithMedia(payload)) {
        onFlush(mergeBufferedTextWithMedia(payload, text));
        return;
      }
      flush({ force: true });
      onFlush(payload);
      return;
    }
    if (!hasText) return;
    if (flushOnEnqueue) {
      if (bufferText) flush({ force: true });
      startBufferFromPayload(payload);
      bufferText = text;
      flush({ force: true });
      return;
    }
    const replyToConflict = Boolean(
      bufferText &&
      payload.replyToId &&
      (!bufferReplyToId || bufferReplyToId !== payload.replyToId),
    );
    const visibilityConflict =
      bufferText &&
      (bufferIsReasoning !== payload.isReasoning ||
        bufferIsCommentary !== payload.isCommentary ||
        bufferIsCompactionNotice !== payload.isCompactionNotice ||
        bufferIsFallbackNotice !== payload.isFallbackNotice ||
        isReplyPayloadStatusNotice({
          isCompactionNotice: bufferIsCompactionNotice,
          isFallbackNotice: bufferIsFallbackNotice,
          isStatusNotice: bufferIsStatusNotice,
        }) !== isReplyPayloadStatusNotice(payload));
    if (
      bufferText &&
      (replyToConflict || bufferAudioAsVoice !== payload.audioAsVoice || visibilityConflict)
    )
      flush({ force: true });
    if (!bufferText) startBufferFromPayload(payload);
    const nextText = bufferText ? `${bufferText}${joiner}${text}` : text;
    if (nextText.length > maxChars) {
      if (bufferText) {
        flush({ force: true });
        startBufferFromPayload(payload);
        if (text.length >= maxChars) {
          onFlush(payload);
          return;
        }
        bufferText = text;
        scheduleIdleFlush();
        return;
      }
      onFlush(payload);
      return;
    }
    bufferText = nextText;
    if (bufferText.length >= maxChars) {
      flush({ force: true });
      return;
    }
    scheduleIdleFlush();
  };
  return {
    enqueue,
    flush,
    hasBuffered: () => Boolean(bufferText),
    stop: () => clearIdleTimer(),
  };
}
//#endregion
//#region src/auto-reply/reply/block-reply-pipeline.ts
/** Buffers audio payloads so final delivery can preserve voice presentation. */
function createAudioAsVoiceBuffer(params) {
  let seenAudioAsVoice = false;
  return {
    onEnqueue: (payload) => {
      if (payload.audioAsVoice) seenAudioAsVoice = true;
    },
    shouldBuffer: (payload) => params.isAudioPayload(payload),
    finalize: (payload) =>
      seenAudioAsVoice
        ? {
            ...payload,
            audioAsVoice: true,
          }
        : payload,
  };
}
/** Creates a stable duplicate key for a complete outbound payload. */
function createBlockReplyPayloadKey(payload) {
  const reply = resolveSendableOutboundReplyParts(payload);
  return JSON.stringify({
    statusNotice: isReplyPayloadStatusNotice(payload),
    text: reply.trimmedText,
    mediaList: reply.mediaUrls,
    presentation: payload.presentation ?? null,
    interactive: payload.interactive ?? null,
    channelData: payload.channelData ?? null,
    replyToId: payload.replyToId ?? null,
  });
}
/** Creates a duplicate key that ignores reply target for final suppression. */
function createBlockReplyContentKey(payload) {
  const reply = resolveSendableOutboundReplyParts(payload);
  return JSON.stringify({
    text: reply.trimmedText,
    mediaList: reply.mediaUrls,
    presentation: payload.presentation ?? null,
    interactive: payload.interactive ?? null,
    channelData: payload.channelData ?? null,
  });
}
const withTimeout = async (promise, timeoutMs, timeoutError) => {
  if (!timeoutMs || timeoutMs <= 0) return promise;
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(timeoutError), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};
function resolveBlockReplyTimeoutMs(timeoutMs) {
  return clampPositiveTimerTimeoutMs(timeoutMs) ?? 0;
}
/** Creates the ordered block reply delivery pipeline for streamed payloads. */
function createBlockReplyPipeline(params) {
  const { onBlockReply, coalescing, buffer } = params;
  const timeoutMs = resolveBlockReplyTimeoutMs(params.timeoutMs);
  const sentKeys = /* @__PURE__ */ new Set();
  const sentContentKeys = /* @__PURE__ */ new Set();
  const sentMediaUrls = /* @__PURE__ */ new Set();
  const pendingKeys = /* @__PURE__ */ new Set();
  const seenKeys = /* @__PURE__ */ new Set();
  const bufferedKeys = /* @__PURE__ */ new Set();
  const bufferedPayloadKeys = /* @__PURE__ */ new Set();
  const bufferedPayloads = [];
  const streamedTextFragmentsByMessage = /* @__PURE__ */ new Map();
  let bufferedAssistantMessageIndex;
  let sendChain = Promise.resolve();
  let aborted = false;
  let didStream = false;
  let didStreamTerminalReply = false;
  let didLogTimeout = false;
  const hasSeenOrQueuedPayloadKey = (payloadKey) =>
    seenKeys.has(payloadKey) || sentKeys.has(payloadKey) || pendingKeys.has(payloadKey);
  const flushBufferedAssistantBlock = () => {
    bufferedAssistantMessageIndex = void 0;
    coalescer?.flush({ force: true });
  };
  const sendPayload = (payload, bypassSeenCheck = false) => {
    if (aborted) return;
    const payloadKey = createBlockReplyPayloadKey(payload);
    const contentKey = createBlockReplyContentKey(payload);
    if (!bypassSeenCheck) {
      if (seenKeys.has(payloadKey)) return;
      seenKeys.add(payloadKey);
    }
    if (sentKeys.has(payloadKey) || pendingKeys.has(payloadKey)) return;
    pendingKeys.add(payloadKey);
    const timeoutError = /* @__PURE__ */ new Error(
      `block reply delivery timed out after ${timeoutMs}ms`,
    );
    const abortController = new AbortController();
    sendChain = sendChain
      .then(async () => {
        if (aborted) return false;
        await withTimeout(
          Promise.resolve(
            onBlockReply(payload, {
              abortSignal: abortController.signal,
              timeoutMs,
            }),
          ),
          timeoutMs,
          timeoutError,
        );
        return true;
      })
      .then((didSend) => {
        if (!didSend) return;
        sentKeys.add(payloadKey);
        const isStatusNotice = isReplyPayloadStatusNotice(payload);
        if (!isStatusNotice) sentContentKeys.add(contentKey);
        const reply = resolveSendableOutboundReplyParts(payload);
        for (const mediaUrl of reply.mediaUrls) sentMediaUrls.add(mediaUrl);
        if (!isStatusNotice && reply.trimmedText) {
          const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
          const fragments = streamedTextFragmentsByMessage.get(assistantMessageIndex) ?? [];
          fragments.push(reply.trimmedText);
          streamedTextFragmentsByMessage.set(assistantMessageIndex, fragments);
        }
        if (!isStatusNotice) {
          didStream = true;
          if (
            payload.isReasoning !== true &&
            payload.isCommentary !== true &&
            hasOutboundReplyContent(payload, { trimText: true })
          )
            didStreamTerminalReply = true;
        }
      })
      .catch((err) => {
        if (err === timeoutError) {
          abortController.abort();
          aborted = true;
          if (!didLogTimeout) {
            didLogTimeout = true;
            logVerbose(
              `block reply delivery timed out after ${timeoutMs}ms; skipping remaining block replies to preserve ordering`,
            );
          }
          return;
        }
        logVerbose(`block reply delivery failed: ${String(err)}`);
      })
      .finally(() => {
        pendingKeys.delete(payloadKey);
      });
  };
  const coalescer = coalescing
    ? createBlockReplyCoalescer({
        config: coalescing,
        shouldAbort: () => aborted,
        onFlush: (payload) => {
          bufferedAssistantMessageIndex = void 0;
          bufferedKeys.clear();
          sendPayload(payload, true);
        },
      })
    : null;
  const bufferPayload = (payload) => {
    buffer?.onEnqueue?.(payload);
    if (!buffer?.shouldBuffer(payload)) return false;
    const payloadKey = createBlockReplyPayloadKey(payload);
    if (hasSeenOrQueuedPayloadKey(payloadKey) || bufferedPayloadKeys.has(payloadKey)) return true;
    seenKeys.add(payloadKey);
    bufferedPayloadKeys.add(payloadKey);
    bufferedPayloads.push(payload);
    return true;
  };
  const flushBuffered = () => {
    if (!bufferedPayloads.length) return;
    for (const payload of bufferedPayloads) {
      const finalPayload = buffer?.finalize?.(payload) ?? payload;
      sendPayload(finalPayload, true);
    }
    bufferedPayloads.length = 0;
    bufferedPayloadKeys.clear();
  };
  const enqueueCoalescedPayload = (payload) => {
    if (!coalescer) return;
    const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
    if (
      assistantMessageIndex !== void 0 &&
      bufferedAssistantMessageIndex !== void 0 &&
      assistantMessageIndex !== bufferedAssistantMessageIndex &&
      coalescer.hasBuffered()
    )
      flushBufferedAssistantBlock();
    const payloadKey = createBlockReplyPayloadKey(payload);
    if (hasSeenOrQueuedPayloadKey(payloadKey) || bufferedKeys.has(payloadKey)) return;
    seenKeys.add(payloadKey);
    bufferedKeys.add(payloadKey);
    bufferedAssistantMessageIndex = assistantMessageIndex;
    coalescer.enqueue(payload);
  };
  const enqueue = (payload) => {
    if (aborted) return;
    if (bufferPayload(payload)) return;
    const reply = resolveSendableOutboundReplyParts(payload);
    const hasNonTextContent = hasOutboundReplyContent(
      {
        ...payload,
        text: void 0,
        mediaUrl: void 0,
        mediaUrls: void 0,
      },
      { trimText: true },
    );
    if (reply.hasMedia && coalescer && !hasNonTextContent) {
      enqueueCoalescedPayload(payload);
      return;
    }
    if (reply.hasMedia || hasNonTextContent) {
      coalescer?.flush({ force: true });
      sendPayload(payload, false);
      return;
    }
    if (coalescer) {
      enqueueCoalescedPayload(payload);
      return;
    }
    sendPayload(payload, false);
  };
  const flush = async (options) => {
    await coalescer?.flush(options);
    bufferedAssistantMessageIndex = void 0;
    flushBuffered();
    await sendChain;
  };
  const stop = () => {
    coalescer?.stop();
  };
  return {
    enqueue,
    flush,
    stop,
    hasBuffered: () => coalescer?.hasBuffered() || bufferedPayloads.length > 0,
    didStream: () => didStream,
    didStreamTerminalReply: () => didStreamTerminalReply,
    isAborted: () => aborted,
    hasSentExactPayload: (payload) => sentContentKeys.has(createBlockReplyContentKey(payload)),
    hasSentPayload: (payload) => {
      const payloadKey = createBlockReplyContentKey(payload);
      if (sentContentKeys.has(payloadKey)) return true;
      if (!didStream) return false;
      const reply = resolveSendableOutboundReplyParts(payload);
      if (reply.hasMedia || !reply.trimmedText) return false;
      const normalize = (text) => text.replace(/\s+/g, "");
      const target = normalize(reply.trimmedText);
      for (const fragments of streamedTextFragmentsByMessage.values())
        if (fragments.length > 0 && normalize(fragments.join("")) === target) return true;
      return false;
    },
    getSentMediaUrls: () => Array.from(sentMediaUrls),
  };
}
//#endregion
export {
  createBlockReplyContentKey as n,
  createBlockReplyPipeline as r,
  createAudioAsVoiceBuffer as t,
};
