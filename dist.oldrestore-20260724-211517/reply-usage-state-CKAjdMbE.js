import { n as resolveAgentIdentity } from "./identity-CceraXdn.js";
import { Lt as deriveContextPromptTokens } from "./session-accessor-PZVNxFCV.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-D2Sx-NyU.js";
//#region src/auto-reply/reply/reply-usage-state.ts
const TTL_MS = 5 * 6e4;
const store = /* @__PURE__ */ new Map();
function buildReplyUsageState(params) {
  const resolvedProvider = params.fallbackExhausted ? void 0 : params.winnerProvider;
  const resolvedModel = params.fallbackExhausted ? void 0 : params.winnerModel;
  const hasBillableUsageBuckets =
    params.usage &&
    (params.usage.input !== void 0 ||
      params.usage.output !== void 0 ||
      params.usage.cacheRead !== void 0 ||
      params.usage.cacheWrite !== void 0);
  return {
    provider: params.provider,
    model: params.model,
    resolvedRef:
      resolvedProvider && resolvedModel ? `${resolvedProvider}/${resolvedModel}` : void 0,
    reasoningEffort: params.reasoningEffort,
    fastMode: params.fastMode,
    fallbackUsed: params.fallbackUsed,
    agentId: params.agentId,
    sessionId: params.sessionId,
    chatType: params.chatType,
    authMode: params.authMode,
    overrideSource: params.overrideSource,
    requested:
      params.requestedProvider && params.requestedModel
        ? `${params.requestedProvider}/${params.requestedModel}`
        : void 0,
    turnUsd: hasBillableUsageBuckets
      ? estimateUsageCost({
          usage: params.usage,
          cost: resolveModelCostConfig({
            provider: params.provider,
            model: params.model,
            config: params.config,
          }),
        })
      : void 0,
    durationMs: params.durationMs,
    identity: resolveAgentIdentity(params.config, params.agentId),
    compactionCount: params.compactionCount,
    contextTokenBudget:
      typeof params.contextTokenBudget === "number" && Number.isFinite(params.contextTokenBudget)
        ? params.contextTokenBudget
        : void 0,
    contextUsedTokens:
      typeof params.contextUsedTokens === "number" && Number.isFinite(params.contextUsedTokens)
        ? params.contextUsedTokens
        : deriveContextPromptTokens({
            lastCallUsage: params.lastCallUsage,
            promptTokens: params.promptTokens,
            usage: params.usage,
          }),
    usage: params.usage
      ? {
          input: params.usage.input,
          output: params.usage.output,
          cacheRead: params.usage.cacheRead,
          cacheWrite: params.usage.cacheWrite,
          total: params.usage.total,
        }
      : void 0,
    lastUsage: params.lastCallUsage
      ? {
          input: params.lastCallUsage.input,
          output: params.lastCallUsage.output,
          cacheRead: params.lastCallUsage.cacheRead,
          cacheWrite: params.lastCallUsage.cacheWrite,
          total: params.lastCallUsage.total,
        }
      : void 0,
  };
}
function prune(now) {
  for (const [key, value] of store) if (value.expiresAt < now) store.delete(key);
}
function recordReplyUsageState(runId, snapshot) {
  if (!runId) return;
  const now = Date.now();
  store.set(runId, {
    snapshot,
    expiresAt: now + TTL_MS,
  });
  prune(now);
}
function consumeReplyUsageState(runId) {
  if (!runId) return;
  const value = store.get(runId);
  return value && value.expiresAt >= Date.now() ? value.snapshot : void 0;
}
//#endregion
export { consumeReplyUsageState as n, recordReplyUsageState as r, buildReplyUsageState as t };
