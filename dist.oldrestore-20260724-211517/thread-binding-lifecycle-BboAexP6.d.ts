//#region src/channels/thread-bindings-messages.d.ts
/** Formats thread-binding timeout durations for compact user-facing messages. */
declare function formatThreadBindingDurationLabel(durationMs: number): string;
/** Builds the native thread name for a focused thread-bound session. */
declare function resolveThreadBindingThreadName(params: {
  agentId?: string;
  label?: string;
}): string;
/** Builds the system-prefixed intro text posted when a thread binding becomes active. */
declare function resolveThreadBindingIntroText(params: {
  agentId?: string;
  label?: string;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
  sessionCwd?: string;
  sessionDetails?: string[];
}): string;
/** Builds the system-prefixed farewell text posted when a thread binding ends. */
declare function resolveThreadBindingFarewellText(params: {
  reason?: string;
  farewellText?: string;
  idleTimeoutMs: number;
  maxAgeMs: number;
}): string;
//#endregion
//#region src/shared/thread-binding-lifecycle.d.ts
/** Persisted timestamps and optional TTL overrides for one channel thread binding. */
type ThreadBindingLifecycleRecord = {
  /** Epoch milliseconds when the binding was created. */ boundAt: number /** Epoch milliseconds of the latest activity seen for the bound conversation. */;
  lastActivityAt: number /** Optional idle timeout override in milliseconds; zero disables idle expiry. */;
  idleTimeoutMs?: number /** Optional max-age override in milliseconds; zero disables max-age expiry. */;
  maxAgeMs?: number;
};
/** Resolves the next expiration for a channel thread binding from idle and max-age limits. */
declare function resolveThreadBindingLifecycle(params: {
  /** Stored binding timestamps and optional timeout overrides. */ record: ThreadBindingLifecycleRecord /** Fallback idle timeout in milliseconds when the record has no override. */;
  defaultIdleTimeoutMs: number /** Fallback max-age timeout in milliseconds when the record has no override. */;
  defaultMaxAgeMs: number;
}): {
  /** Earliest expiration timestamp, omitted when both limits are disabled. */ expiresAt?: number /** Expiration source corresponding to `expiresAt`. */;
  reason?: "idle-expired" | "max-age-expired";
};
//#endregion
export {
  resolveThreadBindingIntroText as a,
  resolveThreadBindingFarewellText as i,
  resolveThreadBindingLifecycle as n,
  resolveThreadBindingThreadName as o,
  formatThreadBindingDurationLabel as r,
  ThreadBindingLifecycleRecord as t,
};
