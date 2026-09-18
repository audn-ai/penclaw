//#region src/agents/subagent-announce-dispatch.d.ts
/**
 * Subagent announcement dispatch strategy.
 *
 * Completion handoff and requester-visible replies use this to choose between
 * steering a subagent and directly delivering a message, with phase evidence.
 */
type SubagentDeliveryPath = "steered" | "direct" | "none";
/** Stable reasons an announcement delivery can fail without throwing. */
type SubagentAnnounceDeliveryFailureReason =
  | "completion_handoff_pending"
  | "completion_handoff_unavailable"
  | "generated_media_missing"
  | "message_tool_delivery_missing"
  | "requester_abandoned"
  | "visible_reply_missing";
/** Result of trying to deliver a subagent announcement. */
type SubagentAnnounceDeliveryResult = {
  delivered: boolean;
  path: SubagentDeliveryPath;
  deliveredAt?: number;
  enqueuedAt?: number;
  reason?: SubagentAnnounceDeliveryFailureReason;
  error?: string;
  terminal?: boolean;
  phases?: SubagentAnnounceDispatchPhaseResult[];
};
type SubagentAnnounceDispatchPhase = "steer-primary" | "direct-primary" | "steer-fallback";
type SubagentAnnounceDispatchPhaseResult = {
  phase: SubagentAnnounceDispatchPhase;
  delivered: boolean;
  path: SubagentDeliveryPath;
  deliveredAt?: number;
  enqueuedAt?: number;
  reason?: SubagentAnnounceDeliveryFailureReason;
  error?: string;
};
/** Converts a steer outcome into the shared delivery result shape. */
//#endregion
export { SubagentAnnounceDeliveryResult as t };
