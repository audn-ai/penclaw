import {
  C as PendingApprovalView,
  _ as ApprovalRequest,
} from "../approval-handler-runtime-types-BO5RsjHV.js";
import { d as shouldSuppressLocalNativeExecApprovalPrompt } from "../approval-native-helpers-C-G7Kitb.js";
import { r as ExecApprovalReplyDecision } from "../exec-approval-reply-Co0mV44G.js";
import { r as ReplyPayload } from "../reply-payload-D9hNZyN3.js";

//#region src/plugin-sdk/approval-reaction-runtime.d.ts
type ApprovalKind = "exec" | "plugin";
type KeyedStore<TValue> = {
  register(
    key: string,
    value: TValue,
    opts?: {
      ttlMs?: number;
    },
  ): Promise<void>;
  lookup(key: string): Promise<TValue | undefined>;
  delete(key: string): Promise<boolean>;
};
type PersistedApprovalReactionTarget<TTarget> = {
  version: 1;
  target: TTarget;
};
/** In-memory or backed store for approval targets awaiting reaction decisions. */
type ApprovalReactionTargetStore<TTarget> = {
  register(
    key: string,
    target: TTarget,
    opts?: {
      ttlMs?: number;
    },
  ): void;
  lookup(key: string): Promise<TTarget | null>;
  delete(key: string): void;
  clearForTest(): void;
};
/** Product-ordered emoji binding for one approval decision. */
type ApprovalReactionDecisionBinding = {
  decision: ExecApprovalReplyDecision;
  emoji: string;
  label: string;
};
/** Normalized reaction decision resolved from a channel reaction key. */
type ApprovalReactionDecisionResolution = {
  decision: ExecApprovalReplyDecision;
  normalizedEmoji: string;
};
/** Stored target metadata needed to convert a reaction into an approval decision. */
type ApprovalReactionTargetRecord<TRoute = unknown> = {
  approvalId: string /** Explicit ownership; omission is supported only by the deprecated resolver. */;
  approvalKind?: ApprovalKind;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
  route?: TRoute;
  expiresAtMs?: number;
};
/** Resolved approval target and decision produced from a reaction event. */
type ApprovalReactionTargetResolution<TRoute = unknown> = ApprovalReactionDecisionResolution & {
  approvalId: string;
  approvalKind: ApprovalKind;
  route?: TRoute;
};
/** Reply payload enriched with reaction decision metadata. */
type ApprovalReactionPromptPayload = ReplyPayload & {
  allowedDecisions: readonly ExecApprovalReplyDecision[];
  reactionBindings: readonly ApprovalReactionDecisionBinding[];
};
/** Pair of reaction-enabled and manual-fallback approval prompt payloads. */
type ApprovalReactionPendingContent = {
  reactionPayload: ApprovalReactionPromptPayload;
  manualFallbackPayload: ReplyPayload;
};
/** Canonical reaction controls shown for approval prompts, in product display order. */
declare const APPROVAL_REACTION_BINDINGS: readonly [
  {
    readonly decision: "allow-once";
    readonly emoji: "👍";
    readonly label: "Allow Once";
  },
  {
    readonly decision: "allow-always";
    readonly emoji: "♾️";
    readonly label: "Allow Always";
  },
  {
    readonly decision: "deny";
    readonly emoji: "👎";
    readonly label: "Deny";
  },
];
/** List the canonical reaction bindings allowed for a specific approval request. */
declare function listApprovalReactionBindings(params: {
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): ApprovalReactionDecisionBinding[];
/** Build user-facing reaction instructions, or null when no reaction decisions are allowed. */
declare function buildApprovalReactionHint(params: {
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): string | null;
/** True when approval prompt text already carries a reaction hint block. */
declare function hasApprovalReactionHintText(text?: string | null): boolean;
/** Inserts a reaction hint after the `ID: <id>` header line, else prepends it. */
declare function insertApprovalReactionHintNearIdHeader(params: {
  text: string;
  hint: string;
}): string;
/** Adds the canonical reaction hint to approval prompt text unless one is present. */
declare function addApprovalReactionHintToText(params: {
  text: string;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): string;
/** Normalize reaction emoji so skin-tone and text/presentation variants match canonical bindings. */
declare function normalizeApprovalReactionEmoji(reactionKey: string): string;
/** Resolve a reaction key to an allowed approval decision. */
declare function resolveApprovalReactionDecision(params: {
  reactionKey: string;
  allowedDecisions: readonly ExecApprovalReplyDecision[];
}): ApprovalReactionDecisionResolution | null;
/** Resolve an explicitly typed target without deriving ownership from its id. */
declare function resolveTypedApprovalReactionTarget<TRoute = unknown>(params: {
  target:
    | (ApprovalReactionTargetRecord<TRoute> & {
        approvalKind: ApprovalKind;
      })
    | null
    | undefined;
  reactionKey: string;
}): ApprovalReactionTargetResolution<TRoute> | null;
/** Build an approval prompt payload with reaction bindings for a prepared view. */
declare function buildApprovalPendingPromptPayload(params: {
  request: ApprovalRequest;
  view: PendingApprovalView;
  nowMs: number;
}): ApprovalReactionPromptPayload;
/** Build an approval prompt payload with reaction bindings directly from a request. */
declare function buildApprovalReactionPromptPayloadForRequest(params: {
  request: ApprovalRequest;
  nowMs: number;
}): ApprovalReactionPromptPayload;
/** Build reaction and manual-fallback pending approval content for a prepared view. */
declare function buildApprovalReactionPendingContent(params: {
  request: ApprovalRequest;
  view: PendingApprovalView;
  nowMs: number;
}): ApprovalReactionPendingContent;
/** Build reaction and manual-fallback pending approval content directly from a request. */
declare function buildApprovalReactionPendingContentForRequest(params: {
  request: ApprovalRequest;
  nowMs: number;
}): ApprovalReactionPendingContent;
/** Create an approval target store backed by memory with optional persistent storage. */
declare function createApprovalReactionTargetStore<TTarget>(params: {
  namespace: string;
  maxEntries: number;
  defaultTtlMs: number;
  openStore?: (params: {
    namespace: string;
    maxEntries: number;
    defaultTtlMs: number;
  }) => KeyedStore<PersistedApprovalReactionTarget<TTarget>> | undefined;
  logPersistentError?: (error: unknown) => void;
  readPersistedTarget?: (target: unknown) => TTarget | null;
  nowMs?: () => number;
}): ApprovalReactionTargetStore<TTarget>;
//#endregion
export {
  APPROVAL_REACTION_BINDINGS,
  ApprovalReactionDecisionBinding,
  ApprovalReactionDecisionResolution,
  ApprovalReactionPendingContent,
  ApprovalReactionPromptPayload,
  ApprovalReactionTargetRecord,
  ApprovalReactionTargetResolution,
  ApprovalReactionTargetStore,
  addApprovalReactionHintToText,
  buildApprovalPendingPromptPayload,
  buildApprovalReactionHint,
  buildApprovalReactionPendingContent,
  buildApprovalReactionPendingContentForRequest,
  buildApprovalReactionPromptPayloadForRequest,
  createApprovalReactionTargetStore,
  hasApprovalReactionHintText,
  insertApprovalReactionHintNearIdHeader,
  listApprovalReactionBindings,
  normalizeApprovalReactionEmoji,
  resolveApprovalReactionDecision,
  resolveTypedApprovalReactionTarget,
  shouldSuppressLocalNativeExecApprovalPrompt,
};
