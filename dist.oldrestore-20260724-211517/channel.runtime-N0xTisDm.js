import path from "node:path";
import {
  b as parseFeishuCommentTarget,
  l as resolveFeishuRuntimeAccount,
  s as resolveFeishuAccount,
} from "./accounts-upJPqv8I.js";
import {
  i as createAttachedChannelResultAdapter,
  t as attachChannelToResult,
} from "./channel-send-result-Dn_C6AJS.js";
import { n as createFeishuClient } from "./client-BCjLU970.js";
import {
  c as buildFeishuDirectChatMembers,
  d as getFeishuMemberInfo,
  l as getChatInfo,
  r as cleanupAmbientCommentTypingReaction,
  s as assertFeishuChatMember,
  t as deliverCommentThreadText,
  u as getChatMembers,
} from "./drive-DIXColLB.js";
import {
  c as normalizeInteractiveReply,
  h as resolveInteractiveTextFallback,
  l as normalizeMessagePresentation,
  o as interactiveReplyToPresentation,
  p as renderMessagePresentationFallbackText,
} from "./payload-BFbDi85B.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  c as listFeishuDirectoryPeers,
  i as isFeishuCardWithinEnvelope,
  r as buildFeishuPresentationCardElements,
  s as listFeishuDirectoryGroups,
  t as assertFeishuCardWithinEnvelope,
} from "./presentation-card-Bxz3IEyg.js";
import "./channel-outbound-DlkFd7rO.js";
import { t as probeFeishu } from "./probe-gUyS3oUp.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as statRegularFileSync } from "./regular-file-CuvhUtZS.js";
import {
  p as resolvePayloadMediaUrls,
  v as sendPayloadMediaSequenceAndFinalize,
  w as createReplyToFanout,
  x as sendTextMediaPayload,
} from "./reply-payload-DDwHXDkv.js";
import {
  a as sendMarkdownCardFeishu,
  h as shouldSuppressFeishuTextForVoiceMedia,
  i as sendCardFeishu,
  m as sendMediaFeishu,
  n as getMessageFeishu,
  o as sendMessageFeishu,
  s as sendStructuredCardFeishu,
  t as editMessageFeishu,
  v as resolveFeishuIdentityHeaderTitle,
} from "./send-CHsdxp9H.js";
import {
  a as readNativeFeishuCardJson,
  o as resolveFeishuCardTemplate,
  s as sanitizeNativeFeishuCard,
} from "./send-result-BY9GGIVt.js";
import "./runtime-api-BMHCi6Eq.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as chunkTextForOutbound } from "./text-chunking-Dr19ggf-.js";
//#region extensions/feishu/src/directory.ts
const MAX_FEISHU_DIRECTORY_PAGES = 100;
async function listFeishuDirectoryPeersLive(params) {
  const account = resolveFeishuAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (!account.configured) return listFeishuDirectoryPeers(params);
  try {
    const client = createFeishuClient(account);
    const peers = [];
    const limit = params.limit ?? 50;
    const response = await client.contact.user.list({ params: { page_size: Math.min(limit, 50) } });
    if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
    const q = normalizeLowercaseStringOrEmpty(params.query);
    for (const user of response.data?.items ?? []) {
      if (user.open_id) {
        const name = user.name || "";
        if (
          !q ||
          normalizeLowercaseStringOrEmpty(user.open_id).includes(q) ||
          normalizeLowercaseStringOrEmpty(name).includes(q)
        )
          peers.push({
            kind: "user",
            id: user.open_id,
            name: name || void 0,
          });
      }
      if (peers.length >= limit) break;
    }
    return peers;
  } catch (err) {
    if (params.fallbackToStatic === false)
      throw err instanceof Error
        ? err
        : /* @__PURE__ */ new Error("Feishu live peer lookup failed");
    return listFeishuDirectoryPeers(params);
  }
}
async function listFeishuDirectoryGroupsLive(params) {
  const account = resolveFeishuAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (!account.configured) return listFeishuDirectoryGroups(params);
  try {
    const client = createFeishuClient(account);
    const groups = [];
    const limit = params.limit ?? 50;
    const q = normalizeLowercaseStringOrEmpty(params.query);
    let pageToken;
    let pages = 0;
    const seenPageTokens = /* @__PURE__ */ new Set();
    do {
      const response = await client.im.chat.list({
        params: {
          page_size: Math.min(limit, 100),
          page_token: pageToken,
        },
      });
      if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
      for (const chat of response.data?.items ?? []) {
        if (chat.chat_id) {
          const name = chat.name || "";
          const group = {
            kind: "group",
            id: chat.chat_id,
            name: name || void 0,
          };
          if (
            (!q ||
              normalizeLowercaseStringOrEmpty(chat.chat_id).includes(q) ||
              normalizeLowercaseStringOrEmpty(name).includes(q)) &&
            (!params.filter || params.filter(group))
          )
            groups.push(group);
        }
        if (groups.length >= limit) break;
      }
      pages += 1;
      const nextPageToken = response.data?.has_more ? response.data.page_token : void 0;
      if (nextPageToken && seenPageTokens.has(nextPageToken))
        throw new Error("Feishu live group directory returned a repeated page token");
      if (nextPageToken) seenPageTokens.add(nextPageToken);
      pageToken = nextPageToken;
    } while (pageToken && groups.length < limit && pages < MAX_FEISHU_DIRECTORY_PAGES);
    if (pageToken && pages >= MAX_FEISHU_DIRECTORY_PAGES)
      throw new Error("Feishu live group directory pagination limit exceeded");
    return groups;
  } catch (err) {
    if (params.fallbackToStatic === false)
      throw err instanceof Error
        ? err
        : /* @__PURE__ */ new Error("Feishu live group lookup failed");
    return listFeishuDirectoryGroups(params);
  }
}
//#endregion
//#region extensions/feishu/src/outbound.ts
const RENDERED_FEISHU_CARD = Symbol("openclaw.renderedFeishuCard");
const FEISHU_PRESENTATION_FALLBACK_MARKER = "__openclawPresentationFallback";
const FEISHU_TEXT_CHUNK_LIMIT = 4e3;
function normalizePossibleLocalImagePath(text) {
  const raw = text?.trim();
  if (!raw) return null;
  if (/\s/.test(raw)) return null;
  if (/^(https?:\/\/|data:|file:\/\/)/i.test(raw)) return null;
  const ext = normalizeLowercaseStringOrEmpty(path.extname(raw));
  if (![".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".ico", ".tiff"].includes(ext))
    return null;
  if (!path.isAbsolute(raw)) return null;
  try {
    if (statRegularFileSync(raw).missing) return null;
  } catch {
    return null;
  }
  return raw;
}
function shouldUseCard(text) {
  return /```[\s\S]*?```/.test(text) || /\|.+\|[\r\n]+\|[-:| ]+\|/.test(text);
}
function markRenderedFeishuCard(card) {
  Object.defineProperty(card, RENDERED_FEISHU_CARD, {
    value: true,
    enumerable: false,
  });
  return card;
}
function readNativeFeishuCard(payload) {
  const feishuData = payload.channelData?.feishu;
  if (!isRecord(feishuData)) return;
  const card = feishuData.card ?? feishuData.interactiveCard;
  if (!isRecord(card)) return;
  if (card[RENDERED_FEISHU_CARD] === true) return card;
  const sanitizedCard = sanitizeNativeFeishuCard(card);
  return sanitizedCard ? markRenderedFeishuCard(sanitizedCard) : void 0;
}
function consumeFeishuPresentationFallbackMarker(payload) {
  const feishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
  if (feishuData?.[FEISHU_PRESENTATION_FALLBACK_MARKER] !== true)
    return {
      payload,
      presentationFallback: false,
    };
  const nextFeishuData = { ...feishuData };
  delete nextFeishuData[FEISHU_PRESENTATION_FALLBACK_MARKER];
  const nextChannelData = { ...payload.channelData };
  if (Object.keys(nextFeishuData).length > 0) nextChannelData.feishu = nextFeishuData;
  else delete nextChannelData.feishu;
  return {
    payload: {
      ...payload,
      channelData: Object.keys(nextChannelData).length > 0 ? nextChannelData : void 0,
    },
    presentationFallback: true,
  };
}
function buildFeishuPayloadCard(params) {
  const nativeCard = readNativeFeishuCard(params.payload);
  if (nativeCard) {
    assertFeishuCardWithinEnvelope(nativeCard, "Feishu native card");
    return nativeCard;
  }
  const rawText = params.text ?? params.payload.text;
  const textCard = readNativeFeishuCardJson(rawText);
  const interactive = normalizeInteractiveReply(params.payload.interactive);
  const presentation =
    normalizeMessagePresentation(params.payload.presentation) ??
    (interactive ? interactiveReplyToPresentation(interactive) : void 0);
  if (!presentation && !interactive) {
    if (!textCard) return;
    assertFeishuCardWithinEnvelope(textCard, "Feishu native card");
    return markRenderedFeishuCard(textCard);
  }
  const text = textCard
    ? void 0
    : resolveInteractiveTextFallback({
        text: rawText,
        interactive,
      });
  const elements = presentation
    ? buildFeishuPresentationCardElements({
        presentation,
        fallbackText: text,
      })
    : [
        {
          tag: "markdown",
          content: renderMessagePresentationFallbackText({
            text,
            presentation,
          }),
        },
      ];
  const identityTitle = resolveFeishuIdentityHeaderTitle(params.identity);
  const title = presentation?.title ?? identityTitle;
  const template = resolveFeishuCardTemplate(
    presentation?.tone === "danger"
      ? "red"
      : presentation?.tone === "warning"
        ? "orange"
        : presentation?.tone === "success"
          ? "green"
          : "blue",
  );
  const card = markRenderedFeishuCard({
    schema: "2.0",
    config: { width_mode: "fill" },
    ...(title
      ? {
          header: {
            title: {
              tag: "plain_text",
              content: title,
            },
            template: template ?? "blue",
          },
        }
      : {}),
    body: { elements },
  });
  return isFeishuCardWithinEnvelope(card) ? card : void 0;
}
function hasVisibleFallbackCommand(blocks) {
  return (
    blocks?.some(
      (block) =>
        block.type === "buttons" &&
        block.buttons.some(
          (button) =>
            !button.disabled &&
            button.action?.type === "command" &&
            !button.url &&
            !button.webApp?.url &&
            !button.web_app?.url,
        ),
    ) ?? false
  );
}
function renderFeishuPresentationPayload({ payload, presentation, ctx }) {
  const fallbackText = renderMessagePresentationFallbackText({
    text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
    presentation,
  });
  const card = buildFeishuPayloadCard({
    payload,
    text: payload.text,
    identity: ctx.identity,
  });
  const existingFeishuData = isRecord(payload.channelData?.feishu)
    ? payload.channelData.feishu
    : void 0;
  const fallbackHasCommand = hasVisibleFallbackCommand(presentation?.blocks);
  if (!card)
    return {
      ...payload,
      text: fallbackText,
      channelData: {
        ...payload.channelData,
        feishu: {
          ...existingFeishuData,
          [FEISHU_PRESENTATION_FALLBACK_MARKER]: true,
          ...(fallbackHasCommand ? { fallbackHasCommand: true } : {}),
        },
      },
    };
  return {
    ...payload,
    text: fallbackText,
    channelData: {
      ...payload.channelData,
      feishu: {
        ...existingFeishuData,
        card,
        ...(fallbackHasCommand ? { fallbackHasCommand: true } : {}),
      },
    },
  };
}
function resolveFeishuReplyMode(params) {
  const replyToMessageId = params.replyToId?.trim();
  if (replyToMessageId)
    return {
      normalizedReplyToId: replyToMessageId,
      replyToMessageId,
      replyInThread: false,
    };
  const threadId = params.threadId == null ? void 0 : String(params.threadId).trim();
  return threadId
    ? {
        normalizedReplyToId: void 0,
        replyToMessageId: threadId,
        replyInThread: true,
      }
    : {
        normalizedReplyToId: void 0,
        replyToMessageId: void 0,
        replyInThread: false,
      };
}
async function sendCommentThreadReply(params) {
  const target = parseFeishuCommentTarget(params.to);
  if (!target) return null;
  const client = createFeishuClient(
    resolveFeishuAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }),
  );
  const replyId = params.replyId?.trim();
  try {
    const result = await deliverCommentThreadText(client, {
      file_token: target.fileToken,
      file_type: target.fileType,
      comment_id: target.commentId,
      content: params.text,
    });
    return {
      messageId:
        (typeof result.reply_id === "string" && result.reply_id) ||
        (typeof result.comment_id === "string" && result.comment_id) ||
        "",
      chatId: target.commentId,
      result,
    };
  } finally {
    if (replyId)
      cleanupAmbientCommentTypingReaction({
        client,
        deliveryContext: {
          channel: "feishu",
          to: params.to,
          threadId: replyId,
        },
      });
  }
}
async function sendOutboundText(params) {
  const { cfg, to, text, accountId, replyToMessageId, replyInThread } = params;
  const commentResult = await sendCommentThreadReply({
    cfg,
    to,
    text,
    replyId: replyToMessageId,
    accountId,
  });
  if (commentResult) return commentResult;
  const renderMode =
    resolveFeishuAccount({
      cfg,
      accountId,
    }).config?.renderMode ?? "auto";
  if (renderMode === "card" || (renderMode === "auto" && shouldUseCard(text)))
    return sendMarkdownCardFeishu({
      cfg,
      to,
      text,
      accountId,
      replyToMessageId,
      replyInThread,
    });
  return sendMessageFeishu({
    cfg,
    to,
    text,
    accountId,
    replyToMessageId,
    replyInThread,
  });
}
async function sendFeishuFallbackPayload(params) {
  const ctx = {
    ...params.ctx,
    payload: params.payload,
  };
  const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(params.payload));
  const text = params.payload.text ?? "";
  const textChunks = text ? chunkTextForOutbound(text, FEISHU_TEXT_CHUNK_LIMIT) : [];
  if (!(mediaUrls.length > 0 && (params.separateMediaAndText === true || textChunks.length > 1)))
    return await sendTextMediaPayload({
      channel: "feishu",
      ctx,
      adapter: feishuOutbound,
    });
  const { normalizedReplyToId } = resolveFeishuReplyMode({
    replyToId: ctx.replyToId,
    threadId: ctx.threadId,
  });
  const nextReplyToId = createReplyToFanout({
    replyToId: normalizedReplyToId,
    replyToIdSource: ctx.replyToIdSource,
    replyToMode: ctx.replyToMode,
  });
  const sendMedia = feishuOutbound.sendMedia;
  const sendText = feishuOutbound.sendText;
  if (!sendMedia || !sendText) throw new Error("Feishu fallback delivery is not available.");
  let lastResult;
  for (const mediaUrl of mediaUrls) {
    lastResult = await sendMedia({
      ...ctx,
      text: "",
      mediaUrl,
      replyToId: nextReplyToId(),
      audioAsVoice: params.payload.audioAsVoice ?? ctx.audioAsVoice,
      onDeliveryResult: void 0,
    });
    await ctx.onDeliveryResult?.(lastResult);
  }
  for (const chunk of textChunks) {
    lastResult = await sendText({
      ...ctx,
      text: chunk,
      replyToId: nextReplyToId(),
      onDeliveryResult: void 0,
    });
    await ctx.onDeliveryResult?.(lastResult);
  }
  return lastResult;
}
const feishuOutbound = {
  deliveryMode: "direct",
  chunker: chunkTextForOutbound,
  chunkerMode: "markdown",
  textChunkLimit: FEISHU_TEXT_CHUNK_LIMIT,
  presentationCapabilities: {
    supported: true,
    buttons: true,
    selects: false,
    context: true,
    divider: true,
    limits: {
      actions: {
        maxActions: 20,
        maxActionsPerRow: 5,
        maxLabelLength: 40,
        maxValueBytes: 1024,
      },
      text: {
        maxLength: FEISHU_TEXT_CHUNK_LIMIT,
        encoding: "characters",
        markdownDialect: "markdown",
      },
    },
  },
  renderPresentation: renderFeishuPresentationPayload,
  sendPayload: async (ctx) => {
    const { payload, presentationFallback } = consumeFeishuPresentationFallbackMarker(ctx.payload);
    if (parseFeishuCommentTarget(ctx.to)) {
      const interactive = normalizeInteractiveReply(payload.interactive);
      const normalizedPresentation =
        normalizeMessagePresentation(payload.presentation) ??
        (interactive ? interactiveReplyToPresentation(interactive) : void 0);
      const textCard = readNativeFeishuCardJson(payload.text);
      const presentationFallbackText = renderMessagePresentationFallbackText({
        text: textCard ? void 0 : payload.text,
        presentation: normalizedPresentation,
      });
      const hasFallbackMedia = normalizeStringEntries(resolvePayloadMediaUrls(payload)).length > 0;
      if (
        !presentationFallbackText.trim() &&
        !hasFallbackMedia &&
        (textCard || readNativeFeishuCard(payload))
      )
        throw new Error(
          "Feishu native cards cannot be sent to document comments without a text or media fallback.",
        );
      const text =
        hasVisibleFallbackCommand(normalizedPresentation?.blocks) ||
        (isRecord(payload.channelData?.feishu) &&
          payload.channelData.feishu.fallbackHasCommand === true)
          ? `${presentationFallbackText}\n\n> Interactive buttons are unavailable in Feishu document comments. You can type the command shown above manually.`
          : presentationFallbackText;
      return await sendFeishuFallbackPayload({
        ctx,
        payload: {
          ...payload,
          text,
          interactive: void 0,
          presentation: void 0,
          channelData: void 0,
        },
        separateMediaAndText: true,
      });
    }
    const card = buildFeishuPayloadCard({
      payload,
      text: ctx.text,
      identity: ctx.identity,
    });
    if (!card) {
      const interactive = normalizeInteractiveReply(payload.interactive);
      const presentation =
        normalizeMessagePresentation(payload.presentation) ??
        (interactive ? interactiveReplyToPresentation(interactive) : void 0);
      return await sendFeishuFallbackPayload({
        ctx,
        payload: presentation
          ? {
              ...payload,
              text: renderMessagePresentationFallbackText({
                text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
                presentation,
              }),
              presentation: void 0,
              interactive: void 0,
            }
          : payload,
        separateMediaAndText: presentationFallback || presentation !== void 0,
      });
    }
    const { normalizedReplyToId } = resolveFeishuReplyMode({
      replyToId: ctx.replyToId,
      threadId: ctx.threadId,
    });
    const nextReplyToId = createReplyToFanout({
      replyToId: normalizedReplyToId,
      replyToIdSource: ctx.replyToIdSource,
      replyToMode: ctx.replyToMode,
    });
    const nextReplyMode = () =>
      resolveFeishuReplyMode({
        replyToId: nextReplyToId(),
        threadId: ctx.threadId,
      });
    const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(payload));
    return attachChannelToResult(
      "feishu",
      await sendPayloadMediaSequenceAndFinalize({
        text: payload.text ?? "",
        mediaUrls,
        onResult: async (deliveryResult) => {
          await ctx.onDeliveryResult?.(attachChannelToResult("feishu", deliveryResult));
        },
        send: async ({ mediaUrl }) => {
          const { replyToMessageId, replyInThread } = nextReplyMode();
          return await sendMediaFeishu({
            cfg: ctx.cfg,
            to: ctx.to,
            mediaUrl,
            accountId: ctx.accountId ?? void 0,
            mediaLocalRoots: ctx.mediaLocalRoots,
            replyToMessageId,
            replyInThread,
            ...(payload.audioAsVoice === true || ctx.audioAsVoice === true
              ? { audioAsVoice: true }
              : {}),
          });
        },
        finalize: async () => {
          const { replyToMessageId, replyInThread } = nextReplyMode();
          return await sendCardFeishu({
            cfg: ctx.cfg,
            to: ctx.to,
            card,
            replyToMessageId,
            replyInThread,
            accountId: ctx.accountId ?? void 0,
          });
        },
      }),
    );
  },
  ...createAttachedChannelResultAdapter({
    channel: "feishu",
    sendText: async ({
      cfg,
      to,
      text,
      accountId,
      replyToId,
      threadId,
      mediaLocalRoots,
      identity,
    }) => {
      const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
        replyToId,
        threadId,
      });
      const localImagePath = normalizePossibleLocalImagePath(text);
      if (localImagePath)
        try {
          return await sendMediaFeishu({
            cfg,
            to,
            mediaUrl: localImagePath,
            accountId: accountId ?? void 0,
            replyToMessageId,
            replyInThread,
            mediaLocalRoots,
          });
        } catch (err) {
          console.error(`[feishu] local image path auto-send failed:`, err);
        }
      if (parseFeishuCommentTarget(to))
        return await sendOutboundText({
          cfg,
          to,
          text,
          accountId: accountId ?? void 0,
          replyToMessageId,
          replyInThread,
        });
      const card = readNativeFeishuCardJson(text);
      if (card) {
        assertFeishuCardWithinEnvelope(card, "Feishu native card");
        return await sendCardFeishu({
          cfg,
          to,
          card: markRenderedFeishuCard(card),
          accountId: accountId ?? void 0,
          replyToMessageId,
          replyInThread,
        });
      }
      const renderMode =
        resolveFeishuAccount({
          cfg,
          accountId: accountId ?? void 0,
        }).config?.renderMode ?? "auto";
      if (renderMode === "card" || (renderMode === "auto" && shouldUseCard(text))) {
        const header = identity
          ? {
              title: resolveFeishuIdentityHeaderTitle(identity),
              template: "blue",
            }
          : void 0;
        return await sendStructuredCardFeishu({
          cfg,
          to,
          text,
          replyToMessageId,
          replyInThread,
          accountId: accountId ?? void 0,
          header: header?.title ? header : void 0,
        });
      }
      return await sendOutboundText({
        cfg,
        to,
        text,
        accountId: accountId ?? void 0,
        replyToMessageId,
        replyInThread,
      });
    },
    sendMedia: async ({
      cfg,
      to,
      text,
      mediaUrl,
      audioAsVoice,
      accountId,
      mediaLocalRoots,
      replyToId,
      threadId,
      onDeliveryResult,
    }) => {
      const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
        replyToId,
        threadId,
      });
      if (parseFeishuCommentTarget(to))
        return await sendOutboundText({
          cfg,
          to,
          text:
            [text?.trim(), mediaUrl?.trim()].filter(Boolean).join("\n\n") || mediaUrl || text || "",
          accountId: accountId ?? void 0,
          replyToMessageId,
          replyInThread,
        });
      const suppressTextForVoiceMedia =
        mediaUrl !== void 0 &&
        shouldSuppressFeishuTextForVoiceMedia({
          mediaUrl,
          audioAsVoice,
        });
      const reportDelivery = async (result) => {
        await onDeliveryResult?.(attachChannelToResult("feishu", result));
      };
      let textSent = false;
      if (text?.trim() && !suppressTextForVoiceMedia) {
        const textResult = await sendOutboundText({
          cfg,
          to,
          text,
          accountId: accountId ?? void 0,
          replyToMessageId,
          replyInThread,
        });
        textSent = true;
        await reportDelivery(textResult);
      }
      if (mediaUrl) {
        let mediaResult;
        try {
          mediaResult = await sendMediaFeishu({
            cfg,
            to,
            mediaUrl,
            accountId: accountId ?? void 0,
            mediaLocalRoots,
            replyToMessageId,
            replyInThread,
            ...(audioAsVoice === true ? { audioAsVoice: true } : {}),
          });
        } catch (err) {
          console.error(`[feishu] sendMediaFeishu failed:`, err);
          const fallbackResult = await sendOutboundText({
            cfg,
            to,
            text: [textSent ? void 0 : text?.trim(), `📎 ${mediaUrl}`].filter(Boolean).join("\n\n"),
            accountId: accountId ?? void 0,
            replyToMessageId,
            replyInThread,
          });
          await reportDelivery(fallbackResult);
          return fallbackResult;
        }
        await onDeliveryResult?.(attachChannelToResult("feishu", mediaResult));
        if (mediaResult.voiceIntentDegradedToFile && text?.trim())
          await reportDelivery(
            await sendOutboundText({
              cfg,
              to,
              text,
              accountId: accountId ?? void 0,
              replyToMessageId,
              replyInThread,
            }),
          );
        return mediaResult;
      }
      return await sendOutboundText({
        cfg,
        to,
        text: text ?? "",
        accountId: accountId ?? void 0,
        replyToMessageId,
        replyInThread,
      });
    },
  }),
};
//#endregion
//#region extensions/feishu/src/pins.ts
function assertFeishuPinApiSuccess(response, action) {
  if (response.code !== 0)
    throw new Error(`Feishu ${action} failed: ${response.msg || `code ${response.code}`}`);
}
function normalizePin(pin) {
  return {
    messageId: pin.message_id,
    chatId: pin.chat_id,
    operatorId: pin.operator_id,
    operatorIdType: pin.operator_id_type,
    createTime: pin.create_time,
  };
}
async function createPinFeishu(params) {
  const account = resolveFeishuRuntimeAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
  const response = await createFeishuClient(account).im.pin.create({
    data: { message_id: params.messageId },
  });
  assertFeishuPinApiSuccess(response, "pin create");
  return response.data?.pin ? normalizePin(response.data.pin) : null;
}
async function removePinFeishu(params) {
  const account = resolveFeishuRuntimeAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
  assertFeishuPinApiSuccess(
    await createFeishuClient(account).im.pin.delete({ path: { message_id: params.messageId } }),
    "pin delete",
  );
}
async function listPinsFeishu(params) {
  const account = resolveFeishuRuntimeAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
  const response = await createFeishuClient(account).im.pin.list({
    params: {
      chat_id: params.chatId,
      ...(params.startTime ? { start_time: params.startTime } : {}),
      ...(params.endTime ? { end_time: params.endTime } : {}),
      ...(typeof params.pageSize === "number"
        ? { page_size: Math.max(1, Math.min(100, Math.floor(params.pageSize))) }
        : {}),
      ...(params.pageToken ? { page_token: params.pageToken } : {}),
    },
  });
  assertFeishuPinApiSuccess(response, "pin list");
  return {
    chatId: params.chatId,
    pins: (response.data?.items ?? []).map(normalizePin),
    hasMore: response.data?.has_more === true,
    pageToken: response.data?.page_token,
  };
}
//#endregion
//#region extensions/feishu/src/reactions.ts
function resolveConfiguredFeishuClient(params) {
  const account = resolveFeishuRuntimeAccount(params);
  if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
  return createFeishuClient(account);
}
function assertFeishuReactionApiSuccess(response, action) {
  if (response.code !== 0)
    throw new Error(`Feishu ${action} failed: ${response.msg || `code ${response.code}`}`);
}
/**
 * Add a reaction (emoji) to a message.
 * @param emojiType - Feishu emoji type, e.g., "SMILE", "THUMBSUP", "HEART"
 * @see https://open.feishu.cn/document/server-docs/im-v1/message-reaction/emojis-introduce
 */
