import { n as ChannelOutboundAdapter } from "./outbound.types-Bu7WWq9f.js";
import { t as ResolvedSynologyChatAccount } from "./types-BQ8nQjNk.js";
import {
  P as MessageReceipt,
  b as ChannelMessageSendTextContext,
  h as ChannelMessageSendMediaContext,
} from "./types-FwtQl4mH.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";

//#region extensions/synology-chat/src/channel.d.ts
declare const CHANNEL_ID = "synology-chat";
type SynologyChannelGatewayContext = {
  cfg: OpenClawConfig;
  accountId: string;
  abortSignal: AbortSignal;
  log?: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
};
type SynologyChannelOutboundContext = {
  cfg: OpenClawConfig;
  to: string;
  text?: string;
  mediaUrl?: string;
  accountId?: string | null;
};
type SynologyChannelSendTextContext = SynologyChannelOutboundContext & {
  text: string;
};
type SynologyChannelSendMediaContext = SynologyChannelOutboundContext & {
  mediaUrl: string;
};
type SynologyChatOutboundResult = {
  channel: typeof CHANNEL_ID;
  messageId: string;
  chatId: string;
  receipt: MessageReceipt;
};
type SynologyChatPlugin = Omit<
  ChannelPlugin<ResolvedSynologyChatAccount>,
  "pairing" | "security" | "messaging" | "directory" | "outbound" | "gateway" | "agentPrompt"
> & {
  pairing: {
    idLabel: string;
    normalizeAllowEntry?: (entry: string) => string;
    notifyApproval: (params: { cfg: OpenClawConfig; id: string }) => Promise<void>;
  };
  security: {
    resolveDmPolicy: (params: { cfg: OpenClawConfig; account: ResolvedSynologyChatAccount }) => {
      policy: string | null | undefined;
      allowFrom?: Array<string | number>;
      normalizeEntry?: (raw: string) => string;
    } | null;
    collectWarnings: (params: {
      cfg: OpenClawConfig;
      account: ResolvedSynologyChatAccount;
    }) => string[];
  };
  messaging: {
    targetPrefixes?: readonly string[];
    normalizeTarget: (target: string) => string | undefined;
    resolveOutboundSessionRoute: NonNullable<
      ChannelPlugin<ResolvedSynologyChatAccount>["messaging"]
    >["resolveOutboundSessionRoute"];
    targetResolver: {
      looksLikeId: (id: string) => boolean;
      hint: string;
    };
  };
  directory: {
    self?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["self"];
    listPeers?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["listPeers"];
    listGroups?: NonNullable<ChannelPlugin<ResolvedSynologyChatAccount>["directory"]>["listGroups"];
  };
  outbound: {
    deliveryMode: "gateway";
    textChunkLimit: number;
    sanitizeText: NonNullable<ChannelOutboundAdapter["sanitizeText"]>;
    sendText: (ctx: SynologyChannelSendTextContext) => Promise<SynologyChatOutboundResult>;
    sendMedia: (ctx: SynologyChannelSendMediaContext) => Promise<SynologyChatOutboundResult>;
  };
  message: typeof synologyChatMessageAdapter;
  gateway: {
    startAccount: (ctx: SynologyChannelGatewayContext) => Promise<unknown>;
    stopAccount: (ctx: SynologyChannelGatewayContext) => Promise<void>;
  };
  agentPrompt: {
    messageToolHints: () => string[];
  };
};
declare const synologyChatMessageAdapter: {
  readonly id: "synology-chat";
  readonly durableFinal: {
    readonly capabilities: {
      readonly text: true;
      readonly media: true;
      readonly messageSendingHooks: true;
    };
  };
  readonly send: {
    readonly text: (
      ctx: ChannelMessageSendTextContext<OpenClawConfig>,
    ) => Promise<SynologyChatOutboundResult>;
    readonly media: (
      ctx: ChannelMessageSendMediaContext<OpenClawConfig>,
    ) => Promise<SynologyChatOutboundResult>;
  };
} & {
  receive: {};
};
declare const synologyChatPlugin: SynologyChatPlugin;
//#endregion
export { synologyChatPlugin as t };
