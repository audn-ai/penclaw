import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { c as emitTrustedSecurityEvent } from "./diagnostic-events-5-gsFhkM.js";
//#region src/gateway/server-methods/device-management-authz.ts
function resolveDeviceSessionAuthz(client) {
  const callerScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
  const rawCallerDeviceId = client?.connect?.device?.id;
  return {
    callerDeviceId:
      client?.isDeviceTokenAuth && typeof rawCallerDeviceId === "string" && rawCallerDeviceId.trim()
        ? rawCallerDeviceId.trim()
        : null,
    callerScopes,
    isAdminCaller: callerScopes.includes("operator.admin"),
  };
}
function resolveDeviceManagementAuthz(client, targetDeviceId) {
  return {
    ...resolveDeviceSessionAuthz(client),
    normalizedTargetDeviceId: targetDeviceId.trim(),
  };
}
function deniesCrossDeviceManagement(authz) {
  return Boolean(
    authz.callerDeviceId &&
    authz.callerDeviceId !== authz.normalizedTargetDeviceId &&
    !authz.isAdminCaller,
  );
}
function deniesDeviceTokenRoleManagement(authz, targetRole) {
  const normalizedTargetRole = targetRole.trim();
  if (!normalizedTargetRole || authz.isAdminCaller) return false;
  return normalizedTargetRole !== "operator";
}
function hasNonOperatorDeviceRole(input) {
  const roles = /* @__PURE__ */ new Set();
  const role = input.role?.trim();
  if (role) roles.add(role);
  for (const entry of input.roles ?? []) {
    const normalized = entry.trim();
    if (normalized) roles.add(normalized);
  }
  return [...roles].some((entry) => entry !== "operator");
}
function hasNonOperatorDeviceTokenRole(tokens) {
  for (const token of Object.values(tokens ?? {})) {
    const normalized = token.role.trim();
    if (normalized && normalized !== "operator") return true;
  }
  return false;
}
function requestsNonOperatorDeviceRole(pending) {
  return hasNonOperatorDeviceRole(pending);
}
function pairedDeviceHasNonOperatorRole(device) {
  return hasNonOperatorDeviceRole(device) || hasNonOperatorDeviceTokenRole(device.tokens);
}
//#endregion
//#region src/gateway/server-methods/device-management-security.ts
function hashDeviceSecurityId(value) {
  const normalized = value?.trim();
  if (!normalized) return;
  return `sha256:${sha256HexPrefix(normalized, 12)}`;
}
function emitDeviceManagementSecurityEvent(params) {
  emitTrustedSecurityEvent({
    category: "auth",
    action: params.action,
    outcome: params.outcome,
    severity: params.severity,
    actor: {
      kind: "operator",
      ...(params.authz.callerDeviceId
        ? { deviceIdHash: hashDeviceSecurityId(params.authz.callerDeviceId) }
        : {}),
      role: params.authz.isAdminCaller ? "admin" : "operator",
    },
    target: {
      kind: "device",
      ...(params.targetDeviceId ? { idHash: hashDeviceSecurityId(params.targetDeviceId) } : {}),
    },
    policy: {
      id: params.policyId,
      decision: params.decision,
      ...(params.reason ? { reason: params.reason } : {}),
    },
    control: {
      id: params.controlId,
      family: "auth",
    },
    ...(params.reason ? { reason: params.reason } : {}),
    ...(params.attributes ? { attributes: params.attributes } : {}),
  });
}
//#endregion
export {
  requestsNonOperatorDeviceRole as a,
  pairedDeviceHasNonOperatorRole as i,
  deniesCrossDeviceManagement as n,
  resolveDeviceManagementAuthz as o,
  deniesDeviceTokenRoleManagement as r,
  resolveDeviceSessionAuthz as s,
  emitDeviceManagementSecurityEvent as t,
};
