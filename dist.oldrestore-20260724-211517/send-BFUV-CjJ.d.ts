import {
  i as OutboundDeliveryIntent,
  t as DeliverOutboundPayloadsParams,
} from "./deliver-CNrSs2eV.js";
import {
  r as OutboundPayloadDeliverySuppressionReason,
  t as OutboundDeliveryResult,
} from "./deliver-types-Df1s0J7e.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import {
  A as LiveMessageState,
  N as MessageDurabilityPolicy,
  O as DurableMessageSendIntent,
  P as MessageReceipt,
  R as MessageSendContext,
  z as RenderedMessageBatch,
} from "./types-FwtQl4mH.js";

//#region src/channels/message/send.d.ts
type DurableMessageBatchSendParams = Omit<
  DeliverOutboundPayloadsParams,
  "abortSignal" | "onDeliveryIntent" | "payloads" | "queuePolicy"
> & {
  payloads: ReplyPayload[];
  attempt?: number;
  signal?: AbortSignal /** @deprecated Use `signal`. */;
  abortSignal?: AbortSignal;
  previousReceipt?: MessageReceipt;
};
type DurableMessageSuppressionReason =
  | OutboundPayloadDeliverySuppressionReason
  | "no_visible_result";
type DurableMessageFailureStage = "platform_send" | "queue" | "unknown";
type DurableMessagePayloadDeliveryOutcome =
  | {
      index: number;
      status: "sent";
      results: OutboundDeliveryResult[];
    }
  | {
      index: number;
      status: "suppressed";
      reason: DurableMessageSuppressionReason;
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
      stage: DurableMessageFailureStage;
    };
type DurableMessageBatchSendResult =
  | {
      status: "sent";
      results: OutboundDeliveryResult[];
      receipt: MessageReceipt;
      deliveryIntent?: OutboundDeliveryIntent;
      payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
    }
  | {
      status: "suppressed";
      results: [];
      receipt: MessageReceipt;
      deliveryIntent?: OutboundDeliveryIntent;
      reason: DurableMessageSuppressionReason;
      payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
    }
  | {
      status: "partial_failed";
      results: OutboundDeliveryResult[];
      receipt: MessageReceipt;
      error: unknown;
      sentBeforeError: true;
      deliveryIntent?: OutboundDeliveryIntent;
      payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
    }
  | {
      status: "failed";
      error: unknown;
      stage?: DurableMessageFailureStage;
      payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
    };
type SerializedDurableMessagePayloadOutcome =
  | {
      index: number;
      status: "sent";
      resultCount: number;
    }
  | {
      index: number;
      status: "suppressed";
      reason: DurableMessageSuppressionReason;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }
  | {
      index: number;
      status: "failed";
      error: string;
      sentBeforeError: boolean;
      stage: DurableMessageFailureStage;
    };
type DurableMessageSendContextParams = DurableMessageBatchSendParams & {
  durability?: Exclude<
    MessageDurabilityPolicy,
    "disabled"
  > /** Runs after the durable queue intent exists and before platform delivery starts. */;
  onDeliveryIntent?: (intent: DurableMessageSendIntent) => void;
  preview?: LiveMessageState<ReplyPayload>;
  onPreviewUpdate?: (
    rendered: RenderedMessageBatch<ReplyPayload>,
    state: LiveMessageState<ReplyPayload>,
  ) => Promise<LiveMessageState<ReplyPayload>> | LiveMessageState<ReplyPayload>;
  onEditReceipt?: (
    receipt: MessageReceipt,
    rendered: RenderedMessageBatch<ReplyPayload>,
  ) => Promise<MessageReceipt> | MessageReceipt;
  onDeleteReceipt?: (receipt: MessageReceipt) => Promise<void> | void;
  onCommitReceipt?: (receipt: MessageReceipt) => Promise<void> | void;
  onSendFailure?: (error: unknown) => Promise<void> | void;
};
type DurableMessageSendContext = MessageSendContext<ReplyPayload, DurableMessageBatchSendResult>;
//#endregion
export {
  SerializedDurableMessagePayloadOutcome as a,
  DurableMessageSendContextParams as i,
  DurableMessageBatchSendResult as n,
  DurableMessageSendContext as r,
  DurableMessageBatchSendParams as t,
};
