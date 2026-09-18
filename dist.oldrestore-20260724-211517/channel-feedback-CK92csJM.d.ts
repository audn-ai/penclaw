//#region src/infra/outbound/target-errors.d.ts
/**
 * Builds an Error for missing outbound target failures.
 */
declare function missingTargetError(provider: string, hint?: string): Error;
//#endregion
//#region src/channels/status-reactions.d.ts
/** Adapter implemented by channels that expose message reaction status updates. */
type StatusReactionAdapter = {
  /** Set/replace the current reaction emoji. */ setReaction: (
    emoji: string,
  ) => Promise<void> /** Clear all status reactions for single-slot platforms such as WhatsApp. */;
  clearReaction?: () => Promise<void> /** Remove a specific reaction emoji (optional — needed for Discord-style platforms). */;
  removeReaction?: (emoji: string) => Promise<void>;
};
/** Optional emoji overrides for each status reaction state. */
type StatusReactionEmojis = {
  queued?: string;
  thinking?: string;
  tool?: string;
  coding?: string;
  web?: string;
  deploy?: string;
  build?: string;
  concierge?: string;
  done?: string;
  error?: string;
  stallSoft?: string;
  stallHard?: string;
  compacting?: string;
};
/** Timing controls for debounced status reactions and stall warnings. */
type StatusReactionTiming = {
  debounceMs?: number;
  stallSoftMs?: number;
  stallHardMs?: number;
  doneHoldMs?: number;
  errorHoldMs?: number;
};
/** Controller API for agent status reaction state transitions. */
type StatusReactionController = {
  setQueued: () => Promise<void> | void;
  setThinking: () => Promise<void> | void;
  setTool: (toolName?: string) => Promise<void> | void;
  setCompacting: () => Promise<void> | void /** Cancel any pending debounced emoji (useful before forcing a state transition). */;
  cancelPending: () => void;
  setDone: () => Promise<void>;
  setError: () => Promise<void>;
  clear: () => Promise<void>;
  restoreInitial: () => Promise<void>;
};
/** Default emoji set used by status reaction controllers. */
declare const DEFAULT_EMOJIS: Required<StatusReactionEmojis>;
/** Default debounce, stall, and terminal hold timings for status reactions. */
declare const DEFAULT_TIMING: Required<StatusReactionTiming>;
/** Tool-name tokens mapped to the coding status reaction. */
declare const CODING_TOOL_TOKENS: string[];
/** Tool-name tokens mapped to the web status reaction. */
declare const WEB_TOOL_TOKENS: string[];
/** Tool-name tokens mapped to the deploy status reaction. */
declare const DEPLOY_TOOL_TOKENS: string[];
/** Tool-name tokens mapped to the build status reaction. */
declare const BUILD_TOOL_TOKENS: string[];
/** Tool-name tokens mapped to the concierge/browser-control status reaction. */
declare const CONCIERGE_TOOL_TOKENS: string[];
/** Resolves the appropriate emoji for a tool invocation. */
declare function resolveToolEmoji(
  toolName: string | undefined,
  emojis: Required<StatusReactionEmojis>,
  emojiOverrides?: StatusReactionEmojis,
): string;
/**
 * Create a status reaction controller.
 *
 * Features:
 * - Promise chain serialization (prevents concurrent API calls)
 * - Debouncing (intermediate states debounce, terminal states are immediate)
 * - Stall timers (soft/hard warnings on inactivity)
 * - Terminal state protection (done/error mark finished, subsequent updates ignored)
 * - Defers reaction removals until final cleanup to avoid visible flicker on
 *   platforms without atomic reaction replacement
 */
declare function createStatusReactionController(params: {
  enabled: boolean;
  adapter: StatusReactionAdapter;
  initialEmoji: string;
  emojis?: StatusReactionEmojis;
  timing?: StatusReactionTiming;
  onError?: (err: unknown) => void;
}): StatusReactionController;
//#endregion
export {
  DEFAULT_TIMING as a,
  StatusReactionController as c,
  WEB_TOOL_TOKENS as d,
  createStatusReactionController as f,
  DEFAULT_EMOJIS as i,
  StatusReactionEmojis as l,
  missingTargetError as m,
  CODING_TOOL_TOKENS as n,
  DEPLOY_TOOL_TOKENS as o,
  resolveToolEmoji as p,
  CONCIERGE_TOOL_TOKENS as r,
  StatusReactionAdapter as s,
  BUILD_TOOL_TOKENS as t,
  StatusReactionTiming as u,
};
