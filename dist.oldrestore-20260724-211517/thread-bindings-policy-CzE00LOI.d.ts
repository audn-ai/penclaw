import { t as ThreadBindingLifecycleRecord } from "./thread-binding-lifecycle-BboAexP6.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/thread-binding-id.d.ts
/** Parses an account-prefixed binding id back into a conversation id. */
declare function resolveThreadBindingConversationIdFromBindingId(params: {
  accountId: string;
  bindingId?: string;
}): string | undefined;
//#endregion
//#region src/channels/thread-bindings-policy.d.ts
/** Thread-bound session type controlled by spawn policy. */
type ThreadBindingSpawnKind = "subagent" | "acp";
/** Effective per-channel/account policy for creating thread-bound sessions. */
type ThreadBindingSpawnPolicy = {
  channel: string;
  accountId: string;
  enabled: boolean;
  spawnEnabled: boolean;
  defaultSpawnContext: ThreadBindingSpawnContext;
};
/** Starting transcript mode for a spawned thread-bound session. */
type ThreadBindingSpawnContext = "isolated" | "fork";
/** Returns true when top-level commands should spawn in a child thread by default. */
/** Resolves thread-binding idle timeout with channel/account override before session default. */
declare function resolveThreadBindingIdleTimeoutMs(params: {
  channelIdleHoursRaw: unknown;
  sessionIdleHoursRaw: unknown;
}): number;
/** Resolves thread-binding max age with channel/account override before session default. */
declare function resolveThreadBindingMaxAgeMs(params: {
  channelMaxAgeHoursRaw: unknown;
  sessionMaxAgeHoursRaw: unknown;
}): number;
/** Computes the effective expiry timestamp for a thread-binding lifecycle record. */
declare function resolveThreadBindingEffectiveExpiresAt(params: {
  record: ThreadBindingLifecycleRecord;
  defaultIdleTimeoutMs: number;
  defaultMaxAgeMs: number;
}): number | undefined;
/** Resolves the effective enabled flag for thread bindings. */
declare function resolveThreadBindingsEnabled(params: {
  channelEnabledRaw: unknown;
  sessionEnabledRaw: unknown;
}): boolean;
/** Resolves effective spawn policy from account, channel, then global thread-binding config. */
declare function resolveThreadBindingSpawnPolicy(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  kind: ThreadBindingSpawnKind;
}): ThreadBindingSpawnPolicy;
/** Resolves idle timeout for a concrete channel/account config scope. */
declare function resolveThreadBindingIdleTimeoutMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Resolves max age for a concrete channel/account config scope. */
declare function resolveThreadBindingMaxAgeMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Formats the user-facing error for disabled thread bindings. */
declare function formatThreadBindingDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string;
/** Formats the user-facing error for disabled thread-bound session spawning. */
declare function formatThreadBindingSpawnDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string;
//#endregion
export {
  resolveThreadBindingEffectiveExpiresAt as a,
  resolveThreadBindingMaxAgeMs as c,
  resolveThreadBindingsEnabled as d,
  resolveThreadBindingConversationIdFromBindingId as f,
  formatThreadBindingSpawnDisabledError as i,
  resolveThreadBindingMaxAgeMsForChannel as l,
  ThreadBindingSpawnPolicy as n,
  resolveThreadBindingIdleTimeoutMs as o,
  formatThreadBindingDisabledError as r,
  resolveThreadBindingIdleTimeoutMsForChannel as s,
  ThreadBindingSpawnKind as t,
  resolveThreadBindingSpawnPolicy as u,
};
