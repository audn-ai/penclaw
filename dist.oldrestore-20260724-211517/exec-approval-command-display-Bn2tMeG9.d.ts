import { u as ExecApprovalRequestPayload } from "./exec-approvals-B59RubLo.js";

//#region src/infra/exec-approval-command-display.d.ts
/** Sanitized approval text plus size-cap status for callers that need UI affordances. */
type SanitizedExecApprovalDisplayText = {
  /** Redacted, spoof-resistant command or warning text safe for an approval prompt. */ text: string /** True when sanitized output exceeded the display cap and was shortened. */;
  truncated: boolean /** True when raw input exceeded the hard cap and was replaced with a fixed marker. */;
  oversized: boolean;
};
/** Sanitizes exec command text for approval UI without exposing status metadata. */
declare function sanitizeExecApprovalDisplayText(commandText: string): string;
/**
 * Sanitizes exec command text for approval UI and reports whether size caps changed it.
 */
declare function sanitizeExecApprovalDisplayTextWithStatus(
  commandText: string,
): SanitizedExecApprovalDisplayText;
/**
 * Sanitizes warning prose for approval UI while preserving real line boundaries.
 */
declare function sanitizeExecApprovalWarningText(warningText: string): string;
/** Resolves sanitized command and preview text for exec approval prompts. */
declare function resolveExecApprovalCommandDisplay(request: ExecApprovalRequestPayload): {
  /** Primary command text rendered in the approval prompt. */ commandText: string /** Optional shorter preview, omitted when it would duplicate the primary command text. */;
  commandPreview: string | null;
};
//#endregion
export {
  sanitizeExecApprovalWarningText as a,
  sanitizeExecApprovalDisplayTextWithStatus as i,
  resolveExecApprovalCommandDisplay as n,
  sanitizeExecApprovalDisplayText as r,
  SanitizedExecApprovalDisplayText as t,
};
