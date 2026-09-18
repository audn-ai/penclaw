import { createHash } from "node:crypto";
//#region src/infra/approval-resolution-ref.ts
const APPROVAL_RESOLUTION_REF_LENGTH = 43;
/** Build the full SHA-256 base64url locator used only when a transport cannot carry the exact id. */
function buildApprovalResolutionRef(params) {
  return createHash("sha256")
    .update(params.approvalKind, "utf8")
    .update("\0", "utf8")
    .update(params.approvalId, "utf8")
    .digest("base64url");
}
function isApprovalResolutionRef(value) {
  return value.length === APPROVAL_RESOLUTION_REF_LENGTH && /^[A-Za-z0-9_-]+$/u.test(value);
}
//#endregion
export { isApprovalResolutionRef as n, buildApprovalResolutionRef as t };
