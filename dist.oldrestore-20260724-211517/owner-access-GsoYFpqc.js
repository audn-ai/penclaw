import { c as resolveDiscordAccountAllowFrom } from "./accounts-BNPpAWWI.js";
import {
  c as resolveDiscordChannelConfigWithFallback,
  d as resolveDiscordCommandOwnerAllowFrom,
  f as resolveDiscordGuildEntry,
  h as resolveDiscordOwnerAccess,
  n as isDiscordGroupAllowedByPolicy,
  p as resolveDiscordMemberAccessState,
} from "./allow-list-DdPHme1x.js";
import "./command-auth-native-D63iLZoQ.js";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-65fgTdwb.js";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "./runtime-group-policy-BEjP88cf.js";
//#region extensions/discord/src/voice/config.ts
function resolveDiscordVoiceEnabled(voice) {
  if (voice?.enabled !== void 0) return voice.enabled;
  return voice !== void 0;
}
//#endregion
//#region extensions/discord/src/voice/access.ts
async function authorizeDiscordVoiceIngress(params) {
  const groupPolicy =
    params.groupPolicy ??
    resolveOpenProviderRuntimeGroupPolicy({
      providerConfigPresent: params.cfg.channels?.discord !== void 0,
      groupPolicy: params.discordConfig.groupPolicy,
      defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy,
    }).groupPolicy;
  const guildInfo = resolveDiscordGuildEntry({
    guild: params.guild ?? {
      id: params.guildId,
      ...(params.guildName ? { name: params.guildName } : {}),
    },
    guildId: params.guildId,
    guildEntries: params.discordConfig.guilds,
  });
  const channelConfig = params.channelId
    ? resolveDiscordChannelConfigWithFallback({
        guildInfo,
        channelId: params.channelId,
        channelName: params.channelName,
        channelSlug: params.channelSlug,
        parentId: params.parentId,
        parentName: params.parentName,
        parentSlug: params.parentSlug,
        scope: params.scope,
      })
    : null;
  if (channelConfig?.enabled === false)
    return {
      ok: false,
      message: "This channel is disabled.",
    };
  const channelAllowlistConfigured =
    Boolean(guildInfo?.channels) && Object.keys(guildInfo?.channels ?? {}).length > 0;
  if (!params.channelId && groupPolicy === "allowlist" && channelAllowlistConfigured)
    return {
      ok: false,
      message: `${params.channelLabel ?? "This channel"} is not allowlisted for voice commands.`,
    };
  const channelAllowed = channelConfig ? channelConfig.allowed : !channelAllowlistConfigured;
  if (
    !isDiscordGroupAllowedByPolicy({
      groupPolicy,
      guildAllowlisted: Boolean(guildInfo),
      channelAllowlistConfigured,
      channelAllowed,
    }) ||
    channelConfig?.allowed === false
  )
    return {
      ok: false,
      message: `${params.channelLabel ?? "This channel"} is not allowlisted for voice commands.`,
    };
  const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
    channelConfig,
    guildInfo,
    memberRoleIds: params.memberRoleIds,
    sender: params.sender,
    allowNameMatching: false,
  });
  const { ownerAllowList, ownerAllowed } = resolveDiscordOwnerAccess({
    allowFrom:
      params.ownerAllowFrom ?? params.discordConfig.allowFrom ?? params.discordConfig.dm?.allowFrom,
    sender: params.sender,
    allowNameMatching: false,
  });
  const useAccessGroups = params.useAccessGroups ?? params.cfg.commands?.useAccessGroups !== false;
  return resolveCommandAuthorizedFromAuthorizers({
    useAccessGroups,
    authorizers: useAccessGroups
      ? [
          {
            configured: params.ownerAllowAll === true || ownerAllowList != null,
            allowed: params.ownerAllowAll === true || ownerAllowed,
          },
          {
            configured: hasAccessRestrictions,
            allowed: memberAllowed,
          },
        ]
      : [
          {
            configured: hasAccessRestrictions,
            allowed: memberAllowed,
          },
        ],
    modeWhenAccessGroupsOff: "configured",
  })
    ? {
        ok: true,
        channelConfig,
      }
    : {
        ok: false,
        message: "You are not authorized to use this command.",
      };
}
//#endregion
//#region extensions/discord/src/voice/owner-access.ts
function resolveDiscordVoiceOwnerAccess(params) {
  const commandOwnerAllowFrom = resolveDiscordCommandOwnerAllowFrom(params.cfg);
  if (commandOwnerAllowFrom)
    return {
      ownerAllowFrom: commandOwnerAllowFrom,
      ownerAllowAll: commandOwnerAllowFrom.includes("*"),
    };
  return {
    ownerAllowFrom:
      resolveDiscordAccountAllowFrom({
        cfg: params.cfg,
        accountId: params.accountId,
      }) ??
      params.discordConfig.allowFrom ??
      params.discordConfig.dm?.allowFrom ??
      [],
    ownerAllowAll: false,
  };
}
//#endregion
export {
  authorizeDiscordVoiceIngress as n,
  resolveDiscordVoiceEnabled as r,
  resolveDiscordVoiceOwnerAccess as t,
};
