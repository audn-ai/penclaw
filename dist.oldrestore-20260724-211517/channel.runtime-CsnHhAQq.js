import {
  i as createAttachedChannelResultAdapter,
  t as attachChannelToResult,
} from "./channel-send-result-Dn_C6AJS.js";
import {
  n as formatMSTeamsSendErrorHint,
  r as formatUnknownError,
  t as classifyMSTeamsSendError,
} from "./errors-H7JG5Gly.js";
import {
  A as resolveMSTeamsSdkCloudOptions,
  C as loadMSTeamsSdkWithAuth,
  D as isAllowedBotFrameworkServiceUrl,
  E as describeBotFrameworkServiceUrlHost,
  O as normalizeBotFrameworkServiceUrl,
  S as createMSTeamsTokenProvider,
  _ as loadDelegatedTokens,
  a as fetchGraphAbsoluteUrl,
  b as readAccessToken,
  d as normalizeQuery,
  f as patchGraphJson,
  h as resolveGraphToken,
  i as escapeOData,
  j as validateMSTeamsProactiveServiceUrlBoundary,
  l as listTeamsByName,
  m as postGraphJson,
  n as searchGraphUsers,
  o as fetchGraphJson,
  p as postGraphBetaJson,
  r as deleteGraphRequest,
  s as listChannelsForTeam,
  v as resolveMSTeamsCredentials,
} from "./graph-users-s5ZqGi_X.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import { a as resolveChannelMediaMaxBytes } from "./media-runtime-BhmZORKM.js";
import {
  E as resolveMSTeamsReactionEmoji,
  T as getMSTeamsReactionEmoji,
  a as sendMSTeamsActivityWithReference,
  c as extractFilename,
  d as requireMSTeamsSharePointSiteId,
  f as uploadAndShareSharePoint,
  h as requiresFileConsent,
  i as deleteMSTeamsActivityWithReference,
  j as stripHtmlFromTeamsMessage,
  l as extractMessageId,
  m as prepareFileConsentActivityFs,
  o as updateMSTeamsActivityWithReference,
  p as buildTeamsFileInfoCard,
  r as sendMSTeamsMessages,
  t as buildConversationReference,
  u as getDriveItemProperties,
  v as setPendingUploadActivityId,
  x as setPendingUploadActivityIdFs,
} from "./messenger-CaT39Loc.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { m as isFutureDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { n as loadOutboundMediaFromUrl } from "./outbound-media-DXLWAnHG.js";
import {
  i as resolveMSTeamsRouteConfig,
  r as resolveMSTeamsReplyPolicy,
} from "./policy-BV-fZxju.js";
import {
  l as createMSTeamsPollStoreState,
  o as buildMSTeamsPollCard,
  v as createMSTeamsConversationStoreState,
} from "./polls-XDDfaapC.js";
import "./channel-outbound-DlkFd7rO.js";
import {
  n as buildMSTeamsPresentationCard,
  t as MSTEAMS_PRESENTATION_CAPABILITIES,
} from "./presentation-jacWSAn0.js";
import "./markdown-table-runtime-DkTgtzZ0.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import {
  _ as sendPayloadMediaSequence,
  h as resolveTextChunksWithFallback,
  p as resolvePayloadMediaUrls,
} from "./reply-payload-DDwHXDkv.js";
import "./runtime-api-Btu8oXbZ.js";
import { t as getMSTeamsRuntime } from "./runtime-6g-cPOGH.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as convertMarkdownTables } from "./tables-YoFSvuf8.js";
import { t as chunkTextForOutbound } from "./text-chunking-Dr19ggf-.js";
//#region extensions/msteams/src/directory-live.ts
async function listMSTeamsDirectoryPeersLive(params) {
  const query = normalizeQuery(params.query);
  if (!query) return [];
  return (
    await searchGraphUsers({
      token: await resolveGraphToken(params.cfg),
      query,
      top: typeof params.limit === "number" && params.limit > 0 ? params.limit : 20,
    })
  )
    .map((user) => {
      const id = user.id?.trim();
      if (!id) return null;
      const name = user.displayName?.trim();
      const handle = user.userPrincipalName?.trim() || user.mail?.trim();
      return {
        kind: "user",
        id: `user:${id}`,
        name: name || void 0,
        handle: handle ? `@${handle}` : void 0,
        raw: user,
      };
    })
    .filter(Boolean);
}
async function listMSTeamsDirectoryGroupsLive(params) {
  const rawQuery = normalizeQuery(params.query);
  if (!rawQuery) return [];
  const token = await resolveGraphToken(params.cfg);
  const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
  const [teamQuery, channelQuery] = rawQuery.includes("/")
    ? normalizeStringEntries(rawQuery.split("/", 2))
    : [rawQuery, null];
  const teams = await listTeamsByName(token, teamQuery);
  const results = [];
  for (const team of teams) {
    const teamId = team.id?.trim();
    if (!teamId) continue;
    const teamName = team.displayName?.trim() || teamQuery;
    if (!channelQuery) {
      results.push({
        kind: "group",
        id: `team:${teamId}`,
        name: teamName,
        handle: teamName ? `#${teamName}` : void 0,
        raw: team,
      });
      if (results.length >= limit) return results;
      continue;
    }
    const channels = await listChannelsForTeam(token, teamId);
    for (const channel of channels) {
      const name = channel.displayName?.trim();
      if (!name) continue;
      if (
        !normalizeLowercaseStringOrEmpty(name).includes(
          normalizeLowercaseStringOrEmpty(channelQuery),
        )
      )
        continue;
      results.push({
        kind: "group",
        id: `conversation:${channel.id}`,
        name: `${teamName}/${name}`,
        handle: `#${name}`,
        raw: channel,
      });
      if (results.length >= limit) return results;
    }
  }
  return results;
}
//#endregion
//#region extensions/msteams/src/graph-messages.ts
/**
 * Resolve the Graph API path prefix for a conversation.
 * If `to` contains "/" it's a `teamId/channelId` (channel path),
 * otherwise it's a chat ID.
 */
/**
 * Strip common target prefixes (`conversation:`, `user:`) so raw
 * conversation IDs can be used directly in Graph paths.
 */
