import { i as ConfiguredBindingResolution } from "./binding-types-DrvK0cKt.js";
import { t as ResolvedAgentRoute } from "./resolve-route-CtaxCE-K.js";
import {
  c as SessionBindingRecord,
  r as ConversationRef,
} from "./session-binding.types-BbT2v6Ty.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/plugins/binding-routing.d.ts
/**
 * Route resolution after applying a configured channel binding.
 */
type ConfiguredBindingRouteResult = {
  bindingResolution: ConfiguredBindingResolution | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
};
/**
 * Route resolution after applying a runtime conversation binding record.
 */
type RuntimeConversationBindingRouteResult = {
  bindingRecord: SessionBindingRecord | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
};
type ConfiguredBindingRouteConversationInput =
  | {
      conversation: ConversationRef;
    }
  | {
      channel: string;
      accountId: string;
      conversationId: string;
      parentConversationId?: string;
    };
/**
 * Rewrites an agent route when the current conversation matches a configured binding.
 */
declare function resolveConfiguredBindingRoute(
  params: {
    cfg: OpenClawConfig;
    route: ResolvedAgentRoute;
  } & ConfiguredBindingRouteConversationInput,
): ConfiguredBindingRouteResult;
/**
 * Rewrites an agent route using a persisted runtime conversation binding, when applicable.
 */
declare function resolveRuntimeConversationBindingRoute(
  params: {
    route: ResolvedAgentRoute;
  } & ConfiguredBindingRouteConversationInput,
): RuntimeConversationBindingRouteResult;
/**
 * Ensures a configured binding target is ready without blocking route resolution indefinitely.
 */
declare function ensureConfiguredBindingRouteReady(params: {
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
//#endregion
export {
  resolveRuntimeConversationBindingRoute as a,
  resolveConfiguredBindingRoute as i,
  RuntimeConversationBindingRouteResult as n,
  ensureConfiguredBindingRouteReady as r,
  ConfiguredBindingRouteResult as t,
};
