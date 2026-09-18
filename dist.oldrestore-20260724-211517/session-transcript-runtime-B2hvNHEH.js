import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { n as extractAssistantVisibleText } from "./chat-message-content-CeBHi_A4.js";
import {
  C as loadTranscriptEvents,
  F as publishTranscriptUpdate,
  L as readLatestTranscriptAssistantText,
  Mt as selectVisibleTranscriptEvents,
  Q as resolveSessionTranscriptRuntimeTarget,
  S as loadSessionEntry,
  Wt as redactTranscriptMessage,
  Z as resolveSessionTranscriptRuntimeReadTarget,
  ct as withTranscriptWriteLock,
  jt as selectVisibleTranscriptEventEntries,
  r as appendTranscriptMessage,
} from "./session-accessor-PZVNxFCV.js";
import { t as formatSessionTranscriptMemoryHitKey } from "./session-transcript-memory-hit-BhhXJl1H.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-BUJrk10q.js";
//#region src/plugin-sdk/session-transcript-runtime.ts
/**
 * Resolves the public identity for a transcript without returning its file path.
 */
async function resolveSessionTranscriptIdentity(params) {
  const target = await resolveSessionTranscriptRuntimeReadTarget(params);
  const agentId = normalizeAgentId(target.agentId);
  return {
    agentId,
    memoryKey: formatSessionTranscriptMemoryHitKey({
      agentId,
      sessionId: target.sessionId,
    }),
    sessionId: target.sessionId,
    sessionKey: target.sessionKey,
  };
}
/**
 * Resolves the public target for transcript operations without exposing the
 * current storage path as identity.
 */
async function resolveSessionTranscriptTarget(params) {
  return projectPublicTarget({
    ...(await resolveSessionTranscriptRuntimeReadTarget(params)),
    targetKind: "runtime-session",
  });
}
/**
 * Reads transcript events by public session identity instead of file path.
 */
async function readSessionTranscriptEvents(params) {
  return await loadTranscriptEvents(params);
}
/**
 * Reads visible transcript message entries by scoped identity.
 *
 * This is a branch-safe message projection over the current full transcript
 * read. `seq` is ordered read metadata, not a resumable cursor.
 */
async function readVisibleSessionTranscriptMessageEntries(params) {
  return selectVisibleTranscriptEventEntries(await loadTranscriptEvents(params)).flatMap(
    projectVisibleMessageEntry,
  );
}
/**
 * Reads the latest visible assistant text by scoped identity.
 */
async function readLatestAssistantTextByIdentity(params) {
  return readLatestTranscriptAssistantText(params);
}
/**
 * Appends a delivery-mirror assistant message through the SQLite transcript accessor.
 */
async function appendAssistantMirrorMessageByIdentity(params) {
  const text = resolveMirroredTranscriptText({
    ...(params.mediaUrls !== void 0 ? { mediaUrls: params.mediaUrls } : {}),
    ...(params.text !== void 0 ? { text: params.text } : {}),
  });
  if (!text)
    return {
      ok: false,
      reason: "empty message",
    };
  const message = createAssistantMirrorMessage({
    ...(params.deliveryMirror !== void 0 ? { deliveryMirror: params.deliveryMirror } : {}),
    ...(params.idempotencyKey !== void 0 ? { idempotencyKey: params.idempotencyKey } : {}),
    text,
  });
  return await withTranscriptWriteLock(params, async (locked) => {
    const currentEntry = loadSessionEntry(params);
    if (!currentEntry?.sessionId)
      return {
        ok: false,
        reason: "missing active session",
        code: "blocked",
      };
    if (params.sessionId && currentEntry.sessionId !== params.sessionId)
      return {
        ok: false,
        reason: "session changed",
        code: "session-rebound",
      };
    const scope = {
      ...params,
      sessionId: currentEntry.sessionId,
    };
    const target = await resolveSessionTranscriptRuntimeReadTarget(scope);
    const latestEquivalentAssistantId =
      !params.idempotencyKey && isDeliveryMirrorAssistantMessage(message)
        ? findLatestEquivalentAssistantMessageId(
            selectVisibleTranscriptEvents(await locked.readEvents()),
            message,
            params.config,
          )
        : void 0;
    if (latestEquivalentAssistantId)
      return {
        ok: true,
        messageId: latestEquivalentAssistantId,
      };
    const appendResult = await locked.appendMessage({
      ...(params.config !== void 0 ? { config: params.config } : {}),
      ...(params.idempotencyKey ? { idempotencyLookup: "scan" } : {}),
      message,
    });
    if (!appendResult)
      return {
        ok: false,
        reason: "message skipped",
        code: "blocked",
      };
    if (params.updateMode !== "none" && appendResult.appended)
      await publishTranscriptUpdate(scope, {
        agentId: target.agentId,
        messageId: appendResult.messageId,
        sessionKey: target.sessionKey,
        target: {
          agentId: target.agentId,
          sessionId: target.sessionId,
          sessionKey: target.sessionKey,
        },
      });
    return {
      ok: true,
      messageId: appendResult.messageId,
    };
  });
}
/**
 * Appends a transcript message by scoped transcript target.
 */
