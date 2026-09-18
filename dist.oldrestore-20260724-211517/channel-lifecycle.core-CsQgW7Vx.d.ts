import { r as ChannelAccountSnapshot } from "./types.core-CcwzPNhX.js";

//#region src/channels/run-state-machine.d.ts
type RunStateStatusPatch = {
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
};
/** Status sink used by channel run-state updates. */
type RunStateStatusSink = (patch: RunStateStatusPatch) => void;
type RunStateMachineParams = {
  setStatus?: RunStateStatusSink;
  abortSignal?: AbortSignal;
  heartbeatMs?: number;
  now?: () => number;
};
/** Creates a channel run-state tracker with heartbeat updates while runs are active. */
declare function createRunStateMachine(params: RunStateMachineParams): {
  isActive(): boolean;
  onRunStart(): void;
  onRunEnd(): void;
  deactivate: () => void;
};
//#endregion
//#region src/plugin-sdk/channel-lifecycle.core.d.ts
type CloseAwareServer = {
  once: (event: "close", listener: () => void) => unknown;
};
type PassiveAccountLifecycleParams<Handle> = {
  abortSignal?: AbortSignal;
  start: () => Promise<Handle>;
  stop?: (handle: Handle) => void | Promise<void>;
  onStop?: () => void | Promise<void>;
};
/** Runtime context passed to queued channel work. */
type ChannelRunQueueTaskContext = {
  /** Signal tied to the channel/account lifecycle that owns the queued work. */ lifecycleSignal?: AbortSignal;
};
/** Per-key async queue used by channel plugins to serialize account or thread work. */
type ChannelRunQueue = {
  /** Enqueue work under a serialization key such as account id, thread id, or chat id. */ enqueue: (
    key: string,
    task: (context: ChannelRunQueueTaskContext) => Promise<void>,
  ) => void /** Stop accepting meaningful work and mark the lifecycle as inactive. */;
  deactivate: () => void;
};
/** Hooks used to wire channel queue state into runtime status and error reporting. */
type ChannelRunQueueParams = {
  /** Receives busy/idle lifecycle snapshots from the shared run-state machine. */ setStatus?: RunStateStatusSink /** Lifecycle signal propagated to queued tasks. */;
  abortSignal?: AbortSignal /** Best-effort sink for task failures after enqueueing. */;
  onError?: (error: unknown) => void;
};
/** Bind a fixed account id into a status writer so lifecycle code can emit partial snapshots. */
declare function createAccountStatusSink(params: {
  accountId: string;
  setStatus: (next: ChannelAccountSnapshot) => void;
}): (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
/**
 * Serialize channel work per key while keeping lifecycle/busy accounting out of
 * channel-specific message handlers. The queue does not impose run timeouts;
 * callers should rely on session/tool/runtime lifecycle for long-running work.
 */
declare function createChannelRunQueue(params: ChannelRunQueueParams): ChannelRunQueue;
/**
 * Return a promise that resolves when the signal is aborted.
 *
 * If no signal is provided, the promise stays pending forever. When provided,
 * `onAbort` runs once before the promise resolves.
 */
declare function waitUntilAbort(
  signal?: AbortSignal,
  onAbort?: () => void | Promise<void>,
): Promise<void>;
/**
 * Keep a passive account task alive until abort, then run optional cleanup.
 */
declare function runPassiveAccountLifecycle<Handle>(
  params: PassiveAccountLifecycleParams<Handle>,
): Promise<void>;
/**
 * Keep a channel/provider task pending until the HTTP server closes.
 *
 * When an abort signal is provided, `onAbort` is invoked once and should
 * trigger server shutdown. The returned promise resolves only after `close`.
 */
declare function keepHttpServerTaskAlive(params: {
  server: CloseAwareServer;
  abortSignal?: AbortSignal;
  onAbort?: () => void | Promise<void>;
}): Promise<void>;
//#endregion
export {
  createChannelRunQueue as a,
  waitUntilAbort as c,
  createAccountStatusSink as i,
  createRunStateMachine as l,
  ChannelRunQueueParams as n,
  keepHttpServerTaskAlive as o,
  ChannelRunQueueTaskContext as r,
  runPassiveAccountLifecycle as s,
  ChannelRunQueue as t,
};
