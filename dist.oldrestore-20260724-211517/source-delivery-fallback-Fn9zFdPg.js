import {
  S as resolveSubagentModelFallbacksOverride,
  h as resolveEffectiveModelFallbacks,
} from "./agent-scope-y9xQv_q1.js";
import { g as createSourceDeliveryPlan } from "./delivery-evidence-oVjLoAkq.js";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-DoSj9Ji-.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import "./logger-BegyOJlO.js";
import "./thinking.shared-BWnbgBUO.js";
import "./model-selection-cli-BGoUsby5.js";
import "./thinking-runtime-D675lyzz.js";
import { i as resolveModelCandidateChain } from "./model-fallback-CQfk1H6I.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-B7OGjVYg.js";
import "./lanes-CI0_P-yC.js";
import "./runtime-plugin-qskRkoSz.js";
import "./result-fallback-classifier-DdIowatH.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/cron/isolated-agent/channel-output-policy.ts
/** Reads channel plugin output/threading policy for isolated cron delivery. */
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-DKUiZRqh.js"));
async function loadChannelPluginRuntime() {
  return await channelPluginRuntimeLoader.load();
}
/** Resolves channel-specific cron output preferences from loaded channel plugins. */
async function resolveCronChannelOutputPolicy(channel, opts) {
  const channelId = normalizeOptionalLowercaseString(channel);
  if (!channelId) return { preferFinalAssistantVisibleText: opts?.deliveryRequested !== true };
  const { getChannelPlugin } = await loadChannelPluginRuntime();
  return {
    preferFinalAssistantVisibleText:
      getChannelPlugin(channelId)?.outbound?.preferFinalAssistantVisibleText === true,
  };
}
/** Resolves the provider-specific current-thread target for a delivery address. */
async function resolveCurrentChannelTarget(params) {
  if (!params.to) return;
  const channelId = normalizeOptionalLowercaseString(params.channel);
  if (!channelId) return params.to;
  const { getChannelPlugin } = await loadChannelPluginRuntime();
  return (
    getChannelPlugin(channelId)?.threading?.resolveCurrentChannelId?.({
      to: params.to,
      threadId: params.threadId,
    }) ?? params.to
  );
}
//#endregion
//#region src/cron/isolated-agent/run-execution.runtime.ts
const cronExecutionCliRuntimeLoader = createLazyImportLoader(
  () => import("./run-execution-cli.runtime.js"),
);
async function loadCronExecutionCliRuntime() {
  return await cronExecutionCliRuntimeLoader.load();
}
/** Lazily resolves complete CLI bindings so cron continuations preserve reuse metadata. */
async function getCliSessionBinding(...args) {
  return (await loadCronExecutionCliRuntime()).getCliSessionBinding(...args);
}
/** Lazily runs the CLI-backed agent path used by isolated cron execution. */
async function runCliAgent(...args) {
  return (await loadCronExecutionCliRuntime()).runCliAgent(...args);
}
//#endregion
//#region src/cron/isolated-agent/run-fallback-policy.ts
/** Resolves model fallback chains for isolated cron runs and preflight. */
/** Resolves cron model fallbacks, giving explicit payload fallbacks precedence over subagent/default policy. */
function resolveCronFallbacksOverride(params) {
  const payload = params.job.payload.kind === "agentTurn" ? params.job.payload : void 0;
  const payloadFallbacks = Array.isArray(payload?.fallbacks) ? payload.fallbacks : void 0;
  const hasCronPayloadModelOverride =
    typeof payload?.model === "string" && payload.model.trim().length > 0;
  if (payloadFallbacks !== void 0) return payloadFallbacks;
  if (params.useSubagentFallbacks === true && !hasCronPayloadModelOverride) {
    const subagentFallbacksOverride = resolveSubagentModelFallbacksOverride(
      params.cfg,
      params.agentId,
    );
    if (subagentFallbacksOverride !== void 0) return subagentFallbacksOverride;
  }
  if (!hasCronPayloadModelOverride && params.inheritDefaultFallbacksForAgentStringModel === true) {
    const defaultFallbacks = resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
    if (defaultFallbacks.length > 0) return defaultFallbacks;
  }
  return resolveEffectiveModelFallbacks({
    cfg: params.cfg,
    agentId: params.agentId,
    hasSessionModelOverride: hasCronPayloadModelOverride,
    modelOverrideSource: hasCronPayloadModelOverride ? "auto" : void 0,
  });
}
/** Builds the ordered model candidates used by cron preflight checks. */
function resolveCronPreflightCandidates(params) {
  const fallbacksOverride = resolveCronFallbacksOverride({
    cfg: params.cfg,
    job: params.job,
    agentId: params.agentId,
    useSubagentFallbacks: params.useSubagentFallbacks,
    inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel,
  });
  return resolveModelCandidateChain({
    cfg: params.cfg,
    provider: params.provider,
    model: params.model,
    fallbacksOverride,
  });
}
//#endregion
//#region src/cron/isolated-agent/source-delivery-fallback.ts
function resolveCronSourceDeliveryPlan(params) {
  const target = {
    channel: params.resolvedDelivery.channel,
    to: params.resolvedDelivery.to,
    accountId: params.resolvedDelivery.accountId,
    threadId: params.resolvedDelivery.threadId,
  };
  if (params.deliveryPlan.mode === "webhook")
    return createSourceDeliveryPlan({
      owner: "none",
      reason: "cron_webhook",
      messageToolEnabled: false,
      directFallback: false,
    });
  if (params.deliveryPlan.mode === "none")
    return createSourceDeliveryPlan({
      owner: "none",
      reason: "cron_none",
      target,
      messageToolEnabled: true,
      messageToolForced: false,
      directFallback: false,
    });
  return createSourceDeliveryPlan({
    owner: "direct_fallback",
    reason: "cron_announce",
    target,
    messageToolEnabled: true,
    messageToolForced: false,
    requireExplicitMessageTarget: true,
    requireExplicitMessageTargetEvidence: true,
    directFallback: true,
    skipFallbackWhenMessageToolSentToTarget: params.resolvedDelivery.ok ?? true,
  });
}
function resolveFallbackCronSourceDeliveryPlan(job, resolvedDelivery) {
  return resolveCronSourceDeliveryPlan({
    deliveryPlan: resolveCronDeliveryPlan(job),
    resolvedDelivery,
  });
}
//#endregion
export {
  getCliSessionBinding as a,
  resolveCurrentChannelTarget as c,
  resolveCronPreflightCandidates as i,
  resolveFallbackCronSourceDeliveryPlan as n,
  runCliAgent as o,
  resolveCronFallbacksOverride as r,
  resolveCronChannelOutputPolicy as s,
  resolveCronSourceDeliveryPlan as t,
};
