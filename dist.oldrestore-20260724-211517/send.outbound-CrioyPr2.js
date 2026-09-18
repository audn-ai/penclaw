import { s as resolveDiscordAccount } from "./accounts-BNPpAWWI.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { s as resolveChunkMode } from "./chunk-DtO_2oor.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  Lt as ChannelType,
  et as createChannelMessage,
  tt as createThread,
} from "./discord-bgbU23Hx.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import { r as rewriteDiscordKnownMentions } from "./mentions-DPSZx-Fv.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-ef53THzv.js";
import "./reply-chunking-aJZ4F_cw.js";
import "./markdown-table-runtime-DkTgtzZ0.js";
import { t as createReusableDiscordReplyReference } from "./reply-reference-CeynpHZu.js";
import { n as createDiscordSendResult } from "./send.receipt-Dc6uxRHl.js";
import {
  F as createDiscordClient,
  P as parseAndResolveChannelRecipient,
  _ as resolveDiscordMessageFlags,
  a as normalizeDiscordPollInput,
  c as normalizeStickerIds,
  f as sendDiscordMedia,
  g as createDiscordMessageNonce,
  h as buildDiscordMessageRequest,
  l as resolveChannelId,
  n as buildDiscordTextChunks,
  p as sendDiscordText,
  t as buildDiscordSendError,
  u as resolveDiscordChannel,
  v as resolveDiscordSendComponents,
  y as resolveDiscordSendEmbeds,
} from "./send.shared-Ciix19qx.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as convertMarkdownTables } from "./tables-YoFSvuf8.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/discord/src/send.outbound.ts
const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;
async function sendDiscordThreadTextChunks(params) {
  for (const chunk of params.chunks)
    await sendDiscordText({
      rest: params.rest,
      channelId: params.threadId,
      text: chunk,
      request: params.request,
      maxLinesPerMessage: params.maxLinesPerMessage,
      chunkMode: params.chunkMode,
      silent: params.silent,
      suppressEmbeds: params.suppressEmbeds,
      allowedMentions: params.allowedMentions,
      maxChars: params.maxChars,
      onResult: params.onResult,
    });
}
function resolveDiscordSuppressEmbeds(params) {
  return params.override ?? params.configured ?? true;
}
/** Discord thread names are capped at 100 characters. */
const DISCORD_THREAD_NAME_LIMIT = 100;
/** Derive a thread title from the first non-empty line of the message text. */
function deriveForumThreadName(text) {
  return (
    truncateUtf16Safe(
      normalizeOptionalString(text.split("\n").find((line) => normalizeOptionalString(line))) ?? "",
      DISCORD_THREAD_NAME_LIMIT,
    ) || /* @__PURE__ */ new Date().toISOString().slice(0, 16)
  );
}
/** Forum/Media channels cannot receive regular messages; detect them here. */
function isForumLikeChannel(channel) {
  return channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
}
function toDiscordSendResult(result, fallbackChannelId, params = {}) {
  const resultParams = {
    result,
    fallbackChannelId,
    kind: params.kind ?? "text",
  };
  if (params.threadId != null) resultParams.threadId = params.threadId;
  if (params.reply) resultParams.reply = params.reply;
  return createDiscordSendResult(resultParams);
}
async function resolveDiscordSendTarget(to, opts) {
  const cfg = requireRuntimeConfig(opts.cfg, "Discord send target resolution");
  const { rest, request } = createDiscordClient({
    ...opts,
    cfg,
  });
  const { channelId } = await resolveChannelId(
    rest,
    await parseAndResolveChannelRecipient(to, cfg, opts.accountId),
    request,
  );
  return {
    rest,
    request,
    channelId,
  };
}
async function sendMessageDiscord(to, text, opts) {
  const cfg = requireRuntimeConfig(opts.cfg, "Discord send");
  const accountInfo = resolveDiscordAccount({
    cfg,
    accountId: opts.accountId,
  });
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "discord",
    accountId: accountInfo.accountId,
  });
  const effectiveTableMode = opts.tableMode ?? tableMode;
  const chunkMode = opts.chunkMode ?? resolveChunkMode(cfg, "discord", accountInfo.accountId);
  const maxLinesPerMessage = opts.maxLinesPerMessage ?? accountInfo.config.maxLinesPerMessage;
  const suppressEmbeds = resolveDiscordSuppressEmbeds({
    configured: accountInfo.config.suppressEmbeds,
    override: opts.suppressEmbeds,
  });
  const textLimit =
    typeof opts.textLimit === "number" && Number.isFinite(opts.textLimit)
      ? Math.max(1, Math.min(Math.floor(opts.textLimit), 2e3))
      : void 0;
  const mediaMaxBytes =
    typeof accountInfo.config.mediaMaxMb === "number"
      ? accountInfo.config.mediaMaxMb * 1024 * 1024
      : DEFAULT_DISCORD_MEDIA_MAX_MB * 1024 * 1024;
  const textWithTables = convertMarkdownTables(text ?? "", effectiveTableMode);
  const textWithMentions = rewriteDiscordKnownMentions(textWithTables, {
    accountId: accountInfo.accountId,
    mentionAliases: accountInfo.config.mentionAliases,
  });
  const { token, rest, request } = createDiscordClient({
    ...opts,
    cfg,
  });
  const { channelId } = await resolveChannelId(
    rest,
    await parseAndResolveChannelRecipient(to, cfg, opts.accountId),
    request,
  );
  const channel = await resolveDiscordChannel(rest, channelId);
  if (isForumLikeChannel(channel)) {
    const threadName = deriveForumThreadName(textWithTables);
    const chunks = buildDiscordTextChunks(textWithMentions, {
      maxLinesPerMessage,
      chunkMode,
      maxChars: textLimit,
    });
    const starterContent = chunks[0]?.trim() ? chunks[0] : threadName;
    const starterComponents = resolveDiscordSendComponents({
      components: opts.components,
      text: starterContent,
      isFirst: true,
    });
    const starterEmbeds = resolveDiscordSendEmbeds({
      embeds: opts.embeds,
      isFirst: true,
    });
    const starterBody = buildDiscordMessageRequest({
      endpoint: "forum-thread",
      text: starterContent,
      components: starterComponents,
      embeds: starterEmbeds,
      flags: resolveDiscordMessageFlags({
        silent: opts.silent,
        suppressEmbeds: suppressEmbeds && !starterEmbeds?.length,
      }),
      allowedMentions: opts.allowedMentions,
    });
    let threadRes;
    try {
      threadRes = await request(
        () =>
          createThread(rest, channelId, {
            body: {
              name: threadName,
              ...(channel.default_auto_archive_duration === void 0
                ? {}
                : { auto_archive_duration: channel.default_auto_archive_duration }),
              message: starterBody,
            },
          }),
        "forum-thread",
        { safety: "non-idempotent-create" },
      );
    } catch (err) {
      throw await buildDiscordSendError(err, {
        channelId,
        cfg,
        rest,
        token,
        hasMedia: Boolean(opts.mediaUrl),
      });
    }
    const threadId = threadRes.id;
    const messageId = threadRes.message?.id ?? threadId;
    const resultChannelId = threadRes.message?.channel_id ?? threadId;
    const remainingChunks = chunks.slice(1);
    await opts.onDeliveryResult?.(
      toDiscordSendResult(
        {
          id: messageId,
          channel_id: resultChannelId,
        },
        channelId,
        {
          kind: "text",
          threadId,
        },
      ),
    );
    const reportThreadResult = async (result, kind) => {
      await opts.onDeliveryResult?.(
        toDiscordSendResult(result, threadId, {
          kind,
          threadId,
        }),
      );
    };
    try {
      if (opts.mediaUrl) {
        const [mediaCaption, ...afterMediaChunks] = remainingChunks;
        await sendDiscordMedia({
          rest,
          channelId: threadId,
          text: mediaCaption ?? "",
          mediaUrl: opts.mediaUrl,
          filename: opts.filename,
          mediaAccess: opts.mediaAccess,
          mediaLocalRoots: opts.mediaLocalRoots,
          mediaReadFile: opts.mediaReadFile,
          maxBytes: mediaMaxBytes,
          request,
          maxLinesPerMessage,
          chunkMode,
          silent: opts.silent,
          suppressEmbeds,
          allowedMentions: opts.allowedMentions,
          maxChars: textLimit,
          onResult: reportThreadResult,
        });
        await sendDiscordThreadTextChunks({
          rest,
          threadId,
          chunks: afterMediaChunks,
          request,
          maxLinesPerMessage,
          chunkMode,
          maxChars: textLimit,
          silent: opts.silent,
          suppressEmbeds,
          allowedMentions: opts.allowedMentions,
          onResult: reportThreadResult,
        });
      } else
        await sendDiscordThreadTextChunks({
          rest,
          threadId,
          chunks: remainingChunks,
          request,
          maxLinesPerMessage,
          chunkMode,
          maxChars: textLimit,
          silent: opts.silent,
          suppressEmbeds,
          allowedMentions: opts.allowedMentions,
          onResult: reportThreadResult,
        });
    } catch (err) {
      throw await buildDiscordSendError(err, {
        channelId: threadId,
        cfg,
        rest,
        token,
        hasMedia: Boolean(opts.mediaUrl),
      });
    }
    recordChannelActivity({
      channel: "discord",
      accountId: accountInfo.accountId,
      direction: "outbound",
    });
    return toDiscordSendResult(
      {
        id: messageId,
        channel_id: resultChannelId,
      },
      channelId,
      {
        kind: opts.mediaUrl ? "media" : "text",
        threadId,
      },
    );
  }
  let result;
  const reportResult = async (progressResult, kind, replyToId) => {
    await opts.onDeliveryResult?.(
      toDiscordSendResult(progressResult, channelId, {
        kind,
        reply: createReusableDiscordReplyReference(replyToId),
      }),
    );
  };
  try {
    if (opts.mediaUrl)
      result = await sendDiscordMedia({
        rest,
        channelId,
        text: textWithMentions,
        mediaUrl: opts.mediaUrl,
        filename: opts.filename,
        mediaAccess: opts.mediaAccess,
        mediaLocalRoots: opts.mediaLocalRoots,
        mediaReadFile: opts.mediaReadFile,
        maxBytes: mediaMaxBytes,
        reply: opts.reply,
        request,
        maxLinesPerMessage,
        components: opts.components,
        embeds: opts.embeds,
        chunkMode,
        silent: opts.silent,
        suppressEmbeds,
        allowedMentions: opts.allowedMentions,
        maxChars: textLimit,
        onResult: reportResult,
      });
    else
      result = await sendDiscordText({
        rest,
        channelId,
        text: textWithMentions,
        reply: opts.reply,
        request,
        maxLinesPerMessage,
        components: opts.components,
        embeds: opts.embeds,
        chunkMode,
        silent: opts.silent,
        suppressEmbeds,
        allowedMentions: opts.allowedMentions,
        maxChars: textLimit,
        onResult: reportResult,
      });
  } catch (err) {
    throw await buildDiscordSendError(err, {
      channelId,
      cfg,
      rest,
      token,
      hasMedia: Boolean(opts.mediaUrl),
    });
  }
  recordChannelActivity({
    channel: "discord",
    accountId: accountInfo.accountId,
    direction: "outbound",
  });
  return toDiscordSendResult(result, channelId, {
    kind: opts.mediaUrl ? "media" : opts.components || opts.embeds ? "card" : "text",
    reply: opts.reply,
  });
}
async function sendStickerDiscord(to, stickerIds, opts) {
  const { rest, request, channelId, rewrittenContent, suppressEmbeds } =
    await resolveDiscordStructuredSendContext(to, opts);
  const stickers = normalizeStickerIds(stickerIds);
  const flags = resolveDiscordMessageFlags({ suppressEmbeds });
  const body = {
    content: rewrittenContent || void 0,
    sticker_ids: stickers,
    nonce: createDiscordMessageNonce(),
    enforce_nonce: true,
    ...(flags ? { flags } : {}),
  };
  return toDiscordSendResult(
    await request(() => createChannelMessage(rest, channelId, { body }), "sticker", {
      safety: "nonce-protected-create",
    }),
    channelId,
    { kind: "card" },
  );
}
async function sendPollDiscord(to, poll, opts) {
  const { rest, request, channelId, rewrittenContent, suppressEmbeds } =
    await resolveDiscordStructuredSendContext(to, opts);
  if (poll.durationSeconds !== void 0)
    throw new Error("Discord polls do not support durationSeconds; use durationHours");
  const payload = normalizeDiscordPollInput(poll);
  const flags = resolveDiscordMessageFlags({
    silent: opts.silent,
    suppressEmbeds,
  });
  const body = {
    content: rewrittenContent || void 0,
    poll: payload,
    nonce: createDiscordMessageNonce(),
    enforce_nonce: true,
    ...(flags ? { flags } : {}),
  };
  return toDiscordSendResult(
    await request(() => createChannelMessage(rest, channelId, { body }), "poll", {
      safety: "nonce-protected-create",
    }),
    channelId,
    { kind: "card" },
  );
}
async function resolveDiscordStructuredSendContext(to, opts) {
  const accountInfo = resolveDiscordAccount({
    cfg: requireRuntimeConfig(opts.cfg, "Discord structured send"),
    accountId: opts.accountId,
  });
  const { rest, request, channelId } = await resolveDiscordSendTarget(to, opts);
  const content = opts.content?.trim();
  return {
    rest,
    request,
    channelId,
    rewrittenContent: content
      ? rewriteDiscordKnownMentions(content, {
          accountId: accountInfo.accountId,
          mentionAliases: accountInfo.config.mentionAliases,
        })
      : void 0,
    suppressEmbeds: resolveDiscordSuppressEmbeds({
      configured: accountInfo.config.suppressEmbeds,
      override: opts.suppressEmbeds,
    }),
  };
}
//#endregion
export { sendPollDiscord as n, sendStickerDiscord as r, sendMessageDiscord as t };