function stripTargetPrefix(raw) {
  const trimmed = raw.trim();
  if (/^conversation:/i.test(trimmed)) return trimmed.slice(13).trim();
  if (/^user:/i.test(trimmed)) return trimmed.slice(5).trim();
  return trimmed;
}
/**
 * Resolve a target to a Graph-compatible conversation ID.
 * `user:<aadId>` targets are looked up in the conversation store to find the
 * actual `19:xxx@thread.*` chat ID that Graph API requires.
 * Conversation IDs and `teamId/channelId` pairs pass through unchanged.
 */
async function resolveGraphConversationId(to) {
  const trimmed = to.trim();
  const isUserTarget = /^user:/i.test(trimmed);
  const cleaned = stripTargetPrefix(trimmed);
  if (!isUserTarget) return cleaned;
  const found = await createMSTeamsConversationStoreState().findPreferredDmByUserId(cleaned);
  if (!found)
    throw new Error(
      `No conversation found for user:${cleaned}. The bot must receive a message from this user before Graph API operations work.`,
    );
  if (found.conversationId.startsWith("19:")) return found.conversationId;
  throw new Error(
    `Conversation for user:${cleaned} uses a Bot Framework ID (${found.conversationId}) that Graph API does not accept. Use a Graph-native conversation:19:... target when available.`,
  );
}
function resolveConversationPath(to) {
  const cleaned = stripTargetPrefix(to);
  const separatorIndex = cleaned.indexOf("/");
  if (separatorIndex !== -1) {
    const teamId = cleaned.slice(0, separatorIndex);
    const channelId = cleaned.slice(separatorIndex + 1).replace(/\/.*$/, "");
    return {
      kind: "channel",
      basePath: `/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}`,
      teamId,
      channelId,
    };
  }
  return {
    kind: "chat",
    basePath: `/chats/${encodeURIComponent(cleaned)}`,
    chatId: cleaned,
  };
}
/**
 * Retrieve a single message by ID from a chat or channel via Graph API.
 */
async function getMessageMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
  const msg = await fetchGraphJson({
    token,
    path: `${basePath}/messages/${encodeURIComponent(params.messageId)}`,
  });
  return {
    id: msg.id ?? params.messageId,
    text: msg.body?.content,
    from: msg.from,
    createdAt: msg.createdDateTime,
  };
}
/**
 * Pin a message in a chat conversation via Graph API.
 *
 * Chat pinning uses the v1.0 endpoint: `POST /chats/{chatId}/pinnedMessages`.
 *
 * Channel pinning uses `POST /teams/{teamId}/channels/{channelId}/pinnedMessages`.
 * **Note:** The channel pin endpoint may require the Graph beta API or specific
 * tenant-level permissions. As of March 2026, general availability is not
 * confirmed for all tenants. If the call returns 404 or 403, the endpoint may
 * not be enabled for the target tenant.
 */
async function pinMessageMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const conversationId = await resolveGraphConversationId(params.to);
  const conv = resolveConversationPath(conversationId);
  if (conv.kind === "channel")
    throw new Error(
      "Pin/unpin is not supported for channel messages on Graph v1.0. Only chat conversations support pinned messages.",
    );
  const body = {
    "message@odata.bind": `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(params.messageId)}`,
  };
  return {
    ok: true,
    pinnedMessageId: (
      await postGraphJson({
        token,
        path: `${conv.basePath}/pinnedMessages`,
        body,
      })
    ).id,
  };
}
/**
 * Unpin a message in a chat conversation via Graph API.
 * `pinnedMessageId` is the pinned-message resource ID (from pin or list-pins),
 * not the underlying chat message ID.
 *
 * Channel unpin uses `DELETE /teams/{teamId}/channels/{channelId}/pinnedMessages/{id}`.
 * See the note on {@link pinMessageMSTeams} regarding beta/GA status.
 */
async function unpinMessageMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const conv = resolveConversationPath(await resolveGraphConversationId(params.to));
  if (conv.kind === "channel")
    throw new Error(
      "Pin/unpin is not supported for channel messages on Graph v1.0. Only chat conversations support pinned messages.",
    );
  await deleteGraphRequest({
    token,
    path: `${conv.basePath}/pinnedMessages/${encodeURIComponent(params.pinnedMessageId)}`,
  });
  return { ok: true };
}
/** Maximum number of pagination pages to follow to avoid unbounded loops. */
const LIST_PINS_MAX_PAGES = 10;
/**
 * List all pinned messages in a chat conversation via Graph API.
 * Follows `@odata.nextLink` pagination to collect the full pin set.
 *
 * Channel list-pins uses the same endpoint pattern as channel pin/unpin.
 * See the note on {@link pinMessageMSTeams} regarding beta/GA status.
 */
async function listPinsMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const conv = resolveConversationPath(await resolveGraphConversationId(params.to));
  if (conv.kind === "channel")
    throw new Error(
      "Listing pinned messages is not supported for channels on Graph v1.0. Only chat conversations support pinned messages.",
    );
  const path = `${conv.basePath}/pinnedMessages?$expand=message`;
  const allPins = [];
  let res = await fetchGraphJson({
    token,
    path,
  });
  let pages = 1;
  while (true) {
    for (const pin of res.value ?? [])
      allPins.push({
        id: pin.id ?? "",
        pinnedMessageId: pin.id ?? "",
        messageId: pin.message?.id,
        text: pin.message?.body?.content,
      });
    const nextLink = res["@odata.nextLink"];
    if (!nextLink || pages >= LIST_PINS_MAX_PAGES) break;
    res = await fetchGraphAbsoluteUrl({
      token,
      url: nextLink,
    });
    pages++;
  }
  return { pins: allPins };
}
/**
 * Add an emoji reaction to a message via Graph API (beta).
 *
 * Writes (setReaction) require a Delegated token, so we pass
 * `preferDelegated: true`. The resolver falls back to the app-only token when
 * delegated auth is not configured, preserving today's behavior while letting
 * delegated-auth-enabled deployments hit the user-scoped endpoint.
 */
async function reactMessageMSTeams(params) {
  const reactionType = resolveMSTeamsReactionEmoji(params.reactionType);
  const token = await resolveGraphToken(params.cfg, { preferDelegated: true });
  const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
  await postGraphBetaJson({
    token,
    path: `${basePath}/messages/${encodeURIComponent(params.messageId)}/setReaction`,
    body: { reactionType },
  });
  return { ok: true };
}
/**
 * Remove an emoji reaction from a message via Graph API (beta).
 *
 * Writes (unsetReaction) require a Delegated token, so we pass
 * `preferDelegated: true`. See `reactMessageMSTeams` for fallback rules.
 */
