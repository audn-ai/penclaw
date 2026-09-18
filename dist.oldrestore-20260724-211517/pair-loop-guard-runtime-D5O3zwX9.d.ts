//#region src/plugin-sdk/pair-loop-guard-runtime.d.ts
/** Resolved pair-loop guard settings in milliseconds for runtime checks. */
type PairLoopGuardSettings = {
  /** Whether protection is active after config and channel capability gates. */ enabled: boolean /** Number of pair events allowed before cooldown starts. */;
  maxEventsPerWindow: number /** Rolling event window size in milliseconds. */;
  windowMs: number /** Suppression duration in milliseconds once the threshold is exceeded. */;
  cooldownMs: number;
};
/** User-facing pair-loop guard config accepted by channel plugins. */
type PairLoopGuardConfig = {
  /** Enables or disables loop protection for the channel/account scope. */ enabled?: boolean /** Number of pair events allowed before cooldown starts. */;
  maxEventsPerWindow?: number /** Rolling event window size in seconds for config files. */;
  windowSeconds?: number /** Suppression duration in seconds for config files. */;
  cooldownSeconds?: number;
};
/** Result of recording one pair interaction against the loop guard. */
type PairLoopGuardResult =
  | {
      suppressed: false;
    }
  | {
      suppressed: true;
      cooldownUntilMs: number;
    };
/** Snapshot entry for observability and tests. */
type PairLoopGuardSnapshotEntry = {
  /** Internal pair key containing scope, conversation, and unordered participant ids. */ key: string /** Number of retained events in the current window. */;
  recentCount: number /** Epoch milliseconds when cooldown ends, or zero when inactive. */;
  cooldownUntilMs: number;
};
/** In-memory guard for suppressing repeated bidirectional bot pair loops. */
type PairLoopGuard = {
  /** Records one sender/receiver interaction and reports whether it enters or is inside cooldown. */ recordAndCheck: (params: {
    /** Channel/account/provider scope that owns this conversation. */ scopeId: string /** Conversation/thread identifier where the bidirectional exchange happened. */;
    conversationId: string /** Sender id for this event; paired with receiverId without direction. */;
    senderId: string /** Receiver id for this event; paired with senderId without direction. */;
    receiverId: string /** Resolved guard thresholds for the current channel/account. */;
    settings: PairLoopGuardSettings /** Optional test/runtime clock override in epoch milliseconds. */;
    nowMs?: number;
  }) => PairLoopGuardResult /** Clears all tracked pair state and scheduled pruning state. */;
  clear: () => void /** Returns tracked pair counters for diagnostics and tests without exposing mutable state. */;
  snapshot: () => PairLoopGuardSnapshotEntry[];
};
/** Default plugin-facing loop guard config before per-channel overrides. */
declare const DEFAULT_PAIR_LOOP_GUARD_CONFIG: Required<PairLoopGuardConfig>;
/** Default runtime loop guard settings derived from the default config. */
declare const DEFAULT_PAIR_LOOP_GUARD_SETTINGS: PairLoopGuardSettings;
/** Merges pair-loop configs from broad defaults to narrow overrides, ignoring undefined values. */
declare function mergePairLoopGuardConfig(
  ...configs: Array<PairLoopGuardConfig | undefined>
): PairLoopGuardConfig | undefined;
/** Resolves runtime loop guard settings from config/defaults and the channel default-enabled gate. */
declare function resolvePairLoopGuardSettings(params: {
  config?: PairLoopGuardConfig;
  defaultsConfig?: PairLoopGuardConfig;
  defaultEnabled: boolean;
}): PairLoopGuardSettings;
/** Creates an in-memory pair-loop guard with bounded periodic pruning. */
declare function createPairLoopGuard(params?: { pruneIntervalMs?: number }): PairLoopGuard;
//#endregion
export {
  PairLoopGuardResult as a,
  createPairLoopGuard as c,
  PairLoopGuardConfig as i,
  mergePairLoopGuardConfig as l,
  DEFAULT_PAIR_LOOP_GUARD_SETTINGS as n,
  PairLoopGuardSettings as o,
  PairLoopGuard as r,
  PairLoopGuardSnapshotEntry as s,
  DEFAULT_PAIR_LOOP_GUARD_CONFIG as t,
  resolvePairLoopGuardSettings as u,
};
