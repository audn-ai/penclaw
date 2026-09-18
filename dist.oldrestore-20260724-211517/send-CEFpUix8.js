import { a as resolveZaloToken, i as resolveZaloAccount } from "./accounts-C71qLp4D.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { c as sendMessage, l as sendPhoto, t as resolveZaloProxyFetch } from "./proxy-CNK10_dW.js";
import "./error-runtime-BIAwr399.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./channel-outbound-DlkFd7rO.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/zalo/src/send.ts
function createZaloSendReceipt(params) {
  const messageId = params.messageId?.trim();
  return createMessageReceiptFromOutboundResults({
    results: messageId
      ? [
          {
            channel: "zalo",
            messageId,
            chatId: params.chatId,
          },
        ]
      : [],
    kind: params.kind,
  });
}
function toZaloSendResult(response, params) {
  if (response.ok && response.result)
    return {
      ok: true,
      messageId: response.result.message_id,
      receipt: createZaloSendReceipt({
        messageId: response.result.message_id,
        chatId: params.chatId,
        kind: params.kind,
      }),
    };
  return {
    ok: false,
    error: "Failed to send message",
    receipt: createZaloSendReceipt({
      chatId: params.chatId,
      kind: params.kind,
    }),
  };
}
async function runZaloSend(failureMessage, params, send) {
  try {
    const result = toZaloSendResult(await send(), params);
    return result.ok
      ? result
      : {
          ok: false,
          error: failureMessage,
          receipt: result.receipt,
        };
  } catch (err) {
    return {
      ok: false,
      error: formatErrorMessage(err),
      receipt: createZaloSendReceipt({
        chatId: params.chatId,
        kind: params.kind,
      }),
    };
  }
}
function resolveSendContext(options) {
  if (options.cfg) {
    const account = resolveZaloAccount({
      cfg: options.cfg,
      accountId: options.accountId,
    });
    return {
      token: options.token || account.token,
      fetcher: resolveZaloProxyFetch(options.proxy ?? account.config.proxy),
    };
  }
  const token = options.token ?? resolveZaloToken(void 0, options.accountId).token;
  const proxy = options.proxy;
  return {
    token,
    fetcher: resolveZaloProxyFetch(proxy),
  };
}
function resolveValidatedSendContext(chatId, options) {
  const { token, fetcher } = resolveSendContext(options);
  if (!token)
    return {
      ok: false,
      error: "No Zalo bot token configured",
    };
  const trimmedChatId = chatId?.trim();
  if (!trimmedChatId)
    return {
      ok: false,
      error: "No chat_id provided",
    };
  return {
    ok: true,
    chatId: trimmedChatId,
    token,
    fetcher,
  };
}
function resolveSendContextOrFailure(chatId, options) {
  const context = resolveValidatedSendContext(chatId, options);
  return context.ok
    ? { context }
    : {
        failure: {
          ok: false,
          error: context.error,
          receipt: createZaloSendReceipt({
            chatId,
            kind: "unknown",
          }),
        },
      };
}
async function sendMessageZalo(chatId, text, options = {}) {
  const resolved = resolveSendContextOrFailure(chatId, options);
  if ("failure" in resolved) return resolved.failure;
  const { context } = resolved;
  if (options.mediaUrl)
    return sendPhotoZalo(context.chatId, options.mediaUrl, {
      ...options,
      token: context.token,
      caption: text || options.caption,
    });
  return await runZaloSend(
    "Failed to send message",
    {
      chatId: context.chatId,
      kind: "text",
    },
    () =>
      sendMessage(
        context.token,
        {
          chat_id: context.chatId,
          text: truncateUtf16Safe(text, 2e3),
        },
        context.fetcher,
      ),
  );
}
async function sendPhotoZalo(chatId, photoUrl, options = {}) {
  const resolved = resolveSendContextOrFailure(chatId, options);
  if ("failure" in resolved) return resolved.failure;
  const { context } = resolved;
  if (!photoUrl?.trim())
    return {
      ok: false,
      error: "No photo URL provided",
      receipt: createZaloSendReceipt({
        chatId: context.chatId,
        kind: "media",
      }),
    };
  return await runZaloSend(
    "Failed to send photo",
    {
      chatId: context.chatId,
      kind: "media",
    },
    () =>
      (async () =>
        sendPhoto(
          context.token,
          {
            chat_id: context.chatId,
            photo: photoUrl.trim(),
            caption: options.caption !== void 0 ? truncateUtf16Safe(options.caption, 2e3) : void 0,
          },
          context.fetcher,
        ))(),
  );
}
//#endregion
export { sendMessageZalo as t };