async function unreactMessageMSTeams(params) {
  const reactionType = resolveMSTeamsReactionEmoji(params.reactionType);
  const token = await resolveGraphToken(params.cfg, { preferDelegated: true });
  const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
  await postGraphBetaJson({
    token,
    path: `${basePath}/messages/${encodeURIComponent(params.messageId)}/unsetReaction`,
    body: { reactionType },
  });
  return { ok: true };
}
/**
 * List reactions on a message, grouped by type.
 * Uses Graph v1.0 (reactions are included in the message resource).
 */
async function listReactionsMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
  const msg = await fetchGraphJson({
    token,
    path: `${basePath}/messages/${encodeURIComponent(params.messageId)}`,
  });
  const grouped = /* @__PURE__ */ new Map();
  for (const reaction of msg.reactions ?? []) {
    const type = reaction.reactionType ?? "unknown";
    if (!grouped.has(type))
      grouped.set(type, {
        count: 0,
        users: [],
      });
    const group = grouped.get(type);
    group.count++;
    if (reaction.user?.id)
      group.users.push({
        id: reaction.user.id,
        displayName: reaction.user.displayName,
      });
  }
  return {
    reactions: Array.from(grouped.entries()).map(([type, group]) => ({
      reactionType: type,
      name: type,
      emoji: getMSTeamsReactionEmoji(type),
      count: group.count,
      users: group.users,
    })),
  };
}
const SEARCH_DEFAULT_LIMIT = 25;
const SEARCH_MAX_LIMIT = 50;
const SEARCH_PAGE_SIZE = 50;
const SEARCH_MAX_PAGES = 10;
function normalizeSearchText(message) {
  const content = message.body?.content ?? "";
  return message.body?.contentType?.toLowerCase() === "html"
    ? stripHtmlFromTeamsMessage(content)
    : content.trim();
}
function matchesSearchSender(message, from) {
  const normalized = from?.trim().toLowerCase();
  if (!normalized) return true;
  const sender = message.from?.user ?? message.from?.application;
  return [sender?.id, sender?.displayName].some(
    (value) => value?.trim().toLowerCase() === normalized,
  );
}
/**
 * Search messages within one already-authorized chat or channel.
 * Graph does not support collection `$search` here, so filter bounded pages
 * locally without widening the read to the account's global message index.
 */
async function searchMessagesMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
  const rawLimit = params.limit ?? SEARCH_DEFAULT_LIMIT;
  const top = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), SEARCH_MAX_LIMIT)
    : SEARCH_DEFAULT_LIMIT;
  const query = params.query.trim().toLowerCase();
  const messages = [];
  let nextUrl;
  let truncated = false;
  for (let page = 0; page < SEARCH_MAX_PAGES; page++) {
    const response = nextUrl
      ? await fetchGraphAbsoluteUrl({
          token,
          url: nextUrl,
        })
      : await fetchGraphJson({
          token,
          path: `${basePath}/messages?$top=${SEARCH_PAGE_SIZE}`,
        });
    for (const message of response.value ?? [])
      if (
        normalizeSearchText(message).toLowerCase().includes(query) &&
        matchesSearchSender(message, params.from)
      ) {
        if (messages.length >= top)
          return {
            messages,
            truncated: true,
          };
        messages.push({
          id: message.id ?? "",
          text: message.body?.content,
          from: message.from,
          createdAt: message.createdDateTime,
        });
      }
    nextUrl = response["@odata.nextLink"];
    if (messages.length >= top)
      return {
        messages,
        truncated: Boolean(nextUrl),
      };
    if (!nextUrl)
      return {
        messages,
        truncated: false,
      };
    truncated = page === SEARCH_MAX_PAGES - 1;
  }
  return {
    messages,
    truncated,
  };
}
//#endregion
//#region extensions/msteams/src/graph-conversation-members.ts
const MAX_CONVERSATION_MEMBER_PAGES = 100;
async function findMSTeamsConversationMember(params) {
  const conversationId = await resolveGraphConversationId(params.to);
  const conversation = resolveConversationPath(conversationId);
  const collection =
    conversation.kind === "channel" && params.includeIndirectChannelMembers
      ? "allMembers"
      : "members";
  let nextPath = `${conversation.basePath}/${collection}`;
  let pages = 0;
  let member;
  while (nextPath && pages < MAX_CONVERSATION_MEMBER_PAGES && !member) {
    const response = await fetchGraphJson({
      token: params.token,
      path: nextPath,
    });
    const userId = params.userId.trim().toLowerCase();
    member = (response.value ?? []).find(
      (candidate) =>
        candidate.userId?.trim().toLowerCase() === userId ||
        candidate.email?.trim().toLowerCase() === userId,
    );
    nextPath = response["@odata.nextLink"]?.replace("https://graph.microsoft.com/v1.0", "");
    pages += 1;
  }
  if (nextPath && !member)
    throw new Error("MS Teams conversation member pagination limit exceeded");
  return {
    conversationId,
    member,
  };
}
//#endregion
//#region extensions/msteams/src/graph-group-management.ts
function normalizeConversationMemberRole(role) {
  const normalized = role?.trim().toLowerCase() ?? "";
  if (!normalized) return "member";
  if (normalized === "member" || normalized === "owner") return normalized;
  throw new Error('MS Teams participant role must be "member" or "owner".');
}
function resolveConversationMemberRoles(role, kind) {
  const normalized = normalizeConversationMemberRole(role);
  if (kind === "chat") return ["owner"];
  return normalized === "owner" ? ["owner"] : [];
}
/**
 * Add a user to a chat or channel via Graph API.
 */
async function addParticipantMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const conversationId = await resolveGraphConversationId(params.to);
  const conv = resolveConversationPath(conversationId);
  const body = {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    roles: resolveConversationMemberRoles(params.role, conv.kind),
    "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${escapeOData(params.userId)}')`,
  };
  await postGraphJson({
    token,
    path: `${conv.basePath}/members`,
    body,
  });
  return {
    added: {
      userId: params.userId,
      chatId: conversationId,
    },
  };
}
/**
 * Remove a user from a chat or channel via Graph API.
 * Lists members first to resolve the membership ID, then deletes.
 */
