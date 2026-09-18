import { a as mapAllowlistResolutionInputs } from "./allow-from-BCaLdTTU.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  c as listChannelsForTeamWithPageInfo,
  d as normalizeQuery,
  h as resolveGraphToken,
  t as findGraphUsersByExactIdentity,
  u as listTeamsByNameWithPageInfo,
} from "./graph-users-s5ZqGi_X.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/msteams/src/resolve-allowlist.ts
function normalizeExactMatch(value) {
  return normalizeLowercaseStringOrEmpty(value ?? "");
}
function uniqueItemsById(items) {
  const byId = /* @__PURE__ */ new Map();
  for (const item of items) {
    const id = item.id?.trim();
    if (id && !byId.has(id)) byId.set(id, item);
  }
  return [...byId.values()];
}
function findExactTeams(items, query) {
  const normalized = normalizeExactMatch(query);
  return uniqueItemsById(
    items.filter((item) => normalizeExactMatch(item.displayName) === normalized),
  );
}
function findExactChannels(items, query) {
  const normalized = normalizeExactMatch(query);
  return uniqueItemsById(
    items.filter((item) => normalizeExactMatch(item.displayName) === normalized),
  );
}
function findExactUsers(items, query) {
  const normalized = normalizeExactMatch(query);
  return uniqueItemsById(
    items.filter((item) =>
      [item.displayName, item.mail, item.userPrincipalName].some(
        (value) => normalizeExactMatch(value) === normalized,
      ),
    ),
  );
}
function isStableMSTeamsUserId(raw) {
  return /^[0-9a-fA-F-]{16,}$/.test(normalizeMSTeamsUserInput(raw));
}
function normalizeStaticMSTeamsAllowEntry(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;
  if (trimmed === "*" || /^accessGroup:/i.test(trimmed)) return trimmed;
  const id = normalizeMSTeamsUserInput(trimmed);
  return isStableMSTeamsUserId(id) ? id : void 0;
}
function projectStableMSTeamsUserAllowlist(entries) {
  if (!entries) return;
  const projected = entries
    .map((entry) => normalizeStaticMSTeamsAllowEntry(entry))
    .filter((entry) => Boolean(entry));
  return [...new Map(projected.map((entry) => [normalizeExactMatch(entry), entry])).values()];
}
function stripProviderPrefix(raw) {
  return raw.replace(/^(msteams|teams):/i, "");
}
function normalizeMSTeamsMessagingTarget(raw) {
  let trimmed = raw.trim();
  if (!trimmed) return;
  trimmed = stripProviderPrefix(trimmed).trim();
  if (/^conversation:/i.test(trimmed)) {
    const id = trimmed.slice(13).trim();
    return id ? `conversation:${id}` : void 0;
  }
  if (/^user:/i.test(trimmed)) {
    const id = trimmed.slice(5).trim();
    return id ? `user:${id}` : void 0;
  }
  return trimmed || void 0;
}
function normalizeMSTeamsUserInput(raw) {
  return stripProviderPrefix(raw)
    .replace(/^(user|conversation):/i, "")
    .trim();
}
function parseMSTeamsConversationId(raw) {
  const trimmed = stripProviderPrefix(raw).trim();
  if (!/^conversation:/i.test(trimmed)) return null;
  return trimmed.slice(13).trim();
}
/**
 * Detect whether a raw target string is a supported Microsoft Teams
 * conversation id.
 *
 * Accepts both prefixed and bare formats:
 * - `conversation:<id>` — explicit conversation prefix
 * - `19:abc@thread.tacv2` / `19:abc@thread.skype` — channel / legacy group
 * - `19:{userId}_{appId}@unq.gbl.spaces` — Graph 1:1 chat thread format
 * - `a:1xxx` — Bot Framework personal (1:1) chat id
 * - `8:orgid:xxx` — Bot Framework org-scoped personal chat id
 */
