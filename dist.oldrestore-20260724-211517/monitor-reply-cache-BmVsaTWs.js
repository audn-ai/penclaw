import { createHash } from "node:crypto";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as getIMessageRuntime } from "./runtime-CKNRV1AW.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/imessage/src/monitor-reply-cache.ts
const IMESSAGE_REPLY_CACHE_NAMESPACE = "imessage.reply-cache";
const IMESSAGE_REPLY_CACHE_MAX_ENTRIES = 2e3;
const IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE = "imessage.reply-cache-counter";
const IMESSAGE_REPLY_CACHE_COUNTER_KEY = "short-id-counter";
const REPLY_CACHE_TTL_MS = 360 * 60 * 1e3;
/** Recency window for the "react to the latest message" fallback. */
const LATEST_FALLBACK_MS = 600 * 1e3;
let persistenceFailureLogged = false;
function reportPersistenceFailure(scope, err) {
  if (persistenceFailureLogged) return;
  persistenceFailureLogged = true;
  logVerbose(`imessage reply-cache: ${scope} disabled after first failure: ${String(err)}`);
}
const imessageReplyCacheByMessageId = /* @__PURE__ */ new Map();
const imessageShortIdToUuid = /* @__PURE__ */ new Map();
const imessageUuidToShortId = /* @__PURE__ */ new Map();
let imessageShortIdCounter = 0;
function resolveIMessageReplyCacheEntryKey(messageId) {
  return createHash("sha256").update(messageId, "utf8").digest("hex").slice(0, 32);
}
function openReplyCacheStore() {
  return getIMessageRuntime().state.openSyncKeyedStore({
    namespace: IMESSAGE_REPLY_CACHE_NAMESPACE,
    maxEntries: IMESSAGE_REPLY_CACHE_MAX_ENTRIES,
  });
}
function openReplyCacheCounterStore() {
  return getIMessageRuntime().state.openSyncKeyedStore({
    namespace: IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE,
    maxEntries: 1,
  });
}
function remainingTtlMs(timestamp) {
  const remaining = REPLY_CACHE_TTL_MS - Math.max(0, Date.now() - timestamp);
  return remaining > 0 ? remaining : void 0;
}
let hydrated = false;
function hydrateFromStoreOnce() {
  if (hydrated) return;
  hydrated = true;
  const cutoff = Date.now() - REPLY_CACHE_TTL_MS;
  let entries;
  try {
    const counter = openReplyCacheCounterStore().lookup(IMESSAGE_REPLY_CACHE_COUNTER_KEY);
    if (counter && Number.isSafeInteger(counter.counter) && counter.counter > 0)
      imessageShortIdCounter = Math.max(imessageShortIdCounter, counter.counter);
    entries = openReplyCacheStore()
      .entries()
      .map(({ value }) => value)
      .filter((entry) => entry.timestamp >= cutoff)
      .toSorted((a, b) => a.timestamp - b.timestamp)
      .slice(-2e3);
    for (const entry of entries) {
      const numeric = Number.parseInt(entry.shortId, 10);
      if (Number.isFinite(numeric) && numeric > imessageShortIdCounter)
        imessageShortIdCounter = numeric;
    }
  } catch (err) {
    reportPersistenceFailure("read", err);
    return;
  }
  if (entries.length === 0) return;
  for (const entry of entries) {
    imessageReplyCacheByMessageId.set(entry.messageId, entry);
    imessageShortIdToUuid.set(entry.shortId, entry.messageId);
    imessageUuidToShortId.set(entry.messageId, entry.shortId);
  }
}
function persistReplyCacheEntry(entry) {
  const ttlMs = remainingTtlMs(entry.timestamp);
  if (!ttlMs) return;
  try {
    openReplyCacheStore().register(resolveIMessageReplyCacheEntryKey(entry.messageId), entry, {
      ttlMs,
    });
  } catch (err) {
    reportPersistenceFailure("write", err);
  }
}
function deleteReplyCacheEntry(messageId) {
  try {
    openReplyCacheStore().delete(resolveIMessageReplyCacheEntryKey(messageId));
  } catch (err) {
    reportPersistenceFailure("delete", err);
  }
}
function persistReplyCacheCounter() {
  try {
    openReplyCacheCounterStore().register(IMESSAGE_REPLY_CACHE_COUNTER_KEY, {
      counter: imessageShortIdCounter,
    });
  } catch (err) {
    reportPersistenceFailure("counter", err);
  }
}
function buildReplyCacheEntry(entry, messageId, shortId) {
  return {
    accountId: entry.accountId,
    messageId,
    shortId,
    timestamp: entry.timestamp,
    ...(typeof entry.chatGuid === "string" ? { chatGuid: entry.chatGuid } : {}),
    ...(typeof entry.chatIdentifier === "string" ? { chatIdentifier: entry.chatIdentifier } : {}),
    ...(typeof entry.chatId === "number" ? { chatId: entry.chatId } : {}),
    ...(typeof entry.isFromMe === "boolean" ? { isFromMe: entry.isFromMe } : {}),
  };
}
function generateShortId() {
  imessageShortIdCounter += 1;
  persistReplyCacheCounter();
  return String(imessageShortIdCounter);
}
function rememberIMessageReplyCache(entry) {
  hydrateFromStoreOnce();
  const messageId = entry.messageId.trim();
  if (!messageId)
    return {
      ...entry,
      shortId: "",
    };
  let shortId = imessageUuidToShortId.get(messageId);
  if (!shortId) {
    shortId = generateShortId();
    imessageShortIdToUuid.set(shortId, messageId);
    imessageUuidToShortId.set(messageId, shortId);
  }
  const fullEntry = buildReplyCacheEntry(entry, messageId, shortId);
  imessageReplyCacheByMessageId.delete(messageId);
  imessageReplyCacheByMessageId.set(messageId, fullEntry);
  const cutoff = Date.now() - REPLY_CACHE_TTL_MS;
  let evicted = false;
  const deletedMessageIds = [];
  for (const [key, value] of imessageReplyCacheByMessageId) {
    if (value.timestamp >= cutoff) break;
    imessageReplyCacheByMessageId.delete(key);
    deletedMessageIds.push(key);
    if (value.shortId) {
      imessageShortIdToUuid.delete(value.shortId);
      imessageUuidToShortId.delete(key);
    }
    evicted = true;
  }
  while (imessageReplyCacheByMessageId.size > IMESSAGE_REPLY_CACHE_MAX_ENTRIES) {
    const oldest = imessageReplyCacheByMessageId.keys().next().value;
    if (!oldest) break;
    const oldEntry = imessageReplyCacheByMessageId.get(oldest);
    imessageReplyCacheByMessageId.delete(oldest);
    deletedMessageIds.push(oldest);
    if (oldEntry?.shortId) {
      imessageShortIdToUuid.delete(oldEntry.shortId);
      imessageUuidToShortId.delete(oldest);
    }
    evicted = true;
  }
  if (evicted)
    for (const messageIdToDelete of deletedMessageIds) deleteReplyCacheEntry(messageIdToDelete);
  persistReplyCacheEntry(fullEntry);
  return fullEntry;
}
function hasChatScope(ctx) {
  if (!ctx) return false;
  return Boolean(
    normalizeOptionalString(ctx.chatGuid) ||
    normalizeOptionalString(ctx.chatIdentifier) ||
    typeof ctx.chatId === "number",
  );
}
/**
 * Strip the `iMessage;-;` / `SMS;-;` / `any;-;` service prefix that Messages
 * uses for direct chats. Different layers report direct DMs in different
 * forms — imsg's watch emits the bare handle plus an `any;-;…` chat_guid,
 * the action surface synthesizes `iMessage;-;…` from a phone-number target —
 * so comparing the raw strings would falsely flag the same chat as a
 * cross-chat target. Normalize both sides to the bare suffix.
 */
