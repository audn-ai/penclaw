import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { P as MessageReceipt } from "./types-FwtQl4mH.js";

//#region src/infra/outbound/deliver-types.d.ts
/** Successful channel send result normalized for core delivery accounting. */
type OutboundDeliveryResult = {
  channel: Exclude<ChannelId, "none">;
  messageId: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  timestamp?: number;
  toJid?: string;
  pollId?: string;
  receipt?: MessageReceipt;
  meta?: Record<string, unknown>;
};
/** Reason a payload was intentionally not sent after normalization or hooks. */
type OutboundPayloadDeliverySuppressionReason =
  | "cancelled_by_message_sending_hook"
  | "cancelled_by_reply_payload_sending_hook"
  | "empty_after_message_sending_hook"
  | "empty_after_reply_payload_sending_hook"
  | "no_visible_payload"
  | "adapter_returned_no_identity";
/** Delivery phase where a failure occurred. */
type OutboundDeliveryFailureStage = "platform_send" | "queue" | "unknown";
type OutboundPayloadDeliveryKind = "text" | "media" | "other";
/**
 * Provider assertion that retrying cannot duplicate a recipient-visible send.
 * Never use this after a finalization/send call returned an ambiguous result.
 */
declare class PlatformMessageNotDispatchedError extends Error {
  readonly code = "OPENCLAW_PLATFORM_MESSAGE_NOT_DISPATCHED";
  constructor(
    message: string,
    options: {
      cause: unknown;
    },
  );
}
/** Per-payload delivery status emitted to callers and channel send summaries. */
type OutboundPayloadDeliveryOutcome =
  | {
      index: number;
      status: "sent";
      results: OutboundDeliveryResult[] /** Effective post-hook, post-render payload kind. */;
      deliveryKind?: OutboundPayloadDeliveryKind;
    }
  | {
      index: number;
      status: "suppressed";
      reason: OutboundPayloadDeliverySuppressionReason;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }
  | {
      index: number;
      status: "failed";
      error: unknown;
      sentBeforeError: boolean;
      stage: OutboundDeliveryFailureStage /** Identified platform sends from this payload before its terminal failure. */;
      results?: OutboundDeliveryResult[] /** Effective post-hook, post-render payload kind when platform delivery began. */;
      deliveryKind?: OutboundPayloadDeliveryKind;
    };
//#endregion
export {
  PlatformMessageNotDispatchedError as i,
  OutboundPayloadDeliveryOutcome as n,
  OutboundPayloadDeliverySuppressionReason as r,
  OutboundDeliveryResult as t,
};
