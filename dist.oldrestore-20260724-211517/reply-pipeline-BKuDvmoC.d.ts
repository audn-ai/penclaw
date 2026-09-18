import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import {
  i as createReplyPrefixOptions,
  n as ReplyPrefixOptions,
  o as CreateTypingCallbacksParams,
  s as TypingCallbacks,
  t as ReplyPrefixContextBundle,
} from "./reply-prefix-CA4uLlTg.js";
import { _ as InboundEventKind, s as CommandTurnContext } from "./templating-h3OQefFR.js";
import { a as SourceReplyDeliveryMode } from "./types-BgrDi5xH.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/reply/source-reply-delivery-mode.d.ts
/** Minimal inbound context needed for source-reply delivery decisions. */
type SourceReplyDeliveryModeContext = {
  ChatType?: string;
  InboundEventKind?: InboundEventKind;
  Provider?: string;
  Surface?: string;
  ExplicitDeliverRoute?: boolean;
  CommandAuthorized?: boolean;
  CommandBody?: string;
  CommandSource?: "text" | "native";
  CommandTurn?: CommandTurnContext;
  BotUsername?: string;
};
//#endregion
//#region src/channels/message/reply-pipeline.d.ts
type ReplyPrefixContext = ReplyPrefixContextBundle["prefixContext"];
/** Resolves whether a channel reply should use source delivery, message tools, or direct sending. */
declare function resolveChannelSourceReplyDeliveryMode(params: {
  /** Full config used to inspect source-reply delivery settings. */ cfg: OpenClawConfig /** Reply delivery context from the current channel turn. */;
  ctx: SourceReplyDeliveryModeContext /** Caller-requested delivery mode override. */;
  requested?: SourceReplyDeliveryMode /** Whether the message-send tool is available for this turn. */;
  messageToolAvailable?: boolean;
}): SourceReplyDeliveryMode;
/** Reply pipeline options shared by core channel turns and plugin SDK callers. */
type ChannelReplyPipeline = ReplyPrefixOptions & {
  /** Resolves a response prefix against the pipeline's live selected-model context. */ resolveResponsePrefix?: () =>
    | string
    | undefined /** Optional typing lifecycle callbacks for reply generation. */;
  typingCallbacks?: TypingCallbacks /** Optional payload transform applied before channel delivery. */;
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};
/** Parameters for building a channel reply pipeline with prefix, typing, and payload transforms. */
type CreateChannelReplyPipelineParams = {
  /** Full config used for reply prefix and channel plugin transform resolution. */ cfg: Parameters<
    typeof createReplyPrefixOptions
  >[0]["cfg"] /** Agent id used in reply prefix context. */;
  agentId: string /** Optional channel id for prefix context and plugin transform lookup. */;
  channel?: string /** Optional channel account id for prefix context and plugin transform lookup. */;
  accountId?: string /** Typing callback factory input. */;
  typing?: CreateTypingCallbacksParams /** Prebuilt typing callbacks that take precedence over `typing`. */;
  typingCallbacks?: TypingCallbacks /** Explicit payload transform; avoids channel plugin lookup when provided. */;
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};
/** Builds the reply pipeline used by channel turns and plugin SDK reply helpers. */
declare function createChannelReplyPipeline(
  params: CreateChannelReplyPipelineParams,
): ChannelReplyPipeline;
//#endregion
export {
  resolveChannelSourceReplyDeliveryMode as a,
  createChannelReplyPipeline as i,
  CreateChannelReplyPipelineParams as n,
  ReplyPrefixContext as r,
  ChannelReplyPipeline as t,
};
