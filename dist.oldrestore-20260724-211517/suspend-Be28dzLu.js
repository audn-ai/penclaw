import { r as getActiveCronJobCount } from "./active-jobs-DCucn-SJ.js";
import { r as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BfylSyKt.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import {
  i as resumeGatewaySuspend,
  n as prepareGatewaySuspend,
  t as getGatewaySuspendStatus,
} from "./gateway-suspend-coordinator-CxQUOyLb.js";
import {
  Ft as validateGatewaySuspendPrepareParams,
  Lt as validateGatewaySuspendResumeParams,
  zt as validateGatewaySuspendStatusParams,
} from "./src-CIJf1lT0.js";
//#region src/gateway/server-active-work.ts
function createGatewayServerActiveWorkInspectors(context) {
  return {
    getCronRuns: () =>
      Math.max(getActiveCronJobCount(), getSuspensionVisibleCronTaskRunCount()) +
      (context.cron.getSuspensionBlockerCount?.() ?? 0),
    getChatRuns: () =>
      Array.from(context.chatAbortControllers.values()).filter(
        (entry) => !entry.controller.signal.aborted && entry.registrationCleanupRequested !== true,
      ).length,
    getQueuedTurns: () =>
      Array.from(context.chatQueuedTurns.values()).filter(
        (entry) => !entry.controller.signal.aborted,
      ).length,
    getTerminalPersistence: () =>
      Array.from(context.chatAbortControllers.values()).filter(
        (entry) =>
          entry.controlUiVisible !== false &&
          entry.projectSessionTerminalPersisted !== true &&
          (entry.projectSessionTerminalPending === true ||
            entry.projectSessionTerminalPersistence !== void 0),
      ).length,
    getTerminalSessions: () => context.terminalSessions?.size ?? 0,
  };
}
//#endregion
//#region src/gateway/server-methods/suspend.ts
function invalidParams(method) {
  return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params`);
}
function schedulerRecoveryError(retryAfterMs) {
  return errorShape(ErrorCodes.UNAVAILABLE, "gateway scheduler recovery is pending", {
    retryable: true,
    retryAfterMs,
    details: { reason: "scheduler-resume-failed" },
  });
}
const suspendHandlers = {
  "gateway.suspend.prepare": async ({ respond, params, context }) => {
    if (!validateGatewaySuspendPrepareParams(params)) {
      respond(false, void 0, invalidParams("gateway.suspend.prepare"));
      return;
    }
    const result = prepareGatewaySuspend({
      requestId: params.requestId.trim(),
      pauseScheduling: () => context.cron.pauseScheduling(),
      resumeScheduling: () => context.cron.resumeScheduling(),
      inspect: createGatewayServerActiveWorkInspectors(context),
      warn: (message) => context.logGateway.warn(message),
    });
    if (result.status === "conflict") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, "another gateway suspension is already prepared", {
          retryable: true,
          retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
          details: {
            reason: "gateway-suspension-conflict",
            expiresAtMs: result.expiresAtMs,
          },
        }),
      );
      return;
    }
    if (result.status === "recovering") {
      respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
      return;
    }
    respond(true, result);
  },
  "gateway.suspend.status": async ({ respond, params }) => {
    if (!validateGatewaySuspendStatusParams(params)) {
      respond(false, void 0, invalidParams("gateway.suspend.status"));
      return;
    }
    const result = getGatewaySuspendStatus(params.suspensionId.trim());
    if (result.status === "conflict") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, "a different gateway suspension is prepared", {
          retryable: true,
          retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
          details: {
            reason: "gateway-suspension-conflict",
            expiresAtMs: result.expiresAtMs,
          },
        }),
      );
      return;
    }
    if (result.status === "recovering") {
      respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
      return;
    }
    respond(true, result);
  },
  "gateway.suspend.resume": async ({ respond, params }) => {
    if (!validateGatewaySuspendResumeParams(params)) {
      respond(false, void 0, invalidParams("gateway.suspend.resume"));
      return;
    }
    const result = resumeGatewaySuspend(params.suspensionId.trim());
    if (!result.ok) {
      if (result.reason === "scheduler-resume-failed") {
        respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
        return;
      }
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "gateway suspension id does not match"),
      );
      return;
    }
    respond(true, result);
  },
};
//#endregion
export { suspendHandlers };
