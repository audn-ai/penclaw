//#region src/shared/operator-scope-compat.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const OPERATOR_READ_SCOPE = "operator.read";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_SCOPE_PREFIX = "operator.";
function normalizeScopeList(scopes) {
  const out = /* @__PURE__ */ new Set();
  for (const scope of scopes) {
    const trimmed = scope.trim();
    if (trimmed) out.add(trimmed);
  }
  return [...out];
}
function operatorScopeSatisfied(requestedScope, granted) {
  if (!requestedScope.startsWith(OPERATOR_SCOPE_PREFIX)) return false;
  if (granted.has(OPERATOR_ADMIN_SCOPE)) return true;
  if (requestedScope === OPERATOR_READ_SCOPE)
    return granted.has(OPERATOR_READ_SCOPE) || granted.has(OPERATOR_WRITE_SCOPE);
  if (requestedScope === OPERATOR_WRITE_SCOPE) return granted.has(OPERATOR_WRITE_SCOPE);
  return granted.has(requestedScope);
}
/** Returns true when a role grant satisfies requested scopes, including operator implications. */
function roleScopesAllow(params) {
  const requested = normalizeScopeList(params.requestedScopes);
  if (requested.length === 0) return true;
  const allowed = normalizeScopeList(params.allowedScopes);
  if (allowed.length === 0) return false;
  const allowedSet = new Set(allowed);
  if (params.role.trim() !== OPERATOR_ROLE) {
    const prefix = `${params.role.trim()}.`;
    return requested.every((scope) => scope.startsWith(prefix) && allowedSet.has(scope));
  }
  return requested.every((scope) => operatorScopeSatisfied(scope, allowedSet));
}
/** Returns the first requested scope not covered by the role's allowed scopes. */
function resolveMissingRequestedScope(params) {
  for (const scope of params.requestedScopes)
    if (
      !roleScopesAllow({
        role: params.role,
        requestedScopes: [scope],
        allowedScopes: params.allowedScopes,
      })
    )
      return scope;
  return null;
}
/** Returns the first requested scope that does not belong to any requested role. */
function resolveScopeOutsideRequestedRoles(params) {
  for (const scope of params.requestedScopes)
    if (
      !params.requestedRoles.some((role) =>
        roleScopesAllow({
          role,
          requestedScopes: [scope],
          allowedScopes: [scope],
        }),
      )
    )
      return scope;
  return null;
}
//#endregion
export {
  resolveScopeOutsideRequestedRoles as n,
  roleScopesAllow as r,
  resolveMissingRequestedScope as t,
};
