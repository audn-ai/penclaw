import {
  a as createChannelRunQueue,
  c as waitUntilAbort,
  i as createAccountStatusSink,
  l as createRunStateMachine,
  n as ChannelRunQueueParams,
  o as keepHttpServerTaskAlive,
  r as ChannelRunQueueTaskContext,
  s as runPassiveAccountLifecycle,
  t as ChannelRunQueue,
} from "../channel-lifecycle.core-CsQgW7Vx.js";
import {
  a as createFinalizableDraftStreamControlsForState,
  c as createDraftStreamLoop,
  f as LivePreviewFinalizerResultKind,
  i as createFinalizableDraftStreamControls,
  n as clearFinalizableDraftMessage,
  o as takeMessageIdAfterStop,
  r as createFinalizableDraftLifecycle,
  s as DraftStreamLoop,
  t as FinalizableDraftStreamState,
  u as LivePreviewFinalizerDraft,
} from "../draft-stream-controls-Hn1aIIlP.js";
import { n as RuntimeEnv } from "../runtime-Bxifh4bY.js";

//#region src/channels/draft-preview-finalizer.d.ts
/**
 * @deprecated Use `LivePreviewFinalizerDraft` from `openclaw/plugin-sdk/channel-outbound`.
 */
type DraftPreviewFinalizerDraft<TId> = LivePreviewFinalizerDraft<TId>;
/**
 * @deprecated Use `LivePreviewFinalizerResult` from `openclaw/plugin-sdk/channel-outbound`.
 */
type DraftPreviewFinalizerResult = Exclude<LivePreviewFinalizerResultKind, "preview-retained">;
/**
 * @deprecated Use `deliverFinalizableLivePreview` from `openclaw/plugin-sdk/channel-outbound`.
 */
declare function deliverFinalizableDraftPreview<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  draft?: DraftPreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onPreviewFinalized?: (id: TId) => Promise<void> | void;
  onNormalDelivered?: () => Promise<void> | void;
  logPreviewEditFailure?: (error: unknown) => void;
}): Promise<DraftPreviewFinalizerResult>;
//#endregion
//#region src/channels/transport/stall-watchdog.d.ts
type StallWatchdogTimeoutMeta = {
  idleMs: number;
  timeoutMs: number;
};
/** Public control surface for a transport stall watchdog instance. */
type ArmableStallWatchdog = {
  arm: (atMs?: number) => void;
  touch: (atMs?: number) => void;
  disarm: () => void;
  stop: () => void;
  isArmed: () => boolean;
};
/** Creates a watchdog that reports once when an armed transport goes idle. */
declare function createArmableStallWatchdog(params: {
  label: string;
  timeoutMs: number;
  checkIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime?: RuntimeEnv;
  onTimeout: (meta: StallWatchdogTimeoutMeta) => void;
}): ArmableStallWatchdog;
//#endregion
export {
  type ArmableStallWatchdog,
  ChannelRunQueue,
  ChannelRunQueueParams,
  ChannelRunQueueTaskContext,
  DraftPreviewFinalizerDraft,
  DraftPreviewFinalizerResult,
  DraftStreamLoop,
  FinalizableDraftStreamState,
  type StallWatchdogTimeoutMeta,
  clearFinalizableDraftMessage,
  createAccountStatusSink,
  createArmableStallWatchdog,
  createChannelRunQueue,
  createDraftStreamLoop,
  createFinalizableDraftLifecycle,
  createFinalizableDraftStreamControls,
  createFinalizableDraftStreamControlsForState,
  createRunStateMachine,
  deliverFinalizableDraftPreview,
  keepHttpServerTaskAlive,
  runPassiveAccountLifecycle,
  takeMessageIdAfterStop,
  waitUntilAbort,
};
