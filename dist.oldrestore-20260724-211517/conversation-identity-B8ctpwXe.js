import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as parseDiscordTarget } from "./target-parsing-DA2e4aeg.js";
//#region extensions/discord/src/conversation-identity.ts
function normalizeDiscordTarget(raw, defaultKind) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) return;
  return parseDiscordTarget(trimmed, { defaultKind })?.normalized;
}
function buildDiscordConversationIdentity(kind, rawId) {
  const trimmed = normalizeOptionalString(rawId);
  return trimmed ? `${kind}:${trimmed}` : void 0;
}
function resolveDiscordConversationIdentity(params) {
  return params.isDirectMessage
    ? buildDiscordConversationIdentity("user", params.userId)
    : buildDiscordConversationIdentity("channel", params.channelId);
}
function resolveDiscordCurrentConversationIdentity(params) {
  if (normalizeOptionalLowercaseString(params.chatType) === "direct") {
    const senderTarget = normalizeDiscordTarget(params.from, "user");
    if (senderTarget?.startsWith("user:")) return senderTarget;
  }
  for (const candidate of [params.originatingTo, params.commandTo, params.fallbackTo]) {
    const target = normalizeDiscordTarget(candidate, "channel");
    if (target) return target;
  }
}
//#endregion
export { resolveDiscordCurrentConversationIdentity as n, resolveDiscordConversationIdentity as t };
