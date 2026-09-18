//#region src/channels/targets.d.ts
/** Canonical route target families shared by channel-owned parsers. */
type MessagingTargetKind = "user" | "channel";
/** Parsed channel target with the original token and normalized lookup key. */
type MessagingTarget = {
  kind: MessagingTargetKind;
  id: string;
  raw: string;
  normalized: string;
};
/** Options for parsers that can infer a kind or reject ambiguous input. */
type MessagingTargetParseOptions = {
  defaultKind?: MessagingTargetKind;
  ambiguousMessage?: string;
};
/** Builds the stable lower-case lookup key used to compare channel targets. */
declare function normalizeTargetId(kind: MessagingTargetKind, id: string): string;
/** Creates a parsed target while preserving the user-provided raw token. */
declare function buildMessagingTarget(
  kind: MessagingTargetKind,
  id: string,
  raw: string,
): MessagingTarget;
/** Validates an extracted target id with a channel-owned grammar. */
declare function ensureTargetId(params: {
  candidate: string;
  pattern: RegExp;
  errorMessage: string;
}): string;
/** Parses one mention pattern whose first capture group is the target id. */
declare function parseTargetMention(params: {
  raw: string;
  mentionPattern: RegExp;
  kind: MessagingTargetKind;
}): MessagingTarget | undefined;
/** Parses a single kind-prefixed target such as channel:<id> or user:<id>. */
declare function parseTargetPrefix(params: {
  raw: string;
  prefix: string;
  kind: MessagingTargetKind;
}): MessagingTarget | undefined;
/** Parses the first matching kind-prefixed target from a channel grammar list. */
declare function parseTargetPrefixes(params: {
  raw: string;
  prefixes: Array<{
    prefix: string;
    kind: MessagingTargetKind;
  }>;
}): MessagingTarget | undefined;
/** Parses @user shorthand and validates it against a channel-owned user grammar. */
declare function parseAtUserTarget(params: {
  raw: string;
  pattern: RegExp;
  errorMessage: string;
}): MessagingTarget | undefined;
/** Tries mention, explicit prefixes, then @user shorthand in deterministic order. */
declare function parseMentionPrefixOrAtUserTarget(params: {
  raw: string;
  mentionPattern: RegExp;
  prefixes: Array<{
    prefix: string;
    kind: MessagingTargetKind;
  }>;
  atUserPattern: RegExp;
  atUserErrorMessage: string;
}): MessagingTarget | undefined;
/** Requires a parsed target of the requested kind and returns its channel id. */
declare function requireTargetKind(params: {
  platform: string;
  target: MessagingTarget | undefined;
  kind: MessagingTargetKind;
}): string;
//#endregion
export {
  ensureTargetId as a,
  parseMentionPrefixOrAtUserTarget as c,
  parseTargetPrefixes as d,
  requireTargetKind as f,
  buildMessagingTarget as i,
  parseTargetMention as l,
  MessagingTargetKind as n,
  normalizeTargetId as o,
  MessagingTargetParseOptions as r,
  parseAtUserTarget as s,
  MessagingTarget as t,
  parseTargetPrefix as u,
};