async function removeParticipantMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const { conversationId, member } = await findMSTeamsConversationMember({
    token,
    to: params.to,
    userId: params.userId,
  });
  if (!member?.id) throw new Error(`User ${params.userId} is not a member of this conversation`);
  await deleteGraphRequest({
    token,
    path: `${resolveConversationPath(conversationId).basePath}/members/${encodeURIComponent(member.id)}`,
  });
  return {
    removed: {
      userId: params.userId,
      chatId: conversationId,
    },
  };
}
/**
 * Rename a chat (topic) or channel (displayName) via Graph API.
 */
async function renameGroupMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const conversationId = await resolveGraphConversationId(params.to);
  const conv = resolveConversationPath(conversationId);
  const body = conv.kind === "chat" ? { topic: params.name } : { displayName: params.name };
  await patchGraphJson({
    token,
    path: conv.basePath,
    body,
  });
  return {
    renamed: {
      chatId: conversationId,
      newName: params.name,
    },
  };
}
//#endregion
//#region extensions/msteams/src/graph-members.ts
const MAX_TEAM_MEMBER_PAGES = 100;
function normalizeUserId(value) {
  return (
    value
      ?.replace(/^(msteams|teams|user):/i, "")
      .trim()
      .toLowerCase() ?? ""
  );
}
async function findStandardChannelMember(params) {
  const conversation = resolveConversationPath(await resolveGraphConversationId(params.to));
  if (conversation.kind !== "channel" || !conversation.teamId) return;
  if (
    (
      await fetchGraphJson({
        token: params.token,
        path: `${conversation.basePath}?$select=membershipType`,
      })
    ).membershipType !== "standard"
  )
    throw new Error(
      "Microsoft Teams member-info requires a standard channel when using the configured permission baseline.",
    );
  const requestedUserId = normalizeUserId(params.userId);
  let nextPath = `/teams/${encodeURIComponent(conversation.teamId)}/members`;
  let pages = 0;
  while (nextPath && pages < MAX_TEAM_MEMBER_PAGES) {
    const response = await fetchGraphJson({
      token: params.token,
      path: nextPath,
    });
    const member = (response.value ?? []).find(
      (candidate) =>
        normalizeUserId(candidate.userId) === requestedUserId ||
        normalizeUserId(candidate.email) === requestedUserId,
    );
    if (member) return member;
    nextPath = response["@odata.nextLink"]?.replace("https://graph.microsoft.com/v1.0", "");
    pages += 1;
  }
  if (nextPath) throw new Error("Microsoft Teams team member pagination limit exceeded");
}
/**
 * Fetch a user profile from Microsoft Graph by user ID.
 */
async function getMemberInfoMSTeams(params) {
  if (
    normalizeUserId(params.userId) === normalizeUserId(params.currentRequesterId) &&
    resolveConversationPath(params.to).kind === "chat"
  )
    return {
      user: {
        id: params.currentRequesterId ?? void 0,
        displayName: void 0,
        mail: void 0,
        jobTitle: void 0,
        userPrincipalName: void 0,
        officeLocation: void 0,
        roles: [],
      },
    };
  const member =
    resolveConversationPath(await resolveGraphConversationId(params.to)).kind === "channel"
      ? await findStandardChannelMember({
          token: await resolveGraphToken(params.cfg),
          to: params.to,
          userId: params.userId,
        })
      : void 0;
  if (!member?.userId)
    throw new Error(`User ${params.userId} is not a member of this conversation`);
  return {
    user: {
      id: member.userId,
      displayName: member.displayName,
      mail: member.email,
      jobTitle: void 0,
      userPrincipalName: member.email,
      officeLocation: void 0,
      roles: member.roles ?? [],
    },
  };
}
//#endregion
//#region extensions/msteams/src/graph-teams.ts
/**
 * List channels in a team via Graph API.
 * Returns id, displayName, description, and membershipType for each channel.
 * Follows @odata.nextLink for paginated results (up to 10 pages).
 */
async function listChannelsMSTeams(params) {
  const token = await resolveGraphToken(params.cfg);
  const firstPath = `/teams/${encodeURIComponent(params.teamId)}/channels?$select=id,displayName,description,membershipType`;
  const collected = [];
  let nextPath = firstPath;
  const MAX_PAGES = 10;
  let page = 0;
  while (nextPath && page < MAX_PAGES) {
    const res = await fetchGraphJson({
      token,
      path: nextPath,
    });
    collected.push(...(res.value ?? []));
    const nextLink = res["@odata.nextLink"];
    nextPath = nextLink ? nextLink.replace("https://graph.microsoft.com/v1.0", "") : void 0;
    page++;
  }
  return {
    channels: collected.map((ch) => ({
      id: ch.id,
      displayName: ch.displayName,
      description: ch.description,
      membershipType: ch.membershipType,
    })),
    truncated: Boolean(nextPath),
  };
}
/**
 * Get detailed information about a single channel in a team via Graph API.
 * Returns id, displayName, description, membershipType, webUrl, and createdDateTime.
 */
async function getChannelInfoMSTeams(params) {
  const ch = await fetchGraphJson({
    token: await resolveGraphToken(params.cfg),
    path: `/teams/${encodeURIComponent(params.teamId)}/channels/${encodeURIComponent(params.channelId)}?$select=id,displayName,description,membershipType,webUrl,createdDateTime`,
  });
  return {
    channel: {
      id: ch.id,
      displayName: ch.displayName,
      description: ch.description,
      membershipType: ch.membershipType,
      webUrl: ch.webUrl,
      createdDateTime: ch.createdDateTime,
    },
  };
}
//#endregion
//#region extensions/msteams/src/send-context.ts
function resolveMSTeamsProactiveReplyStyle(params) {
  const threadRootId = params.ref.threadId ?? params.ref.activityId;
  if (params.conversationType !== "channel" || !threadRootId) return "top-level";
  const routeConfig = resolveMSTeamsRouteConfig({
    cfg: params.cfg,
    teamId: params.ref.teamId,
    conversationId: params.conversationId,
    allowNameMatching: false,
  });
  const { replyStyle } = resolveMSTeamsReplyPolicy({
    isDirectMessage: false,
    globalConfig: params.cfg,
    teamConfig: routeConfig.teamConfig,
    channelConfig: routeConfig.channelConfig,
  });
  return replyStyle;
}
/**
 * Parse the target value into a conversation reference lookup key.
 * Supported formats:
 * - conversation:19:abc@thread.tacv2 → lookup by conversation ID
 * - user:aad-object-id → lookup by user AAD object ID
 * - 19:abc@thread.tacv2 → direct conversation ID
 */
