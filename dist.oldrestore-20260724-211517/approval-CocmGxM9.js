import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.js";
import { d as resolveApprovalRequestRecipientConnIds } from "./approval-shared-BvKtvXwr.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import {
  n as canResolveOperatorApproval,
  r as canReviewOperatorApproval,
  t as canAccessOperatorApproval,
} from "./operator-approval-authorization-D6fQvi72.js";
import {
  a as getOperatorApprovalDetailed,
  o as getOperatorApprovalDetailedByLocator,
} from "./operator-approval-store-huri_FO0.js";
import {
  g as validateApprovalGetParams,
  y as validateApprovalResolveParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/server-methods/approval.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function buildApprovalSnapshot(record, controlUiBasePath) {
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
function resolveApprovalResolver(client) {
  const deviceId = normalizeOptionalString(client?.connect?.device?.id);
  if (deviceId)
    return {
      kind: "device",
      id: deviceId,
    };
  return {
    kind: "runtime",
    id: normalizeOptionalString(client?.connect?.client?.id) ?? null,
  };
}
function resolveLegacyApprovalLabel(client) {
  return (
    normalizeOptionalString(client?.connect?.client?.displayName) ??
    normalizeOptionalString(client?.connect?.client?.id) ??
    null
  );
}
function respondApprovalNotFound(respond) {
  respond(
    false,
    void 0,
    errorShape(ErrorCodes.INVALID_REQUEST, "approval not found", {
      details: { reason: ErrorCodes.APPROVAL_NOT_FOUND },
    }),
  );
}
function respondApprovalUnavailable(params) {
  params.context.logGateway?.error?.(
    `approval ${params.operation} storage failure: ${String(params.error)}`,
  );
  params.respond(
    false,
    void 0,
    errorShape(ErrorCodes.UNAVAILABLE, `approval ${params.operation} unavailable`),
  );
}
function readExactApprovalId(params) {
  if (!isRecord(params) || typeof params.id !== "string") return null;
  const id = params.id;
  return isWellFormedApprovalId(id) ? id : null;
}
function loadVisibleApproval(params) {
  if (
    !(params.allowApprovalRuntime
      ? canResolveOperatorApproval(params.client)
      : canReviewOperatorApproval(params.client))
  )
    return null;
  const liveRecord =
    params.execApprovalManager.getLiveSnapshot(params.id) ??
    params.pluginApprovalManager.getLiveSnapshot(params.id);
  if (
    liveRecord &&
    !canAccessOperatorApproval({
      client: params.client,
      allowApprovalRuntime: params.allowApprovalRuntime,
      binding: { reviewerDeviceIds: liveRecord.approvalReviewerDeviceIds },
    })
  )
    return null;
  let lookup;
  try {
    lookup = params.allowTransportRef
      ? getOperatorApprovalDetailedByLocator({
          locator: params.id,
          databaseOptions: params.databaseOptions,
        })
      : getOperatorApprovalDetailed({
          id: params.id,
          databaseOptions: params.databaseOptions,
        });
  } catch (error) {
    const corrupt = {
      outcome: "corrupt",
      id: params.id,
    };
    params.execApprovalManager.reconcileDurableLookup(corrupt);
    params.pluginApprovalManager.reconcileDurableLookup(corrupt);
    throw error;
  }
  if (lookup.outcome === "found") {
    if (
      !canAccessOperatorApproval({
        client: params.client,
        allowApprovalRuntime: params.allowApprovalRuntime,
        binding: { reviewerDeviceIds: lookup.record.reviewerDeviceIds },
      })
    )
      return null;
    return (
      lookup.record.kind === "exec" ? params.execApprovalManager : params.pluginApprovalManager
    ).reconcileDurableLookup(lookup);
  }
  const missing = {
    outcome: lookup.outcome === "corrupt" ? "corrupt" : "missing",
    id: lookup.outcome === "corrupt" ? (lookup.id ?? params.id) : params.id,
  };
  params.execApprovalManager.reconcileDurableLookup(missing);
  params.pluginApprovalManager.reconcileDurableLookup(missing);
  return null;
}
function broadcastResolvedEvent(params) {
  const recipientConnIds = resolveApprovalRequestRecipientConnIds({
    context: params.context,
    record: {
      id: params.liveRecord.id,
      request: params.liveRecord.request,
      createdAtMs: params.liveRecord.createdAtMs,
      expiresAtMs: params.liveRecord.expiresAtMs,
      requestedByConnId: params.liveRecord.requestedByConnId,
      requestedByDeviceId: params.liveRecord.requestedByDeviceId,
      requestedByClientId: params.liveRecord.requestedByClientId,
      requestedByDeviceTokenAuth: params.liveRecord.requestedByDeviceTokenAuth,
      approvalReviewerDeviceIds: params.liveRecord.approvalReviewerDeviceIds,
    },
  });
  if (recipientConnIds) {
    params.context.broadcastToConnIds(params.eventName, params.event, recipientConnIds, {
      dropIfSlow: true,
    });
    return;
  }
  params.context.broadcast(params.eventName, params.event, { dropIfSlow: true });
}
async function runResolutionSideEffect(params) {
  try {
    await params.run();
  } catch (error) {
    params.context.logGateway?.error?.(
      `${params.approvalKind} approvals: unified resolve ${params.effect} failed: ${String(error)}`,
    );
  }
}
async function publishAppliedResolution(params) {
  const decision = params.record.decision ?? "deny";
  const resolvedBy = params.liveRecord.resolvedBy ?? null;
  const ts = params.record.resolvedAtMs ?? Date.now();
  if (params.record.kind === "exec") {
    const event = {
      id: params.record.id,
      decision,
      resolvedBy,
      ts,
      request: params.liveRecord.request,
    };
    await runResolutionSideEffect({
      context: params.context,
      approvalKind: "exec",
      effect: "broadcast",
      run: () =>
        broadcastResolvedEvent({
          context: params.context,
          eventName: "exec.approval.resolved",
          event,
          liveRecord: params.liveRecord,
        }),
    });
    if (params.forwarder)
      await runResolutionSideEffect({
        context: params.context,
        approvalKind: "exec",
        effect: "forwarder",
        run: () => params.forwarder.handleResolved(event),
      });
    if (params.iosPushDelivery?.handleResolved)
      await runResolutionSideEffect({
        context: params.context,
        approvalKind: "exec",
        effect: "ios-push",
        run: () => params.iosPushDelivery.handleResolved(event),
      });
    return;
  }
  const event = {
    id: params.record.id,
    decision,
    resolvedBy,
    ts,
    request: params.liveRecord.request,
  };
  await runResolutionSideEffect({
    context: params.context,
    approvalKind: "plugin",
    effect: "broadcast",
    run: () =>
      broadcastResolvedEvent({
        context: params.context,
        eventName: "plugin.approval.resolved",
        event,
        liveRecord: params.liveRecord,
      }),
  });
  if (params.forwarder?.handlePluginApprovalResolved)
    await runResolutionSideEffect({
      context: params.context,
      approvalKind: "plugin",
      effect: "forwarder",
      run: () => params.forwarder.handlePluginApprovalResolved(event),
    });
}
function resolveLiveRecord(params) {
  return params.liveRecord ?? params.manager.getLiveSnapshot(params.id) ?? void 0;
}
function applyForcedDeny(params) {
  const result = params.manager.forceDenyDetailed(
    params.id,
    "malformed-verdict",
    params.resolver,
    "denied",
    void 0,
    false,
    params.localResolvedBy,
  );
  switch (result.outcome) {
    case "denied":
      return {
        ok: true,
        applied: true,
        record: result.record,
        liveRecord: resolveLiveRecord({
          manager: params.manager,
          id: params.id,
          liveRecord: result.liveRecord,
        }),
      };
    case "expired":
    case "already-terminal":
    case "not-due":
      return {
        ok: true,
        applied: false,
        record: result.record,
        liveRecord: result.liveRecord,
      };
    case "not-found":
    case "corrupt":
      return { ok: false };
  }
  return result;
}
function applyApprovalDecision(params) {
  if (params.forceMalformedDeny) return applyForcedDeny(params);
  const result = params.manager.resolveDetailed(
    params.id,
    params.decision,
    params.resolver,
    params.localResolvedBy,
  );
  switch (result.outcome) {
    case "resolved":
      return {
        ok: true,
        applied: true,
        record: result.record,
        liveRecord: resolveLiveRecord({
          manager: params.manager,
          id: params.id,
          liveRecord: result.liveRecord,
        }),
      };
    case "expired":
    case "already-resolved":
      return {
        ok: true,
        applied: false,
        record: result.record,
        liveRecord: result.liveRecord,
      };
    case "decision-not-allowed":
      return applyForcedDeny(params);
    case "not-found":
    case "corrupt":
      return { ok: false };
  }
  return result;
}
/** Creates kind-agnostic approval lookup and resolution handlers. */
function createApprovalHandlers(params) {
  return {
    "approval.get": ({ params: rawParams, respond, client, context }) => {
      if (!validateApprovalGetParams(rawParams)) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.get params"),
        );
        return;
      }
      const id = readExactApprovalId(rawParams);
      let record;
      try {
        record = id
          ? loadVisibleApproval({
              id,
              client,
              execApprovalManager: params.execApprovalManager,
              pluginApprovalManager: params.pluginApprovalManager,
              databaseOptions: params.databaseOptions,
            })
          : null;
      } catch (error) {
        respondApprovalUnavailable({
          context,
          respond,
          operation: "lookup",
          error,
        });
        return;
      }
      const controlUiBasePath = normalizeControlUiBasePath(
        context.getRuntimeConfig()?.gateway?.controlUi?.basePath,
      );
      const approval = record ? buildApprovalSnapshot(record, controlUiBasePath) : null;
      if (!approval) {
        respondApprovalNotFound(respond);
        return;
      }
      respond(true, { approval }, void 0);
    },
    "approval.resolve": async ({ params: rawParams, respond, client, context }) => {
      const id = readExactApprovalId(rawParams);
      let record;
      try {
        record = id
          ? loadVisibleApproval({
              id,
              client,
              allowApprovalRuntime: true,
              allowTransportRef: true,
              execApprovalManager: params.execApprovalManager,
              pluginApprovalManager: params.pluginApprovalManager,
              databaseOptions: params.databaseOptions,
            })
          : null;
      } catch (error) {
        respondApprovalUnavailable({
          context,
          respond,
          operation: "lookup",
          error,
        });
        return;
      }
      if (!id || !record) {
        respondApprovalNotFound(respond);
        return;
      }
      if (record.status !== "pending") {
        const controlUiBasePath = normalizeControlUiBasePath(
          context.getRuntimeConfig()?.gateway?.controlUi?.basePath,
        );
        const approval = buildApprovalSnapshot(record, controlUiBasePath);
        if (!approval || approval.status === "pending") {
          respondApprovalNotFound(respond);
          return;
        }
        respond(
          true,
          {
            applied: false,
            approval,
          },
          void 0,
        );
        return;
      }
      const resolver = resolveApprovalResolver(client);
      const localResolvedBy = resolveLegacyApprovalLabel(client);
      const validParams = validateApprovalResolveParams(rawParams);
      const resolveParams = validParams ? rawParams : null;
      const requestedDecision = resolveParams?.decision ?? null;
      const decisionAllowed =
        requestedDecision === "deny" ||
        (requestedDecision !== null &&
          record.presentation.allowedDecisions.includes(requestedDecision));
      const kindMatches = resolveParams?.kind === record.presentation.kind;
      const forceMalformedDeny = !validParams || !kindMatches || !decisionAllowed;
      let resolution;
      try {
        resolution =
          record.kind === "exec"
            ? applyApprovalDecision({
                manager: params.execApprovalManager,
                id: record.id,
                decision: requestedDecision,
                forceMalformedDeny,
                resolver,
                localResolvedBy,
              })
            : applyApprovalDecision({
                manager: params.pluginApprovalManager,
                id: record.id,
                decision: requestedDecision,
                forceMalformedDeny,
                resolver,
                localResolvedBy,
              });
      } catch (error) {
        respondApprovalUnavailable({
          context,
          respond,
          operation: "resolve",
          error,
        });
        return;
      }
      if (!resolution.ok) {
        respondApprovalNotFound(respond);
        return;
      }
      const terminalRecord = resolution.record;
      if (terminalRecord.status === "pending") {
        respondApprovalNotFound(respond);
        return;
      }
      const approval = buildApprovalSnapshot(
        terminalRecord,
        normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath),
      );
      if (!approval) {
        respondApprovalNotFound(respond);
        return;
      }
      respond(
        true,
        {
          applied: resolution.applied,
          approval,
        },
        void 0,
      );
      if (resolution.applied && resolution.liveRecord)
        publishAppliedResolution({
          record: terminalRecord,
          liveRecord: resolution.liveRecord,
          context,
          forwarder: params.forwarder,
          iosPushDelivery: params.iosPushDelivery,
        }).catch((error) => {
          context.logGateway?.error?.(
            `${terminalRecord.kind} approvals: unified resolve publication failed: ${String(error)}`,
          );
        });
    },
  };
}
//#endregion
export { createApprovalHandlers };
