import { b as IdentityConfig, y as HumanDelayConfig } from "./types.base-ibSxQuK3.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/identity.d.ts
/** Resolve the configured identity block for one agent. */
declare function resolveAgentIdentity(
  cfg: OpenClawConfig,
  agentId: string,
): IdentityConfig | undefined;
/** Resolve the acknowledgement reaction using account, channel, global, then identity fallback. */
declare function resolveAckReaction(
  cfg: OpenClawConfig,
  agentId: string,
  opts?: {
    channel?: string;
    accountId?: string;
  },
): string;
/** Build the automatic `[name]` prefix for an agent identity. */
declare function resolveIdentityNamePrefix(
  cfg: OpenClawConfig,
  agentId: string,
): string | undefined;
/** Resolve the outbound message prefix, preserving explicit empty prefixes. */
declare function resolveMessagePrefix(
  cfg: OpenClawConfig,
  agentId: string,
  opts?: {
    configured?: string;
    hasAllowFrom?: boolean;
    fallback?: string;
  },
): string;
/** Resolve the optional response prefix, expanding `auto` to the identity name prefix. */
declare function resolveResponsePrefix(
  cfg: OpenClawConfig,
  agentId: string,
  opts?: {
    channel?: string;
    accountId?: string;
  },
): string | undefined;
/** Resolve message and response prefix values together for channel delivery. */
declare function resolveEffectiveMessagesConfig(
  cfg: OpenClawConfig,
  agentId: string,
  opts?: {
    hasAllowFrom?: boolean;
    fallbackMessagePrefix?: string;
    channel?: string;
    accountId?: string;
  },
): {
  messagePrefix: string;
  responsePrefix?: string;
};
/** Resolve per-agent human-delay settings over global agent defaults. */
declare function resolveHumanDelayConfig(
  cfg: OpenClawConfig,
  agentId: string,
): HumanDelayConfig | undefined;
//#endregion
//#region src/channels/ack-reactions.d.ts
type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
/** WhatsApp group-mode policy; direct-message ack reactions are configured separately. */
type WhatsAppAckReactionMode = "always" | "mentions" | "never";
/** Sent ack reaction state plus the cleanup hook callers can run after reply delivery. */
type AckReactionHandle = {
  ackReactionPromise: Promise<boolean>;
  ackReactionValue: string;
  remove: () => Promise<void>;
};
/**
 * Inputs for the reusable direct/group/mention gate shared by channel plugins.
 *
 * `effectiveWasMentioned` should already include any channel-specific mention
 * normalization. `shouldBypassMention` is only for an earlier channel gate that
 * proved the active conversation, such as a group activation state.
 */
type AckReactionGateParams = {
  scope: AckReactionScope | undefined;
  inboundEventKind?: "user_request" | "room_event";
  isDirect: boolean;
  isGroup: boolean;
  isMentionableGroup: boolean;
  requireMention: boolean;
  canDetectMention: boolean;
  effectiveWasMentioned: boolean;
  shouldBypassMention?: boolean;
};
/** Resolves the generic ack reaction gate without sending or removing reactions. */
declare function shouldAckReaction(params: AckReactionGateParams): boolean;
/** Resolves WhatsApp ack policy while preserving the shared mention-only group gate. */
declare function shouldAckReactionForWhatsApp(params: {
  emoji: string;
  isDirect: boolean;
  isGroup: boolean;
  directEnabled: boolean;
  groupMode: WhatsAppAckReactionMode;
  wasMentioned: boolean;
  groupActivated: boolean;
}): boolean;
/** Starts sending an ack reaction and returns the success-tracking cleanup handle. */
declare function createAckReactionHandle(params: {
  ackReactionValue: string;
  send: () => Promise<void>;
  remove: () => Promise<void>;
  onSendError?: (err: unknown) => void;
}): AckReactionHandle | null;
/** Schedules removal of a previously sent ack reaction after reply delivery. */
declare function removeAckReactionAfterReply(params: {
  removeAfterReply: boolean;
  ackReactionPromise: Promise<boolean> | null;
  ackReactionValue: string | null;
  remove: () => Promise<void>;
  onError?: (err: unknown) => void;
}): void;
/** Convenience wrapper that removes an ack reaction handle after reply delivery. */
declare function removeAckReactionHandleAfterReply(params: {
  removeAfterReply: boolean;
  ackReaction: AckReactionHandle | null | undefined;
  onError?: (err: unknown) => void;
}): void;
//#endregion
export {
  createAckReactionHandle as a,
  shouldAckReaction as c,
  resolveAgentIdentity as d,
  resolveEffectiveMessagesConfig as f,
  resolveResponsePrefix as g,
  resolveMessagePrefix as h,
  WhatsAppAckReactionMode as i,
  shouldAckReactionForWhatsApp as l,
  resolveIdentityNamePrefix as m,
  AckReactionHandle as n,
  removeAckReactionAfterReply as o,
  resolveHumanDelayConfig as p,
  AckReactionScope as r,
  removeAckReactionHandleAfterReply as s,
  AckReactionGateParams as t,
  resolveAckReaction as u,
};
