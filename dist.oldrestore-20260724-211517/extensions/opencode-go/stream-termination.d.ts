import { on as ProviderWrapStreamFnContext } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/opencode-go/stream-termination.d.ts
type ProviderStreamFn = NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
interface OpencodeGoStalledStreamWrapperOptions {
  /**
   * Provider id this wrapper applies to. Calls whose model.provider does not
   * match are forwarded untouched so the wrapper stays provider-scoped.
   */
  provider: string;
  /**
   * Maximum idle window between two stream events before the wrapper treats
   * the underlying SSE as stalled and aborts it. Must be > 0.
   */
  idleTimeoutMs: number;
  /**
   * Maximum window for stream creation and first event delivery. Must be > 0.
   */
  firstEventTimeoutMs?: number;
}
/**
 * Default idle window used in production. Matches the runtime's shared
 * `DEFAULT_LLM_IDLE_TIMEOUT_MS` (120s) so non-cron interactive runs see
 * no behavior change versus the existing watchdog, while cron runs — for
 * which the runtime disables its idle watchdog entirely
 * (`resolveLlmIdleTimeoutMs` returns 0 when `trigger === "cron"` and no
 * explicit timeout is set) — finally get a provider-owned termination
 * well before the ~622s stuck-session recovery kicks in.
 */
declare const OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT = 120000;
declare const OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT = 300000;
/**
 * Wraps an opencode-go provider stream function so that an SSE socket that
 * fails to deliver a first event or stops producing progress is aborted at the
 * provider-owned raw boundary via the injected AbortSignal, instead of waiting
 * for the much later shared runtime stuck-session recovery.
 *
 * Behavior:
 * - Provider-scoped: only applies when `model.provider === options.provider`.
 * - Idle-based: the timer covers stream creation, first event delivery, and
 *   every gap after provider progress begins; if no event arrives within
 *   `idleTimeoutMs`, the wrapper calls `controller.abort()` on the AbortSignal
 *   injected into the underlying call (so the OpenAI SDK request is genuinely
 *   interrupted, not just the iterator) and pushes a terminal `error` event
 *   downstream.
 * - Terminal-safe: when the underlying stream emits `done` or `error`, the
 *   wrapper forwards the event, clears all timers, and ends the stream.
 *
 * The wrapper never shortens the natural end of a normal completion, because
 * provider progress refreshes the idle timer and a terminal event cancels it entirely.
 */
declare function createOpencodeGoStalledStreamWrapper(
  underlying: ProviderStreamFn,
  options: OpencodeGoStalledStreamWrapperOptions,
): ProviderStreamFn;
//#endregion
export {
  OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT,
  OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT,
  createOpencodeGoStalledStreamWrapper,
};
