import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import {
  c as SessionBindingRecord,
  r as ConversationRef,
} from "./session-binding.types-BbT2v6Ty.js";
import {
  _ as ChannelConfiguredBindingConversationRef,
  v as ChannelConfiguredBindingMatch,
  y as ChannelConfiguredBindingProvider,
} from "./types.adapters-BND_5Qr-.js";
import { Vt as AgentBinding } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/plugins/binding-types.d.ts
/**
 * Normalized conversation facts used to match configured channel bindings.
 */
type ConfiguredBindingConversation = ConversationRef;
/**
 * Channel id used by configured binding rules.
 */
type ConfiguredBindingChannel = ChannelId;
/**
 * Raw binding config entry from OpenClaw config.
 */
type ConfiguredBindingRuleConfig = AgentBinding;
/**
 * Stateful target descriptor produced by a binding consumer.
 */
type StatefulBindingTargetDescriptor = {
  kind: "stateful";
  driverId: string;
  sessionKey: string;
  agentId: string;
  label?: string;
};
/**
 * Materialized binding record plus the stateful target it points at.
 */
type ConfiguredBindingRecordResolution = {
  record: SessionBindingRecord;
  statefulTarget: StatefulBindingTargetDescriptor;
};
/**
 * Factory that materializes a configured binding for one account/conversation pair.
 */
type ConfiguredBindingTargetFactory = {
  driverId: string;
  materialize: (params: {
    accountId: string;
    conversation: ChannelConfiguredBindingConversationRef;
  }) => ConfiguredBindingRecordResolution;
};
/**
 * Compiled binding rule with provider matcher, target factory, and static target facts.
 */
type CompiledConfiguredBinding = {
  channel: ConfiguredBindingChannel;
  accountPattern?: string;
  binding: ConfiguredBindingRuleConfig;
  bindingConversationId: string;
  target: ChannelConfiguredBindingConversationRef;
  agentId: string;
  provider: ChannelConfiguredBindingProvider;
  targetFactory: ConfiguredBindingTargetFactory;
};
/**
 * Full configured binding resolution used to rewrite routes and prepare target sessions.
 */
type ConfiguredBindingResolution = ConfiguredBindingRecordResolution & {
  conversation: ConfiguredBindingConversation;
  compiledBinding: CompiledConfiguredBinding;
  match: ChannelConfiguredBindingMatch;
};
//#endregion
export {
  StatefulBindingTargetDescriptor as a,
  ConfiguredBindingResolution as i,
  ConfiguredBindingConversation as n,
  ConfiguredBindingRecordResolution as r,
  CompiledConfiguredBinding as t,
};
