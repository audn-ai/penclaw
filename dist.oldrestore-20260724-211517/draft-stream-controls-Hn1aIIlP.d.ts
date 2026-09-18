import {
  A as LiveMessageState,
  P as MessageReceipt,
  z as RenderedMessageBatch,
} from "./types-FwtQl4mH.js";

//#region src/channels/message/live.d.ts
/** Mutable draft preview handle used before a live message is finalized or discarded. */
type LivePreviewFinalizerDraft<TId> = {
  flush: () => Promise<void>;
  id: () => TId | undefined;
  seal?: () => Promise<void>;
  discardPending?: () => Promise<void>;
  clear: () => Promise<void>;
};
/** Outcome kind returned after attempting to finalize or fall back from a live preview. */
type LivePreviewFinalizerResultKind =
  | "normal-delivered"
  | "normal-skipped"
  | "preview-finalized"
  | "preview-retained";
/** Result of a live preview finalization attempt plus the latest live state. */
type LivePreviewFinalizerResult<TPayload> = {
  kind: LivePreviewFinalizerResultKind;
  liveState?: LiveMessageState<TPayload>;
};
/** Adapter contract for channels that can edit a draft preview into the final message. */
type FinalizableLivePreviewAdapter<TPayload, TId, TEdit> = {
  draft?: LivePreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
  createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
  onPreviewFinalized?: (
    id: TId,
    receipt: MessageReceipt,
    liveState: LiveMessageState<TPayload>,
  ) => Promise<void> | void;
  buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
  deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
  handlePreviewEditError?: (params: {
    error: unknown;
    id: TId;
    edit: TEdit;
    payload: TPayload;
    liveState: LiveMessageState<TPayload>;
  }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
  logPreviewEditFailure?: (error: unknown) => void;
};
/** Defines a finalizable live-preview adapter while preserving its generic payload/id/edit types. */
declare function defineFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(
  adapter: FinalizableLivePreviewAdapter<TPayload, TId, TEdit>,
): FinalizableLivePreviewAdapter<TPayload, TId, TEdit>;
/** Creates the initial live-message state, optionally seeded with an existing preview receipt. */
declare function createLiveMessageState<TPayload = unknown>(params?: {
  receipt?: MessageReceipt;
  lastRendered?: RenderedMessageBatch<TPayload>;
  canFinalizeInPlace?: boolean;
}): LiveMessageState<TPayload>;
/** Marks a live message as finalized and disables further in-place preview edits. */
declare function markLiveMessageFinalized<TPayload>(
  state: LiveMessageState<TPayload>,
  receipt: MessageReceipt,
): LiveMessageState<TPayload>;
/** Creates a receipt for a draft/preview platform message. */
declare function createPreviewMessageReceipt(params: {
  id: unknown;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
  raw?: unknown;
}): MessageReceipt;
/** Finalizes a live preview in place when possible, otherwise falls back to normal delivery. */
declare function deliverFinalizableLivePreview<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  liveState?: LiveMessageState<TPayload>;
  draft?: LivePreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
  onPreviewFinalized?: (
    id: TId,
    receipt: MessageReceipt,
    liveState: LiveMessageState<TPayload>,
  ) => Promise<void> | void;
  buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
  deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
  handlePreviewEditError?: (params: {
    error: unknown;
    id: TId;
    edit: TEdit;
    payload: TPayload;
    liveState: LiveMessageState<TPayload>;
  }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
  onNormalDelivered?: () => Promise<void> | void;
  logPreviewEditFailure?: (error: unknown) => void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
/** Runs live-preview finalization through an optional adapter, falling back to normal delivery. */
declare function deliverWithFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  liveState?: LiveMessageState<TPayload>;
  adapter?: FinalizableLivePreviewAdapter<TPayload, TId, TEdit>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onNormalDelivered?: () => Promise<void> | void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
/** Records the latest rendered preview batch and moves the live message into previewing state. */
declare function markLiveMessagePreviewUpdated<TPayload>(
  state: LiveMessageState<TPayload>,
  rendered: RenderedMessageBatch<TPayload>,
): LiveMessageState<TPayload>;
/** Marks a live message cancelled and prevents later in-place finalization. */
declare function markLiveMessageCancelled<TPayload>(
  state: LiveMessageState<TPayload>,
): LiveMessageState<TPayload>;
//#endregion
//#region src/channels/draft-stream-loop.d.ts
/** Throttled draft-stream sender used by channels that edit in-progress replies. */
type DraftStreamLoop = {
  update: (text: string) => void;
  flush: () => Promise<void>;
  stop: () => void;
  resetPending: () => void;
  resetThrottleWindow: () => void;
  waitForInFlight: () => Promise<void> /** Removes queued (not in-flight) text atomically and cancels its scheduled flush. */;
  takePending?: () => string;
};
type CreatedDraftStreamLoop = DraftStreamLoop & {
  takePending: () => string;
};
/** Creates a single-flight draft stream loop that preserves the newest pending text. */
declare function createDraftStreamLoop(params: {
  throttleMs: number;
  isStopped: () => boolean;
  sendOrEditStreamMessage: (text: string) => Promise<void | boolean>;
  onBackgroundFlushError?: (err: unknown) => void;
}): CreatedDraftStreamLoop;
//#endregion
//#region src/channels/draft-stream-controls.d.ts
/**
 * Mutable finalization flags shared by draft stream controls and channel adapters.
 */
type FinalizableDraftStreamState = {
  stopped: boolean;
  final: boolean;
};
type StopAndClearMessageIdParams<T> = {
  stopForClear: () => Promise<void>;
  readMessageId: () => T | undefined;
  clearMessageId: () => void;
};
type ClearFinalizableDraftMessageParams<T> = StopAndClearMessageIdParams<T> & {
  isValidMessageId: (value: unknown) => value is T;
  deleteMessage: (messageId: T) => Promise<void>;
  onDeleteFailure?: (messageId: T) => void;
  onDeleteSuccess?: (messageId: T) => void;
  warn?: (message: string) => void;
  warnPrefix: string;
};
type FinalizableDraftLifecycleParams<T> = Omit<
  ClearFinalizableDraftMessageParams<T>,
  "onDeleteFailure" | "stopForClear"
> & {
  throttleMs: number;
  state: FinalizableDraftStreamState;
  sendOrEditStreamMessage: (text: string) => Promise<boolean>;
};
/**
 * Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
 */
declare function createFinalizableDraftStreamControls(params: {
  throttleMs: number;
  isStopped: () => boolean;
  isFinal: () => boolean;
  markStopped: () => void;
  markFinal: () => void;
  sendOrEditStreamMessage: (text: string) => Promise<boolean>;
}): {
  loop: DraftStreamLoop & {
    takePending: () => string;
  };
  update: (text: string) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
/**
 * Creates finalizable draft controls backed by a shared mutable state object.
 */
declare function createFinalizableDraftStreamControlsForState(params: {
  throttleMs: number;
  state: FinalizableDraftStreamState;
  sendOrEditStreamMessage: (text: string) => Promise<boolean>;
}): {
  loop: DraftStreamLoop & {
    takePending: () => string;
  };
  update: (text: string) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
/**
 * Stops a draft stream, reads the current preview message id, then clears the stored id.
 */
declare function takeMessageIdAfterStop<T>(
  params: StopAndClearMessageIdParams<T>,
): Promise<T | undefined>;
/**
 * Stops a draft stream and deletes its preview message when the stored id is valid.
 * Claims the current id before deletion; stateful callers can retain failures through
 * onDeleteFailure without making overlapping clears delete the same message twice.
 */
declare function clearFinalizableDraftMessage<T>(
  params: ClearFinalizableDraftMessageParams<T>,
): Promise<void>;
/**
 * Builds the standard draft lifecycle used by channel streaming preview implementations.
 */
declare function createFinalizableDraftLifecycle<T>(params: FinalizableDraftLifecycleParams<T>): {
  clear: () => Promise<void>;
  clearWithStop: (stopForClear: () => Promise<void>) => Promise<void>;
  loop: DraftStreamLoop & {
    takePending: () => string;
  };
  update: (text: string) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
//#endregion
export {
  deliverWithFinalizableLivePreviewAdapter as _,
  createFinalizableDraftStreamControlsForState as a,
  markLiveMessagePreviewUpdated as b,
  createDraftStreamLoop as c,
  LivePreviewFinalizerResult as d,
  LivePreviewFinalizerResultKind as f,
  deliverFinalizableLivePreview as g,
  defineFinalizableLivePreviewAdapter as h,
  createFinalizableDraftStreamControls as i,
  FinalizableLivePreviewAdapter as l,
  createPreviewMessageReceipt as m,
  clearFinalizableDraftMessage as n,
  takeMessageIdAfterStop as o,
  createLiveMessageState as p,
  createFinalizableDraftLifecycle as r,
  DraftStreamLoop as s,
  FinalizableDraftStreamState as t,
  LivePreviewFinalizerDraft as u,
  markLiveMessageCancelled as v,
  markLiveMessageFinalized as y,
};
