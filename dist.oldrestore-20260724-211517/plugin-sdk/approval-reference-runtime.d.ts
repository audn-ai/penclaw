//#region src/infra/approval-resolution-ref.d.ts
/** Build the full SHA-256 base64url locator used only when a transport cannot carry the exact id. */
declare function buildApprovalResolutionRef(params: {
  approvalId: string;
  approvalKind: "exec" | "plugin";
}): string;
//#endregion
export { buildApprovalResolutionRef };
