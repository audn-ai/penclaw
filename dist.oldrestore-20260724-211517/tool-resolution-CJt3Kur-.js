import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  a as resolveInheritedToolPolicyForSession,
  i as resolveGroupToolPolicy,
  o as resolveSubagentToolPolicyForSession,
  r as resolveEffectiveToolPolicy,
} from "./agent-tools.policy-BQgyHzcD.js";
import "./message-channel-constants-CvbXi0yz.js";
import { n as nodeExecSchema } from "./bash-tools.schemas-DTbbXMLb.js";
import { n as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-nnu5h65s.js";
import {
  r as GATEWAY_OWNER_ONLY_CORE_TOOLS,
  t as DEFAULT_GATEWAY_HTTP_TOOL_DENY,
} from "./dangerous-tools-EO69Px8j.js";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-zOSuMGLJ.js";
import { t as resolveExecDefaults } from "./exec-defaults-CZ1jkNDD.js";
import {
  n as resolveExecToolConfig,
  r as filterToolsByMessageProvider,
  t as createLazyExecTool,
} from "./lazy-exec-tool-CYVnvL8K.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { n as normalizeMessageChannel } from "./message-channel-core-CgTCmAZC.js";
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
//#region src/gateway/tool-resolution.ts
/** Resolve the tools visible to a gateway caller after agent, channel, and surface policy. */
function resolveGatewayScopedTools(params) {
  const runtimePolicySessionKey = params.runtimePolicySessionKey?.trim() || params.sessionKey;
  const {
    agentId,
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
    sessionKey: runtimePolicySessionKey,
    agentId: params.agentId,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  const profilePolicy = resolveToolProfilePolicy(profile);
  const providerProfilePolicy = resolveToolProfilePolicy(providerProfile);
  const surface = params.surface ?? "http";
  const nodeExecSurface = surface === "loopback" && params.includeNodeExecTool === true;
  const gatewayRequestedTools = params.gatewayRequestedTools ?? [];
  const messageProvider = params.messageProvider?.trim().toLowerCase();
  const sourceReplyDeliveryMode =
    params.sourceReplyDeliveryMode ??
    (params.inboundEventKind === "room_event" && messageProvider !== "webchat"
      ? "message_tool_only"
      : void 0);
  const runtimeAlsoAllow = sourceReplyDeliveryMode === "message_tool_only" ? ["message"] : [];
  const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, [
    ...(profileAlsoAllow ?? []),
    ...gatewayRequestedTools,
    ...runtimeAlsoAllow,
  ]);
  const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, [
    ...(providerProfileAlsoAllow ?? []),
    ...gatewayRequestedTools,
    ...runtimeAlsoAllow,
  ]);
  const senderId = params.channelContext?.sender?.id;
  const groupPolicy = resolveGroupToolPolicy({
    config: params.cfg,
    sessionKey: runtimePolicySessionKey,
    spawnedBy: params.spawnedBy,
    messageProvider: params.messageProvider,
    groupId: params.groupId,
    groupChannel: params.groupChannel,
    groupSpace: params.groupSpace,
    accountId: params.accountId ?? null,
    senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  });
  const isOwnerInternalSession =
    nodeExecSurface &&
    params.senderIsOwner === true &&
    normalizeMessageChannel(params.messageProvider) === "webchat";
  const senderPolicy = (nodeExecSurface ? !isOwnerInternalSession : Boolean(senderId))
    ? resolveSenderToolPolicy({
        config: params.cfg,
        agentId,
        messageProvider: params.messageProvider,
        senderId,
        senderName: params.senderName,
        senderUsername: params.senderUsername,
        senderE164: params.senderE164,
      })
    : void 0;
  const sandboxRuntime = resolveSandboxRuntimeStatus({
    cfg: params.cfg,
    sessionKey: runtimePolicySessionKey,
    agentId,
  });
  const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
  const subagentStore = resolveSubagentCapabilityStore(runtimePolicySessionKey, {
    cfg: params.cfg,
  });
  const subagentPolicy = isSubagentEnvelopeSession(runtimePolicySessionKey, {
    cfg: params.cfg,
    store: subagentStore,
  })
    ? resolveSubagentToolPolicyForSession(params.cfg, runtimePolicySessionKey, {
        store: subagentStore,
      })
    : void 0;
  const inheritedToolPolicy = resolveInheritedToolPolicyForSession(
    params.cfg,
    runtimePolicySessionKey,
    { store: subagentStore },
  );
  const excludedToolNames = params.excludeToolNames ? Array.from(params.excludeToolNames) : [];
  const gatewayToolsCfg = params.cfg.gateway?.tools;
  const defaultGatewayDeny =
    surface === "http"
      ? DEFAULT_GATEWAY_HTTP_TOOL_DENY.filter((name) => !gatewayToolsCfg?.allow?.includes(name))
      : [];
  const ownerOnlyGatewayDeny =
    params.senderIsOwner === false || (surface === "http" && params.senderIsOwner !== true)
      ? [...GATEWAY_OWNER_ONLY_CORE_TOOLS]
      : [];
  const workspaceDir = resolveAgentWorkspaceDir(
    params.cfg,
    agentId ?? resolveDefaultAgentId(params.cfg),
  );
  const explicitDenylist = collectExplicitDenylist([
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
    defaultGatewayDeny.length > 0 ? { deny: defaultGatewayDeny } : void 0,
    ownerOnlyGatewayDeny.length > 0 ? { deny: ownerOnlyGatewayDeny } : void 0,
    Array.isArray(gatewayToolsCfg?.deny) ? { deny: gatewayToolsCfg.deny } : void 0,
  ]);
  const inheritedToolDenylist = [...explicitDenylist];
  const inheritedToolAllowlist = [];
  const cronCreatorToolAllowlist = [];
  const shouldInheritEffectiveToolAllowlist = [
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
    gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0,
  ].some(hasRestrictiveAllowPolicy);
  const shouldCaptureCronCreatorToolAllowlist =
    shouldInheritEffectiveToolAllowlist ||
    explicitDenylist.length > 0 ||
    excludedToolNames.length > 0;
  const openClawTools = createOpenClawTools({
    agentSessionKey: params.sessionKey,
    requesterAgentIdOverride: agentId,
    agentChannel: params.messageProvider ?? void 0,
    agentAccountId: params.accountId,
    inboundEventKind: params.inboundEventKind,
    sourceReplyDeliveryMode,
    taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
    agentTo: params.agentTo,
    agentThreadId: params.agentThreadId,
    currentChannelId: params.currentChannelId ?? params.agentTo,
    currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
    currentMessageId: params.currentMessageId,
    currentInboundAudio: params.currentInboundAudio,
    sessionId: params.sessionId,
    onYield: params.onYield,
    requireExplicitMessageTarget: params.requireExplicitMessageTarget,
    senderIsOwner: params.senderIsOwner,
    conversationReadOrigin: params.conversationReadOrigin,
    allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
    allowMediaInvokeCommands: params.allowMediaInvokeCommands,
    disablePluginTools: params.disablePluginTools,
    wrapBeforeToolCallHook: false,
    config: params.cfg,
    clientCaps: params.clientCaps,
    workspaceDir,
    sandboxed: sandboxRuntime.sandboxed,
    pluginToolAllowlist: collectExplicitAllowlist([
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
      gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0,
    ]),
    pluginToolDenylist: explicitDenylist,
    cronCreatorToolAllowlist: shouldCaptureCronCreatorToolAllowlist
      ? cronCreatorToolAllowlist
      : void 0,
    inheritedToolAllowlist,
    inheritedToolDenylist,
  });
  const nodeExecCandidate = nodeExecSurface
    ? resolveExecDefaults({
        cfg: params.cfg,
        sessionEntry: params.execSession,
        execOverrides: params.execOverrides,
        agentId,
        sessionKey: runtimePolicySessionKey,
        sandboxAvailable: sandboxRuntime.sandboxed,
      })
    : void 0;
  const includeNodeExecTool = nodeExecCandidate?.canRequestNode === true;
  const execConfig = includeNodeExecTool
    ? resolveExecToolConfig({
        cfg: params.cfg,
        agentId,
      })
    : void 0;
  const baseTools = nodeExecSurface
    ? openClawTools.filter((tool) => tool.name.trim().toLowerCase() !== "exec")
    : openClawTools;
  const policyFiltered = applyToolPolicyPipeline({
    tools: filterToolsByMessageProvider(
      includeNodeExecTool
        ? [
            ...baseTools,
            createLazyExecTool(
              {
                host: "node",
                mode: nodeExecCandidate.mode,
                security: nodeExecCandidate.security,
                ask: nodeExecCandidate.ask,
                trigger: params.trigger,
                node: nodeExecCandidate.node,
                pathPrepend: execConfig?.pathPrepend,
                safeBins: execConfig?.safeBins,
                strictInlineEval: execConfig?.strictInlineEval,
                commandHighlighting: execConfig?.commandHighlighting,
                safeBinTrustedDirs: execConfig?.safeBinTrustedDirs,
                safeBinProfiles: execConfig?.safeBinProfiles,
                reviewer: execConfig?.reviewer,
                config: params.cfg,
                agentId,
                elevated: params.bashElevated,
                cwd: workspaceDir,
                allowBackground: false,
                scopeKey: params.sessionKey,
                sessionKey: params.sessionKey,
                sessionId: params.sessionId,
                sessionStore: params.cfg.session?.store,
                mainKey: params.cfg.session?.mainKey,
                sessionScope: params.cfg.session?.scope,
                eventRouting: resolveEventSessionRoutingPolicy({
                  cfg: params.cfg,
                  sessionKey: params.sessionKey,
                  channel: params.messageProvider,
                  accountId: params.accountId,
                }),
                messageProvider: params.messageProvider,
                currentChannelId: params.currentChannelId ?? params.agentTo,
                currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
                channelContext: params.channelContext,
                accountId: params.accountId,
                approvalReviewerDeviceId: params.approvalReviewerDeviceId,
                backgroundMs: execConfig?.backgroundMs,
                timeoutSec: execConfig?.timeoutSec,
                approvalRunningNoticeMs: execConfig?.approvalRunningNoticeMs,
                notifyOnExit: execConfig?.notifyOnExit,
                notifyOnExitEmptySuccess: execConfig?.notifyOnExitEmptySuccess,
              },
              {
                description:
                  "Execute a shell command on a connected OpenClaw node. This tool is node-only; use the CLI native shell for Gateway-local commands. Commands run synchronously. Set node when multiple nodes are available.",
                displaySummary: "Run commands on a connected node",
                parameters: nodeExecSchema,
              },
            ),
          ]
        : baseTools,
      params.messageProvider,
    ),
    toolMeta: (tool) => getPluginToolMeta(tool),
    warn: logWarn,
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
        agentId,
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
      workspaceDir,
      toolDenylist: explicitDenylist,
    }),
  });
  const gatewayDenySet = /* @__PURE__ */ new Set([
    ...defaultGatewayDeny,
    ...ownerOnlyGatewayDeny,
    ...(Array.isArray(gatewayToolsCfg?.deny) ? gatewayToolsCfg.deny : []),
    ...excludedToolNames,
  ]);
  const tools = policyFiltered.filter((tool) => !gatewayDenySet.has(tool.name));
  const inheritableTools = includeNodeExecTool
    ? tools.filter((tool) => tool.name.trim().toLowerCase() !== "exec")
    : tools;
  if (shouldInheritEffectiveToolAllowlist)
    replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, inheritableTools);
  if (shouldCaptureCronCreatorToolAllowlist)
    replaceWithEffectiveCronCreatorToolAllowlist(
      cronCreatorToolAllowlist,
      inheritableTools,
      (tool) => getPluginToolMeta(tool),
    );
  return {
    agentId,
    tools,
    workspaceDir,
  };
}
//#endregion
export { resolveGatewayScopedTools as t };
