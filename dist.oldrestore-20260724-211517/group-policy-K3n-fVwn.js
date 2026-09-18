import { a as resolveIMessageAccount } from "./accounts--1GXl2sX.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import {
  a as buildChannelGroupsScopeTree,
  c as resolveScopeRequireMention,
  l as resolveScopeToolsPolicy,
} from "./channel-policy-DXOn_tKS.js";
import {
  _ as readStringArrayParam,
  g as readReactionParams,
  h as readPositiveIntegerParam,
  i as createActionGate,
  p as readNonNegativeIntegerParam,
  y as readStringParam,
} from "./common-DyDSUect.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-B-Fc-m0I.js";
import {
  n as IMESSAGE_ACTIONS,
  r as IMESSAGE_ACTION_NAMES,
  t as describeIMessageMessageTool,
} from "./message-tool-api-BjSMmkji.js";
import {
  a as findLatestIMessageEntryForChat,
  l as rememberIMessageReplyCache,
  o as isIMessageCurrentMessageInChat,
} from "./monitor-reply-cache-BmVsaTWs.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import "./channel-actions-C9vNf9jw.js";
import {
  n as imessageRpcSupportsMethod,
  t as getCachedIMessagePrivateApiStatus,
} from "./private-api-status-lj9GJ_TF.js";
import { s as probeIMessagePrivateApi } from "./sanitize-outbound-DuVgJyZw.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./client-B2SbygAK.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { c as parseIMessageTarget } from "./targets-BO9NhvfG.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as extractToolSend } from "./tool-send-DlIp2cBO.js";
//#region extensions/imessage/src/actions.ts
const loadIMessageActionsRuntime = createLazyRuntimeNamedExport(
  () => import("./actions.runtime-Cmdus_8C.js"),
  "imessageActionsRuntime",
);
const log = createSubsystemLogger("channels/imessage");
const providerId = "imessage";
const SUPPORTED_ACTIONS = /* @__PURE__ */ new Set([...IMESSAGE_ACTION_NAMES, "upload-file"]);
const GROUP_MANAGEMENT_ACTIONS = /* @__PURE__ */ new Set([
  "renameGroup",
  "setGroupIcon",
  "addParticipant",
  "removeParticipant",
  "leaveGroup",
]);
function readMessageText(params) {
  return readStringParam(params, "text") ?? readStringParam(params, "message");
}
function resolveIMessageDeliveryTarget(args) {
  const chatGuid = readStringParam(args, "chatGuid");
  const chatId = readPositiveIntegerParam(args, "chatId");
  const chatIdentifier = readStringParam(args, "chatIdentifier");
  const targets = [
    chatGuid ? `chat_guid:${chatGuid}` : void 0,
    chatId !== void 0 ? `chat_id:${chatId}` : void 0,
    chatIdentifier ? `chat_identifier:${chatIdentifier}` : void 0,
  ].filter((value) => Boolean(value));
  if (targets.length > 1)
    throw new Error("iMessage action received conflicting delivery target aliases.");
  return targets[0];
}
const IMESSAGE_DELIVERY_TARGET_ALIASES = ["chatGuid", "chatIdentifier", "chatId"];
function matchesIMessageCurrentConversation(params) {
  const currentMessageId = params.toolContext.currentMessageId;
  if (currentMessageId === void 0) return false;
  return isIMessageCurrentMessageInChat({
    accountId: params.accountId,
    currentMessageId,
    chatContext: {
      chatGuid: readStringParam(params.args, "chatGuid"),
      chatIdentifier: readStringParam(params.args, "chatIdentifier"),
      chatId: readPositiveIntegerParam(params.args, "chatId"),
    },
  });
}
function createIMessageTargetAliases(resourceAliases = []) {
  return {
    aliases: [...IMESSAGE_DELIVERY_TARGET_ALIASES, ...resourceAliases],
    deliveryTargetAliases: [...IMESSAGE_DELIVERY_TARGET_ALIASES],
    resolveDeliveryTarget: ({ args }) => resolveIMessageDeliveryTarget(args),
    matchesCurrentConversation: matchesIMessageCurrentConversation,
  };
}
function rememberOutboundBridgeMessage(params) {
  const messageId = params.messageId?.trim();
  if (!messageId || messageId === "ok" || messageId === "unknown") return;
  rememberIMessageReplyCache({
    accountId: params.accountId,
    messageId,
    chatGuid: params.chatGuid,
    timestamp: Date.now(),
    isFromMe: true,
  });
}
/**
 * Read messageId from the action params, falling back to the most recent
 * inbound in the same chat when the caller omitted it. The natural intent
 * for "react with 👍" or "tapback the last message" is the message that
 * just arrived in the current conversation; making the agent re-quote a
 * message id every time is friction the cache already has the answer for.
 */
