import { t as OutboundDeliveryResult } from "./deliver-types-Df1s0J7e.js";
import { t as ChatChannelId } from "./ids-BUiVO67E.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-Bu7WWq9f.js";
import { t as ChannelPairingAdapter } from "./pairing.types-WpVktPzR.js";
import { n as ResolvedConfiguredAcpBinding } from "./persistent-bindings.resolve-D8pUaJkT.js";
import { C as OpenClawPluginApi, cr as PluginRuntime } from "./types-Ga3mNO_F.js";
import { V as ChannelSecurityAdapter } from "./types.adapters-BND_5Qr-.js";
import { E as ReplyToMode } from "./types.base-ibSxQuK3.js";
import { n as ChannelConfigSchema } from "./types.config-D1pSqbn8.js";
import {
  E as ChannelOutboundSessionRoute,
  L as ChannelThreadingAdapter,
  T as ChannelMeta,
  k as ChannelPollResult,
  w as ChannelMessagingAdapter,
} from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";
//#region src/shared/tailscale-status.d.ts
type TailscaleStatusCommandResult = {
  code: number | null;
  stdout: string;
};
type TailscaleStatusCommandRunner = (
  argv: string[],
  opts: {
    timeoutMs: number;
  },
) => Promise<TailscaleStatusCommandResult>;
/** Resolves the host published to clients for tailnet or Tailscale Serve gateway modes. */
declare function resolveTailscalePublishedHost(params: {
  tailscaleMode: string;
  tailnetHost: string | null;
  serviceName?: string | null;
}): string | null;
/** Runs known Tailscale status commands and returns the first DNS name or tailnet IP found. */
declare function resolveTailnetHostWithRunner(
  runCommandWithTimeout?: TailscaleStatusCommandRunner,
): Promise<string | null>;
/** Finds persistent HTTPS Serve routes whose root proxy targets this gateway port. */
declare function resolveTailscaleServeGatewayUrlsWithRunner(
  gatewayPort: number,
  runCommandWithTimeout?: TailscaleStatusCommandRunner,
): Promise<string[]>;
//#endregion
//#region src/shared/gateway-bind-url.d.ts
type GatewayBindUrlResult =
  | {
      url: string;
      source: "gateway.bind=custom" | "gateway.bind=tailnet" | "gateway.bind=lan";
    }
  | {
      error: string;
    }
  | null;
/** Resolves the externally advertised gateway URL for non-loopback bind modes. */
declare function resolveGatewayBindUrl(params: {
  bind?: string;
  customBindHost?: string;
  scheme: "ws" | "wss";
  port: number;
  pickTailnetHost: () => string | null;
  pickLanHost: () => string | null;
}): GatewayBindUrlResult;
//#endregion
//#region src/plugin-sdk/core.d.ts
/** Ensure a configured ACP binding has live runtime state before channel delivery uses it. */
declare function ensureConfiguredAcpBindingReady(params: {
  cfg: OpenClawConfig;
  configuredBinding: ResolvedConfiguredAcpBinding | null;
}): Promise<
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    }
>;
/** Params passed to a channel adapter when resolving outbound session routing. */
type ChannelOutboundSessionRouteParams = Parameters<
  NonNullable<ChannelMessagingAdapter["resolveOutboundSessionRoute"]>
>[0];
/** Resolve bundled chat channel metadata while respecting the active bundled-plugin directory. */
declare function getChatChannelMeta(id: ChatChannelId): ChannelMeta;
/** Remove one of the known provider prefixes from a free-form target string. */
declare function stripChannelTargetPrefix(raw: string, ...providers: string[]): string;
/** Remove generic target-kind prefixes such as `user:` or `group:`. */
declare function stripTargetKindPrefix(raw: string): string;
/**
 * Build the canonical outbound session route payload returned by channel
 * message adapters.
 */
declare function buildChannelOutboundSessionRoute(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  recipientSessionExact?: boolean | "direct-alias" | "delivery-identity";
  peer: {
    kind: "direct" | "group" | "channel";
    id: string;
  };
  chatType: "direct" | "group" | "channel";
  from: string;
  to: string;
  threadId?: string | number;
}): ChannelOutboundSessionRoute;
/** Candidate source used when choosing a thread id for outbound session routing. */
type ThreadAwareOutboundSessionRouteThreadSource = "replyToId" | "threadId" | "currentSession";
/** Recovery context passed before reusing the current session thread id. */
type ThreadAwareOutboundSessionRouteRecoveryContext = {
  route: ChannelOutboundSessionRoute;
  currentBaseSessionKey: string;
  currentThreadId: string;
};
/** Recover the current thread id when the current session belongs to the same base route. */
declare function recoverCurrentThreadSessionId(params: {
  route: ChannelOutboundSessionRoute;
  currentSessionKey?: string | null;
  canRecover?: (context: ThreadAwareOutboundSessionRouteRecoveryContext) => boolean;
}): string | undefined;
/** Add thread-aware session keys and route thread ids to an outbound channel route. */
declare function buildThreadAwareOutboundSessionRoute(params: {
  route: ChannelOutboundSessionRoute;
  replyToId?: string | number | null;
  threadId?: string | number | null;
  currentSessionKey?: string | null;
  precedence?: readonly ThreadAwareOutboundSessionRouteThreadSource[];
  useSuffix?: boolean;
  parentSessionKey?: string;
  normalizeThreadId?: (threadId: string) => string;
  canRecoverCurrentThread?: (context: ThreadAwareOutboundSessionRouteRecoveryContext) => boolean;
}): ChannelOutboundSessionRoute;
/** Options for a channel plugin entry that should register a channel capability. */
type ChannelEntryConfigSchema<TPlugin> =
  TPlugin extends ChannelPlugin<unknown>
    ? NonNullable<TPlugin["configSchema"]>
    : ChannelConfigSchema;
