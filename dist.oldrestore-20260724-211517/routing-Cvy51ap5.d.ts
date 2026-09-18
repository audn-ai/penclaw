import { n as RoutePeer } from "./resolve-route-CtaxCE-K.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/routing/bindings.d.ts
declare function listBoundAccountIds(cfg: OpenClawConfig, channelId: string): string[];
declare function resolveDefaultAgentBoundAccountId(
  cfg: OpenClawConfig,
  channelId: string,
): string | null;
//#endregion
//#region src/routing/default-account-warnings.d.ts
declare function formatSetExplicitDefaultInstruction(channelKey: string): string;
declare function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string;
//#endregion
//#region src/infra/outbound/base-session-key.d.ts
/**
 * Builds the canonical outbound base-session key for a resolved route peer.
 *
 * Mirrors the routing layer's session-scope rules so outbound-only sends and
 * inbound route resolution keep the same `dmScope` and identity-link behavior.
 */
declare function buildOutboundBaseSessionKey(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
}): string;
//#endregion
//#region src/infra/outbound/thread-id.d.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
declare function normalizeOutboundThreadId(value?: string | number | null): string | undefined;
//#endregion
export {
  listBoundAccountIds as a,
  formatSetExplicitDefaultToConfiguredInstruction as i,
  buildOutboundBaseSessionKey as n,
  resolveDefaultAgentBoundAccountId as o,
  formatSetExplicitDefaultInstruction as r,
  normalizeOutboundThreadId as t,
};
