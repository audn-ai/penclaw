import { randomUUID } from "node:crypto";
import {
  a as handleApprovalWaitDecision,
  c as listVisiblePendingApprovalRequests,
  i as handleApprovalResolve,
  l as registerPendingApprovalRecord,
  n as bindApprovalReviewerDeviceIds,
  o as handlePendingApprovalRequest,
  r as buildRequestedApprovalEvent,
  t as bindApprovalRequesterMetadata,
  u as resolveApprovalDecisionParams,
} from "./approval-shared-BvKtvXwr.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-B7vhht0w.js";
import { d as resolvePluginApprovalTimeoutMs } from "./plugin-approvals-D2muXfhg.js";
import {
  mn as validatePluginApprovalResolveParams,
  pn as validatePluginApprovalRequestParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/plugin-approval.ts
/** Create plugin approval handlers backed by the shared approval manager. */
function createPluginApprovalHandlers(manager, opts) {
  return {
    "plugin.approval.list": async ({ respond, client }) => {
      respond(
        true,
        listVisiblePendingApprovalRequests({
          manager,
          client,
        }),
        void 0,
      );
    },
    "plugin.approval.request": async ({ params, client, respond, context }) => {
      if (!validatePluginApprovalRequestParams(params)) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            `invalid plugin.approval.request params: ${formatValidationErrors(validatePluginApprovalRequestParams.errors)}`,
          ),
        );
        return;
      }
      const p = params;
      const twoPhase = p.twoPhase === true;
      const timeoutMs = resolvePluginApprovalTimeoutMs(p.timeoutMs);
      const normalizeTrimmedString = (value) => normalizeOptionalString(value) || null;
      const request = {
        pluginId: p.pluginId ?? null,
        title: p.title,
        description: p.description,
        severity: p.severity ?? null,
        toolName: p.toolName ?? null,
        toolCallId: p.toolCallId ?? null,
        ...(Array.isArray(p.allowedDecisions)
          ? {
              allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({
                allowedDecisions: p.allowedDecisions,
              }),
            }
          : {}),
        agentId: p.agentId ?? null,
        sessionKey: p.sessionKey ?? null,
        turnSourceChannel: normalizeTrimmedString(p.turnSourceChannel),
        turnSourceTo: normalizeTrimmedString(p.turnSourceTo),
        turnSourceAccountId: normalizeTrimmedString(p.turnSourceAccountId),
        turnSourceThreadId: p.turnSourceThreadId ?? null,
      };
      const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
      bindApprovalRequesterMetadata({
        record,
        client,
      });
      if (client?.internal?.approvalRuntime === true)
        bindApprovalReviewerDeviceIds({
          record,
          deviceIds: p.approvalReviewerDeviceIds,
        });
      const decisionPromise = registerPendingApprovalRecord({
        manager,
        record,
        timeoutMs,
        respond,
        context,
      });
      if (!decisionPromise) return;
      const requestEvent = buildRequestedApprovalEvent(record);
      await handlePendingApprovalRequest({
        manager,
        record,
        decisionPromise,
        respond,
        context,
        clientConnId: client?.connId,
        requestEventName: "plugin.approval.requested",
        requestEvent,
        twoPhase,
        approvalKind: "plugin",
        deliverRequest: () => {
          if (!opts?.forwarder?.handlePluginApprovalRequested) return false;
          return opts.forwarder.handlePluginApprovalRequested(requestEvent).catch((err) => {
            context.logGateway?.error?.(`plugin approvals: forward request failed: ${String(err)}`);
            return false;
          });
        },
      });
    },
    "plugin.approval.waitDecision": async ({ params, respond, client }) => {
      await handleApprovalWaitDecision({
        manager,
        inputId: params.id,
        client,
        respond,
      });
    },
    "plugin.approval.resolve": async ({ params, respond, client, context }) => {
      const resolveParams = resolveApprovalDecisionParams({
        rawParams: params,
        validate: validatePluginApprovalResolveParams,
        methodName: "plugin.approval.resolve",
        respond,
      });
      if (!resolveParams) return;
      const { inputId, decision } = resolveParams;
      await handleApprovalResolve({
        manager,
        inputId,
        decision,
        respond,
        context,
        client,
        exposeAmbiguousPrefixError: false,
        validateDecision: (snapshot) =>
          resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request).includes(decision)
            ? null
            : {
                message: `${decision} is unavailable for this plugin approval`,
                details: {
                  allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(
                    snapshot.request,
                  ),
                },
              },
        resolvedEventName: "plugin.approval.resolved",
        buildResolvedEvent: ({
          approvalId,
          decision: decisionLocal,
          resolvedBy,
          snapshot,
          nowMs,
        }) => ({
          id: approvalId,
          decision: decisionLocal,
          resolvedBy,
          ts: nowMs,
          request: snapshot.request,
        }),
        forwardResolved: (resolvedEvent) =>
          opts?.forwarder?.handlePluginApprovalResolved?.(resolvedEvent),
        forwardResolvedErrorLabel: "plugin approvals: forward resolve failed",
      });
    },
  };
}
//#endregion
export { createPluginApprovalHandlers };