function parseRecipient(to) {
  const trimmed = to.trim();
  const finalize = (type, id) => {
    const normalized = id.trim();
    if (!normalized) throw new Error(`Invalid target value: missing ${type} id`);
    return {
      type,
      id: normalized,
    };
  };
  if (trimmed.startsWith("conversation:")) return finalize("conversation", trimmed.slice(13));
  if (trimmed.startsWith("user:")) return finalize("user", trimmed.slice(5));
  if (trimmed.startsWith("19:") || trimmed.includes("@thread"))
    return finalize("conversation", trimmed);
  return finalize("user", trimmed);
}
/**
 * Find a stored conversation reference for the given recipient.
 */
async function findConversationReference(recipient) {
  if (recipient.type === "conversation") {
    const ref = await recipient.store.get(recipient.id);
    if (ref)
      return {
        conversationId: recipient.id,
        ref,
      };
    return null;
  }
  const found = await recipient.store.findPreferredDmByUserId(recipient.id);
  if (!found) return null;
  return {
    conversationId: found.conversationId,
    ref: found.reference,
  };
}
async function resolveMSTeamsSendContext(params) {
  const msteamsCfg = params.cfg.channels?.msteams;
  if (!msteamsCfg?.enabled) throw new Error("msteams provider is not enabled");
  const creds = resolveMSTeamsCredentials(msteamsCfg);
  if (!creds) throw new Error("msteams credentials not configured");
  const store = createMSTeamsConversationStoreState();
  const recipient = parseRecipient(params.to);
  const found = await findConversationReference({
    ...recipient,
    store,
  });
  if (!found)
    throw new Error(
      `No conversation reference found for ${recipient.type}:${recipient.id}. The bot must receive a message from this conversation before it can send proactively.`,
    );
  const { conversationId, ref } = found;
  const log = getMSTeamsRuntime().logging.getChildLogger({ name: "msteams:send" });
  if (ref.serviceUrl && !isAllowedBotFrameworkServiceUrl(ref.serviceUrl)) {
    try {
      await store.remove(conversationId);
    } catch (err) {
      log.warn?.("failed to remove blocked msteams conversation reference", {
        conversationId,
        error: formatUnknownError(err),
      });
    }
    throw new Error(
      `Stored Microsoft Teams conversation reference has blocked serviceUrl host: ${describeBotFrameworkServiceUrlHost(ref.serviceUrl)}. The bot must receive a new message from this conversation before it can send proactively.`,
    );
  }
  const safeRef = ref.serviceUrl
    ? {
        ...ref,
        serviceUrl: normalizeBotFrameworkServiceUrl(ref.serviceUrl),
      }
    : ref;
  if (recipient.type === "user") {
    const resolvedType = normalizeLowercaseStringOrEmpty(
      safeRef.conversation?.conversationType ?? "",
    );
    if (resolvedType && resolvedType !== "personal")
      throw new Error(
        `Conversation reference for user:${recipient.id} resolved to a ${resolvedType} conversation (${conversationId}) instead of a personal DM. The bot must receive a DM from this user before it can send proactively.`,
      );
  }
  const sdkCloudOptions = resolveMSTeamsSdkCloudOptions(msteamsCfg);
  const { app } = await loadMSTeamsSdkWithAuth(creds, sdkCloudOptions);
  validateMSTeamsProactiveServiceUrlBoundary({
    cloud: sdkCloudOptions.cloud,
    conversationId,
    storedServiceUrl: safeRef.serviceUrl,
    configuredServiceUrl: sdkCloudOptions.serviceUrl,
  });
  const tokenProvider = createMSTeamsTokenProvider(app);
  const storedConversationType = normalizeLowercaseStringOrEmpty(
    safeRef.conversation?.conversationType ?? "",
  );
  let conversationType;
  if (storedConversationType === "personal") conversationType = "personal";
  else if (storedConversationType === "channel") conversationType = "channel";
  else conversationType = "groupChat";
  const replyStyle = resolveMSTeamsProactiveReplyStyle({
    cfg: msteamsCfg,
    conversationId,
    ref: safeRef,
    conversationType,
  });
  const sharePointSiteId = msteamsCfg.sharePointSiteId;
  const mediaMaxBytes = resolveChannelMediaMaxBytes({
    cfg: params.cfg,
    resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb,
  });
  return {
    appId: creds.appId,
    conversationId,
    ref: safeRef,
    app,
    log,
    conversationType,
    replyStyle,
    sdkCloudOptions,
    tokenProvider,
    sharePointSiteId,
    mediaMaxBytes,
  };
}
//#endregion
//#region extensions/msteams/src/send.ts
/** Threshold for large files that require FileConsentCard flow in personal chats */
const FILE_CONSENT_THRESHOLD_BYTES = 4 * 1024 * 1024;
/**
 * MSTeams-specific media size limit (100MB).
 * Higher than the default to support Teams file-consent and SharePoint uploads.
 */
const MSTEAMS_MAX_MEDIA_BYTES = 100 * 1024 * 1024;
function createMSTeamsSendReceipt(params) {
  const receipt = createMessageReceiptFromOutboundResults({
    kind: params.kind,
    results: params.platformMessageIds.map((messageId) => ({
      channel: "msteams",
      messageId,
      conversationId: params.conversationId,
    })),
  });
  if (!params.kinds) return receipt;
  const kinds = params.kinds;
  return {
    ...receipt,
    parts: receipt.parts.map((part, index) => {
      const nextPart = {
        platformMessageId: part.platformMessageId,
        kind: kinds[index] ?? params.kind,
        index: part.index,
      };
      if (part.threadId) nextPart.threadId = part.threadId;
      if (part.replyToId) nextPart.replyToId = part.replyToId;
      if (part.raw) nextPart.raw = part.raw;
      return nextPart;
    }),
  };
}
function createMSTeamsSendResult(params) {
  const platformMessageIds = (
    params.platformMessageIds?.length ? [...params.platformMessageIds] : [params.messageId]
  )
    .map((messageId) => messageId.trim())
    .filter((messageId) => messageId && messageId !== "unknown");
  return {
    messageId: params.messageId,
    conversationId: params.conversationId,
    receipt: createMSTeamsSendReceipt({
      conversationId: params.conversationId,
      platformMessageIds,
      kind: params.kind,
    }),
    ...(params.pendingUploadId ? { pendingUploadId: params.pendingUploadId } : {}),
  };
}
/**
 * Send a message to a Teams conversation or user.
 *
 * Uses the stored ConversationReference from previous interactions.
 * The bot must have received at least one message from the conversation
 * before proactive messaging works.
 *
 * File handling by conversation type:
 * - Personal (1:1) chats: small images (<4MB) use base64, large files and non-images use FileConsentCard
 * - Group chats / channels: files require configured SharePoint storage
 */
