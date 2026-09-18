import { r as AnyAgentTool } from "../../common-CuQ9SS3Z.js";
import {
  r as ToolPolicyLike,
  t as ResolvedConversationCapabilityProfile,
} from "../../conversation-capability-profile-Xd4Ff0zW.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region src/agents/tool-policy-pipeline.d.ts
/** One named policy layer in the effective runtime tool policy pipeline. */
type ToolPolicyPipelineStep = {
  policy: ToolPolicyLike | undefined;
  label: string;
  stripPluginOnlyAllowlist?: boolean;
  suppressUnavailableCoreToolWarning?: boolean;
  suppressUnavailableCoreToolWarningAllowlist?: string[];
  unavailableCoreToolReason?: string;
};
/** One policy application, exposed for diagnostics that need exclusion provenance. */
type ToolPolicyFilterEvent = {
  step: ToolPolicyPipelineStep;
  policy: ToolPolicyLike;
  before: readonly AnyAgentTool[];
  after: readonly AnyAgentTool[];
};
//#endregion
//#region src/agents/embedded-agent-runner/effective-tool-policy.d.ts
/**
 * The capability profile is an authorization signal (group/sender policies can
 * widen bundled-tool availability), so callers MUST resolve it from
 * server-verified session metadata (session key, inbound transport event),
 * never from tool-call or model-controlled input. Passing the same profile
 * that constructed the core tool set keeps this final bundled-tool pass and
 * tool construction from ever disagreeing about policy inputs.
 */
type FinalEffectiveToolPolicyParams = {
  bundledTools: AnyAgentTool[];
  config?: OpenClawConfig;
  conversationCapabilityProfile: ResolvedConversationCapabilityProfile;
  warn: (message: string) => void;
  toolPolicyAuditLogLevel?: "info" | "debug";
  onFilter?: (event: ToolPolicyFilterEvent) => void;
};
declare function applyFinalEffectiveToolPolicy(
  params: FinalEffectiveToolPolicyParams,
): AnyAgentTool[];
//#endregion
export { applyFinalEffectiveToolPolicy };
