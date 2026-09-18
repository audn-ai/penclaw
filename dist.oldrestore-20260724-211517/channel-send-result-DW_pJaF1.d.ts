import { t as OutboundDeliveryResult } from "./deliver-types-Df1s0J7e.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-Bu7WWq9f.js";
import { k as ChannelPollResult } from "./types.core-CcwzPNhX.js";
//#region src/plugin-sdk/channel-send-result.d.ts
/**
 * Legacy raw send result shape accepted from channel SDK adapters.
 * @deprecated Return `OutboundDeliveryResult` and use
 * `createAttachedChannelResultAdapter`. Removal with the next plugin-SDK major.
 */
type ChannelSendRawResult = {
  /** Whether the channel send operation succeeded. */ ok: boolean /** Platform message id; null/undefined normalizes to the empty-id sentinel. */;
  messageId?: string | null /** Legacy error text converted to an Error for outbound callers. */;
  error?: string | null;
};
/** Attaches the channel id to a single outbound send result. */
declare function attachChannelToResult<T extends object>(
  /** Channel id to stamp onto the returned delivery result. */
  channel: string /** Delivery-shaped result without channel metadata. */,
  result: T,
): {
  channel: string;
} & T;
/** Attaches the channel id to each outbound send result in order. */
declare function attachChannelToResults<T extends object>(
  /** Channel id to stamp onto every returned delivery result. */

  channel: string /** Ordered delivery-shaped results without channel metadata. */,

  results: readonly T[],
): ({
  channel: string;
} & T)[];
/** Creates an empty outbound delivery result for send paths that produced no platform id. */
declare function createEmptyChannelResult(
  /** Channel id attached to the synthetic empty result. */

  channel: string /** Additional delivery metadata to preserve alongside the empty message id. */,

  result?: Partial<Omit<OutboundDeliveryResult, "channel" | "messageId">> & {
    messageId?: string;
  },
): OutboundDeliveryResult;
type MaybePromise<T> = T | Promise<T>;
type SendTextParams = Parameters<NonNullable<ChannelOutboundAdapter["sendText"]>>[0];
type SendMediaParams = Parameters<NonNullable<ChannelOutboundAdapter["sendMedia"]>>[0];
type SendPollParams = Parameters<NonNullable<ChannelOutboundAdapter["sendPoll"]>>[0];
/** Wraps outbound send methods that already return delivery-shaped results without channel ids. */
declare function createAttachedChannelResultAdapter(params: {
  /** Channel id attached to every wrapped send result. */ channel: string /** Text sender that returns an outbound result without channel metadata. */;
  sendText?: (
    ctx: SendTextParams,
  ) => MaybePromise<
    Omit<OutboundDeliveryResult, "channel">
  > /** Media sender that returns an outbound result without channel metadata. */;
  sendMedia?: (
    ctx: SendMediaParams,
  ) => MaybePromise<
    Omit<OutboundDeliveryResult, "channel">
  > /** Poll sender that returns a poll result without channel metadata. */;
  sendPoll?: (ctx: SendPollParams) => MaybePromise<Omit<ChannelPollResult, "channel">>;
}): Pick<ChannelOutboundAdapter, "sendText" | "sendMedia" | "sendPoll">;
/** Wraps legacy raw text/media send methods and normalizes their results. */
declare function createRawChannelSendResultAdapter(params: {
  /** Channel id attached to every normalized legacy send result. */ channel: string /** Legacy text sender that returns ok/messageId/error fields. */;
  sendText?: (
    ctx: SendTextParams,
  ) => MaybePromise<ChannelSendRawResult> /** Legacy media sender that returns ok/messageId/error fields. */;
  sendMedia?: (ctx: SendMediaParams) => MaybePromise<ChannelSendRawResult>;
}): Pick<ChannelOutboundAdapter, "sendText" | "sendMedia">;
/** Normalize raw channel send results into the shape shared outbound callers expect. */
declare function buildChannelSendResult(
  /** Channel id attached to the normalized delivery result. */

  channel: string /** Legacy raw channel result to normalize. */,

  result: ChannelSendRawResult,
): {
  channel: string;
  ok: boolean;
  messageId: string;
  error: Error | undefined;
};
//#endregion
export {
  createAttachedChannelResultAdapter as a,
  buildChannelSendResult as i,
  attachChannelToResult as n,
  createEmptyChannelResult as o,
  attachChannelToResults as r,
  createRawChannelSendResultAdapter as s,
  ChannelSendRawResult as t,
};
