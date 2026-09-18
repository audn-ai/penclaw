import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./operator-scopes-CpPJIv7P.js";
import "./method-scopes-DrxGpKMT.js";
//#region src/gateway/operator-approval-authorization.ts
function normalizeIdentity(value) {
  return normalizeOptionalString(value) ?? null;
}
function normalizeIdentities(values) {
  const normalized = /* @__PURE__ */ new Set();
  for (const value of values ?? []) {
    const identity = normalizeIdentity(value);
    if (identity) normalized.add(identity);
  }
  return [...normalized];
}
/** Whether a client may inspect safe approval projections. */
function canReviewOperatorApproval(client) {
  const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
  if (scopes.includes("operator.admin")) return true;
  if (!scopes.includes("operator.approvals")) return false;
  return Boolean(normalizeOptionalString(client?.connect?.device?.id));
}
/** Whether a client may submit an approval verdict. */
function canResolveOperatorApproval(client) {
  const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
  return (
    (client?.internal?.approvalRuntime === true && scopes.includes("operator.approvals")) ||
    canReviewOperatorApproval(client)
  );
}
/** Whether a broadly authorized client may access one bound approval record. */
function canAccessOperatorApproval(params) {
  if (
    !(params.allowApprovalRuntime
      ? canResolveOperatorApproval(params.client)
      : canReviewOperatorApproval(params.client))
  )
    return false;
  if (
    (Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : []).includes(
      "operator.admin",
    )
  )
    return true;
  if (params.allowApprovalRuntime && params.client?.internal?.approvalRuntime === true) return true;
  const clientDeviceId = normalizeIdentity(params.client?.connect?.device?.id);
  const reviewerDeviceIds = normalizeIdentities(params.binding.reviewerDeviceIds);
  if (reviewerDeviceIds.length > 0)
    return Boolean(clientDeviceId && reviewerDeviceIds.includes(clientDeviceId));
  return true;
}
//#endregion
export {
  canResolveOperatorApproval as n,
  canReviewOperatorApproval as r,
  canAccessOperatorApproval as t,
};
