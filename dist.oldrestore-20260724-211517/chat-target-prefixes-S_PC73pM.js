import { v as parseStrictInteger } from "./number-coercion-CJQ8TR--.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import "./parse-finite-number-Z7n6tXLk.js";
//#region src/channels/plugins/chat-target-prefixes.ts
/**
 * Chat target prefix parsers.
 *
 * Parses service-qualified chat ids, guids, identifiers, and sender allowlist targets.
 */
/**
 * Checks whether a sender or current conversation matches an allowlist entry.
 */
function isAllowedParsedChatSender(params) {
  const allowFrom = normalizeStringEntries(params.allowFrom);
  if (allowFrom.length === 0) return false;
  if (allowFrom.includes("*")) return true;
  const senderNormalized = params.normalizeSender(params.sender);
  const allowConversationTargets = params.allowConversationTargets === true;
  const chatId = allowConversationTargets ? (params.chatId ?? void 0) : void 0;
  const chatGuid = allowConversationTargets ? normalizeOptionalString(params.chatGuid) : void 0;
  const chatIdentifier = allowConversationTargets
    ? normalizeOptionalString(params.chatIdentifier)
    : void 0;
  for (const entry of allowFrom) {
    if (!entry) continue;
    const parsed = params.parseAllowTarget(entry);
    if (parsed.kind === "chat_id" && chatId !== void 0) {
      if (parsed.chatId === chatId) return true;
    } else if (parsed.kind === "chat_guid" && chatGuid) {
      if (parsed.chatGuid === chatGuid) return true;
    } else if (parsed.kind === "chat_identifier" && chatIdentifier) {
      if (parsed.chatIdentifier === chatIdentifier) return true;
    } else if (parsed.kind === "handle" && senderNormalized) {
      if (parsed.handle === senderNormalized) return true;
    }
  }
  return false;
}
function stripPrefix(value, prefix) {
  return value.slice(prefix.length).trim();
}
function startsWithAnyPrefix(value, prefixes) {
  return prefixes.some((prefix) => value.startsWith(prefix));
}
/**
 * Resolves service-prefixed handle targets, delegating chat-shaped remainders.
 */
function resolveServicePrefixedTarget(params) {
  for (const { prefix, service } of params.servicePrefixes) {
    if (!params.lower.startsWith(prefix)) continue;
    const remainder = stripPrefix(params.trimmed, prefix);
    if (!remainder) throw new Error(`${prefix} target is required`);
    const remainderLower = normalizeLowercaseStringOrEmpty(remainder);
    if (params.isChatTarget(remainderLower)) return params.parseTarget(remainder);
    return {
      kind: "handle",
      to: remainder,
      service,
    };
  }
  return null;
}
/**
 * Resolves service-prefixed targets where chat ids should bypass handle parsing.
 */
function resolveServicePrefixedChatTarget(params) {
  const chatPrefixes = [
    ...params.chatIdPrefixes,
    ...params.chatGuidPrefixes,
    ...params.chatIdentifierPrefixes,
    ...(params.extraChatPrefixes ?? []),
  ];
  return resolveServicePrefixedTarget({
    trimmed: params.trimmed,
    lower: params.lower,
    servicePrefixes: params.servicePrefixes,
    isChatTarget: (remainderLower) => startsWithAnyPrefix(remainderLower, chatPrefixes),
    parseTarget: params.parseTarget,
  });
}
/**
 * Parses chat target prefixes and throws for malformed prefixed values.
 */
function parseChatTargetPrefixesOrThrow(params) {
  for (const prefix of params.chatIdPrefixes)
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      const chatId = parseStrictInteger(value);
      if (chatId === void 0) throw new Error(`Invalid chat_id: ${value}`);
      return {
        kind: "chat_id",
        chatId,
      };
    }
  for (const prefix of params.chatGuidPrefixes)
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (!value) throw new Error("chat_guid is required");
      return {
        kind: "chat_guid",
        chatGuid: value,
      };
    }
  for (const prefix of params.chatIdentifierPrefixes)
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (!value) throw new Error("chat_identifier is required");
      return {
        kind: "chat_identifier",
        chatIdentifier: value,
      };
    }
  return null;
}
/**
 * Resolves service-prefixed allowlist targets.
 */
function resolveServicePrefixedAllowTarget(params) {
  for (const { prefix } of params.servicePrefixes) {
    if (!params.lower.startsWith(prefix)) continue;
    const remainder = stripPrefix(params.trimmed, prefix);
    if (!remainder)
      return {
        kind: "handle",
        handle: "",
      };
    return params.parseAllowTarget(remainder);
  }
  return null;
}
/**
 * Resolves service-prefixed allow targets before falling back to chat prefixes.
 */
function resolveServicePrefixedOrChatAllowTarget(params) {
  const servicePrefixed = resolveServicePrefixedAllowTarget({
    trimmed: params.trimmed,
    lower: params.lower,
    servicePrefixes: params.servicePrefixes,
    parseAllowTarget: params.parseAllowTarget,
  });
  if (servicePrefixed) return servicePrefixed;
  const chatTarget = parseChatAllowTargetPrefixes({
    trimmed: params.trimmed,
    lower: params.lower,
    chatIdPrefixes: params.chatIdPrefixes,
    chatGuidPrefixes: params.chatGuidPrefixes,
    chatIdentifierPrefixes: params.chatIdentifierPrefixes,
  });
  if (chatTarget) return chatTarget;
  return null;
}
/**
 * Creates a reusable sender matcher for chat-aware channel allowlists.
 */
function createAllowedChatSenderMatcher(params) {
  return (input) =>
    isAllowedParsedChatSender({
      allowFrom: input.allowFrom,
      sender: input.sender,
      chatId: input.chatId,
      chatGuid: input.chatGuid,
      chatIdentifier: input.chatIdentifier,
      allowConversationTargets:
        input.allowConversationTargets ?? params.allowConversationTargets ?? false,
      normalizeSender: params.normalizeSender,
      parseAllowTarget: params.parseAllowTarget,
    });
}
/**
 * Parses chat target prefixes for allowlist entries, ignoring malformed values.
 */
function parseChatAllowTargetPrefixes(params) {
  for (const prefix of params.chatIdPrefixes)
    if (params.lower.startsWith(prefix)) {
      const chatId = parseStrictInteger(stripPrefix(params.trimmed, prefix));
      if (chatId !== void 0)
        return {
          kind: "chat_id",
          chatId,
        };
    }
  for (const prefix of params.chatGuidPrefixes)
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (value)
        return {
          kind: "chat_guid",
          chatGuid: value,
        };
    }
  for (const prefix of params.chatIdentifierPrefixes)
    if (params.lower.startsWith(prefix)) {
      const value = stripPrefix(params.trimmed, prefix);
      if (value)
        return {
          kind: "chat_identifier",
          chatIdentifier: value,
        };
    }
  return null;
}
//#endregion
export {
  resolveServicePrefixedAllowTarget as a,
  resolveServicePrefixedTarget as c,
  parseChatTargetPrefixesOrThrow as i,
  isAllowedParsedChatSender as n,
  resolveServicePrefixedChatTarget as o,
  parseChatAllowTargetPrefixes as r,
  resolveServicePrefixedOrChatAllowTarget as s,
  createAllowedChatSenderMatcher as t,
};