function normalizeDirectChatIdentifier(raw) {
  const trimmed = raw.trim();
  const lowered = trimmed.toLowerCase();
  for (const prefix of ["imessage;-;", "sms;-;", "any;-;"])
    if (lowered.startsWith(prefix)) return trimmed.slice(prefix.length);
  return trimmed;
}
function isCrossChatMismatch(cached, ctx) {
  const cachedChatGuid = normalizeOptionalString(cached.chatGuid);
  const ctxChatGuid = normalizeOptionalString(ctx.chatGuid);
  if (cachedChatGuid && ctxChatGuid) {
    if (
      normalizeDirectChatIdentifier(cachedChatGuid) === normalizeDirectChatIdentifier(ctxChatGuid)
    )
      return false;
    return cachedChatGuid !== ctxChatGuid;
  }
  const cachedChatIdentifier = normalizeOptionalString(cached.chatIdentifier);
  const ctxChatIdentifier = normalizeOptionalString(ctx.chatIdentifier);
  if (cachedChatIdentifier && ctxChatIdentifier) {
    if (
      normalizeDirectChatIdentifier(cachedChatIdentifier) ===
      normalizeDirectChatIdentifier(ctxChatIdentifier)
    )
      return false;
    return cachedChatIdentifier !== ctxChatIdentifier;
  }
  const cachedChatId = typeof cached.chatId === "number" ? cached.chatId : void 0;
  const ctxChatId = typeof ctx.chatId === "number" ? ctx.chatId : void 0;
  if (cachedChatId !== void 0 && ctxChatId !== void 0) return cachedChatId !== ctxChatId;
  const cachedFingerprint = cachedChatGuid
    ? normalizeDirectChatIdentifier(cachedChatGuid)
    : cachedChatIdentifier
      ? normalizeDirectChatIdentifier(cachedChatIdentifier)
      : void 0;
  const ctxFingerprint = ctxChatGuid
    ? normalizeDirectChatIdentifier(ctxChatGuid)
    : ctxChatIdentifier
      ? normalizeDirectChatIdentifier(ctxChatIdentifier)
      : void 0;
  if (cachedFingerprint && ctxFingerprint) return cachedFingerprint !== ctxFingerprint;
  return false;
}
function describeChatForError(values) {
  const parts = [];
  if (normalizeOptionalString(values.chatGuid)) parts.push("chatGuid=<redacted>");
  if (normalizeOptionalString(values.chatIdentifier)) parts.push("chatIdentifier=<redacted>");
  if (typeof values.chatId === "number") parts.push("chatId=<redacted>");
  return parts.length === 0 ? "<unknown chat>" : parts.join(", ");
}
function describeMessageIdForError(inputId, inputKind) {
  if (inputKind === "short") return `<short:${inputId.length}-digit>`;
  return `<uuid:${inputId.slice(0, 8)}...>`;
}
function buildCrossChatError(inputId, inputKind, cached, ctx) {
  const remediation =
    inputKind === "short"
      ? "Retry with MessageSidFull to avoid cross-chat reactions/replies landing in the wrong conversation."
      : "Retry with the correct chat target.";
  return /* @__PURE__ */ new Error(
    `iMessage message id ${describeMessageIdForError(inputId, inputKind)} belongs to a different chat (${describeChatForError(cached)}) than the current call target (${describeChatForError(ctx)}). ${remediation}`,
  );
}
function resolveIMessageMessageId(shortOrUuid, opts) {
  const trimmed = shortOrUuid.trim();
  if (!trimmed) return trimmed;
  hydrateFromStoreOnce();
  if (/^\d+$/.test(trimmed)) {
    const uuid = imessageShortIdToUuid.get(trimmed);
    if (uuid) {
      const cached = imessageReplyCacheByMessageId.get(uuid);
      if (opts?.chatContext && hasChatScope(opts.chatContext)) {
        if (cached && isCrossChatMismatch(cached, opts.chatContext))
          throw buildCrossChatError(trimmed, "short", cached, opts.chatContext);
      }
      if (opts?.requireFromMe && cached?.isFromMe !== true)
        throw buildFromMeError(trimmed, "short");
      return uuid;
    }
    if (opts?.requireKnownShortId && !hasChatScope(opts.chatContext))
      throw new Error(
        `iMessage short message id ${describeMessageIdForError(trimmed, "short")} requires a chat scope (chatGuid / chatIdentifier / chatId or a target).`,
      );
    if (opts?.requireKnownShortId)
      throw new Error(
        `iMessage short message id ${describeMessageIdForError(trimmed, "short")} is no longer available. Use MessageSidFull.`,
      );
    return trimmed;
  }
  const cached = imessageReplyCacheByMessageId.get(trimmed);
  if (opts?.chatContext) {
    if (cached && isCrossChatMismatch(cached, opts.chatContext))
      throw buildCrossChatError(trimmed, "uuid", cached, opts.chatContext);
  }
  if (opts?.requireFromMe && cached?.isFromMe !== true) throw buildFromMeError(trimmed, "uuid");
  return trimmed;
}
function isKnownFromMeIMessageMessageId(messageId, ctx) {
  const trimmed = normalizeOptionalString(messageId);
  if (!trimmed || !ctx.accountId || !hasChatScope(ctx)) return false;
  hydrateFromStoreOnce();
  const cached = imessageReplyCacheByMessageId.get(trimmed);
  if (!cached || cached.isFromMe !== true || cached.accountId !== ctx.accountId) return false;
  return isPositiveChatMatch(cached, ctx);
}
function buildFromMeError(inputId, inputKind) {
  return /* @__PURE__ */ new Error(
    `iMessage message id ${describeMessageIdForError(inputId, inputKind)} is not one this agent sent. edit and unsend can only target messages the gateway delivered itself; messages received from other participants cannot be modified.`,
  );
}
/**
 * Return the most recent cached entry whose chat scope matches the supplied
 * context. Used as a fallback when an agent calls a per-message action (e.g.
 * `react`) without specifying a `messageId` — the natural intent is "react
 * to the message I just received in this chat."
 *
 * Strict semantics for safety:
 *  - Caller must supply a chat scope. We refuse to "guess" the active chat.
 *  - Cached entry must positively match on at least one identifier kind
 *    (chatGuid, chatIdentifier, chatId, or normalized direct-DM fingerprint).
 *    We do NOT fall through on "no overlapping identifier" — that's how a
 *    cached entry from a foreign chat could be returned when the caller's
 *    context didn't share any identifier kind with the cache.
 *  - Caller must supply an accountId; we never cross account boundaries.
 *  - We only consider entries newer than `LATEST_FALLBACK_MS`. The intent
 *    of "react to the latest" is "the message I just received," not
 *    "anything in this chat from any time."
 */
