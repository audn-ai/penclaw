import { p as requestPluginConversationBinding } from "./conversation-binding-RTx7boCU.js";
import {
  n as PluginConversationBindingRequestParams,
  t as PluginConversationBinding,
} from "./conversation-binding.types-FpB9wxq5.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { a as GatewayRequestOptions, t as GatewayRequestContext } from "./types-Dz3ohwUV.js";
import { dt as PluginInteractiveHandlerRegistration } from "./types-Ga3mNO_F.js";

//#region src/plugins/interactive-binding-helpers.d.ts
type RegisteredInteractiveMetadata = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
type PluginBindingConversation = Parameters<
  typeof requestPluginConversationBinding
>[0]["conversation"];
declare function createInteractiveConversationBindingHelpers(params: {
  registration: RegisteredInteractiveMetadata;
  senderId?: string;
  conversation: PluginBindingConversation;
}): {
  requestConversationBinding: (binding?: PluginConversationBindingRequestParams) => Promise<
    | {
        status: "bound";
        binding: PluginConversationBinding;
      }
    | {
        status: "pending";
        approvalId: string;
        reply: ReplyPayload;
      }
    | {
        status: "error";
        message: string;
      }
  >;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
//#endregion
//#region src/plugins/interactive-state.d.ts
/** Registered interactive handler with owning plugin metadata. */
type RegisteredInteractiveHandler = PluginInteractiveHandlerRegistration & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  registryOwned?: true;
};
//#endregion
//#region src/plugins/interactive-registry.d.ts
/** Registration result for plugin interactive namespace handlers. */
type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};
/** Registers one process-global interactive handler. */
declare function registerPluginInteractiveHandler(
  pluginId: string,
  registration: PluginInteractiveHandlerRegistration,
  opts?: {
    pluginName?: string;
    pluginRoot?: string;
  },
): InteractiveRegistrationResult;
/** Clears all active plugin interactive handlers. */
declare function clearPluginInteractiveHandlers(): void;
/** Clears active interactive handlers owned by one plugin. */
declare function clearPluginInteractiveHandlersForPlugin(pluginId: string): void;
//#endregion
//#region src/plugins/interactive.d.ts
type InteractiveDispatchResult<TResult = unknown> =
  | {
      matched: false;
      handled: false;
      duplicate: false;
    }
  | {
      matched: true;
      handled: boolean;
      duplicate: boolean;
      result?: TResult;
    };
type PluginInteractiveDispatchRegistration = {
  channel: string;
  namespace: string;
};
/** Resolved interactive handler match passed to plugin callback dispatch. */
type PluginInteractiveMatch<TRegistration extends PluginInteractiveDispatchRegistration> = {
  registration: RegisteredInteractiveHandler & TRegistration;
  namespace: string;
  payload: string;
};
/** Dispatches one interactive callback payload to a matching plugin handler. */
declare function dispatchPluginInteractiveHandler<
  TRegistration extends PluginInteractiveDispatchRegistration,
  TResult extends {
    handled?: boolean;
  } | void = {
    handled?: boolean;
  } | void,
>(params: {
  channel: TRegistration["channel"];
  data: string;
  dedupeId?: string;
  onMatched?: () => Promise<void> | void;
  invoke: (match: PluginInteractiveMatch<TRegistration>) => Promise<TResult> | TResult;
  afterInvoke?: (result: TResult) => Promise<void> | void;
}): Promise<InteractiveDispatchResult<TResult>>;
//#endregion
//#region src/plugins/lazy-service-module.d.ts
type LazyServiceModule = Record<string, unknown>;
type LazyPluginServiceHandle = {
  stop: () => Promise<void>;
};
declare function defaultLoadOverrideModule(
  specifier: string,
  importModule?: (specifier: string) => Promise<LazyServiceModule>,
): Promise<LazyServiceModule>;
declare function startLazyPluginServiceModule(params: {
  skipEnvVar?: string;
  overrideEnvVar?: string;
  validateOverrideSpecifier?: (specifier: string) => string;
  loadDefaultModule: () => Promise<LazyServiceModule>;
  loadOverrideModule?: (specifier: string) => Promise<LazyServiceModule>;
  startExportNames: string[];
  stopExportNames?: string[];
}): Promise<LazyPluginServiceHandle | null>;
//#endregion
//#region src/plugins/runtime/gateway-request-scope.d.ts
type PluginRuntimeGatewayRequestScope = {
  context?: GatewayRequestContext;
  client?: GatewayRequestOptions["client"];
  isWebchatConnect: GatewayRequestOptions["isWebchatConnect"];
  pluginId?: string;
  pluginSource?: string;
  pluginOrigin?: PluginOrigin;
  pluginTrustedOfficialInstall?: boolean;
  gatewayMethodDispatchAllowed?: boolean;
};
/**
 * Returns the current plugin gateway request scope when called from a plugin request handler.
 */
declare function getPluginRuntimeGatewayRequestScope():
  | PluginRuntimeGatewayRequestScope
  | undefined;
//#endregion
export {
  PluginInteractiveMatch as a,
  clearPluginInteractiveHandlers as c,
  createInteractiveConversationBindingHelpers as d,
  startLazyPluginServiceModule as i,
  clearPluginInteractiveHandlersForPlugin as l,
  LazyPluginServiceHandle as n,
  dispatchPluginInteractiveHandler as o,
  defaultLoadOverrideModule as r,
  InteractiveRegistrationResult as s,
  getPluginRuntimeGatewayRequestScope as t,
  registerPluginInteractiveHandler as u,
};
