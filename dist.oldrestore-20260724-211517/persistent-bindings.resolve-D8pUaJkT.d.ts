import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { c as SessionBindingRecord } from "./session-binding.types-BbT2v6Ty.js";
import { l as AcpRuntimeSessionMode } from "./types-D85xy4rc.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/acp/persistent-bindings.types.d.ts
type ConfiguredAcpBindingChannel = ChannelId;
/** Normalized configured binding that maps one channel conversation to one ACP session. */
type ConfiguredAcpBindingSpec = {
  channel: ConfiguredAcpBindingChannel;
  accountId: string;
  conversationId: string;
  parentConversationId?: string /** Owning OpenClaw agent id (used for session identity/storage). */;
  agentId: string /** ACP harness agent id override (falls back to agentId when omitted). */;
  acpAgentId?: string;
  mode: AcpRuntimeSessionMode;
  cwd?: string;
  backend?: string;
  label?: string;
};
type ResolvedConfiguredAcpBinding = {
  spec: ConfiguredAcpBindingSpec;
  record: SessionBindingRecord;
};
//#endregion
//#region src/acp/persistent-bindings.resolve.d.ts
/** Resolves a configured ACP binding for a concrete channel conversation. */
declare function resolveConfiguredAcpBindingRecord(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
}): ResolvedConfiguredAcpBinding | null;
//#endregion
export { ResolvedConfiguredAcpBinding as n, resolveConfiguredAcpBindingRecord as t };
