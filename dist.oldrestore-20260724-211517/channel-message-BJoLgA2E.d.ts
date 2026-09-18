import {
  n as CreateChannelReplyPipelineParams,
  t as ChannelReplyPipeline,
} from "./reply-pipeline-BKuDvmoC.js";
import { xr as deliverInboundReplyWithMessageSendContext } from "./types-Ga3mNO_F.js";
//#region src/plugin-sdk/channel-message.d.ts
/** @deprecated Use `createChannelMessageReplyPipeline(...)` from `openclaw/plugin-sdk/channel-outbound`. */
declare function createChannelTurnReplyPipeline(
  params: CreateChannelReplyPipelineParams,
): ChannelReplyPipeline;
/** @deprecated Use `deliverInboundReplyWithMessageSendContext(...)` from `openclaw/plugin-sdk/channel-outbound`. */
declare const deliverDurableInboundReplyPayload: typeof deliverInboundReplyWithMessageSendContext;
//#endregion
export { deliverDurableInboundReplyPayload as n, createChannelTurnReplyPipeline as t };