async function sendMessageMSTeams(params) {
  const { cfg, to, text, mediaUrl, filename, mediaLocalRoots, mediaReadFile } = params;
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "msteams",
  });
  const messageText = convertMarkdownTables(text ?? "", tableMode);
  const ctx = await resolveMSTeamsSendContext({
    cfg,
    to,
  });
  const {
    app,
    conversationId,
    ref,
    log,
    conversationType,
    tokenProvider,
    sharePointSiteId,
    sdkCloudOptions,
  } = ctx;
  log.debug?.("sending proactive message", {
    conversationId,
    conversationType,
    textLength: messageText.length,
    hasMedia: Boolean(mediaUrl),
  });
  if (mediaUrl) {
    const media = await loadOutboundMediaFromUrl(mediaUrl, {
      maxBytes: ctx.mediaMaxBytes ?? MSTEAMS_MAX_MEDIA_BYTES,
      mediaLocalRoots,
      mediaReadFile,
    });
    const isLargeFile = media.buffer.length >= FILE_CONSENT_THRESHOLD_BYTES;
    const isImage = media.contentType?.startsWith("image/") ?? false;
    const fallbackFileName = await extractFilename(mediaUrl);
    const fileName = filename?.trim() || media.fileName || fallbackFileName;
    log.debug?.("processing media", {
      fileName,
      contentType: media.contentType,
      size: media.buffer.length,
      isLargeFile,
      isImage,
      conversationType,
    });
    if (
      requiresFileConsent({
        conversationType,
        contentType: media.contentType,
        bufferSize: media.buffer.length,
        thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES,
      })
    ) {
      const { activity, uploadId } = await prepareFileConsentActivityFs({
        media: {
          buffer: media.buffer,
          filename: fileName,
          contentType: media.contentType,
        },
        conversationId,
        description: messageText || void 0,
      });
      log.debug?.("sending file consent card", {
        uploadId,
        fileName,
        size: media.buffer.length,
      });
      const messageId = await sendProactiveActivity({
        app,
        ref,
        activity,
        errorPrefix: "msteams consent card send",
        serviceUrlBoundary: sdkCloudOptions,
      });
      setPendingUploadActivityId(uploadId, messageId);
      await setPendingUploadActivityIdFs(uploadId, messageId);
      log.info("sent file consent card", {
        conversationId,
        messageId,
        uploadId,
      });
      return createMSTeamsSendResult({
        messageId,
        conversationId,
        kind: "card",
        pendingUploadId: uploadId,
      });
    }
    if (conversationType === "personal") {
      const base64 = media.buffer.toString("base64");
      return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`);
    }
    if (isImage && !sharePointSiteId) {
      const base64 = media.buffer.toString("base64");
      return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`);
    }
    try {
      const siteId = requireMSTeamsSharePointSiteId(sharePointSiteId);
      log.debug?.("uploading to SharePoint for native file card", {
        fileName,
        conversationType,
        siteId,
      });
      const uploaded = await uploadAndShareSharePoint({
        buffer: media.buffer,
        filename: fileName,
        contentType: media.contentType,
        tokenProvider,
        siteId,
        chatId: conversationId,
        usePerUserSharing: conversationType === "groupChat",
      });
      log.debug?.("SharePoint upload complete", {
        itemId: uploaded.itemId,
        shareUrl: uploaded.shareUrl,
      });
      const driveItem = await getDriveItemProperties({
        siteId,
        itemId: uploaded.itemId,
        tokenProvider,
      });
      log.debug?.("driveItem properties retrieved", {
        eTag: driveItem.eTag,
        webDavUrl: driveItem.webDavUrl,
      });
      const fileCardAttachment = buildTeamsFileInfoCard(driveItem);
      const messageId = await sendProactiveActivityRaw({
        app,
        ref,
        activity: {
          type: "message",
          text: messageText || void 0,
          attachments: [fileCardAttachment],
        },
        serviceUrlBoundary: sdkCloudOptions,
      });
      log.info("sent native file card", {
        conversationId,
        messageId,
        fileName: driveItem.name,
      });
      return createMSTeamsSendResult({
        messageId,
        conversationId,
        kind: "media",
      });
    } catch (err) {
      const classification = classifyMSTeamsSendError(err);
      const hint = formatMSTeamsSendErrorHint(classification);
      const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
      throw new Error(
        `msteams file send failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`,
        { cause: err },
      );
    }
  }
  return sendTextWithMedia(ctx, messageText, void 0);
}
/**
 * Send a text message with optional base64 media URL.
 */
async function sendTextWithMedia(ctx, text, mediaUrl) {
  const {
    app,
    appId,
    conversationId,
    ref,
    log,
    tokenProvider,
    sharePointSiteId,
    mediaMaxBytes,
    replyStyle,
  } = ctx;
  const messages =
    text && mediaUrl
      ? [{ text }, { mediaUrl }]
      : [
          {
            text: text || void 0,
            mediaUrl,
          },
        ];
  let platformMessageIds;
  try {
    platformMessageIds = await sendMSTeamsMessages({
      replyStyle,
      app,
      appId,
      conversationRef: ref,
      messages,
      retry: {},
      onRetry: (event) => {
        log.debug?.("retrying send", {
          conversationId,
          ...event,
        });
      },
      tokenProvider,
      sharePointSiteId,
      mediaMaxBytes,
      serviceUrlBoundary: ctx.sdkCloudOptions,
    });
  } catch (err) {
    const classification = classifyMSTeamsSendError(err);
    const hint = formatMSTeamsSendErrorHint(classification);
    const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
    throw new Error(
      `msteams send failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`,
      { cause: err },
    );
  }
  const messageId = platformMessageIds[0] ?? "unknown";
  log.info("sent proactive message", {
    conversationId,
    messageId,
  });
  return {
    messageId,
    conversationId,
    receipt: createMSTeamsSendReceipt({
      conversationId,
      platformMessageIds,
      kind: mediaUrl ? "media" : "text",
      ...(text && mediaUrl ? { kinds: ["text", "media"] } : {}),
    }),
  };
}
async function sendProactiveActivityRaw({ app, ref, activity, serviceUrlBoundary }) {
  return (
    extractMessageId(
      await sendMSTeamsActivityWithReference(app, buildConversationReference(ref), activity, {
        serviceUrlBoundary,
      }),
    ) ?? "unknown"
  );
}
async function sendProactiveActivity({ app, ref, activity, errorPrefix, serviceUrlBoundary }) {
  try {
    return await sendProactiveActivityRaw({
      app,
      ref,
      activity,
      serviceUrlBoundary,
    });
  } catch (err) {
    const classification = classifyMSTeamsSendError(err);
    const hint = formatMSTeamsSendErrorHint(classification);
    const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
    throw new Error(
      `${errorPrefix} failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`,
      { cause: err },
    );
  }
}
/**
 * Send a poll (Adaptive Card) to a Teams conversation or user.
 */
