import {
  i as isMessagingToolDeliveryAction,
  n as isMessageToolSendActionName,
  t as isMessageToolConversationCreateActionName,
} from "./embedded-agent-messaging-C_REpMqa.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as safeParseJson } from "./src-Bl7G9qvi.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
import { n as isToolResultError } from "./tool-result-error-1qgstja-.js";
import "./embedded-agent-subscribe.tools-Bv1-LBFe.js";
//#region src/agents/embedded-agent-message-tool-source-reply.ts
/**
 * Detects message-tool sends that delivered a visible reply to the current source.
 */
const MESSAGE_TOOL_NAME = "message";
const SESSIONS_SEND_TOOL_NAME = "sessions_send";
const EXPLICIT_MESSAGE_ROUTE_KEYS = ["channel", "target", "to", "channelId", "provider"];
const DRY_RUN_DELIVERY_STATUS = "dry_run";
const PARTIAL_FAILED_DELIVERY_STATUS = "partial_failed";
const SENT_DELIVERY_STATUS = "sent";
const NON_DELIVERY_MESSAGE_IDS = /* @__PURE__ */ new Set(["skipped", "suppressed"]);
const RESULT_ENVELOPE_KEYS = [
  "details",
  "payload",
  "result",
  "results",
  "sendResult",
  "toolResult",
];
const BROADCAST_SEND_ENVELOPE_KEYS = ["payload", "result", "sendResult", "toolResult"];
const PARTIAL_DELIVERY_ENVELOPE_KEYS = [...RESULT_ENVELOPE_KEYS, "error", "cause"];
const SESSIONS_SEND_DELIVERY_STATUSES = /* @__PURE__ */ new Set(["accepted", "ok"]);
const BARE_OK_DELIVERY_STATUS = "ok";
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function hasStringValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function hasConversationIdValue(value) {
  return hasStringValue(value) || (typeof value === "number" && Number.isFinite(value));
}
function hasExplicitMessageRoute(args) {
  if (EXPLICIT_MESSAGE_ROUTE_KEYS.some((key) => hasStringValue(args[key]))) return true;
  return Array.isArray(args.targets) && args.targets.some((value) => hasStringValue(value));
}
function isMessageToolSourceReplyActionName(action) {
  if (isMessageToolSendActionName(action)) return true;
  return typeof action === "string" && action.trim().toLowerCase() === "reply";
}
function normalizeStatus(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
function isBareOkDeliveryStatus(value) {
  return normalizeStatus(value) === BARE_OK_DELIVERY_STATUS;
}
function isBareSentDeliveryStatus(value) {
  return normalizeStatus(value) === SENT_DELIVERY_STATUS;
}
function parseJsonRecord(value) {
  return asOptionalRecord(safeParseJson(value));
}
function recordHasDeliveredMessageId(record) {
  const hasDeliveredId = (value) => {
    const normalized = normalizeStatus(value);
    return Boolean(normalized && !NON_DELIVERY_MESSAGE_IDS.has(normalized));
  };
  if (hasDeliveredId(record.messageId) || hasDeliveredId(record.pollId)) return true;
  const receipt = record.receipt;
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  const receiptRecord = receipt;
  return (
    hasDeliveredId(receiptRecord.primaryPlatformMessageId) ||
    (Array.isArray(receiptRecord.platformMessageIds) &&
      receiptRecord.platformMessageIds.some((value) => hasDeliveredId(value)))
  );
}
function deliveryEnvelopeHasCreatedConversationId(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeHasCreatedConversationId(item, depth + 1));
  const record = value;
  if (
    hasConversationIdValue(record.topicId) ||
    hasConversationIdValue(record.threadId) ||
    hasConversationIdValue(record.messageThreadId)
  )
    return true;
  const thread = record.thread;
  if (thread && typeof thread === "object" && !Array.isArray(thread)) {
    if (hasConversationIdValue(thread.id)) return true;
  }
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeHasCreatedConversationId(parsed, depth + 1)) return true;
  }
  const content = record.content;
  if (
    Array.isArray(content) &&
    content.some((item) => deliveryEnvelopeHasCreatedConversationId(item, depth + 1))
  )
    return true;
  return PARTIAL_DELIVERY_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeHasCreatedConversationId(record[key], depth + 1),
  );
}
function deliveryEnvelopeIndicatesOk(value, depth = 0) {
  if (isBareOkDeliveryStatus(value)) return true;
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeIndicatesOk(item, depth + 1));
  const record = value;
  if (record.ok === true) return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesOk(parsed, depth + 1)) return true;
    if (isBareOkDeliveryStatus(record.text)) return true;
  }
  const content = record.content;
  if (
    Array.isArray(content) &&
    content.some((item) => deliveryEnvelopeIndicatesOk(item, depth + 1))
  )
    return true;
  return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesOk(record[key], depth + 1));
}
function deliveryEnvelopeIndicatesNonDelivery(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeIndicatesNonDelivery(item, depth + 1));
  const record = value;
  const messageId = normalizeStatus(record.messageId);
  if (
    (messageId && NON_DELIVERY_MESSAGE_IDS.has(messageId)) ||
    normalizeStatus(record.deliveryStatus) === "suppressed" ||
    normalizeStatus(record.status) === "suppressed"
  )
    return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesNonDelivery(parsed, depth + 1)) return true;
  }
  const content = record.content;
  if (
    Array.isArray(content) &&
    content.some((item) => deliveryEnvelopeIndicatesNonDelivery(item, depth + 1))
  )
    return true;
  return RESULT_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeIndicatesNonDelivery(record[key], depth + 1),
  );
}
function deliveryEnvelopeIndicatesNoOp(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeIndicatesNoOp(item, depth + 1));
  const record = value;
  const removed = record.removed;
  if (
    removed === null ||
    removed === false ||
    removed === 0 ||
    (Array.isArray(removed) && removed.length === 0) ||
    record.applied === false ||
    record.changed === false ||
    record.created === false ||
    record.deleted === false ||
    record.sent === false ||
    record.updated === false
  )
    return true;
  const status = normalizeStatus(record.status);
  if (status === "noop" || status === "no_op" || status === "not_found") return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesNoOp(parsed, depth + 1)) return true;
  }
  const content = record.content;
  if (
    Array.isArray(content) &&
    content.some((item) => deliveryEnvelopeIndicatesNoOp(item, depth + 1))
  )
    return true;
  return RESULT_ENVELOPE_KEYS.some((key) => deliveryEnvelopeIndicatesNoOp(record[key], depth + 1));
}
function broadcastEntryHasSuccessfulBareOkSend(record, depth) {
  return BROADCAST_SEND_ENVELOPE_KEYS.some((key) => {
    const value = record[key];
    return (
      deliveryEnvelopeIndicatesOk(value, depth + 1) &&
      !deliveryEnvelopeIndicatesNonDelivery(value, depth + 1) &&
      !deliveryEnvelopeIndicatesNoOp(value, depth + 1)
    );
  });
}
function deliveryEnvelopeIndicatesSuccessfulBroadcast(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        item.ok === true &&
        !deliveryEnvelopeIndicatesNonDelivery(item) &&
        !deliveryEnvelopeIndicatesNoOp(item) &&
        (deliveryEnvelopeIndicatesDelivered(item, depth + 1) ||
          broadcastEntryHasSuccessfulBareOkSend(item, depth + 1)),
    );
  const record = value;
  if (deliveryEnvelopeIndicatesSuccessfulBroadcast(record.results, depth + 1)) return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesSuccessfulBroadcast(parsed, depth + 1)) return true;
  }
  const content = record.content;
  if (
    Array.isArray(content) &&
    content.some((item) => deliveryEnvelopeIndicatesSuccessfulBroadcast(item, depth + 1))
  )
    return true;
  return RESULT_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeIndicatesSuccessfulBroadcast(record[key], depth + 1),
  );
}
function deliveryEnvelopeIndicatesDryRun(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeIndicatesDryRun(item, depth + 1));
  const record = value;
  if (
    record.dryRun === true ||
    normalizeStatus(record.deliveryStatus) === DRY_RUN_DELIVERY_STATUS ||
    normalizeStatus(record.status) === DRY_RUN_DELIVERY_STATUS
  )
    return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesDryRun(parsed, depth + 1)) return true;
  }
  const content = record.content;
  if (Array.isArray(content))
    for (const item of content) {
      if (deliveryEnvelopeIndicatesDryRun(item, depth + 1)) return true;
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const text = item.text;
        if (typeof text === "string") {
          const parsed = parseJsonRecord(text);
          if (parsed && deliveryEnvelopeIndicatesDryRun(parsed, depth + 1)) return true;
        }
      }
    }
  return RESULT_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeIndicatesDryRun(record[key], depth + 1),
  );
}
function deliveryEnvelopeIndicatesDelivered(value, depth = 0, requireReceipt = false) {
  if (!requireReceipt && isBareSentDeliveryStatus(value)) return true;
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) =>
      deliveryEnvelopeIndicatesDelivered(item, depth + 1, requireReceipt),
    );
  const record = value;
  if (
    (!requireReceipt && normalizeStatus(record.deliveryStatus) === SENT_DELIVERY_STATUS) ||
    (!requireReceipt && normalizeStatus(record.status) === SENT_DELIVERY_STATUS) ||
    recordHasDeliveredMessageId(record)
  )
    return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesDelivered(parsed, depth + 1, requireReceipt))
      return true;
    if (!requireReceipt && isBareSentDeliveryStatus(record.text)) return true;
  }
  const content = record.content;
  if (Array.isArray(content))
    for (const item of content) {
      if (deliveryEnvelopeIndicatesDelivered(item, depth + 1, requireReceipt)) return true;
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const text = item.text;
        if (typeof text === "string") {
          const parsed = parseJsonRecord(text);
          if (parsed && deliveryEnvelopeIndicatesDelivered(parsed, depth + 1, requireReceipt))
            return true;
        }
      }
    }
  return RESULT_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeIndicatesDelivered(record[key], depth + 1, requireReceipt),
  );
}
/** Return true when a result envelope carries a provider message identifier. */
function hasMessagingDeliveryReceipt(value) {
  return deliveryEnvelopeIndicatesDelivered(value, 0, true);
}
function deliveryEnvelopeIndicatesSessionsSendAccepted(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeIndicatesSessionsSendAccepted(item, depth + 1));
  const record = value;
  if (
    SESSIONS_SEND_DELIVERY_STATUSES.has(normalizeStatus(record.deliveryStatus) ?? "") ||
    SESSIONS_SEND_DELIVERY_STATUSES.has(normalizeStatus(record.status) ?? "")
  )
    return true;
  if (typeof record.text === "string") {
    const parsed = parseJsonRecord(record.text);
    if (parsed && deliveryEnvelopeIndicatesSessionsSendAccepted(parsed, depth + 1)) return true;
  }
  const content = record.content;
  if (
    Array.isArray(content) &&
    content.some((item) => deliveryEnvelopeIndicatesSessionsSendAccepted(item, depth + 1))
  )
    return true;
  return RESULT_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeIndicatesSessionsSendAccepted(record[key], depth + 1),
  );
}
function deliveryEnvelopeIndicatesPartialDelivery(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return false;
  if (Array.isArray(value))
    return value.some((item) => deliveryEnvelopeIndicatesPartialDelivery(item, depth + 1));
  const record = value;
  if (
    record.sentBeforeError === true ||
    record.visibleReplySent === true ||
    normalizeStatus(record.deliveryStatus) === PARTIAL_FAILED_DELIVERY_STATUS ||
    normalizeStatus(record.status) === PARTIAL_FAILED_DELIVERY_STATUS
  )
    return true;
  return PARTIAL_DELIVERY_ENVELOPE_KEYS.some((key) =>
    deliveryEnvelopeIndicatesPartialDelivery(record[key], depth + 1),
  );
}
/** Return true only when a messaging tool result proves a real visible delivery. */
function isDeliveredMessagingToolResult(params) {
  const args = asRecord(params.args);
  const action = normalizeStatus(args.action);
  if (
    args.dryRun === true ||
    deliveryEnvelopeIndicatesDryRun(params.result) ||
    deliveryEnvelopeIndicatesDryRun(params.hookResult)
  )
    return false;
  if (
    deliveryEnvelopeIndicatesPartialDelivery(params.result) ||
    deliveryEnvelopeIndicatesPartialDelivery(params.hookResult)
  )
    return true;
  if (
    action &&
    isMessageToolConversationCreateActionName(action) &&
    (deliveryEnvelopeHasCreatedConversationId(params.result) ||
      deliveryEnvelopeHasCreatedConversationId(params.hookResult))
  )
    return true;
  if (
    action === "broadcast" &&
    (deliveryEnvelopeIndicatesSuccessfulBroadcast(params.result) ||
      deliveryEnvelopeIndicatesSuccessfulBroadcast(params.hookResult))
  )
    return true;
  if (params.isError || isToolResultError(params.result) || isToolResultError(params.hookResult))
    return false;
  const normalizedToolName = normalizeToolName(params.toolName ?? MESSAGE_TOOL_NAME);
  if (
    isMessagingToolDeliveryAction(normalizedToolName, args) &&
    action !== "broadcast" &&
    (deliveryEnvelopeIndicatesOk(params.result) ||
      deliveryEnvelopeIndicatesOk(params.hookResult)) &&
    !deliveryEnvelopeIndicatesNonDelivery(params.result) &&
    !deliveryEnvelopeIndicatesNonDelivery(params.hookResult) &&
    !deliveryEnvelopeIndicatesNoOp(params.result) &&
    !deliveryEnvelopeIndicatesNoOp(params.hookResult)
  )
    return true;
  if (
    deliveryEnvelopeIndicatesNonDelivery(params.result) ||
    deliveryEnvelopeIndicatesNonDelivery(params.hookResult) ||
    deliveryEnvelopeIndicatesNoOp(params.result) ||
    deliveryEnvelopeIndicatesNoOp(params.hookResult)
  )
    return false;
  if (normalizedToolName === SESSIONS_SEND_TOOL_NAME)
    return (
      deliveryEnvelopeIndicatesSessionsSendAccepted(params.result) ||
      deliveryEnvelopeIndicatesSessionsSendAccepted(params.hookResult) ||
      deliveryEnvelopeIndicatesDelivered(params.result) ||
      deliveryEnvelopeIndicatesDelivered(params.hookResult)
    );
  return (
    deliveryEnvelopeIndicatesDelivered(params.result) ||
    deliveryEnvelopeIndicatesDelivered(params.hookResult)
  );
}
/**
 * Only implicit-route, non-dry-run, delivered `message.send` calls qualify.
 * Explicit routes and other messaging tools are outbound side effects, not source replies.
 */
function isDeliveredMessageToolOnlySourceReplyResult(params) {
  if (params.sourceReplyDeliveryMode !== "message_tool_only") return false;
  if (normalizeToolName(params.toolName) !== MESSAGE_TOOL_NAME) return false;
  const args = asRecord(params.args);
  const sourceRouteReplyAction =
    params.allowExplicitSourceRoute === true && isMessageToolSourceReplyActionName(args.action);
  if (!isMessageToolSendActionName(args.action) && !sourceRouteReplyAction) return false;
  if (hasExplicitMessageRoute(args) && params.allowExplicitSourceRoute !== true) return false;
  return isDeliveredMessagingToolResult(params);
}
//#endregion
export {
  isDeliveredMessageToolOnlySourceReplyResult as n,
  isDeliveredMessagingToolResult as r,
  hasMessagingDeliveryReceipt as t,
};
