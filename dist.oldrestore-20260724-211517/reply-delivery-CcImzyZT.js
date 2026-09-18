import {
  i as sanitizeAssistantVisibleTextWithProfile,
  n as sanitizeAssistantVisibleText,
} from "./assistant-visible-text-DV1Yognj.js";
import { n as sendDurableMessageBatch } from "./channel-outbound-DlkFd7rO.js";
import { c as formatReasoningMessage } from "./embedded-agent-utils-Coji3F8W.js";
import { i as resolveTimestampMs } from "./format-DZW075F7.js";
import { t as resolveAgentAvatar } from "./identity-avatar-C7CduG15.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-DDwHXDkv.js";
import { o as sendVoiceMessageDiscord } from "./send-BrvWC0qr.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as sendMessageDiscord } from "./send.outbound-CrioyPr2.js";
import { t as resolveDiscordSenderIdentity } from "./sender-identity-dZhk6b7k.js";
import "./agent-runtime-BiQiwmwD.js";
import { t as buildOutboundSessionContext } from "./session-context-CryOjB_1.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as stripPlainTextToolCallBlocks } from "./tool-payload-DV5VuWF_.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/discord/src/monitor/reply-context.ts
function resolveReplyContext(message, resolveDiscordMessageText) {
  const referenced = message.referencedMessage;
  if (!referenced?.author) return null;
  const referencedText = resolveDiscordMessageText(referenced, { includeForwarded: true });
  if (!referencedText) return null;
  const sender = resolveDiscordSenderIdentity({
    author: referenced.author,
    pluralkitInfo: null,
  });
  return {
    id: referenced.id,
    channelId: referenced.channelId,
    sender: sender.tag ?? sender.label ?? "unknown",
    senderId: referenced.author.id,
    senderName: referenced.author.username ?? void 0,
    senderTag: sender.tag ?? void 0,
    memberRoleIds: (() => {
      const roles = referenced.member?.roles;
      return Array.isArray(roles) ? roles.map((roleId) => roleId) : void 0;
    })(),
    body: referencedText,
    timestamp: resolveTimestampMs(referenced.timestamp),
  };
}
function buildDirectLabel(author, tagOverride) {
  return `${
    (tagOverride?.trim() ||
      resolveDiscordSenderIdentity({
        author,
        pluralkitInfo: null,
      }).tag) ??
    "unknown"
  } user id:${author.id}`;
}
function buildGuildLabel(params) {
  const { guild, channelName, channelId } = params;
  return `${guild?.name ?? "Guild"} #${channelName} channel id:${channelId}`;
}
//#endregion
//#region extensions/discord/src/monitor/reply-safety.ts
const DISCORD_INTERNAL_CHANNEL_LINE_RE =
  /^(?:>\s*)?(?:analysis|commentary|thinking|reasoning)\s*[:=]/i;
function hasNonEmptyRecord(value) {
  return Boolean(
    value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0,
  );
}
function hasInteractiveOrPresentationBlocks(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value;
  if (typeof record.title === "string" && record.title.trim().length > 0) return true;
  return Array.isArray(record.blocks) && record.blocks.length > 0;
}
function hasNonTextReplyPayloadContent(payload) {
  return (
    payload.audioAsVoice === true ||
    hasNonEmptyRecord(payload.channelData) ||
    hasInteractiveOrPresentationBlocks(payload.interactive) ||
    hasInteractiveOrPresentationBlocks(payload.presentation)
  );
}
function collapseExcessBlankLines(text) {
  return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}
