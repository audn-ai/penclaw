import { o as getModelRef } from "./query-DX527y0q.js";
import { t as runRecallSubagent } from "./recall-run-CzbOyZAG.js";
import {
  a as isCircuitBreakerOpen,
  c as resetCircuitBreaker,
  d as shouldCacheResult,
  f as toSingleLineLogValue,
  l as scheduleMemorySearchCleanupAfterTimeout,
  n as buildCircuitBreakerKey,
  o as recordCircuitBreakerTimeout,
  r as getCachedResult,
  t as buildCacheKey,
  u as setCachedResult,
} from "./recall-state-BtFV2Jn8.js";
import {
  n as buildPluginStatusLine,
  r as persistPluginStatusLines,
  t as buildPersistedDebugSummary,
} from "./session-BHzzCQEf.js";
import {
  n as buildSubagentRecallResult,
  r as buildTimeoutRecallResult,
  s as readPartialTimeoutData,
} from "./transcript-result-CGTBO0My.js";
import { a as watchTerminalMemorySearchResult } from "./transcript-watch-BDDL56fg.js";
//#region extensions/active-memory/recall.ts
async function maybeResolveActiveRecall(params) {
  params.abortSignal?.throwIfAborted();
  const startedAt = Date.now();
  const cacheKey = buildCacheKey({
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
    query: params.query,
  });
  const cached = getCachedResult(cacheKey);
  const resolvedModelRef = getModelRef(params.api, params.agentId, params.config, {
    modelProviderId: params.currentModelProviderId,
    modelId: params.currentModelId,
  });
  const logPrefix = [
    `active-memory: agent=${toSingleLineLogValue(params.agentId)}`,
    `session=${toSingleLineLogValue(params.sessionKey ?? params.sessionId ?? "none")}`,
    ...(resolvedModelRef?.provider
      ? [`activeProvider=${toSingleLineLogValue(resolvedModelRef.provider)}`]
      : []),
    ...(resolvedModelRef?.model
      ? [`activeModel=${toSingleLineLogValue(resolvedModelRef.model)}`]
      : []),
  ].join(" ");
  if (cached) {
    params.abortSignal?.throwIfAborted();
    await persistPluginStatusLines({
      api: params.api,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      statusLine: `${buildPluginStatusLine({
        result: cached,
        config: params.config,
      })} cached`,
      debugSummary: buildPersistedDebugSummary(cached),
      searchDebug: cached.searchDebug,
    });
    params.abortSignal?.throwIfAborted();
    if (params.config.logging)
      params.api.logger.info?.(
        `${logPrefix} cached status=${cached.status} summaryChars=${String(cached.summary?.length ?? 0)} queryChars=${String(params.query.length)}`,
      );
    return cached;
  }
  const cbKey = buildCircuitBreakerKey(
    params.agentId,
    resolvedModelRef?.provider,
    resolvedModelRef?.model,
  );
  let timeoutCleanupScheduled = false;
  const scheduleTimeoutCleanup = () => {
    if (timeoutCleanupScheduled) return;
    timeoutCleanupScheduled = true;
    scheduleMemorySearchCleanupAfterTimeout(params.api, logPrefix, params.agentId);
  };
  let circuitBreakerTimeoutRecorded = false;
  const recordRecallTimeout = () => {
    if (!circuitBreakerTimeoutRecorded) {
      circuitBreakerTimeoutRecorded = true;
      recordCircuitBreakerTimeout(cbKey);
    }
    scheduleTimeoutCleanup();
  };
  if (
    isCircuitBreakerOpen(
      cbKey,
      params.config.circuitBreakerMaxTimeouts,
      params.config.circuitBreakerCooldownMs,
    )
  ) {
    const result = {
      status: "timeout",
      elapsedMs: 0,
      summary: null,
    };
    if (params.config.logging)
      params.api.logger.info?.(
        `${logPrefix} skipped (circuit breaker open after consecutive timeouts)`,
      );
    params.abortSignal?.throwIfAborted();
    await persistPluginStatusLines({
      api: params.api,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      statusLine: `${buildPluginStatusLine({
        result,
        config: params.config,
      })} circuit-breaker`,
    });
    return result;
  }
  if (params.config.logging)
    params.api.logger.info?.(
      `${logPrefix} start timeoutMs=${String(params.config.timeoutMs)} queryChars=${String(params.query.length)} searchQueryChars=${String(params.searchQuery.length)}`,
    );
  const controller = new AbortController();
  const abortFromParent = () => controller.abort(params.abortSignal?.reason);
  params.abortSignal?.addEventListener("abort", abortFromParent, { once: true });
  if (params.abortSignal?.aborted) abortFromParent();
  const TIMEOUT_SENTINEL = Symbol("timeout");
  let transcriptSources = [];
  let recallTimedOut = false;
  const watchdogTimeoutMs = params.config.timeoutMs + params.config.setupGraceTimeoutMs;
  const timeoutId = setTimeout(() => {
    if (params.abortSignal?.aborted) return;
    recallTimedOut = true;
    controller.abort(
      /* @__PURE__ */ new Error(`active-memory timeout after ${watchdogTimeoutMs}ms`),
    );
  }, watchdogTimeoutMs);
  timeoutId.unref?.();
  const timeoutPromise = new Promise((resolve) => {
    controller.signal.addEventListener(
      "abort",
      () => {
        resolve(TIMEOUT_SENTINEL);
      },
      { once: true },
    );
  });
  let terminalMemorySearchWatch;
  let recallInFlight = false;
  try {
    recallInFlight = true;
    const subagentPromise = runRecallSubagent({
      ...params,
      modelRef: resolvedModelRef,
      abortSignal: controller.signal,
      onTranscriptSources: (sources) => {
        transcriptSources = sources;
      },
    });
    terminalMemorySearchWatch = watchTerminalMemorySearchResult({
      getTranscriptSources: () => transcriptSources,
      abortSignal: controller.signal,
      toolsAllow: params.config.toolsAllow,
    });
    subagentPromise.catch(() => void 0);
    let raceResult = await Promise.race([
      subagentPromise,
      timeoutPromise,
      terminalMemorySearchWatch.promise,
    ]);
    terminalMemorySearchWatch.stop();
    let fallbackSearchDebug;
    let fallbackHasUsableMemoryResult = false;
    if (
      raceResult !== TIMEOUT_SENTINEL &&
      "status" in raceResult &&
      raceResult.hasUsableMemoryResult
    ) {
      fallbackSearchDebug = raceResult.searchDebug;
      fallbackHasUsableMemoryResult = true;
      raceResult = await Promise.race([subagentPromise, timeoutPromise]);
    }
    if (raceResult !== TIMEOUT_SENTINEL) recallInFlight = false;
    if (raceResult === TIMEOUT_SENTINEL) {
      if (recallTimedOut) recordRecallTimeout();
      else if (params.abortSignal?.aborted && recallInFlight) scheduleTimeoutCleanup();
      const elapsedMs = Date.now() - startedAt;
      const result = fallbackHasUsableMemoryResult
        ? {
            status: "timeout",
            elapsedMs,
            summary: null,
            searchDebug: fallbackSearchDebug,
          }
        : await buildTimeoutRecallResult({
            elapsedMs,
            maxSummaryChars: params.config.maxSummaryChars,
            transcriptSources,
            subagentPromise,
            toolsAllow: params.config.toolsAllow,
          });
      if (params.config.logging)
        params.api.logger.info?.(
          `${logPrefix} done status=${result.status} elapsedMs=${String(result.elapsedMs)} summaryChars=${String(result.summary?.length ?? 0)}`,
        );
      params.abortSignal?.throwIfAborted();
      await persistPluginStatusLines({
        api: params.api,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        statusLine: buildPluginStatusLine({
          result,
          config: params.config,
        }),
        debugSummary: buildPersistedDebugSummary(result),
        searchDebug: result.searchDebug,
      });
      params.abortSignal?.throwIfAborted();
      return result;
    }
    if ("status" in raceResult) {
      controller.abort(/* @__PURE__ */ new Error("active-memory terminal memory search result"));
      const result = {
        status: raceResult.status,
        elapsedMs: Date.now() - startedAt,
        summary: null,
        searchDebug: raceResult.searchDebug,
      };
      if (params.config.logging)
        params.api.logger.info?.(
          `${logPrefix} done status=${result.status} elapsedMs=${String(result.elapsedMs)} summaryChars=${String(result.summary?.length ?? 0)}`,
        );
      resetCircuitBreaker(cbKey);
      params.abortSignal?.throwIfAborted();
      await persistPluginStatusLines({
        api: params.api,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        statusLine: buildPluginStatusLine({
          result,
          config: params.config,
        }),
        searchDebug: result.searchDebug,
      });
      params.abortSignal?.throwIfAborted();
      if (shouldCacheResult(result)) setCachedResult(cacheKey, result, params.config.cacheTtlMs);
      return result;
    }
    const { transcriptPath } = raceResult;
    if (params.config.logging && transcriptPath)
      params.api.logger.info?.(`${logPrefix} transcript=${transcriptPath}`);
    const result = buildSubagentRecallResult({
      subagentResult: raceResult,
      fallbackSearchDebug,
      fallbackHasUsableMemoryResult,
      elapsedMs: Date.now() - startedAt,
      maxSummaryChars: params.config.maxSummaryChars,
    });
    if (params.config.logging)
      params.api.logger.info?.(
        `${logPrefix} done status=${result.status} elapsedMs=${String(result.elapsedMs)} summaryChars=${String(result.summary?.length ?? 0)}`,
      );
    resetCircuitBreaker(cbKey);
    params.abortSignal?.throwIfAborted();
    await persistPluginStatusLines({
      api: params.api,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      statusLine: buildPluginStatusLine({
        result,
        config: params.config,
      }),
      debugSummary: buildPersistedDebugSummary(result),
      searchDebug: result.searchDebug,
    });
    params.abortSignal?.throwIfAborted();
    if (shouldCacheResult(result)) setCachedResult(cacheKey, result, params.config.cacheTtlMs);
    return result;
  } catch (error) {
    if (params.abortSignal?.aborted) {
      if (recallTimedOut) recordRecallTimeout();
      else if (recallInFlight) scheduleTimeoutCleanup();
      params.abortSignal.throwIfAborted();
    }
    if (controller.signal.aborted) {
      if (recallTimedOut) recordRecallTimeout();
      const partialTimeoutData = readPartialTimeoutData(error);
      const result = await buildTimeoutRecallResult({
        elapsedMs: Date.now() - startedAt,
        maxSummaryChars: params.config.maxSummaryChars,
        transcriptSources,
        rawReply: partialTimeoutData.rawReply,
        searchDebug: partialTimeoutData.searchDebug,
        hasUnavailableMemorySearchResult: partialTimeoutData.hasUnavailableMemorySearchResult,
        toolsAllow: params.config.toolsAllow,
      });
      if (params.config.logging)
        params.api.logger.info?.(
          `${logPrefix} done status=${result.status} elapsedMs=${String(result.elapsedMs)} summaryChars=${String(result.summary?.length ?? 0)}`,
        );
      params.abortSignal?.throwIfAborted();
      await persistPluginStatusLines({
        api: params.api,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        statusLine: buildPluginStatusLine({
          result,
          config: params.config,
        }),
        debugSummary: buildPersistedDebugSummary(result),
        searchDebug: result.searchDebug,
      });
      params.abortSignal?.throwIfAborted();
      return result;
    }
    const message = toSingleLineLogValue(error instanceof Error ? error.message : String(error));
    if (params.config.logging)
      params.api.logger.warn?.(`${logPrefix} failed error=${message}; skipping recall`);
    const result = {
      status: "failed",
      elapsedMs: Date.now() - startedAt,
      summary: null,
    };
    params.abortSignal?.throwIfAborted();
    await persistPluginStatusLines({
      api: params.api,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      statusLine: buildPluginStatusLine({
        result,
        config: params.config,
      }),
      searchDebug: result.searchDebug,
    });
    return result;
  } finally {
    params.abortSignal?.removeEventListener("abort", abortFromParent);
    terminalMemorySearchWatch?.stop();
    clearTimeout(timeoutId);
  }
}
//#endregion
export { maybeResolveActiveRecall as t };