type DefineChannelPluginEntryOptions<TPlugin = ChannelPlugin> = {
  id: string;
  name: string;
  description: string;
  plugin: TPlugin;
  configSchema?: ChannelEntryConfigSchema<TPlugin> | (() => ChannelEntryConfigSchema<TPlugin>);
  setRuntime?: (runtime: PluginRuntime) => void;
  registerCliMetadata?: (api: OpenClawPluginApi) => void;
  registerFull?: (api: OpenClawPluginApi) => void;
};
type DefinedChannelPluginEntry<TPlugin> = {
  id: string;
  name: string;
  description: string;
  configSchema: ChannelEntryConfigSchema<TPlugin>;
  register: (api: OpenClawPluginApi) => void;
  channelPlugin: TPlugin;
  setChannelRuntime?: (runtime: PluginRuntime) => void;
};
type CreateChannelPluginBaseOptions<TResolvedAccount> = {
  id: ChannelPlugin<TResolvedAccount>["id"];
  meta?: Partial<NonNullable<ChannelPlugin<TResolvedAccount>["meta"]>>;
  setupWizard?: NonNullable<ChannelPlugin<TResolvedAccount>["setupWizard"]>;
  capabilities?: ChannelPlugin<TResolvedAccount>["capabilities"];
  commands?: ChannelPlugin<TResolvedAccount>["commands"];
  doctor?: ChannelPlugin<TResolvedAccount>["doctor"];
  agentPrompt?: ChannelPlugin<TResolvedAccount>["agentPrompt"];
  streaming?: ChannelPlugin<TResolvedAccount>["streaming"];
  reload?: ChannelPlugin<TResolvedAccount>["reload"];
  gatewayMethods?: ChannelPlugin<TResolvedAccount>["gatewayMethods"];
  gatewayMethodDescriptors?: ChannelPlugin<TResolvedAccount>["gatewayMethodDescriptors"];
  configSchema?: ChannelPlugin<TResolvedAccount>["configSchema"];
  config?: ChannelPlugin<TResolvedAccount>["config"];
  security?: ChannelPlugin<TResolvedAccount>["security"];
  setup: NonNullable<ChannelPlugin<TResolvedAccount>["setup"]>;
  groups?: ChannelPlugin<TResolvedAccount>["groups"];
};
type CreatedChannelPluginBase<TResolvedAccount> = Pick<
  ChannelPlugin<TResolvedAccount>,
  "id" | "meta" | "setup"
> &
  Partial<
    Pick<
      ChannelPlugin<TResolvedAccount>,
      | "setupWizard"
      | "capabilities"
      | "commands"
      | "doctor"
      | "agentPrompt"
      | "streaming"
      | "reload"
      | "gatewayMethods"
      | "gatewayMethodDescriptors"
      | "configSchema"
      | "config"
      | "security"
      | "groups"
    >
  >;
/**
 * Canonical entry helper for channel plugins.
 *
 * This wraps `definePluginEntry(...)`, registers the channel capability, and
 * optionally exposes extra full-runtime registration such as tools or gateway
 * handlers that only make sense outside setup-only registration modes.
 */
declare function defineChannelPluginEntry<TPlugin>({
  id,
  name,
  description,
  plugin,
  configSchema,
  setRuntime,
  registerCliMetadata,
  registerFull,
}: DefineChannelPluginEntryOptions<TPlugin>): DefinedChannelPluginEntry<TPlugin>;
/**
 * Minimal setup-entry helper for channels that ship a separate `setup-entry.ts`.
 *
 * The setup entry only needs to export `{ plugin }`, but using this helper
 * keeps the shape explicit in examples and generated typings.
 */
declare function defineSetupPluginEntry<TPlugin>(plugin: TPlugin): {
  plugin: TPlugin;
};
type ChatChannelPluginBase<TResolvedAccount, Probe, Audit> = Omit<
  ChannelPlugin<TResolvedAccount, Probe, Audit>,
  "security" | "pairing" | "threading" | "outbound"
> &
  Partial<
    Pick<
      ChannelPlugin<TResolvedAccount, Probe, Audit>,
      "security" | "pairing" | "threading" | "outbound"
    >
  >;
type ChatChannelSecurityOptions<
  TResolvedAccount extends {
    accountId?: string | null;
  },
