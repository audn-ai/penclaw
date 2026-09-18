//#region src/gateway/operator-scopes.ts
const ADMIN_SCOPE = "operator.admin";
const READ_SCOPE = "operator.read";
const WRITE_SCOPE = "operator.write";
const APPROVALS_SCOPE = "operator.approvals";
const PAIRING_SCOPE = "operator.pairing";
const TALK_SECRETS_SCOPE = "operator.talk.secrets";
const KNOWN_OPERATOR_SCOPES = /* @__PURE__ */ new Set([
  ADMIN_SCOPE,
  READ_SCOPE,
  WRITE_SCOPE,
  APPROVALS_SCOPE,
  PAIRING_SCOPE,
  TALK_SECRETS_SCOPE,
]);
/** Narrows untrusted auth-token scope entries to the gateway's closed scope set. */
function isOperatorScope(value) {
  return typeof value === "string" && KNOWN_OPERATOR_SCOPES.has(value);
}
/** Filters unknown strings down to unique operator scopes; undefined stays undefined. */
function normalizeOperatorScopeList(scopes) {
  if (!Array.isArray(scopes)) return;
  const normalized = [];
  for (const scope of scopes)
    if (isOperatorScope(scope) && !normalized.includes(scope)) normalized.push(scope);
  return normalized;
}
//#endregion
export {
  TALK_SECRETS_SCOPE as a,
  normalizeOperatorScopeList as c,
  READ_SCOPE as i,
  APPROVALS_SCOPE as n,
  WRITE_SCOPE as o,
  PAIRING_SCOPE as r,
  isOperatorScope as s,
  ADMIN_SCOPE as t,
};
