import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.js";
//#region extensions/discord/src/approval-custom-id.ts
const DISCORD_APPROVAL_CUSTOM_ID_MAX_CHARS = 100;
function encodeDiscordApprovalCustomId(action) {
  return [
    `execapproval:kind=${action.approvalKind}`,
    `id=${encodeURIComponent(action.approvalId)}`,
    `action=${action.decision}`,
  ].join(";");
}
function encodeBoundedDiscordApprovalCustomId(action) {
  const exact = encodeDiscordApprovalCustomId(action);
  if (exact.length <= DISCORD_APPROVAL_CUSTOM_ID_MAX_CHARS) return exact;
  return encodeDiscordApprovalCustomId({
    ...action,
    approvalId: buildApprovalResolutionRef({
      approvalId: action.approvalId,
      approvalKind: action.approvalKind,
    }),
  });
}
function buildDiscordApprovalCustomId(action) {
  if (
    !action.approvalId ||
    (action.approvalKind !== "exec" && action.approvalKind !== "plugin") ||
    (action.decision !== "allow-once" &&
      action.decision !== "allow-always" &&
      action.decision !== "deny")
  )
    return;
  return encodeBoundedDiscordApprovalCustomId(action);
}
function buildExecApprovalCustomId(approvalId, approvalKind, decision) {
  return encodeBoundedDiscordApprovalCustomId({
    type: "approval",
    approvalId,
    approvalKind,
    decision,
  });
}
function decodeCustomIdValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
function parseExecApprovalData(data) {
  if (!data || typeof data !== "object") return null;
  const coerce = (value) =>
    typeof value === "string" || typeof value === "number" ? String(value) : "";
  const rawId = coerce(data.id);
  const rawKind = coerce(data.kind);
  const rawAction = coerce(data.action);
  if (!rawId || (rawKind !== "exec" && rawKind !== "plugin") || !rawAction) return null;
  if (rawAction !== "allow-once" && rawAction !== "allow-always" && rawAction !== "deny")
    return null;
  const approvalId = decodeCustomIdValue(rawId);
  if (!approvalId) return null;
  return {
    approvalId,
    approvalKind: rawKind,
    action: rawAction,
  };
}
//#endregion
export {
  buildExecApprovalCustomId as n,
  parseExecApprovalData as r,
  buildDiscordApprovalCustomId as t,
};
