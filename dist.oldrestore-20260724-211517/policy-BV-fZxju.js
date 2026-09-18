import { a as resolveAllowlistMatchSimple } from "./allowlist-match-Cg15MVcF.js";
import {
  a as resolveChannelEntryMatchWithFallback,
  n as buildChannelKeyCandidates,
  r as normalizeChannelSlug,
  s as resolveNestedAllowlistDecision,
} from "./channel-config-CWvX3ZdP.js";
import { l as resolveScopeToolsPolicy } from "./channel-policy-DXOn_tKS.js";
import "./runtime-api-Btu8oXbZ.js";
//#region extensions/msteams/src/policy.ts
const encodeScopeSegment = (value) => `${value.length}:${value}`;
const teamScopeKey = (teamKey) => `team:${encodeScopeSegment(teamKey)}`;
const channelScopeKey = (teamKey, channelKey) =>
  `${teamScopeKey(teamKey)}/channel:${encodeScopeSegment(channelKey)}`;
function buildMSTeamsToolPolicyTree(teams) {
  const scopes = {};
  for (const [teamKey, team] of Object.entries(teams ?? {})) {
    scopes[teamScopeKey(teamKey)] = {
      tools: team.tools,
      toolsBySender: team.toolsBySender,
    };
    for (const [channelKey, channel] of Object.entries(team.channels ?? {}))
      scopes[channelScopeKey(teamKey, channelKey)] = {
        tools: channel.tools,
        toolsBySender: channel.toolsBySender,
      };
  }
  return { scopes };
}
function resolveMSTeamsToolPolicyScope(params) {
  const teams = params.cfg.teams ?? {};
  const tree = buildMSTeamsToolPolicyTree(teams);
  const teamMatch = resolveChannelEntryMatchWithFallback({
    entries: teams,
    keys: buildChannelKeyCandidates(params.groupSpace?.trim()),
    wildcardKey: "*",
    normalizeKey: normalizeChannelSlug,
  });
  const matchedTeamKey = teamMatch.matchKey ?? teamMatch.key;
  if (teamMatch.entry && matchedTeamKey) {
    const channelMatch = resolveChannelEntryMatchWithFallback({
      entries: teamMatch.entry.channels ?? {},
      keys: buildChannelKeyCandidates(params.groupId?.trim()),
      wildcardKey: "*",
      normalizeKey: normalizeChannelSlug,
    });
    const matchedChannelKey = channelMatch.matchKey ?? channelMatch.key;
    return {
      tree,
      path: [
        teamScopeKey(matchedTeamKey),
        ...(channelMatch.entry && matchedChannelKey
          ? [channelScopeKey(matchedTeamKey, matchedChannelKey)]
          : []),
      ],
    };
  }
  return {
    tree,
    path: [],
  };
}
function resolveMSTeamsCrossTeamScanScope(params) {
  const teams = params.cfg.teams ?? {};
  const tree = buildMSTeamsToolPolicyTree(teams);
  const groupId = params.groupId?.trim();
  if (!groupId)
    return {
      tree,
      path: [],
    };
  const channelCandidates = buildChannelKeyCandidates(groupId);
  for (const [teamKey, team] of Object.entries(teams)) {
    const channelMatch = resolveChannelEntryMatchWithFallback({
      entries: team.channels ?? {},
      keys: channelCandidates,
      wildcardKey: "*",
      normalizeKey: normalizeChannelSlug,
    });
    const matchedChannelKey = channelMatch.matchKey ?? channelMatch.key;
    if (channelMatch.entry && matchedChannelKey)
      return {
        tree,
        path: [teamScopeKey(teamKey), channelScopeKey(teamKey, matchedChannelKey)],
      };
  }
  return {
    tree,
    path: [],
  };
}
function resolveMSTeamsRouteConfig(params) {
  const teamId = params.teamId?.trim();
  const teamName = params.teamName?.trim();
  const conversationId = params.conversationId?.trim();
  const channelName = params.channelName?.trim();
  const teams = params.cfg?.teams ?? {};
  const allowlistConfigured = Object.keys(teams).length > 0;
  const teamMatch = resolveChannelEntryMatchWithFallback({
    entries: teams,
    keys: buildChannelKeyCandidates(
      teamId,
      params.allowNameMatching ? teamName : void 0,
      params.allowNameMatching && teamName ? normalizeChannelSlug(teamName) : void 0,
    ),
    wildcardKey: "*",
    normalizeKey: normalizeChannelSlug,
  });
  const teamConfig = teamMatch.entry;
  const channels = teamConfig?.channels ?? {};
  const channelAllowlistConfigured = Object.keys(channels).length > 0;
  const channelMatch = resolveChannelEntryMatchWithFallback({
    entries: channels,
    keys: buildChannelKeyCandidates(
      conversationId,
      params.allowNameMatching ? channelName : void 0,
      params.allowNameMatching && channelName ? normalizeChannelSlug(channelName) : void 0,
    ),
    wildcardKey: "*",
    normalizeKey: normalizeChannelSlug,
  });
  const channelConfig = channelMatch.entry;
  return {
    teamConfig,
    channelConfig,
    allowlistConfigured,
    allowed: resolveNestedAllowlistDecision({
      outerConfigured: allowlistConfigured,
      outerMatched: Boolean(teamConfig),
      innerConfigured: channelAllowlistConfigured,
      innerMatched: Boolean(channelConfig),
    }),
    teamKey: teamMatch.matchKey ?? teamMatch.key,
    channelKey: channelMatch.matchKey ?? channelMatch.key,
    channelMatchKey: channelMatch.matchKey,
    channelMatchSource:
      channelMatch.matchSource === "direct" || channelMatch.matchSource === "wildcard"
        ? channelMatch.matchSource
        : void 0,
  };
}
function resolveMSTeamsGroupToolPolicy(params) {
  const cfg = params.cfg.channels?.msteams;
  if (!cfg) return;
  const scope = resolveMSTeamsToolPolicyScope({
    cfg,
    groupSpace: params.groupSpace,
    groupId: params.groupId,
  });
  const senderScope = {
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  };
  const resolved = resolveScopeToolsPolicy({
    ...scope,
    ...senderScope,
  });
  if (resolved !== void 0) return resolved;
  if (scope.path.length > 1) return;
  return resolveScopeToolsPolicy({
    ...resolveMSTeamsCrossTeamScanScope({
      cfg,
      groupId: params.groupId,
    }),
    ...senderScope,
  });
}
function resolveMSTeamsAllowlistMatch(params) {
  return resolveAllowlistMatchSimple(params);
}
function resolveMSTeamsReplyPolicy(params) {
  if (params.isDirectMessage)
    return {
      requireMention: false,
      replyStyle: "thread",
    };
  const requireMention =
    params.channelConfig?.requireMention ??
    params.teamConfig?.requireMention ??
    params.globalConfig?.requireMention ??
    true;
  return {
    requireMention,
    replyStyle:
      params.channelConfig?.replyStyle ??
      params.teamConfig?.replyStyle ??
      params.globalConfig?.replyStyle ??
      (requireMention ? "thread" : "top-level"),
  };
}
//#endregion
export {
  resolveMSTeamsRouteConfig as i,
  resolveMSTeamsGroupToolPolicy as n,
  resolveMSTeamsReplyPolicy as r,
  resolveMSTeamsAllowlistMatch as t,
};
