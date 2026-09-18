import {
  i as ConfiguredBindingResolution,
  r as ConfiguredBindingRecordResolution,
} from "./binding-types-DrvK0cKt.js";
import { t as PairingChannel } from "./pairing-store.types-Be-qiql4.js";
import {
  a as SessionBindingCapabilities,
  c as SessionBindingRecord,
  i as SessionBindingBindInput,
  l as SessionBindingUnbindInput,
  r as ConversationRef,
} from "./session-binding.types-BbT2v6Ty.js";
import { r as StatefulBindingTargetResetResult } from "./stateful-target-drivers-B7PvWSzu.js";
import { i as MsgContext } from "./templating-h3OQefFR.js";
import { E as ReplyToMode } from "./types.base-ibSxQuK3.js";
import { L as ChannelThreadingAdapter } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/bindings/records.d.ts
declare function createConversationBindingRecord(
  input: SessionBindingBindInput,
): Promise<SessionBindingRecord>;
declare function getConversationBindingCapabilities(params: {
  channel: string;
  accountId: string;
}): SessionBindingCapabilities;
declare function listSessionBindingRecords(targetSessionKey: string): SessionBindingRecord[];
declare function resolveConversationBindingRecord(
  conversation: ConversationRef,
): SessionBindingRecord | null;
declare function touchConversationBindingRecord(bindingId: string, at?: number): void;
declare function unbindConversationBindingRecord(
  input: SessionBindingUnbindInput,
): Promise<SessionBindingRecord[]>;
//#endregion
//#region src/channels/plugins/configured-binding-registry.d.ts
/**
 * Warms and counts the compiled configured binding registry for a config snapshot.
 */
declare function primeConfiguredBindingRegistry$1(params: { cfg: OpenClawConfig }): {
  bindingCount: number;
  channelCount: number;
};
/**
 * Resolves a configured binding record from explicit channel/account/conversation ids.
 */
declare function resolveConfiguredBindingRecord$1(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
}): ConfiguredBindingRecordResolution | null;
/**
 * Resolves a configured binding record from a normalized conversation reference.
 */
declare function resolveConfiguredBindingRecordForConversation$1(params: {
  cfg: OpenClawConfig;
  conversation: ConversationRef;
}): ConfiguredBindingRecordResolution | null;
/**
 * Resolves the full configured binding match, including compiled rule and match diagnostics.
 */
declare function resolveConfiguredBinding$1(params: {
  cfg: OpenClawConfig;
  conversation: ConversationRef;
}): ConfiguredBindingResolution | null;
/**
 * Resolves a configured binding record by the stateful target session key.
 */
declare function resolveConfiguredBindingRecordBySessionKey$1(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}): ConfiguredBindingRecordResolution | null;
//#endregion
//#region src/channels/plugins/binding-registry.d.ts
declare function primeConfiguredBindingRegistry(
  ...args: Parameters<typeof primeConfiguredBindingRegistry$1>
): ReturnType<typeof primeConfiguredBindingRegistry$1>;
declare function resolveConfiguredBindingRecord(
  ...args: Parameters<typeof resolveConfiguredBindingRecord$1>
): ReturnType<typeof resolveConfiguredBindingRecord$1>;
declare function resolveConfiguredBindingRecordForConversation(
  ...args: Parameters<typeof resolveConfiguredBindingRecordForConversation$1>
): ReturnType<typeof resolveConfiguredBindingRecordForConversation$1>;
declare function resolveConfiguredBinding(
  ...args: Parameters<typeof resolveConfiguredBinding$1>
): ReturnType<typeof resolveConfiguredBinding$1>;
declare function resolveConfiguredBindingRecordBySessionKey(
  ...args: Parameters<typeof resolveConfiguredBindingRecordBySessionKey$1>
): ReturnType<typeof resolveConfiguredBindingRecordBySessionKey$1>;
//#endregion
//#region src/channels/plugins/binding-targets.d.ts
/**
 * Ensures the stateful target driver for a configured binding is ready to receive traffic.
 */
declare function ensureConfiguredBindingTargetReady(params: {
  cfg: OpenClawConfig;
  bindingResolution: ConfiguredBindingResolution | null;
}): Promise<
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    }
>;
/**
 * Resets a stateful configured binding target in place when its driver supports reset.
 */
declare function resetConfiguredBindingTargetInPlace(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: "new" | "reset";
  commandSource?: string;
}): Promise<StatefulBindingTargetResetResult>;
/**
 * Ensures the configured binding target session exists and returns its session key.
 */
declare function ensureConfiguredBindingTargetSession(params: {
  cfg: OpenClawConfig;
  bindingResolution: ConfiguredBindingResolution;
}): Promise<
  | {
      ok: true;
      sessionKey: string;
    }
  | {
      ok: false;
      sessionKey: string;
      error: string;
    }
>;
//#endregion
//#region src/channels/conversation-label.d.ts
/**
 * Resolves the most readable conversation label from normalized inbound message context.
 */
declare function resolveConversationLabel(ctx: MsgContext): string | undefined;
//#endregion
//#region src/channels/session-meta.d.ts
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
declare function recordInboundSessionMetaSafe(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  ctx: MsgContext;
  onError?: (error: unknown) => void;
}): Promise<void>;
//#endregion
//#region src/channels/plugins/threading-helpers.d.ts
type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
declare function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
declare function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
declare function createScopedAccountReplyToModeResolver<TAccount>(params: {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
  resolveReplyToMode: (
    account: TAccount,
    chatType?: string | null,
  ) => ReplyToMode | null | undefined;
  fallback?: ReplyToMode;
}): ReplyToModeResolver;
//#endregion
//#region src/pairing/pairing-labels.d.ts
declare function resolvePairingIdLabel(channel: PairingChannel): string;
//#endregion
export {
  listSessionBindingRecords as _,
  recordInboundSessionMetaSafe as a,
  unbindConversationBindingRecord as b,
  ensureConfiguredBindingTargetSession as c,
  resolveConfiguredBinding as d,
  resolveConfiguredBindingRecord as f,
  getConversationBindingCapabilities as g,
  createConversationBindingRecord as h,
  createTopLevelChannelReplyToModeResolver as i,
  resetConfiguredBindingTargetInPlace as l,
  resolveConfiguredBindingRecordForConversation as m,
  createScopedAccountReplyToModeResolver as n,
  resolveConversationLabel as o,
  resolveConfiguredBindingRecordBySessionKey as p,
  createStaticReplyToModeResolver as r,
  ensureConfiguredBindingTargetReady as s,
  resolvePairingIdLabel as t,
  primeConfiguredBindingRegistry as u,
  resolveConversationBindingRecord as v,
  touchConversationBindingRecord as y,
};
