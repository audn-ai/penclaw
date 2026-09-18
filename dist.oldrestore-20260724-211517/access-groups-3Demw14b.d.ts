import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { En as AccessGroupConfig, i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/access-groups.d.ts
/** Resolves membership for an access group using the full OpenClaw config. */
type AccessGroupMembershipResolver = (params: {
  /** Full config, available when membership needs cross-channel or provider state. */ cfg: OpenClawConfig /** Access group name referenced by `accessGroup:<name>`. */;
  name: string /** Access group config selected by name. */;
  group: AccessGroupConfig /** Channel where the inbound sender is being checked. */;
  channel: ChannelId /** Channel account id for account-scoped membership checks. */;
  accountId: string /** Inbound sender id or handle being authorized. */;
  senderId: string;
}) => boolean | Promise<boolean>;
/** Resolves membership for one access group when the caller already selected the config group. */
type AccessGroupMembershipLookup = (params: {
  /** Access group name referenced by `accessGroup:<name>`. */ name: string /** Access group config selected by name. */;
  group: AccessGroupConfig /** Channel where the inbound sender is being checked. */;
  channel: ChannelId /** Channel account id for account-scoped membership checks. */;
  accountId: string /** Inbound sender id or handle being authorized. */;
  senderId: string;
}) => boolean | Promise<boolean>;
/** Reports how access-group allowlist entries resolved for a channel sender. */
type ResolvedAccessGroupAllowFromState = {
  /** Unique access group names referenced by the allowlist. */ referenced: string[] /** Referenced groups that authorized the sender. */;
  matched: string[] /** Referenced groups absent from config. */;
  missing: string[] /** Referenced groups whose type cannot be evaluated without a resolver. */;
  unsupported: string[] /** Referenced groups whose resolver threw. */;
  failed: string[] /** Matched allowlist entries in `accessGroup:<name>` form. */;
  matchedAllowFromEntries: string[] /** Whether the input allowlist referenced at least one access group. */;
  hasReferences: boolean /** Whether at least one referenced group authorized the sender. */;
  hasMatch: boolean;
};
/** Resolves `accessGroup:<name>` allowlist entries without changing the original allowlist. */
declare function resolveAccessGroupAllowFromState(params: {
  /** Configured access groups keyed by name. */ accessGroups?: Record<
    string,
    AccessGroupConfig
  > /** Raw allowlist entries that may include `accessGroup:<name>` references. */;
  allowFrom:
    | Array<string | number>
    | null
    | undefined /** Channel where the inbound sender is being checked. */;
  channel: ChannelId /** Channel account id for account-scoped membership checks. */;
  accountId: string /** Inbound sender id or handle being authorized. */;
  senderId: string /** Static sender matcher used for `message.senders` groups. */;
  isSenderAllowed?: (
    senderId: string,
    allowFrom: string[],
  ) => boolean /** Optional resolver for non-static or integration-backed group types. */;
  resolveMembership?: AccessGroupMembershipLookup;
}): Promise<ResolvedAccessGroupAllowFromState>;
/** Returns the matched `accessGroup:<name>` allowlist entries for a sender. */
declare function resolveAccessGroupAllowFromMatches(params: {
  /** Full config containing `accessGroups`. */ cfg?: OpenClawConfig /** Raw allowlist entries that may include `accessGroup:<name>` references. */;
  allowFrom:
    | Array<string | number>
    | null
    | undefined /** Channel where the inbound sender is being checked. */;
  channel: ChannelId /** Channel account id for account-scoped membership checks. */;
  accountId: string /** Inbound sender id or handle being authorized. */;
  senderId: string /** Static sender matcher used for `message.senders` groups. */;
  isSenderAllowed?: (
    senderId: string,
    allowFrom: string[],
  ) => boolean /** Optional resolver for non-static or integration-backed group types. */;
  resolveMembership?: AccessGroupMembershipResolver;
}): Promise<string[]>;
/** Expands a matching access-group allowlist with the concrete sender entry. */
declare function expandAllowFromWithAccessGroups(params: {
  /** Full config containing `accessGroups`. */ cfg?: OpenClawConfig /** Raw allowlist entries that may include `accessGroup:<name>` references. */;
  allowFrom:
    | Array<string | number>
    | null
    | undefined /** Channel where the inbound sender is being checked. */;
  channel: ChannelId /** Channel account id for account-scoped membership checks. */;
  accountId: string /** Inbound sender id or handle being authorized. */;
  senderId: string /** Concrete allowlist entry appended after a group match; defaults to `senderId`. */;
  senderAllowEntry?: string /** Static sender matcher used for `message.senders` groups. */;
  isSenderAllowed?: (
    senderId: string,
    allowFrom: string[],
  ) => boolean /** Optional resolver for non-static or integration-backed group types. */;
  resolveMembership?: AccessGroupMembershipResolver;
}): Promise<string[]>;
//#endregion
export {
  resolveAccessGroupAllowFromMatches as a,
  expandAllowFromWithAccessGroups as i,
  AccessGroupMembershipResolver as n,
  resolveAccessGroupAllowFromState as o,
  ResolvedAccessGroupAllowFromState as r,
  AccessGroupMembershipLookup as t,
};
