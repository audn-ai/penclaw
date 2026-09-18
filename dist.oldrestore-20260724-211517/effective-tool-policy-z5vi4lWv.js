import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy } from "./tool-policy-1QHiwXPv.js";
import {
  n as buildDefaultToolPolicyPipelineSteps,
  r as buildDeclaredToolAllowlistContext,
  t as applyToolPolicyPipeline,
} from "./tool-policy-pipeline-CwM_CrrQ.js";
import { i as getPluginToolMeta } from "./tools-K3NqAe9E.js";
//#region src/agents/embedded-agent-runner/effective-tool-policy.ts
function applyFinalEffectiveToolPolicy(params) {
  if (params.bundledTools.length === 0) return params.bundledTools;
  const capabilityProfile = params.conversationCapabilityProfile;
  const { trustedGroup } = capabilityProfile.policy;
  if (trustedGroup.dropped)
    params.warn(
      "effective tool policy: dropping caller-provided groupId that does not match session-derived group context",
    );
  const {
    agentId,
    globalPolicy,
    globalProviderPolicy,
    agentPolicy,
    agentProviderPolicy,
    profile,
    providerProfile,
    profilePolicy,
    providerProfilePolicy,
    profileAlsoAllow,
    providerProfileAlsoAllow,
    groupPolicy,
    senderPolicy,
    sandboxPolicy,
    subagentPolicy,
    inheritedToolPolicy,
  } = capabilityProfile.policy;
  const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, profileAlsoAllow);
  const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(
    providerProfilePolicy,
    providerProfileAlsoAllow,
  );
  const pipelineSteps = [
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
  ].map((step) => Object.assign({}, step, { suppressUnavailableCoreToolWarning: true }));
  return applyToolPolicyPipeline({
    tools: params.bundledTools,
    toolMeta: (tool) => getPluginToolMeta(tool),
    warn: params.warn,
    steps: pipelineSteps,
    auditLogLevel: params.toolPolicyAuditLogLevel,
    onFilter: params.onFilter,
    declaredToolAllowlist: buildDeclaredToolAllowlistContext({
      config: params.config,
      toolDenylist: collectExplicitDenylist(pipelineSteps.map((step) => step.policy)),
    }),
  });
}
//#endregion
export { applyFinalEffectiveToolPolicy as t };
