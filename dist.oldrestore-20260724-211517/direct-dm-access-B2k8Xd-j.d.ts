import { n as AccessGroupMembershipResolver } from "./access-groups-3Demw14b.js";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { r as DmGroupAccessReasonCode } from "./dm-policy-shared-CbXY3hb3.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/direct-dm-access.d.ts
/** Runtime hooks needed by the legacy direct-DM access resolver. */
type DirectDmCommandAuthorizationRuntime = {
  shouldComputeCommandAuthorized: (
    rawBody: string,
    cfg: OpenClawConfig,
  ) => boolean /** @deprecated Command authorization is resolved by channel ingress. Kept for runtime injection compatibility. */;
  resolveCommandAuthorizedFromAuthorizers?: (params: {
    useAccessGroups: boolean;
    authorizers: Array<{
      configured: boolean;
      allowed: boolean;
    }>;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
  }) => boolean;
};
/**
 * Legacy direct-DM ingress decision with command-authorization compatibility fields.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
type ResolvedInboundDirectDmAccess = {
  access: {
    decision: "allow" | "block" | "pairing";
    reasonCode: DmGroupAccessReasonCode;
    reason: string;
    effectiveAllowFrom: string[];
  };
  shouldComputeAuth: boolean;
  senderAllowedForCommands: boolean;
  commandAuthorized: boolean | undefined;
};
/**
 * Resolves legacy direct-DM access lists, pairing-store entries, and command authorization.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveInboundDirectDmAccessWithRuntime(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  accountId: string;
  dmPolicy?: string | null;
  allowFrom?: Array<string | number> | null;
  senderId: string;
  rawBody: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
  resolveAccessGroupMembership?: AccessGroupMembershipResolver;
  runtime: DirectDmCommandAuthorizationRuntime;
  modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
  readStoreAllowFrom?: (provider: ChannelId, accountId: string) => Promise<string[]>;
}): Promise<ResolvedInboundDirectDmAccess>;
/**
 * Creates a pre-crypto authorizer that can issue pairing challenges before payload decryption.
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function createPreCryptoDirectDmAuthorizer(params: {
  resolveAccess: (
    senderId: string,
  ) => Promise<Pick<ResolvedInboundDirectDmAccess, "access"> | ResolvedInboundDirectDmAccess>;
  issuePairingChallenge?: (params: {
    senderId: string;
    reply: (text: string) => Promise<void>;
  }) => Promise<void>;
  onBlocked?: (params: {
    senderId: string;
    reason: string;
    reasonCode: DmGroupAccessReasonCode;
  }) => void;
}): (input: {
  senderId: string;
  reply: (text: string) => Promise<void>;
}) => Promise<"allow" | "block" | "pairing">;
//#endregion
export {
  resolveInboundDirectDmAccessWithRuntime as i,
  ResolvedInboundDirectDmAccess as n,
  createPreCryptoDirectDmAuthorizer as r,
  DirectDmCommandAuthorizationRuntime as t,
};
