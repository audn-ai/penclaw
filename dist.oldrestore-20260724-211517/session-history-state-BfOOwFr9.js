import { l as asPositiveSafeInteger } from "./number-coercion-CJQ8TR--.js";
import {
  o as projectChatDisplayMessages,
  t as resolveTranscriptPathForComparison,
} from "./session-transcript-path-CoSCKxoF.js";
import {
  _ as attachOpenClawTranscriptMeta,
  l as readSessionMessagesWithSourceAsync,
  r as readRecentSessionMessagesWithStatsAsync,
} from "./session-transcript-readers-Bv0ty7AX.js";
//#region src/gateway/session-history-state.ts
function readMessageIdempotencyKey(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return;
  const value = message.idempotencyKey;
  return typeof value === "string" && value.trim() ? value : void 0;
}
/** Computes an oversized raw transcript tail window for projected chat history. */
function resolveSessionHistoryTailReadOptions(limit) {
  const rawWindow = Math.max(1, Math.floor(limit)) * 20 + 20;
  return {
    maxMessages: rawWindow,
    maxLines: rawWindow,
  };
}
function resolveCursorSeq(cursor) {
  if (!cursor) return;
  const normalized = cursor.startsWith("seq:") ? cursor.slice(4) : cursor;
  if (!/^\d+$/.test(normalized)) return;
  const value = Number(normalized);
  return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function toSessionHistoryMessages(messages) {
  return messages.filter(
    (message) => Boolean(message) && typeof message === "object" && !Array.isArray(message),
  );
}
function buildPaginatedSessionHistory(params) {
  return {
    items: params.messages,
    messages: params.messages,
    hasMore: params.hasMore,
    ...(params.nextCursor ? { nextCursor: params.nextCursor } : {}),
  };
}
function resolveMessageSeq(message) {
  return asPositiveSafeInteger(message?.["__openclaw"]?.seq);
}
function isMessageToolMirrorMessage(message) {
  return message.openclawMessageToolMirror !== void 0;
}
function paginateSessionMessages(messages, limit, cursor) {
  const cursorSeq = resolveCursorSeq(cursor);
  let endExclusive = messages.length;
  if (typeof cursorSeq === "number") {
    endExclusive = messages.findIndex((message, index) => {
      const seq = resolveMessageSeq(message);
      if (typeof seq === "number") return seq >= cursorSeq;
      return index + 1 >= cursorSeq;
    });
    if (endExclusive < 0) endExclusive = messages.length;
  }
  const start = typeof limit === "number" && limit > 0 ? Math.max(0, endExclusive - limit) : 0;
  const paginatedMessages = messages.slice(start, endExclusive);
  const firstSeq = resolveMessageSeq(paginatedMessages[0]);
  return buildPaginatedSessionHistory({
    messages: paginatedMessages,
    hasMore: start > 0,
    ...(start > 0 && typeof firstSeq === "number" ? { nextCursor: String(firstSeq) } : {}),
  });
}
/** Builds the display history snapshot and raw transcript sequence watermark. */
function buildSessionHistorySnapshot(params) {
  const history = paginateSessionMessages(
    toSessionHistoryMessages(
      projectChatDisplayMessages(params.rawMessages, { maxChars: params.maxChars ?? 8e3 }),
    ),
    params.limit,
    params.cursor,
  );
  if (
    !params.cursor &&
    typeof params.totalRawMessages === "number" &&
    params.totalRawMessages > params.rawMessages.length &&
    history.messages.length > 0
  ) {
    const firstSeq = resolveMessageSeq(history.messages[0]);
    history.hasMore = true;
    if (typeof firstSeq === "number") history.nextCursor = String(firstSeq);
  }
  const rawHistoryMessages = toSessionHistoryMessages(params.rawMessages);
  return {
    history,
    rawTranscriptSeq:
      params.rawTranscriptSeq ??
      resolveMessageSeq(rawHistoryMessages.at(-1)) ??
      rawHistoryMessages.length,
  };
}
/** Tracks session-history SSE state and decides when inline appends are still valid. */
var SessionHistorySseState = class SessionHistorySseState {
  static fromRawSnapshot(params) {
    return new SessionHistorySseState({
      target: params.target,
      maxChars: params.maxChars,
      limit: params.limit,
      cursor: params.cursor,
      initialRawMessages: params.rawMessages,
      rawTranscriptSeq: params.rawTranscriptSeq,
      totalRawMessages: params.totalRawMessages,
      transcriptPath: params.transcriptPath,
    });
  }
  constructor(params) {
    this.target = params.target;
    this.maxChars = params.maxChars ?? 8e3;
    this.limit = params.limit;
    this.cursor = params.cursor;
    const snapshot = this.buildSnapshot({
      rawMessages: params.initialRawMessages,
      ...(typeof params.rawTranscriptSeq === "number"
        ? { rawTranscriptSeq: params.rawTranscriptSeq }
        : {}),
      ...(typeof params.totalRawMessages === "number"
        ? { totalRawMessages: params.totalRawMessages }
        : {}),
    });
    this.sentHistory = snapshot.history;
    this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
    this.transcriptPath = normalizeTranscriptPathForComparison(params.transcriptPath);
  }
  snapshot() {
    return this.sentHistory;
  }
  appendInlineMessage(update) {
    if (this.limit !== void 0 || this.cursor !== void 0) return null;
    const carriedSeq = asPositiveSafeInteger(update.messageSeq);
    if (carriedSeq !== void 0) {
      if (carriedSeq <= this.rawTranscriptSeq) return { shouldRefresh: true };
      this.rawTranscriptSeq = carriedSeq;
    } else this.rawTranscriptSeq += 1;
    const idempotencyKey = readMessageIdempotencyKey(update.message);
    const nextMessage = attachOpenClawTranscriptMeta(update.message, {
      ...(typeof update.messageId === "string" ? { id: update.messageId } : {}),
      ...(idempotencyKey ? { idempotencyKey } : {}),
      seq: this.rawTranscriptSeq,
    });
    const projectedMessages = toSessionHistoryMessages(
      projectChatDisplayMessages([...this.sentHistory.messages, nextMessage], {
        maxChars: this.maxChars,
      }),
    );
    if (projectedMessages.length > this.sentHistory.messages.length) {
      const addedMessages = projectedMessages.slice(this.sentHistory.messages.length);
      if (addedMessages.length > 1) {
        this.sentHistory = buildPaginatedSessionHistory({
          messages: projectedMessages,
          hasMore: false,
        });
        return { shouldRefresh: true };
      }
      const projectedMessage = addedMessages[0];
      if (projectedMessage !== void 0) {
        const emittedMessage =
          isMessageToolMirrorMessage(projectedMessage) ||
          resolveMessageSeq(projectedMessage) === void 0
            ? attachOpenClawTranscriptMeta(projectedMessage, { seq: this.rawTranscriptSeq })
            : projectedMessage;
        const nextMessages = [...this.sentHistory.messages, emittedMessage];
        this.sentHistory = buildPaginatedSessionHistory({
          messages: nextMessages,
          hasMore: false,
        });
        return {
          message: emittedMessage,
          messageSeq: resolveMessageSeq(emittedMessage),
        };
      }
    }
    const [sanitizedMessage] = toSessionHistoryMessages(
      projectChatDisplayMessages([nextMessage], { maxChars: this.maxChars }),
    );
    if (!sanitizedMessage) {
      if (projectedMessages.length < this.sentHistory.messages.length) {
        this.sentHistory = buildPaginatedSessionHistory({
          messages: projectedMessages,
          hasMore: false,
        });
        return { shouldRefresh: true };
      }
      return null;
    }
    if (projectedMessages.length <= this.sentHistory.messages.length) {
      this.sentHistory = buildPaginatedSessionHistory({
        messages: projectedMessages,
        hasMore: false,
      });
      return { shouldRefresh: true };
    }
    const projectedMessage = projectedMessages.at(-1) ?? sanitizedMessage;
    const nextMessages = [...this.sentHistory.messages, projectedMessage];
    this.sentHistory = buildPaginatedSessionHistory({
      messages: nextMessages,
      hasMore: false,
    });
    return {
      message: projectedMessage,
      messageSeq: resolveMessageSeq(projectedMessage),
    };
  }
  shouldRefreshForTranscriptPath(updatePath) {
    const nextPath = normalizeTranscriptPathForComparison(updatePath);
    return Boolean(this.transcriptPath && nextPath && this.transcriptPath !== nextPath);
  }
  async refreshAsync() {
    const rawSnapshot = await this.readRawSnapshotAsync();
    const snapshot = this.buildSnapshot(rawSnapshot);
    this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
    this.transcriptPath = normalizeTranscriptPathForComparison(rawSnapshot.transcriptPath);
    this.sentHistory = snapshot.history;
    return snapshot.history;
  }
  buildSnapshot(rawSnapshot) {
    return buildSessionHistorySnapshot({
      rawMessages: rawSnapshot.rawMessages,
      maxChars: this.maxChars,
      limit: this.limit,
      cursor: this.cursor,
      ...(typeof rawSnapshot.rawTranscriptSeq === "number"
        ? { rawTranscriptSeq: rawSnapshot.rawTranscriptSeq }
        : {}),
      ...(typeof rawSnapshot.totalRawMessages === "number"
        ? { totalRawMessages: rawSnapshot.totalRawMessages }
        : {}),
    });
  }
  async readRawSnapshotAsync() {
    if (this.cursor === void 0 && typeof this.limit === "number") {
      const snapshot = await readRecentSessionMessagesWithStatsAsync(
        {
          agentId: this.target.agentId,
          sessionEntry: this.target.sessionEntry,
          sessionId: this.target.sessionId,
          sessionKey: this.target.sessionKey,
          storePath: this.target.storePath,
        },
        {
          ...resolveSessionHistoryTailReadOptions(this.limit),
          allowResetArchiveFallback: true,
        },
      );
      return {
        rawMessages: snapshot.messages,
        rawTranscriptSeq: snapshot.totalMessages,
        totalRawMessages: snapshot.totalMessages,
        transcriptPath: snapshot.transcriptPath,
      };
    }
    const snapshot = await readSessionMessagesWithSourceAsync(
      {
        agentId: this.target.agentId,
        sessionEntry: this.target.sessionEntry,
        sessionId: this.target.sessionId,
        sessionKey: this.target.sessionKey,
        storePath: this.target.storePath,
      },
      {
        mode: "full",
        reason: "session history cursor pagination",
        allowResetArchiveFallback: true,
      },
    );
    return {
      rawMessages: snapshot.messages,
      transcriptPath: snapshot.transcriptPath,
    };
  }
};
function normalizeTranscriptPathForComparison(filePath) {
  return typeof filePath === "string" ? resolveTranscriptPathForComparison(filePath) : void 0;
}
//#endregion
export {
  buildSessionHistorySnapshot as n,
  resolveSessionHistoryTailReadOptions as r,
  SessionHistorySseState as t,
};