> = {
  dm: {
    channelKey: string;
    resolvePolicy: (account: TResolvedAccount) => string | null | undefined;
    resolveAllowFrom: (account: TResolvedAccount) => Array<string | number> | null | undefined;
    resolveFallbackAccountId?: (account: TResolvedAccount) => string | null | undefined;
    defaultPolicy?: string;
    allowFromPathSuffix?: string;
    policyPathSuffix?: string;
    approveChannelId?: string;
    approveHint?: string;
    normalizeEntry?: (raw: string) => string;
    inheritSharedDefaultsFromDefaultAccount?: boolean;
  };
  collectWarnings?: ChannelSecurityAdapter<TResolvedAccount>["collectWarnings"];
  collectAuditFindings?: ChannelSecurityAdapter<TResolvedAccount>["collectAuditFindings"];
};
type ChatChannelPairingOptions = {
  text: {
    idLabel: string;
    message: string;
    normalizeAllowEntry?: ChannelPairingAdapter["normalizeAllowEntry"];
    notify: (
      params: Parameters<NonNullable<ChannelPairingAdapter["notifyApproval"]>>[0] & {
        message: string;
      },
    ) => Promise<void> | void;
  };
};
type ChatChannelThreadingReplyModeOptions<TResolvedAccount> =
  | {
      topLevelReplyToMode: string;
    }
  | {
      scopedAccountReplyToMode: {
        resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TResolvedAccount;
        resolveReplyToMode: (
          account: TResolvedAccount,
          chatType?: string | null,
        ) => ReplyToMode | null | undefined;
        fallback?: ReplyToMode;
      };
    }
  | {
      resolveReplyToMode: NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
    };
type ChatChannelThreadingOptions<TResolvedAccount> =
  ChatChannelThreadingReplyModeOptions<TResolvedAccount> &
    Omit<ChannelThreadingAdapter, "resolveReplyToMode">;
type ChatChannelAttachedOutboundOptions = {
  base: Omit<ChannelOutboundAdapter, "sendText" | "sendMedia" | "sendPoll">;
  attachedResults: {
    channel: string;
    sendText?: (
      ctx: Parameters<NonNullable<ChannelOutboundAdapter["sendText"]>>[0],
    ) => MaybePromise<Omit<OutboundDeliveryResult, "channel">>;
    sendMedia?: (
      ctx: Parameters<NonNullable<ChannelOutboundAdapter["sendMedia"]>>[0],
    ) => MaybePromise<Omit<OutboundDeliveryResult, "channel">>;
    sendPoll?: (
      ctx: Parameters<NonNullable<ChannelOutboundAdapter["sendPoll"]>>[0],
    ) => MaybePromise<Omit<ChannelPollResult, "channel">>;
  };
};
type MaybePromise<T> = T | Promise<T>;
/**
 * Build a chat-style channel plugin by composing common security, pairing,
 * threading, and outbound adapters around a channel-specific base.
 */
declare function createChatChannelPlugin<
  TResolvedAccount extends {
    accountId?: string | null;
  },
  Probe = unknown,
  Audit = unknown,
>(params: {
  base: ChatChannelPluginBase<TResolvedAccount, Probe, Audit>;
  security?:
    | ChannelSecurityAdapter<TResolvedAccount>
    | ChatChannelSecurityOptions<TResolvedAccount>;
  pairing?: ChannelPairingAdapter | ChatChannelPairingOptions;
  threading?: ChannelThreadingAdapter | ChatChannelThreadingOptions<TResolvedAccount>;
  outbound?: ChannelOutboundAdapter | ChatChannelAttachedOutboundOptions;
}): ChannelPlugin<TResolvedAccount, Probe, Audit>;
/** Create the shared base object for channel plugins that override only selected surfaces. */
declare function createChannelPluginBase<TResolvedAccount>(
  params: CreateChannelPluginBaseOptions<TResolvedAccount>,
): CreatedChannelPluginBase<TResolvedAccount>;
//#endregion
export {
  TailscaleStatusCommandResult as _,
  buildThreadAwareOutboundSessionRoute as a,
  resolveTailscalePublishedHost as b,
  defineChannelPluginEntry as c,
  getChatChannelMeta as d,
  recoverCurrentThreadSessionId as f,
  resolveGatewayBindUrl as g,
  GatewayBindUrlResult as h,
  buildChannelOutboundSessionRoute as i,
  defineSetupPluginEntry as l,
  stripTargetKindPrefix as m,
  ThreadAwareOutboundSessionRouteRecoveryContext as n,
  createChannelPluginBase as o,
  stripChannelTargetPrefix as p,
  ThreadAwareOutboundSessionRouteThreadSource as r,
  createChatChannelPlugin as s,
  ChannelOutboundSessionRouteParams as t,
  ensureConfiguredAcpBindingReady as u,
  TailscaleStatusCommandRunner as v,
  resolveTailscaleServeGatewayUrlsWithRunner as x,
  resolveTailnetHostWithRunner as y,
};