function readMessageIdWithChatFallback(params, chatContext) {
  const explicit = readStringParam(params, "messageId");
  if (explicit) return explicit;
  const latest = findLatestIMessageEntryForChat(chatContext);
  if (latest?.messageId) return latest.messageId;
  return readStringParam(params, "messageId", { required: true });
}
async function resolveChatGuid(params) {
  const explicitChatGuid = readStringParam(params.actionParams, "chatGuid");
  if (explicitChatGuid) return explicitChatGuid;
  const explicitChatId = readPositiveIntegerParam(params.actionParams, "chatId");
  if (typeof explicitChatId === "number") {
    const resolved = await params.runtime.resolveChatGuidForTarget({
      target: {
        kind: "chat_id",
        chatId: explicitChatId,
      },
      options: params.options,
    });
    if (resolved) return resolved;
    throw new Error(`iMessage ${params.action} failed: chatGuid not found for chat_id:<redacted>.`);
  }
  const explicitChatIdentifier = readStringParam(params.actionParams, "chatIdentifier");
  if (explicitChatIdentifier) {
    const resolved = await params.runtime.resolveChatGuidForTarget({
      target: {
        kind: "chat_identifier",
        chatIdentifier: explicitChatIdentifier,
      },
      options: params.options,
    });
    if (resolved) return resolved;
    throw new Error(
      `iMessage ${params.action} failed: chatGuid not found for chat_identifier:<redacted>.`,
    );
  }
  const rawTarget =
    readStringParam(params.actionParams, "to") ??
    readStringParam(params.actionParams, "target") ??
    (params.currentChannelId?.trim() || void 0);
  if (rawTarget) {
    const target = parseIMessageTarget(rawTarget);
    if (target.kind === "chat_guid") return target.chatGuid;
    if (target.kind === "chat_id" || target.kind === "chat_identifier") {
      const resolved = await params.runtime.resolveChatGuidForTarget({
        target,
        options: params.options,
      });
      if (resolved) return resolved;
      throw new Error(
        `iMessage ${params.action} failed: chatGuid not found for ${formatUnresolvedTarget(target)}.`,
      );
    }
    if (target.kind === "handle") {
      const synthesizedIdentifier = `${target.service === "sms" ? "SMS" : "iMessage"};-;${target.to}`;
      const resolved = await params.runtime.resolveChatGuidForTarget({
        target: {
          kind: "chat_identifier",
          chatIdentifier: synthesizedIdentifier,
        },
        options: params.options,
      });
      if (resolved) return resolved;
      if (params.action === "react" || params.action === "edit" || params.action === "unsend")
        throw new Error(
          `iMessage ${params.action} requires a known chat. No registered chat for the supplied target; send a message first or pass an explicit chatGuid.`,
        );
      return synthesizedIdentifier;
    }
  }
  throw new Error(
    `iMessage ${params.action} requires chatGuid, chatId, chatIdentifier, or a chat target.`,
  );
}
function formatUnresolvedTarget(target) {
  return target.kind === "chat_id" ? "chat_id:<redacted>" : "chat_identifier:<redacted>";
}
function buildChatContextFromActionParams(params) {
  const explicitChatGuid = readStringParam(params.actionParams, "chatGuid")?.trim();
  const explicitChatIdentifier = readStringParam(params.actionParams, "chatIdentifier")?.trim();
  const explicitChatId = readPositiveIntegerParam(params.actionParams, "chatId");
  const rawTarget =
    readStringParam(params.actionParams, "to") ??
    readStringParam(params.actionParams, "target") ??
    (params.currentChannelId?.trim() || void 0);
  const target = rawTarget ? parseIMessageTarget(rawTarget) : null;
  const handleChatIdentifier =
    target?.kind === "handle"
      ? `${target.service === "sms" ? "SMS" : "iMessage"};-;${target.to}`
      : void 0;
  return {
    chatGuid: explicitChatGuid || (target?.kind === "chat_guid" ? target.chatGuid : void 0),
    chatIdentifier:
      explicitChatIdentifier ||
      (target?.kind === "chat_identifier" ? target.chatIdentifier : void 0) ||
      handleChatIdentifier,
    chatId:
      typeof explicitChatId === "number"
        ? explicitChatId
        : target?.kind === "chat_id"
          ? target.chatId
          : void 0,
  };
}
function mapTapbackReaction(emoji) {
  const value = normalizeOptionalLowercaseString(emoji)?.replace(/\ufe0f/g, "");
  if (!value) return;
  if (["love", "heart", "❤", "❤️"].includes(value)) return "love";
  if (["like", "+1", "thumbsup", "👍"].includes(value)) return "like";
  if (["dislike", "-1", "thumbsdown", "👎"].includes(value)) return "dislike";
  if (["laugh", "haha", "😂", "🤣"].includes(value)) return "laugh";
  if (["emphasize", "!!", "‼", "‼️"].includes(value)) return "emphasize";
  if (["question", "?", "？", "❓"].includes(value)) return "question";
}
function decodeBase64Buffer(params, action) {
  const base64Buffer = readStringParam(params, "buffer");
  if (!base64Buffer) throw new Error(`iMessage ${action} requires buffer (base64) parameter.`);
  return Uint8Array.from(Buffer.from(base64Buffer, "base64"));
}
const REPLY_ATTACHMENT_PATH_PARAM_NAMES = ["filePath", "path", "media", "mediaUrl", "fileUrl"];
function extractReplyAttachment(params) {
  const buffer = readStringParam(params, "buffer");
  if (buffer) {
    const filename = readStringParam(params, "filename") ?? "attachment.bin";
    return {
      spec: {
        kind: "buffer",
        buffer: Uint8Array.from(Buffer.from(buffer, "base64")),
        filename,
      },
      sourceParam: "buffer",
    };
  }
  for (const name of REPLY_ATTACHMENT_PATH_PARAM_NAMES)
    if (readStringParam(params, name))
      return {
        spec: null,
        bypassParam: name,
      };
  return null;
}
const KNOWN_EFFECT_IDS = /* @__PURE__ */ new Set([
  "com.apple.MobileSMS.expressivesend.impact",
  "com.apple.MobileSMS.expressivesend.loud",
  "com.apple.MobileSMS.expressivesend.gentle",
  "com.apple.MobileSMS.expressivesend.invisibleink",
  "com.apple.MobileSMS.expressivesend.confetti",
  "com.apple.MobileSMS.expressivesend.lasers",
  "com.apple.MobileSMS.expressivesend.fireworks",
  "com.apple.MobileSMS.expressivesend.balloon",
  "com.apple.MobileSMS.expressivesend.heart",
  "com.apple.messages.effect.CKEchoEffect",
  "com.apple.messages.effect.CKHappyBirthdayEffect",
  "com.apple.messages.effect.CKShootingStarEffect",
  "com.apple.messages.effect.CKSparklesEffect",
  "com.apple.messages.effect.CKSpotlightEffect",
]);
function effectIdFromParam(raw) {
  const value = normalizeOptionalLowercaseString(raw);
  if (!value) return;
  const resolved =
    {
      slam: "com.apple.MobileSMS.expressivesend.impact",
      impact: "com.apple.MobileSMS.expressivesend.impact",
      loud: "com.apple.MobileSMS.expressivesend.loud",
      gentle: "com.apple.MobileSMS.expressivesend.gentle",
      "invisible-ink": "com.apple.MobileSMS.expressivesend.invisibleink",
      invisibleink: "com.apple.MobileSMS.expressivesend.invisibleink",
      confetti: "com.apple.MobileSMS.expressivesend.confetti",
      lasers: "com.apple.MobileSMS.expressivesend.lasers",
      fireworks: "com.apple.MobileSMS.expressivesend.fireworks",
      balloons: "com.apple.MobileSMS.expressivesend.balloon",
      balloon: "com.apple.MobileSMS.expressivesend.balloon",
      heart: "com.apple.MobileSMS.expressivesend.heart",
      echo: "com.apple.messages.effect.CKEchoEffect",
      happybirthday: "com.apple.messages.effect.CKHappyBirthdayEffect",
      "happy-birthday": "com.apple.messages.effect.CKHappyBirthdayEffect",
      shootingstar: "com.apple.messages.effect.CKShootingStarEffect",
      "shooting-star": "com.apple.messages.effect.CKShootingStarEffect",
      sparkles: "com.apple.messages.effect.CKSparklesEffect",
      spotlight: "com.apple.messages.effect.CKSpotlightEffect",
    }[value] ?? raw;
  if (typeof resolved === "string" && KNOWN_EFFECT_IDS.has(resolved)) return resolved;
  throw new Error(
    `iMessage sendWithEffect rejected unknown effect "${raw}". Use one of: slam, loud, gentle, invisibleink, confetti, lasers, fireworks, balloon, heart, echo, happybirthday, shootingstar, sparkles, spotlight (or the canonical com.apple.MobileSMS.expressivesend.* / com.apple.messages.effect.* identifier).`,
  );
}
function assertActionEnabled(action, actionsConfig) {
  const spec = IMESSAGE_ACTIONS[action === "upload-file" ? "sendAttachment" : action];
  if (!spec?.gate || !createActionGate(actionsConfig)(spec.gate))
    throw new Error(`iMessage ${action} is disabled in config.`);
}
const imessageMessageActions = {
  describeMessageTool: describeIMessageMessageTool,
  supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),
  requiresTrustedRequesterSender: ({ action, toolContext }) =>
    normalizeOptionalLowercaseString(toolContext?.currentChannelProvider) === "imessage" &&
    GROUP_MANAGEMENT_ACTIONS.has(action),
  messageActionTargetAliases: {
    react: createIMessageTargetAliases(["messageId"]),
    edit: createIMessageTargetAliases(["messageId"]),
    unsend: createIMessageTargetAliases(["messageId"]),
    reply: createIMessageTargetAliases(["messageId"]),
    sendWithEffect: createIMessageTargetAliases(),
    sendAttachment: createIMessageTargetAliases(),
    poll: createIMessageTargetAliases(),
    "poll-vote": createIMessageTargetAliases(["pollId", "messageId"]),
    "upload-file": createIMessageTargetAliases(),
    renameGroup: createIMessageTargetAliases(),
    setGroupIcon: createIMessageTargetAliases(),
    addParticipant: createIMessageTargetAliases(),
    removeParticipant: createIMessageTargetAliases(),
    leaveGroup: createIMessageTargetAliases(),
  },
  extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
  handleAction: async ({
    action,
    params,
    cfg,
    accountId,
    toolContext,
    senderIsOwner,
    gatewayClientScopes,
  }) => {
    if (
      GROUP_MANAGEMENT_ACTIONS.has(action) &&
      senderIsOwner !== true &&
      !gatewayClientScopes?.includes("operator.admin")
    )
      throw new Error("iMessage group management requires an owner or operator.admin requester.");
    const runtime = await loadIMessageActionsRuntime();
    const account = resolveIMessageAccount({
      cfg,
      accountId: accountId ?? void 0,
    });
    assertActionEnabled(action, account.config.actions);
    const cliPathForProbe = account.config.cliPath?.trim() || "imsg";
    let privateApiStatus = getCachedIMessagePrivateApiStatus(cliPathForProbe);
    const probePrivateApiStatus = async (forceRefresh = false) => {
      privateApiStatus = await probeIMessagePrivateApi(
        cliPathForProbe,
        account.config.probeTimeoutMs ?? 1e4,
        forceRefresh ? { forceRefresh: true } : void 0,
      );
    };
    const assertPrivateApiEnabled = async () => {
      if (privateApiStatus?.available !== true) await probePrivateApiStatus();
      if (!privateApiStatus?.available) {
        const reason = privateApiStatus?.statusMessage
          ? ` imsg reports: ${privateApiStatus.statusMessage}`
          : "";
        log.warn(
          `iMessage ${action} blocked: private API bridge unavailable (accountId=${account.accountId}, cliPath=${cliPathForProbe}). Run \`imsg launch\` to re-inject the dylib, then \`openclaw channels status --probe\` to refresh.${reason}`,
        );
        throw new Error(
          `iMessage ${action} requires the imsg private API bridge. Run imsg launch, then openclaw channels status --probe to refresh capability detection.${reason}`,
        );
      }
    };
    const opts = {
      cliPath: account.config.cliPath?.trim() || "imsg",
      dbPath: account.config.dbPath?.trim() || void 0,
      timeoutMs: account.config.probeTimeoutMs,
      chatGuid: "",
    };
    const chatGuid = async () =>
      await resolveChatGuid({
        action,
        actionParams: params,
        currentChannelId: toolContext?.currentChannelId,
        runtime,
        options: opts,
      });
    const messageId = (resolveOpts) => {
      const chatContext = buildChatContextFromActionParams({
        actionParams: params,
        currentChannelId: toolContext?.currentChannelId,
      });
      const fallbackContext = {
        ...chatContext,
        accountId: account.accountId,
      };
      return runtime.resolveIMessageMessageId(
        readMessageIdWithChatFallback(params, fallbackContext),
        {
          requireKnownShortId: true,
          chatContext,
          ...(resolveOpts?.requireFromMe ? { requireFromMe: true } : {}),
        },
      );
    };
    if (action === "react") {
      await assertPrivateApiEnabled();
      const { emoji, remove, isEmpty } = readReactionParams(params, {
        removeErrorMessage: "Emoji is required to remove an iMessage reaction.",
      });
      const reaction = mapTapbackReaction(emoji);
      const TAPBACK_KINDS = ["love", "like", "dislike", "laugh", "emphasize", "question"];
      if (!remove && (isEmpty || !reaction))
        throw new Error(
          "iMessage react supports love, like, dislike, laugh, emphasize, and question tapbacks.",
        );
      const resolvedMessageId = messageId();
      const partIndex = readNonNegativeIntegerParam(params, "partIndex");
      const resolvedChatGuid = await chatGuid();
      const reactionsToSend = remove && !reaction ? [...TAPBACK_KINDS] : reaction ? [reaction] : [];
      for (const kind of reactionsToSend)
        await runtime.sendReaction({
          chatGuid: resolvedChatGuid,
          messageId: resolvedMessageId,
          reaction: kind,
          remove: remove || void 0,
          partIndex: typeof partIndex === "number" ? partIndex : void 0,
          options: {
            ...opts,
            chatGuid: resolvedChatGuid,
          },
        });
      return jsonResult({
        ok: true,
        ...(remove ? { removed: true } : { added: reaction }),
      });
    }
    if (action === "edit") {
      await assertPrivateApiEnabled();
      const resolvedMessageId = messageId({ requireFromMe: true });
      const text =
        readStringParam(params, "text") ??
        readStringParam(params, "newText") ??
        readStringParam(params, "message");
      if (!text) throw new Error("iMessage edit requires text, newText, or message.");
      const partIndex = readNonNegativeIntegerParam(params, "partIndex");
      const backwardsCompatMessage = readStringParam(params, "backwardsCompatMessage");
      const resolvedChatGuid = await chatGuid();
      await runtime.editMessage({
        chatGuid: resolvedChatGuid,
        messageId: resolvedMessageId,
        text,
        backwardsCompatMessage: backwardsCompatMessage ?? void 0,
        partIndex: typeof partIndex === "number" ? partIndex : void 0,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      return jsonResult({
        ok: true,
        edited: resolvedMessageId,
      });
    }
    if (action === "unsend") {
      await assertPrivateApiEnabled();
      const resolvedMessageId = messageId({ requireFromMe: true });
      const partIndex = readNonNegativeIntegerParam(params, "partIndex");
      const resolvedChatGuid = await chatGuid();
      await runtime.unsendMessage({
        chatGuid: resolvedChatGuid,
        messageId: resolvedMessageId,
        partIndex: typeof partIndex === "number" ? partIndex : void 0,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      return jsonResult({
        ok: true,
        unsent: resolvedMessageId,
      });
    }
    if (action === "reply") {
      await assertPrivateApiEnabled();
      const resolvedMessageId = messageId();
      const text = readMessageText(params);
      if (!text) throw new Error("iMessage reply requires text or message.");
      const attachment = extractReplyAttachment(params);
      if (attachment) {
        if (attachment.spec === null)
          throw new Error(
            `iMessage reply rejected \`${attachment.bypassParam}\` because it did not pass through the outbound media resolver. Pass a base64 \`buffer\` + \`filename\` directly, or invoke message(action: "reply") through the runner so the resolver can validate the path against mediaLocalRoots/sandbox/size before sending.`,
          );
        if (privateApiStatus?.cliCapabilities?.sendRichSupportsAttachment !== true)
          throw new Error(
            "iMessage reply with an attachment needs an imsg build that exposes `send-rich --file` (openclaw/imsg#114). Upgrade imsg, or use action 'upload-file' (with filePath/filename) or action 'send' (with media) to deliver the file plus a separate 'reply' for any text.",
          );
      }
      const partIndex = readNonNegativeIntegerParam(params, "partIndex");
      const resolvedChatGuid = await chatGuid();
      const result = await runtime.sendRichMessage({
        chatGuid: resolvedChatGuid,
        text,
        replyToMessageId: resolvedMessageId,
        partIndex: typeof partIndex === "number" ? partIndex : void 0,
        attachment: attachment?.spec ?? void 0,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      rememberOutboundBridgeMessage({
        accountId: account.accountId,
        messageId: result.messageId,
        chatGuid: resolvedChatGuid,
      });
      return jsonResult({
        ok: true,
        messageId: result.messageId,
        repliedTo: resolvedMessageId,
      });
    }
    if (action === "sendWithEffect") {
      await assertPrivateApiEnabled();
      const text = readMessageText(params);
      const effectId = effectIdFromParam(
        readStringParam(params, "effectId") ?? readStringParam(params, "effect"),
      );
      if (!text || !effectId)
        throw new Error("iMessage sendWithEffect requires text/message and effect/effectId.");
      const resolvedChatGuid = await chatGuid();
      const result = await runtime.sendRichMessage({
        chatGuid: resolvedChatGuid,
        text,
        effectId,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      rememberOutboundBridgeMessage({
        accountId: account.accountId,
        messageId: result.messageId,
        chatGuid: resolvedChatGuid,
      });
      return jsonResult({
        ok: true,
        messageId: result.messageId,
        effect: effectId,
      });
    }
    if (action === "renameGroup") {
      await assertPrivateApiEnabled();
      const displayName = readStringParam(params, "displayName") ?? readStringParam(params, "name");
      if (!displayName) throw new Error("iMessage renameGroup requires displayName or name.");
      const resolvedChatGuid = await chatGuid();
      await runtime.renameGroup({
        chatGuid: resolvedChatGuid,
        displayName,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      return jsonResult({
        ok: true,
        renamed: resolvedChatGuid,
        displayName,
      });
    }
    if (action === "setGroupIcon") {
      await assertPrivateApiEnabled();
      const filename =
        readStringParam(params, "filename") ?? readStringParam(params, "name") ?? "icon.png";
      const resolvedChatGuid = await chatGuid();
      await runtime.setGroupIcon({
        chatGuid: resolvedChatGuid,
        buffer: decodeBase64Buffer(params, action),
        filename,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      return jsonResult({
        ok: true,
        chatGuid: resolvedChatGuid,
        iconSet: true,
      });
    }
    if (action === "addParticipant" || action === "removeParticipant") {
      await assertPrivateApiEnabled();
      const address = readStringParam(params, "address") ?? readStringParam(params, "participant");
      if (!address) throw new Error(`iMessage ${action} requires address or participant.`);
      const resolvedChatGuid = await chatGuid();
      if (action === "addParticipant") {
        await runtime.addParticipant({
          chatGuid: resolvedChatGuid,
          address,
          options: {
            ...opts,
            chatGuid: resolvedChatGuid,
          },
        });
        return jsonResult({
          ok: true,
          added: address,
          chatGuid: resolvedChatGuid,
        });
      }
      await runtime.removeParticipant({
        chatGuid: resolvedChatGuid,
        address,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      return jsonResult({
        ok: true,
        removed: address,
        chatGuid: resolvedChatGuid,
      });
    }
    if (action === "leaveGroup") {
      await assertPrivateApiEnabled();
      const resolvedChatGuid = await chatGuid();
      await runtime.leaveGroup({
        chatGuid: resolvedChatGuid,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      return jsonResult({
        ok: true,
        left: resolvedChatGuid,
      });
    }
    if (action === "sendAttachment" || action === "upload-file") {
      await assertPrivateApiEnabled();
      const filename = readStringParam(params, "filename", { required: true });
      const asVoice = readBooleanParam(params, "asVoice") ?? readBooleanParam(params, "as_voice");
      const resolvedChatGuid = await chatGuid();
      const result = await runtime.sendAttachment({
        chatGuid: resolvedChatGuid,
        buffer: decodeBase64Buffer(params, action),
        filename,
        asVoice: asVoice ?? void 0,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      rememberOutboundBridgeMessage({
        accountId: account.accountId,
        messageId: result.messageId,
        chatGuid: resolvedChatGuid,
      });
      return jsonResult({
        ok: true,
        messageId: result.messageId,
      });
    }
    if (action === "poll") {
      await assertPrivateApiEnabled();
      if (privateApiStatus?.selectors?.pollPayloadMessage !== true)
        await probePrivateApiStatus(true);
      if (privateApiStatus?.selectors?.pollPayloadMessage !== true)
        throw new Error(
          "iMessage poll requires an imsg bridge that advertises the pollPayloadMessage selector. Update imsg, run imsg launch to re-inject the bridge, then run openclaw channels status --probe to refresh capability detection.",
        );
      const poll = normalizePollInput(
        {
          question: readStringParam(params, "pollQuestion", { required: true }),
          options: readStringArrayParam(params, "pollOption", { required: true }),
        },
        { maxOptions: 12 },
      );
      const resolvedChatGuid = await chatGuid();
      const result = await runtime.sendPoll({
        chatGuid: resolvedChatGuid,
        question: poll.question,
        choices: poll.options,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      rememberOutboundBridgeMessage({
        accountId: account.accountId,
        messageId: result.messageId,
        chatGuid: resolvedChatGuid,
      });
      return jsonResult({
        ok: true,
        messageId: result.messageId,
      });
    }
    if (action === "poll-vote") {
      await assertPrivateApiEnabled();
      if (
        privateApiStatus?.selectors?.pollVoteMessage !== true ||
        !imessageRpcSupportsMethod(privateApiStatus, "poll.vote")
      )
        await probePrivateApiStatus(true);
      if (privateApiStatus?.selectors?.pollVoteMessage !== true)
        throw new Error(
          "iMessage poll-vote requires an imsg bridge that advertises the pollVoteMessage selector. Update imsg, run imsg launch to re-inject the bridge, then run openclaw channels status --probe to refresh capability detection.",
        );
      if (!imessageRpcSupportsMethod(privateApiStatus, "poll.vote"))
        throw new Error(
          "iMessage poll-vote requires an imsg build that advertises the poll.vote capability. Update imsg, then run openclaw channels status --probe to refresh capability detection.",
        );
      const pollRef =
        readStringParam(params, "pollId") ??
        readStringParam(params, "pollGuid") ??
        readStringParam(params, "messageId") ??
        (toolContext?.currentMessageId != null ? String(toolContext.currentMessageId) : void 0);
      if (!pollRef)
        throw new Error("iMessage poll-vote requires the poll message id (pollId or messageId).");
      const chatContext = buildChatContextFromActionParams({
        actionParams: params,
        currentChannelId: toolContext?.currentChannelId,
      });
      const pollGuid = runtime.resolveIMessageMessageId(pollRef, {
        requireKnownShortId: true,
        chatContext,
      });
      const optionIndex = readPositiveIntegerParam(params, "pollOptionIndex");
      const optionId = readStringParam(params, "pollOptionId");
      const optionText = readStringParam(params, "pollOptionText");
      const selectorCount = [optionIndex !== void 0, Boolean(optionId), Boolean(optionText)].filter(
        Boolean,
      ).length;
      if (selectorCount === 0)
        throw new Error(
          "iMessage poll-vote requires pollOptionIndex, pollOptionId, or pollOptionText.",
        );
      if (selectorCount > 1)
        throw new Error(
          "iMessage poll-vote requires exactly one of pollOptionIndex, pollOptionId, or pollOptionText.",
        );
      const resolvedChatGuid = await chatGuid();
      const result = await runtime.sendPollVote({
        chatGuid: resolvedChatGuid,
        pollGuid,
        optionIndex,
        optionId: optionId ?? void 0,
        optionText: optionText ?? void 0,
        options: {
          ...opts,
          chatGuid: resolvedChatGuid,
        },
      });
      rememberOutboundBridgeMessage({
        accountId: account.accountId,
        messageId: result.messageId,
        chatGuid: resolvedChatGuid,
      });
      return jsonResult({
        ok: true,
        messageId: result.messageId,
        ...(result.optionText ? { pollVotedOption: result.optionText } : {}),
      });
    }
    throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
  },
};
//#endregion
//#region extensions/imessage/src/group-policy.ts
function resolveScopePath(params) {
  return params.groupId ? [params.groupId] : [];
}
function resolveIMessageGroupRequireMention(params) {
  return resolveScopeRequireMention({
    tree: buildChannelGroupsScopeTree(params.cfg, "imessage", params.accountId),
    path: resolveScopePath(params),
  });
}
function resolveIMessageGroupToolPolicy(params) {
  return resolveScopeToolsPolicy({
    ...params,
    tree: buildChannelGroupsScopeTree(params.cfg, "imessage", params.accountId),
    path: resolveScopePath(params),
    messageProvider: "imessage",
  });
}
//#endregion
export {
  resolveIMessageGroupToolPolicy as n,
  imessageMessageActions as r,
  resolveIMessageGroupRequireMention as t,
};