async function addReactionFeishu(params) {
  const { cfg, messageId, emojiType, accountId } = params;
  const response = await resolveConfiguredFeishuClient({
    cfg,
    accountId,
  }).im.messageReaction.create({
    path: { message_id: messageId },
    data: { reaction_type: { emoji_type: emojiType } },
  });
  assertFeishuReactionApiSuccess(response, "add reaction");
  const reactionId = response.data?.reaction_id;
  if (!reactionId) throw new Error("Feishu add reaction failed: no reaction_id returned");
  return { reactionId };
}
/**
 * Remove a reaction from a message.
 */
async function removeReactionFeishu(params) {
  const { cfg, messageId, reactionId, accountId } = params;
  assertFeishuReactionApiSuccess(
    await resolveConfiguredFeishuClient({
      cfg,
      accountId,
    }).im.messageReaction.delete({
      path: {
        message_id: messageId,
        reaction_id: reactionId,
      },
    }),
    "remove reaction",
  );
}
/**
 * List all reactions for a message.
 */
async function listReactionsFeishu(params) {
  const { cfg, messageId, emojiType, accountId } = params;
  const response = await resolveConfiguredFeishuClient({
    cfg,
    accountId,
  }).im.messageReaction.list({
    path: { message_id: messageId },
    params: emojiType ? { reaction_type: emojiType } : void 0,
  });
  assertFeishuReactionApiSuccess(response, "list reactions");
  return (response.data?.items ?? []).map((item) => ({
    reactionId: item.reaction_id ?? "",
    emojiType: item.reaction_type?.emoji_type ?? "",
    operatorType:
      item.operator?.operator_type === "app"
        ? "app"
        : item.operator?.operator_type === "user"
          ? "user"
          : "unknown",
    operatorId: item.operator?.operator_id ?? "",
  }));
}
//#endregion
//#region extensions/feishu/src/channel.runtime.ts
const feishuChannelRuntime = {
  assertFeishuChatMember,
  buildFeishuDirectChatMembers,
  listFeishuDirectoryGroupsLive,
  listFeishuDirectoryPeersLive,
  feishuOutbound: { ...feishuOutbound },
  createPinFeishu,
  listPinsFeishu,
  removePinFeishu,
  probeFeishu,
  addReactionFeishu,
  listReactionsFeishu,
  removeReactionFeishu,
  getChatInfo,
  getChatMembers,
  getFeishuMemberInfo,
  editMessageFeishu,
  getMessageFeishu,
  sendCardFeishu,
  sendMessageFeishu,
};
//#endregion
export { feishuChannelRuntime };
