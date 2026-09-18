import { normalizeStructuredPromptSection } from "@openclaw/ai/internal/shared";
import { c as joinPresentTextSegments } from "./hook-runner-global-CPEPIvCK.js";
//#region src/agents/embedded-agent-runner/run/attempt.thread-helpers.ts
/** Custom transcript marker used to preserve cache-TTL pruning state across attempts. */
const ATTEMPT_CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";
/**
 * Combines hook-provided system context with the base prompt while preserving
 * stable structured-section bytes. Returning undefined when hooks add nothing
 * lets callers avoid rewriting the original prompt.
 */
function composeSystemPromptWithHookContext(params) {
  const prependSystem =
    typeof params.prependSystemContext === "string"
      ? normalizeStructuredPromptSection(params.prependSystemContext)
      : "";
  const appendSystem =
    typeof params.appendSystemContext === "string"
      ? normalizeStructuredPromptSection(params.appendSystemContext)
      : "";
  if (!prependSystem && !appendSystem) return;
  return joinPresentTextSegments([prependSystem, params.baseSystemPrompt, appendSystem], {
    trim: true,
  });
}
/**
 * Returns the workspace path that must be mounted for sandboxed spawn attempts.
 * Read-only sandbox modes need the resolved workspace explicitly; full rw
 * access uses the normal workspace wiring.
 */
function resolveAttemptSpawnWorkspaceDir(params) {
  return params.sandbox?.enabled && params.sandbox.workspaceAccess !== "rw"
    ? params.resolvedWorkspace
    : void 0;
}
/**
 * Determines whether this attempt should append a cache-TTL marker. Compaction
 * and timeout attempts skip the marker because their transcript boundary is
 * already being rewritten.
 */
function shouldAppendAttemptCacheTtl(params) {
  if (params.timedOutDuringCompaction || params.compactionOccurredThisAttempt) return false;
  return (
    params.config?.agents?.defaults?.contextPruning?.mode === "cache-ttl" &&
    params.isCacheTtlEligibleProvider(params.provider, params.modelId, params.modelApi)
  );
}
/**
 * Appends the cache-TTL transcript marker when context-pruning policy and model
 * eligibility both allow it. The boolean result tells callers whether the
 * session transcript changed.
 */
function appendAttemptCacheTtlIfNeeded(params) {
  if (!shouldAppendAttemptCacheTtl(params)) return false;
  params.sessionManager.appendCustomEntry?.(ATTEMPT_CACHE_TTL_CUSTOM_TYPE, {
    timestamp: params.now ?? Date.now(),
    provider: params.provider,
    modelId: params.modelId,
  });
  return true;
}
/**
 * Records completed bootstrap turns only after a clean, non-compaction attempt.
 * Failed, aborted, or compaction-mutated turns are not stable bootstrap history.
 */
function shouldPersistCompletedBootstrapTurn(params) {
  if (!params.shouldRecordCompletedBootstrapTurn || params.promptError || params.aborted)
    return false;
  if (params.timedOutDuringCompaction || params.compactionOccurredThisAttempt) return false;
  return true;
}
//#endregion
export {
  shouldPersistCompletedBootstrapTurn as i,
  composeSystemPromptWithHookContext as n,
  resolveAttemptSpawnWorkspaceDir as r,
  appendAttemptCacheTtlIfNeeded as t,
};
