import {
  i as createAttachedChannelResultAdapter,
  t as attachChannelToResult,
} from "./channel-send-result-Dn_C6AJS.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { n as notifyDiscordInboundEventOutboundPayloadSuccess } from "./inbound-event-delivery-DO43mRtB.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { i as normalizeDiscordOutboundTarget } from "./normalize-DJhKR5QW.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  a as sendDiscordComponentMessageLazy,
  i as resolveDiscordComponentSpec,
  n as buildDiscordPresentationPayload,
  t as DISCORD_PRESENTATION_CAPABILITIES,
} from "./outbound-components-CDASR5K1.js";
import { o as getReplyPayloadTtsSupplement } from "./reply-payload-BK_jICQ3.js";
import "./channel-outbound-DlkFd7rO.js";
import {
  p as resolvePayloadMediaUrls,
  w as createReplyToFanout,
  x as sendTextMediaPayload,
  y as sendPayloadMediaSequenceOrFallback,
} from "./reply-payload-DDwHXDkv.js";
import {
  i as chunkDiscordTextWithMode,
  r as resolveDiscordReplyReference,
} from "./reply-reference-CeynpHZu.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { t as createDiscordSendReceipt } from "./send.receipt-Dc6uxRHl.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  l as normalizeOptionalStringifiedId,
} from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/discord/src/media-detection.ts
const DISCORD_VIDEO_MEDIA_EXTENSIONS = /* @__PURE__ */ new Set([
  ".avi",
  ".m4v",
  ".mkv",
  ".mov",
  ".mp4",
  ".webm",
]);
function normalizeMediaPathForExtension(mediaUrl) {
  const trimmed = mediaUrl.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    const fileName = parsed.pathname.slice(parsed.pathname.lastIndexOf("/") + 1);
    try {
      return normalizeLowercaseStringOrEmpty(decodeURIComponent(fileName));
    } catch {
      return normalizeLowercaseStringOrEmpty(fileName);
    }
  } catch {
    const withoutHash = trimmed.split("#", 1)[0] ?? trimmed;
    return normalizeLowercaseStringOrEmpty(withoutHash.split("?", 1)[0] ?? withoutHash);
  }
}
function isLikelyDiscordVideoMedia(mediaUrl) {
  const normalized = normalizeMediaPathForExtension(mediaUrl);
  for (const ext of DISCORD_VIDEO_MEDIA_EXTENSIONS) if (normalized.endsWith(ext)) return true;
  return false;
}
//#endregion
//#region extensions/discord/src/outbound-approval.ts
function hasApprovalChannelData(payload) {
  const channelData = payload.channelData;
  if (!channelData || typeof channelData !== "object" || Array.isArray(channelData)) return false;
  return Boolean(channelData.execApproval);
}
function neutralizeDiscordApprovalMentions(value) {
  return value
    .replace(/@everyone/gi, "@​everyone")
    .replace(/@here/gi, "@​here")
    .replace(/<@/g, "<@​")
    .replace(/<#/g, "<#​");
}
function normalizeDiscordApprovalPayload(payload) {
  return hasApprovalChannelData(payload) && payload.text
    ? {
        ...payload,
        text: neutralizeDiscordApprovalMentions(payload.text),
      }
    : payload;
}
//#endregion
//#region extensions/discord/src/outbound-send-context.ts
const loadDiscordSendRuntime = createLazyRuntimeModule(() => import("./send-CUIGrZnM.js"));
function resolveDiscordOutboundTarget(params) {
  if (params.threadId == null) return params.to;
  const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
  if (!threadId) return params.to;
  return `channel:${threadId}`;
}
function resolveDiscordFormattingOptions(ctx) {
  const formatting = ctx.formatting;
  return {
    textLimit: formatting?.textLimit,
    maxLinesPerMessage: formatting?.maxLinesPerMessage,
    tableMode: formatting?.tableMode,
    chunkMode: formatting?.chunkMode,
  };
}
async function createDiscordPayloadSendContext(ctx) {
  const runtime = await loadDiscordSendRuntime();
  const nextReplyToId = createReplyToFanout(ctx);
  return {
    target: resolveDiscordOutboundTarget({
      to: ctx.to,
      threadId: ctx.threadId,
    }),
    formatting: resolveDiscordFormattingOptions(ctx),
    resolveReply: () =>
      resolveDiscordReplyReference({
        replyToId: nextReplyToId(),
        replyToIdSource: ctx.replyToIdSource,
        replyToMode: ctx.replyToMode,
      }),
    send: resolveOutboundSendDep(ctx.deps, "discord") ?? runtime.sendMessageDiscord,
    sendVoice: resolveOutboundSendDep(ctx.deps, "discordVoice") ?? runtime.sendVoiceMessageDiscord,
  };
}
//#endregion
//#region extensions/discord/src/outbound-payload.ts
function resolveDiscordDeliveryProgress(ctx) {
  return ctx.onDeliveryResult
    ? async (result) => {
        await ctx.onDeliveryResult?.(attachChannelToResult("discord", result));
      }
    : void 0;
}
function createDiscordUnknownPayloadResult(target) {
  return {
    messageId: "",
    channelId: target,
    receipt: createDiscordSendReceipt({
      platformMessageIds: [],
      channelId: target,
      kind: "unknown",
    }),
  };
}
function resolveDiscordDeliveryOptions(ctx, sendContext, reply = sendContext.resolveReply()) {
  return {
    reply,
    accountId: ctx.accountId ?? void 0,
    silent: ctx.silent ?? void 0,
    cfg: ctx.cfg,
  };
}
function resolveDiscordFormattedDeliveryOptions(
  ctx,
  sendContext,
  reply = sendContext.resolveReply(),
) {
  return {
    ...resolveDiscordDeliveryOptions(ctx, sendContext, reply),
    ...sendContext.formatting,
  };
}
function resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl) {
  return {
    mediaUrl,
    mediaAccess: ctx.mediaAccess,
    mediaLocalRoots: ctx.mediaLocalRoots,
    mediaReadFile: ctx.mediaReadFile,
    ...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
  };
}
async function sendDiscordOutboundPayload(params) {
  const ctx = params.ctx;
  const payload = normalizeDiscordApprovalPayload({
    ...ctx.payload,
    text: ctx.payload.text ?? "",
  });
  const mediaUrls = resolvePayloadMediaUrls(payload);
  const sendContext = await createDiscordPayloadSendContext(ctx);
  if (payload.audioAsVoice && mediaUrls.length > 0) {
    const voiceReply = sendContext.resolveReply();
    let deliveredVoice = false;
    let lastResult;
    try {
      const voiceUrl = expectDefined(mediaUrls.at(0), "non-empty Discord voice media URLs");
      lastResult = await sendContext.sendVoice(sendContext.target, voiceUrl, {
        ...resolveDiscordDeliveryOptions(ctx, sendContext, voiceReply),
      });
      deliveredVoice = true;
    } catch (err) {
      const supplement = getReplyPayloadTtsSupplement(payload);
      const visibleFallbackText = payload.text?.trim() ? payload.text : void 0;
      const hiddenFallbackText = supplement?.visibleTextAlreadyDelivered
        ? void 0
        : supplement?.spokenText;
      const fallbackText = visibleFallbackText ?? hiddenFallbackText;
      if (!fallbackText)
        if (supplement?.visibleTextAlreadyDelivered)
          lastResult = createDiscordUnknownPayloadResult(sendContext.target);
        else throw err;
      else
        lastResult = await sendContext.send(sendContext.target, fallbackText, {
          verbose: false,
          ...resolveDiscordFormattedDeliveryOptions(ctx, sendContext, voiceReply),
          onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
        });
    }
    if (deliveredVoice) await ctx.onDeliveryResult?.(attachChannelToResult("discord", lastResult));
    if (deliveredVoice && payload.text?.trim())
      lastResult = await sendContext.send(sendContext.target, payload.text, {
        verbose: false,
        ...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
        onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
      });
    for (const mediaUrl of mediaUrls.slice(1))
      lastResult = await sendContext.send(sendContext.target, "", {
        verbose: false,
        ...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
        onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
      });
    return attachChannelToResult("discord", lastResult);
  }
  const componentSpec = await resolveDiscordComponentSpec(payload);
  if (!componentSpec) {
    const discordData =
      payload.channelData?.discord &&
      typeof payload.channelData.discord === "object" &&
      !Array.isArray(payload.channelData.discord)
        ? payload.channelData.discord
        : {};
    const nativeComponents = Array.isArray(discordData.components)
      ? discordData.components
      : void 0;
    const embeds = Array.isArray(discordData.embeds) ? discordData.embeds : void 0;
    const filename = normalizeOptionalString(discordData.filename);
    if (nativeComponents || embeds?.length || filename)
      return attachChannelToResult(
        "discord",
        await sendPayloadMediaSequenceOrFallback({
          text: payload.text ?? "",
          mediaUrls,
          fallbackResult: createDiscordUnknownPayloadResult(sendContext.target),
          sendNoMedia: async () =>
            await sendContext.send(sendContext.target, payload.text ?? "", {
              verbose: false,
              components: nativeComponents,
              embeds,
              filename,
              ...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
              onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
            }),
          send: async ({ text, mediaUrl, isFirst }) =>
            await sendContext.send(sendContext.target, text, {
              verbose: false,
              ...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
              components: isFirst ? nativeComponents : void 0,
              embeds: isFirst ? embeds : void 0,
              filename: isFirst ? filename : void 0,
              onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
            }),
        }),
      );
    return await sendTextMediaPayload({
      channel: "discord",
      ctx: {
        ...ctx,
        payload,
      },
      adapter: params.fallbackAdapter,
    });
  }
  return attachChannelToResult(
    "discord",
    await sendPayloadMediaSequenceOrFallback({
      text: payload.text ?? "",
      mediaUrls,
      fallbackResult: createDiscordUnknownPayloadResult(sendContext.target),
      sendNoMedia: async () => {
        return await sendDiscordComponentMessageLazy(sendContext.target, componentSpec, {
          ...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
          onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
        });
      },
      send: async ({ text, mediaUrl, isFirst }) => {
        if (isFirst)
          return await sendDiscordComponentMessageLazy(sendContext.target, componentSpec, {
            ...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
            onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
          });
        return await sendContext.send(sendContext.target, text, {
          verbose: false,
          ...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
          onDeliveryResult: resolveDiscordDeliveryProgress(ctx),
        });
      },
    }),
  );
}
//#endregion
//#region extensions/discord/src/outbound-adapter.ts
const DISCORD_TEXT_CHUNK_LIMIT = 2e3;
const DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE =
  /<\s*(system-reminder|previous_response)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE =
  /<\s*(?:system-reminder|previous_response)\b[^>]*\/\s*>/gi;
const DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE =
  /<\s*\/?\s*(?:system-reminder|previous_response)\b[^>]*>/gi;
function stripDiscordInternalRuntimeScaffolding(text) {
  return text
    .replace(DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_BLOCK_RE, "")
    .replace(DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_SELF_CLOSING_RE, "")
    .replace(DISCORD_INTERNAL_RUNTIME_SCAFFOLDING_TAG_RE, "");
}
const loadDiscordThreadBindings = createLazyRuntimeModule(
  () => import("./thread-bindings-Bv0ouagZ.js"),
);
function resolveDiscordWebhookIdentity(params) {
  const usernameRaw = normalizeOptionalString(params.identity?.name);
  const fallbackUsername = normalizeOptionalString(params.binding.label) ?? params.binding.agentId;
  return {
    username: truncateUtf16Safe(usernameRaw || fallbackUsername || "", 80) || void 0,
    avatarUrl: normalizeOptionalString(params.identity?.avatarUrl),
  };
}
async function maybeSendDiscordWebhookText(params) {
  if (params.threadId == null) return null;
  const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
  if (!threadId) return null;
  const { getThreadBindingManager } = await loadDiscordThreadBindings();
  const manager = getThreadBindingManager(params.accountId ?? void 0);
  if (!manager) return null;
  const binding = manager.getByThreadId(threadId);
  if (!binding?.webhookId || !binding?.webhookToken) return null;
  const persona = resolveDiscordWebhookIdentity({
    identity: params.identity,
    binding,
  });
  const { sendWebhookMessageDiscord } = await loadDiscordSendRuntime();
  return await sendWebhookMessageDiscord(params.text, {
    webhookId: binding.webhookId,
    webhookToken: binding.webhookToken,
    accountId: binding.accountId,
    threadId: binding.threadId,
    cfg: params.cfg,
    replyTo: params.replyToId ?? void 0,
    username: persona.username,
    avatarUrl: persona.avatarUrl,
  });
}
const discordOutbound = {
  deliveryMode: "direct",
  chunker: (text, limit, ctx) =>
    chunkDiscordTextWithMode(text, {
      maxChars: limit,
      maxLines: ctx?.formatting?.maxLinesPerMessage,
    }),
  textChunkLimit: DISCORD_TEXT_CHUNK_LIMIT,
  sanitizeText: ({ text }) => stripDiscordInternalRuntimeScaffolding(text),
  pollMaxOptions: 10,
  normalizePayload: ({ payload }) => normalizeDiscordApprovalPayload(payload),
  presentationCapabilities: DISCORD_PRESENTATION_CAPABILITIES,
  deliveryCapabilities: {
    durableFinal: {
      text: true,
      media: true,
      poll: true,
      payload: true,
      silent: true,
      replyTo: true,
      thread: true,
      messageSendingHooks: true,
    },
  },
  renderPresentation: async ({ payload, presentation }) => {
    return await buildDiscordPresentationPayload({
      payload,
      presentation,
    });
  },
  resolveTarget: ({ to, allowFrom }) => normalizeDiscordOutboundTarget(to, allowFrom),
  sendPayload: async (ctx) =>
    await sendDiscordOutboundPayload({
      ctx,
      fallbackAdapter: discordOutbound,
    }),
  ...createAttachedChannelResultAdapter({
    channel: "discord",
    sendText: async ({
      cfg,
      to,
      text,
      accountId,
      deps,
      replyToId,
      replyToIdSource,
      replyToMode,
      threadId,
      identity,
      silent,
      formatting,
      onDeliveryResult,
    }) => {
      if (!silent) {
        const webhookResult = await maybeSendDiscordWebhookText({
          cfg,
          text,
          threadId,
          accountId,
          identity,
          replyToId,
        }).catch(() => null);
        if (webhookResult) return webhookResult;
      }
      return await (
        resolveOutboundSendDep(deps, "discord") ??
        (await loadDiscordSendRuntime()).sendMessageDiscord
      )(
        resolveDiscordOutboundTarget({
          to,
          threadId,
        }),
        text,
        {
          verbose: false,
          reply: resolveDiscordReplyReference({
            replyToId,
            replyToIdSource,
            replyToMode,
          }),
          accountId: accountId ?? void 0,
          silent: silent ?? void 0,
          cfg,
          ...resolveDiscordFormattingOptions({ formatting }),
          onDeliveryResult: onDeliveryResult
            ? async (result) => {
                await onDeliveryResult(attachChannelToResult("discord", result));
              }
            : void 0,
        },
      );
    },
    sendMedia: async ({
      cfg,
      to,
      text,
      mediaUrl,
      audioAsVoice,
      mediaAccess,
      mediaLocalRoots,
      mediaReadFile,
      accountId,
      deps,
      replyToId,
      replyToIdSource,
      replyToMode,
      threadId,
      silent,
      formatting,
      onDeliveryResult,
    }) => {
      const send =
        resolveOutboundSendDep(deps, "discord") ??
        (await loadDiscordSendRuntime()).sendMessageDiscord;
      const target = resolveDiscordOutboundTarget({
        to,
        threadId,
      });
      const formattingOptions = resolveDiscordFormattingOptions({ formatting });
      const reply = resolveDiscordReplyReference({
        replyToId,
        replyToIdSource,
        replyToMode,
      });
      if (audioAsVoice && mediaUrl)
        return await (
          resolveOutboundSendDep(deps, "discordVoice") ??
          (await loadDiscordSendRuntime()).sendVoiceMessageDiscord
        )(target, mediaUrl, {
          cfg,
          reply,
          accountId: accountId ?? void 0,
          silent: silent ?? void 0,
        });
      if (text.trim() && mediaUrl && isLikelyDiscordVideoMedia(mediaUrl)) {
        await send(target, text, {
          verbose: false,
          reply,
          accountId: accountId ?? void 0,
          silent: silent ?? void 0,
          cfg,
          ...formattingOptions,
          onDeliveryResult: onDeliveryResult
            ? async (result) => {
                await onDeliveryResult(attachChannelToResult("discord", result));
              }
            : void 0,
        });
        return await send(target, "", {
          verbose: false,
          mediaUrl,
          reply: reply?.scope === "all" ? reply : void 0,
          mediaAccess,
          mediaLocalRoots,
          mediaReadFile,
          accountId: accountId ?? void 0,
          silent: silent ?? void 0,
          cfg,
          ...formattingOptions,
          onDeliveryResult: onDeliveryResult
            ? async (result) => {
                await onDeliveryResult(attachChannelToResult("discord", result));
              }
            : void 0,
        });
      }
      return await send(target, text, {
        verbose: false,
        mediaUrl,
        mediaAccess,
        mediaLocalRoots,
        mediaReadFile,
        reply,
        accountId: accountId ?? void 0,
        silent: silent ?? void 0,
        cfg,
        ...formattingOptions,
        onDeliveryResult: onDeliveryResult
          ? async (result) => {
              await onDeliveryResult(attachChannelToResult("discord", result));
            }
          : void 0,
      });
    },
    sendPoll: async ({ cfg, to, poll, accountId, threadId, silent }) =>
      await (
        await loadDiscordSendRuntime()
      ).sendPollDiscord(
        resolveDiscordOutboundTarget({
          to,
          threadId,
        }),
        poll,
        {
          accountId: accountId ?? void 0,
          silent: silent ?? void 0,
          cfg,
        },
      ),
  }),
  afterDeliverPayload: async ({ target, payload }) => {
    notifyDiscordInboundEventOutboundPayloadSuccess({
      payload,
      to: resolveDiscordOutboundTarget({
        to: target.to,
        threadId: target.threadId,
      }),
      accountId: target.accountId,
    });
    const threadId = normalizeOptionalStringifiedId(target.threadId);
    if (!threadId) return;
    const { getThreadBindingManager } = await loadDiscordThreadBindings();
    const manager = getThreadBindingManager(target.accountId ?? void 0);
    if (!manager?.getByThreadId(threadId)) return;
    manager.touchThread({ threadId });
  },
};
//#endregion
export { discordOutbound as n, DISCORD_TEXT_CHUNK_LIMIT as t };
