import {
  a as resolveInheritedToolPolicyForSession,
  i as resolveGroupToolPolicy,
  o as resolveSubagentToolPolicyForSession,
  r as resolveEffectiveToolPolicy,
} from "./agent-tools.policy-BQgyHzcD.js";
import { n as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-nnu5h65s.js";
import "./message-channel-NQc9DJ6B.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { a as resolveGatewayMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { t as createOpenClawTools } from "./openclaw-tools-DGecpaCF.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DT_QCQQG.js";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-B2yvUBZb.js";
import {
  o as resolveSubagentCapabilityStore,
  t as isSubagentEnvelopeSession,
} from "./subagent-capabilities-DP50Hfbb.js";
import {
  a as collectExplicitDenylist,
  c as mergeAlsoAllowPolicy,
  h as resolveToolProfilePolicy,
  i as collectExplicitAllowlist,
  l as replaceWithEffectiveToolAllowlist,
  s as hasRestrictiveAllowPolicy,
} from "./tool-policy-1QHiwXPv.js";
import {
  n as buildDefaultToolPolicyPipelineSteps,
  r as buildDeclaredToolAllowlistContext,
  t as applyToolPolicyPipeline,
} from "./tool-policy-pipeline-CwM_CrrQ.js";
import { i as getPluginToolMeta } from "./tools-K3NqAe9E.js";
//#region src/skills/runtime/tool-dispatch.ts
/**
 * Policy-enforcement seam for skill `command-dispatch: tool` invocations.
 * Keep this aligned with the normal tool surfaces so GHSA-mhm4-93fw-4qr2
 * stays closed across allow/deny, group, sandbox, and subagent policy layers.
 */
function resolveSkillDispatchTools(params) {
  const channel =
    resolveGatewayMessageChannel(params.message.surface) ??
    resolveGatewayMessageChannel(params.message.provider) ??
    void 0;
  const {
    agentId: resolvedAgentId,
    globalPolicy,
    globalProviderPolicy,
    agentPolicy,
    agentProviderPolicy,
    profile,
    providerProfile,
    profileAlsoAllow,
    providerProfileAlsoAllow,
  } = resolveEffectiveToolPolicy({
    config: params.cfg,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    modelProvider: params.provider,
    modelId: params.model,
  });
  const profilePolicy = resolveToolProfilePolicy(profile);
  const providerProfilePolicy = resolveToolProfilePolicy(providerProfile);
  const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, profileAlsoAllow);
  const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(
    providerProfilePolicy,
    providerProfileAlsoAllow,
  );
  const groupId = params.sessionEntry?.groupId ?? params.groupId;
  const groupPolicy = resolveGroupToolPolicy({
    config: params.cfg,
    sessionKey: params.sessionKey,
    spawnedBy: params.sessionEntry?.spawnedBy,
    messageProvider: channel,
    groupId,
    groupChannel: params.sessionEntry?.groupChannel,
    groupSpace: params.sessionEntry?.space,
    accountId: params.message.accountId,
    senderId: params.message.senderId ?? params.senderId,
    senderName: params.message.senderName,
    senderUsername: params.message.senderUsername,
    senderE164: params.message.senderE164,
  });
  const senderPolicy = resolveSenderToolPolicy({
    config: params.cfg,
    agentId: resolvedAgentId,
    messageProvider: channel,
    senderId: params.message.senderId ?? params.senderId,
    senderName: params.message.senderName,
    senderUsername: params.message.senderUsername,
    senderE164: params.message.senderE164,
  });
  const sandboxRuntime = resolveSandboxRuntimeStatus({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
  });
  const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
  const subagentStore = resolveSubagentCapabilityStore(params.sessionKey, { cfg: params.cfg });
  const subagentPolicy = isSubagentEnvelopeSession(params.sessionKey, {
    cfg: params.cfg,
    store: subagentStore,
  })
    ? resolveSubagentToolPolicyForSession(params.cfg, params.sessionKey, { store: subagentStore })
    : void 0;
  const inheritedToolPolicy = resolveInheritedToolPolicyForSession(params.cfg, params.sessionKey, {
    store: subagentStore,
  });
  const explicitPolicyList = [
    profilePolicy,
    providerProfilePolicy,
    globalPolicy,
    globalProviderPolicy,
    agentPolicy,
    agentProviderPolicy,
    groupPolicy,
    senderPolicy,
    sandboxPolicy,
    subagentPolicy,
    inheritedToolPolicy,
  ];
  const explicitDenylist = collectExplicitDenylist(explicitPolicyList);
  const inheritedToolAllowlist = [];
  const cronCreatorToolAllowlist = [];
  const shouldCaptureCronCreatorToolAllowlist =
    explicitPolicyList.some(hasRestrictiveAllowPolicy) || explicitDenylist.length > 0;
  const beforeToolCallHookContext = params.skillCommand
    ? {
        cwd: params.workspaceDir,
        workspaceDir: params.workspaceDir,
        ...(params.sessionEntry?.skillsSnapshot
          ? { skillsSnapshot: params.sessionEntry.skillsSnapshot }
          : {}),
        skillCommand: {
          commandName: params.skillCommand.name,
          ...(params.skillCommand.skillFile ? { skillFile: params.skillCommand.skillFile } : {}),
          skillName: params.skillCommand.skillName,
          skillSource: params.skillCommand.skillSource ?? "unknown",
          ...(params.skillCommand.toolName ? { toolName: params.skillCommand.toolName } : {}),
        },
      }
    : void 0;
  const policyFiltered = applyToolPolicyPipeline({
    tools: createOpenClawTools({
      agentSessionKey: params.sessionKey,
      agentChannel: channel,
      agentAccountId: params.message.accountId,
      agentTo: params.message.originatingTo ?? params.message.to,
      agentThreadId: params.message.messageThreadId ?? void 0,
      nativeChannelId: params.message.nativeChannelId,
      agentGroupId: groupId,
      agentGroupChannel: params.sessionEntry?.groupChannel,
      agentGroupSpace: params.sessionEntry?.space,
      agentMemberRoleIds: params.message.memberRoleIds,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      config: params.cfg,
      allowGatewaySubagentBinding: true,
      sandboxed: sandboxRuntime.sandboxed,
      requesterAgentIdOverride: params.agentId,
      requesterSenderId: params.senderId,
      sessionId: params.sessionEntry?.sessionId,
      currentChannelId: params.currentChannelId,
      ...(beforeToolCallHookContext ? { beforeToolCallHookContext } : {}),
      modelProvider: params.provider,
      modelId: params.model,
      pluginToolAllowlist: collectExplicitAllowlist(explicitPolicyList),
      pluginToolDenylist: explicitDenylist,
      cronCreatorToolAllowlist: shouldCaptureCronCreatorToolAllowlist
        ? cronCreatorToolAllowlist
        : void 0,
      inheritedToolAllowlist,
      inheritedToolDenylist: explicitDenylist,
    }),
    toolMeta: (tool) => getPluginToolMeta(tool),
    warn: logVerbose,
    steps: [
      ...buildDefaultToolPolicyPipelineSteps({
        profilePolicy: profilePolicyWithAlsoAllow,
        profile,
        profileUnavailableCoreWarningAllowlist: profilePolicy?.allow,
        providerProfilePolicy: providerProfilePolicyWithAlsoAllow,
        providerProfile,
        providerProfileUnavailableCoreWarningAllowlist: providerProfilePolicy?.allow,
        globalPolicy,
        globalProviderPolicy,
        agentPolicy,
        agentProviderPolicy,
        groupPolicy,
        senderPolicy,
        agentId: resolvedAgentId,
      }),
      {
        policy: sandboxPolicy,
        label: "sandbox tools.allow",
      },
      {
        policy: subagentPolicy,
        label: "subagent tools.allow",
      },
      {
        policy: inheritedToolPolicy,
        label: "inherited tools",
      },
    ],
    declaredToolAllowlist: buildDeclaredToolAllowlistContext({
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      toolDenylist: explicitDenylist,
    }),
  });
  if (explicitPolicyList.some(hasRestrictiveAllowPolicy))
    replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, policyFiltered);
  if (shouldCaptureCronCreatorToolAllowlist)
    replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, policyFiltered, (tool) =>
      getPluginToolMeta(tool),
    );
  return policyFiltered;
}
//#endregion
export { resolveSkillDispatchTools };