function looksLikeMSTeamsConversationId(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (/^conversation:/i.test(trimmed)) return true;
  if (/^19:.+@thread\.(tacv2|skype)$/i.test(trimmed)) return true;
  if (/^19:.+@unq\.gbl\.spaces$/i.test(trimmed)) return true;
  if (/^a:1[A-Za-z0-9_-]+$/i.test(trimmed)) return true;
  if (/^8:orgid:[A-Za-z0-9-]+$/i.test(trimmed)) return true;
  return /@thread\b/i.test(trimmed);
}
/**
 * Detect conversation ids plus stable user ids that explicit-target delivery
 * can forward verbatim to the channel adapter.
 */
function looksLikeMSTeamsTargetId(raw) {
  const trimmed = raw.trim();
  if (looksLikeMSTeamsConversationId(trimmed)) return true;
  if (/^user:/i.test(trimmed)) {
    const id = trimmed.slice(5).trim();
    return /^[0-9a-fA-F-]{16,}$/.test(id);
  }
  return /^29:[A-Za-z0-9_-]+$/i.test(trimmed);
}
function normalizeMSTeamsTeamKey(raw) {
  return (
    stripProviderPrefix(raw)
      .replace(/^team:/i, "")
      .trim() || void 0
  );
}
function normalizeMSTeamsChannelKey(raw) {
  return (raw?.trim().replace(/^#/, "").trim() ?? "") || void 0;
}
function normalizeMSTeamsConversationTargetId(raw) {
  const trimmed = stripProviderPrefix(raw).trim();
  return parseMSTeamsConversationId(trimmed) ?? trimmed;
}
function looksLikeMSTeamsThreadConversationId(raw) {
  const normalized = normalizeMSTeamsConversationTargetId(raw);
  return /^19:.+@thread\./i.test(normalized);
}
function isStableMSTeamsTeamKey(raw) {
  return /^[0-9a-fA-F-]{16,}$/.test(raw.trim()) || looksLikeMSTeamsThreadConversationId(raw);
}
function projectStableMSTeamsChannels(channels) {
  const projected = {};
  for (const [channelKey, channelConfig] of Object.entries(channels ?? {})) {
    if (channelKey === "*") {
      projected[channelKey] = channelConfig;
      continue;
    }
    if (looksLikeMSTeamsThreadConversationId(channelKey))
      projected[normalizeMSTeamsConversationTargetId(channelKey)] = channelConfig;
  }
  return projected;
}
function projectStableMSTeamsTeamsConfig(teams) {
  if (!teams) return;
  const projected = {};
  for (const [teamKey, teamConfig] of Object.entries(teams)) {
    if (teamKey !== "*" && !isStableMSTeamsTeamKey(teamKey)) continue;
    const stableKey = teamKey === "*" ? teamKey : normalizeMSTeamsConversationTargetId(teamKey);
    projected[stableKey] = {
      ...teamConfig,
      channels: projectStableMSTeamsChannels(teamConfig.channels),
    };
  }
  return projected;
}
function parseMSTeamsTeamChannelInput(raw) {
  const trimmed = stripProviderPrefix(raw).trim();
  if (!trimmed) return {};
  const parts = trimmed.split("/");
  const team = normalizeMSTeamsTeamKey(parts[0] ?? "");
  const channel = parts.length > 1 ? normalizeMSTeamsChannelKey(parts.slice(1).join("/")) : void 0;
  return {
    ...(team ? { team } : {}),
    ...(channel ? { channel } : {}),
  };
}
function parseMSTeamsTeamEntry(raw) {
  const { team, channel } = parseMSTeamsTeamChannelInput(raw);
  if (!team) return null;
  return {
    teamKey: team,
    ...(channel ? { channelKey: channel } : {}),
  };
}
async function resolveMSTeamsChannelAllowlist(params) {
  let tokenPromise;
  const getToken = () => {
    tokenPromise ??= resolveGraphToken(params.cfg);
    return tokenPromise;
  };
  return await mapAllowlistResolutionInputs({
    inputs: params.entries,
    mapInput: async (input) => {
      const { team, channel } = parseMSTeamsTeamChannelInput(input);
      if (!team)
        return {
          input,
          resolved: false,
        };
      if (looksLikeMSTeamsThreadConversationId(team)) {
        const teamId = normalizeMSTeamsConversationTargetId(team);
        if (!channel)
          return {
            input,
            resolved: true,
            teamId,
            teamName: teamId,
          };
        if (!looksLikeMSTeamsThreadConversationId(channel))
          return {
            input,
            resolved: false,
            teamId,
            teamName: teamId,
            note: "channel id required for conversation-id team",
          };
        const channelId = normalizeMSTeamsConversationTargetId(channel);
        return {
          input,
          resolved: true,
          teamId,
          teamName: teamId,
          channelId,
          channelName: channelId,
        };
      }
      const token = await getToken();
      let teamMatch;
      if (/^[0-9a-fA-F-]{16,}$/.test(team))
        teamMatch = {
          id: team,
          displayName: team,
        };
      else {
        const result = await listTeamsByNameWithPageInfo(token, team);
        if (result.truncated)
          return {
            input,
            resolved: false,
            note: "team lookup incomplete",
          };
        const exactTeams = findExactTeams(result.items, team);
        const [exactTeam] = exactTeams;
        if (!exactTeam)
          return {
            input,
            resolved: false,
            note: "team not found",
          };
        if (exactTeams.length > 1)
          return {
            input,
            resolved: false,
            note: "team name is ambiguous",
          };
        teamMatch = exactTeam;
      }
      const graphTeamId = teamMatch.id?.trim();
      const teamName = teamMatch.displayName?.trim() || team;
      if (!graphTeamId)
        return {
          input,
          resolved: false,
          note: "team id missing",
        };
      if (!(params.teamIdMode !== "graph" || Boolean(channel)))
        return {
          input,
          resolved: true,
          teamId: graphTeamId,
          graphTeamId,
          teamName,
        };
      let teamChannels;
      try {
        const result = await listChannelsForTeamWithPageInfo(token, graphTeamId);
        if (result.truncated)
          return {
            input,
            resolved: false,
            note: "channel lookup incomplete",
          };
        teamChannels = result.items;
      } catch {
        return {
          input,
          resolved: false,
          note: "channel lookup failed",
        };
      }
      const generalChannels = findExactChannels(teamChannels, "general");
      if (params.teamIdMode !== "graph" && generalChannels.length !== 1)
        return {
          input,
          resolved: false,
          graphTeamId,
          teamName,
          note:
            generalChannels.length > 1
              ? "General channel is ambiguous"
              : "General channel not found",
        };
      const teamId = generalChannels[0]?.id?.trim() || graphTeamId;
      if (!channel)
        return {
          input,
          resolved: true,
          teamId,
          graphTeamId,
          teamName,
        };
      const channelById = teamChannels.find((item) => item.id === channel);
      const exactChannels = channelById ? [channelById] : findExactChannels(teamChannels, channel);
      if (exactChannels.length === 0)
        return {
          input,
          resolved: false,
          note: "channel not found",
        };
      if (exactChannels.length > 1)
        return {
          input,
          resolved: false,
          note: "channel name is ambiguous",
        };
      const channelMatch = exactChannels[0];
      if (!channelMatch?.id)
        return {
          input,
          resolved: false,
          note: "channel id missing",
        };
      return {
        input,
        resolved: true,
        teamId,
        graphTeamId,
        teamName,
        channelId: channelMatch.id,
        channelName: channelMatch.displayName ?? channel,
      };
    },
  });
}
async function resolveMSTeamsTeamsConfig(params) {
  const entries = [];
  const unresolved = [];
  for (const [teamKey, teamCfg] of Object.entries(params.teams)) {
    if (teamKey === "*") {
      for (const channelKey of Object.keys(teamCfg?.channels ?? {}))
        if (channelKey !== "*" && !looksLikeMSTeamsThreadConversationId(channelKey))
          unresolved.push(`${teamKey}/${channelKey}`);
      continue;
    }
    const channelKeys = Object.keys(teamCfg?.channels ?? {}).filter((key) => key !== "*");
    if (channelKeys.length === 0) {
      entries.push({
        input: teamKey,
        teamKey,
      });
      continue;
    }
    for (const channelKey of channelKeys)
      entries.push({
        input: `${teamKey}/${channelKey}`,
        teamKey,
        channelKey,
      });
  }
  if (entries.length === 0)
    return {
      teams: projectStableMSTeamsTeamsConfig(params.teams) ?? {},
      mapping: [],
      unresolved,
    };
  const resolved = await resolveMSTeamsChannelAllowlist({
    cfg: params.cfg,
    entries: entries.map((entry) => entry.input),
    teamIdMode: params.teamIdMode,
  });
  const mapping = [];
  const teams = projectStableMSTeamsTeamsConfig(params.teams) ?? {};
  resolved.forEach((entry, index) => {
    const source = entries[index];
    if (!source) return;
    const sourceTeam = params.teams[source.teamKey] ?? {};
    const resolvedTeamId = params.teamIdMode === "graph" ? entry.graphTeamId : entry.teamId;
    if (!entry.resolved || !resolvedTeamId) {
      unresolved.push(entry.input);
      return;
    }
    mapping.push(
      entry.channelId
        ? `${entry.input}→${resolvedTeamId}/${entry.channelId}`
        : `${entry.input}→${resolvedTeamId}`,
    );
    const existing = teams[resolvedTeamId] ?? {};
    const { channels: _sourceChannels, ...sourceTeamPolicy } = sourceTeam;
    const mergedChannels = {
      ...projectStableMSTeamsChannels(sourceTeam.channels),
      ...existing.channels,
    };
    const mergedTeam = {
      ...sourceTeamPolicy,
      ...existing,
      channels: mergedChannels,
    };
    teams[resolvedTeamId] = mergedTeam;
    if (source.channelKey && entry.channelId) {
      const sourceChannel = sourceTeam.channels?.[source.channelKey];
      if (sourceChannel)
        teams[resolvedTeamId] = {
          ...mergedTeam,
          channels: {
            ...mergedChannels,
            [entry.channelId]: {
              ...sourceChannel,
              ...mergedChannels?.[entry.channelId],
            },
          },
        };
    }
  });
  return {
    teams,
    mapping,
    unresolved,
  };
}
async function resolveMSTeamsUserAllowlist(params) {
  let tokenPromise;
  const getToken = () => {
    tokenPromise ??= resolveGraphToken(params.cfg);
    return tokenPromise;
  };
  return await mapAllowlistResolutionInputs({
    inputs: params.entries,
    mapInput: async (input) => {
      const query = normalizeQuery(normalizeMSTeamsUserInput(input));
      if (!query)
        return {
          input,
          resolved: false,
        };
      if (/^[0-9a-fA-F-]{16,}$/.test(query))
        return {
          input,
          resolved: true,
          id: query,
        };
      const result = await findGraphUsersByExactIdentity({
        token: await getToken(),
        query,
      });
      if (result.truncated)
        return {
          input,
          resolved: false,
          note: "user lookup incomplete",
        };
      const users = findExactUsers(result.items, query);
      const [match] = users;
      if (!match)
        return {
          input,
          resolved: false,
          note: "user not found",
        };
      if (users.length > 1)
        return {
          input,
          resolved: false,
          note: "user identity is ambiguous",
        };
      return {
        input,
        resolved: true,
        id: match.id,
        name: match.displayName ?? void 0,
      };
    },
  });
}
//#endregion
export {
  parseMSTeamsConversationId as a,
  projectStableMSTeamsTeamsConfig as c,
  resolveMSTeamsTeamsConfig as d,
  resolveMSTeamsUserAllowlist as f,
  normalizeMSTeamsUserInput as i,
  projectStableMSTeamsUserAllowlist as l,
  looksLikeMSTeamsTargetId as n,
  parseMSTeamsTeamChannelInput as o,
  normalizeMSTeamsMessagingTarget as r,
  parseMSTeamsTeamEntry as s,
  looksLikeMSTeamsConversationId as t,
  resolveMSTeamsChannelAllowlist as u,
};
