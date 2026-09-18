import { n as withResolvedRoomAction } from "./client-qez4y8VO.js";
import { r as isMatrixNotFoundError } from "./errors-DJRnBTUk.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as resolveMatrixMessageAttachment,
  l as resolveMatrixPollRootEventId,
  o as resolveMatrixMessageBody,
  s as fetchMatrixPollMessageSummary,
} from "./media-text-Dj0Yh4UP.js";
import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
import { n as MATRIX_REACTION_EVENT_TYPE } from "./reaction-common-DQN9ie7R.js";
import {
  _ as isPollStartType,
  a as sendMessageMatrix,
  g as isPollEventType,
  n as editMessageMatrix,
} from "./send-DDFybVmB.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/matrix/src/matrix/actions/limits.ts
function resolveMatrixActionLimit(raw, fallback) {
  return resolveIntegerOption(raw, fallback, { min: 1 });
}
//#endregion
//#region extensions/matrix/src/matrix/actions/types.ts
const EventType = {
  RoomMessage: "m.room.message",
  RoomPinnedEvents: "m.room.pinned_events",
  RoomTopic: "m.room.topic",
  Reaction: MATRIX_REACTION_EVENT_TYPE,
};
//#endregion
//#region extensions/matrix/src/matrix/actions/summary.ts
function summarizeMatrixRawEvent(event) {
  const content = event.content;
  const relates = content["m.relates_to"];
  let relType;
  let eventId;
  if (relates) {
    if ("rel_type" in relates) {
      relType = relates.rel_type;
      eventId = relates.event_id;
    } else if ("m.in_reply_to" in relates) eventId = relates["m.in_reply_to"]?.event_id;
  }
  const relatesTo =
    relType || eventId
      ? {
          relType,
          eventId,
        }
      : void 0;
  return {
    eventId: event.event_id,
    sender: event.sender,
    body: resolveMatrixMessageBody({
      body: content.body,
      filename: content.filename,
      msgtype: content.msgtype,
    }),
    msgtype: content.msgtype,
    attachment: resolveMatrixMessageAttachment({
      body: content.body,
      filename: content.filename,
      msgtype: content.msgtype,
    }),
    timestamp: event.origin_server_ts,
    relatesTo,
  };
}
async function readPinnedEvents(client, roomId) {
  try {
    return (await client.getRoomStateEvent(roomId, EventType.RoomPinnedEvents, "")).pinned.filter(
      (id) => id.trim().length > 0,
    );
  } catch (err) {
    if (isMatrixNotFoundError(err)) return [];
    throw err;
  }
}
async function fetchEventSummary(client, roomId, eventId) {
  try {
    const raw = await client.getEvent(roomId, eventId);
    if (raw.unsigned?.redacted_because) return null;
    const pollSummary = await fetchMatrixPollMessageSummary(client, roomId, raw);
    if (pollSummary) return pollSummary;
    return summarizeMatrixRawEvent(raw);
  } catch {
    return null;
  }
}
//#endregion
//#region extensions/matrix/src/matrix/actions/messages.ts
const MATRIX_THREAD_RELATIONS_START_CURSOR_PREFIX = "openclaw.matrix.thread-relations-start:";
async function sendMatrixMessage(to, content, opts = {}) {
  if (!opts.cfg) throw new Error("Matrix message actions require a resolved runtime config.");
  return await sendMessageMatrix(to, content, {
    cfg: opts.cfg,
    mediaUrl: opts.mediaUrl,
    mediaLocalRoots: opts.mediaLocalRoots,
    replyToId: opts.replyToId,
    threadId: opts.threadId,
    audioAsVoice: opts.audioAsVoice,
    accountId: opts.accountId ?? void 0,
    client: opts.client,
    timeoutMs: opts.timeoutMs,
  });
}
async function editMatrixMessage(roomId, messageId, content, opts = {}) {
  if (!opts.cfg) throw new Error("Matrix message actions require a resolved runtime config.");
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Matrix edit requires content");
  return {
    eventId:
      (await editMessageMatrix(roomId, messageId, trimmed, {
        cfg: opts.cfg,
        accountId: opts.accountId ?? void 0,
        client: opts.client,
        timeoutMs: opts.timeoutMs,
      })) || null,
  };
}
async function deleteMatrixMessage(roomId, messageId, opts = {}) {
  await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    await client.redactEvent(resolvedRoom, messageId, opts.reason);
  });
}
async function readMatrixMessages(roomId, opts = {}) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    const limit = resolveMatrixActionLimit(opts.limit, 20);
    const rawBefore = normalizeOptionalString(opts.before);
    const rawAfter = normalizeOptionalString(opts.after);
    const dir = opts.after ? "f" : "b";
    const threadId = normalizeOptionalString(opts.threadId);
    const isThreadRelationsStartCursor = threadId
      ? isMatrixThreadRelationsStartCursor(rawBefore, threadId)
      : false;
    const token = isThreadRelationsStartCursor ? void 0 : (rawBefore ?? rawAfter);
    const threadRootSummary =
      threadId !== void 0 && !token && !isThreadRelationsStartCursor && threadId
        ? await fetchDisplayableThreadRootSummary(client, resolvedRoom, threadId)
        : void 0;
    const rootCountsTowardLimit = threadRootSummary !== void 0;
    const rootFillsThreadPage = rootCountsTowardLimit && limit === 1;
    const relationLimit = rootCountsTowardLimit ? Math.max(limit - 1, 1) : limit;
    const seenPollRoots = /* @__PURE__ */ new Set();
    const threadRootEventId = normalizeOptionalString(threadRootSummary?.eventId);
    if (threadRootEventId) seenPollRoots.add(threadRootEventId);
    const relationPage =
      threadId && relationLimit > 0
        ? await client.getRelations(resolvedRoom, threadId, "m.thread", void 0, {
            dir,
            from: token,
            limit: relationLimit,
          })
        : null;
    const flatPage = threadId
      ? null
      : await client.doRequest(
          "GET",
          `/_matrix/client/v3/rooms/${encodeURIComponent(resolvedRoom)}/messages`,
          {
            dir,
            limit,
            from: token,
          },
        );
    const hydratedChunk = await client.hydrateEvents(
      resolvedRoom,
      relationPage ? (rootFillsThreadPage ? [] : relationPage.events) : (flatPage?.chunk ?? []),
    );
    const messages = [];
    if (threadRootSummary) messages.push(threadRootSummary);
    for (const event of hydratedChunk) {
      if (event.unsigned?.redacted_because) continue;
      if (!threadId && isMatrixThreadEvent(event)) continue;
      if (event.type === EventType.RoomMessage) {
        if (threadId && event.event_id === threadId) continue;
        messages.push(summarizeMatrixRawEvent(event));
        continue;
      }
      if (!isPollEventType(event.type)) continue;
      const pollRootId = resolveMatrixPollRootEventId(event);
      if (!pollRootId || seenPollRoots.has(pollRootId)) continue;
      if (
        !threadId &&
        (await isMatrixPollRootThreaded({
          client,
          event,
          pollRootId,
          resolvedRoom,
        }))
      )
        continue;
      seenPollRoots.add(pollRootId);
      const pollSummary = await fetchMatrixPollMessageSummary(client, resolvedRoom, event);
      if (pollSummary) messages.push(pollSummary);
    }
    return {
      messages,
      nextBatch:
        rootFillsThreadPage && threadId && relationPage?.events.length
          ? encodeMatrixThreadRelationsStartCursor(threadId)
          : (relationPage?.nextBatch ?? flatPage?.end ?? null),
      prevBatch: relationPage?.prevBatch ?? flatPage?.start ?? null,
    };
  });
}
function encodeMatrixThreadRelationsStartCursor(threadId) {
  const payload = Buffer.from(
    JSON.stringify({
      v: 1,
      threadId,
    }),
    "utf8",
  ).toString("base64url");
  return `${MATRIX_THREAD_RELATIONS_START_CURSOR_PREFIX}${payload}`;
}
function isMatrixThreadRelationsStartCursor(raw, threadId) {
  if (!raw?.startsWith(MATRIX_THREAD_RELATIONS_START_CURSOR_PREFIX)) return false;
  const encoded = raw.slice(39);
  try {
    const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return decoded.v === 1 && decoded.threadId === threadId;
  } catch {
    return false;
  }
}
async function fetchDisplayableThreadRootSummary(client, resolvedRoom, threadId) {
  const rawRootEvent = await client.getEvent(resolvedRoom, threadId).catch(() => null);
  if (!rawRootEvent) return;
  const rootEvent = (await client.hydrateEvents(resolvedRoom, [rawRootEvent]))[0];
  if (!rootEvent || rootEvent.unsigned?.redacted_because) return;
  if (rootEvent.type === EventType.RoomMessage) return summarizeMatrixRawEvent(rootEvent);
  if (isPollStartType(rootEvent.type))
    return (await fetchMatrixPollMessageSummary(client, resolvedRoom, rootEvent)) ?? void 0;
}
function isMatrixThreadEvent(event) {
  const relates = event.content?.["m.relates_to"];
  if (!relates || typeof relates !== "object") return false;
  return relates.rel_type === "m.thread";
}
async function isMatrixPollRootThreaded(params) {
  if (isMatrixThreadEvent(params.event)) return true;
  const rootEvent = await params.client
    .getEvent(params.resolvedRoom, params.pollRootId)
    .catch(() => null);
  if (!rootEvent) return false;
  const hydratedRoot = (await params.client.hydrateEvents(params.resolvedRoom, [rootEvent]))[0];
  return hydratedRoot ? isMatrixThreadEvent(hydratedRoot) : false;
}
//#endregion
export {
  fetchEventSummary as a,
  resolveMatrixActionLimit as c,
  sendMatrixMessage as i,
  editMatrixMessage as n,
  readPinnedEvents as o,
  readMatrixMessages as r,
  EventType as s,
  deleteMatrixMessage as t,
};
