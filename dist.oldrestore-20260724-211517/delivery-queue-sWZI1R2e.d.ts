import {
  n as OutboundPayloadDeliveryOutcome,
  t as OutboundDeliveryResult,
} from "./deliver-types-Df1s0J7e.js";
import {
  bn as ReplyDispatchKind,
  lt as PluginHookReplyPayloadSendingContext,
} from "./hook-types-BPL4xByC.js";
import { t as DeliverableMessageChannel } from "./message-channel-normalize-IwuTHJHT.js";
import {
  d as OutboundDeliveryFormattingOptions,
  u as OutboundIdentity,
} from "./outbound.types-Bu7WWq9f.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { V as RenderedMessageBatchPlanItem } from "./types-FwtQl4mH.js";
import { E as ReplyToMode } from "./types.base-ibSxQuK3.js";
import {
  An as SilentReplyConversationType,
  i as OpenClawConfig,
} from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/outbound/identity.d.ts
/** Trims outbound identity fields and drops empty identity payloads. */
declare function normalizeOutboundIdentity(
  identity?: OutboundIdentity | null,
): OutboundIdentity | undefined;
/** Resolves an agent's configured identity into channel-safe outbound metadata. */
declare function resolveAgentOutboundIdentity(
  cfg: OpenClawConfig,
  agentId: string,
): OutboundIdentity | undefined;
//#endregion
//#region src/infra/outbound/mirror.d.ts
/**
 * Transcript append data emitted after an outbound send completes.
 */
type OutboundMirror = {
  sessionKey: string;
  agentId?: string;
  text?: string;
  mediaUrls?: string[];
  idempotencyKey?: string;
};
/**
 * Delivery-layer mirror data with optional group/channel correlation metadata.
 */