async function appendSessionTranscriptMessageByIdentity(params) {
  return await appendTranscriptMessage(params, params);
}
/**
 * Publishes a transcript update by scoped transcript target.
 */
async function publishSessionTranscriptUpdateByIdentity(params) {
  const target = await resolveSessionTranscriptRuntimeTarget(params);
  await publishTranscriptUpdate(
    {
      ...params,
      sessionId: target.sessionId,
      sessionKey: target.sessionKey,
    },
    {
      ...params.update,
      agentId: target.agentId,
      sessionKey: target.sessionKey,
      target: {
        agentId: target.agentId,
        sessionId: target.sessionId,
        sessionKey: target.sessionKey,
      },
    },
  );
}
/**
 * Runs transcript work under the write lock for the resolved scoped target.
 */
async function withSessionTranscriptWriteLock(params, run) {
  const storageTarget = await resolveSessionTranscriptRuntimeTarget(params);
  const target = projectPublicTarget({
    ...storageTarget,
    targetKind: "runtime-session",
  });
  const boundScope = {
    ...params,
    sessionId: storageTarget.sessionId,
    sessionKey: storageTarget.sessionKey,
  };
  const queuedUpdates = [];
  const result = await withTranscriptWriteLock(
    boundScope,
    async (locked) =>
      await run({
        target,
        readEvents: locked.readEvents,
        appendMessage: (options) =>
          locked.appendMessage({
            ...options,
            ...(params.config !== void 0 ? { config: params.config } : {}),
          }),
        publishUpdate: async (update) => {
          queuedUpdates.push(update ? { ...update } : void 0);
        },
      }),
  );
  for (const update of queuedUpdates)
    await publishSessionTranscriptUpdateByIdentity({
      ...boundScope,
      update,
    });
  return result;
}
function createAssistantMirrorMessage(params) {
  return {
    role: "assistant",
    content: [
      {
        type: "text",
        text: params.text,
      },
    ],
    api: "openai-responses",
    provider: "openclaw",
    model: "delivery-mirror",
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
    stopReason: "stop",
    timestamp: Date.now(),
    ...(params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {}),
    ...(params.deliveryMirror ? { openclawDeliveryMirror: params.deliveryMirror } : {}),
  };
}
function findLatestEquivalentAssistantMessageId(events, message, config) {
  const expectedText = extractAssistantMirrorComparableText(message, config);
  if (!expectedText) return;
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (!event || typeof event !== "object") continue;
    const record = event;
    const candidate = record.message;
    if (!candidate) continue;
    if (candidate.role !== "assistant") return;
    return extractAssistantMirrorComparableText(candidate, config) === expectedText &&
      typeof record.id === "string" &&
      record.id
      ? record.id
      : void 0;
  }
}
function extractAssistantMirrorComparableText(message, config) {
  return extractAssistantVisibleText(redactTranscriptMessage(message, config))?.trim() || void 0;
}
function isDeliveryMirrorAssistantMessage(message) {
  return message.provider === "openclaw" && message.model === "delivery-mirror";
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function isAgentMessageRecord(value) {
  return isRecord(value) && readNonEmptyString(value.role) !== void 0;
}
function projectVisibleMessageEntry(entry) {
  const event = entry.event;
  if (!isRecord(event) || event.type !== "message") return [];
  const entryId = readNonEmptyString(event.id);
  const message = event.message;
  if (!entryId || !isAgentMessageRecord(message)) return [];
  const createdAt = readNonEmptyString(event.timestamp);
  const idempotencyKey = readNonEmptyString(message.idempotencyKey);
  return [
    {
      entryId,
      parentId: entry.parentId,
      seq: entry.seq,
      message,
      role: message.role,
      ...(createdAt ? { createdAt } : {}),
      ...(idempotencyKey ? { idempotencyKey } : {}),
    },
  ];
}
function projectPublicTarget(target) {
  const agentId = normalizeAgentId(target.agentId);
  return {
    agentId,
    memoryKey: formatSessionTranscriptMemoryHitKey({
      agentId,
      sessionId: target.sessionId,
    }),
    sessionId: target.sessionId,
    sessionKey: target.sessionKey,
    targetKind: target.targetKind,
  };
}
//#endregion
export {
  readSessionTranscriptEvents as a,
  resolveSessionTranscriptTarget as c,
  readLatestAssistantTextByIdentity as i,
  withSessionTranscriptWriteLock as l,
  appendSessionTranscriptMessageByIdentity as n,
  readVisibleSessionTranscriptMessageEntries as o,
  publishSessionTranscriptUpdateByIdentity as r,
  resolveSessionTranscriptIdentity as s,
  appendAssistantMirrorMessageByIdentity as t,
};
