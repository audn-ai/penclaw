import {
  a as resolveMatrixAccountConfig,
  o as resolveMatrixBaseConfig,
} from "./account-config-Cth1-JFA.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { i as resolveMatrixAccount } from "./accounts-qvek289C.js";
import { n as withResolvedRoomAction, t as withResolvedActionClient } from "./client-qez4y8VO.js";
import {
  _ as readStringArrayParam,
  g as readReactionParams,
  h as readPositiveIntegerParam,
  i as createActionGate,
  t as ToolAuthorizationError,
  y as readStringParam,
} from "./common-DyDSUect.js";
import {
  a as readJoinedMatrixMembers,
  r as isStrictDirectMembership,
  t as hasDirectMatrixMemberFlag,
} from "./direct-room-DeTW2q2I.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as fetchEventSummary,
  c as resolveMatrixActionLimit,
  i as sendMatrixMessage,
  n as editMatrixMessage,
  o as readPinnedEvents,
  r as readMatrixMessages,
  s as EventType,
  t as deleteMatrixMessage,
} from "./messages-D0Vaif56.js";
import { t as applyMatrixProfileUpdate } from "./profile-update-CduSJZax.js";
import {
  i as buildMatrixReactionRelationsPath,
  o as selectOwnMatrixReactionEventIds,
  s as summarizeMatrixReactionEvents,
} from "./reaction-common-DQN9ie7R.js";
import { t as createMatrixRoomInfoResolver } from "./room-info-CjqU6iDz.js";
import { n as resolveMatrixRoomConfig } from "./rooms-RrimWzo2.js";
import {
  n as resolveAllowlistProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "./runtime-group-policy-BEjP88cf.js";
import {
  _ as isPollStartType,
  f as buildPollResponseContent,
  i as reactMatrixMessage,
  u as resolveMatrixRoomId,
  v as parsePollStart,
} from "./send-DDFybVmB.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings, v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import "./runtime-api-CorvIo5f.js";
import { r as normalizeMatrixResolvableTarget } from "./target-ids-CmrXcyY1.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import {
  _ as scanMatrixVerificationQr,
  a as confirmMatrixVerificationSas,
  c as getMatrixRoomKeyBackupStatus,
  d as listMatrixVerifications,
  f as mismatchMatrixVerificationSas,
  h as restoreMatrixRoomKeyBackup,
  i as confirmMatrixVerificationReciprocateQr,
  l as getMatrixVerificationSas,
  n as bootstrapMatrixVerification,
  o as generateMatrixVerificationQr,
  p as requestMatrixVerification,
  r as cancelMatrixVerification,
  s as getMatrixEncryptionStatus,
  t as acceptMatrixVerification,
  u as getMatrixVerificationStatus,
  v as startMatrixVerification,
  y as verifyMatrixRecoveryKey,
} from "./verification-DwX17FRg.js";
//#region extensions/matrix/src/matrix/actions/polls.ts
function normalizeOptionIndexes(indexes) {
  return uniqueValues(
    indexes
      .map((index) => Math.trunc(index))
      .filter((index) => Number.isFinite(index) && index > 0),
  );
}
function normalizeOptionIds(optionIds) {
  return uniqueStrings(
    optionIds.map((optionId) => optionId.trim()).filter((optionId) => optionId.length > 0),
  );
}
function resolveSelectedAnswerIds(params) {
  const parsed = parsePollStart(params.pollContent);
  if (!parsed) throw new Error("Matrix poll vote requires a valid poll start event.");
  const selectedById = normalizeOptionIds(params.optionIds ?? []);
  const selectedByIndex = normalizeOptionIndexes(params.optionIndexes ?? []).map((index) => {
    const answer = parsed.answers[index - 1];
    if (!answer)
      throw new Error(
        `Matrix poll option index ${index} is out of range for a poll with ${parsed.answers.length} options.`,
      );
    return answer.id;
  });
  const answerIds = normalizeOptionIds([...selectedById, ...selectedByIndex]);
  if (answerIds.length === 0)
    throw new Error("Matrix poll vote requires at least one poll option id or index.");
  if (answerIds.length > parsed.maxSelections)
    throw new Error(
      `Matrix poll allows at most ${parsed.maxSelections} selection${parsed.maxSelections === 1 ? "" : "s"}.`,
    );
  const answerMap = new Map(parsed.answers.map((answer) => [answer.id, answer.text]));
  return {
    answerIds,
    labels: answerIds.map((answerId) => {
      const label = answerMap.get(answerId);
      if (!label)
        throw new Error(
          `Matrix poll option id "${answerId}" is not valid for poll ${parsed.question}.`,
        );
      return label;
    }),
    maxSelections: parsed.maxSelections,
  };
}
async function voteMatrixPoll(roomId, pollId, opts = {}) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    const pollEvent = await client.getEvent(resolvedRoom, pollId);
    if (!isPollStartType(typeof pollEvent.type === "string" ? pollEvent.type : ""))
      throw new Error(`Event ${pollId} is not a Matrix poll start event.`);
    const { answerIds, labels, maxSelections } = resolveSelectedAnswerIds({
      optionIds: [...(opts.optionIds ?? []), ...(opts.optionId ? [opts.optionId] : [])],
      optionIndexes: [
        ...(opts.optionIndexes ?? []),
        ...(opts.optionIndex !== void 0 ? [opts.optionIndex] : []),
      ],
      pollContent: pollEvent.content,
    });
    const content = buildPollResponseContent(pollId, answerIds);
    return {
      eventId: (await client.sendEvent(resolvedRoom, "m.poll.response", content)) ?? null,
      roomId: resolvedRoom,
      pollId,
      answerIds,
      labels,
      maxSelections,
    };
  });
}
//#endregion
//#region extensions/matrix/src/matrix/actions/reactions.ts
async function listMatrixReactionEvents(client, roomId, messageId, limit) {
  const res = await client.doRequest("GET", buildMatrixReactionRelationsPath(roomId, messageId), {
    dir: "b",
    limit,
  });
  return Array.isArray(res.chunk) ? res.chunk : [];
}
async function listMatrixReactions(roomId, messageId, opts = {}) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    return summarizeMatrixReactionEvents(
      await listMatrixReactionEvents(
        client,
        resolvedRoom,
        messageId,
        resolveMatrixActionLimit(opts.limit, 100),
      ),
    );
  });
}
async function removeMatrixReactions(roomId, messageId, opts = {}) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    const chunk = await listMatrixReactionEvents(client, resolvedRoom, messageId, 200);
    const userId = await client.getUserId();
    if (!userId) return { removed: 0 };
    const toRemove = selectOwnMatrixReactionEventIds(chunk, userId, opts.emoji);
    if (toRemove.length === 0) return { removed: 0 };
    await Promise.all(toRemove.map((id) => client.redactEvent(resolvedRoom, id)));
    return { removed: toRemove.length };
  });
}
//#endregion
//#region extensions/matrix/src/matrix/actions/pins.ts
async function updateMatrixPins(roomId, opts, update) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    const next = update(await readPinnedEvents(client, resolvedRoom));
    const payload = { pinned: next };
    await client.sendStateEvent(resolvedRoom, EventType.RoomPinnedEvents, "", payload);
    return { pinned: next };
  });
}
async function pinMatrixMessage(roomId, messageId, opts = {}) {
  return await updateMatrixPins(roomId, opts, (current) =>
    current.includes(messageId) ? current : [...current, messageId],
  );
}
async function unpinMatrixMessage(roomId, messageId, opts = {}) {
  return await updateMatrixPins(roomId, opts, (current) =>
    current.filter((id) => id !== messageId),
  );
}
async function listMatrixPins(roomId, opts = {}) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    const pinned = await readPinnedEvents(client, resolvedRoom);
    return {
      pinned,
      events: (
        await Promise.all(
          pinned.map(async (eventId) => {
            try {
              return await fetchEventSummary(client, resolvedRoom, eventId);
            } catch {
              return null;
            }
          }),
        )
      ).filter((event) => Boolean(event)),
    };
  });
}
//#endregion
//#region extensions/matrix/src/matrix/actions/room.ts
async function getMatrixMemberInfo(userId, opts) {
  return await withResolvedActionClient(opts, async (client) => {
    const roomId = await resolveMatrixRoomId(client, opts.roomId);
    if (!(await client.getJoinedRoomMembers(roomId)).includes(userId))
      throw new Error(`User ${userId} is not a member of room ${roomId}`);
    const profile = await client.getUserProfile(userId);
    return {
      userId,
      profile: {
        displayName: profile?.displayname ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      },
      membership: null,
      powerLevel: null,
      displayName: profile?.displayname ?? null,
      roomId,
    };
  });
}
async function getMatrixRoomInfo(roomId, opts = {}) {
  return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
    let name = null;
    let topic = null;
    let canonicalAlias = null;
    let memberCount = null;
    try {
      const nameState = await client.getRoomStateEvent(resolvedRoom, "m.room.name", "");
      name = typeof nameState?.name === "string" ? nameState.name : null;
    } catch {}
    try {
      const topicState = await client.getRoomStateEvent(resolvedRoom, EventType.RoomTopic, "");
      topic = typeof topicState?.topic === "string" ? topicState.topic : null;
    } catch {}
    try {
      const aliasState = await client.getRoomStateEvent(resolvedRoom, "m.room.canonical_alias", "");
      canonicalAlias = typeof aliasState?.alias === "string" ? aliasState.alias : null;
    } catch {}
    try {
      memberCount = (await client.getJoinedRoomMembers(resolvedRoom)).length;
    } catch {}
    return {
      roomId: resolvedRoom,
      name,
      topic,
      canonicalAlias,
      altAliases: [],
      memberCount,
    };
  });
}
//#endregion
//#region extensions/matrix/src/matrix/read-policy.ts
function normalizeRoomId(raw) {
  return raw?.trim().replace(/^room:/i, "") ?? "";
}
function isCurrentRoom(params) {
  return (
    params.context?.currentChannelProvider?.trim().toLowerCase() === "matrix" &&
    params.context.requesterAccountId?.trim() === params.accountId &&
    normalizeRoomId(params.context.currentChannelId) === normalizeRoomId(params.roomId)
  );
}
function includesEntry(entries, value) {
  const normalized = value.trim().toLowerCase();
  return (entries ?? []).some((entry) => {
    const candidate = String(entry)
      .replace(/^matrix:/i, "")
      .trim()
      .toLowerCase();
    return candidate === "*" || candidate === normalized;
  });
}
function hasWildcardEntry(entries) {
  return (entries ?? []).some(
    (entry) =>
      String(entry)
        .replace(/^matrix:/i, "")
        .trim() === "*",
  );
}
function resolveMatrixReadRoomPolicy(params) {
  const room = resolveMatrixRoomConfig({
    rooms: params.account.config.groups ?? params.account.config.rooms,
    roomId: params.roomId,
    aliases: params.aliases,
  });
  const baseRoom = resolveMatrixRoomConfig({
    rooms: params.baseConfig.groups ?? params.baseConfig.rooms,
    roomId: params.roomId,
    aliases: params.aliases,
  });
  const baseRoomAccount = baseRoom.config?.account;
  const explicitlyScopedToAnotherAccount =
    room.config === void 0 &&
    baseRoom.matchSource === "direct" &&
    typeof baseRoomAccount === "string" &&
    normalizeAccountId(baseRoomAccount) !== params.account.accountId;
  const accountMatches = !room.config?.account || room.config.account === params.account.accountId;
  const configuredRoomBlocked = room.config !== void 0 && (!room.allowed || !accountMatches);
  return {
    blocked: explicitlyScopedToAnotherAccount || configuredRoomBlocked,
    blockedBeforeProviderAccess:
      explicitlyScopedToAnotherAccount || (room.matchSource === "direct" && configuredRoomBlocked),
    room,
  };
}
async function classifyMatrixReadRoom(params) {
  const members = await readJoinedMatrixMembers(params.client, params.roomId);
  if (!members) return { kind: "unknown" };
  if (members.length >= 3) return { kind: "group" };
  if (members.length !== 2) return { kind: "unknown" };
  const selfUserId = await params.client.getUserId().catch(() => null);
  if (!selfUserId || !members.includes(selfUserId)) return { kind: "unknown" };
  const remoteUserId = members.find((member) => member !== selfUserId);
  if (
    !isStrictDirectMembership({
      selfUserId,
      remoteUserId,
      joinedMembers: members,
    }) ||
    !remoteUserId
  )
    return { kind: "unknown" };
  const memberStateFlag = await hasDirectMatrixMemberFlag(params.client, params.roomId, selfUserId);
  await params.client.dms.update().catch(() => false);
  if (memberStateFlag === true || params.client.dms.isDm(params.roomId))
    return {
      kind: "direct",
      remoteUserId,
    };
  return memberStateFlag === false ? { kind: "group" } : { kind: "unknown" };
}
async function withAuthorizedMatrixReadTarget(params) {
  const account = resolveMatrixAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const baseConfig = resolveMatrixBaseConfig(params.cfg);
  if (
    resolveMatrixReadRoomPolicy({
      account,
      baseConfig,
      roomId: normalizeMatrixResolvableTarget(params.roomId),
      aliases: [],
    }).blockedBeforeProviderAccess
  )
    throw new ToolAuthorizationError("Matrix read target is not allowed.");
  return await withResolvedActionClient(params.opts, async (client) => {
    const roomId = await resolveMatrixRoomId(client, params.roomId);
    const inputAlias = params.roomId.trim().startsWith("#") ? params.roomId.trim() : void 0;
    const { getRoomInfo } = createMatrixRoomInfoResolver(client);
    const roomInfo = await getRoomInfo(roomId, { includeAliases: true });
    const mutableRoomName =
      account.config.dangerouslyAllowNameMatching === true ? roomInfo.name : void 0;
    const aliases = [
      inputAlias,
      roomInfo.canonicalAlias,
      ...roomInfo.altAliases,
      mutableRoomName,
    ].filter((value) => Boolean(value));
    const finalPolicy = resolveMatrixReadRoomPolicy({
      account,
      baseConfig,
      roomId,
      aliases,
    });
    const room = finalPolicy.room;
    const current = isCurrentRoom({
      accountId: account.accountId,
      context: params.context,
      roomId,
    });
    const currentChatType = params.context?.currentChatType?.trim().toLowerCase();
    const trustedCurrentClassification =
      currentChatType === "direct"
        ? {
            kind: "direct",
            remoteUserId: "",
          }
        : currentChatType === "group" || currentChatType === "channel"
          ? { kind: "group" }
          : null;
    const classification =
      room.matchSource === "direct"
        ? { kind: "group" }
        : current && trustedCurrentClassification
          ? trustedCurrentClassification
          : await classifyMatrixReadRoom({
              client,
              roomId,
            });
    const resolvedGroupPolicy = resolveAllowlistProviderRuntimeGroupPolicy({
      providerConfigPresent: params.cfg.channels?.matrix !== void 0,
      groupPolicy: account.config.groupPolicy,
      defaultGroupPolicy: resolveDefaultGroupPolicy(params.cfg),
    }).groupPolicy;
    const groupPolicy =
      account.config.allowlistOnly && resolvedGroupPolicy === "open"
        ? "allowlist"
        : resolvedGroupPolicy;
    const dmPolicy = account.config.allowlistOnly
      ? account.config.dm?.policy === "disabled"
        ? "disabled"
        : "allowlist"
      : (account.config.dm?.policy ?? "pairing");
    const directOperator = params.context?.conversationReadOrigin === "direct-operator";
    if (
      !(finalPolicy.blocked
        ? false
        : directOperator
          ? classification.kind === "direct"
            ? account.config.dm?.enabled !== false && dmPolicy !== "disabled"
            : classification.kind === "group"
              ? groupPolicy !== "disabled"
              : groupPolicy !== "disabled" &&
                dmPolicy !== "disabled" &&
                account.config.dm?.enabled !== false
          : classification.kind === "direct"
            ? account.config.dm?.enabled !== false &&
              dmPolicy !== "disabled" &&
              (current || includesEntry(account.config.dm?.allowFrom, classification.remoteUserId))
            : classification.kind === "group"
              ? groupPolicy !== "disabled" &&
                (current || groupPolicy === "open" || room.config !== void 0)
              : current
                ? groupPolicy !== "disabled" &&
                  dmPolicy !== "disabled" &&
                  account.config.dm?.enabled !== false
                : groupPolicy === "open" &&
                  dmPolicy !== "disabled" &&
                  account.config.dm?.enabled !== false &&
                  hasWildcardEntry(account.config.dm?.allowFrom))
    )
      throw new ToolAuthorizationError("Matrix read target is not allowed.");
    return await params.run({
      client,
      roomId,
    });
  });
}
//#endregion
//#region extensions/matrix/src/tool-actions.ts
const messageActions = /* @__PURE__ */ new Set([
  "sendMessage",
  "editMessage",
  "deleteMessage",
  "readMessages",
]);
const reactionActions = /* @__PURE__ */ new Set(["react", "reactions"]);
const pinActions = /* @__PURE__ */ new Set(["pinMessage", "unpinMessage", "listPins"]);
const pollActions = /* @__PURE__ */ new Set(["pollVote"]);
const profileActions = /* @__PURE__ */ new Set(["setProfile"]);
const verificationActions = /* @__PURE__ */ new Set([
  "encryptionStatus",
  "verificationList",
  "verificationRequest",
  "verificationAccept",
  "verificationCancel",
  "verificationStart",
  "verificationGenerateQr",
  "verificationScanQr",
  "verificationSas",
  "verificationConfirm",
  "verificationMismatch",
  "verificationConfirmQr",
  "verificationStatus",
  "verificationBootstrap",
  "verificationRecoveryKey",
  "verificationBackupStatus",
  "verificationBackupRestore",
]);
function readRoomId(params, required = true) {
  const direct = readStringParam(params, "roomId") ?? readStringParam(params, "channelId");
  if (direct) return direct;
  if (!required) return readStringParam(params, "to") ?? "";
  return readStringParam(params, "to", { required: true });
}
function toSnakeCaseKey(key) {
  return normalizeOptionalLowercaseString(
    key.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2"),
  );
}
function readRawParam(params, key) {
  if (Object.hasOwn(params, key)) return params[key];
  const snakeKey = toSnakeCaseKey(key);
  if (snakeKey !== key && Object.hasOwn(params, snakeKey)) return params[snakeKey];
}
function readStringAliasParam(params, keys, options = {}) {
  for (const key of keys) {
    const raw = readRawParam(params, key);
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed) return trimmed;
  }
  if (options.required) throw new Error(`${keys[0]} required`);
}
function readPositiveIntegerArrayParam(params, key) {
  const raw = readRawParam(params, key);
  if (raw == null) return [];
  return (Array.isArray(raw) ? raw : [raw]).flatMap((value) => {
    if (value == null || value === "") return [];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      if (!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(trimmed)) return [];
    }
    const index = readPositiveIntegerParam({ [key]: value }, key, {
      message: `${key} must contain positive integers.`,
    });
    return index === void 0 ? [] : [index];
  });
}
async function handleMatrixAction(params, cfg, opts = {}) {
  const action = readStringParam(params, "action", { required: true });
  const accountId = readStringParam(params, "accountId") ?? void 0;
  const isActionEnabled = createActionGate(
    resolveMatrixAccountConfig({
      cfg,
      accountId,
    }).actions,
  );
  const clientOpts = {
    cfg,
    ...(accountId ? { accountId } : {}),
  };
  const withReadTarget = async (roomId, run) =>
    await withAuthorizedMatrixReadTarget({
      cfg,
      accountId,
      roomId,
      context: opts.readContext,
      opts: clientOpts,
      run,
    });
  if (reactionActions.has(action)) {
    if (!isActionEnabled("reactions")) throw new Error("Matrix reactions are disabled.");
    const roomId = readRoomId(params);
    const messageId = readStringParam(params, "messageId", { required: true });
    if (action === "react") {
      const { emoji, remove, isEmpty } = readReactionParams(params, {
        removeErrorMessage: "Emoji is required to remove a Matrix reaction.",
      });
      if (remove || isEmpty)
        return jsonResult({
          ok: true,
          removed: (
            await withReadTarget(roomId, async (target) => {
              return await removeMatrixReactions(target.roomId, messageId, {
                ...clientOpts,
                client: target.client,
                emoji: remove ? emoji : void 0,
              });
            })
          ).removed,
        });
      await withReadTarget(roomId, async (target) => {
        await reactMatrixMessage(target.roomId, messageId, emoji, {
          ...clientOpts,
          client: target.client,
        });
      });
      return jsonResult({
        ok: true,
        added: emoji,
      });
    }
    const limit = readPositiveIntegerParam(params, "limit", {
      message: "limit must be a positive integer.",
    });
    return jsonResult({
      ok: true,
      reactions: await withReadTarget(roomId, async (target) => {
        return await listMatrixReactions(target.roomId, messageId, {
          ...clientOpts,
          client: target.client,
          limit: limit ?? void 0,
        });
      }),
    });
  }
  if (pollActions.has(action)) {
    const roomId = readRoomId(params);
    const pollId = readStringAliasParam(params, ["pollId", "messageId"], { required: true });
    if (!pollId) throw new Error("pollId required");
    const optionId = readStringParam(params, "pollOptionId");
    const optionIndex = readPositiveIntegerParam(params, "pollOptionIndex", {
      message: "pollOptionIndex must be a positive integer.",
    });
    const optionIds = [
      ...(readStringArrayParam(params, "pollOptionIds") ?? []),
      ...(optionId ? [optionId] : []),
    ];
    const optionIndexes = [
      ...readPositiveIntegerArrayParam(params, "pollOptionIndexes"),
      ...(optionIndex !== void 0 ? [optionIndex] : []),
    ];
    return jsonResult({
      ok: true,
      result: await withReadTarget(roomId, async (target) => {
        return await voteMatrixPoll(target.roomId, pollId, {
          ...clientOpts,
          client: target.client,
          optionIds,
          optionIndexes,
        });
      }),
    });
  }
  if (messageActions.has(action)) {
    if (!isActionEnabled("messages")) throw new Error("Matrix messages are disabled.");
    switch (action) {
      case "sendMessage": {
        const to = readStringParam(params, "to", { required: true });
        const mediaUrl =
          readStringParam(params, "mediaUrl", { trim: false }) ??
          readStringParam(params, "media", { trim: false }) ??
          readStringParam(params, "filePath", { trim: false }) ??
          readStringParam(params, "path", { trim: false });
        const content = readStringParam(params, "content", {
          required: !mediaUrl,
          allowEmpty: true,
        });
        const replyToId =
          readStringParam(params, "replyToId") ?? readStringParam(params, "replyTo");
        const threadId = readStringParam(params, "threadId");
        const audioAsVoice =
          typeof readRawParam(params, "audioAsVoice") === "boolean"
            ? readRawParam(params, "audioAsVoice")
            : typeof readRawParam(params, "asVoice") === "boolean"
              ? readRawParam(params, "asVoice")
              : void 0;
        return jsonResult({
          ok: true,
          result: await sendMatrixMessage(to, content, {
            mediaUrl: mediaUrl ?? void 0,
            mediaLocalRoots: opts.mediaLocalRoots,
            replyToId: replyToId ?? void 0,
            threadId: threadId ?? void 0,
            audioAsVoice,
            ...clientOpts,
          }),
        });
      }
      case "editMessage": {
        const roomId = readRoomId(params);
        const messageId = readStringParam(params, "messageId", { required: true });
        const content = readStringParam(params, "content", { required: true });
        return jsonResult({
          ok: true,
          result: await withReadTarget(roomId, async (target) => {
            return await editMatrixMessage(target.roomId, messageId, content, {
              ...clientOpts,
              client: target.client,
            });
          }),
        });
      }
      case "deleteMessage": {
        const roomId = readRoomId(params);
        const messageId = readStringParam(params, "messageId", { required: true });
        const reason = readStringParam(params, "reason");
        await withReadTarget(roomId, async (target) => {
          await deleteMatrixMessage(target.roomId, messageId, {
            reason: reason ?? void 0,
            ...clientOpts,
            client: target.client,
          });
        });
        return jsonResult({
          ok: true,
          deleted: true,
        });
      }
      case "readMessages": {
        const roomId = readRoomId(params);
        const limit = readPositiveIntegerParam(params, "limit", {
          message: "limit must be a positive integer.",
        });
        const before = readStringParam(params, "before");
        const after = readStringParam(params, "after");
        const threadId = readStringParam(params, "threadId");
        return jsonResult({
          ok: true,
          ...(await withReadTarget(roomId, async (target) => {
            return await readMatrixMessages(target.roomId, {
              limit: limit ?? void 0,
              before: before ?? void 0,
              after: after ?? void 0,
              threadId: threadId ?? void 0,
              ...clientOpts,
              client: target.client,
            });
          })),
        });
      }
      default:
        break;
    }
  }
  if (pinActions.has(action)) {
    if (!isActionEnabled("pins")) throw new Error("Matrix pins are disabled.");
    const roomId = readRoomId(params);
    const request =
      action === "pinMessage"
        ? {
            kind: "pin",
            messageId: readStringParam(params, "messageId", { required: true }),
          }
        : action === "unpinMessage"
          ? {
              kind: "unpin",
              messageId: readStringParam(params, "messageId", { required: true }),
            }
          : { kind: "list" };
    return await withReadTarget(roomId, async (target) => {
      const actionOpts = {
        ...clientOpts,
        client: target.client,
      };
      if (request.kind === "pin")
        return jsonResult({
          ok: true,
          pinned: (await pinMatrixMessage(target.roomId, request.messageId, actionOpts)).pinned,
        });
      if (request.kind === "unpin")
        return jsonResult({
          ok: true,
          pinned: (await unpinMatrixMessage(target.roomId, request.messageId, actionOpts)).pinned,
        });
      const result = await listMatrixPins(target.roomId, actionOpts);
      return jsonResult({
        ok: true,
        pinned: result.pinned,
        events: result.events,
      });
    });
  }
  if (profileActions.has(action)) {
    if (!isActionEnabled("profile")) throw new Error("Matrix profile updates are disabled.");
    const avatarPath =
      readStringParam(params, "avatarPath") ??
      readStringParam(params, "path") ??
      readStringParam(params, "filePath");
    return jsonResult({
      ok: true,
      ...(await applyMatrixProfileUpdate({
        cfg,
        account: accountId,
        displayName: readStringParam(params, "displayName") ?? readStringParam(params, "name"),
        avatarUrl: readStringParam(params, "avatarUrl"),
        avatarPath,
        mediaLocalRoots: opts.mediaLocalRoots,
      })),
    });
  }
  if (action === "memberInfo") {
    if (!isActionEnabled("memberInfo")) throw new Error("Matrix member info is disabled.");
    const userId = readStringParam(params, "userId", { required: true });
    return jsonResult({
      ok: true,
      member: await withReadTarget(readRoomId(params), async (target) => {
        return await getMatrixMemberInfo(userId, {
          roomId: target.roomId,
          ...clientOpts,
          client: target.client,
        });
      }),
    });
  }
  if (action === "channelInfo") {
    if (!isActionEnabled("channelInfo")) throw new Error("Matrix room info is disabled.");
    return jsonResult({
      ok: true,
      room: await withReadTarget(readRoomId(params), async (target) => {
        return await getMatrixRoomInfo(target.roomId, {
          ...clientOpts,
          client: target.client,
        });
      }),
    });
  }
  if (verificationActions.has(action)) {
    if (!isActionEnabled("verification"))
      throw new Error("Matrix verification actions are disabled.");
    const requestId =
      readStringParam(params, "requestId") ??
      readStringParam(params, "verificationId") ??
      readStringParam(params, "id");
    if (action === "encryptionStatus")
      return jsonResult({
        ok: true,
        status: await getMatrixEncryptionStatus({
          includeRecoveryKey: params.includeRecoveryKey === true,
          ...clientOpts,
        }),
      });
    if (action === "verificationStatus")
      return jsonResult({
        ok: true,
        status: await getMatrixVerificationStatus({
          includeRecoveryKey: params.includeRecoveryKey === true,
          ...clientOpts,
        }),
      });
    if (action === "verificationBootstrap") {
      const result = await bootstrapMatrixVerification({
        recoveryKey:
          readStringParam(params, "recoveryKey", { trim: false }) ??
          readStringParam(params, "key", { trim: false }) ??
          void 0,
        forceResetCrossSigning: params.forceResetCrossSigning === true,
        ...clientOpts,
      });
      return jsonResult({
        ok: result.success,
        result,
      });
    }
    if (action === "verificationRecoveryKey") {
      const result = await verifyMatrixRecoveryKey(
        readStringParam(
          {
            recoveryKey:
              readStringParam(params, "recoveryKey", { trim: false }) ??
              readStringParam(params, "key", { trim: false }),
          },
          "recoveryKey",
          {
            required: true,
            trim: false,
          },
        ),
        clientOpts,
      );
      return jsonResult({
        ok: result.success,
        result,
      });
    }
    if (action === "verificationBackupStatus")
      return jsonResult({
        ok: true,
        status: await getMatrixRoomKeyBackupStatus(clientOpts),
      });
    if (action === "verificationBackupRestore") {
      const result = await restoreMatrixRoomKeyBackup({
        recoveryKey:
          readStringParam(params, "recoveryKey", { trim: false }) ??
          readStringParam(params, "key", { trim: false }) ??
          void 0,
        ...clientOpts,
      });
      return jsonResult({
        ok: result.success,
        result,
      });
    }
    if (action === "verificationList")
      return jsonResult({
        ok: true,
        verifications: await listMatrixVerifications(clientOpts),
      });
    if (action === "verificationRequest") {
      const userId = readStringParam(params, "userId");
      const deviceId = readStringParam(params, "deviceId");
      const roomId = readStringParam(params, "roomId") ?? readStringParam(params, "channelId");
      return jsonResult({
        ok: true,
        verification: await requestMatrixVerification({
          ownUser: typeof params.ownUser === "boolean" ? params.ownUser : void 0,
          userId: userId ?? void 0,
          deviceId: deviceId ?? void 0,
          roomId: roomId ?? void 0,
          ...clientOpts,
        }),
      });
    }
    if (action === "verificationAccept")
      return jsonResult({
        ok: true,
        verification: await acceptMatrixVerification(
          readStringParam({ requestId }, "requestId", { required: true }),
          clientOpts,
        ),
      });
    if (action === "verificationCancel") {
      const reason = readStringParam(params, "reason");
      const code = readStringParam(params, "code");
      return jsonResult({
        ok: true,
        verification: await cancelMatrixVerification(
          readStringParam({ requestId }, "requestId", { required: true }),
          {
            reason: reason ?? void 0,
            code: code ?? void 0,
            ...clientOpts,
          },
        ),
      });
    }
    if (action === "verificationStart") {
      const method = normalizeOptionalLowercaseString(readStringParam(params, "method"));
      if (method && method !== "sas")
        throw new Error(
          "Matrix verificationStart only supports method=sas; use verificationGenerateQr/verificationScanQr for QR flows.",
        );
      return jsonResult({
        ok: true,
        verification: await startMatrixVerification(
          readStringParam({ requestId }, "requestId", { required: true }),
          {
            method: "sas",
            ...clientOpts,
          },
        ),
      });
    }
    if (action === "verificationGenerateQr")
      return jsonResult({
        ok: true,
        ...(await generateMatrixVerificationQr(
          readStringParam({ requestId }, "requestId", { required: true }),
          clientOpts,
        )),
      });
    if (action === "verificationScanQr") {
      const qrDataBase64 =
        readStringParam(params, "qrDataBase64") ??
        readStringParam(params, "qrData") ??
        readStringParam(params, "qr");
      return jsonResult({
        ok: true,
        verification: await scanMatrixVerificationQr(
          readStringParam({ requestId }, "requestId", { required: true }),
          readStringParam({ qrDataBase64 }, "qrDataBase64", { required: true }),
          clientOpts,
        ),
      });
    }
    if (action === "verificationSas")
      return jsonResult({
        ok: true,
        sas: await getMatrixVerificationSas(
          readStringParam({ requestId }, "requestId", { required: true }),
          clientOpts,
        ),
      });
    if (action === "verificationConfirm")
      return jsonResult({
        ok: true,
        verification: await confirmMatrixVerificationSas(
          readStringParam({ requestId }, "requestId", { required: true }),
          clientOpts,
        ),
      });
    if (action === "verificationMismatch")
      return jsonResult({
        ok: true,
        verification: await mismatchMatrixVerificationSas(
          readStringParam({ requestId }, "requestId", { required: true }),
          clientOpts,
        ),
      });
    if (action === "verificationConfirmQr")
      return jsonResult({
        ok: true,
        verification: await confirmMatrixVerificationReciprocateQr(
          readStringParam({ requestId }, "requestId", { required: true }),
          clientOpts,
        ),
      });
  }
  throw new Error(`Unsupported Matrix action: ${action}`);
}
//#endregion
export { handleMatrixAction };
