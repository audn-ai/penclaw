import {
  a as requestsNonOperatorDeviceRole,
  i as pairedDeviceHasNonOperatorRole,
  n as deniesCrossDeviceManagement,
  o as resolveDeviceManagementAuthz,
  r as deniesDeviceTokenRoleManagement,
  s as resolveDeviceSessionAuthz,
  t as emitDeviceManagementSecurityEvent,
} from "./device-management-security-BjNfdYJm.js";
import {
  _ as rotateDeviceToken,
  a as getPairedDevice,
  f as rejectDevicePairing,
  g as revokeDeviceToken,
  i as formatDevicePairingForbiddenMessage,
  l as listDevicePairing,
  n as approveDevicePairing,
  o as getPendingDevicePairing,
  p as removePairedDevice,
  v as summarizeDeviceTokens,
  y as updatePairedDeviceMetadata,
} from "./device-pairing-BIH9-x3P.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import {
  _t as validateDeviceTokenRotateParams,
  dt as validateDevicePairListParams,
  ft as validateDevicePairRejectParams,
  gt as validateDeviceTokenRevokeParams,
  mt as validateDevicePairRenameParams,
  pt as validateDevicePairRemoveParams,
  ut as validateDevicePairApproveParams,
} from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/devices.ts
const DEVICE_TOKEN_ROTATION_DENIED_MESSAGE = "device token rotation denied";
const DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE = "device token revocation denied";
const DEVICE_PAIR_APPROVAL_DENIED_MESSAGE = "device pairing approval denied";
const DEVICE_PAIR_REJECTION_DENIED_MESSAGE = "device pairing rejection denied";
function redactPairedDevice(device, opts) {
  const { tokens, approvedScopes: _approvedScopes, ...rest } = device;
  return {
    ...rest,
    ...(opts?.connected !== void 0 ? { connected: opts.connected } : {}),
    tokens: summarizeDeviceTokens(tokens),
  };
}
function logDeviceTokenRotationDenied(params) {
  const suffix = params.scope ? ` scope=${params.scope}` : "";
  params.log.warn(
    `device token rotation denied device=${params.deviceId} role=${params.role} reason=${params.reason}${suffix}`,
  );
}
function logDeviceTokenRevocationDenied(params) {
  const suffix = params.scope ? ` scope=${params.scope}` : "";
  params.log.warn(
    `device token revocation denied device=${params.deviceId} role=${params.role} reason=${params.reason}${suffix}`,
  );
}
function shouldReturnRotatedDeviceToken(authz) {
  return Boolean(authz.callerDeviceId && authz.callerDeviceId === authz.normalizedTargetDeviceId);
}
function emitDeviceSecurityEvent(params) {
  emitDeviceManagementSecurityEvent(params);
}
function emitDevicePairingDeniedSecurityEvent(params) {
  emitDeviceSecurityEvent({
    action: "device.pairing.denied",
    outcome: "denied",
    severity: params.severity ?? "medium",
    authz: params.authz,
    targetDeviceId: params.targetDeviceId,
    policyId: "gateway.device-pairing",
    decision: "deny",
    controlId: params.controlId,
    reason: params.reason,
  });
}
function emitDevicePairingLifecycleSecurityEvent(params) {
  emitDeviceSecurityEvent({
    action: params.action,
    outcome: "success",
    severity: params.severity,
    authz: params.authz,
    targetDeviceId: params.targetDeviceId,
    policyId: "gateway.device-pairing",
    decision: "allow",
    controlId: params.controlId,
    attributes: params.attributes,
  });
}
function emitDeviceTokenDeniedSecurityEvent(params) {
  emitDeviceSecurityEvent({
    action: params.action,
    outcome: "denied",
    severity: "medium",
    authz: params.authz,
    targetDeviceId: params.targetDeviceId,
    policyId: "gateway.device-token",
    decision: "deny",
    controlId: params.controlId,
    reason: params.reason,
    attributes: { role: params.role.trim() },
  });
}
function emitDeviceTokenLifecycleSecurityEvent(params) {
  emitDeviceSecurityEvent({
    action: params.action,
    outcome: "success",
    severity: params.severity,
    authz: params.authz,
    targetDeviceId: params.targetDeviceId,
    policyId: "gateway.device-token",
    decision: "allow",
    controlId: params.controlId,
    attributes: {
      role: params.role,
      ...(params.scopeCount !== void 0 ? { scope_count: params.scopeCount } : {}),
    },
  });
}
/** Gateway request handlers for device pair approval, removal, token rotation, and revocation. */
const deviceHandlers = {
  "device.pair.list": async ({ params, respond, context, client }) => {
    if (!validateDevicePairListParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.pair.list params: ${formatValidationErrors(validateDevicePairListParams.errors)}`,
        ),
      );
      return;
    }
    const list = await listDevicePairing();
    const authz = resolveDeviceSessionAuthz(client);
    const visibleList =
      authz.callerDeviceId && !authz.isAdminCaller
        ? {
            pending: list.pending.filter(
              (request) => request.deviceId.trim() === authz.callerDeviceId,
            ),
            paired: list.paired.filter((device) => device.deviceId.trim() === authz.callerDeviceId),
          }
        : list;
    respond(
      true,
      {
        pending: visibleList.pending,
        paired: visibleList.paired.map((device) =>
          redactPairedDevice(device, {
            connected: context.hasConnectedClientsForDevice?.(device.deviceId.trim()) ?? false,
          }),
        ),
      },
      void 0,
    );
  },
  "device.pair.approve": async ({ params, respond, context, client }) => {
    if (!validateDevicePairApproveParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.pair.approve params: ${formatValidationErrors(validateDevicePairApproveParams.errors)}`,
        ),
      );
      return;
    }
    const { requestId } = params;
    const authz = resolveDeviceSessionAuthz(client);
    if (!authz.isAdminCaller) {
      const pending = await getPendingDevicePairing(requestId);
      if (!pending) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE),
        );
        return;
      }
      if (authz.callerDeviceId && pending.deviceId.trim() !== authz.callerDeviceId) {
        context.logGateway.warn(
          `device pairing approval denied request=${requestId} reason=device-ownership-mismatch`,
        );
        emitDevicePairingDeniedSecurityEvent({
          authz,
          targetDeviceId: pending.deviceId,
          controlId: "device.pair.approve",
          reason: "device-ownership-mismatch",
        });
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE),
        );
        return;
      }
      if (requestsNonOperatorDeviceRole(pending)) {
        context.logGateway.warn(
          `device pairing approval denied request=${requestId} reason=role-management-requires-admin`,
        );
        emitDevicePairingDeniedSecurityEvent({
          authz,
          targetDeviceId: pending.deviceId,
          controlId: "device.pair.approve",
          reason: "role-management-requires-admin",
        });
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE),
        );
        return;
      }
    }
    const approved = await approveDevicePairing(requestId, { callerScopes: authz.callerScopes });
    if (!approved) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
      return;
    }
    if (approved.status === "forbidden") {
      emitDevicePairingDeniedSecurityEvent({
        authz,
        controlId: "device.pair.approve",
        reason: approved.reason,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, formatDevicePairingForbiddenMessage(approved)),
      );
      return;
    }
    context.logGateway.info(
      `device pairing approved device=${approved.device.deviceId} role=${approved.device.role ?? "unknown"}`,
    );
    emitDevicePairingLifecycleSecurityEvent({
      action: "device.pairing.approved",
      severity: "low",
      authz,
      targetDeviceId: approved.device.deviceId,
      controlId: "device.pair.approve",
      attributes: {
        role_count: approved.device.roles?.length ?? (approved.device.role ? 1 : 0),
        scope_count: approved.device.approvedScopes?.length ?? approved.device.scopes?.length ?? 0,
      },
    });
    context.broadcast(
      "device.pair.resolved",
      {
        requestId,
        deviceId: approved.device.deviceId,
        decision: "approved",
        ts: Date.now(),
      },
      { dropIfSlow: true },
    );
    respond(
      true,
      {
        requestId,
        device: redactPairedDevice(approved.device),
      },
      void 0,
    );
  },
  "device.pair.reject": async ({ params, respond, context, client }) => {
    if (!validateDevicePairRejectParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.pair.reject params: ${formatValidationErrors(validateDevicePairRejectParams.errors)}`,
        ),
      );
      return;
    }
    const { requestId } = params;
    const authz = resolveDeviceSessionAuthz(client);
    if (authz.callerDeviceId && !authz.isAdminCaller) {
      const pending = await getPendingDevicePairing(requestId);
      if (!pending) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE),
        );
        return;
      }
      if (pending.deviceId.trim() !== authz.callerDeviceId) {
        context.logGateway.warn(
          `device pairing rejection denied request=${requestId} reason=device-ownership-mismatch`,
        );
        emitDevicePairingDeniedSecurityEvent({
          authz,
          targetDeviceId: pending.deviceId,
          controlId: "device.pair.reject",
          reason: "device-ownership-mismatch",
        });
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE),
        );
        return;
      }
    }
    const rejected = await rejectDevicePairing(requestId);
    if (!rejected) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
      return;
    }
    emitDevicePairingLifecycleSecurityEvent({
      action: "device.pairing.rejected",
      authz,
      targetDeviceId: rejected.deviceId,
      controlId: "device.pair.reject",
      severity: "low",
    });
    context.broadcast(
      "device.pair.resolved",
      {
        requestId,
        deviceId: rejected.deviceId,
        decision: "rejected",
        ts: Date.now(),
      },
      { dropIfSlow: true },
    );
    respond(true, rejected, void 0);
  },
  "device.pair.remove": async ({ params, respond, context, client }) => {
    if (!validateDevicePairRemoveParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.pair.remove params: ${formatValidationErrors(validateDevicePairRemoveParams.errors)}`,
        ),
      );
      return;
    }
    const { deviceId } = params;
    const authz = resolveDeviceManagementAuthz(client, deviceId);
    if (deniesCrossDeviceManagement(authz)) {
      context.logGateway.warn(
        `device pairing removal denied device=${deviceId} reason=device-ownership-mismatch`,
      );
      emitDevicePairingDeniedSecurityEvent({
        authz,
        targetDeviceId: deviceId,
        controlId: "device.pair.remove",
        reason: "device-ownership-mismatch",
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "device pairing removal denied"),
      );
      return;
    }
    if (authz.callerDeviceId && !authz.isAdminCaller) {
      const paired = await getPairedDevice(authz.normalizedTargetDeviceId);
      if (paired && pairedDeviceHasNonOperatorRole(paired)) {
        context.logGateway.warn(
          `device pairing removal denied device=${deviceId} reason=role-management-requires-admin`,
        );
        emitDevicePairingDeniedSecurityEvent({
          authz,
          targetDeviceId: deviceId,
          controlId: "device.pair.remove",
          reason: "role-management-requires-admin",
        });
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "device pairing removal denied"),
        );
        return;
      }
    }
    const removed = await removePairedDevice(deviceId);
    if (!removed) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown deviceId"));
      return;
    }
    context.logGateway.info(`device pairing removed device=${removed.deviceId}`);
    emitDevicePairingLifecycleSecurityEvent({
      action: "device.pairing.removed",
      severity: "medium",
      authz,
      targetDeviceId: removed.deviceId,
      controlId: "device.pair.remove",
    });
    context.invalidateClientsForDevice?.(removed.deviceId, { reason: "device-pair-removed" });
    respond(true, removed, void 0);
    queueMicrotask(() => {
      context.disconnectClientsForDevice?.(removed.deviceId);
    });
  },
  "device.pair.rename": async ({ params, respond, context, client }) => {
    if (!validateDevicePairRenameParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.pair.rename params: ${formatValidationErrors(validateDevicePairRenameParams.errors)}`,
        ),
      );
      return;
    }
    const { deviceId, label } = params;
    const trimmed = label.trim();
    if (!trimmed) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "label required"));
      return;
    }
    const authz = resolveDeviceManagementAuthz(client, deviceId);
    if (deniesCrossDeviceManagement(authz)) {
      context.logGateway.warn(
        `device pairing rename denied device=${deviceId} reason=device-ownership-mismatch`,
      );
      emitDevicePairingDeniedSecurityEvent({
        authz,
        targetDeviceId: deviceId,
        controlId: "device.pair.rename",
        reason: "device-ownership-mismatch",
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "device pairing rename denied"),
      );
      return;
    }
    if (authz.callerDeviceId && !authz.isAdminCaller) {
      const paired = await getPairedDevice(authz.normalizedTargetDeviceId);
      if (paired && pairedDeviceHasNonOperatorRole(paired)) {
        context.logGateway.warn(
          `device pairing rename denied device=${deviceId} reason=role-management-requires-admin`,
        );
        emitDevicePairingDeniedSecurityEvent({
          authz,
          targetDeviceId: deviceId,
          controlId: "device.pair.rename",
          reason: "role-management-requires-admin",
        });
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "device pairing rename denied"),
        );
        return;
      }
    }
    if (!(await updatePairedDeviceMetadata(deviceId, { operatorLabel: trimmed }))) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown deviceId"));
      return;
    }
    context.logGateway.info(`device pairing renamed device=${deviceId} label=${trimmed}`);
    emitDevicePairingLifecycleSecurityEvent({
      action: "device.pairing.renamed",
      severity: "low",
      authz,
      targetDeviceId: deviceId,
      controlId: "device.pair.rename",
    });
    respond(
      true,
      {
        deviceId,
        label: trimmed,
      },
      void 0,
    );
  },
  "device.token.rotate": async ({ params, respond, context, client }) => {
    if (!validateDeviceTokenRotateParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.token.rotate params: ${formatValidationErrors(validateDeviceTokenRotateParams.errors)}`,
        ),
      );
      return;
    }
    const { deviceId, role, scopes } = params;
    const authz = resolveDeviceManagementAuthz(client, deviceId);
    if (deniesCrossDeviceManagement(authz)) {
      logDeviceTokenRotationDenied({
        log: context.logGateway,
        deviceId,
        role,
        reason: "device-ownership-mismatch",
      });
      emitDeviceTokenDeniedSecurityEvent({
        action: "device.token.rotation_denied",
        authz,
        targetDeviceId: deviceId,
        controlId: "device.token.rotate",
        reason: "device-ownership-mismatch",
        role,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_ROTATION_DENIED_MESSAGE),
      );
      return;
    }
    if (deniesDeviceTokenRoleManagement(authz, role)) {
      logDeviceTokenRotationDenied({
        log: context.logGateway,
        deviceId,
        role,
        reason: "role-management-requires-admin",
      });
      emitDeviceTokenDeniedSecurityEvent({
        action: "device.token.rotation_denied",
        authz,
        targetDeviceId: deviceId,
        controlId: "device.token.rotate",
        reason: "role-management-requires-admin",
        role,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_ROTATION_DENIED_MESSAGE),
      );
      return;
    }
    const rotated = await rotateDeviceToken({
      deviceId,
      role,
      scopes,
      callerScopes: authz.callerScopes,
    });
    if (!rotated.ok) {
      logDeviceTokenRotationDenied({
        log: context.logGateway,
        deviceId,
        role,
        reason: rotated.reason,
        scope: rotated.scope,
      });
      emitDeviceTokenDeniedSecurityEvent({
        action: "device.token.rotation_denied",
        authz,
        targetDeviceId: deviceId,
        controlId: "device.token.rotate",
        reason: rotated.reason,
        role,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_ROTATION_DENIED_MESSAGE),
      );
      return;
    }
    const entry = rotated.entry;
    context.logGateway.info(
      `device token rotated device=${deviceId} role=${entry.role} scopes=${entry.scopes.join(",")}`,
    );
    emitDeviceTokenLifecycleSecurityEvent({
      action: "device.token.rotated",
      severity: "medium",
      authz,
      targetDeviceId: deviceId,
      controlId: "device.token.rotate",
      role: entry.role,
      scopeCount: entry.scopes.length,
    });
    context.invalidateClientsForDevice?.(deviceId.trim(), {
      role: entry.role,
      reason: "device-token-rotated",
    });
    respond(
      true,
      {
        deviceId,
        role: entry.role,
        ...(shouldReturnRotatedDeviceToken(authz) ? { token: entry.token } : {}),
        scopes: entry.scopes,
        rotatedAtMs: entry.rotatedAtMs ?? entry.createdAtMs,
      },
      void 0,
    );
    queueMicrotask(() => {
      context.disconnectClientsForDevice?.(deviceId.trim(), { role: entry.role });
    });
  },
  "device.token.revoke": async ({ params, respond, context, client }) => {
    if (!validateDeviceTokenRevokeParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid device.token.revoke params: ${formatValidationErrors(validateDeviceTokenRevokeParams.errors)}`,
        ),
      );
      return;
    }
    const { deviceId, role } = params;
    const authz = resolveDeviceManagementAuthz(client, deviceId);
    if (deniesCrossDeviceManagement(authz)) {
      context.logGateway.warn(
        `device token revocation denied device=${deviceId} role=${role} reason=device-ownership-mismatch`,
      );
      emitDeviceTokenDeniedSecurityEvent({
        action: "device.token.revocation_denied",
        authz,
        targetDeviceId: deviceId,
        controlId: "device.token.revoke",
        reason: "device-ownership-mismatch",
        role,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE),
      );
      return;
    }
    if (deniesDeviceTokenRoleManagement(authz, role)) {
      logDeviceTokenRevocationDenied({
        log: context.logGateway,
        deviceId,
        role,
        reason: "role-management-requires-admin",
      });
      emitDeviceTokenDeniedSecurityEvent({
        action: "device.token.revocation_denied",
        authz,
        targetDeviceId: deviceId,
        controlId: "device.token.revoke",
        reason: "role-management-requires-admin",
        role,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE),
      );
      return;
    }
    const revoked = await revokeDeviceToken({
      deviceId,
      role,
      callerScopes: authz.callerScopes,
    });
    if (!revoked.ok) {
      logDeviceTokenRevocationDenied({
        log: context.logGateway,
        deviceId,
        role,
        reason: revoked.reason,
        scope: revoked.scope,
      });
      emitDeviceTokenDeniedSecurityEvent({
        action: "device.token.revocation_denied",
        authz,
        targetDeviceId: deviceId,
        controlId: "device.token.revoke",
        reason: revoked.reason,
        role,
      });
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE),
      );
      return;
    }
    const entry = revoked.entry;
    const normalizedDeviceId = deviceId.trim();
    context.logGateway.info(`device token revoked device=${normalizedDeviceId} role=${entry.role}`);
    emitDeviceTokenLifecycleSecurityEvent({
      action: "device.token.revoked",
      severity: "high",
      authz,
      targetDeviceId: normalizedDeviceId,
      controlId: "device.token.revoke",
      role: entry.role,
    });
    context.invalidateClientsForDevice?.(normalizedDeviceId, {
      role: entry.role,
      reason: "device-token-revoked",
    });
    respond(
      true,
      {
        deviceId: normalizedDeviceId,
        role: entry.role,
        revokedAtMs: entry.revokedAtMs ?? Date.now(),
      },
      void 0,
    );
    queueMicrotask(() => {
      context.disconnectClientsForDevice?.(normalizedDeviceId, { role: entry.role });
    });
  },
};
//#endregion
export { deviceHandlers };
