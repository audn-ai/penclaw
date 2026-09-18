import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
//#region src/auto-reply/tokens.ts
/** Silent-reply and heartbeat tokens plus helpers for suppressing token-only model output. */
/** Token that marks a heartbeat response as an acknowledgement with no user notification. */
const HEARTBEAT_TOKEN = "HEARTBEAT_OK";
/** Token that marks an auto-reply response as intentionally silent. */
const SILENT_REPLY_TOKEN = "NO_REPLY";
const HARMONY_CHANNEL_MARKER_RE = /^\s*(?:set-thought\s+)?<[\w]*\|[^>]*>\s*$/;
const BOX_DRAWING_HR_ONLY_RE = /^\s*─{3,}\s*$/;
function isInternalFormattingArtifact(text) {
  if (!text) return false;
  return HARMONY_CHANNEL_MARKER_RE.test(text) || BOX_DRAWING_HR_ONLY_RE.test(text);
}
const silentExactRegexByToken = /* @__PURE__ */ new Map();
const silentTrailingRegexByToken = /* @__PURE__ */ new Map();
const silentLeadingAttachedRegexByToken = /* @__PURE__ */ new Map();
function getSilentExactRegex(token) {
  const cached = silentExactRegexByToken.get(token);
  if (cached) return cached;
  const escaped = escapeRegExp(token);
  const regex = new RegExp(`^\\s*${escaped}(?:\\s+${escaped})*\\s*$`, "i");
  silentExactRegexByToken.set(token, regex);
  return regex;
}
function getSilentTrailingRegex(token) {
  const cached = silentTrailingRegexByToken.get(token);
  if (cached) return cached;
  const escaped = escapeRegExp(token);
  const regex = new RegExp(`(?:^|\\s+|\\*+)${escaped}\\s*$`, "i");
  silentTrailingRegexByToken.set(token, regex);
  return regex;
}
function stripEdgePunctuation(text) {
  return text.replace(/^\p{P}+|\p{P}+$/gu, "");
}
/** Returns true only for token-only silent replies. */
function isSilentReplyText(text, token = SILENT_REPLY_TOKEN) {
  if (!text) return false;
  return (
    getSilentExactRegex(token).test(text) ||
    getSilentExactRegex(token).test(stripEdgePunctuation(text.trim()))
  );
}
function isSilentReplyJsonStringText(text, token = SILENT_REPLY_TOKEN) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed.startsWith('"') || !trimmed.endsWith('"') || !trimmed.includes(token)) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "string" && parsed.trim() === token;
  } catch {
    return false;
  }
}
function isSilentReplyEnvelopeText(text, token = SILENT_REPLY_TOKEN) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed || !trimmed.startsWith("{") || !trimmed.endsWith("}") || !trimmed.includes(token))
    return false;
  try {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
    const keys = Object.keys(parsed);
    return (
      keys.length === 1 &&
      keys[0] === "action" &&
      typeof parsed.action === "string" &&
      parsed.action.trim() === token
    );
  } catch {
    return false;
  }
}
const taggedReasoningPrefixRe =
  /^\s*<\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>[\s\S]*?<\s*\/\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\s*>\s*/i;
const openReasoningPrefixRe =
  /^\s*<\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/i;
