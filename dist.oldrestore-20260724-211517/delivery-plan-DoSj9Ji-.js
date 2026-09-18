import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-Co3r_2wp.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
  u as normalizeOptionalThreadValue,
} from "./string-coerce-DW4mBlAt.js";
//#region src/cron/delivery-plan.ts
/** Resolves cron delivery and failure-notification routing from job config. */
/** Returns whether a delivery plan names a concrete channel, recipient, thread, or account. */
function hasExplicitCronDeliveryTarget(plan) {
  return Boolean(
    (plan.channel && plan.channel !== "last") || plan.to || plan.threadId != null || plan.accountId,
  );
}
function normalizeChannel(value) {
  const trimmed = normalizeOptionalLowercaseString(value);
  if (!trimmed) return;
  return trimmed;
}
function normalizeThreadIdentity(value) {
  const normalized = normalizeOptionalThreadValue(value);
  return normalized == null ? void 0 : String(normalized);
}
function resolveAnnounceChannel(params) {
  if (params.channel && params.channel !== "last") return params.channel;
  return resolveTargetPrefixedChannel(params.to) ?? params.channel ?? "last";
}
/** Resolves primary delivery config into the runtime mode/channel/target plan. */
function resolveCronDeliveryPlan(job) {
  const delivery = job.delivery;
  const hasDelivery = delivery && typeof delivery === "object";
  const rawMode = hasDelivery ? delivery.mode : void 0;
  const normalizedMode =
    typeof rawMode === "string" ? normalizeLowercaseStringOrEmpty(rawMode) : rawMode;
  const mode =
    normalizedMode === "announce"
      ? "announce"
      : normalizedMode === "webhook"
        ? "webhook"
        : normalizedMode === "none"
          ? "none"
          : normalizedMode === "deliver"
            ? "announce"
            : void 0;
  const deliveryChannel = normalizeChannel(delivery?.channel);
  const deliveryTo = normalizeOptionalString(delivery?.to);
  const deliveryThreadId = normalizeOptionalThreadValue(delivery?.threadId);
  const to = deliveryTo;
  const deliveryAccountId = normalizeOptionalString(delivery?.accountId);
  if (hasDelivery) {
    const resolvedMode = mode ?? "announce";
    const channel =
      resolvedMode === "announce"
        ? resolveAnnounceChannel({
            channel: deliveryChannel,
            to,
          })
        : deliveryChannel;
    return {
      mode: resolvedMode,
      channel: resolvedMode === "webhook" ? void 0 : channel,
      to,
      threadId: resolvedMode === "webhook" ? void 0 : deliveryThreadId,
      accountId: deliveryAccountId,
      source: "delivery",
      requested: resolvedMode === "announce",
    };
  }
  const resolvedMode =
    (job.payload.kind === "agentTurn" || job.payload.kind === "command") &&
    typeof job.sessionTarget === "string" &&
    (job.sessionTarget === "isolated" ||
      job.sessionTarget === "current" ||
      job.sessionTarget.startsWith("session:"))
      ? "announce"
      : "none";
  return {
    mode: resolvedMode,
    channel: resolvedMode === "announce" ? "last" : void 0,
    to: void 0,
    threadId: void 0,
    source: "delivery",
    requested: resolvedMode === "announce",
  };
}
function normalizeFailureMode(value) {
  const trimmed = normalizeOptionalLowercaseString(value);
  if (trimmed === "announce" || trimmed === "webhook") return trimmed;
}
/** Resolves job-level failure notification routing layered over global defaults. */
function resolveFailureDestination(job, globalConfig) {
  const delivery = job.delivery;
  const jobFailureDest = delivery?.failureDestination;
  const hasJobFailureDest = jobFailureDest && typeof jobFailureDest === "object";
  let channel;
  let to;
  let accountId;
  let mode;
  if (globalConfig) {
    channel = normalizeChannel(globalConfig.channel);
    to = normalizeOptionalString(globalConfig.to);
    accountId = normalizeOptionalString(globalConfig.accountId);
    mode = normalizeFailureMode(globalConfig.mode);
  }
  if (hasJobFailureDest) {
    const jobChannel = normalizeChannel(jobFailureDest.channel);
    const jobTo = normalizeOptionalString(jobFailureDest.to);
    const jobAccountId = normalizeOptionalString(jobFailureDest.accountId);
    const jobMode = normalizeFailureMode(jobFailureDest.mode);
    const hasJobChannelField = "channel" in jobFailureDest;
    const hasJobToField = "to" in jobFailureDest;
    const hasJobAccountIdField = "accountId" in jobFailureDest;
    const hasJobModeField = "mode" in jobFailureDest;
    const jobToExplicitValue = hasJobToField && jobTo !== void 0;
    if (hasJobChannelField) channel = jobChannel;
    if (hasJobToField) to = jobTo;
    if (hasJobAccountIdField) accountId = jobAccountId;
    const jobImpliesAnnounce = !hasJobModeField && jobChannel !== void 0;
    if (hasJobModeField || jobImpliesAnnounce) {
      const effectiveJobMode = jobImpliesAnnounce ? "announce" : jobMode;
      if (!jobToExplicitValue && (mode ?? "announce") !== (effectiveJobMode ?? "announce"))
        to = void 0;
      mode = effectiveJobMode;
    }
  }
  if (!channel && !to && !accountId && !mode) return null;
  const resolvedMode = mode ?? "announce";
  if (resolvedMode === "webhook" && !to) return null;
  const result = {
    mode: resolvedMode,
    channel:
      resolvedMode === "announce"
        ? resolveAnnounceChannel({
            channel,
            to,
          })
        : void 0,
    to,
    accountId,
  };
  if (delivery && isSameDeliveryTarget(delivery, result)) return null;
  return result;
}
function isSameDeliveryTarget(delivery, failurePlan) {
  const primaryMode = delivery.mode ?? "announce";
  if (primaryMode === "none") return false;
  const primaryTo = normalizeOptionalString(delivery.to);
  const primaryAccountId = normalizeOptionalString(delivery.accountId);
  const primaryThreadId = normalizeThreadIdentity(delivery.threadId);
  if (failurePlan.mode === "webhook")
    return primaryMode === "webhook" && primaryTo === failurePlan.to;
  const primaryChannelNormalized = resolveAnnounceChannel({
    channel: normalizeChannel(delivery.channel),
    to: primaryTo,
  });
  return (
    (failurePlan.channel ?? "last") === primaryChannelNormalized &&
    failurePlan.to === primaryTo &&
    failurePlan.accountId === primaryAccountId &&
    primaryThreadId === void 0
  );
}
//#endregion
export {
  resolveCronDeliveryPlan as n,
  resolveFailureDestination as r,
  hasExplicitCronDeliveryTarget as t,
};