async function sendPollMSTeams(params) {
  const { cfg, to, question, options, maxSelections } = params;
  const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
    cfg,
    to,
  });
  const pollCard = buildMSTeamsPollCard({
    question,
    options,
    maxSelections,
  });
  log.debug?.("sending poll", {
    conversationId,
    pollId: pollCard.pollId,
    optionCount: pollCard.options.length,
  });
  const messageId = await sendProactiveActivity({
    app,
    ref,
    activity: {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: pollCard.card,
        },
      ],
    },
    errorPrefix: "msteams poll send",
    serviceUrlBoundary: sdkCloudOptions,
  });
  log.info("sent poll", {
    conversationId,
    pollId: pollCard.pollId,
    messageId,
  });
  return {
    pollId: pollCard.pollId,
    messageId,
    conversationId,
  };
}
/**
 * Send an arbitrary Adaptive Card to a Teams conversation or user.
 */
async function sendAdaptiveCardMSTeams(params) {
  const { cfg, to, card } = params;
  const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
    cfg,
    to,
  });
  log.debug?.("sending adaptive card", {
    conversationId,
    cardType: card.type,
    cardVersion: card.version,
  });
  const messageId = await sendProactiveActivity({
    app,
    ref,
    activity: {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: card,
        },
      ],
    },
    errorPrefix: "msteams card send",
    serviceUrlBoundary: sdkCloudOptions,
  });
  log.info("sent adaptive card", {
    conversationId,
    messageId,
  });
  return {
    messageId,
    conversationId,
  };
}
/**
 * Edit (update) a previously sent message in a Teams conversation.
 *
 * Uses the Bot Framework REST API for proactive edits outside of the
 * original turn context.
 */
async function editMessageMSTeams(params) {
  const { cfg, to, activityId, text } = params;
  const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
    cfg,
    to,
  });
  log.debug?.("editing proactive message", {
    conversationId,
    activityId,
    textLength: text.length,
  });
  try {
    await updateMSTeamsActivityWithReference(
      app,
      buildConversationReference(ref),
      activityId,
      {
        type: "message",
        id: activityId,
        text,
      },
      { serviceUrlBoundary: sdkCloudOptions },
    );
  } catch (err) {
    const classification = classifyMSTeamsSendError(err);
    const hint = formatMSTeamsSendErrorHint(classification);
    const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
    throw new Error(
      `msteams edit failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`,
      { cause: err },
    );
  }
  log.info("edited proactive message", {
    conversationId,
    activityId,
  });
  return { conversationId };
}
/**
 * Delete a previously sent message in a Teams conversation.
 *
 * Uses the Bot Framework REST API for proactive deletes outside of the
 * original turn context.
 */