const plainReasoningPrefixRe = /^\s*(?:think(?:ing)?|thought|analysis|reasoning)\s*:?\s*\r?\n/i;
function stripLeadingReasoningBlocks(text) {
  let current = text;
  while (true) {
    const next = current.replace(taggedReasoningPrefixRe, "");
    if (next === current) return current;
    current = next;
  }
}
function stripFinalSilentToken(text, token) {
  const escaped = escapeRegExp(token);
  const stripped = text.replace(new RegExp(`(?:^|[\\s*.])${escaped}\\s*$`, "i"), "").trim();
  return stripped === text.trim() ? null : stripped;
}
const silentIntentTextRe =
  /^\s*(?:i|i'll|i\s+will|i'm|i\s+am|we|we'll|we\s+will|the\s+assistant|assistant|the\s+bot|bot|openclaw)\s+(?:(?:will\s+)?(?:stay|remain|keep|be)\s+(?:quiet|silent)(?:\s+(?:here|for\s+now|on\s+this|in\s+this\s+(?:chat|thread|channel|conversation)))?|(?:do\s+not|don't|dont|will\s+not|won't|would\s+not|should\s+not)\s+(?:reply|respond)(?:\s+(?:here|for\s+now|on\s+this|in\s+this\s+(?:chat|thread|channel|conversation)))?|(?:have|has)\s+nothing\s+(?:to|for)\s+(?:say|add|reply|respond))(?:[.!?]+)?\s*$/i;
function hasSilentIntentFinalSilentToken(text, token) {
  const withoutToken = stripFinalSilentToken(text, token);
  if (withoutToken === null) return false;
  return !withoutToken || silentIntentTextRe.test(withoutToken);
}
const substantiveAnswerCueRe =
  /\b(?:answer|here(?:'s|\s+is)|tell\s+them|you\s+(?:should|can|could|need|must)|please|try|use|send|service\s+is|resolved|retry|yes|no,|sure)\b/i;
const bareReasoningPlaceholderRe =
  /^\s*(?:(?:internal|private)\s+)?(?:reasoning|thinking|thoughts?|analysis)(?:\s+notes?)?\s*$/i;
function hasPlainReasoningFinalSilentToken(text, token) {
  const withoutToken = stripFinalSilentToken(text, token);
  if (withoutToken === null) return false;
  if (!withoutToken || silentIntentTextRe.test(withoutToken)) return true;
  const lines = withoutToken
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const finalLine = lines.at(-1);
  const previousLines = lines.slice(0, -1).join("\n");
  return (
    Boolean(
      finalLine &&
      silentIntentTextRe.test(finalLine) &&
      previousLines &&
      !substantiveAnswerCueRe.test(previousLines),
    ) || bareReasoningPlaceholderRe.test(withoutToken)
  );
}
function isReasoningPrefixedSilentReplyText(text, token = SILENT_REPLY_TOKEN) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  const withoutLeadingReasoningBlocks = stripLeadingReasoningBlocks(trimmed);
  if (withoutLeadingReasoningBlocks !== trimmed)
    return (
      isSilentReplyText(withoutLeadingReasoningBlocks, token) ||
      hasSilentIntentFinalSilentToken(withoutLeadingReasoningBlocks, token)
    );
  if (openReasoningPrefixRe.test(trimmed)) {
    const withoutOpenReasoningPrefix = trimmed.replace(openReasoningPrefixRe, "");
    return (
      isSilentReplyText(withoutOpenReasoningPrefix, token) ||
      hasPlainReasoningFinalSilentToken(withoutOpenReasoningPrefix, token)
    );
  }
  if (!plainReasoningPrefixRe.test(trimmed)) return false;
  const withoutPlainReasoningPrefix = trimmed.replace(plainReasoningPrefixRe, "");
  return (
    isSilentReplyText(withoutPlainReasoningPrefix, token) ||
    hasPlainReasoningFinalSilentToken(withoutPlainReasoningPrefix, token)
  );
}
/** Returns true for token-only, JSON-envelope, or reasoning-prefixed silent payload text. */
function isSilentReplyPayloadText(text, token = SILENT_REPLY_TOKEN) {
  return (
    isSilentReplyText(text, token) ||
    isSilentReplyJsonStringText(text, token) ||
    isSilentReplyEnvelopeText(text, token) ||
    isReasoningPrefixedSilentReplyText(text, token)
  );
}
/**
 * Strip a trailing silent reply token from mixed-content text.
 * Returns the remaining text with the token removed (trimmed).
 * If the result is empty, the entire message should be treated as silent.
 */
function stripSilentToken(text, token = SILENT_REPLY_TOKEN) {
  return text.replace(getSilentTrailingRegex(token), "").trim();
}
const silentLeadingRegexByToken = /* @__PURE__ */ new Map();
function getSilentLeadingAttachedRegex(token) {
  const cached = silentLeadingAttachedRegexByToken.get(token);
  if (cached) return cached;
  const escaped = escapeRegExp(token);
  const regex = new RegExp(`^\\s*(?:${escaped}\\s+)*${escaped}(?=[\\p{L}\\p{N}])`, "iu");
  silentLeadingAttachedRegexByToken.set(token, regex);
  return regex;
}
function getSilentLeadingRegex(token) {
  const cached = silentLeadingRegexByToken.get(token);
  if (cached) return cached;
  const escaped = escapeRegExp(token);
  const regex = new RegExp(`^(?:\\s*${escaped})+\\s*`, "i");
  silentLeadingRegexByToken.set(token, regex);
  return regex;
}
/**
 * Strip leading silent reply tokens from text.
 * Handles cases like "NO_REPLYThe user is saying..." where the token
 * is not separated from the following text.
 */
function stripLeadingSilentToken(text, token = SILENT_REPLY_TOKEN) {
  return text.replace(getSilentLeadingRegex(token), "").trim();
}
/**
 * Check whether text starts with one or more leading silent reply tokens where
 * the final token is glued directly to visible content.
 */
function startsWithSilentToken(text, token = SILENT_REPLY_TOKEN) {
  if (!text) return false;
  return getSilentLeadingAttachedRegex(token).test(text);
}
function isSilentReplyPrefixText(text, token = SILENT_REPLY_TOKEN) {
  if (!text) return false;
  const trimmed = text.trimStart();
  if (!trimmed) return false;
  if (trimmed !== trimmed.toUpperCase()) return false;
  const normalized = trimmed.toUpperCase();
  if (!normalized) return false;
  if (normalized.length < 2) return false;
  const tokenUpper = token.toUpperCase();
  if (!tokenUpper.startsWith(normalized)) return false;
  if (normalized.includes("_")) return true;
  if (normalized === tokenUpper) return true;
  if (/[^A-Z_]/.test(tokenUpper)) return /[^A-Z_]/.test(normalized);
  return tokenUpper === "NO_REPLY" && normalized === "NO";
}
//#endregion
export {
  isSilentReplyPrefixText as a,
  stripLeadingSilentToken as c,
  isSilentReplyPayloadText as i,
  stripSilentToken as l,
  SILENT_REPLY_TOKEN as n,
  isSilentReplyText as o,
  isInternalFormattingArtifact as r,
  startsWithSilentToken as s,
  HEARTBEAT_TOKEN as t,
};
