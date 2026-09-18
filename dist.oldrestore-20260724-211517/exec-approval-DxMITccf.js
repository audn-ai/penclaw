import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as handleApprovalWaitDecision,
  c as listVisiblePendingApprovalRequests,
  f as resolvePendingApprovalRecord,
  i as handleApprovalResolve,
  l as registerPendingApprovalRecord,
  n as bindApprovalReviewerDeviceIds,
  o as handlePendingApprovalRequest,
  p as respondPendingApprovalLookupError,
  r as buildRequestedApprovalEvent,
  s as isApprovalRecordVisibleToClient,
  t as bindApprovalRequesterMetadata,
  u as resolveApprovalDecisionParams,
} from "./approval-shared-BvKtvXwr.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-Br1guPTt.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import {
  i as sanitizeExecApprovalWarningText,
  n as sanitizeExecApprovalDisplayText,
  r as sanitizeExecApprovalDisplayTextWithStatus,
  t as resolveExecApprovalCommandDisplay,
} from "./exec-approval-command-display-SUzu7-Pq.js";
import {
  C as normalizeExecApprovalUnavailableDecisions,
  H as resolveExecApprovalRequestAllowedDecisions,
  r as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS,
} from "./exec-approvals-Bz218bS2.js";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-B_HAylv-.js";
import { t as analyzeCommandForPolicy } from "./policy-BIrebRn7.js";
import {
  i as detectCommandCarrierArgv,
  o as detectInlineEvalInSegments,
} from "./risks-Bhlho1S0.js";
import {
  Ct as validateExecApprovalGetParams,
  Et as validateExecApprovalResolveParams,
  Tt as validateExecApprovalRequestParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { n as resolveSystemRunApprovalRequestContext } from "./system-run-approval-context-BHTEXCwP.js";
import {
  a as buildSystemRunApprovalEnvBinding,
  i as buildSystemRunApprovalBinding,
} from "./system-run-command-rsR6f6wc.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/infra/command-analysis/explain.ts
function riskLabel(risk) {
  switch (risk.kind) {
    case "inline-eval":
      return `${risk.command} ${risk.flag}`;
    case "shell-wrapper":
      return `${risk.executable} ${risk.flag}`;
    case "command-carrier":
      return risk.flag ? `${risk.command} ${risk.flag}` : risk.command;
    case "dynamic-argument":
      return `${risk.command} dynamic argument`;
    case "source":
      return risk.command;
    case "function-definition":
      return risk.name;
    default:
      return risk.kind;
  }
}
/** Summarizes parsed shell-command explanation data for display. */
function summarizeCommandExplanation(explanation) {
  const riskKinds = uniqueStrings(explanation.risks.map((risk) => risk.kind));
  const warningLines = explanation.risks.map((risk) => {
    const label = riskLabel(risk);
    return label === risk.kind ? `Contains ${risk.kind}` : `Contains ${risk.kind}: ${label}`;
  });
  return {
    commandCount: explanation.topLevelCommands.length,
    nestedCommandCount: explanation.nestedCommands.length,
    riskKinds,
    warningLines: uniqueStrings(warningLines),
  };
}
function summarizeCommandSegmentsForDisplay(segments) {
  const riskKinds = [];
  const warningLines = [];
  const inlineEval = detectInlineEvalInSegments(segments);
  if (inlineEval) {
    riskKinds.push("inline-eval");
    warningLines.push(
      `Contains inline-eval: ${inlineEval.normalizedExecutable} ${inlineEval.flag}`,
    );
  }
  for (const segment of segments) {
    const effectiveArgv = segment.resolution?.effectiveArgv ?? segment.argv;
    for (const hit of detectCommandCarrierArgv(effectiveArgv)) {
      riskKinds.push("command-carrier");
      warningLines.push(
        hit.flag
          ? `Contains command-carrier: ${hit.command} ${hit.flag}`
          : `Contains command-carrier: ${hit.command}`,
      );
    }
  }
  return {
    commandCount: segments.length,
    nestedCommandCount: 0,
    riskKinds: uniqueStrings(riskKinds),
    warningLines: uniqueStrings(warningLines),
  };
}
async function resolveCommandAnalysisSummaryForDisplay(params) {
  const summary =
    params.host === "node"
      ? (() => {
          if (!Array.isArray(params.commandArgv) || params.commandArgv.length === 0) return null;
          const analysis = analyzeCommandForPolicy({
            source: "argv",
            argv: params.commandArgv,
            cwd: params.cwd ?? void 0,
          });
          return analysis.ok ? summarizeCommandSegmentsForDisplay(analysis.segments) : null;
        })()
      : (await explainCommandForDisplay(params.commandText))?.summary;
  if (!summary) return null;
  const sanitizeText = params.sanitizeText;
  if (!sanitizeText) return summary;
  return {
    commandCount: summary.commandCount,
    nestedCommandCount: summary.nestedCommandCount,
    riskKinds: summary.riskKinds.map((kind) => sanitizeText(kind)),
    warningLines: summary.warningLines.map((line) => sanitizeText(line)),
  };
}
async function explainCommandForDisplay(command) {
  try {
    const { explainShellCommand } = await import("./extract-CJA_kE0u.js");
    const explanation = await explainShellCommand(command);
    return {
      explanation,
      summary: summarizeCommandExplanation(explanation),
    };
  } catch {
    return null;
  }
}
//#endregion
//#region src/gateway/server-methods/exec-approval.ts
const APPROVAL_ALLOW_ALWAYS_UNAVAILABLE_DETAILS = { reason: "APPROVAL_ALLOW_ALWAYS_UNAVAILABLE" };
const RESERVED_PLUGIN_APPROVAL_ID_PREFIX = "plugin:";
function normalizeCommandSpans(spans, commandLength) {
  if (!spans) return;
  const candidates = spans
    .filter(
      (span) =>
        Number.isSafeInteger(span.startIndex) &&
        Number.isSafeInteger(span.endIndex) &&
        span.startIndex >= 0 &&
        span.endIndex > span.startIndex &&
        span.endIndex <= commandLength,
    )
    .toSorted((a, b) => a.startIndex - b.startIndex || b.endIndex - a.endIndex);
  const accepted = [];
  let cursor = 0;
  for (const span of candidates) {
    if (span.startIndex < cursor) continue;
    accepted.push({
      startIndex: span.startIndex,
      endIndex: span.endIndex,
    });
    cursor = span.endIndex;
  }
  return accepted.length > 0 ? accepted : void 0;
}
function createExecApprovalHandlers(manager, opts) {
  return {
    "exec.approval.get": async ({ params, respond, client }) => {
      if (!validateExecApprovalGetParams(params)) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            `invalid exec.approval.get params: ${formatValidationErrors(validateExecApprovalGetParams.errors)}`,
          ),
        );
        return;
      }
      const resolved = resolvePendingApprovalRecord({
        manager,
        inputId: params.id,
        client,
        exposeAmbiguousPrefixError: true,
      });
      if (!resolved.ok) {
        respondPendingApprovalLookupError({
          respond,
          response: resolved.response,
        });
        return;
      }
      const { commandText, commandPreview } = resolveExecApprovalCommandDisplay(
        resolved.snapshot.request,
      );
      respond(
        true,
        {
          id: resolved.approvalId,
          commandText,
          commandPreview,
          allowedDecisions: resolveExecApprovalRequestAllowedDecisions(resolved.snapshot.request),
          host: resolved.snapshot.request.host ?? null,
          nodeId: resolved.snapshot.request.nodeId ?? null,
          agentId: resolved.snapshot.request.agentId ?? null,
          expiresAtMs: resolved.snapshot.expiresAtMs,
        },
        void 0,
      );
    },
    "exec.approval.list": async ({ respond, client }) => {
      respond(
        true,
        listVisiblePendingApprovalRequests({
          manager,
          client,
        }),
        void 0,
      );
    },
    "exec.approval.request": async ({ params, respond, context, client }) => {
      if (!validateExecApprovalRequestParams(params)) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            `invalid exec.approval.request params: ${formatValidationErrors(validateExecApprovalRequestParams.errors)}`,
          ),
        );
        return;
      }
      const p = params;
      const twoPhase = p.twoPhase === true;
      const timeoutMs =
        typeof p.timeoutMs === "number" ? p.timeoutMs : DEFAULT_EXEC_APPROVAL_TIMEOUT_MS;
      const explicitId = normalizeOptionalString(p.id) ?? null;
      const host = normalizeOptionalString(p.host) ?? "";
      const nodeId = normalizeOptionalString(p.nodeId) ?? "";
      const approvalContext = resolveSystemRunApprovalRequestContext({
        host,
        command: p.command,
        commandArgv: p.commandArgv,
        systemRunPlan: p.systemRunPlan,
        cwd: p.cwd,
        agentId: p.agentId,
        sessionKey: p.sessionKey,
      });
      const effectiveCommandArgv = approvalContext.commandArgv;
      const effectiveCwd = approvalContext.cwd;
      const effectiveAgentId = approvalContext.agentId;
      const effectiveSessionKey = approvalContext.sessionKey;
      const effectiveCommandText = approvalContext.commandText;
      if (host === "node" && !nodeId) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "nodeId is required for host=node"),
        );
        return;
      }
      if (host === "node" && !approvalContext.plan) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "systemRunPlan is required for host=node"),
        );
        return;
      }
      if (effectiveCommandText.trim().length === 0) {
        respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "command is required"));
        return;
      }
      if (explicitId?.startsWith(RESERVED_PLUGIN_APPROVAL_ID_PREFIX)) {
        respond(
          false,
          void 0,
          errorShape(
            ErrorCodes.INVALID_REQUEST,
            `approval ids starting with ${RESERVED_PLUGIN_APPROVAL_ID_PREFIX} are reserved`,
          ),
        );
        return;
      }
      if (
        host === "node" &&
        (!Array.isArray(effectiveCommandArgv) || effectiveCommandArgv.length === 0)
      ) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "commandArgv is required for host=node"),
        );
        return;
      }
      const envBinding = buildSystemRunApprovalEnvBinding(p.env);
      const warningText = normalizeOptionalString(p.warningText);
      const commandHighlighting = resolveExecCommandHighlighting({
        config: typeof context.getRuntimeConfig === "function" ? context.getRuntimeConfig() : {},
        agentId: effectiveAgentId,
      });
      const sanitizedCommandDisplay =
        sanitizeExecApprovalDisplayTextWithStatus(effectiveCommandText);
      if (sanitizedCommandDisplay.truncated || sanitizedCommandDisplay.oversized) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "command exceeds exec approval display limit", {
            details: { reason: "EXEC_APPROVAL_COMMAND_DISPLAY_LIMIT" },
          }),
        );
        return;
      }
      const sanitizedCommandText = sanitizedCommandDisplay.text;
      const commandAnalysis = await resolveCommandAnalysisSummaryForDisplay({
        host,
        commandText: effectiveCommandText,
        commandArgv: effectiveCommandArgv,
        cwd: effectiveCwd,
        sanitizeText: sanitizeExecApprovalWarningText,
      });
      const commandSpans =
        commandHighlighting && sanitizedCommandText === effectiveCommandText
          ? normalizeCommandSpans(p.commandSpans, sanitizedCommandText.length)
          : void 0;
      const systemRunBinding =
        host === "node"
          ? buildSystemRunApprovalBinding({
              argv: effectiveCommandArgv,
              cwd: effectiveCwd,
              agentId: effectiveAgentId,
              sessionKey: effectiveSessionKey,
              env: p.env,
            })
          : null;
      if (explicitId && manager.getSnapshot(explicitId)) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "approval id already pending"),
        );
        return;
      }
      const unavailableDecisions = normalizeExecApprovalUnavailableDecisions(
        p.unavailableDecisions,
      );
      const request = {
        command: sanitizedCommandText,
        commandPreview:
          host === "node" || !approvalContext.commandPreview
            ? void 0
            : sanitizeExecApprovalDisplayText(approvalContext.commandPreview),
        commandArgv: host === "node" ? void 0 : effectiveCommandArgv,
        envKeys: envBinding.envKeys.length > 0 ? envBinding.envKeys : void 0,
        systemRunBinding: systemRunBinding?.binding ?? null,
        systemRunPlan: approvalContext.plan,
        cwd: effectiveCwd ?? null,
        nodeId: host === "node" ? nodeId : null,
        host: host || null,
        security: p.security ?? null,
        ask: p.ask ?? null,
        warningText: warningText ? sanitizeExecApprovalWarningText(warningText) : null,
        commandAnalysis,
        commandSpans,
        unavailableDecisions: unavailableDecisions.length > 0 ? unavailableDecisions : void 0,
        allowedDecisions: resolveExecApprovalRequestAllowedDecisions({
          ask: p.ask ?? null,
          unavailableDecisions,
        }),
        agentId: effectiveAgentId ?? null,
        resolvedPath: p.resolvedPath ?? null,
        sessionKey: effectiveSessionKey ?? null,
        turnSourceChannel: normalizeOptionalString(p.turnSourceChannel) ?? null,
        turnSourceTo: normalizeOptionalString(p.turnSourceTo) ?? null,
        turnSourceAccountId: normalizeOptionalString(p.turnSourceAccountId) ?? null,
        turnSourceThreadId: p.turnSourceThreadId ?? null,
      };
      const record = manager.create(request, timeoutMs, explicitId);
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
        requestEventName: "exec.approval.requested",
        requestEvent,
        twoPhase,
        approvalKind: "exec",
        requireDeliveryRoute: p.requireDeliveryRoute,
        suppressDelivery: p.suppressDelivery,
        deliverRequest: () => {
          const deliveryTasks = [];
          if (opts?.forwarder)
            deliveryTasks.push(
              opts.forwarder.handleRequested(requestEvent).catch((err) => {
                context.logGateway?.error?.(
                  `exec approvals: forward request failed: ${String(err)}`,
                );
                return false;
              }),
            );
          if (opts?.iosPushDelivery?.handleRequested)
            deliveryTasks.push(
              opts.iosPushDelivery
                .handleRequested(requestEvent, {
                  isTargetVisible: (target) =>
                    isApprovalRecordVisibleToClient({
                      record,
                      client: {
                        connect: {
                          client: { id: GATEWAY_CLIENT_IDS.IOS_APP },
                          device: { id: target.deviceId },
                          scopes: [...target.scopes],
                        },
                      },
                    }),
                })
                .catch((err) => {
                  context.logGateway?.error?.(
                    `exec approvals: iOS push request failed: ${String(err)}`,
                  );
                  return false;
                }),
            );
          if (deliveryTasks.length === 0) return false;
          return (async () => {
            let delivered = false;
            for (const task of deliveryTasks) delivered = (await task) || delivered;
            return delivered;
          })();
        },
        afterDecision: async (decision) => {
          if (decision === null) await opts?.iosPushDelivery?.handleExpired?.(requestEvent);
        },
        afterDecisionErrorLabel: "exec approvals: iOS push expire failed",
      });
    },
    "exec.approval.waitDecision": async ({ params, respond, client }) => {
      await handleApprovalWaitDecision({
        manager,
        inputId: params.id,
        client,
        respond,
      });
    },
    "exec.approval.resolve": async ({ params, respond, client, context }) => {
      const resolveParams = resolveApprovalDecisionParams({
        rawParams: params,
        validate: validateExecApprovalResolveParams,
        methodName: "exec.approval.resolve",
        respond,
      });
      if (!resolveParams) return;
      const { inputId, decision } = resolveParams;
      let autoReviewResolution = false;
      await handleApprovalResolve({
        manager,
        inputId,
        decision,
        respond,
        context,
        client,
        exposeAmbiguousPrefixError: true,
        validateDecision: (snapshot) => {
          const autoReviewIdentity =
            client?.internal?.approvalRuntime === true
              ? client.internal.agentRuntimeIdentity
              : void 0;
          if (autoReviewIdentity) {
            const requestAgentId = normalizeAgentId(snapshot.request.agentId ?? void 0);
            const requestSessionKey = normalizeOptionalString(snapshot.request.sessionKey);
            if (
              decision !== "allow-once" ||
              snapshot.request.host !== "node" ||
              requestAgentId !== autoReviewIdentity.agentId ||
              requestSessionKey !== autoReviewIdentity.sessionKey
            )
              return {
                message: "auto-review approval identity does not match request",
                details: { reason: "AUTO_REVIEW_APPROVAL_IDENTITY_MISMATCH" },
              };
            autoReviewResolution = true;
          }
          return resolveExecApprovalRequestAllowedDecisions(snapshot.request).includes(decision)
            ? null
            : {
                message: "allow-always is unavailable for this command",
                details: APPROVAL_ALLOW_ALWAYS_UNAVAILABLE_DETAILS,
              };
        },
        resolveRecord: ({ approvalId, decision: decisionLocal, resolvedBy }) =>
          autoReviewResolution
            ? manager.resolveAutoReview(approvalId, resolvedBy)
            : manager.resolve(approvalId, decisionLocal, resolvedBy),
        resolvedEventName: "exec.approval.resolved",
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
        forwardResolved: (resolvedEvent) => opts?.forwarder?.handleResolved(resolvedEvent),
        forwardResolvedErrorLabel: "exec approvals: forward resolve failed",
        extraResolvedHandlers: opts?.iosPushDelivery?.handleResolved
          ? [
              {
                run: (resolvedEvent) => opts.iosPushDelivery.handleResolved(resolvedEvent),
                errorLabel: "exec approvals: iOS push resolve failed",
              },
            ]
          : void 0,
      });
    },
  };
}
//#endregion
export { createExecApprovalHandlers };