type DeliveryMirror = OutboundMirror & {
  /** Whether this message is being sent in a group/channel context */ isGroup?: boolean /** Group or channel identifier for correlation with received events */;
  groupId?: string;
};
//#endregion
//#region src/infra/outbound/session-context.d.ts
type OutboundSessionContext = {
  /**
   * Canonical session key used for internal hook dispatch.
   *
   * MUST equal the agent runtime's `params.sessionKey` for the run that
   * produced the payload being delivered. Plugins observing both
   * `agent_end`/`llm_input`/`llm_output`/`before_tool_call`/`after_tool_call`
   * and `message_sending`/`message_sent` rely on this equality to correlate
   * per-turn state across the agent-loop and delivery boundaries.
   *
   * Callers populating this field should use the same value the agent runner
   * received as its sessionKey — in the chat path that is
   * `targetSessionKey || ctx.SessionKey` (see
   * `auto-reply/reply/get-reply.ts`). Followup, ACP, command, and cron
   * delivery paths each have their own canonical value to forward; consult
   * the relevant runner.
   */
  key?: string;
  /**
   * Session key used for policy resolution when delivery differs from the
   * control session. Used to look up silent-reply policy, send rate limits,
   * agent-scoped channel preferences, etc., for the chat the reply is being
   * delivered into. May equal `key` when there is no redirect; otherwise
   * `policyKey` describes the *delivery target*'s session while `key`
   * describes the *control session* whose hooks fire.
   */
  policyKey?: string /** Explicit conversation type for policy resolution when a session key is generic. */;
  conversationType?: SilentReplyConversationType;
  /**
   * Caller-declared destination conversation kind for metadata-only audit
   * projection. Never derived from session-key parsing: policy keys can name
   * an acted-on session that is not the delivery destination, and a wrong
   * "direct" here over-collects under audit.messages="direct".
   */
  conversationKind?:
    | "direct"
    | "group"
    | "channel" /** Active agent id used for workspace-scoped media roots. */;
  agentId?: string /** Originating account id used for requester-scoped group policy resolution. */;
  requesterAccountId?: string /** Originating sender id used for sender-scoped outbound media policy. */;
  requesterSenderId?: string /** Originating sender display name for name-keyed sender policy matching. */;
  requesterSenderName?: string /** Originating sender username for username-keyed sender policy matching. */;
  requesterSenderUsername?: string /** Originating sender E.164 phone number for e164-keyed sender policy matching. */;
  requesterSenderE164?: string;
};
/** Builds the outbound delivery session context, omitting empty policy fields. */
declare function buildOutboundSessionContext(params: {
  cfg: OpenClawConfig;
  sessionKey?: string | null;
  policySessionKey?: string | null;
  conversationType?: string | null;
  isGroup?: boolean | null;
  agentId?: string | null;
  requesterAccountId?: string | null;
  requesterSenderId?: string | null;
  requesterSenderName?: string | null;
  requesterSenderUsername?: string | null;
  requesterSenderE164?: string | null;
}): OutboundSessionContext | undefined;
//#endregion
//#region src/infra/outbound/targets.d.ts
/** Deliverable channel id accepted by outbound target resolution. */
type OutboundChannel = DeliverableMessageChannel;
//#endregion
//#region src/infra/outbound/delivery-queue-storage.d.ts
type QueuedRenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};
type QueuedReplyPayloadSendingHook = {
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  context: PluginHookReplyPayloadSendingContext;
};
type QueuedDeliveryPayload = {
  channel: Exclude<OutboundChannel, "none">;
  to: string;
  accountId?: string /** Original queue durability policy when known. */;
  queuePolicy?:
    | "required"
    | "best_effort" /** Caller preflight explicitly required provider unknown-send reconciliation. */;
  requireUnknownSendReconciliation?: boolean;
  /**
   * Original payloads before plugin hooks. On recovery, hooks re-run on these
   * payloads — this is intentional since hooks are stateless transforms and
   * should produce the same result on replay.
   */
  payloads: ReplyPayload[] /** Replayable projection summary captured when the durable send intent is created. */;
  renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
  threadId?: string | number | null;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  identity?: OutboundIdentity;
  bestEffort?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean /** Replayable reply payload hook context for recovery and live delivery. */;
  replyPayloadSendingHook?: QueuedReplyPayloadSendingHook;
  silent?: boolean;
  mirror?: OutboundMirror /** Session context needed to preserve outbound media policy on recovery. */;
  session?: OutboundSessionContext /** Gateway caller scopes at enqueue time, preserved for recovery replay. */;
  gatewayClientScopes?: readonly string[];
};
interface QueuedDelivery extends QueuedDeliveryPayload {
  id: string;
  enqueuedAt: number;
  retryCount: number;
  lastAttemptAt?: number;
  lastError?: string;
  platformSendStartedAt?: number;
  /** Canonical reply target after hooks; null records an intentional root send. */
  effectiveReplyToId?: string | null;
  recoveryState?: "send_attempt_started" | "unknown_after_send";
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.d.ts
type DeliverFn = (
  params: {
    cfg: OpenClawConfig;
  } & QueuedDeliveryPayload & {
      deliveryQueueId?: string;
      deliveryQueueStateDir?: string;
      skipQueue?: boolean;
      deferredDeliveryAdmissionPassed?: true;
      deferCommitHooks?: boolean;
      onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void;
      onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
    },
) => Promise<unknown>;
interface RecoveryLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
interface PendingDeliveryDrainDecision {
  match: boolean;
  bypassBackoff?: boolean;
}
declare function drainPendingDeliveries(opts: {
  drainKey: string;
  logLabel: string;
  cfg: OpenClawConfig;
  log: RecoveryLogger;
  stateDir?: string;
  deliver: DeliverFn;
  selectEntry: (entry: QueuedDelivery, now: number) => PendingDeliveryDrainDecision;
}): Promise<void>;
//#endregion
export {
  OutboundChannel as a,
  DeliveryMirror as c,
  QueuedReplyPayloadSendingHook as i,
  normalizeOutboundIdentity as l,
  drainPendingDeliveries as n,
  OutboundSessionContext as o,
  QueuedRenderedMessageBatchPlan as r,
  buildOutboundSessionContext as s,
  DeliverFn as t,
  resolveAgentOutboundIdentity as u,
};
