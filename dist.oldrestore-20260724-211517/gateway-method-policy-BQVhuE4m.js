//#region src/shared/gateway-method-policy.ts
const RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES = ["exec.approvals.", "config.", "wizard.", "update."];
const RESERVED_ADMIN_GATEWAY_METHOD_SCOPE = "operator.admin";
/** Return whether a gateway method is reserved for operator admin calls. */
function isReservedAdminGatewayMethod(method) {
  return RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix));
}
/** Resolve the mandatory scope for reserved gateway methods. */
function resolveReservedGatewayMethodScope(method) {
  if (!isReservedAdminGatewayMethod(method)) return;
  return RESERVED_ADMIN_GATEWAY_METHOD_SCOPE;
}
/** Coerce plugin-declared scopes away from unsafe reserved gateway method scopes. */
function normalizePluginGatewayMethodScope(method, scope) {
  const reservedScope = resolveReservedGatewayMethodScope(method);
  if (!reservedScope || !scope || scope === reservedScope)
    return {
      scope,
      coercedToReservedAdmin: false,
    };
  return {
    scope: reservedScope,
    coercedToReservedAdmin: true,
  };
}
//#endregion
export { resolveReservedGatewayMethodScope as n, normalizePluginGatewayMethodScope as t };
