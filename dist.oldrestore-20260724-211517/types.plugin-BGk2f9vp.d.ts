import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-Bu7WWq9f.js";
import { t as ChannelPairingAdapter } from "./pairing.types-WpVktPzR.js";
import {
  n as ChannelSetupWizard,
  r as ChannelSetupWizardAdapter,
} from "./setup-wizard-types-BkGT_-Ru.js";
import { n as ChannelMessageAdapterShape } from "./types-FwtQl4mH.js";
import {
  A as ChannelGroupAdapter,
  B as ChannelSecretsAdapter,
  D as ChannelElevatedAdapter,
  H as ChannelSetupAdapter,
  M as ChannelLifecycleAdapter,
  O as ChannelGatewayAdapter,
  S as ChannelDoctorAdapter,
  U as ChannelStatusAdapter,
  V as ChannelSecurityAdapter,
  b as ChannelConversationBindingSupport,
  g as ChannelConfigAdapter,
  i as ChannelApprovalCapability,
  j as ChannelHeartbeatAdapter,
  m as ChannelCommandAdapter,
  n as ChannelAllowlistAdapter,
  u as ChannelAuthAdapter,
  x as ChannelDirectoryAdapter,
  y as ChannelConfiguredBindingProvider,
  z as ChannelResolverAdapter,
} from "./types.adapters-BND_5Qr-.js";
import { n as ChannelConfigSchema } from "./types.config-D1pSqbn8.js";
import {
  F as ChannelStreamingAdapter,
  L as ChannelThreadingAdapter,
  T as ChannelMeta,
  _ as ChannelMentionAdapter,
  a as ChannelAgentPromptAdapter,
  c as ChannelCapabilities,
  o as ChannelAgentTool,
  s as ChannelAgentToolFactory,
  v as ChannelMessageActionAdapter,
  w as ChannelMessagingAdapter,
} from "./types.core-CcwzPNhX.js";

//#region src/channels/plugins/types.plugin.d.ts
/** Full capability contract for a native channel plugin. */
type ChannelPluginSetupWizard = ChannelSetupWizard | ChannelSetupWizardAdapter;
type ChannelGatewayMethodDescriptor = {
  name: string;
  scope?: OperatorScope;
  description?: string;
};
type ChannelPlugin<ResolvedAccount = any, Probe = unknown, Audit = unknown> = {
  id: ChannelId;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  defaults?: {
    queue?: {
      debounceMs?: number;
    };
  };
  reload?: {
    configPrefixes: string[];
    noopPrefixes?: string[];
  };
  setupWizard?: ChannelPluginSetupWizard;
  config: ChannelConfigAdapter<ResolvedAccount>;
  configSchema?: ChannelConfigSchema;
  setup?: ChannelSetupAdapter;
  pairing?: ChannelPairingAdapter;
  security?: ChannelSecurityAdapter<ResolvedAccount>;
  groups?: ChannelGroupAdapter;
  mentions?: ChannelMentionAdapter;
  outbound?: ChannelOutboundAdapter;
  status?: ChannelStatusAdapter<ResolvedAccount, Probe, Audit>;
  gatewayMethods?: string[];
  gatewayMethodDescriptors?: ChannelGatewayMethodDescriptor[];
  gateway?: ChannelGatewayAdapter<ResolvedAccount>;
  auth?: ChannelAuthAdapter;
  approvalCapability?: ChannelApprovalCapability;
  elevated?: ChannelElevatedAdapter;
  commands?: ChannelCommandAdapter;
  lifecycle?: ChannelLifecycleAdapter;
  secrets?: ChannelSecretsAdapter;
  allowlist?: ChannelAllowlistAdapter;
  doctor?: ChannelDoctorAdapter;
  bindings?: ChannelConfiguredBindingProvider;
  conversationBindings?: ChannelConversationBindingSupport;
  streaming?: ChannelStreamingAdapter;
  threading?: ChannelThreadingAdapter;
  message?: ChannelMessageAdapterShape;
  messaging?: ChannelMessagingAdapter;
  agentPrompt?: ChannelAgentPromptAdapter;
  directory?: ChannelDirectoryAdapter;
  resolver?: ChannelResolverAdapter;
  actions?: ChannelMessageActionAdapter;
  heartbeat?: ChannelHeartbeatAdapter;
  agentTools?: ChannelAgentToolFactory | ChannelAgentTool[];
};
//#endregion
export { ChannelPlugin as t };
