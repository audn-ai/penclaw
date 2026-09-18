import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { i as resolveApprovalInitiatingSurfaceState } from "./exec-approval-surface-B6pFXhj3.js";
import "./config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./method-scopes-DrxGpKMT.js";
import { n as APPROVALS_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/infra/approval-turn-source.ts
/** Returns whether approval replies can route back to the turn's initiating surface. */
function hasApprovalTurnSourceRoute(params) {
  if (!params.turnSourceChannel?.trim()) return false;
  return (
    resolveApprovalInitiatingSurfaceState({
      channel: params.turnSourceChannel,
      accountId: params.turnSourceAccountId,
      cfg: getRuntimeConfig(),
      approvalKind: params.approvalKind ?? "exec",
    }).kind === "enabled"
  );
}
//#endregion
//#region src/gateway/server-methods/approval-shared.ts
const APPROVAL_NOT_FOUND_DETAILS = {
  reason: ErrorCodes.APPROVAL_NOT_FOUND,
  remediation: "Re-request the action; pending approvals are cleared after expiry or restart.",
};
const APPROVAL_ALREADY_RESOLVED_DETAILS = { reason: "APPROVAL_ALREADY_RESOLVED" };
function resolveRecordedApprovalDecision(record) {
  return record.decision ?? record.consumedDecision;
}
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isApprovalDecision(value) {
  return value === "allow-once" || value === "allow-always" || value === "deny";
}
function respondUnknownOrExpiredApproval(respond) {
  respond(
    false,
    void 0,
    errorShape(ErrorCodes.INVALID_REQUEST, "unknown or expired approval id", {
      details: APPROVAL_NOT_FOUND_DETAILS,
    }),
  );
}
function resolvePendingApprovalLookupError(params) {
  if (params.resolvedId.kind === "none") return "missing";
  if (params.resolvedId.kind === "ambiguous" && !params.exposeAmbiguousPrefixError)
    return "missing";
  return {
    code: ErrorCodes.INVALID_REQUEST,
    message: "ambiguous approval id prefix; use the full id",
  };
}
function normalizeApprovalIdentity(value) {
  return normalizeOptionalString(value) ?? null;
}
function normalizeApprovalIdentities(values) {
  const normalized = /* @__PURE__ */ new Set();
  for (const value of values ?? []) {
    const identity = normalizeApprovalIdentity(value);
    if (identity) normalized.add(identity);
  }
  return [...normalized];
}
/** Checks whether a client can observe or resolve an approval record. */
function isApprovalRecordVisibleToClient(params) {
  const scopes = Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : [];
  if (scopes.includes("operator.admin")) return true;
  const requestedByDeviceId = normalizeApprovalIdentity(params.record.requestedByDeviceId);
  const requestedByClientId = normalizeApprovalIdentity(params.record.requestedByClientId);
  const hasApprovalsScope = scopes.includes(APPROVALS_SCOPE);
  if (hasApprovalsScope && params.client?.internal?.approvalRuntime === true) return true;
  const approvalReviewerDeviceIds = normalizeApprovalIdentities(
    params.record.approvalReviewerDeviceIds,
  );
  const clientDeviceId = normalizeApprovalIdentity(params.client?.connect?.device?.id);
  if (hasApprovalsScope && clientDeviceId && approvalReviewerDeviceIds.includes(clientDeviceId))
    return true;
  if (requestedByDeviceId) return requestedByDeviceId === clientDeviceId;
  const requestedByConnId = normalizeApprovalIdentity(params.record.requestedByConnId);
  if (requestedByConnId)
    return requestedByConnId === normalizeApprovalIdentity(params.client?.connId);
  if (requestedByClientId || approvalReviewerDeviceIds.length > 0) return false;
  return true;
}
/** Returns only pending approval requests the connected client is allowed to see. */
function listVisiblePendingApprovalRequests(params) {
  return params.manager
    .listPendingRecords()
    .filter((record) =>
      isApprovalRecordVisibleToClient({
        record,
        client: params.client ?? null,
      }),
    )
    .map((record) => ({
      id: record.id,
      request: record.request,
      createdAtMs: record.createdAtMs,
      expiresAtMs: record.expiresAtMs,
    }));
}
/** Binds the current gateway client identity onto a newly-created approval record. */
function bindApprovalRequesterMetadata(params) {
  params.record.requestedByConnId = params.client?.connId ?? null;
  params.record.requestedByDeviceId = params.client?.connect?.device?.id ?? null;
  params.record.requestedByClientId = params.client?.connect?.client?.id ?? null;
  params.record.requestedByDeviceTokenAuth = params.client?.isDeviceTokenAuth === true;
}
function bindApprovalReviewerDeviceIds(params) {
  const deviceIds = normalizeApprovalIdentities(params.deviceIds);
  if (deviceIds.length > 0) params.record.approvalReviewerDeviceIds = deviceIds;
}
function respondApprovalStorageUnavailable(params) {
  params.context.logGateway?.error?.(
    `approval ${params.operation} storage failure: ${String(params.error)}`,
  );
  params.respond(
    false,
    void 0,
    errorShape(ErrorCodes.UNAVAILABLE, `approval ${params.operation} unavailable`),
  );
}
/** Registers an approval record and converts manager registration errors to gateway errors. */
function registerPendingApprovalRecord(params) {
  try {
    return params.manager.register(params.record, params.timeoutMs);
  } catch (err) {
    respondApprovalStorageUnavailable({
      ...params,
      operation: "request",
      error: err,
    });
    return;
  }
}
/** Builds the gateway event payload broadcast when an approval starts waiting. */
function buildRequestedApprovalEvent(record) {
  return {
    id: record.id,
    request: record.request,
    createdAtMs: record.createdAtMs,
    expiresAtMs: record.expiresAtMs,
  };
}
/** Validates approval resolve params and narrows the decision to the supported enum. */
function resolveApprovalDecisionParams(params) {
  const rawParams = params.rawParams;
  if (!params.validate(rawParams)) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `invalid ${params.methodName} params: ${formatValidationErrors(params.validate.errors)}`,
      ),
    );
    return null;
  }
  if (!isApprovalDecision(rawParams.decision)) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid decision"));
    return null;
  }
  return {
    inputId: rawParams.id,
    decision: rawParams.decision,
  };
}
/** Resolves the approval clients that should receive request or resolution events. */
function resolveApprovalRequestRecipientConnIds(params) {
  return (
    params.context.getApprovalClientConnIds?.({
      excludeConnId: params.excludeConnId,
      record: params.record,
      filter: (client) =>
        isApprovalRecordVisibleToClient({
          record: params.record,
          client,
        }),
    }) ?? null
  );
}
/** Finds a pending approval by full id or prefix after applying client visibility rules. */
function resolvePendingApprovalRecord(params) {
  return resolveApprovalRecordForState(params, "pending");
}
function resolveResolvedApprovalRecord(params) {
  return resolveApprovalRecordForState(params, "resolved");
}
function resolveApprovalRecordForState(params, expectedState) {
  const resolvedId = params.manager.lookupApprovalId(params.inputId, {
    includeResolved: expectedState === "resolved",
    filter: (record) =>
      isApprovalRecordVisibleToClient({
        record,
        client: params.client ?? null,
      }),
  });
  if (resolvedId.kind !== "exact" && resolvedId.kind !== "prefix")
    return {
      ok: false,
      response: resolvePendingApprovalLookupError({
        resolvedId,
        exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
      }),
    };
  const snapshot = params.manager.getSnapshot(resolvedId.id);
  const isResolved = snapshot?.resolvedAtMs !== void 0;
  if (!snapshot || isResolved !== (expectedState === "resolved"))
    return {
      ok: false,
      response: "missing",
    };
  return {
    ok: true,
    approvalId: resolvedId.id,
    snapshot,
  };
}
/** Sends the public lookup failure shape for missing, expired, or ambiguous approvals. */
function respondPendingApprovalLookupError(params) {
  if (params.response === "missing") {
    respondUnknownOrExpiredApproval(params.respond);
    return;
  }
  params.respond(false, void 0, errorShape(params.response.code, params.response.message));
}
/** Waits for an already-registered approval decision visible to the caller. */
async function handleApprovalWaitDecision(params) {
  const id = normalizeOptionalString(params.inputId) ?? "";
  if (!id) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "id is required"));
    return;
  }
  const snapshot = params.manager.getSnapshot(id);
  if (
    !snapshot ||
    !isApprovalRecordVisibleToClient({
      record: snapshot,
      client: params.client ?? null,
    })
  ) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"),
    );
    return;
  }
  const decisionPromise = params.manager.awaitDecision(id);
  if (!decisionPromise) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"),
    );
    return;
  }
  const decision = await decisionPromise;
  params.respond(
    true,
    {
      id,
      decision,
      createdAtMs: snapshot?.createdAtMs,
      expiresAtMs: snapshot?.expiresAtMs,
    },
    void 0,
  );
}
/** Broadcasts or routes a pending approval request, then responds after acceptance/decision. */
async function handlePendingApprovalRequest(params) {
  const releaseHandoff = params.manager.retainForHandoff(params.record.id);
  try {
    const suppressDelivery = params.suppressDelivery === true;
    const approvalClientConnIds = suppressDelivery
      ? null
      : resolveApprovalRequestRecipientConnIds({
          context: params.context,
          record: params.record,
          excludeConnId: params.clientConnId,
        });
    if (!suppressDelivery)
      if (approvalClientConnIds)
        params.context.broadcastToConnIds(
          params.requestEventName,
          params.requestEvent,
          approvalClientConnIds,
          { dropIfSlow: true },
        );
      else
        params.context.broadcast(params.requestEventName, params.requestEvent, {
          dropIfSlow: true,
        });
    const hasApprovalClients = suppressDelivery
      ? false
      : approvalClientConnIds !== null
        ? approvalClientConnIds.size > 0
        : (params.context.hasExecApprovalClients?.(params.clientConnId) ?? false);
    const deliveredResult = suppressDelivery ? false : params.deliverRequest();
    const delivered = isPromiseLike(deliveredResult) ? await deliveredResult : deliveredResult;
    const hasTurnSourceRoute =
      !hasApprovalClients &&
      !delivered &&
      hasApprovalTurnSourceRoute({
        turnSourceChannel: params.record.request.turnSourceChannel,
        turnSourceAccountId: params.record.request.turnSourceAccountId,
        approvalKind: params.approvalKind ?? "exec",
      });
    const deliveryRoute = delivered
      ? "forwarder"
      : hasApprovalClients
        ? "approval-client"
        : hasTurnSourceRoute
          ? "turn-source"
          : "none";
    const respondWithDecision = async (decision) => {
      if (params.afterDecision)
        try {
          await params.afterDecision(decision, params.requestEvent);
        } catch (err) {
          params.context.logGateway?.error?.(
            `${params.afterDecisionErrorLabel ?? "approval follow-up failed"}: ${String(err)}`,
          );
        }
      params.respond(
        true,
        {
          id: params.record.id,
          decision,
          createdAtMs: params.record.createdAtMs,
          expiresAtMs: params.record.expiresAtMs,
        },
        void 0,
      );
    };
    if (
      params.requireDeliveryRoute !== false &&
      !params.keepPendingWithoutRoute &&
      !hasApprovalClients &&
      !hasTurnSourceRoute &&
      !delivered
    ) {
      let noRouteWon;
      try {
        noRouteWon = params.manager.expire(params.record.id, "no-approval-route");
      } catch (err) {
        respondApprovalStorageUnavailable({
          ...params,
          operation: "request",
          error: err,
        });
        return;
      }
      if (!noRouteWon) {
        await respondWithDecision(await params.decisionPromise);
        return;
      }
      params.respond(
        true,
        {
          id: params.record.id,
          decision: null,
          createdAtMs: params.record.createdAtMs,
          expiresAtMs: params.record.expiresAtMs,
        },
        void 0,
      );
      return;
    }
    if (params.twoPhase)
      params.respond(
        true,
        {
          status: "accepted",
          id: params.record.id,
          deliveryRoute,
          createdAtMs: params.record.createdAtMs,
          expiresAtMs: params.record.expiresAtMs,
        },
        void 0,
      );
    await respondWithDecision(await params.decisionPromise);
  } finally {
    releaseHandoff?.();
  }
}
/** Resolves a pending approval and broadcasts the final decision exactly once. */
async function handleApprovalResolve(params) {
  let resolved;
  try {
    resolved = resolvePendingApprovalRecord({
      manager: params.manager,
      inputId: params.inputId,
      client: params.client,
      exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
    });
  } catch (err) {
    respondApprovalStorageUnavailable({
      ...params,
      operation: "resolve",
      error: err,
    });
    return;
  }
  if (!resolved.ok) {
    let resolvedRepeat;
    try {
      resolvedRepeat = resolveResolvedApprovalRecord({
        manager: params.manager,
        inputId: params.inputId,
        client: params.client,
        exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
      });
    } catch (err) {
      respondApprovalStorageUnavailable({
        ...params,
        operation: "resolve",
        error: err,
      });
      return;
    }
    if (resolvedRepeat.ok) {
      if (resolveRecordedApprovalDecision(resolvedRepeat.snapshot) === params.decision) {
        params.respond(true, { ok: true }, void 0);
        return;
      }
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "approval already resolved", {
          details: APPROVAL_ALREADY_RESOLVED_DETAILS,
        }),
      );
      return;
    }
    respondPendingApprovalLookupError({
      respond: params.respond,
      response: resolved.response,
    });
    return;
  }
  const validationError = params.validateDecision?.(resolved.snapshot);
  if (validationError) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        validationError.message,
        validationError.details ? { details: validationError.details } : void 0,
      ),
    );
    return;
  }
  const resolvedBy =
    params.client?.connect?.client?.displayName ?? params.client?.connect?.client?.id ?? null;
  let ok;
  try {
    ok = params.resolveRecord
      ? params.resolveRecord({
          approvalId: resolved.approvalId,
          decision: params.decision,
          resolvedBy,
          snapshot: resolved.snapshot,
        })
      : params.manager.resolve(resolved.approvalId, params.decision, resolvedBy);
  } catch (err) {
    respondApprovalStorageUnavailable({
      ...params,
      operation: "resolve",
      error: err,
    });
    return;
  }
  if (!ok) {
    const raced = params.manager.getSnapshot(resolved.approvalId);
    if (raced && raced.resolvedAtMs !== void 0) {
      if (resolveRecordedApprovalDecision(raced) === params.decision) {
        params.respond(true, { ok: true }, void 0);
        return;
      }
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "approval already resolved", {
          details: APPROVAL_ALREADY_RESOLVED_DETAILS,
        }),
      );
      return;
    }
    respondUnknownOrExpiredApproval(params.respond);
    return;
  }
  const resolvedEvent = params.buildResolvedEvent({
    approvalId: resolved.approvalId,
    decision: params.decision,
    resolvedBy,
    snapshot: resolved.snapshot,
    nowMs: Date.now(),
  });
  const resolvedEventConnIds = resolveApprovalRequestRecipientConnIds({
    context: params.context,
    record: resolved.snapshot,
  });
  if (resolvedEventConnIds)
    params.context.broadcastToConnIds(
      params.resolvedEventName,
      resolvedEvent,
      resolvedEventConnIds,
      { dropIfSlow: true },
    );
  else params.context.broadcast(params.resolvedEventName, resolvedEvent, { dropIfSlow: true });
  const followUps = [
    params.forwardResolved
      ? {
          run: params.forwardResolved,
          errorLabel: params.forwardResolvedErrorLabel ?? "approval resolve follow-up failed",
        }
      : null,
    ...(params.extraResolvedHandlers ?? []),
  ].filter((entry) => Boolean(entry));
  for (const followUp of followUps)
    try {
      await followUp.run(resolvedEvent);
    } catch (err) {
      params.context.logGateway?.error?.(`${followUp.errorLabel}: ${String(err)}`);
    }
  params.respond(true, { ok: true }, void 0);
}
//#endregion
export {
  handleApprovalWaitDecision as a,
  listVisiblePendingApprovalRequests as c,
  resolveApprovalRequestRecipientConnIds as d,
  resolvePendingApprovalRecord as f,
  handleApprovalResolve as i,
  registerPendingApprovalRecord as l,
  bindApprovalReviewerDeviceIds as n,
  handlePendingApprovalRequest as o,
  respondPendingApprovalLookupError as p,
  buildRequestedApprovalEvent as r,
  isApprovalRecordVisibleToClient as s,
  bindApprovalRequesterMetadata as t,
  resolveApprovalDecisionParams as u,
};
