import {
  a as resolveInheritedToolPolicyForSession,
  c as sessionKeyNamesGroupConversation,
  i as resolveGroupToolPolicy,
  o as resolveSubagentToolPolicyForSession,
  r as resolveEffectiveToolPolicy,
  s as resolveTrustedGroupId,
} from "./agent-tools.policy-BQgyHzcD.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./message-channel-constants-CvbXi0yz.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CgTCmAZC.js";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-B2yvUBZb.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  o as resolveSubagentCapabilityStore,
  t as isSubagentEnvelopeSession,
} from "./subagent-capabilities-DP50Hfbb.js";
import {
  a as collectExplicitDenylist,
  h as resolveToolProfilePolicy,
  i as collectExplicitAllowlist,
} from "./tool-policy-1QHiwXPv.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-C7a6XA8X.js";
//#region src/agents/conversation-capability-profile.ts
/**
 * Resolves the conversation-scoped runtime facts that tool and harness policy
 * hot paths share. Keep this internal: it prepares existing config/state, not a
 * new public access-profile config surface.
 */
function resolveConversationCapabilityProfile(params) {
  const messageProvider = params.messageProvider;
  const effective = resolveEffectiveToolPolicy({
    config: params.config,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  const trustedGroup = resolveTrustedGroupId({
    sessionKey: params.sessionKey,
    spawnedBy: params.spawnedBy,
    groupId: params.groupId,
  });
  const trustedGroupChannel = trustedGroup.dropped ? null : params.groupChannel;
  const trustedGroupSpace = trustedGroup.dropped ? null : params.groupSpace;
  const groupPolicy = resolveGroupToolPolicy({
    config: params.config,
    sessionKey: params.sessionKey,
    spawnedBy: params.spawnedBy,
    messageProvider: messageProvider ?? void 0,
    groupId: trustedGroup.groupId,
    groupChannel: trustedGroupChannel,
    groupSpace: trustedGroupSpace,
    accountId: params.agentAccountId,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  const senderPolicy =
    params.senderIsOwner === true &&
    normalizeMessageChannel(messageProvider ?? params.messageChannel) === "webchat"
      ? void 0
      : resolveSenderToolPolicy({
          config: params.config,
          agentId: effective.agentId,
          messageProvider,
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername,
          senderE164: params.senderE164,
        });
  const profilePolicy = resolveToolProfilePolicy(effective.profile);
  const providerProfilePolicy = resolveToolProfilePolicy(effective.providerProfile);
  const subagentSessionKey = params.sandboxSessionKey ?? params.sessionKey;
  const subagentStore = resolveSubagentCapabilityStore(subagentSessionKey, { cfg: params.config });
  const subagentPolicy =
    subagentSessionKey &&
    isSubagentEnvelopeSession(subagentSessionKey, {
      cfg: params.config,
      store: subagentStore,
    })
      ? resolveSubagentToolPolicyForSession(params.config, subagentSessionKey, {
          store: subagentStore,
        })
      : void 0;
  const inheritedToolPolicy = resolveInheritedToolPolicyForSession(
    params.config,
    subagentSessionKey,
    { store: subagentStore },
  );
  const configuredOverridePolicies = [
    effective.globalPolicy,
    effective.globalProviderPolicy,
    effective.agentPolicy,
    effective.agentProviderPolicy,
    groupPolicy,
    senderPolicy,
    params.sandboxToolPolicy,
    subagentPolicy,
  ];
  const runtimeToolPolicy = params.runtimeToolAllowlist
    ? { allow: params.runtimeToolAllowlist }
    : void 0;
  const runtimeToolAlsoAllowlist = uniqueStrings(
    (params.runtimePluginToolGrant?.toolNames ?? []).map((entry) => entry.trim()).filter(Boolean),
  );
  const mergeRuntimeToolAlsoAllowlist = (configured) => {
    const merged = uniqueStrings([...(configured ?? []), ...runtimeToolAlsoAllowlist]);
    return merged.length > 0 ? merged : void 0;
  };
  const explicitOverridePolicies = [...configuredOverridePolicies, runtimeToolPolicy];
  const inheritancePolicies = [
    profilePolicy,
    providerProfilePolicy,
    ...configuredOverridePolicies,
    inheritedToolPolicy,
    runtimeToolPolicy,
  ];
  return {
    agentId: effective.agentId,
    serviceIdentity: {
      agentId: effective.agentId,
      agentDir: params.agentDir,
      accountId: params.agentAccountId,
      runId: params.runId,
      sessionId: params.sessionId,
    },
    model: {
      provider: params.modelProvider,
      id: params.modelId,
      api: params.modelApi,
      contextWindowTokens: params.modelContextWindowTokens,
      hasVision: params.modelHasVision,
    },
    conversation: {
      scope: resolveConversationScope({
        chatType: params.chatType,
        sessionKey: params.sessionKey,
        runSessionKey: params.runSessionKey,
        trustedGroup,
        groupChannel: trustedGroupChannel,
        groupSpace: trustedGroupSpace,
      }),
      chatType: normalizeChatType(params.chatType),
      sessionKey: params.runSessionKey ?? params.sessionKey,
      policySessionKey: params.sessionKey,
      runSessionKey: params.runSessionKey,
      sessionId: params.sessionId,
      messageProvider,
      messageChannel: params.messageChannel,
      messageTo: params.messageTo,
      messageThreadId: params.messageThreadId,
      currentChannelId: params.currentChannelId,
      currentMessagingTarget: params.currentMessagingTarget,
      currentThreadTs: params.currentThreadTs,
      currentMessageId: params.currentMessageId,
      groupId: trustedGroup.groupId,
      groupChannel: trustedGroupChannel,
      groupSpace: trustedGroupSpace,
      memberRoleIds: params.memberRoleIds,
      spawnedBy: params.spawnedBy,
    },
    sender: {
      id: params.senderId,
      name: params.senderName,
      username: params.senderUsername,
      e164: params.senderE164,
      isOwner: params.senderIsOwner,
    },
    workspace: {
      workspaceDir: params.workspaceDir,
      cwd: params.cwd,
      spawnWorkspaceDir: params.spawnWorkspaceDir,
      workspaceRoot: resolveWorkspaceRoot(params.workspaceDir),
      runtimeRoot: resolveWorkspaceRoot(params.cwd ?? params.workspaceDir),
      spawnWorkspaceRoot: params.spawnWorkspaceDir
        ? resolveWorkspaceRoot(params.spawnWorkspaceDir)
        : void 0,
      instructionRoot: params.agentDir ?? params.workspaceDir,
      isCanonicalWorkspace: params.isCanonicalWorkspace,
    },
    instructions: {
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      promptMode: params.promptMode,
      isCanonicalWorkspace: params.isCanonicalWorkspace,
    },
    skills: { snapshot: params.skillsSnapshot },
    policy: {
      agentId: effective.agentId,
      sessionKey: params.sessionKey,
      subagentSessionKey,
      trustedGroup,
      profile: effective.profile,
      providerProfile: effective.providerProfile,
      profilePolicy,
      providerProfilePolicy,
      profileAlsoAllow: mergeRuntimeToolAlsoAllowlist(effective.profileAlsoAllow),
      providerProfileAlsoAllow: mergeRuntimeToolAlsoAllowlist(effective.providerProfileAlsoAllow),
      globalPolicy: effective.globalPolicy,
      globalProviderPolicy: effective.globalProviderPolicy,
      agentPolicy: effective.agentPolicy,
      agentProviderPolicy: effective.agentProviderPolicy,
      groupPolicy,
      senderPolicy,
      sandboxPolicy: params.sandboxToolPolicy,
      subagentPolicy,
      inheritedToolPolicy,
      inheritancePolicies,
      explicitToolAllowlist: collectExplicitAllowlist(inheritancePolicies),
      explicitToolOverrideAllowlist: collectExplicitAllowlist(explicitOverridePolicies),
      explicitToolDenylist: collectExplicitDenylist(inheritancePolicies),
      runtimePluginToolGrant: params.runtimePluginToolGrant,
    },
  };
}
function resolveConversationScope(params) {
  const chatType = normalizeChatType(params.chatType);
  if (chatType === "direct") return "direct";
  if (chatType === "group" || chatType === "channel") return "shared";
  if (
    sessionKeyNamesGroupConversation(params.runSessionKey) ||
    sessionKeyNamesGroupConversation(params.sessionKey)
  )
    return "shared";
  if (params.trustedGroup.dropped) return "unknown";
  return params.trustedGroup.groupId?.trim() ||
    params.groupChannel?.trim() ||
    params.groupSpace?.trim()
    ? "shared"
    : "unknown";
}
//#endregion
export { resolveConversationCapabilityProfile as t };