async function deleteMessageMSTeams(params) {
  const { cfg, to, activityId } = params;
  const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
    cfg,
    to,
  });
  log.debug?.("deleting proactive message", {
    conversationId,
    activityId,
  });
  try {
    await deleteMSTeamsActivityWithReference(app, buildConversationReference(ref), activityId, {
      serviceUrlBoundary: sdkCloudOptions,
    });
  } catch (err) {
    const classification = classifyMSTeamsSendError(err);
    const hint = formatMSTeamsSendErrorHint(classification);
    const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
    throw new Error(
      `msteams delete failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`,
      { cause: err },
    );
  }
  log.info("deleted proactive message", {
    conversationId,
    activityId,
  });
  return { conversationId };
}
//#endregion
//#region extensions/msteams/src/outbound.ts
function asObjectRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
const MSTEAMS_TEXT_CHUNK_LIMIT = 4e3;
function resolveMSTeamsTextSend(params) {
  return (
    resolveOutboundSendDep(params.deps, "msteams") ??
    ((to, text) =>
      sendMessageMSTeams({
        cfg: params.cfg,
        to,
        text,
      }))
  );
}
function resolveMSTeamsMediaSend(params) {
  return (
    resolveOutboundSendDep(params.deps, "msteams") ??
    ((to, text, opts) =>
      sendMessageMSTeams({
        cfg: params.cfg,
        to,
        text,
        mediaUrl: opts?.mediaUrl,
        mediaLocalRoots: opts?.mediaLocalRoots,
        mediaReadFile: opts?.mediaReadFile,
      }))
  );
}
const msteamsOutbound = {
  deliveryMode: "direct",
  chunker: chunkTextForOutbound,
  chunkerMode: "markdown",
  textChunkLimit: MSTEAMS_TEXT_CHUNK_LIMIT,
  pollMaxOptions: 12,
  deliveryCapabilities: {
    durableFinal: {
      text: true,
      media: true,
      payload: true,
      messageSendingHooks: true,
    },
  },
  presentationCapabilities: MSTEAMS_PRESENTATION_CAPABILITIES,
  renderPresentation: ({ payload, presentation }) => {
    if (payload.mediaUrl || payload.mediaUrls?.length) return null;
    const card = buildMSTeamsPresentationCard({
      presentation,
      text: payload.text,
    });
    const msteamsData = asObjectRecord(payload.channelData?.msteams) ?? {};
    return {
      ...payload,
      channelData: {
        ...payload.channelData,
        msteams: {
          ...msteamsData,
          presentationCard: card,
        },
      },
    };
  },
  sendPayload: async ({
    cfg,
    to,
    text,
    mediaUrl,
    mediaLocalRoots,
    mediaReadFile,
    payload,
    deps,
    onDeliveryResult,
  }) => {
    const presentationCard = asObjectRecord(payload.channelData?.msteams)?.presentationCard;
    if (
      presentationCard &&
      typeof presentationCard === "object" &&
      !Array.isArray(presentationCard)
    )
      return attachChannelToResult(
        "msteams",
        await sendAdaptiveCardMSTeams({
          cfg,
          to,
          card: presentationCard,
        }),
      );
    const mediaUrls = normalizeStringEntries(
      resolvePayloadMediaUrls({
        ...payload,
        mediaUrl: payload.mediaUrl ?? mediaUrl,
      }),
    );
    if (mediaUrls.length > 0) {
      const send = resolveMSTeamsMediaSend({
        cfg,
        deps,
      });
      const result = await sendPayloadMediaSequence({
        text,
        mediaUrls,
        onResult: async (deliveryResult) => {
          await onDeliveryResult?.(attachChannelToResult("msteams", deliveryResult));
        },
        send: async ({ text: textLocal, mediaUrl: mediaUrlLocal }) =>
          await send(to, textLocal, {
            mediaUrl: mediaUrlLocal,
            mediaLocalRoots,
            mediaReadFile,
          }),
      });
      if (result) return attachChannelToResult("msteams", result);
    }
    if (text.trim()) {
      const send = resolveMSTeamsTextSend({
        cfg,
        deps,
      });
      const chunks = resolveTextChunksWithFallback(
        text,
        chunkTextForOutbound(text, MSTEAMS_TEXT_CHUNK_LIMIT),
      );
      let result;
      for (const chunk of chunks) {
        result = await send(to, chunk);
        await onDeliveryResult?.(attachChannelToResult("msteams", result));
      }
      return attachChannelToResult("msteams", result);
    }
    throw new Error("MS Teams payload send requires text, media, or a presentation card.");
  },
  ...createAttachedChannelResultAdapter({
    channel: "msteams",
    sendText: async ({ cfg, to, text, deps }) => {
      return await resolveMSTeamsTextSend({
        cfg,
        deps,
      })(to, text);
    },
    sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, mediaReadFile, deps }) => {
      return await resolveMSTeamsMediaSend({
        cfg,
        deps,
      })(to, text, {
        mediaUrl,
        mediaLocalRoots,
        mediaReadFile,
      });
    },
    sendPoll: async ({ cfg, to, poll }) => {
      const maxSelections = poll.maxSelections ?? 1;
      const result = await sendPollMSTeams({
        cfg,
        to,
        question: poll.question,
        options: poll.options,
        maxSelections,
      });
      await createMSTeamsPollStoreState().createPoll({
        id: result.pollId,
        question: poll.question,
        options: poll.options,
        maxSelections,
        createdAt: /* @__PURE__ */ new Date().toISOString(),
        conversationId: result.conversationId,
        messageId: result.messageId,
        votes: {},
      });
      return result;
    },
  }),
};
//#endregion
//#region extensions/msteams/src/probe.ts
function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payload = parts[1] ?? "";
  const normalized = payload
    .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  try {
    const decoded = Buffer.from(normalized, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function readStringArray(value) {
  if (!Array.isArray(value)) return;
  const out = normalizeStringEntries(value);
  return out.length > 0 ? out : void 0;
}
function readScopes(value) {
  if (typeof value !== "string") return;
  const out = normalizeStringEntries(value.split(/\s+/));
  return out.length > 0 ? out : void 0;
}
async function probeMSTeams(cfg) {
  const creds = resolveMSTeamsCredentials(cfg);
  if (!creds)
    return {
      ok: false,
      error: "missing credentials (appId, appPassword, tenantId)",
    };
  try {
    const { app } = await loadMSTeamsSdkWithAuth(creds, resolveMSTeamsSdkCloudOptions(cfg));
    const tokenProvider = createMSTeamsTokenProvider(app);
    if (!(await tokenProvider.getAccessToken("https://api.botframework.com")))
      throw new Error("Failed to acquire bot token");
    let graph;
    try {
      const accessToken = readAccessToken(
        await tokenProvider.getAccessToken("https://graph.microsoft.com"),
      );
      const payload = accessToken ? decodeJwtPayload(accessToken) : null;
      graph = {
        ok: true,
        roles: readStringArray(payload?.roles),
        scopes: readScopes(payload?.scp),
      };
    } catch (err) {
      graph = {
        ok: false,
        error: formatUnknownError(err),
      };
    }
    let delegatedAuth;
    if (cfg?.delegatedAuth?.enabled)
      try {
        const tokens = loadDelegatedTokens();
        if (tokens) {
          const isExpired = !isFutureDateTimestampMs(tokens.expiresAt);
          delegatedAuth = {
            ok: !isExpired,
            scopes: tokens.scopes,
            userPrincipalName: tokens.userPrincipalName,
            ...(isExpired ? { error: "token expired (will auto-refresh on next use)" } : {}),
          };
        } else
          delegatedAuth = {
            ok: false,
            error: "no delegated tokens found (run setup wizard)",
          };
      } catch {
        delegatedAuth = {
          ok: false,
          error: "failed to load delegated tokens",
        };
      }
    return {
      ok: true,
      appId: creds.appId,
      ...(graph ? { graph } : {}),
      ...(delegatedAuth ? { delegatedAuth } : {}),
    };
  } catch (err) {
    return {
      ok: false,
      appId: creds.appId,
      error: formatUnknownError(err),
    };
  }
}
//#endregion
//#region extensions/msteams/src/channel.runtime.ts
const msTeamsChannelRuntime = {
  addParticipantMSTeams,
  deleteMessageMSTeams,
  editMessageMSTeams,
  getChannelInfoMSTeams,
  getMemberInfoMSTeams,
  getMessageMSTeams,
  listChannelsMSTeams,
  listPinsMSTeams,
  listReactionsMSTeams,
  pinMessageMSTeams,
  reactMessageMSTeams,
  removeParticipantMSTeams,
  renameGroupMSTeams,
  searchMessagesMSTeams,
  unpinMessageMSTeams,
  unreactMessageMSTeams,
  listMSTeamsDirectoryGroupsLive,
  listMSTeamsDirectoryPeersLive,
  msteamsOutbound: { ...msteamsOutbound },
  probeMSTeams,
  sendAdaptiveCardMSTeams,
  sendMessageMSTeams,
};
//#endregion
export { msTeamsChannelRuntime };
