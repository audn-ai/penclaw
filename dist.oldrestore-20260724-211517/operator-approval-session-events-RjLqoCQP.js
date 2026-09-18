import { n as resolveApprovalSourceStreamKey } from "./approval-session-audience-DOuwEISq.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { t as canAccessOperatorApproval } from "./operator-approval-authorization-D6fQvi72.js";
import {
  c as listPendingOperatorApprovals,
  r as expireDueOperatorApprovals,
} from "./operator-approval-store-huri_FO0.js";
//#region src/gateway/operator-approval-snapshot.ts
/** Project one durable row into the reviewer-safe public approval shape. */
function projectOperatorApprovalSnapshot(record, controlUiBasePath) {
  const common = {
    id: record.id,
    status: record.status,
    presentation: record.presentation,
    urlPath: `${controlUiBasePath}/approve/${encodeURIComponent(record.id)}`,
    createdAtMs: record.createdAtMs,
    expiresAtMs: record.expiresAtMs,
  };
  if (record.status === "pending") return common;
  if (record.resolvedAtMs === null || record.terminalReason === null) return null;
  const terminal = {
    ...common,
    resolvedAtMs: record.resolvedAtMs,
    reason: record.terminalReason,
  };
  if (record.status === "allowed") {
    if (record.decision !== "allow-once" && record.decision !== "allow-always") return null;
    return {
      ...terminal,
      decision: record.decision,
    };
  }
  if (record.status === "denied")
    return {
      ...terminal,
      decision: "deny",
    };
  return terminal;
}
//#endregion
//#region src/gateway/operator-approval-session-events.ts
const MAX_SESSION_APPROVAL_REPLAY = 1e3;
/** Project durable approval truth to exact, explicitly opted-in session audiences. */
function createOperatorApprovalSessionEventRuntime(params) {
  const controlUiBasePath = normalizeControlUiBasePath(params.controlUiBasePath);
  const now = params.now ?? Date.now;
  const canAccessRecord = (client, record) =>
    canAccessOperatorApproval({
      client,
      binding: { reviewerDeviceIds: record.reviewerDeviceIds },
    });
  const authorizedRecipients = (sessionKey, record) => {
    const subscribed = params.sessionMessageSubscribers.getApprovals(sessionKey);
    if (subscribed.size === 0) return subscribed;
    const recipients = /* @__PURE__ */ new Set();
    for (const client of params.clients) {
      const connId = client.connId;
      if (
        !client.invalidated &&
        connId &&
        subscribed.has(connId) &&
        canAccessRecord(client, record)
      )
        recipients.add(connId);
    }
    return recipients;
  };
  const publish = (event) => {
    const approval = projectOperatorApprovalSnapshot(event.record, controlUiBasePath);
    if (!approval || event.record.audienceSessionKeys.length === 0) return;
    const sourceStreamKey =
      event.record.audienceSessionKeys[0] ??
      (event.record.source.sessionKey
        ? resolveApprovalSourceStreamKey(
            event.record.source.sessionKey,
            event.record.source.agentId,
          )
        : null);
    for (const sessionKey of event.record.audienceSessionKeys) {
      const recipients = authorizedRecipients(sessionKey, event.record);
      if (recipients.size === 0) continue;
      const common = {
        sessionKey,
        ...(sourceStreamKey ? { sourceSessionKey: sourceStreamKey } : {}),
        updatedAtMs: event.record.updatedAtMs,
      };
      let payload;
      if (event.phase === "pending") {
        if (approval.status !== "pending") continue;
        payload = {
          ...common,
          phase: "pending",
          approval,
        };
      } else {
        if (approval.status === "pending") continue;
        payload = {
          ...common,
          phase: "terminal",
          approval,
        };
      }
      params.broadcastToConnIds("session.approval", payload, recipients);
    }
  };
  return {
    publish,
    replay: (sessionKey, client) => {
      const snapshotAtMs = now();
      const expired = expireDueOperatorApprovals({
        nowMs: snapshotAtMs,
        databaseOptions: params.databaseOptions,
      });
      for (const record of expired.records)
        if (params.reconcileTerminal?.(record) !== true)
          publish({
            phase: "terminal",
            record,
          });
      const approvals = [];
      const records = listPendingOperatorApprovals({
        audienceSessionKey: sessionKey,
        recordFilter: (record) => canAccessRecord(client, record),
        limit: 1001,
        nowMs: snapshotAtMs,
        databaseOptions: params.databaseOptions,
      });
      const truncated = records.length > MAX_SESSION_APPROVAL_REPLAY;
      for (const record of records) {
        if (approvals.length === MAX_SESSION_APPROVAL_REPLAY)
          return {
            sessionKey,
            updatedAtMs: snapshotAtMs,
            approvals,
            truncated: true,
          };
        const approval = projectOperatorApprovalSnapshot(record, controlUiBasePath);
        if (approval?.status === "pending") approvals.push(approval);
      }
      return {
        sessionKey,
        updatedAtMs: snapshotAtMs,
        approvals,
        truncated,
      };
    },
  };
}
//#endregion
export { createOperatorApprovalSessionEventRuntime };
