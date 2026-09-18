import { g as OpenClawPluginApi } from "./plugin-entry-DPCR66aO.js";
import { C as CircuitBreakerEntry, b as ActiveRecallResult } from "./types-Di2zMoWq.js";

//#region extensions/active-memory/recall-state.d.ts
declare function buildCircuitBreakerKey(agentId: string, provider?: string, model?: string): string;
declare function isCircuitBreakerOpen(
  key: string,
  maxTimeouts: number,
  cooldownMs: number,
): boolean;
declare function recordCircuitBreakerTimeout(key: string): void;
declare function resetCircuitBreaker(key: string): void;
declare function scheduleMemorySearchCleanupAfterTimeout(
  api: OpenClawPluginApi,
  logPrefix: string,
  agentId: string,
): void;
declare function buildCacheKey(params: {
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  query: string;
}): string;
declare function getCachedResult(cacheKey: string): ActiveRecallResult | undefined;
declare function setCachedResult(cacheKey: string, result: ActiveRecallResult, ttlMs: number): void;
declare function toSingleLineLogValue(value: unknown): string;
declare function shouldCacheResult(result: ActiveRecallResult): boolean;
declare function resetActiveRecallStateForTests(): void;
declare function getCircuitBreakerEntry(key: string): CircuitBreakerEntry | undefined;
//#endregion
export {
  isCircuitBreakerOpen as a,
  resetCircuitBreaker as c,
  shouldCacheResult as d,
  toSingleLineLogValue as f,
  getCircuitBreakerEntry as i,
  scheduleMemorySearchCleanupAfterTimeout as l,
  buildCircuitBreakerKey as n,
  recordCircuitBreakerTimeout as o,
  getCachedResult as r,
  resetActiveRecallStateForTests as s,
  buildCacheKey as t,
  setCachedResult as u,
};
