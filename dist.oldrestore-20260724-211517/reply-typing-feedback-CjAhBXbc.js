import { r as logTypingFailure } from "./logging-gUWPKC5g.js";
import "./channel-outbound-DlkFd7rO.js";
import { d as resolveDiscordMessageChannelId } from "./message-utils-prcoeLfb.js";
import "./channel-feedback-lNNgzRXo.js";
import { t as createClaimableDedupe } from "./persistent-dedupe-CMTHL22F.js";
import { I as createDiscordRestClient } from "./send.shared-Ciix19qx.js";
import { t as createTypingCallbacks } from "./typing-DnYJejsM.js";
import { t as sendTyping } from "./typing-twzF00UI.js";
//#region extensions/discord/src/monitor/inbound-dedupe.ts
const RECENT_DISCORD_MESSAGE_TTL_MS = 5 * 6e4;
const RECENT_DISCORD_MESSAGE_MAX = 5e3;
function createDiscordInboundReplayGuard() {
  return createClaimableDedupe({
    ttlMs: RECENT_DISCORD_MESSAGE_TTL_MS,
    memoryMaxSize: RECENT_DISCORD_MESSAGE_MAX,
  });
}
var DiscordRetryableInboundError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "DiscordRetryableInboundError";
  }
};
function buildDiscordInboundReplayKey(params) {
  const messageId = params.data.message?.id?.trim();
  if (!messageId) return null;
  const channelId = resolveDiscordMessageChannelId({
    message: params.data.message,
    eventChannelId: params.data.channel_id,
  });
  if (!channelId) return null;
  return `${params.accountId}:${channelId}:${messageId}`;
}
async function claimDiscordInboundReplay(params) {
  const replayKey = params.replayKey?.trim();
  if (!replayKey) return true;
  return (await params.replayGuard.claim(replayKey)).kind === "claimed";
}
async function commitDiscordInboundReplay(params) {
  const replayKeys = normalizeDiscordInboundReplayKeys(params.replayKeys);
  await Promise.all(replayKeys.map((replayKey) => params.replayGuard.commit(replayKey)));
}
function releaseDiscordInboundReplay(params) {
  normalizeDiscordInboundReplayKeys(params.replayKeys).forEach((replayKey) =>
    params.replayGuard.release(replayKey, { error: params.error }),
  );
}
function normalizeDiscordInboundReplayKeys(replayKeys) {
  return [
    ...new Set(
      (replayKeys ?? [])
        .map((replayKey) => replayKey?.trim())
        .filter((replayKey) => Boolean(replayKey)),
    ),
  ];
}
//#endregion
//#region extensions/discord/src/monitor/reply-typing-feedback.ts
const DISCORD_REPLY_TYPING_MAX_DURATION_MS = 20 * 6e4;
function createDiscordReplyTypingFeedback(params) {
  let channelId = params.channelId;
  const rest =
    params.rest ??
    createDiscordRestClient({
      cfg: params.cfg,
      token: params.token,
      accountId: params.accountId,
    }).rest;
  const createCallbacks = () =>
    createTypingCallbacks({
      start: () =>
        sendTyping({
          rest,
          channelId,
        }),
      onStartError: (err) => {
        logTypingFailure({
          log: params.log,
          channel: "discord",
          target: channelId,
          error: err,
        });
      },
      keepaliveIntervalMs: params.keepaliveIntervalMs,
      maxDurationMs: params.maxDurationMs ?? DISCORD_REPLY_TYPING_MAX_DURATION_MS,
    });
  const updateChannelId = (nextChannelId) => {
    const trimmed = nextChannelId.trim();
    if (trimmed) channelId = trimmed;
  };
  let callbacks = createCallbacks();
  return {
    onReplyStart: () => callbacks.onReplyStart(),
    onIdle: () => callbacks.onIdle?.(),
    onCleanup: () => callbacks.onCleanup?.(),
    updateChannelId,
    restartForDispatch: (nextChannelId) => {
      updateChannelId(nextChannelId);
      callbacks.onCleanup?.();
      callbacks = createCallbacks();
    },
    getChannelId: () => channelId,
  };
}
//#endregion
export {
  commitDiscordInboundReplay as a,
  claimDiscordInboundReplay as i,
  DiscordRetryableInboundError as n,
  createDiscordInboundReplayGuard as o,
  buildDiscordInboundReplayKey as r,
  releaseDiscordInboundReplay as s,
  createDiscordReplyTypingFeedback as t,
};
