import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CUTI5XyM.js";
//#region src/agents/accepted-session-spawn.ts
/** Normalizes accepted child-session spawn results from loose tool payloads. */
/** Normalize a tool result that accepted a child session spawn. */
function normalizeAcceptedSessionSpawnResult(result) {
  const details = asOptionalRecord(asOptionalRecord(result)?.details);
  if (!details || details.status !== "accepted") return null;
  const runId = normalizeOptionalString(details.runId);
  const childSessionKey = normalizeOptionalString(details.childSessionKey);
  if (!runId || !childSessionKey) return null;
  return {
    runId,
    childSessionKey,
  };
}
/** Return true when a collection contains at least one accepted child spawn. */
function hasAcceptedSessionSpawn(acceptedSessionSpawns) {
  return (acceptedSessionSpawns ?? []).some((spawn) => {
    const record = asOptionalRecord(spawn);
    if (!record) return false;
    return Boolean(
      normalizeOptionalString(record.runId) && normalizeOptionalString(record.childSessionKey),
    );
  });
}
//#endregion
//#region src/infra/outbound/source-delivery-plan.ts
function isMessageToolOwnedDelivery(owner) {
  return owner === "message_tool" || owner === "message_tool_then_direct_fallback";
}
function normalizeDeliveryTarget(channel, to) {
  const toTrimmed = to.trim();
  return normalizeTargetForProvider(channel, toTrimmed) ?? toTrimmed;
}
const caseSensitivePrefixedTargetProviders = /* @__PURE__ */ new Set([
  "googlechat",
  "mattermost",
  "matrix",
]);
const lowercaseNormalizedPrefixedTargetProviders = /* @__PURE__ */ new Set(["discord", "slack"]);
function deliveryTargetsMatch(channel, targetTo, deliveryTo) {
  const targetToTrimmed = targetTo.trim();
  const deliveryToTrimmed = deliveryTo.trim();
  if (targetToTrimmed === deliveryToTrimmed) return true;
  const targetPrefixed = targetToTrimmed.match(/^([a-z][a-z0-9_-]*):(.*)$/i);
  const deliveryPrefixed = deliveryToTrimmed.match(/^([a-z][a-z0-9_-]*):(.*)$/i);
  const targetKind = targetPrefixed?.[1]?.toLowerCase();
  const deliveryKind = deliveryPrefixed?.[1]?.toLowerCase();
  if (
    targetKind &&
    targetKind === deliveryKind &&
    ["channel", "conversation", "group", "user"].includes(targetKind)
  ) {
    const targetId = targetPrefixed?.[2]?.trim();
    const deliveryId = deliveryPrefixed?.[2]?.trim();
    if (caseSensitivePrefixedTargetProviders.has(channel)) return targetId === deliveryId;
    if (lowercaseNormalizedPrefixedTargetProviders.has(channel))
      return targetId?.toLowerCase() === deliveryId?.toLowerCase();
  }
  return (
    normalizeDeliveryTarget(channel, targetToTrimmed) ===
    normalizeDeliveryTarget(channel, deliveryToTrimmed)
  );
}
function normalizeDeliveryThreadId(threadId) {
  return stringifyRouteThreadId(threadId)?.trim() || void 0;
}
function extractTopicThreadId(targetTo) {
  return targetTo.match(/:topic:(\d+)$/i)?.[1];
}
/** Compares a message-tool target with the required source delivery target. */
function sourceDeliveryTargetsMatch(target, delivery) {
  if (!delivery.channel || !delivery.to || !target.to) return false;
  const channel = delivery.channel.trim().toLowerCase();
  const provider = target.provider?.trim().toLowerCase();
  if (provider && provider !== "message" && provider !== channel) return false;
  if (delivery.accountId && target.accountId && target.accountId !== delivery.accountId)
    return false;
  if (!deliveryTargetsMatch(channel, target.to.replace(/:topic:\d+$/, ""), delivery.to))
    return false;
  const deliveryThreadId = normalizeDeliveryThreadId(delivery.threadId);
  const targetThreadId =
    normalizeDeliveryThreadId(target.threadId) ?? extractTopicThreadId(target.to);
  if (!deliveryThreadId && !targetThreadId) return true;
  if (deliveryThreadId && !targetThreadId)
    return target.threadImplicit === true && target.threadSuppressed !== true;
  return deliveryThreadId === targetThreadId;
}
/** Builds a source delivery plan from ownership and fallback inputs. */
function createSourceDeliveryPlan(params) {
  const messageToolOwnsDelivery = isMessageToolOwnedDelivery(params.owner);
  const sourceReplyDeliveryMode = messageToolOwnsDelivery ? "message_tool_only" : void 0;
  const directDelivery =
    params.directFallback ??
    (params.owner === "direct_fallback" || params.owner === "message_tool_then_direct_fallback");
  return {
    owner: params.owner,
    reason: params.reason,
    target: params.target ?? {},
    normalFinal:
      sourceReplyDeliveryMode === "message_tool_only" || params.owner === "none"
        ? "private"
        : "visible",
    sourceReplyDeliveryMode,
    messageTool: {
      enabled: params.messageToolEnabled ?? messageToolOwnsDelivery,
      force: params.messageToolForced ?? messageToolOwnsDelivery,
      requireExplicitTarget: params.requireExplicitMessageTarget ?? false,
      requireExplicitTargetEvidence: params.requireExplicitMessageTargetEvidence ?? false,
      defaultTarget: Boolean(params.target?.channel || params.target?.to),
    },
    fallback: {
      directDelivery,
      skipWhenMessageToolSentToTarget:
        params.skipFallbackWhenMessageToolSentToTarget ??
        params.owner === "message_tool_then_direct_fallback",
      bestEffort: params.fallbackBestEffort ?? false,
    },
    progress: {
      allowCallbacksWhenSourceDeliverySuppressed:
        params.allowProgressCallbacksWhenSourceDeliverySuppressed ?? false,
    },
  };
}
function resolveImplicitMessageToolDeliveryTarget(plan) {
  if (!plan.target.channel || !plan.target.to) return;
  const threadId = stringifyRouteThreadId(plan.target.threadId);
  return {
    tool: "message",
    provider: plan.target.channel,
    ...(plan.target.accountId ? { accountId: plan.target.accountId } : {}),
    ...(plan.target.to ? { to: plan.target.to } : {}),
    ...(threadId ? { threadId } : {}),
  };
}
/** Evaluates whether observed message-tool sends satisfy the source delivery plan. */
function resolveSourceDeliveryOutcome(plan, params) {
  const didSendViaMessageTool = params.didSendViaMessageTool === true;
  const explicitTargets = params.messageToolSentTargets ?? [];
  const sentTargets =
    explicitTargets.length > 0
      ? explicitTargets
      : didSendViaMessageTool && !plan.messageTool.requireExplicitTargetEvidence
        ? [resolveImplicitMessageToolDeliveryTarget(plan)].filter((target) => Boolean(target))
        : [];
  const visibleDeliveries = sentTargets.map((target) => ({
    via: "message_tool",
    target,
    verifiedTarget: sourceDeliveryTargetsMatch(target, plan.target),
  }));
  const hasVerifiedMessageToolDelivery = visibleDeliveries.some(
    (delivery) => didSendViaMessageTool && delivery.verifiedTarget,
  );
  return {
    visibleDeliveries,
    verifiedMessageToolDelivery: hasVerifiedMessageToolDelivery,
    satisfiesSourceDelivery:
      plan.fallback.skipWhenMessageToolSentToTarget && hasVerifiedMessageToolDelivery,
    unverifiedMessageToolDelivery:
      didSendViaMessageTool && sentTargets.length > 0 && !hasVerifiedMessageToolDelivery,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/delivery-evidence.ts
/**
 * Extracts visible delivery evidence from embedded-agent run results.
 */
function collectSourceReplyFinalMarkers(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const marker = entry.sourceReplyFinal;
    return typeof marker === "boolean" ? [marker] : [];
  });
}
/** Resolve explicit progress/final evidence, or undefined for legacy runtimes. */
function resolveExplicitFinalSourceReplyDeliveryEvidence(result) {
  const markers = [
    ...collectSourceReplyFinalMarkers(result.messagingToolSentTargets),
    ...collectSourceReplyFinalMarkers(result.messagingToolSourceReplyPayloads),
  ];
  return markers.length > 0 ? markers.some(Boolean) : void 0;
}
/** Preserve legacy completion semantics unless the runtime emitted progress/final markers. */
function hasCompletedSourceReplyDeliveryEvidence(result) {
  return (
    resolveExplicitFinalSourceReplyDeliveryEvidence(result) ??
    hasCommittedSourceReplyDeliveryEvidence(result)
  );
}
/** Returns whether delivery evidence completes the current interactive turn. */
function hasCompletedTerminalDeliveryEvidence(result) {
  const explicitFinal = resolveExplicitFinalSourceReplyDeliveryEvidence(result);
  return (
    hasCompletedSourceReplyDeliveryEvidence(result) ||
    (explicitFinal === void 0 && hasVisibleOutboundDeliveryEvidence(result)) ||
    result.didSendDeterministicApprovalPrompt === true
  );
}
function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function hasNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}
function hasNonEmptyStringArray(value) {
  return Array.isArray(value) && value.some(hasNonEmptyString);
}
function hasVisibleMessagingToolTarget(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const target = value;
  if ("text" in target || "mediaUrls" in target || "hasRichContent" in target)
    return (
      hasNonEmptyString(target.text) ||
      hasNonEmptyStringArray(target.mediaUrls) ||
      target.hasRichContent === true
    );
  return true;
}
function hasVisibleAttachmentReference(value) {
  if (!Array.isArray(value)) return false;
  const urls = /* @__PURE__ */ new Set();
  for (const attachment of value)
    if (attachment && typeof attachment === "object" && !Array.isArray(attachment))
      collectMediaUrlsFromRecord(attachment, urls);
  return urls.size > 0;
}
function collectStringValues(value, output) {
  if (typeof value === "string" && value.trim()) {
    output.add(value.trim());
    return;
  }
  if (!Array.isArray(value)) return;
  for (const entry of value)
    if (typeof entry === "string" && entry.trim()) output.add(entry.trim());
}
function collectMediaUrlsFromRecord(record, output, seen = /* @__PURE__ */ new WeakSet()) {
  if (seen.has(record)) return;
  seen.add(record);
  collectStringValues(record.mediaUrl, output);
  collectStringValues(record.mediaUrls, output);
  collectStringValues(record.path, output);
  collectStringValues(record.url, output);
  collectStringValues(record.filePath, output);
  const attachments = record.attachments;
  if (Array.isArray(attachments)) {
    for (const attachment of attachments)
      if (attachment && typeof attachment === "object" && !Array.isArray(attachment))
        collectMediaUrlsFromRecord(attachment, output, seen);
  }
}
/** Collects media URLs from agent payloads and committed messaging-tool delivery metadata. */
function collectDeliveredMediaUrls(result) {
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(result.payloads)) {
    for (const payload of result.payloads)
      if (payload && typeof payload === "object" && !Array.isArray(payload))
        collectMediaUrlsFromRecord(payload, urls);
  }
  for (const url of collectMessagingToolDeliveredMediaUrls(result)) urls.add(url);
  return Array.from(urls);
}
/** Collects media URLs recorded by messaging-tool sends and their target attachments. */
function collectMessagingToolDeliveredMediaUrls(result) {
  const urls = /* @__PURE__ */ new Set();
  collectStringValues(result.messagingToolSentMediaUrls, urls);
  if (Array.isArray(result.messagingToolSentTargets)) {
    for (const target of result.messagingToolSentTargets)
      if (target && typeof target === "object" && !Array.isArray(target))
        collectMediaUrlsFromRecord(target, urls);
  }
  return Array.from(urls);
}
function hasPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
/** Extracts a gateway result payload when the response carries delivery evidence fields. */
function getGatewayAgentResult(response) {
  if (!response || typeof response !== "object") return null;
  const candidate = hasAgentDeliveryEvidenceShape(response) ? response : response.result;
  if (!candidate || typeof candidate !== "object" || !hasAgentDeliveryEvidenceShape(candidate))
    return null;
  return candidate;
}
function hasAgentDeliveryEvidenceShape(value) {
  return (
    "payloads" in value ||
    "deliveryStatus" in value ||
    "didSendViaMessagingTool" in value ||
    "messagingToolSentTexts" in value ||
    "messagingToolSentMediaUrls" in value ||
    "messagingToolSentTargets" in value ||
    "acceptedSessionSpawns" in value ||
    "successfulCronAdds" in value ||
    "meta" in value
  );
}
/** Returns whether payload metadata contains visible text, media, presentation, or channel data. */
function hasVisibleAgentPayload(result, options = {}) {
  const payloads = result.payloads;
  if (!Array.isArray(payloads)) return false;
  return payloads.some((payload) => {
    if (!payload || typeof payload !== "object") return false;
    const record = payload;
    if (options.includeErrorPayloads === false && record.isError === true) return false;
    if (options.includeReasoningPayloads === false && record.isReasoning === true) return false;
    return Boolean(
      hasNonEmptyString(record.text) ||
      hasNonEmptyString(record.mediaUrl) ||
      hasNonEmptyStringArray(record.mediaUrls) ||
      hasVisibleAttachmentReference(record.attachments) ||
      record.presentation ||
      record.interactive ||
      record.channelData,
    );
  });
}
/** Returns whether the messaging tool attempted or committed an outbound delivery. */
function hasMessagingToolDeliveryEvidence(result) {
  return (
    result.didSendViaMessagingTool === true || hasCommittedMessagingToolDeliveryEvidence(result)
  );
}
/** Returns whether messaging-tool metadata proves committed text, media, or target delivery. */
function hasCommittedMessagingToolDeliveryEvidence(result) {
  return (
    hasNonEmptyStringArray(result.messagingToolSentTexts) ||
    hasNonEmptyStringArray(result.messagingToolSentMediaUrls) ||
    hasNonEmptyArray(result.messagingToolSentTargets)
  );
}
/** Returns whether messaging-tool metadata proves a user-visible committed delivery. */
function hasVisibleCommittedMessagingToolDeliveryEvidence(result) {
  return (
    hasNonEmptyStringArray(result.messagingToolSentTexts) ||
    hasNonEmptyStringArray(result.messagingToolSentMediaUrls) ||
    (Array.isArray(result.messagingToolSentTargets) &&
      result.messagingToolSentTargets.some(hasVisibleMessagingToolTarget))
  );
}
function hasGranularMessagingToolDeliveryEvidence(result) {
  return (
    result.messagingToolSentTexts !== void 0 ||
    result.messagingToolSentMediaUrls !== void 0 ||
    result.messagingToolSentTargets !== void 0
  );
}
/** Returns whether a source reply was visibly delivered through the message tool. */
function hasCommittedSourceReplyDeliveryEvidence(result) {
  return (
    result.didDeliverSourceReplyViaMessageTool === true ||
    hasVisibleAgentPayload({ payloads: result.messagingToolSourceReplyPayloads })
  );
}
/** Returns whether outbound metadata proves a visible message, spawn, or cron side effect. */
function hasVisibleOutboundDeliveryEvidence(result) {
  return (
    hasVisibleCommittedMessagingToolDeliveryEvidence(result) ||
    (result.didSendViaMessagingTool === true &&
      !hasGranularMessagingToolDeliveryEvidence(result)) ||
    (Array.isArray(result.acceptedSessionSpawns) &&
      hasAcceptedSessionSpawn(result.acceptedSessionSpawns)) ||
    hasPositiveNumber(result.successfulCronAdds)
  );
}
/** Returns whether committed outbound evidence makes replay unsafe. */
function hasCommittedOutboundDeliveryEvidence(result) {
  return (
    hasMessagingToolDeliveryEvidence(result) ||
    (Array.isArray(result.acceptedSessionSpawns) &&
      hasAcceptedSessionSpawn(result.acceptedSessionSpawns)) ||
    hasPositiveNumber(result.successfulCronAdds)
  );
}
/** Returns whether any tool progress or outbound side effect makes a retry unsafe. */
function hasOutboundDeliveryEvidence(result) {
  return (
    hasCommittedOutboundDeliveryEvidence(result) ||
    hasPositiveNumber(result.meta?.toolSummary?.calls)
  );
}
/** Formats an agent-command delivery failure message from delivery status metadata. */
function getAgentCommandDeliveryFailure(result) {
  const status = result.deliveryStatus?.status;
  if (status !== "failed" && status !== "partial_failed") return;
  const message = result.deliveryStatus?.errorMessage;
  if (hasNonEmptyString(message)) return message;
  return status === "partial_failed" ? "agent delivery partially failed" : "agent delivery failed";
}
//#endregion
export {
  resolveSourceDeliveryOutcome as _,
  hasCommittedMessagingToolDeliveryEvidence as a,
  normalizeAcceptedSessionSpawnResult as b,
  hasCompletedSourceReplyDeliveryEvidence as c,
  hasOutboundDeliveryEvidence as d,
  hasVisibleAgentPayload as f,
  createSourceDeliveryPlan as g,
  resolveExplicitFinalSourceReplyDeliveryEvidence as h,
  getGatewayAgentResult as i,
  hasCompletedTerminalDeliveryEvidence as l,
  hasVisibleOutboundDeliveryEvidence as m,
  collectMessagingToolDeliveredMediaUrls as n,
  hasCommittedOutboundDeliveryEvidence as o,
  hasVisibleCommittedMessagingToolDeliveryEvidence as p,
  getAgentCommandDeliveryFailure as r,
  hasCommittedSourceReplyDeliveryEvidence as s,
  collectDeliveredMediaUrls as t,
  hasMessagingToolDeliveryEvidence as u,
  sourceDeliveryTargetsMatch as v,
  hasAcceptedSessionSpawn as y,
};
