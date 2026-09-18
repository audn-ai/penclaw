import {
  a as parseAccessGroupAllowFromEntry,
  t as ACCESS_GROUP_ALLOW_FROM_PREFIX,
} from "./allow-from-o-cfFFcK.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/plugin-sdk/access-groups.ts
/** Resolve the concrete sender allowlist entries for static message-sender groups. */
function resolveMessageSenderGroupEntries(params) {
  if (params.group.type !== "message.senders") return [];
  return [...(params.group.members["*"] ?? []), ...(params.group.members[params.channel] ?? [])];
}
/** Resolves `accessGroup:<name>` allowlist entries without changing the original allowlist. */
async function resolveAccessGroupAllowFromState(params) {
  const names = Array.from(
    new Set(
      (params.allowFrom ?? [])
        .map((entry) => parseAccessGroupAllowFromEntry(String(entry)))
        .filter((entry) => entry != null),
    ),
  );
  const state = {
    referenced: names,
    matched: [],
    missing: [],
    unsupported: [],
    failed: [],
    matchedAllowFromEntries: [],
    hasReferences: names.length > 0,
    hasMatch: false,
  };
  const groups = params.accessGroups;
  for (const name of names) {
    const group = groups?.[name];
    if (!group) {
      state.missing.push(name);
      continue;
    }
    const senderEntries = resolveMessageSenderGroupEntries({
      group,
      channel: params.channel,
    });
    if (
      senderEntries.length > 0 &&
      params.isSenderAllowed?.(params.senderId, senderEntries) === true
    ) {
      state.matched.push(name);
      continue;
    }
    if (!params.resolveMembership) {
      if (group.type !== "message.senders") state.unsupported.push(name);
      continue;
    }
    let allowed;
    try {
      allowed = await params.resolveMembership({
        name,
        group,
        channel: params.channel,
        accountId: params.accountId,
        senderId: params.senderId,
      });
    } catch {
      state.failed.push(name);
      continue;
    }
    if (allowed) state.matched.push(name);
  }
  state.matchedAllowFromEntries = state.matched.map(
    (name) => `${ACCESS_GROUP_ALLOW_FROM_PREFIX}${name}`,
  );
  state.hasMatch = state.matchedAllowFromEntries.length > 0;
  return state;
}
/** Returns the matched `accessGroup:<name>` allowlist entries for a sender. */
async function resolveAccessGroupAllowFromMatches(params) {
  const cfg = params.cfg;
  const resolveMembership = params.resolveMembership;
  return (
    await resolveAccessGroupAllowFromState({
      accessGroups: cfg?.accessGroups,
      allowFrom: params.allowFrom,
      channel: params.channel,
      accountId: params.accountId,
      senderId: params.senderId,
      isSenderAllowed: params.isSenderAllowed,
      resolveMembership:
        resolveMembership && cfg
          ? async (lookupParams) =>
              await resolveMembership({
                cfg,
                ...lookupParams,
              })
          : void 0,
    })
  ).matchedAllowFromEntries;
}
/** Expands a matching access-group allowlist with the concrete sender entry. */
async function expandAllowFromWithAccessGroups(params) {
  const allowFrom = (params.allowFrom ?? []).map(String);
  if (
    (
      await resolveAccessGroupAllowFromMatches({
        cfg: params.cfg,
        allowFrom,
        channel: params.channel,
        accountId: params.accountId,
        senderId: params.senderId,
        isSenderAllowed: params.isSenderAllowed,
        resolveMembership: params.resolveMembership,
      })
    ).length === 0
  )
    return allowFrom;
  const senderEntry = params.senderAllowEntry ?? params.senderId;
  return uniqueStrings([...allowFrom, senderEntry]);
}
//#endregion
export {
  resolveAccessGroupAllowFromMatches as n,
  resolveAccessGroupAllowFromState as r,
  expandAllowFromWithAccessGroups as t,
};
