import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-Bhl62moH.js";
import { i as getActiveGatewayRootWorkCount } from "./gateway-work-admission-yGjmBAjy.js";
import { m as scheduleGatewaySigusr1Restart } from "./restart-DuVWNzPR.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./src-CIJf1lT0.js";
//#region src/infra/restart-coordinator.ts
function createSafeGatewayRestartPreflight(inspectors = {}) {
  const snapshot = createGatewayActiveWorkSnapshot({
    ...inspectors,
    getRootRequests:
      inspectors.getRootRequests ?? (() => getActiveGatewayRootWorkCount({ excludeCurrent: true })),
    getSessionAdmissions: () => 0,
    getSessionMutations: () => 0,
    getChatRuns: () => 0,
    getQueuedTurns: () => 0,
    getTerminalPersistence: () => 0,
    getTerminalSessions: () => 0,
  });
  const counts = {
    queueSize: snapshot.counts.queueSize,
    pendingReplies: snapshot.counts.pendingReplies,
    embeddedRuns: snapshot.counts.embeddedRuns,
    cronRuns: snapshot.counts.cronRuns,
    backgroundExecSessions: snapshot.counts.backgroundExecSessions,
    rootRequests: snapshot.counts.rootRequests,
    activeTasks: snapshot.counts.activeTasks,
    totalActive:
      snapshot.counts.queueSize +
      snapshot.counts.pendingReplies +
      snapshot.counts.embeddedRuns +
      snapshot.counts.cronRuns +
      snapshot.counts.backgroundExecSessions +
      snapshot.counts.rootRequests +
      snapshot.counts.activeTasks,
  };
  const blockers = snapshot.blockers;
  const summary =
    blockers.length === 0
      ? "safe to restart now"
      : `restart deferred: ${blockers.map((blocker) => blocker.message).join("; ")}`;
  return {
    safe: counts.totalActive === 0,
    counts,
    blockers,
    summary,
  };
}
/** Schedule a gateway restart after collecting tracked active-work blockers. */
function requestSafeGatewayRestart(opts = {}) {
  const preflight = createSafeGatewayRestartPreflight(opts.inspect);
  const skipDeferral = opts.skipDeferral === true;
  const restart = scheduleGatewaySigusr1Restart({
    delayMs: opts.delayMs ?? 0,
    reason: opts.reason ?? "gateway.restart.safe",
    ...(opts.preservePendingEmitHooks === true || skipDeferral
      ? { preservePendingEmitHooksOnDeferralBypass: true }
      : {}),
    ...(skipDeferral ? { skipDeferral: true } : {}),
  });
  return {
    ok: true,
    status: restart.coalesced
      ? "coalesced"
      : skipDeferral || preflight.safe
        ? "scheduled"
        : "deferred",
    preflight,
    restart,
  };
}
//#endregion
//#region src/gateway/server-methods/restart.ts
function isRestartRequestParams(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeReason(value) {
  return typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), 200) : void 0;
}
function normalizeSkipDeferral(value) {
  return value === true;
}
/** Gateway request handlers for safe restart coordination. */
const restartHandlers = {
  "gateway.restart.request": async ({ respond, params }) => {
    if (!isRestartRequestParams(params)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid gateway.restart.request params"),
      );
      return;
    }
    respond(
      true,
      requestSafeGatewayRestart({
        reason: normalizeReason(params.reason),
        delayMs: 0,
        skipDeferral: normalizeSkipDeferral(params.skipDeferral),
      }),
    );
  },
  "gateway.restart.preflight": async ({ respond }) => {
    respond(true, createSafeGatewayRestartPreflight());
  },
};
//#endregion
export { restartHandlers };
