import { accessSync, constants, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { a as resolveIMessageAccount } from "./accounts--1GXl2sX.js";
import {
  p as registerIMessageApprovalReactionTargetForOutboundMessage,
  r as appendIMessageApprovalReactionHintForOutboundMessage,
  s as extractIMessageApprovalPromptBinding,
} from "./approval-reactions-BxzyMVQA.js";
import "./media-runtime-BhmZORKM.js";
import "./runtime-env-D0V-7Gqz.js";
import { t as createIMessageRpcClient } from "./client-B2SbygAK.js";
import "./text-chunking-Dr19ggf-.js";
import { i as createActionGate } from "./common-DyDSUect.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-Btb1ssgA.js";
import "./channel-outbound-DlkFd7rO.js";
import "./markdown-table-runtime-DkTgtzZ0.js";
import "./channel-actions-C9vNf9jw.js";
import {
  n as runIMessageCliJsonCommand,
  t as extractMarkdownFormatRuns,
} from "./markdown-format-Cu_wLFV4.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import { c as kindFromMime } from "./mime-BSEMEb3s.js";
import { l as rememberIMessageReplyCache } from "./monitor-reply-cache-BmVsaTWs.js";
import { n as resolveOutboundAttachmentFromUrl } from "./outbound-attachment-B7sr-r6U.js";
import {
  a as rememberPersistedIMessageEcho,
  r as forgetPersistedIMessageEchoKey,
} from "./persisted-echo-cache-DgrS4aLB.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-ef53THzv.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { t as convertMarkdownTables } from "./tables-YoFSvuf8.js";
import {
  c as parseIMessageTarget,
  o as normalizeIMessageHandle,
  t as formatIMessageChatTarget,
} from "./targets-BO9NhvfG.js";
//#region extensions/imessage/src/send.ts
const require = createRequire(import.meta.url);
const MIN_PENDING_PERSISTED_ECHO_TTL_MS = 6e4;
const PENDING_PERSISTED_ECHO_GRACE_MS = 5e3;
const MAX_REPLY_TO_ID_LENGTH = 256;
const sshWrapperCliPathCache = /* @__PURE__ */ new Map();
function safeHomeDir() {
  const home = process.env.HOME?.trim();
  if (home) return home;
  try {
    return os.homedir().trim() || void 0;
  } catch {
    return;
  }
}
function expandCliPathForInspection(cliPath) {
  if (!cliPath.startsWith("~")) return cliPath;
  const home = safeHomeDir();
  return home ? cliPath.replace(/^~(?=$|[\\/])/, home) : cliPath;
}
function isSshIMessageCliWrapper(cliPath) {
  if (cliPath === "imsg") return false;
  const cached = sshWrapperCliPathCache.get(cliPath);
  if (cached !== void 0) return cached;
  let detected;
  try {
    const content = readFileSync(expandCliPathForInspection(cliPath), "utf8");
    detected = /\bssh\b[\s\S]*\bimsg\b/u.test(content);
  } catch {
    detected = false;
  }
  sshWrapperCliPathCache.set(cliPath, detected);
  return detected;
}
function isLocalIMessageCliPath(params) {
  const cliPath = params.cliPath.trim();
  if (params.remoteHost?.trim() || isSshIMessageCliWrapper(cliPath)) return false;
  return cliPath === "imsg" || path.basename(cliPath) === "imsg";
}
function resolveChatDbLookupPath(params) {
  const configured = params.dbPath?.trim();
  if (configured) return configured;
  if (
    !isLocalIMessageCliPath({
      cliPath: params.cliPath,
      remoteHost: params.remoteHost,
    })
  )
    return;
  const home = safeHomeDir();
  return home ? path.join(home, "Library", "Messages", "chat.db") : void 0;
}
function stripUnsafeReplyTagChars(value) {
  let next = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if ((code >= 0 && code <= 31) || code === 127 || ch === "[" || ch === "]") continue;
    next += ch;
  }
  return next;
}
function sanitizeReplyToId(rawReplyToId) {
  const trimmed = rawReplyToId?.trim();
  if (!trimmed) return;
  const sanitized = stripUnsafeReplyTagChars(trimmed).trim();
  if (!sanitized) return;
  if (sanitized.length > MAX_REPLY_TO_ID_LENGTH) return sanitized.slice(0, MAX_REPLY_TO_ID_LENGTH);
  return sanitized;
}
function resolveMessageId(result) {
  if (!result) return null;
  const raw =
    (typeof result.messageId === "string" && result.messageId.trim()) ||
    (typeof result.message_id === "string" && result.message_id.trim()) ||
    (typeof result.id === "string" && result.id.trim()) ||
    (typeof result.guid === "string" && result.guid.trim()) ||
    (typeof result.message_id === "number" ? String(result.message_id) : null) ||
    (typeof result.id === "number" ? String(result.id) : null);
  return raw ? raw.trim() : null;
}
function resolveOutboundMessageGuid(result) {
  if (!result) return null;
  const candidates = [result.guid, result.messageId, result.message_id, result.id];
  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed && !/^\d+$/.test(trimmed)) return trimmed;
  }
  return null;
}
function isNumericMessageRowId(value) {
  return typeof value === "string" && /^\d+$/.test(value.trim());
}
function resolveTargetService(target) {
  if (target.kind !== "handle") return;
  if (target.serviceExplicit || target.service !== "auto") return target.service;
}
function normalizeResolvedMessageGuid(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && !isNumericMessageRowId(trimmed) ? trimmed : null;
}
function loadNodeSqlite() {
  try {
    return require("node:sqlite");
  } catch {
    return null;
  }
}
function resolveMessageGuidFromChatDb(params) {
  const dbPath = params.dbPath?.trim();
  const messageId = params.messageId.trim();
  if (!dbPath || !isNumericMessageRowId(messageId)) return null;
  const sqlite = loadNodeSqlite();
  if (!sqlite) return null;
  let db = null;
  try {
    db = new sqlite.DatabaseSync(dbPath, { readOnly: true });
    return normalizeResolvedMessageGuid(
      db.prepare("SELECT guid FROM message WHERE ROWID = ?").get(messageId)?.guid,
    );
  } catch {
    return null;
  } finally {
    try {
      db?.close();
    } catch {}
  }
}
function getStringRowValue(row, key) {
  return normalizeResolvedMessageGuid(row?.[key]);
}
function appleMessageDateLowerBoundMs(sentAfterMs) {
  if (!Number.isFinite(sentAfterMs)) return null;
  return Math.max(0, Math.floor((sentAfterMs - 9783072e5 - 5e3) * 1e6));
}
function resolveLatestSentMessageGuidFromChatDb(params) {
  const dbPath = params.dbPath?.trim();
  if (!dbPath) return null;
  const sqlite = loadNodeSqlite();
  if (!sqlite) return null;
  let db = null;
  try {
    db = new sqlite.DatabaseSync(dbPath, { readOnly: true });
    const targetClauses = [];
    const targetParams = [];
    const lowerBound = appleMessageDateLowerBoundMs(params.sentAfterMs);
    if (params.text) {
      targetClauses.push("m.text = ?");
      targetParams.push(params.text);
    }
    if (lowerBound !== null) {
      targetClauses.push("m.date >= ?");
      targetParams.push(lowerBound);
    }
    if (params.target.kind === "chat_id") {
      targetClauses.push("cmj.chat_id = ?");
      targetParams.push(params.target.chatId);
    } else if (params.target.kind === "chat_guid") {
      targetClauses.push("c.guid = ?");
      targetParams.push(params.target.chatGuid);
    } else if (params.target.kind === "chat_identifier") {
      targetClauses.push("c.chat_identifier = ?");
      targetParams.push(params.target.chatIdentifier);
    } else {
      const normalizedHandle = normalizeIMessageHandle(params.target.to);
      targetClauses.push("(h.id = ? OR h.uncanonicalized_id = ?)");
      targetParams.push(normalizedHandle, params.target.to);
    }
    const selectSql = `
      SELECT m.guid
      FROM message m
      LEFT JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
      LEFT JOIN chat c ON c.ROWID = cmj.chat_id
      LEFT JOIN handle h ON h.ROWID = m.handle_id
      WHERE m.is_from_me = 1
      ${targetClauses.length ? `AND ${targetClauses.join(" AND ")}` : ""}
      ORDER BY m.date DESC, m.ROWID DESC
      LIMIT 10
    `;
    return getStringRowValue(db.prepare(selectSql).all(...targetParams)[0], "guid");
  } catch {
    return null;
  } finally {
    try {
      db?.close();
    } catch {}
  }
}
function canResolveLatestSentMessageGuidFromChatDb(dbPath) {
  const normalizedDbPath = dbPath?.trim();
  if (!normalizedDbPath || !loadNodeSqlite()) return false;
  try {
    accessSync(normalizedDbPath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
async function resolveApprovalBindingMessageGuid(params) {
  const immediateGuid = resolveOutboundMessageGuid(params.result);
  if (immediateGuid) return immediateGuid;
  const messageId = params.messageId?.trim();
  if (!messageId || !isNumericMessageRowId(messageId)) return null;
  return normalizeResolvedMessageGuid(
    await (params.resolveMessageGuidImpl ?? resolveMessageGuidFromChatDb)({
      dbPath: params.dbPath,
      messageId,
    }),
  );
}
async function resolveFallbackSentMessageGuid(params) {
  const resolver = params.resolveSentMessageGuidImpl ?? resolveLatestSentMessageGuidFromChatDb;
  if (
    !params.resolveSentMessageGuidImpl &&
    !canResolveLatestSentMessageGuidFromChatDb(params.dbPath)
  )
    return null;
  const deadlineMs = Date.now() + 5e3;
  while (Date.now() <= deadlineMs) {
    const resolved = normalizeResolvedMessageGuid(
      await resolver({
        dbPath: params.dbPath,
        target: params.target,
        text: params.text,
        sentAfterMs: params.sentAfterMs,
      }),
    );
    if (resolved) return resolved;
    if (Date.now() >= deadlineMs) return null;
    await sleep(250);
  }
  return null;
}
function shouldRecoverApprovalPromptGuid(params) {
  return (
    !params.filePath &&
    !params.replyToId &&
    Boolean(params.message.trim()) &&
    Boolean(extractIMessageApprovalPromptBinding(params.message))
  );
}
function canCheckSentMessageAfterRpcTimeout(params) {
  return (
    Boolean(params.resolveSentMessageGuidImpl) ||
    canResolveLatestSentMessageGuidFromChatDb(params.dbPath)
  );
}
function resolveOutboundEchoText(text, mediaContentType) {
  if (text.trim()) return text;
  const kind = kindFromMime(mediaContentType ?? void 0);
  if (!kind) return;
  return kind === "image" ? "<media:image>" : `<media:${kind}>`;
}
function createIMessageSendReceipt(params) {
  const messageId = params.messageId.trim();
  const results =
    messageId && messageId !== "unknown" && messageId !== "ok"
      ? [
          {
            channel: "imessage",
            messageId,
            meta: { targetKind: params.target.kind },
          },
        ]
      : [];
  if (results[0]) {
    if (params.target.kind === "chat_id") results[0].chatId = String(params.target.chatId);
    else if (params.target.kind === "chat_guid") results[0].conversationId = params.target.chatGuid;
    else if (params.target.kind === "chat_identifier")
      results[0].conversationId = params.target.chatIdentifier;
  }
  const receiptParams = {
    results,
    kind: params.kind,
  };
  if (params.replyToId) receiptParams.replyToId = params.replyToId;
  return createMessageReceiptFromOutboundResults(receiptParams);
}
function isConcreteIMessageMessageId(messageId) {
  const trimmed = messageId?.trim();
  return Boolean(trimmed && trimmed !== "unknown" && trimmed !== "ok");
}
function canSynthesizeAttachmentChatHandle(raw) {
  const trimmed = raw.trim();
  return trimmed.includes("@") || trimmed.startsWith("+");
}
function resolveOutboundEchoScope(params) {
  if (params.target.kind === "chat_id")
    return `${params.accountId}:${formatIMessageChatTarget(params.target.chatId)}`;
  if (params.target.kind === "chat_guid")
    return `${params.accountId}:chat_guid:${params.target.chatGuid}`;
  if (params.target.kind === "chat_identifier")
    return `${params.accountId}:chat_identifier:${params.target.chatIdentifier}`;
  return `${params.accountId}:imessage:${params.target.to}`;
}
function resolveIMessageCliFailure(result) {
  if (result.success !== false) return null;
  return typeof result.error === "string" && result.error.trim()
    ? result.error.trim()
    : "iMessage action failed";
}
function isIMessageRpcSendTimeout(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /imsg rpc timeout \(send\)/i.test(message);
}
async function runIMessageCliJson(cliPath, dbPath, args, timeoutMs) {
  return await runIMessageCliJsonCommand({
    args,
    cliPath,
    dbPath,
    timeoutMs,
  });
}
function stringValue(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function resolvePendingPersistedEchoTtlMs(timeoutMs) {
  return Math.max(
    MIN_PENDING_PERSISTED_ECHO_TTL_MS,
    Math.max(0, timeoutMs) + PENDING_PERSISTED_ECHO_GRACE_MS,
  );
}
function isAttachmentCommandFallbackError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /(?:unknown|unrecognized|invalid|unsupported)\s+(?:command|subcommand)|not a recognized command|send-attachment.*(?:not found|unsupported|unavailable)|private api bridge.*unavailable|requires the imsg private api bridge|run imsg launch/iu.test(
    message,
  );
}
function isThreadedReplyUnsupportedError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /reply_to requires bridge transport|cannot send threaded repl|threaded repl(?:y|ies)\b.*(?:unsupported|not supported|requires|unavailable)|requires bridge transport/iu.test(
    message,
  );
}
async function resolveAttachmentChatTarget(params) {
  if (params.target.kind === "chat_guid") return params.target.chatGuid;
  if (params.target.kind === "handle") {
    if (!canSynthesizeAttachmentChatHandle(params.target.to)) return null;
    const normalizedHandle = normalizeIMessageHandle(params.target.to);
    if (!normalizedHandle) return null;
    const service = params.target.service !== "auto" ? params.target.service : params.service;
    if (service === "sms") return `SMS;-;${normalizedHandle}`;
    if (service === "imessage") return `iMessage;-;${normalizedHandle}`;
    return `any;-;${normalizedHandle}`;
  }
  if (params.target.kind !== "chat_id") return null;
  const result = await params.runCliJson(["group", "--chat-id", String(params.target.chatId)]);
  return stringValue(result.guid) ?? stringValue(result.chat_guid) ?? null;
}
async function trySendAttachmentForTarget(params) {
  let attachmentChatTarget;
  try {
    attachmentChatTarget = await resolveAttachmentChatTarget({
      target: params.target,
      service: params.service,
      runCliJson: params.runCliJson,
    });
  } catch (error) {
    if (isAttachmentCommandFallbackError(error)) return null;
    throw error;
  }
  if (!attachmentChatTarget) return null;
  const echoScope = resolveOutboundEchoScope({
    accountId: params.accountId,
    target: params.target,
  });
  let result;
  let pendingEchoKey;
  try {
    if (echoScope)
      pendingEchoKey = rememberPersistedIMessageEcho({
        scope: echoScope,
        text: params.echoText,
        ttlMs: params.pendingEchoTtlMs,
        pending: true,
      });
    result = await params.runCliJson([
      "send-attachment",
      "--chat",
      attachmentChatTarget,
      "--file",
      params.filePath,
      ...(params.audioAsVoice ? ["--audio"] : []),
      ...(params.replyToId ? ["--reply-to", params.replyToId] : []),
      "--transport",
      "auto",
    ]);
  } catch (error) {
    forgetPersistedIMessageEchoKey(pendingEchoKey);
    if (isAttachmentCommandFallbackError(error)) return null;
    throw error;
  }
  const failure = resolveIMessageCliFailure(result);
  if (failure) {
    const error = new Error(failure);
    forgetPersistedIMessageEchoKey(pendingEchoKey);
    if (isAttachmentCommandFallbackError(error)) return null;
    throw error;
  }
  const resolvedId = resolveMessageId(result);
  const approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
    dbPath: params.dbPath,
    messageId: resolvedId,
    result,
    resolveMessageGuidImpl: params.resolveMessageGuidImpl,
  });
  const messageId = resolvedId ?? (result.ok || result.success ? "ok" : "unknown");
  if (echoScope)
    rememberPersistedIMessageEcho({
      scope: echoScope,
      text: params.echoText,
      messageId: resolvedId ?? void 0,
    });
  if (resolvedId)
    rememberIMessageReplyCache({
      accountId: params.accountId,
      messageId: resolvedId,
      chatGuid:
        params.target.kind === "chat_guid"
          ? params.target.chatGuid
          : params.target.kind === "chat_id"
            ? attachmentChatTarget
            : void 0,
      chatIdentifier:
        params.target.kind === "chat_identifier" || params.target.kind === "handle"
          ? attachmentChatTarget
          : void 0,
      chatId: params.target.kind === "chat_id" ? params.target.chatId : void 0,
      timestamp: Date.now(),
      isFromMe: true,
    });
  return {
    messageId,
    ...(approvalBindingMessageId ? { guid: approvalBindingMessageId } : {}),
    sentText: "",
    ...(params.echoText ? { echoText: params.echoText } : {}),
    receipt: createIMessageSendReceipt({
      messageId,
      target: params.target,
      kind: params.audioAsVoice ? "voice" : "media",
      ...(params.replyToId ? { replyToId: params.replyToId } : {}),
    }),
  };
}
async function sendMessageIMessage(to, text, opts) {
  const cfg = requireRuntimeConfig(opts.config, "iMessage send");
  const account =
    opts.account ??
    resolveIMessageAccount({
      cfg,
      accountId: opts.accountId,
    });
  const cliPath = opts.cliPath?.trim() || account.config.cliPath?.trim() || "imsg";
  const dbPath = opts.dbPath?.trim() || account.config.dbPath?.trim();
  const chatDbLookupPath = resolveChatDbLookupPath({
    cliPath,
    dbPath,
    remoteHost: account.config.remoteHost,
  });
  const target = parseIMessageTarget(opts.chatId ? formatIMessageChatTarget(opts.chatId) : to);
  const service = opts.service ?? resolveTargetService(target) ?? account.config.service;
  const sendTransport = account.config.sendTransport ?? "auto";
  const timeoutMs = opts.timeoutMs ?? account.config.probeTimeoutMs ?? 15e4;
  const pendingEchoTtlMs = resolvePendingPersistedEchoTtlMs(timeoutMs);
  const region = opts.region?.trim() || account.config.region?.trim() || "US";
  const maxBytes =
    typeof opts.maxBytes === "number"
      ? opts.maxBytes
      : typeof account.config.mediaMaxMb === "number"
        ? account.config.mediaMaxMb * 1024 * 1024
        : 16 * 1024 * 1024;
  let message =
    text && opts.approvalKind ? appendIMessageApprovalReactionHintForOutboundMessage(text) : text;
  let filePath;
  let mediaContentType;
  if (opts.mediaUrl?.trim()) {
    const resolved = await (opts.resolveAttachmentImpl ?? resolveOutboundAttachmentFromUrl)(
      opts.mediaUrl.trim(),
      maxBytes,
      {
        localRoots: opts.mediaLocalRoots,
        readFile: opts.mediaReadFile,
      },
    );
    filePath = resolved.path;
    mediaContentType = resolved.contentType ?? void 0;
  }
  if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
  if (message.trim()) {
    const tableMode = resolveMarkdownTableMode({
      cfg,
      channel: "imessage",
      accountId: account.accountId,
    });
    message = convertMarkdownTables(message, tableMode);
  }
  message = stripInlineDirectiveTagsForDelivery(message).text;
  if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
  const formatted = message.trim()
    ? extractMarkdownFormatRuns(message)
    : {
        text: message,
        ranges: [],
      };
  message = formatted.text;
  if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
  const echoText = resolveOutboundEchoText(message, filePath ? mediaContentType : void 0);
  const resolvedReplyToId = createActionGate(account.config.actions)("reply")
    ? sanitizeReplyToId(opts.replyToId)
    : void 0;
  let effectiveReplyToId = resolvedReplyToId;
  const runCliJson =
    opts.runCliJson ?? ((args) => runIMessageCliJson(cliPath, dbPath, args, timeoutMs));
  if (filePath && (!resolvedReplyToId || opts.audioAsVoice)) {
    const attachmentEchoText = message.trim()
      ? resolveOutboundEchoText("", mediaContentType)
      : echoText;
    const attachmentResult = await trySendAttachmentForTarget({
      accountId: account.accountId,
      dbPath: chatDbLookupPath,
      target,
      service,
      filePath,
      audioAsVoice: opts.audioAsVoice,
      ...(resolvedReplyToId ? { replyToId: resolvedReplyToId } : {}),
      echoText: attachmentEchoText,
      pendingEchoTtlMs,
      runCliJson,
      resolveMessageGuidImpl: opts.resolveMessageGuidImpl,
    });
    if (attachmentResult) {
      if (!message.trim()) return attachmentResult;
      const captionResult = await sendMessageIMessage(to, text, {
        ...opts,
        ...(opts.client ? { client: opts.client } : {}),
        mediaUrl: void 0,
      });
      return {
        messageId: isConcreteIMessageMessageId(attachmentResult.messageId)
          ? attachmentResult.messageId
          : captionResult.messageId,
        ...((captionResult.guid ?? attachmentResult.guid)
          ? { guid: captionResult.guid ?? attachmentResult.guid }
          : {}),
        sentText: captionResult.sentText,
        ...((captionResult.echoText ?? attachmentResult.echoText)
          ? { echoText: captionResult.echoText ?? attachmentResult.echoText }
          : {}),
        receipt: createMessageReceiptFromOutboundResults({
          results: [{ receipt: attachmentResult.receipt }, { receipt: captionResult.receipt }],
          sentAt: Math.max(attachmentResult.receipt.sentAt, captionResult.receipt.sentAt),
        }),
      };
    }
  }
  const params = {
    text: message,
    service: service || "auto",
    region,
    transport: sendTransport,
  };
  if (resolvedReplyToId) params.reply_to = resolvedReplyToId;
  if (formatted.ranges.length > 0) params.formatting = formatted.ranges;
  if (filePath) params.file = filePath;
  if (target.kind === "chat_id") params.chat_id = target.chatId;
  else if (target.kind === "chat_guid") params.chat_guid = target.chatGuid;
  else if (target.kind === "chat_identifier") params.chat_identifier = target.chatIdentifier;
  else params.to = target.to;
  const echoScope = resolveOutboundEchoScope({
    accountId: account.accountId,
    target,
  });
  const client =
    opts.client ??
    (opts.createClient
      ? await opts.createClient({
          cliPath,
          dbPath,
        })
      : await createIMessageRpcClient({
          cliPath,
          dbPath,
        }));
  const shouldClose = !opts.client;
  let closedClient = false;
  const stopOwnedClient = async () => {
    if (!shouldClose || closedClient) return;
    closedClient = true;
    await client.stop();
  };
  let result;
  const sendStartedAtMs = Date.now();
  let pendingEchoKey;
  try {
    try {
      if (echoScope)
        pendingEchoKey = rememberPersistedIMessageEcho({
          scope: echoScope,
          text: echoText,
          ttlMs: pendingEchoTtlMs,
          pending: true,
        });
      result = await client.request("send", params, { timeoutMs });
    } catch (error) {
      if (resolvedReplyToId && isThreadedReplyUnsupportedError(error)) {
        const plainParams = { ...params };
        delete plainParams.reply_to;
        result = await client.request("send", plainParams, { timeoutMs });
        effectiveReplyToId = void 0;
      } else if (filePath || !isIMessageRpcSendTimeout(error)) throw error;
      else if (
        !shouldRecoverApprovalPromptGuid({
          message,
          filePath,
          replyToId: resolvedReplyToId,
        }) ||
        !canCheckSentMessageAfterRpcTimeout({
          dbPath: chatDbLookupPath,
          resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl,
        })
      )
        throw error;
      else {
        const recoveredGuid = await resolveFallbackSentMessageGuid({
          dbPath: chatDbLookupPath,
          target,
          text: message,
          sentAfterMs: sendStartedAtMs,
          resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl,
        });
        if (recoveredGuid)
          result = {
            guid: recoveredGuid,
            status: "sent",
          };
        else throw error;
      }
    }
    const resolvedId = resolveMessageId(result);
    const messageId =
      resolvedId ?? (result?.ok || result?.success || result?.status === "sent" ? "ok" : "unknown");
    let approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
      dbPath: chatDbLookupPath,
      messageId: resolvedId,
      result,
      resolveMessageGuidImpl: opts.resolveMessageGuidImpl,
    });
    if (
      !approvalBindingMessageId &&
      shouldRecoverApprovalPromptGuid({
        message,
        filePath,
        replyToId: effectiveReplyToId,
      })
    )
      approvalBindingMessageId = await resolveFallbackSentMessageGuid({
        dbPath: chatDbLookupPath,
        target,
        text: message,
        sentAfterMs: sendStartedAtMs,
        resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl,
      });
    if (echoScope)
      rememberPersistedIMessageEcho({
        scope: echoScope,
        text: echoText,
        messageId: resolvedId ?? void 0,
      });
    if (resolvedId)
      rememberIMessageReplyCache({
        accountId: account.accountId,
        messageId: resolvedId,
        chatGuid: target.kind === "chat_guid" ? target.chatGuid : void 0,
        chatIdentifier:
          target.kind === "chat_identifier"
            ? target.chatIdentifier
            : target.kind === "handle"
              ? `${target.service === "sms" ? "SMS" : "iMessage"};-;${target.to}`
              : void 0,
        chatId: target.kind === "chat_id" ? target.chatId : void 0,
        timestamp: Date.now(),
        isFromMe: true,
      });
    if (message && approvalBindingMessageId && opts.approvalKind) {
      const handleForKey = target.kind === "handle" ? normalizeIMessageHandle(target.to) : void 0;
      const conversation = {
        ...(target.kind === "chat_guid" ? { chatGuid: target.chatGuid } : {}),
        ...(target.kind === "chat_identifier" ? { chatIdentifier: target.chatIdentifier } : {}),
        ...(target.kind === "chat_id" ? { chatId: target.chatId } : {}),
        ...(handleForKey ? { handle: handleForKey } : {}),
      };
      registerIMessageApprovalReactionTargetForOutboundMessage({
        accountId: account.accountId,
        conversation,
        messageId: approvalBindingMessageId,
        text: message,
        approvalKind: opts.approvalKind,
      });
    }
    return {
      messageId,
      ...(approvalBindingMessageId ? { guid: approvalBindingMessageId } : {}),
      sentText: message,
      ...(echoText ? { echoText } : {}),
      receipt: createIMessageSendReceipt({
        messageId,
        target,
        kind: filePath ? "media" : "text",
        ...(effectiveReplyToId ? { replyToId: effectiveReplyToId } : {}),
      }),
    };
  } catch (error) {
    forgetPersistedIMessageEchoKey(pendingEchoKey);
    throw error;
  } finally {
    await stopOwnedClient();
  }
}
//#endregion
export { sendMessageIMessage as t };
