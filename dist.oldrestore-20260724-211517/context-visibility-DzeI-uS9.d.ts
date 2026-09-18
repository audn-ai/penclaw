import { f as ContextVisibilityMode } from "./types.base-ibSxQuK3.js";

//#region src/security/context-visibility.d.ts
/** Supplemental context classes that can be hidden independently from the main message. */
type ContextVisibilityKind = "history" | "thread" | "quote" | "forwarded";
/** Machine-readable reason for a supplemental context visibility decision. */
type ContextVisibilityDecisionReason =
  /** Visibility mode includes all supplemental context. */ | "mode_all" /** Sender allowlist includes the item source. */
    | "sender_allowed" /** Quote-only visibility mode permits quoted context even when sender is not allowed. */
    | "quote_override" /** Context was omitted by visibility mode or sender policy. */
    | "blocked";
/** Visibility decision returned to callers that need both the boolean result and audit reason. */
type ContextVisibilityDecision = {
  /** Whether the supplemental context item should be included. */ include: boolean /** Rule that decided inclusion or omission. */;
  reason: ContextVisibilityDecisionReason;
};
/** Evaluates one supplemental context item against mode, kind, and sender allowlist state. */
declare function evaluateSupplementalContextVisibility(params: {
  /** Configured visibility mode for the current channel or default policy. */ mode: ContextVisibilityMode /** Supplemental context class being evaluated. */;
  kind: ContextVisibilityKind /** Whether the item source is permitted by the sender allowlist. */;
  senderAllowed: boolean;
}): ContextVisibilityDecision;
/** Boolean shorthand for callers that do not need the audit reason. */
declare function shouldIncludeSupplementalContext(params: {
  /** Configured visibility mode for the current channel or default policy. */ mode: ContextVisibilityMode /** Supplemental context class being evaluated. */;
  kind: ContextVisibilityKind /** Whether the item source is permitted by the sender allowlist. */;
  senderAllowed: boolean;
}): boolean;
/** Filters supplemental context items and reports how many were omitted by visibility policy. */
declare function filterSupplementalContextItems<T>(params: {
  /** Candidate supplemental context items in original delivery order. */ items: readonly T[] /** Configured visibility mode for the current channel or default policy. */;
  mode: ContextVisibilityMode /** Shared supplemental context class for every candidate item. */;
  kind: ContextVisibilityKind /** Per-item allowlist predicate for the sender or source identity. */;
  isSenderAllowed: (item: T) => boolean;
}): {
  items: T[];
  omitted: number;
};
//#endregion
export {
  filterSupplementalContextItems as a,
  evaluateSupplementalContextVisibility as i,
  ContextVisibilityDecisionReason as n,
  shouldIncludeSupplementalContext as o,
  ContextVisibilityKind as r,
  ContextVisibilityDecision as t,
};
