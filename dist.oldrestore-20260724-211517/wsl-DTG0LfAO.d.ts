//#region src/infra/env.d.ts
type AcceptedEnvOption = {
  key: string;
  description: string;
  value?: string;
  redact?: boolean;
};
/** Logs an accepted env option once, with optional redaction for sensitive values. */
declare function logAcceptedEnvOption(option: AcceptedEnvOption): void;
/** Normalizes the legacy Z_AI_API_KEY spelling into the canonical ZAI_API_KEY env var. */
declare function normalizeZaiEnv(env?: NodeJS.ProcessEnv): void;
/** Expands env keys to include aliases that process-wide normalization treats as equivalent. */
declare function expandEnvNormalizationKeys(keys: Iterable<string>): Set<string>;
/** Resolves one env key to its canonical-first runtime normalization group. */
declare function resolveEnvNormalizationKeys(key: string): readonly string[];
/** Interprets common human/operator truthy env strings. */
declare function isTruthyEnvValue(value?: string): boolean;
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
declare function isVitestRuntimeEnv(env?: NodeJS.ProcessEnv): boolean;
/** Applies process-wide env normalization before runtime configuration is read. */
declare function normalizeEnv(): void;
//#endregion
//#region src/infra/format-time/format-duration.d.ts
type FormatDurationSecondsOptions = {
  decimals?: number;
  unit?: "s" | "seconds";
};
type FormatDurationCompactOptions = {
  /** Add space between units: "2m 5s" instead of "2m5s". Default: false */ spaced?: boolean;
};
declare function formatDurationSeconds(ms: number, options?: FormatDurationSecondsOptions): string;
/** Precise decimal-seconds output: "500ms" or "1.23s". Input is milliseconds. */
declare function formatDurationPrecise(ms: number, options?: FormatDurationSecondsOptions): string;
/**
 * Compact compound duration: "500ms", "45s", "2m5s", "1h30m".
 * With `spaced`: "45s", "2m 5s", "1h 30m".
 * Omits trailing zero components: "1m" not "1m 0s", "2h" not "2h 0m".
 * Returns undefined for null/undefined/non-finite/non-positive input.
 */
declare function formatDurationCompact(
  ms?: number | null,
  options?: FormatDurationCompactOptions,
): string | undefined;
/**
 * Rounded single-unit duration for display: "500ms", "5s", "3m", "2h", "5d".
 * Returns fallback string for null/undefined/non-finite input.
 */
declare function formatDurationHuman(ms?: number | null, fallback?: string): string;
//#endregion
//#region src/infra/net/undici-global-dispatcher.d.ts
declare const DEFAULT_UNDICI_STREAM_TIMEOUT_MS: number;
/**
 * Module-level bridge so `resolveDispatcherTimeoutMs` in fetch-guard.ts
 * can read the global dispatcher timeout without relying on Undici's
 * non-public `.options` field.
 */
declare let globalUndiciStreamTimeoutMs: number | undefined;
/** Installs the env-proxy global dispatcher once proxy env is available. */
declare function ensureGlobalUndiciEnvProxyDispatcher(): void;
/**
 * Records the stream timeout bridge and applies it only when the current global
 * dispatcher already uses env or managed proxy routing.
 */
declare function ensureGlobalUndiciStreamTimeouts(opts?: { timeoutMs?: number }): void;
/** Forces timeout/family policy onto the current supported global dispatcher. */
declare function ensureGlobalUndiciDispatcherStreamTimeouts(opts?: { timeoutMs?: number }): void;
/** Clears module-level dispatcher bookkeeping between isolated tests. */
declare function resetGlobalUndiciStreamTimeoutsForTests(): void;
/**
 * Re-evaluate proxy env changes for root undici imports. Installs
 * EnvHttpProxyAgent when proxy env is present, and restores a direct Agent
 * after proxy env is cleared.
 */
declare function forceResetGlobalDispatcher(opts?: { preserveProxylineManaged?: boolean }): void;
//#endregion
//#region src/infra/wsl.d.ts
/** Clears the cached async WSL detection result between isolated tests. */
declare function resetWSLStateForTests(): void;
/** Detects WSL from environment variables without touching the filesystem. */
declare function isWSLEnv(env?: Record<string, string | undefined>): boolean;
/**
 * Synchronously detects WSL from env vars first, then `/proc/version`.
 */
declare function isWSLSync(): boolean;
/**
 * Synchronously detects WSL2 from kernel-version markers after WSL detection.
 */
declare function isWSL2Sync(): boolean;
/** Asynchronously detects WSL from env vars and `/proc/sys/kernel/osrelease`, with process cache. */
declare function isWSL(): Promise<boolean>;
//#endregion
export {
  normalizeEnv as C,
  logAcceptedEnvOption as S,
  resolveEnvNormalizationKeys as T,
  formatDurationPrecise as _,
  resetWSLStateForTests as a,
  isTruthyEnvValue as b,
  ensureGlobalUndiciEnvProxyDispatcher as c,
  globalUndiciStreamTimeoutMs as d,
  resetGlobalUndiciStreamTimeoutsForTests as f,
  formatDurationHuman as g,
  formatDurationCompact as h,
  isWSLSync as i,
  ensureGlobalUndiciStreamTimeouts as l,
  FormatDurationSecondsOptions as m,
  isWSL2Sync as n,
  DEFAULT_UNDICI_STREAM_TIMEOUT_MS as o,
  FormatDurationCompactOptions as p,
  isWSLEnv as r,
  ensureGlobalUndiciDispatcherStreamTimeouts as s,
  isWSL as t,
  forceResetGlobalDispatcher as u,
  formatDurationSeconds as v,
  normalizeZaiEnv as w,
  isVitestRuntimeEnv as x,
  expandEnvNormalizationKeys as y,
};