function findLatestIMessageEntryForChat(ctx) {
  if (!hasChatScope(ctx)) return;
  if (!ctx.accountId) return;
  const cutoff = Date.now() - LATEST_FALLBACK_MS;
  let best;
  for (const entry of imessageReplyCacheByMessageId.values()) {
    if (entry.accountId !== ctx.accountId) continue;
    if (entry.timestamp < cutoff) continue;
    if (!isPositiveChatMatch(entry, ctx)) continue;
    if (!best || entry.timestamp > best.timestamp) best = entry;
  }
  return best;
}
/**
 * Return true when the cached entry positively matches the caller's chat
 * context on at least one identifier kind. Unlike `isCrossChatMismatch`,
 * which returns false for "no overlap," this requires concrete agreement.
 */
function isPositiveChatMatch(entry, ctx) {
  const cachedChatGuid = normalizeOptionalString(entry.chatGuid);
  const ctxChatGuid = normalizeOptionalString(ctx.chatGuid);
  if (cachedChatGuid && ctxChatGuid && cachedChatGuid === ctxChatGuid) return true;
  const cachedChatIdentifier = normalizeOptionalString(entry.chatIdentifier);
  const ctxChatIdentifier = normalizeOptionalString(ctx.chatIdentifier);
  if (cachedChatIdentifier && ctxChatIdentifier && cachedChatIdentifier === ctxChatIdentifier)
    return true;
  if (
    typeof entry.chatId === "number" &&
    typeof ctx.chatId === "number" &&
    entry.chatId === ctx.chatId
  )
    return true;
  const cachedFingerprint = cachedChatGuid
    ? normalizeDirectChatIdentifier(cachedChatGuid)
    : cachedChatIdentifier
      ? normalizeDirectChatIdentifier(cachedChatIdentifier)
      : void 0;
  const ctxFingerprint = ctxChatGuid
    ? normalizeDirectChatIdentifier(ctxChatGuid)
    : ctxChatIdentifier
      ? normalizeDirectChatIdentifier(ctxChatIdentifier)
      : void 0;
  if (cachedFingerprint && ctxFingerprint && cachedFingerprint === ctxFingerprint) return true;
  return false;
}
function isIMessageCurrentMessageInChat(params) {
  if (!params.accountId || !hasChatScope(params.chatContext)) return false;
  const currentMessageId = normalizeOptionalString(String(params.currentMessageId));
  if (!currentMessageId) return false;
  hydrateFromStoreOnce();
  const fullMessageId = /^\d+$/.test(currentMessageId)
    ? imessageShortIdToUuid.get(currentMessageId)
    : currentMessageId;
  if (!fullMessageId) return false;
  const entry = imessageReplyCacheByMessageId.get(fullMessageId);
  return Boolean(
    entry &&
    entry.accountId === params.accountId &&
    Date.now() - entry.timestamp <= REPLY_CACHE_TTL_MS &&
    isPositiveChatMatch(entry, params.chatContext),
  );
}
//#endregion
export {
  findLatestIMessageEntryForChat as a,
  normalizeDirectChatIdentifier as c,
  resolveIMessageReplyCacheEntryKey as d,
  IMESSAGE_REPLY_CACHE_NAMESPACE as i,
  rememberIMessageReplyCache as l,
  IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE as n,
  isIMessageCurrentMessageInChat as o,
  IMESSAGE_REPLY_CACHE_MAX_ENTRIES as r,
  isKnownFromMeIMessageMessageId as s,
  IMESSAGE_REPLY_CACHE_COUNTER_KEY as t,
  resolveIMessageMessageId as u,
};
