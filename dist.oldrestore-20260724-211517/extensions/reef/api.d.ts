import { t as reefPlugin } from "../../channel-Cq5BlpFs.js";
import {
  a as ReefInboxConnection,
  i as ReefFriendManager,
  n as createConfiguredGuard,
  o as ReefTransportClient,
  s as WebSocketLike,
  t as ReefMessageFlow,
} from "../../flow-DSZM7wnH.js";
import { n as ChannelOutboundAdapter } from "../../outbound.types-Bu7WWq9f.js";
import {
  a as ReefKeys,
  i as ReefIngressMessage,
  n as ReefAccount,
  o as RelayFriend,
  r as ReefDependencies,
  t as InboxEntry,
} from "../../types-DrH-EmQY.js";
import { P as MessageReceipt, b as ChannelMessageSendTextContext } from "../../types-FwtQl4mH.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/reef/src/outbound.d.ts
declare const reefOutboundAdapter: ChannelOutboundAdapter;
declare const reefMessageAdapter: {
  readonly id: "reef";
  readonly durableFinal: {
    readonly capabilities: {
      readonly text: true;
      readonly replyTo: true;
      readonly thread: true;
    };
  };
  readonly send: {
    readonly text: (ctx: ChannelMessageSendTextContext<OpenClawConfig>) => Promise<{
      receipt: MessageReceipt;
      messageId: string;
    }>;
  };
  readonly receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
} & {
  receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
};
//#endregion
export {
  type InboxEntry,
  type ReefAccount,
  type ReefDependencies,
  ReefFriendManager,
  ReefInboxConnection,
  type ReefIngressMessage,
  type ReefKeys,
  ReefMessageFlow,
  ReefTransportClient,
  type RelayFriend,
  type WebSocketLike,
  createConfiguredGuard,
  reefMessageAdapter,
  reefOutboundAdapter,
  reefPlugin,
};
