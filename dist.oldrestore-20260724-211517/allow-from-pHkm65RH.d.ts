import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";

//#region src/channels/allowlists/resolve-utils.d.ts
type AllowlistUserResolutionLike = {
  input: string;
  resolved: boolean;
  id?: string;
};
declare function mergeAllowlist(params: {
  existing?: Array<string | number>;
  additions: string[];
}): string[];
/** Splits lookup results into resolved mappings, unresolved display text, and id additions. */
declare function buildAllowlistResolutionSummary<T extends AllowlistUserResolutionLike>(
  resolvedUsers: T[],
  opts?: {
    /** Return null to omit an entry from the logged mapping (e.g. identity lookups). */ formatResolved?: (
      entry: T,
    ) => string | null;
    formatUnresolved?: (entry: T) => string;
  },
): {
  resolvedMap: Map<string, T>;
  mapping: string[];
  unresolved: string[];
  additions: string[];
};
/** Replaces resolvable user entries with canonical ids while preserving unresolved entries and `*`. */
declare function canonicalizeAllowlistWithResolvedIds<
  T extends AllowlistUserResolutionLike,
>(params: { existing?: Array<string | number>; resolvedMap: Map<string, T> }): string[];
/** Updates nested `{ users }` allowlist entries using merge or canonicalize semantics. */
declare function patchAllowlistUsersInConfigEntries<
  T extends AllowlistUserResolutionLike,
  TEntries extends Record<string, unknown>,
>(params: {
  entries: TEntries;
  resolvedMap: Map<string, T>;
  strategy?: "merge" | "canonicalize";
}): TEntries;
/** Collects concrete user lookup targets from one config entry, excluding wildcard policy entries. */
declare function addAllowlistUserEntriesFromConfigEntry(target: Set<string>, entry: unknown): void;
/** Logs a compact resolved/unresolved allowlist lookup summary when there is anything to report. */
declare function summarizeMapping(
  label: string,
  mapping: string[],
  unresolved: string[],
  runtime: RuntimeEnv,
): void;
//#endregion
//#region src/plugin-sdk/allow-from.d.ts
/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
declare function formatAllowFromLowercase(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */ allowFrom: Array<
    string | number
  > /** Optional prefix remover for channel aliases such as `tg:` or `zalo:`. */;
  stripPrefixRe?: RegExp;
}): string[];
/** Normalize allowlist entries through a channel-provided parser or canonicalizer. */
declare function formatNormalizedAllowFromEntries(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */ allowFrom: Array<
    string | number
  > /** Channel-specific canonicalizer; empty results are omitted. */;
  normalizeEntry: (entry: string) => string | undefined | null;
}): string[];
/** Check whether a sender id matches a simple normalized allowlist with wildcard support. */
declare function isNormalizedSenderAllowed(params: {
  /** Sender id or handle to compare after string coercion and lowercase normalization. */ senderId:
    | string
    | number /** Raw allowlist entries; `*` allows every sender. */;
  allowFrom: Array<
    string | number
  > /** Optional prefix remover applied to allowlist entries before comparison. */;
  stripPrefixRe?: RegExp;
}): boolean;
type ParsedChatAllowTarget =
  | {
      kind: "chat_id";
      chatId: number;
    }
  | {
      kind: "chat_guid";
      chatGuid: string;
    }
  | {
      kind: "chat_identifier";
      chatIdentifier: string;
    }
  | {
      kind: "handle";
      handle: string;
    };
/** Match allowlist entries against senders, with conversation targets requiring explicit opt-in. */
declare function isAllowedParsedChatSender(params: {
  /** Raw allowlist entries, including handles, wildcard, or parsed chat targets. */ allowFrom: Array<
    string | number
  > /** Sender handle/id from the inbound message. */;
  sender: string /** Optional numeric conversation id for channel-specific chat target entries. */;
  chatId?:
    | number
    | null /** Optional stable conversation guid for channel-specific chat target entries. */;
  chatGuid?:
    | string
    | null /** Optional human/channel conversation identifier for chat target entries. */;
  chatIdentifier?:
    | string
    | null /** Enables matching conversation targets in addition to sender handles. */;
  allowConversationTargets?: boolean | null /** Channel-specific sender normalization hook. */;
  normalizeSender: (
    sender: string,
  ) => string /** Channel-specific allowlist parser for handles and conversation targets. */;
  parseAllowTarget: (entry: string) => ParsedChatAllowTarget;
}): boolean;
/** Serializable allowlist resolution record used by setup/status UI surfaces. */
type BasicAllowlistResolutionEntry = {
  /** Original allowlist input. */ input: string /** Whether resolution found a concrete account/user id. */;
  resolved: boolean /** Resolved id when available. */;
  id?: string /** Resolved display name when available. */;
  name?: string /** Optional resolver note for UI or docs output. */;
  note?: string;
};
/** Clone allowlist resolution entries into a plain serializable shape for UI and docs output. */
declare function mapBasicAllowlistResolutionEntries(
  entries: BasicAllowlistResolutionEntry[],
): BasicAllowlistResolutionEntry[];
/** Map allowlist inputs sequentially so resolver side effects stay ordered and predictable. */
declare function mapAllowlistResolutionInputs<T>(params: {
  /** Ordered allowlist inputs to resolve. */ inputs: string[] /** Resolver callback invoked once per input in order. */;
  mapInput: (input: string) => Promise<T> | T;
}): Promise<T[]>;
//#endregion
export {
  isNormalizedSenderAllowed as a,
  AllowlistUserResolutionLike as c,
  canonicalizeAllowlistWithResolvedIds as d,
  mergeAllowlist as f,
  isAllowedParsedChatSender as i,
  addAllowlistUserEntriesFromConfigEntry as l,
  summarizeMapping as m,
  formatAllowFromLowercase as n,
  mapAllowlistResolutionInputs as o,
  patchAllowlistUsersInConfigEntries as p,
  formatNormalizedAllowFromEntries as r,
  mapBasicAllowlistResolutionEntries as s,
  BasicAllowlistResolutionEntry as t,
  buildAllowlistResolutionSummary as u,
};