function stripDiscordInternalChannelLines(text) {
  let inFence = false;
  const kept = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      kept.push(line);
      continue;
    }
    if (!inFence && DISCORD_INTERNAL_CHANNEL_LINE_RE.test(line.trim())) continue;
    kept.push(line);
  }
  return kept.join("\n");
}
function sanitizeDiscordFrontChannelText(text) {
  return collapseExcessBlankLines(
    stripDiscordInternalChannelLines(
      stripPlainTextToolCallBlocks(
        sanitizeAssistantVisibleText(stripPlainTextToolCallBlocks(text)),
      ),
    ),
  ).trim();
}
function sanitizeDiscordFrontChannelReplyPayloads(payloads, options = {}) {
  const preserveVerboseToolProgress = options.kind === "tool";
  const safePayloads = [];
  for (const payload of payloads) {
    const safeText =
      typeof payload.text === "string"
        ? preserveVerboseToolProgress
          ? collapseExcessBlankLines(
              sanitizeAssistantVisibleTextWithProfile(payload.text, "tool-progress"),
            ).trim()
          : sanitizeDiscordFrontChannelText(payload.text)
        : payload.text;
    const nextPayload =
      safeText === payload.text
        ? payload
        : {
            ...payload,
            text: safeText || void 0,
          };
    if (
      !resolveSendableOutboundReplyParts(nextPayload).hasContent &&
      !hasNonTextReplyPayloadContent(nextPayload)
    )
      continue;
    safePayloads.push(nextPayload);
  }
  return safePayloads;
}
//#endregion
//#region extensions/discord/src/monitor/reply-delivery.ts
function formatDiscordReplyDeliveryFailure(params) {
  const context = [
    `target=${params.target}`,
    params.sessionKey ? `session=${params.sessionKey}` : void 0,
  ]
    .filter(Boolean)
    .join(" ");
  return `discord ${params.kind} reply failed (${context}): ${String(params.err)}`;
}
function resolveTargetChannelId(target) {
  if (!target.startsWith("channel:")) return;
  return target.slice(8).trim() || void 0;
}
function resolveBoundThreadBinding(params) {
  const sessionKey = params.sessionKey?.trim();
  if (!params.threadBindings || !sessionKey) return;
  const targetChannelId = resolveTargetChannelId(params.target);
  if (!targetChannelId) return;
  return params.threadBindings
    .listBySessionKey(sessionKey)
    .find((entry) => entry.threadId === targetChannelId);
}
function resolveBindingIdentity(cfg, binding) {
  if (!binding) return;
  const identity = {
    name: truncateUtf16Safe(
      `🤖 ${binding.label?.trim() || binding.agentId}`.trim() || "🤖 agent",
      80,
    ),
  };
  try {
    const avatar = resolveAgentAvatar(cfg, binding.agentId);
    if (avatar.kind === "remote") identity.avatarUrl = avatar.url;
  } catch {}
  return identity;
}
function createDiscordDeliveryDeps(params) {
  return {
    discord: (to, text, opts) =>
      sendMessageDiscord(to, text, {
        ...opts,
        cfg: opts?.cfg ?? params.cfg,
        token: params.token,
        rest: params.rest,
        ...(params.allowedMentions ? { allowedMentions: params.allowedMentions } : {}),
      }),
    discordVoice: (to, audioPath, opts) =>
      sendVoiceMessageDiscord(to, audioPath, {
        ...opts,
        cfg: opts?.cfg ?? params.cfg,
        token: params.token,
        rest: params.rest,
      }),
  };
}
function resolveDiscordDeliveryOptions(params) {
  const binding = resolveBoundThreadBinding({
    threadBindings: params.threadBindings,
    sessionKey: params.sessionKey,
    target: params.target,
  });
  return {
    to: binding ? `channel:${binding.channelId}` : params.target,
    threadId: binding?.threadId,
    agentId: binding?.agentId,
    identity: resolveBindingIdentity(params.cfg, binding),
    mediaAccess: params.mediaLocalRoots?.length ? { localRoots: params.mediaLocalRoots } : void 0,
    replyToMode: params.replyToMode ?? "all",
    formatting: {
      textLimit: params.textLimit,
      maxLinesPerMessage: params.maxLinesPerMessage,
      tableMode: params.tableMode,
      chunkMode: params.chunkMode,
    },
  };
}
function formatDiscordReasoningPayload(payload) {
  if (payload.isReasoning !== true) return payload;
  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const nextPayload = {
    ...payload,
    text: formatReasoningMessage(text),
  };
  delete nextPayload.isReasoning;
  return nextPayload;
}
async function deliverDiscordReply(params) {
  params.runtime;
  const delivery = resolveDiscordDeliveryOptions(params);
  const payloads = sanitizeDiscordFrontChannelReplyPayloads(params.replies, {
    kind: params.kind,
  }).map(formatDiscordReasoningPayload);
  if (payloads.length === 0) return;
  const send = await sendDurableMessageBatch({
    cfg: params.cfg,
    channel: "discord",
    to: delivery.to,
    accountId: params.accountId,
    payloads,
    replyToId: normalizeOptionalString(params.replyToId),
    replyToMode: delivery.replyToMode,
    formatting: delivery.formatting,
    threadId: delivery.threadId,
    identity: delivery.identity,
    deps: createDiscordDeliveryDeps({
      cfg: params.cfg,
      token: params.token,
      rest: params.rest,
      allowedMentions: params.allowedMentions,
    }),
    mediaAccess: delivery.mediaAccess,
    session: buildOutboundSessionContext({
      cfg: params.cfg,
      sessionKey: params.sessionKey,
      agentId: delivery.agentId,
      requesterAccountId: params.accountId,
    }),
  });
  if (send.status === "failed" || send.status === "partial_failed") throw send.error;
  if ((send.status === "sent" ? send.results : []).length === 0)
    throw new Error(`discord final reply produced no delivered message for ${delivery.to}`);
}
//#endregion
export {
  buildGuildLabel as a,
  buildDirectLabel as i,
  formatDiscordReplyDeliveryFailure as n,
  resolveReplyContext as o,
  sanitizeDiscordFrontChannelReplyPayloads as r,
  deliverDiscordReply as t,
};
